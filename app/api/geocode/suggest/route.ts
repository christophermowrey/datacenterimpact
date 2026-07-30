import { NextResponse } from 'next/server'
import { getCoverageStatus } from '@/lib/geo'
import { requestRateLimit } from '@/lib/rate-limit'

type NominatimResult = { lat: string; lon: string; display_name: string; type?: string; addresstype?: string; address?: { city?: string; town?: string; village?: string; state?: string; postcode?: string } }
type ArcGISCandidate = { address?: string; location?: { x?: number; y?: number }; score?: number; attributes?: { Addr_type?: string } }

function googleSuggestions(query: string) {
  const key = process.env.GOOGLE_MAPS_API_KEY
  if (!key) return null
  const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json')
  url.searchParams.set('input', query)
  url.searchParams.set('components', 'country:us')
  url.searchParams.set('location', '29.7604,-95.3698')
  url.searchParams.set('radius', '180000')
  url.searchParams.set('key', key)
  return fetch(url, { signal: AbortSignal.timeout(8000), next: { revalidate: 300 } }).then((response) => response.json() as Promise<{ status: string; predictions?: { place_id: string; description: string; structured_formatting?: { main_text: string } }[] }>)
}

function arcgisSuggestions(query: string) {
  const url = new URL('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates')
  url.searchParams.set('SingleLine', query)
  url.searchParams.set('countryCode', 'USA')
  url.searchParams.set('outFields', 'Addr_type')
  url.searchParams.set('maxLocations', '8')
  url.searchParams.set('f', 'json')
  return fetch(url, { headers: { 'User-Agent': 'DataCenterImpact/0.1' }, signal: AbortSignal.timeout(8000), next: { revalidate: 300 } }).then((response) => response.json() as Promise<{ candidates?: ArcGISCandidate[] }>)
}

export async function GET(request: Request) {
  const rate = requestRateLimit(request, 'suggest', 60)
  if (!rate.allowed) return NextResponse.json({ suggestions: [], error: 'Too many suggestions requests. Try again shortly.' }, { status: 429, headers: { 'Retry-After': rate.retryAfter.toString() } })
  const query = new URL(request.url).searchParams.get('q')?.trim()
  if (!query || query.length < 3 || query.length > 200) return NextResponse.json({ suggestions: [] })
  const provider = (process.env.GEOCODER_PROVIDER || 'nominatim').toLowerCase()
  if (provider !== 'nominatim' && provider !== 'google') return NextResponse.json({ suggestions: [], error: 'The configured geocoder is not supported by this deployment.' }, { status: 503 })
  if (provider === 'google' && !process.env.GOOGLE_MAPS_API_KEY) return NextResponse.json({ suggestions: [], error: 'Google autocomplete is not configured.' }, { status: 503 })
  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('limit', '8')
  url.searchParams.set('countrycodes', 'us')
  url.searchParams.set('viewbox', '-106.65,36.5,-93.5,25.8')
  url.searchParams.set('bounded', '0')
  const explicitState = /\b(texas|tx|california|ca|florida|fl|new york|ny|maryland|md|minnesota|mn)\b/i.test(query)
  const looksLikeAddress = /\d/.test(query)
  const searchQuery = looksLikeAddress && !explicitState ? `${query}, Texas` : query
  url.searchParams.set('q', searchQuery)
  const isPlaceOnlyQuery = /^[a-zA-Z .'-]+$/.test(query) && query.split(/\s+/).length <= 3
  const fetchResults = async (searchUrl: URL) => {
    const response = await fetch(searchUrl, { headers: { 'User-Agent': 'DataCenterImpact/0.1 local development' }, signal: AbortSignal.timeout(8000), next: { revalidate: 300 } })
    if (!response.ok) throw new Error('geocoder unavailable')
    return response.json() as Promise<NominatimResult[]>
  }
  try {
    const google = await googleSuggestions(query)
    if (provider === 'google' && google) {
      if (google.status === 'OK' || google.status === 'ZERO_RESULTS') {
        return NextResponse.json({ suggestions: (google.predictions ?? []).map((prediction) => ({ label: prediction.description, shortLabel: prediction.structured_formatting?.main_text ?? prediction.description, kind: 'place', coverage: 'unknown', source: 'google', placeId: prediction.place_id })) })
      }
      return NextResponse.json({ suggestions: [], error: 'Google autocomplete is temporarily unavailable.' }, { status: 502 })
    }
    const results = await fetchResults(url)
    if (isPlaceOnlyQuery && !results.some((result) => result.address?.state?.toLowerCase() !== 'texas')) {
      const broaderUrl = new URL(url)
      broaderUrl.searchParams.delete('viewbox')
      broaderUrl.searchParams.delete('bounded')
      results.push(...await fetchResults(broaderUrl))
    }
    let addressResults: ArcGISCandidate[] = []
    if (looksLikeAddress && !results.some((result) => result.addresstype === 'place' || result.addresstype === 'house' || result.addresstype === 'building')) {
      const arcgis = await arcgisSuggestions(searchQuery)
      addressResults = (arcgis.candidates ?? []).filter((candidate) => candidate.location?.x !== undefined && candidate.location?.y !== undefined)
    }
    if (addressResults.length > 0) {
      return NextResponse.json({ suggestions: addressResults.map((candidate) => ({ latitude: candidate.location?.y, longitude: candidate.location?.x, label: candidate.address ?? query, shortLabel: candidate.address ?? query, kind: candidate.attributes?.Addr_type ?? 'address', coverage: getCoverageStatus(candidate.location!.y!, candidate.location!.x!), source: 'arcgis' })) })
    }
    const suggestions = results
      .map((result) => {
        const latitude = Number(result.lat)
        const longitude = Number(result.lon)
        const city = result.address?.city ?? result.address?.town ?? result.address?.village ?? ''
        const state = result.address?.state ?? ''
        const isTexas = state.toLowerCase() === 'texas'
        return { latitude, longitude, label: result.display_name, shortLabel: [city, state, result.address?.postcode].filter(Boolean).join(', '), kind: result.addresstype ?? result.type ?? 'place', coverage: getCoverageStatus(latitude, longitude), source: 'openstreetmap', precision: result.addresstype === 'postcode' ? 'zip_centroid' : result.addresstype === 'city' || result.addresstype === 'town' || result.addresstype === 'village' ? 'municipality_boundary' : 'exact_address', isTexas }
      })
      .filter((suggestion, index, all) => all.findIndex((candidate) => Math.abs(candidate.latitude - suggestion.latitude) < 0.0001 && Math.abs(candidate.longitude - suggestion.longitude) < 0.0001) === index)
      .sort((a, b) => Number(b.isTexas) - Number(a.isTexas))
      .map(({ isTexas: _isTexas, ...suggestion }) => suggestion)
    return NextResponse.json({ suggestions })
  } catch {
    return NextResponse.json({ suggestions: [], error: 'Suggestions could not be loaded.' }, { status: 502 })
  }
}

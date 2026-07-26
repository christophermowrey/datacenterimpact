import { NextResponse } from 'next/server'
import { getCoverageStatus } from '@/lib/geo'
import { requestRateLimit } from '@/lib/rate-limit'

type NominatimResult = { lat: string; lon: string; display_name: string; type?: string; addresstype?: string; address?: { city?: string; town?: string; village?: string; state?: string; postcode?: string } }

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

export async function GET(request: Request) {
  const rate = requestRateLimit(request, 'suggest', 60)
  if (!rate.allowed) return NextResponse.json({ suggestions: [], error: 'Too many suggestions requests. Try again shortly.' }, { status: 429, headers: { 'Retry-After': rate.retryAfter.toString() } })
  const query = new URL(request.url).searchParams.get('q')?.trim()
  if (!query || query.length < 3 || query.length > 200) return NextResponse.json({ suggestions: [] })
  if ((process.env.GEOCODER_PROVIDER || 'nominatim').toLowerCase() !== 'nominatim') return NextResponse.json({ suggestions: [], error: 'The configured geocoder is not supported by this deployment.' }, { status: 503 })
  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('limit', '8')
  url.searchParams.set('countrycodes', 'us')
  url.searchParams.set('viewbox', '-106.65,36.5,-93.5,25.8')
  url.searchParams.set('bounded', '0')
  url.searchParams.set('q', query)
  const isPlaceOnlyQuery = /^[a-zA-Z .'-]+$/.test(query) && query.split(/\s+/).length <= 3
  const fetchResults = async (searchUrl: URL) => {
    const response = await fetch(searchUrl, { headers: { 'User-Agent': 'DataCenterImpact/0.1 local development' }, signal: AbortSignal.timeout(8000), next: { revalidate: 300 } })
    if (!response.ok) throw new Error('geocoder unavailable')
    return response.json() as Promise<NominatimResult[]>
  }
  try {
    const google = await googleSuggestions(query)
    if (google) {
      if (google.status === 'OK' || google.status === 'ZERO_RESULTS') {
        return NextResponse.json({ suggestions: (google.predictions ?? []).map((prediction) => ({ label: prediction.description, shortLabel: prediction.structured_formatting?.main_text ?? prediction.description, kind: 'place', coverage: 'unknown', source: 'google', placeId: prediction.place_id })) })
      }
    }
    const results = await fetchResults(url)
    if (isPlaceOnlyQuery && !results.some((result) => result.address?.state?.toLowerCase() !== 'texas')) {
      const broaderUrl = new URL(url)
      broaderUrl.searchParams.delete('viewbox')
      broaderUrl.searchParams.delete('bounded')
      results.push(...await fetchResults(broaderUrl))
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

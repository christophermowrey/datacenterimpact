import { NextResponse } from 'next/server'
import { getCoverageStatus } from '@/lib/geo'
import { requestRateLimit } from '@/lib/rate-limit'

type NominatimResult = { lat: string; lon: string; display_name: string; addresstype?: string }
type GoogleResult = { formatted_address?: string; geometry?: { location?: { lat: number; lng: number } } }
type ArcGISCandidate = { address?: string; location?: { x?: number; y?: number }; attributes?: { Addr_type?: string } }

const precisionFor = (result: NominatimResult) => result.addresstype === 'postcode' ? 'zip_centroid' : result.addresstype === 'city' || result.addresstype === 'town' || result.addresstype === 'village' || result.addresstype === 'suburb' || result.addresstype === 'locality' ? 'municipality_boundary' : result.addresstype === 'road' ? 'place_label' : 'exact_address'

async function googleGeocode(query: string, key: string) {
  const url = new URL('https://maps.googleapis.com/maps/api/geocode/json')
  url.searchParams.set('address', query)
  url.searchParams.set('components', 'country:US')
  url.searchParams.set('bounds', '25.8,-106.65|36.5,-93.5')
  url.searchParams.set('key', key)
  const response = await fetch(url, { signal: AbortSignal.timeout(8000), next: { revalidate: 3600 } })
  return response.json() as Promise<{ status: string; results?: GoogleResult[] }>
}

async function arcgisGeocode(query: string) {
  const url = new URL('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates')
  url.searchParams.set('SingleLine', query)
  url.searchParams.set('countryCode', 'USA')
  url.searchParams.set('outFields', 'Addr_type')
  url.searchParams.set('maxLocations', '1')
  url.searchParams.set('f', 'json')
  const response = await fetch(url, { headers: { 'User-Agent': 'DataCenterImpact/0.1' }, signal: AbortSignal.timeout(8000), next: { revalidate: 3600 } })
  const payload = await response.json() as { candidates?: ArcGISCandidate[] }
  const candidate = payload.candidates?.[0]
  return candidate?.location?.x !== undefined && candidate.location.y !== undefined ? candidate : null
}

export async function GET(request: Request) {
  const rate = requestRateLimit(request, 'geocode', 30)
  if (!rate.allowed) return NextResponse.json({ error: 'Too many location searches. Try again shortly.' }, { status: 429, headers: { 'Retry-After': rate.retryAfter.toString() } })
  const query = new URL(request.url).searchParams.get('q')?.trim()
  if (!query || query.length < 3 || query.length > 200) return NextResponse.json({ error: 'Enter a location between 3 and 200 characters.' }, { status: 400 })
  const provider = (process.env.GEOCODER_PROVIDER || 'nominatim').toLowerCase()
  if (provider === 'google') {
    const key = process.env.GOOGLE_MAPS_API_KEY
    if (!key) return NextResponse.json({ error: 'Google geocoding is not configured.' }, { status: 503 })
    try {
      const payload = await googleGeocode(query, key)
      const location = payload.results?.[0]?.geometry?.location
      if (payload.status !== 'OK' || !location) return NextResponse.json({ result: null, failure: 'no_location_found' })
      return NextResponse.json({ result: { latitude: location.lat, longitude: location.lng, label: payload.results?.[0]?.formatted_address ?? query, coverage: getCoverageStatus(location.lat, location.lng), source: 'google', precision: 'exact_address' } })
    } catch {
      return NextResponse.json({ error: 'The geocoding service is temporarily unavailable.' }, { status: 502 })
    }
  }
  if (provider !== 'nominatim') return NextResponse.json({ error: 'The configured geocoder is not supported by this deployment.' }, { status: 503 })

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('limit', '1')
  url.searchParams.set('countrycodes', 'us')
  url.searchParams.set('viewbox', '-106.65,36.5,-93.5,25.8')
  url.searchParams.set('bounded', '0')
  const explicitState = /\b(texas|tx|california|ca|florida|fl|new york|ny|maryland|md|minnesota|mn)\b/i.test(query)
  const looksLikeAddress = /\d/.test(query)
   const searchQuery = looksLikeAddress && !explicitState ? `${query}, Texas` : query
  url.searchParams.set('q', searchQuery)
  try {
      const response = await fetch(url, { headers: { 'User-Agent': 'DataCenterImpact/0.1 local development contact@localhost' }, signal: AbortSignal.timeout(8000), next: { revalidate: 3600 } })
    if (!response.ok) return NextResponse.json({ error: 'The geocoding service is temporarily unavailable.' }, { status: 502 })
   const results = await response.json() as NominatimResult[]
   let result = results[0]
    let fallbackReason: 'exact_address_not_found' | undefined
    if (!result) {
      const parts = query.split(',').map((part) => part.trim()).filter(Boolean)
      const localityQuery = parts.length > 1 ? parts.slice(1).join(', ') : ''
     if (localityQuery) {
        const fallbackUrl = new URL(url)
        fallbackUrl.searchParams.set('q', localityQuery)
        const fallbackResponse = await fetch(fallbackUrl, { headers: { 'User-Agent': 'DataCenterImpact/0.1 local development contact@localhost' }, signal: AbortSignal.timeout(8000), next: { revalidate: 3600 } })
        if (fallbackResponse.ok) {
          const fallbackResults = await fallbackResponse.json() as NominatimResult[]
          result = fallbackResults[0]
          if (result) fallbackReason = 'exact_address_not_found'
     }
   }
    if (looksLikeAddress && (!result || !['place', 'house', 'building'].includes(result.addresstype ?? ''))) {
      const arcgis = await arcgisGeocode(searchQuery)
      if (arcgis?.location?.x !== undefined && arcgis.location.y !== undefined) {
        return NextResponse.json({ result: { latitude: arcgis.location.y, longitude: arcgis.location.x, label: arcgis.address ?? query, coverage: getCoverageStatus(arcgis.location.y, arcgis.location.x), source: 'arcgis', precision: 'exact_address' } })
      }
    }
    if (!result) return NextResponse.json({ result: null, failure: 'no_location_found' })
    const latitude = Number(result.lat)
    const longitude = Number(result.lon)
    if (looksLikeAddress && !explicitState && getCoverageStatus(latitude, longitude) === 'outside') return NextResponse.json({ result: null, failure: 'no_location_found' })
    return NextResponse.json({ result: { latitude, longitude, label: result.display_name, coverage: getCoverageStatus(latitude, longitude), source: 'openstreetmap', precision: precisionFor(result), fallbackReason } })
    }
  } catch {
    return NextResponse.json({ error: 'The location search could not be completed.' }, { status: 502 })
  }
}

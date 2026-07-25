import { NextResponse } from 'next/server'
import { getCoverageStatus } from '@/lib/geo'

type NominatimResult = { lat: string; lon: string; display_name: string; addresstype?: string }

const precisionFor = (result: NominatimResult) => result.addresstype === 'postcode' ? 'zip_centroid' : result.addresstype === 'city' || result.addresstype === 'town' || result.addresstype === 'village' || result.addresstype === 'suburb' || result.addresstype === 'locality' ? 'municipality_boundary' : result.addresstype === 'road' ? 'place_label' : 'exact_address'

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q')?.trim()
  if (!query || query.length < 3 || query.length > 200) return NextResponse.json({ error: 'Enter a location between 3 and 200 characters.' }, { status: 400 })

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('limit', '1')
  url.searchParams.set('countrycodes', 'us')
  url.searchParams.set('viewbox', '-106.65,36.5,-93.5,25.8')
  url.searchParams.set('bounded', '0')
  const explicitState = /\b(texas|tx|california|ca|florida|fl|new york|ny|maryland|md|minnesota|mn)\b/i.test(query)
  const looksLikeAddress = /\d/.test(query)
  const searchQuery = looksLikeAddress && !explicitState ? `${query}${query.includes(',') ? ', Texas' : ', Houston, Texas'}` : query
  url.searchParams.set('q', searchQuery)
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'GridlineHouston/0.1 local development contact@localhost' }, next: { revalidate: 3600 } })
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
        const fallbackResponse = await fetch(fallbackUrl, { headers: { 'User-Agent': 'GridlineHouston/0.1 local development contact@localhost' }, next: { revalidate: 3600 } })
        if (fallbackResponse.ok) {
          const fallbackResults = await fallbackResponse.json() as NominatimResult[]
          result = fallbackResults[0]
          if (result) fallbackReason = 'exact_address_not_found'
        }
      }
    }
    if (!result) return NextResponse.json({ result: null, failure: 'no_location_found' })
    const latitude = Number(result.lat)
    const longitude = Number(result.lon)
    if (looksLikeAddress && !explicitState && getCoverageStatus(latitude, longitude) === 'outside') return NextResponse.json({ result: null, failure: 'no_location_found' })
    return NextResponse.json({ result: { latitude, longitude, label: result.display_name, coverage: getCoverageStatus(latitude, longitude), source: 'openstreetmap', precision: precisionFor(result), fallbackReason } })
  } catch {
    return NextResponse.json({ error: 'The location search could not be completed.' }, { status: 502 })
  }
}

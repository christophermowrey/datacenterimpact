import { NextResponse } from 'next/server'
import { getCoverageStatus } from '@/lib/geo'

type NominatimResult = { lat: string; lon: string; display_name: string; type?: string; addresstype?: string; address?: { city?: string; town?: string; village?: string; state?: string; postcode?: string } }

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q')?.trim()
  if (!query || query.length < 3 || query.length > 200) return NextResponse.json({ suggestions: [] })
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
    const response = await fetch(searchUrl, { headers: { 'User-Agent': 'GridlineHouston/0.1 local development' }, next: { revalidate: 300 } })
    if (!response.ok) throw new Error('geocoder unavailable')
    return response.json() as Promise<NominatimResult[]>
  }
  try {
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
        return { latitude, longitude, label: result.display_name, shortLabel: [city, state, result.address?.postcode].filter(Boolean).join(', '), kind: result.addresstype ?? result.type ?? 'place', coverage: getCoverageStatus(latitude, longitude), isTexas }
      })
      .filter((suggestion, index, all) => all.findIndex((candidate) => Math.abs(candidate.latitude - suggestion.latitude) < 0.0001 && Math.abs(candidate.longitude - suggestion.longitude) < 0.0001) === index)
      .sort((a, b) => Number(b.isTexas) - Number(a.isTexas))
      .map(({ isTexas: _isTexas, ...suggestion }) => suggestion)
    return NextResponse.json({ suggestions })
  } catch {
    return NextResponse.json({ suggestions: [], error: 'Suggestions could not be loaded.' }, { status: 502 })
  }
}

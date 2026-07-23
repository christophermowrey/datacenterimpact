import { NextResponse } from 'next/server'
import { getCoverageStatus } from '@/lib/geo'

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q')?.trim()
  if (!query || query.length < 3 || query.length > 200) return NextResponse.json({ error: 'Enter a location between 3 and 200 characters.' }, { status: 400 })

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('limit', '1')
  url.searchParams.set('countrycodes', 'us')
  url.searchParams.set('q', query)
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'GridlineHouston/0.1 local development contact@localhost' }, next: { revalidate: 3600 } })
    if (!response.ok) return NextResponse.json({ error: 'The geocoding service is temporarily unavailable.' }, { status: 502 })
    const results = await response.json() as { lat: string; lon: string; display_name: string }[]
    const result = results[0]
    if (!result) return NextResponse.json({ result: null })
    const latitude = Number(result.lat)
    const longitude = Number(result.lon)
    return NextResponse.json({ result: { latitude, longitude, label: result.display_name, coverage: getCoverageStatus(latitude, longitude) } })
  } catch {
    return NextResponse.json({ error: 'The location search could not be completed.' }, { status: 502 })
  }
}

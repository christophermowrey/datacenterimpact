import { NextResponse } from 'next/server'
import { getCoverageStatus } from '@/lib/geo'

export async function GET(request: Request) {
  const placeId = new URL(request.url).searchParams.get('placeId')?.trim()
  const key = process.env.GOOGLE_MAPS_API_KEY
  if (!placeId || !key) return NextResponse.json({ error: 'Google place lookup is not configured.' }, { status: 400 })
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json')
  url.searchParams.set('place_id', placeId)
  url.searchParams.set('fields', 'geometry,formatted_address')
  url.searchParams.set('key', key)
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } })
    const payload = await response.json() as { status: string; result?: { formatted_address?: string; geometry?: { location?: { lat: number; lng: number } } } }
    const location = payload.result?.geometry?.location
    if (payload.status !== 'OK' || !location) return NextResponse.json({ error: 'Google could not resolve that place.' }, { status: 502 })
    return NextResponse.json({ result: { latitude: location.lat, longitude: location.lng, label: payload.result?.formatted_address ?? 'Selected Google place', coverage: getCoverageStatus(location.lat, location.lng), source: 'google', precision: 'exact_address' } })
  } catch {
    return NextResponse.json({ error: 'Google place lookup is temporarily unavailable.' }, { status: 502 })
  }
}

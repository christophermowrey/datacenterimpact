import { NextResponse } from 'next/server'

export function GET() {
  const mapConfigured = Boolean(process.env.NEXT_PUBLIC_MAP_STYLE_URL?.trim()) || process.env.NEXT_PUBLIC_USE_OSM_FALLBACK === 'true'
  const status = mapConfigured ? 'ok' : 'degraded'
  return NextResponse.json({ status, service: 'data-center-impact', version: '0.1.0', checks: { map: mapConfigured ? 'configured' : 'missing production style' } }, { status: mapConfigured ? 200 : 503 })
}

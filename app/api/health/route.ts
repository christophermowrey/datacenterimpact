import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({ status: 'ok', service: 'data-center-impact', version: '0.1.0' })
}

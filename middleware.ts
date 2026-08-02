import { NextRequest, NextResponse } from 'next/server'

function unauthorized() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Data Center Impact admin"' },
  })
}

function credentialsMatch(request: NextRequest) {
  const header = request.headers.get('authorization')
  if (!header?.startsWith('Basic ')) return false

  try {
    const decoded = atob(header.slice(6))
    const separator = decoded.indexOf(':')
    if (separator < 0) return false
    return decoded.slice(0, separator) === process.env.ADMIN_USERNAME
      && decoded.slice(separator + 1) === process.env.ADMIN_PASSWORD
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  if (process.env.ADMIN_ENABLED !== 'true') {
    return new NextResponse('Not found', { status: 404 })
  }

  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    return new NextResponse('Admin authentication is not configured', { status: 503 })
  }

  return credentialsMatch(request) ? NextResponse.next() : unauthorized()
}

export const config = {
  matcher: ['/admin/:path*'],
}

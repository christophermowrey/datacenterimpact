import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, verifyAdminSession } from '@/lib/admin-auth'

export async function middleware(request: NextRequest) {
  if (process.env.ADMIN_ENABLED !== 'true') {
    return new NextResponse('Not found', { status: 404 })
  }

  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    return new NextResponse('Admin authentication is not configured', { status: 503 })
  }

  if (request.nextUrl.pathname === '/admin/login') return NextResponse.next()

  const authenticated = await verifyAdminSession(request.cookies.get(SESSION_COOKIE)?.value, process.env.ADMIN_PASSWORD)
  return authenticated ? NextResponse.next() : NextResponse.redirect(new URL('/admin/login', request.url))
}

export const config = {
  matcher: ['/admin/:path*'],
}

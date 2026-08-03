import { NextResponse } from 'next/server'
import { createAdminSession, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/admin-auth'

export async function POST(request: Request) {
  if (process.env.ADMIN_ENABLED !== 'true') return new NextResponse('Not found', { status: 404 })

  const form = await request.formData()
  const username = String(form.get('username') ?? '')
  const password = String(form.get('password') ?? '')
  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.redirect(new URL('/admin/login?error=1', request.url), 303)
  }

  const response = NextResponse.redirect(new URL('/admin', request.url), 303)
  response.cookies.set(SESSION_COOKIE, await createAdminSession(username, password), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
  return response
}

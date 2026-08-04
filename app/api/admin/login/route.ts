import { NextResponse } from 'next/server'
import { createAdminSession, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/admin-auth'

export async function POST(request: Request) {
  if (process.env.ADMIN_ENABLED !== 'true') return new NextResponse('Not found', { status: 404 })

  const form = await request.formData()
  const username = String(form.get('username') ?? '')
  const password = String(form.get('password') ?? '')
  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
    return new NextResponse(null, { status: 303, headers: { Location: '/admin/login?error=1' } })
  }

  const response = new NextResponse(null, { status: 303, headers: { Location: '/admin' } })
  response.cookies.set(SESSION_COOKIE, await createAdminSession(username, password), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
  return response
}

import { NextResponse } from 'next/server'
import { SESSION_COOKIE } from '@/lib/admin-auth'

export async function POST(request: Request) {
  const response = new NextResponse(null, { status: 303, headers: { Location: '/admin/login' } })
  response.cookies.delete(SESSION_COOKIE)
  return response
}

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()
const windowMs = 60_000

export function clientKey(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || request.headers.get('x-real-ip') || 'unknown-client'
}

export function rateLimit(key: string, limit: number) {
  const now = Date.now()
  const current = buckets.get(key)
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfter: 60 }
  }
  current.count += 1
  if (current.count <= limit) return { allowed: true, retryAfter: Math.ceil((current.resetAt - now) / 1000) }
  return { allowed: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) }
}

export function requestRateLimit(request: Request, route: string, limit: number) {
  return rateLimit(`${route}:${clientKey(request)}`, limit)
}

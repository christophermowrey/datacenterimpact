const SESSION_COOKIE = 'dc_admin_session'
const SESSION_MAX_AGE = 8 * 60 * 60

function encode(value: string) {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function decode(value: string) {
  return atob(value.replace(/-/g, '+').replace(/_/g, '/'))
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value))
  return encode(String.fromCharCode(...Array.from(new Uint8Array(signature))))
}

export async function createAdminSession(username: string, password: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE
  const payload = encode(JSON.stringify({ username, expiresAt }))
  return `${payload}.${await sign(payload, password)}`
}

export async function verifyAdminSession(token: string | undefined, password: string) {
  if (!token || !password) return false
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false

  try {
    const data = JSON.parse(decode(payload)) as { username?: string; expiresAt?: number }
    if (!data.username || !data.expiresAt || data.expiresAt < Math.floor(Date.now() / 1000)) return false
    return signature === await sign(payload, password)
  } catch {
    return false
  }
}

export { SESSION_COOKIE, SESSION_MAX_AGE }

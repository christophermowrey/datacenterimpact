import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin login | Data Center Impact' }

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams

  return (
    <main className="admin-login">
      <div className="admin-login-card">
        <p className="eyebrow">Private operations</p>
        <h1>Admin login</h1>
        <p>Sign in to review the private inventory workspace.</p>
        {error ? <p className="admin-login-error" role="alert">The username or password was incorrect.</p> : null}
        <form action="/api/admin/login" method="post">
          <label>Username<input name="username" autoComplete="username" required /></label>
          <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
          <button type="submit">Sign in</button>
        </form>
      </div>
    </main>
  )
}

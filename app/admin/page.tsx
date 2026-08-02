import type { Metadata } from 'next'
import { getAdminSnapshot } from '@/lib/admin'
import { getCandidateQueue } from '@/lib/inventory'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Admin | Data Center Impact' }

function formatBytes(bytes?: number) {
  if (bytes === undefined) return 'Unavailable'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`
}

function formatDuration(seconds: number) {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return [days && `${days}d`, hours && `${hours}h`, `${minutes}m`].filter(Boolean).join(' ')
}

function Status({ value }: { value: string }) {
  return <span className={`admin-status ${value === 'ok' || value === 'healthy' || value === 'configured' || value === 'disabled' ? 'good' : 'warn'}`}>{value}</span>
}

export default async function AdminPage() {
  const [snapshot, candidateQueue] = await Promise.all([getAdminSnapshot(), getCandidateQueue()])
  const usedBytes = snapshot.storage.totalBytes !== undefined && snapshot.storage.freeBytes !== undefined
    ? snapshot.storage.totalBytes - snapshot.storage.freeBytes
    : undefined

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Private operations</p>
          <h1>System overview</h1>
          <p className="admin-lede">A read-only view of this Data Center Impact instance. Billing and uptime details stay in their provider dashboards.</p>
        </div>
        <div className="admin-meta"><span>ADMIN</span><small>{new Date(snapshot.generatedAt).toLocaleString()}</small></div>
      </header>

      <section className="admin-grid" aria-label="System status">
        <article className="admin-card admin-card-featured"><p className="admin-label">Application health</p><strong className="admin-value"><Status value={snapshot.health.status} /></strong><p>Map configuration: <Status value={snapshot.health.map} /></p></article>
        <article className="admin-card"><p className="admin-label">Process uptime</p><strong className="admin-value">{formatDuration(snapshot.runtime.uptimeSeconds)}</strong><p>{snapshot.runtime.node} on {snapshot.runtime.platform}</p></article>
        <article className="admin-card"><p className="admin-label">Memory resident</p><strong className="admin-value">{formatBytes(snapshot.runtime.memoryUsedBytes)}</strong><p>Current Node.js process</p></article>
        <article className="admin-card"><p className="admin-label">Disk usage</p><strong className="admin-value">{formatBytes(usedBytes)}</strong><p>{formatBytes(snapshot.storage.freeBytes)} free on {snapshot.storage.path}</p></article>
      </section>

      <section className="admin-columns">
        <article className="admin-panel"><div className="admin-panel-heading"><h2>Configuration</h2><span>server-side</span></div><dl className="admin-list"><div><dt>Database connection</dt><dd><Status value={snapshot.configuration.database} /></dd></div><div><dt>Search retention</dt><dd><Status value={snapshot.configuration.searchRetention} /></dd></div><div><dt>Research candidates</dt><dd><Status value={snapshot.configuration.candidates} /></dd></div></dl><p className="admin-note">Secrets are checked on the server and are never rendered in this dashboard.</p></article>
        <article className="admin-panel"><div className="admin-panel-heading"><h2>External dashboards</h2><span>separate credentials</span></div><div className="admin-links">{snapshot.links.uptime ? <a href={snapshot.links.uptime} rel="noreferrer">Uptime monitoring <b>-&gt;</b></a> : <p>Uptime monitoring not configured</p>}{snapshot.links.costs ? <a href={snapshot.links.costs} rel="noreferrer">Cloud costs <b>-&gt;</b></a> : <p>Cloud costs not configured</p>}{snapshot.links.metrics ? <a href={snapshot.links.metrics} rel="noreferrer">Metrics dashboard <b>-&gt;</b></a> : <p>Metrics dashboard not configured</p>}</div><p className="admin-note">Keep provider API keys in those services or in a server-side secret store, not in the browser.</p></article>
      </section>

      <section className="admin-panel" aria-labelledby="candidate-heading">
        <div className="admin-panel-heading"><h2 id="candidate-heading">Candidate review queue</h2><span>read-only · {candidateQueue.rows.length} shown</span></div>
        {candidateQueue.error ? <p className="admin-note">{candidateQueue.error}</p> : candidateQueue.rows.length === 0 ? <p className="admin-note">No candidate records are currently imported.</p> : <div style={{ overflowX: 'auto' }}><table className="admin-table"><thead><tr><th>Name</th><th>Lifecycle</th><th>Confidence</th><th>Location</th><th>Sources</th><th>Reports</th><th>Reviewed</th></tr></thead><tbody>{candidateQueue.rows.map((candidate) => <tr key={candidate.entityId}><td><a href={`/admin/candidates/${candidate.slug}`}><strong>{candidate.name}</strong></a><small>{candidate.slug}</small></td><td>{candidate.lifecycleStatus}</td><td>{candidate.confidence}</td><td>{candidate.locationPrecision}{candidate.city ? ` · ${candidate.city}` : ''}</td><td>{candidate.sourceCount}</td><td>{candidate.reportCount}</td><td>{candidate.lastReviewedAt ? new Date(candidate.lastReviewedAt).toLocaleDateString() : 'Never'}</td></tr>)}</tbody></table></div>}
        <p className="admin-note">Candidates are research records. This first view intentionally has no promotion, exclusion, deletion, or public-map actions.</p>
      </section>
    </main>
  )
}

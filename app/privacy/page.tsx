import Link from 'next/link'

export default function PrivacyPage() {
  return <main className="learn-page">
    <header className="topbar"><Link href="/" className="brand"><span className="brand-mark">D</span><span>DATA CENTER <i>IMPACT</i></span></Link><Link href="/" className="back">← Back to map</Link></header>
    <article className="article"><p className="eyebrow">PRIVACY</p><h1>Search privacy.</h1><p className="article-dek">This early version calculates address results but does not store residential searches as lead records.</p><div className="article-meta">Updated July 2026 · Storage disabled by default</div>
      <div className="article-layout"><div className="article-body">
        <h2>Current behavior</h2>
        <p>Address searches are sent to the configured server-side geocoder so the map can calculate distances. The application does not intentionally save submitted addresses, search history, or residential locations in the current demo.</p>
        <p>Search requests may still be visible to the hosting provider or reverse proxy as part of ordinary request security and operations logs. No application analytics or search database is enabled. Avoid submitting an address that you do not want sent to a third-party geocoder.</p>
        <h2>Future storage</h2>
        <p>Before search storage is enabled, the site will publish a specific retention period, explain the purpose, restrict access, encrypt sensitive records, provide deletion procedures, and separate search records from public facility data. Storage will remain disabled unless the production environment explicitly enables it.</p>
        <h2>Third-party services</h2>
        <p>Geocoding and map services may receive requests needed to answer a search. Production providers, terms, retention behavior, and API configurations will be documented before public launch. Provider credentials remain server-side.</p>
        <h2>Questions or deletion requests</h2>
        <p>Once retained search records exist, this page will identify the contact and deletion process. Until then, do not submit information that should not be sent to a third-party geocoder.</p>
      </div><aside className="article-aside"><p className="eyebrow">PRIVACY STATUS</p><strong>Search storage disabled</strong><div className="aside-note">This policy will be updated before any residential search records are retained.</div></aside></div>
    </article>
  </main>
}

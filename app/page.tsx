'use client'

import { useState } from 'react'
import Link from 'next/link'
import { facilities, type Facility, type FacilityStatus } from '@/lib/facilities'

const statuses: { key: FacilityStatus; label: string; color: string }[] = [
  { key: 'operational', label: 'Operational', color: 'green' },
  { key: 'construction', label: 'Under construction', color: 'amber' },
  { key: 'announced', label: 'Announced / planned', color: 'purple' },
]

export default function Home() {
  const [query, setQuery] = useState('')
  const [activeStatus, setActiveStatus] = useState<FacilityStatus | 'all'>('all')
  const [showAdditional, setShowAdditional] = useState(false)
  const [selected, setSelected] = useState<Facility | null>(facilities[0])
  const [searched, setSearched] = useState(false)

  const visible = facilities.filter((facility) =>
    (activeStatus === 'all' || facility.status === activeStatus) &&
    (showAdditional || facility.class !== 'additional') &&
    (!query || `${facility.name} ${facility.city} ${facility.county}`.toLowerCase().includes(query.toLowerCase())),
  )

  function search(event: React.FormEvent) {
    event.preventDefault()
    if (query.trim()) setSearched(true)
  }

  return (
    <main className="shell">
      <header className="topbar">
        <Link href="/" className="brand"><span className="brand-mark">G</span><span>GRIDLINE <i>HOUSTON</i></span></Link>
        <nav><a href="#methodology">Methodology</a><a href="#about">About the data</a><button className="outline-button">Report a correction <span>↗</span></button></nav>
      </header>

      <section className="hero">
        <div className="hero-copy"><p className="eyebrow">Harris + Fort Bend counties <span className="live-dot" /> Demo data</p><h1>Know what’s<br /><em>nearby.</em></h1><p className="lede">A clearer view of data centers, compute infrastructure, and what they could mean for your neighborhood.</p></div>
        <div className="hero-stats"><div><strong>18</strong><span>mapped facilities</span></div><div><strong>03</strong><span>lifecycle statuses</span></div><div><strong>02</strong><span>counties covered</span></div></div>
      </section>

      <section className="workspace">
        <div className="controls">
          <form className="search" onSubmit={search}><span className="search-icon">⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search an address, neighborhood, or ZIP" aria-label="Search location" /><button type="submit">Search</button></form>
          <div className="control-row"><div className="filter-label">SHOWING <span>{visible.length} places</span></div><div className="status-filters"><button className={activeStatus === 'all' ? 'active' : ''} onClick={() => setActiveStatus('all')}>All</button>{statuses.map((status) => <button key={status.key} className={activeStatus === status.key ? 'active' : ''} onClick={() => setActiveStatus(status.key)}><b className={`dot ${status.color}`} />{status.label}</button>)}</div><label className="toggle"><input type="checkbox" checked={showAdditional} onChange={(e) => setShowAdditional(e.target.checked)} /><span className="switch" /> Additional compute</label></div>
        </div>

        {searched && <div className="search-note"><span>⌖</span> Showing a sample search near <strong>{query}</strong>. Distances are calculated from the searched point. <button onClick={() => { setSearched(false); setQuery('') }}>Clear</button></div>}
        <div className="map-layout">
          <div className="map" aria-label="Map of Greater Houston data centers" role="img">
            <div className="map-tools"><button title="Zoom in">+</button><button title="Zoom out">−</button><button title="Use my location">⌖</button></div><div className="map-label katy">KATY</div><div className="map-label houston">HOUSTON</div><div className="map-label sugar">SUGAR LAND</div><div className="highway h1" /><div className="highway h2" /><div className="highway h3" />
            {visible.map((facility) => <button key={facility.slug} className={`map-pin ${facility.status} ${selected?.slug === facility.slug ? 'selected' : ''}`} style={{ left: `${facility.mapX}%`, top: `${facility.mapY}%` }} onClick={() => setSelected(facility)} aria-label={`View ${facility.name}`}><span>{facility.status === 'operational' ? '●' : facility.status === 'construction' ? '◆' : '○'}</span></button>)}
            {selected && <div className="map-card"><div className="card-kicker"><span className={`dot ${selected.color}`} />{selected.statusLabel}<span className="card-distance">{selected.distance} mi away</span></div><h3>{selected.name}</h3><p>{selected.city}, {selected.county} County · {selected.classLabel}</p><div className="card-footer"><span className="confidence">{selected.confidence} confidence</span><Link href={`/data-centers/${selected.slug}`}>View full details <span>→</span></Link></div></div>}
          </div>
          <aside className="results"><div className="results-head"><div><p className="eyebrow">NEARBY FACILITIES</p><h2>{searched ? 'Around your search' : 'Greater Houston'}</h2></div><button className="sort">Nearest <span>⌄</span></button></div><div className="result-list">{visible.map((facility) => <button className={`result ${selected?.slug === facility.slug ? 'chosen' : ''}`} key={facility.slug} onClick={() => setSelected(facility)}><div className="result-top"><span className={`status-pill ${facility.color}`}>{facility.statusLabel}</span><span>{facility.distance} mi</span></div><h3>{facility.name}</h3><p>{facility.city} · {facility.classLabel}</p><div className="result-bottom"><span className="score">{facility.score[0]}–{facility.score[1]} <small>impact</small></span><span className="confidence">{facility.confidence}</span></div></button>)}{visible.length === 0 && <div className="empty">No facilities match those filters.</div>}</div><div className="results-foot">Last verified <strong>12 Jun 2025</strong><span>·</span><button>About our sources <span>↗</span></button></div></aside>
        </div>
      </section>
      <section className="trust"><div><span className="trust-icon">✓</span><div><strong>Evidence, not speculation</strong><p>Every published fact is tied to a source and verification date.</p></div></div><div><span className="trust-icon">◌</span><div><strong>Scores show uncertainty</strong><p>Ranges and confidence ratings make missing data visible.</p></div></div><div><span className="trust-icon">⌁</span><div><strong>Built for homebuyers</strong><p>Clear context without predicting property values or health outcomes.</p></div></div></section>
      <footer id="about"><span>GRIDLINE HOUSTON © 2025</span><span>Informational only · Not a substitute for due diligence</span><span id="methodology"><a href="#methodology">Scoring methodology</a> <a href="#about">Privacy</a></span></footer>
    </main>
  )
}

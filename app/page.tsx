'use client'

import { useState } from 'react'
import Link from 'next/link'
import { facilities, type Facility, type FacilityStatus } from '@/lib/facilities'
import MapView, { type SearchedLocation } from '@/components/MapView'

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
  const [searchedLocation, setSearchedLocation] = useState<SearchedLocation | null>(null)
  const [searchMessage, setSearchMessage] = useState('')

  const visible = facilities.filter((facility) =>
    (activeStatus === 'all' || facility.status === activeStatus) &&
    (showAdditional || facility.class !== 'additional') &&
    (!query || searchedLocation || `${facility.name} ${facility.city} ${facility.county}`.toLowerCase().includes(query.toLowerCase())),
  )

  async function search(event: React.FormEvent) {
    event.preventDefault()
    const value = query.trim()
    if (!value) return
    setSearchMessage('Searching the location...')
    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(value)}`)
      const payload = await response.json() as { result?: SearchedLocation | null; error?: string }
      if (payload.result) {
        setSearchedLocation(payload.result)
        setSearchMessage('Location found. Nearby facilities are shown for this point.')
      } else {
        setSearchedLocation(null)
        setSearchMessage(payload.error ?? 'No address found. Showing matching facility names instead.')
      }
      setSearched(true)
    } catch {
      setSearchMessage('Location search is unavailable. Try a facility name or ZIP code.')
      setSearched(true)
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <Link href="/" className="brand"><span className="brand-mark">G</span><span>GRIDLINE <i>HOUSTON</i></span></Link>
        <nav><a href="#methodology">Methodology</a><a href="#about">About the data</a><button className="outline-button">Report a correction <span>↗</span></button></nav>
      </header>

      <section className="hero">
        <div className="hero-copy"><p className="eyebrow">Harris + Fort Bend counties <span className="live-dot" /> Demo data</p><h1>Know what’s<br /><em>nearby.</em></h1><p className="lede">A clearer view of data centers, compute infrastructure, and what they could mean for your neighborhood.</p></div>
        <div className="hero-stats"><div><strong>05</strong><span>demo records</span></div><div><strong>35+</strong><span>directory estimate</span></div><div><strong>02</strong><span>counties covered</span></div></div>
      </section>

      <section className="workspace">
        <div className="controls">
          <form className="search" onSubmit={search}><span className="search-icon">⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search an address, neighborhood, or ZIP" aria-label="Search location" /><button type="submit">Search</button></form>
          <div className="control-row"><div className="filter-label">SHOWING <span>{visible.length} places</span></div><div className="status-filters"><button className={activeStatus === 'all' ? 'active' : ''} onClick={() => setActiveStatus('all')}>All</button>{statuses.map((status) => <button key={status.key} className={activeStatus === status.key ? 'active' : ''} onClick={() => setActiveStatus(status.key)}><b className={`dot ${status.color}`} />{status.label}</button>)}</div><label className="toggle"><input type="checkbox" checked={showAdditional} onChange={(e) => setShowAdditional(e.target.checked)} /><span className="switch" /> Additional compute</label></div>
        </div>

        {searched && <div className="search-note"><span>⌖</span> <strong>{searchMessage}</strong> <button onClick={() => { setSearched(false); setSearchedLocation(null); setSearchMessage(''); setQuery('') }}>Clear</button></div>}
        <div className="map-layout">
          <MapView facilities={visible} selected={selected} onSelect={setSelected} searchedLocation={searchedLocation} />
          <aside className="results"><div className="results-head"><div><p className="eyebrow">NEARBY FACILITIES</p><h2>{searched ? 'Around your search' : 'Greater Houston'}</h2></div><button className="sort">Nearest <span>⌄</span></button></div><div className="result-list">{visible.map((facility) => <button className={`result ${selected?.slug === facility.slug ? 'chosen' : ''}`} key={facility.slug} onClick={() => setSelected(facility)}><div className="result-top"><span className={`status-pill ${facility.color}`}>{facility.statusLabel}</span><span>{facility.distance} mi</span></div><h3>{facility.name}</h3><p>{facility.city} · {facility.classLabel}</p><div className="result-bottom"><span className="score">{facility.score[0]}–{facility.score[1]} <small>impact</small></span><span className="confidence">{facility.confidence}</span></div></button>)}{visible.length === 0 && <div className="empty">No facilities match those filters.</div>}</div><div className="results-foot">Last verified <strong>12 Jun 2025</strong><span>·</span><button>About our sources <span>↗</span></button></div></aside>
        </div>
      </section>
      <section className="trust"><div><span className="trust-icon">✓</span><div><strong>Evidence, not speculation</strong><p>Every published fact is tied to a source and verification date.</p></div></div><div><span className="trust-icon">◌</span><div><strong>Scores show uncertainty</strong><p>Ranges and confidence ratings make missing data visible.</p></div></div><div><span className="trust-icon">⌁</span><div><strong>Built for homebuyers</strong><p>Clear context without predicting property values or health outcomes.</p></div></div></section>
      <footer id="about"><span>GRIDLINE HOUSTON © 2025</span><span>Informational only · Not a substitute for due diligence</span><span id="methodology"><a href="#methodology">Scoring methodology</a> <a href="#about">Privacy</a></span></footer>
    </main>
  )
}

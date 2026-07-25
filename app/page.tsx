'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { facilities, type Facility, type FacilityStatus } from '@/lib/facilities'
import MapView, { type SearchedLocation } from '@/components/MapView'
import { formatMiles, haversineMiles } from '@/lib/geo'

const statuses: { key: FacilityStatus; label: string; color: string }[] = [
  { key: 'operational', label: 'Operational', color: 'green' },
  { key: 'construction', label: 'Under construction', color: 'amber' },
  { key: 'announced', label: 'Announced / planned', color: 'purple' },
]

type LocationSuggestion = { latitude?: number; longitude?: number; label: string; shortLabel: string; kind: string; coverage: 'supported' | 'outside' | 'unknown'; source?: 'google' | 'openstreetmap'; precision?: SearchedLocation['precision']; placeId?: string }

export default function Home() {
  const [query, setQuery] = useState('')
  const [activeStatus, setActiveStatus] = useState<FacilityStatus | 'all'>('all')
  const [showAdditional, setShowAdditional] = useState(false)
  const [selected, setSelected] = useState<Facility | null>(facilities[0])
  const [searched, setSearched] = useState(false)
  const [searchedLocation, setSearchedLocation] = useState<SearchedLocation | null>(null)
  const [pendingLocation, setPendingLocation] = useState<SearchedLocation | null>(null)
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [searchMessage, setSearchMessage] = useState('')
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [suggesting, setSuggesting] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)

  useEffect(() => {
    const value = query.trim()
    if (value.length < 3) {
      setSuggestions([])
      setSuggesting(false)
      return
    }
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setSuggesting(true)
      try {
        const response = await fetch(`/api/geocode/suggest?q=${encodeURIComponent(value)}`, { signal: controller.signal })
        const payload = await response.json() as { suggestions?: LocationSuggestion[] }
        setSuggestions(payload.suggestions ?? [])
        setActiveSuggestion(-1)
      } catch (error) {
        if ((error as Error).name !== 'AbortError') setSuggestions([])
      } finally {
        if (!controller.signal.aborted) setSuggesting(false)
      }
    }, 280)
    return () => { controller.abort(); window.clearTimeout(timer) }
  }, [query, searchedLocation])

  const filtered = facilities.filter((facility) =>
    (facility.publicationStatus === 'published' || facility.publicationStatus === 'demo') &&
    (activeStatus === 'all' || facility.status === activeStatus) &&
    (showAdditional || facility.class !== 'additional') &&
    (!submittedQuery || searchedLocation || `${facility.name} ${facility.city} ${facility.county}`.toLowerCase().includes(submittedQuery.toLowerCase())),
  )
  const visible = filtered.map((facility) => {
    const miles = searchedLocation ? haversineMiles(searchedLocation, facility) : undefined
    return { ...facility, distanceMiles: miles, distanceLabel: miles === undefined ? undefined : `${formatMiles(miles)} mi` }
  }).sort((a, b) => (a.distanceMiles ?? Number.POSITIVE_INFINITY) - (b.distanceMiles ?? Number.POSITIVE_INFINITY))

  function useLocation(location: SearchedLocation, label: string) {
    setSearchedLocation(location)
    setPendingLocation(null)
    setSearched(true)
    setQuery(label)
    setSubmittedQuery(label)
    setSuggestions([])
    setActiveSuggestion(-1)
    setSearchMessage(location.fallbackReason ? 'We could not find that exact address in OpenStreetMap. This is a map-data limitation, not a problem with your search. We found the surrounding locality and are using its approximate location for distances.' : location.coverage === 'outside' ? 'Location found, but it is outside current Harris + Fort Bend coverage.' : location.precision === 'municipality_boundary' || location.precision === 'zip_centroid' ? 'We found the surrounding area, not an exact address. Distances are approximate from this location.' : 'Location confirmed. Distances are calculated from this point.')
    const nearest = [...facilities].sort((a, b) => haversineMiles(location, a) - haversineMiles(location, b))[0]
    setSelected(nearest ?? null)
  }

  async function chooseSuggestion(suggestion: LocationSuggestion) {
    if (suggestion.latitude === undefined || suggestion.longitude === undefined) {
      if (!suggestion.placeId) return
      setSearchMessage('Confirming the selected Google place...')
      const response = await fetch(`/api/geocode/place?placeId=${encodeURIComponent(suggestion.placeId)}`)
      const payload = await response.json() as { result?: SearchedLocation }
      if (!payload.result) {
        setSearchMessage('Google could not confirm that place. Choose another suggestion or add a ZIP code.')
        return
      }
      setPendingLocation(payload.result)
    } else {
      setPendingLocation(suggestion as SearchedLocation)
    }
    setQuery(suggestion.label)
    setSuggestions([])
    setActiveSuggestion(-1)
    setSearchMessage('Location selected. Press Search to update the map and nearby facilities.')
  }

  async function search(event: React.FormEvent) {
    event.preventDefault()
    const value = query.trim()
    if (!value) return
    if (pendingLocation) {
      useLocation(pendingLocation, pendingLocation.label)
      return
    }
    if (suggestions.length > 0) {
      setSearchMessage('Choose a location from the suggestions so the address is not misidentified.')
      return
    }
    setSearchMessage('Searching the location...')
    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(value)}`)
      const payload = await response.json() as { result?: SearchedLocation | null; error?: string }
      if (payload.result) {
        useLocation(payload.result, payload.result.label)
      } else {
        setSearchedLocation(null)
        setSubmittedQuery(value)
        setSearchMessage(payload.error ?? 'No address found. Showing matching facility names instead.')
      }
      setSearched(true)
    } catch {
      setSearchedLocation(null)
      setSubmittedQuery(value)
      setSearchMessage('Location search is unavailable. Try a facility name or ZIP code.')
      setSearched(true)
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <Link href="/" className="brand"><span className="brand-mark">G</span><span>GRIDLINE <i>HOUSTON</i></span></Link>
        <nav><Link href="/open-map">Open-source map</Link><a href="#about">About the data</a><button className="outline-button">Report a correction <span>↗</span></button></nav>
      </header>

      <section className="hero">
        <div className="hero-copy"><p className="eyebrow">Harris + Fort Bend counties <span className="live-dot" /> Demo data</p><h1>Know what’s<br /><em>nearby.</em></h1><p className="lede">A clearer view of data centers, compute infrastructure, and what they could mean for your neighborhood.</p></div>
        <div className="hero-stats"><div><strong>05</strong><span>demo records</span></div><div><strong>35+</strong><span>directory estimate</span></div><div><strong>02</strong><span>counties covered</span></div></div>
      </section>

      <section className="workspace">
        <div className="controls">
          <form className="search" onSubmit={search}><span className="search-icon">⌕</span><div className="search-entry"><input value={query} onChange={(e) => { setQuery(e.target.value); setPendingLocation(null) }} onKeyDown={(event) => { if (event.key === 'ArrowDown') { event.preventDefault(); setActiveSuggestion((current) => Math.min(current + 1, suggestions.length - 1)) } else if (event.key === 'ArrowUp') { event.preventDefault(); setActiveSuggestion((current) => Math.max(current - 1, 0)) } else if (event.key === 'Escape') { setSuggestions([]) } else if (event.key === 'Enter' && activeSuggestion >= 0) { event.preventDefault(); chooseSuggestion(suggestions[activeSuggestion]) } }} placeholder="Search an address, neighborhood, or ZIP" aria-label="Search location" role="combobox" aria-expanded={suggestions.length > 0} aria-controls="location-suggestions" aria-autocomplete="list" />{(suggesting || suggestions.length > 0) && <div className="suggestions" id="location-suggestions" role="listbox"><div className="suggestion-hint">Texas results shown first · choose a location</div>{suggestions.map((suggestion, index) => <button type="button" role="option" aria-selected={activeSuggestion === index} className={activeSuggestion === index ? 'active' : ''} key={`${suggestion.latitude}-${suggestion.longitude}-${index}`} onMouseDown={(event) => event.preventDefault()} onClick={() => chooseSuggestion(suggestion)}><span className="suggestion-icon">⌖</span><span><strong>{suggestion.shortLabel || suggestion.label}</strong><small>{suggestion.label}</small></span>{suggestion.coverage === 'outside' && <em>Outside launch area</em>}</button>)}</div>}</div><button type="submit">Search</button></form>
          <div className="control-row"><div className="filter-label">SHOWING <span>{visible.length} places</span></div><div className="status-filters"><button className={activeStatus === 'all' ? 'active' : ''} onClick={() => setActiveStatus('all')}>All</button>{statuses.map((status) => <button key={status.key} className={activeStatus === status.key ? 'active' : ''} onClick={() => setActiveStatus(status.key)}><b className={`dot ${status.color}`} />{status.label}</button>)}</div><label className="toggle"><input type="checkbox" checked={showAdditional} onChange={(e) => setShowAdditional(e.target.checked)} /><span className="switch" /> Additional compute</label></div>
        </div>

        {(searched || pendingLocation) && <div className="search-note"><span>⌖</span> <strong>{searchMessage}</strong> <button onClick={() => { setSearched(false); setSearchedLocation(null); setPendingLocation(null); setSubmittedQuery(''); setSearchMessage(''); setSuggestions([]); setQuery('') }}>Clear</button></div>}
        <div className="map-layout">
          <MapView facilities={visible} selected={selected} onSelect={setSelected} searchedLocation={searchedLocation} />
          <aside className="results"><div className="results-head"><div><p className="eyebrow">NEARBY FACILITIES</p><h2>{searchedLocation?.coverage === 'outside' ? 'Outside launch area' : searched ? 'Around your search' : 'Greater Houston'}</h2></div><span className="sort-label">{searchedLocation ? 'Nearest first' : 'Houston area'}</span></div><div className="result-list">{visible.map((facility) => <button className={`result ${selected?.slug === facility.slug ? 'chosen' : ''}`} key={facility.slug} onClick={() => setSelected(facility)}><div className="result-top"><span className={`status-pill ${facility.color}`}>{facility.statusLabel}</span><span>{facility.distanceLabel ?? 'Select a location'}</span></div><h3>{facility.name}</h3><p>{facility.city} · {facility.classLabel}</p><div className="result-bottom"><span className="score">{facility.score[0]}–{facility.score[1]} <small>impact</small></span><span className="confidence">{facility.confidence}</span></div></button>)}{visible.length === 0 && <div className="empty">No facilities match those filters.</div>}</div><div className="results-foot">Last verified <strong>12 Jun 2025</strong><span>·</span><button>About our sources <span>↗</span></button></div></aside>
        </div>
      </section>
      <section className="trust"><div><span className="trust-icon">✓</span><div><strong>Evidence, not speculation</strong><p>Every published fact is tied to a source and verification date.</p></div></div><div><span className="trust-icon">◌</span><div><strong>Inspect the evidence</strong><p>Review the facts, assumptions, and sources behind each record.</p></div></div><div><span className="trust-icon">⌁</span><div><strong>Built for homebuyers</strong><p>Clear context without predicting property values or health outcomes.</p></div></div></section>
      <footer id="about"><span>GRIDLINE HOUSTON © 2025</span><span>Informational only · Not a substitute for due diligence</span><span id="methodology"><a href="#methodology">Scoring methodology</a> <a href="#about">Privacy</a></span></footer>
    </main>
  )
}

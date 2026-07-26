'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { facilities, type Facility, type FacilityStatus } from '@/lib/facilities'
import MapView, { type SearchedLocation } from '@/components/MapView'
import { formatMiles, haversineMiles } from '@/lib/geo'
import { calculateImpact } from '@/lib/impact'
import { parsePowerKw, powerSummary } from '@/lib/power'

const statuses: { key: FacilityStatus | 'all'; label: string; color?: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'operational', label: 'Built', color: 'green' },
  { key: 'construction', label: 'Under construction', color: 'amber' },
  { key: 'announced', label: 'Announced', color: 'purple' },
]

type LocationSuggestion = { latitude?: number; longitude?: number; label: string; shortLabel: string; kind: string; coverage: 'supported' | 'outside' | 'unknown'; source?: 'google' | 'openstreetmap'; precision?: SearchedLocation['precision']; placeId?: string }

function powerFor(facility: Facility) {
  const powerMetric = facility.metrics?.find((metric) => /power|load|capacity/i.test(`${metric.label} ${metric.value}`))
  const powerKw = powerMetric ? parsePowerKw(powerMetric.value) : null
  return powerKw ? powerSummary(powerKw) : null
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [activeStatus, setActiveStatus] = useState<FacilityStatus | 'all'>('all')
  const [showAdditional, setShowAdditional] = useState(true)
  const [selected, setSelected] = useState<Facility | null>(facilities[0])
  const [searched, setSearched] = useState(false)
  const [searchedLocation, setSearchedLocation] = useState<SearchedLocation | null>(null)
  const [pendingLocation, setPendingLocation] = useState<SearchedLocation | null>(null)
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [searchMessage, setSearchMessage] = useState('')
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [suggesting, setSuggesting] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)
  const [headline, setHeadline] = useState(0)

  const headlines = ['Is an AI data center affecting your home?', 'Is an AI data center coming to your neighborhood?', 'Check what is near your address.']

  useEffect(() => {
    const timer = window.setInterval(() => setHeadline((current) => (current + 1) % headlines.length), 5000)
    return () => window.clearInterval(timer)
  }, [headlines.length])

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
  }, [query])

  const filtered = facilities.filter((facility) =>
    (facility.publicationStatus === 'published' || facility.publicationStatus === 'demo' || facility.publicationStatus === 'candidate') &&
    (activeStatus === 'all' || facility.status === activeStatus) &&
    (showAdditional || facility.class !== 'additional') &&
    (!submittedQuery || searchedLocation || `${facility.name} ${facility.city} ${facility.county}`.toLowerCase().includes(submittedQuery.toLowerCase())),
  )
  const visible = filtered.map((facility) => {
    const miles = searchedLocation ? haversineMiles(searchedLocation, facility) : undefined
    const impact = miles === undefined ? null : calculateImpact(facility, miles)
    return { ...facility, distanceMiles: miles, distanceLabel: miles === undefined ? undefined : `${formatMiles(miles)} mi`, score: impact ? [impact.lower, impact.upper] as [number, number] : facility.score, power: powerFor(facility) }
  }).sort((a, b) => (a.distanceMiles ?? Number.POSITIVE_INFINITY) - (b.distanceMiles ?? Number.POSITIVE_INFINITY))

  const visibleSlugs = visible.map((facility) => facility.slug).join('|')
  useEffect(() => {
    if (selected && !visible.some((facility) => facility.slug === selected.slug)) setSelected(visible[0] ?? null)
  }, [selected, visibleSlugs])

  function scrollToMap() {
    window.setTimeout(() => document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }

  function useLocation(location: SearchedLocation, label: string) {
    setSearchedLocation(location)
    setPendingLocation(null)
    setSearched(true)
    setQuery(label)
    setSubmittedQuery(label)
    setSuggestions([])
    setActiveSuggestion(-1)
    setSelected(null)
    setSearchMessage(location.fallbackReason ? 'We could not find that exact address. We found the surrounding locality and are using its approximate location for distances.' : location.coverage === 'outside' ? 'Location found in the expanding Houston-area coverage.' : location.precision === 'municipality_boundary' || location.precision === 'zip_centroid' ? 'We found the surrounding area, not an exact address. Distances are approximate from this location.' : 'Location confirmed. Distances are calculated from this point.')
    scrollToMap()
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
    setSearchMessage('Location selected. Press Check address to update the map.')
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
      if (payload.result) useLocation(payload.result, payload.result.label)
      else {
        setSearchedLocation(null)
        setSubmittedQuery(value)
        setSearchMessage(payload.error ?? 'We could not identify that map location. Add the city, state, or ZIP code and try again.')
        setSearched(true)
      }
    } catch {
      setSearchedLocation(null)
      setSubmittedQuery(value)
      setSearchMessage('Location search is unavailable. Try a full address or ZIP code.')
      setSearched(true)
    }
  }

  function clearSearch() {
    setSearched(false)
    setSearchedLocation(null)
    setPendingLocation(null)
    setSubmittedQuery('')
    setSearchMessage('')
    setSuggestions([])
    setQuery('')
    setSelected(facilities[0] ?? null)
  }

  function selectFacility(facility: Facility) {
    setSelected((current) => current?.slug === facility.slug ? null : facility)
  }

  return <main className="shell"><header className="topbar"><Link href="/" className="brand"><span className="brand-mark">D</span><span>DATA CENTER <i>IMPACT</i></span></Link><nav><Link href="/open-map">Open-source map</Link><Link href="/learn">Learn</Link><a href="#about">About the data</a><button className="outline-button">Report a correction <span>↗</span></button></nav></header>
    <section className="hero address-hero"><div className="hero-copy"><p className="eyebrow">AI DATA CENTER IMPACT CHECK <span className="live-dot" /> HOUSTON AREA</p><div className="headline-window"><h1 key={headline}>{headlines[headline]}</h1></div><p className="lede">Enter an address to see built, under-construction, and announced data centers near the places you care about.</p><form className="hero-search search" onSubmit={search}><span className="search-icon">⌕</span><div className="search-entry"><input value={query} onChange={(e) => { setQuery(e.target.value); setPendingLocation(null) }} onKeyDown={(event) => { if (event.key === 'ArrowDown') { event.preventDefault(); setActiveSuggestion((current) => Math.min(current + 1, suggestions.length - 1)) } else if (event.key === 'ArrowUp') { event.preventDefault(); setActiveSuggestion((current) => Math.max(current - 1, 0)) } else if (event.key === 'Escape') setSuggestions([]); else if (event.key === 'Enter' && activeSuggestion >= 0) { event.preventDefault(); chooseSuggestion(suggestions[activeSuggestion]) } }} placeholder="Enter your home address" aria-label="Search home address" role="combobox" aria-expanded={suggestions.length > 0} aria-controls="location-suggestions" aria-autocomplete="list" />{(suggesting || suggestions.length > 0) && <div className="suggestions" id="location-suggestions" role="listbox"><div className="suggestion-hint">Houston-area results shown first · choose a location</div>{suggestions.map((suggestion, index) => <button type="button" role="option" aria-selected={activeSuggestion === index} className={activeSuggestion === index ? 'active' : ''} key={`${suggestion.latitude}-${suggestion.longitude}-${index}`} onMouseDown={(event) => event.preventDefault()} onClick={() => chooseSuggestion(suggestion)}><span className="suggestion-icon">⌖</span><span><strong>{suggestion.shortLabel || suggestion.label}</strong><small>{suggestion.label}</small></span></button>)}</div>}</div><button type="submit">Check address</button></form><p className="coverage-note">Houston-area coverage is available now and expanding to The Woodlands, Brazoria, Galveston, College Station, Conroe, Victoria, and nearby communities.</p></div><div className="hero-stats"><div><strong>{facilities.filter((facility) => facility.status === 'operational').length.toString().padStart(2, '0')}</strong><span>built records</span></div><div><strong>{facilities.filter((facility) => facility.status === 'construction').length.toString().padStart(2, '0')}</strong><span>under construction</span></div><div><strong>{facilities.filter((facility) => facility.status === 'announced').length.toString().padStart(2, '0')}</strong><span>announced</span></div></div></section>
    <section className="workspace" id="map-section"><div className="controls"><div className="control-row"><div className="filter-label">SHOWING <span>{visible.length} places</span></div><div className="status-filters">{statuses.map((status) => <button key={status.key} className={activeStatus === status.key ? 'active' : ''} onClick={() => setActiveStatus(status.key)}>{status.color && <b className={`dot ${status.color}`} />}{status.label}</button>)}</div><label className="toggle"><input type="checkbox" checked={showAdditional} onChange={(e) => setShowAdditional(e.target.checked)} /><span className="switch" /> Smaller carrier and network facilities</label></div></div>
      {(searched || pendingLocation) && <div className="search-note"><span>⌖</span> <strong>{searchMessage}</strong> <button onClick={clearSearch}>Clear search</button></div>}
      <div className="coverage-banner">Houston area currently available: Houston, Katy, The Woodlands, Brazoria, Galveston, College Station, Conroe, Victoria, and nearby regional locations. Coverage is expanding.</div>
      <div className="map-layout"><MapView facilities={visible} selected={selected} onSelect={selectFacility} searchedLocation={searchedLocation} /><aside className="results"><div className="results-head"><div><p className="eyebrow">NEARBY FACILITIES</p><h2>{searched ? 'Around your address' : 'Houston area inventory'}</h2></div><span className="sort-label">{searchedLocation ? 'Nearest first' : 'All places'}</span></div><div className="result-list">{visible.map((facility) => <button className={`result ${selected?.slug === facility.slug ? 'chosen' : ''}`} key={facility.slug} onClick={() => selectFacility(facility)}><div className="result-top"><span className={`status-pill ${facility.color}`}>{facility.status === 'operational' ? 'Built' : facility.statusLabel}</span><span>{facility.distanceLabel ?? 'Select a location'}</span></div><h3>{facility.name}</h3><p>{facility.city} · {facility.classLabel}</p><div className="result-bottom"><span className="score">{facility.score[0]}–{facility.score[1]} <small>{searchedLocation ? 'at address' : 'immediate neighborhood'}</small></span><span className="confidence">{facility.confidence}</span></div>{facility.power && <span className="power-equivalent">⚡ {facility.power.homes.toLocaleString()} homes equivalent{facility.power.significant ? ' · significant' : ''}</span>}</button>)}{visible.length === 0 && <div className="empty">No records match this layer or search.</div>}</div><div className="results-foot">Data sources are reviewed and preserved over time <span>·</span><Link href="/learn">About the sources ↗</Link></div></aside></div>
    </section><section className="trust"><div><span className="trust-icon">✓</span><div><strong>Evidence, not speculation</strong><p>Review sources, status, assumptions, and uncertainty for every record.</p></div></div><div><span className="trust-icon">⌁</span><div><strong>AI-first, data-center-wide</strong><p>We look for AI infrastructure, but show all relevant data centers.</p></div></div><div><span className="trust-icon">⌖</span><div><strong>Built for your address</strong><p>Search a home, neighborhood, or ZIP code and see what is nearby.</p></div></div></section><footer id="about"><span>DATA CENTER IMPACT © 2026</span><span>Houston-area coverage is expanding · Informational only · Not a substitute for due diligence</span><span><Link href="/learn">Sources and methodology</Link></span></footer></main>
}

'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const facilities = [
  ['Built', 'Microsoft Houston 1', 'Northwest Houston · 18.2 mi'],
  ['Built', 'CyrusOne Houston West', 'Katy · 21.4 mi'],
  ['Under construction', 'Vantage Data Centers HOU1', 'Houston · 24.8 mi'],
  ['Announced', 'Lancaster Holdings campus', 'Southwest Houston · 27.1 mi'],
  ['Built', 'Flexential Houston - West', 'Westchase · 28.6 mi'],
  ['Additional', 'Houston Carrier Hotel', 'Downtown Houston · 30.2 mi'],
  ['Announced', 'Project Matador', 'Fort Bend County · 33.7 mi'],
  ['Built', 'DataBank HOU3', 'North Houston · 36.5 mi'],
]

type DemoProps = { custom?: boolean; cue?: 'fade' | 'label' | 'continuation' }

function FacilityRows() {
  return <>{facilities.map(([status, name, location]) => <article className="scroll-facility" key={name}><div><span className={`scroll-status ${status === 'Built' ? 'built' : status === 'Announced' ? 'announced' : 'construction'}`}>{status}</span><strong>{name}</strong></div><small>{location}</small><span className="scroll-score">{status === 'Announced' ? '42–58' : status === 'Additional' ? '18–31' : '56–74'}</span></article>)}</>
}

function ScrollDemo({ custom = false, cue = 'continuation' }: DemoProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [atBottom, setAtBottom] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  function updateScroll() {
    const list = listRef.current
    if (!list) return
    const remaining = list.scrollHeight - list.scrollTop - list.clientHeight
    setProgress(list.scrollHeight === list.clientHeight ? 1 : list.scrollTop / (list.scrollHeight - list.clientHeight))
    setAtBottom(remaining <= 2)
    if (list.scrollTop > 2) setHasScrolled(true)
  }

  useEffect(() => { updateScroll() }, [])

  function jumpFromRail(event: React.PointerEvent<HTMLDivElement>) {
    const list = listRef.current
    if (!list) return
    const rail = event.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (event.clientY - rail.top) / rail.height))
    list.scrollTop = ratio * (list.scrollHeight - list.clientHeight)
  }

  return <div className={`scroll-demo ${custom ? 'custom-demo' : ''}`}>
    <div className="scroll-demo-head"><div><span className="scroll-demo-kicker">NEARBY FACILITIES</span><strong>Houston area inventory</strong></div><span className="scroll-count">8 places</span></div>
    <div className="scroll-viewport-wrap">
      <div ref={listRef} className="scroll-viewport" onScroll={updateScroll} tabIndex={0} aria-label="Nearby facilities example"><FacilityRows /></div>
      {custom && <div className="custom-rail" onPointerDown={jumpFromRail} role="scrollbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-label="Facility list position"><span style={{ top: `${progress * 66}%` }} /></div>}
      {cue === 'fade' && !atBottom && <div className="scroll-fade" aria-hidden="true" />}
      {cue === 'label' && !hasScrolled && <button className="scroll-label" onClick={() => listRef.current?.scrollBy({ top: 150, behavior: 'smooth' })}>Scroll for more <span>↓</span></button>}
      {cue === 'continuation' && !atBottom && <div className="continuation-mark" aria-hidden="true">more results ↓</div>}
    </div>
    {custom && <div className="scroll-demo-foot"><span>Custom rail · {Math.round(progress * 100)}% viewed</span><span>Click the rail</span></div>}
  </div>
}

export default function ScrollSolutionsPage() {
  return <main className="learn-page scroll-page">
    <header className="topbar"><Link href="/" className="brand"><span className="brand-mark">D</span><span>DATA CENTER <i>IMPACT</i></span></Link><Link href="/" className="back">← Back to map</Link></header>
    <section className="scroll-intro"><p className="eyebrow">INTERACTION LAB · NEARBY FACILITIES</p><h1>Make the list feel <em>scrollable.</em></h1><p>Working examples for the smaller results window on the map. Scroll each panel, resize your browser, and compare which cue feels helpful without becoming noise.</p><div className="scroll-intro-note"><span>THE PROBLEM</span><strong>On macOS, the native scrollbar may disappear until the user scrolls.</strong></div></section>
    <section className="solution-grid">
      <article className="solution-card"><div className="solution-heading"><span>01</span><div><h2>Show continuation</h2><p>Let the next facility peek into view so the panel never looks finished.</p></div></div><ScrollDemo cue="continuation"/><div className="solution-code"><code>Keep the next card partially visible</code><span>Best default</span></div></article>
      <article className="solution-card"><div className="solution-heading"><span>02</span><div><h2>Bottom fade</h2><p>A soft fade signals that content continues, then disappears at the end.</p></div></div><ScrollDemo cue="fade"/><div className="solution-code"><code>Fade only while more results remain</code><span>Low visual weight</span></div></article>
      <article className="solution-card"><div className="solution-heading"><span>03</span><div><h2>Explicit first-use cue</h2><p>Offer a small action before the first interaction, then get out of the way.</p></div></div><ScrollDemo cue="label"/><div className="solution-code"><code>Dismiss after the first scroll</code><span>Most obvious</span></div></article>
      <article className="solution-card"><div className="solution-heading"><span>04</span><div><h2>Native, stable scrolling</h2><p>Keep browser behavior, reserve scrollbar space, and improve contrast lightly.</p></div></div><ScrollDemo/><div className="solution-code"><code>overflow-y: auto; scrollbar-gutter: stable</code><span>Recommended foundation</span></div></article>
      <article className="solution-card solution-card-wide"><div className="solution-heading"><span>05</span><div><h2>Always-visible custom rail</h2><p>This is the precise-control option. The rail is interactive, but it replaces platform behavior and needs more accessibility testing.</p></div></div><ScrollDemo custom cue="fade"/><div className="solution-warning"><strong>Use sparingly.</strong> Native keyboard, touch, forced-colors, zoom, and screen-reader behavior are harder to reproduce.</div></article>
    </section>
    <footer className="scroll-footer"><Link href="/">← Return to the map</Link><span>My starting recommendation: 01 + 02 + native scrolling.</span></footer>
  </main>
}

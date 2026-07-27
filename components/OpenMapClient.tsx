'use client'

import { useState } from 'react'
import Link from 'next/link'
import MapView from '@/components/MapView'
import { facilities } from '@/lib/facilities'

export default function OpenMapClient() {
  const [selected, setSelected] = useState(facilities[0])
  const showCandidates = process.env.NEXT_PUBLIC_SHOW_CANDIDATES === 'true'
  return <main className="shell open-map-page"><header className="topbar"><Link href="/" className="brand"><span className="brand-mark">D</span><span>DATA CENTER <i>IMPACT</i></span></Link><Link href="/" className="back">← Back to search</Link></header><div className="open-map-wrap"><p className="eyebrow">OPEN-SOURCE MAP</p><h1>OpenStreetMap view</h1><p className="open-map-intro">This alternate map uses MapLibre GL JS and OpenStreetMap tiles. It shows published and demo records, plus preliminary research records when staging is configured for review.</p><MapView facilities={facilities.filter((facility) => facility.publicationStatus === 'published' || facility.publicationStatus === 'demo' || (showCandidates && facility.publicationStatus === 'candidate'))} selected={selected} onSelect={setSelected} searchedLocation={null} /></div></main>
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import MapView from '@/components/MapView'
import { facilities } from '@/lib/facilities'

export default function OpenMapClient() {
  const [selected, setSelected] = useState(facilities[0])
  return <main className="shell open-map-page"><header className="topbar"><Link href="/" className="brand"><span className="brand-mark">G</span><span>GRIDLINE <i>HOUSTON</i></span></Link><Link href="/" className="back">← Back to search</Link></header><div className="open-map-wrap"><p className="eyebrow">OPEN-SOURCE MAP</p><h1>OpenStreetMap view</h1><p className="open-map-intro">This alternate map uses MapLibre GL JS and OpenStreetMap tiles. It is retained as the project’s open-source map option.</p><MapView facilities={facilities.filter((facility) => facility.publicationStatus === 'published' || facility.publicationStatus === 'demo')} selected={selected} onSelect={setSelected} searchedLocation={null} /></div></main>
}

'use client'

import Link from 'next/link'
import { useState } from 'react'

const technologies = [
  { name: 'MapLibre GL JS', label: 'CURRENT CHOICE', detail: 'Vector map renderer · custom pins', observed: 'Data Center Impact', mode: 'vector', note: 'Best fit for open rendering and future layers.' },
  { name: 'Leaflet', label: 'LIGHTWEIGHT OPTION', detail: 'Raster map renderer · DOM markers', observed: 'Brockovich Data Center Reporting', mode: 'leaflet', note: 'Simple and dependable for modest marker sets.' },
  { name: 'Mapbox GL JS', label: 'COMMERCIAL OPTION', detail: 'Vector map renderer · hosted ecosystem', observed: 'No confirmed reviewed site', mode: 'vector', note: 'Polished tooling with more platform coupling.' },
  { name: 'Google Maps', label: 'ADDRESS SPECIALIST', detail: 'Basemap renderer · Places search', observed: 'No confirmed reviewed site', mode: 'search', note: 'Strong address experience, less renderer control.' },
  { name: 'OpenLayers', label: 'GIS OPTION', detail: 'Projection and layer engine', observed: 'No confirmed reviewed site', mode: 'layers', note: 'Powerful for analysis-heavy GIS workflows.' },
  { name: 'ArcGIS Maps SDK', label: 'PLATFORM OPTION', detail: 'Hosted GIS · feature services', observed: 'ArcGIS Experience source application', mode: 'layers', note: 'Strong data services, heavier commitment.' },
]

function Demo({ mode }: { mode: string }) {
  const [selected, setSelected] = useState(0)
  return <div className="technology-demo">
    <div className="technology-map" aria-label="Interactive technology capability demo">
      <span className="demo-road road-one" /><span className="demo-road road-two" /><span className="demo-road road-three" />
      {[['pin-one', 'Built'], ['pin-two', 'Construction'], ['pin-three', 'Announced']].map(([className, label], index) => <button type="button" className={`technology-pin ${className} ${selected === index ? 'selected' : ''}`} onClick={() => setSelected(index)} aria-label={`Select ${label} facility`} key={className}>●</button>)}
      {mode === 'layers' && <div className="demo-layer-list"><span><i className="layer-dot land" /> Land</span><span><i className="layer-dot water" /> Water</span></div>}
      {mode === 'search' && <div className="demo-search">⌕ <span>Home address...</span><b>Address</b></div>}
      {mode !== 'layers' && mode !== 'search' && <div className="demo-style-toggle"><span className="style-dot" /> Vector style</div>}
      <div className="demo-popup"><strong>{selected === 0 ? 'Built facility' : selected === 1 ? 'Under construction' : 'Announced project'}</strong><small>{mode === 'leaflet' ? 'DOM marker + popup' : mode === 'vector' ? 'Vector source + symbol' : 'Feature selection'}</small></div>
    </div>
    <div className="technology-demo-foot"><span>Click a pin</span><span className="demo-status"><i className={`demo-status-dot status-${selected}`} /> selected</span></div>
  </div>
}

export default function MapTechnologyPage() {
  return <main className="learn-page technology-page">
    <header className="topbar"><Link href="/" className="brand"><span className="brand-mark">D</span><span>DATA CENTER <i>IMPACT</i></span></Link><Link href="/" className="back">← Back to map</Link></header>
    <section className="technology-intro"><div><p className="eyebrow">INTERACTION LAB · MAP TECHNOLOGY</p><h1>Same data. Different map tools.</h1><p>Compact capability demos for custom pins, selection, search surfaces, and future layers. These prototypes compare interaction patterns; they do not load six production map libraries at once.</p></div><div className="technology-verdict"><span>WORKING DECISION</span><strong>Keep MapLibre</strong><small>Choose the address provider separately.</small></div></section>
    <section className="technology-grid">{technologies.map((technology) => <article className="technology-card" key={technology.name}><div className="technology-card-heading"><div><span className="technology-label">{technology.label}</span><h2>{technology.name}</h2><p>{technology.detail}</p></div><span className="technology-index">0{technologies.indexOf(technology) + 1}</span></div><Demo mode={technology.mode} /><p className="technology-observed">Observed: {technology.observed}</p><p className="technology-note">{technology.note}</p></article>)}</section>
    <footer className="technology-footer"><Link href="/calculator">Calculator WIP →</Link><span>Map renderer and residential geocoder remain separate decisions.</span><Link href="/">Return to map →</Link></footer>
  </main>
}

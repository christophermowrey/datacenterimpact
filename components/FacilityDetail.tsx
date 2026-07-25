'use client'

import { useState } from 'react'
import Link from 'next/link'
import MapView from '@/components/MapView'
import type { Facility } from '@/lib/facilities'
import { scoreLabel } from '@/lib/scoring'

const scoreComponents = [
  ['Proximity and scale', '20%', 'Distance, facility class, and known site scale'],
  ['Electricity and grid', '20%', 'Reported load, substations, and interconnection evidence'],
  ['Generation and air', '15%', 'Generation type, permits, and documented capacity'],
  ['Water and cooling', '15%', 'Cooling method and reported water information'],
  ['Noise and vibration', '15%', 'Cooling, generators, transformers, and complaints'],
  ['Construction and traffic', '5%', 'Construction activity, duration, and traffic evidence'],
  ['Land use sensitivity', '5%', 'Homes, schools, flood context, and zoning'],
  ['Uncertainty buffer', '5%', 'Forward-looking adjustment for missing or changing facts'],
]

export default function FacilityDetail({ facility }: { facility: Facility }) {
  const [showWhy, setShowWhy] = useState(false)
  const [notice, setNotice] = useState<'correction' | 'shared' | null>(null)
  const [selected, setSelected] = useState(facility)

  function share() {
    if (navigator.share) navigator.share({ title: facility.name, url: window.location.href }).catch(() => undefined)
    else navigator.clipboard?.writeText(window.location.href).then(() => setNotice('shared'))
  }

  return <main className="detail-page"><header className="topbar"><Link href="/" className="brand"><span className="brand-mark">G</span><span>GRIDLINE <i>HOUSTON</i></span></Link><div className="detail-actions"><button className="text-button" onClick={share}>Copy/share page ↗</button><Link href="/" className="back">← Back to map</Link></div></header><div className="detail-wrap">
    <p className="eyebrow">FACILITY PROFILE · {facility.county.toUpperCase()} COUNTY</p>
    <div className="detail-title-row"><div><h1>{facility.name}</h1><div className="detail-meta"><span className={`status-pill ${facility.color}`}>{facility.statusLabel}</span><span>{facility.classLabel}</span><span className={`publication ${facility.publicationStatus}`}>{facility.publicationStatus}</span><span>Last reviewed {facility.verified}</span></div>{facility.officialWebsite && <a className="official-link" href={facility.officialWebsite.url} target="_blank" rel="noreferrer">{facility.officialWebsite.label} ↗</a>}</div><button className="outline-button" onClick={() => setNotice('correction')}>Report a correction</button></div>
    {notice === 'correction' && <div className="detail-notice">Correction mode is ready. Include this page URL and the specific fact that needs review in your report.</div>}{notice === 'shared' && <div className="detail-notice">Page URL copied to your clipboard.</div>}
    <div className="detail-grid"><section><MapView facilities={[facility]} selected={selected} onSelect={setSelected} searchedLocation={null} /><h2>What we know</h2><p className="detail-intro">{facility.summary}</p><div className="facts">{facility.metrics?.map((metric) => <div key={metric.label}><small>{metric.label.toUpperCase()}</small><strong>{metric.value}</strong>{metric.note && <span>{metric.note}</span>}</div>)}<div><small>OPERATOR / DEVELOPER</small><strong>{facility.operator}</strong></div><div><small>LOCATION PRECISION</small><strong>{facility.locationPrecision === 'exact' ? 'Verified address' : 'Approximate location'} {facility.locationPrecision !== 'exact' && <span className="tooltip-wrap"><button className="tooltip-button" aria-label="Why is this location approximate?">i</button><span className="tooltip-popup" role="tooltip">The reviewed official source does not publish a precise street address. The map point represents the general campus area.</span></span>}</strong></div><div><small>ADDRESS / AREA</small><strong>{facility.address ?? `${facility.city}, ${facility.county} County`}</strong></div></div></section><aside className="score-panel"><p className="eyebrow">NEIGHBORHOOD IMPACT RANGE</p><div className="big-score">{facility.score[0]}–{facility.score[1]}</div><strong>{scoreLabel(facility.score)} potential impact</strong><p>This is a transparent demo range, not a prediction of property value, health outcomes, or legal risk. Address-specific calculations will use the selected location and available evidence.</p><div className="confidence-row"><span>Evidence confidence</span><b>{facility.confidence}</b></div><button className="outline-button full" onClick={() => setShowWhy((value) => !value)}>Why this range? <span>{showWhy ? '↑' : '↓'}</span></button>{showWhy && <div className="why-panel"><p><b>How to read it</b></p><p>The lower end reflects supported inputs. The upper end includes conservative proxies for important missing facts. Missing information does not automatically mean zero impact.</p>{scoreComponents.map(([name, weight, basis]) => <div className="component-row" key={name}><span>{name}<small>{basis}</small></span><b>{weight}</b></div>)}</div>}</aside></div>
    <section className="detail-section"><div className="section-heading"><div><p className="eyebrow">EVIDENCE TRAIL</p><h2>Sources and timeline</h2></div><span className="confidence">{facility.sources.length} source{facility.sources.length === 1 ? '' : 's'}</span></div>{facility.milestones?.length ? <div className="timeline">{facility.milestones.map((milestone) => <div key={`${milestone.date}-${milestone.title}`}><span>{milestone.date}</span><p><b>{milestone.title}</b><br />{milestone.description}</p></div>)}</div> : <p className="empty-evidence">No verified milestones are published for this candidate record.</p>}{facility.sources.length ? <div className="source-list">{facility.sources.map((source) => <a className="source-card" href={source.url} target="_blank" rel="noreferrer" key={source.url}><span>PRIMARY / AUTHORITATIVE SOURCE</span><strong>{source.title}</strong><small>{source.publisher} · Accessed {source.accessed}</small><p>{source.supports}</p><b>Open source ↗</b></a>)}</div> : <div className="source-card source-empty"><span>RESEARCH STATUS</span><strong>Source review pending</strong><p>This record is retained in the private research workflow and is not currently published as verified evidence.</p></div>}</section>
    {facility.unknowns?.length ? <section className="detail-section unknown-section"><p className="eyebrow">KNOWN LIMITATIONS</p><h2>What remains unknown</h2><ul>{facility.unknowns.map((unknown) => <li key={unknown}>{unknown}</li>)}</ul></section> : null}
    <p className="disclaimer">Gridline Houston is informational and may contain incomplete or changing information. Always conduct independent legal, environmental, appraisal, and inspection due diligence.</p>
  </div></main>
}

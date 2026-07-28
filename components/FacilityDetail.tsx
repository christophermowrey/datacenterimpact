'use client'

import { useState } from 'react'
import Link from 'next/link'
import MapView from '@/components/MapView'
import type { Facility } from '@/lib/facilities'
import { communityMetricsFor, metricBasisLabel } from '@/lib/community-metrics'
import { parsePowerKw, powerSummary } from '@/lib/power'

const evidenceLabels: Record<string, string> = { High: 'Strong', Medium: 'Developing', Low: 'Limited', Preliminary: 'Early / unverified' }

export default function FacilityDetail({ facility }: { facility: Facility }) {
  const [notice, setNotice] = useState<'shared' | null>(null)
  const [selected, setSelected] = useState(facility)
  const communityMetrics = communityMetricsFor(facility)
  const powerMetric = facility.metrics?.find((metric) => /power|load|capacity/i.test(`${metric.label} ${metric.value}`))
  const powerKw = powerMetric ? parsePowerKw(powerMetric.value) : null
  const power = powerKw ? powerSummary(powerKw) : null
  const evidenceLabel = evidenceLabels[facility.confidence] ?? facility.confidence
  const technicalMetrics = facility.metrics?.length ? facility.metrics : [
    { label: 'Lifecycle status', value: facility.statusLabel, note: 'Inventory classification' },
    { label: 'Facility class', value: facility.classLabel, note: 'Inventory classification' },
    { label: 'Evidence quality', value: evidenceLabel, note: 'Based on the reviewed source trail' },
    { label: 'Location precision', value: facility.locationPrecision, note: 'The map point may not represent a parcel boundary' },
    { label: 'Source records', value: `${facility.sources.length}`, note: 'Reviewed source records attached to this facility' },
  ]

  function share() {
    if (navigator.share) navigator.share({ title: facility.name, url: window.location.href }).catch(() => undefined)
    else navigator.clipboard?.writeText(window.location.href).then(() => setNotice('shared'))
  }

  return <main className="detail-page">
    <header className="topbar"><Link href="/" className="brand"><span className="brand-mark">D</span><span>DATA CENTER <i>IMPACT</i></span></Link><div className="detail-actions"><button className="text-button" onClick={share}>Copy/share page ↗</button><Link href="/" className="back">← Back to map</Link></div></header>
    <div className="detail-wrap">
      <p className="eyebrow">FACILITY PROFILE · {facility.county.toUpperCase()} COUNTY</p>
      <div className="detail-title-row"><div><h1>{facility.name}</h1><div className="detail-meta"><span className={`status-pill ${facility.color}`}>{facility.status === 'operational' ? 'Built' : facility.statusLabel}</span><span>{facility.classLabel}</span><span>{facility.publicationStatus === 'candidate' ? 'Research candidate' : `Evidence: ${evidenceLabel}`}</span><span>Last reviewed {facility.verified}</span></div>{facility.officialWebsite && <a className="official-link" href={facility.officialWebsite.url} target="_blank" rel="noreferrer">{facility.officialWebsite.label} ↗</a>}</div><a className="outline-button correction-link" href={`https://github.com/christophermowrey/datacenterimpact/issues/new?template=correction.yml&title=${encodeURIComponent(`Correction: ${facility.name}`)}&labels=correction`} target="_blank" rel="noreferrer">Report a correction ↗</a></div>
      {notice === 'shared' && <div className="detail-notice" role="status">Page URL copied to your clipboard.</div>}

       <section className="community-metrics-section"><div className="section-heading"><div><p className="eyebrow">COMMUNITY METRICS</p><h2>What neighbors may notice</h2></div><span>Evidence shown in each tooltip</span></div><div className="community-metrics-grid">{communityMetrics.map((metric) => <article className="community-metric" key={metric.key}><div className="community-metric-label"><span className="metric-icon" aria-hidden="true">{metric.icon}</span><small>{metric.label.toUpperCase()}</small></div><strong>{metric.value}</strong><span className="metric-note">{metric.note}</span><span className="metric-basis-wrap"><button className="metric-basis" aria-label={`${metric.label}: ${metricBasisLabel(metric.basis)}`}>i</button><span className="metric-tooltip" role="tooltip">{metricBasisLabel(metric.basis)}</span></span></article>)}</div></section>

      <div className="detail-grid"><section><MapView facilities={[facility]} selected={selected} onSelect={(next) => setSelected(next)} searchedLocation={null} /><h2>About this facility</h2><p className="detail-intro">{facility.summary}</p><h2>Technical details</h2><div className="facts">{technicalMetrics.map((metric) => <div key={metric.label}><small>{metric.label.toUpperCase()}</small><strong>{metric.value}</strong>{metric.note && <span>{metric.note}</span>}</div>)}{power && <div className={power.significant ? 'power-fact significant' : 'power-fact'}><small>ELECTRICITY SCALE</small><strong>{power.label}</strong><span>Capacity comparison, not disclosed actual consumption.</span></div>}<div><small>OPERATOR / DEVELOPER</small><strong>{facility.operator}</strong></div><div><small>LOCATION</small><strong>{facility.locationPrecision === 'exact' ? 'Verified address' : 'Approximate location'} {facility.locationPrecision !== 'exact' && <span className="tooltip-wrap"><button className="tooltip-button" aria-label="Why is this location approximate?">i</button><span className="tooltip-popup" role="tooltip">The reviewed source does not publish a precise street address. The map point represents the general campus area.</span></span>}</strong></div><div><small>ADDRESS / AREA</small><strong>{facility.address ?? `${facility.city}, ${facility.county} County`}</strong></div></div></section></div>
      <section className="detail-section"><div className="section-heading"><div><p className="eyebrow">EVIDENCE TRAIL</p><h2>Sources and timeline</h2></div><span>{facility.sources.length} source{facility.sources.length === 1 ? '' : 's'}</span></div>{facility.milestones?.length ? <div className="timeline">{facility.milestones.map((milestone) => <div key={`${milestone.date}-${milestone.title}`}><span>{milestone.date}</span><p><b>{milestone.title}</b><br />{milestone.description}</p></div>)}</div> : <p className="empty-evidence">No verified milestones are published for this candidate record.</p>}{facility.sources.length ? <div className="source-list">{facility.sources.map((source) => <a className="source-card" href={source.url} target="_blank" rel="noreferrer" key={source.url}><span>{source.archived ? 'ARCHIVED SOURCE CAPTURE' : 'SOURCE RECORD'}</span><strong>{source.title}</strong><small>{source.publisher} · Accessed {source.accessed}</small><p>{source.supports}</p><b>Open source ↗</b></a>)}</div> : <div className="source-card source-empty"><span>RESEARCH STATUS</span><strong>Source review pending</strong><p>This record is retained in the research workflow and is not currently published as verified evidence.</p></div>}</section>
      {facility.unknowns?.length ? <section className="detail-section unknown-section"><p className="eyebrow">KNOWN LIMITATIONS</p><h2>What remains unknown</h2><ul>{facility.unknowns.map((unknown) => <li key={unknown}>{unknown}</li>)}</ul></section> : null}
    </div>
  </main>
}

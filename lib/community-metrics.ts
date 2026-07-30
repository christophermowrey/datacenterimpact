import type { Facility } from '@/lib/facilities'
import { parsePowerKw, powerSummary } from '@/lib/power'

export type MetricBasis = 'reported' | 'estimated' | 'proxy' | 'not_disclosed'
export type CommunityMetric = { key: string; label: string; icon: string; value: string; basis: MetricBasis; note: string }

const basisLabels: Record<MetricBasis, string> = {
  reported: 'Reported by an identified source',
  estimated: 'Calculated estimate from reported inputs',
  proxy: 'Benchmark proxy, not a facility measurement',
  not_disclosed: 'No facility-specific public value was found',
}

export function metricBasisLabel(basis: MetricBasis) {
  return basisLabels[basis]
}

export function communityMetricsFor(facility: Facility): CommunityMetric[] {
  const powerMetric = facility.metrics?.find((metric) => /power|load|capacity/i.test(`${metric.label} ${metric.value}`))
  const powerKw = powerMetric ? parsePowerKw(powerMetric.value) : null
  const power = powerKw ? powerSummary(powerKw) : null
  const elementCritical = facility.slug === 'element-critical-houston-one'
  const skybox = facility.slug === 'skybox-houston'
  const construction = facility.status === 'construction'

  return [
    {
      key: 'electricity',
      label: 'Electricity and grid',
      icon: '⚡',
      value: power && powerMetric ? `${powerMetric.value} listed capacity · approx. ${power.homes.toLocaleString()} Texas homes` : elementCritical ? '26 MW listed utility power · expandable' : 'Not publicly disclosed',
      basis: power && powerMetric ? 'reported' : elementCritical ? 'reported' : 'not_disclosed',
      note: power && powerMetric ? 'Capacity is not the same as actual consumption. The household comparison uses 1.5 kW average continuous draw.' : 'A facility-specific power figure was not found in the reviewed public sources.',
    },
    {
      key: 'water',
      label: 'Water consumption',
      icon: '💧',
      value: elementCritical ? 'Less than five Texas-home equivalents annually' : '0.0–2.0 L/kWh benchmark range',
      basis: elementCritical ? 'reported' : 'proxy',
      note: elementCritical ? 'Operator-reported closed-loop air-cooled system claim; annual gallons were not disclosed.' : 'Broad data-center water-use proxy. It is not a site measurement and should be replaced with WUE, gallons, or permit data when available.',
    },
    {
      key: 'air',
      label: 'Air pollution and generation',
       icon: '≋',
      value: skybox ? '2 MW generator units · 7,000 gal fuel per generator' : 'Not publicly disclosed',
      basis: skybox ? 'reported' : 'not_disclosed',
      note: skybox ? 'Company-reported backup-generation and fuel specifications; generator count and actual emissions were not disclosed.' : 'No facility-specific emissions inventory, permit limit, fuel consumption, or stack test was found in the current review.',
    },
    {
      key: 'sound',
      label: 'Sound pollution',
       icon: '〰',
      value: '55–85 dBA benchmark range at equipment boundary',
      basis: 'proxy',
      note: 'Comparable cooling and backup equipment proxy, not an off-site measurement. Property-line sound depends on equipment, barriers, distance, and operating mode.',
    },
    {
      key: 'vibration',
      label: 'Vibration',
       icon: '⌁',
      value: 'No facility-specific measurement',
      basis: 'not_disclosed',
      note: 'No public vibration study or property-line measurement was found. Generators, transformers, and construction can be relevant sources.',
    },
    {
      key: 'construction',
      label: 'Construction and traffic',
       icon: '🚧',
      value: construction ? 'Construction activity reported; traffic counts not disclosed' : skybox ? '96-hour backup runtime reported; traffic counts not disclosed' : 'Facility-specific traffic counts not disclosed',
      basis: construction ? 'reported' : 'not_disclosed',
      note: construction ? 'Lifecycle evidence indicates active or planned work, but route, duration, and truck counts require separate records.' : 'No facility-specific traffic study or operating-traffic count was found.',
    },
    {
      key: 'land',
      label: 'Land and flood context',
      icon: '⌂',
      value: elementCritical ? '20-acre campus · outside reported 100-/500-year floodplains' : facility.locationPrecision === 'exact' ? 'Exact address available; parcel context pending' : 'Approximate or candidate location',
      basis: elementCritical ? 'reported' : 'not_disclosed',
      note: elementCritical ? 'Operator-reported campus and floodplain claims; independent parcel and drainage review remains separate.' : 'Parcel, school, home, flood, zoning, and setback context require facility-specific review.',
    },
  ]
}

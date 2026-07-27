import type { Facility } from '@/lib/facilities'
import { parsePowerKw, powerSummary, SIGNIFICANT_HOME_THRESHOLD } from '@/lib/power'

export type ImpactCategory = 'electricity' | 'generation' | 'water' | 'noise' | 'vibration' | 'landUse' | 'scale'
export type ImpactComponent = { category: ImpactCategory; lower: number; upper: number; decay: number; weight: number; rationale: string }
export type ImpactResult = { lower: number; upper: number; midpoint: number; label: string; components: ImpactComponent[]; regionalEffects: string[] }

export function impactTone(lower: number, upper: number) {
  const midpoint = (lower + upper) / 2
  return midpoint < 20 ? 'minimal' : midpoint < 40 ? 'low' : midpoint < 60 ? 'moderate' : midpoint < 80 ? 'high' : 'very-high'
}

function band(score: number) {
  return score < 20 ? 'Minimal' : score < 40 ? 'Low' : score < 60 ? 'Moderate' : score < 80 ? 'High' : 'Very high'
}

export const impactWeights: Record<ImpactCategory, number> = { water: 25, electricity: 20, generation: 20, noise: 15, vibration: 10, landUse: 5, scale: 5 }
const decayMiles: Record<ImpactCategory, number> = { water: 5, electricity: 5, generation: 2, noise: 0.5, vibration: 0.25, landUse: 5, scale: 5 }
const decayPower: Record<ImpactCategory, number> = { water: 0.35, electricity: 0.6, generation: 1.1, noise: 1.35, vibration: 2, landUse: 1, scale: 1 }
const regionalFloor: Partial<Record<ImpactCategory, number>> = { water: 0.7, electricity: 0.8 }
const regionalElectricityBaseline = { lower: 1, upper: 2 }

function distanceDecay(distanceMiles: number, category: ImpactCategory) {
  const ratio = Math.max(distanceMiles, 0) / decayMiles[category]
  const local = 1 / (1 + ratio ** decayPower[category])
  const floor = regionalFloor[category] ?? 0
  return floor + (1 - floor) * local
}

export function calculateImpact(facility: Facility, distanceMiles: number): ImpactResult {
  const profile = facility.impactProfile ?? {}
  const components = (Object.keys(impactWeights) as ImpactCategory[]).map((category) => {
    const values = category === 'scale' ? profile.scale ?? profile.proximity ?? [0.15, 0.55] : category === 'vibration' ? profile.vibration ?? [0.05, 0.3] : profile[category] ?? [0.15, 0.55]
    const decay = distanceDecay(distanceMiles, category)
    return { category, lower: values[0] * impactWeights[category] * decay, upper: values[1] * impactWeights[category] * decay, decay, weight: impactWeights[category], rationale: category === 'generation' && values[1] > values[0] + 0.3 ? 'Upper bound includes conservative backup-generation proxy.' : 'Category-specific distance factor.' }
  })
  const powerMetric = facility.metrics?.find((metric) => /power|load|capacity/i.test(`${metric.label} ${metric.value}`))
  const powerKw = powerMetric ? parsePowerKw(powerMetric.value) : null
  const power = powerKw ? powerSummary(powerKw) : null
  const hasSignificantPower = power ? power.homes >= SIGNIFICANT_HOME_THRESHOLD : true
  const baseline = hasSignificantPower ? regionalElectricityBaseline : { lower: 1, upper: 1 }
  const lower = Math.max(baseline.lower, Math.round(components.reduce((total, component) => total + component.lower, 0) + baseline.lower))
  const upper = Math.min(100, Math.max(lower, Math.round(components.reduce((total, component) => total + component.upper, 0) + baseline.upper)))
  const lowerBand = band(lower)
  const upperBand = band(upper)
    return { lower, upper, midpoint: Math.round((lower + upper) / 2), label: lowerBand === upperBand ? lowerBand : `${lowerBand} to ${upperBand}`, components, regionalEffects: [`Electricity and water retain regional floors because grid planning, utility capacity, watersheds, and rate effects do not disappear at a five-mile boundary. Facilities above ${SIGNIFICANT_HOME_THRESHOLD} homes equivalent start at one electricity point before local effects are considered.`, 'Air uses a screening dispersion proxy, while sound and vibration use faster physical attenuation. These are not substitutes for EPA air modeling, acoustic studies, or engineering measurements.'] }
}

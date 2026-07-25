import type { Facility } from '@/lib/facilities'

export type ImpactCategory = 'proximity' | 'electricity' | 'generation' | 'water' | 'noise' | 'traffic' | 'landUse'
export type ImpactComponent = { category: ImpactCategory; lower: number; upper: number; decay: number; weight: number; rationale: string }
export type ImpactResult = { lower: number; upper: number; midpoint: number; label: string; components: ImpactComponent[]; regionalEffects: string[] }

const weights: Record<ImpactCategory, number> = { proximity: 20, electricity: 20, generation: 15, water: 15, noise: 15, traffic: 5, landUse: 5 }
const decayMiles: Record<ImpactCategory, number> = { proximity: 5, electricity: 5, generation: 2, water: 5, noise: 0.5, traffic: 2, landUse: 5 }
const decayPower: Record<ImpactCategory, number> = { proximity: 0.8, electricity: 0.6, generation: 1.1, water: 0.35, noise: 1.35, traffic: 1, landUse: 1 }
const regionalElectricityBaseline = { lower: 1, upper: 2 }

function distanceDecay(distanceMiles: number, category: ImpactCategory) {
  if (distanceMiles > 5) return 0
  const ratio = Math.max(distanceMiles, 0) / decayMiles[category]
  return 1 / (1 + ratio ** decayPower[category])
}

export function calculateImpact(facility: Facility, distanceMiles: number): ImpactResult {
  const profile = facility.impactProfile ?? {}
  const components = (Object.keys(weights) as ImpactCategory[]).map((category) => {
    const values = profile[category] ?? [0.15, 0.55]
    const decay = distanceDecay(distanceMiles, category)
    return { category, lower: values[0] * weights[category] * decay, upper: values[1] * weights[category] * decay, decay, weight: weights[category], rationale: category === 'generation' && values[1] > values[0] + 0.3 ? 'Upper bound includes conservative backup-generation proxy.' : 'Distance-decayed local contribution.' }
  })
  const lower = Math.max(regionalElectricityBaseline.lower, Math.round(components.reduce((total, component) => total + component.lower, 0) + regionalElectricityBaseline.lower))
  const upper = Math.min(100, Math.max(lower, Math.round(components.reduce((total, component) => total + component.upper, 0) + regionalElectricityBaseline.upper)))
  return { lower, upper, midpoint: Math.round((lower + upper) / 2), label: upper >= 80 ? 'Very high' : upper >= 60 ? 'High' : upper >= 40 ? 'Moderate' : 'Low', components, regionalEffects: ['Minimal regional electricity baseline included: Houston facilities draw from an interconnected ERCOT system and local transmission/distribution network, even when a searched address is more than five miles away.', 'Electricity rates, regional water availability, and utility expansion are tracked separately and are not distance-decayed parcel impacts.'] }
}

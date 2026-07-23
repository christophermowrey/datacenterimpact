export const scoreLabel = (score: [number, number]) => score[1] >= 80 ? 'Very high' : score[1] >= 60 ? 'High' : score[1] >= 40 ? 'Moderate' : 'Low'

export function calculateImpactRange(input: { distanceMiles: number; scale: number; uncertainty: number }): [number, number] {
  const proximity = Math.max(0, Math.min(20, Math.round((5 - input.distanceMiles) * 4)))
  const known = Math.max(0, Math.min(75, proximity + input.scale))
  const upper = Math.max(known, Math.min(100, known + Math.max(0, input.uncertainty)))
  return [known, upper]
}

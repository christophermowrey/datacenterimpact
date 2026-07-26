export const TEXAS_HOME_AVERAGE_KW = 1.5
export const SIGNIFICANT_HOME_THRESHOLD = 100

export function homesEquivalentFromKw(powerKw: number) {
  return Math.round(powerKw / TEXAS_HOME_AVERAGE_KW)
}

export function parsePowerKw(value: string) {
  const match = value.match(/([\d,.]+)\s*(MW|kW)\b/i)
  if (!match) return null
  const amount = Number(match[1].replace(/,/g, ''))
  if (!Number.isFinite(amount)) return null
  return Math.round(amount * (match[2].toLowerCase() === 'mw' ? 1000 : 1))
}

export function powerSummary(powerKw: number) {
  const homes = homesEquivalentFromKw(powerKw)
  return {
    homes,
    significant: homes >= SIGNIFICANT_HOME_THRESHOLD,
    label: `Approx. ${homes.toLocaleString()} Texas homes' average electricity use`,
  }
}

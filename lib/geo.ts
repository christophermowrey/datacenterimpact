export type CoverageStatus = 'supported' | 'outside'

export function getCoverageStatus(latitude: number, longitude: number): CoverageStatus {
  // A deliberately broad launch envelope for Harris, Fort Bend, and Katy.
  return latitude >= 29.25 && latitude <= 30.25 && longitude >= -96.2 && longitude <= -94.95 ? 'supported' : 'outside'
}

export function haversineMiles(from: { latitude: number; longitude: number }, to: { latitude: number; longitude: number }) {
  const earthRadiusMiles = 3958.8
  const radians = (value: number) => value * Math.PI / 180
  const latitudeDelta = radians(to.latitude - from.latitude)
  const longitudeDelta = radians(to.longitude - from.longitude)
  const a = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(radians(from.latitude)) * Math.cos(radians(to.latitude)) * Math.sin(longitudeDelta / 2) ** 2
  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function formatMiles(miles: number) {
  return miles < 10 ? miles.toFixed(1) : Math.round(miles).toString()
}

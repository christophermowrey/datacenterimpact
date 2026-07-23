import test from 'node:test'
import assert from 'node:assert/strict'

function haversineMiles(from, to) {
  const earthRadiusMiles = 3958.8
  const radians = (value) => value * Math.PI / 180
  const latitudeDelta = radians(to.latitude - from.latitude)
  const longitudeDelta = radians(to.longitude - from.longitude)
  const a = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(radians(from.latitude)) * Math.cos(radians(to.latitude)) * Math.sin(longitudeDelta / 2) ** 2
  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

test('distance is zero for the same coordinate', () => {
  assert.equal(haversineMiles({ latitude: 29.67, longitude: -95.41 }, { latitude: 29.67, longitude: -95.41 }), 0)
})

test('distance is reported in miles for Houston-area points', () => {
  const miles = haversineMiles({ latitude: 29.671, longitude: -95.412 }, { latitude: 29.743, longitude: -95.404 })
  assert.ok(miles > 4 && miles < 6)
})

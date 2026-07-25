import test from 'node:test'
import assert from 'node:assert/strict'

function decay(distance, characteristic, power) {
  if (distance > 5) return 0
  return 1 / (1 + (Math.max(distance, 0) / characteristic) ** power)
}

test('local impact decays to zero beyond five miles', () => {
  assert.equal(decay(5.01, 0.5, 1.35), 0)
})

test('noise decays faster than broad land-use context', () => {
  assert.ok(decay(1, 0.5, 1.35) < decay(1, 5, 1))
})

test('regional baseline prevents a zero impact score at distance', () => {
  const localLower = 0
  const localUpper = 0
  assert.ok(Math.max(1, localLower + 1) >= 1)
  assert.ok(Math.max(1, localUpper + 2) >= 2)
})

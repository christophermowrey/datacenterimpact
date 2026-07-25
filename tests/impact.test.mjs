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

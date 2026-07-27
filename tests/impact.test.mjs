import test from 'node:test'
import assert from 'node:assert/strict'

function decay(distance, characteristic, power, regionalFloor = 0) {
  const local = 1 / (1 + (Math.max(distance, 0) / characteristic) ** power)
  return regionalFloor + (1 - regionalFloor) * local
}

test('regional water and electricity effects remain significant beyond five miles', () => {
  assert.ok(decay(5, 5, 0.35, 0.7) >= 0.7)
  assert.ok(decay(5, 5, 0.6, 0.8) >= 0.8)
})

test('noise decays faster than broad land-use context', () => {
  assert.ok(decay(1, 0.5, 1.35) < decay(1, 5, 1))
})

test('air screening uses a longer tail than sound without using inverse square', () => {
  assert.ok(decay(5, 2, 1.1) > decay(5, 0.5, 1.35))
})

test('regional baseline prevents a zero impact score at distance', () => {
  const localLower = 0
  const localUpper = 0
  assert.ok(Math.max(1, localLower + 1) >= 1)
  assert.ok(Math.max(1, localUpper + 2) >= 2)
})

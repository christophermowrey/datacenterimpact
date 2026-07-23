import test from 'node:test'
import assert from 'node:assert/strict'

function calculateImpactRange({ distanceMiles, scale, uncertainty }) {
  const proximity = Math.max(0, Math.min(20, Math.round((5 - distanceMiles) * 4)))
  const known = Math.max(0, Math.min(75, proximity + scale))
  const upper = Math.max(known, Math.min(100, known + Math.max(0, uncertainty)))
  return [known, upper]
}

test('impact range stays bounded and preserves lower/upper order', () => {
  assert.deepEqual(calculateImpactRange({ distanceMiles: 1, scale: 35, uncertainty: 22 }), [51, 73])
  assert.deepEqual(calculateImpactRange({ distanceMiles: 12, scale: 90, uncertainty: 30 }), [75, 100])
})

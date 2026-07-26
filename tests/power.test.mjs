import test from 'node:test'
import assert from 'node:assert/strict'

function homesEquivalentFromKw(powerKw) {
  return Math.round(powerKw / 1.5)
}

test('26 MW is approximately 17,333 Texas homes equivalent', () => {
  assert.equal(homesEquivalentFromKw(26000), 17333)
})

test('100 homes is the significant electricity threshold', () => {
  assert.ok(homesEquivalentFromKw(150) >= 100)
  assert.ok(homesEquivalentFromKw(149) < 100)
})

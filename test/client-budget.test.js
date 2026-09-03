import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'

describe('client.js line budget (AGENTS.md §1)', () => {
  it('stays within 150 lines', () => {
    const n = readFileSync(new URL('../client.js', import.meta.url), 'utf8').split('\n').length
    assert.ok(n <= 150, `client.js is ${n} lines (limit 150)`)
  })
})

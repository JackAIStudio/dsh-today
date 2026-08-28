import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import { expandHome, resolveDshspaceRoot, resolveTodayPath, todayStamp } from '../resolve.js'

describe('todayStamp', () => {
  it('zero-pads month and day', () => {
    assert.equal(todayStamp(new Date(2026, 7, 9)), '2026-08-09')
  })
})

describe('expandHome', () => {
  it('expands ~/', () => {
    const got = expandHome('~/Documents/dshspace')
    assert.ok(got.endsWith(`${join('Documents', 'dshspace')}`))
    assert.ok(!got.startsWith('~'))
  })
})

describe('resolveDshspaceRoot', () => {
  it('prefers config.root', () => {
    assert.equal(
      resolveDshspaceRoot({ root: '/opt/dshspace' }, {}, '/home/node'),
      '/opt/dshspace',
    )
  })

  it('uses DSHSPACE when config is empty', () => {
    assert.equal(
      resolveDshspaceRoot({}, { DSHSPACE: '/data/dshspace' }, '/home/node'),
      '/data/dshspace',
    )
  })

  it('falls back to ~/dshspace when Documents/dshspace is missing', () => {
    const home = mkdtempSync(join(tmpdir(), 'dsh-today-'))
    try {
      assert.equal(resolveDshspaceRoot({}, {}, home), join(home, 'dshspace'))
    } finally {
      rmSync(home, { recursive: true, force: true })
    }
  })

  it('uses ~/Documents/dshspace when that directory exists', () => {
    const home = mkdtempSync(join(tmpdir(), 'dsh-today-'))
    try {
      mkdirSync(join(home, 'Documents', 'dshspace'), { recursive: true })
      assert.equal(
        resolveDshspaceRoot({}, {}, home),
        join(home, 'Documents', 'dshspace'),
      )
    } finally {
      rmSync(home, { recursive: true, force: true })
    }
  })
})

describe('resolveTodayPath', () => {
  it('nests YYYY-MM-DD under days/', () => {
    const got = resolveTodayPath({ root: '/ws' }, {}, new Date(2026, 7, 29), '/home/node')
    assert.deepEqual(got, {
      root: '/ws',
      daysRoot: join('/ws', 'days'),
      date: '2026-08-29',
      path: join('/ws', 'days', '2026-08-29'),
    })
  })
})

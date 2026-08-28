import { existsSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

export function expandHome(input) {
  const raw = String(input || '').trim()
  if (raw === '' || raw === '~') return homedir()
  if (raw.startsWith('~/')) return join(homedir(), raw.slice(2))
  return raw
}

export function todayStamp(now = new Date()) {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function isDirectory(path) {
  try {
    return statSync(path).isDirectory()
  } catch {
    return false
  }
}

/**
 * dshspace root. Config and env win; otherwise Documents/dshspace if it
 * exists (Mac/Windows), else ~/dshspace (Linux containers without Documents).
 */
export function resolveDshspaceRoot(config = {}, env = process.env, home = homedir()) {
  const fromConfig = typeof config.root === 'string' ? config.root.trim() : ''
  if (fromConfig !== '') return expandHome(fromConfig)
  const fromEnv = typeof env.DSHSPACE === 'string' ? env.DSHSPACE.trim() : ''
  if (fromEnv !== '') return expandHome(fromEnv)
  const documents = join(home, 'Documents', 'dshspace')
  if (existsSync(documents) && isDirectory(documents)) return documents
  return join(home, 'dshspace')
}

export function resolveTodayPath(config = {}, env = process.env, now = new Date(), home = homedir()) {
  const root = resolveDshspaceRoot(config, env, home)
  const date = todayStamp(now)
  const daysRoot = join(root, 'days')
  return { root, daysRoot, date, path: join(daysRoot, date) }
}

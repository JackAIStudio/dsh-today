import { mkdir } from 'node:fs/promises'
import { resolveTodayPath } from './resolve.js'

export const name = 'dsh-today'
export const inject = ['webServer']

const ROUTE = '/dsh-today/open'
const INFO = '/dsh-today/info'

function sendJson(res, statusCode, value) {
  const body = JSON.stringify(value)
  res.statusCode = statusCode
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.setHeader('content-length', String(Buffer.byteLength(body)))
  res.end(body)
}

function registerExact(ctx, webServer, path, handler, label) {
  ctx.effect(() => webServer.register({
    kind: 'exact',
    path,
    handler,
  }), label)
}

export function apply(ctx, config = {}) {
  ctx.inject(['webServer'], (web) => {
    const webServer = web.get('webServer')

    registerExact(web, webServer, INFO, (req, res) => {
      if (req.method !== 'GET') {
        res.setHeader('allow', 'GET')
        sendJson(res, 405, { ok: false, error: 'method not allowed' })
        return
      }
      const info = resolveTodayPath(config)
      sendJson(res, 200, { ok: true, ...info })
    }, 'dsh-today/info')

    registerExact(web, webServer, ROUTE, async (req, res) => {
      if (req.method !== 'POST') {
        res.setHeader('allow', 'POST')
        sendJson(res, 405, { ok: false, error: 'method not allowed' })
        return
      }
      try {
        const info = resolveTodayPath(config)
        await mkdir(info.path, { recursive: true })
        sendJson(res, 200, { ok: true, created: true, ...info })
      } catch (error) {
        sendJson(res, 500, {
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }, 'dsh-today/open')
  })
}

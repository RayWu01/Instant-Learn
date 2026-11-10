// 财务自由 · Host 半边
// 1. /finance/           资料库页面（gallery/index.html）
// 2. ctx.skills          注册 /财务自由 skill（skills/finance/SKILL.md）
import { createReadStream, existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const BASE = '/finance'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
}

export const name = 'finance'
export const inject = ['webServer', 'skills']

function safeFile(rel) {
  const file = join(ROOT, 'gallery', rel)
  if (!file.startsWith(join(ROOT, 'gallery') + sep) || !existsSync(file) || !statSync(file).isFile()) return null
  return file
}

function serve(req, res, file) {
  const type = MIME[extname(file).toLowerCase()] || 'application/octet-stream'
  res.writeHead(200, { 'content-type': type, 'content-length': statSync(file).size, 'cache-control': 'no-cache' })
  if (req.method === 'HEAD') return res.end()
  createReadStream(file).pipe(res)
}

function parseSkill(file) {
  const text = readFileSync(file, 'utf8')
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!m) return null
  const field = (k) => (m[1].match(new RegExp(`^${k}:\\s*(.+)$`, 'm')) || [])[1]?.trim().replace(/^(["'])(.*)\1$/, '$2')
  const name = field('name')
  const description = field('description')
  return name && description ? { name, description, body: text.slice(m[0].length) } : null
}

function readSkills() {
  const dir = join(ROOT, 'skills')
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(dir, d.name, 'SKILL.md')))
    .map((d) => ({ dir: join(dir, d.name), file: join(dir, d.name, 'SKILL.md'), ...parseSkill(join(dir, d.name, 'SKILL.md')) }))
    .filter((s) => s.name)
}

export function apply(ctx) {
  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'prefix',
      path: BASE,
      async handler(req, res) {
        const url = new URL(req.url || '/', 'http://x')
        const rest = decodeURIComponent(url.pathname.slice(BASE.length)) || '/'
        const rel = rest === '/' ? 'index.html' : rest.slice(1)
        const file = safeFile(rel)
        if (!file) {
          res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
          return res.end('not found')
        }
        serve(req, res, file)
      },
    }),
  )

  ctx.effect(() =>
    ctx.skills.registerProvider(() => {
      const candidate = (s) => ({
        name: s.name, description: s.description, path: s.file,
        invocation: { modelInvocable: true, userInvocable: true },
        source: 'bundled', provider: 'finance', rank: 610, locator: s.dir,
        resourceBase: { kind: 'directory', path: s.dir },
      })
      return {
        name: 'finance',
        async list() { return readSkills().map(candidate) },
        async get(c) {
          const s = readSkills().find((x) => x.dir === c.locator && x.name === c.name)
          if (!s) return undefined
          const content = s.body.replaceAll('<SKILL_ROOT>', s.dir)
          const { rank, locator, ...summary } = candidate(s)
          return { ...summary, content }
        },
      }
    }),
  )
}

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const dataPath = join(root, 'gallery', 'data.json')
const d = JSON.parse(readFileSync(dataPath, 'utf8'))
const rows = d.books.filter((b) => b.pdf)
const outDir = join(root, 'gallery', 'books')
mkdirSync(outDir, { recursive: true })

const toRaw = (u) =>
  u.replace(
    'github.com/codeman008/Financial_freedom/blob/main/',
    'raw.githubusercontent.com/codeman008/Financial_freedom/main/',
  )

let ok = 0
let fail = 0

for (const b of rows) {
  const url = toRaw(b.pdf)
  const file = join(outDir, b.title + '.pdf')
  try {
    const r = await fetch(url, { redirect: 'follow' })
    if (!r.ok) throw new Error('HTTP ' + r.status)
    const buf = Buffer.from(await r.arrayBuffer())
    writeFileSync(file, buf)
    b.pdf = 'books/' + b.title + '.pdf'
    ok++
    console.log('OK   ' + (buf.length / 1048576).toFixed(1) + ' MB  ' + b.title)
  } catch (e) {
    fail++
    console.log('FAIL ' + b.title + '  ' + e.message)
  }
}

writeFileSync(dataPath, JSON.stringify(d, null, 2) + '\n')
console.log(`\nDONE  ok=${ok}  fail=${fail}`)

// Resize and compress recipe photos so the repo stays lean.
//   npm run images            → every image in public/images
//   node … --staged           → only images staged for commit (used by the pre-commit hook)
// Images keep their file name and format (so frontmatter links don't break); files that are
// already small enough are left untouched, so running this repeatedly doesn't degrade quality.
// Uploads via /admin are already converted to WebP by Sveltia (see public/admin/config.yml).
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const DIR = 'public/images'
const MAX_WIDTH = 1200
const MAX_BYTES = 350 * 1024
const EXT = /\.(jpe?g|png|webp)$/i

const staged = process.argv.includes('--staged')
const files = staged
  ? execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=AM', '--', DIR], { encoding: 'utf8' })
      .split('\n')
      .filter((f) => EXT.test(f))
  : fs.readdirSync(DIR).filter((f) => EXT.test(f)).map((f) => path.join(DIR, f))

for (const file of files) {
  const input = fs.readFileSync(file)
  const { width = 0, format } = await sharp(input).metadata()
  if (width <= MAX_WIDTH && input.length <= MAX_BYTES) continue

  let img = sharp(input).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true })
  if (format === 'jpeg') img = img.jpeg({ quality: 80, mozjpeg: true })
  else if (format === 'png') img = img.png({ compressionLevel: 9, palette: true })
  else img = img.webp({ quality: 80 })

  const output = await img.toBuffer()
  if (output.length >= input.length && width <= MAX_WIDTH) continue
  fs.writeFileSync(file, output)
  console.log(`optimized ${file}: ${kb(input.length)} → ${kb(output.length)}`)
  if (staged) execFileSync('git', ['add', file])
}

function kb(n) {
  return `${Math.round(n / 1024)} kB`
}

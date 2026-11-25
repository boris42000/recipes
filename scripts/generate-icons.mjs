// Regenerate PWA icons from public/icon.svg: `npm run icons`
import sharp from 'sharp'

const src = 'public/icon.svg'
const out = (name, size, opts = {}) =>
  sharp(src, { density: 384 }).resize(size, size, opts).png().toFile(`public/${name}`)

await out('icon-192.png', 192)
await out('icon-512.png', 512)
await out('apple-touch-icon.png', 180)
// Maskable: the OS may crop to a circle, so shrink the artwork into the 80% safe zone.
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#b4532a' } })
  .composite([{ input: await sharp(src, { density: 384 }).resize(410, 410).png().toBuffer(), gravity: 'center' }])
  .png()
  .toFile('public/icon-maskable-512.png')
console.log('Icons written to public/')

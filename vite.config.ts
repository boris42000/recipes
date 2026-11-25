import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { recipesPlugin } from './build/recipes-plugin.ts'

// GitHub Pages project site: https://<user>.github.io/recipes/
const base = '/recipes/'

/** GitHub Pages serves 404.html for unknown paths, so deep links boot the SPA. */
function spaFallback(): Plugin {
  let outDir = ''
  return {
    name: 'spa-404-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      fs.copyFileSync(path.join(outDir, 'index.html'), path.join(outDir, '404.html'))
    },
  }
}

export default defineConfig({
  base,
  plugins: [
    react(),
    recipesPlugin({ dir: 'recipes', publicDir: 'public' }),
    spaFallback(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Naše recepty',
        short_name: 'Recepty',
        description: 'Naše domáce recepty – aj offline v kuchyni.',
        lang: 'sk',
        theme_color: '#b4532a',
        background_color: '#fbf7f2',
        display: 'standalone',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Recipe data is bundled into the JS, so precaching the app shell makes every recipe's text
        // available offline. Photos are cached the first time they are viewed.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        globIgnores: ['404.html', 'admin/**', 'images/**'],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/\/admin\//],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith(`${base}images/`),
            handler: 'CacheFirst',
            options: {
              cacheName: 'recipe-images',
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
})

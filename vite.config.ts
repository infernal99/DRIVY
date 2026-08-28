import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      // injectManifest (a hand-written service worker) instead of the
      // default generateSW, so we can add our own `push` / `notificationclick`
      // listeners for Fase 2 (web push) alongside the precached app shell.
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      manifest: {
        name: 'DRIVY — Permiso B',
        short_name: 'DRIVY',
        description: 'Aprende y practica el examen teórico del permiso B con contenido basado en fuentes oficiales de la DGT.',
        theme_color: '#2F6FED',
        background_color: '#F4F6FB',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      injectManifest: {
        // App shell (JS/CSS/HTML) precached for offline app boot. Supabase
        // API calls are deliberately left alone (no runtime caching rule) —
        // progress/friends/battles data must always be fresh or rejected,
        // never served stale from a cache.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
    }),
  ],
})

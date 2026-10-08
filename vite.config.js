import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Absolute production URL (with trailing slash) for the canonical link, share tags, robots.txt and
// sitemap. On Vercel it is the project's production domain: the custom domain once one is added,
// otherwise *.vercel.app. Set SITE_URL to override it anywhere.
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL
const SITE_URL = (process.env.SITE_URL || (productionHost ? `https://${productionHost}` : 'https://example.com')).replace(
  /\/*$/,
  '/',
)

// Fills __SITE_URL__ in index.html and emits robots.txt + sitemap.xml for the one-page site.
function seo() {
  return {
    name: 'seo',
    transformIndexHtml: html => html.replaceAll('__SITE_URL__', SITE_URL),
    buildStart() {
      if (SITE_URL === 'https://example.com/') this.warn('SITE_URL is not set; using https://example.com/')
    },
    generateBundle() {
      const lastmod = new Date().toISOString().slice(0, 10)
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>
</urlset>
`,
      })
    },
  }
}

// `vite preview` sends the same site-wide headers as Vercel (vercel.json), so e2e runs under the real CSP.
const vercelHeaders = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8')).headers
const siteHeaders = Object.fromEntries(
  vercelHeaders.find(rule => rule.source === '/(.*)').headers.map(({ key, value }) => [key, value]),
)

// Vendor code in its own long-cached chunks, so a content change doesn't re-download React or the animation libraries.
const vendorChunks = [
  { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
  { name: 'motion', test: /node_modules[\\/](motion|motion-dom|motion-utils|framer-motion)[\\/]/ },
  { name: 'gsap', test: /node_modules[\\/](gsap|@gsap)[\\/]/ },
]

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  build: {
    rolldownOptions: {
      output: { codeSplitting: { groups: vendorChunks } },
    },
  },
  preview: { headers: siteHeaders },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.jsx',
    include: ['src/**/*.test.{js,jsx}'],
    css: false,
  },
})

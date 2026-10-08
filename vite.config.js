import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { faqs, packages, profile, services } from './src/data.js'

// Absolute production URL (with trailing slash) for the canonical link, share tags, robots.txt and
// sitemap. On Vercel it is the project's production domain: the custom domain once one is added,
// otherwise *.vercel.app. Set SITE_URL to override it anywhere.
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL
const SITE_URL = (process.env.SITE_URL || (productionHost ? `https://${productionHost}` : 'https://example.com')).replace(
  /\/*$/,
  '/',
)

// llms.txt (https://llmstxt.org): a plain-Markdown summary of the site for AI agents, built from src/data.js.
function llmsTxt(site) {
  const list = items => items.map(item => `- ${item}`).join('\n')
  return `# ${profile.name}

> ${profile.tagline}

${profile.name} is an early-career video and content editor. ${profile.location}. Every edit shown is his own concept work; there are no brand clients yet. Prices are starting rates in US dollars.

## Site

${list([
  `[Work](${site}#work): example edits, one editing technique each`,
  `[Before & after](${site}#craft): raw footage next to the finished grade or composite`,
  `[Services](${site}#services): what he edits and how fast`,
  `[Pricing](${site}#pricing): packages and the free 60-second test edit`,
  `[Process](${site}#process): how a project runs, from footage to final export`,
  `[FAQ](${site}#faq): turnaround, revisions, file sharing, ownership and music licensing`,
  `[Contact](${site}#contact): project inquiry form`,
  `[Email](mailto:${profile.email}): ${profile.email}`,
])}

## Services

${list(services.map(s => `${s.title} (${s.turnaround}): ${s.body}`))}

## Pricing

${list(packages.map(p => `${p.name}: from $${p.price} ${p.unit}, ${p.turnaround}, ${p.revisions}. ${p.audience}`))}

## FAQ

${list(faqs.map(f => `${f.question} ${f.answer}`))}
`
}

// Fills __SITE_URL__ in index.html and emits robots.txt, sitemap.xml and llms.txt for the one-page site.
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
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: llmsTxt(SITE_URL) })
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

# Editor portfolio

Single-page portfolio for a video/content editor. Built with React, Vite and Tailwind CSS v4, plus React Bits components.

- Content: `src/data.js`
- Section order: `src/App.jsx`
- Design tokens: `@theme` in `src/index.css`

## Scripts

```sh
yarn dev          # dev server
yarn build        # production build
yarn test         # Vitest unit tests
yarn test:e2e     # Playwright cross-device tests (builds and serves on :4173)
yarn lint         # oxlint
```

## Deploy (Vercel)

Import the GitHub repo in Vercel; `vercel.json` sets the build (`yarn build` → `dist`), security
headers and caching. The production URL in the canonical link, share tags, `robots.txt` and
`sitemap.xml` comes from Vercel automatically (custom domain once added); set `SITE_URL` to override.

Before launch: add the Web3Forms key (`inquiry.web3formsKey`) and real social links (`profile.socials`)
in `src/data.js`.

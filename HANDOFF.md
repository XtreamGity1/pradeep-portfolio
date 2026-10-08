# Handoff — editor portfolio (Pradeep Vangoori)

Last updated: 2026-10-07. Branch `master`, no git remote (nothing pushed). Use **yarn** (1.22), never npm.

## What this is
Single-page portfolio for **Pradeep Vangoori**, an early-career video/content editor (no brand clients
yet; everything is his own concept work). React 19 + Vite 8 + Tailwind v4 + React Bits; Vitest +
Testing Library; Playwright e2e on 6 device profiles (mobile-small, mobile, tablet-small, tablet,
tablet-landscape, laptop). Working style the user asked for: **TDD** (failing test first) and
**responsive on phone, tablet and laptop**. Keep content honest: no brand clients, no inflated
metrics, placeholders flagged in `src/data.js`.

## Commands
```sh
yarn test                      # Vitest (236 passing at last commit)
yarn lint                      # oxlint (warnings only, in SplitText/GooeyNav — pre-existing)
yarn build
yarn test:e2e                  # Playwright, builds + serves on :4173 (454 passed / 32 skipped at last commit)
yarn test:e2e e2e/work.spec.js --project=laptop   # one spec / one device
```
Don't run several full e2e suites at once — the machine saturates and tests time out spuriously.

## State at handoff
Done and merged: Work technique showcase, real before/after stills in a 20:9 slider, slimmer navbar.
Since then (branch `claude/inspiring-pasteur-b9jp9o`): lazy, re-encoded Work stills; the hero badge
is now "Now showing · <technique>" (`src/sections/hero/NowShowing.jsx`); About uses a reel still;
Process "You provide" boxes align (row subgrid on lg); placeholder testimonials replaced by
`Promises` ("What you can count on", section `#promises`); footer has no inner divider.
Unit tests, lint and build are green. **Don't run e2e in the cloud sandbox** — the user runs
`yarn test:e2e` on their machine (the sandbox Chromium can't decode H.264 anyway).
The River grade before/after was dropped at the user's request (the reel has no other clean pair);
three comparisons remain: portrait grade, sky replacement, greenscreen.

## Waiting on the user
- **Contact form key**: paste a free Web3Forms access key (web3forms.com, made for
  `hello.pradeepvideo@gmail.com`) into `inquiry.web3formsKey` in `src/data.js`. Until then the form
  falls back to opening an email draft. e2e mocks Web3Forms, so tests never email the inbox.
- **Contact details**: email is `hello.pradeepvideo@gmail.com` (user confirmed). The reel also shows
  `@pradeep_9.k`; ask before adding it.
- **Social links**: `profile.socials` in `src/data.js` still point at bare homepages
  (`https://youtube.com` …). Replace with real profile URLs (or remove), then consider adding them
  as `sameAs` in the JSON-LD in `index.html`.
- **Domain**: nothing to edit. On Vercel the build reads `VERCEL_PROJECT_PRODUCTION_URL` (the custom
  domain once added, else `*.vercel.app`) into canonical / og / JSON-LD / robots.txt / sitemap.xml.
  `SITE_URL=https://… yarn build` overrides it; local builds fall back to `example.com` with a warning.
- **Smaller hero loop for phones** (needs ffmpeg, not currently installed): the 4.4 MB loop is most of
  a phone's first load. A ~640px encode served via `<source media>` would roughly halve it.
- The 8 merged worker worktrees in `.claude/worktrees/` (+ `worktree-agent-*` branches) can be deleted.

## Media pipeline (ffmpeg — no Swift)
Source: `media-src/Hero.MP4` (105 MB, 1920×1080, 42 s; **git-ignored** — too big for git/GitHub).
`public/media/hero-reel.mp4` is the same reel at 1080p and works as a source too. Picture area is
rows 108–971 (letterbox bars above/below; technique labels sit in the bottom bar), so crop with
`crop=1920:864:0:108`.
```sh
# Web encodes (H.264 + AAC, faststart)
ffmpeg -i media-src/Hero.MP4 -c:v libx264 -b:v 4M -c:a aac -movflags +faststart public/media/hero-reel.mp4
ffmpeg -ss 7.5 -t 30 -i media-src/Hero.MP4 -vf scale=1280:720 -c:v libx264 -b:v 1.2M -an -movflags +faststart public/media/hero-loop.mp4
# Letterbox-cropped still at <seconds> (scale=1600:-1 for before/after, 1280:-1 for Work cards)
ffmpeg -ss <seconds> -i media-src/Hero.MP4 -frames:v 1 -vf "crop=1920:864:0:108,scale=1600:-1" -q:v 4 out.jpg
# Site images are WebP (about half the JPG size): convert every still before adding it
cwebp -q 80 -m 6 -metadata none out.jpg -o public/media/reel/<name>.webp
# Timestamped contact sheet: 30 frames, one per second from 0:07.5
ffmpeg -ss 7.5 -t 30 -i media-src/Hero.MP4 -vf "fps=1,crop=1920:864:0:108,scale=384:-1,drawtext=text='%{pts\:hms}':x=6:y=6:fontsize=20:fontcolor=yellow:box=1:boxcolor=black,tile=5x6" -frames:v 1 sheet.jpg
```

## Gotchas learned this session
- Smooth scrolling (`scroll-behavior: smooth`) makes e2e measurements flaky: wait for scroll to settle,
  read layouts in one `evaluateAll`, or use `reducedMotion: 'reduce'` when testing *where* things land.
- Web fonts (`display=swap`) shift layout ~0.5 s after load — wait for `document.fonts.ready` before
  measuring positions.
- Playwright's `filter({ has })` locator must not re-scope from the page root (e.g. `#work …`).
- Body-only `overflow: hidden` doesn't stop mobile root scrolling — use `useScrollLock` (html + body).
- Hero CTA `Magnet` only for `(hover: hover) and (pointer: fine)`, padding 0 — taps used to drag
  the stacked buttons into each other.

## Production (Vercel)
- `vercel.json`: build settings, security headers (CSP, nosniff, frame/referrer/permissions policy)
  and caching (`/assets` immutable, `/media` 1 day + stale-while-revalidate — rename a media file
  when replacing it). `vite preview` sends the same site-wide headers, so e2e runs under the CSP.
  Adding a third-party script, font, embed or API means adding its origin to the CSP.
- `vite.config.js` `seo()` plugin: fills `__SITE_URL__` in `index.html`, emits `robots.txt`,
  `sitemap.xml` and `llms.txt` (built from `src/data.js`, so it follows content edits). Vendor code is split into `react` / `motion` / `gsap` chunks.
- Fonts are self-hosted in `public/fonts` (Google's Latin + Latin Extended woff2 subsets, `@font-face`
  in `src/index.css`; the hero's two are preloaded in `index.html`). `/fonts` is cached for a year as
  immutable, so give a replaced font file a new name.
- Audit with Lighthouse against `yarn build && yarn preview` or a deployment, never `yarn dev` —
  the dev server's unminified modules and missing `robots.txt` make the scores meaningless.
- `public/`: `og-image.jpg` (1200×630 share card), `favicon.svg` + `apple-touch-icon.png` (PV mark),
  `404.html` (served by Vercel for unknown paths).
- `e2e/production.spec.js` checks all of the above; `BASE_URL=https://… yarn test:e2e e2e/production.spec.js`
  runs it against a deployment. Preview deployments get `X-Robots-Tag: noindex` from Vercel.

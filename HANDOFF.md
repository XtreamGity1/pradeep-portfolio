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
Steps 1–4 below are done (Work technique showcase, real before/after stills in a 20:9 slider, hero
"Now showing" chip synced to the background video, navbar `h-14 md:h-16`). Unit tests, lint and build
are green. E2E passes in the cloud sandbox except the hero video tests: its Chromium can't decode H.264,
so `e2e/hero.spec.js` (video + now-showing playhead) must be confirmed on a machine with real Chrome.
Remaining: full `yarn test:e2e` on device, visual check at 375 / 820 / 1440.

## Waiting on the user
- **Contact details**: the reel's end card shows `hello.pradeepvideo@gmail.com` and `@pradeep_9.k`.
  Site still uses `hello@example.com` / `example.com` placeholders (data.js `profile`, `index.html`).
  Ask before switching — it decides where inquiries go.
- Real domain for canonical / og:url.
- The 8 merged worker worktrees in `.claude/worktrees/` (+ `worktree-agent-*` branches) can be deleted.

## Media pipeline (no ffmpeg on this Mac; macOS AVFoundation via Swift)
Source: `media-src/Hero.MP4` (105 MB, 1920×1080, 42 s; **git-ignored** — too big for git/GitHub).
Picture area is rows 108–971 (letterbox bars above/below; technique labels sit in the bottom bar).
Compile a tool with `swiftc -O tools/video/<name>.swift -o /tmp/<name>`:
- `transcode <in> <out> <w> <h> <bps> <audio 0|1> [start dur]` — H.264(+AAC), faststart.
  `public/media/hero-loop.mp4` = `1280 720 1200000 0 7.5 30`; `hero-reel.mp4` = `1920 1080 4000000 1`.
- `still <in> <outDir> <width> name=seconds…` — letterbox-cropped JPEG stills; `--bars <t>` measures bars.
- `sheet <in> <out.jpg> <start> <end> <step> <cols> <cellW> [crop x y w h]` — timestamped contact sheet.
- `cuts <in>` — prints frame-accurate times when the bottom-right label changes.
- `montage <out.jpg> <cols> <cellW> <img>…` — side-by-side review of stills.

## Gotchas learned this session
- Smooth scrolling (`scroll-behavior: smooth`) makes e2e measurements flaky: wait for scroll to settle,
  read layouts in one `evaluateAll`, or use `reducedMotion: 'reduce'` when testing *where* things land.
- Web fonts (`display=swap`) shift layout ~0.5 s after load — wait for `document.fonts.ready` before
  measuring positions.
- Playwright's `filter({ has })` locator must not re-scope from the page root (e.g. `#work …`).
- Body-only `overflow: hidden` doesn't stop mobile root scrolling — use `useScrollLock` (html + body).
- Hero CTA `Magnet` only for `(hover: hover) and (pointer: fine)`, padding 0 — taps used to drag
  the stacked buttons into each other.

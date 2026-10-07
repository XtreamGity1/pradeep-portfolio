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

## State at handoff — ⚠️ mid-change, build currently BROKEN
Last commit `abcc274` is green. Uncommitted work in progress:

- `src/data.js` **rewritten** (done):
  - `heroVideo.offset = 7.5` — the hero loop starts 7.5 s into the full reel.
  - `reelChapters` — every segment of the reel with the technique it shows and exact times
    (seconds in the full reel; measured frame-accurately from the reel's bottom-right labels).
  - `edits` (8) **replaces `projects`** — one Work card per technique, `id` matches a chapter.
    Fields: `id, title, group, image, summary, shows, how[{label, body}], why`.
  - `beforeAfter.comparisons` — 4 **real** pairs from the reel (portrait grade, river grade, sky
    replacement, greenscreen). The old simulated `overlay` field is gone.
- `public/media/reel/` (new, 2.1 MB): `ba-*-before/after.jpg` (1600×720) and `edit-*.jpg` (1280×576),
  all letterbox-cropped stills from the reel.
- `tools/video/*.swift` (new): the AVFoundation tools used to make the media (see below).

Still importing the removed `projects` (→ build/tests fail until updated):
`src/sections/Work.jsx`, `src/sections/work/ProjectCard.jsx`, `src/sections/work/ProjectDialog.jsx`,
`src/sections/__tests__/Work.test.jsx`, `e2e/work.spec.js`, `e2e/responsive.spec.js` (work-cards test).

## Next steps (the user's open requests, in order)
1. **Work section → technique showcase** ("Edits that move the needle"). Use only the reel; no
   long-form/short-form/format categories. Plan:
   - Filter by `group` (Colour & look / Compositing / Motion & sound) instead of format;
     aria-label "Filter edits by technique"; status "Showing all 8 edits".
   - Card: `image`, `title`, `group` pill, `summary`. All cards landscape (8 + CTA card = 9 cells).
   - Dialog: play that segment of the reel with sound — `<video src={`${showreel.src}#t=${start},${end}`}
     poster={image} controls playsInline>` (times from `reelChapters` by `id`; the reel file is 16:9
     with baked-in letterbox). Facts: group, clip length, "2026 showreel". Blocks: "In this clip"
     (`shows`), "How it's done" (`how`), "Why it matters" (`why`). Keep the existing focus trap,
     scroll lock (`useScrollLock`), bottom sheet on phones, prev/next.
   - Rewrite `Work.test.jsx` + `e2e/work.spec.js`; update the 6→8 count in `e2e/responsive.spec.js`.
2. **Before/after** (`src/sections/BeforeAfter.jsx`): delete the simulated overlays
   (`Captions`, `LowerThird`, `FinishedFrame` reframe), render plain `<img>` for both sides, set
   `frameImg` to 1600×720, and give `CompareSlider` an `aspect` prop (default `aspect-video`; pass
   `aspect-[20/9]` here). Update `BeforeAfter.test.jsx` / `e2e/craft.spec.js` (overlay assertions).
3. **Hero live technique label**: the reel prints the technique bottom-right, but it's dimmed and
   cropped in the hero. Add a crisp chip (e.g. bottom-right "Now showing · Colour grading") synced
   to the background `<video>`'s `timeupdate`: chapter where `start <= currentTime + heroVideo.offset < end`;
   hide when none. `aria-hidden` (decorative, mirrors the video). Under reduced motion (poster shown)
   show the poster's chapter, "Text in background". TDD: unit test with a mocked `currentTime`,
   e2e checks the label matches the video time.
4. **Navbar is a bit too tall**: `src/sections/Navbar.jsx` uses `h-16 md:h-20`; shrink (e.g. `h-14 md:h-16`)
   and update `scroll-padding-top` in `src/index.css` (it's header height **+1px border**) and the
   ≤81px check in `e2e/navbar.spec.js`.
5. Then: `yarn test && yarn lint && yarn build && yarn test:e2e`, visual check at 375 / 820 / 1440,
   commit (end messages with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`).

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

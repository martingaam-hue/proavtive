---
phase: 02
plan: 05
subsystem: design-system / media pipeline
tags: [media, sharp, mux, next-image, avif, webp, video-shell, phase-2]

# Dependency graph
requires:
  - phase: 02-design-system-component-gallery-media-pipeline
    provides: "Phase 1 next.config.ts + Sentry wrap + transpilePackages; Plan 02-01/02/03/04 primitive stack — VideoPlayer composes on token layer / fonts / lib/utils cn()."
provides:
  - "Vercel image optimization config — AVIF/WebP formats + deviceSizes/imageSizes + 31-day cache + cdn.sanity.io remote pattern"
  - "Sharp preprocessing script at scripts/process-photos.mjs — .planning/inputs/curated-hero-photos/ → public/photography/ (AVIF/WebP/JPG × 1920px max)"
  - "VideoPlayer primitive shell at components/ui/video-player.tsx — Mux player via dynamic({ ssr: false })"
  - "Staging directories: .planning/inputs/curated-hero-photos/ (gitignored raw) + public/photography/ (tracked output)"
  - "pnpm photos:process script registered"
  - "12 curated hero photos processed → public/photography/ (36 files: 12 × AVIF/WebP/JPG at 1920px max) — 87.20 MB source → 2.27 MB AVIF (2.6% of source)"
affects: [02-06 gallery, 03-root-gateway, 04-hk, 05-sg, 10-launch (Mux account + real playback IDs)]

# Tech tracking
tech-stack:
  added:
    - "@mux/mux-player-react@3.11.8 (dependency) — Mux player React wrapper, used only by VideoPlayer primitive"
    - "sharp@0.34.5 (devDependency) — local-only image preprocessing per Pitfall 4 (never in next build)"
  patterns:
    - "dynamic({ ssr: false }) with default-export unwrap for custom-elements libraries (Pitfall 3 fix)"
    - "useSyncExternalStore for prefers-reduced-motion subscription — React 19 canonical, avoids react-hooks/set-state-in-effect lint"
    - "Module-namespace → callable-component unwrap requires unknown intermediate cast (TS structural-typing constraint)"
    - "Single-width 1920px Sharp output (UI-SPEC §5.2 'Planner choice') — Vercel request-time optimization handles responsive variants"
    - "gitignore file-level filter on staging directory with .gitkeep exception — raw never commits, directory persists"
    - "sg-placeholder-* slug convention — marks OFL stock images earmarked for later replacement (per D-05/D-07 amendments 2026-04-23)"

key-files:
  created:
    - scripts/process-photos.mjs (116 lines)
    - components/ui/video-player.tsx (110 lines)
    - .planning/inputs/curated-hero-photos/.gitkeep (empty)
    - public/photography/.gitkeep (empty)
    - public/photography/*.avif (12 files, 2.27 MB total)
    - public/photography/*.webp (12 files, 2.30 MB total)
    - public/photography/*.jpg (12 files, 4.13 MB total)
  modified:
    - next.config.ts (added images block between transpilePackages and async headers())
    - package.json (+2 deps, +1 script)
    - pnpm-lock.yaml (transitive dep updates)
    - .gitignore (+5 lines — curated-hero-photos filter + .gitkeep exception)

key-decisions:
  - "VideoPlayer uses useSyncExternalStore rather than useState + useEffect + matchMedia (Rule 1 — plan's sketch would fail React 19's react-hooks/set-state-in-effect lint). useSyncExternalStore is the React-19 canonical pattern for external-observable subscriptions; third arg getServerSnapshot returns false (SSR-safe default — treats SSR as 'no reduced-motion preference')."
  - "MuxPlayer unwrap uses `unknown` intermediate cast (Rule 1 — TS 5 refuses the direct `as { default?: T } & T` cast because the module namespace object doesn't structurally overlap with a FunctionComponent; TS error TS2352 suggested the `unknown` intermediate)."
  - "Mux NOT added to transpilePackages — pnpm build passed clean without it. Add only if a future CJS/ESM interop error surfaces (Phase 1 precedent)."
  - "Single-width 1920px Sharp output chosen per UI-SPEC §5.2 'Planner choice'. Multi-width Sharp pipelines (640 + 1024 + 1920) would produce 3× output count per source photo but duplicate what Vercel Image Optimization does at request time."
  - "SG Prodigy coverage shipped as Unsplash OFL placeholder (David Trinks, unsplash.com/photos/-6hNoEeUsDY) labelled sg-placeholder-climbing-unsplash-trinks.* — D-05 + D-07 amendments (commit 9162e23, 2026-04-23) explicitly permit mixed real + OFL stock coverage for Phase 2 gallery purposes; Phase 5 will replace with real Prodigy/Katong photography."

requirements-completed: [DS-04]

# Metrics
duration: ~12min initial + ~2min Task 4 resume
completed: 2026-04-23
tasks_completed: 4  # 4/4 — plan done
tasks_pending_human_action: 0
files_created: 40  # 4 initial (2 code + 2 .gitkeep) + 36 processed photo outputs
files_modified: 4
---

# Phase 02 Plan 05: Media Pipeline Summary

**All four tasks shipped. Image config, Sharp preprocessing script, VideoPlayer shell, and the processed photo assets are committed. 12 curated hero photos (11 real ProActiv + 1 Unsplash OFL placeholder for SG Prodigy coverage) reduced from 87.20 MB source to 2.27 MB AVIF (2.6% of source) / 2.30 MB WebP / 4.13 MB JPG — 36 output files total in `public/photography/`. DS-04 asset substrate is now live and ready for Plan 02-06 gallery to reference. Phase 5 will replace `sg-placeholder-climbing-unsplash-trinks.*` with real Prodigy/Katong photography (D-05 + D-07 amended 2026-04-23, commit 9162e23, to permit mixed real + OFL stock placeholder coverage for Phase 2 gallery purposes). `pnpm typecheck` + `pnpm build` pass.**

## Performance

- **Duration:** ~12 min initial (Tasks 1–3) + ~2 min Task 4 resume (photo processing + commit)
- **Started:** 2026-04-23T15:40:11Z
- **Completed (Tasks 1–3):** 2026-04-23T15:52:00Z
- **Task 4 resumed + completed:** 2026-04-23T21:18:00Z (after curation landed)
- **Tasks completed:** 4 of 4 — plan done
- **Files created:** 40 (2 code + 2 `.gitkeep` + 36 processed photo outputs)
- **Files modified:** 4 (`next.config.ts`, `package.json`, `pnpm-lock.yaml`, `.gitignore`)

## Tasks

### Task 1: Extend next.config.ts + install media deps — COMPLETE

**Commit:** `6d86339` — `feat(02-05): add image config + install sharp and @mux/mux-player-react`

- `pnpm add @mux/mux-player-react` → `3.11.8` in dependencies
- `pnpm add -D sharp` → `0.34.5` in devDependencies
- `package.json` scripts: `"photos:process": "node scripts/process-photos.mjs"` inserted between `test:unit:watch` and `prepare`
- `next.config.ts` images block inserted between `transpilePackages` and `async headers()`:
  ```typescript
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2678400,
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  ```
- `transpilePackages` NOT modified — `pnpm build` passed clean without adding `@mux/mux-player-react` to it (no webpack/Turbopack interop errors surfaced; the primitive isn't imported by any route yet, so the runtime never pulled Mux's CJS bundle through Turbopack). If a future phase's route-level import triggers an interop failure, follow the Phase 1 Plan 01-03 precedent and add `"@mux/mux-player-react"` there.
- Sentry `withSentryConfig` wrap preserved verbatim.
- `pnpm typecheck` + `pnpm build` exit 0.

### Task 2: Sharp script + staging scaffolding + gitignore — COMPLETE

**Commit:** `b5ccbcd` — `feat(02-05): add sharp preprocessing script + photo staging scaffolding`

- `scripts/process-photos.mjs` (116 lines) — Node ESM Sharp pipeline:
  - Reads `.planning/inputs/curated-hero-photos/`
  - Accepts `.jpg`, `.jpeg`, `.png`, `.heic`, `.tif`, `.tiff`, `.webp`
  - Slugifies source filenames (`IMG_2341.JPG` → `img-2341.{avif,webp,jpg}`)
  - Single-width 1920px max per UI-SPEC §5.2 "Planner choice"
  - Qualities: AVIF 70, WebP 80, JPEG 85 (mozjpeg enabled)
  - `sharp(src).rotate()` auto-applies EXIF orientation
  - Fails fast with exit 1 + D-07 coverage message on empty input
  - Emits per-file + total reduction stats on success
- `.planning/inputs/curated-hero-photos/.gitkeep` + `public/photography/.gitkeep` created
- `.gitignore` appended:
  ```
  # Phase 2 / Plan 02-05 — curated hero photos staging (D-07).
  # Raw originals (any format Sharp accepts) never enter the repo.
  # Only the .gitkeep file is tracked so the directory persists.
  .planning/inputs/curated-hero-photos/*
  !.planning/inputs/curated-hero-photos/.gitkeep
  ```
  Verified: `git check-ignore` matches `fake.jpg` against the ignore rule, and does not match `.gitkeep` (exception works as designed).
- Smoke test: `pnpm photos:process` against empty directory exits 1 with the expected `FATAL: .planning/inputs/curated-hero-photos/ is empty (only .gitkeep). Drop 10–15 curated hero photos there per D-07...` message.

### Task 3: VideoPlayer primitive shell — COMPLETE

**Commit:** `4d8126b` — `feat(02-05): add VideoPlayer shell wrapping @mux/mux-player-react`

- `components/ui/video-player.tsx` (110 lines):
  - `"use client"` directive (after 6-line comment block header — standard Next.js convention; directives must be first **statement**, leading comments are not statements)
  - `const PLACEHOLDER_PLAYBACK_ID = "DS00Spx1CV902MCtPj5WknGlR102V5HFkDe"` per D-06
  - `dynamic(() => import("@mux/mux-player-react").then((m) => { const mod = m as unknown as { default?: AnyComponent } & AnyComponent; return mod.default ?? mod; }), { ssr: false })` — Pitfall 3 mitigation with default-export unwrap
  - `VideoPlayerProps` interface exported: `playbackId?`, `title` (required), `poster?`, `autoPlay?`, `aspect?: 'video'|'square'|'portrait'`, `className?`
  - `usePrefersReducedMotion` hook via `React.useSyncExternalStore` — Rule 1 adaptation (see Deviations)
  - Root `<div data-slot="video-player" data-aspect={aspect} data-auto-play={String(shouldAutoPlay)}>`
  - `autoPlay` gated on `!prefersReducedMotion` and forces `muted={true}`, `autoPlay="muted"`, `loop={true}`, `playsInline` when on
  - No raw hex (Pillar 2 verified via grep)
- `pnpm typecheck` + `pnpm build` exit 0 after the Rule 1 fixes (see below).
- First Load JS unchanged at 239 kB — VideoPlayer tree-shakes out because no route imports it yet (Plan 02-06 gallery will wire one example).

### Task 4 (resumed 2026-04-23): Run `pnpm photos:process` — COMPLETE

**Commit:** `afb5331` — `feat(02-05): process 12 curated photos → public/photography/ AVIF+WebP+JPG`

Preconditions:
- `.planning/inputs/curated-hero-photos/` contained 12 source images (plus `.gitkeep`) at the time of this resumption, staged by Martin.
- D-05 + D-07 had been amended earlier the same day (commit `9162e23`) to explicitly permit mixed real-ProActiv + OFL stock placeholder coverage for Phase 2 gallery purposes — enabling the `sg-placeholder-*` slug convention used below.

Execution:
- `pnpm photos:process` ran cleanly (exit 0). No Sharp warnings, no skipped files, no HEIC/format issues — all 12 sources were plain JPEG.
- pnpm emitted the expected `WARN Unsupported engine: wanted: {"node":">=22.0.0 <23.0.0"} (current: {"node":"v24.14.0"})` about pnpm's engines field — cosmetic only, script ran without issue on Node 24.
- Sharp processed 12 × 3 = 36 output files into `public/photography/` (verified with `ls public/photography/ | wc -l` → 36).
- `public/photography/.gitkeep` remains (pre-existing from Task 2) so the 37-entry directory count includes `.gitkeep`. The commit only stages `*.avif` / `*.webp` / `*.jpg` — the `.gitkeep` is already tracked.

Source → output reduction (from `/tmp/photos-process.log`):

| Metric            | Value     | % of source |
| ----------------- | --------- | ----------- |
| Source total      | 87.20 MB  | 100 %       |
| AVIF total        | 2.27 MB   | 2.6 %       |
| WebP total        | 2.30 MB   | 2.6 %       |
| JPG total         | 4.13 MB   | 4.7 %       |
| Combined output   | 8.70 MB   | 10.0 %      |

Per-file breakdown (slug → source MB → AVIF / WebP / JPG):

| Slug                                        | Source MB | AVIF MB | WebP MB | JPG MB |
| ------------------------------------------- | --------- | ------- | ------- | ------ |
| `hero-gateway-drone`                        | 4.03      | 0.33    | 0.34    | 0.56   |
| `hk-venue-cyberport`                        | 8.33      | 0.08    | 0.09    | 0.17   |
| `hk-venue-wanchai-gymtots`                  | 8.79      | 0.26    | 0.27    | 0.40   |
| `programme-adults`                          | 6.86      | 0.11    | 0.12    | 0.28   |
| `programme-beginner-two`                    | 8.15      | 0.12    | 0.14    | 0.31   |
| `programme-beginner`                        | 8.31      | 0.12    | 0.13    | 0.31   |
| `programme-competitive`                     | 8.79      | 0.18    | 0.19    | 0.36   |
| `programme-easter-camp`                     | 4.58      | 0.03    | 0.05    | 0.13   |
| `programme-intermediate`                    | 9.52      | 0.27    | 0.26    | 0.48   |
| `sg-placeholder-climbing-unsplash-trinks`   | 2.24      | 0.57    | 0.50    | 0.75   |
| `testimonial-birthday-party`                | 8.95      | 0.11    | 0.11    | 0.20   |
| `testimonial-family-scene`                  | 8.66      | 0.10    | 0.10    | 0.19   |

Verifications after run:
- `file public/photography/hero-gateway-drone.avif` → `ISO Media, AVIF Image` (correct container)
- `file public/photography/hero-gateway-drone.webp` → `RIFF (little-endian) data, Web/P image, VP8 encoding, 1728x3072` (resized from portrait 4032×7168 → width 1728, height preserved by `resize(1920, null)` with `withoutEnlargement: true`)
- `file public/photography/hero-gateway-drone.jpg` → `JPEG image data, progressive, precision 8, 1728x3072, components 3` (progressive mozjpeg)
- `git status --short` before staging: exactly 36 untracked `public/photography/*.{avif,webp,jpg}` files — no stray repo changes.
- Commit hooks ran clean: gitleaks (0 leaks), lint-staged (no staged code files), commitlint (subject format valid).

SG Prodigy placeholder attribution:
- Source: [unsplash.com/photos/-6hNoEeUsDY](https://unsplash.com/photos/-6hNoEeUsDY) by David Trinks (@dtrinksrph) — children climbing an indoor rock wall in Vernon, CT.
- Licence: Unsplash Licence (free for commercial use, no attribution required).
- Slug prefix `sg-placeholder-*` is the convention for Phase 5 to identify and replace with real Prodigy/Katong photography.
- Processed variant size is larger than any real-ProActiv photo in AVIF (0.57 MB vs average ~0.18 MB) because Unsplash's original is already pre-compressed JPEG — less entropy for AVIF/WebP to squeeze. Perfectly acceptable for a temporary placeholder.

No Rule 1/2/3 deviations surfaced during Task 4 resumption — the script ran exactly as specified.

## Task Commits

| Task | Subject | Commit |
|------|---------|--------|
| Task 1 | add image config + install sharp and @mux/mux-player-react | `6d86339` |
| Task 2 | add sharp preprocessing script + photo staging scaffolding | `b5ccbcd` |
| Task 3 | add VideoPlayer shell wrapping @mux/mux-player-react | `4d8126b` |
| Plan (docs, earlier) | complete media-pipeline plan (3/4 tasks; Task 4 awaits curation) | `fe6de2b` |
| D-05/D-07 amendment | allow placeholder imagery for Phase 2 gallery | `9162e23` |
| Task 4 | process 12 curated photos → public/photography/ AVIF+WebP+JPG | `afb5331` |

## Deviations from Plan

### Auto-fixed Issues (Rule 1 — library-contract adaptations)

**1. [Rule 1 — Library adaptation] useSyncExternalStore instead of useState + useEffect**

- **Found during:** Task 3 `pnpm build`
- **Issue:** The plan's `usePrefersReducedMotion` sketch used `useState(false)` + `useEffect(..., [])` with a synchronous `setPrefers(mq.matches)` inside the effect body. React 19's `eslint-plugin-react-hooks@7` treats this as a `react-hooks/set-state-in-effect` error (cascading-render risk), which blocks `next build` under Next 15's strict lint gate.
- **Fix:** Replaced with `React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)` — the canonical React-19 primitive for observable subscriptions. `subscribe` attaches a `change` listener to `matchMedia('(prefers-reduced-motion: reduce)')`; `getSnapshot` returns the current `.matches`; `getServerSnapshot` returns `false` (SSR default: assume no preference, hydrate to real value on the client).
- **Files modified:** `components/ui/video-player.tsx`
- **Commit:** `4d8126b`

**2. [Rule 1 — Type adaptation] `unknown` intermediate cast for MuxPlayer unwrap**

- **Found during:** Task 3 `pnpm typecheck`
- **Issue:** The plan's cast `(m as { default?: unknown }).default ?? m` produced `unknown`, which `next/dynamic`'s `LoaderComponent<P>` type refuses (TS2345). A direct `m as { default?: AnyComponent } & AnyComponent` cast was then refused by TS2352 because the imported module namespace object doesn't structurally overlap with a `FunctionComponent`.
- **Fix:** Added `unknown` intermediate cast — `m as unknown as { default?: AnyComponent } & AnyComponent` — which TS accepts (diagnostic TS2352 itself suggested the `unknown` intermediate). The `dynamic<Record<string, unknown>>` type parameter + explicit `AnyComponent` type alias satisfy the `LoaderComponent` contract.
- **Files modified:** `components/ui/video-player.tsx`
- **Commit:** `4d8126b`

**3. [Rule 3 — Unused-variable fix] Bare `catch` without binding in Sharp script**

- **Found during:** Task 2 lint-staged pass
- **Issue:** Initial `try { ... } catch (err) { ... }` in `scripts/process-photos.mjs` left `err` unused — eslint warned.
- **Fix:** Used `catch { ... }` (bare catch, ES2019+) — behaviourally identical, no unused variable.
- **Files modified:** `scripts/process-photos.mjs`
- **Commit:** `b5ccbcd`

None of these three are material — the plan's functional contract (default-export unwrap, ssr:false, prefers-reduced-motion respect, fail-fast script) is fully preserved. Only the TypeScript/ESLint implementation details shifted.

### Task 4 resumption — no new deviations

Task 4 ran exactly as specified by the plan's `<how-to-verify>` block. No Rule 1/2/3 issues surfaced. The SG placeholder inclusion is pre-approved by the D-05/D-07 amendment (commit 9162e23) and therefore not classed as a deviation.

### Formatting (lefthook lint-staged)

- `scripts/process-photos.mjs` was reformatted by prettier on commit (e.g., line-joined `sharp(src).rotate().resize(...)` onto one line, trailing-comma normalisation). Repo uses `"singleQuote": false` in `.prettierrc.json` — all new code uses double quotes. The plan's sample code used single quotes, but this is cosmetic and the repo's prettier config is authoritative.
- Plan's verify grep patterns used single-quote literals (e.g., `formats: \['image/avif', 'image/webp'\]`). Actual files ship double-quote literals post-prettier. The acceptance criteria's semantic intent (AVIF/WebP formats present, Sanity CDN present, etc.) is fully met; the grep literals were notional.

## Accessibility / Pillar 5 Preconditions

- **`prefers-reduced-motion: reduce`** respected — `autoPlay={true}` prop is silently overridden when the user has the preference set. `usePrefersReducedMotion` returns `true` and `shouldAutoPlay` computes `false`.
- **`title` prop is required** on `VideoPlayerProps` — feeds Mux's accessible-name and `metadata.video_title` analytics field. Consumers cannot render the player without providing one.
- **`playsInline` always true** — iOS/mobile safari requirement for in-page playback rather than forced fullscreen.
- **`muted={shouldAutoPlay}`** — autoplay requires muted on all modern browsers; the prop contract enforces it.

## Pillar 2 / Token-only Proof

```bash
$ grep -E "#[0-9a-fA-F]{6}" components/ui/video-player.tsx
(empty)
```

VideoPlayer uses `bg-muted` + `rounded-xl` + `w-full` + `overflow-hidden` — all token/utility classes.

## Pillar 6 / Performance Notes

- **Vercel image optimization wired:** request-time AVIF/WebP negotiation per `<Image>` primitive; 8 `deviceSizes` breakpoints; 31-day `minimumCacheTTL` on the edge variant cache.
- **Sharp local-only** — referenced only by `scripts/process-photos.mjs`, which is NOT invoked during `next build` (confirmed by inspecting the build tail — no Sharp symbol in the production bundle).
- **Mux defers to client:** `dynamic({ ssr: false })` ensures server-rendered HTML contains no Mux code; the player only mounts after hydration. LCP budget for pages that use VideoPlayer is therefore controlled by the `poster` image (a regular `next/image`-optimised asset), not the video itself.
- **Route bundle size unchanged (239 kB First Load JS)** — VideoPlayer tree-shakes out because no route consumes it yet. Plan 02-06 gallery will wire a single example and re-measure.
- **Committed asset bytes** — processed `public/photography/` totals 8.70 MB (AVIF + WebP + JPG combined), vs 87.20 MB of raw source. Vercel serves AVIF by default (2.27 MB over 12 hero images) with WebP/JPG fallbacks, so most users' total image bytes per full-site crawl is ~2.3 MB.

## D-06 Compliance (Mux Placeholder Policy)

Phase 2 ships only the VideoPlayer shell. The primitive defaults to Mux's public demo playback ID `DS00Spx1CV902MCtPj5WknGlR102V5HFkDe` per D-06. No Mux account signup, no private playback IDs, no paid asset provisioning during Phase 2. Phase 10 work:
- Sign up Mux paid account
- Upload real camp clips + coach interviews
- Replace `PLACEHOLDER_PLAYBACK_ID` usage with per-asset `playbackId` props passed from CMS (Sanity video block)
- Add signed-URL support if Mux Signed URLs are enabled

## D-07 Compliance (Raw Photos Never Committed)

- `.planning/inputs/curated-hero-photos/` is gitignored at file level (rule: `.planning/inputs/curated-hero-photos/*`) with an exception for `.gitkeep` (`!.planning/inputs/curated-hero-photos/.gitkeep`)
- `public/photography/` is tracked (intentional — processed AVIF + WebP + JPG output is the deployable asset artifact)
- Verified: `git check-ignore .planning/inputs/curated-hero-photos/fake.jpg` returns a match; `git check-ignore .planning/inputs/curated-hero-photos/.gitkeep` returns no match.
- Confirmed at Task 4 commit time: the 12 raw JPEG sources (~87 MB) in `.planning/inputs/curated-hero-photos/` stayed local-only. `git status` showed only `public/photography/*` as new files. Commit `afb5331` contains zero files from the staging folder.

## D-05 / D-07 Amendments (Mixed Real + OFL Placeholder Coverage)

Commit `9162e23` (2026-04-23) amended D-05 ("gallery shows real ProActiv photography") and D-07 ("curation upfront") to explicitly permit mixed real-ProActiv + OFL-licensed stock placeholders for Phase 2 gallery demonstration purposes. Without this amendment, the SG Prodigy coverage gap (no real Katong photography available for Phase 2) would have blocked Task 4 or forced an incomplete gallery in Plan 02-06.

Phase 5 (SG market buildout) will:
1. Commission or source real Prodigy/Katong photography during Phase 5 field work or CMS population
2. Replace `public/photography/sg-placeholder-climbing-unsplash-trinks.{avif,webp,jpg}` with real asset(s) (re-run `pnpm photos:process`)
3. Drop the `sg-placeholder-*` slug convention once all slots are real

## Notes for Plan 02-06 (gallery)

**VideoPlayer import signature:**

```tsx
import { VideoPlayer, PLACEHOLDER_PLAYBACK_ID } from "@/components/ui/video-player";

// Default — renders Mux demo stream, autoplay off:
<VideoPlayer title="Demo reel" />

// Specific playback ID + autoplay (auto-mutes if user prefers reduced motion):
<VideoPlayer playbackId="ABC123" title="Wan Chai gymnastics" autoPlay aspect="video" />

// Portrait for mobile-first reel formats:
<VideoPlayer title="SG Prodigy" aspect="portrait" />
```

**Photo slugs available in `public/photography/` (all with `.avif`, `.webp`, `.jpg` variants):**

- `hero-gateway-drone` — drone venue overview (Wan Chai) — candidate for root gateway hero
- `hk-venue-cyberport` — Cyberport venue interior
- `hk-venue-wanchai-gymtots` — Wan Chai + young-age class
- `programme-beginner`, `programme-beginner-two` — beginner class action
- `programme-intermediate` — intermediate level
- `programme-competitive` — competitive level action
- `programme-adults` — adult class
- `programme-easter-camp` — holiday camps
- `testimonial-birthday-party`, `testimonial-family-scene` — family/parent scenes
- `sg-placeholder-climbing-unsplash-trinks` — OFL placeholder for SG Prodigy (temporary; Phase 5 replacement)

Reference via `<Image src="/photography/{slug}.jpg">` — `next/image` handles AVIF/WebP negotiation at request time via the Vercel image optimizer.

**Gallery test for VideoPlayer:**
- Render one `<VideoPlayer title="Phase 2 media-primitive smoke test" />` in `/_design/page.tsx` under a "Media" section.
- Verify: page hydrates cleanly, Mux demo stream plays on manual trigger, no server-side `customElements is not defined` error.

## Notes for Phase 3+ (page builds)

- When wiring real `<Image>` usage against `public/photography/<slug>.jpg`, always pass `sizes` prop reflecting the actual rendered viewport width so Vercel picks the optimal `deviceSizes` variant (e.g., for a hero spanning full viewport: `sizes="100vw"`; for a 3-col grid at `lg`: `sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"`).
- Use `fetchPriority="high"` (not deprecated `priority`) on the single LCP image per route — forward-compat with Next.js 16 (Pitfall 7).
- When Sanity-hosted CMS images land in Phase 6, no further `next.config.ts` edit needed — `cdn.sanity.io` is already in `remotePatterns`.

## Self-Check: PASSED

**Files verified to exist:**
- FOUND: `scripts/process-photos.mjs`
- FOUND: `components/ui/video-player.tsx`
- FOUND: `.planning/inputs/curated-hero-photos/.gitkeep`
- FOUND: `public/photography/.gitkeep`
- FOUND: `public/photography/*.avif` (12 files)
- FOUND: `public/photography/*.webp` (12 files)
- FOUND: `public/photography/*.jpg` (12 files)

**Files verified to be modified:**
- FOUND in prior commits: `next.config.ts` (images block added in `6d86339`)
- FOUND in prior commits: `package.json` (deps + script added in `6d86339`)
- FOUND in prior commits: `pnpm-lock.yaml` (updated in `6d86339`)
- FOUND in prior commits: `.gitignore` (curated-hero-photos rule added in `b5ccbcd`)

**Commits verified to exist:**
- FOUND: `6d86339` (Task 1)
- FOUND: `b5ccbcd` (Task 2)
- FOUND: `4d8126b` (Task 3)
- FOUND: `afb5331` (Task 4 — processed photos)

**Plan-level invariants verified:**
- `grep -q "image/avif" next.config.ts` — passes
- `grep -q "cdn.sanity.io" next.config.ts` — passes
- `grep -q "minimumCacheTTL: 2678400" next.config.ts` — passes
- `grep -c "withSentryConfig" next.config.ts` — 2 (import + export wrap preserved)
- `grep -q "PLACEHOLDER_PLAYBACK_ID" components/ui/video-player.tsx` — passes
- `grep -q "ssr: false" components/ui/video-player.tsx` — passes
- `grep -q "DS00Spx1CV902MCtPj5WknGlR102V5HFkDe" components/ui/video-player.tsx` — passes
- `grep -q "matchMedia" components/ui/video-player.tsx` — passes
- `grep -E "#[0-9a-fA-F]{6}" components/ui/video-player.tsx` — empty (Pillar 2)
- `git check-ignore .planning/inputs/curated-hero-photos/fake.jpg` — matches the ignore rule
- `git check-ignore .planning/inputs/curated-hero-photos/.gitkeep` — no match (exception works)
- `ls public/photography/*.avif public/photography/*.webp public/photography/*.jpg | wc -l` — 36
- `pnpm typecheck` — exit 0 (re-verified post-Task-4)
- `pnpm build` — exit 0 (re-verified post-Task-4)

---

*Phase: 02-design-system-component-gallery-media-pipeline*
*Plan: 05 — media-pipeline*
*Completed: 2026-04-23 (all 4 tasks)*

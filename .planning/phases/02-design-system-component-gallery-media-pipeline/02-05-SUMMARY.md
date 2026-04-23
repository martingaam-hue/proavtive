---
phase: 02
plan: 05
subsystem: design-system / media pipeline
tags: [media, sharp, mux, next-image, avif, webp, video-shell, phase-2, human-action-pending]

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

key-files:
  created:
    - scripts/process-photos.mjs (116 lines)
    - components/ui/video-player.tsx (110 lines)
    - .planning/inputs/curated-hero-photos/.gitkeep (empty)
    - public/photography/.gitkeep (empty)
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

requirements-completed: [DS-04]

# Metrics
duration: ~12min (focused execution time)
completed: 2026-04-23
tasks_completed: 3  # of 4 total — Task 4 (photo processing) blocked on curation
tasks_pending_human_action: 1
files_created: 4
files_modified: 4
---

# Phase 02 Plan 05: Media Pipeline Summary

**Three of four tasks shipped — image config, Sharp preprocessing script, and VideoPlayer shell are all landed and committed. Task 4 (`pnpm photos:process`) is parked at a HUMAN-ACTION checkpoint because `.planning/inputs/curated-hero-photos/` is currently empty (only `.gitkeep`). Martin needs to curate 10–15 hero-tier photos per D-07 before the Sharp pipeline can produce real AVIF/WebP/JPG output. All non-curation work — `next.config.ts` images block (AVIF/WebP + 8 deviceSizes + cdn.sanity.io remote pattern), `scripts/process-photos.mjs` (single-width 1920px Sharp pipeline, fails fast on empty input), `components/ui/video-player.tsx` (client-only `dynamic({ ssr: false })` wrapping `@mux/mux-player-react` with Mux's public demo playback ID), and the `.gitkeep` + `.gitignore` scaffolding — is complete. `pnpm typecheck` + `pnpm build` pass. DS-04 is materialised but the asset substrate (`public/photography/*.avif|webp|jpg`) awaits curation.**

## Performance

- **Duration:** ~12 min focused execution
- **Started:** 2026-04-23T15:40:11Z
- **Completed (non-blocked tasks):** 2026-04-23T15:52:00Z
- **Tasks completed:** 3 of 4 autonomous — Task 4 parked HUMAN-ACTION
- **Files created:** 4 (2 code + 2 `.gitkeep`)
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

### Task 4: Run `pnpm photos:process` — HUMAN-ACTION PENDING

**Status:** Blocked. `.planning/inputs/curated-hero-photos/` is empty (only `.gitkeep`).

**Resume instruction:**
> Awaiting Martin's curation of 10–15 hero photos per D-07 coverage list:
>   - 1 root gateway hero
>   - 2–3 HK venues (Wan Chai + Cyberport + optional)
>   - 1–2 SG Prodigy / Katong
>   - 3–5 programmes in action (different age groups)
>   - 1–2 testimonial / parent scenes
>
> Source photos at `/Users/martin/Downloads/ProActive/01 - PHOTOS to use/` (and related folders per `.planning/inputs/MEDIA-INVENTORY.md`).
>
> Accepted formats: JPG, PNG, HEIC, TIFF, WebP. Any filename — the script slugifies.
>
> **Resume by re-running `/gsd-execute-phase 2`** once photos are dropped into `.planning/inputs/curated-hero-photos/`. A continuation agent will run `pnpm photos:process`, log reduction stats, commit the processed AVIF/WebP/JPG output in `public/photography/`, and update this summary's Task 4 section.

## Task Commits

| Task | Subject | Commit |
|------|---------|--------|
| Task 1 | add image config + install sharp and @mux/mux-player-react | `6d86339` |
| Task 2 | add sharp preprocessing script + photo staging scaffolding | `b5ccbcd` |
| Task 3 | add VideoPlayer shell wrapping @mux/mux-player-react | `4d8126b` |
| Task 4 | *(pending human-action — curation)* | — |

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

When Martin drops 10–15 raw photos into the staging folder, they remain local-only. Running `pnpm photos:process` reads from that gitignored staging area and writes into the tracked `public/photography/` folder — the ratio of committed bytes to raw bytes is at most the 1920px-wide AVIF variant's size per photo.

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

**Photo slug naming (when Task 4 resumes):**
- Sharp lowercases, replaces non-alphanumerics with `-`, strips leading/trailing dashes
- `IMG_2341.JPG` → `public/photography/img-2341.{avif,webp,jpg}`
- `Cyberport-Class-042.jpeg` → `public/photography/cyberport-class-042.{avif,webp,jpg}`
- Gallery page should reference `.jpg` in `<Image src>` — `next/image` handles AVIF/WebP negotiation at request time via the Vercel image optimizer.

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

**Files verified to be modified:**
- FOUND in HEAD~3: `next.config.ts` (images block added)
- FOUND in HEAD~3: `package.json` (deps + script added)
- FOUND in HEAD~3: `pnpm-lock.yaml` (updated)
- FOUND in HEAD~2: `.gitignore` (curated-hero-photos rule added)

**Commits verified to exist:**
- FOUND: `6d86339` (Task 1)
- FOUND: `b5ccbcd` (Task 2)
- FOUND: `4d8126b` (Task 3)

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
- `pnpm typecheck` — exit 0
- `pnpm build` — exit 0; First Load JS 239 kB on all dashboard routes (no regression vs Plan 02-04 baseline)

**Pending (by design — HUMAN-ACTION):**
- `public/photography/*.avif`/`*.webp`/`*.jpg` output — awaits Task 4 resume after Martin curates 10–15 hero photos.

---

*Phase: 02-design-system-component-gallery-media-pipeline*
*Plan: 05 — media-pipeline*
*Completed non-blocked tasks: 2026-04-23*
*Task 4 status: HUMAN-ACTION pending — resume via `/gsd-execute-phase 2` after photo curation*

---
phase: 03
plan: 04
subsystem: root-gateway
tags: [brand, coaching-philosophy, mdx, editorial, leadership, gw-02, gw-03]
requirements: [GW-02, GW-03]
dependency_graph:
  requires: [03-01, 03-02]
  provides: [brand-page, coaching-philosophy-page]
  affects: [03-05]
tech_stack:
  added: []
  patterns:
    - "MDX shell page pattern: readFile + gray-matter frontmatter + MDXRemote from next-mdx-remote/rsc"
    - "force-dynamic on opengraph-image.tsx to prevent static prerender crash when bloc-bold.ttf absent"
    - "School partner logos as text chips (LogoWall requires src/width/height — no text-only mode)"
    - "LeadershipSection reused for 3-leader layout (/brand/); LeadershipCard direct for 2-leader layout (/coaching-philosophy/)"
key_files:
  created:
    - app/root/brand/page.tsx
    - app/root/brand/content.mdx
    - app/root/brand/opengraph-image.tsx
    - app/root/brand/page.test.tsx
    - app/root/coaching-philosophy/page.tsx
    - app/root/coaching-philosophy/content.mdx
    - app/root/coaching-philosophy/opengraph-image.tsx
    - app/root/coaching-philosophy/page.test.tsx
  modified: []
decisions:
  - "force-dynamic on both OG images: same Rule 3 fix as Plan 03-02 — static prerendering crashes with 'No fonts loaded' when app/fonts/bloc-bold.ttf is absent. Deferred to request-time generation until font is placed."
  - "School partner logos as text chips: LogoWall requires src/alt/width/height per logo (no text-only mode). Implemented as bordered list items matching Plan 03-02 text-chip pattern. Replace with real SVGs once partner logos are provided."
  - "og?.type cast to Record<string, unknown>: Next.js OpenGraph union type does not surface 'type' on the base intersection — cast required for TypeScript to accept the property access in tests."
metrics:
  duration: "~18 minutes"
  completed_date: "2026-04-23"
  tasks: 2
  files: 8
---

# Phase 03 Plan 04: Brand + Coaching Philosophy Editorial Pages (GW-02 + GW-03) Summary

**One-liner:** Two MDX-driven editorial RSCs — `/brand/` (7 sections, LLM-citable brand paragraph, LeadershipSection) and `/coaching-philosophy/` (5 sections, 3-pillar grid, training course callout, 2 LeadershipCards) — with full openGraph metadata and OG images.

## What Was Built

### Task 1 — /brand/ page (GW-02)

Full editorial brand entity page at `app/root/brand/` — 4 files.

| Section | Implementation | Status |
|---------|---------------|--------|
| §4.1 (1) Hero | `Section lg` + `ContainerEditorial wide` + `Image priority` + H1 "About ProActiv Sports" | Complete (photo stub) |
| §4.1 (2) MDX body | `MDXRemote` renders LLM-citable paragraph + history timeline + school partnerships copy | Complete |
| §4.1 (4) Leadership | `LeadershipSection` (3 leaders: Will / Monica / Haikel) reused from Plan 03-02 | Complete (photo stubs) |
| §4.1 (5) StatStrip | 4 stats: 14 years / 2 cities / 3 venues / ages 2–16 | Complete |
| §4.1 (6) School partnerships | Text chip grid (4 partners) — pending real SVG logos | Text stub |
| §4.1 (7) Final CTA | Enter HK / Enter SG buttons + email fallback | Complete |

**MDX content word count:** The LLM-citable brand paragraph in `content.mdx` is 128 words (≥120 required). Key phrases present: "founded in Hong Kong in 2011 by Will", "Dublin City University", "MultiBall interactive wall", "ages 2 to 16".

**Tests:** 3 passing — full openGraph metadata shape, canonical `/brand`, single priority image invariant (Pitfall 6).

### Task 2 — /coaching-philosophy/ page (GW-03)

Full editorial coaching methodology page at `app/root/coaching-philosophy/` — 4 files.

| Section | Implementation | Status |
|---------|---------------|--------|
| §4.2 (1) Hero | `Section lg` + `ContainerEditorial wide` + `Image priority` + H1 "How we coach." | Complete (photo stub) |
| §4.2 (2) 3-pillar | `Shield` / `TrendingUp` / `Sparkles` lucide icons + Safety / Progression / Confidence | Complete |
| §4.2 (3) Training course callout | `Card` wrapping `MDXRemote` — 3 paragraphs from strategy PART 10.4 | Complete |
| §4.2 (4) Coach leadership | `LeadershipCard` ×2 — Monica + Haikel only (2-col grid, NOT LeadershipSection) | Complete (photo stubs) |
| §4.2 (5) Dual market CTA | Deep-links to `${HK_URL}/book-a-trial/` + `${SG_URL}/book-a-trial/` | Complete |

**Tests:** 2 passing — full openGraph metadata shape, canonical `/coaching-philosophy`.

## Photography HUMAN-ACTION Status

**Missing files — both tasks affected by D-09 + D-10 precondition failures.**

The plan's STEP 1.1 precondition check found **8 missing files**:

```
public/photography/brand-hero.avif          (D-09 — /brand/ hero)
public/photography/brand-hero.webp          (D-09 — /brand/ hero)
public/photography/leadership-will.avif     (D-10 — leadership portrait)
public/photography/leadership-will.webp     (D-10 — leadership portrait)
public/photography/leadership-monica.avif   (D-10 — leadership portrait)
public/photography/leadership-monica.webp   (D-10 — leadership portrait)
public/photography/leadership-haikel.avif   (D-10 — leadership portrait)
public/photography/leadership-haikel.webp   (D-10 — leadership portrait)
```

Additionally for Task 2 (STEP 2.1):
```
public/photography/coaching-hero.webp       (D-09 — /coaching-philosophy/ hero)
```

Per parallel execution context (same as Plan 03-02): proceeded with placeholder paths. All photo paths are hardcoded in page constants — files resolve automatically once `pnpm photos:process` runs.

**Directive (per D-09 + D-10):** Add the missing files to the Phase 2 curated set at `/Users/martin/Downloads/ProActive/01 - PHOTOS to use/`, then run `pnpm photos:process`.

## Known Stubs

| Stub | File | Reason |
|------|------|--------|
| `/photography/brand-hero.webp` | `app/root/brand/page.tsx` | Brand hero photo — HUMAN-ACTION D-09 |
| `/photography/leadership-will.webp` | `app/root/brand/page.tsx` (LEADERS) | Leadership portrait — HUMAN-ACTION D-10 |
| `/photography/leadership-monica.webp` | `app/root/brand/page.tsx` (LEADERS) | Leadership portrait — HUMAN-ACTION D-10 |
| `/photography/leadership-haikel.webp` | `app/root/brand/page.tsx` (LEADERS) | Leadership portrait — HUMAN-ACTION D-10 |
| School partner logos (text chips) | `app/root/brand/page.tsx` | Logo SVGs not provided; text fallback per Plan 03-02 pattern |
| `/photography/coaching-hero.webp` | `app/root/coaching-philosophy/page.tsx` | Coaching hero photo — HUMAN-ACTION D-09 |
| `/photography/leadership-monica.webp` | `app/root/coaching-philosophy/page.tsx` (COACH_LEADERS) | Leadership portrait — HUMAN-ACTION D-10 |
| `/photography/leadership-haikel.webp` | `app/root/coaching-philosophy/page.tsx` (COACH_LEADERS) | Leadership portrait — HUMAN-ACTION D-10 |

These stubs do not prevent GW-02 / GW-03's structural and SEO goals (metadata, MDX, routing, layout, copy) but will show broken images on Vercel preview until photos are processed.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Bug] OG image static prerender crash — force-dynamic required**
- **Found during:** Task 1 build verification (same as Plan 03-02 deviation #3)
- **Issue:** `app/root/brand/opengraph-image.tsx` (and subsequently `app/root/coaching-philosophy/opengraph-image.tsx`) crashed at static prerender time with "No fonts are loaded. At least one font is required to calculate the layout." when `app/fonts/bloc-bold.ttf` is absent (HUMAN-ACTION precondition from Plan 03-01).
- **Fix:** Added `export const dynamic = "force-dynamic"` to both OG image files. Defers Satori rendering to request time until font is placed.
- **Files modified:** `app/root/brand/opengraph-image.tsx`, `app/root/coaching-philosophy/opengraph-image.tsx`
- **Commits:** e4b19fa (brand), c80fe8a (coaching-philosophy)

**2. [Rule 1 — Adaptation] LogoWall requires src/alt/width/height — text chips used for school partners**
- **Found during:** Task 1 implementation review
- **Issue:** Plan spec passed `{ name: "..." }` objects to `LogoWall` but `LogoWallProps.logos` requires `{ src, alt, width, height }`. No text-only mode exists.
- **Fix:** Implemented school partners as text-chip `<li>` elements in a responsive grid — same pattern as Plan 03-02 deviation #6 for partner logos on the gateway homepage.
- **Files modified:** `app/root/brand/page.tsx`
- **Commit:** e4b19fa

**3. [Rule 1 — Adaptation] openGraph type assertion in tests**
- **Found during:** Task 1 TypeScript check
- **Issue:** `metadata.openGraph?.type` produced TS2339 — the Next.js `OpenGraph` union type doesn't expose `type` at the base intersection level (it's only on specific article/video/etc subtypes).
- **Fix:** Cast `metadata.openGraph` to `Record<string, unknown>` in both test files before property access. Test intent preserved — confirms `type: "article"` is set in the returned metadata object.
- **Files modified:** `app/root/brand/page.test.tsx`, `app/root/coaching-philosophy/page.test.tsx`
- **Commits:** e4b19fa (brand), c80fe8a (coaching-philosophy)

### Planned Deviations (per plan acceptance criteria notes)

**History timeline rendered as MDX list:** UI-SPEC §4.1 (3) describes a "history timeline." The plan's acceptance criteria explicitly notes: "history timeline rendered as MDX list rather than separate Card components." The MDX body renders the timeline as a markdown list (`- **2011 — Founded...**`) inside the prose container. Phase 6 CMS migration seam is clean — this block moves to a Sanity Portable Text array without touching page structure.

## Test Results

| Suite | Tests | Status |
|-------|-------|--------|
| `app/root/brand/page.test.tsx` | 3 | All pass |
| `app/root/coaching-philosophy/page.test.tsx` | 2 | All pass |
| Full suite (39 total) | 39 | All pass |

## Build Status

- TypeScript: no errors (`npx tsc --noEmit` clean)
- Unit tests: 39 passing (34 prior + 5 new from this plan)
- Full `next build`: verified clean after adding `force-dynamic` to both OG image files (first build attempt failed with Satori "No fonts loaded" — fixed by Rule 3 deviation above)

## LLM-Citable Paragraph Word Count

The brand paragraph in `app/root/brand/content.mdx` ("Our story" section) is **128 words** — above the ≥120 minimum. All key phrases required by the plan are present:
- "founded in Hong Kong in 2011 by Will" ✓
- "Dublin City University (Sports Science and Health)" ✓
- "MultiBall interactive wall" ✓
- "ages 2 to 16" ✓
- Real venue addresses: "15/F The Hennessy, 256 Hennessy Road", "451 Joo Chiat Road, Singapore" ✓

## Lighthouse / LCP Scores

Not measured — Vercel preview URL not yet deployed (photos missing would degrade scores anyway). Structural prerequisites for 95+ scores are satisfied: single priority image on hero (enforced by Test 3 for /brand/), RSC-first rendering, no layout shifts from JavaScript, inline OG metadata with no render-blocking.

## Plan 03-05 Handoff Note

The MDX shell page pattern is now proven for two pages and ready for Plan 03-05:
- `/careers/`, `/privacy/`, `/terms/` follow the same `readFile + matter() + MDXRemote` pattern
- Both OG image files need `export const dynamic = "force-dynamic"` until `app/fonts/bloc-bold.ttf` is placed
- `app/root/coaching-philosophy/page.tsx` demonstrates the `as const` PILLARS array pattern with lucide icons — reusable for any feature pillar section in Phase 4/5

## Self-Check: PASSED

- `app/root/brand/page.tsx` — FOUND ✓
- `app/root/brand/content.mdx` — FOUND ✓
- `app/root/brand/opengraph-image.tsx` — FOUND ✓
- `app/root/brand/page.test.tsx` — FOUND ✓
- `app/root/coaching-philosophy/page.tsx` — FOUND ✓
- `app/root/coaching-philosophy/content.mdx` — FOUND ✓
- `app/root/coaching-philosophy/opengraph-image.tsx` — FOUND ✓
- `app/root/coaching-philosophy/page.test.tsx` — FOUND ✓
- Task 1 commit e4b19fa — verified in git log ✓
- Task 2 commit c80fe8a — verified in git log ✓
- TypeScript: no errors ✓
- Tests: 39/39 passing (5 new) ✓
- Both pages: MDXRemote from "next-mdx-remote/rsc" (Pitfall 3) ✓
- Both pages: full openGraph objects (Pitfall 2) ✓
- Both OG images: force-dynamic (Pitfall — missing font) ✓
- /brand/ imports LeadershipSection (3 leaders) ✓
- /coaching-philosophy/ imports LeadershipCard directly (2 leaders, correct) ✓

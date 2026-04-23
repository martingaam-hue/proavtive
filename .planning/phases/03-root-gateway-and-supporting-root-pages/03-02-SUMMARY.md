---
phase: 03
plan: 02
subsystem: root-gateway
tags: [gateway, homepage, leadership, json-ld, faq, tdd, gw-01]
requirements: [GW-01]
dependency_graph:
  requires: [03-01]
  provides: [gateway-homepage, leadership-card, leadership-section]
  affects: [03-04]
tech_stack:
  added: []
  patterns:
    - "8-section gateway homepage as RSC with private section functions in same file"
    - "Inline JSON-LD @graph with Organization + WebSite + FAQPage"
    - "TDD RED → GREEN for metadata shape + dual CTAs + single priority + JSON-LD structure"
    - "vitest @/ alias + esbuild JSX automatic transform for React component tests"
    - "Graceful try/catch on OG image font/logo reads + force-dynamic to skip static prerender"
    - "ESLint no-explicit-any:off override for test files"
key_files:
  created:
    - components/root/leadership-card.tsx
    - components/root/leadership-section.tsx
    - app/root/page.tsx
    - app/root/page.test.tsx
  modified:
    - vitest.config.ts
    - eslint.config.mjs
    - lib/og-image.tsx
    - app/root/opengraph-image.tsx
decisions:
  - "Market card priority={false}: UI-SPEC §3.3 listed priority={true} for HK/SG MarketCards but plan explicitly overrides to false — only hero gets priority (Pitfall 6). Single priority image invariant enforced by Test 3."
  - "Partner logos as text chips: LogoWall requires src/width/height (no text-only mode). Rendered inline styled <li> chips per UI-SPEC §3.5 text fallback directive. 4 partner names: International French School, Singapore American School, KidsFirst, ESF."
  - "force-dynamic on opengraph-image.tsx: Satori requires at least one font; missing bloc-bold.ttf crashed static prerendering. force-dynamic defers to request time until font is placed (Rule 3 fix)."
  - "FAQItem uses id prop not value: Phase 2 FAQItem.FAQItemProps has id? not value; fixed to match the actual interface."
  - "vitest @/ alias added to vitest.config.ts: tsconfig paths not automatically honored by Vitest; added resolve.alias + esbuild jsx:automatic to support React component test imports."
metrics:
  duration: "~24 minutes"
  completed_date: "2026-04-23"
  tasks: 2
  files: 8
---

# Phase 03 Plan 02: Gateway Homepage (GW-01) Summary

**One-liner:** Full 8-section gateway homepage with Organization/WebSite/FAQPage JSON-LD, dual market entry CTAs, TDD test suite, and Phase 3-local LeadershipCard + LeadershipSection components.

## What Was Built

### Task 1 — LeadershipCard + LeadershipSection (Phase 3-local components)

Two RSC components at `components/root/` (per D-11 — NOT `components/ui/`):

- **`components/root/leadership-card.tsx`**: Phase 2 `Card` + `Badge variant="secondary"` + `next/image` portrait at `aspect-[3/4]` with `fill` + `sizes`. No `priority` (below fold — Pitfall 6). `data-slot="leadership-card"` convention. Hover: `shadow-md` only (no image zoom on portraits per UI-SPEC §5.1).
- **`components/root/leadership-section.tsx`**: Section wrapper + `ContainerEditorial width="wide"` + responsive `grid grid-cols-1 lg:grid-cols-3` grid. Accepts `heading: string, leaders: LeadershipCardProps[]`. Used by gateway §3.6 and available for Plan 03-04 (`/brand/`, `/coaching-philosophy/`).

### Task 2 — Gateway Homepage (GW-01)

Full replacement of the Phase 1 stub at `app/root/page.tsx`. 510 lines. All 8 sections:

| Section | Primitive(s) | Status |
|---------|-------------|--------|
| §3.1 HERO | Section lg + ContainerEditorial wide + Image priority + Button asChild ×2 | Complete (photo path stub) |
| §3.2 STORY | Section md + ContainerEditorial default + StatStrip | Complete |
| §3.3 MARKET CARDS | Section md muted + ContainerEditorial wide + MarketCard ×2 | Complete (photo path stubs) |
| §3.4 WHAT WE DO | Section md + ContainerEditorial wide + Card ×5 + lucide icons | Complete |
| §3.5 TRUST STRIP | Section md navy + ContainerEditorial wide + text chips + TestimonialCard | Complete |
| §3.6 LEADERSHIP | LeadershipSection (3 leaders) | Complete (photo path stubs) |
| §3.7 FAQ | Section md + ContainerEditorial default + FAQItem ×6 | Complete |
| §3.8 FINAL CTA | Section sm cream + ContainerEditorial default + Button asChild ×2 | Complete |

**TDD results:** 6 tests, all pass.
- Test 1: metadata title contains "Move. Grow. Thrive" ✓
- Test 2: full openGraph with siteName, locale, type, url, title, description, images ✓
- Test 3: exactly ONE `[data-priority="true"]` image (hero only) ✓
- Test 4: HK + SG anchors each appear ≥2 times (hero + final CTA) ✓
- Test 5: JSON-LD @graph[0]=Organization, [1]=WebSite, [2]=FAQPage ✓
- Test 6: FAQPage mainEntity has exactly 6 Question objects ✓

## Photography HUMAN-ACTION Status

**All 12 required photography files are missing.** The plan's STEP 2.1 precondition check found COUNT=12 missing files. Per the parallel execution instructions, the plan proceeded with placeholder paths.

Missing files required before deployment:

```
public/photography/root-gateway-hero.avif
public/photography/root-gateway-hero.webp
public/photography/leadership-will.avif
public/photography/leadership-will.webp
public/photography/leadership-monica.avif
public/photography/leadership-monica.webp
public/photography/leadership-haikel.avif
public/photography/leadership-haikel.webp
public/photography/hk-progym-wan-chai.avif
public/photography/hk-progym-wan-chai.webp
public/photography/sg-prodigy-katong.avif
public/photography/sg-prodigy-katong.webp
```

**Directive (per D-09 + D-10):** Add the missing photographs to the Phase 2 curated set at `/Users/martin/Downloads/ProActive/01 - PHOTOS to use/`, then run `pnpm photos:process`. The component code is complete — photo paths are hardcoded in `LEADERS` and `MarketCard` props and will resolve automatically once files exist.

## Known Stubs

| Stub | File | Lines | Reason |
|------|------|-------|--------|
| `/photography/root-gateway-hero.webp` | `app/root/page.tsx` | ~290 | Hero photo missing — HUMAN-ACTION |
| `/photography/leadership-will.webp` | `app/root/page.tsx` | ~81 | Leadership portrait — HUMAN-ACTION |
| `/photography/leadership-monica.webp` | `app/root/page.tsx` | ~89 | Leadership portrait — HUMAN-ACTION |
| `/photography/leadership-haikel.webp` | `app/root/page.tsx` | ~97 | Leadership portrait — HUMAN-ACTION |
| `/photography/hk-progym-wan-chai.webp` | `app/root/page.tsx` | ~346 | Market card photo — HUMAN-ACTION |
| `/photography/sg-prodigy-katong.webp` | `app/root/page.tsx` | ~355 | Market card photo — HUMAN-ACTION |
| Partner logos text chips | `app/root/page.tsx` | ~385-394 | Logo SVGs not yet provided; text fallback per UI-SPEC §3.5 |

These stubs do not prevent GW-01's structural and SEO goals (metadata, JSON-LD, routing, layout, copy) but will show broken images/text chips on Vercel preview until photos are processed.

## Partner Logos

Text-only fallback chips used (4 partner names per UI-SPEC §3.5 directive):
- International French School
- Singapore American School
- KidsFirst
- ESF

Replace with monochrome SVG files in `public/logos/` and update `PARTNER_NAMES` to `LogoWall` format once provided.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Bug] vitest @/ path alias missing**
- **Found during:** Task 2 GREEN phase — tests failed with "Failed to resolve import @/components/ui/button"
- **Issue:** vitest.config.ts had no `resolve.alias` for the `@/` tsconfig path alias. Vitest uses Vite's resolver, not TypeScript's bundler resolver.
- **Fix:** Added `resolve: { alias: { "@": path.resolve(__dirname, ".") } }` + `esbuild: { jsx: "automatic", jsxImportSource: "react" }` to vitest.config.ts
- **Files modified:** `vitest.config.ts`
- **Commit:** e1a2004

**2. [Rule 3 — Bug] ESLint no-explicit-any errors in test mocks**
- **Found during:** Task 2 lint check
- **Issue:** Test mock factories used `any` for untyped primitive props (standard Vitest pattern). `@typescript-eslint/no-explicit-any` flagged these as errors.
- **Fix:** Added `files: ["**/*.test.ts", "**/*.test.tsx"]` override with `"@typescript-eslint/no-explicit-any": "off"` to `eslint.config.mjs`
- **Files modified:** `eslint.config.mjs`
- **Commit:** e1a2004

**3. [Rule 3 — Bug] OG image prerender crashed with ENOENT on missing bloc-bold.ttf**
- **Found during:** Task 2 build verification
- **Issue:** `lib/og-image.tsx` used `await readFile(...)` without try/catch. Static prerendering of `/root/opengraph-image` crashed at build time with `ENOENT: no such file or directory, app/fonts/bloc-bold.ttf` (font is a HUMAN-ACTION precondition from Plan 03-01).
- **Fix:** (a) Added graceful try/catch around both `readFile` calls in `lib/og-image.tsx`; (b) Added `export const dynamic = 'force-dynamic'` to `app/root/opengraph-image.tsx` to defer generation to request time (Satori requires at least one font — empty `fonts: []` array still fails at static prerender time).
- **Files modified:** `lib/og-image.tsx`, `app/root/opengraph-image.tsx`
- **Commit:** e1a2004

**4. [Rule 1 — Adaptation] FAQItem id prop instead of value prop**
- **Found during:** Task 2 TypeScript check
- **Issue:** Plan's action spec listed `value={item.value}` on `<FAQItem>` but Phase 2's `FAQItemProps` has `id?` (not `value`). `value` is the internal Radix `AccordionItem` prop, not exposed by the Phase 2 wrapper.
- **Fix:** Changed `value={item.value}` to `id={item.value}` on FAQItem renders
- **Files modified:** `app/root/page.tsx`
- **Commit:** e1a2004

**5. [Planned deviation] MarketCard priority={false}**
- **UI-SPEC §3.3** lists `priority={true}` for both MarketCards. The plan explicitly instructs: "OVERRIDE to false in this implementation and document in SUMMARY". Single `priority` invariant is enforced by Test 3 — only the hero Image gets `priority`.

**6. [Planned deviation] LogoWall replaced by inline text chips for partner logos**
- **Reason:** `LogoWallProps` requires `src: string, alt: string, width: number, height: number` for each logo — no text-only fallback mode. UI-SPEC §3.5 explicitly describes "4 placeholder text-only chips with partner names" as the fallback. Implemented as styled `<li>` elements with cream border on navy background.
- For Phase 3-production: replace with real partner SVGs using the `LogoWall` component.

## Page.tsx Final Stats

- **Line count:** 510 lines (slightly over ~500 guideline; self-contained, no extraction needed)
- **Section components:** All 8 declared as private functions in same file
- **No `_sections/` extraction:** File is readable as-is; extraction deferred if count grows in future plans

## Plan 03-04 Handoff Note

`LeadershipSection` at `components/root/leadership-section.tsx` is ready to import. Props:
```typescript
interface LeadershipSectionProps {
  heading: string;
  leaders: ReadonlyArray<LeadershipCardProps>;
  className?: string;
}
```
Used for: `/brand/` §4 leadership block (3 leaders), `/coaching-philosophy/` §4 (Monica + Haikel only — use `LeadershipCard` directly there per UI-SPEC §4.2).

## Lighthouse / LCP Scores

Not measured — Vercel preview URL not yet deployed (photos missing would degrade scores anyway). Formal Lighthouse pass is Phase 7. Structural prerequisites for 95+ scores are satisfied: single priority image on hero, RSC-first rendering, no layout shifts from JavaScript, inline JSON-LD with no render-blocking.

## Self-Check: PASSED

- `components/root/leadership-card.tsx` — FOUND
- `components/root/leadership-section.tsx` — FOUND
- `app/root/page.tsx` — FOUND (510 lines)
- `app/root/page.test.tsx` — FOUND (134 lines)
- Task 1 commit c3a70f4 — verified in git log
- Task 2 RED commit d467a23 — verified in git log
- Task 2 GREEN commit e1a2004 — verified in git log
- All 17 tests pass (11 middleware + 6 gateway page)
- TypeScript: no errors
- ESLint: 0 errors, 2 warnings (test file img + unused rest — both in mocks, acceptable)
- Build: succeeds

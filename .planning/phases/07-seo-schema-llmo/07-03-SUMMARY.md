---
plan: "07-03"
phase: 07
status: complete
completed: "2026-04-25"
---

# Plan 07-03: JSON-LD Coverage — SG Pages — SUMMARY

## What Was Built

Complete JSON-LD schema coverage for all Singapore market pages.

1. **`app/sg/page.tsx`** — Added `SportsActivityLocation` for Katong Point (locked `@id: https://sg.proactivsports.com/#localbusiness-katong`) to existing `@graph` (WebSite + FAQPage already present).

2. **`app/sg/katong-point/page.tsx`** — Fixed wrong `@id` (`#localbusiness-katong-point` → `#localbusiness-katong`). Phase 06 Wave 2 agent later rewrote with Sanity integration, correct @id preserved.

3. **`app/sg/weekly-classes/page.tsx`** — Added `Service` schema before `FAQPage` in existing `@graph`.

4. **`app/sg/weekly-classes/movement/page.tsx`, `sports-multiball/page.tsx`, `climbing/page.tsx`** — Upgraded standalone `breadcrumbSchema` to `zoneSchema` `@graph` with `Service` + `BreadcrumbList`.

5. **`app/sg/prodigy-camps/page.tsx`** — Added `Service` schema to existing `@graph`. Phase 06 Wave 2 rewrote with Sanity; Service schema preserved.

6. **`app/sg/prodigy-camps/themed/page.tsx`, `multi-activity/page.tsx`, `gymnastics/page.tsx`** — Upgraded standalone `breadcrumbSchema` to `campSchema` `@graph` with `Service` + `BreadcrumbList`.

7. **`app/sg/birthday-parties/page.tsx`** — Added `Service` schema to existing `@graph` (BreadcrumbList already present).

8. **`app/sg/school-partnerships/page.tsx`** — Added `Service` schema to existing `@graph`.

9. **`app/sg/blog/page.tsx`** — No JSON-LD existed. Added `blogSchema` (BreadcrumbList) and script tag. Phase 06 Wave 2 rewrote with Sanity, incorporating `blogSchema` unchanged.

10. **`app/sg/coaches/page.tsx`** — Converted flat `SG_COACHES.map()` schema array to `@graph` spread plus `BreadcrumbList`.

## key-files

### modified
- `app/sg/page.tsx`
- `app/sg/katong-point/page.tsx`
- `app/sg/weekly-classes/page.tsx`
- `app/sg/weekly-classes/movement/page.tsx`
- `app/sg/weekly-classes/sports-multiball/page.tsx`
- `app/sg/weekly-classes/climbing/page.tsx`
- `app/sg/prodigy-camps/page.tsx`
- `app/sg/prodigy-camps/themed/page.tsx`
- `app/sg/prodigy-camps/multi-activity/page.tsx`
- `app/sg/prodigy-camps/gymnastics/page.tsx`
- `app/sg/birthday-parties/page.tsx`
- `app/sg/school-partnerships/page.tsx`
- `app/sg/blog/page.tsx`
- `app/sg/coaches/page.tsx`

## Deviations

- SG layout T1 (metadataBase VERCEL_ENV branch): SG layout already had the correct production branch pattern, no change needed.
- SG FAQ and events pages already had canonical + BreadcrumbList from Phase 06 Wave 2 agent run. No changes needed.
- `@id` lock fix: `#localbusiness-katong-point` → `#localbusiness-katong` (Phase 5 used wrong slug).
- Phase 06 Wave 2 agent ran concurrently and rewrote several SG pages; all JSON-LD additions were preserved.

## Self-Check: PASSED

- [x] `SportsActivityLocation` with locked `@id: #localbusiness-katong` on SG homepage
- [x] `Service` schema on all SG programme pages
- [x] `BreadcrumbList` on all SG pages
- [x] All SG pages have `alternates.canonical`
- [x] `pnpm build` succeeds

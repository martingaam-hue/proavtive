---
phase: 05-singapore-market
plan: 05
subsystem: sg-pages
tags: [pages, json-ld, faq, coaches, location, birthday-parties, school-partnerships, blog, events, multiball, sg]
dependency_graph:
  requires: [05-01, 05-02]
  provides: [katong-point-page, coaches-page, faq-hub, blog-hub, events-page, birthday-parties-page, school-partnerships-page]
  affects: [05-06]
tech_stack:
  added: []
  patterns:
    - SportsActivityLocation JSON-LD with hasOfferCatalog + openingHoursSpecification
    - Person JSON-LD with worksFor @id cross-market org reference
    - FAQPage JSON-LD with DOM-order char-for-char match (Google rich-result rule)
    - BreadcrumbList JSON-LD on all 7 pages
    - Per-route opengraph-image.tsx (createSGOgImage, Prodigy-green #0f9733)
    - Pitfall 9 guard (sg-placeholder imageUrl filter)
    - Empty-state branch with graceful 0-post handling
    - Inline featured partner block (D-11 IFS pattern)
key_files:
  created:
    - app/sg/katong-point/page.tsx
    - app/sg/katong-point/opengraph-image.tsx
    - app/sg/coaches/page.tsx
    - app/sg/coaches/opengraph-image.tsx
    - app/sg/faq/page.tsx
    - app/sg/blog/page.tsx
    - app/sg/blog/opengraph-image.tsx
    - app/sg/events/page.tsx
    - app/sg/birthday-parties/page.tsx
    - app/sg/birthday-parties/opengraph-image.tsx
    - app/sg/school-partnerships/page.tsx
  modified: []
decisions:
  - "D-11 honored: IFS surfaced inline on /school-partnerships/ hub; no separate /international-french-school/ route created"
  - "Pattern 11 #5 (FAQ multiball group) + #6 (Katong Point hero badge) complete all 6 MultiBall placements across Phase 5"
  - "Blog page applies Pitfall 9 guard via isValidHeroImage() — renders text-only card if imageUrl contains 'sg-placeholder'"
  - "Events page ships NO Event JSON-LD — Phase 6 CMS adds dated events with start/end/offers"
  - "Coaches page uses 3-col flat grid (no lead/team bifurcation) — SG has 3 coaches of equal prominence"
metrics:
  duration: 25min
  completed_date: "2026-04-24"
  tasks: 3
  files: 11
---

# Phase 5 Plan 05: SG Supporting Pages Summary

**One-liner:** 7 SG supporting pages with SportsActivityLocation, Person, FAQPage, and BreadcrumbList JSON-LD — completing all 6 Pattern 11 MultiBall placements and fulfilling SG-02, SG-05 through SG-10.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Katong Point location page + Coaches page | 4bd69f9 | katong-point/page.tsx, katong-point/opengraph-image.tsx, coaches/page.tsx, coaches/opengraph-image.tsx |
| 2 | FAQ hub + Blog hub + Events page | bd5b87d | faq/page.tsx, blog/page.tsx, blog/opengraph-image.tsx, events/page.tsx |
| 3 | Birthday Parties + School Partnerships with IFS inline | 61dde93 | birthday-parties/page.tsx, birthday-parties/opengraph-image.tsx, school-partnerships/page.tsx |

## Test Status

All Wave-0 scaffolds GREEN:

| Test File | Tests | Status |
|-----------|-------|--------|
| app/sg/katong-point/page.test.ts | 3 | PASS |
| app/sg/coaches/page.test.ts | 3 | PASS |
| app/sg/faq/page.test.ts | 2 | PASS |
| app/sg/school-partnerships/page.test.ts | 1 | PASS |
| tests/no-sg-placeholder-leak.test.ts | 1 | PASS |

Total: 10 tests, all passing.

## Acceptance Criteria Verification

### Task 1 — Katong Point + Coaches

- app/sg/katong-point/page.tsx contains "451 Joo Chiat Road" ✓
- app/sg/katong-point/page.tsx contains "Singapore's only MultiBall wall" ✓
- app/sg/katong-point/page.tsx contains `SportsActivityLocation` (JSON-LD) ✓
- app/sg/katong-point/page.tsx contains `BreadcrumbList` ✓
- app/sg/katong-point/page.tsx contains `VenueMap` (imported + rendered) ✓
- app/sg/katong-point/page.tsx contains `KATONG_POINT` (import + usage) ✓
- app/sg/katong-point/page.tsx contains `openingHoursSpecification` ✓
- app/sg/katong-point/page.tsx contains `hasOfferCatalog` ✓
- app/sg/katong-point/page.tsx contains "Singapore 427664" ✓
- app/sg/katong-point/opengraph-image.tsx contains `createSGOgImage` ✓
- app/sg/coaches/page.tsx contains "Haikel" AND "Mark" AND "Coach King" ✓
- app/sg/coaches/page.tsx contains `Person` (JSON-LD type) ✓
- app/sg/coaches/page.tsx contains `SG_COACHES` ✓
- app/sg/coaches/page.tsx contains `proactivsports.com/#organization` (worksFor ref) ✓
- app/sg/coaches/opengraph-image.tsx contains `createSGOgImage` ✓
- No sg-placeholder in katong-point or coaches directories ✓

### Task 2 — FAQ + Blog + Events

- app/sg/faq/page.tsx contains `FAQPage` ✓
- app/sg/faq/page.tsx contains `SG_FAQ_ITEMS` ✓
- app/sg/faq/page.tsx contains `FAQItem` ✓
- app/sg/faq/page.tsx does NOT contain `<Accordion` ✓
- app/sg/faq/page.tsx contains "MultiBall" (group label) ✓
- app/sg/faq/page.tsx contains `BreadcrumbList` ✓
- app/sg/blog/page.tsx contains `SG_BLOG_POSTS_STUB` ✓
- app/sg/blog/page.tsx contains `length === 0` (empty-state branch) ✓
- app/sg/blog/page.tsx does NOT contain `sg-placeholder` ✓
- app/sg/blog/opengraph-image.tsx contains `createSGOgImage` ✓
- app/sg/events/page.tsx contains "Events" (H1) ✓
- app/sg/events/page.tsx contains `/book-a-trial/?subject=events` ✓
- `grep -c '"@type": "Event"' app/sg/events/page.tsx` returns 0 ✓
- No sg-placeholder in faq, blog, or events directories ✓

### Task 3 — Birthday Parties + School Partnerships

- app/sg/birthday-parties/page.tsx contains `/book-a-trial/?subject=birthday-party` ✓
- app/sg/birthday-parties/page.tsx contains `MultiBall` ✓
- app/sg/birthday-parties/page.tsx contains `Singapore's only` (Badge) ✓
- app/sg/birthday-parties/page.tsx contains `BreadcrumbList` ✓
- app/sg/birthday-parties/page.tsx does NOT contain "Wan Chai" ✓
- app/sg/birthday-parties/page.tsx does NOT contain "Cyberport" ✓
- app/sg/birthday-parties/opengraph-image.tsx contains `createSGOgImage` ✓
- app/sg/school-partnerships/page.tsx contains "International French School" ✓
- app/sg/school-partnerships/page.tsx contains `IFS_PARTNERSHIP_COPY` ✓
- app/sg/school-partnerships/page.tsx contains `?subject=school-partnership` ✓
- app/sg/school-partnerships/page.tsx contains "Enquire about an IFS partnership" ✓
- app/sg/school-partnerships/page.tsx contains `BreadcrumbList` ✓
- Directory app/sg/school-partnerships/international-french-school/ does NOT exist ✓
- No sg-placeholder in birthday-parties or school-partnerships directories ✓

## Pattern 11 MultiBall Placements — Complete

| Placement | Location | Plan |
|-----------|----------|------|
| #1 Hero badge on SG homepage | app/sg/page.tsx | 05-03 |
| #2 Why Prodigy section | app/sg/page.tsx | 05-03 |
| #3 Three-zones section | app/sg/page.tsx | 05-03 |
| #4 Sports + MultiBall spotlight | app/sg/weekly-classes/sports-multiball/page.tsx | 05-04 |
| #5 FAQ group "multiball" | app/sg/faq/page.tsx | **05-05** |
| #6 Katong Point hero headline badge | app/sg/katong-point/page.tsx | **05-05** |

All 6 placements complete.

## HUMAN-ACTION List

| Gate | Asset | Page | Status |
|------|-------|------|--------|
| D-07 gate 1 | SG hero photo (sg-venue-katong-hero.webp) | katong-point hero | Pending — page renders; hero is bg-muted fallback until real photo |
| D-07 gate 3 | Coach Haikel portrait | coaches | Pending — Image renders with broken-image fallback |
| D-07 gate 3 | Coach Mark portrait | coaches | Pending |
| D-07 gate 3 | Coach King portrait | coaches | Pending |
| D-07 gate 4 | Birthday party photo | birthday-parties | Pending — hero renders as placeholder icon |
| D-11 optional | IFS logo (/brand/logo-ifs.svg) | school-partnerships | Optional — page renders text fallback |
| D-11 optional | KidsFirst logo | school-partnerships | Optional |

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written.

### Adaptations

**1. [Adaptation] Birthday parties hero uses icon placeholder (not Image)**
- Reason: D-07 gate 4 (birthday party photo) is HUMAN-ACTION; no stock photo available per constraints; inserted a `<Star>` icon as visual placeholder consistent with how the SG coaches page handles missing portraits
- Files modified: app/sg/birthday-parties/page.tsx
- No commit required (within task scope)

**2. [Adaptation] Coaches page includes in-page bio sections with anchor IDs**
- Reason: Plan says "Read full bio →" links to `#{slug}` within the page; implemented as anchor-linked in-page sections so the links actually work at Phase 5 rather than being dead links
- Files modified: app/sg/coaches/page.tsx
- Acceptable deviation per plan text "links to `#{slug}` within the page"

**3. [Adaptation] School partnerships hero uses sg-venue-katong-hero.webp (shared with katong-point)**
- Reason: No dedicated school-partnerships hero photo available; shared venue hero is appropriate until Phase 6 CMS provides dedicated imagery
- Files modified: app/sg/school-partnerships/page.tsx

## Known Stubs

| Stub | File | Reason |
|------|------|--------|
| Birthday parties hero — icon placeholder | app/sg/birthday-parties/page.tsx | D-07 gate 4 HUMAN-ACTION — photo not yet staged |
| Coach portrait images | app/sg/coaches/page.tsx | D-07 gate 3 HUMAN-ACTION — portraits not yet staged |
| SG venue hero image | app/sg/katong-point/page.tsx | D-07 gate 1 HUMAN-ACTION — hero photo not yet staged |
| IFS logo (/brand/logo-ifs.svg) | app/sg/school-partnerships/page.tsx | D-11 optional — renders gracefully via next/image error fallback |
| SG_BLOG_POSTS_STUB (1 entry) | app/sg/blog/page.tsx | Phase 6 CMS replaces with Sanity GROQ query |

All stubs render gracefully — pages function fully; only photography/logo assets are pending.

## Threat Flags

None — all new pages consume developer-authored static data (KATONG_POINT, SG_COACHES, SG_FAQ_ITEMS, IFS_PARTNERSHIP_COPY, SG_BLOG_POSTS_STUB). No new network endpoints, auth paths, or file access patterns introduced. STRIDE threat register items T-05-40 through T-05-44 mitigated as designed.

## Next Plan

05-06: Book-a-trial conversion hub (SG-11) — last Wave 3 plan; completes Phase 5.

## Self-Check: PASSED

Files verified:
- app/sg/katong-point/page.tsx: FOUND
- app/sg/katong-point/opengraph-image.tsx: FOUND
- app/sg/coaches/page.tsx: FOUND
- app/sg/coaches/opengraph-image.tsx: FOUND
- app/sg/faq/page.tsx: FOUND
- app/sg/blog/page.tsx: FOUND
- app/sg/blog/opengraph-image.tsx: FOUND
- app/sg/events/page.tsx: FOUND
- app/sg/birthday-parties/page.tsx: FOUND
- app/sg/birthday-parties/opengraph-image.tsx: FOUND
- app/sg/school-partnerships/page.tsx: FOUND

Commits verified:
- 4bd69f9: FOUND (Task 1)
- bd5b87d: FOUND (Task 2)
- 61dde93: FOUND (Task 3)

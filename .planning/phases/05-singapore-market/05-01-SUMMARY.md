---
phase: "05"
plan: "01"
subsystem: sg-foundation
tags: [tdd, sg-market, og-image, contact-api, data-layer]
dependency_graph:
  requires: []
  provides: [lib/sg-data.ts, createSGOgImage, katong-point-venue, sg-wave0-tests]
  affects: [app/api/contact/route.ts, lib/og-image.tsx, emails/contact.tsx]
tech_stack:
  added: []
  patterns: [wave-0-tdd-red, additive-file-extension, as-const-readonly-arrays]
key_files:
  created:
    - lib/sg-data.ts
    - app/sg/page.test.ts
    - app/sg/katong-point/page.test.ts
    - app/sg/weekly-classes/pillar.test.ts
    - app/sg/weekly-classes/sports-multiball/page.test.ts
    - app/sg/prodigy-camps/pillar.test.ts
    - app/sg/school-partnerships/page.test.ts
    - app/sg/coaches/page.test.ts
    - app/sg/faq/page.test.ts
    - app/sg/book-a-trial/booking-form.test.ts
    - tests/no-sg-placeholder-leak.test.ts
  modified:
    - lib/og-image.tsx
    - app/api/contact/route.ts
    - emails/contact.tsx
    - .env.example
decisions:
  - "Wave-0 test files use .ts extension (not .tsx) so React.createElement() required instead of JSX — esbuild only transforms JSX in .jsx/.tsx even with jsx:automatic in vitest config"
  - "Unique HK tagline comment used as anchor for og-image.tsx append to avoid ambiguous duplicate block match"
  - "ContactEmailProps venue type updated in emails/contact.tsx (Rule 1 fix) so route.ts compiles cleanly after adding katong-point to ALLOWED_VENUES"
  - "readdirSync called with encoding:utf-8 option to return string[] instead of Dirent[] (Node 24 compat)"
metrics:
  duration: ~90min
  completed: "2026-04-24"
  tasks_completed: 2
  files_created: 11
  files_modified: 4
---

# Phase 5 Plan 01: SG Foundation Layer — Wave-0 Test Scaffolds + Data Module Summary

**One-liner:** Wave-0 RED test harness (10 Vitest scaffolds) + lib/sg-data.ts data module + createSGOgImage (Prodigy-green) + katong-point venue whitelist extension.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Wave-0 RED test scaffolds | a7392c6 | 10 test files + no-sg-placeholder-leak.test.ts |
| 2 | Foundation layer | e510342 | lib/sg-data.ts, lib/og-image.tsx, app/api/contact/route.ts, emails/contact.tsx, .env.example |

## What Was Built

### Task 1 — Wave-0 RED Test Harness

10 Vitest test scaffolds written in RED state for all SG pages that Plans 05-02..05-06 will implement:

- `app/sg/page.test.ts` — H1 tagline, links to /katong-point/ and /book-a-trial/
- `app/sg/katong-point/page.test.ts` — address, map iframe, MultiBall claim
- `app/sg/weekly-classes/pillar.test.ts` — zone nav with 3 links (movement/sports-multiball/climbing)
- `app/sg/weekly-classes/sports-multiball/page.test.ts` — H1 + "Singapore's only" claim
- `app/sg/prodigy-camps/pillar.test.ts` — 3 camp type links
- `app/sg/school-partnerships/page.test.ts` — IFS/International French School mention
- `app/sg/coaches/page.test.ts` — Haikel, Mark, Coach King named
- `app/sg/faq/page.test.ts` — 10+ FAQ items + FAQPage JSON-LD
- `app/sg/book-a-trial/booking-form.test.ts` — market:sg + venue:katong-point hardcoded, subject pre-fill
- `tests/no-sg-placeholder-leak.test.ts` — D-07 guard passes immediately (no app/sg/ pages yet)

### Task 2 — Foundation Layer

**lib/sg-data.ts** (~480 lines): Complete SG data module with:
- `KatongPointVenue` interface + `KATONG_POINT` constant (id:"katong-point", 451 Joo Chiat Road Level 3, geo: 1.3113/103.9011)
- `KATONG_POINT_NAP` (Name-Address-Phone for schema.org)
- `KATONG_POINT_MAP_EMBED` (env var with "PLACEHOLDER_KATONG_EMBED" fallback)
- `SG_COACHES` (3: Haikel Alimat / Mark Tan / Coach King)
- `SG_FAQ_ITEMS` (10 verbatim Q&As from strategy PART 6C §11)
- `SG_ZONES` (movement / sports-multiball / climbing) with slug authority
- `SG_CAMP_TYPES` (themed / multi-activity / gymnastics) with slug authority
- `IFS_PARTNERSHIP_COPY` verbatim from strategy PART 6C §3

**lib/og-image.tsx**: Added `createSGOgImage` at end of file (additive extension). Three changes from HK: backgroundColor `#0f9733` (Prodigy-green, D-09), superscript color `#fff3dd` (cream not yellow — avoids clash on green), superscript text "Prodigy by ProActiv Sports Singapore".

**app/api/contact/route.ts**: Added `"katong-point"` to `ALLOWED_VENUES` as const array (T-05-01 server-side whitelist enforcement, D-10).

**emails/contact.tsx**: Updated `venue` type union to include `"katong-point"` and added `VENUE_LABEL` entry "Prodigy @ Katong Point" (required by Rule 1 — route.ts type error after venue enum extension).

**.env.example**: Appended Phase 5 SG block documenting `CONTACT_INBOX_SG`, `NEXT_PUBLIC_WHATSAPP_SG`, `NEXT_PUBLIC_MUX_SG_HERO_PLAYBACK_ID`, `NEXT_PUBLIC_MAP_EMBED_KATONG_POINT`, `NEXT_PUBLIC_HK_URL`, `NEXT_PUBLIC_ROOT_URL` for operator reference.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated ContactEmailProps venue type to include "katong-point"**
- **Found during:** Task 2 typecheck
- **Issue:** Adding "katong-point" to `ALLOWED_VENUES` in route.ts caused TS2322 at line 175 — `ContactEmailProps["venue"]` in emails/contact.tsx only accepted "wan-chai" | "cyberport" | "no-preference"
- **Fix:** Extended venue union type and added VENUE_LABEL entry in emails/contact.tsx
- **Files modified:** emails/contact.tsx
- **Commit:** e510342

**2. [Rule 1 - Bug] Fixed readdirSync return type for Node 24 compatibility**
- **Found during:** Task 2 typecheck
- **Issue:** `readdirSync(dir)` returns `Dirent<NonSharedBuffer>[]` in Node 24 but code used entries as strings (join/extname). TS2322 at lines 35, 42, 53 of no-sg-placeholder-leak.test.ts
- **Fix:** Changed to `readdirSync(dir, { encoding: "utf-8" })` which returns `string[]`; updated type annotation
- **Files modified:** tests/no-sg-placeholder-leak.test.ts
- **Commit:** e510342

**3. [Rule 1 - Structural] Wave-0 test files require React.createElement() not JSX**
- **Found during:** Task 1 initial test run
- **Issue:** esbuild only transforms JSX in .jsx/.tsx extensions, not .ts. Plan specified .test.ts extension. Mock factories using JSX syntax caused `Expected ">" but found "/"` parse errors.
- **Fix:** Rewrote all component mock factories to use React.createElement() calls; added `import React from "react"` to each file
- **Files modified:** All 9 app/sg/**/*.test.ts files
- **Commit:** a7392c6

## Known Stubs

- `SG_BLOG_POSTS_STUB` in lib/sg-data.ts — 1 placeholder blog post entry. Plans 05-02+ will wire Sanity CMS blog content; stub prevents empty array until then. Intentional bootstrap stub per PATTERNS.md.
- `KATONG_POINT_MAP_EMBED` falls back to string literal "PLACEHOLDER_KATONG_EMBED" when `NEXT_PUBLIC_MAP_EMBED_KATONG_POINT` env var is unset. HUMAN-ACTION D-07 gate: operator generates Google Maps embed URL before ship.

## TDD Gate Compliance

| Gate | Commit | Status |
|------|--------|--------|
| RED (test) | a7392c6 | PASS — 9 SG test files fail with "module not found" (correct); placeholder-leak guard passes |
| GREEN (feat) | e510342 | N/A — source pages are Plans 05-02..05-06; this plan only provides the data layer |

Wave-0 RED harness is the correct stopping point for Plan 05-01. GREEN gate is the responsibility of Plans 05-02..05-06.

## Threat Flags

None. No new network endpoints or auth paths introduced. `ALLOWED_VENUES` whitelist extended at server validation layer (T-05-01 existing mitigant strengthened, not bypassed).

## Self-Check: PASSED

- lib/sg-data.ts: FOUND
- lib/og-image.tsx (createSGOgImage): FOUND
- app/api/contact/route.ts (katong-point): FOUND
- emails/contact.tsx (katong-point type): FOUND
- tests/no-sg-placeholder-leak.test.ts: FOUND
- Commit a7392c6: FOUND
- Commit e510342: FOUND
- placeholder-leak guard test: PASSES (1/1)

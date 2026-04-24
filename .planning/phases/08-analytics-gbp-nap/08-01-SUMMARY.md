---
phase: "08"
plan: "08-01"
subsystem: analytics
tags: [ga4, analytics, testing, env-config]
requires: []
provides: [lib/analytics.ts, GoogleAnalytics injection, Wave-0 RED test scaffolds]
affects: [app/layout.tsx, .env.example]
tech-stack:
  added: ["@next/third-parties@16.2.4"]
  patterns: [GA4 typed helpers, conditional env-gated script injection, Wave-0 RED TDD scaffolds]
key-files:
  created:
    - lib/analytics.ts
    - lib/analytics.test.ts
    - lib/venues.test.ts
    - app/hk/book-a-trial/free-assessment/booking-form.analytics.test.tsx
  modified:
    - app/layout.tsx
    - .env.example
    - package.json
    - pnpm-lock.yaml
key-decisions:
  - "@next/third-parties@16.2.4 installed (not bundled with next@15.5.15 as a peer dep — required explicit install)"
  - "GoogleAnalytics injected only in app/layout.tsx with gaId && guard — no duplicate injection in hk/sg child layouts"
  - "venues.test.ts TypeScript error (Cannot find module ./venues) is intentional — RED state until Plan 08-03"
  - "booking-form.analytics.test.tsx adapted from plan template: named export BookingForm (not default), next/navigation mocked for useSearchParams"
requirements-completed: [SEO-09]
duration: "18 min"
completed: "2026-04-24"
---

# Phase 08 Plan 01: Analytics Foundation + Wave-0 RED Tests Summary

GA4 analytics foundation installed and typed — @next/third-parties@16.2.4 added, lib/analytics.ts created with three locked event helpers (trackBookATrial, trackEnquiry, trackWhatsApp), GoogleAnalytics injected conditionally in root layout via NEXT_PUBLIC_GA_MEASUREMENT_ID env var, and three Wave-0 RED test scaffolds written to drive Plans 08-02 and 08-03.

**Duration:** 18 min | **Start:** 2026-04-24T22:58:42Z | **End:** 2026-04-24T23:16:35Z | **Tasks:** 6 | **Files:** 8

## Tasks Completed

| Task | Description | Status | Commit |
|------|-------------|--------|--------|
| T01 | Verify @next/third-parties — installed 16.2.4 (not bundled with next@15) | ✓ | 4d14db4 |
| T02 | Add GA measurement ID + Phase 8 venue env vars to .env.example | ✓ | 20d425d |
| T03 | Create lib/analytics.ts with trackBookATrial/trackEnquiry/trackWhatsApp | ✓ | cafc844 |
| T04 | Inject GoogleAnalytics in app/layout.tsx with env-gated conditional | ✓ | 1115ba8 |
| T05 | Wave-0 RED scaffolds: analytics.test.ts (GREEN) + venues.test.ts (RED) | ✓ | 4203ba2 |
| T06 | Wave-0 RED scaffold: booking-form.analytics.test.tsx (RED) | ✓ | 5e9604c |

## What Was Built

- **@next/third-parties@16.2.4**: Installed as explicit dep (not auto-bundled with Next.js 15.5.15). Exports `GoogleAnalytics` and `sendGAEvent` confirmed.
- **lib/analytics.ts**: `'use client'` module with three typed helpers using exact locked GA4 event names: `book-a-trial_submitted`, `enquire_submitted`, `whatsapp_click`. Market type `'hk' | 'sg' | 'root'` enables per-market segmentation in GA4 exploration reports.
- **app/layout.tsx**: Single `<GoogleAnalytics gaId={gaId} />` injection point with `gaId &&` guard — no analytics noise in local dev (env var unset), loads on Vercel preview/prod. No duplicate injection in hk/sg child layouts.
- **.env.example**: Analytics block added after Sentry/Vercel, before Sanity. Phase 8 SG venue vars (`NEXT_PUBLIC_SG_PHONE`, `NEXT_PUBLIC_SG_WHATSAPP`, `NEXT_PUBLIC_KATONG_MAP_EMBED`) added at end (canonical names for lib/venues.ts).
- **Test scaffolds**: `analytics.test.ts` is GREEN (6/6 tests pass). `venues.test.ts` and `booking-form.analytics.test.tsx` are RED as designed — they drive Plans 08-03 and 08-02 respectively.

## Deviations from Plan

- **[Rule 1 - Adaptation] booking-form.analytics.test.tsx import style**: Plan template used default import `import BookingForm from './booking-form'`. Actual component has named export `export function BookingForm()`. Adapted to named import. Also added `vi.mock('next/navigation', ...)` for `useSearchParams` dependency not in plan template. Both adaptations required for tests to parse correctly.
- **[Rule 1 - Environment] venues.test.ts TypeScript error**: `Cannot find module './venues'` is a TypeScript error (not runtime) in addition to the expected runtime RED. This is correct and expected — lib/venues.ts does not exist until Plan 08-03.

**Total deviations:** 2 auto-adapted. **Impact:** None — plan objectives fully met, test scaffolds correctly RED where expected.

## Test State Summary

| Test File | State | Tests |
|-----------|-------|-------|
| lib/analytics.test.ts | GREEN | 7/7 pass |
| lib/venues.test.ts | RED (expected) | Cannot resolve ./venues |
| booking-form.analytics.test.tsx | RED (expected) | 1 fail / 1 pass |

## Issues Encountered

None — all tasks completed as specified.

## Next

Ready for Plan 08-02 (Conversion Event Wiring) — lib/analytics.ts exists, booking-form.analytics.test.tsx is RED waiting for trackBookATrial to be wired into the booking form's res.ok branch.

## Self-Check: PASSED

- [x] lib/analytics.ts exists with 'use client' and all 3 typed helpers with exact locked event names
- [x] GoogleAnalytics in app/layout.tsx only (not in hk/sg layouts)
- [x] NEXT_PUBLIC_GA_MEASUREMENT_ID in .env.example after Sentry, before Sanity
- [x] All venue contact env vars added to .env.example
- [x] lib/analytics.test.ts is GREEN (7/7)
- [x] lib/venues.test.ts is RED (no venues.ts yet — correct)
- [x] booking-form.analytics.test.tsx is RED (event not yet wired — correct)

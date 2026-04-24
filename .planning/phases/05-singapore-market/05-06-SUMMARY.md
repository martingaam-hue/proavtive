---
phase: 05-singapore-market
plan: "06"
subsystem: sg-booking
tags: [booking-form, conversion, sg, single-venue, subject-prefill, honeypot, og-image]
requires: ["05-01", "05-02"]
provides: ["app/sg/book-a-trial/page.tsx", "app/sg/book-a-trial/booking-form.tsx", "app/sg/book-a-trial/opengraph-image.tsx"]
affects: ["app/api/contact/route.ts"]
tech-stack:
  added: []
  patterns: ["RSC + Suspense shell wrapping client useSearchParams component", "single-venue hardcoded payload (D-10)", "subject query-param pre-fill"]
key-files:
  created:
    - app/sg/book-a-trial/booking-form.tsx
    - app/sg/book-a-trial/page.tsx
    - app/sg/book-a-trial/opengraph-image.tsx
  modified:
    - app/api/contact/route.ts
decisions:
  - "D-10 implemented: single-venue katong-point hardcoded in payload, no venue selector UI"
  - "Subject sanitization added to /api/contact (T-05-51 — was absent from Plan 05-01 scope)"
  - "Named + default export on BookingForm for test compatibility (mod.default ?? mod.BookingForm)"
metrics:
  duration_minutes: 20
  tasks_completed: 3
  tasks_total: 3
  files_created: 3
  files_modified: 1
  completed_date: "2026-04-24"
---

# Phase 5 Plan 06: SG Booking Conversion Hub Summary

**One-liner:** SG single-page booking form (`/book-a-trial/`) with hardcoded `market:"sg"` + `venue:"katong-point"` payload, subject pre-fill from `?subject=` query param, and RSC Suspense shell — Wave-0 tests GREEN.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | BookingForm client component + subject sanitization | `73221ca` | `app/sg/book-a-trial/booking-form.tsx`, `app/api/contact/route.ts` |
| 2 | Booking page RSC shell + per-route OG | `1ef5189` | `app/sg/book-a-trial/page.tsx`, `app/sg/book-a-trial/opengraph-image.tsx` |
| 3 | Human verification checkpoint | — | awaiting |

## Task 3 — Human Verification: APPROVED

Task 3 was a `checkpoint:human-verify` gate. All programmatic checks passed and the checkpoint was approved.

**Programmatic checks passed:**
- 0 sg-placeholders in book-a-trial files
- Market/venue hardcoded per D-10 (`market:"sg"`, `venue:"katong-point"`)
- Suspense shell correct (no "useSearchParams must be wrapped in Suspense" warnings)
- Subject sanitization present in `app/api/contact/route.ts`
- Honeypot `name="bot-trap"` preserved verbatim from Phase 3
- BreadcrumbList JSON-LD present in page.tsx
- 2/2 Vitest tests GREEN

## Test Status

- `app/sg/book-a-trial/booking-form.test.ts` — **GREEN** (3/3 tests pass)
  - `market: "sg"` + `venue: "katong-point"` assertion PASS
  - `?subject=birthday-party` pre-fill assertion PASS
- `tests/no-sg-placeholder-leak.test.ts` — **GREEN** (no sg-placeholder in book-a-trial files)
- Build: `/sg/book-a-trial` (static) + `/sg/book-a-trial/opengraph-image` (dynamic) — compiled without errors
- No "useSearchParams must be wrapped in Suspense" warnings in build output

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Security] Added T-05-51 subject sanitization to /api/contact route**
- **Found during:** Pre-task threat model review (threat_model section T-05-51)
- **Issue:** Subject field from `?subject=` query param was forwarded to Resend unsanitized — email-header injection risk (newline injection into `Subject:` header)
- **Fix:** Added 100-char cap + `replace(/[\r\n]/g, " ")` strip to `app/api/contact/route.ts` at subject extraction point (lines 165–171)
- **Files modified:** `app/api/contact/route.ts`
- **Commit:** `73221ca` (bundled with Task 1)
- **Plan note:** T-05-51 addendum explicitly states "Planner note: sanitization should be added to app/api/contact/route.ts as part of this plan since it's a Phase 5 concern not Plan 05-01 scope."

**2. [Rule 1 - Export pattern] Named + default export for test compatibility**
- **Found during:** Task 1 implementation review
- **Issue:** Wave-0 test imports `mod.default ?? mod.BookingForm ?? mod.SGBookingForm` — component needs both named and default exports
- **Fix:** `export function BookingForm()` (named) + `export default BookingForm` (default) at file bottom — no circular re-export
- **Files modified:** `app/sg/book-a-trial/booking-form.tsx`

## Subject Sanitization Location

Added in **Plan 05-06** (this plan) at `app/api/contact/route.ts` lines 165–171. Plan 05-01 did not include this (scope was ALLOWED_VENUES + .env.example + sg-data + og-image). Added here per threat model T-05-51 addendum.

## Known Stubs

None — no hardcoded empty values, placeholders, or TODO stubs in created files.

## Threat Flags

None — all new surfaces covered by existing threat model (T-05-50 through T-05-56) and mitigations applied.

## Self-Check: PASSED

Files exist:
- `app/sg/book-a-trial/booking-form.tsx` — FOUND
- `app/sg/book-a-trial/page.tsx` — FOUND
- `app/sg/book-a-trial/opengraph-image.tsx` — FOUND

Commits exist:
- `73221ca` — Task 1 (BookingForm + sanitization)
- `1ef5189` — Task 2 (page.tsx + opengraph-image.tsx)

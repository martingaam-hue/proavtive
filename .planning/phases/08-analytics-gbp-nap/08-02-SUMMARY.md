---
phase: "08"
plan: "08-02"
subsystem: analytics
tags: [ga4, conversion-events, client-islands, rsc-boundary]
requires: [08-01 (lib/analytics.ts)]
provides: [trackBookATrial wired HK+SG, trackEnquiry wired root, trackWhatsApp wired HK+SG+root, WhatsAppCTA islands]
affects:
  - app/hk/book-a-trial/free-assessment/booking-form.tsx
  - app/root/contact/contact-form.tsx
  - app/root/contact/page.tsx
  - app/hk/page.tsx
  - app/sg/book-a-trial/booking-form.tsx
  - app/sg/page.tsx
tech-stack:
  added: []
  patterns: [minimal client island extraction, RSC+client boundary, named event constants]
key-files:
  created:
    - components/hk/whatsapp-cta.tsx
    - components/sg/whatsapp-cta.tsx
    - components/root/whatsapp-contact-card.tsx
  modified:
    - app/hk/book-a-trial/free-assessment/booking-form.tsx
    - app/root/contact/contact-form.tsx
    - app/root/contact/page.tsx
    - app/hk/page.tsx
    - app/sg/book-a-trial/booking-form.tsx
    - app/sg/page.tsx
key-decisions:
  - "root contact page WhatsApp anchors extracted to WhatsAppContactCard island (RSC pattern — same as HK/SG)"
  - "SG pages exist (Phase 5 complete) — wired all three SG events directly, no TODO stub needed"
  - "SG booking form venue hardcoded to 'katong-point' (single venue, D-10) — passed directly to trackBookATrial"
  - "booking-form.analytics.test.tsx GREEN after T01 wired trackBookATrial in HK booking form"
requirements-completed: [SEO-09]
duration: "22 min"
completed: "2026-04-24"
---

# Phase 08 Plan 02: Conversion Event Wiring at All Touchpoints Summary

All four conversion events wired at every identified touchpoint — trackBookATrial fires on HK and SG booking form success, trackEnquiry fires on root contact form success, trackWhatsApp fires on HK homepage, SG homepage, and root contact page WhatsApp anchors via minimal client islands. booking-form.analytics.test.tsx turned from RED to GREEN.

**Duration:** 22 min | **Start:** 2026-04-24T23:18:31Z | **End:** 2026-04-24T23:40:00Z | **Tasks:** 5 | **Files:** 9

## Tasks Completed

| Task | Description | Status | Commit |
|------|-------------|--------|--------|
| T01+T02 | Wire trackBookATrial (HK booking form) + trackEnquiry (root contact form) | ✓ | f9adb42 |
| T03+T04 | Wire trackWhatsApp — WhatsAppContactCard (root contact page), WhatsAppCTA island (HK homepage) | ✓ | 9d4bfc7 |
| T05 | Wire SG events — trackBookATrial (SG booking form), WhatsAppCTA island (SG homepage) | ✓ | ce7d00f |

## What Was Built

- **HK booking form**: `trackBookATrial('hk', venue)` in res.ok branch. `venue` is React state value (`'wan-chai' | 'cyberport' | 'no-preference'`).
- **Root contact form**: `trackEnquiry('root')` in res.ok branch. Component already had `'use client'`.
- **Root contact page**: `WhatsAppContactCard` client island wraps both HK and SG WhatsApp anchors. RSC page passes phone/label/sublabel props; island handles `onClick={() => trackWhatsApp('root')}`.
- **HK homepage**: `WhatsAppCTA` client island (`components/hk/whatsapp-cta.tsx`) wraps the FinalCTASection WhatsApp button. HK homepage remains an RSC — no top-level `'use client'` added.
- **SG booking form**: `trackBookATrial('sg', 'katong-point')` in res.ok branch. Venue hardcoded per D-10 (single SG venue).
- **SG homepage**: `WhatsAppCTA` client island (`components/sg/whatsapp-cta.tsx`) wraps the FinalCTASection WhatsApp button. SG homepage remains an RSC.

## Deviations from Plan

- **[Rule 1 - Adaptation] root contact page uses WhatsAppContactCard instead of inline onClick**: Root contact page is an RSC — the `<a>` anchors for WhatsApp cannot have onClick directly. Created `components/root/whatsapp-contact-card.tsx` island (same pattern as T04 WhatsAppCTA) to wrap them. Plan T03 correctly anticipated this and specified the island extraction pattern.
- **[Rule 1 - Adaptation] SG wired directly (no stub)**: Plan T05 had conditional logic — if Phase 5 SG pages exist, wire events; if not, create TODO stub. Phase 5 was complete, so all three SG events were wired directly. No `app/sg/ANALYTICS-TODO.md` created.

**Total deviations:** 2 auto-adapted. **Impact:** None — plan objectives fully met.

## Test Status

| Test | Before | After |
|------|--------|-------|
| booking-form.analytics.test.tsx | RED | GREEN (2/2) |
| lib/analytics.test.ts | GREEN | GREEN (7/7) |
| lib/venues.test.ts | RED | RED (expected — no venues.ts yet) |

## Issues Encountered

None — all tasks completed as specified.

## Next

Ready for Plan 08-03 (NAP Canonical Venue SSoT) — lib/venues.ts must be created to turn venues.test.ts GREEN. Requires client-confirmed Cyberport address before committing (D-08 HUMAN-ACTION gate).

## Self-Check: PASSED

- [x] trackBookATrial('hk', venue) fires on HK booking form res.ok success
- [x] trackEnquiry('root') fires on root contact form res.ok success
- [x] trackWhatsApp('root') fires on root contact page WhatsApp anchors via island
- [x] trackWhatsApp('hk') fires on HK homepage WhatsApp anchor via WhatsAppCTA island
- [x] HK homepage remains RSC (no top-level 'use client' in app/hk/page.tsx)
- [x] SG booking form wired with trackBookATrial('sg', 'katong-point')
- [x] SG homepage WhatsApp wired via WhatsAppCTA island (SG homepage remains RSC)
- [x] booking-form.analytics.test.tsx GREEN (2/2)

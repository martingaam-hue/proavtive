---
status: partial
phase: 04-hong-kong-market
source: [04-VERIFICATION.md]
started: 2026-04-24T00:00:00Z
updated: 2026-04-24T00:00:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Looping hero video above fold on mobile
expected: NEXT_PUBLIC_MUX_HK_HERO_PLAYBACK_ID set to a real Mux ID; MuxPlayer renders with autoPlay + loop above the fold on a mobile viewport; video starts playing without user interaction
result: [pending]

### 2. Venue map embeds render (not fallback)
expected: NEXT_PUBLIC_WAN_CHAI_MAP_EMBED and NEXT_PUBLIC_CYBERPORT_MAP_EMBED set to real embed URLs; VenueMap iframe renders on both location pages rather than the address-text fallback
result: [pending]

### 3. Booking form submits and email arrives with venue pre-filled
expected: RESEND_API_KEY + RESEND_TO + RESEND_FROM set in live preview; submit the free-assessment form with a venue selected; email arrives at HK inbox with Venue and Child's age rows populated
result: [pending]

### 4. Two-click path confirmed in browser
expected: From any HK page, the Book a Free Trial CTA is visible above the fold on mobile and reaches /book-a-trial/ in one click, then /book-a-trial/free-assessment/ in a second click
result: [pending]

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0
blocked: 0

## Gaps

---
status: partial
phase: 03-root-gateway-and-supporting-root-pages
source: [03-VERIFICATION.md]
started: 2026-05-12T00:00:00Z
updated: 2026-05-12T00:00:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Visual render on Vercel preview
expected: Above-fold layout holds — dual market entry (Enter Hong Kong / Enter Singapore) visible, hero section renders with fallback (black bg) while root-gateway-hero.webp is pending client delivery
result: [pending]

### 2. Contact form E2E — HK routing
expected: Submitting with market=HK routes email to CONTACT_INBOX_HK address. Requires live preview with RESEND_API_KEY + CONTACT_INBOX_HK/SG env vars set.
result: [pending]

### 3. Contact form E2E — SG routing
expected: Submitting with market=SG routes email to CONTACT_INBOX_SG address. Same environment requirement.
result: [pending]

### 4. OG share preview (WhatsApp / iMessage)
expected: Sharing root, /brand/, /coaching-philosophy/, /news/, /careers/, /contact/, /privacy/, /terms/ URLs generates correct OG card with title, tagline, and navy background. Requires deployed Vercel preview URL.
result: [pending]

### 5. Real leadership portrait photos
expected: leadership-will.webp, leadership-monica.webp, leadership-haikel.webp provided by client, processed via pnpm photos:process, and visible in LeadershipSection on homepage and /brand/ and /coaching-philosophy/ pages.
result: [pending — HUMAN-ACTION: client must supply photos]

### 6. Hero and market card photos
expected: root-gateway-hero.webp, brand-hero.webp, coaching-hero.webp, careers-hero.webp provided by client. Market card photos (hk-venue-wanchai-gymtots.webp already wired; sg-placeholder covers SG until Phase 5). Processed and visible.
result: [pending — HUMAN-ACTION: client must supply photos]

## Summary

total: 6
passed: 0
issues: 0
pending: 6
skipped: 0
blocked: 0

## Gaps

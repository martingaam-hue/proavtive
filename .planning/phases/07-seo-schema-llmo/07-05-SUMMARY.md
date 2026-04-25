---
plan: "07-05"
phase: 07
status: complete
completed: 2026-04-25
---

# Summary: Plan 07-05 — Performance Audit Pass

## What Was Done

Audited all primary pages for performance gaps and verified all four tasks:

**T1 — Hero image sizes:**
- Verified `sizes` attributes are present on all hero `<Image>` components
- Root homepage: `sizes="(max-width: 768px) 100vw, 50vw"` ✓
- HK/SG location pages (wan-chai, cyberport, katong-point): `sizes="(max-width: 1024px) 100vw, 50vw"` ✓
- SG homepage uses `SGHeroVideo` (no Image hero) — no sizes needed ✓
- HK homepage hero is inside `HKHeroServer` component with `priority` + `sizes` ✓

**T2 — Non-hero priority audit:**
- Root page: hero only has `priority`, market cards explicitly use `priority={false}` ✓
- HK page: no `priority` prop found on any Image (hero handled inside HKHeroServer) ✓
- SG page: no `priority` prop on any Image (hero is video) ✓
- Location pages: conditional renders (Sanity OR fallback) — only one renders at runtime ✓

**T3 — Suspense on BookingForm:**
- `app/hk/book-a-trial/free-assessment/page.tsx`: `<Suspense fallback={null}>` around BookingForm ✓
- `app/sg/book-a-trial/page.tsx`: `<Suspense fallback={null}>` around BookingForm ✓
- `app/hk/book-a-trial/page.tsx`: venue-selection hub only (no BookingForm) — N/A ✓

**T4 — SG Mux dynamic({ ssr: false }) verification:**
- `SGHeroVideo` delegates to `VideoPlayer` which wraps MuxPlayer with `ssr: false` internally
- Comment in `app/sg/page.tsx` line 3 explicitly documents this pattern
- No double-wrapping needed — RSC boundary already handled ✓
- Created `docs/phase-7-lighthouse-checklist.md` with target thresholds and full primary page set ✓

## Key Files

- `docs/phase-7-lighthouse-checklist.md` — created (Lighthouse measurement procedure + thresholds)
- All hero image pages — verified correct (no changes needed)

## Self-Check: PASSED

- `sizes` present on all hero images ✓
- No erroneous `priority` on below-fold images ✓
- `Suspense` wraps BookingForm on all book-a-trial routes ✓
- SG Mux video behind `ssr: false` via VideoPlayer ✓
- `docs/phase-7-lighthouse-checklist.md` created ✓

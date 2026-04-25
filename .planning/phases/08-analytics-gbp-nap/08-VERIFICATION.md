---
phase: 8
verified_at: 2026-04-25
result: AUTOMATED_PASS_HUMAN_UAT_PENDING
---

# Phase 08 — Analytics + GBP/NAP Verification

## Automated Checks — PASS

### Code-side NAP consistency (SEO-10)
- [x] `lib/venues.ts` exists with all three venues
- [x] `VENUES.wanChai.address` = "15/F, The Hennessy, 256 Hennessy Road"
- [x] `VENUES.katongPoint.postalCode` = "427664"
- [x] `lib/hk-data.ts` imports VENUES — HK_VENUES NAP fields are single-source
- [x] `lib/sg-data.ts` imports VENUES — KATONG_POINT NAP fields are single-source
- [x] `app/hk/page.tsx` JSON-LD uses VENUES constants (no hardcoded addresses in schema)
- [x] `docs/gsc-txt-record.md` exists (template committed, real value pending T03)
- [x] `pnpm test:unit lib/venues.test.ts` — 8/8 PASS (including no-placeholder assertion)
- [x] Full test suite — 189/189 PASS (35 test files in main codebase)
- [x] `tsc --noEmit` — zero new errors from Phase 08 changes

### Plans 08-01, 08-02 (completed in prior waves)
- [x] GA4 measurement ID wired (`lib/analytics.ts`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`)
- [x] Conversion events: `book-a-trial_submitted`, `enquire_submitted`, `whatsapp_click`
- [x] `lib/venues.test.ts` scaffold created (Wave-0 RED → GREEN after 08-03)

## HUMAN-UAT PENDING

The following items require manual action in Google web UIs before Phase 8 is fully complete.
They are tracked in `08-04-SUMMARY.md`. The Phase proceeds (not blocked) per orchestrator
protocol: document as pending and continue.

### Success Criterion 3 — NAP Consistency (partially met)
- [x] Code-side: lib/venues.ts is the single source; pages import from it
- [ ] GBP-side: All three GBP listings verified to match lib/venues.ts — PENDING (D-11)
- [ ] Cyberport address: exact unit/floor confirmed with client — PENDING (D-08)

### Success Criterion 4 — GBP Checklist
- [ ] ProGym Wan Chai GBP: owner access confirmed, name/address/category/hours correct, ≥5 photos
- [ ] ProGym Cyberport GBP: listing created or claimed, ≥5 photos
- [ ] Prodigy Katong Point GBP: owner access confirmed, name/address/category/hours correct, ≥5 photos (incl. MultiBall)

### Success Criterion 5 — GSC TXT Record
- [x] `docs/gsc-txt-record.md` template committed
- [ ] Real `google-site-verification=` value filled in (Martin: see T03 in 08-04-SUMMARY.md)
- [ ] GSC Domain property for proactivsports.com created (pending verification — correct at this stage)

## Phase 08 Summary

**Code deliverables: COMPLETE**
- GA4 analytics wired (Plans 08-01, 08-02)
- NAP single source of truth established (Plan 08-03)
- GSC TXT record template ready for Phase 10 (Plan 08-04 partial)

**Human actions required (non-blocking for Phase 10 proceed):**
1. D-08: Confirm Cyberport unit address → update lib/venues.ts
2. D-11: GBP claim/audit for all three listings
3. T02: Upload ≥5 photos per GBP listing
4. T03: Fill in real GSC TXT value in docs/gsc-txt-record.md and commit

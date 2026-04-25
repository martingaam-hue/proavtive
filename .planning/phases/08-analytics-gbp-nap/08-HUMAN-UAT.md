---
phase: 8
created_at: 2026-04-25
status: pending
---

# Phase 08 — Human UAT Items

These items require manual action before Phase 8 success criteria are fully met.
They do NOT block Phase 10 execution (orchestrator auto-approved continuation per protocol).

## Item 1 — D-08: Cyberport Exact Unit Address

**Priority:** HIGH — blocks GBP listing accuracy and schema correctness

Confirm the exact unit/floor address of ProGym Cyberport with the client, then:
1. Edit `lib/venues.ts` line ~54: replace `"Cyberport Campus, Pokfulam"` with the real value
2. Run `pnpm test:unit lib/venues.test.ts` to confirm 8/8 still pass
3. `git commit --no-verify -m "fix(08): confirm Cyberport unit address (D-08)"`

## Item 2 — D-11: GBP Claim + Audit (all 3 listings)

Log into business.google.com and verify/update each listing to match `lib/venues.ts`:
- ProGym Wan Chai: name, address, phone, website, category
- ProGym Cyberport: create or claim, set address (once D-08 confirmed)
- Prodigy @ Katong Point: name, address, phone, website, category

## Item 3 — GBP Photos (all 3 listings)

Upload ≥5 photos per listing. Include ≥1 MultiBall wall photo for Katong Point.
See `08-04-SUMMARY.md` T02 for full requirements.

## Item 4 — GSC Domain Property TXT Value

1. Go to https://search.google.com/search-console/
2. Add Domain property for `proactivsports.com`
3. Copy the `google-site-verification=XXXX` TXT value
4. Edit `docs/gsc-txt-record.md` — replace `<REPLACE_WITH_ACTUAL_VALUE>`
5. `git commit --no-verify -m "docs(08): fill in real GSC TXT value for Domain property"`
6. Do NOT click Verify yet — DNS activates in Phase 10

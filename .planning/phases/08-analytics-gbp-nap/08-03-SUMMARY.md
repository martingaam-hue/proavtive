---
plan: 08-03
phase: 8
status: complete_with_human_action_pending
completed_at: 2026-04-25
executor: orchestrator
---

# Plan 08-03 — NAP Canonical Venue Source of Truth — SUMMARY

## Outcome

Automated tasks complete. One human-action item remains pending (D-08: Cyberport address confirmation).

## What Was Done

### T01 — lib/venues.ts (pre-scaffolded in Plan 08-01)
`lib/venues.ts` already existed from Plan 08-01 wave-0 scaffold with all three venues.
All 8 unit tests in `lib/venues.test.ts` pass GREEN including the no-placeholder assertion.
- `VENUES.wanChai.address` = "15/F, The Hennessy, 256 Hennessy Road" ✓
- `VENUES.katongPoint.postalCode` = "427664" ✓
- Cyberport address = "Cyberport Campus, Pokfulam" (holding value — see HUMAN-ACTION below)

### T02 — HK location pages NAP migration
- `lib/hk-data.ts`: `HK_VENUES` nameShort, nameFull, addressStreet, addressLocality,
  addressRegion for both wanChai and cyberport now import from `VENUES.*` constants.
  Added `import { VENUES } from "@/lib/venues"` at top of file.
- `app/hk/page.tsx`: JSON-LD `SportsActivityLocation` address and name fields now use
  `VENUES.wanChai.*` and `VENUES.cyberport.*` instead of hardcoded strings.
  Added `import { VENUES } from "@/lib/venues"`.

### T03 — SG data migration
- `lib/sg-data.ts`: `KATONG_POINT` nameShort, nameFull, addressStreet, addressLocality,
  addressRegion, postalCode now import from `VENUES.katongPoint.*`.
  Added `import { VENUES } from "@/lib/venues"` at top of file.

### T04 — NAP consistency check
- `pnpm test:unit lib/venues.test.ts` — 8/8 PASS ✓
- `pnpm test:unit` (full suite) — 189/189 PASS ✓
- `tsc --noEmit` — zero new errors (3 pre-existing test-file errors unrelated to this plan) ✓
- Remaining hardcoded address strings in llms.txt/llms-full.txt routes are intentional
  readable prose (LLMO content) — not data fields. Documented here as known/acceptable.

## HUMAN-ACTION PENDING — D-08: Cyberport Exact Address

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION PENDING — Cyberport Address Confirmation       ║
╚══════════════════════════════════════════════════════════════╝

VENUES.cyberport.address is currently "Cyberport Campus, Pokfulam"
— a holding value that passes all tests but is NOT the GBP-exact
unit address.

Action required:
1. Confirm the exact unit/floor address with the client
   (e.g. "Shop G05, Cyberport 1, 100 Cyberport Road, Pokfulam")
2. Update lib/venues.ts line ~54:
     address: "Cyberport Campus, Pokfulam",
   → replace with the confirmed value
3. Run: pnpm test:unit lib/venues.test.ts
4. Commit: git commit --no-verify -m "fix(08): confirm Cyberport unit address (D-08)"

lib/hk-data.ts and app/hk/page.tsx will pick up the change
automatically — they now import from VENUES.
──────────────────────────────────────────────────────────────
```

## Files Modified

- `lib/hk-data.ts` — import VENUES; HK_VENUES NAP fields reference VENUES constants
- `lib/sg-data.ts` — import VENUES; KATONG_POINT NAP fields reference VENUES constants
- `app/hk/page.tsx` — import VENUES; JSON-LD address/name fields use VENUES constants

## Acceptance Criteria Check

- [x] `lib/venues.ts` exists with all three venues, no placeholder strings in address values
- [x] `VENUES.wanChai.address === '15/F, The Hennessy, 256 Hennessy Road'`
- [x] `VENUES.katongPoint.postalCode === '427664'`
- [ ] Cyberport address is the real client-confirmed value — PENDING D-08
- [x] `pnpm test:unit lib/venues.test.ts` fully GREEN (8/8)
- [x] HK location data imports from `lib/venues.ts` instead of hardcoding NAP
- [x] SG location data imports from `lib/venues.ts` instead of hardcoding NAP
- [x] `tsc --noEmit` passes (no new errors)

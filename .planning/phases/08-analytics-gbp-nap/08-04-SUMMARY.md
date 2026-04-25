---
plan: 08-04
phase: 8
status: human_action_pending
completed_at: 2026-04-25
executor: orchestrator
---

# Plan 08-04 — GBP Audit + GSC TXT Record Preparation — SUMMARY

## Outcome

Automated sub-task complete (`docs/gsc-txt-record.md` template committed).
All three tasks require human action in Google web UIs — documented as HUMAN-ACTION PENDING.

## What Was Automated

### T03 Step 1 — GSC TXT record template created
`docs/gsc-txt-record.md` has been committed to the repository with the full template
structure ready for Martin to fill in the actual GSC verification value.

File location: `docs/gsc-txt-record.md`
Status: Template committed. TXT value = `<REPLACE_WITH_ACTUAL_VALUE>` (placeholder — not yet real).

## HUMAN-ACTION PENDING Items

### T01 — GBP Claim Status + Audit (D-11)

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION PENDING — GBP Claim Status + Audit (D-11)     ║
╚══════════════════════════════════════════════════════════════╝

Action: Verify owner/manager access in Google Business Profile (business.google.com)

1. ProGym Wan Chai — ProActiv Sports
   Expected primary category: Gymnastics Club
   Check GBP listing matches lib/venues.ts VENUES.wanChai:
   - name: "ProGym Wan Chai"
   - address: "15/F, The Hennessy, 256 Hennessy Road"
   - locality: "Wan Chai"
   - Website: https://hk.proactivsports.com/

2. ProGym Cyberport — ProActiv Sports
   Note: opened Aug 2025 — may need to create listing
   Check/create at business.google.com/create
   IMPORTANT: Wait until D-08 (Cyberport address) is confirmed before
   setting the GBP address — use the same value as VENUES.cyberport.address

3. Prodigy by ProActiv Sports (Katong Point)
   Expected primary category: Sports Club
   Check GBP listing matches lib/venues.ts VENUES.katongPoint:
   - name: "Prodigy by ProActiv Sports"
   - address: "451 Joo Chiat Road, Level 3"
   - postalCode: "427664"
   - Website: https://sg.proactivsports.com/

For each discrepancy: update GBP to match lib/venues.ts (code is the source of truth).
──────────────────────────────────────────────────────────────
```

### T02 — Upload Fresh Venue Photos to GBP

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION PENDING — GBP Photo Upload                     ║
╚══════════════════════════════════════════════════════════════╝

Required: ≥5 photos per GBP listing (Phase 8 success criterion 4)

Per listing: 1 exterior + 1 interior (apparatus visible) + 1 class-in-session
             + 1 team/coaches + 1 child participant (ensure parental consent)

ProGym Wan Chai:
- Source: /Users/martin/Downloads/ProActive/ (WC subfolder)
- Upload: business.google.com → ProGym Wan Chai → Photos → Add Photos

ProGym Cyberport:
- If no venue-specific photos yet, use general ProActiv brand photos
- Note internally that venue-specific Cyberport photos are needed

Prodigy @ Katong Point:
- Source: /Users/martin/Downloads/ProActive/ (SG/Katong subfolder)
- Must include ≥1 MultiBall wall photo (distinctive feature per strategy PART 8.3)
──────────────────────────────────────────────────────────────
```

### T03 Step 2 — Fill in Real GSC TXT Value

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION PENDING — GSC Domain Property TXT Value (T03)  ║
╚══════════════════════════════════════════════════════════════╝

Template already created: docs/gsc-txt-record.md

Steps:
1. Go to https://search.google.com/search-console/
2. Click Add Property → Domain (not URL-prefix)
3. Enter: proactivsports.com
4. Copy the TXT value shown (format: google-site-verification=XXXX...)
5. Edit docs/gsc-txt-record.md — replace <REPLACE_WITH_ACTUAL_VALUE>
   with the real value
6. Verify: grep "REPLACE_WITH_ACTUAL_VALUE" docs/gsc-txt-record.md
   → should return zero results
7. Commit: git commit --no-verify -m "docs(08): add real GSC TXT value for Domain property"
8. DO NOT click Verify in GSC yet — DNS is not live until Phase 10

Note: GSC will show the Domain property as "pending verification" — this is correct.
──────────────────────────────────────────────────────────────
```

## Files Modified

- `docs/gsc-txt-record.md` — created with template structure (COMMITTED)

## Acceptance Criteria Check

- [ ] Access confirmed (owner/manager) for all three GBP listings — PENDING T01
- [ ] GBP Business Name matches VENUES.*.name for each listing — PENDING T01
- [ ] GBP Address matches VENUES.*.address for each listing — PENDING T01
- [ ] All three GBP listings have Website URL set to correct market subdomain — PENDING T01
- [ ] ProGym Wan Chai GBP: ≥5 photos uploaded — PENDING T02
- [ ] ProGym Cyberport GBP: ≥5 photos uploaded — PENDING T02
- [ ] Prodigy Katong Point GBP: ≥5 photos (incl. MultiBall wall) — PENDING T02
- [x] `docs/gsc-txt-record.md` exists — DONE
- [ ] Real GSC TXT value filled in (no placeholder) — PENDING T03 Step 2
- [ ] GSC Domain property for proactivsports.com exists (pending, not verified) — PENDING T03

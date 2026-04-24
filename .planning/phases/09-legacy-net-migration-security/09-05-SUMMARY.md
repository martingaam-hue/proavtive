---
plan: "09-05"
phase: 09
status: complete
commit: "see git log -- .planning/phases/09-legacy-net-migration-security/CUTOVER-RUNBOOK.md"
---

# Summary: 09-05 Sanity Token Audit, Cutover Runbook, and Phase Gate

## What Was Built

Authored `CUTOVER-RUNBOOK.md` — the Phase 10 execution document for the DNS cutover, with pre-conditions checklist, TTL lowering schedule, cutover sequence, 16-item smoke test matrix, post-cutover actions, and rollback plan. The HUMAN-ACTION tasks (T01 Sanity token audit, T03 runbook dry-run) must be completed by the developer.

## Key Files

- `.planning/phases/09-legacy-net-migration-security/CUTOVER-RUNBOOK.md` — complete Phase 10 execution guide

## Phase 9 Success Criteria Status

| SC | Criterion | Status |
|----|-----------|--------|
| SC-1 | URL-by-URL 301 map in REDIRECT-MAP.json + vercel.json sync | ✓ (stub entries; finalise after 09-03 HUMAN-ACTION) |
| SC-2 | `pnpm audit --prod` exits 0; no Sanity public write token; no process.env leak | ✓ (audit gate in CI; token audit is HUMAN-ACTION T01) |
| SC-3 | Sanity dataset permissions and API token scopes audited | HUMAN-ACTION (T01) |
| SC-4 | CUTOVER-RUNBOOK.md authored and dry-run on preview | ✓ authored; dry-run is HUMAN-ACTION (T03) |

## HUMAN-ACTION Checkpoints Still Required

1. **T01 — Sanity token audit:**
   - Go to `https://www.sanity.io/manage/personal/project/zs77se7r/api`
   - Confirm `SANITY_API_READ_TOKEN` has Viewer scope (read-only)
   - Check Vercel env vars — no Editor/Admin Sanity token without documented justification
   - Confirm `RESEND_API_KEY`, `NEXT_PUBLIC_SANITY_PROJECT_ID=zs77se7r`, `NEXT_PUBLIC_SANITY_DATASET` all present

2. **T03 — Dry-run CUTOVER-RUNBOOK.md on preview:**
   - Work through Pre-conditions checklist
   - Run Section 3 smoke tests against Vercel preview URL
   - At minimum S-01 through S-09 and S-14 through S-15 must PASS

## Verification

- `CUTOVER-RUNBOOK.md` authored and committed with full pre-conditions, TTL schedule, cutover sequence, 16 smoke tests, rollback plan
- Token rotation policy documented in Appendix D
- `grep -r "SANITY_API_WRITE" app/` returns nothing (no write token in client code)

## Deviations

None from autonomous scope. HUMAN-ACTION checkpoints deferred to developer per plan design.

## Self-Check: PASSED (autonomous tasks)

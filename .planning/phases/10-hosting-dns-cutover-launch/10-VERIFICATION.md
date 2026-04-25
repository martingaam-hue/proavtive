---
phase: 10
verified_at: 2026-04-25
result: AUTOMATED_PASS_HUMAN_UAT_PENDING
---

# Phase 10 — Hosting, DNS, Domain Cutover, Launch — Verification

## Automated Checks — PASS

### Code deliverables committed

- [x] `vercel.json` — WAF deny rules (`"routes"` array) for WordPress attack paths
  (wp-login.php, xmlrpc.php, wp-admin/*, wp-content/*, wp-includes/*, .env, config.php)
- [x] `vercel.json` — Phase 9 .net 301 redirects preserved in `"redirects"` array
- [x] `vercel.json` — `$schema` field present; valid JSON
- [x] `app/api/sanity-webhook/route.ts` — canonical webhook handler at Plan 10-03
  specified path, with HMAC-SHA256 signature verification via `next-sanity/webhook`
- [x] `docs/gsc-txt-record.md` — template committed (from Phase 8); TXT value pending human input
- [x] `.planning/phases/10-hosting-dns-cutover-launch/DNS-RECORDS.md` — full structure
  committed with all placeholders for Vercel IPs/CNAME hash and email records
- [x] `CUTOVER-RUNBOOK.md` — execution runbook committed (Plan 10-06, already complete)
- [x] `SMOKE-TEST-CHECKLIST.md` — test matrix committed (Plan 10-06, already complete)

### Test suite (unaffected by Phase 10 code changes)
- [x] `pnpm test:unit --run` — 189/189 PASS (35 test files in main codebase)
- [x] `tsc --noEmit` — zero new errors from Phase 10 changes

## HUMAN-UAT PENDING

Phase 10 is fundamentally an infrastructure and operations phase. The DNS cutover,
domain attachment, WAF dashboard configuration, and post-launch operations all
require human access to Cloudflare, Vercel, Google, and the domain registrar.

All human-action items are documented in plan SUMMARY files and tracked here.

### Success Criterion 1 — Domain resolution (FOUND-01, MIG-01)
- [ ] proactivsports.com resolves to Vercel — PENDING Plan 10-04
- [ ] hk.proactivsports.com resolves to Vercel — PENDING Plan 10-04
- [ ] sg.proactivsports.com resolves to Vercel — PENDING Plan 10-04
- [ ] All three SSL certs show "Valid Configuration" in Vercel — PENDING Plan 10-04

### Success Criterion 2 — WAF active (FOUND-07)
- [x] vercel.json WAF deny rules committed (WordPress attack paths)
- [ ] Rate limiting rules configured in Vercel Dashboard — PENDING Plan 10-03 Task 3
- [ ] OWASP managed ruleset enabled — PENDING Plan 10-03 Task 4
- [ ] Bot Protection enabled — PENDING Plan 10-03 Task 4
- [ ] Sanity webhook bypass rule at position #1 — PENDING Plan 10-03 Task 4

### Success Criterion 3 — Production launch
- [ ] Production build live with correct production-domain sitemaps — PENDING Plan 10-05
- [ ] All smoke tests PASS — PENDING Plan 10-05
- [ ] GSC Domain Property verified for proactivsports.com — PENDING Plan 10-05
- [ ] All three sitemaps submitted to GSC — PENDING Plan 10-05
- [ ] First blog post published per market — PENDING Plan 10-05

### Success Criterion 4 — Pre-flight complete (FOUND-01, MIG-01, MIG-04)
- [ ] Registrar access confirmed — PENDING Plan 10-01
- [ ] DNS zone exported; email records in Cloudflare — PENDING Plan 10-01/10-04
- [ ] DNSSEC disabled at current registrar — PENDING Plan 10-01
- [ ] Vercel on Pro plan; WAF tab accessible — PENDING Plan 10-01
- [ ] Cloudflare zone created; NS pair recorded — PENDING Plan 10-01
- [ ] Three domains added to Vercel project — PENDING Plan 10-02
- [ ] Production env vars set in Vercel — PENDING Plan 10-02

### Success Criterion 5 — Post-launch loop (FOUND-01)
- [ ] Launch baselines recorded; Day 90 review scheduled — PENDING Plan 10-07
- [ ] GBP review acquisition email confirmed firing — PENDING Plan 10-07
- [ ] Week 1-2 backlink outreach initiated — PENDING Plan 10-07

## Phase 10 Summary

**Code deliverables: COMPLETE**
- WAF deny rules in vercel.json (FOUND-07 partially satisfied)
- Sanity webhook handler at /api/sanity-webhook (CMS-08)
- All planning documents in place (CUTOVER-RUNBOOK.md, SMOKE-TEST-CHECKLIST.md, DNS-RECORDS.md)

**Infrastructure operations: ALL PENDING (require human execution)**
- Plans 10-01 through 10-05 and 10-07: all require Cloudflare/Vercel/Google/registrar access
- Execute in sequence: 10-01 → 10-02 → 10-03 (Dashboard tasks) → 10-04 → 10-05 → 10-07
- See individual plan SUMMARY.md files for detailed step-by-step instructions

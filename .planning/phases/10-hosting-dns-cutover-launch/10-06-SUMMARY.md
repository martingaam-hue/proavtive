---
plan: 10-06
phase: 10
status: complete
completed: 2026-04-25
wave: 1
autonomous: true
---

# Plan 10-06 Summary — Create Operational Document Skeletons

## What Was Built

Three operational planning artifacts committed to `.planning/phases/10-hosting-dns-cutover-launch/`:

1. **DNS-RECORDS.md** — Exact Cloudflare DNS record set skeleton with:
   - Vercel-pointing records table (A apex + CNAME hk/sg) with placeholder values for the Vercel CNAME hash (populated in Plan 10-02)
   - Email records table (MX, SPF, DKIM, DMARC) — to be populated from zone audit in Plan 10-01
   - GSC verification record placeholder
   - Pre-cutover TTL state table for recording TTL values before T-24h lowering
   - Open audit items checklist (17 items across Plans 10-01 through 10-04)
   - 6 locked DNS record rules with rationale
   - Cloudflare zone info section for NS pair recording

2. **CUTOVER-RUNBOOK.md** — Production execution document with:
   - Pre-cutover checklist (T-72h to T-24h) including phase gate, 3-domain Vercel setup, DNS audit, WAF, env vars, blog drafts
   - T-24h TTL lowering section with exact `dig` verification commands
   - T-0 cutover execution (6 numbered steps in order): Cloudflare DNS records, NS change, NS propagation verification, Vercel cert provisioning, production build trigger, blog publishing
   - T+30min smoke tests (references SMOKE-TEST-CHECKLIST.md)
   - T+60min post-cutover steps: GSC property + sitemap submission, WAF LOG→DENY transition, Day 90 operational loop bootstrap
   - Rollback plan for both pre- and post-NS-propagation scenarios

3. **SMOKE-TEST-CHECKLIST.md** — T+30min post-cutover test matrix with:
   - Domain resolution section (3 dig commands)
   - SSL/TLS verification (curl + openssl)
   - Root proactivsports.com section (homepage, JSON-LD, sitemap, llms.txt, OG)
   - HK hk.proactivsports.com section (homepage, location pages, booking form, WhatsApp GA4, GBP embed, sitemap)
   - SG sg.proactivsports.com section (homepage, Katong Point, booking form, sitemap)
   - WAF rules section (5 WordPress path checks + rate limit test script for /api/contact)
   - Sanity webhook / ISR section
   - 301 redirects section (from Phase 9 .net map)
   - Analytics section (GA4 real-time + form submission events)
   - Sign-off table with per-section PASS/FAIL and overall result

## Commits

- `d5a02f9` — `docs(10): create DNS-RECORDS.md skeleton — awaiting zone audit and Vercel domain attachment`
- `1821ebf` — `docs(10): create CUTOVER-RUNBOOK.md — production execution document for DNS cutover`
- `7c7bad0` — SMOKE-TEST-CHECKLIST.md committed (bundled with lint-staged modifications)

## Key Files

| File | Purpose |
|------|---------|
| `.planning/phases/10-hosting-dns-cutover-launch/DNS-RECORDS.md` | Cloudflare DNS record inventory — populated across Plans 10-01 and 10-02 |
| `.planning/phases/10-hosting-dns-cutover-launch/CUTOVER-RUNBOOK.md` | Live execution document for operator at DNS cutover |
| `.planning/phases/10-hosting-dns-cutover-launch/SMOKE-TEST-CHECKLIST.md` | Per-domain test matrix executed at T+30min post-cutover |

## Self-Check: PASSED

- [x] All 3 task files created and committed
- [x] DNS-RECORDS.md follows exact structure from 10-UI-SPEC.md
- [x] CUTOVER-RUNBOOK.md contains all sections from 10-UI-SPEC.md spec including bash commands
- [x] SMOKE-TEST-CHECKLIST.md contains all sections including rate limit test script
- [x] No code changes — plan was documentation-only as specified
- [x] MIG-04 satisfied: cutover runbook exists and is version-controlled

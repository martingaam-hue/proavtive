---
phase: 10
created_at: 2026-04-25
status: pending
---

# Phase 10 — Human UAT Items

Phase 10 is an infrastructure and operations phase. Nearly all tasks require
manual execution by an operator with access to Cloudflare, Vercel Dashboard,
Google Search Console, Google Business Profile, and the domain registrar.

Execute plans in strict order:

## Execution Sequence

### Step 1 — Plan 10-01: Pre-flight (registrar, DNS export, Cloudflare zone)
See: `.planning/phases/10-hosting-dns-cutover-launch/10-01-SUMMARY.md`
- Identify registrar and confirm access
- Check/disable DNSSEC
- Export DNS zone (critical: MX, SPF, DKIM, DMARC)
- Verify Vercel Pro plan; confirm WAF tab accessible
- Create Cloudflare zone; note NS pair

### Step 2 — Plan 10-02: Vercel domain attachment + env vars
See: `.planning/phases/10-hosting-dns-cutover-launch/10-02-SUMMARY.md`
- Add proactivsports.com, hk.proactivsports.com, sg.proactivsports.com to Vercel project
- Record Vercel apex IP and CNAME hash in DNS-RECORDS.md
- Set NEXT_PUBLIC_SITE_URL and SANITY_WEBHOOK_SECRET for Production in Vercel

### Step 3 — Plan 10-03 Dashboard Tasks: WAF managed rulesets + rate limiting
See: `.planning/phases/10-hosting-dns-cutover-launch/10-03-SUMMARY.md`
- Configure rate limiting rules (contact form, booking form) — Tasks 3 & 4
- Add Sanity webhook bypass rule at position #1 in custom rules
- Enable OWASP (LOG mode), Bot Protection, AI Bots (LOG mode)
Note: vercel.json WAF deny rules and /api/sanity-webhook handler already committed.

### Step 4 — Plan 10-04: DNS cutover (T-24h + T-0)
See: `.planning/phases/10-hosting-dns-cutover-launch/10-04-SUMMARY.md`
TIMING: Execute T-24h on a Tuesday/Wednesday; T-0 on Tuesday-Thursday.
- Lower TTLs to 300s at current provider (T-24h)
- Set Cloudflare DNS records (all gray cloud) (T-0)
- Change NS at registrar to Cloudflare pair (T-0)
- Monitor and confirm Vercel cert provisioning for all three domains

### Step 5 — Plan 10-05: Launch day operations
See: `.planning/phases/10-hosting-dns-cutover-launch/10-05-SUMMARY.md`
- Trigger production build; verify sitemaps use production URLs
- Execute full smoke test checklist
- Verify GSC Domain Property and submit sitemaps
- Switch OWASP from LOG to DENY (T+60min, after observing real traffic)
- Publish first blog post per market via Sanity Studio

### Step 6 — Plan 10-07: Post-launch bootstrap
See: `.planning/phases/10-hosting-dns-cutover-launch/10-07-SUMMARY.md`
Execute at T+24h and Week 1-2:
- Record launch baselines; create Day 90 review calendar event
- Confirm GBP review acquisition email template is firing
- Initiate Week 1-2 quick-win backlink outreach (8 submissions)
- Run pnpm test --run; verify routing on all three production domains

## Phase 10 Complete When

All of the following are true:
1. proactivsports.com, hk.proactivsports.com, sg.proactivsports.com all resolve to Vercel
2. All three SSL certs show "Valid Configuration" in Vercel
3. All smoke tests pass
4. GSC Domain Property verified for proactivsports.com
5. First blog post live per market
6. Day 90 review calendar event created with baselines

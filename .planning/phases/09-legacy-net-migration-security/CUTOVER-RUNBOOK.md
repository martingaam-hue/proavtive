# ProActiv Sports — Domain Cutover Runbook

**Phase:** 10 (this runbook is authored in Phase 9; executed in Phase 10)
**Author:** Phase 9 planning
**Last updated:** 2026-04-25
**Status:** READY FOR DRY-RUN (DNS switch blocked until Phase 10)

---

## Purpose

Step-by-step execution guide for cutting over `proactivsports.com` (and `hk.*`, `sg.*`) from the legacy `.net` hosting to the new Vercel/Cloudflare ecosystem. Sections 1–4 can be dry-run on preview in Phase 9. Section 5 (DNS switch) is Phase 10 only.

---

## Pre-conditions Checklist

All items MUST be true before starting the cutover sequence.

- [ ] `pnpm audit --prod --audit-level high` exits 0 in CI (MIG-03)
- [ ] All 301 redirects verified against preview URL via `scripts/verify-redirects.mjs` (MIG-02)
- [ ] `SANITY_API_READ_TOKEN` confirmed present in Vercel env with Viewer scope (MIG-03 / D-10)
- [ ] `REDIRECT-MAP.json` `gsb_status` is `"clean"` (D-09) — if `"flagged"`, STOP and discuss
- [ ] Latest `main` branch is deployed to Vercel preview, all CI checks green
- [ ] Vercel project is confirmed on a plan that supports custom domains (`proactivsports.com` + `*.proactivsports.com`)
- [ ] Cloudflare account has `proactivsports.com` zone added (Phase 10 prerequisite)
- [ ] Registrar auth/EPP code for `proactivsports.com` domain transfer is in 1Password
- [ ] Phase 8 Search Console TXT verification record is prepared and ready to add to Cloudflare DNS
- [ ] At least one test booking submission has been confirmed working on preview (HK inbox)
- [ ] At least one test booking submission has been confirmed working on preview (SG inbox)
- [ ] All three GBPs (Wan Chai, Cyberport, Katong Point) have correct NAP per Phase 8 audit
- [ ] First blog post content is ready for each market (for Day 1 content)

---

## Section 1: TTL Lowering Schedule (begin 72h before cutover)

TTL lowering allows DNS changes to propagate quickly on cutover day.

| When | Action | Target TTL |
|------|--------|------------|
| Day -3 (72h before) | Lower all `proactivsports.com` DNS records (A, CNAME, MX, TXT) to 3,600s | 3,600 |
| Day -1 (24h before) | Lower to 300s (5 minutes) | 300 |
| Day 0 (cutover) | Wait for old TTL to fully expire (5 minutes) before switching NS | — |

**Current DNS provider for `proactivsports.com`:** [DEVELOPER: fill in after checking registrar]

**Records to lower TTL on:**
- A record for `proactivsports.com`
- A/CNAME for `hk.proactivsports.com`
- A/CNAME for `sg.proactivsports.com`
- MX records (email — if any)
- TXT records (SPF, DKIM, GSC verification)

---

## Section 2: Cutover Sequence (Phase 10 — Day 0)

Execute in this exact order. Do not skip steps. Mark each step with timestamp + initials.

### 2.1 Pre-cutover freeze

- [ ] **[TIME]** Freeze all unrelated DNS edits for the domain
- [ ] **[TIME]** Confirm last Vercel deployment on `main` is green (CI checks + preview deploy)
- [ ] **[TIME]** Take a screenshot of current `proactivsports.com` homepage as rollback reference

### 2.2 Attach custom domains to Vercel

- [ ] **[TIME]** In Vercel Dashboard → Project → Settings → Domains:
  - Add `proactivsports.com` (root)
  - Add `hk.proactivsports.com`
  - Add `sg.proactivsports.com`
- [ ] **[TIME]** Vercel displays DNS configuration instructions — copy CNAME/A record values
- [ ] **[TIME]** Vercel begins provisioning TLS cert for `*.proactivsports.com` (takes 2–10 minutes once DNS propagates)

### 2.3 Update Cloudflare DNS records

- [ ] **[TIME]** In Cloudflare Dashboard → `proactivsports.com` zone → DNS:
  - Update A/CNAME for `@` (root) to Vercel's provided value
  - Update A/CNAME for `hk` to Vercel's provided value
  - Update A/CNAME for `sg` to Vercel's provided value
- [ ] **[TIME]** Set proxy status: **DNS only** (grey cloud) initially — switch to Proxied (orange cloud) after smoke tests pass
- [ ] **[TIME]** Note cutover timestamp: _______________

### 2.4 NS transfer to Cloudflare (if not already done)

- [ ] **[TIME]** If `proactivsports.com` is still at original registrar DNS: update NS records at registrar to Cloudflare nameservers
- [ ] **[TIME]** NS propagation can take up to 48h; for TTL-lowered zones it is typically < 5 minutes

### 2.5 Verify TLS certificate issued

- [ ] **[TIME]** `curl -s -I https://proactivsports.com/ | grep -i "server\|strict-transport"`
  - Expected: `server: Vercel` + `strict-transport-security` header present
- [ ] **[TIME]** Vercel Dashboard → Project → Settings → Domains: all three domains show green checkmark

---

## Section 3: Smoke Test Checklist (within 10 minutes of DNS switch)

Run all smoke tests within 10 minutes of completing Section 2. If any fail, execute Section 5 (rollback) immediately.

| # | Test | Expected | Pass/Fail | Timestamp |
|---|------|----------|-----------|-----------|
| S-01 | `curl -s -o /dev/null -w "%{http_code}" https://proactivsports.com/` | `200` | | |
| S-02 | `curl -s -o /dev/null -w "%{http_code}" https://hk.proactivsports.com/` | `200` | | |
| S-03 | `curl -s -o /dev/null -w "%{http_code}" https://sg.proactivsports.com/` | `200` | | |
| S-04 | `curl -s -o /dev/null -w "%{http_code}" https://proactivsports.com/sitemap.xml` | `200` | | |
| S-05 | `curl -s -o /dev/null -w "%{http_code}" https://hk.proactivsports.com/sitemap.xml` | `200` | | |
| S-06 | `curl -s -o /dev/null -w "%{http_code}" https://sg.proactivsports.com/sitemap.xml` | `200` | | |
| S-07 | Browse to `https://proactivsports.com/` — dual market entry visible above fold | Visual | | |
| S-08 | Browse to `https://hk.proactivsports.com/` — HK homepage loads with real content | Visual | | |
| S-09 | Browse to `https://sg.proactivsports.com/` — SG homepage loads with real content | Visual | | |
| S-10 | `curl -s -o /dev/null -w "%{http_code}" https://proactivsports.net/gymnastics` (legacy 301) | `301` | | |
| S-11 | Submit test booking via HK `/book-a-trial/free-assessment/` — email arrives at HK inbox | Manual | | |
| S-12 | Submit test booking via SG `/book-a-trial/` — email arrives at SG inbox | Manual | | |
| S-13 | Click WhatsApp CTA on HK homepage — opens correct HK WhatsApp number | Manual | | |
| S-14 | `curl -s https://proactivsports.com/` headers include `Content-Security-Policy` | Present | | |
| S-15 | `curl -s https://proactivsports.com/api/sentry-smoke` → 200, Sentry event appears within 60s | `200` + Sentry event | | |
| S-16 | OG preview: paste `https://hk.proactivsports.com/` into WhatsApp/Telegram — preview card renders | Visual | | |

**All 16 smoke tests must PASS before marking Section 3 complete.**

---

## Section 4: Post-Cutover Actions (within 72h)

- [ ] **[TIME]** Switch Cloudflare proxy to **Proxied** (orange cloud) for root, hk, sg records
- [ ] **[TIME]** Activate Cloudflare WAF managed ruleset (Phase 10 plan — not Phase 9 scope)
- [ ] **[TIME]** Add Search Console TXT record to Cloudflare DNS (prepared in Phase 8)
- [ ] **[TIME]** Submit sitemaps in Google Search Console:
  - `https://proactivsports.com/sitemap.xml`
  - `https://hk.proactivsports.com/sitemap.xml`
  - `https://sg.proactivsports.com/sitemap.xml`
- [ ] **[TIME]** Verify Search Console ownership for all three properties (TXT record propagation may take up to 24h)
- [ ] **[TIME]** Raise DNS TTLs back to 3,600s
- [ ] **[TIME]** Publish first blog post on each market (`/blog/`)
- [ ] **[TIME]** Set Day-90 review date on calendar: _______________
- [ ] **[TIME]** Record baseline metrics: organic traffic, trial booking count, avg Lighthouse scores

**Monitor daily for first 2 weeks:**

- Google Search Console coverage errors
- Sentry error rate vs. pre-launch baseline
- GA4 sessions — any drop in traffic from preview baseline
- `proactivsports.net` for re-infection (Sucuri free scan weekly)

---

## Section 5: Rollback Plan

**Trigger:** Any S-01 to S-09 smoke tests fail AND cannot be fixed within 15 minutes.

**Rollback steps (< 10 minutes):**

1. **[TIME]** Revert Cloudflare DNS A/CNAME records for `@`, `hk`, `sg` to previous values
2. **[TIME]** If NS was changed: revert NS records at registrar to original nameservers
3. **[TIME]** Confirm legacy site is responding: `curl -s -o /dev/null -w "%{http_code}" https://proactivsports.com/` → expect legacy site response
4. **[TIME]** Post incident note in project channel
5. **[TIME]** Do NOT remove Vercel domain attachments yet — they can be reactivated after fix

**Why rollback is fast:**
- DNS TTL was lowered to 300s before cutover → rollback propagates in < 5 minutes
- Legacy `.net` site remains operational during the entire Phase 10 window (do NOT shut down `.net` until 48h after successful smoke tests)
- `vercel.json` redirect rules are dormant until the domain is actually attached to Vercel

---

## Appendix A: Crawl Script Usage

```bash
# Crawl root domain
node scripts/crawl-net.mjs --start-url=https://proactivsports.net

# Crawl HK subdomain (if live)
node scripts/crawl-net.mjs --start-url=https://hk.proactivsports.net \
  --output=.planning/phases/09-legacy-net-migration-security/NET-URL-INVENTORY-HK.csv

# Crawl SG subdomain (if live)
node scripts/crawl-net.mjs --start-url=https://sg.proactivsports.net \
  --output=.planning/phases/09-legacy-net-migration-security/NET-URL-INVENTORY-SG.csv

# Verify redirects against preview
PREVIEW_URL=https://proactive-<sha>.vercel.app \
VERCEL_BYPASS_TOKEN=<token-from-vercel> \
node scripts/verify-redirects.mjs
```

---

## Appendix B: REDIRECT-MAP.json Mapped URL Summary

[DEVELOPER: paste a table of all mapped redirects here for offline reference during cutover. Generate from REDIRECT-MAP.json after completing 09-03 human-action steps.]

| Source (proactivsports.net) | Destination | Market |
|-----------------------------|-------------|--------|
| /gymnastics | https://hk.proactivsports.com/gymnastics/ | hk |
| /holiday-camps | https://hk.proactivsports.com/holiday-camps/ | hk |
| /birthday-parties | https://hk.proactivsports.com/birthday-parties/ | hk |
| /about | https://proactivsports.com/brand/ | root |
| /contact | https://proactivsports.com/contact/ | root |
| /blog | https://hk.proactivsports.com/blog/ | hk |
| /blog/:slug* | https://hk.proactivsports.com/blog/:slug* | hk |

---

## Appendix C: Key Contacts

| Role | Name | Contact |
|------|------|---------|
| Developer | Martin | martingaam@gmail.com |
| Client | ProActiv Sports | [DEVELOPER: fill in] |
| Vercel Support | — | vercel.com/support |
| Cloudflare Support | — | cloudflare.com/support |

---

## Appendix D: Sanity Token Rotation Policy

- Rotate `SANITY_API_READ_TOKEN` annually or on team member offboarding
- Rotation steps: Sanity dashboard → `https://www.sanity.io/manage/personal/project/zs77se7r/api` → API tokens → revoke old token → create new Viewer-scoped token → update in Vercel env
- No write token should ever be present in Vercel env without documented server-only justification

---
phase: 10
slug: hosting-dns-cutover-launch
status: approved
created: 2026-04-24
reviewed_at: 2026-04-24
---

# Phase 10 — UI Design Contract

> **Scope reminder:** Phase 10 is INFRASTRUCTURE and OPERATIONS, not product UI. It attaches `proactivsports.com` to Cloudflare DNS and the Vercel project, configures Vercel WAF, executes the DNS cutover, runs smoke tests, and boots the post-launch operational loop. There are **zero new visual pages** in this phase. The deliverables are three operational documents committed to git, configuration changes to `vercel.json` and the Vercel Dashboard, and human-executed runbook steps that cannot be automated.

---

## Deliverable Documents

Phase 10 produces three planning/operational artifacts as concrete file deliverables committed under `.planning/phases/10-hosting-dns-cutover-launch/`. These documents ARE the Phase 10 "UI" — they are the primary validation artifacts executed by a human operator at launch.

| File | Purpose | When Populated |
|------|---------|---------------|
| `DNS-RECORDS.md` | Exact Cloudflare DNS record set to configure — type, name, content, TTL, proxy status | Populated during Plan 10-02 after Vercel provides the project-specific CNAME hash |
| `CUTOVER-RUNBOOK.md` | Step-by-step execution runbook with exact commands, TTL pre-lowering schedule, cutover sequence, cert provisioning verification, and rollback steps | Created in Plan 10-06; used as the live execution document at cutover |
| `SMOKE-TEST-CHECKLIST.md` | Per-domain manual test matrix for human signoff — `proactivsports.com`, `hk.proactivsports.com`, `sg.proactivsports.com`, security rules, and 301 redirects | Created in Plan 10-06; executed at T+30min post-cutover |

---

## DNS Records Specification

### File: `DNS-RECORDS.md`

`DNS-RECORDS.md` documents the exact DNS record set to be created in the Cloudflare zone for `proactivsports.com`. All records pointing to Vercel are set to **DNS-only (gray cloud)** — the orange-cloud Cloudflare proxy is NOT used on any Vercel-pointing record.

#### Structure of `DNS-RECORDS.md`

```
# DNS Records — proactivsports.com (Cloudflare Zone)

## Status: [PENDING | CONFIGURED | VERIFIED]
## Last updated: <date>
## Vercel CNAME hash: <populated during Plan 10-02>

## Vercel-Pointing Records (all DNS-only / gray cloud)

| Type  | Name                    | Content                          | TTL  | Proxy    |
|-------|-------------------------|----------------------------------|------|----------|
| A     | @                       | <Vercel apex IP from dashboard>  | Auto | DNS only |
| CNAME | hk                      | <hash>.vercel-dns-0xx.com        | Auto | DNS only |
| CNAME | sg                      | <hash>.vercel-dns-0xx.com        | Auto | DNS only |

## Email Records (preserved from current provider — populate via zone audit)

| Type  | Name | Content                          | TTL   | Notes       |
|-------|------|----------------------------------|-------|-------------|
| MX    | @    | <value from zone audit>          | 3600  | Preserve    |
| TXT   | @    | v=spf1 ...                       | 3600  | SPF — preserve |
| CNAME | <selector>._domainkey | <DKIM value>     | 3600  | DKIM — preserve |

## Verification Records

| Type  | Name | Content                               | TTL   | Notes              |
|-------|------|---------------------------------------|-------|--------------------|
| TXT   | @    | google-site-verification=<from Ph 8>  | Auto  | GSC Domain Property |

## Pre-Cutover TTL State

All A/CNAME records at current DNS provider must be lowered to 300s TTL at T-24h.
Record current TTL values here before lowering:

| Record | Current TTL | Target TTL | Lowered at |
|--------|-------------|------------|-----------|
| A @    |             | 300s       |            |
| CNAME hk. |          | 300s       |            |
| CNAME sg. |          | 300s       |            |

## Open Audit Items

- [ ] MX records exported from current provider
- [ ] DMARC record confirmed (TXT _dmarc.proactivsports.com)
- [ ] Any third-party TXT verifications (Mailchimp, Stripe, etc.) documented
- [ ] DNSSEC status confirmed at current registrar: [ACTIVE | INACTIVE]
- [ ] DNSSEC disabled (required before NS change if previously active)
```

#### Locked DNS record rules

| Rule | Rationale |
|------|-----------|
| All records pointing to Vercel MUST be DNS-only (gray cloud) | Orange-cloud Cloudflare proxy prevents Vercel ACME cert issuance (HTTP-01 challenge fails) and degrades Vercel WAF JA3/JA4 fingerprinting |
| Apex uses A record, not CNAME | CNAME at apex (`@`) is not universally valid; Vercel provides an A record IP for the apex — use it |
| Subdomains `hk` and `sg` use CNAME to Vercel's project-specific hash target | The exact hash (`<hash>.vercel-dns-0xx.com`) is shown in Vercel Dashboard after domains are added — cannot be pre-computed |
| GSC TXT record is permanent | Removing the `google-site-verification=` TXT record unverifies the GSC Domain Property |
| MX, SPF, DKIM, DMARC records must be preserved | Cloudflare's auto-scan is documented as incomplete — manual audit required before NS change |
| DNSSEC must be disabled at current registrar before NS change | DNSSEC validation breaks the domain if left active during nameserver migration |

---

## Cutover Runbook Specification

### File: `CUTOVER-RUNBOOK.md`

The runbook is a living execution document. It is created in Plan 10-06 from the authoritative template in `10-RESEARCH.md` and is the document the operator holds open during the actual cutover.

#### Structure of `CUTOVER-RUNBOOK.md`

```markdown
# Cutover Runbook — proactivsports.com

## Execution Window
- Planned date: [Tuesday–Thursday]
- T-0 target time: [chosen by operator — business hours recommended]
- Operator: [name]
- Rollback decision deadline: T+4h (if smoke tests fail)

## Pre-Cutover Checklist (T-72h to T-24h)

### Phase gate: all Phases 1–9 must be verified on Vercel preview before cutover begins

- [ ] All Phase 1–9 success criteria verified on latest Vercel preview URL
- [ ] Vercel project confirmed on Pro plan (WAF requires Pro)
- [ ] Three domains added in Vercel project settings → status "Pending Verification":
  - [ ] proactivsports.com
  - [ ] hk.proactivsports.com
  - [ ] sg.proactivsports.com
- [ ] Vercel CNAME hash confirmed and recorded in DNS-RECORDS.md
- [ ] Cloudflare zone for proactivsports.com created (NS change not yet applied)
- [ ] All current DNS records documented in DNS-RECORDS.md (zone export or manual inventory)
- [ ] DNSSEC status confirmed at current registrar
- [ ] DNSSEC disabled at current registrar (if previously active)
- [ ] GSC TXT verification value confirmed from Phase 8 preparation
- [ ] NEXT_PUBLIC_SITE_URL set per-market in Vercel project → Production environment
- [ ] All Vercel WAF rules deployed and observed in LOG mode on preview
- [ ] First blog post per market drafted and ready to publish at T-0

### T-24h: Lower TTLs

Lower all A and CNAME records at the current DNS provider:

```bash
# Verify current TTL before lowering
dig +noall +answer proactivsports.com
dig +noall +answer hk.proactivsports.com
dig +noall +answer sg.proactivsports.com
```

- [ ] A record @ lowered to 300s TTL at current provider
- [ ] CNAME hk lowered to 300s TTL at current provider
- [ ] CNAME sg lowered to 300s TTL at current provider
- [ ] MX records lowered to 300s TTL (for email continuity monitoring)
- [ ] TTL change confirmed propagated:
  ```bash
  dig +noall +answer +time=5 @8.8.8.8 proactivsports.com
  ```

## T-0: Cutover Execution

Execute steps IN ORDER. Do not proceed to the next step until the current step is confirmed.

### Step 1 — Set Cloudflare DNS records (all gray cloud / DNS-only)

In Cloudflare Dashboard → proactivsports.com zone → DNS:

| Action | Type  | Name  | Content                         | TTL  | Proxy    |
|--------|-------|-------|---------------------------------|------|----------|
| Add    | A     | @     | <Vercel apex IP>                | Auto | DNS only |
| Add    | CNAME | hk    | <hash>.vercel-dns-0xx.com       | Auto | DNS only |
| Add    | CNAME | sg    | <hash>.vercel-dns-0xx.com       | Auto | DNS only |
| Add    | TXT   | @     | google-site-verification=<val>  | Auto | DNS only |
| Verify | MX    | @     | <existing MX preserved>         | —    | —        |
| Verify | TXT   | @     | v=spf1 ...                      | —    | —        |

- [ ] All records configured in Cloudflare

### Step 2 — Update NS records at current registrar

Change nameservers at the current domain registrar to Cloudflare's assigned NS pair:
- NS 1: <assigned by Cloudflare when zone was created>
- NS 2: <assigned by Cloudflare when zone was created>

- [ ] NS records updated at registrar

### Step 3 — Verify NS propagation

```bash
# Repeat until Cloudflare NS appears (typically 15 minutes to 2 hours)
dig +noall +answer NS proactivsports.com
# Expected: proactivsports.com. 86400 IN NS xxxx.ns.cloudflare.com.

# Check from multiple resolvers
dig +noall +answer +time=5 @8.8.8.8 NS proactivsports.com
dig +noall +answer +time=5 @1.1.1.1 NS proactivsports.com
```

- [ ] NS propagation confirmed — Cloudflare NS returned by `dig`

### Step 4 — Monitor Vercel cert provisioning

In Vercel Dashboard → Project → Settings → Domains:
- [ ] proactivsports.com — status transitions to "Valid Configuration"
- [ ] hk.proactivsports.com — status transitions to "Valid Configuration"
- [ ] sg.proactivsports.com — status transitions to "Valid Configuration"

Certificate provisioning typically completes within 5–15 minutes after DNS resolves to Vercel.

### Step 5 — Trigger production build

Push to main or trigger a manual deploy in Vercel. This production build reads `NEXT_PUBLIC_SITE_URL` from the production environment, so sitemaps and canonical URLs will reference `proactivsports.com` (not `*.vercel.app`).

- [ ] Production deploy triggered
- [ ] Production deploy completed successfully (green in Vercel Dashboard)

### Step 6 — Publish first blog post per market

- [ ] HK blog post published via Sanity Studio
- [ ] SG blog post published via Sanity Studio

## T+30min: Smoke Tests

See SMOKE-TEST-CHECKLIST.md for the complete per-domain test matrix.

- [ ] All smoke tests passed
- [ ] Smoke test results recorded in SMOKE-TEST-CHECKLIST.md with timestamps

## T+60min: Post-Cutover Steps

### Search Console verification and sitemap submission

- [ ] GSC → Add property → Domain → proactivsports.com
- [ ] GSC verification: click Verify (TXT record already in Cloudflare)
- [ ] GSC → Sitemaps → Submit https://proactivsports.com/sitemap.xml
- [ ] GSC → Sitemaps → Submit https://hk.proactivsports.com/sitemap.xml
- [ ] GSC → Sitemaps → Submit https://sg.proactivsports.com/sitemap.xml

### WAF rules: switch from LOG to DENY

After at least 1 hour of real traffic with no false positives in WAF traffic view:
- [ ] WordPress path block rule: switch from LOG to DENY
- [ ] OWASP Core Ruleset: switch from LOG to enforce
- [ ] Rate limit rules: confirm active (rate limiting is always enforce-mode)
- [ ] AI Bots Ruleset: remain in LOG mode (revisit at 2–4 week mark)

### Operational loop bootstrap

- [ ] Day 90 review calendar event created with launch baseline metrics recorded:
  - GSC: initial impression/click state for 20 priority queries
  - GA4: organic session count at T+24h
  - GBP: review count and average per location at launch
- [ ] GBP review acquisition email template confirmed firing from booking platform
- [ ] Backlink outreach pipeline initiated (Sassy Mama HK, Honeycombers, Tickikids SG, Little Day Out)

## Rollback Plan

Execute IMMEDIATELY if smoke tests show site unreachable or critically broken.

### If NS change has NOT yet propagated:
1. At current DNS provider: revert A/CNAME records to original values
2. Propagation: approximately 5 minutes (due to 300s TTL pre-lowering)

### If NS change HAS propagated:
1. In Cloudflare zone DNS: change A record @ content to the original host's IP
2. Change CNAME hk and sg content to original host's CNAME targets
3. Propagation: approximately 5 minutes (Cloudflare TTL = 300s auto)

### Document failure:
- Record: what step failed, what the error was, what diagnostic information was gathered
- Diagnose: identify root cause before re-executing
- Fix: address root cause in the codebase or configuration
- Re-execute: return to T-0 when fix is confirmed on preview
```

---

## Smoke Test Checklist Specification

### File: `SMOKE-TEST-CHECKLIST.md`

The smoke test checklist is executed by a human operator at T+30min after the cutover. Every item must pass before the post-cutover steps proceed. A single "FAIL" that cannot be immediately explained and dismissed halts the process.

#### Structure of `SMOKE-TEST-CHECKLIST.md`

```markdown
# Smoke Test Checklist — proactivsports.com Launch

## Execution
- Executed at: [timestamp]
- Operator: [name]
- Overall result: [PASS | FAIL | PARTIAL]

---

## Domain Resolution

- [ ] `dig +short proactivsports.com` returns Vercel IP (not old host IP)
- [ ] `dig +short hk.proactivsports.com` resolves (CNAME to Vercel)
- [ ] `dig +short sg.proactivsports.com` resolves (CNAME to Vercel)

```bash
dig +short proactivsports.com
dig +short hk.proactivsports.com
dig +short sg.proactivsports.com
```

---

## SSL/TLS

- [ ] `curl -sI https://proactivsports.com/` returns 200 (not SSL error)
- [ ] `curl -sI https://hk.proactivsports.com/` returns 200
- [ ] `curl -sI https://sg.proactivsports.com/` returns 200
- [ ] Cert valid: `openssl s_client -connect proactivsports.com:443 -servername proactivsports.com </dev/null 2>&1 | grep "Verify return code"` → returns `0 (ok)`

---

## Root — proactivsports.com

- [ ] Homepage loads; dual market CTAs (HK / SG) visible above fold
- [ ] `<title>` is correct (not "Phase 1 placeholder")
- [ ] Organization JSON-LD present: `curl -s https://proactivsports.com/ | grep '"@type":"Organization"'`
- [ ] `curl -s https://proactivsports.com/sitemap.xml` returns valid XML; URLs reference `proactivsports.com` domain (not `vercel.app`)
- [ ] `curl -sI https://proactivsports.com/llms.txt` returns 200
- [ ] OG preview renders correctly: verify at https://opengraph.xyz or Slack unfurl

---

## HK — hk.proactivsports.com

- [ ] Homepage loads; correct `<h1>` (HK-specific); HK navigation visible
- [ ] `/wan-chai/` and `/cyberport/` location pages load with 200
- [ ] Book-a-trial form submits successfully; email arrives at HK inbox (test submission)
- [ ] WhatsApp CTA click fires `whatsapp_click` event in GA4 real-time view
- [ ] GBP Wan Chai map embed renders
- [ ] `curl -s https://hk.proactivsports.com/sitemap.xml` returns 200

---

## SG — sg.proactivsports.com

- [ ] Homepage loads; correct `<h1>` (SG-specific); SG navigation visible
- [ ] `/katong-point/` location page loads with 200
- [ ] Book-a-trial form submits to SG inbox (test submission)
- [ ] `curl -s https://sg.proactivsports.com/sitemap.xml` returns 200

---

## WAF Rules (Security)

```bash
# WordPress attack paths — expect 403 DENY from WAF
curl -sI https://proactivsports.com/wp-login.php
curl -sI https://proactivsports.com/xmlrpc.php
curl -sI https://proactivsports.com/wp-admin/
curl -sI https://proactivsports.com/.env

# Rate limit test on /api/contact (expect 429 on 11th request in 60s)
for i in $(seq 1 12); do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","message":"smoke","name":"Smoke Test","honeypot":""}' \
    "https://proactivsports.com/api/contact")
  echo "Request $i: HTTP $STATUS"
  sleep 2
done
# Requests 1–10: 200 or 400 (Zod validation on test data)
# Requests 11–12: 429 (rate limited)
```

- [ ] `/wp-login.php` returns 403
- [ ] `/xmlrpc.php` returns 403
- [ ] `/wp-admin/` returns 403
- [ ] `/.env` returns 403
- [ ] Rate limit test: 429 on or before the 12th request within 60s window

---

## Sanity Webhook / ISR

- [ ] Publish a change in Sanity Studio (e.g., edit homepage hero text by one character)
- [ ] Page updates on production within 30 seconds of Sanity publishing
- [ ] Verify webhook is not blocked: Vercel WAF traffic view shows `/api/sanity-webhook` POST as ALLOWED (not blocked by OWASP rule)

---

## 301 Redirects (from Phase 9 .net map)

```bash
# Sample .net URLs from Phase 9 URL map — replace with actual redirected URLs
curl -sIL https://proactivsports.net/
curl -sIL https://www.proactivsports.net/

# Expect: 301 → https://proactivsports.com/ (or specific new URL)
# Then: 200 on the destination
```

- [ ] Root `.net` URL returns 301 to correct `.com` equivalent
- [ ] At least 3 additional `.net` sample URLs from Phase 9 map verified as 301

---

## Analytics

- [ ] GA4 real-time view shows active sessions from the smoke test actions
- [ ] `book-a-trial_submitted` event fires from HK test submission
- [ ] `book-a-trial_submitted` event fires from SG test submission

---

## Sign-Off

| Checklist section | Result | Notes |
|-------------------|--------|-------|
| Domain Resolution | | |
| SSL/TLS | | |
| Root | | |
| HK | | |
| SG | | |
| WAF Rules | | |
| Sanity Webhook / ISR | | |
| 301 Redirects | | |
| Analytics | | |

**Overall: [PASS / FAIL]**
**Signed off by:** [name] at [timestamp]
**Proceed to post-cutover steps:** [YES / NO — if NO, execute rollback]
```

---

## Vercel WAF Configuration Spec

### Configuration split: `vercel.json` vs Dashboard

| Rule type | Where configured | Why |
|-----------|-----------------|-----|
| DENY actions (WordPress paths, `.env`) | `vercel.json` — version controlled | Code-reviewable baseline; persists through CI |
| Rate limiting (contact form, booking form) | Vercel Dashboard — WAF → Rate Limiting | `vercel.json` only supports `challenge` and `deny`; rate limiting is a Dashboard-only capability |
| OWASP Core Ruleset | Vercel Dashboard — WAF → Managed Rulesets | Managed ruleset toggle — Dashboard only |
| Bot Protection Managed Ruleset | Vercel Dashboard — WAF → Managed Rulesets | Managed ruleset toggle — Dashboard only |
| AI Bots Ruleset | Vercel Dashboard — WAF → Managed Rulesets | Log mode initially — revisit at 2–4 week mark |
| Sanity webhook bypass | Vercel Dashboard — WAF → Custom Rules | Bypass rule must be ordered FIRST (before OWASP) |

### `vercel.json` WAF deny rules (exact content)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "routes": [
    {
      "src": "/(wp-login\\.php|xmlrpc\\.php|wp-admin.*|wp-content.*|wp-includes.*|\\.env|config\\.php)$",
      "mitigate": {
        "action": "deny"
      }
    }
  ]
}
```

### Dashboard WAF rules (exact expressions and parameters)

**Rule 1 — Rate Limit: Contact Form**
- Path: `path equals /api/contact AND method equals POST`
- Window: 60 seconds (Fixed Window)
- Limit: 10 requests per IP
- Action on exceed: 429 response

**Rule 2 — Rate Limit: Booking Form**
- Path: `path equals /api/book-a-trial AND method equals POST` (update path if Phase 4/5 used a different API route)
- Window: 60 seconds (Fixed Window)
- Limit: 10 requests per IP
- Action on exceed: 429 response

**Rule 3 — Bypass: Sanity Webhook (MUST be ordered first in rule list)**
- Condition: `path equals /api/sanity-webhook AND request header sanity-webhook-signature exists`
- Action: BYPASS (skips all other rules)
- Order: top of rule list — before OWASP ruleset

**Managed Rulesets:**
- OWASP Core Ruleset: enabled, LOG mode initially → switch to enforce after 1h real traffic observation
- Bot Protection Managed Ruleset: challenge mode
- AI Bots Ruleset: LOG mode — review at 2–4 week mark. Rationale: AI crawlers (GPTBot, ClaudeBot, PerplexityBot) have strategic value for LLMO/GEO work from Phase 7; deny mode would undermine that investment

### Log-first protocol

All new WAF rules (OWASP, Sanity bypass) must be deployed in LOG mode first. After at least 1 hour of real traffic, inspect the Vercel WAF traffic view for false positives before switching to enforce. Rate limiting is always active-enforcement from the moment it is configured.

---

## Cloudflare SSL/TLS Defensive Configuration

Set Cloudflare SSL/TLS mode to **Full (strict)** even though gray-cloud DNS-only mode means Cloudflare SSL is not in the live traffic path.

**Why:** If an operator accidentally enables orange-cloud on a Vercel-pointing record, "Full (strict)" prevents redirect loops that would otherwise occur under "Flexible" mode. This is a single config change in Cloudflare Dashboard → SSL/TLS → Overview → Full (strict). No impact on gray-cloud operation.

---

## Environment Variables: Pre-Production Build Requirement

Before the production build at T-0, the following environment variables MUST be set in Vercel project → Settings → Environment Variables → Production:

| Variable | Value | Scope |
|----------|-------|-------|
| `NEXT_PUBLIC_SITE_URL` (root) | `https://proactivsports.com` | Production |
| `NEXT_PUBLIC_SITE_URL` (hk) | `https://hk.proactivsports.com` | Production |
| `NEXT_PUBLIC_SITE_URL` (sg) | `https://sg.proactivsports.com` | Production |
| `SANITY_WEBHOOK_SECRET` | `<from 1Password / Vercel secrets>` | Production |

**Verification:** After the production build, `curl https://proactivsports.com/sitemap.xml` must return XML with `proactivsports.com` URLs — not `*.vercel.app` URLs.

---

## Post-Launch Operational Loop

Phase 10 is not complete until the operational loop is running. The success criteria explicitly require:

### Content cadence (required at launch, not deferred)

| Market | Minimum at cutover | Cadence post-launch |
|--------|--------------------|---------------------|
| HK | 1 published blog post | 1 post per week minimum |
| SG | 1 published blog post | 1 post per week minimum |

Content must be editorial and substantive — not thin placeholder content. Strategy PART 15.2 Warning #7 is explicit that thin launch content is a recovery risk.

### GBP review acquisition

The review acquisition email template ("Your child tried [class] today — how did it go? We'd love a Google review.") must be confirmed firing from the existing booking platform by launch day. This is not a code deliverable — it is an operational confirmation. The Day 90 target is 50+ reviews per location at ≥4.7 average.

### Backlink outreach

Week 1–2 post-launch quick wins (submit to): Sassy Mama HK, Honeycombers, Tickikids SG, Little Day Out, HK Gymnastics Association directory, Cyberport tenant directory, The Hennessy tenant directory. Full framework is 10 links per month per strategy PART 11.2.

### Day 90 review baseline (record at T+24h)

| Metric | Tool | Where to record |
|--------|------|-----------------|
| GSC: impressions/clicks/position for 20 priority queries (per market) | Google Search Console | Day 90 calendar event notes |
| GA4: organic sessions, conversion events fired | Google Analytics 4 | Day 90 calendar event notes |
| GBP: impressions, directions/calls/website actions, review count + average | Google Business Profile | Day 90 calendar event notes |
| CWV: LCP, INP, CLS p75 | CrUX field data (available 4 weeks post-launch) | Day 90 calendar event notes |

Set the Day 90 review calendar event at T+60min with these baseline values entered. The review date compares rankings, organic traffic, and trial booking volume against these baselines.

---

## Launch Sequencing Summary

The following is the authoritative sequence for Phase 10 execution. Plans map to this sequence.

| Plan | Sequence | Key deliverable |
|------|----------|-----------------|
| 10-01 | Pre-flight | HUMAN-ACTION: registrar audit, DNSSEC check, current DNS zone export, Vercel plan check |
| 10-02 | Vercel domain attachment | Three domains added to Vercel project; CNAME hash recorded; DNS-RECORDS.md populated |
| 10-03 | WAF configuration | `vercel.json` deny rules committed; Dashboard rate limit + managed rulesets configured in LOG mode |
| 10-04 | TTL pre-lowering + NS cutover | HUMAN-ACTION: TTL lowered T-24h; NS changed at registrar at T-0; propagation verified |
| 10-05 | Production build + GSC + sitemaps | Production build triggered; GSC Domain Property verified; sitemaps submitted; first blog posts published |
| 10-06 | Artifact creation | `CUTOVER-RUNBOOK.md` + `SMOKE-TEST-CHECKLIST.md` + `DNS-RECORDS.md` committed and ready |
| 10-07 | Post-launch operational bootstrap | Day 90 calendar event set with baselines; GBP review template confirmed; backlink outreach initiated |

---

## No New Visual Pages

Phase 10 ships **zero new visual pages**. All prior pages were built and tested on Vercel preview URLs in Phases 1–9. Phase 10 attaches those pages to the live domain — it does not add, modify, or remove any page-level component or route. Any post-launch content changes (blog posts, homepage updates) go through the Sanity CMS workflow established in Phase 6.

---

## Validation Architecture

Phase 10 has no Vitest tests. Infrastructure configuration and DNS cutover cannot be unit tested. The validation architecture is:

| Requirement | Validation method | When |
|-------------|------------------|------|
| FOUND-01: `proactivsports.com` resolves to Vercel, certs valid | Manual: `dig` + `curl -sI` + Vercel Dashboard | T+30min smoke test |
| FOUND-07: WAF active on WordPress paths | Manual: `curl -sI .../wp-login.php` → expect 403 | T+30min smoke test |
| CMS-08: Rate limit on form endpoints | Manual: shell script sending 12 POST requests | T+30min smoke test |
| MIG-01: All three subdomains resolve, certs valid | Manual: `dig` + `curl` per subdomain | T+30min smoke test |
| MIG-04: 301 redirects from `.net` correct | Manual: `curl -sIL` sample of `.net` URLs | T+30min smoke test |

Existing Vitest middleware tests (`tests/middleware.test.ts`, 11 tests) remain the regression gate for route-group routing correctness. They are re-run against the production deploy as part of the post-cutover verification.

---

## HUMAN-ACTION Checkpoints

Phase 10 requires explicit human actions at steps that cannot be automated. Plans must mark these clearly.

| Checkpoint | Step | Blocking? |
|------------|------|-----------|
| Identify current domain registrar and confirm EPP code can be requested | Plan 10-01 | Yes — NS change cannot proceed without registrar access |
| Confirm or disable DNSSEC at current registrar | Plan 10-01 | Yes — domain becomes unreachable post-NS-change if DNSSEC stays active |
| Export full DNS zone from current provider | Plan 10-01 | Yes — email records will break post-cutover if MX/SPF/DKIM are not preserved |
| Confirm Vercel plan (Hobby vs Pro) and upgrade if needed | Plan 10-01 | Yes — WAF custom rules require Pro |
| Execute NS change at current registrar | Plan 10-04 | Yes — cannot be scripted; requires registrar Dashboard access |
| Click Verify in GSC for Domain Property | Plan 10-05 | Yes — requires GSC account access |
| Confirm GBP review email template is firing from booking platform | Plan 10-07 | Yes — operational confirmation, not a code deliverable |

# Phase 10: Hosting, DNS, Domain Cutover, Launch — Research

**Researched:** 2026-04-24
**Domain:** Cloudflare DNS + Vercel custom domains + WAF + Search Console + operational launch
**Confidence:** HIGH (core DNS/WAF/Vercel patterns verified against official docs; operational items cited from strategy doc)

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | `proactivsports.com` on Cloudflare DNS with valid certs across `*.proactivsports.com` | DNS architecture section; cert provisioning options documented |
| FOUND-07 | Cloudflare WAF + bot management + rate limiting active before any public traffic | WAF strategy section — Vercel WAF (Pro plan) is the correct layer; Cloudflare DNS-only is the DNS layer |
| CMS-08 | Cloudflare WAF rules + bot management + rate limiting on `/api/*`, Sanity webhook, contact form | Custom rule templates documented; webhook secret-header bypass pattern documented |
| MIG-01 | Phase 0 — DNS transferred to Cloudflare; `*.proactivsports.com` cert valid; staging deployed | Domain transfer process and cert provisioning options documented |
| MIG-04 | Cutover runbook — DNS swap order, cache purge, smoke test checklist, rollback DNS plan with TTL set low 24h pre-cutover | Full runbook section with TTL pre-lowering and rollback plan documented |
</phase_requirements>

---

## Summary

Phase 10 is the only truly irreversible phase in the project: once DNS cuts over, real users hit the production ecosystem. Every other phase built and tested against Vercel preview URLs; Phase 10 converts that work into a public product.

The central architectural decision for this phase is the **Cloudflare–Vercel interaction model**. Cloudflare WAF requires its orange-cloud (proxy) mode to inspect traffic — but Vercel strongly discourages proxy mode in front of Vercel because it hides the TLS fingerprint and IP signals that Vercel's own WAF and bot detection depend on. The resolution is a **split-responsibility security model**: Cloudflare handles DNS management and free-tier DDoS protection in DNS-only (gray cloud) mode, while **Vercel's built-in WAF** (available on Pro plan, 40 custom rules + OWASP Core Ruleset + Bot Protection Managed Ruleset) handles application-layer protection including rate limiting, WordPress-era path blocking, `/api/*` protection, and Sanity webhook guards.

The second important discovery is that **wildcard cert provisioning** (`*.proactivsports.com`) requires Vercel nameservers if you want fully automated wildcard issuance. Since the project explicitly wants Cloudflare for DNS management, the practical approach is to add `proactivsports.com`, `hk.proactivsports.com`, and `sg.proactivsports.com` as three individual named domains in the Vercel project (each with its own per-domain cert issued by Vercel via ACME HTTP-01) and set each to a CNAME pointing at Vercel's provided hostname in Cloudflare as gray-cloud DNS-only records. This gives valid HTTPS on all three domains without needing Vercel nameservers or a wildcard cert.

**Primary recommendation:** Use Cloudflare for DNS + free DDoS only (gray cloud on all Vercel-pointing records). Use Vercel WAF (Pro plan) for all application-layer security. Lower TTLs to 300s at least 24 hours before cutover. Execute the three-domain Vercel domain attachment first (verify cert), then point the Cloudflare DNS records last.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| DNS resolution | Cloudflare (Registrar + DNS) | — | Cloudflare manages zone; gray-cloud on all Vercel records |
| SSL/TLS cert issuance | Vercel Edge Network | — | Per-domain ACME certs issued by Vercel; not Cloudflare Origin CA |
| DDoS protection (volumetric) | Cloudflare (free, always-on) | Vercel platform DDoS | Cloudflare's network-level protection even in DNS-only mode |
| WAF / custom rules | Vercel WAF (Pro) | — | Orange cloud not used; Cloudflare WAF requires proxy = not compatible |
| Bot management | Vercel Bot Protection Managed Ruleset | — | Same reason; JA3/JA4 fingerprinting works at Vercel edge natively |
| Rate limiting | Vercel WAF rate limiting | — | 40 rules on Pro; per-path Fixed Window algorithm |
| CDN / edge caching | Vercel Edge Network | — | No double-CDN; Cloudflare cache bypassed (gray cloud) |
| Search Console verification | Cloudflare DNS (TXT record) | — | DNS TXT record added in Cloudflare zone |
| Sanity webhook security | Next.js route handler (HMAC-SHA256) | Vercel WAF bypass rule | Webhook secret header verified in code; WAF bypass rule for Sanity IPs |
| Smoke testing | Manual runbook + automated health checks | — | No tool required; curl + browser + Lighthouse |
| Operational loop (content, backlinks) | Human operator (client team) | — | Documented cadence from strategy PART 11 and PART 15.4 |

---

## Standard Stack

### Core
| Component | Version / Plan | Purpose | Why Standard |
|-----------|----------------|---------|--------------|
| Cloudflare DNS | Free plan (zone only, no proxy) | DNS management for `proactivsports.com` zone | Authoritative DNS with gray-cloud records; free DDoS protection even without proxy; CNAME flattening at apex |
| Vercel Pro | Pro ($20/user/month) | Custom domain hosting + WAF + rate limiting | Required for 40 WAF custom rules, OWASP managed ruleset, Bot Protection ruleset, persistent actions |
| Vercel WAF | Included in Vercel Pro | Application-layer security, rate limiting, bot protection | Native to deployment path; no proxy layer needed; JA3/JA4 fingerprinting intact |
| Google Search Console | Free | Indexing verification + sitemap submission | Required for SEO-09; DNS TXT verification via Cloudflare |

### Supporting
| Component | Version | Purpose | When to Use |
|-----------|---------|---------|-------------|
| `@sanity/webhook-toolkit` | Latest | HMAC-SHA256 webhook signature verification | All Sanity webhook handlers — verifies `sanity-webhook-signature` header |
| Cloudflare Registrar | Free (at-cost pricing) | Domain registration if transferring from current registrar | Strongly recommended — consolidates DNS + registrar, simplifies EPP transfer |

### Version Verification
```bash
npm view @sanity/webhook-toolkit version
# At research date: latest is 1.x — verify before plan execution
```

**Package version note:** `@sanity/webhook-toolkit` should be verified against npm registry at plan execution time. [ASSUMED] version is 1.x.

---

## Architecture Patterns

### System Architecture Diagram

```
Browser / Search Engine / Bot
         |
         v
  [Cloudflare DNS Zone]
  Gray-cloud CNAME records (DNS-only)
  - proactivsports.com    → A 76.76.21.21 (Vercel)
  - hk.proactivsports.com → CNAME <hash>.vercel-dns-0xx.com
  - sg.proactivsports.com → CNAME <hash>.vercel-dns-0xx.com
         |
         | (No Cloudflare proxy — traffic goes direct to Vercel)
         v
  [Vercel Edge Network]
  ├── DDoS mitigation (automatic, all plans)
  ├── WAF IP blocking rules
  ├── WAF Custom Rules (40 rules, Pro)
  │   ├── BLOCK: /wp-login.php, /xmlrpc.php, /wp-admin/*
  │   ├── RATE LIMIT: /api/contact (10 req/60s per IP)
  │   ├── RATE LIMIT: /api/book-a-trial (10 req/60s per IP)
  │   ├── BYPASS: Sanity webhook IPs (for Sanity's outbound range)
  │   └── CHALLENGE: suspicious user agents
  ├── WAF Managed Rulesets
  │   ├── OWASP Core Ruleset (enabled, log→deny)
  │   ├── Bot Protection Managed Ruleset (challenge mode)
  │   └── AI Bots Ruleset (log initially)
  └── Next.js 15 App Router
      ├── middleware.ts (subdomain → route-group routing)
      ├── /api/contact → Sanity webhook handler (HMAC verify)
      ├── app/(root)/* → proactivsports.com pages
      ├── app/(hk)/*  → hk.proactivsports.com pages
      └── app/(sg)/*  → sg.proactivsports.com pages
```

### Recommended Project Structure Changes for Phase 10
```
vercel.json                    # Add WAF rules (deny actions only)
.planning/
  phases/10-hosting-dns-cutover-launch/
    CUTOVER-RUNBOOK.md         # Living doc — executed at launch
    SMOKE-TEST-CHECKLIST.md    # Per-domain test matrix
    DNS-RECORDS.md             # Exact records to configure in Cloudflare
```

### Pattern 1: Vercel Domain Attachment (Three Named Domains)

**What:** Add three explicit domains to the single Vercel project. Each gets its own per-domain SSL cert via ACME. No wildcard cert needed.

**When to use:** Project uses Cloudflare DNS in gray-cloud mode (not Vercel nameservers). Wildcard cert requires Vercel NS — not applicable here unless the `_acme-challenge` NS delegation workaround is used.

**Step sequence (Vercel Dashboard):**
1. Project → Settings → Domains → Add Domain → `proactivsports.com`
   - Vercel prompts for A record: `76.76.21.21` (or the project-specific value shown)
2. Add Domain → `hk.proactivsports.com`
   - Vercel provides CNAME target: `<hash>.vercel-dns-0xx.com`
3. Add Domain → `sg.proactivsports.com`
   - Vercel provides CNAME target: same project hash
4. Status shows "Pending Verification" — do NOT set DNS yet

**Cloudflare DNS records to set (all gray cloud = DNS-only):**
```
Type  Name                        Content                     Proxy
A     proactivsports.com (apex)   76.76.21.21                 DNS only
CNAME hk.proactivsports.com       <hash>.vercel-dns-0xx.com   DNS only
CNAME sg.proactivsports.com       <hash>.vercel-dns-0xx.com   DNS only
TXT   @                           google-site-verification=... DNS only  (GSC)
```

**Cert provisioning:** Vercel uses ACME HTTP-01 challenge for per-domain certs. Once DNS resolves to Vercel, cert provisions within minutes. Status changes to "Valid Configuration" in Vercel Dashboard. [VERIFIED: developers.cloudflare.com/dns/proxy-status, vercel.com/docs/domains/working-with-domains/add-a-domain]

### Pattern 2: Vercel WAF Custom Rules for WordPress Attack Surface

WordPress attack probes target these paths even on non-WordPress sites because scanners spray indiscriminately. Block them at the WAF level before they reach the Next.js runtime.

**Rules to configure in Vercel Firewall → Custom Rules:**

```
Rule: Block Legacy CMS Attack Paths
If: path matches any of:
  /wp-login.php
  /wp-admin/*
  /xmlrpc.php
  /wp-content/*
  /wp-includes/*
  /.env
  /config.php
Then: DENY (with persistent action: block for 1 hour)
```

```
Rule: Rate Limit Contact Form
If: path equals /api/contact AND method equals POST
Then: RATE LIMIT
  Window: 60s
  Limit: 10 requests per IP
  Action on exceed: 429 response
```

```
Rule: Rate Limit Booking Form
If: path equals /api/book-a-trial (or its sub-routes) AND method equals POST
Then: RATE LIMIT
  Window: 60s
  Limit: 10 requests per IP
  Action on exceed: 429 response
```

```
Rule: Bypass Sanity Webhook (allow Sanity to reach the handler)
If: path equals /api/sanity-webhook AND
    header "sanity-webhook-signature" exists
Then: BYPASS (runs before blocking rules — place first in order)
```

Note: The Sanity webhook handler itself verifies HMAC-SHA256 in code using `@sanity/webhook-toolkit`. The WAF bypass is belt-and-suspenders to prevent the OWASP ruleset from blocking Sanity's POST. [VERIFIED: sanity.io/docs/content-lake/webhook-best-practices, vercel.com/docs/vercel-firewall/vercel-waf/custom-rules]

### Pattern 3: DNS TTL Pre-Lowering for Zero-Downtime Cutover

**What:** Lower existing DNS record TTLs to 300s at the current registrar/DNS provider 24–48 hours before the planned cutover window.

**Why:** Default TTLs are 3600s–86400s. If a problem occurs after cutover, reverting means waiting the old TTL duration for DNS to re-propagate. With 300s TTL, rollback propagates globally in ~5 minutes.

**Sequence:**
- T-48h: Lower all A, CNAME, MX records at current DNS to 300s TTL
- T-0: Execute NS change to Cloudflare (or DNS record switch)
- T+5min: Verify new records resolving via `dig` from multiple locations
- T+30min: Run full smoke test checklist
- If rollback needed: revert DNS records — propagates within 5 minutes

[VERIFIED: developers.cloudflare.com/dns/manage-dns-records/reference/ttl]

### Pattern 4: Cloudflare Zone Transfer (Registrar → Cloudflare)

**What:** Transfer the domain registration to Cloudflare Registrar AND point nameservers to Cloudflare. These are two separate operations — you can change NS without transferring registration.

**Option A (Recommended): Change NS only first, then transfer registration separately**
1. Add `proactivsports.com` to Cloudflare as a new zone (dashboard → Add a domain)
2. Cloudflare scans existing DNS records (verify/complete the scan — not guaranteed to find everything)
3. Update nameservers at current registrar to Cloudflare's assigned NS pair
4. Wait for NS propagation: up to 24 hours (typically 15 minutes to 2 hours)
5. Disable DNSSEC at current registrar BEFORE NS change if currently active (critical — breaks domain if left on)
6. Domain registration transfer to Cloudflare Registrar can happen separately after NS propagation is confirmed

**Timing:** NS propagation takes up to 24h per Cloudflare docs. Plan for a Tuesday–Thursday cutover to avoid weekend incidents. [VERIFIED: developers.cloudflare.com/dns/zone-setups/full-setup/setup]

**Domain transfer (if also moving registrar):** Requires EPP/auth code from current registrar. Transfer lock must be disabled at current registrar 2–24 hours before requesting EPP code. Once initiated: 5–7 days (or faster if current registrar offers manual approval email). Domains registered/transferred within last 60 days cannot be transferred. [VERIFIED: developers.cloudflare.com/registrar/get-started/transfer-domain-to-cloudflare]

### Pattern 5: Search Console Verification

**Domain property vs URL-prefix property strategy:**

A single **Domain Property** for `proactivsports.com` (no protocol prefix) covers all subdomains (hk., sg., www.) and both HTTP/HTTPS. This is the correct choice for this architecture. [VERIFIED: support.google.com/webmasters/answer/10431861]

**Verification:**
1. In GSC: Add property → Domain → `proactivsports.com`
2. GSC provides a TXT record value: `google-site-verification=XXXXXXX`
3. Add TXT record in Cloudflare DNS (name: `@`, content: the value, proxy: DNS-only)
4. Verify in GSC — propagation typically minutes but can take up to 24h
5. Keep the TXT record permanently — removing it unverifies the property

**Sitemap submission (after DNS is live):**
- GSC → Sitemaps → Submit `https://proactivsports.com/sitemap.xml`
- GSC → Sitemaps → Submit `https://hk.proactivsports.com/sitemap.xml`
- GSC → Sitemaps → Submit `https://sg.proactivsports.com/sitemap.xml`

Note: GSC verification was prepared in Phase 8 (TXT record value stored). Phase 10 activates it. [VERIFIED: support.google.com/webmasters/answer/34592]

### Anti-Patterns to Avoid

- **Orange cloud (Cloudflare proxy) on Vercel-pointing records:** Cloudflare proxy intercepts HTTPS, preventing Vercel from issuing SSL certs (unless Enterprise Cloudflare Origin CA workaround). Also hides client signals from Vercel WAF. Do not use proxy mode on A/CNAME records pointing to Vercel. [VERIFIED: vercel.com/kb/guide/cloudflare-with-vercel]
- **Using *.proactivsports.com wildcard cert without Vercel nameservers:** Wildcard ACME cert via DNS-01 challenge requires controlling the DNS zone's NS records. With Cloudflare as DNS, you would need the `_acme-challenge` NS delegation workaround — complex and fragile. Just add 3 named domains instead.
- **Setting Cloudflare SSL/TLS to "Flexible":** In gray-cloud (DNS-only) mode, Cloudflare SSL mode is irrelevant (no proxy = no Cloudflare SSL). But if you ever mistakenly enable orange-cloud, Flexible mode will cause redirect loops. Set to "Full (strict)" as defensive config.
- **Submitting sitemaps before DNS cuts over:** Search Console sitemaps must resolve from the production domain. Submit only after DNS propagation is confirmed.
- **Enabling WAF rules in DENY mode without log-first testing:** Always deploy new WAF rules in LOG mode for at least one hour of real traffic observation before switching to DENY. Vercel WAF provides live traffic view. [VERIFIED: vercel.com/docs/vercel-firewall/vercel-waf/custom-rules]

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sanity webhook signature verification | Custom HMAC validation code | `@sanity/webhook-toolkit` `isValidSignature()` | Handles HMAC-SHA256, timing-safe comparison, header parsing — all edge cases covered |
| WordPress path blocking | Custom middleware matching paths | Vercel WAF custom rules (dashboard or vercel.json) | Applies at edge before Next.js runtime; persistent action blocks IP for follow-up requests |
| Rate limiting | Custom in-memory counter in API route | Vercel WAF rate limiting | Vercel rate limiting is per-region edge enforcement; in-memory counters don't survive across serverless instances |
| DDoS protection | Custom request volume checks | Cloudflare (free, always-on) + Vercel platform DDoS | Network-level; cannot be implemented at application level |
| SSL cert management | Manual Let's Encrypt cert renewal | Vercel auto-provisioned ACME certs | Vercel handles DNS-01/HTTP-01 challenges and auto-renewal automatically |
| Bot blocking | IP blocklist in middleware | Vercel Bot Protection Managed Ruleset + JA4 fingerprinting | Training-data-backed detection; fingerprint-based (not IP-based, harder to evade) |

**Key insight:** Every security capability in this stack has a native, maintenance-free solution at the correct layer. Phase 10 is configuration, not code.

---

## Common Pitfalls

### Pitfall 1: DNSSEC Must Be Disabled Before NS Change
**What goes wrong:** Domain becomes unreachable after NS change because DNSSEC validation fails against new nameservers.
**Why it happens:** DNSSEC signatures are tied to the original key. Changing NS without removing DNSSEC breaks validation chain.
**How to avoid:** Log into current registrar, disable DNSSEC completely, wait for TTL to expire (up to 24h for DS record propagation), then change NS.
**Warning signs:** `dig +dnssec proactivsports.com` shows SERVFAIL after NS change.

### Pitfall 2: Cloudflare DNS Record Scan is Incomplete
**What goes wrong:** Existing DNS records (MX for email, SPF, DKIM, TXT for third-party verifications) are missing after zone transfer.
**Why it happens:** Cloudflare's auto-scan "is not guaranteed to find all existing DNS records" (official docs).
**How to avoid:** Before NS change, export a full zone file from the current provider OR manually document every DNS record. Verify post-migration by checking email deliverability and any third-party service that relies on DNS.
**Warning signs:** Email bounces after cutover; third-party services stop working.

### Pitfall 3: Vercel Cert Provisioning Fails if DNS Points Elsewhere
**What goes wrong:** Vercel shows "Failed to Generate Cert" on a domain.
**Why it happens:** Vercel uses HTTP-01 ACME challenge — must be able to reach `/.well-known/acme-challenge/` at the domain. If DNS is still pointing to the old host, Vercel cannot complete the challenge.
**How to avoid:** Add domains in Vercel first (status: Pending), then set DNS records. Cert provisions once DNS resolves to Vercel.
**Warning signs:** Domain status remains "Pending" in Vercel dashboard after DNS is set. Check with `dig CNAME hk.proactivsports.com` to confirm resolution.

### Pitfall 4: WAF Rules Blocking Legitimate Sanity Webhook
**What goes wrong:** Sanity webhook fires on content publish, but the ISR revalidation never triggers because the Vercel WAF (OWASP ruleset or custom rule) blocks Sanity's POST request.
**Why it happens:** Sanity's webhook HTTP POST may trigger OWASP rules (e.g., RFI, XSS) due to the JSON body structure.
**How to avoid:** Add a BYPASS custom rule for the webhook path that runs before other rules. Also implement HMAC verification in the route handler itself (defense in depth).
**Warning signs:** Sanity publishes succeed but site doesn't update; check Vercel WAF traffic view to see if requests to `/api/sanity-webhook` are being blocked.

### Pitfall 5: Rate Limiting Counter is Per-Region, Not Global
**What goes wrong:** A sophisticated attacker sends requests from multiple regions and evades rate limiting.
**Why it happens:** Vercel WAF rate limit counters are tracked per-region (explicitly documented). A source in Singapore and Hong Kong each get their own counter for the same IP.
**How to avoid:** Accept this limitation; it's still effective against unsophisticated attacks. For form endpoints, the honeypot + Resend rate-limit (already in Phase 3 contact form) provides a second layer.
**Warning signs:** Abnormally high POST volume to form endpoints from distributed sources.

### Pitfall 6: Sitemap URLs Must Use Production Domain
**What goes wrong:** GSC reports sitemap errors or shows wrong URLs after launch.
**Why it happens:** Sitemaps generated against Vercel preview URLs (*.vercel.app) during development phases.
**How to avoid:** The `NEXT_PUBLIC_SITE_URL` environment variable (set per-market in Vercel prod environment) must be set to the production domain before production build. Verify sitemap content at `/sitemap.xml` on production resolves to `https://proactivsports.com/...` URLs.

### Pitfall 7: Search Console Domain Property Verification Timing
**What goes wrong:** GSC verification fails even after TXT record is set.
**Why it happens:** TXT record propagation can take up to 24h. GSC verification checks it immediately after clicking "Verify."
**How to avoid:** Set TXT record, wait 15-30 minutes, then click Verify. If it fails, wait longer. The Phase 8 preparation (TXT record pre-staged) means this should be ready at DNS cutover time.
**Warning signs:** GSC shows "Ownership not verified" — wait and retry, do not create duplicate TXT records.

---

## DNS Cutover Runbook (Authoritative)

This runbook is consumed by the Phase 10 planner as the execution template. The planner creates a standalone `CUTOVER-RUNBOOK.md` from this structure.

### Pre-Cutover Checklist (T-72h to T-24h)
- [ ] Verify all Phases 1–9 requirements are met on the current Vercel preview URL
- [ ] Confirm `proactivsports.com` zone is added to Cloudflare (NS change not yet applied)
- [ ] All DNS records from current provider documented (zone file export or manual inventory)
- [ ] DNSSEC status confirmed at current registrar (disable if active)
- [ ] Three domains added in Vercel project settings: `proactivsports.com`, `hk.proactivsports.com`, `sg.proactivsports.com` (certs pending)
- [ ] GSC TXT verification record value confirmed (from Phase 8)
- [ ] `NEXT_PUBLIC_SITE_URL` per-market production env vars set in Vercel project (production environment)
- [ ] All Vercel WAF rules configured and tested in LOG mode on preview

### T-24h: Lower TTLs
- [ ] Lower A/CNAME records at current DNS to 300s TTL
- [ ] Lower MX/SPF/DKIM records to 300s TTL (for email continuity monitoring)
- [ ] Confirm TTL change has propagated: `dig +noall +answer proactivsports.com`

### T-0: Cutover Execution
1. **Set Cloudflare DNS records** (all gray cloud / DNS-only):
   - `@` → A `76.76.21.21` (verify exact IP from Vercel project → Domain settings)
   - `hk` → CNAME `<project-hash>.vercel-dns-0xx.com`
   - `sg` → CNAME `<project-hash>.vercel-dns-0xx.com`
   - `@` → TXT `google-site-verification=<from Phase 8 prep>`
   - `studio` → CNAME `<project-hash>.vercel-dns-0xx.com` (if studio subdomain used)
2. **Update NS records at current registrar** to Cloudflare's assigned nameservers
3. **Verify propagation:** `dig NS proactivsports.com` → should return Cloudflare NS within 15-60 minutes
4. **Monitor Vercel cert provisioning:** Dashboard → Domains → all three should transition to "Valid Configuration"
5. **Trigger production build** with production env vars: push to main or trigger deploy in Vercel

### T+30min: Smoke Tests
Execute per domain, record pass/fail:

**proactivsports.com:**
- [ ] `curl -sI https://proactivsports.com/` returns 200
- [ ] Homepage loads, dual market CTAs visible, Organization JSON-LD present
- [ ] `curl https://proactivsports.com/sitemap.xml` returns valid XML with `proactivsports.com` URLs (not vercel.app)
- [ ] `curl https://proactivsports.com/llms.txt` returns 200
- [ ] OG preview card renders correctly (OpenGraph.xyz or Slack unfurl)
- [ ] `dig +short proactivsports.com` returns Vercel IP (not old host IP)

**hk.proactivsports.com:**
- [ ] `curl -sI https://hk.proactivsports.com/` returns 200
- [ ] HK homepage loads with correct H1 and HK navigation
- [ ] Book-a-trial form submits and email arrives at HK inbox (test submission)
- [ ] WhatsApp click fires GA4 event in real-time view
- [ ] GBP Wan Chai map embed renders
- [ ] `curl https://hk.proactivsports.com/sitemap.xml` returns 200

**sg.proactivsports.com:**
- [ ] `curl -sI https://sg.proactivsports.com/` returns 200
- [ ] SG homepage loads with correct H1 and SG navigation
- [ ] Book-a-trial form submits to SG inbox
- [ ] `curl https://sg.proactivsports.com/sitemap.xml` returns 200

**Security:**
- [ ] `curl -sI https://proactivsports.com/wp-login.php` returns 403 (WAF blocking)
- [ ] `curl -sI https://proactivsports.com/xmlrpc.php` returns 403 (WAF blocking)
- [ ] Rate limit test: rapid POST to `/api/contact` → 429 on 11th request within 60s
- [ ] Sanity test publish → ISR triggers → page updates within 30s

**301 Migration (from Phase 9):**
- [ ] Sample of legacy `.net` URLs return 301 to correct `.com` equivalents
- [ ] `curl -sI https://proactivsports.net/` → 301 to `https://proactivsports.com/`

### Rollback Plan
If smoke tests fail critically (site unreachable, wrong content):
1. At current DNS provider: revert A/CNAME records to original values (5-minute propagation due to 300s TTL pre-lowering)
2. At Cloudflare: delete the A/CNAME records pointing to Vercel (optional — Cloudflare not yet authoritative if NS change is still pending)
3. If NS change already propagated: change Cloudflare DNS records back to original host values
4. Document failure mode, diagnose, re-execute when fixed

---

## Post-Launch Operations (Day 0 → Day 90)

### Content Cadence (from strategy PART 15.4)
**Weeks 11-13:**
- Publish at least 1 blog post per market (minimum 2 posts at launch)
- Post topics should be editorial, not thin: real insight, expert voice (strategy PART 15.2 Warning #7)

**Ongoing (Month 1+):**
- 1 blog post per market per week minimum
- Each HK post targets HK-qualified query; each SG post targets SG-qualified query (strategy PART 7.4)

### GBP Review Acquisition
Trigger the review acquisition campaign immediately at launch:
- Post-trial email template: "Your child tried [class] today — how did it go? We'd love a Google review."
- Template must exist and be firing from the existing booking platform before Day 90 review
- Target: 50+ reviews per location at ≥4.7 average within 12 months (strategy PART 8.3)

### Backlink Outreach Framework (strategy PART 11)
Per PART 11.2, the monthly target is 10 links:

| # | Category | Targets | Effort |
|---|----------|---------|--------|
| 2 | Local/family directories | Sassy Mama HK, Honeycombers, Tickikids SG, Little Day Out | Low |
| 2 | Sports/gymnastics directories | HK Gymnastics Association, sports parent sites | Medium |
| 2 | School/venue partner pages | Partner school websites, The Hennessy tenant directory, Cyberport directory | Medium (relationship) |
| 1 | PR / local media | SCMP Post Magazine, Honeycombers op-ed, TheAsianParent | High |
| 1 | Guest feature / founder | Parenting podcasts, trade publications | Medium-High |
| 1 | Event / camp listing | Kids-activity aggregators — refreshed per season | Low |
| 1 | Resource / listicle acquisition | "Best kids gymnastics HK/SG" listicles outreach | Medium |

**Week 1–2 after launch:** Quick wins (directories, camp listings, partner pages)
**Week 2–3:** PR pitches, resource page owners
**Week 4:** Guest feature submissions

**Deferred to POST-04:** Full backlink framework operationalised at v1.5 (strategy PART 12 Tier 3–4 content and linkable assets). Phase 10 starts the cadence; it does not build the full infrastructure.

### Day 90 Review
Record baselines at launch:
- Google Search Console: impressions, clicks, position for the 20 priority queries per market (strategy PART 7.4)
- GA4: organic sessions, `book-a-trial_submitted` conversions, `enquire_submitted` conversions
- GBP: impressions, actions (calls/directions/website), review count and average per location
- Core Web Vitals: LCP, INP, CLS p75 from CrUX (available 4 weeks after real traffic)

Set calendar event for Day 90 review with these baselines to compare against.

---

## Environment Availability Audit

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Vercel CLI | Domain management, deploy trigger | ✓ | 50.25.6 | Vercel Dashboard (GUI) |
| Node.js / pnpm | Build + scripts | ✓ | (project pinned) | — |
| `dig` / DNS tools | NS verification, smoke tests | ✓ (macOS built-in) | — | whatsmydns.net (web) |
| `curl` | Smoke test HTTP checks | ✓ (macOS built-in) | — | Browser + devtools |
| Cloudflare Dashboard access | Zone management | ✓ (user must have account) | — | Cloudflare API |
| Current registrar access | EPP code + NS change | Unknown | — | HUMAN-ACTION required |
| Cloudflare account with proactivsports.com zone | DNS management | Unknown | — | HUMAN-ACTION: create zone |
| Vercel Pro plan | WAF custom rules (40), OWASP ruleset | Unknown (check current plan) | — | HUMAN-ACTION: upgrade if on Hobby |
| Google Search Console access | Sitemap submission, verification | Prepared Phase 8 | — | — |
| Wrangler CLI | Cloudflare automation | ✗ (not installed) | — | Cloudflare Dashboard (GUI) — all tasks achievable without Wrangler |

**Missing dependencies with no fallback:**
- Current registrar credentials (EPP code): HUMAN-ACTION — gather auth code from current registrar before Phase 10 starts (strategy STATE.md note: "gather registrar auth code / EPP code closer to Phase 10 start")
- Cloudflare account: HUMAN-ACTION — must create Cloudflare account and add zone if not already done

**Missing dependencies with fallback:**
- Wrangler CLI: all Cloudflare operations achievable via Cloudflare Dashboard GUI

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (installed Phase 1, scoped to middleware + pure-TS tests) |
| Config file | `vitest.config.ts` (existing) |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test --run` |
| Smoke test | `curl` commands in CUTOVER-RUNBOOK.md (manual, not automated) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-01 | proactivsports.com resolves to Vercel, cert valid | smoke/manual | `curl -sI https://proactivsports.com/` | ❌ Wave 0 |
| FOUND-07 | WAF rules active — WordPress paths return 403 | smoke/manual | `curl -sI https://proactivsports.com/wp-login.php` | ❌ Wave 0 |
| CMS-08 | Rate limit triggers on /api/contact (11th req/60s) | smoke/manual | Shell script in CUTOVER-RUNBOOK.md | ❌ Wave 0 |
| MIG-01 | All three subdomains resolve, certs valid | smoke/manual | `dig` + `curl` in CUTOVER-RUNBOOK.md | ❌ Wave 0 |
| MIG-04 | 301 redirects from .net return correct targets | smoke/manual | `curl -sIL` in CUTOVER-RUNBOOK.md | ❌ Wave 0 |

**Note on test strategy for Phase 10:** DNS cutover, WAF configuration, and SSL cert issuance are infrastructure events — not code logic. They cannot be unit tested. The validation architecture for this phase is the smoke test checklist in the cutover runbook. Vitest covers no new code in Phase 10; existing middleware tests remain the regression gate.

### Wave 0 Gaps
- [ ] `CUTOVER-RUNBOOK.md` — smoke test shell scripts covering all 5 requirements
- [ ] `SMOKE-TEST-CHECKLIST.md` — per-domain manual test matrix for human signoff
- [ ] `DNS-RECORDS.md` — exact Cloudflare records to configure (populated after Vercel provides domain hash)

*(No new test files needed in `tests/` — Phase 10 is infrastructure configuration)*

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | N/A — no auth on public pages |
| V3 Session Management | No | N/A — no sessions on public site |
| V4 Access Control | Yes (WAF) | Vercel WAF custom rules block path enumeration |
| V5 Input Validation | Yes | Zod in /api/contact handlers (Phase 3 existing); HMAC on webhook |
| V6 Cryptography | Yes (webhook) | @sanity/webhook-toolkit HMAC-SHA256 — never hand-roll |
| V9 Communication | Yes | Vercel auto-HTTPS; no Flexible SSL mode |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| WordPress scanner probes (wp-login, xmlrpc) | Probing | Vercel WAF custom rule: DENY + persistent block 1h |
| Form endpoint flooding (contact/booking) | DoS | Vercel WAF rate limiting: 10 req/60s per IP |
| Sanity webhook replay / spoofing | Spoofing | HMAC-SHA256 via @sanity/webhook-toolkit; timestamp validation |
| Path traversal / SQL injection via URL | Tampering | Vercel WAF OWASP Core Ruleset (managed) |
| Credential stuffing on admin paths | Spoofing | Sanity Studio has its own auth; /studio pass-through in middleware is protected by Sanity's auth |
| Bot scraping / AI crawler excessive load | DoS | Vercel Bot Protection Managed Ruleset; AI Bots Ruleset |
| DNSSEC removal window during NS transfer | Tampering | Disable DNSSEC before NS change; verify with `dig +dnssec` post-cutover |

---

## Code Examples

### Sanity Webhook HMAC Verification (existing in codebase, verify pattern)
```typescript
// Source: sanity.io/docs/content-lake/webhook-best-practices
// app/api/sanity-webhook/route.ts
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook-toolkit'

const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET!

export async function POST(request: Request) {
  const body = await request.text() // must be raw text for signature verification
  const signature = request.headers.get(SIGNATURE_HEADER_NAME)

  if (!signature || !(await isValidSignature(body, signature, SANITY_WEBHOOK_SECRET))) {
    return new Response('Invalid signature', { status: 401 })
  }

  // ... revalidatePath calls
}
```

### Vercel WAF Rule in vercel.json (deny-only subset)
```json
// Source: vercel.com/docs/vercel-firewall/vercel-waf/custom-rules#configuration-in-verceljson
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "routes": [
    {
      "src": "/(wp-login\\.php|xmlrpc\\.php|wp-admin|wp-content|wp-includes).*",
      "mitigate": {
        "action": "deny"
      }
    }
  ]
}
```

Note: `vercel.json` WAF rules support only `challenge` and `deny` actions. For rate limiting, persistent actions, and OWASP ruleset — use the Vercel Dashboard. Vercel.json provides a code-reviewable baseline for the deny rules.

### DNS TTL Pre-lowering Verification
```bash
# Verify current TTL at origin DNS (before lowering)
dig +noall +answer proactivsports.com

# After TTL change to 300s, verify propagation
dig +noall +answer +time=5 @8.8.8.8 proactivsports.com
dig +noall +answer +time=5 @1.1.1.1 proactivsports.com

# After NS change to Cloudflare, verify NS
dig +noall +answer NS proactivsports.com
# Should return: proactivsports.com. 86400 IN NS xxxx.ns.cloudflare.com.
```

### Smoke Test Rate Limit Script
```bash
#!/bin/bash
# Verify rate limiting is active on /api/contact
ENDPOINT="https://proactivsports.com/api/contact"
for i in $(seq 1 12); do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","message":"smoke","name":"Smoke Test","honeypot":""}' \
    "$ENDPOINT")
  echo "Request $i: HTTP $STATUS"
  sleep 2
done
# Expected: requests 1-10 return 200 or 400 (validation); requests 11-12 return 429
```

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Vercel project is currently on Hobby plan; needs upgrade to Pro for WAF custom rules | Standard Stack | If already on Pro, no action needed. If on Enterprise, no action needed. Low risk. |
| A2 | `proactivsports.com` is currently at a registrar that supports EPP code export for transfer | DNS Cutover Runbook | If at a registrar that locks transfer (rare), may need registrar support ticket. Medium risk. |
| A3 | Current DNS provider allows TTL lowering to 300s | Pitfall 3 (TTL pre-lowering) | Some managed DNS providers have TTL minimums (e.g., 600s). Adjust pre-lowering plan if so. Low risk. |
| A4 | `@sanity/webhook-toolkit` latest version is 1.x | Standard Stack | If API changed significantly, webhook verification code may need updating. Low risk. |
| A5 | The Vercel project uses a single project for all three subdomains (confirmed by architecture) | Architecture | The single-project assumption is locked in CLAUDE.md; no risk. |
| A6 | proactivsports.com is not registered within the last 60 days (would block registrar transfer) | Domain Transfer | Domain has been in operation since 2011; no risk. |

---

## Open Questions

1. **What registrar currently holds `proactivsports.com`?**
   - What we know: Transfer prep is noted in STATE.md as needed before Phase 10.
   - What's unclear: The current registrar name is not documented. Different registrars have different EPP code request processes (web UI vs email vs support ticket).
   - Recommendation: HUMAN-ACTION in Plan 10-01 — document current registrar and confirm EPP code can be requested online.

2. **Is the Vercel project currently on Hobby or Pro plan?**
   - What we know: Phase 0 set up the Vercel project; plan is unspecified in STATE.md.
   - What's unclear: Pro plan is required for 40 WAF custom rules + OWASP managed ruleset.
   - Recommendation: HUMAN-ACTION in Plan 10-01 — verify Vercel team plan and upgrade to Pro if on Hobby.

3. **Does `proactivsports.com` currently have DNSSEC active?**
   - What we know: DNSSEC must be disabled before NS change to prevent domain outage.
   - What's unclear: DNSSEC status at current registrar is unknown.
   - Recommendation: Check DNSSEC status in Plan 10-01 pre-flight: `dig +dnssec +short DS proactivsports.com @8.8.8.8`

4. **What is the current DNS provider (may differ from registrar)?**
   - What we know: Separate from registrar in some setups. The project note says "proactivsports.com is on Cloudflare DNS" as a goal — it may or may not already be there.
   - What's unclear: Whether any of the Cloudflare zone setup has already been done.
   - Recommendation: Pre-flight check in Plan 10-01: `dig NS proactivsports.com` — if it already returns Cloudflare NS, NS migration step is complete.

5. **Are there existing MX or other DNS records that must be preserved?**
   - What we know: Cloudflare zone scan is not comprehensive; manual inventory needed.
   - What's unclear: ProActiv's email setup (GSuite/Google Workspace MX? Third-party email?).
   - Recommendation: DNS records audit as first task in Plan 10-01.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Cloudflare orange-cloud + Vercel for WAF | Vercel WAF native (gray cloud) | 2024–2025 | Cloudflare proxy in front of Vercel is actively discouraged; Vercel WAF Pro plan is the correct layer |
| Vercel A record `76.76.21.21` for apex | Project-specific CNAME target from Vercel dashboard | ~2024 | New projects get unique CNAME targets; A record still works but is less precise — check Vercel dashboard for exact recommendation |
| GSC URL-prefix property per subdomain | Domain property covers all subdomains | ~2021 | Domain property for `proactivsports.com` covers hk. and sg. automatically |
| Wildcard cert via Vercel NS required | Named per-domain certs with gray-cloud DNS-only | Current | Three named domains (no wildcard) = works with Cloudflare DNS-only, no NS change needed |
| Legacy Cloudflare rate limiting (deprecated 2025-06-15) | New WAF rate limiting ruleset | 2025 | Old rate limiting resource no longer supported; must use new ruleset |

**Deprecated/outdated:**
- Cloudflare legacy rate limiting: deprecated as of 2025-06-15. Plans that reference the old rate limiting API must use the new WAF rate limiting ruleset resource. [VERIFIED: developers.cloudflare.com/waf/rate-limiting-rules]
- Using Cloudflare orange-cloud proxy in front of Vercel for WAF: technically possible (Full Strict mode) but officially discouraged and degrades Vercel bot detection. [VERIFIED: vercel.com/kb/guide/vercel-waf-vs-cloudflare-waf]

---

## Sources

### Primary (HIGH confidence)
- [Vercel: Adding & Configuring a Custom Domain](https://vercel.com/docs/domains/working-with-domains/add-a-domain) — domain attachment, wildcard requirements, nameserver vs CNAME methods
- [Vercel: Cloudflare with Vercel KB](https://vercel.com/kb/guide/cloudflare-with-vercel) — proxy vs DNS-only, SSL requirements, Enterprise exception
- [Vercel: Vercel WAF vs Cloudflare WAF KB](https://vercel.com/kb/guide/vercel-waf-vs-cloudflare-waf) — architectural trade-off, signal degradation with proxy
- [Vercel: WAF Custom Rules docs](https://vercel.com/docs/vercel-firewall/vercel-waf/custom-rules) — rule configuration, actions, vercel.json support
- [Vercel: WAF Rate Limiting docs](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting) — plan limits table, Fixed Window algorithm, per-region caveat
- [Vercel: WAF Managed Rulesets docs](https://vercel.com/docs/vercel-firewall/vercel-waf/managed-rulesets) — OWASP Core, Bot Protection, AI Bots rulesets
- [Cloudflare: DNS Proxy Status docs](https://developers.cloudflare.com/dns/proxy-status/) — confirmed WAF requires proxy; DNS-only = no WAF
- [Cloudflare: Full Zone Setup docs](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/) — NS propagation timing, DNSSEC requirement, record scan caveat
- [Cloudflare: Transfer Domain to Cloudflare docs](https://developers.cloudflare.com/registrar/get-started/transfer-domain-to-cloudflare/) — EPP code process, 5–7 day transfer timeline, 60-day lock rule
- [Cloudflare: TTL docs](https://developers.cloudflare.com/dns/manage-dns-records/reference/ttl/) — 300s default for proxied; pre-cutover TTL lowering recommendation
- [Cloudflare: WAF Managed Rules docs](https://developers.cloudflare.com/waf/managed-rules/) — plan requirements for OWASP; Pro required for managed rulesets
- [Cloudflare: Rate Limiting Rules docs](https://developers.cloudflare.com/waf/rate-limiting-rules/) — new ruleset (legacy deprecated 2025-06-15), plan comparison
- [Google Search Console: Domain Property help](https://support.google.com/webmasters/answer/10431861) — domain property covers all subdomains; DNS TXT verification
- [Sanity: Webhook Best Practices](https://www.sanity.io/docs/content-lake/webhook-best-practices) — HMAC-SHA256 verification, @sanity/webhook-toolkit usage

### Secondary (MEDIUM confidence)
- [Vercel: Wildcard Domain Without Nameservers KB](https://vercel.com/kb/guide/wildcard-domain-without-vercel-nameservers) — `_acme-challenge` NS delegation workaround (cited but not used in plan)
- [Cloudflare Changelog: Next.js CVE-2025-29927 managed rule](https://developers.cloudflare.com/changelog/post/2025-03-22-next-js-vulnerability-waf/) — Cloudflare has a managed rule for the Next.js auth bypass CVE; useful context
- Multiple community sources confirming gray-cloud + CNAME is the standard Vercel+Cloudflare pattern

### Tertiary (LOW confidence)
- DEV Community article on Cloudflare+Vercel 2026 setup — corroborates gray-cloud approach
- Various community forum posts on WAF rule expressions for WordPress paths — patterns aligned with official Cloudflare expressions docs

---

## Metadata

**Confidence breakdown:**
- DNS architecture (Cloudflare gray-cloud + Vercel WAF): HIGH — verified against multiple official docs, consistent across sources
- Vercel WAF capabilities and plan limits: HIGH — from official Vercel docs with accurate table data
- Domain transfer process and timing: HIGH — from Cloudflare official registrar docs
- Search Console verification: HIGH — from official Google docs
- Operational cadence (backlink framework, content cadence): HIGH — directly from strategy.md PARTS 11 and 15.4
- Sanity webhook security pattern: HIGH — from official Sanity docs

**Research date:** 2026-04-24
**Valid until:** 2026-07-24 (90 days — Vercel WAF and Cloudflare plans stable; check if wildcard cert behavior changes)

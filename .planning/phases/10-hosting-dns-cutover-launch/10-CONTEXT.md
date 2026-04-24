# Phase 10: Hosting, DNS Cutover & Launch — Context

**Gathered:** 2026-04-24
**Status:** Ready for planning

---

## Decisions

### 1. Security Architecture: Vercel WAF (Pro) + Cloudflare DNS-Only

**Decision:** Use Cloudflare in DNS-only (gray-cloud) mode for DNS management and always-on volumetric DDoS protection. Use Vercel WAF (Pro plan) for all application-layer security — custom rules, OWASP Core Ruleset, Bot Protection Managed Ruleset, rate limiting.

**Rationale:** Cloudflare's orange-cloud proxy mode prevents Vercel from issuing ACME SSL certs and degrades Vercel's JA3/JA4 fingerprinting-based bot detection. Vercel WAF on Pro (40 custom rules, OWASP managed ruleset, Bot Protection ruleset, rate limiting) is the correct and officially recommended security layer for this stack. Cloudflare still provides network-level DDoS protection in DNS-only mode. Research confidence: HIGH, verified against Vercel KB `cloudflare-with-vercel` and `vercel-waf-vs-cloudflare-waf`.

---

### 2. SSL/TLS Certificate Strategy: Three Named Per-Domain Certs (No Wildcard)

**Decision:** Add `proactivsports.com`, `hk.proactivsports.com`, and `sg.proactivsports.com` as three individual named domains in the Vercel project. Each receives its own per-domain ACME HTTP-01 cert issued by Vercel automatically. No wildcard cert.

**Rationale:** Wildcard cert (`*.proactivsports.com`) via ACME DNS-01 requires either Vercel nameservers or a fragile `_acme-challenge` NS delegation workaround. Since Cloudflare manages DNS in gray-cloud mode, the wildcard path is unnecessarily complex. Three named certs are simpler, verified against official Vercel docs, and work cleanly with Cloudflare DNS-only CNAME records.

---

### 3. Cloudflare DNS Record Configuration: Gray-Cloud CNAMEs + A Record

**Decision:** Configure Cloudflare DNS records as follows (all set to DNS-only / gray cloud):
- `proactivsports.com` (apex) → A record pointing to Vercel's provided IP (verify exact value from Vercel dashboard — likely `76.76.21.21`)
- `hk.proactivsports.com` → CNAME to Vercel-provided `<hash>.vercel-dns-0xx.com` target
- `sg.proactivsports.com` → CNAME to same Vercel project CNAME target
- `@` TXT → GSC `google-site-verification=<value from Phase 8>`
- Preserve all existing MX, SPF, DKIM, and any third-party TXT records (manual audit required)

**Rationale:** Standard Vercel + Cloudflare DNS-only pattern. Apex A record is used because CNAME at apex is not universally supported; Cloudflare's CNAME flattening handles this but the A record approach is simpler and matches the Vercel-provided value. The exact Vercel CNAME hash is project-specific and must be read from the Vercel Dashboard when domains are added — it cannot be pre-computed.

---

### 4. Cloudflare Zone Setup: NS Change First, Registrar Transfer Later

**Decision:** Change nameservers at the current registrar to Cloudflare's assigned NS pair as the first step. Domain registration transfer to Cloudflare Registrar is a separate, optional, lower-priority step that can happen after the site is live.

**Rationale:** NS change and registrar transfer are independent operations. NS change propagates in 15 minutes to 2 hours; registrar transfer takes 5–7 days. Decoupling them means the site can go live without waiting for a registrar transfer. The current registrar identity is unknown — a HUMAN-ACTION checkpoint in Plan 10-01 must gather this. DNSSEC must be disabled at the current registrar before the NS change (critical — breaks domain if DNSSEC stays active during NS migration).

---

### 5. Vercel WAF Custom Rules: Deny Mode with Log-First Protocol

**Decision:** Deploy WAF custom rules via `vercel.json` for deny actions (WordPress attack paths: `/wp-login.php`, `/xmlrpc.php`, `/wp-admin/*`, `/wp-content/*`, `/wp-includes/*`, `/.env`, `/config.php`). Deploy rate limiting rules (10 req/60s per IP on `/api/contact` POST and booking form POST) and the Sanity webhook bypass rule via the Vercel Dashboard. All new rules deploy in LOG mode first, then switch to DENY/enforce after at least 1 hour of real traffic observation.

**Rationale:** `vercel.json` supports only `challenge` and `deny` actions — rate limiting, persistent block actions, and OWASP managed ruleset configuration must be done via Dashboard. The log-first protocol prevents false positives from blocking legitimate traffic before the rules are validated. Sanity webhook bypass rule must run before OWASP rules to prevent Sanity's POST body from triggering OWASP XSS/RFI signatures and breaking ISR revalidation.

---

### 6. Rate Limiting: Vercel WAF — Accept Per-Region Limitation

**Decision:** Implement Vercel WAF rate limiting for form endpoints. Accept that counters are per-region (not global) as a known limitation. Complement with the existing honeypot + Resend rate-limit already in Phase 3's contact form as a second layer.

**Rationale:** Per-region rate limiting is sufficient against unsophisticated bots and volumetric abuse. Global rate limiting requires a Redis-backed store (not in scope). The multi-layer approach (WAF rate limit + honeypot + Resend API rate limit) provides adequate defense without adding complexity.

---

### 7. Sanity Webhook Security: HMAC-SHA256 via @sanity/webhook-toolkit

**Decision:** Use `@sanity/webhook-toolkit`'s `isValidSignature()` function for HMAC-SHA256 verification in the Sanity webhook route handler (`app/api/sanity-webhook/route.ts`). Raw request body must be read as text (not JSON) before passing to the signature check. Add Vercel WAF bypass rule for `/api/sanity-webhook` path as belt-and-suspenders.

**Rationale:** `@sanity/webhook-toolkit` handles all edge cases — HMAC-SHA256, timing-safe comparison, header parsing. Never hand-roll HMAC validation. The WAF bypass rule prevents OWASP managed rules from blocking Sanity's POST before the route handler even sees the request. Verify the package version against npm at plan execution time (assumed 1.x).

---

### 8. Search Console: Domain Property (Single Property for All Three Subdomains)

**Decision:** Create a single GSC Domain Property for `proactivsports.com` (no protocol prefix). This covers `hk.proactivsports.com`, `sg.proactivsports.com`, and all variants under the apex automatically. Verify via DNS TXT record in Cloudflare (prepared in Phase 8). Submit three sitemaps after DNS propagation is confirmed.

**Rationale:** A Domain Property is the correct choice for this architecture — one verification covers all subdomains. URL-prefix properties per subdomain would require three separate verifications. This was the Phase 8 preparation; Phase 10 activates it. Sitemaps must only be submitted after DNS resolves to Vercel production (not to `*.vercel.app`).

---

### 9. Cutover Timing and TTL Pre-Lowering

**Decision:** Lower all A/CNAME records at the current DNS provider to 300s TTL at least 24 hours before the planned cutover window. Execute the NS change on a Tuesday–Thursday to avoid weekend incidents. Cutover sequence: (1) set Cloudflare DNS records → (2) change NS at current registrar → (3) wait for propagation → (4) monitor Vercel cert provisioning → (5) trigger production build → (6) run smoke tests at T+30min.

**Rationale:** 300s TTL pre-lowering enables 5-minute DNS rollback if smoke tests fail, instead of waiting 1–24 hours for old TTL expiry. Adding Vercel domains before changing DNS is critical — Vercel uses HTTP-01 ACME challenge and must be able to reach the domain. If DNS still points to the old host when Vercel tries to provision the cert, cert provisioning fails. Tuesday–Thursday is best practice for infrastructure changes; avoids weekend on-call gaps.

---

### 10. DNS Records Manual Audit Before NS Change

**Decision:** Before changing nameservers, perform a manual inventory of all existing DNS records at the current provider (or export the zone file). Verify MX records, SPF, DKIM, DMARC, and any third-party verification TXT records. Recreate all of them in Cloudflare before the NS change executes.

**Rationale:** Cloudflare's automatic DNS record scan is documented to be incomplete — it "is not guaranteed to find all existing DNS records." Missing MX records cause email delivery failure post-cutover. Missing third-party TXT records break external service integrations. The cost of a thorough manual audit upfront is minutes; the cost of missing records post-cutover is email bounces and broken services during launch.

---

### 11. Production Environment Variables: NEXT_PUBLIC_SITE_URL Per Market

**Decision:** Set `NEXT_PUBLIC_SITE_URL` per market (root, HK, SG) in Vercel project → Production environment before the production build that runs at cutover. Verify sitemaps and canonical URLs in the production build output reference `proactivsports.com` domain (not `*.vercel.app`).

**Rationale:** Sitemaps generated against Vercel preview URLs would cause GSC errors and wrong URLs in the sitemap index. This is a known anti-pattern (Pitfall 6 in research). The production env var must be set before the production build — not after.

---

### 12. Vercel Plan: Pro Required Before WAF Configuration

**Decision:** Confirm Vercel project plan before any WAF configuration. If on Hobby plan, upgrade to Pro ($20/user/month) as the first action in Phase 10. Pro plan is required for 40 WAF custom rules, OWASP Core Ruleset, Bot Protection Managed Ruleset, and rate limiting.

**Rationale:** These WAF capabilities are unavailable on Hobby. The Phase 10 security requirements (FOUND-07, CMS-08) cannot be met without Pro. The current plan is unconfirmed (A1 assumption in research) — a HUMAN-ACTION checkpoint must verify and upgrade in Plan 10-01.

---

### 13. Cloudflare SSL/TLS Mode: Full (Strict) as Defensive Config

**Decision:** Set Cloudflare SSL/TLS mode to "Full (strict)" even though gray-cloud DNS-only mode means Cloudflare SSL is not in the traffic path.

**Rationale:** If orange-cloud is ever accidentally enabled (e.g., by a Cloudflare UI operator error), "Full (strict)" mode prevents redirect loops. "Flexible" mode with orange-cloud would cause HTTP→HTTPS→HTTP redirect loops. Setting it to Full (strict) defensively prevents this misconfiguration from becoming a production incident.

---

### 14. Post-Launch Operational Loop: Start Immediately at Cutover

**Decision:** The first blog post per market (`/blog/`) must be live at cutover — not scheduled for "later." The GBP review acquisition email template must be confirmed firing from the booking platform before the Day 90 review. The backlink outreach pipeline (quick-win directories: Sassy Mama HK, Honeycombers, Tickikids SG, Little Day Out) starts in Week 1–2 post-launch.

**Rationale:** Strategy PART 15.4 Weeks 11–13 and PART 15.2 Warning #7 are explicit: thin/absent launch content is a recovery risk. The site must be "compounding from day one" (Phase 10 goal). Day 90 review baselines (GSC, GA4, GBP metrics) are meaningful only if the content cadence started at launch. Deferring the first posts to "after launch" wastes the indexing window.

---

### 15. Smoke Test Artifacts: CUTOVER-RUNBOOK.md and SMOKE-TEST-CHECKLIST.md as Deliverables

**Decision:** Phase 10 produces three planning/operational artifacts as concrete deliverables committed to git:
1. `.planning/phases/10-hosting-dns-cutover-launch/CUTOVER-RUNBOOK.md` — step-by-step execution runbook with exact commands, TTL pre-lowering schedule, rollback steps
2. `.planning/phases/10-hosting-dns-cutover-launch/SMOKE-TEST-CHECKLIST.md` — per-domain manual test matrix for human signoff
3. `.planning/phases/10-hosting-dns-cutover-launch/DNS-RECORDS.md` — exact Cloudflare records to configure (populated after Vercel provides domain CNAME hash)

**Rationale:** Phase 10 is primarily infrastructure configuration and human execution, not code. Vitest covers no new code (middleware tests remain the regression gate). The smoke test checklist and runbook are the primary validation artifacts. They must be in version control so they can be reviewed, updated, and referenced during execution.

---

### 16. 301 Migration (.net) Activation: Vercel.json Redirects Already Prepared in Phase 9

**Decision:** The `.net` URL 301 map built in Phase 9 (in `vercel.json` redirects or middleware) activates automatically when `proactivsports.com` goes live — no Phase 10 code change required. Smoke test must verify a sample of `.net` URLs return 301 to correct `.com` equivalents.

**Rationale:** Phase 9's goal is exactly this — to have the 301 map ready to fire the moment the domain is live. Phase 10 validates it via smoke tests. If redirects exist in `vercel.json`, they are already deployed; if in middleware, the production deploy at cutover activates them. No new code is written in Phase 10 for redirects.

---

### 17. AI Bots Ruleset: Log Mode Initially

**Decision:** Enable the Vercel WAF AI Bots Managed Ruleset in LOG mode (not block mode) at launch. Revisit after 2–4 weeks of real traffic data.

**Rationale:** AI bots (GPTBot, ClaudeBot, PerplexityBot) have mixed strategic value for this project — the strategy doc (PART 10) explicitly targets LLM/AI visibility for the site. Blocking AI crawlers in deny mode at launch could undermine the GEO/LLMO work in Phase 7. Log mode collects data without cutting access; the operator can decide based on traffic volume data whether to challenge or allow specific bots.

---

## Locked Choices

These are non-negotiable and flow directly from the project architecture:

| Choice | Locked By |
|--------|-----------|
| Single Vercel project for all three domains | CLAUDE.md architecture constraint — single Next.js app |
| Cloudflare as DNS provider | FOUND-01, MIG-01 requirements |
| Vercel for hosting (preview + production) | CLAUDE.md stack constraint |
| Gray-cloud DNS-only on all Vercel-pointing records | Vercel officially discourages orange-cloud proxy; cert provisioning requires it |
| DNSSEC must be disabled before NS change | DNS protocol requirement — non-negotiable |
| GSC TXT verification record must stay in Cloudflare DNS permanently | Removing it unverifies the GSC property |
| WAF rules for WordPress attack paths (wp-login.php, xmlrpc.php) | MIG-03 security hardening — legacy `.net` had malware history |
| `vercel.json` WAF deny rules in version control | Provides code-reviewable baseline; Vercel Dashboard alone is undocumented |
| Sitemaps submitted only after DNS propagation confirmed | Google indexes sitemap URLs; pre-cutover submission causes wrong-URL indexing |

---

## Claude's Discretion

Implementation details left to the planner:

- **Plan split and count:** Research suggests 7 plans. Suggested split: (1) Pre-flight HUMAN-ACTION checklist + Cloudflare zone setup + DNS records documentation, (2) Vercel Pro upgrade + three-domain attachment + cert provisioning, (3) Vercel WAF configuration (vercel.json rules + Dashboard rules + log-mode validation), (4) TTL pre-lowering + NS cutover execution + propagation verification, (5) Production build + smoke test execution + GSC verification + sitemap submission, (6) CUTOVER-RUNBOOK.md + SMOKE-TEST-CHECKLIST.md + DNS-RECORDS.md artifacts, (7) Post-launch operational loop bootstrap (first blog posts, GBP review template, backlink outreach kickoff + Day 90 baseline recording).

- **HUMAN-ACTION checkpoints:** Plans 1 and 4 require human action at multiple steps (registrar access, EPP code, Cloudflare Dashboard, Vercel Dashboard, NS change). These cannot be automated and must be explicit HUMAN-ACTION gates in the plan.

- **Exact Vercel CNAME hash:** The `<hash>.vercel-dns-0xx.com` target is project-specific and is shown in the Vercel Dashboard only after domains are added. DNS-RECORDS.md must be populated during Plan 2 execution, not ahead of time.

- **@sanity/webhook-toolkit version:** Verify against npm at plan execution time. The research notes assumed 1.x — confirm actual current version and update the import accordingly.

- **Cloudflare WAF expression syntax for custom rules:** The research provides the vercel.json `"mitigate": { "action": "deny" }` pattern for deny rules. Vercel Dashboard UI rules use the Vercel expression language. The planner should document exact expressions in the plan so they can be reviewed without Dashboard access.

- **Wave 0 test scaffold:** Research identified three test files needed (CUTOVER-RUNBOOK.md, SMOKE-TEST-CHECKLIST.md, DNS-RECORDS.md) — these are docs, not Vitest tests. No new Vitest test files are required for Phase 10.

- **Day 90 review calendar invite:** The planner should include a concrete reminder step to set the calendar event with the baselines recorded at launch.

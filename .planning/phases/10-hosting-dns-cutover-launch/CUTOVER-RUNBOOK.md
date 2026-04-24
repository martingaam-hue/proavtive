# Cutover Runbook — proactivsports.com

## Execution Window
- Planned date: [Tuesday–Thursday — choose mid-week for fastest incident response]
- T-0 target time: [business hours recommended — 09:00–14:00 local time]
- Operator: [name]
- Rollback decision deadline: T+4h (if smoke tests fail, execute rollback before TTLs expire back to original)

---

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
- [ ] NEXT_PUBLIC_SITE_URL set per-market in Vercel project → Production environment:
  - [ ] Root: `https://proactivsports.com`
  - [ ] HK: `https://hk.proactivsports.com`
  - [ ] SG: `https://sg.proactivsports.com`
- [ ] `SANITY_WEBHOOK_SECRET` set in Vercel project → Production environment
- [ ] All Vercel WAF rules deployed and observed in LOG mode on preview
- [ ] First blog post per market drafted and ready to publish at T-0:
  - [ ] HK blog post drafted in Sanity Studio (do not publish yet)
  - [ ] SG blog post drafted in Sanity Studio (do not publish yet)

---

## T-24h: Lower TTLs

Lower all A and CNAME records at the current DNS provider to 300s TTL.
This is essential — short TTLs ensure fast propagation and fast rollback if needed.

```bash
# Verify current TTL before lowering
dig +noall +answer proactivsports.com
dig +noall +answer hk.proactivsports.com
dig +noall +answer sg.proactivsports.com
```

Record current TTL values in DNS-RECORDS.md "Pre-Cutover TTL State" table before making any changes.

- [ ] A record @ lowered to 300s TTL at current provider
- [ ] CNAME hk lowered to 300s TTL at current provider
- [ ] CNAME sg lowered to 300s TTL at current provider
- [ ] MX records lowered to 300s TTL at current provider (for email continuity monitoring)
- [ ] TTL change confirmed propagated (allow 30+ minutes, then verify):
  ```bash
  dig +noall +answer +time=5 @8.8.8.8 proactivsports.com
  # Verify TTL column shows ≤300
  dig +noall +answer +time=5 @1.1.1.1 proactivsports.com
  ```

---

## T-0: Cutover Execution

**Execute steps IN ORDER. Do not proceed to the next step until the current step is confirmed.**

### Step 1 — Set Cloudflare DNS records (all gray cloud / DNS-only)

In Cloudflare Dashboard → DNS → proactivsports.com zone:

| Action | Type  | Name  | Content                            | TTL  | Proxy    |
|--------|-------|-------|------------------------------------|------|----------|
| Add    | A     | @     | <Vercel apex IP from dashboard>    | Auto | DNS only |
| Add    | CNAME | hk    | <hash>.vercel-dns-0xx.com          | Auto | DNS only |
| Add    | CNAME | sg    | <hash>.vercel-dns-0xx.com          | Auto | DNS only |
| Add    | TXT   | @     | google-site-verification=<value>   | Auto | DNS only |
| Verify | MX    | @     | <existing MX records preserved>    | —    | —        |
| Verify | TXT   | @     | v=spf1 ...                         | —    | —        |
| Verify | CNAME | <selector>._domainkey | <DKIM value>       | —    | —        |
| Verify | TXT   | _dmarc | v=DMARC1; ...                     | —    | —        |

- [ ] All Vercel-pointing records added in Cloudflare (DNS-only / gray cloud)
- [ ] Email records verified in Cloudflare zone (MX, SPF, DKIM, DMARC all present)
- [ ] No record is set to orange cloud / proxy mode

### Step 2 — Update NS records at current registrar

Change nameservers at the current domain registrar to Cloudflare's assigned NS pair.
The NS pair was assigned when the Cloudflare zone was created (Plan 10-01 Task 5).

- NS 1: <from DNS-RECORDS.md — assigned by Cloudflare>
- NS 2: <from DNS-RECORDS.md — assigned by Cloudflare>

Log into the current domain registrar → Manage Domain → Nameservers → Custom NS → Enter Cloudflare pair.

- [ ] NS records updated at registrar (exact time: ____________)

### Step 3 — Verify NS propagation

NS propagation typically takes 15 minutes to 2 hours.
Check from multiple resolvers to confirm global propagation.

```bash
# Repeat until Cloudflare NS appears
dig +noall +answer NS proactivsports.com
# Expected: proactivsports.com. 86400 IN NS xxxx.ns.cloudflare.com.

# Check from multiple resolvers
dig +noall +answer +time=5 @8.8.8.8 NS proactivsports.com
dig +noall +answer +time=5 @1.1.1.1 NS proactivsports.com
dig +noall +answer +time=5 @9.9.9.9 NS proactivsports.com
```

- [ ] NS propagation confirmed — Cloudflare NS returned by all three resolvers above

### Step 4 — Monitor Vercel cert provisioning

In Vercel Dashboard → Project → Settings → Domains:
Certificate provisioning typically completes within 5–15 minutes after DNS resolves to Vercel.
Watch for status to change from "Pending Verification" → "Valid Configuration".

- [ ] proactivsports.com — status: "Valid Configuration"
- [ ] hk.proactivsports.com — status: "Valid Configuration"
- [ ] sg.proactivsports.com — status: "Valid Configuration"

Verify certs directly:
```bash
curl -sI https://proactivsports.com/ | head -5
curl -sI https://hk.proactivsports.com/ | head -5
curl -sI https://sg.proactivsports.com/ | head -5
```

- [ ] All three domains return HTTP 200 (not SSL error)

### Step 5 — Trigger production build

Push to main or trigger a manual redeploy in Vercel Dashboard.
This production build reads `NEXT_PUBLIC_SITE_URL` from the production environment,
so sitemaps and canonical URLs will reference `proactivsports.com` (not `*.vercel.app`).

```bash
# Verify from Vercel CLI (optional — can also trigger via Dashboard)
vercel --prod
```

After build completes, verify sitemaps reference correct domain:
```bash
curl -s https://proactivsports.com/sitemap.xml | grep "proactivsports.com" | head -5
# Should return URLs like https://proactivsports.com/... NOT https://*.vercel.app/...
```

- [ ] Production deploy triggered
- [ ] Production deploy completed successfully (green in Vercel Dashboard)
- [ ] Sitemap URLs reference `proactivsports.com` domain (not `vercel.app`)

### Step 6 — Publish first blog post per market

- [ ] HK blog post published via Sanity Studio
- [ ] SG blog post published via Sanity Studio

---

## T+30min: Smoke Tests

See `SMOKE-TEST-CHECKLIST.md` for the complete per-domain test matrix.

- [ ] All smoke tests in SMOKE-TEST-CHECKLIST.md completed
- [ ] Overall result: PASS
- [ ] Smoke test results signed off in SMOKE-TEST-CHECKLIST.md with timestamp

**If any smoke test FAILS:** Do not proceed to T+60min steps. Diagnose immediately.
If the failure is critical and cannot be resolved within 1 hour → execute rollback plan below.

---

## T+60min: Post-Cutover Steps

### Search Console verification and sitemap submission

- [ ] GSC → Add property → Domain → `proactivsports.com`
- [ ] GSC verification: click Verify (TXT record already in Cloudflare — should verify immediately)
- [ ] GSC → Sitemaps → Submit `https://proactivsports.com/sitemap.xml`
- [ ] GSC → Sitemaps → Submit `https://hk.proactivsports.com/sitemap.xml`
- [ ] GSC → Sitemaps → Submit `https://sg.proactivsports.com/sitemap.xml`
- [ ] All three sitemaps show "Success" in GSC (processing may take up to 24h but submission confirms URL is valid)

### WAF rules: switch from LOG to DENY/enforce

After at least 1 hour of real traffic with no false positives in Vercel WAF traffic view:

1. In Vercel Dashboard → Project → Firewall → review traffic log for false positives
2. If no false positives observed:

- [ ] WordPress path block rule (`/wp-login.php`, etc.): verify already in DENY mode (configured in vercel.json as `deny`)
- [ ] OWASP Core Ruleset: switch from LOG to **enforce**
- [ ] Rate limit rules: confirm active (should be enforce-mode from initial configuration)
- [ ] AI Bots Ruleset: remain in LOG mode (revisit at 2–4 week mark — AI crawlers have strategic LLMO value)
- [ ] Bot Protection Managed Ruleset: confirm in challenge mode

### Operational loop bootstrap

- [ ] Day 90 review calendar event created at T+60min with launch baseline metrics recorded:
  - GSC: initial impression/click state for 20 priority queries per market (from GSC)
  - GA4: organic session count at T+24h (check tomorrow)
  - GBP: review count and average per location at launch (check GBP now)
  - CWV: LCP, INP, CLS p75 — note this requires CrUX field data which becomes available 4 weeks post-launch
- [ ] GBP review acquisition email template confirmed firing from booking platform:
  - Trigger a test booking and verify the post-trial review request email is sent
  - Email should contain GBP review link per location
- [ ] Backlink outreach pipeline initiated — Week 1–2 quick wins:
  - [ ] Sassy Mama HK — submit listing
  - [ ] Honeycombers — submit listing
  - [ ] Tickikids SG — submit listing
  - [ ] Little Day Out — submit listing
  - [ ] HK Gymnastics Association directory — submit
  - [ ] Cyberport tenant directory — submit (ProGym Cyberport)
  - [ ] The Hennessy tenant directory — submit (ProGym Wan Chai)

---

## Rollback Plan

Execute IMMEDIATELY if smoke tests show the site is unreachable or critically broken.
**Decision deadline: T+4h.** After T+4h, TTLs at the current provider may have expired caches — rollback becomes more complex.

### If NS change has NOT yet propagated (within first 30–60 minutes):

1. At the current DNS provider: revert A/CNAME records to original values (if they were changed)
2. Propagation: approximately 5 minutes due to 300s TTL pre-lowering
3. At the current registrar: revert NS records back to original NS pair

### If NS change HAS propagated (Cloudflare NS is resolving):

1. In Cloudflare zone DNS: change A record `@` content to the original host's IP
2. Change CNAME `hk` content to original host's CNAME target
3. Change CNAME `sg` content to original host's CNAME target
4. Propagation: approximately 5 minutes (Cloudflare DNS TTL = Auto, resolves to 300s for new records)
5. Monitor: `watch -n 10 'dig +short proactivsports.com'` — watch for IP to revert

### Document failure:

After rollback:
- Record: what step failed, the exact error, diagnostic information gathered
- Diagnose: identify root cause before re-executing
- Fix: address root cause in the codebase or configuration
- Re-execute: return to T-0 when fix is confirmed on a Vercel preview URL

---

## Reference

- `DNS-RECORDS.md` — exact Cloudflare records to configure
- `SMOKE-TEST-CHECKLIST.md` — complete per-domain test matrix at T+30min
- `10-UI-SPEC.md` — environment variables spec, WAF configuration spec
- `10-RESEARCH.md` — architecture patterns, Cloudflare+Vercel interaction model

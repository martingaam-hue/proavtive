---
plan: 05
phase: 10
status: human_action_pending
completed_at: 2026-04-25
executor: orchestrator
---

# Plan 10-05 — Production Build, Smoke Tests, GSC Verify, WAF Enforce — SUMMARY

## Outcome

All 5 tasks are HUMAN-ACTION — this plan executes after DNS is live (Plan 10-04 complete).
No automation possible pre-cutover. Documented as pending per orchestrator protocol.

**PRE-CONDITIONS before executing any task in this plan:**
- Plan 10-04 complete: DNS live, all three domains show "Valid Configuration" in Vercel

## HUMAN-ACTION PENDING Items

### Task 1 — Trigger production build and verify sitemaps

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION — Production Build + Sitemap Verification     ║
╚══════════════════════════════════════════════════════════════╝

After all three Vercel domains show "Valid Configuration":

1. Trigger production build:
   Option A: Push a trivial commit to main to trigger auto-deploy
   Option B: Vercel Dashboard → Deployments → Redeploy (latest → Redeploy to Production)

2. Wait for "Ready" (green) status in Vercel Dashboard → Deployments

3. Verify sitemaps use production URLs (not vercel.app URLs):
   curl -s https://proactivsports.com/sitemap.xml | grep -c "proactivsports.com"
   curl -s https://proactivsports.com/sitemap.xml | grep "vercel.app"  # should return nothing
   curl -s https://hk.proactivsports.com/sitemap.xml | grep -c "hk.proactivsports.com"
   curl -s https://sg.proactivsports.com/sitemap.xml | grep -c "sg.proactivsports.com"

4. If vercel.app URLs appear: check Vercel → Settings → Environment Variables → Production
   NEXT_PUBLIC_SITE_URL must be set to https://proactivsports.com
──────────────────────────────────────────────────────────────
```

### Task 2 — Execute smoke test checklist

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION — Full Smoke Test Execution                    ║
╚══════════════════════════════════════════════════════════════╝

Execute at T+30min after production build is live.
Full checklist in: .planning/phases/10-hosting-dns-cutover-launch/SMOKE-TEST-CHECKLIST.md

Covers:
- Domain resolution (dig commands for all 3 domains)
- SSL/TLS cert verification
- Root, HK, SG homepages + location pages
- Booking form test submissions (WhatsApp GA4 event)
- WAF rules (curl for WordPress paths → expect 403)
- Rate limit test (11 requests in 60s → request 11 should return 429)
- Sanity webhook / ISR (publish change in Studio → page updates within 30s)
- 301 redirects (.net URLs → correct .com equivalents)
- Analytics (GA4 real-time shows events)

Rate limit test script (from SMOKE-TEST-CHECKLIST.md):
  for i in $(seq 1 12); do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
      -H "Content-Type: application/json" \
      -d '{"email":"test@test.com","message":"smoke","name":"Smoke Test","honeypot":""}' \
      "https://proactivsports.com/api/contact")
    echo "Request $i: HTTP $STATUS"
    sleep 2
  done
  # Requests 1-10: expect 200 or 400; Requests 11-12: expect 429

DECISION GATE: Any critical failure (site unreachable, SSL error, booking form broken)
→ execute rollback from CUTOVER-RUNBOOK.md before proceeding.
──────────────────────────────────────────────────────────────
```

### Task 3 — Verify GSC Domain Property and submit sitemaps

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION — GSC Domain Property Verification            ║
╚══════════════════════════════════════════════════════════════╝

Pre-condition: DNS TXT record google-site-verification=<value> is in Cloudflare DNS.

1. Confirm TXT is live:
   dig +short TXT proactivsports.com | grep "google-site-verification"

2. Google Search Console → Add property → Domain → proactivsports.com
3. Click Verify (TXT should already be in Cloudflare from Plan 10-04 Task 2)
   If verification fails: wait 15-30 minutes and retry

4. After Domain Property verified, submit sitemaps:
   GSC → Sitemaps → https://proactivsports.com/sitemap.xml → Submit
   GSC → Sitemaps → https://hk.proactivsports.com/sitemap.xml → Submit
   GSC → Sitemaps → https://sg.proactivsports.com/sitemap.xml → Submit

Note: Domain Property covers all subdomains automatically.
──────────────────────────────────────────────────────────────
```

### Task 4 — Switch WAF OWASP rules from LOG to DENY (T+60min)

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION — WAF OWASP: LOG → DENY (T+60min)            ║
╚══════════════════════════════════════════════════════════════╝

Execute at T+60min (1 hour after production build went live).

1. Vercel Dashboard → Project → Firewall → Traffic view
   Review last 1 hour of WAF events — look for false positives

2. If NO false positives in OWASP LOG entries:
   Firewall → Managed Rulesets → OWASP Core Ruleset → Change to Enforce → Save

3. AI Bots Ruleset: KEEP in LOG mode — do not switch to block.
   Review at 2-4 week mark after launch.

4. Rate limit rules: confirm still Active.

If false positives found: add bypass rule for specific OWASP rule ID + path, then enforce.
──────────────────────────────────────────────────────────────
```

### Task 5 — Publish first blog post per market via Sanity Studio

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION — Publish First Blog Posts (T-0 Step 6)      ║
╚══════════════════════════════════════════════════════════════╝

Pre-condition: Blog posts drafted before cutover day.

1. Open Sanity Studio: https://proactivsports.com/studio
2. Publish HK blog post:
   - Blog → HK posts → open pre-drafted post
   - Verify: title, slug, meta description, OG image with alt text, category/tag
   - Publish → verify appears at https://hk.proactivsports.com/blog/ within 30s
3. Publish SG blog post:
   - Blog → SG posts → open pre-drafted post
   - Same verification → verify at https://sg.proactivsports.com/blog/

Requirements:
- Each post: ≥600 words, substantive editorial, real photography, expert voice
- HK post: targets HK-qualified query (e.g. "gymnastics classes Hong Kong toddlers")
- SG post: targets SG-qualified query (e.g. "kids gym classes Singapore Katong")

If posts not ready: do NOT publish thin placeholder content.
A missing post is better than thin content at launch.
──────────────────────────────────────────────────────────────
```

## Files Modified

None (post-DNS-cutover operations — no code changes).

## Acceptance Criteria Check

- [ ] Production build live with correct production-domain sitemaps — PENDING Task 1
- [ ] All smoke tests PASS (or known minor issues noted) — PENDING Task 2
- [ ] GSC Domain Property verified for proactivsports.com — PENDING Task 3
- [ ] All three sitemaps submitted to GSC — PENDING Task 3
- [ ] OWASP WAF rules switched from LOG to DENY (T+60min) — PENDING Task 4
- [ ] First HK blog post published and live — PENDING Task 5
- [ ] First SG blog post published and live — PENDING Task 5

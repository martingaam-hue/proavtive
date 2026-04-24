# Smoke Test Checklist — proactivsports.com Launch

## Execution
- Executed at: [timestamp]
- Operator: [name]
- Overall result: [PASS | FAIL | PARTIAL]

> **How to use this checklist:**
> Execute every item in order at T+30min after NS cutover.
> A single FAIL that cannot be immediately explained and dismissed halts the process.
> If overall result is FAIL → execute rollback plan in CUTOVER-RUNBOOK.md.

---

## Domain Resolution

```bash
dig +short proactivsports.com
dig +short hk.proactivsports.com
dig +short sg.proactivsports.com
```

- [ ] `dig +short proactivsports.com` returns Vercel IP (not old host IP)
- [ ] `dig +short hk.proactivsports.com` resolves (CNAME to Vercel)
- [ ] `dig +short sg.proactivsports.com` resolves (CNAME to Vercel)

---

## SSL/TLS

```bash
curl -sI https://proactivsports.com/ | head -3
curl -sI https://hk.proactivsports.com/ | head -3
curl -sI https://sg.proactivsports.com/ | head -3
openssl s_client -connect proactivsports.com:443 -servername proactivsports.com </dev/null 2>&1 | grep "Verify return code"
```

- [ ] `curl -sI https://proactivsports.com/` returns 200 (not SSL error)
- [ ] `curl -sI https://hk.proactivsports.com/` returns 200
- [ ] `curl -sI https://sg.proactivsports.com/` returns 200
- [ ] `openssl` cert verify returns `0 (ok)`

---

## Root — proactivsports.com

- [ ] Homepage loads; dual market CTAs (HK / SG) visible above fold
- [ ] `<title>` is correct (not "Phase 1 placeholder" or a Vercel URL)
- [ ] Organization JSON-LD present:
  ```bash
  curl -s https://proactivsports.com/ | grep '"@type":"Organization"'
  ```
- [ ] Sitemap valid and references correct domain:
  ```bash
  curl -s https://proactivsports.com/sitemap.xml | head -20
  # URLs must reference https://proactivsports.com/ NOT https://*.vercel.app/
  ```
- [ ] llms.txt accessible:
  ```bash
  curl -sI https://proactivsports.com/llms.txt
  # Expect: HTTP/2 200
  ```
- [ ] OG preview renders correctly — verify at https://opengraph.xyz or Slack unfurl

---

## HK — hk.proactivsports.com

- [ ] Homepage loads; correct `<h1>` (HK-specific); HK navigation visible
- [ ] `/wan-chai/` location page loads with 200:
  ```bash
  curl -sI https://hk.proactivsports.com/wan-chai/
  ```
- [ ] `/cyberport/` location page loads with 200:
  ```bash
  curl -sI https://hk.proactivsports.com/cyberport/
  ```
- [ ] Book-a-trial form submits successfully; confirmation email arrives at HK inbox (test submission — use a real email address)
- [ ] WhatsApp CTA click fires `whatsapp_click` event in GA4 real-time view (verify in GA4 → Real-time → Event count)
- [ ] GBP Wan Chai map embed renders (visible on /wan-chai/ page)
- [ ] HK sitemap accessible:
  ```bash
  curl -s https://hk.proactivsports.com/sitemap.xml | head -5
  # Expect valid XML with hk.proactivsports.com URLs
  ```

---

## SG — sg.proactivsports.com

- [ ] Homepage loads; correct `<h1>` (SG-specific); SG navigation visible
- [ ] `/katong-point/` location page loads with 200:
  ```bash
  curl -sI https://sg.proactivsports.com/katong-point/
  ```
- [ ] Book-a-trial form submits to SG inbox (test submission — use a real email address)
- [ ] SG sitemap accessible:
  ```bash
  curl -s https://sg.proactivsports.com/sitemap.xml | head -5
  # Expect valid XML with sg.proactivsports.com URLs
  ```

---

## WAF Rules (Security)

```bash
# WordPress attack paths — expect 403 DENY from WAF (vercel.json deny rules)
curl -sI https://proactivsports.com/wp-login.php
curl -sI https://proactivsports.com/xmlrpc.php
curl -sI https://proactivsports.com/wp-admin/
curl -sI https://proactivsports.com/.env
curl -sI https://proactivsports.com/config.php
```

- [ ] `/wp-login.php` returns 403
- [ ] `/xmlrpc.php` returns 403
- [ ] `/wp-admin/` returns 403
- [ ] `/.env` returns 403
- [ ] `/config.php` returns 403

Rate limit test on `/api/contact` — expect 429 on 11th request in a 60s window:

```bash
# Rate limit test — requests 1-10 should return 200 or 400 (Zod validation on test data)
# Requests 11-12 should return 429 (rate limited)
for i in $(seq 1 12); do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","message":"smoke","name":"Smoke Test","honeypot":""}' \
    "https://proactivsports.com/api/contact")
  echo "Request $i: HTTP $STATUS"
  sleep 2
done
```

- [ ] Rate limit test: 429 returned on or before the 12th request within the 60s window

---

## Sanity Webhook / ISR

- [ ] Publish a change in Sanity Studio (e.g., edit homepage hero text by one character → publish)
- [ ] Page updates on production within 30 seconds of Sanity publishing (reload the affected page)
- [ ] Verify webhook is not blocked: Vercel Dashboard → Project → Firewall → Traffic — confirm `/api/sanity-webhook` POST shows as ALLOWED (not blocked by OWASP or other rule)

---

## 301 Redirects (from Phase 9 .net URL map)

```bash
# Root .net redirect — expect 301 to https://proactivsports.com/
curl -sIL https://proactivsports.net/
curl -sIL https://www.proactivsports.net/

# Additional .net sample URLs from Phase 9 redirect map — replace placeholders with actual URLs
curl -sIL https://proactivsports.net/<sample-page-1>
curl -sIL https://proactivsports.net/<sample-page-2>
curl -sIL https://proactivsports.net/<sample-page-3>
# Expect for each: 301 → https://proactivsports.com/<correct-destination>
# Then: 200 on the final destination URL
```

> Note: Actual `.net` URLs are populated from Phase 9's `.net` crawl map. Replace `<sample-page-N>` with real URLs from that map before executing this section.

- [ ] Root `.net` URL returns 301 to `https://proactivsports.com/`
- [ ] `www.proactivsports.net` returns 301 to `https://proactivsports.com/`
- [ ] At least 3 additional `.net` sample URLs from Phase 9 map verified as 301 to correct `.com` destinations

---

## Analytics

- [ ] GA4 real-time view shows active sessions from the smoke test actions (GA4 → Reports → Realtime)
- [ ] `book-a-trial_submitted` event fires in GA4 real-time view from HK test form submission
- [ ] `book-a-trial_submitted` event fires in GA4 real-time view from SG test form submission

---

## Sign-Off

| Checklist section | Result (PASS / FAIL / N/A) | Notes / Issues |
|-------------------|---------------------------|----------------|
| Domain Resolution | | |
| SSL/TLS | | |
| Root (proactivsports.com) | | |
| HK (hk.proactivsports.com) | | |
| SG (sg.proactivsports.com) | | |
| WAF Rules | | |
| Sanity Webhook / ISR | | |
| 301 Redirects | | |
| Analytics | | |

**Overall: [PASS / FAIL]**

**Signed off by:** [name] at [timestamp]

**Proceed to post-cutover steps (T+60min):** [YES / NO]

> If NO: execute rollback plan in CUTOVER-RUNBOOK.md immediately. Do not proceed to T+60min steps with a failing smoke test result.

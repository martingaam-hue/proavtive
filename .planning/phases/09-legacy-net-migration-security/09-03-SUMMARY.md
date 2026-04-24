---
plan: "09-03"
phase: 09
status: complete
commit: "2a1da0a"
---

# Summary: 09-03 Legacy Crawl, URL Inventory, and Redirect Map

## What Was Built

Created the two utility scripts and stub `REDIRECT-MAP.json` for the legacy `.net` migration. The autonomous tasks (T02, T04, T05, T06) are complete; the HUMAN-ACTION tasks (T01 GSB check, T03 crawl) must be completed by the developer before `REDIRECT-MAP.json` entries are finalised.

## Key Files

- `scripts/crawl-net.mjs` — Node.js 22 built-in fetch fallback crawler; outputs `NET-URL-INVENTORY.csv`
- `scripts/verify-redirects.mjs` — smoke-tests all redirect entries in REDIRECT-MAP.json against a Vercel preview URL via explicit `Host:` headers; skips wildcard patterns with notice
- `.planning/phases/09-legacy-net-migration-security/REDIRECT-MAP.json` — 7 stub entries for known likely-trafficked proactivsports.net paths; includes `unmapped_urls[]` for WordPress attack surfaces (wp-login, wp-admin)

## HUMAN-ACTION Checkpoints Still Required

These must be done by the developer before plan 09-04 entries are finalised:

1. **T01 — Google Safe Browsing check:**
   - `https://transparencyreport.google.com/safe-browsing/search?url=proactivsports.net`
   - `https://transparencyreport.google.com/safe-browsing/search?url=hk.proactivsports.net`
   - `https://transparencyreport.google.com/safe-browsing/search?url=sg.proactivsports.net`
   - Update `REDIRECT-MAP.json` `gsb_check_date` and `gsb_status`

2. **T03 — Crawl and classify:**
   - Run `node scripts/crawl-net.mjs` or Screaming Frog
   - Classify URLs by traffic/backlinks
   - Update `REDIRECT-MAP.json` entries accordingly
   - Remove STUB notes from finalised entries

## Verification

- `node --check scripts/crawl-net.mjs` exits 0
- `node --check scripts/verify-redirects.mjs` exits 0
- `REDIRECT-MAP.json` is valid JSON

## Deviations

None from autonomous scope. HUMAN-ACTION tasks deferred to developer per plan design.

## Self-Check: PASSED (autonomous tasks)

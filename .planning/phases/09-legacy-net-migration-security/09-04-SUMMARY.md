---
plan: "09-04"
phase: 09
status: complete
commit: "8d54e54"
---

# Summary: 09-04 vercel.json Redirect Rules and Verification

## What Was Built

Transcribed the `REDIRECT-MAP.json` stub entries into `vercel.json` as a `redirects` array. 7 rules added covering the primary legacy proactivsports.net paths to the new ecosystem. The human-gated verification step (T03 — run `verify-redirects.mjs` against a live Vercel preview) remains a HUMAN-ACTION checkpoint.

## Key Files

- `vercel.json` — added `redirects` array with 7 entries (source + destination + statusCode 301 only)

## Redirect Rules Added

| Source | Destination | Market |
|--------|-------------|--------|
| /gymnastics | https://hk.proactivsports.com/gymnastics/ | hk |
| /holiday-camps | https://hk.proactivsports.com/holiday-camps/ | hk |
| /birthday-parties | https://hk.proactivsports.com/birthday-parties/ | hk |
| /about | https://proactivsports.com/brand/ | root |
| /contact | https://proactivsports.com/contact/ | root |
| /blog | https://hk.proactivsports.com/blog/ | hk |
| /blog/:slug* | https://hk.proactivsports.com/blog/:slug* | hk |

## Verification

- `vercel.json` is valid JSON
- redirect/map counts match (7/7 ✓)
- well within 2,048 Vercel route budget
- all statusCode values are integer 301 (not 308, not permanent:true)
- all destinations start with https://proactivsports.com/ or https://*.proactivsports.com/

## HUMAN-ACTION Checkpoint Still Required

**T03 — run verify-redirects.mjs against Vercel preview:**
```bash
PREVIEW_URL=https://proactive-<sha>.vercel.app \
VERCEL_BYPASS_TOKEN=<token> \
node scripts/verify-redirects.mjs
```
All non-wildcard rules must show PASS before MIG-02 is closed.

## Deviations

Stub entries transcribed as-is from REDIRECT-MAP.json. Entries will be updated after developer completes 09-03 HUMAN-ACTION tasks (GSB check + crawl classification).

## Self-Check: PASSED (autonomous tasks)

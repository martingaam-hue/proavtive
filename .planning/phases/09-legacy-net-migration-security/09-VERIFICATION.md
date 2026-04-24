---
phase: "09"
status: human_needed
verified_at: "2026-04-25"
must_haves_score: "4/4 automated — 5 human-action items pending"
---

# Phase 09 Verification: Legacy .net Migration Prep and Security Hardening

## Automated Must-Haves — ALL PASS

### MIG-03: Dependency Security

| Check | Result |
|-------|--------|
| `pnpm audit --prod --audit-level high` exits 0 locally | ✓ PASS (6 moderate only; all trace to vercel devDep) |
| CI check 6 added to `ci.yml` (Dependency audit step) | ✓ PASS — step present, runs pnpm audit --prod --audit-level high |
| `pnpm.overrides` forces `path-to-regexp >= 8.4.0` | ✓ PASS — confirmed in package.json |
| `pnpm-lock.yaml` regenerated with override applied | ✓ PASS — lockfile consistent, frozen-lockfile exits 0 |

### MIG-03: Security Headers

| Header | Status |
|--------|--------|
| `Strict-Transport-Security` (HSTS, 1yr, includeSubDomains, preload) | ✓ Added to next.config.ts |
| `X-Content-Type-Options: nosniff` | ✓ Added |
| `X-Frame-Options: SAMEORIGIN` | ✓ Added |
| `Referrer-Policy: strict-origin-when-cross-origin` | ✓ Added |
| `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()` | ✓ Added |
| `Content-Security-Policy` (covering GTM, Sanity, Mux, Fonts, Sentry) | ✓ Added via CSP_HEADER constant |
| `X-Robots-Tag: noindex, nofollow` (non-production only — preserved) | ✓ Preserved |
| `pnpm typecheck` exits 0 after change | ✓ PASS |
| `pnpm build` exits 0 after change | ✓ PASS |

### MIG-02: Redirect Infrastructure (Automated Parts)

| Check | Result |
|-------|--------|
| `REDIRECT-MAP.json` exists with 7 stub entries | ✓ PASS |
| `vercel.json` `redirects[]` has 7 entries matching REDIRECT-MAP.json | ✓ PASS (7/7 count match) |
| All `vercel.json` entries use `statusCode: 301` (not 308, not permanent:true) | ✓ PASS |
| All destinations point to proactivsports.com / hk.* / sg.* | ✓ PASS |
| `scripts/crawl-net.mjs` syntax valid | ✓ PASS |
| `scripts/verify-redirects.mjs` syntax valid | ✓ PASS |
| `CUTOVER-RUNBOOK.md` authored with full sections 1–5 | ✓ PASS |

## Human-Action Items Required

These items MUST be completed before Phase 9 success criteria are fully met:

### H-01: Google Safe Browsing Check (09-03-T01)

```
https://transparencyreport.google.com/safe-browsing/search?url=proactivsports.net
https://transparencyreport.google.com/safe-browsing/search?url=hk.proactivsports.net
https://transparencyreport.google.com/safe-browsing/search?url=sg.proactivsports.net
```

Also check `site:hk.proactivsports.net` and `site:sg.proactivsports.net` in Google Search.

Update `REDIRECT-MAP.json` `gsb_check_date` and `gsb_status` (`"clean"` / `"flagged"` / `"unknown"`).

**If flagged:** Do NOT proceed with redirects for that domain until confirmed clean.

### H-02: Crawl proactivsports.net and Finalise REDIRECT-MAP.json (09-03-T03)

```bash
node scripts/crawl-net.mjs --start-url=https://proactivsports.net
# outputs: .planning/phases/09-legacy-net-migration-security/NET-URL-INVENTORY.csv
```

Or use Screaming Frog SEO Spider (free ≤500 URLs). Then:
- Review CSV for URLs with inbound backlinks or GA4 traffic
- Update each entry in `REDIRECT-MAP.json` with real `has_backlinks`/`has_traffic` values
- Remove STUB notes from verified entries
- Move entries with both false to `unmapped_urls[]`

### H-03: Verify Redirects on Vercel Preview (09-04-T03)

```bash
PREVIEW_URL=https://proactive-<sha>.vercel.app \
VERCEL_BYPASS_TOKEN=<token-from-vercel-dashboard> \
node scripts/verify-redirects.mjs
```

Expected: all non-wildcard rules show `PASS`. Wildcard `/blog/:slug*` tested manually with curl.

### H-04: Sanity Token Scope Audit (09-05-T01)

1. Go to `https://www.sanity.io/manage/personal/project/zs77se7r/api`
2. Confirm `SANITY_API_READ_TOKEN` has **Viewer** role (read-only)
3. In Vercel Dashboard → Project → Settings → Environment Variables:
   - Confirm `SANITY_API_READ_TOKEN` present (Viewer-scoped value)
   - Confirm no `SANITY_API_WRITE_TOKEN` or Editor/Admin token without documented justification
   - Confirm `RESEND_API_KEY` present
   - Confirm `NEXT_PUBLIC_SANITY_PROJECT_ID` = `zs77se7r`
   - Confirm `NEXT_PUBLIC_SANITY_DATASET` = `production`

### H-05: Dry-Run CUTOVER-RUNBOOK.md on Preview (09-05-T03)

Work through CUTOVER-RUNBOOK.md Pre-conditions Checklist. Run Section 3 smoke tests against preview URL. Minimum: S-01 through S-09 and S-14 through S-15 must PASS.

## Summary

All automated deliverables are complete and committed. Phase 9's human-action tasks are by design (plans 09-03, 09-04, 09-05 are `autonomous: false`). Once the 5 human-action items above are completed, Phase 9 success criteria are fully met and Phase 10 can begin.

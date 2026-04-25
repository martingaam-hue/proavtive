---
plan: 02
phase: 10
status: partial_human_action_pending
completed_at: 2026-04-25
executor: orchestrator
---

# Plan 10-02 — Vercel Domain Attachment + DNS-RECORDS Population — SUMMARY

## Outcome

Automated tasks complete (Tasks 3 & 4 verified/unblocked). Human-action tasks (1 & 2)
documented as pending — they require Vercel Dashboard access.

## What Was Automated

### Task 3 — vercel.json $schema verification
`vercel.json` already exists at the repo root with:
- `"$schema": "https://openapi.vercel.sh/vercel.json"` — present ✓
- `"redirects": [...]` — Phase 9 .net 301 map preserved ✓
- `"framework": "nextjs"` — build config present ✓
- JSON is syntactically valid ✓

No changes required. The file is already WAF-rule-compatible for Plan 10-03.

### Task 4 — DNS-RECORDS.md
`DNS-RECORDS.md` exists at `.planning/phases/10-hosting-dns-cutover-launch/DNS-RECORDS.md`
with the full placeholder structure from Plan 10-06. Cannot populate Vercel IP/CNAME hash
values until Task 1 (human-action: add domains in Vercel Dashboard) is complete.

## HUMAN-ACTION PENDING Items

### Task 1 — Add three named domains to Vercel project

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION — Add Domains to Vercel Project               ║
╚══════════════════════════════════════════════════════════════╝

Vercel Dashboard → Project → Settings → Domains:

1. Add `proactivsports.com`
   → Note the A record IP shown (likely 76.76.21.21 but verify)

2. Add `hk.proactivsports.com`
   → Note the CNAME target: <hash>.vercel-dns-0xx.com
   → CRITICAL: Record this exact hash — it is project-specific

3. Add `sg.proactivsports.com`
   → Should show same CNAME hash as hk

After adding, update DNS-RECORDS.md:
- Replace <Vercel apex IP from dashboard> with actual IP
- Replace <hash>.vercel-dns-0xx.com placeholders with actual CNAME target
- Update Status from PENDING to CONFIGURED

DO NOT set DNS records in Cloudflare yet — that is Plan 10-04.
──────────────────────────────────────────────────────────────
```

### Task 2 — Set production environment variables in Vercel

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION — Production Env Vars in Vercel               ║
╚══════════════════════════════════════════════════════════════╝

Vercel Dashboard → Project → Settings → Environment Variables
Scope all to Production environment only:

| Variable                  | Value                            |
|---------------------------|----------------------------------|
| NEXT_PUBLIC_SITE_URL      | https://proactivsports.com       |
| SANITY_WEBHOOK_SECRET     | <from 1Password / existing Vercel secrets> |

Note: NEXT_PUBLIC_SITE_URL pattern — check how Phase 7 sitemaps use this variable.
If market-scoped vars exist (NEXT_PUBLIC_HK_SITE_URL etc.), set those too.

SANITY_WEBHOOK_SECRET: Verify already set from Phase 6 webhook config.
If not set: openssl rand -hex 32 → set in Vercel + Sanity Dashboard → Webhooks.

Do NOT trigger a production build yet — that happens in Plan 10-05 after DNS is live.
──────────────────────────────────────────────────────────────
```

## Files Modified

- `vercel.json` — verified present with $schema; no changes needed (already compliant)
- `DNS-RECORDS.md` — structure confirmed; Vercel values pending Task 1 human-action

## Acceptance Criteria Check

- [ ] proactivsports.com added to Vercel project → "Pending Verification" — PENDING Task 1
- [ ] hk.proactivsports.com added → Vercel CNAME hash recorded in DNS-RECORDS.md — PENDING Task 1
- [ ] sg.proactivsports.com added → same CNAME hash confirmed — PENDING Task 1
- [ ] NEXT_PUBLIC_SITE_URL set for Production — PENDING Task 2
- [ ] SANITY_WEBHOOK_SECRET set for Production — PENDING Task 2
- [x] vercel.json has $schema field — DONE (pre-existing)
- [x] vercel.json is valid JSON — DONE
- [x] Phase 9 redirects preserved in vercel.json — DONE

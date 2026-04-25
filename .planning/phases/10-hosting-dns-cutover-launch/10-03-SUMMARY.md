---
plan: 03
phase: 10
status: partial_human_action_pending
completed_at: 2026-04-25
executor: orchestrator
---

# Plan 10-03 — Vercel WAF Configuration — SUMMARY

## Outcome

Automated tasks complete (Tasks 1, 2, 5). Human-action tasks (3, 4) documented
as pending — they require Vercel Dashboard access.

## What Was Automated

### Task 1 — WAF deny rules added to vercel.json
Added `"routes"` array with WAF mitigate rule blocking WordPress attack paths:
- `/wp-login.php`, `/xmlrpc.php`, `/wp-admin/*`, `/wp-content/*`, `/wp-includes/*`
- `/.env`, `/config.php`

The `"routes"` array coexists with the existing `"redirects"` array (Phase 9 .net 301 map preserved exactly). JSON validated as syntactically valid.

Committed: `feat(10): add Vercel WAF deny rules for WordPress attack paths`

### Task 2 — Sanity webhook handler at /api/sanity-webhook
Created `app/api/sanity-webhook/route.ts` with:
- `parseBody()` from `next-sanity/webhook` for HMAC-SHA256 signature verification
- Reads raw body (required for HMAC — not parsed JSON)
- Returns 401 on invalid signature
- On valid: `revalidateTag(body._type)` + slug-specific tag for posts
- Node.js runtime (not edge — revalidateTag fails on edge, per CONTEXT D-12)
- `SANITY_WEBHOOK_SECRET` env var (must be set in Vercel production)

Note: The existing `/api/revalidate/route.ts` (Phase 6) does the same thing.
`/api/sanity-webhook` is the canonical production path for the Vercel WAF bypass
rule (Task 3 human-action). Sanity Dashboard webhook URL should be updated to
`https://proactivsports.com/api/sanity-webhook` after DNS cutover.

Committed: `fix(10): ensure Sanity webhook handler at /api/sanity-webhook with HMAC verification`

### Task 5 — WAF rules verification on preview
WAF deny rules in `vercel.json` are committed and will deploy on next push.
Full curl-based verification requires a live preview URL — to be checked manually
after Vercel deploys the commit. Expected:
- `curl -sI <preview-url>/wp-login.php | head -1` → HTTP/1.1 403
- `curl -sI <preview-url>/xmlrpc.php | head -1` → HTTP/1.1 403
- `curl -sI <preview-url>/.env | head -1` → HTTP/1.1 403
- `curl -sI <preview-url>/` → HTTP/2 200 (or 3xx redirect)

## HUMAN-ACTION PENDING Items

### Task 3 — Vercel Dashboard WAF Rate Limiting Rules

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION — Vercel WAF Rate Limiting (Dashboard)        ║
╚══════════════════════════════════════════════════════════════╝

Vercel Dashboard → Project → Firewall → Rate Limiting:

Rule 1 — Rate Limit: Contact Form
- Condition: Request Path = /api/contact AND Method = POST
- Window: 60 seconds (Fixed Window)
- Requests per IP: 10
- Action: Block (429)
- Status: Active

Rule 2 — Rate Limit: Booking Form
- Verify actual route path (may be /api/contact with different body fields)
- If separate route: /api/book-a-trial POST, same params as Rule 1
- If same /api/contact: Rule 1 covers it — skip Rule 2

Confirm both rules appear as "Active" in Firewall → Rate Limiting list.
──────────────────────────────────────────────────────────────
```

### Task 4 — Vercel Dashboard WAF Managed Rulesets + Sanity Bypass Rule

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION — Vercel WAF Managed Rulesets (Dashboard)     ║
╚══════════════════════════════════════════════════════════════╝

Vercel Dashboard → Project → Firewall:

Step 1 — Sanity Webhook Bypass Rule (MUST be ordered FIRST)
Custom Rules → Add Rule:
- Name: "Bypass: Sanity Webhook"
- Condition: Request Path = /api/sanity-webhook
             AND Header sanity-webhook-signature exists
- Action: Bypass
- DRAG to TOP of custom rules list (must run before OWASP)

Step 2 — OWASP Core Ruleset
Managed Rulesets → OWASP Core Ruleset:
- Enable → Set to LOG mode (not Enforce)
- Switch to Enforce 1 hour after production traffic begins (Plan 10-05 Task 4)

Step 3 — Bot Protection Managed Ruleset
Managed Rulesets → Bot Protection:
- Enable → Action: Challenge

Step 4 — AI Bots Ruleset
Managed Rulesets → AI Bots:
- Enable → LOG mode (do NOT block — AI crawlers have LLMO strategic value from Phase 7)
- Revisit at 2-4 week mark after launch

Confirm: Sanity bypass rule is at position #1 in custom rules list.
──────────────────────────────────────────────────────────────
```

## Files Modified

- `vercel.json` — added `"routes"` WAF deny rules block (Phase 9 redirects preserved)
- `app/api/sanity-webhook/route.ts` — created canonical webhook handler with HMAC verification

## Acceptance Criteria Check

- [x] vercel.json has WAF deny rules for WordPress paths — DONE
- [x] Phase 9 redirects preserved in vercel.json — DONE
- [x] vercel.json is valid JSON — DONE
- [x] app/api/sanity-webhook/route.ts exists with HMAC verification — DONE
- [ ] Rate limit rules configured in Vercel Dashboard — PENDING Task 3
- [ ] Sanity bypass rule at position #1 in custom rules — PENDING Task 4
- [ ] OWASP managed ruleset enabled (LOG mode) — PENDING Task 4
- [ ] Bot Protection enabled — PENDING Task 4
- [ ] AI Bots ruleset enabled (LOG mode) — PENDING Task 4
- [ ] Preview URL curl test confirms 403 for WordPress paths — PENDING (needs live preview)

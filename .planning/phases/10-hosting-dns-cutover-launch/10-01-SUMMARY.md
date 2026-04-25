---
plan: 01
phase: 10
status: human_action_pending
completed_at: 2026-04-25
executor: orchestrator
---

# Plan 10-01 — Pre-flight: Registrar Audit, DNS Export, Cloudflare Zone — SUMMARY

## Outcome

All 5 tasks in this plan are HUMAN-ACTION — no automation possible.
Documented as pending. Phase 10 execution continues per orchestrator protocol.

## HUMAN-ACTION PENDING Items

### Task 1 — Identify current registrar and confirm EPP code access

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION — Registrar Identification                     ║
╚══════════════════════════════════════════════════════════════╝

1. Check current NS records:
   dig +short NS proactivsports.com @8.8.8.8
   (if *.ns.cloudflare.com → NS already on Cloudflare, skip Task 4)

2. Find registrar:
   https://www.whois.com/whois/proactivsports.com
   Or check email for domain registration confirmation

3. Log into registrar, confirm EPP/auth code process is accessible online

4. Record findings in .planning/phases/10-hosting-dns-cutover-launch/DNS-RECORDS.md
   under "Open Audit Items"

BLOCKING: Registrar access required before Plan 10-04 (NS change) can run.
──────────────────────────────────────────────────────────────
```

### Task 2 — Check and disable DNSSEC at current registrar

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION — DNSSEC Check                                 ║
╚══════════════════════════════════════════════════════════════╝

1. Check DNSSEC status:
   dig +dnssec +short DS proactivsports.com @8.8.8.8
   Empty result = INACTIVE (no action needed)
   DS records returned = ACTIVE (must disable before NS change)

2. If ACTIVE: registrar → Domain settings → DNSSEC → Disable
   Wait for DS record TTL to expire before NS change

3. Record in DNS-RECORDS.md:
   - [ ] DNSSEC status: [ACTIVE | INACTIVE]
   - [ ] DNSSEC disabled (if was active)

BLOCKING: NS change cannot proceed until DNSSEC confirmed inactive.
──────────────────────────────────────────────────────────────
```

### Task 3 — Export full DNS zone from current provider

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION — DNS Zone Export                              ║
╚══════════════════════════════════════════════════════════════╝

Run these to capture current state:
  dig +noall +answer proactivsports.com
  dig +noall +answer MX proactivsports.com
  dig +noall +answer TXT proactivsports.com
  dig +noall +answer TXT _dmarc.proactivsports.com

Also export zone file at current DNS provider (all A, CNAME, MX, TXT, NS records).

Populate DNS-RECORDS.md:
- "Email Records" section: MX, SPF, DKIM, DMARC
- "Pre-Cutover TTL State" section: current TTL values for A/CNAME records

CRITICAL: Cloudflare auto-scan is incomplete. Manual export is essential.
Missing MX records = email failure post-cutover.
──────────────────────────────────────────────────────────────
```

### Task 4 — Verify Vercel plan and upgrade to Pro if needed

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION — Vercel Plan Verification                     ║
╚══════════════════════════════════════════════════════════════╝

1. Vercel Dashboard → Team/Account Settings → Plan
2. If Hobby plan → Upgrade to Pro ($20/user/month)
3. Verify WAF tab accessible: Project → Firewall
   (should show "Custom Rules", "Rate Limiting", "Managed Rulesets")

BLOCKING: WAF custom rules (Plan 10-03) require Pro plan.
──────────────────────────────────────────────────────────────
```

### Task 5 — Create Cloudflare zone for proactivsports.com

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION — Cloudflare Zone Creation                     ║
╚══════════════════════════════════════════════════════════════╝

1. Cloudflare Dashboard → Add a domain → proactivsports.com → Free plan
2. Review auto-detected records — they are INCOMPLETE by design
   Manually add any missing records from Task 3 zone export
3. Set ALL Vercel-pointing records to DNS-only (gray cloud — NOT orange cloud)
4. SSL/TLS → Overview → Set to "Full (strict)"
5. Note the two assigned Cloudflare nameservers (format: xxxx.ns.cloudflare.com)
6. Record in DNS-RECORDS.md:
   - Cloudflare zone created date
   - Assigned NS pair
   - SSL/TLS mode confirmed

DO NOT change nameservers at registrar yet — that happens in Plan 10-04.
──────────────────────────────────────────────────────────────
```

## Files Modified

None (no automated code changes in this plan).

## Acceptance Criteria Check

- [ ] Current registrar identified and confirmed accessible — PENDING Task 1
- [ ] DNSSEC status checked; disabled if active — PENDING Task 2
- [ ] Full DNS zone exported; DNS-RECORDS.md Email Records populated — PENDING Task 3
- [ ] Vercel on Pro plan; WAF tab accessible — PENDING Task 4
- [ ] Cloudflare zone created; NS pair recorded in DNS-RECORDS.md — PENDING Task 5

---
plan: 04
phase: 10
status: human_action_pending
completed_at: 2026-04-25
executor: orchestrator
---

# Plan 10-04 — DNS Cutover (TTL pre-lowering + NS change) — SUMMARY

## Outcome

All 4 tasks are HUMAN-ACTION — this is the irreversible DNS cutover plan.
No automation possible. Documented as pending per orchestrator protocol.

**PRE-CONDITIONS before executing any task in this plan:**
- Plans 10-01, 10-02, and 10-03 must all be complete
- Execute T-24h on a Tuesday/Wednesday (cutover T-0 should be Tuesday–Thursday)

## HUMAN-ACTION PENDING Items

### Task 1 — T-24h: Lower TTLs at current DNS provider

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION — T-24h TTL Pre-lowering                      ║
╚══════════════════════════════════════════════════════════════╝

Execute 24 hours before planned cutover window.

1. Verify current TTLs:
   dig +noall +answer proactivsports.com
   dig +noall +answer hk.proactivsports.com
   dig +noall +answer sg.proactivsports.com

2. At current DNS provider, lower to 300s (5 minutes):
   - A record @ (apex) → 300s
   - CNAME hk → 300s
   - CNAME sg → 300s
   - MX records → 300s

3. Wait for original TTL to expire (e.g. if 3600s original TTL, wait 1 hour)

4. Confirm 300s TTL propagated:
   dig +noall +answer +time=5 @8.8.8.8 proactivsports.com
   dig +noall +answer +time=5 @1.1.1.1 proactivsports.com

5. Update DNS-RECORDS.md "Pre-Cutover TTL State" table with timestamps

ROLLBACK: With 300s TTL, any DNS change propagates within 5 minutes.
──────────────────────────────────────────────────────────────
```

### Task 2 — T-0 Step 1: Set Cloudflare DNS records (all gray cloud)

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION — T-0: Set Cloudflare DNS Records             ║
╚══════════════════════════════════════════════════════════════╝

Execute at T-0 (planned cutover window), AFTER Task 1 TTL propagated.

In Cloudflare Dashboard → proactivsports.com zone → DNS → Records:

Add/verify (all MUST be DNS-only / gray cloud — NOT orange cloud):

| Type  | Name   | Content                                      | Proxy    |
|-------|--------|----------------------------------------------|----------|
| A     | @      | <Vercel apex IP from DNS-RECORDS.md>         | DNS only |
| CNAME | hk     | <Vercel CNAME hash from DNS-RECORDS.md>      | DNS only |
| CNAME | sg     | <Vercel CNAME hash from DNS-RECORDS.md>      | DNS only |
| TXT   | @      | google-site-verification=<from Phase 8>      | DNS only |
| MX    | @      | <from zone export in DNS-RECORDS.md>         | DNS only |
| TXT   | @      | v=spf1 ... (SPF from zone export)            | DNS only |
| TXT   | _dmarc | v=DMARC1 ... (DMARC from zone export)        | DNS only |

CRITICAL: Every Vercel record MUST be gray cloud (DNS only icon, not orange).
──────────────────────────────────────────────────────────────
```

### Task 3 — T-0 Step 2: Change nameservers at registrar to Cloudflare

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION — T-0: NS Change at Registrar                 ║
╚══════════════════════════════════════════════════════════════╝

Execute immediately after Task 2 (Cloudflare records set).

1. Log into domain registrar
2. Domain settings → Nameservers → Custom Nameservers
3. Replace current NS with Cloudflare NS pair from DNS-RECORDS.md:
   NS1: <xxxx.ns.cloudflare.com>
   NS2: <yyyy.ns.cloudflare.com>
4. Save and confirm

5. Monitor propagation (repeat every few minutes):
   dig +noall +answer NS proactivsports.com @8.8.8.8
   # Complete when: proactivsports.com. 86400 IN NS xxxx.ns.cloudflare.com.
   dig +short proactivsports.com @8.8.8.8
   # Should return Vercel IP

6. Cloudflare Dashboard will show zone as "Active" once NS propagates.

ROLLBACK WINDOW (4 hours):
- Pre-propagation: revert A/CNAME at current provider (5min propagation due to 300s TTL)
- Post-propagation: change Cloudflare A/CNAME to original values (5min propagation)
──────────────────────────────────────────────────────────────
```

### Task 4 — Monitor Vercel cert provisioning for all three domains

```
╔══════════════════════════════════════════════════════════════╗
║  HUMAN-ACTION — Monitor Vercel SSL Cert Provisioning        ║
╚══════════════════════════════════════════════════════════════╝

After NS propagation confirms DNS resolves to Vercel:

1. Vercel Dashboard → Project → Settings → Domains
   Monitor all three: wait for "Pending Verification" → "Valid Configuration"
   (typically 5-15 minutes after DNS resolves to Vercel)

2. Verify SSL with curl after all three show "Valid Configuration":
   curl -sI https://proactivsports.com/ | head -1
   # Expected: HTTP/2 200 (or 3xx)
   curl -sI https://hk.proactivsports.com/ | head -1
   curl -sI https://sg.proactivsports.com/ | head -1
   openssl s_client -connect proactivsports.com:443 -servername proactivsports.com </dev/null 2>&1 | grep "Verify return code"
   # Expected: Verify return code: 0 (ok)

3. If cert fails after 30 minutes:
   - Check dig resolves to Vercel IP
   - Try removing and re-adding the domain in Vercel Dashboard

Do NOT proceed to Plan 10-05 until all three show "Valid Configuration".
──────────────────────────────────────────────────────────────
```

## Files Modified

None (pure infrastructure operations — no code changes).

## Acceptance Criteria Check

- [ ] TTLs lowered to 300s at T-24h — PENDING Task 1
- [ ] All Cloudflare DNS records set (all gray cloud) — PENDING Task 2
- [ ] NS changed to Cloudflare pair at registrar — PENDING Task 3
- [ ] NS propagation confirmed via dig — PENDING Task 3
- [ ] All three domains show "Valid Configuration" in Vercel — PENDING Task 4
- [ ] SSL verified via curl for all three domains — PENDING Task 4

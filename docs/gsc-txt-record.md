# Google Search Console — Domain Property Verification TXT Record

**Property type:** Domain
**Domain:** proactivsports.com
**Covers:** proactivsports.com + hk.proactivsports.com + sg.proactivsports.com

## TXT Record Value

<!-- HUMAN-ACTION: Replace with the actual value from GSC Admin (Step 2 below) -->
GSC_TXT_VALUE=google-site-verification=<REPLACE_WITH_ACTUAL_VALUE>

## How to retrieve this value

1. Go to https://search.google.com/search-console/
2. Click **Add Property** → choose **Domain** (NOT URL-prefix)
3. Enter: `proactivsports.com` (the root domain, no subdomain, no https://)
4. GSC shows a TXT record value in format:
   `google-site-verification=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
5. Copy the FULL value (including the `google-site-verification=` prefix) and
   paste it above, replacing `<REPLACE_WITH_ACTUAL_VALUE>`
6. **Do NOT click Verify yet** — DNS is not live until Phase 10

## Phase 10 action — paste into Cloudflare DNS

When Phase 10 begins and the domain zone is active in Cloudflare:

| Field | Value |
|-------|-------|
| Type | TXT |
| Name | @ (root, covers all subdomains via Domain property) |
| Content | `google-site-verification=<value from above>` |
| TTL | Auto |

Then return to GSC and click **Verify**.

## Security note

This TXT value is safe to commit to the repository. GSC TXT records are
intentionally public — they prove DNS ownership, not authenticate a service
account. The value has no access capabilities on its own.

## Status

- [ ] Domain property created in GSC
- [ ] TXT value retrieved and pasted above (replace placeholder)
- [ ] File committed to docs/
- [ ] Phase 10: TXT record added to Cloudflare DNS
- [ ] Phase 10: GSC Verify clicked → Domain property verified

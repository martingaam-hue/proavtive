# DNS Records — proactivsports.com (Cloudflare Zone)

## Status: PENDING
## Last updated: 2026-04-25
## Vercel CNAME hash: PENDING (populated during Plan 10-02 after domains added to Vercel project)

---

## Vercel-Pointing Records (all DNS-only / gray cloud)

All records pointing to Vercel MUST be set to **DNS-only (gray cloud)** — NOT the orange-cloud proxy.
Orange-cloud breaks Vercel ACME cert provisioning and degrades Vercel WAF JA3/JA4 fingerprinting.

| Type  | Name                    | Content                              | TTL  | Proxy    | Notes                             |
|-------|-------------------------|--------------------------------------|------|----------|-----------------------------------|
| A     | @                       | <Vercel apex IP from dashboard>      | Auto | DNS only | Apex record — use A, not CNAME    |
| CNAME | hk                      | <hash>.vercel-dns-0xx.com            | Auto | DNS only | Populated in Plan 10-02           |
| CNAME | sg                      | <hash>.vercel-dns-0xx.com            | Auto | DNS only | Populated in Plan 10-02; same hash as hk |

> **Note:** The exact CNAME hash (`<hash>.vercel-dns-0xx.com`) is shown in Vercel Dashboard → Project → Settings → Domains after domains are added. It cannot be pre-computed. Populate this table during Plan 10-02.

---

## Email Records (preserved from current provider — populate via zone audit)

CRITICAL: Cloudflare's automatic DNS scan is incomplete. Manual zone export required (Plan 10-01 Task 3).
Missing MX records = email failure post-cutover.

| Type  | Name                  | Content                          | TTL   | Notes                   |
|-------|-----------------------|----------------------------------|-------|-------------------------|
| MX    | @                     | <value from zone audit>          | 3600  | Preserve — do not omit  |
| TXT   | @                     | v=spf1 ...                       | 3600  | SPF — preserve exactly  |
| CNAME | <selector>._domainkey | <DKIM value from zone audit>     | 3600  | DKIM — preserve exactly |
| TXT   | _dmarc                | v=DMARC1; p=...                  | 3600  | DMARC — preserve        |

> Populate this table during Plan 10-01 Task 3 (zone export).

---

## Verification Records

| Type  | Name | Content                                    | TTL  | Notes                          |
|-------|------|--------------------------------------------|------|--------------------------------|
| TXT   | @    | google-site-verification=<from Phase 8>    | Auto | GSC Domain Property — permanent |

> **IMPORTANT:** Do not remove this TXT record after verification. Removing it unverifies the GSC Domain Property. Populate the verification value from Phase 8 preparation (Plan 10-05 Task 3 adds the property to GSC after NS cutover).

---

## Pre-Cutover TTL State

All A/CNAME records at the current DNS provider must be lowered to 300s TTL at T-24h.
Record current TTL values here before lowering (Plan 10-01 Task 3 and Plan 10-04 Task 1).

| Record              | Current TTL | Target TTL | Lowered at (UTC) | Confirmed via dig |
|---------------------|-------------|------------|------------------|-------------------|
| A @ (proactivsports.com)  |             | 300s       |                  |                   |
| CNAME hk            |             | 300s       |                  |                   |
| CNAME sg            |             | 300s       |                  |                   |
| MX @                |             | 300s       |                  | (email continuity monitoring) |

---

## Open Audit Items

- [ ] Registrar identified and login confirmed (Plan 10-01 Task 1)
- [ ] EPP/auth code process documented (Plan 10-01 Task 1)
- [ ] DNSSEC status confirmed at current registrar: [ACTIVE | INACTIVE] (Plan 10-01 Task 2)
- [ ] DNSSEC disabled at current registrar (required if previously active) (Plan 10-01 Task 2)
- [ ] MX records exported from current provider (Plan 10-01 Task 3)
- [ ] DMARC record confirmed (TXT _dmarc.proactivsports.com) (Plan 10-01 Task 3)
- [ ] Any third-party TXT verifications documented (Mailchimp, Stripe, Google Workspace, etc.) (Plan 10-01 Task 3)
- [ ] Pre-cutover TTL values recorded in table above (Plan 10-01 Task 3)
- [ ] Vercel plan confirmed (Hobby vs Pro) (Plan 10-01 Task 4)
- [ ] Vercel upgraded to Pro if on Hobby plan (Plan 10-01 Task 4)
- [ ] Cloudflare zone created for proactivsports.com (Plan 10-01 Task 5)
- [ ] Cloudflare SSL/TLS mode set to Full (strict) (Plan 10-01 Task 5)
- [ ] Cloudflare assigned NS pair recorded below (Plan 10-01 Task 5)
- [ ] Vercel CNAME hash recorded above (Plan 10-02)
- [ ] All Vercel-Pointing Records added to Cloudflare zone (Plan 10-04 Step 1)
- [ ] Email records in Cloudflare zone match zone export (Plan 10-04 Step 1)

---

## Locked DNS Record Rules

| Rule | Rationale |
|------|-----------|
| All records pointing to Vercel MUST be DNS-only (gray cloud) | Orange-cloud Cloudflare proxy prevents Vercel ACME cert issuance (HTTP-01 challenge fails) and degrades Vercel WAF JA3/JA4 fingerprinting |
| Apex uses A record, not CNAME | CNAME at apex (`@`) is not universally valid; Vercel provides an A record IP for the apex |
| Subdomains `hk` and `sg` use CNAME to Vercel's project-specific hash target | The exact hash (`<hash>.vercel-dns-0xx.com`) is shown in Vercel Dashboard after domains are added — cannot be pre-computed |
| GSC TXT record is permanent | Removing the `google-site-verification=` TXT record unverifies the GSC Domain Property |
| MX, SPF, DKIM, DMARC records must be preserved | Cloudflare's auto-scan is documented as incomplete — manual audit required before NS change |
| DNSSEC must be disabled at current registrar before NS change | DNSSEC validation breaks the domain if left active during nameserver migration |

---

## Cloudflare Zone Info

*Populated during Plan 10-01 Task 5:*

- Cloudflare zone created: _______________
- Assigned NS 1: _______________
- Assigned NS 2: _______________
- SSL/TLS mode: _______________

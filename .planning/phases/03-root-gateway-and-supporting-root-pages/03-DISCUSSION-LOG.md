# Phase 3: Root Gateway and Supporting Root Pages — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in `03-CONTEXT.md` — this log preserves the alternatives considered.

**Date:** 2026-04-23
**Phase:** 03-root-gateway-and-supporting-root-pages
**Areas discussed:** Contact form wiring + WhatsApp (B), Supporting page content scope (A), Hero & leadership visual readiness (C)
**Mode:** Interactive batch (user invoked `/gsd-discuss-phase 3`, then said "choose the best options for me" twice)

---

## Area B — Contact form wiring + WhatsApp

### B1 — HK + SG enquiry inbox addresses

| Option | Description | Selected |
|--------|-------------|----------|
| (a) | Provide both addresses now (paste in reply) | |
| (b) | HUMAN-ACTION checkpoint at execute time — env vars `CONTACT_INBOX_HK` and `CONTACT_INBOX_SG` filled at execute | ✓ |
| (c) | Single shared inbox with `[HK]` / `[SG]` subject tagging | |

**User's choice:** Claude-decided after user said "run what you think is the best options for me"
**Notes:** Matches Phase 2 D-02 pattern (defer user-provided assets to execute-time gate). Decoupling planning from operational setup. Captured as **D-01** in CONTEXT.md.

---

### B2 — WhatsApp click-to-chat numbers

| Option | Description | Selected |
|--------|-------------|----------|
| (a) | Provide HK number now (and confirm SG = `+65 9807 6827` per strategy PART 8.3) | |
| (b) | HUMAN-ACTION checkpoint at execute time — env vars `NEXT_PUBLIC_WHATSAPP_HK` and `NEXT_PUBLIC_WHATSAPP_SG` | ✓ |
| (c) | Ship `/contact/` without WhatsApp at Phase 3 — defer to later phase | |

**User's choice:** Claude-decided
**Notes:** Same defer-to-execute pattern as B1. SG number is known but worth re-confirming at execute. HK unknown. Captured as **D-02**.

---

### B3 — Default market on `/contact/` page

| Option | Description | Selected |
|--------|-------------|----------|
| (a) | Force-pick — show market selector first, form fields appear after pick. RESEARCH-recommended | ✓ |
| (b) | Default to HK (HQ + larger market); SG visitors switch with one click | |
| (c) | Geo-IP via Vercel Edge — auto-pick based on location header | |
| (d) | No routing — single form, both inboxes copied | |

**User's choice:** Claude-decided
**Notes:** Cross-market traffic exists (HK parent shares URL with SG friend); force-pick eliminates wrong-routing risk for one extra click. Captured as **D-03**.

---

### B4 — Spam protection at Phase 3

| Option | Description | Selected |
|--------|-------------|----------|
| (a) | Honeypot only — RESEARCH-recommended; Cloudflare WAF at Phase 10 handles real bot defense | ✓ |
| (b) | Honeypot + Vercel KV rate limit (5/IP/hour) | |
| (c) | Honeypot + invisible reCAPTCHA v3 | |

**User's choice:** Claude-decided
**Notes:** Affluent-parent audience can't tolerate CAPTCHA friction. Cloudflare WAF supersedes need for KV at Phase 10. Captured as **D-04**.

---

### B5 — Resend sender identity

| Option | Description | Selected |
|--------|-------------|----------|
| (a) | `noreply@proactivsports.com` + DKIM/SPF DNS HUMAN-ACTION checkpoint | |
| (b) | `onboarding@resend.dev` at Phase 3, swap to branded sender at Phase 10 | ✓ |
| (c) | Other / user preference | |

**User's choice:** Claude-decided
**Notes:** Phase 3 is preview-only; `proactivsports.com` DNS isn't at Cloudflare until Phase 10. DKIM/SPF setup mid-build is wasted work. Sender swap is one-line config change at Phase 10. Captured as **D-05**.

---

## Area A — Supporting page content scope

### A1 — `/news/` content readiness

| Option | Description | Selected |
|--------|-------------|----------|
| (a) | Press clips ready — paste a list (outlet + headline + URL + date) | |
| (b) | "Coming soon" placeholder; add real items via Sanity in Phase 6 | ✓ |
| (c) | Single static "Press kit" CTA (downloadable PDF / email request) | |

**User's choice:** Claude-decided after user said "choose the best structure for me please"
**Notes:** No clips on hand at Phase 3. Empty `pressItems` array leaves rendering scaffolding in place; Phase 6 swap is one-line GROQ query. Captured as **D-06**.

---

### A2 — `/careers/` content

| Option | Description | Selected |
|--------|-------------|----------|
| (a) | Live coaching openings — paste them (role + market + JD link) | |
| (b) | Evergreen "always hiring great coaches" with open application CTA → `/contact/?subject=job` | ✓ |
| (c) | Defer entirely — stub redirect to `/contact/` at Phase 3, full Careers at Phase 6 | |

**User's choice:** Claude-decided
**Notes:** Strategy PART 12 lists `/careers/` as Tier 1; deserves real copy. Open application CTA drives form fills (the actual conversion goal). Stub redirect would waste SEO surface. Captured as **D-07**.

---

### A3 — `/privacy/` + `/terms/` source

| Option | Description | Selected |
|--------|-------------|----------|
| (a) | Placeholder MDX with prominent "DRAFT — pending legal review" banner; lawyer-drafted at Phase 9/10 | ✓ |
| (b) | iubenda subscription (~€9/mo) + cookie consent JS | |
| (c) | Repurpose existing `.net` legal drafts | |
| (d) | Termly free tier | |

**User's choice:** Claude-decided
**Notes:** Phase 3 is preview-only — no public legal exposure yet. iubenda/Termly add cookie-consent JS → hurts LCP/CLS budget (PROJECT.md non-negotiable). Children's services in HK + SG cross-jurisdiction is non-standard → needs lawyer review anyway. Captured as **D-08**.

---

## Area C — Hero & leadership visual readiness

### C1 — Root gateway hero medium

| Option | Description | Selected |
|--------|-------------|----------|
| (a) | Confirm static photography (inherits Phase 2 D-06; strategy PART 3 §1 specifies editorial photo for root) | ✓ |
| (b) | Override: Mux video on root specifically | |

**User's choice:** Claude-decided
**Notes:** Strategy PART 3 §1 explicitly specifies "full-bleed editorial photography" for root hero. Video is HK/SG homepage territory (PART 4 / PART 5). Static + LCP `priority` is cleanest CWV path. Revisit at Phase 10 only if metrics warrant. Captured as **D-09**.

---

### C2 — Will / Monica / Haikel portrait files

| Option | Description | Selected |
|--------|-------------|----------|
| (a) | Confirm portraits in Phase 2 D-07 curated set; no further action needed | |
| (b) | HUMAN-ACTION checkpoint pattern — execution pauses if leadership portrait files missing | ✓ |
| (c) | Use placeholder silhouettes/initials; swap to real later (RESEARCH explicitly forbids) | |

**User's choice:** Claude-decided
**Notes:** Reuses Phase 2 D-02 fonts pattern. Defers asset audit without blocking planning. Real-photography-only rule preserved. Captured as **D-10**.

---

## Claude's Discretion (delegated areas)

The following implementation details were explicitly delegated to the planner / executor without user discussion:

- Plan grouping strategy (1 plan vs 5 plans for the 7 root pages)
- Wave assignment within Phase 3 (planner assigns based on file overlap)
- Mobile menu pattern (Sheet vs DropdownMenu vs Dialog)
- Market selector visual treatment (button cards vs radio toggle vs tab)
- OG image template variations per page (same template + different titles vs custom backgrounds)
- Footer social link URLs
- Skip-link Tailwind class combo
- Form validation message copy

## Deferred Ideas (captured for future phases)

See `03-CONTEXT.md` `<deferred>` section for the full list. Highlights:

- Cloudflare WAF + bot management — Phase 10
- DKIM/SPF DNS records for branded sender — Phase 10
- Lawyer-drafted PDPA + PDPO compliant Privacy + Terms — Phase 9 / 10
- Mux video hero on root gateway — Phase 10 (only if metrics warrant)
- Live `/careers/` listings via Sanity — Phase 6
- Real `/news/` press list via Sanity — Phase 6
- Multilingual contact form (zh-HK) — POST-03 / v1.5
- iubenda / Termly auto-generated legal — explicitly rejected (do not revisit)

## Research questions resolved

All 8 Open Questions from `03-RESEARCH.md` resolved by this discussion:

| RESEARCH Q | Decision | Maps to |
|------------|----------|---------|
| Q1 — HK + SG inbox emails | HUMAN-ACTION checkpoint at execute | D-01 |
| Q2 — Video hero on root at Phase 3? | No — static photo (inherits D-06) | D-09 |
| Q3 — `/news/` content? | Coming-soon placeholder | D-06 |
| Q4 — `/careers/` listings or evergreen? | Evergreen + open application CTA | D-07 |
| Q5 — Legal pages source? | Placeholder MDX + DRAFT banner | D-08 |
| Q6 — Leadership portraits available? | HUMAN-ACTION checkpoint pattern | D-10 |
| Q7 — WhatsApp numbers per market? | HUMAN-ACTION checkpoint at execute | D-02 |
| Q8 — `/contact/` default market? | Force-pick (no default) | D-03 |

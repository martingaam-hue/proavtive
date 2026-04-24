# Phase 8: Analytics, GBP, NAP — Context

**Gathered:** 2026-04-24
**Status:** Ready for planning

---

## Decisions

### D-01: GA4 Script Injection Point — Single Root Layout Only

**Decision:** Inject `<GoogleAnalytics gaId={gaId} />` (from `@next/third-parties/google`) once in `app/layout.tsx` only — not in `app/hk/layout.tsx` or `app/sg/layout.tsx`.

**Rationale:** `app/layout.tsx` is the shared parent for all three route groups (`app/root/`, `app/hk/`, `app/sg/`). Injecting in child layouts as well creates duplicate tag fires (Pitfall 1 in RESEARCH). The `@next/third-parties` `GoogleAnalytics` component uses `strategy="afterInteractive"` internally — no manual deduplication guard is needed beyond the single injection point. The planner must include a verification step (e.g. Network tab check for a single `gtag.js` load) in Plan 08-01 to confirm this assumption holds.

---

### D-02: Analytics Library — @next/third-parties (No GTM)

**Decision:** Use `@next/third-parties` (`GoogleAnalytics` + `sendGAEvent`) directly. Do NOT introduce Google Tag Manager.

**Rationale:** GTM adds a tag management UI layer that is valuable only if non-engineers will be adding or changing tags independently (e.g. Meta Pixel, Ads conversions). For v1.0 with three known, stable conversion events (`book-a-trial_submitted`, `enquire_submitted`, `whatsapp_click`), GTM is overhead without benefit. `@next/third-parties` is the Vercel/Next.js-official abstraction (ships as a peer dep of next@15.x), handles script deduplication and CSP nonce, and requires zero extra config. GTM can be introduced post-launch if the client wants tag management without deploys.

---

### D-03: Single GA4 Property for All Three Route Groups

**Decision:** One GA4 property with one Web Data Stream for `proactivsports.com`. All three route groups (root, hk, sg) send to the same `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

**Rationale:** Strategy PART 15.2 Warning #2 explicitly warns against fragmenting cross-subdomain user journeys into separate properties. A parent landing on `proactivsports.com`, clicking through to `hk.proactivsports.com`, then to `/blog/` must appear as one session in GA4. GA4's `cookie_domain: 'auto'` default sets the `_ga` cookie on `.proactivsports.com` (the root domain), which all subdomains inherit automatically — no cross-domain linker config is required. Three separate properties would make it impossible to measure the root-to-market conversion funnel.

---

### D-04: Conversion Event Names — Exact Strings as Defined in Phase 8 Requirements

**Decision:** The three conversion event names are `book-a-trial_submitted`, `enquire_submitted`, and `whatsapp_click` — lowercase with hyphens/underscores exactly as specified in SEO-09. Mark these as GA4 "Key Events" in the GA4 Admin UI (renamed from "Conversions" in Feb 2024).

**Rationale:** Consistent event naming is a precondition for Phase 10 reporting. Changing names post-launch would break historical comparison. The research confirms the Feb 2024 GA4 UI rename from "Conversions" to "Key Events" — docs and this phase use "Key Events" to match the current GA4 Admin label.

---

### D-05: Typed Analytics Helper Module at lib/analytics.ts

**Decision:** Create `lib/analytics.ts` with three exported wrapper functions (`trackBookATrial`, `trackEnquiry`, `trackWhatsApp`) that call `sendGAEvent` internally. Call sites import these typed helpers rather than calling `sendGAEvent` directly.

**Rationale:** Prevents event name string drift across the codebase. Makes the three conversion events trivially testable via `vi.mock('@next/third-parties/google')`. Keeps each call site one line (`trackBookATrial('hk', venue)`) rather than the full `sendGAEvent(...)` signature. The module must have `'use client'` at the top (required by `sendGAEvent`), which means it is only imported by client components — consistent with all three identified touchpoints already being client components.

---

### D-06: GA4 Env Var Scoping — Production AND Preview (Not Dev)

**Decision:** Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel for **Production and Preview** environments. Leave Development blank.

**Rationale:** Phase 8 success criterion 1 requires GA4 to receive events on Vercel previews. If the var is set for Production only, preview verification is impossible (Pitfall 2 in RESEARCH). Local dev stays clean (no analytics noise from localhost work). The `{gaId && <GoogleAnalytics>}` guard in `app/layout.tsx` means the script is simply omitted when the var is unset — no errors, no fallbacks needed.

---

### D-07: NAP Source of Truth — lib/venues.ts TypeScript Constants

**Decision:** Create `lib/venues.ts` as the single source of truth for all three venue NAP records. All site outputs that display venue name/address/phone (footers, location pages, JSON-LD schema) must import from this file, not from hardcoded strings in individual components.

**Rationale:** Any two-file divergence (e.g. "Rd" in footer vs "Road" in schema) reduces GBP matching confidence and confuses Google's NAP consistency signals (Pitfall 4 in RESEARCH). `lib/hk-data.ts` already contains partial venue data — `lib/venues.ts` consolidates into one canonical export. The Phase 6 CMS (Sanity Venue documents) will be the SSoT post-Phase 6; until then, `lib/venues.ts` is the authoritative record.

---

### D-08: Cyberport Address — HUMAN-ACTION Gate Before NAP Finalisation

**Decision:** Plan 08-03 (NAP reconciliation) must include a HUMAN-ACTION checkpoint: Martin confirms the exact Cyberport unit address within Cyberport complex before `lib/venues.ts` is committed. The placeholder string must not reach the final commit.

**Rationale:** Strategy PART 8.3 leaves the Cyberport unit address as `[verified Cyberport unit address]` — the exact unit number needs client confirmation. Shipping `lib/venues.ts` with a placeholder address would propagate incorrect NAP to footers, location pages, schema, and the GBP audit (Pitfall 6 in RESEARCH). This is the only HUMAN-ACTION gate that blocks code completion.

---

### D-09: GSC Property Type — Domain Property (Not URL-Prefix)

**Decision:** Create a **Domain property** for `proactivsports.com` in Google Search Console (not three URL-prefix properties). Retrieve the DNS TXT verification value and store it in `docs/gsc-txt-record.md`. Do NOT click Verify in GSC — DNS is not live until Phase 10.

**Rationale:** A Domain property covers `proactivsports.com` AND all subdomains (`hk.*`, `sg.*`) from a single TXT record. Three URL-prefix properties would require three separate verifications, fragment Search Console reporting, and cannot share data in a single interface. DNS TXT verification is the only method accepted for Domain properties. The TXT value is not a secret (it proves domain ownership via DNS, not authenticates a service account), so committing it to `docs/gsc-txt-record.md` is acceptable (confirmed in RESEARCH security section).

---

### D-10: WhatsApp Link Tracking — onClick Handler on Existing RSC Pages

**Decision:** The HK homepage (`app/hk/page.tsx`) contains a `FinalCTASection` function that is currently a Server Component rendering a plain `<a>` tag. To attach `onClick={() => trackWhatsApp('hk')}`, extract `FinalCTASection` (or just the WhatsApp anchor within it) into a small `'use client'` wrapper component. Same pattern applies to `app/root/contact/page.tsx` — the WhatsApp `<a>` elements inside the contact page are already within a client context (the page imports client components).

**Rationale:** `sendGAEvent` requires a browser context (`'use client'`). The HK homepage is an RSC by default. Creating a minimal client boundary (just the WhatsApp button island) preserves the RSC benefits for the rest of the page while enabling the click event. The contact page's WhatsApp links are already in a client-rendered context. The SG homepage is `'use client'` — no special handling needed there.

---

### D-11: GBP Claim Status — HUMAN-ACTION Checkpoint Before Audit

**Decision:** Plan 08-04 (GBP audit) must include a HUMAN-ACTION checkpoint: Martin confirms the claim status for all three GBP listings (ProGym Wan Chai, ProGym Cyberport, Prodigy @ Katong Point) before the audit proceeds. If any listing is unclaimed, claim/verify it first.

**Rationale:** ProGym Cyberport opened August 2025 and may not have a GBP listing at all. The strategy PART 8.3 checklist recommends claiming all three but does not confirm current status. The GBP audit task (strategy PART 8.3 checklist items 1–4) cannot be completed without access to all three listings. No API integration is planned — GBP edits are manual UI tasks.

---

### D-12: GA4 Property Creation — HUMAN-ACTION Prerequisite to Plan 08-01

**Decision:** Before Plan 08-01 code work begins, Martin must: (1) create a GA4 property for ProActiv Sports (or locate an existing one from the legacy `.net` site), (2) add a Web Data Stream for `proactivsports.com`, (3) copy the Measurement ID (format: `G-XXXXXXXXXX`) into Vercel env vars as `NEXT_PUBLIC_GA_MEASUREMENT_ID` for both Production and Preview environments.

**Rationale:** The GA4 Measurement ID has no fallback — code can be written without it, but the Phase 8 success criteria (events appearing in GA4 Realtime) cannot be verified until the property exists and the ID is in Vercel. Making this a prerequisite to Plan 08-01 (rather than a mid-plan blocker) prevents the planner from discovering the dependency mid-execution.

---

### D-13: SG WhatsApp and Booking Form — Wire If Phase 5 Is Complete; Stub If Not

**Decision:** If Phase 5 has shipped the SG booking form and SG contact flow before Phase 8 executes, wire all SG conversion events. If Phase 5 is not yet complete, add `// TODO(phase-8): wire SG book-a-trial_submitted after Phase 5 ships` stub comments at the relevant SG component locations.

**Rationale:** Phase 8 depends on Phase 7 (pages must be final), and Phase 7 depends on Phase 5 (SG pages must exist). However, given the current project state (Phase 5 is in progress), Phase 8 plans should be written to handle both cases. Forcing incomplete SG work blocks Phase 8 unnecessarily; leaving it untracked risks forgetting it.

---

### D-14: No Custom Cookie Logic for Cross-Subdomain Tracking

**Decision:** Do not implement any custom cross-domain linker, cookie sharing script, or `gtag('set', 'linker', {...})` configuration.

**Rationale:** GA4's `cookie_domain: 'auto'` default automatically sets the `_ga` cookie on `.proactivsports.com` (the apex domain), which all subdomains inherit. Cross-domain linker parameters (`_gl`) are only needed when tracking users across different root domains (e.g. `proactivsports.com` → `externalbookingplatform.com`). Since all three route groups share `proactivsports.com` as their root, cookie inheritance is automatic. Adding linker config would be dead code and a maintenance burden.

---

### D-15: Wave 0 Test Scaffolds — Three Test Files, All RED First

**Decision:** Create three Wave-0 RED test files before implementation:
1. `lib/analytics.test.ts` — unit tests for `trackBookATrial`, `trackEnquiry`, `trackWhatsApp` (vi.mock of `sendGAEvent`)
2. `lib/venues.test.ts` — shape assertion: all three venues export required NAP fields
3. `app/hk/book-a-trial/free-assessment/booking-form.analytics.test.tsx` — RTL test confirming `book-a-trial_submitted` fires on successful form submission

**Rationale:** Consistent with the Wave-0-RED-then-GREEN test discipline used in every prior phase. The research identifies exactly these three test files as needed (Validation Architecture section). Manual-only validations (GA4 Realtime, GBP matching) are documented in the phase notes; no automated substitute is appropriate for them.

---

## Locked Choices

These are non-negotiable based on project constraints or earlier phase decisions:

- **Next.js 15 App Router + `@next/third-parties`**: Stack is locked (CLAUDE.md constraints). `@next/third-parties` is the idiomatic analytics approach for this stack.
- **Single GA4 property**: Strategy PART 15.2 Warning #2 is explicit. Three properties are an anti-pattern for this subdomain architecture.
- **Domain property in GSC**: Only DNS TXT verification is accepted for Domain properties. Cloudflare DNS does not exist until Phase 10 — the TXT value must be retrieved now and applied at Phase 10 cutover.
- **`lib/venues.ts` as NAP SSoT**: Pre-Phase-6 Sanity Venue documents do not exist. Hardcoded TypeScript constants are the only viable SSoT until Phase 6 ships CMS content models.
- **No secrets in `docs/gsc-txt-record.md`**: GSC verification TXT values are intentionally public (prove DNS ownership, not authenticate). Committing to `docs/` is confirmed safe.

---

## Claude's Discretion

Implementation details left to the planner and executor:

- **Exact `lib/venues.ts` shape**: The RESEARCH provides a reference structure. The planner should finalise field names, whether `mapEmbedUrl` is a constant or remains env-var-only, and how the SG postal code is formatted — consistent with what `lib/sg-data.ts` and `lib/hk-data.ts` already use.
- **WhatsApp client island extraction**: The exact component boundary (full `FinalCTASection` extracted vs. just the `<a>` tag wrapped) is an implementation detail. Prefer the smallest possible client boundary to preserve RSC benefits.
- **Plan count and split**: RESEARCH suggests two code plans (analytics wiring + venues.ts) and two ops/human plans (GBP audit + GSC TXT retrieval). The planner may combine or split differently based on logical coherence.
- **docs/ directory creation**: `docs/gsc-txt-record.md` assumes a `docs/` directory exists. `docs/phase-0-verification.md` already exists, so the directory is in place — no action needed.
- **Test runner and config**: Vitest 4.x with existing `vitest.config.ts`. The planner should verify `jsdom` environment is configured for RTL tests (already in use by `booking-form.test.tsx`).
- **`.env.example` additions**: Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` after the Sentry block, with a comment matching the style of existing entries (format: `G-XXXXXXXXXX`). Placement is after the Sentry section, before the Sanity section, or as a new Phase 8 block — planner's call.

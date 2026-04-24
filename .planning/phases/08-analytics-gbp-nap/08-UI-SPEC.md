---
phase: 8
slug: analytics-gbp-nap
status: draft
shadcn_initialized: true
preset: style=radix-nova + base-color=neutral + css-variables=true + rsc=true + iconLibrary=lucide
created: 2026-04-24
revised: 2026-04-24
typography_inheritance_exemption: true
typography_inherited_from: 02-UI-SPEC.md §1.6
typography_net_new_sizes: 0
typography_net_new_weights: 0
requirements: [SEO-09, SEO-10]
upstream_inputs:
  - 08-CONTEXT.md (D-01..D-15 locked)
  - 08-RESEARCH.md (5 patterns, 6 pitfalls, validation architecture)
  - 04-UI-SPEC.md (HK booking-form + WhatsApp link patterns instrumented in this phase)
  - 05-UI-SPEC.md (SG booking-form + WhatsApp link patterns — stubbed if Phase 5 not yet complete)
  - 03-UI-SPEC.md (root contact-form + WhatsApp card patterns instrumented in this phase)
  - 02-UI-SPEC.md (token + primitive contract — Phase 8 inherits, does not redefine)
  - PROJECT.md (tech stack constraints; Vercel env discipline)
  - ROADMAP.md Phase 8 goal + success criteria
---

# Phase 8 — UI Design Contract (Analytics Instrumentation and NAP Design)

> **Scope reminder:** Phase 8 introduces **no new pages**, **no new visual components**, and **no new design-system tokens**. It is a *wiring and data-normalisation phase*. The deliverables are:
> 1. `lib/analytics.ts` — typed GA4 event helper module
> 2. `lib/venues.ts` — single canonical NAP source of truth for all three venues
> 3. `<GoogleAnalytics>` injection in `app/layout.tsx` (once, shared root)
> 4. `sendGAEvent` call-site additions to four existing client components
> 5. One WhatsApp client-island extraction in `app/hk/page.tsx`
> 6. `docs/gsc-txt-record.md` — GSC TXT record storage (ops document, not UI)
>
> This contract binds planner and executor on API shapes, event names, component boundaries, and NAP field schema. Deviation requires a Rule 1 correction in the plan SUMMARY.

---

## 0. How this contract is used

| Consumer | What they pull from here |
|----------|--------------------------|
| `gsd-planner` | §2 analytics helper API · §3 event touchpoint map · §4 NAP schema · §5 component boundary rules · §6 env var contract · §7 test map |
| `gsd-executor` | §2 exact function signatures · §3 call-site locations · §4 `lib/venues.ts` field names · §5 RSC island extraction rule |
| `gsd-ui-checker` | §8 quality checklist (no visual regression permitted) · §9 requirement traceability |
| `gsd-ui-auditor` | post-execute diff of `lib/analytics.ts`, `lib/venues.ts`, `app/layout.tsx`, the four instrumented client components, against this contract |

---

## 1. Inheritance from Phases 1–7 — what Phase 8 does NOT redefine

Phase 8 is a pure wiring phase. It inherits all visual contracts without modification.

| Inherited from | Where to find it | What Phase 8 does with it |
|----------------|------------------|---------------------------|
| Brand palette, semantic tokens, type scale, spacing, radius | Phase 2 UI-SPEC §1 | Not touched. Phase 8 adds no visual surface. |
| Phase 2 primitive inventory (Button, Card, etc.) | Phase 2 UI-SPEC §3 | Not touched. |
| HK booking-form client component | Phase 4 UI-SPEC §6 + `app/hk/book-a-trial/free-assessment/booking-form.tsx` | Add `trackBookATrial('hk', venue)` in the `res.ok` success branch only. No visual change. |
| Root contact-form client component | Phase 3 UI-SPEC §6 + `app/root/contact/contact-form.tsx` | Add `trackEnquiry('root')` in the `res.ok` success branch only. No visual change. |
| WhatsApp `<a>` links in HK homepage | Phase 4 UI-SPEC §3 + `app/hk/page.tsx` `FinalCTASection` | Extract the `<a>` (or the `FinalCTASection` function) into a minimal `'use client'` island; add `onClick={() => trackWhatsApp('hk')}`. No visual change. |
| WhatsApp cards on root contact page | Phase 3 UI-SPEC §6 + `app/root/contact/page.tsx` | Already client context — add `onClick={() => trackWhatsApp('root')}` to `wa.me` anchor. No visual change. |
| `lib/hk-data.ts` venue partial data | Phase 4 execution | Superseded by `lib/venues.ts` for all NAP fields. `lib/hk-data.ts` retains programme/coach data; venue NAP migrates to `lib/venues.ts`. |
| Cross-market link discipline (`<a href={env}>` absolute, never `<Link>`) | Phase 1 D-02 | Not affected; WhatsApp links are `<a target="_blank">` — no change to market routing. |

**Phase 8 introduces zero new design tokens, zero new Tailwind utilities, and zero new shadcn primitives.**

---

## 2. Analytics Helper Module — `lib/analytics.ts`

### 2.1 Module-level contract

```
File:       lib/analytics.ts
Directive:  'use client'   ← required; sendGAEvent is browser-only
Exports:    trackBookATrial · trackEnquiry · trackWhatsApp · Market (type)
Imports:    sendGAEvent from '@next/third-parties/google'
Side-effects: none at module load; all side-effects are user-action-triggered
```

The `'use client'` directive makes this module importable **only by client components**. All three call-site components (booking-form, contact-form, WhatsApp islands) are already `'use client'` components — no new client boundaries are created by importing this module.

### 2.2 Exported type

```ts
export type Market = 'hk' | 'sg' | 'root'
```

`Market` is the discriminator for every conversion event. It enables per-market segmentation in the GA4 exploration reports without requiring separate GA4 properties.

### 2.3 Exported function signatures

#### `trackBookATrial`

```ts
export function trackBookATrial(market: Market, venue?: string): void
```

| Parameter | Type | Required | Valid values |
|-----------|------|----------|-------------|
| `market` | `Market` | yes | `'hk'` · `'sg'` |
| `venue` | `string` | no | `'wan-chai'` · `'cyberport'` · `'katong-point'` · `'no-preference'` |

GA4 event fired:
```
event_name:  'book-a-trial_submitted'
parameters:  { market: string, venue: string }
```
- `venue` defaults to `'not-specified'` when undefined (caller passes no venue arg).
- Only called on `res.ok` (HTTP 200 from `/api/contact`). Never on error paths.
- Not called in `useEffect` on mount — only in the form's `handleSubmit` success branch.

#### `trackEnquiry`

```ts
export function trackEnquiry(market: Market): void
```

GA4 event fired:
```
event_name:  'enquire_submitted'
parameters:  { market: string }
```
- Called on `res.ok` in the contact-form submit handler.
- `market` is `'root'` for the root contact form, `'hk'` or `'sg'` when market-specific enquiry forms exist (Phase 5+).

#### `trackWhatsApp`

```ts
export function trackWhatsApp(market: Market): void
```

GA4 event fired:
```
event_name:  'whatsapp_click'
parameters:  { market: string }
```
- Called in `onClick` on every `wa.me` anchor across all three route groups.
- Fires on click (intent signal), not on WhatsApp session open. This is correct — the browser cannot detect whether the WhatsApp app actually opened.

### 2.4 Event name canonical strings

These are the locked event names per D-04. They must appear verbatim in `sendGAEvent` calls. No aliases, no camelCase variants.

| Canonical event name | GA4 Key Event |
|----------------------|---------------|
| `book-a-trial_submitted` | yes — mark in GA4 Admin |
| `enquire_submitted` | yes — mark in GA4 Admin |
| `whatsapp_click` | yes — mark in GA4 Admin |

### 2.5 What the module does NOT do

- Does not track pageviews — GA4 auto-tracks client-side navigation.
- Does not call `window.gtag` directly — uses `sendGAEvent` abstraction only.
- Does not import or reference the GA4 Measurement ID — the ID is injected by `<GoogleAnalytics>` in the layout.
- Does not conditionally no-op based on environment — the `gaId &&` guard in `app/layout.tsx` ensures `GoogleAnalytics` is never mounted in dev, so `sendGAEvent` calls in dev are silent no-ops by default.

---

## 3. Event Touchpoint Map

All existing UI surfaces that receive analytics instrumentation this phase. No new components are created except the minimal WhatsApp island in §3.4.

### 3.1 HK booking form — `book-a-trial_submitted`

| Property | Value |
|----------|-------|
| File | `app/hk/book-a-trial/free-assessment/booking-form.tsx` |
| Component type | `'use client'` (existing) |
| Trigger | `handleSubmit` → `res.ok` branch |
| Call | `trackBookATrial('hk', formData.venue)` |
| Import added | `import { trackBookATrial } from '@/lib/analytics'` |
| Visual change | None |

`formData.venue` is the value of the venue select field (`'wan-chai'` / `'cyberport'` / `'no-preference'`). If the form has no venue field, pass `undefined`.

### 3.2 Root contact form — `enquire_submitted`

| Property | Value |
|----------|-------|
| File | `app/root/contact/contact-form.tsx` |
| Component type | `'use client'` (existing) |
| Trigger | `handleSubmit` → `res.ok` branch |
| Call | `trackEnquiry('root')` |
| Import added | `import { trackEnquiry } from '@/lib/analytics'` |
| Visual change | None |

### 3.3 Root contact page — WhatsApp — `whatsapp_click`

| Property | Value |
|----------|-------|
| File | `app/root/contact/page.tsx` |
| Component type | Already in client context (imports client components) |
| Trigger | `onClick` on the `wa.me` anchor |
| Call | `onClick={() => trackWhatsApp('root')}` |
| Import added | `import { trackWhatsApp } from '@/lib/analytics'` |
| Visual change | None |

### 3.4 HK homepage — WhatsApp island — `whatsapp_click`

| Property | Value |
|----------|-------|
| File | `app/hk/page.tsx` (RSC — cannot attach onClick directly) |
| Component type | RSC (existing) |
| Resolution | Extract the WhatsApp `<a>` (or the `FinalCTASection` that contains it) into a minimal `'use client'` component — prefer the smallest possible client boundary |
| New file | `components/hk/whatsapp-cta.tsx` (or inline in `app/hk/page.tsx` as a named client component before the default export) |
| Trigger | `onClick` on the `wa.me` anchor |
| Call | `onClick={() => trackWhatsApp('hk')}` |
| Visual change | None — same rendered output; the island has identical DOM structure to the current RSC output |

**Client boundary rule:** Extract only the `<a>` element (or the smallest wrapping element that includes it) into the client island. Do not convert the entire `FinalCTASection` or the HK homepage to `'use client'` — RSC streaming benefits apply to the rest of the page.

### 3.5 SG touchpoints — conditional per D-13

If Phase 5 is complete before Phase 8 executes, apply the same pattern to:
- SG booking form (`app/sg/book-a-trial/...`) → `trackBookATrial('sg', venue)`
- SG contact/enquiry form → `trackEnquiry('sg')`
- SG homepage WhatsApp `<a>` → `trackWhatsApp('sg')` (SG homepage is `'use client'` per Phase 5 — no island extraction needed)

If Phase 5 is not yet complete, add the following stub comment at each SG location:
```ts
// TODO(phase-8): wire SG conversion events after Phase 5 ships
```

### 3.6 GA4 script injection — `app/layout.tsx`

| Property | Value |
|----------|-------|
| File | `app/layout.tsx` |
| Position in JSX | After `<body>{children}</body>`, before `</html>` |
| Guard | `{gaId && <GoogleAnalytics gaId={gaId} />}` where `const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID` |
| Import added | `import { GoogleAnalytics } from '@next/third-parties/google'` |
| Visual change | None — `<GoogleAnalytics>` renders no DOM; injects a `<Script>` into `<head>` |

**Single injection point only.** Do NOT add `<GoogleAnalytics>` to `app/hk/layout.tsx` or `app/sg/layout.tsx` — the root layout wraps all three route groups. Duplicate injection = double tag fire (Pitfall 1).

---

## 4. NAP Canonical Venue Schema — `lib/venues.ts`

### 4.1 File contract

```
File:       lib/venues.ts
Directive:  none ('use server' not needed — pure constants, no async)
Exports:    VENUES (as const), VenueKey (type), Venue (type)
Imports:    none (process.env access only)
```

### 4.2 `Venue` type shape

Every venue record must conform to this shape. All fields are required unless marked optional.

```ts
type Venue = {
  // Identity
  name: string              // Full GBP-exact name (e.g. 'ProGym Wan Chai — ProActiv Sports')
  shortName: string         // Display name for UI (e.g. 'ProGym Wan Chai')
  slug: string              // URL slug (e.g. 'wan-chai')

  // Address — every field must match the GBP listing character-for-character
  address: string           // Street address line (e.g. '15/F, The Hennessy Building, 256 Hennessy Road')
  locality: string          // Neighbourhood/district (e.g. 'Wan Chai')
  region: string            // Province/region (e.g. 'Hong Kong Island')
  postalCode?: string       // Required for SG; omit for HK (HK has no postal codes)
  country: 'HK' | 'SG'     // ISO 3166-1 alpha-2

  // Contact
  phone: string             // E.164 format preferred (e.g. '+85228623700')
  whatsapp: string          // Numeric only, no spaces (e.g. '85298076827') — from env var

  // Maps
  mapEmbedUrl: string       // From env var (avoid hardcoding Google Maps embed URLs in source)

  // Meta
  market: 'hk' | 'sg'      // Which route group owns this venue
}
```

### 4.3 VENUES constant structure

```ts
export const VENUES = {
  wanChai:    Venue,   // key: 'wanChai'
  cyberport:  Venue,   // key: 'cyberport'
  katongPoint: Venue,  // key: 'katongPoint'
} as const
```

```ts
export type VenueKey = keyof typeof VENUES   // 'wanChai' | 'cyberport' | 'katongPoint'
```

### 4.4 Canonical NAP values (as of 2026-04-24)

These are the values that must match the GBP listings. They are the source of truth for all site outputs (footers, location pages, JSON-LD schema).

**ProGym Wan Chai:**
```
name:       'ProGym Wan Chai — ProActiv Sports'
shortName:  'ProGym Wan Chai'
address:    '15/F, The Hennessy Building, 256 Hennessy Road'
locality:   'Wan Chai'
region:     'Hong Kong Island'
country:    'HK'
slug:       'wan-chai'
market:     'hk'
```

**ProGym Cyberport:**
```
name:       'ProGym Cyberport — ProActiv Sports'
shortName:  'ProGym Cyberport'
address:    [HUMAN-ACTION: client must confirm exact unit address within Cyberport complex — D-08]
locality:   'Cyberport'
region:     'Pokfulam, Hong Kong Island'
country:    'HK'
slug:       'cyberport'
market:     'hk'
```

**Prodigy @ Katong Point:**
```
name:       'Prodigy by ProActiv Sports'
shortName:  'Prodigy @ Katong Point'
address:    '451 Joo Chiat Road, Level 3'
locality:   'Katong'
region:     'Singapore'
postalCode: '427664'
country:    'SG'
slug:       'katong-point'
market:     'sg'
```

### 4.5 NAP format rules

These rules govern the exact format of every address field. They exist to prevent GBP abbreviation-drift (Pitfall 4 in RESEARCH):

| Rule | Correct | Wrong |
|------|---------|-------|
| Floor prefix | `15/F,` (with comma) | `Floor 15` · `15F` |
| Road suffix | `Road` (not abbreviated) | `Rd` |
| Building name | `The Hennessy Building` (full) | `The Hennessy` |
| SG level | `Level 3` (not `L3` or `3/F`) |  `L3` · `3rd Floor` |
| Phone format | E.164 preferred for schema | No spaces in WhatsApp field |
| No trailing period | `256 Hennessy Road` | `256 Hennessy Road.` |
| Postal code | Numeric only, no `S(427664)` prefix | `S427664` · `S(427664)` |

### 4.6 Phone and WhatsApp sourcing

Phone numbers and WhatsApp numbers are sourced from environment variables — not hardcoded — to allow client updates without code deploys.

```
NEXT_PUBLIC_HK_PHONE           →  wanChai.phone + cyberport.phone (shared line unless client confirms separate)
NEXT_PUBLIC_HK_PHONE_CYBERPORT →  cyberport.phone override (if separate number exists)
NEXT_PUBLIC_HK_WHATSAPP        →  wanChai.whatsapp + cyberport.whatsapp (shared unless client confirms separate)
NEXT_PUBLIC_SG_PHONE           →  katongPoint.phone
NEXT_PUBLIC_SG_WHATSAPP        →  katongPoint.whatsapp
NEXT_PUBLIC_WAN_CHAI_MAP_EMBED   →  wanChai.mapEmbedUrl
NEXT_PUBLIC_CYBERPORT_MAP_EMBED  →  cyberport.mapEmbedUrl
NEXT_PUBLIC_KATONG_MAP_EMBED     →  katongPoint.mapEmbedUrl
```

All of these must be added to `.env.example` with placeholder comments.

### 4.7 Consumer migration

Existing files that hardcode venue NAP strings must be updated to import from `lib/venues.ts`:

| File | What to replace |
|------|----------------|
| `app/hk/wan-chai/page.tsx` | Hardcoded address, phone, location name |
| `app/hk/cyberport/page.tsx` | Hardcoded address, phone, location name |
| `app/hk/layout.tsx` (footer) | Hardcoded HK phone/address if present |
| `app/sg/katong-point/page.tsx` | Hardcoded SG address, phone |
| `app/sg/layout.tsx` (footer) | Hardcoded SG phone/address if present |
| `lib/hk-data.ts` HK_VENUES entries | NAP fields → import from `VENUES.wanChai` / `VENUES.cyberport` |
| Any JSON-LD LocalBusiness helper | `address`, `telephone` props → pull from `VENUES[key]` |

`lib/hk-data.ts` retains all non-NAP data (programme definitions, coach records, blog stubs, FAQ items). Only the NAP fields migrate.

---

## 5. Environment Variable Contract

### 5.1 New vars this phase introduces

| Variable | Scope | Environments | Format | Example |
|----------|-------|-------------|--------|---------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Public (client) | Production + Preview (not Dev) | `G-XXXXXXXXXX` | `G-ABC123DEF4` |

### 5.2 Phone/WhatsApp/map embed vars (`.env.example` additions)

These vars may already exist in `.env.example` from prior phases. If they do, verify their placement. If they don't, add them.

```
# Phase 8 — Venue contact details (set in Vercel env dashboard)
NEXT_PUBLIC_HK_PHONE=
NEXT_PUBLIC_HK_PHONE_CYBERPORT=         # leave blank if same as HK_PHONE
NEXT_PUBLIC_HK_WHATSAPP=
NEXT_PUBLIC_SG_PHONE=
NEXT_PUBLIC_SG_WHATSAPP=

# Phase 8 — Map embed URLs (Google Maps embed src values)
NEXT_PUBLIC_WAN_CHAI_MAP_EMBED=
NEXT_PUBLIC_CYBERPORT_MAP_EMBED=
NEXT_PUBLIC_KATONG_MAP_EMBED=
```

### 5.3 `.env.example` placement

Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` as a new block in `.env.example` after the Sentry section, before the Sanity section:

```
# ── Analytics ──────────────────────────────────────────────────────────────
# GA4 Measurement ID — set for Production AND Preview in Vercel env dashboard
# Format: G-XXXXXXXXXX  (leave blank in local dev — no analytics in dev)
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

---

## 6. GSC TXT Record Document — `docs/gsc-txt-record.md`

This is an ops document, not a UI component. The executor creates it as a template with instructions. Martin fills in the actual TXT value during Phase 8 ops work.

**Location:** `docs/gsc-txt-record.md`

**Contents contract:**
```md
# Google Search Console — Domain Property Verification TXT Record

**Property type:** Domain  
**Domain:** proactivsports.com  
**Covers:** proactivsports.com + hk.proactivsports.com + sg.proactivsports.com

## TXT Record Value

<!-- HUMAN-ACTION: Replace with the actual value from GSC Admin -->
GSC_TXT_VALUE=google-site-verification=<REPLACE_WITH_ACTUAL_VALUE>

## How to retrieve (Phase 8 ops task)

1. Go to https://search.google.com/search-console/
2. Add property → **Domain** (not URL-prefix) → enter: proactivsports.com
3. GSC shows a TXT record value — copy it here
4. Do NOT click Verify yet (DNS is not live until Phase 10)

## Phase 10 action — paste into Cloudflare DNS

- Type: TXT  
- Name: @ (root)  
- Content: <value above, including the google-site-verification= prefix>  
- TTL: Auto  

Then click Verify in GSC.
```

---

## 7. Test Map

Phase 8 Wave-0 test files (all RED before implementation):

| Test file | Tests | Req |
|-----------|-------|-----|
| `lib/analytics.test.ts` | `trackBookATrial` calls `sendGAEvent('event', 'book-a-trial_submitted', { market, venue })` · `trackEnquiry` calls `sendGAEvent('event', 'enquire_submitted', { market })` · `trackWhatsApp` calls `sendGAEvent('event', 'whatsapp_click', { market })` · each function called with wrong event name fails (negative) | SEO-09c,d,e |
| `lib/venues.test.ts` | All three venues export `name`, `shortName`, `address`, `locality`, `region`, `country`, `slug`, `market` · `wanChai.country === 'HK'` · `cyberport.country === 'HK'` · `katongPoint.country === 'SG'` · `katongPoint.postalCode === '427664'` · no venue has a placeholder string in `address` field | SEO-10 |
| `app/hk/book-a-trial/free-assessment/booking-form.analytics.test.tsx` | RTL test: fill form + submit → mock `fetch` returns `{ ok: true }` → assert `sendGAEvent` called with `'book-a-trial_submitted'` + market `'hk'` | SEO-09f |

Manual-only validations (no automated substitute):

| Validation | Method |
|------------|--------|
| GA4 Realtime shows events from Vercel preview URL | GA4 Admin → Realtime → submit test form + click WhatsApp |
| All three conversion events appear as Key Events in GA4 | GA4 Admin → Configure → Key Events |
| GBP listings for all three venues match `lib/venues.ts` exactly | Manual GBP UI audit |
| `docs/gsc-txt-record.md` contains real TXT value (not placeholder) | Human review |

---

## 8. Quality Checklist (no visual regression permitted)

Phase 8 must not introduce any visual regressions. The executor verifies each item before marking the phase complete.

| Check | Pass condition |
|-------|---------------|
| No new Tailwind utilities | `git diff` shows zero changes to `globals.css` or `tailwind.config.ts` |
| No new shadcn primitives | No `npx shadcn` invocations this phase |
| No new design tokens | No new CSS variables in `globals.css` |
| GA4 script fires once per page | Chrome DevTools Network tab → `gtag.js` appears once per navigation |
| No analytics noise in local dev | `pnpm dev` + browser → Network tab → no `google-analytics.com` or `gtag` requests |
| All call-sites are in client components | `grep -r 'trackBookATrial\|trackEnquiry\|trackWhatsApp' app/` → all results in `'use client'` files or files that only render inside a `'use client'` parent |
| `lib/venues.ts` has no placeholder strings | `grep -r 'HUMAN-ACTION\|REPLACE_WITH\|TBD' lib/venues.ts` → zero results (after D-08 gate resolved) |
| Wave-0 tests green | `pnpm test:unit` passes all three test files |
| Full CI green | `pnpm typecheck && pnpm lint && pnpm test:unit && pnpm build` passes |

---

## 9. HUMAN-ACTION Gates

These gates block code completion and must be resolved before Phase 8 is marked done.

| Gate | Decision | Blocks |
|------|----------|--------|
| **D-08**: Martin confirms exact Cyberport unit address with client | Address placeholder must not reach `lib/venues.ts` in final commit | NAP finalisation; GBP audit |
| **D-11**: Martin confirms GBP claim status for all three venues | If unclaimed, claim/verify before audit | GBP audit (plan 08-04) |
| **D-12**: Martin creates GA4 property + Web Data Stream, copies G-XXXXXXXXXX into Vercel env | No code change is blocked, but Realtime verification is impossible without the ID | Phase 8 success criterion 1, 2 |
| **D-09**: Martin adds Domain property in GSC, retrieves TXT value, pastes into `docs/gsc-txt-record.md` | TXT value is stored but NOT submitted (DNS not live until Phase 10) | Phase 10 DNS cutover |

---

## 10. Requirement Traceability

| Requirement | UI surface addressed | Automated test | Manual verification |
|-------------|---------------------|----------------|-------------------|
| SEO-09 — GA4 events fire on previews with cross-subdomain session linking | `app/layout.tsx` `<GoogleAnalytics>` + all four call-sites (§3) | `lib/analytics.test.ts` (event names/params) · `booking-form.analytics.test.tsx` (submit path) | GA4 Realtime on preview URL |
| SEO-09 — `book-a-trial_submitted` conversion event | HK booking form `res.ok` branch (§3.1) + SG stub (§3.5) | `booking-form.analytics.test.tsx` | GA4 Realtime + Key Events UI |
| SEO-09 — `enquire_submitted` conversion event | Root contact form `res.ok` branch (§3.2) | `lib/analytics.test.ts` unit | GA4 Realtime |
| SEO-09 — `whatsapp_click` conversion event | HK homepage WhatsApp island (§3.4) + root contact page (§3.3) | `lib/analytics.test.ts` unit | GA4 Realtime |
| SEO-09 — GSC prepared for Phase 10 | `docs/gsc-txt-record.md` (§6) | n/a (ops document) | Human review of TXT value |
| SEO-10 — Single canonical NAP per venue | `lib/venues.ts` (§4) replaces all hardcoded strings | `lib/venues.test.ts` (shape + no-placeholder assertion) | Manual GBP audit against `lib/venues.ts` |
| SEO-10 — GBP listings audited | Ops task (manual GBP UI) | n/a | GBP fields match `lib/venues.ts` exactly |

---

*Phase 8 UI-SPEC created 2026-04-24. No visual surfaces are new or modified. All changes are instrumentation wiring and data normalisation.*

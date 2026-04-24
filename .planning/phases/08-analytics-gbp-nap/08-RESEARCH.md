# Phase 8: Analytics and GBP / NAP Consistency — Research

**Researched:** 2026-04-24
**Domain:** GA4 cross-subdomain tracking, Next.js 15 analytics, GSC DNS verification, NAP consistency, Google Business Profile management
**Confidence:** HIGH (core analytics implementation), MEDIUM (GBP categories for HK/SG), HIGH (GSC verification approach)

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEO-09 | GA4 + Google Search Console verified across all 3 properties; conversion events for `book-a-trial`, `enquire`, `whatsapp_click` | GA4 via `@next/third-parties` in three route-group layouts; `sendGAEvent` from client components; GSC via single DNS TXT domain property (covers all subdomains) |
| SEO-10 | Google Business Profile listings cross-checked against site NAP for Wan Chai, Cyberport, Katong Point — single canonical NAP per location | YAML source-of-truth file in `lib/` exported for schema, footers, and GBP audit; 3 GBP listing tasks defined per strategy PART 8.3 |

</phase_requirements>

---

## Summary

Phase 8 has two clearly separable tracks. Track A is code: wire GA4 into the three Next.js route-group layouts so conversion events fire on Vercel previews, then add `sendGAEvent` calls at the three identified touchpoints. Track B is human/ops: audit the three GBP listings against the canonical NAP, reconcile any drift, and pre-generate the GSC DNS TXT record so it is ready to paste into Cloudflare at Phase 10 cutover.

The good news: GA4 subdomain tracking for `*.proactivsports.com` is **automatic out of the box** — no cross-domain linker config is needed when all subdomains share the same root domain and the same Measurement ID. The `cookie_domain: 'auto'` default sets the cookie on `.proactivsports.com`, which all three subdomains inherit. The PART 15.2 Warning #2 ("don't let subdomains fragment GA4 tracking") is addressed simply by installing the **same** `NEXT_PUBLIC_GA_MEASUREMENT_ID` in all three route-group layouts and using a single GA4 Web Data Stream. No GTM container complexity is required.

The GSC strategy is to create one **Domain property** for `proactivsports.com` rather than three URL-prefix properties. A single DNS TXT record on the root domain covers all subdomains and all protocols. The TXT value can be retrieved from GSC admin today, stored in the repo as a documented constant, and pasted into Cloudflare at Phase 10 without any Phase 10 research burden.

The NAP source of truth belongs in a `lib/venues.ts` file that the site already partially has (via `lib/hk-data.ts`). Centralising the three venue records in one export eliminates address drift between footers, schema, and GBP listings.

**Primary recommendation:** Use `@next/third-parties/google` (`GoogleAnalytics` component + `sendGAEvent`) in three layouts; single GA4 property; Domain-property GSC; YAML/TypeScript venue constants as NAP source of truth.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| GA4 script injection | Frontend Server (SSR layout) | — | `GoogleAnalytics` component in each route-group layout renders `<Script strategy="afterInteractive">` at the server render boundary |
| Conversion event fire | Browser / Client | — | `sendGAEvent` only works in `'use client'` components; form submit handlers and WhatsApp `onClick` are already client components |
| Cross-subdomain session linking | GA4 Admin config | Browser cookie | `cookie_domain: 'auto'` sets `.proactivsports.com` cookie; configured at the GA4 property/stream level |
| GSC verification | DNS (Cloudflare, Phase 10) | — | Domain property TXT record goes on the DNS zone; no code change needed at Phase 10 |
| NAP source of truth | Codebase (`lib/venues.ts`) | Sanity Venue document (Phase 6 CMS) | Before Phase 6 ships, hardcoded TS constants are the SSoT; Phase 6 migrates to Sanity Venue doc references |
| GBP audit and update | Human/ops (manual) | — | Google Business Profile edits are manual UI tasks; no API integration planned for v1.0 |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@next/third-parties` | `16.2.4` (ships with Next 15.x) | `GoogleAnalytics` component + `sendGAEvent` helper | Official Vercel/Next.js library; handles script deduplication, `afterInteractive` strategy, and dataLayer push automatically |

**Version verification:** `npm view @next/third-parties version` → `16.2.4` (2026-04-24). [VERIFIED: npm registry]

No additional analytics packages needed. `@next/third-parties` is already a peer dep of `next@15.5.15`.

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `window.gtag` direct call | n/a (global injected by GA) | Fallback for edge cases where `sendGAEvent` is called outside the `GoogleAnalytics` component tree | Only if `sendGAEvent` fails in a specific context |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@next/third-parties` | `next/script` with inline gtag init | More control, more boilerplate. `@next/third-parties` is the recommended abstraction; no reason to bypass it |
| `@next/third-parties` | Google Tag Manager container | GTM adds a UI layer for non-engineers to manage tags without deploys. Valuable if the client will be adding Meta Pixel, Ads conversions, etc. post-launch. For v1.0 with known, stable events, GTM is overhead |
| Single GA4 property | Three separate properties (root, hk, sg) | Three properties fragment the user journey cross-subdomain; the strategy explicitly warns against this (PART 15.2 Warning #2). Single property is correct |

**Installation:**
```bash
pnpm add @next/third-parties
```
(Already a peer dep of `next` — may already be resolvable without explicit install; verify.)

---

## Architecture Patterns

### System Architecture Diagram

```
User browser
     │
     ▼
Vercel Edge → route-group layout (RSC)
                    │
                    ├── app/root/layout.tsx  ──┐
                    ├── app/hk/layout.tsx    ──┤── <GoogleAnalytics gaId={GA_ID} />
                    └── app/sg/layout.tsx    ──┘    (all three = same GA_ID)
                                                        │
                                                        ▼
                                              gtag.js loads afterInteractive
                                              cookie_domain: 'auto'
                                              → sets _ga on .proactivsports.com
                                                        │
                            ┌───────────────────────────┤
                            │                           │
                     user navigates              conversion event fires
                   root→hk→hk/blog            (form submit / WA click)
                            │                           │
                     same _ga cookie            sendGAEvent('event', ...)
                     → one session                      │
                            └───────────────────────────┘
                                                        │
                                                        ▼
                                              GA4 Property (single)
                                              Real-time + Conversions dashboard
```

### Recommended Project Structure

New files this phase introduces:

```
lib/
├── venues.ts            # Canonical NAP constants for all 3 venues (SSoT)
├── analytics.ts         # sendGAEvent wrappers for typed conversion events
components/
└── analytics/
    └── ga-provider.tsx  # (optional) client wrapper if per-layout injection needed
docs/
└── gsc-txt-record.md   # Stores the pre-generated GSC TXT value for Phase 10
```

Existing files touched:

```
app/layout.tsx                              # Root layout → add <GoogleAnalytics>
app/hk/layout.tsx                           # HK layout → add <GoogleAnalytics>
app/sg/layout.tsx                           # SG layout → add <GoogleAnalytics>
app/hk/book-a-trial/free-assessment/
    booking-form.tsx                        # Add sendGAEvent on success
app/root/contact/contact-form.tsx           # Add sendGAEvent on success (enquire)
app/hk/page.tsx                             # WhatsApp onClick → sendGAEvent
app/root/contact/page.tsx                   # WhatsApp onClick → sendGAEvent
.env.example                                # Add NEXT_PUBLIC_GA_MEASUREMENT_ID
```

### Pattern 1: GA4 Script Injection in Route-Group Layouts

**What:** Each of the three route-group layouts gets a `<GoogleAnalytics>` component with the shared measurement ID. The component uses `next/script strategy="afterInteractive"` internally, so it does not block SSR.

**When to use:** Once per layout hierarchy. The root `app/layout.tsx` wraps all three groups; however because this project's three route groups each have their own layout *below* the root layout, the injection can go in any of three places. **Preferred approach:** inject in the root `app/layout.tsx` only (it wraps all routes including root, hk, sg), so there is a single injection point.

**Example:**
```tsx
// Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/third-party-libraries.mdx
// [VERIFIED: Context7 / Next.js official docs]
import { GoogleAnalytics } from '@next/third-parties/google'

// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  return (
    <html lang="en">
      <body>{children}</body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  )
}
```

The `gaId &&` guard means: no GA script loads in local dev (where `NEXT_PUBLIC_GA_MEASUREMENT_ID` is unset in `.env.local`), but it loads on every Vercel preview and production deploy (where the var is set). This matches the VERCEL_ENV-based gating pattern already used by Sentry in this codebase.

### Pattern 2: Typed Conversion Event Helper

**What:** A thin `lib/analytics.ts` module exports typed wrapper functions so call sites don't repeat the raw event name strings.

**When to use:** Whenever a conversion event needs to fire. Keeps event names consistent and testable.

**Example:**
```ts
// Source: Next.js docs sendGAEvent pattern — adapted
// [VERIFIED: Context7 / Next.js official docs]
'use client'
import { sendGAEvent } from '@next/third-parties/google'

export type Market = 'hk' | 'sg' | 'root'

export function trackBookATrial(market: Market, venue?: string) {
  sendGAEvent('event', 'book-a-trial_submitted', {
    market,
    venue: venue ?? 'not-specified',
  })
}

export function trackEnquiry(market: Market) {
  sendGAEvent('event', 'enquire_submitted', { market })
}

export function trackWhatsApp(market: Market) {
  sendGAEvent('event', 'whatsapp_click', { market })
}
```

### Pattern 3: Conversion Event Wiring in Existing Client Components

**What:** The three conversion touchpoints already exist as client components. Add the event call in the success branch and onClick handler.

**Touchpoints identified in codebase:**

| Component | Event | Location in Code |
|-----------|-------|-----------------|
| `booking-form.tsx` (HK) | `book-a-trial_submitted` | Line ~105: `if (res.ok) { setStatus("success"); }` — add `trackBookATrial('hk', venue)` here |
| `contact-form.tsx` (root/SG) | `enquire_submitted` | On `res.ok` success path |
| WhatsApp `<a>` links | `whatsapp_click` | `onClick` handler on the `wa.me` anchor in `hk/page.tsx`, `root/contact/page.tsx`, and SG equivalents |

**Note:** SG booking form and enquiry forms are Phase 5 work. If Phase 5 is complete before Phase 8, wire all SG forms too. If not, wire them as stubs with a `TODO` comment.

**Example for WhatsApp:**
```tsx
// 'use client' component — WhatsApp link
<a
  href={`https://wa.me/${sanitisedWhatsapp}...`}
  onClick={() => trackWhatsApp('hk')}
  target="_blank"
  rel="noopener noreferrer"
>
  Chat on WhatsApp
</a>
```

### Pattern 4: NAP Canonical Venue Constants

**What:** A single `lib/venues.ts` export that is the single source of truth for all three venue records. Site footers, location pages, and JSON-LD schema all import from here. The GBP audit verifies the GBP matches these constants exactly.

**When to use:** Any time venue address, phone, or name is rendered. Replace all hardcoded strings in existing location pages.

**Example:**
```ts
// lib/venues.ts — [ASSUMED] pattern; verified against strategy PART 8.3 NAP data
export const VENUES = {
  wanChai: {
    name: 'ProGym Wan Chai — ProActiv Sports',
    shortName: 'ProGym Wan Chai',
    address: '15/F, The Hennessy Building, 256 Hennessy Road',
    locality: 'Wan Chai',
    region: 'Hong Kong Island',
    country: 'HK',
    phone: process.env.NEXT_PUBLIC_HK_PHONE ?? '',
    whatsapp: process.env.NEXT_PUBLIC_HK_WHATSAPP ?? '',
    mapEmbedUrl: process.env.NEXT_PUBLIC_WAN_CHAI_MAP_EMBED ?? '',
    slug: 'wan-chai',
  },
  cyberport: {
    name: 'ProGym Cyberport — ProActiv Sports',
    shortName: 'ProGym Cyberport',
    address: '[HUMAN-ACTION: verify exact unit address with client]',
    locality: 'Cyberport',
    region: 'Pokfulam, Hong Kong Island',
    country: 'HK',
    phone: process.env.NEXT_PUBLIC_HK_PHONE_CYBERPORT ?? process.env.NEXT_PUBLIC_HK_PHONE ?? '',
    whatsapp: process.env.NEXT_PUBLIC_HK_WHATSAPP ?? '',
    mapEmbedUrl: process.env.NEXT_PUBLIC_CYBERPORT_MAP_EMBED ?? '',
    slug: 'cyberport',
  },
  katongPoint: {
    name: 'Prodigy by ProActiv Sports',
    shortName: 'Prodigy @ Katong Point',
    address: '451 Joo Chiat Road, Level 3',
    locality: 'Katong Point',
    region: 'Singapore',
    postalCode: '427664',
    country: 'SG',
    phone: '+6598076827',   // strategy PART 8.3 — verified
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_SG ?? '',
    mapEmbedUrl: process.env.NEXT_PUBLIC_KATONG_MAP_EMBED ?? '',
    slug: 'katong-point',
  },
} as const
```

### Pattern 5: GSC Domain Property — DNS TXT Pre-Generation

**What:** A Domain property in Google Search Console covers `proactivsports.com` AND all subdomains (`hk.*`, `sg.*`) from a single TXT record. The TXT value is retrieved from GSC Admin today and stored in `docs/gsc-txt-record.md`. At Phase 10, it is pasted verbatim into Cloudflare DNS.

**Process:**
1. Go to [Google Search Console](https://search.google.com/search-console/) → Add Property → Domain → `proactivsports.com`
2. GSC shows: `google-site-verification=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
3. Copy this value into `docs/gsc-txt-record.md` with instructions for Phase 10
4. Do NOT click Verify yet (DNS zone is not live)

**Important:** A Domain property requires DNS verification — it is the ONLY method accepted. URL-prefix properties can use HTML file or meta tag, but those are per-subdomain only. [VERIFIED: Google Search Console Help docs, cross-checked with multiple sources]

### Anti-Patterns to Avoid

- **Three separate GA4 properties:** Fragments cross-subdomain user journeys; contradicts strategy PART 15.2 Warning #2.
- **Injecting `<GoogleAnalytics>` in all three route-group layouts:** Creates triple tag fire when all three layouts are nested (root → hk/sg). Inject once in the top-level `app/layout.tsx` only.
- **Sending pageview events manually with `sendGAEvent`:** GA4 tracks client-side navigation automatically. Manual pageview events create duplicates. Only send custom conversion events.
- **Hardcoding NAP strings in multiple files:** Any drift (trailing period, abbreviated "Rd" vs "Road") between JSON-LD schema and footer text invalidates NAP consistency and confuses GBP matching.
- **Verifying GSC as URL-prefix properties for each subdomain:** Three separate URL-prefix properties require three separate verifications and can't share data in the same Search Console interface.
- **Firing `sendGAEvent` in a Server Component:** `sendGAEvent` imports from `'@next/third-parties/google'` and calls into the window object — it requires `'use client'`. All three conversion touchpoints (booking-form, contact-form, WhatsApp links) are already client components.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| GA4 script injection | Custom `<Script>` with raw gtag init | `@next/third-parties` `GoogleAnalytics` | Handles deduplication, CSP nonce, strategy selection; Vercel-maintained |
| Cross-subdomain tracking | Custom cookie sharing logic | GA4 `cookie_domain: 'auto'` default | GA4 sets `.proactivsports.com` automatically; no code needed |
| Event validation | Custom event name enum | GA4 DebugView + GA4 Realtime | Use GA4's own debug tools; don't build a separate validation layer |
| NAP audit | Custom scraper | Manual GBP UI audit against `lib/venues.ts` | 3 venues = 3 GBP listings; API overkill at this scale |

**Key insight:** For three venues and a single GA4 property, the operational overhead of GTM containers, custom event validators, and API-driven GBP management is disproportionate. Phase 8 should be lean: install the library, wire the events, fix the data.

---

## Runtime State Inventory

> Phase 8 is not a rename/refactor phase, but it involves wiring new runtime state (GA4 events, GSC property). No existing stored data requires migration.

| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| Stored data | No analytics DB; GA4 property not yet created | Create GA4 property + Web Data Stream (HUMAN-ACTION) |
| Live service config | No existing GA4 or GSC properties verified | Create and configure both (HUMAN-ACTION) |
| OS-registered state | None | None |
| Secrets/env vars | `NEXT_PUBLIC_GA_MEASUREMENT_ID` does not exist in `.env.example` | Add to `.env.example` + Vercel env dashboard |
| Build artifacts | No analytics code in bundle yet | New code via this phase |

---

## Common Pitfalls

### Pitfall 1: GoogleAnalytics Injected Multiple Times (Tag Deduplication)

**What goes wrong:** If `<GoogleAnalytics gaId={...}>` appears in both `app/layout.tsx` AND in a nested layout (e.g., `app/hk/layout.tsx`), the GA4 script fires twice per page load, doubling all event counts.

**Why it happens:** The root `app/layout.tsx` wraps all route groups. Any `<GoogleAnalytics>` in a child layout is additive, not replacing.

**How to avoid:** Add `<GoogleAnalytics>` **only** in `app/layout.tsx`. Confirm by checking the Network tab in Chrome DevTools — `gtag.js` should appear once per page load.

**Warning signs:** GA4 Realtime shows duplicate `page_view` events per navigation.

### Pitfall 2: GA4 Measurement ID in Wrong Environment Scope

**What goes wrong:** `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set in `Production` environment only on Vercel. Vercel preview deployments don't inherit it → previews have no analytics → Phase 8 success criterion 1 ("GA4 property receives events from Vercel preview") cannot be verified.

**Why it happens:** Vercel allows per-environment env vars (Production / Preview / Development). If the admin adds the var only to Production, Preview builds compile with an undefined value.

**How to avoid:** In the Vercel dashboard, set `NEXT_PUBLIC_GA_MEASUREMENT_ID` for **both** Production and Preview environments. Development can be left blank (intentional — no analytics in local dev).

**Warning signs:** Preview deployment loads correctly but GA4 Realtime shows no activity from the preview URL.

### Pitfall 3: sendGAEvent Before GoogleAnalytics Component Mounts

**What goes wrong:** A conversion event fires on page load (e.g., in a `useEffect`) before the GA4 script has loaded. The event is lost.

**Why it happens:** `GoogleAnalytics` uses `strategy="afterInteractive"` — the script loads after hydration, not at the same time as the component mounting.

**How to avoid:** Only call `sendGAEvent` in response to user actions (form submits, clicks), not in `useEffect` on mount. For the three identified conversion events (`book-a-trial_submitted`, `enquire_submitted`, `whatsapp_click`), all are user-action-triggered. No `useEffect` needed.

**Warning signs:** Events fire in dev console but not in GA4 Realtime.

### Pitfall 4: NAP Abbreviation Drift Between Site and GBP

**What goes wrong:** The site footer shows "256 Hennessy Rd" but the GBP listing shows "256 Hennessy Road". Google cross-references these. Abbreviation drift reduces confidence signal.

**Why it happens:** Different people update different systems without a documented canonical format.

**How to avoid:** `lib/venues.ts` is the canonical source. All site outputs reference it. GBP fields are audited to match exactly — same abbreviation style, same punctuation, no trailing period, same floor format ("15/F" not "Floor 15").

**Warning signs:** Moz Local or BrightLocal inconsistency reports; GBP "suggested edit" notifications from Google.

### Pitfall 5: GSC Verification Timing — Domain Property Unavailable Until Phase 10

**What goes wrong:** Someone creates a URL-prefix GSC property (`https://hk.proactivsports.com/`) during Phase 8 verification prep, then at Phase 10 discovers it needs a separate per-subdomain verification and misses the Domain property option.

**Why it happens:** URL-prefix is the default option in the GSC "Add property" dialog. Domain property is the less prominent option but far superior for this use case.

**How to avoid:** Plan documents clearly: create a **Domain property** for `proactivsports.com` (not URL-prefix). Retrieve the TXT value but do NOT submit verification (DNS not live). Record TXT value in `docs/gsc-txt-record.md` for Phase 10.

**Warning signs:** GSC shows three URL-prefix properties instead of one domain property.

### Pitfall 6: Cyberport Address Incomplete

**What goes wrong:** The canonical Cyberport address is `[HUMAN-ACTION: verify with client]` in `lib/venues.ts`. If Phase 8 ships without the real address, NAP is incomplete on the site, and the GBP audit cannot verify consistency.

**Why it happens:** Strategy PART 8.3 has `[verified Cyberport unit address]` as a placeholder — the exact unit number within Cyberport needs client confirmation.

**How to avoid:** Phase 8 plan must include a HUMAN-ACTION gate: Martin confirms the Cyberport full address before NAP constants are finalised. Add the gate explicitly in Plan 08-03 (NAP reconciliation task).

**Warning signs:** `lib/venues.ts` still contains the placeholder string at phase completion.

---

## Code Examples

Verified patterns from official sources:

### Install and Global Inject

```tsx
// Source: https://nextjs.org/docs/app/guides/third-party-libraries
// [VERIFIED: Context7 @next/third-parties docs]

// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  return (
    <html lang="en" className="...">
      <body>{children}</body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  )
}
```

### Custom Conversion Event from Client Component

```tsx
// Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/third-party-libraries.mdx
// [VERIFIED: Context7 / Next.js official docs]
'use client'
import { sendGAEvent } from '@next/third-parties/google'

// In booking-form.tsx handleSubmit success branch:
if (res.ok) {
  sendGAEvent('event', 'book-a-trial_submitted', {
    market: 'hk',
    venue: venue,  // 'wan-chai' | 'cyberport' | 'no-preference'
  })
  setStatus("success")
  return
}
```

### WhatsApp Click Event

```tsx
// Source: derived from sendGAEvent pattern
// [CITED: https://nextjs.org/docs/app/guides/third-party-libraries]
'use client'
import { sendGAEvent } from '@next/third-parties/google'

// Applied to existing wa.me anchor in hk/page.tsx:
<a
  href={`https://wa.me/${sanitisedWhatsapp}?text=...`}
  onClick={() => sendGAEvent('event', 'whatsapp_click', { market: 'hk' })}
  target="_blank"
  rel="noopener noreferrer"
>
  Chat on WhatsApp
</a>
```

### GSC Domain Property TXT Record (Placeholder)

```
# docs/gsc-txt-record.md
# HUMAN-ACTION: Fill this during Phase 8 before marking it complete.
# Retrieve from: https://search.google.com/search-console/
# → Add Property → Domain → proactivsports.com → copy TXT verification value

GSC_DOMAIN_TXT_VALUE=google-site-verification=<REPLACE_WITH_ACTUAL_VALUE>

# Phase 10 action: Add TXT record in Cloudflare DNS:
#   Type: TXT
#   Name: @ (root)
#   Content: google-site-verification=<value above>
#   TTL: Auto
# Then click Verify in GSC.
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual `<Script>` with `strategy="afterInteractive"` and inline gtag init | `@next/third-parties` `GoogleAnalytics` component | Next.js 14+ | Less boilerplate; Vercel-maintained; no manual deduplication guard needed |
| Universal Analytics (UA) | GA4 | July 2023 (UA sunset) | All event-based; no session/hit model; pageviews auto-tracked on client navigation |
| GA4 "Conversions" label | GA4 "Key Events" label | Feb 2024 | Same functionality; renamed in UI; mark `book-a-trial_submitted` etc. as Key Events in GA4 Admin |
| Three URL-prefix GSC properties per subdomain | One Domain property + single TXT DNS record | GSC policy, ongoing | One verification covers all subdomains and protocols |
| Manual `gtag('set', 'linker', {...})` for cross-domain | `cookie_domain: 'auto'` GA4 default | GA4 default since launch | Subdomains of the same root domain share cookies automatically; no linker needed |

**Deprecated/outdated:**
- Universal Analytics (GA3): sunset July 2023 — all new tracking must use GA4
- `react-ga` / `react-ga4` npm packages: community-maintained; `@next/third-parties` is now the idiomatic Next.js approach
- `gtag('set', 'linker', {'domains': [...]})`: only needed for tracking across DIFFERENT root domains (e.g. `proactivsports.com` + `externalbookingplatform.com`); not needed for subdomains of the same root

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Injecting `<GoogleAnalytics>` in `app/layout.tsx` (root) only is sufficient to cover all three route groups (root, hk, sg) | Architecture Patterns | If Next.js route group nesting causes the root layout NOT to wrap hk/sg groups, GA4 won't fire on subdomain previews — would need per-layout injection instead |
| A2 | The `@next/third-parties` package is already installable as a peer dep of `next@15.5.15` without version conflicts | Standard Stack | If there is a version conflict, it may need explicit `pnpm add @next/third-parties@16.2.x` |
| A3 | GA4 `cookie_domain: 'auto'` automatically sets cookies on `.proactivsports.com` covering all three subdomains | Architecture | Verified by multiple authoritative analytics sources; minor risk if GA4 behaviour changes |
| A4 | The Cyberport unit address within Cyberport complex needs client confirmation before it can be in `lib/venues.ts` | Code Examples | If left as placeholder, NAP consistency task cannot complete — GBP audit is blocked |
| A5 | Three GBP listings are already claimed/created for the three venues | GBP section | If listings don't yet exist, claim/create step must precede audit step |

---

## Open Questions

1. **Is `app/layout.tsx` a shared parent of all three route groups?**
   - What we know: In Next.js App Router, `app/layout.tsx` wraps everything under `app/`. The route groups `app/(root)/`, `app/(hk)/`, `app/(sg)/` (or in this repo: `app/root/`, `app/hk/`, `app/sg/`) all sit under `app/`.
   - What's unclear: The repo uses flat folder names (`app/hk/`, not `app/(hk)/`). The root `app/layout.tsx` exists and wraps `{children}`. This should be fine, but the planner should verify the nesting chain.
   - Recommendation: In Plan 08-01 (analytics foundation), the first task should verify the nesting by adding a `console.log` to confirm `app/layout.tsx` renders on hk/sg preview pages.

2. **Have the three GBP listings been created and claimed?**
   - What we know: Strategy PART 8.3 says "Claim/verify a separate GBP for each of the three physical locations" — this is a recommended action, not a confirmed fact about current state.
   - What's unclear: Current GBP claim status for ProGym Wan Chai, ProGym Cyberport (opened Aug 2025 — may not have a listing yet), and Prodigy @ Katong Point.
   - Recommendation: Phase 8 plan must include a HUMAN-ACTION checkpoint: "Martin: confirm GBP claim status for all three venues before proceeding to audit."

3. **Is there a GA4 property already created for ProActiv Sports?**
   - What we know: No GA4 env vars exist in `.env.example`; no analytics code exists in the codebase.
   - What's unclear: Whether a GA4 property was set up outside of this project (e.g., previously on the `.net` site).
   - Recommendation: HUMAN-ACTION in Plan 08-01 — Martin: create new GA4 property (or locate existing one), create a Web Data Stream for `proactivsports.com`, copy the Measurement ID (G-XXXXXXXXXX) into Vercel env vars as `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build + scripts | ✓ | v24.14.0 | — |
| pnpm | Package management | ✓ | 10.30.3 | — |
| `@next/third-parties` | GA4 injection | Peer dep of next@15 | 16.2.4 | `next/script` with manual gtag init |
| GA4 Property (G-XXXXXXXXXX) | Analytics | ✗ — needs creation | — | None; must be created (HUMAN-ACTION) |
| GSC Account with proactivsports.com | Search Console | ✗ — needs Domain property creation | — | None; must be created (HUMAN-ACTION) |
| GBP listings (3 venues) | NAP audit | Unknown — needs status check | — | If unclaimed, claim first |

**Missing dependencies with no fallback:**
- GA4 Measurement ID: Martin must create a GA4 property, add a Web Data Stream for `proactivsports.com`, and copy the G-XXXXXXXXXX ID into Vercel env vars before code can be verified
- GSC Domain property TXT value: Martin must add the property in Search Console and retrieve the TXT record value

**Missing dependencies with fallback:**
- `@next/third-parties` (if peer dep resolution fails): fallback to `next/script` with manual gtag init (~10 extra lines per layout)

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.x (existing, per `vitest.config.ts`) |
| Config file | `/vitest.config.ts` |
| Quick run command | `pnpm test:unit` |
| Full suite command | `pnpm test:unit` (single runner) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SEO-09a | GA4 `<GoogleAnalytics>` renders when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set | unit (RTL) | `pnpm test:unit` | ❌ Wave 0 |
| SEO-09b | GA4 `<GoogleAnalytics>` does NOT render when env var is unset | unit (RTL) | `pnpm test:unit` | ❌ Wave 0 |
| SEO-09c | `trackBookATrial` calls `sendGAEvent` with correct event name and params | unit (vi.mock) | `pnpm test:unit` | ❌ Wave 0 |
| SEO-09d | `trackEnquiry` calls `sendGAEvent` with correct event name | unit (vi.mock) | `pnpm test:unit` | ❌ Wave 0 |
| SEO-09e | `trackWhatsApp` calls `sendGAEvent` with correct event name | unit (vi.mock) | `pnpm test:unit` | ❌ Wave 0 |
| SEO-09f | BookingForm fires `book-a-trial_submitted` event on successful submission | unit (RTL + vi.mock fetch) | `pnpm test:unit` | ❌ Wave 0 |
| SEO-10 | `lib/venues.ts` exports all three venues with required NAP fields | unit | `pnpm test:unit` | ❌ Wave 0 |

**Manual-only validations (no automated test possible):**

| Req ID | Behavior | Why manual |
|--------|----------|------------|
| SEO-09 live | GA4 Realtime shows events from preview URL | Requires real GA4 property + Measurement ID |
| SEO-09 conversions | `book-a-trial_submitted`, `enquire_submitted`, `whatsapp_click` appear in GA4 | Same — real property required |
| SEO-10 GBP | GBP listings match `lib/venues.ts` exactly | GBP is a Google product; no API access planned |
| SEO-09 GSC | GSC TXT record value stored in `docs/gsc-txt-record.md` | Human retrieves from GSC Admin |

### Sampling Rate

- **Per task commit:** `pnpm test:unit`
- **Per wave merge:** `pnpm test:unit && pnpm typecheck && pnpm lint`
- **Phase gate:** Full suite green + manual GA4 Realtime verification before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `lib/analytics.test.ts` — covers SEO-09c, SEO-09d, SEO-09e (mocked sendGAEvent)
- [ ] `lib/venues.test.ts` — covers SEO-10 (shape + required fields assertion)
- [ ] `app/hk/book-a-trial/free-assessment/booking-form.analytics.test.tsx` — covers SEO-09f

---

## Security Domain

> Security enforcement is enabled (no explicit `false` in config).

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | — |
| V3 Session Management | No | — |
| V4 Access Control | No | — |
| V5 Input Validation | Partial | GA4 event params are string literals from code, not user input — no injection risk |
| V6 Cryptography | No | — |

### Known Threat Patterns for Analytics Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| GA4 Measurement ID exposed in client bundle | Information Disclosure | Non-issue: Measurement IDs are intentionally public (they appear in the page source of every GA4-enabled site) |
| Duplicate/inflated event data in local dev | Tampering (data integrity) | Guard `{gaId && <GoogleAnalytics>}` — events don't fire if var is unset in local `.env.local` |
| GSC TXT record stored in repo (docs/) | Information Disclosure | Acceptable: GSC TXT values are not secrets — they prove domain ownership via DNS, not authenticate a service account |
| GBP NAP update performed on wrong listing | Tampering | Human process: Martin verifies listing URL before editing; 3 venues = 3 GBP URLs documented in Phase 8 notes |

---

## Sources

### Primary (HIGH confidence)

- Context7 `/vercel/next.js` — `@next/third-parties` `GoogleAnalytics` + `sendGAEvent` patterns
- `https://nextjs.org/docs/app/guides/third-party-libraries` — official Next.js third-party library guide
- `https://support.google.com/webmasters/answer/9008080` — GSC verification methods (TXT DNS for Domain property)
- `https://support.google.com/analytics/answer/10071811` — GA4 cross-domain measurement
- `https://developers.google.com/tag-platform/devguides/cross-domain` — cross-domain linker parameter docs
- npm registry `@next/third-parties@16.2.4` version verified 2026-04-24

### Secondary (MEDIUM confidence)

- `https://www.analyticsmania.com/post/subdomain-tracking-with-google-analytics-and-google-tag-manager/` — GA4 subdomain `cookie_domain: 'auto'` behaviour (corroborated by Google official docs)
- `https://seotesting.com/google-search-console/domain-vs-url-prefix/` — Domain vs URL-prefix property comparison
- `https://www.seo-stack.io/blog/google-search-console-property-types-explained-url-prefix-vs-domain-property-and-how-to-verify-either-one/` — Single TXT record for domain property

### Tertiary (LOW confidence — flag for validation)

- Various blog posts on GBP categories for gymnastics/sports clubs in HK/SG — not directly verifiable without accessing the live GBP category list

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — `@next/third-parties` is official, version-verified, documented in Context7
- Architecture: HIGH — subdomain auto-tracking confirmed by multiple authoritative sources
- Pitfalls: HIGH — all pitfalls derived from codebase inspection + official docs
- NAP patterns: MEDIUM — logical extension of existing `lib/hk-data.ts` pattern; confirmed appropriate by local SEO best practice sources
- GBP categories: LOW — category names depend on current Google category taxonomy; needs live GBP admin verification

**Research date:** 2026-04-24
**Valid until:** 2026-07-24 (stable domain; 90 days)

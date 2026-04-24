---
phase: 05-singapore-market
plan: "02"
subsystem: sg-chrome
tags: [sg, layout, nav, footer, venue-map, opengraph, baloo2, chrome]
dependency_graph:
  requires: [05-01]
  provides: [sg-layout-chrome, sg-nav, sg-footer, sg-venue-map, sg-venue-chip-row, sg-opengraph]
  affects: [05-03, 05-04, 05-05, 05-06]
tech_stack:
  added: []
  patterns:
    - "SGGroupLayout mirrors HKGroupLayout — metadataBase + baloo.variable + skip-link + nav + footer"
    - "SGNavMobile dual-CTA pattern — red Book CTA at top AND bottom of Sheet (D-05 SG mobile variant)"
    - "SGFooter single-venue NAP (D-08) vs HK 2-venue map pattern"
    - "VenueChipRow single centred chip composition for SG homepage §3.2"
    - "VenueMap T-05-11 mitigation — embedSrc from lib/sg-data.ts only, not user-supplied"
key_files:
  created:
    - components/sg/sg-nav.tsx
    - components/sg/sg-nav-mobile.tsx
    - components/sg/sg-footer.tsx
    - components/sg/venue-map.tsx
    - components/sg/venue-chip-row.tsx
    - components/sg/active-venue-chip.tsx
    - app/sg/opengraph-image.tsx
  modified:
    - app/sg/layout.tsx
decisions:
  - "SGNav desktop shows 6 items total (Weekly Classes dropdown + Prodigy Camps dropdown + Katong Point + Coaches + FAQ + Book CTA). Parties/Schools/Events/Blog are mobile-Sheet-only per UI-SPEC §5.1."
  - "D-05 SG mobile variant implemented: two red Book a Free Trial CTAs in Sheet — one at top (universal D-05), one at bottom (SG-specific variant). HK mobile has only top CTA."
  - "SG_ZONES slugs confirmed: movement | sports-multiball | climbing. SG_CAMP_TYPES slugs confirmed: themed | multi-activity | gymnastics. Both consumed directly from lib/sg-data.ts Plan 05-01 output."
  - "ActiveVenueChip in SG adapts the HK pattern: instead of venueId prop (union type), uses href + label + address props directly (single-venue; no union type needed). Cleaner API for single-venue market."
  - "font-accent on 'Prodigy' word in Footer Col 1 uses brand-yellow (text-brand-yellow) on navy background — differs from SGNav where Prodigy uses brand-green. Nav = brand-green (light background); Footer = brand-yellow (navy background for contrast)."
metrics:
  duration_minutes: 25
  completed_date: "2026-04-24"
  tasks_completed: 2
  files_changed: 8
---

# Phase 05 Plan 02: SG Layout Chrome Summary

SG production layout chrome: SGGroupLayout + SGNav + SGNavMobile + SGFooter + VenueMap + VenueChipRow + ActiveVenueChip + default SG OG image (Prodigy-green background).

## What Was Built

### Task 1 — Layout + SGNav + SGNavMobile + SGFooter (commit 76a6e7f)

**`app/sg/layout.tsx`** — Phase 1 teal-stripe stub replaced wholesale with production SGGroupLayout. Exports:
- `SG_PRODUCTION_BASE = "https://sg.proactivsports.com"` with Vercel env fallback chain
- `metadata: Metadata` — metadataBase, title template "%s | Prodigy by ProActiv Sports", en_SG locale, siteName "Prodigy by ProActiv Sports — Singapore"
- `SGGroupLayout` body: `<div className={baloo.variable}>` → skip link → `<SGNav />` → `<main id="main-content">` → `<SGFooter />`

**`components/sg/sg-nav.tsx`** — RSC sticky header (z-50, backdrop-blur, brand-navy/10 border):
- Brand lockup: `<span className="font-accent text-brand-green">Prodigy</span> SG`
- Weekly Classes dropdown mapping `SG_ZONES` — Sports+MultiBall zone gets `<Badge className="bg-brand-green text-white">Singapore's only</Badge>` inline; bottom "See all zones →" to `/weekly-classes/`
- Prodigy Camps dropdown mapping `SG_CAMP_TYPES` with ageBand; bottom "See all camps →" to `/prodigy-camps/`
- 3 flat nav links: Katong Point, Coaches, FAQ
- Sticky red Book CTA: `<Button asChild size="touch" className="bg-brand-red ..."><a href="/book-a-trial/">` (plain `<a>` not `<Link>` per PATTERNS §Trailing Slash Preservation)
- `<SGNavMobile />` at `lg:hidden`

**`components/sg/sg-nav-mobile.tsx`** — `"use client"` Sheet drawer:
- `React.useState(false)` open/close + `close = () => setOpen(false)`
- TOP sticky Book CTA (universal D-05)
- Group 1: "Weekly Classes" heading → maps SG_ZONES (label + ageBand + Singapore's only badge for sports-multiball)
- Group 2: "Prodigy Camps" heading → maps SG_CAMP_TYPES (label + ageBand + tag subline if present)
- Group 3: flat links (border-separated) — 7 links including Parties, Schools, Events, Blog
- BOTTOM sticky Book CTA (D-05 SG mobile variant — second CTA at bottom per UI-SPEC §5.1)
- All nav links call `onClick={close}`

**`components/sg/sg-footer.tsx`** — RSC, `bg-brand-navy` surface:
- 4-col grid: Brand wordmark ("Prodigy" in font-accent text-brand-yellow on navy) + tagline
- Single Katong Point NAP block (KATONG_POINT_NAP import) — NOT a 2-venue map loop (D-08)
- Quick links column (7 links, same-subdomain `<Link>`)
- Connect column: WhatsApp CTA (brand-green), email, `<a href={NEXT_PUBLIC_HK_URL}>ProGym Hong Kong ↗</a>`, `<a href={NEXT_PUBLIC_ROOT_URL}>ProActiv Sports Group ↗</a>` (both cross-subdomain — `<a>` not `<Link>`)
- Social icons row: Facebook, Instagram, LinkedIn (CC0 inline SVGs from HK footer)
- Bottom bar: "© 2026 ProActiv Sports Singapore" + Privacy/Terms as `<a href={rootUrl}/...>`

### Task 2 — VenueMap + VenueChipRow + ActiveVenueChip + default OG image (commit f13c486)

**`components/sg/venue-map.tsx`** — Market-agnostic RSC iframe wrapper:
- Props: `{ embedSrc, title, className? }`
- If `embedSrc` empty or includes "PLACEHOLDER": renders `<div role="status" aria-live="polite">` fallback
- Otherwise: `<iframe loading="lazy" referrerPolicy="no-referrer-when-downgrade" ...>`
- T-05-11 mitigation: embedSrc MUST be from lib/sg-data.ts `KATONG_POINT_MAP_EMBED` — not user-supplied

**`components/sg/active-venue-chip.tsx`** — `"use client"` with `usePathname()`:
- Props: `{ href, label, address }` (SG simplification vs HK's venueId union type)
- Active: `bg-brand-navy text-white border-brand-navy`; Inactive: `border border-brand-navy/20 hover:-translate-y-1 hover:shadow-md`
- Renders `MapPin` icon + label (Baloo font-accent on "Prodigy" prefix) + address line

**`components/sg/venue-chip-row.tsx`** — Single centred chip RSC:
- `<nav aria-label="Prodigy Singapore venues">` wrapper
- Single `<ActiveVenueChip href="/katong-point/" label={KATONG_POINT_NAP.nameFull} address={KATONG_POINT_NAP.addressStreet} />` — pulled from Plan 05-01 export, not hardcoded
- `<div className="flex justify-center">` so chip is centred on desktop, full-width on mobile

**`app/sg/opengraph-image.tsx`** — Default SG OG image:
- `export const runtime = "nodejs"; export const dynamic = "force-dynamic"; export const size = { width: 1200, height: 630 }; export const contentType = "image/png";`
- Default export calls `createSGOgImage({ title: "Prodigy by ProActiv Sports Singapore", tagline: "Kids' sports, camps, and parties at Katong Point — home of Singapore's only MultiBall wall." })`
- createSGOgImage uses Prodigy-green (#0f9733) background — distinguishes SG from HK navy in social previews (D-09)

## Slug Reconciliation (Plan 05-01 → Plan 05-02 consumption)

SG_ZONES slugs consumed: `movement` | `sports-multiball` | `climbing` (confirmed from lib/sg-data.ts)
SG_CAMP_TYPES slugs consumed: `themed` | `multi-activity` | `gymnastics` (confirmed from lib/sg-data.ts)
Both arrays are `readonly` const — no runtime mutation risk.

## TypeScript Verification

`pnpm typecheck` — all 8 Plan 05-02 files produce zero TS errors.
Pre-existing errors (22 total) are Wave 3+ test stubs referencing `./page` modules not yet created (Plans 05-03 through 05-06). These pre-date this plan and are unchanged.

## Test Results

`tests/no-sg-placeholder-leak.test.ts` — 3 tests PASS. No `sg-placeholder` string in any `app/sg/**` source.

## HUMAN-ACTION Pending (non-blocking for chrome)

1. **WhatsApp number (NEXT_PUBLIC_WHATSAPP_SG)**: Footer Col 2 WhatsApp chip + Col 4 Chat CTA render conditionally; graceful no-render if env var unset.
2. **SG phone (NEXT_PUBLIC_SG_PHONE)**: Footer Col 2 phone line renders conditionally.
3. **HK URL (NEXT_PUBLIC_HK_URL)**: Footer "ProGym Hong Kong ↗" cross-market link renders conditionally.
4. **Root URL (NEXT_PUBLIC_ROOT_URL)**: Footer Group link + Privacy/Terms bottom bar; graceful empty-string fallback if unset.
5. **Map embed (NEXT_PUBLIC_MAP_EMBED_KATONG_POINT)**: VenueMap renders PLACEHOLDER fallback state until real Google Maps embed URL is provided. Plan 05-05 (Katong Point page) is where this is first consumed.
6. **Mux playback ID**: Not consumed in this plan (video components deferred to homepage plan 05-03).

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written with one minor API adaptation.

**[Rule 2 — API Adaptation] ActiveVenueChip props redesigned for single-venue SG market**
- **Found during:** Task 2 implementation
- **Issue:** Plan spec suggested `venueId: "katong-point"` union type (copied from HK's `"wan-chai" | "cyberport"` pattern). For SG with a single venue, a union type with one member adds no value and the constraint is not needed.
- **Fix:** Used `{ href, label, address }` props directly — cleaner API, avoids coupling to venue IDs if SG ever adds a second venue later (just pass different props; no type change needed).
- **Files modified:** components/sg/active-venue-chip.tsx, components/sg/venue-chip-row.tsx
- **Commit:** f13c486

## Threat Flags

None — all threat mitigations from plan's threat model are implemented:
- T-05-11: VenueMap comment documents that embedSrc must come from lib/sg-data.ts, not user input
- T-05-13: Inherited from createSGOgImage graceful try/catch on font/logo reads (Plan 05-01)
- T-05-14: Skip link implemented as standard WCAG 2.2 AA pattern

## Known Stubs

None — all components render from real Plan 05-01 data (SG_ZONES, SG_CAMP_TYPES, KATONG_POINT_NAP). No hardcoded empty values or placeholder text in rendered output. VenueMap PLACEHOLDER state is a legitimate fallback for a missing env var, not a stub.

## Next Plan

05-03-PLAN.md — SG homepage (Wave 3). Homepage will import `VenueChipRow` directly from `components/sg/venue-chip-row.tsx`. All pages at `app/sg/**` now automatically inherit SGNav + SGFooter via `app/sg/layout.tsx`.

## Self-Check: PASSED

Files verified:
- app/sg/layout.tsx — exists, contains SGNav + SGFooter + en_SG + baloo.variable + metadataBase: new URL
- components/sg/sg-nav.tsx — exists, contains Book a Free Trial + SG_ZONES + SG_CAMP_TYPES + NavigationMenu + bg-brand-red
- components/sg/sg-nav-mobile.tsx — exists, starts with "use client", contains Sheet + onClick={close}
- components/sg/sg-footer.tsx — exists, contains KATONG_POINT_NAP + NEXT_PUBLIC_HK_URL + NEXT_PUBLIC_ROOT_URL + bg-brand-navy + font-accent
- components/sg/venue-map.tsx — exists, contains loading="lazy" + PLACEHOLDER + role="status"
- components/sg/active-venue-chip.tsx — exists, starts with "use client", contains usePathname + bg-brand-navy
- components/sg/venue-chip-row.tsx — exists, contains ActiveVenueChip + /katong-point/ + font-accent
- app/sg/opengraph-image.tsx — exists, contains createSGOgImage + Prodigy by ProActiv Sports Singapore + runtime = "nodejs"

Commits verified:
- 76a6e7f — Task 1: layout + nav + footer
- f13c486 — Task 2: venue components + OG image

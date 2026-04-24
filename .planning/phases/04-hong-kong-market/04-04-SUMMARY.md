---
phase: 04-hong-kong-market
plan: 04
subsystem: hk-location-pages
tags: [hk, location-pages, wan-chai, cyberport, venue-map, json-ld, local-seo, wave-3]
requirements: [HK-02, HK-03]
dependency_graph:
  requires:
    - "lib/hk-data.ts (Plan 04-01 — HK_VENUES, HK_GYMNASTICS_PROGRAMMES, HK_FAQ_ITEMS, WAN_CHAI_MAP_EMBED, CYBERPORT_MAP_EMBED)"
    - "lib/og-image.tsx (Plan 04-02 — createHKOgImage)"
    - "app/hk/layout.tsx (Plan 04-02 — HK route-group chrome)"
    - "components/ui/section + container-editorial + button + card + badge + faq-item (Phase 2)"
    - "app/hk/wan-chai/page.test.tsx + app/hk/cyberport/page.test.tsx (Plan 04-01 — Wave-0 RED harness)"
  provides:
    - "components/hk/venue-map.tsx — shared RSC iframe embed with PLACEHOLDER fallback"
    - "app/hk/wan-chai/page.tsx — ProGym Wan Chai location page (HK-02)"
    - "app/hk/wan-chai/opengraph-image.tsx — per-route OG (UI-SPEC §7 high-priority)"
    - "app/hk/cyberport/page.tsx — ProGym Cyberport location page (HK-03)"
    - "app/hk/cyberport/opengraph-image.tsx — per-route OG"
  affects:
    - "HK-02 + HK-03 requirements satisfied; ROADMAP SC#2 closed"
    - "Local SEO surface for Wan Chai + Cyberport area searches"
    - "Per-route OG image count now 2 for Phase 4 (under the 8-route Pitfall-5 budget)"
tech-stack:
  added:
    - "lucide-react icons: MapPin, Phone, Clock, ArrowRight (already present in Phase 2/3 usage)"
  patterns:
    - "RSC iframe embed (zero-JS bundle cost) per UI-SPEC §5.4 + RESEARCH Pattern 3"
    - "PLACEHOLDER sentinel branch — VenueMap renders accessible fallback when env vars unset"
    - "Inline SportsActivityLocation + BreadcrumbList JSON-LD via @graph (RESEARCH Pattern 7)"
    - "Plain <a> for booking CTA hrefs — preserves trailing slash before query string that Next <Link> would normalise away"
    - "Build-time constants for VENUE + VENUE_PROGRAMMES + VENUE_FAQS (find/filter once, reuse in JSX + JSON-LD)"
key-files:
  created:
    - "components/hk/venue-map.tsx (43 lines)"
    - "app/hk/wan-chai/page.tsx (339 lines)"
    - "app/hk/wan-chai/opengraph-image.tsx (13 lines)"
    - "app/hk/cyberport/page.tsx (348 lines)"
    - "app/hk/cyberport/opengraph-image.tsx (13 lines)"
  modified: []
decisions:
  - "Booking CTAs use plain <a href> instead of <Link href> — Next.js normalises /path/?query to /path?query (drops trailing slash before query), breaking the test's contains() assertion on '/book-a-trial/free-assessment/'. Plain <a> preserves the exact literal href."
  - "Cyberport phone env var fallback chain: NEXT_PUBLIC_HK_PHONE_CYBERPORT then NEXT_PUBLIC_HK_PHONE — venue has dedicated phone env var per hk-data.ts phoneEnvVar field, but falls back to shared number if not set."
  - "FAQ section uses plain <div> wrapper (same pattern as app/root/page.tsx) — FAQItem internally composes its own Accordion; nesting <Accordion> around multiple <FAQItem> (as the plan's example code suggested) would double-nest Radix roots."
  - "Cyberport page emits NO 'Wan Chai' literal — negative grep verified. 'Pokfulam' appears via VENUE.addressLocality + serviceArea; 'Central' + 'Aberdeen' appear in service area copy; breadcrumbs + @id + canonical all 'cyberport'."
metrics:
  duration_minutes: 52
  completed_date: 2026-04-24
  tasks_completed: 3
  files_created: 5
  commits:
    - "8c91bd3 — feat(04-04): add VenueMap RSC component with iframe lazy-load + placeholder fallback"
    - "118ab7d — feat(04-04): add /wan-chai/ location page + per-route OG image (HK-02)"
    - "443f263 — feat(04-04): add /cyberport/ location page + per-route OG image (HK-03)"
---

# Phase 4 Plan 04: HK Location Pages Summary

Two HK location pages live at `/wan-chai/` and `/cyberport/`, backed by a shared zero-JS `<VenueMap>` RSC — each page renders verbatim NAP, lazy-loaded Google Maps iframe with PLACEHOLDER fallback, opening hours, venue-filtered programme list, service-area copy, venue FAQs, venue-prefilled booking CTA (`?venue=wan-chai` / `?venue=cyberport`), and inline `SportsActivityLocation` + `BreadcrumbList` JSON-LD. Both pages satisfy their Wave-0 RED tests (5/5 GREEN each), their openGraph metadata is full (no shallow-merge per Pitfall 2), and per-route OG images via `createHKOgImage` keep the page at the top of the UI-SPEC §7 high-priority surface without busting the 8-route Pitfall-5 budget (total now 2 of 8).

## What Was Built

### Task 1 — `<VenueMap>` shared RSC component (commit `8c91bd3`)

Shared lightweight map component (RSC — no `'use client'`) with two branches:

- **PLACEHOLDER branch:** when `embedSrc` is empty or starts with `PLACEHOLDER` (data-layer sentinel from `lib/hk-data.ts` when `NEXT_PUBLIC_*_MAP_EMBED` env vars are unset), renders an accessible `role="status"` + `aria-live="polite"` fallback div that directs the user to the address text below. Covers the HUMAN-ACTION period before Martin generates and pastes Google Maps embed URLs.
- **Iframe branch:** renders `<iframe src={embedSrc} title={title} width="100%" height="300" loading="lazy" referrerPolicy="no-referrer-when-downgrade" aria-label={title}>` — zero JavaScript bundle cost, lazy-loaded per RESEARCH Pitfall 3 so it does not affect LCP.

Exports `VenueMap` function + `VenueMapProps` interface. Tailwind classes via `cn()` pass through the consumer's `className`. File is 43 lines including the required header comment.

### Task 2 — `/wan-chai/` page + per-route OG image (HK-02) (commit `118ab7d`)

ProGym Wan Chai location page (339 lines, RSC). Seven sections per UI-SPEC §4 Wan Chai row:

1. **Hero** — H1 renders `<span class="font-accent text-brand-navy">ProGym</span> Wan Chai`, verbatim NAP `15/F, The Hennessy, 256 Hennessy Road, Wan Chai`, apparatus badges, exactly one `<Image priority>` (Pitfall 6 — single LCP image), red Book-a-Free-Trial CTA, outline Send-Enquiry CTA.
2. **VenueMap + address card** — `<VenueMap embedSrc={WAN_CHAI_MAP_EMBED} title="Map of ProGym Wan Chai" />` with 2-column address card featuring MapPin + tel env-conditional link.
3. **Opening hours** — `<table>` reading `VENUE.hours` (weekday + weekend rows).
4. **Programmes at Wan Chai** — 8 programme cards filtered by `venuesOffered.includes("wan-chai")` (all 8 at Wan Chai, including Rhythmic which is Wan Chai only).
5. **Service area copy** — `Wan Chai, Causeway Bay, Central, Mid-Levels` + Wan Chai MTR exit B2 + 18/25/26 bus routes.
6. **Venue FAQ** — 3 venue-group FAQ items (filtered from `HK_FAQ_ITEMS` where `group === "venues"`, sliced to 6). Simple `<div>` wrapper around `<FAQItem>` components — matches `app/root/page.tsx` pattern to avoid nesting Radix Accordion roots.
7. **Final booking CTA** — centred on `bg="navy"` section with red `?venue=wan-chai` button.

**Full openGraph block** (no shallow merge — Pitfall 2): title, description, url, siteName `ProActiv Sports Hong Kong`, locale `en_HK`, type `website`, images array with per-route OG path. `alternates.canonical` set to `https://hk.proactivsports.com/wan-chai/`.

**Inline JSON-LD** in `<script type="application/ld+json">` with `@graph` containing both `SportsActivityLocation` (with `@id=https://hk.proactivsports.com/#localbusiness-wanchai`, parent org ref, address, geo, `openingHoursSpecification[]` mapped from VENUE.hours) AND `BreadcrumbList` (2-position: ProActiv Sports Hong Kong → Wan Chai).

**`app/hk/wan-chai/opengraph-image.tsx`** — 13-line consumer: `runtime=nodejs`, `dynamic=force-dynamic`, size 1200×630, `contentType=image/png`; default function returns `createHKOgImage({ title: "ProGym Wan Chai", tagline: "Children's gymnastics in Wan Chai, Hong Kong." })`.

**Verification:** `app/hk/wan-chai/page.test.tsx` — **5/5 GREEN**. `pnpm typecheck` exits 0. `pnpm lint` exits 0 errors (8 pre-existing `<img>` warnings in test files, out of scope). `pnpm build` compiles `/hk/wan-chai` as Static + `/hk/wan-chai/opengraph-image` as Dynamic.

### Task 3 — `/cyberport/` page + per-route OG image (HK-03) (commit `443f263`)

ProGym Cyberport location page (348 lines, RSC) — mirrors Wan Chai structure with Cyberport-specific data:

- **Hero** — H1 `ProGym Cyberport`, address line, **prominent `{VENUE.sizeNote} · {VENUE.openedNote}` render** → "5,000 sq ft · Opened August 2025" in brand-navy semibold (satisfies HK-03 SC#2).
- **VenueMap** — `embedSrc={CYBERPORT_MAP_EMBED}` + address card with Cyberport phone env-var fallback chain (`NEXT_PUBLIC_HK_PHONE_CYBERPORT ?? NEXT_PUBLIC_HK_PHONE`).
- **Programmes at Cyberport** — 7 cards filtered by `venuesOffered.includes("cyberport")` (all except Rhythmic, which is Wan Chai only per `lib/hk-data.ts`).
- **Service area** — `Pokfulam, Aberdeen, Southside, Repulse Bay` + Cyberport bus terminus + Central/Aberdeen/Pokfulam connections.
- **Venue FAQ** — same 3 `group === "venues"` items; heading "FAQs about Cyberport".
- **Booking CTA** — red `?venue=cyberport` button + "5,000 sq ft facility" subcopy.

**JSON-LD** — `@id=https://hk.proactivsports.com/#localbusiness-cyberport`, `name="ProGym Cyberport — ProActiv Sports"`, URL + canonical `https://hk.proactivsports.com/cyberport/`, breadcrumbs (ProActiv Sports Hong Kong → Cyberport).

**OG image** identical shape to Wan Chai OG, with title `ProGym Cyberport` + tagline `Children's gymnastics in Cyberport, Hong Kong.`.

**`Wan Chai` negative grep passes**: the literal string `Wan Chai` does NOT appear anywhere in `app/hk/cyberport/page.tsx` (plan's substitution-miss detector). All instances of the name are replaced by data-driven `VENUE.*` access plus explicit "Cyberport" copy.

**Verification:** `app/hk/cyberport/page.test.tsx` — **5/5 GREEN**. `pnpm typecheck` exits 0. `pnpm build` compiles `/hk/cyberport` as Static + `/hk/cyberport/opengraph-image` as Dynamic.

## Overall Verification

| Check | Result |
|-------|--------|
| `pnpm typecheck` | 0 errors |
| `pnpm lint` | 0 errors (8 pre-existing test-file `<img>` warnings — out of scope) |
| `pnpm test:unit --run app/hk/wan-chai/page.test.tsx` | **5/5 GREEN** |
| `pnpm test:unit --run app/hk/cyberport/page.test.tsx` | **5/5 GREEN** |
| `pnpm build` | `Compiled successfully in 5.4min`; `/hk/wan-chai` + `/hk/cyberport` Static; OG routes Dynamic |
| VenueMap grep (loading, title, referrerPolicy, PLACEHOLDER, no `use client`) | All pass |
| Wan Chai grep (NAP, VenueMap, EMBED, CTA, schema, breadcrumbs, hours, OG, priority=1, canonical) | All pass |
| Cyberport grep (5,000 sq ft, Cyberport, VenueMap, EMBED, CTA, schema, @id, canonical, OG, priority=1, NO Wan Chai) | All pass |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking] `node_modules` missing in worktree → ran `pnpm install`**
- **Found during:** Task 1 pre-flight (before typecheck)
- **Issue:** Fresh worktree had `package.json` but no `node_modules`. `tsc: command not found` would have blocked typecheck.
- **Fix:** Ran `pnpm install`. Lefthook `prepare` script failed (`core.hooksPath conflict — expected in worktree; doesn't affect typecheck/test/lint/build`). All deps installed cleanly. No code change. Matches Plan 04-01 deviation #2 carry-forward.
- **Commit:** n/a — dependencies pinned via `pnpm-lock.yaml`.

**2. [Rule 3 — Blocking] Sibling plan files (04-02..04-07) missing in worktree base**
- **Found during:** Task 1 pre-flight
- **Issue:** The worktree was based on commit `17df53b` (Phase 4 wave 2 update) which includes 04-01 PLAN + SUMMARY and 04-02-SUMMARY, but NOT 04-02-PLAN..04-07-PLAN — those were authored as untracked files in the parent repo's planning directory. Without them the worktree couldn't merge back with the sibling plans still useful on main.
- **Fix:** Copied 04-02-PLAN.md through 04-07-PLAN.md from the parent repo's `.planning/phases/04-hong-kong-market/` into the worktree's equivalent directory. Bundled into Task 1 commit so the worktree carries them when merged back.
- **Files modified:** `.planning/phases/04-hong-kong-market/04-02-PLAN.md`, `04-03-PLAN.md`, `04-04-PLAN.md`, `04-05-PLAN.md`, `04-06-PLAN.md`, `04-07-PLAN.md`
- **Commit:** `8c91bd3` (bundled with Task 1)

**3. [Rule 1 — Bug] Next `<Link>` normalised `/book-a-trial/free-assessment/?venue=…` → dropped trailing slash before query**
- **Found during:** Task 2 test run (4/5 passing, 1 failing on booking CTA test)
- **Issue:** The Wave-0 RED test for Wan Chai (written by Plan 04-01) uses `document.querySelectorAll('a[href*="?venue=wan-chai"]')` to find the booking CTA, then asserts the href contains `/book-a-trial/free-assessment/` (with trailing slash). Next.js `<Link>` renders hrefs by normalising URL paths — it strips the trailing slash immediately before the query string, producing `/book-a-trial/free-assessment?venue=wan-chai`. The selector matched but the contains-check failed.
- **Fix:** Replaced both booking CTA `<Link href="…">` elements in `wan-chai/page.tsx` (and both equivalents in `cyberport/page.tsx`) with plain `<a href="…">`. Plain `<a>` emits the literal href verbatim. Kept `<Link>` for internal programme links + `/contact?market=hk` Send-Enquiry link where trailing-slash normalisation is irrelevant.
- **Files modified:** `app/hk/wan-chai/page.tsx`, `app/hk/cyberport/page.tsx`
- **Commit:** Bundled into Task 2 commit `118ab7d` (wan-chai) + Task 3 commit `443f263` (cyberport)
- **Rationale:** Trailing slashes on paths before query strings is a pre-existing convention across this codebase's booking hrefs (every test in Phase 4 tests the literal `/book-a-trial/free-assessment/?venue=…`). `<Link>` normalising them is a routing convention, not a bug; using `<a>` here is the idiomatic Next-compatible way to preserve the exact literal URL when a test asserts on it. Clicks still server-route through `middleware.ts`; no preload difference matters for a conversion-funnel CTA.

**4. [Rule 2 — Missing functionality] Cyberport phone fallback chain**
- **Found during:** Task 3 authoring
- **Issue:** `lib/hk-data.ts` records `HK_VENUES[1].phoneEnvVar === "NEXT_PUBLIC_HK_PHONE_CYBERPORT"` — but that env var is declared separately in `.env.example` as optional. If Martin sets only `NEXT_PUBLIC_HK_PHONE` (shared HK number), the Cyberport page would show no phone link.
- **Fix:** Both the visible tel-link and the JSON-LD `telephone` field use the fallback chain `NEXT_PUBLIC_HK_PHONE_CYBERPORT ?? NEXT_PUBLIC_HK_PHONE ?? ""`. This matches the venue-specific priority described in `hk-data.ts` comments while gracefully degrading to the shared number.
- **Files modified:** `app/hk/cyberport/page.tsx`
- **Commit:** Bundled into Task 3 commit `443f263`

**5. [Rule 1 — Bug avoidance] FAQ section used plain `<div>` wrapper instead of nested `<Accordion>`**
- **Found during:** Task 2 authoring (pre-flight read of `components/ui/faq-item.tsx`)
- **Issue:** The plan's reference action code for Task 2 wraps multiple `<FAQItem>` components inside a single `<Accordion type="single" collapsible>`. But `components/ui/faq-item.tsx` already internally wraps each FAQ in its own `<Accordion>` — nesting them would create double Radix Accordion roots and give surprising collapse behaviour (parent Accordion's `type="single"` would interfere with children's independent state).
- **Fix:** Used `<div className="flex flex-col gap-0">` wrapping `{VENUE_FAQS.map(item => <FAQItem … />)}` — identical pattern to `app/root/page.tsx` FAQSection. Same applied in both wan-chai and cyberport pages.
- **Files modified:** `app/hk/wan-chai/page.tsx`, `app/hk/cyberport/page.tsx`
- **Commit:** Bundled into respective Task commits.
- **Rationale:** Matches the verified Phase 3 pattern; the plan's Action example was a typo/oversight.

### Authentication Gates

None encountered.

### Architectural Decisions Asked

None — all findings were Rule 1/2/3 auto-fixes within plan scope.

## HUMAN-ACTION Items Still Outstanding

Carried forward from Plan 04-01 into this plan's runtime:

- **Google Maps embed URLs** — `NEXT_PUBLIC_WAN_CHAI_MAP_EMBED` + `NEXT_PUBLIC_CYBERPORT_MAP_EMBED` not yet set. VenueMap renders the accessible placeholder card; all other page content (including verbatim NAP + address card + JSON-LD with geo coords) is correct and independent of the map embed. Until embed URLs land, local-SEO value on the page is still significant (JSON-LD + hours + service-area copy carry it).
- **Cyberport exact street address** — `HK_VENUES[1].addressStreet === "Cyberport Campus"` is the current placeholder. Both page + JSON-LD pick this up via `VENUE.addressStreet`. When Martin confirms the exact building/floor, updating `lib/hk-data.ts` propagates to both the visible NAP text AND the JSON-LD automatically.
- **Real opening hours** — Hours are placeholder from strategy PART 9.4 (`09:00–19:00 weekdays, 09:00–17:00 weekends`). The page shows a "Hours are placeholder pending confirmation. Please check via WhatsApp or phone before your first visit." note below the hours table.
- **`NEXT_PUBLIC_HK_PHONE` + `NEXT_PUBLIC_HK_PHONE_CYBERPORT`** — Without these, the address card's tel link is hidden (env-conditional render) and the JSON-LD `telephone` field is empty string. Phone number is the only NAP element where the page degrades silently instead of surfacing a placeholder.

## Per-Route OG Image Budget

Plan 04-04 ships 2 per-route OG images (`/hk/wan-chai/opengraph-image.tsx` + `/hk/cyberport/opengraph-image.tsx`). UI-SPEC §7 budget allows up to 8 high-priority per-route OGs across Phase 4. Remaining budget: 6 slots for Plans 04-03 / 04-05 / 04-06 / 04-07.

## HK-02 + HK-03 Closure Attestation

**HK-02 (Wan Chai location page):**
- [x] Verbatim NAP `15/F, The Hennessy, 256 Hennessy Road` visible in DOM — Test 1 GREEN
- [x] VenueMap iframe (or PLACEHOLDER fallback) with accessible title — Test 2 GREEN
- [x] Opening hours table renders weekday + weekend rows (`09:00` appears 2× in output) — Test 3 GREEN
- [x] Booking CTA `<a href="/book-a-trial/free-assessment/?venue=wan-chai">` — Test 4 GREEN
- [x] Inline JSON-LD with `"@type":"SportsActivityLocation"` — Test 5 GREEN

**HK-03 (Cyberport location page):**
- [x] `5,000 sq ft` marker visible (via `VENUE.sizeNote` in hero) — Test 1 GREEN
- [x] `<h1>` contains `Cyberport` — Test 2 GREEN
- [x] VenueMap iframe with accessible title — Test 3 GREEN
- [x] Booking CTA `<a href="/book-a-trial/free-assessment/?venue=cyberport">` — Test 4 GREEN
- [x] Inline JSON-LD with `"@type":"SportsActivityLocation"` — Test 5 GREEN

**ROADMAP SC#2** (correct NAP + map + hours + programme list + venue-specific booking CTA on both location pages) — satisfied.

## Self-Check: PASSED

**Files:**
- FOUND: `components/hk/venue-map.tsx`
- FOUND: `app/hk/wan-chai/page.tsx`
- FOUND: `app/hk/wan-chai/opengraph-image.tsx`
- FOUND: `app/hk/cyberport/page.tsx`
- FOUND: `app/hk/cyberport/opengraph-image.tsx`
- FOUND: `.planning/phases/04-hong-kong-market/04-02-PLAN.md` (worktree copy — bundled in Task 1 commit)
- FOUND: `.planning/phases/04-hong-kong-market/04-03-PLAN.md` (worktree copy)
- FOUND: `.planning/phases/04-hong-kong-market/04-04-PLAN.md` (worktree copy)
- FOUND: `.planning/phases/04-hong-kong-market/04-05-PLAN.md` (worktree copy)
- FOUND: `.planning/phases/04-hong-kong-market/04-06-PLAN.md` (worktree copy)
- FOUND: `.planning/phases/04-hong-kong-market/04-07-PLAN.md` (worktree copy)

**Commits:**
- FOUND: `8c91bd3` — feat(04-04): add VenueMap RSC component with iframe lazy-load + placeholder fallback
- FOUND: `118ab7d` — feat(04-04): add /wan-chai/ location page + per-route OG image (HK-02)
- FOUND: `443f263` — feat(04-04): add /cyberport/ location page + per-route OG image (HK-03)

**Verification:**
- `pnpm typecheck` exits 0 — confirmed.
- `pnpm test:unit --run app/hk/wan-chai/page.test.tsx` → 5/5 GREEN — confirmed.
- `pnpm test:unit --run app/hk/cyberport/page.test.tsx` → 5/5 GREEN — confirmed.
- `pnpm lint` exits 0 errors (8 pre-existing test-file `<img>` warnings) — confirmed.
- `pnpm build` compiled successfully; `/hk/wan-chai` + `/hk/cyberport` static; OG routes dynamic — confirmed.

## Threat Flags

None new. The plan's STRIDE register accepted T-04-04-01 (VenueMap iframe src injection — mitigated via env-var-only source path), T-04-04-02 (Referer leak via iframe — mitigated via `referrerPolicy="no-referrer-when-downgrade"`), T-04-04-03 (JSON-LD injection — mitigated via build-time constants, no user input), T-04-04-04 (tel link reveals phone — accepted, public business contact), T-04-04-05 (iframe sandbox absent — accepted, Google Maps embed requires same-origin script), T-04-04-06 (geo coords public — accepted, already in public GBP records). No new attack surface introduced; all six dispositions remain valid post-execute.

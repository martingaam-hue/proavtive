---
phase: 04-hong-kong-market
verified: 2026-04-24T20:00:00Z
status: human_needed
score: 5/5
overrides_applied: 0
human_verification:
  - test: "HK homepage hero video loops above the fold on mobile"
    expected: "With NEXT_PUBLIC_MUX_HK_HERO_PLAYBACK_ID populated, the Mux video plays silently and loops in the hero; the single priority poster Image is visible before hydration"
    why_human: "Video playback requires a live Mux playback ID (HUMAN-ACTION gated). Cannot verify auto-loop behaviour without a browser session and real env var."
  - test: "Book a Free Trial CTA is visible above the fold on mobile without scrolling"
    expected: "The red Book a Free Trial button in HKNav is visible in the mobile viewport (375×812) without any scroll"
    why_human: "Above-fold layout requires a real browser viewport — CSS stacking and nav height cannot be confirmed from static code analysis."
  - test: "Venue map embeds render (not placeholder fallback) at /wan-chai/ and /cyberport/"
    expected: "With NEXT_PUBLIC_WAN_CHAI_MAP_EMBED and NEXT_PUBLIC_CYBERPORT_MAP_EMBED populated, VenueMap renders the iframe embed rather than the address-text fallback"
    why_human: "Conditional rendering based on env var truth — requires env var set in a real preview deployment to verify."
  - test: "Booking form submits and arrives at HK inbox with venue pre-filled"
    expected: "Submitting /book-a-trial/free-assessment/?venue=wan-chai sends an email to the configured RESEND_TO address with 'Venue: ProGym Wan Chai' in the email body"
    why_human: "End-to-end email delivery requires RESEND_API_KEY, RESEND_TO, and RESEND_FROM in a live Vercel preview environment."
  - test: "Two-click path: any HK page → /book-a-trial/free-assessment/"
    expected: "From /gymnastics/toddlers/ (click 1: Book a Free Trial in nav) → /book-a-trial/ (click 2: Book at Wan Chai or Book at Cyberport) → assessment form. Max 2 clicks."
    why_human: "Click-count paths require real browser navigation to confirm nav link is always visible and the hub page CTA is one click away from the form."
---

# Phase 4: Hong Kong Market — Verification Report

**Phase Goal:** The full HK market — homepage, two locations, gymnastics pillar with 8 sub-programmes, camps/parties/schools/competitions, coaches, blog hub, FAQ, and book-a-trial — ships on the HK preview routes so any parent landing anywhere in the HK tree can reach a booking flow within two clicks.

**Verified:** 2026-04-24T20:00:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | HK homepage renders full PART 4 wireframe with looping hero video, venue chip row (Wan Chai + Cyberport), programme cards, location split, social proof, and visible Book a Free Trial CTA above fold on mobile | VERIFIED (code) / HUMAN NEEDED (looping video + above-fold CTA position) | `app/hk/page.tsx` (790 lines): HKHeroVideo wired, VenueChipRow, SocialProofSection, Book a Free Trial CTA at line 161 in hero. HKHeroVideo uses `autoPlay` → MuxPlayer `loop={shouldAutoPlay}`. HUMAN-ACTION: Mux playback ID not yet populated; above-fold position requires browser check. |
| 2 | /wan-chai/ and /cyberport/ show correct NAP, map embed, opening hours, programme list, venue-specific booking CTA | VERIFIED (code) / HUMAN NEEDED (map embeds require env var) | `app/hk/wan-chai/page.tsx` (339 lines): "15/F, The Hennessy, 256 Hennessy Road" confirmed, VenueMap wired, `?venue=wan-chai` CTA. `app/hk/cyberport/page.tsx` (348 lines): "5,000 sq ft" confirmed, VenueMap wired, `?venue=cyberport` CTA. SportsActivityLocation JSON-LD on both. VenueMap renders PLACEHOLDER fallback when env var empty — requires real embed URL to confirm actual map render. |
| 3 | Gymnastics pillar at /gymnastics/ plus 8 sub-pages navigable from pillar with distinct age-band content | VERIFIED | `app/hk/gymnastics/page.tsx`: GymPillarNav, FAQPage JSON-LD, BreadcrumbList. All 8 sub-pages exist (toddlers/beginner/intermediate/advanced/competitive/rhythmic/adult/private), each with unique H1 (from PROGRAMME.h1 in hk-data.ts), GymPillarNav, BreadcrumbList, booking CTA. HK nav Gymnastics dropdown iterates HK_GYMNASTICS_PROGRAMMES (8 items) dynamically. ActiveGymNavLink uses usePathname without /hk/ prefix (Pitfall 2 addressed). |
| 4 | Any HK page → /book-a-trial/ in ≤2 clicks; /book-a-trial/free-assessment/ submits booking with venue pre-filled to HK inbox | VERIFIED (code) / HUMAN NEEDED (email delivery) | HKNav desktop + mobile both have "Book a Free Trial" → `/book-a-trial/free-assessment/` (1 click). `/book-a-trial/page.tsx` has venue cards → `/book-a-trial/free-assessment/?venue=wan-chai|cyberport|no-preference` (alt 2-click path). BookingForm: `useSearchParams().get('venue')` pre-fills radio (367 lines, >200 req). Suspense boundary in parent page. API route validates venue ∈ {wan-chai, cyberport, no-preference}, childAge ∈ [1,18]. Email template renders conditional venue/childAge rows. End-to-end email delivery requires human test with live env vars. |
| 5 | /blog/, /faq/, /coaches/, /competitions-events/, /school-partnerships/, /holiday-camps/, /birthday-parties/ all render with placeholder content, unique metadata, shared HK nav — nothing 404s | VERIFIED | All 7 pages exist. Unique `export const metadata` confirmed on all 7. HKNav/HKFooter provided by `app/hk/layout.tsx` (shared). Content: holiday-camps (ProgrammeTile ×3), birthday-parties (TestimonialCard, Send an Enquiry), school-partnerships (text fallback cards — LogoWall deferred pending real logos, plan allowed "text fallback OK"), competitions-events ("Upcoming events will appear here."), coaches (HK_COACHES + Person JSON-LD combined grid), blog (HK_BLOG_POSTS_STUB + empty-state branch), faq (FAQPage JSON-LD + grouped accordion). |

**Score:** 5/5 truths verified (3 require human testing for live environment confirmation)

---

### Deferred Items

No items deferred to later phases. All phase 4 scope is implemented. HUMAN-ACTION items (Mux playback ID, Map embed URLs, real phone numbers, coach portraits, partner logos) are explicitly gated and addressed in Phase 6 (Sanity CMS content) and Phase 8 (tracking/analytics) per ROADMAP.md.

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `components/ui/navigation-menu.tsx` | shadcn NavigationMenu primitives | VERIFIED | Exists, 9+ exports including NavigationMenuIndicator and NavigationMenuViewport |
| `lib/hk-data.ts` | 6 interfaces + 5 constants | VERIFIED | 5 typed interfaces (HKVenue, HKCoach, HKBlogPost, HKFAQItem, HKGymnasticsProgramme) + 5 constants (HK_VENUES×2, HK_COACHES×3, HK_BLOG_POSTS_STUB×2, HK_FAQ_ITEMS×16, HK_GYMNASTICS_PROGRAMMES×8). 25,003 bytes. |
| `app/hk/layout.tsx` | metadataBase, Baloo 2 font, HKNav + HKFooter | VERIFIED | metadataBase=hk.proactivsports.com, `baloo.variable` wrapper div, `<HKNav>` + `<HKFooter>` wired |
| `components/hk/hk-nav.tsx` | Gymnastics dropdown 8 items, Locations dropdown, red Book CTA | VERIFIED | Iterates HK_GYMNASTICS_PROGRAMMES (8 items), Locations dropdown (Wan Chai + Cyberport), sticky red Book a Free Trial CTA at `/book-a-trial/free-assessment/` |
| `components/hk/hk-nav-mobile.tsx` | "use client", Sheet, Book CTA | VERIFIED | "use client", Sheet primitive, Book a Free Trial link |
| `app/fonts.ts` | Baloo_2 with --font-baloo variable | VERIFIED | baloo export with CSS variable `--font-baloo` |
| `lib/og-image.tsx` | createHKOgImage | VERIFIED | Exists |
| `app/hk/page.tsx` | min 350 lines, hero video, FAQPage JSON-LD, Book a Free Trial CTA | VERIFIED | 790 lines. HKHeroVideo (dynamic client component), FAQPage JSON-LD at line 108, Book a Free Trial CTA at lines 161+730 |
| `app/hk/opengraph-image.tsx` | Per-route OG for homepage | VERIFIED | Exists |
| `components/hk/venue-map.tsx` | RSC, loading="lazy", PLACEHOLDER fallback | VERIFIED | iframe with `loading="lazy"`, PLACEHOLDER branch renders address-text fallback |
| `app/hk/wan-chai/page.tsx` | "15/F, The Hennessy, 256 Hennessy Road", min 120 lines | VERIFIED | 339 lines, NAP confirmed, SportsActivityLocation JSON-LD, VenueMap, booking CTA |
| `app/hk/cyberport/page.tsx` | "5,000 sq ft", min 120 lines | VERIFIED | 348 lines, "5,000 sq ft" confirmed, SportsActivityLocation JSON-LD, VenueMap, booking CTA |
| `app/hk/wan-chai/opengraph-image.tsx` | Per-route OG | VERIFIED | Exists |
| `app/hk/cyberport/opengraph-image.tsx` | Per-route OG | VERIFIED | Exists |
| `components/hk/gymnastics-pillar-nav.tsx` | RSC, HK_GYMNASTICS_PROGRAMMES | VERIFIED | Iterates HK_GYMNASTICS_PROGRAMMES dynamically |
| `components/hk/active-gym-nav-link.tsx` | "use client", usePathname, no /hk/ prefix | VERIFIED | usePathname without /hk/ prefix (Pitfall 2 addressed) |
| `app/hk/gymnastics/page.tsx` | GymPillarNav, FAQPage JSON-LD | VERIFIED | Both present |
| `app/hk/gymnastics/opengraph-image.tsx` | Per-route OG | VERIFIED | Exists |
| 8 gymnastics sub-pages | GymPillarNav + unique H1 + BreadcrumbList + booking CTA | VERIFIED | All 8 exist, all derive unique H1 from PROGRAMME.h1 via hk-data.ts, GymPillarNav + BreadcrumbList + booking CTA confirmed |
| `app/hk/holiday-camps/page.tsx` | ProgrammeTile ×3 | VERIFIED | ProgrammeTile imported and used ×3+ |
| `app/hk/birthday-parties/page.tsx` | TestimonialCard, Send an Enquiry | VERIFIED | TestimonialCard imported and used, Send an Enquiry CTA present |
| `app/hk/school-partnerships/page.tsx` | LogoWall OR placeholder cards, Send an Enquiry | VERIFIED | Text fallback cards (plan explicitly allowed "text fallback OK" when real logos absent); Send an Enquiry CTA present |
| `app/hk/competitions-events/page.tsx` | "Upcoming events will appear here." | VERIFIED | Exact string confirmed at line 88 |
| `app/hk/coaches/page.tsx` | HK_COACHES, Person JSON-LD, combined grid | VERIFIED | HK_COACHES imported, Person JSON-LD map, lead+team combined grid |
| `app/hk/blog/page.tsx` | HK_BLOG_POSTS_STUB, empty-state | VERIFIED | Both present |
| `app/hk/faq/page.tsx` | FAQPage JSON-LD, grouped accordion | VERIFIED | FAQPage JSON-LD at line 53, grouped accordion layout |
| 4 supporting page OG images | holiday-camps, birthday-parties, coaches, blog | VERIFIED | All 4 exist |
| `app/api/contact/route.ts` | venue ∈ allowed set, childAge ∈ [1,18] | VERIFIED | ALLOWED_VENUES = ["wan-chai","cyberport","no-preference"], childAge validation present |
| `emails/contact.tsx` | conditional venue + childAge rows | VERIFIED | Conditional venue row (VENUE_LABEL map) and childAge row confirmed |
| `app/hk/book-a-trial/page.tsx` | 2 venue cards + WhatsApp | VERIFIED | HK_VENUES iterated for 2 cards, WhatsApp section env-conditional |
| `app/hk/book-a-trial/opengraph-image.tsx` | Per-route OG | VERIFIED | Exists |
| `app/hk/book-a-trial/free-assessment/page.tsx` | Suspense boundary | VERIFIED | Suspense at line 47 wrapping BookingForm |
| `app/hk/book-a-trial/free-assessment/booking-form.tsx` | "use client", useSearchParams, bot-trap, min 200 lines | VERIFIED | 367 lines. useSearchParams at line 19, `?venue=` pre-fill at line 70, name="bot-trap" at line 213, fetch POST to /api/contact at line 99-100 |
| `.env.example` | 7+ NEXT_PUBLIC_* HK vars | VERIFIED | 8 HK-specific NEXT_PUBLIC vars documented |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `app/hk/page.tsx` | `components/hk/hk-hero-video.tsx` | named import HKHeroVideo | WIRED | Import at line 50, rendered in hero section |
| `app/hk/page.tsx` | `components/hk/venue-chip-row.tsx` | VenueChipRow in VenueChipSection | WIRED | Import at line 49, used at line 193 |
| `app/hk/layout.tsx` | `components/hk/hk-nav.tsx` + `hk-footer.tsx` | named imports | WIRED | Both imported and rendered at lines 71+73 |
| `components/hk/hk-nav.tsx` | `lib/hk-data.ts` | HK_GYMNASTICS_PROGRAMMES, HK_VENUES | WIRED | Iterates both for dropdown rendering |
| `components/hk/gymnastics-pillar-nav.tsx` | `lib/hk-data.ts` | HK_GYMNASTICS_PROGRAMMES | WIRED | Dynamic map over 8 items |
| `app/hk/gymnastics/*/page.tsx` (8) | `components/hk/gymnastics-pillar-nav.tsx` | GymPillarNav | WIRED | Imported and rendered in each sub-page |
| `app/hk/wan-chai/page.tsx` | `components/hk/venue-map.tsx` | VenueMap | WIRED | Import at line 14, rendered with WAN_CHAI_MAP_EMBED env var |
| `app/hk/cyberport/page.tsx` | `components/hk/venue-map.tsx` | VenueMap | WIRED | Import at line 14, rendered with CYBERPORT_MAP_EMBED env var |
| `app/hk/book-a-trial/free-assessment/booking-form.tsx` | `/api/contact` | fetch POST at line 99 | WIRED | fetch('/api/contact', { method: 'POST' }) confirmed |
| `app/hk/book-a-trial/free-assessment/booking-form.tsx` | URL `?venue=` param | useSearchParams().get('venue') at line 70 | WIRED | Pre-fills venue radio card on load |
| `app/hk/book-a-trial/free-assessment/page.tsx` | `booking-form.tsx` | Suspense wrapping | WIRED | Suspense at line 47 confirmed |
| `app/api/contact/route.ts` | `emails/contact.tsx` | venue + childAge forwarded | WIRED | Validated venue and childAge passed to email template |
| `components/hk/hk-hero-video.tsx` | `components/ui/video-player.tsx` | VideoPlayer with autoPlay | WIRED | autoPlay prop at line 58; VideoPlayer uses loop={shouldAutoPlay} |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|-------------------|--------|
| `app/hk/page.tsx` hero | playbackId | NEXT_PUBLIC_MUX_HK_HERO_PLAYBACK_ID env var | HUMAN-ACTION gated — empty until client provides ID | STATIC (env-gated, intentional) |
| `app/hk/wan-chai/page.tsx` | VENUE | HK_VENUES.find(id==='wan-chai') build-time | Real data from hk-data.ts constant | FLOWING |
| `app/hk/cyberport/page.tsx` | VENUE | HK_VENUES.find(id==='cyberport') build-time | Real data from hk-data.ts constant | FLOWING |
| `app/hk/gymnastics/*/page.tsx` | PROGRAMME | HK_GYMNASTICS_PROGRAMMES.find(slug) build-time | Real data per slug from hk-data.ts | FLOWING |
| `app/hk/coaches/page.tsx` | HK_COACHES | lib/hk-data.ts constant (3 coaches, 2 HUMAN-ACTION TBD) | 1 real coach (Monica), 2 placeholder shells | FLOWING (partial — portraits HUMAN-ACTION gated) |
| `app/hk/faq/page.tsx` | HK_FAQ_ITEMS | lib/hk-data.ts constant (16 items) | Real FAQ data | FLOWING |
| `app/hk/blog/page.tsx` | HK_BLOG_POSTS_STUB | lib/hk-data.ts constant (2 stubs) | Stub data — real content via Sanity in Phase 6 | STATIC (intentional stub, Phase 6 deferred) |
| `app/hk/book-a-trial/free-assessment/booking-form.tsx` | venue (radio pre-fill) | useSearchParams().get('venue') | URL param from linking pages | FLOWING |

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| All 21 HK page files exist | `find app/hk -name "page.tsx"` | 21 files found | PASS |
| booking-form.tsx exceeds 200 lines | `wc -l` | 367 lines | PASS |
| booking-form submits to /api/contact | grep fetch in booking-form.tsx | `fetch('/api/contact', { method: 'POST' })` at line 99 | PASS |
| API route validates venue enum | grep ALLOWED_VENUES in route.ts | `["wan-chai","cyberport","no-preference"]` confirmed | PASS |
| HK nav has Book a Free Trial CTA | grep hk-nav.tsx | Link to `/book-a-trial/free-assessment/` confirmed | PASS |
| End-to-end email delivery | Requires live Vercel preview + env vars | Cannot test without deployment | SKIP |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| HK-01 | 04-03-PLAN.md | HK homepage per PART 4 wireframe | SATISFIED | app/hk/page.tsx 790 lines, all 12 sections, FAQPage JSON-LD, hero video, venue chips, social proof, CTAs |
| HK-02 | 04-04-PLAN.md | /wan-chai/ location page | SATISFIED | 339 lines, correct NAP, VenueMap, SportsActivityLocation JSON-LD, booking CTA |
| HK-03 | 04-04-PLAN.md | /cyberport/ location page | SATISFIED | 348 lines, "5,000 sq ft", VenueMap, SportsActivityLocation JSON-LD, booking CTA |
| HK-04 | 04-05-PLAN.md | /gymnastics/ + 8 sub-pages | SATISFIED | Pillar page + all 8 sub-pages, GymPillarNav, unique H1 per page, BreadcrumbList, booking CTAs |
| HK-05 | 04-06-PLAN.md | /holiday-camps/ pillar | SATISFIED | ProgrammeTile ×3 (Easter/Summer/Christmas), unique metadata, Send an Enquiry CTA |
| HK-06 | 04-06-PLAN.md | /birthday-parties/ hub | SATISFIED | TestimonialCard, Send an Enquiry CTA, unique metadata |
| HK-07 | 04-06-PLAN.md | /school-partnerships/ page | SATISFIED | Text fallback cards (plan-approved substitute for LogoWall), Send an Enquiry CTA, unique metadata |
| HK-08 | 04-06-PLAN.md | /competitions-events/ page | SATISFIED | "Upcoming events will appear here." confirmed, unique metadata |
| HK-09 | 04-06-PLAN.md | /coaches/ HK team bios | SATISFIED | HK_COACHES (3 entries), Person JSON-LD, combined grid; coach portraits HUMAN-ACTION gated per plan |
| HK-10 | 04-06-PLAN.md | /blog/ HK editorial hub | SATISFIED | HK_BLOG_POSTS_STUB + empty-state branch; real CMS content deferred to Phase 6 per plan |
| HK-11 | 04-06-PLAN.md | /faq/ HK FAQ hub | SATISFIED | FAQPage JSON-LD (16 items), grouped accordion, unique metadata |
| HK-12 | 04-07-PLAN.md | /book-a-trial/ + /free-assessment/ | SATISFIED | Hub page with 2 venue cards, assessment form with venue pre-fill, Suspense boundary, API validation, email template |

All 12 HK requirements (HK-01 through HK-12) are covered by Phase 4 plans and implementation evidence. No orphaned requirements found.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `app/hk/page.tsx` | 618 | "New posts coming soon." | Info | Expected empty-state copy — blog content is Phase 6 Sanity work. Not a blocker. |
| `app/hk/school-partnerships/page.tsx` | 36-39 | Placeholder school names ("International School A/B/C/D") | Info | Plan-approved text fallback. Real logos/names are HUMAN-ACTION gated. Not a blocker. |
| `lib/hk-data.ts` | HK_COACHES | 2 of 3 coaches are HUMAN-ACTION TBD shells | Info | Plan-documented. Coach portraits and bios are a HUMAN-ACTION gate. Phase 6 will populate via Sanity. |

No blockers or warnings. All anti-pattern matches are intentional stubs explicitly documented in plan/summary files.

---

### Human Verification Required

#### 1. Looping hero video above fold on mobile

**Test:** On a mobile viewport (375×812), open the HK homepage preview URL with NEXT_PUBLIC_MUX_HK_HERO_PLAYBACK_ID set to a real Mux ID.

**Expected:** The hero video starts playing automatically (muted, silent) and loops. The single LCP priority Image poster is visible during initial load. The Book a Free Trial CTA button is visible without scrolling.

**Why human:** Requires a real Mux playback ID (HUMAN-ACTION gated), a live Vercel preview deployment, and a real browser viewport to confirm both the loop behaviour and the above-fold CTA position.

#### 2. Venue map embeds render at /wan-chai/ and /cyberport/

**Test:** Set NEXT_PUBLIC_WAN_CHAI_MAP_EMBED and NEXT_PUBLIC_CYBERPORT_MAP_EMBED to real Google Maps embed URLs. Open both pages on a Vercel preview.

**Expected:** VenueMap renders the `<iframe>` embed (not the address-text fallback). The map is visible and interactive.

**Why human:** VenueMap conditionally renders iframe vs text fallback based on env var value. Requires a real embed URL in a live deployment.

#### 3. Booking form submits and email arrives with venue pre-filled

**Test:** Visit `/book-a-trial/free-assessment/?venue=cyberport` on a Vercel preview with RESEND_API_KEY, RESEND_TO, and RESEND_FROM set. Fill required fields and submit.

**Expected:** The form shows "Thanks — your free assessment request is in." The email inbox at RESEND_TO receives an email with "Venue: ProGym Cyberport" in the body and child's age if entered.

**Why human:** End-to-end email delivery requires live Resend credentials and cannot be verified from static analysis.

#### 4. Two-click path from a deep HK page to booking form

**Test:** Navigate to `/gymnastics/toddlers/` on a Vercel preview. Click the "Book a Free Trial" button in the nav (click 1). On the booking hub page, click "Book at Wan Chai" (click 2).

**Expected:** You arrive at `/book-a-trial/free-assessment/?venue=wan-chai` with the Wan Chai radio card pre-selected. Total: 2 clicks from a deep gymnastics page to a pre-filled booking form.

**Why human:** Click-count UX requires real browser navigation to confirm the nav CTA is always visible at all viewport sizes and the hub page venue card correctly deep-links.

---

### Gaps Summary

No blocking gaps found. All 5 ROADMAP success criteria are met at the code level:

1. SC1 (HK homepage): `app/hk/page.tsx` ships all 12 sections including hero video component (HUMAN-ACTION gated on Mux ID), VenueChipRow, programme cards, location split, SocialProofSection, and Book a Free Trial CTA in hero and FAQ section. Above-fold position requires human browser check.

2. SC2 (Venue pages): Both `/wan-chai/` and `/cyberport/` have correct NAP strings, VenueMap (PLACEHOLDER-fallback), opening hours, programme list from HK_VENUES, and `?venue=` pre-filled booking CTAs. Map rendering requires real embed URL.

3. SC3 (Gymnastics): 9 pages (pillar + 8 sub-pages) all exist, all carry GymPillarNav, each sub-page has a distinct H1 driven by `PROGRAMME.h1` from hk-data.ts, and the HK nav dropdown iterates all 8 via HK_GYMNASTICS_PROGRAMMES.

4. SC4 (Two-click booking): HKNav and HKNavMobile both have a Book a Free Trial CTA linking directly to `/book-a-trial/free-assessment/`. The booking hub provides venue-specific CTAs. BookingForm uses useSearchParams for pre-fill, has bot-trap honeypot, posts to `/api/contact` which validates venue enum and childAge, and the email template renders conditional venue/childAge rows.

5. SC5 (7 supporting pages): All 7 render with content, unique metadata, and shared HK nav (via layout). No 404s. LogoWall deviation (text fallback on school-partnerships) is plan-approved.

The 4 human verification items are environmental/runtime checks that cannot be satisfied from static code analysis. They require a live Vercel preview with real env vars (Mux ID, Map embed URLs, Resend credentials).

---

_Verified: 2026-04-24T20:00:00Z_
_Verifier: Claude (gsd-verifier)_

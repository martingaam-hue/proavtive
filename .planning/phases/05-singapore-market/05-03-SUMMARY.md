---
phase: 05-singapore-market
plan: "03"
subsystem: sg-homepage
tags: [sg, homepage, multiball, json-ld, hero-video, faq, conversion]
dependency_graph:
  requires: [05-01, 05-02]
  provides: [app/sg/page.tsx, components/sg/sg-hero-video.tsx]
  affects: [SG-01 requirement]
tech_stack:
  added: []
  patterns:
    - SGHeroVideo client component (mirrors HKHeroVideo — VideoPlayer no double-dynamic)
    - SG_HOMEPAGE_FAQS filter drives both FAQPage JSON-LD and DOM FAQ rendering (char-for-char match)
    - MultiBall Pattern 11 — 3 placements on homepage
    - Mobile order-first on Sports+MultiBall zone card (Tailwind order-first md:order-none)
key_files:
  created:
    - components/sg/sg-hero-video.tsx
  modified:
    - app/sg/page.tsx (replaced Phase 1 stub, ~480 lines → 820 lines)
    - app/sg/page.test.ts (Rule 1 fix: added CardHeader + CardContent to Card mock)
decisions:
  - SGHeroVideo does not wrap VideoPlayer in next/dynamic — VideoPlayer already handles ssr:false internally
  - SG_HOMEPAGE_FAQS filtered to groups [about, classes, venue, multiball].slice(0,8) — same array drives JSON-LD and DOM
  - Blog section renders text-only cards (no heroImage) for stub posts to avoid broken images on sg-data stub
  - Coach bio links use slug derived from name.toLowerCase().replace(/\s+/g, '-')
metrics:
  duration: "~30 min"
  completed: "2026-04-25"
  tasks: 2
  files: 3
---

# Phase 5 Plan 03: SG Homepage Production Build Summary

**One-liner:** Full 13-section SG homepage with MultiBall differentiator at 3 placements, Book CTA above fold, FAQPage + WebSite JSON-LD, and SGHeroVideo client component with poster fallback.

## Tasks Completed

### Task 1: components/sg/sg-hero-video.tsx
**Commit:** `5a8f923`

Created `SGHeroVideo` client component mirroring `HKHeroVideo` verbatim with 5 substitutions:
- `HKHeroVideoProps` → `SGHeroVideoProps`
- `HKHeroVideo` → `SGHeroVideo`
- Comment block updated to reference Phase 5 / Plan 05-03 and Prodigy camp-day montage
- CRITICAL: Does NOT wrap VideoPlayer in `next/dynamic` — VideoPlayer wraps MuxPlayer internally (ssr:false handled at VideoPlayer level)

Files: `components/sg/sg-hero-video.tsx` (53 lines)

Acceptance criteria verified:
- `"use client"` as first non-comment line
- `SGHeroVideoProps` interface exported
- `SGHeroVideo` function exported
- `VideoPlayer` imported and used
- `Image` with `fill` + `priority` for LCP
- `grep -c "dynamic(" components/sg/sg-hero-video.tsx` → 0

### Task 2: app/sg/page.tsx — 13-section SG homepage
**Commit:** `871bd89`

Replaced Phase 1 teal-stripe stub (~14 lines) with production SG homepage (~820 lines):

**13 sections in order:**
1. **HeroSection** — SGHeroVideo + navy/40 overlay + H1 verbatim + MultiBall trust line (Pattern 11 placement 1) + red Book a Free Trial CTA
2. **VenueChipRowSection** — VenueChipRow from Plan 05-02
3. **WhyProdigySection** — 4-tile grid; Tile 1 = MultiBall flagship (Pattern 11 placement 2) with Zap icon + green badge
4. **ProgrammesSection** — 4 ProgrammeTile cards (Weekly Classes / Prodigy Camps / Birthday Parties / School Partnerships)
5. **ThreeZonesSection** — 3 zone cards from SG_ZONES; Sports+MultiBall carries green badge (Pattern 11 placement 3) + `order-first md:order-none` for mobile reshuffle
6. **SocialProofSection** — navy bg + LogoWall (IFS + KidsFirst) + TestimonialCard (East Coast parent — not Manjula from root)
7. **CampsFeatureSection** — photo-left-copy-right card for Ninja Warrior Camp stub (16–20 June, Ages 5–12)
8. **BirthdayPartySection** — 2-col with MultiBall wall access bullet + Send an Enquiry CTA → `/book-a-trial/?subject=birthday-party`
9. **CoachesSection** — 3-col grid mapping SG_COACHES (Haikel / Mark / Coach King) with Avatar portraits (D-07 gate 3)
10. **AboutSection** — 2-col prose + photo with cross-market HK link via `NEXT_PUBLIC_HK_URL`
11. **BlogSection** — text-only card for SG_BLOG_POSTS_STUB (1 post); no image src used to avoid broken image
12. **FAQSection** — `SG_HOMEPAGE_FAQS.map(item => <FAQItem .../>)` in `div.space-y-2` (NO parent Accordion)
13. **FinalCTASection** — navy full-bleed + red Book CTA + conditional WhatsApp chip (`NEXT_PUBLIC_WHATSAPP_SG`)

**Metadata + JSON-LD:**
- `metadata.openGraph.locale: "en_SG"`, canonical `https://sg.proactivsports.com/`
- `sgHomeSchema` with `@graph: [WebSite, FAQPage]`
- `SG_HOMEPAGE_FAQS` (filtered from SG_FAQ_ITEMS, groups: about/classes/venue/multiball, slice 0–8) drives both JSON-LD `mainEntity` and DOM rendering

## Test Status

**Wave-0 scaffold (`app/sg/page.test.ts`):** RED → GREEN

| Test | Status |
|------|--------|
| Single H1 containing "Where Singapore's kids come to move, play, and grow." | PASS |
| Link to /katong-point/ (venue chip) | PASS |
| "Singapore's only MultiBall wall" trust-line text | PASS |
| Link to /book-a-trial/ with text "Book a Free Trial" | PASS |

**Placeholder guard (`tests/no-sg-placeholder-leak.test.ts`):** GREEN (0 violations)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Extended Card mock in page.test.ts to include CardHeader + CardContent**
- **Found during:** Task 2 — test run
- **Issue:** Wave-0 test scaffold mocked `@/components/ui/card` with only `Card` export; `ProgrammeTile` imports `CardHeader` and `CardContent` from the same module, causing "No CardHeader export is defined" error
- **Fix:** Added `CardHeader` and `CardContent` pass-through mocks to the `vi.mock("@/components/ui/card")` call in `app/sg/page.test.ts`
- **Files modified:** `app/sg/page.test.ts`
- **Commit:** `871bd89` (included with Task 2)

**2. [Rule 1 - Bug] Removed "sg-placeholder" string from comment in page.tsx**
- **Found during:** Task 2 — placeholder-leak test run
- **Issue:** Blog section comment included "sg-placeholder-*" literally, triggering the D-07 filesystem grep guard in `tests/no-sg-placeholder-leak.test.ts`
- **Fix:** Rewrote comment to reference D-07 without the literal pattern string
- **Files modified:** `app/sg/page.tsx`
- **Commit:** `871bd89` (included with Task 2)

**3. [Rule 1 - Bug] Removed "dynamic(" from sg-hero-video.tsx comments**
- **Found during:** Task 1 — acceptance criteria check
- **Issue:** Comment block included `dynamic({ssr:false})` literally, which would cause `grep -c "dynamic(" sg-hero-video.tsx` to return non-zero (failing acceptance criteria)
- **Fix:** Rewrote comments to describe the pattern without using `dynamic(` literal
- **Files modified:** `components/sg/sg-hero-video.tsx`
- **Commit:** `5a8f923` (included with Task 1)

**4. [Rule 3 - Blocking] ProgrammeTile prop names differ from plan**
- **Found during:** Task 2 — reading ProgrammeTile source
- **Issue:** Plan used `{ageBand, image, alt, tagline}`; actual ProgrammeTile props are `{title, ageRange, description, imageSrc, imageAlt, href, duration?}` (same pattern as HK Rule 3 deviation in 04-03)
- **Fix:** Used actual prop names
- **Files modified:** `app/sg/page.tsx`

**5. [Rule 3 - Blocking] FAQItem id prop vs value field**
- **Found during:** Task 2 — reading FAQItem source
- **Issue:** Plan said `value={item.value}` but FAQItem prop is `id?: string` (not `value`). The `item.value` field in SG_FAQ_ITEMS is the accordion value key — passed as `id` to FAQItem
- **Fix:** Used `id={item.value}` per actual FAQItem interface
- **Files modified:** `app/sg/page.tsx`

## HUMAN-ACTION Gates

| Gate | Status | Details |
|------|--------|---------|
| D-07 gate 1 — SG hero poster | Unset | `/photography/sg-venue-katong-hero.webp` not yet dropped. Broken-image fallback acceptable per D-10 precedent. Page still renders. |
| D-07 gate 3 — Coach portraits | Unset | `/photography/coach-haikel-portrait.webp`, `coach-mark-portrait.webp`, `coach-king-portrait.webp` not yet dropped. Broken-image fallback acceptable. |
| `NEXT_PUBLIC_MUX_SG_HERO_PLAYBACK_ID` | Unset | Video poster-only fallback ships cleanly when missing. |
| `NEXT_PUBLIC_WHATSAPP_SG` | Optional | WhatsApp chip conditionally renders only when set. Plan lists `+6598076827` as the value. |
| `NEXT_PUBLIC_HK_URL` | Optional | Cross-market link falls back to `#` if unset. |
| D-11 IFS/KidsFirst logos | Unset | Logo paths `/photography/logo-ifs.webp` and `/photography/logo-kidsfirst.webp` need permission + real files. Text alt fallback renders. |

## Known Stubs

| Stub | File | Reason |
|------|------|--------|
| Blog post heroImage not rendered | `app/sg/page.tsx` BlogSection | SG_BLOG_POSTS_STUB has 1 post with `heroImage: "/photography/sg-venue-katong-hero.webp"` (D-07 gate 1). Blog cards render text-only to avoid broken image in stub state. Phase 6 CMS wires real images. |
| Camp date hardcoded: "Ninja Warrior Camp · 16–20 June · Ages 5–12" | `app/sg/page.tsx` CampsFeatureSection | Phase 6 CMS replaces with real Event schema-backed camp data. |

## Checkpoint: Awaiting Human Visual Verification (Task 3)

This plan is NOT autonomous — it ends with a `checkpoint:human-verify` gate. The code is complete and tests are GREEN. Human visual verification is required before proceeding to Plan 05-04.

**Verification checklist** (full details in 05-03-PLAN.md §Task 3):
1. Above-fold conversion (desktop): H1, "Singapore's only MultiBall wall", red Book CTA, SGNav CTA
2. Mobile viewport (390×844): red Book CTA above fold, hamburger drawer, sticky red Book at bottom
3. MultiBall differentiator: hero trust line, WhyProdigy tile 1 with Zap + green badge, ThreeZones Sports card
4. Mobile reshuffle: Sports+MultiBall zone card FIRST on mobile
5. Social proof: navy section with LogoWall + testimonial
6. Coaches section: Haikel, Mark, Coach King names (broken portraits acceptable)
7. Final CTA: navy full-bleed + red Book + optional WhatsApp
8. Footer: single Katong Point NAP
9. Console: zero hydration warnings, zero missing-key warnings
10. JSON-LD in `<head>`: WebSite + FAQPage, mainEntity matches DOM FAQ order

**Start dev server:** `pnpm dev` → visit `http://sg.localhost:3000/`

**After approval:** Type "approved" to proceed to Plan 05-04.

## Checkpoint Approval

*Awaiting Martin's visual verification and "approved" signal.*

## Links to Next Plans

- **05-04** — Weekly classes pillar + zone sub-pages (Wave 3, can parallelize)
- **05-05** — Katong Point location page (Wave 3, can parallelize)
- **05-06** — Camps + parties + coaches + FAQ + book-a-trial pages (Wave 3, can parallelize)

## Self-Check

**Files created/modified:**
- `components/sg/sg-hero-video.tsx` — FOUND (committed 5a8f923)
- `app/sg/page.tsx` — FOUND (committed 871bd89)
- `app/sg/page.test.ts` — FOUND (committed 871bd89)

**Commits:**
- `5a8f923` — SGHeroVideo component
- `871bd89` — SG homepage production build

## Self-Check: PASSED

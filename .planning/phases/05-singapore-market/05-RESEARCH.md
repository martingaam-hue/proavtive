---
phase: 05-singapore-market
type: research
status: complete
produced_by: gsd-phase-researcher
updated: 2026-04-24
---

# Phase 5: Singapore Market — Research

**Researched:** 2026-04-24
**Domain:** Next.js 15 App Router multi-page SG market build · Prodigy sub-brand identity · 3-zone pillar architecture · IFS school partnership page · MultiBall differentiator treatment · sg-placeholder photo replacement · Katong Point location page · booking form SG routing extension
**Confidence:** HIGH for Next.js patterns and all code-level concerns (carry-forward from Phase 4 verified research). HIGH for strategy content (verbatim from strategy.md PARTS 5 / 6C / 8 / 12). HIGH for SG identity decisions (Prodigy / Baloo / MultiBall all explicit in PROJECT.md and strategy). MEDIUM for MultiBall visual treatment (no existing asset; strategy describes the differentiator but leaves visual execution open). LOW for SG coach photography / exact Katong Point opening hours (HUMAN-ACTION).

---

## Summary

Phase 5 is a **content composition phase, near-identical in technical shape to Phase 4**, but with a distinct brand voice (Prodigy, multi-sport, MultiBall as headline differentiator) and one structural difference: the SG pillar architecture splits into **three zones under `/weekly-classes/`** (Movement / Sports+MultiBall / Climbing) and **three camp types under `/prodigy-camps/`** (themed / multi-activity / gymnastics), where HK had one gymnastics pillar with 8 age-banded sub-pages.

The ~15 SG pages assemble from Phase 2 primitives + Phase 3 contact backend + Phase 4 patterns. No new design-system tokens. No new shadcn primitives. No new backend routes. The existing `/api/contact/route.ts` already accepts `market: "sg"` and routes to `CONTACT_INBOX_SG` — the booking form extension is a zero-line-of-backend change [VERIFIED: app/api/contact/route.ts — line "market !== 'hk' && market !== 'sg'" accepts both markets].

The five most material Phase 5 decisions are:

1. **SG hero video parity with HK** — strategy PART 5 §1 explicitly specifies a "Hero video: quick cuts from a Prodigy camp day (climbing wall, MultiBall, sports zone, laughter)." This is the same `<VideoPlayer>` Phase 2 primitive used on the HK homepage, with a Prodigy-specific Mux playback ID and a Katong Point photography poster fallback. **HUMAN-ACTION**: `NEXT_PUBLIC_MUX_SG_HERO_PLAYBACK_ID` env var + poster image (requires replacing `sg-placeholder-*` with a real Katong Point frame, or deferring the poster until then).

2. **sg-placeholder photography replacement is the single biggest HUMAN-ACTION** — the Phase 2 D-07 curated set contains ONE SG image (`sg-placeholder-climbing-unsplash-trinks.*`, Unsplash License, David Trinks). This is not real Katong Point and cannot ship to production. Phase 5 Execute pauses for Katong Point photography curation: real Movement Zone / Sports Zone+MultiBall / Climbing Zone / venue exterior / coach portraits / birthday party setup / camp action. Until replaced, the single placeholder is used sparingly (explicitly marked in its filename), and Phase 5 pages fall back to navy solid colour blocks or text-led sections where real SG imagery is required. NO use of HK photography as SG fill content — that would break the distinct-product narrative of PART 1.

3. **Baloo 2 is NOT the default SG font — Manrope is.** Phase 2 D-03 states verbatim: "Baloo 2 is scoped to ProGym contexts only — Wan Chai + Cyberport HK location pages, and any ProGym-branded surfaces elsewhere." Prodigy is the SG sub-brand, not a ProGym context. The SG tree uses `--font-display` (Unbounded) + `--font-sans` (Manrope) — same as the root gateway. This is **counter to the PROJECT.md "Key Decisions" line** ("Baloo is specified for Prodigy contexts"), but the authoritative source here is Phase 2 D-03 which explicitly locked Baloo to ProGym. **This is a flagged assumption — see Assumptions Log A1 below.** If the Baloo-for-Prodigy claim is correct, Phase 5 must either (a) escalate this as a D-03 amendment via /gsd-discuss-phase, or (b) re-interpret Phase 2 D-03 as "Baloo wherever a sub-brand wants punchy display accents" and activate it on the SG tree the same way Phase 4 activates it for HK ProGym. Recommend option (a): ask the user to lock Prodigy-font behaviour in discuss-phase before planning, or accept Manrope-only SG typography.

4. **MultiBall differentiator needs no new component** — strategy treats "Singapore's only MultiBall wall" as a copy-first differentiator, not a tech demo. It appears in headline/trust line on SG homepage, carries the Sports Zone page, and is referenced in FAQ. Implementation is a combination of (a) existing Phase 2 primitives (`<Badge>` for the "only in Singapore" trust line, `<Section>` + `<ContainerEditorial>` for the dedicated MultiBall block on the Sports Zone page), (b) a real MultiBall photo (HUMAN-ACTION — replaces sg-placeholder), and (c) a short editorial paragraph per PART 5 §2. No interactive demo, no custom viz component, no new npm dependency. If a future phase wants a video clip of MultiBall in action, that's a Phase 10 Mux upload — not Phase 5 work.

5. **IFS school partnership is NOT a named-partner landing page — it's a section on the generic `/school-partnerships/` hub.** Strategy PART 12 Tier 2 #18 lists "SG /school-partnerships/ (including IFS)" as a single page — IFS is surfaced inline as the lead example. No `/school-partnerships/international-french-school/` dynamic route. This is a static page with one editorial block specifically calling out IFS (with logo if permission granted, text-only otherwise), plus a partnership-enquiry CTA that pre-fills `?subject=school-partnership` on the booking form. Phase 6 CMS can split IFS into its own page if the client wants it; Phase 5 ships the consolidated hub.

**Primary recommendation:** Build SG pages in **5 plans, mirroring Phase 4 plan structure**: (1) SG layout foundation + SGNav + SGFooter + metadata base, (2) SG homepage (13 sections per PART 5), (3) Katong Point location page, (4) `/weekly-classes/` pillar + 3 zone sub-pages AND `/prodigy-camps/` pillar + 3 camp-type sub-pages, (5) remaining 8 pages (birthday-parties / school-partnerships / events / coaches / blog / faq / book-a-trial / +1 buffer). Mirror Phase 4's Plan 04-XX structure, rename patterns to `sg-*`, and carry forward every pattern verbatim where possible. [VERIFIED: Phase 4 RESEARCH.md + CONTEXT.md both present and locked]

---

## User Constraints

*(CONTEXT.md not yet produced for Phase 5 — Phase 5 will run discuss-phase before plan-phase. Below are the constraints explicitly committed from prior phase decisions and PROJECT.md — they function as locked decisions for Phase 5 research.)*

### Locked Decisions (from prior-phase decisions that apply to SG)

- **Subdomain routing:** `sg.proactivsports.com` → `app/sg/` via Phase 1 middleware rewrite. No URL shows `/sg/` — browser URL bar stays `sg.proactivsports.com/katong-point/` etc. [Phase 1 D-02, D-04]
- **Contact backend:** `/api/contact/route.ts` accepts `market: "sg"`, routes to `CONTACT_INBOX_SG` env var. SG pages use the same handler with `market: "sg"` — NO new backend. [Phase 3 D-01, verified in route.ts source]
- **SG WhatsApp:** `NEXT_PUBLIC_WHATSAPP_SG=+6598076827` per strategy PART 8.3. HUMAN-ACTION at execute time. [Phase 3 D-02]
- **Resend sender:** `onboarding@resend.dev` at Phase 5 (same as Phase 3/4). Phase 10 swaps to `noreply@proactivsports.com`. [Phase 3 D-05]
- **Spam protection:** Honeypot only (`bot-trap` field). No CAPTCHA. [Phase 3 D-04]
- **Market-scoped components:** SG components live in `components/sg/`, NOT `components/ui/`. [Phase 3 D-11]
- **Real photography only:** No silhouettes, no initials-only placeholders, no stock images for coach portraits or venue hero. Missing photos trigger HUMAN-ACTION checkpoint. [Phase 3 D-10 carry-forward, Phase 4 D-09 confirms]
- **Stock photography exception (pre-existing):** The single `sg-placeholder-climbing-unsplash-trinks.*` from Phase 2 D-07 is permitted as a gallery-only asset; Phase 5 REPLACES it with real Katong Point imagery before any SG page ships visual-verify. [Phase 2 D-07, amended]
- **Typography defaults:** Unbounded (display) + Manrope (body) on SG. Baloo 2 scoping is unresolved — see Summary #3 and Assumptions Log A1. [Phase 2 D-03]
- **Static routes only at Phase 5:** No `[slug]` dynamic segments. CMS + dynamic routing is Phase 6. Coaches, blog posts, camp weeks all hardcoded as TS arrays with Phase 6-migration-ready shapes. [Phase 4 carry-forward]
- **`metadataBase` must be SG-specific:** `app/sg/layout.tsx` declares `metadataBase: new URL("https://sg.proactivsports.com")`. NOT inherited from root. [Phase 4 D-01 pattern carry-forward]

### Claude's Discretion

- SG blog stub count (0 / 1 / 3 posts) — planner picks; recommend 1 "coming soon" stub to prove the responsive grid (per PART 5 §10).
- `/events/` content scope — sports days and community events are not yet dated; planner picks between evergreen editorial page vs. placeholder-with-list-pattern. Recommend evergreen + future-Event-schema stub (Phase 6 CMS adds real dates).
- Zone sub-page layout template — planner decides the shared shell structure for Movement / Sports+MultiBall / Climbing (they share 80% of structure, differ in hero image, age band, apparatus list, safety note).
- Camp-type sub-page layout template — same: themed / multi-activity / gymnastics camps share structure, differ in age band, theme list, safety note.
- SGFooter column layout — mirror HKFooter once Phase 4 lands. Single NAP (Katong Point), WhatsApp, social links, cross-market link to HK.
- Map embed approach — Google Maps iframe embed (zero bundle, zero API key — verified in Phase 4 research). Same `VenueMap` component pattern, different embed URL.
- OG image template — same `createSGOgImage()` utility mirroring `createHKOgImage()` / `createRootOgImage()`; per-page title/tagline; Prodigy-forward background (consider brand green or sky vs. HK's brand navy, for visual distinction across markets).

### Deferred Ideas (OUT OF SCOPE for Phase 5)

- Real Mux SG hero video playback — ID-dependent HUMAN-ACTION; poster fallback is sufficient to ship.
- Named IFS sub-page (`/school-partnerships/international-french-school/`) — consolidated on the hub per Phase 5 strategy interpretation; revisit at Phase 6 CMS if editor wants separate pages.
- Multilingual SG content (zh-SG, Mandarin, Bahasa) — v1.5 / POST-03.
- Real camp-week Event schema — Phase 6 (needs CMS-driven start/end dates, offer prices).
- ProActiv internal booking platform integration (iClassPro / JackRabbit / TeamSnap) — Phase 10+ only if the client moves off WhatsApp-led trial flow.
- MultiBall interactive tech demo on the Sports Zone page — strategy describes MultiBall as projection + sensor hardware; any interactive embed is a Phase 10+ R&D concern, not a Phase 5 content-composition page.

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SG-01 | SG homepage per strategy PART 5 wireframe + PART 6C copy | Pattern 1 (SG layout), Pattern 2 (hero video, poster fallback), Section Map code example — 13 sections mapped to Phase 2 primitives |
| SG-02 | `/katong-point/` Prodigy location page (451 Joo Chiat Rd, Level 3, "Singapore's only MultiBall wall") | Pattern 3 (map embed — same as Phase 4), Pattern 7 (LocalBusiness `SportsActivityLocation` JSON-LD with SG parentOrganization), Location Page Structure code example |
| SG-03 | `/weekly-classes/` pillar + Movement / Sports+MultiBall / Climbing zone sub-pages | Pattern 6 (pillar nav — ZonesPillarNav mirrors GymnasticsPillarNav), Zone Sub-Page Template code example, 3 static routes under `app/sg/weekly-classes/` |
| SG-04 | `/prodigy-camps/` pillar + themed / multi-activity / gymnastics camp sub-pages | Pattern 6 (pillar nav — CampsPillarNav), Camp Sub-Page Template code example, 3 static routes under `app/sg/prodigy-camps/` |
| SG-05 | `/birthday-parties/` SG hub | Static page composition from Phase 2 primitives; booking CTA with `?subject=birthday-party`; Party Room + MultiBall-access copy from PART 6C §7 |
| SG-06 | `/school-partnerships/` SG (with IFS) | Static editorial page; IFS called out inline (see Pattern 10 below); partnership CTA `?subject=school-partnership`; optional logo if permission granted |
| SG-07 | `/events/` sports days, community events | Evergreen page at Phase 5 (planner's discretion); Phase 6 CMS adds dated Event schema entries. Strategy references KidsFirst sports day in PART 6C testimonial — single proof point usable now. |
| SG-08 | `/coaches/` SG team bios | Hardcoded TS array with Phase 6-migration-ready shape (Haikel, Mark, Coach King per PART 6C §8); HUMAN-ACTION on portrait photos |
| SG-09 | `/blog/` SG editorial hub | Pattern 5 (blog stub — same schema as Phase 4 `BlogPostStub`); 0–1 stub post at Phase 5 |
| SG-10 | `/faq/` SG FAQ hub (FAQPage schema) | shadcn `Accordion` (already installed); 10 Q&A from PART 6C §11 wired into FAQPage JSON-LD |
| SG-11 | `/book-a-trial/` SG conversion hub | Pattern 4 (booking form extending Phase 3 handler); `market: "sg"` not "hk"; venue field dropped or fixed to "katong-point" since only one SG venue exists |

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| SG homepage (13 sections) | Frontend Server (RSC) | CDN (Vercel static) | App Router RSC; no client state above the fold; static at build |
| Looping hero video | Browser / Client | CDN (Mux) | `<VideoPlayer>` is `'use client'` with `dynamic({ssr:false})` (Phase 2 D-06 pattern); Mux delivers the stream |
| Video poster image (Katong Point) | CDN (Vercel Image Opt.) | Browser | `next/image` with `priority`; HUMAN-ACTION: real Katong Point photography replaces sg-placeholder |
| Chip row (Katong Point) | Frontend Server (RSC) | — | Static data; single venue chip — simpler than HK's two-venue pattern |
| Programme cards (4 programmes per PART 5 §3) | Frontend Server (RSC) | — | `<ProgrammeTile>` Phase 2 primitive; static composition |
| 3-zone visual block (PART 5 §4) | Frontend Server (RSC) | — | Static; each zone is `<Card>` + `<Image>` + linked to zone sub-page |
| Venue map embed | Browser / Client (lazy) | CDN | Google Maps iframe embed lazy-loaded; zero JS bundle cost; same `VenueMap` component as Phase 4 |
| Booking form (`/book-a-trial/`) | Browser / Client | API / Backend | `'use client'` form; POST JSON to `/api/contact` with `market: "sg"` |
| Contact API (booking route) | API / Backend (Route Handler) | — | Existing `/api/contact/route.ts` — already accepts SG per verified source; zero backend changes |
| SG nav (shared across all 15 pages) | Frontend Server (RSC layout) | — | `app/sg/layout.tsx` wraps all SG pages; SGNav is RSC with client sub-component for mobile Sheet |
| SG footer (shared) | Frontend Server (RSC layout) | — | Mirrors RootFooter / HKFooter pattern; single Katong Point NAP |
| Zones pillar nav (`/weekly-classes/`) | Frontend Server (RSC) | — | Static nav within pillar; active state URL-derived (`usePathname` — scoped client subcomponent) |
| Camps pillar nav (`/prodigy-camps/`) | Frontend Server (RSC) | — | Same pattern as zones pillar nav |
| Blog listing (stub) | Frontend Server (RSC) | — | Static hardcoded array at Phase 5; Phase 6 replaces with GROQ |
| FAQ accordion | Browser / Client | — | shadcn `Accordion` is `'use client'` (Radix state); wraps in RSC page shell |
| Coaches listing (Haikel, Mark, Coach King) | Frontend Server (RSC) | — | Hardcoded data at Phase 5; Phase 6 swaps to Sanity Person documents |
| JSON-LD (LocalBusiness Katong, FAQPage, WebSite) | Frontend Server (RSC) | — | Inline `<script type="application/ld+json">` in page component |
| OG images (per-page) | Frontend Server (build-time) | CDN (Vercel caches) | `opengraph-image.tsx` per route segment; static build-time; same pattern as Phase 4 |
| SG metadata base | Frontend Server (RSC layout) | — | `app/sg/layout.tsx` exports `metadata` with `metadataBase: new URL("https://sg.proactivsports.com")` |

---

## Standard Stack

### Core (carry-forward from Phases 1–4 — all already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | 15.5.15 | App Router, RSC, route handlers, metadata API | Project stack decision |
| `react` | 19.2.4 | Component model, Server Components, useTransition | Project stack decision |
| `@mux/mux-player-react` | ^3.11.8 | Looping hero video (VideoPlayer wraps this) | Already installed Phase 2 |
| `resend` | ^6.12.2 | Email delivery for booking form | Already installed Phase 3 |
| `@react-email/components` | ^1.0.12 | Booking confirmation email template | Already installed Phase 3 |
| `lucide-react` | ^1.8.0 | Icons (MapPin, Clock, ChevronRight, Zap — Zap works well for MultiBall) | Already installed |
| `tailwind-merge` + `clsx` | latest | `cn()` utility | Already installed |
| `@radix-ui/react-accordion` | ^1.4.3 | FAQ accordion | Already installed Phase 2 |
| `@radix-ui/react-dialog` | ^1.1.x | Sheet (mobile menu), via shadcn Sheet | Already installed Phase 2 |

### Supporting (all already installed — NO new Phase 5 installs)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `next-mdx-remote` | ^6.0.0 | MDX for zone/camp editorial copy (optional) | If planner picks MDX for long zone sub-page copy; plain TSX is fine too |
| `sharp` | ^0.34.5 | Build-time image processing | Required: `pnpm photos:process` must re-run after Katong Point photography lands |

### New Packages for Phase 5

**NONE required.** Phase 5 is pure content composition. Everything needed is installed. [VERIFIED: Phase 4 completed without new installs; Phase 5 is the same shape.]

**Do NOT install:**
- `@react-google-maps/api` or `@google-maps/react-wrapper` — iframe embed pattern from Phase 4 is correct (zero bundle).
- `formik` / `react-hook-form` — same as Phase 4: uncontrolled `FormData` + `useTransition` pattern is sufficient.
- Any MultiBall / interactive-sports visualisation npm package — strategy treats MultiBall as a copy+photo differentiator, not a tech demo.

**Version verification:** `pnpm list @mux/mux-player-react resend @react-email/components` — expected output mirrors Phase 4 state. [VERIFIED: package.json shows all three packages present via Phase 4 04-RESEARCH.md §Standard Stack]

---

## Architecture Patterns

### System Architecture Diagram

```
SG Subdomain Request (sg.proactivsports.com or sg.localhost:3000)
         │
         ▼
middleware.ts — resolveHostMarket("sg.*") → rewrite to /sg{pathname}
         │
         ▼
app/sg/layout.tsx — SG metadata base + SGNav + {children} + SGFooter
         │
         ├─── app/sg/page.tsx ─────────────────── SG Homepage (13 sections per PART 5)
         │         │
         │         ├── VideoPlayer (Mux hero — Prodigy camp day quick cuts)
         │         ├── VenueChip (Katong Point single chip — simpler than HK)
         │         ├── WhyProdigy 4-tile (PART 5 §2 — MultiBall headline)
         │         ├── 4 ProgrammeTile cards (§3 weekly/camps/parties/schools)
         │         ├── 3-zone explorer (§4 Movement / Sports+MultiBall / Climbing)
         │         ├── LogoWall (§5 IFS, KidsFirst partners — with permission)
         │         ├── CampsFeature (§6 upcoming Prodigy camp)
         │         ├── BirthdayPartyBlock (§7 revenue)
         │         ├── CoachesBlock (§8 — Haikel, Mark, Coach King)
         │         ├── AboutSnapshot (§9 — cross-market link to HK)
         │         ├── BlogStub (§10)
         │         ├── FAQ (§11 — 10 Q&A, Accordion)
         │         └── FinalCTA (§12)
         │
         ├─── app/sg/katong-point/page.tsx ────── Katong Point Location Page
         │         └── VenueMap (iframe embed — 451 Joo Chiat Rd Level 3)
         │
         ├─── app/sg/weekly-classes/ ──────────── Weekly Classes Pillar
         │    │    └── page.tsx (pillar index — 3 zones overview)
         │    ├── movement-zone/page.tsx         (ages 2–5)
         │    ├── sports-zone/page.tsx           (MultiBall — headline differentiator)
         │    └── climbing-zone/page.tsx        (rock + boulder)
         │
         ├─── app/sg/prodigy-camps/ ───────────── Prodigy Camps Pillar
         │    │    └── page.tsx (pillar index — 3 camp types overview)
         │    ├── themes/page.tsx                (Ninja / Pokémon / Superhero / LEGO / STEAM)
         │    ├── multi-activity/page.tsx
         │    └── gymnastics-camps/page.tsx
         │
         ├─── app/sg/birthday-parties/page.tsx
         ├─── app/sg/school-partnerships/page.tsx    ← IFS surfaced inline
         ├─── app/sg/events/page.tsx                  ← evergreen; Phase 6 adds dates
         ├─── app/sg/coaches/page.tsx                 ← Haikel / Mark / Coach King
         ├─── app/sg/blog/page.tsx                    ← 0–1 stub post
         ├─── app/sg/faq/page.tsx                     ← 10 Q&A from PART 6C §11
         └─── app/sg/book-a-trial/page.tsx           ← conversion hub + form

Booking submission flow:
BookingForm (client) → fetch POST /api/contact {market:"sg", subject, venue:"katong-point"}
  → route.ts (existing, verified) → Resend SDK → CONTACT_INBOX_SG
```

### Recommended Project Structure

```
app/sg/
├── layout.tsx                    # SG layout: metadata base + SGNav + SGFooter
├── page.tsx                      # SG homepage (13 sections per PART 5)
├── opengraph-image.tsx           # SG homepage OG image (brand green or sky)
├── katong-point/
│   ├── page.tsx
│   └── opengraph-image.tsx
├── weekly-classes/
│   ├── page.tsx                  # Pillar index
│   ├── opengraph-image.tsx
│   ├── movement-zone/page.tsx
│   ├── sports-zone/page.tsx      # MultiBall differentiator page
│   └── climbing-zone/page.tsx
├── prodigy-camps/
│   ├── page.tsx                  # Pillar index
│   ├── opengraph-image.tsx
│   ├── themes/page.tsx
│   ├── multi-activity/page.tsx
│   └── gymnastics-camps/page.tsx
├── birthday-parties/
│   ├── page.tsx
│   └── opengraph-image.tsx
├── school-partnerships/page.tsx   # IFS inline
├── events/page.tsx
├── coaches/page.tsx
├── blog/page.tsx
├── faq/page.tsx
└── book-a-trial/
    ├── page.tsx                   # RSC shell
    └── booking-form.tsx           # 'use client' form (market: "sg")

components/sg/
├── sg-nav.tsx                    # RSC wrapper + mobile Sheet
├── sg-nav-mobile.tsx             # 'use client' mobile menu
├── sg-footer.tsx                 # RSC with Katong Point NAP (single venue)
├── zones-pillar-nav.tsx          # 3-zone pillar nav (RSC + active subcomponent)
├── camps-pillar-nav.tsx          # 3-camp-type pillar nav
├── active-sg-nav-link.tsx       # 'use client': usePathname for active state
└── multiball-hero-block.tsx      # Sports Zone dedicated MultiBall section (composition of Phase 2 Section + Image + Badge)
# Note: VenueMap is reused from components/hk/venue-map.tsx (Phase 4 added it);
#       OR Phase 5 copies it to components/sg/ if Phase 4 decided to keep it HK-scoped.
#       Planner decides: recommend moving to components/ui/venue-map.tsx as a shared primitive
#       since it's market-agnostic (just an iframe + title + src).

lib/
└── sg-data.ts                    # Static data: coaches, blog stub, FAQ, opening hours, IFS copy
```

### Pattern 1: SG Layout — Metadata Base + Nav + Footer

Mirrors Phase 4 `app/hk/layout.tsx` exactly, swap `hk` → `sg` and adjust copy.

```typescript
// app/sg/layout.tsx
// Phase 5 / Plan 05-XX — SG market tree layout.
// Replaces Phase 1 teal-400 distinguisher stripe placeholder (the SG stub page comment literally says
// "Removed in Phase 5" — Phase 5 executes that removal).
// metadataBase: sg.proactivsports.com (independent from root and HK).

import type { Metadata } from "next";
import { SGNav } from "@/components/sg/sg-nav";
import { SGFooter } from "@/components/sg/sg-footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://sg.proactivsports.com"),
  title: {
    default: "Kids' Sports Classes, Camps & Parties Singapore | Prodigy by ProActiv Sports",
    template: "%s | Prodigy by ProActiv Sports",
  },
  description:
    "Kids' sports classes, holiday camps & birthday parties at Prodigy by ProActiv Sports — Katong Point, Singapore. Home of the only MultiBall wall. Book a free trial.",
  openGraph: {
    siteName: "Prodigy by ProActiv Sports — Singapore",
    locale: "en_SG",
    type: "website",
  },
};

export default function SGGroupLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md"
      >
        Skip to main content
      </a>
      <SGNav />
      <main id="main-content">{children}</main>
      <SGFooter />
    </>
  );
}
```

**Key note:** `metadataBase` is `https://sg.proactivsports.com`, distinct from HK and root. Each subdomain layout declares its own. [VERIFIED: Phase 4 04-RESEARCH.md Pattern 1 + Pitfall 1 — same pattern applies here]

**Title / description source:** Verbatim from strategy PART 7.1 (Singapore #1 recommended) and PART 7.2 (Singapore #1).

### Pattern 2: SG Hero Video (Prodigy Camp Day Quick Cuts)

Strategy PART 5 §1: *"Hero video: quick cuts from a Prodigy camp day (climbing wall, MultiBall, sports zone, laughter)."*

Same `<VideoPlayer>` Phase 2 primitive as Phase 4. Different Mux playback ID. Different poster image.

```typescript
// app/sg/page.tsx — hero section (RSC)
import dynamic from "next/dynamic";
import Image from "next/image";

const VideoPlayer = dynamic(() => import("@/components/ui/video-player"), {
  ssr: false,
  loading: () => (
    // Poster fallback during JS load — LCP-critical.
    // HUMAN-ACTION: replace sg-placeholder-* with real Katong Point hero photo (e.g., sg-venue-katong-multiball.webp)
    <Image
      src="/photography/sg-venue-katong-hero.webp"
      alt="Children playing on the MultiBall wall at Prodigy, Katong Point, Singapore"
      fill
      priority
      className="object-cover"
      sizes="100vw"
    />
  ),
});

<div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
  <VideoPlayer
    playbackId={process.env.NEXT_PUBLIC_MUX_SG_HERO_PLAYBACK_ID ?? ""}
    loop
    autoPlay
    muted
    className="absolute inset-0 w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-brand-navy/40 flex flex-col items-start justify-center px-6 md:px-12">
    <h1 className="text-h1 font-display text-white max-w-2xl">
      Where Singapore's kids come to move, play, and grow.
    </h1>
    {/* subhead, CTAs, chip, trust line from PART 6C §Hero */}
  </div>
</div>
```

**HUMAN-ACTION required (two items):**
1. `NEXT_PUBLIC_MUX_SG_HERO_PLAYBACK_ID` in `.env.local` + Vercel preview env (same pattern as HK).
2. Real Katong Point hero photo at `public/photography/sg-venue-katong-hero.*` — replaces the need for sg-placeholder. Until both are ready, poster fallback must be an existing processed SG-appropriate image. If NO real SG photo exists at execute time, the hero section degrades to a solid brand-navy block with the H1 and CTAs (still functional, still looks intentional — does NOT use HK photos).

**Mobile autoplay strategy:** Same as Phase 4 — `muted` + `playsinline` (Mux Player handles both). [ASSUMED — Phase 4 Pattern 2 carry-forward]

### Pattern 3: Katong Point Venue Map — Lightweight Iframe Embed

Same pattern as Phase 4 Wan Chai / Cyberport. Different embed URL.

```typescript
// app/sg/katong-point/page.tsx — map section
import { VenueMap } from "@/components/sg/venue-map"; // or shared ui/venue-map if refactored

<VenueMap
  embedSrc={KATONG_POINT_MAP_EMBED_URL}
  title="Map showing Prodigy at 451 Joo Chiat Road, Level 3, Katong Point, Singapore"
  className="my-8"
/>
```

**HUMAN-ACTION:** Martin generates the embed URL by:
1. Open Google Maps → search "451 Joo Chiat Road, Katong, Singapore 427664"
2. Share → Embed a map → copy `src` URL
3. Paste into `lib/sg-data.ts` `KATONG_POINT_MAP_EMBED_URL` constant

Pattern preserves Phase 4 Pitfalls (iframe `title` required; `loading="lazy"`; no `allowFullScreen` gotcha). [CITED: Phase 4 04-RESEARCH.md Pattern 3]

### Pattern 4: Booking Form — SG Routing, Single Venue

The booking form is materially SIMPLER than HK's because there is only one SG venue (Katong Point). The `venue` selector that Phase 4 introduced (`wan-chai` / `cyberport` / `no-preference`) drops to a single pre-filled value:

```typescript
// app/sg/book-a-trial/booking-form.tsx
"use client";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
// ... imports

export function BookingForm() {
  const searchParams = useSearchParams();
  // Subject pre-fill: ?subject=birthday-party | school-partnership | camp-enquiry | etc.
  const prefilledSubject = searchParams.get("subject") ?? "Free Assessment Request";
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [, startTransition] = useTransition();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const body = {
      ...Object.fromEntries(formData),
      market: "sg",                // Routes to CONTACT_INBOX_SG
      subject: prefilledSubject,
      venue: "katong-point",       // Fixed — only one SG venue
    };
    startTransition(async () => {
      setStatus("submitting");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setStatus(res.ok ? "success" : "error");
    });
  }

  // Form fields: name, email, phone (optional), childAge, message, honeypot
  // NO venue selector (single-venue market)
}
```

**No backend changes.** [VERIFIED: app/api/contact/route.ts line-by-line — the handler accepts `market: "sg"`, reads `CONTACT_INBOX_SG`, passes `subject` and all additional body fields through to the email template. Any new fields (`venue`, `childAge`) flow through as-is.]

**Subject pre-fill query param pattern:** Every conversion CTA across SG pages links to `/book-a-trial/?subject=<kebab-case>`. Examples:
- `/birthday-parties/` → CTA → `/book-a-trial/?subject=birthday-party`
- `/school-partnerships/` → CTA → `/book-a-trial/?subject=school-partnership`
- `/prodigy-camps/themes/` → CTA → `/book-a-trial/?subject=themed-camp`

### Pattern 5: Blog Stub — CMS-Migration-Ready Shape (same as Phase 4)

Use **identical** `BlogPostStub` interface from Phase 4 `lib/hk-data.ts`. Cross-market consistency means Phase 6 Sanity schema handles both with one GROQ query filtered by `market`.

```typescript
// lib/sg-data.ts
import type { BlogPostStub } from "@/lib/hk-data"; // or extract to lib/blog-types.ts

export const SG_BLOG_POSTS_STUB: BlogPostStub[] = [
  // Phase 5 ships 0–1 stub post. Planner decides.
  // If 1 post, a credible SG-relevant topic per strategy PART 12 Tier 1:
  {
    title: "What makes MultiBall different: interactive sport for kids in Singapore",
    slug: "multiball-interactive-sport-singapore",
    excerpt: "How Prodigy's MultiBall wall turns drills into play — and why kids don't realise they're training.",
    date: "2026-04-15",
    category: "Prodigy Tips",
    readTimeMinutes: 4,
    imageUrl: "/photography/sg-multiball-action.webp", // HUMAN-ACTION until real photo
  },
];
```

### Pattern 6: Zones Pillar Navigation (Mirrors Gymnastics Pillar Nav)

```typescript
// components/sg/zones-pillar-nav.tsx — RSC wrapper
import { ActiveSGNavLink } from "@/components/sg/active-sg-nav-link";

const SG_ZONES = [
  { href: "/weekly-classes/movement-zone/",  label: "Movement Zone",  age: "2–5yr", tag: "Early years" },
  { href: "/weekly-classes/sports-zone/",    label: "Sports + MultiBall", age: "5–12yr", tag: "Singapore's only" },
  { href: "/weekly-classes/climbing-zone/",  label: "Climbing Zone",  age: "All ages", tag: "Strength + resilience" },
] as const;

export function ZonesPillarNav() {
  return (
    <nav aria-label="Prodigy zones" className="flex flex-wrap gap-2">
      {SG_ZONES.map((zone) => (
        <ActiveSGNavLink key={zone.href} {...zone} />
      ))}
    </nav>
  );
}
```

**Sports Zone gets a highlight treatment** — its `tag` property ("Singapore's only") is rendered as a `<Badge variant="brand-yellow">` to flag the MultiBall differentiator in the pillar nav itself. [Strategy PART 5 §4 bold call-out carried through to nav.]

### Pattern 7: Camps Pillar Navigation

Same shape as Zones pillar nav, different data:

```typescript
const SG_CAMP_TYPES = [
  { href: "/prodigy-camps/themes/",         label: "Themed Camps",     age: "4–12yr", tag: "Ninja · Pokémon · Superhero · LEGO · STEAM" },
  { href: "/prodigy-camps/multi-activity/", label: "Multi-Activity",   age: "5–12yr", tag: "Sport + movement rotation" },
  { href: "/prodigy-camps/gymnastics-camps/", label: "Gymnastics Camps", age: "5–12yr", tag: "Skill-focused weeks" },
] as const;
```

### Pattern 8: Location Page JSON-LD (SportsActivityLocation for Katong Point)

```typescript
// app/sg/katong-point/page.tsx — JSON-LD
const katongPointSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SportsActivityLocation",
      "@id": "https://sg.proactivsports.com/#localbusiness-katong",
      "name": "Prodigy by ProActiv Sports — Katong Point",
      "image": "https://sg.proactivsports.com/photography/sg-venue-katong-hero.webp", // HUMAN-ACTION for real photo
      "url": "https://sg.proactivsports.com/katong-point/",
      "telephone": "+6598076827",
      "priceRange": "$$",
      "parentOrganization": { "@id": "https://proactivsports.com/#organization" },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "451 Joo Chiat Road, Level 3",
        "addressLocality": "Katong",
        "addressRegion": "Singapore",
        "postalCode": "427664",
        "addressCountry": "SG"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 1.3113,   // [ASSUMED — approximate Katong Point coordinates; HUMAN-ACTION to verify before SEO phase]
        "longitude": 103.9011
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
          "opens": "09:00",
          "closes": "19:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Saturday","Sunday"],
          "opens": "09:00",
          "closes": "17:00"
        }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Sports & Gymnastics Programmes",
        "itemListElement": [
          { "@type": "Offer", "name": "Weekly Sports Classes" },
          { "@type": "Offer", "name": "Prodigy Holiday Camps" },
          { "@type": "Offer", "name": "Birthday Parties" },
          { "@type": "Offer", "name": "School Partnerships" }
        ]
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Prodigy by ProActiv Sports Singapore", "item": "https://sg.proactivsports.com/" },
        { "@type": "ListItem", "position": 2, "name": "Katong Point", "item": "https://sg.proactivsports.com/katong-point/" }
      ]
    }
  ]
};
```

**Phone:** `+6598076827` from PART 8.3 (verified canonical NAP). [CITED: strategy.md PART 8.3]

**Opening hours:** Placeholder values — HUMAN-ACTION to verify current Katong Point hours before phase close. [ASSUMED — strategy PART 9.4 uses same skeleton hours; real hours may differ]

**Geo coordinates:** [ASSUMED] — approximate based on Joo Chiat Road position. HUMAN-ACTION to confirm exact lat/long from Google Maps before Phase 7 (SEO) closes. Verification fit into Phase 5 execute is acceptable if the embed URL is generated first (the `pb=` encoding contains accurate coordinates already).

### Pattern 9: SG Nav Architecture

The SG nav mirrors Phase 4 `HKNav` pattern. Key differences:

1. **Different top-level items** — Prodigy multi-sport identity means nav is:
   - Weekly Classes [dropdown: Movement / Sports+MultiBall / Climbing]
   - Camps [dropdown: Themed / Multi-Activity / Gymnastics]
   - Parties
   - Schools *(links to /school-partnerships/ — IFS partnership lives here)*
   - Coaches
   - FAQ
   - [Book a Free Trial button — sticky primary CTA]
2. **Baloo 2 is NOT attached** to SG layout (per Phase 2 D-03 — ProGym-only). SG uses default Unbounded + Manrope. **FLAGGED** — see Assumptions Log A1.
3. Cross-market link in footer to HK: `<a href={process.env.NEXT_PUBLIC_HK_URL}>Also in Hong Kong →</a>`

```typescript
// components/sg/sg-nav.tsx — RSC
const SG_NAV_LINKS = [
  { href: "/weekly-classes/",      label: "Weekly Classes", dropdown: SG_ZONES },
  { href: "/prodigy-camps/",       label: "Camps",          dropdown: SG_CAMP_TYPES },
  { href: "/birthday-parties/",    label: "Parties" },
  { href: "/school-partnerships/", label: "Schools" },       // IFS inline
  { href: "/coaches/",             label: "Coaches" },
  { href: "/faq/",                 label: "FAQ" },
] as const;

// Primary sticky CTA: <Link href="/book-a-trial/">Book a Free Trial</Link>
```

### Pattern 10: IFS School Partnership — Inline Named Partner

**Strategy PART 12 Tier 2 #18** lists "SG /school-partnerships/ (including IFS)" as a SINGLE page. Not a separate IFS sub-page.

**Implementation:** A single static page `app/sg/school-partnerships/page.tsx` with this structure:

```
# School Partnerships
[Intro: "Prodigy partners with leading international schools..."]

## Our Partner Schools
[Logo wall: IFS logo (if permission granted), KidsFirst, others]

## Featured: International French School (IFS)
[Card/Section with IFS-specific copy: "Our flagship partnership with IFS — term-time programmes,
holiday camps with bus services through ComfortDelGro, sports days."]
[Optional: IFS logo + quote if Martin has them]

## What School Partnerships Offer
- Term-time programmes
- Holiday camps with transport
- Sports days (reference KidsFirst case study)
- Enrichment programmes

## Enquire
[CTA: Link to /book-a-trial/?subject=school-partnership]
```

**No logo upload required at Phase 5 start** — the page is rendered without the IFS logo if permission isn't yet confirmed; HUMAN-ACTION tracked as a later refinement. The textual IFS callout from strategy PART 6C §3 is legally safe (factual partner reference).

**Phase 6 migration path:** If Martin wants per-partner pages later (e.g., `/school-partnerships/international-french-school/`), Phase 6 Sanity introduces a `SchoolPartnership` document type with slug; the consolidated page becomes a listing that links to individual slugged pages. Phase 5 does NOT build this.

### Pattern 11: MultiBall Differentiator Treatment

**Strategy** treats MultiBall as the single most-distinctive SG asset — "Singapore's only MultiBall wall" appears in PART 5 §1 trust line, §2 first tile, §4 Sports Zone description, and PART 6C FAQ §4.

**Implementation is copy + photo + badge, NOT a new component**:

1. **Homepage §1 trust line:** Inline `<span className="font-accent">Singapore's only MultiBall wall</span>` in the hero. (If A1 assumption resolves "Baloo on Prodigy", `font-accent` routes to Baloo 2; otherwise Manrope.)
2. **Homepage §2 first why-tile:** Title "The only MultiBall wall in Singapore" + 2-sentence body from PART 6C §2.
3. **Homepage §4 Sports Zone card:** `<Badge variant="brand-yellow">Singapore's only</Badge>` adjacent to "Sports Zone — with MultiBall" title.
4. **Sports Zone sub-page (`/weekly-classes/sports-zone/`):** Dedicated MultiBall section — H2 "What is MultiBall?", editorial paragraph from PART 6C FAQ §4, large photo (HUMAN-ACTION — needs real MultiBall wall shot), "Book a trial" CTA.
5. **FAQ entry:** Q: "What is the MultiBall wall?" — Answer verbatim from PART 6C §11.

No dedicated React component required. The Sports Zone page's MultiBall section is a composition of Phase 2 `<Section>` + `<ContainerEditorial>` + `<Image>` + `<Badge>` + heading/paragraph — same shape as any other editorial section.

### Anti-Patterns to Avoid

- **Copying HK hero video to SG** — they are different markets with different identities. Strategy PART 1 explicitly frames SG as a distinct product. SG needs its own Mux clip (Prodigy camp day cuts), not a reused HK gymnastics loop.
- **Using `/sg/` URL prefix in `<Link>` hrefs inside the SG tree** — middleware rewrites transparently; `<Link href="/katong-point/">` is correct on sg.proactivsports.com. Adding `/sg/` would break.
- **Building per-IFS-school dynamic routes** — strategy confirms consolidated hub at Phase 5. Dynamic `[schoolSlug]` is Phase 6 CMS territory.
- **Using HK photography on SG pages as a visual fill** — breaks the PART 1 distinct-product identity. Either use real SG photography, use the single sg-placeholder (once, sparingly), or fall back to brand-color blocks with typography-led layouts. Never HK photos.
- **Hand-rolling a venue selector on the SG booking form** — only one SG venue exists. Hard-code `venue: "katong-point"` and skip the selector. Adding a selector-with-one-option is user-hostile.
- **Attaching Baloo 2 to `app/sg/layout.tsx` body without user confirmation** — Phase 2 D-03 scopes Baloo to ProGym. If Prodigy wants it too, that's a discuss-phase amendment, not a planner decision. See A1.
- **Adding a "Cross-market" selector on the SG homepage hero** — HK and SG are different products (PART 1), not locale switches. Cross-market link lives only in the footer as a small honest reference ("Also in Hong Kong →").
- **Using `SportsActivityLocation` schema on the SG homepage** — Phase 4 locked this to location pages only (PART 9.1). SG homepage gets `WebSite` + `FAQPage`, NOT `LocalBusiness`. The `LocalBusiness`/`SportsActivityLocation` lives on `/katong-point/`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Katong Point map | Custom Leaflet/Mapbox | Google Maps iframe embed (Phase 4 pattern) | Zero bundle, no API key, no GDPR cookie consent |
| Hero video | `<video>` with manual HLS | `components/ui/video-player.tsx` (Phase 2) | Mux handles HLS, adaptive bitrate, poster |
| Booking form email delivery | Custom SMTP | Existing `/api/contact` route with `market:"sg"` | Already accepts SG; zero backend changes needed |
| MultiBall demo / visualization | Custom p5.js / canvas / WebGL | Photo + copy + Badge | Strategy treats MultiBall as narrative differentiator, not interactive demo |
| SG blog pagination | Cursor-based | Static array + responsive grid | 0–1 post at Phase 5 |
| Active pillar nav link | Manual URL comparison | `usePathname()` in scoped client subcomponent | Phase 4 pattern carries forward |
| IFS dedicated routing | Dynamic `[schoolSlug]` segment | Inline section on `/school-partnerships/` | One named partner at Phase 5; dynamic routing is Phase 6 |
| SGFooter NAP block | Duplicated from data | Read once from `lib/sg-data.ts` `KATONG_POINT_NAP` | Single source; Phase 6 swaps to CMS GROQ |
| Venue selector on SG booking form | 3-option selector | Hard-code `venue: "katong-point"` | Single venue |
| OG image per sub-page | Per-page custom | `createSGOgImage(title, tagline)` utility | 1 template, title override per page |
| Cross-market link styling | Hand-rolled "Also in HK" component | `<a href={process.env.NEXT_PUBLIC_HK_URL}>` with shared footer pattern | Avoid `<Link>` for cross-subdomain (Phase 3 / Phase 4 Pitfall) |

**Key insight:** Phase 5 is 95% content composition from Phase 2+3+4 primitives and 5% new architecture (different Mux ID, different map embed URL, different inbox env var, 3-zone pillar architecture vs 8-sub-page pillar). The novel identity (Prodigy, MultiBall, multi-sport) is delivered through **copy, imagery, and badge treatment** — not through new technical components.

---

## Common Pitfalls

### Pitfall 1: `metadataBase` mismatch — SG layout must declare SG subdomain

**What goes wrong:** SG layout inherits `metadataBase: new URL("https://proactivsports.com")` from root, or worse, accidentally inherits HK's base. OG image URLs become wrong subdomain → WhatsApp/iMessage previews 404.

**Root cause:** `metadataBase` in `app/root/layout.tsx` scopes to root; each subdomain layout must independently declare.

**Prevention:** `app/sg/layout.tsx` explicitly sets `metadataBase: new URL("https://sg.proactivsports.com")`.

**Detection:** Paste any SG preview URL into `https://opengraph.xyz/` after implementation — `og:image` must start with `https://sg.`.

### Pitfall 2: `usePathname()` returns browser path (not rewritten path) — same as Phase 4 Pitfall 2

**What goes wrong:** Active state on zones pillar nav never matches — developer writes `pathname === "/sg/weekly-classes/movement-zone/"` but `usePathname()` returns `/weekly-classes/movement-zone/` (browser URL, no `/sg/` prefix).

**Prevention:** Compare against `/weekly-classes/movement-zone/` without `/sg/` prefix. Or use `pathname.includes("movement-zone")`.

### Pitfall 3: sg-placeholder photo leaks into production

**What goes wrong:** `sg-placeholder-climbing-unsplash-trinks.*` gets used on the SG homepage hero or a zone sub-page and ships to production. Unsplash License permits this — but the photo is a non-ProActiv climbing gym in Vernon, CT. Martin's brief requires real Katong Point.

**Root cause:** The file exists in `public/photography/` from Phase 2 D-07 amendment. Phase 5 execute without a guardrail may use it reflexively.

**Prevention:** Planner adds a Wave 0 task that either (a) HUMAN-ACTION gates on replacement — executor halts if any SG page's hero/content slot references `sg-placeholder-*`, or (b) allows the placeholder ONLY on one designated page (e.g., `/blog/` stub or `/_design/` gallery), gated in code with a `// PHASE5_PLACEHOLDER: sg-climbing-unsplash` comment and grep rule.

**Detection:** Before phase close, `grep -r "sg-placeholder" app/sg/` must return zero matches in production page code. Allowed references: `lib/sg-data.ts` comment documenting Phase 2 D-07 precedent; `/_design/` gallery that was built in Phase 2.

### Pitfall 4: Baloo 2 assumption divergence (PROJECT.md vs Phase 2 D-03)

**What goes wrong:** Planner reads PROJECT.md "Key Decisions" ("Baloo is specified for Prodigy contexts") and activates Baloo on `app/sg/layout.tsx`. Meanwhile Phase 2 D-03 explicitly locks Baloo to ProGym only. Result: a silent deviation from a prior-phase locked decision.

**Root cause:** PROJECT.md Key Decisions summary and Phase 2 D-03 disagree. Phase 2 is more recent and more specific.

**Prevention:** Phase 5 discuss-phase MUST resolve this before plan-phase. Planner treats Baloo scope as UNKNOWN until discuss-phase locks it. Research flags it (Assumptions Log A1). Recommend asking user: "Do you want Baloo 2 active on Prodigy contexts (SG) the same way it's active on ProGym (HK)? Phase 2 D-03 scoped it to ProGym only, but PROJECT.md Key Decisions suggests Prodigy too."

**Detection:** `grep -R "font-baloo\|font-accent" app/sg/` results reveal activation pattern. CSS inspector on deployed SG pages shows rendered font family.

### Pitfall 5: Mux hero video autoplay blocked on Katong iOS devices (same as Phase 4 Pitfall 4)

**What goes wrong:** iOS Low Power Mode or Safari autoplay policy pauses the hero video. Poster image stays visible — acceptable degradation.

**Prevention:** Poster image is the permanent mobile fallback. Overlay text + CTAs render from HTML (not inside VideoPlayer) so they're always visible. [Phase 4 Pattern 2 carry-forward.]

### Pitfall 6: SG homepage §5 testimonial attribution accuracy

**What goes wrong:** Strategy PART 6C §5 includes two testimonials. One is attributed to "Parent, Prodigy @ Katong Point" (generic). The second is attributed to Manjula Gunawardena at KidsFirst — BUT this is the same person quoted on the ROOT gateway PART 6A §5. Using the same named testimonial across three pages (root + HK + SG) risks looking recycled.

**Root cause:** Strategy doc reuses the KidsFirst testimonial across markets because the source event is genuine.

**Prevention:** Planner verifies with Martin whether additional genuine SG testimonials exist. If only the Manjula one does, SG uses the parent-attributed quote only and swaps in a second generic-but-real SG quote if one becomes available at execute time. Do NOT invent quotes.

**Detection:** Grep for "Manjula Gunawardena" across `app/` — should appear on at most root + one market (preferably SG since the source event was a Singapore-based KidsFirst sports day).

### Pitfall 7: Cross-subdomain links using `<Link>` inside SG pages (carry-forward from Phase 3/4)

**What goes wrong:** SG pages linking to root gateway (`/brand/`, `/contact/`, etc.) or to HK use `<Link href="/brand/">` — which resolves to `sg.proactivsports.com/brand/` (404).

**Prevention:** Cross-subdomain links use `<a href={process.env.NEXT_PUBLIC_ROOT_URL + "/brand/"}>`. Cross-market HK link uses `NEXT_PUBLIC_HK_URL`.

**Env vars needed in SG context:**
- `NEXT_PUBLIC_ROOT_URL=https://proactivsports.com`
- `NEXT_PUBLIC_HK_URL=https://hk.proactivsports.com`
- Preview fallback pattern from Phase 3 D-01 applies.

### Pitfall 8: 3-zone pillar nav active state breaks on pillar root

**What goes wrong:** On `/weekly-classes/` (the pillar index), no pillar nav item should show as "active" — they all show as inactive because the pathname doesn't match any of their hrefs. But if the nav uses `pathname.startsWith(href)`, then `/weekly-classes/` matches all three zone hrefs because each zone href starts with `/weekly-classes/`.

**Prevention:** Active state uses EXACT-match-with-trailing-slash comparison OR a specific segment check: `isActive = pathname.endsWith(href) || pathname.endsWith(href.slice(0, -1))`. [Same as Phase 4 Pattern 6 gymnastics pillar nav.]

### Pitfall 9: Blog stub imageUrl references sg-placeholder (silent deployment leak)

**What goes wrong:** A blog stub post uses `imageUrl: "/photography/sg-placeholder-climbing-unsplash-trinks.webp"` and ships. The blog hub then displays the placeholder as the featured image.

**Prevention:** Phase 5 blog stubs use either (a) real SG photos once curated, or (b) a text-only blog card treatment with no image (Phase 2 `<Card>` gracefully supports this). The responsive grid in PART 5 §10 ("Designed to remain elegant if only 1 post exists") applies equally to image-less cards.

---

## Code Examples

Verified patterns from strategy doc and Phase 4 carry-forwards:

### SG Homepage Section Map (per PART 5 wireframe)

```typescript
// app/sg/page.tsx — section ordering per strategy PART 5
export default function SGHomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sgHomeSchema) }} />
      <HeroSection />            {/* §1 — Prodigy-forward video, Katong chip, "only MultiBall" trust line */}
      <WhyProdigySection />      {/* §2 — 4-tile grid, MultiBall first tile */}
      <ProgrammesSection />      {/* §3 — 4 programme cards (weekly/camps/parties/schools) */}
      <ThreeZonesSection />      {/* §4 — Movement / Sports+MultiBall / Climbing */}
      <SocialProofSection />     {/* §5 — IFS + KidsFirst logos + testimonials */}
      <CampsFeatureSection />    {/* §6 — upcoming Prodigy camp card */}
      <BirthdayPartySection />   {/* §7 — revenue block, MultiBall access mention */}
      <CoachesSection />         {/* §8 — Haikel / Mark / Coach King */}
      <AboutSection />           {/* §9 — cross-market link to HK root brand */}
      <BlogSection />            {/* §10 — stub */}
      <FAQSection />             {/* §11 — 10 Q&A */}
      <FinalCTASection />        {/* §12 — Book + Enquire + WhatsApp */}
    </>
  );
}
```

### Katong Point Location Page Structure

```typescript
// app/sg/katong-point/page.tsx
export const metadata: Metadata = {
  title: "Prodigy @ Katong Point — Children's Sports Singapore",
  description: "Prodigy by ProActiv Sports at 451 Joo Chiat Road, Level 3, Katong Point. Singapore's only MultiBall wall. Weekly classes, holiday camps, birthday parties.",
};

export default function KatongPointPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(katongPointSchema) }} />
      {/* 1. Hero: venue name + address + Katong Point photo (HUMAN-ACTION for real) */}
      {/* 2. VenueMap — lazy-loaded iframe embed, 451 Joo Chiat Road */}
      {/* 3. Opening hours table */}
      {/* 4. Getting here — East Coast / Marine Parade / Tanjong Katong transit copy (PART 8.5) */}
      {/* 5. Three zones overview — each links to its zone sub-page */}
      {/* 6. Programmes list — weekly / camps / parties */}
      {/* 7. FAQ (venue-specific — subset of /faq/) */}
      {/* 8. Booking CTA — pre-filled with venue=katong-point */}
    </>
  );
}
```

### Zone Sub-Page Template (Sports Zone with MultiBall callout)

```typescript
// app/sg/weekly-classes/sports-zone/page.tsx
export default function SportsZonePage() {
  return (
    <>
      {/* 1. ZonesPillarNav — shows all 3 zones, active on Sports Zone */}
      {/* 2. H1: "Sports Zone — With Singapore's Only MultiBall Wall" */}
      {/* 3. Lead paragraph: ages, apparatus, what a session looks like */}
      {/* 4. MULTIBALL SPOTLIGHT — dedicated block (Pattern 11): */}
      {/*    - H2 "What is MultiBall?" */}
      {/*    - Editorial paragraph from PART 6C FAQ §4 */}
      {/*    - Real MultiBall photo (HUMAN-ACTION) */}
      {/*    - Badge: "Singapore's only" */}
      {/*    - CTA: Book a trial */}
      {/* 5. Other sports offered (football, basketball, rugby, tennis, dodgeball, martial arts) */}
      {/* 6. Age bands and class structure */}
      {/* 7. FAQ snippet */}
      {/* 8. Book a trial CTA */}
    </>
  );
}
```

### Camp-Type Sub-Page Template (Themed Camps)

```typescript
// app/sg/prodigy-camps/themes/page.tsx
export default function ThemedCampsPage() {
  return (
    <>
      {/* 1. CampsPillarNav — shows all 3 camp types, active on Themed */}
      {/* 2. H1: "Themed Holiday Camps — Singapore" */}
      {/* 3. Theme list: Ninja Warrior, Pokémon, Superhero, LEGO City, STEAM, Multi-Sport Adventure */}
      {/* 4. "What's included" panel (PART 6C §6 — Dri-fit T-shirt, grip socks, certificate, weekly prizes, lunch) */}
      {/* 5. Age band (4-12) + session format (half-day / full-day AM/PM) */}
      {/* 6. Upcoming themes CMS-stub (Phase 6 adds real dates + Event schema) */}
      {/* 7. Venue: Katong Point + booking CTA */}
    </>
  );
}
```

### SG Homepage JSON-LD (WebSite + FAQPage — NOT LocalBusiness)

```typescript
const sgHomeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://sg.proactivsports.com/#website",
      "url": "https://sg.proactivsports.com/",
      "name": "Prodigy by ProActiv Sports — Singapore",
      "publisher": { "@id": "https://proactivsports.com/#organization" },
      "inLanguage": "en-SG"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Where is Prodigy located?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "451 Joo Chiat Road, Level 3, Katong Point, Singapore 427664. Our 2,700 sq ft venue is fully indoor and air-conditioned."
          }
        }
        // ... 9 more from strategy PART 6C §11 (answers verbatim from strategy, matching visible page copy)
      ]
    }
  ]
};
```

Note: `SportsActivityLocation` schema lives ONLY on `/katong-point/` per Phase 4 convention. [CITED: Phase 4 04-RESEARCH.md Pattern 7; strategy PART 9.1]

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Sub-brand locale variant (SG = HK translated) | Sub-brand as distinct product (SG = Prodigy, HK = ProGym) | Strategy PART 1 establishes this | SG is NOT a locale of HK. Different hero, different sports mix, different coach team, different pillar structure. `hreflang` NOT used between HK and SG (strategy PART 2 canonical/hreflang rules). |
| Full Google Maps JS SDK | Iframe embed (zero bundle) | Phase 4 adopted | Zero-cost map. No API key. |
| Per-partner dynamic routes | Consolidated hub at Phase 5; dynamic at Phase 6 | Strategy PART 12 Tier 2 #18 | Simpler Phase 5; Phase 6 CMS adds flexibility |
| Manually duplicated blog schema per market | Shared `BlogPostStub` interface, market-filtered GROQ query at Phase 6 | Phase 4 established | Single source of truth; cross-market consistency |

**Deprecated/outdated patterns:**
- `next/router` — Pages Router, don't use. App Router uses `next/navigation`.
- `getStaticProps`/`getServerSideProps` — Pages Router, don't use. Use `async function Page()` RSC.
- Named-partner dedicated landing pages for every partner at Phase 5 — overkill for a market with one canonical partner (IFS). Revisit at Phase 6 with CMS.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| **A1** | Baloo 2 is NOT activated on SG/Prodigy contexts because Phase 2 D-03 scopes it to ProGym only, overriding PROJECT.md "Key Decisions" mention of Prodigy | Summary #3, Pattern 1, Pattern 9, Pitfall 4 | Font identity of SG market diverges from client intent. HIGH RISK — this is a brand-design decision, not a technical one. Recommend discuss-phase lock before plan-phase. |
| A2 | SG coach team in Phase 5 stub = Haikel, Mark, Coach King per strategy PART 6C §8 — matches reality | Pattern 6C §8 / Requirements SG-08 | If other SG coaches exist + have bios, page is incomplete at Phase 5. MEDIUM RISK — hardcoded stub array makes expansion a 5-line edit; Phase 6 swaps to Sanity. |
| A3 | IFS permission to display logo is either already granted or pending — does NOT block Phase 5 launch | Pattern 10 | If permission pending, page renders without logo but retains textual partnership callout — low risk. |
| A4 | Katong Point opening hours match the strategy PART 9.4 skeleton (Mon-Fri 09:00-19:00, Sat-Sun 09:00-17:00) | Pattern 8 JSON-LD | If hours differ, JSON-LD is incorrect for GBP matching — Phase 8 GBP sync flags. HUMAN-ACTION pre-Phase-8 is sufficient. |
| A5 | Katong Point geo coordinates ≈ 1.3113, 103.9011 | Pattern 8 JSON-LD | Incorrect map pin. LOW RISK — Martin generates Google Maps embed URL which encodes accurate coordinates; iframe shows correct location even if JSON-LD has slight drift; correct before Phase 7 SEO close. |
| A6 | iOS Safari autoplay works when `muted` + `playsinline` are set — Mux Player handles | Pattern 2 (hero video) | Video doesn't autoplay on iOS; poster stays visible — acceptable degradation. |
| A7 | SG homepage §5 testimonial pool has at least one genuine SG parent quote that is NOT the Manjula Gunawardena (KidsFirst) quote | Pitfall 6 | If pool only has Manjula, testimonial strip still ships with 1 quote (acceptable), but loses the social-proof density the wireframe calls for. MEDIUM — usability regression only. |
| A8 | The existing `sg-placeholder-climbing-unsplash-trinks.*` is Unsplash License + no-attribution — confirmed from Phase 2 D-07 amendment note in PROJECT.md and STATE.md | Pitfall 3 | If license interpretation wrong, commercial-use risk. LOW — STATE.md explicitly documents the license. |
| A9 | The `VenueMap` component from Phase 4 (`components/hk/venue-map.tsx`) is reusable for SG — either by moving to `components/ui/` as shared primitive, or by copying to `components/sg/`. Planner decides during plan-phase | Pattern 3 | If Phase 4 component has HK-specific assumptions baked in, SG needs its own copy — 30-line component, trivial. LOW. |
| A10 | `NEXT_PUBLIC_MUX_SG_HERO_PLAYBACK_ID` follows same env-var pattern as HK and will be provided at execute time via HUMAN-ACTION gate | Pattern 2 | Video doesn't load; poster fallback renders indefinitely until env var set. Acceptable degradation. |

**Summary:** A1 (Baloo scope) is HIGH RISK and must be resolved by discuss-phase or explicitly by the user before plan-phase locks the nav/layout code. All other assumptions are medium-or-lower and fixable at execute time via HUMAN-ACTION gates.

---

## Open Questions

1. **Baloo 2 scope for Prodigy (SG) — HIGH PRIORITY**
   - What we know: Phase 2 D-03 locks Baloo to ProGym. PROJECT.md Key Decisions line mentions Baloo for Prodigy too. These disagree.
   - What's unclear: Does the user want Baloo on SG pages the same way HK ProGym pages will get it (Phase 4)?
   - Recommendation: Surface this in `/gsd-discuss-phase 5`. Three options: (a) Baloo on Prodigy too → amend Phase 2 D-03 scope; (b) Manrope-only on SG → confirm Phase 2 D-03 stands; (c) Baloo only for Prodigy-branded elements (logo, hero headline, badges) but Manrope for body — narrower scope than HK's full-layout Baloo. Research recommends (c) as the compromise if ambiguous.

2. **SG hero Mux playback ID source footage**
   - What we know: Phase 2 deferred Mux to Phase 10 via D-06, but HK Phase 4 D-01 established a HUMAN-ACTION pattern for earlier unlock.
   - What's unclear: Does source footage for a Prodigy camp day montage exist (8-12s quick cuts)?
   - Recommendation: HUMAN-ACTION checkpoint at Phase 5 execute — Martin uploads clip to Mux, provides ID. Until then, poster fallback (real Katong Point photo once curated, solid brand-color block before that).

3. **Real Katong Point photography availability**
   - What we know: `sg-placeholder-climbing-unsplash-trinks.*` is the only SG asset in `public/photography/`. Source folder at `/Users/martin/Downloads/ProActive/` may or may not contain SG material.
   - What's unclear: Does Martin have real Katong Point photography he can curate to `.planning/inputs/curated-hero-photos/` and run through `pnpm photos:process` before Phase 5 execute?
   - Recommendation: Photography curation becomes a Wave 0 / pre-execute HUMAN-ACTION. Minimum viable SG photo set: (1) Katong Point exterior or hero interior shot, (2) MultiBall wall in use, (3) Movement Zone, (4) Climbing Zone, (5) coach portraits (Haikel, Mark, Coach King), (6) birthday party setup, (7) camp action shot. 7 photos minimum; 10-12 ideal for homepage richness.

4. **Google Maps embed URL for Katong Point**
   - What we know: Address verified — 451 Joo Chiat Road, Level 3, Katong Point, Singapore 427664. Embed URL requires manual generation.
   - What's unclear: Exact `pb=` parameter (encoding zoom, center, type).
   - Recommendation: HUMAN-ACTION — Martin generates embed URL via Google Maps Share flow; placed in `lib/sg-data.ts` as `KATONG_POINT_MAP_EMBED_URL`.

5. **IFS logo permission status**
   - What we know: Strategy PART 6C §3 names IFS (International French School) as a partner school; KidsFirst also named.
   - What's unclear: Whether Martin has express written permission to display IFS + KidsFirst logos on the site.
   - Recommendation: `/school-partnerships/` ships at Phase 5 with text-only partnership callouts. Logo rendering is a HUMAN-ACTION unblock: "Add `/photography/partner-ifs-logo.svg` + `/photography/partner-kidsfirst-logo.svg` when permissions are confirmed; logo wall conditionally renders." Not blocking.

6. **SG WhatsApp number confirmation**
   - What we know: Strategy PART 8.3 states `+65 9807 6827`. Phase 3 D-02 marks this as HUMAN-ACTION pending final confirmation.
   - What's unclear: Whether the strategy-stated number is the current live SG number.
   - Recommendation: HUMAN-ACTION at Phase 5 execute — Martin confirms `NEXT_PUBLIC_WHATSAPP_SG` value. Until confirmed, WhatsApp CTA conditionally hidden.

7. **SG coach photography availability**
   - What we know: Haikel, Mark, Coach King are named in strategy PART 6C §8. Phase 3 D-10 and Phase 4 D-09 both established "no placeholder portraits" — HUMAN-ACTION gate pattern.
   - What's unclear: Whether portrait photos exist for all three.
   - Recommendation: Same HUMAN-ACTION gate. `/coaches/` page execution pauses if any named coach's portrait is missing from `public/photography/`. Explicit filename convention: `sg-coach-haikel.{avif,webp,jpg}`, `sg-coach-mark.*`, `sg-coach-king.*`.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js ≥22 | RSC + route handler | ✓ | 22.x | — |
| pnpm | package installs | ✓ | 10.30.3 | — |
| `@mux/mux-player-react` | Hero video | ✓ | ^3.11.8 | Poster image; if poster also missing, solid-color hero fallback |
| `NEXT_PUBLIC_MUX_SG_HERO_PLAYBACK_ID` | Hero video | ✗ pending | — | Poster image; fallback to brand-color block if no SG photo yet |
| Google Maps iframe embed URL for Katong Point | `/katong-point/` | ✗ pending | — | Placeholder div with NAP text |
| `CONTACT_INBOX_SG` | Booking form email routing | ✗ check Vercel | — | If missing at execute, route handler returns 500 "not configured" — HUMAN-ACTION blocks booking submission |
| `NEXT_PUBLIC_WHATSAPP_SG` (= `+6598076827`) | WhatsApp CTA | ✗ check Vercel | — | CTA hidden when env missing |
| `NEXT_PUBLIC_ROOT_URL`, `NEXT_PUBLIC_HK_URL` | SG→Root/HK cross-links | ✗ check Vercel | — | Preview fallback: `/?__market=root` / `/?__market=hk` per Phase 3 D-01 |
| `resend` + `RESEND_API_KEY` | Booking form delivery | ✓ / ✗ check | ^6.12.2 | Phase 3 already set up; check Vercel env populated |
| Real Katong Point photography in `public/photography/` | Hero + zones + coaches | ✗ pending | — | Solid brand-color hero + text-led layouts; sg-placeholder usable ONLY in designated gallery location |
| `sharp` | Photo reprocessing after curation | ✓ | ^0.34.5 | — |

**Missing dependencies with no fallback:** None — every gap has a graceful degradation.

**Missing dependencies with fallback:**
- Mux SG hero video: poster fallback (once real Katong photo exists); solid brand-color block before that.
- Map embed URL: placeholder div with NAP text.
- SG photography: text-led layouts with brand-color blocks. Phase 5 explicitly does NOT use HK photos on SG pages.
- Phone / WhatsApp / inbox env vars: CTAs conditionally render only when env is populated.
- Coach portraits: HUMAN-ACTION gate halts `/coaches/` page execution until resolved.

---

## Validation Architecture

`nyquist_validation: true` (from `.planning/config.json`).

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.5 (already installed) |
| Config file | `vitest.config.ts` (exists — Phase 1) |
| Quick run command | `pnpm test:unit` |
| Full suite command | `pnpm test:unit` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SG-01 | SG homepage H1 contains "Where Singapore's kids come to move" | unit | `pnpm test:unit` → `app/sg/page.test.ts` | ❌ Wave 0 |
| SG-01 | Katong Point chip present in HTML | unit | `pnpm test:unit` | ❌ Wave 0 |
| SG-01 | "Singapore's only MultiBall wall" trust line present | unit | `pnpm test:unit` | ❌ Wave 0 |
| SG-01 | Book a Free Trial CTA present and links to `/book-a-trial/` | unit | `pnpm test:unit` | ❌ Wave 0 |
| SG-02 | Katong Point page renders NAP: "451 Joo Chiat Road, Level 3" | unit | `pnpm test:unit` → `app/sg/katong-point/page.test.ts` | ❌ Wave 0 |
| SG-02 | Katong Point page has `<iframe>` with Google Maps src | unit | `pnpm test:unit` | ❌ Wave 0 |
| SG-02 | Katong Point page carries "Singapore's only MultiBall wall" | unit | `pnpm test:unit` | ❌ Wave 0 |
| SG-03 | All 3 zones sub-pages render unique H1 | unit | `pnpm test:unit` → `app/sg/weekly-classes/[all].test.ts` | ❌ Wave 0 |
| SG-03 | Zones pillar nav renders 3 zone links with correct ages | unit | `pnpm test:unit` | ❌ Wave 0 |
| SG-03 | Sports Zone page has MultiBall section with "Badge" | unit | `pnpm test:unit` → `app/sg/weekly-classes/sports-zone/page.test.ts` | ❌ Wave 0 |
| SG-04 | All 3 camp-type sub-pages render unique H1 | unit | `pnpm test:unit` → `app/sg/prodigy-camps/[all].test.ts` | ❌ Wave 0 |
| SG-04 | Camps pillar nav renders 3 camp-type links | unit | `pnpm test:unit` | ❌ Wave 0 |
| SG-06 | School partnerships page renders IFS callout | unit | `pnpm test:unit` → `app/sg/school-partnerships/page.test.ts` | ❌ Wave 0 |
| SG-08 | Coaches page renders Haikel + Mark + Coach King | unit | `pnpm test:unit` → `app/sg/coaches/page.test.ts` | ❌ Wave 0 |
| SG-10 | FAQ page renders 10 Q&A entries + has FAQPage JSON-LD | unit | `pnpm test:unit` → `app/sg/faq/page.test.ts` | ❌ Wave 0 |
| SG-11 | Booking form submits `market: "sg"` to `/api/contact` | unit (fetch mock) | `pnpm test:unit` → `app/sg/book-a-trial/booking-form.test.ts` | ❌ Wave 0 |
| SG-11 | Booking form pre-fills subject from `?subject=birthday-party` query param | unit | `pnpm test:unit` | ❌ Wave 0 |
| All SG | All SG pages return 200 (no 404s) | smoke (manual) | Curl each route on preview URL | manual |
| All SG | Any SG page → `/book-a-trial/` in ≤2 clicks | manual | Navigate in browser | manual |
| All SG | No `sg-placeholder-*` references in production SG pages | unit (grep-based) | Vitest `test("no placeholder leak", () => { ... })` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm test:unit`
- **Per wave merge:** `pnpm test:unit` full suite
- **Phase gate:** All Vitest tests green + manual smoke (all 15 SG routes return 200) + `grep -r "sg-placeholder" app/sg/` returns zero matches + visual-verify of homepage + Katong Point pages before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `app/sg/page.test.ts` — SG homepage regression tests (SG-01)
- [ ] `app/sg/katong-point/page.test.ts` — Katong NAP + map + MultiBall mention (SG-02)
- [ ] `app/sg/weekly-classes/pillar.test.ts` — all 3 zone sub-pages render unique H1; zones pillar nav correctness (SG-03)
- [ ] `app/sg/weekly-classes/sports-zone/page.test.ts` — MultiBall section + Badge treatment (SG-03)
- [ ] `app/sg/prodigy-camps/pillar.test.ts` — all 3 camp-type sub-pages (SG-04)
- [ ] `app/sg/school-partnerships/page.test.ts` — IFS callout (SG-06)
- [ ] `app/sg/coaches/page.test.ts` — Haikel + Mark + Coach King (SG-08)
- [ ] `app/sg/faq/page.test.ts` — FAQ + JSON-LD (SG-10)
- [ ] `app/sg/book-a-trial/booking-form.test.ts` — `market:"sg"` submission + subject pre-fill (SG-11)
- [ ] `tests/no-sg-placeholder-leak.test.ts` — grep-based regression for Pitfall 3

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No — no auth on Phase 5 pages | — |
| V3 Session Management | No | — |
| V4 Access Control | No | — |
| V5 Input Validation | Yes — booking form inputs | Server-side validation in existing `/api/contact` route handler. Existing validator already enforces `market ∈ ["hk", "sg"]`, email regex, message length bounds, honeypot rejection. Phase 5 adds no new validation logic; all SG fields flow through existing parameterised handler. [VERIFIED: route.ts source] |
| V6 Cryptography | No — no new secrets in client bundle | `NEXT_PUBLIC_MUX_SG_HERO_PLAYBACK_ID` is client-readable by design (Mux CDN delivery tokens, not auth tokens) |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Bot booking submissions | Spoofing | Honeypot field (D-04 from Phase 3) — already in route handler, no changes needed |
| Market field tampering (SG posing as HK) | Tampering | Route handler validates `market ∈ ["hk", "sg"]`; rejects others with 400 [VERIFIED: route.ts line ~75] |
| Subject field injection into email subject | Injection | Email subject template: `[${market.toUpperCase()}] ${subject || "New enquiry"} — ${name}` — subject is user-supplied. Current handler does NOT sanitize subject beyond length. Phase 5 should add subject length cap (≤100 chars) and stripping of newlines to prevent email-header injection. [NEW in Phase 5 — minor route.ts enhancement, OR handle in SG booking form before POST] |
| Map iframe injection | Tampering | Google Maps embed URL is hardcoded in `lib/sg-data.ts` — not user input. No risk. |
| Mux SG playback ID exposure | Information Disclosure | Public CDN token by design; no mitigation needed |
| Cross-market data leakage (HK content showing on SG routes) | Elevation | Middleware D-02 host authority prevents. Vitest hostile-request invariant (Phase 1 Plan 01-04) is the regression gate. |
| sg-placeholder photo leak to production | Integrity | Pitfall 3 grep-based test; CI blocker before merge |

**New mitigation recommended:** Subject-field length cap + newline strip in existing route handler. A 2-line change, low risk. Plan this as a small addition in Plan 05-01 (foundation) rather than a standalone plan.

---

## Sources

### Primary (HIGH confidence)

- [CITED: strategy.md PART 5] SG homepage 13-section wireframe
- [CITED: strategy.md PART 6C] SG homepage full copy (verbatim) — hero, sections 2-12, 10 FAQs
- [CITED: strategy.md PART 7.1 / 7.2] SG title + meta description recommendations (#1 used verbatim)
- [CITED: strategy.md PART 8.3] Katong Point NAP (451 Joo Chiat Road, Level 3, +65 9807 6827)
- [CITED: strategy.md PART 8.5] SG service-area wording (Katong, Joo Chiat, Marine Parade, East Coast, Tanjong Katong)
- [CITED: strategy.md PART 9.1–9.4] Schema deployment by page; SportsActivityLocation skeleton (Phase 4 adapts for SG)
- [CITED: strategy.md PART 12 Tier 1 #6–#12] SG page priority hierarchy (Katong / Weekly / Camps / Parties / Both book-a-trial / coaches / faq)
- [CITED: strategy.md PART 15.4 Weeks 4-9] Phase 5 timeline window
- [VERIFIED: app/api/contact/route.ts] Route handler accepts `market: "sg"`, validates, routes to `CONTACT_INBOX_SG` — zero backend changes needed
- [VERIFIED: public/photography/ ls output] Confirms `sg-placeholder-climbing-unsplash-trinks.*` is the only SG-tagged photo; 11 HK photos + 2 testimonial + 1 hero-gateway in set
- [VERIFIED: app/fonts.ts] Unbounded + Manrope + Baloo 2 all declared via next/font/google. Baloo exported but not bound to root `<html>`
- [VERIFIED: app/sg/layout.tsx + app/sg/page.tsx] Phase 1 stubs exist with `{children}` pass-through and teal-400 distinguisher stripe; Phase 5 replaces
- [VERIFIED: components/root/ + components/ui/] All Phase 2/3 primitives exist per Phase 4 assumption
- [VERIFIED: Phase 4 04-RESEARCH.md] Phase 4 patterns (map embed, booking form, hero video, pillar nav, JSON-LD) all carry forward to Phase 5 with trivial adaptation
- [VERIFIED: Phase 4 04-CONTEXT.md] D-01 through D-10 all carry forward where market-agnostic; D-02/D-03/D-04 (nav structure) are re-specified for SG per PART 5
- [VERIFIED: Phase 3 03-CONTEXT.md] D-01 (inbox env), D-02 (WhatsApp env), D-04 (honeypot), D-10 (real photography only) all carry forward
- [VERIFIED: Phase 2 02-CONTEXT.md] D-03 (Baloo scoped to ProGym — FLAGGED A1), D-06 (Mux video deferral pattern), D-07 (photo curation incl. sg-placeholder note)

### Secondary (MEDIUM confidence)

- [CITED: PROJECT.md Key Decisions] "Baloo is specified for Prodigy contexts" — disagrees with Phase 2 D-03; flagged as A1
- [CITED: STATE.md Replacement Targets] Explicit note that sg-placeholder-climbing-unsplash-trinks must be replaced in Phase 5 with real Katong Point imagery — confirms Phase 5 scope for HUMAN-ACTION

### Tertiary (LOW confidence / ASSUMED)

- [ASSUMED A4] Katong Point opening hours match PART 9.4 skeleton (Mon-Fri 09:00-19:00, Sat-Sun 09:00-17:00)
- [ASSUMED A5] Katong Point geo coordinates ≈ 1.3113, 103.9011
- [ASSUMED A6] iOS Safari muted autoplay works in production as in Phase 4 testing
- [ASSUMED A7] At least one non-Manjula SG testimonial exists
- [ASSUMED A9] `components/hk/venue-map.tsx` is reusable (not yet built as of research time — Phase 4 in progress)
- [ASSUMED A10] SG Mux playback ID arrives via same HUMAN-ACTION pattern as HK

---

## Project Constraints (from CLAUDE.md)

These constraints are extracted from `/Users/martin/Projects/proactive/CLAUDE.md` and apply to Phase 5 planning:

- **Tech stack locked:** Next.js 15 App Router + Tailwind + shadcn/ui pattern + Sanity CMS + Vercel + Cloudflare + Mux. Not open for re-debate. Phase 5 stays within this stack.
- **Single Next.js app:** SG pages live under `app/sg/`, NOT a separate repo or project. Middleware routes `sg.proactivsports.com` to this tree.
- **Core value:** Convert parents into trial bookings. Every SG page must have a clear Book-a-Trial / Enquire / WhatsApp path. Sticky nav CTA + final-CTA section on every page.
- **CMS independence:** SG content models are Phase 6. At Phase 5, hardcoded TS arrays must use schemas compatible with the Phase 6 Sanity model.
- **Performance budget:** LCP < 2.5s, INP < 200ms, CLS < 0.1 on SG homepage and pillar pages. Lighthouse 95+. Phase 5 verifies this on Vercel preview URL.
- **No black-hat SEO:** No thin geographic doorway pages. `/school-partnerships/` must be a real page, not a dumping ground for IFS/KidsFirst keywords.
- **Brand fidelity:** Honour existing Prodigy palette + typography. Baloo 2 scoping decision deferred per A1.
- **No secrets in git:** `NEXT_PUBLIC_MUX_SG_HERO_PLAYBACK_ID`, `CONTACT_INBOX_SG`, etc., via Vercel env; never hardcoded.
- **GSD workflow enforcement:** Phase 5 work happens through `/gsd-execute-phase` after discuss-phase + plan-phase. No direct edits outside the workflow.

---

## Metadata

**Confidence breakdown:**
- SG page structure + content: HIGH — directly from strategy PART 5 / 6C / 8 / 12
- Phase 4 pattern carry-forwards: HIGH — Phase 4 research is committed, locked, and directly reusable (map embed, booking form, hero video, pillar nav, JSON-LD, OG images, metadata base)
- Contact backend reuse: HIGH — VERIFIED via route.ts source inspection; `market: "sg"` already accepted
- sg-placeholder + photography strategy: HIGH — explicitly called out in Phase 2 D-07, STATE.md Replacement Targets, and user objective
- IFS consolidated-page decision: MEDIUM — strategy PART 12 Tier 2 #18 interpretable either way; recommend user confirmation in discuss-phase
- Baloo 2 scope for Prodigy: LOW — PROJECT.md and Phase 2 D-03 disagree; A1 flags for user resolution
- SG coach photography + IFS logo availability: LOW — both HUMAN-ACTION gated; research can't resolve
- Katong opening hours + geo coords: LOW — all HUMAN-ACTION; placeholders are usable until phase 7 SEO close

**Research date:** 2026-04-24
**Valid until:** 2026-05-24 (30-day shelf life — stable stack; strategy content is locked; sg-placeholder and Baloo scope may unlock earlier via user decisions in discuss-phase)

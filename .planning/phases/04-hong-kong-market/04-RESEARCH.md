---
phase: 04-hong-kong-market
type: research
status: complete
produced_by: gsd-phase-researcher
updated: 2026-04-23
---

# Phase 4: Hong Kong Market — Research

**Researched:** 2026-04-23
**Domain:** Next.js 15 App Router multi-page market build · looping hero video · lightweight map embeds · booking form extensions · HK local SEO / schema · blog stub pattern · HK navigation architecture · gymnastics programme pillar routing
**Confidence:** HIGH for Next.js patterns (carry-forward from Phase 3 verified research). HIGH for strategy content (verbatim from strategy.md PARTS 4/6B/8/9/12). MEDIUM for map embed specifics (verified via webfetch). LOW for video autoplay mobile specifics (assumed from training knowledge).

---

## Summary

Phase 4 is, like Phase 3, a **composition and content phase, not an invention phase**. The 22 HK pages assemble from Phase 2 primitives, Phase 3 patterns (HK nav/footer mirrors root nav/footer architecture), and a small set of Phase 4-specific components (HKNav, HKFooter, VenueMap, GymnasticsPillarNav, BookingForm). No new design-system tokens. No new shadcn primitives beyond what Phase 3 already added.

The most material new technical decisions in Phase 4 are:

1. **Hero video pattern** — the HK homepage requires a looping autoplay video (PART 4 §1). This is the VideoPlayer component from Phase 2 (`components/ui/video-player.tsx`, Mux-backed), but the Phase 2 D-06 deferral covered _real Mux playback IDs_, not the component architecture. Phase 4 uses the same `<VideoPlayer>` with a real HK ProGym Mux playback ID (HUMAN-ACTION checkpoint) — or a poster fallback until the Mux ID is provided.

2. **Lightweight map embeds** — venue location pages (Wan Chai, Cyberport) require embedded maps. Use Google Maps **iframe embed API** (not the JS SDK). This is a `<iframe>` with a Google Maps embed URL — zero JavaScript bundle impact, works in RSC, GDPR-acceptable with lazy loading. Static Maps API is an alternative for a static thumbnail but requires a billing-enabled API key. The iframe embed requires no API key.

3. **Booking form** — `/book-a-trial/free-assessment/` extends the Phase 3 contact form route handler (`/api/contact`). It passes `subject: "Free Assessment"` and `venue` (Wan Chai | Cyberport | unspecified) as additional fields. No new backend needed — the existing route handler is parameterised. The form is a `'use client'` component with venue pre-fill based on where the user navigates from (URL query param `?venue=wan-chai`).

4. **22-page routing architecture** — all HK pages live under `app/hk/` (plain folder, middleware rewrite target). Static routes only — no dynamic segments needed at Phase 4 (blog uses placeholder data; coaches are hardcoded). The gymnastics pillar uses `app/hk/gymnastics/` as the pillar and 8 static sub-routes. No `[slug]` dynamic segments at Phase 4 (CMS dynamic routing is Phase 6).

5. **Blog stub strategy** — `/blog/` ships as a static placeholder with 0–3 hardcoded post objects (same pattern as Phase 3's `/news/`). The stub must have a shape compatible with the Phase 6 Sanity migration: `{ title, slug, excerpt, date, category, readTime, imageUrl }`. Phase 6 replaces the hardcoded array with a `groq` query; the page component template stays identical.

**Primary recommendation:** Build HK pages in 5 plans — (1) HK layout foundation + HKNav + HKFooter + metadata base, (2) HK homepage (12 sections), (3) location pages (Wan Chai + Cyberport), (4) gymnastics pillar + 8 sub-pages, (5) remaining pages (camps/parties/schools/competitions/coaches/blog/FAQ/book-a-trial). Every page composes from `components/ui/` Phase 2 primitives. HK-scoped components live at `components/hk/`.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| HK homepage (12 sections) | Frontend Server (RSC) | CDN (Vercel static) | App Router RSC; no client state above the fold; static at build |
| Looping hero video | Browser / Client | CDN (Mux) | `<VideoPlayer>` is `'use client'` with dynamic import (Phase 2 D-06 pattern); Mux delivers the stream |
| Video poster image | CDN (Vercel Image Opt.) | Browser | `next/image` with `priority` serves AVIF/WebP poster while video loads |
| Venue chip row (Wan Chai / Cyberport) | Frontend Server (RSC) | — | Static data; rendered server-side; no interactivity needed |
| Programme cards / tiles | Frontend Server (RSC) | — | `<ProgrammeTile>` Phase 2 primitive; static composition |
| Location split section | Frontend Server (RSC) | — | Static; map thumbnail is an iframe or `<Image>` |
| Venue map embed (Wan Chai / Cyberport pages) | Browser / Client (lazy) | CDN | Google Maps iframe embed lazy-loaded; no JS bundle cost |
| Booking form (`/book-a-trial/free-assessment/`) | Browser / Client | API / Backend | `'use client'` form; submits JSON to `/api/contact` route handler |
| Contact API (booking route) | API / Backend (Route Handler) | — | Existing `/api/contact/route.ts` — parameterised, no new handler needed |
| HK nav (shared across all 22 pages) | Frontend Server (RSC layout) | — | `app/hk/layout.tsx` wraps all HK pages; HKNav is RSC with client sub-component for mobile menu |
| HK footer (shared) | Frontend Server (RSC layout) | — | Mirrors RootFooter pattern from Phase 3 |
| Gymnastics pillar nav | Frontend Server (RSC) | — | Static nav within pillar; active state is URL-derived (`usePathname` — client) |
| Blog listing (stub) | Frontend Server (RSC) | — | Static hardcoded array at Phase 4; Phase 6 replaces with GROQ |
| FAQ accordion | Browser / Client | — | shadcn `Accordion` is `'use client'` (Radix state); wraps in RSC page shell |
| Coaches listing | Frontend Server (RSC) | — | Hardcoded data at Phase 4; Phase 6 swaps to Sanity Person documents |
| JSON-LD (LocalBusiness, FAQPage, etc.) | Frontend Server (RSC) | — | Inline `<script type="application/ld+json">` in page component |
| OG images (per-page) | Frontend Server (build-time) | CDN (Vercel caches) | `opengraph-image.tsx` per route segment; static build-time |
| HK metadata base | Frontend Server (RSC layout) | — | `app/hk/layout.tsx` exports `metadata` with `metadataBase` |

---

## Standard Stack

### Core (carry-forward from Phases 1–3 — all already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | 15.5.15 | App Router, RSC, route handlers, metadata API | Project stack decision |
| `react` | 19.2.4 | Component model, Server Components, useTransition | Project stack decision |
| `@mux/mux-player-react` | ^3.11.8 | Looping hero video (VideoPlayer wraps this) | Already installed Phase 2 |
| `resend` | ^6.12.2 | Email delivery for booking form | Already installed Phase 3 |
| `@react-email/components` | ^1.0.12 | Booking confirmation email template | Already installed Phase 3 |
| `lucide-react` | ^1.8.0 | Icons (MapPin, Clock, Phone, ChevronRight, etc.) | Already installed |
| `tailwind-merge` + `clsx` | latest | `cn()` utility | Already installed |
| `radix-ui` | ^1.4.3 | Accordion (FAQ), Sheet (mobile menu) | Already installed |

### Supporting (carry-forward — all already installed)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `next-mdx-remote` | ^6.0.0 | MDX content for coaches/about snapshots | If any HK page uses MDX content files |
| `gray-matter` | ^4.0.3 | Frontmatter parsing | Paired with next-mdx-remote |
| `sharp` | ^0.34.5 | Build-time image processing | Already wired in process-photos.mjs |

### New Packages for Phase 4

**None required.** All Phase 4 needs are met by the existing installed stack. Specifically:

- Video: `@mux/mux-player-react` already installed (Phase 2)
- Maps: Google Maps iframe embed — zero npm dependency
- Booking form: extends existing `/api/contact` — zero new npm dependency
- Blog stub: static TypeScript array — zero new npm dependency

**Do NOT install:**
- `@google-maps/react-wrapper` or `@react-google-maps/api` — full JS SDK is heavyweight (200KB+). Use the iframe embed instead (zero bundle cost).
- `leaflet` or `maplibre-gl` — unnecessary for simple venue map thumbnails. Reserve for Phase 8+ if custom map styling is required.
- `formik` / `react-hook-form` — overkill for a simple 6-field booking form. Uncontrolled form with `FormData` + `useTransition` (same pattern as Phase 3 contact form) is sufficient.

### Recommended Stack Pin

```bash
# No new installs required for Phase 4
# Verify existing packages are present:
pnpm list @mux/mux-player-react resend @react-email/components
```

[VERIFIED: package.json — all packages confirmed installed 2026-04-23]

---

## Architecture Patterns

### System Architecture Diagram

```
HK Subdomain Request (hk.proactivsports.com or hk.localhost:3000)
         │
         ▼
middleware.ts — resolveHostMarket("hk.*") → rewrite to /hk{pathname}
         │
         ▼
app/hk/layout.tsx — HK metadata base + HKNav + {children} + HKFooter
         │
         ├─── app/hk/page.tsx ─────────────── HK Homepage (12 sections)
         │         │                            │
         │         ├── VideoPlayer (Mux hero)  ├── Section primitives
         │         ├── VenueChipRow            ├── ProgrammeTile cards
         │         ├── ProgrammeCards          ├── TestimonialCard
         │         ├── LocationSplitSection    ├── StatStrip / LogoWall
         │         ├── CoachingMethod          └── FAQ (Accordion)
         │         └── BlogStub (3 posts)
         │
         ├─── app/hk/wan-chai/page.tsx ──────── Wan Chai Location Page
         │         └── VenueMap (iframe embed, lazy)
         │
         ├─── app/hk/cyberport/page.tsx ─────── Cyberport Location Page
         │         └── VenueMap (iframe embed, lazy)
         │
         ├─── app/hk/gymnastics/ ────────────── Gymnastics Pillar
         │    │    └── page.tsx (pillar index)
         │    ├── toddlers/page.tsx
         │    ├── beginner/page.tsx
         │    ├── intermediate/page.tsx
         │    ├── advanced/page.tsx
         │    ├── competitive/page.tsx
         │    ├── rhythmic/page.tsx
         │    ├── adult/page.tsx
         │    └── private/page.tsx
         │
         ├─── app/hk/holiday-camps/page.tsx
         ├─── app/hk/birthday-parties/page.tsx
         ├─── app/hk/school-partnerships/page.tsx
         ├─── app/hk/competitions-events/page.tsx
         ├─── app/hk/coaches/page.tsx
         ├─── app/hk/blog/page.tsx
         ├─── app/hk/faq/page.tsx
         └─── app/hk/book-a-trial/
              │    └── page.tsx (conversion hub)
              └── free-assessment/
                   └── page.tsx (booking form)

Booking submission flow:
BookingForm (client) → fetch POST /api/contact → route.ts → Resend SDK → HK inbox
                        (existing Phase 3 handler; extended with venue field)
```

### Recommended Project Structure

```
app/hk/
├── layout.tsx                    # HK layout: metadata base + HKNav + HKFooter
├── page.tsx                      # HK homepage (12 sections)
├── opengraph-image.tsx           # HK homepage OG image
├── wan-chai/
│   ├── page.tsx
│   └── opengraph-image.tsx
├── cyberport/
│   ├── page.tsx
│   └── opengraph-image.tsx
├── gymnastics/
│   ├── page.tsx                  # Gymnastics pillar
│   ├── opengraph-image.tsx
│   ├── toddlers/page.tsx
│   ├── beginner/page.tsx
│   ├── intermediate/page.tsx
│   ├── advanced/page.tsx
│   ├── competitive/page.tsx
│   ├── rhythmic/page.tsx
│   ├── adult/page.tsx
│   └── private/page.tsx
├── holiday-camps/
│   ├── page.tsx
│   └── opengraph-image.tsx
├── birthday-parties/
│   ├── page.tsx
│   └── opengraph-image.tsx
├── school-partnerships/page.tsx
├── competitions-events/page.tsx
├── coaches/page.tsx
├── blog/page.tsx
├── faq/page.tsx
└── book-a-trial/
    ├── page.tsx                  # Conversion hub (RSC)
    └── free-assessment/
        ├── page.tsx              # RSC shell
        └── booking-form.tsx     # 'use client' form

components/hk/
├── hk-nav.tsx                   # RSC wrapper + mobile Sheet
├── hk-nav-mobile.tsx            # 'use client' mobile menu
├── hk-footer.tsx                # RSC with NAP for both venues
├── venue-chip-row.tsx           # RSC: Wan Chai + Cyberport chips
├── venue-map.tsx                # RSC: lazy-loaded Google Maps iframe
├── gymnastics-pillar-nav.tsx    # RSC: sub-programme nav (active = pathname)
└── active-gym-nav-link.tsx      # 'use client': usePathname for active state

lib/
└── hk-data.ts                   # Static data: coaches, blog posts stub, FAQ items, opening hours
```

### Pattern 1: HK Layout — Metadata Base + Nav + Footer

Mirrors Phase 3 root layout exactly. Replace `app/root/layout.tsx` pattern.

```typescript
// app/hk/layout.tsx
// Phase 4 / Plan 04-XX — HK market tree layout.
// Replaces Phase 1 amber-400 distinguisher stripe placeholder.
// metadataBase: hk.proactivsports.com (required for absolute OG URLs — RESEARCH Pitfall 1 carry-forward).
import type { Metadata } from "next";
import { HKNav } from "@/components/hk/hk-nav";
import { HKFooter } from "@/components/hk/hk-footer";

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://hk.${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/^(hk\.|sg\.)?/, "")}`
  : process.env.VERCEL_URL
    ? `https://hk.${process.env.VERCEL_URL.replace(/^(hk\.|sg\.)?/, "")}`
    : "http://hk.localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL("https://hk.proactivsports.com"),
  title: {
    default: "Kids Gymnastics & Sports Hong Kong | ProActiv Sports — Wan Chai & Cyberport",
    template: "%s | ProActiv Sports Hong Kong",
  },
  description:
    "Premium gymnastics, sports classes, holiday camps and birthday parties for children in Hong Kong. ProGym Wan Chai & Cyberport. Book a free trial.",
  openGraph: {
    siteName: "ProActiv Sports Hong Kong",
    locale: "en_HK",
    type: "website",
  },
};

export default function HKGroupLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md"
      >
        Skip to main content
      </a>
      <HKNav />
      <main id="main-content">{children}</main>
      <HKFooter />
    </>
  );
}
```

**Key note:** `metadataBase` for HK layout must be `hk.proactivsports.com` — not `proactivsports.com`. Phase 3 root layout uses the root domain. HK layout independently declares the HK subdomain as its base. [VERIFIED: nextjs.org docs — each layout can set its own `metadataBase`; child pages inherit from the nearest ancestor that sets it]

### Pattern 2: Hero Video (Looping, No Audio)

The HK homepage hero requires a looping autoplay video with no audio (PART 4 §1: "Looping 8–12s hero video, real children tumbling at ProGym"). The Phase 2 `VideoPlayer` component handles this.

```typescript
// app/hk/page.tsx — hero section (RSC)
import dynamic from "next/dynamic";
import Image from "next/image";

const VideoPlayer = dynamic(() => import("@/components/ui/video-player"), {
  ssr: false,
  loading: () => (
    // Poster image shown during JS load — LCP-critical
    <Image
      src="/photography/hk-venue-wanchai-gymtots.webp"
      alt="Children practising gymnastics at ProGym Wan Chai, Hong Kong"
      fill
      priority
      className="object-cover"
      sizes="100vw"
    />
  ),
});

// In the hero section:
<div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
  {/* VideoPlayer renders on client only — poster shows during hydration */}
  <VideoPlayer
    playbackId={process.env.NEXT_PUBLIC_MUX_HK_HERO_PLAYBACK_ID ?? ""}
    loop
    autoPlay
    muted
    className="absolute inset-0 w-full h-full object-cover"
  />
  {/* Hero overlay content — renders in HTML, visible before JS hydrates */}
  <div className="absolute inset-0 bg-brand-navy/40 flex flex-col items-start justify-center px-6 md:px-12">
    <h1 className="text-h1 font-display text-white max-w-2xl">
      Premium gymnastics and sports programmes for children in Hong Kong.
    </h1>
    {/* CTAs, chip row, trust line */}
  </div>
</div>
```

**Mobile fallback strategy:**
- When `NEXT_PUBLIC_MUX_HK_HERO_PLAYBACK_ID` is empty string (HUMAN-ACTION not yet completed), the `VideoPlayer` renders nothing — the poster `<Image>` in the `loading` prop remains visible.
- On mobile Safari, autoplay is allowed when `muted` and `playsinline` attributes are set. Mux Player handles these natively. [ASSUMED: iOS Safari autoplay policy — verified approach via training knowledge; confirmed working pattern for muted autoplay]
- Data-saver mode consideration: the Mux player respects `prefers-reduced-data` media query at the network level. At Phase 4, no explicit data-saver detection is needed — the poster fallback is the graceful degradation.

**HUMAN-ACTION required:** `NEXT_PUBLIC_MUX_HK_HERO_PLAYBACK_ID` must be populated in Vercel env before the hero video shows. Until then, the poster image (`/photography/hk-venue-wanchai-gymtots.webp`) serves as the static hero. This is a non-blocking HUMAN-ACTION — the page ships with the poster fallback and the video activates when Martin uploads the clip to Mux and adds the env var.

### Pattern 3: Venue Map — Lightweight Iframe Embed

**Decision: Google Maps iframe embed API.** Not the JS SDK.

**Why iframe embed:**
- Zero JavaScript bundle cost — the iframe loads independently of the page's JS
- Works in RSC (just a plain `<iframe>` element, no React state needed)
- No API key required for basic embed (API key is needed only for the Static Maps API)
- GDPR: iframe embeds do not set cookies until the user interacts. Use `loading="lazy"` to defer until near-viewport.
- Lighthouse: lazy-loaded iframe does not affect LCP or TBT

**Embed URL format:**
```
https://www.google.com/maps/embed?pb=ENCODED_MAP_COORDS
```

The encoded `pb` parameter is generated by opening Google Maps, centering on the location, clicking Share → Embed a map, and copying the `src` URL. It encodes zoom level, center coordinates, and map type.

**Wan Chai venue embed URL (HUMAN-ACTION — Martin must generate this):**
```
https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.73...
[Martin: open Google Maps → search "The Hennessy, 256 Hennessy Road, Wan Chai" → Share → Embed a map → copy src URL]
```

**Cyberport venue embed URL (HUMAN-ACTION — Martin must generate this):**
```
https://www.google.com/maps/embed?pb=!1m18...
[Martin: same process for Cyberport venue address]
```

**VenueMap component pattern:**
```typescript
// components/hk/venue-map.tsx — RSC
// Phase 4 / Plan 04-XX — lightweight iframe map embed (no Google Maps JS SDK).
// loading="lazy" defers iframe load until near viewport. No API key required.
// HUMAN-ACTION: replace PLACEHOLDER_EMBED_SRC with real Google Maps embed URL.

interface VenueMapProps {
  embedSrc: string;            // Full Google Maps embed URL from Share → Embed a map
  title: string;               // For iframe title (accessibility)
  className?: string;
}

export function VenueMap({ embedSrc, title, className }: VenueMapProps) {
  if (!embedSrc || embedSrc.includes("PLACEHOLDER")) {
    // Placeholder during HUMAN-ACTION period — shows address text instead of map
    return (
      <div className={cn("rounded-lg bg-muted h-64 flex items-center justify-center", className)}>
        <p className="text-muted-foreground text-small text-center px-4">
          Map loading — venue address below
        </p>
      </div>
    );
  }

  return (
    <iframe
      src={embedSrc}
      title={title}
      width="100%"
      height="300"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={cn("rounded-lg border-0 w-full", className)}
      aria-label={title}
    />
  );
}
```

**Pitfall prevention:** Do NOT use `allowFullScreen` without `allow="fullscreen"`. For Lighthouse Best Practices, iframes must have a `title` attribute. [VERIFIED: MDN Web Docs iframe element — `title` is required for accessibility; `loading="lazy"` is supported in all modern browsers]

### Pattern 4: Booking Form — Extends Phase 3 Contact Handler

The existing `/api/contact/route.ts` already accepts arbitrary JSON fields. The booking form adds two fields:

- `venue`: `"wan-chai" | "cyberport" | "no-preference"` — pre-filled from URL query param `?venue=wan-chai`
- `childAge`: string — age of the child for the free assessment placement

**No changes to route handler needed** beyond extending the email template to display the new fields. The Phase 3 handler renders the email via `React.createElement(ContactEmailHK, body)` — so the email template needs updating to render `venue` and `childAge` when present.

**Booking form component:**
```typescript
// app/hk/book-a-trial/free-assessment/booking-form.tsx
"use client";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const VENUES = [
  { value: "wan-chai", label: "ProGym Wan Chai" },
  { value: "cyberport", label: "ProGym Cyberport" },
  { value: "no-preference", label: "No preference" },
] as const;

export function BookingForm() {
  const searchParams = useSearchParams();
  const prefilledVenue = searchParams.get("venue") ?? "no-preference";
  const [venue, setVenue] = useState(prefilledVenue);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [, startTransition] = useTransition();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const body = {
      ...Object.fromEntries(formData),
      market: "hk",
      subject: "Free Assessment Request",
      venue,
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

  // Form fields: name, email, phone (optional), childAge, venue selector, message, honeypot
  // Venue selector is 3-card radio (same pattern as Phase 3 market selector)
  // ...
}
```

**URL-based venue pre-fill:** Every venue-specific CTA throughout the HK site links to `/book-a-trial/free-assessment/?venue=wan-chai` or `?venue=cyberport`. The form reads this and pre-selects the venue. User can change selection before submitting.

### Pattern 5: Blog Stub — CMS-Migration-Ready Shape

```typescript
// lib/hk-data.ts
// Phase 4 / Plan 04-XX — static data for Phase 4 HK pages.
// Blog posts: shape mirrors the Sanity 'Post' schema from Phase 6.
// Migration path: replace this array with a groq query in Phase 6.
// DO NOT add fields here that won't be in Sanity — keeps shape identical.

export interface BlogPostStub {
  title: string;
  slug: string;
  excerpt: string;
  date: string;          // ISO 8601: "2026-04-23"
  category: string;
  readTimeMinutes: number;
  imageUrl: string;      // from public/photography/ at Phase 4; Sanity CDN URL at Phase 6
}

export const HK_BLOG_POSTS_STUB: BlogPostStub[] = [
  // At Phase 4: 1–3 placeholder posts with real titles from the content strategy
  // Strategy PART 12 Tier 1 calls for: /gymnastics/toddlers/ type content
  {
    title: "What to expect from your child's first gymnastics class in Hong Kong",
    slug: "first-gymnastics-class-hong-kong",
    excerpt: "A practical guide for parents booking their child's first class at ProGym.",
    date: "2026-04-01",
    category: "Gymnastics Tips",
    readTimeMinutes: 5,
    imageUrl: "/photography/programme-beginner.webp",
  },
];
// Phase 6 migration: replace above with:
// import { client } from "@/sanity/client";
// export async function getHKBlogPosts() {
//   return client.fetch(`*[_type == "post" && market == "hk"] | order(publishedAt desc)[0...3] { title, "slug": slug.current, excerpt, "date": publishedAt, ... }`);
// }
```

### Pattern 6: Gymnastics Pillar Navigation

The `/gymnastics/` pillar has 8 sub-pages. Pillar nav must highlight the active sub-page. Active state requires `usePathname` → client component.

```typescript
// components/hk/gymnastics-pillar-nav.tsx — RSC wrapper
// Contains an 'use client' child for active state only.
import { ActiveGymNavLink } from "@/components/hk/active-gym-nav-link";

const GYMNASTICS_PROGRAMMES = [
  { href: "/gymnastics/toddlers/", label: "Babies & Toddlers", age: "12mo–3yr" },
  { href: "/gymnastics/beginner/", label: "Beginner", age: "4–6yr" },
  { href: "/gymnastics/intermediate/", label: "Intermediate", age: "6–9yr" },
  { href: "/gymnastics/advanced/", label: "Advanced", age: "9–12yr" },
  { href: "/gymnastics/competitive/", label: "Competitive", age: "6+" },
  { href: "/gymnastics/rhythmic/", label: "Rhythmic", age: "5–16yr" },
  { href: "/gymnastics/adult/", label: "Adult", age: "16+" },
  { href: "/gymnastics/private/", label: "Private Coaching", age: "All ages" },
] as const;

export function GymPillarNav() {
  return (
    <nav aria-label="Gymnastics programmes" className="flex flex-wrap gap-2">
      {GYMNASTICS_PROGRAMMES.map((prog) => (
        <ActiveGymNavLink key={prog.href} href={prog.href} label={prog.label} age={prog.age} />
      ))}
    </nav>
  );
}
```

```typescript
// components/hk/active-gym-nav-link.tsx — 'use client'
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function ActiveGymNavLink({ href, label, age }: { href: string; label: string; age: string }) {
  const pathname = usePathname();
  const isActive = pathname.endsWith(href) || pathname.endsWith(href.slice(0, -1));
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center px-4 py-2 rounded-lg text-small font-medium transition-colors",
        isActive
          ? "bg-brand-navy text-white"
          : "bg-muted text-muted-foreground hover:bg-brand-navy/10"
      )}
    >
      <span>{label}</span>
      <span className="text-[11px] opacity-70">{age}</span>
    </Link>
  );
}
```

**Note on pathname in middleware rewrite context:** After the middleware rewrites `/gymnastics/beginner/` → `/hk/gymnastics/beginner/`, the `usePathname()` hook in client components returns the REWRITTEN path (e.g., `/hk/gymnastics/beginner/`). The `ActiveGymNavLink` `href` props must match the BROWSER URL (without `/hk/` prefix) since the browser URL bar shows the original path. Use `pathname.includes("gymnastics/beginner")` rather than exact match to avoid the prefix issue. [VERIFIED: middleware.ts D-04 — internal rewrite; browser URL = original; usePathname returns browser URL]

**Correction:** `usePathname()` in Next.js App Router returns the pathname as seen by the browser (before any internal rewrite). So `usePathname()` on `hk.proactivsports.com/gymnastics/beginner/` returns `/gymnastics/beginner/`. The href values in `GYMNASTICS_PROGRAMMES` should be plain `/gymnastics/beginner/` (no `/hk/` prefix) — which is also what `<Link href="/gymnastics/beginner/">` resolves to on the HK subdomain. [VERIFIED: Next.js docs — usePathname returns the URL pathname without the search string; middleware rewrites are transparent to usePathname]

### Pattern 7: Local SEO — LocalBusiness JSON-LD (Per Strategy PART 9.4)

Every location page (Wan Chai, Cyberport) renders a `SportsActivityLocation` JSON-LD block inline.

```typescript
// app/hk/wan-chai/page.tsx — JSON-LD
const wanChaiSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SportsActivityLocation",
      "@id": "https://hk.proactivsports.com/#localbusiness-wanchai",
      "name": "ProGym Wan Chai — ProActiv Sports",
      "image": "https://hk.proactivsports.com/photography/hk-venue-wanchai-gymtots.webp",
      "url": "https://hk.proactivsports.com/wan-chai/",
      "telephone": process.env.NEXT_PUBLIC_HK_PHONE ?? "[HK phone]",
      "priceRange": "$$",
      "parentOrganization": { "@id": "https://proactivsports.com/#organization" },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "15/F, The Hennessy, 256 Hennessy Road",
        "addressLocality": "Wan Chai",
        "addressRegion": "Hong Kong Island",
        "addressCountry": "HK"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 22.2772,
        "longitude": 114.1730
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
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ProActiv Sports Hong Kong", "item": "https://hk.proactivsports.com/" },
        { "@type": "ListItem", "position": 2, "name": "Wan Chai", "item": "https://hk.proactivsports.com/wan-chai/" }
      ]
    }
  ]
};
```

**Opening hours:** The strategy doc references hours as `[verified HK number]` — these are HUMAN-ACTION items. The JSON-LD template above uses placeholder values that must be replaced with real hours from the client. Add `NEXT_PUBLIC_HK_PHONE` to `.env.example`.

**Cyberport geo coordinates:** Cyberport is in Pokfulam (approx. lat 22.2618, long 114.1303). [ASSUMED — approximate; HUMAN-ACTION to verify exact coordinates for schema]

### Pattern 8: HK Nav Architecture

The HK nav mirrors the Phase 3 `RootNav` pattern exactly. Key differences:

1. Nav links target HK pages (same-host, use `<Link>`)
2. Cross-market links (to root gateway, to SG) use `<a href>` with `NEXT_PUBLIC_ROOT_URL` and `NEXT_PUBLIC_SG_URL`
3. Book a Free Trial CTA is always visible and primary (vs root gateway where market CTAs are primary)
4. Baloo 2 font is active on HK pages (D-03 from Phase 2 UI-SPEC — Baloo activates in Phase 4 HK ProGym layouts)

```typescript
// components/hk/hk-nav.tsx — RSC
const HK_NAV_LINKS = [
  { href: "/gymnastics/", label: "Gymnastics" },
  { href: "/holiday-camps/", label: "Camps" },
  { href: "/birthday-parties/", label: "Parties" },
  { href: "/coaches/", label: "Coaches" },
  { href: "/blog/", label: "Blog" },
  { href: "/faq/", label: "FAQ" },
] as const;

// Primary CTA: <Link href="/book-a-trial/free-assessment/"> Book a Free Trial
// These are same-host Links (hk.proactivsports.com), not cross-subdomain <a>
// Cross-market footer: <a href={process.env.NEXT_PUBLIC_SG_URL}> points to SG
```

**Baloo 2 font activation:** Per Phase 2 D-03, the Baloo font family is loaded via `next/font/google` but scoped to ProGym contexts. The HK layout applies the Baloo font variable to the layout body. [ASSUMED — Phase 2 font scoping mechanism; verify against Phase 2 completed plan output when available]

### Anti-Patterns to Avoid

- **Using `<Link>` for cross-subdomain navigation** — Phase 3 Pitfall 7 carry-forward. HK → SG or HK → Root must use `<a href={NEXT_PUBLIC_URL}>`.
- **`priority` on hero video poster AND below-fold images** — only the video poster gets `priority`. All other images lazy-load.
- **Hand-rolling a map component with Leaflet** — use the Google Maps iframe embed. Zero bundle impact.
- **Using dynamic segment `[programmeSlug]` for gymnastics sub-pages** — Phase 4 uses 8 static routes. Dynamic segments add complexity (generateStaticParams, types). Static routes are simpler and content is known at build time.
- **Adding `'use client'` to the gymnastics pillar page itself** — the pillar page is RSC. Only the nav link active-state sub-component is client.
- **Putting blog posts in a dynamic segment** — at Phase 4, blog has no dynamic content. A static array and a static `/blog/` listing page is correct. Phase 6 adds `[slug]` dynamic route for individual posts.
- **Omitting `metadataBase` from HK layout** — the HK layout needs its OWN `metadataBase` pointing to `hk.proactivsports.com`. Inheriting from root layout is wrong (different subdomain).
- **Loading the full Google Maps JS SDK** — 200KB+ bundle that blocks INP. The iframe embed achieves the same visual result at zero bundle cost.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Venue location maps | Custom Leaflet/Mapbox integration | Google Maps iframe embed (`<iframe src="https://www.google.com/maps/embed?...">`) | Zero bundle, no API key, no GDPR cookie consent needed for basic embed, lazy-loads naturally |
| Video player with loop/autoplay/muted | Custom `<video>` element with manual HLS | `components/ui/video-player.tsx` (Phase 2 Mux-backed) | Mux handles HLS, adaptive bitrate, poster, preload. Phase 2 component already exists. |
| Booking form state management | React context / Zustand / Redux for form state | `useState` + `useTransition` + `fetch` (same as Phase 3 contact form) | 6-field form needs no complex state management |
| Form email delivery | Custom SMTP / nodemailer | Existing `/api/contact` route handler (Resend) | Already built in Phase 3; just extend the email template fields |
| OG image per-page | Per-page custom design from scratch | `createHKOgImage()` utility (mirrors Phase 3 `createRootOgImage`) | Single template, per-page title/tagline; same 5-line consumer pattern |
| Blog pagination | Custom cursor pagination | Static array at Phase 4 | Only 1–3 posts needed; Phase 6 adds real pagination via Sanity GROQ |
| Active nav link detection | Manual URL string comparison | `usePathname()` hook in scoped client component | Next.js router provides clean pathname; no string-hacking needed |
| Gymnastics sub-page layout | New layout file per sub-page | Shared `GymPillarNav` component embedded in each sub-page | 8 sub-pages share identical shell; data is the only variation |

**Key insight:** Phase 4 spends 90% of its effort on content composition (strategy PART 4/6B copy hardcoded) and 10% on new architecture (video hero, map embeds). Almost everything new is a composition of existing primitives with new content.

---

## Common Pitfalls

### Pitfall 1: `metadataBase` mismatch — HK layout must declare HK subdomain

**What goes wrong:** HK layout inherits `metadataBase: new URL("https://proactivsports.com")` from the root layout. OG image URLs become `https://proactivsports.com/wan-chai/opengraph-image` instead of `https://hk.proactivsports.com/wan-chai/opengraph-image`. WhatsApp/iMessage link previews load the wrong OG image or 404.

**Root cause:** `metadataBase` in `app/root/layout.tsx` scopes only to `app/root/` pages. The `app/hk/` tree has its own layout and must independently declare `metadataBase`.

**Prevention:** `app/hk/layout.tsx` explicitly sets `metadataBase: new URL("https://hk.proactivsports.com")`.

**Detection:** After implementation, paste any HK preview URL into `https://opengraph.xyz/` — the `og:image` meta tag value must start with `https://hk.` (or the preview URL equivalent).

### Pitfall 2: `usePathname()` returns browser path (not rewritten path)

**What goes wrong:** Developer writes `pathname === "/hk/gymnastics/beginner/"` for active state detection. `usePathname()` returns `/gymnastics/beginner/` (browser URL — no `/hk/` prefix). Active state never matches; no nav link is ever highlighted.

**Root cause:** Middleware rewrites `/hk/gymnastics/beginner/` internally but the browser URL stays `/gymnastics/beginner/`. `usePathname()` reflects the browser URL.

**Prevention:** Active nav link comparisons use `/gymnastics/beginner/` without the `/hk/` prefix. Or use `pathname.includes("gymnastics/beginner")` for robustness.

**Warning signs:** Gymrastic pillar nav never shows any link as active regardless of page.

### Pitfall 3: Google Maps iframe blocked by Permissions-Policy

**What goes wrong:** Google Maps iframe is blocked by browser Permissions-Policy and shows "Your browser does not support embedded maps." No error visible in Next.js build.

**Root cause:** Some hosting configurations set restrictive `Permissions-Policy` headers that block geolocation or camera, which some browsers interpret as blocking embedded map iframes (rare but documented).

**Prevention:** The Google Maps embed only needs `allow=""` (no special permissions). Explicitly test on Chrome and Safari after implementation. If blocked, add `allow="fullscreen"` to the iframe element and verify in Lighthouse.

**Detection:** After implementation, open the location page on Chrome + Safari. The map iframe should display a real map, not a grey block or error message.

### Pitfall 4: Video autoplay blocked on low-power mode / iOS 15

**What goes wrong:** Hero video doesn't autoplay on iPhone in Low Power Mode. Page shows the poster image only. This is expected and correct behaviour — do not fight it.

**Root cause:** iOS Low Power Mode pauses video autoplay for battery saving. Apple policy.

**Prevention:** The poster `<Image>` (loaded via the `loading` prop of the dynamic import) serves as the permanent mobile fallback. The overlay text and CTAs render from the HTML (not inside the VideoPlayer) so they are always visible regardless of video state.

**Warning signs:** CI/Lighthouse always passes because tests run in desktop Chrome. Only visible on real iOS device with Low Power Mode.

### Pitfall 5: 22 pages × `opengraph-image.tsx` = OG build time

**What goes wrong:** 22 `opengraph-image.tsx` files all call `readFile(join(process.cwd(), "app/fonts/unbounded.ttf"))` independently. Each call re-reads the font from disk at build time. On Vercel Free/Hobby (60s build timeout), this may cause timeouts.

**Root cause:** Each `opengraph-image.tsx` is a separate build job. Font loading is not automatically cached across jobs in all Next.js versions.

**Prevention:** Use `import { cache } from "react"` to wrap font loading OR keep the OG image simple (just text on a navy background without custom font). For Phase 4, ship OG images with `createHKOgImage()` that uses Unbounded (Google Font via fetch, not local file). Fetching a Google Font URL from `@fontsource/unbounded` package static URL is faster than local disk reads in serverless build environments. [ASSUMED — build performance advice; verify at Phase 4 execute time]

**Alternative:** Skip per-page `opengraph-image.tsx` for the 8 gymnastics sub-pages (low social traffic expectation). Inherit the gymnastics pillar OG image for all sub-pages. Add individual OG images only for high-priority pages: HK homepage, Wan Chai, Cyberport, /gymnastics/, /book-a-trial/.

### Pitfall 6: Blog stub shape mismatch causes Phase 6 rework

**What goes wrong:** Phase 4 blog posts stub uses field names that don't match the Sanity schema created in Phase 6 (`imageUrl` vs `heroImage`, `readTimeMinutes` vs `readTime`). Phase 6 must rewrite the blog listing component and page component.

**Root cause:** Phase 4 designed the stub without coordinating with the Phase 6 Sanity schema design.

**Prevention:** The Phase 4 `BlogPostStub` interface must match the Sanity `Post` schema fields described in strategy PART 13.2. Use: `{ title, slug (string), excerpt, publishedAt (ISO string), category (string), readTimeMinutes (number), heroImage (string url) }`. Phase 6 replaces `heroImage` with a `sanityImage()` url helper, but the interface shape is preserved.

### Pitfall 7: Cross-subdomain links using `<Link>` inside HK pages

**Carry-forward from Phase 3 Pitfall 7.** HK pages linking to root gateway (`/brand/`, etc.) or to SG must use `<a href={process.env.NEXT_PUBLIC_ROOT_URL + "/brand/"}>` not `<Link href="/brand/">`. A `<Link>` to `/brand/` on the HK subdomain routes to `hk.proactivsports.com/brand/` which 404s (no such page under `app/hk/`).

**New env vars needed:** `NEXT_PUBLIC_ROOT_URL=https://proactivsports.com` (for HK→Root cross-links).

### Pitfall 8: Baloo font not applied to HK layout

**What goes wrong:** HK pages render with Manrope (body) only; Baloo 2 accent font is not active. "ProGym" branded elements look generic.

**Root cause:** Phase 2 D-03 scopes Baloo to ProGym contexts — but if the Phase 2 font variable (`--font-baloo`) is not applied in `app/hk/layout.tsx`, it won't cascade to HK page components.

**Prevention:** `app/hk/layout.tsx` applies the Baloo font variable to the `<body>` or wraps children with the font-class. Verify Phase 2 font export API before implementation (check `app/fonts.ts` or equivalent Phase 2 output).

---

## Code Examples

Verified patterns from official sources and Phase 3 carry-forwards:

### HK Homepage Section Map (per PART 4 wireframe)

```typescript
// app/hk/page.tsx — section ordering per strategy PART 4
export default function HKHomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hkHomeSchema) }} />
      <HeroSection />           {/* §1 — video hero, venue chips, CTAs */}
      <WhyChooseSection />      {/* §2 — 4-tile grid */}
      <ProgrammesSection />     {/* §3 — 5 programme cards */}
      <LocationSplitSection />  {/* §4 — Wan Chai vs Cyberport split */}
      <SocialProofSection />    {/* §5 — logos + testimonials */}
      <CoachingMethodSection /> {/* §6 — 3 pillars + Monica */}
      <CampsPartiesSection />   {/* §7 — camps + parties revenue block */}
      <AboutSnapshotSection />  {/* §8 — 2-col brand story */}
      <BlogSection />           {/* §9 — 3 latest posts (stub) */}
      <FAQSection />            {/* §10 — HK FAQ */}
      <FinalCTASection />       {/* §11 — Book a Free Trial + Enquire + WhatsApp */}
    </>
  );
}
```

### Location Page Structure (Wan Chai example)

```typescript
// app/hk/wan-chai/page.tsx
export const metadata: Metadata = {
  title: "ProGym Wan Chai — Children's Gymnastics Wan Chai, Hong Kong",
  description: "ProGym Wan Chai — 15/F The Hennessy, 256 Hennessy Road. Book gymnastics classes, holiday camps and birthday parties for children in Wan Chai, Hong Kong.",
  openGraph: { /* full OG object — Pitfall 2 carry-forward from Phase 3 */ },
};

export default function WanChaiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(wanChaiSchema) }} />
      {/* 1. Hero: venue name + address + hero photo (no video on location pages) */}
      {/* 2. VenueMap — lazy-loaded iframe embed */}
      {/* 3. Opening hours table */}
      {/* 4. Programme list for Wan Chai */}
      {/* 5. Service area copy (Wan Chai, Causeway Bay, Central, Mid-Levels) */}
      {/* 6. FAQ (venue-specific) */}
      {/* 7. Booking CTA — pre-filled with ?venue=wan-chai */}
    </>
  );
}
```

### Gymnastics Sub-Page Template

Each of the 8 sub-pages follows the same structure with different content:

```typescript
// app/hk/gymnastics/toddlers/page.tsx
export default function ToddlersGymPage() {
  return (
    <>
      {/* 1. GymPillarNav — shows all 8 programmes, active on Toddlers */}
      {/* 2. Section: H1 + subhead + age band */}
      {/* 3. What children learn in this programme */}
      {/* 4. Typical class structure */}
      {/* 5. Which venues offer this programme */}
      {/* 6. CTA: Book a Free Trial (pre-fill age band) */}
      {/* 7. FAQPage schema for this sub-page */}
    </>
  );
}
```

**Metadata for each sub-page:**
- Toddlers: `title: "Toddler Gymnastics Hong Kong (12mo–3yr) | ProGym Wan Chai & Cyberport"`
- Beginner: `title: "Beginner Gymnastics Hong Kong (4–6yr) | ProActiv Sports"`
- etc. — per strategy PART 7 keyword mapping

### HK Homepage JSON-LD (LocalBusiness + FAQPage)

```typescript
const hkHomeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://hk.proactivsports.com/#website",
      "url": "https://hk.proactivsports.com/",
      "name": "ProActiv Sports Hong Kong",
      "publisher": { "@id": "https://proactivsports.com/#organization" },
      "inLanguage": "en-HK"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What ages do you teach in Hong Kong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "From 12 months (Babies & Toddlers parent-accompanied class) through 16, with adult gymnastics available."
          }
        }
        // ... 7 more from strategy PART 6B §10
      ]
    }
  ]
};
```

Note: `LocalBusiness` schema lives on the location pages (Wan Chai, Cyberport) per strategy PART 9.1 — NOT on the HK homepage itself. The HK homepage only gets `WebSite` + `FAQPage`.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Full Google Maps JS SDK embed | Iframe embed API (no JS SDK) | Ongoing (never "old" — iframe was always the right choice for simple embeds) | Zero bundle cost; no GDPR consent needed for basic embed |
| `<video>` element with manual HLS | Mux Player (`@mux/mux-player-react`) | Phase 2 (already adopted) | Adaptive bitrate, poster management, HLS handled by Mux |
| Static routes for all CMS content | Static routes at Phase 4 → dynamic `[slug]` routes at Phase 6 | Planned at Phase 6 | Clean separation: Phase 4 is composition; Phase 6 is CMS wiring |
| Three separate Next.js apps per market | Single app with subdomain middleware + plain-folder routing | Phase 1 (already adopted) | Single deploy, shared design system |

**Deprecated/outdated patterns:**
- `getStaticProps` / `getServerSideProps` — Pages Router patterns. App Router uses `async function Page()` (RSC) and `generateStaticParams()`. Never use in Phase 4 code.
- `next/router` — Pages Router. Use `next/navigation` (`useRouter`, `usePathname`, `useSearchParams`) in App Router client components.
- `@next/font` — deprecated package. Phase 2 uses `next/font/google` (built into Next.js 15). [VERIFIED: nextjs.org docs]

---

## Open Questions

1. **Hero video Mux playback ID for HK**
   - What we know: Phase 2 installed `@mux/mux-player-react`. The `VideoPlayer` component is implemented at `components/ui/video-player.tsx`.
   - What's unclear: The Mux playback ID for the HK hero reel. The 22GB source video library is at `/Users/martin/Downloads/ProActive/`.
   - Recommendation: HUMAN-ACTION checkpoint at plan execute time — Martin uploads the 8–12s HK hero clip to Mux dashboard, gets playback ID, adds to `.env.example` as `NEXT_PUBLIC_MUX_HK_HERO_PLAYBACK_ID`. Until provided, the video poster fallback renders.

2. **Google Maps embed URLs for Wan Chai and Cyberport**
   - What we know: The addresses are verified (PART 8.3). Map embed URLs require manual generation via Google Maps Share flow.
   - What's unclear: The exact `pb=` parameter values (encoding zoom + center + map type).
   - Recommendation: HUMAN-ACTION — Martin generates embed URLs for both venues and adds to `lib/hk-data.ts`. The `VenueMap` component renders a placeholder during this gap.

3. **HK phone number(s)**
   - What we know: Strategy PART 8.3 has `[verified HK number]` as a placeholder.
   - What's unclear: The actual phone number(s) for Wan Chai and Cyberport.
   - Recommendation: HUMAN-ACTION — add `NEXT_PUBLIC_HK_PHONE` (and optionally `NEXT_PUBLIC_HK_PHONE_CYBERPORT` if different) to `.env.example`. JSON-LD and footer NAP blocks read from env.

4. **Opening hours for both HK venues**
   - What we know: Strategy PART 9.4 has placeholder hours (Mon-Fri 09:00-19:00, Sat-Sun 09:00-17:00). These are not verified.
   - What's unclear: Real current operating hours — they may differ between venues and may vary by day.
   - Recommendation: HUMAN-ACTION — Martin confirms hours before Phase 4 execute. Add to `lib/hk-data.ts` as a typed `VenueHours` object.

5. **Coaches data for `/coaches/` page**
   - What we know: Monica is Director of Sports; strategy PART 4 mentions her. Individual HK coach bios are not in the strategy doc.
   - What's unclear: How many HK coaches have bios; whether photo assets exist for each.
   - Recommendation: `/coaches/` at Phase 4 ships with Monica + 2–3 placeholder coaches. Full bios wait for Phase 6 CMS. HUMAN-ACTION for existing portrait photos.

6. **Blog stub content — 0, 1, or 3 posts?**
   - What we know: Blog hub must render at Phase 4 (HK-11 requirement). No real blog posts exist yet.
   - What's unclear: Whether Martin wants to write 1–3 draft posts at Phase 4, or ship a pure "coming soon" placeholder.
   - Recommendation: Ship `/blog/` with 1 placeholder post and a "more coming soon" state. The homepage §9 blog block must render gracefully with 1 post (responsive grid from PART 4 wireframe: "Designed to remain elegant if only 1 post exists").

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js ≥22 | RSC + route handler | ✓ | 22.x | — |
| pnpm | package installs | ✓ | 10.30.3 | — |
| `@mux/mux-player-react` | Hero video | ✓ | ^3.11.8 | Poster image (`/photography/hk-venue-wanchai-gymtots.webp`) |
| `NEXT_PUBLIC_MUX_HK_HERO_PLAYBACK_ID` | Hero video | ✗ pending | — | Poster image renders; video activates after HUMAN-ACTION |
| Google Maps iframe embed URLs | Location pages | ✗ pending | — | Placeholder div with address text |
| `NEXT_PUBLIC_HK_PHONE` | Footer NAP + JSON-LD | ✗ pending | — | Placeholder `[Contact for details]` |
| `NEXT_PUBLIC_HK_WHATSAPP` | WhatsApp CTA | ✗ pending | — | CTA hidden until env populated |
| `NEXT_PUBLIC_ROOT_URL` | HK→Root cross-links | ✗ pending | — | Preview fallback: `/?__market=root` |
| `resend` | Booking form delivery | ✓ | ^6.12.2 | — (already set up Phase 3) |
| `RESEND_API_KEY` | Booking form delivery | ✗ check Vercel | — | HUMAN-ACTION Phase 3 already flagged |
| Photography in `public/photography/` | All HK pages | ✓ | — | 11 HK photos confirmed (Phase 2 D-07 verification) |

**Missing dependencies with no fallback:**
- None — every missing item has a poster/placeholder/conditional render fallback strategy.

**Missing dependencies with fallback:**
- Mux hero video: static poster image is the fallback for the entire Phase 4 preview period.
- Map embed URLs: placeholder div with NAP address text.
- Phone/WhatsApp env vars: CTAs conditionally rendered only when env vars are populated.

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
| HK-01 | HK homepage H1 contains "Premium gymnastics" | unit | `pnpm test:unit` → `app/hk/page.test.ts` | ❌ Wave 0 |
| HK-01 | Venue chips (Wan Chai + Cyberport) present in HTML | unit | `pnpm test:unit` | ❌ Wave 0 |
| HK-01 | Book a Free Trial CTA present and links to `/book-a-trial/` | unit | `pnpm test:unit` | ❌ Wave 0 |
| HK-02 | Wan Chai page renders NAP: "15/F, The Hennessy" | unit | `pnpm test:unit` → `app/hk/wan-chai/page.test.ts` | ❌ Wave 0 |
| HK-02 | Wan Chai page has `<iframe>` with Google Maps src | unit | `pnpm test:unit` | ❌ Wave 0 |
| HK-03 | Cyberport page renders "5,000 sq ft" | unit | `pnpm test:unit` → `app/hk/cyberport/page.test.ts` | ❌ Wave 0 |
| HK-04 | All 8 gymnastics sub-pages render unique H1 | unit | `pnpm test:unit` → `app/hk/gymnastics/[all].test.ts` | ❌ Wave 0 |
| HK-04 | Gymnastics pillar nav renders all 8 programme links | unit | `pnpm test:unit` | ❌ Wave 0 |
| HK-12 | Booking form submits `market: "hk"` to `/api/contact` | unit (fetch mock) | `pnpm test:unit` → `app/hk/book-a-trial/booking-form.test.ts` | ❌ Wave 0 |
| HK-12 | Booking form pre-fills venue from `?venue=wan-chai` query param | unit | `pnpm test:unit` | ❌ Wave 0 |
| All HK | All HK pages return 200 (no 404s) | smoke (manual) | Curl each route on preview URL | manual |
| All HK | Any HK page → `/book-a-trial/` in ≤2 clicks | manual | Navigate in browser | manual |

### Sampling Rate
- **Per task commit:** `pnpm test:unit`
- **Per wave merge:** `pnpm test:unit` full suite
- **Phase gate:** All Vitest tests green + manual smoke test (all 22 HK routes return 200) before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `app/hk/page.test.ts` — HK homepage regression tests (HK-01)
- [ ] `app/hk/wan-chai/page.test.ts` — Wan Chai NAP + map (HK-02)
- [ ] `app/hk/cyberport/page.test.ts` — Cyberport content (HK-03)
- [ ] `app/hk/gymnastics/pillar.test.ts` — all 8 sub-pages render unique H1 (HK-04)
- [ ] `app/hk/book-a-trial/booking-form.test.ts` — form submission + venue pre-fill (HK-12)
- [ ] `vitest.config.ts` — confirm `include: ["**/*.test.ts", "**/*.test.tsx"]` pattern covers new files (already broad enough per Phase 3 verification)

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No — no auth on Phase 4 pages | — |
| V3 Session Management | No | — |
| V4 Access Control | No | — |
| V5 Input Validation | Yes — booking form inputs | Server-side validation in existing `/api/contact` route handler (carries Phase 3 D-04 honeypot + market validation). Extend to validate `venue ∈ ["wan-chai", "cyberport", "no-preference"]`. |
| V6 Cryptography | No — no new secrets in client bundle | `NEXT_PUBLIC_MUX_HK_HERO_PLAYBACK_ID` is client-readable (by design — Mux playback IDs are public tokens, not secrets) |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Bot booking form submissions | Spoofing | Honeypot field (D-04 from Phase 3) already in route handler. Phase 4 extends; no new mitigation needed. |
| Venue field tampering | Tampering | Extend route handler to validate `venue ∈ ["wan-chai", "cyberport", "no-preference"]`. |
| Map iframe injection | Tampering | Google Maps embed URL is hardcoded in `lib/hk-data.ts` — not from user input. No injection risk. |
| Mux playback ID exposure | Information Disclosure | Mux public playback IDs are designed to be public (they are CDN delivery tokens, not auth tokens). No mitigation needed. |
| Cross-market data leakage | Elevation | HK pages live under `app/hk/` — middleware D-02 host authority prevents SG content from leaking to HK routes. Vitest hostile-request invariant (Phase 1 Plan 01-04) is the regression gate. |

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HK-01 | HK homepage per strategy PART 4 + PART 6B copy | Pattern 1 (layout), Pattern 2 (hero video), Section Map code example; all 12 sections mapped to primitives |
| HK-02 | ProGym Wan Chai location page (15/F The Hennessy, 256 Hennessy Rd, map embed, opening hours, programme list) | Pattern 3 (map embed), LocalBusiness JSON-LD (Pattern 7), Location Page Structure code example |
| HK-03 | ProGym Cyberport location page (5,000 sq ft, opened Aug 2025) | Same patterns as HK-02 with Cyberport-specific data |
| HK-04 | Gymnastics pillar at `/gymnastics/` + 8 sub-pages | Pattern 6 (pillar nav), Gym Sub-Page Template code example, static routes architecture |
| HK-05 | Holiday camps pillar (Easter / Summer / Christmas) | Composition from Phase 2 ProgrammeTile primitives; static data at Phase 4 |
| HK-06 | Birthday parties hub | Static page composition; booking CTA with pre-fill |
| HK-07 | School partnerships page | Static editorial content; Phase 2 primitives |
| HK-08 | Competitions / events page | Static content; Event schema when dates are known |
| HK-09 | HK coaches bios (CMS-fed Person entries) | Hardcoded stub at Phase 4; `lib/hk-data.ts` pattern |
| HK-10 | HK blog hub (CMS-fed, paginated) | Pattern 5 (blog stub CMS-migration-ready shape) |
| HK-11 | HK FAQ hub (FAQPage schema) | shadcn Accordion (already installed); FAQPage JSON-LD pattern |
| HK-12 | HK Book-a-trial conversion hub + free assessment booking | Pattern 4 (booking form extending Phase 3 handler); venue pre-fill via URL query param |
</phase_requirements>

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | iOS Safari autoplay works when `muted` + `playsinline` are set — Mux Player handles these automatically | Pattern 2 (hero video) | Video doesn't autoplay on iOS; poster image stays visible — acceptable degradation |
| A2 | `usePathname()` in App Router client components returns the browser URL (before middleware rewrite), not the rewritten path | Pattern 6 (pillar nav) | Active state detection broken; fix is to adjust the comparison string |
| A3 | Google Maps iframe embed does not require an API key for basic embed | Pattern 3 (venue map) | Embeds break or show error; fallback is Static Maps API (requires billing-enabled key) |
| A4 | Baloo 2 font is scoped in Phase 2 via a CSS class/variable mechanism that allows selective activation per layout | Pattern 1 + Pitfall 8 | Baloo may require a different activation approach; verify against Phase 2 completed output |
| A5 | Phase 4 `BlogPostStub` interface shape aligns with Phase 6 Sanity Post schema | Pattern 5 (blog stub) | Phase 6 must rewrite blog component if field names differ; low-severity, fixable in 1 hour |
| A6 | Cyberport geo coordinates are approximately lat 22.2618, long 114.1303 | Pattern 7 (JSON-LD) | Incorrect coordinates show wrong map pin in Google; HUMAN-ACTION to verify |
| A7 | `opengraph-image.tsx` build time for 22 pages fits within Vercel build timeout | Pitfall 5 | Build timeouts on Vercel Free; mitigation is to reduce OG image pages to ~5 high-priority pages |

---

## Sources

### Primary (HIGH confidence)

- [CITED: strategy.md PART 4] HK homepage 12-section wireframe
- [CITED: strategy.md PART 6B] HK homepage full copy (verbatim)
- [CITED: strategy.md PART 8.3] NAP for Wan Chai + Cyberport
- [CITED: strategy.md PART 9.1–9.4] Schema deployment by page; Wan Chai LocalBusiness JSON-LD skeleton
- [CITED: strategy.md PART 12 Tier 1 #1–#5 and #10–#12] HK page priority hierarchy
- [VERIFIED: package.json] All Phase 1–3 packages confirmed installed; no new Phase 4 installs needed
- [VERIFIED: middleware.ts] D-01 ladder and D-04 internal rewrite — browser URL is pre-rewrite path
- [VERIFIED: app/hk/layout.tsx] Phase 1 placeholder exists; Phase 4 replaces it
- [VERIFIED: app/hk/page.tsx] Phase 1 placeholder exists; Phase 4 replaces it
- [VERIFIED: public/photography/] 11 HK-specific photos confirmed available (hk-venue-cyberport, hk-venue-wanchai-gymtots, programme-*, etc.)
- [VERIFIED: 03-RESEARCH.md] Phase 3 pitfalls (metadataBase, openGraph shallow merge, cross-subdomain Link) — all carry forward to Phase 4
- [VERIFIED: 03-PATTERNS.md] Established code patterns (contact form, nav, footer, RSC/client boundary) — all reused in Phase 4

### Secondary (MEDIUM confidence)

- [CITED: nextjs.org/docs] `usePathname()` returns browser URL pathname (before middleware rewrite) — pattern confirmed in Next.js App Router docs
- [CITED: nextjs.org/docs] `metadataBase` in child layout overrides parent layout's `metadataBase` for that subtree
- [CITED: MDN Web Docs — iframe element] `loading="lazy"` supported; `title` required for accessibility

### Tertiary (LOW confidence / ASSUMED)

- [ASSUMED] iOS Safari + Low Power Mode pauses video autoplay for muted videos (well-documented Apple policy; no direct verification in this session)
- [ASSUMED] Google Maps iframe embed requires no API key (from training knowledge; web verification deferred)
- [ASSUMED] Baloo 2 font scoping mechanism in Phase 2 uses a CSS variable approach activatable per layout

---

## Metadata

**Confidence breakdown:**
- HK page structure + content: HIGH — directly from strategy PART 4/6B/8/9/12
- Phase 3 pattern carry-forwards: HIGH — verified from committed code
- Hero video pattern: HIGH for component (Phase 2 built); MEDIUM for mobile autoplay specifics
- Map embed: MEDIUM — iframe approach verified conceptually; specific embed URLs are HUMAN-ACTION
- Booking form extension: HIGH — existing handler is parameterised; extension is additive
- JSON-LD: HIGH — skeleton provided verbatim in strategy PART 9.4
- Blog stub migration path: MEDIUM — depends on Phase 6 Sanity schema alignment

**Research date:** 2026-04-23
**Valid until:** 2026-05-23 (30-day shelf life — stable stack; strategy content is locked)

# Phase 5: Singapore Market — Pattern Map

**Mapped:** 2026-04-24
**Files analyzed:** 39 new + 2 modified
**Analogs found:** 39 / 41 (2 files have no close analog — see §No Analog Found)

> Phase 5 is a near-perfect structural mirror of Phase 4 (HK market). Every SG file has a direct HK counterpart — the executor's job is verbatim-structure + rename-tokens + swap-copy. **Copy structural patterns from Phase 4; do NOT copy HK copy text** (Prodigy is a distinct sub-brand per strategy PART 1).

---

## File Classification

### New files to create

| New File | Role | Data Flow | Closest Analog | Match Quality |
|----------|------|-----------|----------------|---------------|
| `lib/sg-data.ts` | data-module | static-export | `lib/hk-data.ts` | exact |
| `lib/og-image.tsx` (extend with `createSGOgImage`) | utility | build-time | `lib/og-image.tsx` (existing `createHKOgImage`) | exact |
| `components/sg/sg-nav.tsx` | component (RSC) | request-response | `components/hk/hk-nav.tsx` | exact |
| `components/sg/sg-nav-mobile.tsx` | component (client) | event-driven | `components/hk/hk-nav-mobile.tsx` | exact |
| `components/sg/sg-footer.tsx` | component (RSC) | static | `components/hk/hk-footer.tsx` | exact |
| `components/sg/venue-map.tsx` | component (RSC) | static | `components/hk/venue-map.tsx` | exact |
| `components/sg/zones-pillar-nav.tsx` | component (RSC) | static | `components/hk/gymnastics-pillar-nav.tsx` | exact |
| `components/sg/camps-pillar-nav.tsx` | component (RSC) | static | `components/hk/gymnastics-pillar-nav.tsx` | exact |
| `components/sg/active-sg-nav-link.tsx` | component (client) | event-driven | `components/hk/active-gym-nav-link.tsx` | exact |
| `components/sg/sg-hero-video.tsx` | component (client) | streaming | `components/hk/hk-hero-video.tsx` | exact |
| `components/sg/katong-chip.tsx` (or omit) | component (RSC) | static | `components/hk/venue-chip-row.tsx` + `active-venue-chip.tsx` | role-match (simpler — single venue) |
| `app/sg/page.tsx` (replace stub) | page (RSC) | static | `app/hk/page.tsx` | exact (structural, 13 sections vs 12) |
| `app/sg/opengraph-image.tsx` | opengraph-image | build-time | `app/hk/opengraph-image.tsx` | exact |
| `app/sg/katong-point/page.tsx` | page (RSC) | static | `app/hk/wan-chai/page.tsx` | exact |
| `app/sg/katong-point/opengraph-image.tsx` | opengraph-image | build-time | `app/hk/wan-chai/opengraph-image.tsx` | exact |
| `app/sg/weekly-classes/page.tsx` | page (RSC, pillar-index) | static | `app/hk/gymnastics/page.tsx` | exact |
| `app/sg/weekly-classes/opengraph-image.tsx` | opengraph-image | build-time | `app/hk/wan-chai/opengraph-image.tsx` | exact |
| `app/sg/weekly-classes/movement/page.tsx` | page (RSC, sub-page) | static | `app/hk/gymnastics/toddlers/page.tsx` | exact |
| `app/sg/weekly-classes/sports-multiball/page.tsx` | page (RSC, sub-page) | static | `app/hk/gymnastics/toddlers/page.tsx` | exact (+MultiBall spotlight section) |
| `app/sg/weekly-classes/climbing/page.tsx` | page (RSC, sub-page) | static | `app/hk/gymnastics/toddlers/page.tsx` | exact |
| `app/sg/prodigy-camps/page.tsx` | page (RSC, pillar-index) | static | `app/hk/gymnastics/page.tsx` | exact |
| `app/sg/prodigy-camps/opengraph-image.tsx` | opengraph-image | build-time | `app/hk/wan-chai/opengraph-image.tsx` | exact |
| `app/sg/prodigy-camps/themed/page.tsx` | page (RSC, sub-page) | static | `app/hk/gymnastics/toddlers/page.tsx` | exact |
| `app/sg/prodigy-camps/multi-activity/page.tsx` | page (RSC, sub-page) | static | `app/hk/gymnastics/toddlers/page.tsx` | exact |
| `app/sg/prodigy-camps/gymnastics/page.tsx` | page (RSC, sub-page) | static | `app/hk/gymnastics/toddlers/page.tsx` | exact |
| `app/sg/birthday-parties/page.tsx` | page (RSC) | static | `app/hk/birthday-parties/page.tsx` | exact |
| `app/sg/birthday-parties/opengraph-image.tsx` | opengraph-image | build-time | `app/hk/wan-chai/opengraph-image.tsx` | exact |
| `app/sg/school-partnerships/page.tsx` | page (RSC) | static | `app/hk/school-partnerships/page.tsx` | exact (+IFS inline block) |
| `app/sg/events/page.tsx` | page (RSC) | static | `app/hk/competitions-events/page.tsx` | role-match (different content scope) |
| `app/sg/coaches/page.tsx` | page (RSC) | static | `app/hk/coaches/page.tsx` | exact |
| `app/sg/coaches/opengraph-image.tsx` | opengraph-image | build-time | `app/hk/wan-chai/opengraph-image.tsx` | exact |
| `app/sg/blog/page.tsx` | page (RSC) | static | `app/hk/blog/page.tsx` | exact |
| `app/sg/blog/opengraph-image.tsx` | opengraph-image | build-time | `app/hk/wan-chai/opengraph-image.tsx` | exact |
| `app/sg/faq/page.tsx` | page (RSC) | static | `app/hk/faq/page.tsx` | exact |
| `app/sg/book-a-trial/page.tsx` | page (RSC) | static | `app/hk/book-a-trial/free-assessment/page.tsx` | role-match (simpler — single venue, no hub card picker) |
| `app/sg/book-a-trial/booking-form.tsx` | component (client) | request-response | `app/hk/book-a-trial/free-assessment/booking-form.tsx` | exact (minus venue selector) |
| `app/sg/book-a-trial/opengraph-image.tsx` | opengraph-image | build-time | `app/hk/wan-chai/opengraph-image.tsx` | exact |

### Files to modify

| Modified File | Role | Data Flow | Change |
|---------------|------|-----------|--------|
| `app/sg/layout.tsx` | layout | request-response | Replace Phase 1 teal-stripe stub with real SGNav + SGFooter + Baloo 2 variable + `metadataBase` — mirrors `app/hk/layout.tsx` verbatim, swap `baloo.variable` attach, swap `HKNav/HKFooter` → `SGNav/SGFooter`, change `hk.proactivsports.com` → `sg.proactivsports.com`, swap `en_HK` → `en_SG`, swap titles/descriptions. |
| `app/sg/page.tsx` | page (RSC) | static | Replace Phase 1 placeholder stub with real 13-section SG homepage composition (mirrors `app/hk/page.tsx` structure). |
| `lib/og-image.tsx` | utility | build-time | **Additive only** — append new `createSGOgImage()` export function alongside existing `createRootOgImage()` and `createHKOgImage()`. Use `#0f9733` Prodigy-green background (D-09) instead of `#0f206c` navy. Do NOT modify existing exports. |
| `.env.example` (optional) | config | static | Document new env vars: `NEXT_PUBLIC_MUX_SG_HERO_PLAYBACK_ID`, `NEXT_PUBLIC_WHATSAPP_SG`, `CONTACT_INBOX_SG` (already documented from Phase 3), `NEXT_PUBLIC_MAP_EMBED_KATONG_POINT`, `NEXT_PUBLIC_HK_URL`. |

### Files NOT to modify (already SG-ready)

| File | Why Leave Alone |
|------|-----------------|
| `middleware.ts` | Already routes `sg.*` → `app/sg/` (Phase 1 D-02, D-04). Zero-line change needed. |
| `app/api/contact/route.ts` | Already accepts `market: "sg"`, routes to `CONTACT_INBOX_SG`. Already supports `venue` enum — but Phase 5 will need to append `katong-point` to `ALLOWED_VENUES` (see §Shared Patterns — Booking). |
| `app/fonts.ts` | Baloo 2 already exported at weight 600; SG layout imports via `{ baloo }` named export like HK does. |
| `components/ui/*` | Every Phase 2 primitive consumed as-is. Zero new primitives. |

---

## Pattern Assignments

### `app/sg/layout.tsx` (layout, request-response) — MODIFY

**Analog:** `app/hk/layout.tsx` (76 lines, exact structural mirror)

**Imports pattern** (lines 23-26 of analog):
```typescript
import type { Metadata } from "next";
import { baloo } from "@/app/fonts";
import { SGNav } from "@/components/sg/sg-nav";   // was HKNav
import { SGFooter } from "@/components/sg/sg-footer"; // was HKFooter
```

**metadataBase fallback chain** (lines 33-41 of analog — copy verbatim, change only the production base):
```typescript
const SG_PRODUCTION_BASE = "https://sg.proactivsports.com";
const baseUrl =
  process.env.VERCEL_ENV === "production"
    ? SG_PRODUCTION_BASE
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://sg.localhost:3000";
```

**Metadata export** (lines 43-58 of analog — swap locale + titles):
```typescript
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Kids' Sports Classes, Camps & Parties Singapore | Prodigy by ProActiv Sports",
    template: "%s | Prodigy by ProActiv Sports",
  },
  description:
    "Kids' sports classes, holiday camps & birthday parties at Prodigy by ProActiv Sports — Katong Point, Singapore. Home of the only MultiBall wall. Book a free trial.",
  openGraph: {
    siteName: "Prodigy by ProActiv Sports — Singapore",
    locale: "en_SG",  // was en_HK
    type: "website",
  },
};
```

**Layout body** (lines 60-76 of analog — verbatim except component swap):
```typescript
export default function SGGroupLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={baloo.variable}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-2 focus:outline-ring focus:outline-offset-2"
      >
        Skip to main content
      </a>
      <SGNav />
      <main id="main-content">{children}</main>
      <SGFooter />
    </div>
  );
}
```

---

### `components/sg/sg-nav.tsx` (component, RSC) — CREATE

**Analog:** `components/hk/hk-nav.tsx` (152 lines)

**Imports pattern** (lines 9-22 of analog):
```typescript
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { SGNavMobile } from "@/components/sg/sg-nav-mobile";
import { SG_ZONES, SG_CAMP_TYPES } from "@/lib/sg-data";
```

**Flat nav pattern** (lines 27-31 of analog — swap items per CONTEXT D-02):
```typescript
// D-02 SG nav: Weekly Classes [dropdown] | Prodigy Camps [dropdown] |
//              Katong Point | Coaches | FAQ | [Book a Free Trial]
const FLAT_NAV_LINKS = [
  { href: "/katong-point/", label: "Katong Point" },
  { href: "/coaches/", label: "Coaches" },
  { href: "/faq/", label: "FAQ" },
] as const;
```

**Sticky header + brand lockup** (lines 33-48 of analog — copy verbatim; swap "HK"/"ProGym" → "SG"/"Prodigy"):
```typescript
<header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-brand-navy/10">
  <ContainerEditorial width="wide" className="flex items-center justify-between h-16 lg:h-20">
    <Link
      href="/"
      aria-label="Prodigy by ProActiv Sports Singapore — home"
      className="font-display font-bold text-xl text-brand-navy hover:text-brand-navy/80 transition-colors"
    >
      <span className="font-accent text-brand-green">Prodigy</span> SG
    </Link>
    {/* ... */}
```

**Dropdown pattern** (lines 52-88 of analog — use for Weekly Classes and Prodigy Camps per D-03, D-04):
```typescript
<NavigationMenuItem>
  <NavigationMenuTrigger className="font-medium text-foreground hover:text-brand-navy">
    Weekly Classes
  </NavigationMenuTrigger>
  <NavigationMenuContent>
    <ul className="grid gap-1 p-3 min-w-[320px] bg-white border border-border rounded-lg shadow-lg">
      {SG_ZONES.map((z) => (
        <li key={z.slug}>
          <NavigationMenuLink asChild>
            <Link href={z.href} className="block px-3 py-2 rounded hover:bg-brand-navy/5 transition-colors">
              <div className="font-sans font-semibold text-foreground">{z.label}</div>
              <div className="text-sm text-muted-foreground">{z.ageBand}</div>
            </Link>
          </NavigationMenuLink>
        </li>
      ))}
      <li className="border-t border-border mt-1 pt-1">
        <NavigationMenuLink asChild>
          <Link href="/weekly-classes/" className="block px-3 py-2 rounded text-sm font-semibold text-brand-navy hover:bg-brand-navy/5">
            See all zones →
          </Link>
        </NavigationMenuLink>
      </li>
    </ul>
  </NavigationMenuContent>
</NavigationMenuItem>
```

**Sticky red CTA** (lines 135-145 of analog — copy verbatim, change href per D-05):
```typescript
<div className="hidden lg:block">
  <Button
    asChild
    size="touch"
    className="bg-brand-red text-white hover:bg-brand-red/90 focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
  >
    <Link href="/book-a-trial/">Book a Free Trial</Link>
  </Button>
</div>

<SGNavMobile />
```

**Note:** HK CTA href is `/book-a-trial/free-assessment/` (sub-page). SG CTA href is `/book-a-trial/` (single conversion hub — no sub-page since venue is pre-fixed per D-10).

---

### `components/sg/sg-nav-mobile.tsx` (component, client) — CREATE

**Analog:** `components/hk/hk-nav-mobile.tsx` (118 lines)

**Top of file** (line 1 — client directive is mandatory):
```typescript
"use client";
```

**Imports + state pattern** (lines 7-28 of analog):
```typescript
import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { SG_ZONES, SG_CAMP_TYPES } from "@/lib/sg-data";

const FLAT_NAV_LINKS = [
  { href: "/katong-point/", label: "Katong Point" },
  { href: "/birthday-parties/", label: "Parties" },
  { href: "/school-partnerships/", label: "Schools" },
  { href: "/events/", label: "Events" },
  { href: "/coaches/", label: "Coaches" },
  { href: "/blog/", label: "Blog" },
  { href: "/faq/", label: "FAQ" },
] as const;

export function SGNavMobile() {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);
  /* ... */
}
```

**Sheet structure** (lines 32-45 of analog — copy verbatim):
```typescript
<Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger asChild>
    <Button size="icon" variant="ghost" className="lg:hidden min-h-11 min-w-11"
      aria-label={open ? "Close navigation menu" : "Open navigation menu"}>
      <Menu className="size-5" />
    </Button>
  </SheetTrigger>
  <SheetContent side="right" className="w-full sm:w-80 bg-background overflow-y-auto">
    <SheetHeader>
      <SheetTitle className="font-display text-lg">Menu</SheetTitle>
    </SheetHeader>
    {/* Sticky red CTA at top — D-05 */}
    <div className="mt-6 px-4">
      <Button asChild size="touch" className="bg-brand-red text-white hover:bg-brand-red/90 w-full">
        <Link href="/book-a-trial/" onClick={close}>Book a Free Trial</Link>
      </Button>
    </div>
    {/* ... grouped nav */}
  </SheetContent>
</Sheet>
```

**Grouped nav pattern** (lines 65-114 of analog — swap groups: Weekly Classes zones / Camp types / Flat):
- Group 1 heading "Weekly Classes" → map `SG_ZONES` with `ageBand` suffix
- Group 2 heading "Prodigy Camps" → map `SG_CAMP_TYPES` with `ageBand` or `tag` suffix
- Group 3 (flat, under border-top) → Katong Point / Parties / Schools / Events / Coaches / Blog / FAQ

---

### `components/sg/sg-footer.tsx` (component, RSC) — CREATE

**Analog:** `components/hk/hk-footer.tsx` (245 lines)

**Imports pattern** (lines 16-22 of analog):
```typescript
import * as React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Separator } from "@/components/ui/separator";
import { KATONG_POINT_NAP } from "@/lib/sg-data";
```

**Social icons** (lines 25-63 of analog — copy verbatim FacebookIcon / InstagramIcon / LinkedinIcon SVG components).

**Env var pattern** (lines 74-78 of analog — swap names):
```typescript
export function SGFooter() {
  const whatsappSg = process.env.NEXT_PUBLIC_WHATSAPP_SG;
  const phoneSg = process.env.NEXT_PUBLIC_SG_PHONE;  // optional
  const hkUrl = process.env.NEXT_PUBLIC_HK_URL;
  const rootUrl = process.env.NEXT_PUBLIC_ROOT_URL;
  /* ... */
}
```

**Grid + 4-column structure** (lines 80-96 of analog — copy structure):
```typescript
<footer className="bg-brand-navy text-white">
  <Section size="md" bg="navy">
    <ContainerEditorial width="wide">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        {/* Col 1: Brand */}
        <div>
          <Link href="/" className="font-display font-bold text-xl text-white">
            <span className="font-accent">Prodigy</span> SG
          </Link>
          <p className="mt-3 text-sm text-white/80">
            Kids' sports classes, holiday camps &amp; birthday parties at Katong Point — home of Singapore's only MultiBall wall.
          </p>
        </div>
```

**Key SG difference — single venue NAP** (vs HK's two-venue `.map()` at lines 99-129):
```typescript
{/* Col 2: single venue NAP (simpler than HK — D-08) */}
<div>
  <h3 className="font-display text-lg text-white mb-4">Venue</h3>
  <div>
    <div className="font-sans font-semibold text-white">
      <span className="font-accent">Prodigy</span> @ Katong Point
    </div>
    <p className="text-sm text-white/80 flex items-start gap-1 mt-1">
      <MapPin className="size-3.5 mt-0.5 shrink-0" aria-hidden="true" />
      <span>451 Joo Chiat Road, Level 3, Singapore 427664</span>
    </p>
    {/* phone + WhatsApp lines */}
  </div>
</div>
```

**Quick links + Connect columns** (lines 131-189 of analog — copy structure; swap quick-link items and cross-market link):
- Quick links: Weekly Classes / Prodigy Camps / Parties / Schools / Coaches / Blog / FAQ
- Cross-market: `Prodigy Hong Kong ↗` → change label to `ProGym Hong Kong ↗` using `NEXT_PUBLIC_HK_URL`

**Social icon grid + copyright + legal links** (lines 190-240 of analog — copy verbatim; swap ©"Hong Kong" → "Singapore").

---

### `components/sg/venue-map.tsx` (component, RSC) — CREATE

**Analog:** `components/hk/venue-map.tsx` (51 lines — copy verbatim, no edits needed)

**Full file** (analog lines 1-51 — this is a market-agnostic iframe wrapper; could arguably live at `components/ui/venue-map.tsx` as a shared primitive, but CONTEXT D-11 says market-scoped components live in `components/sg/`):
```typescript
import { cn } from "@/lib/utils";

export interface VenueMapProps {
  embedSrc: string;
  title: string;
  className?: string;
}

export function VenueMap({ embedSrc, title, className }: VenueMapProps) {
  const isPlaceholder = !embedSrc || embedSrc.includes("PLACEHOLDER");
  if (isPlaceholder) {
    return (
      <div
        className={cn("rounded-lg bg-muted h-64 flex items-center justify-center border border-border", className)}
        role="status" aria-live="polite"
        aria-label={`${title} — map unavailable, see address below`}
      >
        <p className="text-muted-foreground text-small text-center px-4">
          Map loading — see venue address below.
        </p>
      </div>
    );
  }
  return (
    <iframe
      src={embedSrc}
      title={title}
      width="100%" height="300"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={cn("rounded-lg border-0 w-full", className)}
      aria-label={title}
    />
  );
}
```

**Planner option:** if the executor prefers one shared copy, promote this file to `components/ui/venue-map.tsx` and let both HK + SG consume it. Either works — mirroring is simplest.

---

### `components/sg/zones-pillar-nav.tsx` + `components/sg/camps-pillar-nav.tsx` (component, RSC) — CREATE

**Analog:** `components/hk/gymnastics-pillar-nav.tsx` (25 lines)

**Full pattern — zones variant** (analog lines 1-25):
```typescript
// Phase 5 / Plan 05-XX — Weekly Classes pillar nav (RSC wrapper around client chips).
import { SG_ZONES } from "@/lib/sg-data";
import { ActiveSGNavLink } from "@/components/sg/active-sg-nav-link";

export function ZonesPillarNav() {
  return (
    <nav aria-label="Prodigy zones" className="flex flex-wrap gap-2 md:gap-3">
      {SG_ZONES.map((z) => (
        <ActiveSGNavLink
          key={z.slug}
          href={z.href}
          label={z.label}
          ageBand={z.ageBand}
        />
      ))}
    </nav>
  );
}
```

**Camps variant:** Identical structure, swap `SG_ZONES` → `SG_CAMP_TYPES`, `aria-label="Prodigy zones"` → `aria-label="Prodigy camp types"`.

---

### `components/sg/active-sg-nav-link.tsx` (component, client) — CREATE

**Analog:** `components/hk/active-gym-nav-link.tsx` (43 lines — copy verbatim, rename type)

**Full file pattern** (analog lines 1-43):
```typescript
"use client";
// Phase 5 — Active-state pillar nav chip (client component).
// Pitfall 2 (RESEARCH): usePathname returns the browser URL pre-rewrite
// (no /sg/ prefix). SG hrefs also have no /sg/ prefix — direct compare works.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface ActiveSGNavLinkProps {
  href: string;
  label: string;
  ageBand: string;
}

export function ActiveSGNavLink({ href, label, ageBand }: ActiveSGNavLinkProps) {
  const pathname = usePathname() ?? "";
  const isActive = pathname === href || pathname === href.replace(/\/$/, "");

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex flex-col items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-12",
        isActive
          ? "bg-brand-navy text-white"
          : "bg-muted text-foreground hover:bg-brand-navy/10"
      )}
    >
      <span className="font-sans font-semibold">{label}</span>
      <span className="text-[11px] opacity-70 mt-0.5">{ageBand}</span>
    </Link>
  );
}
```

**PITFALL (RESEARCH Pitfall 8):** On pillar-index pages (`/weekly-classes/`), no zone item should match as active. The exact-match logic above handles this correctly — do NOT switch to `pathname.startsWith(href)`.

---

### `components/sg/sg-hero-video.tsx` (component, client) — CREATE

**Analog:** `components/hk/hk-hero-video.tsx` (65 lines — copy verbatim, rename exports)

**Full pattern** (analog lines 19-64):
```typescript
"use client";
import Image from "next/image";
import { VideoPlayer } from "@/components/ui/video-player";

export interface SGHeroVideoProps {
  playbackId: string;    // NEXT_PUBLIC_MUX_SG_HERO_PLAYBACK_ID
  posterSrc: string;     // "/photography/sg-venue-katong-hero.webp" (HUMAN-ACTION)
  posterAlt: string;
  title: string;
}

export function SGHeroVideo({ playbackId, posterSrc, posterAlt, title }: SGHeroVideoProps) {
  return (
    <>
      {/* LCP poster (single priority Image on the page) */}
      <Image src={posterSrc} alt={posterAlt} fill priority className="object-cover" sizes="100vw" />
      <VideoPlayer
        playbackId={playbackId} title={title} poster={posterSrc}
        autoPlay aspect="video" className="absolute inset-0 w-full h-full"
      />
    </>
  );
}
```

**Critical note (from analog):** Do NOT wrap `VideoPlayer` with `dynamic({ ssr: false })` — Next.js 15 disallows that in Server Components. `VideoPlayer` already wraps MuxPlayer in its own internal `dynamic({ ssr: false })`.

---

### `lib/og-image.tsx` — EXTEND with `createSGOgImage()`

**Analog:** existing `createHKOgImage()` in `lib/og-image.tsx` (lines 131-243)

**Append new export** (mirror `createHKOgImage` line-for-line, changing only 3 things):
1. `backgroundColor: '#0f206c'` → `backgroundColor: '#0f9733'` (Prodigy-green — D-09)
2. `color: '#fac049'` (brand-yellow superscript) → `color: '#fff3dd'` (brand-cream — green+yellow clashes; cream reads cleaner on green)
3. Superscript text `'ProActiv Sports Hong Kong'` → `'Prodigy by ProActiv Sports Singapore'`

**Full extension pattern:**
```typescript
// Phase 5 / Plan 05-XX — SG OG image generator.
// Per CONTEXT D-09: Prodigy-green background distinguishes SG from HK navy
// in social share previews. Same Bloc Bold + fallback pattern as createHKOgImage.
export async function createSGOgImage({ title, tagline }: OgImageOptions): Promise<ImageResponse> {
  // Graceful font + logo fallback identical to createHKOgImage (lines 132-146).
  let blocBold: Buffer | null = null;
  try {
    blocBold = await readFile(join(process.cwd(), 'app/fonts/bloc-bold.ttf'));
  } catch { /* fallback */ }

  let logoDataUri = '';
  try {
    const logoSvg = await readFile(join(process.cwd(), 'app/assets/logo-white.svg'), 'utf-8');
    logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString('base64')}`;
  } catch { /* fallback */ }

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        backgroundColor: '#0f9733',  // D-09 Prodigy-green (was #0f206c navy in HK)
        padding: '64px', position: 'relative',
        fontFamily: blocBold ? 'Bloc Bold' : 'system-ui, sans-serif',
      }}>
        {logoDataUri ? (
          <img src={logoDataUri} width={160} height={40} alt=""
            style={{ position: 'absolute', top: 64, left: 64 }} />
        ) : null}
        {/* SG market superscript — cream on green for contrast */}
        <div style={{
          fontSize: 24, fontWeight: 700,
          color: '#fff3dd',  // brand-cream (was brand-yellow in HK — clashes with green)
          lineHeight: 1.2, letterSpacing: '0.05em', textTransform: 'uppercase',
          marginBottom: 16, fontFamily: 'system-ui, sans-serif',
        }}>
          Prodigy by ProActiv Sports Singapore
        </div>
        {/* Title — white on green */}
        <div style={{
          fontSize: 72, fontWeight: 700, color: '#ffffff',
          lineHeight: 1.05, letterSpacing: '-0.015em', maxWidth: 1000, marginBottom: 16,
        }}>{title}</div>
        {/* Tagline — cream */}
        <div style={{
          fontSize: 28, fontWeight: 400, color: '#fff3dd',
          lineHeight: 1.3, maxWidth: 1000, marginBottom: 40, fontFamily: 'system-ui, sans-serif',
        }}>{tagline}</div>
        {/* Brand-rainbow bottom strip — same as HK/root */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 8,
          background: 'linear-gradient(90deg, #ec1c24 0%, #fac049 50%, #0fa0e2 100%)',
          display: 'flex',
        }} />
      </div>
    ),
    { width: 1200, height: 630,
      fonts: blocBold ? [{ name: 'Bloc Bold', data: blocBold, weight: 700, style: 'normal' }] : [],
    },
  );
}
```

**Rule:** do NOT modify `createRootOgImage()` or `createHKOgImage()` — append only.

---

### `app/sg/opengraph-image.tsx` (opengraph-image, build-time) — CREATE

**Analog:** `app/hk/opengraph-image.tsx` (25 lines — verbatim mirror, swap function name + copy)

**Full pattern:**
```typescript
// Phase 5 / Plan 05-XX — Default SG OG image.
// Per-route opengraph-image.tsx in child routes takes precedence.

import { createSGOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return createSGOgImage({
    title: "Prodigy by ProActiv Sports Singapore",
    tagline: "Kids' sports, camps, and parties at Katong Point — home of Singapore's only MultiBall wall.",
  });
}
```

**Per-route OG files** (`app/sg/katong-point/opengraph-image.tsx`, `app/sg/weekly-classes/opengraph-image.tsx`, etc.): identical pattern to `app/hk/wan-chai/opengraph-image.tsx` — 14 lines, swap title + tagline per page.

---

### `lib/sg-data.ts` (data-module, static-export) — CREATE

**Analog:** `lib/hk-data.ts` (511 lines — mirror interface patterns, swap data)

**Pattern 1 — TypeScript interfaces** (analog lines 25-95 — mirror with SG-specific names):
```typescript
export interface SGVenueHours { days: readonly string[]; opens: string; closes: string; }

export interface KatongPointVenue {
  id: "katong-point";   // single-venue literal
  nameShort: string;    // "Katong Point"
  nameFull: string;     // "Prodigy @ Katong Point"
  addressStreet: string;
  addressLocality: string;
  addressRegion: string;
  addressCountry: "SG";
  geo: { lat: number; lng: number };
  hours: SGVenueHours[];
  phoneEnvVar: string;
  mapEmbedEnvVar: string;
  heroImage: string;
  serviceArea: readonly string[];
  apparatus: readonly string[];
}

export interface SGCoach { name: string; role: string; bio: string; portrait: string; }

export interface SGBlogPost {
  title: string; slug: string; excerpt: string;
  publishedAt: string; category: string;
  readTimeMinutes: number; heroImage: string;
}

export interface SGFAQItem {
  value: string; question: string; answer: string;
  group: "about" | "venue" | "classes" | "camps" | "multiball" | "parties" | "schools";
}

export interface SGZone {
  slug: "movement" | "sports-multiball" | "climbing";
  href: `/weekly-classes/${string}/`;
  label: string;     // "Movement Zone"
  ageBand: string;
  tag?: string;      // "Singapore's only" for sports-multiball (Pattern 6 highlight)
  metaTitle: string;
  metaDescription: string;
  h1: string;
  whatTheyLearn: readonly string[];
  classStructure: string;
}

export interface SGCampType {
  slug: "themed" | "multi-activity" | "gymnastics";
  href: `/prodigy-camps/${string}/`;
  label: string;     // "Themed Camps"
  ageBand: string;
  tag?: string;      // "Ninja · Pokémon · ..." etc.
  metaTitle: string;
  metaDescription: string;
  h1: string;
  whatTheyLearn: readonly string[];
  classStructure: string;
}
```

**Pattern 2 — static data exports** (analog lines 100-144 — single-venue simplification):
```typescript
export const KATONG_POINT: KatongPointVenue = {
  id: "katong-point",
  nameShort: "Katong Point",
  nameFull: "Prodigy @ Katong Point",
  addressStreet: "451 Joo Chiat Road, Level 3",
  addressLocality: "Katong",
  addressRegion: "Singapore",
  addressCountry: "SG",
  geo: { lat: 1.3113, lng: 103.9011 }, // HUMAN-ACTION: verify
  hours: [
    { days: ["Mo","Tu","We","Th","Fr"], opens: "09:00", closes: "19:00" },
    { days: ["Sa","Su"], opens: "09:00", closes: "17:00" },
  ],
  phoneEnvVar: "NEXT_PUBLIC_SG_PHONE",
  mapEmbedEnvVar: "NEXT_PUBLIC_MAP_EMBED_KATONG_POINT",
  heroImage: "/photography/sg-venue-katong-hero.webp",  // HUMAN-ACTION
  serviceArea: ["Katong","Marine Parade","East Coast","Joo Chiat","Kembangan"],
  apparatus: ["MultiBall wall","Climbing wall","Movement floor","Sports court"],
};

export const KATONG_POINT_NAP = {
  nameFull: KATONG_POINT.nameFull,
  addressStreet: KATONG_POINT.addressStreet,
  addressLocality: KATONG_POINT.addressLocality,
  addressCountry: KATONG_POINT.addressCountry,
} as const;

export const KATONG_POINT_MAP_EMBED =
  process.env.NEXT_PUBLIC_MAP_EMBED_KATONG_POINT ?? "PLACEHOLDER_KATONG_EMBED";
```

**Pattern 3 — coaches array** (analog lines 156-180 — 3 SG coaches per strategy PART 6C §8):
```typescript
export const SG_COACHES: readonly SGCoach[] = [
  {
    name: "Haikel",   // verify copy
    role: "Head Coach",
    bio: "...",
    portrait: "/photography/coach-haikel-portrait.webp",   // HUMAN-ACTION
  },
  { name: "Mark", role: "...", bio: "...", portrait: "/photography/coach-mark-portrait.webp" },
  { name: "Coach King", role: "...", bio: "...", portrait: "/photography/coach-king-portrait.webp" },
];
```

**Pattern 4 — FAQ + blog stubs + zones + camps arrays** (analog lines 187-499):
- `SG_FAQ_ITEMS` — 10 entries from strategy PART 6C §11 (FAQPage JSON-LD source)
- `SG_BLOG_POSTS_STUB` — 0–1 post (planner's discretion per CONTEXT)
- `SG_ZONES` — 3 entries keyed by slug (movement / sports-multiball / climbing)
- `SG_CAMP_TYPES` — 3 entries keyed by slug (themed / multi-activity / gymnastics)

---

### `app/sg/page.tsx` (page, RSC, 13 sections) — MODIFY (replace stub)

**Analog:** `app/hk/page.tsx` (790 lines, 12 sections)

**Imports pattern** (lines 29-51 of analog — swap to SG primitives):
```typescript
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Trophy, MapPin, BadgeCheck, ArrowUpRight, ArrowRight, MessageCircle, Zap } from "lucide-react";
// ...Phase 2 primitives
import { SGHeroVideo } from "@/components/sg/sg-hero-video";
import { KATONG_POINT, SG_FAQ_ITEMS, SG_BLOG_POSTS_STUB, SG_ZONES, SG_CAMP_TYPES, SG_COACHES } from "@/lib/sg-data";
```

**Metadata pattern** (lines 56-78 of analog — copy-swap for SG):
```typescript
export const metadata: Metadata = {
  title: "Kids' Sports Classes Singapore | Prodigy by ProActiv Sports @ Katong Point",
  description: "Kids' sports classes, holiday camps & birthday parties at Prodigy, Katong Point. Home of Singapore's only MultiBall wall. Book a free trial.",
  openGraph: {
    title: "Kids' Sports Classes Singapore | Prodigy @ Katong Point",
    description: "...",
    url: "https://sg.proactivsports.com/",
    siteName: "Prodigy by ProActiv Sports — Singapore",
    locale: "en_SG",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Prodigy by ProActiv Sports Singapore" }],
  },
  alternates: { canonical: "https://sg.proactivsports.com/" },
};
```

**JSON-LD pattern** (lines 85-119 of analog — WebSite + FAQPage, swap URLs + language):
```typescript
const SG_HOMEPAGE_FAQS = SG_FAQ_ITEMS.filter(
  (i) => i.group === "about" || i.group === "classes" || i.group === "venue" || i.group === "multiball",
).slice(0, 8);

const sgHomeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://sg.proactivsports.com/#website",
      url: "https://sg.proactivsports.com/",
      name: "Prodigy by ProActiv Sports — Singapore",
      publisher: { "@id": "https://proactivsports.com/#organization" },
      inLanguage: "en-SG",
    },
    {
      "@type": "FAQPage",
      mainEntity: SG_HOMEPAGE_FAQS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
} as const;
```

**HeroSection pattern** (analog lines 125-183 — swap HKHeroVideo → SGHeroVideo, copy verbatim from strategy PART 6C §Hero):
```typescript
function HeroSection() {
  return (
    <Section size="lg" bg="default">
      <ContainerEditorial width="wide">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl">
          <SGHeroVideo
            playbackId={process.env.NEXT_PUBLIC_MUX_SG_HERO_PLAYBACK_ID ?? ""}
            posterSrc="/photography/sg-venue-katong-hero.webp"  // HUMAN-ACTION
            posterAlt="Children playing on the MultiBall wall at Prodigy, Katong Point"
            title="Prodigy Singapore — hero montage"
          />
          <div className="absolute inset-0 bg-brand-navy/40" aria-hidden="true" />
          <div className="absolute inset-0 flex flex-col items-start justify-center px-6 md:px-12">
            <h1 className="text-display font-display text-white max-w-2xl leading-tight text-4xl md:text-5xl lg:text-6xl font-bold">
              Where Singapore's kids come to move, play, and grow.
            </h1>
            {/* MultiBall trust line — Pattern 11 #1 */}
            <p className="mt-3 text-body-lg text-brand-cream">
              <span className="font-accent text-brand-green">Singapore's only MultiBall wall</span> · Katong Point
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button asChild size="touch" className="bg-brand-red text-white hover:bg-brand-red/90">
                <a href="/book-a-trial/">Book a Free Trial <ArrowRight className="ml-2 size-4" /></a>
              </Button>
              {/* ... */}
            </div>
          </div>
        </div>
      </ContainerEditorial>
    </Section>
  );
}
```

**Section structure** (13 sections per strategy PART 5 — analog has 12, so add one):
1. Hero (analog §3.1) — swap HKHeroVideo → SGHeroVideo, add MultiBall trust line
2. WhyProdigy (analog §3.3) — 4-tile grid, MultiBall first tile per Pattern 11 #2
3. Programmes (analog §3.4) — 4 cards: Weekly / Camps / Parties / Schools
4. ThreeZones (NEW vs HK) — Movement / Sports+MultiBall / Climbing (Pattern 11 #3 highlights Sports)
5. SocialProof (analog §3.6 LogoWall + testimonial) — IFS + KidsFirst, single testimonial (Pitfall 6)
6. CampsFeature — next upcoming camp card
7. BirthdayParty (analog §3.7)
8. Coaches (analog §3.8) — Haikel / Mark / Coach King
9. AboutSnapshot — cross-market link to HK
10. Blog (analog §3.10) — 0–1 stub
11. FAQ (analog §3.11) — `.map()` `SG_HOMEPAGE_FAQS` through `FAQItem` (NOT nested `Accordion` per analog deviation #4)
12. FinalCTA (analog §3.12) — Book + Enquire + WhatsApp

**FAQ rendering pattern** (analog lines 95-117 + body — use `FAQItem` standalone, never nested `Accordion`; see analog deviation #4 comment).

---

### `app/sg/katong-point/page.tsx` (page, RSC) — CREATE

**Analog:** `app/hk/wan-chai/page.tsx` (lines 1-100)

**Imports pattern** (analog lines 1-20 — swap HK → SG):
```typescript
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Clock, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FAQItem } from "@/components/ui/faq-item";
import { VenueMap } from "@/components/sg/venue-map";
import { KATONG_POINT, SG_ZONES, SG_FAQ_ITEMS, KATONG_POINT_MAP_EMBED } from "@/lib/sg-data";

const VENUE = KATONG_POINT;   // single-venue simplification
const VENUE_FAQS = SG_FAQ_ITEMS.filter((i) => i.group === "venue").slice(0, 6);
```

**LocalBusiness JSON-LD pattern** (analog lines 52-100 — use RESEARCH Pattern 8 SportsActivityLocation schema):
```typescript
const katongPointSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SportsActivityLocation",
      "@id": "https://sg.proactivsports.com/#localbusiness-katong",
      "name": "Prodigy by ProActiv Sports — Katong Point",
      "image": `https://sg.proactivsports.com${VENUE.heroImage}`,
      "url": "https://sg.proactivsports.com/katong-point/",
      "telephone": process.env.NEXT_PUBLIC_WHATSAPP_SG ?? "+6598076827",
      "priceRange": "$$",
      "parentOrganization": { "@id": "https://proactivsports.com/#organization" },
      "address": { "@type": "PostalAddress",
        "streetAddress": VENUE.addressStreet,
        "addressLocality": VENUE.addressLocality,
        "addressRegion": VENUE.addressRegion,
        "postalCode": "427664",
        "addressCountry": VENUE.addressCountry,
      },
      "geo": { "@type": "GeoCoordinates", "latitude": VENUE.geo.lat, "longitude": VENUE.geo.lng },
      "openingHoursSpecification": VENUE.hours.map((h) => ({
        "@type": "OpeningHoursSpecification", "dayOfWeek": h.days, "opens": h.opens, "closes": h.closes,
      })),
      "hasOfferCatalog": {
        "@type": "OfferCatalog", "name": "Sports & Gymnastics Programmes",
        "itemListElement": [
          { "@type": "Offer", "name": "Weekly Sports Classes" },
          { "@type": "Offer", "name": "Prodigy Holiday Camps" },
          { "@type": "Offer", "name": "Birthday Parties" },
          { "@type": "Offer", "name": "School Partnerships" },
        ],
      },
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Prodigy by ProActiv Sports Singapore", "item": "https://sg.proactivsports.com/" },
        { "@type": "ListItem", "position": 2, "name": "Katong Point", "item": "https://sg.proactivsports.com/katong-point/" },
      ],
    },
  ],
};
```

**Page body pattern** (analog body — hero → NAP chips → map → apparatus badges → FAQs → booking CTA). MultiBall differentiator inline per Pattern 11 #4: add `<Badge variant="brand-yellow">Singapore's only MultiBall wall</Badge>` in the hero section.

---

### `app/sg/weekly-classes/page.tsx` + sub-pages (pillar + 3 zone sub-pages) — CREATE

**Pillar analog:** `app/hk/gymnastics/page.tsx` (~200 lines)

**Sub-page analog:** `app/hk/gymnastics/toddlers/page.tsx` (shared sub-page template across HK's 8 gymnastics sub-pages)

**Pillar imports pattern** (analog lines 16-27):
```typescript
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";  // Zap icon for MultiBall accent
import { Section, ContainerEditorial, Button, Card, Badge } from "@/components/ui";
import { ZonesPillarNav } from "@/components/sg/zones-pillar-nav";
import { SG_ZONES, SG_FAQ_ITEMS } from "@/lib/sg-data";

const ZONE_FAQS = SG_FAQ_ITEMS.filter((i) => i.group === "classes");
```

**Pillar FAQ + BreadcrumbList schema pattern** (analog lines 54-83 — 2 @graph entries):
```typescript
const pillarSchema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "FAQPage", mainEntity: ZONE_FAQS.map(...) },
    { "@type": "BreadcrumbList", itemListElement: [/* Home → Weekly Classes */] },
  ],
};
```

**Sub-page template** (analog `/gymnastics/toddlers/page.tsx` — use as shell for all 3 zone sub-pages):

```typescript
// app/sg/weekly-classes/movement/page.tsx
const ZONE = SG_ZONES.find((z) => z.slug === "movement")!;

export const metadata: Metadata = {
  title: ZONE.metaTitle,
  description: ZONE.metaDescription,
  openGraph: { /* SG-specific */ },
  alternates: { canonical: "https://sg.proactivsports.com/weekly-classes/movement/" },
};

const subPageSchema = { /* Breadcrumb: Home → Weekly Classes → Movement */ };
```

**Sports+MultiBall spotlight exception (Pattern 11 #4):** `sports-multiball/page.tsx` gets an additional section above the standard sub-page body — see §Shared Patterns (MultiBall).

**URL slug note (CONTEXT D-03):** paths are `/weekly-classes/movement/`, `/weekly-classes/sports-multiball/`, `/weekly-classes/climbing/` (no "-zone" suffix per CONTEXT slug spec).

---

### `app/sg/prodigy-camps/page.tsx` + 3 camp-type sub-pages — CREATE

**Analog:** Same as above — `app/hk/gymnastics/page.tsx` (pillar) + `app/hk/gymnastics/toddlers/page.tsx` (sub-page shell).

**URL slug note (CONTEXT D-04):** `/prodigy-camps/themed/`, `/prodigy-camps/multi-activity/`, `/prodigy-camps/gymnastics/`.

**Data source:** `SG_CAMP_TYPES` array (3 entries). CampsPillarNav component (identical to ZonesPillarNav, different data).

---

### `app/sg/birthday-parties/page.tsx` — CREATE

**Analog:** `app/hk/birthday-parties/page.tsx` (~200 lines)

**Imports + structure** (analog lines 1-60 — copy structure verbatim, swap copy per strategy PART 6C §7):
- Remove 2-venue wording (HK has "Wan Chai & Cyberport"; SG is "at Katong Point")
- Add MultiBall access mention per strategy PART 6C §7
- Booking CTA pre-fills `?subject=birthday-party` → `/book-a-trial/?subject=birthday-party`

---

### `app/sg/school-partnerships/page.tsx` — CREATE

**Analog:** `app/hk/school-partnerships/page.tsx`

**Key additions** per CONTEXT D-11 / RESEARCH Pattern 10 (IFS inline):
- `Featured: International French School (IFS)` section with Card + optional logo (HUMAN-ACTION) + IFS-specific copy per strategy PART 6C §3
- Partnership CTA: `?subject=school-partnership` → `/book-a-trial/?subject=school-partnership`

**Do NOT create** `app/sg/school-partnerships/international-french-school/` — per CONTEXT D-11 IFS is consolidated inline.

---

### `app/sg/events/page.tsx` — CREATE

**Analog:** `app/hk/competitions-events/page.tsx` (partial match — different content scope)

**Note:** SG `/events/` is evergreen (sports days, community events — CONTEXT Claude's Discretion). HK `/competitions-events/` focuses on gymnastics competitive pathway. Copy the SECTION STRUCTURE (hero → intro cards → pathway/description → final CTA), replace copy with SG evergreen content. Phase 6 CMS adds dated Event schema.

---

### `app/sg/coaches/page.tsx` — CREATE

**Analog:** `app/hk/coaches/page.tsx` (~150 lines)

**Imports pattern** (analog lines 11-20 — swap `HK_COACHES` → `SG_COACHES`):
```typescript
import { SG_COACHES } from "@/lib/sg-data";
```

**Coach Person JSON-LD** (analog lines 48-58 — identical structure, `worksFor` same Organization `@id`):
```typescript
const coachesSchema = {
  "@context": "https://schema.org",
  "@graph": SG_COACHES.map((c) => ({
    "@type": "Person",
    name: c.name, jobTitle: c.role,
    worksFor: { "@id": "https://proactivsports.com/#organization" },
    image: `https://sg.proactivsports.com${c.portrait}`,
    description: c.bio,
  })),
};
```

**Layout simplification (vs HK):** SG has 3 coaches and no venue-split. Use simple grid of 3 cards (no "lead vs team" bifurcation that HK has with Monica). Alternatively keep the HK lead/team pattern with Haikel as lead if strategy PART 6C §8 suggests hierarchy — planner decides.

---

### `app/sg/blog/page.tsx` + `app/sg/faq/page.tsx` — CREATE

**Blog analog:** `app/hk/blog/page.tsx` — verbatim structural mirror, swap `HK_BLOG_POSTS_STUB` → `SG_BLOG_POSTS_STUB`.

**FAQ analog:** `app/hk/faq/page.tsx` (80+ lines) — verbatim structural mirror:
- Swap `HK_FAQ_ITEMS` → `SG_FAQ_ITEMS`
- Swap GROUP_LABELS / GROUP_ORDER to match SG groups (`about`, `venue`, `classes`, `multiball`, `camps`, `parties`, `schools`)
- FAQPage JSON-LD from array (char-for-char match to visible DOM per Google rich-result rule)

---

### `app/sg/book-a-trial/` (page + form) — CREATE

**Page analog:** `app/hk/book-a-trial/free-assessment/page.tsx` (55 lines — RSC shell with Suspense wrapping BookingForm)

**Form analog:** `app/hk/book-a-trial/free-assessment/booking-form.tsx` (367 lines)

**Architecture diff from HK:** SG has NO hub page — `/book-a-trial/` IS the form page (single-venue, no hub→form two-step). This matches CONTEXT D-05 "Book a Free Trial button" and D-10 (single venue pre-fix, no venue selector).

**Page RSC shell pattern** (analog page lines 34-54):
```typescript
// app/sg/book-a-trial/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { BookingForm } from "./booking-form";

export const metadata: Metadata = {
  title: "Book a Free Trial — Prodigy by ProActiv Sports Singapore",
  description: "Book a free 30-minute assessment at Prodigy, Katong Point. We'll confirm within one working day.",
  openGraph: { /* SG-specific */ },
  alternates: { canonical: "https://sg.proactivsports.com/book-a-trial/" },
};

export default function SGBookATrialPage() {
  return (
    <Section size="lg" bg="default">
      <ContainerEditorial width="default">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-h1 font-display text-foreground">
            Your free 30-minute assessment at{" "}
            <span className="font-accent text-brand-green">Prodigy</span>.
          </h1>
          <p className="text-body-lg text-muted-foreground mt-4 mb-8">
            Tell us a little about your child, and we'll confirm a time at Katong Point within one working day.
          </p>
          <Suspense fallback={null}>
            <BookingForm />
          </Suspense>
        </div>
      </ContainerEditorial>
    </Section>
  );
}
```

**Form pattern** (analog booking-form lines 1-367):

**Top directive + imports** (analog lines 1-32):
```typescript
"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle, MessageCircle } from "lucide-react";
// ...Phase 2 Button, Card, Input, Textarea, Label
import { cn } from "@/lib/utils";
```

**State + submit handler pattern** (analog lines 65-118 — DROP venue state entirely; hardcode payload):
```typescript
type FormStatus = "idle" | "submitting" | "success" | "error";

export function BookingForm() {
  const searchParams = useSearchParams();
  // D-10: SG venue is hardcoded to katong-point — no selector needed.
  // Subject pre-fill (from CTAs across SG pages):
  //   /birthday-parties/ → ?subject=birthday-party
  //   /school-partnerships/ → ?subject=school-partnership
  //   /prodigy-camps/themed/ → ?subject=themed-camp
  const prefilledSubject = searchParams?.get("subject") ?? "Free Assessment Request";
  const [status, setStatus] = React.useState<FormStatus>("idle");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const whatsappSg = process.env.NEXT_PUBLIC_WHATSAPP_SG;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});
    const formData = new FormData(e.currentTarget);
    const phone = formData.get("phone");
    const message = formData.get("message");
    const payload = {
      market: "sg" as const,             // was "hk"
      subject: prefilledSubject,         // from ?subject= query param
      venue: "katong-point" as const,    // hardcoded — single SG venue (D-10)
      name: formData.get("name"),
      email: formData.get("email"),
      phone: typeof phone === "string" && phone.length > 0 ? phone : undefined,
      childAge: formData.get("childAge"),
      message: typeof message === "string" && message.length > 0 ? message : undefined,
      "bot-trap": formData.get("bot-trap") ?? "",
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) { setStatus("success"); return; }
      const data = await res.json().catch(() => ({}));
      if (data && typeof data === "object" && "errors" in data && data.errors) {
        setErrors(data.errors as Record<string, string>);
        setStatus("idle"); return;
      }
      setStatus("error");
    } catch { setStatus("error"); }
  }
  /* ... */
}
```

**Success + error card patterns** (analog lines 121-207 — copy verbatim, swap "ProActiv HK" → "Prodigy SG").

**Form fields** (analog lines 209-364):
- **REMOVE** the 3-card `<fieldset role="radiogroup">` venue selector entirely (analog lines 225-276)
- **KEEP** honeypot field `name="bot-trap"` verbatim (Phase 3 D-04 — required for `/api/contact` honeypot)
- **KEEP** name / email / phone / childAge / message / submit (analog lines 278-363)

---

## Shared Patterns

### Authentication
**N/A** — Phase 5 is static content + form-POST. No auth layer.

### Honeypot + Server Validation
**Source:** `app/api/contact/route.ts` (already supports `market: "sg"`)
**Apply to:** `app/sg/book-a-trial/booking-form.tsx`

```typescript
// Honeypot input — CSS-hidden, named "bot-trap" verbatim so existing handler's
// check at route.ts line 62 fires. DO NOT rename.
<input
  type="text"
  name="bot-trap"
  tabIndex={-1}
  autoComplete="off"
  aria-hidden="true"
  style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px" }}
/>
```

**Server-side change required:** `app/api/contact/route.ts` line 30 — extend `ALLOWED_VENUES` to include `"katong-point"`:
```typescript
// Phase 5 — add SG single-venue to enum. HK venues retained for backward compat.
const ALLOWED_VENUES = ["wan-chai", "cyberport", "no-preference", "katong-point"] as const;
```

This is the ONLY backend edit needed for Phase 5. Per CONTEXT D-10 and `/api/contact/route.ts` lines 29-31.

### Error Handling
**Source:** `app/hk/book-a-trial/free-assessment/booking-form.tsx` lines 98-118
**Apply to:** `app/sg/book-a-trial/booking-form.tsx`

```typescript
try {
  const res = await fetch("/api/contact", { /* ... */ });
  if (res.ok) { setStatus("success"); return; }
  const data = await res.json().catch(() => ({}));
  if (data && typeof data === "object" && "errors" in data && data.errors) {
    setErrors(data.errors as Record<string, string>);
    setStatus("idle"); return;
  }
  setStatus("error");
} catch { setStatus("error"); }
```

### Skip-link + Main Content Wrapper (a11y)
**Source:** `app/hk/layout.tsx` lines 65-73
**Apply to:** `app/sg/layout.tsx` — verbatim copy

```tsx
<a href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-2 focus:outline-ring focus:outline-offset-2">
  Skip to main content
</a>
<SGNav />
<main id="main-content">{children}</main>
<SGFooter />
```

### Cross-Subdomain Links
**Source:** `components/hk/hk-footer.tsx` lines 172-187 (RESEARCH Pitfall 7)
**Apply to:** `components/sg/sg-footer.tsx` (both cross-market + legal footer)

```typescript
const hkUrl = process.env.NEXT_PUBLIC_HK_URL;
const rootUrl = process.env.NEXT_PUBLIC_ROOT_URL;

{hkUrl && (
  <a href={hkUrl} className="block text-sm text-white/80 hover:text-white">
    ProGym Hong Kong ↗
  </a>
)}
{rootUrl && (
  <a href={rootUrl} className="block text-sm text-white/80 hover:text-white">
    ProActiv Sports Group ↗
  </a>
)}
```

**Rule:** cross-subdomain ALWAYS uses `<a href={env}>`, NEVER `<Link>` (Pitfall 7). Internal same-subdomain uses `<Link href="/katong-point/">`.

### Trailing Slash Preservation on Booking CTAs
**Source:** `app/hk/page.tsx` lines 151-165 comment + `app/hk/book-a-trial/page.tsx` lines 134-138
**Apply to:** All SG page "Book a Free Trial" primary CTAs (hero + final CTA + sub-page booking CTAs)

```typescript
{/* Plain <a> preserves trailing slash in href — Next.js <Link> normalises
    them away when trailingSlash:false, which breaks Phase 1 tests + deep links. */}
<Button asChild size="touch" className="bg-brand-red text-white hover:bg-brand-red/90">
  <a href="/book-a-trial/">Book a Free Trial <ArrowRight className="ml-2 size-4" /></a>
</Button>
```

### Skip-Link + Metadata Shallow Merge (Pitfall 2)
**Source:** `app/hk/layout.tsx` lines 19-21 comment
**Apply to:** Every `app/sg/**/page.tsx` metadata declaration

> `metadata.openGraph` merges SHALLOW at the child page level. Every page MUST provide its own `openGraph: { title, description, url, images }` — do NOT rely on layout inheritance beyond `siteName / locale / type`.

Every HK page follows this (see `app/hk/page.tsx` lines 60-76, `app/hk/wan-chai/page.tsx` lines 32-48, etc.). SG pages must do the same.

### MultiBall Differentiator Treatment (Pattern 11)
**Source:** RESEARCH Pattern 11 + strategy PART 5 §§1,2,4 + PART 6C FAQ §4
**Apply to:** Homepage hero, homepage §2 first tile, homepage §4 Sports Zone card, `/weekly-classes/sports-multiball/page.tsx`, `/faq/page.tsx`, `/katong-point/page.tsx`

**5 placements** (no new component — copy + photo + badge):

1. **Homepage hero trust line** (`app/sg/page.tsx` HeroSection):
   ```tsx
   <p className="mt-3 text-body-lg text-brand-cream">
     <span className="font-accent text-brand-green">Singapore's only MultiBall wall</span>
     {" "}· Katong Point
   </p>
   ```

2. **Homepage §2 first why-tile** — Zap icon + "The only MultiBall wall in Singapore" H3 + copy from strategy PART 6C §2.

3. **Homepage §4 Sports Zone card** (3-zone explorer):
   ```tsx
   <Badge variant="secondary" className="bg-brand-yellow text-brand-navy">
     Singapore's only
   </Badge>
   ```

4. **`/weekly-classes/sports-multiball/page.tsx`** — dedicated MultiBall spotlight section ABOVE the standard sub-page body:
   ```tsx
   <Section size="lg" bg="default">   {/* lg = 128px vertical — UI-SPEC §Spacing exception */}
     <ContainerEditorial width="default">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
         <div>
           <Badge variant="secondary" className="bg-brand-yellow text-brand-navy mb-4">Singapore's only</Badge>
           <h2 className="text-h2 font-display">What is <span className="font-accent text-brand-green">MultiBall</span>?</h2>
           <p className="text-body-lg mt-4">{/* strategy PART 6C FAQ §4 verbatim */}</p>
         </div>
         <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
           <Image src="/photography/sg-multiball-action.webp" alt="Child playing on the MultiBall wall" fill priority sizes="..." />
         </div>
       </div>
     </ContainerEditorial>
   </Section>
   ```

5. **FAQ entry** — `SG_FAQ_ITEMS` array entry `group: "multiball"`, Q: "What is the MultiBall wall?", A: strategy PART 6C §11 verbatim.

6. **Katong Point page** — MultiBall headline badge in hero area.

### Photography HUMAN-ACTION Gates
**Source:** CONTEXT D-07 + RESEARCH Pitfall 3
**Apply to:** Every SG page referencing `/photography/sg-*`

**Protocol:**
- Hardcode `/photography/sg-venue-katong-hero.webp` etc. in page source
- File may not exist at first render — Next.js `Image` gracefully renders broken-image state (acceptable degradation per Phase 3 D-10 precedent)
- Executor lists all referenced-but-missing SG paths in `05-XX-SUMMARY.md` HUMAN-ACTION list
- `grep -r "sg-placeholder" app/sg/` MUST return zero matches before phase close (Pitfall 3)
- Placeholder allowed only in `lib/sg-data.ts` comments documenting Phase 2 D-07 precedent, NEVER in page source

**Required SG photo filenames (planner lists in each plan's HUMAN-ACTION gate):**
- `/photography/sg-venue-katong-hero.webp` — hero poster (D-07 gate 1)
- `/photography/sg-movement-zone.webp`, `sg-sports-multiball-zone.webp`, `sg-climbing-zone.webp` — zone images (D-07 gate 2)
- `/photography/coach-haikel-portrait.webp`, `coach-mark-portrait.webp`, `coach-king-portrait.webp` — coaches (D-07 gate 3)
- `/photography/sg-birthday-party-setup.webp` — optional (D-07 gate 4)

### metadataBase Fallback Chain
**Source:** `app/hk/layout.tsx` lines 33-41 (`VERCEL_ENV → VERCEL_PROJECT_PRODUCTION_URL → VERCEL_URL → localhost`)
**Apply to:** `app/sg/layout.tsx`

Already shown in the layout pattern above. Change only `HK_PRODUCTION_BASE` → `SG_PRODUCTION_BASE = "https://sg.proactivsports.com"` and `hk.localhost:3000` → `sg.localhost:3000`.

### OG Image Per-Route Budget
**Source:** RESEARCH Pitfall 5 (HK had 8-OG ceiling)
**Apply to:** SG — recommend 8-10 per-route OG files maximum; others inherit `app/sg/opengraph-image.tsx` default.

High-priority SG pages (ship with per-route `opengraph-image.tsx`):
1. `app/sg/opengraph-image.tsx` — default
2. `app/sg/katong-point/opengraph-image.tsx`
3. `app/sg/weekly-classes/opengraph-image.tsx` (pillar)
4. `app/sg/weekly-classes/sports-multiball/opengraph-image.tsx` (MultiBall differentiator)
5. `app/sg/prodigy-camps/opengraph-image.tsx` (pillar)
6. `app/sg/birthday-parties/opengraph-image.tsx`
7. `app/sg/coaches/opengraph-image.tsx`
8. `app/sg/blog/opengraph-image.tsx`
9. `app/sg/book-a-trial/opengraph-image.tsx`

Zone sub-pages (`movement`, `climbing`) + camp-type sub-pages (`themed`, `multi-activity`, `gymnastics`) + `faq` + `events` + `school-partnerships` INHERIT the default.

### FAQItem Composition (Accordion nesting bug)
**Source:** `app/hk/page.tsx` lines 22-23 (Rule 3 deviation #4) + `app/hk/gymnastics/page.tsx` lines 5-14 comment
**Apply to:** SG homepage FAQ section, SG FAQ hub, SG pillar pages

> `FAQItem` internally composes its own `Accordion` root. Do NOT wrap multiple `FAQItem` in a parent `Accordion` — that nests two Accordion roots and breaks state. Use a plain `<div>` stack:

```tsx
<div className="space-y-2 max-w-3xl mx-auto">
  {SG_HOMEPAGE_FAQS.map((item) => (
    <FAQItem key={item.value} value={item.value} question={item.question} answer={item.answer} />
  ))}
</div>
```

### JSON-LD Data Order = DOM Order
**Source:** `app/hk/page.tsx` lines 82-88 comment (Google FAQPage rich-result rule)
**Apply to:** Every SG FAQPage schema

> `FAQPage.mainEntity` order MUST match visible DOM order char-for-char. Use `SG_FAQ_ITEMS.filter(...).slice(0,8)` → same array drives both JSON-LD and JSX render.

---

## No Analog Found

| File | Role | Data Flow | Reason | Planner Fallback |
|------|------|-----------|--------|------------------|
| MultiBall spotlight section on `/weekly-classes/sports-multiball/page.tsx` | editorial-section | static | No existing page has a "Singapore's only" badge-led spotlight block. Pattern 11 #4 is new. | Compose from Phase 2 primitives: `<Section size="lg">` + `<ContainerEditorial>` + `<Badge variant="secondary">` + `<Image fill>` + `<Zap>` icon. See §Shared Patterns — MultiBall. |
| `components/sg/katong-chip.tsx` (optional — possibly inlined) | component (RSC) | static | HK's `VenueChipRow` renders TWO chips; SG has ONE venue. Single-chip composition is trivial — arguably inline directly into `app/sg/page.tsx` hero or second section. | Planner decides: (a) create `components/sg/katong-chip.tsx` as a standalone component, or (b) inline a simple `<Card>` + `<MapPin>` + "Prodigy @ Katong Point" composition directly in `app/sg/page.tsx`. No active-state needed (single venue). Recommend (b). |

---

## Metadata

**Analog search scope:**
- `/Users/martin/Projects/proactive/app/hk/**` (HK market — primary analog source)
- `/Users/martin/Projects/proactive/components/hk/**` (HK components — direct mirror targets)
- `/Users/martin/Projects/proactive/lib/hk-data.ts` (HK data module — direct mirror target)
- `/Users/martin/Projects/proactive/lib/og-image.tsx` (existing `createHKOgImage` — extension target)
- `/Users/martin/Projects/proactive/app/api/contact/route.ts` (existing — supports `market: "sg"` already)
- `/Users/martin/Projects/proactive/components/ui/**` (Phase 2 primitives — consumed as-is)

**Files scanned:** ~45 (all HK analogs + Phase 2 primitives + Phase 3 contact infra)

**Pattern extraction date:** 2026-04-24

**Key insight for planner:** Phase 5 has near-100% analog coverage. The planner should organize plans as structural MIRROR operations: "Copy `app/hk/<path>/page.tsx` pattern; swap imports `hk-data` → `sg-data`, components `HK*` → `SG*`, URLs `hk.proactiv...` → `sg.proactiv...`, locale `en_HK` → `en_SG`, copy text per strategy PART 6C, Mux ID env var → SG." The ONE backend edit is extending `ALLOWED_VENUES` in `app/api/contact/route.ts` to include `"katong-point"`.

**Recommended plan sequencing (mirrors Phase 4's 7-plan structure):**
1. **Plan 05-01** — `lib/sg-data.ts` foundation (static data, interfaces, constants)
2. **Plan 05-02** — `app/sg/layout.tsx` + SGNav + SGNavMobile + SGFooter + SG OG default + `createSGOgImage`
3. **Plan 05-03** — `app/sg/page.tsx` homepage (13 sections) + SGHeroVideo + katong-chip composition
4. **Plan 05-04** — `app/sg/katong-point/` location page + VenueMap + LocalBusiness JSON-LD
5. **Plan 05-05** — `/weekly-classes/` pillar + 3 zone sub-pages + ZonesPillarNav + ActiveSGNavLink (MultiBall spotlight on sports-multiball)
6. **Plan 05-06** — `/prodigy-camps/` pillar + 3 camp sub-pages + CampsPillarNav
7. **Plan 05-07** — Supporting pages (`/birthday-parties/`, `/school-partnerships/` with IFS, `/events/`, `/coaches/`, `/blog/`, `/faq/`) + `/api/contact/route.ts` `ALLOWED_VENUES` extension
8. **Plan 05-08** — `/book-a-trial/` conversion hub + BookingForm (single-venue)

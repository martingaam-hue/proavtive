# Phase 4: Hong Kong Market — Pattern Map

**Mapped:** 2026-04-24
**Files analyzed:** 32 new/modified files
**Analogs found:** 30 / 32

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `app/hk/layout.tsx` | layout | request-response | `app/root/layout.tsx` | exact |
| `app/hk/page.tsx` | page (RSC) | request-response | `app/root/page.tsx` | exact |
| `app/hk/opengraph-image.tsx` | og-image | transform | `app/root/opengraph-image.tsx` | exact |
| `app/hk/wan-chai/page.tsx` | page (RSC) | request-response | `app/root/brand/page.tsx` | role-match |
| `app/hk/wan-chai/opengraph-image.tsx` | og-image | transform | `app/root/brand/opengraph-image.tsx` | exact |
| `app/hk/cyberport/page.tsx` | page (RSC) | request-response | `app/root/brand/page.tsx` | role-match |
| `app/hk/cyberport/opengraph-image.tsx` | og-image | transform | `app/root/brand/opengraph-image.tsx` | exact |
| `app/hk/gymnastics/page.tsx` | page (RSC) | request-response | `app/root/brand/page.tsx` | role-match |
| `app/hk/gymnastics/opengraph-image.tsx` | og-image | transform | `app/root/brand/opengraph-image.tsx` | exact |
| `app/hk/gymnastics/[level]/page.tsx` ×8 | page (RSC) | request-response | `app/root/careers/page.tsx` | role-match |
| `app/hk/holiday-camps/page.tsx` | page (RSC) | request-response | `app/root/news/page.tsx` | role-match |
| `app/hk/holiday-camps/opengraph-image.tsx` | og-image | transform | `app/root/brand/opengraph-image.tsx` | exact |
| `app/hk/birthday-parties/page.tsx` | page (RSC) | request-response | `app/root/news/page.tsx` | role-match |
| `app/hk/birthday-parties/opengraph-image.tsx` | og-image | transform | `app/root/brand/opengraph-image.tsx` | exact |
| `app/hk/school-partnerships/page.tsx` | page (RSC) | request-response | `app/root/brand/page.tsx` | role-match |
| `app/hk/competitions-events/page.tsx` | page (RSC) | request-response | `app/root/news/page.tsx` | role-match |
| `app/hk/coaches/page.tsx` | page (RSC) | request-response | `app/root/brand/page.tsx` | role-match |
| `app/hk/blog/page.tsx` | page (RSC) | request-response | `app/root/news/page.tsx` | exact |
| `app/hk/faq/page.tsx` | page (RSC) | request-response | `app/root/page.tsx` (FAQ section) | role-match |
| `app/hk/book-a-trial/page.tsx` | page (RSC) | request-response | `app/root/contact/page.tsx` | role-match |
| `app/hk/book-a-trial/free-assessment/page.tsx` | page (RSC) | request-response | `app/root/contact/page.tsx` | exact |
| `app/hk/book-a-trial/free-assessment/booking-form.tsx` | component (client) | request-response | `app/root/contact/contact-form.tsx` | exact |
| `components/hk/hk-nav.tsx` | component (RSC) | request-response | `components/root/root-nav.tsx` | exact |
| `components/hk/hk-nav-mobile.tsx` | component (client) | event-driven | `components/root/root-nav-mobile.tsx` | exact |
| `components/hk/hk-footer.tsx` | component (RSC) | request-response | `components/root/root-footer.tsx` | exact |
| `components/hk/venue-map.tsx` | component (RSC) | request-response | — | no analog |
| `components/hk/gymnastics-pillar-nav.tsx` | component (RSC) | request-response | `components/root/root-nav.tsx` (nav list) | partial |
| `components/hk/active-gym-nav-link.tsx` | component (client) | event-driven | `components/root/root-nav-mobile.tsx` | partial |
| `lib/hk-data.ts` | utility | transform | `app/root/page.tsx` (inline constants) | partial |
| `lib/og-image.tsx` (extend) | utility | transform | `lib/og-image.tsx` | exact |
| `app/hk/page.test.tsx` | test | — | `app/root/page.test.tsx` | exact |
| `app/hk/book-a-trial/booking-form.test.tsx` | test | — | `app/root/contact/contact-form.test.tsx` | exact |

---

## Pattern Assignments

### `app/hk/layout.tsx` (layout, request-response)

**Analog:** `app/root/layout.tsx`

**Imports pattern** (lines 1–3):
```typescript
import type { Metadata } from "next";
import { RootNav } from "@/components/root/root-nav";
import { RootFooter } from "@/components/root/root-footer";
```
Copy but swap to `HKNav` / `HKFooter` from `@/components/hk/hk-nav` and `@/components/hk/hk-footer`.

**Baloo font activation** — `app/layout.tsx` lines 13, 19 show the font variable pattern:
```typescript
// app/layout.tsx lines 12-19
import { unbounded, manrope } from "./fonts";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${unbounded.variable} ${manrope.variable} h-full antialiased`}>
```
HK layout must additionally import `baloo` from `@/app/fonts` and add `${baloo.variable}` to the wrapping element per Phase 2 D-03 (Baloo scoped to HK ProGym layouts). The HK layout provides the `<html>` wrapper via the HK-subtree wrapping element's className.

**metadataBase pattern** (analog `app/root/layout.tsx` lines 14–33):
```typescript
// app/root/layout.tsx lines 14-33
const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "ProActiv Sports | Children's Gymnastics...",
    template: "%s | ProActiv Sports",
  },
  ...
  openGraph: { siteName: "ProActiv Sports", locale: "en_GB", type: "website" },
};
```
For HK, `metadataBase` must resolve to `hk.proactivsports.com` — the RESEARCH Pattern 1 provides the exact HK-specific env-var derivation string (lines 235–238 of RESEARCH.md).

**Layout body pattern** (analog `app/root/layout.tsx` lines 35–51):
```typescript
export default function RootGroupLayout({ children }) {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only ...">Skip to main content</a>
      <RootNav />
      <main id="main-content">{children}</main>
      <RootFooter />
    </>
  );
}
```

---

### `app/hk/page.tsx` (page RSC, request-response)

**Analog:** `app/root/page.tsx`

**Imports pattern** (lines 1–26):
```typescript
import type { Metadata } from "next";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Trophy, Activity, ... } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { StatStrip } from "@/components/ui/stat-strip";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { FAQItem } from "@/components/ui/faq-item";
import { ProgrammeTile } from "@/components/ui/programme-tile";
import { VideoPlayer } from "@/components/ui/video-player";
```
Plus HK-specific:
```typescript
import { HK_FAQ_ITEMS, HK_COACHES_STUB, HK_BLOG_POSTS_STUB } from "@/lib/hk-data";
```

**metadata pattern** (analog `app/root/page.tsx` lines 223–247) — full openGraph object, no shallow-merge:
```typescript
export const metadata: Metadata = {
  title: "Kids Gymnastics Hong Kong | ProGym Wan Chai & Cyberport",
  description: "...",
  openGraph: {
    title: "...",
    description: "...",
    url: "https://hk.proactivsports.com/",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "..." }],
    siteName: "ProActiv Sports Hong Kong",
    locale: "en_HK",
    type: "website",
  },
  alternates: { canonical: "https://hk.proactivsports.com/" },
};
```

**JSON-LD inline pattern** (analog `app/root/page.tsx` lines 175–217, 491–496):
```typescript
const schema = { "@context": "https://schema.org", "@graph": [...] };
// ...
export default async function HKHomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <HeroSection />
      ...
    </>
  );
}
```

**Hero section with VideoPlayer** — copy dynamic import pattern from RESEARCH.md Pattern 2 (lines 283–316):
```typescript
const VideoPlayer = dynamic(() => import("@/components/ui/video-player"), {
  ssr: false,
  loading: () => (
    <Image src="/photography/hk-venue-wanchai-gymtots.webp" alt="..." fill priority className="object-cover" sizes="100vw" />
  ),
});
```

**Private section component pattern** (analog `app/root/page.tsx` lines 255–483) — all 12 sections as private functions in the file, page default exports a fragment returning them in order.

**Cross-subdomain link pattern** (analog `app/root/page.tsx` lines 31–32, 271–277):
```typescript
const HK_URL = process.env.NEXT_PUBLIC_HK_URL ?? "/?__market=hk";
// Same-host (HK→HK): use <Link href="/book-a-trial/">
// Cross-market (HK→SG or HK→Root): use <a href={process.env.NEXT_PUBLIC_SG_URL}>
```

---

### `app/hk/wan-chai/page.tsx` and `app/hk/cyberport/page.tsx` (page RSC, request-response)

**Analog:** `app/root/brand/page.tsx`

**Metadata pattern** (analog `app/root/brand/page.tsx` lines 31–46) — static `export const metadata`, full openGraph:
```typescript
export const metadata: Metadata = {
  title: "ProGym Wan Chai — Children's Gymnastics Wan Chai, Hong Kong",
  description: "...",
  openGraph: {
    title: "...",
    description: "...",
    url: "https://hk.proactivsports.com/wan-chai/",
    images: [{ url: "/wan-chai/opengraph-image", width: 1200, height: 630, alt: "..." }],
    siteName: "ProActiv Sports Hong Kong",
    locale: "en_HK",
    type: "website",
  },
  alternates: { canonical: "https://hk.proactivsports.com/wan-chai/" },
};
```

**JSON-LD LocalBusiness** — see RESEARCH.md Pattern 7 (lines 565–613) for the complete `SportsActivityLocation` + `BreadcrumbList` `@graph` shape. Rendered inline as per `app/root/page.tsx` inline script pattern.

**VenueMap usage** — HUMAN-ACTION gate: pass `embedSrc` from `lib/hk-data.ts` constant (which starts as `"PLACEHOLDER_WAN_CHAI_EMBED"`). The `VenueMap` component renders a placeholder div when the src contains `"PLACEHOLDER"`.

**Image (priority)** — first `<Image>` on each location page gets `priority`. All subsequent images lazy-load (analog `app/root/page.tsx` Pitfall 6).

---

### `app/hk/gymnastics/page.tsx` (page RSC, request-response)

**Analog:** `app/root/brand/page.tsx`

Same RSC page pattern. Renders `GymPillarNav` component + pillar overview content. Sub-pages are linked from pillar nav.

**Programme data pattern** — copy the inline constant array pattern from `app/root/page.tsx` (lines 121–155):
```typescript
const GYMNASTICS_PROGRAMMES = [
  { href: "/gymnastics/toddlers/", label: "Babies & Toddlers", age: "12mo–3yr" },
  ...
] as const;
```

---

### `app/hk/gymnastics/[toddlers|beginner|...]/page.tsx` ×8 (page RSC, request-response)

**Analog:** `app/root/careers/page.tsx`

**Structure pattern** (analog `app/root/careers/page.tsx` lines 51–128) — hero section + content section + bullet list + CTA section, all using `<Section>` + `<ContainerEditorial>`:
```typescript
export default function ToddlersGymPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(subPageSchema) }} />
      <Section size="md">
        <ContainerEditorial width="default">
          <GymPillarNav />  {/* RSC wrapper */}
          ...
        </ContainerEditorial>
      </Section>
      {/* programme content sections */}
      <Section size="sm" bg="cream">
        <ContainerEditorial width="default">
          <Button asChild size="touch" variant="default">
            <Link href="/book-a-trial/free-assessment/?childAge=...">Book a Free Trial</Link>
          </Button>
        </ContainerEditorial>
      </Section>
    </>
  );
}
```

**Metadata** — static `export const metadata` per sub-page, title from RESEARCH.md section "Gymnastics Sub-Page Template" (metadata per sub-page). Each has its own canonical and OG url pointing to its sub-page URL.

---

### `app/hk/coaches/page.tsx` (page RSC, request-response)

**Analog:** `app/root/brand/page.tsx` (LeadershipSection usage)

**Coach data shape** (compatible with Phase 6 Sanity `coach` schema — `lib/hk-data.ts`):
```typescript
// From RESEARCH.md Pattern 5 + CONTEXT.md D-07
interface CoachStub {
  name: string;
  role: string;
  bio: string;
  venueTag?: string;  // "wan-chai" | "cyberport" | undefined
  portrait: string;  // path under public/photography/
}
```

**Portrait HUMAN-ACTION gate** — mirrors Phase 3 D-10 pattern. If portrait path does not exist in `public/photography/`, execution pauses. No silhouettes, no initials (CONTEXT.md D-09).

**Coach card pattern** — copy `components/root/leadership-card.tsx` structure (lines 23–54). HK coach cards live in `components/hk/` per D-06/D-11.

---

### `app/hk/blog/page.tsx` (page RSC, request-response)

**Analog:** `app/root/news/page.tsx` (exact match — static stub array + empty-state pattern)

**Imports pattern** (analog `app/root/news/page.tsx` lines 1–10):
```typescript
import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Card } from "@/components/ui/card";
```

**Stub + empty-state pattern** (analog `app/root/news/page.tsx` lines 19–86):
```typescript
// Phase 6: replace with `await sanityClient.fetch(GROQ_BLOG_QUERY)`.
const blogPosts: BlogPostStub[] = HK_BLOG_POSTS_STUB; // from lib/hk-data.ts

export default function HKBlogPage() {
  return (
    <>
      <Section size="md">...</Section>
      <Section size="md" bg="muted">
        {blogPosts.length === 0 ? (
          <Card>... coming soon ...</Card>
        ) : (
          <ul>{blogPosts.map(post => <li key={post.slug}><Card>...</Card></li>)}</ul>
        )}
      </Section>
    </>
  );
}
```

---

### `app/hk/faq/page.tsx` (page RSC, request-response)

**Analog:** `app/root/page.tsx` (FAQSection + JSON-LD FAQPage)

**FAQ data + FAQItem pattern** (analog `app/root/page.tsx` lines 38–75, 431–453):
```typescript
const HK_FAQ_ITEMS = [...] as const; // from lib/hk-data.ts

function FAQSection() {
  return (
    <Section size="md" bg="default">
      <ContainerEditorial width="default">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-h2 font-display text-foreground mb-8">Frequently asked questions</h2>
          <div className="flex flex-col gap-0">
            {HK_FAQ_ITEMS.map((item) => (
              <FAQItem key={item.value} id={item.value} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </ContainerEditorial>
    </Section>
  );
}
```

**FAQPage JSON-LD pattern** (analog `app/root/page.tsx` lines 203–217):
```typescript
const schema = {
  "@context": "https://schema.org",
  "@graph": [{
    "@type": "FAQPage",
    mainEntity: HK_FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }],
};
```

---

### `app/hk/book-a-trial/free-assessment/booking-form.tsx` (component client, request-response)

**Analog:** `app/root/contact/contact-form.tsx` (exact match)

**Full client form pattern** (analog `app/root/contact/contact-form.tsx`):

Imports (lines 1–17):
```typescript
"use client";
import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
```

State management (lines 32–34):
```typescript
const [status, setStatus] = React.useState<FormStatus>("idle");
const [errors, setErrors] = React.useState<Record<string, string>>({});
```

Submit handler (lines 36–64):
```typescript
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setStatus("submitting");
  setErrors({});
  const formData = new FormData(e.currentTarget);
  const payload = Object.fromEntries(formData.entries());
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) { setStatus("success"); return; }
    const data = await res.json().catch(() => ({}));
    if (data.errors) { setErrors(data.errors); setStatus("idle"); return; }
    setStatus("error");
  } catch { setStatus("error"); }
}
```

Honeypot (lines 211–218):
```typescript
<input
  type="text"
  name="bot-trap"
  tabIndex={-1}
  autoComplete="off"
  aria-hidden="true"
  style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px" }}
/>
```

**Booking-form additions vs contact-form:**
- Replace market selector (hk/sg radio) with venue selector (wan-chai/cyberport/no-preference)
- Pre-fill venue from `useSearchParams().get("venue") ?? "no-preference"`
- Add `childAge` field
- Pass `market: "hk"` and `subject: "Free Assessment Request"` as hidden fields
- Venue selector uses same 3-card radio pattern as market selector

---

### `components/hk/hk-nav.tsx` (component RSC, request-response)

**Analog:** `components/root/root-nav.tsx` (exact match)

**Full RSC nav pattern** (analog `components/root/root-nav.tsx`):

Imports (lines 1–11):
```typescript
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { HKNavMobile } from "@/components/hk/hk-nav-mobile";
```

Nav links constant (lines 12–18):
```typescript
const NAV_LINKS = [
  { href: "/gymnastics/", label: "Gymnastics" },
  { href: "/holiday-camps/", label: "Camps" },
  ...
] as const;
```

Sticky header shell (lines 20–58):
```typescript
export function HKNav() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <ContainerEditorial width="wide" className="flex items-center justify-between h-16 lg:h-20">
        <Link href="/" aria-label="ProActiv Sports Hong Kong — home">
          <img src="/assets/logo.svg" alt="" className="h-8 lg:h-10" />
        </Link>
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-6">
          {/* nav links + Gymnastics dropdown + Locations dropdown + CTA button */}
        </nav>
        <HKNavMobile navLinks={NAV_LINKS} />
      </ContainerEditorial>
    </header>
  );
}
```

**Key difference from RootNav:** "Book a Free Trial" is a filled CTA Button (not ghost) using `<Link href="/book-a-trial/free-assessment/">` (same-host, NOT `<a href>`). Cross-market links (to SG or root) use `<a href={process.env.NEXT_PUBLIC_SG_URL}>` pattern.

**Gymnastics + Locations dropdowns** — use shadcn `NavigationMenu` (already installed, Radix-based). Pattern is documented in RESEARCH.md Pattern 8 (lines 619–644). No analog in codebase — first use of `NavigationMenu` component.

---

### `components/hk/hk-nav-mobile.tsx` (component client, event-driven)

**Analog:** `components/root/root-nav-mobile.tsx` (exact match)

**Full client mobile nav pattern** (analog `components/root/root-nav-mobile.tsx`):

```typescript
"use client";
import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface HKNavMobileProps {
  navLinks: ReadonlyArray<{ href: string; label: string }>;
}

export function HKNavMobile({ navLinks }: HKNavMobileProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" className="lg:hidden min-h-11 min-w-11"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}>
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-80 bg-background">
        <SheetHeader><SheetTitle className="text-h3 font-display">Menu</SheetTitle></SheetHeader>
        <nav aria-label="Mobile primary" className="mt-8 flex flex-col gap-1">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className="text-h3 font-display text-foreground py-3 min-h-12 hover:text-brand-red transition-colors">
              {label}
            </Link>
          ))}
        </nav>
        {/* CTA button at bottom */}
        <div className="mt-8">
          <Button asChild size="touch" variant="default" className="w-full">
            <Link href="/book-a-trial/free-assessment/" onClick={() => setOpen(false)}>
              Book a Free Trial
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

---

### `components/hk/hk-footer.tsx` (component RSC, request-response)

**Analog:** `components/root/root-footer.tsx` (exact match)

**Footer structure pattern** (analog `components/root/root-footer.tsx` lines 37–125):
```typescript
export function HKFooter() {
  const whatsappHk = process.env.NEXT_PUBLIC_WHATSAPP_HK;
  return (
    <footer className="bg-brand-navy text-white">
      <Section size="md" bg="navy">
        <ContainerEditorial width="wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Col 1: Logo + tagline */}
            {/* Col 2: Quick links (HK pages) */}
            {/* Col 3: Venues (Wan Chai NAP + Cyberport NAP) */}
            {/* Col 4: Contact — WhatsApp CTA (conditional on env var), email */}
          </div>
          <Separator className="my-8 bg-white/20" />
          {/* Copyright + social icons — copy inline SVG pattern from root-footer.tsx lines 13–35 */}
        </ContainerEditorial>
      </Section>
    </footer>
  );
}
```

**Inline social SVG pattern** — copy the `FacebookIcon`, `InstagramIcon`, `LinkedinIcon` function pattern verbatim from `components/root/root-footer.tsx` lines 13–35 (Simple Icons CC0 paths).

**WhatsApp conditional** — copy env-var guard from `app/root/contact/page.tsx` lines 57–65:
```typescript
{whatsappHk && (
  <a href={`https://wa.me/${whatsappHk.replace(/[^0-9+]/g, "")}?text=...`} ...>WhatsApp</a>
)}
```

**Cross-market link** — HK footer link to SG uses `<a href={process.env.NEXT_PUBLIC_SG_URL}>`, same as `root-footer.tsx` line 71.

---

### `components/hk/venue-map.tsx` (component RSC, request-response)

**Analog:** None — first iframe embed component in the codebase.

Use RESEARCH.md Pattern 3 (lines 357–393) as the implementation specification directly:
```typescript
interface VenueMapProps {
  embedSrc: string;
  title: string;
  className?: string;
}

export function VenueMap({ embedSrc, title, className }: VenueMapProps) {
  if (!embedSrc || embedSrc.includes("PLACEHOLDER")) {
    return (
      <div className={cn("rounded-lg bg-muted h-64 flex items-center justify-center", className)}>
        <p className="text-muted-foreground text-small text-center px-4">Map loading — venue address below</p>
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

---

### `components/hk/gymnastics-pillar-nav.tsx` (component RSC, request-response)

**Analog:** `components/root/root-nav.tsx` (nav link list pattern, partial match)

**RSC wrapper with client child** — pattern:
```typescript
// RSC wrapper — no 'use client'
import { ActiveGymNavLink } from "@/components/hk/active-gym-nav-link";

const GYMNASTICS_PROGRAMMES = [
  { href: "/gymnastics/toddlers/", label: "Babies & Toddlers", age: "12mo–3yr" },
  ...
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

---

### `components/hk/active-gym-nav-link.tsx` (component client, event-driven)

**Analog:** `components/root/root-nav-mobile.tsx` (client component pattern with Link)

```typescript
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function ActiveGymNavLink({ href, label, age }: { href: string; label: string; age: string }) {
  const pathname = usePathname();
  // RESEARCH Pitfall 2: usePathname returns browser URL (no /hk/ prefix)
  const isActive = pathname.includes(href.replace(/\//g, "").replace("/", ""));
  return (
    <Link href={href} className={cn("flex flex-col items-center px-4 py-2 rounded-lg text-small font-medium transition-colors",
      isActive ? "bg-brand-navy text-white" : "bg-muted text-muted-foreground hover:bg-brand-navy/10")}>
      <span>{label}</span>
      <span className="text-[11px] opacity-70">{age}</span>
    </Link>
  );
}
```

---

### `lib/hk-data.ts` (utility, transform)

**Analog:** Inline constant arrays in `app/root/page.tsx` (lines 38–116) — extracted into a dedicated lib file.

**Data shape pattern** — all arrays must use shapes compatible with Phase 6 GROQ schema:
```typescript
// RESEARCH.md Pattern 5 (lines 467–494)
export interface BlogPostStub {
  title: string;
  slug: string;           // plain string (Phase 6: slug.current from Sanity)
  excerpt: string;
  date: string;           // ISO 8601: "2026-04-01"
  category: string;
  readTimeMinutes: number;
  imageUrl: string;       // public/photography/ path at Phase 4; Sanity CDN at Phase 6
}

export interface CoachStub {
  name: string;
  role: string;
  bio: string;
  venueTag?: string;
  portrait: string;
}

export interface FAQItemData {
  value: string;
  question: string;
  answer: string;
}

export interface VenueHours {
  weekdays: { opens: string; closes: string };
  weekends: { opens: string; closes: string };
}
```

**Env-var HUMAN-ACTION constants**:
```typescript
export const WAN_CHAI_MAP_EMBED_SRC =
  process.env.NEXT_PUBLIC_WAN_CHAI_MAP_EMBED ?? "PLACEHOLDER_WAN_CHAI_EMBED";
export const CYBERPORT_MAP_EMBED_SRC =
  process.env.NEXT_PUBLIC_CYBERPORT_MAP_EMBED ?? "PLACEHOLDER_CYBERPORT_EMBED";
```

---

### `lib/og-image.tsx` — HK extension (utility, transform)

**Analog:** `lib/og-image.tsx` (exact — add a `createHKOgImage()` sibling function)

**Pattern to copy** (analog `lib/og-image.tsx` lines 24–121):
```typescript
export async function createHKOgImage({ title, tagline }: OgImageOptions): Promise<ImageResponse> {
  // Same graceful try/catch for font + logo loading as createRootOgImage
  // Change backgroundColor to brand-navy (#0f206c) — same as root
  // Tagline suffix: "ProActiv Sports Hong Kong"
  // locale: "en_HK"
}
```

---

### `app/hk/*/opengraph-image.tsx` files (og-image, transform)

**Analog:** `app/root/brand/opengraph-image.tsx` (exact match — 5-line consumer)

```typescript
import { createHKOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return createHKOgImage({
    title: "ProGym Wan Chai",
    tagline: "Children's gymnastics in Wan Chai, Hong Kong.",
  });
}
```

**Pitfall 5 mitigation** (RESEARCH.md): Only ship `opengraph-image.tsx` for the 5 highest-priority pages: HK homepage, Wan Chai, Cyberport, `/gymnastics/`, `/book-a-trial/`. The 8 gymnastics sub-pages inherit the pillar's OG image — no per-sub-page `opengraph-image.tsx` file. This keeps build time within Vercel limits.

---

### Test files (test, —)

**Analog:** `app/root/page.test.tsx` + `app/root/contact/contact-form.test.tsx` (exact matches)

**RSC page test pattern** (analog `app/root/page.test.tsx` lines 1–134):
```typescript
import { describe, it, expect, beforeAll, vi } from "vitest";
import { render } from "@testing-library/react";

// Stub primitives — tests verify wiring, not primitive internals
vi.mock("@/components/ui/section", () => ({
  Section: ({ children, ...rest }: any) => <section data-test="section" {...rest}>{children}</section>,
}));
vi.mock("@/components/hk/hk-nav", () => ({ HKNav: () => <nav data-test="hk-nav" /> }));
vi.mock("next/image", () => ({
  default: ({ src, alt, priority, ...rest }: any) => (
    <img src={src} alt={alt} data-priority={priority ? "true" : "false"} {...rest} />
  ),
}));

beforeAll(() => {
  process.env.NEXT_PUBLIC_HK_WHATSAPP = "+852123456789";
});
```

**Client form test pattern** (analog `app/root/contact/contact-form.test.tsx` lines 1–89):
```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const mockSearchParams = { get: vi.fn() };
vi.mock("next/navigation", () => ({ useSearchParams: () => mockSearchParams }));

beforeEach(() => {
  mockSearchParams.get.mockReset();
  global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
});
```

---

## Shared Patterns

### Skip-link + skip target
**Source:** `app/root/layout.tsx` lines 40–46
**Apply to:** `app/hk/layout.tsx`
```typescript
<a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-2 focus:outline-ring focus:outline-offset-2">
  Skip to main content
</a>
```

### Section + ContainerEditorial composition
**Source:** `app/root/page.tsx` lines 255–297, `app/root/brand/page.tsx` lines 97–120
**Apply to:** All HK page files
```typescript
<Section size="md" bg="default">
  <ContainerEditorial width="default">
    {/* content */}
  </ContainerEditorial>
</Section>
```
`size` values: `"sm"` | `"md"` | `"lg"`. `bg` values: `"default"` | `"muted"` | `"navy"` | `"cream"`.

### Single `priority` Image rule
**Source:** `app/root/page.test.tsx` lines 93–101 (Pitfall 6)
**Apply to:** Every HK page — exactly one `<Image priority>` per page (the hero image). All other images omit `priority`.

### Full openGraph object (no shallow-merge)
**Source:** `app/root/page.tsx` lines 223–247 (Pitfall 2)
**Apply to:** Every HK page `export const metadata` — include `title`, `description`, `url`, `images`, `siteName`, `locale`, `type`.

### Honeypot field
**Source:** `app/root/contact/contact-form.tsx` lines 211–218
**Apply to:** `app/hk/book-a-trial/free-assessment/booking-form.tsx`
```typescript
<input type="text" name="bot-trap" tabIndex={-1} autoComplete="off" aria-hidden="true"
  style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px" }} />
```

### Cross-subdomain link guard
**Source:** `app/root/page.tsx` lines 31–32, 271 (Pitfall 7)
**Apply to:** `components/hk/hk-nav.tsx`, `components/hk/hk-footer.tsx`, any HK page linking to SG or root
```typescript
// WRONG — routes to hk.proactivsports.com/brand/ (404)
<Link href="/brand/">About</Link>
// CORRECT
<a href={process.env.NEXT_PUBLIC_ROOT_URL + "/brand/"}>About</a>
```

### WhatsApp conditional render
**Source:** `app/root/contact/page.tsx` lines 57–65, 108–122
**Apply to:** `components/hk/hk-footer.tsx`, `app/hk/book-a-trial/page.tsx`
```typescript
const whatsappHk = process.env.NEXT_PUBLIC_WHATSAPP_HK;
// Render CTA only when populated
{whatsappHk && <a href={`https://wa.me/${whatsappHk.replace(/[^0-9+]/g, "")}?text=...`}>...</a>}
```

### Suspense boundary for useSearchParams
**Source:** `app/root/contact/page.tsx` lines 84–92 (Rule 3 fix)
**Apply to:** `app/hk/book-a-trial/free-assessment/page.tsx` (wraps `<BookingForm />`)
```typescript
import { Suspense } from "react";
<Suspense fallback={null}>
  <BookingForm />
</Suspense>
```

### JSON-LD inline script
**Source:** `app/root/page.tsx` lines 491–496
**Apply to:** `app/hk/page.tsx`, `app/hk/wan-chai/page.tsx`, `app/hk/cyberport/page.tsx`, `app/hk/faq/page.tsx`, gymnastics sub-pages
```typescript
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
/>
```

### Baloo font variable activation
**Source:** `app/fonts.ts` lines 28–33, `app/layout.tsx` lines 19 (pattern to mirror)
**Apply to:** `app/hk/layout.tsx` — the HK layout or its wrapping element must include `${baloo.variable}` in its className so the `--font-baloo` CSS variable cascades to all HK child components.
```typescript
import { baloo } from "@/app/fonts";
// In the layout component:
<div className={baloo.variable}>...</div>
// or on the html element if HK layout wraps html
```

---

## No Analog Found

| File | Role | Data Flow | Reason |
|---|---|---|---|
| `components/hk/venue-map.tsx` | component RSC | request-response | First iframe embed in codebase — no existing map component |

---

## Metadata

**Analog search scope:** `app/root/`, `components/root/`, `components/ui/`, `lib/`, `app/api/`
**Files scanned:** 35
**Pattern extraction date:** 2026-04-24

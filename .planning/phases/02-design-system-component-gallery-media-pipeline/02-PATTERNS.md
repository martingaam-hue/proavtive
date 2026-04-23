# Phase 2: Design System, Component Gallery, Media Pipeline — Pattern Map

**Mapped:** 2026-04-22
**Files analysed:** 24 new/modified files
**Analogs found:** 20 / 24 (4 have no codebase analog — use RESEARCH.md patterns)

---

## Summary

- **One master pattern for all custom primitives:** `components/ui/button.tsx` (lines 1–67). Copy its CVA `cva()` + `VariantProps` + `Slot.Root` + `cn()` + `data-slot` pattern verbatim; adapt the variant map to each primitive's visual contract.
- **`app/globals.css` has a precise three-layer structure** (`@import` stack → `@theme inline {}` binding table → `:root {}` oklch values → `.dark {}`). Phase 2 inserts a new bare `@theme {}` block *above* the existing `@theme inline {}` and replaces only the `:root` oklch values — never touching the binding table.
- **`app/layout.tsx` uses the `Geist / Geist_Mono` pattern** (variable → className on `<html>`). Phase 2 replaces the `next/font/google` import with `next/font/local` from `app/fonts.ts`; the `<html className={...}>` wiring is identical.
- **Client-bundle boundary:** `sanity.config.ts` (line 1 `"use client"`) is the project template for client-only modules. `components/ui/video-player.tsx` follows the same top-of-file directive; `app/_design/page.tsx` stays an RSC (no directive) because only `VideoPlayer` is a client island.
- **Vitest config scoped to `node` environment.** Phase 2 extends it with `@vitejs/plugin-react` + jsdom when adding RTL component tests — the existing `vitest.config.ts` (lines 9–25) is the base; all include/exclude patterns are reused.

---

## File-to-Analog Map

| New / Modified File | Analog File | Role | Match Quality | Notes |
|---------------------|-------------|------|---------------|-------|
| `app/globals.css` | `app/globals.css` (self) | config / token layer | self-extend | Extend — add `@theme {}` above line 7; replace `:root {}` oklch values |
| `app/layout.tsx` | `app/layout.tsx` (self) | RSC root layout | self-extend | Replace Geist import with `app/fonts.ts` exports; same `<html className>` shape |
| `app/fonts.ts` | `app/layout.tsx` lines 3–12 | font-wiring module | role-match | Extracts font declarations from layout; same `localFont({variable})` shape |
| `next.config.ts` | `next.config.ts` (self) | config | self-extend | Add `images {}` block inside existing `nextConfig`; keep Sentry wrap |
| `package.json` | `package.json` (self) | config | self-extend | Add deps under `dependencies`; `sharp` under `devDependencies` |
| `components/ui/button.tsx` | `components/ui/button.tsx` (self) | primitive | self-extend | Add `touch` size variant to CVA config; audit `data-slot`; no structural change |
| `components/ui/card.tsx` | `components/ui/button.tsx` | primitive | role-match | Stock shadcn add — but button's CVA structure previews how card sub-exports compose |
| `components/ui/accordion.tsx` | `components/ui/button.tsx` | primitive | role-match | Stock shadcn add |
| `components/ui/badge.tsx` | `components/ui/button.tsx` | primitive | role-match | Stock shadcn add |
| `components/ui/avatar.tsx` | `components/ui/button.tsx` | primitive | role-match | Stock shadcn add |
| `components/ui/separator.tsx` | `components/ui/button.tsx` | primitive | role-match | Stock shadcn add |
| `components/ui/faq-item.tsx` | `components/ui/button.tsx` | pattern wrapper | role-match | Wraps Accordion; same CVA + cn() + typed props shape |
| `components/ui/market-card.tsx` | `components/ui/button.tsx` | pattern (Card + Image + Link) | role-match | Custom — composition root is Card; CVA + cn() + typed interface |
| `components/ui/programme-tile.tsx` | `components/ui/button.tsx` | pattern (Card + Badge + Image) | role-match | Same as MarketCard shape; Badge inside |
| `components/ui/testimonial-card.tsx` | `components/ui/button.tsx` | pattern (Card + Avatar) | role-match | Avatar as sub-component; pullquote variant via CVA |
| `components/ui/stat-strip.tsx` | `components/ui/button.tsx` | pattern (flex layout) | role-match | No Radix base; plain JSX + CVA variant (`default` / `on-dark`) |
| `components/ui/logo-wall.tsx` | `components/ui/button.tsx` | pattern (image grid) | role-match | No Radix base; typed logos array prop; cn() for conditional grayscale |
| `components/ui/section.tsx` | `app/root/layout.tsx` | layout-wrapper | role-match | Root layout children-wrapper pattern; typed `as` + `size` + `bg` props |
| `components/ui/container-editorial.tsx` | `app/root/layout.tsx` | layout-wrapper | role-match | Same wrapper pattern; typed `width` prop → max-w class |
| `components/ui/video-player.tsx` | `sanity.config.ts` | client-bundle entry | exact (boundary pattern) | `'use client'` at top; dynamic import with `ssr: false` |
| `app/_design/page.tsx` | `app/studio/[[...tool]]/page.tsx` | RSC page with env gate | role-match | `notFound()` guard analogous to `export const dynamic = "force-static"` gating |
| `app/_design/layout.tsx` | `app/root/layout.tsx` + `app/hk/layout.tsx` | RSC layout | role-match | Sidebar nav shell; children-wrapper pattern from market layouts |
| `scripts/process-photos.mjs` | — | Node script (no analog) | none | ES module; Sharp; no codebase equivalent — use RESEARCH.md Topic 4 example |
| `.planning/inputs/curated-hero-photos/.gitkeep` + `public/photography/.gitkeep` | — | tracked empty dir | none | No analog; create via `touch` + verify `.gitignore` coverage |

---

## Per-File Details

### `app/globals.css` — extend with brand token layer

**Analog:** self (`app/globals.css`)

**Existing structure to preserve** (lines 1–6, 7–49, 51–84, 86–118, 120–130):
```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {                         /* ← KEEP UNTOUCHED — binding table */
  --color-background: var(--background);
  /* ... all 40+ aliases ... */
}

:root {                                 /* ← REPLACE oklch values with brand values */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);       /* ← becomes oklch(0.2906 0.1328 267.05) navy */
  /* ... */
}

.dark {                                 /* ← KEEP — do not redefine */
  /* ... */
}
```

**Phase 2 insertion point** — new bare `@theme {}` block inserted **between** line 5 (`@custom-variant dark`) and line 7 (`@theme inline`):
```css
/* ── Phase 2: ProActiv brand token layer ─────────────────── */
@theme {
  --color-brand-navy:   #0f206c;
  --color-brand-red:    #ec1c24;
  --color-brand-green:  #0f9733;
  --color-brand-sky:    #0fa0e2;
  --color-brand-yellow: #fac049;
  --color-brand-cream:  #fff3dd;

  --font-display: var(--font-bloc, "Arial", "Helvetica Neue", system-ui, sans-serif);
  --font-sans:    var(--font-mont, "Arial", "Helvetica Neue", system-ui, sans-serif);
  --font-accent:  var(--font-baloo, "Arial", "Helvetica Neue", system-ui, sans-serif);

  --spacing-section-sm: 4rem;
  --spacing-section-md: 6rem;
  --spacing-section-lg: 8rem;
}
```

**`:root {}` values to replace** — full replacement of the 16 semantic variables with brand oklch values per UI-SPEC §1.4 table. Key replacements:
```css
:root {
  --foreground:           oklch(0.2906 0.1328 267.05);  /* navy — replaces oklch(0.145 0 0) */
  --primary:              oklch(0.2906 0.1328 267.05);  /* navy — replaces oklch(0.205 0 0) */
  --primary-foreground:   oklch(1 0 0);                 /* white */
  --secondary:            oklch(0.8399 0.1469 81.92);   /* yellow — replaces oklch(0.97 0 0) */
  --secondary-foreground: oklch(0.2906 0.1328 267.05);  /* navy on yellow */
  --accent:               oklch(0.9678 0.0316 82.77);   /* cream */
  --accent-foreground:    oklch(0.2906 0.1328 267.05);  /* navy */
  --muted:                oklch(0.9678 0.0316 82.77);   /* cream */
  --muted-foreground:     oklch(0.45 0.05 267);         /* 70% navy */
  --destructive:          oklch(0.6012 0.2339 26.97);   /* red */
  --ring:                 oklch(0.2906 0.1328 267.05);  /* navy focus ring */
  /* --radius, --border, --input: keep Phase 1 values */
}
```

**Adaptation note:** Do NOT use `--color-*: initial` in the `@theme {}` block — that resets Tailwind defaults and breaks `bg-slate-*` utilities used in Phase 1 placeholder stripes (RESEARCH.md Pitfall 1).

---

### `app/layout.tsx` — replace Geist with brand fonts

**Analog:** self (`app/layout.tsx`)

**Current import pattern to replace** (lines 2–12):
```typescript
import { Geist, Geist_Mono } from "next/font/google";   // ← DELETE

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

**Replacement pattern:**
```typescript
import { blocBold, mont } from "./fonts";               // ← NEW (baloo NOT in root layout per D-03)
```

**`<html className>` pattern to adapt** (line 29):
```typescript
// Current:
<html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
// Phase 2:
<html lang="en" className={`${blocBold.variable} ${mont.variable} h-full antialiased`}>
```

**Adaptation notes:**
- `geistMono` variable (`--font-geist-mono`) is referenced in `globals.css` line 12 (`--font-mono: var(--font-geist-mono)`). Phase 2 keeps the `@theme inline` mono alias but stops providing the variable. If a mono font is needed, either keep Geist Mono as a second import or update the alias to `var(--font-sans)`. Planner resolves at plan time.
- `baloo.variable` is NOT attached to `<html>` — it is attached by ProGym-specific route layouts per D-03.

---

### `app/fonts.ts` — font-wiring module

**Analog:** `app/layout.tsx` lines 3–12 (current Geist import shape)

**Pattern to copy and adapt:**
```typescript
// From app/layout.tsx lines 3–8:
import { Geist } from "next/font/google";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
```

**Phase 2 version (RESEARCH.md Topic 2 pattern, adapted to project):**
```typescript
import localFont from 'next/font/local'

export const blocBold = localFont({
  src: [
    { path: '../assets/brand/fonts/bloc-bold-regular.woff2', weight: '400', style: 'normal' },
    { path: '../assets/brand/fonts/bloc-bold-bold.woff2',    weight: '700', style: 'normal' },
  ],
  variable: '--font-bloc',
  display: 'swap',
  adjustFontFallback: 'Arial',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
})

export const mont = localFont({
  src: [
    { path: '../assets/brand/fonts/mont-regular.woff2', weight: '400', style: 'normal' },
    { path: '../assets/brand/fonts/mont-medium.woff2',  weight: '500', style: 'normal' },
    { path: '../assets/brand/fonts/mont-bold.woff2',    weight: '700', style: 'normal' },
  ],
  variable: '--font-mont',
  display: 'swap',
  adjustFontFallback: 'Arial',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
})

export const baloo = localFont({
  src: [
    { path: '../assets/brand/fonts/baloo-regular.woff2', weight: '400', style: 'normal' },
    { path: '../assets/brand/fonts/baloo-medium.woff2',  weight: '500', style: 'normal' },
    { path: '../assets/brand/fonts/baloo-bold.woff2',    weight: '700', style: 'normal' },
  ],
  variable: '--font-baloo',
  display: 'swap',
  adjustFontFallback: 'Arial',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
})
```

**Note:** `src` paths are relative to `app/fonts.ts` — `'../assets/brand/fonts/...'` resolves to the D-02 drop zone. Precondition task must verify all 8 files exist before this module is written.

---

### `next.config.ts` — add `images {}` config

**Analog:** self (`next.config.ts`)

**Existing `nextConfig` object to extend** (lines 6–38):
```typescript
const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["sanity", "@sanity/vision", "@sanity/visual-editing"],
  async headers() { /* ... */ },
};
```

**Add `images` block inside `nextConfig`** (after `transpilePackages`, before `headers`):
```typescript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 2678400,
  remotePatterns: [
    { protocol: 'https', hostname: 'cdn.sanity.io' },
  ],
},
```

**Adaptation note:** Keep `withSentryConfig(nextConfig, {...})` wrap at lines 45–66 unchanged. If `@mux/mux-player-react` triggers CJS/ESM interop warnings in Turbopack, add it to `transpilePackages` on the same line 16 pattern.

---

### `components/ui/button.tsx` — add `touch` size variant

**Analog:** self (`components/ui/button.tsx`)

**CVA `size` variants to extend** (lines 23–35):
```typescript
size: {
  default: "h-8 gap-1.5 px-2.5 ...",
  xs:  "h-6 ...",
  sm:  "h-7 ...",
  lg:  "h-9 gap-1.5 px-2.5 ...",
  icon: "size-8",
  // ... icon variants
},
```

**Add `touch` variant** — insert after `lg`:
```typescript
touch: "h-11 gap-1.5 px-4 text-base has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
```

**Adaptation note:** `h-11` = 44px, meeting WCAG 2.2 AA touch-target minimum per UI-SPEC §3.1 FLAG-3. This is the DEFAULT size for all consumer-facing CTAs from Phase 3 onward.

---

### `components/ui/market-card.tsx` + `programme-tile.tsx` + `testimonial-card.tsx` — custom patterns

**Analog:** `components/ui/button.tsx` (lines 1–67)

**Imports pattern to copy** (lines 1–5):
```typescript
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";          // ← omit if component is not polymorphic
import { cn } from "@/lib/utils";
```

**Custom patterns replace `Slot.Root` with composition root:**
```typescript
// market-card.tsx
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface MarketCardProps {
  market: 'hk' | 'sg';
  label: string;
  tagline: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  priority?: boolean;
  className?: string;
}

export function MarketCard({ label, tagline, href, imageSrc, imageAlt, priority, className }: MarketCardProps) {
  return (
    <Link
      href={href}
      aria-label={`${label} — ${tagline}`}
      className={cn("group block overflow-hidden rounded-xl focus-visible:ring-3 focus-visible:ring-ring", className)}
    >
      <div className="relative aspect-[4/3]">
        <Image src={imageSrc} alt={imageAlt} fill sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority} fetchPriority={priority ? "high" : "auto"}
          className="object-cover transition-transform duration-400 group-hover:scale-105" />
        {/* Navy-to-transparent gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <p className="font-display text-display font-bold text-white">{label}</p>
          <p className="text-body text-brand-cream">{tagline}</p>
        </div>
        <ArrowRight className="absolute bottom-8 right-8 text-white transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
```

**`data-slot` convention** — button uses `data-slot="button"`. Custom patterns use `data-slot="market-card"` etc. on the root element. This enables Radix-style CSS targeting and is consistent with the button template.

---

### `components/ui/section.tsx` + `container-editorial.tsx` — layout wrappers

**Analog:** `app/root/layout.tsx` (lines 12–20)

**Root layout wrapper pattern** (lines 12–19):
```typescript
export default function RootGroupLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div aria-hidden className="h-1 w-full bg-slate-400" />
      {children}
    </>
  );
}
```

**Phase 2 typed-wrapper adaptation:**
```typescript
// components/ui/section.tsx
import { cn } from "@/lib/utils";
import * as React from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'section' | 'article' | 'div';
  size?: 'sm' | 'md' | 'lg';
  bg?: 'default' | 'muted' | 'navy' | 'cream';
  children: React.ReactNode;
}

const sizeMap = { sm: 'py-section-sm', md: 'py-section-md', lg: 'py-section-lg' } as const;
const bgMap  = { default: 'bg-background', muted: 'bg-muted', navy: 'bg-brand-navy', cream: 'bg-brand-cream' } as const;

export function Section({ as: Tag = 'section', size = 'md', bg = 'default', className, children, ...props }: SectionProps) {
  return (
    <Tag data-slot="section" className={cn(sizeMap[size], bgMap[bg], className)} {...props}>
      {children}
    </Tag>
  );
}
```

**`ContainerEditorial` follows the same pattern** with `width` → `max-w` mapping (`narrow=max-w-2xl`, `default=max-w-6xl`, `wide=max-w-7xl`) and `mx-auto px-4 md:px-8` base classes.

---

### `components/ui/stat-strip.tsx` + `logo-wall.tsx` + `faq-item.tsx` — plain composition patterns

**Analog:** `components/ui/button.tsx` (structure) + `app/root/layout.tsx` (simple wrapper)

These three have no Radix base. The pattern is:
1. Typed interface (no CVA — no variant complexity beyond one optional variant prop)
2. `cn()` for conditional class merging
3. `data-slot` on root element
4. Lucide icons imported individually

**`faq-item.tsx` additionally imports from the stock accordion:**
```typescript
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface FAQItemProps {
  question: string;
  answer: string | React.ReactNode;
  defaultOpen?: boolean;
  id?: string;
}
```

---

### `components/ui/video-player.tsx` — client-bundle entry with dynamic import

**Analog:** `sanity.config.ts` (line 1) + `app/studio/[[...tool]]/page.tsx` (RSC/client split)

**`'use client'` boundary pattern** — `sanity.config.ts` line 1:
```typescript
"use client";
// Phase 1 / Plan 01-03 — Embedded Studio configuration...
```

**`dynamic` import pattern** (from RESEARCH.md Topic 5 — no codebase analog yet):
```typescript
'use client'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'

const PLACEHOLDER_PLAYBACK_ID = 'DS00Spx1CV902MCtPj5WknGlR102V5HFkDe'

const MuxPlayer = dynamic(
  () => import('@mux/mux-player-react').then(m => m.default ?? m),
  { ssr: false }
)

interface VideoPlayerProps {
  playbackId: string;
  title: string;
  poster?: string;
  autoPlay?: boolean;
  aspect?: 'video' | 'square' | 'portrait';
  className?: string;
}

export function VideoPlayer({ playbackId = PLACEHOLDER_PLAYBACK_ID, title, poster, autoPlay = false, aspect = 'video', className }: VideoPlayerProps) {
  return (
    <div data-slot="video-player" className={cn('overflow-hidden rounded-xl', className)}>
      <MuxPlayer
        playbackId={playbackId}
        metadata={{ video_title: title }}
        poster={poster}
        muted={autoPlay}
        autoPlay={autoPlay ? 'muted' : false}
        loop={autoPlay}
        playsInline
        className={cn('w-full', aspect === 'video' && 'aspect-video', aspect === 'square' && 'aspect-square', aspect === 'portrait' && 'aspect-[9/16]')}
      />
    </div>
  )
}
```

**Adaptation note:** The containing page (`app/_design/page.tsx`) remains an RSC with no `'use client'` directive — only `<VideoPlayer>` is the client island. This mirrors the `app/studio/[[...tool]]/page.tsx` pattern (RSC page → `<NextStudio>` is the client boundary).

---

### `app/_design/page.tsx` — env-gated RSC gallery

**Analog:** `app/studio/[[...tool]]/page.tsx` (lines 1–21)

**`notFound()` gating pattern** — analogous to `export const dynamic = "force-static"` used in studio page; instead uses runtime env check:
```typescript
// From app/studio/[[...tool]]/page.tsx — server-render guard pattern:
export const dynamic = "force-static";   // ← studio approach
// /_design approach — env check:
import { notFound } from 'next/navigation';
if (process.env.VERCEL_ENV === 'production') notFound();
```

**Full pattern:**
```typescript
import { notFound } from 'next/navigation'

export default function DesignGallery() {
  if (process.env.VERCEL_ENV === 'production') notFound()

  return (
    <main>
      {/* Section and ContainerEditorial primitives wrap all gallery sections */}
      {/* VideoPlayer is the only 'use client' island — imported directly */}
    </main>
  )
}
```

**Adaptation note:** `metadata` export follows the same pattern as market layout files (`app/root/layout.tsx` line 8 `export const metadata`). Gallery metadata: `{ title: "Phase 2 Design Gallery", robots: { index: false } }`.

---

### `app/_design/layout.tsx` — sticky sidebar nav shell

**Analog:** `app/hk/layout.tsx` (lines 1–19)

**Market layout children-wrapper pattern** (lines 11–19):
```typescript
export default function HKGroupLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div aria-hidden className="h-1 w-full bg-amber-400" />
      {children}
    </>
  );
}
```

**Phase 2 adaptation** — replace stripe with sticky sidebar layout:
```typescript
export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sticky sidebar — planner decides: static nav or 'use client' intersection-observer nav */}
      <aside className="hidden lg:block lg:w-64 lg:fixed lg:inset-y-0 lg:overflow-y-auto border-r bg-muted">
        {/* Anchor links — see UI-SPEC §4.2 for anchor list */}
      </aside>
      <div className="lg:pl-64 flex-1">{children}</div>
    </div>
  )
}
```

---

### `scripts/process-photos.mjs` — Sharp preprocessing (no codebase analog)

**Analog:** None in the codebase. Use RESEARCH.md Topic 4 pattern directly.

**Key structural facts:**
- Node.js ES module (`import` syntax; `.mjs` extension)
- `sharp` is a `devDependency` — never imported in Next.js app code
- Reads from `.planning/inputs/curated-hero-photos/` (gitignored at file level)
- Writes to `public/photography/` (committed to git)
- Added to `package.json` `scripts` as `"photos:process": "node scripts/process-photos.mjs"`
- AVIF quality: 70; WebP quality: 80; JPG fallback quality: 85; widths: [640, 1024, 1920]

---

### `vitest.config.ts` — extend for RTL component tests (if planner opts in)

**Analog:** self (`vitest.config.ts`)

**Current config to extend** (lines 9–25):
```typescript
export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**", "out/**", "build/**", ".vercel/**"],
    passWithNoTests: true,
  },
});
```

**Phase 2 extension if RTL is added** — planner adds `plugins` + environment override:
```typescript
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",                       // default for middleware tests
    include: ["**/*.test.{ts,tsx}"],            // ← add .tsx
    environmentMatchGlobs: [
      ["**/*.test.tsx", "jsdom"],              // ← RTL tests use jsdom
      ["middleware.test.ts", "node"],           // ← keep middleware in node
    ],
    exclude: ["node_modules/**", ".next/**", "out/**", "build/**", ".vercel/**"],
    passWithNoTests: true,
  },
});
```

**Adaptation note:** `environmentMatchGlobs` lets middleware tests keep `node` while component tests use `jsdom` — avoids removing Phase 1's CI check (Plan 01-04 D-17 invariant).

---

## Cross-Cutting Patterns

### CVA variant pattern (applies to all custom primitives)

**Source:** `components/ui/button.tsx` lines 1–67

```typescript
// 1. Import block (every custom primitive)
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// 2. CVA definition (adapt variant map)
const componentVariants = cva(
  "base-classes-token-only",              // ← NEVER raw hex here; only token utilities
  {
    variants: { variant: { default: "...", secondary: "..." } },
    defaultVariants: { variant: "default" },
  }
);

// 3. Component (React.ComponentProps for native-element pass-through)
function MyComponent({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof componentVariants>) {
  return <div data-slot="my-component" className={cn(componentVariants({ variant, className }))} {...props} />;
}

export { MyComponent, componentVariants };
```

### Token-only class rule

All custom primitives MUST use token utilities only — never raw hex, never inline styles for colours. Examples:

| Forbidden | Required |
|-----------|----------|
| `style={{ color: '#0f206c' }}` | `className="text-primary"` or `className="text-brand-navy"` |
| `className="bg-[#fff3dd]"` | `className="bg-brand-cream"` or `className="bg-muted"` |
| `className="text-[#ec1c24]"` | `className="text-destructive"` or `className="text-brand-red"` |

Semantic tokens (`text-primary`, `bg-muted`) are preferred over raw brand tokens (`text-brand-navy`) so Phase 3+ theme overrides propagate automatically.

### `'use client'` boundary placement

**Rule:** `'use client'` lives at the **top of the module that initiates the client bundle** — not on the page that imports it.

| File | Directive | Reason |
|------|-----------|--------|
| `components/ui/video-player.tsx` | `'use client'` (line 1) | Uses `dynamic` + browser APIs |
| `app/_design/page.tsx` | none (RSC) | Imports VideoPlayer — the island is self-contained |
| `app/_design/layout.tsx` | none (RSC) unless sidebar uses IntersectionObserver | Static nav = RSC; scroll-tracking nav = `'use client'` |
| `app/fonts.ts` | none | Pure `next/font/local` calls — server-only |
| All `components/ui/*.tsx` custom | none (RSC-compatible) | No hooks; no browser APIs; Radix primitives handle own client boundary |

**Source pattern:** `sanity.config.ts` line 1 and the split between `app/studio/[[...tool]]/page.tsx` (RSC, no directive) and `<NextStudio>` (internal `'use client'`).

### Env-gate pattern (applies to `/_design/` route)

**Source:** `next.config.ts` lines 23–36 (VERCEL_ENV pattern)

```typescript
// Same env variable used throughout the codebase:
const isProd = process.env.VERCEL_ENV === "production";

// /_design/ application:
import { notFound } from 'next/navigation';
if (process.env.VERCEL_ENV === 'production') notFound();
```

### `data-slot` convention

Every primitive emits a `data-slot` attribute on its root element, matching the button pattern (`data-slot="button"` at line 58). Use `data-slot="market-card"`, `data-slot="section"`, `data-slot="video-player"` etc. This enables Radix-style CSS targeting without class coupling.

---

## No Analog Found

| File | Role | Reason | Guidance |
|------|------|--------|----------|
| `scripts/process-photos.mjs` | Node script | No build scripts exist in the codebase | Use RESEARCH.md Topic 4 Sharp example verbatim |
| `.planning/inputs/curated-hero-photos/.gitkeep` | tracked empty dir | No precedent for tracked-but-gitignored folder pattern | `touch` the file; add `*.jpg|*.jpeg|*.png|*.heic|*.tiff` exclusion to `.gitignore` scoped to that directory |
| `public/photography/.gitkeep` | tracked output dir | No `public/` sub-directories exist yet | Same `.gitkeep` approach; contents committed (processed output is safe to commit) |
| `app/fonts.ts` (multi-weight `src` array) | font module | Only Google Fonts `next/font/google` pattern exists (single-call, no src array) | Use RESEARCH.md Topic 2 `localFont` multi-weight array pattern |

---

## Metadata

**Analog search scope:** `/Users/martin/Projects/proactive/` — all `.tsx`, `.ts`, `.css`, `.mjs`, `.json` excluding `node_modules`, `.next`, `.planning`, `.git`
**Files scanned:** 44 source files
**Pattern extraction date:** 2026-04-22

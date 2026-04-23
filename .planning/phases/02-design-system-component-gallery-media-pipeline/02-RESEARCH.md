---
phase: 02-design-system-component-gallery-media-pipeline
type: research
status: draft
produced_by: gsd-phase-researcher (background, pipelined with Phase 1 execution)
updated: 2026-04-22
---

# Phase 2: Design System, Component Gallery, Media Pipeline — Research

**Researched:** 2026-04-22
**Domain:** Design tokens / Tailwind v4 / shadcn/ui / next/font/local / next/image / Sharp / Mux
**Confidence:** MEDIUM-HIGH — all Next.js 15, Tailwind v4, and next/font docs verified from official sources. Mux docs blocked by access restrictions; Mux integration guidance is [ASSUMED] from training knowledge. Sharp build-script guidance is [ASSUMED].

---

## Summary

- **Tokens first, components second.** Phase 2 starts with a CSS-first Tailwind v4 `@theme` block that maps ProActiv brand hex values to `--color-*` and `--font-*` variables, then overlays shadcn's `cssVariables=true` semantic layer (`--primary`, `--foreground`, etc.) on top. Get this order right and all ~20 primitives inherit the brand automatically.
- **Font loading is the CLS risk.** `next/font/local` with `variable` mode + `adjustFontFallback` eliminates layout shift — but only if font files are WOFF2, the `variable` CSS var is applied to `<html>`, and `display: swap` is used with carefully-matched fallback metrics. Font files must exist in the repo before Phase 2 executes.
- **next/image handles AVIF/WebP on Vercel automatically** — no separate Sharp build pipeline is needed for responsive serving. Sharp as a local preprocessing script is useful only for bulk-reducing the 22 GB raw source before checking representative hero images into `public/` or Sanity.
- **Mux player requires a `"use client"` wrapper** and dynamic import in Next.js 15 App Router to avoid SSR hydration mismatches. The player itself is off the LCP critical path if it sits below the fold or behind a poster image.
- **`/_design/` gating is simplest via env-based conditional rendering** — check `process.env.VERCEL_ENV !== 'production'` in the route's layout/page; no middleware changes needed and it's safe given the existing subdomain middleware.

**Primary recommendation:** Token layer first (globals.css `@theme`), then shadcn primitive adds, then font wiring, then image/video primitives, then `/_design/` gallery — in that exact order to prevent rework.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Brand token CSS variables | Frontend (globals.css) | — | Design tokens are CSS; no server concern |
| Self-hosted font loading | Frontend Server (Next.js layout) | CDN (Vercel caches font files as static) | `next/font/local` runs at build time, emits preload links server-side |
| shadcn primitive components | Frontend (RSC or Client as needed) | — | Radix primitives, most are server-renderable |
| Sharp preprocessing pipeline | Build script (Node.js, local) | — | One-time local processing; output goes to Sanity or public/ |
| Responsive image serving | CDN / Vercel Image Optimization | next/image (request-time) | Vercel transforms on first request, caches thereafter |
| Mux video player | Browser / Client | — | Web component / custom element; requires `"use client"` |
| `/_design/` gallery route | Frontend Server | — | Route renders component showcase; env-gated |

---

## Recommended Stack Pin

Install these in Phase 2 — verify latest patch before executing:

```bash
# Design system primitives (via shadcn CLI — adds to components/ui/)
pnpm dlx shadcn@latest add card badge separator sheet dialog accordion tabs avatar

# Mux player
pnpm add @mux/mux-player-react

# Mux uploader (for Phase 2 media processing)
pnpm add @mux/mux-uploader-react

# RTL + jsdom (component test rig deferred from Phase 1 D-15)
pnpm add -D @testing-library/react @testing-library/user-event jsdom @vitejs/plugin-react

# Sharp (local preprocessing script only — NOT a Next.js dep)
pnpm add -D sharp
```

**Version notes (verify against registry at execution time):**
- `@mux/mux-player-react` — training knowledge pins ~2.x; [needs-verification] against npm at execution
- `tailwindcss` is already installed at `^4` per package.json — no upgrade needed
- `shadcn` CLI is already initialized (Phase 1 Plan 01-02); `pnpm dlx shadcn@latest add` works against the existing `components.json`

---

## Research by Topic

---

### Topic 1: Tailwind CSS v4 Brand Tokens

#### What the docs say

[VERIFIED: tailwindcss.com/docs/theme] In Tailwind v4, design tokens are declared with `@theme` in CSS. The variable namespace determines which utility classes are generated:

| Namespace | Generated utilities |
|-----------|---------------------|
| `--color-*` | `bg-*`, `text-*`, `border-*`, `ring-*` |
| `--font-*` | `font-*` (font-family) |
| `--text-*` | `text-*` (font-size + line-height) |
| `--spacing-*` | `p-*`, `m-*`, `gap-*`, `w-*`, `h-*` |
| `--radius-*` | `rounded-*` |
| `--shadow-*` | `shadow-*` |

[VERIFIED: tailwindcss.com/docs/adding-custom-styles] `@theme` replaces `tailwind.config.js → theme.extend`. The old JS config file is no longer used in v4. All customization is CSS-first.

#### shadcn cssVariables=true + Tailwind v4 interaction

[ASSUMED] shadcn's `cssVariables=true` mode emits semantic CSS variables (`--primary`, `--primary-foreground`, `--background`, etc.) into `globals.css`. In Tailwind v4 these need to be wrapped in `@theme inline` to expose them as utilities **without** creating new utility class names — they act as aliases to your brand tokens.

The two-layer pattern to use:

```css
/* app/globals.css */
@import "tailwindcss";

/* ── Layer 1: Brand tokens ────────────────────────────────── */
@theme {
  /* ProActiv palette (from PROJECT.md) */
  --color-brand-navy:   #0f206c;
  --color-brand-red:    #ec1c24;
  --color-brand-green:  #0f9733;
  --color-brand-sky:    #0fa0e2;
  --color-brand-yellow: #fac049;
  --color-brand-cream:  #fff3dd;

  /* Typography families — actual CSS var names wired by next/font/local */
  --font-display: var(--font-bloc);   /* Bloc Bold → headlines */
  --font-sans:    var(--font-mont);   /* Mont → body */
  --font-accent:  var(--font-baloo);  /* Baloo → SG Prodigy usage */

  /* Section spacing rhythm (strategy PART 14.6) */
  --spacing-section-sm: 4rem;   /* 64px */
  --spacing-section-md: 6rem;   /* 96px */
  --spacing-section-lg: 8rem;   /* 128px */
}

/* ── Layer 2: shadcn semantic variables → brand tokens ──── */
/* Overrides the neutral base installed in Phase 1 */
:root {
  --background:         255 255 255;
  --foreground:         15 32 108;      /* navy */
  --primary:            15 32 108;      /* navy */
  --primary-foreground: 255 255 255;
  --secondary:          250 192 73;     /* yellow */
  --secondary-foreground: 15 32 108;
  --accent:             236 28 36;      /* red */
  --accent-foreground:  255 255 255;
  --destructive:        236 28 36;
  --muted:              255 243 221;    /* cream */
  --muted-foreground:   100 100 100;
  --border:             229 229 229;
  --ring:               15 32 108;
  --radius:             0.5rem;
}

.dark {
  /* Dark mode tokens — define if needed, else skip for v1 */
}
```

**Critical note:** shadcn's `cssVariables=true` uses HSL channel triplets (e.g. `15 32 108` = hsl(228 77% 24%)) consumed as `hsl(var(--primary))` in component classes. The hex values from PROJECT.md must be converted to HSL triplets. [ASSUMED] — verify the exact channel format shadcn expects by inspecting the generated `globals.css` after Phase 1's `shadcn init`.

#### Applied guidance (for PLAN tasks)

**Task action:** Edit `app/globals.css`. In the `:root` block already created by shadcn init, replace neutral placeholder values with ProActiv brand tokens expressed as HSL triplets. Add the `@theme` block above it to create Tailwind utility aliases (`bg-brand-navy`, `text-brand-red`, etc.). Do NOT touch component files — the CSS variable layer propagates automatically.

**Verification:** Run `pnpm build` — confirm no "unknown utility" warnings. Check that `bg-primary` renders ProActiv navy in the `/_design/` gallery.

---

### Topic 2: Self-Hosted Fonts with next/font/local

#### What the docs say

[VERIFIED: nextjs.org/docs/app/api-reference/components/font — fetched 2026-04-21]

`next/font/local` accepts a `src` string (single file) or array of `{path, weight, style}` objects (multiple weights). Key options for zero-CLS:

| Option | Recommended value | Why |
|--------|-------------------|-----|
| `display` | `'swap'` | Shows fallback immediately; swaps when font loads. Prevents invisible text. |
| `adjustFontFallback` | `'Arial'` (for sans) | next/font auto-generates `size-adjust`, `ascent-override`, `descent-override` CSS to match fallback metrics. Eliminates layout shift on swap. |
| `variable` | `'--font-bloc'` etc. | Exposes font as a CSS variable; applies it globally via `@theme` mapping. |
| `preload` | `true` (default) | Injects `<link rel="preload">` into `<head>` — critical for LCP. |
| `fallback` | `['system-ui', 'sans-serif']` | Cascade for failed load. |

**Multiple-weight pattern for Mont:**

```typescript
// app/fonts.ts
import localFont from 'next/font/local'

export const blocBold = localFont({
  src: './fonts/BlocBold.woff2',
  variable: '--font-bloc',
  display: 'swap',
  weight: '700',
  adjustFontFallback: 'Arial',
  fallback: ['system-ui', 'sans-serif'],
})

export const mont = localFont({
  src: [
    { path: './fonts/Mont-Regular.woff2',   weight: '400', style: 'normal' },
    { path: './fonts/Mont-SemiBold.woff2',  weight: '600', style: 'normal' },
    { path: './fonts/Mont-Bold.woff2',      weight: '700', style: 'normal' },
  ],
  variable: '--font-mont',
  display: 'swap',
  adjustFontFallback: 'Arial',
  fallback: ['system-ui', 'sans-serif'],
})

export const baloo = localFont({
  src: './fonts/Baloo2-Regular.woff2',
  variable: '--font-baloo',
  display: 'swap',
  adjustFontFallback: 'Arial',
  fallback: ['system-ui', 'sans-serif'],
})
```

**Root layout wiring:**

```typescript
// app/layout.tsx (root layout)
import { blocBold, mont, baloo } from './fonts'

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${blocBold.variable} ${mont.variable} ${baloo.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
```

[VERIFIED: nextjs.org/docs/app/api-reference/components/font] Font loaded in the root layout is preloaded on ALL routes. Font loaded only in a specific market layout is preloaded only for that market's routes.

#### display: swap vs display: optional

| `display` | Behavior | CLS risk | LCP risk |
|-----------|----------|----------|----------|
| `swap` | Shows fallback text immediately; swaps when brand font loads | Low (with `adjustFontFallback`) | None |
| `optional` | Shows fallback; uses brand font only if loaded within 100ms; never swaps | Zero CLS | Brand font may never show on slow connections |
| `fallback` | Short block period (100ms), then swap | Low | Same as swap |

**Recommendation:** Use `swap` with `adjustFontFallback: 'Arial'` for all three brand fonts. The `adjustFontFallback` metric matching eliminates the layout shift that `swap` would otherwise cause. `optional` is only appropriate for non-critical decorative fonts.

#### CLS pitfall: applying font-family via class vs CSS variable

[ASSUMED] If `font-family` is applied only via a Tailwind utility class (`font-sans`, `font-display`) and `@theme` resolves to `var(--font-mont)`, the browser must evaluate the CSS variable before knowing which font to load. This creates a FOUC (flash of unstyled content) window. The safer approach is to also apply the `mont.variable` className to `<html>` — which ensures the CSS variable is available synchronously during HTML parse.

#### Font file requirements

[ASSUMED] No font files exist in the repo yet (`assets/brand/fonts/` directory does not exist — verified by checking `assets/brand/`). Phase 2 Wave 0 must include a task to:
1. Confirm licensing for self-hosting Bloc Bold, Mont, and Baloo.
2. Obtain WOFF2 format files (convert from OTF/TTF if needed via `fonttools` or similar).
3. Place files in `app/fonts/` (co-located with layout, per next/font/local recommendation).

#### Applied guidance (for PLAN tasks)

**Task action:** Create `app/fonts/` directory. Add WOFF2 files. Create `app/fonts.ts` with the three font definitions. Update root `app/layout.tsx` to apply all three variable classNames to `<html>`. Remove Geist import from Phase 1's layout — brand fonts replace it. Run Lighthouse on `/_design/` and confirm CLS = 0.0 before closing the task.

---

### Topic 3: shadcn/ui Primitive Library Expansion

#### Stock shadcn vs custom-built

[ASSUMED — training knowledge cross-referenced with shadcn docs structure]

**Available from shadcn registry (install via CLI):**

```bash
pnpm dlx shadcn@latest add button      # already installed Phase 1
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add accordion   # for FAQItem
pnpm dlx shadcn@latest add separator
pnpm dlx shadcn@latest add avatar
pnpm dlx shadcn@latest add sheet       # mobile nav drawer
pnpm dlx shadcn@latest add dialog      # modal / lightbox
pnpm dlx shadcn@latest add tabs
pnpm dlx shadcn@latest add skeleton    # loading states
```

**Custom components built ON shadcn primitives** (not in registry):

| Component | Base primitives | Notes |
|-----------|-----------------|-------|
| `MarketCard` | `Card` | HK/SG market entry card; brand-colored header strip |
| `ProgrammeTile` | `Card` + `Badge` | Programme listing card with age-band badge |
| `TestimonialCard` | `Card` + `Avatar` | Quote + photo; pull from shadcn Card composition |
| `StatStrip` | None (plain div) | Horizontal KPI strip; custom layout, uses brand tokens |
| `LogoWall` | None (plain div) | Scrolling or static logo row; no Radix primitive needed |
| `ContainerEditorial` | None (plain div) | Max-width wrapper with editorial asymmetry |
| `Section` | None (plain div) | Full-width section with `spacing-section-*` padding tokens |

**Pattern for custom components that inherit the token contract:**

```typescript
// components/ui/programme-tile.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ProgrammeTileProps {
  title: string
  ageRange: string
  description: string
  imageSrc: string
  href: string
  className?: string
}

export function ProgrammeTile({
  title, ageRange, description, imageSrc, href, className
}: ProgrammeTileProps) {
  return (
    <Card className={cn('group overflow-hidden', className)}>
      {/* Image slot — next/image fills here */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Image component goes here */}
      </div>
      <CardHeader className="pb-2">
        <Badge variant="secondary" className="w-fit">{ageRange}</Badge>
        <h3 className="font-display text-xl font-bold text-primary">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  )
}
```

All colors (`text-primary`, `text-muted-foreground`, `bg-secondary`) reference the semantic CSS variables from Topic 1, so they automatically pick up the ProActiv brand tokens.

#### Applied guidance (for PLAN tasks)

**Task action:** Run `pnpm dlx shadcn@latest add card badge accordion separator avatar sheet dialog tabs skeleton` in one pass. Confirm each generates a file under `components/ui/`. Then create custom components in `components/ui/` that compose from these primitives. No third-party registries.

---

### Topic 4: Sharp Pipeline for AVIF/WebP + Responsive Images

#### next/image built-in optimization (primary approach)

[VERIFIED: nextjs.org/docs/app/api-reference/components/image — fetched 2026-04-21]
[VERIFIED: vercel.com/docs/image-optimization — fetched 2026-04-22]

Next.js 15 `next/image` with Vercel deployment handles AVIF/WebP **automatically** on a per-request basis:

```typescript
// next.config.ts — enable AVIF + WebP with AVIF preferred
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],  // AVIF tried first, WebP fallback
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 85, 100],
    minimumCacheTTL: 2678400,  // 31 days
    remotePatterns: [
      // Sanity CDN
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
}
```

Vercel caches each optimized image variant at the CDN edge after the first request. AVIF takes ~50% longer to encode than WebP but produces ~20% smaller files — Vercel absorbs the first-request cost; subsequent requests are cached.

**Sizing best practice:**

```tsx
// Hero image — full viewport width on mobile, 50vw on desktop
<Image
  src="/photography/hero-gym.jpg"
  alt="ProGym Wan Chai gymnastics class"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  priority  // deprecated in Next.js 16 — use preload={true} or fetchPriority="high"
  className="object-cover"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

[VERIFIED: nextjs.org Image docs] `priority` is deprecated in Next.js 16 in favor of `preload` prop. Next.js 15 still accepts `priority` — use `preload={true}` for the hero image for forward-compatibility.

#### Sharp as a local preprocessing script (secondary — for 22 GB raw)

[ASSUMED — training knowledge] Sharp is the image processing library Next.js uses internally. For the 22 GB raw photo folder at `/Users/martin/Downloads/ProActive/`, a **one-time local preprocessing script** is appropriate:

```javascript
// scripts/process-photos.mjs
import sharp from 'sharp'
import { glob } from 'glob'
import path from 'path'
import { mkdir } from 'fs/promises'

const INPUT_DIR = '/Users/martin/Downloads/ProActive/01 - PHOTOS to use/'
const OUTPUT_DIR = './public/photography/'
const HERO_WIDTH = 1920
const QUALITY_AVIF = 65   // AVIF can use lower quality for same perceived quality
const QUALITY_WEBP = 80

const files = await glob(`${INPUT_DIR}/**/*.{jpg,jpeg,JPG,png,PNG}`)

for (const file of files) {
  const name = path.basename(file, path.extname(file))
  await mkdir(OUTPUT_DIR, { recursive: true })

  // Hero-tier: resize to 1920px wide, generate AVIF + WebP + JPG fallback
  await sharp(file)
    .resize(HERO_WIDTH, null, { withoutEnlargement: true })
    .avif({ quality: QUALITY_AVIF })
    .toFile(`${OUTPUT_DIR}/${name}.avif`)

  await sharp(file)
    .resize(HERO_WIDTH, null, { withoutEnlargement: true })
    .webp({ quality: QUALITY_WEBP })
    .toFile(`${OUTPUT_DIR}/${name}.webp`)
}
```

**Key decision:** Do NOT put 22 GB of raw source photos into the repo. The preprocessing script runs locally and its output (selected hero-tier photos only) gets committed to `public/photography/` or uploaded to Sanity's media library. The raw source folder remains local.

**Process-once vs on-demand:** Preprocessing is the right approach for the raw folder because:
1. 22 GB cannot live in the repo or Vercel build cache.
2. Sanity handles on-demand optimization for CMS-managed images via its CDN (`cdn.sanity.io` with `?auto=format&w=N`).
3. `next/image` handles on-demand optimization for images in `public/`.

#### Vercel image optimization limits

[VERIFIED: vercel.com/docs/image-optimization] Vercel Hobby plan has image optimization limits. Vercel Pro ($20/month) provides significantly higher limits. Given this is a production client site, Pro is appropriate (already planned for Phase 10). During Phases 1–9 on preview URLs, image optimization is used sparingly — hero images only, not bulk galleries.

#### Applied guidance (for PLAN tasks)

**Task action:** Add `formats: ['image/avif', 'image/webp']` to `next.config.ts` `images` config. Configure `remotePatterns` for `cdn.sanity.io`. Write `scripts/process-photos.mjs` that takes selected hero photos from the raw folder and emits resized AVIF + WebP + JPG to `public/photography/`. Commit only the processed output — never the raw 22 GB source. Document the script in `docs/media-processing.md`.

---

### Topic 5: @mux/mux-player-react Integration

#### Installation and basic setup

[ASSUMED — Mux docs access blocked; training knowledge used; mark for verification]

```bash
pnpm add @mux/mux-player-react
```

`<MuxPlayer>` is a web component wrapped in React. It requires a `"use client"` directive because it uses browser APIs.

**Minimum viable embed:**

```typescript
// components/ui/video-player.tsx
'use client'
import dynamic from 'next/dynamic'

// Dynamic import prevents SSR — mux-player uses CustomElements API
const MuxPlayer = dynamic(
  () => import('@mux/mux-player-react').then(m => m.default ?? m),
  { ssr: false }
)

interface VideoPlayerProps {
  playbackId: string
  title: string
  poster?: string
  autoPlay?: boolean
}

export function VideoPlayer({ playbackId, title, poster, autoPlay = false }: VideoPlayerProps) {
  return (
    <MuxPlayer
      playbackId={playbackId}
      metadata={{ video_title: title }}
      poster={poster}
      muted={autoPlay}    // muted required for autoplay per browser policy
      autoPlay={autoPlay ? 'muted' : false}
      playsInline        // required for iOS inline playback
      loop={autoPlay}    // loop for hero bg videos
      className="w-full aspect-video"
    />
  )
}
```

#### SSR / hydration footgun

[ASSUMED] `@mux/mux-player-react` uses `customElements.define()` internally, which is not available server-side. Without `ssr: false` in `dynamic()`, Next.js will throw a hydration error. The `dynamic import + ssr: false` pattern is the canonical fix.

**Alternative pattern** (simpler for some cases): render a `<video>` tag server-side as a placeholder, client-hydrate with Mux. Overkill for Phase 2.

#### Signed vs public playback IDs

[ASSUMED] Mux offers two playback policy types:
- **Public:** Playback ID can be embedded directly in component props. Safe for marketing videos.
- **Signed:** Requires a short-lived JWT from your server. Use for premium/gated content.

For Phase 2 (hero videos and camp clips for the `/_design/` gallery), **public playback policy** is appropriate. Signed tokens are a Phase 6+ concern if Mux-hosted content becomes gated.

#### Mobile autoplay rules

[ASSUMED] All major mobile browsers allow autoplay ONLY when:
1. Video is `muted={true}`
2. `playsInline` is set (iOS Safari requirement)

Strategy PART 14.5 specifies "hero videos: 8–12s loops, silent, never autoplay sound." This aligns perfectly — hero bg videos use `autoPlay="muted"` + `muted` + `loop` + `playsInline`.

#### Captions / accessibility

[ASSUMED] Mux supports captions via the Mux dashboard (upload SRT/VTT track). The player renders them via the `<track>` element. For Phase 2, placeholder captions are acceptable; real captions per WCAG 2.2 AA (strategy PART 7 SEO-08) are Phase 7 work.

#### LCP impact

Strategy requires LCP < 2.5s. Mux player should be:
1. Below the fold on primary pages (use `loading="lazy"` equivalent — `MuxPlayer` handles this internally).
2. Replaced with a static poster image `<Image>` above the fold that fades into the player on interaction (progressive enhancement pattern).

The `/_design/` gallery is not a production LCP surface — performance constraints don't apply there.

#### Mux plan requirements

[ASSUMED — needs-verification] Mux offers a free tier. For Phase 2 (handful of camp/gym videos uploaded for gallery + hero), the free tier is likely sufficient. Production usage across three market sites with real traffic will likely require a paid plan. Confirm with Martin before Phase 2 execution.

#### Applied guidance (for PLAN tasks)

**Task action:** Install `@mux/mux-player-react`. Create `components/ui/video-player.tsx` with `dynamic` import + `ssr: false`. Upload 1–2 sample camp clips to Mux dashboard, get public playback IDs. Wire into `/_design/` gallery. Verify no hydration errors in dev mode. Verify poster image appears immediately before player hydrates.

---

### Topic 6: `/_design/` Gallery Route Gating

#### Gating options

| Approach | How | Trade-offs |
|----------|-----|------------|
| **Env-based conditional** | Check `process.env.VERCEL_ENV !== 'production'` in the page component | Simplest; safe; no middleware change; page returns 404 in production |
| Middleware route block | Add `/_design/` to middleware 404 rule | Works but requires touching middleware — creates coupling |
| Basic Auth middleware | Custom `Authorization` header check | More complex; overkill for an internal gallery |
| Vercel preview-only password | Vercel Deployment Protection | Already active on all preview URLs — no additional gate needed |

**Recommended: env-based conditional with 404 fallback**

```typescript
// app/_design/page.tsx
import { notFound } from 'next/navigation'

export default function DesignGallery() {
  // Return 404 in production — gallery is dev/preview only
  if (process.env.VERCEL_ENV === 'production') {
    notFound()
  }

  return (
    <main>
      {/* Component gallery */}
    </main>
  )
}
```

This pattern is safe because:
1. Phase 1's `X-Robots-Tag: noindex, nofollow` on non-production responses already prevents indexing.
2. Vercel Deployment Protection gates all preview URLs from public access.
3. `notFound()` in production returns a 404, preventing any accidental exposure.

[ASSUMED] No change to `middleware.ts` required — `/_design/` is not a market-specific route and doesn't need subdomain routing.

#### Applied guidance (for PLAN tasks)

**Task action:** Create `app/(root)/_design/page.tsx` (place under root route group). Add `notFound()` guard behind `VERCEL_ENV === 'production'` check. Add a layout that renders a simple sidebar nav linking to each primitive section. No auth middleware needed.

---

### Topic 7: Known Pitfalls

#### Pitfall 1: Tailwind v4 `@theme` wipes shadcn neutrals if `--color-*: initial` is used

**What goes wrong:** Using `--color-*: initial` inside `@theme` resets ALL Tailwind default colors. shadcn components use `bg-background`, `text-foreground`, etc. which resolve via CSS variables — not via Tailwind utilities. These still work. But if any developer writes `bg-slate-100` in a component, it breaks after the reset.

**How to avoid:** Do NOT use `--color-*: initial`. Instead, ADD ProActiv colors alongside the defaults. Only the semantic shadcn variables (`--primary`, `--foreground`, etc.) need to be overridden — these are in `:root {}`, not `@theme {}`.

**Warning sign:** Any `bg-slate-*`, `text-gray-*`, `border-zinc-*` class stops working.

---

#### Pitfall 2: next/font/local CLS from missing `adjustFontFallback`

**What goes wrong:** Without `adjustFontFallback`, the system fallback font (e.g., Arial) has different metrics (line height, character width) than the brand font. When the brand font loads and `swap` kicks in, text reflows and CLS spikes.

**How to avoid:** Always specify `adjustFontFallback: 'Arial'` for sans-serif fonts (Bloc Bold, Mont). next/font generates `size-adjust`, `ascent-override`, `descent-override` CSS descriptors automatically to pre-match the fallback to the brand font's metrics.

**Warning sign:** CLS score > 0 on `/_design/` Lighthouse run despite using `next/font/local`.

---

#### Pitfall 3: Mux player hydration error — "customElements is not defined"

**What goes wrong:** `@mux/mux-player-react` calls `customElements.define()` on import. SSR doesn't have `customElements`. If imported without `dynamic(..., { ssr: false })`, Next.js throws a server-side error and the page fails to render.

**How to avoid:** Always import `MuxPlayer` via `dynamic` with `ssr: false`. Never import it at the top level of a Server Component.

**Warning sign:** Build-time or runtime error "customElements is not defined" or "window is not defined".

---

#### Pitfall 4: Sharp + Vercel build-time memory limits

**What goes wrong:** If Sharp is added as a dependency that runs during `next build` (e.g., via a custom webpack config or `getStaticProps`), Vercel's build container (512MB RAM on Hobby, 4GB on Pro) may OOM on large images.

**How to avoid:** Sharp should ONLY run in local preprocessing scripts — never in the Next.js build pipeline. All processed images land in `public/` or Sanity before deployment. Vercel's image optimization API handles runtime resizing.

**Warning sign:** Vercel build exits with `SIGKILL` or out-of-memory during image processing.

---

#### Pitfall 5: WCAG AA contrast — navy `#0f206c` on dark surfaces

**What goes wrong:** ProActiv navy `#0f206c` has very high contrast on white (15.8:1 — excellent). But on shadcn's `--muted` (cream `#fff3dd`), it's ~14:1 — still fine. The trap is using yellow `#fac049` as a text color on white — yellow-on-white fails WCAG AA (2.2:1 contrast ratio, needs 4.5:1 for normal text).

**How to avoid:**
- Never use `#fac049` (yellow) as a text color on light backgrounds. Reserve yellow for background fills with dark text on top.
- Always test with `#0f9733` (green) on white (5.3:1 — passes AA for large text; marginal for body text).
- Red `#ec1c24` on white: 4.7:1 — passes AA for normal text.
- Use the WCAG contrast checker at `contrast-ratio.com` or browser DevTools accessibility inspector for each new color combination.

**Warning sign:** Lighthouse accessibility score < 90 on `/_design/`.

---

#### Pitfall 6: `display: swap` FOUT on first page load (perceived brand misalignment)

**What goes wrong:** On slow connections, the system font renders for 0.5–2s before Bloc Bold loads. If the fallback font is very different (e.g., Times New Roman vs Bloc Bold), the headline appearance changes dramatically — alarming for a premium brand.

**How to avoid:** `adjustFontFallback: 'Arial'` minimizes the visual delta. Additionally, ensure `preload: true` (default) — the font starts downloading before the browser renders the page, shrinking the swap window. On Vercel, font files are served from the edge with high cache TTL, so repeat visits have zero FOUT.

**Warning sign:** Headline visibly "jumps" in style on first load in Lighthouse throttled simulation.

---

#### Pitfall 7: `next/image` `priority` deprecation in Next.js 16

**What goes wrong:** The docs confirm `priority` is deprecated in Next.js 16 (current project is on 15.5.15). If the codebase uses `priority`, a future upgrade to Next.js 16 triggers deprecation warnings.

**How to avoid:** Use `preload={true}` for above-the-fold hero images, or `fetchPriority="high"` + `loading="eager"`. These are the Next.js 16 equivalents. Prefer these now to avoid a phase-16 refactor.

---

## Open Questions

- **Q1: Are Bloc Bold, Mont, and Baloo licensed for self-hosting on `proactivsports.com`?**
  What we know: These are named in PROJECT.md as the ProActiv brand typography stack. Bloc Bold is a commercial font (Zetafonts); Mont is a commercial font (Fontfabric). Baloo is Google Fonts (OFL license — free for self-hosting).
  What's unclear: Whether the client holds a web license for Bloc Bold and Mont that permits self-hosting on the Vercel domain.
  Recommendation: Confirm with Martin before Phase 2 executes. If Bloc Bold/Mont licenses are missing, identify a licensed alternative (e.g., Inter or Plus Jakarta Sans as Mont substitute; Bebas Neue as a Bloc Bold substitute — both free). This is a Phase 2 blocker.

- **Q2: Where are the font files? Are they in `.planning/inputs/` or do they need to be obtained?**
  What we know: No font files were found in `assets/brand/fonts/` — the directory does not exist.
  What's unclear: Whether Martin has font files locally (from client brand assets) or needs to purchase/download them.
  Recommendation: Martin confirms file locations before Wave 0 starts. If files are on local disk, they need to be added to `app/fonts/` before the font wiring task can complete.

- **Q3: Which of the ~10 custom components need custom implementations vs stock shadcn?**
  What we know: Button, Card, Accordion, Badge, Avatar are stock shadcn. MarketCard, ProgrammeTile, TestimonialCard, StatStrip, LogoWall are custom.
  What's unclear: Whether `Section` and `ContainerEditorial` should be separate components or just Tailwind utility classes applied inline.
  Recommendation: Treat Section and ContainerEditorial as lightweight wrapper components with typed props (`className`, `children`, optional `as` for semantic HTML) — easier for Phase 3–5 page authors to use consistently than remembering the right Tailwind class combination.

- **Q4: Does Mux require a paid plan for Phase 2 video count, or is the free tier sufficient?**
  What we know: Mux free tier allows a limited number of assets and delivery bandwidth. Phase 2 needs ~3–5 videos for the design gallery (hero loop + 1–2 camp clips).
  What's unclear: Current Mux free tier limits (bandwidth, storage, encoding minutes).
  Recommendation: Martin checks the Mux dashboard for current free tier limits. If 3–5 short videos stay under the limit, free tier is fine for Phase 2. Production launch (Phase 10) likely requires a paid plan.

- **Q5: Where does the 22 GB raw photo folder live, and is it on Martin's local machine?**
  What we know: MEDIA-INVENTORY.md documents the source as `/Users/martin/Downloads/ProActive/` — confirming it is on Martin's local machine.
  What's unclear: Whether a selection of hero-tier photos has already been identified, or whether Phase 2 includes a curation task.
  Recommendation: Phase 2 plan should include a curator task: Martin reviews the `01 - PHOTOS to use/` folder, selects 10–15 hero-tier images (one per major page type), runs them through the preprocessing script, and commits processed outputs. The full 22 GB raw folder is never in the repo.

---

## References

### Primary (HIGH confidence — official docs verified in this session)

- [Next.js 15 Image Component API](https://nextjs.org/docs/app/api-reference/components/image) — fetched 2026-04-21; covers formats, deviceSizes, imageSizes, qualities, `preload`, `priority` deprecation
- [Next.js Font Module API](https://nextjs.org/docs/app/api-reference/components/font) — fetched 2026-04-21; covers `localFont`, `adjustFontFallback`, `variable`, `display`, preloading behavior
- [Tailwind CSS v4 @theme directive](https://tailwindcss.com/docs/theme) — fetched 2026-04-22; covers namespace conventions, utility generation, override vs extend
- [Tailwind CSS v4 adding custom styles](https://tailwindcss.com/docs/adding-custom-styles) — fetched 2026-04-22; examples for color and font tokens
- [Vercel Image Optimization](https://vercel.com/docs/image-optimization) — fetched 2026-04-22; covers CDN caching, AVIF/WebP support, plan limits
- [Next.js Image Optimization guide](https://nextjs.org/docs/app/building-your-application/optimizing/images) — fetched 2026-04-22; remotePatterns, responsive best practices

### Secondary (MEDIUM confidence — partially verified)

- shadcn/ui `cssVariables=true` + Tailwind v4 interaction — inferred from Tailwind v4 docs (CSS variable compatibility confirmed) + training knowledge of shadcn's HSL triplet format
- Sharp preprocessing script pattern — training knowledge; Sharp API stable; cross-referenced with Next.js image docs

### Tertiary (LOW confidence — assumed from training, not verified in session)

- `@mux/mux-player-react` SSR/hydration behavior — Mux docs were inaccessible; pattern from training knowledge; **verify against official Mux docs at execution time**
- Mux playback policy types (public vs signed) — training knowledge
- Mux free tier limits — training knowledge; **verify in Mux dashboard before Phase 2**
- shadcn component names for `pnpm dlx shadcn@latest add` — training knowledge; run `pnpm dlx shadcn@latest add --help` or check `ui.shadcn.com/components` at execution time

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | shadcn uses HSL triplets (not hex) for CSS variables in `cssVariables=true` mode | Topic 1 | Token override values formatted wrong; components render incorrect colors |
| A2 | `@mux/mux-player-react` requires `dynamic(..., { ssr: false })` in Next.js 15 | Topic 5 | Hydration error on SSR; page fails to render; must add dynamic import |
| A3 | Mux free tier sufficient for 3–5 Phase 2 gallery videos | Topic 5 | Video upload blocked; need paid plan before Phase 2 completes |
| A4 | Bloc Bold and Mont require commercial licenses for web self-hosting | Topic 2 / Open Q1 | Font files not usable; need alternative font selection; Phase 2 design changes |
| A5 | No font files exist in repo yet — must be obtained before execution | Topic 2 / Open Q2 | Wave 0 blocked; cannot start font wiring task without files |
| A6 | Section and ContainerEditorial should be typed wrapper components | Topic 3 / Open Q3 | Minor; can be plain divs if simpler; planner can decide |
| A7 | Sharp preprocessing script runs locally only, not in Vercel build | Topic 4 | If Sharp is accidentally added to build pipeline, Vercel OOM on large images |

---

## Validation Architecture

### Test Framework (inheriting from Phase 1)

| Property | Value |
|----------|-------|
| Framework | Vitest (installed Phase 1) + `@vitejs/plugin-react` (added Phase 2) + jsdom |
| Config file | `vitest.config.ts` (Phase 1 installed; Phase 2 expands to component tests) |
| Quick run command | `pnpm test:unit` |
| Full suite command | `pnpm test:unit --coverage` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DS-01 | Brand tokens render correct hex via CSS vars | Visual / Lighthouse audit | Manual Lighthouse on `/_design/` | — |
| DS-02 | Fonts load zero CLS on `/_design/` | Lighthouse CLS = 0 | `pnpm run lighthouse /_design/` | ❌ Wave 0 |
| DS-03 | Each primitive renders without errors | Unit (component smoke) | `pnpm test:unit src/components/ui/` | ❌ Wave 0 |
| DS-04 | `<Image>` emits AVIF in Accept:image/avif request | Integration | Manual curl check or Playwright | ❌ Wave 0 |
| DS-05 | `/_design/` renders all primitives, 404s in production | Unit | `pnpm test:unit app/_design/` | ❌ Wave 0 |
| DS-06 | Keyboard nav + WCAG AA on `/_design/` | Accessibility audit | `npx axe http://localhost:3000/_design/` | ❌ Wave 0 |

### Wave 0 Gaps

- [ ] `vitest.config.ts` — expand from middleware-only to include `@vitejs/plugin-react` + jsdom
- [ ] `tests/components/ui/` directory — smoke tests for each primitive
- [ ] Lighthouse CI config or manual Lighthouse script for `/_design/`
- [ ] Font WOFF2 files in `app/fonts/` — prerequisite for DS-02

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Sharp script, pnpm | ✓ (constrained to >=22 by engines) | ^22 | — |
| pnpm | Package management | ✓ | 10.30.3 | — |
| Mux account | Video upload | [needs-verification] | — | Skip video primitive; stub with poster image |
| Font files (Bloc Bold, Mont, Baloo) | DS-02 font wiring | [needs-verification] | — | Use Inter/Geist with brand colors as interim |
| 22 GB raw photos folder | Media processing | ✓ (local at /Users/martin/Downloads/ProActive/) | — | Use placeholder images |

**Missing dependencies with no fallback:**
- Font files are a blocker for DS-02. Phase 2 cannot deliver zero-CLS brand typography without the WOFF2 files.

**Missing dependencies with fallback:**
- Mux account: if free tier is insufficient, use a `<video>` HTML tag with a local file as a placeholder in the gallery, then swap to Mux in Phase 3.

---

## Security Domain

Phase 2 is design system work — no new API routes, no auth surfaces, no user data handling. ASVS considerations are minimal:

| ASVS Category | Applies | Notes |
|---------------|---------|-------|
| V5 Input Validation | No | No forms in Phase 2 |
| V6 Cryptography | No | No crypto in Phase 2 |
| V4 Access Control | Partial | `/_design/` gating via env check — not a security boundary, just a convenience gate. Vercel Deployment Protection is the real auth for preview URLs. |

No security blockers for Phase 2.

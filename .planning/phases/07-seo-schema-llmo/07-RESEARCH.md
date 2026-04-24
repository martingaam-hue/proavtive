# Phase 7: SEO, Schema, and LLMO Implementation — Research

**Researched:** 2026-04-24
**Domain:** Next.js 15 App Router SEO — metadata, sitemap, robots, llms.txt, JSON-LD, Lighthouse 95+, WCAG 2.2 AA
**Confidence:** HIGH (codebase verified, Next.js docs verified via Context7, pattern verified against live app structure)

---

## Summary

Phase 7 is a cross-cutting overlay across all three route trees (root, hk, sg). Rather than building new pages, it wires correct metadata, typed JSON-LD helpers, per-property sitemaps and robots files, llms.txt/llms-full.txt LLMO files, and then executes a performance + accessibility audit pass to hit Lighthouse 95+ mobile and WCAG 2.2 AA.

Critically, the codebase already has a solid foundation: Phases 3 and 4 hardcoded `export const metadata` with correct `openGraph`, `alternates.canonical`, and inline JSON-LD objects on ~20 pages. Several schema types are already present (Organization, WebSite, FAQPage, SportsActivityLocation, BreadcrumbList, Person). Phase 7's job is to (a) extend this coverage to sg/*, remaining root/* pages, and blog/camp/event contexts; (b) add the four new file-based SEO routes (sitemap, robots, llms.txt per property); (c) convert Sanity-driven pages to `generateMetadata`; and (d) close the performance and accessibility gaps.

The largest architectural challenge is the middleware routing design: `robots.txt`, `sitemap.xml`, and `llms.txt` are intercepted by the subdomain middleware unless they are explicitly excluded from the matcher. The solution is to add `sitemap.xml`, `robots.txt`, `llms.txt`, and `llms-full.txt` to the middleware `config.matcher` negative-lookahead, then serve them from per-market route handlers at `app/root/sitemap.ts`, `app/hk/sitemap.ts`, `app/sg/sitemap.ts` (and equivalent robots/llms paths). Each handler uses the production origin constant (`process.env.NEXT_PUBLIC_*_URL`) so URLs emit production-canonical domains even when served from Vercel preview.

**Primary recommendation:** Add sitemap/robots/llms.txt exclusions to the middleware matcher first (Wave 0 task), then build all SEO routes and helpers, then do the audit pass. Do not attempt Lighthouse optimisation before all routes are correct.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEO-01 | Per-page `<head>` metadata (title, description, OG, Twitter card) sourced from CMS fields with sane fallbacks; title-tag options per strategy PART 7.1 | `generateMetadata` + Sanity GROQ fetch pattern; static `export const metadata` for non-CMS pages |
| SEO-02 | XML sitemaps per property (root, hk, sg) + sitemap index at root | Next.js `MetadataRoute.Sitemap` API in per-market route handlers; middleware exclusion required |
| SEO-03 | `robots.txt` per property — root allows all, hk/sg allow all | Next.js `MetadataRoute.Robots` API; middleware exclusion required; production/preview conditional |
| SEO-04 | `llms.txt` + `llms-full.txt` per property at build/ISR per llmstxt.org spec | Route handlers at `app/{market}/llms.txt/route.ts`; `force-static` export + ISR revalidation |
| SEO-05 | JSON-LD per page: Organization, LocalBusiness (3 locations), FAQPage, Event, BreadcrumbList, VideoObject, Person — per strategy PART 9 | Typed helper functions in `lib/schema.ts`; inline `<script type="application/ld+json">` pattern already established |
| SEO-06 | Lighthouse mobile ≥ 95 on root `/`, hk `/`, sg `/`, all 3 location pages, all pillar pages | `next/image` priority on hero, font preload, RSC minimises client JS, Mux player `dynamic({ ssr:false })` |
| SEO-07 | Core Web Vitals green (LCP < 2.5s, INP < 200ms, CLS < 0.1) on the same page set | Same as SEO-06; font `display:swap` already wired; image `sizes` attributes needed; Suspense boundaries for INP |
| SEO-08 | Crawl-friendly: semantic HTML, h1 per page, breadcrumbs, no JS-blocked content; WCAG 2.2 AA | Skip-link already present; focus ring already coded in layouts; heading audit + axe-core check needed |
</phase_requirements>

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Page metadata (title, OG) | Frontend Server (SSR/RSC) | — | `export const metadata` or `generateMetadata` runs at build/request time in Next.js App Router — never client-side |
| JSON-LD schema injection | Frontend Server (RSC) | — | `<script>` tag injected by Server Component; no JS cost to client |
| sitemap.xml per property | Frontend Server (Route Handler) | — | `sitemap.ts` is a cached Route Handler; must bypass middleware matcher |
| robots.txt per property | Frontend Server (Route Handler) | — | Same as sitemap; single file at `app/robots.ts` using host header to branch |
| llms.txt / llms-full.txt | Frontend Server (Route Handler) | Sanity (content source) | Route handler with ISR; content drawn from Sanity at revalidate interval |
| Image optimization | CDN / Static | Frontend Server | `next/image` serves AVIF/WebP from Vercel Edge; already configured |
| Font loading (CLS prevention) | Frontend Server | CDN | `next/font/google` already wired with `display:swap`; preconnect injected |
| Accessibility (focus, ARIA) | Browser / Client | Frontend Server | DOM structure is server-rendered but focus rings and keyboard behaviour are browser-evaluated |
| Lighthouse performance audit | Browser / Client | — | Run against deployed preview URL; cold-cache measurement |

---

## Standard Stack

### Core (already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 15.5.15 | `generateMetadata`, `MetadataRoute.Sitemap`, `MetadataRoute.Robots` APIs | First-class SEO primitives; avoids third-party sitemap libraries |
| next-sanity | ^11.6.13 | Sanity GROQ fetching for `generateMetadata` on CMS-driven pages | Already installed; `client.fetch` + `draftMode()` pattern |
| typescript | ^5 | Typed `Metadata`, `MetadataRoute.Sitemap`, `MetadataRoute.Robots` types | Catches missing required fields at build |

### Supporting (already installed, no new installs)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @testing-library/react | ^16.3.2 | Unit tests for JSON-LD helper output | Testing typed schema builders |
| vitest | ^4.1.5 | Test runner already wired in CI | All schema and metadata unit tests |

### New installs required

| Package | Purpose | Notes |
|---------|---------|-------|
| `@axe-core/react` (dev only) | Automated a11y scanning in dev mode | Optional — lightweight, surfaces WCAG violations in browser console. `^4.10.x` [VERIFIED: npm registry] |
| No other new packages needed | All sitemap/robots/metadata primitives are built into Next.js 15 | — |

**Installation (one new package):**
```bash
pnpm add -D @axe-core/react
```

**Version verification:**
```bash
npm view @axe-core/react version  # 4.10.2 as of 2026-04-24
```

---

## Architecture Patterns

### System Architecture Diagram

```
                         HTTP Request
                              |
                    ┌─────────▼──────────┐
                    │  Middleware.ts      │
                    │  (Host → market)   │
                    │  Excludes:         │
                    │  sitemap.xml       │
                    │  robots.txt        │
                    │  llms.txt          │
                    │  llms-full.txt     │
                    └─┬────────┬────────┘
                      │        │
           SEO files  │        │  Market pages
           (bypass)   │        │  (rewrite → app/{market}/*)
                      │        │
          ┌───────────▼─┐  ┌───▼────────────────────────┐
          │ Route Handler│  │  Per-market page trees     │
          │ app/root/    │  │  app/root/* app/hk/* app/sg/│
          │   sitemap.ts │  │                             │
          │   robots.ts  │  │  export const metadata = { │
          │   llms.txt/  │  │    title, description, OG  │
          │   route.ts   │  │    alternates.canonical    │
          │ app/hk/      │  │  }                         │
          │   sitemap.ts │  │                             │
          │   robots.ts  │  │  export async function     │
          │   llms.txt/  │  │  generateMetadata({params})│
          │   route.ts   │  │  → fetch Sanity GROQ       │
          │ app/sg/      │  │                             │
          │   sitemap.ts │  │  <script type="ld+json">   │
          │   robots.ts  │  │  JSON.stringify(schema)    │
          │   llms.txt/  │  │  </script>                 │
          │   route.ts   │  │                             │
          └─────────────┘  └─────────────────────────────┘
                                         │
                              ┌──────────▼──────────┐
                              │  Sanity CMS         │
                              │  - seoTitle         │
                              │  - seoDescription   │
                              │  - seoImage         │
                              │  - slug             │
                              │  - Camp dates/offer │
                              └─────────────────────┘
```

### Recommended Project Structure (Phase 7 additions)

```
app/
├── root/
│   ├── sitemap.ts           # root property sitemap
│   ├── robots.ts            # root robots.txt
│   ├── llms.txt/
│   │   └── route.ts         # llms.txt handler (force-static + ISR)
│   └── llms-full.txt/
│       └── route.ts         # llms-full.txt handler
├── hk/
│   ├── sitemap.ts           # hk property sitemap
│   ├── robots.ts            # hk robots.txt
│   ├── llms.txt/
│   │   └── route.ts
│   └── llms-full.txt/
│       └── route.ts
├── sg/
│   ├── sitemap.ts           # sg property sitemap
│   ├── robots.ts
│   ├── llms.txt/
│   │   └── route.ts
│   └── llms-full.txt/
│       └── route.ts
lib/
├── schema.ts                # typed JSON-LD helper functions
├── hk-data.ts               # already exists — schema helpers consume this
└── sg-data.ts               # mirror of hk-data for SG (created in Phase 5 — may need extension)
middleware.ts                # ADD sitemap.xml|robots.txt|llms.txt|llms-full.txt to matcher exclusion
```

### Pattern 1: Middleware Exclusion for SEO Files

**What:** Add `sitemap\.xml|robots\.txt|llms\.txt|llms-full\.txt` to the middleware matcher negative lookahead so these files are served by their App Router handlers directly.

**When to use:** Required for ALL sitemap/robots/llms.txt routes to function correctly.

```typescript
// Source: middleware.ts — existing matcher, amended
export const config = {
  matcher: [
    "/((?!_next/|_design|api/health|favicon\\.ico|monitoring|studio|sitemap\\.xml|robots\\.txt|llms\\.txt|llms-full\\.txt|.*\\.(?:svg|png|jpg|jpeg|webp|avif|ico|gif|woff2?)).*)",
  ],
};
```

**Why:** The middleware rewrites `/sitemap.xml` → `/root/sitemap.xml` (or `/hk/sitemap.xml`) which does not match the App Router's `app/root/sitemap.ts` handler path. The middleware must bypass these routes entirely.

### Pattern 2: Per-Market Sitemap Handler

**What:** Each market tree exports a `sitemap.ts` that produces URLs hardcoded to that market's production origin. Route handlers are cached by default (build-time static) unless `export const dynamic = 'force-dynamic'` is set.

**When to use:** All three properties need independent sitemaps.

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap [CITED]
// app/hk/sitemap.ts
import type { MetadataRoute } from 'next'

const HK_ORIGIN = 'https://hk.proactivsports.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${HK_ORIGIN}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${HK_ORIGIN}/wan-chai/`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${HK_ORIGIN}/cyberport/`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${HK_ORIGIN}/gymnastics/`, changeFrequency: 'monthly', priority: 0.8 },
    // ... all HK pillar and sub-pages
  ]
}
```

**Key point:** The `sitemap.ts` file placed at `app/hk/sitemap.ts` maps to the URL `/hk/sitemap.xml` after middleware rewrite — but since the middleware will be excluding `sitemap.xml`, the router sees `app/hk/sitemap.ts` as a special metadata file. In Next.js App Router, a `sitemap.ts` nested inside a route segment generates a sitemap URL at that route segment's path. For the market routing architecture (where `/hk/*` is an internal rewrite target, not a public URL), the sitemap handler must still use absolute production origin URLs in all `url` fields regardless of where the file lives on disk.

**Alternative approach (simpler):** Since robots/sitemap need to respond to the public URL (e.g., `hk.proactivsports.com/sitemap.xml`), and the middleware maps `hk.*` → `/hk/*` internally, placing `sitemap.ts` at `app/hk/sitemap.ts` means it serves at `/hk/sitemap.xml` (the rewritten internal path). A request for `hk.proactivsports.com/sitemap.xml` gets rewritten by middleware to `/hk/sitemap.xml`, which matches `app/hk/sitemap.ts`. **This is the correct approach** — the middleware exclusion is NOT needed for sitemap/robots if we embrace the rewrite architecture consistently and exclude only `llms.txt`/`llms-full.txt` (which are not standard Next.js metadata routes and must use Route Handlers).

```
hk.proactivsports.com/sitemap.xml
  → middleware rewrites to /hk/sitemap.xml
  → matches app/hk/sitemap.ts ✓

hk.proactivsports.com/robots.txt
  → middleware rewrites to /hk/robots.txt
  → matches app/hk/robots.ts ✓

hk.proactivsports.com/llms.txt
  → middleware rewrites to /hk/llms.txt
  → BUT app/hk/llms.txt/route.ts serves at /hk/llms.txt ✓
```

**Verified:** The `sitemap.ts` and `robots.ts` metadata conventions ARE handled via the middleware rewrite because they are detected by file name (not URL pattern). The middleware exclusion is optional but makes the behaviour more explicit. Add them to the exclusion list for defence-in-depth.

### Pattern 3: Per-Market robots.ts

**What:** Each market tree exports a `robots.ts` that returns `MetadataRoute.Robots` with the correct sitemap URL for that property.

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots [CITED]
// app/hk/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://hk.proactivsports.com/sitemap.xml',
    host: 'hk.proactivsports.com',
  }
}
```

**Note on preview environments:** The `X-Robots-Tag: noindex, nofollow` header is set by `next.config.ts` on non-production deploys (Phase 0). The `robots.ts` file should still emit `allow: '/'` even in preview — the header-level noindex is sufficient. This prevents accidentally shipping a disallow-all robots.txt.

### Pattern 4: llms.txt / llms-full.txt Route Handlers

**What:** The llmstxt.org spec requires files at `/llms.txt` and optionally `/llms-full.txt`. These are NOT standard Next.js metadata routes, so use App Router Route Handlers with `export const revalidate = 86400` for ISR.

**When to use:** All three properties. Content for llms.txt is static/semi-static (brand facts, page inventory). llms-full.txt includes Sanity-fetched blog and programme content.

```typescript
// Source: llmstxt.org spec [CITED], Next.js Route Handler docs [CITED]
// app/hk/llms.txt/route.ts
export const revalidate = 86400 // 24h ISR

export async function GET() {
  const content = `# ProActiv Sports Hong Kong

> ProActiv Sports is a children's gymnastics and sports specialist, operating in Hong Kong since 2011. ProGym Wan Chai (15/F The Hennessy, 256 Hennessy Road) and ProGym Cyberport (5,000 sq ft, opened August 2025) offer weekly classes, holiday camps, birthday parties, competitive pathways and school partnerships for children aged 2 to 16.

## Programmes
- [Gymnastics](https://hk.proactivsports.com/gymnastics/): Structured weekly gymnastics for ages 12 months to adult
- [Holiday Camps](https://hk.proactivsports.com/holiday-camps/): Easter, Summer and Christmas camp programmes
- [Birthday Parties](https://hk.proactivsports.com/birthday-parties/): Exclusive venue hire, coach-hosted
- [Book a Free Trial](https://hk.proactivsports.com/book-a-trial/): Free 30-minute assessment for new students

## Venues
- [ProGym Wan Chai](https://hk.proactivsports.com/wan-chai/): 15/F The Hennessy, 256 Hennessy Road, Wan Chai
- [ProGym Cyberport](https://hk.proactivsports.com/cyberport/): 5,000 sq ft purpose-built venue, opened 2025

## Coaches
- [Hong Kong Team](https://hk.proactivsports.com/coaches/): Led by Director of Sports Monica

## Optional
- [Blog](https://hk.proactivsports.com/blog/): Editorial content for Hong Kong families
- [FAQ](https://hk.proactivsports.com/faq/): Frequently asked questions
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  })
}
```

**llmstxt.org spec requirements (verified):** [CITED: llmstxt.org]
- H1 heading with site/property name (required)
- Blockquote summary paragraph (strongly recommended)
- H2 sections with markdown link lists (`[Title](URL): description`)
- `## Optional` section for secondary content (can be skipped by LLMs with context limits)
- No H3 or deeper headings
- No HTML, no images — pure Markdown only

**llms-full.txt:** Same structure but expands link sections with full page content as clean Markdown. For Phase 7, populate from static data (hk-data.ts, sg-data.ts). In Phase 6+ when Sanity is live, swap to GROQ-fetched content.

### Pattern 5: Typed JSON-LD Helpers

**What:** A `lib/schema.ts` module with typed builder functions for each schema type. Pages import and call these to ensure consistent, DRY schema objects.

**When to use:** Everywhere JSON-LD is needed. Eliminates copy-paste drift between pages.

```typescript
// lib/schema.ts — typed helpers (ASSUMED pattern; standard practice)
import type { Thing, WithContext } from 'schema-dts'

// Organization (root only)
export function buildOrganizationSchema(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://proactivsports.com/#organization',
    name: 'ProActiv Sports',
    url: 'https://proactivsports.com/',
    logo: 'https://proactivsports.com/assets/logo.svg',
    foundingDate: '2011',
    // ...
  }
}

// BreadcrumbList
export function buildBreadcrumbs(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
```

**Note on `schema-dts`:** This npm package provides TypeScript types for all schema.org types. Optional but valuable for type safety. `npm view schema-dts version` → `1.1.2` [VERIFIED: npm registry]. Install with `pnpm add -D schema-dts`.

### Pattern 6: generateMetadata from Sanity (CMS-driven pages)

**What:** For blog posts, camp pages, and coach bios managed in Sanity (Phase 6+), use `generateMetadata` to fetch SEO fields at request/build time.

```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata [CITED]
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = await sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      seoTitle, seoDescription, seoImage { asset->{ url } }
    }`,
    { slug }
  )
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription,
    openGraph: {
      title: post.seoTitle ?? post.title,
      images: post.seoImage ? [{ url: post.seoImage.asset.url }] : [],
    },
  }
}
```

**Phase 7 scope note:** Phase 6 (Sanity CMS) is a dependency. For Phase 7, blog/camp pages may still be stub-only; `generateMetadata` should be scaffolded with graceful fallbacks for null Sanity data.

### Pattern 7: JSON-LD for SG pages (not yet implemented)

The SG page tree is currently a Phase 1 placeholder. Phase 7 must add schema to `app/sg/page.tsx` (SG homepage) and any SG pages that exist by the time Phase 7 executes. At minimum: SportsActivityLocation for Katong Point, FAQPage on SG homepage, Person for SG coaches, BreadcrumbList on all sub-pages.

**SG-specific schema ID:** `https://sg.proactivsports.com/#localbusiness-katong`

### Anti-Patterns to Avoid

- **AggregateRating without visible reviews:** Strategy PART 9.2 explicitly forbids this. Google penalises self-serving review schema. Only wire if a Review collection exists and is displayed.
- **Course schema for gymnastics programmes:** Use `Service` or `SportsEvent`. Strategy PART 9.2 says Course is wrong type.
- **Duplicate FAQPage answers:** Schema answer text MUST match visible `<FAQItem>` answer text verbatim. Drift between them causes rich-result rejection.
- **MedicalBusiness or HealthAndBeautyBusiness schema:** Wrong type. Use `SportsActivityLocation` (a subtype of `LocalBusiness`).
- **robots.ts disallow-all on preview URLs:** The Phase 0 `X-Robots-Tag` header is the correct mechanism for preview noindex — `robots.ts` should always emit `allow: '/'`.
- **Sitemap URLs without trailing slashes when pages use trailing slashes:** Canonical URLs in the sitemap must match the `alternates.canonical` on each page.
- **llms.txt with H3 headings:** Spec violation — only H1 (site name) and H2 (section names) are permitted.
- **schema-dts imported client-side:** The helpers are Server Component utilities. Never import in a `'use client'` component.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sitemap XML generation | Custom XML template strings | `MetadataRoute.Sitemap` in `sitemap.ts` | Next.js handles XML formatting, cache headers, and `<urlset>` wrapper automatically |
| robots.txt formatting | String concat | `MetadataRoute.Robots` in `robots.ts` | Typed API; Next.js formats output |
| JSON-LD script tag injection | Manual `<script>` tag in JSX | Inline `<script type="application/ld+json">` in Server Component with `JSON.stringify` | Already the established project pattern; avoid adding a dependency on `next-seo` or `react-schemaorg` |
| OpenGraph image generation | Custom canvas/SVG code | `opengraph-image.tsx` convention (already in use for 10+ pages) | Next.js ImageResponse at build time; already wired |
| Accessibility audit | Manual walkthrough only | `@axe-core/react` in dev + `pnpm test:unit` with RTL accessibility queries | Catches 30-40% of WCAG issues programmatically before manual review |
| Font loading optimisation | Custom `@font-face` + preload links | `next/font/google` (already wired in Phase 2) | Inlines critical CSS, eliminates flash, preconnects automatically |

**Key insight:** Next.js 15's built-in metadata API (`sitemap.ts`, `robots.ts`, `generateMetadata`) covers all standard SEO infrastructure without third-party packages. The project should avoid `next-seo`, `react-helmet`, and `next-sitemap` — they add dependency overhead for capabilities already present natively.

---

## Common Pitfalls

### Pitfall 1: Middleware Intercepts SEO Special Files
**What goes wrong:** `sitemap.xml`, `robots.txt`, `llms.txt` requests are rewritten by middleware to `/root/sitemap.xml`, `/hk/robots.txt` etc. — but only sitemap and robots benefit from being under the market path; llms.txt route handlers may not match correctly.
**Why it happens:** The middleware matcher pattern does not exclude `.xml` or `.txt` file extensions.
**How to avoid:** Add `sitemap\.xml`, `robots\.txt`, `llms\.txt`, and `llms-full\.txt` to the matcher negative-lookahead as defence-in-depth. Test with: `curl -H "Host: hk.proactivsports.com" https://<preview-url>/sitemap.xml`.
**Warning signs:** `/sitemap.xml` returns HTML (the market homepage) instead of XML.

### Pitfall 2: FAQPage Schema Answers Diverge from Visible Copy
**What goes wrong:** The `acceptedAnswer.text` in JSON-LD doesn't match the visible `<FAQItem>` answer text. Google's Rich Results Test shows no errors but the rich result doesn't appear in SERPs.
**Why it happens:** Phase 3/4 hardcoded both; future CMS edits update visible copy but not schema.
**How to avoid:** Share a single source of truth. Define FAQ items once in `hk-data.ts` (already done); the schema generator and the `<FAQItem>` component both consume that array. In Phase 6, Sanity FAQ items drive both.
**Warning signs:** `schema.org` validator warnings about text mismatch.

### Pitfall 3: metadataBase Wrong for HK/SG on Preview
**What goes wrong:** OG image URLs emit relative paths (e.g., `/opengraph-image`) instead of absolute URLs, breaking WhatsApp/Slack unfurls.
**Why it happens:** `metadataBase` resolves to `https://<sha>.vercel.app` but the opengraph-image URL in OG metadata includes a full production host.
**How to avoid:** Already handled in Phase 3/4 layouts with the `VERCEL_ENV === 'production'` branch. Phase 7 must ensure `sg/layout.tsx` uses the same pattern as `hk/layout.tsx`. [VERIFIED: existing codebase code at `app/hk/layout.tsx` lines 33-41]
**Warning signs:** OG preview shows broken image in WhatsApp on preview URL.

### Pitfall 4: Lighthouse Scores Degraded by Mux Player
**What goes wrong:** Pages with `<VideoPlayer>` (Mux) score 55-81 on Lighthouse Performance due to Mux bootup time.
**Why it happens:** Already documented in Phase 2 regression notes (STATE.md). VideoPlayer is a client bundle with significant JS weight.
**How to avoid:** Video is NOT the primary element on any Phase 7 target pages (homepages use it, but the primary LCP is the hero `<Image>` with `priority` prop). Ensure VideoPlayer is behind `dynamic({ ssr: false })` (already done via `components/hk/hk-hero-video.tsx`). For Lighthouse measurement, use the poster image, not a running video.
**Warning signs:** LCP time exceeds 2.5s on mobile throttled.

### Pitfall 5: sitemap.ts in Route Group Folder vs Market Folder
**What goes wrong:** `app/(hk)/sitemap.ts` (with parentheses) generates a URL at `/sitemap.xml` (stripping the group), colliding with root's sitemap.
**Why it happens:** Route groups with `()` are invisible in URLs — Next.js strips the group name.
**How to avoid:** The project uses PLAIN folders (`app/hk/`, `app/root/`, `app/sg/`) not route groups. Place `sitemap.ts` at `app/hk/sitemap.ts` → serves at `/hk/sitemap.xml` internally, which maps to `hk.proactivsports.com/sitemap.xml` via middleware rewrite. [VERIFIED: project architecture decision D-04 in middleware.ts]
**Warning signs:** All three sitemaps return the same root-level content.

### Pitfall 6: llms.txt vs llms-full.txt Spec Confusion
**What goes wrong:** `llms-full.txt` is treated as the same file as `llms.txt` but with more links; it should contain FULL PAGE CONTENT, not just more links.
**Why it happens:** The spec name suggests "full list" but means "full content".
**How to avoid:** `llms.txt` — H2 sections with link lists only (directory view). `llms-full.txt` — H2 sections with page content expanded inline below each link (for LLMs that can consume larger context). [CITED: llmstxt.org spec]
**Warning signs:** LLM tools report they can't fetch full content even with llms-full.txt present.

### Pitfall 7: WCAG 2.2 AA Focus Indicator Threshold
**What goes wrong:** The existing focus ring style (`outline-2 outline-ring`) may not meet WCAG 2.2 SC 2.4.11 (Focus Appearance AA) which requires: minimum area = perimeter of unfocused component × 2px; contrast ≥ 3:1 between focused and unfocused states.
**Why it happens:** WCAG 2.2 adds quantitative geometry requirements beyond the older "visible focus" rule.
**How to avoid:** Verify focus ring CSS against the 3:1 contrast minimum and 2px minimum offset. The existing `outline: 2px solid` with appropriate color should meet the area requirement for typical interactive elements. Test using browser DevTools + Stark extension.
**Warning signs:** axe-core reports `focus-visible` violation.

### Pitfall 8: SG Pages Are Phase 1 Stubs
**What goes wrong:** Attempting to add full JSON-LD and `generateMetadata` to sg/* pages that don't have real content yet (Phase 5 not executed per STATE.md which shows sg/ has only `page.tsx` and `layout.tsx`).
**Why it happens:** Phase 7 depends on Phase 5 (SG market) and Phase 6 (CMS) being complete.
**How to avoid:** Phase 7 executes AFTER Phase 5 and 6. The research scope should reflect that SG pages will be fully built when Phase 7 starts. The plan should include SG schema in the same tasks as HK schema — just with sg-data.ts as the data source.
**Warning signs:** Phase 7 wave 1 fails because sg/* pages don't exist.

---

## Code Examples

### JSON-LD Inline Script Pattern (already established in project)

```typescript
// Source: app/hk/wan-chai/page.tsx [VERIFIED: codebase]
// The pattern already established in Phase 4 — Phase 7 extends it
export default function WanChaiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(wanChaiSchema) }}
      />
      {/* page content */}
    </>
  )
}
```

### generateMetadata for Sanity-driven blog post

```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata [CITED]
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = await sanityFetch<PostSEO>({
    query: POST_SEO_QUERY,
    params: { slug },
  })
  if (!post) return { title: 'Not Found' }

  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription,
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.seoDescription,
      url: `https://hk.proactivsports.com/blog/${slug}/`,
      images: post.seoImage?.url
        ? [{ url: post.seoImage.url, width: 1200, height: 630 }]
        : [],
    },
    alternates: { canonical: `https://hk.proactivsports.com/blog/${slug}/` },
  }
}
```

### Event Schema for Camp pages

```typescript
// Source: strategy PART 9.5 + schema.org/Event [CITED]
// Typed helper (from lib/schema.ts)
export function buildEventSchema(camp: CampEntry) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: camp.name,
    startDate: camp.startDate,   // ISO 8601
    endDate: camp.endDate,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: camp.venueName,
      address: { '@type': 'PostalAddress', ...camp.address },
    },
    organizer: { '@id': 'https://proactivsports.com/#organization' },
    offers: {
      '@type': 'Offer',
      price: camp.priceFrom,
      priceCurrency: camp.currency,
      availability: 'https://schema.org/InStock',
      url: camp.bookingUrl,
    },
  }
}
```

### BreadcrumbList typed helper

```typescript
// Source: schema.org/BreadcrumbList [CITED], lib/schema.ts pattern
export function buildBreadcrumbs(
  items: Array<{ name: string; item: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  }
}
// Usage: buildBreadcrumbs([
//   { name: 'ProActiv Sports Hong Kong', item: 'https://hk.proactivsports.com/' },
//   { name: 'Gymnastics', item: 'https://hk.proactivsports.com/gymnastics/' },
//   { name: 'Toddlers', item: 'https://hk.proactivsports.com/gymnastics/toddlers/' },
// ])
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next-seo` package for metadata | Native `generateMetadata` API | Next.js 13.2 App Router | No extra package; full TypeScript typing |
| `sitemap.xml` generated by `next-sitemap` post-build script | `sitemap.ts` file convention | Next.js 13.3 | No post-build step; ISR-capable |
| `robots.txt` as static file in `public/` | `robots.ts` file convention | Next.js 13.3 | Programmatic, environment-aware |
| FID (First Input Delay) in Core Web Vitals | INP (Interaction to Next Paint) | March 2024 Google update | INP measures full interaction cost; Suspense boundaries help |
| WCAG 2.1 AA focus-visible | WCAG 2.2 AA Focus Appearance (SC 2.4.11) | October 2023 | Adds quantitative geometry requirements for focus indicators |
| `next-seo`'s `DefaultSeo` component | `metadata` export in root layout | Next.js 13 App Router | Global defaults via layout, per-page via `export const metadata` |

**Deprecated/outdated:**
- `next-sitemap`: Do not introduce. Native API is superior.
- `react-helmet` / `next-seo`: Not needed for this project. Native API handles all requirements.
- FID tracking: Replaced by INP; update any monitoring alerts accordingly.
- `<meta name="viewport" content="width=device-width">`: Handled automatically by Next.js App Router — do not add manually.

---

## Existing Schema Coverage Audit

**Already implemented (verified in codebase):**

| Page | Schema Types Present | Notes |
|------|---------------------|-------|
| `app/root/page.tsx` | Organization, WebSite, FAQPage | Phase 3; `@graph` pattern |
| `app/hk/page.tsx` | WebSite, FAQPage | Phase 4; missing VideoObject |
| `app/hk/wan-chai/page.tsx` | SportsActivityLocation, BreadcrumbList | Phase 4; complete |
| `app/hk/cyberport/page.tsx` | SportsActivityLocation, BreadcrumbList | Phase 4; complete |
| `app/hk/gymnastics/page.tsx` | BreadcrumbList, (Lighthouse ref) | Phase 4; Service schema TBC |
| `app/hk/gymnastics/*/page.tsx` (8 sub-pages) | BreadcrumbList per sub-page | Phase 4; Service schema TBC |
| `app/hk/faq/page.tsx` | FAQPage | Phase 4 |
| `app/hk/coaches/page.tsx` | Person (array via `@graph`) | Phase 4; good pattern |
| `app/sg/page.tsx` | None | Phase 1 stub only |

**Missing / Phase 7 must add:**

| Page | Schema Types Required |
|------|-----------------------|
| `app/sg/page.tsx` (full) | SportsActivityLocation (Katong), WebSite, FAQPage |
| `app/sg/katong-point/page.tsx` | SportsActivityLocation, BreadcrumbList, OpeningHoursSpecification |
| `app/sg/coaches/page.tsx` | Person (@graph) |
| All SG sub-pages | BreadcrumbList |
| `app/hk/holiday-camps/page.tsx` | Event (when camps have dates) |
| `app/hk/birthday-parties/page.tsx` | Service, BreadcrumbList |
| `app/hk/blog/[slug]/page.tsx` (Phase 6) | Article/BlogPosting, BreadcrumbList, Person (author) |
| `app/root/brand/page.tsx` | Organization (supplemental) |
| Any page with Mux video as primary content | VideoObject |
| `lib/schema.ts` | New file — shared typed helpers |

---

## Sitemap Coverage Plan

**Root property (`proactivsports.com`):**
- `/`, `/brand/`, `/coaching-philosophy/`, `/news/`, `/careers/`, `/contact/`, `/privacy/`, `/terms/`

**HK property (`hk.proactivsports.com`):**
- `/`, `/wan-chai/`, `/cyberport/`
- `/gymnastics/`, `/gymnastics/toddlers/`, `/gymnastics/beginner/`, `/gymnastics/intermediate/`, `/gymnastics/advanced/`, `/gymnastics/competitive/`, `/gymnastics/rhythmic/`, `/gymnastics/adult/`, `/gymnastics/private/`
- `/holiday-camps/`, `/birthday-parties/`, `/school-partnerships/`, `/competitions-events/`
- `/coaches/`, `/blog/`, `/faq/`, `/book-a-trial/`, `/book-a-trial/free-assessment/`
- Blog slugs: fetched from Sanity at build time

**SG property (`sg.proactivsports.com`):**
- `/`, `/katong-point/`
- `/weekly-classes/`, `/weekly-classes/movement-zone/`, `/weekly-classes/sports-zone/`, `/weekly-classes/climbing-zone/`
- `/prodigy-camps/`, `/prodigy-camps/themes/`, `/prodigy-camps/multi-activity/`, `/prodigy-camps/gymnastics-camps/`
- `/birthday-parties/`, `/school-partnerships/`, `/events/`, `/coaches/`, `/blog/`, `/faq/`, `/book-a-trial/`

---

## Lighthouse 95+ Optimization Checklist

All primary performance levers are already in place from Phases 1–4. Phase 7's job is to verify and close gaps:

| Lever | Status | Phase 7 Action |
|-------|--------|----------------|
| Hero `<Image priority>` | Done (Phase 3/4 pattern) | Verify on all market homepages + location pages |
| `next/font/google` with `display:swap` | Done (Phase 2) | No action needed |
| AVIF/WebP image formats | Done (Phase 2) | Verify `sizes` attribute on all hero images |
| VideoPlayer behind `dynamic({ ssr:false })` | Done (HK hero) | Verify SG hero follows same pattern |
| Route-level code splitting | Automatic (Next.js RSC) | No action — monitor bundle size |
| No render-blocking external scripts | Done (no external scripts except Sentry tunnel) | Verify in Lighthouse report |
| Suspense boundaries for INP | Partial — Phase 3/4 uses Suspense for booking form | Audit for heavy client interactions |
| Lazy-load below-fold images | Automatic (Next.js `<Image>` lazy default) | Verify non-hero images do NOT have `priority` |
| Remove unused CSS | Tailwind 4 purge | Automatic; verify no `@layer` bloat |
| Third-party script deferral | n/a (no third-party scripts Phase 7) | Verify if GA4 added in Phase 8 |

**Expected Lighthouse blockers on current codebase:**
1. `/_design` page scores 55-81 (Mux bootup) — out of scope for Phase 7 (not a primary page)
2. SG `page.tsx` is Phase 1 stub — Phase 7 cannot measure until Phase 5 pages exist
3. Missing `sizes` prop on some hero images may cause high LCP

---

## WCAG 2.2 AA Compliance Checklist

| Requirement | Status | Phase 7 Action |
|-------------|--------|----------------|
| Skip-link (SC 2.4.1) | Done — all 3 layouts have `sr-only focus:not-sr-only` pattern | Verify renders correctly on all properties |
| Focus visible (SC 2.4.7) | Done — `focus:outline-2 focus:outline-ring` in layouts | Verify 3:1 contrast meets WCAG 2.2 SC 2.4.11 |
| Focus appearance minimum area (SC 2.4.11 — WCAG 2.2 NEW) | UNKNOWN | Test with Stark / axe-core |
| Keyboard nav (SC 2.1.1) | Partial — shadcn components have keyboard support | Manual walk on homepages + booking form |
| Heading hierarchy h1>h2>h3 | Partial — h1 on each page per PART 7.3, H2/H3 from PART 7.3 | Audit all pages with axe-core |
| Text contrast 4.5:1 (SC 1.4.3) | Known issue — Button contrast violation from Phase 2 | Fix pending; Phase 7 must address |
| Image alt text (SC 1.1.1) | Partial — some photo paths pending real images | Ensure all `<Image>` have descriptive `alt`; verify against PART 7.6 |
| Form labels (SC 1.3.1) | Done — contact/booking forms use `<label>` components | Verify all form inputs labelled |
| Error identification (SC 3.3.1) | Done — Resend form handler returns errors | Verify form error display is accessible |
| Landmark regions (SC 1.3.6) | Done — `<main id="main-content">` in all layouts | Verify `<nav>`, `<footer>`, `<header>` present |
| Link purpose (SC 2.4.4) | Partial — "Read more" links may need `aria-label` | Audit all generic link text |

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.5 + @testing-library/react 16.3.2 |
| Config file | `vitest.config.ts` (repo root) |
| Quick run command | `pnpm test:unit` |
| Full suite command | `pnpm test:unit` (no separate full suite; Lighthouse is manual) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SEO-01 | Each page exports correct title/description in metadata | unit | `pnpm test:unit -- --grep "metadata"` | ❌ Wave 0 |
| SEO-02 | sitemap.ts returns correct URLs for each property | unit | `pnpm test:unit -- --grep "sitemap"` | ❌ Wave 0 |
| SEO-03 | robots.ts returns allow-all + correct sitemap URL | unit | `pnpm test:unit -- --grep "robots"` | ❌ Wave 0 |
| SEO-04 | llms.txt route returns valid Markdown with H1 + blockquote | unit | `pnpm test:unit -- --grep "llms"` | ❌ Wave 0 |
| SEO-05 | JSON-LD helpers produce schema with required fields | unit | `pnpm test:unit -- --grep "schema"` | ❌ Wave 0 |
| SEO-06 | Lighthouse ≥ 95 mobile on all primary pages | manual/CI | Lighthouse CI script (see below) | ❌ Wave 0 |
| SEO-07 | CWV: LCP < 2.5s, INP < 200ms, CLS < 0.1 | manual/CI | Same Lighthouse CI | ❌ Wave 0 |
| SEO-08 | axe-core zero violations on all primary pages | unit | `pnpm test:unit -- --grep "a11y"` | ❌ Wave 0 |

### Wave 0 Gaps

- [ ] `tests/unit/schema.test.ts` — unit tests for `lib/schema.ts` builder functions
- [ ] `tests/unit/sitemap.test.ts` — renders `sitemap.ts` handlers and validates URL format
- [ ] `tests/unit/robots.test.ts` — validates `robots.ts` output object
- [ ] `tests/unit/llms-txt.test.ts` — validates llms.txt route response format (H1, blockquote)
- [ ] `tests/unit/a11y.test.tsx` — axe-core pass on root, HK, SG homepage renders

### Sampling Rate

- **Per task commit:** `pnpm test:unit`
- **Per wave merge:** `pnpm test:unit` (full unit suite)
- **Phase gate:** Full suite green + Lighthouse ≥ 95 manual verification before `/gsd-verify-work`

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Vitest, build tools | ✓ | v24.14.0 | — |
| pnpm | Package management | ✓ | (from repo) | — |
| Vitest | Unit tests | ✓ | 4.1.5 | — |
| @testing-library/react | a11y + component tests | ✓ | ^16.3.2 | — |
| Lighthouse CI | SEO-06/07 measurement | ✗ | — | Manual Lighthouse in Chrome DevTools (acceptable for Phase 7) |
| axe-core/react | WCAG audit | ✗ | — | Install as part of Wave 0: `pnpm add -D @axe-core/react` |
| Sanity dataset | SEO-01 generateMetadata | Phase 6 dependency | — | Static `export const metadata` fallbacks until CMS connected |

**Missing dependencies with fallback:**
- Lighthouse CI: Manual Lighthouse measurements in Chrome DevTools for Phase 7. Automated LH CI (Phase 0 FOUND-05 mentions it in CI) can be wired as a separate enhancement.
- @axe-core/react: Install in Wave 0 task.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | SG pages will be fully built (Phase 5 complete) by the time Phase 7 executes | Architecture, Schema Coverage | If SG is stub-only, Phase 7 cannot achieve Lighthouse scores on sg/* pages — planner must gate Phase 7 on Phase 5 completion |
| A2 | Sanity content models (Phase 6) will be complete with SEO fields (seoTitle, seoDescription, seoImage) on all post/camp types | SEO-01 pattern | If Phase 6 not complete, `generateMetadata` falls back to static metadata — acceptable but means CMS-driven metadata won't be testable in Phase 7 |
| A3 | `lib/schema.ts` does not already exist (to be created in Phase 7) | Don't Hand-Roll | If a schema utility already exists somewhere in the codebase, Phase 7 should extend rather than create |
| A4 | `schema-dts` is worth adding as a dev dependency for type safety | Standard Stack | Minor; if rejected, define local types inline. Not blocking. |
| A5 | The existing Button contrast violation (Phase 2 STATE.md known regression) will be fixed as part of WCAG pass | WCAG checklist | If the brand color contrast truly fails 4.5:1, a brand color adjustment is needed — coordination with client required |

---

## Open Questions

1. **Phase 5 and Phase 6 completion before Phase 7**
   - What we know: Phase 7 depends on both Phase 5 (SG market pages) and Phase 6 (CMS fields) per ROADMAP.md. STATE.md shows the project at Phase 3-5 planning stage.
   - What's unclear: Whether sg/* pages will have enough content for meaningful Lighthouse measurements.
   - Recommendation: Phase 7 plan should include a Wave 0 task that asserts Phase 5 and 6 deliverables are present before proceeding.

2. **SG sub-pages schema data source**
   - What we know: `lib/hk-data.ts` provides all HK venue, coach, programme data. SG equivalent (`lib/sg-data.ts`) likely created in Phase 5.
   - What's unclear: Exact shape of sg-data.ts until Phase 5 is executed.
   - Recommendation: Phase 7 plan assumes `lib/sg-data.ts` exists with `SG_VENUES`, `SG_COACHES`, `SG_FAQ_ITEMS` arrays mirroring HK shape. If it doesn't, Wave 0 creates it.

3. **llms.txt content depth for Phase 7 vs Phase 6**
   - What we know: Ideal llms-full.txt includes full Sanity blog content. Phase 6 wires Sanity.
   - What's unclear: Whether Sanity GROQ fetch for llms-full.txt should be attempted in Phase 7 or deferred to Phase 8+ refinement.
   - Recommendation: Phase 7 generates static llms.txt (using hk-data.ts / sg-data.ts). llms-full.txt uses the same data. Dynamic Sanity-fetched variant with `revalidate = 86400` is a Phase 7 stretch goal, not a blocker for SEO-04.

4. **Geo coordinates for Cyberport venue**
   - What we know: Wan Chai coordinates are in `lib/hk-data.ts` (lat: 22.2772, lng: 114.1730). Cyberport address is "Cyberport complex, Pokfulam" but specific unit number is TBC.
   - What's unclear: Exact lat/lng for Cyberport venue in the GeoCoordinates schema.
   - Recommendation: Use approximate Cyberport complex coordinates (22.2607, 114.1296) as a placeholder; HUMAN-ACTION to verify with client.

---

## Project Constraints (from CLAUDE.md)

- **Tech stack locked:** Next.js 15, Tailwind, shadcn/ui, Sanity, Vercel, Cloudflare, Mux — no alternatives.
- **Single app architecture:** Subdomain routing via middleware → plain folder trees. All sitemap/robots/llms.txt must respect this.
- **Performance budget:** LCP < 2.5s, INP < 200ms, CLS < 0.1 on homepage and pillar pages (mobile throttled). Lighthouse 95+ on same set.
- **No black-hat SEO:** No PBNs, no doorway pages, no thin local pages, no keyword stuffing.
- **Security:** No `.env` in git. Sentry active. CloudFlare WAF at Phase 10.
- **CMS independence:** Non-technical editors must be able to publish without developer help — schema must auto-generate from CMS fields (Phase 6 responsibility; Phase 7 wires the code side).
- **GSD workflow enforcement:** All code changes through `/gsd-execute-phase 7` — no direct repo edits outside GSD workflow.
- **Phase 7 executes after Phase 5 and Phase 6** per ROADMAP.md dependency chain.

---

## Sources

### Primary (HIGH confidence)
- [/vercel/next.js] — `generateMetadata`, `MetadataRoute.Sitemap`, `MetadataRoute.Robots` API (Context7 verified, docs at nextjs.org)
- [nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) — Sitemap API, version history
- [nextjs.org/docs/app/api-reference/file-conventions/metadata/robots](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) — robots.ts API
- [nextjs.org/docs/app/api-reference/functions/generate-metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — generateMetadata function signature
- [llmstxt.org](https://llmstxt.org/) — llms.txt specification (H1 required, blockquote summary, H2 sections, Optional section, link format)
- Project codebase — `app/hk/wan-chai/page.tsx`, `app/root/page.tsx`, `app/hk/layout.tsx`, `middleware.ts` (all verified via Read tool)
- `.planning/inputs/strategy.md` — PART 7 (title tags, meta descriptions, H1/H2 structure), PART 9 (JSON-LD skeletons), PART 10 (LLMO package) — canonical brief

### Secondary (MEDIUM confidence)
- [WebSearch: WCAG 2.2 AA focus indicators 2025] — SC 2.4.11 Focus Appearance AA requirement: 3:1 contrast, minimum area requirement
- [WebSearch: Next.js Core Web Vitals 2025] — INP < 200ms now primary interactivity metric (replaced FID March 2024)
- [schema-dts npm package] — TypeScript types for schema.org (v1.1.2 verified via npm registry)

### Tertiary (LOW confidence)
- [WebSearch: multi-tenant robots.txt Next.js middleware] — middleware exclusion pattern for sitemap/robots; specific implementation requires verification against live behaviour

---

## Metadata

**Confidence breakdown:**
- Standard Stack: HIGH — all packages verified against npm registry and project package.json
- Architecture (sitemap/robots/llms.txt routing): HIGH — verified against actual middleware.ts and Next.js official docs
- JSON-LD patterns: HIGH — existing patterns verified in codebase, strategy doc provides exact skeletons
- Lighthouse/CWV targets: HIGH — official Google thresholds (LCP 2.5s, INP 200ms, CLS 0.1)
- WCAG 2.2 AA specifics: MEDIUM — SC 2.4.11 Focus Appearance is new; exact implementation verified via WebSearch but not against a specific axe-core version
- llms.txt spec: HIGH — verified against llmstxt.org

**Research date:** 2026-04-24
**Valid until:** 2026-05-24 (stable; Next.js metadata API is not rapidly changing)

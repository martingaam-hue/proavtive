---
phase: 7
slug: seo-schema-llmo
status: draft
shadcn_initialized: true
preset: style=radix-nova + base-color=neutral + css-variables=true + rsc=true + iconLibrary=lucide
created: 2026-04-24
revised: 2026-04-24
typography_inheritance_exemption: true
typography_inherited_from: 02-UI-SPEC.md §1.6
typography_net_new_sizes: 0
typography_net_new_weights: 0
requirements: [SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, SEO-08]
upstream_inputs:
  - 07-CONTEXT.md (all decisions locked)
  - 07-RESEARCH.md (8 patterns, 8 pitfalls, validation architecture)
  - 04-UI-SPEC.md (HK composition patterns — schema inline pattern established)
  - 03-UI-SPEC.md (root JSON-LD @graph pattern established)
  - 02-UI-SPEC.md (token + primitive contract — Phase 7 inherits, does not redefine)
  - PROJECT.md (palette, perf budget, WCAG 2.2 AA)
  - strategy.md §PART 7 (title tags, meta descriptions), §PART 9 (JSON-LD skeletons), §PART 10 (LLMO package)
---

# Phase 7 — UI Design Contract (SEO, Schema, and LLMO)

> **Scope reminder:** Phase 7 is a *cross-cutting overlay phase, not a page-building phase*. No new pages are introduced. No new design-system tokens. No new shadcn primitives. The work is: (1) file-based SEO routes (sitemap, robots, llms.txt per property), (2) JSON-LD coverage across all three properties via a shared `lib/schema.ts` module, (3) per-page metadata correctness, (4) a WCAG 2.2 AA audit pass including the known Button contrast fix, and (5) a Lighthouse 95+ performance pass. This contract binds planner and executor; deviation from the locked decisions below requires an explicit override logged in CONTEXT.md.

---

## 0. How this contract is used

| Consumer | What they pull from here |
|----------|--------------------------|
| `gsd-planner` | §2 affected-page matrix · §3 SEO route file specs · §4 JSON-LD helper module spec · §5 metadata values (verbatim) · §6 OG/Twitter card conventions · §7 WCAG audit scope · §8 performance audit scope · §9 llms.txt content structure |
| `gsd-executor` | §3 exact file paths and function signatures · §4 `lib/schema.ts` builder signatures · §5 verbatim title/description strings · §7 a11y checklist · §8 Lighthouse checklist |
| `gsd-ui-checker` | Checker Notes (no new tokens, no new primitives) · §10 requirement traceability |
| `gsd-ui-auditor` | Post-execute diff scope: `middleware.ts`, `app/root/sitemap.ts`, `app/hk/sitemap.ts`, `app/sg/sitemap.ts`, `app/*/robots.ts`, `app/*/llms.txt/route.ts`, `lib/schema.ts`, all pages listed in §2 |

---

## Checker Notes — Inheritance Exemptions

**Binding statement for gsd-ui-checker dimension 4 (Typography):**

Phase 7 declares **zero net-new font sizes** and **zero net-new font weights**. All typography consumed in any Phase 7 code uses the 8-role scale from `02-UI-SPEC.md §1.6` verbatim (`text-display`, `text-h1`, `text-h2`, `text-h3`, `text-body-lg`, `text-body`, `text-small`, `text-label`).

**Binding statement for gsd-ui-checker dimension 1 (Tokens):**

Phase 7 declares **zero net-new design tokens**. All color, spacing, and radius tokens come from `02-UI-SPEC.md §1`. The WCAG Button contrast fix (§7.2) adjusts a brand token application (button state color), not the token definition itself — no new CSS variable is introduced.

**Binding statement for gsd-ui-checker dimension 2 (Components):**

Phase 7 introduces **zero new shadcn or custom UI components**. All UI surfaces affected by Phase 7 are existing pages receiving non-visual additions (JSON-LD script tags, metadata exports, aria attributes). The sole new code units are server-side utilities (`lib/schema.ts` builder functions and route handlers) with zero rendered output.

**The gsd-ui-checker dimension limits apply to net-new declarations per phase.** Phase 7 declares none.

---

## 1. Inheritance from Phases 1–6 — what Phase 7 does NOT redefine

| Inherited from | Where to find it | Phase 7 stance |
|----------------|------------------|----------------|
| Brand palette as `--color-brand-*` | Phase 2 UI-SPEC §1.2 + `app/globals.css` | Consumed, not modified. |
| Semantic token mapping (`--primary` = navy, etc.) | Phase 2 UI-SPEC §1.4 | Consumed. WCAG fix adjusts button state usage, not token definition. |
| Type scale (8 roles) | Phase 2 UI-SPEC §1.6 | Consumed verbatim. |
| Font stack (Unbounded / Manrope / Baloo 2) | Phase 2 UI-SPEC §1.7 | Consumed. No new font weights or families. |
| Spacing + section rhythm | Phase 2 UI-SPEC §1.8 | Consumed. No new spacing variables. |
| Radius scale | Phase 2 UI-SPEC §1.9 | Consumed. |
| Phase 2–5 primitive inventory | Phase 2 UI-SPEC §3 | No new primitives. |
| JSON-LD inline `<script>` pattern | Phase 3 plan 03-02-PLAN + Phase 4 plan 04-04-PLAN | Phase 7 extends to all remaining pages via `lib/schema.ts` helpers. |
| `metadataBase` branching on `VERCEL_ENV === 'production'` | Phase 4 `app/hk/layout.tsx` | Phase 7 verifies SG layout uses the same pattern and fixes if not. |
| Skip-link pattern (`sr-only focus:not-sr-only`) | Phase 3 root layout + Phase 4 HK layout | Phase 7 verifies all three property layouts carry it. |
| OG image convention (`opengraph-image.tsx` per route) | Phase 3 `lib/og-image.tsx` + Phase 4 createHKOgImage | Phase 7 verifies all primary pages have OG images; adds SG pages missing them. |
| Editorial asymmetry rules | Phase 2 UI-SPEC §7 | Phase 7 is non-visual — these rules do not apply to this phase's deliverables. |

---

## 2. Affected-Page Matrix

Pages touched by Phase 7. "JSON-LD" = schema types added or verified. "Metadata" = `export const metadata` or `generateMetadata` added/fixed. "OG image" = `opengraph-image.tsx` added if missing.

### Root property (`proactivsports.com`)

| Page | JSON-LD (add/verify) | Metadata | OG image |
|------|---------------------|----------|----------|
| `app/root/page.tsx` | Organization + WebSite + FAQPage (verify @graph correct) | verify title/description verbatim per §5 | verify exists |
| `app/root/brand/page.tsx` | Organization (supplemental) + BreadcrumbList | verify | verify |
| `app/root/coaching-philosophy/page.tsx` | BreadcrumbList | verify | verify |
| `app/root/news/page.tsx` | BreadcrumbList | verify | verify |
| `app/root/careers/page.tsx` | BreadcrumbList | verify | verify |
| `app/root/contact/page.tsx` | BreadcrumbList | verify | verify |
| `app/root/privacy/page.tsx` | BreadcrumbList | verify | — |
| `app/root/terms/page.tsx` | BreadcrumbList | verify | — |
| `app/root/sitemap.ts` | NEW FILE | — | — |
| `app/root/robots.ts` | NEW FILE | — | — |
| `app/root/llms.txt/route.ts` | NEW FILE | — | — |
| `app/root/llms-full.txt/route.ts` | NEW FILE | — | — |

### HK property (`hk.proactivsports.com`)

| Page | JSON-LD (add/verify) | Metadata | OG image |
|------|---------------------|----------|----------|
| `app/hk/page.tsx` | WebSite + FAQPage + SportsActivityLocation×2 (verify) | verify title/description per §5 | verify exists |
| `app/hk/wan-chai/page.tsx` | SportsActivityLocation + BreadcrumbList + OpeningHoursSpecification (verify/extend) | verify | verify |
| `app/hk/cyberport/page.tsx` | SportsActivityLocation + BreadcrumbList + OpeningHoursSpecification (verify/extend) | verify | verify |
| `app/hk/gymnastics/page.tsx` | Service + BreadcrumbList (ADD Service) | verify | verify |
| `app/hk/gymnastics/*/page.tsx` (8 sub-pages) | Service + BreadcrumbList (ADD Service) | verify unique per sub-page | verify each |
| `app/hk/holiday-camps/page.tsx` | Service + BreadcrumbList (ADD; Event only when dates exist) | verify | verify |
| `app/hk/birthday-parties/page.tsx` | Service + BreadcrumbList (ADD) | verify | verify |
| `app/hk/school-partnerships/page.tsx` | Service + BreadcrumbList (ADD) | verify | verify |
| `app/hk/competitions-events/page.tsx` | BreadcrumbList (verify) | verify | verify |
| `app/hk/coaches/page.tsx` | Person @graph + BreadcrumbList (verify) | verify | verify |
| `app/hk/blog/page.tsx` | BreadcrumbList (verify) | verify | verify |
| `app/hk/faq/page.tsx` | FAQPage (verify single source = HK_FAQ_ITEMS) | verify | verify |
| `app/hk/book-a-trial/page.tsx` | BreadcrumbList | verify | verify |
| `app/hk/book-a-trial/free-assessment/page.tsx` | BreadcrumbList | verify | — |
| `app/hk/sitemap.ts` | NEW FILE | — | — |
| `app/hk/robots.ts` | NEW FILE | — | — |
| `app/hk/llms.txt/route.ts` | NEW FILE | — | — |
| `app/hk/llms-full.txt/route.ts` | NEW FILE | — | — |

**Future (Phase 6 CMS pages — scaffold only in Phase 7):**

| Page | JSON-LD scaffold | Metadata scaffold |
|------|-----------------|-------------------|
| `app/hk/blog/[slug]/page.tsx` | BlogPosting + BreadcrumbList + Person (author) — wired via `generateMetadata` | `generateMetadata` with Sanity GROQ + null fallback |

### SG property (`sg.proactivsports.com`)

> **Prerequisite gate:** All SG page files must exist (Phase 5 complete) before Phase 7 SG tasks execute. If `app/sg/page.tsx` is a Phase 1 stub, Wave 0 halts and escalates.

| Page | JSON-LD (add) | Metadata | OG image |
|------|--------------|----------|----------|
| `app/sg/page.tsx` | SportsActivityLocation (Katong) + WebSite + FAQPage | title/description per §5 | verify/add |
| `app/sg/katong-point/page.tsx` | SportsActivityLocation + BreadcrumbList + OpeningHoursSpecification | verify | verify |
| `app/sg/weekly-classes/page.tsx` | Service + BreadcrumbList | verify | verify |
| `app/sg/weekly-classes/*/page.tsx` (3 zones) | Service + BreadcrumbList | verify unique | verify each |
| `app/sg/prodigy-camps/page.tsx` | Service + BreadcrumbList | verify | verify |
| `app/sg/prodigy-camps/*/page.tsx` (3 types) | Service + BreadcrumbList (Event when dates exist) | verify unique | verify each |
| `app/sg/birthday-parties/page.tsx` | Service + BreadcrumbList | verify | verify |
| `app/sg/school-partnerships/page.tsx` | Service + BreadcrumbList | verify | verify |
| `app/sg/events/page.tsx` | BreadcrumbList | verify | verify |
| `app/sg/coaches/page.tsx` | Person @graph + BreadcrumbList | verify | verify |
| `app/sg/blog/page.tsx` | BreadcrumbList | verify | verify |
| `app/sg/faq/page.tsx` | FAQPage (single source = SG_FAQ_ITEMS) | verify | verify |
| `app/sg/book-a-trial/page.tsx` | BreadcrumbList | verify | verify |
| `app/sg/sitemap.ts` | NEW FILE | — | — |
| `app/sg/robots.ts` | NEW FILE | — | — |
| `app/sg/llms.txt/route.ts` | NEW FILE | — | — |
| `app/sg/llms-full.txt/route.ts` | NEW FILE | — | — |

---

## 3. SEO Route File Specifications

### 3.1 Middleware exclusion (middleware.ts — amend)

Add `sitemap\.xml|robots\.txt|llms\.txt|llms-full\.txt` to the existing matcher negative-lookahead. The amended matcher pattern:

```typescript
export const config = {
  matcher: [
    "/((?!_next/|_design|api/health|favicon\\.ico|monitoring|studio|sitemap\\.xml|robots\\.txt|llms\\.txt|llms-full\\.txt|.*\\.(?:svg|png|jpg|jpeg|webp|avif|ico|gif|woff2?)).*)",
  ],
};
```

This is defence-in-depth alongside the rewrite architecture. `llms.txt` Route Handlers require it; `sitemap.ts` and `robots.ts` work via rewrite but the explicit exclusion prevents future regressions.

### 3.2 Sitemap files

Three files, one per property. All URL entries use hardcoded production origins — no `NEXT_PUBLIC_*` env vars, no preview URLs, ever.

**File paths:**
- `app/root/sitemap.ts` → serves at `proactivsports.com/sitemap.xml`
- `app/hk/sitemap.ts` → serves at `hk.proactivsports.com/sitemap.xml`
- `app/sg/sitemap.ts` → serves at `sg.proactivsports.com/sitemap.xml`

**Priority scale:**
- Homepage: `priority: 1`, `changeFrequency: 'weekly'`
- Location pages (wan-chai, cyberport, katong-point): `priority: 0.9`, `changeFrequency: 'monthly'`
- Pillar pages (gymnastics, weekly-classes, prodigy-camps): `priority: 0.8`, `changeFrequency: 'monthly'`
- Sub-pages (gymnastics/toddlers, weekly-classes/movement-zone): `priority: 0.7`, `changeFrequency: 'monthly'`
- Supporting content (blog hub, faq, coaches, book-a-trial): `priority: 0.6`, `changeFrequency: 'weekly'`
- Utility/legal pages (privacy, terms, careers): `priority: 0.3`, `changeFrequency: 'yearly'`

**Trailing slashes:** All sitemap URLs end with `/` (e.g., `https://hk.proactivsports.com/gymnastics/`). Must match `alternates.canonical` on each page.

**Blog slugs:** Fetched from Sanity at build time using `sanityFetch` if Phase 6 CMS is live. If Sanity returns empty, sitemap includes only static routes — never fail the build on empty Sanity response.

**Root sitemap index:** `app/root/sitemap.ts` includes the root property URLs. A separate sitemap index file (`app/sitemap.ts` at repo root) may optionally reference all three per-property sitemaps — decision left to executor. If implemented, it lives at `proactivsports.com/sitemap.xml` and points to all three property sitemaps via `<sitemapindex>`.

### 3.3 Robots files

Three files, one per property.

**File paths:**
- `app/root/robots.ts`
- `app/hk/robots.ts`
- `app/sg/robots.ts`

**Behaviour:** All three always emit `rules: { userAgent: '*', allow: '/' }`. Never branch on environment — the Phase 0 `X-Robots-Tag: noindex, nofollow` header is the preview-noindex mechanism.

**Sitemap URL:** Each robots.ts specifies its own property's production sitemap URL (e.g., `sitemap: 'https://hk.proactivsports.com/sitemap.xml'`).

**Host field:** Each robots.ts specifies its own property's production host (e.g., `host: 'hk.proactivsports.com'`).

### 3.4 llms.txt route handlers

Twelve files total: `llms.txt/route.ts` and `llms-full.txt/route.ts` for each of the three properties.

**File paths:**
- `app/root/llms.txt/route.ts`, `app/root/llms-full.txt/route.ts`
- `app/hk/llms.txt/route.ts`, `app/hk/llms-full.txt/route.ts`
- `app/sg/llms.txt/route.ts`, `app/sg/llms-full.txt/route.ts`

**ISR:** `export const revalidate = 86400` (24 hours). Adjust to 43200 if camp dates change frequently.

**Content-Type header:** `text/plain; charset=utf-8`

**Cache-Control header:** `public, max-age=86400, stale-while-revalidate=3600`

**llms.txt vs llms-full.txt distinction:**
- `llms.txt` — H2 sections with markdown link lists only (directory view for LLMs with small context windows)
- `llms-full.txt` — H2 sections with full prose content expanded below each link (full factual content for LLMs with large context windows; must allow answering factual questions about ProActiv without fetching further URLs)

**Spec compliance rules (non-negotiable):**
- H1: property/site name (required)
- Blockquote paragraph: one-paragraph business summary (strongly recommended)
- H2: section headings (Programmes, Venues, Coaches, Optional)
- Link format: `- [Page Title](https://...): one-sentence description`
- `## Optional` section: secondary content (blog, FAQ) that LLMs may skip under context pressure
- No H3 or deeper headings
- No HTML markup
- Pure Markdown only

**Content source (Phase 7):** Static data from `lib/hk-data.ts` and `lib/sg-data.ts`. Sanity GROQ-fetched blog/camp content is a stretch goal using the 24h revalidation — implement if Phase 6 is live, skip if not.

---

## 4. lib/schema.ts — Typed JSON-LD Helper Module

### 4.1 Module contract

**File:** `lib/schema.ts`

**Dev dependency:** `schema-dts` (v1.1.2) — install with `pnpm add -D schema-dts`. Provides TypeScript types for all schema.org types. Zero runtime cost.

**Import rule:** This module is a Server Component utility. NEVER import in a `'use client'` component. JSON-LD is always server-rendered.

**Inline script pattern (established in Phase 3/4 — use verbatim):**
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
/>
```
Place at the top of the page component body, before content JSX. Consistent with Phase 4 established pattern.

### 4.2 Builder function signatures

All functions return plain objects (not `WithContext<T>` — schema-dts types are for internal type checking via local `as` casts, not exported). Each function is pure (no side effects, no fetches).

```typescript
// Organization (root only)
buildOrganizationSchema(): object
// Fixed @id: 'https://proactivsports.com/#organization'

// WebSite
buildWebSiteSchema(market: 'root' | 'hk' | 'sg'): object
// market determines the @id and url fields

// LocalBusiness (SportsActivityLocation subtype)
buildLocalBusinessSchema(venue: VenueData): object
// VenueData shape: { id, name, url, address, geo, telephone, openingHours, image }
// Fixed @ids per §4.3

// FAQPage
buildFAQPageSchema(items: Array<{ question: string; answer: string }>): object
// Consumes HK_FAQ_ITEMS or SG_FAQ_ITEMS directly — same array as <FAQItem> component

// BreadcrumbList
buildBreadcrumbs(items: Array<{ name: string; item: string }>): object
// item field = absolute production URL

// Service (gymnastics programmes, camp pillars, party/school pages)
buildServiceSchema(opts: {
  name: string;
  description: string;
  url: string;
  provider: '@id string';  // always 'https://proactivsports.com/#organization'
  areaServed: string;      // 'Hong Kong' or 'Singapore'
}): object

// Event (camp pages with confirmed dates)
buildEventSchema(camp: CampEntry): object
// CampEntry: { name, startDate, endDate, venueName, address, priceFrom, currency, bookingUrl }
// startDate/endDate: ISO 8601 strings

// Person (coach bios — array consumed in @graph)
buildPersonSchema(coach: CoachData): object
// CoachData: { name, jobTitle, description, image, url }

// BlogPosting (Phase 6 CMS blog posts)
buildBlogPostingSchema(post: {
  headline: string;
  url: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  authorUrl: string;
  image: string;
  description: string;
}): object

// OpeningHoursSpecification (for venue location pages)
buildOpeningHoursSchema(hours: Array<{
  dayOfWeek: string[];   // e.g. ['Monday','Tuesday',...]
  opens: string;         // e.g. '09:00'
  closes: string;        // e.g. '20:00'
}>): object[]

// @graph wrapper (combines multiple schema types on one page)
buildGraph(...schemas: object[]): object
// Wraps in { '@context': 'https://schema.org', '@graph': [...schemas] }
```

### 4.3 Fixed @id values

These are locked — use verbatim in all schema output. Never vary by page or environment.

| Entity | @id |
|--------|-----|
| Organization | `https://proactivsports.com/#organization` |
| WebSite (root) | `https://proactivsports.com/#website` |
| LocalBusiness Wan Chai | `https://hk.proactivsports.com/#localbusiness-wanchai` |
| LocalBusiness Cyberport | `https://hk.proactivsports.com/#localbusiness-cyberport` |
| LocalBusiness Katong Point | `https://sg.proactivsports.com/#localbusiness-katong` |

### 4.4 Schema deployment matrix (per-page rules)

| Page type | Schema @graph contents |
|-----------|----------------------|
| Root homepage | Organization + WebSite + FAQPage |
| Root brand page | Organization (supplemental, references root @id) + BreadcrumbList |
| Root other pages | BreadcrumbList |
| HK homepage | WebSite + SportsActivityLocation×2 (Wan Chai + Cyberport) + FAQPage |
| SG homepage | WebSite + SportsActivityLocation (Katong) + FAQPage |
| Location pages (Wan Chai, Cyberport, Katong) | SportsActivityLocation + OpeningHoursSpecification + BreadcrumbList |
| Programme pillars (gymnastics, weekly-classes, prodigy-camps) | Service + BreadcrumbList + FAQPage (if FAQ items exist) |
| Programme sub-pages (toddlers, movement-zone, etc.) | Service + BreadcrumbList |
| Camp pages with confirmed dates | Event + BreadcrumbList |
| Birthday parties / school partnerships | Service + BreadcrumbList |
| Coaches pages | Person[] (via @graph) + BreadcrumbList |
| Blog hub pages | BreadcrumbList |
| Blog post pages (Phase 6) | BlogPosting + BreadcrumbList + Person (author) |
| FAQ hub pages | FAQPage + BreadcrumbList |
| Book-a-trial pages | BreadcrumbList |
| Legal/utility pages | BreadcrumbList |

**Excluded schema types (strategy PART 9.2 — non-negotiable):**
- `AggregateRating` — forbidden without visible, verifiable review data
- `Course` — use `Service` for gymnastics programmes
- `MedicalBusiness` / `HealthAndBeautyBusiness` — use `SportsActivityLocation`
- `VideoObject` — only add where video is the primary content element, not on every page with a background video

### 4.5 FAQPage single-source rule

FAQ answers in JSON-LD `acceptedAnswer.text` MUST equal the visible `<FAQItem>` answer text verbatim. Both must consume the same data array:
- HK pages: `HK_FAQ_ITEMS` from `lib/hk-data.ts`
- SG pages: `SG_FAQ_ITEMS` from `lib/sg-data.ts`
- CMS pages (Phase 6): Sanity FAQ document fields

No copy-pasting, no parallel maintenance. This rule is enforced by the unit test in `tests/unit/schema.test.ts`.

### 4.6 Cyberport coordinates placeholder

```typescript
// HUMAN-ACTION: verify exact lat/lng with client before launch
geo: { latitude: 22.2607, longitude: 114.1296 }
```

Use approximate Cyberport complex coordinates as placeholder. The HUMAN-ACTION comment must be present in `lib/schema.ts` at the constant definition site.

---

## 5. Metadata Values (verbatim)

These strings come from strategy PART 7.1 recommended option #1. Use verbatim — no paraphrasing.

### 5.1 Root property

```
title: "ProActiv Sports | Premium Children's Gymnastics & Sports — Hong Kong & Singapore"
description: "ProActiv Sports runs premium children's gymnastics and sports programmes in Hong Kong and Singapore. Since 2011. Choose your city to explore classes, camps, and parties."
```

### 5.2 HK property

```
title: "Kids Gymnastics & Sports Hong Kong | ProActiv Sports — Wan Chai & Cyberport"
description: "Premium gymnastics, sports classes, holiday camps and birthday parties for children in Hong Kong. ProGym Wan Chai & Cyberport. Book a free trial."
```

### 5.3 SG property

```
title: "Kids' Sports Classes, Camps & Parties Singapore | Prodigy by ProActiv Sports"
description: "Kids' sports classes, holiday camps & birthday parties at Prodigy by ProActiv Sports — Katong Point, Singapore. Home of the only MultiBall wall. Book a free trial."
```

### 5.4 Sub-page title pattern

```
{Page Name} | {Market Brand} — {Location}
e.g. "Gymnastics Classes Hong Kong | ProActiv Sports — Wan Chai & Cyberport"
e.g. "Birthday Parties Singapore | Prodigy by ProActiv Sports — Katong Point"
```

Max title length: 60 characters (Google truncates at ~60). Max description: 155 characters.

### 5.5 generateMetadata for CMS-driven pages

For pages where content comes from Sanity (Phase 6), use `generateMetadata` with graceful null fallbacks:

```typescript
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = await sanityFetch<PostSEO>({ query: POST_SEO_QUERY, params: { slug } })
  if (!post) return { title: 'Not Found' }
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? undefined,
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? undefined,
      url: `https://hk.proactivsports.com/blog/${slug}/`,
      images: post.seoImage?.url ? [{ url: post.seoImage.url, width: 1200, height: 630 }] : [],
    },
    alternates: { canonical: `https://hk.proactivsports.com/blog/${slug}/` },
  }
}
```

Use whichever fetch pattern (sanityFetch vs client.fetch) Phase 6 established for other data fetches. Be consistent with Phase 6's caching approach.

---

## 6. OG Image and Twitter Card Conventions

### 6.1 metadataBase pattern

All three property layouts must implement the `VERCEL_ENV === 'production'` branch for `metadataBase`. The HK layout already does this — Phase 7 verifies the SG layout uses the identical pattern:

```typescript
metadataBase: process.env.VERCEL_ENV === 'production'
  ? new URL('https://sg.proactivsports.com')
  : new URL(`https://${process.env.VERCEL_URL}`)
```

Without this, OG image URLs on preview deploys emit relative paths that break WhatsApp/iMessage unfurls.

### 6.2 OG image dimensions

All `opengraph-image.tsx` files use `1200 × 630px` (Twitter/Facebook standard). All OG images set `width: 1200, height: 630` in the `size` export.

### 6.3 Twitter card

All pages use `twitter: { card: 'summary_large_image' }` in metadata. Set at the property layout level so all pages in a market tree inherit it without per-page repetition.

### 6.4 alternates.canonical

Every page (static and CMS-driven) must set `alternates: { canonical: '<production-url-with-trailing-slash>' }`. CMS-driven pages set this in `generateMetadata`. Static pages set it in `export const metadata`.

No hreflang between HK and SG. No hreflang at all — these are different products, not locale variants (strategy PART 2, locked decision).

### 6.5 OG image visual conventions

OG images for each property follow the patterns established in Phases 3/4 and the `createHKOgImage`/`createSGOgImage` utilities. Phase 7 does not introduce new OG image designs. If an existing page is missing its `opengraph-image.tsx`, add one by calling the relevant market's existing `create*OgImage` utility with appropriate page-level title text.

---

## 7. WCAG 2.2 AA Audit Scope

Phase 7 must close these gaps. Each is a named task in the Wave 3 plan.

### 7.1 axe-core integration

**Package:** `@axe-core/react` (dev only, v4.10.x)

**Integration location:** Development-mode only, gated on `process.env.NODE_ENV === 'development'`. Options:
- A dev-only provider component in a development-only layout segment, OR
- A standalone dev bootstrap script loaded conditionally in `app/layout.tsx`

Either is acceptable. Zero production bundle impact is required.

**Test file:** `tests/unit/a11y.test.tsx` — axe-core pass on server-rendered HTML of root, HK, and SG homepages. Runs as part of `pnpm test:unit`.

### 7.2 Button contrast fix

The known Button contrast violation from Phase 2 `STATE.md` must be investigated and resolved in Phase 7.

**Investigation approach:**
1. Identify which button state(s) fail WCAG 1.4.3 (4.5:1 contrast ratio for text)
2. Navy (`#0f206c`) on white achieves 14.55:1 — primary button passes
3. Likely failure: secondary button hover/focus state, or outline button variant against colored background
4. Fix by adjusting the Tailwind utility class application on the specific button state — not by redefining the brand token
5. Verify fix with browser DevTools Contrast Checker or Stark extension

**If brand color truly fails 4.5:1:** Document the specific failure case in a HUMAN-ACTION comment and note that client coordination is required. Do not alter core brand tokens without client approval.

### 7.3 Focus appearance (WCAG 2.2 SC 2.4.11)

Verify existing `outline-2 outline-ring` focus ring against:
- Minimum 3:1 contrast between focused and unfocused states
- Minimum area: perimeter of unfocused component × 2px

The existing `outline: 2px solid` with adequate color contrast should meet the area requirement for typical interactive elements. Verify against the specific navy/white/red context used in each market layout. Test with Stark extension or axe-core focus-visible rule.

### 7.4 WCAG audit checklist

| Check | SC | Target | Action if failing |
|-------|----|--------|-------------------|
| Skip-link present and functional | 2.4.1 | All 3 layouts | Add `<a href="#main-content">` skip link |
| Focus visible on all interactive elements | 2.4.7 | All properties | Ensure `focus-visible:outline-2` on all focusable elements |
| Focus appearance contrast 3:1 | 2.4.11 (WCAG 2.2) | All interactive elements | Adjust focus ring color if needed |
| Text contrast 4.5:1 | 1.4.3 | All text/background combos | Fix secondary button states |
| Heading hierarchy h1→h2→h3 | 1.3.1 | All primary pages | Audit with axe-core; fix skipped levels |
| Image alt text | 1.1.1 | All `<Image>` elements | Add descriptive alt per PART 7.6 strategy |
| Form labels | 1.3.1 | Contact/booking forms | Verify `<label htmlFor>` on all inputs |
| "Read more" link purpose | 2.4.4 | All blog/listing pages | Add `aria-label="Read more about {post title}"` |
| Landmark regions | 1.3.6 | All layouts | Verify `<nav>`, `<main id="main-content">`, `<footer>`, `<header>` |
| Error identification accessible | 3.3.1 | Contact/booking forms | Verify error messages are in `aria-live` or associated with inputs |
| Keyboard nav complete | 2.1.1 | Booking form + nav menus | Manual walk: tab through entire flow |

---

## 8. Lighthouse 95+ Performance Audit Scope

Phase 7 closes gaps to achieve Lighthouse mobile ≥ 95 (Performance, Accessibility, Best Practices, SEO) on the target page set.

### 8.1 Target page set (must all score ≥ 95)

- Root: `/` (root homepage)
- HK: `/` (HK homepage), `/wan-chai/`, `/cyberport/`, `/gymnastics/`, and each of the 8 gymnastics sub-pages
- SG: `/` (SG homepage), `/katong-point/`, `/weekly-classes/`, each of 3 zone pages, `/prodigy-camps/`

### 8.2 Performance levers — Phase 7 actions

| Lever | Status entering Phase 7 | Phase 7 action |
|-------|------------------------|----------------|
| Hero `<Image priority>` | Done (Phase 3/4) | Verify on ALL market homepages + location pages. Ensure only the above-fold hero carries `priority` — non-hero images must NOT have it. |
| `sizes` attribute on hero images | Partial | Add correct `sizes` string to all hero `<Image>` components. Pattern: `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1200px"` — adjust to actual breakpoints. Missing `sizes` is the primary LCP blocker. |
| Mux VideoPlayer behind `dynamic({ ssr:false })` | Done (HK hero) | Verify SG hero follows identical pattern. Verify `/_design/` page score regression is expected and NOT counted (not a primary page). |
| Suspense boundaries for heavy client interactions | Partial | Audit booking form components. Add `<Suspense fallback={<FormSkeleton />}>` around `BookingForm` client component on all book-a-trial routes. |
| Non-hero images NOT using `priority` | Unknown | Audit. Any `<Image priority>` below the fold blocks LCP preload. Remove `priority` from all non-hero images. |
| No render-blocking external scripts | Done (no external scripts Phase 7) | Verify clean in Lighthouse report. Note: GA4 script added in Phase 8 — defer that work. |
| Font preload | Done (`next/font/google`) | No action. |
| Tailwind CSS purge | Automatic | No action. |

### 8.3 Lighthouse measurement approach

Manual Chrome DevTools Lighthouse, cold cache, mobile preset, throttled 3G. Measure on latest Vercel preview deploy. Lighthouse CI automation is a stretch goal — not a gate for Phase 7 success criteria.

**Target thresholds:**
- Performance: ≥ 95
- Accessibility: ≥ 95
- Best Practices: ≥ 95
- SEO: ≥ 95
- LCP: < 2.5s
- INP: < 200ms
- CLS: < 0.1

### 8.4 Known acceptable Lighthouse exclusions

- `/_design/` gallery page: expected 55–81 (Mux bootup). Not a primary page. Excluded from Phase 7 gate.
- Preview deploy header noise (X-Robots-Tag): does not affect score; expected on preview.

---

## 9. llms.txt Content Structure (per property)

### 9.1 Root property llms.txt content outline

```markdown
# ProActiv Sports

> {one-paragraph summary of ProActiv Sports: founded 2011, HK + SG, gymnastics and multi-sport for children 2-16, brand entities ProGym and Prodigy}

## About
- [Brand](https://proactivsports.com/brand/): Company history, leadership, and brand story
- [Coaching Philosophy](https://proactivsports.com/coaching-philosophy/): Safety, Progression, Confidence methodology

## Markets
- [Hong Kong](https://hk.proactivsports.com/): ProGym Wan Chai and ProGym Cyberport — weekly gymnastics, camps, parties
- [Singapore](https://sg.proactivsports.com/): Prodigy @ Katong Point — weekly classes, camps, MultiBall wall

## Contact
- [Contact](https://proactivsports.com/contact/): Market-routed enquiry form for HK and SG

## Optional
- [News](https://proactivsports.com/news/): Press and brand updates
- [Careers](https://proactivsports.com/careers/): Join the ProActiv coaching team
```

### 9.2 HK property llms.txt content outline

```markdown
# ProActiv Sports Hong Kong

> {one-paragraph summary: ProGym Wan Chai (15/F The Hennessy, 256 Hennessy Road) and ProGym Cyberport (5,000 sq ft, opened August 2025), children's gymnastics and sports specialist since 2011, ages 12 months to adult}

## Programmes
- [Gymnastics](https://hk.proactivsports.com/gymnastics/): Structured weekly gymnastics for ages 12 months to adult — 8 levels from Toddlers to Competitive
- [Holiday Camps](https://hk.proactivsports.com/holiday-camps/): Easter, Summer, and Christmas camp programmes
- [Birthday Parties](https://hk.proactivsports.com/birthday-parties/): Exclusive venue hire, coach-hosted
- [School Partnerships](https://hk.proactivsports.com/school-partnerships/): In-school gymnastics and sports programmes

## Venues
- [ProGym Wan Chai](https://hk.proactivsports.com/wan-chai/): 15/F The Hennessy, 256 Hennessy Road, Wan Chai, Hong Kong
- [ProGym Cyberport](https://hk.proactivsports.com/cyberport/): 5,000 sq ft purpose-built venue, Cyberport, Pokfulam, Hong Kong (opened August 2025)

## Coaches
- [Hong Kong Team](https://hk.proactivsports.com/coaches/): Led by Monica, Director of Sports

## Book
- [Book a Free Trial](https://hk.proactivsports.com/book-a-trial/): Free 30-minute assessment for new students

## Optional
- [Blog](https://hk.proactivsports.com/blog/): Editorial content for Hong Kong families
- [FAQ](https://hk.proactivsports.com/faq/): Frequently asked questions
- [Competitions](https://hk.proactivsports.com/competitions-events/): Competitions and events calendar
```

### 9.3 SG property llms.txt content outline

```markdown
# Prodigy by ProActiv Sports Singapore

> {one-paragraph summary: Prodigy @ Katong Point (451 Joo Chiat Road, Level 3), Singapore's only MultiBall wall, weekly sports classes, Prodigy holiday camps, and birthday parties for children aged 2–16}

## Programmes
- [Weekly Classes](https://sg.proactivsports.com/weekly-classes/): Movement, Sports + MultiBall, and Climbing zones for ages 2–16
- [Prodigy Camps](https://sg.proactivsports.com/prodigy-camps/): Themed, multi-activity, and gymnastics holiday camps
- [Birthday Parties](https://sg.proactivsports.com/birthday-parties/): Exclusive Katong Point venue hire with MultiBall access
- [School Partnerships](https://sg.proactivsports.com/school-partnerships/): IFS and in-school sports programmes

## Venue
- [Katong Point](https://sg.proactivsports.com/katong-point/): 451 Joo Chiat Road, Level 3, Singapore 427664 — Singapore's only MultiBall wall

## Coaches
- [Singapore Team](https://sg.proactivsports.com/coaches/): Led by Haikel, Head of Sports

## Book
- [Book a Free Trial](https://sg.proactivsports.com/book-a-trial/): Free trial class for new students

## Optional
- [Blog](https://sg.proactivsports.com/blog/): Editorial content for Singapore families
- [FAQ](https://sg.proactivsports.com/faq/): Frequently asked questions
- [Events](https://sg.proactivsports.com/events/): Upcoming events at Katong Point
```

### 9.4 llms-full.txt expansion rule

For each H2 section link in `llms.txt`, `llms-full.txt` expands with the full prose content of that page in clean Markdown. Minimum content for Phase 7 (static, from data files):
- Programme descriptions from `HK_GYMNASTICS_PROGRAMMES` / `SG_ZONES` / `SG_CAMP_TYPES`
- Venue addresses, opening hours, and NAP from venue data constants
- Coach bios from `HK_COACHES` / `SG_COACHES`
- FAQ answers from `HK_FAQ_ITEMS` / `SG_FAQ_ITEMS`

The goal: an LLM consuming `llms-full.txt` can answer any factual question about ProActiv without fetching additional URLs.

---

## 10. Test Architecture

### 10.1 New test files (Wave 0 — all start RED)

| File | What it tests |
|------|--------------|
| `tests/unit/schema.test.ts` | `lib/schema.ts` builder functions produce objects with required fields; FAQPage answers match visible FAQ data array; @id values match locked URIs in §4.3 |
| `tests/unit/sitemap.test.ts` | All three `sitemap.ts` handlers return arrays with correct production-origin URLs; no preview URLs; trailing slashes present |
| `tests/unit/robots.test.ts` | All three `robots.ts` handlers return `allow: '/'`; sitemap URL is production origin; no environment branching |
| `tests/unit/llms-txt.test.ts` | llms.txt route handler returns `text/plain` content-type; response body starts with `# `; response body contains blockquote (`> `); no H3 or deeper headings |
| `tests/unit/a11y.test.tsx` | axe-core zero violations on server-rendered HTML of root, HK, and SG homepages |

### 10.2 Test run commands

- Per task commit: `pnpm test:unit`
- Per wave merge: `pnpm test:unit` (full suite)
- Phase gate: Full suite green + manual Lighthouse ≥ 95 on target page set

### 10.3 Sampling rate

All five test files run in CI as part of the existing `pnpm test:unit` check (5th CI requirement from Phase 1). No new CI configuration required.

---

## 11. Requirement Traceability

| Requirement | UI surface / deliverable | §Reference |
|-------------|-------------------------|------------|
| SEO-01 | Per-page metadata via `export const metadata` or `generateMetadata` | §5, §6 |
| SEO-02 | `sitemap.ts` per property | §3.2 |
| SEO-03 | `robots.ts` per property | §3.3 |
| SEO-04 | `llms.txt` + `llms-full.txt` per property | §3.4, §9 |
| SEO-05 | JSON-LD via `lib/schema.ts` helpers across all primary pages | §4 |
| SEO-06 | Lighthouse ≥ 95 mobile on primary page set | §8 |
| SEO-07 | CWV green (LCP < 2.5s, INP < 200ms, CLS < 0.1) | §8 |
| SEO-08 | WCAG 2.2 AA — axe-core, focus ring, heading hierarchy, contrast | §7 |

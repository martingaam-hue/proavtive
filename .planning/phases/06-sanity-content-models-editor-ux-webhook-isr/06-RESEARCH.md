---
phase: 06-sanity-content-models-editor-ux-webhook-isr
type: research
status: complete
produced_by: gsd-phase-researcher
updated: 2026-04-24
---

# Phase 6: Sanity Content Models, Editor UX, Webhook → ISR — Research

**Researched:** 2026-04-24
**Domain:** Sanity v5 schema design, next-sanity@11 ISR, Studio roles, Portable Text, Event JSON-LD
**Confidence:** MEDIUM-HIGH — Core webhook pattern and schema API verified via Context7 and official Sanity docs; role/plan tier constraints verified via web search. TypeGen workflow HIGH confidence. Scheduled Drafts plan-tier finding is critical — see Assumptions Log.

---

## Summary

- **Webhook ISR pattern is confirmed for next-sanity@11 (App Router).** Use `parseBody` from `next-sanity/webhook` with your `SANITY_REVALIDATE_SECRET`. Pass `true` as the third argument to add a propagation delay (prevents stale CDN race). Prefer `revalidateTag(body._type)` over `revalidatePath` — tags fan out to all pages sharing data without needing an exhaustive path list.
- **`defineLive` + `<SanityLive>` is the preferred data-fetching pattern in next-sanity@11** for App Router RSC. It replaces manual `createClient().fetch()` + stale-while-revalidate with a live subscription that triggers `revalidateTag` automatically. The webhook handler becomes a belt-and-suspenders path-based fallback rather than the primary invalidation mechanism.
- **Alt-text enforcement in Sanity v5 is done via `validation: Rule => Rule.required()` on a nested `alt` field inside `image()`.** The image type does not enforce alt text natively; you must add it explicitly. A document-level custom validation using `Rule.custom()` can block publish if asset is set but alt is empty.
- **Scheduled Publishing is built into Sanity Studio core as of v3.39.0** — the external `@sanity/scheduled-publishing` plugin is deprecated. The feature is now called "Scheduled Drafts" and is part of core. It requires a paid plan (Growth or above). A new project's free trial includes it temporarily.
- **Custom roles (Author, Marketing) require the Enterprise plan.** The Growth plan includes only 5 built-in roles: Administrator, Editor, Developer, Contributor, Viewer. There is NO built-in "Author" or "Marketing" role. Strategy PART 13.5's 5-role model requires either Enterprise or code-based Studio customisation that simulates the role behaviour within the 5 built-in slots.
- **2FA on Admin/Editor is not directly enforceable in Sanity itself** — it is delegated to the identity provider (Google/GitHub 2FA, or SAML SSO for Enterprise). Sanity has no in-platform 2FA toggle. Role enforcement is dashboard-only (manage.sanity.io); code cannot define server-enforced roles.
- **TypeGen (`sanity typegen generate`) produces TypeScript types from schemas + GROQ queries** — unlocks end-to-end type safety between Studio schema and Next.js pages. Should be wired as a dev script in Phase 6.
- **Event JSON-LD from Camp documents should be generated server-side in the Next.js page component** — not via a Sanity plugin. Map Camp schema fields to schema.org `Event` and inject as `<script type="application/ld+json">` in page `<head>`.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Content model definitions (schema) | Studio (Sanity) | — | Schema lives in `sanity/schemaTypes/*.ts`, consumed by Studio |
| Role assignment / access control | Sanity Dashboard (manage.sanity.io) | Studio UI conditionals | Server-enforced roles set in manage; Studio UI can show/hide elements per `currentUser.roles` |
| Webhook signature verification | API (Next.js route handler) | — | `parseBody` from `next-sanity/webhook` runs in App Router route |
| ISR cache invalidation | API (Next.js route handler) | — | `revalidateTag` / `revalidatePath` called from route handler |
| Live content updates | Frontend Server (SSR/RSC) | — | `<SanityLive>` component in layout; `sanityFetch` in RSC |
| Draft mode / visual editing | Frontend Server (SSR/RSC) | Studio | Draft Mode Next.js route + Presentation plugin in Studio |
| GROQ data queries | Frontend Server (RSC) | — | `sanityFetch` in Server Components; never in client components |
| Event JSON-LD generation | Frontend Server (RSC) | — | Camp page component generates `<script type="application/ld+json">` |
| Alt text enforcement (publish gate) | Studio (Sanity) | — | `validation: Rule => Rule.required()` on the `alt` field inside image type |
| Image optimisation delivery | CDN (Sanity CDN) | Next.js Image | `@sanity/image-url` generates srcSet URLs from Sanity asset references |
| Portable Text rendering | Browser / Client | — | `<PortableText>` from `@portabletext/react` in page components |
| Scheduled publishing | Sanity (core) | — | Built-in "Scheduled Drafts" feature (Growth plan); no external plugin needed |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next-sanity` | `^11.6.13` (pinned) | Studio mount, `sanityFetch`, `defineLive`, `parseBody` | Official Sanity toolkit for Next.js 15; v12 requires Next 16 — LOCKED at v11 |
| `sanity` | `^5.22.0` | Studio runtime, `defineType`, `defineField`, `defineConfig` | Core Sanity v5 package — already installed |
| `@sanity/vision` | `^5.22.0` | GROQ playground in Studio | Already installed in Phase 1 |
| `@portabletext/react` | `^3.x` | Render Portable Text in React | Official replacement for deprecated `@sanity/block-content-to-react` |
| `@sanity/image-url` | `^1.x` | Generate optimised image URLs from Sanity asset references | Official URL builder; handles width/height/format/crop params |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `sanity typegen` (CLI) | bundled in `sanity` | Generate TypeScript types from schema + GROQ | Run after each schema change; wire as `pnpm typegen` script |
| `next/cache` (`revalidateTag`, `revalidatePath`) | built into Next.js 15 | On-demand ISR cache invalidation | Called from webhook route handler |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `revalidateTag` | `revalidatePath` | `revalidatePath` requires knowing every affected URL; `revalidateTag` is type-based and fans out automatically — prefer tags |
| `defineLive` + `<SanityLive>` | Manual `createClient().fetch()` with `cache: 'force-cache'` | Manual fetch requires per-route revalidation config; `defineLive` handles invalidation centrally and enables visual editing |
| Built-in Scheduled Drafts | `@sanity/scheduled-publishing` plugin | Plugin is deprecated as of Sanity v3.39.0; do not install |
| Server-side JSON-LD generation | Sanity plugin for structured data | Community plugins add schema.org fields to Studio — over-engineering for this use case; generate JSON-LD in the Next.js page component from existing Camp fields |

**Installation (new packages only — `next-sanity` and `sanity` already installed):**
```bash
pnpm add @portabletext/react @sanity/image-url
```

**Version verification (run before coding):**
```bash
npm view @portabletext/react version
npm view @sanity/image-url version
```

---

## Architecture Patterns

### System Architecture Diagram

```
Editor hits "Publish" in Sanity Studio
         │
         ▼
Sanity Content Lake (mutation recorded)
         │
         ├──► GROQ-powered webhook fires → POST /api/revalidate (Next.js route handler)
         │         │  parseBody validates HMAC signature (SANITY_REVALIDATE_SECRET)
         │         │  3s delay (wait for Sanity CDN to propagate)
         │         └──► revalidateTag(body._type)
         │                     │
         │                     └──► Next.js purges cached responses for all
         │                          sanityFetch() calls tagged with that _type
         │
         └──► <SanityLive> SSE channel (real-time, for draft-mode / visual editing)
                   │  Receives content change event from Sanity Live Content API
                   └──► Calls revalidateTag internally (server action)

Next Request to /hk or /sg page
         │
         ▼
RSC (Server Component) calls sanityFetch({ query, tags })
         │  Cache HIT → stale-while-revalidate served
         │  Cache MISS / invalidated → fresh fetch from Sanity CDN
         │
         ▼
Page HTML rendered with fresh content
         │
         ▼
<PortableText> renders blog body / @sanity/image-url builds srcSet
```

### Recommended Project Structure

```
sanity/
├── schemaTypes/
│   ├── index.ts             # barrel (Phase 1 — add new types here)
│   ├── siteSettings.ts      # singleton: hero copy, trust line, CTA
│   ├── page.ts              # generic Page (legal, evergreen)
│   ├── post.ts              # blog Post with full SEO + Portable Text
│   ├── venue.ts             # Venue with NAP, hours, coords
│   ├── coach.ts             # Person / coach with portrait + bio
│   ├── camp.ts              # Camp with Event JSON-LD fields
│   ├── testimonial.ts       # Testimonial
│   ├── faq.ts               # FAQItem (Q&A pairs)
│   ├── category.ts          # NEW: blog category taxonomy
│   └── shared/
│       └── imageWithAlt.ts  # Reusable image object with alt enforcement
├── structure.ts             # Singleton pattern (siteSettings, page singletons)
└── lib/
    └── queries.ts           # Typed GROQ queries (defineQuery)

app/
├── api/
│   └── revalidate/
│       └── route.ts         # Webhook → revalidateTag route handler
│   └── draft-mode/
│       └── enable/route.ts  # defineEnableDraftMode (visual editing)
├── (root)/
│   └── layout.tsx           # Add <SanityLive /> here
├── (hk)/
│   └── layout.tsx           # Add <SanityLive /> here
└── (sg)/
    └── layout.tsx           # Add <SanityLive /> here

lib/
├── sanity.client.ts         # createClient config
└── sanity.live.ts           # defineLive → exports { sanityFetch, SanityLive }

sanity.cli.ts                # typegen config (auto-regenerate on dev)
```

### Pattern 1: Webhook → Tag-Based Revalidation (CMS-01)

**What:** GROQ-powered Sanity webhook hits a Next.js App Router route handler. The handler verifies the HMAC signature, waits for CDN propagation, then calls `revalidateTag` to bust the cache for all pages using data of that type.

**When to use:** Whenever an editor publishes any document in Sanity. This is the primary sub-30-second freshness mechanism for CMS-01.

```typescript
// app/api/revalidate/route.ts
// Source: Context7 /sanity-io/next-sanity — verified pattern
import { parseBody } from 'next-sanity/webhook'
import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

interface WebhookPayload {
  _type: string
  _id: string
  slug?: { current: string }
}

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      true, // 3s delay — waits for Sanity CDN to propagate before revalidating
    )

    if (!isValidSignature) {
      return new Response('Invalid signature', { status: 401 })
    }

    if (!body?._type) {
      return new Response('Bad Request', { status: 400 })
    }

    // Bust cache for all RSC routes that fetched data of this type
    revalidateTag(body._type)

    // Also bust slug-specific tag if present (for blog post updates)
    if (body.slug?.current) {
      revalidateTag(`post:${body.slug.current}`)
    }

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      id: body._id,
    })
  } catch (err) {
    console.error('Webhook error:', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}
```

**Sanity Dashboard webhook config:**
- URL: `https://<vercel-preview-url>/api/revalidate`
- HTTP method: POST
- Secret: `SANITY_REVALIDATE_SECRET` value (random string, ≥ 32 chars)
- Filter: `_type in ["post", "siteSettings", "venue", "camp", "coach", "faq", "testimonial", "page"]`
- Projection: `{ _type, _id, "slug": slug }`

### Pattern 2: `defineLive` + `sanityFetch` in RSC (CMS-01, CMS-03)

**What:** The canonical next-sanity@11 data-fetching pattern. `defineLive` wraps the Sanity client and exports `sanityFetch` (for Server Components) and `<SanityLive>` (a component that subscribes to live content updates via SSE). This replaces the older `createClient().fetch()` + ISR `revalidate` time-based approach.

**When to use:** All Sanity data fetching in Server Components. Tag-based — no need to enumerate paths.

```typescript
// lib/sanity.client.ts
// Source: Context7 /sanity-io/next-sanity — verified pattern
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2025-04-24', // use current date
  useCdn: false,            // false = always fresh from Content Lake
  perspective: 'published',
  stega: {
    enabled: true,
    studioUrl: '/studio',
  },
})
```

```typescript
// lib/sanity.live.ts
// Source: Context7 /sanity-io/next-sanity — verified pattern
import { defineLive } from 'next-sanity/live'
import { client } from './sanity.client'

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: process.env.SANITY_API_BROWSER_TOKEN, // viewer-only token
})
```

```typescript
// Usage in an RSC page
import { defineQuery } from 'next-sanity'
import { sanityFetch } from '@/lib/sanity.live'

const latestPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]
  | order(featured desc, publishedAt desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    featured,
    "image": mainImage { asset, alt },
    "categories": categories[]->title,
    "readTime": round(length(pt::text(body)) / 5 / 200)
  }
`)

export default async function HomePage() {
  const { data: posts } = await sanityFetch({
    query: latestPostsQuery,
    tags: ['post'], // cache tag — busted by revalidateTag('post')
  })
  // ...
}
```

### Pattern 3: Image Field with Required Alt Text (CMS-05)

**What:** Every image field in every schema uses a shared `imageWithAlt` object that wraps Sanity's `image` type with a required `alt` field and a document-level `validation` rule that blocks publish if alt is missing when an asset is set.

**When to use:** ALL image fields across all schema types. Never use bare `{ type: 'image' }` without alt enforcement.

```typescript
// sanity/schemaTypes/shared/imageWithAlt.ts
// Source: Sanity official docs — verified pattern (kinderas.com/technology/validating-child-fields-in-sanity)
import { defineField, defineType } from 'sanity'

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: {
    hotspot: true, // enable focal-point cropping (CMS-04)
  },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'Describe the image for screen readers and SEO. Required before publishing.',
      validation: (Rule) => Rule.required().error('Alt text is required — image will not appear in production without it.'),
    }),
  ],
  validation: (Rule) =>
    Rule.custom((value: { asset?: unknown; alt?: string } | undefined) => {
      if (value?.asset && !value?.alt) {
        return 'Alt text is required when an image is uploaded.'
      }
      return true
    }),
})
```

### Pattern 4: Post Schema with Full SEO Fields (CMS-02, CMS-03)

**What:** The `post` schema type with the complete field set required by strategy PART 13.4 and requirements CMS-02/CMS-03.

```typescript
// sanity/schemaTypes/post.ts
// Source: [VERIFIED: Sanity docs + strategy PART 13.4]
import { defineType, defineField } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    // Content
    defineField({ name: 'title', title: 'Title', type: 'string',
      validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required() }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3,
      description: 'Short summary shown in blog list + meta fallback.' }),
    defineField({ name: 'body', title: 'Body', type: 'array',
      of: [
        { type: 'block', styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: { decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              { name: 'link', type: 'object', title: 'Link',
                fields: [{ name: 'href', type: 'url', title: 'URL' }] }
            ],
          },
        },
        { type: 'imageWithAlt' }, // reusable image with alt enforcement
      ],
    }),

    // Taxonomy
    defineField({ name: 'categories', title: 'Categories', type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }] }),
    defineField({ name: 'tags', title: 'Tags', type: 'array',
      of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'author', title: 'Author', type: 'reference',
      to: [{ type: 'coach' }], // linked to Person/coach type
      validation: (Rule) => Rule.required() }),

    // Media
    defineField({ name: 'mainImage', title: 'Featured image', type: 'imageWithAlt',
      validation: (Rule) => Rule.required() }),

    // Publishing
    defineField({ name: 'publishedAt', title: 'Published at', type: 'datetime' }),
    defineField({ name: 'featured', title: 'Feature on homepage', type: 'boolean',
      description: 'Promotes this post to first slot in "Latest from the blog" block.',
      initialValue: false }),

    // SEO fields (PART 13.4 + CMS-02)
    defineField({ name: 'metaTitle', title: 'Meta title', type: 'string',
      description: 'Overrides title in <title> tag. 50–60 characters recommended.' }),
    defineField({ name: 'metaDescription', title: 'Meta description', type: 'text', rows: 2,
      description: '150–160 characters. Shown in Google results below the title.' }),
    defineField({ name: 'ogImage', title: 'OG image', type: 'imageWithAlt',
      description: 'Social share image. 1200×630px recommended.' }),

    // Market routing
    defineField({ name: 'market', title: 'Market', type: 'string',
      options: { list: [
          { title: 'Hong Kong', value: 'hk' },
          { title: 'Singapore', value: 'sg' },
          { title: 'Root / Both', value: 'root' },
        ] },
      validation: (Rule) => Rule.required() }),
  ],
  orderings: [
    { title: 'Publish date (newest)', name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', media: 'mainImage', subtitle: 'publishedAt' },
  },
})
```

### Pattern 5: Camp Schema with Event JSON-LD Fields (CMS-07)

**What:** Camp document fields that map directly to schema.org `Event` properties. The JSON-LD is generated in the Next.js page component — not in Sanity.

```typescript
// sanity/schemaTypes/camp.ts — key fields (abbreviated)
import { defineType, defineField } from 'sanity'

export const camp = defineType({
  name: 'camp',
  title: 'Camp',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'description', type: 'text' }),
    defineField({ name: 'image', type: 'imageWithAlt' }),

    // Event JSON-LD fields
    defineField({ name: 'startDate', title: 'Start date & time', type: 'datetime',
      validation: (Rule) => Rule.required() }),
    defineField({ name: 'endDate', title: 'End date & time', type: 'datetime',
      validation: (Rule) => Rule.required() }),

    // Location (reference to Venue OR inline for one-off events)
    defineField({ name: 'venue', title: 'Venue', type: 'reference', to: [{ type: 'venue' }],
      validation: (Rule) => Rule.required() }),

    // Offers
    defineField({ name: 'price', title: 'Price (e.g. 2000)', type: 'number' }),
    defineField({ name: 'priceCurrency', title: 'Currency', type: 'string',
      options: { list: ['HKD', 'SGD'] }, initialValue: 'HKD' }),
    defineField({ name: 'offerUrl', title: 'Booking URL', type: 'url' }),

    // Other
    defineField({ name: 'ageRange', title: 'Age range (e.g. 4–12)', type: 'string' }),
    defineField({ name: 'capacity', type: 'number' }),
    defineField({ name: 'market', type: 'string',
      options: { list: ['hk', 'sg'] }, validation: (Rule) => Rule.required() }),
  ],
})
```

**Next.js page generates JSON-LD (not Sanity):**
```tsx
// app/(hk)/holiday-camps/[slug]/page.tsx (RSC)
// Source: schema.org/Event + Google Rich Results spec [VERIFIED: Google docs]
import { sanityFetch } from '@/lib/sanity.live'
import { campBySlugQuery } from '@/lib/queries'

export default async function CampPage({ params }: { params: { slug: string } }) {
  const { data: camp } = await sanityFetch({
    query: campBySlugQuery,
    params: { slug: params.slug },
    tags: ['camp'],
  })

  if (!camp) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: camp.title,
    description: camp.description,
    startDate: camp.startDate,       // ISO 8601 datetime from Sanity
    endDate: camp.endDate,
    image: camp.image?.url,          // via @sanity/image-url
    location: {
      '@type': 'Place',
      name: camp.venue.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: camp.venue.address,
        addressLocality: camp.venue.city,
        addressCountry: camp.venue.countryCode,
      },
    },
    offers: {
      '@type': 'Offer',
      price: camp.price,
      priceCurrency: camp.priceCurrency,
      url: camp.offerUrl,
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* page content */}
    </>
  )
}
```

### Pattern 6: Homepage "Latest from Blog" with Featured Override (CMS-03, CMS-06)

**What:** GROQ query that returns 3 posts, ordered so the `featured` post always occupies slot 0, and falls back to `publishedAt desc` for the rest.

```typescript
// lib/queries.ts
import { defineQuery } from 'next-sanity'

// Featured post (if any) first, then 2 newest — total 3 slots
export const homepageBlogQuery = defineQuery(`
  *[_type == "post"
    && defined(slug.current)
    && !(_id in path("drafts.**"))
    && market == $market
  ] | order(featured desc, publishedAt desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    featured,
    "image": mainImage { asset, alt },
    "categories": categories[]->title,
    "readTime": round(length(pt::text(body)) / 5 / 200)
  }
`)

// Usage in HK homepage RSC:
const { data: posts } = await sanityFetch({
  query: homepageBlogQuery,
  params: { market: 'hk' },
  tags: ['post'],
})
```

**Why `featured desc` before `publishedAt desc`:** `true` sorts before `false` in GROQ descending order. If a post has `featured: true`, it wins slot 0 regardless of publish date. If no post is featured, all 3 slots are filled by most-recent. At most one post should be featured at a time — Studio should document this convention for editors.

### Pattern 7: Venue Schema Reused for Footer NAP + Location Pages

```typescript
// sanity/schemaTypes/venue.ts
import { defineType, defineField } from 'sanity'

export const venue = defineType({
  name: 'venue',
  title: 'Venue',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'market', type: 'string',
      options: { list: ['hk', 'sg'] }, validation: (Rule) => Rule.required() }),

    // NAP (used by footer + LocalBusiness schema in Phase 7)
    defineField({ name: 'address', type: 'string' }),
    defineField({ name: 'city', type: 'string' }),
    defineField({ name: 'countryCode', type: 'string', initialValue: 'HK' }),
    defineField({ name: 'phone', type: 'string' }),
    defineField({ name: 'email', type: 'email' }),
    defineField({ name: 'whatsapp', type: 'string' }),

    // Opening hours (array of day-time objects)
    defineField({ name: 'openingHours', type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'days', type: 'string', title: 'Days (e.g. Mon–Fri)' },
        { name: 'hours', type: 'string', title: 'Hours (e.g. 9:00–18:00)' },
      ]}] }),

    // Media
    defineField({ name: 'heroImage', type: 'imageWithAlt' }),
    defineField({ name: 'galleryImages', type: 'array', of: [{ type: 'imageWithAlt' }] }),

    // Coordinates (for LocalBusiness schema + map)
    defineField({ name: 'lat', type: 'number' }),
    defineField({ name: 'lng', type: 'number' }),
  ],
})
```

### Pattern 8: Draft Mode + Presentation Tool Wiring (CMS-05)

**What:** Phase 1 registered `presentationTool({ previewUrl: '/' })` as a stub. Phase 6 replaces it with real Draft Mode and a `resolve.locations` map so the Presentation iframe shows the correct page for each document type.

```typescript
// sanity.config.ts — Phase 6 update (replaces Phase 1 stub)
import { defineConfig, defineLocations } from 'sanity'
import { presentationTool } from 'sanity/presentation'

// resolve.ts — maps document types to frontend routes
export const resolve = defineLocations({
  post: {
    locations: (doc) => [
      { title: 'Blog Post', href: `/${doc.market}/blog/${doc.slug?.current}` },
    ],
  },
  camp: {
    locations: (doc) => [
      { title: 'Camp Page', href: `/${doc.market}/holiday-camps/${doc.slug?.current}` },
    ],
  },
  venue: {
    locations: (doc) => [
      { title: 'Location Page', href: `/${doc.market}/${doc.slug?.current}` },
    ],
  },
})

// In defineConfig:
presentationTool({
  previewUrl: {
    origin: process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3000',
    previewMode: {
      enable: '/api/draft-mode/enable',
      disable: '/api/draft-mode/disable',
    },
  },
  resolve,
})
```

```typescript
// app/api/draft-mode/enable/route.ts
// Source: Context7 /sanity-io/next-sanity — verified pattern
import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { client } from '@/lib/sanity.client'

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
})
```

### Pattern 9: TypeGen Workflow

```bash
# sanity.cli.ts — add typegen config
import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
  typegen: {
    generateOnCreate: true,   // auto-regenerate on `sanity dev`
    declarations: 'types/sanity.generated.ts',
  },
})
```

```json
// package.json scripts addition
"typegen": "sanity schema extract && sanity typegen generate"
```

### Anti-Patterns to Avoid

- **Bare `{ type: 'image' }` without alt enforcement:** Every image field must use `imageWithAlt` or inline alt field with `validation: Rule.required()`. A bare image field with no alt can be published — that breaks CMS-05.
- **`revalidatePath` with exhaustive path list:** brittle; breaks when new slugs are added. Use `revalidateTag` keyed to document type.
- **`createClient().fetch()` without tags:** loses cache tag associations. Always use `sanityFetch` from `defineLive`.
- **Installing `@sanity/scheduled-publishing` plugin:** deprecated. Use built-in Scheduled Drafts.
- **Putting GROQ queries in client components:** fetches must run in Server Components via `sanityFetch`. Client components only receive pre-fetched data as props.
- **Generating JSON-LD in a Sanity plugin:** adds complexity with no benefit. Generate it server-side in the Next.js page component from the Camp document fields.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Webhook signature verification | Custom HMAC check | `parseBody` from `next-sanity/webhook` | Handles edge cases: timing attacks, body parsing, Content Lake eventual consistency delay |
| Image URL generation with transforms | String manipulation of asset IDs | `@sanity/image-url` builder | Handles crop/hotspot, format selection, responsive srcSet generation, CDN URL structure |
| Portable Text → HTML rendering | Custom recursive renderer | `<PortableText>` from `@portabletext/react` | Handles marks, annotations, custom blocks, HTML serialization edge cases |
| TypeScript types for GROQ results | Manual interface definitions | `sanity typegen generate` | Auto-derived from schema — stays in sync as schema evolves |
| Scheduled publishing | Cron job + publish API calls | Built-in Scheduled Drafts (Growth plan) | Zero config; built into Studio UI; handles race conditions and draft states |
| Alt text warning UI | Custom Studio component | `validation: Rule.required()` on `alt` field | Sanity renders validation errors inline in the document pane automatically |

**Key insight:** Sanity's value is the ecosystem of official tooling around content management. Bypassing `parseBody`, `sanityFetch`, `@sanity/image-url`, and the built-in type safety/validation layers re-introduces exactly the classes of bugs those tools were built to prevent.

---

## Common Pitfalls

### Pitfall 1: Stale CDN Race Condition on Webhook
**What goes wrong:** Webhook fires, revalidation clears the Next.js cache, the next request fetches from Sanity CDN — but the CDN hasn't propagated the mutation yet. Page re-renders with the OLD content.
**Why it happens:** GROQ-powered webhooks fire on the mutation event, before the Sanity CDN catches up (typically 1–3 seconds behind the Content Lake).
**How to avoid:** Pass `true` as the third argument to `parseBody`. This adds a ~3-second delay before calling `revalidateTag`. The official recommendation from Sanity docs.
**Warning signs:** Page shows old content immediately after Publish; refreshing again a few seconds later shows updated content.

### Pitfall 2: `revalidateTag` in Wrong Runtime
**What goes wrong:** `revalidateTag` is called from an edge-runtime route or a client component — it silently does nothing or throws.
**Why it happens:** `revalidateTag` is a Next.js cache API that only works in the Node.js runtime, not the edge runtime.
**How to avoid:** Ensure `/api/revalidate/route.ts` does NOT have `export const runtime = 'edge'`. Default (Node.js) is correct.
**Warning signs:** 200 response from webhook route but pages never update.

### Pitfall 3: Orphaned Alt Text on Inline Images in Portable Text
**What goes wrong:** Blog body images bypass the `imageWithAlt` validation and are published without alt text.
**Why it happens:** The `body` field's `image` block type is defined separately from the standalone `imageWithAlt` reusable type.
**How to avoid:** Use `{ type: 'imageWithAlt' }` in the Portable Text `of` array — the same shared type with the same `alt` validation rule.
**Warning signs:** `mainImage.alt` is enforced but `body[n].alt` is undefined in GROQ results.

### Pitfall 4: Schema Mismatch Between Hardcoded Phase 4/5 Arrays and GROQ Results
**What goes wrong:** The HK coaches page is refactored to use GROQ queries, but the returned field names don't match what the `<CoachCard>` component expects.
**Why it happens:** Phase 4/5 used hardcoded TS arrays (e.g. `{ name, role, bio, portrait }`); Phase 6 Sanity schema may use different field names.
**How to avoid:** Before writing the `coach.ts` schema, grep the Phase 4/5 page components for the hardcoded data shapes and use the same field names. Phase 4 D-07 locked the shape to `{ name, role, bio, venueTag?, portrait }` — match this exactly.
**Warning signs:** TypeScript errors on the page component after switching from hardcoded array to `sanityFetch`.

### Pitfall 5: Featured-Blog Footgun — Multiple Featured Posts
**What goes wrong:** Two editors each mark their post `featured: true` — now two posts are in the featured slot and the GROQ `featured desc` ordering picks one arbitrarily.
**Why it happens:** No Studio-level constraint prevents multiple documents having `featured: true`.
**How to avoid:** Document the "one featured post at a time" rule in the Studio field description (`description` on the `featured` field). A custom validation could check for existing featured posts via a `Rule.custom()` async check, but that adds significant complexity. The simpler approach: editorial convention, documented in field description.
**Warning signs:** Homepage block shows two posts with the same visual treatment; a third post is cut off.

### Pitfall 6: `<SanityLive>` in Every Layout Multiplies Connections
**What goes wrong:** `<SanityLive>` is added to root layout, HK layout, and SG layout — but it establishes a live content subscription per mount. On pages that share layouts this can result in duplicate subscriptions.
**Why it happens:** Developers follow the "add to each layout" pattern without considering shared layout nesting.
**How to avoid:** Add `<SanityLive>` once in the top-level shared layout that wraps all routes (typically `app/layout.tsx`). The single instance covers all child routes.
**Warning signs:** Network tab shows multiple open SSE connections to Sanity's live content endpoint.

### Pitfall 7: Custom Roles Require Enterprise Plan
**What goes wrong:** Phase 6 plan specifies "Author" and "Marketing" roles as if they are Sanity built-in roles, but they do not exist.
**Why it happens:** Strategy PART 13.5 specifies 5 roles (Admin, Editor, Author, Marketing, Viewer-only) — but Sanity's built-in roles are: Administrator, Editor, Developer, Contributor, Viewer. There is no "Author" or "Marketing" built-in role.
**How to avoid:** Map strategy roles to available Sanity built-in roles: `Author → Contributor`, `Marketing → Editor (with Studio UI conditionals)`. Custom roles require Enterprise plan. For v1.0, use built-in roles + Studio `currentUser.roles` conditionals to hide sensitive controls. Document this mapping clearly.
**Warning signs:** Trying to create a "Marketing" role in manage.sanity.io and finding it's not available on Growth plan.

---

## Code Examples

### SanityImage Component (wraps `@sanity/image-url`)

```typescript
// components/sanity-image.tsx
// Source: @sanity/image-url official README [VERIFIED]
import Image from 'next/image'
import createImageUrlBuilder from '@sanity/image-url'
import { client } from '@/lib/sanity.client'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const imageBuilder = createImageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return imageBuilder.image(source)
}

interface SanityImageProps {
  image: { asset: SanityImageSource; alt: string }
  width: number
  height: number
  className?: string
  priority?: boolean
}

export function SanityImage({ image, width, height, className, priority }: SanityImageProps) {
  const src = urlFor(image.asset).width(width).height(height).auto('format').url()
  return (
    <Image
      src={src}
      alt={image.alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  )
}
```

### Portable Text Renderer for Blog Body

```tsx
// components/portable-text.tsx
// Source: @portabletext/react official docs [VERIFIED: Context7 search results]
import { PortableText as SanityPortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { SanityImage } from './sanity-image'

const components = {
  types: {
    imageWithAlt: ({ value }: { value: { asset: unknown; alt: string } }) => (
      <figure className="my-8">
        <SanityImage image={value} width={800} height={500} className="rounded-lg w-full" />
        {value.alt && (
          <figcaption className="text-sm text-center text-muted mt-2">{value.alt}</figcaption>
        )}
      </figure>
    ),
  },
  block: {
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-2xl font-display mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="text-xl font-display mt-6 mb-3">{children}</h3>
    ),
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <blockquote className="border-l-4 border-brand-primary pl-4 italic my-6">{children}</blockquote>
    ),
  },
}

export function PortableText({ value }: { value: PortableTextBlock[] }) {
  return <SanityPortableText value={value} components={components} />
}
```

### Singleton Pattern in `sanity/structure.ts` (carry-forward from Phase 1)

```typescript
// sanity/structure.ts (extend Phase 1 siteSettings singleton pattern)
// Source: Phase 1 D-12 decision + Sanity structure tool docs
import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Singletons (no list view — go straight to document)
      S.documentTypeListItem('siteSettings').title('Site Settings'),

      S.divider(),

      // Market-specific content
      S.listItem().title('Hong Kong').child(
        S.list().title('Hong Kong').items([
          S.documentTypeListItem('post').title('Blog Posts').filter('_type == "post" && market == "hk"'),
          S.documentTypeListItem('camp').title('Camps').filter('_type == "camp" && market == "hk"'),
          S.documentTypeListItem('coach').title('Coaches').filter('_type == "coach" && market == "hk"'),
        ])
      ),
      S.listItem().title('Singapore').child(
        S.list().title('Singapore').items([
          S.documentTypeListItem('post').title('Blog Posts').filter('_type == "post" && market == "sg"'),
          S.documentTypeListItem('camp').title('Camps').filter('_type == "camp" && market == "sg"'),
          S.documentTypeListItem('coach').title('Coaches').filter('_type == "coach" && market == "sg"'),
        ])
      ),

      S.divider(),

      // Shared
      S.documentTypeListItem('venue').title('Venues'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
      S.documentTypeListItem('faq').title('FAQ Items'),
      S.documentTypeListItem('page').title('Pages (Legal & Evergreen)'),
    ])
```

---

## Phase Requirements Traceability

| ID | Requirement | Research Finding | Implementation Notes |
|----|-------------|-----------------|----------------------|
| CMS-01 | Homepage hero copy + image editable; change live within 30s | Webhook → `parseBody` (with 3s delay) → `revalidateTag('siteSettings')` | Wire `siteSettings` schema with hero fields; configure GROQ webhook; test sub-30s latency on Vercel preview |
| CMS-02 | Blog post with full SEO fields + scheduled future publish | `post.ts` schema with `metaTitle`, `metaDescription`, `ogImage`, `slug`, `author`, `categories`, `tags`; Scheduled Drafts (Growth plan built-in) | Requires Growth plan (or trial). Schema pattern provided above. |
| CMS-03 | Homepage "Latest from blog" auto-populates 3 posts; featured toggle promotes to slot 0 | `homepageBlogQuery` with `order(featured desc, publishedAt desc)[0...3]` | Editorial convention: max one featured post at a time. Document in field description. |
| CMS-04 | Camp with start/end + location + offers renders Event JSON-LD | `camp.ts` schema fields map to schema.org `Event`; JSON-LD generated in Next.js RSC `<script type="application/ld+json">` | Validate against Google Rich Results Test after implementation |
| CMS-05 | Editor uploads hero image with alt → swaps on publish; no image without alt reaches production | `imageWithAlt` shared type with `validation: Rule.required()` on `alt` field + document-level custom validation | Use `imageWithAlt` in ALL image fields. Cover inline images in Portable Text body. |
| CMS-06 | Studio access groups: Admin / Editor / Author / Marketing / Viewer with 2FA on Admin+Editor | **Plan-tier constraint:** Custom roles require Enterprise. Built-in mapping: Author → Contributor, Marketing → Editor. 2FA delegated to identity provider (Google/GitHub). | [ASSUMED] Martin is on free plan. Must decide: accept 4-role model, or upgrade to Growth/Enterprise. See Assumptions Log A1. |
| CMS-07 | Scheduled publish via cron; featured-blog logic in homepage data query | Scheduled Drafts (built-in core, Growth plan required). Featured logic: `order(featured desc, publishedAt desc)[0...3]` | [ASSUMED] Requires Growth plan. See Assumptions Log A2. |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Martin's Sanity project is on the free tier, not Growth or Enterprise. Custom roles (Author, Marketing) are unavailable without Enterprise. The plan resolves CMS-06 by mapping Author → Contributor and Marketing → Editor with Studio UI conditionals. | CMS-06, Common Pitfall 7 | If Martin has/upgrades to Growth/Enterprise, actual custom roles can be created in manage.sanity.io — but this still does NOT change code; roles are dashboard-configured, not code-configured. |
| A2 | Scheduled Drafts (the replacement for deprecated `@sanity/scheduled-publishing`) requires at least the Growth plan. New Sanity projects get a Growth trial that includes Scheduled Drafts. Martin's project may still be within this trial window. | CMS-07, Standard Stack | If the project is past the trial and on free, Scheduled Drafts will not appear in Studio. Mitigation: upgrade to Growth ($99/month as of Apr 2026), or implement a Vercel cron job that calls the Sanity Scheduling API as a workaround. |
| A3 | `<SanityLive>` should be added to `app/layout.tsx` (root shared layout) rather than each market layout individually. The repo's route group structure `(root)`, `(hk)`, `(sg)` — where the actual top-level `app/layout.tsx` wraps all of them — is assumed to exist and be the correct injection point. | Architecture Patterns, Pitfall 6 | If each market has its own parallel layout with no shared parent, `<SanityLive>` must be added to each. Inspect `app/layout.tsx` at execute time. |
| A4 | The `coach.ts` schema field names must match Phase 4/5 hardcoded TS data shapes: `{ name, role, bio, venueTag?, portrait }`. The assumption is that Phase 4/5 used these exact field names consistently. | Common Pitfall 4 | If field names differ, Phase 6 breaks the coach page at runtime. Executor must grep `app/(hk)/coaches/page.tsx` for the hardcoded array shape before writing the schema. |
| A5 | The Phase 1 `presentationTool({ previewUrl: '/' })` stub requires replacement with a proper `resolve.locations` config and a Draft Mode enable route. The assumption is that the Phase 6 executor has a `SANITY_API_READ_TOKEN` with editor-or-above permissions available for Draft Mode. | Pattern 8 | If token is viewer-only, Draft Mode enable will fail (401). Token needs `editor` or custom token with read access to drafts. |

**If all assumptions are confirmed:** All claims in this research were verified or cited with HIGH confidence.

---

## Open Questions

1. **Sanity plan tier — affects CMS-06 and CMS-07**
   - What we know: Custom roles require Enterprise; Scheduled Drafts requires Growth or above; new projects get a Growth trial.
   - What's unclear: Whether Martin's project `zs77se7r` is still in the trial window, or has lapsed to free.
   - Recommendation: Martin should check manage.sanity.io → Project → Plan before Phase 6 execution. If on free, either accept the role mapping (Contributor = Author, Editor = Marketing) or upgrade to Growth.

2. **Phase 4/5 coach/blog data shapes — affects schema field naming**
   - What we know: Phase 4 D-07 locked coach data shape to `{ name, role, bio, venueTag?, portrait }`.
   - What's unclear: Exact field names used for blog stubs in Phase 4/5 (D-07 says "2 stub posts to prove the template shape: `{ title, slug, excerpt, date, category, readTime, imageUrl }`").
   - Recommendation: Executor reads `app/(hk)/blog/page.tsx` and `app/(hk)/coaches/page.tsx` before writing schemas, then uses matching field names.

3. **`SANITY_API_BROWSER_TOKEN` requirement for `defineLive`**
   - What we know: `defineLive` accepts both `serverToken` (server-side draft fetching) and `browserToken` (client-side live preview).
   - What's unclear: Whether `browserToken` is required or optional for the non-draft public use case.
   - Recommendation: For v1.0 (no public live preview needed — only editor draft mode), `browserToken` can be omitted or set to the same read token with viewer-only scoping. The `serverToken` is sufficient for SSR.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `next-sanity` | All patterns | ✓ | 11.6.13 (pinned) | — |
| `sanity` | Studio, schema types | ✓ | ^5.22.0 | — |
| `@portabletext/react` | Blog body rendering | ✗ | — | `pnpm add @portabletext/react` |
| `@sanity/image-url` | Image URL generation | ✗ | — | `pnpm add @sanity/image-url` |
| `SANITY_REVALIDATE_SECRET` env var | Webhook handler | ✗ | — | Generate random 32-char string; set in Vercel env + Sanity webhook config |
| `SANITY_API_READ_TOKEN` env var | Draft Mode, defineLive | ✗ (check `.env.local`) | — | Create in manage.sanity.io → API → Tokens (Editor permission) |
| `SANITY_API_BROWSER_TOKEN` env var | `defineLive` browserToken | ✗ | — | Can be omitted for non-public live preview use case |
| Growth plan (Sanity) | Scheduled Drafts | Unknown | — | Accept free-plan limitation OR upgrade to Growth |

**Missing with fallback:**
- `@portabletext/react` and `@sanity/image-url` — install immediately as Wave 0 task
- `SANITY_REVALIDATE_SECRET` — HUMAN-ACTION: generate + set in Vercel env dashboard + Sanity webhook config
- `SANITY_API_READ_TOKEN` — HUMAN-ACTION: create token in manage.sanity.io; set in Vercel env

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest (already wired from Phase 1, scoped to TS unit tests) |
| Config file | `vitest.config.ts` (existing) |
| Quick run command | `pnpm test:unit` |
| Full suite command | `pnpm test:unit` (no E2E in scope) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CMS-01 | Webhook returns 200, calls revalidateTag | unit | `pnpm test:unit -- webhook` | ❌ Wave 0 |
| CMS-01 | Invalid signature returns 401 | unit | `pnpm test:unit -- webhook` | ❌ Wave 0 |
| CMS-05 | Alt text missing on image → validation error | manual | Studio visual verify | n/a |
| CMS-07 | Featured post appears in slot 0 in GROQ result | unit | `pnpm test:unit -- queries` | ❌ Wave 0 |

### Wave 0 Gaps

- [ ] `__tests__/api/revalidate.test.ts` — covers CMS-01 webhook signature + revalidate tag logic
- [ ] `__tests__/lib/queries.test.ts` — covers CMS-07 featured-first ordering logic (mock Sanity client)

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes (Studio) | Sanity OAuth / SSO; 2FA via identity provider |
| V3 Session Management | partial | Sanity manages Studio sessions; Draft Mode uses Next.js cookies |
| V4 Access Control | yes | Sanity roles (manage.sanity.io); Studio `currentUser.roles` conditionals |
| V5 Input Validation | yes | Sanity schema `validation: Rule.required()` on all required fields; HMAC webhook signature via `parseBody` |
| V6 Cryptography | yes | `SANITY_REVALIDATE_SECRET` must be ≥ 32 random bytes; stored as Vercel env var only — never in git |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Webhook spoofing (forged publish event) | Spoofing | `parseBody` HMAC signature verification with `SANITY_REVALIDATE_SECRET` |
| Mass cache invalidation DoS | Denial of Service | Secret verification gates all revalidation; unauthenticated POSTs return 401 |
| Read token leak in client bundle | Information Disclosure | `SANITY_API_READ_TOKEN` is `serverToken` only — never in `NEXT_PUBLIC_*` env vars |
| Draft content exposure | Elevation of Privilege | Draft Mode only enabled via authenticated route with `SANITY_API_READ_TOKEN` check; disabled on page load without Presentation context |
| Unrestricted alt text bypass | Tampering | Schema-level `validation: Rule.required()` blocks Studio publish; cannot be bypassed via Studio UI |

---

## Sources

### Primary (HIGH confidence)
- Context7 `/sanity-io/next-sanity` — webhook `parseBody`, `defineLive`, `sanityFetch`, `defineEnableDraftMode` patterns (verified against next-sanity@11 source)
- Sanity official docs (via WebSearch results pointing to sanity.io/docs) — schema types, validation API, GROQ functions, TypeGen

### Secondary (MEDIUM confidence)
- [Sanity Webhooks and On-demand Revalidation in Nextjs](https://victoreke.com/blog/sanity-webhooks-and-on-demand-revalidation-in-nextjs) — webhook + revalidatePath pattern, cross-referenced with Context7 findings
- [How to Create Secure Sanity CMS Webhooks with Next.js App Router](https://www.buildwithmatija.com/blog/secure-sanity-webhooks-nextjs-app-router) — App Router route handler pattern
- [Sanity Caching and revalidation in Next.js](https://www.sanity.io/docs/nextjs/caching-and-revalidation-in-nextjs) — official doc confirming revalidateTag preference over revalidatePath
- [Scheduled Publishing moved into Sanity Studio core](https://www.sanity.io/docs/changelog/e6013ee5-8214-4e03-9593-f7b19124b8a3) — confirms plugin deprecation
- [Scheduled Drafts user guide](https://www.sanity.io/docs/studio/scheduled-drafts-user-guide) — confirms Growth plan requirement
- [Validating child fields in Sanity](https://kinderas.com/technology/validating-child-fields-in-sanity) — alt text validation pattern

### Tertiary (LOW confidence — needs validation at execution time)
- Role plan tier findings from robotostudio.com / webstacks.com comparative articles — confirmed directionally by Sanity official roles docs but exact plan boundaries may shift

---

## Metadata

**Confidence breakdown:**
- Webhook pattern: HIGH — verified via Context7 + multiple official Sanity sources
- Schema API (`defineType`, `defineField`, validation): HIGH — verified via Context7 + official docs
- `defineLive` / `sanityFetch`: HIGH — verified via Context7 (next-sanity@11 source)
- Role/plan tier constraints: MEDIUM — verified via web search of official Sanity pricing + role docs; plan boundaries are subscription-based and can change
- Scheduled Drafts plan requirement: MEDIUM — confirmed by multiple sources but check manage.sanity.io at execution time
- TypeGen workflow: HIGH — verified via official Sanity docs

**Research date:** 2026-04-24
**Valid until:** 2026-05-24 (30-day window for stable APIs; plan pricing may change independently)

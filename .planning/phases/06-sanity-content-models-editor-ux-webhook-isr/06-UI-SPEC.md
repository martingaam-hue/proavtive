---
phase: 6
slug: sanity-content-models-editor-ux-webhook-isr
status: approved
reviewed_at: 2026-04-24T00:00:00Z
shadcn_initialized: true
preset: style=radix-nova + base-color=neutral + css-variables=true + rsc=true + iconLibrary=lucide
created: 2026-04-24
typography_inheritance_exemption: true
typography_inherited_from: 02-UI-SPEC.md §1.6
typography_net_new_sizes: 0
typography_net_new_weights: 0
requirements: [CMS-01, CMS-02, CMS-03, CMS-04, CMS-05, CMS-06]
upstream_inputs:
  - 06-CONTEXT.md (D-01..D-26 locked)
  - 06-RESEARCH.md (9 patterns, 7 pitfalls, validation architecture, security domain)
  - 05-UI-SPEC.md (SG component patterns, BookingForm, SGNav)
  - 04-UI-SPEC.md (HK component patterns, coach data shape D-07, blog field names)
  - 02-UI-SPEC.md (token + primitive contract — Phase 6 inherits, does not redefine)
  - PROJECT.md (palette navy #0f206c + red #ec1c24 + green #0f9733, perf budget, CMS independence hard requirement)
  - REQUIREMENTS.md CMS-01..CMS-07
  - strategy.md §PART 13.2 (editable vs static map), §PART 13.3 (dynamic sync), §PART 13.4 (blog editor), §PART 13.5 (roles), §PART 13.6 (security)
---

# Phase 6 — UI Design Contract (Sanity Content Models, Editor UX, Webhook → ISR)

> **Scope reminder:** Phase 6 is a *CMS activation and data-layer phase, not a visual composition phase*. No new page layouts are invented here — the pages built in Phases 3–5 already exist. Phase 6 replaces the hardcoded TypeScript data arrays in those pages with live Sanity queries and makes the Studio usable for a non-technical editor. **No new design-system tokens.** **No new shadcn primitives.** The two new Next.js UI components (`<SanityImage>` and `<PortableText>`) are utility/rendering components, not design-system primitives — they follow existing token contracts. **The Sanity Studio itself is the primary UI product of Phase 6** — structure, field labels, descriptions, and validation messages are the UX deliverables. This contract binds planner and executor; deviation requires a Rule 1 correction in the plan SUMMARY.

---

## 0. How this contract is used

| Consumer | What they pull from here |
|----------|--------------------------|
| `gsd-planner` | §2 Studio structure spec · §3 schema field specs + UI labels · §4 data-fetching component specs · §5 blog post page specs · §6 webhook + draft-mode API specs · §7 env-var contracts + HUMAN-ACTION gates |
| `gsd-executor` | §3 exact field label/description copy · §4 `<SanityImage>` + `<PortableText>` prop interfaces · §5 blog post page component spec · §6 webhook route and draft-mode spec · §8 requirement traceability |
| `gsd-ui-checker` | §9 six-pillar quality checklist · §10 editorial-asymmetry pass (N/A for Phase 6 — no new page layouts) · §11 requirement traceability |
| `gsd-ui-auditor` | Post-execute diff of `sanity/schemaTypes/**`, `lib/sanity.*.ts`, `lib/queries.ts`, `components/sanity-image.tsx`, `components/portable-text.tsx`, `app/api/revalidate/route.ts`, `app/api/draft-mode/enable/route.ts`, `app/hk/blog/[slug]/page.tsx`, `app/sg/blog/[slug]/page.tsx` against this contract |

---

## 1. Inheritance from Phases 1–5 — what Phase 6 does NOT redefine

Phase 6 is binding on the inherited contract. Re-asking these would create drift.

| Inherited from | Where to find it | What Phase 6 does with it |
|----------------|------------------|---------------------------|
| Brand palette (navy/red/green/sky/yellow/cream) as `--color-brand-*` | Phase 2 UI-SPEC §1.2 + `app/globals.css` `@theme { }` | `<PortableText>` uses `border-brand-navy/30` for blockquote; `text-muted-foreground` for body. `<SanityImage>` inherits `rounded-lg` radius token. No raw hex. |
| Type scale (display / h1 / h2 / h3 / body-lg / body / small / label) | **Phase 2 UI-SPEC §1.6 (canonical declaration)** | `<PortableText>` maps h2→`text-2xl font-display`, h3→`text-xl font-display`, body→`text-body`, code→`font-mono`. Consumed via Phase 2-registered utilities. **Zero net-new font sizes.** |
| Font stack — Unbounded (display) + Manrope (sans) + Baloo 2 (accent) | Phase 2 UI-SPEC §1.7 | Blog post body rendered via `font-sans` (Manrope). Headings in body via `font-display` (Unbounded). No new font loads. |
| Spacing scale + section rhythm | Phase 2 UI-SPEC §1.8 | Blog post pages use `<Section size="md">` + `<ContainerEditorial width="default">` for narrow reading column. No new spacing values. |
| Radius scale | Phase 2 UI-SPEC §1.9 | `<SanityImage>` uses `rounded-lg` (8px, Phase 2 token). No new radii. |
| Phase 2 primitive inventory | Phase 2 UI-SPEC §3 | Blog post page composes `<Section>`, `<ContainerEditorial>`, `<Badge>`, `<Avatar>` from existing inventory. No new primitives. |
| Phase 3 patterns — RSC data fetching, market routing | Phase 3 UI-SPEC §5 | `sanityFetch` in RSC replaces `lib/hk-data.ts` / `lib/sg-data.ts` arrays. RSC pattern unchanged. |
| Phase 4 patterns — coach data shape, blog field names | Phase 4 UI-SPEC §5 + CONTEXT D-07 | Coach schema field names locked: `name`, `role`, `bio`, `venueTag?`, `portrait`. Blog fields updated from stub shape to GROQ shape per D-08. |
| Phase 5 patterns — SG data, VenueMap, BookingForm | Phase 5 UI-SPEC §5 | SG coach/blog/faq/venue pages refactored from `lib/sg-data.ts` arrays to `sanityFetch` queries. Component interfaces unchanged. |
| Cross-market link patterns | Phase 1 D-02 + Phase 3 Pitfall 7 | Blog post slugs link internally via `<Link href="/blog/{slug}/">` (same subdomain); cross-market footer links remain `<a href={env}>` absolute. |

**Phase 6 does NOT introduce new design tokens.** If a page appears to need one, the planner files a Phase 2.1 revision — Phase 6 stays data-wiring-pure from a design-system perspective.

**Phase 6 does NOT register new shadcn primitives.** All required shadcn components were registered in Phases 1–4.

---

## 2. Sanity Studio Structure (CMS-01, CMS-02, CMS-06)

The Studio is the primary UX deliverable of Phase 6. The structure must be navigable by a non-technical editor on day one without documentation.

### 2.1 Structure tree (`sanity/structure.ts`)

Replace Phase 1 stub entirely. Final structure:

```
Content
├── [singleton] Site Settings              ← siteSettings (root hero, trust line, CTA)
├── [singleton] HK Homepage Settings      ← hkSettings (HK hero copy, featured image)
├── [singleton] SG Homepage Settings      ← sgSettings (SG hero copy, featured image)
├── ─────────────────────────────────
├── Hong Kong
│   ├── Blog Posts (HK)                   ← post, filter: market == "hk"
│   ├── Camps (HK)                        ← camp, filter: market == "hk"
│   └── Coaches (HK)                      ← coach, filter: market == "hk"
├── Singapore
│   ├── Blog Posts (SG)                   ← post, filter: market == "sg"
│   ├── Camps (SG)                        ← camp, filter: market == "sg"
│   └── Coaches (SG)                      ← coach, filter: market == "sg"
├── ─────────────────────────────────
├── Venues                                ← all venues (Wan Chai, Cyberport, Katong)
├── Testimonials                          ← all markets
├── FAQ Items                             ← all markets, filter by market in GROQ
├── Categories                            ← blog category taxonomy
└── Pages (Legal & Evergreen)             ← page documents
```

**Singleton wiring:** `siteSettings`, `hkSettings`, `sgSettings` must be registered as singletons — no list view, fixed document IDs:
- `siteSettings` → `.documentId("siteSettings")`
- `hkSettings` → `.documentId("hkSettings")`
- `sgSettings` → `.documentId("sgSettings")`

Filter syntax for market-scoped lists: use Sanity Structure Builder `.filter()` with GROQ string literal, e.g. `'_type == "post" && market == "hk"'`. This prevents HK editors from accidentally editing SG content.

### 2.2 Document list orderings

| Document type | Default ordering in Studio |
|---|---|
| `post` | `publishedAt` desc (newest first) |
| `camp` | `startDate` asc (soonest upcoming first) |
| `coach` | `name` asc |
| `venue` | `name` asc |
| `faq` | `category` asc, then `question` asc |
| `testimonial` | `_createdAt` desc |

Define via `orderings` array in each schema's `defineType`. Aids editor navigation without filtering.

### 2.3 Document preview config

Every document type with a title + image must declare a `preview` block so list items show a thumbnail:

```typescript
preview: {
  select: { title: 'title', media: 'mainImage' },  // or 'portrait', 'heroImage', etc.
  prepare: ({ title, media }) => ({ title, media }),
}
```

For `post`: also show `subtitle: 'publishedAt'` (formatted date in list).
For `camp`: show `subtitle: 'startDate'` + `title`.
For `coach`: show `subtitle: 'role'`.
For `venue`: show `subtitle: 'market'` ('hk' or 'sg').

### 2.4 Role access model (CMS-06)

4-role model per D-03. Configured in manage.sanity.io — no code changes:

| Sanity built-in role | Strategy role it covers | What they can do |
|---|---|---|
| Administrator | Admin | Full access; invite users; delete documents; manage webhooks. 2FA enforced via Google/GitHub identity provider. |
| Editor | Editor + Marketing | Can publish all document types; can archive/delete. Covers homepage updates, blog publishing, camp management. |
| Contributor | Author / Blogger | Can create and edit drafts of all document types; cannot publish (requires Editor click). Can upload images. |
| Viewer | Viewer / Stakeholder | Read-only access to all documents and the GROQ Vision playground. Useful for client sign-off. |

**Studio UI conditionals (executor discretion):** The Sanity `currentUser.roles` API can be used to hide the `featured` toggle on `post` from Contributor role (only Editors should promote posts to homepage). This is a Sanity Studio `hidden: ({ currentUser }) => ...` field-level condition — not a server enforcement. It is a UX improvement, not a security gate.

---

## 3. Schema Field Specs + UI Labels (CMS-01, CMS-02, CMS-03, CMS-04, CMS-05)

All schemas use `defineType` / `defineField` from `'sanity'`. Every image field uses the shared `imageWithAlt` type (D-06). All required fields carry `validation: (Rule) => Rule.required()`.

### 3.1 Shared: `imageWithAlt` (`sanity/schemaTypes/shared/imageWithAlt.ts`)

| Field | Label | Type | Required | Description copy |
|-------|-------|------|----------|-------------------|
| asset | — | `image` (Sanity built-in, hotspot: true) | yes | hotspot enabled for focal-point cropping |
| alt | Alternative text | `string` | **required** | `Describe the image for screen readers and SEO. Required before publishing.` |

Document-level `validation: Rule.custom()` — blocks publish if `asset` is set but `alt` is empty. Error message: `Alt text is required when an image is uploaded.`

The `imageWithAlt` type is the only image type permitted in any schema. No bare `{ type: 'image' }` allowed anywhere.

### 3.2 `siteSettings` (root homepage singleton)

| Field | Label | Type | Required | Description copy |
|-------|-------|------|----------|------------------|
| heroHeading | Hero heading | `string` | yes | `Large display headline on the root gateway homepage hero. Max 10 words.` |
| heroSubheading | Hero subheading | `text` | no | `Supporting copy below the headline. Max 2 sentences.` |
| heroCTAPrimary | Primary CTA label | `string` | yes | `Button text for the primary market-entry call-to-action. E.g. "Enter Hong Kong".` |
| heroCTASecondary | Secondary CTA label | `string` | yes | `Button text for the secondary market-entry call-to-action.` |
| heroImage | Hero image | `imageWithAlt` | yes | `Full-bleed hero background image. Minimum 2400×1600px. Must have alt text.` |
| trustLine | Trust line | `string` | no | `Short trust cue shown below CTAs. E.g. "14 years · 3 venues · 1,000+ families."` |

Preview: `{ title: 'heroHeading', media: 'heroImage' }`.

### 3.3 `hkSettings` (HK homepage singleton)

| Field | Label | Type | Required | Description copy |
|-------|-------|------|----------|------------------|
| heroHeading | Hero heading | `string` | yes | `H1 on the HK homepage hero. Verbatim from brand strategy.` |
| heroSubheading | Hero subheading | `text` | no | `Subhead below the hero H1.` |
| heroImage | Hero image | `imageWithAlt` | yes | `Full-bleed hero image or video poster. Minimum 2400×1600px.` |
| heroCTALabel | Book CTA label | `string` | no | `Override for the primary "Book a Free Trial" button label. Leave blank to use default.` |
| featuredProgramme | Featured programme | `string` | no | `Optional: name of a programme to highlight above the programme grid. Max 50 chars.` |

Preview: `{ title: 'heroHeading', media: 'heroImage' }`.

### 3.4 `sgSettings` (SG homepage singleton)

Same shape as `hkSettings` but with SG-specific description copy:

| Field | Label | Type | Required | Description copy |
|-------|-------|------|----------|------------------|
| heroHeading | Hero heading | `string` | yes | `H1 on the Prodigy SG homepage hero.` |
| heroSubheading | Hero subheading | `text` | no | `Subhead below the Prodigy SG hero H1.` |
| heroImage | Hero image | `imageWithAlt` | yes | `Full-bleed hero image or video poster for Prodigy @ Katong Point.` |
| heroCTALabel | Book CTA label | `string` | no | `Override for the primary "Book a Free Trial" button label. Leave blank to use default.` |
| multiBallHighlight | MultiBall highlight | `string` | no | `Optional: override for the "Singapore's only MultiBall wall" trust inline. Rarely changed.` |

Preview: `{ title: 'heroHeading', media: 'heroImage' }`.

### 3.5 `post` (Blog Post — full spec)

Required fields per strategy PART 13.4 + CMS-02/CMS-03. Field ordering in Studio matches editorial workflow: Content → Taxonomy → Publishing → SEO.

**Content group:**

| Field | Label | Type | Required | Description copy |
|-------|-------|------|----------|------------------|
| title | Title | `string` | yes | `Post headline shown in the blog list and at the top of the article.` |
| slug | Slug | `slug` | yes | `URL path segment. Auto-generated from title — click "Generate" then customise if needed.` options: `{ source: 'title', maxLength: 96 }` |
| excerpt | Excerpt | `text` rows: 3 | no | `Short summary (1–2 sentences) shown in the blog list card and used as meta description fallback.` |
| body | Body | `array` (Portable Text) | no | Block styles: Normal, H2, H3, Blockquote. Marks: Strong, Emphasis, Code. Annotations: Link (url). Inline types: `imageWithAlt`. |
| mainImage | Featured image | `imageWithAlt` | yes | `Hero image for the post. Shown in blog list card and at the top of the article. 1200×630px minimum.` |

**Taxonomy group:**

| Field | Label | Type | Required | Description copy |
|-------|-------|------|----------|------------------|
| author | Author | `reference` to `coach` | yes | `Link to the coach or team member who wrote this post.` |
| categories | Categories | `array` of `reference` to `category` | no | `Add one or more categories (e.g. Gymnastics Tips, Prodigy News, Parent Guide).` |
| tags | Tags | `array` of `string` | no | `Free-form tags for filtering. Use lowercase kebab-case (e.g. toddlers, multiball, hk-camps).` options: `{ layout: 'tags' }` |
| market | Market | `string` | yes | `Which website this post belongs to. HK posts appear on hk.proactivsports.com; SG posts on sg.proactivsports.com.` options: `{ list: [{ title: 'Hong Kong', value: 'hk' }, { title: 'Singapore', value: 'sg' }] }` |

**Publishing group:**

| Field | Label | Type | Required | Description copy |
|-------|-------|------|----------|------------------|
| publishedAt | Published at | `datetime` | no | `Set a future date to hold the post as a draft until you click Publish on that date. Leave blank to publish immediately.` |
| featured | Feature on homepage | `boolean` | no | `Promotes this post to the first slot in the "Latest from the blog" section on the homepage. Only one post should be featured at a time — un-feature the current one before featuring a new post.` initialValue: false |

**SEO group:**

| Field | Label | Type | Required | Description copy |
|-------|-------|------|----------|------------------|
| metaTitle | Meta title | `string` | no | `Overrides the post title in the browser tab and Google results. 50–60 characters recommended. Leave blank to use the post title.` |
| metaDescription | Meta description | `text` rows: 2 | no | `150–160 characters. Appears in Google results below the title. Leave blank to use the excerpt.` |
| ogImage | Social share image | `imageWithAlt` | no | `Image shown when this post is shared to WhatsApp, iMessage, or social media. 1200×630px. Leave blank to use the featured image.` |

`orderings` declaration: `[{ title: 'Publish date (newest)', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }]`

Preview: `{ select: { title: 'title', media: 'mainImage', subtitle: 'publishedAt' } }`

### 3.6 `category` (blog taxonomy — new type)

Simple document. No market filter — categories can be shared across markets.

| Field | Label | Type | Required | Description copy |
|-------|-------|------|----------|------------------|
| name | Name | `string` | yes | `Category label shown in blog list badges. E.g. "Gymnastics Tips", "Prodigy News", "Parent Guide".` |
| slug | Slug | `slug` | yes | `Auto-generated from name.` options: `{ source: 'name' }` |

Preview: `{ title: 'name' }`.

### 3.7 `coach` (Person / coach — field names locked per D-07)

**CRITICAL:** Field names must match Phase 4/5 component data shapes exactly. Do not rename.

| Field | Label | Type | Required | Description copy |
|-------|-------|------|----------|------------------|
| name | Name | `string` | yes | `Full name as it appears on the coaches page and author byline.` |
| role | Role | `string` | yes | `Job title shown under the coach's name. E.g. "Head of Gymnastics", "Head of Sports".` |
| bio | Biography | `text` rows: 4 | yes | `2–3 sentence biography. Shown on the coaches page and on blog post bylines.` |
| portrait | Portrait | `imageWithAlt` | yes | `Headshot photo. Square crop, minimum 400×400px.` |
| venueTag | Venue tag | `string` | no | `Optional short venue name used for visual grouping. E.g. "Wan Chai", "Cyberport", "Katong Point".` |
| market | Market | `string` | yes | `Which market this coach belongs to.` options: `{ list: [{ title: 'Hong Kong', value: 'hk' }, { title: 'Singapore', value: 'sg' }] }` |

Preview: `{ select: { title: 'name', media: 'portrait', subtitle: 'role' } }`.

### 3.8 `venue` (Venue / location)

| Field | Label | Type | Required | Description copy |
|-------|-------|------|----------|------------------|
| name | Venue name | `string` | yes | `Full venue name as it appears in Google Business Profile. E.g. "ProGym Wan Chai".` |
| slug | Slug | `slug` | yes | `URL segment for the location page. E.g. "wan-chai", "katong-point".` options: `{ source: 'name' }` |
| market | Market | `string` | yes | `Which market this venue belongs to.` options: `{ list: ['hk', 'sg'] }` |
| address | Street address | `string` | yes | `Street address as shown in the footer and location page. E.g. "15/F The Hennessy, 256 Hennessy Road".` |
| city | City | `string` | yes | `City name. E.g. "Wan Chai" or "Singapore".` |
| countryCode | Country | `string` | yes | `ISO country code. "HK" or "SG".` initialValue: 'HK' |
| phone | Phone | `string` | no | `Local phone number in international format. E.g. "+852 xxxx xxxx".` |
| whatsapp | WhatsApp number | `string` | no | `WhatsApp number in international format without spaces. E.g. "+85298076827".` |
| openingHours | Opening hours | `array` of objects | no | Object: `{ days: string, hours: string }`. E.g. `{ days: "Mon–Fri", hours: "9:00–18:00" }`. |
| heroImage | Hero image | `imageWithAlt` | no | `Primary photo for the location page hero.` |
| galleryImages | Gallery images | `array` of `imageWithAlt` | no | `Additional venue photos for the location page gallery.` |
| lat | Latitude | `number` | no | `GPS latitude for LocalBusiness schema. Confirm against Google Maps.` |
| lng | Longitude | `number` | no | `GPS longitude for LocalBusiness schema. Confirm against Google Maps.` |

Preview: `{ select: { title: 'name', media: 'heroImage', subtitle: 'market' } }`.

### 3.9 `camp` (Camp event — Event JSON-LD fields)

| Field | Label | Type | Required | Description copy |
|-------|-------|------|----------|------------------|
| title | Camp name | `string` | yes | `Camp title as shown on the camp page and in Event rich results. E.g. "Ninja Warrior Camp".` |
| slug | Slug | `slug` | yes | `URL segment. Auto-generated from title.` options: `{ source: 'title' }` |
| description | Description | `text` rows: 4 | no | `Short description of this camp — shown on the camp page and in Google Event rich results.` |
| image | Camp image | `imageWithAlt` | no | `Hero photo for this camp's page.` |
| startDate | Start date & time | `datetime` | yes | `Camp start. Used for Event rich results — Google validates this format automatically.` |
| endDate | End date & time | `datetime` | yes | `Camp end. Must be after start date.` validation: `Rule.min(Rule.valueOfField('startDate'))` — or document-level custom. |
| venue | Venue | `reference` to `venue` | yes | `Location where this camp takes place. Links to the venue's NAP data.` |
| ageRange | Age range | `string` | no | `E.g. "4–12". Shown on the camp page.` |
| capacity | Capacity | `number` | no | `Maximum number of places. Optional — helps team track availability.` |
| price | Price | `number` | no | `Camp price in the local currency (no currency symbol). E.g. 2000 for HKD 2,000.` |
| priceCurrency | Currency | `string` | no | `Currency code. E.g. "HKD" or "SGD".` options: `{ list: ['HKD', 'SGD'] }` initialValue: 'HKD' |
| offerUrl | Booking link | `url` | no | `Direct URL to book this camp. Used in Google Event rich results.` |
| market | Market | `string` | yes | options: `{ list: ['hk', 'sg'] }` |

Preview: `{ select: { title: 'title', media: 'image', subtitle: 'startDate' } }`.

### 3.10 `testimonial`

| Field | Label | Type | Required | Description copy |
|-------|-------|------|----------|------------------|
| quote | Testimonial | `text` rows: 3 | yes | `Verbatim quote from a parent or partner. Do not paraphrase.` |
| authorName | Author name | `string` | yes | `Full name or first name + initial. E.g. "Sarah M." or "Manjula G."` |
| authorRole | Author role | `string` | no | `Optional context. E.g. "Parent of 2", "KidsFirst Foundation".` |
| market | Market | `string` | no | `Which homepage this testimonial appears on. Leave blank if used on root.` options: `{ list: ['hk', 'sg', 'root'] }` |

Preview: `{ select: { title: 'authorName', subtitle: 'market' } }`.

### 3.11 `faq` (FAQ item)

| Field | Label | Type | Required | Description copy |
|-------|-------|------|----------|------------------|
| question | Question | `string` | yes | `The question as shown to parents on the FAQ page. Must match the FAQPage schema text exactly.` |
| answer | Answer | `text` rows: 4 | yes | `The answer. Plain text only — no markdown. Must match visible DOM text exactly for Google rich results.` |
| category | Category | `string` | no | `Group this FAQ into a category. E.g. "About ProGym", "Classes & Programmes", "Birthday Parties".` |
| market | Market | `string` | yes | options: `{ list: [{ title: 'Hong Kong', value: 'hk' }, { title: 'Singapore', value: 'sg' }, { title: 'Root / Both', value: 'root' }] }` |
| sortOrder | Sort order | `number` | no | `Controls ordering within the FAQ list. Lower numbers appear first.` |

Preview: `{ select: { title: 'question', subtitle: 'market' } }`.

### 3.12 `page` (Generic page — legal/evergreen)

| Field | Label | Type | Required | Description copy |
|-------|-------|------|----------|------------------|
| title | Page title | `string` | yes | `Heading shown at the top of the page and in the browser tab.` |
| slug | Slug | `slug` | yes | `URL path segment. E.g. "privacy", "terms".` options: `{ source: 'title' }` |
| body | Body | `array` (Portable Text) | no | Same block config as `post` body. |
| metaTitle | Meta title | `string` | no | `Overrides the page title in Google results.` |
| metaDescription | Meta description | `text` rows: 2 | no | `150–160 characters for Google results.` |

Preview: `{ title: 'title' }`.

---

## 4. Data-Fetching Components (utility — not design primitives)

These two components are wiring utilities that bridge Sanity's data into the existing visual system. They must match the visual contracts of Phases 2–5.

### 4.1 `<SanityImage>` (`components/sanity-image.tsx`)

**Purpose:** Wraps `@sanity/image-url` builder + Next.js `<Image>` to render Sanity asset references with correct responsive srcSet, hotspot crop, and AVIF/WebP negotiation.

**Props interface:**

```typescript
interface SanityImageProps {
  // Sanity image asset reference with enforced alt text
  image: {
    asset: SanityImageSource
    alt: string
    hotspot?: { x: number; y: number; height: number; width: number }
  }
  // Layout dimensions
  width: number
  height: number
  // Tailwind className — caller applies radius/aspect/object-fit
  className?: string
  // Passes through to next/image for LCP elements
  priority?: boolean
  // Optional sizes string for responsive srcSet
  sizes?: string
}
```

**Behavior:**
- Generates URL via `imageBuilder.image(source).width(width).height(height).auto('format').url()`
- Respects `hotspot` data if present for focal-point crops via `.focalPoint()` on the builder
- Outputs `alt={image.alt}` — never falls back to empty string (TypeGen enforces `alt: string` non-optional)
- Does NOT apply border-radius or aspect-ratio — caller controls via `className` (e.g. `rounded-lg`, `aspect-4/3`)
- Exports `urlFor(source)` helper for callers that need the raw URL (e.g. OG image generation, JSON-LD image prop)

**Token compliance:** Uses no raw colors or spacing. Layout entirely controlled by caller's Tailwind classes.

**File:** `components/sanity-image.tsx`

### 4.2 `<PortableText>` (`components/portable-text.tsx`)

**Purpose:** Renders Sanity Portable Text blog body using `@portabletext/react` with brand-compliant typography.

**Props interface:**

```typescript
interface PortableTextProps {
  value: PortableTextBlock[]
  // Optional className for the wrapping prose container
  className?: string
}
```

**Block type → Tailwind mapping** (all classes from Phase 2 design system — no new tokens):

| Portable Text block | Tailwind classes | Phase 2 source |
|---|---|---|
| `normal` paragraph | `text-body text-foreground leading-relaxed mb-4` | §1.6 Body 16px |
| `h2` | `text-h2 font-display text-foreground mt-10 mb-4` | §1.6 H2 36px |
| `h3` | `text-h3 font-display text-foreground mt-8 mb-3` | §1.6 H3 24px |
| `blockquote` | `border-l-4 border-brand-navy/30 pl-6 italic text-muted-foreground my-6` | Phase 2 brand navy token |
| `strong` mark | `font-semibold` | Phase 2 weight policy |
| `em` mark | `italic` | standard |
| `code` mark | `font-mono text-sm bg-muted px-1 py-0.5 rounded` | Phase 2 muted token |
| `link` annotation | `text-brand-navy underline underline-offset-2 hover:text-brand-navy/80` | Phase 2 navy token |
| `imageWithAlt` custom block | `<figure>` with `<SanityImage>` + optional `<figcaption>` | §4.1 SanityImage |

**figcaption styling:** `text-small text-center text-muted-foreground mt-2` (Phase 2 §1.6 Small 14px)

**Container:** The `<PortableText>` component renders a `<div className={cn("max-w-prose", className)}>` wrapper — `max-w-prose` (65ch) provides a comfortable reading column matching editorial convention. The blog post page wraps this in `<ContainerEditorial width="default">` for consistent section rhythm.

**File:** `components/portable-text.tsx`

---

## 5. Blog Post Dynamic Pages (CMS-02, CMS-03 — new scope per D-18)

Two new RSC routes: `app/hk/blog/[slug]/page.tsx` and `app/sg/blog/[slug]/page.tsx`. These do not exist in Phase 4/5 — Phase 6 adds them.

### 5.1 Page structure

```tsx
// app/hk/blog/[slug]/page.tsx (RSC — pattern mirrors Phase 4/5 page conventions)
export default async function HKBlogPostPage({ params }: { params: { slug: string } }) {
  const { data: post } = await sanityFetch({
    query: hkBlogPostBySlugQuery,
    params: { slug: params.slug },
    tags: ['post', `post:${params.slug}`],
  })

  if (!post) notFound()

  return (
    <>
      {/* Article JSON-LD (Phase 7 full spec; Phase 6 stubs with BlogPosting type) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd(post)) }} />

      {/* Hero section */}
      <Section size="md" bg="default">
        <ContainerEditorial width="wide">
          <div className="flex gap-2 mb-4">
            {post.categories?.map((cat) => (
              <Badge key={cat} variant="secondary">{cat}</Badge>
            ))}
          </div>
          <h1 className="text-h1 font-display text-foreground mb-4">{post.title}</h1>
          {post.excerpt && (
            <p className="text-body-lg text-muted-foreground max-w-2xl mb-6">{post.excerpt}</p>
          )}
          {/* Author byline */}
          <div className="flex items-center gap-3 mb-8">
            {post.author?.portrait && (
              <SanityImage image={post.author.portrait} width={40} height={40}
                className="rounded-full w-10 h-10 object-cover" />
            )}
            <div>
              <p className="text-label font-medium text-foreground">{post.author?.name}</p>
              <p className="text-small text-muted-foreground">
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
                {post.readTime ? ` · ${post.readTime} min read` : ''}
              </p>
            </div>
          </div>
          {/* Featured image */}
          {post.mainImage && (
            <SanityImage image={post.mainImage} width={1200} height={630}
              className="rounded-xl w-full object-cover mb-10" priority />
          )}
        </ContainerEditorial>
      </Section>

      {/* Body */}
      <Section size="md" bg="default">
        <ContainerEditorial width="default">
          <PortableText value={post.body} />
        </ContainerEditorial>
      </Section>
    </>
  )
}
```

### 5.2 Visual decisions

| Element | Decision | Rationale |
|---|---|---|
| Hero section width | `ContainerEditorial width="wide"` | Title needs reading width; hero image needs space |
| Body section width | `ContainerEditorial width="default"` | Narrow reading column (65ch via `max-w-prose` in `<PortableText>`) |
| Category badges | `<Badge variant="secondary">` (yellow bg, navy text) | Matches blog list card pattern from Phase 4/5 |
| Author portrait | `<SanityImage>` 40×40, `rounded-full` | Matches `<Avatar>` pattern from Phase 2 |
| Featured image | `rounded-xl` (Phase 2 14px radius for hero/prominent surfaces) | Consistent with Phase 4/5 card image treatment |
| Date formatting | `new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(publishedAt))` | British English format consistent with brand voice |
| Read time | From GROQ `round(length(pt::text(body)) / 5 / 200)` (per RESEARCH Pattern 4 / D-09 Claude's Discretion) | No separate field; computed in GROQ |
| `notFound()` | Called when `!post` | Delegates to Next.js 404; no custom 404 needed for Phase 6 |

### 5.3 Metadata generation (`generateMetadata`)

Each blog post page exports `generateMetadata`:

```typescript
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data: post } = await sanityFetch({ query: hkBlogPostBySlugQuery, params })
  if (!post) return {}
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: post.ogImage ? [urlFor(post.ogImage.asset).width(1200).height(630).url()] : undefined,
    },
  }
}
```

Full OG/Twitter metadata is Phase 7 scope — Phase 6 wires the data source only.

### 5.4 `generateStaticParams`

Both blog post pages export `generateStaticParams` to pre-render at build time:

```typescript
export async function generateStaticParams() {
  const { data: slugs } = await sanityFetch({ query: hkBlogSlugsQuery })
  return (slugs ?? []).map(({ slug }) => ({ slug }))
}
```

This ensures published posts are ISR-rendered on first request rather than fully dynamic. Combined with `revalidateTag('post')` from the webhook, keeps LCP within budget.

### 5.5 Updated blog hub pages

`app/hk/blog/page.tsx` and `app/sg/blog/page.tsx` are updated from hardcoded stub arrays to `sanityFetch` GROQ queries. The existing card visual layout is unchanged. Blog card links now point to `/blog/{slug}/` routes created in §5.1.

The component interfaces for blog card rendering must be updated to consume the new field names per D-08:
- `date` → `publishedAt`
- `imageUrl` → `mainImage` (via `<SanityImage>`)
- `category` → `categories[0]` (first category name from the references array)

---

## 6. Webhook + Draft Mode API Routes (CMS-01, CMS-05)

### 6.1 Webhook route (`app/api/revalidate/route.ts`)

**Runtime:** Node.js (default). **MUST NOT** have `export const runtime = 'edge'` — see D-12.

**Behavior:**
1. `parseBody(req, SANITY_REVALIDATE_SECRET, true)` — verifies HMAC signature; `true` arg adds 3s CDN propagation delay (D-11).
2. Invalid signature → `401 Invalid signature`
3. Missing `_type` → `400 Bad Request`
4. `revalidateTag(body._type)` — busts cache for all `sanityFetch` calls tagged with the document type (D-10)
5. If `body.slug?.current` → also `revalidateTag('post:' + body.slug.current)` for slug-specific tags (D-13)
6. Returns `200 { revalidated: true, type, id }`
7. Errors caught, logged, return `500`

**No UI.** This is an API route only.

**Sanity webhook config (HUMAN-ACTION — Martin must configure in manage.sanity.io):**
- URL: `https://{VERCEL_PREVIEW_URL}/api/revalidate`
- HTTP method: POST
- Secret: value of `SANITY_REVALIDATE_SECRET`
- Filter: `_type in ["post", "siteSettings", "hkSettings", "sgSettings", "venue", "camp", "coach", "faq", "testimonial", "page"]`
- Projection: `{ _type, _id, "slug": slug }`
- HTTP headers: none (secret in query param handled by `parseBody`)

### 6.2 Draft Mode enable route (`app/api/draft-mode/enable/route.ts`)

Wired via `defineEnableDraftMode` from `next-sanity/draft-mode`. Uses `SANITY_API_READ_TOKEN` (must have Editor-or-above permissions).

**Behavior:** When the Presentation tool in Studio loads a preview URL, it calls this route to enable Next.js Draft Mode cookie. The page then fetches draft (unpublished) content instead of published content.

**No UI.** This is an API route only.

### 6.3 Presentation tool wiring (`sanity.config.ts`)

The Phase 1 `presentationTool({ previewUrl: '/' })` stub is replaced with:

```typescript
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
  resolve: {
    // Per D-23: maps document types to preview URLs
    post: (doc) => `/${doc.market}/blog/${doc.slug?.current}`,
    camp: (doc) => `/${doc.market}/holiday-camps/${doc.slug?.current}`,
    venue: (doc) => `/${doc.market}/${doc.slug?.current}`,
    coach: (doc) => `/${doc.market}/coaches#${doc.name?.toLowerCase().replace(/\s+/, '-')}`,
    siteSettings: () => '/',
    hkSettings: () => '/hk',  // local dev path; rewrite by middleware
    sgSettings: () => '/sg',
  },
})
```

**No stega** in Phase 6 — per D-20. Do NOT add `stega: { enabled: true }` to the Sanity client config.

---

## 7. Data-Fetching Infrastructure

### 7.1 Sanity client (`lib/sanity.client.ts`)

New file. Config:
- `projectId`: `process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!`
- `dataset`: `process.env.NEXT_PUBLIC_SANITY_DATASET!` (value: `production`)
- `apiVersion`: `'2025-04-24'`
- `useCdn`: `false` (always fetch from Content Lake — CDN handled by `defineLive`)
- `perspective`: `'published'`
- **No `stega`** (deferred per D-20)

### 7.2 Live client (`lib/sanity.live.ts`)

New file. Exports `{ sanityFetch, SanityLive }` via `defineLive`. Tokens:
- `serverToken`: `process.env.SANITY_API_READ_TOKEN` (required — Editor permission)
- `browserToken`: `process.env.SANITY_API_BROWSER_TOKEN` (optional per D-16 — can be same read token or omitted)

### 7.3 `<SanityLive>` placement (D-15)

Added once in `app/layout.tsx` (root shared layout that wraps all route groups). This prevents duplicate SSE connections per Pitfall 6.

**Executor verify:** Confirm `app/layout.tsx` is the true shared root that wraps `(root)`, `(hk)`, and `(sg)` route groups before adding `<SanityLive>`. If market layouts have no shared parent, add to each market layout.

### 7.4 GROQ query file (`lib/queries.ts`)

All queries use `defineQuery` wrapper for TypeGen compatibility. Key queries:

| Export | Used by | Filter | Tags |
|---|---|---|---|
| `homepageBlogQuery` | Root, HK, SG homepages | `market == $market`, `featured desc, publishedAt desc [0...3]` | `['post']` |
| `hkBlogListQuery` | `app/hk/blog/page.tsx` | `market == "hk"`, `publishedAt desc` | `['post']` |
| `sgBlogListQuery` | `app/sg/blog/page.tsx` | `market == "sg"` | `['post']` |
| `hkBlogPostBySlugQuery` | `app/hk/blog/[slug]/page.tsx` | `slug.current == $slug && market == "hk"` | `['post', 'post:$slug']` |
| `sgBlogPostBySlugQuery` | `app/sg/blog/[slug]/page.tsx` | `slug.current == $slug && market == "sg"` | `['post', 'post:$slug']` |
| `hkCoachesQuery` | `app/hk/coaches/page.tsx` | `market == "hk"`, `name asc` | `['coach']` |
| `sgCoachesQuery` | `app/sg/coaches/page.tsx` | `market == "sg"` | `['coach']` |
| `hkFaqQuery` | `app/hk/faq/page.tsx` | `market == "hk"`, `sortOrder asc` | `['faq']` |
| `sgFaqQuery` | `app/sg/faq/page.tsx` | `market == "sg"` | `['faq']` |
| `venueBySlugQuery` | Location pages | `slug.current == $slug` | `['venue']` |
| `siteSettingsQuery` | Root homepage | `_id == "siteSettings"` | `['siteSettings']` |
| `hkSettingsQuery` | HK homepage | `_id == "hkSettings"` | `['hkSettings']` |
| `sgSettingsQuery` | SG homepage | `_id == "sgSettings"` | `['sgSettings']` |
| `hkCampsQuery` | HK camp pages | `market == "hk"`, `startDate asc` | `['camp']` |
| `sgCampsQuery` | SG camp pages | `market == "sg"` | `['camp']` |
| `hkTestimonialsQuery` | HK homepage | `market in ["hk", "root"]` | `['testimonial']` |
| `sgTestimonialsQuery` | SG homepage | `market in ["sg", "root"]` | `['testimonial']` |

All `post` queries include `"readTime": round(length(pt::text(body)) / 5 / 200)` computed in GROQ — no separate field (D-09 Claude's Discretion).

### 7.5 TypeGen wiring (`sanity.cli.ts` + `package.json`)

`sanity.cli.ts` gets `typegen: { generateOnCreate: true, declarations: 'types/sanity.generated.ts' }`.

`package.json` gets `"typegen": "sanity schema extract && sanity typegen generate"` script.

Executor runs `pnpm typegen` after all schemas are finalized; commits `types/sanity.generated.ts` to the repo.

---

## 8. Environment Variables + HUMAN-ACTION Gates

### 8.1 New env vars required for Phase 6

| Var | Scope | Description | HUMAN-ACTION |
|-----|-------|-------------|--------------|
| `SANITY_REVALIDATE_SECRET` | Server-only | Random 32-char secret for webhook HMAC. Generate with `openssl rand -base64 32`. | Yes — set in Vercel env dashboard + in Sanity webhook config at manage.sanity.io |
| `SANITY_API_READ_TOKEN` | Server-only | Editor-permission API token from manage.sanity.io → API → Tokens. Used by Draft Mode + `defineLive` `serverToken`. | Yes — create in manage.sanity.io; set in Vercel env |
| `SANITY_API_BROWSER_TOKEN` | Server-only (optional) | Optional viewer-scoped token for `defineLive` `browserToken`. Can be same as `SANITY_API_READ_TOKEN` or omitted per D-16. | Optional |
| `NEXT_PUBLIC_VERCEL_URL` | Client + Server | Auto-injected by Vercel (`NEXT_PUBLIC_VERCEL_URL=<sha>-proactive.vercel.app`). Used in Presentation tool `origin`. Fallback to `http://localhost:3000`. | None — Vercel-injected |

**Already existing (Phase 1):**
- `NEXT_PUBLIC_SANITY_PROJECT_ID` = `zs77se7r`
- `NEXT_PUBLIC_SANITY_DATASET` = `production`

### 8.2 `.env.example` additions

Executor appends to existing `.env.example`:
```
# Phase 6: Sanity CMS activation
SANITY_REVALIDATE_SECRET=          # HUMAN-ACTION: openssl rand -base64 32; set in Vercel + manage.sanity.io webhook
SANITY_API_READ_TOKEN=             # HUMAN-ACTION: create Editor token at manage.sanity.io → API → Tokens
SANITY_API_BROWSER_TOKEN=          # Optional: viewer-only token for defineLive browserToken; can be same as READ_TOKEN
# NEXT_PUBLIC_VERCEL_URL is injected automatically by Vercel — do not set locally
```

### 8.3 Security rules (strategy §PART 13.6)

- `SANITY_REVALIDATE_SECRET` and `SANITY_API_READ_TOKEN` are **server-only** — never use `NEXT_PUBLIC_` prefix on these.
- Read token stored in Vercel env dashboard only — never committed to git.
- `SANITY_API_READ_TOKEN` must have minimum `editor` permission to enable Draft Mode (viewer permission is insufficient).
- Webhook endpoint has no rate limiting in Phase 6 — rely on HMAC signature as the primary gate; Cloudflare WAF rate limiting adds defense-in-depth in Phase 10.

---

## 9. Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | **none new in Phase 6** · inherited from Phase 1–4: `button`, `card`, `accordion`, `badge`, `avatar`, `separator`, `sheet`, `input`, `label`, `textarea`, `navigation-menu` | not required |
| Third-party registries | **none declared for Phase 6** | not applicable |

New npm packages (not shadcn):

| Package | Version | Purpose | Safety note |
|---|---|---|---|
| `@portabletext/react` | `^3.x` | Portable Text rendering in blog pages | Official Sanity package — same provenance as `sanity` core |
| `@sanity/image-url` | `^1.x` | Sanity asset URL builder | Official Sanity package |

No third-party shadcn blocks. No vetting gate required. If executor discovers a need for a third-party block, they MUST halt and return a Rule-1 revision request.

---

## 10. Checker Notes — No New Design Declarations

**Binding statement for gsd-ui-checker dimension 4 (Typography):**

Phase 6 adds **zero net-new font sizes** and **zero net-new font weights**. The `<PortableText>` component maps Portable Text block types to Phase 2-registered Tailwind utilities (`text-h2`, `text-h3`, `text-body`, `text-small`, `font-display`, `font-sans`). No new `@theme {}` declarations. No new `next/font/google` weight imports.

**Phase 6 adds zero net-new design tokens** of any kind — no colors, no spacing values, no radii beyond the Phase 2 contract.

**The blog post page layout** (`app/hk/blog/[slug]/`, `app/sg/blog/[slug]/`) is a new page composition but uses only Phase 2 primitives (`<Section>`, `<ContainerEditorial>`, `<Badge>`, `<SanityImage>`) and Phase 2 Tailwind utilities. It is explicitly not a design-system declaration — it is a page composition.

**Checker action on re-verification:** PASS dimension 4 once this note is acknowledged.

---

## 11. Checker Sign-Off (six-pillar)

- [ ] **Dimension 1 Copywriting:** Studio field label/description copy is precise and non-technical (written for client team, not developers); blog post route uses verbatim GROQ-sourced field names; no copy invented beyond field descriptions; UI copy (error messages, placeholders) uses the ProActiv brand voice (no corporate SaaS terms, British English, verb + noun pattern where applicable — e.g. `Alt text is required when an image is uploaded.`)
- [ ] **Dimension 2 Visuals:** Blog post page uses real Sanity photography via `<SanityImage>` (no hardcoded placeholder URLs in production code); editorial asymmetry on blog post page (full-width hero → narrow reading column = legitimate visual variation within a single-page layout); no new AI-SaaS aesthetic introduced; `<PortableText>` renders with real brand typography
- [ ] **Dimension 3 Color:** `<PortableText>` and blog post page use only Phase 2 semantic tokens (`text-foreground`, `text-muted-foreground`, `border-brand-navy/30`, `bg-muted`); no raw hex in new components; `<Badge variant="secondary">` for categories = yellow/navy per Phase 2 token
- [ ] **Dimension 4 Typography: PASS via inheritance exemption** — Phase 6 adds zero net-new sizes/weights. See §10 above. `<PortableText>` maps to Phase 2-registered utilities only.
- [ ] **Dimension 5 Spacing:** Blog post page uses `<Section size="md">` + `<ContainerEditorial>` wrappers — no raw `py-*` arbitrary values; `<PortableText>` uses `mb-4` / `my-6` / `my-8` within the established 4-px scale; `max-w-prose` reading column is a standard Tailwind utility, not an arbitrary value
- [ ] **Dimension 6 Registry Safety:** Only two new npm packages (`@portabletext/react`, `@sanity/image-url`) — both official Sanity packages; zero new shadcn primitives; zero third-party shadcn blocks

**Approval:** pending

---

## 12. Requirement Traceability

| Req ID | UI-SPEC section(s) |
|--------|---------------------|
| CMS-01 Homepage hero editable; sub-30s publish | §2.1 (`siteSettings`, `hkSettings`, `sgSettings` singletons); §3.2–3.4 field specs; §6.1 webhook route; §7.4 queries; §6.3 Presentation tool |
| CMS-02 Blog post with full SEO fields + scheduled publish (de-scoped) | §3.5 full `post` schema spec; §5.1–5.5 blog post page routes; §5.3 `generateMetadata` |
| CMS-03 Homepage blog block auto-populates; featured override | §7.4 `homepageBlogQuery` with `featured desc, publishedAt desc [0...3]`; §3.5 `featured` field description; §5.5 blog hub page updates |
| CMS-04 Camp → Event JSON-LD (CMS-07 in original requirements — de-scoped partially) | §3.9 `camp` schema with Event JSON-LD fields; RESEARCH Pattern 5 JSON-LD generation in RSC |
| CMS-05 Alt text gate on all images | §3.1 `imageWithAlt` shared type; §3.5–3.12 all schema image fields use `imageWithAlt`; §4.1 `<SanityImage>` enforces `alt: string` non-optional |
| CMS-06 Role-based access (4-role model) | §2.4 role access model; HUMAN-ACTION: configure roles in manage.sanity.io |
| (CMS-07 Scheduled publishing — de-scoped per D-02) | Not in Phase 6 scope; Growth plan required; field description on `publishedAt` documents the convention |

---

## 13. Decisions Map (trace to CONTEXT)

| CONTEXT Decision | UI-SPEC realization |
|------------------|---------------------|
| D-01 Free plan — plan-tier constraints | §2.4 role model (4 roles, not 5); §3.5 `featured` field + `publishedAt` editorial convention for scheduled publishing |
| D-02 Scheduled publishing de-scoped | §3.5 `publishedAt` field description documents the publish-manually convention; CMS-07 row in §12 marked de-scoped |
| D-03 4-role access model | §2.4 complete role table with Studio UI conditional note |
| D-04 Replace all 8 Phase 1 stubs | §3.2–3.12 — all 8 stubs (siteSettings, post, venue, coach, camp, testimonial, faq, page) plus 3 new types (hkSettings, sgSettings, category, imageWithAlt shared) |
| D-05 3 market settings singletons | §2.1 structure tree; §3.2–3.4 singleton field specs |
| D-06 `imageWithAlt` enforces alt on all images | §3.1 shared type spec; §3.5–3.12 all image fields reference `imageWithAlt`; §4.1 `<SanityImage>` non-optional `alt` |
| D-07 Coach field names locked | §3.7 — field names `name`, `role`, `bio`, `venueTag`, `portrait`, `market` exactly as Phase 4 D-07 |
| D-08 Blog field name reconciliation | §5.5 — blog hub pages updated to `publishedAt`, `mainImage`, `categories[0]` |
| D-09 TypeGen wired | §7.5 — `sanity.cli.ts` config + `pnpm typegen` script |
| D-10 `revalidateTag` over `revalidatePath` | §6.1 webhook route; §7.4 query `tags` arrays |
| D-11 `parseBody` 3s delay | §6.1 webhook route — `parseBody(req, secret, true)` |
| D-12 Webhook route Node.js runtime | §6.1 — explicit note: no `export const runtime = 'edge'` |
| D-13 Slug-specific tag for posts | §6.1 — `revalidateTag('post:' + body.slug.current)` |
| D-14 `sanityFetch` canonical pattern | §7.1–7.4 — all Sanity data fetching via `sanityFetch`; no bare `createClient().fetch()` |
| D-15 `<SanityLive>` once in root layout | §7.3 — placed in `app/layout.tsx` with executor verify note |
| D-16 `SANITY_API_BROWSER_TOKEN` optional | §7.2 — marked optional in `defineLive` config |
| D-17 Full wiring — all CMS types | §7.4 — complete GROQ query table covering all hardcoded data sources |
| D-18 Dynamic blog post routes added | §5.1–5.4 — full blog post page spec for both HK and SG |
| D-19 Featured-first GROQ ordering | §7.4 `homepageBlogQuery` — `featured desc, publishedAt desc [0...3]` |
| D-20 Draft Mode only, no full Visual Editing | §6.3 — no `stega: { enabled: true }` in client config |
| D-21 `NEXT_PUBLIC_VERCEL_URL` for preview | §6.3 — Presentation tool `origin` config |
| D-22 Draft Mode enable route | §6.2 — `defineEnableDraftMode` route spec |
| D-23 Presentation `resolve.locations` | §6.3 — document-type-to-route mapping table |
| D-24 Single `production` dataset | §7.1 — `dataset: 'production'` in client config |
| D-25 Camp Event JSON-LD in RSC | RESEARCH Pattern 5 is canonical; Phase 6 adds camp schema fields; camp page JSON-LD generation is executor's task |
| D-26 Plans structured for parallel execution | Wave A: schema definitions (§3); Wave B: webhook + data-fetching infra (§6–7); Wave C: frontend page wiring (§5 + page updates); Wave D: Draft Mode + Presentation (§6.2–6.3) |

---

*Phase: 06-sanity-content-models-editor-ux-webhook-isr. UI design contract drafted: 2026-04-24.*

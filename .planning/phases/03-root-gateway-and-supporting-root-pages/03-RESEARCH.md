---
phase: 03-root-gateway-and-supporting-root-pages
type: research
status: draft
produced_by: gsd-phase-researcher (background, pipelined with Phase 2 ui-phase)
updated: 2026-04-23
---

# Phase 3: Root Gateway and Supporting Root Pages — Research

**Researched:** 2026-04-23
**Domain:** Next.js 15 App Router pages / contact form email / MDX content / OG image generation / cross-subdomain navigation
**Confidence:** HIGH for Next.js patterns (verified via Context7 + official docs). MEDIUM for contact form backend (Resend pricing + API verified; spam/GDPR specifics [ASSUMED] beyond pricing page). LOW for WhatsApp/iMessage OG quirks (network access limited; guidance from training knowledge).

---

## Summary

- **Page-assembly phase, not invention phase.** Every section of the 8-section gateway homepage maps directly to a Phase 2 primitive (MarketCard, StatStrip, TestimonialCard, LogoWall, FAQItem, Section, ContainerEditorial). No new primitives are required; Phase 3 is composition work.
- **Cross-subdomain market entry is a simple `<a href>` to the absolute HK/SG URL.** No cookie-setting bridge is needed at the root-gateway level — the middleware's D-01 ladder handles market routing once the user lands on the HK/SG host. Do NOT use `?__market=` on root CTAs; that bridge is for Vercel preview-only navigation, not real user market entry.
- **Contact form backend: use Resend.** It is the cleanest Next.js 15 App Router integration (route handler + React Email), has a generous free tier (3,000 emails/month), market-routing is a single `to:` field switch based on a `market` hidden field in the form, and GDPR compliance is built-in. No vendor lock-in — the switch to a CRM in Phase 6+ is a one-line change.
- **Pre-CMS content strategy: `next-mdx-remote/rsc` for editorial pages, hardcoded TypeScript data for structured pages.** MDX gives Phase 6 Sanity migration a clean seam; the content file moves to Sanity Portable Text while the page component's renderer swaps from `MDXRemote` to a Portable Text renderer. Frontmatter conventions define the contract.
- **OG images: `opengraph-image.tsx` per route segment, generated at build time via `ImageResponse`.** Standard 1200×630 PNG. WhatsApp requires HTTPS and consumes `og:image` directly (no special format). iMessage reads the first `og:image` tag. Static generation at build time is optimal — no edge runtime cost on each share.
- **Metadata API: each page exports its own `metadata` object or `generateMetadata` function; root layout (`app/root/layout.tsx`) sets sitewide defaults; child pages shallow-override.** The `openGraph.images` array is the critical field — always provide it explicitly in child pages rather than inheriting.
- **Phase 3 ships the SEO minimum needed for SC #5 (OG previews + 200 status) but NOT the full Phase 7 SEO treatment.** Organization JSON-LD lives on the root homepage only; sitemap, robots, llms.txt, and BreadcrumbList are Phase 7 work. Planner must not scope SEO-07 or SEO-08 into Phase 3 plans.

**Primary recommendation:** Build sections top-to-bottom per PART 3 wireframe, one plan per logical group of pages. Contact backend (Resend) ships as its own plan so it can be independently tested. MDX content scaffolding is a single plan covering all 6 supporting pages.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Gateway homepage (8 sections) | Frontend Server (RSC) | CDN (Vercel static) | App Router RSC; sections are server-rendered, no client state needed above the fold |
| Dual market entry CTAs | Browser / Client | — | Absolute `<a href>` links; no JS needed (anchor tags work without hydration) |
| Market cookie on CTA click | — | — | NOT needed from root. Middleware sets cookie on `?__market=` only for preview bridge. Real market entry is host-based. |
| Supporting pages content | Frontend Server (RSC) | — | MDX rendered via `next-mdx-remote/rsc` server component; no client bundle cost |
| Contact form submission | API / Backend (Route Handler) | — | `app/api/contact/route.ts` POST handler; Resend SDK call is server-only |
| Contact form UI | Browser / Client | — | `'use client'` form component for validation + loading state; submits to route handler |
| OG image generation | Frontend Server (build-time static) | CDN (Vercel caches) | `opengraph-image.tsx` per segment; statically generated at build unless data-driven |
| Metadata (`<head>` tags) | Frontend Server (RSC) | — | Next.js metadata API: `export const metadata` or `generateMetadata()` in layout/page |
| JSON-LD (Organization schema) | Frontend Server (RSC) | — | Inline `<script type="application/ld+json">` in page component; server-rendered |
| Shared root nav + footer | Frontend Server (RSC layout) | — | `app/root/layout.tsx` wraps all root pages; nav/footer live here |
| Leadership portraits / hero | CDN (Vercel Image Opt.) | Browser | Phase 2 `next/image` pipeline with `priority` on hero; portrait JPEGs from `public/photography/` |

---

## Recommended Stack Pin

Packages to add in Phase 3 only (all others already installed from Phases 1–2):

```bash
# Contact form email
pnpm add resend @react-email/components

# MDX rendering for pre-CMS content pages
pnpm add next-mdx-remote gray-matter

# OG image — already included in next@15.5.15 as next/og (no separate install)
```

**Verified versions (npm registry, 2026-04-23):**
- `resend` → `6.12.2` [VERIFIED: npm view]
- `@react-email/components` → `0.0.x` (latest is `1.0.12` for `@react-email/components`) [VERIFIED: npm view]
- `next-mdx-remote` → `6.0.0` [VERIFIED: npm view]
- `gray-matter` → `4.0.3` [VERIFIED: npm view]
- `next/og` (ImageResponse) — bundled in Next.js 15; no extra install [VERIFIED: nextjs.org docs]

**Do NOT install:**
- `@next/mdx` — this is for static MDX page files only. `next-mdx-remote` is required because content will be read from `.mdx` files and passed as a string (enabling the Phase 6 migration to Sanity without changing the component structure).
- `nodemailer` — server-side SMTP is complex to configure on Vercel's serverless functions and has deliverability risks. Resend handles this correctly.
- `formspree` / `formspark` / `basin` — third-party form services add a redirect dance for file uploads and make market-routing harder (HK vs SG inbox selection must be done inside the form submission logic, which is trivial with a route handler but requires custom plan with form services).

---

## Research by Topic

---

### Topic 1: Gateway Homepage Architecture (GW-01)

#### Section-to-Primitive Mapping (per PART 3 wireframe)

| Section | Strategy ref | Phase 2 primitive(s) | Notes |
|---------|-------------|----------------------|-------|
| 1. HERO — brand + dual entry | PART 3 §1 | `<Section size="lg">` + `<ContainerEditorial>` + `<Image priority>` + two `<Button>` | Hero uses `priority` on the main photo for LCP. Dual CTAs are `<a>` to absolute HK/SG URLs. |
| 2. THE PROACTIV STORY | PART 3 §2 | `<Section size="md">` + `<StatStrip>` | 3–4 sentences + inline 4-stat strip (14 years / 2 cities / 3 venues / Ages 2–16). Copy from PART 6A §2. |
| 3. MARKET CARDS | PART 3 §3 | Two `<MarketCard>` in a 2-col grid | Each MarketCard links to absolute HK/SG URL. Images from `public/photography/` (HK and SG venue shots). |
| 4. WHAT WE DO | PART 3 §4 | 5 tiles using `<Card>` (shadcn) with icon + description | Icon from `lucide-react`. Tiles: Gymnastics, Sports Classes, Holiday Camps, Birthday Parties, Competitions. |
| 5. TRUST STRIP | PART 3 §5 | `<LogoWall>` + `<TestimonialCard>` | LogoWall = partner/school logos. One TestimonialCard (KidsFirst quote from PART 6A §5). |
| 6. LEADERSHIP | PART 3 §6 | Three portrait cards — variant of `<Card>` or a new `<LeadershipCard>` | Will / Monica / Haikel. Portrait photos from Phase 2 media. One-line bio. **See pitfall: LeadershipCard vs reusing existing primitives.** |
| 7. FAQ | PART 3 §7 | `<Accordion>` (shadcn) composed as `<FAQItem>` × 5 | 5 Q&A pairs from PART 6A §7. FAQPage JSON-LD adjacent. |
| 8. FINAL CTA | PART 3 §8 | `<Section size="sm">` + two `<Button>` | Repeat market entry. Support email line ("Not sure? Email hello@proactivsports.com"). |
| Footer | PART 3 §9 | New `<RootFooter>` component using `<ContainerEditorial>` | Cross-market, social links, legal links, careers, press contact. Phase 3 ships this; Phase 4/5 market footers are separate. |

**LeadershipCard decision:** Strategy PART 3 §6 calls for 3 portrait cards (Will / Monica / Haikel) with a one-line bio. The Phase 2 `<TestimonialCard>` has an avatar + quote layout — reuse is possible with different prop usage. However, the leadership use case (no quote text, prominent portrait, title + role) differs enough that a dedicated `<LeadershipCard>` is cleaner. **This is a new Phase 3 component that the planner should scope as a lightweight composition of Phase 2 primitives (Card + Avatar + Badge for role), NOT a new DS-level primitive.** It lives in `components/root/leadership-card.tsx`, not `components/ui/`.

#### Editorial Asymmetry Guidance

Per strategy PART 14.3, sections must alternate layout patterns. Suggested sequence for the gateway:
- §1 HERO: left text / right photo (split editorial)
- §2 STORY: centered narrow column + stat strip below
- §3 MARKET CARDS: 2-col symmetric (intentional exception — symmetry here reinforces "equal weight" for HK/SG)
- §4 WHAT WE DO: 5-tile row (icon tiles are one permitted exception to asymmetry; keep them compact)
- §5 TRUST STRIP: full-bleed with navy background, logo wall + single testimonial
- §6 LEADERSHIP: 3-col portrait row (asymmetry via caption length variation)
- §7 FAQ: narrow centered column with accordion
- §8 FINAL CTA: full-bleed with cream background

#### Applied guidance (for PLAN tasks)

> Build the 8 gateway sections sequentially using Phase 2 primitives from `components/ui/`. For the HERO section, add `priority` to the `<Image>` component and verify LCP < 2.5s in Lighthouse after implementation. For dual market entry CTAs, use plain `<a href="https://hk.proactivsports.com/">Enter Hong Kong</a>` elements styled as `<Button asChild>` wrappers — NOT `<Link>` (which is for same-host navigation). LeadershipCard is a Phase 3-local component (`components/root/`) composed from shadcn Card + Avatar. Do not hand-roll CSS for section layouts; compose from `<Section>` and `<ContainerEditorial>` wrappers from Phase 2.

---

### Topic 2: Cross-Market Handoff and Middleware Interaction

#### How the middleware D-01 ladder works with root CTAs

From `middleware.ts` (Phase 1, committed):
1. **Host header → authoritative market.** When a user clicks "Enter Hong Kong" and lands on `hk.proactivsports.com`, the Host header is `hk.*` → middleware routes to HK tree. No cookie needed.
2. **Cookie bridge is preview-only.** The `x-market` cookie + `?__market=` query are the Phase 1–9 *preview bridge* for Vercel Hobby plan (which doesn't expose wildcard subdomain previews). These are not user-facing UX mechanisms.
3. **Setting a cookie from the root CTA is not needed.** The Host on the destination subdomain is authoritative (D-02). Setting `x-market=hk` before navigating to `hk.proactivsports.com` would be redundant and breaks the D-02 invariant.

#### Link format recommendation

```tsx
// CORRECT — absolute href, plain anchor, styled as Button
<Button asChild variant="default" size="lg">
  <a href="https://hk.proactivsports.com/">Enter Hong Kong</a>
</Button>

// CORRECT for preview environments (plain *.vercel.app URLs)
// On preview, no HK subdomain exists — use ?__market=hk to simulate
// This logic should be driven by a NEXT_PUBLIC_HK_URL env var:
// NEXT_PUBLIC_HK_URL=https://hk.proactivsports.com (production)
// NEXT_PUBLIC_HK_URL=/?__market=hk (preview — fallback)
```

**Env-var approach for market URLs:** Define `NEXT_PUBLIC_HK_URL` and `NEXT_PUBLIC_SG_URL` in `.env.example`. In production these point to `https://hk.proactivsports.com/` and `https://sg.proactivsports.com/`. In preview environments (Phases 1–9), they use `/?__market=hk` and `/?__market=sg` which leverages the existing cookie bridge. The gateway homepage reads these from `process.env` — because they are `NEXT_PUBLIC_*` they are inlined at build time.

#### Mobile Safari / iOS PWA cross-subdomain notes

[ASSUMED] Mobile Safari treats cross-subdomain navigation as a full page load (not client-side navigation). This is correct behavior for our architecture — `<a href>` navigation to `hk.*` from the root gateway will always be a full page load, which is what we want (the HK route tree loads fresh with its own layout and middleware routing).

#### What if the user already has an `x-market` cookie?

The cookie bridge is a preview mechanism. Per D-02, once a known Host header is present, the cookie is ignored for routing decisions. A visitor arriving at root.proactivsports.com with `x-market=hk` set from a previous preview session will still see the root gateway — correct behavior.

#### Applied guidance (for PLAN tasks)

> Define `NEXT_PUBLIC_HK_URL` and `NEXT_PUBLIC_SG_URL` in `.env.example` with production values (`https://hk.proactivsports.com/`, `https://sg.proactivsports.com/`). Also document preview values in README preview-testing recipe (already referenced in Phase 1 01-CONTEXT.md). Gateway CTAs use `<a href={process.env.NEXT_PUBLIC_HK_URL}>` — not `<Link>`. Do not set any market cookie from root CTA click handlers.

---

### Topic 3: Contact Form Backend (GW-06, SC #3)

#### Decision: Resend

**Winner: Resend + React Email + Next.js Route Handler.**

| Criterion | Resend | Postmark | Nodemailer | Form services (Formspree etc.) |
|-----------|--------|----------|------------|-------------------------------|
| Next.js 15 integration | Native SDK, verified route handler pattern | SDK + manual SMTP config | Manual, SMTP secrets | Redirect-based, no server control |
| Market routing (HK vs SG inbox) | `to:` field switched by form's hidden `market` field — trivial | Same | Same | Requires separate forms or webhook |
| GDPR | Built-in per pricing page | EU data residency add-on | Depends on server | Varies |
| Free tier | 3,000 emails/month, 100/day | 100/month (trial) | N/A (your SMTP costs) | 50–250 submissions/month |
| Deliverability | DKIM/SPF/DMARC managed | Excellent | Self-managed | Managed |
| Spam protection | Honeypot + rate limit needed | Same | Same | Built-in (but friction risk) |
| Phase 6 CRM migration | Drop-in: change `to:` to CRM webhook URL | Same | More complex | Harder |

[VERIFIED: resend.com/pricing] — free tier: 3,000 emails/month, 100/day, 1 domain, GDPR compliant.
[VERIFIED: resend.com docs] — Next.js App Router route handler pattern confirmed.
[ASSUMED] — Postmark's deliverability is industry-leading but the free trial is only 100 emails. For Phase 3 (preview/testing only), Resend's free tier is more than adequate.

#### Route Handler Pattern

```typescript
// app/api/contact/route.ts
import { Resend } from 'resend';
import { ContactEmailHK } from '@/emails/contact-hk';
import { ContactEmailSG } from '@/emails/contact-sg';

const resend = new Resend(process.env.RESEND_API_KEY);

const INBOXES = {
  hk: process.env.CONTACT_INBOX_HK!, // e.g. 'enquiries-hk@proactivsports.com'
  sg: process.env.CONTACT_INBOX_SG!, // e.g. 'enquiries-sg@proactivsports.com'
} as const;

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, phone, message, market } = body;

  if (!['hk', 'sg'].includes(market)) {
    return Response.json({ error: 'Invalid market' }, { status: 400 });
  }

  const to = INBOXES[market as keyof typeof INBOXES];
  const EmailComponent = market === 'hk' ? ContactEmailHK : ContactEmailSG;

  const { data, error } = await resend.emails.send({
    from: 'ProActiv Sports Website <noreply@proactivsports.com>',
    to: [to],
    replyTo: email,
    subject: `New enquiry from ${name} — ${market.toUpperCase()} website`,
    react: EmailComponent({ name, email, phone, message }),
  });

  if (error) {
    return Response.json({ error }, { status: 500 });
  }
  return Response.json({ success: true, id: data?.id });
}
```

#### Spam protection for affluent-parent audience

The goal is minimal friction for real users while blocking bots. Recommended approach (no CAPTCHA):
1. **Honeypot field** — a hidden `<input name="bot-trap" tabIndex={-1} />` that real users never fill. Server rejects any submission where this field has a value.
2. **Rate limiting** — use Vercel's built-in edge rate limiting on the API route, or a simple in-memory debounce (`x-forwarded-for` header check). Phase 3 ships the honeypot; formal rate limiting waits for Phase 10 (Cloudflare WAF).
3. **No CAPTCHA (reCAPTCHA, hCAPTCHA)** — friction is unacceptable for this audience. The Phase 10 Cloudflare WAF + bot management will handle aggressive bots at the edge.

#### Form Client Component structure

```
app/root/contact/
├── page.tsx           — RSC shell: metadata + JSON-LD (ContactPoint)
├── contact-form.tsx   — 'use client' form with validation + loading state + market selector
└── opengraph-image.tsx
```

The `contact-form.tsx` submits via `fetch` to `/api/contact`. A hidden `<input name="market" value={selectedMarket} />` carries the HK/SG selection. The market selector is a UI toggle above the form (flag + label: "Enquire about Hong Kong" / "Enquire about Singapore").

#### `.env.example` additions

```bash
# Resend (contact form backend)
RESEND_API_KEY=                     # from Resend dashboard
CONTACT_INBOX_HK=                   # HK enquiries email address
CONTACT_INBOX_SG=                   # SG enquiries email address
```

#### Applied guidance (for PLAN tasks)

> Install `resend` and `@react-email/components`. Create `app/api/contact/route.ts` as a POST handler. Add `RESEND_API_KEY`, `CONTACT_INBOX_HK`, `CONTACT_INBOX_SG` to `.env.example`. The contact page (`app/root/contact/page.tsx`) is an RSC that imports a `'use client'` form component. The form includes a honeypot field, market selector (HK/SG toggle), and submits JSON to the API route. No CAPTCHA. SC #3 is verified by submitting a test form for each market on the preview URL and checking the respective inbox.

---

### Topic 4: MDX Content Strategy for Pre-CMS Pages

#### Why `next-mdx-remote` over `@next/mdx`

| Approach | `@next/mdx` | `next-mdx-remote/rsc` |
|----------|-------------|----------------------|
| MDX file colocation | `.mdx` files ARE the page file | `.mdx` files are data — page is a TSX component |
| Phase 6 migration | Must convert file → Sanity document; page component changes | Content string moves to Sanity; page component swaps `<MDXRemote source={mdxString}>` for `<PortableText value={portableText}>` |
| Custom component injection | `mdx-components.tsx` global | Per-call `components` prop — can inject Phase 2 primitives |
| Frontmatter | Not natively; needs rehype plugin | `parseFrontmatter: true` option — built-in |
| App Router / RSC | Yes | Yes (import from `next-mdx-remote/rsc`) |

`next-mdx-remote/rsc` wins because the Phase 6 migration seam is cleaner: the content file moves to Sanity; the page component rendering logic changes from `MDXRemote` to `PortableText`; the page's URL, metadata, and layout are untouched.

#### Content colocation pattern

```
app/root/
├── brand/
│   ├── page.tsx               — RSC: reads content.mdx + renders with MDXRemote
│   ├── content.mdx            — page content (frontmatter + MDX body)
│   └── opengraph-image.tsx
├── coaching-philosophy/
│   ├── page.tsx
│   ├── content.mdx
│   └── opengraph-image.tsx
├── news/
│   ├── page.tsx               — static list of press mentions (hardcoded data array)
│   └── opengraph-image.tsx
├── careers/
│   ├── page.tsx               — evergreen "join us" page + optional listings array
│   ├── content.mdx
│   └── opengraph-image.tsx
├── contact/
│   ├── page.tsx               — RSC shell
│   ├── contact-form.tsx       — 'use client'
│   └── opengraph-image.tsx
├── privacy/
│   ├── page.tsx
│   └── content.mdx
└── terms/
    ├── page.tsx
    └── content.mdx
```

**`/news/` exception:** News at Phase 3 is a hardcoded array of press mentions (TypeScript `const pressItems = [...]` in the page file). This is simpler than MDX for list data and also has a clean Phase 6 migration path (data moves to a Sanity `Press` document type; `pressItems` is replaced with a GROQ query). The question of what "news" means at Phase 3 is an open question for the discuss phase (see Topic 11).

#### Frontmatter convention

```yaml
---
title: "About ProActiv Sports | Brand Story & Mission"
description: "ProActiv Sports is a children's gymnastics and sports specialist founded in Hong Kong in 2011. Read our brand story, meet the founders, and understand our mission."
lastUpdated: "2026-04-23"
ogImage: "/photography/brand-hero.webp"   # Phase 2 processed image from public/photography/
---
```

The `page.tsx` reads frontmatter via `gray-matter`, uses `title` and `description` in `generateMetadata()`, and passes `ogImage` to the route segment's `opengraph-image.tsx` (or uses it directly in the `<Image>` hero).

#### Page component pattern

```typescript
// app/root/brand/page.tsx
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { MDXRemote } from 'next-mdx-remote/rsc'
import matter from 'gray-matter'
import type { Metadata } from 'next'
import { Section } from '@/components/ui/section'
import { ContainerEditorial } from '@/components/ui/container-editorial'

async function getContent() {
  const raw = await readFile(join(process.cwd(), 'app/root/brand/content.mdx'), 'utf8')
  return matter(raw)
}

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await getContent()
  return {
    title: data.title,
    description: data.description,
    openGraph: { title: data.title, description: data.description, images: [data.ogImage] },
  }
}

export default async function BrandPage() {
  const { content, data } = await getContent()
  return (
    <Section size="md">
      <ContainerEditorial>
        <h1 className="text-h1 font-display">{data.title}</h1>
        <MDXRemote
          source={content}
          components={{
            // Inject Phase 2 primitives so MDX can use them
            // e.g. <StatStrip /> from PART 6A copy
          }}
        />
      </ContainerEditorial>
    </Section>
  )
}
```

[VERIFIED: hashicorp/next-mdx-remote docs via Context7] — `next-mdx-remote/rsc` exports an async `MDXRemote` component that is a valid RSC. `parseFrontmatter: true` is an option but using `gray-matter` separately gives more control for `generateMetadata`.

#### Applied guidance (for PLAN tasks)

> Install `next-mdx-remote` and `gray-matter`. Create `content.mdx` files for: `/brand/`, `/coaching-philosophy/`, `/careers/`, `/privacy/`, `/terms/`. Use the `getContent()` + `generateMetadata()` pattern above. Inject Phase 2 primitives via the `components` prop of `MDXRemote` where the page copy calls for them (e.g., `<StatStrip>` in brand page). `/news/` ships as a hardcoded TypeScript array (not MDX) at Phase 3.

---

### Topic 5: OG Image + Social Preview Strategy (SC #5)

#### Next.js 15 mechanism

[VERIFIED: nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image]

- **File convention:** `opengraph-image.tsx` colocated in the route segment directory.
- **Static generation (default):** Images are generated at build time and cached. This is ideal — no edge compute cost per share, and the image URL is stable.
- **Size:** `export const size = { width: 1200, height: 630 }` — standard OG size. This is the recommended default.
- **Format:** `export const contentType = 'image/png'` — PNG is safest for cross-platform compatibility.
- **Font loading:** Use `readFile(join(process.cwd(), 'app/fonts/bloc-bold-regular.woff2'))` to load the brand font (Bloc Bold TTF or WOFF2) into `ImageResponse`. Check: Satori (the underlying renderer) requires TrueType-compatible font data; WOFF2 must be decompressed to raw TTF bytes first. [ASSUMED] The simplest approach is to keep a `.ttf` copy of Bloc Bold specifically for OG image generation, separate from the WOFF2 used for web serving.

#### WhatsApp-specific behavior

[ASSUMED — not verified via network access; from training knowledge of OG spec]:
- WhatsApp reads `og:image` tag. The image must be served over HTTPS (all Vercel deployments satisfy this).
- Recommended dimensions: 1200×630 or 1200×628. WhatsApp crops to a landscape rectangle; the 1200×630 format is safe.
- File size: WhatsApp caches aggressively. Generated PNG from `ImageResponse` should be under 300KB for reliable rendering. Keep `ImageResponse` JSX simple (background color + logo + page title + brand tagline — no heavy embedded photos).
- WhatsApp does NOT respect `twitter:image` — always use `og:image`.

#### iMessage-specific behavior

[ASSUMED — training knowledge]:
- iMessage reads `og:image` from the first occurrence in `<head>`. Reads `og:title` and `og:description` for the preview card.
- No special image size requirement beyond OG standard (1200×630 works).
- iMessage unfurls on send; requires HTTPS (Vercel satisfies this).

#### Per-page OG image approach

Each of the 7 root pages gets a distinct OG image generated from `opengraph-image.tsx`. The template is:
- Navy background (`#0f206c`)
- ProActiv logo (white SVG, loaded from `public/assets/logo.svg`)
- Page title (Bloc Bold, white, large)
- Tagline line (Mont, cream, smaller)

This is a single shared template function `createRootOgImage(title, tagline)` called from each page's `opengraph-image.tsx`. **Do not embed photography** in OG images (file size risk; also requires Sharp base64 conversion which adds complexity).

#### Build-time vs runtime generation

Static generation at build time (default) is correct for Phase 3. All root pages have fixed titles — no dynamic data needed. The `opengraph-image.tsx` files have no `export const dynamic = 'force-dynamic'` — they use the default static generation.

#### Root layout OG fallback

`app/root/layout.tsx` should export a base `metadata` object with a fallback OG image (the root homepage's OG image). Child pages that export their own `metadata.openGraph.images` override this. [VERIFIED: nextjs.org docs — metadata merging is shallow at the `openGraph` object level; child pages must provide the full `openGraph` object, not just `images`].

```typescript
// app/root/layout.tsx — base metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://proactivsports.com'),  // CRITICAL for absolute OG URLs
  title: { default: 'ProActiv Sports', template: '%s | ProActiv Sports' },
  description: 'Children\'s gymnastics and sports in Hong Kong and Singapore. Since 2011.',
  openGraph: {
    siteName: 'ProActiv Sports',
    locale: 'en_GB',
    type: 'website',
  },
};
```

**CRITICAL:** `metadataBase` must be set in the root layout. Without it, relative OG image paths become invalid URLs and WhatsApp/iMessage previews break. [VERIFIED: nextjs.org docs — metadataBase is required for relative metadata URLs to resolve correctly].

#### Applied guidance (for PLAN tasks)

> Set `metadataBase: new URL('https://proactivsports.com')` in `app/root/layout.tsx`. Each root page exports its own `metadata` object with explicit `openGraph.images`. Create a shared `createOgImage(title, tagline)` utility (`lib/og-image.tsx`) that each `opengraph-image.tsx` calls. OG image template: navy background, white logo, page title in Bloc Bold. Keep generated PNG under 300KB. Keep a `.ttf` version of Bloc Bold at `app/fonts/bloc-bold.ttf` for Satori/ImageResponse font loading (separate from WOFF2 used for web).

---

### Topic 6: Root Navigation + Footer (SC #2)

#### Where they live

`app/root/layout.tsx` is the correct location — it wraps all 7 root pages in a single shared layout. The layout renders:
1. `<RootNav>` — at the top
2. `{children}` — page content
3. `<RootFooter>` — at the bottom

Both `<RootNav>` and `<RootFooter>` are RSC components (no `'use client'` needed unless a mobile menu toggle requires state — if so, the toggle button is a client component inside an otherwise-server nav).

#### Nav composition

```
RootNav
├── Logo (link to /)
├── Desktop nav links: About → /brand/, Coaching → /coaching-philosophy/, News → /news/, Careers → /careers/, Contact → /contact/
├── Dual market CTAs: "Enter HK →" and "Enter SG →" (always visible — small/secondary on inner pages, prominent on homepage)
└── Mobile: hamburger → Sheet/Drawer from shadcn
```

The dual market CTAs appear in the nav on all root pages (SC #1 requires them "above the fold" only on the homepage — the nav satisfies this on inner pages). On the homepage, the hero section has the large market CTAs; the nav has smaller versions.

**Skip-link for accessibility:** `<a href="#main-content" className="sr-only focus:not-sr-only ...">Skip to main content</a>` as the first child of `<body>`. Required for WCAG AA keyboard navigation. The `<main id="main-content">` wraps `{children}` in the layout.

#### Footer composition

```
RootFooter
├── Logo + brand tagline
├── Nav columns: Company (Brand, Philosophy, News, Careers), Legal (Privacy, Terms), Contact
├── Market links: "ProActiv Sports Hong Kong →" and "Prodigy by ProActiv Sports Singapore →"
├── Social icons (Facebook, Instagram, LinkedIn — from lucide-react or brand SVG)
└── Copyright + legal fine print
```

Footer uses `<Section size="sm">` + `<ContainerEditorial>` to maintain spacing rhythm consistency with page sections.

#### Applied guidance (for PLAN tasks)

> Create `components/root/root-nav.tsx` (RSC; mobile menu toggle is a client sub-component using shadcn Sheet). Create `components/root/root-footer.tsx` (RSC). Wire both into `app/root/layout.tsx`. The layout exports `metadata` base. Add `<a href="#main-content">` skip-link before `<RootNav>` and `<main id="main-content">` wrapper around `{children}`. Nav dual-market CTAs use `process.env.NEXT_PUBLIC_HK_URL` / `NEXT_PUBLIC_SG_URL` same as gateway CTAs.

---

### Topic 7: SEO Foundation for Root Pages (Phase 3 minimum)

#### What Phase 3 ships (not Phase 7)

| SEO element | Phase 3 ships | Phase 7 ships |
|-------------|---------------|---------------|
| `<title>` per page | Yes — via `metadata.title` | Sanity-driven |
| `meta description` per page | Yes | Sanity-driven |
| OG tags per page | Yes | Sanity-driven |
| Canonical URL | Yes — Next.js metadata API via `metadataBase` | Sanity-driven |
| `alternates.canonical` | Yes (if explicit override needed) | — |
| Organization JSON-LD | Yes — on root homepage only | Full schema pass |
| FAQPage JSON-LD | Yes — on homepage only (5 FAQ items) | All FAQ pages |
| sitemap.xml | No — Phase 7 | — |
| robots.txt | No — Phase 7 | — |
| BreadcrumbList | No — Phase 7 | — |
| llms.txt | No — Phase 7 | — |

#### Metadata inheritance pattern

[VERIFIED: nextjs.org/docs generateMetadata docs via Context7]

Next.js merges metadata from root layout → segment layout → page. Merging is **shallow** at the top level — child `openGraph: {}` fully replaces parent `openGraph: {}`. Always provide the full `openGraph` object in each page's metadata.

```typescript
// app/root/brand/page.tsx
export const metadata: Metadata = {
  title: 'About ProActiv Sports | Brand Story & Mission',
  description: 'ProActiv Sports is a children\'s gymnastics and sports specialist...',
  openGraph: {
    title: 'About ProActiv Sports | Brand Story & Mission',
    description: 'ProActiv Sports is a children\'s gymnastics and sports specialist...',
    url: 'https://proactivsports.com/brand/',
    images: [{ url: '/brand/opengraph-image', width: 1200, height: 630, alt: 'ProActiv Sports brand story' }],
    type: 'website',
    locale: 'en_GB',
    siteName: 'ProActiv Sports',
  },
};
```

#### Organization JSON-LD (root homepage only)

From strategy PART 9.3, the Organization schema is the canonical entity declaration for the root homepage. It uses the `@graph` pattern.

```typescript
// app/root/page.tsx — inline JSON-LD script
const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://proactivsports.com/#organization",
      "name": "ProActiv Sports",
      "url": "https://proactivsports.com/",
      "logo": "https://proactivsports.com/assets/logo.svg",
      "foundingDate": "2011",
      "foundingLocation": { "@type": "Place", "name": "Hong Kong" },
      "description": "ProActiv Sports is a children's gymnastics and sports specialist founded in Hong Kong in 2011...",
      "sameAs": [
        "https://www.facebook.com/proactivsportshk/",
        "https://www.instagram.com/proactivsports/"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://proactivsports.com/#website",
      "url": "https://proactivsports.com/",
      "name": "ProActiv Sports",
      "publisher": { "@id": "https://proactivsports.com/#organization" }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [/* 5 Q&A pairs from PART 6A §7, answers must match visible copy verbatim */]
    }
  ]
};

// In the page component:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
/>
```

#### Title tag from strategy

From strategy PART 7.1, recommended root title: `ProActiv Sports | Premium Children's Gymnastics & Sports — Hong Kong & Singapore`

Supporting pages use `template: '%s | ProActiv Sports'` from the root layout metadata, so each page just provides the `%s` prefix.

#### Applied guidance (for PLAN tasks)

> Set `metadata.title.template = '%s | ProActiv Sports'` and `metadata.metadataBase` in `app/root/layout.tsx`. Each page provides its full `metadata` object including `openGraph`. Root homepage only: render the Organization + WebSite + FAQPage JSON-LD via an inline `<script type="application/ld+json">`. No sitemap, robots.txt, or BreadcrumbList in Phase 3 — those are Phase 7 deliverables.

---

### Topic 8: Leadership Portraits + Hero LCP (SC #4)

#### Photo requirements

From strategy PART 3 §6, the leadership section needs 3 portrait photos:
- Will (Founder) — full-length or bust portrait
- Monica (Director of Sports, HK) — action or professional portrait
- Haikel (Head of Sports, SG) — action or professional portrait

These should be sourced from the Phase 2 curated hero photos (D-07: Martin selects 10–15 hero-tier images before Phase 2 executes). The planner must include a **precondition check** verifying that portrait files exist in `public/photography/` before the leadership section task runs.

From strategy PART 3 §1, the hero section requires "real child mid-movement at ProGym or Prodigy." This hero image is the LCP-critical asset.

#### LCP-critical `<Image>` configuration

```tsx
// Hero image — must have priority + correct sizing
<Image
  src="/photography/root-gateway-hero.webp"
  alt="Child performing gymnastics at ProGym, Hong Kong"
  width={1920}
  height={1080}
  priority           // — disables lazy loading, adds <link rel="preload">
  sizes="100vw"      // — full viewport width
  className="object-cover w-full h-full"
/>
```

The Phase 2 `scripts/process-photos.mjs` outputs both `.avif` and `.webp` at 1920px wide. The `next/image` component automatically negotiates AVIF/WebP via the Vercel Image Optimization CDN — no explicit `format` attribute needed in the component.

**Only one `priority` image per page** (the above-the-fold hero). Leadership portraits and other below-the-fold images must NOT have `priority` — they should lazy-load.

#### Leadership portraits component

The `<LeadershipCard>` (Phase 3-local, `components/root/`) renders:
- Square or 3:4 portrait `<Image>` (lazy load, `sizes="(max-width: 768px) 100vw, 33vw"`)
- Name (Mont Bold)
- Title/role (Mont Regular, muted)
- One-line bio (Mont Regular)

No interactive elements needed. A16z-style "head shot in a pill" aesthetic works well here — circular or 2:3 aspect ratio.

#### Applied guidance (for PLAN tasks)

> The HERO image `<Image>` must have `priority` prop. No other images on the page get `priority`. Include a precondition step verifying `public/photography/root-gateway-hero.{avif,webp}`, `public/photography/leadership-will.{avif,webp}`, `public/photography/leadership-monica.{avif,webp}`, `public/photography/leadership-haikel.{avif,webp}` exist before implementing the hero/leadership sections. If files are missing, return a HUMAN-ACTION checkpoint rather than using placeholders.

---

### Topic 9: Supporting Pages — Individual Page Specs

#### `/brand/` (GW-02)

Per strategy PART 12 Tier 1 #13: "Canonical About — Brand entity page. Every fact an LLM might need: founding year, founders, location history, programme list, coach count, partner schools, awards."

Structure:
1. Page hero: title + subheadline + brand photo (ConainerEditorial split)
2. LLM-citable brand paragraph (PART 10.2 text, or close variant)
3. History timeline (founding 2011 HK → SG expansion 2014 → Cyberport opened 2025)
4. Leadership section (reuse `<LeadershipCard>` ×3)
5. StatStrip (14 years / 2 cities / 3 venues / Ages 2–16)
6. School partnerships callout (with caveats — "with permission")
7. CTA to Contact

Metadata: `title: 'About ProActiv Sports | Brand Story, History & Mission'`

#### `/coaching-philosophy/` (GW-03)

Tier 2 in strategy (#21) — shared methodology that applies to both markets. Content from strategy PART 10.4 "coaching methodology" + strategy PART 14.3 coaching pillars (Safety / Progression / Confidence).

Structure:
1. Editorial hero with philosophy headline
2. 3-pillar section (Safety / Progression / Confidence) — each pillar = icon + H3 + 2-paragraph description
3. ProActiv training course callout ("Every coach completes the ProActiv Sports training course...")
4. Monica + Haikel portrait cards (abbreviated — links to their respective market's `/coaches/` pages)
5. CTA to both markets (Book a Free Trial)

#### `/news/` (GW-04)

At Phase 3, this is a hardcoded press mentions array. The array structure:

```typescript
const pressItems = [
  {
    outlet: 'TimeOut Hong Kong',
    headline: '...',
    date: '2024-03',
    url: 'https://...',
    logo: '/photography/press-timeout.svg',
  },
  // ...
]
```

The press items are sourced from actual ProActiv press coverage — this is an **open question** (see Topic 11). If no press items are available at Phase 3 execute time, the page ships with placeholder copy: "We've been featured in leading family and lifestyle publications across Hong Kong and Singapore. Coverage coming soon."

#### `/careers/` (GW-05)

Evergreen "join us" page at Phase 3 (no live job listings). Structure:
1. Hero: "Work with children. Build a career." (from PART 6A voice)
2. Two sections: Why work at ProActiv / What we look for in coaches
3. Open application CTA (links to `/contact/` with subject pre-filled as "Job Application" — use query param `?subject=job`)
4. Optional: hardcoded current openings array if any exist at execute time (open question)

#### `/contact/` (GW-06)

This is the market-routing contact page. Structure:
1. H1: "Get in touch"
2. Market selector: two large button-style toggles ("Hong Kong" / "Singapore") — client component
3. Form fields: Name, Email, Phone, Message + hidden market field + honeypot
4. Submit button
5. Success/error state
6. Below form: alternative contact methods (WhatsApp links per market, email addresses)

WhatsApp links format: `https://wa.me/85XXXXXXXX?text=Hello%20ProActiv%20Sports%20HK` — these are hardcoded env vars (`NEXT_PUBLIC_WHATSAPP_HK`, `NEXT_PUBLIC_WHATSAPP_SG`).

#### `/privacy/` and `/terms/` (GW-07)

Legal pages via MDX. Placeholder content at Phase 3 with clear legal disclaimers. Structure:
- Simple prose: H1 + last-updated date + MDX body
- No Phase 2 visual treatment needed beyond `<Section>` + `<ContainerEditorial>` + standard typography
- The open question of whether to use iubenda/Termly for auto-generated legal docs is deferred to the discuss phase.

PDPA (Singapore) and PDPO (Hong Kong) compliance: Phase 3 ships placeholder legal pages with a clear notice that they are drafts pending legal review. The strategy PART 15.2 Warning #4 explicitly calls out PDPA + PDPO compliance as a requirement before launch.

#### Applied guidance (for PLAN tasks)

> Each supporting page gets its own plan (or group 2–3 small pages per plan). `/brand/` and `/coaching-philosophy/` are content-rich editorial pages that deserve individual plans. `/privacy/`, `/terms/`, and `/careers/` can share one plan (MDX-driven, minimal structure). `/contact/` is its own plan (includes the Resend backend). `/news/` can be bundled with legal pages if press items are available, or deferred to a placeholder block.

---

### Topic 10: Known Pitfalls

#### Pitfall 1: `metadataBase` missing in root layout
**What goes wrong:** OG image URLs in `<meta property="og:image">` are relative paths (e.g., `/root/opengraph-image`) instead of absolute URLs. WhatsApp and iMessage cannot fetch relative URLs — preview shows no image.
**Root cause:** `metadataBase` not set in `app/root/layout.tsx`.
**Prevention:** Always set `metadataBase: new URL('https://proactivsports.com')` in the root layout metadata. On preview builds, `metadataBase` should use `NEXT_PUBLIC_VERCEL_URL` as a fallback.
**Early detection:** After implementation, paste a Vercel preview URL into `https://opengraph.xyz/` or check `<meta>` source — og:image value must be an absolute HTTPS URL.

```typescript
// app/root/layout.tsx
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'https://proactivsports.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  // ...
};
```

#### Pitfall 2: Metadata `openGraph` shallow merge — child openGraph is NOT merged
**What goes wrong:** Root layout sets `openGraph: { siteName, locale, type }`. Child page sets `openGraph: { title, description }`. The child's `openGraph` replaces the parent's — `siteName` and `locale` are lost.
**Root cause:** Next.js metadata merging is shallow at the object level. Nested properties within `openGraph` are not merged.
**Prevention:** Each page's `metadata.openGraph` includes ALL fields it needs: `title`, `description`, `url`, `images`, `siteName`, `locale`, `type`. Do not rely on inheriting these from the layout.

#### Pitfall 3: `next-mdx-remote` client-side import in RSC
**What goes wrong:** Importing `MDXRemote` from `next-mdx-remote` (not `next-mdx-remote/rsc`) in an RSC causes a build error or client bundle bloat.
**Root cause:** There are two exports: `next-mdx-remote` (for Pages Router) and `next-mdx-remote/rsc` (for App Router / RSC). They are not interchangeable.
**Prevention:** Always import from `'next-mdx-remote/rsc'` in App Router page components.

#### Pitfall 4: OG ImageResponse font — WOFF2 vs TTF
**What goes wrong:** `new ImageResponse()` with a WOFF2 font file throws "Failed to load font" or produces garbled text. Satori (the rendering engine) requires raw OpenType/TrueType font data.
**Root cause:** WOFF2 is a compressed web format. Satori expects uncompressed TTF/OTF bytes.
**Prevention:** Keep a `.ttf` copy of Bloc Bold at `app/fonts/bloc-bold.ttf` exclusively for OG image generation. Use `readFile(join(process.cwd(), 'app/fonts/bloc-bold.ttf'))` in `opengraph-image.tsx`. The WOFF2 files remain in `app/fonts/` for `next/font/local` web serving.

#### Pitfall 5: Contact form submits to wrong inbox when market selector is empty
**What goes wrong:** User loads `/contact/` without selecting a market → submits → `market` field is empty → server defaults to `hk` silently → SG enquiry goes to HK inbox.
**Root cause:** No default market + no validation on the market field.
**Prevention:** (a) Pre-select a market default based on nothing (prompt the user to choose). (b) Server validates `market` is one of `['hk', 'sg']` and returns 400 if missing. (c) Client-side form validation prevents submission if market is not selected. All three layers.

#### Pitfall 6: `priority` on multiple images breaks LCP
**What goes wrong:** Multiple images with `priority` on the same page causes the browser to preload all of them in the critical path, increasing total blocking time and potentially worsening LCP.
**Root cause:** `priority` should only be used for the single LCP-critical image (the hero).
**Prevention:** Only one `<Image priority>` per page. Leadership portraits, offer tiles, and all other images use lazy loading (default).

#### Pitfall 7: Cross-subdomain `<Link>` vs `<a>` confusion
**What goes wrong:** Using Next.js `<Link href="https://hk.proactivsports.com/">` — the Next.js Link component is for same-host client-side navigation only. A cross-host URL in `<Link>` forces a full page reload anyway but may produce console warnings or unexpected behaviour in some Next.js versions.
**Root cause:** `<Link>` is designed for Next.js router navigation. Cross-origin URLs are not router navigation.
**Prevention:** Always use `<a href="...">` (or `<Button asChild><a href>`) for cross-subdomain navigation. The `asChild` shadcn prop passes the `<a>` tag's onClick/href through while the Button handles styling.

#### Pitfall 8: Middleware `middleware.ts` rename in Next.js 16
**What happens:** Next.js 16 deprecates `middleware.ts` and renames it to `proxy.ts`. This affects Phase 3 and later phases if the project upgrades to Next.js 16 before Phase 10.
**Current state:** Project is on `next@15.5.15` — `middleware.ts` is correct and active. Next.js 16 is the canary branch as of 2026-04-23.
**Prevention:** Do not upgrade to Next.js 16 in Phase 3. When upgrading in a future phase, run the provided codemod (`npx @next/codemod@canary middleware-to-proxy .`) and update CI tests that reference `middleware.ts` or `middleware.test.ts`.
[VERIFIED: nextjs.org docs — the renaming is in Next.js v16.0.0, which is the canary branch]

---

## Open Questions

These are the questions `/gsd-discuss-phase 3` must answer before planning begins.

**Q1: Contact form backend — HK inbox and SG inbox email addresses**
- What we know: Contact form routes enquiries to one of two email inboxes based on the market selector.
- What's unclear: The actual email addresses for HK and SG enquiries. Are these already-existing addresses (e.g., current staff emails), or do new addresses need to be created?
- Recommendation: Confirm before Phase 3 execute. Store in Vercel env as `CONTACT_INBOX_HK` and `CONTACT_INBOX_SG`. Do not hardcode.

**Q2: Root gateway video hero — is one required at Phase 3, or static photo?**
- What we know: Strategy PART 3 §1 describes the hero as "full-bleed editorial photography" (not video) on the root gateway — this is distinct from the HK/SG homepages which call for video heroes. Phase 2 D-06 defers real Mux integration to Phase 10.
- What's unclear: Does the client want any video element on the root gateway at Phase 3? Or is a premium hero photograph sufficient?
- Recommendation: Static photography hero at Phase 3 (consistent with PART 3 wireframe and Phase 2 D-06). Revisit in Phase 10.

**Q3: What content lives on `/news/` at Phase 3?**
- What we know: Strategy PART 12 Tier 3 #27 lists "Press / media coverage page" as a Tier 3 (months 3–6) item. REQUIREMENTS.md GW-04 calls it "press & media mentions (CMS-fed)."
- What's unclear: Are there existing press mentions that can populate the page at Phase 3, or does it ship with placeholder copy?
- Recommendation: Ship as "placeholder with coming-soon" if no press clips are ready. If Martin has press mentions available (Honeycombers, Sassy Mama, TimeOut HK, etc.), provide a list of outlet + headline + URL before execute.

**Q4: Careers page — active job listings or evergreen "we're always hiring" page?**
- What we know: Strategy PART 12 Tier 1 lists `/careers/` as a root page. REQUIREMENTS.md GW-05 says "CMS-fed."
- What's unclear: Are there specific coaching roles to advertise at Phase 3, or should it ship as an evergreen "join our team" pitch with an open application CTA?
- Recommendation: Evergreen page at Phase 3 (content hardcoded or MDX). CMS-fed listings wait for Phase 6.

**Q5: Legal pages — new originals, iubenda/Termly auto-generated, or existing `.net` drafts?**
- What we know: PDPA (SG) and PDPO (HK) compliance is required before launch (strategy PART 15.2 Warning #4). Phase 10 is the launch phase.
- What's unclear: Does Martin have draft legal content from the legacy `.net` site? Should Phase 3 use iubenda/Termly for auto-generation, or commission a lawyer for bespoke docs?
- Recommendation: Phase 3 ships placeholder legal pages with a visible "This document is pending legal review" disclaimer. Legal review and final content is a pre-Phase 10 task, not a Phase 3 blocker.

**Q6: Leadership portrait photos — are they in the 22GB source folder already?**
- What we know: Phase 2 D-07 involves Martin curating 10–15 hero-tier images. The Phase 3 leadership section needs portrait photos of Will, Monica, and Haikel.
- What's unclear: Whether portraits of all three leaders are available in `/Users/martin/Downloads/ProActive/01 - PHOTOS to use/` and whether they're included in the D-07 curated set.
- Recommendation: Include Will / Monica / Haikel portraits explicitly in the Phase 2 curation checklist. If not already there, flag as a Phase 3 human-action checkpoint.

**Q7: WhatsApp click-to-chat numbers for each market**
- What we know: Strategy PART 3 §8 references WhatsApp as a contact option. Strategy PART 4 §11 lists "WhatsApp us" as a CTA. The contact page should include WhatsApp links.
- What's unclear: The WhatsApp numbers for HK and SG (to construct `wa.me` links). The SG number `+65 9807 6827` is in strategy PART 8.3; HK number is listed as "[verified HK number]" — not yet provided.
- Recommendation: Confirm HK WhatsApp number before Phase 3 execute. Store in `.env.example` as `NEXT_PUBLIC_WHATSAPP_HK` and `NEXT_PUBLIC_WHATSAPP_SG`.

**Q8: Market-routing from `/contact/` — default market or "choose first"?**
- What we know: The contact form has a market selector (HK / SG). It's unclear whether the page should default to one market or force the user to choose.
- What's unclear: UX preference. Defaulting to HK may frustrate SG visitors who arrive from an SG-context link. Showing no default forces an extra click.
- Recommendation: Default to no selection (user must pick). Add clear helper text: "Please select your location first." This is the safer UX given cross-market traffic patterns.

---

## Validation Architecture

Validation config: `nyquist_validation: true` (from `.planning/config.json`).

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.5 (already installed, scoped to `middleware.test.ts` in Phase 1) |
| Config file | `vitest.config.ts` (exists — Phase 1 D-15) |
| Quick run command | `pnpm test:unit` |
| Full suite command | `pnpm test:unit` |

Phase 3 extends Vitest scope to include route-level smoke tests and form handler unit tests. RTL / jsdom component tests may be added for the contact form.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| GW-01 | Root homepage renders with H1 "Move. Grow. Thrive." | smoke / manual | Playwright (not yet installed) or visual check | ❌ Wave 0 |
| GW-01 | Dual market CTAs point to `NEXT_PUBLIC_HK_URL` / `NEXT_PUBLIC_SG_URL` | unit | `pnpm test:unit` → `app/root/page.test.ts` | ❌ Wave 0 |
| GW-06 | Contact API rejects unknown market value | unit | `pnpm test:unit` → `app/api/contact/route.test.ts` | ❌ Wave 0 |
| GW-06 | Contact API routes `market=hk` to `CONTACT_INBOX_HK` | unit (Resend mock) | `pnpm test:unit` | ❌ Wave 0 |
| GW-06 | Honeypot field rejects non-empty value | unit | `pnpm test:unit` | ❌ Wave 0 |
| SC #3 | End-to-end: HK form submission arrives at HK inbox | manual | Manual check on preview (Resend dashboard) | manual-only |
| SC #5 | OG image URL is absolute HTTPS in `<head>` | unit / smoke | `pnpm test:unit` → metadata check | ❌ Wave 0 |
| SC #5 | All root pages return 200 on Vercel preview | manual smoke | Curl each route on preview URL | manual |

### Sampling Rate
- **Per task commit:** `pnpm test:unit`
- **Per wave merge:** `pnpm test:unit` (full Vitest suite)
- **Phase gate:** All Vitest tests green + manual SC #3 inbox check + manual SC #5 OG preview check before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `app/api/contact/route.test.ts` — unit tests for market routing, honeypot, validation (REQ GW-06)
- [ ] `app/root/page.test.ts` — unit tests verifying CTA URLs and metadata (REQ GW-01)
- [ ] `vitest.config.ts` extension — update include pattern to cover `app/root/**/*.test.ts` and `app/api/**/*.test.ts` (currently scoped only to `middleware.test.ts`)
- [ ] `@testing-library/react` + `jsdom` — install if contact form `'use client'` component needs RTL tests (deferred from Phase 1 D-15; planner decides if Phase 3 form complexity justifies it)

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js ≥22 | `node:fs/promises` in OG image | ✓ | 22.x (engines constraint in package.json) | — |
| pnpm | package installs | ✓ | 10.30.3 | — |
| Resend API key | Contact form (GW-06) | ✗ pending | — | Manual checkpoint: `HUMAN-ACTION — add RESEND_API_KEY to Vercel + .env.local` |
| CONTACT_INBOX_HK | Contact form routing | ✗ pending | — | Manual checkpoint: confirm email address with client |
| CONTACT_INBOX_SG | Contact form routing | ✗ pending | — | Manual checkpoint: confirm email address with client |
| NEXT_PUBLIC_HK_URL | Market CTA links | ✗ pending | — | Preview fallback: `/?__market=hk` documented in .env.example |
| NEXT_PUBLIC_SG_URL | Market CTA links | ✗ pending | — | Preview fallback: `/?__market=sg` |
| Portrait photos in `public/photography/` | Leadership section | ✗ pending (Phase 2 execute) | — | Phase 2 human-action checkpoint for D-07 curation |

**Missing dependencies with no fallback:**
- None — all missing items have documented fallback strategies or human-action checkpoints.

**Missing dependencies with fallback:**
- Resend API key: form ships as disabled (button shows "Contact form coming soon") until key is provided, OR the plan includes a HUMAN-ACTION checkpoint for Martin to add the key before the contact plan runs.
- Market CTA URLs: preview bridge `?__market=hk` is the documented fallback (Phase 1 D-01 ladder, already in middleware).

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No — no auth on Phase 3 pages | — |
| V3 Session Management | No | — |
| V4 Access Control | No | — |
| V5 Input Validation | Yes — contact form inputs | Server-side validation in route handler (name, email, market, honeypot). Client-side validation for UX only. |
| V6 Cryptography | No — no secrets in client bundle | Resend API key is server-only env var; never exposed to browser |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Bot form submissions | Spoofing | Honeypot field (Phase 3). Cloudflare WAF bot management (Phase 10). |
| Market field tampering | Tampering | Server validates `market ∈ ['hk', 'sg']`; unknown values rejected with 400. |
| RESEND_API_KEY leak | Information disclosure | Key is server-only env var. Never use `NEXT_PUBLIC_RESEND_*`. Gitleaks CI check (Phase 0) catches accidental commits. |
| SSRF via contact message | Elevation | Resend SDK only uses the message body as email content — no URL fetching from user input. |
| PDPA/PDPO data minimization | Privacy | Collect only: name, email, phone, message, market. No IP logging in route handler. |

---

## References

### Primary (HIGH confidence)

- [VERIFIED: nextjs.org/docs] Next.js 15 metadata API — `metadataBase`, `generateMetadata`, `metadata` merging rules: `https://nextjs.org/docs/app/api-reference/functions/generate-metadata`
- [VERIFIED: nextjs.org/docs] Next.js OG image generation (`opengraph-image.tsx`, `ImageResponse`, build-time static generation): `https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image`
- [VERIFIED: Context7/hashicorp/next-mdx-remote] `next-mdx-remote/rsc` RSC usage, `MDXRemote` async component, `parseFrontmatter` option
- [VERIFIED: Context7/websites/resend] Resend Next.js route handler pattern, React Email integration
- [VERIFIED: resend.com/pricing] Resend free tier: 3,000 emails/month, 100/day, GDPR compliant
- [VERIFIED: npm view] Package versions: resend@6.12.2, next-mdx-remote@6.0.0, gray-matter@4.0.3
- [VERIFIED: nextjs.org/docs] Next.js 16 middleware → proxy rename (v16.0.0 canary only — not in v15.5.15)

### Secondary (MEDIUM confidence)

- [CITED: strategy.md PART 3] Root gateway 8-section wireframe — section-by-section structure
- [CITED: strategy.md PART 6A] Root gateway full copy — hero H1, story text, market cards, trust section, leadership, FAQ, final CTA
- [CITED: strategy.md PART 9.3] Organization JSON-LD skeleton for root homepage
- [CITED: strategy.md PART 12 Tier 1 #13] `/brand/` page specification
- [CITED: 02-CONTEXT.md D-06] Video DEFERRED to Phase 10 — gateway hero is static photo
- [CITED: 01-CONTEXT.md D-01, D-02] Middleware precedence ladder — Host > cookie > query; cross-subdomain navigation context

### Tertiary (LOW confidence / ASSUMED)

- [ASSUMED] WhatsApp OG image requirements (1200×630, HTTPS required, under 300KB recommended) — from training knowledge; web search unavailable
- [ASSUMED] iMessage unfurl behavior (reads `og:image`, `og:title`, `og:description`) — from training knowledge
- [ASSUMED] Satori/ImageResponse requires TTF, not WOFF2, for font data — from training knowledge; verify at execute time
- [ASSUMED] iOS PWA / Mobile Safari cross-subdomain navigation is always a full page load — architectural assumption; no verification needed for Phase 3

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | WhatsApp reads `og:image` and requires images to be served over HTTPS | Topic 5 | OG previews may not work on WhatsApp if format requirements differ; fix is to adjust image spec |
| A2 | iMessage reads first `og:image` occurrence in `<head>` for link preview | Topic 5 | iMessage previews may not render correctly; fix is low-risk (check via iMessage on preview URL) |
| A3 | Satori (ImageResponse renderer) requires raw TTF/OTF bytes, not WOFF2 | Topic 10 Pitfall 4 | OG image generation fails at build time; fix is to add TTF copy alongside WOFF2 |
| A4 | Mobile Safari cross-subdomain navigation is always a full page load (not client-side SPA navigation) | Topic 2 | Negligible — this is desired behavior; a full page load is correct when entering a different market subdomain |
| A5 | Postmark's free trial is 100 emails/month (vs Resend's 3,000) | Topic 3 | Wrong tier comparison; does not affect Resend recommendation |

---

## Metadata

**Confidence breakdown:**
- Gateway homepage architecture: HIGH — directly derived from PART 3 wireframe + Phase 2 primitive inventory
- Cross-market handoff: HIGH — middleware code verified in repo; env-var pattern is standard
- Contact form (Resend): HIGH for integration pattern; MEDIUM for GDPR specifics beyond "built-in"
- MDX content strategy: HIGH — verified from Context7/next-mdx-remote docs
- OG image generation: HIGH for Next.js pattern; MEDIUM-LOW for WhatsApp/iMessage specifics
- Metadata API: HIGH — verified from nextjs.org docs
- Security: MEDIUM — standard patterns; no penetration testing data

**Research date:** 2026-04-23
**Valid until:** 2026-05-23 (30-day shelf life — Next.js 15 is stable; Resend API is stable)

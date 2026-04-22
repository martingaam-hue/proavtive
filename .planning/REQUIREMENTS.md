# Requirements: ProActiv Sports Website Ecosystem

**Defined:** 2026-04-22
**Core Value:** Convert affluent parents into trial bookings and enquiries; SEO + LLM visibility serve that goal.

> Strategy source: `.planning/inputs/strategy.md` (PARTS referenced inline below).

## v1.0 Requirements

### Foundation (FOUND)

- [ ] **FOUND-01**: Domain `proactivsports.com` is on Cloudflare DNS with valid certs across `*.proactivsports.com`
- [x] **FOUND-02**: Single Next.js 15 (App Router, RSC) project boots with Tailwind + shadcn pattern, deployed to Vercel
- [x] **FOUND-03**: Subdomain middleware routes `proactivsports.com` → `app/(root)/`, `hk.proactivsports.com` → `app/(hk)/`, `sg.proactivsports.com` → `app/(sg)/`
- [ ] **FOUND-04**: Sanity Studio scaffolds at `studio.proactivsports.com` (or admin route) with seed content models
- [ ] **FOUND-05**: GitHub repo with branch protection on `main`, PR-required CI (typecheck + lint + Lighthouse on PR previews)
- [ ] **FOUND-06**: Vercel env secrets wired from 1Password / secrets manager — no secrets in git
- [ ] **FOUND-07**: Cloudflare WAF + bot management + rate limiting active before any public traffic
- [ ] **FOUND-08**: Sentry error monitoring wired (frontend + Sanity webhook handler)

### Design system (DS)

- [ ] **DS-01**: Tailwind config with brand tokens — primary `#0f206c`, accent `#ec1c24`, secondary green/sky/yellow/cream
- [ ] **DS-02**: Typography: Bloc Bold (headlines), Mont (body), Baloo (Progym contexts) — self-hosted, preloaded, no Google Fonts CLS
- [ ] **DS-03**: Primitive components: Button, Card, Section, ContainerEditorial, MarketCard, ProgrammeTile, TestimonialCard, FAQItem, LogoWall, StatStrip
- [ ] **DS-04**: Image pipeline (Sharp → AVIF/WebP, responsive `<Image>`), video via Mux player
- [ ] **DS-05**: Component gallery (route `/_design/` gated to dev/preview) showing every primitive in real ProActiv photography context
- [ ] **DS-06**: Visual direction conforms to strategy PART 14.3 (premium kids' editorial, motion, asymmetric layouts) — not the "AI SaaS" aesthetic

### Root gateway (GW)

- [ ] **GW-01**: Root homepage `/` ships per strategy PART 3 wireframe + PART 6A copy — 8 sections, dual market entry, real photo hero, FAQ, leadership cards
- [ ] **GW-02**: `/brand/` entity page (LLM-citable brand statement + history + leadership)
- [ ] **GW-03**: `/coaching-philosophy/` shared methodology + safety standards
- [ ] **GW-04**: `/news/` press & media mentions (CMS-fed)
- [ ] **GW-05**: `/careers/` with role listings (CMS-fed)
- [ ] **GW-06**: `/contact/` master contact form with market routing (HK/SG selector)
- [ ] **GW-07**: `/privacy/`, `/terms/` legal pages (CMS-fed for editability)

### Hong Kong (HK)

- [ ] **HK-01**: HK homepage per strategy PART 4 wireframe + PART 6B copy
- [ ] **HK-02**: `/wan-chai/` ProGym Wan Chai location page (15/F The Hennessy, 256 Hennessy Rd, map embed, opening hours, programme list)
- [ ] **HK-03**: `/cyberport/` ProGym Cyberport location page (5,000 sq ft, opened Aug 2025)
- [ ] **HK-04**: `/gymnastics/` pillar + 8 sub-pages (toddlers, beginner, intermediate, advanced, competitive, rhythmic, adult, private)
- [ ] **HK-05**: `/holiday-camps/` pillar (Easter / Summer / Christmas — auto-Event-schema)
- [ ] **HK-06**: `/birthday-parties/` hub
- [ ] **HK-07**: `/school-partnerships/` page
- [ ] **HK-08**: `/competitions-events/` page
- [ ] **HK-09**: `/coaches/` HK team bios (CMS-fed Person entries)
- [ ] **HK-10**: `/blog/` HK editorial hub (CMS-fed, paginated, category/tag filters)
- [ ] **HK-11**: `/faq/` HK FAQ hub (FAQPage schema)
- [ ] **HK-12**: `/book-a-trial/` conversion hub + `/book-a-trial/free-assessment/` booking

### Singapore (SG)

- [ ] **SG-01**: SG homepage per strategy PART 5 wireframe + PART 6C copy
- [ ] **SG-02**: `/katong-point/` Prodigy location page (451 Joo Chiat Rd, Level 3, "Singapore's only MultiBall wall")
- [ ] **SG-03**: `/weekly-classes/` pillar + Movement / Sports+MultiBall / Climbing zones
- [ ] **SG-04**: `/prodigy-camps/` pillar + themed / multi-activity / gymnastics camps
- [ ] **SG-05**: `/birthday-parties/` SG hub
- [ ] **SG-06**: `/school-partnerships/` SG (incl. IFS partnership)
- [ ] **SG-07**: `/events/` sports days, community events
- [ ] **SG-08**: `/coaches/` SG team bios
- [ ] **SG-09**: `/blog/` SG editorial hub
- [ ] **SG-10**: `/faq/` SG FAQ hub
- [ ] **SG-11**: `/book-a-trial/` SG conversion hub

### CMS / Admin (CMS)

- [ ] **CMS-01**: Sanity content models per strategy PART 13.2 — homepage hero / market cards / programme cards / location entries / Person (coaches) / blog Post / Camp (with Event schema fields) / Page (legal & evergreen)
- [ ] **CMS-02**: Role-based access (Admin / Editor / Contributor) with Sanity Studio access groups
- [ ] **CMS-03**: Blog editor with: rich text (Portable Text), SEO fields (slug, metaTitle, metaDescription, OG image, alt text), publish/draft, scheduled publishing, categories, tags, author selector
- [ ] **CMS-04**: Media library — image upload, alt text required, focal-point cropping; safe replacement of homepage visuals without breaking layout (CMS field is reference, not direct asset)
- [ ] **CMS-05**: Sanity webhook → Vercel deploy hook fires ISR `revalidatePath` for affected routes on publish (`/`, `/blog/`, `/blog/[slug]`, etc.)
- [ ] **CMS-06**: Featured-blog-on-homepage — homepage block auto-pulls 3 latest posts; editor can override with manual featured post
- [ ] **CMS-07**: Camp content fields auto-render Event JSON-LD (start/end date, location, offers, performer)
- [ ] **CMS-08**: Cloudflare WAF rules + bot management + rate limiting on `/api/*`, Sanity webhook, contact form

### SEO / Schema / LLMO (SEO)

- [ ] **SEO-01**: Per-page `<head>` metadata (title, description, OG, Twitter card) sourced from CMS fields with sane fallbacks; title-tag options per strategy PART 7.1
- [ ] **SEO-02**: XML sitemaps per property (root, hk, sg) + sitemap index at root
- [ ] **SEO-03**: `robots.txt` per property — root allows all, hk/sg allow all, legacy `.net` migration window allows all
- [ ] **SEO-04**: `llms.txt` + `llms-full.txt` per property generated at build/ISR time per llmstxt.org spec
- [ ] **SEO-05**: JSON-LD per page: Organization (root), LocalBusiness (3 location pages), FAQPage (homepages + FAQ hubs), Event (camp pages), BreadcrumbList (deep pages), VideoObject (where video is primary), Person (coach bios) — per strategy PART 9
- [ ] **SEO-06**: Lighthouse mobile score ≥ 95 on root `/`, hk `/`, sg `/`, all 3 location pages, all pillar pages
- [ ] **SEO-07**: Core Web Vitals green (LCP < 2.5s, INP < 200ms, CLS < 0.1) on the same page set
- [ ] **SEO-08**: Crawl-friendly hierarchy — semantic HTML, h1 per page, breadcrumbs, no JS-blocked content; WCAG 2.2 AA on text contrast + keyboard nav + focus indicators
- [ ] **SEO-09**: GA4 + Google Search Console verified across all 3 properties; conversion events for `book-a-trial`, `enquire`, `whatsapp_click`
- [ ] **SEO-10**: Google Business Profile listings cross-checked against site NAP for Wan Chai, Cyberport, Katong Point — single canonical NAP per location

### Migration & Launch (MIG)

- [ ] **MIG-01**: Phase 0 — `proactivsports.com` DNS transferred to Cloudflare; `*.proactivsports.com` cert valid; staging at `staging.proactivsports.com` deployed before any prod work
- [ ] **MIG-02**: Crawl `proactivsports.net` (and HK/SG sub-properties) for all live URLs with inbound traffic / backlinks; build URL-by-URL 301 map; deploy in Vercel `vercel.json` redirects or middleware
- [ ] **MIG-03**: Pre-launch security pass — no exposed env, no Sanity public mutate token, Cloudflare WAF rules tested, dependency audit clean (no high/critical CVEs)
- [ ] **MIG-04**: Cutover runbook — DNS swap order, cache purge, smoke test checklist, rollback DNS plan with TTL set low 24h pre-cutover

## v1.5 Requirements (deferred)

### Conversion deepening
- **POST-01**: Direct online booking with payment (Stripe + Sanity-driven schedule)
- **POST-02**: Parent portal — booking history, attendance, recital media
- **POST-03**: Multilingual content (zh-HK at minimum)

### Content engine
- **POST-04**: Backlink framework operationalised per strategy PART 11 (10 links/month outreach pipeline, linkable assets built)
- **POST-05**: Topical blog clusters per strategy PART 12 Tier 3-4 (months 3-12)

## Out of Scope

| Feature | Reason |
|---------|--------|
| 1:1 recreation of legacy `.net` site | Only inbound-trafficked URLs get 301'd; rest die. Goal is clean slate, not migration. |
| E-commerce platform | Booking is via existing system / WhatsApp / enquiry — strategy doc PART 1 confirms this is correct for trial-driven business |
| Mobile native app | Web-first per brief; PWA-friendly responsive web is sufficient |
| Multilingual at v1.0 | English-only at launch; revisit post-launch with traffic data |
| Account/portal area | Out of v1.0 (POST-02 in v1.5) |
| Custom DAM | Sanity media library + Mux is the DAM |
| Newsletter platform build | Use existing Mailchimp / similar; embed signup forms |
| AB testing infra | Premature for v1.0; add post-launch when traffic justifies |

## Traceability

Populated 2026-04-22 by gsd-roadmapper; revised 2026-04-22 (domain/DNS/Cloudflare moved to Phase 10). Full phase detail in `.planning/ROADMAP.md`.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 10 | Pending |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 1 | Pending |
| FOUND-05 | Phase 0 | Pending |
| FOUND-06 | Phase 0 | Pending |
| FOUND-07 | Phase 10 | Pending |
| FOUND-08 | Phase 0 | Pending |
| DS-01 | Phase 2 | Pending |
| DS-02 | Phase 2 | Pending |
| DS-03 | Phase 2 | Pending |
| DS-04 | Phase 2 | Pending |
| DS-05 | Phase 2 | Pending |
| DS-06 | Phase 2 | Pending |
| GW-01 | Phase 3 | Pending |
| GW-02 | Phase 3 | Pending |
| GW-03 | Phase 3 | Pending |
| GW-04 | Phase 3 | Pending |
| GW-05 | Phase 3 | Pending |
| GW-06 | Phase 3 | Pending |
| GW-07 | Phase 3 | Pending |
| HK-01 | Phase 4 | Pending |
| HK-02 | Phase 4 | Pending |
| HK-03 | Phase 4 | Pending |
| HK-04 | Phase 4 | Pending |
| HK-05 | Phase 4 | Pending |
| HK-06 | Phase 4 | Pending |
| HK-07 | Phase 4 | Pending |
| HK-08 | Phase 4 | Pending |
| HK-09 | Phase 4 | Pending |
| HK-10 | Phase 4 | Pending |
| HK-11 | Phase 4 | Pending |
| HK-12 | Phase 4 | Pending |
| SG-01 | Phase 5 | Pending |
| SG-02 | Phase 5 | Pending |
| SG-03 | Phase 5 | Pending |
| SG-04 | Phase 5 | Pending |
| SG-05 | Phase 5 | Pending |
| SG-06 | Phase 5 | Pending |
| SG-07 | Phase 5 | Pending |
| SG-08 | Phase 5 | Pending |
| SG-09 | Phase 5 | Pending |
| SG-10 | Phase 5 | Pending |
| SG-11 | Phase 5 | Pending |
| CMS-01 | Phase 6 | Pending |
| CMS-02 | Phase 6 | Pending |
| CMS-03 | Phase 6 | Pending |
| CMS-04 | Phase 6 | Pending |
| CMS-05 | Phase 6 | Pending |
| CMS-06 | Phase 6 | Pending |
| CMS-07 | Phase 6 | Pending |
| CMS-08 | Phase 10 | Pending |
| SEO-01 | Phase 7 | Pending |
| SEO-02 | Phase 7 | Pending |
| SEO-03 | Phase 7 | Pending |
| SEO-04 | Phase 7 | Pending |
| SEO-05 | Phase 7 | Pending |
| SEO-06 | Phase 7 | Pending |
| SEO-07 | Phase 7 | Pending |
| SEO-08 | Phase 7 | Pending |
| SEO-09 | Phase 8 | Pending |
| SEO-10 | Phase 8 | Pending |
| MIG-01 | Phase 10 | Pending |
| MIG-02 | Phase 9 | Pending |
| MIG-03 | Phase 9 | Pending |
| MIG-04 | Phase 10 | Pending |

**Coverage:**
- v1.0 requirements: 66 total
- Mapped to phases: 66 (100%)
- Unmapped: 0
- Duplicated across phases: 0

**Phase distribution:**

| Phase | Requirements | Count |
|-------|--------------|-------|
| 0  | FOUND-05, FOUND-06, FOUND-08 | 3 |
| 1  | FOUND-02, FOUND-03, FOUND-04 | 3 |
| 2  | DS-01 … DS-06 | 6 |
| 3  | GW-01 … GW-07 | 7 |
| 4  | HK-01 … HK-12 | 12 |
| 5  | SG-01 … SG-11 | 11 |
| 6  | CMS-01 … CMS-07 | 7 |
| 7  | SEO-01 … SEO-08 | 8 |
| 8  | SEO-09, SEO-10 | 2 |
| 9  | MIG-02, MIG-03 | 2 |
| 10 | FOUND-01, FOUND-07, CMS-08, MIG-01, MIG-04 | 5 |
| **Total** | | **66** |

---
*Requirements defined: 2026-04-22 from `.planning/inputs/strategy.md`.*
*Traceability populated: 2026-04-22 by gsd-roadmapper; revised same day (Phase 0 trimmed to local-only; FOUND-01, FOUND-07, CMS-08, MIG-01 moved to Phase 10).*

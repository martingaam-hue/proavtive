# ProActiv Sports — Website Ecosystem

## What This Is

A 3-layer website ecosystem for **ProActiv Sports**, a children's gymnastics and sports provider founded in Hong Kong in 2011 and operating in Hong Kong (ProGym Wan Chai, ProGym Cyberport) and Singapore (Prodigy @ Katong Point). The system is one premium root gateway (`proactivsports.com`) plus two fully developed market subdomains (`hk.proactivsports.com`, `sg.proactivsports.com`), all backed by a single Sanity-driven CMS so the client team can independently publish blog content and update homepage media without developer help.

## Core Value

**Convert affluent parents into trial bookings and enquiries** — every page must have a clear, fast path to *Book a Free Trial*, *Enquire*, or *WhatsApp*. SEO and LLM visibility serve that goal; they are not the goal.

## Canonical Brief

The single source of truth for strategy, copy, wireframes, SEO/local/schema/LLM/backlink packages, CMS architecture, and brand/design direction is:

**`.planning/inputs/strategy.md`** (12,540 words — all 15 PARTS, fact-grounded against verified addresses, venue facts, and history)

This `PROJECT.md` does not duplicate it. Phase plans cite specific PART/section anchors from the strategy doc when relevant.

## Requirements

### Validated

(None yet — ship to validate)

### Active

Grouped by the strategy doc's three layers + cross-cutting concerns. Each is a hypothesis until shipped.

#### Layer 1 — Root Gateway (`proactivsports.com`)
- [ ] **GW-01** Premium gateway homepage with brand-led hero, dual market entry (HK / SG), and 8 sections per strategy PART 3
- [ ] **GW-02** Brand entity page (`/brand/`)
- [ ] **GW-03** Coaching philosophy page (`/coaching-philosophy/`) — shared methodology
- [ ] **GW-04** Press / news page (`/news/`)
- [ ] **GW-05** Careers page (`/careers/`)
- [ ] **GW-06** Master contact page with market routing (`/contact/`)
- [ ] **GW-07** Legal pages (`/privacy/`, `/terms/`)

#### Layer 2 — Hong Kong (`hk.proactivsports.com`)
- [ ] **HK-01** Full HK homepage per strategy PART 4 + PART 6B copy
- [ ] **HK-02** ProGym Wan Chai location page (15/F The Hennessy, 256 Hennessy Rd)
- [ ] **HK-03** ProGym Cyberport location page (5,000 sq ft, opened Aug 2025)
- [ ] **HK-04** Gymnastics programmes pillar + 8 sub-pages (toddlers / beginner / intermediate / advanced / competitive / rhythmic / adult / private)
- [ ] **HK-05** Holiday camps pillar (Easter / Summer / Christmas)
- [ ] **HK-06** Birthday parties hub
- [ ] **HK-07** School partnerships page
- [ ] **HK-08** Competitions / events page
- [ ] **HK-09** HK coaches bios
- [ ] **HK-10** HK blog hub
- [ ] **HK-11** HK FAQ hub
- [ ] **HK-12** HK Book-a-trial conversion hub + free assessment booking

#### Layer 2 — Singapore (`sg.proactivsports.com`)
- [ ] **SG-01** Full SG homepage per strategy PART 5 + PART 6C copy
- [ ] **SG-02** Prodigy @ Katong Point location page (451 Joo Chiat Rd, Level 3 — Singapore's only MultiBall wall)
- [ ] **SG-03** Weekly classes pillar + 3 zones (Movement / Sports + MultiBall / Climbing)
- [ ] **SG-04** Prodigy holiday camps pillar (themed / multi-activity / gymnastics)
- [ ] **SG-05** SG birthday parties hub
- [ ] **SG-06** SG school partnerships (incl. IFS)
- [ ] **SG-07** SG events page
- [ ] **SG-08** SG coaches bios
- [ ] **SG-09** SG blog hub
- [ ] **SG-10** SG FAQ hub
- [ ] **SG-11** SG Book-a-trial conversion hub

#### CMS / Admin
- [ ] **CMS-01** Sanity Studio with content models for all editable blocks (per strategy PART 13.2 map)
- [ ] **CMS-02** Role-based access (Admin / Editor / Contributor)
- [ ] **CMS-03** Blog editor with SEO fields (slug, meta title, meta description, alt text, OG image), publish/draft, scheduled publishing, categories, tags
- [ ] **CMS-04** Media library with image management; safe replacement of homepage visuals without breaking layout
- [ ] **CMS-05** Webhook → Vercel ISR revalidation on publish (homepage + affected paths fresh within seconds)
- [ ] **CMS-06** Featured-blog-on-homepage logic (auto-pull latest, with manual feature override)
- [ ] **CMS-07** Auto-Event-schema generation from camp content fields
- [ ] **CMS-08** Cloudflare WAF + bot management + rate limiting

#### SEO / Schema / LLMO
- [ ] **SEO-01** Per-page metadata (title, description, OG, Twitter card) generated from CMS fields
- [ ] **SEO-02** XML sitemaps per property (root, hk, sg) + sitemap index
- [ ] **SEO-03** robots.txt per property
- [ ] **SEO-04** `llms.txt` + `llms-full.txt` per property (per llmstxt.org spec, generated)
- [ ] **SEO-05** JSON-LD per page: Organization (root), LocalBusiness (location pages), FAQPage (homepages + FAQ pages), Event (camp content), BreadcrumbList, VideoObject (where video is the primary content)
- [ ] **SEO-06** Lighthouse 95+ on all homepage and pillar pages (mobile)
- [ ] **SEO-07** Core Web Vitals green on all homepage and pillar pages
- [ ] **SEO-08** Crawl-friendly content hierarchy + a11y (WCAG 2.2 AA where feasible)
- [ ] **SEO-09** GA4 + Search Console verified across all 3 properties
- [ ] **SEO-10** GBP listings audited / NAP consistency confirmed for Wan Chai, Cyberport, Katong Point

#### Migration & Launch
- [ ] **MIG-01** Domain `proactivsports.com` acquired / DNS at Cloudflare
- [ ] **MIG-02** Legacy `.net` URLs crawled and 301-mapped URL-by-URL to new ecosystem
- [ ] **MIG-03** Pre-launch security pass (no `.net`-style malware regression vectors)
- [ ] **MIG-04** Cutover plan + DNS rollback runbook

### Out of Scope (for v1.0)

- E-commerce / direct online booking payments — booking goes through existing booking system / WhatsApp / enquiry form (mention if you want this in v1.5)
- Mobile app — web-first
- Multilingual content (zh-HK, zh-CN, etc.) — English-only at launch; revisit post-launch based on traffic data
- Account/portal area for parents (booking history, attendance) — out of v1.0; potential v2
- Tier-3 and Tier-4 supporting pages from strategy PART 12 (months 3-12 work)
- Recreating the legacy `.net` site's pages 1:1 — only the URLs that have inbound links / traffic get 301'd; the rest die

## Context

- **Brand:** ProActiv Sports (HQ Hong Kong, founded 2011). Sub-brands: **ProGym** (HK gymnastics venues), **Prodigy** (SG multi-sport).
- **Founders / leadership** named in strategy doc: Will (Founder), Monica (Director of Sports, HK), Haikel (Head of Sports, SG).
- **Audience:** affluent parents with children aged 2–16 (HK serves 12 months up; SG camps primarily 4–12).
- **Brand palette** (from `assets/brand/guidelines/brand-guidelines.pdf`):
  - **Primary:** `#0f206c` (navy) · `#ffffff` · `#ec1c24` (red)
  - **Secondary:** `#0f9733` (green) · `#0fa0e2` (sky) · `#fac049` (yellow) · `#fff3dd` (cream)
- **Typography:** Bloc Bold (headlines) · Mont (body) · Baloo (Progym body usage)
- **Logos:** ProActiv, ProGym, Prodigy lockups in `assets/brand/logos/` (PNG + .ai source)
- **Media library:** ~22 GB of real photos + videos in `/Users/martin/Downloads/ProActive/`. Inventoried at `.planning/inputs/MEDIA-INVENTORY.md`. Will be processed and uploaded to Mux (video) / Sanity (images) during Phase 2.
- **Legacy site:** `proactivsports.net` had suspected malware / black-hat SEO. New ecosystem must be clean from the ground up. WordPress is suspected as the compromised platform — headless stack chosen to reduce attack surface.
- **Operates in:** Hong Kong (Wan Chai, Cyberport) + Singapore (Katong, with IFS school partnership).

## Constraints

- **Tech stack:** Next.js 15 (App Router, RSC) + Tailwind + shadcn/ui pattern + **Sanity CMS** + Vercel + Cloudflare (CDN/WAF) + Mux (video). Stack chosen by client decision; not open for re-debate without explicit re-discussion.
- **Repo shape:** **Single Next.js app** with subdomain middleware routing root / hk / sg to different page trees. Not three separate apps.
- **Domain:** `proactivsports.com` is owned but deliberately not at Cloudflare yet — DNS transfer + WAF are Phase 10 work. Development uses Vercel preview URLs (`*.vercel.app`) through Phase 9.
- **Hosting:** Vercel (frontend, preview + production) + Cloudflare (DNS, WAF, CDN — attached at Phase 10). Sanity hosted. one.com rejected for staging — incompatible with Next.js middleware + ISR.
- **CMS independence:** non-technical client team must be able to manage homepage visuals + publish blog without developer involvement. This is a hard requirement — anything that fails this is a v1.0 blocker.
- **Security:** Cloudflare WAF + bot management + rate limiting + secrets in Vercel env / 1Password Business. Sentry for runtime monitoring. No `.env` in git, ever.
- **Performance budget:** LCP < 2.5s, INP < 200ms, CLS < 0.1 on homepage and pillar pages (mobile, throttled). Lighthouse 95+ on the same set.
- **No black-hat SEO.** No PBNs, no doorway pages, no thin local pages, no keyword stuffing.
- **Brand fidelity:** existing palette + typography are honoured, not re-invented. No "AI-generated SaaS" aesthetic.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 3-layer subdomain ecosystem (root + hk + sg) | Strategy doc PART 1+2: distinct market offers (gymnastics-anchored HK vs Prodigy multi-sport SG) justify subdomain separation; mitigated authority-split via cross-linking + shared Org schema | — Pending (validates after launch + ranking data) |
| Sanity over Payload for CMS | Best-in-class non-technical editor UX; hosted (lower ops burden); strong media pipeline; client team independence is the priority | — Pending |
| Single Next.js app w/ subdomain middleware | Shared design system, single deploy, simpler ops; route guards prevent cross-market leakage | — Pending |
| Quality model profile (opus on planning agents) | Long-lived client production site; cost of bad planning >> cost of opus tokens | — Pending |
| Skip GSD research step | Strategy doc is the research; running 4 parallel domain researchers would duplicate work | ✓ Good |
| Project-scoped skill kit (32 skills) | frontend-design, lp-editor, page-cro, ai-seo, schema-markup, seo-audit, geo-fix-llmstxt + claude-seo suite — directly relevant to the build, scoped so they don't pollute other projects | ✓ Good (committed `4c451ae`) |
| Defer domain/DNS/Cloudflare to Phase 10 | Build entirely on Vercel preview URLs through Phase 9; attach `proactivsports.com` at launch. Lets build proceed without DNS coordination; Vercel previews give full-stack testability for free | — Pending |
| Reject one.com for staging | Shared PHP hosting incompatible with Next.js App Router middleware + ISR — static export would break subdomain routing + Sanity webhook revalidation | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-22 after initialization. Strategy doc is canonical at `.planning/inputs/strategy.md`.*

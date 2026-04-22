# Roadmap: ProActiv Sports Website Ecosystem

## Overview

Build a 3-layer brand ecosystem — one premium root gateway (`proactivsports.com`) plus two fully developed market subdomains (`hk.` and `sg.`) — on a single Next.js 15 app with Sanity CMS, Vercel, Cloudflare, and Mux. Eleven phases take the project from zero (domain sitting outside Cloudflare, no repo) to a publicly launched ecosystem with the legacy `.net` migrated, analytics verified across three properties, Lighthouse 95+ on every primary page, and a CMS the client team can drive without a developer. Strategy doc `.planning/inputs/strategy.md` is canonical; phases cite PART anchors inline.

## Phases

**Phase Numbering:**
- Integer phases (0–10): Planned milestone work for v1.0
- Decimal phases (2.1, 2.2): Reserved for urgent insertions — none at initialisation

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 0: Domain, DNS, and environments** - Move `proactivsports.com` to Cloudflare, stand up staging, wire secrets / Sentry / CI — nothing public yet
- [ ] **Phase 1: Next.js foundation, subdomain middleware, Sanity Studio scaffold** - Single app boots; root/hk/sg route correctly; empty Studio is reachable
- [ ] **Phase 2: Design system, component gallery, media pipeline** - Tokens + typography + primitives + AVIF/WebP + Mux live; real photography processed; `/_design/` gallery shows every primitive
- [ ] **Phase 3: Root gateway (`proactivsports.com`) and supporting root pages** - Gateway homepage plus brand / coaching-philosophy / news / careers / contact / legal ship
- [ ] **Phase 4: Hong Kong market** - HK homepage, two location pages, gymnastics pillar + 8 sub-programmes, camps, parties, schools, competitions, coaches, blog hub, FAQ, book-a-trial
- [ ] **Phase 5: Singapore market** - SG homepage, Katong Point, weekly classes + 3 zones, Prodigy camps + 3 camp types, parties, IFS schools, events, coaches, blog, FAQ, book-a-trial
- [ ] **Phase 6: Sanity content models, editor UX, webhook → ISR** - Editor can publish homepage updates and blog posts end-to-end without developer help
- [ ] **Phase 7: SEO, schema, and LLMO implementation** - Metadata, sitemaps, robots, `llms.txt`, JSON-LD, Lighthouse 95+ and CWV green on all primary pages, WCAG 2.2 AA
- [ ] **Phase 8: Analytics, Google Business Profile, NAP consistency** - GA4 + Search Console verified across 3 properties with conversion events; canonical NAP reconciled for all three venues
- [ ] **Phase 9: Legacy `.net` migration and security hardening** - 301 map deployed, Cloudflare WAF rules tested, dependency audit clean, cutover runbook rehearsed
- [ ] **Phase 10: Launch and post-launch loop** - DNS cutover, smoke tests pass, first blog cluster seeded, backlink outreach framework operating

## Phase Details

### Phase 0: Domain, DNS, and environments
**Goal**: Move control of `proactivsports.com` to Cloudflare, stand up a private staging deployment, and wire every secret / monitoring / CI guardrail that every later phase depends on — before a single public-facing line of code ships.
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-05, FOUND-06, FOUND-07, FOUND-08, MIG-01
**Success Criteria** (what must be TRUE):
  1. `dig NS proactivsports.com` resolves to Cloudflare nameservers and `curl https://staging.proactivsports.com/` returns a 200 from Vercel with a valid `*.proactivsports.com` certificate
  2. A fresh clone of the GitHub repo cannot merge to `main` without a passing PR CI run (typecheck + lint) and a Vercel preview deployment
  3. No secret exists in git history; every Vercel environment (preview + production) reads its values from the configured secrets source (1Password / Vercel env), and a forced test commit of a fake secret is blocked by CI
  4. Cloudflare WAF, bot management, and rate limiting are toggled on for the zone with managed rulesets enabled — any public request is already going through them
  5. A deliberate `throw new Error("sentry-smoke")` in a preview deployment surfaces in Sentry within 60 seconds, tagged with the correct environment
**Strategy anchors**: PART 13.1 (stack), PART 13.6 (security discipline), PART 15.4 Weeks 0–2 (technical setup)
**Rough shape**: Cloudflare zone transfer and cert, Vercel project + staging subdomain, GitHub repo with branch protection and PR CI, Vercel env wiring from 1Password, Cloudflare WAF / bot / rate-limiting baseline toggle, Sentry project + DSN wired frontend-side with release tagging.
**Plans**: TBD

---

### Phase 1: Next.js foundation, subdomain middleware, Sanity Studio scaffold
**Goal**: A single Next.js 15 app boots on Vercel, middleware routes requests by subdomain into three separate route trees (`(root)` / `(hk)` / `(sg)`), and an empty but reachable Sanity Studio exists — the skeleton every later phase fills in.
**Depends on**: Phase 0
**Requirements**: FOUND-02, FOUND-03, FOUND-04
**Success Criteria** (what must be TRUE):
  1. `https://staging.proactivsports.com/`, `https://hk.staging.proactivsports.com/`, and `https://sg.staging.proactivsports.com/` each render a distinct placeholder page proving the middleware routed to a different route group (`app/(root)/` vs `app/(hk)/` vs `app/(sg)/`)
  2. The single Next.js app builds in one Vercel deploy, with Tailwind and the shadcn-pattern base components installed and typed
  3. Sanity Studio is reachable at the agreed admin path (e.g. `studio.proactivsports.com` or `/studio`), authenticated, and shows at least one seed schema document — even if empty
  4. A hostile request to `hk.staging.proactivsports.com/sg-only-route` does NOT leak content from the SG tree (route guards in middleware verified by test)
**Strategy anchors**: PART 2 (site architecture), PART 13.1 (stack), PART 15.4 Weeks 0–2
**Rough shape**: Next.js 15 App Router project scaffold, Tailwind + shadcn base, `middleware.ts` rewriting by `Host` header into route groups, Sanity project created and Studio scaffold deployed with seed schema stubs and auth configured.
**Plans**: TBD

---

### Phase 2: Design system, component gallery, media pipeline
**Goal**: The visual and media foundation is production-ready — brand tokens, self-hosted typography, ~20 UI primitives, the Sharp→AVIF/WebP image pipeline, Mux video, and the ~22 GB of real ProActiv photography processed — so every page built after this is assembling, not inventing.
**Depends on**: Phase 1
**Requirements**: DS-01, DS-02, DS-03, DS-04, DS-05, DS-06
**Success Criteria** (what must be TRUE):
  1. Every primitive component (Button, Card, Section, ContainerEditorial, MarketCard, ProgrammeTile, TestimonialCard, FAQItem, LogoWall, StatStrip) renders in `/_design/` against at least one real ProActiv photograph and passes keyboard-nav + WCAG AA contrast checks
  2. Bloc Bold, Mont, and Baloo are self-hosted, preloaded, and produce zero CLS for font loading on `/_design/` measured in Lighthouse
  3. An `<Image>` component fed the largest hero photo emits AVIF + WebP responsive variants, and a Mux video primitive plays the first camp clip on desktop + mobile
  4. The media inventory at `.planning/inputs/MEDIA-INVENTORY.md` has every hero-tier asset picked, optimised, and checked into Sanity / Mux — raw 22 GB source is no longer needed for rendering
  5. A dev viewing `/_design/` can visually distinguish the ProActiv aesthetic (editorial asymmetry, real photography, confident type) from the "AI SaaS" anti-pattern called out in strategy PART 14.3
**Strategy anchors**: PART 14.1 (colour), PART 14.2 (typography), PART 14.3 (visual direction), PART 14.4 (photography), PART 14.5 (video), PART 15.4 Weeks 2–4
**UI hint**: yes
**Rough shape**: Tailwind config with brand tokens, self-hosted fonts preloaded via `next/font` with `display: swap` tuning, primitive components in `components/ui/`, Sharp-based image optimisation wrapper, `@mux/mux-player-react` integration, media processing pass against `MEDIA-INVENTORY.md`, `/_design/` gallery route gated to preview / dev.
**Plans**: TBD

---

### Phase 3: Root gateway and supporting root pages
**Goal**: The `proactivsports.com/` gateway — brand-led hero, dual market entry, 8 sections per strategy PART 3 — ships alongside the root-level supporting pages (brand, coaching philosophy, news, careers, contact, legal), giving every downstream CTA on HK and SG something credible to link back to.
**Depends on**: Phase 2
**Requirements**: GW-01, GW-02, GW-03, GW-04, GW-05, GW-06, GW-07
**Success Criteria** (what must be TRUE):
  1. A logged-out visitor loading `proactivsports.com/` sees the dual market entry (Enter Hong Kong / Enter Singapore) above the fold and both CTAs route to the correct subdomains
  2. `/brand/`, `/coaching-philosophy/`, `/news/`, `/careers/`, `/contact/`, `/privacy/`, `/terms/` all render with unique `<h1>`, real content, and the shared root navigation / footer
  3. `/contact/` with HK selected routes the enquiry to the HK inbox (and SG to the SG inbox) — verified end-to-end against the chosen form backend
  4. The root pages use only primitives from Phase 2 — no one-off CSS — and the hero, leadership portraits, and trust strip use real ProActiv photography
  5. All root pages return 200 from `staging.proactivsports.com` with valid OG previews when shared to WhatsApp / iMessage
**Strategy anchors**: PART 3 (root wireframe), PART 6A (root copy), PART 12 Tier 1 #13 (Root `/brand/`), PART 15.4 Weeks 4–7
**UI hint**: yes
**Rough shape**: Eight sections of the gateway homepage built section-by-section per PART 3, six root evergreen pages driven by placeholder content (CMS content models come in Phase 6 — content lives in code or Markdown sources for now), market-routed contact form wired to the chosen mail / CRM backend.
**Plans**: TBD

---

### Phase 4: Hong Kong market
**Goal**: The full HK market — homepage, two locations, gymnastics pillar with 8 sub-programmes, camps / parties / schools / competitions, coaches, blog hub, FAQ, and book-a-trial — ships so any parent landing anywhere on `hk.proactivsports.com` can reach a booking flow within two clicks.
**Depends on**: Phase 3
**Requirements**: HK-01, HK-02, HK-03, HK-04, HK-05, HK-06, HK-07, HK-08, HK-09, HK-10, HK-11, HK-12
**Success Criteria** (what must be TRUE):
  1. `hk.proactivsports.com/` renders the full PART 4 wireframe with looping hero video, venue chip row (Wan Chai + Cyberport), programme cards, location split, social proof, and a visible `Book a Free Trial` CTA above the fold on mobile
  2. `/wan-chai/` and `/cyberport/` each show correct NAP (15/F The Hennessy, 256 Hennessy Rd; Cyberport 5,000 sq ft), map embed, opening hours, programme list, and a venue-specific booking CTA
  3. The gymnastics pillar at `/gymnastics/` plus its 8 sub-pages (toddlers / beginner / intermediate / advanced / competitive / rhythmic / adult / private) are all navigable from the pillar and carry distinct age-band content
  4. A user on any HK page can reach `/book-a-trial/` in ≤ 2 clicks, and `/book-a-trial/free-assessment/` submits a booking that arrives at the HK inbox with venue pre-filled
  5. `/blog/`, `/faq/`, `/coaches/`, `/competitions-events/`, `/school-partnerships/`, `/holiday-camps/`, and `/birthday-parties/` all render with at least placeholder content, unique metadata, and the shared HK nav — nothing 404s
**Strategy anchors**: PART 4 (HK wireframe), PART 6B (HK copy), PART 8 (local SEO — Wan Chai + Cyberport), PART 12 Tier 1 #1–#5 and #10–#12, PART 15.4 Weeks 4–9
**UI hint**: yes
**Rough shape**: 22 HK-scoped pages composed from Phase 2 primitives; content is hardcoded or stubbed against forthcoming CMS types; booking form submits through the contact backend introduced in Phase 3 with an HK destination; venue maps lazy-loaded via lightweight embed, not full Google Maps JS.
**Plans**: TBD

---

### Phase 5: Singapore market
**Goal**: The full SG market — homepage, Katong Point, weekly classes pillar with three zones, Prodigy camps pillar with three camp types, parties, IFS schools, events, coaches, blog, FAQ, book-a-trial — ships with the distinct Prodigy / MultiBall identity that strategy PART 1 and PART 5 argue is a separate product from HK, not a locale variant.
**Depends on**: Phase 3 (can run after Phase 4 or in parallel; treated as sequential here for solo execution)
**Requirements**: SG-01, SG-02, SG-03, SG-04, SG-05, SG-06, SG-07, SG-08, SG-09, SG-10, SG-11
**Success Criteria** (what must be TRUE):
  1. `sg.proactivsports.com/` renders the full PART 5 wireframe with Katong Point hero, zones preview, upcoming Prodigy camps, trust row, and a visible `Book a Free Trial` CTA above the fold on mobile
  2. `/katong-point/` shows correct NAP (451 Joo Chiat Rd, Level 3), opening hours, transit copy (East Coast / Marine Parade / Tanjong Katong) and prominently carries "Singapore's only MultiBall wall"
  3. `/weekly-classes/` pillar plus Movement / Sports+MultiBall / Climbing zone sub-pages all render with distinct age-band and apparatus copy
  4. `/prodigy-camps/` pillar plus themed / multi-activity / gymnastics sub-pages render with forthcoming-camp CMS-stubs and each carry a venue booking CTA
  5. `/birthday-parties/`, `/school-partnerships/` (with IFS), `/events/`, `/coaches/`, `/blog/`, `/faq/`, and `/book-a-trial/` all render, 200, with unique metadata and an SG-routed booking form that arrives at the SG inbox
**Strategy anchors**: PART 5 (SG wireframe), PART 6C (SG copy), PART 8 (local SEO — Katong Point), PART 12 Tier 1 #6–#9 and #10–#12, PART 15.4 Weeks 4–9
**UI hint**: yes
**Rough shape**: ~15 SG-scoped pages composed from Phase 2 primitives with Prodigy-branded variants (Baloo typography treatment per PROJECT.md), MultiBall-forward copy, IFS partnership callout on `/school-partnerships/`, booking backend targets SG inbox.
**Plans**: TBD

---

### Phase 6: Sanity content models, editor UX, webhook → ISR
**Goal**: Every editable block identified in strategy PART 13.2 is a real Sanity document type with role-based access, the blog editor has the full SEO field set, and an editor hitting Publish sees the change live on `staging.proactivsports.com` within seconds via webhook-triggered ISR — without touching a developer.
**Depends on**: Phase 3, Phase 4, Phase 5 (pages must exist before their content becomes editable)
**Requirements**: CMS-01, CMS-02, CMS-03, CMS-04, CMS-05, CMS-06, CMS-07
**Success Criteria** (what must be TRUE):
  1. A Sanity user in the Editor role can log in, change the root homepage hero copy + image, hit Publish, and see the change live on `staging.proactivsports.com/` within 30 seconds (webhook-triggered `revalidatePath`)
  2. A Sanity user in the Author role can draft a blog post with slug, meta title, meta description, OG image, alt text, categories, tags, and author (linked to a Coach Person entity), schedule it for a future date, and see it publish automatically at that time
  3. The homepage "Latest from the blog" block auto-populates with the 3 most recent published posts; flipping a "Featured" toggle on an older post promotes it to the first slot
  4. A Camp document with start/end date + location + offer fields renders Event JSON-LD on its page without any developer action — validated against Google's Rich Results Test
  5. An editor who uploads a new hero image with alt text sees it swap in on the next publish; an editor who tries to save without alt text is warned, and no image without alt text reaches production
**Strategy anchors**: PART 13.2 (editable vs static map), PART 13.3 (dynamic sync), PART 13.4 (blog editor), PART 13.5 (roles), PART 13.6 (security)
**Rough shape**: Sanity schemas for Hero / MarketCard / ProgrammeCard / Venue / Person / Post / Camp / Page / Testimonial / Logo / FAQItem; Studio access groups (Admin / Editor / Author / Marketing / Viewer) with 2FA on Admin and Editor; webhook → Vercel deploy hook → `revalidatePath` for affected routes; Portable Text rich editor with required-field enforcement; scheduled publish via Sanity cron; featured-blog logic in homepage data query; Event JSON-LD generated from Camp fields.
**Plans**: TBD

---

### Phase 7: SEO, schema, and LLMO implementation
**Goal**: Every primary and pillar page carries correct metadata, JSON-LD, accessibility, and performance — Lighthouse ≥ 95 mobile, CWV green, WCAG 2.2 AA, per-property sitemaps + robots + llms.txt generated — so the ecosystem is discoverable by Google and citable by LLMs on day one of launch.
**Depends on**: Phase 6 (CMS fields drive metadata and schema — must exist first)
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, SEO-08
**Success Criteria** (what must be TRUE):
  1. Lighthouse mobile scores are ≥ 95 (Performance, Accessibility, Best Practices, SEO) on root `/`, hk `/`, sg `/`, all 3 location pages, and every pillar page — measured from a cold preview deploy, not a warmed cache
  2. Core Web Vitals on the same page set show LCP < 2.5s, INP < 200ms, CLS < 0.1 in a throttled mobile Lighthouse run and in field-style synthetic p75 check
  3. `curl https://proactivsports.com/sitemap.xml`, `https://hk.proactivsports.com/sitemap.xml`, `https://sg.proactivsports.com/sitemap.xml`, and the root sitemap index all return valid XML listing every canonical page; `robots.txt` is served correctly per property; `llms.txt` and `llms-full.txt` per property validate against the llmstxt.org spec
  4. JSON-LD renders correctly per strategy PART 9.1: Organization on root, LocalBusiness on each of the 3 location pages, FAQPage on homepages + FAQ hubs, Event on camp pages, BreadcrumbList on deep pages, VideoObject where video is primary, Person on coach bios — all validated against Google's Rich Results Test with zero errors
  5. Keyboard-only navigation works across every primary page; focus indicators are visible and WCAG AA contrast; screen reader walks the page in a logical order with a correct `<h1>` per page
**Strategy anchors**: PART 7 (SEO package), PART 9 (schema package), PART 10 (LLM / AI visibility), PART 13.2 (SEO fields), PART 15.4 Weeks 7–9
**Rough shape**: Per-page metadata via Next.js `generateMetadata` reading from Sanity SEO fields with sane fallbacks; `sitemap.xml` routes per property; robots routes per property; `llms.txt` + `llms-full.txt` ISR-generated; typed JSON-LD helpers per strategy PART 9.3–9.5; accessibility audit pass (axe + manual keyboard walk); performance pass (image lazy-loading, route-level code-split, font preload, remove render-blocking scripts).
**Plans**: TBD

---

### Phase 8: Analytics, Google Business Profile, NAP consistency
**Goal**: GA4 and Search Console are live and verified on all three properties with conversion events firing, and the NAP (name / address / phone) across ProGym Wan Chai, ProGym Cyberport, and Prodigy @ Katong Point is reconciled to a single canonical source between the site and each venue's Google Business Profile.
**Depends on**: Phase 7 (pages must be their final canonical versions before GSC verification and NAP reconciliation)
**Requirements**: SEO-09, SEO-10
**Success Criteria** (what must be TRUE):
  1. GA4 property receives events from all three subdomains (root, hk, sg) with cross-domain session linking working — a user clicking Root → HK → HK blog post appears as one session, not three
  2. Conversion events `book-a-trial_submitted`, `enquire_submitted`, and `whatsapp_click` fire correctly and appear in GA4 real-time — validated with at least one test submission per market
  3. Search Console is verified for `proactivsports.com`, `hk.proactivsports.com`, and `sg.proactivsports.com`; each has its sitemap submitted and no critical coverage errors reported
  4. A single canonical NAP per venue exists in a documented source of truth; the site footers, location pages, schema, and each Google Business Profile all match it exactly (no trailing punctuation drift, no abbreviation drift)
  5. All three GBPs are claimed with correct primary category, hours, and at least 5 fresh venue photos uploaded each — strategy PART 8.3 checklist items 1–4 are complete
**Strategy anchors**: PART 8.3 (NAP / GBP / citations), PART 15.2 Warning #2 (cross-domain GA4), PART 15.4 Weeks 11–13
**Rough shape**: GA4 with GTM cross-domain config; Search Console verification via DNS TXT (already at Cloudflare from Phase 0); conversion events wired to form submits and WhatsApp click handlers; NAP reconciliation spreadsheet + single canonical YAML / Sanity Venue document per location; GBP audit and update per the PART 8.3 checklist.
**Plans**: TBD

---

### Phase 9: Legacy `.net` migration and security hardening
**Goal**: The legacy `proactivsports.net` (and its HK/SG subdomains) is crawled for every URL that actually earns traffic or has a backlink, each is 301-mapped to its new ecosystem home, Cloudflare's WAF + bot management + rate limiting rules are tightened and tested against the actual routes, the dependency audit is clean, and a rehearsed cutover runbook (minus the DNS switch itself) exists.
**Depends on**: Phase 8 (canonical URLs and analytics must exist before mapping `.net` URLs to them)
**Requirements**: CMS-08, MIG-02, MIG-03
**Success Criteria** (what must be TRUE):
  1. A URL-by-URL 301 map exists for every `.net` URL that earns measurable traffic or a backlink — verified against a Screaming Frog / Sitebulb crawl of the legacy properties — and every mapped source returns a 301 to its new destination on staging
  2. `pnpm audit` (or equivalent) reports zero high/critical CVEs; no Sanity public write token exists anywhere in client code; a deliberate `process.env` leak attempt in client code fails build
  3. Cloudflare WAF rules specifically protect `/api/*`, the Sanity webhook endpoint, and the contact / booking form routes; rate limiting on those routes blocks a synthetic flood test without harming a legitimate user
  4. An attempted WordPress-style attack vector (e.g. `/wp-login.php`, `/xmlrpc.php`) on any `*.proactivsports.com` subdomain is blocked at Cloudflare — proving the `.net`-era compromise surface is gone
  5. A dry-run of the cutover runbook (sections 1–N up to but not including the DNS switch itself) executes cleanly on staging with every step checked off and rollback step understood
**Strategy anchors**: PART 1 (why the clean `.com`), PART 13.6 (security discipline), PART 15.2 Warning #1 (`.net` reputation risk), PART 15.4 Week 10
**Rough shape**: Legacy crawl via Screaming Frog / Sitebulb; 301 map in `vercel.json` redirects or middleware; dependency audit + Dependabot configuration; Sanity token scoping audit; Cloudflare WAF rule set per route; rate-limit rules on write endpoints; cutover runbook Markdown with DNS swap order, cache purge steps, smoke test checklist, rollback plan, and TTL-lowering schedule.
**Plans**: TBD

---

### Phase 10: Launch and post-launch loop
**Goal**: Production DNS is cut over to the new ecosystem, smoke tests pass across all three properties, the first operational loop (content cadence, GBP review acquisition, backlink outreach) begins so the site starts compounding from day one.
**Depends on**: Phase 9
**Requirements**: MIG-04
**Success Criteria** (what must be TRUE):
  1. `dig proactivsports.com`, `hk.proactivsports.com`, and `sg.proactivsports.com` all resolve to the production Vercel edge via Cloudflare, certs valid, and the soft-launch smoke test checklist (homepage load, booking form submit per market, WhatsApp click, GBP map embed, sitemap fetch, llms.txt fetch) passes end-to-end
  2. The rollback plan documented in Phase 9 is printed / pinned, and the DNS TTL was lowered 24 hours before cutover per the runbook
  3. Cloudflare analytics and Sentry both show production traffic in the first hour post-cutover with error rate at or below the staging baseline
  4. The first content cadence is operating: at least one blog post is live on each market's `/blog/`, an outreach pipeline for the first 10 backlinks is defined per strategy PART 11, and the GBP review acquisition campaign is enabled (post-trial email template exists and is firing from the booking platform)
  5. A Day-90 review date is on the calendar with the rankings / organic traffic / trial booking baseline recorded against which it will be measured
**Strategy anchors**: PART 11 (backlink framework), PART 15.1 #1 (launch Tier 1 together), PART 15.4 Weeks 10–13 and Day 90 review
**Rough shape**: Production DNS cutover per runbook, smoke test execution, announcement to existing database only (strategy PART 15.4 Week 10), first blog post per market, backlink outreach framework operationalised, review acquisition template turned on, Day-90 review scheduled.
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 0. Domain, DNS, and environments | 0/TBD | Not started | - |
| 1. Next.js foundation + subdomain middleware + Sanity scaffold | 0/TBD | Not started | - |
| 2. Design system + component gallery + media pipeline | 0/TBD | Not started | - |
| 3. Root gateway + supporting root pages | 0/TBD | Not started | - |
| 4. Hong Kong market | 0/TBD | Not started | - |
| 5. Singapore market | 0/TBD | Not started | - |
| 6. Sanity content models + editor UX + webhook→ISR | 0/TBD | Not started | - |
| 7. SEO, schema, and LLMO | 0/TBD | Not started | - |
| 8. Analytics + GBP + NAP consistency | 0/TBD | Not started | - |
| 9. Legacy `.net` migration + security hardening | 0/TBD | Not started | - |
| 10. Launch + post-launch loop | 0/TBD | Not started | - |

## Coverage

**Requirements mapped:** 66 / 66 v1.0 requirements (100%) ✓
**Orphaned:** 0
**Duplicated:** 0

Per-category mapping:

| Category | Count | Phases |
|----------|-------|--------|
| FOUND | 8 | Phase 0 (5) + Phase 1 (3) |
| DS    | 6 | Phase 2 (6) |
| GW    | 7 | Phase 3 (7) |
| HK    | 12 | Phase 4 (12) |
| SG    | 11 | Phase 5 (11) |
| CMS   | 8 | Phase 6 (7) + Phase 9 (1 — CMS-08 Cloudflare WAF policy tightening) |
| SEO   | 10 | Phase 7 (8) + Phase 8 (2 — SEO-09 GA4/GSC, SEO-10 GBP/NAP) |
| MIG   | 4 | Phase 0 (1 — MIG-01 domain/DNS) + Phase 9 (2) + Phase 10 (1) |

---

*Roadmap created: 2026-04-22. Canonical strategy: `.planning/inputs/strategy.md`.*

# Roadmap: ProActiv Sports Website Ecosystem

## Overview

Build a 3-layer brand ecosystem — one premium root gateway (`proactivsports.com`) plus two fully developed market subdomains (`hk.` and `sg.`) — on a single Next.js 15 app with Sanity CMS, Vercel, Cloudflare, and Mux. Eleven phases take the project from zero (no repo, no code) to a publicly launched ecosystem with the legacy `.net` migrated, analytics verified across three properties, Lighthouse 95+ on every primary page, and a CMS the client team can drive without a developer. **Domain/DNS/Cloudflare work is deliberately pushed to Phase 10** so the build can happen entirely against Vercel preview URLs first and the live domain is only attached at launch. Strategy doc `.planning/inputs/strategy.md` is canonical; phases cite PART anchors inline.

## Phases

**Phase Numbering:**
- Integer phases (0–10): Planned milestone work for v1.0
- Decimal phases (2.1, 2.2): Reserved for urgent insertions — none at initialisation

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 0: Local foundation** - GitHub repo, branch protection + PR CI, secrets infra, Sentry wired — nothing public, no domain yet (completed 2026-04-22)
- [ ] **Phase 1: Next.js foundation, subdomain middleware, Sanity Studio scaffold, Vercel previews** - Single app boots; root/hk/sg route correctly on Vercel preview URLs; empty Studio reachable
- [ ] **Phase 2: Design system, component gallery, media pipeline** - Tokens + typography + primitives + AVIF/WebP + Mux live; real photography processed; `/_design/` gallery shows every primitive
- [ ] **Phase 3: Root gateway (`proactivsports.com`) and supporting root pages** - Gateway homepage plus brand / coaching-philosophy / news / careers / contact / legal ship
- [ ] **Phase 4: Hong Kong market** - HK homepage, two location pages, gymnastics pillar + 8 sub-programmes, camps, parties, schools, competitions, coaches, blog hub, FAQ, book-a-trial
- [ ] **Phase 5: Singapore market** - SG homepage, Katong Point, weekly classes + 3 zones, Prodigy camps + 3 camp types, parties, IFS schools, events, coaches, blog, FAQ, book-a-trial
- [ ] **Phase 6: Sanity content models, editor UX, webhook → ISR** - Editor can publish homepage updates and blog posts end-to-end without developer help
- [ ] **Phase 7: SEO, schema, and LLMO implementation** - Metadata, sitemaps, robots, `llms.txt`, JSON-LD, Lighthouse 95+ and CWV green on all primary pages, WCAG 2.2 AA
- [ ] **Phase 8: Analytics and GBP / NAP consistency** - GA4 conversion events firing on previews; GBP reconciled; Search Console verification prepared (activates once domain is live in Phase 10)
- [ ] **Phase 9: Legacy `.net` migration prep and security hardening** - 301 map built from `.net` crawl, dependency audit clean, cutover runbook rehearsed (domain swap itself happens in Phase 10)
- [ ] **Phase 10: Hosting, DNS, domain cutover, launch** - `proactivsports.com` on Cloudflare, Vercel project bound, WAF + rate limiting live, DNS cut over, smoke tests pass, post-launch loop begins

## Phase Details

### Phase 0: Local foundation
**Goal**: GitHub repo exists with branch protection and PR CI, local development environment is reproducible, Vercel project is created (preview deploys only — no custom domain), secrets infra is in place, Sentry is ready to catch errors — every dev-loop guardrail every later phase depends on is present before a single line of product code ships.
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-05, FOUND-06, FOUND-08
**Success Criteria** (what must be TRUE):
  1. A fresh clone of the GitHub repo cannot merge to `main` without a passing PR CI run (typecheck + lint) and a successful Vercel preview deployment
  2. No secret exists in git history; `.env.example` lists every required variable; local dev loads from `.env.local` (gitignored); Vercel preview + production environments read their values from the configured secrets source; a forced test commit of a fake secret pattern is blocked by CI
  3. A deliberate `throw new Error("sentry-smoke")` in a preview deployment surfaces in Sentry within 60 seconds, tagged with the correct environment
  4. The Vercel project is linked to the GitHub repo and every push to a PR branch produces a fresh preview URL on `*.vercel.app` with a distinct commit-SHA subdomain
**Strategy anchors**: PART 13.1 (stack), PART 13.6 (security discipline), PART 15.4 Weeks 0–2 (technical setup)
**Rough shape**: GitHub repo + branch protection + required CI checks, `.env.example` + `.env.local` pattern, secrets in Vercel env dashboard (manual load for solo dev — 1Password Business sync comes in Phase 10), Sentry project + DSN wired frontend-side with release tagging, Vercel project created and linked to the GitHub repo.
**Plans**: 6 plans
  - [x] 00-01-PLAN.md — Repo scaffold: minimal Next.js 15 App Router + TS + Tailwind + ESLint via create-next-app, Node/pnpm pinning, `.env.example` + `.gitignore` discipline, GitHub meta files (README, PR template, CODEOWNERS, dependabot)
  - [x] 00-02-PLAN.md — Pre-commit hooks: lefthook + gitleaks (secret scan, layer 1) + commitlint (Conventional Commits) + lint-staged; hook smoke-test checkpoint
  - [x] 00-03-PLAN.md — Vercel link + Deployment Protection (Vercel Authentication) + X-Robots-Tag `noindex, nofollow` on non-production via next.config.js
  - [x] 00-04-PLAN.md — GitHub Actions CI (`typecheck + lint + build + gitleaks` required checks) + branch protection on `main` + GH native secret scanning / push protection
  - [x] 00-05-PLAN.md — Sentry wizard (@sentry/nextjs client + server + edge) + VERCEL_ENV tagging + gated `/api/sentry-smoke` route + conservative PII scrubbing (sendDefaultPii: false + beforeSend)
  - [x] 00-06-PLAN.md — End-to-end verification: D-08 negative secret-scan test (fake AWS key → CI must fail), Sentry smoke verification on live preview, `X-Robots-Tag` + branch protection audit, `docs/phase-0-verification.md` audit artifact

---

### Phase 1: Next.js foundation, subdomain middleware, Sanity Studio scaffold, Vercel previews
**Goal**: A single Next.js 15 app boots on Vercel preview URLs, middleware routes requests by subdomain into three separate route trees (`(root)` / `(hk)` / `(sg)`), and an empty but reachable Sanity Studio exists. Subdomain routing is validated either via `*.vercel.app` preview-host conventions or `*.localhost` for local testing — the real `*.proactivsports.com` bindings happen in Phase 10.
**Depends on**: Phase 0
**Requirements**: FOUND-02, FOUND-03, FOUND-04
**Success Criteria** (what must be TRUE):
  1. The latest preview deployment at `<sha>-proactive.vercel.app` renders a distinct placeholder for root / hk / sg route groups — verified by hitting the preview URL with modified `Host` headers OR by configuring preview subdomain simulation (`root-<sha>`, `hk-<sha>`, `sg-<sha>` Vercel aliases)
  2. The single Next.js app builds in one Vercel deploy, with Tailwind and the shadcn-pattern base components installed and typed
  3. Sanity Studio is reachable at the agreed path (`/studio` in the same app, or a separate Vercel deployment), authenticated, and shows at least one seed schema document — even if empty
  4. A hostile request simulating `hk.*` hitting an `(sg)` route does NOT leak content from the SG tree (route guards in middleware verified by a Vitest / Playwright test)
  5. `pnpm dev` locally + `http://root.localhost:3000`, `http://hk.localhost:3000`, `http://sg.localhost:3000` render their respective route groups (works in Chrome / Safari without `/etc/hosts` changes due to the `localhost` wildcard)
**Strategy anchors**: PART 2 (site architecture), PART 13.1 (stack), PART 15.4 Weeks 0–2
**Rough shape**: Next.js 15 App Router project scaffold, Tailwind + shadcn base, `middleware.ts` rewriting by `Host` header into route groups with dev-mode `localhost` handling, Sanity project created and Studio scaffold deployed with seed schema stubs and auth configured, route-guard test.
**Plans**: 4 plans
  - [x] 01-01-PLAN.md — middleware.ts (D-01 precedence ladder) + 3 route-group placeholder trees (app/root, app/hk, app/sg) with distinguisher stripes + verbatim UI-SPEC copy; deletes create-next-app boilerplate
  - [x] 01-02-PLAN.md — shadcn/ui CLI init (style=new-york, baseColor=neutral, cssVariables=true) + Button primitive + cn() helper; proves the registry pipe for Phase 2's DS-03
  - [x] 01-03-PLAN.md — Sanity runtime deps + 8 empty schema stubs (D-11) with siteSettings singleton (D-12) + embedded Studio at /studio (D-06) with Structure+Vision+Presentation plugins (D-14, install-only) + .env.example contract + README preview recipe + middleware /studio pass-through (D-07); HUMAN-ACTION checkpoint for Martin to drop credentials per D-09
  - [x] 01-04-PLAN.md — Vitest (D-15, middleware-scope only) + middleware.test.ts (D-16 hostile-request invariant, 7+ tests) + CI integration as 5th required check (D-17)

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
**Plans**: 6 plans
  - [ ] 02-01-PLAN.md — Brand token layer in globals.css (DS-01): new @theme { } block with 6 brand hex values + 3 font-family vars + 3 section-spacing vars; :root oklch overrides mapping 10 shadcn semantic roles to brand colours
  - [ ] 02-02-PLAN.md — Self-hosted typography via next/font/local (DS-02): app/fonts.ts exports Bloc Bold + Mont + Baloo with display:swap + adjustFontFallback:'Arial'; app/layout.tsx wires Bloc + Mont (Baloo D-03 scoped); HUMAN-ACTION precondition on 8 WOFF2 files at assets/brand/fonts/
  - [ ] 02-03-PLAN.md — Stock shadcn primitives (DS-03 half-a): CLI-add Card + Accordion + Badge + Avatar + Separator; add 'touch' size variant (h-11, 44px WCAG 2.2 AA) to Phase 1 Button CVA config
  - [ ] 02-04-PLAN.md — Custom primitives (DS-03 half-b + DS-06 groundwork): Section + ContainerEditorial wrappers, FAQItem composition, MarketCard + ProgrammeTile + TestimonialCard patterns on Card/Badge/Avatar, StatStrip + LogoWall plain compositions; Pillar 2 raw-hex gate
  - [ ] 02-05-PLAN.md — Media pipeline (DS-04): next.config.ts images {} block with AVIF/WebP + Sanity remotePattern; scripts/process-photos.mjs (Sharp LOCAL ONLY per Pitfall 4); components/ui/video-player.tsx shell with dynamic({ ssr:false }) + Mux public demo playback ID (D-06 placeholder); HUMAN-ACTION checkpoint on photo curation (D-07)
  - [ ] 02-06-PLAN.md — /_design/ gallery + verification gate (DS-05 + DS-06): all 14 primitives in Foundation → Primitives → Patterns → Media sections with editorial asymmetry; VERCEL_ENV='production' + notFound() env-gate (D-09); Lighthouse/axe-core/keyboard-walk verification of 5 ROADMAP SCs (SC #3 amended by D-06 for placeholder Mux); STRIDE threat model with 4 threats

---

### Phase 3: Root gateway and supporting root pages
**Goal**: The `proactivsports.com/` gateway — brand-led hero, dual market entry, 8 sections per strategy PART 3 — ships alongside the root-level supporting pages (brand, coaching philosophy, news, careers, contact, legal), giving every downstream CTA on HK and SG something credible to link back to. Rendered on Vercel preview URLs.
**Depends on**: Phase 2
**Requirements**: GW-01, GW-02, GW-03, GW-04, GW-05, GW-06, GW-07
**Success Criteria** (what must be TRUE):
  1. A logged-out visitor loading the root group on the latest Vercel preview sees the dual market entry (Enter Hong Kong / Enter Singapore) above the fold and both CTAs route to the correct HK/SG preview routes
  2. `/brand/`, `/coaching-philosophy/`, `/news/`, `/careers/`, `/contact/`, `/privacy/`, `/terms/` all render with unique `<h1>`, real content, and the shared root navigation / footer
  3. `/contact/` with HK selected routes the enquiry to the HK inbox (and SG to the SG inbox) — verified end-to-end against the chosen form backend in a preview environment
  4. The root pages use only primitives from Phase 2 — no one-off CSS — and the hero, leadership portraits, and trust strip use real ProActiv photography
  5. All root pages return 200 from the Vercel preview with valid OG previews when shared to WhatsApp / iMessage
**Strategy anchors**: PART 3 (root wireframe), PART 6A (root copy), PART 12 Tier 1 #13 (Root `/brand/`), PART 15.4 Weeks 4–7
**UI hint**: yes
**Rough shape**: Eight sections of the gateway homepage built section-by-section per PART 3, six root evergreen pages driven by placeholder content (CMS content models come in Phase 6 — content lives in code or Markdown sources for now), market-routed contact form wired to the chosen mail / CRM backend.
**Plans**: TBD

---

### Phase 4: Hong Kong market
**Goal**: The full HK market — homepage, two locations, gymnastics pillar with 8 sub-programmes, camps / parties / schools / competitions, coaches, blog hub, FAQ, and book-a-trial — ships on the HK preview routes so any parent landing anywhere in the HK tree can reach a booking flow within two clicks.
**Depends on**: Phase 3
**Requirements**: HK-01, HK-02, HK-03, HK-04, HK-05, HK-06, HK-07, HK-08, HK-09, HK-10, HK-11, HK-12
**Success Criteria** (what must be TRUE):
  1. The HK homepage on preview renders the full PART 4 wireframe with looping hero video, venue chip row (Wan Chai + Cyberport), programme cards, location split, social proof, and a visible `Book a Free Trial` CTA above the fold on mobile
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
  1. The SG homepage on preview renders the full PART 5 wireframe with Katong Point hero, zones preview, upcoming Prodigy camps, trust row, and a visible `Book a Free Trial` CTA above the fold on mobile
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
**Goal**: Every editable block identified in strategy PART 13.2 is a real Sanity document type with role-based access, the blog editor has the full SEO field set, and an editor hitting Publish sees the change live on the Vercel preview within seconds via webhook-triggered ISR — without touching a developer.
**Depends on**: Phase 3, Phase 4, Phase 5 (pages must exist before their content becomes editable)
**Requirements**: CMS-01, CMS-02, CMS-03, CMS-04, CMS-05, CMS-06, CMS-07
**Success Criteria** (what must be TRUE):
  1. A Sanity user in the Editor role can log in, change the root homepage hero copy + image, hit Publish, and see the change live on the latest Vercel preview within 30 seconds (webhook-triggered `revalidatePath`)
  2. A Sanity user in the Author role can draft a blog post with slug, meta title, meta description, OG image, alt text, categories, tags, and author (linked to a Coach Person entity), schedule it for a future date, and see it publish automatically at that time
  3. The homepage "Latest from the blog" block auto-populates with the 3 most recent published posts; flipping a "Featured" toggle on an older post promotes it to the first slot
  4. A Camp document with start/end date + location + offer fields renders Event JSON-LD on its page without any developer action — validated against Google's Rich Results Test on a preview URL
  5. An editor who uploads a new hero image with alt text sees it swap in on the next publish; an editor who tries to save without alt text is warned, and no image without alt text reaches production
**Strategy anchors**: PART 13.2 (editable vs static map), PART 13.3 (dynamic sync), PART 13.4 (blog editor), PART 13.5 (roles), PART 13.6 (security)
**Rough shape**: Sanity schemas for Hero / MarketCard / ProgrammeCard / Venue / Person / Post / Camp / Page / Testimonial / Logo / FAQItem; Studio access groups (Admin / Editor / Author / Marketing / Viewer) with 2FA on Admin and Editor; webhook → Vercel deploy hook → `revalidatePath` for affected routes; Portable Text rich editor with required-field enforcement; scheduled publish via Sanity cron; featured-blog logic in homepage data query; Event JSON-LD generated from Camp fields.
**Plans**: TBD

---

### Phase 7: SEO, schema, and LLMO implementation
**Goal**: Every primary and pillar page carries correct metadata, JSON-LD, accessibility, and performance — Lighthouse ≥ 95 mobile, CWV green, WCAG 2.2 AA, per-property sitemaps + robots + llms.txt generated — so the ecosystem is discoverable and citable by LLMs on day one once the domain is attached in Phase 10.
**Depends on**: Phase 6 (CMS fields drive metadata and schema — must exist first)
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, SEO-08
**Success Criteria** (what must be TRUE):
  1. Lighthouse mobile scores are ≥ 95 (Performance, Accessibility, Best Practices, SEO) on the root group `/`, hk `/`, sg `/`, all 3 location pages, and every pillar page — measured from a cold preview deploy, not a warmed cache
  2. Core Web Vitals on the same page set show LCP < 2.5s, INP < 200ms, CLS < 0.1 in a throttled mobile Lighthouse run and in field-style synthetic p75 check
  3. `/sitemap.xml` per route group, `/robots.txt`, `/llms.txt`, and `/llms-full.txt` all generate on the latest preview and validate — sitemaps use the eventual production origins (placeholder-swapped from the preview URL at build time)
  4. JSON-LD renders correctly per strategy PART 9.1: Organization on root, LocalBusiness on each of the 3 location pages, FAQPage on homepages + FAQ hubs, Event on camp pages, BreadcrumbList on deep pages, VideoObject where video is primary, Person on coach bios — all validated against Google's Rich Results Test with zero errors
  5. Keyboard-only navigation works across every primary page; focus indicators are visible and WCAG AA contrast; screen reader walks the page in a logical order with a correct `<h1>` per page
**Strategy anchors**: PART 7 (SEO package), PART 9 (schema package), PART 10 (LLM / AI visibility), PART 13.2 (SEO fields), PART 15.4 Weeks 7–9
**Rough shape**: Per-page metadata via Next.js `generateMetadata` reading from Sanity SEO fields with sane fallbacks; `sitemap.xml` routes per property using a configurable origin (preview vs production); robots routes per property; `llms.txt` + `llms-full.txt` ISR-generated; typed JSON-LD helpers per strategy PART 9.3–9.5; accessibility audit pass (axe + manual keyboard walk); performance pass (image lazy-loading, route-level code-split, font preload, remove render-blocking scripts).
**Plans**: TBD

---

### Phase 8: Analytics and GBP / NAP consistency
**Goal**: GA4 conversion events fire correctly on Vercel previews, the NAP (name / address / phone) across ProGym Wan Chai, ProGym Cyberport, and Prodigy @ Katong Point is reconciled to a single canonical source between the site and each venue's Google Business Profile, and GA4 / GSC configuration is prepared for DNS-based verification the moment the domain goes live in Phase 10.
**Depends on**: Phase 7 (pages must be their final canonical versions before NAP reconciliation and tracking wiring)
**Requirements**: SEO-09, SEO-10
**Success Criteria** (what must be TRUE):
  1. GA4 property receives events from all three route groups on the Vercel preview with cross-subdomain / cross-route-group session linking working — a user clicking root → HK → HK blog post appears as one session, not three
  2. Conversion events `book-a-trial_submitted`, `enquire_submitted`, and `whatsapp_click` fire correctly and appear in GA4 real-time — validated with at least one test submission per market on the preview
  3. A single canonical NAP per venue exists in a documented source of truth (Sanity Venue document or YAML); the site footers, location pages, schema, and each Google Business Profile all match it exactly (no trailing punctuation drift, no abbreviation drift)
  4. All three GBPs are claimed with correct primary category, hours, and at least 5 fresh venue photos uploaded each — strategy PART 8.3 checklist items 1–4 are complete
  5. A Search Console verification record is prepared as a TXT record ready for Cloudflare DNS (not yet submitted — verification happens in Phase 10 once the zone is live)
**Strategy anchors**: PART 8.3 (NAP / GBP / citations), PART 15.2 Warning #2 (cross-domain GA4), PART 15.4 Weeks 11–13
**Rough shape**: GA4 with GTM cross-subdomain config; conversion events wired to form submits and WhatsApp click handlers; NAP reconciliation spreadsheet + single canonical YAML / Sanity Venue document per location; GBP audit and update per the PART 8.3 checklist; GSC TXT record pre-generated and stored.
**Plans**: TBD

---

### Phase 9: Legacy `.net` migration prep and security hardening
**Goal**: The legacy `proactivsports.net` (and its HK/SG subdomains) is crawled for every URL that actually earns traffic or has a backlink, each is 301-mapped to its new ecosystem home (in `vercel.json` / middleware — ready to fire the moment the new domain is live), the dependency audit is clean, Sanity token scoping is verified, and a rehearsed cutover runbook exists (minus the DNS switch itself, which is Phase 10).
**Depends on**: Phase 8 (canonical URLs and analytics must exist before mapping `.net` URLs to them)
**Requirements**: MIG-02, MIG-03
**Success Criteria** (what must be TRUE):
  1. A URL-by-URL 301 map exists for every `.net` URL that earns measurable traffic or a backlink — verified against a Screaming Frog / Sitebulb crawl of the legacy properties — and every mapped source returns a 301 to its new destination when tested against the latest Vercel preview (using `X-Forwarded-Host` header simulation)
  2. `pnpm audit` (or equivalent) reports zero high/critical CVEs; no Sanity public write token exists anywhere in client code; a deliberate `process.env` leak attempt in client code fails build
  3. Sanity dataset permissions and API token scopes are audited — public token is read-only; write tokens exist only in server-side code with documented rotation policy
  4. A dry-run of the cutover runbook (sections 1–N up to but not including the DNS switch itself) executes cleanly on preview with every step checked off and rollback step understood
**Strategy anchors**: PART 1 (why the clean `.com`), PART 13.6 (security discipline), PART 15.2 Warning #1 (`.net` reputation risk), PART 15.4 Week 10
**Rough shape**: Legacy crawl via Screaming Frog / Sitebulb; 301 map in `vercel.json` redirects or middleware (activated when domain is attached in Phase 10); dependency audit + Dependabot configuration; Sanity token scoping audit; cutover runbook Markdown with DNS swap order, cache purge steps, smoke test checklist, rollback plan, and TTL-lowering schedule.
**Plans**: TBD

---

### Phase 10: Hosting, DNS, domain cutover, launch
**Goal**: `proactivsports.com` is transferred to Cloudflare, Vercel is bound to the three subdomains, Cloudflare WAF + bot management + rate limiting go live, Search Console verification completes, DNS cuts over to the new ecosystem, smoke tests pass across all three properties, the rehearsed runbook is executed, and the first operational loop (content cadence, GBP review acquisition, backlink outreach) begins so the site starts compounding from day one.
**Depends on**: Phase 9
**Requirements**: FOUND-01, FOUND-07, CMS-08, MIG-01, MIG-04
**Success Criteria** (what must be TRUE):
  1. `dig NS proactivsports.com` resolves to Cloudflare nameservers; `proactivsports.com`, `hk.proactivsports.com`, and `sg.proactivsports.com` all resolve to the production Vercel edge via Cloudflare; `*.proactivsports.com` cert is valid; the soft-launch smoke test checklist (homepage load, booking form submit per market, WhatsApp click, GBP map embed, sitemap fetch, llms.txt fetch, per-market OG preview) passes end-to-end
  2. Cloudflare WAF, bot management, and rate limiting are active for the zone; specific rules protect `/api/*`, the Sanity webhook endpoint, the contact / booking form routes, and block WordPress-era attack vectors (`/wp-login.php`, `/xmlrpc.php`) on every subdomain
  3. Search Console is verified for `proactivsports.com`, `hk.proactivsports.com`, and `sg.proactivsports.com` (via the DNS TXT record prepared in Phase 8); each has its sitemap submitted and no critical coverage errors reported within 24 hours of cutover
  4. Every 301 from the Phase 9 `.net` map returns a correct redirect on production; a synthetic load / flood test against `/api/*` and the booking form triggers rate-limit responses without harming a legitimate user
  5. The first content cadence is operating: at least one blog post is live on each market's `/blog/`, an outreach pipeline for the first 10 backlinks is defined per strategy PART 11, the GBP review acquisition campaign is enabled (post-trial email template exists and is firing from the booking platform), and a Day-90 review date is on the calendar with the rankings / organic traffic / trial booking baseline recorded against which it will be measured
**Strategy anchors**: PART 11 (backlink framework), PART 13.6 (security discipline), PART 15.1 #1 (launch Tier 1 together), PART 15.4 Weeks 10–13 and Day 90 review
**Rough shape**: Cloudflare zone transfer + NS change; Vercel domain attachment with cert provisioning for `proactivsports.com` + `*.proactivsports.com`; Cloudflare WAF managed rulesets + per-route custom rules + rate limiting; WordPress attack-surface blocklist; production DNS cutover per runbook with TTL lowered 24h prior; Search Console verification and sitemap submission; smoke test execution; first blog post per market; backlink outreach framework operationalised; GBP review acquisition template turned on; Day-90 review scheduled.
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 0. Local foundation | 6/6 | Complete    | 2026-04-22 |
| 1. Next.js foundation + subdomain middleware + Sanity scaffold + Vercel previews | 0/4   | Not started | - |
| 2. Design system + component gallery + media pipeline | 0/6   | Not started | - |
| 3. Root gateway + supporting root pages | 0/TBD | Not started | - |
| 4. Hong Kong market | 0/TBD | Not started | - |
| 5. Singapore market | 0/TBD | Not started | - |
| 6. Sanity content models + editor UX + webhook→ISR | 0/TBD | Not started | - |
| 7. SEO, schema, and LLMO | 0/TBD | Not started | - |
| 8. Analytics + GBP + NAP consistency | 0/TBD | Not started | - |
| 9. Legacy `.net` migration prep + security hardening | 0/TBD | Not started | - |
| 10. Hosting + DNS + domain cutover + launch | 0/TBD | Not started | - |

## Coverage

**Requirements mapped:** 66 / 66 v1.0 requirements (100%) ✓
**Orphaned:** 0
**Duplicated:** 0

Per-category mapping:

| Category | Count | Phases |
|----------|-------|--------|
| FOUND | 8 | Phase 0 (3: FOUND-05, -06, -08) + Phase 1 (3: FOUND-02, -03, -04) + Phase 10 (2: FOUND-01, -07) |
| DS    | 6 | Phase 2 (6) |
| GW    | 7 | Phase 3 (7) |
| HK    | 12 | Phase 4 (12) |
| SG    | 11 | Phase 5 (11) |
| CMS   | 8 | Phase 6 (7: CMS-01..CMS-07) + Phase 10 (1: CMS-08 Cloudflare WAF on specific routes) |
| SEO   | 10 | Phase 7 (8) + Phase 8 (2: SEO-09, SEO-10) |
| MIG   | 4 | Phase 9 (2: MIG-02, MIG-03) + Phase 10 (2: MIG-01 DNS transfer, MIG-04 cutover runbook exec) |

---

*Roadmap created: 2026-04-22. Revised 2026-04-22 to defer domain/DNS/Cloudflare work to Phase 10 (build on Vercel previews first). Canonical strategy: `.planning/inputs/strategy.md`.*

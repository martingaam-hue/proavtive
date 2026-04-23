# Phase 4: Hong Kong Market — Context

**Gathered:** 2026-04-24
**Status:** Ready for planning
**Areas discussed:** Hero video, HK nav structure, Coaches page

<domain>
## Phase Boundary

Phase 4 ships the full HK market layer on Vercel preview URLs: 22 pages assembled exclusively from Phase 2 primitives + Phase 3 patterns. No new design-system tokens. No new shadcn primitives beyond what Phase 3 already registered.

Pages in scope:
- HK homepage (12 sections per strategy PART 4)
- Location pages: ProGym Wan Chai (`/wan-chai/`), ProGym Cyberport (`/cyberport/`)
- Gymnastics pillar (`/gymnastics/`) + 8 static sub-pages (toddlers, beginner, intermediate, advanced, competitive, rhythmic, adult, private)
- Camps (`/holiday-camps/`), Birthday parties (`/birthday-parties/`), School partnerships (`/school-partnerships/`), Competitions & events (`/competitions-events/`)
- Coaches (`/coaches/`), Blog hub (`/blog/`), FAQ hub (`/faq/`), Book-a-trial hub + free assessment booking (`/book-a-trial/`, `/book-a-trial/free-assessment/`)
- Shared HK layout: `app/hk/layout.tsx` with HKNav + HKFooter wrapping all 22 pages

**Satisfies:** HK-01 through HK-12

**Out of scope for Phase 4:**
- CMS content models / Sanity-driven content (Phase 6)
- Dynamic `[slug]` routing (Phase 6 — all routes are static at Phase 4)
- Sitemap, robots.txt, BreadcrumbList, llms.txt, full JSON-LD suite (Phase 7)
- SG market pages (Phase 5)
- Real Mux video playback beyond what a HUMAN-ACTION gate can unlock

</domain>

<decisions>
## Implementation Decisions

### Hero video (Area A)

- **D-01: HK homepage hero video uses HUMAN-ACTION gate pattern.** Phase 4 executes all HK pages including the hero section structure. The hero section is scaffolded with the `<VideoPlayer>` component (from Phase 2, `dynamic({ ssr:false })`, Mux-backed), but execution pauses with a HUMAN-ACTION checkpoint before wiring the real Mux playback ID: "Add `NEXT_PUBLIC_HK_MUX_PLAYBACK_ID` to `.env.local` + Vercel preview env, then resume." This matches the Phase 2 fonts + Phase 3 leadership-portrait patterns. The poster image fallback (a full-bleed AVIF/WebP from `public/photography/`) renders while the checkpoint is outstanding — no broken state ships.

### HK nav structure (Area B)

- **D-02: HKNav primary items are Gymnastics [dropdown] | Locations [dropdown] | Camps | Coaches | FAQ | [Book a Free Trial button].** Six elements visible in the primary nav bar. Mobile menu uses the Sheet (slide-in drawer) pattern established by Phase 3's RootNav.

- **D-03: Gymnastics nav item opens a dropdown showing all 8 sub-programmes.** Implemented with shadcn `NavigationMenu` (Radix, already installed). Dropdown items: Toddlers, Beginner, Intermediate, Advanced, Competitive, Rhythmic, Adult, Private — each linking to its static sub-page under `/gymnastics/`. Maximises discoverability for parents seeking the right level.

- **D-04: Locations nav item opens a dropdown showing Wan Chai + Cyberport.** Two entries: "ProGym Wan Chai" → `/wan-chai/` and "ProGym Cyberport" → `/cyberport/`. No intermediate Locations overview page needed.

- **D-05: "Book a Free Trial" is a sticky primary CTA button in the top-right of HKNav.** Permanently visible on scroll, styled as a filled navy or red button (brand palette). This is the highest-priority conversion element on every HK page — consistent with the project's core value ("every page must have a clear, fast path to Book a Free Trial").

- **D-06: HKNav component lives at `components/hk/hk-nav.tsx`.** Mirrors `components/root/root-nav.tsx` architecture. HK-scoped components live in `components/hk/`; they do NOT go in `components/ui/` (Phase 3 D-11 precedent).

### Coaches page (Area C)

- **D-07: Phase 4 ships a fully populated HK coaches page (real photos + names + roles + short bios).** Data is hardcoded as a TypeScript array in the page component. Phase 6 swaps the hardcoded array for a Sanity GROQ query against `coach` documents — the data shape must be compatible: `{ name, role, bio, venueTag?, portrait }`.

- **D-08: Coaches are listed as one combined HK team.** No venue-level splitting (not "Wan Chai coaches" vs "Cyberport coaches"). Single grid/list under "Meet the ProGym Team." Simpler layout; simpler Phase 6 Sanity migration (no venue foreign key on coach type required at Phase 4).

- **D-09: Coach portrait photos follow the HUMAN-ACTION gate pattern.** Execution of the coaches page plan checks that portrait files exist under `public/photography/` (processed by the Phase 2 `pnpm photos:process` pipeline). If any are missing, executor pauses with a HUMAN-ACTION checkpoint listing exact missing filenames + the directive to run `pnpm photos:process` after adding source images. NO silhouettes, NO initials-only placeholders, NO stock images (carries forward Phase 3 D-10 posture).

### Booking form (carry-forward, not re-discussed)

- **D-10: `/book-a-trial/free-assessment/` extends Phase 3's `/api/contact` route handler.** Passes additional fields: `subject: "Free Assessment"`, `venue: "wan-chai" | "cyberport" | "unspecified"`. Form is `'use client'` with venue pre-fill from URL query param `?venue=wan-chai`. No new backend needed.

### Claude's Discretion

- **Blog stub approach** — User did not discuss. Planner decides: either a "coming soon" placeholder (like Phase 3's `/news/`) or 1–3 hardcoded stub post objects shaped to match the future Phase 6 GROQ schema `{ title, slug, excerpt, date, category, readTime, imageUrl }`. Recommended: 2 stub posts to prove the template shape.
- **Gymnastics pillar sub-page layout** — Planner decides the shared template. Each of the 8 sub-pages uses the same layout structure; only copy and imagery differ. Active state on the pillar sub-nav is URL-derived (`usePathname` — client sub-component).
- **HKFooter content** — Mirrors Phase 3's `RootFooter` pattern. Planner picks final column layout (venue addresses, quick links, WhatsApp CTA, social links). WhatsApp numbers are HUMAN-ACTION env vars: `NEXT_PUBLIC_WHATSAPP_HK` (Phase 3 D-02, carry-forward).
- **Map embed approach for location pages** — Research recommends Google Maps iframe embed (zero npm dependency, zero JS bundle, lazy-loaded). Planner implements this unless a static thumbnail is preferable for LCP.
- **HK metadata base and OG template** — Mirrors Phase 3 `root/layout.tsx` pattern. `metadataBase` resolves `VERCEL_PROJECT_PRODUCTION_URL → VERCEL_URL → localhost`. HK OG images use same navy-background brand template.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in strategy doc and decisions above.

### Strategy doc (canonical brief — single source of truth for copy + wireframes)

- `.planning/inputs/strategy.md` §PART 4 — Full HK homepage wireframe (12 sections), HK brand voice, venue facts
- `.planning/inputs/strategy.md` §PART 6B — HK-specific copy: headlines, CTAs, sub-page copy for all 22 pages
- `.planning/inputs/strategy.md` §PART 8 — Contact, WhatsApp, booking CTA specs; HK WhatsApp number
- `.planning/inputs/strategy.md` §PART 9 — JSON-LD schema requirements (LocalBusiness for Wan Chai + Cyberport, FAQPage, BreadcrumbList — Phase 7 owns the full suite; Phase 4 adds LocalBusiness inline on location pages as minimum)
- `.planning/inputs/strategy.md` §PART 12 — Gymnastics programme descriptions for 8 sub-pages
- `.planning/inputs/strategy.md` §PART 14.4 — Photography direction (real ProActiv photos, no AI imagery, no stock for HK)

### Project-level constraints + prior decisions

- `.planning/PROJECT.md` §Constraints — Stack locked; single Next.js app; no black-hat SEO
- `.planning/PROJECT.md` §Key Decisions — Typography pivot (Unbounded + Manrope + Baloo 2, OFL); surface-default white; quality model profile
- `.planning/REQUIREMENTS.md` §HK — HK-01 through HK-12 (12 requirements Phase 4 must satisfy)
- `.planning/ROADMAP.md` §Phase 4 — Goal, success criteria, rough shape

### Phase 2 + 3 carry-forward patterns (must NOT rebuild)

- `.planning/phases/02-design-system-component-gallery-media-pipeline/02-CONTEXT.md` §Decisions — D-06 VideoPlayer dynamic/ssr:false + Mux pattern; D-07 photo curation policy; media pipeline (`pnpm photos:process`)
- `.planning/phases/03-root-gateway-and-supporting-root-pages/03-CONTEXT.md` §Decisions — D-01/D-02 HUMAN-ACTION checkpoint pattern; D-04 honeypot-only spam; D-05 Resend sender; D-10 HUMAN-ACTION gate for portraits; D-11 market-scoped components NOT in `components/ui/`

### Research (already produced — no need to re-research)

- `.planning/phases/04-hong-kong-market/04-RESEARCH.md` — Full Phase 4 technical research: architectural responsibility map, library stack, routing architecture, map embed recommendation, booking form extension, blog stub schema

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `components/ui/` — All Phase 2 primitives: Button, Card, Accordion, Badge, Avatar, Separator, Sheet, Input, Label, Textarea, Section, ContainerEditorial, FAQItem, MarketCard, ProgrammeTile, TestimonialCard, StatStrip, LogoWall, VideoPlayer
- `components/root/root-nav.tsx` + `root-nav-mobile.tsx` — HKNav mirrors this architecture (Sheet drawer pattern, market CTA pattern)
- `components/root/root-footer.tsx` — HKFooter mirrors this pattern
- `app/api/contact/route.ts` — Phase 3 contact route handler; Phase 4 booking form extends it with `subject` + `venue` fields
- `public/photography/` — Curated AVIF/WebP/JPG photos from Phase 2 `pnpm photos:process`; 11 real HK ProActiv images already processed

### Established Patterns

- **HUMAN-ACTION gate** — Pause execution when user-provided assets (Mux IDs, photos, env vars) are required. List exact file paths / env-var names in the checkpoint. Matches Phase 2 fonts + Phase 3 leadership portrait pattern.
- **Market-scoped components** — HK components live in `components/hk/`, NOT `components/ui/`. Phase 3 D-11.
- **Static data → Phase 6 migration shape** — Hardcoded TS arrays must use the schema `{ title, slug, ... }` that Phase 6's GROQ query will return. Planner must document the expected shape in each plan.
- **metadataBase pattern** — `VERCEL_PROJECT_PRODUCTION_URL → VERCEL_URL → localhost` fallback chain, established in `app/root/layout.tsx`.
- **OG image template** — `opengraph-image.tsx` per route segment, static generation, navy background. Phase 3 set the pattern.

### Integration Points

- `app/hk/layout.tsx` — Replace Phase 1 stub with real HKNav + HKFooter + `metadata` base + `metadataBase`
- `middleware.ts` — Already routes `hk.*` → `app/hk/`; no changes needed
- `app/hk/page.tsx` — Replace Phase 1 stub with real HK homepage
- New directories under `app/hk/`: `wan-chai/`, `cyberport/`, `gymnastics/` (+ 8 sub-dirs), `holiday-camps/`, `birthday-parties/`, `school-partnerships/`, `competitions-events/`, `coaches/`, `blog/`, `faq/`, `book-a-trial/` (+ `free-assessment/`)
- New component directory: `components/hk/` (HKNav, HKFooter, HKNav mobile, VenueMap, GymnasticsPillarNav, BookingForm)

</code_context>

<specifics>
## Specific Ideas

- **"Book a Free Trial" as sticky nav button** — User confirmed this is the right conversion posture for all 22 HK pages. Every page must have a visible, direct path to the booking form — sticky nav button satisfies this without requiring each page template to include its own CTA section.
- **Gymnastics dropdown** — Strategy PART 12 specifies all 8 programme levels. Making them directly reachable from the nav (not buried inside the pillar page) matches the parent mental model: "I know my child is Intermediate level, I want to go directly there."
- **Hero video HUMAN-ACTION gate** — Consistent with the project philosophy: real assets only, never fake placeholders for content the client will provide. The poster image (already in `public/photography/`) renders a complete, high-quality hero while the checkpoint is outstanding.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within Phase 4 scope.

**Blog stub approach** — noted as Claude's Discretion above (planner decides between "coming soon" vs 1–3 stub posts). Not a new capability — within Phase 4 scope, just not discussed.

</deferred>

---

*Phase: 04-hong-kong-market*
*Context gathered: 2026-04-24*

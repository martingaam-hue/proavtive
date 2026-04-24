# Phase 5: Singapore Market — Context

**Gathered:** 2026-04-24
**Status:** Ready for planning
**Areas discussed:** Baloo 2 for Prodigy SG, SGNav structure, SG photography strategy, SG OG image brand color

<domain>
## Phase Boundary

Phase 5 ships the full SG market layer on Vercel preview URLs: ~15 pages assembled exclusively from Phase 2 primitives + Phase 3/4 patterns. No new design-system tokens. No new shadcn primitives. No new backend routes.

Pages in scope:
- SG homepage (13 sections per strategy PART 5)
- Location page: Prodigy @ Katong Point (`/katong-point/`) — "Singapore's only MultiBall wall"
- Weekly classes pillar (`/weekly-classes/`) + 3 zone sub-pages (Movement / Sports+MultiBall / Climbing)
- Prodigy camps pillar (`/prodigy-camps/`) + 3 camp-type sub-pages (Themed / Multi-Activity / Gymnastics)
- Supporting pages: `/birthday-parties/`, `/school-partnerships/` (with IFS callout), `/events/`, `/coaches/`, `/blog/`, `/faq/`, `/book-a-trial/`
- Shared SG layout: `app/sg/layout.tsx` with SGNav + SGFooter wrapping all ~15 pages

**Satisfies:** SG-01 through SG-11

**Out of scope for Phase 5:**
- CMS content models / Sanity-driven content (Phase 6)
- Dynamic `[slug]` routing (Phase 6 — all routes are static at Phase 5)
- Full JSON-LD suite, sitemap, robots.txt, llms.txt (Phase 7)
- HK market pages (Phase 4)
- Real Mux SG hero video playback (ID-dependent HUMAN-ACTION; poster fallback is sufficient)
- Named IFS sub-page (`/school-partnerships/international-french-school/`) — consolidated on the hub
- MultiBall interactive tech demo — strategy describes it as copy-first differentiator

</domain>

<decisions>
## Implementation Decisions

### A — Typography (resolves Phase 2 D-03 conflict)

- **D-01: Baloo 2 is activated on the SG tree.** Prodigy (SG) uses Baloo 2 as its display accent font, the same way Phase 4 activated it for ProGym (HK). This amends Phase 2 D-03: Baloo 2 is scoped to both sub-brand surfaces (ProGym HK and Prodigy SG). The root gateway remains Unbounded.
  - `app/sg/layout.tsx` activates `font-accent` (Baloo 2) the same way `app/hk/layout.tsx` does
  - Body text (Manrope) and display headings (Unbounded where needed) carry forward unchanged
  - PROJECT.md's "Baloo is specified for Prodigy contexts" is confirmed correct — Phase 2 D-03 wording was HK-specific, not a blanket SG exclusion

### B — SGNav structure

- **D-02: SGNav primary items:** Weekly Classes [dropdown] | Prodigy Camps [dropdown] | Katong Point | Coaches | FAQ | [Book a Free Trial button]
  - Six elements in the primary nav bar
  - Mobile: Sheet (slide-in drawer) pattern established by Phase 3 RootNav and Phase 4 HKNav

- **D-03: Weekly Classes nav item opens a dropdown showing the 3 zones.**
  - Implemented with shadcn `NavigationMenu` (already installed)
  - Dropdown items: Movement → `/weekly-classes/movement/`, Sports+MultiBall → `/weekly-classes/sports-multiball/`, Climbing → `/weekly-classes/climbing/`

- **D-04: Prodigy Camps nav item opens a dropdown showing the 3 camp types.**
  - Dropdown items: Themed Camps → `/prodigy-camps/themed/`, Multi-Activity → `/prodigy-camps/multi-activity/`, Gymnastics → `/prodigy-camps/gymnastics/`

- **D-05: "Book a Free Trial" is a sticky primary CTA button in the top-right of SGNav.** Permanently visible on scroll. Highest-priority conversion element on every SG page. Mobile Sheet includes a large Book CTA at the bottom.

- **D-06: SGNav component lives at `components/sg/sg-nav.tsx`.** Mirrors `components/hk/hk-nav.tsx` architecture. SG-scoped components live in `components/sg/` (Phase 3 D-11 carry-forward).

### C — SG photography

- **D-07: Phase 5 uses HUMAN-ACTION checkpoints for all SG photography.** User has confirmed real Katong Point photography will be provided at execute time. Execution pauses with explicit checkpoints listing missing filenames + the directive to run `pnpm photos:process` after adding source images.

  HUMAN-ACTION gates during Phase 5 execution:
  1. **SG hero poster** — 1 shot (Katong Point exterior or action); goes into hero section poster fallback and page OG image
  2. **Zone hero images ×3** — Movement zone / Sports+MultiBall zone / Climbing zone action shots
  3. **Coach portraits ×3** — Haikel, Mark, Coach King (per strategy PART 6C §8)
  4. **Birthday party setup shot** (optional — page still ships without it if unavailable)

  NO use of `sg-placeholder-climbing-unsplash-trinks.*` on any SG content page (Phase 2 D-07 carries forward: placeholder only permitted in `/_design` gallery).

- **D-08: SGFooter uses a single NAP (Katong Point) + WhatsApp + social links + cross-market link to HK.** No venue selector needed (one SG venue). WhatsApp number: `NEXT_PUBLIC_WHATSAPP_SG=+6598076827` (strategy PART 8.3) — HUMAN-ACTION env var.

### D — SG OG image brand color

- **D-09: SG Open Graph images use Prodigy green as the background color.** Visually distinguishes SG from HK (navy) at a glance in social shares and link previews. Reinforces Prodigy sub-brand identity.
  - `createSGOgImage()` utility mirrors `createHKOgImage()` but with Prodigy-green background
  - The specific green token is whichever Prodigy-green exists in the Phase 2 design system (planner verifies in `tailwind.config.ts`)

### Booking form (carry-forward, not re-discussed)

- **D-10: `/book-a-trial/` extends Phase 3's `/api/contact` route.** Passes `market: "sg"`. Venue field is pre-fixed to "katong-point" (single SG venue) — no venue selector dropdown needed on the SG booking form.

### IFS school partnership (carry-forward from research)

- **D-11: IFS is surfaced inline on the `/school-partnerships/` hub, not a separate dynamic route.** Strategy PART 12 Tier 2 #18 confirmed. Optional IFS logo if permission granted; text-only otherwise. Partnership CTA pre-fills `?subject=school-partnership`.

### Claude's Discretion

- **Blog stub count** — Recommend 1 "coming soon" stub to prove the responsive grid (per PART 5 §10). Planner decides.
- **`/events/` content scope** — Evergreen editorial page vs. placeholder-with-list-pattern. Recommend evergreen + future-Event-schema stub (Phase 6 CMS adds real dates).
- **Zone sub-page layout template** — Shared shell structure for Movement / Sports+MultiBall / Climbing (80% shared structure; differ in hero image, age band, apparatus list, safety note). Planner decides template.
- **Camp-type sub-page layout template** — Same: themed / multi-activity / gymnastics camps share structure, differ in details. Planner decides.
- **Map embed** — Google Maps iframe embed (zero bundle, zero API key). Same VenueMap pattern as Phase 4, different embed URL for Katong Point.
- **SG metadata base** — `app/sg/layout.tsx` declares `metadataBase: new URL("https://sg.proactivsports.com")`. NOT inherited from root.
- **SGFooter column layout** — Planner picks final column arrangement (single NAP, WhatsApp CTA, social links, cross-market HK link).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Strategy doc (single source of truth for copy + wireframes)

- `.planning/inputs/strategy.md` §PART 5 — Full SG homepage wireframe (13 sections), Prodigy brand identity, Katong Point hero
- `.planning/inputs/strategy.md` §PART 6C — SG-specific copy: headlines, CTAs, zone descriptions, coach bios (Haikel, Mark, Coach King), FAQ Q&A (10 items), all sub-page copy
- `.planning/inputs/strategy.md` §PART 8 — Contact, WhatsApp SG number (+6598076827), booking CTA specs
- `.planning/inputs/strategy.md` §PART 9 — JSON-LD schema requirements (LocalBusiness for Katong Point, FAQPage, SportsActivityLocation — Phase 7 owns the full suite; Phase 5 adds LocalBusiness + FAQPage inline as minimum)
- `.planning/inputs/strategy.md` §PART 12 — Weekly classes zone descriptions, Prodigy camp types, IFS school partnership context
- `.planning/inputs/strategy.md` §PART 14.4 — Photography direction (real Katong Point / Prodigy photos only)

### Project-level constraints + prior decisions

- `.planning/PROJECT.md` §Constraints — Stack locked; single Next.js app; no black-hat SEO
- `.planning/PROJECT.md` §Key Decisions — Typography: Baloo 2 for both ProGym + Prodigy sub-brands (confirmed by Phase 5 D-01)
- `.planning/REQUIREMENTS.md` §SG — SG-01 through SG-11 (11 requirements Phase 5 must satisfy)
- `.planning/ROADMAP.md` §Phase 5 — Goal, success criteria, rough shape

### Phase 2–4 carry-forward patterns (must NOT rebuild)

- `.planning/phases/02-design-system-component-gallery-media-pipeline/02-CONTEXT.md` §Decisions — D-06 VideoPlayer dynamic/ssr:false + Mux pattern; D-07 photo curation policy; D-03 typography (Baloo 2 — now confirmed for SG via D-01 amendment)
- `.planning/phases/03-root-gateway-and-supporting-root-pages/03-CONTEXT.md` §Decisions — D-01/D-02 HUMAN-ACTION checkpoint pattern; D-04 honeypot-only spam; D-05 Resend sender; D-10 portrait gate; D-11 market-scoped components
- `.planning/phases/04-hong-kong-market/04-CONTEXT.md` §Decisions — D-02–D-06 HKNav patterns (mirror for SG); D-07–D-09 coaches page patterns; D-10 booking form extension pattern

### Research (already produced — no need to re-research)

- `.planning/phases/05-singapore-market/05-RESEARCH.md` — Full Phase 5 technical research: architectural responsibility map, routing architecture, all 11 SG page patterns, booking form extension, zone+camp pillar architecture, MultiBall differentiator approach, IFS school partnership decision

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `components/ui/` — All Phase 2 primitives: Button, Card, Accordion, Badge, Avatar, Separator, Sheet, Input, Label, Textarea, Section, ContainerEditorial, FAQItem, MarketCard, ProgrammeTile, TestimonialCard, StatStrip, LogoWall, VideoPlayer
- `components/hk/` — Phase 4 HK components: HKNav, HKFooter, VenueMap, GymnasticsPillarNav, BookingForm — SGNav/SGFooter/SGPillarNavs mirror these; do NOT copy HK content, only the structural pattern
- `app/api/contact/route.ts` — Already accepts `market: "sg"` → routes to `CONTACT_INBOX_SG`; zero backend changes needed
- `public/photography/` — 11 real HK photos processed; 1 sg-placeholder (NOT for content use). Phase 5 adds real Katong Point photos via HUMAN-ACTION gates
- `app/hk/layout.tsx` — Pattern for `app/sg/layout.tsx`: Baloo 2 font activation, metadataBase, HKNav/HKFooter → SGNav/SGFooter

### Established Patterns

- **HUMAN-ACTION gate** — Pause execution when user-provided assets (photos, env vars, Mux IDs) are required. List exact file paths / env-var names in the checkpoint.
- **Market-scoped components** — SG components live in `components/sg/`, NOT `components/ui/`
- **Static data → Phase 6 migration shape** — Hardcoded TS arrays must use Phase 6-compatible schema shape (`{ title, slug, ... }`)
- **metadataBase pattern** — `VERCEL_PROJECT_PRODUCTION_URL → VERCEL_URL → localhost` fallback chain
- **Pillar nav pattern** — RSC pillar nav + client `ActiveNavLink` sub-component (established in Phase 4 GymnasticsPillarNav)
- **OG image template** — `opengraph-image.tsx` per route segment, static generation; SG uses Prodigy-green background (D-09)

### Integration Points

- `app/sg/layout.tsx` — Replace Phase 1 stub with real SGNav + SGFooter + `metadata` base + Baloo 2 + `metadataBase`
- `middleware.ts` — Already routes `sg.*` → `app/sg/`; no changes needed
- `app/sg/page.tsx` — Replace Phase 1 stub with real SG homepage (13 sections)
- New directories under `app/sg/`: `katong-point/`, `weekly-classes/` (+3 zone sub-dirs), `prodigy-camps/` (+3 camp sub-dirs), `birthday-parties/`, `school-partnerships/`, `events/`, `coaches/`, `blog/`, `faq/`, `book-a-trial/`
- New component directory: `components/sg/` (SGNav, SGFooter, SGNav mobile, VenueMap, ZonesPillarNav, CampsPillarNav, BookingForm SG)

</code_context>

<specifics>
## Specific Ideas

- **Prodigy brand identity as a separate product** — Not a locale variant of HK. Strategy PART 1 and PART 5 argue SG is distinct. The visual identity cues that reinforce this: Baloo 2 (confirmed), Prodigy green OG images (D-09), "Singapore's only MultiBall wall" as the headline differentiator on every Katong Point surface.
- **MultiBall as copy-first differentiator** — No new component needed. Surfaces via: (1) Badge-style "only in Singapore" trust line on SG homepage, (2) dedicated Sports+MultiBall zone page with real MultiBall zone photo (HUMAN-ACTION), (3) FAQ answer, (4) Katong Point location page headline.
- **Single SG venue simplifies booking form** — `/book-a-trial/` drops the venue selector (HK has two venues; SG has one). Venue is pre-fixed to "katong-point" in the form submission. Cleaner UX than asking a question with only one answer.

</specifics>

<deferred>
## Deferred Ideas

- **Real Mux SG hero video** — Mux playback ID is HUMAN-ACTION and ID-dependent. Poster image fallback (HUMAN-ACTION at execute) is sufficient for Phase 5 ship.
- **Named IFS sub-page** (`/school-partnerships/international-french-school/`) — Consolidated on the hub per Phase 5 strategy interpretation; Phase 6 CMS can split if the client wants it.
- **Multilingual SG content** (zh-SG, Mandarin, Bahasa) — v1.5 / POST-03.
- **Real camp-week Event schema** — Phase 6 (needs CMS-driven start/end dates, offer prices).
- **ProActiv internal booking platform integration** — Phase 10+ only if client moves off WhatsApp-led trial flow.
- **MultiBall interactive tech demo** — Phase 10+ R&D.

</deferred>

---

*Phase: 05-singapore-market*
*Context gathered: 2026-04-24*

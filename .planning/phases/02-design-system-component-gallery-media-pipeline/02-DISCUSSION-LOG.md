# Phase 2: Design system, component gallery, media pipeline — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in `02-CONTEXT.md` — this log preserves the alternatives considered.

**Date:** 2026-04-23
**Phase:** 02-design-system-component-gallery-media-pipeline
**Areas discussed:** Brand typography sourcing, Primitive library scope, Media pipeline, /_design/ gallery structure
**Mode:** standard (no `--auto`, no `--batch`, no `--power`)
**Advisor mode:** false (no USER-PROFILE.md present)

---

## Gray area selection (multi-select)

**Options presented:**
1. Brand typography sourcing — license status, file provisioning, fallback strategy
2. Primitive library scope — stock vs custom split, component boundary decisions
3. Media pipeline — Mux tier + playback policy, photo curation workflow, Sharp scope
4. /_design/ gallery structure — page shape + gating strategy

**User selected:** ALL FOUR.

---

## Area 1 — Brand typography sourcing

### Q1: License status

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, both licensed | Bloc Bold + Mont licensed for web self-hosting on proactivsports.com; Baloo already OFL free | ✓ |
| Licensed but files not yet | Licenses held, file delivery pending — Phase 2 starts but wave 1 blocks | |
| Not licensed — substitute with free fonts | Bloc Bold → Bebas Neue; Mont → Plus Jakarta Sans / Inter; Baloo stays | |
| Need to research options | Postpone; open question in CONTEXT.md; planner gates wave 1 on resolution | |

**User's choice:** Yes, both licensed.
**Captured as:** D-01

### Q2: File provisioning

| Option | Description | Selected |
|--------|-------------|----------|
| I'll drop files at assets/brand/fonts/ before Wave 1 | User provisions WOFF2 files; planner blocks wave 1 font-wiring task on file presence | ✓ |
| Files are in the 22 GB source folder | Fonts potentially in /Users/martin/Downloads/ProActive/; first task copies them | |
| Download from foundry portal during execution | Human-action checkpoint for download URLs / file drop | |
| Use Google Fonts CDN for Baloo only, self-host others | Baloo via next/font/google; Bloc Bold + Mont via next/font/local | |

**User's choice:** I'll drop files at assets/brand/fonts/ before Wave 1.
**Captured as:** D-02

### Q3: Baloo scope

| Option | Description | Selected |
|--------|-------------|----------|
| ProGym-only (HK locations) | Baloo on Wan Chai + Cyberport HK location pages + ProGym-branded content; Mont everywhere else | ✓ |
| ProGym + Prodigy (playful contexts) | Baloo wherever ProGym or Prodigy branding is primary (HK location pages, SG market, camp-forward root sections) | |
| Accent font only (never body) | Never body copy — only decorative headlines, pull-quotes, section labels in playful contexts | |
| Skip Baloo in Phase 2, add later | Only self-host Bloc Bold + Mont; defer Baloo to Phase 4 | |

**User's choice:** ProGym-only (HK locations).
**Captured as:** D-03

---

## Area 2 — Primitive library scope

### Q4: Custom vs stock split

| Option | Description | Selected |
|--------|-------------|----------|
| Stock where possible, custom only for brand-specific | Button/Card/Accordion/Badge/Avatar/Separator stock; MarketCard/ProgrammeTile/TestimonialCard/StatStrip/LogoWall custom; Section/ContainerEditorial thin wrappers | ✓ |
| All custom, built on Radix primitives | Skip shadcn CLI; compose all 10 components on Radix directly | |
| Stock extended with brand variants | Card has marketcard/programmetile/testimonialcard variants via cva + Tailwind in one component | |

**User's choice:** Stock where possible, custom only for brand-specific.
**Captured as:** D-04

### Q5: "Done" bar

| Option | Description | Selected |
|--------|-------------|----------|
| One real-photo example per primitive + a11y pass | Each primitive renders once in /_design/ with a real ProActiv photo + keyboard nav + WCAG AA | ✓ |
| Multiple variants + interaction states | Default/hover/focus/disabled/loading + 2–3 content variants per primitive | |
| Full Storybook-style documentation | Each primitive on its own sub-page with all variants, prop tables, code snippets | |

**User's choice:** One real-photo example per primitive + a11y pass.
**Captured as:** D-05

---

## Area 3 — Media pipeline

### Q6: Mux tier + playback policy

| Option | Description | Selected |
|--------|-------------|----------|
| Free tier + public playback IDs | Free Mux account, public playback IDs, Phase 2 stays under limits | |
| Paid Mux plan from day one | Paid plan from Phase 2; signed playback IDs available | |
| Defer all video to Phase 10 | Phase 2 ships VideoPlayer primitive shell with placeholder URL; real Mux wiring in Phase 10 | ✓ |
| Already have Mux set up | Martin shares playback IDs during execution as a light human-action checkpoint | |

**User's choice:** Defer all video to Phase 10.
**Captured as:** D-06. **ROADMAP SC #3 amended** — "Mux plays camp clip" becomes "Mux primitive renders on desktop + mobile without hydration errors" for Phase 2; real clip playback rejoins scope in Phase 10.

### Q7: Photo curation workflow

| Option | Description | Selected |
|--------|-------------|----------|
| You curate 10–15 upfront, before Phase 2 starts | User drops selected heroes into .planning/inputs/curated-hero-photos/; Sharp processes only those | ✓ |
| Curate as a Phase 2 human-action task | Mid-wave blocking curation task; Claude preps candidate gallery; user picks in session | |
| Curate a minimum viable set (3–5) + expand in Phase 3+ | Phase 2 ships with just enough photos to render the gallery; Phase 3+ adds market-specific photos | |
| Sharp script processes all 290 files | Rejected as over-engineered; 22 GB processing is slow and most files aren't needed | |

**User's choice:** You curate 10–15 upfront, before Phase 2 starts.
**Captured as:** D-07

---

## Area 4 — /_design/ gallery structure

### Q8: Page shape

| Option | Description | Selected |
|--------|-------------|----------|
| Single scrollable page with anchor nav | One /_design/ page, sections per primitive, sticky sidebar anchor links | ✓ |
| Sidebar nav + per-primitive sub-pages | /_design/ shell + /_design/button, /_design/marketcard, etc.; mimics Storybook | |
| Category-grouped route pages | /_design/primitives/, /_design/patterns/, /_design/media/ | |

**User's choice:** Single scrollable page with anchor nav.
**Captured as:** D-08

### Q9: Gating strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Env check + notFound() in route | `process.env.VERCEL_ENV === 'production'` triggers notFound(); combined with X-Robots-Tag + Vercel Deployment Protection | ✓ |
| Middleware route block | Add /_design/ to middleware matcher 404 rule; touches middleware.ts again | |
| Rely on Vercel Deployment Protection only | No code changes; least defensive | |

**User's choice:** Env check + notFound() in route.
**Captured as:** D-09

---

## Closure

### Q10: More gray areas or ready for context?

| Option | Description | Selected |
|--------|-------------|----------|
| I'm ready for context | Write 02-CONTEXT.md; proceed to /gsd-ui-phase 2 | ✓ |
| Explore more gray areas | Surface dark mode, radius/shadow tokens, icon library, animations, photo credit display, placeholder fallback | |

**User's choice:** I'm ready for context.

---

## Claude's Discretion

Captured in `02-CONTEXT.md` under `### Claude's Discretion`:

- Font weight provisioning (default 3 weights per family)
- `next/font/local` options (display: swap, adjustFontFallback: Arial, preload: true, variable CSS vars)
- HSL triplet conversion for shadcn `:root` overrides (from 7 brand hex values)
- Spacing + radius + shadow tokens (section spacing scale + shadcn defaults)
- Sharp preprocessing script structure (Node 22 ES module, AVIF 70 / WebP 80 / JPG 85 quality, responsive widths)
- Mux placeholder URL choice
- Dark mode explicitly deferred (no `.dark {}` in Phase 2)
- Icon library (lucide-react, already installed)
- Animation tokens (tw-animate-css utilities, sparingly)
- RTL + jsdom component tests deferred (planner decides — not gated on user input)

---

## Deferred Ideas

Captured in `02-CONTEXT.md` `<deferred>`:

- Real Mux video integration → Phase 10 (per D-06)
- Dark mode tokens → post-Phase-2 follow-up phase if ever required
- Variant expansion / Storybook-style gallery → Phase 3+ emergent needs, or `/gsd-ui-phase 2.1`
- Photography credit / caption display → Phase 3+ page-level concern
- Placeholder image fallback strategy → Phase 3+ page context
- 22 GB raw photo processing (all files) → rejected as over-engineered; per-market curation in Phase 3+/4+/5+
- RTL + jsdom component tests → planner decides; possibly Phase 7
- Icon library expansion beyond Lucide → Phase 3+ per-page custom SVGs

# Phase 2: Design system, component gallery, media pipeline — Context

**Gathered:** 2026-04-23
**Status:** Ready for UI-SPEC + planning
**Prior phase carry-forward:** Phase 1 (middleware + Studio + shadcn init) complete; 17 decisions honoured and encoded in tests

<domain>
## Phase Boundary

Phase 2 delivers the visual and media foundation that every page built after this will assemble from — not invent. Concretely:

- **Brand tokens** — Tailwind v4 `@theme` layer mapping ProActiv palette (`#0f206c` navy / `#ec1c24` red / `#0f9733` green / `#0fa0e2` sky / `#fac049` yellow / `#fff3dd` cream / `#ffffff` white) and typography families (Bloc Bold, Mont, Baloo) to CSS variables. shadcn's neutral semantic overlay (installed in Plan 01-02) gets brand-overridden via `:root` HSL triplets.
- **Self-hosted typography** — Bloc Bold + Mont + Baloo wired via `next/font/local`, zero-CLS (verified by Lighthouse on `/_design/`), `adjustFontFallback: 'Arial'`, `display: swap`, preloaded.
- **UI primitive library (~10 components)** — Button, Card, Accordion (→ FAQItem), Badge, Avatar, Separator are stock shadcn adds. MarketCard, ProgrammeTile, TestimonialCard, StatStrip, LogoWall are custom ProActiv components. Section + ContainerEditorial are thin typed wrappers (not Tailwind utilities alone).
- **Image pipeline** — `next/image` with `formats: ['image/avif', 'image/webp']` for request-time serving. Local Sharp preprocessing script (`scripts/process-photos.mjs`) for one-time bulk AVIF + WebP generation on curated hero-tier photos only. Raw 22 GB source stays local.
- **Video primitive shell** — `<VideoPlayer>` component wrapping `@mux/mux-player-react` with `dynamic({ ssr: false })`. Phase 2 ships the primitive only; actual Mux wiring + real playback IDs are DEFERRED to Phase 10. See D-06 below.
- **`/_design/` gallery** — Single scrollable page with sticky sidebar anchor nav. Each primitive renders once with real ProActiv photography. Env-gated from production via `notFound()` in the route component.

**NOT in scope (per ROADMAP SC literal language, modified by D-06):**
- Real Mux video integration (→ Phase 10)
- Variant matrices / Storybook-style documentation (Phase 3+ discovers variants in context)
- Dark mode tokens (deferred — see Claude's Discretion)
- Phase-specific page assembly (that's Phase 3/4/5)

</domain>

<decisions>
## Implementation Decisions

### Brand typography sourcing (Area 1)

- **D-01 — AMENDED 2026-04-23.** Brand typography uses three Google Fonts (all SIL OFL, free for commercial use) delivered via `next/font/google`: **Unbounded** (display / headline), **Manrope** (body / UI), **Baloo 2** (ProGym accent). Replaces the original Bloc Bold (Zetafonts, commercial) + Mont (Fontfabric, commercial) + Baloo pairing. Rationale: user pivoted to an accessible/free stack; the Unbounded + Manrope pairing preserves the intent of D-01 (confident display + clean geometric body) without foundry-license traceability risk. Existing Bloc Bold / Mont commercial licenses that Martin holds are preserved for a future re-introduction if brand direction demands it, but are NOT required to ship v1.0.
- **D-02 — OBSOLETE as of 2026-04-23.** Original decision required human provisioning of foundry-licensed WOFF2 files at `assets/brand/fonts/` before `/gsd-execute-phase 2`. Superseded by the D-01 amendment — `next/font/google` self-hosts the Google Fonts at build time (Vercel-edge preloading, zero third-party request, still zero-CLS via `display: 'swap'` + automatic adjustFontFallback). No HUMAN-ACTION checkpoint needed. The `assets/brand/fonts/` directory is removed. Any downstream plan that referenced a "D-02 drop zone" file-existence gate has been revised (see plan 02-02).
- **D-03** Baloo 2 is scoped to **ProGym contexts only** — Wan Chai + Cyberport HK location pages, and any ProGym-branded surfaces elsewhere. Manrope is the body font everywhere else (root gateway, HK non-ProGym, SG, legal pages). Unbounded is the display/headline font across the entire ecosystem. The design token system exposes `--font-display` (Unbounded), `--font-sans` (Manrope), `--font-accent` (Baloo 2). Components apply `--font-accent` only on ProGym-scoped pages; global default is `--font-sans`.

### Primitive library scope (Area 2)

- **D-04** Component split — **stock shadcn where possible, custom only for brand-specific**:
  - **Stock shadcn adds** (via `pnpm dlx shadcn@latest add ...`): Card, Accordion (→ FAQItem composition), Badge, Avatar, Separator. Button is already installed (Plan 01-02).
  - **Custom ProActiv components** (composed on shadcn/Radix primitives + brand tokens): MarketCard, ProgrammeTile, TestimonialCard, StatStrip, LogoWall. Each lives at `components/ui/<name>.tsx` and uses brand tokens (not raw hex) so Phase 3+ inherits automatically.
  - **Thin typed wrappers**: Section (semantic `<section>` with configurable spacing via `--spacing-section-{sm,md,lg}` tokens) and ContainerEditorial (editorial-asymmetric content container — width + horizontal padding + max-width variants). Both typed React components, NOT just Tailwind utility class collections. Phase 3+ page authors use `<Section size="md">` instead of memorizing spacing classes.
- **D-05** "Done" bar for Phase 2 primitives (aligned with ROADMAP SC #1 literal language):
  - Each primitive renders once in `/_design/` with **one real ProActiv photograph** as content (from the D-07 curated set)
  - Passes keyboard navigation (Tab, Enter, Escape where applicable, no keyboard traps)
  - Passes WCAG AA contrast (4.5:1 for normal text, 3:1 for large text / UI elements) — verified via Lighthouse accessibility audit on `/_design/`
  - No variant matrices, no state galleries, no Storybook-style docs. Phase 3+ discovers variant needs from real page requirements and adds them then.

### Media pipeline (Area 3)

- **D-06** **Video DEFERRED to Phase 10.** Phase 2 builds the `<VideoPlayer>` primitive shell (client component, `dynamic + ssr: false`, MuxPlayer import, typed props for `playbackId`, `title`, `poster`, `autoPlay`) using a **placeholder clip URL** (`https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe.m3u8` — Mux public demo, or equivalent). No real Mux account signup, no real playback IDs, no Mux dashboard interaction. Phase 10 (DNS cutover + launch) owns: Mux account provisioning, real playback IDs, signed vs public policy decision, actual camp clip uploads. **ROADMAP SC #3 is amended** for Phase 2: "Mux primitive shell renders on desktop + mobile without hydration errors" (not "plays a real camp clip"). Real clip playback re-enters the scope in Phase 10.
- **D-07** Photo curation is **upfront by Martin, before Phase 2 execute**. Workflow:
  1. Before `/gsd-execute-phase 2`, Martin reviews `/Users/martin/Downloads/ProActive/01 - PHOTOS to use/` (and related folders per MEDIA-INVENTORY.md).
  2. Selects **10–15 hero-tier images** covering: 1 root gateway hero, 2–3 HK venues (Wan Chai + Cyberport + optional), 1–2 SG Prodigy/Katong, 3–5 programme/session shots (coaching in action, different age groups), 1–2 testimonial/parent scenes.
  3. Drops selected files (original resolution, any format Sharp accepts — JPG/PNG/HEIC/TIFF) into `.planning/inputs/curated-hero-photos/`. This folder is gitignored — raw originals never enter the repo.
  4. Runs (or Phase 2 plan includes a task to run) `pnpm photos:process` which invokes `scripts/process-photos.mjs`. Output: `public/photography/<slug>.avif` + `.webp` + `.jpg` fallback at 1920px + responsive breakpoints (640, 1024, 1920).
  5. Processed output in `public/photography/` IS committed. Raw source in `.planning/inputs/curated-hero-photos/` stays uncommitted.

### `/_design/` gallery structure (Area 4)

- **D-08** **Single scrollable page** with sticky sidebar anchor nav. Route: `app/_design/page.tsx` (placed under the root tree so it doesn't collide with HK/SG market trees). Sections ordered: Foundation (colors, typography, spacing) → Primitives (Button, Card, Badge, etc.) → Patterns (MarketCard, ProgrammeTile, TestimonialCard, StatStrip, LogoWall) → Media (Image, VideoPlayer shell). Sticky left sidebar with anchor links `#colors`, `#typography`, `#button`, `#marketcard`, etc. Footer documents the "done bar" (D-05) for anyone auditing.
- **D-09** **Gating: env check + notFound() in route**. `app/_design/page.tsx` begins with `if (process.env.VERCEL_ENV === 'production') notFound();`. Combined with:
  - Phase 0 D-15 `X-Robots-Tag: noindex, nofollow` on all non-production responses (triple-indexed defence)
  - Vercel Deployment Protection on all preview URLs (fourth layer)
  No middleware changes needed — `/_design` is not a market-specific route. The middleware matcher (Plan 01-01) already excludes underscore-prefixed paths via the default pattern, so `/_design` passes through unchanged.

### Claude's Discretion

Implementation details the planner decides without further user input:

- **Font weight provisioning** — Default to 3 weights per family (Regular 400, Medium 500, Bold 700). Unbounded may additionally include 800 ExtraBold if the display role wants extra punch. Plans pass the exact `weight: [...]` array to `next/font/google`.
- **`next/font/google` options** — `subsets: ['latin']`, `display: 'swap'`, `weight: [...]`, `variable: '--font-unbounded|--font-manrope|--font-baloo'`. `next/font/google` handles fallback metric-matching automatically — no manual `adjustFontFallback` / `fallback` chain needed.
- **HSL triplet conversion** — Convert the 7 brand hex values to shadcn's HSL channel format (space-separated, no `hsl()` wrapper) for `:root` overrides. Example: `--primary: 228 77% 24%` (navy). Encode the semantic → brand mapping per `02-RESEARCH.md` Topic 1 guidance.
- **Spacing + radius + shadow tokens** — Adopt `--spacing-section-{sm,md,lg}` = 4rem / 6rem / 8rem per 02-RESEARCH.md. Keep shadcn radius default (`--radius: 0.5rem`) unless it visually conflicts with brand (review after first primitive renders). Shadow tokens: default shadcn scale — defer refinement to Phase 3+ page needs.
- **Sharp preprocessing script** (`scripts/process-photos.mjs`) — Node.js 22 ES module, reads from `.planning/inputs/curated-hero-photos/`, writes to `public/photography/`, quality: AVIF 70 + WebP 80 + JPG 85, widths: [640, 1024, 1920], fail fast on any image error. Logs a summary (N files processed, total size reduction) at the end. Added to `package.json` scripts as `photos:process`.
- **Mux placeholder URL** — Use Mux's public demo playback ID or a self-hosted `<video>` fallback with a still poster. The planner picks what's most stable; does not need Martin input.
- **Dark mode tokens** — Do NOT define `.dark { ... }` in Phase 2. Token system is light-mode only. If dark mode becomes a requirement later (Phase 7 SEO / UX audit), it's a targeted follow-up phase.
- **Icon library** — `lucide-react` is already installed (Phase 1 dep). Phase 2 uses lucide icons throughout primitives. No additional icon library.
- **Animation tokens** — `tw-animate-css` is installed (Phase 1 Plan 01-02 transitive). Phase 2 uses its utilities sparingly for hover/focus transitions on interactive primitives (Button, Card hover, etc.). No custom keyframe library in Phase 2.

### Folded Todos

None — no matched todos from `gsd-tools todo match-phase 02`.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents (gsd-ui-researcher, gsd-planner, gsd-executor) MUST read these before producing or executing plans.**

### Strategy doc (canonical brief)

- `.planning/inputs/strategy.md` §PART 14.1 — Colour palette and role mapping
- `.planning/inputs/strategy.md` §PART 14.2 — Typography system and hierarchy
- `.planning/inputs/strategy.md` §PART 14.3 — Visual direction (anti-"AI SaaS" aesthetic) — **critical for ROADMAP SC #5**
- `.planning/inputs/strategy.md` §PART 14.4 — Photography direction (editorial, real, confident)
- `.planning/inputs/strategy.md` §PART 14.5 — Video direction (8–12s silent loops; informs the VideoPlayer primitive API even though Mux integration defers to Phase 10)
- `.planning/inputs/strategy.md` §PART 14.6 — Section spacing rhythm (informs `--spacing-section-{sm,md,lg}` scale)
- `.planning/inputs/strategy.md` §PART 15.4 Weeks 2–4 — Phase 2 timeline and deliverable expectations

### Project-level constraints + decisions

- `.planning/PROJECT.md` — brand palette (exact hex values), typography stack, performance budget (LCP < 2.5s, INP < 200ms, CLS < 0.1, Lighthouse 95+), anti-"AI SaaS" non-negotiable
- `.planning/REQUIREMENTS.md` — DS-01..DS-06 line items (all 6 assigned to Phase 2)
- `.planning/inputs/MEDIA-INVENTORY.md` — source photo/video folder structure at `/Users/martin/Downloads/ProActive/`

### Phase 1 carry-forward (already satisfied — build ON these, don't rebuild)

- `.planning/phases/01-next-js-foundation-subdomain-middleware-sanity-studio-scaffold-vercel-previews/01-CONTEXT.md` — decisions D-01..D-17 are all locked; Phase 2 respects them (Host-authoritative middleware, `/studio` pass-through matcher)
- `.planning/phases/01-next-js-foundation-subdomain-middleware-sanity-studio-scaffold-vercel-previews/01-02-SUMMARY.md` — shadcn CLI initialized with `radix-nova/neutral/cssVariables=true/rsc=true`; components.json already exists; `lib/utils.ts` exports `cn()`; do NOT re-init
- `.planning/phases/01-next-js-foundation-subdomain-middleware-sanity-studio-scaffold-vercel-previews/01-03-SUMMARY.md` — Next.js build is on Turbopack; `transpilePackages: ['sanity', ...]` already configured; any new package that triggers webpack interop issues should add to transpilePackages rather than downgrade
- `app/globals.css` current state — has `@theme inline { ... }` shadcn CSS variable aliases and `:root { ... }` neutral-base overrides; Phase 2 EXTENDS this (adds `@theme { ... --color-brand-* }` at top and OVERRIDES the `:root` HSL triplets with brand values). Do NOT wipe it.

### External docs (fetch at research/execute time — do not embed content now)

- Tailwind CSS v4 `@theme`: https://tailwindcss.com/docs/theme
- Tailwind CSS v4 adding custom styles: https://tailwindcss.com/docs/adding-custom-styles
- Next.js Font module (`localFont`, `adjustFontFallback`): https://nextjs.org/docs/app/api-reference/components/font
- Next.js Image component (AVIF/WebP formats): https://nextjs.org/docs/app/api-reference/components/image
- Next.js Image optimization best practices: https://nextjs.org/docs/app/building-your-application/optimizing/images
- Vercel Image Optimization (CDN caching + plan limits): https://vercel.com/docs/image-optimization
- shadcn/ui component registry (for `pnpm dlx shadcn@latest add` adds): https://ui.shadcn.com/docs/components
- Sharp API reference: https://sharp.pixelplumbing.com/
- `@mux/mux-player-react` README: https://www.npmjs.com/package/@mux/mux-player-react — verify at execute time (Phase 2 ships only the primitive shell per D-06)

### Phase 2 research (already on disk)

- `.planning/phases/02-design-system-component-gallery-media-pipeline/02-RESEARCH.md` — 40kB implementation-ready guidance from the pipelined background agent (7 topics + 7 pitfalls + 5 open questions, all now answered by this CONTEXT.md)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets (from Phase 1)

- `components/ui/button.tsx` — shadcn Button primitive with `buttonVariants` (radix-nova style). Phase 2 uses it as the template for how custom primitives should be structured (CVA variants, Slot for polymorphism).
- `lib/utils.ts` — exports `cn()` helper for className merging. Every new primitive uses this.
- `components.json` — shadcn config: `style: "radix-nova"`, `baseColor: "neutral"`, `cssVariables: true`, `rsc: true`, `tsx: true`, aliases `@/components`, `@/lib/utils`. Registries are empty — supply-chain safety preserved.
- `app/globals.css` — Tailwind v4 + shadcn neutral variable layer. Phase 2 overlays `@theme { --color-brand-* }` and overrides `:root { --primary, --foreground, ... }` to brand HSL.
- `app/root/page.tsx` / `app/hk/page.tsx` / `app/sg/page.tsx` — three market tree entry points. Phase 3+ replaces the Phase 1 placeholders with real pages using Phase 2 primitives.

### Established Patterns (from Phase 1)

- **Turbopack for build** (Plan 01-03 deviation #3). Any Phase 2 dependency that triggers webpack ESM/CJS interop warnings should either add to `transpilePackages` in `next.config.ts` or get diagnosed at the package level.
- **Rule 1 deviation documentation** — when a library's real API differs from a plan's literal instruction (e.g., `presentationTool({})` vs v5 type-required `previewUrl`), document in commit body + SUMMARY as "Rule 1 library-contract correction" and preserve user-facing behavior where possible.
- **Client/server boundary in RSC App Router** — `'use client'` lives at the top of modules that are client-bundle entries (like `sanity.config.ts`). Server Components (like `app/studio/[[...tool]]/page.tsx`) re-export `metadata`/`viewport` and render client components via their own internal `'use client'` boundary. Phase 2 applies the same pattern to `<VideoPlayer>` (must be `'use client'`) and to any primitive using hooks.
- **Vitest for pure-TS + middleware tests only** (Plan 01-04). Phase 2 may want to extend this to RTL component tests (deferred from Plan 01-04 per Phase 1 D-15) — see Claude's Discretion below; no user input needed on whether to add RTL, planner decides based on phase scope.

### Integration Points

- `app/globals.css` — brand token layer lands here (first) BEFORE shadcn `@theme inline` (already present)
- `app/fonts.ts` (new in Phase 2) — `next/font/google` declarations for Unbounded + Manrope + Baloo 2, exports their `.variable` CSS var names
- `app/layout.tsx` — root HTML layout; imports `unbounded` + `manrope` from `./fonts` and attaches their `.variable` className to `<html>` (Baloo NOT attached at root per D-03). Per-market layouts (`app/hk/layout.tsx` etc.) may need tweaks to enable Baloo in ProGym contexts per D-03.
- `app/_design/page.tsx` (new in Phase 2) — the gallery route
- `public/photography/` (new in Phase 2) — output of `scripts/process-photos.mjs`; committed to git
- `scripts/process-photos.mjs` (new in Phase 2) — local-only Sharp preprocessing script
- `components/ui/` (extends Phase 1's Button) — where all new primitives land
- `components/ui/video-player.tsx` — Mux player shell with placeholder URL (D-06); phase 10 replaces placeholder with real playback ID

</code_context>

<specifics>
## Specific Ideas

- **Raw photo source**: `/Users/martin/Downloads/ProActive/01 - PHOTOS to use/` and related folders per MEDIA-INVENTORY.md. Martin curates 10–15 hero-tier images into `.planning/inputs/curated-hero-photos/` before Phase 2 execute.
- **Brand palette (from PROJECT.md, authoritative)**: navy `#0f206c`, white `#ffffff`, red `#ec1c24`, green `#0f9733`, sky `#0fa0e2`, yellow `#fac049`, cream `#fff3dd`.
- **Typography stack (D-01 amended 2026-04-23)**: Unbounded (display), Manrope (body), Baloo 2 (ProGym-scoped accent per D-03) — all Google Fonts (OFL), delivered via `next/font/google`.
- **Anti-aesthetic reference**: strategy PART 14.3 "editorial asymmetry, real photography, confident type" — distinct from the "AI-generated SaaS" aesthetic (symmetric grids, stock photos, Inter + purple gradients). Required by ROADMAP SC #5.
- **Section spacing rhythm**: strategy PART 14.6 — 64px / 96px / 128px between content blocks on hero/pillar pages. Exposed as `--spacing-section-{sm,md,lg}` tokens.
- **WCAG AA trap**: yellow `#fac049` fails AA contrast on white (2.2:1). Never use as text color on light surfaces. Reserve for fills + yellow-on-dark-navy accents.
- **Mux player placeholder**: Mux's public demo stream or equivalent. The primitive shell must work end-to-end (render, ssr:false, hydrate cleanly) even though real content waits for Phase 10.

</specifics>

<deferred>
## Deferred Ideas

Items mentioned in scope but intentionally pushed to later phases — preserved so future planners pick them up.

- **Real Mux video integration** → Phase 10. Per D-06: Phase 2 ships only the VideoPlayer primitive shell with a placeholder URL. Phase 10 adds: Mux account provisioning, public vs signed playback policy decision, real camp clip uploads, playback ID sourcing, caption tracks. The ROADMAP SC #3 is effectively split: primitive render (Phase 2) + real playback (Phase 10).
- **Dark mode tokens** — no `.dark { ... }` layer in Phase 2. If dark-mode becomes a requirement from analytics or SEO audits (Phase 7+), add it as a targeted follow-up phase with per-token contrast verification.
- **Variant expansion / Storybook-style gallery** — Phase 2 ships "one example per primitive" (D-05). Variant matrices and state galleries emerge from Phase 3+ page needs; if the surface grows, `/gsd-ui-phase 2.1` can be used to expand `/_design/` into per-primitive sub-pages.
- **Photography credit / caption display** — if strategy requires photographer credits on hero images, that's a Phase 3+ page-level concern; tokens only here.
- **Placeholder image fallback strategy** — if a photo slot is empty in a component, what shows? Solid-color block with brand token, Sanity's default placeholder, or skeleton loader? Phase 3+ page context decides; Phase 2 components accept `src` and fail visibly.
- **22 GB raw photo processing (ALL files)** — rejected as over-engineered (D-07). Only curated 10–15 images process in Phase 2. The rest of the 290-file source folder is Phase 3+/Phase 4+/Phase 5+ per-market curation work.
- **RTL + jsdom component tests** — deferred from Plan 01-04 (Phase 1 D-15 scope). Planner decides whether to add now (if Phase 2 primitives warrant unit tests beyond Lighthouse accessibility audit) or defer to Phase 7 (SEO/a11y deep pass). Not gated on user input.
- **Icon library expansion** — `lucide-react` covers Phase 2. If a primitive needs a sport-specific icon (gymnast silhouette, beam, etc.) that's outside Lucide, it's a Phase 3+ page concern — import custom SVGs inline.

### Reviewed Todos (not folded)

None — no pending todos matched Phase 2 at the time of context gathering.

</deferred>

---

*Phase: 02-design-system-component-gallery-media-pipeline*
*Context gathered: 2026-04-23 via /gsd-discuss-phase 2 (4 areas, 9 locked decisions, 8 Claude's-Discretion items, 6 deferred items)*

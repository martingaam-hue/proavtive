---
phase: 02
plan: 04
subsystem: design-system / custom primitives
tags: [custom-primitives, cva, editorial-asymmetry, wcag, phase-2, token-only]

# Dependency graph
requires:
  - phase: 02-design-system-component-gallery-media-pipeline
    provides: "brand token layer (Plan 02-01) — bg-brand-*, py-section-*, font-display/sans/accent; typography wiring (Plan 02-02) — Unbounded + Manrope via next/font/google; shadcn primitives (Plan 02-03) — Card, Accordion, Badge, Avatar, Separator, Button"
provides:
  - Section primitive (semantic layout wrapper with as/size/bg variants)
  - ContainerEditorial primitive (width-constrained wrapper — narrow/default/wide)
  - FAQItem primitive (composition wrapping Plan 02-03 Accordion)
  - MarketCard primitive (dual-market entry card for root gateway)
  - ProgrammeTile primitive (programme listing card with age Badge)
  - TestimonialCard primitive (CVA default|pullquote variants, figure/blockquote/cite)
  - StatStrip primitive (horizontal KPI strip with Separator between stats)
  - LogoWall primitive (monochrome grid/row display with grayscale hover reveal)
affects: [02-06 gallery, 03-root-gateway, 04-hk, 05-sg]

# Tech tracking
tech-stack:
  added: []  # No new package.json dependencies — composes existing Phase 1/2 deps
  patterns:
    - "CVA + cn() + data-slot + typed interface pattern for every custom primitive (consistency with Phase 1 Button)"
    - "Token-only class rule enforced — no raw hex anywhere in components/ui/*.tsx"
    - "Inline Tailwind utilities for type-scale roles (font-display text-xl font-semibold lg:text-2xl for h3 etc.) rather than custom @theme --text-* tokens — simpler, no additional globals.css edits"
    - "Semantic HTML preserved: <figure>/<blockquote>/<cite> on TestimonialCard, <section> on Section (with as polymorphism), single <Link> wrap on MarketCard and ProgrammeTile (no nested <a>)"
    - "ReadonlyArray<T> for prop arrays (StatStrip stats, LogoWall logos) — signals immutability to consumers"

key-files:
  created:
    - components/ui/section.tsx
    - components/ui/container-editorial.tsx
    - components/ui/faq-item.tsx
    - components/ui/market-card.tsx
    - components/ui/programme-tile.tsx
    - components/ui/testimonial-card.tsx
    - components/ui/stat-strip.tsx
    - components/ui/logo-wall.tsx

key-decisions:
  - "Type-scale encoding: inline Tailwind utilities (font-display text-xl font-semibold lg:text-2xl) instead of custom @theme --text-* tokens. Simpler, no additional globals.css edits, works today. UI-SPEC §1.6 role→utility mapping table in the plan was followed verbatim."
  - "MarketCardProps extends Omit<React.ComponentProps<typeof Link>, 'href'> — preserves all Link passthroughs (prefetch, scroll, replace, etc.) while typing href explicitly so Next can still assist with route autocomplete in consumers."
  - "TestimonialCard uses CVA for variant styling (default|pullquote) — only primitive in this batch with true variant switching; other primitives encode variants via prop-mapped Tailwind classes (sizeMap/bgMap/widthMap)."
  - "No `size='touch'` dependency — marketing consumers compose Button size='touch' at the page level when embedding primitives in CTAs. Primitives themselves are size-neutral (per Plan 02-03 Button contract)."

requirements-completed: [DS-03, DS-06]

# Metrics
duration: ~10min
completed: 2026-04-23
tasks_completed: 3
files_created: 8
files_modified: 0
---

# Phase 02 Plan 04: Custom Primitives Summary

**Eight custom ProActiv primitives (Section, ContainerEditorial, FAQItem, MarketCard, ProgrammeTile, TestimonialCard, StatStrip, LogoWall) landed at `components/ui/*.tsx`, composing on Plan 02-03 shadcn primitives + Plan 02-01 brand tokens + Plan 02-02 typography. All 8 follow the Phase 1 Button template (CVA where needed, `cn()` from `@/lib/utils`, `data-slot` attribute, typed `<Name>Props` interface). Zero raw hex — token-only. DS-03 custom-primitive half + DS-06 editorial-asymmetry groundwork satisfied. `pnpm typecheck` + `pnpm build` both pass.**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-04-23T15:27:01Z
- **Completed:** 2026-04-23T15:36:04Z
- **Tasks:** 3 (autonomous, no checkpoints)
- **Files created:** 8
- **Files modified:** 0

## Files Created (8, total 513 lines)

| File | Lines | Exports | Stock deps |
|------|-------|---------|------------|
| `components/ui/section.tsx` | 46 | `Section`, `SectionProps` | — |
| `components/ui/container-editorial.tsx` | 35 | `ContainerEditorial`, `ContainerEditorialProps` | — |
| `components/ui/faq-item.tsx` | 47 | `FAQItem`, `FAQItemProps` | `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` |
| `components/ui/market-card.tsx` | 74 | `MarketCard`, `MarketCardProps` | `next/image`, `next/link`, `lucide-react` (ArrowRight) |
| `components/ui/programme-tile.tsx` | 77 | `ProgrammeTile`, `ProgrammeTileProps` | `Card`, `CardContent`, `CardHeader`, `Badge`, `next/image`, `next/link`, `lucide-react` (Clock) |
| `components/ui/testimonial-card.tsx` | 93 | `TestimonialCard`, `TestimonialCardProps`, `testimonialCardVariants` | `Avatar`, `AvatarFallback`, `AvatarImage`, `lucide-react` (Quote) |
| `components/ui/stat-strip.tsx` | 65 | `StatStrip`, `StatStripProps` | `Separator` |
| `components/ui/logo-wall.tsx` | 76 | `LogoWall`, `LogoWallProps`, `LogoWallLogo` | `next/image`, `next/link` |

## Task Commits

Each task was committed atomically:

1. **Task 1: Section + ContainerEditorial + FAQItem** — `3bab5ed` (feat)
2. **Task 2: MarketCard + ProgrammeTile + TestimonialCard** — `a81398e` (feat)
3. **Task 3: StatStrip + LogoWall + final build** — `309ed77` (feat)

## Verification

### Task-level (each task's `<verify>` block)

| Check | Task 1 | Task 2 | Task 3 |
|-------|--------|--------|--------|
| File existence (`test -f`) | ✓ | ✓ | ✓ |
| Required `export interface` greps | ✓ | ✓ | ✓ |
| Required utility class greps (`py-section-md`, `from-brand-navy`, `max-w-2xl`/`6xl`/`7xl`, `grayscale`, etc.) | ✓ | ✓ | ✓ |
| Required symbol greps (`AccordionTrigger`, `ArrowRight`, `Badge`, `Clock`, `blockquote`, `pullquote`, `Avatar`, `Separator`, `orientation="vertical"`) | ✓ | ✓ | ✓ |
| Pillar 2 raw-hex grep — per-task files | ✓ empty | ✓ empty | ✓ empty |
| `pnpm typecheck` | ✓ | ✓ | ✓ |

### Plan-level invariants

| Check | Command | Result |
|-------|---------|--------|
| All 8 custom files present | `ls components/ui/{section,container-editorial,faq-item,market-card,programme-tile,testimonial-card,stat-strip,logo-wall}.tsx` | 8 files ✓ |
| Total primitive count (6 stock + 8 custom) | `ls components/ui/*.tsx \| wc -l` | `14` ✓ |
| **Pillar 2 — no raw hex anywhere under `components/ui/`** | `grep -rE "#[0-9a-fA-F]{6}" components/ui/` | empty ✓ |
| Typed interfaces exported (all 8) | `grep -c "^export interface" components/ui/{...}.tsx` | 9 total (LogoWall has 2 — `LogoWallLogo` + `LogoWallProps`) ✓ |
| `data-slot` on every primitive file | `grep -l "data-slot=" components/ui/*.tsx \| wc -l` | `14` ✓ |
| No inline style colour overrides | `grep -r "style={{" components/ui/` | empty ✓ |
| `pnpm typecheck` | exit code | `0` ✓ |
| `pnpm build` | exit code | `0` — compiled in 34.3s; 7 static pages generated; all primitives in module graph ✓ |

### Final `pnpm build` tail

```
 ✓ Compiled successfully in 34.3s
   Running next.config.js provided runAfterProductionCompile ...
 ✓ Completed runAfterProductionCompile in 2097ms
   Linting and checking validity of types ...
   Collecting page data ...
 ✓ Generating static pages (7/7)
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                         Size  First Load JS
┌ ○ /_not-found                      0 B         239 kB
├ ƒ /api/sentry-smoke                0 B            0 B
├ ○ /hk                              0 B         239 kB
├ ○ /root                            0 B         239 kB
├ ○ /sg                              0 B         239 kB
└ ○ /studio/[[...tool]]          1.67 MB        1.91 MB
+ First Load JS shared by all     252 kB
```

Build tail is identical in shape to Plan 02-03's baseline — all 8 new primitives are tree-shakeable unused exports at this stage (no page consumes them yet; Plan 02-06 gallery + Phase 3+ pages will import). No route-size regressions, no new bundles.

## Decisions Made

- **Type-scale encoding (plan-specified, confirmed).** Per the plan's note in Task 1 action block, `text-h1`/`text-h2`/`text-h3`/`text-body`/`text-body-lg`/`text-label` UI-SPEC roles are encoded as inline Tailwind utility strings (e.g., `font-display text-xl font-semibold lg:text-2xl` for h3) rather than custom `@theme --text-*` tokens. No additional `app/globals.css` edits needed. The role→utility mapping table in the plan was followed verbatim.
- **MarketCard Link passthrough via `Omit<..., "href">`.** Props extend `Omit<React.ComponentProps<typeof Link>, "href">` so consumers can pass `prefetch`, `scroll`, `replace`, etc. onto the wrapper, while `href` is explicitly typed in `MarketCardProps` for clarity.
- **TestimonialCard is the only CVA primitive in this batch.** The `default|pullquote` split has enough shared-but-different base styling to warrant CVA. The other primitives use simpler prop-mapped constants (`sizeMap`, `bgMap`, `widthMap`, or conditional `cn()`).
- **No `size='touch'` dependency at primitive level.** Interactive primitives (MarketCard, ProgrammeTile) rely on their root `<Link>` being the full click target (generous hit area via the 4:3 photo wrapper). When a Button needs WCAG 2.2 AA touch sizing inside a page that embeds these primitives, the consumer composes `<Button size="touch">` themselves — keeps primitives UI-SPEC-faithful.
- **`ReadonlyArray` for list props.** `StatStrip.stats` and `LogoWall.logos` are typed `ReadonlyArray<T>` — signals immutability and accepts both literal arrays and `readonly`-typed arrays from Phase 3+ CMS shims.

## Deviations from Plan

**None material.** Plan executed exactly as written. Minor auto-formatting by lefthook's `lint-staged` (prettier + eslint --fix) reformatted line-wrapping in several files (e.g., `container-editorial.tsx` merged multi-line interface extension into one line; `testimonial-card.tsx` collapsed `initials()` JSX comment placement; `stat-strip.tsx` collapsed CVA `cva(` first arg onto same line). These are stylistic, not behavioural — no `old_string` mismatch or semantic change.

The plan's sample code referenced "Bloc Bold" / "Mont" in comments; the executed primitives use the post-amendment "Unbounded" / "Manrope" names in the new comments added in this plan. Not a Rule 1 deviation — just observing the D-01 amendment context (the `font-display` / `font-sans` Tailwind utilities themselves are unchanged public API).

## Accessibility / Pillar 5 Preconditions

- **Focus rings:** MarketCard + ProgrammeTile + LogoWall (when `href` set) have `focus-visible:ring-3 focus-visible:ring-ring` on their `<Link>` wrappers. FAQItem inherits Accordion's focus styling (Plan 02-03 already encoded `focus-visible:ring-3 focus-visible:ring-ring/50` on `AccordionTrigger`).
- **Semantic HTML:** Section accepts `as="section"|"article"|"div"` (default `section`). TestimonialCard uses `<figure>` + `<blockquote>` + `<figcaption>` + `<cite>`. MarketCard + ProgrammeTile wrap entire card in a single `<Link>` — no nested `<a>` tags.
- **Alt text enforced via required `imageAlt` string prop** on MarketCard, ProgrammeTile, and each `LogoWallLogo` entry.
- **Aria labels:** MarketCard has `aria-label="${label} — ${tagline}"`, ProgrammeTile has `aria-label="${title} · ${ageRange}"`.
- **Touch target on FAQ:** `AccordionTrigger` in FAQItem gets `min-h-11` (44px) to satisfy WCAG 2.2 AA.
- **Yellow never used as text colour:** `text-brand-yellow` only appears on the Quote decorative icon in TestimonialCard default variant and the `border-brand-yellow` accent border in pullquote variant — icon is `aria-hidden`, border is decorative. All actual text uses `text-primary` (navy), `text-foreground`, `text-muted-foreground`, `text-white`, or `text-brand-cream`.

## Editorial Asymmetry / DS-06 Groundwork

Per UI-SPEC §7, editorial-asymmetry guardrails are enforced at the consumer-site level (Phase 3+ page composition), not at primitive site level:

- **ContainerEditorial does not force centered content.** It only applies horizontal padding + max-width + `mx-auto`. The inner content can be any grid/flex composition the consumer chooses (`grid-cols-12`, asymmetric rows, etc.).
- **StatStrip uses `flex` not `grid`.** This lets Phase 3+ page authors place the strip asymmetrically inside a larger 12-column grid without fighting a rigid grid layout.
- **Section is a pure wrapper.** No inner grid or centering — the consumer composes children as needed.
- **LogoWall defaults to `grid` but offers `row` variant.** A row layout for logo sliders / side-scroll treatments supports the asymmetric "some logos more prominent than others" pattern.

None of the primitives default to a symmetric grid layout — the SaaS-ish "bento card" aesthetic (12 identical cards in a uniform grid) is not ergonomically expressible without additional consumer-side composition.

## Pillar 2 Grep Proof

```bash
$ grep -rE "#[0-9a-fA-F]{6}" components/ui/
(empty)
```

All 14 primitive files token-only. Any Phase 3+ page that introduces a raw hex in a primitive will be caught by this same grep.

## Notes for Plan 02-06 (gallery)

Import signatures for each custom primitive — use these verbatim in `/_design/page.tsx`:

```ts
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { FAQItem } from "@/components/ui/faq-item";
import { MarketCard } from "@/components/ui/market-card";
import { ProgrammeTile } from "@/components/ui/programme-tile";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { StatStrip } from "@/components/ui/stat-strip";
import { LogoWall } from "@/components/ui/logo-wall";
```

**Stock-primitive dependency graph** (Plan 02-06 must render Plan 02-03 stock primitives + Plan 02-04 custom primitives):

| Custom primitive | Stock primitives consumed |
|------------------|---------------------------|
| Section | — (pure wrapper) |
| ContainerEditorial | — (pure wrapper) |
| FAQItem | Accordion / AccordionItem / AccordionTrigger / AccordionContent |
| MarketCard | next/image, next/link, lucide-react |
| ProgrammeTile | Card / CardContent / CardHeader + Badge + next/image/link + lucide-react |
| TestimonialCard | Avatar / AvatarFallback / AvatarImage + CVA + lucide-react |
| StatStrip | Separator + CVA |
| LogoWall | next/image, next/link |

**Required gallery inputs** (from curated hero photos per D-07):
- MarketCard example needs 1 hero photo (e.g., root gateway HK venue shot)
- ProgrammeTile example needs 1 photo (e.g., a gymnastics class shot)
- TestimonialCard example optionally takes 1 avatar (parent/coach portrait)
- StatStrip example is text-only (no photo)
- LogoWall example needs 4-8 partner logos (may use placeholders — real school/brand logos arrive in Phase 4)
- FAQItem / Section / ContainerEditorial are content-only (no photo)

**Gallery primitive rendering order (recommended)** — follows the "Foundation → Primitives → Patterns → Media" structure in UI-SPEC §5:
1. `Section` (show size="sm"/"md"/"lg" + bg="default"/"muted"/"navy"/"cream")
2. `ContainerEditorial` (show width="narrow"/"default"/"wide")
3. `FAQItem` (show 1 closed + 1 defaultOpen)
4. `StatStrip` (show default + on-dark variants)
5. `LogoWall` (show grid + row variants)
6. `MarketCard` (show HK + SG side by side)
7. `ProgrammeTile` (show 3 examples in a grid)
8. `TestimonialCard` (show default + pullquote side by side)

## Notes for Phase 3+ (page builds)

- **Root gateway homepage (`/root/page.tsx`):** Compose `<Section size="lg"><ContainerEditorial width="wide"><div class="grid md:grid-cols-2 gap-8"><MarketCard market="hk"/><MarketCard market="sg"/></div></ContainerEditorial></Section>` for the dual-market hero.
- **HK programme pillar (`/hk/gymnastics/page.tsx`):** `<Section><ContainerEditorial><div class="grid lg:grid-cols-3 gap-6">{programmes.map(p => <ProgrammeTile .../>)}</div></ContainerEditorial></Section>` — 8 sub-pages fit cleanly in a 3-col grid.
- **Testimonial rotation:** Use `<TestimonialCard variant="default">` in grid contexts (3 per row); reserve `variant="pullquote"` for hero-adjacent editorial moments.
- **StatStrip on navy Section:** Pair `<Section bg="navy"><StatStrip variant="on-dark" stats={...} /></Section>` so the `text-brand-cream` labels resolve with adequate contrast against navy.
- **FAQItem in FAQ pages:** Render multiple `<FAQItem>` instances inside a `<ContainerEditorial width="narrow">` for optimal reading width. Each is its own `Accordion` root, so they independently open/close (not a single multi-item accordion).

## Self-Check: PASSED

**Files verified to exist:**
- FOUND: components/ui/section.tsx
- FOUND: components/ui/container-editorial.tsx
- FOUND: components/ui/faq-item.tsx
- FOUND: components/ui/market-card.tsx
- FOUND: components/ui/programme-tile.tsx
- FOUND: components/ui/testimonial-card.tsx
- FOUND: components/ui/stat-strip.tsx
- FOUND: components/ui/logo-wall.tsx

**Commits verified to exist:**
- FOUND: 3bab5ed (Task 1 — feat(02-04): add Section + ContainerEditorial + FAQItem primitives)
- FOUND: a81398e (Task 2 — feat(02-04): add MarketCard + ProgrammeTile + TestimonialCard primitives)
- FOUND: 309ed77 (Task 3 — feat(02-04): add StatStrip + LogoWall primitives)

**Plan-level invariants verified:**
- 14 primitive files at components/ui/*.tsx (6 stock + 8 custom)
- No raw hex (`grep -rE "#[0-9a-fA-F]{6}" components/ui/` returns empty)
- No inline style colour overrides (`grep -r "style={{" components/ui/` returns empty)
- `data-slot` on all 14 files
- Typed `export interface` on all 8 custom files (9 interfaces — LogoWall has 2)
- `pnpm typecheck` exit 0
- `pnpm build` exit 0 (34.3s compile, 7 static pages generated)

---
*Phase: 02-design-system-component-gallery-media-pipeline*
*Plan: 04 — custom-primitives*
*Completed: 2026-04-23*

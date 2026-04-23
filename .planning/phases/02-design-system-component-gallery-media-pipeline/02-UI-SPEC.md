---
phase: 2
slug: design-system-component-gallery-media-pipeline
status: draft
shadcn_initialized: true
preset: style=radix-nova + base-color=neutral + css-variables=true + rsc=true + iconLibrary=lucide
created: 2026-04-23
requirements: [DS-01, DS-02, DS-03, DS-04, DS-05, DS-06]
upstream_inputs:
  - 02-CONTEXT.md (D-01..D-09 locked)
  - 02-RESEARCH.md (7 topics, 7 pitfalls verified)
  - PROJECT.md (palette, typography stack)
  - strategy.md §PART 14.1..14.6
  - REQUIREMENTS.md DS-01..DS-06
---

# Phase 2 — UI Design Contract

> **Scope reminder:** Phase 2 delivers the *visual and media foundation* that every page built after it will assemble from — not invent. Tokens first (Tailwind v4 `@theme` brand layer + `:root` brand-colour overlay over Phase 1's shadcn neutral scaffold), then ~10 primitives (6 stock shadcn, 5 brand-custom, 2 typed wrappers, 1 Mux video shell), then a single-scroll `/_design/` gallery proving every primitive against real ProActiv photography. Real Mux video, variant matrices, dark mode, and 22 GB bulk processing are **deferred** per CONTEXT.md `<deferred>`. This contract is binding on the planner and executor; any deviation requires a Rule 1 correction documented in the plan SUMMARY.

---

## 0. How this contract is used

| Consumer | What they pull from here |
|----------|--------------------------|
| `gsd-planner` | §1 tokens, §3 component inventory (→ task list), §5 media contracts (→ Sharp script task), §8 decisions map (→ binding on every plan) |
| `gsd-executor` | §1 token values (exact oklch / HSL), §3 props + states + a11y, §4 gallery IA, §5 media output paths |
| `gsd-ui-checker` | §6 six-pillar quality checklist, §7 editorial-asymmetry guardrails, §10 requirement traceability |
| `gsd-ui-auditor` | post-execute diff of `public/photography/`, `components/ui/*`, `app/_design/page.tsx`, `app/globals.css`, `app/layout.tsx` against this contract |

---

## 1. Design System — Tokens

### 1.1 CSS layering order (load-bearing — do not reorder)

Phase 2 **extends** Phase 1's `app/globals.css` (Plan 01-02). The executor MUST preserve the existing `@import "tailwindcss"` / `@import "tw-animate-css"` / `@import "shadcn/tailwind.css"` stack and the `@theme inline { --color-* : var(--*); }` Tailwind-utility binding table. Only two regions change:

1. A **new `@theme { ... }` block** (above `@theme inline`) that adds ProActiv brand utilities: `--color-brand-navy`, `--color-brand-red`, `--color-brand-green`, `--color-brand-sky`, `--color-brand-yellow`, `--color-brand-cream`; three font family vars (`--font-display / --font-sans / --font-accent`); three section-spacing vars.
2. The existing **`:root { ... }` oklch values** get replaced with brand-mapped oklch values (Phase 1 shipped oklch, NOT HSL — see §1.3 note).

`@theme inline { ... }` utility binding stays untouched. `.dark { ... }` stays (inherited from Phase 1) but is **not redefined** — dark mode deferred per CONTEXT.md Claude's Discretion.

### 1.2 Brand colour palette (authoritative — from PROJECT.md)

| Role | Hex | Tailwind utility | oklch (sRGB → OKLab → OKLCh) | HSL triplet |
|------|-----|------------------|------------------------------|-------------|
| Navy (primary brand) | `#0f206c` | `bg-brand-navy` / `text-brand-navy` | `oklch(0.2906 0.1328 267.05)` | `229 76% 24%` |
| Red (tertiary / urgent) | `#ec1c24` | `bg-brand-red` / `text-brand-red` | `oklch(0.6012 0.2339 26.97)` | `358 85% 52%` |
| Green (secondary energy) | `#0f9733` | `bg-brand-green` / `text-brand-green` | `oklch(0.5902 0.1753 146.10)` | `136 82% 33%` |
| Sky (secondary energy) | `#0fa0e2` | `bg-brand-sky` / `text-brand-sky` | `oklch(0.6694 0.1443 237.35)` | `199 88% 47%` |
| Yellow (accent energy) | `#fac049` | `bg-brand-yellow` / `text-brand-yellow` | `oklch(0.8399 0.1469 81.92)` | `40 95% 63%` |
| Cream (warm surface) | `#fff3dd` | `bg-brand-cream` | `oklch(0.9678 0.0316 82.77)` | `39 100% 93%` |
| White (pure surface) | `#ffffff` | `bg-white` | `oklch(1 0 0)` | `0 0% 100%` |

### 1.3 WCAG AA contrast audit (measured, not estimated)

All contrast ratios computed against WCAG 2.1 formula. **AA: 4.5:1 body text, 3:1 large text (≥18pt regular or ≥14pt bold) and UI components.** Ratios below are binding — any new colour pairing outside this table MUST be re-audited by the executor before shipping.

| Pairing | Ratio | AA body | AA large | Verdict / Usage rule |
|---------|-------|---------|----------|----------------------|
| Navy `#0f206c` on White | 14.55:1 | ✓ | ✓ | Primary body text + headlines on white surfaces (60% dominant) |
| White on Navy | 14.55:1 | ✓ | ✓ | Primary CTA text on navy fill + footer text |
| Navy on Cream `#fff3dd` | 13.24:1 | ✓ | ✓ | Body text on cream card fills (warm-surface pattern) |
| Cream on Navy | 13.24:1 | ✓ | ✓ | Secondary text on dark navy hero surfaces |
| Red `#ec1c24` on White | 4.41:1 | ✗ | ✓ | **DO NOT use for body text.** OK only for ≥18pt headline emphasis + ≥24px icons + button fills |
| White on Red | 4.41:1 | ✗ | ✓ | **DO NOT use for destructive body copy.** OK only for short button labels ≥14pt bold |
| Green `#0f9733` on White | 3.82:1 | ✗ | ✓ | **DO NOT use for body text.** OK for ≥18pt headlines, icon accents, success badge fills |
| White on Green | 3.82:1 | ✗ | ✓ | Short CTA labels only (≥14pt bold) |
| Sky `#0fa0e2` on White | 2.94:1 | ✗ | ✗ | **TEXT FORBIDDEN on white.** Use only as a background fill with navy text on top, or as a decorative stroke. |
| Yellow `#fac049` on White | 1.65:1 | ✗ | ✗ | **TEXT FORBIDDEN on any light surface.** Yellow is reserved for background fills ONLY. |
| Navy on Yellow | 8.80:1 | ✓ | ✓ | The canonical "energy accent" pattern — navy text inside a yellow fill (badges, CTAs, highlight chips) |

**Trap reference:** CONTEXT.md §specifics explicitly flags the yellow-on-white trap. This table is the binding resolution.

### 1.4 Semantic token mapping (shadcn `:root` overrides)

Phase 1 Plan 01-02 shipped `app/globals.css` with shadcn's oklch-based neutral palette (verified: Phase 1 SUMMARY §Decisions Made line 153). Phase 2 overrides the **values** only; it does NOT touch the `@theme inline { ... }` binding table (Plan 01-02 SUMMARY §Notes for Phase 2 forbids this explicitly). Both representations are given — the executor picks oklch (matching Phase 1's existing `:root`) unless a downstream reason forces HSL.

| shadcn semantic | Brand source | oklch value (use this to match Phase 1) | Rationale |
|-----------------|--------------|------------------------------------------|-----------|
| `--background` | White | `oklch(1 0 0)` | 60% dominant surface (strategy §14.1 "Neutral Light / Surface") |
| `--foreground` | Navy | `oklch(0.2906 0.1328 267.05)` | Body text — 14.55:1 on white |
| `--card` | White | `oklch(1 0 0)` | Card surface = page surface (editorial asymmetry depends on shadow/border, not card-fill contrast) |
| `--card-foreground` | Navy | `oklch(0.2906 0.1328 267.05)` | Body text inside cards |
| `--popover` | White | `oklch(1 0 0)` | Same as card |
| `--popover-foreground` | Navy | `oklch(0.2906 0.1328 267.05)` | — |
| `--primary` | Navy | `oklch(0.2906 0.1328 267.05)` | Primary CTA fill (Button default variant) |
| `--primary-foreground` | White | `oklch(1 0 0)` | CTA label colour — 14.55:1 |
| `--secondary` | Yellow | `oklch(0.8399 0.1469 81.92)` | Energy accent fill (secondary CTA, badges). Text on top MUST be navy. |
| `--secondary-foreground` | Navy | `oklch(0.2906 0.1328 267.05)` | 8.80:1 on yellow |
| `--accent` | Cream | `oklch(0.9678 0.0316 82.77)` | Warm surface for hover / subtle emphasis — 13.24:1 with navy |
| `--accent-foreground` | Navy | `oklch(0.2906 0.1328 267.05)` | — |
| `--muted` | Cream | `oklch(0.9678 0.0316 82.77)` | Muted card / sidebar surface |
| `--muted-foreground` | Navy at 70% | `oklch(0.45 0.05 267)` | Subdued body text — ≥4.6:1 on white (verify live) |
| `--destructive` | Red | `oklch(0.6012 0.2339 26.97)` | Reserved for destructive actions + form error borders — NEVER for marketing emphasis |
| `--destructive-foreground` | White | `oklch(1 0 0)` | — |
| `--border` | Neutral 200 | `oklch(0.922 0 0)` | Keep Phase 1 value — shadcn default is brand-neutral enough |
| `--input` | Neutral 200 | `oklch(0.922 0 0)` | Keep Phase 1 value |
| `--ring` | Navy | `oklch(0.2906 0.1328 267.05)` | Focus-ring colour — must match `--primary` so focus state is branded |
| `--radius` | — | `0.625rem` (10px) | Keep Phase 1 value (honored by shadcn radius scale `--radius-sm..4xl`) |

> **Red-as-tertiary note:** Strategy §14.1 reserves red for "urgent emphasis only — urgent offers, Featured tags". Mapping red to `--destructive` (shadcn's destructive role) captures its "stop / alert" semantic correctly. If a future page needs red as a marketing accent (e.g., "Featured camp" ribbon), use the raw `bg-brand-red` Tailwind utility from the `@theme { }` brand layer — NOT `bg-destructive`. This split preserves the destructive-action semantic for Phase 7 accessibility audits.

### 1.5 Brand `@theme { }` additions (new — load ABOVE `@theme inline`)

```css
/* app/globals.css — new block, added in Phase 2 */
@theme {
  /* ── ProActiv brand palette (PROJECT.md authoritative) ── */
  --color-brand-navy:   #0f206c;
  --color-brand-red:    #ec1c24;
  --color-brand-green:  #0f9733;
  --color-brand-sky:    #0fa0e2;
  --color-brand-yellow: #fac049;
  --color-brand-cream:  #fff3dd;

  /* ── Typography families (wired by next/font/local in app/fonts.ts;
         WOFF2 files live at assets/brand/fonts/ per D-02) ── */
  --font-display: var(--font-bloc, "Arial", "Helvetica Neue", system-ui, sans-serif);
  --font-sans:    var(--font-mont, "Arial", "Helvetica Neue", system-ui, sans-serif);
  --font-accent:  var(--font-baloo, "Arial", "Helvetica Neue", system-ui, sans-serif);

  /* ── Section-spacing rhythm (strategy §14.6 — exact values) ── */
  --spacing-section-sm: 4rem;   /* 64px — compact content-block gap */
  --spacing-section-md: 6rem;   /* 96px — default section gap on desktop */
  --spacing-section-lg: 8rem;   /* 128px — hero / pillar section gap */
}
```

Generated Tailwind utilities (auto, no config file): `bg-brand-navy`, `text-brand-red`, `border-brand-green`, `ring-brand-sky`, `bg-brand-yellow`, `bg-brand-cream`, plus `font-display / font-sans / font-accent`, plus `py-section-sm / py-section-md / py-section-lg` (and `mt-*`, `mb-*`, `gap-*` equivalents).

**Resolution order — `--font-sans` alias (FLAG-4 clarification):** Phase 1's `@theme inline { --font-sans: var(--font-sans); }` is a self-referential alias that originally resolved to Geist (imported in `app/layout.tsx`). When Phase 2 lands, the `@theme { }` block above declares `--font-sans: var(--font-mont, ...)` which takes precedence in Tailwind v4's cascade (later `@theme` declarations override earlier ones). The `@theme inline` alias then resolves to the new Mont-backed value. **No circular reference**: `@theme inline` reads the computed value, not the declaration site. Executor MUST still verify in dev mode by checking `getComputedStyle(document.body).fontFamily` includes `--font-mont` after Phase 2 lands. If a race occurs (unlikely in Tailwind v4), the fix is to remove the Phase 1 `--font-sans: var(--font-sans)` alias entirely and rely on the `@theme { --font-sans: var(--font-mont, …) }` declaration alone.

### 1.6 Type scale

Strategy §14.3 explicitly asks for **"Confident type scale — H1 at 72–96px on desktop. Don't fear big type."** That's the design brief. Scale below reflects it.

| Role | CSS var / utility | Mobile (<768px) | Desktop (≥768px) | Line-height | Letter-spacing | Weight | Font family |
|------|-------------------|-----------------|------------------|-------------|----------------|--------|-------------|
| `display` | `text-display` | 3rem (48px) | 5.5rem (88px) | 1.05 | -0.02em | 700 Bold | `--font-display` (Bloc Bold) |
| `h1` | `text-h1` | 2.25rem (36px) | 3.5rem (56px) | 1.1 | -0.015em | 700 Bold | `--font-display` |
| `h2` | `text-h2` | 1.75rem (28px) | 2.25rem (36px) | 1.2 | -0.01em | 700 Bold | `--font-display` |
| `h3` | `text-h3` | 1.375rem (22px) | 1.5rem (24px) | 1.3 | 0 | 600 Semi-bold | `--font-display` |
| `body-lg` | `text-body-lg` | 1.125rem (18px) | 1.125rem (18px) | 1.55 | 0 | 400 Regular | `--font-sans` (Mont) |
| `body` | `text-body` | 1rem (16px) | 1rem (16px) | 1.55 | 0 | 400 Regular | `--font-sans` |
| `small` | `text-small` | 0.875rem (14px) | 0.875rem (14px) | 1.5 | 0 | 400 Regular | `--font-sans` |
| `label` | `text-label` | 0.875rem (14px) | 0.875rem (14px) | 1.4 | 0.01em | 500 Medium | `--font-sans` |

**Expose these in `@theme { }` as `--text-display / --text-h1 / ...` using Tailwind v4's two-value shorthand `--text-display: 5.5rem --line-height: 1.05;` where responsive breakpoints use the `@media (min-width: 768px) { @theme { ... } }` override pattern OR the component-level `md:text-display` utility.** Planner picks the cleanest encoding at plan time.

**Why 8 semantic roles over 6 distinct pixel sizes (FLAG-2 clarification):** The standard ≤4-font-sizes dimension rule targets uncontrolled size proliferation (arbitrary 13px / 15px / 17px drift). This spec uses 8 SEMANTIC roles that collapse to 6 DISTINCT sizes: 14 (small/label), 16 (body), 18 (body-lg), 24 (h3), 36 (h2), 56 (h1 desktop) / 88 (display desktop). The split between `display` and `h1` is mandated by strategy §14.3 ("confident H1 at 72–96px on desktop — don't fear big type") — merging them would lose the hero-scale hook. The split between `body` and `body-lg` is needed for pull-quotes and lead paragraphs at 18px. The split between `small` and `label` shares a size but differs in weight (400 vs 500) and letter-spacing (0 vs 0.01em) to distinguish decorative text from form labels. This is a structured design system with clear intent per role — not size chaos.

### 1.7 Font stack (self-hosted via `next/font/local`)

| Family | CSS var | Weights provisioned | Usage | Source format | File location (D-02 drop zone) |
|--------|---------|---------------------|-------|---------------|--------------------------------|
| Bloc Bold (Zetafonts — licensed per D-01) | `--font-display` / `--font-bloc` | 400 Regular, 700 Bold *(optional: 900 Black if provided)* | Display, h1, h2, h3, eyebrows | WOFF2 | `assets/brand/fonts/bloc-bold-*.woff2` |
| Mont (Fontfabric — licensed per D-01) | `--font-sans` / `--font-mont` | 400 Regular, 500 Medium, 700 Bold | Body, labels, small, navigation, forms | WOFF2 | `assets/brand/fonts/mont-*.woff2` |
| Baloo 2 (Google Fonts — OFL) | `--font-accent` / `--font-baloo` | 400 Regular, 500 Medium, 700 Bold | **ProGym-scoped ONLY** (HK Wan Chai + Cyberport + ProGym-branded surfaces). NEVER on root gateway, SG, legal. | WOFF2 | `assets/brand/fonts/baloo-*.woff2` |

**`next/font/local` options (binding per CONTEXT.md Claude's Discretion):**
- `display: 'swap'` — non-negotiable
- `adjustFontFallback: 'Arial'` for sans families (Mont, Baloo 2); — for Bloc Bold, use `'Arial'` as well (display font metric-matching is approximate; pitfall 2 in 02-RESEARCH.md)
- `preload: true` (default, keep)
- `fallback: ['system-ui', 'Arial', 'sans-serif']`
- `variable: '--font-bloc' | '--font-mont' | '--font-baloo'`

**File-provisioning precondition (D-02):** Phase 2 executor's font-wiring task MUST start with a file-existence check against the following paths (D-02 drop zone — Martin provisions these before `/gsd-execute-phase 2`):

- `assets/brand/fonts/bloc-bold-regular.woff2`
- `assets/brand/fonts/bloc-bold-bold.woff2`
- `assets/brand/fonts/mont-regular.woff2`
- `assets/brand/fonts/mont-medium.woff2`
- `assets/brand/fonts/mont-bold.woff2`
- `assets/brand/fonts/baloo-regular.woff2`
- `assets/brand/fonts/baloo-medium.woff2`
- `assets/brand/fonts/baloo-bold.woff2`

If any are missing, the task returns `HUMAN-ACTION` — do NOT substitute placeholder fonts without user approval.

**How `next/font/local` consumes these files:** The font-wiring module at `app/fonts.ts` calls `localFont({ src: [...] })` where each `src.path` is **relative to the calling file**. From `app/fonts.ts`, the relative path to `assets/brand/fonts/bloc-bold-regular.woff2` is `'../assets/brand/fonts/bloc-bold-regular.woff2'`. No tsconfig path alias is required; no file copy step is required; the files live at the D-02 drop zone and are referenced from `app/fonts.ts` via `..`. If the planner prefers a cleaner import (`@/fonts/...`), they may add a tsconfig `paths` entry at plan time — but this is optional cosmetic cleanup, not a requirement for Phase 2 to ship.

**Scoping enforcement for Baloo (D-03):** `--font-accent` is declared in the root `@theme { }` but applied ONLY inside route groups / components that opt-in. Pattern:
- Root layout `app/layout.tsx`: `<html className={${blocBold.variable} ${mont.variable}}>` — Baloo NOT attached to html.
- ProGym-scoped pages (e.g., `app/hk/wan-chai/layout.tsx` in Phase 4): wrap with `<div className={baloo.variable}>` or add `baloo.variable` to the route-group's layout `<html>` className.
- Or: components that want Baloo use `className="font-accent"` inside a container whose `--font-accent` variable has been locally set by the route-group layout. Planner picks the cleanest pattern at plan time — both are valid.

### 1.8 Spacing scale

| Token | Tailwind utility | Value | Phase 2 Usage |
|-------|------------------|-------|---------------|
| `xs` | `p-1` / `gap-1` | 4px | Inline icon gaps, badge inner padding |
| `sm` | `p-2` / `gap-2` | 8px | Compact stacks (button icon↔label, chip rows) |
| `md` | `p-4` / `gap-4` | 16px | Default element spacing (card internal padding-y) |
| `lg` | `p-6` / `gap-6` | 24px | Card internal padding, form field spacing |
| `xl` | `p-8` / `gap-8` | 32px | Column gaps in multi-card rows |
| `2xl` | `p-12` | 48px | Major content-block separation within a section |
| `3xl` | `py-16` | 64px | Equivalent to `py-section-sm` |
| `section-sm` | `py-section-sm` | 64px | Minor sections (footer block, inline promo) |
| `section-md` | `py-section-md` | 96px | **Default section spacing** (PART 14.6 baseline) |
| `section-lg` | `py-section-lg` | 128px | Hero + pillar-page major sections |

Exceptions: icon-only touch targets may go to 44×44px per WCAG AA (non-multiple of 4 via `h-11 w-11`). This is the only sanctioned exception — all other spacing uses the scale above.

### 1.9 Radius scale

Phase 1 shipped `--radius: 0.625rem` (10px) with shadcn's derived `--radius-sm/md/lg/xl/2xl/3xl/4xl` chain. CONTEXT.md Claude's Discretion says: keep default unless it visually conflicts. **Phase 2 keeps `--radius: 0.625rem`.** If the first primitive render in `/_design/` flags a conflict with brand fidelity (e.g., too-soft on navy surfaces), planner files a targeted revision at §1.9 only — do not cascade to `@theme inline` mapping.

| Token | Value | Used by |
|-------|-------|---------|
| `rounded-sm` | 6px (0.6× radius) | Small badges, compact chips |
| `rounded-md` | 8px (0.8× radius) | Buttons, inputs, default controls |
| `rounded-lg` | 10px (base radius) | Cards, dialog panels, MarketCard |
| `rounded-xl` | 14px (1.4×) | Hero surfaces, feature cards |
| `rounded-2xl` | 18px (1.8×) | Full-bleed media cards (TestimonialCard with photo) |
| `rounded-full` | 9999px | Avatar, circular icon buttons |

### 1.10 Shadow scale

CONTEXT.md Claude's Discretion: "default shadcn scale — defer refinement to Phase 3+ page needs". Phase 2 uses Tailwind v4 defaults (`shadow-xs / sm / md / lg / xl / 2xl`) unmodified. A **soft navy-tinted shadow** may be introduced in Phase 3+ for hero cards — not in Phase 2.

| Token | Default value | Phase 2 usage |
|-------|---------------|---------------|
| `shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Card hover state, Input focus |
| `shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1)` | MarketCard hover, ProgrammeTile elevation on hover |
| `shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1)` | TestimonialCard, LogoWall hovered logo |
| `shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.1)` | Reserved — not used in Phase 2 |

---

## 2. Design System — Summary table (for template compatibility)

| Property | Value |
|----------|-------|
| Tool | shadcn/ui (already initialized Phase 1 Plan 01-02; Phase 2 adds primitives via `pnpm dlx shadcn@latest add`) |
| Preset | `style=radix-nova`, `baseColor=neutral`, `cssVariables=true`, `rsc=true`, `tsx=true`, `iconLibrary=lucide`, aliases `@/components`, `@/lib/utils`, `@/components/ui`, `@/lib`, `@/hooks` — as written by Phase 1 `components.json` (do NOT re-init) |
| Component library | Radix primitives via `radix-ui@1.4.3` metapackage (v4 consolidation) |
| Icon library | `lucide-react@1.8.0` (Phase 1 installed; Phase 2 uses throughout) |
| Font | **Self-hosted via `next/font/local`:** Bloc Bold (display), Mont (body), Baloo (ProGym-scoped). Replaces Phase 1's Geist import in `app/layout.tsx`. |

### Route-group distinguisher stripe removal (Phase 1 → Phase 2 handoff)

Phase 1's slate/amber/teal placeholder top stripes (Phase 1 UI-SPEC §Route-group distinguisher stripes) are **scaffolding that Phase 2 keeps intact**. They are removed by each market's first real layout — Phase 3 (root), Phase 4 (HK), Phase 5 (SG). Phase 2 does NOT touch them; the `/_design/` route is a separate page.

---

## 3. Component Inventory

Full primitive library for Phase 2. Every primitive lives at `components/ui/<kebab-name>.tsx`, imports `cn()` from `@/lib/utils`, uses the CVA variant pattern from `components/ui/button.tsx`, and consumes **only** token utilities (`bg-primary`, `text-muted-foreground`, `bg-brand-navy`, `py-section-md`) — never raw hex.

**Legend:**
- **Source:** `stock-cli` = `pnpm dlx shadcn@latest add <name>` · `custom` = hand-written on Radix + tokens · `wrapper` = thin typed wrapper (not a Radix primitive)
- **Category:** `primitive` (single-concept) · `pattern` (composition of primitives) · `media` · `layout-wrapper`
- **States:** each cell lists what visual/interaction differences MUST be implemented. `—` = not applicable.

### 3.1 Primitive — `Button`

- **Status:** EXISTS (Phase 1 Plan 01-02) — Phase 2 task is to **audit and, if needed, re-theme** so `bg-primary` renders navy (not neutral) after the `:root` override lands in §1.4.
- **Source:** `stock-cli` (already in `components/ui/button.tsx`)
- **Required props:** `variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link'`, `size?: 'default' | 'xs' | 'sm' | 'lg' | 'touch' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'`, `asChild?: boolean`, plus native `<button>` props
- **Visual spec:** Already CVA-defined in `components/ui/button.tsx` (see repo). Current sizes: `default` h-8 (32px), `lg` h-9 (36px). **Phase 2 adds `touch` h-11 (44px) variant** per FLAG-3 resolution below. `default` variant = `bg-primary text-primary-foreground` (will render navy/white after §1.4 override).
- **States (Phase 2 re-verifies):** default / hover (`hover:bg-primary/80`) / focus-visible (ring-3 with `--ring`, which maps to navy) / active (translate-y-px) / disabled (opacity-50, pointer-events-none) / aria-invalid (destructive border+ring)
- **A11y (FLAG-3 locked resolution):** Radix/shadcn default; Phase 2 verifies focus-ring is navy (not neutral); Tab reachable; Enter+Space trigger click. **Touch target policy:**
  - **`size='touch'` (h-11, 44×44px) is the DEFAULT for all marketing, conversion, and consumer-facing contexts** — every CTA on `/`, `/hk`, `/sg`, market homepages, programme pages, pricing, and contact forms (Phase 3+). Meets WCAG 2.2 AA touch-target minimum (44×44px).
  - `size='default'` (h-8, 32px) is reserved for **compact internal/admin contexts only** (e.g., Studio UI, dev tools, dense table rows inside `/studio`). NOT used on any consumer-facing surface.
  - `size='lg'` (h-9, 36px) is a visual emphasis option (hero primary CTA) — MUST be used with `min-h-11 min-w-11` classes if the clickable area is an icon-only button to satisfy touch target. When `lg` is text+icon, padding naturally brings target ≥44px.
  - `size='icon-sm'` / `size='icon-xs'` retain WCAG AA via `min-w-11 min-h-11` hit-area (visual icon smaller, touch target still 44px via transparent padding). Planner MUST verify via `pnpm test:e2e` / browser DevTools accessibility inspector on `/_design/`.
  - Phase 2 plan's Button audit task MUST (i) add the `touch` variant to `buttonVariants` CVA config, (ii) update `components/ui/button.tsx` type, (iii) demonstrate `touch` in `/_design/` Primitives section as the recommended marketing default.
- **Used by:** Every page from Phase 3 onward; `/_design/` §Primitives

### 3.2 Primitive — `Card`

- **Source:** `stock-cli` — `pnpm dlx shadcn@latest add card`
- **Category:** primitive
- **Required props:** Exported as `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`. Standard shadcn shape; accepts `className` + children.
- **Visual spec:** rounded-lg, border, bg-card (white post-override), shadow-sm on hover when used in interactive pattern
- **Anatomy:** `Card > [CardHeader > CardTitle + CardDescription] + CardContent + CardFooter`
- **States:** default / hover (consumer adds `hover:shadow-md`) / focus-within (when contains a focusable child)
- **A11y:** Semantic `<div>` by default — consumer supplies `<article>` / `<section>` where semantic emphasis matters
- **Used by:** MarketCard, ProgrammeTile, TestimonialCard composition base; root /brand page; /coaches pages

### 3.3 Primitive — `Accordion` (→ composed into `FAQItem`)

- **Source:** `stock-cli` — `pnpm dlx shadcn@latest add accordion`
- **Category:** primitive (accordion) + pattern (FAQItem composition)
- **Required props (shadcn):** `Accordion` (type: 'single' | 'multiple', collapsible), `AccordionItem` (value: string), `AccordionTrigger`, `AccordionContent`
- **Required props (FAQItem — new wrapper):** `{ question: string; answer: string | ReactNode; defaultOpen?: boolean; id?: string }` — wraps one `AccordionItem` with standardised typography (h3 `text-h3` for question, body copy `text-body` for answer) and the FAQPage schema-ready markup hooks (data attributes for Phase 7's JSON-LD)
- **Visual spec:** question in navy `font-display font-semibold text-h3`; chevron icon `lucide-react/ChevronDown` rotates 180° on open; answer in `text-body text-muted-foreground`
- **States:** collapsed (chevron down) / expanded (chevron up, content revealed) / focus-visible (ring on trigger) / hover (subtle navy text-primary darken)
- **A11y:** Radix Accordion primitive handles `aria-expanded`, `aria-controls`, keyboard (Space/Enter toggle, Arrow Up/Down between items, Home/End jump); touch target on trigger ≥44px (ensure `min-h-11 py-3`)
- **Used by:** Every FAQ section across HK/SG homepages (Phase 4/5), FAQ hubs (HK-11, SG-10), root gateway `/` section 7

### 3.4 Primitive — `Badge`

- **Source:** `stock-cli` — `pnpm dlx shadcn@latest add badge`
- **Category:** primitive
- **Required props:** `variant?: 'default' | 'secondary' | 'destructive' | 'outline'`, plus native span props
- **Visual spec:** inline-flex, rounded-md, px-2 py-0.5, text-small font-medium. `default` = bg-primary text-primary-foreground (navy on white). `secondary` = bg-secondary text-secondary-foreground (yellow fill + navy text — the canonical 8.80:1 pairing). `destructive` = bg-destructive/10 text-destructive. `outline` = border + text-foreground.
- **States:** static — no interactive states (badges are not clickable; use Button if clickable is needed)
- **A11y:** Decorative by default; when conveying status (e.g., "Ages 4-6"), consumer MUST either make it visible text (preferred) or add `aria-label` with the full context
- **Used by:** ProgrammeTile (age-band badge), upcoming-camp chip on hero, "Featured" tag on blog card, "Wan Chai" / "Cyberport" / "Katong Point" venue chips

### 3.5 Primitive — `Avatar`

- **Source:** `stock-cli` — `pnpm dlx shadcn@latest add avatar`
- **Category:** primitive
- **Required props (shadcn):** `Avatar` (container), `AvatarImage` (src, alt), `AvatarFallback` (children — initials). Sizes via className (`size-10 / size-12 / size-16`).
- **Visual spec:** rounded-full, object-cover image, fallback = `bg-muted text-muted-foreground` with uppercase initials `text-small font-medium`
- **States:** image-loaded / image-failed (fallback shown) / stacked (when inside AvatarGroup wrapper — not in Phase 2)
- **A11y:** `AvatarImage` requires non-empty `alt` describing the person (e.g., "Monica Hui, Director of Sports HK"); fallback is decorative + `aria-hidden="true"` (shadcn default)
- **Used by:** TestimonialCard, coach bio tiles (HK-09 / SG-08), footer author bylines

### 3.6 Primitive — `Separator`

- **Source:** `stock-cli` — `pnpm dlx shadcn@latest add separator`
- **Category:** primitive
- **Required props:** `orientation?: 'horizontal' | 'vertical'`, `decorative?: boolean`
- **Visual spec:** 1px line in `bg-border` (neutral-200 in Phase 2). Horizontal: `w-full h-px`. Vertical: `h-full w-px`.
- **States:** static — no interactive states
- **A11y:** `decorative={true}` (default in shadcn) renders as `role="none"`; when used to separate meaningful content groups (not purely visual), set `decorative={false}` to emit `role="separator"`
- **Used by:** Footer link groups, StatStrip inter-stat dividers (vertical orientation), section internal dividers

### 3.7 Custom pattern — `MarketCard`

- **Source:** `custom` — composed on `Card` + next/image + next/link
- **File:** `components/ui/market-card.tsx`
- **Category:** pattern
- **Required props:**
  ```ts
  interface MarketCardProps {
    market: 'hk' | 'sg';
    label: string;                 // e.g., "Hong Kong", "Singapore"
    tagline: string;               // e.g., "ProGym Wan Chai + Cyberport"
    href: string;                  // absolute URL to market subdomain
    imageSrc: string;              // path to processed photo in public/photography/
    imageAlt: string;              // required — photographer/subject detail
    priority?: boolean;            // true on root gateway (above-fold)
    className?: string;
  }
  ```
- **Visual spec:** Full-bleed photo fills 4:3 aspect ratio, navy-to-transparent gradient overlay bottom-up, `label` rendered in `text-display font-display text-white` at bottom-left with 32px padding, `tagline` below in `text-body text-cream`, subtle 1px white border, `rounded-xl overflow-hidden`. Hover: image `scale-105` over 400ms, gradient intensifies, arrow icon (`lucide-react/ArrowRight`) translates right 4px.
- **States:** default / hover (scale + arrow shift) / focus-visible (ring-3 ring-primary) / active (translate-y-px) / loading (skeleton bg-muted while image loads — next/image handles blur placeholder)
- **A11y:** `<Link>` wraps entire card — single clickable region, no nested `<a>` tags; `aria-label` = `${label} — ${tagline}`; image has required `alt`; keyboard Tab to focus, Enter to navigate; contrast of white-on-navy-gradient verified ≥7:1 on darkest gradient band
- **Used by:** Root gateway `/` dual-market entry (2× instance, hk + sg side-by-side on desktop, stacked on mobile) — Phase 3 GW-01

### 3.8 Custom pattern — `ProgrammeTile`

- **Source:** `custom` — composed on `Card` + `Badge` + next/image + next/link
- **File:** `components/ui/programme-tile.tsx`
- **Category:** pattern
- **Required props:**
  ```ts
  interface ProgrammeTileProps {
    title: string;                 // e.g., "Toddler Gymnastics"
    ageRange: string;              // e.g., "12 months – 3 years"
    description: string;           // 1-2 sentences, ≤140 chars
    imageSrc: string;
    imageAlt: string;
    href: string;
    duration?: string;             // optional — e.g., "45 min · weekly"
    className?: string;
  }
  ```
- **Visual spec:** Vertical card, 4:3 photo at top (rounded-t-xl), CardContent with `Badge variant="secondary"` for ageRange, `text-h3 font-display text-primary` for title, `text-body text-muted-foreground` description (line-clamp-2), optional duration in `text-small text-muted-foreground` with `lucide-react/Clock` icon. Full card clickable via `<Link>`.
- **States:** default / hover (shadow-md + image scale-105 + title text-brand-red) / focus-visible (ring-3 ring-primary) / active (translate-y-px)
- **A11y:** Same single-`<Link>`-wraps-card pattern as MarketCard; aria-label composed from title + ageRange; image alt required
- **Used by:** HK-04 gymnastics pillar (8 programme sub-pages), SG-03 weekly classes pillar, SG-04 Prodigy camps, HK-05 holiday camps

### 3.9 Custom pattern — `TestimonialCard`

- **Source:** `custom` — composed on `Card` + `Avatar`
- **File:** `components/ui/testimonial-card.tsx`
- **Category:** pattern
- **Required props:**
  ```ts
  interface TestimonialCardProps {
    quote: string;                 // the testimonial copy; wrap in visible " " marks
    author: string;                // e.g., "Sarah W."
    authorRole?: string;           // e.g., "Parent · HK"
    avatarSrc?: string;            // optional — falls back to initials
    avatarAlt?: string;            // required if avatarSrc is provided
    variant?: 'default' | 'pullquote';  // pullquote = large display-size quote, no card chrome
    className?: string;
  }
  ```
- **Visual spec:** `default` variant = bg-accent (cream) rounded-2xl p-6 lg:p-8, large `lucide-react/Quote` icon in text-brand-yellow at top-left size-8, quote in `text-body-lg font-sans text-foreground`, footer row: `Avatar size-10` + author name (`text-body font-semibold text-primary`) + role (`text-small text-muted-foreground`). `pullquote` variant = no card chrome, `text-h1 font-display text-primary` quote with a thin yellow left-border accent.
- **States:** default / hover (subtle translate-y-px on `default`, none on `pullquote`) — testimonials are not interactive; no focus states unless wrapped in a link
- **A11y:** Quote wrapped in `<blockquote>`; `<cite>` for author; if avatar image is provided, alt required; if no avatar, `AvatarFallback` receives `aria-hidden="true"` and initials are decorative
- **Used by:** Root `/` section 5 (social proof), HK homepage social proof strip, SG homepage trust row, coach bios (pullquote variant)

### 3.10 Custom pattern — `StatStrip`

- **Source:** `custom` — plain div + flex/grid layout
- **File:** `components/ui/stat-strip.tsx`
- **Category:** pattern
- **Required props:**
  ```ts
  interface StatStripProps {
    stats: Array<{
      value: string;               // e.g., "14", "3,500+"
      label: string;               // e.g., "Years coaching", "Children trained"
      suffix?: string;              // e.g., "years", "+"
    }>;
    variant?: 'default' | 'on-dark';  // on-dark for navy-surface sections
    className?: string;
  }
  ```
- **Visual spec:** Horizontal flex row on desktop (`lg:flex-row`), stacked on mobile (`flex-col gap-8 lg:gap-0`). Each stat block: `text-display font-display` value (navy on light, cream on dark) + `text-small font-medium uppercase tracking-wider text-muted-foreground` label. `Separator orientation="vertical"` between stats on desktop (`hidden lg:block`). Padding `py-section-sm lg:py-section-md`.
- **States:** static. Optional reveal-on-scroll count-up animation is **out of scope for Phase 2** (deferred to Phase 3+ needs — per CONTEXT.md "no animation token library").
- **A11y:** Values are visible text (not `<img>`); screen-reader reads "14 years coaching, 3 studios, 3500 plus children trained" in order; Separator is decorative
- **Used by:** Root homepage section 2 (trust numbers), HK homepage trust strip, SG homepage trust strip, /brand page history section

### 3.11 Custom pattern — `LogoWall`

- **Source:** `custom` — plain div + next/image grid
- **File:** `components/ui/logo-wall.tsx`
- **Category:** pattern
- **Required props:**
  ```ts
  interface LogoWallProps {
    logos: Array<{
      src: string;                 // path to monochrome SVG or PNG in public/logos/
      alt: string;                 // e.g., "International French School"
      href?: string;               // optional — external partner link
      width: number;
      height: number;
    }>;
    title?: string;                // optional section heading
    variant?: 'grid' | 'row';      // grid = 3-4 cols, row = horizontal scroll
    className?: string;
  }
  ```
- **Visual spec:** Optional title `text-small font-medium uppercase tracking-wider text-muted-foreground mb-6`. Grid variant: 2 cols on mobile, 4 cols on desktop, each logo in a cell with `grayscale opacity-60 hover:grayscale-0 hover:opacity-100` transition 200ms, max-height `h-10 lg:h-12`. Row variant: horizontal overflow-x-auto on mobile, flex row on desktop, same monochrome treatment.
- **States:** default (grayscale-muted) / hover (full colour, full opacity) / focus-visible (ring on linked logos)
- **A11y:** Every logo has required `alt`; if `href` provided, wrap in `<Link>`; if decorative-only (brand pride row with no partnership), alt MAY be empty string + `role="presentation"`, but the default should be descriptive alt
- **Used by:** Root gateway "Trusted by" row, HK /school-partnerships/, SG /school-partnerships/ (incl. IFS)

### 3.12 Layout wrapper — `Section`

- **Source:** `wrapper` — typed React component
- **File:** `components/ui/section.tsx`
- **Category:** layout-wrapper
- **Required props:**
  ```ts
  interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    as?: 'section' | 'article' | 'div';  // default 'section'
    size?: 'sm' | 'md' | 'lg';             // → py-section-sm/md/lg; default 'md'
    bg?: 'default' | 'muted' | 'navy' | 'cream';  // surface fill; default 'default'
    children: React.ReactNode;
  }
  ```
- **Visual spec:** Semantic element per `as` prop; vertical padding from section-spacing token; full-width background fill; children rendered directly (Section does NOT constrain horizontal width — that's ContainerEditorial's job)
- **States:** static
- **A11y:** `<section>` semantic element; consumer supplies `aria-labelledby` when the section contains a heading, per SEO-08 WCAG 2.2 AA Phase 7 anchor
- **Used by:** Every page from Phase 3+; the atomic layout primitive

### 3.13 Layout wrapper — `ContainerEditorial`

- **Source:** `wrapper` — typed React component
- **File:** `components/ui/container-editorial.tsx`
- **Category:** layout-wrapper
- **Required props:**
  ```ts
  interface ContainerEditorialProps extends React.HTMLAttributes<HTMLDivElement> {
    width?: 'narrow' | 'default' | 'wide';  // default 'default'
    // narrow = max-w-2xl (672px)    — blog post reading column
    // default = max-w-6xl (1152px)  — standard page content
    // wide = max-w-7xl (1280px)     — hero + full-bleed sections
    children: React.ReactNode;
  }
  ```
- **Visual spec:** `mx-auto px-4 md:px-8` + max-width per variant. Strategy §14.6: "Max content width 1280–1440px on desktop". `wide` = 1280px, rounded up to Tailwind's `max-w-7xl`.
- **States:** static
- **A11y:** `<div>` semantic neutral; consumer supplies semantic wrapping
- **Editorial-asymmetry guardrail:** ContainerEditorial does NOT force centered content. Consumer composes asymmetric layouts inside (e.g., `grid grid-cols-12 gap-6` with image in `col-span-7` and copy in `col-span-5 col-start-8`). See §7 for the full anti-AI-SaaS editorial checklist.
- **Used by:** Every page from Phase 3+

### 3.14 Media primitive — `<Image>` usage contract

- **Status:** Next.js 15 `next/image` (already available — no install). Phase 2 ships **documented defaults**, not a wrapper component.
- **Category:** media
- **`next.config.ts` required additions (Phase 2 plan task):**
  ```ts
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 85, 100],
    minimumCacheTTL: 2678400,
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  }
  ```
- **Sizing patterns (planner uses these verbatim at consumer sites):**
  - Hero / full-bleed: `fill sizes="100vw" priority className="object-cover"` — AND `fetchPriority="high"` (Next.js 16 forward-compat; 02-RESEARCH.md Pitfall 7)
  - MarketCard (root dual-market entry): `fill sizes="(max-width: 768px) 100vw, 50vw"` + `priority` (above fold on root)
  - ProgrammeTile: `fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"` — NOT priority (below fold)
  - TestimonialCard avatar: fixed size `size-10` — use `width={40} height={40}`
- **Placeholder:** `placeholder="blur"` with `blurDataURL` for hero + MarketCard images; omit for tiles (optimisation-for-LCP tradeoff)
- **Required props on every `<Image>`:** `alt` (non-empty string, describes content — NEVER decorative empty string in Phase 2 since all images are real content)
- **Used by:** Every primitive that renders a photograph

### 3.15 Media primitive — `VideoPlayer` (Mux shell — placeholder-content per D-06)

- **Source:** `custom` — wraps `@mux/mux-player-react` via `dynamic({ ssr: false })`
- **File:** `components/ui/video-player.tsx` (new — MUST carry `'use client'` directive)
- **Category:** media
- **Required props:**
  ```ts
  interface VideoPlayerProps {
    playbackId: string;              // Mux public playback ID (or PLACEHOLDER_PLAYBACK_ID in Phase 2)
    title: string;                   // video title for Mux metadata + ARIA
    poster?: string;                 // still-image poster path (strongly recommended)
    autoPlay?: boolean;              // default false; when true, enables muted+loop+playsInline for hero loops
    aspect?: 'video' | 'square' | 'portrait';  // default 'video' = 16:9
    className?: string;
  }
  ```
- **Placeholder playback ID for Phase 2:** `DS00Spx1CV902MCtPj5WknGlR102V5HFkDe` (Mux public demo stream per CONTEXT.md D-06). Define as `const PLACEHOLDER_PLAYBACK_ID` at the top of `video-player.tsx`. The `/_design/` gallery instance uses this ID. Phase 10 replaces it with real camp-clip IDs.
- **Visual spec:** Full-width within its container; aspect-video by default; rounded-xl overflow-hidden; poster image fills before hydration (prevents hydration-flash and CLS); Mux player chrome uses Mux's own styling (not re-themed in Phase 2).
- **`autoPlay` behavior (per strategy §14.5):** When `autoPlay={true}`: `muted={true}` + `loop={true}` + `playsInline={true}` (iOS requirement) + `autoPlay="muted"`. When `autoPlay={false}`: Mux's standard play-button chrome.
- **States:** poster-visible-pre-hydrate / hydrated (player chrome visible) / playing / paused / muted-autoplay
- **A11y:** Mux player ships native captions support via `<track>` — placeholder caption track is acceptable in Phase 2 (real captions per strategy §14.5 + SEO-08 are Phase 7 work); player is keyboard-navigable (Mux default); `title` prop used as accessible name; respect `prefers-reduced-motion` — autoplay suppressed when this media query matches (planner implements as a `useReducedMotion` hook or CSS equivalent in the wrapper)
- **SSR / hydration contract:** MUST use `dynamic(() => import('@mux/mux-player-react').then(m => m.default ?? m), { ssr: false })`. 02-RESEARCH.md Pitfall 3 explicit. The wrapping component itself is `'use client'`. The containing page may remain an RSC — only the `VideoPlayer` is a client boundary.
- **Used by:** `/_design/` §Media section (single placeholder instance with Mux demo ID); Phase 4/5 hero videos (Phase 10 swaps in real IDs)

### 3.16 Component inventory summary

| Component | File | Category | Source | Status | Gallery anchor |
|-----------|------|----------|--------|--------|----------------|
| Button | `components/ui/button.tsx` | primitive | stock-cli | EXISTS (Phase 1) | `#button` |
| Card | `components/ui/card.tsx` | primitive | stock-cli | NEW Phase 2 | `#card` |
| Accordion / FAQItem | `components/ui/accordion.tsx` + `faq-item.tsx` | primitive + pattern | stock-cli + custom | NEW Phase 2 | `#accordion` |
| Badge | `components/ui/badge.tsx` | primitive | stock-cli | NEW Phase 2 | `#badge` |
| Avatar | `components/ui/avatar.tsx` | primitive | stock-cli | NEW Phase 2 | `#avatar` |
| Separator | `components/ui/separator.tsx` | primitive | stock-cli | NEW Phase 2 | `#separator` |
| MarketCard | `components/ui/market-card.tsx` | pattern | custom | NEW Phase 2 | `#marketcard` |
| ProgrammeTile | `components/ui/programme-tile.tsx` | pattern | custom | NEW Phase 2 | `#programme-tile` |
| TestimonialCard | `components/ui/testimonial-card.tsx` | pattern | custom | NEW Phase 2 | `#testimonial-card` |
| StatStrip | `components/ui/stat-strip.tsx` | pattern | custom | NEW Phase 2 | `#stat-strip` |
| LogoWall | `components/ui/logo-wall.tsx` | pattern | custom | NEW Phase 2 | `#logo-wall` |
| Section | `components/ui/section.tsx` | layout-wrapper | wrapper | NEW Phase 2 | `#section` |
| ContainerEditorial | `components/ui/container-editorial.tsx` | layout-wrapper | wrapper | NEW Phase 2 | `#container-editorial` |
| `<Image>` contract | (no component — doc only) | media | — | DOCUMENTED | `#image` |
| VideoPlayer | `components/ui/video-player.tsx` | media | custom | NEW Phase 2 (shell only, placeholder ID) | `#video-player` |

**Total:** 14 primitives shipping in Phase 2 (1 existing + 5 stock CLI + 5 brand-custom + 2 layout-wrappers + 1 media shell). Within the "~10 primitives" bar declared by CONTEXT.md — the stock + custom split matches D-04 exactly.

---

## 4. `/_design/` Gallery Structure

### 4.1 Route + file

| Property | Value |
|----------|-------|
| Route | `/_design` (rendered at `app/_design/page.tsx`; ALSO needs `app/_design/layout.tsx` for the sticky sidebar shell) |
| Middleware | Passes through unchanged — Phase 1 middleware's matcher already excludes underscore-prefixed paths (CONTEXT.md D-09 explicit). Do NOT add `/_design` to middleware. |
| Production gating | `if (process.env.VERCEL_ENV === 'production') notFound();` at the top of `app/_design/page.tsx` (D-09) |
| Layered defences | (1) env-check + `notFound()` · (2) Phase 0 D-15 `X-Robots-Tag: noindex, nofollow` on non-prod · (3) Vercel Deployment Protection · (4) `/_design` path convention signals internal-use |

### 4.2 Page shape

Single scrollable page. **Sticky sidebar anchor nav on desktop (`lg:w-64 lg:fixed lg:top-0 lg:bottom-0`)**, collapsed to a mobile anchor chip row at top. Main content in `ContainerEditorial width="wide"` scrolls beneath.

```
app/_design/
  layout.tsx    — sticky sidebar nav shell + env-gate is HERE for single-source protection
  page.tsx      — all sections rendered in order (RSC by default; only VideoPlayer is a client island)
  _nav.tsx      — sidebar + mobile anchor chips ('use client' because it uses active-section intersection observer; IF intersection observer proves fragile at plan time, fall back to plain anchor links — planner decides)
```

### 4.3 Section order + anchors

```
┌────────────────────────────────────────────────────────────────┐
│  <h1>Phase 2 Design System — Gallery</h1>  ← page heading      │
│  <p>Last built: {date}</p>                                     │
│                                                                │
│  § Foundation          ← #foundation (anchor group)            │
│    - Colors             #colors                                │
│    - Typography         #typography                            │
│    - Spacing            #spacing                               │
│    - Radius & Shadow    #radius-shadow                         │
│                                                                │
│  § Primitives          ← #primitives (anchor group)            │
│    - Button             #button                                │
│    - Card               #card                                  │
│    - Accordion (FAQItem) #accordion                            │
│    - Badge              #badge                                 │
│    - Avatar             #avatar                                │
│    - Separator          #separator                             │
│                                                                │
│  § Patterns            ← #patterns (anchor group)              │
│    - MarketCard         #marketcard                            │
│    - ProgrammeTile      #programme-tile                        │
│    - TestimonialCard    #testimonial-card                      │
│    - StatStrip          #stat-strip                            │
│    - LogoWall           #logo-wall                             │
│    - Section            #section                               │
│    - ContainerEditorial #container-editorial                   │
│                                                                │
│  § Media               ← #media (anchor group)                 │
│    - <Image> contract   #image                                 │
│    - VideoPlayer        #video-player (Mux demo ID)            │
│                                                                │
│  § Footer              ← done-bar + version                    │
│    - "Done bar" (per D-05)                                     │
│    - Version / build date / git SHA                            │
└────────────────────────────────────────────────────────────────┘
```

### 4.4 Per-primitive section shape

Each primitive's section has this fixed shape (uniform for cognitive ease — but **content is real**, not a variant matrix):

```
<Section as="article" id="{anchor}" size="sm">
  <ContainerEditorial width="wide">
    <header>
      <h2 className="text-h2">{PrimitiveName}</h2>
      <p className="text-body text-muted-foreground">{one-sentence purpose}</p>
    </header>

    {/* ONE real-photo example (D-05 "done bar") */}
    <div className="my-8">
      <{Primitive} {...realProps} />
    </div>

    <footer className="text-small text-muted-foreground">
      <p>Source: <code>components/ui/{file-name}.tsx</code></p>
      <p>Used by: {consumer-list}</p>
      <details>
        <summary>Props</summary>
        <pre><code>{typescript-interface}</code></pre>
      </details>
    </footer>
  </ContainerEditorial>
</Section>
```

**No variant matrices.** No state galleries. No "here are 9 Button variants in a 3×3 grid". D-05 is literal — one example per primitive, rendered against real photography where the primitive accepts an image slot; against static copy where it doesn't.

### 4.5 Foundation sections (non-component)

- `#colors`: 7 brand swatches rendered as 160×160px blocks with hex + HSL triplet + oklch values below each; contrast-audit table from §1.3 inline below
- `#typography`: full scale rendered as live text — "Display · 88px · Bloc Bold" sample, then h1, h2, h3, body, small, label samples; each showing the exact CSS utility class
- `#spacing`: horizontal bars rendered at 4 / 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128 px widths with labels
- `#radius-shadow`: six square tiles with increasing border-radius; four tiles showing each shadow level

### 4.6 Footer "done bar" (D-05 binding)

```md
## Done bar
This gallery proves every Phase 2 primitive against one real ProActiv photograph,
passes keyboard navigation (Tab through every interactive element), and passes
WCAG AA contrast (verified via Lighthouse accessibility audit ≥ 95).

Variant matrices, state galleries, and Storybook-style documentation are
deliberately deferred — Phase 3+ discovers variant needs from real page context
and adds them then.

Built: {git-sha}
Last verified: {ISO-date}
Phase 2 spec: .planning/phases/02-design-system-component-gallery-media-pipeline/02-UI-SPEC.md
```

### 4.7 Env-gate implementation (exact pseudocode — D-09 binding)

```tsx
// app/_design/page.tsx
import { notFound } from 'next/navigation';
// ...imports for all primitives + real-photo paths

export const dynamic = 'force-static';  // gallery is fully static; force pre-render

export default function DesignGallery() {
  // D-09: production lockout
  if (process.env.VERCEL_ENV === 'production') {
    notFound();
  }

  return (
    <main>
      {/* Foundation → Primitives → Patterns → Media → Footer (see §4.3) */}
    </main>
  );
}

export const metadata = {
  title: 'Phase 2 Design System — Internal',
  robots: { index: false, follow: false },  // belt + braces (Phase 0 already sets X-Robots-Tag)
};
```

**Verification test (planner adds to the Phase 2 Vitest suite):** render the component with `process.env.VERCEL_ENV = 'production'` mocked and assert `notFound()` is called.

---

## 5. Media Pipeline Contracts

### 5.1 Photography staging + processed output (D-07 binding)

| Location | Git status | Purpose |
|----------|------------|---------|
| `/Users/martin/Downloads/ProActive/01 - PHOTOS to use/` (and related per MEDIA-INVENTORY.md) | Local-only (never committed) | Raw 22 GB source library. Martin reviews, selects 10–15 hero-tier. |
| `.planning/inputs/curated-hero-photos/` | **Gitignored (new Phase 2 ignore entry)** | Staging: user-curated originals (any format: JPG/PNG/HEIC/TIFF — Sharp accepts all). 10–15 files total. |
| `public/photography/*.avif`, `*.webp`, `*.jpg` | **Committed** | Processed, responsive, web-ready. Output of `pnpm photos:process`. |

**Required curation coverage (martin provisions BEFORE Phase 2 execute — HUMAN-ACTION precondition):**
1. Root gateway hero (1 photo)
2. HK venues (2–3 photos: Wan Chai + Cyberport + optional)
3. SG Prodigy / Katong (1–2 photos)
4. Programmes in action, different age groups (3–5 photos)
5. Testimonial / parent scenes (1–2 photos)

**Naming convention:** Original filenames get slugified by the script. `IMG_2341.jpg` → `public/photography/img-2341.{avif,webp,jpg}`. Martin CAN rename before dropping (e.g., `wan-chai-beam-class.jpg`) for editorial clarity — the script preserves renames.

### 5.2 Sharp preprocessing script contract (`scripts/process-photos.mjs`)

| Property | Value |
|----------|-------|
| Runtime | Node.js 22 ESM (`.mjs`) — matches `engines.node` pin |
| Input | `.planning/inputs/curated-hero-photos/**/*.{jpg,jpeg,JPG,JPEG,png,PNG,heic,HEIC,tiff,TIFF}` |
| Output root | `public/photography/` |
| Widths | `[640, 1024, 1920]` — matches Next.js `deviceSizes` lower band |
| Output filename pattern | `{slug}-{width}w.{ext}` — e.g., `wan-chai-beam-class-640w.avif`, `-1024w.webp`, `-1920w.jpg` |
| Formats + quality | AVIF q=70 · WebP q=80 · JPG q=85 (JPG is the fallback; all three emitted per width) |
| On error | **Fail fast** — exit non-zero on first image error; do NOT continue silently |
| Summary output | `N files processed · {avif total bytes} · {webp total bytes} · {jpg total bytes} · {% reduction vs source}` |
| `package.json` script | `"photos:process": "node scripts/process-photos.mjs"` |
| Build-time safety | Script is LOCAL ONLY — never invoked during `next build` (02-RESEARCH.md Pitfall 4) |

**Sharp version:** `pnpm add -D sharp` (latest stable). sharp@0.33+ (current) has AVIF quality-70 as a sweet spot per 02-RESEARCH.md Topic 4.

**Note on "slug" in naming:** The script uses a simple slugify (lowercase, hyphens, strip non-alphanumeric). Consumers reference the output as `<Image src="/photography/wan-chai-beam-class-1920w.jpg" />` — BUT the Next.js Image component's `sizes` prop + `srcset` logic handles per-width selection automatically. Consumers only reference ONE width in `src` (the largest); Next.js Image at render time + Vercel image optimization emit the responsive set. The Sharp preprocessing is a belt-and-braces reduction of the original file size BEFORE Vercel's optimizer gets it — cumulative gain.

**Alternative simpler contract (planner decides at plan time):** single output `public/photography/{slug}.{avif,webp,jpg}` at ONE width (1920px max), and rely entirely on Next.js `<Image>` + Vercel for responsive variants. This is simpler and satisfies the 02-RESEARCH.md Topic 4 primary recommendation. The multi-width output is belt-and-braces for pre-commit file-size caps.

> **Planner choice:** Recommend single-width (1920px) output from Sharp + let Next.js handle responsive. Rationale: less complexity, cleaner `public/photography/` dir (3 files per source: avif + webp + jpg), Vercel image optimization is already the primary serving path, Sharp preprocessing is only for "don't commit a 14 MB PNG". If a plan author picks multi-width, document why in the plan body.

### 5.3 `next.config.ts` image config (planner task in Phase 2)

```ts
// next.config.ts (additions; preserve existing Phase 1 Turbopack + transpilePackages config)
const nextConfig = {
  // ...existing Phase 1 config
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 85, 100],
    minimumCacheTTL: 2678400,  // 31 days
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/**' },
    ],
  },
};
```

### 5.4 VideoPlayer Mux contract (D-06 binding — placeholder-only in Phase 2)

See §3.15 for the full contract. Summary:

| Dimension | Phase 2 value | Phase 10 evolves |
|-----------|---------------|------------------|
| Playback ID | `DS00Spx1CV902MCtPj5WknGlR102V5HFkDe` (Mux public demo) | Real ProActiv camp-clip playback IDs |
| Mux account | **NONE** — Phase 2 does not sign up | Required |
| Policy | Public (demo stream is public) | Decision: public vs signed (Phase 10 D-TBD) |
| Caption track | Absent (Mux demo has none) | Real captions for each clip (SEO-08 / Phase 7) |
| `dynamic + ssr: false` | Required | Unchanged |
| Shipped to production | No (only `/_design` renders it in Phase 2; production `_design` is 404'd per D-09) | Yes, across HK/SG hero surfaces |

**ROADMAP SC #3 amendment (per CONTEXT.md D-06):** Phase 2 SC #3 is *"VideoPlayer renders on desktop + mobile without hydration errors + the Mux demo stream plays"*. The "plays a real camp clip" bar moves to Phase 10.

---

## 6. Copywriting Contract

Phase 2 is a design-system phase. `/_design/` needs minimal copy. Real marketing copy (PART 6 voice) lands in Phase 3+.

**Voice for `/_design/` (derived from strategy §14.3 + PART 15.1):** confident, brand-led, plain. No marketing-speak on the gallery. The gallery is for developers and the client team auditing the system; it should read as a spec document rendered, not a pitch.

| Element | Copy |
|---------|------|
| Primary CTA (gallery has none — this is an internal spec doc) | **Not applicable.** The `/_design/` gallery has no marketing CTAs. Button primitive example uses label `"Book a free trial"` (prefigures Phase 3+ real CTA — strategy §1 core-value) and `"Enquire"` + `"WhatsApp"` as secondary/ghost examples. NONE are wired to real handlers in Phase 2; all are no-ops. |
| Empty state (FAQItem example copy) | Question: `"What ages do you teach?"` Answer: `"We coach children from 12 months to 16 years across our Hong Kong and Singapore venues. Every programme is built around the right progression for the age group."` |
| Error state | Not applicable in Phase 2 `/_design/`. Existing `app/global-error.tsx` (Phase 0) is unchanged. |
| Destructive confirmation | Not applicable — no destructive actions in `/_design/`. The `Button variant="destructive"` primitive example uses label `"Delete enquiry"` purely for visual demonstration. |

### 6.1 Sample copy per primitive (executor uses verbatim)

- **Button example:** Primary `"Book a free trial"` · Secondary `"Enquire"` · Ghost `"WhatsApp us"` · Destructive `"Delete enquiry"` · Outline `"Learn more"` · Link `"Read the coaching philosophy"`
- **Badge example:** `"Ages 4–6"` (secondary variant) · `"Featured"` (default/navy) · `"New"` (destructive — red for urgency, per strategy §14.1 tertiary rule) · `"Wan Chai"` (outline)
- **Accordion / FAQItem example:** Question `"What should my child wear?"` Answer `"Comfortable athletic wear they can move freely in — leotards, leggings, or t-shirt and shorts. No shoes on the gym floor. Long hair tied back. We'll take care of the rest."`
- **Avatar example:** alt `"Monica Hui, Director of Sports (Hong Kong)"` — fallback initials `"MH"`
- **MarketCard examples:** (Card 1) label `"Hong Kong"`, tagline `"ProGym Wan Chai & Cyberport"`, alt `"Children in a gymnastics class at ProGym Wan Chai"`. (Card 2) label `"Singapore"`, tagline `"Prodigy @ Katong Point — Singapore's only MultiBall wall"`, alt `"A coach guiding a child on the MultiBall wall at Prodigy Katong"`.
- **ProgrammeTile example:** title `"Toddler gymnastics"`, ageRange `"12 months – 3 years"`, description `"Parent-and-child classes building confidence, balance, and joy of movement from the earliest age."`, duration `"45 min · weekly"`, alt `"Parent and toddler on a soft beam at ProGym Wan Chai"`.
- **TestimonialCard example:** quote `"We tried three other schools before ProActiv. Monica and the team saw my daughter for who she is — that's the difference."`, author `"Sarah W."`, authorRole `"Parent · Hong Kong"`, avatarAlt `"Portrait of Sarah W., parent"`.
- **StatStrip example:** `[{ value: "14", label: "Years coaching" }, { value: "3", label: "Venues across HK & SG" }, { value: "3,500+", label: "Children trained" }]` — values are real-ish (per PROJECT.md "founded in Hong Kong in 2011" → 14 years by 2026; 3 venues confirmed); executor verifies against strategy §PART 1/2 before committing.
- **LogoWall example:** 4 monochrome school partner logos — labels like `"International French School"`, `"Singapore American School"` — Martin provisions the SVGs at `public/logos/*.svg` before Phase 2 execute (HUMAN-ACTION precondition like D-02 fonts); if logos are missing, gallery renders placeholder grey blocks with partner names as visible text and a note: `"Partner logos pending — contact CMS owner."`

### 6.2 Page title for `/_design/`

`<title>` = `"Phase 2 Design System — Internal (ProActiv)"` · `metadata.robots = { index: false, follow: false }` (redundant with Phase 0 `X-Robots-Tag`, belt-and-braces).

---

## 7. Editorial Asymmetry + Anti-"AI SaaS" Guardrails (Strategy §14.3 binding)

Ref: strategy.md §PART 14.3 "Visual direction (avoiding the 'AI site' look)". These are the checks `gsd-ui-checker` runs against any Phase 2+ design output. Every primitive example in `/_design/` MUST pass these guardrails. Every Phase 3+ page built on these primitives MUST pass them.

### 7.1 AVOID (flag these patterns as failures)

| Pattern | How to detect |
|---------|---------------|
| Centre-aligned hero with a huge gradient blob | Any `.hero` / section 1 with `items-center text-center` + CSS gradient of purple→blue, blue→pink, or cyan→purple |
| Purple-to-blue gradients anywhere | Colour scan for purple (`#7c3aed`, `#8b5cf6`, indigo-500 class family) combined with any blue |
| Identical three-column "features" rows with round-icon tiles | 3-col grid of identical cards, each topped with a `rounded-full` icon in a muted chip |
| Stock photography of children who aren't real ProActiv students | All images MUST trace to `public/photography/` which came from the curated Martin-selected set |
| Ghost-button CTAs in light-grey outlines as primary CTA | Primary CTA MUST be `variant="default"` (navy fill) — NEVER `variant="outline"` with neutral border as the only CTA |
| Generic Lottie animations of bouncing dots | No Lottie assets in Phase 2 at all |
| Uniform card grids for every section | Every page MUST have at least TWO different layout patterns (e.g., grid + split-screen + horizontal-scroll — never all the same) |

### 7.2 DO INSTEAD (these are positive signals)

| Pattern | How to verify |
|---------|---------------|
| Editorial asymmetry (image one side, copy the other, varied per section) | At least one section on every page uses a `grid-cols-12` with image in `col-span-7` + copy in `col-span-5 col-start-8` (or mirror). Not every section centered. |
| Real photography of real coaches and real children | `<Image src="/photography/...">` references the D-07 curated set, not stock services |
| Motion as delight, not decoration | Hover transitions ≤300ms (`transition-all duration-200` or `300`); `prefers-reduced-motion: reduce` disables them; no entrance animations on static content |
| Confident type scale (H1 72–96px desktop) | §1.6 type scale: `display` = 88px desktop, `h1` = 56px — both pass. "Don't fear big type" — executor MUST NOT downscale display/h1 without explicit plan-level justification |
| Brand voice in microcopy | Primary CTA = `"Book a free trial"` (imperative + "free"), not `"Get started"`. Contact CTA = `"Come say hi"` (strategy §14.3 explicit example). |

### 7.3 `/_design/` gallery itself MUST demonstrate editorial asymmetry

The gallery page MUST NOT be a uniform card grid of primitives. Instead:
- Foundation section: **full-bleed colour swatches** with large hex labels underneath (not a grid of centred chips)
- Typography section: **left-aligned full-width samples** at their real rendered sizes (not mini previews in a grid)
- Primitives section: **asymmetric layout** — a wide content column with the example primitive on the left (col-span-8) and the props/metadata on the right (col-span-4) — or mirror per primitive
- Patterns section: each pattern rendered **at a realistic page-context width** (not thumbnail-size previews)
- Media section: VideoPlayer shown at `aspect-video` full-width

This is the gallery *teaching the pattern by living it*. A gallery that falls into uniform grid itself cannot enforce anti-SaaS on consumer pages.

---

## 8. Decisions Locked — Binding to UI-SPEC Sections

Each of the 9 user-locked decisions from CONTEXT.md `<decisions>` → where it's encoded here.

| Decision | What it locks | Encoded in UI-SPEC sections |
|----------|---------------|-----------------------------|
| **D-01** Bloc Bold + Mont licensed; Baloo OFL-free | Three-family stack is viable; no font-alternative decision deferred | §1.7 font stack (font family table); §2 Font row |
| **D-02** Martin provisions WOFF2 at `assets/brand/fonts/` (D-02 drop zone) before execute; `app/fonts.ts` consumes via relative path `../assets/brand/fonts/*`; precondition task returns HUMAN-ACTION if any file missing | Font-wiring task has an upfront file-existence gate; no file copy step required | §1.7 "File-provisioning precondition" block + "How next/font/local consumes these files" block |
| **D-03** Baloo scoped to ProGym contexts ONLY (HK Wan Chai + Cyberport + ProGym-branded surfaces) | `--font-accent` is declared globally but applied per-route; root/SG/legal use only `--font-sans` | §1.7 "Scoping enforcement for Baloo" block |
| **D-04** Stock shadcn where possible (Card, Accordion, Badge, Avatar, Separator) + custom (MarketCard, ProgrammeTile, TestimonialCard, StatStrip, LogoWall) + typed wrappers (Section, ContainerEditorial) | Component inventory structure | §3 entire component inventory — Source column = stock-cli / custom / wrapper split |
| **D-05** "Done" bar = each primitive renders ONCE with real photo + keyboard nav + WCAG AA; no variant matrices | Gallery section shape is fixed at "one example per primitive" | §4.4 per-primitive section shape; §4.6 footer done-bar copy |
| **D-06** Video DEFERRED to Phase 10 — Phase 2 ships VideoPlayer SHELL with placeholder Mux demo ID only | VideoPlayer primitive contract uses placeholder; ROADMAP SC #3 amended | §3.15 VideoPlayer primitive; §5.4 Mux contract table; §9 out-of-scope |
| **D-07** Martin curates 10–15 hero photos upfront into `.planning/inputs/curated-hero-photos/` (gitignored) before execute; Sharp processes to `public/photography/` | Media pipeline contract has an upfront curation gate; coverage requirements enumerated | §5.1 photography staging table + curation coverage list |
| **D-08** Single scrollable gallery page at `app/_design/page.tsx` with sticky sidebar anchor nav | Gallery IA is single-scroll, not multi-route | §4.1 route; §4.2 page shape; §4.3 section order + anchors |
| **D-09** Env-gating via `notFound()` on `VERCEL_ENV === 'production'`; no middleware change | Production lockout is code-level, not config-level | §4.1 gating table; §4.7 exact pseudocode |

---

## 9. Out of Scope — Phase 2 DEFERRED (checker reads this to avoid false-flagging)

Mirrors CONTEXT.md `<deferred>`. None of these are checker-blockers for Phase 2.

| Deferred item | Moves to | Why not in Phase 2 |
|---------------|----------|---------------------|
| Real Mux video integration (account, playback IDs, captions, public-vs-signed decision) | Phase 10 | D-06 — Phase 2 ships primitive shell only |
| Dark mode tokens (`.dark { ... }` layer with brand values) | Phase 7+ (SEO/UX audit) — or never if analytics don't demand it | CONTEXT.md Claude's Discretion — light-mode only token system in Phase 2 |
| Variant matrices + Storybook-style gallery expansion (per-primitive sub-pages showing all variants × sizes × states) | Phase 2.1 (decimal insert) or Phase 3+ discovery | D-05 — Phase 3+ discovers variants from real page needs |
| Photography credit / caption display | Phase 3+ page-level concern | Not a primitive concern |
| Empty-photo-slot placeholder strategy for primitives (skeleton? solid block?) | Phase 3+ page-level concern | Phase 2 primitives fail visibly if `src` is invalid |
| 22 GB bulk raw-photo processing | Never — rejected as over-engineered | D-07 — only curated 10–15 process in Phase 2 |
| RTL + jsdom component tests for primitives | Planner picks at plan time (add now or defer to Phase 7 SEO/a11y pass) | Phase 1 D-15 scope split; not gated on user input |
| Icon library expansion beyond `lucide-react` | Phase 3+ if a page needs a sport-specific icon outside Lucide | Lucide covers Phase 2 examples |
| Photo credit metadata baked into file EXIF | Phase 3+ or never | Not a primitive concern |
| Brand-tinted shadow palette (navy-tinted shadow-lg etc.) | Phase 3+ if needed by hero surfaces | CONTEXT.md Claude's Discretion — default shadcn shadows fine for Phase 2 |
| Sanity image pipeline for CMS-uploaded hero images (cdn.sanity.io remote pattern) | CONFIGURED in Phase 2 `next.config.ts` but USED in Phase 6 | Phase 6 adds actual CMS-uploaded images; Phase 2 just enables the remotePattern |

---

## 10. Requirement Traceability (DS-01 … DS-06 → UI-SPEC sections)

Every requirement from REQUIREMENTS.md assigned to Phase 2 must map to at least one UI-SPEC section. Checker uses this table to detect gaps.

| Req | REQUIREMENTS.md wording | Encoded in UI-SPEC sections |
|-----|--------------------------|-----------------------------|
| **DS-01** Tailwind config with brand tokens — primary `#0f206c`, accent `#ec1c24`, secondary green/sky/yellow/cream | §1.1 layering order · §1.2 brand palette · §1.3 contrast audit · §1.4 semantic token mapping · §1.5 `@theme { }` additions |
| **DS-02** Typography: Bloc Bold / Mont / Baloo — self-hosted, preloaded, no Google Fonts CLS | §1.6 type scale · §1.7 font stack (file-provisioning + scoping) |
| **DS-03** Primitive components: Button, Card, Section, ContainerEditorial, MarketCard, ProgrammeTile, TestimonialCard, FAQItem, LogoWall, StatStrip | §3 component inventory (all 10 named requirements + supporting primitives Avatar, Badge, Accordion, Separator + VideoPlayer + Image contract) |
| **DS-04** Image pipeline (Sharp → AVIF/WebP, responsive `<Image>`), video via Mux player | §3.14 `<Image>` contract · §3.15 VideoPlayer shell · §5.1 photography staging · §5.2 Sharp script · §5.3 next.config · §5.4 Mux contract |
| **DS-05** Component gallery (`/_design/` gated to dev/preview) showing every primitive in real ProActiv photography context | §4 entire gallery structure (route, page shape, section order, per-primitive shape, done-bar, env-gate) |
| **DS-06** Visual direction conforms to strategy §14.3 (editorial asymmetry, real photography, confident type) — not "AI SaaS" | §7 editorial asymmetry + anti-AI-SaaS guardrails — binding AVOID / DO INSTEAD tables |

All 6 requirements encoded. Zero gaps.

---

## 11. Design Quality Checklist — Six pillars for `gsd-ui-checker`

Binding quality dimensions. Every Phase 2 plan MUST satisfy all six before the plan can be closed.

### Pillar 1 — Typography (hierarchy, CLS, weight provisioning)

- [ ] Bloc Bold / Mont / Baloo self-hosted via `next/font/local`, NOT from Google Fonts CDN
- [ ] `display: 'swap'` + `adjustFontFallback: 'Arial'` on all three families (pitfall 2)
- [ ] `<html>` has all three `variable` classNames attached (prevents FOUC)
- [ ] `assets/brand/fonts/` directory exists (D-02 drop zone) and WOFF2 files present for every weight declared in §1.7; `app/fonts.ts` references via `'../assets/brand/fonts/…'` relative paths
- [ ] **Lighthouse CLS on `/_design/` = 0.0** (SC #2 from ROADMAP + DS-02)
- [ ] Type scale from §1.6 is exposed via Tailwind utilities (not inline style)
- [ ] Baloo applied ONLY inside ProGym-scoped containers (D-03) — verifiable by grepping for `--font-accent` usage

### Pillar 2 — Colour system (WCAG AA per pairing)

- [ ] All 7 brand hex values declared in `@theme { }` as `--color-brand-*`
- [ ] `:root { }` values match §1.4 table exactly (oklch values — preserve Phase 1's oklch choice)
- [ ] Every colour-on-colour pairing used in any primitive passes §1.3 contrast table — yellow is never text on white, sky is never text on white, red is never body-text on white
- [ ] Dark mode NOT defined (deferred)
- [ ] `bg-primary` renders navy (not neutral — verify in `/_design/` after override)
- [ ] No raw hex in any component file — `grep -r "#[0-9a-fA-F]\{6\}" components/ui/` returns empty (raw hex allowed ONLY in `app/globals.css`)

### Pillar 3 — Spacing & rhythm (section scale used consistently)

- [ ] `--spacing-section-sm / md / lg` = 4rem / 6rem / 8rem declared
- [ ] Every `<Section>` instance in `/_design/` uses a size prop (not ad-hoc `py-*` utilities)
- [ ] All other spacing is a multiple of 4 (§1.8 scale — except documented 44px touch-target exception)
- [ ] Editorial asymmetry detectable in gallery (§7.3) — not a uniform grid of primitive cards

### Pillar 4 — Component consistency (tokens everywhere)

- [ ] Every primitive file uses `cn()` from `@/lib/utils` (consistency with Phase 1's Button)
- [ ] Every primitive uses semantic tokens (`bg-primary`, `text-muted-foreground`) OR brand tokens (`bg-brand-navy`) — NEVER raw hex
- [ ] Every custom primitive has a typed `interface` for its props (§3.7 onwards — TypeScript strict)
- [ ] CVA used for any component with 2+ visual variants (Button precedent)

### Pillar 5 — Accessibility (keyboard, ARIA, focus, touch)

- [ ] All interactive primitives reachable by Tab in DOM order
- [ ] Focus ring visible on every primitive (`focus-visible:ring-3 focus-visible:ring-ring` — ring colour = `--ring` = navy)
- [ ] Accordion keyboard: Space/Enter toggle, Arrow Up/Down navigate, Home/End jump (Radix default — verified)
- [ ] Touch targets ≥44×44px on every tap target (see §3.1 Button touch-target note — planner resolves)
- [ ] Every `<Image>` has non-empty descriptive `alt`
- [ ] VideoPlayer respects `prefers-reduced-motion` (no autoplay when reduced-motion media query matches)
- [ ] `/_design/` Lighthouse accessibility score ≥95 — run AFTER all primitives land (SC #1 alignment with D-05)

### Pillar 6 — Performance (LCP, CLS, INP testable on /_design/)

- [ ] `/_design/` Lighthouse mobile Performance ≥95 (PROJECT.md budget)
- [ ] LCP <2.5s, CLS <0.1, INP <200ms on `/_design/` mobile throttled run
- [ ] All primitive photos loaded via `next/image` (never raw `<img>`)
- [ ] Hero-tier MarketCard examples use `priority` / `fetchPriority="high"` + `placeholder="blur"`
- [ ] Sharp preprocessing confirmed LOCAL ONLY (not invoked from `next build` — 02-RESEARCH.md Pitfall 4)
- [ ] `@mux/mux-player-react` loaded via `dynamic + ssr: false` (Pitfall 3)
- [ ] Font files served from `assets/brand/fonts/` (referenced via `app/fonts.ts` relative imports) with `preload: true` — Next.js rewrites them to `/_next/static/media/*.woff2` at build time

---

## 12. Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official (`https://ui.shadcn.com/`) | `button` (EXISTS Phase 1), `card`, `badge`, `accordion`, `separator`, `avatar` | not required (first-party registry) |
| `@mux/mux-player-react` (npm, not shadcn) | `MuxPlayer` via `@mux/mux-player-react` dynamic import | Not a shadcn registry — normal npm dep audit; Phase 1 pattern is to add to `transpilePackages` in `next.config.ts` if webpack/turbopack interop issues arise |
| third-party shadcn registries (tremor, aceternity, magicui, etc.) | **NONE** — Phase 2 does not use any | n/a — if a future phase introduces one, `npx shadcn view {block} --registry {url}` vetting gate per `gsd-ui-researcher` protocol MUST run first |

`components.json.registries` stays as the empty object `{}` set in Phase 1 Plan 01-02 (first-party-only lock). Phase 2 does NOT edit this field.

---

## 13. Phase 3+ Hand-off Notes

> For the next UI researcher (Phase 3 root gateway), not the Phase 2 checker.

1. **Token contract is frozen at end of Phase 2.** Phase 3 consumes `--primary / --secondary / --accent / --muted / --brand-*` + `--font-display / --font-sans / --font-accent` + `--spacing-section-*` + the type scale. If Phase 3 needs a new token, the Phase 3 UI-SPEC MUST extend §1 explicitly — no ad-hoc additions in component files.
2. **Primitive surface is the full set in §3.16.** Phase 3 composes, does not invent. If Phase 3 needs a new primitive (e.g., `BlogCard`), the Phase 3 UI-SPEC documents it with the same rigor as §3 here.
3. **Real photography pipeline is open.** Phase 3 adds more photos → drop into `.planning/inputs/curated-hero-photos/` + re-run `pnpm photos:process`. Sharp script is additive, not destructive.
4. **VideoPlayer placeholder persists through Phase 3–9.** Only Phase 10 swaps in real Mux IDs. Phase 3 hero videos render the Mux demo stream or a local poster image with `autoPlay={false}`.
5. **Route-group stripes (Phase 1) are removed by the first real page in each market.** Phase 3 removes the root stripe. Phase 4 removes HK. Phase 5 removes SG.
6. **Baloo activation pattern (D-03) is Phase 4's concern.** Phase 2 declares the variable + documents the pattern; Phase 4 wires `baloo.variable` to HK ProGym-scoped layouts (Wan Chai + Cyberport). Phase 3 / SG / legal NEVER opt in.

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: — (pending gsd-ui-checker review)
- [ ] Dimension 2 Visuals: —
- [ ] Dimension 3 Color: —
- [ ] Dimension 4 Typography: —
- [ ] Dimension 5 Spacing: —
- [ ] Dimension 6 Registry Safety: —
- [ ] Pillar 1 Typography CLS/hierarchy: —
- [ ] Pillar 2 Colour WCAG AA: —
- [ ] Pillar 3 Spacing/rhythm: —
- [ ] Pillar 4 Component consistency: —
- [ ] Pillar 5 Accessibility: —
- [ ] Pillar 6 Performance: —
- [ ] §7 Editorial asymmetry guardrails pass: —
- [ ] §10 all 6 requirements traced: —

**Approval:** pending (gsd-ui-checker, Phase 2 scope)

---

*Phase: 02-design-system-component-gallery-media-pipeline*
*Created 2026-04-23 by gsd-ui-researcher consuming 02-CONTEXT.md (9 locked decisions) + 02-RESEARCH.md (7 topics, 7 pitfalls) + PROJECT.md palette + strategy §PART 14.*
*All 6 requirements (DS-01..DS-06) addressed. All 9 user decisions (D-01..D-09) encoded.*

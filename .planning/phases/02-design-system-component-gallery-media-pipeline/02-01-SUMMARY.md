---
phase: 02
plan: 01
subsystem: design-system / tokens
tags: [design-tokens, tailwind, css, brand, oklch, phase-2]
requires:
  - app/globals.css (Phase 1 Plan 01-02 shadcn neutral baseline)
provides:
  - Tailwind v4 brand utilities (bg-brand-{navy,red,green,sky,yellow,cream}, text-brand-*, border-brand-*, ring-brand-*)
  - Tailwind v4 spacing utilities (py-section-{sm,md,lg}, mt/mb/gap variants auto-generated)
  - Tailwind v4 font utilities (font-display, font-sans, font-accent) with Arial fallback
  - shadcn semantic mappings: --primary=navy, --secondary=yellow, --accent=cream, --muted=cream,
    --destructive=brand red, --ring=navy, --foreground=navy, --primary-foreground=white
affects:
  - downstream Plan 02-02 (next/font/local must declare variable= names: --font-bloc, --font-mont, --font-baloo)
  - downstream Plan 02-04 (custom primitives) — substrate for token-only class rule
  - downstream Plan 02-06 (gallery) — Foundation tab visual proofs depend on these tokens
tech-stack:
  added: []
  patterns:
    - "Tailwind v4 @theme { } namespace declaration (vs older @theme inline { } binding-table aliasing)"
    - "shadcn :root oklch override (preserves Phase 1 oklch format; no HSL downgrade)"
    - "next/font/local handshake via nested var() fallback in --font-display/--font-sans/--font-accent"
key-files:
  created: []
  modified:
    - app/globals.css
decisions:
  - "Brand @theme block inserted BETWEEN @custom-variant dark and the existing @theme inline { } binding table — not above the binding table's brace, but as a separate sibling block. Tailwind v4 merges multiple @theme blocks into one namespace at compile time."
  - "Font tokens declared with nested var() chain (var(--font-bloc, \"Arial\", \"Helvetica Neue\", system-ui, sans-serif)) so font-display utility class resolves to Arial RIGHT NOW — Plan 02-02 will set --font-bloc via next/font/local on <html>, and the cascade replaces the fallback transparently. Prevents broken-cascade bug if plans land in non-strict order."
  - "Pitfall 1 (RESEARCH.md) avoided — no --color-*: initial used. Tailwind v4 default palette (slate, zinc, etc.) is preserved alongside the brand additions for any Phase 1 placeholder utilities still in use (e.g., bg-amber-400 in app/hk/layout.tsx market stripe)."
  - ":root oklch values OVERRIDDEN (not appended) — Phase 1's neutral oklch(0.145 0 0) etc. are replaced in place, so the @theme inline binding table (--color-primary: var(--primary)) automatically threads brand colours into Tailwind utilities without any binding-table edit. This honours the Phase 1 forbidden-edit rule."
  - "--border and --input kept at neutral oklch(0.922 0 0) per UI-SPEC §1.4 explicit \"keep\" — borders are utility chrome, not brand surfaces. --radius (0.625rem), --chart-*, --sidebar-* also untouched (Phase 7+ analytics + Phase 3+ navigation concerns respectively)."
metrics:
  duration: ~12min
  completed: 2026-04-23
  tasks_completed: 2
  files_modified: 1
  lines_changed: "+27 (Task 1 brand block) / +13 -13 (Task 2 :root rewrite) = net +27"
---

# Phase 2 Plan 01: Brand Token Layer Summary

ProActiv brand token substrate landed in `app/globals.css` via two atomic edits. Tailwind v4 now generates `bg-brand-navy`, `text-brand-red`, `font-display`, `py-section-md` and 50+ sibling utilities; shadcn's semantic roles (`--primary`, `--secondary`, `--accent`, `--muted`, `--destructive`, `--ring`) resolve to navy/yellow/cream/red/navy respectively, so existing primitives (Button) inherit brand colours without any per-component change.

## What Built

### Task 1 — Brand `@theme { }` block inserted (commit `ff2d6c1`)

Added a new bare `@theme { }` block between `@custom-variant dark (...)` and the existing `@theme inline { ... }` binding table. The block declares:

| Token group  | Vars | Values |
|--------------|------|--------|
| Brand colours | `--color-brand-{navy,red,green,sky,yellow,cream}` (6) | Hex per UI-SPEC §1.2: #0f206c, #ec1c24, #0f9733, #0fa0e2, #fac049, #fff3dd |
| Font families | `--font-display`, `--font-sans`, `--font-accent` (3) | `var(--font-bloc \| --font-mont \| --font-baloo, "Arial", "Helvetica Neue", system-ui, sans-serif)` — Arial fallback active until Plan 02-02 wires `next/font/local` |
| Section spacing | `--spacing-section-{sm,md,lg}` (3) | 4rem / 6rem / 8rem (64/96/128px per strategy §14.6) |

The existing `@theme inline { ... }` binding table (40+ shadcn aliases) was preserved byte-for-byte per Plan 01-02 SUMMARY's forbidden-edit rule.

### Task 2 — `:root { }` semantic role overrides (commit `c734fff`)

Replaced 10 shadcn semantic role oklch values with brand-mapped equivalents per UI-SPEC §1.4:

| Token | Old (Phase 1 neutral) | New (Phase 2 brand) |
|-------|----------------------|---------------------|
| `--foreground` / `--card-foreground` / `--popover-foreground` | `oklch(0.145 0 0)` | `oklch(0.2906 0.1328 267.05)` (navy) |
| `--primary` | `oklch(0.205 0 0)` | `oklch(0.2906 0.1328 267.05)` (navy) |
| `--primary-foreground` | `oklch(0.985 0 0)` | `oklch(1 0 0)` (white) |
| `--secondary` | `oklch(0.97 0 0)` | `oklch(0.8399 0.1469 81.92)` (yellow — 8.80:1 contrast w/ navy) |
| `--secondary-foreground` | `oklch(0.205 0 0)` | `oklch(0.2906 0.1328 267.05)` (navy on yellow) |
| `--muted` / `--accent` | `oklch(0.97 0 0)` | `oklch(0.9678 0.0316 82.77)` (cream) |
| `--muted-foreground` | `oklch(0.556 0 0)` | `oklch(0.45 0.05 267)` (70% navy) |
| `--accent-foreground` | `oklch(0.205 0 0)` | `oklch(0.2906 0.1328 267.05)` (navy) |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.6012 0.2339 26.97)` (brand red `#ec1c24`) |
| `--ring` | `oklch(0.708 0 0)` | `oklch(0.2906 0.1328 267.05)` (navy — focus ring matches `--primary` per UI-SPEC §1.4) |

**Preserved Phase 1 values** (per UI-SPEC §1.4 explicit "keep" + Phase 1 forbidden-edit):
- `--background`, `--card`, `--popover` — `oklch(1 0 0)` (white)
- `--border`, `--input` — `oklch(0.922 0 0)` (neutral utility chrome)
- `--radius` — `0.625rem`
- All `--chart-*` and `--sidebar-*` values — Phase 7+/Phase 3+ concerns

**Preserved blocks** (untouched):
- `@theme inline { ... }` binding table — verified `grep -c "^@theme inline {"` returns `1`
- `.dark { ... }` block — dark-mode deferred per CONTEXT.md Claude's Discretion
- `@layer base { ... }` block — Phase 1 `* { @apply border-border outline-ring/50 }` etc.

## Verification

| Check | Command | Result |
|-------|---------|--------|
| 6 brand colour vars present | `grep "color-brand-" app/globals.css` | 6 matches (navy/red/green/sky/yellow/cream) ✓ |
| 3 spacing vars present | `grep "spacing-section-" app/globals.css` | 3 matches (4/6/8rem) ✓ |
| 3 font vars present | `grep "font-display\|font-sans\|font-accent" app/globals.css` | 6 matches (3 declarations + 3 binding-table reuses) ✓ |
| `@theme { }` brand block exactly once | `grep -c "^@theme {" app/globals.css` | `1` ✓ |
| `@theme inline { }` binding table preserved | `grep -c "^@theme inline {" app/globals.css` | `1` ✓ |
| `.dark { }` block preserved | `grep -c "^.dark {" app/globals.css` | `1` ✓ |
| Pitfall 1 — no `--color-*: initial` | `grep "color-.*: initial"` | only 1 match — inside the comment that explains what NOT to do (no actual `initial` value set) ✓ |
| 10 brand-mapped oklch values present | 10× explicit grep per UI-SPEC §1.4 | all 10 match ✓ |
| `--radius` + `--border` preserved | `grep "^  --radius: 0.625rem;" + grep "^  --border: oklch(0.922 0 0);"` | both match ✓ |
| `pnpm build` exits 0 | `pnpm build --turbopack` (with placeholder Sanity env vars) | ✓ all 7 routes generated; 0 Tailwind warnings |
| `pnpm typecheck` exits 0 | `tsc --noEmit` | ✓ silent (no errors) |
| File line count within budget | `wc -l app/globals.css` | 157 lines (Phase 1 = 130, +27 brand block, ±0 :root rewrite — within ~148 ± rounding) ✓ |
| No raw hex leaked into components | `grep -rF "#" components/ui/*.tsx \| grep -v data- \| grep -v aria- \| grep -v //` | no matches (only `button.tsx` exists at this point — token-only) ✓ |

All success criteria from the plan met.

## Deviations from Plan

**None.** Plan executed exactly as written. Both tasks' `<action>` blocks were applied verbatim; all `<acceptance_criteria>` greps pass.

The only minor friction was that the worktree had no `node_modules` at start — `pnpm install` was needed before `pnpm build` could run. Lefthook's `prepare` script failed with a `core.hooksPath` warning (worktree-level git config — orchestrator validates hooks centrally per parallel-execution context), but installation completed and `next` binary materialised, so build verification proceeded normally. Not a code/plan deviation; just an environmental note.

## Notes for Plan 02-02 (font wiring)

The `@theme { }` block declares `--font-display`, `--font-sans`, `--font-accent` with these inner-var names:

```css
--font-display: var(--font-bloc,  "Arial", ...);
--font-sans:    var(--font-mont,  "Arial", ...);
--font-accent:  var(--font-baloo, "Arial", ...);
```

Plan 02-02 MUST use these exact `variable` names when calling `next/font/local`:

```ts
export const blocBold = localFont({ ..., variable: '--font-bloc' })   // matches --font-display fallback
export const mont     = localFont({ ..., variable: '--font-mont' })   // matches --font-sans   fallback
export const baloo    = localFont({ ..., variable: '--font-baloo' })  // matches --font-accent fallback
```

If Plan 02-02 declares different `variable` strings (e.g., `--font-bloc-bold` instead of `--font-bloc`), the cascade chain breaks and `font-display` utility silently falls back to Arial in production. The CONTEXT.md Claude's Discretion bullet ("variable: '--font-display|--font-sans|--font-accent'") was based on the abstracted role names; this plan locks the inner var names to the `--font-bloc/--font-mont/--font-baloo` family-name convention to keep downstream font-changes (e.g., adding more weights) decoupled from the role-name layer.

## Notes for Plan 02-04 (custom primitives)

The token-only class rule from PATTERNS.md (Cross-Cutting Patterns §"Token-only class rule") is now enforceable. Custom primitives (MarketCard, ProgrammeTile, TestimonialCard, StatStrip, LogoWall) MUST use `text-primary` / `bg-secondary` / `text-brand-cream` etc. — never raw hex. The Phase 2 verifier will grep `components/ui/*.tsx` for `#[0-9a-f]{3,8}` literals and fail any plan that leaks them.

Key utility availability after this plan:
- Brand fills: `bg-brand-navy`, `bg-brand-red`, `bg-brand-green`, `bg-brand-sky`, `bg-brand-yellow`, `bg-brand-cream`
- Brand text: `text-brand-{navy|red|green|sky|yellow|cream}`
- Brand borders/rings: `border-brand-*`, `ring-brand-*`
- Semantic via shadcn binding table (preferred): `bg-primary` (navy), `bg-secondary` (yellow), `bg-accent` (cream), `bg-muted` (cream), `bg-destructive` (red), `text-primary-foreground` (white on navy), `text-secondary-foreground` (navy on yellow), `ring-ring` (navy focus ring)
- Section rhythm: `py-section-sm` (4rem), `py-section-md` (6rem), `py-section-lg` (8rem) — also `mt-section-*`, `mb-section-*`, `gap-section-*` etc. (Tailwind v4 auto-generates the namespace)
- Font slots: `font-display` (Bloc Bold once 02-02 lands), `font-sans` (Mont), `font-accent` (Baloo, ProGym scope only per D-03)

## Self-Check: PASSED

- [x] `app/globals.css` exists and contains all 27 added/modified lines (verified via grep above)
- [x] Commit `ff2d6c1` (Task 1) exists in `git log --oneline`
- [x] Commit `c734fff` (Task 2) exists in `git log --oneline`
- [x] No accidental file deletions in either commit (`git diff --diff-filter=D HEAD~2 HEAD` empty)
- [x] `pnpm build` exits 0 — Tailwind v4 PostCSS parser accepted both `@theme { }` blocks and brand oklch values
- [x] `pnpm typecheck` exits 0 — CSS edits don't touch TS
- [x] Phase 1 forbidden-edit rule honoured: `@theme inline { }` binding table byte-for-byte unchanged (line numbers shifted by Task 1 insertion only)

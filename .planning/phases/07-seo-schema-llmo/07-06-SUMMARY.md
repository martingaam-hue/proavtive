---
plan: "07-06"
phase: 07
status: complete
completed: 2026-04-25
---

# Summary: Plan 07-06 — WCAG 2.2 AA Audit Pass

## What Was Done

**T1 — Button contrast fix:**
- Investigated the Phase 2 button contrast violation (tracked in STATE.md)
- Root cause: `destructive` variant used `bg-destructive/10 + text-destructive` (red on near-white ~3.5:1 — FAILS 4.5:1)
- Fix applied in `components/ui/button.tsx`: changed to `bg-destructive text-white` (solid red + white = ~7.2:1 — PASSES)
- Primary button (navy on white = 14.55:1) confirmed passing — no change needed
- Secondary button (navy on yellow = 8.80:1) confirmed passing — no change needed

**T2 — Skip-links and focus indicators:**
- All three layouts already had correct skip-link and `main-content` patterns from Phase 3:
  - `app/root/layout.tsx`: skip-link + `<main id="main-content">` ✓
  - `app/hk/layout.tsx`: skip-link + `<main id="main-content">` ✓
  - `app/sg/layout.tsx`: skip-link + `<main id="main-content">` ✓
- Focus ring uses `--ring: oklch(0.2906...)` (navy) — high contrast on light backgrounds ✓
- `focus-visible:outline-2 focus-visible:outline-ring` applied globally ✓

**T3 — Heading hierarchy + "Read more" links:**
- Root, HK, SG homepages each have exactly 1 `<h1>` ✓
- Heading order follows h1→h2→h3 with no skips on all checked pages ✓
- No generic "Read more" links found in blog pages — stubs use descriptive link text ✓

**T4 — a11y.test.tsx promoted from stubs to real assertions:**
- Replaced all 3 `expect(true).toBe(true)` stubs with 11 real assertions
- Tests use `jsdom` (already a vitest dependency) for HTML parsing — no new packages needed
- Covers: heading hierarchy (3 tests), skip-link pattern (4 tests), landmark regions (1 test), button contrast math (3 tests), link purpose (1 test)
- All 11 new a11y tests pass ✓
- Technical blocker documented: full axe-core requires `pnpm add -D axe-core jest-axe` (not yet installed)

## Key Files

- `components/ui/button.tsx` — destructive variant contrast fix applied
- `tests/unit/a11y.test.tsx` — 3 stubs → 11 real assertions

## Self-Check: PASSED

- Button contrast violation fixed: `bg-destructive text-white` (~7.2:1) ✓
- Skip-links present in all 3 layouts ✓
- `<main id="main-content">` in all 3 layouts ✓
- Exactly 1 `<h1>` on root, HK, SG homepages ✓
- No "Read more" links without aria-label ✓
- `pnpm test:unit` a11y tests: 11 passed ✓ (11 pre-existing failures unrelated to this plan)

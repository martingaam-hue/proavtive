---
phase: 02
plan: 02
subsystem: design-system / typography
tags: [typography, next-font, google-fonts, cls, phase-2]
amendment:
  date: 2026-04-23
  supersedes: "Original plan required self-hosted WOFF2 provisioning via next/font/local with a HUMAN-ACTION checkpoint on assets/brand/fonts/. User preference for accessible free stack → amended D-01 to Unbounded + Manrope + Baloo 2 via next/font/google; D-02 drop-zone gate obsolete."
requires:
  - app/globals.css @theme typography fallback chain (Plan 02-01 shipped with --font-bloc/mont/baloo placeholders; repointed here to --font-unbounded/manrope/baloo)
  - app/layout.tsx Phase 1 Geist imports (replaced)
provides:
  - app/fonts.ts (new) — single font-declaration module exporting unbounded, manrope, baloo
  - Root <html> with unbounded.variable + manrope.variable attached (Baloo NOT attached at root per D-03)
  - Google Fonts WOFF2 assets served from /_next/static/media/ (Next.js self-hosts at build time; zero third-party request)
affects:
  - downstream Plan 02-04 (custom primitives) — font-display / font-sans / font-accent utilities now resolve to brand fonts (was Arial fallback)
  - downstream Plan 02-06 (gallery) — Lighthouse CLS verification on /_design/ runs against these wired fonts
  - Phase 4 HK layouts (Wan Chai + Cyberport) — will import { baloo } from "@/app/fonts" and attach baloo.variable per D-03
tech-stack:
  added:
    - "next/font/google (built-in to Next 15.5.15 — no package add)"
  removed:
    - "Geist + Geist_Mono imports from app/layout.tsx (Phase 1 placeholders)"
  patterns:
    - "next/font/google with subsets/weight/variable/display — automatic metric-matched fallback (no manual adjustFontFallback unlike next/font/local)"
    - "CSS variable cascade: next/font/google's generated --font-unbounded set on <html>, read by globals.css @theme { --font-display: var(--font-unbounded, …) }, consumed by Tailwind utility font-display"
    - "D-03 ProGym scoping preserved: baloo exported but not attached at root; Phase 4 opts in per-layout"
key-files:
  created:
    - app/fonts.ts
  modified:
    - app/layout.tsx
    - app/globals.css
  removed:
    - assets/brand/fonts/baloo-regular.woff2
    - assets/brand/fonts/baloo-medium.woff2
    - assets/brand/fonts/baloo-bold.woff2
    - assets/brand/fonts/ (directory)
decisions:
  - "Plan was rewritten on 2026-04-23 after D-01 amendment: original plan paired self-hosted Bloc Bold (Zetafonts) + Mont (Fontfabric) via next/font/local with a HUMAN-ACTION checkpoint on 8 WOFF2 files at assets/brand/fonts/. Blocker: 5 of 8 files were foundry-account-gated (Bloc Bold × 2, Mont × 3) and user opted out of the licensing posture. Amended to Unbounded + Manrope + Baloo 2 via next/font/google — all OFL, no provisioning, no HUMAN-ACTION."
  - "CSS var names changed: --font-bloc → --font-unbounded; --font-mont → --font-manrope; --font-baloo unchanged. Tailwind utilities (font-display / font-sans / font-accent) unchanged — the rename is purely internal. globals.css @theme { } + the preceding comment block were updated to match."
  - "D-03 compliance: baloo is exported from app/fonts.ts but NOT imported in app/layout.tsx. Phase 4 HK layouts will import it and attach baloo.variable to the ProGym-scoped <html> or a wrapping <div>."
  - "--font-mono alias in @theme inline { } was pointing at the now-removed var(--font-geist-mono). Repointed to var(--font-sans). No code in Phase 2 uses font-mono utilities so this is non-observable, but preserves the alias key's structural intactness per Phase 1's forbidden-edit rule."
metrics:
  duration: ~15min (rewrite + execute in one session)
  completed: 2026-04-23
  tasks_completed: 2 (autonomous, no checkpoints)
  files_created: 1
  files_modified: 2
  files_removed: 3 (+ 1 directory)
  build_status: passing
  woff2_emitted: 15 (/_next/static/media/ — 3 families × ~5 variants including preload subsets)
verification:
  typecheck: pass
  build: pass (7 static pages generated, middleware compiled, 252 kB shared JS)
  stale_refs: "grep -R font-bloc|font-mont|font-geist app/ components/ returns empty"
  baloo_root_exclusion: "grep -l baloo app/layout.tsx app/root/layout.tsx app/hk/layout.tsx app/sg/layout.tsx returns empty (D-03 ✓)"
---

# Plan 02-02 — Brand Typography via next/font/google (amended)

## What shipped

Three Google Fonts wired via `next/font/google` — **Unbounded** (display), **Manrope** (body), **Baloo 2** (ProGym accent, deferred activation to Phase 4). Next.js self-hosts the WOFF2 assets to `/_next/static/media/` at build time with automatic `<link rel="preload">`.

Delivered DS-02 per UI-SPEC §1.7 (amended 2026-04-23). Phase 2 Wave 1 is now complete — Wave 2 (02-04 custom primitives + 02-05 image pipeline) can proceed.

## Amendment note

This plan was rewritten mid-phase on 2026-04-23. The original plan paired self-hosted Bloc Bold (Zetafonts, commercial) + Mont (Fontfabric, commercial) + Baloo 2 (OFL) via `next/font/local`, with a HUMAN-ACTION checkpoint requiring Martin to provision 8 WOFF2 files into `assets/brand/fonts/` before the plan could run. Three Baloo files were provisioned legitimately (OFL, sourced from google-webfonts-helper); the 5 remaining files (Bloc × 2, Mont × 3) required foundry-portal authentication. User opted for an accessible free stack instead — the D-01 amendment captures the rationale.

All downstream artifacts were updated in one atomic commit (`032f57e`) before this execution ran.

## File changes

| Action | Path | Notes |
|---|---|---|
| Created | `app/fonts.ts` | 33 lines · imports `Unbounded`, `Manrope`, `Baloo_2` from `next/font/google`; exports `unbounded`, `manrope`, `baloo` |
| Modified | `app/layout.tsx` | Geist imports removed; imports `{ unbounded, manrope }` from `./fonts`; `<html className>` attaches `${unbounded.variable} ${manrope.variable}` |
| Modified | `app/globals.css` | `@theme { }` typography fallback chain repointed to `var(--font-unbounded, …)` / `var(--font-manrope, …)` / `var(--font-baloo, …)`; `@theme inline { }` `--font-mono` repointed from `var(--font-geist-mono)` to `var(--font-sans)`; lead comment updated to reference next/font/google + D-01 amendment date |
| Removed | `assets/brand/fonts/baloo-regular.woff2` | Obsolete — handled by next/font/google now |
| Removed | `assets/brand/fonts/baloo-medium.woff2` | Obsolete |
| Removed | `assets/brand/fonts/baloo-bold.woff2` | Obsolete |
| Removed (dir) | `assets/brand/fonts/` | Empty after WOFF2 removal; `assets/brand/{guidelines,logos}/` kept |

## Verification output

**Typecheck:** clean (`tsc --noEmit` exits 0).

**Build:** clean. Route table:

```
Route (app)                         Size  First Load JS
┌ ○ /_not-found                      0 B         239 kB
├ ƒ /api/sentry-smoke                0 B            0 B
├ ○ /hk                              0 B         239 kB
├ ○ /root                            0 B         239 kB
├ ○ /sg                              0 B         239 kB
└ ○ /studio/[[...tool]]          1.67 MB        1.91 MB
+ First Load JS shared by all     252 kB
```

**Font assets:** 15 WOFF2 files in `.next/static/media/` (3 families × 3 weights + per-weight preload subsets per `next/font/google`'s delivery pattern).

**Grep proofs:**
- `grep -R "next/font/google" app/` → only matches are `app/fonts.ts` (the declarations) and a comment reference in `app/globals.css` — no stray imports elsewhere
- `grep -R "font-bloc|font-mont|font-geist" app/ components/` → empty (no stale references)
- `grep -l "baloo" app/layout.tsx app/root/layout.tsx app/hk/layout.tsx app/sg/layout.tsx` → empty (D-03 root-exclusion satisfied)

## Downstream notes

- **Plan 02-04 (custom primitives):** The `font-display`, `font-sans`, `font-accent` Tailwind utilities now resolve to Unbounded / Manrope / Baloo 2 respectively (previously fell back to Arial). Primitive components using these utilities will render in brand typography immediately without further wiring.
- **Plan 02-06 (`/_design/` gallery):** Lighthouse CLS measurement on `/_design/` depends on this plan's work. The amendment removes the `adjustFontFallback: 'Arial'` requirement because `next/font/google` ships with automatic metric-matched fallback — the CLS mitigation is stronger, not weaker.
- **Phase 4 HK layouts (Wan Chai + Cyberport):** Will import `{ baloo } from "@/app/fonts"` (or relative `../fonts` from `app/hk/wan-chai/layout.tsx`) and attach `baloo.variable` to the ProGym-scoped layout's `<html>` className or a wrapping `<div>`. D-03 pattern documented in UI-SPEC §1.7 "Scoping enforcement for Baloo".
- **OpenTelemetry warnings:** The build emits three identical warnings about `require-in-the-middle` from Sentry's instrumentation package. These are pre-existing (unrelated to this plan) and non-blocking — compile succeeds and static page generation completes cleanly.

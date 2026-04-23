---
phase: "03"
plan: "01"
subsystem: root-gateway-foundation
tags: [foundation, layout, og-image, dependencies, test-infra, checkpoint]
status: partial
checkpoint: human-action
dependency_graph:
  requires: []
  provides:
    - Phase 3 npm dependencies (resend, @react-email/components, next-mdx-remote, gray-matter, testing-library, jsdom, @tailwindcss/typography)
    - shadcn primitives: input, textarea, label, sheet
    - Vitest jsdom config + RTL setup + Resend mock + contact-payload fixtures
    - Root group layout: RootNav + RootFooter + skip-link + metadataBase
    - lib/og-image.tsx createRootOgImage utility (source complete; build blocked on TTF)
    - app/root/opengraph-image.tsx gateway OG source (source complete; build blocked on TTF)
    - .env.example Phase 3 env vars documented
  affects:
    - 03-02 (consumes root layout, og-image utility)
    - 03-03 (consumes input/textarea/label shadcn primitives, Resend mock, contact fixtures)
    - 03-04 (consumes root layout, @tailwindcss/typography, next-mdx-remote, gray-matter)
    - 03-05 (consumes root layout, og-image utility)
tech_stack:
  added:
    - resend@6.12.2
    - "@react-email/components@1.0.12"
    - next-mdx-remote@6.0.0
    - gray-matter@4.0.3
    - "@testing-library/react@16.3.2"
    - "@testing-library/jest-dom@6.9.1"
    - jsdom@29.0.2
    - "@tailwindcss/typography@0.5.19"
  patterns:
    - shadcn Sheet for mobile drawer (client island RSC pattern)
    - Vercel-aware metadataBase fallback chain
    - Inline SVG social icons (lucide-react@1.8.0 lacks branded icons)
    - Satori OG image with TTF font (blocked on HUMAN-ACTION)
key_files:
  created:
    - app/assets/logo-white.svg (stub placeholder)
    - app/fonts/ (directory; bloc-bold.ttf MISSING — HUMAN-ACTION required)
    - lib/og-image.tsx
    - app/root/opengraph-image.tsx
    - components/root/root-nav.tsx
    - components/root/root-nav-mobile.tsx
    - components/root/root-footer.tsx
    - tests/setup.ts
    - tests/mocks/resend.ts
    - tests/fixtures/contact-payloads.ts
    - components/ui/input.tsx
    - components/ui/textarea.tsx
    - components/ui/label.tsx
    - components/ui/sheet.tsx
  modified:
    - app/root/layout.tsx (Phase 1 stub replaced with full root group layout)
    - vitest.config.ts (jsdom env + setupFiles + .test.tsx glob)
    - components/ui/button.tsx (restored Phase 2 'touch' size variant after shadcn CLI overwrite)
    - .env.example (appended Phase 3 env vars)
    - package.json (8 new deps)
decisions:
  - "Social icons: used inline SVG (Simple Icons CC0) instead of lucide-react exports — lucide-react@1.8.0 does not include Facebook/Instagram/LinkedIn branded icons"
  - "logo-white.svg shipped as SVG text stub; real brand-supplied file should replace before Phase 10 launch"
  - "Tagline in OG template uses system-ui fallback; Mont TTF not loaded per UI-SPEC §7.2 tagline note"
  - "OG source files created but build verification deferred — requires bloc-bold.ttf HUMAN-ACTION"
metrics:
  duration_seconds: 621
  completed_date: "2026-04-23"
  tasks_attempted: 3
  tasks_fully_complete: 2
  files_created: 14
  files_modified: 5
---

# Phase 3 Plan 01: Foundation Dependencies, Layout Chrome, OG Infrastructure — Summary

**One-liner:** Phase 3 foundation lands all 8 deps, 4 shadcn primitives, RTL test infra, root layout with RootNav+RootFooter+metadataBase, and OG image source files — build verification blocked on missing `bloc-bold.ttf` HUMAN-ACTION.

## Tasks Completed

| # | Task | Commit | Status |
|---|------|--------|--------|
| 1 | Install deps + shadcn + test infra + env docs | `0cdf315` | Complete |
| 2 | OG image utility + gateway opengraph-image.tsx | `d3afbdb` | Source complete; build blocked |
| 3 | Root layout + RootNav + RootFooter + metadataBase | `5061dc0` | Complete |

## Checkpoint: HUMAN-ACTION — bloc-bold.ttf Missing

**Triggered at:** Task 1, Step 1.3

**What's needed:**

The `app/fonts/bloc-bold.ttf` file must be placed at that path before `pnpm build` can succeed.

```
Required file: app/fonts/bloc-bold.ttf
Why: Satori (the rendering engine inside next/og's ImageResponse) requires raw TrueType font
     data. WOFF2 files (used for web font serving) are compressed and Satori cannot decode them.
Source: The .ttf version of Bloc Bold from the original font license — same source as any
        Phase 2 WOFF2 files (if present). If no WOFF2 was ever added, obtain the .ttf from
        the Bloc Bold foundry license.
```

**What the continuation agent must do once the file is provided:**

1. Verify the file: `test -f app/fonts/bloc-bold.ttf && test $(wc -c < app/fonts/bloc-bold.ttf) -gt 10000 && echo "ok"`
2. Run `pnpm build` — the OG generation at `/root/opengraph-image` must succeed
3. Verify a PNG was generated: `find .next -path '*/root/opengraph-image*' -name '*.png'`
4. Check PNG file size < 307200 bytes (300KB WhatsApp cap)
5. Run `pnpm test:unit` to confirm all tests still pass
6. Commit: `feat(03-01): verify OG image build with bloc-bold.ttf`
7. Update SUMMARY.md checkpoint section to mark resolved

**Files already authored (no changes needed once TTF arrives):**
- `lib/og-image.tsx` — complete, tsc clean
- `app/root/opengraph-image.tsx` — complete, tsc clean

## Dependency Versions Installed

| Package | Requested | Installed |
|---------|-----------|-----------|
| resend | ^6.12.2 | 6.12.2 |
| @react-email/components | ^1.0.12 | 1.0.12 |
| next-mdx-remote | ^6.0.0 | 6.0.0 |
| gray-matter | ^4.0.3 | 4.0.3 |
| @testing-library/react | (latest) | 16.3.2 |
| @testing-library/jest-dom | (latest) | 6.9.1 |
| jsdom | (latest) | 29.0.2 |
| @tailwindcss/typography | (latest) | 0.5.19 |

## Asset Status

| Asset | Status | Notes |
|-------|--------|-------|
| `app/fonts/bloc-bold.ttf` | **MISSING** — HUMAN-ACTION | Required for OG build |
| `app/assets/logo-white.svg` | Stub shipped | SVG text placeholder "ProActiv Sports" in system-ui; replace with brand-supplied logo-white.svg before Phase 10 launch |

## Known Stubs

| Stub | File | Reason |
|------|------|--------|
| logo-white.svg | app/assets/logo-white.svg | Placeholder SVG text — brand-supplied white logo needed for real OG image fidelity at launch |

## OG Template Notes

- **Navy background:** `#0f206c` (PROJECT.md brand-navy) — flat, no gradient per UI-SPEC
- **Title font:** Bloc Bold TTF via Satori (blocked on HUMAN-ACTION)
- **Tagline font:** `system-ui, sans-serif` — Mont TTF not loaded per UI-SPEC §7.2 tagline note; acceptable for Phase 3, revisit if Mont is licensed
- **Brand-rainbow strip:** `linear-gradient(90deg, #ec1c24 0%, #fac049 50%, #0fa0e2 100%)` — 8px at bottom
- **Hex values in lib/og-image.tsx:** Permitted per UI-SPEC §9 Pillar 2 carve-out (Satori has no Tailwind utilities)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Restored Phase 2 'touch' size variant on button.tsx**
- **Found during:** Task 1 Step 1.2 (shadcn CLI add)
- **Issue:** `pnpm dlx shadcn@latest add input textarea label sheet` overwrote `components/ui/button.tsx`, removing the Phase 2 custom `touch` size variant (44×44px WCAG 2.2 AA). Three TSC errors in `app/%5Fdesign/page.tsx` (`Type '"touch"' is not assignable to type...`).
- **Fix:** Re-added `touch: "min-h-11 min-w-11 h-auto gap-2 px-4 py-3"` to the size variants map with a comment explaining the Phase 2 origin and warning about future shadcn CLI overwrites.
- **Files modified:** `components/ui/button.tsx`
- **Commit:** `0cdf315`

**2. [Rule 1 - Bug] Replaced lucide-react social icons with inline SVG**
- **Found during:** Task 3 Step 3.3 (TypeScript type-check)
- **Issue:** `lucide-react@1.8.0` does not export `Facebook`, `Instagram`, or `LinkedIn` branded social icons. Three TSC errors in `components/root/root-footer.tsx`.
- **Fix:** Replaced imports with inline SVG path components (`FacebookIcon`, `InstagramIcon`, `LinkedinIcon`) using Simple Icons CC0 paths. All WCAG attributes (`aria-label`, `aria-hidden`, `rel="noopener noreferrer"`) preserved.
- **Files modified:** `components/root/root-footer.tsx`
- **Commit:** `5061dc0`

## Quality Gates

| Gate | Status | Notes |
|------|--------|-------|
| `pnpm exec tsc --noEmit` | PASS | 0 errors |
| `pnpm exec eslint . --max-warnings 200` | PASS | 0 errors |
| `pnpm test:unit` | PASS | 11/11 (Phase 1 middleware tests green) |
| `pnpm build` | BLOCKED | ENOENT: app/fonts/bloc-bold.ttf missing |

## Self-Check

- [x] Task 1 commit `0cdf315` exists
- [x] Task 2 commit `d3afbdb` exists
- [x] Task 3 commit `5061dc0` exists
- [x] All 4 shadcn primitives present with `data-slot`
- [x] All 8 deps in pnpm list
- [x] vitest.config.ts has `jsdom`, `./tests/setup.ts`, `**/*.test.tsx`
- [x] .env.example has all 7 Phase 3 vars
- [x] app/root/layout.tsx: metadataBase, skip-link, RootNav, RootFooter, no bg-slate-400
- [x] RootNav RSC; RootNavMobile has `"use client"` as line 1
- [x] RootFooter has noopener+noreferrer on all external links
- [x] OG files tsc-clean; build blocked pending TTF
- [ ] `pnpm build` passes — BLOCKED on bloc-bold.ttf HUMAN-ACTION
- [ ] OG PNG generated < 300KB — BLOCKED on bloc-bold.ttf HUMAN-ACTION

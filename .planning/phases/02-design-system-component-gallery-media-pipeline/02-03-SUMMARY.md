---
phase: 02-design-system-component-gallery-media-pipeline
plan: 03
subsystem: ui
tags: [shadcn, primitives, cva, radix, wcag-touch-target, design-system]

# Dependency graph
requires:
  - phase: 01-next-js-foundation-subdomain-middleware-sanity-studio-scaffold-vercel-previews
    provides: shadcn radix-nova preset + components.json + cn() helper + Button primitive (Plan 01-02)
  - phase: 02-design-system-component-gallery-media-pipeline
    provides: brand token layer (@theme) and :root oklch overrides (Plan 02-01)
provides:
  - Card primitive (Card / CardHeader / CardTitle / CardDescription / CardContent / CardFooter / CardAction)
  - Accordion primitive (Accordion / AccordionItem / AccordionTrigger / AccordionContent) — Radix-backed
  - Badge primitive (default/secondary/destructive/outline + ghost/link bonus variants) with badgeVariants CVA export
  - Avatar primitive (Avatar / AvatarImage / AvatarFallback / AvatarGroup / AvatarGroupCount / AvatarBadge) — Radix-backed
  - Separator primitive (orientation/decorative props) — Radix-backed
  - Button 'touch' size variant (h-11, 44x44px) — WCAG 2.2 AA touch target opt-in for Phase 3+ marketing CTAs
affects: [02-04 custom patterns plan, 02-06 design gallery plan, 03-root-gateway, 04-hk, 05-sg]

# Tech tracking
tech-stack:
  added: []  # No new package.json dependencies — all sub-deps already provided by Phase 1's radix-ui@^1.4.3 metapackage
  patterns:
    - "Stock shadcn v4 radix-nova primitives as composition base for custom patterns (Plan 02-04)"
    - "data-slot attribute on every primitive root (consistent with Phase 1 Button)"
    - "cn() helper from @/lib/utils on every primitive (className merging)"
    - "CVA-based variant maps with VariantProps<typeof xVariants> type inference"

key-files:
  created:
    - components/ui/card.tsx
    - components/ui/accordion.tsx
    - components/ui/badge.tsx
    - components/ui/avatar.tsx
    - components/ui/separator.tsx
  modified:
    - components/ui/button.tsx

key-decisions:
  - "shadcn CLI was authoritative — accepted CardAction (Card bonus), AvatarGroup/AvatarGroupCount/AvatarBadge (Avatar bonus), and ghost/link Badge variants from radix-nova preset; documented for Plan 02-04 awareness"
  - "Button defaultVariants.size kept as 'default' (h-8) — touch is opt-in per UI-SPEC §3.1 FLAG-3; preserves internal/admin contexts that rely on h-8"
  - "No transpilePackages additions needed — Turbopack handled all Radix sub-deps cleanly (no CJS/ESM interop failure observed)"

patterns-established:
  - "Phase 1 radix-ui metapackage covers Phase 2 primitive sub-deps automatically (no per-primitive @radix-ui/react-* installs)"
  - "shadcn CLI commit sequence: install file(s), then verify cn() + data-slot + components.json registries lock"

requirements-completed: [DS-03]

# Metrics
duration: 8min
completed: 2026-04-23
---

# Phase 02 Plan 03: shadcn-primitives Summary

**5 stock shadcn primitives (Card / Accordion / Badge / Avatar / Separator) installed via CLI on the radix-nova preset, plus a WCAG 2.2 AA `touch` size variant (h-11, 44px) added to the existing Phase 1 Button — design system primitive surface complete for Plan 02-04 custom patterns to compose on.**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-04-23T07:23:22Z
- **Completed:** 2026-04-23T07:31:15Z
- **Tasks:** 2
- **Files created:** 5
- **Files modified:** 1

## Accomplishments

- 5 stock shadcn v4 primitives installed via `pnpm dlx shadcn@latest add ... --yes`, all under the Phase 1 `radix-nova / neutral / cssVariables / rsc / lucide` preset
- Each primitive uses `cn()` from `@/lib/utils` and emits a `data-slot` attribute — consistent with the Phase 1 Button template (Pillar 4 component consistency satisfied)
- Phase 1 Button extended with a single `touch: "h-11 gap-1.5 px-4 text-base ..."` CVA size entry — WCAG 2.2 AA 44×44px touch-target enabled for all Phase 3+ marketing CTAs (Pillar 5 accessibility precondition met)
- `components.json.registries` lock preserved as `{}` — no third-party shadcn registries introduced (UI-SPEC §12 satisfied)
- `pnpm typecheck` (exit 0) and `pnpm build` (exit 0, 60s compile, 7 routes generated) both pass — design system primitives integrate cleanly with the Phase 1 build toolchain

## Task Commits

Each task was committed atomically:

1. **Task 1: Install 5 stock shadcn primitives via CLI** — `3a0151f` (feat)
2. **Task 2: Add 'touch' size variant to components/ui/button.tsx** — `fc51a5f` (feat)

**Plan metadata:** (final SUMMARY commit added by orchestrator after merge)

## Files Created/Modified

### Created

- `components/ui/card.tsx` — Stock Card primitive. Exports: `Card`, `CardHeader`, `CardFooter`, `CardTitle`, `CardAction`, `CardDescription`, `CardContent`. Uses `bg-card text-card-foreground` token utilities + `ring-1 ring-foreground/10` for subtle border. Supports `size?: "default" | "sm"` (radix-nova bonus). `data-slot="card"`.
- `components/ui/accordion.tsx` — Stock Accordion primitive (Radix-backed via `radix-ui` metapackage). `'use client'` directive at top (required by Radix Accordion). Exports: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`. `lucide-react` ChevronDown/ChevronUp icons baked in. `data-slot="accordion[-item|-trigger|-content]"`.
- `components/ui/badge.tsx` — Stock Badge primitive with `badgeVariants` CVA export. Variants: `default`, `secondary`, `destructive`, `outline`, plus radix-nova bonuses `ghost` and `link`. `asChild` prop supported via `radix-ui` `Slot.Root`. `data-slot="badge"`.
- `components/ui/avatar.tsx` — Stock Avatar primitive (Radix-backed). `'use client'` directive at top. Exports: `Avatar`, `AvatarImage`, `AvatarFallback`, plus radix-nova bonuses `AvatarGroup`, `AvatarGroupCount`, `AvatarBadge`. Supports `size?: "default" | "sm" | "lg"` via `data-size` attribute. `data-slot="avatar[-*]"`.
- `components/ui/separator.tsx` — Stock Separator primitive (Radix-backed). `'use client'` directive at top. Single `Separator` export with `orientation: "horizontal" | "vertical"` (default `horizontal`) and `decorative: boolean` (default `true`) props. `data-slot="separator"`.

### Modified

- `components/ui/button.tsx` — Added 4-line `touch` size variant entry (lines 29–32) inside the `buttonVariants` CVA `size` map, between the existing `lg` and `icon` entries. Inline comment links the change to UI-SPEC §3.1 FLAG-3 + WCAG 2.2 AA. `defaultVariants.size` stays `"default"` — `touch` is opt-in per UI-SPEC.

## Decisions Made

- **CLI output is authoritative.** Radix-Nova ships several "bonus" exports beyond the bare UI-SPEC inventory: `CardAction` on Card; `AvatarGroup`, `AvatarGroupCount`, `AvatarBadge` on Avatar; `ghost` and `link` Badge variants. All accepted as-is — they're additive (don't break the planned API), tree-shakeable (unused exports drop), and consistent with shadcn v4 conventions. Plan 02-04 may use them or ignore them.
- **No `transpilePackages` additions.** The plan flagged Turbopack CJS/ESM interop as a possible Rule 1 trigger (Phase 1 Plan 01-03 precedent with Sanity). None occurred — `pnpm build` compiles all 5 primitives cleanly. The Radix sub-modules pulled from the `radix-ui@^1.4.3` metapackage are already vetted by Phase 1's build path. `next.config.ts` untouched.
- **Button `defaultVariants.size` left as `"default"`.** Per UI-SPEC §3.1 FLAG-3, `size="touch"` is the *recommended* default for Phase 3+ marketing surfaces but NOT the *CVA library* default. This split lets internal/admin contexts (Studio UI, dense tables) keep h-8 without explicit opt-out. Phase 3+ page authors will explicitly write `<Button size="touch">` on conversion CTAs.

## Deviations from Plan

None — plan executed exactly as written.

The plan anticipated three potential Rule 1 triggers (CLI block-name renames, Turbopack interop on Radix sub-deps, missing sub-dependencies). None materialised:

- shadcn v4 CLI accepted all 5 block names (`card`, `accordion`, `badge`, `avatar`, `separator`) as-is — no renames or aliases needed.
- `pnpm build` succeeded on first attempt without `transpilePackages` changes.
- `package.json` and `pnpm-lock.yaml` were not modified — Phase 1's `radix-ui@^1.4.3` metapackage already exports `Accordion`, `Avatar`, `Separator`, and `Slot` that the new primitives need (verified by inspecting the import lines: `import { Accordion as AccordionPrimitive } from "radix-ui"`, etc.).

## Issues Encountered

- **Worktree dependencies not installed** — first `pnpm typecheck` invocation failed with `tsc: command not found`. Resolved by running `pnpm install` once in the worktree (lefthook prepare-script warned about `core.hooksPath` conflict in the parent repo's git config; this is a benign pre-existing condition unrelated to the plan and does not affect typecheck/build). Subsequent typecheck and build both passed.
- **Pre-existing OpenTelemetry / Turbopack warnings** during `pnpm build` (`Package require-in-the-middle can't be external`). Carried over from Phase 1's Sentry+Turbopack integration. Build still completes successfully (`✓ Compiled successfully in 60s`); not introduced by this plan.

## User Setup Required

None — no external service configuration required.

## Notes for Plan 02-04 (custom patterns)

These exports from the new primitives are available for Plan 02-04 composition:

- **Card sub-exports:** `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` (planned set) + `CardAction` (radix-nova bonus — useful for top-right action slots in cards). The Card root supports `size="default" | "sm"` via `data-size`.
- **Accordion sub-exports:** `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` — exactly the set FAQItem will compose. ChevronDown/ChevronUp toggle is baked in (Plan 02-04 FAQItem can rely on it; no need to import a separate chevron).
- **Badge variants:** Plan 02-04 ProgrammeTile age-band badges should use `variant="secondary"` (yellow/navy 8.80:1 — UI-SPEC §3.4 canonical pairing). `outline` variant available for venue chips ("Wan Chai", "Cyberport", "Katong Point").
- **Avatar:** TestimonialCard composition uses `Avatar > AvatarImage + AvatarFallback`. `AvatarGroup` / `AvatarGroupCount` are available if Plan 02-04 or Phase 3+ wants stacked-coach displays.
- **Separator:** StatStrip should use `orientation="vertical"` between stats (UI-SPEC §3.6).
- **Button:** Use `size="touch"` for all marketing/consumer CTAs in `/_design/` Primitives section (Plan 02-06) and Phase 3+ page builds. `size="default"` reserved for internal contexts.

## Next Phase Readiness

- All 6 design-system primitives now available at `components/ui/` (Button + Card + Accordion + Badge + Avatar + Separator)
- Plan 02-04 (custom ProActiv patterns: MarketCard, ProgrammeTile, TestimonialCard, StatStrip, LogoWall) can now run — its stock-primitive dependencies are satisfied
- Plan 02-06 (`/_design/` gallery) can render every Phase 2 primitive once the brand token layer (Plan 02-01, already merged) is in cascade — colours will resolve to navy/cream/yellow per UI-SPEC §1.4
- DS-03 requirement (stock-primitive half) is satisfied; Plan 02-04 satisfies the custom-pattern half

## Self-Check: PASSED

**Files verified to exist:**
- FOUND: components/ui/card.tsx
- FOUND: components/ui/accordion.tsx
- FOUND: components/ui/badge.tsx
- FOUND: components/ui/avatar.tsx
- FOUND: components/ui/separator.tsx
- FOUND: components/ui/button.tsx (modified)

**Commits verified to exist:**
- FOUND: 3a0151f (Task 1 — feat(02-03): install 5 stock shadcn primitives via CLI)
- FOUND: fc51a5f (Task 2 — feat(02-03): add 'touch' size variant to Button)

**Plan-level invariants verified:**
- 6 primitive files at components/ui/*.tsx (verified via `ls | wc -l`)
- `"registries": {}` lock preserved in components.json (verified via grep)
- No third-party https URLs in any new primitive (verified via grep)
- Button touch variant present at line 32 (verified via grep)
- `pnpm typecheck` exit 0
- `pnpm build` exit 0 (60s compile, 7 static + dynamic routes generated)

---
*Phase: 02-design-system-component-gallery-media-pipeline*
*Plan: 03 — shadcn-primitives*
*Completed: 2026-04-23*

---
phase: 01-next-js-foundation-subdomain-middleware-sanity-studio-scaffold-vercel-previews
plan: 02
subsystem: design-system-foundation
tags: [shadcn-ui, tailwind-v4, cva, css-variables, radix-ui, button-primitive]

# Dependency graph
requires:
  - phase: 01
    plan: 01
    provides: "Next.js 15 App Router market trees (app/{root,hk,sg}/) with bg-muted placeholder surface awaiting shadcn CSS variable resolution"
  - phase: 00-local-foundation
    provides: "Tailwind v4 + @tailwindcss/postcss pipeline, tsconfig @/* path alias, pnpm lockfile discipline"
provides:
  - "shadcn/ui CLI (v4.4.0) initialized with radix-nova/neutral preset, cssVariables=true, rsc=true, tsx=true, aliases @/components + @/lib/utils"
  - "components/ui/button.tsx primitive (CLI-scaffolded via pnpm dlx shadcn@latest add button) — exports Button + buttonVariants (cva)"
  - "lib/utils.ts cn() helper (clsx + tailwind-merge) — the @/lib/utils import the CLI embeds into every scaffolded primitive"
  - "app/globals.css shadcn CSS variable layer — :root + .dark with --background/--foreground/--primary/--muted/--accent/--destructive + sidebar/chart/radius, @theme inline binding Tailwind utilities to the vars, so bg-muted (Plan 01-01) and every future primitive class resolve"
  - "runtime deps for shadcn primitives: class-variance-authority, clsx, tailwind-merge, lucide-react, radix-ui (v4 metapackage), tw-animate-css, shadcn (runtime for @import \"shadcn/tailwind.css\")"
affects: [01-03 sanity-studio, 01-04 vitest-middleware-test, 02 design-system-ds-01-token-swap, 02-ds-03-primitive-library]

# Tech tracking
tech-stack:
  added:
    - "class-variance-authority@0.7.1 — variant-based class generation used by Button and every future shadcn primitive"
    - "clsx@2.1.1 — conditional className composition, foundation of cn()"
    - "tailwind-merge@3.5.0 — dedupes conflicting Tailwind class tokens in cn()"
    - "lucide-react@1.8.0 — icon library (default for shadcn new-york/radix-nova); unused in Phase 1, wired for Phase 2+"
    - "radix-ui@1.4.3 — v4 CLI's consolidated Radix metapackage (replaces per-primitive @radix-ui/react-slot, @radix-ui/react-dialog, etc.); Button imports { Slot } from this"
    - "tw-animate-css@1.4.0 — Tailwind v4 animation utility set used by shadcn primitives"
    - "shadcn@4.4.0 — runtime CSS bundle (app/globals.css imports \"shadcn/tailwind.css\" for the radix-nova look)"
  patterns:
    - "Preset-in-place: hand-authored components.json with UI-SPEC preset values BEFORE running shadcn init — after init re-wrote it, retained the --base-color=neutral + cssVariables=true + aliases, accepted style=radix-nova (v4 successor to new-york) per CLI-authoritative discipline"
    - "pnpm dlx shadcn@latest init -b radix -t next -p nova --no-reinstall --force --yes — the exact non-interactive invocation that works in v4.4.0 (preset enumeration Nova/Vega/Maia/Lyra/Mira/Luma/Sera/Custom is new to v4)"
    - "Server-component import of shadcn Button — the v4 Button file has no 'use client' directive; imports Slot from radix-ui; React Server Component rendering works; the Radix Slot runtime gets bundled into the /root chunk (70.9kB First Load JS) by Next.js at build time"
    - "CSS-first Tailwind v4 + shadcn coexistence: @import \"tailwindcss\" + @import \"tw-animate-css\" + @import \"shadcn/tailwind.css\" + @theme inline { --color-* : var(--*); } exposes the CSS custom properties as Tailwind utilities (bg-muted, bg-primary, etc.) without a tailwind.config.js"
    - "Registry safety at file level: components.json top-level registries: {} object — empty first-party-only lock (UI-SPEC §Registry Safety / threat T-01-06 mitigation)"

key-files:
  created:
    - "components.json — shadcn registry config (radix-nova style, neutral baseColor, cssVariables=true, rsc=true, tsx=true, aliases @/components + @/lib/utils + @/components/ui + @/lib + @/hooks, iconLibrary lucide, registries {})"
    - "lib/utils.ts — CLI-scaffolded cn() helper (clsx + twMerge)"
    - "components/ui/button.tsx — CLI-scaffolded Button + buttonVariants via cva; variants default/outline/secondary/ghost/destructive/link; sizes default/xs/sm/lg/icon/icon-xs/icon-sm/icon-lg (radix-nova preset)"
  modified:
    - "app/globals.css — shadcn init replaced the Phase 0 body/font stub with the full shadcn CSS variable layer (:root + .dark themes, @theme inline Tailwind binding, @layer base body/html); existing Tailwind v4 @import \"tailwindcss\" preserved and supplemented with @import \"tw-animate-css\" + @import \"shadcn/tailwind.css\""
    - "app/root/page.tsx — imported Button from @/components/ui/button and uncommented the visible <Button>Example primitive</Button> instance (Task 2); hk + sg pages unchanged per UI-SPEC (only ONE visible instance across Phase 1)"
    - "package.json — new dependencies class-variance-authority, clsx, tailwind-merge, lucide-react, radix-ui, tw-animate-css, shadcn"
    - "pnpm-lock.yaml — updated to pin all new deps"

key-decisions:
  - "Accepted shadcn v4.4.0's preset-enumeration model (Nova/Vega/Maia/Lyra/Mira/Luma/Sera/Custom) instead of the classic style=new-york/default dichotomy — Nova IS the v4 successor to new-york (Lucide + Geist aesthetics) per the CLI's own description, and PATTERNS.md line 437 mandates treating CLI output as authoritative"
  - "Used -b radix (Radix primitives) over -b base (headless-only CSS) — Radix matches UI-SPEC §Design System requirement for Radix primitives via shadcn (line 23)"
  - "Wired visible <Button> directly in app/root/page.tsx as a Server Component import — the v4 Button has no 'use client' directive and the Radix Slot runtime bundles cleanly; no client-wrapper component (app/root/_components/example-button.tsx) was needed. Task 2's escape-hatch path stayed unused"
  - "Kept style=radix-nova in components.json instead of hand-patching it back to new-york — the UI-SPEC Phase 2 hand-off notes (§Hand-off 1–2) say style is cosmetic and Phase 2 DS-01 will overwrite CSS tokens regardless; CLI authority wins"

patterns-established:
  - "Two-commit rhythm for CLI-scaffolded tooling: chore() for init (config + deps + CSS scaffold), feat() for the first primitive install + consumer wiring. Phase 2 DS-03 inherits this rhythm for the full primitive-library rollout"
  - "Server-component-first shadcn imports: direct `import { Button } from \"@/components/ui/button\"` in Server Components is the default path; only fall back to the _components/*.tsx client-wrapper escape hatch if a build error actually proves it necessary (it did not here). Documents the Phase 2 DS-03 developer expectation"
  - "Deviation-tracking in commit body: both task commits included explicit DEVIATION (Rule 1 — spec/CLI version drift) sections, so git log --grep=\"DEVIATION\" surfaces every version-adaptation in the project history"

requirements-completed:
  - FOUND-02  # Tailwind + shadcn-pattern base typed — Plan 01-01 landed Next.js 15 + App Router; this plan closes the Tailwind (v4 is already live from Phase 0) + shadcn portions. FOUND-02 is now fully satisfied.

# Metrics
duration: ~11 min (two code tasks, no human checkpoint)
tasks: 2
files_created: 3
files_modified: 4
completed: 2026-04-22
---

# Phase 1 Plan 01-02: shadcn/ui CLI + Button primitive Summary

**shadcn/ui v4.4.0 initialized with radix-nova/neutral preset, cssVariables=true, rsc=true, tsx=true and aliases @/components + @/lib/utils — Button primitive installed, visible instance rendering on the root placeholder, `pnpm build` green under Next.js 15 + React 19 + Tailwind v4. The shadcn registry pipe is proven for Phase 2 DS-03's primitive-library expansion, and Plan 01-01's `bg-muted` utility now resolves to the shadcn neutral CSS variable.**

## Performance

- **Duration:** ~11 min (Task 1 init + Task 2 Button wire-up + verification, no human checkpoint required by this autonomous plan)
- **Started:** 2026-04-22T21:14:56Z
- **Task 1 committed:** `14c3627` (init)
- **Task 2 committed:** `c2c5045` (Button + root wiring)
- **Completed:** 2026-04-22T21:26:10Z (this summary commit)
- **Tasks:** 2 (both type=auto, autonomous)
- **Files:** 3 created, 4 modified (see key-files)

## Accomplishments

- `pnpm dlx shadcn@latest init -b radix -t next -p nova --no-reinstall --force --yes` completes non-interactively in v4.4.0 — the exact invocation is recorded in patterns-established for Plan 01-03 / Phase 2 reuse.
- `app/globals.css` now carries the full shadcn CSS variable layer (48 variables across `:root` + `.dark`, plus `@theme inline` Tailwind binding). Plan 01-01's `bg-muted` utility class on the three placeholder pages now resolves to `oklch(0.97 0 0)` (neutral-100 in the new oklch-based palette) in light mode — previously it was an undefined utility and silently rendered transparent.
- Button primitive lands at `components/ui/button.tsx` unmodified from CLI output; exports `Button` + `buttonVariants` via `cva()`; imports `{ Slot } from "radix-ui"` (v4's metapackage pattern) and `{ cn } from "@/lib/utils"`. No hand edits.
- Visible `<Button>Example primitive</Button>` renders on `app/root/page.tsx` as a direct Server Component import (no `"use client"` wrapper needed; Task 2 step 4's escape-hatch path stayed unused). UI-SPEC §Copywriting Contract line 109 honored — button has no `onClick`.
- `app/hk/page.tsx` and `app/sg/page.tsx` keep their `{/* <Button>... */}` comments — exactly one visible instance across Phase 1.
- `pnpm build` exits 0; `/root` First Load JS is 70.9kB (from Radix Slot client runtime); other routes stay at ~321B. Matches the UI-SPEC §Performance baseline escape clause ("server component with zero 'use client' in the Phase 1 import path **if possible**" — Button's own RSC compatibility means the import path is RSC, even though Radix's asChild machinery ships client JS to the bundle).
- `pnpm typecheck` exits 0.
- Registry safety: `components.json` top-level `registries: {}` — empty first-party lock (threat T-01-06 mitigation).

## Task Commits

1. **Task 1: shadcn init with preset** — `14c3627` (chore) — `components.json` + `lib/utils.ts` + `app/globals.css` + `package.json` + `pnpm-lock.yaml`. Used `pnpm dlx shadcn@latest init -b radix -t next -p nova --no-reinstall --force --yes`. Deviation recorded: style=radix-nova instead of style=new-york (v4 CLI removed the "new-york" value; radix-nova is its successor; UI-SPEC says style is cosmetic and Phase 2 DS-01 will overwrite tokens anyway).
2. **Task 2: add Button + wire example instance** — `c2c5045` (feat) — `components/ui/button.tsx` (CLI-scaffolded, untouched) + `app/root/page.tsx` (Button import + visible `<Button>Example primitive</Button>` rendered directly as a Server Component). Deviation recorded: radix-ui metapackage instead of @radix-ui/react-slot (v4 consolidation).

**Plan metadata commit:** this SUMMARY + STATE.md + ROADMAP.md updates (hash emitted by the final `gsd-tools commit` call).

## Files Created/Modified

- `components.json` (CREATED — repo root) — `$schema`, `style: "radix-nova"`, `rsc: true`, `tsx: true`, `tailwind.config: ""`, `tailwind.css: "app/globals.css"`, `tailwind.baseColor: "neutral"`, `tailwind.cssVariables: true`, `tailwind.prefix: ""`, `iconLibrary: "lucide"`, `rtl: false`, `aliases.components: "@/components"`, `aliases.utils: "@/lib/utils"`, `aliases.ui: "@/components/ui"`, `aliases.lib: "@/lib"`, `aliases.hooks: "@/hooks"`, `menuColor: "default"`, `menuAccent: "subtle"`, `registries: {}`.
- `lib/utils.ts` (CREATED) — 6 lines; CLI-scaffolded `cn()` helper using `clsx` + `twMerge`. No modifications.
- `components/ui/button.tsx` (CREATED) — 67 lines; CLI-scaffolded Button + buttonVariants (cva). Variants: default, outline, secondary, ghost, destructive, link. Sizes: default, xs, sm, lg, icon, icon-xs, icon-sm, icon-lg. Imports `{ Slot } from "radix-ui"`, `{ cn } from "@/lib/utils"`, `{ cva, type VariantProps } from "class-variance-authority"`. No hand edits.
- `app/globals.css` (MODIFIED) — Phase 0's 26-line stub replaced with the shadcn v4 CSS variable layer: `@import "tailwindcss"` preserved at line 1, plus new `@import "tw-animate-css"` and `@import "shadcn/tailwind.css"`. `@theme inline` block (lines 7–49) binds Tailwind utility classes to the CSS vars (e.g. `bg-muted` → `var(--muted)`). `:root` (lines 51–84) defines the light-mode oklch values. `.dark` (lines 86–118) defines dark-mode. `@layer base` (lines 120–130) applies `bg-background` / `text-foreground` to body and `font-sans` to html.
- `app/root/page.tsx` (MODIFIED) — added `import { Button } from "@/components/ui/button";`, added updated comment crediting Plan 01-02, replaced the `{/* <Button>Example primitive</Button> */}` comment with a visible `<div className="mt-4"><Button>Example primitive</Button></div>` block. hk + sg pages unchanged.
- `package.json` (MODIFIED) — new dependencies: `class-variance-authority@0.7.1`, `clsx@2.1.1`, `lucide-react@1.8.0`, `radix-ui@1.4.3`, `tailwind-merge@3.5.0`, `tw-animate-css@1.4.0`, `shadcn@4.4.0`. All in `dependencies` (runtime).
- `pnpm-lock.yaml` (MODIFIED) — updated to pin all new deps (3355 insertions in lockfile).

## components.json (verbatim — for Phase 2 reference)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {}
}
```

Phase 2 DS-01 (token swap) needs to override the `:root` and `.dark` CSS variable definitions in `app/globals.css` with the real ProActiv brand tokens (`#0f206c` navy → `--primary`, `#ec1c24` red → `--destructive` or a new `--brand-accent`, green/sky/yellow/cream → secondary + accent roles, neutrals remapped). The `@theme inline` binding table is fixed — DS-01 should edit only the variable values in `:root` / `.dark`, not the utility→var mapping.

## Decisions Made

- **Preset choice: `-p nova` (not a user prompt).** v4.4.0 introduced an eight-option preset enumeration (Nova/Vega/Maia/Lyra/Mira/Luma/Sera/Custom). Nova is described by the CLI itself as "Lucide / Geist" — the direct successor to the old `new-york` style. Chose Nova over Custom to avoid multi-prompt interactive setup; deviation from UI-SPEC's literal `style=new-york` value is documented (UI-SPEC line 30 says style is cosmetic).
- **Base choice: `-b radix` (not `-b base`).** UI-SPEC §Design System line 23 requires "Radix primitives via shadcn/ui" — `-b radix` installs the `radix-ui` metapackage; `-b base` would have installed headless-only CSS. Non-negotiable given the UI-SPEC.
- **components.json written BEFORE init.** Hand-authored with UI-SPEC preset values first (baseColor=neutral, cssVariables=true, rsc=true, tsx=true, the five aliases); the subsequent `init --force` overwrote some fields (added `rtl`, `menuColor`, `menuAccent`, `registries`; changed `style` from my seeded `new-york` to `radix-nova`) but retained the four non-negotiable values (baseColor, cssVariables, rsc, tsx — plus all five aliases). This is the cleanest pattern for the v4 CLI's interactive-heavy init in non-interactive contexts.
- **Direct Server Component import of Button** (no `_components/example-button.tsx` client wrapper). The v4 Button file has no `"use client"` directive; it's a plain function component; the Radix Slot runtime bundles into the route chunk at build time but the import path stays RSC-compatible. UI-SPEC §Performance baseline line 192's "if possible" escape clause honored — tried the RSC path first, it worked.
- **`lucide-react@1.8.0` is the current latest** (verified via `npm view lucide-react version`). The low major version is NOT a shadcn-introduced regression — lucide-react's versioning has always used the `1.x` line.
- **Did NOT restore Tailwind v4's `body { font-family: Arial... }` fallback from Phase 0's globals.css.** shadcn init replaced that stub with `@layer base { body { @apply bg-background text-foreground; } html { @apply font-sans; } }`. `font-sans` resolves to `var(--font-sans)` which is shadcn's radix-nova font token (Geist for this preset). The Phase 0 Arial/Helvetica fallback was boilerplate; the shadcn replacement is higher-fidelity.

## Deviations from Plan

### Auto-fixed Issues / Adaptations

**1. [Rule 1 — Spec/CLI version drift] `style: "new-york"` → `style: "radix-nova"`**
- **Found during:** Task 1 (shadcn init)
- **Issue:** UI-SPEC §Design System table line 19 specifies `style=new-york`. shadcn v4.4.0's `init` command uses preset-enumeration (Nova/Vega/Maia/Lyra/Mira/Luma/Sera/Custom) and writes `style: "radix-nova"` for the Radix + Nova combination; `new-york` is no longer an accepted value. The plan's Task 1 verification block hard-codes `grep -q '"style": "new-york"' components.json`.
- **Fix:** Accepted CLI output as authoritative per 01-PATTERNS.md line 437 ("treat the CLI output as authoritative, don't hand-author"). Did NOT hand-patch `style` back to `"new-york"` — that value would mean nothing to future `shadcn add` invocations.
- **Files modified:** `components.json`
- **Commit:** `14c3627`
- **Justification:** UI-SPEC §Design System line 30 explicitly says style is "cosmetic; Phase 2 will not refactor either way." UI-SPEC §Phase 2 Hand-off Note 1 says CSS variables are the token contract, not the style string. Deviation is safe for Phase 2 DS-01.

**2. [Rule 1 — Spec/CLI version drift] `@radix-ui/react-slot` → `radix-ui` metapackage**
- **Found during:** Task 2 (button.tsx inspection after `shadcn add button`)
- **Issue:** Plan's `<interfaces>` section (line 107) and acceptance criteria mention `@radix-ui/react-slot` as the expected dependency for Button's `asChild` machinery. shadcn v4 button.tsx instead imports `import { Slot } from "radix-ui"` — the v4 CLI migrated to the consolidated `radix-ui` metapackage.
- **Fix:** Accepted CLI output per 01-PATTERNS.md authoritative rule. `radix-ui@1.4.3` is now in `package.json` dependencies; `@radix-ui/react-slot` is absent.
- **Files modified:** `package.json`, `components/ui/button.tsx` (CLI-scaffolded)
- **Commit:** `c2c5045`
- **Justification:** Both packages expose the same `Slot` primitive API. The metapackage is the forward-looking choice; Phase 2 DS-03 primitives will use the same import root, keeping the dep list minimal.

### Deferred Items (out of scope for this plan)

- **Untracked `.planning/phases/02-design-system-component-gallery-media-pipeline/`** directory existed in the working tree before this plan started (left by the orchestrator / prior phase-2 context scouting). NOT touched by Plan 01-02. Remains untracked; Phase 2 planning will commit it when that phase opens.
- **`M .planning/config.json`** — pre-existing modification (workflow flag toggled by orchestrator); left untouched per scope-boundary rule.

No Rule 2 / Rule 3 / Rule 4 interventions were triggered. No architectural decisions needed.

## Issues Encountered

- **shadcn v4.4.0's init is more interactive than v2.** First attempt with `--base-color neutral` failed with `unknown option`; second attempt via the add-then-init flow paused waiting for "Would you like to re-install existing UI components?"; third attempt added `--no-reinstall --force --yes -b radix -t next -p nova` and succeeded cleanly. The working invocation is now recorded in patterns-established.
- **First `shadcn add button` (pre-init) wrote a stub `button.tsx` that referenced `@/lib/utils` before `lib/utils.ts` existed.** This was transient — the subsequent `shadcn init` re-wrote both `button.tsx` AND created `lib/utils.ts`, resolving the dangling import. No manual patch needed.
- **No `components/ui/button.tsx` in the init's post-write file list** — the CLI output said "Updated 1 file: components/ui/button.tsx" (because the pre-init `shadcn add` had already created it). Version-on-disk matches the radix-nova preset (verified by the updated variant set).

## Known Stubs

None. All shadcn artifacts are CLI-scaffolded with real data; no placeholder returns, no hardcoded empty arrays, no "coming soon" copy.

## Self-Check

- `components.json` at repo root: FOUND
- `lib/utils.ts` exists: FOUND
- `components/ui/button.tsx` exists: FOUND
- `app/globals.css` contains `--background`: FOUND
- `app/globals.css` contains `--primary`: FOUND
- `app/globals.css` contains `--muted`: FOUND
- `app/globals.css` contains `@theme inline`: FOUND
- `package.json` contains `class-variance-authority`: FOUND
- `package.json` contains `clsx`: FOUND
- `package.json` contains `tailwind-merge`: FOUND
- `package.json` contains `lucide-react`: FOUND
- `package.json` contains `radix-ui`: FOUND
- `app/root/page.tsx` imports Button: FOUND
- `app/root/page.tsx` renders `<Button>Example primitive</Button>`: FOUND
- `app/hk/page.tsx` keeps `{/* <Button>` comment: FOUND
- `app/sg/page.tsx` keeps `{/* <Button>` comment: FOUND
- `components.json` `registries` is empty object: FOUND
- Commit `14c3627` in git log: FOUND
- Commit `c2c5045` in git log: FOUND
- `pnpm typecheck` exits 0: VERIFIED
- `pnpm build` exits 0: VERIFIED

## Self-Check: PASSED

## Notes for Plan 01-03 (Sanity Studio mount)

- Plan 01-03 will add `next-sanity`, `sanity`, `@sanity/vision`, `@sanity/presentation`, `@sanity/structure` to dependencies. These coexist with the shadcn deps landed here; no known conflicts. Ensure Plan 01-03's `pnpm install` run produces a clean lockfile delta.
- Plan 01-03 may also want to render a shadcn `<Button>` inside the `/studio` chrome as a "back to site" link (not required by UI-SPEC, but useful DX). If so, import directly from `@/components/ui/button`; the aliases are proven.
- No touches needed to `components.json`, `lib/utils.ts`, or `app/globals.css` from Plan 01-03.

## Notes for Plan 01-04 (Vitest middleware test)

- Plan 01-04 adds `vitest` + optional `@vitest/ui` to devDependencies. `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `radix-ui`, `tw-animate-css`, `shadcn` are in `dependencies` (runtime); they should not affect Vitest's module resolution.
- The v4 Button's `radix-ui` metapackage import means that if Plan 01-04 ever adds a React component-level test (out of scope — the plan is middleware-only), the test runner must resolve `radix-ui` without issue.

## Notes for Phase 2 (DS-01 token swap, DS-03 primitive library)

- **DS-01 (token swap):** Edit only the oklch values in `:root` + `.dark` inside `app/globals.css`. Do NOT touch the `@theme inline { ... }` binding table — that's the Tailwind utility → var mapping and Phase 1 Plan 01-02 relies on it staying exactly as shadcn CLI emitted. Real tokens:
  - `#0f206c` navy → `--primary` (convert to oklch via `npx @csstools/cli oklch` or Figma plugin)
  - `#ec1c24` red → could go to `--destructive` OR a new `--brand-accent`; plan at DS-01 time
  - `#0f9733` green / `#0fa0e2` sky / `#fac049` yellow / `#fff3dd` cream → `--secondary` / `--accent` / new `--success` / new `--surface`
- **DS-03 (primitive library):** Use `pnpm dlx shadcn@latest add <primitive>` for each new primitive — the v4 CLI adds to the existing `components.json` cleanly. If DS-03 introduces third-party blocks (tremor, aceternity, magicui) per UI-SPEC §Registry Safety's Future-phase note, add entries to `components.json.registries` only after running the `npx shadcn view` vetting gate.
- **DS-02 (typography):** Phase 0 / Phase 1's Geist font remains wired via `next/font` in `app/layout.tsx`. DS-02 replaces Geist with self-hosted Bloc Bold + Mont + Baloo via `next/font/local`. The `--font-sans` CSS variable (currently bound to `var(--font-sans)` via `@theme inline` line 10) will be the swap point.

## Checkpoint Outcome

N/A — plan is `autonomous: true` with no checkpoints. Both tasks executed sequentially; verification + commits ran inline.

---
*Phase: 01-next-js-foundation-subdomain-middleware-sanity-studio-scaffold-vercel-previews*
*Plan: 01-02*
*Completed: 2026-04-22*

---
phase: 06-sanity-content-models-editor-ux-webhook-isr
plan: 06-01
status: complete
started: 2026-04-25
completed: 2026-04-25
subsystem: cms
tags: [sanity, typegen, imageWithAlt, pnpm, env]

requires:
  - phase: 01-next-js-foundation-subdomain-middleware-sanity-studio-scaffold-vercel-previews
    provides: sanity schema stubs (camp, coach, faq, page, post, siteSettings, testimonial, venue)

provides:
  - "@portabletext/react@6 and @sanity/image-url@2 installed"
  - "sanity.cli.ts with TypeGen config (declarations: types/sanity.generated.ts)"
  - "pnpm typegen script (sanity schema extract && sanity typegen generate)"
  - "types/sanity.generated.ts placeholder (run pnpm typegen to populate)"
  - "sanity/schemaTypes/shared/imageWithAlt.ts with hotspot + alt required validation"
  - "schema barrel updated to import all 11 types + imageWithAlt shared type"
  - ".env.example extended with SANITY_REVALIDATE_SECRET and SANITY_API_BROWSER_TOKEN"

affects: [06-02, 06-03, 06-04, 06-07]

tech-stack:
  added:
    - "@portabletext/react@^6.0.3 (plan suggested ^3.x — current latest is v6, Rule 1 adaptation)"
    - "@sanity/image-url@^2.1.1 (plan suggested ^1.x — current latest is v2, Rule 1 adaptation)"
  patterns:
    - "All image fields across all schemas MUST use imageWithAlt type — no bare { type: 'image' }"
    - "TypeGen generates types/sanity.generated.ts — run after schema changes"
    - "sanity.cli.ts at repo root is required for pnpm typegen to find project config"

key-files:
  created:
    - sanity.cli.ts
    - types/sanity.generated.ts
    - sanity/schemaTypes/shared/imageWithAlt.ts
  modified:
    - package.json (added 2 deps + typegen script)
    - pnpm-lock.yaml
    - .env.example (Phase 6 vars appended)
    - sanity/schemaTypes/index.ts (full 11-type barrel)
---

# Plan 06-01 Summary: Foundation — Packages, TypeGen, Env, imageWithAlt

## What Was Built

Installed the two new npm packages needed for Phase 6, wired the TypeGen CLI script, extended `.env.example` with the Phase 6 env contract, created the shared `imageWithAlt` type that all other schemas depend on, and updated the schema barrel to forward-declare all 11 schema types (ready for Plan 06-02 to fill in their implementations).

## Tasks Completed

| # | Task | Status | Commit |
|---|------|--------|--------|
| 1 | Install @portabletext/react + @sanity/image-url | Done | 0f4dc0b |
| 2 | Create sanity.cli.ts + pnpm typegen script + types placeholder | Done | 2b84ad7 |
| 3 | Create shared imageWithAlt type | Done | d893e0d |
| 4 | Extend .env.example + update schema barrel | Done | 1eb90ab |

## Deviations

- `@portabletext/react` installed as `^6.0.3` (plan referenced `^3.x`). v6 is the current stable release; Rule 1 adaptation (no API break for our usage).
- `@sanity/image-url` installed as `^2.1.1` (plan referenced `^1.x`). v2 is the current stable release; Rule 1 adaptation.

## Self-Check

- [x] `pnpm add @portabletext/react @sanity/image-url` succeeds
- [x] `sanity.cli.ts` exists at repo root with `typegen.declarations: 'types/sanity.generated.ts'`
- [x] `package.json` has typegen script
- [x] `sanity/schemaTypes/shared/imageWithAlt.ts` exists with hotspot + validation
- [x] `.env.example` has SANITY_REVALIDATE_SECRET and SANITY_API_BROWSER_TOKEN
- [x] Schema barrel imports all 11 types + imageWithAlt

## Self-Check: PASSED

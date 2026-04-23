---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Phase 02 Plan 02-02 complete — Wave 1 done, Wave 2 ready
last_updated: "2026-04-23T15:13:00.000Z"
last_activity: 2026-04-23 -- Plan 02-02 (typography) shipped after D-01 amendment
progress:
  total_phases: 11
  completed_phases: 2
  total_plans: 21
  completed_plans: 13
  percent: 62
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-22)

**Core value:** Convert affluent parents into trial bookings and enquiries; SEO + LLM visibility serve that goal.
**Current focus:** Phase 02 — design-system-component-gallery-media-pipeline

## Current Position

Phase: 02 (design-system-component-gallery-media-pipeline) — EXECUTING
Plan: 3 of 6 complete (Wave 1: 02-01 ✓, 02-02 ✓, 02-03 ✓)
Next: Wave 2 — 02-04 (custom primitives), 02-05 (image pipeline), 02-06 (/_design/ gallery)
Status: Wave 2 unblocked; ready to execute
Last activity: 2026-04-23 -- Plan 02-02 typography shipped (Unbounded + Manrope + Baloo 2 via next/font/google after D-01 amendment)

Progress: [█████░░░░░] 50% of Phase 02 plans complete

## Performance Metrics

**Velocity:**

- Total plans completed: 13
- Average duration: —
- Total execution time: 0.0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| — | — | — | — |
| 0 | 6 | - | - |
| 01 | 4 | - | - |

**Recent Trend:**

- Last 5 plans: (none yet)
- Trend: —

*Updated after each plan completion*
| Phase 01 P01 | 30min | 3 tasks | 9 files |
| Phase 01 P02 | 11min | 2 tasks | 7 files |
| Phase 01 P03 | multi-session | 4 tasks | 18 files |
| Phase 01 P04 | 10min | 3 tasks | 5 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table. Recent decisions affecting current work:

- Init: 3-layer subdomain ecosystem (root + hk + sg) with shared Org schema — pending post-launch validation
- Init: Sanity over Payload for CMS — priority is non-technical editor UX
- Init: Single Next.js 15 app with subdomain middleware — not three separate apps
- Init: Quality model profile (opus on planning agents) — long-lived client production site
- Init: Skip GSD research step — `.planning/inputs/strategy.md` is the research
- 2026-04-22: Domain/DNS/Cloudflare/WAF work deferred to Phase 10 — build entirely on Vercel preview URLs through Phase 9; `proactivsports.com` is attached at launch only. Rationale: user wants build-first, connect-domain-last; Vercel previews give full-stack testability without needing DNS changes.
- 2026-04-22: Rejected one.com as a staging / hosting option — its shared PHP hosting can't run Next.js middleware or ISR; forcing a static export would break the core architecture. Vercel previews serve the "staging" need for free.
- [Phase 01]: 2026-04-22: Accepted shadcn v4.4.0's preset-enumeration model (Nova/Vega/Maia/Lyra/Mira/Luma/Sera/Custom). Used -p nova (v4 successor to new-york) — UI-SPEC says style is cosmetic; CLI output is authoritative per PATTERNS.md
- [Phase 01]: 2026-04-22: Wired visible shadcn Button directly in app/root/page.tsx as a Server Component import — no 'use client' client-wrapper needed; v4 Button file has no 'use client' directive and Radix Slot runtime bundles cleanly at build time
- [Phase 01 / Plan 01-03]: 2026-04-22: next-sanity pinned to ^11.6.13 (not v12) — v12 requires Next 16; repo is on Next 15.5.15. Rule 1 library-version adaptation, no user approval needed
- [Phase 01 / Plan 01-03]: 2026-04-22: presentationTool registered with previewUrl:"/" stub instead of empty config — Sanity v5.22.0 TypeScript makes previewUrl non-optional. User-approved Rule 1 adaptation; Phase 6 CMS-05 swaps in real previewUrl resolver. D-14 install-only posture preserved
- [Phase 01 / Plan 01-03]: 2026-04-22: Build toolchain switched from webpack to Turbopack (dev + build scripts) — React 19.2 exposes useEffectEvent via a conditional CJS stub that webpack's static named-export analyzer can't trace; sanity v5 PresentationToolGrantsCheck + LiveQueries hit that interop failure. Turbopack handles it natively. transpilePackages in next.config.ts kept as defensive config. User-approved
- [Phase 01 / Plan 01-03]: 2026-04-22: Corrected client/server boundary for embedded Studio — 'use client' at top of sanity.config.ts (v11 canonical); app/studio/[[...tool]]/page.tsx is a Server Component re-exporting metadata+viewport from next-sanity/studio. Per next-sanity@11 README lines 1044–1099
- [Phase 01]: Plan 01-04: installed Vitest 4.1.5 (current stable, not the ^2 suggested in context note) scoped to middleware + pure-TS tests; 11-test middleware.test.ts encodes D-02/D-16 host authority + D-04 internal-rewrite + D-07 studio pass-through as CI regression gates. Helper uses Variant A (explicit host header) per Task 1 probe finding: req.headers.get('host') is null without explicit RequestInit.headers.host.
- [Phase 01]: Plan 01-04: added NEXT_PUBLIC_SANITY_PROJECT_ID/DATASET=build-placeholder to ci.yml Build step env. sanity.config.ts throws at module-eval if missing (Plan 01-03 fail-fast); Vercel injects real values at deploy time; CI just needs build compile. Studio runs client-side only — placeholders are safe.
- [Phase 02 / D-01 amended]: 2026-04-23: Brand typography pivoted from Bloc Bold (Zetafonts, commercial) + Mont (Fontfabric, commercial) self-hosted via next/font/local → Unbounded + Manrope + Baloo 2 via next/font/google (all OFL/free-for-commercial). User preference for accessible free stack; unblocked Plan 02-02 without the D-02 HUMAN-ACTION gate on foundry-portal downloads. D-02 obsoleted. Commercial licenses preserved for possible future re-introduction. CSS vars renamed internally (--font-bloc/mont → --font-unbounded/manrope) — public Tailwind utilities font-display / font-sans / font-accent unchanged.

### Pending Todos

None yet.

### Blockers/Concerns

None blocking Phase 0. Note for Phase 10: `proactivsports.com` transfer prep — gather registrar auth code / EPP code closer to Phase 10 start.

## Deferred Items

Items acknowledged and carried forward (from requirements / scope decisions):

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| Conversion | Direct online booking with payment (POST-01) | v1.5 | Init |
| Conversion | Parent portal (POST-02) | v1.5 | Init |
| Content | Multilingual zh-HK (POST-03) | v1.5 | Init |
| Content | Backlink framework ops (POST-04) | v1.5 starts ops in Phase 10 | Init |
| Content | Tier 3–4 blog clusters (POST-05) | v1.5 / months 3–12 | Init |

## Session Continuity

Last session: 2026-04-23T15:13:00.000Z
Stopped at: Plan 02-02 shipped — Phase 02 Wave 1 complete; Wave 2 (02-04 / 02-05 / 02-06) unblocked
Resume file: — (no mid-plan checkpoint; next action is `/gsd-execute-phase 2` for Wave 2)
Recent commits:
  - 3569f5a docs(03): sync roadmap plan list + config flag from prior planning session
  - 032f57e docs(02): amend D-01 — drop Bloc Bold + Mont for free Google Fonts stack
  - 01b8849 feat(02-02): wire brand typography via next/font/google
Pipelined: Phase 03 RESEARCH.md drafted in background (untracked) — promote when Phase 02 closes

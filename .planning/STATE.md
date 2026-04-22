---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: verifying
stopped_at: Completed 01-04-PLAN.md (Vitest middleware regression tests + 5th CI check — Phase 1 scope closed)
last_updated: "2026-04-22T22:43:37.141Z"
last_activity: 2026-04-22
progress:
  total_phases: 11
  completed_phases: 2
  total_plans: 10
  completed_plans: 10
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-22)

**Core value:** Convert affluent parents into trial bookings and enquiries; SEO + LLM visibility serve that goal.
**Current focus:** Phase 01 — next-js-foundation-subdomain-middleware-sanity-studio-scaffold-vercel-previews

## Current Position

Phase: 02
Plan: Not started
Status: Phase complete — ready for verification
Last activity: 2026-04-22

Progress: [░░░░░░░░░░] 0%

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

Last session: 2026-04-22T22:28:53.470Z
Stopped at: Completed 01-04-PLAN.md (Vitest middleware regression tests + 5th CI check — Phase 1 scope closed)
Resume file: None

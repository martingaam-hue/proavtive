---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Phase 02 Plan 02-06 Task 3 — awaiting human visual verify on /_design gallery
last_updated: "2026-04-23T22:00:00.000Z"
last_activity: 2026-04-23 -- Phase 02 Wave 2 + Wave 3 executed; 02-04/05/06 all at 2/2, 4/4, 2/2 code complete; Task 3 pending Martin's visual inspection
progress:
  total_phases: 11
  completed_phases: 2
  total_plans: 21
  completed_plans: 15
  percent: 71
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-22)

**Core value:** Convert affluent parents into trial bookings and enquiries; SEO + LLM visibility serve that goal.
**Current focus:** Phase 02 — design-system-component-gallery-media-pipeline

## Current Position

Phase: 02 (design-system-component-gallery-media-pipeline) — EXECUTING
Plans: 5 of 6 fully done (02-01 ✓, 02-02 ✓, 02-03 ✓, 02-04 ✓, 02-05 ✓); 02-06 Tasks 1+2 code-complete + automated sub-checks run, Task 3 pending Martin's visual verify
Next: Martin inspects `http://localhost:3000/_design` (`pnpm build && pnpm start`) — approves or requests revision
Status: PAUSED on HUMAN-VERIFY (Plan 02-06 Task 3 visual inspection)
Last activity: 2026-04-23 -- 12 photos processed (87 MB → 8.7 MB); /_design gallery scaffolded + populated with all 14 primitives; Lighthouse a11y 96/100, axe-core 0 criticals

Progress: [█████████░] 95% of Phase 02 code complete — visual-verify gate is the final checkpoint

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
- [Phase 02 / D-05 + D-07 amended]: 2026-04-23: Photo curation policy relaxed to allow mixed real-ProActiv + OFL stock placeholder imagery for Phase 2 gallery coverage. D-05's "one real ProActiv photograph per primitive" requirement kept for Phase 4/5 market pages but waived for Phase 2's `/_design/` gallery. 12 photos staged: 11 real ProActiv (HK venues + programmes + testimonials) + 1 Unsplash placeholder for SG (David Trinks, OFL / no-attribution, marked `sg-placeholder-*` for Phase 5 replacement).

### Pending Todos

None yet.

### Blockers/Concerns

**Active: visual-verify pause (Plan 02-06 Task 3, 2026-04-23):** Martin to inspect `http://localhost:3000/_design` via `pnpm build && pnpm start`. Checklist:
1. Keyboard Tab walk — every interactive element shows a visible navy focus ring
2. Editorial-asymmetry verdict (UI-SPEC §7) — gallery reads as brand-led, NOT an "AI-SaaS" grid template
3. "Does this feel like ProActiv" — navy primary, yellow accent, confident display type, real photography
Then type one of: `approved` · `editorial-fail: <note>` · `a11y-fail: <detail>` · `visual-fail: <detail>`.

**Known non-blocking regressions captured in 02-06-SUMMARY.md:**
- Lighthouse Performance 55–81 (target ≥95) — driven by Mux VideoPlayer bootup; acceptable for `/_design` only; real market pages don't embed VideoPlayer by default; revisit at Phase 10 when real Mux integration happens
- LCP 2.9–7.7s — same Mux root cause
- 2 axe-core serious violations — 1 Mux internal (upstream dependency), 1 Button contrast from Plan 02-03 (out-of-scope for this plan; tracked as a Phase 2 refinement-candidate)

**Replacement targets carried into Phase 4/5:**
- HK real-photography swap-ins (if any placeholder was used, none were in the 2026-04-23 staging) — Phase 4 owns
- SG Prodigy real photography — Phase 5 replaces `sg-placeholder-climbing-unsplash-trinks.*` (David Trinks / Unsplash License / Vernon CT climbing facility) with real Katong Point imagery

Note for Phase 10: `proactivsports.com` transfer prep — gather registrar auth code / EPP code closer to Phase 10 start. Also revisit Mux player performance when real playback IDs land.

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

Last session: 2026-04-23T22:00:00.000Z
Stopped at: Plan 02-06 Task 3 — human-verify pause on `/_design` gallery. Martin to run `pnpm build && pnpm start` and visit `http://localhost:3000/_design`, then type approve/fail-type signal.
Resume file: .planning/phases/02-design-system-component-gallery-media-pipeline/02-06-SUMMARY.md (full measured metrics + 5 auto-fixed deviations + resume-signal grammar)
Recent commits (this session):
  - 3569f5a docs(03): sync roadmap plan list + config flag from prior planning session
  - 032f57e docs(02): amend D-01 — drop Bloc Bold + Mont for free Google Fonts stack
  - 01b8849 feat(02-02): wire brand typography via next/font/google
  - 3c49a90 docs(state): plan 02-02 complete, phase 02 wave 1 done
  - 3bab5ed feat(02-04): add Section + ContainerEditorial + FAQItem primitives
  - a81398e feat(02-04): add MarketCard + ProgrammeTile + TestimonialCard primitives
  - 309ed77 feat(02-04): add StatStrip + LogoWall primitives
  - 47757e1 docs(02-04): complete custom-primitives plan
  - 6d86339 feat(02-05): add image config + install sharp and @mux/mux-player-react
  - b5ccbcd feat(02-05): add sharp preprocessing script + photo staging scaffolding
  - 4d8126b feat(02-05): add VideoPlayer shell wrapping @mux/mux-player-react
  - fe6de2b docs(02-05): complete media-pipeline plan (3/4 tasks; Task 4 awaits curation)
  - 5c6afbd docs(state): wave 2 progress — 02-04 done, 02-05 paused
  - 9162e23 docs(02): amend D-05 + D-07 — allow placeholder imagery for Phase 2 gallery
  - afb5331 feat(02-05): process 12 curated photos → public/photography/ AVIF+WebP+JPG
  - ca06e1e docs(02-05): mark plan complete after Task 4 photos:process run
  - 7c30d52 feat(02-06): scaffold /_design gallery route + layout + sidebar nav
  - ad62fce feat(02-06): populate /_design gallery with all 14 primitives + foundation
  - 0647b5a fix(02-06): address Lighthouse + axe-core a11y findings on /_design
  - 48d9e76 docs(02-06): complete gallery assembly plan (Task 3 pending human-verify)
Pipelined: Phase 03 RESEARCH.md drafted in background (untracked) — promote when Phase 02 closes

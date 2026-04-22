---
phase: 01-next-js-foundation-subdomain-middleware-sanity-studio-scaffold-vercel-previews
verified: 2026-04-22T00:34:00Z
status: human_needed
score: 12/14 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Open http://root.localhost:3000/, http://hk.localhost:3000/, http://sg.localhost:3000/ in Chrome. Confirm each tab title, confirm stripe color (slate/amber/teal), confirm URL bar shows no /root|/hk|/sg prefix."
    expected: "Three visually distinct placeholders render, URL bar stays clean (D-04 URL-bar invariant)."
    why_human: "Browser rendering behavior, tab title, URL bar cleanliness — unverifiable by grep or test runner."
  - test: "Open the Vercel dashboard for this project and confirm a successful Vercel preview deployment exists with all 5 CI checks green (Typecheck, Lint, Format check, Build, Unit tests, Gitleaks)."
    expected: "A preview URL like <sha>-proactive.vercel.app is accessible; Vercel env carries NEXT_PUBLIC_SANITY_PROJECT_ID + NEXT_PUBLIC_SANITY_DATASET + SANITY_API_READ_TOKEN; Studio OAuth login renders at <preview-url>/studio."
    why_human: "Vercel preview deployment state and CI check results require accessing the Vercel and GitHub Actions dashboards. Cannot be verified from the local filesystem."
---

# Phase 1: Next.js Foundation, Subdomain Middleware, Sanity Studio Scaffold, Vercel Previews — Verification Report

**Phase Goal:** A single Next.js 15 app boots on Vercel preview URLs, middleware routes requests by subdomain into three separate route trees, and an empty but reachable Sanity Studio exists. Subdomain routing is validated either via `*.vercel.app` preview-host conventions or `*.localhost` for local testing — the real `*.proactivsports.com` bindings happen in Phase 10.
**Verified:** 2026-04-22T00:34:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | root.localhost:3000/ renders root placeholder with slate-400 top stripe and verbatim copy "ProActiv Sports — Root" | VERIFIED | `app/root/layout.tsx` contains `bg-slate-400`; `app/root/page.tsx` contains exact h1 text; title is "ProActiv Sports — Root (Phase 1 placeholder)" |
| 2 | hk.localhost:3000/ renders HK placeholder with amber-400 top stripe and verbatim copy "ProActiv Sports — Hong Kong" | VERIFIED | `app/hk/layout.tsx` contains `bg-amber-400`; `app/hk/page.tsx` contains exact h1 text; title is "ProActiv Sports — Hong Kong (Phase 1 placeholder)" |
| 3 | sg.localhost:3000/ renders SG placeholder with teal-400 top stripe and verbatim copy "ProActiv Sports — Singapore" | VERIFIED | `app/sg/layout.tsx` contains `bg-teal-400`; `app/sg/page.tsx` contains exact h1 text; title is "ProActiv Sports — Singapore (Phase 1 placeholder)" |
| 4 | Host: hk.proactivsports.com + cookie x-market=sg + ?__market=sg still rewrites to /hk (Host is authoritative, D-02) | VERIFIED | `middleware.test.ts` Test 1 asserts exactly this: `expect(rewrite).toContain("/hk/programmes")` and `.not.toContain("/sg/")`. `pnpm test:unit` passes 11/11. |
| 5 | Unknown host (e.g. foo.vercel.app, no cookie) rewrites to /root (D-03 default) | VERIFIED | `middleware.test.ts` Test 3 asserts unknown vercel preview host → rewrite contains "/root". |
| 6 | D-04 internal-rewrite invariant: middleware response has x-middleware-rewrite header PRESENT and Location header ABSENT | VERIFIED | `middleware.test.ts` Test 9: `expect(res.headers.get("location")).toBeNull()` and `expect(rewrite).toContain("/hk/")`. `pnpm test:unit` passes. |
| 7 | D-07 /studio pass-through: config.matcher excludes studio from middleware interception on any host | VERIFIED | `middleware.ts` line 119 contains `studio` in the negative-lookahead. `middleware.test.ts` Test 10 asserts `matcherPattern` contains `"studio"` inside `(?!...)`. |
| 8 | CI workflow has Unit tests step (pnpm test:unit) as required check 4 between Build and Gitleaks | VERIFIED | `.github/workflows/ci.yml` contains `name: Unit tests` with `run: pnpm test:unit` between Build and Gitleaks steps. No `continue-on-error`. Header comment cites D-17. |
| 9 | pnpm test:unit runs and exits 0 with all middleware tests passing | VERIFIED | Executed locally: 11 passed (1) test file, 11 tests, 337ms. |
| 10 | pnpm build exits 0 — all 4 routes compile (root, hk, sg, studio) | VERIFIED | Build output: 7 pages generated including /hk, /root, /sg, /studio/[[...tool]]. |
| 11 | shadcn/ui CLI initialized with cssVariables=true, neutral baseColor; Button primitive exists with buttonVariants; lib/utils.ts exports cn(); globals.css declares CSS variables | VERIFIED | `components.json` has `cssVariables: true`, `baseColor: neutral`. `components/ui/button.tsx` exports `buttonVariants` via `cva`. `lib/utils.ts` exports `cn()`. `app/globals.css` contains `--background`, `--primary`, `--muted`. |
| 12 | Sanity Studio scaffold: /studio route exists, 8 schema stubs in sanity/schemaTypes/, siteSettings singleton in sanity/structure.ts, plugins Structure+Vision+Presentation registered in sanity.config.ts | VERIFIED | All 8 stubs confirmed (siteSettings, page, post, venue, coach, camp, testimonial, faq). `sanity/structure.ts` wires siteSettings singleton. `sanity.config.ts` registers all three plugins. `app/studio/[[...tool]]/page.tsx` mounts `<NextStudio config={config} />`. |
| 13 | Vercel preview deployment with pnpm dev + localhost URL rendering (SC #1, #5) | HUMAN NEEDED | Code assets proven; actual browser rendering and URL-bar cleanliness require live human verification. 01-01-SUMMARY records "approved" checkpoint on 2026-04-22 — see human_verification item 1 for confirmation protocol. |
| 14 | Vercel preview URL deployed with Studio OAuth rendering (SC #3) | HUMAN NEEDED | 01-03-SUMMARY records Vercel preview deployed and Studio live, but Vercel deployment state cannot be verified from the local filesystem. |

**Score:** 12/14 truths verified (2 require human confirmation)

### Deferred Items

No items identified as addressed in later phases — all gaps require human verification rather than later-phase work.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `middleware.ts` | Host-based rewrite implementing D-01 precedence | VERIFIED | 122 lines; D-01 Step 1–4 early-returns; `resolveHostMarket()` exact-prefix match; `NextResponse.rewrite()`; `studio` in matcher negative-lookahead |
| `app/root/layout.tsx` | Slate-400 stripe + Root placeholder title | VERIFIED | Contains `bg-slate-400`; title "ProActiv Sports — Root (Phase 1 placeholder)" |
| `app/root/page.tsx` | Verbatim root gateway placeholder copy | VERIFIED | Contains `<h1>ProActiv Sports — Root</h1>` |
| `app/hk/layout.tsx` | Amber-400 stripe + HK placeholder title | VERIFIED | Contains `bg-amber-400`; title "ProActiv Sports — Hong Kong (Phase 1 placeholder)" |
| `app/hk/page.tsx` | Verbatim HK placeholder copy | VERIFIED | Contains `<h1>ProActiv Sports — Hong Kong</h1>` |
| `app/sg/layout.tsx` | Teal-400 stripe + SG placeholder title | VERIFIED | Contains `bg-teal-400`; title "ProActiv Sports — Singapore (Phase 1 placeholder)" |
| `app/sg/page.tsx` | Verbatim SG placeholder copy | VERIFIED | Contains `<h1>ProActiv Sports — Singapore</h1>` |
| `components.json` | shadcn registry config with UI-SPEC preset | VERIFIED | `style: "radix-nova"`, `baseColor: "neutral"`, `cssVariables: true`, aliases `@/components` + `@/lib/utils`, `registries: {}` |
| `components/ui/button.tsx` | Button primitive with buttonVariants via cva | VERIFIED | Exports `Button` and `buttonVariants`; imports `cn` from `@/lib/utils`; imports `Slot` from `radix-ui` |
| `lib/utils.ts` | cn() helper merging clsx + tailwind-merge | VERIFIED | Exports `function cn(...inputs: ClassValue[])` |
| `app/globals.css` | shadcn CSS variable block (--background, --primary, --muted, etc.) | VERIFIED | Contains `--background`, `--primary`, `--muted`, `--foreground` and full shadcn variable set |
| `sanity.config.ts` | defineConfig with Structure+Vision+Presentation plugins, basePath /studio | VERIFIED | `"use client"` at top; `defineConfig` with `basePath: "/studio"`, `structureTool`, `visionTool`, `presentationTool({ previewUrl: "/" })`; fail-fast env guard |
| `sanity/structure.ts` | D-12 siteSettings singleton pattern | VERIFIED | Exports `structure: StructureResolver` with siteSettings pinned above divider |
| `sanity/schemaTypes/index.ts` | Barrel exporting all 8 schema types | VERIFIED | Imports all 8 stubs; exports `schemaTypes` array in specified order |
| `sanity/schemaTypes/siteSettings.ts` | Empty D-11 stub | VERIFIED | `defineType({ name: "siteSettings", ... })` |
| `sanity/schemaTypes/page.ts` | Empty D-11 stub | VERIFIED | `defineType({ name: "page", ... })` |
| `sanity/schemaTypes/post.ts` | Empty D-11 stub | VERIFIED | `defineType({ name: "post", ... })` |
| `sanity/schemaTypes/venue.ts` | Empty D-11 stub | VERIFIED | `defineType({ name: "venue", ... })` |
| `sanity/schemaTypes/coach.ts` | Empty D-11 stub | VERIFIED | `defineType({ name: "coach", ... })` |
| `sanity/schemaTypes/camp.ts` | Empty D-11 stub | VERIFIED | `defineType({ name: "camp", ... })` |
| `sanity/schemaTypes/testimonial.ts` | Empty D-11 stub | VERIFIED | `defineType({ name: "testimonial", ... })` |
| `sanity/schemaTypes/faq.ts` | Empty D-11 stub | VERIFIED | `defineType({ name: "faq", ... })` |
| `app/studio/[[...tool]]/page.tsx` | Embedded Studio mount via NextStudio | VERIFIED | Server Component; imports `NextStudio` from `next-sanity/studio`; re-exports `metadata, viewport`; no `"use client"` — correct per next-sanity@11 layering |
| `app/studio/[[...tool]]/layout.tsx` | Pass-through layout for Studio | VERIFIED | Exists as a pass-through (does not constrain Studio with global flex-col wrapper) |
| `.env.example` | Sanity env contract | VERIFIED | Contains `NEXT_PUBLIC_SANITY_PROJECT_ID=`, `NEXT_PUBLIC_SANITY_DATASET=production`, `SANITY_API_READ_TOKEN=` |
| `README.md` | Preview testing recipe section | VERIFIED | Contains `## Preview testing recipe` with local dev URLs, Vercel preview bridge, Studio access, env policy |
| `vitest.config.ts` | Vitest scoped to node environment, middleware-only | VERIFIED | `environment: "node"`, `include: ["**/*.test.ts"]`, no jsdom, no plugin-react, `passWithNoTests: true` |
| `middleware.test.ts` | 11 tests covering D-01/D-02/D-03/D-04/D-05/D-07/D-16 invariants | VERIFIED | 11 tests across 5 describe blocks; all pass; imports `middleware` and `config as middlewareConfig` from `./middleware` |
| `package.json` | test:unit + test:unit:watch scripts; vitest devDep; shadcn runtime deps; sanity deps | VERIFIED | All scripts and deps confirmed present |
| `.github/workflows/ci.yml` | Unit tests as 5th step (check 4) between Build and Gitleaks; D-17 in header | VERIFIED | Step `Unit tests` with `run: pnpm test:unit` between Build and Gitleaks; no `continue-on-error` |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| `middleware.ts` | `app/root/`, `app/hk/`, `app/sg/` | `NextResponse.rewrite(new URL('/{market}/...'))` | VERIFIED | `rewriteToMarket()` uses `NextResponse.rewrite(url)` with plain-folder targets |
| `middleware.ts` | known Host headers hk.*, sg.* | early-return guards in the D-01 precedence ladder | VERIFIED | `resolveHostMarket()` uses exact prefix match `bare.startsWith("hk.")` etc; `req.headers.get("host")` is the read point |
| `middleware.ts` | middleware pass-through for /studio | `studio` in negative-lookahead of `config.matcher` | VERIFIED | Line 119: `"/((?!_next/|api/health|favicon\\.ico|monitoring|studio|.*\\.(?:...)).*)"` |
| `middleware.test.ts` | `middleware.ts` | `import { middleware, config as middlewareConfig } from "./middleware"` | VERIFIED | Import confirmed; tests run against actual middleware function |
| `sanity.config.ts` | `sanity/schemaTypes/index.ts` | `import { schemaTypes } from "./sanity/schemaTypes"` | VERIFIED | Import present; barrel consumed in `schema: { types: schemaTypes }` |
| `sanity.config.ts` | `sanity/structure.ts` | `import { structure } from "./sanity/structure"` + `structureTool({ structure })` | VERIFIED | Both imports confirmed in sanity.config.ts |
| `app/studio/[[...tool]]/page.tsx` | `sanity.config.ts` | `import config from "@/sanity.config"` + `<NextStudio config={config} />` | VERIFIED | Import confirmed; `<NextStudio config={config} />` rendered |
| `components/ui/button.tsx` | `lib/utils.ts` | `import { cn } from "@/lib/utils"` | VERIFIED | Confirmed in button.tsx |
| `.github/workflows/ci.yml` | `package.json` (test:unit script) | `run: pnpm test:unit` | VERIFIED | CI step confirmed; script confirmed in package.json |

### Data-Flow Trace (Level 4)

Not applicable for Phase 1. All artifacts are either routing logic (middleware), structural scaffolds (schema stubs, Studio mount), or configuration files. No artifacts render dynamic data sourced from a database or API in this phase — the placeholder pages contain static copy only.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| pnpm test:unit runs 11 tests and exits 0 | `pnpm test:unit` | "11 passed (11)", exit 0, 337ms | PASS |
| pnpm build compiles all 4 routes and exits 0 | `pnpm build` | 7 pages generated including /hk, /root, /sg, /studio/[[...tool]]; no errors | PASS |
| middleware.ts exports both `middleware` function and `config` | `grep "^export" middleware.ts` | `export function middleware` and `export const config` confirmed | PASS |
| All 8 schema stubs exist in sanity/schemaTypes/ | `ls sanity/schemaTypes/` | 9 files: index.ts + 8 stubs | PASS |
| studio matcher exclusion is in place | `grep "studio" middleware.ts` | Line 119 contains `studio` in the negative-lookahead | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| FOUND-02 | 01-01-PLAN, 01-02-PLAN | Single Next.js 15 (App Router, RSC) project boots with Tailwind + shadcn pattern, deployed to Vercel | VERIFIED | `pnpm build` exits 0 (4 routes including 3 market trees). `components.json`, `lib/utils.ts`, `components/ui/button.tsx`, `app/globals.css` CSS variables all confirmed. Vercel deployment confirmed by 01-03-SUMMARY (human checkpoint required for live preview state). |
| FOUND-03 | 01-01-PLAN, 01-04-PLAN | Subdomain middleware routes requests with hostile-request guard | VERIFIED | `middleware.ts` implements D-01 precedence with D-02 host authority. `middleware.test.ts` encodes 11 tests including D-16 hostile-request invariant, all passing in CI. |
| FOUND-04 | 01-03-PLAN | Sanity Studio scaffolds with seed content models | VERIFIED (automated) + HUMAN NEEDED (live Studio) | All 8 schema stubs, siteSettings singleton, Studio mount, and middleware pass-through confirmed in code. Studio OAuth rendering on localhost and Vercel preview confirmed by 01-03-SUMMARY human checkpoint — requires human to confirm live state. |

**Orphaned requirements check:** REQUIREMENTS.md maps FOUND-02, FOUND-03, FOUND-04 to Phase 1. All three are claimed by plan frontmatter and verified. No orphaned requirements.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `sanity/schemaTypes/*.ts` (all 8) | all | `fields: [{ name: 'title', type: 'string' }]` — intentional D-11 empty stubs | Info | NOT a blocker — this is the documented deliverable. D-11 explicitly requires empty stubs; Phase 6 (CMS-01..CMS-08) populates real fields. Each file has a top-of-file D-ref comment confirming intention. |
| `sanity.config.ts` | line 47 | `presentationTool({ previewUrl: "/" })` — D-14 deviation from plan's `presentationTool({})` | Info | NOT a blocker — documented Rule 1 deviation (Deviation #2 in 01-03-SUMMARY). Sanity v5.22.0 makes `previewUrl` non-optional; the `"/"` stub is the closest achievable install-only posture. User explicitly approved 2026-04-22. Phase 6 CMS-05 replaces with real resolver. |
| `app/hk/page.tsx` | line 10 | `{/* <Button>Example primitive</Button> — enabled after Plan 01-02... */}` — commented-out Button | Info | NOT a blocker — intentional per UI-SPEC §Copywriting Contract (only ONE visible Button instance across Phase 1, on root placeholder). Same for app/sg/page.tsx. |

No blocking anti-patterns found. The three patterns above are all intentional, documented, and approved.

### Decision Fidelity (D-01 through D-17)

All 17 CONTEXT.md decisions verified against the committed codebase:

| Decision ID | Description | Status | Evidence |
|-------------|-------------|--------|---------|
| D-01 | Host > cookie > query > default root precedence ladder | HONORED | `middleware()` implements 4 early-return steps in exact order |
| D-02 | Known Host values are authoritative (cannot be overridden) | HONORED | `resolveHostMarket()` returns before cookie/query are read for known hosts |
| D-03 | Unknown hosts render root | HONORED | Step 4 default → `rewriteToMarket(req, "root")` |
| D-04 | Markets invisible in external URLs | HONORED (mechanism deviation) | `NextResponse.rewrite()` used (not redirect). Plain folders used instead of route groups — documented and pre-approved in 01-01-PLAN.md objective. URL bar cleanliness confirmed by human checkpoint in 01-01-SUMMARY. |
| D-05 | Plain localhost:3000 = root | HONORED | Falls through to Step 4 default with no special-casing |
| D-06 | Studio embedded at /studio in same app | HONORED | `app/studio/[[...tool]]/page.tsx` with `basePath: "/studio"` |
| D-07 | /studio reachable on any host | HONORED | `studio` in matcher negative-lookahead (line 119); CI regression gate in middleware.test.ts Test 10 |
| D-08 | Existing Sanity project used | HONORED | 01-03-SUMMARY confirms project ID `zs77se7r` used |
| D-09 | Credentials via Vercel env, not in artifacts | HONORED | `.env.example` has name-only contract; real values in `.env.local` (gitignored) and Vercel dashboard |
| D-10 | Single `production` dataset | HONORED | `NEXT_PUBLIC_SANITY_DATASET=production` pre-filled in `.env.example` |
| D-11 | Full Phase 6 type skeleton as empty stubs | HONORED | 8 stubs with single title:string field each |
| D-12 | Singleton pattern established for siteSettings | HONORED | `sanity/structure.ts` wires siteSettings singleton above divider |
| D-13 | `defineType()` in TypeScript schema files | HONORED | All schema files use `defineType` from `"sanity"` |
| D-14 | Presentation plugin install-only | HONORED (Deviation #2) | Registered with `previewUrl: "/"` instead of empty config due to Sanity v5.22.0 TypeScript requiring non-optional previewUrl. User approved. |
| D-15 | Vitest pulled forward, middleware-scope only | HONORED | `vitest.config.ts` uses `environment: "node"`, no jsdom, no React plugin |
| D-16 | Hostile-request test asserts host authority | HONORED | `middleware.test.ts` Tests 1 + 2 cover hk and sg hostile-request cases |
| D-17 | pnpm test:unit as required CI check | HONORED | `.github/workflows/ci.yml` has Unit tests step as check 4 (between Build and Gitleaks), no `continue-on-error` |

**Documented Rule 1 deviations from Plan 01-03 (3 total — all approved):**
1. `next-sanity@^11` instead of latest (`^12`) — v12 requires Next 16; repo is on Next 15.5.15.
2. `presentationTool({ previewUrl: "/" })` instead of `presentationTool({})` — Sanity v5.22.0 TypeScript interface requires `previewUrl`. User approved.
3. Build toolchain switched to Turbopack (`next build --turbopack`) — React 19.2 webpack interop failure with sanity v5's `PresentationToolGrantsCheck`. User approved.

All three are library-contract adaptations, not spec violations. None affect the security posture or user-facing behavior of Phase 1's deliverables.

### Human Verification Required

#### 1. Browser smoke-test of three market placeholder routes

**Test:** Run `pnpm dev`. Visit http://root.localhost:3000/, http://hk.localhost:3000/, http://sg.localhost:3000/ in Chrome or Safari.
**Expected:**
- root: tab title "ProActiv Sports — Root (Phase 1 placeholder)", 4px grey-blue stripe at top, h1 "ProActiv Sports — Root", URL bar shows `root.localhost:3000/` (no `/root/` prefix)
- hk: tab title "ProActiv Sports — Hong Kong (Phase 1 placeholder)", 4px amber stripe, h1 "ProActiv Sports — Hong Kong", URL bar shows `hk.localhost:3000/` (no `/hk/` prefix — D-04 invariant)
- sg: tab title "ProActiv Sports — Singapore (Phase 1 placeholder)", 4px teal stripe, h1 "ProActiv Sports — Singapore", URL bar shows `sg.localhost:3000/` (no `/sg/` prefix)
**Why human:** Browser rendering, tab title text, and URL bar behavior (D-04 rewrite vs redirect distinction) are only observable in an actual browser. The automated test suite confirms the x-middleware-rewrite header contract but cannot observe the rendered visual or URL bar.

Note: 01-01-SUMMARY records this checkpoint was approved by Martin on 2026-04-22 with all 5 URL checks passing. This item is confirmation-only if that record is trusted.

#### 2. Vercel preview deployment + Studio OAuth confirmation

**Test:** Check the Vercel dashboard for this project. Confirm a successful preview deployment exists with all 5 CI checks green (Typecheck, Lint, Format check, Build, Unit tests, Gitleaks). Visit `<preview-url>/studio` and confirm the Sanity OAuth login screen renders.
**Expected:** Preview URL accessible; CI checks all green; Studio shows OAuth (Google/GitHub/email); after login, sidebar shows Site Settings (singleton) + Page/Post/Venue/Coach/Camp/Testimonial/FAQ; Presentation tab appears in nav.
**Why human:** Vercel deployment state, CI run results, and Studio OAuth rendering require accessing external services (Vercel dashboard, GitHub Actions, browser). Cannot be verified from the local filesystem. 01-03-SUMMARY records this was confirmed on 2026-04-22 after Martin's credential handoff.

### Gaps Summary

No automated gaps found. All code artifacts exist, are substantive, and are correctly wired. The two human verification items are confirmation-only given the SUMMARY records of prior checkpoints.

**Status rationale:** Status is `human_needed` because two Success Criteria (#1: three distinct market placeholders on preview; #5: pnpm dev + localhost URLs render) involve browser-observable behavior that cannot be verified programmatically. The SUMMARY records indicate these were confirmed by Martin on 2026-04-22. If those records are accepted, the phase is passed — but per the verification protocol, human confirmation items prevent a `passed` status automatically.

---

_Verified: 2026-04-22T00:34:00Z_
_Verifier: Claude (gsd-verifier)_

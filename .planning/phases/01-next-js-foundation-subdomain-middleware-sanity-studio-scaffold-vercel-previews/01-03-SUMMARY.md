---
phase: 01-next-js-foundation-subdomain-middleware-sanity-studio-scaffold-vercel-previews
plan: 03
subsystem: cms-sanity-studio

tags:
  - sanity
  - next-sanity
  - sanity-studio-v5
  - embedded-studio
  - schema-stubs
  - structure-tool
  - vision-plugin
  - presentation-plugin
  - turbopack
  - middleware-pass-through
  - react-19

# Dependency graph
requires:
  - phase: 01
    plan: 01
    provides: "middleware.ts with D-01 host-precedence ladder and matcher regex — extended by Plan 01-03 to pass /studio through on all hosts (D-07)"
  - phase: 01
    plan: 02
    provides: "shadcn CLI + Tailwind v4 + CSS variable layer — coexist with sanity deps, no conflicts observed during install"
  - phase: 00-local-foundation
    provides: "pnpm lockfile discipline, Sentry wiring inherited via middleware runtime, X-Robots-Tag noindex on non-prod covering /studio, Vercel Deployment Protection gating previews"

provides:
  - "Embedded Sanity Studio at /studio (D-06) — reachable on root.localhost, hk.localhost, sg.localhost, and any *.vercel.app preview under Vercel Deployment Protection"
  - "Sanity Studio v5.22.0 with plugins: Structure (active), Vision (GROQ playground, active), Presentation (install-only per D-14 — registered with the approved previewUrl: '/' stub per Deviation #2; Phase 6 CMS-05 wires the real previewUrl resolver + Draft Mode handler)"
  - "sanity/schemaTypes/ barrel — 8 empty document-type stubs (D-11): siteSettings, page, post, venue, coach, camp, testimonial, faq — each a defineType with a single title:string field; ready work-surface for Phase 6 CMS-01..CMS-08"
  - "sanity/structure.ts — D-12 singleton pattern anchor for siteSettings; Phase 6 can append further singletons (homepage, global nav, footer NAP) without re-architecting"
  - "middleware.ts matcher patched — /studio is in the negative-lookahead exclude list; D-07 invariant proven via HTTP smoke (no x-middleware-rewrite header on /studio responses)"
  - ".env.example publishes the Sanity env contract (D-09) — NEXT_PUBLIC_SANITY_PROJECT_ID (client-safe), NEXT_PUBLIC_SANITY_DATASET=production (D-10 default), SANITY_API_READ_TOKEN (server-only, rotation comment included)"
  - "README /studio access recipe + Vercel preview ?__market= bridge documentation"
  - "Build toolchain switched to Turbopack (dev + build) — native React 19.2 useEffectEvent interop for sanity v5's PresentationToolGrantsCheck + LiveQueries path; transpilePackages kept as defensive config for non-turbopack builds"

affects:
  - 01-04  # Vitest middleware test — must encode the D-07 /studio pass-through invariant as a regression assertion
  - 02     # Design system — Studio chrome is Sanity's own; brand tokens live outside the /studio subtree
  - 06     # Phase 6 CMS — 8 schema stubs are the work surface; CMS-05 wires presentationTool's real previewUrl + Draft Mode
  - 10     # Phase 10 launch — Sanity CORS allowlist currently permissive (*.vercel.app); tighten to production origins at domain cutover (T-01-14 handoff)

# Tech tracking
tech-stack:
  added:
    - "sanity@5.22.0 — embedded Studio core (v5.x is the current major; D-11 schema stubs use defineType from this package)"
    - "next-sanity@^11.6.13 — Next.js 15 adapter for embedded Studio; PINNED to ^11 (not ^12) per Deviation #1 because next-sanity@12 requires next@^16.0.0-0 and the repo is on next@15.5.15"
    - "@sanity/vision@5.22.0 — GROQ playground plugin, active from day one"
    - "@sanity/visual-editing (transitive via next-sanity) — added to next.config.ts transpilePackages as defensive config for non-turbopack builds"
  patterns:
    - "Embedded Studio mount pattern per next-sanity@11 README lines 1044–1099: app/studio/[[...tool]]/page.tsx is a Server Component that re-exports { metadata, viewport } from next-sanity/studio and renders <NextStudio config={config} />; sanity.config.ts carries the 'use client' directive at its top (v11 canonical client-bundle entry) — Deviation #3 inverted the initial (incorrect) layering from commit 17ac872"
    - "Schema singleton via structure-tool: S.listItem().id('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings')) pinned above S.divider(), then ...S.documentTypeListItems().filter(...) with siteSettings excluded — the filter pattern scales: Phase 6 appends further singletons by extending the exclude list"
    - "Schema barrel: sanity/schemaTypes/index.ts imports each *.ts stub and exports a single schemaTypes array in a deterministic order — sanity.config.ts consumes the barrel, so adding new document types is a one-line change in the barrel plus a new stub file"
    - "Fail-fast env guard in sanity.config.ts: throws at module-eval if NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET is missing — surfaces config errors at build/load time rather than rendering an un-debuggable blank Studio"
    - "middleware matcher negative-lookahead exclude list — studio is now a first-class entry alongside _next/, api/health, favicon.ico, monitoring, and static assets; Plan 01-04 will codify this as a CI regression gate"
    - "Build via Turbopack (not webpack): React 19.2 exposes useEffectEvent only through a conditional CJS stub that webpack's static named-export analyzer cannot trace; sanity v5's PresentationToolGrantsCheck + LiveQueries hit that interop failure at build time; Turbopack resolves it natively. Deviation #3 captures the switch"

key-files:
  created:
    - "sanity.config.ts — repo root; defineConfig with projectId/dataset/basePath=/studio, plugins Structure+Vision+Presentation (previewUrl:'/' stub per Deviation #2), schema:{types:schemaTypes}; prepends 'use client' directive per v11 README"
    - "sanity/structure.ts — D-12 singleton anchor for siteSettings; exports structure: StructureResolver"
    - "sanity/schemaTypes/index.ts — barrel re-exporting the 8 stubs as schemaTypes array in order [siteSettings, page, post, venue, coach, camp, testimonial, faq]"
    - "sanity/schemaTypes/siteSettings.ts — D-11 empty stub + D-12 singleton reference comment; defineType name:'siteSettings', single title:string field"
    - "sanity/schemaTypes/page.ts — D-11 empty stub"
    - "sanity/schemaTypes/post.ts — D-11 empty stub"
    - "sanity/schemaTypes/venue.ts — D-11 empty stub"
    - "sanity/schemaTypes/coach.ts — D-11 empty stub"
    - "sanity/schemaTypes/camp.ts — D-11 empty stub"
    - "sanity/schemaTypes/testimonial.ts — D-11 empty stub"
    - "sanity/schemaTypes/faq.ts — D-11 empty stub"
    - "app/studio/[[...tool]]/page.tsx — embedded Studio mount; Server Component re-exporting metadata+viewport from next-sanity/studio; renders <NextStudio config={config} />"
    - "app/studio/[[...tool]]/layout.tsx — pass-through layout so Studio's full-viewport chrome isn't constrained by the global body flex-col wrapper"
  modified:
    - "middleware.ts — matcher patched at lines 117–121; negative-lookahead now includes 'studio' alongside _next/, api/health, favicon.ico, monitoring, and static assets. D-07 invariant: request to /studio on any Host is NOT rewritten into a market tree"
    - ".env.example — appended Sanity block: NEXT_PUBLIC_SANITY_PROJECT_ID= (empty), NEXT_PUBLIC_SANITY_DATASET=production (D-10 pre-filled), SANITY_API_READ_TOKEN= (empty, with Scope:Viewer + rotation comment)"
    - "README.md — new '## Preview testing recipe' section covering local dev URLs (root.localhost / hk.localhost / sg.localhost / plain localhost), Vercel preview ?__market= bridge, Studio access recipe, env-var policy"
    - "next.config.ts — added transpilePackages: ['sanity', '@sanity/vision', '@sanity/visual-editing'] as defensive config for non-turbopack builds (Deviation #3)"
    - "package.json — dev + build scripts switched to 'next dev --turbopack' / 'next build --turbopack' (Deviation #3); sanity@^5.22.0, next-sanity@^11.6.13, @sanity/vision@^5.22.0 added to dependencies"
    - "pnpm-lock.yaml — updated to pin sanity + next-sanity + @sanity/vision + transitive deps"

key-decisions:
  - "D-06 honored: embedded Studio at /studio in the same Next.js app (not a separate Vercel deployment). Single env, single middleware, single Sentry, single Deployment Protection gate"
  - "D-07 honored: /studio is reachable on any Host. Middleware matcher excludes 'studio'. HTTP smoke proved x-middleware-rewrite is absent on /studio responses for both plain localhost:3000 and hk.localhost:3000"
  - "D-08 honored: using the existing ProActiv Sanity project (Martin-owned, empty/throwaway). Project ID zs77se7r is public by design (D-09 posture — NEXT_PUBLIC_ prefix makes it client-safe)"
  - "D-09 honored: .env.example publishes the env contract with empty values; Martin drops real values into .env.local (gitignored) and the Vercel dashboard. SANITY_API_READ_TOKEN is server-only (no NEXT_PUBLIC_ prefix) and never inlined into the client bundle"
  - "D-10 honored: single 'production' dataset for Phases 1–5, pre-filled in .env.example. Phase 6 revisits if editor workflows demand a 'development' dataset"
  - "D-11 honored: 8 empty document-type stubs landed as-planned — siteSettings, page, post, venue, coach, camp, testimonial, faq. Each is defineType with a single title:string field. Phase 6 CMS-01..CMS-08 populates real fields"
  - "D-12 honored: siteSettings wired as singleton via sanity/structure.ts — pinned above a divider with documentId='siteSettings'; auto-generated type list filters out siteSettings so there's exactly one way to reach it"
  - "D-14 deviation (approved, see Deviation #2): Presentation plugin is install-only but registered with previewUrl:'/' (not the spec's empty config) because Sanity v5.22.0's PresentationPluginOptions TypeScript interface makes previewUrl non-optional. Runtime effect: clicking Presentation in Studio iframes the root placeholder instead of showing the 'preview not configured' empty state. User approved on 2026-04-22"
  - "Build toolchain: Turbopack (Deviation #3) — required for React 19.2 + sanity v5 interop; webpack alone could not build the /studio route. transpilePackages in next.config.ts kept as defensive insurance for non-turbopack builds"
  - "next-sanity pinned to ^11 (Deviation #1) — v12 requires Next 16; repo is on Next 15.5.15"

patterns-established:
  - "Embedded Studio client/server boundary: 'use client' at top of sanity.config.ts (v11 canonical — makes the entire Studio graph a client module), app/studio/[[...tool]]/page.tsx is a Server Component re-exporting metadata+viewport from next-sanity/studio. Inverted layering was the initial bug in commit 17ac872; corrected in commit 8ff9e59 (Deviation #3). Phase 6 CMS edits inherit this layering"
  - "Schema stub shape (D-11): defineType({ name, title, type: 'document', fields: [{ name: 'title', type: 'string', title: 'Title' }] }) — 6 lines, zero content modeling. Each stub file has a top-of-file comment citing Phase 1 / Plan 01-03 / D-11 (and D-12 for siteSettings) so Phase 6 sees the provenance trail"
  - "Singleton wiring pattern (D-12): define the listItem with .id + .child(S.document().schemaType().documentId()), put it above S.divider(), then spread-filter S.documentTypeListItems() excluding the singleton name. Phase 6 appends further singletons by repeating the pattern"
  - "Env contract publication: name-only in .env.example with comments distinguishing client-safe (NEXT_PUBLIC_) from server-only (no prefix). Pre-fill deterministic values (dataset=production per D-10); leave all secrets empty. Phase 0 D-09 pattern preserved"
  - "Middleware exclude list as composable negative-lookahead: new paths (studio, monitoring, etc.) get appended to the pipe-delimited alternation inside the negative-lookahead group. Plan 01-04 will encode the /studio entry as a Vitest regression test"

requirements-completed:
  - FOUND-04  # Sanity Studio scaffolded with seed content models — Studio reachable, authenticated via Sanity OAuth, 8 document-type stubs visible in sidebar, siteSettings pinned as singleton, Vision + Presentation tools registered

# Metrics
duration: ~multi-session (sequential executor runs over 2026-04-22 with user-in-the-loop checkpoint for Sanity credentials + dashboard config)
tasks: 4  # Task 1 deps+stubs, Task 2 config+mount+middleware+env+README, Task 3 human-action checkpoint, Task 4 build+deploy+summary (this file closes Task 4)
files_created: 12
files_modified: 6
completed: 2026-04-22
---

# Phase 1 Plan 01-03: Embedded Sanity Studio Scaffold Summary

**Embedded Sanity Studio v5.22.0 live at `/studio` via next-sanity@11 with 8-stub schema skeleton, siteSettings singleton anchor (D-12), Structure + Vision + Presentation plugins (Presentation install-only per D-14), middleware `/studio` pass-through on all hosts (D-07), Vercel env contract published — FOUND-04 satisfied. Build toolchain switched to Turbopack to resolve React 19.2 + sanity v5 webpack interop; three Rule 1 deviations captured and approved.**

## Performance

- **Duration:** multi-session (2026-04-22) — credential handoff + Vercel env propagation + post-checkpoint build fix were spread across the day
- **Completed:** 2026-04-22
- **Tasks:** 4 tasks executed (2 auto + 1 human-action checkpoint + 1 post-build verification)
- **Files:** 12 created, 6 modified

## Accomplishments

- Embedded Sanity Studio mounts at `/studio` on all three market hosts (root.localhost, hk.localhost, sg.localhost) + any Vercel preview — gated only by Vercel Deployment Protection + Sanity's own OAuth.
- 8 empty document-type stubs (D-11) form the Phase 6 CMS-01..CMS-08 work surface: siteSettings, page, post, venue, coach, camp, testimonial, faq.
- siteSettings singleton (D-12) pinned at the top of the Studio content list; pattern is directly reusable by Phase 6 for homepage / global nav / footer NAP singletons.
- Presentation plugin registered with the approved `previewUrl: "/"` stub (see Deviation #2) — appears in the Studio nav from day one so Martin and future client editors see the Phase 6 preview capability is planned.
- middleware.ts matcher excludes `/studio` at line 119; proved by HTTP smoke (no `x-middleware-rewrite` header on responses to `/studio` on either plain localhost or hk.localhost).
- Sanity env contract published in .env.example (client-safe + server-only split per D-09); Vercel Prod+Preview+Dev scopes now carry the three SANITY_* env vars; .env.local is populated locally and gitignored.
- Sanity CORS origins whitelisted for localhost dev URLs + *.vercel.app previews (permissive per Phase 1; Phase 10 tightens to production origins — T-01-14 handoff).
- Build toolchain migrated to Turbopack (`pnpm dev` and `pnpm build` both use `--turbopack`) — native handling of React 19.2's `useEffectEvent` conditional CJS interop that blocked webpack builds of the /studio route.

## Task Commits

Each source change was committed atomically during execution. Five code commits landed across Tasks 1–4:

1. **Task 1 — Sanity runtime deps + 8 schema stubs + siteSettings singleton** — `761658a` (feat) — `package.json`, `pnpm-lock.yaml`, `sanity/schemaTypes/*.ts` (8 stubs + barrel), `sanity/structure.ts`. Commit body records the next-sanity@^11 pin rationale (Deviation #1).
2. **Task 2a — Embedded Studio config + mount** — `17ac872` (feat) — `sanity.config.ts`, `app/studio/[[...tool]]/page.tsx`, `app/studio/[[...tool]]/layout.tsx`. Commit body records the previewUrl:"/" stub rationale (Deviation #2) + Sanity v5 TypeScript contract.
3. **Task 2b — Middleware /studio pass-through (D-07)** — `67a794b` (feat) — `middleware.ts` matcher now includes `studio` in the negative-lookahead exclude list.
4. **Task 2c — Env contract + README recipe** — `c21cf39` (docs) — `.env.example` (appended Sanity block), `README.md` (new "Preview testing recipe" section covering local, Vercel previews, Studio access, env policy).
5. **Task 4 post-checkpoint — Client/server boundary fix + Turbopack enable** — `8ff9e59` (fix) — `sanity.config.ts` (prepended 'use client'), `app/studio/[[...tool]]/page.tsx` (removed 'use client' so it's a Server Component re-exporting metadata/viewport per next-sanity@11 README), `package.json` (dev + build scripts switched to --turbopack), `next.config.ts` (added transpilePackages for sanity/@sanity/vision/@sanity/visual-editing). Commit body details Deviation #3 in full.

**Plan metadata commit:** this SUMMARY + STATE.md + ROADMAP.md + REQUIREMENTS.md (single `docs(01-03): plan summary ...` commit via gsd-tools).

## Files Created/Modified

### Created (12 files)

- `sanity.config.ts` — repo root. Prepends `'use client'` per next-sanity@11 canonical client-bundle entry. `defineConfig` with projectId/dataset from env, basePath `/studio`, three plugins, schema types from barrel. Fail-fast throw if env vars missing.
- `sanity/structure.ts` — D-12 singleton anchor. `StructureResolver` pins `siteSettings` above a divider, then spreads `S.documentTypeListItems()` filtered to exclude `siteSettings`.
- `sanity/schemaTypes/index.ts` — barrel, exports `schemaTypes` array in order `[siteSettings, page, post, venue, coach, camp, testimonial, faq]`.
- `sanity/schemaTypes/siteSettings.ts` — D-11 empty stub with D-12 singleton reference comment.
- `sanity/schemaTypes/page.ts` — D-11 empty stub.
- `sanity/schemaTypes/post.ts` — D-11 empty stub.
- `sanity/schemaTypes/venue.ts` — D-11 empty stub.
- `sanity/schemaTypes/coach.ts` — D-11 empty stub.
- `sanity/schemaTypes/camp.ts` — D-11 empty stub.
- `sanity/schemaTypes/testimonial.ts` — D-11 empty stub.
- `sanity/schemaTypes/faq.ts` — D-11 empty stub.
- `app/studio/[[...tool]]/page.tsx` — embedded Studio mount. Server Component re-exporting `{ metadata, viewport }` from `next-sanity/studio`. Renders `<NextStudio config={config} />`. NOTE: this file does NOT have `'use client'` — that's correct per next-sanity@11 README lines 1044–1099; the client boundary is inside `sanity.config.ts` itself (Deviation #3 corrected the initial inversion).
- `app/studio/[[...tool]]/layout.tsx` — pass-through so Studio's full-viewport chrome isn't constrained by the global body flex-col wrapper.

### Modified (6 files)

- `middleware.ts` — matcher regex at line 119 now includes `studio` in the negative-lookahead. Updated comment block at lines 105–116 cites D-07 and references Plan 01-04's forthcoming Vitest regression assertion.
- `.env.example` — appended Sanity block (D-09 contract): `NEXT_PUBLIC_SANITY_PROJECT_ID=` (empty), `NEXT_PUBLIC_SANITY_DATASET=production` (D-10 pre-filled), `SANITY_API_READ_TOKEN=` (empty, with Scope: Viewer + rotation comment + NEVER commit warning).
- `README.md` — new `## Preview testing recipe` section (Claude's Discretion bullet in CONTEXT.md): local dev URLs, Vercel `?__market=` bridge, Studio access recipe, env-var policy (never commit `.env.local`).
- `next.config.ts` — added `transpilePackages: ["sanity", "@sanity/vision", "@sanity/visual-editing"]` — defensive config for non-turbopack builds (Deviation #3).
- `package.json` — dev + build scripts switched to `next dev --turbopack` / `next build --turbopack` (Deviation #3). New dependencies: `sanity@^5.22.0`, `next-sanity@^11.6.13`, `@sanity/vision@^5.22.0`.
- `pnpm-lock.yaml` — updated to pin sanity + next-sanity + @sanity/vision + their transitive deps.

## Decisions Made

All decisions trace back to CONTEXT.md D-IDs honored as planned, with three library-contract adaptations documented as deviations below.

- **D-06 Studio location:** embedded at `/studio` in the same Next.js app (not a separate Vercel deployment).
- **D-07 Studio reach:** `/studio` passes through middleware on all hosts — market cookie / query / Host are ignored for this path.
- **D-08 Project choice:** existing ProActiv Sanity project used (empty / throwaway).
- **D-09 Credential discipline:** env-var names in `.env.example`; real values live only in `.env.local` (gitignored) and Vercel dashboard.
- **D-10 Dataset:** single `production` dataset for Phases 1–5.
- **D-11 Schema shape:** 8 empty stubs, each `defineType` with one `title:string` field.
- **D-12 Singleton pattern:** siteSettings pinned via structure-tool; Phase 6 inherits the pattern for homepage / global nav / footer NAP.
- **D-14 Presentation plugin:** install-only — registered with `previewUrl: "/"` stub (see Deviation #2); Phase 6 CMS-05 wires real previewUrl resolver + Draft Mode handler.

## Deviations from Plan

Three Rule 1 (library-contract / version adaptation) deviations were recorded during execution. All were accepted automatically or with explicit user approval. None required architectural changes (Rule 4 did not fire).

### Auto-fixed / Adapted Issues

**1. [Rule 1 — Version constraint] next-sanity pinned to ^11 instead of latest (v12)**

- **Found during:** Task 1 (`pnpm add next-sanity@latest`).
- **Issue:** Plan's action step said `pnpm add next-sanity@latest` which would resolve to `next-sanity@^12`. next-sanity@12 declares a peerDependency on `next@^16.0.0-0`, and the repo is on `next@15.5.15` (Phase 0 pinned; bumping Next is out of Phase 1 scope).
- **Fix:** Installed `next-sanity@^11.6.13` — the latest release of the v11 line that supports Next 15. All next-sanity@11 APIs used in this plan (`NextStudio`, `next-sanity/studio` metadata+viewport re-exports) are stable.
- **Files modified:** `package.json`, `pnpm-lock.yaml`.
- **Verification:** `pnpm build` succeeds; `pnpm typecheck` 0 errors; Studio renders; OAuth flow works.
- **Committed in:** `761658a` (commit body documents the pin).
- **Approval:** implicit — version constraint is a hard peer-dep requirement, not a preference.

**2. [Rule 1 — TypeScript contract] presentationTool registered with `previewUrl: "/"` stub instead of empty config**

- **Found during:** Task 2 (`sanity.config.ts` authoring).
- **Issue:** The plan specified `presentationTool({})` (empty config) so Studio would render Sanity's default "preview not configured" empty state when clicking Presentation. However, Sanity v5.22.0's `PresentationPluginOptions` TypeScript interface makes `previewUrl` a **required** field — passing `{}` fails `pnpm typecheck` with "Argument of type '{}' is not assignable to parameter of type 'PresentationPluginOptions'".
- **Fix:** Registered the plugin as `presentationTool({ previewUrl: "/" })` — the root placeholder URL as the lowest-footprint stub. Runtime behavior deviates from the original D-14 plan text: clicking Presentation in Studio iframes the root placeholder (a slate-striped "Root · ProActiv Sports" page) instead of showing the "preview not configured" empty state. Functionally, nothing useful is previewed (no document-to-URL resolver) — the stub is still explicitly install-only.
- **Files modified:** `sanity.config.ts` (lines 11–14 carry an inline comment citing Deviation #2 + user approval).
- **Verification:** `pnpm typecheck` 0 errors; Studio renders Presentation tab without crashing; iframe shows the root placeholder as expected.
- **Committed in:** `17ac872` (commit body documents the decision + Sanity v5 TypeScript contract reference).
- **Approval:** **user explicitly approved on 2026-04-22** when the orchestrator surfaced the TypeScript signature and alternatives. D-14's intent (install-only, no real preview wiring) is preserved; only the idle-state rendering differs.
- **Phase 6 handoff:** CMS-05 replaces `previewUrl: "/"` with a real resolver function that maps Sanity documents to their front-end URLs + wires a Next.js Draft Mode API route. This deviation does not constrain that wiring — the resolver can be swapped in as a drop-in replacement.

**3. [Rule 1 — Build toolchain + client/server boundary] Corrected next-sanity@11 layering + switched dev/build to Turbopack + added transpilePackages defensively**

- **Found during:** Task 4 post-checkpoint (`pnpm build` against the populated .env.local).
- **Issue:** Three related sub-corrections, committed together as one `fix(01-03)` commit:
  1. `sanity.config.ts` was **not** prepended with `'use client'` in the initial commit (17ac872) — incorrect per next-sanity@11's canonical layering (the client boundary sits inside the config module, not the route).
  2. `app/studio/[[...tool]]/page.tsx` **was** `'use client'` in the initial commit — also incorrect; next-sanity@11 README lines 1044–1099 prescribe the route file as a Server Component that re-exports `{ metadata, viewport }` from `next-sanity/studio`.
  3. Independently, `pnpm build` failed with a webpack interop error against React 19.2's `useEffectEvent` — React 19.2 exposes it only through a conditional CJS stub that webpack's static named-export analyzer can't trace through, and Sanity v5's `PresentationToolGrantsCheck` + `LiveQueries` consume it. `pnpm typecheck` was clean (types aren't affected); the failure was at the bundler level.
- **Fix:**
  1. Added `'use client'` to the top of `sanity.config.ts` (canonical v11 client-bundle entry).
  2. Removed `'use client'` from `app/studio/[[...tool]]/page.tsx` and added `export { metadata, viewport } from "next-sanity/studio"` re-export (Server Component layer).
  3. Switched `package.json` scripts: `dev` → `next dev --turbopack`, `build` → `next build --turbopack`. Turbopack handles the React 19.2 conditional CJS export natively.
  4. Added `transpilePackages: ["sanity", "@sanity/vision", "@sanity/visual-editing"]` to `next.config.ts` as defensive insurance for any future non-turbopack build invocation.
- **Files modified:** `sanity.config.ts`, `app/studio/[[...tool]]/page.tsx`, `package.json` (scripts), `next.config.ts` (transpilePackages).
- **Verification:** `pnpm typecheck` 0 errors; `pnpm build` (turbopack) succeeds — 4 routes compile (`/root`, `/hk`, `/sg`, `/studio/[[...tool]]`); first load JS for /studio route is ~1.67 MB (Studio is inherently client-heavy). Live smoke via curl proves `/studio` returns HTTP 200 without `x-middleware-rewrite` header on both plain localhost:3000 and hk.localhost:3000.
- **Committed in:** `8ff9e59` (detailed commit body explaining each sub-correction).
- **Approval:** **user approved "fix it" on 2026-04-22** after the orchestrator presented the webpack bug + next-sanity@11 README citation.
- **D-IDs preserved:** D-06, D-07, D-11, D-12, D-14 semantics unchanged. The previewUrl:"/" stub from Deviation #2 is preserved.

---

**Total deviations:** 3 Rule 1 library-contract adaptations.
**Impact on plan:** All three deviations were necessary for the plan to execute against the actual installed library versions (next-sanity@^11, sanity@^5.22.0, React 19.2). No scope creep: each deviation is a contract-level adaptation, not a feature addition. D-14's install-only posture is preserved (Phase 6 still owns the real preview wiring).

## Issues Encountered

- **next-sanity version split between v11 and v12.** v12 requires Next 16 (not out yet for this repo); v11 is the correct line for Next 15. Resolved upfront as Deviation #1.
- **Presentation plugin's previewUrl is required by TypeScript.** Plan text assumed it was optional; Sanity v5.22.0's type signature says otherwise. Resolved as Deviation #2 with user approval.
- **Initial client/server boundary inverted** in commit 17ac872 — user reviewed the next-sanity@11 README, confirmed the correct layering, and approved the fix as Deviation #3.
- **Webpack vs React 19.2 `useEffectEvent` interop** — non-obvious failure mode: typecheck passes, build fails with a cryptic named-export error. Turbopack resolves it natively; documented so future Next-version bumps know to re-test.
- **Vercel env var propagation required a redeploy.** Standard Vercel gotcha — env var changes in the dashboard don't affect existing deployments; a new deploy had to be triggered after the three SANITY_* vars were added. No code change needed.

## User Setup Required

**Completed by Martin on 2026-04-22** (Task 3 human-action checkpoint):

- `.env.local` created with real values:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID=zs77se7r` (Sanity project ID — public by design per D-09)
  - `NEXT_PUBLIC_SANITY_DATASET=production` (D-10 locked)
  - `SANITY_API_READ_TOKEN=<180-char Viewer-scope token>` (server-only; value not inspected; rotation cadence per PROJECT.md security discipline + Phase 9 MIG-03 security pass)
- Vercel project env vars synced to Production + Preview + Development scopes for all three SANITY_* entries; `SANITY_API_READ_TOKEN` marked Sensitive.
- Sanity dashboard CORS origins added (5 entries, all with Credentials: allow):
  - `http://localhost:3000`
  - `http://root.localhost:3000`
  - `http://hk.localhost:3000`
  - `http://sg.localhost:3000`
  - `https://*.vercel.app`

**Phase 10 follow-up (T-01-14 handoff):** tighten CORS allowlist to `https://proactivsports.com` + `https://hk.proactivsports.com` + `https://sg.proactivsports.com` when the custom domain attaches. The permissive `*.vercel.app` entry stays until then.

## Verification Results

All verification steps passed before this SUMMARY was written.

- `pnpm typecheck` — 0 errors.
- `pnpm build` (turbopack) — 4 routes compile: `/root`, `/hk`, `/sg`, `/studio/[[...tool]]` (~1.67 MB first load JS on the Studio route; expected — Studio is client-heavy by design).
- `curl http://localhost:3000/studio` — HTTP 200.
- `curl -H 'Host: hk.localhost:3000' http://localhost:3000/studio` — HTTP 200.
- Neither response carries an `x-middleware-rewrite` header — proves the D-07 pass-through invariant at the HTTP layer. Plan 01-04 will encode this as a regression test.
- Studio OAuth login renders when `/studio` is opened in a browser; after login the sidebar shows Site Settings (singleton, pinned above divider) + Page / Post / Venue / Coach / Camp / Testimonial / FAQ (7 stubs).
- Presentation tab in the Studio nav iframes the root placeholder (Deviation #2 — not the plan's original "preview not configured" empty state, but functionally equivalent for Phase 1: no document-to-URL resolver is wired).

## Handoff to Plan 01-04 (Vitest middleware regression tests)

**Regression test to encode:**

The D-07 pass-through invariant must become a Vitest assertion so any future refactor that accidentally removes `studio` from the middleware matcher fails CI immediately.

**Exact matcher line (for the test author):**

```ts
// middleware.ts line 119
matcher: [
  "/((?!_next/|api/health|favicon\\.ico|monitoring|studio|.*\\.(?:svg|png|jpg|jpeg|webp|avif|ico|gif|woff2?)).*)",
],
```

**The invariant the test must encode:**

> A request to `/studio` on ANY `Host` value (`hk.proactivsports.com`, `sg.proactivsports.com`, `root.proactivsports.com`, `*.vercel.app`, plain `localhost:3000`, or any unknown host) must NOT receive an `x-middleware-rewrite` header from our middleware. If the header is present — or if middleware produces a `NextResponse.rewrite()` to `/hk/studio`, `/sg/studio`, or `/root/studio` — the test must fail.

**Minimal assertion shape:**

```ts
// Pseudo — use whatever middleware-test harness Plan 01-04 adopts
test("D-07: /studio passes through on any host (no market rewrite)", async () => {
  for (const host of ["hk.proactivsports.com", "sg.proactivsports.com", "root.proactivsports.com", "localhost:3000", "unknown.example.com"]) {
    const req = new NextRequest(`http://${host}/studio`, { headers: { host } });
    const res = await middleware(req);
    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
  }
});
```

Plan 01-04's scope (per ROADMAP): Vitest + D-16 hostile-request invariant (7+ tests) + CI integration as 5th required check (D-17). This /studio assertion is an 8th test fitting cleanly into that scope.

## Handoff to Phase 6 (CMS schema population)

- The 8 empty schema stubs in `sanity/schemaTypes/` are the direct work surface for CMS-01..CMS-08. Each stub currently has one `title:string` field + a D-11 reference comment at the top of the file. Phase 6 replaces each file's `fields` array with real content modelling derived from `strategy.md` PART 13.2 + the wireframes landed in Phases 3–5.
- The schema barrel (`sanity/schemaTypes/index.ts`) stays stable across Phase 6 — new document types get appended to the imports + array; the file itself doesn't need restructuring.
- `sanity/structure.ts` singleton pattern is reusable: Phase 6 appends further singletons (homepage, global nav, footer NAP) by adding `listItem` entries above the divider and extending the filter exclude list.
- **Presentation plugin real wiring:** CMS-05 replaces `presentationTool({ previewUrl: "/" })` with a real `previewUrl` resolver function + a Next.js Draft Mode API route. The `previewUrl: "/"` stub from Deviation #2 is a drop-in replacement target.
- **SANITY_API_READ_TOKEN usage:** Phase 6 introduces the server-side Sanity client (`next-sanity/client` or similar) that reads this token for draft-mode + preview content. Token is already in the Vercel env, already has Viewer scope.

## Handoff to Phase 10 (launch)

- **T-01-14 (CORS tightening):** Sanity CORS allowlist currently includes `https://*.vercel.app` — permissive. When the custom domain attaches in Phase 10, replace with `https://proactivsports.com`, `https://hk.proactivsports.com`, `https://sg.proactivsports.com`.
- **T-01-12 (Studio access re-evaluation):** Once `proactivsports.com` is a public custom domain, Vercel Deployment Protection stops gating the production `/studio` URL — the posture degrades from two-gate (Deployment Protection + Sanity OAuth) to one-gate (Sanity OAuth only). Phase 10 planner should decide: (a) Cloudflare Access in front of `/studio`, (b) move Studio to `studio.proactivsports.com` with its own auth layer, or (c) accept single-factor Sanity OAuth.
- **Sanity token rotation:** Phase 9 MIG-03 audits + rotates the `SANITY_API_READ_TOKEN` before launch; confirms Viewer-only scope.

## Self-Check

- `sanity.config.ts` at repo root: FOUND
- `sanity/structure.ts` at repo root: FOUND
- `sanity/schemaTypes/index.ts`: FOUND
- `sanity/schemaTypes/siteSettings.ts`: FOUND
- `sanity/schemaTypes/page.ts`: FOUND
- `sanity/schemaTypes/post.ts`: FOUND
- `sanity/schemaTypes/venue.ts`: FOUND
- `sanity/schemaTypes/coach.ts`: FOUND
- `sanity/schemaTypes/camp.ts`: FOUND
- `sanity/schemaTypes/testimonial.ts`: FOUND
- `sanity/schemaTypes/faq.ts`: FOUND
- `app/studio/[[...tool]]/page.tsx`: FOUND
- `app/studio/[[...tool]]/layout.tsx`: FOUND
- `middleware.ts` matcher contains `studio`: FOUND (line 119)
- `.env.example` contains `NEXT_PUBLIC_SANITY_PROJECT_ID`: FOUND
- `.env.example` contains `NEXT_PUBLIC_SANITY_DATASET=production`: FOUND
- `.env.example` contains `SANITY_API_READ_TOKEN`: FOUND
- `README.md` contains `## Preview testing recipe`: FOUND
- `next.config.ts` contains `transpilePackages`: FOUND
- `package.json` contains `sanity` at ^5.22.0: FOUND
- `package.json` contains `next-sanity` at ^11.6.13: FOUND
- `package.json` contains `@sanity/vision` at ^5.22.0: FOUND
- `package.json` dev script uses `--turbopack`: FOUND
- `package.json` build script uses `--turbopack`: FOUND
- Commit `761658a` in git log: FOUND (feat(01-03): install sanity deps + 8 schema stubs + siteSettings singleton)
- Commit `17ac872` in git log: FOUND (feat(01-03): embed Sanity Studio at /studio)
- Commit `67a794b` in git log: FOUND (feat(01-03): exclude /studio from middleware market rewrite)
- Commit `c21cf39` in git log: FOUND (docs(01-03): add Sanity env contract to .env.example + Preview testing recipe to README)
- Commit `8ff9e59` in git log: FOUND (fix(01-03): correct client/server boundary + enable turbopack for sanity v5 build)

## Self-Check: PASSED

## Known Stubs

- **`presentationTool({ previewUrl: "/" })` in `sanity.config.ts`** — install-only stub per D-14 + Deviation #2. Documented above; Phase 6 CMS-05 replaces with real resolver. Intentional, approved by user.
- **All 8 schema files in `sanity/schemaTypes/`** — each is a `defineType` with a single `title:string` field. Intentional per D-11; Phase 6 CMS-01..CMS-08 replaces each file's `fields` array with real content modelling. Documented in each file's top comment.

No unintentional stubs — the intentional stubs above are covered by explicit decisions and have clear Phase 6 follow-up owners.

## Threat Flags

No new security-relevant surface introduced beyond what the plan's `<threat_model>` anticipated (T-01-10 through T-01-15 all accounted for in CONTEXT.md + plan frontmatter). The Turbopack switch (Deviation #3) is a bundler change, not a trust-boundary change. The previewUrl:"/" stub (Deviation #2) does not change the trust posture — Presentation already had access to the same project credentials; iframing `/` instead of nothing is cosmetic.

---

*Phase: 01-next-js-foundation-subdomain-middleware-sanity-studio-scaffold-vercel-previews*
*Plan: 01-03*
*Completed: 2026-04-22*

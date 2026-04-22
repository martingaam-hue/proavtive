# Phase 1: Next.js foundation, subdomain middleware, Sanity Studio scaffold, Vercel previews — Context

**Gathered:** 2026-04-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 1 delivers the runtime backbone every subsequent phase builds on: a single Next.js 15 App Router app that boots on Vercel preview URLs, `middleware.ts` routing requests by `Host` (production) or by `x-market` cookie / `?__market=` query (preview / fallback) into three route groups `app/(root)/`, `app/(hk)/`, `app/(sg)/`, and an embedded Sanity Studio at `/studio` backed by an existing Sanity project. Everything is validated on Vercel preview URLs + `*.localhost:3000`.

**Satisfies:** FOUND-02 (Next.js 15 + Tailwind + shadcn-pattern base typed + deploying on Vercel), FOUND-03 (subdomain middleware → route groups with hostile-request guard), FOUND-04 (Sanity Studio scaffolded with seed content models).

**Out of scope for this phase:**
- Brand tokens / self-hosted fonts / primitive component library → Phase 2 (DS-01..DS-06)
- Real homepage / market / pillar content → Phases 3–5
- Full Sanity schemas (Page, Post, Venue, Coach, Camp, Testimonial, FAQ content fields) → Phase 6 (CMS-01..CMS-07)
- Sanity webhook → ISR `revalidatePath` wiring → Phase 6 (CMS-05)
- `@sanity/presentation` live-preview URL resolver + Next.js Draft Mode handler → Phase 6
- Component test rig (RTL, jsdom) → Phase 2
- Sitemap / robots.txt / llms.txt / JSON-LD → Phase 7 (SEO-01..SEO-08)
- Cloudflare WAF / bot management / rate limiting / custom domain → Phase 10 (FOUND-01, FOUND-07, CMS-08, MIG-01, MIG-04)

</domain>

<decisions>
## Implementation Decisions

### Subdomain routing + preview simulation

- **D-01: Middleware host-resolution precedence is `Host > cookie > query > default root`.** Production (`*.proactivsports.com`, once Phase 10 attaches the domain) and local dev (`*.localhost:3000`, which Chrome/Safari resolve natively without `/etc/hosts`) use `Host`. Preview URLs (`*.vercel.app`, Phases 1–9) don't expose a wildcard subdomain on Hobby plan, so middleware falls through to the `x-market` cookie, then to a `?__market=` query parameter that sets the cookie, and finally defaults to root.
- **D-02: Known `Host` values are authoritative and cannot be overridden.** When `Host` matches a configured market (`hk.*` or `sg.*`), the market cookie and query string are ignored for routing. This is the security posture that SC #4's hostile-request test encodes — see D-14/D-15 below.
- **D-03: Unknown hosts render root.** Any `Host` that doesn't match a known market (plain `*.vercel.app`, typos, `www.*`, bot-set headers, plain `localhost:3000`) routes to the `(root)` group. Matches the eventual production semantics where bare `proactivsports.com` IS the root gateway.
- **D-04: Route groups are the implementation vehicle.** `app/(root)/`, `app/(hk)/`, `app/(sg)/` — middleware uses `NextResponse.rewrite()` to map the incoming path to an internal `/<market>/<path>` that the App Router resolves into the group. Groups are invisible in URLs (standard Next.js convention), so external URLs stay clean (`hk.proactivsports.com/gymnastics/` not `.../hk/gymnastics/`).
- **D-05: Plain `localhost:3000` = root.** Dev flow uses `root.localhost:3000`, `hk.localhost:3000`, `sg.localhost:3000` explicitly. Plain `localhost` falls through the precedence to `default root` — one code path, no special-casing. (SC #5 is satisfied by the three prefixed URLs.)

### Sanity Studio

- **D-06: Studio is embedded at `/studio` in the same Next.js app** (Sanity v3+ embedded pattern via `next-sanity`). Single Vercel deploy, single env, shares middleware + Sentry + Deployment Protection.
- **D-07: `/studio` is reachable on any host in Phase 1.** Middleware does not 404 `/studio` on `hk.*` or `sg.*` — the Sanity session gate + Vercel Deployment Protection are the two access controls. A future move to `studio.proactivsports.com` is a Phase 6+ revisit if the editor experience needs the separation.
- **D-08: Use the existing Sanity project.** Martin owns it; project is empty / throwaway — no content migration concern. No Phase 6 cleanup needed.
- **D-09: Credentials land via Vercel env during execution, NOT in planning artifacts.** The env-var contract is `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_READ_TOKEN` (names subject to minor adjustment by planner to match `next-sanity` conventions). `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are safe to expose client-side. Planner writes the contract; executor pauses for Martin to drop values into Vercel dashboard + `.env.local` before completing the Sanity wiring step.
- **D-10: Single `production` dataset for Phases 1–5.** No separate `development` dataset in Phase 1. Re-evaluate if Phase 6 editor workflows demand isolation; for now, one dataset matches "scoped to preview + prod, all throwaway until Phase 6" reality.

### Seed schema scope

- **D-11: Full Phase 6 type skeleton lands as empty stubs.** One file per type under `sanity/schemaTypes/`: `siteSettings`, `page`, `post`, `venue`, `coach`, `camp`, `testimonial`, `faq`. Each contains exactly `defineType({ name, title, type: 'document', fields: [{ name: 'title', type: 'string', title: 'Title' }] })` — no Phase 6 content modeling. Phase 6 rewrites each file with real fields derived from PART 3/4/5 wireframes + PART 13.2 editable-content map.
- **D-12: Singleton pattern is established in Phase 1.** `siteSettings` is configured as a Sanity singleton via structure-tool customization (`S.documentTypeListItem` pattern). Sets the convention Phase 6's other singletons (`homepage`, global nav, footer NAP) inherit. Prevents the "multiple siteSettings docs" footgun.
- **D-13: `defineType()` in `sanity/schemaTypes/*.ts` (TypeScript).** Matches Sanity v3+ current best practice, keeps files co-located, and enables future `sanity typegen` to feed frontend types from the same source of truth. Each schema type is registered via a barrel `index.ts` imported by `sanity.config.ts`.
- **D-14: Studio plugins are Structure + Vision + Presentation.** Structure + Vision work end-to-end in Phase 1 (Vision is GROQ playground — useful while wiring Phase 6). Presentation plugin is **installed and appears in the Studio nav ONLY** — no preview URL resolver, no Draft Mode Next.js route, no iframe target. Clicking Presentation in Studio shows the "preview not configured" empty state. Phase 6 owns the backend wiring (CMS-05 + draft mode).

### Route-guard testing

- **D-15: Vitest wiring is pulled forward from Phase 2 into Phase 1, scoped to middleware only.** Phase 1 adds `vitest`, `@vitest/ui` (optional), and a `vitest.config.ts` limited to `middleware.test.ts` (and any future pure-TS unit tests). React Testing Library + jsdom + component-level rig stays deferred to Phase 2 — Phase 2 inherits this scoped Vitest setup and expands it.
- **D-16: The hostile-request test asserts host authority.** Given a `NextRequest` with `Host: hk.proactivsports.com`, middleware rewrites to the `(hk)` internal path regardless of `x-market` cookie or `?__market=sg` query. This directly satisfies SC #4 ("a hostile request simulating `hk.*` hitting an `(sg)` route does NOT leak content") at the routing layer — no actual rendering required, since D-02's precedence rule is where the security lives.
- **D-17: Add `pnpm test:unit` script running Vitest.** Wire the script into the `build` / CI workflow added in Phase 0 (`00-04-PLAN.md`) as a new required check, so route-guard regressions block merge. Planner to confirm exact GHA-workflow edit.

### Claude's Discretion

These are implementation details the planner / executor can decide without re-opening:
- **shadcn/ui install scope for Phase 1** — install shadcn CLI + `components.json` registry config + ONE example primitive (Button) to prove the wire-up. Brand tokens, full primitive library, and Tailwind design-token mapping stay in Phase 2. Choice of example primitive is Claude's.
- **Exact `middleware.ts` `matcher` config** — exclude `/_next`, `/api/health`, static assets, `/favicon.ico`, and Sentry's `/monitoring` tunnel route. Planner picks the precise exclude list.
- **`x-market` cookie specifics** — name, path (`/`), SameSite (`Lax`), TTL (session vs N days), Secure flag (on in production only). Small design choice; keep conservative.
- **Reserved-subdomain parsing** — `www.`, `api.`, `studio.` (future), Vercel's `<project>-<hash>-<team>.vercel.app` pattern all fall through to "unknown host → root" per D-03 unless explicitly mapped. No need to hard-block `www.*` — root rendering is the right answer.
- **Sentry integration for middleware** — relies on existing `instrumentation.ts` from Phase 0 (`00-05-PLAN.md`). No new Sentry config in Phase 1; middleware errors surface automatically.
- **Sanity CORS origins** — Studio embedded in the same app doesn't cross origins for its own fetches, but the frontend querying Sanity does. Planner adds Vercel preview origins + `*.localhost:3000` + production origin (placeholder for Phase 10) to the Sanity project CORS whitelist.
- **`.env.example` updates** — append the Sanity env-var contract from D-09 with empty values and a comment pointing to `docs/`.
- **README update** — add a "Preview testing recipe" section explaining how to set `?__market=` / the cookie on Vercel preview URLs + how to hit `*.localhost:3000` for local dev. Short, command-forward.
- **Sanity `Studio` route file** — the exact shape of `app/studio/[[...tool]]/page.tsx` and the accompanying `sanity.config.ts` follow current `next-sanity` docs. Planner picks between co-locating Studio config in `app/studio/` vs a root-level `sanity.config.ts` (the current Sanity recommendation).
- **TypeScript strictness** — keep Phase 0's tsconfig as-is; do not bump strict-flags in Phase 1. If `next-sanity` or `@sanity/presentation` requires any tsconfig tweak, planner applies the minimum.
- **`/studio` robots handling** — existing `X-Robots-Tag: noindex, nofollow` on all non-prod responses (`next.config.ts`, D-15 of Phase 0) covers Studio. No per-route addition needed; Phase 7 owns prod robots behavior.

### Folded Todos

None — no pending todos matched Phase 1 in the GSD todo-matcher pass.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents (researcher, planner, executor) MUST read these before planning or implementing.**

### Strategy doc (canonical brief)
- `.planning/inputs/strategy.md` § PART 2 — Site architecture, domain strategy, ecosystem sitemap, cross-linking + canonical rules. Anchors what each route group actually represents.
- `.planning/inputs/strategy.md` § PART 13.1 — Recommended stack (Next.js 15 + Sanity + Vercel + Cloudflare). Confirms embedded Studio + headless pattern.
- `.planning/inputs/strategy.md` § PART 13.2 — Editable content map. Informs which document types land as empty stubs in D-11 (siteSettings, page, post, venue, coach, camp, testimonial, faq).
- `.planning/inputs/strategy.md` § PART 13.6 — Security discipline. Reinforces D-09 env-var posture + Sanity token scoping.
- `.planning/inputs/strategy.md` § PART 15.4 Weeks 0–2 — Technical setup sequence — Phase 1 corresponds to this window.

### Project-level constraints + decisions
- `.planning/PROJECT.md` § Constraints — Single Next.js app w/ subdomain middleware (not 3 apps) is locked; Sanity hosted; Mux for video (Phase 2).
- `.planning/PROJECT.md` § Key Decisions — 3-layer subdomain ecosystem; Sanity over Payload; single Next.js app with subdomain middleware; defer domain/DNS/Cloudflare to Phase 10.
- `.planning/REQUIREMENTS.md` § FOUND-02, FOUND-03, FOUND-04 — the three requirements Phase 1 must satisfy.
- `.planning/ROADMAP.md` § Phase 1 — Goal, 5 Success Criteria, Rough Shape, strategy anchors. This is the contract Phase 1 is measured against.
- `.planning/STATE.md` § Accumulated Context — Carry-forward decisions (domain → Phase 10, 1Password → Phase 10, one.com rejected).

### Phase 0 carry-forward (already satisfied — don't rebuild)
- `.planning/phases/00-local-foundation/00-CONTEXT.md` § Decisions — especially:
  - D-09 (`.env.local` manual copy flow — Sanity vars follow the same pattern)
  - D-11 (Conventional Commits enforced — Phase 1 commits conform)
  - D-13 (pnpm via Corepack, locked version — all new deps via pnpm)
  - D-14 (Vercel Deployment Protection gates all previews — Studio inherits)
  - D-15 (`X-Robots-Tag: noindex, nofollow` on non-prod via `next.config.ts` — Studio inherits; covers Phase 1's "no public preview leak" implicit requirement)
  - D-16 (Vercel Pro upgrade is Phase 10 prereq — Hobby constraints informed the D-01 query/cookie decision)
  - D-17–D-20 (`@sentry/nextjs` wired across client/server/edge, `VERCEL_ENV` tagging, conservative PII — new middleware + Studio routes inherit error capture automatically)

### External docs to consult during planning (not yet in repo)
- **next-sanity** embedded Studio docs — `app/studio/[[...tool]]/page.tsx` pattern, `sanity.config.ts` placement, `next-sanity/live` vs classic `next-sanity` client
- **Sanity Studio v3** structure-tool API — needed for D-12 singleton pattern
- **@sanity/vision** plugin setup
- **@sanity/presentation** plugin setup — install only (D-14); skip Preview/DraftMode sections
- **Next.js 15 middleware** docs — `NextRequest` / `NextResponse.rewrite()` / `matcher` config; Fluid Compute runtime implications (middleware now runs on full Node.js, not edge-only)
- **Vitest + Next.js 15** — `vitest.config.ts` for TS-only middleware tests; do NOT add `@vitejs/plugin-react` (no component tests in Phase 1)
- **Vercel Deployment Protection** docs — confirm Hobby-plan gating behavior specifically for embedded Sanity Studio (does the Sanity login work behind the Vercel auth gate?)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **None in `src/` / `components/`** — no product code yet. Phase 0 landed only scaffold: `app/page.tsx`, `app/layout.tsx` (both `create-next-app` boilerplate), `app/api/` (Sentry smoke route only), Sentry config files.
- **Sentry SDK already wired** (`@sentry/nextjs@^10.49.0`) across client + server + edge runtimes via `instrumentation.ts` + `instrumentation-client.ts` + `sentry.server.config.ts` + `sentry.edge.config.ts`. Phase 1 middleware + Studio errors flow to Sentry for free.

### Established Patterns (from Phase 0)
- **`next.config.ts` wraps `withSentryConfig`** — source maps, release tagging via `VERCEL_GIT_COMMIT_SHA`, `/monitoring` tunnel route. Don't unwrap it; new config additions go inside the `nextConfig` object passed into the wrapper.
- **`X-Robots-Tag: noindex, nofollow` on all non-production responses** via `next.config.ts` `headers()` conditional on `VERCEL_ENV !== 'production'`. Covers `/studio`. Real SEO robots arrives in Phase 7 (SEO-03).
- **`.env.local` is gitignored; `.env.example` lists contract** (D-09 of Phase 0). Phase 1 appends Sanity variables following the same pattern.
- **Conventional Commits via lefthook + commitlint** (D-11 of Phase 0). Phase 1 commits use `feat(01-XX): …`, `chore(01-XX): …`, etc., matching the existing `docs(phase-0)` / `feat(00-05)` patterns in git log.
- **Corepack + locked `packageManager: "pnpm@10.30.3"`** (D-13 of Phase 0). All new deps via `pnpm add`; do NOT introduce npm / yarn.
- **CI pipeline is GHA-only, required checks = typecheck + lint + build + gitleaks** (D-01/D-02 of Phase 0). Phase 1's `pnpm test:unit` (D-17) becomes a fifth required check.

### Integration Points (new in Phase 1)
- **`middleware.ts`** (repo root) — runs before route match; implements D-01 precedence; issues `NextResponse.rewrite()` into `/<market>/...` internal path.
- **`app/(root)/`, `app/(hk)/`, `app/(sg)/`** route groups — replace current `app/page.tsx` boilerplate. Each group has its own `layout.tsx` stub + `page.tsx` placeholder distinguishing the three route trees for SC #1.
- **`app/studio/[[...tool]]/page.tsx`** — embedded Sanity Studio mount per `next-sanity` current pattern.
- **`sanity.config.ts`** (repo root, recommended by Sanity) — Studio config, plugin wiring (Structure + Vision + Presentation install-only), schema registration.
- **`sanity/schemaTypes/*.ts`** — eight empty-stub type files (D-11) + `index.ts` barrel.
- **`sanity/structure.ts`** — structure-tool customization for D-12 singleton pattern.
- **`vitest.config.ts`** — middleware-only unit test runner.
- **`middleware.test.ts`** (co-located with `middleware.ts`) — Vitest test implementing D-16 hostile-request assertion.
- **`.env.example`** updated — Sanity env-var contract appended.
- **`package.json`** — new dev deps (`next-sanity`, `sanity`, `@sanity/vision`, `@sanity/presentation`, `@sanity/structure`, `vitest`); new scripts (`test:unit`, possibly `test:unit:ui`).

### Assets on disk (context, not used in Phase 1)
- `assets/brand/` — ProActiv/ProGym/Prodigy logos + PDF (Phase 2 onward)
- `.planning/inputs/strategy.md` — 12,540-word canonical brief
- `.planning/inputs/MEDIA-INVENTORY.md` — ~22 GB media catalog (Phase 2 onward)

</code_context>

<specifics>
## Specific Ideas

- **"Host is authoritative" as a security posture (D-02/D-16)** is chosen deliberately for the compliance context — ProActiv serves children and parents in HK PDPO + SG PDPA jurisdictions. A crisp invariant — "a known `Host` determines the market, full stop; cookie/query cannot override" — is easier to audit, easier to test, and harder to accidentally break than a looser precedence scheme. The hostile-request test makes this invariant visible in CI forever.
- **The query/cookie preview bridge (D-01) is explicitly a preview-window mechanism** (Phases 1–9). Once Phase 10 attaches `proactivsports.com` via Cloudflare + binds `hk.*` / `sg.*` to Vercel, the bridge becomes unused fallback code — but stays in middleware as a defensive default for unknown hosts. Planner should comment the `middleware.ts` logic so this intentional-obsolescence is clear to future-Martin.
- **Presentation plugin in Studio nav from day one** (D-14) is a deliberate client/editor signal — it shows Phase 6's preview capability is planned and surfaced, even though the backend isn't wired. Prevents "where's the live preview?" surprises when Martin or a client pokes around Studio between Phase 1 and Phase 6.
- **Full Phase 6 schema skeleton as empty stubs (D-11)** prevents the "Studio looks empty" wow-factor problem — client gets a structured sidebar even in Phase 1 — without locking in content structure before wireframes (Phases 3–5) and editable-map (PART 13.2) can inform it. The stub files serve as placeholders only; each file's body is <10 lines.
- **Vitest pulled forward (D-15)** is a conscious Phase 0 → Phase 1 scope adjustment. Phase 0's CONTEXT deferred Vitest to "Phase 2 when components exist to test" — Phase 1's SC #4 demands a route-guard test NOW, so middleware-scope Vitest earns its place. Component-scope Vitest + RTL + jsdom stays in Phase 2, cleanly inheriting the runner.
- **Single `production` dataset (D-10)** is a pragmatic, reversible decision — Martin can add `development` dataset later in Phase 6 if real editor workflows demand isolation. Flagging here so Phase 6 planner revisits.

</specifics>

<deferred>
## Deferred Ideas

These came up during discussion and are noted but explicitly NOT in Phase 1 scope:

- **Brand palette, typography, self-hosted fonts** — Phase 2 (DS-01, DS-02)
- **shadcn/ui primitive library (full)** — Phase 2 (DS-03). Phase 1 installs CLI + one example primitive only.
- **Image pipeline (Sharp → AVIF/WebP), Mux video** — Phase 2 (DS-04)
- **`/_design/` component gallery** — Phase 2 (DS-05)
- **Real homepage + market + pillar content** — Phases 3–5
- **Sanity schema fields beyond stubs** — Phase 6 (CMS-01)
- **Sanity roles & access groups (Admin/Editor/Author/Marketing)** — Phase 6 (CMS-02)
- **Sanity webhook → Vercel deploy hook → `revalidatePath`** — Phase 6 (CMS-05)
- **@sanity/presentation preview URL resolver + Next.js Draft Mode API route + iframe preview** — Phase 6
- **Separate `development` dataset** — revisit in Phase 6 if editor workflows demand isolation
- **`studio.proactivsports.com` as a dedicated host** — revisit post-Phase 6 if the `/studio` path becomes friction for the client
- **Component test rig (React Testing Library, jsdom, `@vitejs/plugin-react`)** — Phase 2
- **Playwright E2E** — not currently planned; revisit only if a critical flow emerges that Vitest cannot cover
- **Sitemaps, robots.txt, llms.txt, JSON-LD, per-page metadata** — Phase 7 (SEO-01..SEO-08)
- **GA4 / Search Console** — Phase 8 (SEO-09)
- **301 map from `.net`** — Phase 9 (MIG-02)
- **Cloudflare WAF, bot management, rate limiting** — Phase 10 (FOUND-07, CMS-08)
- **Custom domain binding `*.proactivsports.com` to Vercel** — Phase 10 (FOUND-01, MIG-01)
- **Vercel Pro upgrade for password-protected previews** — Phase 10 prereq (Phase 0 D-16)
- **Scope CORS origins to production** — Phase 10 (when real domain attaches)

### Reviewed Todos (not folded)

None — no pending todos matched Phase 1 in the GSD todo-matcher pass.

</deferred>

---

*Phase: 01-next-js-foundation-subdomain-middleware-sanity-studio-scaffold-vercel-previews*
*Context gathered: 2026-04-22*

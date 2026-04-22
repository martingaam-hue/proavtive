---
phase: 01-next-js-foundation-subdomain-middleware-sanity-studio-scaffold-vercel-previews
plan: 01
subsystem: infra
tags: [next-js-15, app-router, middleware, subdomain-routing, route-groups, rsc]

# Dependency graph
requires:
  - phase: 00-local-foundation
    provides: "Next.js 15 scaffold, Sentry wiring via instrumentation.ts, X-Robots-Tag non-prod header in next.config.ts, lefthook+commitlint, pnpm Corepack pin"
provides:
  - "Host-authoritative subdomain middleware (middleware.ts) implementing D-01 precedence (Host > cookie > query > default root)"
  - "Three market trees as plain App Router folders: app/root/, app/hk/, app/sg/ (distinct stripe colors + verbatim UI-SPEC copy)"
  - "D-04 URL-invisibility invariant preserved via NextResponse.rewrite() — markets never leak into the browser URL bar"
  - "Reserved-path matcher excluding _next/, api/health, favicon.ico, monitoring (Sentry tunnel), and static assets"
  - "Preview-bridge mechanism: ?__market=hk sets an x-market cookie so subsequent requests on unknown hosts stick"
affects: [01-02 shadcn-tailwind, 01-03 sanity-studio, 01-04 vitest-middleware-test, 02 design-system, 03-homepage, 04-hk-market, 05-sg-market, 10 cloudflare-cutover]

# Tech tracking
tech-stack:
  added: []  # zero new runtime deps — pure Next.js 15 App Router + middleware primitives
  patterns:
    - "Host-authoritative subdomain routing — known Host wins over cookie/query (D-02 security posture)"
    - "Plain-folder market trees (app/{root,hk,sg}/) as rewrite targets — three parens-groups cannot all resolve to / in Next 15, so D-04's INTENT is preserved by rewrite() while the MECHANISM changes from route groups to plain folders"
    - "Top-of-file D-reference comment discipline (middleware.ts cites D-01..D-05 and the intentional-obsolescence note by name)"
    - "Preview-bridge cookie flip: ?__market=hk sets session-scoped x-market=hk via NextResponse.cookies.set with sameSite: 'lax', secure gated on VERCEL_ENV === 'production'"
    - "Reserved-path matcher encoded as a negative lookahead regex — additive edits (Plan 01-03 adds /studio) extend the exclude list, never the allow list"

key-files:
  created:
    - "middleware.ts (repo root) — D-01 ladder, resolveHostMarket(), rewriteToMarket(), matcher"
    - "app/root/layout.tsx — slate-400 top stripe + ProActiv Sports — Root (Phase 1 placeholder) title"
    - "app/root/page.tsx — verbatim root-gateway placeholder copy"
    - "app/hk/layout.tsx — amber-400 top stripe + Hong Kong (Phase 1 placeholder) title"
    - "app/hk/page.tsx — verbatim HK placeholder copy"
    - "app/sg/layout.tsx — teal-400 top stripe + Singapore (Phase 1 placeholder) title"
    - "app/sg/page.tsx — verbatim SG placeholder copy"
  modified:
    - "app/layout.tsx — metadata now uses title.template: '%s' so per-market layouts override verbatim without prefix/suffix injection"
  deleted:
    - "app/page.tsx — create-next-app boilerplate removed"

key-decisions:
  - "Honored D-01 precedence (Host > cookie > query > default root) as four early-return branches in middleware()"
  - "Honored D-02 (known Host is authoritative; hostile cookie + query cannot override) — the Plan 01-04 Vitest test will encode this as a regression gate"
  - "Honored D-03 (unknown hosts fall through to root) — plain localhost:3000, *.vercel.app previews, www.*, bot-set headers all route to root"
  - "Honored D-04 INTENT via NextResponse.rewrite() (internal) rather than redirect (external) — the URL bar never shows /root|/hk|/sg — MECHANISM deviated from parens-named route groups to plain folders because three parens-groups resolving to / is a Next 15 build-time conflict (documented as the D-04 implementation note in 01-01-PLAN.md objective)"
  - "Honored D-05 (plain localhost = root) via the existing Step-4 default path — no special-case branch"
  - "Honored D-16 hostile-request invariant at the routing layer — Host check returns before cookie/query are ever read"
  - "x-market cookie set with sameSite: 'lax', path: '/', secure only when VERCEL_ENV === 'production', httpOnly: false (routing hint, not a secret) — Claude's Discretion per CONTEXT.md"
  - "Matcher excludes _next/, api/health, favicon.ico, monitoring, and common static extensions — /studio is intentionally NOT excluded (Plan 01-03 Task 2 patches the matcher per D-07)"
  - "Zero new runtime dependencies in this plan — shadcn/Sanity/Vitest land in Plans 01-02..01-04"

patterns-established:
  - "Top-of-file D-ref comment header on routing-critical files (cites every decision ID the file enforces, plus the intentional-obsolescence note so future-Martin knows the cookie/query bridge is preview-only but MUST stay for defense in depth)"
  - "Plain-folder market trees + middleware.rewrite() as the pragmatic way to honor D-04's INTENT when Next.js 15's route-group semantics conflict with its MECHANISM"
  - "Verbatim UI-SPEC copy in page.tsx (no interpolation, no templating) — SC #1 eye-test language is load-bearing and lives word-for-word in source"
  - "Server components only (zero 'use client' in Phase 1 market tree) — per UI-SPEC §Performance baseline"
  - "Tailwind bg-muted on placeholder surfaces — resolves to the shadcn neutral CSS var which will light up in Plan 01-02 without page edits (Phase 2 swaps the var to brand neutrals)"

requirements-completed:
  - FOUND-03  # subdomain middleware → market trees with hostile-request guard at the routing layer
  # FOUND-02 is partially satisfied (App Router + middleware base landed); Tailwind + shadcn base lands in Plan 01-02; full FOUND-02 marks complete at the end of Plan 01-02.

# Metrics
duration: ~30min (two atomic task commits + human-verify checkpoint turnaround)
completed: 2026-04-22
---

# Phase 1 Plan 01-01: Next.js App Router market trees + host-authoritative subdomain middleware Summary

**Three App Router market trees (plain-folder `app/root/`, `app/hk/`, `app/sg/`) + a `middleware.ts` at repo root that implements the D-01 precedence ladder using `NextResponse.rewrite()` so markets stay invisible in external URLs — D-04 intent preserved, D-02 host-authority encoded, Plan 01-04 regression test wiring reachable.**

## Performance

- **Duration:** ~30 min (spanning both code commits and the human-verify checkpoint turnaround)
- **Started:** 2026-04-22T20:41:00Z (earliest mtime on app/ tree after boilerplate deletion)
- **Task 1 committed:** 2026-04-22T20:54:10Z
- **Task 2 committed:** 2026-04-22T20:56:39Z
- **Human-verify approved:** 2026-04-22 (user confirmed all 5 URL checks including the D-04 URL-bar invariant)
- **Completed:** 2026-04-22T21:10:49Z (this summary commit)
- **Tasks:** 3 (2 code tasks + 1 verification gate)
- **Files modified:** 9 (7 created, 1 modified, 1 deleted)

## Accomplishments

- Subdomain routing runs on `*.localhost:3000` today without `/etc/hosts` edits — Chrome/Safari resolve wildcards natively; `hk.localhost:3000/` renders the HK placeholder and the URL bar stays clean (no `/hk/` leak).
- Host authority is encoded as the first early-return in `middleware()` — a request with `Host: hk.*`, cookie `x-market=sg`, and `?__market=sg` still routes HK (D-02 security posture). This is the exact invariant Plan 01-04's Vitest test will pin.
- D-04's external-URL contract is preserved through a pragmatic mechanism swap: the CONTEXT.md "parens-named route groups" plan was infeasible (three groups resolving to `/` is a Next.js 15 build-time conflict), so plain folders `app/{root,hk,sg}/` are the rewrite targets while `NextResponse.rewrite()` — an INTERNAL rewrite — keeps the market invisible in the browser URL bar. The 01-01-PLAN.md objective documents this mechanism swap.
- The preview-window bridge (`?__market=hk` → session cookie) works: flipping markets on `localhost:3000` (unknown host → Step 4) via the query sets `x-market=hk` for subsequent requests. This mechanism becomes defensive fallback code once Phase 10 attaches real subdomains, but **stays in middleware** per the intentional-obsolescence comment.
- `pnpm build` + `pnpm typecheck` pass (executor verified during Task 2).
- Zero runtime deps added — shadcn, Sanity, and Vitest land in Plans 01-02..01-04.

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold root/hk/sg market trees with placeholder pages** — `23fa63a` (feat) — deleted `app/page.tsx`, wrote the three plain-folder trees with distinct stripe colors and verbatim UI-SPEC copy, updated `app/layout.tsx` metadata to use `title.template: "%s"` so per-market titles override verbatim.
2. **Task 2: Add middleware.ts with D-01 precedence ladder** — `642fe15` (feat) — implemented `resolveHostMarket()` (exact `hk.`/`sg.`/`root.` prefix match, lowercased + port-stripped), `rewriteToMarket()` (internal rewrite preserving D-04), the matcher regex (excluding `_next/`, `api/health`, `favicon.ico`, `monitoring`, static assets), and the intentional-obsolescence comment block.
3. **Task 3: Human smoke-test of middleware routing** — verification gate only, NO code commit. The executor's automated curl harness passed (`Host: hk.*` → "Hong Kong", `Host: sg.*` → "Singapore", `Host: root.*` → "Root"). The user then manually verified all 5 URL checks from the PLAN.md `<how-to-verify>` block, including the D-04 URL-bar invariant check on `hk.localhost:3000/` and `sg.localhost:3000/` (URL bar stays clean, no market-prefix leak), and typed "approved".

**Plan metadata commit:** this SUMMARY + STATE.md + ROADMAP.md updates (hash emitted by the final `gsd-tools commit` call below).

## Files Created/Modified

- `middleware.ts` — 117 lines; repo root; D-01 ladder + `resolveHostMarket()` + `rewriteToMarket()` + matcher.
- `app/layout.tsx` — modified; preserved Geist + Geist_Mono imports, `<html lang="en">`, body classes; swapped `metadata` to use `title: { default: "ProActiv Sports", template: "%s" }` so per-market layouts override with their own title verbatim (no prefix/suffix).
- `app/page.tsx` — **deleted** (was create-next-app boilerplate).
- `app/root/layout.tsx` — slate-400 distinguisher stripe, `title: "ProActiv Sports — Root (Phase 1 placeholder)"`.
- `app/root/page.tsx` — `<h1>ProActiv Sports — Root</h1>` + verbatim UI-SPEC paragraph.
- `app/hk/layout.tsx` — amber-400 distinguisher stripe, `title: "ProActiv Sports — Hong Kong (Phase 1 placeholder)"`.
- `app/hk/page.tsx` — `<h1>ProActiv Sports — Hong Kong</h1>` + verbatim UI-SPEC paragraph (Phase 4 callout for stripe removal).
- `app/sg/layout.tsx` — teal-400 distinguisher stripe, `title: "ProActiv Sports — Singapore (Phase 1 placeholder)"`.
- `app/sg/page.tsx` — `<h1>ProActiv Sports — Singapore</h1>` + verbatim UI-SPEC paragraph (Phase 5 callout for stripe removal).

No parens-named route group directories exist (`app/(root)/`, `app/(hk)/`, `app/(sg)/`) — D-04 mechanism deviated to plain folders per the PLAN.md objective's implementation note.

## Decisions Made

- **D-04 MECHANISM deviation (pre-approved in the plan objective):** Used plain folders `app/{root,hk,sg}/` + `NextResponse.rewrite()` instead of parens-named route groups. Three route groups all resolving to `/` produces a Next.js 15 build-time conflict; INTENT (markets invisible in external URLs) is fully preserved because `rewrite()` is an internal rewrite — the client's URL bar never changes.
- **Matcher scope (Claude's Discretion per CONTEXT.md):** Excluded `_next/`, `api/health`, `favicon.ico`, `monitoring`, and common static asset extensions (`svg|png|jpg|jpeg|webp|avif|ico|gif|woff2?`). `/studio` is intentionally NOT excluded here — Plan 01-03 Task 2 owns that patch per D-07, and Plan 01-04 encodes the `/studio` pass-through as a regression test.
- **Cookie config (Claude's Discretion):** `sameSite: "lax"`, `path: "/"`, `secure: process.env.VERCEL_ENV === "production"`, `httpOnly: false`, session-scoped (no `maxAge`). Conservative defaults matching CONTEXT.md guidance; `httpOnly: false` is deliberate because the cookie is a routing hint, not a secret.
- **Host prefix matching is EXACT** (`bare.startsWith("hk.")`, not `startsWith("hk")`): `hkstudio.proactivsports.com`, `hkmalicious.com`, etc., fall through to "unknown → root" instead of matching HK. This neutralises the T-01-04 defensive spoofing case. Host is lowercased + port-stripped before comparison.

## Deviations from Plan

None requiring auto-fix. The D-04 mechanism swap (parens-named route groups → plain folders) was documented in the 01-01-PLAN.md objective itself, so it is a planned deviation, not an executor-initiated one. No Rule 1/2/3 interventions were triggered.

## Issues Encountered

None. The plan was executed exactly as written by the prior executor, all automated `<verify>` checks passed on both task commits, and the user approved the human-verify checkpoint on first pass.

## Checkpoint Outcome

**Task 3 — Human-verify, approved 2026-04-22.**

Visually confirmed by user:

- `root.localhost:3000/` — slate stripe, root copy, tab title "ProActiv Sports — Root (Phase 1 placeholder)".
- `hk.localhost:3000/` — amber stripe, HK copy, **URL bar stays `hk.localhost:3000/`** (D-04 invariant preserved — no `/hk/` leak).
- `sg.localhost:3000/` — teal stripe, SG copy, URL bar stays clean.
- `localhost:3000/` — slate stripe, root copy (D-05 plain localhost fallthrough).
- `localhost:3000/?__market=hk` — HK placeholder on first load, `x-market=hk` cookie set, cookie persists on subsequent requests.

No iteration needed.

## Notes for Plan 01-04 (Vitest middleware test)

The test author should assert the following runtime contracts. The rewrite pattern comes directly from `rewriteToMarket()` in `middleware.ts`:

- For incoming pathname `/`, the rewrite destination URL pathname is `/{market}` (no trailing slash).
- For incoming pathname `/foo` (any non-`/` path), the rewrite destination is `/{market}/foo`.
- For Host `hk.proactivsports.com` with cookie `x-market=sg` and query `?__market=sg`, the returned `NextResponse` has the `x-middleware-rewrite` header set to a URL ending in `/hk` (D-02 + D-16 hostile-request case).
- For Host `hkstudio.proactivsports.com`, the Host path does NOT match — rewrite goes via Step 4 default to `/root` (T-01-04 defensive case).
- For unknown Host + `?__market=hk`, the response rewrites to `/hk` AND sets a `x-market=hk` cookie (D-01 Step 3 bridge; `res.cookies.get('x-market')?.value === "hk"`).
- For unknown Host + no cookie + no query, rewrites to `/root` (D-03 + D-05).
- Matcher excludes: a request to `/_next/static/foo.js`, `/favicon.ico`, `/monitoring`, `/api/health`, or `/logo.svg` should NOT invoke `middleware()` — assert at the matcher-regex level (unit-test the regex by string-matching against sample paths) OR by instantiating the middleware only over paths the matcher passes.
- `/studio` intentionally matches the current matcher (Plan 01-03 Task 2 will patch in the exclude — Plan 01-04 should have a test case that FIRST fails on `/studio` being rewritten, and the failure is resolved by Plan 01-03's patch). If Plan 01-04 sequences AFTER Plan 01-03, make the test assert `/studio` passes through unrewritten instead.

The exact header name Next.js uses for internal rewrites in middleware responses is `x-middleware-rewrite` (per Next.js 15 `NextResponse.rewrite()` convention). Test assertions can read this via `response.headers.get("x-middleware-rewrite")`; a redirect (D-04 violation) would instead set `Location` and have status 307/308.

## Next Phase Readiness

Ready for Wave 2:

- **Plan 01-02 (shadcn/Tailwind base)** — no dependency conflict; installs the shadcn registry + `components.json` + one example Button primitive. Completes FOUND-02 (Tailwind + shadcn base).
- **Plan 01-03 (Sanity Studio mount)** — will patch `middleware.ts` `config.matcher` to add `studio` per D-07 (Studio reachable on any host). This is the one known touch on this plan's artifact; the matcher edit should be a minimal additive change.
- **Plan 01-04 (Vitest wiring + middleware test)** — depends on both the middleware contract this plan established AND Plan 01-03's matcher patch. Can run after 01-02 and 01-03 land.

No blockers for Wave 2.

## Self-Check: PASSED

- `middleware.ts` exists at repo root: FOUND
- `app/root/{layout,page}.tsx` exist: FOUND
- `app/hk/{layout,page}.tsx` exist: FOUND
- `app/sg/{layout,page}.tsx` exist: FOUND
- `app/page.tsx` does NOT exist: CONFIRMED
- Commit `23fa63a` in git log: FOUND
- Commit `642fe15` in git log: FOUND
- No parens-named directories (`app/(root)/`, `app/(hk)/`, `app/(sg)/`): CONFIRMED (ls output showed only plain folders)

---
*Phase: 01-next-js-foundation-subdomain-middleware-sanity-studio-scaffold-vercel-previews*
*Plan: 01-01*
*Completed: 2026-04-22*

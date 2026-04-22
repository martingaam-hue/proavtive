# Phase 1: Next.js foundation, subdomain middleware, Sanity Studio scaffold, Vercel previews — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in `01-CONTEXT.md` — this log preserves the alternatives considered.

**Date:** 2026-04-22
**Phase:** 01 — Next.js foundation, subdomain middleware, Sanity Studio scaffold, Vercel previews
**Areas discussed:** Preview subdomain simulation, Sanity Studio placement, Seed schema scope, Route-guard testing

---

## Gray Area Selection

**Question:** Which areas do you want to discuss for Phase 1?

| Option | Description | Selected |
|--------|-------------|----------|
| Preview subdomain simulation | How to simulate hk/sg subdomains on single-host Vercel preview URLs before Phase 10 attaches real DNS. | ✓ |
| Sanity Studio placement | Embedded `/studio` vs separate deployment vs Sanity-hosted. | ✓ |
| Seed schema scope | Minimum placeholder vs anticipatory Phase 6 skeleton. | ✓ |
| Route-guard testing | Vitest unit vs Playwright E2E for SC #4 hostile-request test. | ✓ |

**User's choice:** All four areas selected.

---

## Preview subdomain simulation

### Q1: Primary preview simulation mechanism on Vercel Hobby plan

| Option | Description | Selected |
|--------|-------------|----------|
| Query/cookie override | Middleware reads `?__market=hk` on preview URLs, sets `x-market` cookie, routes accordingly. Prod uses Host. | ✓ |
| Path-prefix on previews | Middleware recognizes `/r/`, `/hk/`, `/sg/` path prefixes only on preview deploys. | |
| Host-header override only | curl / ModHeader to set Host header; no in-app bridge. | |
| Cheap throwaway preview domain | Register e.g. proactivsports-preview.net for wildcard preview DNS. | |

**Rationale:** Clean parity with production (middleware always reads "intent" — just from different sources); no extra domain purchase; works on Hobby plan without Pro upgrade.

### Q2: Unknown host fallback

| Option | Description | Selected |
|--------|-------------|----------|
| Render root | Treat unknown-host (plain *.vercel.app, www.*, typos, bots) as root brand gateway. | ✓ |
| Market selector page | Render `/` as a selector page with 'Enter Hong Kong / Enter Singapore / Visit Root' links. | |
| Return 404 | Strict: unknown host = not found. | |
| Redirect to root canonical | 302 to root URL. | |

**Rationale:** Matches eventual production (bare `proactivsports.com` IS the root gateway); no extra UI; one code path.

### Q3: Plain `localhost:3000` behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Same as unknown-host rule | Plain localhost = root, consistent with Q2. | ✓ |
| Forced dev market selector | Selector page always on plain localhost. | |
| 302 to root.localhost:3000 | Redirect so devs always land on canonical dev URL. | |

**Rationale:** Single routing rule; devs use `root.localhost:3000` / `hk.localhost:3000` / `sg.localhost:3000` explicitly (SC #5).

---

## Sanity Studio placement

### Q1: Where does Studio live?

| Option | Description | Selected |
|--------|-------------|----------|
| Embedded at /studio | Same Next.js app via `next-sanity`; single deploy; shares middleware/Sentry/Deployment Protection. | ✓ |
| Separate Vercel deployment | Second Next.js or pure Sanity CLI project, isolated. | |
| Sanity's hosted URL | `proactiv.sanity.studio` via `sanity deploy`; zero hosting config. | |

**Rationale:** Current Sanity-recommended pattern; simplest single-deploy story; shares all Phase 0 guardrails.

### Q2: Which hosts expose /studio in Phase 1 middleware?

| Option | Description | Selected |
|--------|-------------|----------|
| Any host | /studio reachable on root, hk, sg preview hosts. | ✓ |
| Root host only | Middleware 404s /studio on hk.* and sg.*. | |
| Reserved studio.* subdomain | Dedicated `(studio)` group + subdomain simulation. | |

**Rationale:** Simplest; gates (Sanity login + Deployment Protection) already provide access control.

### Q3: Sanity project setup

| Option | Description | Selected |
|--------|-------------|----------|
| New project (Martin-owned) | Create fresh Sanity project in Phase 1. | |
| Existing project | Martin already has one; share project ID/credentials. | ✓ |
| Stub without real project | Install packages + placeholder projectId; real project in Phase 6. | |

### Q4: Dataset setup

| Option | Description | Selected |
|--------|-------------|----------|
| Single 'production' dataset | One dataset for preview + prod in Phase 1–5. | ✓ |
| 'production' + 'development' | Two datasets from day one; discipline for Phase 6. | |
| Only 'development' for now | Skip production until Phase 6. | |

**Rationale:** Content is throwaway until Phase 6; minimal env-var juggling now.

### Q5 (follow-up): Existing project credentials handling

| Option | Description | Selected |
|--------|-------------|----------|
| Share mid-execution via Vercel env | Planner writes env-var contract; Martin drops values during executor step. | ✓ |
| Share project ID now (paste in CONTEXT) | Public project ID is safe to commit; tokens still via env. | |
| Create a second project | Leave existing untouched; fresh slate to match "clean .com, clean CMS" ethos. | |

### Q6 (follow-up): Existing project content state

| Option | Description | Selected |
|--------|-------------|----------|
| Empty / throwaway | No migration; Phase 6 builds fresh. | ✓ |
| Has old content | Phase 6 needs content migration or wipe plan. | |
| Not sure | Treat as possibly-content for now. | |

---

## Seed schema scope

### Q1: How much schema scaffolding?

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal singleton only | Just siteSettings with 2-3 stub fields; Phase 6 owns everything else. | |
| Singleton + Post stub | siteSettings + minimal Post type so Phase 4/5 can stub blog hubs. | |
| Full Phase 6 skeleton | Empty stubs for all Phase 6 types (page/post/venue/coach/camp/testimonial/faq/siteSettings). | ✓ |

### Q2: Singleton pattern establishment

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, establish now | siteSettings as singleton via structure-tool customization. | ✓ |
| Defer to Phase 6 | Use Sanity defaults until Phase 6. | |

### Q3: Schema file layout

| Option | Description | Selected |
|--------|-------------|----------|
| defineType in schemaTypes/ | TS files co-located under `sanity/schemaTypes/`; matches Sanity v3+ best practice. | ✓ |
| Inline in sanity.config.ts | All schemas in config file; messy once schemas grow. | |

### Q4: Studio plugins in Phase 1

| Option | Description | Selected |
|--------|-------------|----------|
| Structure + Vision | Default + GROQ playground. | |
| Structure only | Minimal; cleanest editor UX for non-technical clients. | |
| Structure + Vision + Presentation | Adds live-preview plugin (nav item); wiring deferred. | ✓ |

### Q5 (follow-up): "Full Phase 6 skeleton" interpretation

| Option | Description | Selected |
|--------|-------------|----------|
| Empty stubs only | One file per type with just name + title + type + placeholder field; Phase 6 fills in real fields. | ✓ |
| Fields-from-PART-13.2 | All PART 13.2 editable-content fields defined now. | |
| Full with TS codegen | Option 2 + `sanity typegen` for auto-generated types. | |

**Rationale:** Prevents redesign risk — Phase 3/4/5 wireframes need to concretize before schema fields are locked in. Stubs give Studio visible structure without premature decisions.

### Q6 (follow-up): @sanity/presentation wiring depth

| Option | Description | Selected |
|--------|-------------|----------|
| Install + nav item only | Plugin appears in Studio nav; no resolver/DraftMode/iframe wiring. | ✓ |
| Minimal working preview | Install + resolver + /api/draft route + Next Draft Mode + iframe wired. | |
| Defer presentation | Drop @sanity/presentation from Phase 1; add in Phase 6. | |

**Rationale:** Surface the capability placeholder now; backend wiring (CMS-05) stays in Phase 6 where it belongs.

---

## Route-guard testing

### Q1: Test framework

| Option | Description | Selected |
|--------|-------------|----------|
| Vitest middleware unit test | Import middleware.ts, construct NextRequest, assert rewrite. Fast, no browser. | ✓ |
| Playwright E2E | Spin up dev server, use real browser, assert rendered content. | |
| Both Vitest + Playwright | Unit + E2E comprehensive coverage. | |
| Manual check + screenshot | No automated test; attach screenshots to PR. | |

**Rationale:** Cheapest path to SC #4; unblocks Phase 2 testing with scoped infra.

### Q2: Vitest scope

| Option | Description | Selected |
|--------|-------------|----------|
| Middleware-only | Vitest limited to middleware unit tests; components deferred. | ✓ |
| Middleware + shadcn smoke | Include smoke test on one example shadcn primitive. | |
| Full Phase 2 test harness | RTL + jsdom + full component test rig. | |

**Rationale:** Respects Phase 0 CONTEXT's "component tests → Phase 2" deferral while still satisfying SC #4.

### Q3: Hostile-request test assertion

| Option | Description | Selected |
|--------|-------------|----------|
| Host determines tree, period | Known Host always wins; cookie/query only for unknown hosts. | ✓ |
| Host + cookie crosscheck | Also assert cookie can't override known Host. | |
| Leak content check | Render route groups; assert no cross-market content string. | |

**Rationale:** Clean security invariant — simpler to audit, test, and reason about than looser precedence.

---

## Claude's Discretion (deferred to planner / executor)

- shadcn/ui install scope (CLI + components.json + one example primitive vs CLI-only)
- `middleware.ts` matcher config specifics
- `x-market` cookie specifics (name, path, SameSite, TTL, Secure flag)
- Reserved-subdomain parsing (www, studio future, Vercel preview pattern)
- Sanity CORS origin whitelist
- `.env.example` update details
- README preview-testing recipe section
- Studio config file location (`app/studio/sanity.config.ts` vs root `sanity.config.ts`)
- `/studio` robots handling (covered by existing X-Robots-Tag; no per-route addition needed)

## Deferred Ideas (not folded into Phase 1)

- Brand palette + fonts + primitive library → Phase 2
- Image pipeline + Mux video → Phase 2
- `/_design/` gallery → Phase 2
- Real content → Phases 3–5
- Sanity schema fields beyond stubs → Phase 6
- Sanity roles & access → Phase 6
- Webhook → ISR → revalidatePath → Phase 6
- @sanity/presentation backend wiring → Phase 6
- Separate 'development' dataset → Phase 6 revisit
- `studio.proactivsports.com` subdomain split → post-Phase 6 revisit
- Component test rig (RTL, jsdom) → Phase 2
- Playwright E2E → defer unless needed
- Sitemaps / robots.txt / llms.txt / JSON-LD → Phase 7
- GA4 / Search Console → Phase 8
- 301 map → Phase 9
- Cloudflare WAF + custom domain binding + Vercel Pro upgrade → Phase 10

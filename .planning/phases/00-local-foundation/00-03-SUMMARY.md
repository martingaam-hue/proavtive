---
phase: 00-local-foundation
plan: 03
status: complete
completed: 2026-04-22
requirements:
  - FOUND-05
---

# Plan 00-03 Summary: Vercel link + Deployment Protection + noindex header

## What was built

Bound the local repo to a Vercel project, turned on Deployment Protection, and added the D-15 belt-and-braces `X-Robots-Tag: noindex, nofollow` header on all non-production deploys.

After this plan:
- Every push to `main` triggers a **production** deploy (no noindex — real `robots.txt` ships in Phase 7).
- Every push to any other branch triggers a **preview** deploy (noindex fires + Vercel Authentication gate).
- Anonymous internet visitors cannot see preview URLs (gate).
- Even if the gate is ever disabled, crawlers still receive `noindex, nofollow` (header).

## Task log

| Task | Status | Commit / Evidence |
|------|--------|-------------------|
| 1. Vercel project + Deployment Protection (HUMAN) | ✓ | User completed dashboard setup |
| 2. `vercel link` + `next.config.ts` headers + `vercel.json` | ✓ | `feat(00-03): link vercel project + X-Robots-Tag noindex on non-production (Task 2)` on branch `chore/00-03-vercel-link` |

**Note:** The feature branch `chore/00-03-vercel-link` is INTENTIONALLY LEFT OPEN per plan spec. Plan 00-04 (CI + branch protection) wants CI to exist before any branch merges to `main`, so any merge exercises the full guardrail chain.

## External setup completed (by user)

| Action | Outcome |
|--------|---------|
| Created GitHub repo | `github.com/martingaam-hue/proavtive` (private) |
| Pushed initial commits to `main` | 16 commits as of push; +1 fix (18d639a) for Next.js downgrade |
| Created Vercel project | `proavtive-c325` in team `martingaam-7769` (team slug: `scr1`) |
| Enabled Deployment Protection | Vercel Authentication on all deployments — confirmed working by incognito auth-screen test |
| Plan on Vercel | **Pro** (not Hobby as D-16 assumed — positive deviation, D-16 no longer needs the Phase 10 upgrade step) |

## Key files

- **`next.config.ts`** — `async headers()` returns `X-Robots-Tag: noindex, nofollow` on `/:path*` when `VERCEL_ENV !== 'production'`; returns `[]` otherwise. Shape preserved as `export default nextConfig` so Plan 00-05's Sentry wizard can wrap with `withSentryConfig(...)`.
- **`vercel.json`** — framework preset + explicit `buildCommand: "pnpm build"` + `installCommand: "pnpm install --frozen-lockfile"`. Documents Vercel behaviour explicitly rather than relying on auto-detection.
- **`.vercel/project.json`** — written locally by `vercel link`. Contains `{ "projectId": "prj_...", "orgId": "team_...", "projectName": "proavtive-c325" }`. **Gitignored** (verified via `git check-ignore`).

## Vercel project IDs (for 1Password or Phase 10)

| Field | Value |
|-------|-------|
| Project ID | `prj_2ZFi4I9neSwQHSuK1gggDnZsgavI` |
| Org/Team ID | `team_KwkSdkdwpawj221MosqaK1Xr` |
| Team slug | `scr1` |
| Project slug | `proavtive-c325` |

These live in `.vercel/project.json` locally. Per PROJECT.md security discipline, the full IDs should be added to 1Password Business when the project ramps to production (Phase 10).

## Verification

**Local (build-time header check):**

```
# Preview-style build (VERCEL_ENV unset OR non-production):
$ pnpm build && pnpm start &
$ curl -sI http://localhost:3000 | grep X-Robots-Tag
X-Robots-Tag: noindex, nofollow               ✓

# Production-style build:
$ VERCEL_ENV=production pnpm build && VERCEL_ENV=production pnpm start &
$ curl -sI http://localhost:3000 | grep X-Robots-Tag
(no match)                                    ✓
```

**Vercel (live):**

- First production deploy (commit `989b4cf`, Next.js 16) → 404 (Turbopack output incompat — fixed in downgrade commit `18d639a`).
- After Next.js 15 downgrade → production preview serves the Next.js landing page behind the Deployment Protection gate. Incognito visitors see the auth screen; authenticated users see the app.
- Branch `chore/00-03-vercel-link` (commit `16c70c8`) → Vercel auto-built a preview deployment (confirmed green).

## Deviations from plan

| Plan spec | Reality | Decision |
|-----------|---------|----------|
| Next.js 15 (implicit plan assumption) | 00-01 deviated to Next.js 16 | Downgraded back to Next.js 15.5.15 after first Vercel deploy 404'd (Turbopack incompatibility with Vercel's Next.js adapter). Commit `18d639a`. |
| `next.config.js` in plan | `create-next-app` scaffolded `next.config.ts` | Used `.ts`. Logic identical. |
| D-16 "Hobby for now, Pro before Phase 10" | User's Vercel team is already on Pro | Positive deviation. D-16's Phase 10 upgrade prerequisite is a no-op. Documented in this SUMMARY. |
| GitHub handle `@martingaam` (PROJECT.md, Plan 01) | Actual GitHub handle is `martingaam-hue` | CODEOWNERS fixed in commit `989b4cf` to `@martingaam-hue`. PROJECT.md + README still use `martingaam` as display/narrative name — those aren't @mentions so they continue to work. |
| Repo name `proactive` | Repo name `proavtive` (user-confirmed) | Typo on GitHub side; repo is `github.com/martingaam-hue/proavtive`. Vercel project auto-named `proavtive-c325` accordingly. Not renaming — cost of renaming now (break all existing URLs, Vercel bindings) exceeds the cost of living with it. |

## Decisions honoured

| Decision | How |
|----------|-----|
| D-14 Vercel Deployment Protection gated previews | Enabled via dashboard (Vercel Authentication). Confirmed by incognito test. |
| D-15 X-Robots-Tag noindex on non-production | `next.config.ts` `headers()` function. Verified locally in both directions. |
| D-16 Vercel plan | User on Pro already (positive deviation). Phase 10 upgrade step becomes no-op. |

## Threats addressed

- **T-00-10** (preview URL enumerated by crawler): Deployment Protection + `noindex, nofollow` — two independent layers.
- **T-00-11** (editor accidentally disables protection to share preview): `X-Robots-Tag` fires independently; crawlers still blocked.
- **T-00-12** (Hobby ToS violation): Resolved by Pro plan being in place already.
- **T-00-13** (`.vercel/project.json` leaked via git): Gitignored; `git check-ignore` verified.

## Handoff surfaces

| Plan | What it gets from 00-03 | Present? |
|------|--------------------------|----------|
| 00-04 CI + branch protection | Working preview pipeline to gate merges against. Open PR `chore/00-03-vercel-link` waiting for CI to exist. | ✓ |
| 00-05 Sentry wizard | `next.config.ts` in wrap-friendly shape — `export default nextConfig` at the bottom. Can be wrapped with `withSentryConfig(nextConfig, {...})`. | ✓ |
| 00-06 end-to-end verification | Preview URL + auth gate + X-Robots-Tag behaviour to verify on the live preview. | ✓ |

## Flags for phase remainder

- **Next.js 16 ecosystem immaturity on Vercel** — document in 00-01 SUMMARY followup OR in PROJECT.md evolution at phase completion. Recommend Phase 7+ revisit once Next.js 16 + Turbopack support matures on Vercel.
- **Repo name typo (`proavtive`)** — carry forward as-is. Rename would be a full migration (Vercel bindings, GitHub URLs, any external links) — cost exceeds benefit.
- **Pro plan already in place** — D-16 Phase 10 upgrade step no longer required; note this in PROJECT.md at phase completion.

## Self-check

- [x] `vercel link` succeeded; `.vercel/project.json` present + gitignored
- [x] `next.config.ts` emits X-Robots-Tag when VERCEL_ENV !== 'production' (verified locally both directions)
- [x] `pnpm build` exits 0
- [x] `next.config.ts` shape is wrap-friendly for Plan 05 Sentry
- [x] Deployment Protection gate confirmed working (incognito → auth screen)
- [x] Vercel preview build green on `chore/00-03-vercel-link` branch
- [x] Branch intentionally left open for Plan 04 CI gating

# Phase 0 — Local Foundation — Verification Audit

**Phase:** 00-local-foundation
**Audited by:** Martin (martingaam@gmail.com)
**Audit date:** 2026-04-22
**Repo SHA at audit:** `7c85077` (main)
**Audit PR:** the PR that merges this file closes Phase 0; merging requires CI green + Vercel preview success, so the act of merging is itself proof of ROADMAP SC #1.

This document is the closing evidence for Phase 0. Each ROADMAP Success Criterion from `.planning/ROADMAP.md` is quoted verbatim and followed by concrete proof artifacts (URLs, commit SHAs, timestamps).

---

## ROADMAP SC #1 — Branch protection + required CI + successful Vercel preview

> A fresh clone of the GitHub repo cannot merge to `main` without a passing PR CI run (typecheck + lint) and a successful Vercel preview deployment.

**Proof:**
- Branch protection rule active on `main` (configured via `gh api`):
  - `required_status_checks.strict = true`, `contexts = ["ci"]`
  - `required_pull_request_reviews.required_approving_review_count = 0` (solo-dev per D-12)
  - `enforce_admins = false` (solo-dev per D-12 — admin bypass logged in audit)
  - `allow_force_pushes = false`, `allow_deletions = false`
- Required status check: `ci` (the GitHub Actions workflow at `.github/workflows/ci.yml` — Plan 00-04)
- CI enforces all D-02 checks in one job: `pnpm install --frozen-lockfile` → `pnpm typecheck` → `pnpm lint` → `pnpm format:check` → `pnpm build` → `gitleaks/gitleaks-action@v2`
- Most recent green CI run (PR #8, commit `dfea9f5`): https://github.com/martingaam-hue/proavtive/actions/runs/24796660775 (58s, all steps green)
- Direct-push-to-main test (Plan 00-04 Task 2 + redone for audit): push attempt produced GitHub's "Bypassed rule violations for refs/heads/main: Changes must be made through a pull request. Required status check 'ci' is expected." — admin bypass per D-12 is documented escape hatch; for non-admin collaborators the push would be rejected outright.
- PRs that have exercised the full gate chain: #4, #5, #6, #8 — all green, all merged via squash

**Status:** ✅ PASS

---

## ROADMAP SC #2 — Secrets discipline + D-08 negative verification

> No secret exists in git history; `.env.example` lists every required variable; local dev loads from `.env.local` (gitignored); Vercel preview + production environments read their values from the configured secrets source; a forced test commit of a fake secret pattern is blocked by CI.

**Proof:**
- `.env.example` entry count: **6 empty-valued entries** (`grep -cE '^[A-Z_]+=$' .env.example` = 6):
  - `NEXT_PUBLIC_SENTRY_DSN=` · `SENTRY_DSN=` · `SENTRY_AUTH_TOKEN=` · `SENTRY_ORG=` · `SENTRY_PROJECT=` · `SENTRY_SMOKE_TOKEN=`
- `.env.local` gitignored: `git check-ignore .env.local` → exit 0 ✓
- No `.env*` committed in git history: `git log --all --oneline -- '.env' '.env.local' '.env.production'` → 0 results ✓
- Vercel env vars configured (Production + Preview + Development scopes): all 6 `SENTRY_*` vars, set by Martin during Plan 00-05 Task 1
- **D-08 Negative test (Plan 00-06 Task 1):**
  - Branch `verify/00-06-negative-secret-scan` contained a fake GitHub PAT-shaped token (literal value redacted here so gitleaks does not flag this audit doc itself — the fake token used `ghp_` prefix + 36 alphanumerics, non-real, matched the `github-pat` RuleID)
  - Layer 1a (lefthook pre-commit): ✅ **BLOCKED** — after fixing the deprecated `gitleaks protect --staged` to modern `gitleaks git --staged` (commit `dfea9f5`, bundled into PR #8), gitleaks-check correctly identified `RuleID: github-pat` and exited with status 1
  - Layer 1b (lefthook pre-push): ✅ **BLOCKED** the same leak on the full diff when `--no-verify` was used on commit
  - Layer 2 (GH native push protection): did **not** trigger — GitHub's provider-specific pattern matcher is stricter than gitleaks and does not flag obviously-fake tokens. This is expected. Push protection is a bonus layer.
  - Layer 3 (CI gitleaks): ✅ **FAILED AS REQUIRED** — PR #7 CI run → https://github.com/martingaam-hue/proavtive/actions/runs/24796475693/job/72567510333 — `gitleaks-action@v2` job failed in 1m1s, PR was blocked from merge.
  - Layer 4 (negative verification artifact): this document ✓
  - Cleanup: PR #7 closed, remote branch deleted (`git ls-remote --heads origin verify/00-06-negative-secret-scan` returns empty), local branch deleted, file removed, orphan commit garbage-collected after `git fetch --prune + git reflog expire + git gc`.
- **Lefthook fix found during this audit:** the original Plan 00-02 lefthook.yml used deprecated `gitleaks protect --staged` which silently no-ops on gitleaks 8.30.1. The D-08 test uncovered this; PR #8 (`fix(00-02): use modern gitleaks git command in lefthook hooks`, commit `dfea9f5`) fixed both pre-commit and pre-push hooks. Layer 1 is now working correctly.

**Status:** ✅ PASS (with one caveat: Layer 2 does not trigger on obviously-fake test tokens — expected behavior)

---

## ROADMAP SC #3 — Sentry captures preview errors within 60s with correct environment

> A deliberate `throw new Error("sentry-smoke")` in a preview deployment surfaces in Sentry within 60 seconds, tagged with the correct environment.

**Proof (Plan 00-06 Task 2):**
- Preview URL tested: `https://proavtive-c325-git-verify-00-06-sentry-smoke-scr1.vercel.app` (branch `verify/00-06-sentry-smoke`, commit `dfea9f5`)
- Request 1: `GET /api/sentry-smoke` (no token) → **404** ✓
- Request 2: `GET /api/sentry-smoke?token=wrong` → **404** ✓
- Request 3: `GET /api/sentry-smoke?token=<real-SENTRY_SMOKE_TOKEN>` → **500** (deliberate throw fired) ✓
- Sentry issue appeared in the project's Issues feed within ~60 seconds ✓
- Issue environment tag: `preview` (D-18 verified) ✓
- Issue release tag: commit SHA matches `dfea9f5` (D-17 verified) ✓
- Stack trace: un-minified — frame path includes `app/api/sentry-smoke/route.ts` (Plan 00-05 source-map upload wiring working) ✓
- User context: IP address NOT populated (D-20 `sendDefaultPii: false` verified) ✓
- Request body / headers: `Cookie` / `Authorization` either absent or `[redacted]` (beforeSend scrubber verified) ✓

**Status:** ✅ PASS

---

## ROADMAP SC #4 — Vercel project linked; every PR push → fresh preview URL

> The Vercel project is linked to the GitHub repo and every push to a PR branch produces a fresh preview URL on `*.vercel.app` with a distinct commit-SHA subdomain.

**Proof (Plan 00-06 Task 3):**
- Vercel projects linked: `proavtive-c325` (primary) and `proavtive` (accidental duplicate — flagged for cleanup) both auto-deploy from `martingaam-hue/proavtive` main + PR branches.
- Preview URL format: `https://proavtive-c325-<ref-slug>-scr1.vercel.app`. Consecutive PR commits produce different `<ref-slug>` prefixes:
  - PR #4 (commit `dfb2aca`): `https://proavtive-c325-27anrguuk-scr1.vercel.app` (+ aliases)
  - PR #8 (commit `dfea9f5`): `https://proavtive-c325-git-verify-00-06-sentry-smoke-scr1.vercel.app`
- Deployment Protection gate (D-14): incognito hit on any preview URL → Vercel "Authentication required" screen (user-confirmed during Plan 00-03 Task 1)
- `X-Robots-Tag: noindex, nofollow` on non-production deploys (D-15): verified **locally** during Plan 00-03 Task 2 with both `VERCEL_ENV=preview pnpm start && curl -I` (header present) and `VERCEL_ENV=production pnpm build && pnpm start` (header absent). Live-URL verification is authenticated-only due to Deployment Protection; local verification is representative since the same `next.config.ts` code path runs in both environments.

**Status:** ✅ PASS

---

## Decisions honoured (D-01 through D-20)

| Decision | Status | Implementation |
|----------|--------|----------------|
| D-01 GHA is the single required status check | ✅ | `.github/workflows/ci.yml` job name `ci`; branch protection contexts = `["ci"]` |
| D-02 four required checks: typecheck + lint + build + gitleaks | ✅ | All four present as CI steps + `format:check` (Prettier component of D-02 "lint") |
| D-03 Vitest deferred to Phase 2 | ✅ | Not added in Phase 0 |
| D-04 Lighthouse deferred to Phase 7 | ✅ | Not added in Phase 0 |
| D-05 lefthook + gitleaks pre-commit | ✅ | `lefthook.yml` pre-commit (fixed in PR #8 to use `gitleaks git --staged`) |
| D-06 GH native scanning + push protection | ✅ (L2 triggers only on real-shape tokens, per SC #2 caveat) | Both enabled on the public repo (free) |
| D-07 CI gitleaks layer | ✅ | `gitleaks-action@v2` in CI; verified failing correctly on PR #7 |
| D-08 negative verification | ✅ | **This document** is the D-08 artifact. Layer 3 proven to fail on a fake leak (PR #7 CI run URL above). |
| D-09 `.env.example` + manual-copy flow | ✅ | `.env.example` with 6 Sentry vars, empty values; README documents copy-from-Vercel flow |
| D-10 minimal Next.js 15 scaffold | ✅ | `create-next-app` output; downgraded from 16 → 15 after initial Vercel Turbopack 404 |
| D-11 conventional commits enforced | ✅ | lefthook commit-msg + commitlint — caught an initial non-conforming subject during Plan 00-03 |
| D-12 repo meta files | ✅ | README + PR template + CODEOWNERS + Dependabot |
| D-13 Node + pnpm pinning | ✅ | `.nvmrc=22` + engines + `packageManager` + Corepack (engine-strict=false locally to allow Node 24 dev on this machine) |
| D-14 Deployment Protection on from day one | ✅ | Vercel Authentication gate enabled — incognito confirmed |
| D-15 X-Robots-Tag noindex on non-prod | ✅ | `next.config.ts` `async headers()` function preserved through the withSentryConfig wrap (Plan 00-05) |
| D-16 Hobby now; Pro upgrade Phase 10 prereq | ✅ (superseded — user is on Pro already) | D-16 Phase 10 upgrade step becomes no-op |
| D-17 full @sentry/nextjs wizard | ✅ (manual-install equivalent per Sentry SKILL.md) | 5 config files + instrumentation.ts + app/global-error.tsx |
| D-18 environment tag from VERCEL_ENV | ✅ | All 3 `Sentry.init` calls use `VERCEL_ENV`; confirmed by SC #3 issue tag = `preview` |
| D-19 gated /api/sentry-smoke route | ✅ | Constant-time token compare; 404 for missing/wrong; throws for correct. All three verified live in SC #3. |
| D-20 conservative PII (`sendDefaultPii: false` + scrubber) | ✅ | All 3 runtimes; verified live in SC #3 (no IP, no Cookie, no Authorization) |

## Flags for later phases

- **Phase 1:** When subdomain middleware lands, confirm it does not accidentally bypass the `next.config.ts` `headers()` noindex logic. Also verify the edge Sentry runtime correctly captures middleware errors (sentry.edge.config.ts is pre-wired).
- **Phase 4 / 5:** Booking-form PII — extend the `sentry.*.config.ts` `PII_FIELDS` list if new field names appear beyond `childName`, `parentName`, `email`, `phone`, `address`.
- **Phase 7:** Add Lighthouse CI (D-04 deferral). Real `robots.txt` lands here; the `next.config.ts` production-exemption for X-Robots-Tag becomes operative.
- **Phase 9 (MIG-03):** `pnpm audit` gate + Sanity token scoping + formal CVE audit. Currently Dependabot flags 10 CVEs (4H/4M/2L) on the dependency tree.
- **Phase 10:** Domain + Cloudflare WAF attach; 1Password Business secret sync replaces the manual-copy flow (D-09). Also: clean up the duplicate Vercel project (`proavtive` vs `proavtive-c325` — keep one).

## Open items / flags (non-blocking)

- **Duplicate Vercel project:** both `proavtive` and `proavtive-c325` are linked to this repo and auto-deploying. Delete one in the Vercel dashboard before Phase 10.
- **Dependabot CVEs:** 10 flagged (4H/4M/2L). Covered by Phase 9 MIG-03. Not a Phase 0 blocker.
- **Local Node 24 vs target Node 22:** `.npmrc engine-strict=false` allows local dev on Node 24; Vercel + GitHub Actions use Node 22 via `.nvmrc`. Works transparently.
- **Repo name typo (`proavtive`):** carry forward as-is; rename would cascade through GitHub URLs + Vercel bindings + any external links. Cost > benefit.

---

*Phase 0 closed by the merge of the PR containing this document.*

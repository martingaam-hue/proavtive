# Phase 0: Local foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-22
**Phase:** 0-local-foundation
**Areas discussed:** CI gate scope, Secret protection layers, Phase 0 / Phase 1 boundary, Preview deployment privacy, Sentry setup depth

---

## CI gate scope

### Q1: Where does CI run for PR checks?

| Option | Description | Selected |
|--------|-------------|----------|
| GitHub Actions only (Recommended) | Typecheck + lint + build in GHA. Vercel still does its own preview-build independently. Required status check = GHA run. Most standard. | ✓ |
| Vercel Checks only | Rely on Vercel's built-in commit checks. No GitHub Actions. Fewer moving parts, less flexibility. | |
| Both (GHA + Vercel) | GHA for typecheck/lint/secret scan; Vercel for build + preview. Belt-and-braces. | |

**User's choice:** GitHub Actions only

### Q2: Which checks must be green before merge to main?

| Option | Description | Selected |
|--------|-------------|----------|
| Typecheck (`tsc --noEmit`) (Recommended) | Fast, catches TS breakage. | ✓ |
| Lint (ESLint + Prettier check) (Recommended) | Standard Next.js lint + Prettier formatting. | ✓ |
| Build passes (Recommended) | Production build to catch compile-only errors. | ✓ |
| Secret scan (gitleaks) (Recommended) | Satisfies FOUND-06 — fake secret must be blocked by CI. | ✓ |

**User's choice:** All four (multiSelect).

### Q3: Wire unit tests or a11y in Phase 0, or defer?

| Option | Description | Selected |
|--------|-------------|----------|
| Defer — no tests or a11y yet (Recommended) | Vitest wires with Phase 2; axe with Phase 7. Avoids vacuous green-lights. | ✓ |
| Wire test runner now with 1 smoke test | Install Vitest, add a trivial passing test. | |
| Wire axe-core a11y scan now | Runs against preview URL. Nothing real to scan yet. | |

**User's choice:** Defer — no tests or a11y yet

### Q4: Lighthouse CI now or defer?

| Option | Description | Selected |
|--------|-------------|----------|
| Defer to Phase 7 (Recommended) | Phase 7 owns the 95+ budget. | ✓ |
| Wire Lighthouse now against placeholder page | Locks pipeline shape early; budget meaningless until real pages exist. | |

**User's choice:** Defer to Phase 7

---

## Secret protection layers

### Q1: Pre-commit runner for gitleaks?

| Option | Description | Selected |
|--------|-------------|----------|
| lefthook + gitleaks (Recommended) | Fast, parallel, no Node dependency. Runs gitleaks against staged files. | ✓ |
| husky + lint-staged + gitleaks | Most common Node pre-commit runner. Slightly heavier than lefthook. | |
| No pre-commit — CI scan only | Relies solely on CI gitleaks. Leaked secret reaches GitHub. | |

**User's choice:** lefthook + gitleaks

### Q2: GitHub native secret scanning / push protection?

| Option | Description | Selected |
|--------|-------------|----------|
| Both — secret scanning + push protection (Recommended) | Free on public; private needs GHAS (paid). Blocks known-pattern secrets before they land. | ✓ |
| Secret scanning only (no push protection) | Alerts post-push; doesn't block. | |
| No — rely on pre-commit + CI only | Skip GitHub-side tooling. | |

**User's choice:** Both — secret scanning + push protection
**Notes:** Planner must confirm repo visibility. If private, push protection requires GHAS (paid).

### Q3: FOUND-06 #2 verification method?

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated negative test in CI (Recommended) | Throwaway branch with fake AWS-shaped key; CI must FAIL. | ✓ |
| One-time manual verification, documented in README | Do it once, screenshot, note in VERIFICATION. | |
| Skip formal verification — trust gitleaks defaults | Tool is well-tested. | |

**User's choice:** Dedicated negative test in CI

### Q4: Local secret flow?

| Option | Description | Selected |
|--------|-------------|----------|
| `.env.local`, manual copy from Vercel dashboard (Recommended) | Matches STATE.md: manual for solo dev; 1Password sync = Phase 10. | ✓ |
| `vercel env pull` (Vercel CLI) | Sync via Vercel CLI. Slightly automated. | |
| 1Password CLI stub (preview of Phase 10) | `op run --env-file=...` pattern now. Higher setup. | |

**User's choice:** `.env.local`, manual copy from Vercel dashboard

---

## Phase 0 / Phase 1 boundary

### Q1: Scaffold Next.js in Phase 0 or stay pure-infra?

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal Next.js scaffold in Phase 0 (Recommended) | `create-next-app` with App Router + TS + Tailwind + ESLint. Vercel preview has something to build. Phase 1 adds middleware + Studio + shadcn. | ✓ |
| Pure infra — empty repo | Just config. Vercel has nothing to build. | |
| Absolute minimum (single static page) | `app/page.tsx` with placeholder text only. | |

**User's choice:** Minimal Next.js scaffold in Phase 0

### Q2: Commit discipline — enforce conventional commits?

| Option | Description | Selected |
|--------|-------------|----------|
| Conventional commits enforced via lefthook (Recommended) | commitlint on commit-msg hook. Readable git log, easy changelog. | ✓ |
| Recommended but not enforced | Habit only; no hook. | |
| No convention | Free-form. | |

**User's choice:** Conventional commits enforced via lefthook

### Q3: Repo meta-files in Phase 0?

| Option | Description | Selected |
|--------|-------------|----------|
| README with local setup steps (Recommended) | Reproducible-dev proof. | ✓ |
| `.github/PULL_REQUEST_TEMPLATE.md` (Recommended) | Checklist aligned with GSD atomic-commit discipline. | ✓ |
| CODEOWNERS | Solo now — can add later. | ✓ |
| Dependabot config (Recommended) | Weekly dependency PRs; groundwork for MIG-03 CVE audit. | ✓ |

**User's choice:** All four (multiSelect).

### Q4: Node/pnpm pinning?

| Option | Description | Selected |
|--------|-------------|----------|
| `.nvmrc` + package.json `engines` + Corepack (Recommended) | Works on Vercel + GHA + local, no extra tooling. | ✓ |
| mise (or asdf) toolchain file | Most robust; requires mise install. | |
| Just `.nvmrc` | Lightest; doesn't lock pnpm. | |

**User's choice:** `.nvmrc` + engines + Corepack

---

## Preview deployment privacy

### Q1: Previews public or gated?

| Option | Description | Selected |
|--------|-------------|----------|
| Gated — Vercel Deployment Protection (Recommended) | SSO or password. Hobby plan: only Vercel Authentication (team-member login) available. | ✓ |
| Public — with robots.txt blocking | Guessable URLs + `Disallow: /` on non-prod. No gate. | |
| Public — no gating | Anyone with URL sees site. | |

**User's choice:** Gated — Vercel Deployment Protection
**Notes:** Hobby plan gate is team-authentication only. Client access = Vercel team invite, or upgrade to Pro for password-protected shares.

### Q2: X-Robots-Tag noindex on non-prod?

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — `X-Robots-Tag: noindex, nofollow` on preview (Recommended) | Belt-and-braces via next.config.js / middleware when `VERCEL_ENV !== 'production'`. | ✓ |
| No — rely on preview gate | Crawlers can't reach gated previews. | |

**User's choice:** Yes — X-Robots-Tag noindex header on previews

### Q3: Vercel plan?

| Option | Description | Selected |
|--------|-------------|----------|
| Pro plan (Recommended if budget allows) | Deployment Protection options, team collab, ToS compliance for commercial use. $20/user/mo. | |
| Hobby plan for now, upgrade later | Free. ToS technically disallows commercial use — must upgrade before Phase 10. | ✓ |
| Not sure — flag for planner | Let planner quote it. | |

**User's choice:** Hobby plan for now, upgrade to Pro before Phase 10 launch
**Notes:** Phase 10 prerequisite — added to deferred ideas so it's not missed at cutover.

---

## Sentry setup depth

### Q1: Sentry SDK configuration?

| Option | Description | Selected |
|--------|-------------|----------|
| Full `@sentry/nextjs` wizard (Recommended) | Client + server + edge capture, auto-instrumentation, source maps, release tagging via VERCEL_GIT_COMMIT_SHA. | ✓ |
| Manual minimal install | Client-side only. Misses server errors. | |
| DSN + error boundary stub only | Smallest; loses stack traces / context. | |

**User's choice:** Full `@sentry/nextjs` wizard

### Q2: Environment tagging?

| Option | Description | Selected |
|--------|-------------|----------|
| `VERCEL_ENV` → sentry environment (Recommended) | Uses Vercel's native `production` / `preview` / `development`. Satisfies FOUND-08 #3 cleanly. | ✓ |
| `NEXT_PUBLIC_APP_ENV` custom var | Explicit, duplicates Vercel. | |
| Hardcoded per Vercel environment target | Three dashboard values. Manual. | |

**User's choice:** `VERCEL_ENV` → sentry environment

### Q3: Sentry smoke test mechanism?

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated `/api/sentry-smoke` route (Recommended) | Throws when hit with secret query param. Safe — won't fire on traffic. Re-verifiable. | ✓ |
| Sentry wizard's built-in test page | Wizard-generated; delete before Phase 1. | |
| Manual one-time trigger, then remove | No artifact; hardest to re-verify. | |

**User's choice:** Dedicated `/api/sentry-smoke` route

### Q4: PII posture?

| Option | Description | Selected |
|--------|-------------|----------|
| Conservative: `sendDefaultPii: false` + scrub IPs (Recommended) | HK PDPO + SG PDPA; brand serves children. | ✓ |
| Permissive: `sendDefaultPii: true` | Easier debugging; higher privacy risk. | |
| Decide in Phase 6 (CMS / forms) | No forms in Phase 0. Defer. | |

**User's choice:** Conservative: `sendDefaultPii: false` + scrub IPs

---

## Claude's Discretion

Areas where user deferred to Claude / planner:
- Exact gitleaks config (`.gitleaks.toml`) — default ruleset, extend only if false-positives
- Exact GHA workflow shape (single vs parallel jobs) — optimize for speed + readable logs
- `lefthook.yml` layout
- README structure
- PR template checklist granularity
- Dependabot schedule cadence (weekly recommended)
- Branch protection specifics (self-approval for solo dev — planner choice)

## Deferred Ideas

- Vitest + test runner → Phase 2
- axe-core a11y → Phase 7
- Lighthouse CI → Phase 7
- 1Password Business secret sync → Phase 10
- Password-protected previews → revisit at Pro upgrade
- Vercel Pro upgrade itself → Phase 10 prerequisite
- Sanity token scoping audit → Phase 9 (MIG-03)

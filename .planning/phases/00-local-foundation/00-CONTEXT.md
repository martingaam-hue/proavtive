# Phase 0: Local foundation - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 0 delivers developer-experience rails before any product code ships: a GitHub repo with branch protection + PR CI, secrets discipline (no secrets in git, Vercel dashboard for preview/prod values), Sentry error monitoring wired end-to-end, and a Vercel project linked to the repo producing preview deployments per PR commit. Phase 0 ALSO scaffolds a minimal Next.js 15 app so the Vercel preview pipeline has something real to build — but middleware, subdomain route groups, Sanity Studio, and shadcn setup are explicitly Phase 1 work.

**Satisfies:** FOUND-05 (branch protection + PR CI), FOUND-06 (secrets hygiene), FOUND-08 (Sentry wired with release tagging)

**Out of scope for this phase:** Subdomain middleware, Sanity Studio, shadcn component library setup, Tailwind tokens (Phase 2), custom domain / Cloudflare (Phase 10), 1Password Business secret sync (Phase 10).

</domain>

<decisions>
## Implementation Decisions

### CI pipeline
- **D-01:** CI runs in **GitHub Actions only** (single required status check). Vercel still produces its own preview-build independently — but the GHA run is the branch-protection gate.
- **D-02:** Required PR checks before merge to `main`: **typecheck (`tsc --noEmit`) + lint (ESLint + Prettier --check) + build (`pnpm build`) + secret scan (gitleaks)**. All four must be green.
- **D-03:** Unit tests and a11y checks are **deferred** — Vitest wiring lands with Phase 2 (when components exist to test); axe-core lands with Phase 7 (accessibility pass).
- **D-04:** Lighthouse CI is **deferred to Phase 7**, which owns the 95+ budget. Phase 0 does not wire `@lhci/cli`.

### Secret protection (defense-in-depth, four layers)
- **D-05:** **Layer 1 — pre-commit:** `lefthook` runs `gitleaks` against staged files before every commit. Blocks local commits containing secrets.
- **D-06:** **Layer 2 — GitHub:** Enable both GitHub native **secret scanning** and **push protection** on the repo. Note: if repo is private, push protection requires GitHub Advanced Security (paid); planner must confirm repo visibility + plan before enabling.
- **D-07:** **Layer 3 — CI:** `gitleaks` runs as a required GitHub Actions step on every PR (same tool as pre-commit, different stage — catches anything that got past `--no-verify`).
- **D-08:** **Layer 4 — verification:** A **dedicated negative test** in CI — a throwaway branch intentionally contains a known fake AWS-shaped key; CI must FAIL on it. Documents that the scanner actually works. Branch deleted after verification. Satisfies FOUND-06 success criterion #2 concretely.
- **D-09:** **Local env flow:** `.env.example` committed (variable names only, empty values). Developer copies values manually from Vercel dashboard into `.env.local` (gitignored). Matches STATE.md decision "manual load for solo dev — 1Password Business sync comes in Phase 10."

### Repo scaffold + hygiene
- **D-10:** Phase 0 includes a **minimal Next.js 15 scaffold** via `create-next-app` (App Router + TypeScript + Tailwind + ESLint defaults). No middleware, no route groups, no Sanity — those are Phase 1. Gives Vercel preview pipeline something real to deploy.
- **D-11:** **Conventional commits enforced** via `lefthook` commit-msg hook running `commitlint` with the `@commitlint/config-conventional` preset. Existing commits already follow `docs:` pattern — this locks it in.
- **D-12:** Repo meta files created in Phase 0: **README** (local setup steps — proves reproducible dev), **`.github/PULL_REQUEST_TEMPLATE.md`** (checklist aligned with GSD phase/plan discipline), **`.github/CODEOWNERS`** (even if solo now — easy to add collaborators later), **`.github/dependabot.yml`** (weekly dependency update PRs; groundwork for MIG-03 Phase 9 CVE audit).
- **D-13:** **Node/pnpm pinning:** `.nvmrc` (Node version for nvm users) + `engines` block in `package.json` (warnings) + Corepack activated via the `packageManager` field (`"packageManager": "pnpm@x.y.z"` — exact version, reproducible on Vercel + GHA + local).

### Preview deployment privacy
- **D-14:** Vercel previews are **gated via Vercel Deployment Protection** from day one. On Hobby plan the only available gate is **Vercel Authentication** (team-member login) — works for solo dev; client access requires inviting them to the Vercel team.
- **D-15:** **X-Robots-Tag: `noindex, nofollow`** header on all non-production deploys — set via `next.config.js` or middleware conditional on `VERCEL_ENV !== 'production'`. Belt-and-braces even behind the gate. Real `robots.txt` (SEO-03) lands in Phase 7.
- **D-16:** **Vercel plan:** **Hobby for Phase 0–9**, upgrade to **Pro before Phase 10 launch** for ToS compliance (Hobby is non-commercial) + password-protected previews + proper team / bypass controls. Noted in roadmap decisions as a Phase 10 prerequisite.

### Sentry
- **D-17:** Use the **full `@sentry/nextjs` wizard** (`npx @sentry/wizard@latest -i nextjs`). Enables client + server + edge runtime capture, route-handler + server-action instrumentation, source map upload on Vercel builds, and release tagging tied to `VERCEL_GIT_COMMIT_SHA`.
- **D-18:** **Environment tagging:** `Sentry.init({ environment: process.env.VERCEL_ENV })` — uses Vercel's native `VERCEL_ENV` value (`production` / `preview` / `development`). Satisfies FOUND-08 success criterion #3 ("tagged with the correct environment") directly.
- **D-19:** **Smoke test mechanism:** a **`/api/sentry-smoke` route** that throws when hit with a secret query param (e.g. `?token=$SENTRY_SMOKE_TOKEN` — value from Vercel env). Triggered manually after each deploy to confirm Sentry is live. Committed to repo (safe — won't fire on regular traffic). Documented in README.
- **D-20:** **PII / privacy posture:** **conservative** — `sendDefaultPii: false`, IP scrubbing on, standard `beforeSend` scrubber for PII-shaped fields. Rationale: parents submit booking forms with children's ages, names, contact info; HK PDPO + SG PDPA apply. Re-evaluate when debugging specific issues; relax only with justification.

### Claude's Discretion

These are implementation details the planner / executor can decide:
- Exact gitleaks config (`.gitleaks.toml`) — use sensible default ruleset, extend only if Phase 0 turns up real false-positives.
- Exact `.github/workflows/ci.yml` job structure (one job vs parallel jobs for typecheck/lint/build/scan) — optimize for speed but keep logs readable.
- Exact `lefthook.yml` layout and parallel vs sequential hooks.
- README section ordering and depth of prose.
- PR template checklist granularity.
- Dependabot schedule (weekly vs daily) — weekly is fine for a solo dev project.
- Branch protection rule specifics (whether self-approval of PRs is permitted for the solo dev — planner can choose; Martin is solo, so required-reviewer = 0 is acceptable).

### Folded Todos

None — no pending todos matched Phase 0.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Strategy doc (canonical brief)
- `.planning/inputs/strategy.md` § PART 13.1 — Stack (Next.js 15 + Tailwind + shadcn + Sanity + Vercel + Cloudflare + Mux + Sentry)
- `.planning/inputs/strategy.md` § PART 13.6 — Security discipline (no secrets in git, scoped Sanity tokens, rotation policy)
- `.planning/inputs/strategy.md` § PART 15.4 Weeks 0–2 — Technical setup sequence

### Project constraints
- `.planning/PROJECT.md` § Constraints — hard constraints (tech stack locked, secrets discipline, no black-hat SEO, brand fidelity)
- `.planning/PROJECT.md` § Key Decisions — reasoning behind stack + architecture choices (referenced by planner)
- `.planning/REQUIREMENTS.md` § FOUND-05, FOUND-06, FOUND-08 — the three requirements Phase 0 must satisfy
- `.planning/ROADMAP.md` § Phase 0 — goal, success criteria, rough shape (the anchor this phase is measured against)
- `.planning/STATE.md` § Accumulated Context — carry-forward decisions (1Password → Phase 10, domain → Phase 10, Vercel previews are the staging)

### External docs to consult during planning (not yet in repo)
- Vercel Deployment Protection docs — confirm exact Hobby-plan gating capabilities at time of planning
- `@sentry/nextjs` wizard output — accept whatever the current wizard produces as the baseline; deviate only with reason
- `gitleaks` default ruleset — use as-is unless a Phase 0 scan shows false positives
- `lefthook` + `commitlint` setup docs
- GitHub Advanced Security pricing + push protection availability (determines D-06 cost)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **None** — fresh repo, no product code yet. Assets begin in Phase 1.

### Established Patterns
- **Git commit style:** existing commits follow conventional-commits-ish (`docs:`, `chore:`) — D-11 formalises this via commitlint.
- **Planning discipline:** `.planning/` directory with GSD workflow (PROJECT.md, REQUIREMENTS.md, ROADMAP.md, STATE.md, phases/) is in place — Phase 0 is the first code-producing phase but planning conventions are already established.

### Integration Points
- **GitHub ↔ Vercel:** Vercel project links to the GitHub repo; every push to a PR branch produces a preview URL on `*.vercel.app` (FOUND-05 success criterion #4).
- **Vercel ↔ Sentry:** Sentry reads `VERCEL_ENV` and `VERCEL_GIT_COMMIT_SHA` at runtime for environment + release tagging (D-17, D-18).
- **GitHub ↔ GitHub Actions:** workflows live in `.github/workflows/`; branch protection on `main` references the CI job names.
- **GitHub ↔ gitleaks:** pre-commit (lefthook) and PR-time (GHA) — same tool, two stages.

### Assets on disk (not used in Phase 0 but context for later phases)
- `assets/brand/` — ProActiv/ProGym/Prodigy logos + brand PDF (used from Phase 2)
- `.planning/inputs/strategy.md` — 12,540-word canonical brief (used throughout)
- `.planning/inputs/MEDIA-INVENTORY.md` — ~22 GB media catalog (used from Phase 2)

</code_context>

<specifics>
## Specific Ideas

- **Negative secret-scan test (D-08)** is a concrete verification artifact — not just "trust the tool" but a dated screenshot / log of a CI run that rejected a fake-secret commit. This is the kind of thing that satisfies an auditor or future-Martin.
- **Gated previews from day one (D-14)** rather than "we'll lock it down before launch" — keeps discipline tight from the start and prevents accidental leak of early work-in-progress.
- **Sentry smoke route (D-19)** as a committed, gated endpoint is preferred over a throwaway trigger — re-verifiable after any future Sentry config change.
- **Conservative PII default (D-20)** because the brand serves children and parents in PDPO / PDPA jurisdictions — privacy-by-default aligns with brand trust, which is the conversion lever.
- **Hobby → Pro upgrade is a Phase 10 prerequisite** (D-16). Adding a note to the Phase 10 roadmap anchor may be worth doing during planning; flagged here so it's not forgotten.

</specifics>

<deferred>
## Deferred Ideas

These came up during discussion and are noted but not in Phase 0 scope:

- **Vitest + test runner wiring** — defer to **Phase 2** (first phase with components to test).
- **axe-core a11y scanning in CI** — defer to **Phase 7** (SEO / a11y / WCAG pass).
- **Lighthouse CI with budgets** — defer to **Phase 7** (owns the Lighthouse 95+ success criterion).
- **1Password Business secret sync (`op run` pattern)** — defer to **Phase 10** (already in roadmap; replaces the manual-copy flow in D-09).
- **Password-protected previews** — revisit when upgrading to Vercel Pro before Phase 10.
- **Vercel Pro upgrade itself** — Phase 10 prerequisite, flagged in D-16 so it's not missed at cutover.
- **Branch protection "require approving review" discipline** — Claude's discretion for solo-dev; revisit when collaborators join.
- **Sanity token scoping audit** — belongs to **Phase 9** (MIG-03 security pass) — not a Phase 0 concern since no Sanity project exists yet.

### Reviewed Todos (not folded)

None — no pending todos matched Phase 0.

</deferred>

---

*Phase: 00-local-foundation*
*Context gathered: 2026-04-22*

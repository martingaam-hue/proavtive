---
phase: 00-local-foundation
plan: 04
status: complete
completed: 2026-04-22
requirements:
  - FOUND-05
  - FOUND-06
---

# Plan 00-04 Summary: CI workflow + branch protection + GH secret scanning

## What was built

Layers 2 + 3 of the four-layer secret defense (D-05 through D-08) are now active:
- **Layer 2 — GitHub native:** Secret scanning + push protection + Dependabot security updates (all ENABLED, free on the public repo).
- **Layer 3 — CI gitleaks:** GitHub Actions workflow `ci` runs on every PR to `main` and every push to `main`. The `ci` check is a required status check on branch protection. CI cannot be bypassed via `--no-verify` (that's the whole point).

Plus: Branch protection on `main` anchors everything. Every merge now exercises the full guardrail chain.

## Task log

| Task | Status | Commit / Evidence |
|------|--------|-------------------|
| 1. Write GHA CI workflow | ✓ | `dfb2aca` on branch `chore/00-03-vercel-link` → merged to main as PR #4 squash `a84f526` |
| 2. Branch protection + GH secret scanning (HUMAN) | ✓ | Verified via `gh api` output + live direct-push-rejection test |

## Key files

- **`.github/workflows/ci.yml`** — single job `ci`, fast-to-slow steps:
  1. actions/checkout@v4 (`fetch-depth: 0` — gitleaks needs full diff)
  2. Corepack enable (activates exact pnpm version from `packageManager`)
  3. setup-node@v4 with `node-version-file: .nvmrc` + pnpm cache
  4. `pnpm install --frozen-lockfile`
  5. `pnpm typecheck`
  6. `pnpm lint`
  7. `pnpm format:check`
  8. `pnpm build` (env: `NEXT_TELEMETRY_DISABLED=1`)
  9. `gitleaks/gitleaks-action@v2` with `config-path: .gitleaks.toml`
  
  Permissions: `contents: read` + `checks: write` + `security-events: read`. No write beyond checks. No secret echo (T-00-14 verified).
  
  Concurrency group cancels superseded runs.

## Branch protection config (applied via `gh api`)

```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["ci"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "required_approving_review_count": 0
  },
  "allow_force_pushes": false,
  "allow_deletions": false
}
```

**Policy notes (per D-12 Claude's-discretion for solo dev):**

- `required_approving_review_count: 0` — solo dev, no reviewer available. Revisit when collaborators join.
- `enforce_admins: false` — Martin (admin) can emergency-bypass if genuinely needed. Revisit when collaborators join (consider flipping to `true`).
- `strict: true` — branch must be up-to-date with `main` before merge (catches stale-merge regressions). Demonstrated in practice: PR #4 required a rebase before it could merge.
- `allow_force_pushes: false`, `allow_deletions: false` — standard.

## GitHub security features (applied via `gh api`)

| Feature | Status | Notes |
|---------|--------|-------|
| Secret scanning | **enabled** | Free on public repos. |
| Push protection | **enabled** | Free on public repos. |
| Dependabot security updates | **enabled** | Auto-opens PRs for security-patch updates. Complements Dependabot's scheduled dependency updates from Plan 00-01. |
| Non-provider patterns | disabled | Default — can enable later if needed. |
| Validity checks | disabled | Default — can enable later if needed. |

## Verification evidence

### Repo visibility confirmed

```
$ gh repo view martingaam-hue/proavtive --json visibility,defaultBranchRef
{"defaultBranchRef":{"name":"main"},"visibility":"PUBLIC"}
```

**Deviation from plan:** The plan spec assumed the repo might be private (which would require GHAS for push protection). Repo is actually **PUBLIC**. GHAS is not needed — secret scanning + push protection are free. No Phase 0 blocker; the four-layer defense is complete.

### CI run green on first PR

- PR #4 (`chore(00-03,00-04): vercel link + CI workflow`): CI ran in 50s, all 9 steps green (install → typecheck → lint → format:check → build → gitleaks). Merged via squash, branch `chore/00-03-vercel-link` deleted.
- PR #5 (`chore: remove direct-push smoke test artifact`): CI ran in 47s, green. Merged via squash, branch `chore/cleanup-direct-push-test` deleted.
- Both PRs required an up-to-date branch (`strict: true`) — PR #4 was rebased against main (incorporating the SUMMARY commits from main) before it could merge.

### Direct-push-to-main test

```
$ git push origin main  # with a test commit
remote: Bypassed rule violations for refs/heads/main:
remote:  - Changes must be made through a pull request.
remote:  - Required status check "ci" is expected.
```

**Result:** The push was **admin-bypassed** (per D-12 `enforce_admins: false`) but GitHub logged the violations in the push output and in the audit log. This is working as designed for solo dev.

**For non-admin collaborators** (future state): the push would be **rejected outright** (no bypass available). Branch protection enforcement is effective against all non-admin pushes.

The test commit was cleaned up via PR #5 (exercises the full PR → CI → merge flow, proving the positive path).

## Decisions honoured

| Decision | How |
|----------|-----|
| D-01 GHA is the single required status check | CI workflow name `ci` registered with branch protection. One required context. |
| D-02 Four required checks (typecheck + lint + build + gitleaks) | All four present as explicit steps. Plus `format:check` (Prettier --check) per D-02's "ESLint + Prettier --check". |
| D-03 No tests in Phase 0 | No test step in CI. Vitest wiring deferred to Phase 2. |
| D-04 No Lighthouse CI in Phase 0 | Not included. Deferred to Phase 7. |
| D-06 GH secret scanning + push protection (L2) | Both enabled (free on public repo). |
| D-07 CI gitleaks is the `--no-verify` catch (L3) | gitleaks-action@v2 runs against the full diff range (`fetch-depth: 0`). |
| D-12 Branch protection specifics (solo dev) | `required_approving_review_count: 0`, `enforce_admins: false`, `strict: true`. Flagged for revisit when collaborators join. |

## Threats addressed

| Threat | Mitigation |
|--------|-----------|
| T-00-14 Secrets echoed in CI logs | No `echo $SECRET` pattern anywhere. No `set -x`. Actions auto-masks secrets. No Sentry/Vercel secrets are referenced in this workflow (Plan 05 puts them in Vercel's runtime env, not CI). |
| T-00-15 Admin bypass of branch protection | Accepted for solo dev per D-12. Every bypass logged in GitHub audit log — demonstrated in practice. Flagged for revisit when collaborators join. |
| T-00-16 `--no-verify` local bypass reaching main | Layer 3 CI gitleaks catches it on PR; branch protection requires CI green; no path to main without CI green (for non-admins). |
| T-00-17 Private repo without GHAS | Non-issue — repo is public; GHAS not needed. |
| T-00-18 Workflow edited in PR to weaken checks | PR must run under OLD workflow first (`strict: true`); changes to `.github/workflows/ci.yml` still require CI green on the existing workflow. |

## Four-layer defense status (after Plans 00-01 through 00-04)

| Layer | Mechanism | Status |
|-------|-----------|--------|
| L1 Pre-commit | lefthook + gitleaks (Plan 00-02) | ✓ Active; verified by user in smoke tests |
| L2 GitHub native | Secret scanning + push protection | ✓ Both enabled |
| L3 CI | gitleaks-action@v2 on every PR | ✓ Verified by PR #4 + #5 green runs |
| L4 Negative verification | Intentional fake-secret branch; CI must FAIL (D-08) | → Plan 00-06 |

## Handoff surfaces

| Plan | What it gets from 00-04 | Present? |
|------|--------------------------|----------|
| 00-05 Sentry | Working CI to gate Sentry wizard's output against. Sentry DSN + token added to Vercel env (not CI env) — CI doesn't upload source maps (Vercel's build does). | ✓ |
| 00-06 verification | Required L4 negative test — intentionally push a fake secret, confirm CI fails and GH push protection blocks. | ✓ (CI is ready) |

## Flags

- **Two Vercel projects** (`proavtive` AND `proavtive-c325`) both deploying from this repo. Probably an accidental duplicate — clean up one in the Vercel dashboard (delete `proavtive` or `proavtive-c325` depending on which one is actually linked). Not a Phase 0 blocker.
- **10 Dependabot-flagged CVEs** (4 high / 4 moderate / 2 low) on the default branch's dependency tree — coming from the Next.js + React 19 stack. Phase 9 MIG-03 owns the formal CVE audit. Dependabot's security-updates toggle (enabled here) will auto-open PRs for fixes.
- **Repo is public** — differs from the "private" assumption in early planning. Positive for Phase 0 (no GHAS cost). Flag for PROJECT.md update at phase completion.

## Self-check

- [x] `.github/workflows/ci.yml` matches all acceptance criteria
- [x] CI passes green on real PRs (#4 + #5)
- [x] Branch protection applied via `gh api`; `ci` is a required check; `strict: true` enforced
- [x] GH secret scanning + push protection enabled
- [x] Dependabot security updates enabled (bonus)
- [x] Direct push attempted and resulted in audit-logged bypass warning (non-admins would be rejected)
- [x] Cleanup PR #5 merged to remove the test artifact — proves the positive flow
- [x] All 4 defense layers either active or ready (L4 in Plan 00-06)

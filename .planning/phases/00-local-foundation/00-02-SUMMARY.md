---
phase: 00-local-foundation
plan: 02
status: complete
completed: 2026-04-22
requirements:
  - FOUND-06
---

# Plan 00-02 Summary: lefthook + gitleaks + commitlint + lint-staged

## What was built

Layer 1 of the four-layer secret-protection defense (per D-05), plus conventional-commit enforcement (per D-11). Every `git commit` on a developer machine now passes through:

1. **pre-commit** — gitleaks (staged content, default ruleset + lockfile allowlist) + lint-staged (ESLint --fix + Prettier on source; Prettier on JSON/YAML/CSS).
2. **commit-msg** — commitlint (Conventional Commits; subject-max-length=100).
3. **pre-push** — gitleaks on the full diff being pushed (defensive duplicate; soft-fails if binary missing since CI catches anything that slips).

Hooks can still be bypassed via `git commit --no-verify` — **by design**, because sometimes an engineer needs the escape hatch. The CI gitleaks job (Plan 00-04) is the ultimate catch that cannot be bypassed (D-07).

## Task log

| Task | Status | Commit |
|------|--------|--------|
| 1. Install hooks + config files | ✓ | `feat(00-02): install lefthook + gitleaks + commitlint + lint-staged (Task 1)` |
| 2. Human smoke-test checkpoint (3 tests) | ✓ | — (no artifact; user approved) |

## Versions pinned

| Package | Version |
|---------|---------|
| lefthook | 2.1.6 |
| @commitlint/cli | 20.5.0 |
| @commitlint/config-conventional | 20.5.0 |
| lint-staged | 16.4.0 |
| gitleaks (binary) | 8.30.1 (installed via `brew install gitleaks`) |

## Key files

- **`lefthook.yml`** — pre-commit (parallel: gitleaks + lint-staged), commit-msg (commitlint), pre-push (gitleaks full-diff).
- **`.gitleaks.toml`** — `[extend] useDefault = true`; allowlist includes lockfiles + `.planning/*.md` (high-entropy strings expected); `.env.example` deliberately NOT allowlisted.
- **`commitlint.config.cjs`** — extends `@commitlint/config-conventional`; `subject-max-length=100` so GSD-style subjects pass.
- **`.lintstagedrc.json`** — TS/TSX → ESLint --fix + Prettier; JSON/YAML/CSS → Prettier; Markdown excluded.
- **`package.json`** — added `prepare: "lefthook install"` + 4 devDeps.
- **`pnpm-workspace.yaml`** — added `onlyBuiltDependencies: [lefthook]` so pnpm 10 runs lefthook's install script (pnpm 10 default-denies build scripts).

## Smoke test results (Task 2)

| Test | Action | Expected | Actual |
|------|--------|----------|--------|
| 1 | `git commit -m "bad subject no type"` | Fails; commitlint error | ✓ blocked |
| 2 | `git commit -m "chore(hooks): smoke test lefthook install"` | Succeeds | ✓ passed |
| 3 | `git commit` with `AWS_SECRET_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE` staged | Fails; gitleaks finding | ✓ blocked |

All three behaviors confirmed. User approved checkpoint.

## Gitleaks binary install note

The gitleaks binary is not an npm package (it's a Go binary). Developers must install it separately:
- **macOS:** `brew install gitleaks` (this machine: installed at `/usr/local/bin/gitleaks`, v8.30.1)
- **Linux:** see https://github.com/gitleaks/gitleaks releases
- **CI:** Plan 00-04 uses `gitleaks/gitleaks-action@v2` — no binary install needed.

If the binary is missing:
- **pre-commit** hard-fails with the brew install hint (by design — you NEED it locally).
- **pre-push** soft-fails with a warning (CI will catch it anyway).

## Bypass escape hatch

`git commit --no-verify` bypasses pre-commit and commit-msg hooks. This is documented behaviour:
- Temporary bypass for emergency fixes, hotfixes, or WIP commits.
- Plan 00-04 CI gitleaks is the ultimate catch — anything committed with `--no-verify` that contains a secret will be flagged on the PR, and branch protection will prevent the merge.

## Decisions honoured

| Decision | How |
|----------|-----|
| D-05 lefthook + gitleaks pre-commit | lefthook.yml pre-commit runs `gitleaks protect --staged --redact`. |
| D-07 CI is the ultimate catch | Bypass documented; Plan 04 wires the non-bypassable CI layer. |
| D-11 Conventional commits enforced via lefthook + commitlint | commit-msg hook runs commitlint with config-conventional preset. |

## Handoff surfaces (for downstream plans)

| Plan | What it gets from 00-02 | Present? |
|------|--------------------------|----------|
| 00-04 CI gitleaks | Same `.gitleaks.toml` config reused by the CI action — local + CI rules are identical. | ✓ |
| 00-06 verification | Pre-commit smoke test artifact (this file) + the "no secrets in git history" property it enforces. | ✓ |

## Self-check

- [x] All acceptance criteria met
- [x] User-approved smoke tests
- [x] Hooks auto-install on `pnpm install`
- [x] `.env.example` not allowlisted (intentional)
- [x] `--no-verify` escape hatch documented

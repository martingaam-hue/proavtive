# ProActiv Sports — Website Ecosystem

Single Next.js 16 app, subdomain-routed into root / hk / sg, Sanity CMS, Vercel + Cloudflare.

## Prerequisites

- **Node.js** — version pinned in [`.nvmrc`](./.nvmrc). Install via `nvm install $(cat .nvmrc)` (recommended) or ensure your global Node satisfies the `engines.node` range in [`package.json`](./package.json).
- **pnpm via Corepack** — `corepack enable` uses the exact version declared in `package.json`'s `packageManager` field. Do not install pnpm globally; Corepack picks it up automatically.
- **Vercel CLI** (optional until Plan 00-03) — `pnpm add -g vercel` when needed.
- **Access to the Vercel project dashboard** — required to copy env var values into `.env.local` per decision D-09 in [`00-CONTEXT.md`](./.planning/phases/00-local-foundation/00-CONTEXT.md).

## Local setup

```bash
corepack enable
nvm use                    # or fnm use — respects .nvmrc
pnpm install --frozen-lockfile
cp .env.example .env.local
# Fill values in .env.local by copying from Vercel dashboard →
#   Project Settings → Environment Variables → pick the "Development" scope.
pnpm dev
```

The dev server starts at `http://localhost:3000`. Phase 1 adds subdomain routing at `*.localhost:3000` (root, hk, sg).

## Scripts

| Command                | What it does                                                                 |
| ---------------------- | ---------------------------------------------------------------------------- |
| `pnpm dev`             | Start the Next.js dev server on port 3000 (Turbopack).                       |
| `pnpm build`           | Production build. Matches Vercel's build step.                               |
| `pnpm start`           | Run the production build locally. Assumes `pnpm build` ran first.            |
| `pnpm lint`            | ESLint (flat config) — Next.js core-web-vitals + TypeScript + Prettier.      |
| `pnpm typecheck`       | `tsc --noEmit` — fast structural typecheck with zero emit.                   |
| `pnpm format`          | Prettier `--write` across the repo.                                          |
| `pnpm format:check`    | Prettier `--check` — exits non-zero if anything is unformatted. CI gate.     |

## Secrets discipline

- **No real values in `.env.example`** — it lists variable names only, empty values. Committed.
- **`.env.local` is gitignored** — the single source of truth for local development.
- **Values come from the Vercel dashboard** — manual copy for solo dev (decision D-09). 1Password Business sync is scheduled for Phase 10.
- **Sentry DSN is the only "public" value** — every other `SENTRY_*` and third-party token is server-only. The `NEXT_PUBLIC_` prefix is reserved for intentionally client-exposed values.
- **Forget what you wrote.** `git check-ignore .env.local` should return exit 0. If it doesn't, do not commit.

## Git hooks & CI

Plan 00-02 installs lefthook + gitleaks + commitlint for pre-commit and commit-msg enforcement. Plan 00-04 adds the GitHub Actions CI workflow (typecheck + lint + build + gitleaks) and configures branch protection on `main`.

## Sentry smoke test

Plan 00-05 adds `GET /api/sentry-smoke?token=$SENTRY_SMOKE_TOKEN` — throws a deliberate error so you can confirm Sentry is live after any preview deploy. `SENTRY_SMOKE_TOKEN` is configured in Vercel env and replicated in `.env.local` for local testing.

## GSD workflow

All repo edits go through GSD commands per [`CLAUDE.md`](./CLAUDE.md). Use `/gsd-quick` for small fixes, `/gsd-execute-phase` for planned work, and `/gsd-debug` for investigation.

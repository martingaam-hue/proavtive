# Phase 9: Legacy `.net` Migration Prep and Security Hardening — Research

**Researched:** 2026-04-24
**Domain:** URL migration mapping, Vercel redirect architecture, security audit, cutover runbook
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| MIG-02 | Crawl `proactivsports.net` (and HK/SG sub-properties) for all live URLs with inbound traffic or backlinks; build URL-by-URL 301 map; deploy in Vercel `vercel.json` redirects or middleware | Crawl methodology, Vercel redirect architecture, limit analysis, testing approach |
| MIG-03 | Pre-launch security pass — no exposed env, no Sanity public mutate token, Cloudflare WAF rules tested, dependency audit clean (no high/critical CVEs) | Current audit state, token scope audit, env exposure analysis, CVE resolution path |

</phase_requirements>

---

## Summary

Phase 9 is a preparation phase: no new pages, no new user-facing features. It produces three artefacts that Phase 10 activates: (1) a 301 redirect map deployed in `vercel.json` ready to fire the moment the domain is attached, (2) a clean dependency audit, and (3) a rehearsed cutover runbook. All work is verifiable against the existing Vercel preview deployment — no DNS required.

**The legacy domain context matters.** Strategy PART 15.2 Warning #1 explicitly calls out that `proactivsports.net` has historic malware/black-hat associations. Every URL that has accumulated backlink equity or indexed traffic must be 301'd to the new ecosystem so that equity transfers cleanly. URLs that never earned traffic are allowed to die — "clean slate, not migration" is the explicit out-of-scope statement in REQUIREMENTS.md.

The current codebase security posture is already good: gitleaks in CI, no server secrets in client components (verified by grep audit in this session), `RESEND_API_KEY` and `SANITY_API_READ_TOKEN` are server-only, only safe public values use `NEXT_PUBLIC_` prefix. Phase 9 formalises and documents this posture; it does not have to rebuild it from scratch.

**Primary recommendation:** Use `vercel.json` `redirects` array for the 301 map (not middleware, not Bulk Redirects for a site this size). The legacy `.net` site is a small-to-medium sports-school website — the URL count will be well within the 2,048 route limit. Bulk Redirects adds a Pro-plan cost; middleware adds latency and complexity; `vercel.json` is zero-cost, zero-latency (processed at edge before middleware), and versioned with code.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| 301 redirect map (legacy .net URLs) | Vercel Edge (vercel.json config) | Next.js middleware fallback | vercel.json redirects execute before any other routing layer — lowest latency, no function invocation cost |
| Legacy URL crawl | External tool (offline) | None | Crawling happens offline (Screaming Frog / programmatic Node.js) before any code changes |
| Environment variable security | Next.js build-time (NEXT_PUBLIC_ convention) | CI (gitleaks) | Already enforced; Phase 9 audits and documents the existing posture |
| Sanity token scoping | Sanity API (server-only) | Vercel env dashboard | Token roles set in Sanity dashboard; token values in Vercel env, never git |
| Dependency CVE remediation | pnpm workspace (overrides) | Dependabot config | pnpm overrides can patch transitive deps without waiting for upstream releases |
| Cutover runbook | Documentation (markdown) | Human-executed Phase 10 | Runbook lives in `.planning/` and is tested as a dry-run in Phase 9 |

---

## Standard Stack

### Core Tools

| Tool | Version/Source | Purpose | Why Standard |
|------|---------------|---------|--------------|
| `vercel.json` redirects | Vercel platform | 301 map deployment | Zero-cost, edge-processed before Next.js, versioned with code; max 2,048 routes per deployment [VERIFIED: vercel.com/docs/limits] |
| `pnpm audit` | pnpm 10.x (already in project) | CVE detection | Native to the workspace; supports `--prod`, `--audit-level` flags [VERIFIED: pnpm.io/cli/audit] |
| Screaming Frog SEO Spider (desktop app) | Any current version | Legacy site crawl | Industry standard; free tier crawls up to 500 URLs; exports clean CSV of status codes, redirects, and inbound links |
| `node --input-type=module` script | Node.js 22 (project engine) | Programmatic crawl alternative | When Screaming Frog is unavailable; Crawlee's `CheerioCrawler` is the production-grade Node.js option [VERIFIED: crawlee.dev] |
| Vitest | 4.1.5 (already in project) | 301 map test assertions | Already wired; can test redirect response codes via fetch against preview URLs |

### Supporting

| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| `pnpm overrides` in `package.json` | pnpm 10.x | Force-patch transitive dep CVEs | When a CVE is in a transitive dep with no direct parent update available (e.g., `shadcn > @mcp/sdk > express > path-to-regexp`) |
| `audit-ci` npm package | latest | Block CI on high/critical CVEs | Optional — adds a dedicated CI step that fails on severity threshold |
| Vercel Bulk Redirects | Pro plan feature | 301 maps >2,048 URLs | Only needed if URL count exceeds `vercel.json` limit; costs $0.002/month per 25k additional [VERIFIED: vercel.com/docs/routing/redirects/bulk-redirects] |
| `curl -H "Host: proactivsports.net"` | CLI | Verify redirects against preview | Test redirects without DNS by sending explicit Host header to preview URL |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `vercel.json` redirects | Next.js middleware `NextResponse.redirect()` | Middleware runs per-request and costs function invocations; vercel.json is processed at the edge router before any function is invoked — better for a static list of legacy URLs |
| `vercel.json` redirects | Vercel Bulk Redirects | Bulk Redirects is Pro-plan-gated and adds a per-redirect cost beyond 1,000 included; overkill for a small sports-school site where the URL count is likely <200 |
| `pnpm audit` | Snyk | pnpm audit is already in the project and requires no extra account or API token |

---

## Architecture Patterns

### System Architecture Diagram

```
Phase 9 Artefact Flow
─────────────────────────────────────────────────────────────

[proactivsports.net LIVE SITE]
         │
         │ 1. Crawl (Screaming Frog / Node.js script)
         ▼
[URL inventory: CSV / JSON]
         │
         │ 2. Filter to traffic/backlink URLs only
         │    (GA4 reports + Ahrefs/free backlink tools)
         ▼
[301 map: source path → destination URL]
         │
         │ 3. Encode in vercel.json `redirects` array
         ▼
[vercel.json committed to git]
         │
         │ 4. Deployed to Vercel preview (already active)
         ▼
[Preview deployment]
         │
         │ 5. Test via `curl -H "Host: proactivsports.net"
         │    <preview-url>/<old-path>`
         │    → expect 301 Location: https://<new-ecosystem-URL>
         ▼
[301 map verified — dormant until Phase 10 DNS attachment]

Security audit runs in parallel:
[pnpm audit --prod] → CVE report → overrides or dep updates
[Sanity dashboard] → token scope verification
[Env var audit] → confirm no server secrets in NEXT_PUBLIC_
[CI gitleaks] → already running per Phase 0
[Dependabot config] → already running per Phase 0
```

### Recommended Project Structure

```
vercel.json               # Already exists; add `redirects` array here
scripts/
  crawl-net.mjs           # Optional: programmatic crawl of proactivsports.net
  verify-redirects.mjs    # Optional: smoke-test all 301s against preview URL
.planning/phases/09-legacy-net-migration-security/
  09-RESEARCH.md          # This file
  09-PLAN-01-*            # Plans produced from this research
  CUTOVER-RUNBOOK.md      # Cutover runbook document (Phase 9 deliverable)
  NET-URL-INVENTORY.csv   # Crawl output (not committed if large; gitignore option)
  REDIRECT-MAP.json       # Machine-readable source for generating vercel.json redirects
```

### Pattern 1: `vercel.json` Redirects Array

**What:** Static redirect rules in `vercel.json` that Vercel's edge router processes before any Next.js code runs.

**When to use:** Static legacy URL maps where source patterns are known at deploy time. Best for < 2,048 rules.

**Example:**
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install --frozen-lockfile",
  "redirects": [
    {
      "source": "/gymnastics",
      "destination": "https://hk.proactivsports.com/gymnastics/",
      "permanent": true
    },
    {
      "source": "/holiday-camps",
      "destination": "https://hk.proactivsports.com/holiday-camps/",
      "permanent": true
    },
    {
      "source": "/blog/:slug",
      "destination": "https://hk.proactivsports.com/blog/:slug",
      "permanent": true
    }
  ]
}
```

Key notes [VERIFIED: vercel.com/docs/project-configuration/vercel-json]:
- `"permanent": true` emits HTTP 308 (not 301) — use `"statusCode": 301` to force traditional 301
- `source` supports `:param` capture groups and wildcard `*` patterns
- Max 2,048 total routes per deployment (across redirects + rewrites + headers + framework-generated routes)
- Redirects in `vercel.json` are processed BEFORE middleware and BEFORE Next.js pages

**Important distinction:** The existing `vercel.json` will have a `redirects` key added. The middleware.ts D-01 precedence ladder runs only for requests that pass through routing — `vercel.json` redirects fire first and never reach middleware.

### Pattern 2: Testing Redirects Before DNS Cutover

**What:** Verify 301 responses using explicit `Host` headers against the Vercel preview URL.

**When to use:** Any time you need to test a redirect rule that matches on hostname before the domain is actually attached to Vercel.

**Example:**
```bash
# Test that the legacy .net URL redirects correctly from the preview deployment.
# The preview URL receives the request; the Host header tells it to match the .net rule.
PREVIEW_URL="https://proactive-abc123.vercel.app"
OLD_PATH="/gymnastics"
EXPECTED_DEST="https://hk.proactivsports.com/gymnastics/"

curl -s -o /dev/null -w "%{http_code} %{redirect_url}" \
  -H "Host: proactivsports.net" \
  "${PREVIEW_URL}${OLD_PATH}"
# Expected output: 301 https://hk.proactivsports.com/gymnastics/
```

**Caveat:** Vercel preview deployments use Vercel Authentication by default (Phase 0 D-01 decision). The test above needs the `x-vercel-protection-bypass` header or the test must run against a protection-bypassed deployment. [ASSUMED: bypass token approach — needs confirmation against actual preview protection settings]

**Alternative test approach — using the `?__market=` bridge in middleware.ts:**
The existing middleware already has a cookie/query bridge for preview environments (Phase 1 plan 01-01). However, the redirect rules in `vercel.json` match on the `Host` header before middleware runs, so testing via the query bridge would not exercise the redirect rules — only the full `Host: proactivsports.net` approach exercises the actual redirect path.

### Pattern 3: pnpm Overrides for Transitive CVE Remediation

**What:** Force a specific version of a transitive dependency to address CVEs where the direct parent hasn't published an update.

**When to use:** When `pnpm audit --prod` shows a CVE in a transitive dep (e.g., `shadcn > @mcp/sdk > express > path-to-regexp`).

**Example:**
```json
// package.json — add overrides block
{
  "pnpm": {
    "overrides": {
      "path-to-regexp": ">=8.4.0"
    }
  }
}
```

**Current state:** `pnpm audit --prod` shows **1 HIGH + 7 MODERATE** vulnerabilities. All HIGH CVEs from the full audit (`pnpm audit`) trace to `vercel` (a devDependency) — those 10 HIGH CVEs in `tar`, `minimatch`, `undici`, `path-to-regexp` via `@vercel/*` are all in `devDependencies` and are NOT bundled in the production build. The one remaining HIGH in prod audit is `path-to-regexp` via `shadcn > @mcp/sdk > express > router` — `shadcn` is also a build CLI tool, not a production runtime import. [VERIFIED: pnpm audit --prod run in this session]

**Resolution approach:**
1. `shadcn` has no runtime usage in the Next.js app — it's a code generator CLI. Its CVE does not affect the running Next.js application. However, to satisfy MIG-03's "zero high/critical CVEs" requirement, add a pnpm override for `path-to-regexp`.
2. `vercel` devDependency CVEs: can either add overrides, or accept them with a documented rationale (they don't affect production). Strategy.md says "dependency audit clean" — the plan should resolve or document each HIGH.

### Anti-Patterns to Avoid

- **Redirecting to wrong market:** `proactivsports.net` served both HK and SG content. URLs must be mapped to the correct subdomain (`hk.proactivsports.com` or `sg.proactivsports.com`), not blindly to the root.
- **Redirecting everything with a wildcard:** A catch-all `"source": "/*"` that sends everything to the root homepage destroys the SEO equity of specific pages. Map URL-by-URL for trafficked/linked pages.
- **Using 302 instead of 301:** Temporary redirects do not pass link equity. Use `"permanent": true` or `"statusCode": 301` in every rule.
- **Including query-string in `source`:** Vercel `vercel.json` `source` matches path only (excluding query string). Don't include `?` in the source pattern.
- **Blocking `.net` in robots.txt too early:** The legacy site's `robots.txt` should allow crawling during the 6–12 month 301 window so Googlebot can process the redirects. Do NOT set `robots.txt` to `Disallow: /` on the `.net` until redirects have propagated.
- **Committing actual .env.local to git:** Already prevented by Phase 0 gitleaks + gitignore, but the runbook must confirm this is clean before every Phase 10 step.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CVE scanning | Custom package inspector | `pnpm audit` | Already in CI dependency chain; has `--audit-level` flag and JSON output |
| Secret scanning | Manual grep for keys | gitleaks (already in CI) | Already runs as required CI check (Phase 0 Plan 00-02); has custom config in `.gitleaks.toml` |
| Redirect testing | Custom HTTP proxy | `curl -H "Host:"` or Vitest fetch | Two-line shell command proves the 301; no extra tooling needed |
| URL discovery | Writing a full spider | Screaming Frog free tier (≤ 500 URLs) | Desktop tool; much faster to run and interpret than writing and debugging a Node spider for a one-time crawl |

**Key insight:** Phase 9 is an audit/documentation phase. Almost every capability needed is already in place (gitleaks, pnpm audit, Vitest, Dependabot). The planner's job is to wire, verify, and document — not to introduce new tooling.

---

## Common Pitfalls

### Pitfall 1: vercel.json route budget overrun
**What goes wrong:** Adding the `redirects` array to `vercel.json` pushes the total route count (redirects + rewrites + headers + framework routes) over the 2,048 limit, causing the Vercel deployment to fail.
**Why it happens:** Next.js generates routes for every page, dynamic segment, API route, and middleware matcher. Each `vercel.json` redirect adds to that total.
**How to avoid:** Before writing the 301 map, run `vercel build` locally and inspect the build output for current route count. Alternatively, keep the 301 map lean — only trafficked/backlinked URLs (not the full sitemap of the legacy site). For most small sports-school sites, 20–100 redirects is realistic; 2,048 is not a real constraint.
**Warning signs:** Vercel build fails with "Routes limit exceeded" message.

### Pitfall 2: 308 vs 301 semantic difference
**What goes wrong:** `"permanent": true` in `vercel.json` emits HTTP 308 (Permanent Redirect), not 301. Some SEO tools and crawlers handle 308 slightly differently from 301. Google treats them identically for ranking purposes, but legacy bots may not.
**Why it happens:** Vercel adopted 308 as the "correct" permanent redirect because it preserves the HTTP method (308 forces method preservation; 301 allows method change from POST to GET). The `permanent` flag maps to 308.
**How to avoid:** Use `"statusCode": 301` explicitly in each redirect rule when a traditional 301 is required. The Phase 9 requirement (MIG-02) says "301 map" — use explicit 301.
**Warning signs:** SEO audit tools report 308s where 301s were expected.

### Pitfall 3: Crawl scope — missing hk.proactivsports.net and sg.proactivsports.net
**What goes wrong:** Only `proactivsports.net` (root) is crawled, missing HK and SG sub-properties which may have their own inbound links and indexed URLs.
**Why it happens:** The MIG-02 requirement explicitly includes "HK/SG sub-properties" but this is easy to forget during planning.
**How to avoid:** Run three crawls: `proactivsports.net`, `hk.proactivsports.net`, `sg.proactivsports.net`. Check whether these subdomains are live and indexed by running `site:hk.proactivsports.net` in Google.
**Warning signs:** Post-launch search console shows 404 errors on hk.proactivsports.net paths.

### Pitfall 4: `proactivsports.net` may still be compromised or blacklisted
**What goes wrong:** The `.net` domain has confirmed malware/black-hat history (strategy PART 1, PART 13.1). If it is still flagged by Google Safe Browsing, backlink equity from that domain may be toxic rather than beneficial.
**Why it happens:** Historically compromised domains sometimes remain on Google's list for months/years after cleanup.
**How to avoid:** Before building the 301 map, run a Google Safe Browsing check: `https://transparencyreport.google.com/safe-browsing/search?url=proactivsports.net`. If still flagged, document the finding and discuss with the user whether the 301 strategy should be adjusted.
**Warning signs:** Google Search Console shows manual action or security issue against the .net domain.

### Pitfall 5: `SANITY_API_READ_TOKEN` not set = silent auth failure
**What goes wrong:** The `SANITY_API_READ_TOKEN` is listed in `.env.example` as `SANITY_API_READ_TOKEN=` (empty). If Phase 9 assumes it is set in Vercel env for Phase 10 launch, and it isn't, draft previews and server-side Sanity queries will silently return only published content (or fail if the dataset is private).
**Why it happens:** Token was scaffolded in Phase 1 but no Sanity API call has needed it yet (pages use static data through Phase 8).
**How to avoid:** Phase 9 security pass should verify the Vercel environment has this token set with correct scope (Viewer role) and that it matches the Sanity project settings.
**Warning signs:** Preview environments fail to show draft content; server-side Sanity `fetch()` calls return empty arrays.

### Pitfall 6: pnpm overrides breaking lockfile
**What goes wrong:** Adding a `pnpm.overrides` block forces a version constraint that conflicts with another dependency's peer requirements, causing `pnpm install --frozen-lockfile` to fail in CI.
**Why it happens:** The `--frozen-lockfile` flag in CI rejects any lockfile changes. Adding overrides modifies the lockfile.
**How to avoid:** After adding overrides, run `pnpm install` locally to regenerate `pnpm-lock.yaml`, then commit both `package.json` and `pnpm-lock.yaml`. CI's `--frozen-lockfile` will then pass because the lockfile matches.
**Warning signs:** CI `pnpm install --frozen-lockfile` fails after adding overrides.

---

## Code Examples

### vercel.json Redirect Entry (301, with parameter capture)
```json
// Source: https://vercel.com/docs/project-configuration/vercel-json
{
  "source": "/blog/:slug*",
  "destination": "https://hk.proactivsports.com/blog/:slug*",
  "statusCode": 301
}
```

### Test a Single Redirect from CLI
```bash
# Source: verified pattern — curl with explicit Host header
# Replace <PREVIEW_URL> with actual Vercel preview deployment URL
curl -s -o /dev/null -w "HTTP %{http_code}\nLocation: %{redirect_url}\n" \
  -H "Host: proactivsports.net" \
  "https://<PREVIEW_URL>/gymnastics"
# Expected:
# HTTP 301
# Location: https://hk.proactivsports.com/gymnastics/
```

### pnpm audit — CI-safe invocation
```bash
# Audit production deps only; exit non-zero if any HIGH or CRITICAL found
pnpm audit --prod --audit-level high
```

### pnpm overrides for transitive CVE
```json
// package.json — pnpm.overrides block (add if HIGH CVE in transitive dep)
{
  "pnpm": {
    "overrides": {
      "path-to-regexp": ">=8.4.0"
    }
  }
}
```
After adding: run `pnpm install` to update lockfile, then commit both files.

### Verify Sanity Token Scope (Sanity CLI)
```bash
# List all tokens for the project — requires sanity CLI authenticated
npx sanity@latest projects list
npx sanity@latest token list
# Verify SANITY_API_READ_TOKEN corresponds to a "Viewer" role token
# Write tokens must NOT exist in .env.example or Vercel env without server-only prefix
```

---

## Current Security State (Verified in This Session)

### Environment Variables
- `SANITY_API_READ_TOKEN`: server-only (no `NEXT_PUBLIC_` prefix), Viewer scope by convention — needs Vercel dashboard verification [VERIFIED: .env.example]
- `RESEND_API_KEY`: server-only, only in `app/api/contact/route.ts` (a Server Route Handler) [VERIFIED: grep audit]
- `SENTRY_AUTH_TOKEN`, `SENTRY_DSN`: server-only [VERIFIED: .env.example]
- `NEXT_PUBLIC_*` vars: only truly public values (phone numbers, WhatsApp numbers, Mux playback IDs, market URLs, Sanity project ID/dataset) [VERIFIED: grep audit]
- No server-only secrets found in any `'use client'` component [VERIFIED: grep audit]

### CVE Audit State
- `pnpm audit --prod`: **1 HIGH, 7 MODERATE** — HIGH is `path-to-regexp` via `shadcn > @mcp/sdk > express`
- `pnpm audit` (all): **10 HIGH, 15 MODERATE, 2 LOW** — all 9 remaining HIGH CVEs are in `vercel` devDependency only (`tar`, `minimatch`, `undici`, `path-to-regexp` via `@vercel/*`)
- `shadcn` classified as `dependencies` (not `devDependencies`) in package.json but is a CLI code-generator with no runtime import path — the CVE does not affect the running Next.js app [VERIFIED: package.json + shadcn package.json bin field]
- **Action required:** Add pnpm override for `path-to-regexp >= 8.4.0` AND for `vercel` transitive deps if strict zero-HIGH policy is required for MIG-03

### Token Scoping
- No Sanity write token exists anywhere in the codebase [VERIFIED: grep audit]
- Only `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are client-exposed (both are design-time public values) [VERIFIED: sanity.config.ts + .env.example]
- `SANITY_API_READ_TOKEN` scope (Viewer vs Editor) must be confirmed in Sanity dashboard — this is a HUMAN-ACTION step

### Pre-existing Security Infrastructure
- gitleaks running as required CI check (Phase 0) [VERIFIED: ci.yml]
- Dependabot configured for weekly npm + GitHub Actions updates (Phase 0) [VERIFIED: .github/dependabot.yml]
- Branch protection on `main` with required CI checks (Phase 0) [VERIFIED: STATE.md]
- Pre-commit lefthook + gitleaks (local, Phase 0) [VERIFIED: lefthook.yml]

---

## Runtime State Inventory

> Phase 9 involves no rename/refactor — this section addresses migration-specific runtime state.

| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| Stored data | None — no database in this project | None |
| Live service config | `proactivsports.net` DNS currently pointing at legacy hosting (unknown provider) | No code change — Phase 10 DNS work |
| OS-registered state | None | None |
| Secrets/env vars | `SANITY_API_READ_TOKEN` in Vercel env dashboard — scope (Viewer vs Editor) unconfirmed | HUMAN-ACTION: verify in Sanity dashboard |
| Build artifacts | None relevant | None |

---

## Environment Availability Audit

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js 22 | crawl scripts, pnpm audit | Yes (Node 24 on this machine, engine mismatch is non-blocking) | 24.14.0 (warns but works) | None needed |
| pnpm 10.30.3 | dependency audit, lockfile | Yes | 10.30.3 | None needed |
| Screaming Frog SEO Spider | Legacy URL crawl | Unknown — not installed on dev machine | — | Node.js crawl script via Crawlee |
| curl | Redirect testing | Yes (macOS built-in) | macOS curl 8.x | None needed |
| Sanity CLI (`sanity`) | Token scope audit | Not installed globally | — | Use Sanity web dashboard directly |
| vercel CLI | Preview URL testing | Yes (in devDependencies) | 52.x | None needed |

**Missing dependencies with no fallback:**
- None that block execution.

**Missing dependencies with fallback:**
- Screaming Frog: fallback is a 30-line `scripts/crawl-net.mjs` using Node.js built-in `fetch()` + recursive HTML link extraction. Sufficient for a small site.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.5 |
| Config file | `vitest.config.ts` |
| Quick run command | `pnpm test:unit` |
| Full suite command | `pnpm test:unit` (same — 85 tests, ~60s) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MIG-02 | Every legacy URL in the 301 map returns HTTP 301 with correct Location header | Integration (fetch against preview) | `node scripts/verify-redirects.mjs` | ❌ Wave 0 |
| MIG-02 | `vercel.json` redirects array is valid JSON with required fields | Unit | `pnpm typecheck` (if typed) or JSON schema validation | ❌ Wave 0 |
| MIG-03 | `pnpm audit --prod` exits 0 (zero HIGH/CRITICAL) | CI check | `pnpm audit --prod --audit-level high` | ❌ Add to CI |
| MIG-03 | No server-only env var accessed in any `'use client'` component | Static analysis (CI) | `pnpm build` (Next.js build fails on server-to-client prop leaks) | ✅ Existing CI |
| MIG-03 | No Sanity write token in client bundle | Unit/static | Existing gitleaks CI check | ✅ Existing CI |

### Sampling Rate
- Per task commit: `pnpm test:unit`
- Per wave merge: `pnpm test:unit` + `pnpm audit --prod --audit-level high`
- Phase gate: all tests green + audit clean before Phase 10

### Wave 0 Gaps
- [ ] `scripts/verify-redirects.mjs` — programmatic smoke-test of all 301s against the preview URL
- [ ] `pnpm audit --prod --audit-level high` added as a required CI step in `ci.yml`

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | Not applicable to static redirect map |
| V3 Session Management | No | No session changes in Phase 9 |
| V4 Access Control | Partial | Sanity token scoping (server-only write path) |
| V5 Input Validation | No | No new user-facing input |
| V6 Cryptography | No | No new crypto in Phase 9 |
| V14 Configuration | Yes | Env var exposure audit, secrets not in git |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Secret in git history | Information Disclosure | gitleaks (already in CI, Phase 0) |
| Server-only env leaked via client component prop | Information Disclosure | Next.js build-time bundling analysis; `NEXT_PUBLIC_` prefix discipline |
| Sanity write token in public client bundle | Tampering / Data Destruction | Token scope audit (Viewer-only in client paths); no write token in .env.example |
| Open redirect via vercel.json destination | Spoofing | All destinations must be within `proactivsports.com` ecosystem — no user-controlled destination |
| Legacy `.net` domain still serving malware post-301 | Repudiation / Elevation | Google Safe Browsing check; monitor with Sucuri post-cutover |

---

## Cutover Runbook Structure (MIG-04 input for Phase 10)

The runbook document (`CUTOVER-RUNBOOK.md`) that Phase 9 produces should cover these sections:

1. **Pre-conditions** (all must be true before starting):
   - Phase 9 verification checklist signed off
   - `pnpm audit --prod` shows zero HIGH/CRITICAL
   - All 301 redirects verified against preview URL
   - Sanity token scopes confirmed
   - Vercel project bound to GitHub repo, latest commit deployed to preview
   - Registrar auth code / EPP code for `proactivsports.com` in hand (STATE.md note: gather closer to Phase 10)

2. **TTL lowering schedule** (48h before cutover):
   - Day -3: Lower all DNS TTLs to 3,600 seconds (1 hour)
   - Day -1: Lower to 300 seconds (5 minutes) — the fastest globally-safe propagation window [CITED: dohost.us/dns-ttl best practices]
   - Day 0: Execute cutover only after old TTL has expired (300s = 5 minutes)

3. **Cutover sequence** (Phase 10 executes):
   - Freeze unrelated DNS edits
   - Attach `proactivsports.com` + `hk.*` + `sg.*` to Vercel project
   - Vercel provisions `*.proactivsports.com` cert automatically
   - Point Cloudflare DNS A/CNAME records to Vercel (Phase 10 owns this)
   - `vercel.json` redirects from `proactivsports.net` activate when domain is attached

4. **Smoke test checklist** (execute within 10 minutes of DNS switch):
   - `curl https://proactivsports.com/` → HTTP 200, correct HTML
   - `curl https://hk.proactivsports.com/` → HTTP 200
   - `curl https://sg.proactivsports.com/` → HTTP 200
   - `curl https://proactivsports.net/<legacy-path>` → HTTP 301 to correct `.com` destination
   - `curl https://proactivsports.com/sitemap.xml` → HTTP 200
   - Contact form submission (HK inbox receives test email)
   - WhatsApp click-to-chat opens correctly
   - Sentry smoke route (`/api/sentry-smoke`) returns 200 and event appears in Sentry

5. **Rollback plan**:
   - Lower DNS TTL already at 300s → can switch NS back within 10 minutes
   - Revert Cloudflare NS to previous registrar nameservers
   - Legacy `.net` site remains operational throughout Phase 10 cutover window as fallback
   - Document: do NOT remove legacy DNS records until 48h after smoke tests pass

6. **Post-cutover actions** (within 72h):
   - Submit fresh sitemaps to Google Search Console for all three properties
   - Verify Search Console ownership (TXT record from Phase 8 prepared)
   - Raise DNS TTLs back to 3,600s
   - Monitor Google Search Console coverage errors daily for first 2 weeks
   - Monitor `proactivsports.net` for re-infection (Sucuri weekly scan) for 6–12 month window

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `vercel.json` `routes` array (legacy) | `vercel.json` `redirects` array (dedicated key) | ~2022 (Vercel routing v2) | `redirects` is easier to read and has better tooling support than the generic `routes` array |
| `"permanent": true` maps to 301 | `"permanent": true` maps to 308; `"statusCode": 301` needed for explicit 301 | Ongoing Vercel behaviour | Plan must use `statusCode: 301` explicitly |
| npm audit | pnpm audit (native) | When project adopted pnpm | pnpm audit reads from the pnpm lockfile; use this, not npm audit |
| Bulk Redirects was unavailable | Bulk Redirects now available (Pro plan, 1,000 included) | 2024 Vercel feature | Available as fallback if URL count exceeds 2,048 limit |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The legacy `proactivsports.net` URL count is well under 2,048 (likely < 200 URLs with meaningful traffic/backlinks) | Standard Stack, Architecture | If the legacy site has thousands of trafficked URLs, must use Vercel Bulk Redirects instead of `vercel.json` |
| A2 | `proactivsports.net`, `hk.proactivsports.net`, `sg.proactivsports.net` are all currently live and crawlable | Pitfall 3 | If subdomains are down or behind auth, crawl must use archived Wayback Machine or Ahrefs export instead |
| A3 | The Vercel project is on the Pro plan or the number of `vercel.json` redirects + Next.js-generated routes stays under 2,048 | Standard Stack | Exceeding the limit causes build failure; fallback to Bulk Redirects |
| A4 | Screaming Frog free tier (500 URL limit) is sufficient for the legacy site | Environment Availability | If the legacy site has > 500 URLs, must use paid Screaming Frog or the Node.js crawl script |
| A5 | Vercel preview deployment uses Vercel Authentication (from Phase 0 Plan 00-03) which may block `curl` redirect tests | Testing Pattern 2 | If authentication blocks test, need to use protection bypass token or temporarily disable preview auth |

---

## Open Questions

1. **Is `proactivsports.net` Google Safe Browsing clean?**
   - What we know: strategy PART 1 confirms historic malware/black-hat associations
   - What's unclear: current GSB status as of today
   - Recommendation: Phase 9 plan must include a GSB check step before building the redirect map; if still flagged, discuss with user whether to delay the 301 strategy

2. **Are `hk.proactivsports.net` and `sg.proactivsports.net` live subdomains with indexed content?**
   - What we know: the strategy doc confirms they exist
   - What's unclear: whether they have their own inbound backlinks separate from the root
   - Recommendation: run `site:hk.proactivsports.net` and `site:sg.proactivsports.net` in Google to check indexed URL count before deciding crawl scope

3. **Does the Vercel project have a `SANITY_API_READ_TOKEN` with correct Viewer scope set in the Vercel dashboard?**
   - What we know: `.env.example` defines it, `.env.local` does not contain it (checked), no code currently calls it (Sanity data is not yet in use through Phase 8)
   - What's unclear: whether the token is set in Vercel env, and whether the scope is Viewer (read-only) vs Editor (write)
   - Recommendation: Phase 9 plan includes a HUMAN-ACTION to verify this in the Vercel dashboard and the Sanity management dashboard

4. **What is the exact Vercel plan tier (Hobby vs Pro)?**
   - What we know: Phase 0 used Vercel Hobby for free preview deployments; Vercel Authentication (preview protection) is a Pro feature normally, but Vercel now offers it on Hobby via a different mechanism
   - What's unclear: Pro plan status affects Bulk Redirects included count (1,000 Pro vs unavailable Hobby) and route limits (2,048 both)
   - Recommendation: Document the plan tier in the runbook; for a real client production site, Pro plan is assumed

---

## Sources

### Primary (HIGH confidence)
- [Vercel Limits documentation](https://vercel.com/docs/limits) — Routes created per Deployment limit: 2,048 for Hobby and Pro [VERIFIED]
- [Vercel Bulk Redirects documentation](https://vercel.com/docs/routing/redirects/bulk-redirects) — limits, pricing, field schema [VERIFIED]
- [Vercel vercel.json configuration](https://vercel.com/docs/project-configuration/vercel-json) — redirects array schema [VERIFIED]
- `pnpm audit --prod` (run in this session) — 1 HIGH + 7 MODERATE in production deps [VERIFIED]
- `package.json` audit — all HIGH CVEs from full audit trace to `vercel` devDependency [VERIFIED]
- `app/api/contact/route.ts` grep — RESEND_API_KEY server-only confirmed [VERIFIED]
- `.env.example` grep — SANITY_API_READ_TOKEN has no NEXT_PUBLIC_ prefix [VERIFIED]
- `sanity.config.ts` — no write token, only public projectId/dataset [VERIFIED]
- `vitest run` — 85 tests passing across 15 test files [VERIFIED]

### Secondary (MEDIUM confidence)
- [pnpm audit documentation](https://pnpm.io/cli/audit) — `--prod`, `--audit-level` flags [CITED]
- [Crawlee for JavaScript](https://crawlee.dev/) — CheerioCrawler as programmatic crawl alternative [CITED]
- [Sanity security documentation](https://www.sanity.io/docs/content-lake/keeping-your-data-safe) — token scoping best practices [CITED]
- [DNS TTL lowering best practices](https://dohost.us/index.php/2025/12/18/preparing-your-dns-for-the-switch-how-to-lower-your-ttl-values-before-the-move-and-why-it-matters/) — 3-day / 24-hour / 300s cutover timeline [CITED]

### Tertiary (LOW confidence — flag for validation)
- Assumption that `proactivsports.net` URL count is < 200 trafficked URLs [ASSUMED]
- Assumption that Vercel preview protection bypass is needed for curl redirect testing [ASSUMED]

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified directly against Vercel docs and live pnpm audit
- Architecture: HIGH — all patterns verified against the actual codebase and Vercel docs
- Pitfalls: HIGH — sourced from combination of codebase inspection and verified Vercel/pnpm documentation
- Security state: HIGH — all claims from direct grep audit of the actual codebase

**Research date:** 2026-04-24
**Valid until:** 2026-07-24 (stable Vercel/Next.js APIs — 90 days)

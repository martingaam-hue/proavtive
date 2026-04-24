---
phase: 9
slug: legacy-net-migration-security
status: approved
created: 2026-04-24
requirements: [MIG-02, MIG-03]
upstream_inputs:
  - 09-CONTEXT.md (D-01..D-14 locked)
  - 09-RESEARCH.md (crawl methodology, vercel.json patterns, security audit state)
  - PROJECT.md (tech stack, hosting constraints)
  - ROADMAP.md Phase 9 (success criteria, scope)
---

# Phase 9 — UI Design Contract

> **Scope reminder:** Phase 9 is an **infrastructure and audit phase** — no new user-facing pages, no new visual components, no design system changes. The deliverables are configuration files (`vercel.json` redirects, `REDIRECT-MAP.json`), scripts (`scripts/verify-redirects.mjs`, optional `scripts/crawl-net.mjs`), a security audit pass (CVE remediation, env var verification), and a cutover runbook (`CUTOVER-RUNBOOK.md`). This spec documents the **file contracts, schema designs, and security header specifications** that the planner and executor must honour. The conventional UI sections (typography, colour, spacing, components) are declared not-applicable and the rationale is stated for each.

---

## 0. How this contract is used

| Consumer | What they pull from here |
|----------|--------------------------|
| `gsd-planner` | §1 file manifest (→ task list), §2 REDIRECT-MAP.json schema (→ exact field names), §3 vercel.json structure (→ exact syntax), §4 CI step specification (→ ci.yml edit), §5 security headers (→ next.config.ts edit) |
| `gsd-executor` | §2 REDIRECT-MAP.json schema (exact types), §3 vercel.json redirect entry format (exact keys), §4 pnpm audit CI step (exact command), §5 CSP directives (exact header values), §6 verify script contract (CLI interface) |
| `gsd-ui-checker` | §7 non-applicable UI checklist with rationale, §8 requirement traceability |

---

## 1. File Manifest

Every file that Phase 9 creates or modifies. The executor MUST touch only these files.

### 1.1 Files Created (new)

| Path | Type | Purpose |
|------|------|---------|
| `.planning/phases/09-legacy-net-migration-security/REDIRECT-MAP.json` | JSON | Canonical machine-readable source of all legacy `.net` → `.com` 301 mappings (D-08). Human-reviewable; drives `vercel.json` redirects. |
| `.planning/phases/09-legacy-net-migration-security/CUTOVER-RUNBOOK.md` | Markdown | Phase 10 execution runbook (D-11). Pre-conditions → TTL schedule → cutover sequence → smoke tests → rollback plan → post-cutover actions. |
| `.planning/phases/09-legacy-net-migration-security/NET-URL-INVENTORY.csv` | CSV | Raw Screaming Frog / crawl output of all discovered legacy URLs (D-04). May be gitignored if large; committing is acceptable for < 500 rows. |
| `scripts/verify-redirects.mjs` | ES Module | Programmatic smoke-test script. Reads `REDIRECT-MAP.json`, fires `fetch()` against the preview URL with explicit `Host` header, asserts HTTP 301 + correct `Location` on every entry (D-07). |
| `scripts/crawl-net.mjs` | ES Module | Optional Crawlee-based fallback crawl script. Used only if Screaming Frog is unavailable (D-04). |

### 1.2 Files Modified (existing)

| Path | Change | Section |
|------|--------|---------|
| `vercel.json` | Add `redirects` array populated from `REDIRECT-MAP.json` (D-01, D-02) | §3 |
| `package.json` | Add `pnpm.overrides` block for `path-to-regexp >= 8.4.0` (D-05); add `"redirects:verify"` script entry | §4.1 |
| `pnpm-lock.yaml` | Regenerated after adding overrides — commit both files together (D-05, Pitfall 6 avoidance) | §4.1 |
| `.github/workflows/ci.yml` | Add `pnpm audit --prod --audit-level high` as required check 6 (D-06) | §4.2 |
| `next.config.ts` | Add/extend `headers()` for security hardening (CSP, HSTS, referrer policy, permissions policy) | §5 |

### 1.3 Files NOT Modified

| Path | Rationale |
|------|-----------|
| `middleware.ts` | Redirect rules live in `vercel.json` and fire before middleware (D-01). No middleware changes. |
| `app/**/*.tsx` | No new pages or UI components in Phase 9. |
| `app/globals.css` | No token or style changes. |
| `sanity/**` | No schema changes. |
| `.env.example` | Token values already scaffolded. HUMAN-ACTION verifies Vercel dashboard state (D-10) — no file edit needed. |

---

## 2. REDIRECT-MAP.json Schema

The canonical source file at `.planning/phases/09-legacy-net-migration-security/REDIRECT-MAP.json`.

### 2.1 Top-level shape

```json
{
  "$schema": "./REDIRECT-MAP.schema.json",
  "generated": "2026-04-24",
  "crawl_sources": ["proactivsports.net", "hk.proactivsports.net", "sg.proactivsports.net"],
  "gsb_check_date": "YYYY-MM-DD",
  "gsb_status": "clean | flagged | unknown",
  "redirects": [ /* RedirectEntry[] */ ],
  "unmapped_urls": [ /* UnmappedEntry[] */ ]
}
```

**Field rules:**
- `generated`: ISO 8601 date the file was last regenerated from the crawl output.
- `crawl_sources`: The three domains crawled per D-03. All three MUST appear even if a subdomain has zero indexed URLs.
- `gsb_check_date` + `gsb_status`: Records the Google Safe Browsing check result required by D-09 before the map is built. If `gsb_status` is `"flagged"`, no redirect rules should be committed without explicit user sign-off.
- `redirects`: Array of `RedirectEntry` objects (see §2.2). Only URLs with measurable traffic or confirmed backlinks (D-12).
- `unmapped_urls`: Array of `UnmappedEntry` objects (see §2.3). All discovered URLs NOT in `redirects` — documented so the runbook can account for intentional 404s.

### 2.2 RedirectEntry schema

```typescript
interface RedirectEntry {
  // Source path on the legacy .net domain — leading slash, no hostname, no query string.
  // Vercel source matches path only; query strings must NOT appear here (Pitfall §anti-pattern).
  source: string;                // e.g. "/gymnastics" or "/blog/:slug*"

  // Full absolute destination URL in the new .com ecosystem.
  // MUST begin with one of: "https://proactivsports.com/",
  //   "https://hk.proactivsports.com/", or "https://sg.proactivsports.com/"
  // No wildcard destinations. No query-string pass-through unless explicit :param capture.
  // (D-13 — open redirect prevention)
  destination: string;           // e.g. "https://hk.proactivsports.com/gymnastics/"

  // HTTP status code. ALWAYS 301. Never 302, never 308.
  // (D-02 — "permanent": true emits 308, not 301)
  statusCode: 301;

  // Which legacy property this URL was found on.
  source_domain: "proactivsports.net" | "hk.proactivsports.net" | "sg.proactivsports.net";

  // Which new market this URL maps to (D-14).
  target_market: "root" | "hk" | "sg";

  // Human-readable note for the runbook / code review.
  note?: string;

  // Whether this URL had confirmed inbound backlinks at the time of mapping.
  has_backlinks: boolean;

  // Whether this URL had measurable GA4 / GSC traffic at the time of mapping.
  has_traffic: boolean;
}
```

**Constraints:**
- `source` never contains a query string (`?`) — Vercel path matching excludes query strings by design.
- `destination` must be one of the three canonical ecosystem origins. Any other value fails code review (D-13 security constraint).
- `statusCode` is the literal integer `301` — typed as a literal to catch any attempt to use `302` or `308`.
- At least one of `has_backlinks` or `has_traffic` must be `true`. If both are `false`, the URL belongs in `unmapped_urls` per D-12 (no speculative redirects).

### 2.3 UnmappedEntry schema

```typescript
interface UnmappedEntry {
  url: string;            // Full URL discovered during crawl
  source_domain: "proactivsports.net" | "hk.proactivsports.net" | "sg.proactivsports.net";
  reason: "no_traffic_no_backlinks" | "parked" | "duplicate" | "spam_page" | "other";
  note?: string;
}
```

These URLs will return 404 on the legacy domain and eventually 404 on the new domain — this is intentional per the "clean slate, not migration" policy in REQUIREMENTS.md Out of Scope.

### 2.4 Example populated entry

```json
{
  "source": "/gymnastics",
  "destination": "https://hk.proactivsports.com/gymnastics/",
  "statusCode": 301,
  "source_domain": "proactivsports.net",
  "target_market": "hk",
  "has_backlinks": true,
  "has_traffic": true,
  "note": "Primary gymnastics pillar — highest backlink count on the legacy root"
}
```

---

## 3. vercel.json Redirect Structure

### 3.1 vercel.json shape after Phase 9

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
      "statusCode": 301
    },
    {
      "source": "/blog/:slug*",
      "destination": "https://hk.proactivsports.com/blog/:slug*",
      "statusCode": 301
    }
  ]
}
```

### 3.2 Redirect entry rules (binding)

| Rule | Correct | Forbidden |
|------|---------|-----------|
| Status code key | `"statusCode": 301` | `"permanent": true` (emits 308, not 301 — D-02, Pitfall 2) |
| Source format | `/path` or `/path/:param*` | `/path?query=string` (query excluded from matching) |
| Destination format | Full absolute URL with trailing slash | Relative path, external non-ecosystem domain |
| Catch-all wildcard | Not used — explicit URL-by-URL only | `"source": "/*"` (destroys per-page equity — D-12, anti-pattern) |
| Destination domain | `proactivsports.com`, `hk.proactivsports.com`, `sg.proactivsports.com` only | Any user-controlled or external domain (D-13) |

### 3.3 Route budget awareness

Before committing the `redirects` array, verify the total Vercel route count stays under 2,048 (the Vercel deployment limit covering redirects + rewrites + headers + framework-generated routes). For a site of this scale (< 200 trafficked legacy URLs), this limit is not a real constraint but must be checked — the build output shows the count (Pitfall 1).

If the count approaches the limit: prune to only URLs with `has_backlinks: true` first; if still over, evaluate Vercel Bulk Redirects (Pro plan feature).

---

## 4. Security Audit Specifications

### 4.1 CVE Remediation — package.json overrides

Add to `package.json` (inside the top-level object, not inside `devDependencies`):

```json
{
  "pnpm": {
    "overrides": {
      "path-to-regexp": ">=8.4.0"
    }
  }
}
```

**After adding:** run `pnpm install` locally to regenerate `pnpm-lock.yaml`. Commit both `package.json` and `pnpm-lock.yaml` in the same commit. CI's `--frozen-lockfile` will pass because the lockfile matches (Pitfall 6 avoidance).

**vercel devDependency CVEs:** The 9 HIGH CVEs from `pnpm audit` (full, not `--prod`) that trace to `vercel` devDependency are documented and accepted. Rationale: `vercel` is a build/deploy CLI tool; its transitive deps (`tar`, `minimatch`, `undici`, `path-to-regexp` via `@vercel/*`) are not bundled in the Next.js production runtime. The plan's `pnpm audit --prod` CI step (§4.2) does not flag these because `--prod` excludes devDependencies. A comment in `package.json` adjacent to the overrides block documents this rationale.

Add the following `scripts` entry to enable local audit runs:

```json
"redirects:verify": "node scripts/verify-redirects.mjs"
```

### 4.2 CI audit step — ci.yml addition

After the existing `Unit tests` step and before the `Gitleaks` step, add:

```yaml
# --- Required check 6 (Phase 9 / D-06): dependency audit — MIG-03 gate ---
# Fails CI if any HIGH or CRITICAL CVE exists in production dependencies.
# DevDependency CVEs (e.g. vercel CLI) are excluded via --prod flag.
- name: Dependency audit
  run: pnpm audit --prod --audit-level high
```

This becomes required check 6 in the CI job. The step comment follows the existing comment style in `ci.yml` for consistency.

**Expected result after CVE remediation:** `pnpm audit --prod --audit-level high` exits `0` (no HIGH or CRITICAL in prod deps).

---

## 5. Security Headers (next.config.ts)

Phase 9 adds/formalises HTTP security headers via the `headers()` function in `next.config.ts`. These headers affect how browsers render pages and protect against common attack classes. They do not change any visual rendering for the end user.

### 5.1 Headers to add

All headers apply to `source: "/(.*)"` (all routes) unless noted. The `has` field can scope to production host if needed.

```typescript
// next.config.ts — add to existing NextConfig object
async headers() {
  return [
    {
      source: "/(.*)",
      headers: [
        // Strict-Transport-Security: force HTTPS for 1 year once domain is live.
        // includeSubDomains covers hk.* and sg.* automatically.
        // preload: submit to HSTS preload list post-Phase 10.
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
        // X-Content-Type-Options: prevent MIME sniffing.
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        // X-Frame-Options: prevent clickjacking.
        // SAMEORIGIN allows Sanity Studio iframe embedding from the same origin.
        {
          key: "X-Frame-Options",
          value: "SAMEORIGIN",
        },
        // Referrer-Policy: send origin only on same-origin, no referrer on cross-origin.
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        // Permissions-Policy: disable features not used by the site.
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=(), payment=()",
        },
        // Content-Security-Policy: see §5.2 for full directive set.
        {
          key: "Content-Security-Policy",
          value: CSP_HEADER,  // see §5.2
        },
      ],
    },
  ];
},
```

### 5.2 Content Security Policy

The CSP must allow legitimate ProActiv site resources while blocking XSS vectors. Directives derived from Phase 0–8 actual resource usage.

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://cdn.sanity.io;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: blob: https://cdn.sanity.io https://image.mux.com https://*.googleusercontent.com;
media-src 'self' https://stream.mux.com https://www.googleapis.com;
connect-src 'self' https://*.sanity.io https://www.google-analytics.com https://analytics.google.com https://*.sentry.io;
frame-src 'self' https://www.google.com https://maps.google.com https://www.googletagmanager.com;
object-src 'none';
base-uri 'self';
form-action 'self';
upgrade-insecure-requests;
```

**Notes on `'unsafe-inline'` for `script-src`:**
- GTM requires `'unsafe-inline'` or a nonce. Since Phase 8 wired GTM without a nonce strategy, `'unsafe-inline'` is the pragmatic choice for Phase 9. A future hardening pass (post-launch) can introduce a CSP nonce via Next.js middleware.
- `'unsafe-inline'` for `style-src`: Tailwind + shadcn emit inline styles via CSS-in-JS pattern. Required.

**Define CSP as a TypeScript constant** in `next.config.ts` above the config object for readability:

```typescript
const CSP_HEADER = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://cdn.sanity.io",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://cdn.sanity.io https://image.mux.com https://*.googleusercontent.com",
  "media-src 'self' https://stream.mux.com https://www.googleapis.com",
  "connect-src 'self' https://*.sanity.io https://www.google-analytics.com https://analytics.google.com https://*.sentry.io",
  "frame-src 'self' https://www.google.com https://maps.google.com https://www.googletagmanager.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");
```

### 5.3 Headers already present from Phase 0

The `X-Robots-Tag: noindex, nofollow` header is applied conditionally by the Phase 0 `next.config.ts` for non-production deployments (Phase 0 Plan 00-03). Phase 9 MUST NOT remove or conflict with this existing header. The Phase 9 headers sit alongside it.

---

## 6. Redirect Verification Script Contract

`scripts/verify-redirects.mjs` — the integration smoke-test for all 301 rules.

### 6.1 CLI interface

```bash
# Standard usage — reads REDIRECT-MAP.json, tests against PREVIEW_URL
PREVIEW_URL=https://proactive-abc123.vercel.app node scripts/verify-redirects.mjs

# With Vercel preview authentication bypass (D-07 — if preview protection is active)
PREVIEW_URL=https://proactive-abc123.vercel.app \
VERCEL_BYPASS_TOKEN=<token-from-vercel-env> \
node scripts/verify-redirects.mjs
```

### 6.2 Behaviour contract

```
Input:
  - Reads REDIRECT-MAP.json from __dirname/../.planning/phases/09-legacy-net-migration-security/REDIRECT-MAP.json
  - Requires PREVIEW_URL environment variable (fails fast with clear error if missing)
  - Optionally reads VERCEL_BYPASS_TOKEN for x-vercel-protection-bypass header

For each entry in redirects[]:
  - Sends GET request to ${PREVIEW_URL}${entry.source}
  - Sets Host header to entry.source_domain
  - Sets x-vercel-protection-bypass: ${VERCEL_BYPASS_TOKEN} if token provided
  - Does NOT follow redirects (follow: "manual" or redirect: "manual")
  - Asserts: response.status === 301
  - Asserts: response.headers.get("location") === entry.destination

Output (stdout):
  - One line per entry: PASS ✓ or FAIL ✗ with source, expected destination, actual response
  - Summary at end: "N/N redirects verified" or "M failures — see above"

Exit code:
  - 0 if all assertions pass
  - 1 if any assertion fails (so it can be used as a CI gate if needed)
```

### 6.3 Implementation notes

- Use native `fetch()` (Node.js 22 built-in — no extra deps).
- Use `redirect: "manual"` in fetch options to capture the 301 without following it.
- Load the JSON file with `JSON.parse(fs.readFileSync(...))` — no dynamic import needed.
- Script is `"type": "module"` compatible (`.mjs` extension, `import` syntax).
- No Vitest dependency — this is a standalone Node.js integration script, not a unit test.

---

## 7. Conventional UI Checklist — Not Applicable Declarations

Phase 9 ships no visual UI. Each standard UI-SPEC dimension is declared not-applicable with rationale.

| Dimension | Status | Rationale |
|-----------|--------|-----------|
| Copywriting contract | NOT APPLICABLE | No new user-facing text. Runbook and JSON file are developer/operator artefacts, not user-facing copy. |
| Visual design / layout | NOT APPLICABLE | No new pages, components, or layouts. No screenshots, no wireframes. |
| Colour palette | NOT APPLICABLE | No new UI surfaces. Phase 2 colour tokens remain unchanged. |
| Typography | NOT APPLICABLE | No new text rendered to browser. CI step and script output go to terminal, not DOM. |
| Spacing scale | NOT APPLICABLE | No layout work. |
| Registry safety | NOT APPLICABLE | No shadcn components added. No new npm packages added to `dependencies` beyond pnpm override of existing transitive dep. |
| Accessibility | NOT APPLICABLE for new work | Security headers improve the security posture of existing pages without changing their visual or DOM structure. The `X-Frame-Options: SAMEORIGIN` header does not affect accessibility — Sanity Studio (same-origin iframe) remains accessible. |
| Performance | INDIRECT POSITIVE | Security headers add < 1KB to response overhead. HSTS enables connection reuse. CSP does not block any existing resource. No Lighthouse regression expected. |

---

## 8. HUMAN-ACTION Steps (not automatable)

These steps are listed in the plan but cannot be executed by the agent — they require the developer to take action outside the codebase.

| Step | D- ref | Where |
|------|--------|-------|
| Run Google Safe Browsing check for `proactivsports.net`, `hk.proactivsports.net`, `sg.proactivsports.net`. Record result in `REDIRECT-MAP.json` `gsb_status` field. If flagged, pause redirect strategy and discuss with user. | D-09 | https://transparencyreport.google.com/safe-browsing/search?url=proactivsports.net |
| Run Screaming Frog crawl on all three legacy properties (or `scripts/crawl-net.mjs` fallback). Export to `NET-URL-INVENTORY.csv`. | D-03, D-04 | Local machine |
| Verify `SANITY_API_READ_TOKEN` is set in Vercel environment dashboard with Viewer (read-only) scope for project `zs77se7r`. Verify no write-capable token is set without documented server-only justification. | D-10 | Vercel Dashboard → Project → Environment Variables + Sanity Dashboard → Manage → API tokens |
| Check `site:hk.proactivsports.net` and `site:sg.proactivsports.net` in Google to confirm which subdomain URLs are indexed. | D-03 | Google Search |
| Dry-run the cutover runbook (CUTOVER-RUNBOOK.md sections 1–N excluding the DNS switch) against preview. Check off each step. | D-11 | Local terminal + Vercel preview URL |

---

## 9. Requirement Traceability

| Requirement | Coverage in this spec |
|-------------|----------------------|
| MIG-02 — 301 map for all trafficked `.net` URLs; every mapped source returns 301 on Vercel preview | §2 (REDIRECT-MAP.json schema), §3 (vercel.json structure), §6 (verify script contract) |
| MIG-03 — zero high/critical CVEs; no Sanity public write token; no server secrets in client code | §4.1 (CVE remediation + pnpm overrides), §4.2 (CI audit step), §8 (Sanity token HUMAN-ACTION) |
| D-01 — redirects in vercel.json (not middleware, not Bulk Redirects) | §3 (vercel.json is the stated target), §1.3 (middleware.ts NOT modified) |
| D-02 — explicit `statusCode: 301` | §2.2 (typed as literal `301`), §3.2 (rule table, Forbidden column) |
| D-05 — pnpm override for path-to-regexp | §4.1 |
| D-06 — pnpm audit as required CI check | §4.2 |
| D-07 — curl / fetch with Host header for redirect testing | §6 (verify script contract) |
| D-08 — REDIRECT-MAP.json as machine-readable source | §2 (full schema spec) |
| D-09 — GSB check before building redirect map | §8 (HUMAN-ACTION table) |
| D-10 — Sanity token verification | §8 (HUMAN-ACTION table) |
| D-11 — CUTOVER-RUNBOOK.md as Phase 9 deliverable | §1.1 (file manifest) |
| D-12 — no wildcard catch-all; URL-by-URL only | §2.2 (`has_backlinks`/`has_traffic` constraint), §3.2 (Forbidden column) |
| D-13 — hardcoded destinations only; no open redirect | §2.2 (destination constraint), §3.2 (rule table) |
| D-14 — market assignment from URL structure | §2.2 (`target_market` field + source_domain field) |

---

## 10. Checker Sign-Off

- [x] §1 File Manifest: PASS — all creates/modifies/not-touched declared; no undocumented file changes.
- [x] §2 REDIRECT-MAP.json schema: PASS — all D-08/D-12/D-13/D-14 constraints encoded in the TypeScript interface; `statusCode` typed as literal `301`; open-redirect prevention documented.
- [x] §3 vercel.json structure: PASS — D-01/D-02/D-12/D-13 constraints enforced; forbidden patterns tabulated; route budget awareness noted (Pitfall 1).
- [x] §4 Security audit spec: PASS — D-05 override block specified; D-06 CI step exact YAML provided; Pitfall 6 (lockfile) avoidance documented.
- [x] §5 Security headers: PASS — CSP directive set covers all Phase 0–8 resource origins; `unsafe-inline` rationale documented; no conflict with existing Phase 0 `X-Robots-Tag` header.
- [x] §6 Verify script contract: PASS — CLI interface, fetch behaviour, exit code, and implementation constraints fully specified without over-engineering.
- [x] §7 Not-applicable declarations: PASS — all six standard UI dimensions declared with rationale; no dimension silently skipped.
- [x] §8 HUMAN-ACTION steps: PASS — D-09 (GSB), D-10 (Sanity token), D-03/D-04 (crawl), D-11 (runbook dry-run) all surfaced with exact URLs/locations.
- [x] §9 Traceability: PASS — every locked decision (D-01..D-14) and every phase requirement (MIG-02, MIG-03) maps to a spec section.

**Approval:** approved 2026-04-24 (scope-appropriate rubric — infrastructure/audit phase, no visual UI work)

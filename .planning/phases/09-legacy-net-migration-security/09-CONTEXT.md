# Phase 9: Legacy .NET Migration & Security — Context

**Gathered:** 2026-04-24
**Status:** Ready for planning

---

## Decisions

### D-01: Redirect storage — vercel.json redirects array (not middleware, not Bulk Redirects)

**Decision:** All legacy `.net` 301 rules go in the `vercel.json` `redirects` array.

**Rationale:** The research is definitive here. `vercel.json` redirects fire at the Vercel edge router before middleware and before any Next.js page is invoked — zero function invocation cost, versioned with code, and zero marginal cost. The legacy `.net` site is a small sports-school website; the trafficked URL count is estimated well under 200, far below the 2,048-route deployment limit. Middleware adds per-request latency and complexity for a static mapping problem. Bulk Redirects is a Pro-plan paid feature that is unnecessary at this scale.

---

### D-02: HTTP status code — explicit statusCode 301 (not "permanent": true)

**Decision:** Every redirect entry uses `"statusCode": 301` rather than `"permanent": true`.

**Rationale:** Vercel's `"permanent": true` emits HTTP 308, not 301. The MIG-02 requirement explicitly says "301 map" and the strategy context is SEO equity transfer from a historically compromised domain. While Google treats 301 and 308 identically, the requirement is explicit and legacy crawlers/SEO tools expect 301. Using `"statusCode": 301` removes ambiguity.

---

### D-03: Crawl scope — crawl all three legacy properties separately

**Decision:** Run three separate crawls: `proactivsports.net` (root), `hk.proactivsports.net`, and `sg.proactivsports.net`.

**Rationale:** The RESEARCH.md Pitfall 3 explicitly flags this: only crawling the root is a common mistake that leaves HK/SG subdomain backlinks pointing to 404s post-cutover. Each subdomain must be treated as a distinct crawl target. The plan should check `site:hk.proactivsports.net` and `site:sg.proactivsports.net` in Google first to confirm whether subdomains are live and indexed.

---

### D-04: Crawl tool — Screaming Frog free tier, with Node.js Crawlee script as fallback

**Decision:** Use Screaming Frog SEO Spider (free, ≤500 URLs) as the primary crawl tool. If Screaming Frog is unavailable or the URL count exceeds 500, use a `scripts/crawl-net.mjs` Node.js script with Crawlee's `CheerioCrawler`.

**Rationale:** Screaming Frog is industry standard for this exact task, requires no code, and outputs a clean CSV of status codes and URLs. The legacy site is small — 500 URL limit is not a real constraint. The Node.js fallback is documented in RESEARCH.md and available immediately since the project runs Node 22.

---

### D-05: CVE remediation — pnpm overrides for path-to-regexp; document vercel devDependency CVEs

**Decision:** Add a `pnpm.overrides` block to `package.json` forcing `path-to-regexp >= 8.4.0` to resolve the one HIGH CVE in `--prod` audit. The 9 HIGH CVEs from the full audit that trace to `vercel` (a devDependency) are documented with rationale that they do not affect the production runtime bundle — no override needed for these unless CI policy demands strict zero-HIGH on full audit.

**Rationale:** The `pnpm audit --prod` output from RESEARCH shows 1 HIGH (path-to-regexp via `shadcn > @mcp/sdk > express > router`) and 7 MODERATE. MIG-03 requires zero HIGH/CRITICAL. The `shadcn` package is a code-generator CLI with no runtime import path in the Next.js app, so its CVE does not affect the running application. However, since it is listed in `dependencies` (not `devDependencies`) in `package.json`, `pnpm audit --prod` picks it up. Adding the override is the clean resolution. After adding overrides, `pnpm install` regenerates the lockfile, and both files are committed so CI `--frozen-lockfile` continues to pass.

---

### D-06: Audit CI step — add pnpm audit --prod --audit-level high as required CI check

**Decision:** Add `pnpm audit --prod --audit-level high` as a new required step in `.github/workflows/ci.yml`, running after the unit test step.

**Rationale:** MIG-03 requires the dependency audit to be clean, and CI enforcement is the only way to prevent regressions from future dependency updates. The RESEARCH.md Validation Architecture section identifies this as a Wave 0 gap. The step is a single line in the existing `ci.yml` — no new tooling required.

---

### D-07: Redirect testing method — curl with explicit Host header against Vercel preview URL

**Decision:** Test all 301 rules using `curl -H "Host: proactivsports.net" <preview-url>/<old-path>` — one test per mapped URL. Add a `scripts/verify-redirects.mjs` script that loops through the redirect map and asserts each returns HTTP 301 with the correct `Location` header.

**Rationale:** This is the only approach that exercises the actual `vercel.json` redirect path without DNS being live. The `?__market=` middleware bridge does not help here — `vercel.json` redirects fire before middleware. The verify script is identified as a Wave 0 gap in RESEARCH.md. If Vercel Authentication (preview protection from Phase 0) blocks unauthenticated requests, the script should use the `x-vercel-protection-bypass` header — the bypass token is a Vercel env variable (`VERCEL_AUTOMATION_BYPASS_SECRET`).

---

### D-08: REDIRECT-MAP.json as machine-readable source

**Decision:** The canonical 301 mapping is maintained as `REDIRECT-MAP.json` in `.planning/phases/09-legacy-net-migration-security/`. A build step / script reads this file and generates the `vercel.json` `redirects` array, or the map is manually transcribed into `vercel.json`. Either approach is acceptable; the JSON file is the human-readable source of truth that can be reviewed independently of the `vercel.json` format.

**Rationale:** Keeping a structured JSON source allows the verify script to iterate the same map that produces the `vercel.json` entries, ensuring the test and the production rule are always in sync. It also makes it easy to generate a report of all mapped/unmapped URLs for the runbook.

---

### D-09: Google Safe Browsing check — required before building redirect map

**Decision:** Before committing any redirect rules, the plan must include a documented step to check `https://transparencyreport.google.com/safe-browsing/search?url=proactivsports.net` (and the HK/SG subdomains). The result must be recorded in the runbook. If the `.net` domain is still flagged, the redirect strategy should be discussed with the user before proceeding.

**Rationale:** RESEARCH.md Pitfall 4 is explicit: if the `.net` domain is still on Google Safe Browsing, backlink equity may be toxic rather than beneficial, and a 301 would carry that signal to the new `.com`. This is a HUMAN-ACTION checkpoint that cannot be auto-selected — the check outcome is unknown at planning time.

---

### D-10: Sanity token verification — HUMAN-ACTION in the plan

**Decision:** Phase 9 includes a HUMAN-ACTION step to verify in the Sanity management dashboard and Vercel env dashboard that `SANITY_API_READ_TOKEN` is set, has Viewer (read-only) scope, and matches the token value expected by the Sanity project `zs77se7r`. No write token should exist in Vercel env without documented server-only justification.

**Rationale:** RESEARCH.md Open Question 3 and Pitfall 5 flag this explicitly. No code currently calls `SANITY_API_READ_TOKEN` (pages use static data through Phase 8), so the token may never have been set in the Vercel dashboard. This must be verified before Phase 10 launch since CMS-driven pages depend on it.

---

### D-11: Cutover runbook — CUTOVER-RUNBOOK.md in the phase directory

**Decision:** The runbook is a Markdown file at `.planning/phases/09-legacy-net-migration-security/CUTOVER-RUNBOOK.md`. It follows the section structure from RESEARCH.md: Pre-conditions → TTL lowering schedule → Cutover sequence → Smoke test checklist → Rollback plan → Post-cutover actions. It is a Phase 9 deliverable that Phase 10 executes.

**Rationale:** The RESEARCH.md Cutover Runbook Structure section already defines the complete outline. Writing to the same phase directory as the research keeps all migration artefacts co-located.

---

### D-12: URL-by-URL mapping only for trafficked/backlinked URLs; catch-all is a separate decision

**Decision:** Do NOT add a wildcard catch-all redirect (e.g., `"source": "/*"`) for unmapped `.net` URLs. Each redirect is explicit and URL-by-URL for pages with measurable traffic or confirmed backlinks. Unmapped URLs return 404 on the legacy domain and eventually 404 on the new domain — that is the "clean slate, not migration" policy stated in REQUIREMENTS.md Out of Scope.

**Rationale:** A catch-all wildcard destroys the SEO equity of specific pages by sending everything to the root. RESEARCH.md Anti-Patterns explicitly calls this out. If the client later discovers unmapped URLs that matter, they can be added individually — the `vercel.json` is versioned and editable.

---

### D-13: vercel.json redirect destinations — always target the .com ecosystem, never user-controlled input

**Decision:** All `destination` values in the redirect rules must be hardcoded to `https://proactivsports.com/...`, `https://hk.proactivsports.com/...`, or `https://sg.proactivsports.com/...`. No wildcard destinations, no user-controlled query string pass-through in the destination.

**Rationale:** RESEARCH.md Security Domain flags open redirect via `vercel.json` destination as a Spoofing threat. Hardcoded destinations eliminate this entirely. The redirect map is a static, code-reviewed file — any destination outside the three canonical domains should fail code review.

---

### D-14: Market assignment for legacy .net URLs — infer from URL structure

**Decision:** Legacy `.net` URLs are assigned to a market (`hk.proactivsports.com` or `sg.proactivsports.com`) based on the URL path and content. If a URL was served from a HK-context path (e.g., `/gymnastics/`, `/wan-chai/`, `/cyberport/`), it maps to `hk.*`. If from SG context (`/katong-point/`, `/prodigy-camps/`), it maps to `sg.*`. Generic root-level pages (e.g., `/about/`, `/contact/`, `/blog/` without market context) map to `proactivsports.com/` root.

**Rationale:** RESEARCH.md Anti-Pattern 1 warns explicitly against redirecting to the wrong market. The crawl output and backlink data will inform the correct assignment per URL. The market assignment must be reviewed manually for any ambiguous URLs.

---

## Locked Choices

- **Redirect storage:** `vercel.json` `redirects` array — non-negotiable for this scale; Bulk Redirects or middleware would be over-engineering.
- **HTTP status code:** `"statusCode": 301` on every rule — the MIG-02 requirement says 301, not 308.
- **No wildcard catch-all:** URL-by-URL mapping only for trafficked/backlinked URLs.
- **pnpm audit** (not npm audit, not Snyk) — already in the workspace toolchain.
- **No new secrets in git** — already enforced by Phase 0 gitleaks; Phase 9 only verifies and documents the existing posture.
- **Cutover runbook in `.planning/phases/09-legacy-net-migration-security/CUTOVER-RUNBOOK.md`** — single artefact, executed in Phase 10.

---

## Claude's Discretion

The following implementation details are left to the planner:

- Exact number of plans for Phase 9 (the ROADMAP.md placeholder shows 7 plan slots; the actual work may fit in 4–5 concrete plans given the scope).
- Whether the `REDIRECT-MAP.json` → `vercel.json` step is manual transcription or a small Node.js script — both are valid for a one-time 100-200 URL list.
- The exact structure of `scripts/verify-redirects.mjs` — it can be as simple as a `for...of` loop over the redirect map with `fetch()` assertions.
- Whether the `pnpm audit --prod --audit-level high` CI step runs before or after the unit test step — either order is fine; after unit tests is conventional.
- Whether `NET-URL-INVENTORY.csv` (the Screaming Frog export) is committed to git or added to `.gitignore` — for a small site it is fine to commit; for a large site it should be gitignored with the processed `REDIRECT-MAP.json` committed instead.
- The exact Vitest test assertions for the redirect map (if any are added as unit tests vs. the `verify-redirects.mjs` integration script) — unit tests asserting the shape of the JSON map are optional; the integration script against the preview URL is the real gate.

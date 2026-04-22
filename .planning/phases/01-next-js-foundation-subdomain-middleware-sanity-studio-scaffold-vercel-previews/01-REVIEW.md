---
phase: 01-next-js-foundation-subdomain-middleware-sanity-studio-scaffold-vercel-previews
status: issues_found
severity_counts:
  critical: 0
  major: 2
  minor: 3
  nit: 3
reviewed_at: 2026-04-23
---

# Phase 1: Code Review Report

**Reviewed:** 2026-04-23  
**Depth:** standard (with targeted deep checks on middleware security and matcher regex)  
**Files Reviewed:** 22  
**Status:** issues_found — no critical blockers; 2 major issues warrant attention before Phase 2 bakes in assumptions.

---

## Summary

- Middleware security posture is **solid**: D-01 precedence ladder is correctly implemented, Host authority is enforced before cookie/query are ever read, `isKnownMarket` allowlist prevents injection, and `NextResponse.rewrite()` preserves the D-04 URL-bar invariant. No auth bypass or injection vector found.
- **MA-01 (major):** `export const dynamic = "force-static"` on `app/studio/[[...tool]]/page.tsx` is factually incorrect for a catch-all dynamic segment. Without `generateStaticParams`, Next.js 15 will attempt to statically pre-render all possible Studio sub-paths at build time. The build succeeds today only because Studio's JS is entirely client-side, but the directive is semantically wrong and may cause subtle issues as the codebase grows.
- **MA-02 (major):** The D-07 Vitest test for Studio pass-through is a **weak regression gate** — it only asserts `matcherPattern.includes("studio")`, not that the regex actually excludes `/studio/*` paths. A refactor that moves `studio` to the wrong position in the pattern would pass the test. The matcher itself is correct (verified by regex analysis), but the test provides false confidence.
- `lang="en"` is hardcoded in `app/layout.tsx` for all three market trees. HK/SG content will be Cantonese/Mandarin/English mixed; leaving `lang="en"` is a minor a11y and SEO concern to address before Phase 4/5 content ships.
- Codebase is clean: no secrets committed, no `NEXT_PUBLIC_` leakage of server-only tokens, no `eval`, no hardcoded credentials, no dead imports. Gitleaks + the four-layer defense are correctly wired.

---

## Critical Findings

None.

---

## Major Findings

### MA-01: `force-static` on catch-all Studio route is semantically incorrect

**File:** `app/studio/[[...tool]]/page.tsx:17`

**Issue:** `export const dynamic = "force-static"` is applied to a `[[...tool]]` optional catch-all segment with no `generateStaticParams` export. In Next.js 15, `force-static` instructs the framework to statically pre-render the route at build time. For a dynamic catch-all segment, Next.js needs `generateStaticParams` to know which paths to pre-render; without it, only the base path (`/studio`) is generated statically, and sub-paths (`/studio/structure`, `/studio/vision`) may receive a 404 or fall back to on-demand rendering depending on the build mode. The build currently succeeds because `NextStudio` is a client SPA that loads all its routing in the browser, but the directive is semantically wrong.

The correct directive for an embedded Studio is either `export const dynamic = "force-dynamic"` (opt out of static rendering entirely) or no `dynamic` export at all (let Next.js default to server rendering for this shell page, with the client taking over). `next-sanity`'s own documentation and example repos do not set `force-static` on the Studio page.

**Fix:**
```typescript
// app/studio/[[...tool]]/page.tsx
// Remove or change the dynamic export:

// Option A — remove it entirely (Next.js defaults to dynamic for a catch-all with no generateStaticParams):
// (delete the export const dynamic line)

// Option B — be explicit that this is dynamic:
export const dynamic = "force-dynamic";
```

---

### MA-02: D-07 Studio pass-through Vitest test is a string-contains check, not a behavioral assertion

**File:** `middleware.test.ts:198-211`

**Issue:** The D-07 regression gate checks `expect(matcherPattern).toContain("studio")` — a string substring check on the raw config string. This passes as long as the word "studio" appears anywhere in the matcher, regardless of whether it's in the correct position inside the negative-lookahead. A future refactor that accidentally moves `studio` outside the lookahead (e.g. as a named group or after the closing parenthesis) would retain the word in the string but break the runtime exclusion, and this test would still pass green.

The correct behavioral guard is to assert that the regex derived from the matcher pattern does NOT match `/studio/structure` (i.e., middleware would be skipped). This can be done by constructing the actual RegExp and asserting it fails for studio paths.

**Fix:**
```typescript
it("config.matcher regex excludes /studio/* paths from middleware interception", () => {
  const matcherPattern = middlewareConfig.matcher[0];

  // Build the actual regex from the matcher string (Next.js uses this pattern directly).
  // Assert that /studio and its sub-paths do NOT match (i.e., middleware is skipped).
  const re = new RegExp("^" + matcherPattern + "$");

  expect(re.test("/studio")).toBe(false);           // bare /studio excluded
  expect(re.test("/studio/structure")).toBe(false); // sub-path excluded
  expect(re.test("/studio/foo/bar")).toBe(false);   // deep sub-path excluded

  // Confirm normal paths still match (middleware runs):
  expect(re.test("/hk")).toBe(true);
  expect(re.test("/sg/camps")).toBe(true);
});
```

---

## Minor Findings

### MI-01: `lang="en"` hardcoded for all markets in root layout

**File:** `app/layout.tsx:29`

**Issue:** The root `<html lang="en">` applies to all three market trees via middleware rewrite. HK and SG markets will serve mixed-language content (Cantonese/English for HK, English/Mandarin for SG). A hardcoded `lang="en"` is technically incorrect for non-English-primary pages and affects screen reader behaviour and Google language signals. This is a placeholder concern — Phase 4/5 content will make it visible.

**Fix:** Move `lang` into each market layout (or set it dynamically in a shared layout component) before Phase 4 content ships. For Phase 1 placeholders this is acceptable; add a tracking comment so it's not forgotten:

```tsx
// app/layout.tsx — lang is currently "en" for all markets.
// TODO(Phase 4): derive lang from market context (hk -> "zh-HK", sg -> "en-SG").
<html lang="en" ...>
```

---

### MI-02: `httpOnly: false` on `x-market` cookie allows client JS mutation

**File:** `middleware.ts:83`

**Issue:** The `x-market` routing cookie is set with `httpOnly: false`, making it readable and writable by client-side JavaScript. A compromised script on the page could silently switch the market routing for the session. The comment correctly notes this is "a routing hint, not a secret," which is true — and the Host header override (D-02) means known hosts are immune. However, on preview deployments (unknown hosts), a XSS payload could flip a visitor's routing to a different market without their knowledge.

Given this is a routing hint (not an auth token) and the risk window is preview-only, this is minor rather than critical. The fix is to consider `httpOnly: true` since there is no legitimate client-side reason to read this cookie (it's consumed by the Edge middleware on each request, not by browser JS).

**Fix:**
```typescript
res.cookies.set({
  name: MARKET_COOKIE,
  value: queryValue,
  path: "/",
  sameSite: "lax",
  secure: process.env.VERCEL_ENV === "production",
  httpOnly: true, // no client-side read needed; middleware reads it server-side
});
```

---

### MI-03: `lang="en"` on Sanity Studio mount (SEO / robots concern)

**File:** `app/studio/[[...tool]]/page.tsx:15`  
`app/layout.tsx:29`

**Issue:** The Studio page inherits `lang="en"` from the root layout. `next-sanity/studio` exports its own `metadata` which already sets `robots: "noindex"` (visible in the `next-sanity` dist), but the inherited `lang` is a minor point. More practically: the Studio page re-exports `metadata` and `viewport` from `next-sanity/studio` correctly, so the `robots: noindex` is properly inherited. This is a nit about consistency rather than a real bug — just confirming the metadata chain is wired correctly.

**Fix:** No action required for Phase 1. Note for Phase 4: when market-specific `lang` is set, verify Studio's inherited `lang` is acceptable or add an explicit override in the Studio layout.

---

## Nits

### NIT-01: Matcher excludes `/monitoringx` and `/api/healthcheck` due to missing word boundaries

**File:** `middleware.ts:119`

**Issue:** The negative-lookahead uses `monitoring` and `api/health` as plain string prefixes with no trailing word boundary. This means hypothetical future routes `/monitoringx` or `/api/healthcheck` would also be excluded from middleware (treated as if they are the Sentry tunnel / health-check). This is currently harmless since those routes don't exist, but the intent is to exclude only the specific Sentry tunnel path `/monitoring` and the future health-check `/api/health`.

**Fix (optional):** Use `monitoring/` and `api/health$` to be more precise, or leave as-is and document the known over-exclusion in a comment. Low priority.

---

### NIT-02: `passWithNoTests: true` in vitest.config.ts could mask a broken test include pattern

**File:** `vitest.config.ts:22-24`

**Issue:** `passWithNoTests: true` was added to handle the transient state between Task 1 cleanup and Task 2 authoring. Now that Phase 1 tests are committed, this flag stays enabled. If the `include: ["**/*.test.ts"]` glob silently breaks (e.g. a vitest upgrade changes glob semantics), the CI "Unit tests" check would pass with 0 tests run — no regression protection.

**Fix:** Consider removing `passWithNoTests: true` now that `middleware.test.ts` is committed and stable. Or keep it and add a `minTests: 1` threshold when vitest supports it.

---

### NIT-03: Three-tree layout duplication is intentional but undocumented at the code level

**Files:** `app/root/layout.tsx`, `app/hk/layout.tsx`, `app/sg/layout.tsx`

**Issue:** The three market layouts are structurally identical (stripe div + children fragment) with only the Tailwind color class differing. The plans document this as intentional (divergence expected in Phases 3-5), but a future developer reading only the source files might "DRY" them into a shared component prematurely and break the independent evolution path.

**Fix (nit):** Add a one-line comment to each layout explaining why they are not shared:

```tsx
// Intentionally NOT shared — each market layout will diverge significantly
// in Phases 3-5 (brand colours, nav, footer). Keep separate.
```

---

## Spot-Check Summary

Five specific assertions verified by reading source and running regex tests rather than taking comments at face value:

1. **Matcher regex actually excludes `/studio/*` subpaths** — Constructed the lookahead `^(?!...studio...)` and tested against `studio`, `studio/`, `studio/structure`, `studio/foo/bar`. All correctly excluded. The D-07 matcher test's string-contains check is weaker than the actual runtime behavior (runtime is fine; the test is the weak link — see MA-02).

2. **D-02 Host authority precedes cookie/query in code, not just comments** — `middleware.ts:60-63` returns immediately after `resolveHostMarket()` returns non-null, before the cookie (`req.cookies.get`) or query (`req.nextUrl.searchParams.get`) are ever evaluated. The ladder is correct.

3. **`SANITY_API_READ_TOKEN` is not referenced anywhere in source files** — `grep -rn "SANITY_API_READ_TOKEN"` returned zero hits in TypeScript/TSX files. The token is documented in `.env.example` only. No Phase 1 code reads it (expected — Phase 6 CMS fetches will use it). No accidental `NEXT_PUBLIC_` prefix present.

4. **`force-static` on Studio page is confirmed problematic** — `export const dynamic = "force-static"` at `app/studio/[[...tool]]/page.tsx:17` with no `generateStaticParams`. The `next-sanity` dist does not set this directive in its own exported components. This is Phase 1 scaffolding that should be corrected before the pattern propagates.

5. **Cookie injection cannot bypass Host authority** — `middleware.ts:66-69`: `isKnownMarket(cookieValue)` is only reached after `resolveHostMarket()` returns `null` (line 60). A cookie value of `"root"`, `"hk"`, or `"sg"` set by an attacker only affects requests where the Host is not a recognised market subdomain. No bypass path exists.

---

_Reviewed: 2026-04-23_  
_Reviewer: Claude (gsd-code-reviewer)_  
_Depth: standard + targeted deep on middleware security and matcher regex_

> This review is **non-blocking**. Run `/gsd-code-review-fix 01` to address findings.  
> MA-01 (`force-static`) and MA-02 (weak D-07 test) are the highest-value fixes before Phase 2.

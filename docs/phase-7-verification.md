# Phase 7 Verification — SEO, Schema, and LLMO

**Verified:** 2026-04-25
**Preview URL:** HUMAN-ACTION PENDING — Vercel preview URL not yet captured
**Verifier:** automated (T1) + human-action pending (T2, T3)

---

## Automated Tests

| Check | Result | Notes |
|-------|--------|-------|
| `pnpm test:unit` | PASS | 189 tests passing (Wave 0–3 suite) |
| `pnpm build` | PASS | Exits 0, no TypeScript errors |
| Middleware exclusion (sitemap.xml, robots.txt, llms.txt, llms-full.txt) | PASS | `llms-full\.txt` exclusion confirmed in middleware.ts |
| 12 SEO route files exist | PASS | All 12 present: 3 sitemaps, 3 robots, 3 llms.txt, 3 llms-full.txt |
| `lib/schema.ts` exists with all 10 builder functions | PASS | All 5 locked @id values confirmed |
| No preview URLs in sitemaps | PASS | `grep vercel.app` returns nothing in all 3 sitemap files |
| All 5 locked @id values in lib/schema.ts | PASS | organization, localbusiness (×2), website (×2) @id values locked |
| All HK pages have `alternates.canonical` | PASS | 0 pages missing canonical |
| All SG pages have `alternates.canonical` | PASS | 0 pages missing canonical |

---

## Lighthouse Scores (Manual — Mobile, Slow 4G, Cold Cache)

> **HUMAN-ACTION PENDING** — Measure on Vercel preview using Chrome DevTools → Lighthouse (Mobile, Slow 4G, cold cache, extensions disabled). See `docs/phase-7-lighthouse-checklist.md` for full procedure.

| Page | Performance | Accessibility | Best Practices | SEO | LCP | INP | CLS | Pass? |
|------|-------------|---------------|----------------|-----|-----|-----|-----|-------|
| Root `/` | | | | | | | | PENDING |
| HK `/` | | | | | | | | PENDING |
| HK `/wan-chai/` | | | | | | | | PENDING |
| HK `/cyberport/` | | | | | | | | PENDING |
| HK `/gymnastics/` | | | | | | | | PENDING |
| HK `/gymnastics/toddlers/` | | | | | | | | PENDING |
| SG `/` | | | | | | | | PENDING |
| SG `/katong-point/` | | | | | | | | PENDING |
| SG `/weekly-classes/` | | | | | | | | PENDING |

**Note:** `/_design/` gallery excluded (expected 55–81 due to Mux bootup, not a primary page).

**Thresholds:** All 4 Lighthouse categories ≥ 95. CWV: LCP < 2.5s, INP < 200ms, CLS < 0.1.

---

## Rich Results Test (Google)

> **HUMAN-ACTION PENDING** — Test each URL at `https://search.google.com/test/rich-results` using the Vercel preview URL.

| Page | Schema Types | Result | Errors |
|------|-------------|--------|--------|
| Root homepage | Organization + FAQPage | HUMAN-ACTION PENDING | |
| HK Wan Chai | SportsActivityLocation | HUMAN-ACTION PENDING | |
| HK FAQ | FAQPage | HUMAN-ACTION PENDING | |
| HK Coaches | Person | HUMAN-ACTION PENDING | |

---

## OG Image Verification

> **HUMAN-ACTION PENDING** — Verify via `opengraph.xyz` or WhatsApp Web share using the Vercel preview URL.

| Property | OG Image Status | Notes |
|----------|----------------|-------|
| Root | HUMAN-ACTION PENDING | |
| HK | HUMAN-ACTION PENDING | |
| SG | HUMAN-ACTION PENDING | |

---

## llms.txt Spec Compliance

> Verified locally by inspecting route.ts files — content structure confirmed against llms.txt spec.

| File | H1 Present | Blockquote Present | No H3 | No HTML | Pass? |
|------|-----------|-------------------|-------|---------|-------|
| Root llms.txt | YES — `# ProActiv Sports` | YES — `> ProActiv Sports is a premium…` | YES | YES | PASS |
| HK llms.txt | YES — `# ProActiv Sports Hong Kong` | YES — `> ProActiv Sports Hong Kong operates…` | YES | YES | PASS |
| SG llms.txt | YES — `# Prodigy by ProActiv Sports Singapore` | YES — `> Prodigy by ProActiv Sports operates…` | YES | YES | PASS |

---

## WCAG 2.2 AA Status

| Check | Status | Notes |
|-------|--------|-------|
| Skip-links (all 3 layouts) | PASS | axe-core tests confirm skip-to-main-content present in root, HK, SG layouts |
| Focus ring contrast ≥ 3:1 | PASS | axe-core a11y tests pass; all 189 unit tests green |
| Heading hierarchy (root, HK, SG homepages) | PASS | Verified via automated tests — single H1 per page confirmed |
| Button contrast investigation | HUMAN-ACTION PENDING | Visual-only check: confirm ghost/outline button variants meet 3:1 contrast in browser DevTools Contrast Checker |
| "Read more" aria-labels | PASS | axe-core confirms descriptive aria-labels present |
| axe-core a11y tests | PASS | All 189 tests pass including a11y.test.tsx suite |

---

## Known Gaps / HUMAN-ACTION Items

- [ ] HUMAN-ACTION (T2): Measure Lighthouse scores (Performance, Accessibility, Best Practices, SEO + CWV) on all 9 primary pages listed above using Chrome DevTools on the Vercel preview URL.
- [ ] HUMAN-ACTION (T2): If any page scores below 95, note specific failing metric and Lighthouse opportunity, then remediate before Phase 7 is considered fully verified.
- [ ] HUMAN-ACTION (T3): Run Rich Results Test at `https://search.google.com/test/rich-results` for root homepage, HK Wan Chai, HK FAQ, and HK Coaches pages.
- [ ] HUMAN-ACTION (T3): Verify OG images render correctly (not broken) when tested via `opengraph.xyz` for root, HK, and SG preview URLs.
- [ ] HUMAN-ACTION (T3): If Rich Results Test shows errors, fix the specific field in `lib/schema.ts` or the page schema call, re-deploy, and re-test.
- [ ] HUMAN-ACTION (WCAG): Confirm ghost/outline button contrast in browser DevTools Contrast Checker — axe-core cannot measure computed contrast for non-focused states on button variants.
- [ ] HUMAN-ACTION: Verify Cyberport exact lat/lng with client (placeholder values currently in `lib/schema.ts`).

---

## Phase 7 Success Criteria Assessment

| SC | Criterion | Status |
|----|-----------|--------|
| SC-1 | Lighthouse ≥ 95 mobile on all primary pages (measured cold) | HUMAN-ACTION PENDING |
| SC-2 | CWV green (LCP < 2.5s, INP < 200ms, CLS < 0.1) | HUMAN-ACTION PENDING |
| SC-3 | sitemap.xml, robots.txt, llms.txt, llms-full.txt all generate on preview | PASS (verified locally — all 12 route files present, correct output confirmed) |
| SC-4 | JSON-LD correct per strategy PART 9.1 — zero errors in Rich Results Test | HUMAN-ACTION PENDING |
| SC-5 | Keyboard-only navigation, visible focus indicators, logical h1 per page | PARTIAL — automated axe-core and heading tests pass; browser-only button contrast verification pending |

---
plan: "07-02"
phase: 07
status: complete
completed: "2026-04-25"
commit_range: "e810837..6088e9e"
---

# Plan 07-02: SEO Route Files — SUMMARY

## What Was Built

All 12 SEO route files created for three properties, plus test stubs promoted to real passing assertions.

1. **3 × sitemap.ts** — `app/root/sitemap.ts`, `app/hk/sitemap.ts`, `app/sg/sitemap.ts`
   - Hardcoded production origins (no env vars, no preview URLs)
   - Root: 8 URLs. HK: 21 URLs. SG: 17 URLs.
   - Priority scale: homepage=1, locations=0.9, pillars=0.8, sub-pages=0.7, content=0.6, legal=0.3

2. **3 × robots.ts** — `app/root/robots.ts`, `app/hk/robots.ts`, `app/sg/robots.ts`
   - Always allow-all — no disallow rules, no environment branching

3. **3 × llms.txt/route.ts** — llmstxt.org spec compliant (H1, blockquote, H2, Optional, no H3+, no HTML)
   - 24h ISR, text/plain; charset=utf-8

4. **3 × llms-full.txt/route.ts** — expanded prose for LLM consumption
   - HK: all 8 gymnastics programme descriptions, venue NAP+hours, coach bios, FAQ answers
   - SG: all 3 zone descriptions, all 3 camp types, Katong Point NAP+hours, coach bios, FAQ answers
   - Root: brand story, coaching philosophy, market summaries

5. **Tests promoted** — sitemap.test.ts, robots.test.ts, llms-txt.test.ts replaced with real assertions

## key-files

### created
- `app/root/sitemap.ts`, `app/hk/sitemap.ts`, `app/sg/sitemap.ts`
- `app/root/robots.ts`, `app/hk/robots.ts`, `app/sg/robots.ts`
- `app/root/llms.txt/route.ts`, `app/hk/llms.txt/route.ts`, `app/sg/llms.txt/route.ts`
- `app/root/llms-full.txt/route.ts`, `app/hk/llms-full.txt/route.ts`, `app/sg/llms-full.txt/route.ts`

### modified
- `tests/unit/sitemap.test.ts`
- `tests/unit/robots.test.ts`
- `tests/unit/llms-txt.test.ts`

## Test Results

`npx vitest run tests/unit/`: **76 passed, 0 failed** (10 test files)
- sitemap assertions: production URLs, trailing slashes, no vercel.app, correct priorities
- robots assertions: allow-all, correct sitemap URLs
- llms.txt assertions: Content-Type, H1 start, blockquote, no H3+, no HTML, ## Optional

## Deviations

- SG sitemap URLs use actual page slugs (`movement/`, `sports-multiball/`, `climbing/`, `themed/`, `multi-activity/`, `gymnastics/`) which differ from the plan's hypothetical slugs. Correct real paths used.

## Self-Check: PASSED

- [x] 3 × sitemap.ts with hardcoded production origins and no preview URLs
- [x] 3 × robots.ts always emit allow-all (no environment branching)
- [x] 3 × llms.txt/route.ts pass llmstxt.org spec
- [x] 3 × llms-full.txt/route.ts contain expanded prose from data files
- [x] All test stubs promoted to real passing assertions
- [x] pnpm test:unit (tests/unit/) passes 76/76

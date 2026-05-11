---
plan: "07-04"
phase: 07
status: complete
completed: "2026-04-25"
---

# Plan 07-04: JSON-LD Coverage Gaps — HK Gymnastics, Supporting Pages, Root Pages — SUMMARY

## What Was Built

Complete JSON-LD schema coverage for HK gymnastics, HK supporting pages, root pages, and blog slug pages.

### T1: HK Gymnastics (9 pages)

- **`app/hk/gymnastics/page.tsx`** — Added `Service` schema before `FAQPage` in existing `@graph`.
- **8 gymnastics sub-pages** (`toddlers`, `beginner`, `intermediate`, `advanced`, `competitive`, `rhythmic`, `adult`, `private`) — Added `Service` schema before `BreadcrumbList` in existing `@graph`. Service name/description sourced from `PROGRAMME.metaDescription` and `PROGRAMME.label` (already in HK_GYMNASTICS_PROGRAMMES).

### T2: HK Supporting Content Pages (7 pages)

- **`app/hk/holiday-camps/page.tsx`** — Added `holidayCampsSchema` (Service + BreadcrumbList) before SEASONS const; script tag in component.
- **`app/hk/birthday-parties/page.tsx`** — Added `birthdayPartiesSchema` (Service + BreadcrumbList) before FORMAT_POINTS const; script tag in component.
- **`app/hk/school-partnerships/page.tsx`** — Added `schoolPartnershipsSchema` (Service + BreadcrumbList) before PARTNER_SCHOOLS const; script tag in component.
- **`app/hk/competitions-events/page.tsx`** — Added `competitionsEventsSchema` (BreadcrumbList only); script tag in component.
- **`app/hk/blog/page.tsx`** — Added `hkBlogSchema` (BreadcrumbList) before metadata; script tag in component.
- **`app/hk/book-a-trial/page.tsx`** — Added `bookATrialSchema` (BreadcrumbList) after HK_VENUES import; script tag in component.
- **`app/hk/book-a-trial/free-assessment/page.tsx`** — Added `freeAssessmentSchema` (3-level BreadcrumbList); wrapped bare `<Section>` in fragment with script tag + closing `</>`.

### T3: Root Supporting Pages (7 pages)

- **`app/root/brand/page.tsx`** — Added `brandSchema` (BreadcrumbList) + script tag.
- **`app/root/coaching-philosophy/page.tsx`** — Added `coachingPhilosophySchema` (BreadcrumbList) + script tag.
- **`app/root/careers/page.tsx`** — Added `careersSchema` (BreadcrumbList) + script tag.
- **`app/root/news/page.tsx`** — Added `newsSchema` (BreadcrumbList) + script tag.
- **`app/root/privacy/page.tsx`** — Added `privacySchema` (BreadcrumbList) + script tag.
- **`app/root/terms/page.tsx`** — Added `termsSchema` (BreadcrumbList) + script tag.
- **`app/root/contact/page.tsx`** — Upgraded standalone `ContactPage` schema to `@graph` wrapping `ContactPage` + `BreadcrumbList`.

### T4: Blog slug pages

- **`app/hk/blog/[slug]/page.tsx`** — Upgraded minimal standalone `BlogPosting` to `@graph` with `BlogPosting` (publisher uses `@id` reference) + `BreadcrumbList` (3-level: Home → Blog → Post title). `generateMetadata` with `alternates.canonical` was already present from Phase 06.
- **`app/sg/blog/[slug]/page.tsx`** — Same upgrade applied for SG market.

### T5: HK Homepage SportsActivityLocation

- **`app/hk/page.tsx`** — Added two `SportsActivityLocation` nodes to `hkHomeSchema @graph`:
  - `#localbusiness-wan-chai` — ProGym Wan Chai (15/F The Hennessy, geo 22.2772/114.173)
  - `#localbusiness-cyberport` — ProGym Cyberport (Cyberport Campus, geo 22.2618/114.1303)
  - Data sourced directly from `HK_VENUES` constants in `lib/hk-data.ts`.

## key-files

### modified
- `app/hk/gymnastics/page.tsx`
- `app/hk/gymnastics/toddlers/page.tsx` through `private/page.tsx` (8 files)
- `app/hk/holiday-camps/page.tsx`
- `app/hk/birthday-parties/page.tsx`
- `app/hk/school-partnerships/page.tsx`
- `app/hk/competitions-events/page.tsx`
- `app/hk/blog/page.tsx`
- `app/hk/book-a-trial/page.tsx`
- `app/hk/book-a-trial/free-assessment/page.tsx`
- `app/hk/page.tsx`
- `app/hk/blog/[slug]/page.tsx`
- `app/sg/blog/[slug]/page.tsx`
- `app/root/brand/page.tsx`
- `app/root/coaching-philosophy/page.tsx`
- `app/root/careers/page.tsx`
- `app/root/news/page.tsx`
- `app/root/privacy/page.tsx`
- `app/root/terms/page.tsx`
- `app/root/contact/page.tsx`

## Acceptance Criteria Results

- Service schema count in `app/hk/gymnastics/`: **9** ✓
- Service schema on hk supporting pages (holiday-camps, birthday-parties, school-partnerships): **3** ✓
- BreadcrumbList on hk non-Service pages (competitions-events, blog, book-a-trial): **3** ✓
- SportsActivityLocation on HK homepage: **2** ✓
- Organization @id occurrences in root/page.tsx: **2** (schema + publisher ref) ✓
- BreadcrumbList on root supporting pages: **7/7** ✓
- HK pages missing canonical: **0** ✓
- Root pages missing canonical: **0** ✓
- generateMetadata on HK blog/[slug]: **present** ✓
- `pnpm build`: **exit code 0** ✓

## Deviations

- Plan T1 specified using `buildServiceSchema`/`buildGraph` from `lib/schema.ts`; instead used inline object literals to match the existing inline pattern on each page. Functionally equivalent — avoids a server-only import in pages that don't already use it.
- `app/root/contact/page.tsx` was not in the original `files_modified` list but had a standalone `ContactPage` schema that needed @graph upgrade; added as scope extension.
- `app/sg/blog/[slug]/page.tsx` was not in the original list but symmetrically upgraded alongside the HK slug page.

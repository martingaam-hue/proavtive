---
phase: 06-sanity-content-models-editor-ux-webhook-isr
plan: 06-02
status: complete
started: 2026-04-25
completed: 2026-04-25
subsystem: cms
tags: [sanity, schema, structure, content-model]

requires:
  - phase: 06-01
    provides: shared imageWithAlt type

provides:
  - "siteSettings, hkSettings, sgSettings singletons with hero fields + imageWithAlt"
  - "post schema with 4 groups (content/taxonomy/publishing/seo) + market field"
  - "category schema for blog taxonomy"
  - "coach schema with D-07 locked field names (name, role, bio, portrait, venueTag, market)"
  - "venue schema with NAP + geo (lat/lng) + opening hours"
  - "camp schema with all Event JSON-LD fields (startDate, endDate, venue ref, price, priceCurrency, offerUrl)"
  - "testimonial and faq schemas with market scoping"
  - "page schema with Portable Text body"
  - "structure.ts rebuilt: 3 singletons + HK/SG market-filtered lists + shared types section"

affects: [06-03, 06-04, 06-05, 06-06, 06-07]

tech-stack:
  added: []
  patterns:
    - "All image fields use type: imageWithAlt — no bare { type: image }"
    - "post.author references coach type (not a plain string)"
    - "post.categories is an array of references to category type"
    - "camp.venue is a reference to venue type (provides NAP for Event JSON-LD)"
    - "market field on post/coach/camp/faq/testimonial enables GROQ market filtering"
    - "Studio structure: singletons pinned at top, HK/SG market folders, shared at bottom"

key-files:
  created:
    - sanity/schemaTypes/hkSettings.ts
    - sanity/schemaTypes/sgSettings.ts
    - sanity/schemaTypes/category.ts
  modified:
    - sanity/schemaTypes/siteSettings.ts
    - sanity/schemaTypes/post.ts
    - sanity/schemaTypes/coach.ts
    - sanity/schemaTypes/venue.ts
    - sanity/schemaTypes/camp.ts
    - sanity/schemaTypes/testimonial.ts
    - sanity/schemaTypes/faq.ts
    - sanity/schemaTypes/page.ts
    - sanity/structure.ts
---

# Plan 06-02 Summary: Production Sanity Schema Definitions + Studio Structure

## What Was Built

Replaced all 8 Phase 1 empty schema stubs with full production content models, added 3 new types (hkSettings, sgSettings, category), and rebuilt sanity/structure.ts with the complete Studio navigation tree: 3 singleton pinned documents at the top, HK and SG market-filtered lists in the middle, and shared document type lists at the bottom.

## Tasks Completed

| # | Task | Status | Commit |
|---|------|--------|--------|
| 1 | Rewrite siteSettings.ts | Done | 6a741c5 |
| 2 | Create hkSettings.ts | Done | 6a741c5 |
| 3 | Create sgSettings.ts | Done | 6a741c5 |
| 4 | Rewrite post.ts | Done | 5d1e294 |
| 5 | Create category.ts | Done | 5d1e294 |
| 6 | Rewrite coach.ts (D-07 locked fields) | Done | 425ff36 |
| 7 | Rewrite venue.ts | Done | 425ff36 |
| 8 | Rewrite camp.ts (Event JSON-LD fields) | Done | b754bd1 |
| 9 | Rewrite testimonial.ts | Done | b754bd1 |
| 10 | Rewrite faq.ts | Done | b9671e3 |
| 11 | Rewrite page.ts | Done | b9671e3 |
| 12 | Rebuild structure.ts | Done | 2706c83 |
| 13 | Verify sanity.config.ts imports | Done | (no-op — config already correct) |

## Deviations

None. All field names match plan spec exactly. D-07 coach field names honored.

## Self-Check

- [x] All 8 original stubs rewritten; 3 new types created (hkSettings, sgSettings, category)
- [x] Every image field in every schema uses type: imageWithAlt — no bare { type: image }
- [x] coach.ts field names are exactly name, role, bio, portrait, venueTag, market
- [x] post.ts has 4 field groups: content, taxonomy, publishing, seo
- [x] camp.ts has all Event JSON-LD fields: startDate, endDate, venue (reference), price, priceCurrency, offerUrl
- [x] structure.ts has 3 singletons at top, HK/SG market-filtered lists, shared types at bottom
- [x] Market-filtered lists use .filter('_type == "post" && market == "hk"') syntax
- [x] sanity.config.ts imports remain valid (no changes needed)

## Self-Check: PASSED

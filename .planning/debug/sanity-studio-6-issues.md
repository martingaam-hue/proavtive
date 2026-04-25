---
status: resolved
slug: sanity-studio-6-issues
trigger: "Sanity Studio at localhost:3000/studio shows 6 Issues badge; fix all and verify all studio pages/tools work"
created: 2026-04-25
updated: 2026-04-25
---

## Symptoms

- expected: Sanity Studio loads cleanly with zero issues, all structure panes open, Presentation tool works
- actual: "N 6 Issues" badge visible at bottom-left of studio on all pages
- error: Unknown — issues have not been individually identified yet
- timeline: Discovered during local dev testing
- reproduction: Open http://localhost:3000/studio — badge shows immediately; click it to see issue list

## Current Focus

hypothesis: "Resolved — all 6 issues identified and fixed."
next_action: "none — session complete"

## Evidence

- timestamp: 2026-04-25
  finding: "imageWithAlt has duplicate validation: field-level Rule.required() on alt field AND type-level Rule.custom() checking the same constraint (value?.asset && !value?.alt). Sanity fires both rules and emits a schema warning."
  file: sanity/schemaTypes/shared/imageWithAlt.ts

- timestamp: 2026-04-25
  finding: "venue.ts openingHours array uses an inline object definition with no `name` property at the object level. Sanity v3 requires array member object definitions to have a name field — emits 'schema type is missing a name' warning."
  file: sanity/schemaTypes/venue.ts

- timestamp: 2026-04-25
  finding: "structure.ts uses S.documentTypeListItem('post') twice (once in HK section, once in SG section). Same for camp and coach. S.documentTypeListItem registers the type as 'handled' by that entry — using it twice generates 'type appears more than once in structure' warnings for post, camp, and coach (3 warnings)."
  file: sanity/structure.ts

- timestamp: 2026-04-25
  finding: "sanity.config.ts Presentation tool singleton resolvers (siteSettings, hkSettings, sgSettings) omit the required `select` property. @ts-ignore suppresses the TS error but Sanity 5.x emits a runtime schema warning for resolver configs missing select."
  file: sanity.config.ts

## Resolution

root_cause: "Six schema warnings in Sanity Studio caused by: (1) duplicate validation on imageWithAlt, (2) anonymous inline object in venue openingHours array missing a name, (3-5) post/camp/coach each registered twice via S.documentTypeListItem in the structure, (6) Presentation tool singleton resolvers missing the required `select` property."

fix: "Fixed all 6: removed redundant type-level Rule.custom() from imageWithAlt; added name:'openingHoursEntry' to venue openingHours array object; replaced S.documentTypeListItem with S.listItem for HK/SG filtered sub-lists in structure.ts; added select:{id:'_id'} to all three singleton Presentation resolvers in sanity.config.ts."

files_changed:
  - sanity/schemaTypes/shared/imageWithAlt.ts
  - sanity/schemaTypes/venue.ts
  - sanity/structure.ts
  - sanity.config.ts

// Phase 1 / Plan 01-03 — Schema barrel. Consumed by sanity.config.ts `schema.types`.
// Phase 6 (CMS-01) rewrites each imported stub's body with real fields;
// this barrel file itself stays stable (new types just get appended to the list).
import { siteSettings } from './siteSettings'
import { hkSettings } from './hkSettings'
import { sgSettings } from './sgSettings'
import { page } from './page'
import { post } from './post'
import { category } from './category'
import { venue } from './venue'
import { coach } from './coach'
import { camp } from './camp'
import { testimonial } from './testimonial'
import { faq } from './faq'
import { imageWithAlt } from './shared/imageWithAlt'

export const schemaTypes = [
  // Shared types
  imageWithAlt,
  // Singletons
  siteSettings,
  hkSettings,
  sgSettings,
  // Document types
  page,
  post,
  category,
  venue,
  coach,
  camp,
  testimonial,
  faq,
]

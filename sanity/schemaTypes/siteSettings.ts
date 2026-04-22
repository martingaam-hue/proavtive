// Phase 1 / Plan 01-03 — D-11 empty stub. Phase 6 (CMS-01) replaces the fields array
// with real content modelling derived from strategy.md PART 13.2 + wireframes (Phases 3–5).
// D-12: this type is the singleton anchor — see sanity/structure.ts for the singleton wiring.
// DO NOT add fields here in Phase 1 — the stub IS the deliverable.
import { defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [{ name: "title", type: "string", title: "Title" }],
});

// Phase 1 / Plan 01-03 — D-12 singleton pattern anchor for siteSettings.
// Phase 6 adds more singletons (homepage, global nav, footer NAP) by adding listItem
// entries above the divider and appending their names to the filter list.
import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Singleton: exactly one siteSettings document, fixed id.
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      // All other document types as normal list items.
      ...S.documentTypeListItems().filter(
        (listItem) => !["siteSettings"].includes(listItem.getId() ?? ""),
      ),
    ]);

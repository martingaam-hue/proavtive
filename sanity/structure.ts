import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // ── Singletons ──────────────────────────────────────────
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("HK Homepage Settings")
        .id("hkSettings")
        .child(S.document().schemaType("hkSettings").documentId("hkSettings")),
      S.listItem()
        .title("SG Homepage Settings")
        .id("sgSettings")
        .child(S.document().schemaType("sgSettings").documentId("sgSettings")),

      S.divider(),

      // ── Hong Kong ────────────────────────────────────────────
      // NOTE: Use S.listItem() (not S.documentTypeListItem()) for filtered sub-lists.
      // S.documentTypeListItem() registers the type as "handled" by this structure entry,
      // and using it for both HK and SG sections causes a "type appears more than once"
      // warning for post, camp, and coach — three of the 6 studio schema warnings.
      S.listItem()
        .title("Hong Kong")
        .child(
          S.list()
            .title("Hong Kong")
            .items([
              S.listItem()
                .title("Blog Posts (HK)")
                .schemaType("post")
                .child(
                  S.documentList()
                    .title("Blog Posts (HK)")
                    .schemaType("post")
                    .filter('_type == "post" && market == "hk"')
                    .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
                ),
              S.listItem()
                .title("Camps (HK)")
                .schemaType("camp")
                .child(
                  S.documentList()
                    .title("Camps (HK)")
                    .schemaType("camp")
                    .filter('_type == "camp" && market == "hk"')
                    .defaultOrdering([{ field: "startDate", direction: "asc" }]),
                ),
              S.listItem()
                .title("Coaches (HK)")
                .schemaType("coach")
                .child(
                  S.documentList()
                    .title("Coaches (HK)")
                    .schemaType("coach")
                    .filter('_type == "coach" && market == "hk"')
                    .defaultOrdering([{ field: "name", direction: "asc" }]),
                ),
            ]),
        ),

      // ── Singapore ────────────────────────────────────────────
      S.listItem()
        .title("Singapore")
        .child(
          S.list()
            .title("Singapore")
            .items([
              S.listItem()
                .title("Blog Posts (SG)")
                .schemaType("post")
                .child(
                  S.documentList()
                    .title("Blog Posts (SG)")
                    .schemaType("post")
                    .filter('_type == "post" && market == "sg"')
                    .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
                ),
              S.listItem()
                .title("Camps (SG)")
                .schemaType("camp")
                .child(
                  S.documentList()
                    .title("Camps (SG)")
                    .schemaType("camp")
                    .filter('_type == "camp" && market == "sg"')
                    .defaultOrdering([{ field: "startDate", direction: "asc" }]),
                ),
              S.listItem()
                .title("Coaches (SG)")
                .schemaType("coach")
                .child(
                  S.documentList()
                    .title("Coaches (SG)")
                    .schemaType("coach")
                    .filter('_type == "coach" && market == "sg"')
                    .defaultOrdering([{ field: "name", direction: "asc" }]),
                ),
            ]),
        ),

      S.divider(),

      // ── Shared ───────────────────────────────────────────────
      S.documentTypeListItem("venue").title("Venues"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.documentTypeListItem("faq").title("FAQ Items"),
      S.documentTypeListItem("category").title("Categories"),
      S.documentTypeListItem("page").title("Pages (Legal & Evergreen)"),
    ]);

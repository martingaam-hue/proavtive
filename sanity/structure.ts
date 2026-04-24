import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // ── Singletons ──────────────────────────────────────────
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('HK Homepage Settings')
        .id('hkSettings')
        .child(S.document().schemaType('hkSettings').documentId('hkSettings')),
      S.listItem()
        .title('SG Homepage Settings')
        .id('sgSettings')
        .child(S.document().schemaType('sgSettings').documentId('sgSettings')),

      S.divider(),

      // ── Hong Kong ────────────────────────────────────────────
      S.listItem()
        .title('Hong Kong')
        .child(
          S.list()
            .title('Hong Kong')
            .items([
              S.documentTypeListItem('post')
                .title('Blog Posts (HK)')
                .child(
                  S.documentList()
                    .title('Blog Posts (HK)')
                    .schemaType('post')
                    .filter('_type == "post" && market == "hk"')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
                ),
              S.documentTypeListItem('camp')
                .title('Camps (HK)')
                .child(
                  S.documentList()
                    .title('Camps (HK)')
                    .schemaType('camp')
                    .filter('_type == "camp" && market == "hk"')
                    .defaultOrdering([{ field: 'startDate', direction: 'asc' }]),
                ),
              S.documentTypeListItem('coach')
                .title('Coaches (HK)')
                .child(
                  S.documentList()
                    .title('Coaches (HK)')
                    .schemaType('coach')
                    .filter('_type == "coach" && market == "hk"')
                    .defaultOrdering([{ field: 'name', direction: 'asc' }]),
                ),
            ]),
        ),

      // ── Singapore ────────────────────────────────────────────
      S.listItem()
        .title('Singapore')
        .child(
          S.list()
            .title('Singapore')
            .items([
              S.documentTypeListItem('post')
                .title('Blog Posts (SG)')
                .child(
                  S.documentList()
                    .title('Blog Posts (SG)')
                    .schemaType('post')
                    .filter('_type == "post" && market == "sg"')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
                ),
              S.documentTypeListItem('camp')
                .title('Camps (SG)')
                .child(
                  S.documentList()
                    .title('Camps (SG)')
                    .schemaType('camp')
                    .filter('_type == "camp" && market == "sg"')
                    .defaultOrdering([{ field: 'startDate', direction: 'asc' }]),
                ),
              S.documentTypeListItem('coach')
                .title('Coaches (SG)')
                .child(
                  S.documentList()
                    .title('Coaches (SG)')
                    .schemaType('coach')
                    .filter('_type == "coach" && market == "sg"')
                    .defaultOrdering([{ field: 'name', direction: 'asc' }]),
                ),
            ]),
        ),

      S.divider(),

      // ── Shared ───────────────────────────────────────────────
      S.documentTypeListItem('venue').title('Venues'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
      S.documentTypeListItem('faq').title('FAQ Items'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('page').title('Pages (Legal & Evergreen)'),
    ])

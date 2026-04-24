import { defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'taxonomy', title: 'Taxonomy' },
    { name: 'publishing', title: 'Publishing' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Content group
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      description: 'Post headline shown in the blog list and at the top of the article.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      description:
        'URL path segment. Auto-generated from title — click "Generate" then customise if needed.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      description:
        'Short summary (1–2 sentences) shown in the blog list card and used as meta description fallback.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
            ],
          },
        },
        { type: 'imageWithAlt' },
      ],
    }),
    defineField({
      name: 'mainImage',
      title: 'Featured image',
      type: 'imageWithAlt',
      group: 'content',
      description:
        'Hero image for the post. Shown in blog list card and at the top of the article. 1200×630px minimum.',
      validation: (Rule) => Rule.required(),
    }),
    // Taxonomy group
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'coach' }],
      group: 'taxonomy',
      description: 'Link to the coach or team member who wrote this post.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      group: 'taxonomy',
      description:
        'Add one or more categories (e.g. Gymnastics Tips, Prodigy News, Parent Guide).',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      group: 'taxonomy',
      description:
        'Free-form tags for filtering. Use lowercase kebab-case (e.g. toddlers, multiball, hk-camps).',
    }),
    defineField({
      name: 'market',
      title: 'Market',
      type: 'string',
      group: 'taxonomy',
      description:
        'Which website this post belongs to. HK posts appear on hk.proactivsports.com; SG posts on sg.proactivsports.com.',
      options: {
        list: [
          { title: 'Hong Kong', value: 'hk' },
          { title: 'Singapore', value: 'sg' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    // Publishing group
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'publishing',
      description:
        'Set a future date to hold the post as a draft until you click Publish on that date. Leave blank to publish immediately.',
    }),
    defineField({
      name: 'featured',
      title: 'Feature on homepage',
      type: 'boolean',
      group: 'publishing',
      description:
        'Promotes this post to the first slot in the "Latest from the blog" section on the homepage. Only one post should be featured at a time.',
      initialValue: false,
    }),
    // SEO group
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      group: 'seo',
      description:
        'Overrides the post title in the browser tab and Google results. 50–60 characters recommended. Leave blank to use the post title.',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 2,
      group: 'seo',
      description:
        '150–160 characters. Appears in Google results below the title. Leave blank to use the excerpt.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      type: 'imageWithAlt',
      group: 'seo',
      description:
        'Image shown when this post is shared to WhatsApp, iMessage, or social media. 1200×630px. Leave blank to use the featured image.',
    }),
  ],
  orderings: [
    {
      title: 'Publish date (newest)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', media: 'mainImage', subtitle: 'publishedAt' },
    prepare: ({ title, media, subtitle }: { title: string; media: unknown; subtitle: string }) => ({
      title,
      media,
      subtitle,
    }),
  },
})

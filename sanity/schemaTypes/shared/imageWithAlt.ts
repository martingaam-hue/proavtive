import { defineField, defineType } from 'sanity'

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description:
        'Describe the image for screen readers and SEO. Required before publishing.',
      validation: (Rule) =>
        Rule.required().error(
          'Alt text is required — image will not appear in production without it.',
        ),
    }),
  ],
  validation: (Rule) =>
    Rule.custom((value: { asset?: unknown; alt?: string } | undefined) => {
      if (value?.asset && !value?.alt) {
        return 'Alt text is required when an image is uploaded.'
      }
      return true
    }),
})

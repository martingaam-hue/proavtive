import { defineField, defineType } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Testimonial',
      type: 'text',
      rows: 3,
      description: 'Verbatim quote from a parent or partner. Do not paraphrase.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorName',
      title: 'Author name',
      type: 'string',
      description: 'Full name or first name + initial. E.g. "Sarah M." or "Manjula G."',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorRole',
      title: 'Author role',
      type: 'string',
      description: 'Optional context. E.g. "Parent of 2", "KidsFirst Foundation".',
    }),
    defineField({
      name: 'market',
      title: 'Market',
      type: 'string',
      description: 'Which homepage this testimonial appears on. Leave blank if used on root.',
      options: {
        list: [
          { title: 'Hong Kong', value: 'hk' },
          { title: 'Singapore', value: 'sg' },
          { title: 'Root / Both', value: 'root' },
        ],
      },
    }),
  ],
  preview: {
    select: { title: 'authorName', subtitle: 'market' },
    prepare: ({ title, subtitle }: { title: string; subtitle: string }) => ({ title, subtitle }),
  },
})

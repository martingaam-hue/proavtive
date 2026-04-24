import { defineField, defineType } from 'sanity'

export const sgSettings = defineType({
  name: 'sgSettings',
  title: 'SG Homepage Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'heroHeading',
      title: 'Hero heading',
      type: 'string',
      description: 'H1 on the Prodigy SG homepage hero.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero subheading',
      type: 'text',
      description: 'Subhead below the Prodigy SG hero H1.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'imageWithAlt',
      description: 'Full-bleed hero image or video poster for Prodigy @ Katong Point.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroCTALabel',
      title: 'Book CTA label',
      type: 'string',
      description:
        'Override for the primary "Book a Free Trial" button label. Leave blank to use default.',
    }),
    defineField({
      name: 'multiBallHighlight',
      title: 'MultiBall highlight',
      type: 'string',
      description:
        "Optional: override for the \"Singapore's only MultiBall wall\" trust inline. Rarely changed.",
    }),
  ],
  preview: {
    select: { title: 'heroHeading', media: 'heroImage' },
    prepare: ({ title, media }: { title: string; media: unknown }) => ({ title, media }),
  },
})

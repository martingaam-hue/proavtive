import { defineField, defineType } from 'sanity'

export const venue = defineType({
  name: 'venue',
  title: 'Venue',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Venue name',
      type: 'string',
      description:
        'Full venue name as it appears in Google Business Profile. E.g. "ProGym Wan Chai".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      description: 'URL segment for the location page. E.g. "wan-chai", "katong-point".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'market',
      title: 'Market',
      type: 'string',
      options: {
        list: [
          { title: 'Hong Kong', value: 'hk' },
          { title: 'Singapore', value: 'sg' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Street address',
      type: 'string',
      description:
        'Street address as shown in the footer and location page. E.g. "15/F The Hennessy, 256 Hennessy Road".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      description: 'City name. E.g. "Wan Chai" or "Singapore".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'countryCode',
      title: 'Country',
      type: 'string',
      description: 'ISO country code. "HK" or "SG".',
      initialValue: 'HK',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      description: 'Local phone number in international format. E.g. "+852 xxxx xxxx".',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp number',
      type: 'string',
      description:
        'WhatsApp number in international format without spaces. E.g. "+85298076827".',
    }),
    defineField({
      name: 'openingHours',
      title: 'Opening hours',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'days', type: 'string', title: 'Days (e.g. Mon–Fri)' },
            { name: 'hours', type: 'string', title: 'Hours (e.g. 9:00–18:00)' },
          ],
        },
      ],
      description: 'Opening hours by day range.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'imageWithAlt',
      description: 'Primary photo for the location page hero.',
    }),
    defineField({
      name: 'galleryImages',
      title: 'Gallery images',
      type: 'array',
      of: [{ type: 'imageWithAlt' }],
      description: 'Additional venue photos for the location page gallery.',
    }),
    defineField({
      name: 'lat',
      title: 'Latitude',
      type: 'number',
      description: 'GPS latitude for LocalBusiness schema. Confirm against Google Maps.',
    }),
    defineField({
      name: 'lng',
      title: 'Longitude',
      type: 'number',
      description: 'GPS longitude for LocalBusiness schema. Confirm against Google Maps.',
    }),
  ],
  orderings: [
    { title: 'Name (A–Z)', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', media: 'heroImage', subtitle: 'market' },
    prepare: ({ title, media, subtitle }: { title: string; media: unknown; subtitle: string }) => ({
      title,
      media,
      subtitle,
    }),
  },
})

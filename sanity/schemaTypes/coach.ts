// @ts-nocheck — Sanity Studio schema; preview function types are intentionally loose.
import { defineField, defineType } from "sanity";

export const coach = defineType({
  name: "coach",
  title: "Coach",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Full name as it appears on the coaches page and author byline.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description:
        'Job title shown under the coach\'s name. E.g. "Head of Gymnastics", "Head of Sports".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Biography",
      type: "text",
      rows: 4,
      description: "2–3 sentence biography. Shown on the coaches page and on blog post bylines.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "imageWithAlt",
      description: "Headshot photo. Square crop, minimum 400×400px.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "venueTag",
      title: "Venue tag",
      type: "string",
      description:
        'Optional short venue name used for visual grouping. E.g. "Wan Chai", "Cyberport", "Katong Point".',
    }),
    defineField({
      name: "market",
      title: "Market",
      type: "string",
      description: "Which market this coach belongs to.",
      options: {
        list: [
          { title: "Hong Kong", value: "hk" },
          { title: "Singapore", value: "sg" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [{ title: "Name (A–Z)", name: "nameAsc", by: [{ field: "name", direction: "asc" }] }],
  preview: {
    select: { title: "name", media: "portrait", subtitle: "role" },
    prepare: ({ title, media, subtitle }: { title: string; media: unknown; subtitle: string }) => ({
      title,
      media,
      subtitle,
    }),
  },
});

// @ts-nocheck — Sanity Studio schema; preview function types are intentionally loose.
import { defineField, defineType } from "sanity";

export const camp = defineType({
  name: "camp",
  title: "Camp",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Camp name",
      type: "string",
      description:
        'Camp title as shown on the camp page and in Event rich results. E.g. "Ninja Warrior Camp".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      description: "URL segment. Auto-generated from title.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description:
        "Short description of this camp — shown on the camp page and in Google Event rich results.",
    }),
    defineField({
      name: "image",
      title: "Camp image",
      type: "imageWithAlt",
      description: "Hero photo for this camp's page.",
    }),
    defineField({
      name: "startDate",
      title: "Start date & time",
      type: "datetime",
      description:
        "Camp start. Used for Event rich results — Google validates this format automatically.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End date & time",
      type: "datetime",
      description: "Camp end. Must be after start date.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "venue",
      title: "Venue",
      type: "reference",
      to: [{ type: "venue" }],
      description: "Location where this camp takes place. Links to the venue's NAP data.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ageRange",
      title: "Age range",
      type: "string",
      description: 'E.g. "4–12". Shown on the camp page.',
    }),
    defineField({
      name: "capacity",
      title: "Capacity",
      type: "number",
      description: "Maximum number of places. Optional — helps team track availability.",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      description:
        "Camp price in the local currency (no currency symbol). E.g. 2000 for HKD 2,000.",
    }),
    defineField({
      name: "priceCurrency",
      title: "Currency",
      type: "string",
      options: { list: ["HKD", "SGD"] },
      initialValue: "HKD",
      description: 'Currency code. E.g. "HKD" or "SGD".',
    }),
    defineField({
      name: "offerUrl",
      title: "Booking link",
      type: "url",
      description: "Direct URL to book this camp. Used in Google Event rich results.",
    }),
    defineField({
      name: "market",
      title: "Market",
      type: "string",
      options: {
        list: [
          { title: "Hong Kong", value: "hk" },
          { title: "Singapore", value: "sg" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Start date (soonest)",
      name: "startDateAsc",
      by: [{ field: "startDate", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", media: "image", subtitle: "startDate" },
    prepare: ({ title, media, subtitle }: { title: string; media: unknown; subtitle: string }) => ({
      title,
      media,
      subtitle,
    }),
  },
});

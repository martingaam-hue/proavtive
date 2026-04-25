// @ts-nocheck — Sanity Studio schema; preview function types are intentionally loose.
import { defineField, defineType } from "sanity";

export const faq = defineType({
  name: "faq",
  title: "FAQ Item",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      description:
        "The question as shown to parents on the FAQ page. Must match the FAQPage schema text exactly.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      description:
        "The answer. Plain text only — no markdown. Must match visible DOM text exactly for Google rich results.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description:
        'Group this FAQ into a category. E.g. "About ProGym", "Classes & Programmes", "Birthday Parties".',
    }),
    defineField({
      name: "market",
      title: "Market",
      type: "string",
      options: {
        list: [
          { title: "Hong Kong", value: "hk" },
          { title: "Singapore", value: "sg" },
          { title: "Root / Both", value: "root" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sortOrder",
      title: "Sort order",
      type: "number",
      description: "Controls ordering within the FAQ list. Lower numbers appear first.",
    }),
  ],
  orderings: [
    {
      title: "Category then question",
      name: "categoryQuestion",
      by: [
        { field: "category", direction: "asc" },
        { field: "question", direction: "asc" },
      ],
    },
    {
      title: "Sort order",
      name: "sortOrder",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "question", subtitle: "market" },
    prepare: ({ title, subtitle }: { title: string; subtitle: string }) => ({ title, subtitle }),
  },
});

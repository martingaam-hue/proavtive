// @ts-nocheck — Sanity Studio schema; preview function types are intentionally loose.
import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description:
        'Category label shown in blog list badges. E.g. "Gymnastics Tips", "Prodigy News", "Parent Guide".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      description: "Auto-generated from name.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "name" },
  },
});

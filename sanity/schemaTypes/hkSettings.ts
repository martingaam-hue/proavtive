// @ts-nocheck — Sanity Studio schema; preview function types are intentionally loose.
import { defineField, defineType } from "sanity";

export const hkSettings = defineType({
  name: "hkSettings",
  title: "HK Homepage Settings",
  type: "document",
  fields: [
    defineField({
      name: "heroHeading",
      title: "Hero heading",
      type: "string",
      description: "H1 on the HK homepage hero. Verbatim from brand strategy.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroSubheading",
      title: "Hero subheading",
      type: "text",
      description: "Subhead below the hero H1.",
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "imageWithAlt",
      description: "Full-bleed hero image or video poster. Minimum 2400×1600px.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroCTALabel",
      title: "Book CTA label",
      type: "string",
      description:
        'Override for the primary "Book a Free Trial" button label. Leave blank to use default.',
    }),
    defineField({
      name: "featuredProgramme",
      title: "Featured programme",
      type: "string",
      description:
        "Optional: name of a programme to highlight above the programme grid. Max 50 chars.",
    }),
  ],
  preview: {
    select: { title: "heroHeading", media: "heroImage" },
    prepare: ({ title, media }: { title: string; media: unknown }) => ({ title, media }),
  },
});

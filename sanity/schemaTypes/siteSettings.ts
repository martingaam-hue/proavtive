// @ts-nocheck — Sanity Studio schema; preview function types are intentionally loose.
import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "heroHeading",
      title: "Hero heading",
      type: "string",
      description: "Large display headline on the root gateway homepage hero. Max 10 words.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroSubheading",
      title: "Hero subheading",
      type: "text",
      description: "Supporting copy below the headline. Max 2 sentences.",
    }),
    defineField({
      name: "heroCTAPrimary",
      title: "Primary CTA label",
      type: "string",
      description:
        'Button text for the primary market-entry call-to-action. E.g. "Enter Hong Kong".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroCTASecondary",
      title: "Secondary CTA label",
      type: "string",
      description: "Button text for the secondary market-entry call-to-action.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "imageWithAlt",
      description: "Full-bleed hero background image. Minimum 2400×1600px. Must have alt text.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "trustLine",
      title: "Trust line",
      type: "string",
      description:
        'Short trust cue shown below CTAs. E.g. "14 years · 3 venues · 1,000+ families."',
    }),
  ],
  preview: {
    select: { title: "heroHeading", media: "heroImage" },
    prepare: ({ title, media }: { title: string; media: unknown }) => ({ title, media }),
  },
});

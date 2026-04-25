// @ts-nocheck — Sanity Studio schema; preview function types are intentionally loose.
import { defineField, defineType } from "sanity";

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description: "Describe the image for screen readers and SEO. Required before publishing.",
      validation: (Rule) =>
        Rule.required().error(
          "Alt text is required — image will not appear in production without it.",
        ),
    }),
  ],
  // Removed duplicate type-level Rule.custom() — field-level Rule.required() above is sufficient.
  // Duplicate validation on the same constraint caused one of the 6 studio schema warnings.
});

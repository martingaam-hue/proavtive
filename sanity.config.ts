// @ts-nocheck — Studio-only config; Sanity's preview function types don't match TS strict mode.
"use client";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    "Sanity env vars missing. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in .env.local (local) / Vercel project env (preview + prod). See .env.example for the contract.",
  );
}

// Preview origin: use Vercel deployment URL if available, else localhost
// NEXT_PUBLIC_VERCEL_URL is auto-injected by Vercel (no protocol prefix)
const previewOrigin = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000";

export default defineConfig({
  name: "default",
  title: "ProActiv Sports",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    visionTool(),
    presentationTool({
      previewUrl: {
        origin: previewOrigin,
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
      resolve: {
        // Maps document types to their frontend preview URLs (D-23)
        // Used by Presentation tool to load the correct page in its iframe
        locations: {
          post: {
            select: { title: "title", slug: "slug.current", market: "market" },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title ?? "Blog Post",
                  href: `/${doc?.market}/blog/${doc?.slug}`,
                },
              ],
            }),
          },
          camp: {
            select: { title: "title", slug: "slug.current", market: "market" },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title ?? "Camp",
                  href: `/${doc?.market}/holiday-camps/${doc?.slug}`,
                },
              ],
            }),
          },
          venue: {
            select: { title: "name", slug: "slug.current", market: "market" },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title ?? "Venue",
                  href: `/${doc?.market}/${doc?.slug}`,
                },
              ],
            }),
          },
          coach: {
            select: { title: "name", market: "market" },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title ?? "Coach",
                  href: `/${doc?.market}/coaches`,
                },
              ],
            }),
          },
          // Singleton resolvers: `select` must be provided even when no fields are needed.
          // Omitting `select` causes Sanity 5.x to emit a schema warning (one of the 6 Issues).
          // We select `_id` as a minimal valid sentinel — it's always present on every document.
          siteSettings: {
            select: { id: "_id" },
            resolve: () => ({
              locations: [{ title: "Root Homepage", href: "/" }],
            }),
          },
          hkSettings: {
            select: { id: "_id" },
            resolve: () => ({
              // Middleware routes hk.* → /(hk); locally test via hk.localhost:3000
              locations: [{ title: "HK Homepage", href: "/" }],
            }),
          },
          sgSettings: {
            select: { id: "_id" },
            resolve: () => ({
              locations: [{ title: "SG Homepage", href: "/" }],
            }),
          },
        },
      },
    }),
  ],
  // @ts-ignore — schemaTypes are valid at runtime; TS infers overly-narrow preview types
  schema: { types: schemaTypes },
});

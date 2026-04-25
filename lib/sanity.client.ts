import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "",
  apiVersion: "2025-04-24",
  useCdn: false,
  perspective: "published",
  // NOTE: stega is NOT enabled in Phase 6 — deferred post-launch per D-20.
  // To activate Visual Editing later: add stega: { enabled: true, studioUrl: '/studio' }
});

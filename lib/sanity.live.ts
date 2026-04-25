import { defineLive } from "next-sanity/live";
import { client } from "./sanity.client";

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: process.env.SANITY_API_READ_TOKEN,
  // browserToken is optional for Phase 6 (no public live preview needed — D-16).
  // Can be set to same READ_TOKEN or omitted entirely.
  browserToken: process.env.SANITY_API_BROWSER_TOKEN,
});

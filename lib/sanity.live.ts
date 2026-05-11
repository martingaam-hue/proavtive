import { defineLive } from "next-sanity/live";
import { client } from "./sanity.client";

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: process.env.SANITY_API_READ_TOKEN,
  // browserToken: false silences the dev warning; browser-side live drafts are
  // not needed until Phase 6 (D-16). Set to a Viewer-level token when live
  // stand-alone draft previews are required.
  browserToken: false,
});

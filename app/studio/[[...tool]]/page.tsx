// Phase 1 / Plan 01-03 — Embedded Studio mount (D-06).
// Studio chrome is Sanity's own UI — we do NOT customise it in Phase 1 per UI-SPEC §Color line 98.
// Studio is gated by Vercel Deployment Protection (Phase 0 D-14) + Sanity's own OAuth login.
// Non-prod X-Robots-Tag: noindex, nofollow is inherited from next.config.ts (Phase 0 D-15).
//
// Catch-all [[...tool]] is required — Sanity's Studio uses client-side routing for its sub-paths
// (/studio/structure/siteSettings, /studio/vision, /studio/presentation, etc.).
//
// Server Component: metadata/viewport must be re-exported from a server module. The client
// boundary is drawn by <NextStudio> (and by sanity.config.ts's own 'use client'), not here.

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export { metadata, viewport } from "next-sanity/studio";

export const dynamic = "force-static";

export default function StudioPage() {
  return <NextStudio config={config} />;
}

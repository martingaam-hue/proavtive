// Phase 5 / Plan 05-05 — Per-route OG for the SG Blog hub (SG-09).
// D-09: uses createSGOgImage — Prodigy-green (#0f9733) background.

import { createSGOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return createSGOgImage({
    title: "Prodigy Singapore Blog",
    tagline: "Guides, tips, and stories from Katong Point.",
  });
}

// Phase 5 / Plan 05-05 — Per-route OG for the SG Coaches page (SG-08).
// D-09: uses createSGOgImage — Prodigy-green (#0f9733) background.

import { createSGOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return createSGOgImage({
    title: "Meet the Prodigy Singapore Team",
    tagline: "Haikel, Mark, and Coach King — at Katong Point.",
  });
}

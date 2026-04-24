// Phase 5 / Plan 05-05 — Per-route OG for Katong Point location page (SG-02).
// Overrides default app/sg/opengraph-image.tsx for this high-priority route.
// D-09: uses createSGOgImage — Prodigy-green (#0f9733) background.

import { createSGOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return createSGOgImage({
    title: "Prodigy @ Katong Point",
    tagline:
      "Singapore's only MultiBall wall · 451 Joo Chiat Road, Level 3, Singapore.",
  });
}

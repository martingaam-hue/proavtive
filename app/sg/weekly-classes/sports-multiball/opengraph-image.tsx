// Phase 5 / Plan 05-04 — Sports + MultiBall Zone per-route OG image.
// High-priority per UI-SPEC §7 — sports-multiball has its own OG to showcase
// the Singapore's only differentiator (separate from the pillar OG).

import { createSGOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return createSGOgImage({
    title: "Sports + MultiBall Zone",
    tagline:
      "Singapore's only MultiBall wall — at Prodigy, Katong Point.",
  });
}

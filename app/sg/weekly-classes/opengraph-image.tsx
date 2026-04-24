// Phase 5 / Plan 05-04 — Weekly Classes pillar OG image.
// Per-route override for the /weekly-classes/ pillar page (UI-SPEC §7).

import { createSGOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return createSGOgImage({
    title: "Weekly Classes",
    tagline:
      "Movement · Sports + MultiBall · Climbing zones at Prodigy, Katong Point.",
  });
}

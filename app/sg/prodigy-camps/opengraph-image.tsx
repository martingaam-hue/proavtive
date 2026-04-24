// Phase 5 / Plan 05-04 — Prodigy Camps pillar OG image.
// Per-route override for the /prodigy-camps/ pillar page (UI-SPEC §7).
// Camp sub-pages inherit this pillar-level OG (per UI-SPEC §7 OG budget —
// only sports-multiball needed its own per-route OG due to its unique differentiator).

import { createSGOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return createSGOgImage({
    title: "Prodigy Camps",
    tagline:
      "Themed · Multi-Activity · Gymnastics camps at Katong Point every school holiday.",
  });
}

// Phase 4 / Plan 04-07 — Per-route OG for /book-a-trial/ hub.
// At the Pitfall 5 OG budget (this is #8 of 8). Mirrors Plan 04-06 OG pattern.

import { createHKOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return createHKOgImage({
    title: "Book a Free Trial",
    tagline:
      "30-minute assessment at ProGym Wan Chai or Cyberport. No commitment.",
  });
}

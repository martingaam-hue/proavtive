// Phase 5 / Plan 05-02 — Default SG OG image.
//
// All SG routes inherit this unless they declare their own opengraph-image.tsx.
// Per RESEARCH Pitfall 5 — high-priority SG routes may get per-route
// opengraph-image.tsx (homepage, Katong Point page, book-a-trial). Every other SG page
// (zone pages, FAQ, school partnerships, etc.) inherits this default.
//
// Mirrors app/hk/opengraph-image.tsx structure — force-dynamic prevents
// static prerendering if bloc-bold.ttf is absent (graceful fallback in createSGOgImage).
// createSGOgImage uses Prodigy-green (#0f9733) background to distinguish SG from HK navy (D-09).

import { createSGOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return createSGOgImage({
    title: "Prodigy by ProActiv Sports Singapore",
    tagline:
      "Kids' sports, camps, and parties at Katong Point — home of Singapore's only MultiBall wall.",
  });
}

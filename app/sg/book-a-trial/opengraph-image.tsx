// Phase 5 / Plan 05-06 — Per-route OG image for the SG booking page.
//
// Overrides the default SG layout OG (app/sg/opengraph-image.tsx) with
// booking-specific copy: "Book a Free Trial at Prodigy Singapore" + Katong Point tagline.
//
// Uses createSGOgImage from lib/og-image.tsx — Prodigy-green background (#0f9733),
// brand-cream market superscript, brand-rainbow bottom strip. Same graceful font+logo
// fallback as root/HK OG generators (try/catch ENOENT for bloc-bold.ttf + logo-white.svg).

import { createSGOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return createSGOgImage({
    title: "Book a Free Trial at Prodigy Singapore",
    tagline:
      "Your free 30-minute assessment at Katong Point — confirm within one working day.",
  });
}

// Phase 4 / Plan 04-02 — Default HK OG image.
//
// All HK routes inherit this unless they declare their own opengraph-image.tsx.
// Per RESEARCH Pitfall 5 — only 8 high-priority HK routes get per-route
// opengraph-image.tsx (homepage, venue pages, programme pillar, camps pillar,
// book-a-trial, birthday-parties, coaches, blog index). Every other HK page
// (sub-programmes, FAQ, school partnerships, etc.) inherits this default.
//
// Mirrors app/root/opengraph-image.tsx structure — force-dynamic prevents
// static prerendering if bloc-bold.ttf is absent (graceful fallback in createHKOgImage).

import { createHKOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return createHKOgImage({
    title: "ProActiv Sports Hong Kong",
    tagline:
      "Premium gymnastics and sports programmes for children — Wan Chai & Cyberport.",
  });
}

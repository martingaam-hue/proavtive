// Phase 4 / Plan 04-05 — Per-route OG for gymnastics pillar (UI-SPEC §7).
// High-priority pillar page; the 8 sub-pages inherit the HK layout default OG
// per Pitfall 5 (1 of 8 per-route OG slots budget for this plan).
import { createHKOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return createHKOgImage({
    title: "Children's Gymnastics Hong Kong",
    tagline:
      "Eight programme levels — toddler to competitive. Wan Chai & Cyberport.",
  });
}

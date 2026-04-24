// Phase 4 / Plan 04-06 — Per-route OG image for HK /birthday-parties/.
import { createHKOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return createHKOgImage({
    title: "Birthday Parties Hong Kong",
    tagline: "Coach-led, two-hour parties at ProGym.",
  });
}

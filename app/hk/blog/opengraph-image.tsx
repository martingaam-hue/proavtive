// Phase 4 / Plan 04-06 — Per-route OG image for HK /blog/.
import { createHKOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return createHKOgImage({
    title: "ProActiv HK Blog",
    tagline: "Guides on children's gymnastics + sports in Hong Kong.",
  });
}

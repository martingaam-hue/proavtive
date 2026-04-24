// Phase 4 / Plan 04-06 — Per-route OG image for HK /holiday-camps/.
import { createHKOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return createHKOgImage({
    title: "Holiday Camps Hong Kong",
    tagline: "Easter · Summer · Christmas at ProGym Wan Chai & Cyberport.",
  });
}

// Phase 4 / Plan 04-06 — Per-route OG image for HK /coaches/.
import { createHKOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return createHKOgImage({
    title: "Meet the ProGym HK Team",
    tagline: "One team. Two venues. Every coach completes our internal training.",
  });
}

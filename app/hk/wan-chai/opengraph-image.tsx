// Phase 4 / Plan 04-04 — Per-route OG for Wan Chai (high-priority page per UI-SPEC §7).
import { createHKOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return createHKOgImage({
    title: "ProGym Wan Chai",
    tagline: "Children's gymnastics in Wan Chai, Hong Kong.",
  });
}

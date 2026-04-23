// Phase 3 / Plan 03-05 — /news/ OG image.
import { createRootOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return createRootOgImage({
    title: "News & Press",
    tagline: "ProActiv Sports in family and lifestyle media — Hong Kong and Singapore.",
  });
}

// Phase 3 / Plan 03-03 — Contact page OG image.
import { createRootOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return createRootOgImage({
    title: "Get in touch.",
    tagline: "Tell us about your child — we'll route you to the right venue and the right coach.",
  });
}

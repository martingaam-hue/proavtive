// Phase 3 / Plan 03-05 — /news/ OG image.
// [Rule 3 fix — Plan 03-06]: force-dynamic prevents static prerender crash
// when app/fonts/bloc-bold.ttf is absent (same Rule 3 fix as Plan 03-02).
import { createRootOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return createRootOgImage({
    title: "News & Press",
    tagline: "ProActiv Sports in family and lifestyle media — Hong Kong and Singapore.",
  });
}

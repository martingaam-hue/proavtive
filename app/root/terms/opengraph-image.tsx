// app/root/terms/opengraph-image.tsx
import { createRootOgImage } from "@/lib/og-image";
export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OG() {
  return createRootOgImage({
    title: "Terms of Use",
    tagline: "Site usage terms — pending legal review.",
  });
}

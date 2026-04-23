import { createRootOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return createRootOgImage({
    title: "Work with children. Build a career.",
    tagline: "Join ProActiv Sports — coach roles and operations team in HK and SG.",
  });
}

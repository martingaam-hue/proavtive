// Phase 5 / Plan 05-02 — SG route-group layout.
// Replaces Phase 1 teal-stripe stub. Production chrome for all SG pages in Wave 3+.
//
// Architectural decisions encoded here:
//   - metadataBase = sg.proactivsports.com (Pitfall 1 — independent from root layout
//     so OG image og:image tags emit absolute https URLs once the domain is attached at Phase 10).
//   - Baloo 2 font variable cascades to all SG descendants (Phase 2 D-03 activation, same as HK).
//     The `baloo` import wires the `--font-baloo` CSS variable, which `globals.css`
//     consumes as `--font-accent: var(--font-baloo, ...)` → Tailwind `font-accent` utility
//     resolves to Baloo 2 only for SG descendants.
//     Rule 3 deviation: honour the shipped Phase 2 contract instead of re-wiring tokens.
//   - Skip-link and main-content wrapper mirror Phase 3 `app/root/layout.tsx` a11y pattern.
//
// Pitfall 1 (RESEARCH): metadataBase MUST resolve to an absolute https URL, else OG image
//   og:image tags emit relative paths and WhatsApp/iMessage previews break.
// Pitfall 2 (RESEARCH — inherited): metadata.openGraph merges SHALLOW — child pages provide
//   their own openGraph fully (title, description, url, images). This layout only seeds
//   siteName / locale / type defaults.

import type { Metadata } from "next";
import { baloo } from "@/app/fonts";
import { SGNav } from "@/components/sg/sg-nav";
import { SGFooter } from "@/components/sg/sg-footer";

// Resolve SG subdomain base URL across local + Vercel preview + production.
// Strategy: Phase 10 attaches the real `sg.proactivsports.com` domain;
// until then, Vercel previews live at `<sha>-proactive.vercel.app`. We declare the
// production-canonical metadataBase here so OG images and absolute URLs resolve correctly
// once the domain is attached, without a layout edit at Phase 10.
const SG_PRODUCTION_BASE = "https://sg.proactivsports.com";
const baseUrl =
  process.env.VERCEL_ENV === "production"
    ? SG_PRODUCTION_BASE
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://sg.localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default:
      "Kids' Sports Classes, Camps & Parties Singapore | Prodigy by ProActiv Sports",
    template: "%s | Prodigy by ProActiv Sports",
  },
  description:
    "Kids' sports classes, holiday camps & birthday parties at Prodigy by ProActiv Sports — Katong Point, Singapore. Home of the only MultiBall wall. Book a free trial.",
  openGraph: {
    siteName: "Prodigy by ProActiv Sports — Singapore",
    locale: "en_SG",
    type: "website",
    // Default OG image inherited from app/sg/opengraph-image.tsx (per-route opengraph-image takes precedence)
  },
};

export default function SGGroupLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={baloo.variable}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-2 focus:outline-ring focus:outline-offset-2"
      >
        Skip to main content
      </a>
      <SGNav />
      <main id="main-content">{children}</main>
      <SGFooter />
    </div>
  );
}

// Phase 4 / Plan 04-02 — HK route-group layout.
// Replaces Phase 1 placeholder (amber stripe distinguisher removed).
//
// Architectural decisions encoded here:
//   - metadataBase = hk.proactivsports.com (Pitfall 1 — independent from root layout
//     so OG image og:image tags emit absolute https URLs once the domain is attached at Phase 10).
//   - Baloo 2 font variable cascades to all HK descendants (Phase 2 D-03 activation).
//     The `baloo` import wires the `--font-baloo` CSS variable, which `globals.css`
//     consumes as `--font-accent: var(--font-baloo, ...)` → Tailwind `font-accent` utility
//     resolves to Baloo 2 only for HK descendants.
//     NOTE: The plan text suggested `variable: "--font-accent"` and `weight: ["600"]` on the
//     Baloo_2 export. Both are correctly handled by the existing Phase 2 wiring in
//     `app/fonts.ts` (variable: `--font-baloo`) + `app/globals.css` (maps accent → baloo).
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
import { HKNav } from "@/components/hk/hk-nav";
import { HKFooter } from "@/components/hk/hk-footer";

// Resolve HK subdomain base URL across local + Vercel preview + production.
// Strategy: Phase 10 attaches the real `hk.proactivsports.com` domain;
// until then, Vercel previews live at `<sha>-proactive.vercel.app`. We declare the
// production-canonical metadataBase here so OG images and absolute URLs resolve correctly
// once the domain is attached, without a layout edit at Phase 10.
const HK_PRODUCTION_BASE = "https://hk.proactivsports.com";
const baseUrl =
  process.env.VERCEL_ENV === "production"
    ? HK_PRODUCTION_BASE
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://hk.localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default:
      "Kids Gymnastics & Sports Hong Kong | ProActiv Sports — Wan Chai & Cyberport",
    template: "%s | ProActiv Sports Hong Kong",
  },
  description:
    "Premium gymnastics, sports classes, holiday camps and birthday parties for children in Hong Kong. ProGym Wan Chai & Cyberport. Book a free trial.",
  openGraph: {
    siteName: "ProActiv Sports Hong Kong",
    locale: "en_HK",
    type: "website",
    // Default OG image inherited from app/hk/opengraph-image.tsx (per-route opengraph-image takes precedence)
  },
};

export default function HKGroupLayout({
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
      <HKNav />
      <main id="main-content">{children}</main>
      <HKFooter />
    </div>
  );
}

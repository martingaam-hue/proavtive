// Phase 3 / Plan 03-01 — Root group layout. Replaces Phase 1 stub.
//
// Pitfall 1 (RESEARCH): metadataBase MUST resolve to an absolute https URL,
//   else OG image og:image tags emit relative paths and WhatsApp/iMessage previews break.
//   Vercel-aware fallback: VERCEL_PROJECT_PRODUCTION_URL → VERCEL_URL → localhost.
// Pitfall 2 (RESEARCH): metadata.openGraph merges SHALLOW — child pages provide their own openGraph fully.
//   This layout's openGraph only sets siteName / locale / type defaults; the homepage and supporting pages
//   each declare their own complete openGraph object including title, description, url, images.

import type { Metadata } from "next";
import { RootNav } from "@/components/root/root-nav";
import { RootFooter } from "@/components/root/root-footer";

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "ProActiv Sports | Children's Gymnastics & Sports — Hong Kong & Singapore",
    template: "%s | ProActiv Sports",
  },
  description:
    "Children's gymnastics and sports specialist in Hong Kong (ProGym Wan Chai & Cyberport) and Singapore (Prodigy @ Katong Point). Since 2011. Ages 2–16.",
  openGraph: {
    siteName: "ProActiv Sports",
    locale: "en_GB",
    type: "website",
  },
};

export default function RootGroupLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-2 focus:outline-ring focus:outline-offset-2"
      >
        Skip to main content
      </a>
      <RootNav />
      <main id="main-content">{children}</main>
      <RootFooter />
    </>
  );
}

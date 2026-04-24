// Phase 5 / Plan 05-06 — SG booking page RSC shell (SG-11).
//
// SG has ONE venue (Katong Point) — no hub→form two-step like HK.
// This page IS the booking form. Contrast with HK which has:
//   /book-a-trial/ → hub page (pick venue)
//   /book-a-trial/free-assessment/ → form page
//
// Suspense boundary around BookingForm is REQUIRED: BookingForm uses
// useSearchParams() which suspends during static prerender in Next.js 15.
// Without Suspense, the build throws "useSearchParams must be wrapped in Suspense".

import type { Metadata } from "next";
import { Suspense } from "react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { BookingForm } from "./booking-form";

export const metadata: Metadata = {
  title: "Book a Free Trial — Prodigy by ProActiv Sports Singapore",
  description:
    "Book a free 30-minute assessment at Prodigy, Katong Point. We'll confirm within one working day.",
  openGraph: {
    title: "Book a Free Trial at Prodigy Singapore",
    description: "Free 30-minute assessment at Katong Point.",
    url: "https://sg.proactivsports.com/book-a-trial/",
    siteName: "Prodigy by ProActiv Sports — Singapore",
    locale: "en_SG",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Book a Free Trial at Prodigy Singapore",
      },
    ],
  },
  alternates: { canonical: "https://sg.proactivsports.com/book-a-trial/" },
};

// BreadcrumbList JSON-LD: Home → Book a Free Trial.
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Prodigy Singapore",
      item: "https://sg.proactivsports.com/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Book a Free Trial",
      item: "https://sg.proactivsports.com/book-a-trial/",
    },
  ],
};

export default function SGBookATrialPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Section size="lg" bg="default">
        <ContainerEditorial width="default">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-h1 font-display text-foreground">
              Your free 30-minute assessment at{" "}
              <span className="font-accent text-brand-green">Prodigy</span>.
            </h1>
            <p className="text-body-lg text-muted-foreground mt-4 mb-8">
              Tell us a little about your child, and we&apos;ll confirm a time
              at Katong Point within one working day.
            </p>
            {/* Suspense required — BookingForm uses useSearchParams() which suspends on prerender */}
            <Suspense fallback={null}>
              <BookingForm />
            </Suspense>
          </div>
        </ContainerEditorial>
      </Section>
    </>
  );
}

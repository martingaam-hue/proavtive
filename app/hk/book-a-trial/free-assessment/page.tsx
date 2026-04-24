// Phase 4 / Plan 04-07 — Free assessment booking page (HK-12).
//
// RSC shell wrapping the BookingForm client island in a Suspense boundary.
// The BookingForm uses useSearchParams() to read `?venue=...` and pre-select a
// venue radio — Next.js requires Suspense around any client component that
// calls useSearchParams during static prerender (Phase 3 D-06 carry).

import type { Metadata } from "next";
import { Suspense } from "react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { BookingForm } from "./booking-form";

export const metadata: Metadata = {
  title: "Book a Free Assessment — ProActiv Sports Hong Kong | ProGym",
  description:
    "Book a free 30-minute assessment at ProGym Wan Chai or Cyberport. We'll confirm a time within one working day.",
  openGraph: {
    title: "Book a Free Assessment — ProActiv Sports Hong Kong",
    description:
      "Book a free 30-minute assessment at ProGym. We'll confirm within one working day.",
    url: "https://hk.proactivsports.com/book-a-trial/free-assessment/",
    siteName: "ProActiv Sports Hong Kong",
    locale: "en_HK",
    type: "website",
    // No per-route opengraph-image — inherits HK layout default (this page is
    // typically reached via internal CTAs, not social shares). Keeps OG budget at 8.
  },
  alternates: {
    canonical: "https://hk.proactivsports.com/book-a-trial/free-assessment/",
  },
};

export default function FreeAssessmentPage() {
  return (
    <Section size="lg" bg="default">
      <ContainerEditorial width="default">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-h1 font-display text-foreground">
            Your free 30-minute assessment at{" "}
            <span className="font-accent text-brand-navy">ProGym</span>.
          </h1>
          <p className="text-body-lg text-muted-foreground mt-4 mb-8">
            Choose a venue, tell us a little about your child, and we&apos;ll
            confirm a time within one working day.
          </p>
          <Suspense fallback={null}>
            <BookingForm />
          </Suspense>
        </div>
      </ContainerEditorial>
    </Section>
  );
}

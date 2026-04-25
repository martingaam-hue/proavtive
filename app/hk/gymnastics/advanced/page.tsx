// Phase 4 / Plan 04-05 — Gymnastics sub-page: Advanced (HK-04).
// Shared template across all 8 /gymnastics/{slug}/ routes. Content is pulled
// from HK_GYMNASTICS_PROGRAMMES[slug === "advanced"]; a Phase 6 CMS migration
// only touches lib/hk-data.ts — this page file does not change.
//
// Plain <a> is used for the booking CTA to preserve the trailing slash in
// href (Next.js Link strips it when trailingSlash:false, which breaks the
// 04-01 RED test harness prefix match on /book-a-trial/free-assessment/).

import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GymPillarNav } from "@/components/hk/gymnastics-pillar-nav";
import { HK_GYMNASTICS_PROGRAMMES, HK_VENUES } from "@/lib/hk-data";

const PROGRAMME = HK_GYMNASTICS_PROGRAMMES.find(
  (p) => p.slug === "advanced",
)!;

export const metadata: Metadata = {
  title: PROGRAMME.metaTitle,
  description: PROGRAMME.metaDescription,
  openGraph: {
    title: PROGRAMME.metaTitle,
    description: PROGRAMME.metaDescription,
    url: "https://hk.proactivsports.com/gymnastics/advanced/",
    siteName: "ProActiv Sports Hong Kong",
    locale: "en_HK",
    type: "website",
  },
  alternates: {
    canonical: "https://hk.proactivsports.com/gymnastics/advanced/",
  },
};

const subPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: `${PROGRAMME.label} Gymnastics Hong Kong`,
      description: PROGRAMME.metaDescription,
      url: "https://hk.proactivsports.com/gymnastics/advanced/",
      provider: { "@id": "https://proactivsports.com/#organization" },
      areaServed: "Hong Kong",
      serviceType: "Children's Sports and Gymnastics Programmes",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "ProActiv Sports Hong Kong",
          item: "https://hk.proactivsports.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Gymnastics",
          item: "https://hk.proactivsports.com/gymnastics/",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: PROGRAMME.label,
          item: "https://hk.proactivsports.com/gymnastics/advanced/",
        },
      ],
    },
  ],
};

export default function AdvancedGymPage() {
  const venuesShown = HK_VENUES.filter((v) =>
    PROGRAMME.venuesOffered.includes(v.id),
  );
  // Booking CTA pre-fill: programmes offered at exactly one venue pre-fill
  // that venue; otherwise "no-preference" lets the booking form choose.
  const bookingVenue =
    PROGRAMME.venuesOffered.length === 1
      ? PROGRAMME.venuesOffered[0]
      : "no-preference";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(subPageSchema) }}
      />

      {/* §1 Pillar nav */}
      <Section size="sm" bg="default">
        <ContainerEditorial width="wide">
          <GymPillarNav />
        </ContainerEditorial>
      </Section>

      {/* §2 Hero */}
      <Section size="md" bg="default">
        <ContainerEditorial width="default">
          <div className="max-w-3xl">
            <Badge variant="secondary">{PROGRAMME.ageBand}</Badge>
            <h1 className="text-h1 font-display text-foreground mt-3">
              {PROGRAMME.h1}
            </h1>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §3 What they learn */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="default">
          <div className="max-w-3xl">
            <h2 className="text-h2 font-display text-foreground mb-6">
              What children learn
            </h2>
            <ul className="space-y-3">
              {PROGRAMME.whatTheyLearn.map((b) => (
                <li
                  key={b}
                  className="text-body text-foreground flex gap-3"
                >
                  <span aria-hidden className="text-brand-red">
                    ·
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §4 Class structure */}
      <Section size="md" bg="default">
        <ContainerEditorial width="default">
          <div className="max-w-3xl">
            <h2 className="text-h2 font-display text-foreground mb-4">
              Class structure
            </h2>
            <p className="text-body text-muted-foreground">
              {PROGRAMME.classStructure}
            </p>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §5 Which venues */}
      <Section size="sm" bg="muted">
        <ContainerEditorial width="default">
          <div className="max-w-3xl">
            <h2 className="text-h3 font-display text-foreground mb-4">
              Available at
            </h2>
            <div className="flex flex-wrap gap-3">
              {venuesShown.map((v) => (
                <a
                  key={v.id}
                  href={`/${v.id}/`}
                  className="px-4 py-2 rounded-lg bg-background border border-brand-navy/20 hover:border-brand-navy transition-colors"
                >
                  <span className="font-accent text-brand-navy">ProGym</span>{" "}
                  <span className="font-semibold text-foreground">
                    {v.nameShort}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §6 Booking CTA — plain <a> preserves trailing slash */}
      <Section size="lg" bg="navy">
        <ContainerEditorial width="default">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-h2 font-display text-white mb-3">
              Try a {PROGRAMME.label} class — free.
            </h2>
            <p className="text-body-lg text-cream mb-6">
              A 30-minute trial with a coach who teaches this programme every
              week. No commitment.
            </p>
            <Button
              asChild
              size="touch"
              className="bg-brand-red text-white hover:bg-brand-red/90"
            >
              <a
                href={`/book-a-trial/free-assessment/?venue=${bookingVenue}`}
              >
                Book a Free Trial
                <ArrowRight className="ml-2 size-4" aria-hidden />
              </a>
            </Button>
          </div>
        </ContainerEditorial>
      </Section>
    </>
  );
}

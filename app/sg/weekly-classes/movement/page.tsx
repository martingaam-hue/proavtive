// Phase 5 / Plan 05-04 — Movement Zone sub-page (SG-03).
// Data-driven from SG_ZONES — only the slug lookup changes across the 3 zone pages.

import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ZonesPillarNav } from "@/components/sg/zones-pillar-nav";
import { SG_ZONES } from "@/lib/sg-data";

const ZONE = SG_ZONES.find((z) => z.slug === "movement")!;

export const metadata: Metadata = {
  title: ZONE.metaTitle,
  description: ZONE.metaDescription,
  openGraph: {
    title: ZONE.metaTitle,
    description: ZONE.metaDescription,
    url: `https://sg.proactivsports.com${ZONE.href}`,
    siteName: "Prodigy by ProActiv Sports — Singapore",
    locale: "en_SG",
    type: "website",
    images: [
      {
        url: `/weekly-classes/opengraph-image`,
        width: 1200,
        height: 630,
        alt: ZONE.label,
      },
    ],
  },
  alternates: {
    canonical: `https://sg.proactivsports.com${ZONE.href}`,
  },
};

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
      name: "Weekly Classes",
      item: "https://sg.proactivsports.com/weekly-classes/",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: ZONE.label,
      item: `https://sg.proactivsports.com${ZONE.href}`,
    },
  ],
};

export default function MovementZonePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* §1 Pillar nav */}
      <Section size="sm" bg="default">
        <ContainerEditorial width="wide">
          <ZonesPillarNav />
        </ContainerEditorial>
      </Section>

      {/* §2 Hero */}
      <Section size="md" bg="default">
        <ContainerEditorial width="default">
          <div className="max-w-3xl">
            <Badge variant="secondary">{ZONE.ageBand}</Badge>
            <h1 className="text-h1 font-display text-foreground mt-3">
              {ZONE.h1}
            </h1>
            <p className="text-body-lg text-muted-foreground mt-4">
              {ZONE.metaDescription}
            </p>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §3 Hero image — D-07 gate 2: HUMAN-ACTION required (real Katong zone photo) */}
      <Section size="sm" bg="default">
        <ContainerEditorial width="wide">
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
            <Image
              src="/photography/sg-zone-movement.webp"
              alt="Children in the Movement Zone at Prodigy, Katong Point — early years gymnastics and fundamental movement"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-cover"
            />
          </div>
        </ContainerEditorial>
      </Section>

      {/* §4 What children learn */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="default">
          <div className="max-w-3xl">
            <h2 className="text-h2 font-display text-foreground mb-6">
              What children learn
            </h2>
            <ul className="space-y-3">
              {ZONE.whatTheyLearn.map((b) => (
                <li key={b} className="text-body text-foreground flex gap-3">
                  <span aria-hidden className="text-brand-green">
                    ·
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §5 Class structure */}
      <Section size="md" bg="default">
        <ContainerEditorial width="default">
          <div className="max-w-3xl">
            <h2 className="text-h2 font-display text-foreground mb-4">
              Class structure
            </h2>
            <p className="text-body text-muted-foreground">
              {ZONE.classStructure}
            </p>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §6 Safety note */}
      <Section size="sm" bg="muted">
        <ContainerEditorial width="default">
          <div className="max-w-3xl">
            <p className="text-body text-muted-foreground">
              All sessions are coach-led in our fully indoor, air-conditioned
              2,700 sq ft venue at Katong Point. Apparatus is padded and
              age-appropriate; coach-to-child ratios are kept small for safety
              and attention.
            </p>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §7 Booking CTA */}
      <Section size="lg" bg="navy">
        <ContainerEditorial width="default">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-h2 font-display text-white mb-3">
              Try a {ZONE.label} class — free.
            </h2>
            <p className="text-body-lg text-cream mb-6">
              A 30-minute trial with a coach who teaches this zone every week.
              No commitment.
            </p>
            <Button
              asChild
              size="touch"
              className="bg-brand-red text-white hover:bg-brand-red/90"
            >
              <a href={`/book-a-trial/?subject=movement-zone`}>
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

// Phase 5 / Plan 05-04 — Themed Camps sub-page (SG-04).
// Data-driven from SG_CAMP_TYPES — mirrors zone sub-page pattern but for camps.
// Theme list: Ninja · Pokémon · Superhero · LEGO · STEAM (strategy PART 6C §6 + UI-SPEC §5.1)

import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CampsPillarNav } from "@/components/sg/camps-pillar-nav";
import { SG_CAMP_TYPES } from "@/lib/sg-data";

const CAMP = SG_CAMP_TYPES.find((c) => c.slug === "themed")!;

export const metadata: Metadata = {
  title: CAMP.metaTitle,
  description: CAMP.metaDescription,
  openGraph: {
    title: CAMP.metaTitle,
    description: CAMP.metaDescription,
    url: `https://sg.proactivsports.com${CAMP.href}`,
    siteName: "Prodigy by ProActiv Sports — Singapore",
    locale: "en_SG",
    type: "website",
    images: [
      {
        url: `/prodigy-camps/opengraph-image`,
        width: 1200,
        height: 630,
        alt: CAMP.label,
      },
    ],
  },
  alternates: {
    canonical: `https://sg.proactivsports.com${CAMP.href}`,
  },
};

const campSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: `${CAMP.label} Holiday Camps Singapore`,
      description: CAMP.metaDescription,
      url: `https://sg.proactivsports.com${CAMP.href}`,
      provider: { "@id": "https://proactivsports.com/#organization" },
      areaServed: "Singapore",
      serviceType: "Children's Sports and Gymnastics Programmes",
    },
    {
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
          name: "Prodigy Camps",
          item: "https://sg.proactivsports.com/prodigy-camps/",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: CAMP.label,
          item: `https://sg.proactivsports.com${CAMP.href}`,
        },
      ],
    },
  ],
};

export default function ThemedCampsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(campSchema) }}
      />

      {/* §1 Pillar nav */}
      <Section size="sm" bg="default">
        <ContainerEditorial width="wide">
          <CampsPillarNav />
        </ContainerEditorial>
      </Section>

      {/* §2 Hero */}
      <Section size="md" bg="default">
        <ContainerEditorial width="default">
          <div className="max-w-3xl">
            <Badge variant="secondary">{CAMP.ageBand}</Badge>
            <h1 className="text-h1 font-display text-foreground mt-3">
              {CAMP.h1}
            </h1>
            <p className="text-body-lg text-muted-foreground mt-4">
              {CAMP.metaDescription}
            </p>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §3 Hero image — D-07 gate 2: HUMAN-ACTION required (real Katong camp photo) */}
      <Section size="sm" bg="default">
        <ContainerEditorial width="wide">
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
            <Image
              src="/photography/sg-camp-themed.webp"
              alt="Children in a Themed Camp at Prodigy, Katong Point — Ninja, Pokémon, Superhero, LEGO and STEAM adventures"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-cover"
            />
          </div>
        </ContainerEditorial>
      </Section>

      {/* §4 Theme list */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="default">
          <div className="max-w-3xl">
            <h2 className="text-h2 font-display text-foreground mb-4">
              Upcoming themes
            </h2>
            <p className="text-body text-muted-foreground mb-4">
              {/* Verbatim from strategy PART 6C §6 and UI-SPEC §5.1 dropdown copy */}
              Each school holiday brings a brand-new theme. Past and upcoming
              themes include:
            </p>
            <div className="flex flex-wrap gap-2">
              {["Ninja Warrior", "Pokémon", "Superhero", "LEGO City", "STEAM", "Outdoor Explorer", "Multi-Sport"].map(
                (theme) => (
                  <Badge key={theme} variant="secondary" className="text-sm">
                    {theme}
                  </Badge>
                )
              )}
            </div>
            <p className="text-body text-muted-foreground mt-4">
              {CAMP.description}
            </p>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §5 What's included */}
      <Section size="md" bg="default">
        <ContainerEditorial width="default">
          <div className="max-w-3xl">
            <h2 className="text-h2 font-display text-foreground mb-6">
              What&apos;s included
            </h2>
            <ul className="space-y-3">
              {CAMP.highlights.map((b) => (
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

      {/* §6 Booking CTA */}
      <Section size="lg" bg="navy">
        <ContainerEditorial width="default">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-h2 font-display text-white mb-3">
              Reserve a Themed Camp place.
            </h2>
            <p className="text-body-lg text-cream mb-6">
              Ages 4–12. Every school holiday. Places fill quickly — book early
              to secure your child&apos;s preferred week.
            </p>
            <Button
              asChild
              size="touch"
              className="bg-brand-red text-white hover:bg-brand-red/90"
            >
              <a href="/book-a-trial/?subject=themed-camp">
                Book a Camp Place
                <ArrowRight className="ml-2 size-4" aria-hidden />
              </a>
            </Button>
          </div>
        </ContainerEditorial>
      </Section>
    </>
  );
}

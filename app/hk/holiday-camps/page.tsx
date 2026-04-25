// Phase 6 / Plan 06-05 — Holiday camps listing page wired to Sanity.
// Fetches live camps from hkCampsQuery; shows them in a dynamic grid when available.
// Static SEASONS editorial section preserved below for evergreen content.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgrammeTile } from "@/components/ui/programme-tile";
import { sanityFetch } from "@/lib/sanity.live";
import { hkCampsQuery } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Holiday Camps Hong Kong — Easter, Summer, Christmas | ProGym",
  description:
    "ProGym holiday camps in Hong Kong — Easter, Summer, Christmas. Multi-day gymnastics + sports for ages 3-12 at Wan Chai & Cyberport. Book now.",
  openGraph: {
    title: "Holiday Camps Hong Kong — ProGym",
    description:
      "Easter, Summer, Christmas holiday camps for children 3-12 at ProGym Wan Chai & Cyberport.",
    url: "https://hk.proactivsports.com/holiday-camps/",
    siteName: "ProActiv Sports Hong Kong",
    locale: "en_HK",
    type: "website",
    images: [
      {
        url: "/holiday-camps/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ProGym holiday camps Hong Kong",
      },
    ],
  },
  alternates: { canonical: "https://hk.proactivsports.com/holiday-camps/" },
};

const SEASONS = [
  {
    title: "Easter Camps",
    ageRange: "3–12yr",
    href: "/book-a-trial/free-assessment/?subject=Holiday%20Camp%20-%20Easter",
    imageSrc: "/photography/programme-easter-camp.webp",
    imageAlt: "Easter holiday camp at ProGym",
    description: "Two-week programme during the school break.",
  },
  {
    title: "Summer Camps",
    ageRange: "3–12yr",
    href: "/book-a-trial/free-assessment/?subject=Holiday%20Camp%20-%20Summer",
    imageSrc: "/photography/programme-beginner.webp",
    imageAlt: "Summer camp at ProGym",
    description: "Six weeks of gymnastics, sports, and play.",
  },
  {
    title: "Christmas Camps",
    ageRange: "3–12yr",
    href: "/book-a-trial/free-assessment/?subject=Holiday%20Camp%20-%20Christmas",
    imageSrc: "/photography/programme-intermediate.webp",
    imageAlt: "Christmas camp at ProGym",
    description: "Festive themed activities + skill-building.",
  },
] as const;

export default async function HolidayCampsPage() {
  const { data: camps } = await sanityFetch({
    query: hkCampsQuery,
    tags: ["camp"],
  });

  return (
    <>
      {/* Hero */}
      <Section size="lg" bg="default">
        <ContainerEditorial width="wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h1 className="text-display font-display text-foreground">
                Holiday camps at ProGym Hong Kong.
              </h1>
              <p className="text-body-lg text-muted-foreground mt-6">
                School holidays mean longer days at ProGym. Easter, Summer and Christmas camps run
                at both venues — half-day and full-day formats, mixed-age groups, and the same
                coaching standard as our weekly classes. Children build skills, make friends, and
                burn off term-time energy on real apparatus.
              </p>
              <div className="mt-8">
                <Button
                  asChild
                  size="touch"
                  className="bg-brand-red text-white hover:bg-brand-red/90"
                >
                  <Link href="/contact?market=hk&subject=Holiday%20Camp">
                    Send an Enquiry <ArrowRight className="ml-2 size-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/photography/programme-easter-camp.webp"
                alt="Children at a ProGym Hong Kong holiday camp"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </ContainerEditorial>
      </Section>

      {/* Live camps from Sanity — shown when published */}
      {camps.length > 0 && (
        <Section size="md" bg="muted">
          <ContainerEditorial width="wide">
            <h2 className="text-h2 font-display text-foreground mb-8">Upcoming camps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {camps.map((camp) => (
                <Card key={camp._id} className="overflow-hidden flex flex-col">
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-h3 font-display text-foreground">{camp.title}</h3>
                    {camp.ageRange && (
                      <Badge variant="secondary" className="self-start mt-2">
                        {camp.ageRange}
                      </Badge>
                    )}
                    {camp.description && (
                      <p className="text-body text-muted-foreground mt-3 flex-1">
                        {camp.description}
                      </p>
                    )}
                    {(camp.startDate || camp.endDate) && (
                      <p className="text-small text-muted-foreground mt-3">
                        {camp.startDate && <time dateTime={camp.startDate}>{camp.startDate}</time>}
                        {camp.startDate && camp.endDate && " – "}
                        {camp.endDate && <time dateTime={camp.endDate}>{camp.endDate}</time>}
                      </p>
                    )}
                    {camp.venue?.name && (
                      <p className="text-small text-brand-navy font-medium mt-1">
                        {camp.venue.name}
                      </p>
                    )}
                    <div className="mt-4">
                      {camp.offerUrl ? (
                        <a
                          href={camp.offerUrl}
                          className="inline-flex items-center text-brand-red font-semibold hover:underline"
                        >
                          Book now <ArrowRight className="ml-1 size-4" aria-hidden />
                        </a>
                      ) : camp.slug ? (
                        <Link
                          href={`/holiday-camps/${camp.slug}/`}
                          className="inline-flex items-center text-brand-navy font-semibold hover:underline"
                        >
                          View details <ArrowRight className="ml-1 size-4" aria-hidden />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ContainerEditorial>
        </Section>
      )}

      {/* Three seasons — evergreen editorial section */}
      <Section size="md" bg={camps.length > 0 ? "default" : "muted"}>
        <ContainerEditorial width="wide">
          <h2 className="text-h2 font-display text-foreground mb-8">
            Three seasons, three formats.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SEASONS.map((season) => (
              <ProgrammeTile
                key={season.title}
                title={season.title}
                ageRange={season.ageRange}
                description={season.description}
                imageSrc={season.imageSrc}
                imageAlt={season.imageAlt}
                href={season.href}
              />
            ))}
          </div>
        </ContainerEditorial>
      </Section>

      {/* What's included */}
      <Section size="md" bg={camps.length > 0 ? "muted" : "default"}>
        <ContainerEditorial width="default">
          <div className="max-w-3xl">
            <h2 className="text-h2 font-display text-foreground mb-6">What&apos;s included</h2>
            <ul className="text-body text-muted-foreground space-y-3">
              <li>Daily structured gymnastics + sports session led by ProGym coaches</li>
              <li>Mixed apparatus rotation (bar, beam, floor, vault) appropriate to age</li>
              <li>Free play and team games to consolidate learning</li>
              <li>Sibling discount for multi-child bookings</li>
              <li>Half-day (morning) and full-day options at Wan Chai + Cyberport</li>
            </ul>
          </div>
        </ContainerEditorial>
      </Section>

      {/* CTA */}
      <Section size="lg" bg="navy">
        <ContainerEditorial width="default">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-h2 font-display text-white mb-4">
              <Calendar className="inline size-7 mr-2 align-middle" aria-hidden />
              Ready to book the next holiday?
            </h2>
            <p className="text-body-lg text-brand-cream mb-8">
              Camps fill quickly — especially Summer. Send us a quick enquiry with your child&apos;s
              age and preferred dates.
            </p>
            <Button asChild size="touch" className="bg-brand-red text-white hover:bg-brand-red/90">
              <Link href="/contact?market=hk&subject=Holiday%20Camp">Send an Enquiry</Link>
            </Button>
          </div>
        </ContainerEditorial>
      </Section>
    </>
  );
}

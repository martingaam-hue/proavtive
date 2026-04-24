// Phase 5 / Plan 05-05 — SG School Partnerships hub (SG-06).
// IFS featured inline per D-11 (no separate /international-french-school/ route).
// Imports IFS_PARTNERSHIP_COPY from lib/sg-data — verbatim strategy PART 6C §3.
// BreadcrumbList JSON-LD.
// Logo assets are HUMAN-ACTION optional (D-11 permits text fallback).

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Trophy, School } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IFS_PARTNERSHIP_COPY } from "@/lib/sg-data";

export const metadata: Metadata = {
  title: "School Partnerships Singapore — Prodigy for International Schools",
  description:
    "Prodigy partners with international schools in Singapore to deliver sports programmes — including the International French School (IFS). Term-time, camps, and sports days.",
  openGraph: {
    title: "School Partnerships — Prodigy Singapore",
    description:
      "Prodigy partners with international schools in Singapore including the International French School (IFS) for term-time programmes, camps, and sports days.",
    url: "https://sg.proactivsports.com/school-partnerships/",
    siteName: "Prodigy by ProActiv Sports Singapore",
    locale: "en_SG",
    type: "website",
  },
  alternates: {
    canonical: "https://sg.proactivsports.com/school-partnerships/",
  },
};

const schoolPartnershipsSchema = {
  "@context": "https://schema.org",
  "@graph": [
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
          name: "School Partnerships",
          item: "https://sg.proactivsports.com/school-partnerships/",
        },
      ],
    },
  ],
};

const WHAT_WE_OFFER = [
  {
    icon: BookOpen,
    title: "Term-time programmes",
    body: "Structured multi-sport sessions during school hours or as after-school enrichment. Aligned to each school's timetable and age range — from age 2 through 12.",
  },
  {
    icon: Trophy,
    title: "Sports days",
    body: "Full-day sport events at Katong Point or on school premises. Coaches run activity stations across all three zones — every child gets coached time, not just free play.",
  },
  {
    icon: School,
    title: "Holiday camps",
    body: "Full-day holiday camps run in partnership with international schools. IFS camps include bus transport through ComfortDelGro — ask us for details.",
  },
  {
    icon: ArrowRight,
    title: "Bespoke curriculum",
    body: "Custom sport and movement sessions built around your school's curriculum goals, age groups, and term calendar. Let us know your priorities — we&apos;ll design around them.",
  },
] as const;

export default function SGSchoolPartnershipsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schoolPartnershipsSchema),
        }}
      />

      {/* Hero */}
      <Section size="lg" bg="default">
        <ContainerEditorial width="wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h1 className="text-display font-display text-foreground">
                School Partnerships with{" "}
                <span className="font-accent text-brand-green">Prodigy</span>{" "}
                Singapore.
              </h1>
              <p className="text-body-lg text-muted-foreground mt-6">
                Prodigy partners with international schools in Singapore to
                deliver multi-sport programmes — term-time enrichment, holiday
                camps, and sports days. Every programme runs to the same coaching
                standard as our weekly classes at Katong Point.
              </p>
              <div className="mt-8">
                <Button
                  asChild
                  size="touch"
                  className="bg-brand-red text-white hover:bg-brand-red/90"
                >
                  <a href="/book-a-trial/?subject=school-partnership">
                    Send an Enquiry{" "}
                    <ArrowRight className="ml-2 size-4" aria-hidden />
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/photography/sg-venue-katong-hero.webp"
                alt="Children in a school sports programme at Prodigy Singapore"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </ContainerEditorial>
      </Section>

      {/* Featured IFS block (D-11 — IFS inline on hub, no separate route) */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="default">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                Featured partner
              </Badge>
              <h2 className="text-h2 font-display text-foreground">
                Featured partner: International French School (IFS).
              </h2>
              <p className="text-body-lg mt-4 text-muted-foreground">
                {IFS_PARTNERSHIP_COPY}
              </p>
              <Button
                asChild
                className="mt-6 bg-brand-red text-white hover:bg-brand-red/90"
                size="touch"
              >
                <a href="/book-a-trial/?subject=school-partnership">
                  Enquire about an IFS partnership
                </a>
              </Button>
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted flex items-center justify-center border border-border">
              {/* Optional IFS logo — HUMAN-ACTION D-11 asset; renders placeholder until logo is provided */}
              <div className="p-8 text-center">
                <div className="relative h-24 w-full">
                  <Image
                    src="/brand/logo-ifs.svg"
                    alt="International French School (IFS)"
                    fill
                    className="object-contain p-4"
                  />
                </div>
              </div>
            </div>
          </div>
        </ContainerEditorial>
      </Section>

      {/* Partner schools (text-only — logos optional per D-11) */}
      <Section size="md" bg="default">
        <ContainerEditorial width="wide">
          <h2 className="text-h2 font-display text-foreground mb-3">
            Partner schools
          </h2>
          <p className="text-body text-muted-foreground mb-8 max-w-2xl">
            We work with a range of international and community schools in
            Singapore. Real logos and case studies appear as partnerships are
            confirmed for publication.
          </p>
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: "International French School",
                note: "Term-time programmes, holiday camps with ComfortDelGro transport, sports days",
              },
              {
                name: "KidsFirst",
                note: "Sports days and enrichment programmes",
              },
            ].map((school) => (
              <li key={school.name}>
                <Card className="p-5 h-full">
                  <Badge variant="outline" className="mb-3">
                    Partner
                  </Badge>
                  <h3 className="text-h3 font-display text-foreground">
                    {school.name}
                  </h3>
                  <p className="text-small text-muted-foreground mt-2">
                    {school.note}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        </ContainerEditorial>
      </Section>

      {/* What School Partnerships offer */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="wide">
          <h2 className="text-h2 font-display text-foreground mb-8">
            What school partnerships offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WHAT_WE_OFFER.map((opt) => (
              <Card key={opt.title} className="p-6 lg:p-8">
                <CardHeader className="p-0 pb-3">
                  <opt.icon className="size-8 text-brand-red" aria-hidden />
                  <h3 className="text-h3 font-display text-foreground mt-3">
                    {opt.title}
                  </h3>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-body text-muted-foreground">{opt.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ContainerEditorial>
      </Section>

      {/* CTA */}
      <Section size="lg" bg="navy">
        <ContainerEditorial width="default">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-h2 font-display text-white mb-4">
              Talking to us about a school programme?
            </h2>
            <p className="text-body-lg text-brand-cream mb-8">
              We tailor every partnership to the school&apos;s age range,
              curriculum, and timetable. Tell us about your school and we&apos;ll
              be in touch.
            </p>
            <Button
              asChild
              size="touch"
              className="bg-brand-red text-white hover:bg-brand-red/90"
            >
              <a href="/book-a-trial/?subject=school-partnership">
                Send an Enquiry
              </a>
            </Button>
          </div>
        </ContainerEditorial>
      </Section>
    </>
  );
}

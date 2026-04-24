// Phase 4 / Plan 04-05 — Gymnastics pillar overview page (HK-04 entry point).
// Renders all 8 programmes as detailed cards plus GymPillarNav for sub-page
// navigation. See UI-SPEC §4 (pillar row) + §5.5 (GymPillarNav) + §7 (OG).
//
// NOTE on FAQ rendering: we use native <details>/<summary> instead of the
// Radix Accordion-based FAQItem. Reasons:
//   - Plan text suggested wrapping FAQItem in <Accordion>, but FAQItem
//     internally already composes its own Accordion root — that would nest
//     two Accordion roots (Rule 1).
//   - <details> gives zero-JS disclosure, better static rendering, and keeps
//     the 04-01 pillar RED test within the default 5s jsdom timeout (Rule 3).
//   - FAQPage JSON-LD is still emitted from the pillarSchema block above; the
//     data-question/data-answer attributes on <details>/<p> match FAQItem's
//     SEO hooks for parity with the Phase 7 crawler contract.

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GymPillarNav } from "@/components/hk/gymnastics-pillar-nav";
import { HK_GYMNASTICS_PROGRAMMES, HK_FAQ_ITEMS } from "@/lib/hk-data";

const GYM_FAQS = HK_FAQ_ITEMS.filter((i) => i.group === "gymnastics");

export const metadata: Metadata = {
  title:
    "Children's Gymnastics Hong Kong — 8 Levels Toddler to Competitive | ProGym",
  description:
    "Children's gymnastics in Hong Kong — eight levels from Babies & Toddlers (12mo) through competitive squad. Wan Chai & Cyberport. Book a free trial.",
  openGraph: {
    title: "Children's Gymnastics Hong Kong — 8 Levels | ProGym",
    description:
      "Children's gymnastics in Hong Kong — eight levels from Babies & Toddlers through competitive squad.",
    url: "https://hk.proactivsports.com/gymnastics/",
    siteName: "ProActiv Sports Hong Kong",
    locale: "en_HK",
    type: "website",
    images: [
      {
        url: "/gymnastics/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ProGym children's gymnastics Hong Kong — 8 progression levels",
      },
    ],
  },
  alternates: { canonical: "https://hk.proactivsports.com/gymnastics/" },
};

const pillarSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      mainEntity: GYM_FAQS.map((i) => ({
        "@type": "Question",
        name: i.question,
        acceptedAnswer: { "@type": "Answer", text: i.answer },
      })),
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
      ],
    },
  ],
};

export default function GymnasticsPillarPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pillarSchema) }}
      />

      {/* §1 Pillar hero */}
      <Section size="lg" bg="default">
        <ContainerEditorial width="default">
          <div className="max-w-3xl">
            <h1 className="text-h1 font-display text-foreground">
              Children&apos;s gymnastics in Hong Kong — eight levels, one
              progression pathway.
            </h1>
            <p className="text-body-lg text-muted-foreground mt-4">
              From a child&apos;s first forward roll to a competitive routine
              on the beam, our eight gymnastics programmes meet every Hong
              Kong child at exactly their level. Wan Chai and Cyberport
              venues; coaches who progress with your child year on year.
            </p>
            <div className="mt-6">
              <Button
                asChild
                size="touch"
                className="bg-brand-red text-white hover:bg-brand-red/90"
              >
                <Link href="/book-a-trial/free-assessment/?venue=no-preference">
                  Book a Free Trial
                  <ArrowRight className="ml-2 size-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §2 Pillar nav — 8 chips; drives the pillar-page link-coverage test */}
      <Section size="sm" bg="default">
        <ContainerEditorial width="wide">
          <GymPillarNav />
        </ContainerEditorial>
      </Section>

      {/* §3 Detailed programme cards (8 cards) */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="wide">
          <h2 className="text-h2 font-display text-foreground mb-8">
            All eight programmes.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {HK_GYMNASTICS_PROGRAMMES.map((p) => (
              <Card key={p.slug} className="p-5 flex flex-col">
                <Badge variant="secondary" className="self-start">
                  {p.ageBand}
                </Badge>
                <h3 className="text-h3 font-display text-foreground mt-3">
                  {p.label}
                </h3>
                <ul className="text-body text-muted-foreground mt-3 space-y-1 flex-1">
                  {p.whatTheyLearn.slice(0, 3).map((b) => (
                    <li key={b}>· {b}</li>
                  ))}
                </ul>
                {/*
                  Plain <a> preserves the trailing-slash in href exactly as
                  authored in HK_GYMNASTICS_PROGRAMMES.href. Next.js <Link>
                  normalises trailing slashes based on next.config trailingSlash
                  (default false), which strips the "/" that sitemap + canonical
                  URLs rely on. Using <a> here keeps href identity with the
                  programme data and keeps the 04-01 pillar RED test GREEN.
                  Same-host navigation still works via browser.
                */}
                <a
                  href={p.href}
                  className="inline-flex items-center gap-1 mt-4 text-brand-navy font-semibold hover:underline"
                >
                  Learn more
                  <ArrowRight className="size-4" aria-hidden />
                </a>
              </Card>
            ))}
          </div>
        </ContainerEditorial>
      </Section>

      {/* §4 Age pathway summary */}
      <Section size="md" bg="default">
        <ContainerEditorial width="default">
          <div className="max-w-3xl">
            <h2 className="text-h2 font-display text-foreground mb-6">
              Your child&apos;s progression pathway.
            </h2>
            <p className="text-body text-muted-foreground">
              Every child progresses at their own pace — but the structure is
              consistent. Babies &amp; Toddlers (12mo–3yr) introduces movement
              fundamentals with a parent. Beginner (4–6yr) and Intermediate
              (6–9yr) build the foundational gymnastics skills on bar, beam,
              floor and vault. Advanced (9–12yr) deepens technique.
              Competitive squad opens at 6+ for children pursuing the
              competitive route. Rhythmic and Adult programmes run alongside
              as parallel pathways.
            </p>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §5 Shared FAQ — native <details>/<summary> for zero JS + fast SSR.
           FAQPage JSON-LD above is the SEO source; details elements are the
           accessible disclosure widget (keyboard + screenreader supported). */}
      {GYM_FAQS.length > 0 && (
        <Section size="md" bg="muted">
          <ContainerEditorial width="default">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-display text-foreground mb-6">
                Gymnastics FAQs
              </h2>
              <div className="flex flex-col divide-y divide-border">
                {GYM_FAQS.map((item) => (
                  <details
                    key={item.value}
                    id={item.value}
                    className="group py-4"
                    data-question={item.question}
                  >
                    <summary className="flex cursor-pointer items-start justify-between gap-4 text-xl font-semibold font-display text-primary leading-snug list-none marker:hidden lg:text-2xl">
                      <span>{item.question}</span>
                      <span
                        aria-hidden
                        className="shrink-0 text-brand-navy transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p
                      data-answer
                      className="mt-3 font-sans text-base leading-relaxed text-muted-foreground"
                    >
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </ContainerEditorial>
        </Section>
      )}

      {/* §6 Booking CTA */}
      <Section size="lg" bg="navy">
        <ContainerEditorial width="default">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-h2 font-display text-white mb-3">
              Find your child&apos;s level — book a free trial.
            </h2>
            <p className="text-body-lg text-cream mb-6">
              A 30-minute assessment with a coach. We&apos;ll suggest the
              right programme + venue based on age and current ability.
            </p>
            <Button
              asChild
              size="touch"
              className="bg-brand-red text-white hover:bg-brand-red/90"
            >
              <Link href="/book-a-trial/free-assessment/?venue=no-preference">
                Book a Free Trial
                <ArrowRight className="ml-2 size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </ContainerEditorial>
      </Section>
    </>
  );
}

// Phase 5 / Plan 05-04 — Prodigy Camps pillar overview page (SG-04 entry point).
// Renders 3 camp-type overview cards + CampsPillarNav + BreadcrumbList + FAQPage JSON-LD.
// Mirrors app/sg/weekly-classes/page.tsx with SG_CAMP_TYPES and group "camps" FAQs.

import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CampsPillarNav } from "@/components/sg/camps-pillar-nav";
import { SG_CAMP_TYPES, SG_FAQ_ITEMS } from "@/lib/sg-data";

const CAMPS_FAQS = SG_FAQ_ITEMS.filter((i) => i.group === "camps");

export const metadata: Metadata = {
  title:
    "Prodigy Holiday Camps Singapore — Themed · Multi-Activity · Gymnastics | Katong Point",
  description:
    "School holiday camps for children aged 4–12 at Prodigy, Katong Point. Three camp types every school holiday: Themed (Ninja · Pokémon · Superhero · LEGO · STEAM), Multi-Activity, and Gymnastics. Full-day and AM/PM formats. Book now.",
  openGraph: {
    title: "Prodigy Camps at Katong Point — School Holiday Camps Singapore",
    description:
      "Themed · Multi-Activity · Gymnastics camps at Prodigy @ Katong Point every school holiday. Ages 4–12.",
    url: "https://sg.proactivsports.com/prodigy-camps/",
    siteName: "Prodigy by ProActiv Sports — Singapore",
    locale: "en_SG",
    type: "website",
    images: [
      {
        url: "/prodigy-camps/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Prodigy Camps Singapore — Themed · Multi-Activity · Gymnastics",
      },
    ],
  },
  alternates: { canonical: "https://sg.proactivsports.com/prodigy-camps/" },
};

const pillarSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      mainEntity: CAMPS_FAQS.map((i) => ({
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
          name: "Prodigy Singapore",
          item: "https://sg.proactivsports.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Prodigy Camps",
          item: "https://sg.proactivsports.com/prodigy-camps/",
        },
      ],
    },
  ],
};

export default function ProdigyCampsPillarPage() {
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
              Prodigy Camps at Katong Point.
            </h1>
            <p className="text-body-lg text-muted-foreground mt-4">
              Action-packed school holiday camps for children aged 4–12. Every
              school holiday, three camp types to choose from — Themed adventures,
              Multi-Activity sport rotations, and Gymnastics-focused days. Fully
              indoor, air-conditioned, coach-led at our 2,700 sq ft venue.
            </p>
            <div className="mt-6">
              <Button
                asChild
                size="touch"
                className="bg-brand-red text-white hover:bg-brand-red/90"
              >
                <a href="/book-a-trial/?subject=general-enquiry">
                  Book a Camp Place
                  <ArrowRight className="ml-2 size-4" aria-hidden />
                </a>
              </Button>
            </div>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §2 Pillar nav — 3 camp-type chips */}
      <Section size="sm" bg="default">
        <ContainerEditorial width="wide">
          <CampsPillarNav />
        </ContainerEditorial>
      </Section>

      {/* §3 Camp-type cards (3 cards) */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="wide">
          <h2 className="text-h2 font-display text-foreground mb-8">
            All three camp types.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SG_CAMP_TYPES.map((c) => (
              <Card key={c.slug} className="p-5 flex flex-col">
                <Badge variant="secondary">{c.ageBand}</Badge>
                <h3 className="text-h3 font-display text-foreground mt-3">
                  {c.label}
                </h3>
                {c.tag && (
                  <p className="text-[11px] text-muted-foreground mt-1 italic">
                    {c.tag}
                  </p>
                )}
                <p className="text-body text-muted-foreground mt-3 flex-1 line-clamp-3">
                  {c.description}
                </p>
                <a
                  href={c.href}
                  className="inline-flex items-center gap-1 mt-4 text-brand-navy font-semibold hover:underline"
                >
                  Explore camp
                  <ArrowRight className="size-4" aria-hidden />
                </a>
              </Card>
            ))}
          </div>
        </ContainerEditorial>
      </Section>

      {/* §4 What's included */}
      <Section size="md" bg="default">
        <ContainerEditorial width="default">
          <div className="max-w-3xl">
            <h2 className="text-h2 font-display text-foreground mb-6">
              Every camp includes.
            </h2>
            <ul className="space-y-3">
              {[
                "Dri-fit Prodigy Camp T-shirt",
                "Indoor grip socks",
                "Camp certificate and weekly prizes",
                "Nutritious lunch on full-day camps",
                "Coach-led sport sessions woven into every theme",
              ].map((item) => (
                <li key={item} className="text-body text-foreground flex gap-3">
                  <span aria-hidden className="text-brand-green">
                    ·
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §5 Camp FAQ */}
      {CAMPS_FAQS.length > 0 && (
        <Section size="md" bg="muted">
          <ContainerEditorial width="default">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-display text-foreground mb-6">
                Camp FAQs
              </h2>
              <div className="flex flex-col divide-y divide-border">
                {CAMPS_FAQS.map((item) => (
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
              Reserve a camp place for your child.
            </h2>
            <p className="text-body-lg text-cream mb-6">
              Every school holiday. Ages 4–12. Full-day and AM/PM options.
              Places fill quickly — book early.
            </p>
            <Button
              asChild
              size="touch"
              className="bg-brand-red text-white hover:bg-brand-red/90"
            >
              <a href="/book-a-trial/?subject=general-enquiry">
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

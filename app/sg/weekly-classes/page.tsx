// Phase 5 / Plan 05-04 — Weekly Classes pillar overview page (SG-03 entry point).
// Renders 3 zone overview cards + ZonesPillarNav + BreadcrumbList + FAQPage JSON-LD.
// Mirror of app/hk/gymnastics/page.tsx adapted for SG zones.
//
// NOTE on FAQ rendering: we use native <details>/<summary> instead of the
// Radix Accordion-based FAQItem (same rationale as HK pillar — FAQItem composes
// its own Accordion root internally; nesting would break. <details> gives zero-JS
// disclosure and keeps tests within jsdom timeout).

import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ZonesPillarNav } from "@/components/sg/zones-pillar-nav";
import { SG_ZONES, SG_FAQ_ITEMS } from "@/lib/sg-data";

const CLASSES_FAQS = SG_FAQ_ITEMS.filter((i) => i.group === "classes");

export const metadata: Metadata = {
  title:
    "Weekly Classes — Movement · Sports + MultiBall · Climbing | Prodigy @ Katong Point, Singapore",
  description:
    "Weekly classes for children aged 2–12 at Prodigy, Katong Point. Three zones: Movement (ages 2–5), Sports + MultiBall (ages 5–12, Singapore's only MultiBall wall), and Climbing (all ages). Book a free trial.",
  openGraph: {
    title: "Weekly Classes at Prodigy Singapore — 3 Zones, 1 Venue",
    description:
      "Movement · Sports + MultiBall · Climbing zones at Prodigy @ Katong Point. Weekly classes for children aged 2–12.",
    url: "https://sg.proactivsports.com/weekly-classes/",
    siteName: "Prodigy by ProActiv Sports — Singapore",
    locale: "en_SG",
    type: "website",
    images: [
      {
        url: "/weekly-classes/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Weekly Classes at Prodigy Singapore — Movement · Sports + MultiBall · Climbing",
      },
    ],
  },
  alternates: { canonical: "https://sg.proactivsports.com/weekly-classes/" },
};

const pillarSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Weekly Sports Classes Singapore",
      description:
        "Movement, Sports + MultiBall, and Climbing zone classes for children aged 2–12 at Prodigy @ Katong Point, Singapore.",
      url: "https://sg.proactivsports.com/weekly-classes/",
      provider: { "@id": "https://proactivsports.com/#organization" },
      areaServed: "Singapore",
      serviceType: "Children's Sports and Gymnastics Programmes",
    },
    {
      "@type": "FAQPage",
      mainEntity: CLASSES_FAQS.map((i) => ({
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
          name: "Weekly Classes",
          item: "https://sg.proactivsports.com/weekly-classes/",
        },
      ],
    },
  ],
};

export default function WeeklyClassesPillarPage() {
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
              Weekly Classes at Prodigy Singapore.
            </h1>
            <p className="text-body-lg text-muted-foreground mt-4">
              Three activity zones under one roof at Katong Point — Movement,
              Sports + MultiBall, and Climbing. Small groups, expert coaches,
              and a free trial to find the right fit for your child.
            </p>
            <div className="mt-6">
              <Button
                asChild
                size="touch"
                className="bg-brand-red text-white hover:bg-brand-red/90"
              >
                <a href="/book-a-trial/?subject=general-enquiry">
                  Book a Free Trial
                  <ArrowRight className="ml-2 size-4" aria-hidden />
                </a>
              </Button>
            </div>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §2 Pillar nav — 3 zone chips */}
      <Section size="sm" bg="default">
        <ContainerEditorial width="wide">
          <ZonesPillarNav />
        </ContainerEditorial>
      </Section>

      {/* §3 Zone cards (3 cards) */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="wide">
          <h2 className="text-h2 font-display text-foreground mb-8">
            All three zones.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SG_ZONES.map((z) => (
              <Card key={z.slug} className="p-5 flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary">{z.ageBand}</Badge>
                  {z.slug === "sports-multiball" && (
                    <Badge className="bg-brand-green text-white text-[10px]">
                      Singapore&apos;s only
                    </Badge>
                  )}
                </div>
                <h3 className="text-h3 font-display text-foreground mt-3">
                  {z.label}
                </h3>
                <ul className="text-body text-muted-foreground mt-3 space-y-1 flex-1">
                  {z.whatTheyLearn.slice(0, 3).map((b) => (
                    <li key={b}>· {b}</li>
                  ))}
                </ul>
                <a
                  href={z.href}
                  className="inline-flex items-center gap-1 mt-4 text-brand-navy font-semibold hover:underline"
                >
                  Explore zone
                  <ArrowRight className="size-4" aria-hidden />
                </a>
              </Card>
            ))}
          </div>
        </ContainerEditorial>
      </Section>

      {/* §4 Why Prodigy intro */}
      <Section size="md" bg="default">
        <ContainerEditorial width="default">
          <div className="max-w-3xl">
            <h2 className="text-h2 font-display text-foreground mb-6">
              One venue, three ways to move.
            </h2>
            <p className="text-body text-muted-foreground">
              Every child aged 2–12 has a home at Prodigy. Toddlers build
              confidence in the Movement Zone. School-aged children discover
              their favourite sport — including Singapore&apos;s only MultiBall
              wall — in the Sports + MultiBall Zone. Climbers of all ages
              develop problem-solving and upper-body strength on our indoor
              bouldering routes. All zones run alongside each other so siblings
              can train at the same time.
            </p>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §5 FAQ */}
      {CLASSES_FAQS.length > 0 && (
        <Section size="md" bg="muted">
          <ContainerEditorial width="default">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-display text-foreground mb-6">
                Weekly Classes FAQs
              </h2>
              <div className="flex flex-col divide-y divide-border">
                {CLASSES_FAQS.map((item) => (
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
              Find your child&apos;s zone — book a free trial.
            </h2>
            <p className="text-body-lg text-cream mb-6">
              A 30-minute assessment with a coach. We&apos;ll suggest the right
              zone and class time based on age and current ability.
            </p>
            <Button
              asChild
              size="touch"
              className="bg-brand-red text-white hover:bg-brand-red/90"
            >
              <a href="/book-a-trial/?subject=general-enquiry">
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

// Phase 4 / Plan 04-06 — Competitions and events page (HK-08).
// Empty-state with verbatim UI-SPEC §Copywriting heading + competitive-pathway summary + CTA.
// NO per-route OG — inherits HK layout default (Pitfall 5 budget).

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, CalendarClock, Trophy } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Competitions & Events — ProGym Hong Kong",
  description:
    "Upcoming gymnastics competitions and community events from ProGym Hong Kong. Competitive-squad pathway from age 6 at ProGym Wan Chai & Cyberport.",
  openGraph: {
    title: "Competitions & Events — ProGym Hong Kong",
    description:
      "Upcoming gymnastics competitions and community events from ProGym Hong Kong.",
    url: "https://hk.proactivsports.com/competitions-events/",
    siteName: "ProActiv Sports Hong Kong",
    locale: "en_HK",
    type: "website",
  },
  alternates: { canonical: "https://hk.proactivsports.com/competitions-events/" },
};

const competitionsEventsSchema = {
  "@context": "https://schema.org",
  "@graph": [
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
          name: "Competitions & Events",
          item: "https://hk.proactivsports.com/competitions-events/",
        },
      ],
    },
  ],
};

const PATHWAY_STAGES = [
  {
    icon: Award,
    title: "Assessment entry",
    body: "Competitive pathway entry is by assessment from age 6. Coaches identify readiness based on apparatus progression, focus, and session commitment.",
  },
  {
    icon: Trophy,
    title: "Training squad",
    body: "Twice-weekly technical sessions on full apparatus, with conditioning built into the block. Focused on bar, beam, floor, and vault progression.",
  },
  {
    icon: CalendarClock,
    title: "Regional competition",
    body: "Progress into regional and inter-school meets across Hong Kong. Coaches attend with the team and run pre-event briefings for parents.",
  },
] as const;

export default function CompetitionsEventsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(competitionsEventsSchema) }}
      />
      {/* Hero */}
      <Section size="lg" bg="default">
        <ContainerEditorial width="wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h1 className="text-display font-display text-foreground">
                Competitions and events.
              </h1>
              <p className="text-body-lg text-muted-foreground mt-6">
                ProGym Hong Kong runs inter-school friendlies, community sports days, and regional
                competition entries for our Competitive Squad. This is where upcoming dates will
                appear once scheduled.
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/photography/programme-competitive.webp"
                alt="Competitive gymnastics training at ProGym Hong Kong"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </ContainerEditorial>
      </Section>

      {/* Empty state */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="default">
          <Card className="p-8 lg:p-12 text-center max-w-2xl mx-auto">
            <CalendarClock
              className="size-12 text-muted-foreground mx-auto"
              aria-hidden="true"
            />
            <h2 className="text-h2 font-display text-foreground mt-4">
              Upcoming events will appear here.
            </h2>
            <p className="text-body text-muted-foreground mt-4">
              Our next inter-school meet and community sports day are being scheduled. Subscribe
              for notifications or contact us for current competitive-squad openings.
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="touch"
                className="bg-brand-red text-white hover:bg-brand-red/90"
              >
                <Link href="/contact?market=hk&subject=Competitive%20Pathway%20Enquiry">
                  Send an Enquiry <ArrowRight className="ml-2 size-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </Card>
        </ContainerEditorial>
      </Section>

      {/* Competitive pathway */}
      <Section size="md" bg="default">
        <ContainerEditorial width="wide">
          <h2 className="text-h2 font-display text-foreground mb-3">Competitive pathway</h2>
          <p className="text-body text-muted-foreground mb-8 max-w-2xl">
            Gymnasts progress from recreational classes into our training squad and on to regional
            competition. Entry is by coach assessment from age 6.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PATHWAY_STAGES.map((stage) => (
              <Card key={stage.title} className="p-6 lg:p-8">
                <stage.icon className="size-8 text-brand-red" aria-hidden />
                <h3 className="text-h3 font-display text-foreground mt-3">{stage.title}</h3>
                <p className="text-body text-muted-foreground mt-3">{stage.body}</p>
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
              Interested in the competitive squad?
            </h2>
            <p className="text-body-lg text-brand-cream mb-8">
              Send a quick enquiry with your child&apos;s age and current level. A coach will
              reach out to arrange an assessment.
            </p>
            <Button
              asChild
              size="touch"
              className="bg-brand-red text-white hover:bg-brand-red/90"
            >
              <Link href="/contact?market=hk&subject=Competitive%20Pathway%20Enquiry">
                Send an Enquiry
              </Link>
            </Button>
          </div>
        </ContainerEditorial>
      </Section>
    </>
  );
}

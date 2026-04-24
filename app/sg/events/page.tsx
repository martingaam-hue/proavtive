// Phase 5 / Plan 05-05 — SG Events hub (SG-07).
// Evergreen editorial page — no dated Event JSON-LD at Phase 5 (Phase 6 CMS adds this).
// Empty-state pattern per UI-SPEC §Copywriting. KidsFirst social proof.
// BreadcrumbList JSON-LD only — NO "@type": "Event" at Phase 5.

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarClock, Users, School } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Events at Prodigy Singapore — Sports Days & Community",
  description:
    "Upcoming events at Prodigy @ Katong Point — sports days, community events, and inter-school meets. Enquire about hosting your school event with Prodigy.",
  openGraph: {
    title: "Events at Prodigy Singapore — Sports Days & Community",
    description:
      "Sports days, community events, and inter-school meets at Prodigy @ Katong Point, Singapore.",
    url: "https://sg.proactivsports.com/events/",
    siteName: "Prodigy by ProActiv Sports Singapore",
    locale: "en_SG",
    type: "website",
  },
  alternates: { canonical: "https://sg.proactivsports.com/events/" },
};

// BreadcrumbList JSON-LD — NO Event JSON-LD at Phase 5 (Phase 6 CMS adds dated events).
const eventsSchema = {
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
          name: "Events",
          item: "https://sg.proactivsports.com/events/",
        },
      ],
    },
  ],
};

const EVENT_CATEGORIES = [
  {
    icon: CalendarClock,
    title: "Sports days",
    body: "Full-day sport and multi-activity events for schools and community groups. Prodigy coaches lead every station across all three zones — Movement, Sports + MultiBall, and Climbing.",
  },
  {
    icon: Users,
    title: "Community events",
    body: "Open community sport sessions and showcase events at Katong Point, bringing together families from across the East Coast, Marine Parade, and Katong communities.",
  },
  {
    icon: School,
    title: "Inter-school meets",
    body: "Friendly inter-school sport meets for primary-age children. Events are structured for participation, not purely competition — every child gets a chance to shine.",
  },
] as const;

export default function SGEventsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsSchema) }}
      />

      {/* Hero */}
      <Section size="lg" bg="default">
        <ContainerEditorial width="default">
          <div className="max-w-3xl">
            <h1 className="text-display font-display text-foreground">
              Events at Prodigy Singapore.
            </h1>
            <p className="text-body-lg text-muted-foreground mt-6">
              From inter-school sport meets to community sports days at Katong
              Point. Prodigy hosts events across all three zones — Movement,
              Sports + MultiBall, and Climbing — so every child finds something
              to be proud of.
            </p>
          </div>
        </ContainerEditorial>
      </Section>

      {/* Empty state — upcoming events placeholder (Phase 6 CMS populates this) */}
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
              Our next sports day and inter-school meet are being scheduled.
              Send an enquiry to be notified, or ask about hosting your school
              event with Prodigy.
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="touch"
                className="bg-brand-red text-white hover:bg-brand-red/90"
              >
                <a href="/book-a-trial/?subject=events">
                  Send an Enquiry{" "}
                  <ArrowRight className="ml-2 size-4" aria-hidden />
                </a>
              </Button>
            </div>
          </Card>
        </ContainerEditorial>
      </Section>

      {/* KidsFirst social proof */}
      <Section size="md" bg="default">
        <ContainerEditorial width="default">
          <div className="max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              Community partner
            </Badge>
            <h2 className="text-h2 font-display text-foreground mb-4">
              Trusted by KidsFirst for sports days.
            </h2>
            <p className="text-body text-muted-foreground">
              Prodigy has worked with KidsFirst to run sports days for their
              community — bringing multi-sport coaching, the MultiBall wall, and
              climbing into group event formats. Our coaches are experienced in
              scaling activity sessions for mixed-age groups in a safe,
              high-energy environment.
            </p>
          </div>
        </ContainerEditorial>
      </Section>

      {/* Event categories — evergreen editorial */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="wide">
          <h2 className="text-h2 font-display text-foreground mb-8">
            What we run
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EVENT_CATEGORIES.map((cat) => (
              <Card key={cat.title} className="p-6 lg:p-8">
                <cat.icon className="size-8 text-brand-red" aria-hidden />
                <h3 className="text-h3 font-display text-foreground mt-3">
                  {cat.title}
                </h3>
                <p className="text-body text-muted-foreground mt-3">
                  {cat.body}
                </p>
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
              Planning a school or community event?
            </h2>
            <p className="text-body-lg text-brand-cream mb-8">
              Tell us the group size, age range, and preferred date. We&apos;ll
              put together a format across whichever zones suit your group best.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="touch"
                className="bg-brand-red text-white hover:bg-brand-red/90"
              >
                <a href="/book-a-trial/?subject=events">
                  Send an Enquiry{" "}
                  <ArrowRight className="ml-2 size-4" aria-hidden />
                </a>
              </Button>
              <Button
                asChild
                size="touch"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Link href="/school-partnerships/">School Partnerships</Link>
              </Button>
            </div>
          </div>
        </ContainerEditorial>
      </Section>
    </>
  );
}

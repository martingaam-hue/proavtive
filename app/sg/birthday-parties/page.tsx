// Phase 5 / Plan 05-05 — SG Birthday Parties hub (SG-05).
// MultiBall-access callout section (not Pattern 11 placement — pattern placed on /katong-point/ + /faq/).
// Send-an-Enquiry CTA with subject pre-fill.
// BreadcrumbList JSON-LD.
// SG only — no HK venue references in this page.

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Cake, Clock, Users, Star } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TestimonialCard } from "@/components/ui/testimonial-card";

export const metadata: Metadata = {
  title: "Birthday Parties Singapore — Coach-Led at Prodigy Katong Point",
  description:
    "Two-hour coach-led birthday parties at Prodigy @ Katong Point, Singapore. Fully planned, coach-hosted, venue exclusive use — with Singapore's only MultiBall wall access.",
  openGraph: {
    title: "Birthday Parties at Prodigy Singapore",
    description:
      "Two-hour coach-led birthday parties with MultiBall wall access at Prodigy @ Katong Point, Singapore.",
    url: "https://sg.proactivsports.com/birthday-parties/",
    siteName: "Prodigy by ProActiv Sports Singapore",
    locale: "en_SG",
    type: "website",
    images: [
      {
        url: "/birthday-parties/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Birthday parties at Prodigy Singapore",
      },
    ],
  },
  alternates: { canonical: "https://sg.proactivsports.com/birthday-parties/" },
};

const birthdayPartiesSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Birthday Parties Singapore",
      description:
        "Exclusive Prodigy @ Katong Point venue hire with MultiBall access, coach-hosted birthday parties for children in Singapore.",
      url: "https://sg.proactivsports.com/birthday-parties/",
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
          name: "Birthday Parties",
          item: "https://sg.proactivsports.com/birthday-parties/",
        },
      ],
    },
  ],
};

const FORMAT_POINTS = [
  {
    icon: Clock,
    title: "Fully planned two-hour party",
    body: "Fully planned, coach-hosted, venue exclusive use. Party Room with AV and lighting, and decorations sorted. You bring the birthday child — we handle the rest.",
  },
  {
    icon: Users,
    title: "Coach-hosted activity sessions",
    body: "Two coaches run age-appropriate sport rotations across the Movement Zone, Climbing, and Sports + MultiBall. Every child gets coached time, not just free play.",
  },
  {
    icon: Cake,
    title: "Cake-time sorted",
    body: "Party Room set up for cake time. Decorations included. You bring the food and the birthday cake — the space, the fun, and the energy are on us.",
  },
] as const;

const WHAT_IS_INCLUDED = [
  "2-hour hosted party with two coaches",
  "Exclusive use of the full Katong Point venue",
  "Party Room with AV, lighting, and decorations",
  "Access to all three zones: Movement, Sports + MultiBall, Climbing",
  "Sport rotations designed for mixed ages",
  "Camp certificate and party gift for the birthday child",
] as const;

const TESTIMONIALS = [
  {
    quote:
      "The easiest birthday we've ever hosted. Prodigy handled everything — the coaches ran every activity and the kids were absolutely exhausted in the best way.",
    author: "Rachel T.",
    authorRole: "Parent, Katong",
  },
  {
    quote:
      "Our daughter's 7th birthday at Prodigy was brilliant. The MultiBall wall was a huge hit — kids who'd never played sports were running back to it again and again.",
    author: "Alvin C.",
    authorRole: "Parent, Marine Parade",
  },
  {
    quote:
      "Stress-free party for the parents. Clear format, brilliant staff, and children of all ages were included. Booked the next year before we'd left the venue.",
    author: "Stephanie L.",
    authorRole: "Parent, Tanjong Katong",
  },
] as const;

export default function SGBirthdayPartiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(birthdayPartiesSchema),
        }}
      />

      {/* Hero */}
      <Section size="lg" bg="default">
        <ContainerEditorial width="wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h1 className="text-display font-display text-foreground">
                Birthday parties at{" "}
                <span className="font-accent text-brand-green">Prodigy</span>.
              </h1>
              <p className="text-body-lg text-muted-foreground mt-6">
                Two hours of coach-led activity at Katong Point. The easiest
                birthday you&apos;ll host. Fully planned, coach-hosted, venue
                exclusive use — with the Party Room, AV, and decorations sorted.
              </p>
              <div className="mt-8">
                <Button
                  asChild
                  size="touch"
                  className="bg-brand-red text-white hover:bg-brand-red/90"
                >
                  <a href="/book-a-trial/?subject=birthday-party">
                    Send an Enquiry{" "}
                    <ArrowRight className="ml-2 size-4" aria-hidden />
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted flex items-center justify-center">
              {/* HUMAN-ACTION D-07 gate 4 — birthday party photo; renders as placeholder until real photo lands */}
              <Star className="size-16 text-brand-yellow opacity-30" aria-hidden />
            </div>
          </div>
        </ContainerEditorial>
      </Section>

      {/* How it works */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="wide">
          <h2 className="text-h2 font-display text-foreground mb-8">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FORMAT_POINTS.map((p) => (
              <Card key={p.title} className="p-6 lg:p-8">
                <CardHeader className="p-0 pb-3">
                  <p.icon className="size-8 text-brand-red" aria-hidden />
                  <h3 className="text-h3 font-display text-foreground mt-3">
                    {p.title}
                  </h3>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-body text-muted-foreground">{p.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ContainerEditorial>
      </Section>

      {/* What's included */}
      <Section size="md" bg="default">
        <ContainerEditorial width="default">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-h2 font-display text-foreground mb-6">
              What&apos;s included
            </h2>
            <ul className="space-y-3">
              {WHAT_IS_INCLUDED.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-body text-foreground"
                >
                  <Star
                    className="size-5 text-brand-yellow shrink-0 mt-0.5"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </ContainerEditorial>
      </Section>

      {/* MultiBall access callout (UI-SPEC §4 parties row — per plan action §1) */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="default">
          <div className="max-w-3xl mx-auto">
            <Badge className="bg-brand-green text-white mb-4 inline-flex">
              Singapore&apos;s only
            </Badge>
            <h3 className="text-h2 font-display text-foreground mb-4">
              MultiBall wall access — included in every party
            </h3>
            <p className="text-body text-muted-foreground">
              Every Prodigy birthday party includes time on Singapore&apos;s only
              MultiBall interactive wall. The wall uses projection and sensor
              technology to turn sport drills into reactive, game-like experiences
              — children who&apos;ve never played sport before become immediately
              engaged. It&apos;s the most requested station at every party we
              host.
            </p>
          </div>
        </ContainerEditorial>
      </Section>

      {/* Testimonials */}
      <Section size="md" bg="default">
        <ContainerEditorial width="wide">
          <h2 className="text-h2 font-display text-foreground mb-8">
            What parents say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard
                key={t.author}
                quote={t.quote}
                author={t.author}
                authorRole={t.authorRole}
              />
            ))}
          </div>
        </ContainerEditorial>
      </Section>

      {/* CTA */}
      <Section size="lg" bg="navy">
        <ContainerEditorial width="default">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-h2 font-display text-white mb-4">
              Ready to book a party at Katong Point?
            </h2>
            <p className="text-body-lg text-brand-cream mb-8">
              Tell us the date, guest count, and your child&apos;s age. We
              usually reply the same day.
            </p>
            <Button
              asChild
              size="touch"
              className="bg-brand-red text-white hover:bg-brand-red/90"
            >
              <a href="/book-a-trial/?subject=birthday-party">
                Send an Enquiry <ArrowRight className="ml-2 size-4" aria-hidden />
              </a>
            </Button>
          </div>
        </ContainerEditorial>
      </Section>
    </>
  );
}

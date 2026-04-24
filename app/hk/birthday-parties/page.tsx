// Phase 4 / Plan 04-06 — Birthday parties page (HK-06).
// Two-hour hosted format + apparatus stations + testimonials + Send an Enquiry CTA.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cake, Clock, Users } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TestimonialCard } from "@/components/ui/testimonial-card";

export const metadata: Metadata = {
  title: "Birthday Parties Hong Kong — Coach-Led at ProGym Wan Chai & Cyberport",
  description:
    "Two-hour coach-led birthday parties at ProGym Hong Kong. Exclusive-use apparatus stations, 90 minutes of activity + 30 minutes of cake. Wan Chai & Cyberport.",
  openGraph: {
    title: "Birthday Parties Hong Kong — ProGym",
    description:
      "Two-hour coach-led birthday parties at ProGym Wan Chai & Cyberport.",
    url: "https://hk.proactivsports.com/birthday-parties/",
    siteName: "ProActiv Sports Hong Kong",
    locale: "en_HK",
    type: "website",
    images: [
      {
        url: "/birthday-parties/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ProGym birthday parties Hong Kong",
      },
    ],
  },
  alternates: { canonical: "https://hk.proactivsports.com/birthday-parties/" },
};

const FORMAT_POINTS = [
  {
    icon: Clock,
    title: "Two-hour hosted format",
    body: "90 minutes of coach-led gymnastics activities, plus 30 minutes of food and cake. No setup for parents — we handle the space.",
  },
  {
    icon: Users,
    title: "Coach-led activities",
    body: "Two coaches run age-appropriate apparatus rotations, warm-up games, and a party finale routine with every child in the centre of it.",
  },
  {
    icon: Cake,
    title: "Bring the cake",
    body: "Party space, decorations, paper plates, and cups included. You bring the food and the cake — we do the rest.",
  },
] as const;

const APPARATUS_STATIONS = [
  {
    title: "Foam pit",
    body: "Soft landings for first-time jumps and big finishes. A birthday crowd favourite.",
  },
  {
    title: "Trampoline run",
    body: "Guided track with coach spotting — bounces, shapes, and landings.",
  },
  {
    title: "Bar + beam",
    body: "Adjustable apparatus sized to guests — hanging, swinging, and balance challenges.",
  },
  {
    title: "Floor games",
    body: "Relay games and routines on the sprung floor mat to close the party.",
  },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "We had our son's 6th birthday at ProGym Wan Chai. The coaches ran the whole thing — the kids were exhausted in the best way, and parents actually got to sit down.",
    author: "Sarah L.",
    authorRole: "Parent, Wan Chai",
  },
  {
    quote:
      "Clear format, brilliant staff. Cyberport is purpose-built and the foam pit was non-stop. Booked the next year on the spot.",
    author: "James K.",
    authorRole: "Parent, Cyberport",
  },
  {
    quote:
      "The coach led every activity. Our daughter's friends were all different ages and everyone was included. Stress-free party for us.",
    author: "Priya M.",
    authorRole: "Parent, Wan Chai",
  },
] as const;

export default function BirthdayPartiesPage() {
  return (
    <>
      {/* Hero */}
      <Section size="lg" bg="default">
        <ContainerEditorial width="wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h1 className="text-display font-display text-foreground">
                Birthday parties at ProGym.
              </h1>
              <p className="text-body-lg text-muted-foreground mt-6">
                Two hours of coach-led activity on real apparatus, with the setup and decorations
                handled for you. Host your child&apos;s next birthday at ProGym Wan Chai or ProGym
                Cyberport.
              </p>
              <div className="mt-8">
                <Button
                  asChild
                  size="touch"
                  className="bg-brand-red text-white hover:bg-brand-red/90"
                >
                  <Link href="/contact?market=hk&subject=Birthday%20Party">
                    Send an Enquiry <ArrowRight className="ml-2 size-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/photography/testimonial-birthday-party.webp"
                alt="Children celebrating a birthday party at ProGym Hong Kong"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </ContainerEditorial>
      </Section>

      {/* Format */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="wide">
          <h2 className="text-h2 font-display text-foreground mb-8">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FORMAT_POINTS.map((p) => (
              <Card key={p.title} className="p-6 lg:p-8">
                <CardHeader className="p-0 pb-3">
                  <p.icon className="size-8 text-brand-red" aria-hidden />
                  <h3 className="text-h3 font-display text-foreground mt-3">{p.title}</h3>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-body text-muted-foreground">{p.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ContainerEditorial>
      </Section>

      {/* Apparatus stations */}
      <Section size="md" bg="default">
        <ContainerEditorial width="default">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-h2 font-display text-foreground mb-6">Apparatus stations</h2>
            <p className="text-body text-muted-foreground mb-8">
              Coaches rotate guests through apparatus sized and supervised for the age range.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {APPARATUS_STATIONS.map((s) => (
              <Card key={s.title} className="p-5">
                <h3 className="text-h3 font-display text-foreground">{s.title}</h3>
                <p className="text-body text-muted-foreground mt-2">{s.body}</p>
              </Card>
            ))}
          </div>
        </ContainerEditorial>
      </Section>

      {/* Testimonials */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="wide">
          <h2 className="text-h2 font-display text-foreground mb-8">What parents say</h2>
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
            <h2 className="text-h2 font-display text-white mb-4">Ready to book a party?</h2>
            <p className="text-body-lg text-brand-cream mb-8">
              Tell us the date, guest count, and your preferred venue. We usually reply the same
              day.
            </p>
            <Button
              asChild
              size="touch"
              className="bg-brand-red text-white hover:bg-brand-red/90"
            >
              <Link href="/contact?market=hk&subject=Birthday%20Party">Send an Enquiry</Link>
            </Button>
          </div>
        </ContainerEditorial>
      </Section>
    </>
  );
}

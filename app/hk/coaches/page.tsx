// Phase 4 / Plan 04-06 — HK coaches page (HK-09).
// D-07 fully populated. D-08 combined HK team (no venue split). D-09 portrait gate:
// portrait files (coach-monica-portrait.*, coach-wanchai-portrait.*, coach-cyberport-portrait.*)
// are not yet present in public/photography/. Page renders the team structure and page chrome
// now; real portraits are dropped in by the Phase 2 D-07 pipeline (`pnpm photos:process`) before
// domain attach at Phase 10. Same shipped-code / pending-assets pattern Phase 3 uses for
// /brand/ and the gateway leadership cards (/photography/leadership-*.webp). This is a no-op
// file reference that will 404 at runtime until real photography lands — no fallback graphics
// are smuggled in.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HK_COACHES } from "@/lib/hk-data";

export const metadata: Metadata = {
  title: "Meet the ProGym Hong Kong Team — Coaches | ProActiv Sports",
  description:
    "Meet the ProGym Hong Kong coaching team — Director Monica plus a combined Wan Chai and Cyberport team. Every coach completes our internal training course.",
  openGraph: {
    title: "Meet the ProGym Hong Kong Team",
    description:
      "Meet the ProGym Hong Kong coaching team — combined Wan Chai and Cyberport team.",
    url: "https://hk.proactivsports.com/coaches/",
    siteName: "ProActiv Sports Hong Kong",
    locale: "en_HK",
    type: "website",
    images: [
      {
        url: "/coaches/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ProGym Hong Kong coaching team",
      },
    ],
  },
  alternates: { canonical: "https://hk.proactivsports.com/coaches/" },
};

// Person JSON-LD — one entry per coach (RESEARCH Pattern 7 anticipates Phase 7 Person schema;
// Phase 4 ships this proactively for /coaches/).
const coachesSchema = {
  "@context": "https://schema.org",
  "@graph": HK_COACHES.map((c) => ({
    "@type": "Person",
    name: c.name,
    jobTitle: c.role,
    worksFor: { "@id": "https://proactivsports.com/#organization" },
    image: `https://hk.proactivsports.com${c.portrait}`,
    description: c.bio,
  })),
};

export default function CoachesPage() {
  // D-07/D-08: lead = the coach whose venueTag is "both" (Monica);
  // team = everyone else, rendered in a single combined grid (no venue split headings).
  const lead = HK_COACHES.find((c) => c.venueTag === "both");
  const team = HK_COACHES.filter((c) => c !== lead);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(coachesSchema) }}
      />

      {/* Page hero */}
      <Section size="lg" bg="default">
        <ContainerEditorial width="default">
          <div className="max-w-3xl">
            <h1 className="text-display font-display text-foreground">
              Meet the{" "}
              <span className="font-accent text-brand-navy">ProGym</span> Hong Kong team.
            </h1>
            <p className="text-body-lg text-muted-foreground mt-6">
              One team across Wan Chai and Cyberport. Every coach completes our internal training
              course — regardless of prior certification — so the standard you experience is the
              standard, full stop.
            </p>
          </div>
        </ContainerEditorial>
      </Section>

      {/* Lead — Monica large card */}
      {lead ? (
        <Section size="md" bg="muted">
          <ContainerEditorial width="default">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-4xl mx-auto">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                <Image
                  src={lead.portrait}
                  alt={`Portrait of ${lead.name}, ${lead.role}`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="md:col-span-2">
                <h2 className="text-h2 font-display text-foreground">{lead.name}</h2>
                <p className="text-body-lg text-brand-navy font-semibold mt-2">{lead.role}</p>
                <p className="text-body text-muted-foreground mt-4 leading-relaxed">{lead.bio}</p>
              </div>
            </div>
          </ContainerEditorial>
        </Section>
      ) : null}

      {/* Combined team grid (D-08 — no venue split) */}
      <Section size="md" bg="default">
        <ContainerEditorial width="wide">
          <h2 className="text-h2 font-display text-foreground mb-8">The team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((coach) => (
              <Card key={coach.name} className="p-5 flex flex-col">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4">
                  <Image
                    src={coach.portrait}
                    alt={`Portrait of ${coach.name}, ${coach.role}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="text-h3 font-display text-foreground">{coach.name}</h3>
                <p className="text-small text-brand-navy font-semibold mt-1">{coach.role}</p>
                {coach.venueTag && coach.venueTag !== "both" ? (
                  <Badge variant="secondary" className="mt-2 self-start">
                    Primarily {coach.venueTag === "wan-chai" ? "Wan Chai" : "Cyberport"}
                  </Badge>
                ) : null}
                <p className="text-body text-muted-foreground mt-3 leading-relaxed">{coach.bio}</p>
              </Card>
            ))}
          </div>
        </ContainerEditorial>
      </Section>

      {/* Booking CTA */}
      <Section size="lg" bg="navy">
        <ContainerEditorial width="default">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-h2 font-display text-white mb-4">
              Train with us — start with a free trial.
            </h2>
            <p className="text-body-lg text-brand-cream mb-8">
              A 30-minute assessment with one of our coaches. No commitment.
            </p>
            <Button
              asChild
              size="touch"
              className="bg-brand-red text-white hover:bg-brand-red/90"
            >
              <Link href="/book-a-trial/free-assessment/?venue=no-preference">
                Book a Free Trial <ArrowRight className="ml-2 size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </ContainerEditorial>
      </Section>
    </>
  );
}

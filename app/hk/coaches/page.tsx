// Phase 6 / Plan 06-05 — HK coaches page wired to live Sanity data.
// Replaces HK_COACHES with sanityFetch + hkCoachesQuery.
// Portrait rendered via SanityImage (hotspot-aware). D-08 lead/team split preserved.

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sanityFetch } from "@/lib/sanity.live";
import { hkCoachesQuery } from "@/lib/queries";
import { SanityImage } from "@/components/sanity-image";

export const metadata: Metadata = {
  title: "Meet the ProGym Hong Kong Team — Coaches | ProActiv Sports",
  description:
    "Meet the ProGym Hong Kong coaching team — Director Monica plus a combined Wan Chai and Cyberport team. Every coach completes our internal training course.",
  openGraph: {
    title: "Meet the ProGym Hong Kong Team",
    description: "Meet the ProGym Hong Kong coaching team — combined Wan Chai and Cyberport team.",
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

export default async function CoachesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: coaches } = (await sanityFetch({ query: hkCoachesQuery, tags: ["coach"] })) as {
    data: any[];
  };

  // D-07/D-08: lead = the coach whose venueTag is "both" (Monica);
  // team = everyone else, rendered in a single combined grid (no venue split headings).
  const lead = coaches.find((c) => c.venueTag === "both");
  const team = coaches.filter((c) => c !== lead);

  // Person JSON-LD — built from live Sanity data
  const coachesSchema = {
    "@context": "https://schema.org",
    "@graph": coaches.map((c) => ({
      "@type": "Person",
      name: c.name,
      jobTitle: c.role,
      worksFor: { "@id": "https://proactivsports.com/#organization" },
      description: c.bio,
    })),
  };

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
              Meet the <span className="font-accent text-brand-navy">ProGym</span> Hong Kong team.
            </h1>
            <p className="text-body-lg text-muted-foreground mt-6">
              One team across Wan Chai and Cyberport. Every coach completes our internal training
              course — regardless of prior certification — so the standard you experience is the
              standard, full stop.
            </p>
          </div>
        </ContainerEditorial>
      </Section>

      {coaches.length === 0 ? (
        <Section size="md" bg="muted">
          <ContainerEditorial width="default">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-h2 font-display text-foreground mb-4">
                Meet the team — coming soon.
              </h2>
              <p className="text-body text-muted-foreground">
                Coach profiles are being set up. In the meantime, feel free to reach out directly.
              </p>
            </div>
          </ContainerEditorial>
        </Section>
      ) : (
        <>
          {/* Lead — Monica large card */}
          {lead && (
            <Section size="md" bg="muted">
              <ContainerEditorial width="default">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-4xl mx-auto">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                    {lead.portrait ? (
                      <SanityImage
                        image={lead.portrait}
                        alt={`Portrait of ${lead.name}, ${lead.role}`}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="bg-muted w-full h-full" />
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <h2 className="text-h2 font-display text-foreground">{lead.name}</h2>
                    <p className="text-body-lg text-brand-navy font-semibold mt-2">{lead.role}</p>
                    {lead.bio && (
                      <p className="text-body text-muted-foreground mt-4 leading-relaxed">
                        {lead.bio}
                      </p>
                    )}
                  </div>
                </div>
              </ContainerEditorial>
            </Section>
          )}

          {/* Combined team grid (D-08 — no venue split) */}
          {team.length > 0 && (
            <Section size="md" bg="default">
              <ContainerEditorial width="wide">
                <h2 className="text-h2 font-display text-foreground mb-8">The team</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {team.map((coach) => (
                    <Card key={coach.name} className="p-5 flex flex-col">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4">
                        {coach.portrait ? (
                          <SanityImage
                            image={coach.portrait}
                            alt={`Portrait of ${coach.name}, ${coach.role}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="bg-muted w-full h-full" />
                        )}
                      </div>
                      <h3 className="text-h3 font-display text-foreground">{coach.name}</h3>
                      <p className="text-small text-brand-navy font-semibold mt-1">{coach.role}</p>
                      {coach.venueTag && coach.venueTag !== "both" ? (
                        <Badge variant="secondary" className="mt-2 self-start">
                          Primarily {coach.venueTag === "wan-chai" ? "Wan Chai" : "Cyberport"}
                        </Badge>
                      ) : null}
                      {coach.bio && (
                        <p className="text-body text-muted-foreground mt-3 leading-relaxed">
                          {coach.bio}
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              </ContainerEditorial>
            </Section>
          )}
        </>
      )}

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
            <Button asChild size="touch" className="bg-brand-red text-white hover:bg-brand-red/90">
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

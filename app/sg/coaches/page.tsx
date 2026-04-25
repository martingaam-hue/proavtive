// Phase 6 / Plan 06-05 — SG coaches page wired to live Sanity data.
// Replaces SG_COACHES with sanityFetch + sgCoachesQuery.
// Portrait rendered via SanityImage. 3-column flat grid preserved (no lead/team split for SG).

import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { sanityFetch } from "@/lib/sanity.live";
import { sgCoachesQuery } from "@/lib/queries";
import { SanityImage } from "@/components/sanity-image";

export const metadata: Metadata = {
  title: "Meet the Prodigy Singapore Team — Coaches | ProActiv Sports",
  description:
    "Meet the Prodigy Singapore coaching team — Haikel, Mark, and Coach King at Katong Point. All coaches complete our internal ProActiv Sports training course.",
  openGraph: {
    title: "Meet the Prodigy Singapore Team",
    description:
      "Meet the Prodigy Singapore coaching team — Haikel, Mark, and Coach King at Katong Point.",
    url: "https://sg.proactivsports.com/coaches/",
    siteName: "Prodigy by ProActiv Sports Singapore",
    locale: "en_SG",
    type: "website",
    images: [
      {
        url: "/coaches/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Prodigy Singapore coaching team — Haikel, Mark, and Coach King",
      },
    ],
  },
  alternates: { canonical: "https://sg.proactivsports.com/coaches/" },
};

export default async function SGCoachesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: coaches } = (await sanityFetch({ query: sgCoachesQuery, tags: ["coach"] })) as {
    data: any[];
  };

  // Person JSON-LD — built from live Sanity data
  const coachesSchema = {
    "@context": "https://schema.org",
    "@graph": [
      ...coaches.map((c) => ({
        "@type": "Person",
        name: c.name,
        jobTitle: c.role,
        worksFor: { "@id": "https://proactivsports.com/#organization" },
        description: c.bio,
      })),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Prodigy by ProActiv Sports Singapore",
            item: "https://sg.proactivsports.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Coaches",
            item: "https://sg.proactivsports.com/coaches/",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(coachesSchema) }}
      />

      {/* Hero */}
      <Section size="lg" bg="default">
        <ContainerEditorial width="default">
          <div className="max-w-3xl">
            <h1 className="text-display font-display text-foreground">
              Meet the <span className="font-accent text-brand-green">Prodigy</span> Singapore team.
            </h1>
            <p className="text-body-lg text-muted-foreground mt-6">
              Three coaches, one venue, one standard. Every Prodigy coach completes our internal
              ProActiv Sports training course — regardless of prior certification — so the coaching
              quality you experience at Katong Point is consistent and coach-specific.
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
                Coach profiles are being set up. Reach out directly in the meantime.
              </p>
            </div>
          </ContainerEditorial>
        </Section>
      ) : (
        <>
          {/* 3-col coach grid (D-07 gate 3 — portraits HUMAN-ACTION; render gracefully without them) */}
          <Section size="md" bg="muted">
            <ContainerEditorial width="wide">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {coaches.map((coach) => (
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
                    <p className="text-small text-brand-green font-semibold mt-1">{coach.role}</p>
                    {coach.bio && (
                      <p className="text-body text-muted-foreground mt-3 leading-relaxed">
                        {coach.bio}
                      </p>
                    )}
                    <a
                      href={`#${coach.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="inline-flex items-center gap-1 mt-4 text-brand-navy font-semibold hover:underline text-small"
                    >
                      Read full bio <ArrowRight className="size-3" aria-hidden />
                    </a>
                  </Card>
                ))}
              </div>
            </ContainerEditorial>
          </Section>

          {/* Coach detail anchors (in-page bios for "Read full bio" links) */}
          {coaches.map((coach) => (
            <Section
              key={`bio-${coach.name}`}
              id={coach.name.toLowerCase().replace(/\s+/g, "-")}
              size="md"
              bg="default"
            >
              <ContainerEditorial width="default">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-4xl mx-auto">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                    {coach.portrait ? (
                      <SanityImage
                        image={coach.portrait}
                        alt={`Portrait of ${coach.name}, ${coach.role} at Prodigy Singapore`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="bg-muted w-full h-full" />
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <h2 className="text-h2 font-display text-foreground">{coach.name}</h2>
                    <p className="text-body-lg text-brand-green font-semibold mt-2">{coach.role}</p>
                    {coach.bio && (
                      <p className="text-body text-muted-foreground mt-4 leading-relaxed">
                        {coach.bio}
                      </p>
                    )}
                  </div>
                </div>
              </ContainerEditorial>
            </Section>
          ))}
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
              A 30-minute assessment with one of our coaches at Katong Point. No commitment.
            </p>
            <Button asChild size="touch" className="bg-brand-red text-white hover:bg-brand-red/90">
              <a href="/book-a-trial/">
                Book a Free Trial <ArrowRight className="ml-2 size-4" aria-hidden />
              </a>
            </Button>
          </div>
        </ContainerEditorial>
      </Section>
    </>
  );
}

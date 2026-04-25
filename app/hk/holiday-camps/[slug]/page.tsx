// Phase 6 / Plan 06-05 — HK individual camp page with Event JSON-LD.
// Dynamic route: fetches camp by slug from Sanity, renders detail + structured data.

import { notFound } from "next/navigation";
import { sanityFetch } from "@/lib/sanity.live";
import { campBySlugQuery } from "@/lib/queries";
import { urlFor } from "@/components/sanity-image";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: camp } = await sanityFetch({
    query: campBySlugQuery,
    params: { slug },
    tags: ["camp", `camp:${slug}`],
  });

  if (!camp) return {};

  return {
    title: `${camp.title} | ProGym Hong Kong Holiday Camps`,
    description: camp.description ?? undefined,
    alternates: { canonical: `https://hk.proactivsports.com/holiday-camps/${slug}/` },
  };
}

export async function generateStaticParams() {
  // Return empty — Next.js renders dynamically on first request; ISR caches thereafter.
  // Phase 7 can add full slug pre-rendering once campSlugsQuery is available.
  return [];
}

export default async function HKCampPage({ params }: Props) {
  const { slug } = await params;
  const { data: camp } = await sanityFetch({
    query: campBySlugQuery,
    params: { slug },
    tags: ["camp", `camp:${slug}`],
  });

  if (!camp) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: camp.title,
    description: camp.description ?? undefined,
    startDate: camp.startDate ?? undefined,
    endDate: camp.endDate ?? undefined,
    image: camp.image?.asset ? urlFor(camp.image.asset).width(1200).height(630).url() : undefined,
    location: camp.venue
      ? {
          "@type": "Place",
          name: camp.venue.name,
          address: {
            "@type": "PostalAddress",
            streetAddress: camp.venue.address,
            addressLocality: camp.venue.city,
            addressCountry: camp.venue.countryCode,
          },
        }
      : undefined,
    offers: camp.price
      ? {
          "@type": "Offer",
          price: camp.price,
          priceCurrency: camp.priceCurrency ?? "HKD",
          url: camp.offerUrl ?? undefined,
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section size="lg" bg="default">
        <ContainerEditorial width="default">
          <div className="max-w-3xl">
            <Link
              href="/holiday-camps/"
              className="text-small text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1"
            >
              ← All holiday camps
            </Link>

            <h1 className="text-h1 font-display text-foreground mt-4">{camp.title}</h1>

            {camp.ageRange && (
              <Badge variant="secondary" className="mt-3">
                Ages {camp.ageRange}
              </Badge>
            )}

            {camp.description && (
              <p className="text-body-lg text-muted-foreground mt-6">{camp.description}</p>
            )}

            {(camp.startDate || camp.endDate) && (
              <p className="text-body text-foreground mt-4 font-medium">
                {camp.startDate && <time dateTime={camp.startDate}>{camp.startDate}</time>}
                {camp.startDate && camp.endDate && " – "}
                {camp.endDate && <time dateTime={camp.endDate}>{camp.endDate}</time>}
              </p>
            )}

            {camp.venue?.name && (
              <p className="text-body text-brand-navy font-semibold mt-2">
                {camp.venue.name}
                {camp.venue.address ? `, ${camp.venue.address}` : ""}
              </p>
            )}

            {camp.price && (
              <p className="text-body text-muted-foreground mt-3">
                From {camp.priceCurrency ?? "HKD"} {camp.price}
              </p>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {camp.offerUrl ? (
                <Button
                  asChild
                  size="touch"
                  className="bg-brand-red text-white hover:bg-brand-red/90"
                >
                  <a href={camp.offerUrl}>
                    Book This Camp <ArrowRight className="ml-2 size-4" aria-hidden />
                  </a>
                </Button>
              ) : (
                <Button
                  asChild
                  size="touch"
                  className="bg-brand-red text-white hover:bg-brand-red/90"
                >
                  <Link href="/contact?market=hk&subject=Holiday%20Camp">
                    Enquire Now <ArrowRight className="ml-2 size-4" aria-hidden />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </ContainerEditorial>
      </Section>
    </>
  );
}

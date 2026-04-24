// Phase 5 / Plan 05-05 — Prodigy @ Katong Point location page (SG-02).
// NAP + map + opening hours + zone overview + venue FAQ + SportsActivityLocation JSON-LD.
// Pattern 11 #6 MultiBall placement: "Singapore's only MultiBall wall" headline badge.
// Composes Phase 2 primitives + components/sg/venue-map.tsx.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Clock, ArrowRight, Train } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FAQItem } from "@/components/ui/faq-item";
import { VenueMap } from "@/components/sg/venue-map";
import {
  KATONG_POINT,
  KATONG_POINT_MAP_EMBED,
  SG_FAQ_ITEMS,
  SG_ZONES,
} from "@/lib/sg-data";

const VENUE_FAQS = SG_FAQ_ITEMS.filter((i) => i.group === "venue").slice(0, 6);

export const metadata: Metadata = {
  title: "Prodigy @ Katong Point | Singapore's Only MultiBall Wall",
  description:
    "Prodigy @ Katong Point — 451 Joo Chiat Road, Level 3, Singapore 427664. Singapore's only MultiBall wall, climbing wall, and multi-sport classes for children aged 2–12. Book a free trial.",
  openGraph: {
    title: "Prodigy @ Katong Point — Singapore's Only MultiBall Wall",
    description:
      "Prodigy @ Katong Point — 451 Joo Chiat Road, Level 3, Singapore 427664. Multi-sport, climbing, and Singapore's only MultiBall interactive wall.",
    url: "https://sg.proactivsports.com/katong-point/",
    siteName: "Prodigy by ProActiv Sports Singapore",
    locale: "en_SG",
    type: "website",
    images: [
      {
        url: "/katong-point/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Prodigy @ Katong Point — Singapore's only MultiBall wall",
      },
    ],
  },
  alternates: { canonical: "https://sg.proactivsports.com/katong-point/" },
};

const katongPointSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SportsActivityLocation",
      "@id": "https://sg.proactivsports.com/#localbusiness-katong-point",
      name: KATONG_POINT.nameFull,
      image: `https://sg.proactivsports.com${KATONG_POINT.heroImage}`,
      url: "https://sg.proactivsports.com/katong-point/",
      telephone: process.env.NEXT_PUBLIC_WHATSAPP_SG ?? "",
      priceRange: "$$",
      parentOrganization: { "@id": "https://proactivsports.com/#organization" },
      address: {
        "@type": "PostalAddress",
        streetAddress: KATONG_POINT.addressStreet,
        addressLocality: KATONG_POINT.addressLocality,
        addressRegion: KATONG_POINT.addressRegion,
        postalCode: KATONG_POINT.postalCode,
        addressCountry: KATONG_POINT.addressCountry,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: KATONG_POINT.geo.lat,
        longitude: KATONG_POINT.geo.lng,
      },
      openingHoursSpecification: KATONG_POINT.hours.map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.days,
        opens: h.opens,
        closes: h.closes,
      })),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Prodigy @ Katong Point Programmes",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Weekly Sports Classes",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Prodigy Holiday Camps",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Birthday Parties",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "School Partnerships",
            },
          },
        ],
      },
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
          name: "Katong Point",
          item: "https://sg.proactivsports.com/katong-point/",
        },
      ],
    },
  ],
};

export default function KatongPointPage() {
  const phoneEnv = process.env.NEXT_PUBLIC_WHATSAPP_SG;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(katongPointSchema) }}
      />

      {/* §1 Hero */}
      <Section size="lg" bg="default">
        <ContainerEditorial width="wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              {/* Pattern 11 #6 — MultiBall headline badge */}
              <Badge className="bg-brand-yellow text-brand-navy mb-4 inline-flex">
                Singapore&apos;s only MultiBall wall
              </Badge>
              <h1 className="text-h1 font-display text-foreground">
                <span className="font-accent text-brand-green">Prodigy</span>{" "}
                @ Katong Point
              </h1>
              <p className="text-body-lg text-muted-foreground mt-3">
                {KATONG_POINT.addressStreet}, Singapore{" "}
                {KATONG_POINT.postalCode}
              </p>
              <p className="text-body text-muted-foreground mt-2">
                {KATONG_POINT.sizeNote} · Fully indoor + air-conditioned
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {KATONG_POINT.apparatus.map((a) => (
                  <Badge key={a} variant="outline">
                    {a}
                  </Badge>
                ))}
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  size="touch"
                  className="bg-brand-red text-white hover:bg-brand-red/90"
                >
                  <a href="/book-a-trial/?subject=katong-point">
                    Book a Free Trial{" "}
                    <ArrowRight className="ml-2 size-4" aria-hidden />
                  </a>
                </Button>
                <Button
                  asChild
                  size="touch"
                  variant="outline"
                  className="border-brand-navy text-brand-navy hover:bg-brand-navy/5"
                >
                  <a href="/book-a-trial/?subject=katong-point-enquiry">
                    Send an Enquiry
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={KATONG_POINT.heroImage}
                alt={`Children at ${KATONG_POINT.nameFull} — Singapore's only MultiBall wall`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §2 VenueMap + address card */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VenueMap
                embedSrc={KATONG_POINT_MAP_EMBED}
                title="Map showing Prodigy at 451 Joo Chiat Road, Level 3, Singapore 427664"
                className="my-8"
              />
            </div>
            <Card className="p-6">
              <h2 className="text-h3 font-display text-foreground mb-4">
                Visit us
              </h2>
              <p className="flex items-start gap-2 text-body text-foreground">
                <MapPin
                  className="size-4 mt-1 text-brand-navy shrink-0"
                  aria-hidden
                />
                <span>
                  {KATONG_POINT.addressStreet}
                  <br />
                  Singapore {KATONG_POINT.postalCode}
                </span>
              </p>
              {phoneEnv && (
                <a
                  href={`https://wa.me/${phoneEnv.replace(/[^0-9]/g, "")}`}
                  className="mt-3 flex items-center gap-2 text-body text-foreground hover:text-brand-navy"
                >
                  <Phone className="size-4 text-brand-navy" aria-hidden />{" "}
                  WhatsApp us
                </a>
              )}
              <p className="mt-4 text-small text-muted-foreground">
                <Train className="inline size-4 mr-1 text-brand-navy" aria-hidden />
                Near Paya Lebar MRT · buses along Joo Chiat Road
              </p>
            </Card>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §3 Opening hours */}
      <Section size="md" bg="default">
        <ContainerEditorial width="default">
          <div className="max-w-2xl">
            <h2 className="text-h2 font-display text-foreground mb-6">
              <Clock
                className="inline size-6 mr-2 text-brand-navy align-middle"
                aria-hidden
              />{" "}
              Opening hours
            </h2>
            <table className="w-full">
              <tbody>
                {KATONG_POINT.hours.map((h) => (
                  <tr
                    key={h.days.join(",")}
                    className="border-b border-border"
                  >
                    <td className="py-3 font-semibold text-foreground">
                      {h.days.join(", ")}
                    </td>
                    <td className="py-3 text-right text-muted-foreground">
                      {h.opens} – {h.closes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-small text-muted-foreground mt-3">
              Hours are provisional — please confirm via WhatsApp before your
              first visit.
            </p>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §4 Service area (transit copy) */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="default">
          <div className="max-w-2xl">
            <h2 className="text-h2 font-display text-foreground mb-3">
              Easily reached from
            </h2>
            <p className="text-body text-muted-foreground">
              Prodigy @ Katong Point serves families from{" "}
              {KATONG_POINT.serviceArea.join(" · ")}. Katong Point is a
              5-minute walk from Paya Lebar MRT (East-West Line) and accessible
              by multiple buses along Joo Chiat Road and the East Coast corridor.
            </p>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §5 Zones overview */}
      <Section size="md" bg="default">
        <ContainerEditorial width="wide">
          <h2 className="text-h2 font-display text-foreground mb-6">
            What&apos;s inside Katong Point
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SG_ZONES.map((zone) => (
              <Card
                key={zone.slug}
                className="p-5 hover:-translate-y-1 transition-transform"
              >
                <h3 className="text-h3 font-display text-foreground">
                  {zone.label}
                </h3>
                <p className="text-small text-muted-foreground mt-1">
                  {zone.ageBand}
                </p>
                {zone.tag && (
                  <Badge
                    variant="secondary"
                    className="mt-2 self-start text-xs"
                  >
                    {zone.tag}
                  </Badge>
                )}
                <Link
                  href={zone.href}
                  className="inline-flex items-center gap-1 mt-3 text-brand-navy font-semibold hover:underline"
                >
                  Learn more <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Card>
            ))}
          </div>
        </ContainerEditorial>
      </Section>

      {/* §6 Venue FAQ */}
      {VENUE_FAQS.length > 0 && (
        <Section size="md" bg="muted">
          <ContainerEditorial width="default">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-display text-foreground mb-6">
                FAQs about Katong Point
              </h2>
              <div className="flex flex-col gap-0">
                {VENUE_FAQS.map((item) => (
                  <FAQItem
                    key={item.value}
                    id={item.value}
                    question={item.question}
                    answer={item.answer}
                  />
                ))}
              </div>
            </div>
          </ContainerEditorial>
        </Section>
      )}

      {/* §7 Booking CTA */}
      <Section size="lg" bg="navy">
        <ContainerEditorial width="default">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-h2 font-display text-white mb-3">
              Book your child&apos;s free trial at Katong Point.
            </h2>
            <p className="text-body-lg text-brand-cream mb-6">
              A 30-minute assessment with a Prodigy coach. Find the right class
              — no commitment.
            </p>
            <Button
              asChild
              size="touch"
              className="bg-brand-red text-white hover:bg-brand-red/90"
            >
              <a href="/book-a-trial/?subject=katong-point">
                Book a Free Trial{" "}
                <ArrowRight className="ml-2 size-4" aria-hidden />
              </a>
            </Button>
          </div>
        </ContainerEditorial>
      </Section>
    </>
  );
}

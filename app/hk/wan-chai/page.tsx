// Phase 4 / Plan 04-04 — ProGym Wan Chai location page (HK-02).
// NAP + map + opening hours + programme list + venue-specific booking CTA + LocalBusiness JSON-LD.
// Composes Phase 2 primitives + components/hk/. No video on location pages (per UI-SPEC §4).
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Clock, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FAQItem } from "@/components/ui/faq-item";
import { VenueMap } from "@/components/hk/venue-map";
import {
  HK_VENUES,
  HK_GYMNASTICS_PROGRAMMES,
  HK_FAQ_ITEMS,
  WAN_CHAI_MAP_EMBED,
} from "@/lib/hk-data";

const VENUE = HK_VENUES.find((v) => v.id === "wan-chai")!; // build-time constant; fail loud if absent
const VENUE_PROGRAMMES = HK_GYMNASTICS_PROGRAMMES.filter((p) =>
  p.venuesOffered.includes("wan-chai")
);
const VENUE_FAQS = HK_FAQ_ITEMS.filter((i) => i.group === "venues").slice(0, 6);

export const metadata: Metadata = {
  title: "ProGym Wan Chai — Children's Gymnastics Wan Chai, Hong Kong",
  description:
    "ProGym Wan Chai — 15/F, The Hennessy, 256 Hennessy Road. Book gymnastics classes, holiday camps and birthday parties for children in Wan Chai, Hong Kong.",
  openGraph: {
    title: "ProGym Wan Chai — Children's Gymnastics, Hong Kong",
    description:
      "ProGym Wan Chai — 15/F, The Hennessy, 256 Hennessy Road. Children's gymnastics, holiday camps, birthday parties.",
    url: "https://hk.proactivsports.com/wan-chai/",
    siteName: "ProActiv Sports Hong Kong",
    locale: "en_HK",
    type: "website",
    images: [
      {
        url: "/wan-chai/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ProGym Wan Chai — children's gymnastics venue, Hong Kong",
      },
    ],
  },
  alternates: { canonical: "https://hk.proactivsports.com/wan-chai/" },
};

const wanChaiSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SportsActivityLocation",
      "@id": "https://hk.proactivsports.com/#localbusiness-wanchai",
      "name": "ProGym Wan Chai — ProActiv Sports",
      "image": `https://hk.proactivsports.com${VENUE.heroImage}`,
      "url": "https://hk.proactivsports.com/wan-chai/",
      "telephone": process.env.NEXT_PUBLIC_HK_PHONE ?? "",
      "priceRange": "$$",
      "parentOrganization": { "@id": "https://proactivsports.com/#organization" },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": VENUE.addressStreet,
        "addressLocality": VENUE.addressLocality,
        "addressRegion": VENUE.addressRegion,
        "addressCountry": VENUE.addressCountry,
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": VENUE.geo.lat,
        "longitude": VENUE.geo.lng,
      },
      "openingHoursSpecification": VENUE.hours.map((h) => ({
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": h.days,
        "opens": h.opens,
        "closes": h.closes,
      })),
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "ProActiv Sports Hong Kong",
          "item": "https://hk.proactivsports.com/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Wan Chai",
          "item": "https://hk.proactivsports.com/wan-chai/",
        },
      ],
    },
  ],
};

export default function WanChaiPage() {
  const phoneHk = process.env.NEXT_PUBLIC_HK_PHONE;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(wanChaiSchema) }}
      />

      {/* §1 Hero */}
      <Section size="lg" bg="default">
        <ContainerEditorial width="wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-h1 font-display text-foreground">
                <span className="font-accent text-brand-navy">ProGym</span>{" "}
                {VENUE.nameShort}
              </h1>
              <p className="text-body-lg text-muted-foreground mt-3">
                {VENUE.addressStreet}, {VENUE.addressLocality}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {VENUE.apparatus.map((a) => (
                  <Badge key={a} variant="secondary">
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
                  {/* Use plain <a> to preserve trailing slash before query — Next <Link> normalises away the trailing slash. */}
                  <a href="/book-a-trial/free-assessment/?venue=wan-chai">
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
                  <Link href="/contact?market=hk">Send an Enquiry</Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={VENUE.heroImage}
                alt={`Children practising gymnastics at ${VENUE.nameFull}`}
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
                embedSrc={WAN_CHAI_MAP_EMBED}
                title={`Map of ${VENUE.nameFull}`}
              />
            </div>
            <Card className="p-6">
              <h2 className="text-h3 font-display text-foreground mb-4">Visit us</h2>
              <p className="flex items-start gap-2 text-body text-foreground">
                <MapPin
                  className="size-4 mt-1 text-brand-navy shrink-0"
                  aria-hidden
                />
                <span>
                  {VENUE.addressStreet}
                  <br />
                  {VENUE.addressLocality}, {VENUE.addressRegion}
                </span>
              </p>
              {phoneHk && (
                <a
                  href={`tel:${phoneHk.replace(/[^0-9+]/g, "")}`}
                  className="mt-3 flex items-center gap-2 text-body text-foreground hover:text-brand-navy"
                >
                  <Phone className="size-4 text-brand-navy" aria-hidden /> {phoneHk}
                </a>
              )}
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
                {VENUE.hours.map((h) => (
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
              Hours are placeholder pending confirmation. Please check via
              WhatsApp or phone before your first visit.
            </p>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §4 Programmes available at this venue */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="wide">
          <h2 className="text-h2 font-display text-foreground mb-6">
            Programmes at{" "}
            <span className="font-accent text-brand-navy">ProGym</span>{" "}
            {VENUE.nameShort}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {VENUE_PROGRAMMES.map((p) => (
              <Card
                key={p.slug}
                className="p-5 hover:-translate-y-1 transition-transform"
              >
                <h3 className="text-h3 font-display text-foreground">
                  {p.label}
                </h3>
                <p className="text-small text-muted-foreground mt-1">
                  {p.ageBand}
                </p>
                <Link
                  href={p.href}
                  className="inline-flex items-center gap-1 mt-3 text-brand-navy font-semibold hover:underline"
                >
                  Learn more <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Card>
            ))}
          </div>
        </ContainerEditorial>
      </Section>

      {/* §5 Service area */}
      <Section size="md" bg="default">
        <ContainerEditorial width="default">
          <div className="max-w-2xl">
            <h2 className="text-h2 font-display text-foreground mb-3">
              Easily reached from
            </h2>
            <p className="text-body text-muted-foreground">
              ProGym Wan Chai serves families across{" "}
              {VENUE.serviceArea.join(", ")}. The Hennessy is a 5-minute walk
              from Wan Chai MTR (exit B2) and well-served by the 18, 25, and 26
              bus routes.
            </p>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §6 Venue FAQ */}
      {VENUE_FAQS.length > 0 && (
        <Section size="md" bg="muted">
          <ContainerEditorial width="default">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-display text-foreground mb-6">
                FAQs about Wan Chai
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
              Book your child&apos;s free trial at Wan Chai.
            </h2>
            <p className="text-body-lg text-cream mb-6">
              A 30-minute assessment with a coach who knows the floor
              inside-out. No commitment.
            </p>
            <Button
              asChild
              size="touch"
              className="bg-brand-red text-white hover:bg-brand-red/90"
            >
              {/* Plain <a> preserves trailing slash; Next <Link> normalises it away. */}
              <a href="/book-a-trial/free-assessment/?venue=wan-chai">
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

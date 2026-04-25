// Phase 6 / Plan 06-05 — ProGym Cyberport location page wired to Sanity.
// Fetches venue by slug='cyberport' from Sanity; falls back to HK_VENUES hardcoded
// data if Sanity returns null (transition safety until venue doc is populated).
// All existing sections, JSON-LD, and visual layout preserved.
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
  CYBERPORT_MAP_EMBED,
} from "@/lib/hk-data";
import { sanityFetch } from "@/lib/sanity.live";
import { venueBySlugQuery } from "@/lib/queries";
import { SanityImage } from "@/components/sanity-image";

// Static fallback — used until Sanity venue doc is populated
const FALLBACK_VENUE = HK_VENUES.find((v) => v.id === "cyberport")!;
const VENUE_PROGRAMMES = HK_GYMNASTICS_PROGRAMMES.filter((p) =>
  p.venuesOffered.includes("cyberport"),
);
const VENUE_FAQS = HK_FAQ_ITEMS.filter((i) => i.group === "venues").slice(0, 6);

export const metadata: Metadata = {
  title: "ProGym Cyberport — Children's Gymnastics Cyberport, Hong Kong",
  description:
    "ProGym Cyberport — 5,000 sq ft purpose-built gymnastics facility, opened August 2025. Book classes, holiday camps and birthday parties for children in Cyberport, Hong Kong.",
  openGraph: {
    title: "ProGym Cyberport — Children's Gymnastics, Hong Kong",
    description:
      "ProGym Cyberport — 5,000 sq ft purpose-built gymnastics facility, opened August 2025. Children's gymnastics, holiday camps, birthday parties.",
    url: "https://hk.proactivsports.com/cyberport/",
    siteName: "ProActiv Sports Hong Kong",
    locale: "en_HK",
    type: "website",
    images: [
      {
        url: "/cyberport/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ProGym Cyberport — children's gymnastics venue, Hong Kong",
      },
    ],
  },
  alternates: { canonical: "https://hk.proactivsports.com/cyberport/" },
};

export default async function CyberportPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: sanityVenue } = (await sanityFetch({
    query: venueBySlugQuery,
    params: { slug: "cyberport" },
    tags: ["venue"],
  })) as { data: any };

  // Graceful fallback: use Sanity data when available, otherwise hardcoded static data
  const phoneHk = process.env.NEXT_PUBLIC_HK_PHONE_CYBERPORT ?? process.env.NEXT_PUBLIC_HK_PHONE;

  // Derive display fields — Sanity shape uses flat fields; fallback uses HKVenue shape
  const addressStreet = sanityVenue?.address ?? FALLBACK_VENUE.addressStreet;
  const addressLocality = sanityVenue?.city ?? FALLBACK_VENUE.addressLocality;
  const lat = sanityVenue?.lat ?? FALLBACK_VENUE.geo.lat;
  const lng = sanityVenue?.lng ?? FALLBACK_VENUE.geo.lng;
  const openingHours =
    sanityVenue?.openingHours ??
    FALLBACK_VENUE.hours.map((h) => ({
      days: h.days.join(", "),
      hours: `${h.opens} – ${h.closes}`,
    }));

  const cyberportSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SportsActivityLocation",
        "@id": "https://hk.proactivsports.com/#localbusiness-cyberport",
        name: "ProGym Cyberport — ProActiv Sports",
        url: "https://hk.proactivsports.com/cyberport/",
        telephone: phoneHk ?? "",
        priceRange: "$$",
        parentOrganization: { "@id": "https://proactivsports.com/#organization" },
        address: {
          "@type": "PostalAddress",
          streetAddress: addressStreet,
          addressLocality: addressLocality,
          addressCountry: "HK",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: lat,
          longitude: lng,
        },
      },
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
            name: "Cyberport",
            item: "https://hk.proactivsports.com/cyberport/",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cyberportSchema) }}
      />

      {/* §1 Hero */}
      <Section size="lg" bg="default">
        <ContainerEditorial width="wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-h1 font-display text-foreground">
                <span className="font-accent text-brand-navy">ProGym</span> Cyberport
              </h1>
              <p className="text-body-lg text-muted-foreground mt-3">
                {addressStreet}, {addressLocality}
              </p>
              {FALLBACK_VENUE.sizeNote && (
                <p className="text-body-lg font-semibold text-brand-navy mt-2">
                  {FALLBACK_VENUE.sizeNote} · {FALLBACK_VENUE.openedNote}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {FALLBACK_VENUE.apparatus.map((a) => (
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
                  <a href="/book-a-trial/free-assessment/?venue=cyberport">
                    Book a Free Trial <ArrowRight className="ml-2 size-4" aria-hidden />
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
              {sanityVenue?.heroImage ? (
                <SanityImage
                  image={sanityVenue.heroImage}
                  alt={
                    sanityVenue.heroImage.alt ??
                    "Children practising gymnastics at ProGym Cyberport"
                  }
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <Image
                  src={FALLBACK_VENUE.heroImage}
                  alt="Children practising gymnastics at ProGym Cyberport"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §2 VenueMap + address card */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VenueMap embedSrc={CYBERPORT_MAP_EMBED} title="Map of ProGym Cyberport" />
            </div>
            <Card className="p-6">
              <h2 className="text-h3 font-display text-foreground mb-4">Visit us</h2>
              <p className="flex items-start gap-2 text-body text-foreground">
                <MapPin className="size-4 mt-1 text-brand-navy shrink-0" aria-hidden />
                <span>
                  {addressStreet}
                  <br />
                  {addressLocality}
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
              <Clock className="inline size-6 mr-2 text-brand-navy align-middle" aria-hidden />{" "}
              Opening hours
            </h2>
            <table className="w-full">
              <tbody>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(openingHours as any[]).map((h: any, i: number) => (
                  <tr key={i} className="border-b border-border">
                    <td className="py-3 font-semibold text-foreground">
                      {"days" in h ? h.days : ""}
                    </td>
                    <td className="py-3 text-right text-muted-foreground">
                      {"hours" in h ? h.hours : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-small text-muted-foreground mt-3">
              Hours are placeholder pending confirmation. Please check via WhatsApp or phone before
              your first visit.
            </p>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §4 Programmes available at this venue */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="wide">
          <h2 className="text-h2 font-display text-foreground mb-6">
            Programmes at <span className="font-accent text-brand-navy">ProGym</span> Cyberport
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {VENUE_PROGRAMMES.map((p) => (
              <Card key={p.slug} className="p-5 hover:-translate-y-1 transition-transform">
                <h3 className="text-h3 font-display text-foreground">{p.label}</h3>
                <p className="text-small text-muted-foreground mt-1">{p.ageBand}</p>
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
            <h2 className="text-h2 font-display text-foreground mb-3">Easily reached from</h2>
            <p className="text-body text-muted-foreground">
              ProGym Cyberport serves families across {FALLBACK_VENUE.serviceArea.join(", ")}. The
              Cyberport campus is reached via the dedicated Cyberport bus terminus, with regular
              routes to Central, Aberdeen and Pokfulam.
            </p>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §6 Venue FAQ */}
      {VENUE_FAQS.length > 0 && (
        <Section size="md" bg="muted">
          <ContainerEditorial width="default">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-display text-foreground mb-6">FAQs about Cyberport</h2>
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
              Book your child&apos;s free trial at Cyberport.
            </h2>
            <p className="text-body-lg text-cream mb-6">
              A 30-minute assessment in our newest 5,000 sq ft facility. No commitment.
            </p>
            <Button asChild size="touch" className="bg-brand-red text-white hover:bg-brand-red/90">
              <a href="/book-a-trial/free-assessment/?venue=cyberport">
                Book a Free Trial <ArrowRight className="ml-2 size-4" aria-hidden />
              </a>
            </Button>
          </div>
        </ContainerEditorial>
      </Section>
    </>
  );
}

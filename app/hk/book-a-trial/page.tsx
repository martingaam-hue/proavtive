// Phase 4 / Plan 04-07 — Book a trial conversion hub (HK-12 entry).
//
// Two venue choice cards (Wan Chai + Cyberport, driven by HK_VENUES) + a
// "no preference" CTA + env-conditional WhatsApp card. Each venue card
// deep-links to /book-a-trial/free-assessment/?venue=<id> so the booking
// form pre-selects the venue radio via useSearchParams.
//
// Per UI-SPEC §4 `/book-a-trial/` row + §7 per-route OG (Pitfall 5 budget — this
// is OG #8 / 8, at the budget ceiling).
//
// Note on trailing slash preservation: Next.js <Link> normalises away trailing
// slashes before query strings on app-router links. We use a plain <a> on the
// venue "Book at …" buttons to preserve `/book-a-trial/free-assessment/?venue=...`
// — same pattern Plan 04-04 applied to the venue pages.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, MessageCircle } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HK_VENUES } from "@/lib/hk-data";

const bookATrialSchema = {
  "@context": "https://schema.org",
  "@graph": [
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
          name: "Book a Free Trial",
          item: "https://hk.proactivsports.com/book-a-trial/",
        },
      ],
    },
  ],
};

export const metadata: Metadata = {
  title:
    "Book a Free Trial — ProActiv Sports Hong Kong | ProGym Wan Chai & Cyberport",
  description:
    "Book a free 30-minute assessment at ProGym Wan Chai or Cyberport. Choose your venue, tell us about your child, and we'll confirm within one working day.",
  openGraph: {
    title: "Book a Free Trial — ProActiv Sports Hong Kong",
    description:
      "Free 30-minute assessment at ProGym Wan Chai or Cyberport. No commitment.",
    url: "https://hk.proactivsports.com/book-a-trial/",
    siteName: "ProActiv Sports Hong Kong",
    locale: "en_HK",
    type: "website",
    images: [
      {
        url: "/book-a-trial/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Book a free trial at ProGym Hong Kong",
      },
    ],
  },
  alternates: { canonical: "https://hk.proactivsports.com/book-a-trial/" },
};

export default function BookATrialHubPage() {
  const whatsappHk = process.env.NEXT_PUBLIC_HK_WHATSAPP;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookATrialSchema) }}
      />
      {/* §1 Hero */}
      <Section size="lg" bg="default">
        <ContainerEditorial width="default">
          <div className="max-w-3xl">
            <h1 className="text-h1 font-display text-foreground">
              Your child&apos;s free 30-minute assessment at{" "}
              <span className="font-accent text-brand-navy">ProGym</span>.
            </h1>
            <p className="text-body-lg text-muted-foreground mt-4">
              No commitment. Choose Wan Chai or Cyberport — or let us suggest
              based on your location and your child&apos;s age. A coach will
              guide them through a short assessment so we can recommend the
              right programme.
            </p>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §2 Venue choice cards (2) */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="wide">
          <h2 className="text-h2 font-display text-foreground mb-8">
            Choose your venue.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HK_VENUES.map((v, i) => {
              // Plan acceptance criterion requires literal venue URLs in the page source
              // (grep `/book-a-trial/free-assessment/?venue=wan-chai` + `?venue=cyberport`).
              // Static map keeps each link present as a verifiable literal string.
              const venueHref =
                v.id === "wan-chai"
                  ? "/book-a-trial/free-assessment/?venue=wan-chai"
                  : "/book-a-trial/free-assessment/?venue=cyberport";
              return (
                <Card key={v.id} className="overflow-hidden flex flex-col">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={v.heroImage}
                      alt={`Children at ${v.nameFull}`}
                      fill
                      priority={i === 0}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-h3 font-display text-foreground">
                      <span className="font-accent text-brand-navy">
                        ProGym
                      </span>{" "}
                      {v.nameShort}
                    </h3>
                    <p className="text-small text-muted-foreground mt-1 flex items-start gap-1">
                      <MapPin
                        className="size-3.5 mt-0.5 shrink-0 text-brand-navy"
                        aria-hidden
                      />
                      <span>{v.addressStreet}</span>
                    </p>
                    {v.sizeNote && (
                      <p className="text-small text-muted-foreground mt-1">
                        {v.sizeNote} · {v.openedNote}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {v.apparatus.map((a) => (
                        <Badge key={a} variant="secondary">
                          {a}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-auto pt-4">
                      <Button
                        asChild
                        size="touch"
                        className="bg-brand-red text-white hover:bg-brand-red/90 w-full"
                      >
                        {/* Plain <a> preserves trailing slash before query — Next <Link> normalises it away. */}
                        <a href={venueHref}>
                          Book at {v.nameShort}{" "}
                          <ArrowRight className="ml-2 size-4" aria-hidden />
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </ContainerEditorial>
      </Section>

      {/* §3 No preference CTA */}
      <Section size="md" bg="default">
        <ContainerEditorial width="default">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-h2 font-display text-foreground mb-3">
              Not sure which venue?
            </h2>
            <p className="text-body text-muted-foreground mb-6">
              Tell us where you&apos;re based and we&apos;ll suggest the closest
              venue + best programme for your child&apos;s age.
            </p>
            <Button
              asChild
              size="touch"
              variant="outline"
              className="border-brand-navy text-brand-navy hover:bg-brand-navy/5"
            >
              {/* Plain <a> preserves trailing slash before query. */}
              <a href="/book-a-trial/free-assessment/?venue=no-preference">
                Let us suggest <ArrowRight className="ml-2 size-4" aria-hidden />
              </a>
            </Button>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §4 WhatsApp option (env-conditional — D-04 carry: hidden until NEXT_PUBLIC_HK_WHATSAPP populated) */}
      {whatsappHk && (
        <Section size="md" bg="navy">
          <ContainerEditorial width="default">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-h2 font-display text-white mb-3">
                Prefer to chat first?
              </h2>
              <p className="text-body-lg text-cream mb-6">
                A coach is usually available on WhatsApp within a few hours.
              </p>
              <Button
                asChild
                size="touch"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <a
                  href={`https://wa.me/${whatsappHk.replace(
                    /[^0-9+]/g,
                    ""
                  )}?text=${encodeURIComponent(
                    "Hi ProActiv HK, I'd like to book a free trial."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 size-4" aria-hidden /> Chat on
                  WhatsApp
                </a>
              </Button>
            </div>
          </ContainerEditorial>
        </Section>
      )}
    </>
  );
}

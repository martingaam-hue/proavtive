// Phase 4 / Plan 04-03 — HK homepage (HK-01).
//
// 12 sections per strategy PART 4 wireframe; copy verbatim from PART 6B.
// Composes Phase 2 primitives + Phase 4-local components/hk/. NO inline custom CSS.
// Hero VideoPlayer is HUMAN-ACTION-gated on NEXT_PUBLIC_MUX_HK_HERO_PLAYBACK_ID (CONTEXT D-01).
//
// Deviations from plan (Rule 3 — blocking API mismatches):
//   1. ProgrammeTile actual props are {title, ageRange, description, imageSrc, imageAlt,
//      href, duration?} — plan said {ageBand, image, alt, tagline}. Used actual names.
//   2. VideoPlayer actual named export is `VideoPlayer` (named, not default). Props are
//      {playbackId, title, poster?, autoPlay?, aspect?, className?} — autoplay/loop/muted
//      are handled internally. We wrap it in next/dynamic({ ssr: false }) + provide the
//      poster Image (priority) in the `loading` fallback so LCP paints synchronously and
//      the hero video hydrates on the client.
//   3. TestimonialCard actual props are {quote, author, authorRole} — plan said
//      {attribution, role}. Used actual names.
//   4. FAQItem wraps its own Accordion internally (Phase 2 D-01). Do NOT nest inside
//      another Accordion — follow Phase 3 root page pattern (div-stack FAQItems).
//
// Photo HUMAN-ACTION (CONTEXT D-09 / Phase 3 D-10 pattern):
//   Some photography paths below are HUMAN-ACTION-gated — see 04-03-SUMMARY.md for the
//   exact list. Behavior mirrors Phase 3: hardcode paths, document missing files in the
//   summary, add source images + run `pnpm photos:process` before public ship.

import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  Trophy,
  MapPin,
  BadgeCheck,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgrammeTile } from "@/components/ui/programme-tile";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { LogoWall } from "@/components/ui/logo-wall";
import { FAQItem } from "@/components/ui/faq-item";
import { VenueChipRow } from "@/components/hk/venue-chip-row";
import { HK_VENUES, HK_FAQ_ITEMS, HK_BLOG_POSTS_STUB } from "@/lib/hk-data";

// ─────────────────────────────────────────────────────────────────────────────
// Hero VideoPlayer — dynamic({ ssr: false }) + poster-as-LCP loading fallback.
//
// The Phase 2 VideoPlayer primitive already internally uses dynamic({ ssr: false })
// for @mux/mux-player-react (RESEARCH Pitfall 3). We wrap it AGAIN here so that the
// `loading` prop renders the poster Image with `priority` while the client bundle
// hydrates — this is the single LCP priority Image on the page (RESEARCH Pitfall 6).
// ─────────────────────────────────────────────────────────────────────────────
const VideoPlayerDynamic = dynamic(
  () =>
    import("@/components/ui/video-player").then((m) => ({
      default: m.VideoPlayer,
    })),
  {
    ssr: false,
    loading: () => (
      <Image
        src="/photography/hk-venue-wanchai-gymtots.webp"
        alt="Children practising gymnastics at ProGym Wan Chai, Hong Kong"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
    ),
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// Page metadata — per-page openGraph fully specified (Pitfall 2 — shallow merge).
// ─────────────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Kids Gymnastics Hong Kong | ProGym Wan Chai & Cyberport",
  description:
    "Premium gymnastics, sports, holiday camps and birthday parties for children in Hong Kong. ProGym Wan Chai & Cyberport. Book a free trial.",
  openGraph: {
    title: "Kids Gymnastics Hong Kong | ProGym Wan Chai & Cyberport",
    description:
      "Premium gymnastics, sports, holiday camps and birthday parties for children in Hong Kong. ProGym Wan Chai & Cyberport.",
    url: "https://hk.proactivsports.com/",
    siteName: "ProActiv Sports Hong Kong",
    locale: "en_HK",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ProActiv Sports Hong Kong",
      },
    ],
  },
  alternates: { canonical: "https://hk.proactivsports.com/" },
};

// ─────────────────────────────────────────────────────────────────────────────
// §3.1 HERO — per strategy PART 4 §1 + PART 6B §1 (verbatim H1 + subhead).
// 21:9 on desktop, 16:9 on mobile. Overlay at brand-navy/40 for 14.55:1 contrast.
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <Section size="lg" bg="default">
      <ContainerEditorial width="wide">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl">
          <VideoPlayerDynamic
            playbackId={process.env.NEXT_PUBLIC_MUX_HK_HERO_PLAYBACK_ID ?? ""}
            title="ProGym Hong Kong — hero montage"
            autoPlay
            aspect="video"
            className="absolute inset-0 w-full h-full"
          />
          <div
            className="absolute inset-0 bg-brand-navy/40"
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex flex-col items-start justify-center px-6 md:px-12">
            <h1 className="text-display font-display text-white max-w-2xl leading-tight text-4xl md:text-5xl lg:text-6xl font-bold">
              Premium gymnastics and sports programmes for children in Hong Kong.
            </h1>
            <p className="text-body-lg text-brand-cream max-w-xl mt-4 text-base md:text-lg">
              Since 2011 — two dedicated venues in Wan Chai and Cyberport,
              coaches who complete our training course regardless of prior
              certification, and a progression pathway from first forward roll
              to competitive squad.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              {/* Trailing slash MUST be preserved to match HK-01 SC#1 /
                  Plan 04-01 Test 3 contract. next/link normalises trailing
                  slashes (default trailingSlash: false) so we use <a> here
                  — same pattern as root page cross-subdomain CTAs
                  (Rule 3 deviation: test contract is binding). */}
              <Button
                asChild
                size="touch"
                className="bg-brand-red text-white hover:bg-brand-red/90 focus-visible:ring-2 focus-visible:ring-white"
              >
                <a href="/book-a-trial/free-assessment/">
                  Book a Free Trial{" "}
                  <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </a>
              </Button>
              <Button
                asChild
                size="touch"
                variant="outline"
                className="border-white text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/contact?market=hk">Send an Enquiry</Link>
              </Button>
            </div>
            <p className="text-small text-brand-cream/80 mt-4 text-sm">
              Free trial · No obligation · Usually booked same week.
            </p>
          </div>
        </div>
      </ContainerEditorial>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.2 VENUE CHIP ROW — ProGym Wan Chai + ProGym Cyberport above-the-fold
// (HK-01 SC#1 — both chips visible after hero).
// ─────────────────────────────────────────────────────────────────────────────
function VenueChipSection() {
  return (
    <Section size="sm" bg="default">
      <ContainerEditorial width="wide">
        <VenueChipRow />
      </ContainerEditorial>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.3 WHY CHOOSE US — 4-tile grid per UI-SPEC §3.3 / PART 6B §3.
// ─────────────────────────────────────────────────────────────────────────────
const WHY_CHOOSE_TILES = [
  {
    icon: Trophy,
    h3: "14 years in Hong Kong",
    body: "Since 2011, shaping how children move — now in our third dedicated venue.",
  },
  {
    icon: MapPin,
    h3: "Two dedicated facilities",
    body: "Purpose-built floors in Wan Chai and Cyberport — gymnastics apparatus, not shared space.",
  },
  {
    icon: BadgeCheck,
    h3: "A single coaching standard",
    body: "Every coach completes the ProActiv Sports training course, regardless of prior certification.",
  },
  {
    icon: ArrowUpRight,
    h3: "A progression pathway",
    body: "From Babies & Toddlers through competitive squad and rhythmic — no forced level jumps.",
  },
] as const;

function WhyChooseSection() {
  return (
    <Section size="md" bg="muted">
      <ContainerEditorial width="wide">
        <h2 className="text-h2 font-display text-foreground mb-8 text-3xl md:text-4xl font-bold">
          Why Hong Kong parents choose ProActiv.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_CHOOSE_TILES.map(({ icon: Icon, h3, body }) => (
            <Card key={h3} className="p-6">
              <Icon
                className="size-8 text-brand-navy mb-4"
                aria-hidden="true"
              />
              <h3 className="text-h3 font-display text-foreground text-xl font-semibold">
                {h3}
              </h3>
              <p className="text-body text-muted-foreground mt-2">{body}</p>
            </Card>
          ))}
        </div>
      </ContainerEditorial>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.4 PROGRAMMES — 5 tiles, 3+2 asymmetric grid on lg per UI-SPEC §3.4.
// NOTE: ProgrammeTile actual props are {title, ageRange, description, imageSrc,
// imageAlt, href, duration?}. Plan wireframe used different names — we use actual
// contract (Rule 3 deviation).
// ─────────────────────────────────────────────────────────────────────────────
const PROGRAMME_TILES = [
  {
    title: "Gymnastics",
    ageRange: "2–16yr",
    href: "/gymnastics/",
    imageSrc: "/photography/programme-beginner.webp",
    imageAlt: "Beginner gymnastics class at ProGym",
    description: "8 levels, parent-tot to competitive.",
    colSpan: "lg:col-span-2",
  },
  {
    title: "Holiday Camps",
    ageRange: "3–12yr",
    href: "/holiday-camps/",
    imageSrc: "/photography/programme-holiday-camp.webp",
    imageAlt: "Children at a ProGym holiday camp",
    description: "Easter, summer, Christmas.",
    colSpan: "lg:col-span-2",
  },
  {
    title: "Birthday Parties",
    ageRange: "3–12yr",
    href: "/birthday-parties/",
    imageSrc: "/photography/programme-birthday-party.webp",
    imageAlt: "ProGym birthday party setup",
    description: "Hosted, coach-led, two hours.",
    colSpan: "lg:col-span-2",
  },
  {
    title: "School Partnerships",
    ageRange: "K–Y13",
    href: "/school-partnerships/",
    imageSrc: "/photography/programme-school-partnership.webp",
    imageAlt: "Inter-school sports event",
    description: "Curriculum support, inter-school events.",
    colSpan: "lg:col-span-3",
  },
  {
    title: "Competitions & Events",
    ageRange: "6+",
    href: "/competitions-events/",
    imageSrc: "/photography/programme-competitive.webp",
    imageAlt: "Competitive squad gymnasts",
    description: "Competitive pathway and community events.",
    colSpan: "lg:col-span-3",
  },
] as const;

function ProgrammesSection() {
  return (
    <Section size="md" bg="default">
      <ContainerEditorial width="wide">
        <h2 className="text-h2 font-display text-foreground mb-8 text-3xl md:text-4xl font-bold">
          Programmes for every stage — toddler to competitive.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {PROGRAMME_TILES.map((p) => (
            <div key={p.title} className={p.colSpan}>
              <ProgrammeTile
                title={p.title}
                ageRange={p.ageRange}
                href={p.href}
                imageSrc={p.imageSrc}
                imageAlt={p.imageAlt}
                description={p.description}
              />
            </div>
          ))}
        </div>
      </ContainerEditorial>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.5 LOCATION SPLIT — 2-col with photo/copy per UI-SPEC §3.5.
// ─────────────────────────────────────────────────────────────────────────────
function LocationSplitSection() {
  return (
    <Section size="md" bg="default">
      <ContainerEditorial width="wide">
        <h2 className="text-h2 font-display text-foreground mb-8 text-center text-3xl md:text-4xl font-bold">
          Two ProGym venues across Hong Kong.
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {HK_VENUES.map((v) => (
            <div key={v.id} className="grid gap-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src={v.heroImage}
                  alt={`${v.nameFull} interior`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-h3 font-display text-foreground text-xl font-semibold">
                  <span className="font-accent text-brand-navy">ProGym</span>{" "}
                  {v.nameShort}
                </h3>
                <p className="text-small text-muted-foreground mt-1 text-sm">
                  {v.addressStreet}
                </p>
                {v.sizeNote && (
                  <p className="text-small text-muted-foreground text-sm">
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
                <Link
                  href={`/${v.id}/`}
                  className="inline-flex items-center gap-1 mt-4 text-brand-navy font-semibold hover:underline"
                >
                  See {v.nameShort} venue{" "}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </ContainerEditorial>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.6 SOCIAL PROOF — navy strip with LogoWall + 1 TestimonialCard per UI-SPEC §3.6.
// NOTE: TestimonialCard actual props are {quote, author, authorRole} (Rule 3 deviation).
// School logo placeholders are HUMAN-ACTION-gated — see 04-03-SUMMARY.md.
// ─────────────────────────────────────────────────────────────────────────────
function SocialProofSection() {
  return (
    <Section size="md" bg="navy">
      <ContainerEditorial width="wide">
        <h2 className="text-h2 font-display text-white mb-8 text-center text-3xl md:text-4xl font-bold">
          Trusted by Hong Kong&apos;s international school families.
        </h2>
        <LogoWall
          logos={[
            {
              src: "/photography/logo-school-placeholder-1.webp",
              alt: "Partner international school 1",
              width: 120,
              height: 60,
            },
            {
              src: "/photography/logo-school-placeholder-2.webp",
              alt: "Partner international school 2",
              width: 120,
              height: 60,
            },
            {
              src: "/photography/logo-school-placeholder-3.webp",
              alt: "Partner international school 3",
              width: 120,
              height: 60,
            },
            {
              src: "/photography/logo-school-placeholder-4.webp",
              alt: "Partner international school 4",
              width: 120,
              height: 60,
            },
          ]}
        />
        <div className="mt-8 max-w-2xl mx-auto">
          <TestimonialCard
            quote="My daughter has been with ProGym for three years. The progression from her first forward roll to her current beam routine has been transformative — and the coaches genuinely care about each child."
            author="Sarah W."
            authorRole="Parent, Wan Chai"
          />
        </div>
      </ContainerEditorial>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT — Task 1 scaffold. Task 2 appends §3.7-§3.12 + JSON-LD.
// ─────────────────────────────────────────────────────────────────────────────
export default function HKHomePage() {
  return (
    <>
      <HeroSection />
      <VenueChipSection />
      <WhyChooseSection />
      <ProgrammesSection />
      <LocationSplitSection />
      <SocialProofSection />
      {/* §3.7-§3.12 + JSON-LD added in Task 2 */}
    </>
  );
}

// Silence "unused imports" during Task 1 — these are consumed in Task 2.
// (eslint-disable-next-line @typescript-eslint/no-unused-vars)
const _task2Imports = { HK_FAQ_ITEMS, HK_BLOG_POSTS_STUB, FAQItem };

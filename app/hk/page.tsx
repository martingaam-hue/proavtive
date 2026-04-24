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
//      are handled internally. The plan said to wrap VideoPlayer in a page-local
//      `dynamic({ ssr: false })` with poster-as-loading. Next.js 15 App Router REJECTS
//      `ssr: false` in Server Components ("Ecmascript file had an error … `ssr: false`
//      is not allowed with `next/dynamic` in Server Components"). The correct pattern
//      is a dedicated Client Component — see `components/hk/hk-hero-video.tsx`, which
//      renders the single-LCP-priority Image + the (already-client) VideoPlayer.
//      Rule 1 deviation (bug from plan). The priority-Image-for-LCP behavior is preserved.
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
import Image from "next/image";
import Link from "next/link";
import {
  Trophy,
  MapPin,
  BadgeCheck,
  ArrowUpRight,
  ArrowRight,
  MessageCircle,
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
import { HKHeroVideo } from "@/components/hk/hk-hero-video";
import { WhatsAppCTA } from "@/components/hk/whatsapp-cta";
import { HK_VENUES, HK_FAQ_ITEMS, HK_BLOG_POSTS_STUB } from "@/lib/hk-data";

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
// Homepage FAQ subset — 8 items from HK_FAQ_ITEMS, filtered to homepage-eligible
// groups (about / gymnastics / venues) per UI-SPEC §3.11 + strategy PART 6B §11.
// Visible DOM order MUST equal JSON-LD order (Google FAQPage rich-result rule).
// ─────────────────────────────────────────────────────────────────────────────
const HK_HOMEPAGE_FAQS = HK_FAQ_ITEMS.filter(
  (i) =>
    i.group === "about" || i.group === "gymnastics" || i.group === "venues",
).slice(0, 8);

// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD — @graph with WebSite + FAQPage per UI-SPEC §8.3.
// Content is build-time hardcoded → safe for dangerouslySetInnerHTML (T-04-03-02).
// FAQPage.mainEntity questions/answers MUST match the rendered FAQItem props
// char-for-char (Google rich-result rule).
// ─────────────────────────────────────────────────────────────────────────────
const hkHomeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://hk.proactivsports.com/#website",
      url: "https://hk.proactivsports.com/",
      name: "ProActiv Sports Hong Kong",
      publisher: { "@id": "https://proactivsports.com/#organization" },
      inLanguage: "en-HK",
    },
    {
      "@type": "FAQPage",
      mainEntity: HK_HOMEPAGE_FAQS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// §3.1 HERO — per strategy PART 4 §1 + PART 6B §1 (verbatim H1 + subhead).
// 21:9 on desktop, 16:9 on mobile. Overlay at brand-navy/40 for 14.55:1 contrast.
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <Section size="lg" bg="default">
      <ContainerEditorial width="wide">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl">
          <HKHeroVideo
            playbackId={process.env.NEXT_PUBLIC_MUX_HK_HERO_PLAYBACK_ID ?? ""}
            posterSrc="/photography/hk-venue-wanchai-gymtots.webp"
            posterAlt="Children practising gymnastics at ProGym Wan Chai, Hong Kong"
            title="ProGym Hong Kong — hero montage"
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
// §3.7 COACHING METHOD — 3 pillars + Monica portrait per UI-SPEC §3.7.
// Portrait is HUMAN-ACTION-gated (CONTEXT D-09) — see 04-03-SUMMARY.md.
// ─────────────────────────────────────────────────────────────────────────────
const COACHING_PILLARS = [
  {
    h3: "Safety",
    body: "Every coach completes our internal training course; safety is the foundation, not a checklist.",
  },
  {
    h3: "Progression",
    body: "Eight gymnastics levels with clear movement criteria — children advance when ready, not on schedule.",
  },
  {
    h3: "Confidence",
    body: "We measure success in tries attempted, not skills mastered. Confidence outlives any single class.",
  },
] as const;

function CoachingMethodSection() {
  return (
    <Section size="md" bg="default">
      <ContainerEditorial width="wide">
        <h2 className="text-h2 font-display text-foreground mb-8 text-3xl md:text-4xl font-bold">
          How we coach.
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            {COACHING_PILLARS.map((p) => (
              <Card key={p.h3} className="p-5">
                <h3 className="text-h3 font-display text-brand-navy text-xl font-semibold">
                  {p.h3}
                </h3>
                <p className="text-body text-muted-foreground mt-2">{p.body}</p>
              </Card>
            ))}
          </div>
          <div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
              <Image
                src="/photography/coach-monica-portrait.webp"
                alt="Monica, Director of Sports Hong Kong, coaching at ProGym"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <p className="text-small text-muted-foreground mt-3 text-sm">
              Led by Monica, Director of Sports Hong Kong — 19 years coaching,
              Level 2 Italian certification.
            </p>
          </div>
        </div>
      </ContainerEditorial>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.8 CAMPS & PARTIES — 2-col revenue block per UI-SPEC §3.8.
// ─────────────────────────────────────────────────────────────────────────────
function CampsPartiesSection() {
  return (
    <Section size="md" bg="muted">
      <ContainerEditorial width="wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/photography/programme-holiday-camp.webp"
                alt="ProGym holiday camp"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <h3 className="text-h3 font-display text-foreground mt-4 text-xl font-semibold">
              Holiday Camps
            </h3>
            <ul className="mt-3 space-y-1 text-body text-muted-foreground">
              <li>· Easter</li>
              <li>· Summer</li>
              <li>· Christmas</li>
            </ul>
            <Button
              asChild
              size="touch"
              className="bg-brand-red text-white hover:bg-brand-red/90 mt-4"
            >
              <Link href="/holiday-camps/">Book a holiday camp</Link>
            </Button>
          </div>
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/photography/programme-birthday-party.webp"
                alt="ProGym birthday party"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <h3 className="text-h3 font-display text-foreground mt-4 text-xl font-semibold">
              Birthday Parties
            </h3>
            <ul className="mt-3 space-y-1 text-body text-muted-foreground">
              <li>· Two-hour hosted format</li>
              <li>· Coach-led activities</li>
              <li>· Bring the cake — we bring the apparatus</li>
            </ul>
            <Button
              asChild
              size="touch"
              variant="outline"
              className="border-brand-navy text-brand-navy hover:bg-brand-navy/5 mt-4"
            >
              <Link href="/birthday-parties/">Send an Enquiry</Link>
            </Button>
          </div>
        </div>
      </ContainerEditorial>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.9 ABOUT SNAPSHOT — 2-col prose per UI-SPEC §3.9.
// ─────────────────────────────────────────────────────────────────────────────
function AboutSnapshotSection() {
  return (
    <Section size="md" bg="default">
      <ContainerEditorial width="wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-h2 font-display text-foreground mb-4 text-3xl md:text-4xl font-bold">
              About{" "}
              <span className="font-accent text-brand-navy">ProGym</span> Hong
              Kong.
            </h2>
            <p className="text-body text-muted-foreground">
              We&apos;ve been building children&apos;s gymnastics in Hong Kong
              since 2011. Two purpose-built venues — Wan Chai and Cyberport —
              and a coaching method that treats every child as a long-term
              progression project, not a class number.
            </p>
            <p className="text-body text-muted-foreground mt-4">
              Our path is simple: a free trial, a coach who notices your child
              by name, and a programme that meets them at exactly their level.
              The first forward roll is just the beginning.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src="/photography/coaching-action-photo.webp"
              alt="ProGym coach working with a child on the beam"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </ContainerEditorial>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.10 BLOG — 1-3 HK_BLOG_POSTS_STUB entries OR empty-state per UI-SPEC §3.10.
// ─────────────────────────────────────────────────────────────────────────────
function BlogSection() {
  const posts = HK_BLOG_POSTS_STUB.slice(0, 3);
  if (posts.length === 0) {
    return (
      <Section size="md" bg="default">
        <ContainerEditorial width="default">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-h2 font-display text-foreground mb-3 text-3xl md:text-4xl font-bold">
              New posts coming soon.
            </h2>
            <p className="text-body text-muted-foreground">
              We&apos;re preparing long-form guides on gymnastics progression,
              holiday camp planning, and what to expect at your first class.
              In the meantime, our coaches are happy to answer any question
              directly.
            </p>
          </div>
        </ContainerEditorial>
      </Section>
    );
  }
  return (
    <Section size="md" bg="default">
      <ContainerEditorial width="wide">
        <h2 className="text-h2 font-display text-foreground mb-8 text-3xl md:text-4xl font-bold">
          From the blog.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <Card key={p.slug} className="overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image
                  src={p.heroImage}
                  alt={p.title}
                  fill
                  sizes="(max-width:1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <Badge variant="secondary">{p.category}</Badge>
                <h3 className="text-h3 font-display text-foreground mt-3 text-xl font-semibold">
                  {p.title}
                </h3>
                <p className="text-body text-muted-foreground mt-2">
                  {p.excerpt}
                </p>
                <p className="text-small text-muted-foreground mt-3 text-sm">
                  <time dateTime={p.publishedAt}>{p.publishedAt}</time> ·{" "}
                  {p.readTimeMinutes} min read
                </p>
              </div>
            </Card>
          ))}
        </div>
      </ContainerEditorial>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.11 FAQ — 8 accordion items per UI-SPEC §3.11 / strategy PART 6B §11.
// FAQItem wraps its own Accordion internally (Phase 2 D-01) — we div-stack the
// items per the Phase 3 root-page pattern. Rule 3 deviation vs. plan which
// suggested nesting inside an additional Accordion (would double-wrap).
// Source data is HK_HOMEPAGE_FAQS — the same array fed to hkHomeSchema.mainEntity
// so DOM order and JSON-LD order match char-for-char (Google FAQPage rule).
// ─────────────────────────────────────────────────────────────────────────────
function FAQSection() {
  return (
    <Section size="md" bg="default">
      <ContainerEditorial width="default">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-h2 font-display text-foreground mb-8 text-3xl md:text-4xl font-bold">
            Frequently asked questions.
          </h2>
          <div className="flex flex-col gap-0">
            {HK_HOMEPAGE_FAQS.map((item) => (
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
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.12 FINAL CTA — navy strip with red Book + env-conditional WhatsApp
// per UI-SPEC §3.12 / PART 6B §12.
// WhatsApp link is env-conditional — render only when NEXT_PUBLIC_HK_WHATSAPP
// is set (CONTEXT D-05 / Pitfall 7 carry). target="_blank" + rel="noopener
// noreferrer" (T-04-03-04 mitigation). Phone digits sanitised via regex and
// message pre-filled with encodeURIComponent (T-04-03-03 mitigation).
// ─────────────────────────────────────────────────────────────────────────────
function FinalCTASection() {
  const whatsappHk = process.env.NEXT_PUBLIC_HK_WHATSAPP;
  const sanitisedWhatsapp = whatsappHk?.replace(/[^0-9+]/g, "") ?? "";
  return (
    <Section size="lg" bg="navy">
      <ContainerEditorial width="default">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-h2 font-display text-white mb-3 text-3xl md:text-4xl font-bold">
            Ready to book your child&apos;s first class?
          </h2>
          <p className="text-body-lg text-brand-cream mb-6 text-base md:text-lg">
            Free 30-minute assessment, no commitment. Choose Wan Chai or
            Cyberport — or let us suggest based on your location.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="touch"
              className="bg-brand-red text-white hover:bg-brand-red/90"
            >
              <a href="/book-a-trial/free-assessment/">
                Book a Free Trial{" "}
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </a>
            </Button>
            {whatsappHk && (
              <Button
                asChild
                size="touch"
                variant="outline"
                className="border-white text-white hover:bg-white/10 bg-transparent"
              >
                <WhatsAppCTA
                  phone={sanitisedWhatsapp}
                  message="Hi ProActiv HK, I'd like to book a free trial."
                >
                  Chat on WhatsApp{" "}
                  <MessageCircle
                    className="ml-2 size-4"
                    aria-hidden="true"
                  />
                </WhatsAppCTA>
              </Button>
            )}
          </div>
        </div>
      </ContainerEditorial>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT — RSC. Returns fragment (layout provides <main id="main-content">).
// Renders 12 sections + inline JSON-LD script per UI-SPEC §3.
// ─────────────────────────────────────────────────────────────────────────────
export default function HKHomePage() {
  return (
    <>
      {/* Inline JSON-LD — T-04-03-02: content from hardcoded constants only. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hkHomeSchema) }}
      />
      <HeroSection />
      <VenueChipSection />
      <WhyChooseSection />
      <ProgrammesSection />
      <LocationSplitSection />
      <SocialProofSection />
      <CoachingMethodSection />
      <CampsPartiesSection />
      <AboutSnapshotSection />
      <BlogSection />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}

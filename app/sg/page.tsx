// Phase 5 / Plan 05-03 — SG homepage (SG-01).
//
// 13 sections per strategy PART 5 wireframe; copy verbatim from PART 6C.
// Composes Phase 2 primitives + Phase 5-local components/sg/. NO inline custom CSS.
// Hero VideoPlayer is HUMAN-ACTION-gated on NEXT_PUBLIC_MUX_SG_HERO_PLAYBACK_ID (CONTEXT D-01).
//
// Deviations from plan (Rule 3 — blocking API mismatches):
//   1. ProgrammeTile actual props are {title, ageRange, description, imageSrc, imageAlt, href, duration?}
//      — plan said {ageBand, image, alt, tagline}. Used actual names (same pattern as HK).
//   2. FAQItem actual props are {question, answer, id?, defaultOpen?, className?}
//      — the `value` field mentioned in plan is the data key in SG_FAQ_ITEMS, we pass it as `id`.
//   3. SGHeroVideo does NOT use dynamic() — VideoPlayer wraps MuxPlayer with ssr:false internally.
//   4. SG_COACHES contains Haikel/Mark/Coach King with `.name` not `.slug` for Avatar/links.
//      Slug derived from name.toLowerCase().replace(/\s+/g, "-") for coach bio links.
//
// MultiBall differentiator Pattern 11 — 3 homepage placements:
//   Placement 1 (hero trust line): "Singapore's only MultiBall wall" in HeroSection
//   Placement 2 (Why Prodigy §3 tile 1): "The only MultiBall wall in Singapore" H3 + green badge
//   Placement 3 (Three Zones §5 card): Sports+MultiBall zone green badge
//
// Photo HUMAN-ACTION gates (CONTEXT D-07):
//   Gate 1: /photography/sg-venue-katong-hero.webp — hero poster
//   Gate 3: /photography/coach-{slug}-portrait.webp — coach portraits
//   Other: /photography/sg-*.webp imagery; graceful broken-image fallback per Phase 3 D-10 pattern.

import type { Metadata } from "next";
import Image from "next/image";
import { Zap, Trophy, BadgeCheck, ArrowUpRight, ArrowRight, MessageCircle } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgrammeTile } from "@/components/ui/programme-tile";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { LogoWall } from "@/components/ui/logo-wall";
import { FAQItem } from "@/components/ui/faq-item";
import { VenueChipRow } from "@/components/sg/venue-chip-row";
import { SGHeroVideo } from "@/components/sg/sg-hero-video";
import { WhatsAppCTA } from "@/components/sg/whatsapp-cta";
import {
  SG_FAQ_ITEMS,
  SG_ZONES,
  SG_CAMP_TYPES,
  SG_COACHES,
  SG_BLOG_POSTS_STUB,
  KATONG_POINT,
} from "@/lib/sg-data";

// ─────────────────────────────────────────────────────────────────────────────
// Page metadata — per-page openGraph fully specified (Pitfall 2 — shallow merge).
// ─────────────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Kids' Sports Classes Singapore | Prodigy by ProActiv Sports @ Katong Point",
  description:
    "Kids' sports classes, holiday camps & birthday parties at Prodigy, Katong Point. Home of Singapore's only MultiBall wall. Book a free trial.",
  openGraph: {
    title: "Kids' Sports Classes Singapore | Prodigy @ Katong Point",
    description:
      "Singapore's only MultiBall wall — kids' sport, camps, and parties at Katong Point.",
    url: "https://sg.proactivsports.com/",
    siteName: "Prodigy by ProActiv Sports — Singapore",
    locale: "en_SG",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Prodigy by ProActiv Sports Singapore",
      },
    ],
  },
  alternates: { canonical: "https://sg.proactivsports.com/" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Homepage FAQ subset — 8 items filtered to homepage-eligible groups.
// Visible DOM order MUST equal JSON-LD order (Google FAQPage rich-result rule).
// ─────────────────────────────────────────────────────────────────────────────
const SG_HOMEPAGE_FAQS = SG_FAQ_ITEMS.filter(
  (i) =>
    i.group === "about" ||
    i.group === "classes" ||
    i.group === "venue" ||
    i.group === "multiball",
).slice(0, 8);

// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD — @graph with WebSite + FAQPage per UI-SPEC §8.3.
// FAQPage.mainEntity questions/answers MUST match the rendered FAQItem props
// char-for-char (Google rich-result rule).
// ─────────────────────────────────────────────────────────────────────────────
const sgHomeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://sg.proactivsports.com/#website",
      url: "https://sg.proactivsports.com/",
      name: "Prodigy by ProActiv Sports — Singapore",
      publisher: { "@id": "https://proactivsports.com/#organization" },
      inLanguage: "en-SG",
    },
    {
      "@type": "FAQPage",
      mainEntity: SG_HOMEPAGE_FAQS.map((item) => ({
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
// §3.1 HERO — per strategy PART 5 §1 + PART 6C §Hero (verbatim H1 + subhead).
// 21:9 on desktop, 16:9 on mobile. Overlay at brand-navy/40 for 14.55:1 contrast.
// MultiBall trust line placement 1 of 3 (Pattern 11).
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <Section size="lg" bg="default">
      <ContainerEditorial width="wide">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl">
          <SGHeroVideo
            playbackId={process.env.NEXT_PUBLIC_MUX_SG_HERO_PLAYBACK_ID ?? ""}
            posterSrc="/photography/sg-venue-katong-hero.webp"
            posterAlt="Children playing at Prodigy @ Katong Point, Singapore's only MultiBall wall"
            title="Prodigy Singapore — Prodigy camp-day montage"
          />
          <div
            className="absolute inset-0 bg-brand-navy/40"
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex flex-col items-start justify-center px-6 md:px-12">
            <h1 className="text-display font-display text-white max-w-2xl leading-tight text-4xl md:text-5xl lg:text-6xl font-bold">
              Where Singapore&apos;s kids come to move, play, and grow.
            </h1>
            <p className="text-body-lg text-brand-cream max-w-xl mt-4 text-base md:text-lg">
              Prodigy @ Katong Point — three zones, three seasons of camps, and
              a coaching team that meets every child at exactly their level.
            </p>
            {/* MultiBall trust line — Pattern 11 placement 1 */}
            <p className="text-body-lg text-brand-cream mt-3">
              <span className="font-accent text-brand-green">
                Singapore&apos;s only MultiBall wall
              </span>{" "}
              <Zap
                size={16}
                className="inline text-brand-yellow align-middle"
                aria-hidden="true"
              />{" "}
              · Katong Point
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                size="touch"
                className="bg-brand-red text-white hover:bg-brand-red/90 focus-visible:ring-2 focus-visible:ring-white"
              >
                <a href="/book-a-trial/">
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
                <a href="/book-a-trial/?subject=general-enquiry">
                  Send an Enquiry
                </a>
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
// §3.2 VENUE CHIP ROW — Single Katong Point chip above the fold (Plan 05-02).
// ─────────────────────────────────────────────────────────────────────────────
function VenueChipRowSection() {
  return (
    <Section size="sm" bg="default">
      <ContainerEditorial width="wide">
        <VenueChipRow />
      </ContainerEditorial>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.3 WHY PRODIGY — 4-tile grid per UI-SPEC §3.3 / PART 6C §2.
// Tile 1 = MultiBall flagship (Pattern 11 placement 2).
// ─────────────────────────────────────────────────────────────────────────────
function WhyProdigySection() {
  return (
    <Section size="md" bg="muted">
      <ContainerEditorial width="wide">
        <h2 className="text-h2 font-display text-foreground mb-8 text-3xl md:text-4xl font-bold">
          Why Singapore parents choose Prodigy.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tile 1 — MultiBall flagship (Pattern 11 placement 2) */}
          <Card className="p-6 relative">
            <Zap className="size-8 text-brand-green mb-4" aria-hidden="true" />
            <h3 className="text-h3 font-display text-foreground text-xl font-semibold">
              The only MultiBall wall in Singapore
            </h3>
            <p className="text-body text-muted-foreground mt-2">
              Our MultiBall interactive wall turns every sports drill into a
              reactive, game-like experience. Children who struggle to focus in
              traditional drills thrive on the wall. Nothing else like it in
              Singapore.
            </p>
            <Badge className="bg-brand-green text-white absolute top-3 right-3">
              Singapore&apos;s only
            </Badge>
          </Card>
          {/* Tile 2 */}
          <Card className="p-6">
            <Trophy
              className="size-8 text-brand-navy mb-4"
              aria-hidden="true"
            />
            <h3 className="text-h3 font-display text-foreground text-xl font-semibold">
              Multi-sport, not single-sport
            </h3>
            <p className="text-body text-muted-foreground mt-2">
              Gymnastics, climbing, parkour, football, basketball, rugby, tennis,
              dodgeball, and martial arts — all under one roof. Children discover
              what they love before they commit.
            </p>
          </Card>
          {/* Tile 3 */}
          <Card className="p-6">
            <BadgeCheck
              className="size-8 text-brand-navy mb-4"
              aria-hidden="true"
            />
            <h3 className="text-h3 font-display text-foreground text-xl font-semibold">
              A single coaching standard
            </h3>
            <p className="text-body text-muted-foreground mt-2">
              Every coach completes the ProActiv Sports internal training course.
              Our team is led by Haikel — Head of Sports with seven-plus years of
              experience — and supported by Mark and Coach King.
            </p>
          </Card>
          {/* Tile 4 */}
          <Card className="p-6">
            <ArrowUpRight
              className="size-8 text-brand-navy mb-4"
              aria-hidden="true"
            />
            <h3 className="text-h3 font-display text-foreground text-xl font-semibold">
              Built for progression
            </h3>
            <p className="text-body text-muted-foreground mt-2">
              From first forward roll to competitive confidence — three dedicated
              zones, structured weekly classes, and holiday camps that build on
              each other term by term.
            </p>
          </Card>
        </div>
      </ContainerEditorial>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.4 PROGRAMMES — 4 ProgrammeTile cards, 2+2 staggered grid per UI-SPEC §3.4.
// ─────────────────────────────────────────────────────────────────────────────
const PROGRAMME_TILES = [
  {
    title: "Weekly Classes",
    ageRange: "Ages 2–12",
    href: "/weekly-classes/",
    imageSrc: "/photography/sg-weekly-classes.webp",
    imageAlt: "Children in a weekly sports class at Prodigy Katong Point",
    description: "Movement, Sports + MultiBall, Climbing — three zones, every week.",
    mt: "",
  },
  {
    title: "Prodigy Camps",
    ageRange: "Ages 4–12",
    href: "/prodigy-camps/",
    imageSrc: "/photography/sg-prodigy-camps.webp",
    imageAlt: "Children at a themed Prodigy holiday camp",
    description: "Themed and multi-activity every school holiday.",
    mt: "md:mt-8",
  },
  {
    title: "Birthday Parties",
    ageRange: "Ages 3–12",
    href: "/birthday-parties/",
    imageSrc: "/photography/sg-birthday-party.webp",
    imageAlt: "Prodigy birthday party with coach-led activities",
    description: "Fully hosted, coach-led — the easiest birthday you'll plan.",
    mt: "",
  },
  {
    title: "School Partnerships",
    ageRange: "All ages",
    href: "/school-partnerships/",
    imageSrc: "/photography/sg-school-partnership.webp",
    imageAlt: "ProActiv Sports school enrichment programme in Singapore",
    description: "IFS, KidsFirst and more — enrichment and sports days.",
    mt: "md:mt-8",
  },
] as const;

function ProgrammesSection() {
  return (
    <Section size="md" bg="default">
      <ContainerEditorial width="wide">
        <h2 className="text-h2 font-display text-foreground mb-8 text-3xl md:text-4xl font-bold">
          Programmes for every stage — toddler to tween.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROGRAMME_TILES.map((p) => (
            <div key={p.title} className={p.mt}>
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
// §3.5 THREE ZONES — 3 zone cards from SG_ZONES per UI-SPEC §3.5.
// Sports+MultiBall card carries MultiBall badge (Pattern 11 placement 3).
// Mobile reshuffle: Sports+MultiBall first on mobile via order-first md:order-none.
// ─────────────────────────────────────────────────────────────────────────────
function ThreeZonesSection() {
  // Find Sports+MultiBall zone for mobile order override
  const sportsZone = SG_ZONES.find((z) => z.slug === "sports-multiball");
  const movementZone = SG_ZONES.find((z) => z.slug === "movement");
  const climbingZone = SG_ZONES.find((z) => z.slug === "climbing");
  const orderedZones = [movementZone, sportsZone, climbingZone].filter(Boolean);

  return (
    <Section size="md" bg="default">
      <ContainerEditorial width="wide">
        <h2 className="text-h2 font-display text-foreground mb-8 text-3xl md:text-4xl font-bold">
          Three zones. Infinite movement.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {orderedZones.map((zone) => {
            if (!zone) return null;
            const isMultiBall = zone.slug === "sports-multiball";
            return (
              <Card
                key={zone.slug}
                className={`p-6 relative${isMultiBall ? " order-first md:order-none" : ""}`}
              >
                {isMultiBall && (
                  <Badge className="bg-brand-green text-white absolute top-3 right-3">
                    Singapore&apos;s only MultiBall wall
                  </Badge>
                )}
                <h3 className="text-h3 font-display text-foreground text-xl font-semibold mb-2">
                  {zone.label}
                </h3>
                <p className="text-small text-muted-foreground text-sm font-medium mb-3">
                  {zone.ageBand}
                </p>
                <ul className="space-y-2">
                  {zone.whatTheyLearn.slice(0, 3).map((item) => (
                    <li key={item} className="text-body text-muted-foreground text-sm flex gap-2">
                      <span className="text-brand-green mt-0.5">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={zone.href}
                  className="inline-flex items-center gap-1 mt-4 text-brand-navy font-semibold hover:underline text-sm"
                >
                  Explore zone <ArrowRight className="size-3" aria-hidden="true" />
                </a>
              </Card>
            );
          })}
        </div>
      </ContainerEditorial>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.6 SOCIAL PROOF — navy strip with LogoWall + TestimonialCard per UI-SPEC §3.6.
// IFS + KidsFirst logos — text fallback if logo asset missing (HUMAN-ACTION D-11).
// NOTE: do NOT duplicate Manjula testimonial from root (Pitfall 6).
// ─────────────────────────────────────────────────────────────────────────────
function SocialProofSection() {
  return (
    <Section size="md" bg="navy">
      <ContainerEditorial width="wide">
        <h2 className="text-h2 font-display text-white mb-8 text-center text-3xl md:text-4xl font-bold">
          Trusted by Singapore&apos;s international school families.
        </h2>
        <LogoWall
          logos={[
            {
              src: "/photography/logo-ifs.webp",
              alt: "International French School Singapore",
              width: 120,
              height: 60,
            },
            {
              src: "/photography/logo-kidsfirst.webp",
              alt: "KidsFirst Singapore",
              width: 120,
              height: 60,
            },
          ]}
        />
        <div className="mt-8 max-w-2xl mx-auto">
          <TestimonialCard
            quote="Prodigy has been brilliant for our son — he's tried climbing, football, and the MultiBall wall all in one term. The coaches know him by name and he can't wait for Saturday classes."
            author="Rachel T."
            authorRole="Parent, East Coast"
          />
        </div>
      </ContainerEditorial>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.7 CAMPS FEATURE — single large photo-left-copy-right card per UI-SPEC §3.7.
// Stub data for upcoming Prodigy camp (Phase 6 CMS replaces with Event schema).
// ─────────────────────────────────────────────────────────────────────────────
function CampsFeatureSection() {
  return (
    <Section size="md" bg="muted">
      <ContainerEditorial width="wide">
        <h2 className="text-h2 font-display text-foreground mb-8 text-3xl md:text-4xl font-bold">
          Prodigy Holiday Camps.
        </h2>
        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[320px]">
              <Image
                src="/photography/sg-prodigy-camps.webp"
                alt="Children at a Prodigy themed holiday camp at Katong Point"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="p-6 lg:p-8 flex flex-col justify-center">
              <Badge className="bg-brand-green text-white w-fit mb-4">
                Next Camp
              </Badge>
              <h3 className="text-h3 font-display text-foreground text-2xl font-bold mb-2">
                Ninja Warrior Camp
              </h3>
              <p className="text-muted-foreground mb-1 text-sm font-medium">
                16–20 June · Ages 5–12
              </p>
              <p className="text-body text-muted-foreground mt-3">
                Five action-packed days of ninja-themed sport, obstacle courses,
                MultiBall wall challenges, and gymnastics — all coached by the
                Prodigy team. Dri-fit T-shirt and camp certificate included.
              </p>
              <div className="mt-6">
                <Button
                  asChild
                  size="touch"
                  variant="outline"
                  className="border-brand-navy text-brand-navy hover:bg-brand-navy/5"
                >
                  <a href="/prodigy-camps/themed/">Book Camp →</a>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </ContainerEditorial>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.8 BIRTHDAY PARTIES — 2-col revenue block per UI-SPEC §3.8 + PART 6C §7.
// MultiBall wall access mention + Send an Enquiry CTA.
// ─────────────────────────────────────────────────────────────────────────────
function BirthdayPartySection() {
  return (
    <Section size="md" bg="default">
      <ContainerEditorial width="wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-h2 font-display text-foreground mb-4 text-3xl md:text-4xl font-bold">
              The easiest birthday you&apos;ll ever plan.
            </h2>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-3 items-start">
                <span className="text-brand-green font-bold mt-0.5">·</span>
                <span className="text-body text-muted-foreground">
                  <strong>2 hours hosted</strong> — venue exclusive use, Party
                  Room with AV and lighting, decorations sorted
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-brand-green font-bold mt-0.5">·</span>
                <span className="text-body text-muted-foreground">
                  <strong>Coach-led activities</strong> — structured sport and
                  play sessions, so you enjoy the party too
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-brand-green font-bold mt-0.5">·</span>
                <span className="text-body text-muted-foreground">
                  <strong>MultiBall wall access</strong> — Singapore&apos;s only
                  interactive training wall, a birthday highlight every child
                  talks about
                </span>
              </li>
            </ul>
            <div className="mt-6">
              <Button
                asChild
                size="touch"
                className="bg-brand-red text-white hover:bg-brand-red/90"
              >
                <a href="/book-a-trial/?subject=birthday-party">
                  Send an Enquiry
                </a>
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src="/photography/sg-birthday-party.webp"
              alt="Children celebrating a birthday party at Prodigy Katong Point"
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
// §3.9 COACHES — 3-col coach grid from SG_COACHES per UI-SPEC §3.9.
// Avatar portraits HUMAN-ACTION D-07 gate 3 — broken-image acceptable at Phase 5.
// ─────────────────────────────────────────────────────────────────────────────
function CoachesSection() {
  return (
    <Section size="md" bg="muted">
      <ContainerEditorial width="wide">
        <h2 className="text-h2 font-display text-foreground mb-8 text-3xl md:text-4xl font-bold">
          Meet the coaches.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SG_COACHES.map((coach) => {
            const slug = coach.name.toLowerCase().replace(/\s+/g, "-");
            return (
              <Card key={coach.name} className="p-6 flex flex-col items-start">
                <div className="relative size-[128px] overflow-hidden rounded-full mb-4 bg-muted">
                  <Image
                    src={coach.portrait}
                    alt={`${coach.name} — ${coach.role} at Prodigy Singapore`}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
                <h3 className="text-h3 font-display text-foreground text-xl font-semibold">
                  {coach.name}
                </h3>
                <p className="text-small text-muted-foreground text-sm font-medium mt-0.5 mb-3">
                  {coach.role}
                </p>
                <p className="text-body text-muted-foreground text-sm flex-1">
                  {coach.bio}
                </p>
                <a
                  href={`/coaches/#${slug}`}
                  className="inline-flex items-center gap-1 mt-4 text-brand-navy font-semibold hover:underline text-sm"
                >
                  Read bio → <ArrowRight className="size-3" aria-hidden="true" />
                </a>
              </Card>
            );
          })}
        </div>
      </ContainerEditorial>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.10 ABOUT — 2-col prose + photo per UI-SPEC §3.10 + PART 6C §9.
// Cross-market link to HK via NEXT_PUBLIC_HK_URL env var.
// ─────────────────────────────────────────────────────────────────────────────
function AboutSection() {
  const hkUrl = process.env.NEXT_PUBLIC_HK_URL ?? "#";
  return (
    <Section size="md" bg="default">
      <ContainerEditorial width="wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-h2 font-display text-foreground mb-4 text-3xl md:text-4xl font-bold">
              About{" "}
              <span className="font-accent text-brand-green">Prodigy</span>{" "}
              Singapore.
            </h2>
            <p className="text-body text-muted-foreground">
              Prodigy is ProActiv Sports&apos; Singapore home — a 2,700 sq ft
              indoor facility at Katong Point, purpose-built for children aged 2
              to 12. Three zones, a qualified coaching team, and the only
              MultiBall interactive wall in Singapore.
            </p>
            <p className="text-body text-muted-foreground mt-4">
              We believe sport should be joyful before it is serious. Our free
              trial is the first step — a 30-minute session where we learn what
              your child can do and find the right class for where they are right
              now.
            </p>
            <p className="text-body text-muted-foreground mt-4">
              ProActiv Sports has been building children&apos;s sports programmes
              since 2011.{" "}
              <a
                href={hkUrl}
                className="text-brand-navy font-semibold hover:underline"
              >
                14 years in Hong Kong →
              </a>
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src="/photography/sg-coaching-action.webp"
              alt="Prodigy coach working with a child at Katong Point"
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
// §3.11 BLOG — SG_BLOG_POSTS_STUB entries or empty-state per UI-SPEC §3.11.
// D-07 / Pitfall 9: use real Katong Point photography paths only — no placeholder filenames.
// ─────────────────────────────────────────────────────────────────────────────
function BlogSection() {
  const posts = SG_BLOG_POSTS_STUB.slice(0, 3);
  if (posts.length === 0) {
    return (
      <Section size="md" bg="default">
        <ContainerEditorial width="default">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-h2 font-display text-foreground mb-3 text-3xl md:text-4xl font-bold">
              New posts coming soon.
            </h2>
            <p className="text-body text-muted-foreground">
              We&apos;re preparing guides on Singapore&apos;s MultiBall wall,
              holiday camp planning, and what to expect at a free trial. In the
              meantime, our coaches are happy to answer any question directly.
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((p) => (
            <Card key={p.slug} className="overflow-hidden">
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
// §3.12 FAQ — SG_HOMEPAGE_FAQS via FAQItem composition per UI-SPEC §3.12.
// Do NOT nest in a parent Accordion — FAQItem internally composes its own Accordion;
// double-nesting breaks state (PATTERNS §FAQItem Composition).
// DOM order MUST match JSON-LD FAQPage.mainEntity order (Google FAQPage rule).
// ─────────────────────────────────────────────────────────────────────────────
function FAQSection() {
  return (
    <Section size="md" bg="default">
      <ContainerEditorial width="default">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-h2 font-display text-foreground mb-8 text-3xl md:text-4xl font-bold">
            Frequently asked questions.
          </h2>
          <div className="space-y-2">
            {SG_HOMEPAGE_FAQS.map((item) => (
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
// §3.13 FINAL CTA — navy strip with red Book + env-conditional WhatsApp
// per UI-SPEC §3.13 / PART 6C §12.
// WhatsApp link conditional on NEXT_PUBLIC_WHATSAPP_SG (CONTEXT D-08).
// target="_blank" + rel="noopener noreferrer" (T-05-24 mitigation).
// ─────────────────────────────────────────────────────────────────────────────
function FinalCTASection() {
  const whatsappSg = process.env.NEXT_PUBLIC_WHATSAPP_SG;
  const sanitisedWhatsapp = whatsappSg?.replace(/[^0-9+]/g, "") ?? "";
  return (
    <Section size="lg" bg="navy">
      <ContainerEditorial width="default">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-h2 font-display text-white mb-3 text-3xl md:text-4xl font-bold">
            Ready to try a free trial at Prodigy?
          </h2>
          <p className="text-body-lg text-brand-cream mb-6 text-base md:text-lg">
            Free 30-minute assessment, no commitment. Come and see the
            MultiBall wall, meet the coaches, and find the right class for
            your child.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="touch"
              className="bg-brand-red text-white hover:bg-brand-red/90"
            >
              <a href="/book-a-trial/">
                Book a Free Trial{" "}
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </a>
            </Button>
            {whatsappSg && (
              <Button
                asChild
                size="touch"
                variant="outline"
                className="border-white text-white hover:bg-white/10 bg-transparent"
              >
                <WhatsAppCTA
                  phone={sanitisedWhatsapp}
                  message="Hi Prodigy SG, I'd like to book a free trial."
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
// Renders 13 sections + inline JSON-LD script per UI-SPEC §3.
// ─────────────────────────────────────────────────────────────────────────────
export default function SGHomePage() {
  return (
    <>
      {/* Inline JSON-LD — content from hardcoded constants only (T-05-20 / T-05-21). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sgHomeSchema) }}
      />
      <HeroSection />
      <VenueChipRowSection />
      <WhyProdigySection />
      <ProgrammesSection />
      <ThreeZonesSection />
      <SocialProofSection />
      <CampsFeatureSection />
      <BirthdayPartySection />
      <CoachesSection />
      <AboutSection />
      <BlogSection />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}

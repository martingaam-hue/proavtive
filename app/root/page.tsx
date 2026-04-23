// Phase 3 / Plan 03-02 — Gateway homepage. Replaces Phase 1 stub.
//
// Composition of 8 sections per strategy PART 3 §1-9 + verbatim copy from PART 6A.
// Inline JSON-LD: Organization + WebSite + FAQPage (FAQ answers MUST match visible copy verbatim).
// metadata: FULL openGraph object (Pitfall 2 — no shallow-merge with layout).
// Single <Image priority> = hero only (Pitfall 6).
// Cross-subdomain CTAs = absolute <a href={NEXT_PUBLIC_*_URL}> in <Button asChild> (Pitfall 7).
//
// PHOTO NOTE: All photography paths below require real ProActiv photos to be processed
// via `pnpm photos:process` before deployment. Missing photos listed in 03-02-SUMMARY.md.
// Until photos are provided, Next.js will serve a 404 for these static paths (dev only).

import type { Metadata } from "next";
import Image from "next/image";
import { Trophy, Activity, Backpack, Cake, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { MarketCard } from "@/components/ui/market-card";
import { StatStrip } from "@/components/ui/stat-strip";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { FAQItem } from "@/components/ui/faq-item";
import { Card } from "@/components/ui/card";
import { LeadershipSection } from "@/components/root/leadership-section";
import type { LeadershipCardProps } from "@/components/root/leadership-card";

// ─────────────────────────────────────────────────────────────────────────────
// Environment variables (build-time inlined — Pitfall 7: never use <Link> for
// cross-subdomain CTAs; always absolute href)
// ─────────────────────────────────────────────────────────────────────────────
const HK_URL = process.env.NEXT_PUBLIC_HK_URL ?? "/?__market=hk";
const SG_URL = process.env.NEXT_PUBLIC_SG_URL ?? "/?__market=sg";

// ─────────────────────────────────────────────────────────────────────────────
// FAQ_ITEMS — verbatim from UI-SPEC §3.7 / PART 6A §7
// Answers MUST match visible page copy verbatim (Google FAQPage rich-result rule — T-03-09)
// ─────────────────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    value: "faq-1",
    question: "What is ProActiv Sports?",
    answer:
      "ProActiv Sports is a children's gymnastics and sports specialist founded in Hong Kong in 2011. We run dedicated facilities in Hong Kong (ProGym Wan Chai and ProGym Cyberport) and Singapore (Prodigy @ Katong Point), offering weekly classes, holiday camps, birthday parties, and competitive pathways for children aged 2 to 16.",
  },
  {
    value: "faq-2",
    question: "Where does ProActiv Sports operate?",
    answer:
      "Hong Kong and Singapore. In Hong Kong: ProGym Wan Chai (The Hennessy, 15/F, 256 Hennessy Road) and ProGym Cyberport (5,000 sq ft, opened August 2025). In Singapore: Prodigy @ Katong Point (Level 3, 451 Joo Chiat Road).",
  },
  {
    value: "faq-3",
    question: "What programmes do you offer?",
    answer:
      "Weekly classes, holiday camps, birthday parties, school partnerships, and competition events. Gymnastics is the core in Hong Kong; in Singapore we offer a multi-sport programme including gymnastics, climbing, football, basketball, martial arts, and the MultiBall interactive wall.",
  },
  {
    value: "faq-4",
    question: "What age range do you work with?",
    answer:
      "From 12 months (Babies & Toddlers classes in Hong Kong) through to 16 years. Adult classes are also available at ProGym.",
  },
  {
    value: "faq-5",
    question: "How do I book a trial?",
    answer:
      "All new children are welcome to a free 30-minute assessment. Choose your city below and we'll guide you through it.",
  },
  {
    value: "faq-6",
    question: "Are there differences between the Hong Kong and Singapore offerings?",
    answer:
      "Yes. Hong Kong is gymnastics-led, with a competitive pathway and rhythmic gymnastics. Singapore is multi-sport, anchored by our Prodigy brand and the only MultiBall wall in the country. Both share the same coaching standards and safety approach.",
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// LEADERS — verbatim from UI-SPEC §3.6 / PART 6A §6
// Portrait paths require real photos via pnpm photos:process (D-10 HUMAN-ACTION)
// ─────────────────────────────────────────────────────────────────────────────
const LEADERS: LeadershipCardProps[] = [
  {
    name: "Will",
    role: "Founder",
    bioLine:
      "Co-founder of ProActiv Sports, graduate of Dublin City University (Sports Science and Health), and the driving force behind our 2014 expansion to Singapore.",
    portrait: "/photography/leadership-will.webp",
    portraitAlt: "Will, Founder of ProActiv Sports",
  },
  {
    name: "Monica",
    role: "Director of Sports, Hong Kong",
    bioLine:
      "19 years coaching children's gymnastics. Level 2 Italian coaching and judging certifications. Previously coached at Cristina Bontas Gymnastics Club (Canada, working with Canadian National Team athletes) and a competitive club in Dubai.",
    portrait: "/photography/leadership-monica.webp",
    portraitAlt: "Monica, Director of Sports for Hong Kong",
  },
  {
    name: "Haikel",
    role: "Head of Sports, Singapore",
    bioLine:
      "Known affectionately as 'Mr. Muscle Man.' Diploma in Sports Coaching, seven-plus years leading coaching teams, and the heart of the Prodigy culture.",
    portrait: "/photography/leadership-haikel.webp",
    portraitAlt: "Haikel, Head of Sports for Singapore",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// STATS — verbatim from UI-SPEC §3.2
// ─────────────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "14", label: "Years in operation" },
  { value: "2", label: "Cities" },
  { value: "3", label: "Dedicated venues" },
  { value: "2–16", label: "Ages" },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// WHAT WE DO TILES — verbatim from UI-SPEC §3.4 / PART 6A §4
// ─────────────────────────────────────────────────────────────────────────────
const WHAT_WE_DO_TILES = [
  {
    icon: Trophy,
    title: "Gymnastics",
    description:
      "From toddler classes to the competitive pathway, with structured progression at every level.",
    markets: "HK: ProGym Wan Chai & Cyberport · SG: Prodigy",
  },
  {
    icon: Activity,
    title: "Sports Classes",
    description:
      "Football, basketball, rugby, tennis, dodgeball, martial arts, parkour.",
    markets: "Core programme in SG · Multi-activity options in HK camps",
  },
  {
    icon: Backpack,
    title: "Holiday Camps",
    description:
      "Action-packed school holiday weeks, year-round. Themed options, half-day and full-day.",
    markets: "HK & SG",
  },
  {
    icon: Cake,
    title: "Birthday Parties",
    description: "Two hours of hosted, coach-led fun. You bring the cake; we do the rest.",
    markets: "HK & SG",
  },
  {
    icon: Medal,
    title: "Competitions & Events",
    description: "Competitive squads, inter-school events, community sports days.",
    markets: "HK & SG",
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// PARTNER LOGOS — text-only fallback chips (logo SVGs not yet provided)
// Phase 3 ships text-only per UI-SPEC §3.5 LogoWall asset note.
// Note: LogoWall requires src/width/height so partner names rendered inline as
// styled text chips — see deviation note in 03-02-SUMMARY.md
// ─────────────────────────────────────────────────────────────────────────────
const PARTNER_NAMES = [
  "International French School",
  "Singapore American School",
  "KidsFirst",
  "ESF",
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD SCHEMA — Organization + WebSite + FAQPage
// T-03-06: JSON.stringify input built only from hardcoded constants (no user input)
// T-03-09: FAQ answers match visible copy verbatim (Test 5 enforces this)
// ─────────────────────────────────────────────────────────────────────────────
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://proactivsports.com/#organization",
      name: "ProActiv Sports",
      url: "https://proactivsports.com/",
      logo: "https://proactivsports.com/assets/logo.svg",
      foundingDate: "2011",
      foundingLocation: {
        "@type": "Place",
        name: "Hong Kong",
      },
      description:
        "ProActiv Sports is a children's gymnastics and sports specialist founded in Hong Kong in 2011, operating dedicated venues in Hong Kong and Singapore for children aged 2 to 16.",
      sameAs: [
        "https://www.facebook.com/proactivsportshk/",
        "https://www.instagram.com/proactivsports/",
      ],
      areaServed: ["Hong Kong", "Singapore"],
    },
    {
      "@type": "WebSite",
      "@id": "https://proactivsports.com/#website",
      url: "https://proactivsports.com/",
      name: "ProActiv Sports",
      publisher: { "@id": "https://proactivsports.com/#organization" },
    },
    {
      "@type": "FAQPage",
      "@id": "https://proactivsports.com/#faq",
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// METADATA — FULL openGraph (Pitfall 2: no shallow-merge gap with layout)
// Title overrides template at root home per UI-SPEC §8.2 note
// ─────────────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Move. Grow. Thrive — Children's Gymnastics & Sports in HK & Singapore",
  description:
    "ProActiv Sports has been shaping how children move since 2011. Dedicated gymnastics and sports programmes in Hong Kong (ProGym Wan Chai & Cyberport) and Singapore (Prodigy @ Katong Point). Ages 2–16.",
  openGraph: {
    title: "Move. Grow. Thrive — Children's Gymnastics & Sports in HK & Singapore",
    description:
      "ProActiv Sports has been shaping how children move since 2011. Dedicated gymnastics and sports programmes in Hong Kong (ProGym Wan Chai & Cyberport) and Singapore (Prodigy @ Katong Point). Ages 2–16.",
    url: "https://proactivsports.com/",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ProActiv Sports — Move. Grow. Thrive.",
      },
    ],
    siteName: "ProActiv Sports",
    locale: "en_GB",
    type: "website",
  },
  alternates: {
    canonical: "https://proactivsports.com/",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PRIVATE SECTION COMPONENTS
// All 8 sections declared as private functions in this file (plan guidance:
// "planner choice — recommended self-contained approach avoids 8 new files").
// ─────────────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <Section size="lg" bg="default">
      <ContainerEditorial width="wide">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8 lg:items-center">
          {/* Left col: copy + CTAs */}
          <div className="lg:col-span-6">
            <h1 className="text-display font-display text-foreground">
              Move. Grow. Thrive. In Hong Kong and Singapore.
            </h1>
            <p className="text-body-lg text-muted-foreground mt-4 max-w-prose">
              ProActiv Sports has been shaping how children move since 2011. Dedicated gymnastics
              and sports programmes, built around your child&apos;s confidence, coordination, and
              joy — across three venues in two cities.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button asChild size="touch" variant="default">
                <a href={HK_URL}>Enter Hong Kong →</a>
              </Button>
              <Button asChild size="touch" variant="default">
                <a href={SG_URL}>Enter Singapore →</a>
              </Button>
            </div>
            <p className="mt-6 text-small text-muted-foreground">
              Since 2011 · Three dedicated venues · Trusted by leading international schools across Asia.
            </p>
          </div>
          {/* Right col: hero photo (only priority image on page — Pitfall 6) */}
          <div className="lg:col-span-6 relative aspect-[4/3] lg:aspect-auto lg:h-[520px] rounded-xl overflow-hidden">
            <Image
              src="/photography/root-gateway-hero.webp"
              alt="Children mid-movement at ProActiv Sports — gymnastics class in Hong Kong"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </ContainerEditorial>
    </Section>
  );
}

function StorySection() {
  return (
    <Section size="md" bg="default">
      <ContainerEditorial width="default">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-h2 font-display text-foreground">
            A children&apos;s sports specialist — not a gym with a kids&apos; class.
          </h2>
          <div className="text-body-lg text-foreground space-y-4 mt-6">
            <p>
              ProActiv Sports was founded in Hong Kong in 2011 and expanded to Singapore in 2014.
              We run purpose-built facilities for gymnastics and multi-sports, with a single focus:
              helping children aged 2 to 16 build physical confidence, coordination, and a lifelong
              relationship with movement.
            </p>
            <p>
              Every coach on our team completes the ProActiv Sports training course — regardless of
              prior qualifications — so that whether your child trains with us in Wan Chai, Cyberport,
              or Katong, the standard of care and progression is the same.
            </p>
          </div>
        </div>
        <StatStrip stats={STATS} className="mt-12" />
      </ContainerEditorial>
    </Section>
  );
}

function MarketCardsSection() {
  return (
    <Section size="md" bg="muted">
      <ContainerEditorial width="wide">
        <h2 className="text-h2 font-display text-foreground mb-8 text-center md:text-left">
          Two cities. One standard.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* NOTE: Market cards use priority={false} to satisfy Pitfall 6 (single priority image = hero only).
              UI-SPEC §3.3 lists priority={true} for these cards but this implementation overrides
              to false per the plan's explicit instruction: "OVERRIDE to false in this implementation".
              Documented in 03-02-SUMMARY.md as a planned deviation. */}
          <MarketCard
            market="hk"
            label="ProActiv Sports Hong Kong"
            tagline="Gymnastics-led. Two dedicated venues — ProGym Wan Chai & ProGym Cyberport."
            href={HK_URL}
            imageSrc="/photography/hk-progym-wan-chai.webp"
            imageAlt="A coach guiding a child through a beam routine at ProGym Wan Chai"
            priority={false}
          />
          <MarketCard
            market="sg"
            label="Prodigy by ProActiv Sports"
            tagline="Multi-sport. Singapore's only MultiBall interactive wall — Movement, Sports, Climbing zones at Katong Point."
            href={SG_URL}
            imageSrc="/photography/sg-prodigy-katong.webp"
            imageAlt="Children climbing the MultiBall wall at Prodigy @ Katong Point, Singapore"
            priority={false}
          />
        </div>
      </ContainerEditorial>
    </Section>
  );
}

function WhatWeDoSection() {
  return (
    <Section size="md" bg="default">
      <ContainerEditorial width="wide">
        <h2 className="text-h2 font-display text-foreground mb-8">
          Built for every stage of a child&apos;s movement journey.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
          {WHAT_WE_DO_TILES.map((tile) => {
            const Icon = tile.icon;
            return (
              <Card key={tile.title} className="p-6 hover:shadow-md transition-shadow duration-200">
                <Icon
                  aria-hidden="true"
                  className="size-8 text-brand-navy mb-4"
                />
                <h3 className="text-h3 font-display text-foreground">{tile.title}</h3>
                <p className="text-body text-muted-foreground mt-2 line-clamp-3">
                  {tile.description}
                </p>
                <p className="text-small text-muted-foreground mt-3 italic">{tile.markets}</p>
              </Card>
            );
          })}
        </div>
      </ContainerEditorial>
    </Section>
  );
}

function TrustStripSection() {
  return (
    <Section size="md" bg="navy">
      <ContainerEditorial width="wide">
        <h2 className="text-h2 font-display text-white">The standard behind the brand.</h2>
        <p className="text-body-lg text-brand-cream mt-4 max-w-3xl">
          For over a decade, ProActiv Sports has been trusted by families, international schools,
          and clubs across Hong Kong and Singapore. Our approach combines world-class coaching,
          progressive programming, and a deep commitment to safety and child development.
        </p>
        {/* Partner logos — text-only chips (SVGs not yet provided; Phase 3 text fallback per UI-SPEC §3.5) */}
        <div className="mt-12">
          <p className="font-sans text-sm font-medium uppercase tracking-wide text-brand-cream/70">
            Trusted by leading international schools and partners
          </p>
          <ul className="mt-6 flex flex-wrap gap-3" aria-label="Partner organisations">
            {PARTNER_NAMES.map((name) => (
              <li
                key={name}
                className="rounded-lg border border-white/20 px-4 py-2 font-display text-base text-brand-cream"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
        <TestimonialCard
          variant="default"
          quote="Proactiv was the only sports centre we found to be inclusive of students with special needs, ensuring every child could participate. Our children and their families really enjoyed the event and the facilities."
          author="Manjula Gunawardena"
          authorRole="Manager &amp; Senior Teacher, KidsFirst"
          className="mt-12 mx-auto max-w-3xl"
        />
      </ContainerEditorial>
    </Section>
  );
}

function FAQSection() {
  return (
    <Section size="md" bg="default">
      <ContainerEditorial width="default">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-h2 font-display text-foreground mb-8">
            Frequently asked — about the brand
          </h2>
          <div className="flex flex-col gap-0">
            {FAQ_ITEMS.map((item) => (
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

function FinalCTASection() {
  return (
    <Section size="sm" bg="cream">
      <ContainerEditorial width="default">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-h1 font-display text-foreground">Ready when you are.</h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button asChild size="touch" variant="default">
              <a href={HK_URL}>Enter Hong Kong →</a>
            </Button>
            <Button asChild size="touch" variant="default">
              <a href={SG_URL}>Enter Singapore →</a>
            </Button>
          </div>
          <p className="mt-6 text-body text-muted-foreground">
            Not sure which is right for you? Email{" "}
            <a
              href="mailto:hello@proactivsports.com"
              className="font-semibold text-foreground underline underline-offset-2 hover:text-brand-red"
            >
              hello@proactivsports.com
            </a>{" "}
            and we&apos;ll help.
          </p>
        </div>
      </ContainerEditorial>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT — RSC. Returns fragment (layout provides <main id="main-content">).
// ─────────────────────────────────────────────────────────────────────────────
export default async function GatewayHomePage() {
  return (
    <>
      {/* Inline JSON-LD — T-03-06: content from hardcoded constants only, no user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <HeroSection />
      <StorySection />
      <MarketCardsSection />
      <WhatWeDoSection />
      <TrustStripSection />
      <LeadershipSection
        heading="Led by people who've built their lives around coaching."
        leaders={LEADERS}
      />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}

// Phase 3 / Plan 03-02 — Gateway homepage. Redesign wave 2 complete.
//
// Section composition: all 8 sections now live in components/root/.
// Inline JSON-LD: Organization + WebSite + FAQPage (FAQ answers MUST match visible copy verbatim).
// metadata: FULL openGraph object (Pitfall 2 — no shallow-merge with layout).
// Single <Image priority> = hero only (Pitfall 6).
// Cross-subdomain CTAs = absolute <a href={NEXT_PUBLIC_*_URL}> (Pitfall 7).

import type { Metadata } from "next";
import { HeroSection } from "@/components/root/hero-section";
import { StorySectionWithStats } from "@/components/root/story-stats-section";
import { MarketSplitSection } from "@/components/root/market-split-section";
import { ProgrammeListSection } from "@/components/root/programme-list-section";
import { TrustCinematicSection } from "@/components/root/trust-cinematic-section";
import { LeadershipSection } from "@/components/root/leadership-section";
import type { LeadershipCardProps } from "@/components/root/leadership-card";
import { FAQNumberedSection } from "@/components/root/faq-numbered-section";
import { FinalCTASection } from "@/components/root/final-cta-section";

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

      <HeroSection hkUrl={HK_URL} sgUrl={SG_URL} />
      <StorySectionWithStats stats={STATS} />
      <MarketSplitSection hkUrl={HK_URL} sgUrl={SG_URL} />
      <ProgrammeListSection />
      <TrustCinematicSection />
      <LeadershipSection
        heading="Led by people who've built their lives around coaching."
        leaders={LEADERS}
      />
      <FAQNumberedSection items={FAQ_ITEMS} />
      <FinalCTASection hkUrl={HK_URL} sgUrl={SG_URL} />
    </>
  );
}

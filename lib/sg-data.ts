// Phase 5 / Plan 05-01 — SG static data module.
// Shape MUST mirror Phase 6 Sanity schemas (coach, post, venue, faqItem) so Phase 6
// GROQ queries drop in without component edits. Do NOT add fields that won't exist in Sanity.
//
// Decisions referenced (05-CONTEXT.md):
//   D-01 Baloo 2 activates on app/sg/layout.tsx (same way as HK)
//   D-02 SGNav structure: Weekly Classes [dropdown] | Prodigy Camps [dropdown] | Katong Point | Coaches | FAQ | Book CTA
//   D-03 Weekly Classes dropdown — 3 zones
//   D-04 Prodigy Camps dropdown — 3 camp types
//   D-07 Photography HUMAN-ACTION gates — portrait + hero paths under /photography/
//   D-08 SGFooter single NAP (Katong Point) + WhatsApp + cross-market HK link
//   D-09 createSGOgImage — Prodigy-green (#0f9733) background
//   D-10 BookingForm passes market:"sg" + venue:"katong-point" (no selector needed)
//   D-11 IFS surfaced inline on /school-partnerships/ hub
//
// Copy sources (binding — do NOT paraphrase):
//   strategy.md §PART 5 (SG homepage wireframe + 13 sections)
//   strategy.md §PART 6C §1–§11 (verbatim SG copy)
//   strategy.md §PART 8.3 (NAP for Katong Point: 451 Joo Chiat Road, Level 3, Singapore 427664)
//   strategy.md §PART 12 Tier 2 (zone descriptions, camp types, IFS partnership)

import { VENUES } from "@/lib/venues";

/* ────────────────────────────────────────────────────────────
 * Interfaces
 * ──────────────────────────────────────────────────────────── */

export interface KatongPointVenueHours {
  days: readonly string[];
  opens: string;
  closes: string;
}

export interface KatongPointVenue {
  id: "katong-point";
  nameShort: string;       // "Katong Point"
  nameFull: string;        // "Prodigy @ Katong Point"
  addressStreet: string;   // "451 Joo Chiat Road, Level 3"
  addressLocality: string; // "Katong"
  addressRegion: string;   // "Singapore"
  addressCountry: "SG";
  postalCode: string;      // "427664"
  geo: { lat: number; lng: number };
  hours: KatongPointVenueHours[];
  phoneEnvVar: string;     // "NEXT_PUBLIC_WHATSAPP_SG"
  mapEmbedEnvVar: string;  // "NEXT_PUBLIC_MAP_EMBED_KATONG_POINT"
  heroImage: string;       // "/photography/sg-venue-katong-hero.webp"
  serviceArea: readonly string[];
  apparatus: readonly string[];
  sizeNote: string;        // "2,700 sq ft"
}

export interface SGCoach {
  name: string;
  role: string;
  bio: string;
  portrait: string;   // "/photography/coach-haikel-portrait.webp"
}

export interface SGBlogPost {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string; // ISO 8601 "2026-04-01"
  category: string;
  readTimeMinutes: number;
  heroImage: string;
}

export interface SGFAQItem {
  value: string;  // accordion item id — kebab-case
  question: string;
  answer: string;
  group: "about" | "venue" | "classes" | "camps" | "multiball" | "parties" | "schools";
}

export interface SGZone {
  slug: "movement" | "sports-multiball" | "climbing";
  href: `/weekly-classes/${string}/`;
  label: string;
  ageBand: string;
  tag?: string;            // "Singapore's only" differentiator badge (sports-multiball only)
  metaTitle: string;
  metaDescription: string;
  h1: string;
  whatTheyLearn: readonly string[];
  classStructure: string;
}

export interface SGCampType {
  slug: "themed" | "multi-activity" | "gymnastics";
  href: `/prodigy-camps/${string}/`;
  label: string;
  ageBand: string;
  tag?: string;            // theme tags e.g. "Ninja · Pokémon · Superhero · LEGO · STEAM"
  metaTitle: string;
  metaDescription: string;
  h1: string;
  highlights: readonly string[];
  description: string;
}

/* ────────────────────────────────────────────────────────────
 * KATONG_POINT (D-08 + strategy §PART 8.3)
 * ──────────────────────────────────────────────────────────── */

export const KATONG_POINT: KatongPointVenue = {
  id: "katong-point",
  // NAP sourced from lib/venues.ts (SEO-10 single source of truth)
  nameShort: VENUES.katongPoint.shortName,
  nameFull: VENUES.katongPoint.name,
  addressStreet: VENUES.katongPoint.address,
  addressLocality: VENUES.katongPoint.locality,
  addressRegion: VENUES.katongPoint.region,
  addressCountry: "SG",
  postalCode: VENUES.katongPoint.postalCode ?? "427664",
  // HUMAN-ACTION A5 — verify geo coordinates pre-Phase-7; provisional from strategy §PART 8
  geo: { lat: 1.3113, lng: 103.9011 },
  hours: [
    // HUMAN-ACTION A4 — confirm actual opening hours before public ship
    { days: ["Mo", "Tu", "We", "Th", "Fr"], opens: "09:00", closes: "19:00" },
    { days: ["Sa", "Su"], opens: "09:00", closes: "17:00" },
  ],
  phoneEnvVar: "NEXT_PUBLIC_WHATSAPP_SG",
  mapEmbedEnvVar: "NEXT_PUBLIC_MAP_EMBED_KATONG_POINT",
  // HUMAN-ACTION D-07 gate 1 — SG hero poster photo; drop real shot → pnpm photos:process
  heroImage: "/photography/sg-venue-katong-hero.webp",
  serviceArea: [
    "Katong",
    "Marine Parade",
    "East Coast",
    "Joo Chiat",
    "Kembangan",
    "Tanjong Katong",
  ],
  apparatus: [
    "MultiBall wall",
    "Climbing wall",
    "Movement floor",
    "Sports court",
  ],
  sizeNote: "2,700 sq ft",
};

/* ────────────────────────────────────────────────────────────
 * KATONG_POINT_NAP (D-08 — subset for SGFooter + schema)
 * NAP = Name / Address / Phone carrier subset (no geo, no env specifics)
 * ──────────────────────────────────────────────────────────── */

export const KATONG_POINT_NAP = {
  nameFull: KATONG_POINT.nameFull,
  addressStreet: KATONG_POINT.addressStreet,
  addressLocality: KATONG_POINT.addressLocality,
  addressRegion: KATONG_POINT.addressRegion,
  addressCountry: KATONG_POINT.addressCountry,
  postalCode: KATONG_POINT.postalCode,
} as const;

/* ────────────────────────────────────────────────────────────
 * KATONG_POINT_MAP_EMBED (Research Pattern 3 — env-var derived)
 * Falls back to PLACEHOLDER_KATONG_EMBED so VenueMap can render
 * its fallback state without crashing at build time.
 * ──────────────────────────────────────────────────────────── */

export const KATONG_POINT_MAP_EMBED =
  process.env.NEXT_PUBLIC_MAP_EMBED_KATONG_POINT ?? "PLACEHOLDER_KATONG_EMBED";

/* ────────────────────────────────────────────────────────────
 * SG_COACHES (D-07 gate 3 + strategy §PART 6C §8)
 *
 * Names, roles, and bios are verbatim from strategy PART 6C §8.
 * Portrait paths are HUMAN-ACTION D-07 gate 3 — files must exist
 * under public/photography/ before Phase 5 ships to production.
 * Pages render gracefully with a fallback avatar until real photos land.
 * ──────────────────────────────────────────────────────────── */

export const SG_COACHES: readonly SGCoach[] = [
  {
    name: "Haikel",
    role: "Head of Sports",
    // Verbatim from strategy §PART 6C §8 — "Mr. Muscle Man" + Diploma in Sports Coaching
    bio: '"Mr. Muscle Man." Diploma in Sports Coaching. Seven-plus years of experience. The cultural heart of the Prodigy coaching team.',
    // HUMAN-ACTION D-07 gate 3 — drop portrait → public/photography/ → pnpm photos:process
    portrait: "/photography/coach-haikel-portrait.webp",
  },
  {
    name: "Mark",
    role: "Sports Director",
    // Verbatim from strategy §PART 6C §8 — Born in Singapore, major sports events background
    bio: "Born in Singapore. Background in major sports events including the Standard Chartered Marathon, the SEA Games, and the WTA Finals. Leads programme design.",
    // HUMAN-ACTION D-07 gate 3
    portrait: "/photography/coach-mark-portrait.webp",
  },
  {
    name: "Coach King",
    role: "Senior Coach",
    // Verbatim from strategy §PART 6C §8 — NROC-registered basketball coach
    bio: 'NROC-registered basketball coach with a broader multi-sport coaching philosophy: "Never limit a sporting activity to its known drills."',
    // HUMAN-ACTION D-07 gate 3
    portrait: "/photography/coach-king-portrait.webp",
  },
];

/* ────────────────────────────────────────────────────────────
 * SG_FAQ_ITEMS — 10 entries verbatim from strategy §PART 6C §11.
 * Groups: about / venue / classes / camps / multiball / parties / schools
 * ──────────────────────────────────────────────────────────── */

export const SG_FAQ_ITEMS: readonly SGFAQItem[] = [
  // ── VENUE (2) ──────────────────────────────────────────────
  {
    value: "where-located",
    group: "venue",
    question: "Where is Prodigy located?",
    // Verbatim from strategy §PART 6C §11
    answer:
      "451 Joo Chiat Road, Level 3, Katong Point, Singapore 427664. Our 2,700 sq ft venue is fully indoor and air-conditioned.",
  },
  {
    value: "age-range",
    group: "venue",
    question: "What age range do you work with?",
    // Verbatim from strategy §PART 6C §11
    answer:
      "Weekly classes start from age 2. Prodigy Holiday Camps are designed for ages 4 to 12 (we make exceptions for three-year-olds who are toilet-trained).",
  },
  // ── CLASSES (1) ────────────────────────────────────────────
  {
    value: "sports-offered",
    group: "classes",
    question: "What sports do you offer?",
    // Verbatim from strategy §PART 6C §11
    answer:
      "Gymnastics, climbing, parkour, soccer, basketball, rugby, tennis, dodgeball, martial arts (karate, boxing, Muay Thai, capoeira), plus MultiBall interactive training.",
  },
  // ── MULTIBALL (1) ──────────────────────────────────────────
  {
    value: "what-is-multiball",
    group: "multiball",
    question: "What is the MultiBall wall?",
    // Verbatim from strategy §PART 6C §11
    answer:
      "An interactive training wall — the only one in Singapore — that uses projection and sensor technology to turn sports drills into reactive, game-like experiences.",
  },
  // ── CAMPS (2) ──────────────────────────────────────────────
  {
    value: "holiday-camps",
    group: "camps",
    question: "Do you run holiday camps?",
    // Verbatim from strategy §PART 6C §11
    answer:
      "Yes — every school holiday. Themed weekly camps (Ninja, Pokémon, Superhero, LEGO City, Outdoor Explorer, Multi-Sport, Gymnastics, STEAM). Full-day and AM/PM formats.",
  },
  {
    value: "bus-transport",
    group: "camps",
    question: "Do you offer bus transport?",
    // Verbatim from strategy §PART 6C §11
    answer:
      "Full-day camps at Prodigy: no shuttle. Full-day camps run in partnership with the International French School offer bus services through ComfortDelGro — ask us for details.",
  },
  // ── PARTIES (1) ────────────────────────────────────────────
  {
    value: "birthday-party",
    group: "parties",
    question: "Can I book a birthday party?",
    // Verbatim from strategy §PART 6C §11
    answer:
      "Yes — the easiest birthday you'll host. Fully planned, coach-hosted, venue exclusive use, Party Room with AV and lighting, and decorations sorted.",
  },
  // ── ABOUT (2) ──────────────────────────────────────────────
  {
    value: "free-trial",
    group: "about",
    question: "How does the free trial work?",
    // Verbatim from strategy §PART 6C §11
    answer:
      "Every new child is invited to a free 30-minute assessment — we learn what they can do, find the right class, and help you decide whether Prodigy is right for your family.",
  },
  {
    value: "coaches-qualified",
    group: "about",
    question: "Are your coaches qualified?",
    // Verbatim from strategy §PART 6C §11
    answer:
      "Yes. All coaches hold relevant qualifications and complete our internal ProActiv Sports training course. Our team is led by Head of Sports Haikel.",
  },
  // ── SCHOOLS (1) ────────────────────────────────────────────
  {
    value: "school-partnerships",
    group: "schools",
    question: "Do you work with schools?",
    // Verbatim from strategy §PART 6C §11
    answer:
      "Yes — we run programmes with several international schools including the International French School, plus sports days and enrichment programmes with schools like KidsFirst.",
  },
];

/* ────────────────────────────────────────────────────────────
 * SG_BLOG_POSTS_STUB (Claude's Discretion per CONTEXT — 1 stub
 * proves the responsive grid template; Phase 6 swaps for GROQ results.)
 * ──────────────────────────────────────────────────────────── */

export const SG_BLOG_POSTS_STUB: readonly SGBlogPost[] = [
  {
    title:
      "What makes MultiBall different — interactive sport for kids in Singapore",
    slug: "what-makes-multiball-different-interactive-sport-singapore",
    excerpt:
      "Prodigy @ Katong Point is home to Singapore's only MultiBall interactive wall. Here's how the technology works and why kids who struggle to focus in traditional drills thrive on the wall.",
    publishedAt: "2026-04-01",
    category: "Sport & Development",
    readTimeMinutes: 5,
    // HUMAN-ACTION D-07 — needs real Katong Point photography
    heroImage: "/photography/sg-venue-katong-hero.webp",
  },
];

/* ────────────────────────────────────────────────────────────
 * SG_ZONES (D-03 + strategy §PART 6C §4 + UI-SPEC §5.1)
 *
 * Slug authority (05-CONTEXT.md D-03 reconciliation):
 *   movement | sports-multiball | climbing
 * Hrefs formatted as /weekly-classes/{slug}/ (trailing slash per Next.js convention)
 * ──────────────────────────────────────────────────────────── */

export const SG_ZONES: readonly SGZone[] = [
  {
    slug: "movement",
    href: "/weekly-classes/movement/",
    label: "Movement Zone",
    ageBand: "Ages 2–5",
    metaTitle:
      "Movement Zone for Early Years (Ages 2–5) | Prodigy @ Katong Point, Singapore",
    metaDescription:
      "Early-years gymnastics and fundamental movement for children aged 2–5 at Prodigy @ Katong Point. Padded, parent-friendly, confidence-first. Free trial available.",
    h1: "Movement Zone — Ages 2–5 at Prodigy Singapore.",
    // Copy from strategy §PART 6C §4 Movement Zone
    whatTheyLearn: [
      "Fundamental movement patterns: rolling, jumping, balancing, and landing safely",
      "First experiences on padded apparatus in a parent-friendly environment",
      "Confidence and coordination for the pre-school years",
      "Early gymnastics shapes that feed into the Sports and Climbing zones",
    ],
    classStructure:
      "Parent-accompanied and transitional classes in small groups, led by a coach trained in early-years movement. Sessions blend warm-up, apparatus exploration, and a cool-down focused on balance and confidence.",
  },
  {
    slug: "sports-multiball",
    href: "/weekly-classes/sports-multiball/",
    label: "Sports + MultiBall",
    ageBand: "Ages 5–12",
    // Differentiator badge — only the sports-multiball zone carries this
    tag: "Singapore's only",
    metaTitle:
      "Sports + MultiBall Zone (Ages 5–12) | Singapore's Only MultiBall Wall | Prodigy",
    metaDescription:
      "Multi-sport weekly classes for children aged 5–12 at Prodigy @ Katong Point — football, basketball, rugby, martial arts, and Singapore's only MultiBall interactive wall.",
    h1: "Sports + MultiBall Zone — with Singapore's Only Wall.",
    // Copy from strategy §PART 6C §4 Sports Zone
    whatTheyLearn: [
      "Football, basketball, rugby, tennis, dodgeball, and martial arts fundamentals",
      "Interactive training on the MultiBall wall — the only one in Singapore",
      "Agility, reaction time, and multi-directional movement skills",
      "Sport-switching confidence: children discover what they love",
    ],
    classStructure:
      "60-minute weekly classes structured around skill rotation and the MultiBall wall. Groups are kept small so every child gets meaningful time on each zone. Coaches rotate drills to keep sessions fresh and sport-diverse.",
  },
  {
    slug: "climbing",
    href: "/weekly-classes/climbing/",
    label: "Climbing",
    ageBand: "All ages",
    metaTitle:
      "Climbing Zone for Kids — Rock & Boulder | Prodigy @ Katong Point, Singapore",
    metaDescription:
      "Kids' climbing classes for all ages at Prodigy @ Katong Point, Singapore. Rock climbing, bouldering, resilience-building, and problem-solving in a safe coached environment.",
    h1: "Climbing Zone — Rock + Boulder for All Ages.",
    // Copy from strategy §PART 6C §4 Climbing Zone
    whatTheyLearn: [
      "Fundamental climbing technique: footwork, body positioning, and route reading",
      "Bouldering problem-solving and spatial reasoning",
      "Upper-body strength and grip development in a safe, coached environment",
      "Resilience and confidence through progressive climbing challenges",
    ],
    classStructure:
      "Weekly sessions for all age groups, structured around progressive bouldering routes and coached technique. Routes are regularly reset to provide fresh challenges and maintain engagement term over term.",
  },
] as const;

/* ────────────────────────────────────────────────────────────
 * SG_CAMP_TYPES (D-04 + strategy §PART 6C §6 + UI-SPEC §5.1)
 *
 * Slug authority (05-CONTEXT.md D-04 reconciliation):
 *   themed | multi-activity | gymnastics
 * Hrefs formatted as /prodigy-camps/{slug}/ (trailing slash)
 * ──────────────────────────────────────────────────────────── */

export const SG_CAMP_TYPES: readonly SGCampType[] = [
  {
    slug: "themed",
    href: "/prodigy-camps/themed/",
    label: "Themed Camps",
    ageBand: "Ages 4–12",
    // UI-SPEC §5.1 dropdown copy verbatim
    tag: "Ninja · Pokémon · Superhero · LEGO · STEAM",
    metaTitle:
      "Themed Holiday Camps Singapore (Ages 4–12) | Ninja, Pokémon, Superhero & More | Prodigy",
    metaDescription:
      "Themed school holiday camps for children aged 4–12 at Prodigy @ Katong Point, Singapore. Ninja Warrior, Pokémon, Superhero, LEGO City, STEAM, and more. Book now.",
    h1: "Themed Prodigy Camps — Ninja, Pokémon, Superhero, LEGO & STEAM.",
    // Copy from strategy §PART 6C §6 themed camps
    highlights: [
      "Dri-fit Prodigy Camp T-shirt",
      "Indoor grip socks",
      "Camp certificate and weekly prizes",
      "Nutritious lunch on full-day camps",
      "Sport sessions woven into every theme",
    ],
    description:
      "Action-packed sport plus the most popular themes in kids' pop culture — Ninja Warrior, Pokémon, Superhero, LEGO City, Outdoor Explorer, and STEAM adventures. Every week has a different narrative, but the physical development and coached sport sessions are always the core.",
  },
  {
    slug: "multi-activity",
    href: "/prodigy-camps/multi-activity/",
    label: "Multi-Activity",
    ageBand: "Ages 4–12",
    metaTitle:
      "Multi-Activity Holiday Camps Singapore (Ages 4–12) | Prodigy @ Katong Point",
    metaDescription:
      "Multi-sport and multi-activity school holiday camps at Prodigy @ Katong Point. Climbing, gymnastics, soccer, basketball, and the MultiBall wall. Ages 4–12.",
    h1: "Multi-Activity Prodigy Camps — Sport Across Every Zone.",
    // Copy from strategy §PART 6C §6 multi-activity camps
    highlights: [
      "Rotation across all three zones: Movement, Sports + MultiBall, Climbing",
      "Football, basketball, rugby, tennis, dodgeball, martial arts",
      "Gymnastics fundamentals and parkour elements",
      "Dri-fit Prodigy Camp T-shirt and camp certificate",
    ],
    description:
      "The classic Prodigy camp experience — children rotate across the Movement Zone, Sports + MultiBall Zone, and Climbing Zone throughout the day. No single sport dominates; every child gets equal time on each zone. Ideal for children who love variety or families who want their child to explore before committing to a weekly class.",
  },
  {
    slug: "gymnastics",
    href: "/prodigy-camps/gymnastics/",
    label: "Gymnastics",
    ageBand: "Ages 4–12",
    metaTitle:
      "Gymnastics Holiday Camps Singapore (Ages 4–12) | Prodigy @ Katong Point",
    metaDescription:
      "Gymnastics-focused school holiday camps at Prodigy @ Katong Point, Singapore. Fundamentals through to intermediate skills, coached by ProActiv Sports team. Ages 4–12.",
    h1: "Gymnastics Prodigy Camps — Movement Foundation for Every Child.",
    // Copy from strategy §PART 6C §6 gymnastics camps
    highlights: [
      "Gymnastics fundamentals: rolls, cartwheels, handstands, and beam work",
      "Progressive skill challenges matched to age and ability",
      "Access to the Movement Zone and Climbing Zone alongside gymnastics sessions",
      "Coaching by ProActiv Sports' certified gymnastics coaches",
    ],
    description:
      "Gymnastics-focused days with structured skill progression. Children work through fundamentals — rolls, cartwheels, handstands, beam basics — and are grouped by age and ability. Sessions are paced so beginners build confidence while more experienced movers are genuinely challenged.",
  },
] as const;

/* ────────────────────────────────────────────────────────────
 * IFS_PARTNERSHIP_COPY (D-11 + strategy §PART 6C §3 + §PART 12 Tier 2 #18)
 *
 * Verbatim partnership paragraph for the /school-partnerships/ hub.
 * IFS is surfaced inline — no separate dynamic route (D-11 decision).
 * ──────────────────────────────────────────────────────────── */

// Verbatim from strategy §PART 6C §3 + §PART 6C §11 FAQ "Do you work with schools?"
export const IFS_PARTNERSHIP_COPY =
  "Trusted by international schools including the International French School. Term-time programmes, holiday camps with transport through ComfortDelGro, and sports days. We run programmes with several international schools including the International French School, plus sports days and enrichment programmes with schools like KidsFirst.";

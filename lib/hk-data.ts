// Phase 4 / Plan 04-01 — HK static data module.
// Phase 8 / Plan 08-03 — NAP fields (nameShort, nameFull, addressStreet, addressLocality,
// addressRegion) now reference VENUES constants from lib/venues.ts (SEO-10 NAP consistency).
// Shape MUST mirror Phase 6 Sanity schemas (coach, post, venue, faqItem) so Phase 6 GROQ queries
// drop in without component edits. Do NOT add fields that won't exist in Sanity.
//
// Decisions referenced (04-CONTEXT.md):
//   D-01 hero video env var (NEXT_PUBLIC_MUX_HK_HERO_PLAYBACK_ID — HUMAN-ACTION)
//   D-02 HKNav structure (Gymnastics + Locations dropdowns + sticky red CTA)
//   D-03 Gymnastics dropdown 8 items
//   D-04 Locations dropdown 2 items
//   D-07 Coaches page fully populated (HK_COACHES shape)
//   D-08 Combined HK team (no venue split) — venueTag optional field
//   D-09 Portrait HUMAN-ACTION gate — portrait paths under /photography/ must exist
//   D-10 Booking form venue pre-fill + server-side validation ∈ {wan-chai,cyberport,no-preference}
//
// Copy sources (binding — do NOT paraphrase):
//   strategy.md §PART 4 (HK wireframe)
//   strategy.md §PART 6B §1–§11 (verbatim HK copy)
//   strategy.md §PART 8.3 (NAP for Wan Chai + Cyberport)
//   strategy.md §PART 12 Tier 1 #1-#5 (gymnastics programme age bands)

import { VENUES } from "@/lib/venues";

/* ────────────────────────────────────────────────────────────
 * Interfaces
 * ──────────────────────────────────────────────────────────── */

export interface HKVenueHours {
  days: readonly string[];
  opens: string;
  closes: string;
}

export interface HKVenue {
  id: "wan-chai" | "cyberport";
  nameShort: string; // "Wan Chai"
  nameFull: string; // "ProGym Wan Chai"
  addressStreet: string; // verbatim from strategy §PART 4 / §PART 8.3
  addressLocality: string;
  addressRegion: string;
  addressCountry: "HK";
  geo: { lat: number; lng: number };
  hours: HKVenueHours[];
  phoneEnvVar: string; // "NEXT_PUBLIC_HK_PHONE"
  mapEmbedEnvVar: string; // "NEXT_PUBLIC_WAN_CHAI_MAP_EMBED"
  heroImage: string; // "/photography/hk-venue-wanchai-gymtots.webp"
  serviceArea: readonly string[]; // ["Wan Chai","Causeway Bay","Central","Mid-Levels"] per §PART 8
  apparatus: readonly string[]; // ["Bar","Beam","Floor","Vault"]
  openedNote?: string; // Cyberport only: "Opened August 2025"
  sizeNote?: string; // Cyberport only: "5,000 sq ft"
}

export interface HKCoach {
  name: string;
  role: string;
  bio: string;
  venueTag?: "wan-chai" | "cyberport" | "both";
  portrait: string; // "/photography/coach-monica-portrait.webp"
}

export interface HKBlogPost {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string; // ISO 8601 "2026-04-01"
  category: string;
  readTimeMinutes: number;
  heroImage: string;
}

export interface HKFAQItem {
  value: string; // accordion item id — kebab-case
  question: string;
  answer: string;
  group: "about" | "venues" | "gymnastics" | "camps" | "parties" | "pricing";
}

export interface HKGymnasticsProgramme {
  slug:
    | "toddlers"
    | "beginner"
    | "intermediate"
    | "advanced"
    | "competitive"
    | "rhythmic"
    | "adult"
    | "private";
  href: `/gymnastics/${string}/`; // static template literal
  label: string; // "Babies & Toddlers"
  ageBand: string; // "12mo – 3yr"
  metaTitle: string; // full <title> per UI-SPEC sub-page metadata
  metaDescription: string;
  h1: string; // on-page <h1> copy per strategy PART 12
  whatTheyLearn: readonly string[]; // 4-6 bullet points
  classStructure: string; // paragraph
  venuesOffered: readonly ("wan-chai" | "cyberport")[];
}

/* ────────────────────────────────────────────────────────────
 * HK_VENUES (D-02, D-04)
 * ──────────────────────────────────────────────────────────── */

export const HK_VENUES: readonly HKVenue[] = [
  {
    id: "wan-chai",
    // NAP sourced from lib/venues.ts (SEO-10 single source of truth)
    nameShort: VENUES.wanChai.shortName,
    nameFull: VENUES.wanChai.name,
    addressStreet: VENUES.wanChai.address,
    addressLocality: VENUES.wanChai.locality,
    addressRegion: VENUES.wanChai.region,
    addressCountry: "HK",
    geo: VENUES.wanChai.geo ?? { lat: 22.2772, lng: 114.173 },
    hours: [
      // HUMAN-ACTION: confirm hours — placeholder from strategy PART 9.4.
      { days: ["Mo", "Tu", "We", "Th", "Fr"], opens: "09:00", closes: "19:00" },
      { days: ["Sa", "Su"], opens: "09:00", closes: "17:00" },
    ],
    phoneEnvVar: "NEXT_PUBLIC_HK_PHONE",
    mapEmbedEnvVar: "NEXT_PUBLIC_WAN_CHAI_MAP_EMBED",
    heroImage: "/photography/hk-venue-wanchai-gymtots.webp",
    serviceArea: ["Wan Chai", "Causeway Bay", "Central", "Mid-Levels"],
    apparatus: ["Bar", "Beam", "Floor", "Vault"],
  },
  {
    id: "cyberport",
    // NAP sourced from lib/venues.ts (SEO-10 single source of truth)
    // HUMAN-ACTION (D-08): VENUES.cyberport.address is a holding value pending
    // client confirmation of the exact Cyberport unit/floor. Update lib/venues.ts
    // when confirmed — this file will pick up the change automatically.
    nameShort: VENUES.cyberport.shortName,
    nameFull: VENUES.cyberport.name,
    addressStreet: VENUES.cyberport.address,
    addressLocality: VENUES.cyberport.locality,
    addressRegion: VENUES.cyberport.region,
    addressCountry: "HK",
    geo: VENUES.cyberport.geo ?? { lat: 22.2618, lng: 114.1303 },
    hours: [
      // HUMAN-ACTION: confirm hours — placeholder from strategy PART 9.4.
      { days: ["Mo", "Tu", "We", "Th", "Fr"], opens: "09:00", closes: "19:00" },
      { days: ["Sa", "Su"], opens: "09:00", closes: "17:00" },
    ],
    phoneEnvVar: "NEXT_PUBLIC_HK_PHONE_CYBERPORT",
    mapEmbedEnvVar: "NEXT_PUBLIC_CYBERPORT_MAP_EMBED",
    heroImage: "/photography/hk-venue-cyberport.webp",
    serviceArea: ["Pokfulam", "Aberdeen", "Southside", "Repulse Bay"],
    apparatus: ["Bar", "Beam", "Floor", "Vault", "Sprung Floor"],
    openedNote: "Opened August 2025",
    sizeNote: "5,000 sq ft",
  },
];

/* ────────────────────────────────────────────────────────────
 * HK_COACHES (D-07, D-08, D-09)
 *
 * Monica is verbatim from strategy §PART 6B §6 ("Led by Monica, our
 * Director of Sports, with 19 years of children's gymnastics coaching
 * experience."). Additional coaches are HUMAN-ACTION placeholders —
 * Phase 4 execute will verify portrait files exist under public/photography/
 * and pause for Martin to confirm the name/role/bio text before public ship.
 * ──────────────────────────────────────────────────────────── */

export const HK_COACHES: readonly HKCoach[] = [
  {
    name: "Monica",
    role: "Director of Sports",
    bio: "Monica leads coaching across both Hong Kong venues with 19 years of children's gymnastics experience. Every coach on our team completes her internal ProActiv Sports training course — regardless of prior qualifications — so that whether your child trains at Wan Chai or Cyberport, the standard of care and progression is the same.",
    venueTag: "both",
    portrait: "/photography/coach-monica-portrait.webp",
  },
  {
    // HUMAN-ACTION: confirm name, role, bio copy before public ship.
    name: "Coach TBD (Wan Chai)",
    role: "Senior Gymnastics Coach",
    bio: "A certified gymnastics coach with a decade of experience teaching children from toddler fundamentals through to the competitive pathway. Specialist in beam and floor progressions for the 6–12 age band. Completed the ProActiv Sports internal training course.",
    venueTag: "wan-chai",
    portrait: "/photography/coach-wanchai-portrait.webp",
  },
  {
    // HUMAN-ACTION: confirm name, role, bio copy before public ship.
    name: "Coach TBD (Cyberport)",
    role: "Senior Gymnastics Coach",
    bio: "Leads day-to-day gymnastics at ProGym Cyberport since the venue opened in August 2025. Trained in artistic gymnastics with a focus on safe progression and confidence-building for beginners. Holds international coaching certifications alongside the ProActiv Sports internal training course.",
    venueTag: "cyberport",
    portrait: "/photography/coach-cyberport-portrait.webp",
  },
];

/* ────────────────────────────────────────────────────────────
 * HK_BLOG_POSTS_STUB (Claude's Discretion per CONTEXT — 2 stubs
 * prove the template shape; Phase 6 swaps these for GROQ results.)
 * ──────────────────────────────────────────────────────────── */

export const HK_BLOG_POSTS_STUB: readonly HKBlogPost[] = [
  {
    title: "What to expect from your child's first gymnastics class in Hong Kong",
    slug: "first-gymnastics-class-hong-kong",
    excerpt:
      "A short guide for Hong Kong parents bringing their child to ProGym for the first time — what to wear, what happens in the 30-minute free assessment, and how we decide which class level fits.",
    publishedAt: "2026-04-01",
    category: "Gymnastics Tips",
    readTimeMinutes: 5,
    heroImage: "/photography/programme-beginner.webp",
  },
  {
    title: "Choosing between Wan Chai and Cyberport: a parent's guide",
    slug: "choosing-wan-chai-vs-cyberport",
    excerpt:
      "Both venues run to the same coaching standard. The practical differences are about travel time, class size on your preferred day, and apparatus focus — here's how to choose.",
    publishedAt: "2026-04-15",
    category: "Venues",
    readTimeMinutes: 4,
    heroImage: "/photography/hk-venue-cyberport.webp",
  },
];

/* ────────────────────────────────────────────────────────────
 * HK_FAQ_ITEMS — 16 entries grouped by UI-SPEC §4 /faq/ map.
 * Questions + answers from strategy §PART 6B §11 where provided;
 * remaining entries derived from §PART 4 §7-§8 + §PART 8.
 * ──────────────────────────────────────────────────────────── */

export const HK_FAQ_ITEMS: readonly HKFAQItem[] = [
  // ── ABOUT (3) ────────────────────────────────────────────
  {
    value: "when-founded",
    group: "about",
    question: "When was ProActiv Sports founded?",
    answer:
      "ProActiv Sports was founded in Hong Kong in 2011 and has grown into one of the city's most trusted children's gymnastics and sports providers.",
  },
  {
    value: "what-ages",
    group: "about",
    question: "What ages do you teach in Hong Kong?",
    answer:
      "From 12 months (Babies & Toddlers parent-accompanied class) through 16, with adult gymnastics available.",
  },
  {
    value: "coaches-qualified",
    group: "about",
    question: "Are your coaches qualified?",
    answer:
      "Every coach holds relevant sports or gymnastics qualifications and completes our internal ProActiv Sports training course. Our team is led by Monica, our Director of Sports.",
  },
  // ── VENUES (3) ──────────────────────────────────────────
  {
    value: "where-venues",
    group: "venues",
    question: "Where are your Hong Kong venues?",
    answer:
      "ProGym Wan Chai at 15/F, The Hennessy, 256 Hennessy Road (entrance via Johnston Road). ProGym Cyberport at the Cyberport complex, 5,000 sq ft, opened August 2025.",
  },
  {
    value: "which-venue",
    group: "venues",
    question: "How do I choose between Wan Chai and Cyberport?",
    answer:
      "Both venues run to the same coaching standard. Wan Chai is MTR-connected and serves families living across Hong Kong Island North. Cyberport suits families in Pokfulam, Southside, and the Cyberport catchment with a purpose-built 5,000 sq ft facility opened in 2025.",
  },
  {
    value: "venue-apparatus",
    group: "venues",
    question: "What apparatus do you have?",
    answer:
      "Both venues are equipped with bar, beam, floor, and vault. ProGym Cyberport adds sprung floors and full competition-standard apparatus suitable for every level from beginner to competitive.",
  },
  // ── GYMNASTICS (4) ──────────────────────────────────────
  {
    value: "free-trial",
    group: "gymnastics",
    question: "How does the free trial work?",
    answer:
      "Every new child is invited to a free 30-minute assessment. It's how we make sure we place them in the right level and help you decide whether ProActiv is right for your family.",
  },
  {
    value: "competitive-pathway",
    group: "gymnastics",
    question: "Is there a competitive pathway?",
    answer:
      "Yes. Competitive Gymnastics starts from age 6 and leads into regional competition. Entry is by assessment.",
  },
  {
    value: "rhythmic-available",
    group: "gymnastics",
    question: "Do you teach rhythmic gymnastics?",
    answer:
      "Yes. Rhythmic gymnastics covers ribbon, hoop, and ball disciplines for ages 5 to 16, currently offered at ProGym Wan Chai.",
  },
  {
    value: "class-size",
    group: "gymnastics",
    question: "How big are your classes?",
    answer:
      "We run smaller coach-to-child ratios than most Hong Kong alternatives. Exact ratios vary by programme level, but every session is built around personal feedback for each child.",
  },
  // ── CAMPS (2) ───────────────────────────────────────────
  {
    value: "holiday-camps",
    group: "camps",
    question: "Do you offer holiday camps?",
    answer:
      "Yes — every school holiday. Easter, Summer, Autumn, Christmas, Chinese New Year. Half-day and full-day formats, gymnastics-focused and multi-activity options.",
  },
  {
    value: "camp-age-range",
    group: "camps",
    question: "What ages are the camps for?",
    answer:
      "Our holiday camps cover children from age 4 through 12, grouped by age and ability. Exact bands per camp are published with each seasonal programme.",
  },
  // ── PARTIES (2) ─────────────────────────────────────────
  {
    value: "birthday-party",
    group: "parties",
    question: "Can I book a birthday party?",
    answer:
      "Yes — two-hour exclusive-use parties at either venue. 90 minutes of coach-led gymnastics activities, plus 30 minutes of food and cake. Decorations and setup included.",
  },
  {
    value: "party-max-children",
    group: "parties",
    question: "How many children can come to a party?",
    answer:
      "Party capacity varies by venue and package. Get in touch and we'll walk you through the options for your age range and guest count.",
  },
  // ── PRICING (2) ─────────────────────────────────────────
  {
    value: "term-length",
    group: "pricing",
    question: "How are weekly classes priced?",
    answer:
      "Weekly classes are sold as a term block. We'll share the current term dates and the per-class equivalent when you enquire — pricing is kept simple and transparent with no joining fee.",
  },
  {
    value: "school-partnerships",
    group: "pricing",
    question: "Do you work with schools?",
    answer:
      "Yes. We run school gymnastics and sports programmes with a range of Hong Kong international schools. Contact us for partnership enquiries.",
  },
];

/* ────────────────────────────────────────────────────────────
 * HK_GYMNASTICS_PROGRAMMES (D-03) — 8 entries, one per Gymnastics
 * dropdown item. Copy from strategy §PART 12 Tier 1 #1-#5 + §PART 4 §4.
 * ──────────────────────────────────────────────────────────── */

export const HK_GYMNASTICS_PROGRAMMES: readonly HKGymnasticsProgramme[] = [
  {
    slug: "toddlers",
    href: "/gymnastics/toddlers/",
    label: "Babies & Toddlers",
    ageBand: "12mo – 3yr",
    metaTitle:
      "Toddler Gymnastics Hong Kong (12mo–3yr) | ProGym Wan Chai & Cyberport",
    metaDescription:
      "Parent-accompanied baby and toddler gymnastics in Hong Kong from 12 months. Structured fundamentals at ProGym Wan Chai and ProGym Cyberport. Free trial available.",
    h1: "Baby and toddler gymnastics in Hong Kong",
    whatTheyLearn: [
      "Parent-accompanied movement foundations from 12 months",
      "Safe first experiences on bar, beam, and soft floor apparatus",
      "Balance, coordination, and confident mobility for pre-school",
      "Early routines that build towards independent Beginner class",
    ],
    classStructure:
      "Parent-accompanied 45-minute sessions in small groups, led by a coach trained in early-years movement. Each session blends warm-up, apparatus exploration, and a cool-down focused on balance and confidence.",
    venuesOffered: ["wan-chai", "cyberport"],
  },
  {
    slug: "beginner",
    href: "/gymnastics/beginner/",
    label: "Beginner",
    ageBand: "4 – 6yr",
    metaTitle: "Beginner Gymnastics Hong Kong (4–6yr) | ProGym Wan Chai & Cyberport",
    metaDescription:
      "Beginner children's gymnastics classes in Hong Kong for ages 4–6. Structured progression at ProGym Wan Chai and ProGym Cyberport. Free 30-minute assessment.",
    h1: "Beginner gymnastics for ages 4 to 6",
    whatTheyLearn: [
      "Forward rolls, cartwheels, and the first handstand shapes",
      "Balance on the low beam and introductory vault progressions",
      "Working as a group and following a weekly class plan",
      "Building the core shapes that feed into Intermediate",
    ],
    classStructure:
      "Independent 50-minute classes in small groups. Every session has a learning objective, and every term parents receive a visible update on where their child is on the skill ladder.",
    venuesOffered: ["wan-chai", "cyberport"],
  },
  {
    slug: "intermediate",
    href: "/gymnastics/intermediate/",
    label: "Intermediate",
    ageBand: "6 – 9yr",
    metaTitle:
      "Intermediate Gymnastics Hong Kong (6–9yr) | ProGym Wan Chai & Cyberport",
    metaDescription:
      "Intermediate gymnastics classes in Hong Kong for ages 6–9. Core skills, apparatus progression, and weekly feedback at ProGym Wan Chai and ProGym Cyberport.",
    h1: "Intermediate gymnastics for ages 6 to 9",
    whatTheyLearn: [
      "Refined cartwheels, round-offs, and back-bend progressions",
      "Full beam routines and structured vault progressions",
      "Bar shapes towards the first pull-overs",
      "Confidence with teacher-led feedback in a group",
    ],
    classStructure:
      "60-minute classes run in ability-matched groups. Coaches track each child's skill ladder term-on-term so parents can see visible progress and what comes next.",
    venuesOffered: ["wan-chai", "cyberport"],
  },
  {
    slug: "advanced",
    href: "/gymnastics/advanced/",
    label: "Advanced",
    ageBand: "9 – 12yr",
    metaTitle: "Advanced Gymnastics Hong Kong (9–12yr) | ProGym Wan Chai & Cyberport",
    metaDescription:
      "Advanced children's gymnastics classes in Hong Kong for ages 9–12. Technical apparatus work at ProGym Wan Chai and ProGym Cyberport. Book a free trial.",
    h1: "Advanced gymnastics for ages 9 to 12",
    whatTheyLearn: [
      "Walk-overs, handsprings, and pre-tumbling progressions",
      "Beam sequences with jumps, turns, and acro shapes",
      "Bar drills towards kips and underswings",
      "Self-managed warm-ups and strength conditioning",
    ],
    classStructure:
      "60- to 75-minute classes that combine a coached technical block with conditioning. Groups are kept small so coaches can correct the details that matter at this level.",
    venuesOffered: ["wan-chai", "cyberport"],
  },
  {
    slug: "competitive",
    href: "/gymnastics/competitive/",
    label: "Competitive",
    ageBand: "6+",
    metaTitle:
      "Competitive Gymnastics Hong Kong (6+) | ProGym Wan Chai & Cyberport",
    metaDescription:
      "Competitive children's gymnastics squad in Hong Kong from age 6. Entry by assessment. Regional competition pathway at ProGym Wan Chai and ProGym Cyberport.",
    h1: "Competitive Gymnastics pathway",
    whatTheyLearn: [
      "Full artistic gymnastics programme across all apparatus",
      "Routine construction and competition presentation",
      "Strength, flexibility, and conditioning as a weekly habit",
      "Mental preparation for regional competition",
    ],
    classStructure:
      "Squad training multiple times per week for children aged 6 and above. Entry is by assessment, and athletes progress along a clear pathway into regional competition.",
    venuesOffered: ["wan-chai", "cyberport"],
  },
  {
    slug: "rhythmic",
    href: "/gymnastics/rhythmic/",
    label: "Rhythmic",
    ageBand: "5 – 16yr",
    metaTitle: "Rhythmic Gymnastics Hong Kong (5–16yr) | ProGym Wan Chai",
    metaDescription:
      "Rhythmic gymnastics for ages 5 to 16 in Hong Kong — ribbon, hoop, and ball disciplines. Structured artistic pathway at ProGym Wan Chai. Free trial available.",
    h1: "Rhythmic gymnastics — ribbon, hoop, and ball",
    whatTheyLearn: [
      "Ribbon technique and full-body coordination",
      "Hoop handling, rotations, and travelling shapes",
      "Ball routines blending grace and control",
      "Performance and artistic expression",
    ],
    classStructure:
      "Weekly 60-minute classes grouped by age and ability. Coaches draw on international rhythmic coaching certifications alongside the ProActiv Sports internal training course.",
    venuesOffered: ["wan-chai"],
  },
  {
    slug: "adult",
    href: "/gymnastics/adult/",
    label: "Adult",
    ageBand: "16+",
    metaTitle: "Adult Gymnastics Hong Kong (16+) | ProGym Wan Chai & Cyberport",
    metaDescription:
      "Adult gymnastics classes in Hong Kong for ages 16 and up. Strength, flexibility, and skill work at ProGym Wan Chai and ProGym Cyberport. No prior experience required.",
    h1: "Adult gymnastics — ages 16 and up",
    whatTheyLearn: [
      "Fundamentals for complete beginners — no prior experience required",
      "Strength, flexibility, and mobility progressions",
      "Beam, bar, and floor skills at your own pace",
      "A structured alternative to generic fitness",
    ],
    classStructure:
      "Small-group evening and weekend classes for adults. Coaches scale every drill to the individual, whether you are a complete beginner or returning to the gym after years away.",
    venuesOffered: ["wan-chai", "cyberport"],
  },
  {
    slug: "private",
    href: "/gymnastics/private/",
    label: "Private Coaching",
    ageBand: "All ages",
    metaTitle:
      "Private Gymnastics Coaching Hong Kong | ProGym Wan Chai & Cyberport",
    metaDescription:
      "One-to-one gymnastics coaching in Hong Kong for all ages at ProGym Wan Chai and ProGym Cyberport. Tailored progression, flexible scheduling. Enquire to book.",
    h1: "One-to-one private gymnastics coaching",
    whatTheyLearn: [
      "A programme built around your child's exact skill level",
      "Focused apparatus time with a named coach",
      "Flexible scheduling around school and family commitments",
      "Short-block intensives before assessments or competitions",
    ],
    classStructure:
      "Booked in blocks of one-to-one sessions with a named coach. Ideal for pre-assessment preparation, skill unblockers, or families who prefer a tailored programme over a group class.",
    venuesOffered: ["wan-chai", "cyberport"],
  },
];

/* ────────────────────────────────────────────────────────────
 * Env-var derived map-embed constants (D-04 + Research Pattern 3).
 * Fall back to PLACEHOLDER_* so the VenueMap component can render
 * its fallback surface without crashing at build time.
 * ──────────────────────────────────────────────────────────── */

export const WAN_CHAI_MAP_EMBED =
  process.env.NEXT_PUBLIC_WAN_CHAI_MAP_EMBED ?? "PLACEHOLDER_WAN_CHAI_EMBED";

export const CYBERPORT_MAP_EMBED =
  process.env.NEXT_PUBLIC_CYBERPORT_MAP_EMBED ?? "PLACEHOLDER_CYBERPORT_EMBED";

// Phase 5 / Plan 05-03 — SG homepage (SG-01) — Nexus design system redesign.
//
// Sections (8 core): Hero · Why Choose · Programmes · Testimonials · Location · High-Intent · FAQ · Final CTA
// Composes Phase 2 primitives + Phase 5-local components/sg/. Hero VideoPlayer is
// HUMAN-ACTION-gated on NEXT_PUBLIC_MUX_SG_HERO_PLAYBACK_ID (CONTEXT D-01).
//
// Nexus design tokens used inline:
//   Dark section:    bg-[#0f1117]
//   Light surface:   bg-[#f0f2f5]
//   White card:      bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)]
//   Coral accent:    #e84040
//   Teal accent:     #1ab8a0
//   Gold (stars):    #f59e0b
//   Coral eyebrow:   text-[#e84040] uppercase tracking-widest text-sm font-bold
//   Teal icon ring:  bg-[rgba(26,184,160,0.12)] text-[#1ab8a0] rounded-full p-3
//
// MultiBall differentiator Pattern 11 — preserved in hero trust line + Why Prodigy tile 1.

import type { Metadata } from "next";
import Image from "next/image";
import {
  Zap,
  Trophy,
  BadgeCheck,
  ArrowUpRight,
  ArrowRight,
  MessageCircle,
  Star,
} from "lucide-react";
import { SGHeroVideo } from "@/components/sg/sg-hero-video";
import { WhatsAppCTA } from "@/components/sg/whatsapp-cta";
import { FAQItem } from "@/components/ui/faq-item";
import { SG_FAQ_ITEMS, KATONG_POINT } from "@/lib/sg-data";

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
// SG-specific FAQ items (Nexus redesign content per brief). DOM order MUST equal
// JSON-LD order (Google FAQPage rich-result rule).
// ─────────────────────────────────────────────────────────────────────────────
const SG_HOMEPAGE_FAQS = [
  {
    value: "location",
    question: "Where is ProActiv Singapore located?",
    answer:
      "We are based in Katong, East Coast, Singapore — easily accessible from the East Side and City Centre.",
  },
  {
    value: "programmes",
    question: "What programmes do you offer in Singapore?",
    answer:
      "We offer gymnastics classes, multi-sport programmes, holiday camps, and birthday parties for children aged 2–14.",
  },
  {
    value: "trial",
    question: "Do you offer trial classes?",
    answer:
      "Yes! We offer complimentary trial sessions for new students. Contact us to book yours.",
  },
  {
    value: "ages",
    question: "What ages do you cater for?",
    answer:
      "Our programmes are designed for children aged 2–14. We have age-appropriate classes at every level.",
  },
  {
    value: "coaches",
    question: "Are coaches certified?",
    answer:
      "All our coaches hold internationally recognised coaching certifications and undergo regular CPD training.",
  },
  // Pull a couple of real SG_FAQ_ITEMS to round out the list if available
  ...SG_FAQ_ITEMS.filter((i) => i.group === "multiball" || i.group === "venue").slice(0, 3),
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Testimonials data — Nexus style dark cards (3 cards).
// ─────────────────────────────────────────────────────────────────────────────
const SG_TESTIMONIALS = [
  {
    quote:
      "Prodigy has been brilliant for our son — he's tried climbing, football, and the MultiBall wall all in one term. The coaches know him by name and he can't wait for Saturday classes.",
    author: "Rachel T.",
    location: "Parent, East Coast",
  },
  {
    quote:
      "The free trial sold us. Within 30 minutes the coach had pinpointed exactly where our daughter needed to be — and she's progressed faster than we ever expected.",
    author: "Wei Lin H.",
    location: "Parent, Marine Parade",
  },
  {
    quote:
      "Booked a birthday party here and the kids would not leave. MultiBall wall, coach-led games, party room sorted. The easiest birthday I've ever planned.",
    author: "Sarah M.",
    location: "Parent, Joo Chiat",
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD — @graph with SportsActivityLocation + WebSite + FAQPage per UI-SPEC §8.3.
// FAQPage.mainEntity questions/answers MUST match the rendered FAQItem props
// char-for-char (Google rich-result rule).
// ─────────────────────────────────────────────────────────────────────────────
const sgHomeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SportsActivityLocation",
      "@id": "https://sg.proactivsports.com/#localbusiness-katong",
      name: KATONG_POINT.nameFull,
      url: "https://sg.proactivsports.com/katong-point/",
      telephone: process.env.NEXT_PUBLIC_WHATSAPP_SG ?? "",
      parentOrganization: { "@id": "https://proactivsports.com/#organization" },
      address: {
        "@type": "PostalAddress",
        streetAddress: KATONG_POINT.addressStreet,
        addressLocality: KATONG_POINT.addressLocality,
        addressRegion: KATONG_POINT.addressRegion,
        postalCode: KATONG_POINT.postalCode,
        addressCountry: KATONG_POINT.addressCountry,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: KATONG_POINT.geo.lat,
        longitude: KATONG_POINT.geo.lng,
      },
    },
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
// §1 HERO — full-bleed Mux video; overlay + Nexus typography over the top.
// MultiBall trust line placement 1 of 3 (Pattern 11).
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#0f1117]">
      <SGHeroVideo
        playbackId={process.env.NEXT_PUBLIC_MUX_SG_HERO_PLAYBACK_ID ?? ""}
        posterSrc="/photography/hero-sg.jpg"
        posterAlt="Children playing at Prodigy @ Katong Point, Singapore's only MultiBall wall"
        title="Prodigy Singapore — Prodigy camp-day montage"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-12 py-24">
        <p className="text-[#1ab8a0] uppercase tracking-widest text-sm font-bold mb-4">
          Prodigy @ Katong Point
        </p>
        <h1 className="text-white max-w-3xl text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
          Where Singapore&apos;s kids come to move, play, and grow.
        </h1>
        <p className="text-white/80 max-w-xl mt-5 text-base md:text-lg">
          Three zones, three seasons of camps, and a coaching team that meets every child at exactly
          their level.
        </p>
        <p className="text-white/80 mt-3 flex items-center gap-2">
          <Zap size={18} className="text-[#f59e0b]" aria-hidden="true" />
          <span>
            <span className="text-[#1ab8a0] font-semibold">
              Singapore&apos;s only MultiBall wall
            </span>{" "}
            · Katong Point
          </span>
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a
            href="/book-a-trial/"
            className="inline-flex items-center justify-center gap-2 bg-[#1ab8a0] hover:bg-[#15a08b] text-white rounded-full px-6 py-3 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Book Free Trial <ArrowRight className="size-4" aria-hidden="true" />
          </a>
          <a
            href="/book-a-trial/?subject=general-enquiry"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/80 hover:bg-white/10 text-white rounded-full px-6 py-3 font-semibold transition-colors"
          >
            Send an Enquiry
          </a>
        </div>
        <p className="text-white/60 text-sm mt-5">
          Free trial · No obligation · Usually booked same week.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §2 WHY PRODIGY — Nexus surface, white cards with teal icon circles.
// Tile 1 = MultiBall flagship (Pattern 11 placement 2).
// ─────────────────────────────────────────────────────────────────────────────
function WhyProdigySection() {
  const tiles = [
    {
      icon: Zap,
      title: "The only MultiBall wall in Singapore",
      body: "Our MultiBall interactive wall turns every sports drill into a reactive, game-like experience. Children who struggle to focus in traditional drills thrive on the wall.",
      badge: "Singapore's only",
    },
    {
      icon: Trophy,
      title: "Multi-sport, not single-sport",
      body: "Gymnastics, climbing, parkour, football, basketball, rugby, tennis, dodgeball, and martial arts — all under one roof. Children discover what they love before they commit.",
    },
    {
      icon: BadgeCheck,
      title: "A single coaching standard",
      body: "Every coach completes the ProActiv Sports internal training course. Our team is led by Haikel, with seven-plus years of experience.",
    },
    {
      icon: ArrowUpRight,
      title: "Built for progression",
      body: "From first forward roll to competitive confidence — three dedicated zones, structured weekly classes, and holiday camps that build on each other term by term.",
    },
  ] as const;

  return (
    <section className="bg-[#f0f2f5] py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-12">
        <div className="max-w-2xl mb-12">
          <p className="text-[#e84040] uppercase tracking-widest text-sm font-bold mb-3">
            Why Prodigy
          </p>
          <h2 className="text-gray-900 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]">
            Why Singapore parents choose Prodigy.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiles.map((t) => (
            <div
              key={t.title}
              className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-6 lg:p-7 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 relative"
            >
              {"badge" in t && t.badge && (
                <span className="absolute top-4 right-4 bg-[#1ab8a0] text-white text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1">
                  {t.badge}
                </span>
              )}
              <div className="inline-flex bg-[rgba(26,184,160,0.12)] text-[#1ab8a0] rounded-full p-3 mb-5">
                <t.icon className="size-6" aria-hidden="true" />
              </div>
              <h3 className="text-gray-900 text-lg font-bold mb-2">{t.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3 PROGRAMMES — Nexus surface, white card grid with image top + teal link.
// ─────────────────────────────────────────────────────────────────────────────
const PROGRAMME_CARDS = [
  {
    title: "Sports Classes",
    ageRange: "Ages 2–14",
    href: "/weekly-classes/",
    imageSrc: "/photography/sports-classes.jpg",
    imageAlt: "Children in a weekly sports class at Prodigy Katong Point",
    description: "Movement, Sports + MultiBall, Climbing — three zones, every week of the term.",
  },
  {
    title: "Gymnastics",
    ageRange: "Ages 2–12",
    href: "/weekly-classes/movement/",
    imageSrc: "/photography/gymnastics.jpg",
    imageAlt: "Gymnastics class in action at Prodigy Singapore",
    description: "Foundations to flips — coach-led progressions on tumble track and beams.",
  },
  {
    title: "Holiday Camps",
    ageRange: "Ages 4–12",
    href: "/prodigy-camps/",
    imageSrc: "/photography/camps.jpg",
    imageAlt: "Children at a themed Prodigy holiday camp",
    description: "Themed and multi-activity every school holiday — full and half-day options.",
  },
  {
    title: "Birthday Parties",
    ageRange: "Ages 3–12",
    href: "/birthday-parties/",
    imageSrc: "/photography/parties.jpg",
    imageAlt: "Prodigy birthday party with coach-led activities",
    description: "Fully hosted, coach-led — the easiest birthday you'll plan.",
  },
] as const;

function ProgrammesSection() {
  return (
    <section className="bg-[#f0f2f5] py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-12">
        <div className="max-w-2xl mb-12">
          <p className="text-[#e84040] uppercase tracking-widest text-sm font-bold mb-3">
            Our Programmes
          </p>
          <h2 className="text-gray-900 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]">
            Programmes for every stage — toddler to tween.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROGRAMME_CARDS.map((p) => (
            <a
              key={p.title}
              href={p.href}
              className="group bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <Image
                  src={p.imageSrc}
                  alt={p.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
                  {p.ageRange}
                </p>
                <h3 className="text-gray-900 text-lg font-bold mb-2">{p.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">{p.description}</p>
                <span className="inline-flex items-center gap-1 text-[#1ab8a0] font-semibold text-sm mt-4 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="size-3.5" aria-hidden="true" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §4 TESTIMONIALS — Nexus dark section with 3 dark testimonial cards.
// ─────────────────────────────────────────────────────────────────────────────
function TestimonialsSection() {
  return (
    <section className="bg-[#0f1117] py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-12">
        <div className="max-w-2xl mb-12">
          <p className="text-[#e84040] uppercase tracking-widest text-sm font-bold mb-3">
            What Parents Say
          </p>
          <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]">
            Trusted by Singapore&apos;s families.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SG_TESTIMONIALS.map((t) => (
            <figure key={t.author} className="bg-[#1c2230] rounded-2xl p-7 lg:p-8 flex flex-col">
              <div className="flex gap-1 mb-4" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-[#f59e0b] text-[#f59e0b]"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="text-white/80 italic text-base leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-white/10">
                <div className="text-white font-bold">{t.author}</div>
                <div className="text-white/50 text-sm">{t.location}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §5 LOCATION / VENUE — Nexus default surface with photo + Katong Point copy.
// ─────────────────────────────────────────────────────────────────────────────
function LocationSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
            <Image
              src="/photography/hero-sg.jpg"
              alt="Prodigy @ Katong Point, Singapore — our home venue"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-[#e84040] uppercase tracking-widest text-sm font-bold mb-3">
              Visit Us
            </p>
            <h2 className="text-gray-900 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
              Prodigy @ Katong Point.
            </h2>
            <p className="text-gray-600 text-base lg:text-lg leading-relaxed mb-4">
              A 2,700 sq ft indoor facility purpose-built for children aged 2 to 12. Three zones, a
              qualified coaching team, and the only MultiBall interactive wall in Singapore.
            </p>
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              Easily accessible from the East Side and City Centre — drop-off parking and direct MRT
              connection.
            </p>
            <dl className="space-y-3 mb-8 text-sm">
              <div className="flex gap-3">
                <dt className="text-gray-500 w-20 shrink-0 font-semibold uppercase tracking-wider text-xs pt-0.5">
                  Address
                </dt>
                <dd className="text-gray-900">
                  {KATONG_POINT.addressStreet}, {KATONG_POINT.addressLocality}{" "}
                  {KATONG_POINT.postalCode}
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="text-gray-500 w-20 shrink-0 font-semibold uppercase tracking-wider text-xs pt-0.5">
                  Hours
                </dt>
                <dd className="text-gray-900">Mon–Fri 3–8pm · Sat–Sun 9am–6pm</dd>
              </div>
            </dl>
            <a
              href="/katong-point/"
              className="inline-flex items-center gap-1 text-[#1ab8a0] font-semibold hover:gap-2 transition-all"
            >
              Get directions <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §6 HIGH-INTENT CARDS — two large image cards w/ gradient overlay + CTAs.
// ─────────────────────────────────────────────────────────────────────────────
function HighIntentSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-12">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1 — Holiday Camps (coral) */}
          <a
            href="/prodigy-camps/"
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] block shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] transition-shadow"
          >
            <Image
              src="/photography/camps.jpg"
              alt="Prodigy holiday camps Singapore at Katong Point"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="absolute inset-0 flex items-end p-8 lg:p-10">
              <div className="max-w-md">
                <p className="text-white/90 text-xs font-bold tracking-widest uppercase mb-3">
                  Holiday Programmes
                </p>
                <h3 className="text-3xl lg:text-4xl font-extrabold text-white mb-3 tracking-tight">
                  Holiday Camps
                </h3>
                <p className="text-sm text-white/75 mb-5 leading-relaxed">
                  Themed and multi-activity camps every school holiday for ages 4–12.
                </p>
                <span className="inline-flex items-center gap-2 bg-[#e84040] hover:bg-[#d33636] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
                  View Camps <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </div>
            </div>
          </a>

          {/* Card 2 — Sports Classes (teal) */}
          <a
            href="/weekly-classes/"
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] block shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] transition-shadow"
          >
            <Image
              src="/photography/sports-classes.jpg"
              alt="Prodigy multi-sport classes Singapore at Katong Point"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="absolute inset-0 flex items-end p-8 lg:p-10">
              <div className="max-w-md">
                <p className="text-white/90 text-xs font-bold tracking-widest uppercase mb-3">
                  Multi-Sport
                </p>
                <h3 className="text-3xl lg:text-4xl font-extrabold text-white mb-3 tracking-tight">
                  Sports Classes
                </h3>
                <p className="text-sm text-white/75 mb-5 leading-relaxed">
                  Three zones, every week of the term — gymnastics, climbing, and the MultiBall
                  wall.
                </p>
                <span className="inline-flex items-center gap-2 bg-[#1ab8a0] hover:bg-[#15a08b] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
                  Explore Classes <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §7 FAQ — Nexus light surface, white bordered accordion items.
// DOM order MUST match JSON-LD FAQPage.mainEntity order (Google FAQPage rule).
// ─────────────────────────────────────────────────────────────────────────────
function FAQSection() {
  return (
    <section className="bg-[#f0f2f5] py-20 lg:py-28">
      <div className="mx-auto w-full max-w-3xl px-6 md:px-10 lg:px-12">
        <div className="text-center mb-12">
          <p className="text-[#e84040] uppercase tracking-widest text-sm font-bold mb-3">
            Common Questions
          </p>
          <h2 className="text-gray-900 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]">
            Frequently asked questions.
          </h2>
        </div>
        <div className="space-y-3">
          {SG_HOMEPAGE_FAQS.map((item) => (
            <div
              key={item.value}
              className="bg-white border border-black/[0.06] rounded-xl px-2 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
            >
              <FAQItem id={item.value} question={item.question} answer={item.answer} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §8 FINAL CTA — Nexus dark section. White heading, coral primary, teal outline.
// WhatsApp conditional on NEXT_PUBLIC_WHATSAPP_SG (CONTEXT D-08).
// ─────────────────────────────────────────────────────────────────────────────
function FinalCTASection() {
  const whatsappSg = process.env.NEXT_PUBLIC_WHATSAPP_SG;
  const sanitisedWhatsapp = whatsappSg?.replace(/[^0-9+]/g, "") ?? "";
  return (
    <section className="bg-[#0f1117] py-24 lg:py-32">
      <div className="mx-auto w-full max-w-3xl px-6 md:px-10 lg:px-12 text-center">
        <p className="text-[#e84040] uppercase tracking-widest text-sm font-bold mb-4">
          Ready to start?
        </p>
        <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] mb-5">
          Try a free trial at Prodigy.
        </h2>
        <p className="text-white/70 text-base lg:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
          Free 30-minute assessment, no commitment. Come and see the MultiBall wall, meet the
          coaches, and find the right class for your child.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/book-a-trial/"
            className="inline-flex items-center justify-center gap-2 bg-[#e84040] hover:bg-[#d33636] text-white rounded-full px-6 py-3 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Book Free Trial <ArrowRight className="size-4" aria-hidden="true" />
          </a>
          {whatsappSg && (
            <WhatsAppCTA
              phone={sanitisedWhatsapp}
              message="Hi Prodigy SG, I'd like to book a free trial."
              className="inline-flex items-center justify-center gap-2 border-2 border-[#1ab8a0] text-[#1ab8a0] hover:bg-[#1ab8a0] hover:text-white rounded-full px-6 py-3 font-semibold transition-colors"
            >
              Chat on WhatsApp <MessageCircle className="size-4" aria-hidden="true" />
            </WhatsAppCTA>
          )}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT — RSC. Returns fragment (layout provides <main id="main-content">).
// Renders 8 Nexus sections + inline JSON-LD script.
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
      <WhyProdigySection />
      <ProgrammesSection />
      <TestimonialsSection />
      <LocationSection />
      <HighIntentSection />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}

// Phase 4 / Plan 04-03 — HK homepage (HK-01).
// Nexus design system redesign. All sections re-skinned to use:
//   - Dark sections: bg-[#0f1117]
//   - Light surface: bg-[#f0f2f5]
//   - White cards: bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)]
//   - Coral accent #e84040 for CTAs + section eyebrows
//   - Teal accent #1ab8a0 for "Learn more" links + icon backgrounds
//   - Gold #f59e0b for star ratings
//   - Plus Jakarta Sans typography via --font-plus-jakarta
//
// Preserves all routes, JSON-LD schema, data constants, and HUMAN-ACTION-gated
// photo paths (now mapped to available hi-res /photography/*.jpg sources).
//
// Component-contract deviations (Rule 3) preserved:
//   1. ProgrammeTile props: {title, ageRange, description, imageSrc, imageAlt, href, duration?}
//   2. VideoPlayer is wrapped in <HKHeroVideo> client component (next/dynamic ssr:false bug).
//   3. TestimonialCard props: {quote, author, authorRole}
//   4. FAQItem self-wraps Accordion — div-stack them.

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
  Star,
} from "lucide-react";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VenueChipRow } from "@/components/hk/venue-chip-row";
import { HKHeroVideo } from "@/components/hk/hk-hero-video";
import { WhatsAppCTA } from "@/components/hk/whatsapp-cta";
import { HK_VENUES, HK_FAQ_ITEMS, HK_BLOG_POSTS_STUB } from "@/lib/hk-data";
import { VENUES } from "@/lib/venues";

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
// Homepage FAQ subset — 8 items from HK_FAQ_ITEMS.
// Visible DOM order MUST equal JSON-LD order (Google FAQPage rich-result rule).
// ─────────────────────────────────────────────────────────────────────────────
const HK_HOMEPAGE_FAQS = HK_FAQ_ITEMS.filter(
  (i) => i.group === "about" || i.group === "gymnastics" || i.group === "venues",
).slice(0, 8);

// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD — @graph with WebSite + FAQPage.
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
      "@type": "SportsActivityLocation",
      "@id": "https://hk.proactivsports.com/#localbusiness-wan-chai",
      name: VENUES.wanChai.name,
      url: "https://hk.proactivsports.com/wan-chai/",
      parentOrganization: { "@id": "https://proactivsports.com/#organization" },
      address: {
        "@type": "PostalAddress",
        streetAddress: VENUES.wanChai.address,
        addressLocality: VENUES.wanChai.locality,
        addressRegion: VENUES.wanChai.region,
        addressCountry: VENUES.wanChai.country,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: VENUES.wanChai.geo?.lat ?? 22.2772,
        longitude: VENUES.wanChai.geo?.lng ?? 114.173,
      },
    },
    {
      "@type": "SportsActivityLocation",
      "@id": "https://hk.proactivsports.com/#localbusiness-cyberport",
      name: VENUES.cyberport.name,
      url: "https://hk.proactivsports.com/cyberport/",
      parentOrganization: { "@id": "https://proactivsports.com/#organization" },
      address: {
        "@type": "PostalAddress",
        streetAddress: VENUES.cyberport.address,
        addressLocality: VENUES.cyberport.locality,
        addressRegion: VENUES.cyberport.region,
        addressCountry: VENUES.cyberport.country,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: VENUES.cyberport.geo?.lat ?? 22.2618,
        longitude: VENUES.cyberport.geo?.lng ?? 114.1303,
      },
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
// §3.1 HERO — Mux video + dark overlay, Nexus button pair.
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#0f1117]">
      <HKHeroVideo
        playbackId={process.env.NEXT_PUBLIC_MUX_HK_HERO_PLAYBACK_ID ?? ""}
        posterSrc="/photography/hero-hk.jpg"
        posterAlt="Children practising gymnastics at ProGym Wan Chai, Hong Kong"
        title="ProGym Hong Kong — hero montage"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20"
        aria-hidden="true"
      />
      <div className="relative z-10 w-full">
        <ContainerEditorial width="wide" className="py-24 lg:py-32">
          <p className="text-[#e84040] uppercase tracking-widest text-sm font-bold mb-4">
            ProActiv Sports · Hong Kong
          </p>
          <h1 className="font-sans text-white max-w-3xl text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
            Premium gymnastics and sports for children in Hong Kong.
          </h1>
          <p className="text-white/80 max-w-xl mt-6 text-base md:text-lg leading-relaxed">
            Since 2011 — two dedicated venues in Wan Chai and Cyberport, coaches who complete our
            training course regardless of prior certification, and a progression pathway from first
            forward roll to competitive squad.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              size="touch"
              className="bg-[#e84040] hover:bg-[#d23535] text-white rounded-full px-6 py-3 font-semibold shadow-lg shadow-[#e84040]/20 focus-visible:ring-2 focus-visible:ring-white"
            >
              <a href="/book-a-trial/free-assessment/">
                Book a Free Trial <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </a>
            </Button>
            <Button
              asChild
              size="touch"
              className="bg-[#1ab8a0] hover:bg-[#16a08c] text-white rounded-full px-6 py-3 font-semibold shadow-lg shadow-[#1ab8a0]/20"
            >
              <Link href="/contact?market=hk">Send an Enquiry</Link>
            </Button>
          </div>
          <p className="text-white/60 mt-5 text-sm">
            Free trial · No obligation · Usually booked same week.
          </p>
        </ContainerEditorial>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.1b TRUST STRIP — light surface, stat tiles.
// ─────────────────────────────────────────────────────────────────────────────
const TRUST_STATS = [
  { value: "2011", label: "Founded in Hong Kong" },
  { value: "2", label: "ProGym locations" },
  { value: "8", label: "Gymnastics levels" },
  { value: "12+", label: "Years coaching children" },
] as const;

function TrustStripSection() {
  return (
    <section className="bg-white py-12 lg:py-16 border-b border-black/[0.06]">
      <ContainerEditorial width="wide">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-sans font-extrabold text-3xl md:text-4xl text-[#0f206c] tracking-tight">
                {s.value}
              </div>
              <div className="mt-2 text-sm text-gray-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </ContainerEditorial>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.2 VENUE CHIP ROW.
// ─────────────────────────────────────────────────────────────────────────────
function VenueChipSection() {
  return (
    <section className="bg-white py-10">
      <ContainerEditorial width="wide">
        <VenueChipRow />
      </ContainerEditorial>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.3 WHY CHOOSE US — Nexus light surface, teal icon circles, white cards.
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
    <section className="bg-[#f0f2f5] py-20 lg:py-24">
      <ContainerEditorial width="wide">
        <p className="text-[#e84040] uppercase tracking-widest text-sm font-bold mb-3">
          Why Choose Us
        </p>
        <h2 className="font-sans text-[#0f206c] mb-12 text-3xl md:text-5xl font-extrabold tracking-tight max-w-3xl">
          Why Hong Kong parents choose ProActiv.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_CHOOSE_TILES.map(({ icon: Icon, h3, body }) => (
            <div
              key={h3}
              className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            >
              <div className="inline-flex items-center justify-center bg-[rgba(26,184,160,0.12)] text-[#1ab8a0] rounded-full p-3 mb-5">
                <Icon className="size-6" aria-hidden="true" />
              </div>
              <h3 className="font-sans text-[#0f206c] text-lg font-bold tracking-tight">{h3}</h3>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </ContainerEditorial>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.4 PROGRAMMES — Nexus light surface, white cards with image-top + teal CTA.
// ─────────────────────────────────────────────────────────────────────────────
const PROGRAMME_TILES = [
  {
    title: "Gymnastics",
    ageRange: "2–16yr",
    href: "/gymnastics/",
    imageSrc: "/photography/gymnastics.jpg",
    imageAlt: "Beginner gymnastics class at ProGym",
    description: "8 levels, parent-tot to competitive — a clear progression for every child.",
  },
  {
    title: "Holiday Camps",
    ageRange: "3–12yr",
    href: "/holiday-camps/",
    imageSrc: "/photography/camps.jpg",
    imageAlt: "Children at a ProGym holiday camp",
    description: "Easter, summer, and Christmas full-day and half-day formats.",
  },
  {
    title: "Birthday Parties",
    ageRange: "3–12yr",
    href: "/birthday-parties/",
    imageSrc: "/photography/parties.jpg",
    imageAlt: "ProGym birthday party setup",
    description: "Hosted, coach-led, two hours — bring the cake, we bring the apparatus.",
  },
  {
    title: "Sports Classes",
    ageRange: "K–Y13",
    href: "/school-partnerships/",
    imageSrc: "/photography/sports-classes.jpg",
    imageAlt: "Inter-school sports event",
    description: "Curriculum support and inter-school events with partner schools.",
  },
] as const;

function ProgrammesSection() {
  return (
    <section className="bg-[#f0f2f5] py-20 lg:py-24 border-t border-black/[0.04]">
      <ContainerEditorial width="wide">
        <p className="text-[#e84040] uppercase tracking-widest text-sm font-bold mb-3">
          Our Programmes
        </p>
        <h2 className="font-sans text-[#0f206c] mb-12 text-3xl md:text-5xl font-extrabold tracking-tight max-w-3xl">
          Programmes for every stage — toddler to competitive.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROGRAMME_TILES.map((p) => (
            <article
              key={p.title}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={p.imageSrc}
                  alt={p.imageAlt}
                  fill
                  sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center text-xs font-semibold text-[#1ab8a0] bg-[rgba(26,184,160,0.12)] rounded-full px-2.5 py-0.5">
                    {p.ageRange}
                  </span>
                </div>
                <h3 className="font-sans text-[#0f206c] text-xl font-bold tracking-tight">
                  {p.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2 leading-relaxed flex-1">{p.description}</p>
                <Link
                  href={p.href}
                  className="inline-flex items-center gap-1 mt-4 text-[#1ab8a0] hover:text-[#0f9a82] font-semibold text-sm transition-colors"
                >
                  Learn more <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </ContainerEditorial>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.5 LOCATION SPLIT — white cards on white section.
// ─────────────────────────────────────────────────────────────────────────────
function LocationSplitSection() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <ContainerEditorial width="wide">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-[#e84040] uppercase tracking-widest text-sm font-bold mb-3">
            Our Locations
          </p>
          <h2 className="font-sans text-[#0f206c] text-3xl md:text-5xl font-extrabold tracking-tight">
            Two ProGym venues across Hong Kong.
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {HK_VENUES.map((v, idx) => (
            <div
              key={v.id}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={v.heroImage || "/photography/hero-hk.jpg"}
                  alt={`${v.nameFull} interior`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority={idx === 0}
                />
              </div>
              <div className="p-6 lg:p-8">
                <h3 className="font-sans text-[#0f206c] text-2xl font-bold tracking-tight">
                  <span className="text-[#e84040]">ProGym</span> {v.nameShort}
                </h3>
                <p className="text-gray-600 mt-2 text-sm flex items-center gap-1.5">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {v.addressStreet}
                </p>
                {v.sizeNote && (
                  <p className="text-gray-500 text-sm mt-1">
                    {v.sizeNote} · {v.openedNote}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  {v.apparatus.map((a) => (
                    <Badge
                      key={a}
                      variant="secondary"
                      className="bg-[rgba(26,184,160,0.12)] text-[#1ab8a0] border-0 font-medium"
                    >
                      {a}
                    </Badge>
                  ))}
                </div>
                <Link
                  href={`/${v.id}/`}
                  className="inline-flex items-center gap-1 mt-6 text-[#1ab8a0] hover:text-[#0f9a82] font-semibold text-sm transition-colors"
                >
                  See {v.nameShort} venue <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </ContainerEditorial>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.6 SOCIAL PROOF — dark Nexus section, gold-star testimonial cards.
// ─────────────────────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote:
      "My daughter has been with ProGym for three years. The progression from her first forward roll to her current beam routine has been transformative.",
    author: "Sarah W.",
    location: "Parent, Wan Chai",
  },
  {
    quote:
      "The coaches genuinely care about each child. After every class, our son comes home buzzing — and we've watched his confidence grow week by week.",
    author: "James L.",
    location: "Parent, Cyberport",
  },
  {
    quote:
      "Two ProGym birthdays in a row, both completely stress-free for us. The team handles everything — and the kids talk about it for weeks.",
    author: "Priya N.",
    location: "Parent, Mid-Levels",
  },
] as const;

function SocialProofSection() {
  return (
    <section className="bg-[#0f1117] py-20 lg:py-24">
      <ContainerEditorial width="wide">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-[#e84040] uppercase tracking-widest text-sm font-bold mb-3">
            What Parents Say
          </p>
          <h2 className="font-sans text-white text-3xl md:text-5xl font-extrabold tracking-tight">
            Trusted by Hong Kong&apos;s families.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.author}
              className="bg-[#1c2230] rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-[#222a3a]"
            >
              <div className="flex gap-0.5 mb-4" aria-label="Five out of five stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 text-[#f59e0b] fill-[#f59e0b]"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="text-white/80 italic text-base leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5">
                <div className="font-sans font-bold text-white text-sm">{t.author}</div>
                <div className="text-white/50 text-xs mt-0.5">{t.location}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </ContainerEditorial>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.7 COACHING METHOD — white section, teal icon-circle pillars, coach portrait.
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
    <section className="bg-white py-20 lg:py-24">
      <ContainerEditorial width="wide">
        <div className="max-w-3xl mb-12">
          <p className="text-[#e84040] uppercase tracking-widest text-sm font-bold mb-3">
            Our Method
          </p>
          <h2 className="font-sans text-[#0f206c] text-3xl md:text-5xl font-extrabold tracking-tight">
            How we coach.
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            {COACHING_PILLARS.map((p) => (
              <div
                key={p.h3}
                className="bg-[#f0f2f5] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
              >
                <div className="inline-flex items-center justify-center bg-[rgba(26,184,160,0.12)] text-[#1ab8a0] rounded-full size-10 mb-4 font-bold">
                  {p.h3.charAt(0)}
                </div>
                <h3 className="font-sans text-[#0f206c] text-lg font-bold tracking-tight">
                  {p.h3}
                </h3>
                <p className="text-gray-600 mt-2 text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
          <div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
              <Image
                src="/photography/gymnastics.jpg"
                alt="Monica, Director of Sports Hong Kong, coaching at ProGym"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <p className="text-gray-600 mt-4 text-sm leading-relaxed">
              Led by Monica, Director of Sports Hong Kong — 19 years coaching, Level 2 Italian
              certification.
            </p>
          </div>
        </div>
      </ContainerEditorial>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.8 HIGH-INTENT CARDS — Camps + Parties, full-bleed image with gradient overlay.
// ─────────────────────────────────────────────────────────────────────────────
function HighIntentSection() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <ContainerEditorial width="wide">
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/holiday-camps/"
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] block shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)]"
          >
            <Image
              src="/photography/camps.jpg"
              alt="ProGym holiday camps Hong Kong"
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
              aria-hidden="true"
            />
            <div className="absolute inset-0 flex items-end p-8">
              <div>
                <p className="text-white/70 uppercase tracking-widest text-xs font-bold mb-2">
                  Holiday Programmes
                </p>
                <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight leading-tight">
                  Summer Camps
                </h3>
                <p className="text-sm text-white/80 mb-5 max-w-md leading-relaxed">
                  Full-day and half-day options during Easter, summer, and Christmas.
                </p>
                <span className="inline-flex items-center gap-2 bg-[#e84040] hover:bg-[#d23535] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
                  View Camps <ArrowRight className="size-4" />
                </span>
              </div>
            </div>
          </Link>
          <Link
            href="/birthday-parties/"
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] block shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)]"
          >
            <Image
              src="/photography/parties.jpg"
              alt="ProGym birthday parties Hong Kong"
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
              aria-hidden="true"
            />
            <div className="absolute inset-0 flex items-end p-8">
              <div>
                <p className="text-white/70 uppercase tracking-widest text-xs font-bold mb-2">
                  Celebrate
                </p>
                <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight leading-tight">
                  Birthday Parties
                </h3>
                <p className="text-sm text-white/80 mb-5 max-w-md leading-relaxed">
                  Two hours, coach-led, apparatus stations. Zero stress for parents.
                </p>
                <span className="inline-flex items-center gap-2 bg-[#e84040] hover:bg-[#d23535] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
                  Plan a Party <ArrowRight className="size-4" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </ContainerEditorial>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.9 ABOUT SNAPSHOT — light surface, 2-col prose + photo.
// ─────────────────────────────────────────────────────────────────────────────
function AboutSnapshotSection() {
  return (
    <section className="bg-[#f0f2f5] py-20 lg:py-24">
      <ContainerEditorial width="wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#e84040] uppercase tracking-widest text-sm font-bold mb-3">
              About Us
            </p>
            <h2 className="font-sans text-[#0f206c] mb-6 text-3xl md:text-5xl font-extrabold tracking-tight">
              About <span className="text-[#e84040]">ProGym</span> Hong Kong.
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              We&apos;ve been building children&apos;s gymnastics in Hong Kong since 2011. Two
              purpose-built venues — Wan Chai and Cyberport — and a coaching method that treats
              every child as a long-term progression project, not a class number.
            </p>
            <p className="text-gray-600 mt-4 text-base leading-relaxed">
              Our path is simple: a free trial, a coach who notices your child by name, and a
              programme that meets them at exactly their level. The first forward roll is just the
              beginning.
            </p>
            <Link
              href="/about/"
              className="inline-flex items-center gap-1 mt-6 text-[#1ab8a0] hover:text-[#0f9a82] font-semibold text-sm transition-colors"
            >
              Learn more about us <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
            <Image
              src="/photography/hero-hk.jpg"
              alt="ProGym coach working with a child on the beam"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </ContainerEditorial>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.10 BLOG — white cards on white section.
// ─────────────────────────────────────────────────────────────────────────────
function BlogSection() {
  const posts = HK_BLOG_POSTS_STUB.slice(0, 3);
  if (posts.length === 0) {
    return (
      <section className="bg-white py-20 lg:py-24">
        <ContainerEditorial width="default">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[#e84040] uppercase tracking-widest text-sm font-bold mb-3">
              From the Blog
            </p>
            <h2 className="font-sans text-[#0f206c] mb-4 text-3xl md:text-4xl font-extrabold tracking-tight">
              New posts coming soon.
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              We&apos;re preparing long-form guides on gymnastics progression, holiday camp
              planning, and what to expect at your first class. In the meantime, our coaches are
              happy to answer any question directly.
            </p>
          </div>
        </ContainerEditorial>
      </section>
    );
  }
  return (
    <section className="bg-white py-20 lg:py-24">
      <ContainerEditorial width="wide">
        <div className="max-w-3xl mb-12">
          <p className="text-[#e84040] uppercase tracking-widest text-sm font-bold mb-3">
            From the Blog
          </p>
          <h2 className="font-sans text-[#0f206c] text-3xl md:text-5xl font-extrabold tracking-tight">
            Latest from our coaches.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <article
              key={p.slug}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={p.heroImage}
                  alt={p.title}
                  fill
                  sizes="(max-width:1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <span className="inline-flex items-center text-xs font-semibold text-[#1ab8a0] bg-[rgba(26,184,160,0.12)] rounded-full px-2.5 py-0.5 self-start">
                  {p.category}
                </span>
                <h3 className="font-sans text-[#0f206c] mt-3 text-lg font-bold tracking-tight">
                  {p.title}
                </h3>
                <p className="text-gray-600 mt-2 text-sm leading-relaxed flex-1">{p.excerpt}</p>
                <p className="text-gray-400 mt-4 text-xs">
                  <time dateTime={p.publishedAt}>{p.publishedAt}</time> · {p.readTimeMinutes} min
                  read
                </p>
              </div>
            </article>
          ))}
        </div>
      </ContainerEditorial>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.11 FAQ — Nexus light surface, white bordered accordion items.
// ─────────────────────────────────────────────────────────────────────────────
function FAQSection() {
  return (
    <section className="bg-[#f0f2f5] py-20 lg:py-24">
      <ContainerEditorial width="default">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#e84040] uppercase tracking-widest text-sm font-bold mb-3">FAQ</p>
            <h2 className="font-sans text-[#0f206c] text-3xl md:text-5xl font-extrabold tracking-tight">
              Frequently asked questions.
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {HK_HOMEPAGE_FAQS.map((item) => (
              <details
                key={item.value}
                className="group bg-white rounded-xl border border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 open:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 p-5 font-sans font-semibold text-[#0f206c] text-base">
                  <span>{item.question}</span>
                  <span
                    className="inline-flex shrink-0 items-center justify-center size-7 rounded-full bg-[rgba(26,184,160,0.12)] text-[#1ab8a0] transition-transform duration-200 group-open:rotate-45"
                    aria-hidden="true"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    >
                      <path d="M7 1v12M1 7h12" />
                    </svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{item.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </ContainerEditorial>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §3.12 FINAL CTA — dark Nexus section, centered headline, coral + teal CTAs.
// ─────────────────────────────────────────────────────────────────────────────
function FinalCTASection() {
  const whatsappHk = process.env.NEXT_PUBLIC_HK_WHATSAPP;
  const sanitisedWhatsapp = whatsappHk?.replace(/[^0-9+]/g, "") ?? "";
  return (
    <section className="bg-[#0f1117] py-24 lg:py-32">
      <ContainerEditorial width="default">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-[#e84040] uppercase tracking-widest text-sm font-bold mb-3">
            Get Started
          </p>
          <h2 className="font-sans text-white mb-5 text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
            Ready to book your child&apos;s first class?
          </h2>
          <p className="text-white/70 mb-8 text-base md:text-lg leading-relaxed">
            Free 30-minute assessment, no commitment. Choose Wan Chai or Cyberport — or let us
            suggest based on your location.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="touch"
              className="bg-[#e84040] hover:bg-[#d23535] text-white rounded-full px-6 py-3 font-semibold shadow-lg shadow-[#e84040]/20"
            >
              <a href="/book-a-trial/free-assessment/">
                Book a Free Trial <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </a>
            </Button>
            {whatsappHk && (
              <Button
                asChild
                size="touch"
                className="bg-[#1ab8a0] hover:bg-[#16a08c] text-white rounded-full px-6 py-3 font-semibold shadow-lg shadow-[#1ab8a0]/20"
              >
                <WhatsAppCTA
                  phone={sanitisedWhatsapp}
                  message="Hi ProActiv HK, I'd like to book a free trial."
                >
                  Chat on WhatsApp <MessageCircle className="ml-2 size-4" aria-hidden="true" />
                </WhatsAppCTA>
              </Button>
            )}
          </div>
        </div>
      </ContainerEditorial>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT — RSC. Returns fragment (layout provides <main id="main-content">).
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
      <TrustStripSection />
      <VenueChipSection />
      <WhyChooseSection />
      <ProgrammesSection />
      <LocationSplitSection />
      <SocialProofSection />
      <CoachingMethodSection />
      <HighIntentSection />
      <AboutSnapshotSection />
      <BlogSection />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}

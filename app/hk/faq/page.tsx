// Phase 6 / Plan 06-05 — HK FAQ hub wired to live Sanity data.
// Replaces HK_FAQ_ITEMS with sanityFetch + hkFaqQuery.
// FAQPage JSON-LD built from live data (UI-SPEC §8.3).

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { FAQItem } from "@/components/ui/faq-item";
import { sanityFetch } from "@/lib/sanity.live";
import { hkFaqQuery } from "@/lib/queries";

export const metadata: Metadata = {
  title: "FAQ — ProActiv Sports Hong Kong",
  description:
    "Common questions about ProGym children's gymnastics, classes, holiday camps, parties, venues, and pricing in Hong Kong.",
  openGraph: {
    title: "FAQ — ProActiv Sports Hong Kong",
    description:
      "Common questions about ProGym children's gymnastics, classes, holiday camps, parties, venues, and pricing.",
    url: "https://hk.proactivsports.com/faq/",
    siteName: "ProActiv Sports Hong Kong",
    locale: "en_HK",
    type: "website",
  },
  alternates: { canonical: "https://hk.proactivsports.com/faq/" },
};

const GROUP_LABELS: Record<string, string> = {
  about: "About ProGym Hong Kong",
  venues: "Venues",
  gymnastics: "Gymnastics",
  camps: "Holiday Camps",
  parties: "Birthday Parties",
  pricing: "Pricing",
};

const GROUP_ORDER = ["about", "venues", "gymnastics", "camps", "parties", "pricing"] as const;

export default async function HKFAQPage() {
  const { data: faqs } = await sanityFetch({
    query: hkFaqQuery,
    tags: ["faq"],
  });

  // Group items by `category` field (Sanity field name), preserving GROUP_ORDER.
  const grouped = GROUP_ORDER.map((group) => ({
    group,
    label: GROUP_LABELS[group],
    items: faqs.filter((i) => i.category === group),
  })).filter((g) => g.items.length > 0);

  // Build FAQPage JSON-LD with mainEntity matching visible Q&A char-for-char (UI-SPEC §8.3).
  const faqSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
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
            name: "FAQ",
            item: "https://hk.proactivsports.com/faq/",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <Section size="lg" bg="default">
        <ContainerEditorial width="wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h1 className="text-display font-display text-foreground">
                Frequently asked questions.
              </h1>
              <p className="text-body-lg text-muted-foreground mt-6">
                Most parents have these questions before their child&apos;s first class. If yours
                isn&apos;t here, send us a quick WhatsApp or enquiry — we usually reply same day.
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/photography/testimonial-family-scene.webp"
                alt="Family at ProGym Hong Kong"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </ContainerEditorial>
      </Section>

      {faqs.length === 0 ? (
        <Section size="md" bg="muted">
          <ContainerEditorial width="default">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-h2 font-display text-foreground mb-4">FAQs coming soon.</h2>
              <p className="text-body text-muted-foreground">
                Send us your question directly and we&apos;ll reply same day.
              </p>
            </div>
          </ContainerEditorial>
        </Section>
      ) : (
        grouped.map((g, idx) => (
          <Section key={g.group} size="md" bg={idx % 2 === 0 ? "muted" : "default"}>
            <ContainerEditorial width="default">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-h2 font-display text-foreground mb-6">{g.label}</h2>
                <div className="flex flex-col gap-3">
                  {g.items.map((item) => (
                    <FAQItem
                      key={item._id}
                      id={item._id}
                      question={item.question}
                      answer={item.answer}
                    />
                  ))}
                </div>
              </div>
            </ContainerEditorial>
          </Section>
        ))
      )}

      {/* CTA */}
      <Section size="lg" bg="navy">
        <ContainerEditorial width="default">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-h2 font-display text-white mb-4">Still have a question?</h2>
            <p className="text-body-lg text-brand-cream mb-8">
              A coach is usually available to reply within a few hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="touch"
                className="bg-brand-red text-white hover:bg-brand-red/90"
              >
                <Link href="/contact?market=hk">
                  Send an Enquiry <ArrowRight className="ml-2 size-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </ContainerEditorial>
      </Section>
    </>
  );
}

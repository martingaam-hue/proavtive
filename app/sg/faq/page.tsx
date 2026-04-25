// Phase 6 / Plan 06-05 — SG FAQ hub wired to live Sanity data.
// Replaces SG_FAQ_ITEMS with sanityFetch + sgFaqQuery.
// FAQPage JSON-LD built from live data; DOM order matches JSON-LD order (Google rich-result rule).

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { FAQItem } from "@/components/ui/faq-item";
import { sanityFetch } from "@/lib/sanity.live";
import { sgFaqQuery } from "@/lib/queries";

export const metadata: Metadata = {
  title: "FAQ — Prodigy Singapore | Katong Point",
  description:
    "Common questions about Prodigy sports classes, MultiBall, holiday camps, birthday parties, school partnerships, and Katong Point venue. Answered by the team.",
  openGraph: {
    title: "FAQ — Prodigy Singapore",
    description:
      "Common questions about Prodigy sports classes, MultiBall, holiday camps, and Katong Point.",
    url: "https://sg.proactivsports.com/faq/",
    siteName: "Prodigy by ProActiv Sports Singapore",
    locale: "en_SG",
    type: "website",
  },
  alternates: { canonical: "https://sg.proactivsports.com/faq/" },
};

const GROUP_LABELS: Record<string, string> = {
  about: "About Prodigy",
  venue: "Katong Point",
  classes: "Classes",
  multiball: "MultiBall",
  camps: "Camps",
  parties: "Birthday Parties",
  schools: "School Partnerships",
};

const GROUP_ORDER = [
  "about",
  "venue",
  "classes",
  "multiball",
  "camps",
  "parties",
  "schools",
] as const;

export default async function SGFAQPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: faqs } = (await sanityFetch({ query: sgFaqQuery, tags: ["faq"] })) as {
    data: any[];
  };

  // Group items preserving GROUP_ORDER — same order drives JSON-LD and DOM (char-for-char rule).
  const grouped = GROUP_ORDER.map((group) => ({
    group,
    label: GROUP_LABELS[group],
    items: faqs.filter((i) => i.category === group),
  })).filter((g) => g.items.length > 0);

  // FAQPage JSON-LD: mainEntity order MATCHES DOM order below (char-for-char Google rich-result rule).
  const faqSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: grouped.flatMap((g) =>
          g.items.map((i) => ({
            "@type": "Question",
            name: i.question,
            acceptedAnswer: { "@type": "Answer", text: i.answer },
          })),
        ),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Prodigy Singapore",
            item: "https://sg.proactivsports.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "FAQ",
            item: "https://sg.proactivsports.com/faq/",
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
        <ContainerEditorial width="default">
          <div className="max-w-3xl">
            <h1 className="text-display font-display text-foreground">
              Frequently asked questions.
            </h1>
            <p className="text-body-lg text-muted-foreground mt-6">
              Most parents have these questions before their child&apos;s first class. If yours
              isn&apos;t here, send us a quick WhatsApp or enquiry — we usually reply same day.
            </p>
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
        /* FAQ groups — DOM order matches JSON-LD order */
        grouped.map((g, idx) => (
          <Section key={g.group} size="md" bg={idx % 2 === 0 ? "muted" : "default"}>
            <ContainerEditorial width="default">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-h2 font-display text-foreground mb-6">{g.label}</h2>
                <div className="space-y-2">
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
              A Prodigy coach is usually available to reply within a few hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="touch"
                className="bg-brand-red text-white hover:bg-brand-red/90"
              >
                <a href="/book-a-trial/">
                  Send an Enquiry <ArrowRight className="ml-2 size-4" aria-hidden />
                </a>
              </Button>
              <Button
                asChild
                size="touch"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Link href="/katong-point/">Visit Katong Point</Link>
              </Button>
            </div>
          </div>
        </ContainerEditorial>
      </Section>
    </>
  );
}

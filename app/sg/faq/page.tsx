// Phase 5 / Plan 05-05 — SG FAQ hub (SG-10).
// FAQPage JSON-LD + BreadcrumbList. 10 Q&A grouped by category.
// CRITICAL: DOM order MUST match JSON-LD mainEntity order char-for-char (Google rich-result rule).
// Pattern 11 #5: MultiBall group appears in FAQ — completes all 6 Pattern 11 placements with Plan 05-03 + 05-04 + 05-05.
// NO <Accordion> wrapper — FAQItem composes its own; nesting breaks state (PATTERNS.md).

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { FAQItem } from "@/components/ui/faq-item";
import { SG_FAQ_ITEMS } from "@/lib/sg-data";

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

// FAQPage JSON-LD: mainEntity order MATCHES DOM order below (char-for-char Google rich-result rule).
// Same GROUP_ORDER drives JSON-LD flatMap AND DOM render — single source of truth.
const faqSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      mainEntity: GROUP_ORDER.flatMap((group) =>
        SG_FAQ_ITEMS.filter((i) => i.group === group).map((i) => ({
          "@type": "Question",
          name: i.question,
          acceptedAnswer: { "@type": "Answer", text: i.answer },
        }))
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

export default function SGFAQPage() {
  // Group items preserving declaration order within each group.
  const grouped = GROUP_ORDER.map((group) => ({
    group,
    label: GROUP_LABELS[group],
    items: SG_FAQ_ITEMS.filter((i) => i.group === group),
  })).filter((g) => g.items.length > 0);

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
              Most parents have these questions before their child&apos;s first
              class. If yours isn&apos;t here, send us a quick WhatsApp or
              enquiry — we usually reply same day.
            </p>
          </div>
        </ContainerEditorial>
      </Section>

      {/* FAQ groups — DOM order matches JSON-LD order */}
      {grouped.map((g, idx) => (
        <Section key={g.group} size="md" bg={idx % 2 === 0 ? "muted" : "default"}>
          <ContainerEditorial width="default">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-display text-foreground mb-6">
                {g.label}
              </h2>
              <div className="space-y-2">
                {g.items.map((item) => (
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
      ))}

      {/* CTA */}
      <Section size="lg" bg="navy">
        <ContainerEditorial width="default">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-h2 font-display text-white mb-4">
              Still have a question?
            </h2>
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
                  Send an Enquiry{" "}
                  <ArrowRight className="ml-2 size-4" aria-hidden />
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

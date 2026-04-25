// Phase 3 / Plan 03-04 — /coaching-philosophy/ page (GW-03). RSC. MDX body + structural composition wrapper.
//
// Pitfall 3: import MDXRemote from "next-mdx-remote/rsc" (NOT bare "next-mdx-remote").
// Pitfall 2: full openGraph object — no shallow-merge inheritance.
//
// Photography precondition (D-09): coaching-hero.{avif,webp} required before production deploy.
// Leadership portrait precondition (D-10): leadership-monica.{avif,webp} + leadership-haikel.{avif,webp}.
// All paths are hardcoded — files resolve automatically once pnpm photos:process runs.

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Shield, TrendingUp, Sparkles } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LeadershipCard, type LeadershipCardProps } from "@/components/root/leadership-card";

const getContent = cache(async () => {
  const raw = await readFile(join(process.cwd(), "app/root/coaching-philosophy/content.mdx"), "utf8");
  return matter(raw);
});

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await getContent();
  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      url: "https://proactivsports.com/coaching-philosophy",
      images: [{ url: "/coaching-philosophy/opengraph-image", width: 1200, height: 630, alt: "ProActiv Sports — How we coach." }],
      type: "article",
      siteName: "ProActiv Sports",
      locale: "en_GB",
    },
    alternates: { canonical: "https://proactivsports.com/coaching-philosophy" },
  };
}

const coachingPhilosophySchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "ProActiv Sports",
          item: "https://proactivsports.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Coaching Philosophy",
          item: "https://proactivsports.com/coaching-philosophy",
        },
      ],
    },
  ],
};

const PILLARS = [
  {
    Icon: Shield,
    title: "Safety",
    body: "Every class begins with the same safety check — equipment, surfaces, supervision ratios. Spotting techniques are taught explicitly, not assumed. Children know the rules of the floor before they step onto it, and coaches reinforce them every session.",
  },
  {
    Icon: TrendingUp,
    title: "Progression",
    body: "Skills are sequenced. We don't ask a child to attempt a backflip on day one — we build through forward rolls, handstands against a wall, beam work, before the trampoline becomes a target. Progression is the difference between a class and a curriculum.",
  },
  {
    Icon: Sparkles,
    title: "Confidence",
    body: "The point isn't producing competitive gymnasts. The point is the child who walks out feeling brave, focused, and proud — whether that maps to a competition pathway or simply to a happier kid at school the next morning. Confidence transfers everywhere.",
  },
] as const;

const COACH_LEADERS: ReadonlyArray<LeadershipCardProps> = [
  {
    name: "Monica",
    role: "Director of Sports, Hong Kong",
    bioLine:
      "19 years coaching children's gymnastics. Level 2 Italian coaching and judging certifications. Leads the HK coaching team and the competitive gymnastics pathway.",
    portrait: "/photography/leadership-monica.webp",
    portraitAlt: "Monica, Director of Sports for Hong Kong",
  },
  {
    name: "Haikel",
    role: "Head of Sports, Singapore",
    bioLine:
      "Diploma in Sports Coaching, seven-plus years leading coaching teams. Leads the Singapore programme and the Prodigy multi-sport approach.",
    portrait: "/photography/leadership-haikel.webp",
    portraitAlt: "Haikel, Head of Sports for Singapore",
  },
];

export default async function CoachingPhilosophyPage() {
  const { content } = await getContent();
  const hkUrl = process.env.NEXT_PUBLIC_HK_URL ?? "/?__market=hk";
  const sgUrl = process.env.NEXT_PUBLIC_SG_URL ?? "/?__market=sg";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(coachingPhilosophySchema) }}
      />
      {/* §4.2 (1) Editorial hero */}
      <Section size="lg">
        <ContainerEditorial width="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h1 className="text-display font-display text-foreground">How we coach.</h1>
              <p className="text-body-lg text-muted-foreground mt-6 max-w-prose">
                A shared methodology across both markets — built on safety standards, structured skill progression, and a deep commitment to children&apos;s confidence.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image
                  src="/photography/coaching-hero.webp"
                  alt="A ProActiv Sports coach working with a child on beam"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §4.2 (2) 3-pillar section */}
      <Section size="md">
        <ContainerEditorial width="wide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PILLARS.map(({ Icon, title, body }) => (
              <div key={title}>
                <Icon className="size-10 text-brand-navy" aria-hidden="true" />
                <h3 className="text-h3 font-display text-foreground mt-4">{title}</h3>
                <p className="text-body text-muted-foreground mt-3 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </ContainerEditorial>
      </Section>

      {/* §4.2 (3) Training course callout — MDX body */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="default">
          <Card className="p-8 lg:p-12">
            <h2 className="text-h2 font-display text-foreground">The ProActiv Sports training course.</h2>
            <div className="prose prose-lg max-w-none mt-6 prose-p:text-foreground prose-p:text-body-lg">
              <MDXRemote source={content} />
            </div>
          </Card>
        </ContainerEditorial>
      </Section>

      {/* §4.2 (4) Coach leadership cards — Monica + Haikel only */}
      <Section size="md">
        <ContainerEditorial width="wide">
          <h2 className="text-h2 font-display text-foreground">Who leads the coaching teams.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {COACH_LEADERS.map((coach) => (
              <LeadershipCard key={coach.name} {...coach} />
            ))}
          </div>
        </ContainerEditorial>
      </Section>

      {/* §4.2 (5) Dual market CTA */}
      <Section size="sm" bg="cream">
        <ContainerEditorial width="default">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-h1 font-display text-foreground">Experience the difference.</h2>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <Button asChild size="touch" variant="default">
                <a href={`${hkUrl.replace(/\/$/, "")}/book-a-trial/`}>Book a Free Trial in Hong Kong</a>
              </Button>
              <Button asChild size="touch" variant="default">
                <a href={`${sgUrl.replace(/\/$/, "")}/book-a-trial/`}>Book a Free Trial in Singapore</a>
              </Button>
            </div>
          </div>
        </ContainerEditorial>
      </Section>
    </>
  );
}

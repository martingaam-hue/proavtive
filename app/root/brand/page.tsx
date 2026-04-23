// Phase 3 / Plan 03-04 — /brand/ page (GW-02). RSC. MDX-driven body + structural composition wrapper.
//
// Pitfall 3: import MDXRemote from "next-mdx-remote/rsc" (NOT bare "next-mdx-remote").
// Pitfall 2: full openGraph object — no shallow-merge inheritance.
//
// Photography precondition (D-09 + D-10): 8 photo files required before production deploy.
//   public/photography/brand-hero.{avif,webp}
//   public/photography/leadership-{will,monica,haikel}.{avif,webp}
// All paths are hardcoded — files resolve automatically once pnpm photos:process runs.

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { StatStrip } from "@/components/ui/stat-strip";
import { LeadershipSection } from "@/components/root/leadership-section";
import type { LeadershipCardProps } from "@/components/root/leadership-card";

const getContent = cache(async () => {
  const raw = await readFile(join(process.cwd(), "app/root/brand/content.mdx"), "utf8");
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
      url: "https://proactivsports.com/brand",
      images: [{ url: "/brand/opengraph-image", width: 1200, height: 630, alt: "About ProActiv Sports" }],
      type: "article",
      siteName: "ProActiv Sports",
      locale: "en_GB",
    },
    alternates: { canonical: "https://proactivsports.com/brand" },
  };
}

const STATS = [
  { value: "14", label: "Years in operation" },
  { value: "2", label: "Cities" },
  { value: "3", label: "Dedicated venues" },
  { value: "2–16", label: "Ages" },
] as const;

const LEADERS: ReadonlyArray<LeadershipCardProps> = [
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

// School partnership text chips — logo SVGs are a HUMAN-ACTION precondition.
// Replace with LogoWall + real SVGs once partner logos are provided.
const PARTNER_NAMES = [
  "International French School",
  "Singapore American School",
  "KidsFirst",
  "ESF",
];

export default async function BrandPage() {
  const { content } = await getContent();
  const hkUrl = process.env.NEXT_PUBLIC_HK_URL ?? "/?__market=hk";
  const sgUrl = process.env.NEXT_PUBLIC_SG_URL ?? "/?__market=sg";

  return (
    <>
      {/* §4.1 (1) Hero — split editorial */}
      <Section size="lg">
        <ContainerEditorial width="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h1 className="text-display font-display text-foreground">About ProActiv Sports</h1>
              <p className="text-body-lg text-muted-foreground mt-6 max-w-prose">
                Children&apos;s gymnastics and sports in Hong Kong and Singapore. Since 2011.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image
                  src="/photography/brand-hero.webp"
                  alt="ProActiv Sports brand photography — children training at ProGym"
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

      {/* §4.1 (2) LLM-citable brand paragraph + history (rendered from MDX body) */}
      <Section size="md">
        <ContainerEditorial width="default">
          <div className="prose prose-lg max-w-3xl mx-auto prose-headings:font-display prose-headings:text-foreground prose-p:text-foreground prose-p:text-body-lg prose-strong:text-foreground">
            <MDXRemote source={content} />
          </div>
        </ContainerEditorial>
      </Section>

      {/* §4.1 (4) Leadership — reuse LeadershipSection from Plan 03-02 */}
      <LeadershipSection heading="Led by people who've built their lives around coaching." leaders={LEADERS} />

      {/* §4.1 (5) StatStrip */}
      <Section size="md">
        <ContainerEditorial width="default">
          <StatStrip stats={STATS} />
        </ContainerEditorial>
      </Section>

      {/* §4.1 (6) School partnerships — text chip fallback (logo SVGs pending HUMAN-ACTION) */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="wide">
          <h2 className="text-h2 font-display text-foreground text-center">School partnerships</h2>
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground text-center mt-2">
            With partner permission. Contact us for partnership enquiries.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6 list-none">
            {PARTNER_NAMES.map((name) => (
              <li
                key={name}
                className="flex items-center justify-center rounded-lg border border-border bg-background px-4 py-5 text-center text-sm font-medium text-foreground"
              >
                {name}
              </li>
            ))}
          </ul>
        </ContainerEditorial>
      </Section>

      {/* §4.1 (7) Final CTA */}
      <Section size="sm" bg="cream">
        <ContainerEditorial width="default">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-h1 font-display text-foreground">Want to know more?</h2>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <Button asChild size="touch" variant="default">
                <a href={hkUrl}>Enter Hong Kong →</a>
              </Button>
              <Button asChild size="touch" variant="default">
                <a href={sgUrl}>Enter Singapore →</a>
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
    </>
  );
}

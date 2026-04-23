// Phase 3 / Plan 03-05 — /careers/ page (GW-05). RSC. D-07 evergreen + open application CTA.
// Note: careers-hero.webp was not yet in public/photography/ at time of execution.
// Using programme-beginner.webp as a build-unblocking substitute (Rule 3 — blocking issue).
// Phase 3 replacement action: add public/photography/careers-hero.webp and update src below.

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const getContent = cache(async () => {
  const raw = await readFile(join(process.cwd(), "app/root/careers/content.mdx"), "utf8");
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
      url: "https://proactivsports.com/careers",
      images: [{ url: "/careers/opengraph-image", width: 1200, height: 630, alt: "Careers at ProActiv Sports" }],
      siteName: "ProActiv Sports",
      locale: "en_GB",
      type: "website",
    },
    alternates: { canonical: "https://proactivsports.com/careers" },
  };
}

const LOOK_FOR_BULLETS = [
  "Genuine love of working with children.",
  "A coaching qualification or sport-specific background — or a deep willingness to learn through our training course.",
  "Calm under pressure and a sense of humour.",
  "Reliability, professionalism, and care for the families we serve.",
  "Eligibility to work in Hong Kong or Singapore.",
] as const;

export default async function CareersPage() {
  const { content } = await getContent();
  return (
    <>
      {/* §4.4 (1) Hero */}
      <Section size="lg">
        <ContainerEditorial width="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h1 className="text-display font-display text-foreground">Work with children. Build a career.</h1>
              <p className="text-body-lg text-muted-foreground mt-6 max-w-prose">
                We&apos;re always looking for great coaches and operations team members across Hong Kong and Singapore.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image
                  src="/photography/programme-beginner.webp"
                  alt="A ProActiv Sports coach guiding a child through a beam routine"
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

      {/* §4.4 (2) Why-work-here — 12-col text+photo + MDX editorial body */}
      <Section size="md">
        <ContainerEditorial width="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <h2 className="text-h2 font-display text-foreground">Why ProActiv?</h2>
              <div className="prose prose-lg mt-6 prose-p:text-foreground prose-p:text-body-lg max-w-none">
                <MDXRemote source={content} />
              </div>
            </div>
          </div>
        </ContainerEditorial>
      </Section>

      {/* §4.4 (3) What-we-look-for — bullet list */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="default">
          <h2 className="text-h2 font-display text-foreground">What we look for.</h2>
          <ul className="space-y-3 text-body-lg mt-6 max-w-2xl">
            {LOOK_FOR_BULLETS.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2">
                <CheckCircle2 className="size-5 text-brand-green inline-block mr-2 shrink-0 mt-1" aria-hidden="true" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </ContainerEditorial>
      </Section>

      {/* §4.4 (4) Open application CTA → /contact/?subject=job */}
      <Section size="md" bg="cream">
        <ContainerEditorial width="default">
          <Card className="p-8 lg:p-12 max-w-2xl mx-auto text-center">
            <h2 className="text-h2 font-display text-foreground">Tell us about you.</h2>
            <p className="text-body text-muted-foreground mt-3">
              Send an open application — we&apos;ll route it to the right venue and the right team.
            </p>
            <div className="mt-6 flex justify-center">
              <Button asChild size="touch" variant="default">
                <Link href="/contact?subject=job">Send us your application →</Link>
              </Button>
            </div>
          </Card>
        </ContainerEditorial>
      </Section>
    </>
  );
}

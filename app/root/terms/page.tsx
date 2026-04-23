// Phase 3 / Plan 03-05 — /terms/ page (GW-07). RSC + MDX body. D-08 placeholder + yellow draft banner.

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cache } from "react";
import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Card } from "@/components/ui/card";

const getContent = cache(async () => {
  const raw = await readFile(join(process.cwd(), "app/root/terms/content.mdx"), "utf8");
  return matter(raw);
});

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await getContent();
  return {
    title: "Terms of Use (Draft)",
    description: data.description,
    openGraph: {
      title: "Terms of Use (Draft) | ProActiv Sports",
      description: data.description,
      url: "https://proactivsports.com/terms",
      images: [{ url: "/terms/opengraph-image", width: 1200, height: 630, alt: "ProActiv Sports — Terms of Use" }],
      siteName: "ProActiv Sports",
      locale: "en_GB",
      type: "website",
    },
    alternates: { canonical: "https://proactivsports.com/terms" },
  };
}

export default async function TermsPage() {
  const { content, data } = await getContent();
  return (
    <>
      {/* Yellow draft banner */}
      <Section size="sm">
        <ContainerEditorial width="default">
          <Card className="bg-brand-yellow border-brand-yellow text-foreground p-4 lg:p-6 max-w-3xl mx-auto">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-foreground shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-body font-semibold">
                DRAFT POLICY — This document is pending legal review and is not yet binding. Live policy ships before public launch.
              </p>
            </div>
          </Card>
        </ContainerEditorial>
      </Section>

      {/* Heading + last-updated */}
      <Section size="sm">
        <ContainerEditorial width="default">
          <h1 className="text-h1 font-display text-foreground">Terms of Use</h1>
          <p className="text-small text-muted-foreground mt-2">
            Last updated: {data.lastUpdated}
          </p>
        </ContainerEditorial>
      </Section>

      {/* MDX prose body */}
      <Section size="md">
        <ContainerEditorial width="default">
          <article className="prose prose-lg max-w-2xl mx-auto prose-headings:font-display prose-headings:text-foreground prose-h2:text-h2 prose-h3:text-h3 prose-p:text-body-lg prose-p:text-foreground prose-strong:text-foreground prose-a:text-foreground prose-a:underline">
            <MDXRemote source={content} />
          </article>
        </ContainerEditorial>
      </Section>

      {/* Footer CTA */}
      <Section size="sm" bg="muted">
        <ContainerEditorial width="default">
          <p className="text-body text-muted-foreground text-center">
            Questions about these terms? Email{" "}
            <a href="mailto:hello@proactivsports.com" className="font-semibold text-foreground underline underline-offset-2 hover:text-brand-red">
              hello@proactivsports.com
            </a>
          </p>
        </ContainerEditorial>
      </Section>
    </>
  );
}

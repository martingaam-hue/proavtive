// Phase 4 / Plan 04-06 — HK blog hub (HK-10).
// RESEARCH Pattern 5: stub array shape compatible with Phase 6 Sanity Post schema.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HK_BLOG_POSTS_STUB } from "@/lib/hk-data";

export const metadata: Metadata = {
  title: "ProActiv Hong Kong Blog — Gymnastics + Sports for Children",
  description:
    "Long-form guides, parent tips, and ProGym news from Hong Kong. Gymnastics progression, holiday camp planning, and what to expect at your first class.",
  openGraph: {
    title: "ProActiv Hong Kong Blog",
    description:
      "Long-form guides, parent tips, and ProGym news from Hong Kong.",
    url: "https://hk.proactivsports.com/blog/",
    siteName: "ProActiv Sports Hong Kong",
    locale: "en_HK",
    type: "website",
    images: [
      {
        url: "/blog/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ProActiv Hong Kong blog",
      },
    ],
  },
  alternates: { canonical: "https://hk.proactivsports.com/blog/" },
};

export default function HKBlogPage() {
  const posts = HK_BLOG_POSTS_STUB;

  return (
    <>
      {/* Hero */}
      <Section size="lg" bg="default">
        <ContainerEditorial width="wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h1 className="text-display font-display text-foreground">
                From the ProActiv HK blog.
              </h1>
              <p className="text-body-lg text-muted-foreground mt-6">
                Long-form guides on gymnastics progression, holiday camp planning, and what to
                expect at your child&apos;s first class. Written by our coaches and the ProActiv
                Hong Kong team.
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/photography/programme-beginner.webp"
                alt="Children in a gymnastics class at ProGym Hong Kong"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </ContainerEditorial>
      </Section>

      {/* Posts list / empty state */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="wide">
          {posts.length === 0 ? (
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-h2 font-display text-foreground mb-4">
                New posts coming soon.
              </h2>
              <p className="text-body text-muted-foreground">
                We&apos;re preparing long-form guides on gymnastics progression, holiday camp
                planning, and what to expect at your first class. In the meantime, our coaches
                are happy to answer any question directly.
              </p>
              <div className="mt-8">
                <Button
                  asChild
                  variant="outline"
                  size="touch"
                  className="border-brand-navy text-brand-navy hover:bg-brand-navy/5"
                >
                  <Link href="/contact?market=hk">Send us a question</Link>
                </Button>
              </div>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <li key={post.slug}>
                  {/* Phase 6 wires href to /blog/[slug]/; Phase 4 ships hash-link placeholder. */}
                  <Card className="overflow-hidden h-full flex flex-col">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={post.heroImage}
                        alt={post.title}
                        fill
                        sizes="(max-width:1024px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <Badge variant="secondary" className="self-start">
                        {post.category}
                      </Badge>
                      <h2 className="text-h3 font-display text-foreground mt-3">{post.title}</h2>
                      <p className="text-body text-muted-foreground mt-2 flex-1">
                        {post.excerpt}
                      </p>
                      <p className="text-small text-muted-foreground mt-4">
                        <time dateTime={post.publishedAt}>{post.publishedAt}</time> ·{" "}
                        {post.readTimeMinutes} min read
                      </p>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </ContainerEditorial>
      </Section>

      {/* Subscribe CTA */}
      <Section size="lg" bg="navy">
        <ContainerEditorial width="default">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-h2 font-display text-white mb-4">
              Have a question our blog hasn&apos;t answered?
            </h2>
            <p className="text-body-lg text-brand-cream mb-8">
              Our coaches are often quicker than a blog post. Send us a quick enquiry.
            </p>
            <Button
              asChild
              size="touch"
              className="bg-brand-red text-white hover:bg-brand-red/90"
            >
              <Link href="/contact?market=hk">
                Send us a question <ArrowRight className="ml-2 size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </ContainerEditorial>
      </Section>
    </>
  );
}

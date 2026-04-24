// Phase 5 / Plan 05-05 — SG blog hub (SG-09).
// Handles 0-1 stub posts gracefully with empty-state pattern.
// Pitfall 9 guard: NEVER uses sg-placeholder-* as imageUrl.
// Phase 6 CMS swaps SG_BLOG_POSTS_STUB for Sanity GROQ query results.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SG_BLOG_POSTS_STUB } from "@/lib/sg-data";

export const metadata: Metadata = {
  title: "Prodigy Singapore Blog — Sports, Camps & Parenting",
  description:
    "Long-form guides, parent tips, and Prodigy news from Katong Point. Sports development, holiday camp planning, and what to expect at your child's first class.",
  openGraph: {
    title: "Prodigy Singapore Blog",
    description:
      "Guides, tips, and stories from Katong Point — Prodigy by ProActiv Sports Singapore.",
    url: "https://sg.proactivsports.com/blog/",
    siteName: "Prodigy by ProActiv Sports Singapore",
    locale: "en_SG",
    type: "website",
    images: [
      {
        url: "/blog/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Prodigy Singapore blog",
      },
    ],
  },
  alternates: { canonical: "https://sg.proactivsports.com/blog/" },
};

// Pitfall 9 guard: only render an Image if the post has an imageUrl AND it is not a placeholder.
function isValidHeroImage(url: string | undefined): url is string {
  if (!url) return false;
  if (url.includes("sg-placeholder")) return false;
  return true;
}

export default function SGBlogPage() {
  const posts = SG_BLOG_POSTS_STUB;

  return (
    <>
      {/* Hero */}
      <Section size="lg" bg="default">
        <ContainerEditorial width="wide">
          <div className="max-w-3xl">
            <h1 className="text-display font-display text-foreground">
              From the{" "}
              <span className="font-accent text-brand-green">Prodigy</span>{" "}
              Singapore blog.
            </h1>
            <p className="text-body-lg text-muted-foreground mt-6">
              Long-form guides on sports development, holiday camp planning, and
              what to expect at your child&apos;s first class. Written by our
              coaches and the ProActiv Sports Singapore team.
            </p>
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
                We&apos;re preparing long-form guides on multi-sport development,
                MultiBall training, holiday camp planning, and what to expect at
                your child&apos;s first session at Katong Point. In the meantime,
                our coaches are happy to answer any question directly.
              </p>
              <div className="mt-8">
                <Button
                  asChild
                  variant="outline"
                  size="touch"
                  className="border-brand-navy text-brand-navy hover:bg-brand-navy/5"
                >
                  <a href="/book-a-trial/">Send us a question</a>
                </Button>
              </div>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <li key={post.slug}>
                  {/* Phase 6 wires href to /blog/[slug]/; Phase 5 ships hash-link placeholder. */}
                  <Card className="overflow-hidden h-full flex flex-col">
                    {/* Pitfall 9: only render Image if URL exists AND is NOT a placeholder */}
                    {isValidHeroImage(post.heroImage) ? (
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={post.heroImage}
                          alt={post.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      /* Text-only card treatment when image is missing or placeholder */
                      <div className="h-6" />
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <Badge variant="secondary" className="self-start">
                        {post.category}
                      </Badge>
                      <h2 className="text-h3 font-display text-foreground mt-3">
                        {post.title}
                      </h2>
                      <p className="text-body text-muted-foreground mt-2 flex-1">
                        {post.excerpt}
                      </p>
                      <p className="text-small text-muted-foreground mt-4">
                        <time dateTime={post.publishedAt}>
                          {post.publishedAt}
                        </time>{" "}
                        · {post.readTimeMinutes} min read
                      </p>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </ContainerEditorial>
      </Section>

      {/* Subscribe / contact CTA */}
      <Section size="lg" bg="navy">
        <ContainerEditorial width="default">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-h2 font-display text-white mb-4">
              Have a question our blog hasn&apos;t answered?
            </h2>
            <p className="text-body-lg text-brand-cream mb-8">
              Our coaches are often quicker than a blog post. Send us a quick
              enquiry.
            </p>
            <Button
              asChild
              size="touch"
              className="bg-brand-red text-white hover:bg-brand-red/90"
            >
              <a href="/book-a-trial/">
                Send us a question{" "}
                <ArrowRight className="ml-2 size-4" aria-hidden />
              </a>
            </Button>
          </div>
        </ContainerEditorial>
      </Section>
    </>
  );
}

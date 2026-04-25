// Phase 6 / Plan 06-05 — SG blog hub wired to live Sanity data.
// Replaces SG_BLOG_POSTS_STUB with sanityFetch + sgBlogListQuery.
// Field names updated per D-08: publishedAt, mainImage (SanityImage), categories[0].

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sanityFetch } from "@/lib/sanity.live";
import { sgBlogListQuery } from "@/lib/queries";
import { SanityImage } from "@/components/sanity-image";

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

const blogSchema = {
  "@context": "https://schema.org",
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
      name: "Blog",
      item: "https://sg.proactivsports.com/blog/",
    },
  ],
};

export default async function SGBlogPage() {
  const { data: posts } = await sanityFetch({
    query: sgBlogListQuery,
    tags: ["post"],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      {/* Hero */}
      <Section size="lg" bg="default">
        <ContainerEditorial width="wide">
          <div className="max-w-3xl">
            <h1 className="text-display font-display text-foreground">
              From the <span className="font-accent text-brand-green">Prodigy</span> Singapore blog.
            </h1>
            <p className="text-body-lg text-muted-foreground mt-6">
              Long-form guides on sports development, holiday camp planning, and what to expect at
              your child&apos;s first class. Written by our coaches and the ProActiv Sports
              Singapore team.
            </p>
          </div>
        </ContainerEditorial>
      </Section>

      {/* Posts list / empty state */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="wide">
          {posts.length === 0 ? (
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-h2 font-display text-foreground mb-4">New posts coming soon.</h2>
              <p className="text-body text-muted-foreground">
                We&apos;re preparing long-form guides on multi-sport development, MultiBall
                training, holiday camp planning, and what to expect at your child&apos;s first
                session at Katong Point. In the meantime, our coaches are happy to answer any
                question directly.
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
                  <Link href={`/blog/${post.slug}/`}>
                    <Card className="overflow-hidden h-full flex flex-col">
                      {post.mainImage ? (
                        <div className="relative aspect-[4/3]">
                          <SanityImage
                            image={post.mainImage}
                            alt={post.mainImage.alt ?? post.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-6" />
                      )}
                      <div className="p-5 flex flex-col flex-1">
                        {post.categories && post.categories.length > 0 && (
                          <Badge variant="secondary" className="self-start">
                            {post.categories[0]}
                          </Badge>
                        )}
                        <h2 className="text-h3 font-display text-foreground mt-3">{post.title}</h2>
                        {post.excerpt && (
                          <p className="text-body text-muted-foreground mt-2 flex-1">
                            {post.excerpt}
                          </p>
                        )}
                        <p className="text-small text-muted-foreground mt-4">
                          {post.publishedAt && (
                            <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                          )}
                          {post.readTime ? ` · ${post.readTime} min read` : ""}
                        </p>
                      </div>
                    </Card>
                  </Link>
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
              Our coaches are often quicker than a blog post. Send us a quick enquiry.
            </p>
            <Button asChild size="touch" className="bg-brand-red text-white hover:bg-brand-red/90">
              <a href="/book-a-trial/">
                Send us a question <ArrowRight className="ml-2 size-4" aria-hidden />
              </a>
            </Button>
          </div>
        </ContainerEditorial>
      </Section>
    </>
  );
}

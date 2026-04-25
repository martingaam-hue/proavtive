// Phase 6 / Plan 06-06 — SG dynamic blog post page.
// Renders individual posts from Sanity with Portable Text body, author byline,
// category badges, generateMetadata (metaTitle fallback), generateStaticParams for ISR.

import { notFound } from "next/navigation";
import { sanityFetch } from "@/lib/sanity.live";
import { client } from "@/lib/sanity.client";
import { sgBlogPostBySlugQuery, sgBlogSlugsQuery } from "@/lib/queries";
import { SanityImage, urlFor } from "@/components/sanity-image";
import { PortableText } from "@/components/portable-text";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import type { Metadata } from "next";

// Date formatter — British English per brand voice (UI-SPEC §5.2)
function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await sanityFetch({
    query: sgBlogPostBySlugQuery,
    params: { slug },
    tags: ["post", `post:${slug}`],
  });

  if (!post) return {};

  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? undefined,
    openGraph: {
      title: post.metaTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt ?? undefined,
      images: post.ogImage?.asset
        ? [urlFor(post.ogImage.asset).width(1200).height(630).url()]
        : post.mainImage?.asset
          ? [urlFor(post.mainImage.asset).width(1200).height(630).url()]
          : undefined,
    },
    alternates: { canonical: `https://sg.proactivsports.com/blog/${slug}/` },
  };
}

export async function generateStaticParams() {
  // Use the base client (not sanityFetch) — generateStaticParams runs at build time
  // outside a request scope, so draftMode() cannot be called here.
  const slugs = await client.fetch(sgBlogSlugsQuery);
  return (slugs ?? []).map((item: { slug: string }) => ({ slug: item.slug }));
}

export default async function SGBlogPostPage({ params }: Props) {
  const { slug } = await params;
  const { data: post } = await sanityFetch({
    query: sgBlogPostBySlugQuery,
    params: { slug },
    tags: ["post", `post:${slug}`],
  });

  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt ?? undefined,
        datePublished: post.publishedAt ?? undefined,
        url: `https://sg.proactivsports.com/blog/${slug}/`,
        author: post.author
          ? {
              "@type": "Person",
              name: post.author.name,
            }
          : undefined,
        image: post.mainImage?.asset
          ? urlFor(post.mainImage.asset).width(1200).height(630).url()
          : undefined,
        publisher: { "@id": "https://proactivsports.com/#organization" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "ProActiv Sports Singapore",
            item: "https://sg.proactivsports.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: "https://sg.proactivsports.com/blog/",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: `https://sg.proactivsports.com/blog/${slug}/`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero — title, category badges, author byline, featured image */}
      <Section size="lg" bg="default">
        <ContainerEditorial width="default">
          <div className="max-w-3xl mx-auto">
            {/* Category badges */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((cat: string) => (
                  <Badge key={cat} variant="secondary">
                    {cat}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-h1 font-display text-foreground mb-4">{post.title}</h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-body-lg text-muted-foreground mb-6">{post.excerpt}</p>
            )}

            {/* Author byline */}
            <div className="flex items-center gap-3 mb-8">
              {post.author?.portrait?.asset && (
                <SanityImage
                  image={{
                    ...post.author.portrait,
                    alt: post.author.portrait.alt ?? post.author.name,
                  }}
                  width={40}
                  height={40}
                  className="rounded-full w-10 h-10 object-cover"
                />
              )}
              <div>
                {post.author?.name && (
                  <p className="text-small font-semibold text-foreground">{post.author.name}</p>
                )}
                <p className="text-small text-muted-foreground">
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  )}
                  {post.readTime ? ` · ${post.readTime} min read` : ""}
                </p>
              </div>
            </div>

            {/* Featured image */}
            {post.mainImage?.asset && (
              <div className="mb-10">
                <SanityImage
                  image={{ ...post.mainImage, alt: post.mainImage.alt ?? post.title }}
                  width={896}
                  height={504}
                  className="rounded-xl w-full object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 896px"
                />
              </div>
            )}
          </div>
        </ContainerEditorial>
      </Section>

      {/* Body — Portable Text in a narrow reading column */}
      {post.body && (
        <Section size="md" bg="default">
          <ContainerEditorial width="default">
            <div className="max-w-2xl mx-auto">
              <PortableText value={post.body} />
            </div>
          </ContainerEditorial>
        </Section>
      )}
    </>
  );
}

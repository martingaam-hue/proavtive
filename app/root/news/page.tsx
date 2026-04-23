// Phase 3 / Plan 03-05 — /news/ page (GW-04). RSC. D-06 placeholder with empty press array + signup form.

import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NewsSignupForm } from "./news-signup-form";

interface NewsItem {
  outlet: string;
  headline: string;
  date: string;
  url: string;
  logo?: string;
}

// Phase 6: replace this empty array with `await sanityClient.fetch(GROQ_NEWS_QUERY)`.
const newsItems: NewsItem[] = [];

export const metadata: Metadata = {
  title: "News & Press — ProActiv Sports",
  description:
    "ProActiv Sports in leading family and lifestyle publications across Hong Kong and Singapore. Coverage coming soon.",
  openGraph: {
    title: "News & Press | ProActiv Sports",
    description:
      "ProActiv Sports in leading family and lifestyle publications across Hong Kong and Singapore. Coverage coming soon.",
    url: "https://proactivsports.com/news",
    images: [{ url: "/news/opengraph-image", width: 1200, height: 630, alt: "ProActiv Sports — News & Press" }],
    siteName: "ProActiv Sports",
    locale: "en_GB",
    type: "website",
  },
  alternates: { canonical: "https://proactivsports.com/news" },
};

export default function NewsPage() {
  const hkUrl = process.env.NEXT_PUBLIC_HK_URL ?? "/?__market=hk";
  const sgUrl = process.env.NEXT_PUBLIC_SG_URL ?? "/?__market=sg";

  return (
    <>
      {/* Hero */}
      <Section size="md">
        <ContainerEditorial width="default">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-display font-display text-foreground">News &amp; Press</h1>
            <p className="text-body-lg text-muted-foreground mt-6">
              ProActiv Sports has been featured in leading family and lifestyle publications across Hong Kong and Singapore. Coverage coming soon — sign up below to be notified when we publish press highlights.
            </p>
          </div>
        </ContainerEditorial>
      </Section>

      {/* Empty state + signup */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="default">
          {newsItems.length === 0 ? (
            <Card className="p-8 lg:p-12 text-center max-w-2xl mx-auto">
              <Newspaper className="size-12 text-muted-foreground mx-auto" aria-hidden="true" />
              <h2 className="text-h3 font-display mt-4">Coverage coming soon.</h2>
              <p className="text-body text-muted-foreground mt-2">
                We&apos;ve been featured in family and lifestyle publications across Hong Kong and Singapore. Sign up below and we&apos;ll let you know when we publish press highlights.
              </p>
              <div className="mt-8">
                <NewsSignupForm />
              </div>
            </Card>
          ) : (
            // Phase 6 will render <NewsList items={newsItems} /> here. Phase 3 ships empty-state only.
            <ul className="space-y-4 max-w-3xl mx-auto">
              {newsItems.map((item) => (
                <li key={item.url}>
                  <Card className="p-4">
                    <p className="text-small text-muted-foreground">{item.outlet} · {item.date}</p>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-h3 font-display hover:text-brand-red">
                      {item.headline}
                    </a>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </ContainerEditorial>
      </Section>

      {/* Footer CTA — dual market */}
      <Section size="sm" bg="cream">
        <ContainerEditorial width="default">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-h2 font-display text-foreground">Ready to see ProActiv in action?</h2>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <Button asChild size="touch" variant="default">
                <a href={hkUrl}>Enter Hong Kong →</a>
              </Button>
              <Button asChild size="touch" variant="default">
                <a href={sgUrl}>Enter Singapore →</a>
              </Button>
            </div>
          </div>
        </ContainerEditorial>
      </Section>
    </>
  );
}

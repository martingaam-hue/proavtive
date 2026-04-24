// Phase 4 / Plan 04-06 — School partnerships page (HK-07).
// Placeholder partner-school cards (text fallback — no LogoWall since placeholder logo files
// are not yet in public/photography/). Three programme options + Send an Enquiry CTA.
// NO per-route OG — inherits HK layout default (Pitfall 5 budget).

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Trophy, School } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "School Partnerships Hong Kong — ProGym for International Schools",
  description:
    "ProGym Hong Kong partners with international schools to deliver gymnastics and sports programmes — curriculum support, inter-school events, and after-school clubs.",
  openGraph: {
    title: "School Partnerships — ProActiv Sports Hong Kong",
    description:
      "ProGym partners with international schools to deliver gymnastics and sports programmes in Hong Kong.",
    url: "https://hk.proactivsports.com/school-partnerships/",
    siteName: "ProActiv Sports Hong Kong",
    locale: "en_HK",
    type: "website",
  },
  alternates: { canonical: "https://hk.proactivsports.com/school-partnerships/" },
};

// Placeholder partner schools — text fallback per plan (LogoWall primitive requires real
// image files; placeholder logo assets not yet staged in public/photography/).
// Phase 6 replaces with Sanity-driven schoolPartner documents carrying real logos.
const PARTNER_SCHOOLS = [
  { name: "International School A", note: "Gymnastics curriculum + after-school clubs" },
  { name: "International School B", note: "Sports enrichment programme" },
  { name: "International School C", note: "Inter-school gymnastics events" },
  { name: "International School D", note: "Early-years movement programme" },
] as const;

const PROGRAMME_OPTIONS = [
  {
    icon: BookOpen,
    title: "Curriculum support",
    body: "We deliver structured gymnastics sessions during school hours, aligned to each school's PE curriculum and age-appropriate apparatus standards.",
  },
  {
    icon: Trophy,
    title: "Inter-school events",
    body: "ProGym hosts friendly inter-school gymnastics meets at both Wan Chai and Cyberport, plus competitive pathways for advanced students.",
  },
  {
    icon: School,
    title: "After-school programmes",
    body: "Weekly coach-led clubs on school premises or at ProGym, from age 4 through 16 — terms priced per block, with transport coordination available.",
  },
] as const;

export default function SchoolPartnershipsPage() {
  return (
    <>
      {/* Hero */}
      <Section size="lg" bg="default">
        <ContainerEditorial width="wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h1 className="text-display font-display text-foreground">
                School partnerships in Hong Kong.
              </h1>
              <p className="text-body-lg text-muted-foreground mt-6">
                ProGym partners with international schools across Hong Kong Island to deliver
                gymnastics and sports programmes — curriculum support during school hours, after-
                school clubs, and inter-school events. Every programme runs to the same coaching
                standard as our weekly classes.
              </p>
              <div className="mt-8">
                <Button
                  asChild
                  size="touch"
                  className="bg-brand-red text-white hover:bg-brand-red/90"
                >
                  <Link href="/contact?market=hk&subject=School%20Partnership">
                    Send an Enquiry <ArrowRight className="ml-2 size-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/photography/programme-beginner.webp"
                alt="Children in a school gymnastics programme at ProGym Hong Kong"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </ContainerEditorial>
      </Section>

      {/* Partner schools (placeholder text cards) */}
      <Section size="md" bg="muted">
        <ContainerEditorial width="wide">
          <h2 className="text-h2 font-display text-foreground mb-3">Partner schools</h2>
          <p className="text-body text-muted-foreground mb-8 max-w-2xl">
            We work with a range of Hong Kong international schools. Real logos and case studies
            will appear here as partnerships are confirmed for publication.
          </p>
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PARTNER_SCHOOLS.map((school) => (
              <li key={school.name}>
                <Card className="p-5 h-full">
                  <Badge variant="outline" className="mb-3">Partner</Badge>
                  <h3 className="text-h3 font-display text-foreground">{school.name}</h3>
                  <p className="text-small text-muted-foreground mt-2">{school.note}</p>
                </Card>
              </li>
            ))}
          </ul>
        </ContainerEditorial>
      </Section>

      {/* Programme options */}
      <Section size="md" bg="default">
        <ContainerEditorial width="wide">
          <h2 className="text-h2 font-display text-foreground mb-8">Programme options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROGRAMME_OPTIONS.map((opt) => (
              <Card key={opt.title} className="p-6 lg:p-8">
                <CardHeader className="p-0 pb-3">
                  <opt.icon className="size-8 text-brand-red" aria-hidden />
                  <h3 className="text-h3 font-display text-foreground mt-3">{opt.title}</h3>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-body text-muted-foreground">{opt.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ContainerEditorial>
      </Section>

      {/* CTA */}
      <Section size="lg" bg="navy">
        <ContainerEditorial width="default">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-h2 font-display text-white mb-4">
              Talking to us about a school programme?
            </h2>
            <p className="text-body-lg text-brand-cream mb-8">
              We tailor every partnership to the school&apos;s age range, curriculum, and
              timetable. Tell us a bit about your school and we&apos;ll be in touch.
            </p>
            <Button
              asChild
              size="touch"
              className="bg-brand-red text-white hover:bg-brand-red/90"
            >
              <Link href="/contact?market=hk&subject=School%20Partnership">Send an Enquiry</Link>
            </Button>
          </div>
        </ContainerEditorial>
      </Section>
    </>
  );
}

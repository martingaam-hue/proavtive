// Phase 2 / Plan 02-06 — /_design/ gallery page per UI-SPEC §4.
// D-09: production lockout via VERCEL_ENV check + notFound().
// Additional belt-and-braces: metadata.robots.index=false, Phase 0 X-Robots-Tag
// already applied on non-production by next.config.ts.
// D-08: single scrollable page — all primitives in one route.
// D-05 (amended): one example per primitive. OFL placeholder imagery (Singapore) is explicitly allowed
// in Phase 2 — marked inline as a Phase 5 replacement target.

import Image from "next/image";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { FAQItem } from "@/components/ui/faq-item";
import { MarketCard } from "@/components/ui/market-card";
import { ProgrammeTile } from "@/components/ui/programme-tile";
import { Section } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import { StatStrip } from "@/components/ui/stat-strip";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { VideoPlayer } from "@/components/ui/video-player";

export const dynamic = "force-static";

// Brand palette swatches — hex values are LABELS (rendered as visible text), not applied styles.
// Applied backgrounds use `bg-brand-*` utilities per Pillar 2 (token-only rule).
// Text labels render BELOW the color block (on the neutral section background) so WCAG AA
// contrast is preserved even for brand Red/Green/Sky whose white text fails 4.5:1 on white.
const BRAND_SWATCHES = [
  { name: "Navy", hex: "#0f206c", cls: "bg-brand-navy", role: "primary" },
  { name: "Red", hex: "#ec1c24", cls: "bg-brand-red", role: "destructive" },
  { name: "Green", hex: "#0f9733", cls: "bg-brand-green", role: "—" },
  { name: "Sky", hex: "#0fa0e2", cls: "bg-brand-sky", role: "—" },
  { name: "Yellow", hex: "#fac049", cls: "bg-brand-yellow", role: "secondary" },
  { name: "Cream", hex: "#fff3dd", cls: "bg-brand-cream", role: "accent/muted" },
  {
    name: "White",
    hex: "#ffffff",
    cls: "bg-white border border-border",
    role: "background",
  },
] as const;

const SPACING_STEPS = [4, 8, 16, 24, 32, 48, 64, 96, 128] as const;

const STAT_SAMPLE = [
  { value: "14", label: "Years coaching" },
  { value: "3", label: "Venues across HK & SG" },
  { value: "3,500+", label: "Children trained" },
] as const;

const BUILD_SHA = process.env.VERCEL_GIT_COMMIT_SHA ?? "local";
const BUILD_DATE = new Date().toISOString().slice(0, 10);

export default function DesignGallery() {
  // D-09 — production lockout
  if (process.env.VERCEL_ENV === "production") {
    notFound();
  }

  return (
    <main>
      {/* ─── Page heading ──────────────────────────────────────────────── */}
      <Section size="sm">
        <ContainerEditorial width="wide">
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-primary lg:text-[3.5rem]">
            Phase 2 Design System — Gallery
          </h1>
          <p className="mt-4 font-sans text-lg leading-relaxed text-muted-foreground">
            Every Phase 2 primitive rendered once against real ProActiv photography. Internal — not
            a production surface.
          </p>
        </ContainerEditorial>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          § FOUNDATION
          ═══════════════════════════════════════════════════════════════════ */}
      <Section id="foundation" size="md" bg="muted">
        <ContainerEditorial width="wide">
          <h2 className="font-display text-2xl font-bold leading-snug tracking-tight lg:text-4xl">
            Foundation
          </h2>

          {/* Colors — full-bleed swatches per UI-SPEC §4.5 + §7.3 */}
          <div id="colors" className="mt-12">
            <h3 className="font-display text-xl font-semibold text-primary lg:text-2xl">Colors</h3>
            <p className="mt-2 font-sans text-base leading-relaxed text-muted-foreground">
              Seven brand tokens mapped to shadcn semantic variables. Contrast audit per UI-SPEC
              §1.3.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
              {BRAND_SWATCHES.map((c) => (
                <div key={c.hex} className="flex flex-col">
                  <div className={`${c.cls} aspect-square rounded-lg`} aria-hidden="true" />
                  <p className="mt-3 font-display text-lg font-bold text-primary">{c.name}</p>
                  <p className="font-sans text-xs text-muted-foreground">{c.hex}</p>
                  <p className="font-sans text-xs text-muted-foreground">{c.role}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 font-sans text-xs leading-relaxed text-muted-foreground">
              Contrast rule (UI-SPEC §1.3): yellow is never used as text on white. Navy-on-white
              reads at 14.55:1; yellow-on-navy at 8.80:1. White-on-navy for CTA labels hits 14.55:1.
            </p>
          </div>

          {/* Typography — left-aligned full-width samples per UI-SPEC §4.5 */}
          <div id="typography" className="mt-16">
            <h3 className="font-display text-xl font-semibold text-primary lg:text-2xl">
              Typography
            </h3>
            <p className="mt-2 font-sans text-base leading-relaxed text-muted-foreground">
              Unbounded for display and headlines (D-01 amended). Manrope for body. Baloo 2 scoped
              to ProGym contexts only (D-03 — Phase 4 activation).
            </p>
            <dl className="mt-6 space-y-6">
              <div>
                <dt className="font-sans text-xs uppercase tracking-wide text-muted-foreground">
                  display · Unbounded Bold · 88px desktop
                </dt>
                <dd className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-primary lg:text-[5.5rem]">
                  The confident headline
                </dd>
              </div>
              <div>
                <dt className="font-sans text-xs uppercase tracking-wide text-muted-foreground">
                  h1 · Unbounded Bold · 56px desktop
                </dt>
                <dd className="font-display text-4xl font-bold leading-tight tracking-tight text-primary lg:text-[3.5rem]">
                  Page-level heading
                </dd>
              </div>
              <div>
                <dt className="font-sans text-xs uppercase tracking-wide text-muted-foreground">
                  h2 · Unbounded Bold · 36px desktop
                </dt>
                <dd className="font-display text-2xl font-bold leading-snug tracking-tight text-primary lg:text-4xl">
                  Section heading
                </dd>
              </div>
              <div>
                <dt className="font-sans text-xs uppercase tracking-wide text-muted-foreground">
                  h3 · Unbounded Semibold · 24px desktop
                </dt>
                <dd className="font-display text-xl font-semibold leading-snug text-primary lg:text-2xl">
                  Subsection heading
                </dd>
              </div>
              <div>
                <dt className="font-sans text-xs uppercase tracking-wide text-muted-foreground">
                  body-lg · Manrope · 18px
                </dt>
                <dd className="font-sans text-lg leading-relaxed text-primary">
                  Larger body copy for pull quotes and lead paragraphs.
                </dd>
              </div>
              <div>
                <dt className="font-sans text-xs uppercase tracking-wide text-muted-foreground">
                  body · Manrope · 16px
                </dt>
                <dd className="font-sans text-base leading-relaxed text-primary">
                  Default body copy for paragraphs, descriptions, and longform content.
                </dd>
              </div>
              <div>
                <dt className="font-sans text-xs uppercase tracking-wide text-muted-foreground">
                  accent · Baloo 2 · 18px (ProGym-scoped, D-03)
                </dt>
                <dd className="font-accent text-lg font-medium leading-relaxed text-primary">
                  Baloo 2 — reserved for ProGym HK contexts from Phase 4 onwards.
                </dd>
              </div>
            </dl>
          </div>

          {/* Spacing — horizontal bars scaled by pixel value */}
          <div id="spacing" className="mt-16">
            <h3 className="font-display text-xl font-semibold text-primary lg:text-2xl">Spacing</h3>
            <p className="mt-2 font-sans text-base leading-relaxed text-muted-foreground">
              Section rhythm uses tokens{" "}
              <code className="font-sans text-sm">--spacing-section-sm</code>
              {" / "}
              <code className="font-sans text-sm">-md</code>
              {" / "}
              <code className="font-sans text-sm">-lg</code> (64 / 96 / 128 px).
            </p>
            <div className="mt-6 space-y-2">
              {SPACING_STEPS.map((px) => (
                <div key={px} className="flex items-center gap-4">
                  <span className="w-20 font-sans text-sm text-muted-foreground">{px}px</span>
                  <div
                    className="h-2 rounded-full bg-brand-navy"
                    style={{ width: `${px}px` }}
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Radius & Shadow tiles */}
          <div id="radius-shadow" className="mt-16">
            <h3 className="font-display text-xl font-semibold text-primary lg:text-2xl">
              Radius &amp; Shadow
            </h3>
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex size-20 items-end justify-center rounded-sm border border-border bg-brand-cream p-2">
                <span className="font-sans text-xs">sm</span>
              </div>
              <div className="flex size-20 items-end justify-center rounded-md border border-border bg-brand-cream p-2">
                <span className="font-sans text-xs">md</span>
              </div>
              <div className="flex size-20 items-end justify-center rounded-lg border border-border bg-brand-cream p-2">
                <span className="font-sans text-xs">lg</span>
              </div>
              <div className="flex size-20 items-end justify-center rounded-xl border border-border bg-brand-cream p-2">
                <span className="font-sans text-xs">xl</span>
              </div>
              <div className="flex size-20 items-end justify-center rounded-2xl border border-border bg-brand-cream p-2">
                <span className="font-sans text-xs">2xl</span>
              </div>
              <div className="flex size-20 items-end justify-center rounded-full border border-border bg-brand-cream p-2">
                <span className="font-sans text-xs">full</span>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-6">
              <div className="flex size-20 items-end justify-center rounded-lg bg-white p-2 shadow-sm">
                <span className="font-sans text-xs">shadow-sm</span>
              </div>
              <div className="flex size-20 items-end justify-center rounded-lg bg-white p-2 shadow-md">
                <span className="font-sans text-xs">shadow-md</span>
              </div>
              <div className="flex size-20 items-end justify-center rounded-lg bg-white p-2 shadow-lg">
                <span className="font-sans text-xs">shadow-lg</span>
              </div>
              <div className="flex size-20 items-end justify-center rounded-lg bg-white p-2 shadow-xl">
                <span className="font-sans text-xs">shadow-xl</span>
              </div>
            </div>
          </div>
        </ContainerEditorial>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          § PRIMITIVES (editorial-asymmetry: 12-col grid, 8/4 alternating)
          ═══════════════════════════════════════════════════════════════════ */}
      <Section id="primitives" size="md">
        <ContainerEditorial width="wide">
          <h2 className="font-display text-2xl font-bold leading-snug tracking-tight lg:text-4xl">
            Primitives
          </h2>
          <p className="mt-2 font-sans text-base leading-relaxed text-muted-foreground">
            Six stock primitives. One example each — variant matrices deferred per D-05. Marketing
            CTAs use <code className="font-sans text-sm">size=&quot;touch&quot;</code> (44px hit
            area, WCAG 2.2 AA) per UI-SPEC §3.1 FLAG-3.
          </p>

          {/* Button */}
          <div id="button" className="mt-16 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h3 className="font-display text-xl font-semibold text-primary lg:text-2xl">
                Button
              </h3>
              <p className="mt-2 font-sans text-base leading-relaxed text-muted-foreground">
                Marketing CTAs must use{" "}
                <code className="font-sans text-sm">size=&quot;touch&quot;</code> — recommended
                default for every public-facing button from Phase 3 onward.
              </p>
              <div className="mt-6 space-y-6">
                <div>
                  <p className="mb-2 font-sans text-xs uppercase tracking-wide text-muted-foreground">
                    size=&quot;touch&quot; — recommended default for marketing CTAs
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button size="touch">Book a free trial</Button>
                    <Button size="touch" variant="secondary">
                      Enquire
                    </Button>
                    <Button size="touch" variant="ghost">
                      WhatsApp us
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-sans text-xs uppercase tracking-wide text-muted-foreground">
                    variant gallery (default size)
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button>Book a free trial</Button>
                    <Button variant="secondary">Enquire</Button>
                    <Button variant="ghost">WhatsApp us</Button>
                    <Button variant="destructive">Delete enquiry</Button>
                    <Button variant="outline">Learn more</Button>
                    <Button variant="link">Read the coaching philosophy</Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4">
              <details className="rounded-lg border border-border bg-muted/50 p-4">
                <summary className="cursor-pointer font-sans text-sm font-medium text-primary">
                  Props
                </summary>
                <ul className="mt-3 space-y-1 font-sans text-sm text-muted-foreground">
                  <li>
                    <code>variant</code>: default | secondary | ghost | destructive | outline | link
                  </li>
                  <li>
                    <code>size</code>: default | xs | sm | lg | <strong>touch</strong> | icon*
                  </li>
                  <li>
                    <code>asChild</code>: boolean (Radix Slot)
                  </li>
                </ul>
              </details>
            </div>
          </div>

          {/* Card — mirror (metadata left, example right) for asymmetric variety */}
          <div id="card" className="mt-16 grid gap-8 lg:grid-cols-12">
            <div className="lg:order-1 lg:col-span-4">
              <h3 className="font-display text-xl font-semibold text-primary lg:text-2xl">Card</h3>
              <p className="mt-2 font-sans text-base leading-relaxed text-muted-foreground">
                Neutral container with header + content + optional footer. Named sub-exports compose
                to support asymmetric layouts without introducing a second primitive.
              </p>
              <details className="mt-4 rounded-lg border border-border bg-muted/50 p-4">
                <summary className="cursor-pointer font-sans text-sm font-medium text-primary">
                  Props
                </summary>
                <ul className="mt-3 space-y-1 font-sans text-sm text-muted-foreground">
                  <li>
                    <code>size</code>: default | sm
                  </li>
                  <li>
                    Sub-exports: CardHeader · CardTitle · CardDescription · CardContent · CardFooter
                    · CardAction
                  </li>
                </ul>
              </details>
            </div>
            <div className="lg:order-2 lg:col-span-8">
              <Card>
                <CardHeader>
                  <CardTitle>Toddler gymnastics</CardTitle>
                  <CardDescription>Wan Chai · weekly · 12 months – 3 years</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-sans text-base leading-relaxed text-muted-foreground">
                    Parent-and-child classes building confidence, balance, and joy of movement from
                    the earliest age. Small groups, coach-led, no pressure.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="link">View the programme</Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Accordion / FAQItem */}
          <div id="accordion" className="mt-16 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h3 className="font-display text-xl font-semibold text-primary lg:text-2xl">
                Accordion / FAQItem
              </h3>
              <p className="mt-2 font-sans text-base leading-relaxed text-muted-foreground">
                FAQItem composes Radix Accordion with display-font question + body-font answer.
                JSON-LD hooks via <code className="font-sans text-sm">data-question</code> /{" "}
                <code className="font-sans text-sm">data-answer</code> (Phase 7 SEO).
              </p>
              <div className="mt-6 rounded-lg border border-border bg-background p-6">
                <FAQItem
                  question="What should my child wear?"
                  answer="Comfortable athletic wear they can move freely in — leotards, leggings, or t-shirt and shorts. No shoes on the gym floor. Long hair tied back. We'll take care of the rest."
                  defaultOpen
                />
              </div>
            </div>
            <div className="lg:col-span-4">
              <details className="rounded-lg border border-border bg-muted/50 p-4">
                <summary className="cursor-pointer font-sans text-sm font-medium text-primary">
                  Props
                </summary>
                <ul className="mt-3 space-y-1 font-sans text-sm text-muted-foreground">
                  <li>
                    <code>question</code>: string (display-font h3 role)
                  </li>
                  <li>
                    <code>answer</code>: string | ReactNode
                  </li>
                  <li>
                    <code>defaultOpen</code>: boolean
                  </li>
                </ul>
              </details>
            </div>
          </div>

          {/* Badge — mirror */}
          <div id="badge" className="mt-16 grid gap-8 lg:grid-cols-12">
            <div className="lg:order-1 lg:col-span-4">
              <h3 className="font-display text-xl font-semibold text-primary lg:text-2xl">Badge</h3>
              <p className="mt-2 font-sans text-base leading-relaxed text-muted-foreground">
                Inline meta pills for age bands, market labels, and callouts. Yellow-on-navy
                (secondary) passes 8.80:1 contrast for age ranges.
              </p>
              <details className="mt-4 rounded-lg border border-border bg-muted/50 p-4">
                <summary className="cursor-pointer font-sans text-sm font-medium text-primary">
                  Props
                </summary>
                <ul className="mt-3 space-y-1 font-sans text-sm text-muted-foreground">
                  <li>
                    <code>variant</code>: default | secondary | destructive | outline | ghost | link
                  </li>
                </ul>
              </details>
            </div>
            <div className="lg:order-2 lg:col-span-8">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary">Ages 4–6</Badge>
                <Badge>Featured</Badge>
                <Badge variant="destructive">New</Badge>
                <Badge variant="outline">Wan Chai</Badge>
              </div>
            </div>
          </div>

          {/* Avatar */}
          <div id="avatar" className="mt-16 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h3 className="font-display text-xl font-semibold text-primary lg:text-2xl">
                Avatar
              </h3>
              <p className="mt-2 font-sans text-base leading-relaxed text-muted-foreground">
                Coach and parent portraits. Fallback initials render if image is absent or fails to
                load. Uses Radix Avatar primitive under the hood.
              </p>
              <div className="mt-6 flex items-center gap-6">
                <div>
                  <Avatar size="lg">
                    <AvatarImage
                      src="/photography/testimonial-family-scene.jpg"
                      alt="Monica Hui, Director of Sports (Hong Kong)"
                    />
                    <AvatarFallback>MH</AvatarFallback>
                  </Avatar>
                  <p className="mt-2 font-sans text-xs text-muted-foreground">image + fallback</p>
                </div>
                <div>
                  <Avatar size="lg">
                    <AvatarFallback>MH</AvatarFallback>
                  </Avatar>
                  <p className="mt-2 font-sans text-xs text-muted-foreground">fallback only</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4">
              <details className="rounded-lg border border-border bg-muted/50 p-4">
                <summary className="cursor-pointer font-sans text-sm font-medium text-primary">
                  Props
                </summary>
                <ul className="mt-3 space-y-1 font-sans text-sm text-muted-foreground">
                  <li>
                    <code>size</code>: default | sm | lg
                  </li>
                  <li>
                    Sub-exports: AvatarImage · AvatarFallback · AvatarGroup · AvatarGroupCount ·
                    AvatarBadge
                  </li>
                </ul>
              </details>
            </div>
          </div>

          {/* Separator — mirror */}
          <div id="separator" className="mt-16 grid gap-8 lg:grid-cols-12">
            <div className="lg:order-1 lg:col-span-4">
              <h3 className="font-display text-xl font-semibold text-primary lg:text-2xl">
                Separator
              </h3>
              <p className="mt-2 font-sans text-base leading-relaxed text-muted-foreground">
                Horizontal and vertical dividers. Decorative by default — screen readers skip unless{" "}
                <code className="font-sans text-sm">decorative=false</code>.
              </p>
              <details className="mt-4 rounded-lg border border-border bg-muted/50 p-4">
                <summary className="cursor-pointer font-sans text-sm font-medium text-primary">
                  Props
                </summary>
                <ul className="mt-3 space-y-1 font-sans text-sm text-muted-foreground">
                  <li>
                    <code>orientation</code>: horizontal | vertical
                  </li>
                  <li>
                    <code>decorative</code>: boolean (default: true)
                  </li>
                </ul>
              </details>
            </div>
            <div className="lg:order-2 lg:col-span-8">
              <div className="space-y-6 rounded-lg border border-border p-6">
                <div>
                  <p className="font-sans text-sm text-muted-foreground">
                    Above the horizontal separator
                  </p>
                  <Separator className="my-3" />
                  <p className="font-sans text-sm text-muted-foreground">
                    Below the horizontal separator
                  </p>
                </div>
                <div className="flex h-12 items-center gap-4">
                  <span className="font-sans text-sm text-muted-foreground">Left</span>
                  <Separator orientation="vertical" className="h-8" />
                  <span className="font-sans text-sm text-muted-foreground">Right</span>
                </div>
              </div>
            </div>
          </div>
        </ContainerEditorial>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          § PATTERNS (realistic page-context widths, not thumbnails — §7.3)
          ═══════════════════════════════════════════════════════════════════ */}
      <Section id="patterns" size="md" bg="muted">
        <ContainerEditorial width="wide">
          <h2 className="font-display text-2xl font-bold leading-snug tracking-tight lg:text-4xl">
            Patterns
          </h2>
          <p className="mt-2 font-sans text-base leading-relaxed text-muted-foreground">
            Brand-custom compositions. Each rendered at real page width so the asymmetric layout
            intent reads correctly (UI-SPEC §7.3 editorial-asymmetry guardrail).
          </p>

          {/* MarketCard — 2 side-by-side at realistic root-gateway width */}
          <div id="marketcard" className="mt-16">
            <h3 className="font-display text-xl font-semibold text-primary lg:text-2xl">
              MarketCard
            </h3>
            <p className="mt-2 font-sans text-base leading-relaxed text-muted-foreground">
              Root gateway pair — Hong Kong + Singapore. Full-bleed photo + navy gradient overlay +
              display-size market label. Phase 3 root composes these two at{" "}
              <code className="font-sans text-sm">proactivsports.com</code>.
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <MarketCard
                market="hk"
                label="Hong Kong"
                tagline="ProGym Wan Chai & Cyberport"
                href="#"
                imageSrc="/photography/hero-gateway-drone.jpg"
                imageAlt="Children in a gymnastics class at ProGym Wan Chai"
                priority
              />
              <MarketCard
                market="sg"
                label="Singapore"
                tagline="Prodigy @ Katong Point — Singapore's only MultiBall wall"
                href="#"
                imageSrc="/photography/sg-placeholder-climbing-unsplash-trinks.jpg"
                imageAlt="A coach guiding a child on the MultiBall wall at Prodigy Katong"
              />
            </div>
            <p className="mt-3 font-sans text-xs text-muted-foreground">
              SG imagery uses OFL placeholder (Unsplash, David Trinks — license-compliant) per D-05
              + D-07 amendment. Real Prodigy Katong photography is a Phase 5 replacement target.
            </p>
          </div>

          {/* ProgrammeTile — single instance */}
          <div id="programme-tile" className="mt-16 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h3 className="font-display text-xl font-semibold text-primary lg:text-2xl">
                ProgrammeTile
              </h3>
              <p className="mt-2 font-sans text-base leading-relaxed text-muted-foreground">
                Used by HK <code className="font-sans text-sm">/gymnastics/</code> pillar + SG{" "}
                <code className="font-sans text-sm">/weekly-classes/</code>. Age band badge
                (yellow-on-navy, 8.80:1 contrast), photo-over-card frame, title turns red on hover.
              </p>
            </div>
            <div className="lg:col-span-5">
              <ProgrammeTile
                title="Toddler gymnastics"
                ageRange="12 months – 3 years"
                description="Parent-and-child classes building confidence, balance, and joy of movement from the earliest age."
                imageSrc="/photography/programme-beginner.jpg"
                imageAlt="Parent and toddler on a soft beam at ProGym Wan Chai"
                href="#"
                duration="45 min · weekly"
              />
            </div>
          </div>

          {/* TestimonialCard — default + pullquote variants */}
          <div id="testimonial-card" className="mt-16">
            <h3 className="font-display text-xl font-semibold text-primary lg:text-2xl">
              TestimonialCard
            </h3>
            <p className="mt-2 font-sans text-base leading-relaxed text-muted-foreground">
              Two variants. <em>default</em>: cream card with Quote icon + Avatar footer.
              <em> pullquote</em>: no chrome, yellow left-border, display-size navy quote (for
              in-flow editorial breaks).
            </p>
            <div className="mt-6 grid gap-8 lg:grid-cols-2">
              <TestimonialCard
                quote="We tried three other schools before ProActiv. Monica and the team saw my daughter for who she is — that's the difference."
                author="Sarah W."
                authorRole="Parent · Hong Kong"
              />
              <TestimonialCard
                variant="pullquote"
                quote="We tried three other schools before ProActiv. Monica and the team saw my daughter for who she is — that's the difference."
                author="Sarah W."
                authorRole="Parent · Hong Kong"
              />
            </div>
          </div>

          {/* StatStrip */}
          <div id="stat-strip" className="mt-16">
            <h3 className="font-display text-xl font-semibold text-primary lg:text-2xl">
              StatStrip
            </h3>
            <p className="mt-2 font-sans text-base leading-relaxed text-muted-foreground">
              Horizontal KPI row with display-size numbers + uppercase labels. Vertical separators
              on desktop. Static in Phase 2 — count-up animation deferred to Phase 3+.
            </p>
            <div className="mt-6 rounded-xl bg-background px-8">
              <StatStrip stats={STAT_SAMPLE} />
            </div>
          </div>

          {/* LogoWall — text-placeholder fallback per UI-SPEC §6.1 */}
          <div id="logo-wall" className="mt-16">
            <h3 className="font-display text-xl font-semibold text-primary lg:text-2xl">
              LogoWall
            </h3>
            <p className="mt-2 font-sans text-base leading-relaxed text-muted-foreground">
              Grayscale-to-colour-on-hover partner logos. Grid variant (2-col mobile / 4-col
              desktop) or row variant (horizontal scroll).
            </p>
            <div className="mt-6 rounded-lg border border-dashed border-border bg-background p-8 font-sans text-sm leading-relaxed text-muted-foreground">
              <p className="font-medium text-primary">
                Partner logos pending — Martin provisions SVGs at <code>public/logos/*.svg</code>
              </p>
              <p className="mt-2">
                HUMAN-ACTION precondition analogous to D-02 fonts. Rendering the primitive with
                empty
                <code className="mx-1">logos</code> array would produce broken image tiles;
                rendering it with fabricated names would violate the &ldquo;one real example per
                primitive&rdquo; (D-05) done-bar. See UI-SPEC §6.1 LogoWall note. Phase 3 adds real
                partner SVGs.
              </p>
            </div>
          </div>

          {/* Section — bg variants side-by-side */}
          <div id="section" className="mt-16">
            <h3 className="font-display text-xl font-semibold text-primary lg:text-2xl">Section</h3>
            <p className="mt-2 font-sans text-base leading-relaxed text-muted-foreground">
              Semantic layout wrapper. <code className="font-sans text-sm">size</code> maps to
              section-spacing tokens (64 / 96 / 128 px).{" "}
              <code className="font-sans text-sm">bg</code> cycles background surface colours.
            </p>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <Section as="div" size="sm" bg="default" className="rounded-lg border border-border">
                <ContainerEditorial>
                  <p className="font-sans text-sm text-primary">bg=&quot;default&quot;</p>
                </ContainerEditorial>
              </Section>
              <Section as="div" size="sm" bg="muted" className="rounded-lg">
                <ContainerEditorial>
                  <p className="font-sans text-sm text-primary">bg=&quot;muted&quot;</p>
                </ContainerEditorial>
              </Section>
              <Section as="div" size="sm" bg="navy" className="rounded-lg">
                <ContainerEditorial>
                  <p className="font-sans text-sm text-white">bg=&quot;navy&quot;</p>
                </ContainerEditorial>
              </Section>
            </div>
          </div>

          {/* ContainerEditorial — all 3 widths stacked with visible boundary */}
          <div id="container-editorial" className="mt-16">
            <h3 className="font-display text-xl font-semibold text-primary lg:text-2xl">
              ContainerEditorial
            </h3>
            <p className="mt-2 font-sans text-base leading-relaxed text-muted-foreground">
              Width-constrained wrapper. Does NOT force centred content — children compose
              asymmetrically inside. Three widths: narrow (672px) / default (1152px) / wide
              (1280px).
            </p>
            <div className="mt-6 space-y-3">
              <ContainerEditorial
                width="narrow"
                className="rounded-lg border border-dashed border-border bg-background py-4"
              >
                <p className="font-sans text-sm text-primary">
                  width=&quot;narrow&quot; · max-w-2xl · 672px — blog reading column
                </p>
              </ContainerEditorial>
              <ContainerEditorial
                width="default"
                className="rounded-lg border border-dashed border-border bg-background py-4"
              >
                <p className="font-sans text-sm text-primary">
                  width=&quot;default&quot; · max-w-6xl · 1152px — standard page content
                </p>
              </ContainerEditorial>
              <ContainerEditorial
                width="wide"
                className="rounded-lg border border-dashed border-border bg-background py-4"
              >
                <p className="font-sans text-sm text-primary">
                  width=&quot;wide&quot; · max-w-7xl · 1280px — hero / full-bleed
                </p>
              </ContainerEditorial>
            </div>
          </div>
        </ContainerEditorial>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
          § MEDIA
          ═══════════════════════════════════════════════════════════════════ */}
      <Section id="media" size="md">
        <ContainerEditorial width="wide">
          <h2 className="font-display text-2xl font-bold leading-snug tracking-tight lg:text-4xl">
            Media
          </h2>

          {/* Image contract — code sample + live instance */}
          <div id="image" className="mt-12 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h3 className="font-display text-xl font-semibold text-primary lg:text-2xl">
                &lt;Image&gt; contract
              </h3>
              <p className="mt-2 font-sans text-base leading-relaxed text-muted-foreground">
                Every image uses <code className="font-sans text-sm">next/image</code> with explicit{" "}
                <code className="font-sans text-sm">sizes</code> to activate Vercel&apos;s AVIF/WebP
                negotiation. Above-the-fold images set{" "}
                <code className="font-sans text-sm">priority</code> +{" "}
                <code className="font-sans text-sm">fetchPriority=&quot;high&quot;</code>.
                Below-the-fold images lazy-load by default.
              </p>
              <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-muted/60 p-4 font-sans text-xs leading-relaxed text-primary">
                {`<Image
  src="/photography/{slug}.jpg"
  alt="Descriptive alt text"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  priority          // hero only
  fetchPriority="high"
  className="object-cover"
/>`}
              </pre>
            </div>
            <div className="lg:col-span-7">
              <div className="relative aspect-video overflow-hidden rounded-xl border border-border">
                <Image
                  src="/photography/hk-venue-wanchai-gymtots.jpg"
                  alt="Children in a ProGym Wan Chai beginner gymnastics class"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 font-sans text-xs text-muted-foreground">
                Live <code>&lt;Image&gt;</code> instance ·{" "}
                <code>/photography/hk-venue-wanchai-gymtots.jpg</code> · AVIF/WebP/JPG served by
                negotiation.
              </p>
            </div>
          </div>

          {/* VideoPlayer — Mux demo */}
          <div id="video-player" className="mt-16">
            <h3 className="font-display text-xl font-semibold text-primary lg:text-2xl">
              VideoPlayer
            </h3>
            <p className="mt-2 font-sans text-base leading-relaxed text-muted-foreground">
              Wraps <code className="font-sans text-sm">@mux/mux-player-react</code> via
              <code className="font-sans text-sm"> dynamic({`{ ssr: false }`})</code> to avoid the{" "}
              <code className="font-sans text-sm">customElements.define()</code> hydration crash.
              Phase 2 uses Mux&apos;s public demo stream (D-06 placeholder). Real camp clips swap in
              at Phase 10.
            </p>
            <div className="mt-6">
              <VideoPlayer title="Mux demo stream — Phase 2 placeholder" />
            </div>
          </div>
        </ContainerEditorial>
      </Section>

      {/* ─── Footer · done bar ─────────────────────────────────────────── */}
      <Section size="sm" bg="navy">
        <ContainerEditorial width="wide">
          <p className="font-display text-xl font-semibold">Done bar</p>
          <p className="mt-4 font-sans text-base leading-relaxed text-brand-cream">
            This gallery proves every Phase 2 primitive against one real ProActiv photograph, passes
            keyboard navigation, and passes WCAG AA contrast (verified via Lighthouse accessibility
            audit ≥ 95). Variant matrices, state galleries, and Storybook-style documentation are
            deliberately deferred — Phase 3+ discovers variant needs from real page context.
          </p>
          <p className="mt-6 font-sans text-xs leading-relaxed text-brand-cream/80">
            Build: {BUILD_DATE} · SHA: {BUILD_SHA.slice(0, 7)}
          </p>
        </ContainerEditorial>
      </Section>
    </main>
  );
}

---
phase: 3
slug: root-gateway-and-supporting-root-pages
status: draft
shadcn_initialized: true
preset: style=radix-nova + base-color=neutral + css-variables=true + rsc=true + iconLibrary=lucide
created: 2026-04-23
requirements: [GW-01, GW-02, GW-03, GW-04, GW-05, GW-06, GW-07]
upstream_inputs:
  - 03-CONTEXT.md (D-01..D-11 locked)
  - 03-RESEARCH.md (10 topics, 8 pitfalls, validation architecture)
  - 02-UI-SPEC.md (Phase 2 token + primitive contract — Phase 3 inherits, does not redefine)
  - 02-CONTEXT.md (D-04 primitive split, D-06 video deferred, D-07 photo curation)
  - 01-CONTEXT.md (D-01 host>cookie>query ladder, D-02 host authority)
  - PROJECT.md (palette, typography, perf budget, anti-AI-SaaS)
  - REQUIREMENTS.md GW-01..GW-07
  - strategy.md §PART 3, §PART 6A, §PART 9.3, §PART 10.2, §PART 10.4, §PART 12 Tier 1 #13, §PART 14.3
---

# Phase 3 — UI Design Contract

> **Scope reminder:** Phase 3 is a *composition phase, not an invention phase*. Every section of the 8-section gateway homepage maps directly to an existing Phase 2 primitive (per RESEARCH Topic 1 section-to-primitive table). Phase 3 ships 7 root pages (gateway home + `/brand/`, `/coaching-philosophy/`, `/news/`, `/careers/`, `/contact/`, `/privacy/`, `/terms/`), a shared root layout (nav + footer + skip-link + base metadata), a Resend-backed contact route, and a single shared `createRootOgImage()` utility. Three Phase 3-local compositions land at `components/root/`: `LeadershipCard`, `RootNav`, `RootFooter`. **No new DS-level primitives** in `components/ui/`. **No new design tokens** in `app/globals.css` — Phase 3 consumes Phase 2's `@theme` exhaustively. This contract is binding on planner and executor; deviation requires a Rule 1 correction in the plan SUMMARY.

---

## 0. How this contract is used

| Consumer | What they pull from here |
|----------|--------------------------|
| `gsd-planner` | §3 section-by-section gateway map · §4 supporting page specs · §5 Phase 3-local component contracts · §6 contact form UX · §7 OG template · §8 metadata + a11y + perf · §11 decisions map |
| `gsd-executor` | §3 + §4 + §5 prop interfaces · §6 form spec · §7 OG signature · §10 copy verbatim · §11 decisions map |
| `gsd-ui-checker` | §9 six-pillar quality checklist · §13 editorial-asymmetry pass · §14 requirement traceability |
| `gsd-ui-auditor` | post-execute diff of `app/(root)/`, `app/api/contact/`, `components/root/`, `lib/og-image.tsx`, `app/(root)/layout.tsx` against this contract |

---

## 1. Inheritance from Phase 2 — what Phase 3 does NOT redefine

Phase 3 is binding on the inherited contract. Re-asking these would create drift.

| Inherited from Phase 2 | Where to find it | What Phase 3 does with it |
|------------------------|------------------|---------------------------|
| Brand palette (navy/red/green/sky/yellow/cream) as `--color-brand-*` | 02-UI-SPEC §1.2, §1.5 + `app/globals.css` `@theme { }` | Consumes via Tailwind utilities `bg-brand-navy`, `text-brand-cream`, etc. NEVER raw hex. |
| Semantic shadcn token mapping (`--primary` = navy, `--secondary` = yellow, `--accent` = cream, `--destructive` = red) | 02-UI-SPEC §1.4 | Consumes via `bg-primary`, `text-secondary-foreground`, etc. |
| Type scale (display 88 / h1 56 / h2 36 / h3 24 / body-lg 18 / body 16 / small 14 / label 14) | 02-UI-SPEC §1.6 | Consumes via `text-display`, `text-h1`, `text-body`, etc. NO new sizes. |
| Font stack — Bloc Bold (display), Mont (sans), Baloo (accent — ProGym ONLY) | 02-UI-SPEC §1.7 | Root gateway + ALL 6 supporting pages use `--font-display` + `--font-sans`. **Baloo is FORBIDDEN on root layer** (D-03 inheritance — Baloo activates in Phase 4 HK ProGym layouts only). |
| Spacing scale (4/8/16/24/32/48/64) + section rhythm (`section-sm`/`md`/`lg` = 64/96/128px) | 02-UI-SPEC §1.8 | Every section uses `<Section size="sm|md|lg">`. No raw `py-*` arbitrary values. |
| Radius scale (sm 6 / md 8 / lg 10 / xl 14 / 2xl 18 / full) | 02-UI-SPEC §1.9 | Cards = `rounded-lg`, hero surfaces = `rounded-xl`, full-bleed media = `rounded-2xl`, avatars = `rounded-full`. |
| Shadow scale (sm/md/lg) | 02-UI-SPEC §1.10 | Default Tailwind shadows. No new tinted shadows in Phase 3. |
| Phase 2 primitive inventory (Button, Card, Accordion, Badge, Avatar, Separator, MarketCard, ProgrammeTile, TestimonialCard, StatStrip, LogoWall, Section, ContainerEditorial, FAQItem, VideoPlayer, `<Image>` contract) | 02-UI-SPEC §3 | Composes per §3 section map. **VideoPlayer is NOT used in Phase 3** (D-09 inheritance — root hero is static photo). |
| Editorial asymmetry rules (avoid centred-hero gradient, purple/blue, identical 3-col features, ghost-CTA-as-primary; do alternate layouts, real photo, ≤300ms motion, big type) | 02-UI-SPEC §7 + strategy §14.3 | Binding on every Phase 3 section. See §13 below for Phase 3-specific application. |
| Cross-market handoff (absolute `<a href>` to `NEXT_PUBLIC_HK_URL` / `_SG_URL`; never `<Link>`; never set market cookie from root) | 03-CONTEXT.md `<code_context>` + Phase 1 D-02 | All cross-market CTAs throughout Phase 3 use this pattern. |

**Phase 3 does NOT introduce new tokens.** If a section appears to need one, the planner files a targeted Phase 2.1 revision — Phase 3 stays composition-pure.

---

## 2. Design System — Summary (template compatibility)

| Property | Value |
|----------|-------|
| Tool | shadcn/ui (already initialized Phase 1; Phase 2 added 5 stock + 7 custom primitives; Phase 3 adds NONE in `components/ui/`) |
| Preset | `style=radix-nova`, `baseColor=neutral`, `cssVariables=true`, `rsc=true`, `iconLibrary=lucide` (inherited; do NOT re-init) |
| Component library | Radix primitives via `radix-ui@1.4.3` metapackage (Phase 1) |
| Icon library | `lucide-react@1.8.0` (inherited) |
| Font | Self-hosted via `next/font/local` — Bloc Bold (display), Mont (sans). **Baloo NOT loaded on root layer.** |
| Phase 3 NEW packages | `resend@6.x`, `@react-email/components@1.x`, `next-mdx-remote@6.x`, `gray-matter@4.x`. `next/og` already bundled in Next.js 15.5.15. |
| Phase 3 NEW asset | `app/fonts/bloc-bold.ttf` — separate `.ttf` copy of Bloc Bold (alongside the WOFF2 used for web) for Satori/`ImageResponse` font loading (RESEARCH Pitfall 4). |

---

## 3. Gateway Homepage — Section-by-Section Visual Contract (GW-01)

The 8 sections of `app/(root)/page.tsx` build top-to-bottom per strategy PART 3 §1–§9. Each section is composed exclusively from Phase 2 primitives. Copy is verbatim from strategy PART 6A. Asymmetry alternates per the rule below.

### 3.0 Page-level wrapper

```tsx
// app/(root)/page.tsx (RSC by default; Server Component)
export default function GatewayHomePage() {
  return (
    <>
      {/* JSON-LD inline (Organization + WebSite + FAQPage) — see §8.3 */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Sections 1–8 (each is its own RSC, composed below) */}
      <HeroSection />
      <StorySection />
      <MarketCardsSection />
      <WhatWeDoSection />
      <TrustStripSection />
      <LeadershipSection />
      <FAQSection />
      <FinalCTASection />
      {/* RootFooter wraps in (root)/layout.tsx — not rendered here */}
    </>
  );
}
```

Layout removes the Phase 1 `app/(root)/page.tsx` distinguisher stripe (per Phase 2 UI-SPEC §13 hand-off).

### 3.1 Section 1 — HERO (strategy PART 3 §1 + PART 6A HERO)

| Dimension | Value |
|-----------|-------|
| Phase 2 primitives | `<Section size="lg" bg="default">` + `<ContainerEditorial width="wide">` + `<Image priority>` + 2× `<Button asChild size="touch" variant="default">` (primary CTAs) |
| Layout (asymmetry slot 1: split editorial) | Desktop: `grid grid-cols-12 gap-8`; left col (`col-span-6`) holds H1 + subhead + dual CTA + trust line; right col (`col-span-6`) holds full-bleed photo. Mobile: stacked, photo first (above H1) at `aspect-[4/3]`. |
| Image | `src="/photography/root-gateway-hero.{avif,webp}"` (D-09 — file exists by Phase 2 D-07 curation; HUMAN-ACTION precondition if missing) · `priority` (only `priority` image on the page — Pitfall 6) · `sizes="(max-width: 768px) 100vw, 50vw"` · `placeholder="blur"` if `blurDataURL` available · `alt="Children mid-movement at ProActiv Sports — gymnastics class in Hong Kong"` |
| H1 copy (verbatim PART 6A) | `Move. Grow. Thrive. In Hong Kong and Singapore.` |
| H1 typography | `text-display font-display text-foreground` (88px desktop / 48px mobile · Bloc Bold · navy on white). Per strategy §14.3 "don't fear big type" — executor MUST NOT downscale. |
| Subhead copy | `ProActiv Sports has been shaping how children move since 2011. Dedicated gymnastics and sports programmes, built around your child's confidence, coordination, and joy — across three venues in two cities.` |
| Subhead typography | `text-body-lg text-muted-foreground` (18px · Mont Regular · navy at ~70%) · `mt-4 max-w-prose` |
| Primary CTA group | `flex flex-col sm:flex-row gap-3 mt-6` containing two `<Button asChild size="touch" variant="default">` (44×44px touch target — WCAG 2.2 AA). Each wraps `<a href={process.env.NEXT_PUBLIC_HK_URL}>` (or SG). Labels: `Enter Hong Kong →` and `Enter Singapore →`. Arrow is U+2192 (literal arrow), NOT a `<lucide-react>` icon (matches strategy PART 6A wireframe text). |
| Trust line | Below CTAs, `mt-6 text-small text-muted-foreground`. Copy: `Since 2011 · Three dedicated venues · Trusted by leading international schools across Asia.` |
| Background | `bg-background` (white) — NO gradient (anti-AI-SaaS rule). |
| LCP target | < 2.5s on mobile throttled (PROJECT.md). Hero `<Image>` is the LCP element. Verified via Lighthouse on Vercel preview. |
| Interaction states | CTA hover: `hover:bg-primary/80`; CTA focus-visible: `ring-3 ring-ring` (navy ring on focus); CTA active: `translate-y-px`. Image: static (no hover scale on hero — saves INP budget). |

### 3.2 Section 2 — THE PROACTIV STORY (PART 3 §2 + PART 6A SECTION 2)

| Dimension | Value |
|-----------|-------|
| Phase 2 primitives | `<Section size="md" bg="default">` + `<ContainerEditorial width="default">` + `<StatStrip>` |
| Layout (asymmetry slot 2: centred narrow column + stat strip) | Centred prose column (`max-w-2xl mx-auto text-left`) + `<StatStrip>` BELOW the prose, full-width-of-container, with vertical separators between stats on desktop. NOT a 12-col grid — intentional contrast vs §3.1. |
| H2 copy | `A children's sports specialist — not a gym with a kids' class.` |
| H2 typography | `text-h2 font-display text-foreground` (36px · Bloc Bold · navy) |
| Body paragraphs (verbatim PART 6A §2) | Two paragraphs in `text-body-lg text-foreground space-y-4 mt-6`. First: `ProActiv Sports was founded in Hong Kong in 2011 and expanded to Singapore in 2014. We run purpose-built facilities for gymnastics and multi-sports, with a single focus: helping children aged 2 to 16 build physical confidence, coordination, and a lifelong relationship with movement.` Second: `Every coach on our team completes the ProActiv Sports training course — regardless of prior qualifications — so that whether your child trains with us in Wan Chai, Cyberport, or Katong, the standard of care and progression is the same.` |
| StatStrip props | `stats={[{value:"14",label:"Years in operation"},{value:"2",label:"Cities"},{value:"3",label:"Dedicated venues"},{value:"2–16",label:"Ages"}]}` · `variant="default"` · `mt-12` |
| StatStrip visual | Per Phase 2 UI-SPEC §3.10: values `text-display font-display text-foreground` (navy 88px), labels `text-small font-medium uppercase tracking-wider text-muted-foreground`, vertical `<Separator orientation="vertical" decorative />` between stats on `lg:` breakpoint, stacked on mobile with `gap-8`. |
| Background | `bg-background` (white) |
| Interaction | None — static section |

### 3.3 Section 3 — MARKET CARDS (PART 3 §3 + PART 6A SECTION 3)

| Dimension | Value |
|-----------|-------|
| Phase 2 primitives | `<Section size="md" bg="muted">` (cream surface — warm contrast with §3.2's white) + `<ContainerEditorial width="wide">` + 2× `<MarketCard>` |
| Layout (asymmetry slot 3: 2-col symmetric — INTENTIONAL EXCEPTION) | `grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8`. Symmetry here reinforces "equal weight" for HK/SG (strategy §14.3 permitted exception per RESEARCH Topic 1 editorial-asymmetry guidance). |
| Section heading (above grid) | `<h2 className="text-h2 font-display text-foreground mb-8 text-center md:text-left">Two cities. One standard.</h2>` (verbatim PART 6A §3 H2) |
| MarketCard 1 (HK) | `market="hk"` · `label="Hong Kong"` (display "ProActiv Sports Hong Kong" via override — see note) · `tagline="Gymnastics-led. Two dedicated venues — ProGym Wan Chai & ProGym Cyberport."` · `href={process.env.NEXT_PUBLIC_HK_URL!}` · `imageSrc="/photography/hk-progym-wan-chai.{avif,webp}"` · `imageAlt="A coach guiding a child through a beam routine at ProGym Wan Chai"` · `priority={true}` (above fold on desktop after first viewport scroll) |
| MarketCard 2 (SG) | `market="sg"` · `label="Singapore"` (display "Prodigy by ProActiv Sports") · `tagline="Multi-sport. Singapore's only MultiBall interactive wall — Movement, Sports, Climbing zones at Katong Point."` · `href={process.env.NEXT_PUBLIC_SG_URL!}` · `imageSrc="/photography/sg-prodigy-katong.{avif,webp}"` · `imageAlt="Children climbing the MultiBall wall at Prodigy @ Katong Point, Singapore"` · `priority={true}` |
| MarketCard visual (per Phase 2 UI-SPEC §3.7) | 4:3 photo full-bleed · navy-to-transparent gradient bottom-up overlay · `label` rendered as `text-display font-display text-white` at bottom-left with 32px padding (NOT shadcn `text-h2` — wireframe demands hero-scale label) · tagline below in `text-body text-cream` · `rounded-xl overflow-hidden` · 1px white border |
| MarketCard label override | The Phase 2 prop `label` accepts a longer string. For root gateway, pass `label="ProActiv Sports Hong Kong"` and `label="Prodigy by ProActiv Sports"` to match PART 6A wireframe — this fits the typography in 1–2 lines on desktop. Mobile: text wraps; verify visual on Vercel preview. |
| Hover state | Per Phase 2 UI-SPEC §3.7: image `scale-105` over 400ms · gradient intensifies · `lucide-react/ArrowRight` icon translates right 4px (icon appears bottom-right of card, white, size-6) · `transition-all duration-300` |
| Cross-market routing | Each MarketCard wraps a single `<a href={href}>` (NOT Next.js `<Link>` — Phase 1 D-02 ladder + RESEARCH Topic 2 Pitfall 7). Full page navigation to HK/SG host on click. |
| Background | `bg-muted` (cream) — Section's `bg="muted"` prop |

### 3.4 Section 4 — WHAT WE DO (PART 3 §4 + PART 6A SECTION 4)

| Dimension | Value |
|-----------|-------|
| Phase 2 primitives | `<Section size="md" bg="default">` + `<ContainerEditorial width="wide">` + 5× `<Card>` (each composed with icon + heading + body + market chip) |
| Layout (asymmetry slot 4: 5-tile row — INTENTIONAL EXCEPTION) | Mobile: `grid grid-cols-1 gap-4`. Tablet: `grid grid-cols-2 gap-6`. Desktop: `grid grid-cols-5 gap-6`. The 5-tile equal row is the one section that breaks asymmetry — per RESEARCH Topic 1 editorial-asymmetry note: "icon tiles are one permitted exception; keep them compact." |
| Section heading (above grid) | `<h2 className="text-h2 font-display text-foreground mb-8">Built for every stage of a child's movement journey.</h2>` (verbatim PART 6A §4 H2) |
| Tile composition (each of 5) | `<Card className="p-6 hover:shadow-md transition-shadow duration-200">` containing: (a) `lucide-react` icon at `size-8 text-brand-navy mb-4`, (b) `<h3 className="text-h3 font-display text-foreground">{Title}</h3>`, (c) `<p className="text-body text-muted-foreground mt-2 line-clamp-3">{Description}</p>`, (d) market availability line `<p className="text-small text-muted-foreground mt-3 italic">{Markets}</p>`. NO `<Link>` wrapping the card — these tiles are descriptive, not clickable (clarifies the offer; clicks go to dedicated programme pages in Phase 4/5, not from root). |
| 5 tiles (copy verbatim from PART 6A §4) | (1) **Gymnastics** · icon `Trophy` · "From toddler classes to the competitive pathway, with structured progression at every level." · "HK: ProGym Wan Chai & Cyberport · SG: Prodigy" — (2) **Sports Classes** · icon `Volleyball` (or `Activity` fallback) · "Football, basketball, rugby, tennis, dodgeball, martial arts, parkour." · "Core programme in SG · Multi-activity options in HK camps" — (3) **Holiday Camps** · icon `Backpack` · "Action-packed school holiday weeks, year-round. Themed options, half-day and full-day." · "HK & SG" — (4) **Birthday Parties** · icon `Cake` · "Two hours of hosted, coach-led fun. You bring the cake; we do the rest." · "HK & SG" — (5) **Competitions & Events** · icon `Medal` · "Competitive squads, inter-school events, community sports days." · "HK & SG" |
| Lucide icon notes | All icons exist in `lucide-react@1.8.0`: `Trophy`, `Activity` (volleyball substitute if `Volleyball` not in installed version — executor verifies at execute time), `Backpack`, `Cake`, `Medal`. All `size-8` (32px). `text-brand-navy` color via brand utility. NO icon emojis used inline (PART 6A wireframe shows `🤸 ⚽ 🎒 🎉 🏆` — those are wireframe shorthand; the implementation uses lucide icons for accessibility + consistent rendering). |
| Background | `bg-background` (white) |

### 3.5 Section 5 — TRUST STRIP (PART 3 §5 + PART 6A SECTION 5)

| Dimension | Value |
|-----------|-------|
| Phase 2 primitives | `<Section size="md" bg="navy">` (full-bleed navy — strategy §14.3 textured background substitute) + `<ContainerEditorial width="wide">` + `<LogoWall>` + 1× `<TestimonialCard variant="default">` |
| Layout (asymmetry slot 5: full-bleed dark surface) | Strong visual break from white sections. `<LogoWall>` row first, then `<TestimonialCard>` centred below in `max-w-3xl mx-auto`. |
| Section heading | `<h2 className="text-h2 font-display text-white">The standard behind the brand.</h2>` (verbatim PART 6A §5 H2) — white text on navy fill (14.55:1 contrast — PASS AAA) |
| Lead paragraph | `<p className="text-body-lg text-cream mt-4 max-w-3xl">For over a decade, ProActiv Sports has been trusted by families, international schools, and clubs across Hong Kong and Singapore. Our approach combines world-class coaching, progressive programming, and a deep commitment to safety and child development.</p>` (cream on navy = 13.24:1 — PASS AAA) |
| LogoWall props | `variant="grid"` · `title="Trusted by leading international schools and partners"` · `logos={[/* min 4, max 8 — see asset note */]}` · `mt-12` |
| LogoWall asset note (HUMAN-ACTION precondition) | Logo files at `public/logos/*.svg` (monochrome white SVG preferred for navy background — executor sets `<Image className="brightness-0 invert">` if logos are dark-on-transparent). Logos are HUMAN-ACTION at execute: if Martin hasn't provided partner logo SVGs by execute time, the LogoWall renders 4 placeholder text-only chips with partner names ("International French School", "Singapore American School", "KidsFirst", "ESF") in `text-cream font-display text-h3`, with a build warning. NOT silhouettes, NOT generic "logo" placeholder boxes — text fallback only. |
| TestimonialCard props (verbatim PART 6A §5) | `variant="default"` · `quote="Proactiv was the only sports centre we found to be inclusive of students with special needs, ensuring every child could participate. Our children and their families really enjoyed the event and the facilities."` · `author="Manjula Gunawardena"` · `authorRole="Manager & Senior Teacher, KidsFirst"` · `avatarSrc=undefined` (no portrait — fallback to initials "MG") · `className="mt-12 mx-auto max-w-3xl"` |
| TestimonialCard surface override | Phase 2 default is `bg-accent` (cream). On navy section, the TestimonialCard renders its OWN cream card surface — this is correct per Phase 2 §3.9 contract. Cream card sits visually inside navy section, providing warm-on-cool contrast. |
| Background | `bg-brand-navy` (navy via Section's `bg="navy"` prop) |

### 3.6 Section 6 — LEADERSHIP (PART 3 §6 + PART 6A SECTION 6)

| Dimension | Value |
|-----------|-------|
| Phase 2 primitives | `<Section size="md" bg="default">` + `<ContainerEditorial width="wide">` + 3× `<LeadershipCard>` (Phase 3-LOCAL composition — see §5.1) |
| Layout (asymmetry slot 6: 3-col portrait row) | Mobile: `grid grid-cols-1 gap-8`. Tablet: `grid grid-cols-1 gap-8` (still stacked for portrait scale). Desktop: `grid grid-cols-3 gap-6 lg:gap-8`. Asymmetry comes from caption-length variation per RESEARCH Topic 1 (Will's bio is shortest; Monica's is longest — visual rhythm via copy density, not layout shift). |
| Section heading | `<h2 className="text-h2 font-display text-foreground">Led by people who've built their lives around coaching.</h2>` (verbatim PART 6A §6 H2) |
| LeadershipCard 1 — Will | `name="Will"` · `role="Founder"` · `bioLine="Co-founder of ProActiv Sports, graduate of Dublin City University (Sports Science and Health), and the driving force behind our 2014 expansion to Singapore."` · `portrait="/photography/leadership-will.{avif,webp}"` · `portraitAlt="Will, Founder of ProActiv Sports"` |
| LeadershipCard 2 — Monica | `name="Monica"` · `role="Director of Sports, Hong Kong"` · `bioLine="19 years coaching children's gymnastics. Level 2 Italian coaching and judging certifications. Previously coached at Cristina Bontas Gymnastics Club (Canada, working with Canadian National Team athletes) and a competitive club in Dubai."` · `portrait="/photography/leadership-monica.{avif,webp}"` · `portraitAlt="Monica, Director of Sports for Hong Kong"` |
| LeadershipCard 3 — Haikel | `name="Haikel"` · `role="Head of Sports, Singapore"` · `bioLine="Known affectionately as 'Mr. Muscle Man.' Diploma in Sports Coaching, seven-plus years leading coaching teams, and the heart of the Prodigy culture."` · `portrait="/photography/leadership-haikel.{avif,webp}"` · `portraitAlt="Haikel, Head of Sports for Singapore"` |
| Portrait HUMAN-ACTION precondition (D-10) | Plan task BEGINS with file-existence check on all three portrait paths. If ANY missing, executor returns HUMAN-ACTION checkpoint listing exact missing files + directive: "Add portraits to `/Users/martin/Downloads/ProActive/01 - PHOTOS to use/`, re-run `pnpm photos:process`, then resume." NO PLACEHOLDERS — no silhouettes, no initials, no stock images. |
| Background | `bg-background` (white) |

### 3.7 Section 7 — FAQ (PART 3 §7 + PART 6A SECTION 7)

| Dimension | Value |
|-----------|-------|
| Phase 2 primitives | `<Section size="md" bg="default">` + `<ContainerEditorial width="default">` (narrower than `wide` — reading column) + `<Accordion type="single" collapsible>` containing 6× `<FAQItem>` |
| Layout (asymmetry slot 7: narrow centred reading column) | `max-w-3xl mx-auto`. Intentional contrast with §3.6's wide 3-col layout. |
| Section heading | `<h2 className="text-h2 font-display text-foreground mb-8">Frequently asked — about the brand</h2>` (verbatim PART 6A §7 H2) |
| FAQ items (6 Q&A pairs, verbatim from PART 6A §7) | (1) Q: `What is ProActiv Sports?` A: `ProActiv Sports is a children's gymnastics and sports specialist founded in Hong Kong in 2011. We run dedicated facilities in Hong Kong (ProGym Wan Chai and ProGym Cyberport) and Singapore (Prodigy @ Katong Point), offering weekly classes, holiday camps, birthday parties, and competitive pathways for children aged 2 to 16.` — (2) Q: `Where does ProActiv Sports operate?` A: `Hong Kong and Singapore. In Hong Kong: ProGym Wan Chai (The Hennessy, 15/F, 256 Hennessy Road) and ProGym Cyberport (5,000 sq ft, opened August 2025). In Singapore: Prodigy @ Katong Point (Level 3, 451 Joo Chiat Road).` — (3) Q: `What programmes do you offer?` A: `Weekly classes, holiday camps, birthday parties, school partnerships, and competition events. Gymnastics is the core in Hong Kong; in Singapore we offer a multi-sport programme including gymnastics, climbing, football, basketball, martial arts, and the MultiBall interactive wall.` — (4) Q: `What age range do you work with?` A: `From 12 months (Babies & Toddlers classes in Hong Kong) through to 16 years. Adult classes are also available at ProGym.` — (5) Q: `How do I book a trial?` A: `All new children are welcome to a free 30-minute assessment. Choose your city below and we'll guide you through it.` — (6) Q: `Are there differences between the Hong Kong and Singapore offerings?` A: `Yes. Hong Kong is gymnastics-led, with a competitive pathway and rhythmic gymnastics. Singapore is multi-sport, anchored by our Prodigy brand and the only MultiBall wall in the country. Both share the same coaching standards and safety approach.` |
| FAQItem visual (per Phase 2 UI-SPEC §3.3) | Question: `text-h3 font-display text-foreground` (24px Bloc Bold navy). Chevron: `lucide-react/ChevronDown` rotates 180° on open. Answer: `text-body text-muted-foreground` (16px Mont navy-70%). Trigger touch target: `min-h-11 py-3` (WCAG 2.2 AA). |
| FAQ JSON-LD adjacency | The FAQPage `mainEntity` array in the inline JSON-LD MUST list these 6 Q&A pairs verbatim (answers MUST match visible copy character-for-character — Google FAQPage rich-result requirement; mismatch causes manual penalty). See §8.3. |
| Background | `bg-background` (white) |

### 3.8 Section 8 — FINAL CTA (PART 3 §8 + PART 6A SECTION 8)

| Dimension | Value |
|-----------|-------|
| Phase 2 primitives | `<Section size="sm" bg="cream">` (warm full-bleed close — strategy §14.3 textured-background-substitute) + `<ContainerEditorial width="default">` + 2× `<Button asChild size="touch" variant="default">` |
| Layout (asymmetry slot 8: full-bleed centred close) | `text-center max-w-3xl mx-auto`. Final emotional close — centred is correct here (the only centred section after the hero). |
| H2 copy | `Ready when you are.` (verbatim PART 6A §8 H2) |
| H2 typography | `text-h1 font-display text-foreground` (use `h1` size NOT `display` — section close, not hero) — 56px desktop. |
| CTA group | Same dual-button pattern as §3.1 hero: `flex flex-col sm:flex-row gap-3 justify-center mt-8`. Two `<Button asChild size="touch" variant="default">` with `Enter Hong Kong →` and `Enter Singapore →`. |
| Support line | Below CTAs, `mt-6 text-body text-muted-foreground`. Copy: `Not sure which is right for you? Email <a href="mailto:hello@proactivsports.com" className="font-semibold text-foreground underline underline-offset-2 hover:text-brand-red">hello@proactivsports.com</a> and we'll help.` |
| Background | `bg-accent` (cream via Section's `bg="cream"` prop — accent token = cream per Phase 2 §1.4) |

### 3.9 FOOTER (PART 3 §9)

Footer is `<RootFooter>` rendered in `app/(root)/layout.tsx`, NOT in `page.tsx`. See §5.3 for full contract.

### 3.10 Section-to-primitive coverage summary

| Gateway section | Phase 2 primitive(s) consumed | New Phase 3 component? |
|-----------------|------------------------------|------------------------|
| §3.1 HERO | Section, ContainerEditorial, Image, Button | No |
| §3.2 STORY | Section, ContainerEditorial, StatStrip | No |
| §3.3 MARKET CARDS | Section, ContainerEditorial, MarketCard | No |
| §3.4 WHAT WE DO | Section, ContainerEditorial, Card, lucide icons | No |
| §3.5 TRUST STRIP | Section, ContainerEditorial, LogoWall, TestimonialCard | No |
| §3.6 LEADERSHIP | Section, ContainerEditorial, **LeadershipCard** | YES — Phase 3-local (`components/root/leadership-card.tsx`) |
| §3.7 FAQ | Section, ContainerEditorial, Accordion, FAQItem | No |
| §3.8 FINAL CTA | Section, ContainerEditorial, Button | No |
| §3.9 FOOTER | (in layout) ContainerEditorial inside `<RootFooter>` | YES — Phase 3-local (`components/root/root-footer.tsx`) |

**8 sections + 1 layout-level footer. Zero new DS-level primitives. Three Phase 3-local compositions (LeadershipCard, RootNav, RootFooter) — see §5.**

---

## 4. Supporting Pages — Visual Contracts (GW-02..GW-07)

Six supporting pages plus shared `/privacy/` + `/terms/` legal stubs. All wrap in `app/(root)/layout.tsx` (RootNav + RootFooter inherited). All use Phase 2 primitives only.

### 4.1 `/brand/` (GW-02)

| Dimension | Value |
|-----------|-------|
| File | `app/(root)/brand/page.tsx` (RSC) + `app/(root)/brand/content.mdx` (page body) + `app/(root)/brand/opengraph-image.tsx` |
| Content source | MDX via `next-mdx-remote/rsc` (per RESEARCH Topic 4 — clean Phase 6 Sanity migration seam) |
| Frontmatter contract | `title: "About ProActiv Sports — Brand Story, History & Mission"` · `description: "ProActiv Sports is a children's gymnastics and sports specialist founded in Hong Kong in 2011. Read our brand story, meet the founders, and understand our mission."` · `lastUpdated: "2026-04-23"` |
| Page structure (top to bottom) | (1) Hero `<Section size="lg">` + `<ContainerEditorial width="wide">` — 12-col grid: H1 + lead in `col-span-7`, brand-story photo in `col-span-5`. H1: `About ProActiv Sports`. Photo: `/photography/brand-hero.{avif,webp}` (Phase 2 D-07 curated set). (2) LLM-citable brand paragraph `<Section size="md"><ContainerEditorial width="default">` — copy verbatim from strategy §10.2. Centered narrow column (`max-w-3xl`). (3) History timeline `<Section size="md" bg="muted">` — vertical list, 3 events: 2011 founded HK · 2014 expanded SG · 2025 Cyberport opened. Composed from `<Card>` per event with date/title/description. (4) Leadership section — REUSE `<LeadershipCard>` × 3 (same instances as gateway §3.6 — DRY by extracting `LeadershipSection` server component to `components/root/leadership-section.tsx`). (5) StatStrip `<Section size="md">` — same 4 stats as gateway §3.2. (6) School partnerships callout `<Section size="md" bg="muted">` + `<LogoWall variant="grid">` — same logo set as gateway §3.5 with caveat caption: "With partner permission. Contact us for partnership enquiries." (7) Final CTA `<Section size="sm" bg="cream">` — `<h2>Want to know more?</h2>` + dual market CTA buttons + email line (mirrors gateway §3.8). |
| Hero H1 | `About ProActiv Sports` (Bloc Bold display 88px desktop / 48px mobile). |
| LLM-citable paragraph copy (strategy §10.2 close paraphrase, ≥120 words for citation density) | `ProActiv Sports is a children's gymnastics and sports specialist founded in Hong Kong in 2011 by Will, a graduate of Dublin City University (Sports Science and Health). The company expanded to Singapore in 2014 with the launch of Prodigy by ProActiv Sports. Today, ProActiv operates three dedicated venues across two cities: ProGym Wan Chai (15/F The Hennessy, 256 Hennessy Road), ProGym Cyberport (5,000 sq ft, opened August 2025), and Prodigy @ Katong Point (Level 3, 451 Joo Chiat Road, Singapore — home to Singapore's only MultiBall interactive wall). Programmes serve children aged 2 to 16 across gymnastics, multi-sport classes, holiday camps, birthday parties, school partnerships, and a competitive gymnastics pathway. Every coach completes the ProActiv Sports training course regardless of prior qualifications, ensuring consistent standards of safety and progression across both markets.` |
| Metadata (page.tsx `generateMetadata`) | `title` from frontmatter · `description` from frontmatter · `openGraph: { title, description, url: 'https://proactivsports.com/brand', images: [{ url: '/brand/opengraph-image', width: 1200, height: 630, alt: 'About ProActiv Sports' }], type: 'article', siteName: 'ProActiv Sports', locale: 'en_GB' }` · `alternates: { canonical: 'https://proactivsports.com/brand' }` |

### 4.2 `/coaching-philosophy/` (GW-03)

| Dimension | Value |
|-----------|-------|
| File | `app/(root)/coaching-philosophy/page.tsx` + `content.mdx` + `opengraph-image.tsx` |
| Content source | MDX |
| Frontmatter | `title: "Coaching Philosophy — Safety, Progression, Confidence"` · `description: "How ProActiv Sports trains every coach: a shared methodology built on safety standards, structured skill progression, and a deep commitment to children's confidence."` |
| Page structure | (1) Editorial hero `<Section size="lg">` — H1 + philosophy headline in `col-span-7`, coaching photo in `col-span-5`. H1: `How we coach.` (2) 3-pillar section `<Section size="md">` + `<ContainerEditorial width="wide">` — `grid grid-cols-1 md:grid-cols-3 gap-8`. Each pillar = lucide icon (`Shield` for Safety / `TrendingUp` for Progression / `Sparkles` for Confidence) at `size-10 text-brand-navy`, `<h3 className="text-h3 font-display mt-4">` with pillar name, 2-paragraph `text-body` description. (3) ProActiv training course callout `<Section size="md" bg="muted">` — single `<Card className="p-8 lg:p-12">` with H2 + 3-paragraph copy from strategy §10.4 (executor copies verbatim). (4) Coach leadership cards (Monica + Haikel only — Will is on /brand/) `<Section size="md">` + `grid grid-cols-1 md:grid-cols-2 gap-8`. Each `<LeadershipCard>` with link to respective market `/coaches/` page (Phase 4/5). (5) Dual market CTA `<Section size="sm" bg="cream">` — `<h2>Experience the difference.</h2>` + `Book a Free Trial in Hong Kong` / `Book a Free Trial in Singapore` (these CTAs go to `${NEXT_PUBLIC_HK_URL}/book-a-trial/` and SG equivalent — absolute deep links to Phase 4/5 booking hubs). |
| Hero H1 | `How we coach.` (intentional period — confident, declarative — strategy §14.3 voice) |

### 4.3 `/news/` (GW-04 — D-06 placeholder)

| Dimension | Value |
|-----------|-------|
| File | `app/(root)/news/page.tsx` (RSC) + `app/(root)/news/opengraph-image.tsx` (NO content.mdx — TS data array per D-06) |
| Content source | Hardcoded TypeScript: `const newsItems: NewsItem[] = []` at top of file. Phase 6 swaps for Sanity GROQ query. |
| Page structure | (1) Hero `<Section size="md">` + `<ContainerEditorial width="default">` — H1 + intro copy (centred, max-w-2xl). (2) Empty-state block `<Section size="md" bg="muted">` — `<Card className="p-12 text-center max-w-2xl mx-auto">` with `lucide-react/Newspaper` icon at `size-12 text-muted-foreground mx-auto`, `<h2 className="text-h3 font-display mt-4">Coverage coming soon.</h2>`, body copy + email signup form. (3) Newsletter signup form (re-uses `/contact/` route handler via fetch with subject="Press notification list") — fields: Email + market selector + hidden subject. (4) Footer CTA `<Section size="sm" bg="cream">` — dual market CTA buttons. |
| Hero H1 | `News & Press` |
| Hero intro copy | `ProActiv Sports has been featured in leading family and lifestyle publications across Hong Kong and Singapore. Coverage coming soon — sign up below to be notified when we publish press highlights.` |
| Newsletter form | `<form action="/api/contact" method="POST">` (uses existing route handler — see §6) with hidden `subject="Press notification list"` and hidden `market` (force-pick same as /contact/) — but simplified: only Email + market toggle + submit button. Honeypot inherited. |
| Conditional rendering | `{newsItems.length > 0 ? <NewsList items={newsItems} /> : <EmptyNewsState />}` — empty state is the default Phase 3 path. |
| `NewsItem` type | `interface NewsItem { outlet: string; headline: string; date: string; url: string; logo?: string; }` — defined at top of `page.tsx`. Phase 6 keeps the type, replaces the array with `await sanityClient.fetch(GROQ_NEWS_QUERY)`. |

### 4.4 `/careers/` (GW-05 — D-07 evergreen)

| Dimension | Value |
|-----------|-------|
| File | `app/(root)/careers/page.tsx` + `content.mdx` + `opengraph-image.tsx` |
| Content source | MDX |
| Frontmatter | `title: "Careers — Work with children. Build a career at ProActiv Sports."` · `description: "We're always looking for great coaches and operations team members. Open application — tell us about you."` |
| Page structure | (1) Hero `<Section size="lg">` — left col H1 + lead, right col coaching-action photo. H1: `Work with children. Build a career.` Lead: `We're always looking for great coaches and operations team members across Hong Kong and Singapore.` (2) Why-work-here section `<Section size="md">` + 12-col grid — H2 + 3-paragraph editorial body in `col-span-7`, photo in `col-span-5`. H2: `Why ProActiv?`. Body content from strategy PART 6A voice (executor synthesises 3 paragraphs covering: real children, real venues; coach-led culture; ProActiv training course). (3) What-we-look-for section `<Section size="md" bg="muted">` + `<ContainerEditorial width="default">` — H2 + 5-bullet list using `<ul className="space-y-3 text-body-lg mt-6">` with checkmark icons (`lucide-react/CheckCircle2 size-5 text-brand-green inline-block mr-2`). H2: `What we look for.` Bullets: "Genuine love of working with children." / "A coaching qualification or sport-specific background — or a deep willingness to learn through our training course." / "Calm under pressure and a sense of humour." / "Reliability, professionalism, and care for the families we serve." / "Eligibility to work in Hong Kong or Singapore." (4) Open-application CTA `<Section size="md" bg="cream">` — centred `<Card className="p-8 lg:p-12 max-w-2xl mx-auto">` with H2 `Tell us about you.` + body + single `<Button asChild size="touch" variant="default">` linking to `/contact/?subject=job` (per D-07; client form pre-fills via `useSearchParams()`). |
| Hero H1 | `Work with children. Build a career.` |
| Open-application button label | `Send us your application →` (links to `/contact/?subject=job`) |

### 4.5 `/contact/` (GW-06 — D-01..D-05)

See §6 for the full contact form UX contract — `/contact/` is treated as its own design surface given the form complexity.

### 4.6 `/privacy/` and `/terms/` (GW-07 — D-08 placeholder)

| Dimension | Value (applies to both pages) |
|-----------|-------|
| Files | `app/(root)/privacy/page.tsx` + `content.mdx` + `opengraph-image.tsx` ; `app/(root)/terms/page.tsx` + `content.mdx` + `opengraph-image.tsx` |
| Content source | MDX |
| Frontmatter (privacy) | `title: "Privacy Policy — Draft (pending legal review)"` · `description: "Draft privacy policy for proactivsports.com — pending lawyer review for HK PDPO and SG PDPA compliance before public launch."` |
| Frontmatter (terms) | `title: "Terms of Use — Draft (pending legal review)"` · `description: "Draft terms of use for proactivsports.com — pending lawyer review before public launch."` |
| Page structure | (1) Yellow draft banner `<Section size="sm" bg="default">` + `<ContainerEditorial width="default">` — `<Card className="bg-brand-yellow border-brand-yellow text-foreground p-4 lg:p-6 max-w-3xl mx-auto">` with `lucide-react/AlertTriangle size-5 text-foreground inline-block mr-2` + bold copy: `DRAFT POLICY — This document is pending legal review and is not yet binding. Live policy ships before public launch.` Note: yellow surface with navy text = 8.80:1 contrast (Phase 2 §1.3 canonical pairing — passes AAA). (2) Page heading `<Section size="sm">` — H1 (Privacy Policy / Terms of Use) + last-updated date in `text-small text-muted-foreground`. (3) Body `<Section size="md">` + `<ContainerEditorial width="default">` (`max-w-2xl mx-auto` for reading column) — MDX renders prose with `prose prose-lg` Tailwind utilities (NB: Phase 3 plan adds `@tailwindcss/typography` if not present). MDX components prop injects `<h2 className="text-h2 font-display mt-12 mb-4">`, `<h3 className="text-h3 font-display mt-8 mb-3">`, `<p className="text-body-lg text-foreground mb-4">`, `<ul className="list-disc pl-6 space-y-2 mb-4">`. (4) Footer CTA `<Section size="sm" bg="muted">` — short copy + email link `<a href="mailto:hello@proactivsports.com">` for data requests. |
| Yellow draft banner copy (verbatim) | `⚠️ DRAFT POLICY — This document is pending legal review and is not yet binding. Live policy ships before public launch (Phase 10).` (Note: emoji in copy is fine here — the page itself is draft signage, not converting copy.) |
| Privacy MDX body scope | Stub content covering: data collected (name, email, phone, message, market) · how data is used (responding to enquiries, sending market-relevant info) · processor (Resend for email) · no third-party trackers at Phase 3 · contact for data requests (`hello@proactivsports.com`) · jurisdictions (PDPO Hong Kong, PDPA Singapore) · effective date placeholder. |
| Terms MDX body scope | Stub content covering: site usage permission · intellectual property (logos, photography belong to ProActiv Sports) · disclaimers · governing law placeholder · contact. |
| Replacement timeline | Phase 9 / Phase 10 — lawyer-drafted PDPA + PDPO compliant text replaces this MDX. Banner removed. |

---

## 5. Phase 3-local Compositions (`components/root/`)

Three new components live at `components/root/`, **NOT `components/ui/`** (D-11 inheritance pattern). Each is a composition of Phase 2 primitives + brand tokens. None register with shadcn registry.

### 5.1 `LeadershipCard` (`components/root/leadership-card.tsx`)

| Dimension | Value |
|-----------|-------|
| File | `components/root/leadership-card.tsx` (RSC — no `'use client'`) |
| Composition | `<Card>` (Phase 2) wrapping: portrait `<Image>` + `<Badge>` for role + name h3 + bio paragraph |
| Props interface | `interface LeadershipCardProps { name: string; role: string; bioLine: string; portrait: string; portraitAlt: string; className?: string; }` |
| Visual spec | `<Card className="overflow-hidden p-0">` containing: (a) portrait `<Image>` at `aspect-[3/4]` (portrait orientation), `fill`, `sizes="(max-width: 768px) 100vw, 33vw"`, `className="object-cover"`, lazy-loaded (NO `priority` — below fold), required `alt`. (b) `<div className="p-6 lg:p-8">` containing: `<Badge variant="secondary" className="mb-3">{role}</Badge>` (yellow surface + navy text — 8.80:1 canonical pairing); `<h3 className="text-h3 font-display text-foreground">{name}</h3>`; `<p className="text-body text-muted-foreground mt-3 leading-relaxed">{bioLine}</p>`. |
| Hover state | Subtle: `transition-shadow duration-200 hover:shadow-md` on the Card. Image does NOT zoom (these are portraits, not lifestyle shots — zoom feels invasive). |
| Focus state | If LeadershipCard is wrapped in a Link (e.g., on /coaching-philosophy/ where coach cards link to market `/coaches/` pages), the Card receives `focus-within:ring-3 focus-within:ring-ring`. On gateway homepage and /brand/, NOT linked — no focus state. |
| A11y | Portrait `alt` is REQUIRED (TypeScript enforces). Format: "{name}, {role}" (e.g., "Monica, Director of Sports for Hong Kong"). Card uses semantic `<article>` if rendered in a list of leaders (planner adds `as="article"` prop or wraps in `<article>`). |
| Responsive | Mobile: full-width card. Tablet: 1-col layout still (portraits scale large). Desktop: 3-col grid (consumer's responsibility — `LeadershipCard` itself doesn't grid). |
| Used by | Gateway §3.6 (3 instances), /brand/ §4 leadership section (3 instances), /coaching-philosophy/ §4 (Monica + Haikel only — 2 instances) |
| Reusable extraction | A `<LeadershipSection>` server component at `components/root/leadership-section.tsx` accepts `leaders: LeadershipCardProps[]` prop and renders the heading + grid + 3 cards. Used by gateway + /brand/ + /coaching-philosophy/ — DRY, single source of truth for the leader data. |

### 5.2 `RootNav` (`components/root/root-nav.tsx`)

| Dimension | Value |
|-----------|-------|
| File | `components/root/root-nav.tsx` (RSC for the wrapper; mobile menu toggle is a client sub-component at `components/root/root-nav-mobile.tsx`) |
| Composition | Header element + logo SVG + desktop nav links + dual market CTAs + mobile hamburger (shadcn `Sheet` for slide-in drawer per RESEARCH Topic 6 + 03-CONTEXT.md Claude's Discretion — planner picks Sheet default; deviation requires plan-level note) |
| Visual spec | `<header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">` containing `<ContainerEditorial width="wide" className="flex items-center justify-between h-16 lg:h-20">`. Left: `<a href="/" aria-label="ProActiv Sports — home">` wrapping logo SVG (white-on-navy or navy-on-white per surface; default = navy logo on white background; height `h-8 lg:h-10`). Right: desktop nav `<nav aria-label="Primary"><ul className="hidden lg:flex items-center gap-6">` with 5 links (Brand / Coaching / News / Careers / Contact) + 2 dual market CTAs (`<Button asChild size="sm" variant="ghost">` for HK and SG — smaller than hero CTAs because they're persistent). Mobile: hamburger button `<Button size="touch" variant="ghost" className="lg:hidden">` with `lucide-react/Menu` icon, opens `<Sheet>`. |
| Desktop nav links (5) | (1) `About` → `/brand/` · (2) `Coaching` → `/coaching-philosophy/` · (3) `News` → `/news/` · (4) `Careers` → `/careers/` · (5) `Contact` → `/contact/`. Each: `<Link href="..." className="text-small font-medium text-foreground hover:text-brand-red transition-colors">`. NOTE: same-host nav uses Next.js `<Link>` (not `<a>`) because these are within the root subdomain. |
| Dual market CTAs in nav | `<Button asChild size="sm" variant="ghost">` containing `<a href={process.env.NEXT_PUBLIC_HK_URL}>HK →</a>` and `<a href={process.env.NEXT_PUBLIC_SG_URL}>SG →</a>`. Smaller (`size="sm"` not `touch`) because they're persistent in nav — `size="touch"` reserved for hero/final-CTA. Mobile menu replicates these as `size="touch"` because mobile menu is the primary tap surface. |
| Mobile menu (Sheet) | Side-from-right shadcn Sheet. Header: logo + close button. Body: vertical nav links at `text-h3 font-display` with thick tap targets (`min-h-12 py-3`). Footer: dual market CTAs at `size="touch"` full-width. Background: `bg-background`. |
| Active link state | Current path matches link → `text-brand-red font-semibold` and underline. Use `usePathname()` from `next/navigation` (forces nav to client component if active state is needed; planner may opt to skip active state if it forces a client boundary — the entire nav being RSC is preferable for perf budget). Decision: planner picks. Default recommendation: render nav as RSC + accept no active state (acceptable for a 5-link marketing nav; users orient via page H1, not nav highlight). |
| Skip-link | First child of `<body>` (rendered by `app/(root)/layout.tsx`, NOT by RootNav itself): `<a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-2 focus:outline-ring focus:outline-offset-2">Skip to main content</a>`. WCAG 2.2 AA requirement (per PROJECT.md). |
| Logo asset | `public/assets/logo.svg` (existing per PROJECT.md `assets/brand/logos/`). Two variants if needed: `logo-navy.svg` (default, for white surfaces) and `logo-white.svg` (for navy surfaces). Phase 3 ships logo-navy at minimum. |
| Background on scroll | Sticky with `bg-background/95 backdrop-blur-sm` — semi-transparent white blur for content scrolling beneath. Border `border-b border-border` (1px neutral-200) for separation. NO drop shadow — strategy §14.3 "shadows used sparingly." |

### 5.3 `RootFooter` (`components/root/root-footer.tsx`)

| Dimension | Value |
|-----------|-------|
| File | `components/root/root-footer.tsx` (RSC) |
| Composition | Full-bleed navy section with logo + nav columns + market links + social icons + copyright |
| Visual spec | `<footer className="bg-brand-navy text-white">` containing `<Section size="md" bg="navy">` + `<ContainerEditorial width="wide">`. Layout: 4-col grid on desktop (`grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12`). Bottom row: `<Separator className="my-8 bg-white/20" />` then a flex row with copyright on left + social icons on right. |
| Column 1 — Brand | Logo (white variant, `h-10`) + tagline `<p className="text-small text-cream mt-4 max-w-xs">Children's gymnastics and sports in Hong Kong and Singapore. Since 2011.</p>` |
| Column 2 — Company links | `<h4 className="text-small font-semibold uppercase tracking-wider text-white">Company</h4>` + `<ul className="mt-4 space-y-2 text-small text-cream">` with: About → `/brand/`, Coaching → `/coaching-philosophy/`, News → `/news/`, Careers → `/careers/`. Each link: `<Link href="..." className="hover:text-white transition-colors">`. |
| Column 3 — Markets | `<h4>Markets</h4>` + ul with: `ProActiv Sports Hong Kong →` (absolute `<a href={NEXT_PUBLIC_HK_URL}>`) · `Prodigy by ProActiv Sports Singapore →` (absolute SG). |
| Column 4 — Contact + Legal | `<h4>Contact & Legal</h4>` + ul with: Contact → `/contact/` · Email `<a href="mailto:hello@proactivsports.com">hello@proactivsports.com</a>` · Privacy → `/privacy/` · Terms → `/terms/`. |
| Social icons | Below separator, right-aligned: 3 lucide-react icons in a flex row `gap-4`. (1) Facebook (`lucide-react/Facebook`) → `https://www.facebook.com/proactivsportshk/` (placeholder href — confirmed in strategy §10.2 social profiles list). (2) Instagram (`lucide-react/Instagram`) → `https://www.instagram.com/proactivsports/` (placeholder). (3) LinkedIn (`lucide-react/Linkedin`) → placeholder if URL unknown — link omitted if not provided (per 03-CONTEXT.md Claude's Discretion). Each icon: `size-5 text-cream hover:text-white transition-colors`. Wrapped in `<a target="_blank" rel="noopener noreferrer" aria-label="Follow ProActiv Sports on Facebook">` etc. |
| Copyright line | Left-aligned, `text-small text-cream`. Copy: `© ${new Date().getFullYear()} ProActiv Sports. All rights reserved.` Year auto-updates. |
| Background | `bg-brand-navy` — white text 14.55:1 (PASS AAA), cream text 13.24:1 (PASS AAA) |
| Touch targets | All link-style elements get `min-h-11 inline-flex items-center` for 44px touch target on mobile (WCAG 2.2 AA). |
| Used by | `app/(root)/layout.tsx` — every root page renders the footer |

---

## 6. `/contact/` Form UX (GW-06 — D-01..D-05 binding)

`/contact/` is the conversion-critical surface. The market selector pattern is the most consequential UX choice in this phase. This section locks the visual + interaction contract.

### 6.1 Page structure

| Dimension | Value |
|-----------|-------|
| Files | `app/(root)/contact/page.tsx` (RSC shell — metadata + JSON-LD ContactPoint) + `app/(root)/contact/contact-form.tsx` (`'use client'` form) + `app/(root)/contact/opengraph-image.tsx` |
| Backend | `app/api/contact/route.ts` (POST handler — Resend SDK call, see §6.5) |

### 6.2 Page layout (top to bottom)

| Section | Composition |
|---------|-------------|
| Hero | `<Section size="md">` + `<ContainerEditorial width="default">` (max-w-2xl reading-column-friendly). H1 + lead paragraph. |
| Form section | `<Section size="md" bg="muted">` + `<ContainerEditorial width="default">` + `<ContactForm />` (client component). Form sits in a `<Card className="p-6 lg:p-10 max-w-2xl mx-auto">`. |
| Alternative contact section | `<Section size="md">` + `<ContainerEditorial width="default">` — H2 `Other ways to reach us.` + 3-column grid (or 2-col on mobile) of: Email card · WhatsApp HK card · WhatsApp SG card. Each card: lucide icon (`Mail`, `MessageCircle` ×2) + label + clickable `<a>`. WhatsApp cards are conditionally rendered only when env vars are set (see D-02 inheritance). |

### 6.3 Hero copy

| Element | Copy |
|---------|------|
| H1 | `Get in touch.` |
| Lead | `Tell us about your child and we'll point you to the right venue, the right coach, and the right next step.` |

### 6.4 Form contract — D-03 force-pick market selector

The market selector is the FIRST element in the form. Form fields below the selector are HIDDEN (CSS `hidden` or React `null`-render) until a market is picked. This is the D-03 force-pick pattern.

| Element | Visual spec |
|---------|-------------|
| Selector treatment (Claude's Discretion locked here) | **Two large button cards** — `grid grid-cols-1 md:grid-cols-2 gap-4`. Each card is a full-width `<button>` element (NOT input radio — visual weight of a card emphasises the choice; underlying state managed by React `useState`). Card structure: lucide flag icon (or location pin) at `size-8 text-brand-navy`, market label `text-h3 font-display`, sub-label `text-small text-muted-foreground`. Selected state: `bg-primary text-primary-foreground border-2 border-primary` (navy fill + white text). Unselected: `bg-card border-2 border-border hover:border-primary/50`. |
| Selector helper text | Above selector: `<p className="text-small text-muted-foreground mb-3 font-medium">Where are you enquiring about? <span className="text-destructive">*</span></p>` |
| Force-pick guard | Form fields render conditionally: `{selectedMarket ? <FormFields /> : <p className="text-body text-muted-foreground mt-6 text-center">Please select your location to continue.</p>}` |
| Card labels | Card 1: icon `MapPin`, label `Hong Kong`, sub-label `ProGym Wan Chai · Cyberport`. Card 2: icon `MapPin`, label `Singapore`, sub-label `Prodigy @ Katong Point`. |
| Card touch target | Each card `min-h-[88px] p-6` (well above 44×44px). Tab reachable; Enter/Space toggles selection. |
| ARIA | `role="radiogroup" aria-label="Select your market"` on the wrapper; each card `role="radio" aria-checked={selectedMarket === 'hk'}`. |

### 6.5 Form fields (rendered after market pick)

Order is binding (planner does NOT reorder):

| # | Field | Type | Validation | Helper / placeholder |
|---|-------|------|------------|---------------------|
| 1 | Your name | `<input type="text">` required | min 2 chars, max 100 | `Maria Chen` |
| 2 | Email | `<input type="email">` required | HTML5 email format + server-side regex validation | `you@example.com` |
| 3 | Phone (optional) | `<input type="tel">` optional | E.164 format encouraged but not enforced (international parents, varied formats) | `+852 9123 4567` |
| 4 | Child's age (optional) | `<input type="text">` optional | free-text (handles "4 and 6", "almost 3", etc. — strict number rejects real cases) | `e.g. 4 years old, or 4 and 7` |
| 5 | Message | `<textarea rows={5}>` required | min 10 chars, max 2000 | `Tell us about your child and what you're hoping for — class, camp, party, anything.` |
| 6 | (Hidden) Market | `<input type="hidden" name="market">` value = state | server validates `∈ ['hk','sg']` | — |
| 7 | (Hidden) Honeypot (D-04) | `<input type="text" name="bot-trap" tabIndex={-1} autoComplete="off" className="absolute left-[-9999px]">` | server rejects if non-empty | — |
| 8 | (Hidden) Subject (from `?subject=` query) | `<input type="hidden" name="subject">` | optional; defaults to "General enquiry" | from `useSearchParams()` per D-07 careers integration |
| 9 | Submit button | `<Button type="submit" size="touch" variant="default" className="w-full mt-6">` | disabled while submitting | label: `Send message` (loading: `Sending...`) |

| Field styling | Each field row: `<div className="space-y-2 mb-4">` containing `<Label htmlFor={id}>{label} {required && <span className="text-destructive">*</span>}</Label>` + `<Input>` (uses shadcn `Input` and `Textarea` primitives — added via `pnpm dlx shadcn@latest add input textarea` in plan 03-XX, NOT new Phase 3 primitives because shadcn-stock). Helper/error text below: `<p className="text-small text-muted-foreground mt-1">` or `<p className="text-small text-destructive mt-1">`. |

### 6.6 Form states

| State | Visual + behavior |
|-------|-------------------|
| Initial (no market picked) | Selector visible · form fields hidden · helper text visible |
| Market picked, untouched | Selector shows selection · form fields revealed with smooth transition (`transition-all duration-200` on opacity + max-height) |
| Field validation error | Field border turns destructive (`aria-invalid="true"` triggers existing CVA destructive ring per Phase 1 button.tsx pattern) · `aria-describedby` points to error message · error message in `text-small text-destructive` below field |
| Submitting | Submit button: `disabled` + label `Sending...` + lucide `Loader2` icon `animate-spin size-4` · all form fields disabled |
| Success | Form replaced by success card: `<Card className="p-8 text-center bg-accent">` with lucide `CheckCircle2 size-12 text-brand-green mx-auto`, H2 `Thanks — we'll be in touch.`, body `We've received your message. A member of the {market} team will reply within one business day. Check your inbox for a confirmation copy.`, single button `Send another message` (resets form state). |
| Error (network or server 500) | Card: `<Card className="p-6 border-destructive bg-destructive/5">` with lucide `AlertCircle size-6 text-destructive`, H3 `Something went wrong.`, body `We couldn't send your message right now. Please try again, or email us directly at <a href="mailto:hello@proactivsports.com" className="font-semibold underline">hello@proactivsports.com</a>.`, button `Try again` (re-submits without resetting form data). |
| Error (validation 400 from server) | Inline field errors under affected fields (server returns `{ errors: { email: 'Invalid email format' } }`) |

### 6.7 Loading state UX detail

- Submit button transition: instant (no delay). Spinner appears immediately on click.
- Success state transition: 250ms fade from form → success card.
- Error state: jarring shake feels desperate; just swap the card calmly.
- After success, form data is cleared (defensive — prevents accidental double-submit).

### 6.8 WhatsApp CTA visual treatment

Below the form, in the "Other ways to reach us" section. Two cards, ONLY rendered if env var is present (per D-02):

| Card | Visual + interaction |
|------|----------------------|
| WhatsApp HK | `<a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_HK}?text=${encodeURIComponent('Hello ProActiv Sports HK — ')}`} target="_blank" rel="noopener noreferrer">` wrapping a `<Card className="p-6 hover:shadow-md transition-shadow">`. Card content: lucide `MessageCircle size-8 text-brand-green` (WhatsApp green = brand green), `<h3 className="text-h3 font-display mt-3">WhatsApp Hong Kong</h3>`, `<p className="text-small text-muted-foreground mt-1">Chat with our HK team</p>`, formatted phone number `<p className="text-body font-semibold text-foreground mt-2">+852 ... ...</p>`. |
| WhatsApp SG | Same structure, `+65 9807 6827` (per strategy PART 8.3). Pre-fill text: `Hello ProActiv Sports SG — `. |
| Conditional render | `{process.env.NEXT_PUBLIC_WHATSAPP_HK && <WhatsAppCard market="hk" ... />}` — if env var unset at execute, card omitted + build-time console warning emitted (per D-02). |

### 6.9 Email card (always rendered — uses `hello@proactivsports.com`)

Third card in the "Other ways to reach us" grid (or first if WhatsApp env vars are missing): `<a href="mailto:hello@proactivsports.com">` wrapping `<Card>` with lucide `Mail size-8 text-brand-navy`, h3 `Email us`, body `For anything that doesn't fit the form.`, address `hello@proactivsports.com` in `text-body font-semibold text-foreground`.

### 6.10 Resend route handler contract (`app/api/contact/route.ts`)

| Property | Value |
|----------|-------|
| Method | POST |
| Body (JSON) | `{ name: string, email: string, phone?: string, age?: string, message: string, market: 'hk' \| 'sg', subject?: string, 'bot-trap'?: string }` |
| Validation order | (1) Honeypot: if `bot-trap` non-empty → return 200 silently (don't leak rejection logic — D-04). (2) Required fields present + non-empty (name, email, message). (3) Market `∈ ['hk','sg']` → else 400 `{ error: 'Invalid market' }`. (4) Email regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) → else 400 `{ errors: { email: 'Invalid email format' } }`. (5) Message min/max length → else 400. |
| Resend call | `from: 'ProActiv Sports Website <onboarding@resend.dev>'` (D-05 — placeholder sender; Phase 10 swaps to `noreply@proactivsports.com` once DKIM/SPF live). `to: [process.env[`CONTACT_INBOX_${market.toUpperCase()}`]!]`. `replyTo: email`. `subject: '[' + market.toUpperCase() + '] ' + (subject || 'New enquiry') + ' — ' + name`. `react: <ContactEmail name={name} email={email} phone={phone} age={age} message={message} market={market} subject={subject} />` (single React Email template at `emails/contact.tsx` parameterised by market). |
| Success response | 200 `{ success: true, id: data?.id }` |
| Server error | 500 `{ error: 'Send failed', details: error.message }` (Sentry captures via existing instrumentation from Phase 0). |
| Env var preconditions (HUMAN-ACTION at execute) | `RESEND_API_KEY`, `CONTACT_INBOX_HK`, `CONTACT_INBOX_SG` MUST be set in `.env.local` + Vercel preview env BEFORE the contact backend plan runs (D-01). Plan task starts with env-existence check; halts with HUMAN-ACTION if missing. |
| `.env.example` additions | `RESEND_API_KEY=` · `CONTACT_INBOX_HK=` · `CONTACT_INBOX_SG=` · `NEXT_PUBLIC_WHATSAPP_HK=` · `NEXT_PUBLIC_WHATSAPP_SG=` · `NEXT_PUBLIC_HK_URL=https://hk.proactivsports.com/` · `NEXT_PUBLIC_SG_URL=https://sg.proactivsports.com/` (preview override pattern documented in README per Phase 1). |
| ContactPoint JSON-LD on /contact/ page | Single `<script type="application/ld+json">` rendering `{ "@context": "https://schema.org", "@type": "ContactPage", "url": "https://proactivsports.com/contact", "mainEntity": { "@type": "Organization", "@id": "https://proactivsports.com/#organization", "contactPoint": [{ "@type": "ContactPoint", "contactType": "customer service", "email": "hello@proactivsports.com", "areaServed": ["HK", "SG"], "availableLanguage": "English" }] } }`. |

### 6.11 React Email template (`emails/contact.tsx`)

Phase 3 ships ONE React Email template (NOT two per RESEARCH Topic 3 sample) — parameterised by `market` prop. Reduces duplication; same Phase 6 evolution.

| Element | Value |
|---------|-------|
| Subject (built in route handler) | `[HK] New enquiry — Maria Chen` (or `[SG] ...`) |
| Preheader | `Reply directly — this email's reply-to is the parent's address.` |
| Body | Heading `New enquiry from {market.toUpperCase()} website`. Table with: Name / Email (mailto link) / Phone / Child's age / Subject / Message (preserved newlines). Footer line `Sent via proactivsports.com — Resend ID {messageId}` for tracing. |
| Branding | Top: ProActiv Sports logo (loaded from `https://proactivsports.com/assets/logo.svg`). Footer color: navy (`#0f206c`). |

---

## 7. OG Image Template (`createRootOgImage` utility)

Single shared utility that all 7 root pages call from their `opengraph-image.tsx` files.

### 7.1 File contract

| Property | Value |
|----------|-------|
| File | `lib/og-image.tsx` (NEW — exports `createRootOgImage`) |
| Per-page consumer | `app/(root)/{page}/opengraph-image.tsx` — 5 lines, calls `createRootOgImage` with title + tagline |
| Output | `ImageResponse` (Next.js 15 `next/og`) |
| Dimensions | `width: 1200, height: 630` (standard OG spec; WhatsApp/iMessage cropping-safe per RESEARCH Topic 5) |
| Format | `contentType: 'image/png'` |
| File size cap | < 300KB (WhatsApp aggressive cache constraint per RESEARCH Pitfall — measured at execute on each page's generated image) |
| Generation | Static at build time (default — `opengraph-image.tsx` files have NO `export const dynamic = 'force-dynamic'`) |
| Font asset | `app/fonts/bloc-bold.ttf` (NEW — separate `.ttf` copy from the Phase 2 WOFF2; Satori requires raw TTF/OTF per Pitfall 4). HUMAN-ACTION precondition at execute time (Martin provides the .ttf alongside the WOFF2 from the original font license). If not provided, Plan task halts with HUMAN-ACTION. |

### 7.2 Visual template (binding)

| Layer (z-order, bottom to top) | Spec |
|--------------------------------|------|
| 1. Background | Solid navy `#0f206c` (PROJECT.md authoritative brand navy). NO gradient (anti-AI-SaaS rule + size budget). |
| 2. Bottom accent strip | 8px-tall horizontal strip at `bottom: 0`, full-width, `background: linear-gradient(90deg, #ec1c24 0%, #fac049 50%, #0fa0e2 100%)` — brand-color rainbow stripe. Subtle visual signature. |
| 3. Logo | Top-left, ProActiv white logo SVG. Position: `top: 64, left: 64`. Size: ~`width: 160px height: auto` (aspect preserved). Logo loaded from `app/assets/logo-white.svg` via `readFile(join(process.cwd(), 'app/assets/logo-white.svg'))` — passed as `src={dataUri}` to satori-img. |
| 4. Title | Large, Bloc Bold, white. Position: `bottom: 180px, left: 64`. Style: `fontFamily: 'Bloc Bold'`, `fontSize: 72`, `fontWeight: 700`, `color: '#ffffff'`, `lineHeight: 1.05`, `letterSpacing: '-0.015em'`, `maxWidth: 1000px`, `display: '-webkit-box'`, `WebkitLineClamp: 3`, `WebkitBoxOrient: 'vertical'`, `overflow: 'hidden'`. |
| 5. Tagline | Below title, `marginTop: 16`, Mont (or Inter fallback for Satori — see note), cream `#fff3dd`, `fontSize: 28`, `fontWeight: 400`, `lineHeight: 1.3`, `maxWidth: 1000px`. |

**Tagline font note:** Satori does NOT need Mont's TTF for tagline — using Bloc Bold for both title (Bloc) and tagline (Mont substitute by Bloc 400 weight) keeps the OG generation single-font. If a separate Mont .ttf is provided, planner uses it; otherwise tagline fallback is `fontFamily: 'system-ui'` (renders as system sans on Vercel/Linux build → Liberation Sans, acceptable). Document the choice in plan SUMMARY.

### 7.3 Per-page calls

| Page | OG title | OG tagline |
|------|----------|------------|
| `/` (gateway) | `Move. Grow. Thrive.` | `Children's gymnastics and sports in Hong Kong & Singapore. Since 2011.` |
| `/brand/` | `About ProActiv Sports` | `Brand story, history, and the people behind 14 years of children's coaching.` |
| `/coaching-philosophy/` | `How we coach.` | `Safety. Progression. Confidence. Three pillars across every ProActiv programme.` |
| `/news/` | `News & Press` | `ProActiv Sports in family and lifestyle media — Hong Kong and Singapore.` |
| `/careers/` | `Work with children. Build a career.` | `Join ProActiv Sports — coach roles and operations team in HK and SG.` |
| `/contact/` | `Get in touch.` | `Tell us about your child — we'll route you to the right venue and the right coach.` |
| `/privacy/` | `Privacy Policy` | `How ProActiv Sports collects and processes data — pending legal review.` |
| `/terms/` | `Terms of Use` | `Site usage terms — pending legal review.` |

### 7.4 `createRootOgImage` signature

```typescript
// lib/og-image.tsx
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

interface OgImageOptions {
  title: string;
  tagline: string;
}

export async function createRootOgImage({ title, tagline }: OgImageOptions): Promise<ImageResponse> {
  const blocBold = await readFile(join(process.cwd(), 'app/fonts/bloc-bold.ttf'));
  const logoSvg = await readFile(join(process.cwd(), 'app/assets/logo-white.svg'), 'utf-8');
  const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString('base64')}`;
  // ...JSX returning the layered template per §7.2
  return new ImageResponse(/* JSX */, {
    width: 1200,
    height: 630,
    fonts: [{ name: 'Bloc Bold', data: blocBold, weight: 700, style: 'normal' }],
  });
}
```

### 7.5 Per-page consumer file (5 lines)

```typescript
// app/(root)/brand/opengraph-image.tsx
import { createRootOgImage } from '@/lib/og-image';
export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function OG() { return createRootOgImage({ title: 'About ProActiv Sports', tagline: 'Brand story, history, and the people behind 14 years of children's coaching.' }); }
```

### 7.6 Verification at execute

| Check | Expected |
|-------|----------|
| Each page's OG image generated at build | File exists at `.next/server/app/(root)/{page}/opengraph-image*.png` after `pnpm build` |
| File size cap | Each generated PNG < 300KB (Pitfall WhatsApp cache) — measured via `ls -la` |
| OG meta tag absolute URL | After deploy, `curl https://<preview>.vercel.app/<page>` and grep for `<meta property="og:image"` — value MUST be absolute HTTPS URL (Pitfall 1 — `metadataBase` correctly set) |
| WhatsApp / iMessage manual smoke | Paste preview URL into WhatsApp Web / iMessage; image renders as preview card. Manual checkpoint at Phase gate. |

---

## 8. Metadata + JSON-LD Contract (Phase 3 SEO minimum)

Phase 3 ships the SEO MINIMUM (per RESEARCH Topic 7). Sitemap, robots.txt, BreadcrumbList, llms.txt are PHASE 7. Planner MUST NOT scope SEO-02..SEO-04 into Phase 3 plans.

### 8.1 Root layout `metadata` (base)

`app/(root)/layout.tsx` exports the base metadata:

```typescript
const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),  // CRITICAL — without this, OG image URLs are relative and WhatsApp breaks (Pitfall 1)
  title: {
    default: 'ProActiv Sports | Children\'s Gymnastics & Sports — Hong Kong & Singapore',
    template: '%s | ProActiv Sports',
  },
  description: 'Children\'s gymnastics and sports specialist in Hong Kong (ProGym Wan Chai & Cyberport) and Singapore (Prodigy @ Katong Point). Since 2011. Ages 2–16.',
  openGraph: {
    siteName: 'ProActiv Sports',
    locale: 'en_GB',
    type: 'website',
  },
  // No `robots` — Phase 0 D-15 sets X-Robots-Tag at the response-header level for non-prod.
};
```

### 8.2 Per-page metadata (binding)

**Important — Pitfall 2:** Next.js metadata merging is shallow at the `openGraph` object level. Each page MUST declare its FULL `openGraph` object (siteName, locale, type, title, description, url, images) — NOT rely on inheritance for these.

| Page | `title` | `description` |
|------|---------|---------------|
| `/` | `Move. Grow. Thrive — Children's Gymnastics & Sports in HK & Singapore` (NO template applied — root home overrides default) | `ProActiv Sports has been shaping how children move since 2011. Dedicated gymnastics and sports programmes across three venues in Hong Kong and Singapore.` |
| `/brand/` | `About ProActiv Sports — Brand Story, History & Mission` (template applies → `... | ProActiv Sports`) | `ProActiv Sports is a children's gymnastics and sports specialist founded in Hong Kong in 2011. Read our brand story, meet the founders, and understand our mission.` |
| `/coaching-philosophy/` | `Coaching Philosophy — Safety, Progression, Confidence` | `How ProActiv Sports trains every coach: a shared methodology built on safety standards, structured skill progression, and a deep commitment to children's confidence.` |
| `/news/` | `News & Press — ProActiv Sports` | `ProActiv Sports in leading family and lifestyle publications across Hong Kong and Singapore. Coverage coming soon.` |
| `/careers/` | `Careers — Coach with ProActiv Sports` | `Work with children at ProActiv Sports. Open application for coaching roles and operations team across Hong Kong and Singapore.` |
| `/contact/` | `Contact — Enquire with the HK or SG team` | `Get in touch with ProActiv Sports — Hong Kong (ProGym Wan Chai & Cyberport) or Singapore (Prodigy @ Katong Point). Reply within one business day.` |
| `/privacy/` | `Privacy Policy (Draft)` | `Draft privacy policy for proactivsports.com — pending lawyer review for HK PDPO and SG PDPA compliance.` |
| `/terms/` | `Terms of Use (Draft)` | `Draft terms of use for proactivsports.com — pending lawyer review.` |

Each page's `openGraph.images` is a single-entry array pointing to its `opengraph-image` route (Next.js auto-resolves: `/brand/opengraph-image` → `/brand/opengraph-image.png` at the deployed URL).

### 8.3 Inline JSON-LD on `/` (gateway homepage only)

Single `<script type="application/ld+json">` containing `@graph` array with three nodes (Organization + WebSite + FAQPage). FAQPage `mainEntity` MUST list the 6 Q&A pairs from §3.7 verbatim — answer text MUST match visible page copy character-for-character (Google FAQPage rich-result rule).

```typescript
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://proactivsports.com/#organization",
      "name": "ProActiv Sports",
      "url": "https://proactivsports.com/",
      "logo": "https://proactivsports.com/assets/logo.svg",
      "foundingDate": "2011",
      "foundingLocation": { "@type": "Place", "name": "Hong Kong" },
      "description": "ProActiv Sports is a children's gymnastics and sports specialist founded in Hong Kong in 2011...",
      "sameAs": [
        "https://www.facebook.com/proactivsportshk/",
        "https://www.instagram.com/proactivsports/"
      ],
      "areaServed": [
        { "@type": "City", "name": "Hong Kong" },
        { "@type": "City", "name": "Singapore" }
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://proactivsports.com/#website",
      "url": "https://proactivsports.com/",
      "name": "ProActiv Sports",
      "publisher": { "@id": "https://proactivsports.com/#organization" }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "What is ProActiv Sports?", "acceptedAnswer": { "@type": "Answer", "text": "ProActiv Sports is a children's gymnastics and sports specialist founded in Hong Kong in 2011..." } },
        // ...5 more from §3.7 verbatim
      ]
    }
  ]
};
```

### 8.4 Inline JSON-LD on `/contact/` only

ContactPage schema per §6.10. No JSON-LD on `/brand/`, `/coaching-philosophy/`, `/news/`, `/careers/`, `/privacy/`, `/terms/` in Phase 3 — full schema treatment is Phase 7.

### 8.5 Skip-link + a11y contract (WCAG 2.2 AA — PROJECT.md non-negotiable)

| Requirement | Implementation |
|-------------|----------------|
| Skip-link as first child of `<body>` | Per §5.2 RootNav row — class chain `sr-only focus:not-sr-only ...` |
| `<main id="main-content">` wraps page content | In `app/(root)/layout.tsx` between RootNav and RootFooter |
| One `<h1>` per page | Each page MUST have exactly one h1 (gateway: hero H1 — "Move. Grow. Thrive..."; supporting pages: their hero H1) |
| Heading hierarchy | h1 → h2 (section headings) → h3 (sub-sections, FAQ questions, leadership names). NO skipped levels. NO h2 outside `<Section>`. |
| Focus indicators | Every interactive element has `focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none` (Phase 1 button.tsx pattern). Custom Phase 3 components inherit via shadcn Card composition. |
| Touch targets | All Buttons use `size="touch"` for marketing/conversion CTAs (44×44px — see §5.2 nav exception for compact `size="sm"` persistent nav links — those rely on `min-h-11` flex padding for hit-area). |
| Image alt text | EVERY `<Image>` non-empty descriptive alt. NO empty/decorative alts in Phase 3 (all images are meaningful real photography). |
| Color contrast | Inherited from Phase 2 §1.3 contrast audit. Yellow ONLY as fill (never text on white); navy/cream/white pairings used per audit table. |
| Keyboard navigation | Tab through hero CTAs → main nav → footer links → FAQ accordion (Space/Enter toggle) → contact form. Verified by manual keyboard walk before phase gate. |
| Reduced motion | `prefers-reduced-motion: reduce` disables: MarketCard hover scale, gateway nav backdrop-blur transition, form-show transition. Use Tailwind `motion-safe:` and `motion-reduce:` utilities. |
| Lang attribute | `<html lang="en-GB">` in `app/layout.tsx` (project root layout — NOT root group layout) |

### 8.6 Performance contract (PROJECT.md budget — non-negotiable)

| Metric | Target | How Phase 3 hits it |
|--------|--------|---------------------|
| Lighthouse Performance (mobile) | ≥ 95 | RSC by default · single `priority` image (hero only) · no client-side state above the fold · no third-party JS · static OG images at build |
| Lighthouse Accessibility | ≥ 95 | §8.5 above |
| Lighthouse Best Practices | ≥ 95 | HTTPS (Vercel) · no console errors · `rel="noopener"` on external links · CSP-compatible (no inline scripts except JSON-LD with `dangerouslySetInnerHTML`) |
| Lighthouse SEO | ≥ 95 | Per-page metadata · valid OG · single h1 · descriptive links · alt text |
| LCP | < 2.5s (mobile throttled) | Hero `<Image>` is LCP element · `priority` + `fetchPriority="high"` (auto from `priority`) · self-hosted fonts with `display: 'swap'` (no blocking font fetch) · Vercel Image Optimization auto-serves AVIF/WebP |
| INP | < 200ms | Hover transitions ≤ 300ms · contact form interactions debounced · no layout-thrashing animations · `useTransition` for form submit (React 19 default optimisation) |
| CLS | < 0.1 | Self-hosted fonts (no FOIT) · image dimensions explicit (`fill` with sized parent or explicit `width/height`) · no late-loading content above the fold · skeleton states reserve space |
| Bundle weight (homepage) | < 100KB JS gzipped (target) | Server Components for all sections · client-only for: contact-form.tsx, root-nav-mobile.tsx, opengraph-image.tsx (build time, not shipped to client). NO analytics, NO CMS clients on root in Phase 3. |
| Forbidden additions (perf budget gates) | NO `iubenda`, `Termly` (D-08 — cookie consent JS hurts CLS) · NO Mux video on root (D-09) · NO CAPTCHA libraries (D-04) · NO Vercel KV (D-04) · NO chat widgets (Crisp, Intercom) · NO carousel libraries on root |

---

## 9. Design Quality Checklist — Six pillars for `gsd-ui-checker`

Phase 3 inherits all 6 Phase 2 pillars + adds Phase 3-specific page-level checks.

### Pillar 1 — Typography (hierarchy, CLS, Baloo exclusion)
- [ ] Bloc Bold + Mont loaded via Phase 2 `next/font/local` setup; **Baloo NOT loaded on root layer** (D-03 inheritance)
- [ ] Every page has exactly ONE h1
- [ ] Heading hierarchy h1 → h2 → h3 with NO skipped levels
- [ ] CLS < 0.1 on all 7 pages (mobile throttled Lighthouse)
- [ ] Type scale only consumes Phase 2 utilities (`text-display`, `text-h1`, `text-body`, etc.) — no arbitrary `text-[Npx]` values

### Pillar 2 — Color system (Phase 2 contrast audit binding)
- [ ] Every section's background + text pairing passes Phase 2 §1.3 contrast table (navy on white, cream on navy, navy on cream, navy on yellow ONLY for badges)
- [ ] NO raw hex in `components/root/*.tsx` or `app/(root)/**/*.tsx` — `grep -rn "#[0-9a-fA-F]\{6\}" components/root/ app/\(root\)/` returns empty (raw hex allowed only in `app/globals.css` and inside `lib/og-image.tsx` for Satori)
- [ ] Yellow used ONLY as background fill (draft banner on /privacy/ + /terms/, secondary Badge variant) — NEVER as text color on white
- [ ] No purple/blue gradients anywhere (anti-AI-SaaS)

### Pillar 3 — Spacing & rhythm (Phase 2 Section primitive consumption)
- [ ] Every page section uses `<Section size="sm|md|lg">` — NO ad-hoc `py-N` values
- [ ] Every horizontal layout wraps in `<ContainerEditorial width="narrow|default|wide">`
- [ ] Editorial asymmetry (§13 below) verified per page

### Pillar 4 — Component consistency (composition only, no new tokens)
- [ ] Phase 3-local components live at `components/root/`, NOT `components/ui/` (D-11)
- [ ] No new design tokens in `app/globals.css` — Phase 2 contract is exhaustive
- [ ] LeadershipCard, RootNav, RootFooter each export typed Props interface
- [ ] CVA used if a Phase 3-local component adds 2+ visual variants (none currently — keep simple)
- [ ] Cross-market CTAs use absolute `<a href={NEXT_PUBLIC_HK_URL}>` — never `<Link>` (Pitfall 7)
- [ ] Contact form uses shadcn `Input` + `Textarea` + `Label` primitives (added at plan time — stock-cli shadcn, not Phase 3 invention)

### Pillar 5 — Accessibility (WCAG 2.2 AA — PROJECT.md non-negotiable)
- [ ] Skip-link as first child of body, `sr-only` until focused
- [ ] `<main id="main-content">` exists in root layout
- [ ] All interactive elements Tab-reachable in DOM order
- [ ] Contact form market selector implements `role="radiogroup"` + `aria-checked` per card
- [ ] Form fields have `<Label htmlFor>` + required marker + `aria-invalid` on error + `aria-describedby` pointing to error message
- [ ] FAQItem (Phase 2 Accordion) keyboard: Space/Enter toggle, Arrow Up/Down navigate
- [ ] Touch targets ≥ 44×44px on every consumer-facing CTA (`size="touch"` on Button)
- [ ] Every `<Image>` has non-empty descriptive alt
- [ ] `prefers-reduced-motion: reduce` disables hover scales + form show transitions
- [ ] Lighthouse Accessibility ≥ 95 on all 7 pages

### Pillar 6 — Performance (LCP/CLS/INP measured per page)
- [ ] Lighthouse mobile Performance ≥ 95 on `/`, `/brand/`, `/coaching-philosophy/`, `/news/`, `/careers/`, `/contact/`, `/privacy/`, `/terms/`
- [ ] LCP < 2.5s on `/` (gateway hero is LCP element with `priority`)
- [ ] CLS < 0.1 on every page (font-swap CLS = 0 inherited from Phase 2 D-02)
- [ ] INP < 200ms (hover transitions ≤ 300ms; form interactions debounced)
- [ ] Only ONE `priority` image per page (gateway hero; supporting pages: hero photos may be `priority` if above fold + LCP-relevant)
- [ ] OG images < 300KB each (WhatsApp cache)
- [ ] No new client-side dependencies that hurt budget: NO iubenda/Termly · NO CAPTCHA · NO carousel · NO chat widget
- [ ] Static OG generation at build (not edge runtime per request)

---

## 10. Copywriting Contract (Voice — strategy §14.3 binding)

Strategy §14.3 voice: *"Brand voice in microcopy — 'Come say hi' beats 'Contact us'. 'We'd love to meet your child' beats 'Submit enquiry'."*

### 10.1 Macro copy (verbatim from strategy PART 6A)

All 8 gateway sections + supporting page hero/body copy is verbatim from PART 6A or the canonical §10.2 / §10.4 paragraphs. Executor MUST NOT paraphrase.

### 10.2 Micro copy (CTAs, labels, helpers, errors)

| Surface | Copy |
|---------|------|
| **Primary CTA (gateway hero)** | `Enter Hong Kong →` · `Enter Singapore →` (verbatim PART 6A) |
| **Primary CTA (supporting pages closing)** | `Book a Free Trial in Hong Kong` · `Book a Free Trial in Singapore` (deep links to market `/book-a-trial/`) |
| **Contact form submit** | `Send message` (loading: `Sending...`) — NOT "Submit enquiry" or "Get in touch" |
| **Contact form heading** | `Get in touch.` (with period — declarative, brand voice) |
| **Contact form selector helper** | `Where are you enquiring about?` (NOT "Select your market" — converts to a question) |
| **Contact form pre-pick prompt** | `Please select your location to continue.` |
| **Contact form success** | H2: `Thanks — we'll be in touch.` Body: `We've received your message. A member of the {market} team will reply within one business day. Check your inbox for a confirmation copy.` |
| **Contact form error (network)** | H3: `Something went wrong.` Body: `We couldn't send your message right now. Please try again, or email us directly at hello@proactivsports.com.` |
| **Contact form field error — email** | `Please enter a valid email address.` |
| **Contact form field error — required** | `{Field name} is required.` (e.g., "Your name is required.") |
| **Contact form field error — message too short** | `Please give us a bit more detail (at least 10 characters).` |
| **News empty state heading** | `Coverage coming soon.` |
| **News empty state body** | `We've been featured in family and lifestyle publications across Hong Kong and Singapore. Sign up below and we'll let you know when we publish press highlights.` |
| **News form button** | `Notify me of press updates` |
| **Careers open application CTA** | `Send us your application →` |
| **Privacy/Terms draft banner** | `⚠️ DRAFT POLICY — This document is pending legal review and is not yet binding. Live policy ships before public launch.` |
| **Email contact line (gateway, contact, leadership pages)** | `Not sure which is right for you? Email hello@proactivsports.com and we'll help.` (verbatim PART 6A) |
| **Footer tagline** | `Children's gymnastics and sports in Hong Kong and Singapore. Since 2011.` |
| **Footer copyright** | `© {year} ProActiv Sports. All rights reserved.` |
| **Skip-link** | `Skip to main content` |
| **Logo aria-label** | `ProActiv Sports — home` |
| **Mobile menu button aria-label** | `Open navigation menu` (closed) / `Close navigation menu` (open) |
| **WhatsApp HK label** | `WhatsApp Hong Kong` (NOT "WhatsApp HK" — full word in marketing copy) |
| **WhatsApp pre-fill text (HK)** | `Hello ProActiv Sports HK — ` |
| **WhatsApp pre-fill text (SG)** | `Hello ProActiv Sports SG — ` |
| **No destructive actions in Phase 3** | The contact form has no destructive states; the only `variant="destructive"` usage is for error message styling. No "Delete" / "Remove" actions in scope. |

### 10.3 Forbidden patterns (strategy §14.3)

- ❌ "Get started" — replace with specific verb ("Book a free trial", "Send message", "Enter Hong Kong")
- ❌ "Submit enquiry" — replace with conversational verb ("Send message", "Tell us about your child")
- ❌ "Contact us" — replace with "Get in touch" or "Email us"
- ❌ "Click here" links — every link describes its destination
- ❌ Generic "Learn more" — be specific ("Read the coaching philosophy")

---

## 11. Decisions Locked — Binding to UI-SPEC sections

Each of the 11 user-locked decisions from 03-CONTEXT.md → where it's encoded here.

| Decision | What it locks | Encoded in UI-SPEC sections |
|----------|---------------|-----------------------------|
| **D-01** Contact inboxes are HUMAN-ACTION env vars (`CONTACT_INBOX_HK/SG`) | Contact backend halts at execute if env missing | §6.10 env-var preconditions |
| **D-02** WhatsApp numbers are HUMAN-ACTION env vars (`NEXT_PUBLIC_WHATSAPP_HK/SG`) | WhatsApp cards conditionally render only when env set | §6.8 conditional render |
| **D-03** `/contact/` force-pick market UX (no default) | Selector is first form element; form fields hidden until pick; helper text "Please select your location first" | §6.4 force-pick guard |
| **D-04** Honeypot only — no CAPTCHA, no Vercel KV | Hidden `bot-trap` input + server silently accepts honeypot trips | §6.5 field 7 + §6.10 validation order |
| **D-05** Resend sender = `onboarding@resend.dev` at Phase 3 | `from:` field hardcoded; Phase 10 swap is one-line config | §6.10 Resend call row |
| **D-06** `/news/` ships as "Coming soon" placeholder + email signup | Empty TS array + empty-state component; Phase 6 swap is GROQ replacement | §4.3 page structure |
| **D-07** `/careers/` ships as evergreen + open-application CTA → `/contact/?subject=job` | No live listings; client form pre-fills via `useSearchParams()` | §4.4 page structure + §6.5 field 8 |
| **D-08** `/privacy/` + `/terms/` ship as MDX placeholders + yellow draft banner | Yellow banner Card with WCAG-AAA navy text on yellow fill | §4.6 page structure + draft banner |
| **D-09** Root gateway hero is static photo (no video) | Hero uses `<Image priority>` with `priority` only on this image | §3.1 + §8.6 perf |
| **D-10** Leadership portraits HUMAN-ACTION precondition (no placeholders) | Plan task starts with file-existence check on 3 portraits; halts if missing | §3.6 portrait HUMAN-ACTION row |
| **D-11** LeadershipCard is Phase 3-local (`components/root/`), not `components/ui/` | Composition of Phase 2 Card + Avatar + Badge; no shadcn registration | §5.1 file location |

---

## 12. Out of Scope — Phase 3 DEFERRED (checker reads this to avoid false-flagging)

Mirrors 03-CONTEXT.md `<deferred>`. None are checker-blockers for Phase 3.

| Deferred item | Moves to | Why not in Phase 3 |
|---------------|----------|---------------------|
| Sitemap.xml, robots.txt, llms.txt, BreadcrumbList JSON-LD | Phase 7 | Phase 3 ships SEO MINIMUM (per-page metadata + Organization/WebSite/FAQPage/ContactPage JSON-LD only) |
| LocalBusiness schema (Wan Chai, Cyberport, Katong Point) | Phase 7 | Lives on market location pages (Phase 4/5), not root |
| CMS-fed content (Sanity for /brand/, /news/, /careers/, /coaches/) | Phase 6 | Phase 3 uses MDX + TS arrays; clean Phase 6 migration seam |
| Cloudflare WAF + rate limiting | Phase 10 | Honeypot + Resend GDPR-compliance is sufficient for preview-URL Phase 3 |
| DKIM/SPF for `noreply@proactivsports.com` | Phase 10 | DNS not at Cloudflare until Phase 10; `onboarding@resend.dev` works immediately |
| Lawyer-drafted PDPA + PDPO Privacy + Terms | Phase 9/10 | Phase 3 ships placeholder MDX with draft banner |
| Mux video hero on root | Phase 10 (only if launch metrics warrant) | D-09 inheritance — strategy §3 §1 specifies static photo |
| Live careers job listings | Phase 6 | D-07 — evergreen page now |
| Real press list with logo treatments | Phase 6 | D-06 — empty array now |
| LeadershipCard as DS primitive | Never | D-11 — Phase 3-local composition |
| Placeholder silhouettes for missing portraits | Never | D-10 — HUMAN-ACTION precondition blocks execute |
| iubenda/Termly auto-legal | Never | D-08 — perf budget + cross-jurisdiction lawyer review necessity |
| reCAPTCHA / Turnstile / hCAPTCHA | Never | D-04 — friction unacceptable; Cloudflare WAF Phase 10 handles bots |
| Vercel KV rate limiting | Phase 10 | D-04 — Cloudflare WAF supersedes |
| Multilingual contact form (zh-HK) | v1.5 (POST-03) | PROJECT.md Out of Scope |
| Account portal for parents | v1.5 (POST-02) | PROJECT.md Out of Scope |
| Direct online booking with payment | v1.5 (POST-01) | PROJECT.md Out of Scope |
| Carousel/slider on testimonials | Phase 4/5 if needed | Phase 3 ships ONE testimonial in §3.5 — no carousel needed; future need is per-market homepage concern |
| Newsletter platform integration (Mailchimp etc.) | Post-launch ops | News-page email signup uses contact route handler with subject="Press notification list" — minimal infra |

---

## 13. Editorial Asymmetry Pass — Phase 3 application of strategy §14.3

Inherits Phase 2 §7 guardrails. Phase 3 ADDS section-by-section verification on the gateway homepage:

### 13.1 Gateway homepage — alternation log (binding)

Per RESEARCH Topic 1: every section MUST follow the alternation pattern below. Checker scans for violations.

| Section | Layout pattern | Asymmetry rationale |
|---------|----------------|---------------------|
| §3.1 HERO | 12-col split: text col-span-6 / image col-span-6 | Editorial split — anchors brand |
| §3.2 STORY | Centred narrow column + horizontal stat strip below | Intentional contrast vs §3.1 grid |
| §3.3 MARKET CARDS | 2-col symmetric grid | PERMITTED EXCEPTION — symmetry = "equal weight" for HK/SG |
| §3.4 WHAT WE DO | 5-tile equal row (mobile: stacked; desktop: 5-col) | PERMITTED EXCEPTION — icon tiles per RESEARCH Topic 1 note |
| §3.5 TRUST STRIP | Full-bleed dark surface; logos row + centred testimonial | Strong tonal break from §3.4's white tiles |
| §3.6 LEADERSHIP | 3-col portrait row with caption-length variation | Asymmetry via copy density (Will short, Monica long) |
| §3.7 FAQ | Narrow centred reading column | Intentional contrast vs §3.6 wide grid |
| §3.8 FINAL CTA | Centred close, full-bleed cream | Emotional close — only centred section after hero |

**No section can use the same exact pattern as the prior section.** The two PERMITTED EXCEPTIONS (§3.3 + §3.4) are documented and binding — checker does NOT flag these as asymmetry violations.

### 13.2 Supporting pages — asymmetry minimum

Each supporting page MUST have AT LEAST TWO different layout patterns. Single-pattern pages (e.g., a stack of identical cards) fail this check.

| Page | Patterns used | Pass? |
|------|---------------|-------|
| /brand/ | Hero split + centred prose + timeline cards + 3-col leadership + stat strip + logo wall + cream CTA → 6+ patterns | ✅ |
| /coaching-philosophy/ | Hero split + 3-col pillars + single callout card + 2-col leadership + cream CTA → 5 patterns | ✅ |
| /news/ | Hero centred + empty-state card + signup form + cream CTA → 4 patterns | ✅ |
| /careers/ | Hero split + 12-col text+image + bullet list + centred application card → 4 patterns | ✅ |
| /contact/ | Hero centred + form card + 3-col alternative contact grid → 3 patterns | ✅ |
| /privacy/ + /terms/ | Yellow banner card + heading + prose body + cream CTA footer → 4 patterns | ✅ |

### 13.3 Anti-AI-SaaS quick scan (Phase 2 §7.1 binding for Phase 3)

| Pattern | Phase 3 status |
|---------|----------------|
| Centre-aligned hero with gradient blob | ❌ NOT USED — gateway hero is split editorial; supporting hero photos are real |
| Purple-to-blue gradient anywhere | ❌ NOT USED — only navy / cream / yellow / brand greens-skies-reds |
| Identical 3-col features with round-icon tiles | ❌ NOT USED — §3.4 5-tile row uses lucide icons in `text-brand-navy` (no round chip wrap); §4.2 3-pillar coaching uses larger icons + text |
| Stock photography | ❌ NOT USED — all images trace to `public/photography/` (Phase 2 D-07 Martin curation) |
| Ghost-button as primary CTA | ❌ NOT USED — primary CTAs are `variant="default"` (navy fill); ghost reserved for nav links |
| Generic Lottie animations | ❌ NOT USED — no Lottie deps; only CSS hover transitions ≤300ms |
| Uniform card grids per section | ❌ NOT USED — §13.1 alternation enforced |

---

## 14. Requirement Traceability (GW-01 .. GW-07 → UI-SPEC sections)

Every requirement assigned to Phase 3 maps to at least one UI-SPEC section.

| Req | REQUIREMENTS.md wording | Encoded in UI-SPEC sections |
|-----|--------------------------|-----------------------------|
| **GW-01** Root homepage `/` ships per strategy PART 3 wireframe + PART 6A copy — 8 sections, dual market entry, real photo hero, FAQ, leadership cards | §3 (entire section-by-section spec) · §3.1 hero + dual CTA · §3.6 leadership · §3.7 FAQ |
| **GW-02** `/brand/` entity page (LLM-citable brand statement + history + leadership) | §4.1 page structure · §4.1 LLM-citable paragraph (verbatim §10.2) |
| **GW-03** `/coaching-philosophy/` shared methodology + safety standards | §4.2 page structure · 3-pillar section |
| **GW-04** `/news/` press & media mentions (CMS-fed) | §4.3 page structure (D-06 placeholder + Phase 6 swap seam) |
| **GW-05** `/careers/` with role listings (CMS-fed) | §4.4 page structure (D-07 evergreen + Phase 6 swap seam) |
| **GW-06** `/contact/` master contact form with market routing (HK/SG selector) | §6 (entire contact form UX) · §6.4 market selector · §6.10 Resend route handler with market-routed inbox |
| **GW-07** `/privacy/`, `/terms/` legal pages (CMS-fed for editability) | §4.6 page structure (D-08 MDX placeholder; CMS conversion is Phase 6) |

All 7 requirements encoded. Zero gaps.

---

## 15. Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official (`https://ui.shadcn.com/`) | Phase 3 adds: `input`, `textarea`, `label`, `sheet` (mobile menu drawer). Reuses Phase 1 Button + Phase 2 Card/Accordion/Badge/Avatar/Separator. | not required (first-party registry) |
| third-party shadcn registries (tremor, aceternity, magicui, etc.) | **NONE** — Phase 3 does not use any | n/a |
| npm packages (Resend ecosystem + MDX) | `resend@6.x`, `@react-email/components@1.x`, `next-mdx-remote@6.x`, `gray-matter@4.x` — all from canonical npm publishers (Resend Inc., HashiCorp), audited via `pnpm audit` (Phase 0 D-08 enforces clean audit) | Standard npm audit; no shadcn registry vetting needed |

`components.json.registries` stays as the empty object `{}` (Phase 1 Plan 01-02 first-party-only lock — Phase 3 does NOT edit). If Phase 4+ introduces a third-party shadcn registry, the `gsd-ui-researcher` registry vetting gate runs first.

---

## 16. Phase 4+ Hand-off Notes

> For the next UI researcher (Phase 4 HK market), not the Phase 3 checker.

1. **Phase 3 unlocks the Baloo activation pattern.** Phase 4 wires `baloo.variable` to HK ProGym-scoped layouts (`app/(hk)/wan-chai/layout.tsx`, `app/(hk)/cyberport/layout.tsx`, and any `<ProGymBranded>` wrapper components). Root-level pages (Phase 3) NEVER opt in.
2. **Cross-market CTAs from HK/SG back to root use `<Link href="/brand/">` (relative path)** because they're SAME-host navigation. Only root-to-market and market-to-market navigation uses absolute `<a href={NEXT_PUBLIC_*_URL}>`.
3. **The contact route handler at `app/api/contact/route.ts` is shared infrastructure.** Phase 4 HK booking forms POST to `/api/contact` with `market=hk` and a relevant `subject` field. Phase 5 SG does the same. Phase 6 may extend the route to fork by `subject` (e.g., `subject=booking` triggers a different React Email template + a CRM webhook in addition to Resend).
4. **OG image utility `createRootOgImage` is root-scoped.** HK and SG market pages need their own `createMarketOgImage(market, title, tagline)` utility (similar template, market label in corner). Phase 4 UI-SPEC defines this.
5. **LeadershipCard composition pattern is reusable for `<CoachCard>` (Phase 4/5).** Same Card + Badge + Avatar/Image structure; coach cards add a "Book with this coach" CTA. Phase 4/5 plans extend or compose against `LeadershipCard` (or extract a shared `<PersonCard>` parent).
6. **RootNav + RootFooter are root-only.** Phase 4 ships `<HKNav>` + `<HKFooter>` (with venue NAP, ProGym wordmark, Baloo accent on ProGym-scoped surfaces). Phase 5 ships `<SGNav>` + `<SGFooter>` (with Prodigy wordmark + Katong Point address).
7. **The Phase 3 `<Section size>` + `<ContainerEditorial width>` rhythm carries forward.** Phase 4/5 pages MUST use the same primitives — no new layout wrappers. If a section pattern emerges that Phase 2 primitives can't express, Phase 2.1 revision required (NOT a market-local invention).

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: — (pending gsd-ui-checker review)
- [ ] Dimension 2 Visuals: —
- [ ] Dimension 3 Color: —
- [ ] Dimension 4 Typography: —
- [ ] Dimension 5 Spacing: —
- [ ] Dimension 6 Registry Safety: —
- [ ] Pillar 1 Typography (Baloo exclusion + CLS): —
- [ ] Pillar 2 Color WCAG AA (Phase 2 contrast audit): —
- [ ] Pillar 3 Spacing/rhythm (Section primitive consumption): —
- [ ] Pillar 4 Component consistency (composition only): —
- [ ] Pillar 5 Accessibility (WCAG 2.2 AA + skip-link + force-pick form): —
- [ ] Pillar 6 Performance (Lighthouse 95+ on all 7 pages): —
- [ ] §13 Editorial asymmetry alternation pass on gateway: —
- [ ] §14 all 7 requirements traced: —
- [ ] §11 all 11 decisions encoded: —

**Approval:** pending (gsd-ui-checker, Phase 3 scope)

---

*Phase: 03-root-gateway-and-supporting-root-pages*
*Created 2026-04-23 by gsd-ui-researcher consuming 03-CONTEXT.md (11 locked decisions) + 03-RESEARCH.md (10 topics, 8 pitfalls) + 02-UI-SPEC.md (Phase 2 token + primitive contract — inherited exhaustively) + strategy §PART 3 / §PART 6A / §PART 9.3 / §PART 10.2 / §PART 14.3.*
*All 7 requirements (GW-01..GW-07) addressed. All 11 user decisions (D-01..D-11) encoded.*

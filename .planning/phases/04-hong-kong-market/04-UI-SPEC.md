---
phase: 4
slug: hong-kong-market
status: draft
shadcn_initialized: true
preset: style=radix-nova + base-color=neutral + css-variables=true + rsc=true + iconLibrary=lucide
created: 2026-04-24
requirements: [HK-01, HK-02, HK-03, HK-04, HK-05, HK-06, HK-07, HK-08, HK-09, HK-10, HK-11, HK-12]
upstream_inputs:
  - 04-CONTEXT.md (D-01..D-10 locked)
  - 04-RESEARCH.md (8 patterns, 8 pitfalls, validation architecture)
  - 03-UI-SPEC.md (RootNav/RootFooter/contact-form patterns mirrored into HK)
  - 02-UI-SPEC.md (token + primitive contract — Phase 4 inherits, does not redefine)
  - 02-CONTEXT.md (D-01 typography pivot, D-06 VideoPlayer + Mux deferral, D-07 photo curation)
  - 01-CONTEXT.md (D-02 host authority, D-04 internal rewrite)
  - PROJECT.md (palette navy #0f206c + red #ec1c24, anti-AI-SaaS, perf budget)
  - REQUIREMENTS.md HK-01..HK-12
  - strategy.md §PART 4 (HK 12-section wireframe), §PART 6B (HK verbatim copy), §PART 8 (local SEO), §PART 9.4 (LocalBusiness skeleton), §PART 12 (8 gymnastics programmes), §PART 14 (photography + visual direction)
---

# Phase 4 — UI Design Contract (Hong Kong Market)

> **Scope reminder:** Phase 4 is a *composition and content phase, not an invention phase*. 22 HK pages assemble from Phase 2 `components/ui/` primitives and Phase 3 patterns (HKNav/HKFooter mirror RootNav/RootFooter architecture). **No new design-system tokens.** **No new shadcn primitives beyond what Phase 3 registered** (`NavigationMenu` is the only net-new Radix primitive needed — dropdown for Gymnastics + Locations nav items). Market-scoped compositions live at `components/hk/` (Phase 3 D-11 precedent — HK compositions do NOT go in `components/ui/`). Baloo 2 (accent font) activates on the HK layer per Phase 2 D-03 (Unbounded + Manrope + Baloo 2, all OFL). This contract binds planner and executor; deviation requires a Rule 1 correction in the plan SUMMARY.

---

## 0. How this contract is used

| Consumer | What they pull from here |
|----------|--------------------------|
| `gsd-planner` | §3 HK homepage section map · §4 supporting HK page specs · §5 Phase 4-local components (HKNav/HKFooter/VenueMap/GymPillarNav/BookingForm) · §6 booking-form UX · §7 OG template · §8 a11y + JSON-LD · §10 copy verbatim · §11 decisions map |
| `gsd-executor` | §3–§6 prop interfaces · §5 component signatures · §10 verbatim HK copy · §11 HUMAN-ACTION gates (Mux playback ID, map embeds, phone, opening hours, portraits) |
| `gsd-ui-checker` | §9 six-pillar quality checklist · §13 editorial-asymmetry pass · §14 requirement traceability |
| `gsd-ui-auditor` | post-execute diff of `app/hk/**`, `components/hk/**`, `lib/hk-data.ts`, `app/api/contact/` (extended), against this contract |

---

## 1. Inheritance from Phases 1–3 — what Phase 4 does NOT redefine

Phase 4 is binding on the inherited contract. Re-asking these would create drift.

| Inherited from | Where to find it | What Phase 4 does with it |
|----------------|------------------|---------------------------|
| Brand palette (navy/red/green/sky/yellow/cream) as `--color-brand-*` | Phase 2 UI-SPEC §1.2 + `app/globals.css` `@theme { }` | Consumes via `bg-brand-navy`, `text-brand-red`, etc. NEVER raw hex. |
| Semantic shadcn token mapping (`--primary` = navy, `--secondary` = yellow, `--accent` = white [post-amendment], `--destructive` = red) | Phase 2 UI-SPEC §1.4 (amended 2026-04-23 — cream → pure white on `--muted` + `--accent`) | Consumes via `bg-primary`, `text-secondary-foreground`, etc. |
| Type scale (display 88 / h1 56 / h2 36 / h3 24 / body-lg 18 / body 16 / small 14 / label 14) | Phase 2 UI-SPEC §1.6 | Consumes via `text-display`, `text-h1`, `text-body`, etc. **NO new sizes.** |
| Font stack — Unbounded (display) + Manrope (sans) + **Baloo 2** (accent — ProGym active on HK layer) | Phase 2 UI-SPEC §1.7 (amended D-01 2026-04-23) | HK layout applies `--font-baloo` via `next/font/google`; Baloo is used only for ProGym-branded accents (venue chip labels, venue name super-heads), NOT body or H1. |
| Spacing scale (4/8/16/24/32/48/64) + section rhythm (`section-sm`/`md`/`lg` = 64/96/128px) | Phase 2 UI-SPEC §1.8 | Every section uses `<Section size="sm\|md\|lg">`. No raw `py-*` arbitrary values. |
| Radius scale (sm 6 / md 8 / lg 10 / xl 14 / 2xl 18 / full) | Phase 2 UI-SPEC §1.9 | Cards `rounded-lg`, hero/map surfaces `rounded-xl`, full-bleed media `rounded-2xl`, avatars `rounded-full`. |
| Phase 2 primitive inventory (Button, Card, Accordion, Badge, Avatar, Separator, Sheet, Input, Label, Textarea, Section, ContainerEditorial, FAQItem, MarketCard, ProgrammeTile, TestimonialCard, StatStrip, LogoWall, VideoPlayer) | Phase 2 UI-SPEC §3 | Composes per §3 HK-homepage section map. **VideoPlayer activates on HK hero** (D-01 HUMAN-ACTION gate for Mux ID). |
| Phase 3 patterns — RootNav/RootFooter architecture, Sheet mobile drawer, Resend `/api/contact` route handler, `createOgImage()` utility, MDX editorial pages, `metadataBase` fallback chain | Phase 3 UI-SPEC §5, §6, §7 | HKNav/HKFooter mirror RootNav/RootFooter structure. Booking form (`/book-a-trial/free-assessment/`) reuses `/api/contact` with extra `venue` + `subject` fields (D-10). |
| Editorial asymmetry rules (avoid centred-hero gradient, purple/blue, identical N-col features, ghost-CTA-as-primary; do alternate layouts, real photo, ≤300ms motion, big type) | Phase 2 UI-SPEC §7 + strategy §14.3 | Binding on every HK section. See §13 below for Phase 4-specific application. |
| Cross-market handoff (absolute `<a href>` to `NEXT_PUBLIC_ROOT_URL` / `_SG_URL`; never `<Link>`; never reset market cookie) | Phase 1 D-02 + Phase 3 Pitfall 7 | HK→Root and HK→SG footer links use `<a href={env}>` absolute. Internal HK→HK links use `<Link href="/gymnastics/...">` (same subdomain). |

**Phase 4 does NOT introduce new tokens.** If a page appears to need one, the planner files a Phase 2.1 revision — Phase 4 stays composition-pure.

**Phase 4 DOES register ONE new shadcn primitive:** `NavigationMenu` (Radix) for the Gymnastics (8 items) + Locations (2 items) dropdowns in HKNav. This is added via `npx shadcn add navigation-menu`. All other primitives are carried forward.

---

## 2. Design System — Summary (template compatibility)

| Property | Value |
|----------|-------|
| Tool | shadcn/ui (initialized Phase 1; Phase 2 added 5 stock + 9 custom primitives; Phase 3 added `input`/`textarea`/`label`/`sheet`; Phase 4 adds `navigation-menu` ONLY) |
| Preset | `style=radix-nova`, `baseColor=neutral`, `cssVariables=true`, `rsc=true`, `iconLibrary=lucide` (inherited; do NOT re-init) |
| Component library | Radix primitives via `radix-ui@1.4.3` metapackage (Phase 1); `@radix-ui/react-navigation-menu` pulled in by shadcn add |
| Icon library | `lucide-react@1.8.0` (inherited) — HK uses `MapPin`, `Clock`, `Phone`, `ChevronDown`, `Menu`, `ArrowRight`, `MessageCircle` (WhatsApp) |
| Font | `next/font/google` — Unbounded (display) + Manrope (sans) + **Baloo 2** (accent — active on HK layer only via `app/hk/layout.tsx` wrapper class). |
| Phase 4 NEW packages | **None.** All deps already installed (RESEARCH §Standard Stack). |
| Phase 4 NEW env vars | `NEXT_PUBLIC_MUX_HK_HERO_PLAYBACK_ID`, `NEXT_PUBLIC_HK_PHONE`, `NEXT_PUBLIC_HK_WHATSAPP`, `NEXT_PUBLIC_ROOT_URL`, (optional) `NEXT_PUBLIC_HK_PHONE_CYBERPORT`, `NEXT_PUBLIC_MAP_EMBED_WAN_CHAI`, `NEXT_PUBLIC_MAP_EMBED_CYBERPORT`. All HUMAN-ACTION at execute-time. |

---

## Spacing Scale (template compatibility)

Declared values (multiples of 4; inherited verbatim from Phase 2 UI-SPEC §1.8):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, inline padding, chip-internal spacing |
| sm | 8px | Compact element spacing (FAQ row internals, nav-item horizontal gap) |
| md | 16px | Default element spacing (button padding, card internal rhythm) |
| lg | 24px | Section intra-column gap, card-grid gap, form-field vertical rhythm |
| xl | 32px | Layout gaps between stacked components, MarketCard internal padding |
| 2xl | 48px | Major intra-section breaks (heading→content, venue-block gutters) |
| 3xl | 64px | Minimum section vertical rhythm (`<Section size="sm">` = `py-16`) |
| section-sm | 64px | `<Section size="sm">` vertical padding (short narrative sections) |
| section-md | 96px | `<Section size="md">` vertical padding (default for HK homepage sections) |
| section-lg | 128px | `<Section size="lg">` vertical padding (hero, final CTA) |

**Exceptions for Phase 4:**
- Sticky nav vertical padding: `py-3 md:py-4` (12/16px) — tighter than `sm` tier so CTA stays visible above the fold on mobile (375×667 viewport).
- `Book a Free Trial` sticky CTA button height: **44px** (touch-size variant, WCAG 2.2 AA) — same as Phase 3 Button `size="touch"`.
- Gymnastics pillar sub-nav gap: `gap-2` (8px between 8 programme chips) — intentional tight packing for 8-item row on desktop.
- Map iframe: fixed `height="300"` (approx 300px) — iframe needs explicit height; does NOT consume `--spacing-*` tokens because it's an iframe, not a Tailwind element.

---

## Typography (template compatibility)

Declared values (inherited verbatim from Phase 2 UI-SPEC §1.6 — **Phase 4 adds zero new type tokens**):

| Role | Size | Weight | Line Height | Font |
|------|------|--------|-------------|------|
| Display | 88px desktop / 48px mobile | 700 (Unbounded Bold) | 1.05 | `--font-display` (Unbounded) |
| H1 | 56px desktop / 36px mobile | 700 (Unbounded Bold) | 1.1 | `--font-display` (Unbounded) |
| H2 | 36px desktop / 28px mobile | 700 (Unbounded Bold) | 1.15 | `--font-display` (Unbounded) |
| H3 | 24px | 600 (Unbounded SemiBold) | 1.25 | `--font-display` (Unbounded) |
| Body-lg | 18px | 400 (Manrope Regular) | 1.55 | `--font-sans` (Manrope) |
| Body | 16px | 400 (Manrope Regular) | 1.5 | `--font-sans` (Manrope) |
| Small | 14px | 400 (Manrope Regular) | 1.5 | `--font-sans` (Manrope) |
| Label | 14px | 600 (Manrope SemiBold) | 1.4 | `--font-sans` (Manrope) |
| Accent (ProGym) | 14–18px (inline only) | 600 (Baloo 2 SemiBold) | 1.3 | `--font-accent` (Baloo 2) |

**Weight policy:** Exactly two primary weights per family — **400 Regular + 700 Bold** (Unbounded + Manrope). Manrope SemiBold (600) is permitted for labels only. Baloo 2 SemiBold (600) is the single weight used for ProGym accent; no Baloo Regular or Bold is loaded (bundle budget).

**Baloo 2 usage rules (new in Phase 4):**
- Applied via `font-accent` Tailwind utility to **ProGym-specific name elements ONLY**: venue-name supers ("ProGym"), venue-chip inline labels, HKFooter venue block headers.
- **FORBIDDEN** on H1 / Display / body / nav-link labels / button labels / FAQ text. Overuse dilutes the ProGym brand moment.
- Contrast: Baloo 2 at 14px SemiBold on white = 13:1 (navy) — WCAG AAA.

---

## Color

Inherited 60/30/10 split from Phase 2 UI-SPEC §1.4 (post-amendment 2026-04-23 — cream → white on `--muted` + `--accent`):

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | `#ffffff` pure white (`oklch(1 0 0)`) | Page background, card surfaces, section defaults (`bg-background` / `bg-card` / `bg-muted` / `bg-accent` — all white post-amendment) |
| Secondary (30%) | `#0f206c` ProActiv navy (`oklch(0.2906 0.1328 267.05)`) | HKNav bar fill, HKFooter fill, navy-surface trust-strip sections, primary button fill, `<h1>`–`<h3>` text color on white, `bg="navy"` `<Section>` prop |
| Accent (10%) | `#ec1c24` ProActiv red (`oklch(0.6012 0.2339 26.97)`) — mapped to `--destructive` and `bg-brand-red` | **Reserved list below** |
| Semantic supporting | `#fac049` brand-yellow (`--secondary`) | Accent card highlights on the navy trust strip; NOT a conversion-CTA color |
| Semantic supporting | `#0f9733` brand-green (`--color-brand-green`) | Only on WhatsApp CTA chip text/icon — brand-consistent with WhatsApp's own green; NOT used elsewhere |
| Semantic supporting | `#0fa0e2` brand-sky (`--color-brand-sky`) | Reserved for future programme-level accents (rhythmic gymnastics sub-page allowed); not used in global nav/footer |
| Semantic supporting | `#fff3dd` brand-cream (`bg-brand-cream` utility) | Deliberate accent-only surface (testimonial card inner fill on navy trust strip) — NOT a default page bg per 2026-04-23 amendment |

### Accent reserved-for list (brand red `#ec1c24`, the 10% accent)

The red accent appears **only** in these explicit contexts — checker enforces:

1. **"Book a Free Trial" sticky nav button** — filled red `bg-brand-red text-white`, always visible, all 22 HK pages. **This is the single highest-priority conversion element; no other interactive component on the page may use red fill.**
2. **"Book a Free Trial" primary CTA on hero** — same red fill, `size="touch"` (44px), Unbounded Bold label.
3. **"Book a Free Trial" primary CTA on final CTA section (§11 of HK home)** — same red fill.
4. **Booking-form submit button** (`/book-a-trial/free-assessment/`) — red fill `bg-brand-red hover:bg-brand-red/90`.
5. **Error state validation text** on the booking form — red text `text-destructive` (semantic alias for brand-red).
6. **Red ProActiv logo mark** inside HKNav brand lockup (if the logo has a red element — logo treatment per brand guidelines).

**Forbidden red uses** (checker will flag):
- Red on any nav link hover state (hovers use navy or navy/80)
- Red on any FAQ expand chevron or accordion affordance
- Red on destructive-delete buttons (not applicable in Phase 4 anyway)
- Red on venue chip active-state (active venue chips use navy fill)
- Red icon fills anywhere in the footer
- Any red gradient, any red-on-red combo, any red border without red fill

### Destructive color

`--destructive` = `#ec1c24` (same as brand red). Used for form validation error text + the destructive semantic slot. **Phase 4 has no destructive actions** (no delete/remove flows; booking is additive). Semantic slot is declared but unused in active UI; remains available for future "Remove venue pre-fill" style interactions.

---

## Copywriting Contract

Source: strategy.md §PART 6B (HK verbatim copy) and §PART 4 (wireframe CTAs). Booking form error/success copy mirrors Phase 3 contact-form tone.

| Element | Copy |
|---------|------|
| **Primary CTA (universal across all 22 HK pages)** | `Book a Free Trial` (verbatim, title-case, no trailing punctuation, no arrow glyph in button text — arrow rendered as separate right-padded `lucide-react/ArrowRight` at `size-4`) |
| **Secondary CTA (homepage hero + location pages)** | `Enquire` (one-word, directs to `/contact?market=hk`) |
| **Tertiary CTA (mobile-first, WhatsApp-forward)** | `Chat on WhatsApp` (directs to `https://wa.me/{NEXT_PUBLIC_HK_WHATSAPP}` with pre-filled message param `?text=Hi%20ProActiv%20HK%2C%20I'd%20like%20to%20book%20a%20free%20trial.`) |
| **Venue chip labels** (homepage + nav) | `ProGym Wan Chai` · `ProGym Cyberport` (verbatim; "ProGym" rendered in Baloo 2, "Wan Chai"/"Cyberport" in Manrope, all in navy, chip border 1px navy, hover fills navy with white text) |
| **Hero H1 (HK homepage)** | `Premium gymnastics and sports programmes for children in Hong Kong.` (verbatim strategy PART 6B §1) |
| **Hero subhead** | `Since 2011 — two dedicated venues in Wan Chai and Cyberport, coaches who complete our training course regardless of prior certification, and a progression pathway from first forward roll to competitive squad.` (verbatim PART 6B §1) |
| **Hero trust-line (below CTA group)** | `Free trial · No obligation · Usually booked same week.` |
| **Empty state — blog hub** | Heading: `New posts coming soon.` Body: `We're preparing long-form guides on gymnastics progression, holiday camp planning, and what to expect at your first class. In the meantime, our coaches are happy to answer any question directly.` CTA chip below: `Chat on WhatsApp →` (navy outline button). |
| **Empty state — `/competitions-events/`** | Heading: `Upcoming events will appear here.` Body: `Our next inter-school meet and community sports day are being scheduled. Subscribe for notifications or contact us for current competitive-squad openings.` CTA chip: `Enquire about competitive pathway` (navy outline). |
| **Empty state — `/book-a-trial/free-assessment/` (before submission)** | Heading visible at page top: `Your free 30-minute assessment at ProGym.` Sub: `Choose a venue, tell us a little about your child, and we'll confirm within one working day.` (No "empty" state — form always present.) |
| **Error state — booking form validation (field-level)** | Name: `Please share the parent's name so we know who to reply to.` Email: `We need a valid email to confirm your assessment time.` Child age: `Please enter your child's age in years (use "1" for under 2).` Venue: `Please pick a venue — we'll confirm availability for that time.` |
| **Error state — booking form submission failure** | Heading: `Something went wrong on our end.` Body: `Your message didn't reach us — please try again, or WhatsApp ProGym directly. We'll still see it.` Retry action: `Try again` (navy outline) + `Chat on WhatsApp` (brand-green icon, navy text). |
| **Success state — booking form submitted** | Heading: `Thanks — your free assessment request is in.` Body: `A member of our HK team will reply within one working day to confirm a time. If you booked for a specific venue, we'll prepare the right coach and apparatus in advance.` Follow-up CTAs: `Back to ProActiv Sports Hong Kong` (`<Link href="/">`) and `Read the first-class guide` (`<Link href="/blog/">`). |
| **Destructive confirmations** | **N/A — Phase 4 has no destructive actions.** No delete flows, no reset flows, no irreversible state changes. (Documented explicitly so checker/auditor doesn't flag the omission.) |
| **Final CTA section (HK homepage §11) heading** | `Ready to book your child's first class?` (verbatim PART 6B §11) |
| **Final CTA section body** | `Free 30-minute assessment, no commitment. Choose Wan Chai or Cyberport — or let us suggest based on your location.` |
| **404 copy** (if HK-scoped 404 is needed; else falls back to root `not-found.tsx`) | Heading: `We can't find that page at ProActiv Sports Hong Kong.` Body: `Try the main HK site, or reach us directly — we'll get you where you need to go.` Primary CTA: `Back to ProActiv Sports Hong Kong` (navy fill) + secondary `Chat on WhatsApp`. |

**Voice invariants (Phase 3 carry-forward, strategy §PART 14.3):**
- British English: "programmes" not "programs", "organisation" not "organization", "realise" not "realize".
- **"Parents" never "customers", "users", "leads"** — no corporate SaaS terms on user-facing copy.
- Active voice, short sentences. No exclamation marks in headlines (strategy §PART 14.3 anti-AI-SaaS rule).
- No emojis in copy visible to parents (icon system uses lucide-react; strategy's wireframe emojis `🤸` are shorthand for icon slots).
- **Avoid superlatives** ("best", "world-class" reserved for the single trust-strip callout that cites real credentials; strategy §PART 14.3).

---

## 3. HK Homepage — Section-by-Section Visual Contract (HK-01)

The 12 sections of `app/hk/page.tsx` build top-to-bottom per strategy PART 4 §1–§12. Each section is composed exclusively from Phase 2 `components/ui/` primitives plus Phase 4-local `components/hk/` compositions. Copy is verbatim from PART 6B. Asymmetry alternates per the rule below.

### 3.0 Page-level wrapper

```tsx
// app/hk/page.tsx (RSC)
export default function HKHomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hkHomeSchema) }} />
      <HeroSection />           {/* §3.1 — video hero, venue chips, CTAs */}
      <VenueChipRow />          {/* §3.2 — Wan Chai + Cyberport quick-enter */}
      <WhyChooseSection />      {/* §3.3 — 4-tile grid (permitted exception) */}
      <ProgrammesSection />     {/* §3.4 — 5 ProgrammeTile cards */}
      <LocationSplitSection />  {/* §3.5 — Wan Chai vs Cyberport split */}
      <SocialProofSection />    {/* §3.6 — LogoWall + TestimonialCard on navy */}
      <CoachingMethodSection /> {/* §3.7 — 3-pillar + Monica portrait */}
      <CampsPartiesSection />   {/* §3.8 — 2-col revenue block */}
      <AboutSnapshotSection />  {/* §3.9 — 2-col brand story */}
      <BlogSection />           {/* §3.10 — 1–3 stub posts */}
      <FAQSection />            {/* §3.11 — HK FAQ accordion */}
      <FinalCTASection />       {/* §3.12 — Book a Free Trial + WhatsApp */}
    </>
  );
}
```

HKNav + HKFooter wrap in `app/hk/layout.tsx` (Phase 3 mirror pattern).

### 3.1 Section 1 — HERO (PART 4 §1 + PART 6B §1)

| Dimension | Value |
|-----------|-------|
| Phase 2 primitives | `<Section size="lg" bg="default">` + `<ContainerEditorial width="wide">` + `<VideoPlayer>` (dynamic, ssr:false) + poster `<Image priority>` + 2× `<Button size="touch">` (primary red + secondary navy outline) |
| Layout (asymmetry slot 1: full-bleed video + left-aligned copy overlay) | Desktop: 21:9 video container with absolute-positioned left-column copy (`left-6 md:left-12 max-w-xl`). Mobile: 16:9 video, overlay copy below (not overlaid) on darker navy strip. |
| Video | `<VideoPlayer playbackId={process.env.NEXT_PUBLIC_MUX_HK_HERO_PLAYBACK_ID ?? ""} loop autoPlay muted />` with `dynamic({ ssr:false, loading: poster-component })`. **HUMAN-ACTION gate D-01**: if env var empty at execute time, plan task completes with the poster-only state; checkpoint requests Mux ID. |
| Poster image (LCP element) | `src="/photography/hk-venue-wanchai-gymtots.webp"` (Phase 2 D-07 verified present) · `priority` · `fill` · `sizes="100vw"` · `alt="Children practising gymnastics at ProGym Wan Chai, Hong Kong"` · renders via `dynamic({ loading })` — visible until VideoPlayer hydrates |
| H1 | `Premium gymnastics and sports programmes for children in Hong Kong.` — `text-display font-display text-white` on navy overlay (contrast 14.55:1 — PASS AAA); max 2 lines desktop, wraps mobile. |
| Subhead | `text-body-lg text-cream max-w-xl mt-4` (cream on navy ~12.5:1) — copy per table above. |
| Primary CTA | `<Button size="touch" className="bg-brand-red hover:bg-brand-red/90 text-white">Book a Free Trial <ArrowRight size={16} /></Button>` — `href="/book-a-trial/free-assessment/"` via `<Link asChild>` wrapping. |
| Secondary CTA | `<Button size="touch" variant="outline" className="border-white text-white hover:bg-white/10">Enquire</Button>` — `href="/contact?market=hk"`. Never red; never the same visual weight as primary. |
| Trust line | Below CTAs: `text-small text-cream/80 mt-4`. Copy: `Free trial · No obligation · Usually booked same week.` |
| Motion | Video is looping autoplay (no UI motion beyond Mux's own playback); CTA buttons use `transition-colors duration-200`; no kinetic type. Respects `prefers-reduced-motion` — Mux Player natively honours the media query. |
| LCP target | < 2.5s on mobile throttled. Poster `<Image priority>` is the LCP candidate (video loads after). |
| Interaction states | CTA hover: `hover:bg-brand-red/90` / `hover:bg-white/10`. Focus-visible: `ring-2 ring-white ring-offset-2 ring-offset-brand-navy` (navy-ring pattern won't show on navy; white ring required here). Touch: 44×44px minimum. |

### 3.2 Section 2 — VENUE CHIP ROW (PART 4 §2)

| Dimension | Value |
|-----------|-------|
| Phase 2 primitives + Phase 4-local | `<Section size="sm" bg="default">` + `<ContainerEditorial width="wide">` + `<VenueChipRow>` (Phase 4-local, §5.3) |
| Layout (asymmetry slot 2: horizontal chip row) | Flex row, centred on desktop (`flex justify-center gap-4 flex-wrap`). Mobile: full-width stacked chips with `flex-col` (easier tap targets). |
| Chip 1 | `<Link href="/wan-chai/">` wrapping `<Card className="group hover:-translate-y-1 transition-transform border border-brand-navy/20 rounded-lg">` — content: `MapPin` icon + `ProGym` (Baloo 2) + `Wan Chai` (Manrope SemiBold) + address single-line `15/F The Hennessy, 256 Hennessy Rd` (`text-small text-muted-foreground`). `px-4 py-3` padding. |
| Chip 2 | `<Link href="/cyberport/">` wrapping same pattern with `ProGym` + `Cyberport` + `5,000 sq ft at Cyberport — opened Aug 2025`. |
| Hover | `-translate-y-1` + `shadow-md` on card; icon `text-brand-navy` remains; NO red. |
| Active pathname | When user is on `/wan-chai/` the chip gets `bg-brand-navy text-white` (inverted fill; navy not red). Handled via Phase 4-local `<ActiveVenueChip>` client wrapper. |
| Background | `bg-background` (white) |

### 3.3 Section 3 — WHY CHOOSE US (PART 4 §3 + PART 6B §3)

| Dimension | Value |
|-----------|-------|
| Phase 2 primitives | `<Section size="md" bg="muted">` (white post-amendment; visual break from §3.2 via `border-y border-brand-navy/10`) + `<ContainerEditorial width="wide">` + 4× `<Card>` |
| Layout (asymmetry slot 3: 4-tile grid — permitted exception per Phase 2 §7) | Mobile 1-col, tablet 2-col, desktop `grid-cols-4 gap-6`. Icon tiles are a permitted editorial exception when copy-dense uniformity is intentional (strategy §14.3). |
| H2 | `Why Hong Kong parents choose ProActiv.` (PART 6B §3) — `text-h2 font-display text-foreground mb-8` |
| 4 tiles (copy per PART 6B §3) | (1) **14 years in Hong Kong** · icon `Trophy` · "Since 2011, shaping how children move — now in our third dedicated venue." · (2) **Two dedicated facilities** · icon `MapPin` · "Purpose-built floors in Wan Chai and Cyberport — gymnastics apparatus, not shared space." · (3) **A single coaching standard** · icon `BadgeCheck` · "Every coach completes the ProActiv Sports training course, regardless of prior certification." · (4) **A progression pathway** · icon `ArrowUpRight` · "From Babies & Toddlers through competitive squad and rhythmic — no forced level jumps." |
| Tile composition | `<Card className="p-6">` with `Icon size-8 text-brand-navy mb-4` + `<h3 text-h3 font-display text-foreground>` + `<p text-body text-muted-foreground mt-2>` |
| Background | `bg-muted` (white, post-amendment; border-y for visual break) |

### 3.4 Section 4 — PROGRAMMES (PART 4 §4 + PART 6B §4)

| Dimension | Value |
|-----------|-------|
| Phase 2 primitives | `<Section size="md" bg="default">` + `<ContainerEditorial width="wide">` + 5× `<ProgrammeTile>` |
| Layout (asymmetry slot 4: 3+2 asymmetric grid) | Desktop: `grid-cols-6 gap-6` with first 3 tiles `col-span-2` and last 2 tiles `col-span-3` each — breaks the uniform 5-col rhythm. Tablet: 2-col. Mobile: 1-col. |
| H2 | `Programmes for every stage — toddler to competitive.` (PART 6B §4) |
| Tiles (each a `<ProgrammeTile>` with age-band Badge) | (1) `title="Gymnastics"` · `ageBand="2–16yr"` · `href="/gymnastics/"` · image from `/photography/programme-beginner.*` · tagline `8 levels, parent-tot to competitive.` — (2) `title="Holiday Camps"` · `ageBand="3–12yr"` · `href="/holiday-camps/"` · image from `/photography/programme-holiday-camp.*` · tagline `Easter, summer, Christmas.` — (3) `title="Birthday Parties"` · `ageBand="3–12yr"` · `href="/birthday-parties/"` · tagline `Hosted, coach-led, two hours.` — (4) `title="School Partnerships"` · `ageBand="K–Y13"` · `href="/school-partnerships/"` · tagline `Curriculum support, inter-school events.` — (5) `title="Competitions & Events"` · `ageBand="6+"` · `href="/competitions-events/"` · tagline `Competitive pathway and community events.` |
| ProgrammeTile visual (Phase 2 UI-SPEC §3.8) | 4:3 photo · navy label overlay · Age-band `<Badge>` top-right `bg-secondary text-secondary-foreground` (yellow on navy text) · hover `scale-105` on image · `rounded-xl`. |
| Background | `bg-background` |

### 3.5 Section 5 — LOCATION SPLIT (PART 4 §5 + PART 6B §5)

| Dimension | Value |
|-----------|-------|
| Phase 2 primitives | `<Section size="md" bg="default">` + `<ContainerEditorial width="wide">` + 2× custom venue blocks (inline composition — not a new primitive) |
| Layout (asymmetry slot 5: 2-col symmetric — intentional exception) | Desktop: `grid-cols-2 gap-8`, photo-left-copy-right on Wan Chai, photo-right-copy-left on Cyberport (flip). Mobile: stacked, Wan Chai first. |
| H2 | `Two ProGym venues across Hong Kong.` |
| Wan Chai block | Photo `/photography/hk-venue-wanchai-gymtots.webp` + venue name `ProGym Wan Chai` (Baloo 2 on "ProGym", Manrope Bold on "Wan Chai") + address line + 2× `<Badge>` for apparatus (`Bar · Beam · Floor · Vault`) + `<Link href="/wan-chai/">See Wan Chai venue →</Link>` (navy underline, Manrope 600) |
| Cyberport block | Photo `/photography/hk-venue-cyberport.webp` + `ProGym Cyberport` + `5,000 sq ft · Opened Aug 2025` + apparatus badges + `See Cyberport venue →` |
| Background | `bg-background` |

### 3.6 Section 6 — SOCIAL PROOF (PART 4 §6 + PART 6B §6)

Mirrors Phase 3 §3.5 pattern exactly — full-bleed navy `<Section bg="navy">` + `<LogoWall>` (international schools) + 1× `<TestimonialCard>` on cream surface inside navy section. Copy-per-verbatim PART 6B §6. HUMAN-ACTION on logo assets (same `text-fallback` pattern as Phase 3 D-10).

### 3.7 Section 7 — COACHING METHOD (PART 4 §7 + PART 6B §7)

3-pillar layout (`grid-cols-3 gap-6`) — Safety · Progression · Confidence — each a `<Card>` with icon + H3 + short bio. Right-of-pillars: Monica portrait `<Image>` + caption `Led by Monica, Director of Sports Hong Kong — 19 years coaching, Level 2 Italian certification.` HUMAN-ACTION on portrait file (carry-forward Phase 3 D-10).

### 3.8 Section 8 — CAMPS + PARTIES (PART 4 §8 + PART 6B §8)

2-col revenue block. Left: camps photo + 3-bullet "Easter · Summer · Christmas" + Book CTA. Right: parties photo + 3-bullet "2hr hosted · coach-led · bring the cake" + Enquire CTA (navy outline, not red — only "Book a Free Trial" uses red fill).

### 3.9 Section 9 — ABOUT SNAPSHOT (PART 4 §9 + PART 6B §9)

2-col prose + photo. Left: 2-paragraph "About ProActiv Sports Hong Kong" verbatim. Right: coach-with-child action photo. `<Section size="md" bg="default">`.

### 3.10 Section 10 — BLOG (PART 4 §10 + PART 6B §10)

| Dimension | Value |
|-----------|-------|
| Layout | `grid-cols-1 md:grid-cols-3 gap-6` — renders gracefully at 1, 2, or 3 stub posts (strategy PART 4 explicit requirement). |
| Stub count | 1 post minimum at Phase 4 (blog-post-stub shape per RESEARCH Pattern 5). Planner discretion: 1 or 3 (recommended 2 to prove the template). |
| Empty state | If `HK_BLOG_POSTS_STUB.length === 0`, renders centred empty-state copy from §Copywriting table above. Implementation must handle this branch (future-proof for Phase 6 when CMS might return 0). |
| Card composition | `<Card>` with `<Image aspect-4/3 rounded-t-lg>` + `<Badge>` category + `<h3>` title + excerpt + `<time>` date + read-time + `<Link>` to stub. |

### 3.11 Section 11 — FAQ (PART 4 §11 + PART 6B §11)

Mirrors Phase 3 §3.7 — `<Section size="md" bg="default">` + `<ContainerEditorial width="default">` (narrow reading column) + `<Accordion type="single" collapsible>` with 8× `<FAQItem>`. Questions verbatim from PART 6B §11 (age range, venue pick, what to wear, first class, class size, competitive path, rhythmic availability, adult classes). `FAQPage` JSON-LD mirrors visible text char-for-char (§8.3).

### 3.12 Section 12 — FINAL CTA (PART 4 §12 + PART 6B §12)

| Dimension | Value |
|-----------|-------|
| Phase 2 primitives | `<Section size="lg" bg="navy">` + `<ContainerEditorial width="default">` + 2× `<Button size="touch">` |
| Heading | `Ready to book your child's first class?` (white on navy) |
| Body | `Free 30-minute assessment, no commitment. Choose Wan Chai or Cyberport — or let us suggest based on your location.` (cream on navy) |
| Primary CTA | `<Button size="touch" className="bg-brand-red text-white hover:bg-brand-red/90">Book a Free Trial <ArrowRight /></Button>` → `/book-a-trial/free-assessment/` |
| Secondary CTA | `<Button size="touch" variant="outline" className="border-white text-white">Chat on WhatsApp <MessageCircle /></Button>` → `https://wa.me/{NEXT_PUBLIC_HK_WHATSAPP}`. Conditionally rendered — if env var unset, the chip is hidden (no broken tel: link). |

---

## 4. Supporting HK Pages — Per-Route Visual Contract

Specs condensed — each follows the same composition rule as the homepage (Phase 2 primitives + Phase 4-local wrappers; verbatim PART 6B copy; asymmetry alternation).

| Route | Primitives | Key sections | HUMAN-ACTION gates |
|-------|-----------|--------------|---------------------|
| `/wan-chai/` (HK-02) | `<Section>`, `<ContainerEditorial>`, `<VenueMap>` (Phase 4-local), `<Badge>`, `<Image>`, `<Button>` | Hero (venue name Baloo 2 + address) · VenueMap iframe · Opening hours table · Programmes at Wan Chai list · Service area copy (Wan Chai, Causeway Bay, Central, Mid-Levels) · Venue FAQ · Booking CTA `?venue=wan-chai` | Map embed URL, phone, opening hours |
| `/cyberport/` (HK-03) | same | same as Wan Chai with Cyberport content (`5,000 sq ft`, opened Aug 2025) | Map embed URL, phone (if different), opening hours |
| `/gymnastics/` pillar (HK-04) | `<Section>`, `<ContainerEditorial>`, `<GymPillarNav>` (Phase 4-local), 8× `<Card>` for sub-programme tiles | Pillar intro · 8-tile nav to sub-pages · Age-pathway diagram (text-only; SVG allowed if simple) · Shared FAQ · Booking CTA | None (copy hardcoded from strategy PART 12) |
| `/gymnastics/{toddlers,beginner,intermediate,advanced,competitive,rhythmic,adult,private}/` (8 sub-pages, HK-04) | shared sub-page template: `<GymPillarNav>` + H1/subhead + "What children learn" bullets + "Class structure" + "Which venues" + Booking CTA with `?age=...` pre-fill | Each sub-page: unique H1 per strategy §PART 12 Tier 1; same template shell; Phase 6 migrates to `[slug]` | None |
| `/holiday-camps/` (HK-05) | `<Section>`, 3× `<ProgrammeTile>` (Easter · Summer · Christmas) | Camp-season tiles · what's included · upcoming dates stub · Booking CTA `?subject=Holiday Camp` | Dates (if client has firm calendar — else "Upcoming — contact us") |
| `/birthday-parties/` (HK-06) | `<Section>`, 2-col + 3× testimonial `<Card>` | 2hr hosted format explainer · apparatus stations · party pack details · Enquire CTA | None |
| `/school-partnerships/` (HK-07) | `<Section>`, `<LogoWall>` of partner schools + editorial prose | partner schools · programme options · Enquire CTA | Partner school logos (text fallback OK) |
| `/competitions-events/` (HK-08) | `<Section>`, card grid | Upcoming events (empty-state per §Copywriting if none) · competitive pathway summary · Enquire CTA | Event dates |
| `/coaches/` (HK-09) | `<Section>`, 1× lead portrait (Monica) + `<Card>` grid of coach bios | Combined HK team per D-08 · hardcoded TypeScript array shape `{name, role, bio, venueTag?, portrait}` matching Phase 6 Sanity | **D-09: coach portrait HUMAN-ACTION gate** — missing files list + `pnpm photos:process` directive; NO silhouettes |
| `/blog/` (HK-10) | `<Section>`, 1–3× `<Card>` blog stub | CMS-migration-ready stub (RESEARCH Pattern 5) · empty state per §Copywriting if 0 posts · pagination shell (stub — Phase 6 wires) | None |
| `/faq/` (HK-11) | `<Section>`, `<Accordion>` with 15–20× `<FAQItem>` | Full HK FAQ hub · grouped by category (About, Venues, Gymnastics, Camps, Parties, Pricing) · FAQPage JSON-LD | None (copy from strategy PART 6B §11 expanded) |
| `/book-a-trial/` (HK-12 conversion hub) | `<Section>`, 2× venue card + form shortcut | Choose-your-venue landing · WhatsApp option · direct CTA to `/book-a-trial/free-assessment/?venue=...` | None |
| `/book-a-trial/free-assessment/` (HK-12 form) | `<Input>`, `<Textarea>`, `<Label>`, `<Button>`, `<BookingForm>` (Phase 4-local) | Form page per §6 below | None at render; form-POST depends on RESEND key (Phase 3 HUMAN-ACTION carry) |

---

## 5. Phase 4-Local Components (component/hk/)

Market-scoped per Phase 3 D-11 — these live at `components/hk/`, NOT `components/ui/`.

### 5.1 `<HKNav>` (RSC wrapper + mobile Sheet child)

**File:** `components/hk/hk-nav.tsx` + `components/hk/hk-nav-mobile.tsx`

Mirror of Phase 3 `RootNav`. Differences (per CONTEXT D-02/D-03/D-04/D-05/D-06):

```tsx
// Primary nav items (desktop):
// [ProActiv HK logo] [Gymnastics ▼] [Locations ▼] [Camps] [Coaches] [FAQ] [Book a Free Trial →]

// Gymnastics dropdown items (NavigationMenu):
const GYMNASTICS_DROPDOWN = [
  { href: "/gymnastics/toddlers/",     label: "Babies & Toddlers", sub: "12mo – 3yr" },
  { href: "/gymnastics/beginner/",     label: "Beginner",          sub: "4 – 6yr" },
  { href: "/gymnastics/intermediate/", label: "Intermediate",      sub: "6 – 9yr" },
  { href: "/gymnastics/advanced/",     label: "Advanced",          sub: "9 – 12yr" },
  { href: "/gymnastics/competitive/",  label: "Competitive",       sub: "6+" },
  { href: "/gymnastics/rhythmic/",     label: "Rhythmic",          sub: "5 – 16yr" },
  { href: "/gymnastics/adult/",        label: "Adult",             sub: "16+" },
  { href: "/gymnastics/private/",      label: "Private Coaching",  sub: "All ages" },
] as const;

// Locations dropdown items:
const LOCATIONS_DROPDOWN = [
  { href: "/wan-chai/",  label: "ProGym Wan Chai",  sub: "The Hennessy, 256 Hennessy Rd" },
  { href: "/cyberport/", label: "ProGym Cyberport", sub: "5,000 sq ft · opened Aug 2025" },
] as const;
```

**Visual:**
- Bar height: `h-16 md:h-20` (sticky, `sticky top-0 z-40`)
- Background: `bg-white/95 backdrop-blur border-b border-brand-navy/10` (semi-transparent so video hero peeks through)
- Logo: `<Image src="/brand/proactiv-logo.svg">` left-aligned, 32px tall
- Nav links: `text-body font-medium text-foreground hover:text-brand-navy` (no red on hover)
- Dropdown chevron: `lucide-react/ChevronDown size-4`
- Dropdown panel: `bg-white border border-border rounded-lg shadow-lg p-2 min-w-[280px]`
- Dropdown item: `<Link>` with `px-3 py-2 rounded hover:bg-brand-navy/5` — label in Manrope SemiBold, age-band in `text-small text-muted-foreground`
- **"Book a Free Trial" sticky button** (D-05): `<Button size="touch" className="bg-brand-red text-white hover:bg-brand-red/90">` — right-aligned, always visible on scroll, labels includes ArrowRight icon. **Filled red — this is THE exception to the "no red on nav" rule.**
- Mobile: hamburger icon (`lucide-react/Menu`) opens `<Sheet side="right">` (carry-forward Phase 3). Sheet contains vertical nav list with sticky red "Book a Free Trial" at top of Sheet.

### 5.2 `<HKFooter>` (RSC)

**File:** `components/hk/hk-footer.tsx`

Mirror of Phase 3 `RootFooter`. HK-specific differences:
- 4-column layout on desktop: **(1) Brand + tagline**, **(2) Venues** (NAP block for Wan Chai + Cyberport with `MapPin` + `Phone` + hours), **(3) Quick links** (Gymnastics pillar, Camps, Parties, Coaches, Blog, FAQ), **(4) Connect** (WhatsApp CTA + email + cross-market `<a href={NEXT_PUBLIC_ROOT_URL}>ProActiv Sports Group ↗</a>` + `<a href={NEXT_PUBLIC_SG_URL}>Prodigy Singapore ↗</a>`).
- Background: `bg-brand-navy`; text `text-cream`; links `hover:text-white`
- Bottom bar: `© 2026 ProActiv Sports` + privacy/terms links to root domain (cross-subdomain `<a href>`).
- NAP reads from `lib/hk-data.ts` (HUMAN-ACTION for phone/hours).

### 5.3 `<VenueChipRow>` (RSC)

**File:** `components/hk/venue-chip-row.tsx`

2 chips, flex-row on desktop, flex-col on mobile. Each chip = `<Link>` wrapping `<Card>` with `MapPin` + Baloo-2 "ProGym" + Manrope-Bold venue name + address single-line + hover `-translate-y-1`.

### 5.4 `<VenueMap>` (RSC — iframe embed)

**File:** `components/hk/venue-map.tsx`

Per RESEARCH Pattern 3. Props: `{ embedSrc, title, className? }`. Renders lazy iframe `loading="lazy"` with Google Maps embed URL. If `embedSrc` is empty/placeholder, renders fallback `<div className="rounded-lg bg-muted h-64 flex items-center justify-center">` with address text. `title` attribute required (a11y). HUMAN-ACTION at execute for embed URLs.

### 5.5 `<GymPillarNav>` (RSC wrapper + client child)

**File:** `components/hk/gymnastics-pillar-nav.tsx` + `components/hk/active-gym-nav-link.tsx`

8 chips in flex-wrap. Each is `<ActiveGymNavLink>` (client component using `usePathname()` — Pitfall 2: compare without `/hk/` prefix since browser URL is pre-rewrite). Active state: `bg-brand-navy text-white`. Inactive: `bg-muted text-foreground hover:bg-brand-navy/10`. Chip contents: label (Manrope SemiBold) + age-band (Manrope 12px opacity-70).

### 5.6 `<BookingForm>` (client component)

**File:** `app/hk/book-a-trial/free-assessment/booking-form.tsx`

`"use client"`. Per RESEARCH Pattern 4. Fields (labeled, required unless noted):

| Field | Type | Required | Validation | Label copy |
|-------|------|----------|------------|------------|
| Parent name | `<Input>` | yes | min 2 chars | `Your name` |
| Email | `<Input type="email">` | yes | standard email | `Email` |
| Phone | `<Input type="tel">` | no | optional | `Phone (optional)` |
| Child age | `<Input type="number" min="1" max="18">` | yes | 1-18 | `Child's age` |
| Venue | 3× radio `<Card>` chips | yes | pre-filled from `?venue=` query | `ProGym Wan Chai` / `ProGym Cyberport` / `No preference — suggest for me` |
| Message | `<Textarea>` | no | max 500 chars | `Anything we should know? (optional)` |
| Honeypot | hidden `<input name="website">` | — | must be empty (Phase 3 D-04 carry) | hidden |

**Submit button:** `<Button size="touch" type="submit" className="bg-brand-red text-white w-full md:w-auto">Book free assessment</Button>`
**States:** `idle` / `submitting` (button label → `Sending…` + disabled + subtle spinner icon) / `success` (replaces form with success state per §Copywriting) / `error` (inline error card at top per §Copywriting).
**Accessibility:** `aria-live="polite"` region for status; label-for-input associations; focus management on state change (focus moves to status region on error/success).

### 5.7 HK-specific data module

**File:** `lib/hk-data.ts`

```typescript
// Static HK data. Phase 6 migrates to Sanity (same shape).
export interface HKCoach { name: string; role: string; bio: string; venueTag?: "wan-chai"|"cyberport"|"both"; portrait: string; }
export interface HKBlogPost { title: string; slug: string; excerpt: string; date: string; category: string; readTimeMinutes: number; heroImage: string; }
export interface HKVenueHours { days: string[]; open: string; close: string; }
export interface HKVenue { id: "wan-chai"|"cyberport"; nameShort: string; nameFull: string; addressStreet: string; addressLocality: string; phoneEnv: string; hours: HKVenueHours[]; mapEmbedEnv: string; geo: { lat:number; lng:number }; }

export const HK_VENUES: HKVenue[] = [ /* Wan Chai + Cyberport */ ];
export const HK_COACHES: HKCoach[] = [ /* min Monica + 2-3 others — HUMAN-ACTION on portrait files */ ];
export const HK_BLOG_POSTS_STUB: HKBlogPost[] = [ /* 1-3 stubs per Claude's Discretion */ ];
export const HK_FAQ_ITEMS = [ /* 15-20 Q/A for /faq/ */ ];
```

---

## 6. Booking Form UX (HK-12)

See §5.6 for field spec. Flow:

1. User lands on `/book-a-trial/free-assessment/?venue=wan-chai` (venue pre-filled from query).
2. User reviews pre-filled venue chip (highlighted navy); may change.
3. Fills name/email/age (required), optionally phone + message.
4. Submits: form POSTs to `/api/contact` with `{ market: "hk", subject: "Free Assessment Request", venue, name, email, phone, childAge, message, honeypot: "" }`.
5. Route handler validates, dispatches Resend email with `ContactEmailHK` template extended to include `venue` + `childAge` rows.
6. Success state replaces form with confirmation copy (per §Copywriting); analytics event `book-a-trial_submitted` fires.
7. Failure shows error card with retry + WhatsApp escape.

**Email template extension** (Phase 3 `emails/contact.tsx`): add two rows — "Venue" (wan-chai → "ProGym Wan Chai") and "Child's age" — rendered only when present. No new template file needed.

**Validation rules (server-side, extending Phase 3 handler):**
- `venue ∈ ["wan-chai", "cyberport", "no-preference"]` — else 400
- `childAge ∈ [1,18]` as number — else 400
- Honeypot field must be empty — else 200 silently (Phase 3 D-04 carry)
- All existing Phase 3 validations (name, email, market) unchanged

---

## 7. OG Image Template (Phase 3 carry-forward)

`createHKOgImage({ title, tagline })` utility — mirror of Phase 3 `createRootOgImage` with navy background + Unbounded title + cream tagline + subtle ProActiv mark. Per-route `opengraph-image.tsx` files only for high-priority pages (Pitfall 5):
- HK homepage
- `/wan-chai/`
- `/cyberport/`
- `/gymnastics/` (pillar — all 8 sub-pages inherit)
- `/holiday-camps/`
- `/book-a-trial/`
- `/coaches/`
- `/blog/`

Other HK pages inherit HK-layout default OG image (fallback declared in `app/hk/layout.tsx` `metadata.openGraph.images`). Total 8 OG image jobs (down from 22) — keeps Vercel build under 60s.

---

## 8. Accessibility + JSON-LD

### 8.1 A11y invariants (WCAG 2.2 AA)
- Every HK page has unique `<h1>` (singular — enforced by test).
- Skip link in HK layout: `<a href="#main-content">Skip to main content</a>` (carry from Phase 3 pattern).
- All interactive targets 44×44px minimum (Button `size="touch"` variant).
- Focus-visible ring: navy on white, white on navy (hero/navy sections).
- `prefers-reduced-motion`: respected by Mux Player natively; CSS transitions scoped to ≤300ms; no auto-animating decoration.
- Color contrast: all text ≥ 4.5:1 (verified by checker — cream on navy 12.5:1, white on navy 14.55:1, navy on white 14.55:1, navy-70% on white 4.6:1).
- Dropdown nav (NavigationMenu) keyboard: arrow keys navigate items, Escape closes, Tab moves to next top-level item (Radix default — do NOT override).
- Iframe map: `title` attribute set, `aria-label` duplicated.

### 8.2 LocalBusiness JSON-LD (HK-02 + HK-03)
Per RESEARCH Pattern 7. Inline `<script type="application/ld+json">` in `/wan-chai/` and `/cyberport/` page components. Includes `@type: SportsActivityLocation` + `parentOrganization @id` reference to root Organization + `address` + `geo` + `openingHoursSpecification` + `telephone` from env. Cyberport coordinates HUMAN-ACTION (Assumption A6).

### 8.3 FAQPage JSON-LD
HK homepage (§3.11) and `/faq/` (HK-11) render `FAQPage` JSON-LD inline. Q&A text **must match visible DOM text char-for-char** (Google rich-result rule; Phase 3 pattern).

---

## 9. Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | `navigation-menu` (new in Phase 4) · inherited from Phase 1-3: `button`, `card`, `accordion`, `badge`, `avatar`, `separator`, `sheet`, `input`, `label`, `textarea` | **not required** (official registry — same provenance as preset) |
| Third-party registries | **none declared for Phase 4** | not applicable |

No third-party blocks. No vetting gate required. If Phase 4 planner/executor discovers a need for a third-party block, they MUST halt and return a Rule-1 revision request before adding.

---

## 10. Copy — verbatim sources

All HK copy is verbatim from `strategy.md §PART 6B`. Planner + executor MUST NOT paraphrase. Binding copy elements are listed in §Copywriting Contract above and cross-referenced from §3 section-by-section table. For the 8 gymnastics sub-pages, copy comes from strategy `§PART 12 Tier 1 #1–#5`.

---

## 11. Decisions map (trace to CONTEXT)

| CONTEXT Decision | UI-SPEC realization |
|------------------|---------------------|
| D-01 Hero video HUMAN-ACTION gate | §3.1 — VideoPlayer with poster fallback, env var `NEXT_PUBLIC_MUX_HK_HERO_PLAYBACK_ID` checkpoint |
| D-02 HKNav 6 items + sticky CTA | §5.1 — Gymnastics [▼], Locations [▼], Camps, Coaches, FAQ, [Book a Free Trial ↗ red] |
| D-03 Gymnastics dropdown 8 items | §5.1 — NavigationMenu dropdown, 8 entries with age-bands |
| D-04 Locations dropdown 2 items | §5.1 — NavigationMenu dropdown, 2 entries (Wan Chai + Cyberport) |
| D-05 Sticky red "Book a Free Trial" | §5.1 — filled red, always-visible, 44px touch target; explicitly the ONE red-fill exception |
| D-06 HKNav lives at `components/hk/` | §5 — market-scoped components policy (Phase 3 D-11 precedent) |
| D-07 Coaches page fully populated | §4 `/coaches/`, §5.7 `HK_COACHES` hardcoded array shape |
| D-08 Combined HK team (no venue split) | §4 `/coaches/` layout is single grid; `venueTag` optional field on coach |
| D-09 Portrait HUMAN-ACTION gate | §4 `/coaches/` HUMAN-ACTION column; NO silhouettes policy |
| D-10 Booking form extends `/api/contact` | §5.6 + §6 — client form POSTs `{ market, subject, venue, ...}` to existing handler |

---

## 12. Checker Sign-Off (six-pillar)

- [ ] Dimension 1 Copywriting: verbatim PART 6B; British English; no exclamations; no corporate SaaS terms; empty/error/success states declared
- [ ] Dimension 2 Visuals: editorial asymmetry alternates across 12 sections; real ProActiv photography only; no AI-SaaS gradient traps
- [ ] Dimension 3 Color: 60/30/10 split verified; accent red reserved list enforced (only 6 listed uses); no red on nav hovers/footer/FAQ
- [ ] Dimension 4 Typography: 3 sizes/weights inherited from Phase 2 scale; Baloo 2 scoped to ProGym accents only; no new sizes
- [ ] Dimension 5 Spacing: 4/8/16/24/32/48/64 scale; Section rhythm via `size="sm|md|lg"`; exceptions documented
- [ ] Dimension 6 Registry Safety: only shadcn official; `navigation-menu` added; no third-party blocks

**Approval:** pending

---

## 13. Editorial asymmetry pass (strategy §14.3 binding)

HK homepage section-by-section asymmetry rhythm:

| Section | Pattern | Contrast vs previous |
|---------|---------|----------------------|
| §3.1 Hero | Full-bleed video + left-aligned overlay copy | — |
| §3.2 Chip row | Short flex row, tight vertical rhythm | Full-bleed → compact |
| §3.3 Why choose | 4-tile grid (permitted exception) | Compact row → structured grid |
| §3.4 Programmes | 3+2 asymmetric grid (col-span-2 / col-span-3 mix) | Uniform grid → broken grid |
| §3.5 Location split | 2-col symmetric with photo-flip | Broken grid → mirror 2-col |
| §3.6 Social proof | Full-bleed navy surface | Light 2-col → dark full-bleed |
| §3.7 Coaching method | 3 pillars + portrait side | Dark full-bleed → light column+aside |
| §3.8 Camps + parties | 2-col symmetric | Column+aside → 2-col parallel |
| §3.9 About snapshot | 2-col with heavier copy-left | 2-col symmetric → 2-col asymmetric copy-weight |
| §3.10 Blog | 3-card horizontal row | Prose-heavy → compact cards |
| §3.11 FAQ | Narrow centred reading column | Wide cards → narrow column |
| §3.12 Final CTA | Full-bleed navy with centred CTA | Narrow column → full-bleed finale |

Twelve sections, no two consecutive use the same composition. Checker verifies the alternation.

---

## 14. Requirement traceability

| Req ID | UI-SPEC section(s) |
|--------|---------------------|
| HK-01 (homepage) | §3 (all 12 sections) |
| HK-02 (Wan Chai) | §4 `/wan-chai/` row; §5.4 VenueMap; §8.2 LocalBusiness JSON-LD |
| HK-03 (Cyberport) | §4 `/cyberport/` row; §5.4 VenueMap; §8.2 LocalBusiness JSON-LD |
| HK-04 (Gymnastics pillar + 8 subs) | §4 pillar + 8 rows; §5.5 GymPillarNav |
| HK-05 (Holiday Camps) | §4 `/holiday-camps/` row |
| HK-06 (Birthday Parties) | §4 `/birthday-parties/` row |
| HK-07 (School Partnerships) | §4 `/school-partnerships/` row |
| HK-08 (Competitions & Events) | §4 `/competitions-events/` row; empty state per §Copywriting |
| HK-09 (Coaches) | §4 `/coaches/` row; §5.7 `HK_COACHES`; §11 D-07/D-08/D-09 |
| HK-10 (Blog) | §4 `/blog/` row; §5.7 `HK_BLOG_POSTS_STUB`; §3.10 empty state |
| HK-11 (FAQ) | §4 `/faq/` row; §3.11 FAQ on homepage; §8.3 JSON-LD |
| HK-12 (Book a Trial) | §4 `/book-a-trial/` + `/book-a-trial/free-assessment/`; §5.6 BookingForm; §6 flow; §Copywriting success/error |

---

*Phase: 04-hong-kong-market. UI design contract drafted: 2026-04-24.*

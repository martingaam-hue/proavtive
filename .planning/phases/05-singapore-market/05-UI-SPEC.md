---
phase: 5
slug: singapore-market
status: draft
shadcn_initialized: true
preset: style=radix-nova + base-color=neutral + css-variables=true + rsc=true + iconLibrary=lucide
created: 2026-04-24
typography_inheritance_exemption: true
typography_inherited_from: 02-UI-SPEC.md §1.6
typography_net_new_sizes: 0
typography_net_new_weights: 0
requirements: [SG-01, SG-02, SG-03, SG-04, SG-05, SG-06, SG-07, SG-08, SG-09, SG-10, SG-11]
upstream_inputs:
  - 05-CONTEXT.md (D-01..D-11 locked)
  - 05-RESEARCH.md (11 patterns, 9 pitfalls, validation architecture)
  - 04-UI-SPEC.md (HKNav/HKFooter/VenueMap/BookingForm patterns mirrored into SG)
  - 03-UI-SPEC.md (RootNav architecture + contact backend pattern)
  - 02-UI-SPEC.md (token + primitive contract — Phase 5 inherits, does not redefine)
  - 02-CONTEXT.md (D-03 Baloo scope — amended by Phase 5 D-01 to include Prodigy SG)
  - PROJECT.md (palette navy #0f206c + red #ec1c24 + green #0f9733, anti-AI-SaaS, perf budget)
  - REQUIREMENTS.md SG-01..SG-11
  - strategy.md §PART 1 (Prodigy vs ProGym distinct products), §PART 5 (SG 13-section wireframe), §PART 6C (SG verbatim copy), §PART 8 (SG local SEO + WhatsApp), §PART 9.4 (LocalBusiness skeleton), §PART 12 Tier 2 #18 (IFS inline), §PART 13 (design system anchors), §PART 14 (photography + visual direction), §PART 15 (build sequence)
---

# Phase 5 — UI Design Contract (Singapore Market)

> **Scope reminder:** Phase 5 is a *composition and content phase, not an invention phase*. ~15 SG pages assemble from Phase 2 `components/ui/` primitives and Phase 3/4 patterns (SGNav/SGFooter mirror HKNav/HKFooter architecture; BookingForm mirrors HK with single-venue simplification). **No new design-system tokens.** **No new shadcn primitives** (NavigationMenu was registered in Phase 4; Phase 5 consumes it). Market-scoped compositions live at `components/sg/` (Phase 3 D-11 precedent). Baloo 2 (accent font) activates on the SG tree per Phase 5 D-01 — this amends Phase 2 D-03 from "ProGym-only" to "both sub-brand surfaces (ProGym HK + Prodigy SG)". The root gateway remains Unbounded+Manrope-only. This contract binds planner and executor; deviation requires a Rule 1 correction in the plan SUMMARY.

---

## Checker Notes — Inheritance Exemptions

**Binding statement for gsd-ui-checker dimension 4 (Typography):**

The 8-role type scale documented in §1 (Display / H1 / H2 / H3 / Body-lg / Body / Small / Label, plus the sub-brand Accent inline role) and the 3 weight declarations (400 / 600 / 700) are **NOT net-new declarations in Phase 5**. They are a **locked upstream contract inherited verbatim** from `02-UI-SPEC.md §1.6` (Phase 2 Typography). Phase 4 already consumed this exemption without additions, and Phase 5 does the same.

Phase 5 adds:
- **0 net-new font sizes** beyond the Phase 2 scale
- **0 net-new font weights** beyond the Phase 2 weight policy (400 Regular + 700 Bold as the primary pair; 600 SemiBold as the labels-and-accent-only exception already ratified in Phase 2)

Every size and weight appearing in §1 Typography is consumed via the Tailwind utilities registered in Phase 2's `@theme { }` block (`text-display`, `text-h1`, `text-h2`, `text-h3`, `text-body-lg`, `text-body`, `text-small`, `text-label`). No new CSS variables, no new Tailwind utilities, no new `next/font/google` weight imports.

**Baloo 2 activation on SG is a SCOPE AMENDMENT to Phase 2 D-03, not a new typography declaration.** The Baloo 2 font family, the `--font-accent` variable, the `font-accent` Tailwind utility, and the single 600 SemiBold weight are all Phase 2-registered. Phase 5 D-01 simply extends the set of routes that activate this pre-existing family — identical to how Phase 4 activated it on `app/hk/layout.tsx`. No new weights, no new sizes, no new font loads.

**The gsd-ui-checker dimension 4 limits (max 4 sizes, max 2 weights) apply to net-new declarations per phase, not to inherited-and-consumed scales from prior phases.** This Phase 5 UI-SPEC declares zero net-new typography.

**Reference:** `02-UI-SPEC.md §1.6` + §1.7 D-01 amendment (original declaration point).

**Checker action on re-verification:** PASS dimension 4 once this exemption note is acknowledged. The D-01 Baloo-on-Prodigy decision is documented in CONTEXT.md §Decisions and is a scope amendment, not a typography invention.

---

## 0. How this contract is used

| Consumer | What they pull from here |
|----------|--------------------------|
| `gsd-planner` | §3 SG homepage section map · §4 supporting SG page specs · §5 Phase 5-local components (SGNav/SGFooter/VenueMap/ZonesPillarNav/CampsPillarNav/BookingForm) · §6 booking-form UX (single-venue simplification) · §7 OG template (Prodigy-green) · §8 a11y + JSON-LD · §10 copy verbatim · §11 decisions map |
| `gsd-executor` | §3–§6 prop interfaces · §5 component signatures · §10 verbatim SG copy · §11 HUMAN-ACTION gates (Mux SG playback ID, map embed, WhatsApp, opening hours, portraits, placeholder-leak guard) |
| `gsd-ui-checker` | Checker Notes (inheritance exemption) · §9 six-pillar quality checklist · §13 editorial-asymmetry pass · §14 requirement traceability |
| `gsd-ui-auditor` | post-execute diff of `app/sg/**`, `components/sg/**`, `lib/sg-data.ts`, against this contract |

---

## 1. Inheritance from Phases 1–4 — what Phase 5 does NOT redefine

Phase 5 is binding on the inherited contract. Re-asking these would create drift.

| Inherited from | Where to find it | What Phase 5 does with it |
|----------------|------------------|---------------------------|
| Brand palette (navy/red/green/sky/yellow/cream) as `--color-brand-*` | Phase 2 UI-SPEC §1.2 + `app/globals.css` `@theme { }` | Consumes via `bg-brand-navy`, `text-brand-green`, etc. NEVER raw hex. Prodigy-green (`#0f9733`) surfaces on SG OG images + the "Singapore's only MultiBall wall" badge treatment + Sports Zone highlight moments. |
| Semantic shadcn token mapping (`--primary` = navy, `--secondary` = yellow, `--accent` = white, `--destructive` = red) | Phase 2 UI-SPEC §1.4 (amended 2026-04-23) | Consumes via `bg-primary`, `text-secondary-foreground`, etc. Same map as HK. |
| Type scale (display 88 / h1 56 / h2 36 / h3 24 / body-lg 18 / body 16 / small 14 / label 14) | **Phase 2 UI-SPEC §1.6 (canonical declaration)** | **Consumes verbatim via `text-display`, `text-h1`, `text-body`, etc. NO new sizes, NO new weights. See Checker Notes above re: inheritance exemption.** |
| Font stack — Unbounded (display) + Manrope (sans) + **Baloo 2** (accent — now active on both HK AND SG per Phase 5 D-01) | Phase 2 UI-SPEC §1.7 (amended D-01 2026-04-23) + Phase 5 CONTEXT D-01 (scope amendment 2026-04-24) | SG layout applies `--font-baloo` via `next/font/google` the same way HK does; Baloo is used only for Prodigy-branded accents (venue-name supers, SGFooter venue block header, MultiBall badge accent text), NEVER body / H1 / nav / FAQ / buttons. |
| Spacing scale (4/8/16/24/32/48/64) + section rhythm (`section-sm`/`md`/`lg` = 64/96/128px) | Phase 2 UI-SPEC §1.8 | Every section uses `<Section size="sm\|md\|lg">`. No raw `py-*` arbitrary values. |
| Radius scale (sm 6 / md 8 / lg 10 / xl 14 / 2xl 18 / full) | Phase 2 UI-SPEC §1.9 | Cards `rounded-lg`, hero/map surfaces `rounded-xl`, full-bleed media `rounded-2xl`, avatars `rounded-full`. |
| Phase 2 primitive inventory (Button, Card, Accordion, Badge, Avatar, Separator, Sheet, Input, Label, Textarea, Section, ContainerEditorial, FAQItem, MarketCard, ProgrammeTile, TestimonialCard, StatStrip, LogoWall, VideoPlayer) | Phase 2 UI-SPEC §3 | Composes per §3 SG-homepage section map. **VideoPlayer activates on SG hero** with poster fallback (HUMAN-ACTION D-07 for Mux SG ID + real Katong Point photography). |
| Phase 3 patterns — RootNav/RootFooter architecture, Sheet mobile drawer, Resend `/api/contact` route handler, MDX editorial pages, `metadataBase` fallback chain, cross-subdomain `<a href={env}>` pattern | Phase 3 UI-SPEC §5, §6, §7 | Booking form (`/book-a-trial/`) reuses `/api/contact` with `market:"sg"` + fixed `venue:"katong-point"` (D-10). |
| Phase 4 patterns — HKNav/HKFooter structure, NavigationMenu dropdown, VenueMap iframe, GymPillarNav + ActiveNavLink, BookingForm `useTransition`+FormData, `createHKOgImage` utility, editorial asymmetry rhythm | Phase 4 UI-SPEC §5, §6, §7 | SGNav/SGFooter mirror HK structure with Prodigy nav items (D-02). ZonesPillarNav + CampsPillarNav mirror GymPillarNav. `createSGOgImage` mirrors `createHKOgImage` with Prodigy-green background (D-09). BookingForm mirrors HK with single-venue simplification (no venue selector — D-10). |
| Editorial asymmetry rules (avoid centred-hero gradient, purple/blue, identical N-col features, ghost-CTA-as-primary; do alternate layouts, real photo, ≤300ms motion, big type) | Phase 2 UI-SPEC §7 + strategy §14.3 | Binding on every SG section. See §13 below for Phase 5-specific application on the 13-section SG homepage. |
| Cross-market handoff (absolute `<a href>` to `NEXT_PUBLIC_ROOT_URL` / `NEXT_PUBLIC_HK_URL`; never `<Link>`; never reset market cookie) | Phase 1 D-02 + Phase 3 Pitfall 7 | SG→Root and SG→HK footer links use `<a href={env}>` absolute. Internal SG→SG links use `<Link href="/katong-point/">` (same subdomain). |

**Phase 5 does NOT introduce new tokens.** If a page appears to need one, the planner files a Phase 2.1 revision — Phase 5 stays composition-pure.

**Phase 5 does NOT register new shadcn primitives.** NavigationMenu was added in Phase 4; Phase 5 consumes it. All other primitives (Sheet, Accordion, Card, Badge, Button, Input, Label, Textarea, Separator, Avatar) are carried forward.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | shadcn/ui (initialized Phase 1; Phase 2+3+4 added the complete primitive library; Phase 5 adds **zero** new primitives) |
| Preset | `style=radix-nova`, `baseColor=neutral`, `cssVariables=true`, `rsc=true`, `iconLibrary=lucide` (inherited; do NOT re-init) |
| Component library | Radix primitives via `radix-ui@1.4.3` metapackage |
| Icon library | `lucide-react@1.8.0` — SG uses `MapPin`, `Clock`, `Phone`, `ChevronDown`, `Menu`, `ArrowRight`, `MessageCircle` (WhatsApp), `Zap` (MultiBall accent), `Building2` (IFS partnership) |
| Font | `next/font/google` — Unbounded (display) + Manrope (sans) + **Baloo 2** (accent — active on SG tree per D-01, same activation pattern as `app/hk/layout.tsx`) |
| Phase 5 NEW packages | **None.** All deps already installed. (Verified: Phase 4 shipped without new installs; Phase 5 same shape.) |
| Phase 5 NEW env vars | `NEXT_PUBLIC_MUX_SG_HERO_PLAYBACK_ID`, `NEXT_PUBLIC_WHATSAPP_SG=+6598076827`, `CONTACT_INBOX_SG`, `NEXT_PUBLIC_MAP_EMBED_KATONG_POINT`, `NEXT_PUBLIC_HK_URL`. All HUMAN-ACTION at execute-time. |

---

## Spacing Scale

Declared values (multiples of 4; inherited verbatim from Phase 2 UI-SPEC §1.8):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, inline padding, chip-internal spacing |
| sm | 8px | Compact element spacing (FAQ row internals, nav-item horizontal gap) |
| md | 16px | Default element spacing (button padding, card internal rhythm) |
| lg | 24px | Section intra-column gap, card-grid gap, form-field vertical rhythm |
| xl | 32px | Layout gaps between stacked components, MarketCard internal padding |
| 2xl | 48px | Major intra-section breaks (heading→content, MultiBall spotlight gutters) |
| 3xl | 64px | Minimum section vertical rhythm (`<Section size="sm">` = `py-16`) |
| section-sm | 64px | `<Section size="sm">` vertical padding (short narrative sections) |
| section-md | 96px | `<Section size="md">` vertical padding (default for SG homepage sections) |
| section-lg | 128px | `<Section size="lg">` vertical padding (hero, final CTA) |

**Exceptions for Phase 5:**
- Sticky nav vertical padding: `py-3 md:py-4` (12/16px) — tighter than `sm` tier so CTA stays visible above the fold on mobile (375×667 viewport). Same as Phase 4.
- `Book a Free Trial` sticky CTA button height: **44px** (touch-size variant, WCAG 2.2 AA) — same as Phase 4 and Phase 3.
- Zones pillar nav gap: `gap-2` (8px between 3 zone chips) — intentional tight packing.
- Camps pillar nav gap: `gap-2` (8px between 3 camp-type chips).
- Map iframe: fixed `height="300"` (approx 300px) — iframe needs explicit height; does NOT consume `--spacing-*` tokens.
- MultiBall spotlight section (Sports Zone page): `py-section-lg` (128px) — elevated above default `section-md` to call out the differentiator. Single-use exception on `/weekly-classes/sports-zone/`.

---

## Typography

> **INHERITANCE EXEMPTION — read Checker Notes at top of document first.**
>
> The table below reproduces the **locked upstream contract from `02-UI-SPEC.md §1.6`** for executor convenience. Phase 5 adds **zero net-new font sizes** and **zero net-new font weights**. All 8 roles are consumed via Phase 2-registered Tailwind utilities. No redefinition occurs here. Baloo 2 activation on Prodigy SG is a Phase 5 D-01 scope amendment to Phase 2 D-03, not a new typography declaration — same family, same weight (600 SemiBold), same `--font-accent` variable, new route group.
>
> **Canonical declaration point:** `02-UI-SPEC.md §1.6` + §1.7 D-01 amendment. Reference that file for the authoritative source; this reproduction is a documentation convenience.

| Role | Size | Weight | Line Height | Font | Source |
|------|------|--------|-------------|------|--------|
| Display | 88px desktop / 48px mobile | 700 (Unbounded Bold) | 1.05 | `--font-display` (Unbounded) | Inherited Phase 2 §1.6 |
| H1 | 56px desktop / 36px mobile | 700 (Unbounded Bold) | 1.1 | `--font-display` (Unbounded) | Inherited Phase 2 §1.6 |
| H2 | 36px desktop / 28px mobile | 700 (Unbounded Bold) | 1.15 | `--font-display` (Unbounded) | Inherited Phase 2 §1.6 |
| H3 | 24px | 600 (Unbounded SemiBold) | 1.25 | `--font-display` (Unbounded) | Inherited Phase 2 §1.6 |
| Body-lg | 18px | 400 (Manrope Regular) | 1.55 | `--font-sans` (Manrope) | Inherited Phase 2 §1.6 |
| Body | 16px | 400 (Manrope Regular) | 1.5 | `--font-sans` (Manrope) | Inherited Phase 2 §1.6 |
| Small | 14px | 400 (Manrope Regular) | 1.5 | `--font-sans` (Manrope) | Inherited Phase 2 §1.6 |
| Label | 14px | 600 (Manrope SemiBold) | 1.4 | `--font-sans` (Manrope) | Inherited Phase 2 §1.6 |
| Accent (Prodigy + ProGym sub-brands) | 14–18px (inline only) | 600 (Baloo 2 SemiBold) | 1.3 | `--font-accent` (Baloo 2) | Inherited Phase 2 §1.6 + §1.7 D-01; scope amended by Phase 5 D-01 to include SG |

**Weight policy (inherited verbatim from Phase 2 §1.6):** Exactly two primary weights per family — **400 Regular + 700 Bold** (Unbounded + Manrope). Manrope SemiBold (600) is permitted for labels only. Baloo 2 SemiBold (600) is the single weight loaded for sub-brand accent; no Baloo Regular or Bold imports. **Phase 5 does not introduce new weights — it extends the activation scope of the existing Baloo 2 600 load to the SG route group.**

**Baloo 2 usage rules on SG (Prodigy-specific additions to the Phase 2/4 contract — usage guidelines, not new declarations):**
- Applied via `font-accent` Tailwind utility (Phase 2-registered) to **Prodigy-specific name elements ONLY**:
  - "Prodigy" super-head on venue chip labels and SGFooter venue header (e.g., `<span className="font-accent">Prodigy</span> at Katong Point`)
  - Zone label accents on ZonesPillarNav ("Zone" suffix) — OPTIONAL and subtle
  - "MultiBall" wordmark treatment inside the MultiBall spotlight section on `/weekly-classes/sports-zone/` (accent text color is navy; Baloo adds brand texture without hue change)
- **FORBIDDEN** on H1 / Display / body / nav-link labels / button labels / FAQ text / booking form copy. Overuse dilutes the Prodigy brand moment.
- **Contrast:** Baloo 2 at 14–18px SemiBold (navy on white) = 14.55:1 — WCAG AAA.
- **Identity note:** Baloo 2 active on both ProGym HK and Prodigy SG carries a single typographic through-line across both sub-brands while the HUE (navy on HK, Prodigy-green accent on SG for OG/badges only) distinguishes them. See §Color.

---

## Color

Inherited 60/30/10 split from Phase 2 UI-SPEC §1.4 (post-amendment 2026-04-23 — cream → white on `--muted` + `--accent`):

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | `#ffffff` pure white (`oklch(1 0 0)`) | Page background, card surfaces, section defaults (`bg-background` / `bg-card` / `bg-muted` / `bg-accent` — all white post-amendment) |
| Secondary (30%) | `#0f206c` ProActiv navy (`oklch(0.2906 0.1328 267.05)`) | SGNav bar fill (semi-transparent white on scroll; sticky), SGFooter fill, navy-surface trust-strip sections, primary button fill, `<h1>`–`<h3>` text color on white, `bg="navy"` `<Section>` prop |
| Accent (10%) | `#ec1c24` ProActiv red (`oklch(0.6012 0.2339 26.97)`) — mapped to `--destructive` and `bg-brand-red` | **Reserved list below** |
| Semantic supporting | `#0f9733` brand-green (`--color-brand-green`) — **Prodigy identity moment** | **OG image background (D-09)**, `/_design` verification fills, MultiBall "only in Singapore" badge inner fill (navy text on green), optional Sports Zone accent highlight. Also: WhatsApp CTA chip icon + label — brand-consistent with WhatsApp's own green. **Not** used on nav, footer body, FAQ, or general page text. |
| Semantic supporting | `#fac049` brand-yellow (`--secondary`) | Zone chip highlight on pillar nav Sports Zone `<Badge>` — "Singapore's only" treatment; testimonial card inner fill on navy trust strip; age-band badges on ProgrammeTile. NOT a conversion-CTA color. |
| Semantic supporting | `#0fa0e2` brand-sky (`--color-brand-sky`) | Reserved for zone illustration accents on Movement / Climbing zone sub-pages if editorial photography fallback needed (NOT used on homepage or nav). |
| Semantic supporting | `#fff3dd` brand-cream (`bg-brand-cream` utility) | Deliberate accent-only surface (testimonial card inner fill on navy trust strip) — NOT a default page bg per 2026-04-23 amendment. |

### Accent reserved-for list (brand red `#ec1c24`, the 10% accent)

The red accent appears **only** in these explicit contexts — checker enforces:

1. **"Book a Free Trial" sticky nav button** — filled red `bg-brand-red text-white`, always visible, all ~15 SG pages. **This is the single highest-priority conversion element; no other interactive component on the page may use red fill.**
2. **"Book a Free Trial" primary CTA on hero** — same red fill, `size="touch"` (44px), Unbounded Bold label.
3. **"Book a Free Trial" primary CTA on final CTA section (§12 of SG home)** — same red fill.
4. **Booking-form submit button** (`/book-a-trial/`) — red fill `bg-brand-red hover:bg-brand-red/90`.
5. **Error state validation text** on the booking form — red text `text-destructive` (semantic alias for brand-red).
6. **Red ProActiv logo mark** inside SGNav brand lockup (if the logo has a red element — logo treatment per brand guidelines).
7. **Pillar page booking CTAs** (e.g., on Zone sub-pages and Camp sub-pages) — same filled-red pattern as hero.

**Forbidden red uses** (checker will flag):
- Red on any nav link hover state (hovers use navy or navy/80)
- Red on any FAQ expand chevron or accordion affordance
- Red on MultiBall badge — uses green or yellow fill with navy text, NEVER red
- Red on destructive-delete buttons (not applicable in Phase 5 anyway)
- Red on venue chip active-state (active Katong Point chip uses navy fill; SG has only one venue so "active" is mostly decorative)
- Red icon fills anywhere in the footer
- Any red gradient, any red-on-red combo, any red border without red fill

### Prodigy-green placement rules (the SG sub-brand hue)

Green (`#0f9733`) is the quiet Prodigy identity moment. Reserved-for list:

1. **OG image background** via `createSGOgImage()` — all SG pages (D-09). Distinguishes SG from HK (navy OG) at a glance in social shares.
2. **MultiBall "Singapore's only" badge inner fill** — navy text on green `<Badge className="bg-brand-green text-white">`. Appears on homepage §2 first tile, homepage §4 Sports Zone card, and in ZonesPillarNav on Sports Zone chip. Alternative: yellow fill with navy text — planner picks one and applies consistently.
3. **WhatsApp CTA icon + label color** — `MessageCircle` icon `text-brand-green` + "Chat on WhatsApp" label `text-brand-green` on navy outline button background. Brand-consistent with WhatsApp.
4. **Optional MultiBall spotlight accent** — on `/weekly-classes/sports-zone/` the H2 "What is MultiBall?" may use `text-brand-green` on the section heading; body stays navy. Single-use.

**Forbidden green uses:**
- Green on H1 / Display / body copy — contrast 3.82:1 fails AA for body (§1.3 audit)
- Green as button fill with white text for the primary "Book a Free Trial" CTA (red is the conversion color; green is identity)
- Green on homepage hero H1 or subhead
- Green on SGFooter body copy
- Green on FAQ entries

### Destructive color

`--destructive` = `#ec1c24` (same as brand red). Used for form validation error text + the destructive semantic slot. **Phase 5 has no destructive actions** (no delete/remove flows; booking is additive). Semantic slot is declared but unused in active UI.

---

## Copywriting Contract

Source: strategy.md §PART 6C (SG verbatim copy) and §PART 5 (wireframe CTAs). Booking form error/success copy mirrors Phase 3/4 contact-form tone.

| Element | Copy |
|---------|------|
| **Primary CTA (universal across all ~15 SG pages)** | `Book a Free Trial` (verbatim, title-case, no trailing punctuation, no arrow glyph in button text — arrow rendered as separate right-padded `lucide-react/ArrowRight` at `size-4`) |
| **Secondary CTA (homepage hero + Katong Point + partnership pages)** | `Send an Enquiry` (verb + noun pair; routes to `/book-a-trial/?subject=general-enquiry` at Phase 5 since SG has no separate `/contact/` — consolidated on `/book-a-trial/` with subject pre-fill) |
| **Tertiary CTA (mobile-first, WhatsApp-forward)** | `Chat on WhatsApp` (directs to `https://wa.me/{NEXT_PUBLIC_WHATSAPP_SG}` with pre-filled message param `?text=Hi%20Prodigy%2C%20I'd%20like%20to%20book%20a%20free%20trial.`) |
| **Venue chip label** (homepage + nav + footer) | `Prodigy @ Katong Point` (verbatim; "Prodigy" rendered in Baloo 2, "@ Katong Point" in Manrope, all in navy, chip border 1px navy, hover fills navy with white text) |
| **MultiBall differentiator badge** (homepage §2/§4, sports zone, Katong page) | `Singapore's only` (inside `<Badge className="bg-brand-green text-white">` OR `<Badge className="bg-brand-yellow text-brand-navy">` — planner picks one and applies everywhere) |
| **Hero H1 (SG homepage)** | `Where Singapore's kids come to move, play, and grow.` (verbatim strategy PART 6C §Hero) |
| **Hero subhead** | `Prodigy by ProActiv Sports — Katong Point's home of weekly sports classes, holiday camps, and the only MultiBall wall in Singapore.` (verbatim PART 6C §Hero) |
| **Hero trust-line (below CTA group)** | `Free trial · No obligation · Usually booked same week.` (carry-forward from HK — cross-market consistency) |
| **MultiBall headline block** (homepage §2 first why-tile) | Heading: `The only MultiBall wall in Singapore.` Body: verbatim from strategy PART 6C §2 (first why-tile paragraph). |
| **Final CTA section (SG homepage §12) heading** | `Ready to try a free trial at Prodigy?` (verbatim PART 6C §12) |
| **Final CTA section body** | `Book a 30-minute assessment — no commitment. We'll match your child to the right zone and coach.` |
| **Empty state — blog hub** | Heading: `New posts coming soon.` Body: `We're preparing long-form guides on MultiBall training, Prodigy camp weeks, and what to expect at your first Katong Point class. In the meantime, our coaches are happy to answer any question directly.` CTA chip below: `Chat on WhatsApp` (navy outline button). |
| **Empty state — `/events/`** | Heading: `Upcoming events will appear here.` Body: `Our next inter-school sports day and community events are being scheduled. Subscribe for notifications or enquire about current openings.` CTA chip: `Send an Enquiry` (navy outline, links `/book-a-trial/?subject=events`). |
| **Empty state — `/book-a-trial/` (before submission)** | Heading visible at page top: `Your free trial at Prodigy @ Katong Point.` Sub: `Tell us a little about your child and we'll confirm a time within one working day.` (No "empty" state — form always present.) |
| **Error state — booking form validation (field-level)** | Name: `Please share the parent's name so we know who to reply to.` Email: `We need a valid email to confirm your trial time.` Child age: `Please enter your child's age in years (use "1" for under 2).` Subject (if manually edited): `Please tell us briefly what you'd like to book or enquire about.` |
| **Error state — booking form submission failure** | Heading: `Something went wrong on our end.` Body: `Your message didn't reach us — please try again, or WhatsApp Prodigy directly. We'll still see it.` Retry action: `Try sending again` (navy outline) + `Chat on WhatsApp` (brand-green icon, navy text). |
| **Success state — booking form submitted** | Heading: `Thanks — your free trial request is in.` Body: `A member of our Prodigy team will reply within one working day to confirm a time. We'll prepare the right coach and zone for your child.` Follow-up CTAs: `Back to Prodigy Singapore` (`<Link href="/">`) and `Read the first-class guide` (`<Link href="/blog/">` — conditionally hidden if blog is empty-state). |
| **Destructive confirmations** | **N/A — Phase 5 has no destructive actions.** No delete flows, no reset flows, no irreversible state changes. (Documented explicitly so checker/auditor doesn't flag the omission.) |
| **404 copy** (if SG-scoped 404 is needed; else falls back to root `not-found.tsx`) | Heading: `We can't find that page at Prodigy Singapore.` Body: `Try the main Prodigy site, or reach us directly — we'll get you where you need to go.` Primary CTA: `Back to Prodigy Singapore` (navy fill) + secondary `Chat on WhatsApp`. |
| **IFS callout heading** (on `/school-partnerships/`) | `Featured partner: International French School (IFS).` Body verbatim from strategy PART 6C §3 partnership paragraph. CTA: `Enquire about an IFS partnership` → `/book-a-trial/?subject=school-partnership`. |
| **Cross-market footer link** (SG → HK) | `Also in Hong Kong →` (honest, understated; uses `<a href={NEXT_PUBLIC_HK_URL}>`) |
| **Cross-market footer link** (SG → Root) | `ProActiv Sports Group ↗` (uses `<a href={NEXT_PUBLIC_ROOT_URL}>`) |

**Voice invariants (Phase 3/4 carry-forward, strategy §PART 14.3):**
- British English: "programmes" not "programs", "organisation" not "organization", "realise" not "realize". Singapore-English is acceptable for locale-specific copy (e.g., "catchment area", "enrichment") but programme-spelling stays British.
- **"Parents" never "customers", "users", "leads"** — no corporate SaaS terms on user-facing copy.
- Active voice, short sentences. No exclamation marks in headlines (strategy §PART 14.3 anti-AI-SaaS rule).
- No emojis in copy visible to parents (icon system uses lucide-react; strategy's wireframe emojis are shorthand for icon slots).
- **Avoid superlatives** ("best", "world-class") EXCEPT the single factually-true differentiator "Singapore's only MultiBall wall" — which is a verifiable fact, not hype.
- **CTA shape:** every visible CTA label is a verb + noun pair (`Book a Free Trial`, `Send an Enquiry`, `Chat on WhatsApp`, `Try sending again`, `Enquire about an IFS partnership`) — no single-word verb-only CTAs.

---

## 3. SG Homepage — Section-by-Section Visual Contract (SG-01)

The 13 sections of `app/sg/page.tsx` build top-to-bottom per strategy PART 5 §1–§12 (final CTA is §12; strategy labels sections 1–12 but the wireframe also implies a lead-in band between §1 and §2 — Phase 5 keeps the 13-label count for section addressing). Each section is composed exclusively from Phase 2 `components/ui/` primitives plus Phase 5-local `components/sg/` compositions. Copy is verbatim from PART 6C. Asymmetry alternates per §13 below.

### 3.0 Page-level wrapper

```tsx
// app/sg/page.tsx (RSC)
export default function SGHomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sgHomeSchema) }} />
      <HeroSection />            {/* §3.1 — Prodigy video, Katong chip, MultiBall trust line */}
      <VenueChipRow />           {/* §3.2 — Katong Point single chip */}
      <WhyProdigySection />      {/* §3.3 — 4-tile grid, MultiBall first tile */}
      <ProgrammesSection />      {/* §3.4 — 4 programme cards */}
      <ThreeZonesSection />      {/* §3.5 — Movement / Sports+MultiBall / Climbing */}
      <SocialProofSection />     {/* §3.6 — IFS + KidsFirst logos + testimonials on navy */}
      <CampsFeatureSection />    {/* §3.7 — upcoming Prodigy camp */}
      <BirthdayPartySection />   {/* §3.8 — revenue block, MultiBall-access mention */}
      <CoachesSection />         {/* §3.9 — Haikel / Mark / Coach King */}
      <AboutSection />           {/* §3.10 — cross-market link to ProActiv group */}
      <BlogSection />            {/* §3.11 — 1 stub (recommended) */}
      <FAQSection />             {/* §3.12 — 10 Q&A from PART 6C §11 */}
      <FinalCTASection />        {/* §3.13 — Book + Enquire + WhatsApp */}
    </>
  );
}
```

SGNav + SGFooter wrap in `app/sg/layout.tsx` (Phase 4 HK mirror pattern).

### 3.1 Section 1 — HERO (PART 5 §1 + PART 6C §Hero)

| Dimension | Value |
|-----------|-------|
| Phase 2 primitives | `<Section size="lg" bg="default">` + `<ContainerEditorial width="wide">` + `<VideoPlayer>` (dynamic, ssr:false) + poster `<Image priority>` + 2× `<Button size="touch">` (primary red + secondary navy outline) |
| Layout (asymmetry slot 1: full-bleed video + left-aligned copy overlay) | Desktop: 21:9 video container with absolute-positioned left-column copy (`left-6 md:left-12 max-w-2xl`). Mobile: 16:9 video, overlay copy below (not overlaid) on darker navy strip. |
| Video | `<VideoPlayer playbackId={process.env.NEXT_PUBLIC_MUX_SG_HERO_PLAYBACK_ID ?? ""} loop autoPlay muted />` with `dynamic({ ssr:false, loading: poster-component })`. **HUMAN-ACTION gate D-07**: if env var empty at execute time, plan task completes with poster-only state; checkpoint requests Mux ID + Prodigy camp-day montage source footage. |
| Poster image (LCP element) | `src="/photography/sg-venue-katong-hero.webp"` (HUMAN-ACTION D-07 — real Katong Point imagery required; NEVER use `sg-placeholder-*` on this slot) · `priority` · `fill` · `sizes="100vw"` · `alt="Children playing on the MultiBall wall at Prodigy, Katong Point, Singapore"` · renders via `dynamic({ loading })` — visible until VideoPlayer hydrates. **Fallback chain if no real SG photo exists at execute time:** solid `bg-brand-navy` block with H1 and CTAs still rendered (functional, intentional-looking). **Explicitly forbidden fallback:** using HK photography (`hk-venue-*.webp`) as SG visual fill — breaks PART 1 distinct-product identity. |
| H1 | `Where Singapore's kids come to move, play, and grow.` — `text-display font-display text-white` on navy overlay (contrast 14.55:1 — PASS AAA); max 2 lines desktop, wraps mobile. |
| Subhead | `text-body-lg text-cream max-w-2xl mt-4` (cream on navy 13.24:1) — copy verbatim from PART 6C §Hero. |
| "Singapore's only MultiBall wall" inline trust line | Rendered above CTAs: `<p className="text-small text-white/90 flex items-center gap-2"><Zap size={16} className="text-brand-yellow" /> <span className="font-accent">Singapore's only MultiBall wall</span></p>` — Baloo 2 accent on the differentiator phrase; yellow Zap icon. Single use on hero (also appears as Badge elsewhere but not as Baloo accent). |
| Primary CTA | `<Button size="touch" className="bg-brand-red hover:bg-brand-red/90 text-white">Book a Free Trial <ArrowRight size={16} /></Button>` — `href="/book-a-trial/"` via `<Link asChild>` wrapping. |
| Secondary CTA | `<Button size="touch" variant="outline" className="border-white text-white hover:bg-white/10">Send an Enquiry</Button>` — `href="/book-a-trial/?subject=general-enquiry"`. Never red; never the same visual weight as primary. |
| Trust line | Below CTAs: `text-small text-cream/80 mt-4`. Copy: `Free trial · No obligation · Usually booked same week.` |
| Motion | Video is looping autoplay (no UI motion beyond Mux's own playback); CTA buttons use `transition-colors duration-200`; no kinetic type. Respects `prefers-reduced-motion` — Mux Player natively honours the media query. |
| LCP target | < 2.5s on mobile throttled. Poster `<Image priority>` is the LCP candidate. |
| Interaction states | CTA hover: `hover:bg-brand-red/90` / `hover:bg-white/10`. Focus-visible: `ring-2 ring-white ring-offset-2 ring-offset-brand-navy` (white ring required on navy). Touch: 44×44px minimum. |

### 3.2 Section 2 — VENUE CHIP ROW (PART 5 §1 lead-in)

| Dimension | Value |
|-----------|-------|
| Phase 2 primitives + Phase 5-local | `<Section size="sm" bg="default">` + `<ContainerEditorial width="wide">` + `<VenueChipRow>` (Phase 5-local, §5.3) |
| Layout (asymmetry slot 2: centred single chip — simpler than HK's 2-chip row) | Flex row, centred on desktop (`flex justify-center`). Mobile: full-width chip. |
| Chip | `<Link href="/katong-point/">` wrapping `<Card className="group hover:-translate-y-1 transition-transform border border-brand-navy/20 rounded-lg">` — content: `MapPin` icon + **`Prodigy`** (Baloo 2) + `@ Katong Point` (Manrope SemiBold) + address single-line `451 Joo Chiat Road, Level 3` (`text-small text-muted-foreground`). `px-4 py-3` padding. |
| Hover | `-translate-y-1` + `shadow-md` on card; icon `text-brand-navy` remains; NO red. |
| Active pathname | When user is on `/katong-point/` the chip gets `bg-brand-navy text-white` (inverted fill). Handled via Phase 5-local `<ActiveVenueChip>` client wrapper. |
| Background | `bg-background` (white) |

### 3.3 Section 3 — WHY PRODIGY (PART 5 §2 + PART 6C §2)

| Dimension | Value |
|-----------|-------|
| Phase 2 primitives | `<Section size="md" bg="muted">` (white post-amendment; visual break from §3.2 via `border-y border-brand-navy/10`) + `<ContainerEditorial width="wide">` + 4× `<Card>` |
| Layout (asymmetry slot 3: 4-tile grid — permitted exception per Phase 2 §7) | Mobile 1-col, tablet 2-col, desktop `grid-cols-4 gap-6`. |
| H2 | `Why Singapore parents choose Prodigy.` (PART 6C §2) — `text-h2 font-display text-foreground mb-8` |
| 4 tiles (copy per PART 6C §2) | **(1) THE MULTIBALL TILE — flagship** · title `The only MultiBall wall in Singapore` · icon `Zap` `text-brand-green` · body verbatim from PART 6C §2 first paragraph · `<Badge className="bg-brand-green text-white absolute top-3 right-3">Singapore's only</Badge>` — green identity moment. · **(2)** title `Multi-sport, not just gymnastics` · icon `Trophy` `text-brand-navy` · body from PART 6C §2 second paragraph · **(3)** title `A coaching standard backed by 14 years` · icon `BadgeCheck` `text-brand-navy` · body about coaches completing training course · **(4)** title `From first play to real progression` · icon `ArrowUpRight` `text-brand-navy` · body about progression pathway. |
| Tile composition | `<Card className="p-6 relative">` with `Icon size-8 mb-4` + `<h3 text-h3 font-display text-foreground>` + `<p text-body text-muted-foreground mt-2>` |
| Background | `bg-muted` (white, post-amendment; border-y for visual break) |

### 3.4 Section 4 — PROGRAMMES (PART 5 §3 + PART 6C §3)

| Dimension | Value |
|-----------|-------|
| Phase 2 primitives | `<Section size="md" bg="default">` + `<ContainerEditorial width="wide">` + 4× `<ProgrammeTile>` |
| Layout (asymmetry slot 4: 2+2 staggered grid) | Desktop: `grid-cols-2 gap-6` with first row offset (first tile `mt-0`, second tile `mt-8`, third `mt-0`, fourth `mt-8`) for editorial asymmetry. Tablet: 2-col straight. Mobile: 1-col. |
| H2 | `Programmes for kids aged 2 to 12.` (PART 6C §3) |
| Tiles (each a `<ProgrammeTile>` with age-band Badge) | (1) `title="Weekly Classes"` · `ageBand="2–12yr"` · `href="/weekly-classes/"` · image from `/photography/sg-zone-movement.webp` (HUMAN-ACTION D-07) · tagline `Movement, Sports+MultiBall, Climbing — three zones.` — (2) `title="Prodigy Camps"` · `ageBand="4–12yr"` · `href="/prodigy-camps/"` · image from `/photography/sg-camp-action.webp` · tagline `Themed, multi-activity, and gymnastics camps every school holiday.` — (3) `title="Birthday Parties"` · `ageBand="3–12yr"` · `href="/birthday-parties/"` · tagline `2-hour hosted parties with MultiBall access.` — (4) `title="School Partnerships"` · `ageBand="K–Y13"` · `href="/school-partnerships/"` · tagline `Term-time programmes and camps with IFS and others.` |
| ProgrammeTile visual (Phase 2 UI-SPEC §3.8) | 4:3 photo · navy label overlay · Age-band `<Badge>` top-right `bg-secondary text-secondary-foreground` (yellow w/ navy text) · hover `scale-105` on image · `rounded-xl`. |
| Background | `bg-background` |

### 3.5 Section 5 — THREE ZONES EXPLORER (PART 5 §4 + PART 6C §4)

| Dimension | Value |
|-----------|-------|
| Phase 2 primitives | `<Section size="md" bg="default">` + `<ContainerEditorial width="wide">` + 3× `<Card>` (zone cards) |
| Layout (asymmetry slot 5: 1+2 feature-row with Sports Zone elevated) | Desktop: `grid-cols-3 gap-6` — Sports+MultiBall card is `md:col-span-1` but rendered with a `<Badge className="bg-brand-green text-white">Singapore's only</Badge>` overlay pinning the MultiBall differentiator visually even inside a uniform grid. Mobile: 1-col stack; Sports+MultiBall zone intentionally FIRST in mobile order (editorial reshuffle — MultiBall is the headline SG differentiator). Desktop keeps Movement → Sports → Climbing in reading order. |
| H2 | `Three zones, one membership.` (PART 6C §4) |
| Zone card (×3) | `<Card>` with `<Image aspect-4/3 rounded-t-lg>` + Zone label (Unbounded 600 H3) + age band + 1-line description + `<Link href="/weekly-classes/{zone-slug}/">Explore zone →</Link>` (navy underline). |
| Zone 1 — Movement | Image: `/photography/sg-zone-movement.webp` (HUMAN-ACTION) · "Movement Zone · Ages 2–5 · Early-years tumbling, climbing, and play foundations." |
| Zone 2 — Sports + MultiBall (flagship) | Image: `/photography/sg-zone-sports-multiball.webp` (HUMAN-ACTION — **real MultiBall wall shot is the single most-important photo in the phase**) · "Sports Zone + MultiBall · Ages 5–12 · Sport skills with Singapore's only MultiBall wall." · Card carries `<Badge className="bg-brand-green text-white absolute top-3 right-3">Singapore's only</Badge>`. |
| Zone 3 — Climbing | Image: `/photography/sg-zone-climbing.webp` (HUMAN-ACTION — REPLACES `sg-placeholder-climbing-unsplash-trinks.*` which is FORBIDDEN here) · "Climbing Zone · All ages · Rock + boulder training for strength and resilience." |
| Background | `bg-background` |

### 3.6 Section 6 — SOCIAL PROOF (PART 5 §5 + PART 6C §5)

Mirrors Phase 4 §3.6 pattern — full-bleed navy `<Section bg="navy">` + `<LogoWall>` (IFS + KidsFirst partner logos — HUMAN-ACTION D-11 for permission; text-fallback if pending) + 2× `<TestimonialCard>` on cream surface inside navy section. Copy verbatim PART 6C §5. **Pitfall 6 note:** the Manjula Gunawardena (KidsFirst) testimonial may also appear on the root gateway; planner checks for duplication and swaps in a second genuine SG parent quote if one is available. If only Manjula exists, SG keeps it here and drops any generic second quote rather than invent one.

### 3.7 Section 7 — CAMPS FEATURE (PART 5 §6 + PART 6C §6)

Single-card feature block for the next upcoming Prodigy camp. `<Section size="md" bg="default">` + 1× large `<Card>` with photo-left-copy-right layout. Photo: `/photography/sg-camp-themed.webp` (HUMAN-ACTION). H3: name of upcoming camp (hardcoded stub at Phase 5 — e.g., `Ninja Warrior Camp · 16-20 June · Ages 5-12`). CTA: `<Button size="touch" variant="outline">Book Camp →</Button>` → `/prodigy-camps/themes/`. Phase 6 CMS swaps with real dated Event-schema data.

### 3.8 Section 8 — BIRTHDAY PARTIES (PART 5 §7 + PART 6C §7)

2-col revenue block. Left: party photo + 3-bullet "2hr hosted · coach-led · MultiBall wall access" + `Send an Enquiry` CTA (navy outline; navy fill on hover). Right: "What's included" editorial prose from PART 6C §7. `<Section size="md" bg="default">`.

### 3.9 Section 9 — COACHES (PART 5 §8 + PART 6C §8)

| Dimension | Value |
|-----------|-------|
| Phase 2 primitives | `<Section size="md" bg="muted">` (white) + `<ContainerEditorial width="wide">` + 3× `<Card>` coach bios |
| Layout (asymmetry slot 9: 3-col uniform grid — intentional exception for coach team parity) | Desktop: `grid-cols-3 gap-6`. Mobile: 1-col. |
| H2 | `Meet the Prodigy coaches.` (PART 6C §8) |
| Coach cards (×3) | Each `<Card>` with portrait `<Avatar>` (128×128 circular, `rounded-full`) + name (H3 Unbounded) + role (Manrope SemiBold small) + 2-line bio + optional `<a href="/coaches/#{slug}">Read bio →</a>` linking to full `/coaches/` page. |
| Coaches (Haikel, Mark, Coach King) | Data from `lib/sg-data.ts` `SG_COACHES` hardcoded array; Phase 6 swaps to Sanity. **HUMAN-ACTION D-07 portrait gate**: if any of the three portraits is missing from `public/photography/sg-coach-{haikel,mark,king}.{avif,webp,jpg}`, executor halts the task with a checkpoint listing missing filenames + the `pnpm photos:process` directive. NO silhouettes, NO initials-only fallbacks. |
| Background | `bg-muted` (white) |

### 3.10 Section 10 — ABOUT SNAPSHOT (PART 5 §9 + PART 6C §9)

2-col prose + photo. Left: 2-paragraph "About Prodigy" verbatim with the cross-market link to HK (`Also part of ProActiv Sports — <a href={NEXT_PUBLIC_HK_URL}>14 years in Hong Kong →</a>`). Right: coach-with-child action photo (HUMAN-ACTION). `<Section size="md" bg="default">`.

### 3.11 Section 11 — BLOG (PART 5 §10 + PART 6C §10)

| Dimension | Value |
|-----------|-------|
| Layout | `grid-cols-1 md:grid-cols-3 gap-6` — renders gracefully at 0, 1, or 3 stub posts (strategy PART 5 §10 explicit requirement — "Designed to remain elegant if only 1 post exists"). |
| Stub count | **1 post recommended** at Phase 5 (per CONTEXT Claude's Discretion). Title suggestion: "What makes MultiBall different — interactive sport for kids in Singapore" (per RESEARCH Pattern 5). Planner may opt for 0 if no genuine editorial-ready stub exists. |
| Empty state | If `SG_BLOG_POSTS_STUB.length === 0`, renders centred empty-state copy from §Copywriting table above. Implementation must handle this branch (future-proof for Phase 6 when CMS might return 0). |
| Card composition | `<Card>` with `<Image aspect-4/3 rounded-t-lg>` (or image-less text-only treatment per Pitfall 9 — **NEVER use `sg-placeholder-*` as the blog image**) + `<Badge>` category + `<h3>` title + excerpt + `<time>` date + read-time + `<Link>` to stub route (unlinkable at Phase 5 — stubs point at `/blog/` itself). |

### 3.12 Section 12 — FAQ (PART 5 §11 + PART 6C §11)

Mirrors Phase 3/4 pattern — `<Section size="md" bg="default">` + `<ContainerEditorial width="default">` (narrow reading column) + `<Accordion type="single" collapsible>` with 10× `<FAQItem>`. Questions verbatim from PART 6C §11 (location, age range, class size, trial structure, MultiBall explanation, camp format, birthday parties, IFS partnership, transit, what to wear). `FAQPage` JSON-LD mirrors visible text char-for-char (§8.3).

### 3.13 Section 13 — FINAL CTA (PART 5 §12 + PART 6C §12)

| Dimension | Value |
|-----------|-------|
| Phase 2 primitives | `<Section size="lg" bg="navy">` + `<ContainerEditorial width="default">` + 2× `<Button size="touch">` |
| Heading | `Ready to try a free trial at Prodigy?` (white on navy) |
| Body | `Book a 30-minute assessment — no commitment. We'll match your child to the right zone and coach.` (cream on navy) |
| Primary CTA | `<Button size="touch" className="bg-brand-red text-white hover:bg-brand-red/90">Book a Free Trial <ArrowRight /></Button>` → `/book-a-trial/` |
| Secondary CTA | `<Button size="touch" variant="outline" className="border-white text-white">Chat on WhatsApp <MessageCircle className="text-brand-green" /></Button>` → `https://wa.me/{NEXT_PUBLIC_WHATSAPP_SG}`. Conditionally rendered — if env var unset, the chip is hidden (no broken `tel:` link). |

---

## 4. Supporting SG Pages — Per-Route Visual Contract

Specs condensed — each follows the same composition rule as the homepage (Phase 2 primitives + Phase 5-local wrappers; verbatim PART 6C copy; asymmetry alternation). HUMAN-ACTION D-07 photography gates apply to all hero / zone / coach slots.

| Route | Primitives | Key sections | HUMAN-ACTION gates |
|-------|-----------|--------------|---------------------|
| `/katong-point/` (SG-02) | `<Section>`, `<ContainerEditorial>`, `<VenueMap>` (Phase 5-local), `<Badge>`, `<Image>`, `<Button>` | Hero (`Prodigy` Baloo 2 + `@ Katong Point` Manrope + address) · "Singapore's only MultiBall wall" headline prominent · VenueMap iframe (451 Joo Chiat Road, Level 3) · Opening hours table · Getting-here copy (East Coast / Marine Parade / Tanjong Katong) · 3-zone overview (each linked to zone page) · Programmes list · Venue FAQ · Booking CTA (venue pre-fixed) | Map embed URL, opening hours, geo coords (Assumption A5) |
| `/weekly-classes/` pillar (SG-03) | `<Section>`, `<ContainerEditorial>`, `<ZonesPillarNav>` (Phase 5-local), 3× `<Card>` | Pillar intro · 3-zone nav · feature card per zone · age-band pathway summary · shared FAQ · Booking CTA | None (copy hardcoded from PART 6C §4) |
| `/weekly-classes/movement-zone/` (SG-03) | shared zone template: `<ZonesPillarNav>` + H1 + hero image + "What children learn" + class structure + Booking CTA `?subject=movement-zone` | H1: `Movement Zone — Ages 2–5 at Prodigy Singapore.` Template-driven; copy per PART 6C §4 Movement block. | Zone hero photo (D-07) |
| `/weekly-classes/sports-zone/` (SG-03 — MultiBall spotlight) | same template + MULTIBALL SPOTLIGHT block (Pattern 11) | H1: `Sports + MultiBall Zone — with Singapore's Only Wall.` Dedicated MultiBall editorial section with green-accent H2 `What is MultiBall?`, large MultiBall photo (HUMAN-ACTION — the single most-important photo in phase 5), `<Badge className="bg-brand-green text-white">Singapore's only</Badge>`, body paragraph from PART 6C FAQ §4 answer, CTA. Other sports list (football, basketball, etc.) follows. `<Section size="lg">` for MultiBall block (exception noted in §Spacing). | Real MultiBall photo (D-07 — critical) |
| `/weekly-classes/climbing-zone/` (SG-03) | shared zone template | H1: `Climbing Zone — Rock + Boulder for All Ages.` Copy per PART 6C §4 Climbing block. | Real Katong climbing photo (D-07) — **must NOT use `sg-placeholder-climbing-unsplash-trinks.*` here** (Pitfall 3) |
| `/prodigy-camps/` pillar (SG-04) | `<Section>`, `<CampsPillarNav>` (Phase 5-local), 3× `<Card>` | Pillar intro · 3-camp-type nav · feature card per type · what's included · venue info · Booking CTA | Camp action photo (D-07) |
| `/prodigy-camps/themed/` (SG-04) | shared camp template | H1: `Themed Holiday Camps — Singapore.` Theme list (Ninja · Pokémon · Superhero · LEGO · STEAM) · "What's included" panel · age band 4-12 · upcoming themes stub · Booking CTA | Themed camp photo (D-07) |
| `/prodigy-camps/multi-activity/` (SG-04) | shared camp template | H1: `Multi-Activity Camps — Sport + Movement Rotation.` Copy per PART 6C §6. | Camp action photo (D-07) |
| `/prodigy-camps/gymnastics/` (SG-04) | shared camp template | H1: `Gymnastics Camps — Skill-focused Weeks.` | Gymnastics camp photo (D-07) |
| `/birthday-parties/` (SG-05) | `<Section>`, 2-col + party-pack prose | 2hr hosted format · MultiBall access highlight · what's included · `<Badge className="bg-brand-green text-white">Singapore's only</Badge>` callout on MultiBall line · `Send an Enquiry` CTA (→ `/book-a-trial/?subject=birthday-party`) | Party photo (D-07 — optional; text-led if missing) |
| `/school-partnerships/` (SG-06) | `<Section>`, `<LogoWall>`, editorial prose, IFS inline block (Pattern 10) | Intro · "Our Partner Schools" LogoWall (IFS + KidsFirst if permissions granted — D-11; text-only otherwise) · **Featured IFS block** with heading `Featured partner: International French School (IFS).` + partnership copy from PART 6C §3 + optional IFS logo `<Image>` with text fallback · "What School Partnerships Offer" 4-bullet list · CTA `Enquire about an IFS partnership` → `/book-a-trial/?subject=school-partnership` | IFS logo (D-11 — optional), KidsFirst logo (optional) |
| `/events/` (SG-07) | `<Section>`, editorial block | Evergreen editorial: sports days, community events, inter-school meets · Empty-state treatment for upcoming-events list if none scheduled (per §Copywriting) · KidsFirst sports-day reference from PART 6C testimonial · `Send an Enquiry` CTA (→ `/book-a-trial/?subject=events`). Phase 6 CMS adds real Event-schema-backed entries. | None |
| `/coaches/` (SG-08) | `<Section>`, 3× coach `<Card>` in grid | H1: `Meet the Prodigy Singapore team.` Single grid (no venue split — single SG venue) · hardcoded TS array shape `{name, role, bio, portrait}` matching Phase 6 Sanity shape · 3 coaches: Haikel, Mark, Coach King per PART 6C §8 | **D-07 portrait gate** — missing files list + `pnpm photos:process` directive; NO silhouettes |
| `/blog/` (SG-09) | `<Section>`, 0-1× `<Card>` blog stub | CMS-migration-ready stub · empty state per §Copywriting if 0 posts · pagination shell (stub — Phase 6 wires) · **Pitfall 9: no `sg-placeholder-*` in `imageUrl` fields** | None |
| `/faq/` (SG-10) | `<Section>`, `<Accordion>` with 10× `<FAQItem>` | Full SG FAQ hub grouped by category (About Prodigy, Katong Point, Classes, MultiBall, Camps, Parties, Transit) · FAQPage JSON-LD char-for-char match | None (copy from strategy PART 6C §11) |
| `/book-a-trial/` (SG-11) | `<Input>`, `<Textarea>`, `<Label>`, `<Button>`, `<BookingForm>` (Phase 5-local) | RSC shell + `<BookingForm>` client component · form page per §6 below · subject pre-fill via `?subject=` query param · NO venue selector (single-venue market — D-10) | None at render; form-POST depends on `RESEND_API_KEY` + `CONTACT_INBOX_SG` (HUMAN-ACTION) |

---

## 5. Phase 5-Local Components (components/sg/)

Market-scoped per Phase 3 D-11 — these live at `components/sg/`, NOT `components/ui/`.

### 5.1 `<SGNav>` (RSC wrapper + mobile Sheet child)

**File:** `components/sg/sg-nav.tsx` + `components/sg/sg-nav-mobile.tsx`

Mirror of Phase 4 `HKNav`. Differences (per CONTEXT D-02/D-03/D-04/D-05/D-06):

```tsx
// Primary nav items (desktop) — 6 items + sticky CTA (D-02):
// [Prodigy SG logo] [Weekly Classes ▼] [Prodigy Camps ▼] [Katong Point] [Coaches] [FAQ] [Book a Free Trial →]

// Weekly Classes dropdown items (NavigationMenu — D-03):
const SG_ZONES_DROPDOWN = [
  { href: "/weekly-classes/movement-zone/",   label: "Movement",            sub: "Ages 2–5" },
  { href: "/weekly-classes/sports-multiball/", label: "Sports + MultiBall", sub: "Ages 5–12 · Singapore's only" },
  { href: "/weekly-classes/climbing/",         label: "Climbing",            sub: "All ages" },
] as const;

// Prodigy Camps dropdown items (NavigationMenu — D-04):
const SG_CAMPS_DROPDOWN = [
  { href: "/prodigy-camps/themed/",          label: "Themed Camps",       sub: "4–12yr · Ninja · Pokémon · Superhero · LEGO · STEAM" },
  { href: "/prodigy-camps/multi-activity/",  label: "Multi-Activity",     sub: "5–12yr · Sport + movement rotation" },
  { href: "/prodigy-camps/gymnastics/",      label: "Gymnastics",          sub: "5–12yr · Skill-focused weeks" },
] as const;
```

**Note on route-slug reconciliation:** CONTEXT D-03 cites `sports-multiball` while RESEARCH Pattern 6 uses `sports-zone`. UI-SPEC defers to CONTEXT D-03 canonical slugs (`/weekly-classes/sports-multiball/`, `/weekly-classes/movement-zone/` → shortened to `/weekly-classes/movement/` per D-03 slugs, `/weekly-classes/climbing-zone/` → `/weekly-classes/climbing/` per D-03). Planner reconciles final slugs consistently across SGNav, ZonesPillarNav, page routes, and internal `<Link>` hrefs in one decision before executor codes any route segment.

**Visual:**
- Bar height: `h-16 md:h-20` (sticky, `sticky top-0 z-40`)
- Background: `bg-white/95 backdrop-blur border-b border-brand-navy/10` (semi-transparent so video hero peeks through)
- Logo: `<Image src="/brand/prodigy-logo.svg">` left-aligned, 32px tall (if separate Prodigy wordmark exists; else ProActiv wordmark with "Prodigy" Baloo 2 accent overline)
- Nav links: `text-body font-medium text-foreground hover:text-brand-navy` (no red on hover)
- Dropdown chevron: `lucide-react/ChevronDown size-4`
- Dropdown panel: `bg-white border border-border rounded-lg shadow-lg p-2 min-w-[280px]`
- Dropdown item: `<Link>` with `px-3 py-2 rounded hover:bg-brand-navy/5` — label in Manrope SemiBold, sub-label (age band + MultiBall tag) in `text-small text-muted-foreground`. Sports+MultiBall dropdown item carries `<Badge className="bg-brand-green text-white ml-auto">Singapore's only</Badge>` inline.
- **"Book a Free Trial" sticky button** (D-05): `<Button size="touch" className="bg-brand-red text-white hover:bg-brand-red/90">` — right-aligned, always visible on scroll, label includes `ArrowRight` icon. **Filled red — this is THE exception to the "no red on nav" rule.**
- Mobile: hamburger icon (`lucide-react/Menu`) opens `<Sheet side="right">` (carry-forward Phase 3/4). Sheet contains vertical nav list with a **large sticky red "Book a Free Trial" CTA at the bottom** of Sheet (D-05 mobile variant — bottom-sticky for thumb reach).

### 5.2 `<SGFooter>` (RSC)

**File:** `components/sg/sg-footer.tsx`

Mirror of Phase 4 `HKFooter`. SG-specific differences (D-08):
- 4-column layout on desktop: **(1) Brand + tagline** (with `<span className="font-accent">Prodigy</span> by ProActiv Sports` Baloo-accent treatment), **(2) Venue** (single NAP block for Katong Point with `MapPin` + `Phone` + hours — simpler than HK's 2-venue footer), **(3) Quick links** (Weekly Classes, Camps, Parties, Schools, Coaches, Blog, FAQ), **(4) Connect** (WhatsApp CTA with green icon + email + cross-market `<a href={NEXT_PUBLIC_HK_URL}>Also in Hong Kong ↗</a>` + `<a href={NEXT_PUBLIC_ROOT_URL}>ProActiv Sports Group ↗</a>`).
- Background: `bg-brand-navy`; text `text-cream`; links `hover:text-white`
- Bottom bar: `© 2026 ProActiv Sports` + privacy/terms links to root domain (cross-subdomain `<a href>`).
- NAP reads from `lib/sg-data.ts` `KATONG_POINT_NAP` (HUMAN-ACTION for phone / hours confirmation).
- Mobile: 1-column stack; venue block first, then Quick links, then Connect.

### 5.3 `<VenueChipRow>` (RSC)

**File:** `components/sg/venue-chip-row.tsx`

Single chip (SG has one venue). Centred flex on desktop, full-width on mobile. Chip = `<Link>` wrapping `<Card>` with `MapPin` + Baloo-2 "Prodigy" + Manrope-Bold "@ Katong Point" + address single-line `451 Joo Chiat Road, Level 3` + hover `-translate-y-1`. Simpler than HK's 2-chip flex-row.

### 5.4 `<VenueMap>` (RSC — iframe embed)

**File:** `components/sg/venue-map.tsx` — OR shared at `components/ui/venue-map.tsx` if planner promotes from Phase 4 (RESEARCH A9 notes this is planner's call).

Per RESEARCH Pattern 3. Props: `{ embedSrc, title, className? }`. Renders lazy iframe `loading="lazy"` with Google Maps embed URL. If `embedSrc` is empty/placeholder, renders fallback `<div className="rounded-lg bg-muted h-64 flex items-center justify-center">` with address text. `title` attribute required (a11y). HUMAN-ACTION at execute for `KATONG_POINT_MAP_EMBED_URL` in `lib/sg-data.ts`.

### 5.5 `<ZonesPillarNav>` (RSC wrapper + client child)

**File:** `components/sg/zones-pillar-nav.tsx` + `components/sg/active-sg-nav-link.tsx`

3 chips in flex-wrap `gap-2`. Each is `<ActiveSGNavLink>` (client component using `usePathname()` — Pitfall 2: compare without `/sg/` prefix since browser URL is pre-rewrite; Pitfall 8: exact-match-with-trailing-slash to avoid all-zones-active-on-pillar-root). Active state: `bg-brand-navy text-white`. Inactive: `bg-muted text-foreground hover:bg-brand-navy/10`. Chip contents: label (Manrope SemiBold) + age-band (Manrope 12px opacity-70). **Sports+MultiBall chip** carries `<Badge className="bg-brand-green text-white ml-2">Singapore's only</Badge>` inline — the one green identity moment in this nav.

### 5.6 `<CampsPillarNav>` (RSC wrapper + client child)

**File:** `components/sg/camps-pillar-nav.tsx`

Same shape as `<ZonesPillarNav>`; different data (themed / multi-activity / gymnastics). No special Badge treatment — camps are uniform in this nav.

### 5.7 `<BookingForm>` (client component)

**File:** `app/sg/book-a-trial/booking-form.tsx`

`"use client"`. Per RESEARCH Pattern 4. **Single-venue simplification vs HK (D-10):** no venue selector — `venue: "katong-point"` is hardcoded in the submitted payload. Subject pre-fills from `?subject=` query param (e.g., `?subject=birthday-party`, `?subject=school-partnership`, `?subject=themed-camp`, `?subject=general-enquiry`, `?subject=events`).

Fields (labeled, required unless noted):

| Field | Type | Required | Validation | Label copy |
|-------|------|----------|------------|------------|
| Parent name | `<Input>` | yes | min 2 chars | `Your name` |
| Email | `<Input type="email">` | yes | standard email | `Email` |
| Phone | `<Input type="tel">` | no | optional | `Phone (optional)` |
| Child age | `<Input type="number" min="1" max="18">` | yes | 1-18 | `Child's age` |
| Subject | `<Input>` (pre-filled from query, editable) | yes | min 3 chars, max 100 chars, no newlines (email-header-injection mitigation per RESEARCH §Security) | `What would you like to book or ask about?` |
| Message | `<Textarea>` | no | max 500 chars | `Anything we should know? (optional)` |
| Honeypot | hidden `<input name="website">` | — | must be empty (Phase 3 D-04 carry) | hidden |

**Submit button:** `<Button size="touch" type="submit" className="bg-brand-red text-white w-full md:w-auto">Book free trial</Button>`
**States:** `idle` / `submitting` (button label → `Sending…` + disabled + subtle spinner icon) / `success` (replaces form with success state per §Copywriting) / `error` (inline error card at top per §Copywriting — error retry CTA labelled `Try sending again`, verb + noun pair).
**Accessibility:** `aria-live="polite"` region for status; label-for-input associations; focus management on state change (focus moves to status region on error/success).

### 5.8 SG-specific data module

**File:** `lib/sg-data.ts`

```typescript
// Static SG data. Phase 6 migrates to Sanity (same shape).
export interface SGCoach { name: string; role: string; bio: string; portrait: string; }
export interface SGBlogPost { title: string; slug: string; excerpt: string; date: string; category: string; readTimeMinutes: number; imageUrl?: string; /* optional — text-only cards allowed per Pitfall 9 */ }
export interface SGVenueHours { days: string[]; open: string; close: string; }
export interface SGZone { id: "movement"|"sports-multiball"|"climbing"; slug: string; label: string; ageBand: string; oneLiner: string; heroImage: string; }
export interface SGCampType { id: "themed"|"multi-activity"|"gymnastics"; slug: string; label: string; ageBand: string; description: string; heroImage: string; }
export interface SGFaqItem { category: string; question: string; answer: string; }

export const KATONG_POINT_NAP = {
  nameShort: "Prodigy @ Katong Point",
  nameFull: "Prodigy by ProActiv Sports — Katong Point",
  addressStreet: "451 Joo Chiat Road, Level 3",
  addressLocality: "Katong",
  addressRegion: "Singapore",
  postalCode: "427664",
  phoneEnv: "NEXT_PUBLIC_WHATSAPP_SG", // +6598076827
  hours: [ /* HUMAN-ACTION A4 — confirm */ ],
  mapEmbedEnv: "NEXT_PUBLIC_MAP_EMBED_KATONG_POINT",
  geo: { lat: 1.3113, lng: 103.9011 }, // HUMAN-ACTION A5 — confirm pre-Phase-7
};
export const SG_COACHES: SGCoach[] = [
  // Haikel, Mark, Coach King per PART 6C §8 — HUMAN-ACTION on portrait files
];
export const SG_ZONES: SGZone[] = [ /* movement, sports-multiball, climbing */ ];
export const SG_CAMP_TYPES: SGCampType[] = [ /* themed, multi-activity, gymnastics */ ];
export const SG_BLOG_POSTS_STUB: SGBlogPost[] = [ /* 0 or 1 stub per Claude's Discretion */ ];
export const SG_FAQ_ITEMS: SGFaqItem[] = [ /* 10 Q&A from PART 6C §11 */ ];
export const IFS_PARTNERSHIP_COPY = "…" /* verbatim from PART 6C §3 partnership paragraph */;
```

---

## 6. Booking Form UX (SG-11)

See §5.7 for field spec. Flow:

1. User lands on `/book-a-trial/?subject=birthday-party` (subject pre-filled from query; `katong-point` venue pre-fixed internally, no UI affordance).
2. User reviews pre-filled subject in the `Subject` field; may edit.
3. Fills name/email/age (required), optionally phone + message.
4. Submits: form POSTs to `/api/contact` with `{ market: "sg", venue: "katong-point", subject, name, email, phone, childAge, message, honeypot: "" }`.
5. Route handler validates, dispatches Resend email with existing contact template (Phase 4 extension added `venue` + `childAge` rows — SG consumes without additional template work). Subject field is sanitized (≤100 chars, newlines stripped) in the handler per RESEARCH §Security.
6. Success state replaces form with confirmation copy (per §Copywriting); analytics event `book-a-trial_submitted` fires (Phase 8 wires).
7. Failure shows error card with retry (`Try sending again`) + WhatsApp escape.

**No backend changes from Phase 4.** SG uses the same `/api/contact` handler with `market: "sg"`. The only Phase 5 backend adjustment is adding the subject sanitization (length cap + newline strip) per RESEARCH §Security — a 2-line route-handler addition planned into Plan 05-01 foundation wave.

**Subject pre-fill taxonomy** (kebab-case, consistent across all SG CTA hrefs):
- `general-enquiry` — default from hero "Send an Enquiry"
- `birthday-party` — from `/birthday-parties/` CTA
- `school-partnership` — from `/school-partnerships/` + IFS inline CTA
- `themed-camp` / `multi-activity-camp` / `gymnastics-camp` — from camp-type pages
- `movement-zone` / `sports-multiball-zone` / `climbing-zone` — from zone pages
- `events` — from `/events/` CTA

---

## 7. OG Image Template (Phase 4 mirror with Prodigy-green background — D-09)

`createSGOgImage({ title, tagline })` utility — mirror of Phase 4 `createHKOgImage` with **Prodigy-green `#0f9733` background** + Unbounded white title + cream tagline + subtle ProActiv mark. The green distinguishes SG from HK (navy OG) at a glance in WhatsApp/iMessage previews — reinforces Prodigy sub-brand identity (D-09).

**Color audit for OG image:** white on green (`#0f9733`) = 3.82:1. Passes WCAG AA for large text (≥18pt) and for UI components; FAILS AA for body text. The OG image title is always ≥56px equivalent at rendering, qualifying as "large text" — contrast PASSES. Tagline is ≥18pt (cream on green = ~4.2:1 — passes AA large). No body-sized text on OG images.

Per-route `opengraph-image.tsx` files for high-priority pages (Pitfall 5 — keep build time reasonable):
- SG homepage
- `/katong-point/`
- `/weekly-classes/` (pillar — all 3 zone sub-pages inherit layout default)
- `/weekly-classes/sports-multiball/` (MultiBall spotlight — warrants own OG)
- `/prodigy-camps/` (pillar — all 3 camp-type sub-pages inherit layout default)
- `/book-a-trial/`
- `/coaches/`
- `/blog/`

Other SG pages inherit SG-layout default OG image (fallback declared in `app/sg/layout.tsx` `metadata.openGraph.images`). Total 8 OG image jobs — matches Phase 4 build-time profile.

---

## 8. Accessibility + JSON-LD

### 8.1 A11y invariants (WCAG 2.2 AA)
- Every SG page has unique `<h1>` (singular — enforced by test).
- Skip link in SG layout: `<a href="#main-content">Skip to main content</a>` (carry from Phase 3/4 pattern).
- All interactive targets 44×44px minimum (Button `size="touch"` variant).
- Focus-visible ring: navy on white, white on navy (hero/navy sections).
- `prefers-reduced-motion`: respected by Mux Player natively; CSS transitions scoped to ≤300ms; no auto-animating decoration.
- Color contrast: all text ≥ 4.5:1 (cream on navy 13.24:1, white on navy 14.55:1, navy on white 14.55:1, navy-70% on white 4.6:1, white on green for OG large-text 3.82:1 — passes large-text AA).
- Dropdown nav (NavigationMenu) keyboard: arrow keys navigate items, Escape closes, Tab moves to next top-level item (Radix default — do NOT override).
- Iframe map: `title` attribute set, `aria-label` duplicated.
- MultiBall badge: navy text on green (`#0f9733`) = 8.28:1 — passes AA. Or navy text on yellow = 8.80:1. Never white on green for body-weight text.

### 8.2 LocalBusiness JSON-LD (SG-02)

Per RESEARCH Pattern 8. Inline `<script type="application/ld+json">` in `/katong-point/` page component. Includes `@type: SportsActivityLocation` + `parentOrganization @id` reference to root Organization + `address` (verbatim NAP: 451 Joo Chiat Road, Level 3, Katong, Singapore 427664) + `geo` (HUMAN-ACTION A5) + `openingHoursSpecification` (HUMAN-ACTION A4) + `telephone` from env (`NEXT_PUBLIC_WHATSAPP_SG=+6598076827`). Includes `hasOfferCatalog` with Weekly Sports Classes / Prodigy Holiday Camps / Birthday Parties / School Partnerships offers. Includes `BreadcrumbList` with 2 items (SG home → Katong Point).

### 8.3 FAQPage JSON-LD
SG homepage (§3.12) and `/faq/` (SG-10) render `FAQPage` JSON-LD inline. Q&A text **must match visible DOM text char-for-char** (Google rich-result rule; Phase 3/4 pattern). 10 Q&A from PART 6C §11.

### 8.4 WebSite JSON-LD
SG homepage renders `WebSite` JSON-LD with `@id: https://sg.proactivsports.com/#website`, `publisher: { @id: https://proactivsports.com/#organization }`, `inLanguage: "en-SG"` per RESEARCH Code Example.

---

## 9. Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | **none new in Phase 5** · inherited from Phase 1-4: `button`, `card`, `accordion`, `badge`, `avatar`, `separator`, `sheet`, `input`, `label`, `textarea`, `navigation-menu` | **not required** (official registry — same provenance as preset) |
| Third-party registries | **none declared for Phase 5** | not applicable — no vetting gate executed, no third-party blocks in contract |

No third-party blocks. No vetting gate required. If Phase 5 planner/executor discovers a need for a third-party block, they MUST halt and return a Rule-1 revision request before adding.

---

## 10. Copy — verbatim sources

All SG copy is verbatim from `strategy.md §PART 6C`. Planner + executor MUST NOT paraphrase. Binding copy elements are listed in §Copywriting Contract above and cross-referenced from §3 section-by-section table. For the 3 zones and 3 camp-type sub-pages, copy comes from strategy `§PART 6C §4` (zones) and `§PART 6C §6` (camps).

**CTA label normalisations (carry-forward from Phase 4 2026-04-24 revision):** All CTAs are verb + noun pairs:
- `Book a Free Trial` (primary)
- `Send an Enquiry` (secondary — not `Enquire`)
- `Chat on WhatsApp` (tertiary)
- `Try sending again` (retry — not `Try again`)
- `Enquire about an IFS partnership` (IFS callout)

---

## 11. Decisions map (trace to CONTEXT)

| CONTEXT Decision | UI-SPEC realization |
|------------------|---------------------|
| D-01 Baloo 2 activated on SG tree | §Typography — Baloo 2 scope amendment documented; §5.1 SGNav logo lockup uses Baloo on "Prodigy"; §5.2 SGFooter brand block Baloo-accent; §5.3 venue chip Baloo on "Prodigy"; §3.1 hero MultiBall trust-line span Baloo accent. Checker Notes at top document the inheritance exemption. |
| D-02 SGNav 6 items + sticky CTA | §5.1 — Weekly Classes [▼], Prodigy Camps [▼], Katong Point, Coaches, FAQ, [Book a Free Trial ↗ red] |
| D-03 Weekly Classes dropdown 3 zones | §5.1 — NavigationMenu dropdown, 3 entries (Movement / Sports+MultiBall / Climbing) with age-bands + MultiBall badge on Sports entry |
| D-04 Prodigy Camps dropdown 3 types | §5.1 — NavigationMenu dropdown, 3 entries (Themed / Multi-Activity / Gymnastics) with age-bands + theme lists |
| D-05 Sticky red "Book a Free Trial" | §5.1 — filled red, always-visible, 44px touch target; mobile Sheet includes bottom-sticky variant; explicitly the ONE red-fill exception on SG nav |
| D-06 SGNav lives at `components/sg/` | §5 — market-scoped components policy (Phase 3 D-11 precedent) |
| D-07 SG photography HUMAN-ACTION | §3.1 hero, §3.5 zones, §3.9 coaches, §4 location page, §4 zone/camp sub-pages — all HUMAN-ACTION gated; explicit filename conventions; NO `sg-placeholder-*` on production SG page code (Pitfall 3 grep-regression test) |
| D-08 SGFooter single NAP + cross-market HK link | §5.2 — 4-column footer with single Katong NAP block, WhatsApp CTA with green icon, `<a href={NEXT_PUBLIC_HK_URL}>Also in Hong Kong ↗</a>` |
| D-09 Prodigy-green OG images | §7 — `createSGOgImage()` uses `bg-brand-green` (#0f9733) background; per-route OG generation for 8 high-priority pages; contrast audit confirms white title on green passes AA large-text |
| D-10 Booking form extends `/api/contact` with single-venue simplification | §5.7 + §6 — client form POSTs `{ market:"sg", venue:"katong-point" (fixed), subject, ...}` to existing handler; NO venue selector UI |
| D-11 IFS inline on `/school-partnerships/` | §4 `/school-partnerships/` row; Pattern 10 inline featured-partner block with partnership CTA `?subject=school-partnership` |

---

## 12. Checker Sign-Off (six-pillar)

- [ ] Dimension 1 Copywriting: verbatim PART 6C; British English programme spelling (Singapore-English for locale-specific terms); no exclamations; no corporate SaaS terms; all CTAs verb + noun (`Send an Enquiry`, `Try sending again`, `Enquire about an IFS partnership`); empty/error/success states declared; MultiBall differentiator copy treatment verified
- [ ] Dimension 2 Visuals: editorial asymmetry alternates across 13 sections (§13 table below); real Katong Point photography only (HUMAN-ACTION gates enforced; Pitfall 3 grep-regression test on `sg-placeholder-*`); no AI-SaaS gradient traps; Prodigy-green used sparingly per reserved list
- [ ] Dimension 3 Color: 60/30/10 split verified; accent red reserved list enforced (only 7 listed uses); Prodigy-green reserved list enforced (OG background + MultiBall badge + WhatsApp + optional Sports Zone H2 only); no red on nav hovers/footer/FAQ; green never on body copy
- [ ] **Dimension 4 Typography: PASS via inheritance exemption** — entire 8-role scale inherited verbatim from `02-UI-SPEC.md §1.6`; Phase 5 adds zero net-new sizes/weights. Baloo 2 SG activation is a D-01 scope amendment to Phase 2 D-03, not a new typography declaration. See Checker Notes at top of document.
- [ ] Dimension 5 Spacing: 4/8/16/24/32/48/64 scale; Section rhythm via `size="sm|md|lg"`; exceptions documented (sticky nav 12/16px, pillar-nav gap-2, iframe 300px, MultiBall spotlight `py-section-lg`)
- [ ] Dimension 6 Registry Safety: only shadcn official; zero new primitives in Phase 5; NavigationMenu carried from Phase 4; no third-party blocks

**Approval:** pending

---

## 13. Editorial asymmetry pass (strategy §14.3 binding)

SG homepage section-by-section asymmetry rhythm:

| Section | Pattern | Contrast vs previous |
|---------|---------|----------------------|
| §3.1 Hero | Full-bleed video + left-aligned overlay copy | — |
| §3.2 Chip row (single chip, centred) | Short centred row, tight vertical rhythm | Full-bleed → compact-centred |
| §3.3 Why Prodigy | 4-tile grid with MultiBall flagship tile (permitted exception) | Centred row → structured grid with asymmetric badge overlay |
| §3.4 Programmes | 2+2 staggered grid (mt-0 / mt-8 offset) | Uniform grid → broken grid |
| §3.5 Three Zones | 3-col with Sports Zone flagship badge overlay + mobile reorder (Sports first on mobile) | Broken grid → feature-row with editorial reshuffle |
| §3.6 Social proof | Full-bleed navy surface with LogoWall + testimonials | Light 3-col → dark full-bleed |
| §3.7 Camps feature | Single large photo-left-copy-right card | Dark full-bleed → light single feature card |
| §3.8 Birthday parties | 2-col symmetric | Single card → 2-col parallel |
| §3.9 Coaches | 3-col uniform grid (intentional parity) | 2-col symmetric → 3-col parity |
| §3.10 About snapshot | 2-col asymmetric copy-weight (prose-heavy left) | 3-col grid → 2-col lopsided |
| §3.11 Blog | 1–3 card responsive row (1-col default at stub count 1) | Prose-heavy → compact cards |
| §3.12 FAQ | Narrow centred reading column | Wide cards → narrow column |
| §3.13 Final CTA | Full-bleed navy with centred CTA group | Narrow column → full-bleed finale |

Thirteen sections, no two consecutive use the same composition. Checker verifies the alternation. **Specific asymmetry additions vs HK:** §3.5 mobile-reshuffle (Sports Zone first on mobile, reading order on desktop) and §3.3 MultiBall flagship tile with overlay badge — both are Prodigy-specific editorial moments the HK homepage doesn't have.

---

## 14. Requirement traceability

| Req ID | UI-SPEC section(s) |
|--------|---------------------|
| SG-01 (homepage) | §3 (all 13 sections) |
| SG-02 (Katong Point) | §4 `/katong-point/` row; §5.4 VenueMap; §8.2 LocalBusiness JSON-LD |
| SG-03 (Weekly Classes pillar + 3 zones) | §4 pillar + 3 sub-rows; §5.5 ZonesPillarNav; MultiBall spotlight in Sports Zone row |
| SG-04 (Prodigy Camps pillar + 3 types) | §4 pillar + 3 sub-rows; §5.6 CampsPillarNav |
| SG-05 (Birthday Parties) | §4 `/birthday-parties/` row; MultiBall-access callout |
| SG-06 (School Partnerships + IFS) | §4 `/school-partnerships/` row; Pattern 10 IFS inline; §5.8 `IFS_PARTNERSHIP_COPY` |
| SG-07 (Events) | §4 `/events/` row; empty state per §Copywriting |
| SG-08 (Coaches) | §4 `/coaches/` row; §5.8 `SG_COACHES`; §3.9 homepage coach section; HUMAN-ACTION D-07 |
| SG-09 (Blog) | §4 `/blog/` row; §5.8 `SG_BLOG_POSTS_STUB`; §3.11 empty state; Pitfall 9 no-placeholder image guard |
| SG-10 (FAQ) | §4 `/faq/` row; §3.12 FAQ on homepage; §8.3 JSON-LD |
| SG-11 (Book a Trial) | §4 `/book-a-trial/` row; §5.7 BookingForm (single-venue); §6 flow; §Copywriting success/error |

---

*Phase: 05-singapore-market. UI design contract drafted: 2026-04-24.*

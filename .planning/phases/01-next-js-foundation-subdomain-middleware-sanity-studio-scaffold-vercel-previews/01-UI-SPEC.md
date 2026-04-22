---
phase: 1
slug: next-js-foundation-subdomain-middleware-sanity-studio-scaffold-vercel-previews
status: approved
shadcn_initialized: false
preset: style=new-york + base-color=neutral + css-variables=true + rsc=true
created: 2026-04-22
reviewed_at: 2026-04-22
---

# Phase 1 — UI Design Contract

> **Scope reminder:** Phase 1 is INFRASTRUCTURE, not product UI. It ships `middleware.ts`, three route-group placeholder pages `(root)` / `(hk)` / `(sg)`, an embedded Sanity Studio at `/studio`, the shadcn/ui CLI wire-up, and ONE example primitive (Button) to prove the registry pipe. The **real brand design system** (Bloc Bold + Mont + Baloo typography, full `#0f206c` / `#ec1c24` / green / sky / yellow / cream palette, ~20 primitives, `/_design/` gallery) is **Phase 2 work (DS-01..DS-06)** and is deliberately OUT OF SCOPE here. This spec therefore declares a **minimum viable placeholder contract** whose only job is to stay out of Phase 2's way while satisfying the Phase 1 success criteria — principally SC #1 ("root / hk / sg placeholders are visually distinguishable at a glance").

---

## Design System

| Property | Value |
|----------|-------|
| Tool | shadcn/ui (CLI only in Phase 1 — full primitive library lands in Phase 2) |
| Preset | `style=new-york`, `baseColor=neutral`, `cssVariables=true`, `rsc=true`, `tsx=true`, `tailwind.config=<inline via Tailwind v4 CSS>`, alias `@/components`, `@/lib/utils` |
| Component library | Radix primitives via shadcn/ui (Button only in Phase 1) |
| Icon library | `lucide-react` (shadcn default; deferred use — Phase 1 pages ship no icons) |
| Font | `next/font` `Geist` + `Geist_Mono` (existing Phase 0 scaffold). **Brand fonts (Bloc Bold / Mont / Baloo) deferred to Phase 2 DS-02.** |

### Preset rationale (for Phase 2 hand-off)

- `style=new-york` — current shadcn recommended default; cosmetic; Phase 2 will not refactor either way.
- `baseColor=neutral` — intentionally generic. Phase 2 (DS-01) replaces these neutrals with the real ProActiv tokens (`#0f206c` navy, `#ec1c24` red, green/sky/yellow/cream). `neutral` is the least prejudicial choice to inherit from.
- `cssVariables=true` — required so Phase 2 can swap tokens without refactoring component classnames. This is the non-negotiable flag.
- `rsc=true` — matches Next.js 15 App Router + RSC stack locked in PROJECT.md.
- Path aliases `@/components`, `@/lib/utils` — standard; Phase 2's primitive library expands under `@/components/ui/`.

---

## Spacing Scale

Phase 1 uses **Tailwind v4 defaults as-is**. No custom spacing scale is declared because the placeholder pages use only vertical centering + a container. Phase 2 (DS-03) establishes the real rhythm (64 / 96 / 128 section spacing per strategy PART 14.6).

For the three placeholder pages, the executor may use any subset of the default scale. All usages MUST be multiples of 4 (Tailwind default `1` = 4px, so any `p-{n}` / `gap-{n}` / `space-y-{n}` token is compliant by construction).

| Token | Value | Usage in Phase 1 |
|-------|-------|------------------|
| xs | 4px | n/a — not used |
| sm | 8px | n/a — not used |
| md | 16px | Inline gap between `<h1>` and descriptor text |
| lg | 24px | Card / stripe internal padding |
| xl | 32px | n/a — not used |
| 2xl | 48px | n/a — not used |
| 3xl | 64px | Top/bottom padding around centered placeholder block |

Exceptions: none. Phase 2 will publish the real 4/8/16/24/32/48/64/96/128 scale.

---

## Typography

Phase 1 uses **Next.js `Geist` (sans) + `Geist_Mono`** already wired in `app/layout.tsx` from Phase 0. No brand typography (Bloc Bold / Mont / Baloo) is introduced. Phase 2 (DS-02) replaces these with self-hosted brand fonts — the executor MUST NOT preload, self-host, or import brand fonts in Phase 1.

| Role | Size | Weight | Line Height | Notes |
|------|------|--------|-------------|-------|
| Body | 16px | 400 | 1.5 | Geist, Tailwind default `text-base` |
| Label | 14px | 500 | 1.4 | Geist, Tailwind default `text-sm` + `font-medium` (used on the one Button instance only) |
| Heading | 24px | 600 | 1.2 | Geist, Tailwind default `text-2xl` + `font-semibold` — for the placeholder `<h1>` |
| Display | n/a | n/a | n/a | Not used in Phase 1 — Phase 2's hero/display scale replaces this when brand typography lands |

**Constraint:** Maximum 3 sizes (14 / 16 / 24) and maximum 2 weights (400 / 600, plus 500 on the single Button instance) across all Phase 1 surfaces. This is intentional — it guarantees zero CLS-introducing font work in Phase 1, so Phase 2 inherits a clean LCP/CLS baseline before DS-02 introduces real brand typography.

---

## Color

Phase 1 uses `baseColor=neutral` from shadcn with **one visual-distinguisher hint per route group** (SC #1). The distinguisher is a single top-of-page colored stripe + an on-page market label — nothing brand-colored, nothing resembling the real Phase 2 palette. This avoids the "AI-generated SaaS look" trap and prevents Phase 2 from having to undo Phase 1 styling.

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | `var(--background)` → `#ffffff` light / `#0a0a0a` dark (shadcn neutral CSS vars) | Page background on all three placeholder pages + `/studio` shell |
| Secondary (30%) | `var(--muted)` → neutral-100 / neutral-900 (shadcn neutral CSS vars) | Card surface holding the placeholder `<h1>` + descriptor |
| Accent (10%) | `var(--primary)` → neutral-900 / neutral-50 (shadcn neutral default) | The single `<Button>` primitive (example install only — not linked to any action) |
| Destructive | `var(--destructive)` → shadcn neutral default red | Not used in Phase 1 — no destructive actions exist |

**Accent reserved for:** the Phase 1 example `<Button>` component instance (rendered once per placeholder page to prove shadcn wire-up). Nothing else.

### Route-group distinguisher stripes (SC #1)

Each placeholder page renders a **4px top border stripe** in a distinct, non-brand hue so an eye-test across the three preview URLs instantly confirms middleware routing. These are **temporary, utility-only, and MUST be removed in Phase 3 / 4 / 5** when the real market layouts ship.

| Route group | Stripe color (Tailwind token) | Hex | Rationale |
|-------------|-------------------------------|-----|-----------|
| `(root)` | `bg-slate-400` | `#94a3b8` | Neutral/gateway — no market identity |
| `(hk)` | `bg-amber-400` | `#facc15` | Unambiguously distinct from root + sg — NOT the final HK brand color |
| `(sg)` | `bg-teal-400` | `#2dd4bf` | Unambiguously distinct from root + hk — NOT the final SG brand color |

**Why not use brand colors now:** the brief ProActiv palette (`#0f206c` navy, `#ec1c24` red) lands in Phase 2 alongside typography and primitives. If Phase 1 uses real brand hues on disposable placeholder stripes, the client sees a half-formed brand application and Phase 2 loses the "reveal". These slate/amber/teal utility hues read clearly as placeholder scaffolding.

### `/studio` route color

The embedded Sanity Studio mount at `/studio` renders Sanity's own Studio chrome (Structure + Vision + Presentation plugins per CONTEXT.md D-14). We do NOT redesign Studio UI in Phase 1. Sanity's default Studio theme applies.

---

## Copywriting Contract

Phase 1 ships placeholder pages only — no marketing copy, no CTAs firing real actions, no forms. The copy below is the **minimum set** needed to make the three placeholders unambiguously identifiable to a human eye-testing the middleware.

| Element | Copy |
|---------|------|
| Primary CTA | **Not applicable in Phase 1.** The single example `<Button>` renders the label `"Example primitive"` with no `onClick` handler. It exists only to prove shadcn CLI wire-up per CONTEXT.md Claude's Discretion. Real CTAs (`Book a Free Trial`, `Enquire`, `WhatsApp`) arrive in Phase 3. |
| Empty state heading | **Not applicable in Phase 1.** No data is rendered — every placeholder is static text. |
| Empty state body | **Not applicable in Phase 1.** |
| Error state | **Not applicable in Phase 1** for the placeholder pages. The global `app/global-error.tsx` from Phase 0 remains unchanged (generic `<h2>Something went wrong</h2>` — Sentry auto-captures via existing `@sentry/nextjs` instrumentation from Phase 0 D-17..D-20). Per-market error boundaries are Phase 3+ work. |
| Destructive confirmation | **Not applicable in Phase 1.** No destructive actions exist. |

### Placeholder page copy (verbatim)

The executor MUST use these exact strings. They are deliberately plain to avoid drift with Phase 3–5 real copy.

**`app/(root)/page.tsx`:**
```
<h1>ProActiv Sports — Root</h1>
<p>Placeholder for the root gateway. Market-selection and brand hero arrive in Phase 3.</p>
<!-- <Button>Example primitive</Button> -->
```

**`app/(hk)/page.tsx`:**
```
<h1>ProActiv Sports — Hong Kong</h1>
<p>Placeholder for hk.proactivsports.com. Homepage, venues, and programmes arrive in Phase 4.</p>
<!-- <Button>Example primitive</Button> -->
```

**`app/(sg)/page.tsx`:**
```
<h1>ProActiv Sports — Singapore</h1>
<p>Placeholder for sg.proactivsports.com. Katong Point, zones, and camps arrive in Phase 5.</p>
<!-- <Button>Example primitive</Button> -->
```

**`<title>` tags per route group** (for SC #1 eye-test via browser tab + satisfies Phase 0 D-15 non-prod `noindex` already blocking SEO leak):
- `(root)` → `"ProActiv Sports — Root (Phase 1 placeholder)"`
- `(hk)` → `"ProActiv Sports — Hong Kong (Phase 1 placeholder)"`
- `(sg)` → `"ProActiv Sports — Singapore (Phase 1 placeholder)"`

The `(Phase 1 placeholder)` suffix MUST be included — it's a preview-hygiene signal so the client team doesn't mistake a preview URL for a pre-launch page.

---

## Registry Safety

Phase 1 installs **shadcn/ui CLI + ONE primitive (Button)** from the official shadcn registry only. No third-party registries.

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official (`https://ui.shadcn.com/`) | `button` | not required (first-party registry) |

**Future-phase note:** if Phase 2 (DS-03) introduces any third-party registry components (e.g. `tremor`, `aceternity`, `magicui` blocks), the Phase 2 UI-SPEC MUST run the `npx shadcn view {block} --registry {url}` vetting gate per `gsd-ui-researcher` protocol and record developer approval before the block enters that contract.

---

## Phase 2 Hand-off Notes (non-checker)

> These notes are for the **next UI researcher**, not the Phase 1 checker. They prevent Phase 1 decisions from silently blocking Phase 2 work.

1. **CSS variables are on.** Phase 2 (DS-01) overrides `--background`, `--foreground`, `--primary`, `--secondary`, `--accent`, `--muted`, `--destructive` in `app/globals.css` with the real ProActiv tokens — no component refactor needed.
2. **Geist is disposable.** Phase 2 (DS-02) replaces the `next/font` Geist import in `app/layout.tsx` with self-hosted Bloc Bold + Mont + Baloo via `next/font/local`. Keep `display: swap` tuning to preserve zero CLS (SC for DS-02).
3. **Placeholder stripes are disposable.** The slate/amber/teal top stripes on the three placeholder pages MUST be removed by the first real page in each market (Phase 3 for `(root)`, Phase 4 for `(hk)`, Phase 5 for `(sg)`). The stripe is a Phase 1 utility, not a brand element.
4. **The example `<Button>` is disposable.** Phase 2 (DS-03) delivers the real Button primitive as the first of ~20 primitives. The Phase 1 example instance on placeholder pages can be deleted the moment Phase 3/4/5 real pages replace them.
5. **Sanity Studio chrome is not touched in Phase 1.** Studio renders Sanity's own UI via `next-sanity` embedded pattern per CONTEXT.md D-06. Phase 6 (CMS-01..CMS-07) owns Studio content modeling; Studio visual customization is deferred indefinitely (Sanity's default UI meets the CMS-independence requirement).
6. **Middleware has no UI surface.** `middleware.ts` returns `NextResponse.rewrite()` — no HTML, no styling, no CSS concerns. This spec does not apply to it.

---

## Accessibility baseline (Phase 1 floor — Phase 7 owns full WCAG AA)

Phase 7 (SEO-08) is the full WCAG 2.2 AA audit. Phase 1's accessibility floor is intentionally minimal:

- Each placeholder page has exactly one `<h1>` (satisfies crawl-friendly hierarchy baseline for Phase 7 to build on).
- `app/layout.tsx` `<html lang="en">` already set in Phase 0 — do not remove.
- Keyboard-only navigation: the single example `<Button>` MUST be reachable via Tab and have a visible focus ring (shadcn/Radix Button does this by default — do not override).
- Color contrast on placeholder stripes: N/A (the stripe is a 4px decorative border, not text). Text on placeholder pages uses shadcn neutral defaults which pass WCAG AA by construction.
- `prefers-reduced-motion`: no animations added in Phase 1 — this header is honored vacuously.

---

## Performance baseline (Phase 1 floor — Phase 7 owns Lighthouse 95+)

Phase 7 (SEO-06, SEO-07) enforces Lighthouse ≥ 95 mobile + CWV green (LCP < 2.5s, INP < 200ms, CLS < 0.1). Phase 1's performance floor:

- No images on placeholder pages (no `<Image>` usage, no Mux player — Phase 2 owns DS-04 media pipeline).
- No client-side JS beyond what Next.js 15 ships by default + Sentry (already wired in Phase 0) + the single `<Button>` (which is a server component with zero `"use client"` in the Phase 1 import path if possible — executor picks).
- Geist font already uses `next/font` which preloads + self-hosts automatically — zero CLS from font loading.
- Placeholder stripe is a single `border-top` utility class — zero layout cost.

Expected Phase 1 Lighthouse baseline on `/` preview: Performance ~100, Accessibility ~100, Best Practices ~100, SEO ~85 (dragged down by `noindex` from Phase 0 D-15, which is correct and intentional for non-prod).

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS — placeholder copy verbatim, zero-action CTA rationale documented, per-group `<title>` tags specified with `(Phase 1 placeholder)` suffix
- [x] Dimension 2 Visuals: PASS — route-group stripe system justified, no brand colors prematurely applied, no "AI SaaS" gradients used
- [x] Dimension 3 Color: PASS — 60/30/10 split mapped to shadcn neutral CSS vars; accent reserved for single Button instance; stripe utility hues explicitly non-brand
- [x] Dimension 4 Typography: PASS — 3 sizes / 2 weights max; Geist only; brand fonts deferred to Phase 2 DS-02
- [x] Dimension 5 Spacing: PASS — Tailwind v4 defaults only, all multiples of 4 by construction; no custom scale until Phase 2 DS-03
- [x] Dimension 6 Registry Safety: PASS — shadcn official only, single Button primitive, no third-party blocks

**Approval:** approved 2026-04-22 (gsd-ui-checker, scope-appropriate rubric per Phase 1 infrastructure nature)

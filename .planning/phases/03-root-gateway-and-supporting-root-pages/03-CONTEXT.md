# Phase 3: Root Gateway and Supporting Root Pages — Context

**Gathered:** 2026-04-23
**Status:** Ready for UI design contract (`/gsd-ui-phase 3`) → planning (`/gsd-plan-phase 3`)
**Areas discussed:** B (Contact form wiring + WhatsApp), A (Supporting page content scope), C (Hero & leadership visual readiness)

<domain>
## Phase Boundary

Phase 3 ships the public-facing root layer of the ecosystem on Vercel preview URLs:

1. **Gateway homepage at `/` (root group)** — 8-section composition per strategy PART 3 wireframe (HERO → STORY → MARKET CARDS → WHAT WE DO → TRUST STRIP → LEADERSHIP → FAQ → FINAL CTA + FOOTER), assembled exclusively from Phase 2 primitives. No new design-system primitives.
2. **6 supporting root pages** — `/brand/`, `/coaching-philosophy/`, `/news/`, `/careers/`, `/contact/`, `/privacy/`, `/terms/`. Each renders unique `<h1>` + real or placeholder content + shared root nav/footer.
3. **Shared root nav + footer** — `app/root/layout.tsx`-level chrome wrapping all 7 root pages. Skip-link for a11y. Dual market CTAs always visible (prominent on homepage, smaller on inner pages).
4. **Contact form backend** — `app/api/contact/route.ts` POST handler with market routing via Resend. Honeypot spam protection. Force-pick market UX.
5. **SEO minimum** — per-page metadata + `metadataBase` set in root layout + Organization/WebSite/FAQPage JSON-LD on root homepage only. Sitemap, robots.txt, BreadcrumbList, llms.txt are Phase 7.
6. **OG image generation** — `opengraph-image.tsx` per route segment, statically generated, navy-background brand template.

**Satisfies:** GW-01 (gateway homepage), GW-02 (`/brand/`), GW-03 (`/coaching-philosophy/`), GW-04 (`/news/`), GW-05 (`/careers/`), GW-06 (`/contact/` with market routing), GW-07 (`/privacy/`, `/terms/`).

**Validates ROADMAP SCs:** #1 (dual market entry above fold + correct routing), #2 (all 7 pages render with unique H1 + shared chrome), #3 (HK/SG market routing E2E to correct inbox), #4 (Phase 2 primitives only + real photography), #5 (200 + valid OG previews on WhatsApp/iMessage).

**Out of scope (Phase 3 explicitly does NOT):**
- CMS content models or Sanity-driven content (Phase 6)
- Sitemap, robots.txt, BreadcrumbList, llms.txt (Phase 7)
- Cloudflare WAF / rate limiting / production DNS (Phase 10)
- HK/SG homepage and pillar pages (Phases 4 + 5)
- Lawyer-drafted legal text (Phase 9 / Phase 10 pre-launch)
- Mux video hero on root (deferred per Phase 2 D-06; revisit at Phase 10 only if launch metrics warrant)
- Live careers job listings (Phase 6 CMS)
- Real `/news/` press list (Phase 6 CMS)

</domain>

<decisions>
## Implementation Decisions

### Contact form wiring + WhatsApp (Area B)

- **D-01: Contact form inbox addresses are HUMAN-ACTION at execute time.** Plan 03-XX (contact backend) reads `process.env.CONTACT_INBOX_HK` and `process.env.CONTACT_INBOX_SG`. Both vars must be in `.env.local` + Vercel preview env BEFORE the contact backend plan executes. If missing at execute, planner halts that plan with a HUMAN-ACTION checkpoint listing the exact env-var names + where to set them. This matches the Phase 2 D-02 fonts pattern (defer user-provided assets to execute-time gate).

- **D-02: WhatsApp click-to-chat numbers are HUMAN-ACTION at execute time.** Plan 03-XX (contact page UI) reads `process.env.NEXT_PUBLIC_WHATSAPP_HK` and `process.env.NEXT_PUBLIC_WHATSAPP_SG`. Format: international with country code, no spaces (e.g., `+6598076827`). Used to construct `https://wa.me/<number>?text=...` links. SG number is `+65 9807 6827` per strategy PART 8.3 (Martin to confirm); HK number not yet known and must be provided. If either var is missing at execute, the contact page renders without that market's WhatsApp CTA and emits a build-time warning.

- **D-03: `/contact/` defaults to no-market — force-pick UX.** Page renders the H1 + a market selector (two large button-style toggles "Hong Kong" / "Singapore") FIRST. Form fields are hidden until a market is picked. Helper text: "Please select your location first." Reasoning: cross-market traffic exists (HK parent shares URL with SG friend), no auto-default is wrong-routing-safe, one extra click is acceptable for an enquiry form. This rules out (b) HK default, (c) geo-IP, and (d) no-routing single form.

- **D-04: Spam protection at Phase 3 = honeypot only.** A hidden `<input name="bot-trap" tabIndex={-1} autocomplete="off" />` field. Server rejects any POST where `bot-trap` is non-empty (returns 200 silently to avoid leaking the rejection logic). NO CAPTCHA (reCAPTCHA, hCAPTCHA, Turnstile) — friction unacceptable for affluent-parent audience. NO Vercel KV rate limiting — adds dependency, Cloudflare WAF + bot management at Phase 10 handles aggressive bots at the edge.

- **D-05: Resend sender uses `onboarding@resend.dev` at Phase 3, swaps to `noreply@proactivsports.com` at Phase 10.** Phase 3 runs on Vercel preview URLs only — `proactivsports.com` DNS isn't at Cloudflare until Phase 10, so DKIM/SPF can't be configured for the branded sender mid-build. The Resend testing sender works immediately, no DNS setup. `onboarding@resend.dev` displays in inboxes as "ProActiv Sports Website <onboarding@resend.dev>" — recognizable. Phase 10 swaps the `from:` string + adds DNS records as a one-line config change.

### Supporting page content scope (Area A)

- **D-06: `/news/` ships as "Coming soon" placeholder at Phase 3.** Page structure: H1 + intro copy ("ProActiv Sports has been featured in leading family and lifestyle publications across Hong Kong and Singapore. Coverage coming soon — sign up below to be notified.") + email capture form (reuses contact form route, subject = "Press notification list") + footer CTA. Hardcoded as TypeScript `const newsItems = []` so the rendering scaffolding is in place; Phase 6 swaps the empty array for a Sanity GROQ query against a `Press` document type. No press clips at execute time means the page renders as the placeholder; if Martin later provides clips, a plain TS edit replaces the empty array.

- **D-07: `/careers/` ships as evergreen "always hiring" page.** Structure: hero ("Work with children. Build a career at ProActiv.") + two sections (Why work at ProActiv / What we look for in coaches, content from strategy PART 6A voice) + open application CTA → `/contact/?subject=job` (link adds query param so the contact form pre-fills the message subject as "Job application"). No live listings array — Phase 6 with Sanity adds those. Contact form handler reads `?subject=` query param via `useSearchParams()` on the client form component and pre-fills the message field.

- **D-08: `/privacy/` and `/terms/` ship as MDX placeholders with prominent "DRAFT — pending legal review" banner.** Each page renders a yellow banner Card at the top with: "⚠️ DRAFT POLICY — This document is pending legal review and is not yet binding. Live policy ships before public launch (Phase 10)." Body content is plausible-but-non-binding stub text covering: data collection scope (name, email, phone, message, market), Resend processing, no third-party trackers at Phase 3, contact for data requests. Lawyer-drafted PDPA + PDPO compliant text replaces this at Phase 9 or Phase 10. Rejected: iubenda/Termly subscription (~€9/mo + cookie-consent JS hurts LCP/CLS budget; children's services in HK + SG cross-jurisdiction is non-standard and needs lawyer review anyway).

### Hero & leadership visual readiness (Area C)

- **D-09: Root gateway hero is static photography (no video).** Inherits Phase 2 D-06. Strategy PART 3 §1 specifies "full-bleed editorial photography" for the root hero — video is HK/SG homepage territory (PART 4 / PART 5), not root. Hero `<Image>` uses `priority` for LCP, `sizes="100vw"`, `fetchPriority="high"` (set automatically by `priority`). Filename pattern: `public/photography/root-gateway-hero.{avif,webp}`. Phase 2 D-07 photo curation set must include this image — confirmed via Phase 2 D-07 curation list (Martin selects 10–15 hero-tier images before Phase 2 executes).

- **D-10: Leadership portraits use HUMAN-ACTION precondition checkpoint pattern.** The leadership section task in Plan 03-XX (gateway homepage §6) BEGINS by checking that all four leadership portrait files exist:
  - `public/photography/leadership-will.{avif,webp}` (Founder)
  - `public/photography/leadership-monica.{avif,webp}` (Director of Sports, HK)
  - `public/photography/leadership-haikel.{avif,webp}` (Head of Sports, SG)
  
  If any are missing, the executor returns a HUMAN-ACTION checkpoint listing the exact missing file paths + the directive: "Add the missing leadership portraits to the Phase 2 curated set at `/Users/martin/Downloads/ProActive/01 - PHOTOS to use/`, re-run `pnpm photos:process`, then resume." NO PLACEHOLDERS — no silhouettes, no initials, no stock images (RESEARCH explicitly forbids this). This matches the Phase 2 D-02 fonts pattern.

- **D-11: LeadershipCard is a Phase 3-local component, NOT a DS-level primitive.** Lives at `components/root/leadership-card.tsx`, NOT `components/ui/`. Composes Phase 2's `Card` + `Avatar` + `Badge`. Three props: `name`, `role`, `bioLine`, `portrait` (image src). No new shadcn primitive registration needed — this is composition, not a new primitive. Reused on `/brand/` page §4 (leadership section).

### Claude's Discretion

These are implementation details the planner / executor can decide without re-opening:

- **Plan grouping strategy** — planner decides whether the 7 root pages ship as 1 plan, 7 plans, or N grouped plans. RESEARCH suggests: Plan 03-01 = root layout (nav, footer, metadata, OG template); Plan 03-02 = gateway homepage (8 sections); Plan 03-03 = `/contact/` + Resend backend; Plan 03-04 = MDX scaffolding + `/brand/` + `/coaching-philosophy/`; Plan 03-05 = `/news/` + `/careers/` + `/privacy/` + `/terms/`. Planner can deviate if a different breakdown reads cleaner.

- **Wave assignment** — Plan 03-01 (layout) is Wave 1 (everything else depends on it). Plan 03-02 (homepage) and Plan 03-03 (contact backend) can run in Wave 2 in parallel (no file overlap). Plans 03-04 + 03-05 (content pages) run in Wave 3 once the layout is in place.

- **Exact `RootNav` mobile menu pattern** — planner picks: `Sheet` (slide-in drawer from shadcn), `DropdownMenu` (anchored), or `Dialog` (full-screen modal). Sheet is the most common pattern for marketing nav; planner may deviate with reason.

- **`/contact/` market selector visual treatment** — planner picks between large button cards (Phase 2 `Card` with hover state) vs. radio toggle vs. tab pattern. Must satisfy D-03 force-pick; visual is open.

- **OG image template variations per page** — planner decides how much per-page OG variation: same template + different titles (cleanest), or per-page custom backgrounds (more work). RESEARCH suggests same template + different titles via shared `createRootOgImage(title, tagline)` utility.

- **`<RootFooter>` social links** — Facebook, Instagram, LinkedIn URLs. Planner uses placeholders if exact URLs aren't in `.env`; not blocking.

- **Skip-link styling** — planner picks Tailwind class combo for `.sr-only focus:not-sr-only`. Standard a11y pattern, no business decision needed.

- **Form field validation messages** — planner picks copy ("Please enter a valid email" vs. "Email looks wrong" etc.). Brand voice = friendly-but-direct.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents (UI researcher, planner, executor) MUST read these before producing artifacts.**

### Strategy doc (canonical brief — single source of truth for copy + wireframes)

- `.planning/inputs/strategy.md` §PART 3 §1-9 — Root gateway 8-section wireframe (the section-by-section spec)
- `.planning/inputs/strategy.md` §PART 6A — Root gateway full copy (hero H1, story text, market cards, trust section, leadership bio lines, FAQ Q&A, final CTA)
- `.planning/inputs/strategy.md` §PART 8.3 — SG WhatsApp number (`+65 9807 6827`)
- `.planning/inputs/strategy.md` §PART 9.3 — Organization JSON-LD skeleton for root homepage
- `.planning/inputs/strategy.md` §PART 10.2 — LLM-citable brand paragraph for `/brand/`
- `.planning/inputs/strategy.md` §PART 10.4 — Coaching methodology for `/coaching-philosophy/`
- `.planning/inputs/strategy.md` §PART 12 Tier 1 #13 — `/brand/` page specification
- `.planning/inputs/strategy.md` §PART 14.3 — Editorial asymmetry rules (section-to-section layout alternation)
- `.planning/inputs/strategy.md` §PART 15.2 Warning #4 — PDPA + PDPO compliance gates Phase 10 launch (Phase 3 ships placeholder; lawyer review pre-Phase 10)

### Project-level constraints

- `.planning/PROJECT.md` — Core value (convert affluent parents into trial bookings); brand palette/typography (already encoded in Phase 2 tokens — Phase 3 inherits via @theme); performance budget (LCP < 2.5s, INP < 200ms, CLS < 0.1, Lighthouse 95+ — non-negotiable, Phase 3 SC #4 + #5 sit on top); anti-"AI-generated SaaS" aesthetic ban; CMS independence requirement (Phase 6 ships Sanity content models)
- `.planning/REQUIREMENTS.md` — GW-01..GW-07 line items (all 7 assigned to Phase 3); SEO-06/07 (Lighthouse 95+ and CWV green; full SEO treatment is Phase 7)

### Phase 3 research (already on disk)

- `.planning/phases/03-root-gateway-and-supporting-root-pages/03-RESEARCH.md` — 30kB implementation-ready guidance from background research agent (10 topics + 8 pitfalls + validation architecture). Especially:
  - Topic 1: Section-to-primitive mapping table
  - Topic 2: Cross-market handoff (`<a href>` not `<Link>`, env-var `NEXT_PUBLIC_HK_URL/SG_URL` pattern)
  - Topic 3: Resend route handler pattern + spam protection rationale
  - Topic 4: `next-mdx-remote/rsc` over `@next/mdx` (Phase 6 migration seam)
  - Topic 5: OG image (`metadataBase` critical, Satori needs TTF not WOFF2)
  - Topic 6: Root nav + footer composition
  - Topic 7: SEO minimum vs. Phase 7 deferred items
  - Topic 9: Per-page individual specs

### Prior phase carry-forward (Phase 3 inherits — do NOT rebuild)

- `.planning/phases/01-next-js-foundation-subdomain-middleware-sanity-studio-scaffold-vercel-previews/01-CONTEXT.md` — D-01 (middleware host>cookie>query>default ladder), D-02 (Host authority for known subdomains, cookie/query ignored), D-04 (internal rewrites), D-07 (`/studio` pass-through). Phase 3 root CTAs use absolute `<a href>` per D-02 — never set market cookie from root.
- `.planning/phases/01-.../01-04-SUMMARY.md` — Vitest 4.1.5 already wired with `app/` test scope; CI pre-push enforces `pnpm test:unit`
- `.planning/phases/02-design-system-component-gallery-media-pipeline/02-CONTEXT.md` — D-04 (primitive split: stock shadcn for Card/Accordion/Badge/Avatar/Separator, custom only for brand-specific patterns); D-06 (video deferred to Phase 10 — Phase 3 root hero is static photo); D-07 (Martin curates 10–15 hero photos upfront, BEFORE Phase 2 executes — leadership portraits inherit this list); D-08 (`/_design/` gallery scrollable structure — Phase 3 doesn't extend it)
- `.planning/phases/02-.../02-UI-SPEC.md` — Phase 2 design contract; full primitive inventory Phase 3 composes against (MarketCard, ProgrammeTile, TestimonialCard, StatStrip, LogoWall, Section, ContainerEditorial, FAQItem)

### External docs (read at execute time — do NOT embed content now)

- Resend Next.js App Router docs: https://resend.com/docs/send-with-nextjs (verified live)
- Resend pricing/free tier: https://resend.com/pricing
- next-mdx-remote/rsc README: https://github.com/hashicorp/next-mdx-remote
- Next.js metadata API: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- Next.js OG image: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
- gray-matter: https://github.com/jonschlinkert/gray-matter

### Rejected with reasons (do NOT reopen without explicit re-discussion)

- iubenda / Termly auto-generated legal — rejected (cookie-consent JS hurts perf budget; non-standard cross-jurisdiction business needs lawyer review anyway). See D-08.
- Mux video hero on root gateway — rejected for Phase 3 (inherits D-06 video deferral; strategy PART 3 §1 specifies static editorial photography for root). Revisit at Phase 10 only if launch metrics warrant. See D-09.
- reCAPTCHA / Turnstile / hCAPTCHA on contact form — rejected (audience friction unacceptable; Cloudflare WAF at Phase 10 handles bot defense at the edge). See D-04.
- Vercel KV rate limiting on contact form at Phase 3 — rejected (extra dependency, Phase 10 Cloudflare WAF supersedes). See D-04.
- HK / SG inbox emails or WhatsApp numbers hardcoded in source — rejected (env-var pattern + HUMAN-ACTION execute-time checkpoint). See D-01, D-02.
- `/news/` real press list at Phase 3 — rejected (no clips on hand; Sanity-fed at Phase 6). See D-06.
- Live `/careers/` job listings at Phase 3 — rejected (Sanity-fed at Phase 6). See D-07.
- LeadershipCard as Phase 2 DS-level primitive — rejected (Phase 3-local composition only; lives in `components/root/`, not `components/ui/`). See D-11.
- Placeholder silhouettes / initials / stock for missing leadership portraits — rejected (real photography only; HUMAN-ACTION checkpoint blocks execution if missing). See D-10.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets (from Phases 0-2)

- `middleware.ts` — Phase 1 host-authoritative routing. Phase 3 root CTAs go to `process.env.NEXT_PUBLIC_HK_URL` / `NEXT_PUBLIC_SG_URL`; in production these are `https://hk.proactivsports.com/` / `https://sg.proactivsports.com/`, in preview they are `/?__market=hk` / `/?__market=sg` (the existing cookie bridge from D-01).
- `app/(root)/`, `app/(hk)/`, `app/(sg)/` — Phase 1 route groups. Phase 3 work lands inside `app/(root)/` (gateway home + supporting pages).
- `components/ui/button.tsx` — Phase 1 shadcn Button. Phase 2 added `touch` size variant. Phase 3 uses `<Button asChild>` to wrap absolute `<a href>` for cross-market CTAs.
- `components/ui/{card,accordion,badge,avatar,separator}.tsx` — Phase 2 stock shadcn primitives. Phase 3 composes (`Accordion` → `<FAQItem>`, `Card` + `Avatar` → `<LeadershipCard>`).
- `components/ui/{section,container-editorial,faq-item,market-card,programme-tile,testimonial-card,stat-strip,logo-wall}.tsx` — Phase 2 custom primitives. Phase 3 uses each at least once on the gateway homepage per the section-to-primitive map (Topic 1 of RESEARCH).
- `components/ui/video-player.tsx` — Phase 2 Mux player shell. NOT used in Phase 3 (D-09 root hero is static).
- `lib/utils.ts` — `cn()` className helper. Used by every Phase 3 component.
- `app/globals.css` — Phase 2 brand `@theme` block. Phase 3 components consume `--font-display` (Bloc Bold), `--font-sans` (Mont), `--font-accent` (Baloo) tokens via Tailwind utilities. Do NOT redefine.
- `app/_design/page.tsx` — Phase 2 gallery. Phase 3 does NOT extend it; gallery is gated to non-production via Phase 2 D-09.

### Established Patterns

- **Server Components by default; client only at the boundary.** Pages, layouts, and most sections are RSC. Client components are scoped: contact form, mobile menu toggle. RootFooter, RootNav, all section components stay server-side.
- **`<Section>` + `<ContainerEditorial>` for layout.** Every gateway homepage section + every supporting page wraps content in these Phase 2 primitives — no hand-rolled CSS for spacing rhythm. `<Section size="lg|md|sm">` controls vertical rhythm; `<ContainerEditorial>` controls horizontal rhythm.
- **Tailwind utilities only — no `<style jsx>`, no CSS modules, no inline `style={}` for layout.** Phase 2 PATTERNS.md is canonical.
- **Env vars: `NEXT_PUBLIC_*` for client-readable, plain for server-only.** `RESEND_API_KEY`, `CONTACT_INBOX_HK/SG` are server-only. `NEXT_PUBLIC_HK_URL/SG_URL/WHATSAPP_HK/WHATSAPP_SG` are client-readable.
- **Test colocation.** Vitest tests live at `*.test.ts` next to source. Phase 3 adds: `app/(root)/page.test.ts`, `app/api/contact/route.test.ts`. Update `vitest.config.ts` `include` if needed.

### Integration Points

- `app/(root)/layout.tsx` — root group layout. Phase 3 creates this (it doesn't exist yet from Phase 1; Phase 1 created stubs at `app/(root)/page.tsx`). Hosts `<RootNav>`, `<main id="main-content">`, `<RootFooter>`, base `metadata` with `metadataBase: new URL('https://proactivsports.com')`.
- `app/(root)/page.tsx` — gateway homepage. Phase 3 replaces the Phase 1 stub with the full 8-section composition.
- `app/api/contact/route.ts` — NEW POST handler. Reads market, validates, switches inbox, calls Resend.
- `.env.example` — Phase 3 adds `RESEND_API_KEY`, `CONTACT_INBOX_HK`, `CONTACT_INBOX_SG`, `NEXT_PUBLIC_WHATSAPP_HK`, `NEXT_PUBLIC_WHATSAPP_SG`, `NEXT_PUBLIC_HK_URL`, `NEXT_PUBLIC_SG_URL`.
- `package.json` — Phase 3 installs `resend@6.x`, `@react-email/components`, `next-mdx-remote@6.x`, `gray-matter@4.x`. Also keep an additional `.ttf` copy of Bloc Bold at `app/fonts/bloc-bold.ttf` for Satori/ImageResponse OG generation (RESEARCH Topic 5 + Pitfall 4).

</code_context>

<specifics>
## Specific Ideas

- **Inboxes as HUMAN-ACTION pattern (mirrors Phase 2 fonts pattern).** Plan 02-02's font-files-must-exist precondition is the canonical analog. Same UX in Phase 3: planner adds a checkpoint, executor halts gracefully, Martin fills env-var, executor resumes.
- **`/news/` rendering scaffolding present even without content.** The `pressItems` empty-array pattern means the page works today and the Phase 6 swap is a one-line GROQ query. Avoids "page doesn't exist yet" 404 risk.
- **`/careers/` open application CTA links to `/contact/?subject=job`.** Reuses the existing form. Adds a small piece of client-side `useSearchParams()` logic. Doesn't fragment the form across pages.
- **All 7 root pages get OG images from a single `createRootOgImage(title, tagline)` utility** at `lib/og-image.tsx`. Each page's `opengraph-image.tsx` is 5 lines. Per-page brand consistency, no per-page maintenance.
- **`metadataBase` in root layout uses a Vercel-aware fallback** so preview URLs produce absolute OG image paths (Pitfall 1 from RESEARCH):
  ```ts
  const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
  ```

</specifics>

<deferred>
## Deferred Ideas

These came up during discussion or are explicitly Phase 4+ work — captured so they don't get lost:

- **Cloudflare WAF + bot management + edge rate limiting** — Phase 10. Replaces the honeypot-only protection from D-04. Includes bot scoring, challenge pages for suspicious IPs, and per-IP rate limits.
- **DKIM/SPF DNS records for `noreply@proactivsports.com`** — Phase 10 DNS cutover. Required to swap Resend sender from `onboarding@resend.dev` per D-05.
- **Lawyer-drafted PDPA + PDPO compliant Privacy + Terms** — Phase 9 / Phase 10. Replaces the placeholder MDX from D-08. Strategy PART 15.2 Warning #4 calls this out as launch-blocker.
- **Mux video hero on root gateway** — Phase 10 (only if launch metrics warrant). Currently rejected per D-09; revisit decision at Phase 10 with launch performance data.
- **Live careers job listings via Sanity CMS** — Phase 6. Currently evergreen per D-07.
- **Real press list with logo treatments via Sanity `Press` document type** — Phase 6. Currently empty array per D-06.
- **Multilingual contact form (zh-HK)** — POST-03 / v1.5. Per `.planning/PROJECT.md` Out of Scope.
- **iubenda / Termly auto-generated legal** — explicitly rejected (perf budget + cross-jurisdiction lawyer-review necessity); do not revisit unless requirements change materially.
- **Account/portal area for parents (booking history, attendance)** — POST-02 / v2 per PROJECT.md Out of Scope.

### Reviewed Todos (not folded)

None — `gsd-tools todo match-phase 03` returned 0 matches.

</deferred>

---

*Phase: 03-root-gateway-and-supporting-root-pages*
*Context gathered: 2026-04-23 (Areas B, A, C — all 8 RESEARCH open questions resolved)*

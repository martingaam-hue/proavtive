# Phase 7: SEO, Schema, LLMO — Context

**Gathered:** 2026-04-24
**Status:** Ready for planning

---

## Decisions

### Middleware Exclusion Strategy for SEO Special Files

**Decision:** Add `sitemap\.xml`, `robots\.txt`, `llms\.txt`, and `llms-full\.txt` to the middleware `config.matcher` negative-lookahead as defence-in-depth, even though `sitemap.ts` and `robots.ts` technically work via the rewrite path. The exclusion is explicit and eliminates ambiguity.

**Rationale:** The research identifies this as the safest approach. The rewrite architecture works for `sitemap.ts` and `robots.ts` (Next.js metadata conventions are intercepted correctly), but `llms.txt` route handlers at `app/{market}/llms.txt/route.ts` are NOT standard metadata conventions and need middleware bypass. Adding all four to the matcher exclusion makes the intent explicit and prevents future regressions if middleware changes. Pitfall 1 in the research confirms this is the primary failure mode — `/sitemap.xml` returning the market homepage instead of XML is a silent breakage that only surfaces in Search Console.

---

### Per-Market Sitemap Architecture

**Decision:** Place `sitemap.ts` at `app/hk/sitemap.ts`, `app/sg/sitemap.ts`, and `app/root/sitemap.ts`. All URL entries use hardcoded production origin strings (`https://hk.proactivsports.com/`, `https://sg.proactivsports.com/`, `https://proactivsports.com/`). No environment-conditional logic in sitemap URLs.

**Rationale:** The middleware rewrites `hk.proactivsports.com/sitemap.xml` → `/hk/sitemap.xml` internally, so `app/hk/sitemap.ts` correctly serves the HK property sitemap. Production origin URLs must be hardcoded because the sitemap is the canonical source of record for the live domain — Vercel preview URLs must never appear in sitemap output. The `NEXT_PUBLIC_*_URL` approach is rejected here: it adds complexity and is unnecessary since sitemaps are not validated on preview deploys (the `X-Robots-Tag: noindex` header on previews means search engines won't crawl them anyway). Pitfall 5 confirms plain folders (`app/hk/`) not route groups (`app/(hk)/`) are used, so no URL-stripping collision.

---

### robots.ts Behaviour on Preview Deployments

**Decision:** `robots.ts` always emits `rules: { userAgent: '*', allow: '/' }`. The Phase 0 `X-Robots-Tag: noindex, nofollow` header (set in `next.config.ts` for non-production Vercel deploys) is the correct preview-noindex mechanism. The robots.ts file must NOT branch on environment.

**Rationale:** Shipping a `Disallow: /` robots.txt to production even temporarily is a catastrophic SEO risk. The header-level noindex used in Phase 0 is the correct guard. Research Pitfall 3 and Pattern 3 both confirm this. The sitemap URL in `robots.ts` must use the production origin (e.g., `sitemap: 'https://hk.proactivsports.com/sitemap.xml'`).

---

### llms.txt Content Strategy for Phase 7

**Decision:** Phase 7 generates static `llms.txt` and `llms-full.txt` content from `lib/hk-data.ts` and `lib/sg-data.ts` (static data arrays). Sanity GROQ-fetched content (dynamic blog posts, camp dates) is a Phase 7 stretch goal using `export const revalidate = 86400`. If Sanity content is available via Phase 6, wire it; if not, static content is sufficient for SEO-04.

**Rationale:** The llmstxt.org spec requires `llms.txt` (link directory) and optionally `llms-full.txt` (full page content expanded). Both can be fulfilled with static data from existing data files without blocking on dynamic CMS content. The research Open Question 3 confirms this: dynamic Sanity-fetched variant is a stretch goal, not a blocker. Using `export const revalidate = 86400` (24h ISR) covers the dynamic case without full SSR overhead.

---

### llms-full.txt Content Depth

**Decision:** `llms-full.txt` expands each linked section with the full prose content of that page (not just more links). For Phase 7, this means including programme descriptions from `hk-data.ts`/`sg-data.ts`, venue addresses, coach bios, and FAQ answers verbatim. The file is NOT simply a longer link list.

**Rationale:** The research Pitfall 6 explicitly warns this is a common misunderstanding. The spec name "full" means full content, not full list. An LLM consuming `llms-full.txt` should be able to answer factual questions about ProActiv without fetching any further URLs. This is aligned with PART 10 of the strategy doc's LLMO goals.

---

### JSON-LD Helper Architecture

**Decision:** Create `lib/schema.ts` as the single source of typed JSON-LD builder functions. All pages import from this module. No inline ad-hoc schema objects on individual pages. Install `schema-dts` as a dev dependency for TypeScript types.

**Rationale:** The research confirms `lib/schema.ts` does not yet exist (Assumption A3). Without a shared module, the existing Phase 3/4 pattern of inline hardcoded schema objects will drift as Phase 5/6 pages are added. A typed helper module: (a) prevents FAQPage answer text divergence (Pitfall 2 — answers must match visible copy, which means both must consume the same data source), (b) enables unit testing via `tests/unit/schema.test.ts`, (c) ensures consistent `@id` URIs (e.g., `https://proactivsports.com/#organization` is never mistyped). `schema-dts` v1.1.2 is verified on npm and adds zero runtime cost (dev dependency only).

---

### Schema Types Per Page

**Decision:** Implement exactly the schema deployment matrix from strategy PART 9.1, extended as follows for Phase 7:

- **Root (`/`):** Organization + WebSite + FAQPage in `@graph` (already present; verify and update with `lib/schema.ts`)
- **HK homepage:** SportsActivityLocation (referencing both Wan Chai and Cyberport) + WebSite + FAQPage + BreadcrumbList (add VideoObject only if hero video is the primary content element; omit otherwise per PART 9.1)
- **SG homepage:** SportsActivityLocation (Katong Point) + WebSite + FAQPage + BreadcrumbList
- **Wan Chai / Cyberport / Katong Point:** SportsActivityLocation + BreadcrumbList + OpeningHoursSpecification
- **Programme pillar pages (gymnastics, weekly-classes, prodigy-camps):** Service + BreadcrumbList + FAQPage (where FAQ items exist)
- **Camp pages with dates:** Event + BreadcrumbList + Offer
- **Birthday parties / school partnerships:** Service + BreadcrumbList
- **Coaches pages:** Person (via `@graph` array) + BreadcrumbList
- **Blog posts (Phase 6 CMS pages):** BlogPosting + BreadcrumbList + Person (author)
- **All sub-pages (gymnastics/toddlers, weekly-classes/movement-zone, etc.):** BreadcrumbList minimum

**Rationale:** Follows strategy PART 9.1 exactly. AggregateRating is explicitly excluded (PART 9.2 — no verifiable review data at launch). Course schema is explicitly excluded (PART 9.2 — use Service). MedicalBusiness/HealthAndBeautyBusiness is explicitly excluded (use SportsActivityLocation). The VideoObject decision is conservative: only add where video is the primary content, not on every page with a background video.

---

### FAQPage Schema Answer Source of Truth

**Decision:** FAQ answer text in JSON-LD must come from the same data array as the visible `<FAQItem>` component. For static pages: both consume `HK_FAQ_ITEMS` / `SG_FAQ_ITEMS` from `lib/hk-data.ts` / `lib/sg-data.ts`. For CMS-driven pages (Phase 6): both consume the Sanity FAQ document fields. No copy-pasting or parallel maintenance.

**Rationale:** Research Pitfall 2 identifies FAQPage schema answer drift as a common failure mode that silently suppresses rich results. The answer text in `acceptedAnswer.text` must be verbatim-equal to the visible answer. The only way to guarantee this permanently is a single data source for both. The existing `app/hk/faq/page.tsx` already uses this pattern (Phase 4 established it); Phase 7 must enforce it on all remaining FAQ pages.

---

### generateMetadata Strategy for CMS-Driven Pages

**Decision:** For pages that will be CMS-driven (blog posts, camp pages, coach bio pages), scaffold `generateMetadata` with Sanity GROQ fetches now, with graceful `null` fallbacks. For pages that are static or stub-only (no real Sanity content yet), use `export const metadata` with real production-intent values — not "TODO" placeholders.

**Rationale:** Phase 6 (Sanity CMS) is a dependency for Phase 7 per ROADMAP.md. The research Assumption A2 notes that if Phase 6 is not complete, `generateMetadata` falls back to static metadata — acceptable. Scaffolding the Sanity fetch now means Phase 8 (Analytics) doesn't need to revisit metadata code. Static pages (root, location pages, programme pillars) should have their final production metadata values in `export const metadata` — these are known from strategy PART 7.1-7.3 and do not need CMS fields.

---

### Title Tag and Meta Description Values

**Decision:** Use the recommended (#1) options from strategy PART 7.1 and 7.2 verbatim:

- Root title: `ProActiv Sports | Premium Children's Gymnastics & Sports — Hong Kong & Singapore`
- Root description: `ProActiv Sports runs premium children's gymnastics and sports programmes in Hong Kong and Singapore. Since 2011. Choose your city to explore classes, camps, and parties.`
- HK title: `Kids Gymnastics & Sports Hong Kong | ProActiv Sports — Wan Chai & Cyberport`
- HK description: `Premium gymnastics, sports classes, holiday camps and birthday parties for children in Hong Kong. ProGym Wan Chai & Cyberport. Book a free trial.`
- SG title: `Kids' Sports Classes, Camps & Parties Singapore | Prodigy by ProActiv Sports`
- SG description: `Kids' sports classes, holiday camps & birthday parties at Prodigy by ProActiv Sports — Katong Point, Singapore. Home of the only MultiBall wall. Book a free trial.`

**Rationale:** The strategy doc provides explicitly recommended options with clear reasoning. Using the recommended #1 option eliminates a decision layer and ensures alignment with the canonical strategy brief. These are already SEO-optimised and within character limits.

---

### OG / Twitter Card metadataBase Pattern

**Decision:** Follow the existing `app/hk/layout.tsx` pattern for `metadataBase` (branch on `VERCEL_ENV === 'production'`). Apply the same pattern to `app/sg/layout.tsx` (which may not yet implement this). All `alternates.canonical` URLs use production origins.

**Rationale:** Research Pitfall 3 confirms this is a known issue — without the production branch, OG image URLs emit relative paths that break WhatsApp/Slack unfurls on preview URLs. The HK layout already has this correct; Phase 7 must verify SG uses the same pattern.

---

### Lighthouse Measurement Approach

**Decision:** Lighthouse measurements for Phase 7 verification use manual Chrome DevTools Lighthouse on the latest Vercel preview deploy (cold cache, mobile, throttled). Lighthouse CI automation is a Phase 7 stretch goal, not a gate requirement.

**Rationale:** The research Environment Availability table confirms Lighthouse CI is not available (`✗`) but manual Lighthouse in Chrome DevTools is the acceptable fallback for Phase 7. Automated LH CI would require additional infrastructure setup outside Phase 7's scope. The manual measurement is sufficient to verify the LCP < 2.5s, INP < 200ms, CLS < 0.1 targets on all primary pages (root, hk, sg homepages, all 3 location pages, all pillar pages).

---

### WCAG 2.2 AA Focus Indicator Fix

**Decision:** Verify the existing `outline-2 outline-ring` focus ring against WCAG 2.2 SC 2.4.11 (Focus Appearance AA). If the known Button contrast violation from Phase 2 `STATE.md` is still present, fix it in Phase 7 as part of the WCAG audit pass. Do not defer to a later phase.

**Rationale:** Phase 7's SEO-08 requirement explicitly includes WCAG 2.2 AA. The research WCAG checklist flags the Button contrast violation as a "Known issue — fix pending; Phase 7 must address." Since the button colors come from brand tokens, the fix is either (a) a slightly adjusted brand token (within acceptable brand tolerance) or (b) a darken/lighten modifier on the specific button state. Client coordination is not required for a minor contrast fix within the existing navy/white/red palette — navy on white achieves 14.55:1 which is well over threshold; the issue is likely with a secondary button state. Investigate and fix programmatically.

---

### axe-core Integration

**Decision:** Install `@axe-core/react` as a dev dependency. Integrate it in development mode only (gated on `process.env.NODE_ENV === 'development'`). Add `tests/unit/a11y.test.tsx` for automated axe-core checks on root, HK, and SG homepage renders. These become CI-gated via `pnpm test:unit`.

**Rationale:** The research identifies `@axe-core/react` as the only new package required for Phase 7. It catches ~30-40% of WCAG violations programmatically before manual review, reducing manual walk time. Dev-only gating means zero production bundle impact. The unit test approach (render + axe check) is consistent with the existing Vitest + RTL test infrastructure.

---

### SG Pages Prerequisite Handling

**Decision:** Phase 7 plans must include a Wave 0 task that asserts SG pages are fully built (Phase 5 complete). If `app/sg/page.tsx` is still a Phase 1 stub, Wave 0 halts and escalates to the user. The planner should not generate SG-specific schema/metadata tasks that depend on SG page content existing.

**Rationale:** Research Assumption A1 and Pitfall 8 flag this clearly. Phase 7 depends on Phase 5 per ROADMAP.md. Attempting Lighthouse measurements or adding schema to a stub page is wasted work. The Wave 0 gate prevents phantom plan items.

---

### Cyberport Venue Coordinates

**Decision:** Use approximate Cyberport complex coordinates (latitude: 22.2607, longitude: 114.1296) as a placeholder in the GeoCoordinates schema for the Cyberport venue. Mark with a `// HUMAN-ACTION: verify exact lat/lng with client` comment in `lib/schema.ts`.

**Rationale:** Research Open Question 4 identifies this as unknown. The Wan Chai coordinates (22.2772, 114.1730) are verified and in `lib/hk-data.ts`. For Cyberport, approximate coordinates are better than omitting GeoCoordinates entirely (which degrades the LocalBusiness schema). The HUMAN-ACTION comment ensures this gets updated before launch.

---

### Sitemap URL Trailing Slash Consistency

**Decision:** All sitemap URL entries use trailing slashes (e.g., `https://hk.proactivsports.com/gymnastics/`). All `alternates.canonical` in page metadata use the same trailing slash format.

**Rationale:** The Next.js App Router with `trailingSlash: true` (or the default App Router behavior) serves pages at trailing-slash URLs. Sitemap URLs must match canonical URLs exactly — mixing trailing/non-trailing causes Google to treat them as different URLs and dilutes signals. Research anti-patterns section confirms: "Sitemap URLs without trailing slashes when pages use trailing slashes" is a named pitfall.

---

### No hreflang Between HK and SG

**Decision:** Do not implement hreflang between `hk.proactivsports.com` and `sg.proactivsports.com`. Self-referencing canonicals only.

**Rationale:** Strategy PART 2 explicitly states: "No hreflang needed between HK and SG — they are *different products*, not language/locale variants of the same product." This is a locked decision from the strategy doc. Implementing hreflang would signal to Google these are locale variants of the same content, which is incorrect and potentially harmful.

---

### Schema @id URI Consistency

**Decision:** Use these fixed `@id` values across all schema:
- Organization: `https://proactivsports.com/#organization`
- WebSite (root): `https://proactivsports.com/#website`
- LocalBusiness Wan Chai: `https://hk.proactivsports.com/#localbusiness-wanchai`
- LocalBusiness Cyberport: `https://hk.proactivsports.com/#localbusiness-cyberport`
- LocalBusiness Katong: `https://sg.proactivsports.com/#localbusiness-katong`

These match exactly the skeletons in strategy PART 9.3 and 9.4.

**Rationale:** The `@id` URI creates the knowledge graph node identity. Using it consistently across pages (Wan Chai page references the same `@id` as the root Organization's `subOrganization` array) lets Google and LLMs resolve the entity graph. Any variation in `@id` string breaks this linkage silently. The strategy doc provides the exact values — use them verbatim.

---

### Wave Structure for Phase 7

**Decision:** Phase 7 executes in four waves:
1. **Wave 0:** Middleware exclusion update + `lib/schema.ts` creation + `schema-dts` + `@axe-core/react` installs + 5 test scaffold files (RED) + Phase 5/6 prerequisite gate check
2. **Wave 1:** sitemap.ts + robots.ts + llms.txt/llms-full.txt route handlers for all three properties
3. **Wave 2:** JSON-LD coverage — SG pages (missing entirely), HK gaps (holiday-camps, birthday-parties, blog/camp Event schema), and `generateMetadata` scaffolding for CMS-driven page types
4. **Wave 3:** Performance audit pass (image `sizes` attrs, Suspense boundaries, Mux player verification) + WCAG audit pass (axe-core, focus ring, heading hierarchy, Button contrast fix) + Lighthouse verification

**Rationale:** This order reflects the research's primary recommendation: "Add sitemap/robots/llms.txt exclusions to the middleware matcher first (Wave 0 task), then build all SEO routes and helpers, then do the audit pass. Do not attempt Lighthouse optimisation before all routes are correct." The wave structure ensures each layer is tested before the next begins.

---

## Locked Choices

These decisions are non-negotiable — locked by the strategy doc, the tech stack, or prior phase decisions:

1. **Tech stack:** Next.js 15 native metadata APIs (`generateMetadata`, `MetadataRoute.Sitemap`, `MetadataRoute.Robots`). No `next-seo`, `next-sitemap`, `react-helmet`. These are ruled out in the research "Don't Hand-Roll" table.
2. **No hreflang** between HK and SG properties (strategy PART 2).
3. **No AggregateRating schema** without verifiable, displayed review data (strategy PART 9.2).
4. **No Course schema** for gymnastics programmes — use Service (strategy PART 9.2).
5. **No MedicalBusiness / HealthAndBeautyBusiness** — use SportsActivityLocation (strategy PART 9.2).
6. **SportsActivityLocation** as the LocalBusiness subtype for all three venues.
7. **Title tags use recommended #1 options** from strategy PART 7.1 verbatim.
8. **robots.ts always emits allow-all** — preview noindex via `X-Robots-Tag` header (Phase 0).
9. **FAQ answers in schema = FAQ answers on page** — single data source, no divergence.
10. **Production origin URLs hardcoded in sitemaps** — no preview URL in sitemap output, ever.
11. **No AggregateRating until real reviews are displayed** — not at launch.
12. **llms.txt spec compliance:** H1 + blockquote summary + H2 sections + Optional section. No H3. No HTML. Pure Markdown only.

---

## Claude's Discretion

Implementation details left to the planner and executor:

- Exact file naming and folder structure within `lib/schema.ts` (function names, parameter shapes, return types) — follow the patterns sketched in the research, but adapt as needed for DRY-ness.
- Whether `generateMetadata` for blog/camp pages uses `sanityFetch` (with caching) or `client.fetch` (without) — use whichever pattern Phase 6 established for other Sanity data fetches; be consistent.
- Exact revalidation period for `llms.txt` / `llms-full.txt` ISR — 86400 seconds (24h) is the recommendation; adjust to 43200 (12h) if camp dates change frequently.
- Whether to inline the JSON-LD `<script>` tag at the top or bottom of the page component — consistent with the Phase 4 established pattern (top of the component body, before content JSX).
- Exact `changeFrequency` and `priority` values for individual sitemap entries beyond the homepage (priority 1) and location pages (priority 0.9) — use content importance judgment.
- Order of Wave 2 tasks (SG schema vs HK gaps vs generateMetadata) — pick whichever reduces risk of merge conflicts with any parallel Phase 5/6 work.
- Whether to add `@axe-core/react` to a dev-only provider component in `app/layout.tsx` or to a standalone dev-mode bootstrap script — either is acceptable; dev-only gating is required.
- Exact Cyberport address unit number — use placeholder from `lib/hk-data.ts` (whatever is currently there); HUMAN-ACTION comment covers this.

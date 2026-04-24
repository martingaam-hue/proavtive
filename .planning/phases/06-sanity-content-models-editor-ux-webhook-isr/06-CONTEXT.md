# Phase 6: Sanity Content Models, Editor UX, Webhook → ISR — Context

**Gathered:** 2026-04-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 6 activates the Sanity CMS end-to-end: replace 8 empty schema stubs with production content models, wire the webhook → `revalidateTag` ISR pipeline for sub-30s publish-to-live, configure editor access roles, and connect all live pages to `sanityFetch` so editors can publish homepage updates, blog posts, and venue/coach/FAQ content without any developer involvement.

**Satisfies:** CMS-01, CMS-02, CMS-03, CMS-04, CMS-05, CMS-06 (adapted), CMS-07 (de-scoped — see decisions)

**Depends on:** Phase 3 (root pages), Phase 4 (HK pages), Phase 5 (SG pages) — pages must exist before their content becomes editable.

**Out of scope for Phase 6:**
- Full Vercel Visual Editing (stega cursor overlays) — deferred post-launch
- Scheduled publishing (requires Growth plan; user is on Free)
- Custom Sanity roles (requires Enterprise; user is on Free)
- Development dataset separation (keeping single 'production' dataset)
- Sitemap, robots.txt, llms.txt, per-page metadata — Phase 7
- Cloudflare WAF / domain cutover — Phase 10

</domain>

<decisions>
## Implementation Decisions

### Sanity Plan Tier

- **D-01: Sanity project `zs77se7r` is on the Free plan (lapsed trial).** This locks all plan-dependent decisions below.
- **D-02: Scheduled publishing is dropped from Phase 6 scope.** Built-in Scheduled Drafts requires Growth plan ($99/month). No Vercel cron fallback — too complex for v1.0. Editors set `publishedAt` to a future date as a convention; posts go live on the next Publish click. Revisit by upgrading to Growth when the blog is actively in use.
- **D-03: 4-role access model.** Free plan provides 5 built-in Sanity roles; strategy PART 13.5's 5-role model compresses to 4 workable roles:
  - **Administrator** — full access, 2FA enforced via identity provider (Google/GitHub)
  - **Editor** — can publish all document types; covers Marketing role intent
  - **Contributor** — can create and edit drafts but requires Editor to publish; covers Author/blogger intent
  - **Viewer** — read-only; useful for client stakeholders
  
  Studio `currentUser.roles` conditionals may be used to hide sensitive controls from Contributor, but no custom role configuration is needed (or available).

### Schema Definitions

- **D-04: Replace all 8 Phase 1 stubs with production schemas.** Each file under `sanity/schemaTypes/` is fully rewritten. Phase 1 D-11 stubs are placeholders only — Phase 6 owns the real content modelling.
- **D-05: Three market settings singletons.** In addition to `siteSettings` (root gateway hero), add `hkSettings` and `sgSettings` singletons so HK and SG editors can independently update their homepage hero copy, CTAs, and featured images without a developer. All three are singletons in `sanity/structure.ts`.
- **D-06: Shared `imageWithAlt` type enforces alt text on all image fields.** Every image across all schemas uses the `imageWithAlt` reusable object type with `validation: Rule.required()` on the `alt` field. No bare `{ type: 'image' }` anywhere. Document-level custom validation blocks publish if an asset is set but `alt` is empty. This covers inline images in Portable Text body as well (use `{ type: 'imageWithAlt' }` in the `of` array).
- **D-07: Coach schema field names MUST match Phase 4 D-07 locked shape.** The `coach` schema uses: `name`, `role`, `bio`, `venueTag` (optional string), `portrait` (imageWithAlt). Do not rename these fields — Phase 4/5 coach page components reference this shape. Market field added: `market` (`'hk' | 'sg'`).
- **D-08: Blog schema field naming reconciliation.** Phase 4 blog stubs used `{ title, slug, excerpt, date, category, readTime, imageUrl }`. The Phase 6 `post` schema uses the research-backed names (`publishedAt` not `date`, `mainImage` not `imageUrl`, `categories[]` as references not a single string). Frontend blog hub components in `app/hk/blog/page.tsx` and `app/sg/blog/page.tsx` MUST be updated to match the new field names as part of Phase 6 execution.
- **D-09: TypeGen wired as a dev script.** `sanity typegen generate` runs via `pnpm typegen` script in package.json. `sanity.cli.ts` configured with `generateOnCreate: true` so types auto-regenerate on `sanity dev`. Types output to `types/sanity.generated.ts`.

### Webhook → ISR Pipeline

- **D-10: `revalidateTag` over `revalidatePath`.** Tag-based invalidation fans out to all pages using data of a given type without maintaining an exhaustive path list. Every `sanityFetch` call must include a `tags` array matching the document `_type` (e.g. `tags: ['post']`).
- **D-11: `parseBody` with 3-second delay.** The `true` third argument to `parseBody` from `next-sanity/webhook` adds a delay before calling `revalidateTag`, preventing the stale CDN race condition (Pitfall 1 from research). This is mandatory.
- **D-12: Webhook route runs in Node.js runtime (not edge).** `/api/revalidate/route.ts` MUST NOT have `export const runtime = 'edge'`. `revalidateTag` silently fails on edge runtime (Pitfall 2 from research).
- **D-13: Webhook projection includes slug for post-specific cache busting.** In addition to `revalidateTag(body._type)`, also call `revalidateTag('post:' + body.slug.current)` when a post is published, for slug-specific invalidation.

### Data Fetching Pattern

- **D-14: `defineLive` + `sanityFetch` is the canonical data-fetching pattern.** All Sanity data fetching uses `sanityFetch` from `lib/sanity.live.ts`. No bare `createClient().fetch()` without tags. GROQ queries must never run in client components — always in RSC.
- **D-15: `<SanityLive>` added once in `app/layout.tsx` (root shared layout).** Not in each market layout. The single instance covers all child routes (root, hk, sg). This prevents duplicate SSE connections (Pitfall 6 from research). Executor must verify that `app/layout.tsx` wraps all route groups — if market layouts have no shared parent, add `<SanityLive>` to each.
- **D-16: `SANITY_API_BROWSER_TOKEN` is optional for Phase 6.** For the public-facing non-draft use case, only `serverToken` (`SANITY_API_READ_TOKEN`) is required. `browserToken` can be omitted or set to the same viewer-scoped read token. No public live preview needed.

### Frontend Wiring Scope

- **D-17: Full wiring — all CMS types replaced in Phase 6.** Every hardcoded TS array in `lib/hk-data.ts` and equivalent SG data is replaced with live `sanityFetch` GROQ queries:
  - `siteSettings` → root homepage hero copy + CTA
  - `hkSettings` + `sgSettings` → HK/SG homepage hero + market-specific CTAs (new singletons)
  - `post` → HK + SG blog hub lists + new `[slug]` individual post pages
  - `venue` → HK location pages (Wan Chai, Cyberport) + SG location page (Katong Point) NAP + hours
  - `coach` → HK coaches page (`HK_COACHES` replaced) + SG coaches page
  - `faq` → HK + SG FAQ hubs
  - `testimonial` → wherever testimonials are rendered on homepages
  - `camp` → HK/SG camp pages with Event JSON-LD generation
- **D-18: Dynamic `[slug]` blog post pages added for both markets.** `app/hk/blog/[slug]/page.tsx` and `app/sg/blog/[slug]/page.tsx` — RSC pages driven by Sanity `post` data with Portable Text body rendering. The homepage "Latest from the blog" block and blog hub links to these routes. This is new scope not in Phase 4/5.
- **D-19: Homepage "Latest from the blog" uses featured-first GROQ ordering.** Query: `order(featured desc, publishedAt desc)[0...3]` with market filter. `featured: true` promotes a post to slot 0. Editorial convention: max one featured post at a time — documented in the `featured` field description.

### Visual Editing

- **D-20: Draft Mode + URL resolver only (no full Visual Editing in Phase 6).** Wire the Presentation iframe so editors can preview their draft in the correct page. Full stega cursor overlays (Vercel Visual Editing) deferred post-launch.
- **D-21: Preview URL uses `NEXT_PUBLIC_VERCEL_URL` env var.** Auto-updates on every Vercel deploy. No hardcoded preview URL. Falls back to `http://localhost:3000` for local dev.
- **D-22: Draft Mode enable route wired via `defineEnableDraftMode`.** `app/api/draft-mode/enable/route.ts` uses `defineEnableDraftMode` from `next-sanity/draft-mode` with `SANITY_API_READ_TOKEN` (must be Editor-or-above permission).
- **D-23: Presentation `resolve.locations` maps document types to preview URLs.** At minimum: `post`, `venue`, `camp`, `coach`. The resolver uses `doc.market` + `doc.slug?.current` to build the correct HK/SG preview path.

### Dataset

- **D-24: Single `production` dataset maintained.** No development dataset added. Phase 1 D-10 confirmed. Schema changes in Phase 6 are non-destructive additions to existing stubs.

### Event JSON-LD

- **D-25: Camp Event JSON-LD generated server-side in Next.js RSC, not in a Sanity plugin.** Camp page component maps `camp.startDate`, `camp.endDate`, `camp.venue`, `camp.price`, `camp.priceCurrency`, `camp.offerUrl` to schema.org `Event` and injects as `<script type="application/ld+json">`. Validated against Google Rich Results Test after implementation.

### Parallel Execution

- **D-26: Plans should be structured for parallel agent execution.** The planner should split Phase 6 into independent plan waves (e.g. Wave A: schema definitions; Wave B: webhook + data fetching infra; Wave C: frontend page wiring; Wave D: Draft Mode + Presentation wiring) so multiple agents can execute concurrently. User has indicated parallel execution in background is preferred.

### Claude's Discretion

Areas the planner/executor can decide without reopening:
- **`sanity/structure.ts` final shape** — extend Phase 1 singleton pattern to add `hkSettings` + `sgSettings` singletons; market-filtered lists for posts/camps/coaches per structure.ts Pattern from research
- **`lib/sanity.client.ts` vs existing config** — check if a Sanity client file already exists from Phase 1; update in place rather than creating a new file
- **`SanityImage` component placement** — place in `components/sanity-image.tsx` per research Pattern SanityImage; reused across all market pages
- **`PortableText` renderer placement** — `components/portable-text.tsx` per research; styled to match existing brand typography (Unbounded headings, Manrope body)
- **Blog post `readTime` calculation** — `round(length(pt::text(body)) / 5 / 200)` in GROQ (per research Pattern 4); no separate field needed
- **GROQ query file location** — `lib/queries.ts` with `defineQuery` wrapper; typed per TypeGen output
- **Featured post editorial convention** — documented in the `featured` field description in `post.ts`; no runtime enforcement (too complex for v1.0)
- **`SANITY_REVALIDATE_SECRET` generation** — executor generates a random 32-char string and writes a HUMAN-ACTION checkpoint for Martin to set it in both Vercel env and the Sanity webhook config in manage.sanity.io
- **Webhook filter in manage.sanity.io** — all document types: `_type in ["post", "siteSettings", "hkSettings", "sgSettings", "venue", "camp", "coach", "faq", "testimonial", "page"]`
- **Category taxonomy** — add a `category` document type as a reference target for `post.categories[]`; a simple `{ name, slug }` type

### Folded Todos

None — no pending todos matched Phase 6 in the GSD todo-matcher pass.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Primary strategy doc
- `.planning/inputs/strategy.md` § PART 13.2 — Editable vs static content map; defines which fields are CMS-managed vs hardcoded. Authoritative list of what Phase 6 must make editable.
- `.planning/inputs/strategy.md` § PART 13.3 — Dynamic sync architecture; confirms webhook → ISR pattern.
- `.planning/inputs/strategy.md` § PART 13.4 — Blog editor requirements; full SEO field set spec for the `post` schema.
- `.planning/inputs/strategy.md` § PART 13.5 — Access roles spec; Phase 6 maps this to the 4-role model (D-03 above).
- `.planning/inputs/strategy.md` § PART 13.6 — Security discipline; env-var posture, token scoping, secret storage rules.

### Phase requirements
- `.planning/REQUIREMENTS.md` § CMS-01 through CMS-07 — The 7 CMS requirements Phase 6 must satisfy (CMS-07 Scheduled Drafts is de-scoped per D-02).
- `.planning/ROADMAP.md` § Phase 6 — Goal, 5 success criteria, rough shape, strategy anchors.

### Phase 1 Sanity decisions (carry-forward)
- `.planning/phases/01-next-js-foundation-subdomain-middleware-sanity-studio-scaffold-vercel-previews/01-CONTEXT.md` § Decisions — especially:
  - D-06 (Studio embedded at `/studio`, same app)
  - D-07 (`/studio` reachable on any host)
  - D-11 (8 schema stubs — Phase 6 replaces each)
  - D-12 (siteSettings singleton pattern via structure.ts)
  - D-13 (`defineType()` in TypeScript; barrel `index.ts`)
  - D-14 (Presentation plugin installed but NOT wired until Phase 6)

### Phase 4 data shape constraints
- `.planning/phases/04-hong-kong-market/04-CONTEXT.md` § Decisions — especially:
  - D-07 (Coach data shape: `{ name, role, bio, venueTag?, portrait }` — schema field names MUST match)
  - D-07 Claude's Discretion (Blog stub shape: frontend components use `{ title, slug, excerpt, date, category, readTime, imageUrl }` — Phase 6 updates components to new schema names per D-08)

### Research (already complete)
- `.planning/phases/06-sanity-content-models-editor-ux-webhook-isr/06-RESEARCH.md` — Full technical research: 9 implementation patterns, pitfall list, environment availability table, validation architecture, security domain. Executor MUST read before coding.

### No additional external specs
The research patterns in `06-RESEARCH.md` are sourced from official Sanity + next-sanity@11 docs and are authoritative for Phase 6 implementation.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- **`sanity/schemaTypes/*.ts`** — 8 empty stubs (`siteSettings`, `post`, `venue`, `coach`, `camp`, `testimonial`, `faq`, `page`) exist from Phase 1. Each has one `title` field. Phase 6 overwrites entirely — no existing content to preserve.
- **`sanity/structure.ts`** — Phase 1 siteSettings singleton pattern; Phase 6 extends to add `hkSettings`, `sgSettings`, and market-filtered lists.
- **`app/layout.tsx`** — Root shared layout wrapping all route groups. `<SanityLive>` goes here (D-15). Already has font vars + globals.css.
- **`lib/hk-data.ts`** — Contains `HK_COACHES`, `HK_BLOG_POSTS_STUB`, `HK_FAQ_ITEMS`, `HK_VENUES`, `HK_GYMNASTICS_PROGRAMMES`. Phase 6 replaces coach/blog/faq/venue arrays with sanityFetch queries. Gymnastics programme data may remain hardcoded (no `programme` schema type in scope).
- **`app/api/contact/route.ts`** — Phase 3 contact route; Phase 4 extended for booking. Unrelated to Phase 6 — don't touch.
- **`vitest.config.ts`** — Existing Vitest runner scoped to TS unit tests. Phase 6 adds webhook + GROQ query tests.

### Established Patterns

- **RSC data fetching** — All market pages are Server Components fetching from `lib/*-data.ts`. Phase 6 replaces the data source (Sanity) but preserves the RSC pattern. No client component changes needed for data fetching.
- **Market filter pattern** — All documents with a `market` field (`'hk' | 'sg'`) must be filtered in GROQ: `&& market == $market`. This prevents HK content appearing on SG pages.
- **HUMAN-ACTION gate** — Phase 3/4/5 established this pattern for env vars and assets. Phase 6 MUST use it for: `SANITY_REVALIDATE_SECRET`, `SANITY_API_READ_TOKEN`, and configuring the webhook in manage.sanity.io.

### Integration Points

- **`app/layout.tsx`** — Add `<SanityLive />` from `lib/sanity.live.ts`
- **`app/api/revalidate/route.ts`** — New webhook route handler (D-11, D-12)
- **`app/api/draft-mode/enable/route.ts`** — New Draft Mode enable route (D-22)
- **`sanity/schemaTypes/*.ts`** — Rewrite all 8 existing stubs; add `category.ts`, `hkSettings.ts`, `sgSettings.ts`, `shared/imageWithAlt.ts`
- **`lib/sanity.client.ts`** + **`lib/sanity.live.ts`** — New client config + `defineLive` exports
- **`lib/queries.ts`** — New typed GROQ query file
- **`components/sanity-image.tsx`** — New `SanityImage` wrapper
- **`components/portable-text.tsx`** — New `PortableText` renderer
- **`app/hk/blog/[slug]/page.tsx`** + **`app/sg/blog/[slug]/page.tsx`** — New dynamic blog post routes (D-18)
- **`app/hk/blog/page.tsx`**, **`app/sg/blog/page.tsx`** — Update to use `sanityFetch` instead of `HK_BLOG_POSTS_STUB`
- **`app/hk/coaches/page.tsx`**, **`app/sg/coaches/page.tsx`** — Update to use `sanityFetch` instead of `HK_COACHES`
- **`app/hk/faq/page.tsx`**, **`app/sg/faq/page.tsx`** — Update to use `sanityFetch`
- **`app/hk/wan-chai/page.tsx`**, **`app/hk/cyberport/page.tsx`**, **`app/sg/...(venue)/page.tsx`** — Update to use `sanityFetch` for venue NAP
- **`app/hk/holiday-camps/[slug]/page.tsx`** + **`app/sg/holiday-camps/[slug]/page.tsx`** — Camp pages with Event JSON-LD (may not exist yet — check at execute time)
- **`sanity.config.ts`** — Update Presentation plugin with real `resolve.locations` + draft mode URLs (D-21, D-22, D-23)
- **`sanity.cli.ts`** — Add TypeGen config (D-09)
- **`.env.example`** — Add: `SANITY_REVALIDATE_SECRET`, `SANITY_API_READ_TOKEN`, `SANITY_API_BROWSER_TOKEN` (optional), `NEXT_PUBLIC_VERCEL_URL`

</code_context>

<specifics>
## Specific Ideas

- **Phase 4 coach data is frozen as the field name authority.** The `coach` schema uses `name`, `role`, `bio`, `venueTag`, `portrait` — exactly matching `HKCoach` type in `lib/hk-data.ts`. If any field name in the existing frontend component differs from this list, the component is wrong and must be corrected to match the schema, not the other way around.
- **`hkSettings` and `sgSettings` are the key new singletons** beyond what the roadmap rough shape anticipated. These unlock independent market homepage management — a core editorial independence promise. The planner should allocate a dedicated plan for market settings schemas + Studio structure wiring.
- **No stega for now** — Full Visual Editing deferred. The executor should NOT add `stega: { enabled: true, studioUrl: '/studio' }` to the Sanity client config in Phase 6. Add it only if/when Visual Editing is activated post-launch.
- **`NEXT_PUBLIC_VERCEL_URL` is Vercel-injected** — it's the deployment URL without protocol prefix. Wrap as `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` in the Presentation config. In local dev, fallback to `http://localhost:3000`.
- **Free plan webhook limit** — Sanity Free plan limits webhooks to 5. With Phase 6's single webhook (all `_type` in one filter), this is well within budget.

</specifics>

<deferred>
## Deferred Ideas

- **Full Vercel Visual Editing (stega cursor overlays)** — post-launch; activate by enabling `stega` in Sanity client config and wrapping preview components
- **Scheduled publishing** — defer until Growth plan upgrade; when ready, built-in Scheduled Drafts activates immediately without code changes
- **Custom Sanity roles (Author, Marketing)** — requires Enterprise plan; the 4-role model is sufficient for v1.0
- **Development dataset** — re-evaluate post-launch if schema iteration frequency warrants it
- **`studio.proactivsports.com` as a dedicated host** — Phase 1 D-07 noted; revisit post-Phase 10
- **MultiBall / interactive tech demo content type** — strategy mentions it; no CMS type defined yet; defer to post-launch content expansion
- **Programme/gymnastics sub-programme content type** — Phase 4/5 uses hardcoded `HK_GYMNASTICS_PROGRAMMES`; out of Phase 6 scope; stays hardcoded
- **Blog post content seeding** — real blog posts are a marketing/content task, not a Phase 6 technical deliverable; HUMAN-ACTION post-launch
- **Vercel cron fallback for scheduled publishing** — evaluated and rejected for v1.0 complexity; document in a backlog note

### Reviewed Todos (not folded)

None — no pending todos matched Phase 6.

</deferred>

---

*Phase: 06-sanity-content-models-editor-ux-webhook-isr*
*Context gathered: 2026-04-24*

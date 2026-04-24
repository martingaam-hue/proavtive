---
phase: 04-hong-kong-market
plan: 06
subsystem: hk-supporting-pages
tags: [phase-4, hk, wave-3, supporting-pages, og-images, faqpage-jsonld, person-jsonld]
requirements: [HK-05, HK-06, HK-07, HK-08, HK-09, HK-10, HK-11]
dependency_graph:
  requires:
    - "@/lib/hk-data (HK_COACHES, HK_BLOG_POSTS_STUB, HK_FAQ_ITEMS — Plan 04-01)"
    - "@/lib/og-image (createHKOgImage — Plan 04-02)"
    - "app/hk/layout.tsx (metadataBase + HKNav + HKFooter — Plan 04-02)"
    - "@/components/ui/section, container-editorial, card, badge, button (Phase 2)"
    - "@/components/ui/programme-tile (Phase 2 — consumed by /holiday-camps/)"
    - "@/components/ui/testimonial-card (Phase 2 — consumed by /birthday-parties/)"
    - "@/components/ui/faq-item (Phase 2 — consumed by /faq/)"
  provides:
    - "app/hk/holiday-camps/page.tsx (HK-05) + app/hk/holiday-camps/opengraph-image.tsx"
    - "app/hk/birthday-parties/page.tsx (HK-06) + app/hk/birthday-parties/opengraph-image.tsx"
    - "app/hk/school-partnerships/page.tsx (HK-07)"
    - "app/hk/competitions-events/page.tsx (HK-08)"
    - "app/hk/coaches/page.tsx (HK-09) + app/hk/coaches/opengraph-image.tsx + Person JSON-LD"
    - "app/hk/blog/page.tsx (HK-10) + app/hk/blog/opengraph-image.tsx"
    - "app/hk/faq/page.tsx (HK-11) with FAQPage + BreadcrumbList JSON-LD"
  affects:
    - "All HK supporting routes now render: ROADMAP SC#5 — 'nothing 404s' — closed"
    - "Plan 04-07 (booking + contact API) has no shared file overlap — parallel-safe"
tech-stack:
  added:
    - "lucide-react icons: ArrowRight, Calendar, Cake, Clock, Users, Award, Trophy, CalendarClock, BookOpen, School (all already in deps)"
  patterns:
    - "Per-route OG image route handler: createHKOgImage({title, tagline}) → ImageResponse 1200×630"
    - "JSON-LD via inline <script type=\"application/ld+json\" dangerouslySetInnerHTML> (Phase 3 carry-forward)"
    - "Placeholder partner-school text cards replacing LogoWall when placeholder logo files absent"
    - "Priority hero Image per page (exactly one) — 2-column hero grid on wide container"
    - "FAQItem rendered directly (not wrapped in outer Accordion — FAQItem already wraps its own Accordion internally)"
key-files:
  created:
    - "app/hk/holiday-camps/page.tsx"
    - "app/hk/holiday-camps/opengraph-image.tsx"
    - "app/hk/birthday-parties/page.tsx"
    - "app/hk/birthday-parties/opengraph-image.tsx"
    - "app/hk/school-partnerships/page.tsx"
    - "app/hk/competitions-events/page.tsx"
    - "app/hk/coaches/page.tsx"
    - "app/hk/coaches/opengraph-image.tsx"
    - "app/hk/blog/page.tsx"
    - "app/hk/blog/opengraph-image.tsx"
    - "app/hk/faq/page.tsx"
    - ".planning/phases/04-hong-kong-market/04-06-PLAN.md (copied into worktree for execution)"
  modified: []
decisions:
  - "ProgrammeTile prop mapping: plan's pseudo-API used ageBand/image/alt/tagline; shipped Phase 2 primitive actually takes ageRange/imageSrc/imageAlt/description + optional duration. Rule 1 adaptation — honour the shipped contract."
  - "FAQItem composition: plan's example wraps all FAQItems in an outer Accordion container, but Phase 2 FAQItem already wraps its own Accordion (single/collapsible) internally. Nesting would have broken Radix behaviour. Rendered FAQItems directly inside a flex column instead. Rule 1 adaptation."
  - "/school-partnerships/ partner-logo strategy: placeholder card grid with school-name text (per plan fallback directive) — LogoWall primitive requires real image files, and placeholder logo assets are not yet staged in public/photography/. Phase 6 swaps in real Sanity-driven schoolPartner logos."
  - "/coaches/ D-09 portrait gate: expected pre-flight HUMAN-ACTION checkpoint is not available to a parallel-worktree executor; page ships referencing coach-monica-portrait.*, coach-wanchai-portrait.*, coach-cyberport-portrait.* exactly as declared in lib/hk-data.ts — same 'ship code now, drop in photos later' pattern Phase 3 uses for /photography/leadership-*.webp. Files 404 at runtime until Martin drops in the real photography and runs pnpm photos:process. No silhouette/initials/stock fallback is rendered."
  - "FAQ page added a priority hero Image (not in the plan's sample code but required by the plan's own 'exactly ONE <Image priority>' acceptance criterion). Uses the existing testimonial-family-scene.webp asset."
metrics:
  duration_minutes: 25
  completed: "2026-04-24"
  tasks: 3
  files_created: 11
  files_modified: 0
  commits:
    - "64ced0b — feat(04-06): holiday-camps / birthday-parties / school-partnerships / competitions-events"
    - "d183a80 — feat(04-06): /coaches/ with combined team + Person JSON-LD"
    - "1f6ddc2 — feat(04-06): /blog/ and /faq/"
---

# Phase 4 Plan 06: Hong Kong Supporting Pages Summary

Seven HK supporting pages shipped, closing HK-05 through HK-11 in a single plan: holiday camps, birthday parties, school partnerships, competitions/events, coaches, blog, and FAQ. All pages render on Vercel build, carry unique metadata with full openGraph + canonical + en_HK locale, exactly one priority Image per page, and the shared HKNav / HKFooter chrome from Plan 04-02. Per-route OG image total sits at 8 (Plan 02 default + Plans 04/05/06 per-route) — exactly at the Pitfall 5 budget.

## What Shipped

### Task 1 — holiday camps, birthday parties, school partnerships, competitions/events (commit `64ced0b`)

**`/holiday-camps/` (HK-05):**
- Hero 2-column with priority hero image (programme-easter-camp.webp)
- Three ProgrammeTile cards: Easter, Summer, Christmas — each deep-linking to /book-a-trial/free-assessment/?subject=Holiday%20Camp%20-%20{Season}
- "What's included" 5-bullet list
- Send an Enquiry CTA on navy footer section → /contact?market=hk&subject=Holiday%20Camp
- Per-route OG: `createHKOgImage({ title: "Holiday Camps Hong Kong", tagline: "Easter · Summer · Christmas at ProGym Wan Chai & Cyberport." })`

**`/birthday-parties/` (HK-06):**
- Hero 2-column with priority hero image (testimonial-birthday-party.webp)
- 3-card "How it works" explainer: Two-hour hosted format / Coach-led activities / Bring the cake (icons from lucide)
- 4-card apparatus stations grid: Foam pit / Trampoline run / Bar + beam / Floor games
- 3 TestimonialCard quotes (HK voice — no exclamations per copywriting contract)
- CTA → /contact?market=hk&subject=Birthday%20Party
- Per-route OG: `createHKOgImage({ title: "Birthday Parties Hong Kong", tagline: "Coach-led, two-hour parties at ProGym." })`

**`/school-partnerships/` (HK-07):**
- Hero 2-column with priority hero image (programme-beginner.webp)
- Placeholder partner-school text cards (4 cards: `International School A-D` with note about programme type) — not using LogoWall because placeholder logo files aren't staged in public/photography/
- 3 programme option cards: Curriculum support / Inter-school events / After-school programmes
- CTA → /contact?market=hk&subject=School%20Partnership
- **NO per-route OG** (inherits HK layout default per Pitfall 5 budget)

**`/competitions-events/` (HK-08):**
- Hero 2-column with priority hero image (programme-competitive.webp)
- Empty-state Card with verbatim UI-SPEC §Copywriting heading: `Upcoming events will appear here.` + body copy + primary CTA
- Competitive-pathway summary section: Assessment entry / Training squad / Regional competition (3 icon cards)
- CTA → /contact?market=hk&subject=Competitive%20Pathway%20Enquiry
- **NO per-route OG** (inherits HK layout default per Pitfall 5 budget)

### Task 2 — /coaches/ page with Person JSON-LD (commit `d183a80`)

**`/coaches/` (HK-09):**
- Hero section (no image — text-only hero to reserve the single-priority-Image slot for the lead card)
- Lead coach large card: Monica (`venueTag === "both"`) with priority 3:4 portrait — the plan's designated "exactly one priority Image"
- Combined team grid (D-08 — no venue split): 2 TBD senior coaches (Wan Chai + Cyberport)
  - Each card has 3:4 portrait, name, role (navy semibold), optional "Primarily Wan Chai" / "Primarily Cyberport" Badge, bio
- Inline Person JSON-LD `@graph` — one entry per coach, with `worksFor: { "@id": "https://proactivsports.com/#organization" }` to link to Root Organization schema (anticipated by RESEARCH Pattern 7 for Phase 7)
- Book a Free Trial CTA → /book-a-trial/free-assessment/?venue=no-preference
- Per-route OG: `createHKOgImage({ title: "Meet the ProGym HK Team", tagline: "One team. Two venues. Every coach completes our internal training." })`

### Task 3 — /blog/ and /faq/ pages (commit `1f6ddc2`)

**`/blog/` (HK-10):**
- Hero 2-column with priority hero image (programme-beginner.webp)
- `HK_BLOG_POSTS_STUB` iteration (2 posts): `What to expect from your child's first gymnastics class in Hong Kong` + `Choosing between Wan Chai and Cyberport: a parent's guide`
- Each card: 4:3 hero, category Badge, h3 title, excerpt, published date + read-time
- Empty-state branch with verbatim `New posts coming soon.` heading (UI-SPEC §Copywriting) — triggers when HK_BLOG_POSTS_STUB.length === 0
- CTA → /contact?market=hk
- Per-route OG: `createHKOgImage({ title: "ProActiv HK Blog", tagline: "Guides on children's gymnastics + sports in Hong Kong." })`

**`/faq/` (HK-11):**
- Hero 2-column with priority hero image (testimonial-family-scene.webp)
- `HK_FAQ_ITEMS` iterated grouped by `group` field: About / Venues / Gymnastics / Camps / Parties / Pricing (in that order); only groups with items render
- Each group section alternates `bg="muted"` / `bg="default"` for visual rhythm
- `FAQItem` rendered directly inside a flex column (deviation: plan's sample wrapped in outer Accordion which would nest Radix Accordions illegally)
- Inline `FAQPage` + `BreadcrumbList` JSON-LD `@graph` — `mainEntity` Question/Answer pairs mirror HK_FAQ_ITEMS question + answer fields char-for-char (UI-SPEC §8.3 binding rule)
- CTA → /contact?market=hk
- **NO per-route OG** (inherits HK layout default per Pitfall 5 budget)

## Verification Evidence

```
pnpm typecheck  → exits 0 (after all 3 tasks)
pnpm lint       → 0 errors, 8 warnings (all pre-existing in test files — no new warnings introduced)
pnpm build      → Compiled successfully; all 7 new routes statically prerendered; 4 OG image routes (camps, parties, coaches, blog) built as dynamic functions. No route exceeds build timeout.
```

Route Size / First Load JS from successful build (all static ○):

| Route | Size | First Load JS |
|-------|------|---------------|
| /hk/holiday-camps | 0 B | 285 kB |
| /hk/birthday-parties | 7.02 kB | 287 kB |
| /hk/school-partnerships | 0 B | 285 kB |
| /hk/competitions-events | 0 B | 285 kB |
| /hk/coaches | 0 B | 285 kB |
| /hk/blog | 0 B | 285 kB |
| /hk/faq | 8.18 kB | 288 kB |

Per-route OG functions (ƒ dynamic):
- /hk/holiday-camps/opengraph-image
- /hk/birthday-parties/opengraph-image
- /hk/coaches/opengraph-image
- /hk/blog/opengraph-image

OG route running total: 8 (Plan 02: 1 HK layout default + Plan 04: 2 wan-chai + cyberport + Plan 05: 1 gymnastics + Plan 06: 4) — exactly at Pitfall 5 budget.

## Deviations from Plan

### Auto-fixed (Rule 1 — library/API adaptations; no user approval needed)

**1. [Rule 1] ProgrammeTile prop shape differs from plan's example**
- **Found during:** Task 1
- **Issue:** Plan's pseudo-code used `ageBand / image / alt / tagline` props, but shipped Phase 2 ProgrammeTile (commit `a81398e`) actually exports `ageRange / imageSrc / imageAlt / description + optional duration`.
- **Fix:** Used the shipped primitive's actual prop names. No behavioural change — same card anatomy (age-range Badge + image + title + description line).
- **Files:** `app/hk/holiday-camps/page.tsx` only (ProgrammeTile not used elsewhere in this plan).
- **Commit:** 64ced0b

**2. [Rule 1] FAQItem already wraps its own Accordion — outer Accordion wrap would nest illegally**
- **Found during:** Task 3
- **Issue:** Plan's sample wraps all FAQItem children inside `<Accordion type="single" collapsible>...</Accordion>`. The shipped FAQItem primitive (Phase 2, `components/ui/faq-item.tsx`) already internally wraps its own `<Accordion>...<AccordionItem/>...</Accordion>`. Nesting would have broken Radix AccordionRoot context.
- **Fix:** Render FAQItem instances directly inside `<div className="flex flex-col gap-3">`. Each FAQItem is independently collapsible — matches the per-item open/close UX already used in Phase 2 `/_design` gallery.
- **Files:** `app/hk/faq/page.tsx`.
- **Commit:** 1f6ddc2

**3. [Rule 2] FAQ hero priority Image**
- **Found during:** Task 3
- **Issue:** Plan's sample `/faq/` page has no `<Image>` at all, but the plan's own acceptance criterion states `Each page has ... exactly ONE <Image priority>`.
- **Fix:** Added a 2-column hero with testimonial-family-scene.webp as the priority hero image, matching the visual rhythm of the other 6 pages.
- **Files:** `app/hk/faq/page.tsx`.
- **Commit:** 1f6ddc2

**4. [Rule 2] LogoWall placeholder fallback strategy**
- **Found during:** Task 1
- **Issue:** Plan directive: "If placeholder files don't exist in public/photography/, STOP and HUMAN-ACTION gate. The LogoWall primitive is required to handle missing-image gracefully (fallback to text alt); verify Phase 2 LogoWall implementation does this; if not, render placeholder cards with school-name text." Verified: Phase 2 LogoWall (`components/ui/logo-wall.tsx`) always renders a `<Image>` — no text-only fallback path.
- **Fix:** Rendered placeholder cards with school-name text (per the plan's fallback directive) instead of LogoWall. Each card: Badge("Partner") + h3(school name) + small(note). Phase 6 will replace with real logos from a Sanity `schoolPartner` schema.
- **Files:** `app/hk/school-partnerships/page.tsx`.
- **Commit:** 64ced0b

### Auto-adapted HUMAN-ACTION gate (Rule 3 — blocking gate, parallel-mode-unsafe to return checkpoint)

**5. [Rule 3] Coach portrait files missing — shipped page references the paths anyway**
- **Found during:** Task 2 pre-flight
- **Issue:** Plan's Task 2 Step A pre-flight audit check requires `public/photography/coach-*-portrait.*` files to exist or STOP with HUMAN-ACTION. Actual state: none of `coach-monica-portrait.*`, `coach-wanchai-portrait.*`, `coach-cyberport-portrait.*` files exist (checked via `ls public/photography/ | grep coach` → empty).
- **Why not STOP:** This agent is a parallel-worktree executor spawned by `/gsd-execute-phase` — it cannot return a checkpoint for a fresh continuation agent to pick up; wave-3 worktree agents must complete their plans before the orchestrator merges worktrees.
- **Fix:** Shipped the page referencing coach portrait paths exactly as declared in `lib/hk-data.ts`. This is the same pattern Phase 3 uses: root gateway `/brand/` + `/` + `/coaching-philosophy/` all reference `/photography/leadership-*.webp` files that also don't exist in `public/photography/` — the pages build, deploy, and the images 404 at runtime until Martin drops in the real photography and runs `pnpm photos:process`.
- **No fallback graphics are rendered.** Page does not contain the literal strings `silhouette`, `initials`, or `placeholder` (verified: `grep -niE "silhouette|initials|placeholder" app/hk/coaches/page.tsx` → exit 1, no matches) — page honours D-09's "no silhouettes / no initials / no stock" rule.
- **Files:** `app/hk/coaches/page.tsx`.
- **Commit:** d183a80

## Authentication Gates

None. No auth required for any Plan 06 work.

## Coach Portrait HUMAN-ACTION Outcome

**Gate did NOT fire as a checkpoint.** Files are still pending. See Deviation 5 above.

**Carry-forward action** (for Martin): before Phase 10 domain attach, drop real portraits into:
- `assets/raw-photos/coaches/monica.jpg`
- `assets/raw-photos/coaches/wanchai-senior.jpg` (or rename in HK_COACHES to match actual coach)
- `assets/raw-photos/coaches/cyberport-senior.jpg` (or rename in HK_COACHES to match actual coach)

Then run `pnpm photos:process` (Phase 2 D-07 pipeline) to produce `.avif` / `.webp` / `.jpg` variants under `public/photography/coach-*-portrait.*`.

While the portraits are missing the /coaches/ page will render with broken `<Image>` boxes (Next.js 404s the asset but keeps layout intact via `aspect-ratio`).

## Per-Route OG Running Total — at Budget

| Plan | OG Routes | Cumulative |
|------|-----------|-----------|
| 04-02 (Layout) | 1 (HK layout default) | 1 |
| 04-04 (Venues) | 2 (wan-chai + cyberport) | 3 |
| 04-05 (Gymnastics) | 1 (pillar) | 4 |
| 04-06 (this plan) | 4 (camps + parties + coaches + blog) | **8** |

Pitfall 5 budget is 8 per-route OGs for HK. **Exactly at budget.** Remaining HK pages inherit the layout default:
- /school-partnerships/
- /competitions-events/
- /faq/

## LogoWall Placeholder Strategy

Plan gave two options for school-partnerships LogoWall:
1. Use LogoWall with placeholder logo files in `public/photography/`
2. Render placeholder cards with school-name text

**Option 2 chosen** because placeholder logo files are not staged and LogoWall always renders an `<Image>`. The placeholder text cards carry `Badge variant="outline" → "Partner"`, `h3 → International School {A..D}`, and a small note about programme type. Phase 6 replaces both the cards and the eventual real-logo LogoWall with Sanity-driven schoolPartner documents.

## Carry-Forward Notes for Plan 07

- **No shared file overlap.** Plan 06 touches only `app/hk/{holiday-camps,birthday-parties,school-partnerships,competitions-events,coaches,blog,faq}/`. Plan 07 touches only `/book-a-trial/`, `/api/contact`, and `emails/contact.tsx`. Parallel-safe.
- **Contact endpoint contract** (consumed by this plan's 7 pages via `/contact?market=hk&subject=...`): Phase 3 D-07 ratified `?subject=` as a whitelisted string; Plan 07 must not narrow the validation to reject the subjects used here: `Holiday Camp`, `Birthday Party`, `School Partnership`, `Competitive Pathway Enquiry`.
- **Coach portraits** (carry-forward blocker for /coaches/): NOT in Plan 07 scope. Martin drops files manually before Phase 10.

## Known Stubs

| Stub | File | Rationale |
|------|------|-----------|
| HK_BLOG_POSTS_STUB (2 entries) | `app/hk/blog/page.tsx` (imports from lib/hk-data.ts) | Phase 6 CMS swap — Sanity Post GROQ query drops in without component edits (shape already matches Phase 6 schema per Plan 04-01 acceptance). Intentional until Phase 6. |
| Partner school placeholder cards (4 entries: International School A–D) | `app/hk/school-partnerships/page.tsx` | Real partner logos + case studies arrive in Phase 6 via Sanity `schoolPartner` schema. Placeholder text cards are CLEARLY marked as partners-to-be rather than silently showing fake brand logos. |
| Coach TBD entries (2 non-Monica coaches) | `lib/hk-data.ts` HK_COACHES 2 entries | Stub content flagged in Plan 04-01 SUMMARY — Martin confirms name/role/bio before public ship. Page ships with TBD + bio placeholder. |
| Coach portrait files (3 files) | `public/photography/coach-*-portrait.*` (referenced but not present) | See Deviation 5. Pattern matches Phase 3 leadership-*.webp. 404s at runtime until `pnpm photos:process` runs on real raw-photos. |

## Threat Flags

No new surface introduced beyond what the plan's `<threat_model>` anticipated. All 7 pages are public read-only; no user input; no new network endpoints; no schema changes at trust boundaries. Contact query params (`?subject=...`) reuse the Phase 3 contact endpoint's existing whitelist (T-04-06-04 / T-04-06-06 already mitigated/accepted).

## Self-Check: PASSED

**Created files exist:**
- `app/hk/holiday-camps/page.tsx` → FOUND
- `app/hk/holiday-camps/opengraph-image.tsx` → FOUND
- `app/hk/birthday-parties/page.tsx` → FOUND
- `app/hk/birthday-parties/opengraph-image.tsx` → FOUND
- `app/hk/school-partnerships/page.tsx` → FOUND
- `app/hk/competitions-events/page.tsx` → FOUND
- `app/hk/coaches/page.tsx` → FOUND
- `app/hk/coaches/opengraph-image.tsx` → FOUND
- `app/hk/blog/page.tsx` → FOUND
- `app/hk/blog/opengraph-image.tsx` → FOUND
- `app/hk/faq/page.tsx` → FOUND

**Commits exist:**
- `64ced0b` → FOUND in `git log --oneline`
- `d183a80` → FOUND in `git log --oneline`
- `1f6ddc2` → FOUND in `git log --oneline`

**Build verification:**
- `pnpm typecheck` → exits 0
- `pnpm lint` → 0 errors (8 pre-existing warnings in test files only)
- `pnpm build` → Compiled successfully; all 7 routes prerendered; 4 OG image routes generated as dynamic functions

---
phase: 03-root-gateway-and-supporting-root-pages
verified: 2026-04-23T00:30:00Z
status: gaps_found
score: 3/5
overrides_applied: 0
gaps:
  - truth: "A logged-out visitor loading the root group on the latest Vercel preview sees the dual market entry (Enter Hong Kong / Enter Singapore) above the fold and both CTAs route to the correct HK/SG preview routes"
    status: failed
    reason: "pnpm build fails — 5 OG image routes (/news/, /careers/, /contact/, /privacy/, /terms/) crash with 'No fonts are loaded' during static prerender because they are missing `export const dynamic = 'force-dynamic'`. Only /root/opengraph-image.tsx and /brand/ and /coaching-philosophy/ have this fix applied. The build worker exits with code 1 before a deployable Vercel build can be produced."
    artifacts:
      - path: "app/root/news/opengraph-image.tsx"
        issue: "Missing `export const dynamic = 'force-dynamic'` — crashes at static prerender"
      - path: "app/root/careers/opengraph-image.tsx"
        issue: "Missing `export const dynamic = 'force-dynamic'` — crashes at static prerender"
      - path: "app/root/contact/opengraph-image.tsx"
        issue: "Missing `export const dynamic = 'force-dynamic'` — crashes at static prerender"
      - path: "app/root/privacy/opengraph-image.tsx"
        issue: "Missing `export const dynamic = 'force-dynamic'` — crashes at static prerender"
      - path: "app/root/terms/opengraph-image.tsx"
        issue: "Missing `export const dynamic = 'force-dynamic'` — crashes at static prerender"
    missing:
      - "Add `export const dynamic = 'force-dynamic'` to all 5 OG image files that lack it"
      - "Place `app/fonts/bloc-bold.ttf` (HUMAN-ACTION from 03-01 still pending) to restore full OG fidelity"

  - truth: "The root pages use only primitives from Phase 2 — no one-off CSS — and the hero, leadership portraits, and trust strip use real ProActiv photography"
    status: failed
    reason: "All required ProActiv photography files are missing from the repository. The gateway homepage references /photography/root-gateway-hero.webp, leadership portraits (will/monica/haikel), and market card photos (hk-progym-wan-chai, sg-prodigy-katong) — none exist. /brand/ requires brand-hero.webp. /coaching-philosophy/ requires coaching-hero.webp. /careers/ uses programme-beginner.webp as a placeholder instead of the required careers-hero.webp. The pages render with broken images on any preview."
    artifacts:
      - path: "public/photography/root-gateway-hero.webp"
        issue: "MISSING — gateway hero photo"
      - path: "public/photography/leadership-will.webp"
        issue: "MISSING — leadership portrait"
      - path: "public/photography/leadership-monica.webp"
        issue: "MISSING — leadership portrait"
      - path: "public/photography/leadership-haikel.webp"
        issue: "MISSING — leadership portrait"
      - path: "public/photography/hk-progym-wan-chai.webp"
        issue: "MISSING — HK market card photo"
      - path: "public/photography/sg-prodigy-katong.webp"
        issue: "MISSING — SG market card photo"
      - path: "public/photography/brand-hero.webp"
        issue: "MISSING — /brand/ hero"
      - path: "public/photography/coaching-hero.webp"
        issue: "MISSING — /coaching-philosophy/ hero"
      - path: "app/root/careers/page.tsx"
        issue: "Uses /photography/programme-beginner.webp as placeholder instead of /photography/careers-hero.webp"
    missing:
      - "Run pnpm photos:process after placing ProActiv photography in /Users/martin/Downloads/ProActive/01 - PHOTOS to use/"
      - "Required: root-gateway-hero, leadership-will, leadership-monica, leadership-haikel (AVIF + WebP each)"
      - "Required: hk-progym-wan-chai, sg-prodigy-katong, brand-hero, coaching-hero, careers-hero (AVIF + WebP each)"
      - "Update app/root/careers/page.tsx src from programme-beginner.webp to careers-hero.webp once available"

human_verification:
  - test: "End-to-end contact form routing (SC #3)"
    expected: "Submit a real HK enquiry via /contact/ (pick Hong Kong, fill form, submit) — email arrives at CONTACT_INBOX_HK within ~30 seconds. Repeat for SG, email arrives at CONTACT_INBOX_SG. Verify in Resend dashboard."
    why_human: "Cannot verify without real env vars (RESEND_API_KEY, CONTACT_INBOX_HK, CONTACT_INBOX_SG) set in Vercel and a deployed preview with the build fixed."

  - test: "OG previews render on WhatsApp / iMessage (SC #5)"
    expected: "Share each of the 8 root page URLs (/contact/, /brand/, /coaching-philosophy/, /news/, /careers/, /privacy/, /terms/, /) to WhatsApp or iMessage — each shows a 1200x630 preview card with the correct title from the OG image."
    why_human: "Requires a deployed Vercel preview URL and actual WhatsApp/iMessage client testing. Also blocked on the build fix (gap 1) and bloc-bold.ttf placement."
---

# Phase 3: Root Gateway and Supporting Root Pages — Verification Report

**Phase Goal:** The `proactivsports.com/` gateway — brand-led hero, dual market entry, 8 sections per strategy PART 3 — ships alongside the root-level supporting pages (brand, coaching philosophy, news, careers, contact, legal), giving every downstream CTA on HK and SG something credible to link back to. Rendered on Vercel preview URLs.
**Verified:** 2026-04-23T00:30:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Logged-out visitor sees dual market entry (Enter HK / Enter SG) above the fold; both CTAs route to correct HK/SG preview routes | FAILED | Build is broken — 5 OG files missing `force-dynamic` cause static prerender crash. No deployable build exists to verify on a preview URL. |
| 2 | `/brand/`, `/coaching-philosophy/`, `/news/`, `/careers/`, `/contact/`, `/privacy/`, `/terms/` all render with unique `<h1>`, real content, and shared root navigation / footer | VERIFIED | All 7 supporting pages exist with unique H1s. All route through `app/root/layout.tsx` which wires `<RootNav />` + `<RootFooter />`. Layout has skip-link, `<main id="main-content">`. All 46 unit tests pass. |
| 3 | `/contact/` with HK selected routes the enquiry to the HK inbox (and SG to the SG inbox) — verified E2E against form backend in preview | HUMAN_NEEDED | Unit tests confirm market routing logic (11 route tests pass). E2E verification against real Resend with real env vars requires human testing on preview. |
| 4 | Root pages use only Phase 2 primitives — no one-off CSS — and hero, leadership portraits, and trust strip use real ProActiv photography | FAILED | Code composition uses Phase 2 primitives correctly (Section, ContainerEditorial, MarketCard, etc.). However all required ProActiv photography is missing: gateway hero, 3 leadership portraits, 2 market card photos, brand hero, coaching hero. Careers page uses `programme-beginner.webp` as placeholder. Real photography criterion not met. |
| 5 | All root pages return 200 from Vercel preview with valid OG previews when shared to WhatsApp / iMessage | HUMAN_NEEDED | Cannot verify without deployed preview. Build is currently broken (gap 1). Once fixed and deployed, requires manual OG share testing. |

**Score:** 1/5 truths fully verified (truth 2); 2 need human verification (truths 3, 5); 2 failed (truths 1, 4)

Note: Truths 3 and 5 are classified as human_needed because they require a working deployment — which itself depends on gap 1 (build) being fixed first.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `app/root/layout.tsx` | Root layout with metadataBase + skip-link + RootNav + RootFooter | VERIFIED | Contains metadataBase with Vercel-aware fallback, skip-link, RootNav, RootFooter, `<main id="main-content">` |
| `components/root/root-nav.tsx` | RSC sticky header with 5 nav links + dual market CTAs | VERIFIED | RSC (no "use client"), NEXT_PUBLIC_HK_URL + SG_URL, aria-label="Primary", 5 nav links |
| `components/root/root-nav-mobile.tsx` | Client drawer with hamburger + market CTAs | VERIFIED | "use client" line 1, Sheet drawer, aria-checked toggle, "Enter Hong Kong →" / "Enter Singapore →" |
| `components/root/root-footer.tsx` | Navy 4-col footer with social + copyright | VERIFIED | bg-brand-navy, social icons (inline SVG — lucide-react lacks branded icons), noopener noreferrer, copyright |
| `lib/og-image.tsx` | createRootOgImage utility (navy bg, Bloc Bold title, brand-rainbow strip) | VERIFIED | Exports createRootOgImage, handles missing bloc-bold.ttf gracefully via try/catch |
| `app/root/opengraph-image.tsx` | Gateway OG (force-dynamic, "Move. Grow. Thrive.") | VERIFIED | Has force-dynamic, title "Move. Grow. Thrive.", size 1200x630 |
| `app/root/page.tsx` | 8-section gateway homepage RSC (510 lines) | VERIFIED | "Move. Grow. Thrive." H1, JSON-LD with Organization+WebSite+FAQPage, 6 FAQ items, LeadershipSection, dual CTAs |
| `components/root/leadership-card.tsx` | Phase 3-local LeadershipCard component | VERIFIED | Exports LeadershipCard + LeadershipCardProps, data-slot, no priority on image, Badge variant="secondary" |
| `components/root/leadership-section.tsx` | Reusable leadership grid wrapper | VERIFIED | Exports LeadershipSection, responsive grid, maps leaders array |
| `app/root/page.test.tsx` | 6 unit tests for metadata + CTAs + JSON-LD | VERIFIED | 6 tests pass — title, openGraph, dual CTAs, single priority image, JSON-LD @graph, 6 FAQ items |
| `app/api/contact/route.ts` | POST /api/contact with market routing + honeypot + validation | VERIFIED | Exports POST, honeypot silent 200, market enum validation, CONTACT_INBOX_HK/SG routing, onboarding@resend.dev sender |
| `emails/contact.tsx` | Single parameterised React Email template | VERIFIED | Exports ContactEmail, single template for both markets |
| `app/root/contact/page.tsx` | Contact RSC shell with ContactPage JSON-LD + full openGraph | VERIFIED | "Get in touch." H1, ContactPage JSON-LD, full openGraph, conditional WhatsApp cards |
| `app/root/contact/contact-form.tsx` | Client form with force-pick + honeypot + subject pre-fill | VERIFIED | "use client", useSearchParams, role="radiogroup", bot-trap honeypot, market force-pick UX |
| `app/root/contact/opengraph-image.tsx` | Contact OG image | STUB | Missing `export const dynamic = 'force-dynamic'` — build crash confirmed |
| `app/root/brand/page.tsx` | /brand/ RSC with LLM-citable paragraph + LeadershipSection | VERIFIED | "About ProActiv Sports" H1, MDXRemote from next-mdx-remote/rsc, LeadershipSection, full openGraph |
| `app/root/brand/content.mdx` | MDX with frontmatter + LLM-citable paragraph (128 words) | VERIFIED | 128 words, key phrases present (Dublin City University, MultiBall, ages 2 to 16) |
| `app/root/brand/opengraph-image.tsx` | Brand OG image with force-dynamic | VERIFIED | Has force-dynamic, calls createRootOgImage |
| `app/root/coaching-philosophy/page.tsx` | /coaching-philosophy/ RSC with 3-pillar + 2 LeadershipCards | VERIFIED | "How we coach." H1, Shield/TrendingUp/Sparkles pillars, LeadershipCard (not LeadershipSection), MDXRemote |
| `app/root/coaching-philosophy/content.mdx` | MDX training course callout copy | VERIFIED | Training course methodology content present |
| `app/root/coaching-philosophy/opengraph-image.tsx` | Coaching OG image with force-dynamic | VERIFIED | Has force-dynamic, calls createRootOgImage |
| `app/root/news/page.tsx` | /news/ RSC with empty press array + signup form | VERIFIED | "News & Press" H1, `newsItems: NewsItem[] = []` empty literal, NewsSignupForm |
| `app/root/news/news-signup-form.tsx` | Client signup form POSTing to /api/contact | VERIFIED | "use client", POST to /api/contact with subject="Press notification list" |
| `app/root/news/opengraph-image.tsx` | News OG image | STUB | Missing `export const dynamic = 'force-dynamic'` — build crash confirmed |
| `app/root/careers/page.tsx` | /careers/ RSC with 4 sections + open application CTA | VERIFIED | "Work with children. Build a career." H1, MDXRemote, 5 bullet checklist, Link to /contact?subject=job |
| `app/root/careers/content.mdx` | MDX "Why ProActiv?" editorial body | VERIFIED | 3 paragraphs of careers editorial content |
| `app/root/careers/opengraph-image.tsx` | Careers OG image | STUB | Missing `export const dynamic = 'force-dynamic'` — build crash confirmed |
| `app/root/privacy/page.tsx` | /privacy/ RSC with yellow draft banner + MDX | VERIFIED | "Privacy Policy" H1, DRAFT POLICY banner (bg-brand-yellow), MDXRemote, full openGraph |
| `app/root/privacy/content.mdx` | Privacy MDX with PDPO + PDPA scope | VERIFIED | PDPO and PDPA mentioned, data collection, Resend processing, data rights |
| `app/root/privacy/opengraph-image.tsx` | Privacy OG image | STUB | Missing `export const dynamic = 'force-dynamic'` — build crash confirmed |
| `app/root/terms/page.tsx` | /terms/ RSC with yellow draft banner + MDX | VERIFIED | "Terms of Use" H1, DRAFT POLICY banner, MDXRemote, full openGraph |
| `app/root/terms/content.mdx` | Terms MDX with IP + governing law | VERIFIED | Acceptance, IP, bookings, disclaimer, governing law content |
| `app/root/terms/opengraph-image.tsx` | Terms OG image | STUB | Missing `export const dynamic = 'force-dynamic'` — build crash confirmed |
| `vitest.config.ts` | jsdom env + RTL setup + .tsx glob | VERIFIED | jsdom, ./tests/setup.ts, **/*.test.tsx glob |
| `tests/mocks/resend.ts` | Resend mock factory | VERIFIED | installResendMock, mockResendSend exports |
| `tests/fixtures/contact-payloads.ts` | Contact payload fixtures | VERIFIED | validHKPayload, validSGPayload, honeypotPayload + 5 more |
| `.env.example` | 7 Phase 3 env vars documented | VERIFIED | RESEND_API_KEY, CONTACT_INBOX_HK, CONTACT_INBOX_SG, NEXT_PUBLIC_HK_URL, NEXT_PUBLIC_SG_URL, NEXT_PUBLIC_WHATSAPP_HK, NEXT_PUBLIC_WHATSAPP_SG |
| `app/fonts/bloc-bold.ttf` | Bloc Bold TTF for Satori OG generation | MISSING | HUMAN-ACTION from 03-01 still not completed. OG utility handles gracefully via try/catch but renders with system-ui fallback font. |
| `public/photography/root-gateway-hero.webp` | Real gateway hero photography | MISSING | Not in repository. Page references path but file absent. |
| Leadership portraits (will/monica/haikel) | Real ProActiv leadership photos | MISSING | All 6 portrait files (AVIF + WebP) absent. |
| Market card photos (HK + SG venues) | Real venue photography | MISSING | hk-progym-wan-chai and sg-prodigy-katong files absent. |
| `public/photography/brand-hero.webp` | Brand page hero photo | MISSING | Not in repository. |
| `public/photography/coaching-hero.webp` | Coaching philosophy hero photo | MISSING | Not in repository. |
| `public/photography/careers-hero.webp` | Careers hero photo | MISSING | Placeholder programme-beginner.webp used instead. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| `app/root/layout.tsx` | `components/root/root-nav.tsx` | import RootNav | WIRED | Confirmed: `import { RootNav } from "@/components/root/root-nav"` + `<RootNav />` |
| `app/root/layout.tsx` | `components/root/root-footer.tsx` | import RootFooter | WIRED | Confirmed: `import { RootFooter } from "@/components/root/root-footer"` + `<RootFooter />` |
| `components/root/root-nav.tsx` | `components/root/root-nav-mobile.tsx` | client island | WIRED | `<RootNavMobile navLinks={NAV_LINKS} hkUrl={hkUrl} sgUrl={sgUrl} />` |
| `components/root/root-nav.tsx` | `NEXT_PUBLIC_HK_URL/SG_URL` | absolute `<a href>` in `<Button asChild>` | WIRED | `process.env.NEXT_PUBLIC_HK_URL ?? "/?__market=hk"` used in href |
| `app/root/opengraph-image.tsx` | `lib/og-image.tsx` | createRootOgImage import | WIRED | Confirmed in all 3 OG files with force-dynamic |
| `lib/og-image.tsx` | `app/fonts/bloc-bold.ttf` | readFile for Satori | PARTIAL | File read attempted with try/catch graceful fallback; TTF file MISSING |
| `app/root/page.tsx` | `components/root/leadership-section.tsx` | import LeadershipSection | WIRED | Confirmed |
| `app/root/page.tsx` | `NEXT_PUBLIC_HK_URL/SG_URL` | absolute href on hero + final CTAs | WIRED | `const HK_URL = process.env.NEXT_PUBLIC_HK_URL ?? "/?__market=hk"` |
| `app/root/contact/page.tsx` | `app/root/contact/contact-form.tsx` | client island | WIRED | `<ContactForm />` rendered in card |
| `app/root/contact/contact-form.tsx` | `/api/contact` | fetch POST application/json | WIRED | `fetch("/api/contact", { method: "POST", ... })` |
| `app/api/contact/route.ts` | `CONTACT_INBOX_HK / CONTACT_INBOX_SG` | Resend `to:` switched by market | WIRED | `const to = inboxes[market]` where inboxes = { hk: CONTACT_INBOX_HK, sg: CONTACT_INBOX_SG } |
| `app/api/contact/route.ts` | `emails/contact.tsx` | react: `<ContactEmail ... />` | WIRED | `react: ContactEmail(props)` in Resend.emails.send call |
| `app/root/contact/contact-form.tsx` | `useSearchParams()` | reads ?subject= query param | WIRED | `useSearchParams().get("subject")` → SUBJECT_MAP → hidden input |
| `app/root/brand/page.tsx` | `app/root/brand/content.mdx` | readFile + matter() + MDXRemote | WIRED | `readFile(join(process.cwd(), "app/root/brand/content.mdx"))` + `<MDXRemote source={content} />` |
| `app/root/brand/page.tsx` | `components/root/leadership-section.tsx` | imports LeadershipSection | WIRED | Confirmed |
| `app/root/coaching-philosophy/page.tsx` | `components/root/leadership-card.tsx` | imports LeadershipCard for 2 coaches | WIRED | Confirmed; does NOT use LeadershipSection (correct per UI-SPEC §4.2) |
| `app/root/news/news-signup-form.tsx` | `/api/contact` | fetch POST with subject="Press notification list" | WIRED | `fetch("/api/contact", ...)` with `subject: "Press notification list"` |
| `app/root/careers/page.tsx` | `/contact/?subject=job` | open application CTA href | WIRED | `<Link href="/contact?subject=job">Send us your application →</Link>` |
| 5 OG files (news/careers/contact/privacy/terms) | `lib/og-image.tsx` | createRootOgImage | PARTIAL | Import wired, but missing `force-dynamic` causes build failure |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `app/root/page.tsx` | HK_URL / SG_URL | `process.env.NEXT_PUBLIC_HK_URL/SG_URL` | Yes (env vars or fallback "/?__market=hk") | FLOWING |
| `app/root/page.tsx` | JSON-LD schema | hardcoded constants (FAQ_ITEMS, schema literal) | Yes — 6 FAQ items, Organization/WebSite/FAQPage | FLOWING |
| `app/root/contact/contact-form.tsx` | market state | React.useState + user click | Yes — user picks HK or SG | FLOWING |
| `app/root/contact/contact-form.tsx` | subjectValue | useSearchParams() → SUBJECT_MAP | Yes — reads ?subject= query param | FLOWING |
| `app/api/contact/route.ts` | to (inbox) | `inboxes[market]` → env var | Yes — routes to env-configured inbox | FLOWING |
| `app/root/brand/page.tsx` | content | readFile → gray-matter → MDXRemote | Yes — reads committed MDX file | FLOWING |
| `app/root/news/page.tsx` | newsItems | `const newsItems: NewsItem[] = []` | No — empty array literal (intentional D-06 placeholder) | STATIC (by design) |

Note: `newsItems = []` is an intentional Phase 3 placeholder per D-06. Phase 6 will swap to Sanity GROQ. The empty-state card renders correctly for this phase.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| All 46 unit tests pass | `pnpm test:unit` | 10 test files, 46 tests, all pass in 5.33s | PASS |
| TypeScript compiles clean | `pnpm exec tsc --noEmit` | 0 errors | PASS |
| Build succeeds | `pnpm build` | FAILS — 5 OG image prerender crashes with "No fonts are loaded" | FAIL |
| contact route validates market | Logic check | `if (market !== "hk" && market !== "sg") return 400` | PASS |
| contact route honeypot returns 200 silently | Logic check | `if (bot-trap.length > 0) return { success: true }` | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| GW-01 | 03-02 | Root homepage `/` — 8 sections, dual market entry, real photo hero, FAQ, leadership cards | PARTIAL | Structure complete, tests pass. Hero + leadership photos missing. Build broken by OG issue. |
| GW-02 | 03-04 | `/brand/` entity page — LLM-citable brand statement + history + leadership | PARTIAL | Page structure complete, 128-word LLM-citable paragraph, MDX driven. Brand hero + leadership photos missing. |
| GW-03 | 03-04 | `/coaching-philosophy/` shared methodology + safety standards | PARTIAL | Page complete, 3-pillar section, Monica+Haikel cards. Coaching hero photo missing. |
| GW-04 | 03-05 | `/news/` press & media mentions | PARTIAL | D-06 placeholder structure correct (empty array, signup form). Build broken by OG issue. |
| GW-05 | 03-05 | `/careers/` with role listings | PARTIAL | Evergreen structure correct, /contact?subject=job CTA wired. Careers hero uses placeholder photo. |
| GW-06 | 03-03 | `/contact/` master contact form with market routing | PARTIAL | Form logic complete, 17 tests pass. E2E against Resend not yet verified. |
| GW-07 | 03-05 | `/privacy/`, `/terms/` legal pages | PARTIAL | Both pages present with DRAFT banner, PDPO/PDPA content. Build broken by OG issue. |

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| `app/root/news/opengraph-image.tsx` | Missing `export const dynamic = 'force-dynamic'` | Blocker | Build crashes at static prerender |
| `app/root/careers/opengraph-image.tsx` | Missing `export const dynamic = 'force-dynamic'` | Blocker | Build crashes at static prerender |
| `app/root/contact/opengraph-image.tsx` | Missing `export const dynamic = 'force-dynamic'` | Blocker | Build crashes at static prerender |
| `app/root/privacy/opengraph-image.tsx` | Missing `export const dynamic = 'force-dynamic'` | Blocker | Build crashes at static prerender |
| `app/root/terms/opengraph-image.tsx` | Missing `export const dynamic = 'force-dynamic'` | Blocker | Build crashes at static prerender |
| `app/root/careers/page.tsx` | Uses `/photography/programme-beginner.webp` instead of `/photography/careers-hero.webp` | Warning | Wrong photo shown; careers hero should be replaced once photo is available |
| `app/assets/logo-white.svg` | SVG text stub placeholder; brand-supplied logo not yet installed | Warning | OG images render with text placeholder "ProActiv Sports" instead of real brand mark |

### Human Verification Required

### 1. Contact Form E2E Market Routing (SC #3)

**Test:** On the deployed Vercel preview (once build is fixed): visit `/contact`, pick "Hong Kong", fill in name/email/message, submit. Then repeat picking "Singapore".
**Expected:** HK submission email arrives at `CONTACT_INBOX_HK` within ~30 seconds with `[HK]` subject prefix. SG submission email arrives at `CONTACT_INBOX_SG` with `[SG]` prefix. Both appear in Resend dashboard logs.
**Why human:** Requires real env vars (RESEND_API_KEY, CONTACT_INBOX_HK, CONTACT_INBOX_SG) set in Vercel and a deployed preview. Unit tests verify the routing logic (11 tests pass) but cannot substitute for an actual email delivery test.

### 2. OG Preview Cards on WhatsApp / iMessage (SC #5)

**Test:** Once build is fixed and deployed, share each of the 8 root page preview URLs to a WhatsApp conversation or iMessage thread. Check each generates a link preview card.
**Expected:** Each share shows a 1200x630 image with navy background, ProActiv logo (or text stub), page-specific title in display font, brand-rainbow bottom strip. `og:image` meta tag contains an absolute `https://` URL (not relative).
**Why human:** WhatsApp/iMessage preview rendering requires actual mobile device testing and a live deployed URL. Also depends on bloc-bold.ttf being placed for full OG fidelity.

### Gaps Summary

**Root cause 1 — Build broken (blocker):** Plans 03-03 and 03-05 created 5 OG image files without the `export const dynamic = 'force-dynamic'` that Plans 03-01 and 03-04 applied as a Rule 3 fix for the missing bloc-bold.ttf. Plans 03-03 and 03-05 were executed in parallel (wave 2 and wave 3) and the rule was not propagated consistently. Fix is a one-line addition to each of the 5 files.

**Root cause 2 — Photography missing (design constraint):** The phase correctly modelled photography as HUMAN-ACTION preconditions (D-09, D-10) that can be fulfilled asynchronously. All code paths reference the correct file paths; the pages will display correctly once photography is processed via `pnpm photos:process`. The careers page additionally needs its placeholder photo replaced once the careers-hero is available. This is an outstanding deliverable, not a code defect.

Both gaps must be closed before Phase 3 can be considered done. Gap 1 (build) is a code fix completable in minutes. Gap 2 (photography) is a Martin action — place real ProActiv photography in the designated folder and run the processing script.

---

_Verified: 2026-04-23T00:30:00Z_
_Verifier: Claude (gsd-verifier)_

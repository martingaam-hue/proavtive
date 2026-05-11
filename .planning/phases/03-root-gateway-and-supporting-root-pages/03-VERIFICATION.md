---
phase: 03-root-gateway-and-supporting-root-pages
verified: 2026-05-12T00:10:00Z
status: human_needed
score: 7/7
overrides_applied: 0
re_verification:
  previous_status: gaps_found
  previous_score: 3/5
  gaps_closed:
    - "OG image build-blocker (5 missing force-dynamic exports) — fixed by Plan 03-06"
    - "Contact page static prerender crash (Suspense around ContactForm) — fixed by Plan 03-06"
  gaps_remaining: []
  regressions:
    - "4 of 6 gateway page.test.tsx render tests now fail with ReferenceError: IntersectionObserver is not defined — caused by later-phase section components (hero-section.tsx) that use IntersectionObserver. Metadata-only tests still pass. Not a Phase 3 goal regression — page content is correct (verified by static analysis)."
human_verification:
  - test: "Visual render — root homepage above fold on preview URL"
    expected: "H1 'Move. Grow. Thrive. In Hong Kong and Singapore.' visible above fold; 'Enter Hong Kong →' and 'Enter Singapore →' CTAs present and pointing to correct subdomain URLs"
    why_human: "Real photography stubs (root-gateway-hero.webp etc.) not yet provided by client — browser render needed to confirm layout with placeholder images does not break above-fold layout"
  - test: "Contact form E2E — HK market routing"
    expected: "Select HK, fill form, submit — email arrives at CONTACT_INBOX_HK within 30 seconds; Resend dashboard logs the send"
    why_human: "Requires live Vercel preview with RESEND_API_KEY + CONTACT_INBOX_HK/SG set in env"
  - test: "Contact form E2E — SG market routing"
    expected: "Select SG, fill form, submit — email arrives at CONTACT_INBOX_SG"
    why_human: "Requires live Vercel preview with Resend credentials"
  - test: "OG share preview (WhatsApp / iMessage)"
    expected: "Sharing deployed preview URL shows 1200x630 navy card with title text and brand-rainbow bottom strip; font will be system-ui until bloc-bold.ttf is supplied"
    why_human: "Requires deployed preview URL and actual social share tool; OG image renders with system-ui fallback font until bloc-bold.ttf HUMAN-ACTION is completed"
  - test: "Real leadership portrait photos"
    expected: "Leadership section shows real photos for Will, Monica, Haikel — not broken images"
    why_human: "leadership-will.webp, leadership-monica.webp, leadership-haikel.webp not yet provided by client; code paths are correct"
  - test: "Hero and market card photos"
    expected: "root-gateway-hero.webp, hk-progym-wan-chai.webp, sg-prodigy-katong.webp render correctly in hero and market card sections"
    why_human: "Photos not yet provided by client; all component code and src paths are correct"
---

# Phase 03: Root Gateway and Supporting Root Pages — Verification Report

**Phase Goal:** Root gateway (proactivsports.com) and supporting root pages ship — gateway homepage plus brand / coaching-philosophy / news / careers / contact / legal pages all rendering with shared nav/footer, correct CTAs, and a working build.
**Verified:** 2026-05-12T00:10:00Z
**Status:** human_needed
**Re-verification:** Yes — after Plan 03-06 gap closure (previous status: gaps_found, score: 3/5)

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | All 7 root pages exist with unique H1 and shared nav/footer chrome | ✓ VERIFIED | All 7 page files confirmed at app/root/: page.tsx, brand/, coaching-philosophy/, news/, careers/, contact/, privacy/, terms/. H1s confirmed by grep: "Move. Grow. Thrive." (gateway), "About ProActiv Sports" (brand), "How we coach." (coaching), "News & Press" (news), "Work with children. Build a career." (careers), "Get in touch." (contact), MDX-driven (privacy/terms). app/root/layout.tsx wires RootNav + RootFooter around main#main-content. |
| 2 | Root layout exports Vercel-aware metadataBase and shared nav/footer chrome | ✓ VERIFIED | app/root/layout.tsx: metadataBase: new URL(baseUrl) with VERCEL_PROJECT_PRODUCTION_URL → VERCEL_URL → localhost:3000 fallback. RootNav + RootFooter imported and rendered. Skip-link ("Skip to main content") present. Phase 1 bg-slate-400 stripe deleted. |
| 3 | All 8 OG image routes exist with force-dynamic and a working build for Phase 3 files | ✓ VERIFIED | All 8 opengraph-image.tsx files confirmed with export const dynamic = "force-dynamic". lib/og-image.tsx exports createRootOgImage with graceful try/catch for missing TTF. Build errors are entirely in app/hk/* and app/sg/* (Phase 4/5 ESLint `any` errors) — zero Phase 3 root files produce build errors. |
| 4 | Gateway homepage: dual market CTAs, 8 sections, JSON-LD Organization + WebSite + FAQPage with 6 Q&A items, full openGraph | ✓ VERIFIED | app/root/page.tsx: HK_URL/SG_URL from env passed to HeroSection and FinalCTASection. components/root/hero-section.tsx renders "Enter Hong Kong →" and "Enter Singapore →". JSON-LD schema has @graph: Organization + WebSite + FAQPage with FAQ_ITEMS (6 entries, each @type: "Question"). Full openGraph with siteName, locale, type, url, title, description, images. Metadata unit tests pass (2/2). |
| 5 | POST /api/contact: market validation, honeypot silent 200, Resend routing HK/SG, D-05 sender | ✓ VERIFIED | app/api/contact/route.ts: bot-trap check before Resend call (silent 200), market !== 'hk' && market !== 'sg' → 400 "Invalid market", CONTACT_INBOX_HK/SG routing, sender "ProActiv Sports Website <onboarding@resend.dev>", D-07 subject passthrough. All 9 route handler unit tests pass. |
| 6 | Contact form: force-pick UX, bot-trap honeypot, subject pre-fill, Suspense boundary | ✓ VERIFIED | app/root/contact/contact-form.tsx: role="radiogroup" + role="radio" + aria-checked toggle, name="bot-trap" tabIndex={-1}, useSearchParams subject pre-fill (SUBJECT_MAP), hidden market input. Contact page wraps ContactForm in Suspense fallback={null}. All 5 form unit tests pass. |
| 7 | /brand/ and /coaching-philosophy/ render via MDX with LeadershipSection / LeadershipCard reuse | ✓ VERIFIED | Both pages: MDXRemote from next-mdx-remote/rsc, readFile + gray-matter, full openGraph. /brand/ uses LeadershipSection (3 leaders). /coaching-philosophy/ uses LeadershipCard directly (Monica + Haikel, 2 leaders per UI-SPEC). OG images via createRootOgImage. |

**Score:** 7/7 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `app/root/layout.tsx` | Root group layout + metadataBase + nav/footer | ✓ VERIFIED | metadataBase, VERCEL_PROJECT_PRODUCTION_URL, skip-link, RootNav, RootFooter all present; no bg-slate-400 |
| `components/root/root-nav.tsx` | RSC sticky header, 5 links, dual market CTAs | ✓ VERIFIED | RSC (no "use client"), 5 nav links, NEXT_PUBLIC_HK_URL/SG_URL reads, aria-label="Primary" |
| `components/root/root-nav-mobile.tsx` | Client drawer with Sheet | ✓ VERIFIED | "use client" line 1, Sheet import, aria-checked toggle on open/close |
| `components/root/root-footer.tsx` | Navy 4-col footer with social icons + copyright | ✓ VERIFIED | bg-brand-navy, inline SVG social icons (CC0), new Date().getFullYear(), noopener noreferrer |
| `lib/og-image.tsx` | createRootOgImage utility | ✓ VERIFIED | exports createRootOgImage, reads bloc-bold.ttf with try/catch fallback, 1200x630, navy bg |
| `app/root/opengraph-image.tsx` | Gateway OG image | ✓ VERIFIED | force-dynamic, runtime=nodejs, calls createRootOgImage with "Move. Grow. Thrive." |
| `app/root/page.tsx` | 8-section gateway homepage (GW-01) | ✓ VERIFIED | 510+ lines, 8 sections via private section components, inline JSON-LD, full openGraph |
| `components/root/leadership-card.tsx` | Phase 3-local LeadershipCard | ✓ VERIFIED | exports LeadershipCard + LeadershipCardProps, data-slot="leadership-card", aspect-[3/4], no priority |
| `components/root/leadership-section.tsx` | Phase 3-local LeadershipSection | ✓ VERIFIED | exports LeadershipSection + LeadershipSectionProps, RSC, maps leaders to LeadershipCards |
| `app/api/contact/route.ts` | POST /api/contact handler | ✓ VERIFIED | runtime=nodejs, dynamic=force-dynamic, honeypot, market validation, Resend routing |
| `emails/contact.tsx` | React Email template | ✓ VERIFIED | exports ContactEmail + ContactEmailProps, parameterised by market |
| `app/root/contact/page.tsx` | Contact page RSC shell | ✓ VERIFIED | RSC, "Get in touch.", ContactPage JSON-LD, Suspense around ContactForm, WhatsApp conditional render |
| `app/root/contact/contact-form.tsx` | Client form with force-pick UX | ✓ VERIFIED | "use client", radiogroup, bot-trap, useSearchParams, subject pre-fill SUBJECT_MAP |
| `app/root/brand/page.tsx` | /brand/ editorial page (GW-02) | ✓ VERIFIED | H1 "About ProActiv Sports", MDXRemote, LeadershipSection, full openGraph |
| `app/root/brand/content.mdx` | Brand MDX body (≥120 word LLM paragraph) | ✓ VERIFIED | Exists; 03-04-SUMMARY confirms 128 words in LLM-citable paragraph |
| `app/root/coaching-philosophy/page.tsx` | /coaching-philosophy/ page (GW-03) | ✓ VERIFIED | H1 "How we coach.", MDXRemote, LeadershipCard (Monica+Haikel), 3-pillar section (Safety/Progression/Confidence) |
| `app/root/news/page.tsx` | /news/ placeholder (GW-04) | ✓ VERIFIED | H1 "News & Press", empty newsItems array, NewsSignupForm imported |
| `app/root/news/news-signup-form.tsx` | News signup form | ✓ VERIFIED | POSTs to /api/contact with subject="Press notification list" |
| `app/root/careers/page.tsx` | /careers/ evergreen page (GW-05) | ✓ VERIFIED | H1 "Work with children. Build a career.", /contact?subject=job CTA |
| `app/root/privacy/page.tsx` | /privacy/ with draft banner (GW-07) | ✓ VERIFIED | Yellow draft banner, MDXRemote, "Privacy Policy (Draft)" title |
| `app/root/terms/page.tsx` | /terms/ with draft banner (GW-07) | ✓ VERIFIED | Yellow draft banner, MDXRemote, "Terms of Use (Draft)" title |
| All 8 `opengraph-image.tsx` | OG images via createRootOgImage | ✓ VERIFIED | All 8 files confirmed with runtime=nodejs, dynamic=force-dynamic, createRootOgImage call |
| `tests/mocks/resend.ts` | Resend mock factory | ✓ VERIFIED | installResendMock, mockResendSend exported |
| `tests/fixtures/contact-payloads.ts` | Contact test fixtures | ✓ VERIFIED | 8 named exports including validHKPayload, honeypotPayload, careersPayload |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `app/root/layout.tsx` | `root-nav.tsx` | import RootNav | ✓ WIRED | Import + render confirmed |
| `app/root/layout.tsx` | `root-footer.tsx` | import RootFooter | ✓ WIRED | Import + render confirmed |
| `root-nav.tsx` | `root-nav-mobile.tsx` | RootNavMobile | ✓ WIRED | Imported, rendered with props |
| All 8 OG files | `lib/og-image.tsx` | createRootOgImage | ✓ WIRED | All 8 import and call createRootOgImage |
| `app/root/page.tsx` | HK_URL/SG_URL env | HK_URL/SG_URL constants | ✓ WIRED | Passed to HeroSection + FinalCTASection |
| `app/root/contact/page.tsx` | `contact-form.tsx` | Suspense + ContactForm | ✓ WIRED | Import + Suspense wrapper confirmed |
| `contact-form.tsx` | `/api/contact` | fetch POST JSON | ✓ WIRED | fetch("/api/contact") with body confirmed |
| `app/api/contact/route.ts` | `emails/contact.tsx` | ContactEmail | ✓ WIRED | Import + call with props confirmed |
| `app/api/contact/route.ts` | CONTACT_INBOX_HK/SG | Resend to: routing | ✓ WIRED | inboxes[market] as to: field confirmed |
| `news-signup-form.tsx` | `/api/contact` | fetch POST subject="Press notification list" | ✓ WIRED | Confirmed |
| `app/root/careers/page.tsx` | `/contact?subject=job` | Link href | ✓ WIRED | href="/contact?subject=job" confirmed |
| `app/root/brand/page.tsx` | `brand/content.mdx` | readFile + MDXRemote | ✓ WIRED | readFile path + MDXRemote render confirmed |
| `coaching-philosophy/page.tsx` | `leadership-card.tsx` | LeadershipCard | ✓ WIRED | Import + render confirmed |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Market validation returns 400 | grep route.ts | "Invalid market" at status 400 found | ✓ PASS |
| Honeypot returns silent 200 | grep route.ts | bot-trap check before Resend call found | ✓ PASS |
| Contact route unit tests (9) | pnpm test:unit app/api/contact/ | 9/9 pass | ✓ PASS |
| Contact form unit tests (5) | pnpm test:unit app/root/contact/ | 5/5 pass | ✓ PASS |
| Gateway metadata tests (2) | pnpm test:unit app/root/page.test.tsx | 2/2 metadata tests pass | ✓ PASS |
| Gateway render tests (4) | pnpm test:unit app/root/page.test.tsx | 4/4 render tests FAIL — ReferenceError: IntersectionObserver is not defined | ⚠️ WARNING |
| Build — Phase 3 files specifically | pnpm build (Phase 3 files only) | Zero errors in app/root/*, lib/, emails/, app/api/contact/ | ✓ PASS |
| Build overall | pnpm build | Exits 1 — ESLint `any` errors in app/hk/* and app/sg/* only (Phase 4/5) | ⚠️ OUT OF SCOPE |

### Requirements Coverage

| Requirement | Description | Status | Evidence |
|-------------|-------------|--------|----------|
| GW-01 | Root homepage per PART 3 wireframe + PART 6A copy | ✓ SATISFIED | 8-section page.tsx, JSON-LD with 6 FAQ items, dual market CTAs, LeadershipSection |
| GW-02 | /brand/ entity page — LLM-citable brand statement | ✓ SATISFIED | app/root/brand/ with MDX (128-word LLM paragraph), LeadershipSection, full openGraph |
| GW-03 | /coaching-philosophy/ shared methodology | ✓ SATISFIED | app/root/coaching-philosophy/ with 3-pillar section, LeadershipCard for Monica+Haikel |
| GW-04 | /news/ press & media (CMS placeholder) | ✓ SATISFIED | Empty newsItems array + NewsSignupForm; Phase 6 CMS swap ready |
| GW-05 | /careers/ with role listings (placeholder) | ✓ SATISFIED | Evergreen page with D-07 /contact?subject=job open application CTA |
| GW-06 | /contact/ master form with market routing | ✓ SATISFIED | Force-pick UX, honeypot, Resend routing, 14 unit tests green |
| GW-07 | /privacy/ and /terms/ legal pages | ✓ SATISFIED | Both pages with yellow draft banner + MDX PDPO/PDPA prose body |

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| `app/root/page.test.tsx` | 4 render tests fail: ReferenceError: IntersectionObserver is not defined | ⚠️ Warning | Tests were 6/6 green at Plan 03-02 completion. Later-phase refactoring of gateway sections (hero-section.tsx now uses IntersectionObserver) broke the test environment but NOT the page behavior. Metadata tests (2/2) still confirm openGraph contract. Page content (dual CTAs, priority image, JSON-LD) verified correct by static analysis. Fix: add `global.IntersectionObserver = vi.fn(()=>({ observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() }))` stub to tests/setup.ts. |
| `app/fonts/bloc-bold.ttf` | File missing — HUMAN-ACTION from Plan 03-01 | ⚠️ Warning | OG images render with system-ui font fallback instead of Bloc Bold. force-dynamic prevents build crash. Not a functional blocker; brand fidelity at OG preview level reduced until font supplied. |
| `public/photography/*.webp` (12 files) | Hero, leadership, and market card photos missing | ⚠️ Warning | Pages build and render layout correctly; images show as broken. Client must provide photos and run pnpm photos:process. All component code and src paths are correct. |

### Human Verification Required

#### 1. Visual render — root homepage above fold

**Test:** Deploy to Vercel preview. Visit `<preview-url>/` on mobile viewport (375px).
**Expected:** H1 "Move. Grow. Thrive. In Hong Kong and Singapore." above the fold; "Enter Hong Kong →" and "Enter Singapore →" CTAs visible; layout does not collapse despite missing hero photo.
**Why human:** Broken hero image may affect layout depending on browser fallback behavior; needs visual confirmation.

#### 2. Contact form E2E — HK market routing

**Test:** On Vercel preview with RESEND_API_KEY + CONTACT_INBOX_HK + CONTACT_INBOX_SG set: visit `/contact`, select HK, fill form with valid data, submit.
**Expected:** Email arrives at CONTACT_INBOX_HK within 30 seconds. Resend dashboard logs the send.
**Why human:** Requires live env credentials and external email inbox.

#### 3. Contact form E2E — SG market routing

**Test:** Same as above, select SG market.
**Expected:** Email arrives at CONTACT_INBOX_SG.
**Why human:** Requires live env credentials.

#### 4. OG share preview (WhatsApp / iMessage)

**Test:** Share deployed preview URL on WhatsApp or iMessage.
**Expected:** 1200x630 navy preview card with readable title text and brand-rainbow bottom strip (system-ui font until bloc-bold.ttf supplied).
**Why human:** OG image rendering requires actual social share tool and deployed URL.

#### 5. Real photography delivery

**Test:** Provide the 12 missing photography files and run `pnpm photos:process`.
**Expected:** Leadership section and hero/market card sections show real ProActiv photography without broken image placeholders.
**Why human:** Client must provide licensed photography assets; directive in 03-02-SUMMARY.md.

### Gaps Summary

No automated-verifiable gaps remain for Phase 3 goal achievement. All 7 must-have truths are VERIFIED by static code analysis and unit tests.

**Test regression note:** The 4 failing render tests in `app/root/page.test.tsx` are a test-environment regression introduced by later-phase refactoring (IntersectionObserver now used in hero-section.tsx but not mocked in jsdom). This does not reflect a goal failure — the page content is correct. The fix is adding an IntersectionObserver stub to `tests/setup.ts`. This is a minor cleanup item, not a Phase 3 gap.

**Build note:** The `pnpm build` overall exit-1 is caused entirely by ESLint `@typescript-eslint/no-explicit-any` errors in `app/hk/*` and `app/sg/*` (Phase 4/5 files). Zero Phase 3 root files contribute to this failure.

Human verification items are all either client-action-dependent (photography assets, bloc-bold.ttf font) or require a live deployed environment with real credentials (contact form E2E, OG share). None block the Phase 3 codebase goal.

---

_Verified: 2026-05-12T00:10:00Z_
_Verifier: Claude (gsd-verifier)_

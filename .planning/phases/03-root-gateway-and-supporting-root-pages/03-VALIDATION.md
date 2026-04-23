---
phase: 03
slug: root-gateway-and-supporting-root-pages
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-23
approved: 2026-04-23
---

> **Wave 0 sign-off (2026-04-23):** All Wave 0 dependencies are scoped into Plan 03-01 Task 1 (RTL+jsdom install, Vitest config extension if needed, Resend mock at `tests/mocks/resend.ts`, contact-form fixtures at `tests/fixtures/contact-payloads.ts`). Sampling continuity verified: every plan task has `<verify><automated>` block invoking `pnpm test:unit` or `pnpm build`; no consecutive 3-task gap.

# Phase 03 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Source: 03-RESEARCH.md §Validation Architecture (lines 806–844).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.5 (already installed Phase 1, scoped to `middleware.test.ts`) |
| **Config file** | `vitest.config.ts` (exists from Phase 1 D-15) |
| **Quick run command** | `pnpm test:unit` |
| **Full suite command** | `pnpm test:unit` |
| **Estimated runtime** | ~5 seconds (current 11 tests; phase 3 adds ~10–15 more) |

Phase 3 extends Vitest scope to include route-level smoke tests and form handler unit tests.

---

## Sampling Rate

- **After every task commit:** Run `pnpm test:unit`
- **After every plan wave:** Run `pnpm test:unit` (full Vitest suite)
- **Before `/gsd-verify-work`:** Full Vitest suite must be green + manual SC #3 inbox check + manual SC #5 OG preview check
- **Max feedback latency:** 10 seconds (~5s tests + ~5s tsc)

---

## Per-Task Verification Map

> Task IDs are placeholders — final IDs assigned by gsd-planner. Each row maps a phase requirement to its automated test surface.

| Req ID | Behavior | Test Type | Automated Command | File | Status |
|--------|----------|-----------|-------------------|------|--------|
| GW-01 | Root homepage renders with H1 from PART 6A | unit/RTL | `pnpm test:unit` → `app/(root)/page.test.ts` | ❌ Wave 0 | ⬜ pending |
| GW-01 | Dual market CTAs use absolute `<a href>` to `NEXT_PUBLIC_HK_URL/SG_URL`, NEVER `<Link>` | unit | `pnpm test:unit` → `app/(root)/page.test.ts` | ❌ Wave 0 | ⬜ pending |
| GW-01 | Single `priority` image on hero (not on MarketCards) — Pitfall 6 | unit | `pnpm test:unit` → `app/(root)/page.test.ts` | ❌ Wave 0 | ⬜ pending |
| GW-01 | Organization + WebSite + FAQPage JSON-LD inline on root homepage only | unit | `pnpm test:unit` → JSON-LD shape assertion | ❌ Wave 0 | ⬜ pending |
| GW-02 | `/brand/` renders MDX content + LeadershipCard composition | unit | `pnpm test:unit` → `app/(root)/brand/page.test.ts` | ❌ Wave 0 | ⬜ pending |
| GW-03 | `/coaching-philosophy/` renders 3-pillar layout from MDX | unit | `pnpm test:unit` → `app/(root)/coaching-philosophy/page.test.ts` | ❌ Wave 0 | ⬜ pending |
| GW-04 | `/news/` renders coming-soon placeholder with empty `pressItems` array | unit | `pnpm test:unit` → `app/(root)/news/page.test.ts` | ❌ Wave 0 | ⬜ pending |
| GW-05 | `/careers/` evergreen page with open application CTA → `/contact/?subject=job` | unit | `pnpm test:unit` → `app/(root)/careers/page.test.ts` | ❌ Wave 0 | ⬜ pending |
| GW-06 | Contact API rejects unknown market values (returns 400) | unit | `pnpm test:unit` → `app/api/contact/route.test.ts` | ❌ Wave 0 | ⬜ pending |
| GW-06 | Contact API routes `market=hk` to `CONTACT_INBOX_HK` (Resend mock) | unit | `pnpm test:unit` → `app/api/contact/route.test.ts` | ❌ Wave 0 | ⬜ pending |
| GW-06 | Contact API routes `market=sg` to `CONTACT_INBOX_SG` (Resend mock) | unit | `pnpm test:unit` → `app/api/contact/route.test.ts` | ❌ Wave 0 | ⬜ pending |
| GW-06 | Honeypot field non-empty → silent 200 reject (no email sent) | unit | `pnpm test:unit` → `app/api/contact/route.test.ts` | ❌ Wave 0 | ⬜ pending |
| GW-06 | Force-pick UX — form fields hidden until market selected (D-03) | unit/RTL | `pnpm test:unit` → `app/(root)/contact/contact-form.test.tsx` | ❌ Wave 0 | ⬜ pending |
| GW-06 | Contact form pre-fills subject "Job application" when `?subject=job` query param present (D-07) | unit/RTL | `pnpm test:unit` → `app/(root)/contact/contact-form.test.tsx` | ❌ Wave 0 | ⬜ pending |
| GW-07 | `/privacy/` renders MDX with prominent DRAFT banner | unit | `pnpm test:unit` → `app/(root)/privacy/page.test.ts` | ❌ Wave 0 | ⬜ pending |
| GW-07 | `/terms/` renders MDX with prominent DRAFT banner | unit | `pnpm test:unit` → `app/(root)/terms/page.test.ts` | ❌ Wave 0 | ⬜ pending |
| Pitfall 1 | `metadataBase` set in root layout with Vercel-aware fallback | unit | `pnpm test:unit` → metadata shape assertion | ❌ Wave 0 | ⬜ pending |
| Pitfall 2 | Each page provides FULL `openGraph` object (no shallow-merge inheritance) | unit | `pnpm test:unit` → grep test of metadata exports | ❌ Wave 0 | ⬜ pending |
| Pitfall 4 | OG image uses TTF font (not WOFF2) for Satori | smoke | `pnpm build` → opengraph-image route generates without warning | implicit | ⬜ pending |
| SC #5 | All root pages return 200 on Vercel preview | manual smoke | curl each preview URL | manual | ⬜ pending |
| SC #5 | OG image URL is absolute HTTPS in `<head>` | unit | `pnpm test:unit` → metadata.openGraph.images[0].url assertion | ❌ Wave 0 | ⬜ pending |
| SC #5 | WhatsApp + iMessage preview render correctly | manual | Paste preview URL in opengraph.xyz, send to WhatsApp/iMessage | manual | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Files that must exist before Phase 3 task commits begin (planner assigns to a Wave 0 task or includes in the relevant Wave 1 plan):

- [ ] `vitest.config.ts` — extend `include` to cover `app/(root)/**/*.test.ts*` and `app/api/**/*.test.ts` (currently scoped only to `middleware.test.ts`)
- [ ] `@testing-library/react` + `@testing-library/jest-dom` + `jsdom` — install for RTL component tests on contact form. Phase 1 D-15 deferred this; Phase 3 contact form complexity justifies adding now
- [ ] `tests/setup.ts` — RTL global setup (jsdom env, `cleanup()` hook, `@testing-library/jest-dom/vitest` matchers)
- [ ] `tests/mocks/resend.ts` — Resend client mock returning predictable `{data: {id}, error: null}` shape for happy-path; `{data: null, error}` for failure path
- [ ] `tests/fixtures/contact-payloads.ts` — sample form payloads (valid HK, valid SG, missing market, honeypot triggered, invalid email)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| End-to-end HK form → HK inbox | GW-06 / SC #3 | Resend can be mocked at unit level but actual delivery to inbox requires live env var + Resend dashboard | (1) Set `RESEND_API_KEY`, `CONTACT_INBOX_HK` in Vercel preview env. (2) Submit form on preview URL with HK market. (3) Confirm email arrives at HK inbox + Resend dashboard logs send |
| End-to-end SG form → SG inbox | GW-06 / SC #3 | Same as above | Repeat with SG market + `CONTACT_INBOX_SG` |
| WhatsApp link preview unfurls correctly | SC #5 | WhatsApp's link unfurl is opaque to test infrastructure; only real share verifies | Paste root URL into WhatsApp chat with self; verify image, title, description appear |
| iMessage link preview unfurls correctly | SC #5 | iMessage unfurl is iOS-only and opaque to test infrastructure | Paste root URL into iMessage with self on iOS device; verify preview card |
| Lighthouse 95+ on root, brand, coaching-philosophy, contact | SC #4 / SEO-06 | Real Lighthouse run requires built+served preview deployment | Run Lighthouse via Chrome DevTools or Vercel Speed Insights on each preview URL; verify all categories ≥ 95 |
| LCP < 2.5s, CLS < 0.1, INP < 200ms on root + supporting pages | PROJECT.md performance budget | CWV measurement requires real device + network throttling | Use Lighthouse mobile preset (Slow 4G + 4x CPU throttle); verify CWV thresholds met |
| Real ProActiv photography on hero + leadership + market cards | SC #4 | Visual check — automation cannot judge "real photo vs placeholder" | Visual review of preview deployment; cross-check filenames against `public/photography/` directory |
| Leadership portrait HUMAN-ACTION precondition triggers when files missing (D-10) | D-10 enforcement | The HUMAN-ACTION checkpoint is interactive; cannot be exercised by unit tests | Temporarily remove a leadership portrait, run plan task; confirm HUMAN-ACTION checkpoint appears with exact missing-file paths |
| WhatsApp click-to-chat opens chat with prefilled text | GW-06 | Cross-app deeplink behavior needs a real device | Tap WhatsApp link on iOS + Android; confirm WhatsApp opens with prefilled message |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (Vitest config extension, RTL install, Resend mock, fixtures)
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending (planner sign-off after task IDs assigned)

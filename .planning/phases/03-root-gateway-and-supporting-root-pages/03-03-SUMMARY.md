---
phase: 03
plan: "03"
subsystem: contact-form
tags: [contact, resend, form, market-routing, honeypot, whatsapp, json-ld, tdd]
dependency_graph:
  requires: [03-01]
  provides: [GW-06, /api/contact, /root/contact]
  affects: [03-05, phase-04, phase-05]
tech_stack:
  added:
    - resend SDK (email delivery, server-only)
    - "@react-email/components" (email template)
  patterns:
    - TDD RED/GREEN per task
    - vi.fn() constructor mock for class-based SDKs (not arrow-function mockImplementation)
    - Always-rendered hidden inputs for pre-fill values (outside market-conditional block)
    - vitest resolve.alias for @/ → tsconfig path mirror
key_files:
  created:
    - app/api/contact/route.ts
    - app/api/contact/route.test.ts
    - emails/contact.tsx
    - app/root/contact/page.tsx
    - app/root/contact/contact-form.tsx
    - app/root/contact/contact-form.test.tsx
    - app/root/contact/opengraph-image.tsx
  modified:
    - vitest.config.ts
decisions:
  - "Moved hidden subject input outside the market-conditional block so ?subject= pre-fill is available in DOM before market is selected (required by test spec and D-07 UX intent)"
  - "Added resolve.alias to vitest.config.ts to mirror tsconfig @/ paths — needed for vi.mock('@/emails/contact') in route tests"
  - "vi.fn() mock for Resend class requires regular function (not arrow function) in mockImplementation to be constructable via new Resend()"
  - "Build prerender error at /root/opengraph-image and /contact/opengraph-image is pre-existing (bloc-bold.ttf HUMAN-ACTION from Plan 03-01, deferred by user)"
metrics:
  duration: "~16 minutes"
  completed: "2026-04-23"
  tasks_completed: 2
  tasks_total: 2
  files_created: 7
  files_modified: 1
  tests_added: 17
  tests_total_passing: 28
---

# Phase 03 Plan 03: Contact Backend + UI Summary

**One-liner:** Market-routed Resend contact handler (POST /api/contact) + force-pick RSC form UI with honeypot, subject pre-fill, and conditional WhatsApp cards — 17 new tests, all green.

## What Was Built

### Task 1 — POST /api/contact route handler + React Email template (commits: 45a6543)

**app/api/contact/route.ts** — Next.js App Router route handler:
- `runtime = "nodejs"`, `dynamic = "force-dynamic"` per sentry-smoke analog
- Validation order: (1) honeypot D-04 silent 200, (2) name/email/message, (3) market enum, (4) env-var check
- D-04: `bot-trap` non-empty → returns 200 with `{ success: true }`, does NOT call Resend
- Pitfall 5: market !== 'hk' && market !== 'sg' → returns 400 `{ error: 'Invalid market' }`
- D-05: sender `ProActiv Sports Website <onboarding@resend.dev>` (Phase 10 swap path documented)
- D-07: `subject` from payload flows into Resend email subject line (careers integration)
- Env-var absence → 500 with server-side console.error (visible config error, not silent)

**emails/contact.tsx** — Single parameterised React Email template (UI-SPEC §6.11):
- One template for both markets, parameterised by `market: "hk" | "sg"`
- Renders name, email, phone, age, subject, message with HTML-safe `<Text>` components
- `whiteSpace: "pre-wrap"` for message body (T-03-17 XSS mitigation — React Email escapes children)

**app/api/contact/route.test.ts** — 11 vitest tests:
- Validation: invalid market 400, missing name 400, invalid email 400
- Honeypot: returns 200 silently, Resend NOT called
- Market routing: HK → `CONTACT_INBOX_HK`, SG → `CONTACT_INBOX_SG`
- Sender: `onboarding@resend.dev`, replyTo = parent email, [HK]/[SG] prefix in subject
- D-07: subject from payload appears in Resend subject
- Failure: Resend error → 500

**vitest.config.ts** — Added `resolve.alias: { "@": resolve(__dirname, ".") }` to mirror tsconfig `@/*` paths.

### Task 2 — Contact page UI: RSC shell + force-pick form + OG image (commit: af5a044)

**app/root/contact/contact-form.tsx** — `"use client"` island:
- D-03 force-pick: market selector shown first; form fields hidden until HK or SG clicked
- Market selector: `role="radiogroup"` wrapper, each card `role="radio"` + `aria-checked`
- D-04: `input[name="bot-trap"]` always off-screen (`left: -9999px`), `tabIndex={-1}`, `aria-hidden`
- D-07: `useSearchParams()` reads `?subject=`, maps via `SUBJECT_MAP` (`job` → `"Job application"`, `press-list` → `"Press notification list"`)
- Hidden `subject` input rendered OUTSIDE the market-conditional block (always in DOM for pre-fill)
- Success state: replaces form with thank-you card + "Send another message" reset button
- Error state: inline error card with direct email fallback link

**app/root/contact/page.tsx** — RSC shell:
- H1 "Get in touch."
- Full openGraph metadata (Pitfall 2) with `/contact/opengraph-image` OG image URL
- Inline `<script type="application/ld+json">` — ContactPage JSON-LD (UI-SPEC §6.10/§8.4)
- Conditional WhatsApp HK/SG cards: omitted when env var unset + build-time `console.warn`
- `alternates.canonical` set

**app/root/contact/opengraph-image.tsx** — OG image route calling `createRootOgImage`.

**app/root/contact/contact-form.test.tsx** — 6 RTL tests:
- D-03: form fields hidden before market pick; helper text visible; fields revealed after HK click
- D-07: subject input value = "Job application" when `?subject=job`; empty when no param
- D-04: `input[name="bot-trap"]` present + `tabindex="-1"` after market selected
- ARIA: radiogroup present; aria-checked toggles on click

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] `vi.fn().mockImplementation()` with arrow function is not constructable**
- **Found during:** Task 1 GREEN phase
- **Issue:** `vi.fn().mockImplementation(() => ({ emails: { send: mockSend } }))` produces an arrow function that cannot be called with `new`, causing `TypeError: () => ({...}) is not a constructor` when route.ts does `new Resend(apiKey)`
- **Fix:** Changed to `vi.fn(function(this) { Object.assign(this, { emails: { send: mockSend } }) })` — regular function is constructable
- **Files modified:** `app/api/contact/route.test.ts`

**2. [Rule 1 - Bug] React not in scope for JSX in test file**
- **Found during:** Task 2 GREEN phase
- **Issue:** `contact-form.test.tsx` used JSX (`<ContactForm />`) without importing React, causing `ReferenceError: React is not defined`
- **Fix:** Added `import * as React from "react"` at top of test file
- **Files modified:** `app/root/contact/contact-form.test.tsx`

**3. [Rule 1 - Bug] Hidden subject input not in DOM before market selection**
- **Found during:** Task 2 GREEN phase — test "pre-fills hidden subject field when ?subject=job" failed because the input was inside the `!market ? ... : ...` conditional
- **Issue:** Plan test spec queries `input[name="subject"]` without first clicking a market card; the hidden input was only rendered in the market-selected branch
- **Fix:** Moved `<input type="hidden" name="subject" value={subjectValue} />` outside the conditional block (always in DOM). Removed duplicate inside the conditional.
- **Files modified:** `app/root/contact/contact-form.tsx`
- **Rationale:** Correct UX behaviour — the subject param should be captured from URL as soon as the page loads, regardless of market selection state

**4. [Rule 2 - Missing] vitest.config.ts missing @/ path alias**
- **Found during:** Task 1 RED phase — `vi.mock("@/emails/contact", ...)` failed to resolve
- **Issue:** vitest.config.ts had no `resolve.alias` for the `@/` prefix defined in tsconfig.json paths
- **Fix:** Added `resolve: { alias: { "@": resolve(__dirname, ".") } }` to vitest.config.ts
- **Files modified:** `vitest.config.ts`

## Pre-existing Build Issue (Out of Scope)

**`pnpm build` fails at static prerendering of `/root/opengraph-image` and `/contact/opengraph-image`**

The Next.js build compilation step succeeds (`✓ Compiled successfully`). The failure occurs during static page generation when Next.js tries to execute `lib/og-image.tsx` which reads `app/fonts/bloc-bold.ttf` — a file that does not exist.

This is a pre-existing issue from Plan 03-01 Task 1 where `bloc-bold.ttf` placement was a HUMAN-ACTION precondition explicitly deferred by the user (git log: "OG build-verify skipped by user"). My contact OG image (`app/root/contact/opengraph-image.tsx`) uses the same `createRootOgImage` utility and is blocked by the same missing font.

**Action required (HUMAN-ACTION):** Place the `bloc-bold.ttf` font file at `app/fonts/bloc-bold.ttf` to unblock OG image build. See Plan 03-01 SUMMARY for source instructions.

## Production Environment Requirements

The following env vars must be set in Vercel (or equivalent) before the contact form works end-to-end. Tests pass without them (mocked), but live form submissions require them:

| Env Var | Purpose | Source |
|---------|---------|--------|
| `RESEND_API_KEY` | Resend API authentication | https://resend.com/api-keys (free tier: 3000/month) |
| `CONTACT_INBOX_HK` | Destination email for HK enquiries | HK staff email (Martin to provide) |
| `CONTACT_INBOX_SG` | Destination email for SG enquiries | SG staff email (Martin to provide) |
| `NEXT_PUBLIC_WHATSAPP_HK` | HK WhatsApp number (optional) | International format, e.g. +85291234567 |
| `NEXT_PUBLIC_WHATSAPP_SG` | SG WhatsApp number (optional) | +6598076827 per strategy PART 8.3 |

## Notes for Future Plans

**Plan 03-05 (/news/ + /careers/ pages):** Both pages can POST to `/api/contact` with appropriate `market` and `subject` fields. The route accepts any `subject` string — no code changes needed. Example: `/contact/?subject=job` pre-fills "Job application" for careers CTA.

**Phase 04/05 (HK/SG market booking forms):** These phases can reuse `/api/contact` as a shared enquiry endpoint, adding `market: "hk"` or `market: "sg"` to route to the correct inbox.

**Phase 10 (D-05 sender swap):** Change `from: "ProActiv Sports Website <onboarding@resend.dev>"` in `app/api/contact/route.ts` to `from: "ProActiv Sports <noreply@proactivsports.com>"` once DKIM/SPF DNS records are live. One-line change.

## Test Results

| Suite | Tests | Status |
|-------|-------|--------|
| middleware.test.ts | 11 | PASS |
| app/api/contact/route.test.ts | 11 | PASS |
| app/root/contact/contact-form.test.tsx | 6 | PASS |
| **Total** | **28** | **ALL PASS** |

## Self-Check: PASSED

All created files confirmed present on disk. Both task commits verified in git log.

| Item | Status |
|------|--------|
| app/api/contact/route.ts | FOUND |
| app/api/contact/route.test.ts | FOUND |
| emails/contact.tsx | FOUND |
| app/root/contact/page.tsx | FOUND |
| app/root/contact/contact-form.tsx | FOUND |
| app/root/contact/contact-form.test.tsx | FOUND |
| app/root/contact/opengraph-image.tsx | FOUND |
| 03-03-SUMMARY.md | FOUND |
| Commit 45a6543 (Task 1) | FOUND |
| Commit af5a044 (Task 2) | FOUND |

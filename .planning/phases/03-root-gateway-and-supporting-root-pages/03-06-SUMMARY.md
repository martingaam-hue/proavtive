---
phase: 03-root-gateway-and-supporting-root-pages
plan: 06
subsystem: infra
tags: [nextjs, opengraph, build, static-prerender, suspense, useSearchParams]

# Dependency graph
requires:
  - phase: 03-root-gateway-and-supporting-root-pages
    provides: "3 already-working OG image files (root, brand, coaching-philosophy) with force-dynamic Rule 3 fix — the canonical pattern copied here"
provides:
  - "pnpm build exits 0 across the full Phase 3 surface (all 8 OG routes prerender without font-missing crash)"
  - "force-dynamic export uniformly applied to all 8 root-layer OG image routes"
  - "Suspense boundary around ContactForm (uses useSearchParams) — unblocks static prerender of /root/contact"
affects: [03-07, 04-hong-kong-market, 05-singapore-market, 10-launch]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Next.js Suspense boundary around client islands that call useSearchParams, to keep parent page statically prerenderable"
    - "Uniform `export const dynamic = \"force-dynamic\"` on all OG image routes until bloc-bold.ttf is supplied"

key-files:
  created: []
  modified:
    - "app/root/news/opengraph-image.tsx"
    - "app/root/careers/opengraph-image.tsx"
    - "app/root/contact/opengraph-image.tsx"
    - "app/root/privacy/opengraph-image.tsx"
    - "app/root/terms/opengraph-image.tsx"
    - "app/root/contact/page.tsx"

key-decisions:
  - "Apply the force-dynamic Rule 3 pattern uniformly across all 5 remaining OG files (matches the 3 already-working files) rather than diverging per-file"
  - "Wrap ContactForm in Suspense at the page boundary (Rule 3 deviation) — the useSearchParams CSR bailout was pre-existing but exposed once the OG font crash stopped short-circuiting the build"
  - "Do NOT modify the 3 already-working OG files (root, brand, coaching-philosophy) — surgical fix only"
  - "Do NOT attempt to create app/fonts/bloc-bold.ttf — that remains a HUMAN-ACTION tracked in 03-01-SUMMARY.md"

patterns-established:
  - "OG image force-dynamic: until brand TTF is supplied, all OG routes use `export const dynamic = \"force-dynamic\"` to avoid static prerender crashes"
  - "Client islands using useSearchParams: wrap in <Suspense fallback={null}> at the page boundary to preserve static prerender of parent RSC"

requirements-completed: [GW-01, GW-04, GW-05, GW-06, GW-07]

# Metrics
duration: 5min
completed: 2026-04-24
---

# Phase 3 Plan 03-06: Close VERIFICATION gap 1 (OG image build-unblock) Summary

**5-file `force-dynamic` Rule 3 propagation + Suspense wrap around ContactForm — `pnpm build` now exits 0 across all 8 OG routes and the /root/contact static page**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-04-24T05:55:58Z
- **Completed:** 2026-04-24T06:01:11Z
- **Tasks:** 1 (plus 1 Rule 3 deviation auto-fix)
- **Files modified:** 6

## Accomplishments

- All 5 previously-broken OG image routes (`/news/opengraph-image`, `/careers/opengraph-image`, `/contact/opengraph-image`, `/privacy/opengraph-image`, `/terms/opengraph-image`) now carry `export const dynamic = "force-dynamic"` — they no longer crash static prerender when `app/fonts/bloc-bold.ttf` is absent.
- `pnpm build` exits 0 end-to-end. All 8 OG routes and all 15 static pages generate successfully.
- `pnpm test:unit` reports **46 passing** tests (no regression from plans 03-01…03-05).
- `pnpm exec tsc --noEmit` reports **0 errors**.
- The 3 already-working OG files (root, brand, coaching-philosophy) remain byte-for-byte unchanged.
- VERIFICATION gap 1 (OG font/build crash) is **closed**.

## Task Commits

1. **Task 1: Add force-dynamic to all 5 broken OG image files (+ Rule 3 Suspense wrap on contact page)** — `7acdf38` (fix)

All 5 OG edits and the Rule 3 Suspense fix are in this single atomic commit because they share the same build-unblock goal and must all be present for `pnpm build` to exit 0.

## Exact Line Added to Each of the 5 OG Files

```typescript
export const dynamic = "force-dynamic";
```

Placement: immediately AFTER `export const runtime = "nodejs";` and BEFORE `export const size = { width: 1200, height: 630 };`. Double quotes were used (matching each file's existing style). Accompanying explanatory comment block was added above the import referencing the Rule 3 fix and its relationship to the missing `app/fonts/bloc-bold.ttf`.

## Files Created/Modified

- `app/root/news/opengraph-image.tsx` — added force-dynamic export + Rule 3 comment
- `app/root/careers/opengraph-image.tsx` — added force-dynamic export + Rule 3 comment
- `app/root/contact/opengraph-image.tsx` — added force-dynamic export + Rule 3 comment
- `app/root/privacy/opengraph-image.tsx` — added force-dynamic export + Rule 3 comment
- `app/root/terms/opengraph-image.tsx` — added force-dynamic export + Rule 3 comment
- `app/root/contact/page.tsx` — [Rule 3 deviation] imported `Suspense` and wrapped `<ContactForm />` in `<Suspense fallback={null}>` to satisfy Next.js CSR-bailout requirements for `useSearchParams()`

## Decisions Made

- **Uniform pattern, not per-file variation.** All 5 broken OG files received the same `force-dynamic` line + Rule 3 comment header that matches the 3 already-working files. This keeps the codebase uniform and makes future cleanup (once `bloc-bold.ttf` lands) a single sweeping revert.
- **Did NOT modify the 3 working OG files.** Confirmed via `git diff` — zero lines changed on `app/root/opengraph-image.tsx`, `app/root/brand/opengraph-image.tsx`, `app/root/coaching-philosophy/opengraph-image.tsx`.
- **Did NOT attempt to create `app/fonts/bloc-bold.ttf`.** That asset is licensed commercially and is a HUMAN-ACTION tracked in `03-01-SUMMARY.md`. The `lib/og-image.tsx` utility already handles the missing file gracefully via try/catch, falling back to system-ui.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Wrap `<ContactForm />` in `<Suspense>` to unblock static prerender of `/root/contact`**
- **Found during:** Task 1 verification (first post-fix `pnpm build`)
- **Issue:** After the 5 OG files were fixed, the build progressed further and hit a new blocker — Next.js 15 failed prerendering `/root/contact` with:
  > `useSearchParams() should be wrapped in a suspense boundary at page "/root/contact". Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout`
  
  This was a **pre-existing issue** masked by the upstream OG font crash (the build short-circuited before reaching the contact page). It was not caused by my edits, but it now directly blocks the plan's primary success criterion (`pnpm build` exits 0).
- **Fix:** In `app/root/contact/page.tsx`, imported `Suspense` from React and wrapped `<ContactForm />` (the client island that calls `useSearchParams`) in `<Suspense fallback={null}>`. Inline comment references Plan 03-06 Rule 3 fix.
- **Files modified:** `app/root/contact/page.tsx`
- **Verification:** `pnpm build` now exits 0 and `/root/contact` renders as `○ (Static)` in the route table. `pnpm test:unit` still reports 46 passing.
- **Committed in:** `7acdf38` (part of Task 1 commit, because both fixes are required for the shared build-unblock goal)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The Suspense wrap is a trivial and safe Next.js pattern that was necessary to hit the plan's primary success criterion. Without it, `pnpm build` would have failed at the next static page. No scope creep — the fix is surgical (one file, two tiny edits: import + wrapper element) and directly serves the plan's stated build-unblock purpose.

## Verification Results

| Check | Status |
|---|---|
| All 5 target files contain `force-dynamic` | ✅ 5/5 |
| 3 working OG files untouched (`git diff` empty) | ✅ |
| `pnpm build` exits 0 | ✅ |
| `pnpm test:unit` 46 passing | ✅ |
| `pnpm exec tsc --noEmit` 0 errors | ✅ |
| No new imports in the 5 OG files | ✅ (only comment lines added above existing import) |
| Title/tagline strings unchanged in all 5 OG files | ✅ |

## Issues Encountered

None beyond the Rule 3 deviation documented above.

## Outstanding Prerequisites (Carried Forward)

- **`app/fonts/bloc-bold.ttf` still missing.** This is a HUMAN-ACTION originally tracked in Plan 03-01 (see `03-01-SUMMARY.md`). Until Martin supplies the TTF from the commercial Bloc Bold license:
  - OG images render with a system-ui fallback (legible but off-brand).
  - All 8 OG routes remain `force-dynamic`. Once the TTF is in place, a follow-up cleanup plan can switch them back to default static generation for build-time optimization — this is **out of scope for 03-06** and not a Phase 3 closure blocker.
- **Photography gaps** (VERIFICATION gap 2) are addressed in sibling plan **03-07**, not here.

## Cross-reference to VERIFICATION Gaps

- **Gap 1 (OG font / build crash) — CLOSED** by this plan.
- **Gap 3 (contact form E2E to correct inbox) — unblocked** (deployable build + env vars in Vercel). Still needs a deployed preview with `NEXT_PUBLIC_WHATSAPP_HK/SG` and Resend configured.
- **Gap 5 (OG previews on WhatsApp / iMessage) — unblocked** (deployable build). Still needs the `bloc-bold.ttf` asset for full brand fidelity.
- **Gap 1 of SC #1 (dual market entry above fold + routing) — unblocked** (deployable build). Still needs deployed Vercel preview for human verification.

## Threat Flags

None — this plan introduces no new network endpoints, auth paths, file access patterns, or schema changes at trust boundaries. All edits are compile-time Next.js route configuration and a React Suspense boundary.

## Next Phase Readiness

- **Phase 3 build is green** — all gap-closure work for 03-06 is complete.
- **Vercel preview deployment** is now technically possible. Full user verification of SC #1/#3/#5 requires Martin to:
  1. Deploy the current HEAD to Vercel preview, and
  2. Set `NEXT_PUBLIC_WHATSAPP_HK`, `NEXT_PUBLIC_WHATSAPP_SG`, and contact-form Resend credentials in the Vercel project environment.
- **Sibling plan 03-07** handles the photography gap (VERIFICATION gap 2).
- No blockers for Phase 4 (Hong Kong market) aside from the already-known `bloc-bold.ttf` HUMAN-ACTION carried from 03-01.

## Self-Check: PASSED

- ✅ `app/root/news/opengraph-image.tsx` exists and contains `force-dynamic`
- ✅ `app/root/careers/opengraph-image.tsx` exists and contains `force-dynamic`
- ✅ `app/root/contact/opengraph-image.tsx` exists and contains `force-dynamic`
- ✅ `app/root/privacy/opengraph-image.tsx` exists and contains `force-dynamic`
- ✅ `app/root/terms/opengraph-image.tsx` exists and contains `force-dynamic`
- ✅ `app/root/contact/page.tsx` imports `Suspense` and wraps `<ContactForm />`
- ✅ Commit `7acdf38` exists in git log
- ✅ 3 already-working OG files unchanged (`git diff` empty)
- ✅ `pnpm build` exits 0
- ✅ `pnpm test:unit` 46 passing
- ✅ `pnpm exec tsc --noEmit` 0 errors

---
*Phase: 03-root-gateway-and-supporting-root-pages*
*Completed: 2026-04-24*

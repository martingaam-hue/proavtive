---
phase: 4
slug: hong-kong-market
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-24
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.5 (already installed) |
| **Config file** | `vitest.config.ts` (exists — Phase 1) |
| **Quick run command** | `pnpm test:unit` |
| **Full suite command** | `pnpm test:unit` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test:unit`
- **After every plan wave:** Run `pnpm test:unit` full suite
- **Before `/gsd-verify-work`:** Full suite must be green + manual smoke test (all 22 HK routes return 200)
- **Max feedback latency:** ~15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 4-01-01 | 01 | 1 | HK-01 | — | N/A | unit | `pnpm test:unit` → `app/hk/page.test.ts` | ❌ W0 | ⬜ pending |
| 4-01-02 | 01 | 1 | HK-01 | — | Venue chips present | unit | `pnpm test:unit` | ❌ W0 | ⬜ pending |
| 4-01-03 | 01 | 1 | HK-01 | — | Book CTA links to `/book-a-trial/` | unit | `pnpm test:unit` | ❌ W0 | ⬜ pending |
| 4-02-01 | 02 | 1 | HK-02 | — | Wan Chai NAP renders correctly | unit | `pnpm test:unit` → `app/hk/wan-chai/page.test.ts` | ❌ W0 | ⬜ pending |
| 4-02-02 | 02 | 1 | HK-02 | — | Map iframe present | unit | `pnpm test:unit` | ❌ W0 | ⬜ pending |
| 4-03-01 | 03 | 1 | HK-03 | — | Cyberport "5,000 sq ft" renders | unit | `pnpm test:unit` → `app/hk/cyberport/page.test.ts` | ❌ W0 | ⬜ pending |
| 4-04-01 | 04 | 1 | HK-04 | — | All 8 sub-pages render unique H1 | unit | `pnpm test:unit` → `app/hk/gymnastics/pillar.test.ts` | ❌ W0 | ⬜ pending |
| 4-04-02 | 04 | 1 | HK-04 | — | Pillar nav has all 8 programme links | unit | `pnpm test:unit` | ❌ W0 | ⬜ pending |
| 4-12-01 | TBD | TBD | HK-12 | T-venue | Venue field validated ∈ allowed values | unit (fetch mock) | `pnpm test:unit` → `app/hk/book-a-trial/booking-form.test.ts` | ❌ W0 | ⬜ pending |
| 4-12-02 | TBD | TBD | HK-12 | — | Venue pre-fills from `?venue=wan-chai` | unit | `pnpm test:unit` | ❌ W0 | ⬜ pending |
| 4-smoke | ALL | final | ALL | — | All HK routes return 200 | smoke (manual) | Curl each route on preview URL | manual | ⬜ pending |
| 4-nav | ALL | final | ALL | — | Any HK page → `/book-a-trial/` in ≤2 clicks | manual | Navigate in browser | manual | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `app/hk/page.test.ts` — HK homepage regression tests (HK-01)
- [ ] `app/hk/wan-chai/page.test.ts` — Wan Chai NAP + map (HK-02)
- [ ] `app/hk/cyberport/page.test.ts` — Cyberport content (HK-03)
- [ ] `app/hk/gymnastics/pillar.test.ts` — all 8 sub-pages render unique H1 (HK-04)
- [ ] `app/hk/book-a-trial/booking-form.test.ts` — form submission + venue pre-fill (HK-12)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| All 22 HK routes return 200 (no 404s) | ALL | Requires live preview deployment | Curl each HK route on Vercel preview URL after each plan wave |
| Any HK page → `/book-a-trial/` in ≤2 clicks | ALL | Requires browser interaction | Navigate from homepage, Wan Chai, Cyberport, gymnastics pillar, and 3 support pages |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

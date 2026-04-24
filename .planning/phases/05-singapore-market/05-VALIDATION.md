---
phase: 05
slug: singapore-market
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-24
---

# Phase 05 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.5 (already installed — Phase 1) |
| **Config file** | `vitest.config.ts` (exists) |
| **Quick run command** | `pnpm test:unit` |
| **Full suite command** | `pnpm test:unit` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test:unit`
- **After every plan wave:** Run `pnpm test:unit` full suite
- **Before `/gsd-verify-work`:** Full suite green + manual smoke (all 15 SG routes return 200) + `grep -r "sg-placeholder" app/sg/` returns zero matches + visual-verify of homepage + Katong Point pages

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | SG-01..11 | — | N/A | unit (Wave 0) | `pnpm test:unit` | ❌ W0 | ⬜ pending |
| 05-01-02 | 01 | 1 | SG-11 | T-05-01 | Subject field ≤100 chars, no newlines | unit | `pnpm test:unit` | ❌ W0 | ⬜ pending |
| 05-02-01 | 02 | 1 | SG-01 | — | N/A | unit | `pnpm test:unit` | ❌ W0 | ⬜ pending |
| 05-02-02 | 02 | 1 | SG-02 | — | N/A | unit | `pnpm test:unit` | ❌ W0 | ⬜ pending |
| 05-03-01 | 03 | 2 | SG-03 | — | N/A | unit | `pnpm test:unit` | ❌ W0 | ⬜ pending |
| 05-03-02 | 03 | 2 | SG-04 | — | N/A | unit | `pnpm test:unit` | ❌ W0 | ⬜ pending |
| 05-04-01 | 04 | 2 | SG-05..SG-10 | — | N/A | unit | `pnpm test:unit` | ❌ W0 | ⬜ pending |
| 05-05-01 | 05 | 3 | SG-11 | T-05-01 | market:"sg" submitted, subject pre-fill works | unit (fetch mock) | `pnpm test:unit` | ❌ W0 | ⬜ pending |
| 05-ALL | ALL | — | ALL | T-05-02 | No sg-placeholder refs leak to SG pages | unit (grep-based) | `pnpm test:unit` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

All test files are new — Wave 0 stubs must be created before task implementation begins:

- [ ] `app/sg/page.test.ts` — SG homepage regression: H1 text, Katong Point chip, MultiBall trust line, Book CTA → `/book-a-trial/` (SG-01)
- [ ] `app/sg/katong-point/page.test.ts` — NAP "451 Joo Chiat Road, Level 3", Google Maps iframe, MultiBall mention (SG-02)
- [ ] `app/sg/weekly-classes/pillar.test.ts` — all 3 zone sub-pages render unique H1; zones pillar nav has 3 links with correct ages (SG-03)
- [ ] `app/sg/weekly-classes/sports-multiball/page.test.ts` — MultiBall section present, Badge "only in Singapore" (SG-03)
- [ ] `app/sg/prodigy-camps/pillar.test.ts` — all 3 camp-type sub-pages render unique H1; camps pillar nav has 3 links (SG-04)
- [ ] `app/sg/school-partnerships/page.test.ts` — IFS callout text present (SG-06)
- [ ] `app/sg/coaches/page.test.ts` — Haikel + Mark + Coach King coach names present (SG-08)
- [ ] `app/sg/faq/page.test.ts` — 10 Q&A entries render, FAQPage JSON-LD script tag present (SG-10)
- [ ] `app/sg/book-a-trial/booking-form.test.ts` — form submits `market: "sg"`, subject pre-fill from `?subject=birthday-party` (SG-11)
- [ ] `tests/no-sg-placeholder-leak.test.ts` — grep-based: no `sg-placeholder` string in any `app/sg/` source file (ALL)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| All 15 SG routes return 200 | SG-01..11 | Next.js pages require live preview render | `curl -I https://<preview-url>/[each route]` after deploy |
| Any SG page → `/book-a-trial/` in ≤2 clicks | SG-01 | Navigation UX — requires browser | Click from SG homepage + Katong Point page |
| Visual-verify SG homepage + Katong Point on mobile viewport | SG-01, SG-02 | Responsive layout, real photography | Open preview URL in Chrome devtools mobile 390px |
| HUMAN-ACTION: SG hero poster + zone images + coach portraits | SG-01..03, SG-08 | Requires user-supplied photography | Drop files → `pnpm photos:process` → resume executor |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

# Phase 5: Singapore Market — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-24
**Phase:** 05-singapore-market
**Areas discussed:** Baloo 2 for Prodigy SG, SGNav structure, SG photography strategy, SG OG image brand color

---

## Baloo 2 for Prodigy SG

| Option | Description | Selected |
|--------|-------------|----------|
| Baloo 2 for Prodigy SG | Activate Baloo 2 on `app/sg/` — amends Phase 2 D-03 to cover both sub-brands (ProGym HK + Prodigy SG). PROJECT.md's intent confirmed: "Baloo for Prodigy" is correct; D-03 wording was HK-specific. | ✓ |
| Unbounded + Manrope only | Keep Phase 2 D-03 strictly as written: Baloo scoped to ProGym only. SG uses root gateway fonts. Creates more visual split but risks SG feeling corporate vs kids-first. | |

**User's choice:** Baloo 2 for Prodigy SG
**Notes:** D-03 is amended: Baloo 2 applies to both ProGym (HK) and Prodigy (SG) sub-brand surfaces. Root gateway stays Unbounded.

---

## SGNav structure

### Primary items
| Option | Description | Selected |
|--------|-------------|----------|
| Weekly Classes + Prodigy Camps dropdowns | Two dropdowns (zones + camp types) + Katong Point + Coaches + FAQ + Book CTA. Mirrors HK two-dropdown pattern. | ✓ |
| Flat nav, no dropdowns | All items as flat links; users navigate to pillar overview pages first. Simpler but less direct. | |

**User's choice:** Weekly Classes [dropdown] | Prodigy Camps [dropdown] | Katong Point | Coaches | FAQ | [Book a Free Trial]

### Book a Free Trial CTA
| Option | Description | Selected |
|--------|-------------|----------|
| Sticky filled button, same as HK | Permanently visible in top-right on scroll. Mobile: large button at Sheet bottom. | ✓ |
| Standard link, no sticky | Regular nav link; simpler but reduces above-fold conversion priority. | |

**User's choice:** Sticky filled button — consistent with HK and the project's core conversion posture.

---

## SG photography strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, I'll provide photos at execute time | Real photos via HUMAN-ACTION checkpoints: hero poster, ×3 zone images, ×3 coach portraits, optional party shot. | ✓ |
| No photos yet — proceed with fallbacks | Solid navy/green hero blocks; no real photography until available. | |

**User's choice:** Real photos provided at execute time.
**Notes:** 4 HUMAN-ACTION gates confirmed: (1) SG hero poster, (2) zone images ×3, (3) coach portraits ×3 (Haikel/Mark/Coach King), (4) birthday party shot (optional). sg-placeholder NOT used on content pages.

---

## SG OG image brand color

| Option | Description | Selected |
|--------|-------------|----------|
| Prodigy green | Prodigy-green background distinguishes SG from HK (navy) in social shares. Reinforces sub-brand. | ✓ |
| Navy (brand consistency) | Same navy as HK and root. Unified look but no visual market distinction. | |

**User's choice:** Prodigy green OG background for SG.
**Notes:** `createSGOgImage()` mirrors `createHKOgImage()` structure, Prodigy-green fill. Planner verifies exact green token from `tailwind.config.ts`.

---

## Claude's Discretion

- Blog stub count — planner decides (recommend 1 stub)
- `/events/` page format — planner decides (recommend evergreen + future Event schema stub)
- Zone sub-page layout template — planner decides shared shell
- Camp-type sub-page layout template — planner decides shared shell
- SGFooter column layout — planner decides
- Map embed approach — Google Maps iframe (same as Phase 4)
- SG metadata base — `sg.proactivsports.com`

## Deferred Ideas

- Real Mux SG hero video — poster fallback sufficient at Phase 5
- Named IFS sub-page — consolidated hub for now; Phase 6 CMS can split
- Multilingual SG content — v1.5
- Real camp-week Event schema — Phase 6
- MultiBall interactive demo — Phase 10+ R&D

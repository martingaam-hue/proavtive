# Phase 4: Hong Kong Market — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-24
**Phase:** 04-hong-kong-market
**Areas discussed:** Hero video, HK nav structure, Coaches page

---

## Hero Video

| Option | Description | Selected |
|--------|-------------|----------|
| HUMAN-ACTION gate | Phase 4 builds hero structure, pauses with checkpoint for Mux playback ID. Poster image renders while checkpoint is outstanding. | ✓ |
| Poster-only fallback | Ship with full-bleed photo hero, add video env var later via one-line config change. | |
| Skip video, photo hero only | Static photo hero same as root gateway — defer video to Phase 6+. | |

**User's choice:** HUMAN-ACTION gate (recommended default)
**Notes:** Consistent with Phase 2 fonts + Phase 3 leadership-portrait patterns. Real video ships when the ID is ready, no fake state ever in production.

---

## HK Nav Structure

### Gymnastics nav item

| Option | Description | Selected |
|--------|-------------|----------|
| Dropdown menu | shadcn NavigationMenu with all 8 sub-programme links | ✓ |
| Pillar link only | Single link to /gymnastics/ pillar; sub-nav within pillar pages | |
| Mega-menu | Full-width panel with programmes + descriptions | |

**User's choice:** Dropdown menu (recommended default)

### Book a Free Trial prominence

| Option | Description | Selected |
|--------|-------------|----------|
| Sticky primary CTA button | Permanently visible in top-right on scroll, filled brand colour | ✓ |
| Hero CTA only | No nav button; CTA in page hero and footer only | |
| Nav link (text only) | Text link, not button-styled | |

**User's choice:** Sticky primary CTA button (recommended default)

### Primary nav items

| Option | Description | Selected |
|--------|-------------|----------|
| Locations, Camps, Coaches, FAQ | 5 items + Book a Trial button (Parties/Schools/Competitions accessible via homepage) | ✓ |
| Locations, Camps, Parties, Coaches, FAQ | 6 items including Parties as primary nav item | |
| All major sections | Full sitemap in nav — too crowded | |

**User's choice:** Locations, Camps, Coaches, FAQ (recommended default)

### Locations nav item

| Option | Description | Selected |
|--------|-------------|----------|
| Dropdown (Wan Chai + Cyberport) | Small dropdown, no overview page needed | ✓ |
| Direct link to /locations/ | Single link to overview page; one extra click to venue | |

**User's choice:** Dropdown (Wan Chai + Cyberport)

---

## Coaches Page

### Data availability

| Option | Description | Selected |
|--------|-------------|----------|
| Photos + names + roles + short bios | Full coaches page; HUMAN-ACTION gate if photos missing | ✓ |
| Names + roles only | Text-only cards; no portrait photos | |
| Coming soon placeholder | Like Phase 3 /news/ — Phase 6 populates via Sanity | |

**User's choice:** Photos + names + roles + short bios

### Listing structure

| Option | Description | Selected |
|--------|-------------|----------|
| One combined HK team list | All coaches under "Meet the ProGym Team"; simpler layout + simpler Phase 6 migration | ✓ |
| Split by venue | Two sections: Wan Chai coaches / Cyberport coaches | |

**User's choice:** One combined HK team list (recommended default)

---

## Claude's Discretion

- Blog stub approach: planner decides between "coming soon" placeholder vs 1–3 hardcoded stub posts shaped to match Phase 6 GROQ schema
- Gymnastics sub-page shared layout template
- HKFooter column layout and social links
- Map embed approach for location pages (iframe embed recommended in RESEARCH.md)
- OG image template variations per HK page

## Deferred Ideas

None — discussion stayed within Phase 4 scope.

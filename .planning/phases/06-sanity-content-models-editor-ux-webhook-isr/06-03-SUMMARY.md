---
phase: 06-sanity-content-models-editor-ux-webhook-isr
plan: 06-03
status: complete
started: 2026-04-25
completed: 2026-04-25
subsystem: cms
tags: [sanity, data-fetching, groq, components, next-sanity]

requires:
  - phase: 06-01
    provides: shared imageWithAlt type, @portabletext/react, @sanity/image-url packages
  - phase: 06-02
    provides: schema field names for GROQ queries

provides:
  - "lib/sanity.client.ts — createClient with useCdn:false, perspective:published, no stega"
  - "lib/sanity.live.ts — defineLive exports: sanityFetch + SanityLive"
  - "lib/queries.ts — 19 named GROQ queries wrapped in defineQuery"
  - "components/sanity-image.tsx — SanityImage component + urlFor helper"
  - "components/portable-text.tsx — PortableText renderer with imageWithAlt, block, marks"
  - "app/layout.tsx updated — <SanityLive /> in body (single placement, per D-15)"

affects: [06-05, 06-06]

tech-stack:
  added: []
  patterns:
    - "All GROQ queries use defineQuery wrapper for TypeGen inference"
    - "Draft exclusion: !(_id in path('drafts.**')) on all public queries"
    - "readTime computed in GROQ: round(length(pt::text(body)) / 5 / 200)"
    - "SanityImage respects hotspot focal point if present"
    - "PortableText uses Phase 2 Tailwind utilities only — no raw hex"
    - "SanityLive placed once in root layout, not in market layouts"

key-files:
  created:
    - lib/sanity.client.ts
    - lib/sanity.live.ts
    - lib/queries.ts
    - components/sanity-image.tsx
    - components/portable-text.tsx
  modified:
    - app/layout.tsx
---

# Plan 06-03 Summary: Data-Fetching Infrastructure

## What Was Built

Created the complete Sanity data-fetching layer: createClient configuration, defineLive exports, 19 GROQ queries using defineQuery, SanityImage component with hotspot support, PortableText renderer with full block/mark/type components, and wired `<SanityLive>` into the root layout.

## Tasks Completed

| # | Task | Status | Commit |
|---|------|--------|--------|
| 1 | Create lib/sanity.client.ts | Done | d79d7ff |
| 2 | Create lib/sanity.live.ts | Done | d79d7ff |
| 3 | Create lib/queries.ts (19 queries) | Done | d79d7ff |
| 4 | Create components/sanity-image.tsx | Done | d79d7ff |
| 5 | Create components/portable-text.tsx | Done | d79d7ff |
| 6 | Add SanityLive to app/layout.tsx | Done | d79d7ff |

## Deviations

- `app/layout.tsx` already had `GoogleAnalytics` import — preserved it alongside `SanityLive` addition. `<SanityLive>` placed inside `<body>` per spec; `<GoogleAnalytics>` kept outside `<body>` (its existing position).

## Self-Check

- [x] `lib/sanity.client.ts` exists with `useCdn: false`, `perspective: 'published'`, NO stega
- [x] `lib/sanity.live.ts` exports `{ sanityFetch, SanityLive }` via `defineLive`
- [x] `lib/queries.ts` has 19 named exports using `defineQuery` wrapper
- [x] Every `post` query includes `"readTime": round(length(pt::text(body)) / 5 / 200)` computed in GROQ
- [x] `homepageBlogQuery` orders by `featured desc, publishedAt desc` and limits to `[0...3]`
- [x] All queries filter out drafts with `!(_id in path("drafts.**"))`
- [x] `components/sanity-image.tsx` exports both `SanityImage` and `urlFor`
- [x] `components/portable-text.tsx` uses Phase 2 Tailwind utilities only (`text-h2`, `font-display`, `text-muted-foreground`, `border-brand-navy/30`) — no raw hex
- [x] `app/layout.tsx` has `<SanityLive />` in body — and ONLY here (not in market layouts)

## Self-Check: PASSED

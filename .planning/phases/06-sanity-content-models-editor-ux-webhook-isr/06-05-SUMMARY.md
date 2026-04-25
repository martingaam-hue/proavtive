---
plan: 06-05
status: complete
commit: 7ef18e3
---

# Plan 06-05 Summary — Wire HK + SG Pages to Live Sanity Data

## What was done

Replaced all hardcoded static data arrays in HK and SG pages with live `sanityFetch` calls. 13 files changed (11 modified, 2 new).

### Pages wired to Sanity

| Page | Query | Tags |
|------|-------|------|
| `app/hk/blog/page.tsx` | `hkBlogListQuery` | `['post']` |
| `app/hk/coaches/page.tsx` | `hkCoachesQuery` | `['coach']` |
| `app/hk/faq/page.tsx` | `hkFaqQuery` | `['faq']` |
| `app/hk/wan-chai/page.tsx` | `venueBySlugQuery` (slug: wan-chai) | `['venue']` |
| `app/hk/cyberport/page.tsx` | `venueBySlugQuery` (slug: cyberport) | `['venue']` |
| `app/hk/holiday-camps/page.tsx` | `hkCampsQuery` | `['camp']` |
| `app/hk/holiday-camps/[slug]/page.tsx` | `campBySlugQuery` | `['camp', 'camp:slug']` |
| `app/sg/blog/page.tsx` | `sgBlogListQuery` | `['post']` |
| `app/sg/coaches/page.tsx` | `sgCoachesQuery` | `['coach']` |
| `app/sg/faq/page.tsx` | `sgFaqQuery` | `['faq']` |
| `app/sg/katong-point/page.tsx` | `venueBySlugQuery` (slug: katong-point) | `['venue']` |
| `app/sg/prodigy-camps/page.tsx` | `sgCampsQuery` | `['camp']` |
| `app/sg/prodigy-camps/[slug]/page.tsx` | `campBySlugQuery` | `['camp', 'camp:slug']` |

### Key patterns applied

- **Graceful fallback**: Venue pages fall back to hardcoded `HK_VENUES`/`KATONG_POINT` static data when Sanity venue doc not yet populated
- **SanityImage**: All portrait/hero image renders use `<SanityImage>` with null-guard checks
- **Event JSON-LD**: Camp slug pages emit `@type: Event` with `startDate`, `endDate`, `location`, `offers`, `priceCurrency` (HKD/SGD per market)
- **ISR**: All `sanityFetch` calls tagged for granular cache invalidation via `revalidateTag`
- **Next.js 15**: Camp slug pages use `params: Promise<{ slug: string }>` + `await params`

### Lint fixes applied

- Removed unused `const venue = sanityVenue ?? FALLBACK_VENUE` line in wan-chai (ESLint: assigned but never used)
- Removed unused `Link` import in sg/coaches/page.tsx (ESLint: defined but never used)

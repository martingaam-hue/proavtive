# Phase 7 Lighthouse Checklist

## Measurement Approach

Manual Chrome DevTools Lighthouse: cold cache, mobile preset, throttled 3G.
Measure on latest Vercel preview deploy (NOT localhost).

## Target Thresholds (all primary pages)

- Performance: ≥ 95
- Accessibility: ≥ 95
- Best Practices: ≥ 95
- SEO: ≥ 95
- LCP: < 2.5s
- INP: < 200ms
- CLS: < 0.1

## Primary Page Set (must all pass)

### Root

- [ ] proactivsports.com/

### HK

- [ ] hk.proactivsports.com/
- [ ] hk.proactivsports.com/wan-chai/
- [ ] hk.proactivsports.com/cyberport/
- [ ] hk.proactivsports.com/gymnastics/
- [ ] hk.proactivsports.com/gymnastics/toddlers/
- [ ] hk.proactivsports.com/gymnastics/beginner/
- [ ] hk.proactivsports.com/gymnastics/intermediate/
- [ ] hk.proactivsports.com/gymnastics/advanced/
- [ ] hk.proactivsports.com/gymnastics/competitive/
- [ ] hk.proactivsports.com/gymnastics/rhythmic/
- [ ] hk.proactivsports.com/gymnastics/adult/
- [ ] hk.proactivsports.com/gymnastics/private/

### SG

- [ ] sg.proactivsports.com/
- [ ] sg.proactivsports.com/katong-point/
- [ ] sg.proactivsports.com/weekly-classes/
- [ ] sg.proactivsports.com/weekly-classes/movement-zone/
- [ ] sg.proactivsports.com/weekly-classes/sports-zone/
- [ ] sg.proactivsports.com/weekly-classes/climbing-zone/
- [ ] sg.proactivsports.com/prodigy-camps/

## Known Acceptable Exclusions

- `/_design/` gallery: expected 55–81 (Mux bootup). Not a primary page.
- Preview deploy X-Robots-Tag header: expected, does not affect score.

## How to Measure

1. Open Chrome DevTools → Lighthouse tab
2. Set: Mobile, Performance + Accessibility + Best Practices + SEO categories
3. Set throttling: Slow 4G
4. Disable extensions
5. Run audit on cold cache (Ctrl+Shift+R to clear before measuring)
6. Record scores in this checklist

## Implementation Notes (Phase 7)

### Why sizes attributes matter (LCP fix)

Without a correct `sizes` attribute, Next.js Image downloads the full-resolution
image for every viewport size, causing LCP to exceed 2.5s on mobile. The hero
`sizes="100vw"` (full-bleed) or `sizes="(max-width: 768px) 100vw, 50vw"` (split
layout) instructs the browser to fetch the minimum-needed image variant.

### Why only one priority per page

`priority` tells Next.js to preload the image. Multiple `priority` images block
other resources and delay LCP. Only the above-fold hero image should have
`priority`.

### Why Suspense on BookingForm

`BookingForm` uses `useSearchParams()` to pre-select venue. Next.js requires any
component using `useSearchParams()` to be wrapped in `<Suspense>` during static
prerender. Without it, the build throws a hard error. With it, the page shell
renders immediately (improving INP) while the form hydrates asynchronously.

### Why dynamic({ ssr: false }) for Mux

`@mux/mux-player-react` targets browser APIs and cannot be server-rendered. The
HK pattern wraps `MuxPlayer` via `VideoPlayer` which uses `dynamic(..., { ssr: false })`
internally. The SG `SGHeroVideo` component delegates to the same `VideoPlayer` —
no additional dynamic() wrapping needed.

---
phase: 04-hong-kong-market
reviewed: 2026-04-24T00:00:00Z
depth: standard
files_reviewed: 53
files_reviewed_list:
  - .env.example
  - app/api/contact/route.ts
  - app/fonts.ts
  - app/hk/birthday-parties/opengraph-image.tsx
  - app/hk/birthday-parties/page.tsx
  - app/hk/blog/opengraph-image.tsx
  - app/hk/blog/page.tsx
  - app/hk/book-a-trial/free-assessment/booking-form.test.tsx
  - app/hk/book-a-trial/free-assessment/booking-form.tsx
  - app/hk/book-a-trial/free-assessment/page.tsx
  - app/hk/book-a-trial/opengraph-image.tsx
  - app/hk/book-a-trial/page.tsx
  - app/hk/coaches/opengraph-image.tsx
  - app/hk/coaches/page.tsx
  - app/hk/competitions-events/page.tsx
  - app/hk/cyberport/opengraph-image.tsx
  - app/hk/cyberport/page.test.tsx
  - app/hk/cyberport/page.tsx
  - app/hk/faq/page.tsx
  - app/hk/gymnastics/adult/page.tsx
  - app/hk/gymnastics/advanced/page.tsx
  - app/hk/gymnastics/beginner/page.tsx
  - app/hk/gymnastics/competitive/page.tsx
  - app/hk/gymnastics/intermediate/page.tsx
  - app/hk/gymnastics/opengraph-image.tsx
  - app/hk/gymnastics/page.tsx
  - app/hk/gymnastics/pillar.test.tsx
  - app/hk/gymnastics/private/page.tsx
  - app/hk/gymnastics/rhythmic/page.tsx
  - app/hk/gymnastics/toddlers/page.tsx
  - app/hk/holiday-camps/opengraph-image.tsx
  - app/hk/holiday-camps/page.tsx
  - app/hk/layout.tsx
  - app/hk/opengraph-image.tsx
  - app/hk/page.test.tsx
  - app/hk/page.tsx
  - app/hk/school-partnerships/page.tsx
  - app/hk/wan-chai/opengraph-image.tsx
  - app/hk/wan-chai/page.test.tsx
  - app/hk/wan-chai/page.tsx
  - components/hk/active-gym-nav-link.tsx
  - components/hk/active-venue-chip.tsx
  - components/hk/gymnastics-pillar-nav.tsx
  - components/hk/hk-footer.tsx
  - components/hk/hk-hero-video.tsx
  - components/hk/hk-nav-mobile.tsx
  - components/hk/hk-nav.tsx
  - components/hk/venue-chip-row.tsx
  - components/hk/venue-map.tsx
  - components/ui/navigation-menu.tsx
  - emails/contact.tsx
  - lib/hk-data.ts
  - lib/og-image.tsx
findings:
  critical: 1
  warning: 6
  info: 7
  total: 14
status: issues_found
---

# Phase 4: Code Review Report

**Reviewed:** 2026-04-24
**Depth:** standard
**Files Reviewed:** 53
**Status:** issues_found

## Summary

Phase 4 delivered a full HK market build: homepage, two venue location pages, gymnastics pillar with 8 sub-programmes, holiday camps, birthday parties, school partnerships, competitions/events, coaches, blog, FAQ, a booking hub, and the free-assessment booking form. The architecture is sound — RSC/Client Island split is correctly applied, env-var handling is defensive, honeypot anti-spam is properly implemented, and the Wave-0 RED tests are correctly wired to turn GREEN on the shipped code.

One critical issue exists in the contact route: the `phone` and `age` fields extracted **after** the env-var guard (line 162–163) can contain arbitrary strings up to no defined maximum length, and both are passed without length validation into the email template. A malicious caller can send kilobytes of content in either field, bypassing the MAX_MESSAGE guard that only applies to `message`. A secondary issue: the `venue` field validation accumulates errors into an `errors` object, but if `venue` is invalid the function does not return early — it continues past the field checks, and the email send is only blocked by the accumulated-errors return at line 149–151. However, because market is validated at line 142 before the errors check, the flow is correct; the concern here is structural readability, not a live exploit.

Beyond the critical finding, there are six warnings covering: a Tailwind class naming issue that will silently produce no styling, two inconsistencies in the HK homepage priority-image test contract (test may falsely pass), a blog card `<h2>` inside a list where `<h3>` is used on all analogous pages, the `ActiveVenueChip` `venueId` prop accepted in the interface but never used inside the component, an inaccessible radio group structure (redundant ARIA), and a `<table>` without `<caption>` or summary on both venue pages. The seven info items cover duplicate code patterns, `<a>` vs `<Link>` inconsistencies, missing `rel` attributes on some cross-domain links, and placeholder coach names that will reach production as "Coach TBD".

All Wave-0 RED tests reviewed (homepage HK-01, venue pages HK-02/HK-03, gymnastics pillar HK-04, booking form HK-12) are correctly structured and will pass against the shipped implementation.

---

## Critical Issues

### CR-01: No length cap on `phone` and `age` fields in the contact API route

**File:** `app/api/contact/route.ts:162-163`

**Issue:** `phone` and `age` are extracted from the request body and passed directly to the `ContactEmail` template without any maximum-length validation. The `MAX_MESSAGE` constant (2000 chars) is only applied to the `message` field. An attacker can POST a request with `phone` or `age` set to an arbitrarily large string (e.g., 1 MB of text), which will be forwarded in full to Resend and rendered in the email. This bypasses the only rate-limiting-adjacent guard in the route and could be used to inflate email content, trigger Resend payload limits, or deliver large bodies to the inbox.

**Fix:**
```typescript
const MAX_SHORT_FIELD = 200; // sufficient for any real phone or age string

const phone = typeof body.phone === "string"
  ? body.phone.trim().slice(0, MAX_SHORT_FIELD)
  : undefined;
const age = typeof body.age === "string"
  ? body.age.trim().slice(0, MAX_SHORT_FIELD)
  : undefined;
const subject = typeof body.subject === "string"
  ? body.subject.trim().slice(0, MAX_SHORT_FIELD)
  : undefined;
```

Apply the same cap to `subject` (line 164), which has the same exposure. Alternatively, add explicit validation with a `400` error response rather than silent truncation, depending on UX preference.

---

## Warnings

### WR-01: `text-cream` Tailwind class does not exist — prose is invisible on navy background

**File:** `app/hk/wan-chai/page.tsx:319`, `app/hk/cyberport/page.tsx:329`, `app/hk/gymnastics/page.tsx:242`, `app/hk/gymnastics/toddlers/page.tsx:175`, `app/hk/book-a-trial/page.tsx:183` (and other gymnastics sub-pages)

**Issue:** Multiple CTA sections on a `bg="navy"` background use the class `text-cream` on the `<p>` body copy:
```tsx
<p className="text-body-lg text-cream mb-6">
```
The project token is `text-brand-cream` (as used correctly in `app/hk/page.tsx` lines 145, 721, 749). `text-cream` has no Tailwind definition and will produce no colour output, meaning the paragraph text will inherit the parent background colour — invisible white-on-white text on the navy strip for users who do not have the token defined. The homepage correctly uses `text-brand-cream` throughout; the venue pages and most gymnastics sub-pages use the broken `text-cream` alias.

**Fix:** Replace all occurrences of `text-cream` with `text-brand-cream` across all affected files. A grep confirms the scope:
```
grep -rn "text-cream" app/hk/ --include="*.tsx"
```

### WR-02: HK homepage Pitfall-6 test will falsely pass — `<HKHeroVideo>` renders TWO `priority` images

**File:** `app/hk/page.test.tsx:171-180`, `components/hk/hk-hero-video.tsx:44-50`

**Issue:** The Wave-0 test at `page.test.tsx:171` asserts `priorityImages.length === 1`. However `hk-hero-video.tsx` is NOT mocked in `page.test.tsx`, and that component renders a `<Image priority>` poster image (line 44). Additionally, the `next/image` mock in the test file (line 86) maps the `priority` prop to `data-priority="true"`. The test stub for `HKHeroVideo` is also absent — the module is imported directly from `components/hk/hk-hero-video.tsx`. Since the test mocks `next/image` but does NOT mock `@/components/hk/hk-hero-video`, the hero video component will import and render its own `<Image priority>` poster alongside any other priority images on the page. There are in fact zero other priority images on the homepage (all section images use fill without priority), so the count of one happens to be correct — but for the wrong reason. If any future section adds a priority image the test will catch it; if the hero mock is later added without the priority-image count update, the test breaks.

More concretely: the mock for `next/dynamic` at line 96–98 maps to `opts?.loading ?? (() => null)` which renders null for the VideoPlayer inside HKHeroVideo, but the `<Image priority>` poster in HKHeroVideo is NOT wrapped in dynamic and WILL render. The test passes correctly today, but the `HKHeroVideo` component should be explicitly mocked like other `components/hk/` entries to make the test's intent clear and stable.

**Fix:** Add an explicit mock for `HKHeroVideo` to `page.test.tsx` so the single-priority-image contract is enforced by design rather than coincidence:
```typescript
vi.mock("@/components/hk/hk-hero-video", () => ({
  HKHeroVideo: ({ posterAlt }: any) => (
    <img src="/mock-poster.webp" alt={posterAlt} data-priority="true" />
  ),
}));
```

### WR-03: Blog page renders `<h2>` for post titles inside a list, inconsistent with all other pages using `<h3>`

**File:** `app/hk/blog/page.tsx:115`

**Issue:** Inside the posts list grid, each post card renders:
```tsx
<h2 className="text-h3 font-display text-foreground mt-3">{post.title}</h2>
```
This is an `<h2>` element with `text-h3` sizing. All analogous title elements on the homepage `BlogSection` (line 651 in `page.tsx`), as well as logically equivalent card headings throughout the codebase, use `<h3>`. Using `<h2>` here creates an incorrect heading hierarchy: the page has one `<h1>` (the blog hero heading), then the posts section header is also `<h2>` (line 113: "New posts coming soon." or the posts grid section header), meaning the post titles are at the same heading level as section headers — confusing for screen reader navigation and harmful to the SEO heading outline.

**Fix:**
```tsx
<h3 className="text-h3 font-display text-foreground mt-3">{post.title}</h3>
```

### WR-04: `ActiveVenueChip` accepts `venueId` prop but never reads it — dead prop creates false interface contract

**File:** `components/hk/active-venue-chip.tsx:21-23`

**Issue:** The `ActiveVenueChipProps` interface declares `venueId: "wan-chai" | "cyberport"` as a required prop, and `VenueChipRow` passes it on every render. However the component body destructures only `href` and `children` — `venueId` is silently ignored:
```typescript
export function ActiveVenueChip({
  href,
  children,
}: ActiveVenueChipProps) {
```
This creates a misleading API contract. Callers believe `venueId` has a functional effect (e.g., aria labelling, active state calculation). If a future developer refactors the active-state logic to use `venueId` instead of `href`, the difference between the two would cause subtle bugs for venues whose `id` and href don't match (e.g., `"wan-chai"` vs `"/wan-chai/"`).

**Fix:** Either remove `venueId` from the props interface and all callsites, or explicitly use it in the component:
```typescript
// Option A: remove the unused prop
export interface ActiveVenueChipProps {
  href: string;
  children: React.ReactNode;
}

// Option B: use it for aria-label
<Link
  href={href}
  aria-label={`ProGym ${venueId === "wan-chai" ? "Wan Chai" : "Cyberport"}`}
  ...
>
```

### WR-05: Redundant ARIA on radio inputs — `aria-checked` conflicts with native `checked` attribute

**File:** `app/hk/book-a-trial/free-assessment/booking-form.tsx:255-256`

**Issue:** The venue radio inputs render both the native `checked` attribute (via the React `checked` prop, line 253) and an explicit `aria-checked` attribute (line 255):
```tsx
<input
  type="radio"
  name="venue"
  value={opt.value}
  checked={checked}
  onChange={() => setVenue(opt.value)}
  className="sr-only"
  aria-checked={checked}  // redundant — native checked already conveys this
  aria-label={opt.label}  // also redundant with the wrapping <label>
  ...
/>
```
For native `<input type="radio">`, the browser/AT derives the checked state from the native attribute. Explicit `aria-checked` is not only redundant — it can cause inconsistency if the values drift. Similarly, `aria-label` on an input that is already wrapped in a `<label>` element creates a conflicting accessible name (the `aria-label` overrides the label text for AT users, meaning they hear the short name but not the `sub` text rendered in the label).

Additionally the outer `<div role="radiogroup">` with `aria-label="Which venue?"` is placed inside a `<fieldset>` that already has a `<legend>` reading "Which venue?". This double-declares the group name, which some screen readers will announce redundantly.

**Fix:**
```tsx
<fieldset>
  <legend className="text-sm font-semibold text-foreground mb-3">
    Which venue?
  </legend>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
    {VENUE_OPTIONS.map((opt) => {
      const checked = venue === opt.value;
      return (
        <label key={opt.value} className={cn(...)}>
          <input
            type="radio"
            name="venue"
            value={opt.value}
            checked={checked}
            onChange={() => setVenue(opt.value)}
            className="sr-only"
            // Remove aria-checked and aria-label — both are redundant here
          />
          ...
        </label>
      );
    })}
  </div>
</fieldset>
```
The `role="radiogroup"` div can be removed entirely; the `<fieldset>` + `<legend>` already provides the correct semantic group.

### WR-06: Opening hours `<table>` missing `<caption>` — fails accessibility and is meaningless without context

**File:** `app/hk/wan-chai/page.tsx:215-229`, `app/hk/cyberport/page.tsx:215-229`

**Issue:** Both venue pages render an HTML `<table>` for opening hours with no `<caption>` element and no `aria-label` or `aria-labelledby` on the table. The heading "Opening hours" is rendered as an `<h2>` above the table but is not programmatically associated with it. Screen reader users navigating to the table via table shortcut keys will encounter a table with no accessible name and no column headers (`<th>` elements), making the content difficult to interpret in isolation. Lighthouse "tables must have captions" audit will flag both pages.

**Fix:**
```tsx
<table className="w-full" aria-label="Opening hours">
  <thead className="sr-only">
    <tr>
      <th scope="col">Days</th>
      <th scope="col">Hours</th>
    </tr>
  </thead>
  <tbody>
    {VENUE.hours.map((h) => (
      <tr key={h.days.join(",")} className="border-b border-border">
        <td className="py-3 font-semibold text-foreground">
          {h.days.join(", ")}
        </td>
        <td className="py-3 text-right text-muted-foreground">
          {h.opens} – {h.closes}
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

---

## Info

### IN-01: Duplicate `createHKOgImage` body — identical to `createRootOgImage` with one extra element

**File:** `lib/og-image.tsx:131-243`

**Issue:** `createHKOgImage` is a near-verbatim copy of `createRootOgImage` (lines 25–122) with a single added div for the "ProActiv Sports Hong Kong" market line. The two functions share: the same try/catch font loading, the same logo SVG loading, the same JSX structure, and the same `ImageResponse` call. If the root OG image design changes (e.g., padding, font size, rainbow strip), the HK version must be updated manually in parallel. This is a maintenance trap, not a runtime bug — but it will cause divergence.

**Fix:** Extract the shared scaffolding into a private `buildOgImageJsx` helper:
```typescript
function buildOgImageJsx(
  title: string,
  tagline: string,
  blocBold: Buffer | null,
  logoDataUri: string,
  marketLine?: string,
) { /* shared JSX */ }
```
Then both `createRootOgImage` and `createHKOgImage` call it with `marketLine` set or unset.

### IN-02: `<a>` vs `<Link>` inconsistency on same-host routes

**File:** `app/hk/page.tsx:162`, `app/hk/wan-chai/page.tsx:139`, `app/hk/cyberport/page.tsx:148`, and gymnastics sub-pages

**Issue:** Several CTAs use plain `<a>` tags for same-host HK paths (e.g., `/book-a-trial/free-assessment/?venue=wan-chai`) with a comment explaining this preserves the trailing slash before the query string. This is a known Next.js `trailingSlash: false` quirk. However the comments should document the specific Next.js version behaviour: as of Next.js 15, `<Link href="/path/?q=v">` does NOT strip the trailing slash if the slash comes before a query string — the normalisation only applies to trailing slashes at the end of the path with no query. The `<a>` tags could be `<Link>` here without the slash being stripped, meaning the workaround may be unnecessary overhead. This is low risk but adds inconsistency.

**Recommendation:** Verify by testing `<Link href="/book-a-trial/free-assessment/?venue=wan-chai">` in the project. If Next.js 15 preserves the slash, replace `<a>` with `<Link>` for prefetch benefits. If it does not, add a code comment citing the specific Next.js issue for future reference.

### IN-03: Missing `rel` on cross-domain `<a>` links in `hk-footer.tsx`

**File:** `components/hk/hk-footer.tsx:173-186`

**Issue:** The "Prodigy Singapore" and "ProActiv Sports Group" cross-domain links do not have `target="_blank"` or `rel="noopener noreferrer"`:
```tsx
<a href={sgUrl} className="block text-sm text-white/80 hover:text-white">
  Prodigy Singapore ↗
</a>
```
The `↗` glyph implies opening in a new tab, but without `target="_blank"` the link navigates in the same tab, abandoning the HK site. This is the opposite of the social icon links directly below, which correctly set `target="_blank" rel="noopener noreferrer"`.

**Fix:**
```tsx
<a
  href={sgUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="block text-sm text-white/80 hover:text-white"
>
  Prodigy Singapore ↗
</a>
```

### IN-04: Blog post cards are not linked — Phase 6 placeholder uses no `href`

**File:** `app/hk/blog/page.tsx:100-128`

**Issue:** Blog post cards in the stub list have no link wrapping them or the post title. The comment on line 100 says "Phase 6 wires href to /blog/[slug]/; Phase 4 ships hash-link placeholder" — but the current implementation has no `href` at all. Users cannot navigate to any post. A temporary `href="#"` or a visually-hidden "coming soon" state would make the non-linkability intentional and legible. As-is, users will see post cards that appear interactive (card hover state) with no clickable target.

**Fix:** Add a `href="#"` or `href={"/blog/" + post.slug + "/"}` with a clear `aria-disabled` state until Phase 6, so the intent is explicit:
```tsx
<a
  href="#"
  aria-disabled="true"
  aria-label={`${post.title} — full article coming soon`}
  className="block h-full cursor-default"
>
  <Card className="overflow-hidden h-full flex flex-col">
    ...
  </Card>
</a>
```

### IN-05: Placeholder coach names ("Coach TBD") will reach production

**File:** `lib/hk-data.ts:167-179`

**Issue:** Two of the three coaches in `HK_COACHES` have `name: "Coach TBD (Wan Chai)"` and `name: "Coach TBD (Cyberport)"`. These names flow into: the coaches page cards, the Person JSON-LD schema (`"name": "Coach TBD (Wan Chai)"`), and the portrait `alt` text (`"Portrait of Coach TBD (Wan Chai), Senior Gymnastics Coach"`). The JSON-LD will be indexed by Google and visible in Knowledge Graph or People Also Ask results. The `HUMAN-ACTION` comment acknowledges this but there is no runtime guard — the placeholder content is shipped to production without a fallback or a conditional hide.

**Recommendation:** Add a build-time check or a runtime conditional that hides coaches whose names include "TBD" from both the rendered page and the JSON-LD schema:
```typescript
const publishableCoaches = HK_COACHES.filter(
  (c) => !c.name.includes("TBD")
);
```
Use `publishableCoaches` in the coaches page and JSON-LD generation until real names are confirmed.

### IN-06: `iframe` rendered by `VenueMap` has both `title` and `aria-label` with identical values

**File:** `components/hk/venue-map.tsx:41-49`

**Issue:** The non-placeholder `<iframe>` branch sets both `title={title}` and `aria-label={title}` to the same string. For iframes, `title` is the ARIA-accessible name (recommended by WCAG 4.1.2); `aria-label` on an iframe overrides `title` but serves the same function. Setting both is redundant and may cause some AT to announce the name twice.

**Fix:** Remove `aria-label` from the iframe — `title` alone is the correct attribute for iframe accessible naming:
```tsx
<iframe
  src={embedSrc}
  title={title}
  width="100%"
  height="300"
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  className={cn("rounded-lg border-0 w-full", className)}
/>
```

### IN-07: `NavigationMenuViewport` exported but not consumed in the `HKNav` dropdown configuration

**File:** `components/ui/navigation-menu.tsx:99-119`, `components/hk/hk-nav.tsx:50`

**Issue:** `HKNav` uses `<NavigationMenu>` without the `viewport` prop (defaults to `true`), which means `NavigationMenuViewport` is rendered as a child of the root by the component. However, the dropdown `<ul>` content in `NavigationMenuContent` inside `HKNav` is styled with a custom `bg-white border border-border rounded-lg shadow-lg` (line 58) that duplicates the viewport styling. With `viewport=true` (default), the Radix viewport acts as a separate floating element and the content's own background/border/shadow will compete with the viewport's `bg-popover shadow ring` styles. This can produce a doubled border or shadow on the dropdown panels.

**Fix:** Set `viewport={false}` on the `NavigationMenu` in `HKNav` to disable the separate viewport element and let the content panel's own styling be the definitive visual surface:
```tsx
<NavigationMenu className="hidden lg:flex" aria-label="Primary" viewport={false}>
```
This matches the `group-data-[viewport=false]` Tailwind variants already wired in `NavigationMenuContent` for exactly this use case.

---

_Reviewed: 2026-04-24_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_

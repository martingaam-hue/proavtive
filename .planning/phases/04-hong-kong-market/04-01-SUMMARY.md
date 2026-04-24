---
phase: 04-hong-kong-market
plan: 01
subsystem: hk-foundation
tags: [phase-4, hk, foundation, shadcn, navigation-menu, wave-0, red-tests]
requirements: [HK-01, HK-02, HK-03, HK-04, HK-05, HK-06, HK-07, HK-08, HK-09, HK-10, HK-11, HK-12]
dependency_graph:
  requires:
    - "components.json (Phase 1 / Plan 01-02 — shadcn CLI config)"
    - "lib/utils.ts (Phase 1 — cn helper)"
    - "tests/setup.ts (Phase 3 / Plan 03-01 — RTL + jest-dom)"
    - "vitest.config.ts (Phase 1 / Plan 01-04 — extended in Phase 3 for jsdom)"
    - "app/root/page.test.tsx + app/root/contact/contact-form.test.tsx (Phase 3 — test pattern analogs)"
  provides:
    - "components/ui/navigation-menu.tsx (NavigationMenu primitive — backs HKNav Gymnastics + Locations dropdowns)"
    - "lib/hk-data.ts (HKVenue, HKCoach, HKBlogPost, HKFAQItem, HKGymnasticsProgramme interfaces + 5 populated constants)"
    - ".env.example Phase 4 section (7 NEXT_PUBLIC_* vars — HUMAN-ACTION handoff)"
    - "5 Wave-0 RED test files (HK-01, HK-02, HK-03, HK-04, HK-12) — Plans 04-03/04/05/07 turn them GREEN"
  affects:
    - "All Phase 4 plans 04-02..04-07 — every page imports from @/lib/hk-data; HKNav (Plan 04-02) imports the navigation-menu primitive"
tech-stack:
  added:
    - "@radix-ui/react-navigation-menu (transitively via radix-ui@1.4.3 metapackage; no package.json change)"
  patterns:
    - "Static-data → CMS-migration-shape compatibility (interfaces mirror Phase 6 Sanity schemas)"
    - "RED test scaffolds with vite-ignore string-path imports so typecheck passes while target pages don't exist"
    - "Env-var fallback to PLACEHOLDER_* sentinel so iframe components can render their fallback surface at build time"
key-files:
  created:
    - "components/ui/navigation-menu.tsx"
    - "lib/hk-data.ts"
    - "app/hk/page.test.tsx"
    - "app/hk/wan-chai/page.test.tsx"
    - "app/hk/cyberport/page.test.tsx"
    - "app/hk/gymnastics/pillar.test.tsx"
    - "app/hk/book-a-trial/free-assessment/booking-form.test.tsx"
    - ".planning/phases/04-hong-kong-market/04-01-PLAN.md (copied from main repo into worktree for execution)"
    - ".planning/phases/04-hong-kong-market/04-PATTERNS.md (copied for execution context)"
  modified:
    - ".env.example (appended Phase 4 section with 7 NEXT_PUBLIC_* vars)"
decisions:
  - "Used radix-ui@1.4.3 metapackage transitive export of react-navigation-menu rather than installing the standalone package — matches Phase 1/2/3 pattern (radix-ui is already pinned). No package.json change."
  - "Cyberport addressStreet set to 'Cyberport Campus' with HUMAN-ACTION comment — strategy doc gives no exact building/floor; Phase 4 plans 04-04 + 04-06 inherit the HUMAN-ACTION gate."
  - "HK_COACHES carries 1 verbatim Monica entry + 2 HUMAN-ACTION TBD placeholders — strategy doc only names Monica; Plan 04-06 portrait HUMAN-ACTION gate (D-09) covers the photo dependency."
  - "HK_FAQ_ITEMS = exactly 16 entries split (3+3+4+2+2+2) per UI-SPEC §4 /faq/ row group spec."
  - "Booking-form honeypot field name set to 'bot-trap' (verbatim Phase 3 carry-forward) rather than UI-SPEC §5.6 'website' value — plan Task 3 explicitly directed bot-trap to keep the route handler unchanged."
  - "Wave-0 RED tests use string-variable dynamic imports (with /* @vite-ignore */) so TypeScript does not fail on missing target pages. Once Plans 04-03/04/05/07 ship the pages, executors should straighten these imports back to literal strings."
metrics:
  duration: "~25min"
  completed: "2026-04-24"
  tasks: 3
  files: 9
  commits: 3
---

# Phase 4 Plan 01: Hong Kong Market Foundation — Summary

Phase 4 foundation in place: shadcn `navigation-menu` primitive, typed HK static-data module mirroring Phase 6 Sanity schemas, 7 documented `NEXT_PUBLIC_*` env vars, and 5 Wave-0 RED test scaffolds that drive Plans 04-03/04/05/07 toward GREEN.

## What Shipped

### Task 1 — `components/ui/navigation-menu.tsx` (commit `6dcbf7d`)
- Installed via `pnpm dlx shadcn@latest add navigation-menu` — preserved `cssVariables=true` + `iconLibrary=lucide` Phase 1 preset.
- 9 named exports: `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuLink`, `NavigationMenuIndicator`, `NavigationMenuViewport`, `navigationMenuTriggerStyle`.
- Uses `cn()` from `@/lib/utils` and `ChevronDownIcon` from `lucide-react` (no `@radix-ui/react-icons` import).
- Header comment tags `Phase 4 / Plan 04-01` per acceptance criterion.
- Backs HKNav Gymnastics (8 items) + Locations (2 items) dropdowns per CONTEXT D-03/D-04.
- **No package.json change**: the existing `radix-ui@1.4.3` metapackage already transitively exposes `@radix-ui/react-navigation-menu`. Verified via `grep -c react-navigation-menu pnpm-lock.yaml` → 3.

### Task 2 — `lib/hk-data.ts` + `.env.example` (commit `9529cc6`)

**6 typed interfaces** (verbatim per UI-SPEC §5.7 binding shape):
- `HKVenueHours { days, opens, closes }`
- `HKVenue { id, nameShort, nameFull, addressStreet, addressLocality, addressRegion, addressCountry, geo, hours, phoneEnvVar, mapEmbedEnvVar, heroImage, serviceArea, apparatus, openedNote?, sizeNote? }`
- `HKCoach { name, role, bio, venueTag?, portrait }`
- `HKBlogPost { title, slug, excerpt, publishedAt, category, readTimeMinutes, heroImage }`
- `HKFAQItem { value, question, answer, group }`
- `HKGymnasticsProgramme { slug, href, label, ageBand, metaTitle, metaDescription, h1, whatTheyLearn, classStructure, venuesOffered }`

**5 populated constants** (verbatim copy from strategy.md PART 4 / 6B / 8 / 12):
| Constant | Count | Notes |
|----------|-------|-------|
| `HK_VENUES` | 2 | Wan Chai (verbatim NAP "15/F, The Hennessy, 256 Hennessy Road"), Cyberport ("5,000 sq ft", "Opened August 2025"). HUMAN-ACTION on Cyberport street + venue hours. |
| `HK_COACHES` | 3 | Monica (Director of Sports, `venueTag: "both"`, verbatim §PART 6B §6 "19 years of children's gymnastics coaching") + 2 HUMAN-ACTION TBD (Wan Chai + Cyberport seniors). |
| `HK_BLOG_POSTS_STUB` | 2 | "What to expect from your child's first gymnastics class in Hong Kong" + "Choosing between Wan Chai and Cyberport: a parent's guide" — proves template shape per CONTEXT Claude's Discretion. |
| `HK_FAQ_ITEMS` | 16 | Grouped 3+3+4+2+2+2 across `about`/`venues`/`gymnastics`/`camps`/`parties`/`pricing` per UI-SPEC §4 /faq/ row. Eight derive verbatim from §PART 6B §10; remaining eight derive from §PART 4 §7-§8 + §PART 8. |
| `HK_GYMNASTICS_PROGRAMMES` | 8 | Slugs match D-03 dropdown verbatim: toddlers / beginner / intermediate / advanced / competitive / rhythmic / adult / private. Each entry has metaTitle + metaDescription + on-page H1 + 4-6 whatTheyLearn bullets + classStructure paragraph + venuesOffered. Rhythmic is `["wan-chai"]` (Cyberport TBD). |

**Env-var derived map-embed constants:**
- `WAN_CHAI_MAP_EMBED` and `CYBERPORT_MAP_EMBED` — both fall back to `PLACEHOLDER_*` so the VenueMap component (Plan 04-04) can render its fallback surface without crashing at build time.

**`.env.example` additions** (under new `# Phase 4 — Hong Kong market (Plan 04-01)` section):
- `NEXT_PUBLIC_MUX_HK_HERO_PLAYBACK_ID` (D-01 hero video HUMAN-ACTION)
- `NEXT_PUBLIC_HK_PHONE`
- `NEXT_PUBLIC_HK_WHATSAPP`
- `NEXT_PUBLIC_HK_PHONE_CYBERPORT` (optional)
- `NEXT_PUBLIC_ROOT_URL` (HK→Root cross-subdomain absolute hrefs)
- `NEXT_PUBLIC_WAN_CHAI_MAP_EMBED` + `NEXT_PUBLIC_CYBERPORT_MAP_EMBED` (D-04 map iframes)
- `NEXT_PUBLIC_SG_URL` is reused from the Phase 3 block (already present) — no duplicate added.

### Task 3 — 5 Wave-0 RED test scaffolds (commit `7598263`)

| File | HK req | `it`/`test` blocks | Notes |
|------|--------|-------------------|-------|
| `app/hk/page.test.tsx` | HK-01 | 5 | H1 'Premium gymnastics' + venue chip labels + Book CTA + FAQPage JSON-LD + Pitfall 6 single priority image |
| `app/hk/wan-chai/page.test.tsx` | HK-02 | 5 | Verbatim NAP + VenueMap iframe + a11y title + opening hours + ?venue=wan-chai pre-fill + SportsActivityLocation JSON-LD |
| `app/hk/cyberport/page.test.tsx` | HK-03 | 5 | '5,000 sq ft' marker + H1 contains 'Cyberport' + VenueMap a11y + ?venue=cyberport pre-fill + SportsActivityLocation JSON-LD |
| `app/hk/gymnastics/pillar.test.tsx` | HK-04 | 5 (3 are `it.each` × 8 = 17 effective tests) | Data sanity (8 entries, href shape) + pillar link coverage + sub-page H1 + sub-page GymPillarNav + booking CTA |
| `app/hk/book-a-trial/free-assessment/booking-form.test.tsx` | HK-12 | 5 | 6 fields + bot-trap honeypot + ?venue= pre-fill + POST `/api/contact` Free Assessment Request payload + submitting state + success heading |

**RED-state confirmation** (`pnpm test:unit --run`):
- 5 test files / 37 individual HK assertions FAIL (exactly the intended Wave-0 contract — pages don't exist yet).
- 10 other test files / 48 assertions PASS (Phase 1-3 still GREEN — no regression).
- All HK failures are runtime missing-module or content-mismatch errors. No config-level errors.

**Type / lint sanity:**
- `pnpm typecheck` exits 0 (string-variable + `/* @vite-ignore */` import indirection lets TypeScript skip resolution of yet-unbuilt target pages).
- `pnpm lint` exits 0 with 8 `<img>` warnings (mirrors existing Phase 3 test pattern — same warnings appear on Phase 3's `app/root/*/*.test.tsx` files).

## Deviations from Plan

**1. [Rule 3 - Blocking] Plan + PATTERNS files copied into worktree**
- **Found during:** Initial file-read step
- **Issue:** The orchestrator spawned the worktree with the worktree base set to commit `349fe99` (which only contains 04-CONTEXT/RESEARCH/UI-SPEC/VALIDATION). The 04-01-PLAN.md and 04-PATTERNS.md files exist in the parent repo as untracked files but were not present in the worktree.
- **Fix:** Copied the two files from `/Users/martin/Projects/proactive/.planning/phases/04-hong-kong-market/` into the worktree's planning directory before starting Task 1 so all `@.planning/...` references resolve locally and so the artifacts are preserved when the worktree merges back.
- **Files modified:** `.planning/phases/04-hong-kong-market/04-01-PLAN.md` (copy), `.planning/phases/04-hong-kong-market/04-PATTERNS.md` (copy)
- **Commit:** Bundled into Task 1 commit `6dcbf7d`

**2. [Rule 3 - Blocking] node_modules missing in worktree → ran pnpm install**
- **Found during:** Task 1 verify (`pnpm typecheck`)
- **Issue:** Fresh worktree had `package.json` but no `node_modules` directory. `tsc: command not found` blocked typecheck.
- **Fix:** Ran `pnpm install` once. The lefthook prepare script failed (core.hooksPath conflict — expected in worktree context, doesn't affect typecheck/test/lint). All deps installed cleanly otherwise.
- **Commit:** No commit needed — pnpm-lock.yaml already pinned the exact versions.

**3. [Rule 1 - Bug] RED tests originally type-failed — added vite-ignore + string-variable indirection**
- **Found during:** Task 3 verify (`pnpm typecheck`)
- **Issue:** Initial test files used literal `await import("./page")`. TypeScript correctly rejected these because the target pages do not exist yet (they are RED-state targets shipped by future plans).
- **Fix:** Changed each missing-module dynamic import to a string-variable form `const path = "./page"; await import(/* @vite-ignore */ path) as any` so TypeScript skips resolution. Tests still fail at runtime with `Cannot find module` — exactly the RED contract per plan Task 3 acceptance.
- **Files modified:** `app/hk/page.test.tsx` (cosmetic — page exists, just needed `as any` cast), `app/hk/wan-chai/page.test.tsx`, `app/hk/cyberport/page.test.tsx`, `app/hk/gymnastics/pillar.test.tsx`, `app/hk/book-a-trial/free-assessment/booking-form.test.tsx`
- **Commit:** Bundled into Task 3 commit `7598263`

**4. [Rule 1 - Bug] Pillar test had only 3 `it()` blocks (acceptance asks ≥5) — added 2 data-sanity smoke tests**
- **Found during:** Task 3 verify (acceptance criterion grep count)
- **Issue:** The pillar test relied on `it.each(HK_GYMNASTICS_PROGRAMMES)` which expands to 8 tests at runtime per block — semantically rich, but the literal `it(`/`test(` invocation count was 3. Acceptance criterion explicitly counts invocations (≥5).
- **Fix:** Added a `Gymnastics pillar (HK-04) — data sanity` describe block with 2 tests asserting `HK_GYMNASTICS_PROGRAMMES.length === 8` and href shape (every entry starts with `/gymnastics/` and ends with `/`). These also surface data drift early if a future plan accidentally mutates the constant shape.
- **Files modified:** `app/hk/gymnastics/pillar.test.tsx`
- **Commit:** Bundled into Task 3 commit `7598263`

## Authentication Gates

None — Plan 04-01 is pure code authoring + dep install. The HUMAN-ACTION gates (Mux ID, phone, WhatsApp, map embed URLs, Cyberport address, venue hours, coach portraits) are **declared** in `.env.example` and `lib/hk-data.ts` comments but only **trigger** when consuming plans (04-03 hero video, 04-04 location pages, 04-06 coaches) try to render them.

## Carry-Forward Notes for Plan 04-02 onwards

**Plan 04-02 (Layout chrome)** can now:
```ts
import { HKVenue, HK_VENUES } from "@/lib/hk-data";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
```

**Plan 04-03 (HK homepage)** turns `app/hk/page.test.tsx` GREEN by replacing the Phase 1 stub with the 12-section homepage. The test verifies: H1 contains "Premium gymnastics", venue chip labels render, primary CTA hrefs `/book-a-trial/free-assessment/`, FAQPage JSON-LD inline `<script type="application/ld+json">`, exactly one `<Image priority>`. Use mocked Phase 2 primitives — match the mock surface in the test file.

**Plan 04-04 (Location pages)** turns `app/hk/wan-chai/page.test.tsx` + `app/hk/cyberport/page.test.tsx` GREEN. Plan must:
- Import `HK_VENUES` and pick by `id`
- Render verbatim `addressStreet` so the NAP test passes
- Wire `<VenueMap>` (Plan 04-02 ships) with non-empty `title` for a11y
- Render hours with `09:00` appearing twice (already in `HK_VENUES[0].hours`)
- Build CTA hrefs as `/book-a-trial/free-assessment/?venue=wan-chai` (and `?venue=cyberport`)
- Inline `<script type="application/ld+json">` containing `"@type":"SportsActivityLocation"`

**Plan 04-05 (Gymnastics pillar + 8 sub-pages)** turns `app/hk/gymnastics/pillar.test.tsx` GREEN. Plan must:
- Build 8 `app/hk/gymnastics/<slug>/page.tsx` files driven by `HK_GYMNASTICS_PROGRAMMES`
- Each sub-page renders an `<h1>` with the programme's `h1` field
- Each sub-page renders the `<GymPillarNav>` component (Plan 04-02 ships) AND a `/book-a-trial/free-assessment/` link

**Plan 04-07 (Booking flow)** turns `app/hk/book-a-trial/free-assessment/booking-form.test.tsx` GREEN. Plan must:
- 6 visible fields with the exact label-text regex matched in the test (`/your name/i`, `/email/i`, `/phone/i`, `/child('s)? age/i`, `/(anything we should know|message)/i`)
- Venue selector as `[role="radiogroup"]` with `<radio>` items where Wan Chai gets `aria-checked="true"` (or `data-state="checked"`) when `?venue=wan-chai`
- Honeypot input `name="bot-trap"` with `tabindex="-1"` (verbatim Phase 3 D-04 carry-forward)
- POST `/api/contact` with JSON body containing `market: "hk"`, `subject: "Free Assessment Request"`, `venue` from the URL
- Submitting state: button label contains `Sending` AND `disabled` is true
- Success heading: literal text `Thanks — your free assessment request is in.`

**Future plans should reverse the vite-ignore indirection** in the test files once their target page lands — the indirection is RED-state scaffolding only; literal imports give better IDE navigation once the green path exists.

## Self-Check: PASSED

**Files:**
- FOUND: `components/ui/navigation-menu.tsx`
- FOUND: `lib/hk-data.ts`
- FOUND: `app/hk/page.test.tsx`
- FOUND: `app/hk/wan-chai/page.test.tsx`
- FOUND: `app/hk/cyberport/page.test.tsx`
- FOUND: `app/hk/gymnastics/pillar.test.tsx`
- FOUND: `app/hk/book-a-trial/free-assessment/booking-form.test.tsx`
- FOUND: `.planning/phases/04-hong-kong-market/04-01-PLAN.md` (worktree copy)
- FOUND: `.planning/phases/04-hong-kong-market/04-PATTERNS.md` (worktree copy)
- FOUND: `.env.example` (modified — Phase 4 section appended)

**Commits:**
- FOUND: `6dcbf7d` — feat(04-01): install shadcn navigation-menu primitive
- FOUND: `9529cc6` — feat(04-01): add lib/hk-data.ts + Phase 4 env-var contract
- FOUND: `7598263` — test(04-01): add 5 Wave-0 RED test scaffolds for HK pages

**Verification:**
- `pnpm typecheck` exits 0 — confirmed.
- `pnpm test:unit --run` reports 37 RED HK tests + 48 GREEN Phase 1-3 tests — confirmed (no config errors, only intended runtime failures).
- `pnpm lint` exits 0 with 8 `<img>` warnings (matches Phase 3 analog pattern) — confirmed.

## Threat Flags

None new. The plan's STRIDE register accepted T-04-01-01 (shadcn supply chain — Phase 1-3 trust precedent), T-04-01-02 (`.env.example` placeholder vars are public-by-design `NEXT_PUBLIC_*`), T-04-01-03 (test files in `app/` tree don't render as routes — Next.js convention verified by Phase 1 Plan 01-04), T-04-01-04 (5 new test files keep the suite well under any DoS threshold). No new attack surface introduced; all four dispositions remain valid post-execute.

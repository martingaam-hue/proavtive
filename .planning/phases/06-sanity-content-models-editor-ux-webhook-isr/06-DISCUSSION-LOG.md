# Phase 6: Sanity Content Models, Editor UX, Webhook → ISR — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-24
**Phase:** 06-sanity-content-models-editor-ux-webhook-isr
**Areas discussed:** Sanity plan tier, Frontend wiring scope, Visual editing depth, Dataset isolation

---

## Sanity Plan Tier

| Option | Description | Selected |
|--------|-------------|----------|
| Free (lapsed trial) | No Scheduled Drafts, no custom roles. 5 built-in roles only. | ✓ |
| Growth (or active trial) | Scheduled Drafts + 5 built-in roles. $99/month. | |
| Enterprise | Custom roles. Full strategy PART 13.5 5-role model. | |

**User's choice:** Free (lapsed trial)
**Notes:** Project `zs77se7r` is on Free plan. Trial has lapsed.

---

### Scheduled Publishing Fallback

| Option | Description | Selected |
|--------|-------------|----------|
| Drop it for now | Editors set `publishedAt` manually; posts go live on Publish click. Upgrade to Growth later. | ✓ |
| Vercel cron fallback | Cron job checks for future-dated posts and triggers revalidation. More complex. | |

**User's choice:** Drop it for now
**Notes:** CMS-07 scheduled publishing is de-scoped for v1.0.

---

### Role Model

| Option | Description | Selected |
|--------|-------------|----------|
| Simple 4-role model | Admin / Editor / Contributor / Viewer. No Studio UI conditionals needed. | ✓ |
| Full 5-role with UI conditionals | All 5 built-in roles with Studio `currentUser.roles` conditionals to simulate Author/Marketing. | |

**User's choice:** Simple 4-role model
**Notes:** Admin, Editor, Contributor, Viewer. Editor covers Marketing intent; Contributor covers Author/blogger intent.

---

## Frontend Wiring Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Full wiring — all CMS types | All hardcoded arrays replaced: venue, coach, FAQ, testimonials, plus required SCs. | ✓ |
| SC-minimum only | Wire only siteSettings + posts + camps. Venue/coach/FAQ stays hardcoded. | |

**User's choice:** Full wiring — all CMS types
**Notes:** Full editorial independence for all content types.

---

### Blog Post [slug] Routes

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — add [slug] routes | Dynamic blog post pages for HK + SG with Portable Text body. | ✓ |
| No — hub only | Blog hub lists live posts but no individual post pages yet. | |

**User's choice:** Yes — add [slug] routes
**Notes:** New scope beyond Phase 4/5. Both `app/hk/blog/[slug]/page.tsx` and `app/sg/blog/[slug]/page.tsx` added.

---

### Market Settings Singletons

| Option | Description | Selected |
|--------|-------------|----------|
| One settings doc per market | `hkSettings` + `sgSettings` singletons for independent market homepage editing. | ✓ |
| Root only for now | Only `siteSettings` (root gateway) editable; HK/SG homepages stay hardcoded. | |

**User's choice:** One settings doc per market
**Notes:** New singletons beyond the ROADMAP rough shape. Planner allocates a dedicated plan for this.

---

## Visual Editing Depth

| Option | Description | Selected |
|--------|-------------|----------|
| Draft Mode + URL resolver only | Presentation iframe wired per document type. Editors preview drafts. | ✓ |
| Full Vercel Visual Editing | Stega encoding + cursor overlays. Click-to-edit from preview page. Much better UX, more effort. | |

**User's choice:** Draft Mode + URL resolver only
**Notes:** Full Visual Editing deferred post-launch.

---

### Preview URL Target

| Option | Description | Selected |
|--------|-------------|----------|
| NEXT_PUBLIC_VERCEL_URL env var | Auto-updates on every Vercel deploy. No manual config. | ✓ |
| Hardcoded preview URL | Fixed URL — breaks on every redeploy until Phase 10. | |

**User's choice:** NEXT_PUBLIC_VERCEL_URL env var

---

## Dataset Isolation

| Option | Description | Selected |
|--------|-------------|----------|
| Keep single 'production' dataset | Simpler. One set of env vars. Phase 1 D-10 confirmed. | ✓ |
| Add a 'development' dataset | Safer for schema experiments. Two sets of env vars. | |

**User's choice:** Keep single 'production' dataset
**Notes:** Phase 1 D-10 decision confirmed.

---

## Claude's Discretion

- `sanity/structure.ts` final shape (extend singleton pattern)
- `lib/sanity.client.ts` vs existing config (update in place)
- `SanityImage` + `PortableText` component placement
- Blog post `readTime` calculation in GROQ
- GROQ query file location (`lib/queries.ts`)
- Featured post editorial convention (field description only, no runtime enforcement)
- `SANITY_REVALIDATE_SECRET` generation (HUMAN-ACTION checkpoint)
- Webhook filter in manage.sanity.io (all document types)
- `category` document type definition

## Deferred Ideas

- Full Vercel Visual Editing (stega cursor overlays) — post-launch
- Scheduled publishing — upgrade to Growth when blog is active
- Custom Sanity roles — Enterprise plan
- Development dataset — post-launch if needed
- `studio.proactivsports.com` dedicated host — post-Phase 10
- Programme CMS type for gymnastics sub-pages — stays hardcoded

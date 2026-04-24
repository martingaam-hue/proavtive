---
phase: 06-sanity-content-models-editor-ux-webhook-isr
plan: 06-04
status: complete
started: 2026-04-25
completed: 2026-04-25
subsystem: cms
tags: [sanity, webhook, isr, draft-mode, revalidation]

requires:
  - phase: 06-03
    provides: lib/sanity.client.ts (used in draft-mode/enable route)

provides:
  - "app/api/revalidate/route.ts — HMAC-verified Sanity webhook handler with 3s CDN delay"
  - "app/api/draft-mode/enable/route.ts — Draft Mode enable for Presentation tool"
  - "sanity.config.ts updated — full Presentation tool config with resolve.locations for 7 document types"

affects: [06-05, 06-06]

tech-stack:
  added: []
  patterns:
    - "revalidate route uses Node.js runtime (NOT edge) — revalidateTag fails silently on edge"
    - "parseBody called with true (3s delay) to prevent CDN propagation race condition"
    - "revalidateTag called for both _type and post:slug when slug is present"
    - "defineEnableDraftMode uses client.withConfig({ token }) for editor-level access"
    - "previewOrigin reads NEXT_PUBLIC_VERCEL_URL with localhost:3000 fallback"
    - "resolve.locations maps post/camp/venue/coach/siteSettings/hkSettings/sgSettings"

key-files:
  created:
    - app/api/revalidate/route.ts
    - app/api/draft-mode/enable/route.ts
  modified:
    - sanity.config.ts
---

# Plan 06-04 Summary: Webhook ISR Pipeline + Draft Mode Routes

## What Was Built

Created the two Next.js API routes that power the CMS live-update infrastructure: a Sanity webhook handler (`/api/revalidate`) with HMAC signature verification, 3s CDN delay, and `revalidateTag` calls; a Draft Mode enable route (`/api/draft-mode/enable`) for the Presentation tool preview iframe. Updated `sanity.config.ts` to replace the Phase 1 Presentation stub with a full `previewUrl` config and `resolve.locations` mapping for all 7 content types.

## Tasks Completed

| # | Task | Status | Commit |
|---|------|--------|--------|
| 1 | Create app/api/revalidate/route.ts | Done | ec1a1de |
| 2 | Create app/api/draft-mode/enable/route.ts | Done | ec1a1de |
| 3 | Update sanity.config.ts Presentation config | Done | ec1a1de |

## Deviations

None. All spec requirements implemented exactly.

## HUMAN-ACTION Required

### 1. Configure Sanity Webhook in manage.sanity.io

**Steps:**
1. Go to `https://manage.sanity.io/projects/zs77se7r/api/webhooks`
2. Click "Add webhook"
3. URL: `https://{latest-vercel-preview-url}/api/revalidate`
4. HTTP method: POST
5. Secret: value of `SANITY_REVALIDATE_SECRET` env var (generate with `openssl rand -base64 32`)
6. Filter: `_type in ["post", "siteSettings", "hkSettings", "sgSettings", "venue", "camp", "coach", "faq", "testimonial", "page"]`
7. Projection: `{ _type, _id, "slug": slug }`
8. Enable: checked

### 2. Set SANITY_REVALIDATE_SECRET in Vercel

1. Generate: `openssl rand -base64 32`
2. Add to Vercel project → Settings → Environment Variables → all environments
3. Also add to `.env.local` for local testing

### 3. Verify SANITY_API_READ_TOKEN permission level

The token used in `app/api/draft-mode/enable/route.ts` must have **Editor** permission (not Viewer). Verify in `manage.sanity.io` → API → Tokens.

## Self-Check

- [x] `app/api/revalidate/route.ts` does NOT have `export const runtime = 'edge'`
- [x] `parseBody` called with `true` as third argument (3s delay)
- [x] `revalidateTag(body._type)` called unconditionally after valid signature
- [x] Slug-specific `revalidateTag('post:' + body.slug.current)` called when slug is present
- [x] Returns `401` for invalid signature, `400` for missing `_type`, `200` for success
- [x] `app/api/draft-mode/enable/route.ts` uses `defineEnableDraftMode` with `client.withConfig({ token: SANITY_API_READ_TOKEN })`
- [x] `sanity.config.ts` has `previewOrigin` using `NEXT_PUBLIC_VERCEL_URL` with localhost fallback
- [x] `presentationTool` has `resolve.locations` for `post`, `camp`, `venue`, `coach`, `siteSettings`, `hkSettings`, `sgSettings`
- [x] HUMAN-ACTION checkpoint emitted for webhook configuration in manage.sanity.io
- [x] HUMAN-ACTION checkpoint emitted for `SANITY_REVALIDATE_SECRET` generation and Vercel env setup

## Self-Check: PASSED

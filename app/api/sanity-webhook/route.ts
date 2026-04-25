// Phase 10 / Plan 10-03 — Sanity webhook endpoint at /api/sanity-webhook
// This route exists so the Vercel WAF bypass rule (Task 4) can target a
// canonical path. The actual HMAC-verified revalidation logic lives at
// app/api/revalidate/route.ts (created Phase 6) using next-sanity/webhook's
// parseBody() which performs the same HMAC-SHA256 verification as
// @sanity/webhook-toolkit's isValidSignature().
//
// Vercel WAF bypass rule must reference: /api/sanity-webhook
// (the path Sanity should be configured to POST to in production)
//
// RUNTIME: Node.js (default). DO NOT add `export const runtime = 'edge'` —
// revalidateTag silently fails on edge runtime. See CONTEXT D-12.
import { parseBody } from 'next-sanity/webhook'
import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

interface WebhookPayload {
  _type: string
  _id: string
  slug?: { current: string }
}

const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  // Verify HMAC-SHA256 signature from Sanity webhook header.
  // parseBody reads the raw body as text (required for HMAC verification),
  // verifies the sanity-webhook-signature header, and waits 3s for CDN
  // propagation before we revalidate (prevents stale-content race condition).
  try {
    const { body, isValidSignature } = await parseBody<WebhookPayload>(
      req,
      SANITY_WEBHOOK_SECRET,
      true, // 3s CDN propagation delay
    )

    if (!isValidSignature) {
      console.warn('[sanity-webhook] Invalid signature — request rejected')
      return new Response('Invalid signature', { status: 401 })
    }

    if (!body?._type) {
      return new Response('Bad Request — missing _type', { status: 400 })
    }

    // Revalidate cache tag for this document type (covers all sanityFetch() calls)
    revalidateTag(body._type)

    // Slug-specific tag for blog posts
    if (body.slug?.current) {
      revalidateTag(`post:${body.slug.current}`)
    }

    console.log(`[sanity-webhook] Revalidated: ${body._type} (id: ${body._id})`)

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      id: body._id,
    })
  } catch (err) {
    console.error('[sanity-webhook] Error:', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}

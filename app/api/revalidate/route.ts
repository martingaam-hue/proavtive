// Webhook handler: Sanity publishes → POST /api/revalidate → revalidateTag
// RUNTIME: Node.js (default). DO NOT add `export const runtime = 'edge'` — revalidateTag
// silently fails on edge runtime. See CONTEXT D-12 / RESEARCH Pitfall 2.
import { parseBody } from 'next-sanity/webhook'
import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

interface WebhookPayload {
  _type: string
  _id: string
  slug?: { current: string }
}

export async function POST(req: NextRequest) {
  try {
    // parseBody verifies HMAC signature and adds a ~3s delay (third arg `true`) to wait
    // for Sanity CDN propagation before revalidating. Prevents stale-content race condition.
    // See CONTEXT D-11 / RESEARCH Pitfall 1.
    const { body, isValidSignature } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      true, // 3s CDN propagation delay — mandatory per D-11
    )

    if (!isValidSignature) {
      console.warn('[revalidate] Invalid webhook signature')
      return new Response('Invalid signature', { status: 401 })
    }

    if (!body?._type) {
      return new Response('Bad Request — missing _type', { status: 400 })
    }

    // Bust cache for all sanityFetch() calls tagged with this document type (D-10)
    revalidateTag(body._type)

    // Slug-specific tag for blog posts (D-13)
    if (body.slug?.current) {
      revalidateTag(`post:${body.slug.current}`)
    }

    console.log(`[revalidate] Revalidated tag: ${body._type} (id: ${body._id})`)

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      id: body._id,
    })
  } catch (err) {
    console.error('[revalidate] Webhook error:', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}

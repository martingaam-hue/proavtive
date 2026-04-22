// D-19: Sentry smoke route. Throws ONLY when ?token=<SENTRY_SMOKE_TOKEN>.
// Returns 404 for unauthorised hits so crawlers / scanners cannot abuse it (T-00-22, T-00-23).
//
// Usage: after a deploy, hit
//   https://<preview-url>/api/sentry-smoke?token=<SENTRY_SMOKE_TOKEN>
// and confirm an issue titled "sentry-smoke — deliberate error" appears in Sentry within 60s,
// tagged with environment: preview (or production) and the Vercel commit SHA as release.

import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // never cached

export async function GET(req: NextRequest) {
  const expected = process.env.SENTRY_SMOKE_TOKEN;
  const provided = req.nextUrl.searchParams.get("token");

  // No token configured on this env → pretend the route doesn't exist.
  if (!expected) {
    return new NextResponse("Not Found", { status: 404 });
  }

  if (!provided || !timingSafeEqual(provided, expected)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Deliberate throw — server Sentry SDK captures and reports to the issue feed.
  throw new Error("sentry-smoke — deliberate error");
}

// Timing-safe string comparison so we don't leak expected length via response time.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

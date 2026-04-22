// Phase 1 / Plan 01-01 — Subdomain routing middleware.
//
// D-01 precedence ladder: Host > cookie (x-market) > query (?__market=) > default root.
// D-02: known Host values (hk.*, sg.*) are AUTHORITATIVE and cannot be overridden by cookie/query.
//       This is the security posture encoded by the Plan 01-04 hostile-request Vitest test.
// D-03: unknown hosts (plain *.vercel.app, typos, www.*, bot-set headers, plain localhost:3000) route to root.
// D-04 INTENT: markets stay invisible in external URLs. NextResponse.rewrite() is an INTERNAL rewrite —
//              the browser URL bar never shows the /root|/hk|/sg prefix. The plain-folder mechanism
//              (app/root/, app/hk/, app/sg/) is an implementation detail chosen because three parens-named
//              route groups cannot all resolve to "/" in Next.js 15 (build-time conflict). The user-facing
//              URL contract of D-04 is fully preserved — the filesystem layout is the only change from the
//              parens-group mechanism originally named in CONTEXT.md D-04.
// D-05: plain localhost:3000 routes to root via unknown-host fallthrough (no special-case code path).
//
// Intentional-obsolescence note (CONTEXT.md specifics §1, §2):
// The x-market cookie + ?__market= query bridge is a Phase 1–9 preview-window mechanism because
// Vercel Hobby does not give us wildcard subdomains on *.vercel.app. Once Phase 10 attaches
// proactivsports.com via Cloudflare + binds hk.*/sg.* to Vercel, the bridge becomes unused
// fallback code — but STAYS in middleware as a defensive default for unknown hosts. Do NOT remove
// during the Phase 10 cutover.
//
// Sentry: middleware errors surface automatically via sentry.edge.config.ts (loaded by
// instrumentation.ts register() when NEXT_RUNTIME === "edge"). Do NOT import @sentry/nextjs here.

import { NextResponse, type NextRequest } from "next/server";

type Market = "root" | "hk" | "sg";

const MARKET_COOKIE = "x-market";
const MARKET_QUERY = "__market";
const KNOWN_MARKETS: readonly Market[] = ["root", "hk", "sg"] as const;

/**
 * Resolve the market from the Host header.
 * Returns "hk" for host starting with "hk." (e.g., hk.proactivsports.com, hk.localhost:3000).
 * Returns "sg" likewise.
 * Returns "root" for host starting with "root." (dev URL root.localhost:3000).
 * Returns null for unrecognised hosts — caller falls through the precedence ladder.
 *
 * D-02: the prefix match is intentionally exact ("hk." not just "hk") so "hkstudio.proactivsports.com"
 * would NOT match and would fall through to root. Defensive — see Plan 01-04 Vitest T-01-04 case.
 */
function resolveHostMarket(host: string | null): Market | null {
  if (!host) return null;
  // Strip port for localhost dev URLs (hk.localhost:3000 -> hk.localhost).
  const bare = host.split(":")[0].toLowerCase();
  if (bare.startsWith("hk.")) return "hk";
  if (bare.startsWith("sg.")) return "sg";
  if (bare.startsWith("root.")) return "root";
  return null;
}

function isKnownMarket(value: string | undefined): value is Market {
  return value !== undefined && (KNOWN_MARKETS as readonly string[]).includes(value);
}

export function middleware(req: NextRequest): NextResponse {
  // --- D-01 Step 1: Host is authoritative ---
  const hostMarket = resolveHostMarket(req.headers.get("host"));
  if (hostMarket !== null) {
    // Hostile cookie/query are ignored per D-02.
    return rewriteToMarket(req, hostMarket);
  }

  // --- D-01 Step 2: cookie fallback (preview bridge) ---
  const cookieValue = req.cookies.get(MARKET_COOKIE)?.value;
  if (isKnownMarket(cookieValue)) {
    return rewriteToMarket(req, cookieValue);
  }

  // --- D-01 Step 3: query fallback (preview bridge; sets cookie for subsequent requests) ---
  const queryValue = req.nextUrl.searchParams.get(MARKET_QUERY) ?? undefined;
  if (isKnownMarket(queryValue)) {
    const res = rewriteToMarket(req, queryValue);
    // Claude's Discretion (CONTEXT.md): name=x-market, path=/, SameSite=Lax, Secure only in production.
    // Session cookie (no maxAge) so preview hopping between markets doesn't linger beyond the tab.
    res.cookies.set({
      name: MARKET_COOKIE,
      value: queryValue,
      path: "/",
      sameSite: "lax",
      secure: process.env.VERCEL_ENV === "production",
      httpOnly: false, // client-readable is fine; this is a routing hint, not a secret
    });
    return res;
  }

  // --- D-01 Step 4: default root (D-03 unknown-host fallthrough, D-05 plain localhost) ---
  return rewriteToMarket(req, "root");
}

/**
 * Internal rewrite to /{market}/{pathname}. Plain-folder targets (app/root/, app/hk/, app/sg/)
 * created in Task 1 handle the resulting resolved path. Because this is a REWRITE (not a redirect),
 * the client's URL bar never changes — D-04's "markets invisible in external URLs" invariant holds.
 */
function rewriteToMarket(req: NextRequest, market: Market): NextResponse {
  const url = req.nextUrl.clone();
  // For "/" we rewrite to "/{market}" (no trailing slash — Next.js handles this).
  // For "/foo" we rewrite to "/{market}/foo".
  url.pathname = url.pathname === "/" ? `/${market}` : `/${market}${url.pathname}`;
  return NextResponse.rewrite(url);
}

// --- Matcher (Claude's Discretion — exclude non-routable paths) ---
// Excludes: _next/* (Next internals), api/health (future health-check route — not created yet, but reserved),
//           favicon.ico, monitoring (Sentry tunnel per next.config.ts line 45), static assets by extension.
// Rationale: these paths must NEVER route into a market-specific tree even if the Host matches — they are
// either Next internals, Sentry's tunnel (T-MIDDLEWARE-BYPASS mitigation), or static assets.
// NOTE: /studio is NOT excluded here — Plan 01-03 Task 2 patches this matcher to add `studio` per D-07
// (Studio reachable on any host). The Plan 01-04 Vitest test asserts /studio pass-through as a regression gate.
export const config = {
  matcher: [
    "/((?!_next/|api/health|favicon\\.ico|monitoring|.*\\.(?:svg|png|jpg|jpeg|webp|avif|ico|gif|woff2?)).*)",
  ],
};

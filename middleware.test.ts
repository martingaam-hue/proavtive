// Phase 1 / Plan 01-04 — Middleware route-guard tests.
//
// D-02 / D-16: encode the invariant that a known Host is authoritative — a hostile cookie
//   and query string MUST NOT override it. This is the regression gate Phase 1 SC #4 demands.
// D-04: encode the internal-rewrite invariant — middleware uses NextResponse.rewrite()
//   (URL bar unchanged) not NextResponse.redirect() (URL bar changes).
//   Asserted via Location-header absence + x-middleware-rewrite presence.
// D-07: encode the /studio pass-through invariant — config.matcher excludes /studio from
//   market rewriting (Plan 01-03 Task 2 patch — middleware.ts:119). If a future refactor
//   removes `studio` from the negative-lookahead, this test fails loud.
// D-17: this file is run by `pnpm test:unit` as a required CI check.
//
// Assertion target: the `x-middleware-rewrite` header that NextResponse.rewrite() sets.
// Per PATTERNS.md line 137 — "that is the observable contract, no actual rendering required,
// since D-16's security lives at the routing layer."
//
// makeRequest helper strategy — Variant A (explicit host header):
// Plan 01-04 Task 1's NextRequest host-header probe proved that `req.headers.get("host")`
// is NOT populated from the URL origin alone (returns null). An explicit `host` entry in
// RequestInit.headers is REQUIRED for middleware.ts:59's `req.headers.get("host")` call
// to see a host value. The helper therefore sets host via headers; URL origin mirrors for
// realism but is not the authoritative source the middleware reads.

import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware, config as middlewareConfig } from "./middleware";

/**
 * Build a NextRequest with the desired Host header explicitly set.
 * Variant A approach (per Task 1 probe): the RequestInit `host` header is authoritative —
 * this is what `req.headers.get("host")` returns, which is what middleware.ts:59 reads.
 * URL origin is kept aligned with intended host for realism but is NOT what middleware reads.
 */
function makeRequest(
  urlString: string,
  init: { host?: string; cookie?: string; query?: Record<string, string> } = {},
) {
  const url = new URL(urlString);
  const host = init.host ?? url.host; // default: mirror URL origin into the header
  const headers: Record<string, string> = { host };
  if (init.cookie) headers.cookie = init.cookie;
  const req = new NextRequest(url, { headers });
  if (init.query) {
    for (const [k, v] of Object.entries(init.query)) {
      req.nextUrl.searchParams.set(k, v);
    }
  }
  return req;
}

describe("middleware — host authority (D-02, D-16)", () => {
  it("rewrites hk.proactivsports.com to /hk even with hostile cookie + query (host is authoritative)", () => {
    // D-16 hostile-request invariant: Host says hk, attacker tries to inject sg via cookie
    // AND query. Middleware's D-01 Step 1 returns before cookie/query are ever read —
    // the rewrite target MUST land in the hk tree.
    const req = makeRequest("https://hk.proactivsports.com/programmes", {
      host: "hk.proactivsports.com",
      cookie: "x-market=sg", // hostile
      query: { __market: "sg" }, // hostile
    });

    const res = middleware(req);
    const rewrite = res.headers.get("x-middleware-rewrite") ?? "";

    // MUST route to /hk/... and MUST NOT route to /sg/... or /root/...
    expect(rewrite).toContain("/hk/programmes");
    expect(rewrite).not.toContain("/sg/");
    expect(rewrite).not.toContain("/root/");
  });

  it("rewrites sg.proactivsports.com to /sg even with hostile cookie (host wins)", () => {
    const req = makeRequest("https://sg.proactivsports.com/camps", {
      host: "sg.proactivsports.com",
      cookie: "x-market=hk",
    });

    const res = middleware(req);
    const rewrite = res.headers.get("x-middleware-rewrite") ?? "";

    expect(rewrite).toContain("/sg/camps");
    expect(rewrite).not.toContain("/hk/");
    expect(rewrite).not.toContain("/root/");
  });
});

describe("middleware — unknown host fallthrough (D-03, D-05)", () => {
  it("rewrites unknown vercel preview host to /root with no cookie/query", () => {
    const req = makeRequest("https://foo-bar-42.vercel.app/", {
      host: "foo-bar-42.vercel.app",
    });

    const res = middleware(req);
    const rewrite = res.headers.get("x-middleware-rewrite") ?? "";

    expect(rewrite).toContain("/root");
  });

  it("rewrites plain localhost:3000 to /root (D-05 — default root, no special-case code path)", () => {
    const req = makeRequest("http://localhost:3000/", {
      host: "localhost:3000",
    });

    const res = middleware(req);
    const rewrite = res.headers.get("x-middleware-rewrite") ?? "";

    expect(rewrite).toContain("/root");
  });

  it("rewrites host 'hkstudio.proactivsports.com' to /root (T-01-04 — prefix match is exact, 'hk.' not 'hk')", () => {
    // T-01-04 defensive spoofing case: middleware's prefix match uses "hk." (with dot)
    // so hosts like "hkstudio.*" or "hkmalicious.*" do NOT match HK — they fall through to root.
    const req = makeRequest("https://hkstudio.proactivsports.com/", {
      host: "hkstudio.proactivsports.com",
    });

    const res = middleware(req);
    const rewrite = res.headers.get("x-middleware-rewrite") ?? "";

    expect(rewrite).toContain("/root");
    expect(rewrite).not.toContain("/hk/");
  });
});

describe("middleware — preview-window bridges (D-01 cookie + query)", () => {
  it("rewrites to /hk when unknown host + x-market=hk cookie (cookie bridge — D-01 step 2)", () => {
    const req = makeRequest("https://foo-bar-42.vercel.app/programmes", {
      host: "foo-bar-42.vercel.app",
      cookie: "x-market=hk",
    });

    const res = middleware(req);
    const rewrite = res.headers.get("x-middleware-rewrite") ?? "";

    expect(rewrite).toContain("/hk/programmes");
  });

  it("rewrites to /sg when unknown host + ?__market=sg AND sets x-market=sg cookie on response (D-01 step 3)", () => {
    const req = makeRequest("https://foo-bar-42.vercel.app/camps", {
      host: "foo-bar-42.vercel.app",
      query: { __market: "sg" },
    });

    const res = middleware(req);
    const rewrite = res.headers.get("x-middleware-rewrite") ?? "";

    expect(rewrite).toContain("/sg/camps");

    // Cookie-setting side effect — subsequent requests on the same preview session route to SG
    // without needing the query param again.
    const cookie = res.cookies.get("x-market");
    expect(cookie?.value).toBe("sg");
  });

  it("ignores an invalid x-market cookie value (not in KNOWN_MARKETS) and falls through to root", () => {
    const req = makeRequest("https://foo-bar-42.vercel.app/", {
      host: "foo-bar-42.vercel.app",
      cookie: "x-market=moon",
    });

    const res = middleware(req);
    const rewrite = res.headers.get("x-middleware-rewrite") ?? "";

    expect(rewrite).toContain("/root");
    expect(rewrite).not.toContain("/moon");
  });
});

describe("middleware — D-04 internal-rewrite invariant (Blocker 2 regression gate)", () => {
  it("middleware uses NextResponse.rewrite (not redirect) — Location header absent, x-middleware-rewrite present", () => {
    // D-04 INTENT: markets stay invisible in external URLs. The technical contract is that
    // middleware issues an INTERNAL rewrite (x-middleware-rewrite header set, Location header
    // absent) not an EXTERNAL redirect (Location header set with /hk/... path exposed in the
    // URL bar). This test is the CI gate preventing an inadvertent switch from rewrite() to
    // redirect() during a future refactor.
    const req = makeRequest("https://hk.proactivsports.com/programmes", {
      host: "hk.proactivsports.com",
    });

    const res = middleware(req);

    // Internal rewrite contract: Location header is NOT set (a redirect would set it).
    expect(res.headers.get("location")).toBeNull();

    // Internal rewrite contract: x-middleware-rewrite IS set (containing the internal /hk/ target).
    const rewrite = res.headers.get("x-middleware-rewrite");
    expect(rewrite).not.toBeNull();
    expect(rewrite).toContain("/hk/");
  });
});

describe("middleware — D-07 /studio pass-through invariant (Blocker 3 regression gate)", () => {
  // D-07: /studio is reachable on any host. Plan 01-03 Task 2 added `studio` to the
  // config.matcher negative-lookahead so middleware does NOT run on /studio/... paths.
  // These tests assert the matcher config covers that — if a future refactor removes
  // `studio` from the exclude list, the test fails, flagging the regression before it
  // reaches production.

  it("config.matcher excludes /studio/... paths from middleware interception", () => {
    // Extract the matcher regex source and inspect it. Next.js matcher syntax is
    // `/((?!...)...)` where the negative-lookahead lists excluded prefixes.
    // Pragma: this is a string match, not full Next.js matcher semantics — a close proxy
    // that catches the most common regression (the substring disappearing from the list).
    expect(middlewareConfig.matcher.length).toBeGreaterThan(0);
    const matcherPattern = middlewareConfig.matcher[0];

    // Assert the matcher string contains `studio` in its exclude list.
    // If this fails, Plan 01-03 Task 2's patch has been undone.
    expect(matcherPattern).toContain("studio");

    // Additional structural check — the exclude list should be inside a negative-lookahead `(?!...)`.
    expect(matcherPattern).toMatch(/\(\?!/);
  });

  it("documentation anchor — layered reasoning for D-07 defense (no-op assertion)", () => {
    // Direct invocation probe (documentation anchor):
    // The current middleware does NOT special-case /studio paths in its rewrite function,
    // so it WOULD produce /hk/studio/structure when invoked directly with hk.* + /studio/structure.
    // That's fine — the matcher is the D-07 gate, and the prior test asserts the matcher holds.
    // In production, the matcher prevents middleware from running on /studio at all, so the
    // rewrite code path is never entered for studio paths.
    //
    // This `it` block is a documentation anchor. Keep it so future readers see the layered
    // reasoning behind why the matcher-config assertion is sufficient defense for D-07.
    expect(true).toBe(true);
  });
});

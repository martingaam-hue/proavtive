import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Phase 0 / Plan 00-03 — X-Robots-Tag: noindex, nofollow on all non-production deploys (D-15).
// Phase 0 / Plan 00-05 — wrapped with withSentryConfig (source-map upload, release tagging, ad-blocker tunnel).
const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Phase 1 / Plan 01-03 — transpile Sanity packages so Next.js's transformer
  // handles `import { useEffectEvent } from 'react'` through its CJS-interop
  // layer. React 19.2's `useEffectEvent` is exposed only via React's conditional
  // CJS stub (`index.js` re-exports from `cjs/react.production.js`), which
  // webpack's static analyzer cannot trace through — it reports "attempted
  // import error" even though the symbol exists at runtime. Transpiling the
  // consuming packages rewrites the named imports to use proper CJS interop.
  transpilePackages: ["sanity", "@sanity/vision", "@sanity/visual-editing"],

  async headers() {
    // VERCEL_ENV is auto-injected by Vercel at runtime:
    //   'production'  — the live custom domain (Phase 10)
    //   'preview'     — every PR / branch preview
    //   'development' — `vercel dev` locally
    // Block indexing on anything that is NOT production — belt-and-braces behind Deployment Protection (D-14).
    const isProd = process.env.VERCEL_ENV === "production";

    if (isProd) {
      // Production: no noindex header. Real robots.txt ships in Phase 7 (SEO-03).
      return [];
    }

    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

// Sentry build-time wrap: uploads source maps via SENTRY_AUTH_TOKEN (set in Vercel env),
// tags releases with VERCEL_GIT_COMMIT_SHA, and proxies ingest through /monitoring
// to bypass ad-blockers. org + project read from SENTRY_ORG / SENTRY_PROJECT env.
// When SENTRY_AUTH_TOKEN is missing (local dev, CI without token), source-map upload
// is skipped and the build still succeeds.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Upload more client files for better stack-trace resolution
  widenClientFileUpload: true,

  // Proxy Sentry ingest through our domain — avoids ad-blocker drops
  tunnelRoute: "/monitoring",

  // Suppress non-CI build output
  silent: !process.env.CI,

  // Keep source maps off the public bundle (still uploaded to Sentry for un-minified stack traces)
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },

  // Disable Sentry's Vercel Logger wrapping (we handle our own logging in Phase 6+)
  disableLogger: true,
});

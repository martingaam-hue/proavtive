import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Phase 9 / Plan 09-02 — Security headers (MIG-03).
// CSP covers all Phase 0–8 resource origins. `unsafe-inline` is required for
// GTM (script-src) and Tailwind/shadcn inline styles (style-src).
// Post-launch hardening: introduce CSP nonce via middleware to remove unsafe-inline.
const CSP_HEADER = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://cdn.sanity.io",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://cdn.sanity.io https://image.mux.com https://*.googleusercontent.com",
  "media-src 'self' https://stream.mux.com https://www.googleapis.com",
  "connect-src 'self' https://*.sanity.io https://www.google-analytics.com https://analytics.google.com https://*.sentry.io",
  "frame-src 'self' https://www.google.com https://maps.google.com https://www.googletagmanager.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

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

  // Phase 2 / Plan 02-05 — Vercel image optimization config per UI-SPEC §5.3 + DS-04.
  // formats: AVIF preferred (smaller), WebP fallback, automatic per-request negotiation.
  // deviceSizes + imageSizes: full Next.js default spectrum + hero-tier 1920 anchor.
  // minimumCacheTTL: 31 days — long cache for edge-served variants.
  // remotePatterns: cdn.sanity.io for Phase 6 CMS-uploaded images (configured now, used then).
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2678400,
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },

  async headers() {
    // VERCEL_ENV is auto-injected by Vercel at runtime:
    //   'production'  — the live custom domain (Phase 10)
    //   'preview'     — every PR / branch preview
    //   'development' — `vercel dev` locally
    const isProd = process.env.VERCEL_ENV === "production";

    // Security headers applied to ALL routes on ALL environments.
    // HSTS includeSubDomains covers hk.* and sg.* once domain is live (Phase 10).
    // X-Frame-Options SAMEORIGIN allows Sanity Studio iframe (same-origin embed).
    const securityHeaders = [
      {
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains; preload",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "X-Frame-Options",
        value: "SAMEORIGIN",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), payment=()",
      },
      {
        key: "Content-Security-Policy",
        value: CSP_HEADER,
      },
    ];

    if (isProd) {
      // Production: security headers only — no noindex.
      return [
        {
          source: "/(.*)",
          headers: securityHeaders,
        },
      ];
    }

    // Non-production (preview / dev): security headers + noindex.
    // Belt-and-braces behind Deployment Protection (D-14). Real robots.txt ships in Phase 7 (SEO-03).
    return [
      {
        source: "/(.*)",
        headers: [...securityHeaders, { key: "X-Robots-Tag", value: "noindex, nofollow" }],
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

import type { NextConfig } from "next";

// Phase 0 / Plan 00-03 — X-Robots-Tag: noindex, nofollow on all non-production deploys (D-15).
// Plan 00-05 will wrap the default export with withSentryConfig(...) — keep shape wrap-friendly.
const nextConfig: NextConfig = {
  reactStrictMode: true,

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

export default nextConfig;

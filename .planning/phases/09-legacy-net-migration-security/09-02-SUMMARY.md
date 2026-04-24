---
plan: "09-02"
phase: 09
status: complete
commit: "2cf2ff7"
---

# Summary: 09-02 Security Headers in next.config.ts

## What Was Built

Added six security headers to `next.config.ts` via a `CSP_HEADER` TypeScript constant and a rewritten `headers()` function. Headers apply on ALL environments (production and preview/dev). `X-Robots-Tag: noindex, nofollow` is still conditionally applied on non-production only (behaviour preserved from Phase 0).

## Key Files

- `next.config.ts` — added `CSP_HEADER` constant + replaced `headers()` function body

## Headers Added

| Header | Value |
|--------|-------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=()` |
| `Content-Security-Policy` | Full CSP covering GTM, Sanity CDN, Mux, Google Fonts, Sentry |

## Verification

- `pnpm typecheck` exits 0
- `pnpm build` exits 0
- Pre-commit hooks (gitleaks + lint-staged ESLint + Prettier) all pass

## Deviations

None. Source pattern changed from `/:path*` to `/(.*)`  as specified in the plan (Vercel-recommended catch-all).

## Post-Launch Hardening Note

`unsafe-inline` in `script-src` and `style-src` is required for GTM and Tailwind. Post-launch hardening path: introduce CSP nonce via middleware to remove `unsafe-inline`.

## Self-Check: PASSED

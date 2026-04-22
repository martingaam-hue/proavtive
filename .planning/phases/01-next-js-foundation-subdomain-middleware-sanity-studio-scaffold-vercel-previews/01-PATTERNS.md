# Phase 1: Next.js foundation, subdomain middleware, Sanity Studio scaffold, Vercel previews — Pattern Map

**Mapped:** 2026-04-22
**Files analyzed:** 22 (new + modified)
**Analogs found:** 15 / 22 (7 files have no in-repo analog — first-of-kind patterns)

> **Context snapshot:** Phase 0 left a minimal scaffold. There is no `src/`, no components, no middleware, no CMS. The repo root is the canonical location for config (`next.config.ts`, `instrumentation.ts`, Sentry runtime files). Phase 1 introduces four new conventions the repo has not yet expressed: (1) `middleware.ts` at root with host-based rewrites, (2) App Router **route groups** (`(root)`, `(hk)`, `(sg)`) replacing the current flat `app/page.tsx`, (3) an **embedded Sanity Studio** at `/studio`, and (4) **Vitest** scoped to middleware. Existing Phase 0 files provide strong analogs for env-contract, Sentry wiring, commit discipline, CI shape, and conditional `next.config.ts` behaviour — but not for Sanity, Studio mount, route groups, or unit tests. Those files are marked **"no analog — first-of-kind."**

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `middleware.ts` | middleware | request-response (rewrite) | `app/api/sentry-smoke/route.ts` | role-match (both edge/server request handlers using `NextRequest`/`NextResponse`, both returning early for unknown inputs) — no true middleware analog exists |
| `middleware.test.ts` | test | request-response assertions | (none) | **no analog — first unit test in repo** |
| `app/(root)/layout.tsx` | layout | render | `app/layout.tsx` | exact (both are App Router layouts exporting `metadata` + returning `<html>`/`<body>` shell) |
| `app/(root)/page.tsx` | page | render | `app/page.tsx` | role-match (both are App Router server pages) — current `app/page.tsx` is boilerplate being **deleted** |
| `app/(hk)/layout.tsx` | layout | render | `app/layout.tsx` | exact (sibling layout pattern within a route group) |
| `app/(hk)/page.tsx` | page | render | `app/page.tsx` | role-match |
| `app/(sg)/layout.tsx` | layout | render | `app/layout.tsx` | exact |
| `app/(sg)/page.tsx` | page | render | `app/page.tsx` | role-match |
| `app/studio/[[...tool]]/page.tsx` | page (catch-all) | render (client-heavy, embedded Studio) | (none) | **no analog — first `next-sanity` embedded mount** |
| `sanity.config.ts` | config | config | `next.config.ts` | role-match (both are root-level TS config modules exporting a typed default; wrap + compose plugins) |
| `sanity/schemaTypes/*.ts` (8 stubs) | model (schema) | data-model | (none) | **no analog — first Sanity schema** |
| `sanity/schemaTypes/index.ts` | barrel | re-export | (none) | no analog — first barrel file in repo |
| `sanity/structure.ts` | config | config | `next.config.ts` | partial — config module shape only; domain-specific (Sanity structure-tool) is new |
| `vitest.config.ts` | config | config | `eslint.config.mjs` + `postcss.config.mjs` | role-match (root-level TS/MJS config exporting a typed default) |
| `components/ui/button.tsx` | component | render | (none — would be first primitive) | no analog — shadcn CLI scaffolds it; treat the CLI output as authoritative |
| `lib/utils.ts` | utility | pure function | (none) | no analog — shadcn CLI scaffolds it (`cn()` helper) |
| `components.json` | config (tooling) | config | `.prettierrc.json` + `vercel.json` | role-match (root-level JSON tooling config; CLI-written, not hand-authored) |
| `.env.example` | config (env contract) | config | `.env.example` (itself — Sentry block is the append template) | **exact** — literally append below the existing Sentry block |
| `package.json` | config (deps + scripts) | config | `package.json` (itself) | **exact** — Phase 0's dep + script pattern is the template |
| `.github/workflows/ci.yml` | config (CI) | config | `.github/workflows/ci.yml` (itself — add a 5th step) | **exact** — the 5-step pattern slots `test:unit` between `Build` and `Gitleaks` |
| `app/page.tsx` (DELETED) | page | — | — | N/A — `create-next-app` boilerplate removed |
| `app/layout.tsx` (MODIFIED or KEPT) | layout | — | `app/layout.tsx` (itself) | **exact** — current layout stays as the HTML shell; Geist + `<html lang="en">` + body classes preserved per UI-SPEC §Typography + §Accessibility baseline |

---

## Pattern Assignments

### `middleware.ts` (middleware, request-response rewrite)

**Analog:** `app/api/sentry-smoke/route.ts` (closest in the repo — both are edge/server request handlers using `NextRequest`, returning a `NextResponse`, with early-return guards for unknown/unauthorised inputs).

**Imports pattern** (lines 9–11 of `app/api/sentry-smoke/route.ts`):
```typescript
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // never cached
```
Copy the `import { NextResponse, type NextRequest } from "next/server"` line verbatim. `runtime` is **not** needed for middleware (Next.js 15 middleware now runs on the Node.js runtime by default under Fluid Compute — see CONTEXT.md canonical_refs). Do NOT export a `runtime` constant from `middleware.ts`; it's unsupported.

**Early-return guard pattern** (lines 18–26 of `app/api/sentry-smoke/route.ts`) — this is the template for D-02's "known Host is authoritative, else fall through" precedence:
```typescript
// No token configured on this env → pretend the route doesn't exist.
if (!expected) {
  return new NextResponse("Not Found", { status: 404 });
}

if (!provided || !timingSafeEqual(provided, expected)) {
  return new NextResponse("Not Found", { status: 404 });
}
```
**How to adapt for middleware:** replace the `404` early-return with `NextResponse.rewrite(new URL('/<market>/<path>', req.url))` branches. Precedence ladder per D-01: `Host match → cookie match → query match → default root`. Each step is an `if` with an early `return` — exactly the shape above.

**Comment discipline pattern** (lines 1–7 of `app/api/sentry-smoke/route.ts`) — copy this commenting style verbatim for middleware:
```typescript
// D-19: Sentry smoke route. Throws ONLY when ?token=<SENTRY_SMOKE_TOKEN>.
// Returns 404 for unauthorised hits so crawlers / scanners cannot abuse it (T-00-22, T-00-23).
//
// Usage: after a deploy, hit
//   https://<preview-url>/api/sentry-smoke?token=<SENTRY_SMOKE_TOKEN>
// and confirm an issue titled "sentry-smoke — deliberate error" appears in Sentry within 60s,
// tagged with environment: preview (or production) and the Vercel commit SHA as release.
```
Header comment on `middleware.ts` MUST cite D-01, D-02, D-03 and explain the query/cookie bridge is a preview-window mechanism that stays as defensive fallback post-Phase 10 (per specifics §2 of CONTEXT.md).

**Timing-safe compare helper pattern** (lines 32–39) — not needed for middleware (we compare hostnames, not secrets), but keep the **file-local helper** shape (small pure function at the bottom of the file, no new module) for any host-parsing helper.

**Sentry integration:** **none added in Phase 1.** The Sentry edge config (`sentry.edge.config.ts` lines 7–28) already initialises on middleware-runtime boot via `instrumentation.ts` (`if (process.env.NEXT_RUNTIME === "edge") { await import("./sentry.edge.config"); }` — lines 10–12 of `instrumentation.ts`). Any `throw` in middleware surfaces automatically — do not import `@sentry/nextjs` in `middleware.ts`.

**Matcher config:** no analog. Per CONTEXT.md Claude's Discretion, exclude `/_next/*`, `/api/health`, static assets (images, fonts), `/favicon.ico`, and `/monitoring` (Sentry tunnel — see `next.config.ts` line 45: `tunnelRoute: "/monitoring"`). Example skeleton:
```typescript
export const config = {
  matcher: [
    // Run on everything EXCEPT the exclusions above.
    "/((?!_next/|api/health|favicon\\.ico|monitoring|.*\\.(?:svg|png|jpg|jpeg|webp|avif|ico|gif|woff2?)).*)",
  ],
};
```

---

### `middleware.test.ts` (test, request-response assertions)

**Analog:** none — first unit test in the repo. Pattern must be established here for Phase 2 component tests to inherit.

**Template (D-16 hostile-request assertion):**
```typescript
import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

describe("middleware — host authority (D-02, D-16)", () => {
  it("rewrites hk.proactivsports.com to /hk regardless of hostile cookie/query", () => {
    const req = new NextRequest(
      new URL("https://hk.proactivsports.com/programmes"),
      {
        headers: {
          host: "hk.proactivsports.com",
          cookie: "x-market=sg", // hostile
        },
      },
    );
    // Also hostile query param.
    req.nextUrl.searchParams.set("__market", "sg");

    const res = middleware(req);

    // Rewrite destination MUST be /hk/... never /sg/... or /(root)/...
    expect(res.headers.get("x-middleware-rewrite")).toContain("/hk/programmes");
  });

  it("falls through to (root) for unknown hosts", () => {
    const req = new NextRequest(new URL("https://foo.vercel.app/"), {
      headers: { host: "foo.vercel.app" },
    });
    const res = middleware(req);
    expect(res.headers.get("x-middleware-rewrite")).toContain("/root/");
  });

  // Additional cases: cookie-preview path, query-preview path, plain localhost fallthrough, reserved subdomain (www.*) fallthrough.
});
```
The assertion target is the internal `x-middleware-rewrite` header that `NextResponse.rewrite()` sets — that is the observable contract, no actual rendering required (matches the "security lives at the routing layer" rationale in D-16).

**Convention seed for Phase 2:** co-locate tests next to source (`middleware.test.ts` beside `middleware.ts`). Phase 2 inherits this pattern when RTL + jsdom land.

---

### `app/(root)/layout.tsx`, `app/(hk)/layout.tsx`, `app/(sg)/layout.tsx` (layout, render)

**Analog:** current `app/layout.tsx` (lines 1–30). Two plausible shapes:

1. **Pattern A — keep root `app/layout.tsx`, groups have thin sub-layouts.** Root layout keeps Geist + `<html>`/`<body>`; each group's `layout.tsx` is a pass-through that only adds the 4px distinguisher stripe from UI-SPEC §Color.
2. **Pattern B — promote the full HTML shell into each group's layout.** Each group fully owns its `<html>` + `<body>`, and `app/layout.tsx` becomes a pure pass-through (or is removed).

**Decision:** Pattern A. Rationale: matches Phase 0 UI-SPEC §Typography ("Geist is disposable" but must stay in Phase 1 via `next/font` preload at root) and keeps the HTML/body shell single-sourced. Phase 3/4/5 can move Geist out when brand fonts land.

**Root `app/layout.tsx` (kept, minor change):** update `metadata.title`/`description` per UI-SPEC §Copywriting Contract. Everything else (lines 1–30) stays:
```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProActiv Sports", // Phase 1 placeholder; per-group titles override via (group)/layout.tsx or (group)/page.tsx
  description: "ProActiv Sports — children's gymnastics & sports (Hong Kong + Singapore).",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

**Group `app/(hk)/layout.tsx` template** (apply the same shape for `(root)` with `bg-slate-400`, `(sg)` with `bg-teal-400`):
```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ProActiv Sports — Hong Kong (Phase 1 placeholder)",
};

export default function HKLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* UI-SPEC §Color — distinguisher stripe for SC #1. Removed in Phase 4. */}
      <div aria-hidden className="h-1 w-full bg-amber-400" />
      {children}
    </>
  );
}
```

**Accessibility constraint:** UI-SPEC §Accessibility baseline — exactly one `<h1>` per page; `<html lang="en">` already in root; no animations.

---

### `app/(root)/page.tsx`, `app/(hk)/page.tsx`, `app/(sg)/page.tsx` (page, render)

**Analog:** current `app/page.tsx` (role-only — it's `create-next-app` boilerplate being **deleted**).

**Template** (copy per-market, swap the three copy strings from UI-SPEC §Copywriting Contract lines 119–138):
```typescript
// Server component — no "use client", no data fetching in Phase 1.
export default function HKPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <section className="w-full max-w-2xl rounded-lg bg-muted p-6">
        <h1 className="text-2xl font-semibold leading-tight">ProActiv Sports — Hong Kong</h1>
        <p className="mt-4 text-base leading-relaxed">
          Placeholder for hk.proactivsports.com. Homepage, venues, and programmes arrive in Phase 4.
        </p>
        {/* Phase 1 example primitive — kept commented until shadcn Button lands (one instance total across pages — see UI-SPEC §Registry Safety). */}
        {/* <Button>Example primitive</Button> */}
      </section>
    </main>
  );
}
```
**Copy MUST be verbatim** per UI-SPEC lines 119–138 (the contract explicitly says "executor MUST use these exact strings"). Same for the three `metadata.title` values with the `(Phase 1 placeholder)` suffix.

**RSC default:** no `"use client"`. UI-SPEC §Performance baseline line 192: "single `<Button>` … server component with zero `"use client"` in the Phase 1 import path if possible."

---

### `app/studio/[[...tool]]/page.tsx` (page catch-all, render — embedded Sanity Studio)

**Analog:** none. This is the first `next-sanity` embedded Studio mount. The canonical pattern is dictated by `next-sanity` docs (CONTEXT.md canonical_refs line 108). The executor follows the current `next-sanity` docs, not an in-repo analog.

**Pattern requirements pulled from CONTEXT.md:**
- D-06: Embedded at `/studio` in the same app (single Vercel deploy, single env).
- D-07: Reachable on any host — middleware must NOT 404 `/studio` on `hk.*`/`sg.*`.
- D-14: Structure + Vision + Presentation plugins installed (Presentation install-only).
- D-15: `X-Robots-Tag: noindex, nofollow` on non-prod already inherits via `next.config.ts` lines 14–26 — no per-route addition.

**Expected shape (per `next-sanity` v3+ docs):**
```typescript
"use client";

/**
 * Sanity Studio mount — D-06 embedded pattern.
 * Studio chrome is Sanity's own UI (UI-SPEC §Color line 98) — we do NOT customise it in Phase 1.
 * `metadata` / `viewport` from next-sanity ensure Studio's responsive layout works.
 */
export { metadata, viewport } from "next-sanity/studio";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```
Studio route **inherits** Phase 0's `noindex` header (no change to `next.config.ts`). Studio route **inherits** Sentry edge init (no new code). Studio route is gated by Vercel Deployment Protection (Phase 0 D-14).

---

### `sanity.config.ts` (config, config — root-level)

**Analog:** `next.config.ts` (role-match — both are root-level TS config modules exporting a typed default; wrap + compose plugins).

**Structural pattern to copy from `next.config.ts`** (lines 1–6, 36–57):
```typescript
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Phase 0 / Plan 00-03 — X-Robots-Tag: noindex, nofollow on all non-production deploys (D-15).
// Phase 0 / Plan 00-05 — wrapped with withSentryConfig (source-map upload, release tagging, ad-blocker tunnel).
const nextConfig: NextConfig = {
  // ...
};

// Sentry build-time wrap: [... explanatory comment ...]
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // ...
});
```
Takeaways for `sanity.config.ts`:
1. **Typed default export** — import the `Config` type from `sanity` package, type the object, default-export.
2. **Env from `process.env`** — `projectId` and `dataset` read from `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` (D-09). Mirrors how `next.config.ts` lines 37–39 pull Sentry env.
3. **Top-of-file header comment citing D-refs** — e.g., `// Phase 1 / Plan 01-XX — embedded Studio (D-06), plugins Structure + Vision + Presentation (D-14), singleton siteSettings (D-12).`
4. **Plugins composed as a top-level array** — same compositional shape as `withSentryConfig(nextConfig, {...})`: wrap/combine at the bottom of the file.

**Expected skeleton:**
```typescript
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { presentationTool } from "sanity/presentation";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

// Phase 1 / Plan 01-XX — embedded Studio (D-06). Plugins: Structure + Vision + Presentation (D-14).
// D-09: env contract is NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET (safe client-side).
// D-12: siteSettings singleton configured via ./sanity/structure.ts.
export default defineConfig({
  name: "default",
  title: "ProActiv Sports",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    visionTool(),
    presentationTool({
      // D-14: install-only — no previewUrl resolver; Phase 6 wires CMS-05.
      previewUrl: { preview: "/" }, // minimal stub; Studio shows "preview not configured" empty state
    }),
  ],
  schema: { types: schemaTypes },
});
```

---

### `sanity/schemaTypes/*.ts` stubs + `sanity/schemaTypes/index.ts` (model, data-model)

**Analog:** none. First Sanity schema in the repo. D-11 specifies the exact minimum shape.

**Template (apply to all 8 files: `siteSettings.ts`, `page.ts`, `post.ts`, `venue.ts`, `coach.ts`, `camp.ts`, `testimonial.ts`, `faq.ts`):**
```typescript
// Phase 1 / Plan 01-XX — D-11 empty stub. Phase 6 (CMS-01) replaces the fields array
// with real content modelling derived from strategy.md PART 13.2 + wireframes (Phases 3–5).
// DO NOT add fields in Phase 1 — the whole point is to establish the type skeleton only.
import { defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [{ name: "title", type: "string", title: "Title" }],
});
```
Per D-12, `siteSettings` is the singleton — but the singleton behaviour lives in `sanity/structure.ts`, not in this file. Keep the stub shape identical across all 8 types; only `name` + `title` differ.

**Barrel `sanity/schemaTypes/index.ts`:**
```typescript
// Barrel re-export for sanity.config.ts `schema.types`.
import { siteSettings } from "./siteSettings";
import { page } from "./page";
import { post } from "./post";
import { venue } from "./venue";
import { coach } from "./coach";
import { camp } from "./camp";
import { testimonial } from "./testimonial";
import { faq } from "./faq";

export const schemaTypes = [siteSettings, page, post, venue, coach, camp, testimonial, faq];
```

---

### `sanity/structure.ts` (config, config — Sanity structure-tool customization)

**Analog:** partial — `next.config.ts` (lines 6–29) for the typed-default-export + top-comment-citing-D-refs shape. Domain-specific structure-tool pattern has no in-repo precedent.

**Template (D-12 singleton pattern for `siteSettings`):**
```typescript
import type { StructureResolver } from "sanity/structure";

// Phase 1 / Plan 01-XX — D-12: singleton pattern anchor. Phase 6 adds more singletons
// (homepage, global nav, footer NAP) by extending the list below.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Singleton: siteSettings — exactly one document of this type, fixed id.
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      // All other types as normal document lists (Phase 6 rewrites these as real editorial flows).
      ...S.documentTypeListItems().filter(
        (listItem) => !["siteSettings"].includes(listItem.getId() ?? ""),
      ),
    ]);
```

---

### `vitest.config.ts` (config, config)

**Analog:** `eslint.config.mjs` (lines 1–22) + `postcss.config.mjs` (lines 1–8) — role-match (root-level TS/MJS config exporting a typed default).

**Structural pattern from `eslint.config.mjs`:**
```typescript
import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";
// ...
const eslintConfig = [
  // ...
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
```
Takeaways: (1) import types + default-export an object/array, (2) explicit `ignores` block listing `.next/**`.

**Template (scope-limited per D-15 — middleware-only, no React plugin):**
```typescript
import { defineConfig } from "vitest/config";

// Phase 1 / Plan 01-XX — D-15: Vitest scoped to middleware + pure-TS unit tests only.
// React Testing Library + jsdom land in Phase 2 (DS-05) and inherit this runner.
// DO NOT add @vitejs/plugin-react or jsdom environment here — Phase 2's UI-SPEC is its contract.
export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**", "out/**", "build/**"],
  },
});
```
Matches the `.next/**`, `out/**`, `build/**` exclude list already used in `eslint.config.mjs` line 18 — copy that exclude-list for consistency.

---

### `components/ui/button.tsx` + `lib/utils.ts` (component + utility)

**Analog:** none. These are **scaffolded by `npx shadcn@latest init` + `npx shadcn@latest add button`** — treat the CLI output as authoritative, don't hand-author.

**Pattern guidance from UI-SPEC §Design System (table on lines 19–25) — feed these exact preset flags to `shadcn init`:**
- `style=new-york`
- `baseColor=neutral`
- `cssVariables=true` (non-negotiable — Phase 2 token swap depends on it)
- `rsc=true`
- `tsx=true`
- Alias: `@/components`, `@/lib/utils`

**Registry safety (UI-SPEC §Registry Safety lines 150–157):** shadcn official registry only; **no third-party blocks** in Phase 1.

**Button is the single example primitive** (CONTEXT.md Claude's Discretion line 60 + UI-SPEC line 152). It renders commented-out on placeholder pages (UI-SPEC lines 123, 130, 137) — the install proves the pipe; no live instance is required for SC purposes.

**`lib/utils.ts`:** CLI scaffolds the standard `cn()` helper that merges `clsx` + `tailwind-merge`. No custom code added in Phase 1.

---

### `components.json` (config, config — shadcn registry)

**Analog:** `.prettierrc.json` (lines 1–6) + `vercel.json` (lines 1–6) — role-match (root-level JSON tooling config, CLI-written, ~6–20 lines).

**Existing JSON-config shape (`vercel.json` lines 1–6):**
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install --frozen-lockfile"
}
```
Takeaways: (1) `$schema` first, (2) compact (no comments — JSON), (3) root-level. shadcn's CLI writes `components.json` following this exact shape. Do not hand-edit — let the CLI write it from the preset flags.

---

### `.env.example` (config, env contract) — **MODIFIED**

**Analog:** `.env.example` itself (lines 1–20). The existing file is the append template.

**Existing pattern to match (lines 1–15):**
```bash
# --- Sentry (Plan 05 — @sentry/nextjs wizard) ---
# Client-exposed DSN (safe — DSN is public by design). Read by sentry.client.config.ts.
NEXT_PUBLIC_SENTRY_DSN=
# Server-only DSN (same value; kept separate so the client bundle cannot accidentally leak server config).
SENTRY_DSN=
# Sentry auth token — server-only. Used by the Sentry webpack plugin for source-map upload on Vercel builds.
# Scope: project:releases + project:write. Rotate per PROJECT.md security discipline. NEVER commit.
SENTRY_AUTH_TOKEN=
```
Conventions to replicate in the Sanity append:
1. Section header `# --- Sanity (Plan 01-XX — embedded Studio wiring) ---`
2. Every var has a one-line comment above it explaining scope (client-exposed vs server-only)
3. Empty `VAR=` lines (no placeholder values — contract only, per D-09)
4. Call out security posture (rotation, never-commit) for secret tokens

**Append block (per D-09 + CONTEXT.md `## Claude's Discretion` bullet on `.env.example`):**
```bash
# --- Sanity (Plan 01-XX — embedded Studio wiring, D-09) ---
# Client-safe (public by design — read by next-sanity client + Studio mount at /studio).
NEXT_PUBLIC_SANITY_PROJECT_ID=
# Client-safe. Phase 1–5 use 'production' only (D-10). Phase 6 may add 'development'.
NEXT_PUBLIC_SANITY_DATASET=
# Server-only. Read-access token for draft/preview content + server fetches.
# Scope: viewer. Rotate per PROJECT.md security discipline. NEVER commit. See docs/ for setup.
SANITY_API_READ_TOKEN=
```

---

### `package.json` (config, deps + scripts) — **MODIFIED**

**Analog:** `package.json` itself (lines 1–45). Current dep + script pattern is the template.

**Existing script pattern to match (lines 10–19):**
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "typecheck": "tsc --noEmit",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "prepare": "lefthook install"
}
```
**New scripts to add (per D-17):**
```json
"test:unit": "vitest run",
"test:unit:watch": "vitest"
```
Match the short-verb style (`"test:unit"`, not `"test-unit"` or `"testUnit"`) — consistent with `format:check`, `typecheck`.

**Existing dependency constraints to preserve (lines 5–9):**
```json
"engines": {
  "node": ">=22.0.0 <23.0.0",
  "pnpm": ">=10.0.0"
},
"packageManager": "pnpm@10.30.3"
```
**Install policy:** per Phase 0 D-13, all new deps via `pnpm add` (never npm/yarn). Sanity + Vitest go into **devDependencies** unless they're imported by runtime code:
- `next-sanity` → **dependencies** (imported by `/studio` route + any future server-side fetch)
- `sanity`, `@sanity/vision`, `sanity/structure`, `sanity/presentation` (all re-exported from the `sanity` main package in v3+), `@sanity/presentation` → **dependencies** (Studio mount evaluates these at runtime in the browser)
- `vitest` → **devDependencies**
- `@vitest/ui` (optional) → **devDependencies**

Current `@sentry/nextjs@^10.49.0` uses caret ranges (line 21) — match that style for new deps unless Sanity docs specify pinned versions.

---

### `.github/workflows/ci.yml` (config, CI) — **MODIFIED**

**Analog:** `.github/workflows/ci.yml` itself (lines 1–76). Phase 0 CI established the pattern; Phase 1 adds the 5th required check.

**Existing step pattern (lines 51–76) — fast-to-slow order is a Phase 0 D-02 decision:**
```yaml
# --- Required check 1 (D-02): typecheck ---
- name: Typecheck
  run: pnpm typecheck

# --- Required check 2 (D-02): lint (ESLint) ---
- name: Lint
  run: pnpm lint

# --- Required check 2b (D-02): Prettier format check ---
- name: Format check
  run: pnpm format:check

# --- Required check 3 (D-02): build ---
- name: Build
  run: pnpm build
  env:
    NEXT_TELEMETRY_DISABLED: "1"

# --- Required check 4 (D-02 / D-07): gitleaks — layer 3 of the four-layer defense ---
- name: Gitleaks
  uses: gitleaks/gitleaks-action@v2
```
**Insertion point:** after `Build`, before `Gitleaks` — so the fast-to-slow ordering stays coherent (unit tests faster than gitleaks full-scan, slower than build-artifact reuse).
```yaml
# --- Required check 5 (Phase 1 / D-17): unit tests (Vitest, middleware-scope) ---
- name: Unit tests
  run: pnpm test:unit
```
**Comment-header convention:** copy the `# --- Required check N (D-XX): <name> ---` style verbatim. Planner MUST also update the top-of-file comment (lines 1–4) to reflect five required checks, not four, and remove the "Deferred (per D-03 / D-04): unit tests (Phase 2)" line since unit tests are no longer deferred.

---

## Shared Patterns

### Pattern: Top-of-file D-ref comment

**Source:** `next.config.ts` lines 1–5, `app/api/sentry-smoke/route.ts` lines 1–7, `instrumentation.ts` lines 1–2, `sentry.server.config.ts` lines 1–4, `sentry.edge.config.ts` lines 1–3.
**Apply to:** every new TypeScript file in Phase 1 (`middleware.ts`, `sanity.config.ts`, `sanity/structure.ts`, each schemaType stub, `vitest.config.ts`, `middleware.test.ts`).

**Shape:**
```typescript
// Phase N / Plan NN-XX — <one-line purpose>
// D-XX: <specific decision this file implements>
// <Cross-ref to strategy.md section or adjacent file if relevant>
```
**Excerpt from `sentry.server.config.ts` (lines 1–4):**
```typescript
// Server-runtime Sentry init — loaded by instrumentation.ts when NEXT_RUNTIME === 'nodejs'.
// Pattern per sentry-nextjs-sdk SKILL.md.
// D-18: environment = VERCEL_ENV
// D-20: conservative PII posture (sendDefaultPii: false + beforeSend scrubber)
```
This comment style doubles as in-code documentation for future-Martin and satisfies CONTEXT.md specifics §1 ("Planner should comment the `middleware.ts` logic so this intentional-obsolescence is clear to future-Martin").

---

### Pattern: Env-var conditional behaviour

**Source:** `next.config.ts` lines 10–28 (VERCEL_ENV conditional headers), `sentry.server.config.ts` line 10 + line 13.
**Apply to:** any new code path that behaves differently per environment.

**Excerpt from `next.config.ts` (lines 14–28):**
```typescript
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
```
**Applies to Phase 1:**
- Middleware may set cookie `Secure` flag conditionally (CONTEXT.md Claude's Discretion on `x-market` cookie). Use the **same `process.env.VERCEL_ENV === "production"` check** pattern — don't invent a new env var.

---

### Pattern: Sentry inheritance without explicit imports

**Source:** `instrumentation.ts` lines 6–14.
**Apply to:** `middleware.ts`, `app/studio/[[...tool]]/page.tsx`.

**Excerpt:**
```typescript
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
```
**Consequence for Phase 1:** middleware runtime errors surface automatically via `sentry.edge.config.ts` — do **not** import `@sentry/nextjs` in `middleware.ts`. Studio client-bundle errors surface via `instrumentation-client.ts`. Zero new Sentry wiring needed.

---

### Pattern: Conventional Commits with phase-plan slug

**Source:** git log (see commits `docs(01): approve ui-spec`, `feat(00-05): install @sentry/nextjs with D-17/D-18/D-19/D-20 hardening`, `feat(00-02): install lefthook + gitleaks + commitlint + lint-staged (Task 1)`). Enforced by `commitlint.config.cjs` + `lefthook.yml` lines 18–21.
**Apply to:** every Phase 1 commit.

**Shape:** `<type>(01-XX): <subject>` where `01-XX` matches the plan number (e.g., `feat(01-01)`, `chore(01-02)`, `docs(01-03)`). Subject max 100 chars (commitlint rule, `commitlint.config.cjs` line 4).

---

### Pattern: Path alias `@/*`

**Source:** `tsconfig.json` lines 21–22.
```json
"paths": {
  "@/*": ["./*"]
}
```
**Apply to:** all new imports in Phase 1 — both shadcn's `@/components` + `@/lib/utils` aliases (UI-SPEC §Design System line 22) and any cross-module import (e.g., `import { schemaTypes } from "@/sanity/schemaTypes"` in `sanity.config.ts`).

shadcn's `components.json` MUST emit the aliases `@/components` and `@/lib/utils` — both resolve under the existing `@/*` → `./*` mapping. No `tsconfig.json` edit required.

---

### Pattern: Flat-config TS/MJS at root

**Source:** `eslint.config.mjs`, `postcss.config.mjs`, `next.config.ts`, `commitlint.config.cjs`.
**Apply to:** `vitest.config.ts`, `sanity.config.ts`, `sanity/structure.ts`.

**Convention:**
- Root-level location (not under `config/` or `scripts/`).
- `.ts` for new files (Sanity + Vitest expect TS); `.mjs` for ESM-only tools that don't play nicely with tsconfig's module resolution (but Phase 1 doesn't introduce any — all new configs are TS).
- Typed default export with explicit type imports at the top.

---

## No Analog Found (first-of-kind patterns in Phase 1)

Planner should lean on **RESEARCH.md + external docs** (CONTEXT.md canonical_refs lines 107–114) for these files — there is no closer in-repo precedent than what's listed above.

| File | Role | Data Flow | Reason | Authoritative source |
|------|------|-----------|--------|----------------------|
| `middleware.ts` | middleware | request-response rewrite | No existing middleware in the repo; Sentry smoke route is shape-only, not semantics-true | Next.js 15 middleware docs + D-01/D-02/D-03 from CONTEXT.md |
| `middleware.test.ts` | test | request-response assertions | No existing unit tests; Vitest landing in Phase 1 is itself the scaffold | Vitest + `NextRequest` docs + D-16 hostile-request invariant |
| `app/studio/[[...tool]]/page.tsx` | page catch-all | render (embedded Studio) | First `next-sanity` route | `next-sanity` docs — current v3+ embedded pattern |
| `sanity.config.ts` | config | config (Sanity root) | First Sanity config | Sanity v3+ `defineConfig` docs |
| `sanity/schemaTypes/*.ts` (8 stubs) | model | data-model | First Sanity schemas | Sanity v3+ `defineType` docs + D-11 stub contract |
| `sanity/structure.ts` | config | config (structure tool) | First structure-tool customization | Sanity Studio v3 structure-tool API + D-12 singleton pattern |
| `components/ui/button.tsx` + `lib/utils.ts` | component + utility | render + pure | First shadcn primitive; CLI-scaffolded — treat output as authoritative | shadcn CLI + UI-SPEC §Design System preset table |

---

## Metadata

**Analog search scope:** `/Users/martin/Projects/proactive/` repo root (read-only). Every `.ts`, `.tsx`, `.mjs`, `.cjs`, `.json`, `.yml` file outside `node_modules/`, `.next/`, `.git/`, `.planning/`, and `.vercel/` was inspected directly or via directory listing.
**Files scanned:** 14 source/config files (all of Phase 0's artifacts).
**Pattern extraction date:** 2026-04-22.
**Author:** gsd-pattern-mapper (Phase 1 run).

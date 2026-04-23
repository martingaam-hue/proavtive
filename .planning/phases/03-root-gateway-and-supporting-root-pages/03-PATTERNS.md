# Phase 3: Root Gateway and Supporting Root Pages — Pattern Map

**Mapped:** 2026-04-23
**Files analyzed:** 26 new/modified files (15 new pages/components + 4 emails/utility + 7 OG images/tests/configs)
**Analogs found:** 22 / 26 (4 files have no direct analog — see §No Analog Found)

---

## Critical Note: Folder Naming Discrepancy

The Phase 3 UI-SPEC references `app/(root)/` (parens route group) but the actual codebase uses `app/root/` (plain folder) per Phase 1 D-04 implementation note in `middleware.ts:7-12` (verbatim):

> "The plain-folder mechanism (app/root/, app/hk/, app/sg/) is an implementation detail chosen because three parens-named route groups cannot all resolve to "/" in Next.js 15 (build-time conflict). The user-facing URL contract of D-04 is fully preserved — the filesystem layout is the only change from the parens-group mechanism originally named in CONTEXT.md D-04."

**Pattern decision for Phase 3:** All file paths below use `app/root/` (matching the actual codebase + middleware rewrite target). The planner MUST use `app/root/` for new file creation, and the `<RootFooter>` etc. references to "root group" in UI-SPEC are conceptual not literal-path. If executor encounters `app/(root)/...` in any plan instruction, treat it as a typo for `app/root/...`.

---

## Critical Note: Phase 2 Primitives Not Yet On Disk

Phase 3 UI-SPEC composes against Phase 2 primitives that DO NOT exist in the codebase as of mapping date (2026-04-23):
- `components/ui/section.tsx` — does NOT exist
- `components/ui/container-editorial.tsx` — does NOT exist
- `components/ui/market-card.tsx` — does NOT exist
- `components/ui/programme-tile.tsx` — does NOT exist
- `components/ui/testimonial-card.tsx` — does NOT exist
- `components/ui/stat-strip.tsx` — does NOT exist
- `components/ui/logo-wall.tsx` — does NOT exist
- `components/ui/faq-item.tsx` — does NOT exist
- `components/ui/video-player.tsx` — does NOT exist (and not used in Phase 3 anyway per D-09)

**Existing primitives at `components/ui/` (verified 2026-04-23):** `accordion.tsx`, `avatar.tsx`, `badge.tsx`, `button.tsx`, `card.tsx`, `separator.tsx` (6 files — stock shadcn only).

**Implication for planner:** Phase 3 plans MUST NOT execute until Phase 2 ships. The Phase 2 PATTERNS.md / Phase 2 plans are upstream dependencies. If the orchestrator attempts to run Phase 3 plans before Phase 2 completes, executor halts with HUMAN-ACTION pointing to the missing primitives. (This is consistent with the orchestrator's wave model — Phase 2 is in Wave N-1, Phase 3 is Wave N.)

The pattern excerpts below reference Phase 2 primitives by their EXPECTED API per `02-UI-SPEC.md` — those signatures will become canonical when Phase 2 lands. The closest analog from Phase 1 + stock shadcn is documented for each new file regardless.

---

## File Classification

### Pages (RSC by default)

| New File | Role | Data Flow | Closest Analog | Match Quality |
|----------|------|-----------|----------------|---------------|
| `app/root/page.tsx` (REPLACE Phase 1 stub) | page | static-render | `app/root/page.tsx` (Phase 1 stub) | exact (replacing same file) |
| `app/root/layout.tsx` (REPLACE Phase 1 stub) | layout | static-render | `app/root/layout.tsx` (Phase 1 stub) + `app/layout.tsx` | exact + role-match |
| `app/root/brand/page.tsx` | page (MDX shell) | file-I/O (reads content.mdx) | `app/root/page.tsx` (Phase 1 stub) | partial — page shape only |
| `app/root/coaching-philosophy/page.tsx` | page (MDX shell) | file-I/O | (same) | partial |
| `app/root/news/page.tsx` | page (TS data array) | static-render | `app/hk/page.tsx` / `app/sg/page.tsx` (Phase 1 stubs) | partial |
| `app/root/careers/page.tsx` | page (MDX shell) | file-I/O | (same as brand) | partial |
| `app/root/contact/page.tsx` | page (RSC shell) | static + client island | `app/root/page.tsx` (Phase 1) + `app/global-error.tsx` (client boundary pattern) | partial |
| `app/root/privacy/page.tsx` | page (MDX shell) | file-I/O | (same as brand) | partial |
| `app/root/terms/page.tsx` | page (MDX shell) | file-I/O | (same as brand) | partial |

### MDX Content Files (5 files — pure content)

| File | Role | Data Flow | Closest Analog | Match Quality |
|------|------|-----------|----------------|---------------|
| `app/root/brand/content.mdx` | content | static text | none in repo | NO ANALOG (first MDX in project) |
| `app/root/coaching-philosophy/content.mdx` | content | static text | (same) | NO ANALOG |
| `app/root/careers/content.mdx` | content | static text | (same) | NO ANALOG |
| `app/root/privacy/content.mdx` | content | static text | (same) | NO ANALOG |
| `app/root/terms/content.mdx` | content | static text | (same) | NO ANALOG |

### OG Image Files (8 files — colocated `opengraph-image.tsx` per route segment)

| File | Role | Data Flow | Closest Analog | Match Quality |
|------|------|-----------|----------------|---------------|
| `app/root/opengraph-image.tsx` (gateway) | metadata file convention | build-time generation | none in repo | NO ANALOG (Next.js file convention; pattern from RESEARCH Topic 5) |
| `app/root/brand/opengraph-image.tsx` | (same) | (same) | (same) | NO ANALOG |
| `app/root/coaching-philosophy/opengraph-image.tsx` | (same) | (same) | (same) | NO ANALOG |
| `app/root/news/opengraph-image.tsx` | (same) | (same) | (same) | NO ANALOG |
| `app/root/careers/opengraph-image.tsx` | (same) | (same) | (same) | NO ANALOG |
| `app/root/contact/opengraph-image.tsx` | (same) | (same) | (same) | NO ANALOG |
| `app/root/privacy/opengraph-image.tsx` | (same) | (same) | (same) | NO ANALOG |
| `app/root/terms/opengraph-image.tsx` | (same) | (same) | (same) | NO ANALOG |

### Phase 3-local Components (`components/root/`)

| New File | Role | Data Flow | Closest Analog | Match Quality |
|----------|------|-----------|----------------|---------------|
| `components/root/leadership-card.tsx` | component (RSC) | static composition | `components/ui/card.tsx` + `components/ui/avatar.tsx` + `components/ui/badge.tsx` | role-match (composes existing primitives) |
| `components/root/leadership-section.tsx` | component (RSC) | static composition | (same — composes LeadershipCard ×3) | role-match |
| `components/root/root-nav.tsx` | component (RSC) | static + client sub-component | none direct; closest is shadcn `Button` + `Sheet` (Sheet must be added at plan time) | partial |
| `components/root/root-nav-mobile.tsx` | component (client) | event-driven (open/close state) | `components/ui/accordion.tsx` (uses `"use client"` + radix-ui state) | partial |
| `components/root/root-footer.tsx` | component (RSC) | static composition | none direct; closest is `app/root/layout.tsx` (current Phase 1 stub) | partial |
| `app/root/contact/contact-form.tsx` | component (client) | event-driven + fetch | `app/global-error.tsx` (client boundary + useEffect pattern) | partial |

### Route Handler

| New File | Role | Data Flow | Closest Analog | Match Quality |
|----------|------|-----------|----------------|---------------|
| `app/api/contact/route.ts` | route handler (POST) | request-response (Resend SDK call) | `app/api/sentry-smoke/route.ts` (GET handler) | role-match (different method but same handler scaffold) |

### Tests

| New File | Role | Data Flow | Closest Analog | Match Quality |
|----------|------|-----------|----------------|---------------|
| `app/root/page.test.ts` | unit test | request-response | `middleware.test.ts` | role-match (vitest scaffold pattern) |
| `app/api/contact/route.test.ts` | unit test | request-response | `middleware.test.ts` | role-match |

### Utilities & Assets

| New File | Role | Data Flow | Closest Analog | Match Quality |
|----------|------|-----------|----------------|---------------|
| `lib/og-image.tsx` | utility (server-only) | build-time generation | none in repo (`lib/utils.ts` is generic cn helper) | NO ANALOG (RESEARCH Topic 5 + Pitfall 4 spec is the source) |
| `emails/contact-hk.tsx` | email template (React Email) | static JSX | none in repo | NO ANALOG (first email template) |
| `emails/contact-sg.tsx` | email template (React Email) | static JSX | none in repo (or single parameterised `emails/contact.tsx` per UI-SPEC §6.11) | NO ANALOG |
| `app/fonts/bloc-bold.ttf` | font asset (TTF) | binary file | none in repo (Phase 2 ships WOFF2 only) | NO ANALOG (HUMAN-ACTION precondition per D-10 / Pitfall 4) |

---

## Pattern Assignments

### `app/root/page.tsx` — Gateway Homepage (REPLACE Phase 1 stub)

**Role:** page (RSC) · **Data flow:** static-render with inline JSON-LD

**Analog:** `app/root/page.tsx` (Phase 1 stub at the SAME path — Phase 3 replaces it)

**Phase 1 Stub Pattern** (`app/root/page.tsx` lines 1-19):
```typescript
// Phase 1 / Plan 01-01 — root placeholder page. Copy is verbatim per UI-SPEC §Copywriting Contract...
import { Button } from "@/components/ui/button";

export default function RootPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <section className="w-full max-w-2xl rounded-lg bg-muted p-6">
        <h1 className="text-2xl font-semibold leading-tight">ProActiv Sports — Root</h1>
        <p className="mt-4 text-base leading-relaxed">
          Placeholder for the root gateway. Market-selection and brand hero arrive in Phase 3.
        </p>
        <div className="mt-4">
          <Button>Example primitive</Button>
        </div>
      </section>
    </main>
  );
}
```

**Patterns to copy from this analog:**
1. **File header comment block** — Phase header annotation (e.g., `// Phase 3 / Plan 03-XX — gateway homepage. Replaces Phase 1 stub. Copy verbatim from strategy PART 6A.`)
2. **Default export named function** — `export default function RootPage()` → keep the same export shape (do NOT rename `default` to a const arrow).
3. **Server Component default** — no `"use client"` directive. The Phase 1 stub is RSC; the new page MUST also be RSC.
4. **`@/components/ui/...` import alias** — verified working (Phase 1).

**Patterns to deviate from / replace:**
- Replace `<main className="flex flex-1 ...">` — `<main>` now lives in `app/root/layout.tsx` (Phase 3 spec §0). Page returns `<>...</>` fragment.
- Replace single-section placeholder with 8 section components per UI-SPEC §3.0 skeleton.
- Add inline JSON-LD `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />` at top per UI-SPEC §8.3.
- Remove the Phase 1 distinguisher stripe in layout (called out explicitly in `app/root/layout.tsx:5` comment: "Removed in Phase 3").

**Imports pattern** (from analog + Phase 2 expected):
```typescript
import { Button } from "@/components/ui/button";  // verified Phase 1 alias
import { Section } from "@/components/ui/section";  // Phase 2 — expected post-Phase-2
import { ContainerEditorial } from "@/components/ui/container-editorial";  // Phase 2
import { MarketCard } from "@/components/ui/market-card";  // Phase 2
import { StatStrip } from "@/components/ui/stat-strip";  // Phase 2
import { LogoWall } from "@/components/ui/logo-wall";  // Phase 2
import { TestimonialCard } from "@/components/ui/testimonial-card";  // Phase 2
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";  // Phase 2 stock — verified at components/ui/accordion.tsx
import { LeadershipSection } from "@/components/root/leadership-section";  // Phase 3-local
import Image from "next/image";
```

---

### `app/root/layout.tsx` — Root Group Layout (REPLACE Phase 1 stub)

**Role:** layout (RSC) · **Data flow:** static-render + base metadata

**Analog:** `app/root/layout.tsx` (Phase 1 stub) + `app/layout.tsx` (project-root layout — for metadata pattern)

**Phase 1 Stub Pattern** (`app/root/layout.tsx` lines 1-20):
```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ProActiv Sports — Root (Phase 1 placeholder)",
};

export default function RootGroupLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* UI-SPEC §Color — 4px slate-400 top stripe. Removed by Phase 3 when the real gateway ships. */}
      <div aria-hidden className="h-1 w-full bg-slate-400" />
      {children}
    </>
  );
}
```

**Project-root Metadata Pattern** (`app/layout.tsx` lines 15-21 — for `metadataBase`/title template inspiration):
```typescript
export const metadata: Metadata = {
  title: {
    default: "ProActiv Sports",
    template: "%s",
  },
  description: "ProActiv Sports — children's gymnastics & sports (Hong Kong + Singapore).",
};
```

**Patterns to copy:**
1. `export const metadata: Metadata = {...}` — Next.js 15 metadata API export from layout.
2. `Readonly<{ children: React.ReactNode }>` props typing.
3. `import type { Metadata } from "next"` — type-only import.
4. The intentional `{/* UI-SPEC ... — Removed by Phase 3 when the real gateway ships. */}` distinguisher stripe pattern signals the deletion ritual: Phase 3 MUST remove the slate-400 stripe div in the rewrite.

**Patterns to deviate / add:**
- Replace simple metadata with full UI-SPEC §8.1 base metadata including `metadataBase` (CRITICAL — RESEARCH Pitfall 1):
  ```typescript
  const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: { default: "ProActiv Sports | ...", template: "%s | ProActiv Sports" },
    description: "...",
    openGraph: { siteName: "ProActiv Sports", locale: "en_GB", type: "website" },
  };
  ```
- Wrap children in chrome: skip-link → RootNav → `<main id="main-content">` → RootFooter:
  ```tsx
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md">Skip to main content</a>
      <RootNav />
      <main id="main-content">{children}</main>
      <RootFooter />
    </>
  );
  ```

---

### `app/root/brand/page.tsx` (and `coaching-philosophy/`, `careers/`, `privacy/`, `terms/`) — MDX Shell Pages

**Role:** page (RSC) · **Data flow:** file-I/O (reads sibling content.mdx)

**Analog:** None in repo for the MDX-reading pattern. Closest skeleton is `app/root/page.tsx` (Phase 1 stub) for the page-shape.

**Pattern source:** RESEARCH Topic 4 (verbatim — `next-mdx-remote/rsc` async page component):
```typescript
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";

async function getContent() {
  const raw = await readFile(join(process.cwd(), "app/root/brand/content.mdx"), "utf8");
  return matter(raw);
}

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await getContent();
  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      url: "https://proactivsports.com/brand",
      images: [{ url: "/brand/opengraph-image", width: 1200, height: 630, alt: data.title }],
      type: "article",
      siteName: "ProActiv Sports",
      locale: "en_GB",
    },
  };
}

export default async function BrandPage() {
  const { content, data } = await getContent();
  return (
    <Section size="md">
      <ContainerEditorial>
        <h1 className="text-h1 font-display">{data.title}</h1>
        <MDXRemote source={content} components={{ /* Phase 2 primitives if needed */ }} />
      </ContainerEditorial>
    </Section>
  );
}
```

**Critical pattern hooks:**
- **`async function getContent()`** + `readFile(join(process.cwd(), ...))` — server-side filesystem read at build/RSC render time.
- **Two functions exported** — `generateMetadata` (async) AND default page component (also async). Both call `getContent()` — Next.js dedupes via `cache()` automatically (or the planner can wrap in `import { cache } from "react"`).
- **`MDXRemote` from `'next-mdx-remote/rsc'`** — NOT `'next-mdx-remote'` (RESEARCH Pitfall 3 — wrong import causes build error).
- **Full `openGraph` object** per page (Pitfall 2 — shallow merge means inheriting siteName/locale fails; declare every field).

**Per-page deviations:**
- `app/root/brand/page.tsx` — `openGraph.type: "article"`, full structure per UI-SPEC §4.1 (hero + LLM paragraph + history timeline + LeadershipSection + StatStrip + LogoWall + final CTA). MDXRemote gets injected components for `<StatStrip>`, `<LogoWall>`.
- `app/root/coaching-philosophy/page.tsx` — additional 3-pillar section with lucide icons (`Shield`, `TrendingUp`, `Sparkles`).
- `app/root/careers/page.tsx` — link button to `/contact/?subject=job` (D-07).
- `app/root/privacy/page.tsx` & `terms/page.tsx` — yellow draft banner Card at top (UI-SPEC §4.6).

---

### `app/root/news/page.tsx` — News Page (TypeScript array, no MDX)

**Role:** page (RSC) · **Data flow:** static-render with hardcoded TS data

**Analog:** `app/hk/page.tsx` / `app/sg/page.tsx` (Phase 1 stubs — single-page TS pattern).

**HK Stub Pattern** (`app/hk/page.tsx` lines 1-14):
```typescript
// Phase 1 / Plan 01-01 — hk placeholder page. Copy is verbatim per UI-SPEC §Copywriting Contract...
export default function HKPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <section className="w-full max-w-2xl rounded-lg bg-muted p-6">
        <h1 className="text-2xl font-semibold leading-tight">ProActiv Sports — Hong Kong</h1>
        ...
      </section>
    </main>
  );
}
```

**Patterns to copy:**
1. Phase header comment block.
2. Plain default export RSC.
3. `<section>` semantic HTML wrapper (`<main>` is now in layout).

**Patterns to add (per UI-SPEC §4.3 + D-06):**
- `interface NewsItem { outlet, headline, date, url, logo? }` declared at top of file.
- `const newsItems: NewsItem[] = []` — empty array Phase 3 default; Phase 6 swap to GROQ.
- Conditional render: `{newsItems.length > 0 ? <NewsList items={newsItems} /> : <EmptyNewsState />}`
- Embedded newsletter `<form action="/api/contact" method="POST">` reusing the existing route handler (NB: the Phase 3 contact route handler accepts JSON not form-encoded — the planner must either (a) make the news form a `'use client'` component that fetches JSON, or (b) extend the route handler to accept both `Content-Type: application/json` and `application/x-www-form-urlencoded`. Recommendation per RESEARCH: option (a) — keep the API JSON-only).

---

### `app/root/contact/page.tsx` — Contact Shell

**Role:** page (RSC shell) · **Data flow:** static + client island

**Analog:** `app/root/page.tsx` (Phase 1 stub) for shell shape · `app/global-error.tsx` for client-boundary integration pattern.

**Patterns to copy:**
- RSC default export, no `"use client"` directive on the shell.
- Import client component as named child: `<ContactForm />` (this is the boundary).
- Inline JSON-LD ContactPage schema per UI-SPEC §8.4.

**`app/global-error.tsx` Client-Boundary Pattern** (lines 1-25):
```typescript
"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
  ...
}
```

This is the closest existing client component — shows the project pattern: `"use client"` first line, default-exported function component, hooks usage, error capture via Sentry.

---

### `app/root/contact/contact-form.tsx` — Contact Form (Client)

**Role:** component (client) · **Data flow:** event-driven + fetch

**Analog:** `app/global-error.tsx` (lines 1-7 — client component skeleton) · `components/ui/accordion.tsx` (lines 1-3 — `"use client"` + radix-ui state pattern).

**Patterns to copy:**
1. `"use client"` directive as line 1.
2. React hook usage (`useState`, `useEffect` already in use in `global-error.tsx`); add `useTransition` for submit (React 19 default optimisation per UI-SPEC §8.6).
3. Sentry error capture via `Sentry.captureException(error)` — apply to fetch failures (per `global-error.tsx:14`).

**Pattern from RESEARCH Topic 3 — Form fetch pattern:**
```typescript
"use client";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";  // for ?subject=job pre-fill (D-07)

export function ContactForm() {
  const searchParams = useSearchParams();
  const [market, setMarket] = useState<"hk" | "sg" | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [pending, startTransition] = useTransition();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      // ... handle status
    });
  }

  return (/* market selector + form fields per UI-SPEC §6.4-6.6 */);
}
```

**Critical pattern hooks:**
- D-03 force-pick: form fields render conditionally on `market !== null`.
- D-04 honeypot: `<input type="text" name="bot-trap" tabIndex={-1} autoComplete="off" className="absolute left-[-9999px]" />`.
- D-07 subject pre-fill: `useSearchParams().get("subject")` populates hidden subject field.
- ARIA: `role="radiogroup"` on selector wrapper; `aria-checked` per card (UI-SPEC §6.4).

---

### `app/api/contact/route.ts` — Contact API Route Handler

**Role:** route handler (POST) · **Data flow:** request-response (Resend SDK)

**Analog:** `app/api/sentry-smoke/route.ts` (GET handler — same `app/api/.../route.ts` file convention)

**`app/api/sentry-smoke/route.ts` Pattern** (lines 1-29):
```typescript
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // never cached

export async function GET(req: NextRequest) {
  const expected = process.env.SENTRY_SMOKE_TOKEN;
  const provided = req.nextUrl.searchParams.get("token");

  if (!expected) {
    return new NextResponse("Not Found", { status: 404 });
  }

  if (!provided || !timingSafeEqual(provided, expected)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  throw new Error("sentry-smoke — deliberate error");
}
```

**Patterns to copy:**
1. **`import { NextResponse, type NextRequest } from "next/server";`** — verified Next.js 15 import path.
2. **`export const runtime = "nodejs";`** — needed for Resend SDK (uses Node.js APIs); also needed for `lib/og-image.tsx` per Pitfall 4.
3. **`export const dynamic = "force-dynamic";`** — POST handlers are dynamic by nature; explicit declaration matches existing convention.
4. **Async handler signature** — `export async function POST(req: NextRequest)`.
5. **`process.env.<KEY>` reads** — server-only env access (sentry-smoke uses `process.env.SENTRY_SMOKE_TOKEN`; contact route uses `RESEND_API_KEY`, `CONTACT_INBOX_HK`, `CONTACT_INBOX_SG`).
6. **Defensive missing-env handling** — sentry-smoke returns 404 silently when env unset (lines 18-20). Contact route should validate env vars on init OR per-request and return 500 with logging when missing (NOT silent — server config error needs visibility, unlike auth-token absence).
7. **Silent rejection pattern for spam** — sentry-smoke returns 404 (not 401) to avoid leaking the route's existence to scanners (lines 22-25). Contact route adopts the same pattern for honeypot triggers per D-04: return 200 (not 400) on honeypot hit, avoiding leak of rejection logic.

**Patterns to add** (from RESEARCH Topic 3 + UI-SPEC §6.10):
```typescript
import { Resend } from "resend";
import { ContactEmailHK } from "@/emails/contact-hk";
import { ContactEmailSG } from "@/emails/contact-sg";

const resend = new Resend(process.env.RESEND_API_KEY);

const INBOXES = {
  hk: process.env.CONTACT_INBOX_HK!,
  sg: process.env.CONTACT_INBOX_SG!,
} as const;

export async function POST(req: NextRequest) {
  const body = await req.json();

  // D-04 honeypot: silent 200 (don't leak)
  if (body["bot-trap"]) return NextResponse.json({ success: true }, { status: 200 });

  // Validation
  if (!["hk", "sg"].includes(body.market)) {
    return NextResponse.json({ error: "Invalid market" }, { status: 400 });
  }

  // Resend call (D-05: onboarding@resend.dev sender at Phase 3)
  const { data, error } = await resend.emails.send({
    from: "ProActiv Sports Website <onboarding@resend.dev>",
    to: [INBOXES[body.market as "hk" | "sg"]],
    replyTo: body.email,
    subject: `[${body.market.toUpperCase()}] ${body.subject || "New enquiry"} — ${body.name}`,
    react: body.market === "hk" ? ContactEmailHK(body) : ContactEmailSG(body),
  });

  if (error) {
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
  return NextResponse.json({ success: true, id: data?.id }, { status: 200 });
}
```

---

### `app/root/page.test.ts` — Gateway Page Unit Test

**Role:** test · **Data flow:** request-response (page metadata + RSC render checks)

**Analog:** `middleware.test.ts` (lines 24-49 — vitest scaffold, makeRequest helper, NextRequest mocking)

**`middleware.test.ts` Pattern** (lines 24-49):
```typescript
import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware, config as middlewareConfig } from "./middleware";

function makeRequest(urlString: string, init: { host?: string; cookie?: string; query?: Record<string, string> } = {}) {
  const url = new URL(urlString);
  const host = init.host ?? url.host;
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
  it("rewrites hk.proactivsports.com to /hk even with hostile cookie + query", () => {
    const req = makeRequest("https://hk.proactivsports.com/programmes", {
      host: "hk.proactivsports.com",
      cookie: "x-market=sg",
      query: { __market: "sg" },
    });

    const res = middleware(req);
    const rewrite = res.headers.get("x-middleware-rewrite") ?? "";
    expect(rewrite).toContain("/hk/programmes");
    expect(rewrite).not.toContain("/sg/");
  });
});
```

**Patterns to copy:**
1. **Imports:** `import { describe, it, expect } from "vitest"` — verified working with current `vitest.config.ts`.
2. **`describe(...)` block per requirement (D-02, D-04, D-07)** with semantic title — `app/root/page.test.ts` mirrors: `describe("gateway homepage — GW-01 dual market CTAs", () => { ... })`.
3. **Behavior-focused `it(...)` titles** — describe what the test asserts, not the function name.
4. **Local helper functions** at top — `makeRequest` is a great example of a per-test-file helper.
5. **Multiple `expect(...)`** including `.toContain` AND `.not.toContain` for negative invariants.

**Patterns to add for page tests** (RESEARCH Validation Architecture):
- The Phase 3 page tests can test `metadata` exports directly — no rendering needed:
  ```typescript
  import { metadata } from "./page";
  it("exports metadata with absolute openGraph url", () => {
    expect(metadata.openGraph?.url).toMatch(/^https?:\/\//);
    expect(metadata.openGraph?.images).toBeDefined();
  });
  ```
- For CTA URL assertions, test that `process.env.NEXT_PUBLIC_HK_URL` is read into the page output (this might require RTL — gated on `vitest.config.ts` extension to add jsdom; per RESEARCH Wave 0 Gap, the planner decides).

**Vitest config note:** The current `vitest.config.ts` has `include: ["**/*.test.ts"]` (line 17) — already broad enough to pick up new tests at `app/root/page.test.ts` and `app/api/contact/route.test.ts` without config changes. Verified at `vitest.config.ts:17`.

---

### `app/api/contact/route.test.ts` — Contact API Unit Test

**Role:** test · **Data flow:** request-response

**Analog:** `middleware.test.ts` (same patterns as above)

**Test scenarios per RESEARCH Validation:**
- GW-06: rejects unknown market value (400)
- GW-06: routes `market=hk` to `CONTACT_INBOX_HK` (mocking Resend)
- GW-06: honeypot field with non-empty `bot-trap` returns 200 silently (D-04)

**Pattern to add — Resend SDK mocking** (vitest pattern):
```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: vi.fn().mockResolvedValue({ data: { id: "test-id" }, error: null }) },
  })),
}));

beforeEach(() => {
  process.env.RESEND_API_KEY = "test-key";
  process.env.CONTACT_INBOX_HK = "hk@test.com";
  process.env.CONTACT_INBOX_SG = "sg@test.com";
});

describe("POST /api/contact — GW-06", () => {
  it("rejects unknown market with 400", async () => {
    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ market: "moon", name: "X", email: "a@b.c", message: "hello world!" }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });

  it("returns 200 silently on honeypot trigger (D-04)", async () => {
    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ market: "hk", "bot-trap": "spam", name: "Bot", email: "x@y.z", message: "..." }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(200);  // NOT 400 — silent rejection
  });
});
```

---

### `components/root/leadership-card.tsx` — LeadershipCard (Phase 3-local)

**Role:** component (RSC) · **Data flow:** static composition

**Analog:** Composes 3 existing Phase 2 stock primitives — `components/ui/card.tsx` + `components/ui/avatar.tsx` + `components/ui/badge.tsx`. Most-similar single-file pattern: `components/ui/card.tsx` (functional component composition style).

**`components/ui/card.tsx` Pattern** (lines 1-21 — function-based component shape):
```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10 ...",
        className
      )}
      {...props}
    />
  )
}
```

**Patterns to copy:**
1. **`import * as React from "react"`** — namespace import (Phase 2 convention).
2. **`import { cn } from "@/lib/utils"`** — verified utility helper at `lib/utils.ts:4`.
3. **Function declaration (NOT const arrow)** — matches Card, Badge, Avatar style.
4. **`React.ComponentProps<"div">` extension pattern** — combine native HTML props with custom props via intersection type.
5. **`data-slot="..."` attribute on root element** — shadcn convention used by all Phase 2 stock primitives (every existing UI component sets `data-slot`).
6. **`cn(...)` for className composition** — never raw template literals.
7. **Named export** — both `Card` and `Card`-children are named-exported (`export { Card, CardHeader, ... }` at bottom).

**Pattern to add** — Composition-only (no CVA per D-11; LeadershipCard has no variants):
```typescript
import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface LeadershipCardProps {
  name: string;
  role: string;
  bioLine: string;
  portrait: string;
  portraitAlt: string;
  className?: string;
}

export function LeadershipCard({ name, role, bioLine, portrait, portraitAlt, className }: LeadershipCardProps) {
  return (
    <Card className={cn("overflow-hidden p-0", className)} data-slot="leadership-card">
      <div className="relative aspect-[3/4]">
        <Image src={portrait} alt={portraitAlt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
      </div>
      <div className="p-6 lg:p-8">
        <Badge variant="secondary" className="mb-3">{role}</Badge>
        <h3 className="text-h3 font-display text-foreground">{name}</h3>
        <p className="text-body text-muted-foreground mt-3 leading-relaxed">{bioLine}</p>
      </div>
    </Card>
  );
}
```

**Deviation note:** Unlike Phase 2 stock primitives, LeadershipCard takes a typed `LeadershipCardProps` interface rather than extending `React.ComponentProps<...>` — this is a Phase 3-local composition (D-11), not a DS-level primitive, so the API is intentionally narrow.

---

### `components/root/leadership-section.tsx` — LeadershipSection (Phase 3-local DRY wrapper)

**Role:** component (RSC) · **Data flow:** static composition (renders heading + grid + 3 LeadershipCards)

**Analog:** None directly. Pattern is a typed-array-prop list-renderer; closest analog is the `Accordion` composition pattern in `components/ui/accordion.tsx` (uses Radix Root + Item children — shows the wrapper + children rendering convention).

**Pattern to add** (per UI-SPEC §5.1 reusable extraction note):
```typescript
import * as React from "react";
import { LeadershipCard, type LeadershipCardProps } from "@/components/root/leadership-card";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";

export interface LeadershipSectionProps {
  heading: string;
  leaders: LeadershipCardProps[];
  className?: string;
}

export function LeadershipSection({ heading, leaders, className }: LeadershipSectionProps) {
  return (
    <Section size="md" className={className}>
      <ContainerEditorial width="wide">
        <h2 className="text-h2 font-display text-foreground">{heading}</h2>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8 mt-8 lg:gap-6">
          {leaders.map((leader) => (
            <LeadershipCard key={leader.name} {...leader} />
          ))}
        </div>
      </ContainerEditorial>
    </Section>
  );
}
```

**Used by:** Gateway §3.6 (3 leaders) · `/brand/` §4 (3 leaders) · `/coaching-philosophy/` (2 leaders — Monica + Haikel only). Single source of truth for leader data.

---

### `components/root/root-nav.tsx` — RootNav (RSC wrapper)

**Role:** component (RSC) · **Data flow:** static composition + client sub-component for mobile

**Analog:** No existing nav in repo. Closest patterns:
- `components/ui/button.tsx` (`<Button asChild>` pattern for wrapping anchors per UI-SPEC §5.2)
- `app/root/layout.tsx` (Phase 1) — current empty wrapper that the new RootNav slots into

**Pattern from UI-SPEC §5.2:**
```typescript
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { RootNavMobile } from "@/components/root/root-nav-mobile";

const NAV_LINKS = [
  { href: "/brand", label: "About" },
  { href: "/coaching-philosophy", label: "Coaching" },
  { href: "/news", label: "News" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
] as const;

export function RootNav() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <ContainerEditorial width="wide" className="flex items-center justify-between h-16 lg:h-20">
        <Link href="/" aria-label="ProActiv Sports — home">
          <img src="/assets/logo.svg" alt="" className="h-8 lg:h-10" />
        </Link>
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-6">
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-small font-medium text-foreground hover:text-brand-red transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="ghost">
              <a href={process.env.NEXT_PUBLIC_HK_URL}>HK →</a>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <a href={process.env.NEXT_PUBLIC_SG_URL}>SG →</a>
            </Button>
          </div>
        </nav>
        <RootNavMobile />
      </ContainerEditorial>
    </header>
  );
}
```

**Critical pattern hooks:**
- **Same-host links (`/brand`, etc.) use `next/link`** — these stay within the root subdomain (RESEARCH Topic 2 + Pitfall 7).
- **Cross-subdomain links use plain `<a href={NEXT_PUBLIC_HK_URL}>` wrapped in `<Button asChild>`** — Pitfall 7: never `<Link>` for cross-host.
- **`process.env.NEXT_PUBLIC_*`** — verified inlined at build by Next.js (these are client-readable per RESEARCH Topic 2).

---

### `components/root/root-nav-mobile.tsx` — Mobile Menu Toggle (Client)

**Role:** component (client) · **Data flow:** event-driven (Sheet open/close state)

**Analog:** `components/ui/accordion.tsx` (lines 1-3 — `"use client"` + radix-ui state management pattern)

**`components/ui/accordion.tsx` Client Pattern** (lines 1-7):
```typescript
"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
```

**Patterns to copy:**
1. **`"use client"` first line** (no `import * as React from "react"` before it).
2. **Radix-ui imports via metapackage** — `import { Sheet as SheetPrimitive } from "radix-ui"` (matches Accordion/Avatar/Separator pattern: `import { Accordion as AccordionPrimitive } from "radix-ui"`).
3. **Lucide icons** — `import { Menu, X } from "lucide-react"` (project uses `lucide-react@1.8.0`).
4. **`cn(...)` from `@/lib/utils`** for className composition.

**Phase 3-specific dependency note:** shadcn `Sheet` primitive is NOT in current `components/ui/` (verified — only 6 files: accordion, avatar, badge, button, card, separator). Plan task MUST include `pnpm dlx shadcn@latest add sheet` BEFORE writing root-nav-mobile.tsx, OR use a hand-rolled Radix Dialog-based slide-in. UI-SPEC §5.2 explicitly says "shadcn `Sheet` for slide-in drawer per RESEARCH Topic 6".

---

### `components/root/root-footer.tsx` — RootFooter (RSC)

**Role:** component (RSC) · **Data flow:** static composition

**Analog:** None direct. Closest scaffold: `components/ui/card.tsx` (function component shape) + `app/root/layout.tsx` Phase 1 stub (where the footer eventually mounts).

**Pattern from UI-SPEC §5.3:**
```typescript
import * as React from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Separator } from "@/components/ui/separator";

export function RootFooter() {
  return (
    <footer className="bg-brand-navy text-white">
      <Section size="md" bg="navy">
        <ContainerEditorial width="wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Column 1 — Brand · Column 2 — Company · Column 3 — Markets · Column 4 — Contact + Legal */}
          </div>
          <Separator className="my-8 bg-white/20" />
          <div className="flex items-center justify-between">
            <p className="text-small text-cream">© {new Date().getFullYear()} ProActiv Sports. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/proactivsportshk/" target="_blank" rel="noopener noreferrer" aria-label="Follow ProActiv Sports on Facebook">
                <Facebook className="size-5 text-cream hover:text-white transition-colors" />
              </a>
              {/* Instagram, LinkedIn similarly */}
            </div>
          </div>
        </ContainerEditorial>
      </Section>
    </footer>
  );
}
```

**Critical pattern hooks:**
- **`new Date().getFullYear()` for copyright** — calls fresh at render (RSC = build-time render → year is build year; if build straddles New Year, copyright would be off by one. Acceptable per UI-SPEC §10.2 — re-deploy refreshes.)
- **`target="_blank" rel="noopener noreferrer"`** — required for external links per UI-SPEC §8.6 Lighthouse Best Practices.
- **`aria-label` on icon-only links** — required for screen reader accessibility (WCAG 2.2 AA).

---

### `lib/og-image.tsx` — Shared OG Image Utility

**Role:** utility (server-only) · **Data flow:** build-time generation

**Analog:** None in repo. `lib/utils.ts:4` is the closest existing `lib/` file (cn helper) — shows project lib convention (named export, no default).

**Pattern source:** RESEARCH Topic 5 + UI-SPEC §7.4 (verbatim):
```typescript
// lib/og-image.tsx
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

interface OgImageOptions {
  title: string;
  tagline: string;
}

export async function createRootOgImage({ title, tagline }: OgImageOptions): Promise<ImageResponse> {
  const blocBold = await readFile(join(process.cwd(), "app/fonts/bloc-bold.ttf"));
  const logoSvg = await readFile(join(process.cwd(), "app/assets/logo-white.svg"), "utf-8");
  const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ /* navy background, logo top-left, title bottom-left, tagline below, brand-rainbow stripe */ }}>
        {/* ... */}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Bloc Bold", data: blocBold, weight: 700, style: "normal" }],
    },
  );
}
```

**Critical pattern hooks** (inherits from RESEARCH Pitfall 4):
- **`readFile(join(process.cwd(), "app/fonts/bloc-bold.ttf"))`** — must be `.ttf` not `.woff2` (Satori requirement). HUMAN-ACTION precondition: `app/fonts/bloc-bold.ttf` must exist on disk before plan executes.
- **`runtime = "nodejs"` on consumer files** — Satori needs Node.js runtime, not Edge.
- **Static generation by default** — no `export const dynamic = 'force-dynamic'` on consumer files.

---

### `app/root/{page}/opengraph-image.tsx` — Per-Page OG Files (8 files)

**Role:** metadata file convention · **Data flow:** build-time generation

**Analog:** None in repo. Pattern is a Next.js file convention.

**Pattern from UI-SPEC §7.5 — 5-line per-page consumer:**
```typescript
// app/root/brand/opengraph-image.tsx
import { createRootOgImage } from "@/lib/og-image";

export const runtime = "nodejs";  // Satori needs Node.js runtime per Pitfall 4
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return createRootOgImage({
    title: "About ProActiv Sports",
    tagline: "Brand story, history, and the people behind 14 years of children's coaching.",
  });
}
```

**Per-page title/tagline values are locked in UI-SPEC §7.3 — executor MUST use those exact strings.**

---

### `emails/contact-hk.tsx` & `emails/contact-sg.tsx` — React Email Templates

**Role:** email template (React Email) · **Data flow:** static JSX rendered to HTML by Resend

**Analog:** None in repo (no `emails/` directory exists). Closest analog is `components/ui/card.tsx` for component shape.

**Pattern source:** RESEARCH Topic 3 + UI-SPEC §6.11. NB UI-SPEC §6.11 actually recommends ONE parameterised template `emails/contact.tsx` rather than two separate files — planner decides; this PATTERNS.md documents both because the upstream input specifies two files.

**Pattern (UI-SPEC §6.11):**
```typescript
// emails/contact-hk.tsx (or emails/contact.tsx with market prop)
import { Body, Container, Head, Heading, Html, Preview, Text, Hr } from "@react-email/components";

interface ContactEmailProps {
  name: string;
  email: string;
  phone?: string;
  age?: string;
  message: string;
  subject?: string;
}

export function ContactEmailHK({ name, email, phone, age, message, subject }: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reply directly — this email's reply-to is the parent's address.</Preview>
      <Body style={{ fontFamily: "system-ui, sans-serif", color: "#0f206c" }}>
        <Container>
          <Heading>New enquiry from HK website</Heading>
          <Text><strong>Name:</strong> {name}</Text>
          <Text><strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a></Text>
          {phone && <Text><strong>Phone:</strong> {phone}</Text>}
          {age && <Text><strong>Child's age:</strong> {age}</Text>}
          {subject && <Text><strong>Subject:</strong> {subject}</Text>}
          <Hr />
          <Text style={{ whiteSpace: "pre-wrap" }}>{message}</Text>
        </Container>
      </Body>
    </Html>
  );
}
```

---

## Shared Patterns (Cross-cutting)

### Server Component Default + Client Boundaries
**Source:** Established by Phase 1 + Phase 2 patterns, called out in 03-CONTEXT.md `<code_context>` line 174:
> "Server Components by default; client only at the boundary. Pages, layouts, and most sections are RSC. Client components are scoped: contact form, mobile menu toggle. RootFooter, RootNav, all section components stay server-side."

**Apply to:** Every new file in Phase 3.

**Pattern:** First line of file is either:
- (RSC) — no directive (e.g., `app/root/page.tsx`, `components/ui/card.tsx`)
- (Client) — `"use client";` (e.g., `app/global-error.tsx:1`, `components/ui/accordion.tsx:1`)

**Files in Phase 3 that need `"use client"`:**
- `components/root/root-nav-mobile.tsx`
- `app/root/contact/contact-form.tsx`

**Everything else is RSC** including all 8 page files, all 8 OG image files, both leadership components, RootNav, RootFooter.

---

### Path Aliases (`@/*`)
**Source:** Established in `tsconfig.json` (verified via existing imports `@/components/ui/button`, `@/lib/utils`).
**Apply to:** Every component/page/util import in Phase 3.

**Pattern:**
```typescript
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LeadershipCard } from "@/components/root/leadership-card";
import { createRootOgImage } from "@/lib/og-image";
```

NEVER use relative paths (`../../components/...`) — established convention.

---

### `cn()` Utility for Class Composition
**Source:** `lib/utils.ts:4` (twMerge + clsx).
**Apply to:** Every component file with conditional or merged classNames.

**Pattern (from `components/ui/card.tsx:13-16`):**
```typescript
className={cn(
  "base-tailwind-classes-here",
  className  // consumer override last (twMerge dedupes conflicts)
)}
```

NEVER use raw template literals or string concatenation for classNames.

---

### Phase Header Comment Block
**Source:** Every Phase 1 / Phase 0 file (`app/root/page.tsx:1`, `app/api/sentry-smoke/route.ts:1-7`, `middleware.ts:1-23`, `next.config.ts:4-5`).
**Apply to:** Every new file in Phase 3.

**Pattern (from `app/root/page.tsx:1-2`):**
```typescript
// Phase 3 / Plan 03-XX — <one-line description>. <Verbatim copy reference if applicable>.
```

For multi-decision files (e.g., `route.ts`), use the multi-line block pattern from `middleware.ts:1-23`:
```typescript
// Phase 3 / Plan 03-XX — <component name>.
//
// D-04 honeypot: silent 200 (don't leak rejection logic — RESEARCH Topic 3).
// D-05 sender: onboarding@resend.dev at Phase 3; swap to noreply@proactivsports.com at Phase 10.
// D-01 env vars: RESEND_API_KEY, CONTACT_INBOX_HK, CONTACT_INBOX_SG — HUMAN-ACTION precondition.
```

---

### Env Var Naming
**Source:** Established in `next.config.ts:23` (uses `process.env.VERCEL_ENV`), `app/api/sentry-smoke/route.ts:15` (uses `process.env.SENTRY_SMOKE_TOKEN`).
**Apply to:** All env reads in Phase 3.

**Pattern:**
- Server-only secrets: bare `UPPER_SNAKE` (e.g., `RESEND_API_KEY`, `CONTACT_INBOX_HK`).
- Client-readable: `NEXT_PUBLIC_*` prefix (e.g., `NEXT_PUBLIC_HK_URL`, `NEXT_PUBLIC_WHATSAPP_HK`).
- Vercel auto-injected: `VERCEL_PROJECT_PRODUCTION_URL`, `VERCEL_URL`, `VERCEL_ENV` (used in `next.config.ts:23` and the Phase 3 `metadataBase` fallback).

---

### Vitest Test Scaffold
**Source:** `middleware.test.ts:24-49` (the only existing test file).
**Apply to:** Both new test files (`app/root/page.test.ts`, `app/api/contact/route.test.ts`).

**Pattern excerpts already documented above per file. Key reusable elements:**
- `import { describe, it, expect } from "vitest"` (and add `vi, beforeEach` for mocking).
- `describe("<requirement-id> — <semantic-name>", () => { ... })` block titles.
- Co-located `*.test.ts` next to source (vitest.config.ts:17 `include: ["**/*.test.ts"]` already covers any path).

---

### Sentry Error Capture
**Source:** `app/global-error.tsx:8-15`.
**Apply to:** Contact form fetch failures (`app/root/contact/contact-form.tsx`) and contact route handler (`app/api/contact/route.ts`).

**Pattern (from `app/global-error.tsx:8-15`):**
```typescript
import * as Sentry from "@sentry/nextjs";
// In a useEffect or catch block:
Sentry.captureException(error);
```

For the route handler, throwing the error (like `app/api/sentry-smoke/route.ts:28`) lets Sentry's instrumentation pick it up automatically — verified via `next.config.ts:45-66` `withSentryConfig` wrap.

---

## No Analog Found

Files with no close match in the existing codebase (planner uses RESEARCH.md + UI-SPEC patterns instead — sources noted):

| File | Role | Data Flow | Source for Pattern |
|------|------|-----------|--------------------|
| `app/root/{page}/content.mdx` (5 files) | content | static text | None — first MDX in repo. Pattern source: RESEARCH Topic 4 frontmatter convention |
| `app/root/{page}/opengraph-image.tsx` (8 files) | metadata file convention | build-time generation | None — first OG image in repo. Pattern source: RESEARCH Topic 5 + UI-SPEC §7.5 (5-line consumer) |
| `lib/og-image.tsx` | utility | build-time generation | None — first lib utility beyond cn(). Pattern source: RESEARCH Topic 5 + UI-SPEC §7.4 (`createRootOgImage` signature) + Pitfall 4 (TTF requirement) |
| `emails/contact-hk.tsx` & `emails/contact-sg.tsx` | email template | static JSX | None — first email template + first `emails/` dir. Pattern source: RESEARCH Topic 3 + UI-SPEC §6.11 (React Email components) |
| `app/fonts/bloc-bold.ttf` | font asset (binary) | binary file | None — Phase 2 ships WOFF2 only. Pattern: HUMAN-ACTION precondition checkpoint per D-10 / Pitfall 4. Martin provides .ttf alongside WOFF2 from original font license |

**Files with NO existing analog count: 4 unique categories (15 files including all 5 MDX + 8 OG + lib/og-image + 2 emails + 1 ttf asset). All have well-defined RESEARCH/UI-SPEC patterns to follow.**

---

## Key Patterns Summary

For the planner's at-a-glance reference:

1. **All controllers/pages compose Phase 2 primitives** — never hand-rolled CSS for spacing or typography. Phase 2 must complete before Phase 3 plans run.
2. **Server Components by default** — `"use client"` only on `root-nav-mobile.tsx` and `contact-form.tsx`. Everything else (8 pages, 8 OG files, leadership components, RootNav, RootFooter, route handler, MDX shells) is RSC.
3. **Cross-subdomain links** = absolute `<a href={NEXT_PUBLIC_HK_URL}>` wrapped in `<Button asChild>` — NEVER `next/link`. Same-host links use `next/link`.
4. **Folder is `app/root/` not `app/(root)/`** — Phase 1 D-04 implementation note in `middleware.ts:7-12` locks this. UI-SPEC's `app/(root)/` references are conceptual; planner translates to `app/root/`.
5. **HUMAN-ACTION preconditions block execute** — leadership portraits (D-10), Resend env vars (D-01), WhatsApp env vars (D-02), `app/fonts/bloc-bold.ttf` (Pitfall 4). Pattern matches Phase 2 D-02 fonts checkpoint.
6. **Test scaffold from `middleware.test.ts`** — vitest with describe/it/expect; both new test files mirror this. `vitest.config.ts:17` `include: ["**/*.test.ts"]` already broad enough — no config changes needed.
7. **Route handler scaffold from `app/api/sentry-smoke/route.ts`** — `runtime = "nodejs"`, `dynamic = "force-dynamic"`, defensive env-presence checks, silent rejection for spam (matches D-04 honeypot pattern: 200 not 400).
8. **`metadataBase` is the load-bearing OG fix** — Pitfall 1. Set in `app/root/layout.tsx` with Vercel-aware fallback. Without it, every OG image URL breaks on WhatsApp/iMessage previews.
9. **Phase 3 introduces NO new design tokens** in `app/globals.css` (UI-SPEC §1 inheritance contract). All brand colors/fonts/spacing consumed via Phase 2 utilities.
10. **shadcn `Sheet` + `Input` + `Textarea` + `Label` are NEW additions at plan time** — not yet in `components/ui/`. Plan tasks must include `pnpm dlx shadcn@latest add <name>` BEFORE writing the consuming components (RootNav-mobile, ContactForm).

---

## Metadata

**Analog search scope:** `/Users/martin/Projects/proactive/app/`, `/Users/martin/Projects/proactive/components/`, `/Users/martin/Projects/proactive/lib/`, `/Users/martin/Projects/proactive/middleware.ts`, `/Users/martin/Projects/proactive/middleware.test.ts`, `/Users/martin/Projects/proactive/vitest.config.ts`, `/Users/martin/Projects/proactive/next.config.ts`, `/Users/martin/Projects/proactive/package.json`, `/Users/martin/Projects/proactive/app/globals.css`

**Files scanned:** 17 source files (6 stock shadcn primitives, 5 Phase 1 page/layout/middleware files, 1 route handler, 1 test file, 1 utility, 1 globals.css, 1 vitest config, 1 next config + package.json)

**Pattern extraction date:** 2026-04-23

**Upstream phase dependency:** Phase 2 (custom UI primitives) MUST complete before Phase 3 plans execute. The orchestrator's wave model handles this — Phase 3 is downstream of Phase 2.

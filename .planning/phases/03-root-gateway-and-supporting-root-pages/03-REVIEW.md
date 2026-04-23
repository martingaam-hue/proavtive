---
phase: 03-root-gateway-and-supporting-root-pages
reviewed: 2026-04-23T00:00:00Z
depth: standard
files_reviewed: 52
files_reviewed_list:
  - .env.example
  - app/api/contact/route.test.ts
  - app/api/contact/route.ts
  - app/assets/logo-white.svg
  - app/root/brand/content.mdx
  - app/root/brand/opengraph-image.tsx
  - app/root/brand/page.test.tsx
  - app/root/brand/page.tsx
  - app/root/careers/content.mdx
  - app/root/careers/opengraph-image.tsx
  - app/root/careers/page.test.tsx
  - app/root/careers/page.tsx
  - app/root/coaching-philosophy/content.mdx
  - app/root/coaching-philosophy/opengraph-image.tsx
  - app/root/coaching-philosophy/page.test.tsx
  - app/root/coaching-philosophy/page.tsx
  - app/root/contact/contact-form.test.tsx
  - app/root/contact/contact-form.tsx
  - app/root/contact/opengraph-image.tsx
  - app/root/contact/page.tsx
  - app/root/layout.tsx
  - app/root/news/news-signup-form.tsx
  - app/root/news/opengraph-image.tsx
  - app/root/news/page.test.tsx
  - app/root/news/page.tsx
  - app/root/opengraph-image.tsx
  - app/root/page.test.tsx
  - app/root/page.tsx
  - app/root/privacy/content.mdx
  - app/root/privacy/opengraph-image.tsx
  - app/root/privacy/page.test.tsx
  - app/root/privacy/page.tsx
  - app/root/terms/content.mdx
  - app/root/terms/opengraph-image.tsx
  - app/root/terms/page.test.tsx
  - app/root/terms/page.tsx
  - components/root/leadership-card.tsx
  - components/root/leadership-section.tsx
  - components/root/root-footer.tsx
  - components/root/root-nav-mobile.tsx
  - components/root/root-nav.tsx
  - components/ui/button.tsx
  - components/ui/input.tsx
  - components/ui/label.tsx
  - components/ui/sheet.tsx
  - components/ui/textarea.tsx
  - emails/contact.tsx
  - eslint.config.mjs
  - lib/og-image.tsx
  - package.json
  - tests/fixtures/contact-payloads.ts
  - tests/mocks/resend.ts
  - tests/setup.ts
  - vitest.config.ts
findings:
  critical: 0
  warning: 4
  info: 6
  total: 10
status: issues_found
---

# Phase 03: Code Review Report

**Reviewed:** 2026-04-23
**Depth:** standard
**Files Reviewed:** 52
**Status:** issues_found

## Summary

This phase implements the root gateway homepage, seven supporting pages (brand, coaching-philosophy, contact, news, careers, privacy, terms), the shared navigation and footer shell, a contact-form API route with Resend email delivery, shared OG image generation, and the full test suite for all of the above.

The overall quality is high. The code is well-structured, the RSC/client-island split is correctly applied, ARIA semantics on the market-picker radiogroup are sound, the honeypot anti-spam mechanism is implemented correctly server-side, and the test coverage is thoughtful. The `dangerouslySetInnerHTML` usage in JSON-LD scripts is correct and safe (data is exclusively hardcoded constants).

Four warnings and six informational items are noted below. No critical security vulnerabilities were found.

---

## Warnings

### WR-01: `contact-form.tsx` — form reset does not clear input values after success

**File:** `app/root/contact/contact-form.tsx:77-87`
**Issue:** When the user clicks "Send another message" after a successful submission, the component resets `status` and `market` state but does **not** reset the underlying `<form>` element or its controlled inputs. Because the inputs in this form are uncontrolled (values come from `FormData` at submit time, not from React state), the name/email/phone/age/message fields will still contain the previous submission's text when the form reappears. On next submit `FormData` will pick up the stale values — a repeat submission from a different parent could accidentally re-send the previous enquiry if they hit submit without editing.
**Fix:** Reset the form element imperatively. Add a `ref` to the form and call `formRef.current?.reset()` inside the `onClick` handler:

```tsx
const formRef = React.useRef<HTMLFormElement>(null);
// ...
<Button
  variant="ghost"
  size="touch"
  className="mt-6"
  onClick={() => {
    formRef.current?.reset();   // clears all uncontrolled inputs
    setStatus("idle");
    setMarket(null);
  }}
>
  Send another message
</Button>
// ...
<form ref={formRef} onSubmit={handleSubmit} noValidate>
```

---

### WR-02: `contact/page.tsx` — `NEXT_PUBLIC_WHATSAPP_HK/SG` used in RSC but values are client-inlined at build time

**File:** `app/root/contact/page.tsx:56-64`
**Issue:** `ContactPage` is a React Server Component that reads `process.env.NEXT_PUBLIC_WHATSAPP_HK` and `process.env.NEXT_PUBLIC_WHATSAPP_SG` to conditionally render WhatsApp anchor cards. `NEXT_PUBLIC_*` variables are statically inlined into the **client bundle** at build time by Next.js; they are not evaluated per-request on the server. If these variables are unset at build time, the RSC will always emit `undefined`, the `console.warn` will fire on every request, and the cards will never render — even if the variable is set later in Vercel's environment panel (it requires a rebuild). This is a subtle deployment footgun: the developer may set the variable in Vercel and expect it to take effect without redeploying.

This is safe in the current phase (intentional omission), but the `console.warn` inside a server component will spam the Vercel function log on every page view once deployed with the variable still unset.

**Fix:** Remove the `console.warn` calls in the RSC render path. The conditional render is already the correct guard. Add a build-time check instead (e.g., in a `next.config.mjs` env validation block) if you want a loud failure when the variable is missing:

```tsx
// Remove these:
if (!whatsappHk) {
  console.warn("Contact page: NEXT_PUBLIC_WHATSAPP_HK not set — HK WhatsApp card omitted.");
}
```

---

### WR-03: `app/api/contact/route.ts` — `replyTo` field set to unvalidated user-supplied email

**File:** `app/api/contact/route.ts:95`
**Issue:** The `replyTo` field in the Resend call is set directly to the `email` value from the request body. Although `email` is validated against the `EMAIL_REGEX` pattern, the regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) is intentionally lenient. A submission like `" admin@resend.dev"` would be trimmed to a valid-regex email address and set as `replyTo`. More importantly, if a malicious actor submits an email address that bypasses the regex (e.g., via a Resend-specific header injection through unusual characters), the `replyTo` header value could be manipulated.

The risk is low because Resend's SDK sanitises headers before transmission and the regex does require `@` and `.` separation. However, `replyTo` set to a user-controlled value means that clicking "Reply" in the inbox sends the reply to an attacker-controlled address — a social engineering vector for staff.

**Fix:** This is an accepted design trade-off (the whole point is that staff can reply to the parent). To reduce risk, add a more restrictive email normalisation before using the value as `replyTo`:

```ts
// After the existing email validation:
const safeReplyTo = email.toLowerCase().trim();
// Reject if it contains newline or carriage-return (header injection guard):
if (/[\r\n]/.test(safeReplyTo)) {
  return NextResponse.json({ errors: { email: "Please enter a valid email address." } }, { status: 400 });
}
// Use safeReplyTo everywhere instead of email
```

---

### WR-04: `app/root/coaching-philosophy/page.tsx` — URL construction with `replace(/\/$/, "")` on fallback produces a double-slash URL

**File:** `app/root/coaching-philosophy/page.tsx:163-166`
**Issue:** The CTA links are constructed as:
```ts
`${hkUrl.replace(/\/$/, "")}/book-a-trial/`
```
where `hkUrl` defaults to `"/?__market=hk"` when `NEXT_PUBLIC_HK_URL` is unset. Stripping the trailing slash from `"/?__market=hk"` leaves `"/?__market=hk"` (no trailing slash to strip), and then `/book-a-trial/` is appended, producing `"/?__market=hk/book-a-trial/"` — a malformed URL. This won't crash anything in production where the real subdomain URL is set, but it will produce broken links in any environment that relies on the fallback (local dev, preview branches without the env var set).

**Fix:** Append the sub-path before the query string when constructing fallback URLs, or use the production subdomain as the fallback. A safer fallback:

```ts
const hkUrl = process.env.NEXT_PUBLIC_HK_URL ?? "https://hk.proactivsports.com/";
const sgUrl = process.env.NEXT_PUBLIC_SG_URL ?? "https://sg.proactivsports.com/";
```

Then the `replace(/\/$/, "") + "/book-a-trial/"` pattern works correctly.

---

## Info

### IN-01: `tests/mocks/resend.ts` — mock factory is never imported by the route tests

**File:** `tests/mocks/resend.ts:1-20`
**Issue:** `installResendMock`, `mockResendSend`, and `mockResendFailure` are declared in `tests/mocks/resend.ts` but `app/api/contact/route.test.ts` uses its own inline `vi.mock("resend", ...)` instead. The file in `tests/mocks/resend.ts` is dead code — nothing imports it. If the intent is to share the mock across future test files, the current file also uses `vi.doMock` (dynamic — doesn't hoist) which has different semantics from `vi.mock` (static — hoisted) and would cause subtle ordering bugs.
**Fix:** Either delete `tests/mocks/resend.ts` if it has no future consumers, or update it to use `vi.mock` and import it in route tests where applicable.

---

### IN-02: `app/root/contact/page.tsx` — `ContactPage` is a server component that calls `process.env.NEXT_PUBLIC_*` at render time

**File:** `app/root/contact/page.tsx:56-57`
**Issue:** `NEXT_PUBLIC_*` variables are client-side inlined constants. Reading them in an RSC at render time works, but it is an unusual pattern that can mislead developers into thinking the values are per-request server secrets. The pattern is not a bug but is worth flagging for clarity — `NEXT_PUBLIC_WHATSAPP_HK` should be treated as a build-time constant throughout the codebase (the env-example comment already correctly states this).
**Fix:** No code change required. Consider adding a comment at the point of use:
```ts
// NEXT_PUBLIC_* are build-time inlined; changing them in Vercel requires a redeploy.
const whatsappHk = process.env.NEXT_PUBLIC_WHATSAPP_HK;
```

---

### IN-03: `app/root/careers/content.mdx` — HTML entity `&apos;` in MDX body

**File:** `app/root/careers/content.mdx:7`
**Issue:** The MDX source contains the literal HTML entity `&apos;` in the text body:
```
ProActiv Sports isn&apos;t a side hustle...
```
In MDX rendered through `next-mdx-remote`, `&apos;` is typically treated as literal text rather than parsed as an HTML entity, meaning the rendered output would show `isn&apos;t` rather than `isn't`. The apostrophe should be a plain Unicode character.
**Fix:** Replace `&apos;` with a straight apostrophe (`'`) or the curly right single quotation mark (`'`):
```mdx
ProActiv Sports isn't a side hustle for the founders...
```

---

### IN-04: `app/root/page.tsx` — duplicate leadership data between `page.tsx` and `app/root/brand/page.tsx`

**File:** `app/root/page.tsx:81-106`, `app/root/brand/page.tsx:55-80`
**Issue:** The `LEADERS` array (Will / Monica / Haikel with identical `name`, `role`, `bioLine`, `portrait`, `portraitAlt`) is duplicated verbatim across both files. This is not a bug today, but a maintenance hazard — any future bio update (e.g., role title change) must be made in two places.
**Fix:** Extract the `LEADERS` constant into a shared data file (e.g., `lib/data/leaders.ts`) and import it in both pages. This is a Phase 4+ refactor; no action required before launch.

---

### IN-05: `app/root/opengraph-image.tsx` has `dynamic = 'force-dynamic'`; `app/root/careers/opengraph-image.tsx` and `app/root/news/opengraph-image.tsx` do not

**File:** `app/root/careers/opengraph-image.tsx:1-12`, `app/root/news/opengraph-image.tsx:1-12`, `app/root/contact/opengraph-image.tsx:1-13`
**Issue:** `app/root/opengraph-image.tsx`, `app/root/brand/opengraph-image.tsx`, and `app/root/coaching-philosophy/opengraph-image.tsx` all export `export const dynamic = 'force-dynamic'` to prevent build-time crashes when `app/fonts/bloc-bold.ttf` is absent. The careers, news, contact, privacy, and terms OG image files are missing this export. If the font file is absent at build time, Next.js will attempt to statically prerender those OG image routes, hit the `readFile` ENOENT inside `createRootOgImage`, and potentially fail the build despite the `try/catch` (because `ImageResponse` requires at least one font or the Satori fallback path — behaviour depends on Satori version).

The graceful `try/catch` in `lib/og-image.tsx` means this is likely safe in practice (Satori will render with system-ui), but the inconsistency is a latent risk.
**Fix:** Add `export const dynamic = 'force-dynamic'` to all five affected OG image files for consistency:
```ts
export const dynamic = 'force-dynamic';
```

---

### IN-06: `app/root/coaching-philosophy/page.test.tsx` — metadata title assertion will fail

**File:** `app/root/coaching-philosophy/page.test.tsx:37`
**Issue:** The test asserts:
```ts
expect(metadata.title).toMatch(/Coaching Philosophy/);
```
But `generateMetadata()` returns `title: data.title` where `data.title` is read from `coaching-philosophy/content.mdx`. The actual frontmatter title is `"Coaching Philosophy — Safety, Progression, Confidence"`. The string `"Coaching Philosophy"` is present in that title, so the test passes — however, if the MDX frontmatter title is ever updated to something like `"How We Coach — Safety, Progression, Confidence"`, the test will fail with a cryptic mismatch. The other page tests (`brand`, `careers`, `privacy`, `terms`) also assert against the metadata title in the same brittle pattern, but coaching-philosophy is the most fragile because the page's `<h1>` already says "How we coach." while the metadata title says "Coaching Philosophy".
**Fix:** Consider asserting `typeof metadata.title === 'string' && metadata.title.length > 0` or importing the frontmatter value directly, rather than pattern-matching a specific string from the MDX file that could diverge from the test expectation.

---

_Reviewed: 2026-04-23_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_

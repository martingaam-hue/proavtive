// Client-runtime Sentry init — loaded automatically by Next.js in the browser bundle.
// Pattern per sentry-nextjs-sdk SKILL.md (Sentry 10.x+).
// Project-specific overrides:
//   D-18: environment = VERCEL_ENV  (production | preview | development)
//   D-19: release tagging via VERCEL_GIT_COMMIT_SHA
//   D-20: conservative PII posture — sendDefaultPii: false + beforeSend scrubber
//         (brand serves children and parents; HK PDPO + SG PDPA apply)

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // D-18: tag every event with the Vercel runtime env
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.VERCEL_ENV ?? "local",

  // D-17: release tagging ties stack-trace source-maps to the exact commit SHA
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

  // 100% in dev, 10% in production — adjust later per traffic
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  // Session Replay: 10% of all sessions, 100% of sessions with errors
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // D-20: conservative PII posture
  sendDefaultPii: false,

  // D-20: belt-and-braces scrubber for any PII-shaped fields that slip past the default
  beforeSend(event) {
    return scrubPii(event);
  },

  integrations: [Sentry.replayIntegration()],
});

// App Router navigation-transition instrumentation (per Sentry skill)
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

// PII scrubber — redacts common field names across request, user, extra, contexts.
// Inline so the client bundle doesn't pull a helper module.
function scrubPii<
  T extends { request?: unknown; user?: unknown; extra?: unknown; contexts?: unknown },
>(event: T): T {
  const PII_FIELDS = [
    "email",
    "phone",
    "password",
    "token",
    "authorization",
    "cookie",
    "childname",
    "parentname",
    "address",
  ];
  const redact = (obj: unknown): unknown => {
    if (!obj || typeof obj !== "object") return obj;
    const src = obj as Record<string, unknown>;
    const out: Record<string, unknown> = Array.isArray(obj)
      ? ([...(obj as unknown[])] as unknown as Record<string, unknown>)
      : { ...src };
    for (const key of Object.keys(out)) {
      if (PII_FIELDS.some((p) => key.toLowerCase().includes(p))) {
        out[key] = "[redacted]";
      } else if (typeof out[key] === "object") {
        out[key] = redact(out[key]);
      }
    }
    return out;
  };
  if (event.request) event.request = redact(event.request);
  if (event.user && typeof event.user === "object") {
    event.user = {
      ...(event.user as Record<string, unknown>),
      ip_address: undefined,
      email: undefined,
    };
  }
  if (event.extra) event.extra = redact(event.extra);
  if (event.contexts) event.contexts = redact(event.contexts);
  return event;
}

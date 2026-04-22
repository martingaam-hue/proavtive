// Server-runtime Sentry init — loaded by instrumentation.ts when NEXT_RUNTIME === 'nodejs'.
// Pattern per sentry-nextjs-sdk SKILL.md.
// D-18: environment = VERCEL_ENV
// D-20: conservative PII posture (sendDefaultPii: false + beforeSend scrubber)

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  environment: process.env.VERCEL_ENV ?? "local",
  release: process.env.VERCEL_GIT_COMMIT_SHA,

  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  // Attach local variable values to server stack frames for easier debugging
  includeLocalVariables: true,

  sendDefaultPii: false,

  beforeSend(event) {
    return scrubPii(event);
  },
});

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

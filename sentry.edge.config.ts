// Edge-runtime Sentry init — loaded by instrumentation.ts when NEXT_RUNTIME === 'edge'.
// Phase 1 adds middleware (which runs in this runtime). Configured now so it's ready.
// Edge has no access to Node APIs; keep the scrubber simple.

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  environment: process.env.VERCEL_ENV ?? "local",
  release: process.env.VERCEL_GIT_COMMIT_SHA,

  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  sendDefaultPii: false,

  beforeSend(event) {
    // Minimal scrub — edge runtime keeps this light. Full scrubber lives on the server.
    if (event.user && typeof event.user === "object") {
      event.user = {
        ...(event.user as Record<string, unknown>),
        ip_address: undefined,
        email: undefined,
      };
    }
    return event;
  },
});

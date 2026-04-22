// Next.js 15 register() hook — dispatches the correct Sentry config per runtime.
// Pattern per sentry-nextjs-sdk SKILL.md.

import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Captures all unhandled server-side request errors (App Router + Pages Router + Route Handlers).
// Requires @sentry/nextjs >= 8.28.0.
export const onRequestError = Sentry.captureRequestError;

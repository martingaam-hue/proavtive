"use client";

// Root-layout + render-error boundary for App Router.
// Catches errors thrown by the root layout or by React renders that propagate past
// any route-level error.tsx boundaries. Reports to Sentry then shows the default Next error UI.
// Pattern per sentry-nextjs-sdk SKILL.md.

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}

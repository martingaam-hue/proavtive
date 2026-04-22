// Phase 1 / Plan 01-01 — sg market tree layout.
// D-04 INTENT: markets stay invisible in external URLs. The plain-folder path `/sg` is an
// internal rewrite target set by middleware.ts via NextResponse.rewrite() — the browser URL
// bar continues to show the host + original path, never the /sg/ prefix.
// UI-SPEC §Color line 92 — teal-400 distinguisher stripe for SC #1 eye-test. Removed in Phase 5.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ProActiv Sports — Singapore (Phase 1 placeholder)",
};

export default function SGGroupLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* UI-SPEC §Color — 4px teal-400 top stripe. Removed by Phase 5 when the real SG homepage ships. */}
      <div aria-hidden className="h-1 w-full bg-teal-400" />
      {children}
    </>
  );
}

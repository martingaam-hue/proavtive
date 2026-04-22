// Phase 1 / Plan 01-01 — hk market tree layout.
// D-04 INTENT: markets stay invisible in external URLs. The plain-folder path `/hk` is an
// internal rewrite target set by middleware.ts via NextResponse.rewrite() — the browser URL
// bar continues to show the host + original path, never the /hk/ prefix.
// UI-SPEC §Color line 92 — amber-400 distinguisher stripe for SC #1 eye-test. Removed in Phase 4.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ProActiv Sports — Hong Kong (Phase 1 placeholder)",
};

export default function HKGroupLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* UI-SPEC §Color — 4px amber-400 top stripe. Removed by Phase 4 when the real HK homepage ships. */}
      <div aria-hidden className="h-1 w-full bg-amber-400" />
      {children}
    </>
  );
}

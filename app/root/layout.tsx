// Phase 1 / Plan 01-01 — root market tree layout.
// D-04 INTENT: markets stay invisible in external URLs. The plain-folder path `/root` is an
// internal rewrite target set by middleware.ts via NextResponse.rewrite() — the browser URL
// bar continues to show the host + original path, never the /root/ prefix.
// UI-SPEC §Color line 92 — slate-400 distinguisher stripe for SC #1 eye-test. Removed in Phase 3.
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

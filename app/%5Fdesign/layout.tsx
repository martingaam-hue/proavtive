// Phase 2 / Plan 02-06 — /_design/ gallery layout shell per UI-SPEC §4.2.
// Sticky sidebar on desktop, mobile anchor chips collapsed to top.
// RSC — no 'use client' — nav is pure anchor links (Planner choice vs IntersectionObserver).

import type { Metadata } from "next";
import { GalleryNav } from "./_nav";

export const metadata: Metadata = {
  title: "Phase 2 Design System — Internal (ProActiv)",
  robots: { index: false, follow: false },
};

export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sticky sidebar — desktop only */}
      <aside
        aria-label="Gallery navigation"
        className="hidden border-r bg-muted lg:fixed lg:inset-y-0 lg:block lg:w-64 lg:overflow-y-auto"
      >
        <GalleryNav />
      </aside>
      {/* Main column — leaves room for the fixed sidebar on lg+ */}
      <div className="flex-1 lg:pl-64">{children}</div>
    </div>
  );
}

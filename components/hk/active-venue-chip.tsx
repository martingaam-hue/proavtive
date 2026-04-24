"use client";
// Phase 4 / Plan 04-02 — client wrapper for VenueChipRow that highlights the
// active venue based on the current pathname.
//
// Pitfall 2 (RESEARCH): usePathname returns the BROWSER URL (post-middleware
// rewrite origin). The browser still sees `/wan-chai/`, not `/hk/wan-chai/` —
// middleware rewrites to the /hk/ tree server-side only. So compare the
// pathname against the href as-is (no prefix stripping).

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface ActiveVenueChipProps {
  venueId: "wan-chai" | "cyberport";
  href: string;
  children: React.ReactNode;
}

export function ActiveVenueChip({
  href,
  children,
}: ActiveVenueChipProps) {
  const pathname = usePathname() ?? "";
  const isActive = pathname === href || pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={cn("group block", isActive && "ring-2 ring-brand-navy rounded-lg")}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}

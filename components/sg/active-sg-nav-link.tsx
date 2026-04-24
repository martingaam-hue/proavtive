"use client";
// Phase 5 / Plan 05-04 — active-state pillar nav chip (client component).
// Per RESEARCH Pitfall 2 + UI-SPEC §5.5: usePathname() returns the browser URL
// pre-rewrite (no market-prefix). The href values in SG_ZONES / SG_CAMP_TYPES
// are also pre-rewrite (e.g. "/weekly-classes/movement/") so direct string
// comparison works.
//
// Pitfall 2: usePathname() returns browser URL pre-rewrite (no /sg/ prefix).
// Pitfall 8: exact-match, NOT startsWith, so pillar-root shows no active chip.
//   If we used startsWith, every zone chip would be "active" on /weekly-classes/
//   because all zone hrefs start with /weekly-classes/. Exact match avoids this.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface ActiveSGNavLinkProps {
  href: string;
  label: string;
  ageBand: string;
  badge?: React.ReactNode;
}

export function ActiveSGNavLink({
  href,
  label,
  ageBand,
  badge,
}: ActiveSGNavLinkProps) {
  const pathname = usePathname() ?? "";
  // Match exact path or path without trailing slash.
  // MUST use exact match, NOT startsWith (Pitfall 8 — otherwise pillar-root
  // shows all chips as active because all zone hrefs share the pillar prefix).
  // Comparison has no market-prefix (Pitfall 2 — pathname is the browser URL).
  const isActive = pathname === href || pathname === href.replace(/\/$/, "");

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex flex-col items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-12",
        isActive
          ? "bg-brand-navy text-white"
          : "bg-muted text-foreground hover:bg-brand-navy/10"
      )}
    >
      <span className="font-sans font-semibold">{label}</span>
      <span className="text-[11px] opacity-70 mt-0.5">{ageBand}</span>
      {badge}
    </Link>
  );
}

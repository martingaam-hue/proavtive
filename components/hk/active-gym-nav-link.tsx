"use client";
// Phase 4 / Plan 04-05 — Active-state pillar nav chip (client component).
// Per RESEARCH Pitfall 2 + UI-SPEC §5.5: usePathname returns the browser URL
// pre-rewrite (no market-prefix). The href values in HK_GYMNASTICS_PROGRAMMES
// are also pre-rewrite (e.g. "/gymnastics/toddlers/") so direct string
// comparison works.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface ActiveGymNavLinkProps {
  href: string;
  label: string;
  ageBand: string;
}

export function ActiveGymNavLink({
  href,
  label,
  ageBand,
}: ActiveGymNavLinkProps) {
  const pathname = usePathname() ?? "";
  // Match exact path or path without trailing slash. Comparison MUST NOT
  // include a market-prefix (Pitfall 2 — pathname is the browser URL).
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
    </Link>
  );
}

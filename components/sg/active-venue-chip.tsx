"use client";
// Phase 5 / Plan 05-02 — client wrapper for VenueChipRow that highlights the
// Katong Point chip based on the current pathname.
//
// Pitfall 2 (RESEARCH): usePathname returns the BROWSER URL (post-middleware
// rewrite origin). The browser still sees `/katong-point/`, not `/sg/katong-point/` —
// middleware rewrites to the /sg/ tree server-side only. So compare the
// pathname against the href as-is (no prefix stripping).

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ActiveVenueChipProps {
  href: string;
  label: string;
  address: string;
}

export function ActiveVenueChip({
  href,
  label,
  address,
}: ActiveVenueChipProps) {
  const pathname = usePathname() ?? "";
  const isActive = pathname === href || pathname === href.replace(/\/$/, "");

  return (
    <Link
      href={href}
      className={cn("group block", isActive && "ring-2 ring-brand-navy rounded-lg")}
      aria-current={isActive ? "page" : undefined}
    >
      <Card
        className={cn(
          "px-4 py-3 flex flex-row items-center gap-3 transition-all",
          isActive
            ? "bg-brand-navy text-white border-brand-navy"
            : "bg-background border border-brand-navy/20 hover:-translate-y-1 hover:shadow-md"
        )}
      >
        <MapPin
          className={cn(
            "size-4 shrink-0",
            isActive ? "text-white" : "text-brand-navy"
          )}
          aria-hidden="true"
        />
        <div>
          <div
            className={cn(
              "font-sans font-semibold",
              isActive ? "text-white" : "text-foreground"
            )}
          >
            <span className="font-accent">Prodigy</span>{" "}
            {label.replace(/^Prodigy\s*@?\s*/i, "")}
          </div>
          <div
            className={cn(
              "text-sm",
              isActive ? "text-white/80" : "text-muted-foreground"
            )}
          >
            {address}
          </div>
        </div>
      </Card>
    </Link>
  );
}

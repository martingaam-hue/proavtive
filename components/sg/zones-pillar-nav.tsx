// Phase 5 / Plan 05-04 — Weekly Classes pillar nav (RSC wrapping client chips).
// Maps SG_ZONES to ActiveSGNavLink chips; active-state is derived per-pathname
// on the client. Sports+MultiBall chip carries Singapore's-only Badge inline
// per UI-SPEC §5.5.

import { SG_ZONES } from "@/lib/sg-data";
import { ActiveSGNavLink } from "@/components/sg/active-sg-nav-link";
import { Badge } from "@/components/ui/badge";

export function ZonesPillarNav() {
  return (
    <nav aria-label="Prodigy zones" className="flex flex-wrap gap-2 md:gap-3">
      {SG_ZONES.map((z) => (
        <ActiveSGNavLink
          key={z.slug}
          href={z.href}
          label={z.label}
          ageBand={z.ageBand}
          badge={
            z.slug === "sports-multiball" ? (
              <Badge className="bg-brand-green text-white ml-2 text-[10px]">
                Singapore&apos;s only
              </Badge>
            ) : undefined
          }
        />
      ))}
    </nav>
  );
}

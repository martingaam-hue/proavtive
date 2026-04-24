// Phase 5 / Plan 05-04 — Prodigy Camps pillar nav (RSC wrapping client chips).
// Maps SG_CAMP_TYPES to ActiveSGNavLink chips; active-state is derived per-pathname
// on the client. Uniform chips — no badge treatment per UI-SPEC §5.6.

import { SG_CAMP_TYPES } from "@/lib/sg-data";
import { ActiveSGNavLink } from "@/components/sg/active-sg-nav-link";

export function CampsPillarNav() {
  return (
    <nav
      aria-label="Prodigy camp types"
      className="flex flex-wrap gap-2 md:gap-3"
    >
      {SG_CAMP_TYPES.map((c) => (
        <ActiveSGNavLink
          key={c.slug}
          href={c.href}
          label={c.label}
          ageBand={c.ageBand}
        />
      ))}
    </nav>
  );
}

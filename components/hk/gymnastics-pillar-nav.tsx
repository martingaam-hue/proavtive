// Phase 4 / Plan 04-05 — Gymnastics pillar sub-nav (RSC wrapper around 8 client chips).
// Renders all 8 programmes as ActiveGymNavLink chips; active-state is derived
// per-pathname on the client (see active-gym-nav-link.tsx). Used by the pillar
// page AND every sub-page at the top of content per UI-SPEC §4 + §5.5.

import { HK_GYMNASTICS_PROGRAMMES } from "@/lib/hk-data";
import { ActiveGymNavLink } from "@/components/hk/active-gym-nav-link";

export function GymPillarNav() {
  return (
    <nav
      aria-label="Gymnastics programmes"
      className="flex flex-wrap gap-2 md:gap-3"
    >
      {HK_GYMNASTICS_PROGRAMMES.map((p) => (
        <ActiveGymNavLink
          key={p.slug}
          href={p.href}
          label={p.label}
          ageBand={p.ageBand}
        />
      ))}
    </nav>
  );
}

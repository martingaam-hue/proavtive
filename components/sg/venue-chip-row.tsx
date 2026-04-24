// Phase 5 / Plan 05-02 — SG venue chip row composition (SG homepage §3.2).
//
// SG simplification per D-08 (single venue — Katong Point only):
// NO `.map()` pattern — renders a SINGLE centred chip unlike HK's 2-venue VenueChipRow.
// Label + address pulled from KATONG_POINT_NAP (Plan 05-01 export) — not hardcoded.
// Active state highlighting handled by ActiveVenueChip client wrapper (usePathname).
//
// UI-SPEC §5.3: the emoji 📍 in the plan text is a writing shortcut — we MUST
// use the lucide MapPin icon per the strict "no emojis in icon system" rule.

import { KATONG_POINT_NAP } from "@/lib/sg-data";
import { ActiveVenueChip } from "@/components/sg/active-venue-chip";

export function VenueChipRow() {
  return (
    <nav aria-label="Prodigy Singapore venues">
      <div className="flex justify-center">
        <ActiveVenueChip
          href="/katong-point/"
          label={KATONG_POINT_NAP.nameFull}
          address={KATONG_POINT_NAP.addressStreet}
        />
      </div>
    </nav>
  );
}

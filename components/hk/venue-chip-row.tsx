// Phase 4 / Plan 04-02 — Venue chip row composition (HK homepage §3.2).
//
// Two chips, flex-col on mobile, flex-row centered on desktop. Each chip is a
// <Link> wrapping <Card> with MapPin + Baloo-accent "ProGym" + Manrope-SemiBold
// venue name + single-line address. Active state highlighting is handled by the
// ActiveVenueChip client wrapper (usePathname — Pitfall 2).
//
// UI-SPEC §5.3: the emoji 📍 in the plan text is a writing shortcut — we MUST
// use the lucide MapPin icon per the strict "no emojis in icon system" rule.

import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { HK_VENUES } from "@/lib/hk-data";
import { ActiveVenueChip } from "@/components/hk/active-venue-chip";

export function VenueChipRow() {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-center gap-4 flex-wrap">
      {HK_VENUES.map((v) => (
        <ActiveVenueChip key={v.id} venueId={v.id} href={`/${v.id}/`}>
          <Card className="px-4 py-3 border border-brand-navy/20 hover:-translate-y-1 hover:shadow-md transition-all flex flex-row items-center gap-3">
            <MapPin
              className="size-4 text-brand-navy shrink-0"
              aria-hidden="true"
            />
            <div>
              <div className="font-sans font-semibold text-foreground">
                <span className="font-accent">ProGym</span> {v.nameShort}
              </div>
              <div className="text-sm text-muted-foreground">
                {v.addressStreet}
              </div>
            </div>
          </Card>
        </ActiveVenueChip>
      ))}
    </div>
  );
}

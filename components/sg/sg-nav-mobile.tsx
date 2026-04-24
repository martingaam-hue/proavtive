"use client";
// Phase 5 / Plan 05-02 — SG mobile navigation (Sheet drawer).
// Mirrors components/hk/hk-nav-mobile.tsx Phase 4 pattern (Sheet + Menu icon +
// nav-link list with onClick close). Sticky red Book a Free Trial CTA appears at
// the top AND bottom of the sheet per D-05 SG mobile variant (UI-SPEC §5.1 mobile variant).

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SG_ZONES, SG_CAMP_TYPES } from "@/lib/sg-data";

// Group 3 flat links visible in mobile Sheet only (Parties / Schools / Events / Blog
// are not in the desktop nav per UI-SPEC §5.1 — mobile gives more space).
const FLAT_NAV_LINKS = [
  { href: "/katong-point/", label: "Katong Point" },
  { href: "/birthday-parties/", label: "Parties" },
  { href: "/school-partnerships/", label: "Schools" },
  { href: "/events/", label: "Events" },
  { href: "/coaches/", label: "Coaches" },
  { href: "/blog/", label: "Blog" },
  { href: "/faq/", label: "FAQ" },
] as const;

export function SGNavMobile() {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="lg:hidden min-h-11 min-w-11"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:w-80 bg-background overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="font-display text-lg">Menu</SheetTitle>
        </SheetHeader>

        {/* Sticky red CTA at top of sheet — universal D-05 conversion entry */}
        <div className="mt-6 px-4">
          <Button
            asChild
            size="touch"
            className="bg-brand-red text-white hover:bg-brand-red/90 w-full"
          >
            <Link href="/book-a-trial/" onClick={close}>
              Book a Free Trial
            </Link>
          </Button>
        </div>

        {/* Grouped nav: Weekly Classes / Prodigy Camps / Flat */}
        <nav
          aria-label="Mobile primary"
          className="mt-8 flex flex-col gap-1 px-4"
        >
          {/* Group 1 — Weekly Classes (maps SG_ZONES) */}
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Weekly Classes
          </h3>
          {SG_ZONES.map((z) => (
            <Link
              key={z.slug}
              href={z.href}
              onClick={close}
              className="font-sans text-base py-2 min-h-12 text-foreground hover:text-brand-navy transition-colors flex items-center gap-2"
            >
              {z.label}{" "}
              <span className="text-sm text-muted-foreground">{z.ageBand}</span>
              {z.slug === "sports-multiball" && (
                <Badge className="bg-brand-green text-white text-xs">
                  Singapore&apos;s only
                </Badge>
              )}
            </Link>
          ))}

          {/* Group 2 — Prodigy Camps (maps SG_CAMP_TYPES) */}
          <h3 className="mt-6 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Prodigy Camps
          </h3>
          {SG_CAMP_TYPES.map((c) => (
            <Link
              key={c.slug}
              href={c.href}
              onClick={close}
              className="font-sans text-base py-2 min-h-12 text-foreground hover:text-brand-navy transition-colors"
            >
              {c.label}{" "}
              <span className="text-sm text-muted-foreground">{c.ageBand}</span>
              {c.tag && (
                <span className="block text-xs text-muted-foreground mt-0.5">
                  {c.tag}
                </span>
              )}
            </Link>
          ))}

          {/* Group 3 — flat links (border-separated) */}
          <div className="mt-6 border-t border-border pt-4 flex flex-col gap-1">
            {FLAT_NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                className="font-sans text-base py-2 min-h-12 text-foreground hover:text-brand-navy transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Bottom sticky Book CTA — D-05 SG mobile variant (second CTA at bottom of sheet) */}
        <div className="mt-6 px-4 pb-4">
          <Button
            asChild
            size="touch"
            className="bg-brand-red text-white hover:bg-brand-red/90 w-full"
          >
            <Link href="/book-a-trial/" onClick={close}>
              Book a Free Trial
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

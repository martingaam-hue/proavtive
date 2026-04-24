"use client";
// Phase 4 / Plan 04-02 — HK mobile navigation (Sheet drawer).
// Mirrors components/root/root-nav-mobile.tsx Phase 3 pattern (Sheet + Menu icon +
// nav-link list with onClick close). Sticky red Book a Free Trial CTA appears at
// the top of the sheet (D-05 — every viewport).

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { HK_GYMNASTICS_PROGRAMMES, HK_VENUES } from "@/lib/hk-data";

const FLAT_NAV_LINKS = [
  { href: "/holiday-camps/", label: "Camps" },
  { href: "/coaches/", label: "Coaches" },
  { href: "/blog/", label: "Blog" },
  { href: "/faq/", label: "FAQ" },
] as const;

export function HKNavMobile() {
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
            <Link href="/book-a-trial/free-assessment/" onClick={close}>
              Book a Free Trial
            </Link>
          </Button>
        </div>

        {/* Grouped nav: Gymnastics / Locations / Flat */}
        <nav
          aria-label="Mobile primary"
          className="mt-8 flex flex-col gap-1 px-4"
        >
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Gymnastics
          </h3>
          {HK_GYMNASTICS_PROGRAMMES.map((p) => (
            <Link
              key={p.slug}
              href={p.href}
              onClick={close}
              className="font-sans text-base py-2 min-h-12 text-foreground hover:text-brand-navy transition-colors"
            >
              {p.label}{" "}
              <span className="text-sm text-muted-foreground">
                {p.ageBand}
              </span>
            </Link>
          ))}

          {/* Locations group */}
          <h3 className="mt-6 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Locations
          </h3>
          {HK_VENUES.map((v) => (
            <Link
              key={v.id}
              href={`/${v.id}/`}
              onClick={close}
              className="font-sans text-base py-2 min-h-12 text-foreground hover:text-brand-navy transition-colors"
            >
              <span className="font-accent">ProGym</span> {v.nameShort}
            </Link>
          ))}

          {/* Flat links */}
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
      </SheetContent>
    </Sheet>
  );
}

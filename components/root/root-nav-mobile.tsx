"use client";

// Phase 3 / Plan 03-01 — RootNav mobile drawer. Client island for the hamburger toggle + Sheet drawer.
// Only the trigger + Sheet state lives here; nav-link data is passed in via props from the RSC parent.

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

interface RootNavMobileProps {
  navLinks: ReadonlyArray<{ href: string; label: string }>;
  hkUrl: string;
  sgUrl: string;
}

export function RootNavMobile({ navLinks, hkUrl, sgUrl }: RootNavMobileProps) {
  const [open, setOpen] = React.useState(false);

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
      <SheetContent side="right" className="w-full sm:w-80 bg-background">
        <SheetHeader>
          <SheetTitle className="text-h3 font-display">Menu</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile primary" className="mt-8 flex flex-col gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-h3 font-display text-foreground py-3 min-h-12 hover:text-brand-red transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 flex flex-col gap-3">
          <Button asChild size="touch" variant="default" className="w-full">
            <a href={hkUrl}>Enter Hong Kong →</a>
          </Button>
          <Button asChild size="touch" variant="default" className="w-full">
            <a href={sgUrl}>Enter Singapore →</a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

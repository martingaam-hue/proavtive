// Phase 4 / Plan 04-02 — HK primary navigation (RSC).
// Per UI-SPEC §5.1 + CONTEXT D-02 (6 primary items + sticky CTA), D-03 (Gymnastics dropdown 8 items),
// D-04 (Locations dropdown 2 items), D-05 (sticky red Book a Free Trial CTA), D-06 (lives at components/hk/).
//
// The sticky red CTA is THE single exception to the "no red on nav" rule (UI-SPEC §Color reserved list).
//
// Pitfall 7 (RESEARCH): All HKNav <Link> hrefs are same-host; cross-subdomain links
// (Prodigy Singapore, ProActiv Sports Group) live in HKFooter via absolute <a href={env}>.
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { HKNavMobile } from "@/components/hk/hk-nav-mobile";
import { HK_GYMNASTICS_PROGRAMMES, HK_VENUES } from "@/lib/hk-data";

// 6 primary nav items per CONTEXT D-02 (Gymnastics + Locations are dropdown triggers;
// the trigger labels appear in the bar but their hrefs are pillar pages — trigger clicks
// are also navigations for keyboard / no-JS users).
const FLAT_NAV_LINKS = [
  { href: "/holiday-camps/", label: "Camps" },
  { href: "/coaches/", label: "Coaches" },
  { href: "/faq/", label: "FAQ" },
] as const;

export function HKNav() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-brand-navy/10">
      <ContainerEditorial
        width="wide"
        className="flex items-center justify-between h-16 lg:h-20"
      >
        {/* Brand lockup — "ProActiv" in Unbounded display, "HK" in Baloo accent */}
        <Link
          href="/"
          aria-label="ProActiv Sports Hong Kong — home"
          className="font-display font-bold text-xl text-brand-navy hover:text-brand-navy/80 transition-colors"
        >
          ProActiv <span className="font-accent text-brand-red">HK</span>
        </Link>

        {/* Desktop primary nav (lg+) */}
        <NavigationMenu className="hidden lg:flex" aria-label="Primary">
          <NavigationMenuList className="gap-2">
            {/* Gymnastics dropdown — D-03 (8 sub-programmes) */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-medium text-foreground hover:text-brand-navy">
                Gymnastics
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-1 p-3 min-w-[320px] bg-white border border-border rounded-lg shadow-lg">
                  {HK_GYMNASTICS_PROGRAMMES.map((p) => (
                    <li key={p.slug}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={p.href}
                          className="block px-3 py-2 rounded hover:bg-brand-navy/5 transition-colors"
                        >
                          <div className="font-sans font-semibold text-foreground">
                            {p.label}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {p.ageBand}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                  <li className="border-t border-border mt-1 pt-1">
                    <NavigationMenuLink asChild>
                      <Link
                        href="/gymnastics/"
                        className="block px-3 py-2 rounded text-sm font-semibold text-brand-navy hover:bg-brand-navy/5"
                      >
                        See all programmes →
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Locations dropdown — D-04 (Wan Chai + Cyberport) */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-medium text-foreground hover:text-brand-navy">
                Locations
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-1 p-3 min-w-[320px] bg-white border border-border rounded-lg shadow-lg">
                  {HK_VENUES.map((v) => (
                    <li key={v.id}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/${v.id}/`}
                          className="block px-3 py-2 rounded hover:bg-brand-navy/5 transition-colors"
                        >
                          <div className="font-sans font-semibold text-foreground">
                            <span className="font-accent">ProGym</span>{" "}
                            {v.nameShort}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {v.addressStreet}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Flat nav items (Camps / Coaches / FAQ) */}
            {FLAT_NAV_LINKS.map(({ href, label }) => (
              <NavigationMenuItem key={href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={href}
                    className="px-3 py-2 font-medium text-foreground hover:text-brand-navy transition-colors"
                  >
                    {label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Sticky red Book a Free Trial CTA — D-05 (visible on every HK page;
            THE single nav red-fill exception per UI-SPEC §Color) */}
        <div className="hidden lg:block">
          <Button
            asChild
            size="touch"
            className="bg-brand-red text-white hover:bg-brand-red/90 focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
          >
            <Link href="/book-a-trial/free-assessment/">Book a Free Trial</Link>
          </Button>
        </div>

        {/* Mobile (<lg) hamburger + Sheet */}
        <HKNavMobile />
      </ContainerEditorial>
    </header>
  );
}

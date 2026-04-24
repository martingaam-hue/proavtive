// Phase 5 / Plan 05-02 — SG primary navigation (RSC).
// Per UI-SPEC §5.1 + CONTEXT D-02 (6 primary items + sticky CTA), D-03 (Weekly Classes dropdown 3 zones),
// D-04 (Prodigy Camps dropdown 3 camp types), D-05 (sticky red Book a Free Trial CTA), D-06.
//
// The sticky red CTA is THE single exception to the "no red on nav" rule (UI-SPEC §Color reserved list).
//
// Pitfall 7 (RESEARCH): All SGNav <Link> hrefs are same-host; cross-subdomain links
// (ProGym Hong Kong, ProActiv Sports Group) live in SGFooter via absolute <a href={env}>.
import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { SGNavMobile } from "@/components/sg/sg-nav-mobile";
import { SG_ZONES, SG_CAMP_TYPES } from "@/lib/sg-data";

// 3 flat nav links visible on desktop (right of dropdowns) per CONTEXT D-02.
// Parties / Schools / Events / Blog are in mobile Sheet only (UI-SPEC §5.1 desktop = 6 items total).
const FLAT_NAV_LINKS = [
  { href: "/katong-point/", label: "Katong Point" },
  { href: "/coaches/", label: "Coaches" },
  { href: "/faq/", label: "FAQ" },
] as const;

export function SGNav() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-brand-navy/10">
      <ContainerEditorial
        width="wide"
        className="flex items-center justify-between h-16 lg:h-20"
      >
        {/* Brand lockup — "Prodigy" in Baloo accent (brand-green), "SG" in display font */}
        <Link
          href="/"
          aria-label="Prodigy by ProActiv Sports Singapore — home"
          className="font-display font-bold text-xl text-brand-navy hover:text-brand-navy/80 transition-colors"
        >
          <span className="font-accent text-brand-green">Prodigy</span> SG
        </Link>

        {/* Desktop primary nav (lg+) */}
        <NavigationMenu className="hidden lg:flex" aria-label="Primary">
          <NavigationMenuList className="gap-2">
            {/* Weekly Classes dropdown — D-03 (3 zones from SG_ZONES) */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-medium text-foreground hover:text-brand-navy">
                Weekly Classes
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-1 p-3 min-w-[320px] bg-white border border-border rounded-lg shadow-lg">
                  {SG_ZONES.map((z) => (
                    <li key={z.slug}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={z.href}
                          className="block px-3 py-2 rounded hover:bg-brand-navy/5 transition-colors"
                        >
                          <div className="font-sans font-semibold text-foreground flex items-center gap-2">
                            {z.label}
                            {z.slug === "sports-multiball" && (
                              <Badge className="bg-brand-green text-white">
                                Singapore&apos;s only
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {z.ageBand}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                  <li className="border-t border-border mt-1 pt-1">
                    <NavigationMenuLink asChild>
                      <Link
                        href="/weekly-classes/"
                        className="block px-3 py-2 rounded text-sm font-semibold text-brand-navy hover:bg-brand-navy/5"
                      >
                        See all zones →
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Prodigy Camps dropdown — D-04 (3 camp types from SG_CAMP_TYPES) */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-medium text-foreground hover:text-brand-navy">
                Prodigy Camps
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-1 p-3 min-w-[320px] bg-white border border-border rounded-lg shadow-lg">
                  {SG_CAMP_TYPES.map((c) => (
                    <li key={c.slug}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={c.href}
                          className="block px-3 py-2 rounded hover:bg-brand-navy/5 transition-colors"
                        >
                          <div className="font-sans font-semibold text-foreground">
                            {c.label}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {c.ageBand}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                  <li className="border-t border-border mt-1 pt-1">
                    <NavigationMenuLink asChild>
                      <Link
                        href="/prodigy-camps/"
                        className="block px-3 py-2 rounded text-sm font-semibold text-brand-navy hover:bg-brand-navy/5"
                      >
                        See all camps →
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Flat nav items (Katong Point / Coaches / FAQ) */}
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

        {/* Sticky red Book a Free Trial CTA — D-05 (visible on every SG page;
            THE single nav red-fill exception per UI-SPEC §Color) */}
        <div className="hidden lg:block">
          <Button
            asChild
            size="touch"
            className="bg-brand-red text-white hover:bg-brand-red/90 focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
          >
            <a href="/book-a-trial/">
              Book a Free Trial <ArrowRight className="ml-2 size-4" />
            </a>
          </Button>
        </div>

        {/* Mobile (<lg) hamburger + Sheet */}
        <SGNavMobile />
      </ContainerEditorial>
    </header>
  );
}

// Phase 4 / Plan 04-02 — HK primary navigation (RSC).
// Per UI-SPEC §5.1 + CONTEXT D-02 (6 primary items + sticky CTA), D-03 (Gymnastics dropdown 8 items),
// D-04 (Locations dropdown 2 items), D-05 (sticky red Book a Free Trial CTA), D-06 (lives at components/hk/).
//
// The sticky red CTA is THE single exception to the "no red on nav" rule (UI-SPEC §Color reserved list).
//
// Pitfall 7 (RESEARCH): All HKNav <Link> hrefs are same-host; cross-subdomain links
// (Prodigy Singapore, ProActiv Sports Group) live in HKFooter via absolute <a href={env}>.
//
// Cookie fix: rootUrl uses NEXT_PUBLIC_ROOT_URL ?? "/?__market=root" — the query bridge
// sets the x-market cookie to "root" (a valid KNOWN_MARKETS value) and rewrites to /root,
// breaking the x-market=hk cookie loop that traps users on the HK tree.
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
  { href: "/birthday-parties/", label: "Parties" },
  { href: "/coaches/", label: "Coaches" },
  { href: "/faq/", label: "FAQ" },
] as const;

export function HKNav() {
  const rootUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? "/?__market=root";

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/8">
      <ContainerEditorial width="wide" className="flex items-center justify-between h-16 lg:h-20">
        {/* Brand lockup — group breadcrumb + market wordmark */}
        <div className="flex items-center gap-3">
          <a
            href={rootUrl}
            className="hidden lg:block font-display text-[0.6rem] tracking-[0.22em] uppercase text-white/35 hover:text-white/65 transition-colors duration-200"
            aria-label="ProActiv Sports Group — back to main site"
          >
            ProActiv Group
          </a>
          <span className="hidden lg:block text-white/15 select-none">·</span>
          <Link
            href="/"
            aria-label="ProActiv Sports Hong Kong — home"
            className="font-display font-bold text-xl text-white hover:text-white/80 transition-colors"
          >
            ProActiv <span className="font-accent text-brand-red">HK</span>
          </Link>
        </div>

        {/* Desktop primary nav (lg+) */}
        <NavigationMenu className="hidden lg:flex" aria-label="Primary">
          <NavigationMenuList className="gap-2">
            {/* Gymnastics dropdown — D-03 (8 sub-programmes) */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-medium text-white/70 hover:text-white bg-transparent hover:bg-white/6 data-[state=open]:bg-white/6 data-[active]:text-white transition-colors">
                Gymnastics
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-1 p-3 min-w-[320px] bg-[#0f0f14] border border-white/10 rounded-lg shadow-xl shadow-black/60">
                  {HK_GYMNASTICS_PROGRAMMES.map((p) => (
                    <li key={p.slug}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={p.href}
                          className="block px-3 py-2 rounded hover:bg-white/6 transition-colors"
                        >
                          <div className="font-sans font-semibold text-white/90">{p.label}</div>
                          <div className="text-sm text-white/40">{p.ageBand}</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                  <li className="border-t border-white/10 mt-1 pt-1">
                    <NavigationMenuLink asChild>
                      <Link
                        href="/gymnastics/"
                        className="block px-3 py-2 rounded text-sm font-semibold text-brand-red hover:bg-white/6 transition-colors"
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
              <NavigationMenuTrigger className="font-medium text-white/70 hover:text-white bg-transparent hover:bg-white/6 data-[state=open]:bg-white/6 data-[active]:text-white transition-colors">
                Locations
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-1 p-3 min-w-[320px] bg-[#0f0f14] border border-white/10 rounded-lg shadow-xl shadow-black/60">
                  {HK_VENUES.map((v) => (
                    <li key={v.id}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/${v.id}/`}
                          className="block px-3 py-2 rounded hover:bg-white/6 transition-colors"
                        >
                          <div className="font-sans font-semibold text-white/90">
                            <span className="font-accent text-brand-red">ProGym</span> {v.nameShort}
                          </div>
                          <div className="text-sm text-white/40">{v.addressStreet}</div>
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
                    className="px-3 py-2 font-medium text-white/70 hover:text-white transition-colors"
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
        <div className="hidden lg:flex items-center gap-3">
          <Button
            asChild
            size="touch"
            className="bg-brand-red text-white hover:bg-brand-red/90 focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]"
          >
            <Link href="/book-a-trial/free-assessment/">Book a Free Trial</Link>
          </Button>
        </div>

        {/* Mobile (<lg) hamburger + Sheet */}
        <HKNavMobile rootUrl={rootUrl} />
      </ContainerEditorial>
    </header>
  );
}

// Phase 5 / Plan 05-02 — SG primary navigation (RSC) — Nexus design system.
// Per UI-SPEC §5.1 + CONTEXT D-02 (6 primary items + sticky CTA), D-03 (Weekly Classes dropdown 3 zones),
// D-04 (Prodigy Camps dropdown 3 camp types), D-05 (sticky teal Book a Free Trial CTA), D-06.
//
// Nexus redesign: white sticky header, navy wordmark with coral "SPORTS" superscript,
// gray-600 nav links with navy hover, teal pill CTA.
//
// Pitfall 7 (RESEARCH): All SGNav <Link> hrefs are same-host; cross-subdomain links
// (ProGym Hong Kong, ProActiv Sports Group) live in SGFooter via absolute <a href={env}>.
//
// Cookie fix: rootUrl uses NEXT_PUBLIC_ROOT_URL ?? "/?__market=root" — resets x-market
// cookie to "root", breaking the loop that traps users on the SG tree.
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

// 4 flat nav links visible on desktop (right of dropdowns) per CONTEXT D-02.
// Schools / Events / Blog are in mobile Sheet only (UI-SPEC §5.1 desktop = 6 items total).
const FLAT_NAV_LINKS = [
  { href: "/katong-point/", label: "Katong Point" },
  { href: "/coaches/", label: "Coaches" },
  { href: "/birthday-parties/", label: "Parties" },
  { href: "/faq/", label: "FAQ" },
] as const;

export function SGNav() {
  const rootUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? "/?__market=root";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/[0.06] shadow-sm">
      <ContainerEditorial width="wide" className="flex items-center justify-between h-16 lg:h-20">
        {/* Brand lockup — navy wordmark + coral SPORTS superscript */}
        <div className="flex items-center gap-3">
          <a
            href={rootUrl}
            className="hidden lg:block font-display text-[0.6rem] tracking-[0.22em] uppercase text-gray-400 hover:text-[#0f206c] transition-colors duration-200"
            aria-label="ProActiv Sports Group — back to main site"
          >
            ProActiv Group
          </a>
          <span className="hidden lg:block text-gray-300 select-none">·</span>
          <Link
            href="/"
            aria-label="Prodigy by ProActiv Sports Singapore — home"
            className="hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo-white.png"
              alt="ProActiv Sports"
              width={160}
              height={48}
              className="h-8 w-auto object-contain brightness-0"
            />
          </Link>
        </div>

        {/* Desktop primary nav (lg+) */}
        <NavigationMenu className="hidden lg:flex" aria-label="Primary">
          <NavigationMenuList className="gap-1">
            {/* Weekly Classes dropdown — D-03 (3 zones from SG_ZONES) */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-medium text-sm text-gray-600 hover:text-[#0f206c] bg-transparent hover:bg-gray-50 data-[state=open]:bg-gray-50 data-[active]:text-[#0f206c] transition-colors">
                Weekly Classes
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-1 p-3 min-w-[320px] bg-white border border-black/[0.06] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                  {SG_ZONES.map((z) => (
                    <li key={z.slug}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={z.href}
                          className="block px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="font-sans font-semibold text-gray-900 flex items-center gap-2">
                            {z.label}
                            {z.slug === "sports-multiball" && (
                              <Badge className="bg-[#1ab8a0] text-white">
                                Singapore&apos;s only
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{z.ageBand}</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                  <li className="border-t border-black/[0.06] mt-1 pt-1">
                    <NavigationMenuLink asChild>
                      <Link
                        href="/weekly-classes/"
                        className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#1ab8a0] hover:bg-gray-50 transition-colors"
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
              <NavigationMenuTrigger className="font-medium text-sm text-gray-600 hover:text-[#0f206c] bg-transparent hover:bg-gray-50 data-[state=open]:bg-gray-50 data-[active]:text-[#0f206c] transition-colors">
                Prodigy Camps
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-1 p-3 min-w-[320px] bg-white border border-black/[0.06] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                  {SG_CAMP_TYPES.map((c) => (
                    <li key={c.slug}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={c.href}
                          className="block px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="font-sans font-semibold text-gray-900">{c.label}</div>
                          <div className="text-sm text-gray-500">{c.ageBand}</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                  <li className="border-t border-black/[0.06] mt-1 pt-1">
                    <NavigationMenuLink asChild>
                      <Link
                        href="/prodigy-camps/"
                        className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#1ab8a0] hover:bg-gray-50 transition-colors"
                      >
                        See all camps →
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Flat nav items (Katong Point / Coaches / Parties / FAQ) */}
            {FLAT_NAV_LINKS.map(({ href, label }) => (
              <NavigationMenuItem key={href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={href}
                    className="px-3 py-2 font-medium text-sm text-gray-600 hover:text-[#0f206c] transition-colors"
                  >
                    {label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Sticky teal Book a Free Trial CTA — Nexus teal pill */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="/book-a-trial/"
            className="inline-flex items-center gap-2 bg-[#1ab8a0] hover:bg-[#15a08b] text-white rounded-full px-5 py-2 font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1ab8a0] focus-visible:ring-offset-2"
          >
            Book Free Trial <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>

        {/* Mobile (<lg) hamburger + Sheet */}
        <SGNavMobile rootUrl={rootUrl} />
      </ContainerEditorial>
    </header>
  );
}

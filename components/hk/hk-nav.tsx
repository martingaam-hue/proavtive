// Phase 4 / Plan 04-02 — HK primary navigation (RSC).
// Nexus design system redesign: white sticky header, navy logo + coral SPORTS accent,
// coral pill CTA. Preserves all existing routes, dropdown data, and accessibility props.
//
// Pitfall 7 (RESEARCH): All HKNav <Link> hrefs are same-host; cross-subdomain links
// (Prodigy Singapore, ProActiv Sports Group) live in HKFooter via absolute <a href={env}>.
//
// Cookie fix: rootUrl uses NEXT_PUBLIC_ROOT_URL ?? "/?__market=root" — the query bridge
// sets the x-market cookie to "root" (a valid KNOWN_MARKETS value) and rewrites to /root,
// breaking the x-market=hk cookie loop that traps users on the HK tree.
import * as React from "react";
import Image from "next/image";
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

// 6 primary nav items per CONTEXT D-02 (Gymnastics + Locations are dropdown triggers).
const FLAT_NAV_LINKS = [
  { href: "/holiday-camps/", label: "Camps" },
  { href: "/birthday-parties/", label: "Parties" },
  { href: "/coaches/", label: "Coaches" },
  { href: "/faq/", label: "FAQ" },
] as const;

export function HKNav() {
  const rootUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? "/?__market=root";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-black/[0.06]">
      <ContainerEditorial width="wide" className="flex items-center justify-between h-16 lg:h-20">
        {/* Brand lockup — Nexus style: navy PROACTIV + coral SPORTS superscript */}
        <div className="flex items-center gap-3">
          <a
            href={rootUrl}
            className="hidden lg:block font-sans text-[0.6rem] tracking-[0.22em] uppercase text-gray-400 hover:text-[#0f206c] transition-colors duration-200"
            aria-label="ProActiv Sports Group — back to main site"
          >
            ProActiv Group
          </a>
          <span className="hidden lg:block text-gray-300 select-none">·</span>
          <Link
            href="/"
            aria-label="ProActiv Sports Hong Kong — home"
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
            {/* Gymnastics dropdown — D-03 */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-medium text-sm text-gray-600 hover:text-[#0f206c] bg-transparent hover:bg-gray-50 data-[state=open]:bg-gray-50 data-[active]:text-[#0f206c] transition-colors">
                Gymnastics
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-1 p-3 min-w-[320px] bg-white border border-black/[0.06] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                  {HK_GYMNASTICS_PROGRAMMES.map((p) => (
                    <li key={p.slug}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={p.href}
                          className="block px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="font-sans font-semibold text-[#0f206c]">{p.label}</div>
                          <div className="text-sm text-gray-500">{p.ageBand}</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                  <li className="border-t border-black/[0.06] mt-1 pt-1">
                    <NavigationMenuLink asChild>
                      <Link
                        href="/gymnastics/"
                        className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#1ab8a0] hover:bg-gray-50 transition-colors"
                      >
                        See all programmes →
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Locations dropdown — D-04 */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-medium text-sm text-gray-600 hover:text-[#0f206c] bg-transparent hover:bg-gray-50 data-[state=open]:bg-gray-50 data-[active]:text-[#0f206c] transition-colors">
                Locations
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-1 p-3 min-w-[320px] bg-white border border-black/[0.06] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                  {HK_VENUES.map((v) => (
                    <li key={v.id}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/${v.id}/`}
                          className="block px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="font-sans font-semibold text-[#0f206c]">
                            <span className="text-[#e84040]">ProGym</span> {v.nameShort}
                          </div>
                          <div className="text-sm text-gray-500">{v.addressStreet}</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Flat nav items */}
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

        {/* Coral pill CTA — Nexus style */}
        <div className="hidden lg:flex items-center gap-3">
          <Button
            asChild
            size="touch"
            className="bg-[#e84040] hover:bg-[#d23535] text-white rounded-full px-5 py-2 font-semibold text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-[#e84040] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <Link href="/book-a-trial/free-assessment/">Book Free Trial</Link>
          </Button>
        </div>

        {/* Mobile (<lg) hamburger + Sheet */}
        <HKNavMobile rootUrl={rootUrl} />
      </ContainerEditorial>
    </header>
  );
}

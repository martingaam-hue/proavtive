// Phase 3 / Plan 03-01 — RootNav. Sticky header with logo, 5 nav links, dual market CTAs, mobile drawer mount.
//
// RSC by default — only the mobile menu trigger is a client component (root-nav-mobile.tsx).
// Cross-subdomain links use absolute <a href={NEXT_PUBLIC_*_URL}> in <Button asChild> per RESEARCH Pitfall 7.
// Same-host links use Next.js <Link>.
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { RootNavMobile } from "@/components/root/root-nav-mobile";

const NAV_LINKS = [
  { href: "/brand", label: "About" },
  { href: "/coaching-philosophy", label: "Coaching" },
  { href: "/news", label: "News" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
] as const;

export function RootNav() {
  const hkUrl = process.env.NEXT_PUBLIC_HK_URL ?? "/?__market=hk";
  const sgUrl = process.env.NEXT_PUBLIC_SG_URL ?? "/?__market=sg";

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <ContainerEditorial width="wide" className="flex items-center justify-between h-16 lg:h-20">
        <Link href="/" aria-label="ProActiv Sports — home" className="inline-flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.svg" alt="" className="h-8 lg:h-10" />
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-6">
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-small font-medium text-foreground hover:text-brand-red transition-colors min-h-11 inline-flex items-center"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="ghost">
              <a href={hkUrl}>HK →</a>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <a href={sgUrl}>SG →</a>
            </Button>
          </div>
        </nav>

        <RootNavMobile navLinks={NAV_LINKS} hkUrl={hkUrl} sgUrl={sgUrl} />
      </ContainerEditorial>
    </header>
  );
}

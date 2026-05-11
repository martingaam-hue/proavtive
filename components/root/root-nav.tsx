"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

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
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a0a0f]/93 backdrop-blur-md border-b border-white/8"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1440px] px-[5%] flex items-center justify-between h-16 lg:h-[4.5rem]">
        {/* Logo */}
        <Link href="/" aria-label="ProActiv Sports — home" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logo.svg"
            alt="ProActiv Sports"
            className="h-7 lg:h-8 brightness-0 invert"
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-7">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-sans text-[0.82rem] font-medium text-white/60 hover:text-white transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 ml-2">
            <a
              href={hkUrl}
              className="px-5 py-2 font-display font-bold text-[0.68rem] tracking-wide uppercase text-white border border-white/25 hover:border-white/60 hover:bg-white/8 transition-all duration-200"
            >
              Hong Kong
            </a>
            <a
              href={sgUrl}
              className="px-5 py-2 font-display font-bold text-[0.68rem] tracking-wide uppercase text-white bg-brand-red hover:bg-brand-red/85 transition-colors duration-200"
            >
              Singapore
            </a>
          </div>
        </nav>

        {/* Mobile trigger */}
        <button
          className="lg:hidden flex items-center justify-center w-11 h-11 text-white"
          aria-label="Open navigation menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="size-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 right-0 bottom-0 w-full sm:w-80 bg-[#0a0a0f] flex flex-col p-8">
            <button
              className="self-end text-white/50 hover:text-white mb-10 text-[0.75rem] tracking-widest uppercase font-display"
              onClick={() => setMobileOpen(false)}
            >
              Close
            </button>
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="font-display font-bold text-[1.5rem] text-white/80 hover:text-white py-2 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-3">
              <a
                href={hkUrl}
                className="flex items-center justify-center py-4 font-display font-bold text-[0.75rem] tracking-wide uppercase text-white border border-white/25"
              >
                Enter Hong Kong →
              </a>
              <a
                href={sgUrl}
                className="flex items-center justify-center py-4 font-display font-bold text-[0.75rem] tracking-wide uppercase text-white bg-brand-red"
              >
                Enter Singapore →
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// Phase 4 / Plan 04-02 — HK footer (RSC).
// Nexus design system redesign: dark #0f1117 surface, coral eyebrow section headers,
// white-on-dark links, 4-column NAP grid. Preserves all existing routes, env-conditional
// cross-subdomain links, and Simple Icons CC0 social SVGs.
//
// Cross-market links use absolute <a href={env}> per Pitfall 7 carry-forward.

import * as React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { HK_VENUES } from "@/lib/hk-data";

// Simple Icons CC0 — verbatim from components/root/root-footer.tsx.
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const QUICK_LINKS = [
  { href: "/gymnastics/", label: "Gymnastics" },
  { href: "/holiday-camps/", label: "Holiday Camps" },
  { href: "/birthday-parties/", label: "Birthday Parties" },
  { href: "/coaches/", label: "Coaches" },
  { href: "/blog/", label: "Blog" },
  { href: "/faq/", label: "FAQ" },
] as const;

const ABOUT_LINKS = [
  { href: "/about/", label: "About ProActiv" },
  { href: "/coaches/", label: "Our Coaches" },
  { href: "/careers/", label: "Careers" },
  { href: "/blog/", label: "Blog" },
] as const;

export function HKFooter() {
  const whatsappHk = process.env.NEXT_PUBLIC_HK_WHATSAPP;
  const phoneHk = process.env.NEXT_PUBLIC_HK_PHONE;
  const sgUrl = process.env.NEXT_PUBLIC_SG_URL;
  const rootUrl = process.env.NEXT_PUBLIC_ROOT_URL;

  return (
    <footer className="bg-[#0f1117] text-white">
      <ContainerEditorial width="wide" className="py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Col 1 — Brand + about links */}
          <div>
            <Link
              href="/"
              className="inline-flex items-baseline gap-1 group mb-5"
              aria-label="ProActiv Sports Hong Kong — home"
            >
              <span className="font-sans font-extrabold tracking-tight text-xl text-white group-hover:opacity-80 transition-opacity">
                PROACTIV
              </span>
              <span className="font-sans text-[#e84040] text-[0.65rem] font-bold tracking-widest uppercase -translate-y-1.5">
                Sports
              </span>
            </Link>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">
              Premium gymnastics and sports programmes for children in Hong Kong since 2011.
            </p>
            <h3 className="text-[#e84040] uppercase tracking-widest text-xs font-bold mt-8 mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {ABOUT_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2 — Programmes */}
          <div>
            <h3 className="text-[#e84040] uppercase tracking-widest text-xs font-bold mb-4">
              Programmes
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Locations (Venues NAP) */}
          <div>
            <h3 className="text-[#e84040] uppercase tracking-widest text-xs font-bold mb-4">
              Locations
            </h3>
            <ul className="space-y-5">
              {HK_VENUES.map((v) => (
                <li key={v.id}>
                  <div className="font-sans font-semibold text-white text-sm">
                    <span className="text-[#e84040]">ProGym</span> {v.nameShort}
                  </div>
                  <p className="text-sm text-white/60 flex items-start gap-1.5 mt-1.5 leading-relaxed">
                    <MapPin className="size-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>
                      {v.addressStreet}, {v.addressLocality}
                    </span>
                  </p>
                  {phoneHk && (
                    <a
                      href={`tel:${phoneHk.replace(/[^0-9+]/g, "")}`}
                      className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1.5 mt-1.5"
                    >
                      <Phone className="size-3.5" aria-hidden="true" />
                      {phoneHk}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact / Connect */}
          <div>
            <h3 className="text-[#e84040] uppercase tracking-widest text-xs font-bold mb-4">
              Contact
            </h3>
            <div className="space-y-3">
              {whatsappHk && (
                <a
                  href={`https://wa.me/${whatsappHk.replace(/[^0-9+]/g, "")}?text=${encodeURIComponent("Hi ProActiv HK, I'd like to book a free trial.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#1ab8a0] hover:text-[#22d4b8] transition-colors"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Chat on WhatsApp
                </a>
              )}
              <a
                href="mailto:hk@proactivsports.com"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <Mail className="size-4" aria-hidden="true" />
                hk@proactivsports.com
              </a>
              {sgUrl && (
                <a
                  href={sgUrl}
                  className="block text-sm text-white/60 hover:text-white transition-colors"
                >
                  Prodigy Singapore ↗
                </a>
              )}
              {rootUrl && (
                <a
                  href={rootUrl}
                  className="block text-sm text-white/60 hover:text-white transition-colors"
                >
                  ProActiv Sports Group ↗
                </a>
              )}
            </div>

            {/* Social icons */}
            <div className="mt-8 flex items-center gap-3">
              <a
                href="https://www.facebook.com/proactivsportshk/"
                aria-label="Follow ProActiv Sports HK on Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white min-h-10 min-w-10 inline-flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
              >
                <FacebookIcon className="size-5" />
              </a>
              <a
                href="https://www.instagram.com/proactivsports/"
                aria-label="Follow ProActiv Sports HK on Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white min-h-10 min-w-10 inline-flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
              >
                <InstagramIcon className="size-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/proactiv-sports/"
                aria-label="Follow ProActiv Sports HK on LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white min-h-10 min-w-10 inline-flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
              >
                <LinkedinIcon className="size-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-sm text-white/40">
          <p>© {new Date().getFullYear()} ProActiv Sports — Hong Kong</p>
          <div className="flex gap-6">
            <a href={(rootUrl ?? "") + "/privacy/"} className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href={(rootUrl ?? "") + "/terms/"} className="hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>
      </ContainerEditorial>
    </footer>
  );
}

// Phase 5 / Plan 05-02 — SG footer (RSC). Per UI-SPEC §5.2 + CONTEXT D-06 + D-08.
//
// 4 columns desktop:
//   (1) Brand + tagline ("Prodigy" in Baloo accent, Katong Point + MultiBall tagline)
//   (2) Single Katong Point venue NAP (SINGLE block — D-08, NOT 2-venue map pattern)
//   (3) Quick links (Weekly Classes / Prodigy Camps / Parties / Coaches / Blog / FAQ)
//   (4) Connect (WhatsApp conditional, email, ProGym HK ↗, ProActiv Sports Group ↗)
//
// Cross-market links use absolute <a href={env}> per Pitfall 7 carry-forward
// (SG→HK and SG→Root are always cross-subdomain).
// Phase 2 D-01 cream → pure white amendment: footer keeps brand-navy surface + white text.
// Simple Icons CC0 social SVGs verbatim from components/hk/hk-footer.tsx (Facebook/Instagram/LinkedIn).

import * as React from "react";
import Link from "next/link";
import { MapPin, Mail, MessageCircle } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Separator } from "@/components/ui/separator";
import { KATONG_POINT_NAP } from "@/lib/sg-data";

// Simple Icons CC0 — verbatim from components/hk/hk-footer.tsx (lines 26-63).
// Keeping inline (not lucide) because lucide-react@1.8.0 does not export branded social icons.
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const QUICK_LINKS = [
  { href: "/weekly-classes/", label: "Weekly Classes" },
  { href: "/prodigy-camps/", label: "Prodigy Camps" },
  { href: "/birthday-parties/", label: "Parties" },
  { href: "/school-partnerships/", label: "Schools" },
  { href: "/coaches/", label: "Coaches" },
  { href: "/blog/", label: "Blog" },
  { href: "/faq/", label: "FAQ" },
] as const;

export function SGFooter() {
  const whatsappSg = process.env.NEXT_PUBLIC_WHATSAPP_SG;
  const phoneSg = process.env.NEXT_PUBLIC_SG_PHONE;
  const hkUrl = process.env.NEXT_PUBLIC_HK_URL;
  const rootUrl = process.env.NEXT_PUBLIC_ROOT_URL;

  return (
    <footer className="bg-brand-navy text-white">
      <Section size="md" bg="navy">
        <ContainerEditorial width="wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Col 1 — Brand + tagline */}
            <div>
              <Link
                href="/"
                className="font-display font-bold text-xl text-white"
              >
                <span className="font-accent text-brand-yellow">Prodigy</span>{" "}
                by ProActiv Sports
              </Link>
              <p className="mt-3 text-sm text-white/80">
                Kids&apos; sports classes, holiday camps &amp; birthday parties
                at Katong Point — home of Singapore&apos;s only MultiBall wall.
              </p>
            </div>

            {/* Col 2 — Single Katong Point NAP (D-08 — single venue, not 2-venue map) */}
            <div>
              <h3 className="font-display text-lg text-white mb-4">Venue</h3>
              <div>
                <div className="font-sans font-semibold text-white">
                  <span className="font-accent">Prodigy</span> @ Katong Point
                </div>
                <p className="text-sm text-white/80 flex items-start gap-1 mt-1">
                  <MapPin
                    className="size-3.5 mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span>
                    {KATONG_POINT_NAP.addressStreet}, Singapore{" "}
                    {KATONG_POINT_NAP.postalCode}
                  </span>
                </p>
                {phoneSg && (
                  <p className="text-sm text-white/80 mt-1">{phoneSg}</p>
                )}
                {whatsappSg && (
                  <a
                    href={`https://wa.me/${whatsappSg.replace(/\D/g, "")}`}
                    className="text-sm text-white/80 hover:text-white flex items-center gap-1 mt-1"
                  >
                    <MessageCircle
                      className="size-3.5 text-brand-green"
                      aria-hidden="true"
                    />
                    <span>WhatsApp Prodigy</span>
                  </a>
                )}
              </div>
            </div>

            {/* Col 3 — Quick links */}
            <div>
              <h3 className="font-display text-lg text-white mb-4">
                Quick links
              </h3>
              <ul className="space-y-2">
                {QUICK_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/80 hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 — Connect (WhatsApp + email + cross-market) */}
            <div>
              <h3 className="font-display text-lg text-white mb-4">Connect</h3>
              <div className="space-y-3">
                {whatsappSg && (
                  <a
                    href={`https://wa.me/${whatsappSg.replace(/\D/g, "")}?text=${encodeURIComponent("Hi Prodigy SG, I'd like to book a free trial.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-brand-green hover:opacity-90"
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    Chat on WhatsApp
                  </a>
                )}
                <a
                  href="mailto:sg@proactivsports.com"
                  className="flex items-center gap-2 text-sm text-white/80 hover:text-white"
                >
                  <Mail className="size-4" aria-hidden="true" />{" "}
                  sg@proactivsports.com
                </a>
                {hkUrl && (
                  <a
                    href={hkUrl}
                    className="block text-sm text-white/80 hover:text-white"
                  >
                    ProGym Hong Kong ↗
                  </a>
                )}
                {rootUrl && (
                  <a
                    href={rootUrl}
                    className="block text-sm text-white/80 hover:text-white"
                  >
                    ProActiv Sports Group ↗
                  </a>
                )}
              </div>

              {/* Social icons */}
              <div className="mt-6 flex items-center gap-4">
                <a
                  href="https://www.facebook.com/proactivsportssg/"
                  aria-label="Follow Prodigy by ProActiv Sports Singapore on Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white min-h-11 min-w-11 inline-flex items-center justify-center"
                >
                  <FacebookIcon className="size-5" />
                </a>
                <a
                  href="https://www.instagram.com/proactivsports/"
                  aria-label="Follow Prodigy by ProActiv Sports Singapore on Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white min-h-11 min-w-11 inline-flex items-center justify-center"
                >
                  <InstagramIcon className="size-5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/proactiv-sports/"
                  aria-label="Follow Prodigy by ProActiv Sports Singapore on LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white min-h-11 min-w-11 inline-flex items-center justify-center"
                >
                  <LinkedinIcon className="size-5" />
                </a>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-white/20" />
          <div className="flex flex-col md:flex-row justify-between gap-3 text-sm text-white/60">
            <p>© {new Date().getFullYear()} ProActiv Sports Singapore</p>
            <div className="flex gap-4">
              <a
                href={(rootUrl ?? "") + "/privacy/"}
                className="hover:text-white"
              >
                Privacy
              </a>
              <a
                href={(rootUrl ?? "") + "/terms/"}
                className="hover:text-white"
              >
                Terms
              </a>
            </div>
          </div>
        </ContainerEditorial>
      </Section>
    </footer>
  );
}

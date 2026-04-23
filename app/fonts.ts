// Phase 2 / Plan 02-02 — brand typography via next/font/google (DS-02).
// Replaces Phase 1's Geist + Geist_Mono imports. Per UI-SPEC §1.7 (amended 2026-04-23):
//   - display: 'swap' — non-negotiable (FOUT over FOIT)
//   - subsets: ['latin'] — site ships English-only at v1.0 (PROJECT.md Out of Scope)
//   - weight: [...] — explicit per-family list
//   - variable names bind through app/globals.css @theme { --font-display, --font-sans, --font-accent }
//     to the Tailwind utilities font-display / font-sans / font-accent.
// D-01 (amended): OFL Google Fonts — Unbounded + Manrope + Baloo 2.
// D-03: Baloo declared here but NOT attached to root <html> — Phase 4 HK ProGym
//       layouts attach it per ProGym scoping.

import { Unbounded, Manrope, Baloo_2 } from "next/font/google";

export const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-unbounded",
  display: "swap",
});

export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-baloo",
  display: "swap",
});

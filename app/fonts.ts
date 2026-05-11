import { Space_Grotesk, Baloo_2 } from "next/font/google";

// Single geometric font for the whole site — clean, punchy at all weights.
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

// HK ProGym accent — attached only in app/hk/layout.tsx
export const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-baloo",
  display: "swap",
});

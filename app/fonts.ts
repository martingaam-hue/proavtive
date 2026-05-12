import { Plus_Jakarta_Sans, Baloo_2 } from "next/font/google";

export const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

// HK/SG brand wordmark accent — attached only in market layouts
export const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-baloo",
  display: "swap",
});

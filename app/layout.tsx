import type { Metadata } from "next";
import { unbounded, manrope } from "./fonts";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'
import { SanityLive } from '@/lib/sanity.live'

export const metadata: Metadata = {
  title: {
    default: "ProActiv Sports",
    template: "%s",
  },
  description: "ProActiv Sports — children's gymnastics & sports (Hong Kong + Singapore).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  return (
    <html lang="en" className={`${unbounded.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <SanityLive />
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}

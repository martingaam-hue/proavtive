import type { Metadata } from "next";
import { unbounded, manrope } from "./fonts";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SanityLive } from "@/lib/sanity.live";
import { draftMode } from "next/headers";
import VisualEditing from "next-sanity/visual-editing";

export const metadata: Metadata = {
  title: {
    default: "ProActiv Sports",
    template: "%s",
  },
  description: "ProActiv Sports — children's gymnastics & sports (Hong Kong + Singapore).",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const { isEnabled: isDraftMode } = await draftMode();
  return (
    <html lang="en" className={`${unbounded.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <SanityLive />
        {isDraftMode && <VisualEditing />}
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}

import type { Metadata } from "next";
import { unbounded, manrope } from "./fonts";
import "./globals.css";

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
  return (
    <html lang="en" className={`${unbounded.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

// Phase 2 / Plan 02-04 — Width-constrained content wrapper per UI-SPEC §3.13.
// Does NOT force centered content — consumer composes asymmetric grids inside.
// Strategy §14.6: max content width 1280-1440px on desktop; `wide` uses Tailwind max-w-7xl (1280px).

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContainerEditorialProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: "narrow" | "default" | "wide";
  children: React.ReactNode;
}

const widthMap = {
  narrow: "max-w-2xl", // 672px — blog post reading column
  default: "max-w-6xl", // 1152px — standard page content
  wide: "max-w-7xl", // 1280px — hero / full-bleed sections
} as const;

export function ContainerEditorial({
  width = "default",
  className,
  children,
  ...props
}: ContainerEditorialProps) {
  return (
    <div
      data-slot="container-editorial"
      data-width={width}
      className={cn("mx-auto px-4 md:px-8", widthMap[width], className)}
      {...props}
    >
      {children}
    </div>
  );
}

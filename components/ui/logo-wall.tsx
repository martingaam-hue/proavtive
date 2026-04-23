// Phase 2 / Plan 02-04 — Monochrome logo grid/row per UI-SPEC §3.11.
// Used by: root "Trusted by" row, HK / SG /school-partnerships/.
// grid variant: 2 cols mobile / 4 cols desktop; row variant: horizontal flex.

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface LogoWallLogo {
  src: string;
  alt: string;
  href?: string;
  width: number;
  height: number;
}

export interface LogoWallProps extends React.HTMLAttributes<HTMLDivElement> {
  logos: ReadonlyArray<LogoWallLogo>;
  title?: string;
  variant?: "grid" | "row";
}

export function LogoWall({ logos, title, variant = "grid", className, ...props }: LogoWallProps) {
  return (
    <div
      data-slot="logo-wall"
      data-variant={variant}
      className={cn("w-full", className)}
      {...props}
    >
      {title ? (
        <p className="mb-6 font-sans text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
      ) : null}
      <ul
        className={cn(
          "list-none",
          variant === "grid"
            ? "grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8"
            : "flex gap-6 overflow-x-auto lg:gap-8",
        )}
      >
        {logos.map((logo, idx) => {
          const img = (
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="h-10 w-auto object-contain grayscale opacity-60 transition-all duration-200 group-hover:grayscale-0 group-hover:opacity-100 lg:h-12"
            />
          );
          return (
            <li
              key={`${logo.alt}-${idx}`}
              className={cn("flex items-center justify-center", variant === "row" && "shrink-0")}
            >
              {logo.href ? (
                <Link
                  href={logo.href}
                  className="group block focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring rounded-md"
                >
                  {img}
                </Link>
              ) : (
                <span className="group block">{img}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

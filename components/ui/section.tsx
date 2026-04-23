// Phase 2 / Plan 02-04 — Semantic layout wrapper per UI-SPEC §3.12.
// Token-only (no raw hex). Consumer composes asymmetric children inside.

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "article" | "div";
  size?: "sm" | "md" | "lg";
  bg?: "default" | "muted" | "navy" | "cream";
  children: React.ReactNode;
}

const sizeMap = {
  sm: "py-section-sm",
  md: "py-section-md",
  lg: "py-section-lg",
} as const;

const bgMap = {
  default: "bg-background",
  muted: "bg-muted",
  navy: "bg-brand-navy text-white",
  cream: "bg-brand-cream",
} as const;

export function Section({
  as: Tag = "section",
  size = "md",
  bg = "default",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      data-slot="section"
      data-size={size}
      data-bg={bg}
      className={cn(sizeMap[size], bgMap[bg], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

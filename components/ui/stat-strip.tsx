// Phase 2 / Plan 02-04 — Horizontal KPI strip per UI-SPEC §3.10.
// Used by: root homepage trust-row, HK / SG trust strips, /brand/ history.
// Static (no count-up animation — deferred to Phase 3+ per CONTEXT.md).

import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statStripVariants = cva("flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-0", {
  variants: {
    variant: {
      default: "text-primary",
      "on-dark": "text-white",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface StatStripProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof statStripVariants> {
  stats: ReadonlyArray<{
    value: string;
    label: string;
    suffix?: string;
  }>;
}

export function StatStrip({ stats, variant = "default", className, ...props }: StatStripProps) {
  const isOnDark = variant === "on-dark";
  return (
    <div
      data-slot="stat-strip"
      data-variant={variant}
      className={cn(statStripVariants({ variant }), "py-section-sm lg:py-section-md", className)}
      {...props}
    >
      {stats.map((stat, idx) => (
        <React.Fragment key={`${stat.label}-${idx}`}>
          <div className="flex flex-1 flex-col items-start lg:items-center lg:text-center">
            <p className="font-display text-5xl font-bold leading-[1.05] tracking-tight lg:text-[5.5rem]">
              {stat.value}
              {stat.suffix ? <span aria-hidden="true">{stat.suffix}</span> : null}
            </p>
            <p
              className={cn(
                "mt-2 font-sans text-sm font-medium uppercase tracking-wide",
                isOnDark ? "text-brand-cream" : "text-muted-foreground",
              )}
            >
              {stat.label}
            </p>
          </div>
          {idx < stats.length - 1 ? (
            <Separator
              orientation="vertical"
              className="hidden h-16 self-center lg:block"
              decorative
            />
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
}

// Phase 2 / Plan 02-04 — Dual-market entry card per UI-SPEC §3.7.
// Root gateway (Phase 3) uses two instances side-by-side (HK + SG).
// Full-bleed photo fills 4:3 aspect; navy-to-transparent gradient; label + tagline
// bottom-left; ArrowRight icon translates on hover. Single <Link> wraps entire
// card — no nested <a> tags (a11y per UI-SPEC §3.7).

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MarketCardProps extends Omit<React.ComponentProps<typeof Link>, "href"> {
  market: "hk" | "sg";
  label: string;
  tagline: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  priority?: boolean;
  className?: string;
}

export function MarketCard({
  market,
  label,
  tagline,
  href,
  imageSrc,
  imageAlt,
  priority = false,
  className,
  ...props
}: MarketCardProps) {
  return (
    <Link
      href={href}
      data-slot="market-card"
      data-market={market}
      aria-label={`${label} — ${tagline}`}
      className={cn(
        "group relative block overflow-hidden rounded-xl border border-white/20",
        "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring",
        "transition-transform active:translate-y-px",
        className,
      )}
      {...props}
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority}
          fetchPriority={priority ? "high" : "auto"}
          className="object-cover transition-transform duration-[400ms] group-hover:scale-105"
        />
        {/* Navy-to-transparent gradient overlay — provides contrast for bottom text */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <p className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white lg:text-[5.5rem]">
            {label}
          </p>
          <p className="mt-2 font-sans text-base leading-relaxed text-brand-cream">{tagline}</p>
        </div>
        <ArrowRight
          aria-hidden="true"
          className="absolute bottom-8 right-8 size-6 text-white transition-transform duration-200 group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}

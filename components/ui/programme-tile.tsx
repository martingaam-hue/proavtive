// Phase 2 / Plan 02-04 — Programme listing card per UI-SPEC §3.8.
// Nexus ProgrammeCard style: white card, teal category pill, navy title, teal CTA.
// HK /gymnastics/ pillar + 8 sub-pages; SG /weekly-classes/; holiday camps.

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProgrammeTileProps {
  title: string;
  ageRange: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
  duration?: string;
  className?: string;
}

export function ProgrammeTile({
  title,
  ageRange,
  description,
  imageSrc,
  imageAlt,
  href,
  duration,
  className,
}: ProgrammeTileProps) {
  return (
    <Link
      href={href}
      data-slot="programme-tile"
      aria-label={`${title} · ${ageRange}`}
      className={cn(
        "group block bg-white rounded-2xl overflow-hidden",
        "shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.14)]",
        "hover:-translate-y-1 transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring",
        className,
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[400ms] group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category pill */}
        <span className="inline-block bg-[rgba(26,184,160,0.12)] text-[#1ab8a0] text-xs font-bold uppercase tracking-wider rounded-full px-3 py-1 mb-3">
          {ageRange}
        </span>

        {/* Title */}
        <h3 className="text-lg font-bold text-[#0f206c] mb-2 leading-snug">{title}</h3>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{description}</p>

        {/* Duration (optional) */}
        {duration ? (
          <p className="inline-flex items-center gap-1.5 text-gray-500 text-xs mb-3">
            <Clock aria-hidden="true" className="size-3.5" />
            <span>{duration}</span>
          </p>
        ) : null}

        {/* CTA */}
        <span className="text-[#1ab8a0] font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
          Learn more
          <ArrowRight aria-hidden="true" className="size-4" />
        </span>
      </div>
    </Link>
  );
}

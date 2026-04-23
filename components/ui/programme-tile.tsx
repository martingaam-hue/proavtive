// Phase 2 / Plan 02-04 — Programme listing card per UI-SPEC §3.8.
// HK /gymnastics/ pillar + 8 sub-pages; SG /weekly-classes/; holiday camps.
// 4:3 photo on top; Badge variant="secondary" (yellow + navy — 8.80:1 contrast) for age band.

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
        "group block rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring",
        "transition-transform active:translate-y-px",
        className,
      )}
    >
      <Card className="overflow-hidden transition-shadow group-hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[400ms] group-hover:scale-105"
          />
        </div>
        <CardHeader className="pb-2">
          <Badge variant="secondary" className="w-fit">
            {ageRange}
          </Badge>
          <h3 className="font-display text-xl font-semibold leading-snug text-primary transition-colors group-hover:text-brand-red lg:text-2xl">
            {title}
          </h3>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-2 font-sans text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
          {duration ? (
            <p className="mt-3 inline-flex items-center gap-1.5 font-sans text-sm text-muted-foreground">
              <Clock aria-hidden="true" className="size-3.5" />
              <span>{duration}</span>
            </p>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}

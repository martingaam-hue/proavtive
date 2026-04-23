// Phase 3 / Plan 03-02 — LeadershipCard. Phase 3-local composition (D-11) — NOT a DS-level primitive.
//
// Composes Phase 2 stock Card + Badge with next/image. Used by:
//   - Gateway homepage §3.6 (3 leaders: Will / Monica / Haikel)
//   - /brand/ §4 leadership block (3 leaders, via LeadershipSection)
//   - /coaching-philosophy/ §4 (Monica + Haikel only — direct LeadershipCard render)

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface LeadershipCardProps {
  name: string;
  role: string;
  bioLine: string;
  portrait: string; // path under public/, e.g. "/photography/leadership-will.webp"
  portraitAlt: string;
  className?: string;
}

export function LeadershipCard({
  name,
  role,
  bioLine,
  portrait,
  portraitAlt,
  className,
}: LeadershipCardProps) {
  return (
    <Card
      className={cn("overflow-hidden p-0 transition-shadow duration-200 hover:shadow-md", className)}
      data-slot="leadership-card"
    >
      <div className="relative aspect-[3/4]">
        <Image
          src={portrait}
          alt={portraitAlt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-6 lg:p-8">
        <Badge variant="secondary" className="mb-3">
          {role}
        </Badge>
        <h3 className="text-h3 font-display text-foreground">{name}</h3>
        <p className="text-body text-muted-foreground mt-3 leading-relaxed">{bioLine}</p>
      </div>
    </Card>
  );
}

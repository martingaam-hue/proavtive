// Phase 3 / Plan 03-02 — LeadershipSection. Reusable wrapper for the leadership grid.
//
// Used by gateway §3.6 (3 leaders) and /brand/ §4 (3 leaders).
// /coaching-philosophy/ §4 uses LeadershipCard directly (only 2 leaders, custom layout).

import * as React from "react";
import { LeadershipCard, type LeadershipCardProps } from "@/components/root/leadership-card";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";

export interface LeadershipSectionProps {
  heading: string;
  leaders: ReadonlyArray<LeadershipCardProps>;
  className?: string;
}

export function LeadershipSection({
  heading,
  leaders,
  className,
}: LeadershipSectionProps) {
  return (
    <Section size="md" className={className}>
      <ContainerEditorial width="wide">
        <h2 className="text-h2 font-display text-foreground">{heading}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 lg:gap-6">
          {leaders.map((leader) => (
            <LeadershipCard key={leader.name} {...leader} />
          ))}
        </div>
      </ContainerEditorial>
    </Section>
  );
}

"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy, Activity, Backpack, Cake, Medal, type LucideIcon } from "lucide-react";

const PROGRAMMES = [
  {
    index: "01",
    icon: Trophy,
    title: "Gymnastics",
    description:
      "From toddler classes to the competitive pathway, with structured progression at every level.",
    markets: "HK: ProGym Wan Chai & Cyberport · SG: Prodigy",
  },
  {
    index: "02",
    icon: Activity,
    title: "Sports Classes",
    description: "Football, basketball, rugby, tennis, dodgeball, martial arts, parkour.",
    markets: "Core programme in SG · Multi-activity options in HK camps",
  },
  {
    index: "03",
    icon: Backpack,
    title: "Holiday Camps",
    description:
      "Action-packed school holiday weeks, year-round. Themed options, half-day and full-day.",
    markets: "HK & SG",
  },
  {
    index: "04",
    icon: Cake,
    title: "Birthday Parties",
    description: "Two hours of hosted, coach-led fun. You bring the cake; we do the rest.",
    markets: "HK & SG",
  },
  {
    index: "05",
    icon: Medal,
    title: "Competitions & Events",
    description: "Competitive squads, inter-school events, community sports days.",
    markets: "HK & SG",
  },
] as const;

interface ProgrammeItemProps {
  index: string;
  icon: LucideIcon;
  title: string;
  description: string;
  markets: string;
  delay: number;
}

function ProgrammeItem({
  index,
  icon: Icon,
  title,
  description,
  markets,
  delay,
}: ProgrammeItemProps) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-4%" });

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ delay, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-[3rem_1fr] lg:grid-cols-[5rem_1fr] gap-5 lg:gap-10 py-8 lg:py-11 border-b border-foreground/10 last:border-b-0"
    >
      <div className="pt-[2px]">
        <span className="font-display font-bold text-[1.5rem] lg:text-[2.25rem] text-brand-navy/15 leading-none tabular-nums select-none">
          {index}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Icon aria-hidden="true" className="size-[1.1rem] text-brand-navy shrink-0" />
            <h3 className="font-display font-bold text-foreground text-[1.1rem] lg:text-[1.3rem] leading-snug">
              {title}
            </h3>
          </div>
          <p className="font-sans text-[0.9rem] text-muted-foreground leading-relaxed max-w-[54ch]">
            {description}
          </p>
          <p className="mt-3 font-sans text-[0.7rem] text-brand-navy/45 tracking-[0.12em] uppercase">
            {markets}
          </p>
        </div>
      </div>
    </motion.li>
  );
}

export function ProgrammeListSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-8%" });

  return (
    <section>
      <div className="px-[5vw] lg:px-[6vw] py-20 lg:py-28">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 lg:mb-16"
        >
          <h2 className="font-display font-extrabold text-foreground leading-tight tracking-tight text-[clamp(1.75rem,3.5vw,3rem)] max-w-[28ch]">
            Built for every stage of a child&apos;s movement journey.
          </h2>
        </motion.div>

        <ul className="list-none m-0 p-0">
          {PROGRAMMES.map((prog, i) => (
            <ProgrammeItem key={prog.title} {...prog} delay={i * 0.07} />
          ))}
        </ul>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const CARDS = [
  {
    title: "Gymnastics",
    description:
      "From toddler classes to the competitive pathway, with structured progression at every level.",
    markets: "HK: ProGym Wan Chai & Cyberport · SG: Prodigy",
    photo: "/photography/nexus-gymnastics.jpg",
    photoAlt: "Children in gymnastics class at ProActiv Sports",
  },
  {
    title: "Sports Classes",
    description: "Football, basketball, rugby, tennis, dodgeball, martial arts, parkour.",
    markets: "Core programme in SG · Multi-activity options in HK camps",
    photo: "/photography/nexus-sports-classes.jpg",
    photoAlt: "Children enjoying sports classes at ProActiv Sports",
  },
  {
    title: "Holiday Camps",
    description:
      "Action-packed school holiday weeks, year-round. Themed options, half-day and full-day.",
    markets: "HK & SG",
    photo: "/photography/nexus-holiday-camps.jpg",
    photoAlt: "Children at a ProActiv Sports holiday camp",
  },
  {
    title: "Birthday Parties",
    description: "Two hours of hosted, coach-led fun. You bring the cake; we do the rest.",
    markets: "HK & SG",
    photo: "/photography/nexus-birthday-parties.jpg",
    photoAlt: "Birthday party at ProActiv Sports",
  },
] as const;

function ProgrammeCard({
  title,
  description,
  markets,
  photo,
  photoAlt,
  delay,
}: (typeof CARDS)[number] & { delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-4%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ delay, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col rounded-xl overflow-hidden bg-white"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={photo}
          alt={photoAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col flex-1 p-6 lg:p-7">
        <h3 className="font-display font-black text-brand-navy text-[1.1rem] lg:text-[1.2rem] leading-tight mb-2">
          {title}
        </h3>
        <p className="font-sans text-[0.9rem] text-brand-navy/65 leading-relaxed flex-1">
          {description}
        </p>
        <p className="mt-3 font-sans text-[0.65rem] text-brand-navy/40 tracking-[0.12em] uppercase">
          {markets}
        </p>
        <span className="mt-4 font-display font-bold text-[0.75rem] tracking-[0.1em] uppercase text-brand-red">
          Learn more →
        </span>
      </div>
    </motion.div>
  );
}

export function ProgrammeListSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-8%" });

  return (
    <section className="bg-brand-cream">
      <div className="px-[5vw] lg:px-[6vw] py-20 lg:py-28">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 lg:mb-16"
        >
          <p className="font-sans text-[0.65rem] tracking-[0.32em] uppercase text-brand-red font-semibold mb-4">
            Our Programmes
          </p>
          <h2 className="font-display font-black text-brand-navy leading-tight tracking-tight text-[clamp(1.75rem,3.5vw,3rem)] max-w-[28ch]">
            Built for every stage of a child&apos;s movement journey.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CARDS.map((card, i) => (
            <ProgrammeCard key={card.title} {...card} delay={i * 0.07} />
          ))}
        </div>
      </div>
    </section>
  );
}

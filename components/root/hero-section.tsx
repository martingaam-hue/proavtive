"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface HeroSectionProps {
  hkUrl: string;
  sgUrl: string;
}

const WORDS = ["Move.", "Grow.", "Thrive."];

const wordReveal = {
  hidden: { y: "110%", opacity: 0 },
  visible: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: { delay: i * 0.13, duration: 0.75, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function HeroSection({ hkUrl, sgUrl }: HeroSectionProps) {
  return (
    <section className="relative min-h-svh overflow-hidden flex flex-col">
      {/* Full-bleed background */}
      <div className="absolute inset-0">
        <Image
          src="/photography/root-gateway-hero.webp"
          alt="Children mid-movement at ProActiv Sports — gymnastics class in Hong Kong"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/92 via-brand-navy/72 to-brand-navy/30" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-brand-navy/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-svh px-[5vw] lg:px-[6vw] py-10 lg:py-14">
        {/* Overline */}
        <motion.p
          className="font-sans text-[0.68rem] tracking-[0.3em] uppercase text-brand-cream/50 self-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Hong Kong · Singapore · Est. 2011
        </motion.p>

        {/* Headline + sub + CTAs */}
        <div className="flex-1 flex flex-col justify-center py-12 lg:py-0 max-w-[90vw] lg:max-w-[62vw]">
          <div aria-label="Move. Grow. Thrive.">
            {WORDS.map((word, i) => (
              <div key={word} className="overflow-hidden">
                <motion.span
                  custom={i}
                  variants={wordReveal}
                  initial="hidden"
                  animate="visible"
                  className={`block font-display font-black leading-[0.87] tracking-tight text-[clamp(4rem,9.5vw,10rem)]${word === "Thrive." ? " text-gradient-brand" : " text-brand-cream"}`}
                >
                  {word}
                </motion.span>
              </div>
            ))}
            <div className="overflow-hidden mt-3">
              <motion.span
                custom={3}
                variants={wordReveal}
                initial="hidden"
                animate="visible"
                className="block font-display font-bold leading-tight text-brand-cream/50 text-[clamp(1.2rem,3vw,3rem)] tracking-tight"
              >
                In Hong Kong and Singapore.
              </motion.span>
            </div>
          </div>

          <motion.p
            className="font-sans text-[clamp(0.95rem,1.2vw,1.1rem)] text-brand-cream/65 mt-8 max-w-[44ch] leading-[1.75]"
            custom={1.3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            ProActiv Sports has been shaping how children move since 2011. Dedicated gymnastics and
            sports programmes built around your child&apos;s confidence, coordination, and joy —
            across three venues in two cities.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 mt-10"
            custom={1.6}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <a
              href={hkUrl}
              className="inline-flex items-center justify-center px-8 py-[1.1rem] font-display font-bold text-[0.78rem] tracking-[0.14em] uppercase text-white bg-brand-red hover:bg-brand-red/85 transition-colors duration-300"
            >
              Enter Hong Kong →
            </a>
            <a
              href={sgUrl}
              className="inline-flex items-center justify-center px-8 py-[1.1rem] font-display font-bold text-[0.78rem] tracking-[0.14em] uppercase text-white bg-brand-navy hover:bg-brand-navy/85 transition-colors duration-300"
            >
              Enter Singapore →
            </a>
          </motion.div>

          <motion.p
            className="mt-7 font-sans text-[0.7rem] text-brand-cream/30 tracking-wide"
            custom={1.9}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Since 2011 · Three dedicated venues · Trusted by leading international schools across
            Asia
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="self-end flex flex-col items-center gap-2 pb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.3, duration: 1 }}
          aria-hidden="true"
        >
          <span className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-brand-cream/25 [writing-mode:vertical-rl]">
            Scroll
          </span>
          <div className="relative h-14 w-px bg-brand-cream/15 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-brand-cream/50 animate-scroll-line" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

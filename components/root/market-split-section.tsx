"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface MarketSplitSectionProps {
  hkUrl: string;
  sgUrl: string;
}

const contentReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.75, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

interface PanelProps {
  market: "hk" | "sg";
  label: string;
  tagline: string;
  detail: string;
  cta: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
}

function MarketPanel({
  market,
  label,
  tagline,
  detail,
  cta,
  href,
  imageSrc,
  imageAlt,
}: PanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <div ref={ref} className="relative overflow-hidden min-h-[75vh] lg:min-h-[90vh] group">
      <motion.div
        initial={{ scale: 1.06, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 1.06, opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
      </motion.div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/95 via-brand-navy/45 to-brand-navy/10" />

      {/* Top edge accent */}
      {market === "sg" && (
        <div className="absolute top-0 inset-x-0 h-[1px] bg-brand-cream/10 hidden lg:block" />
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end px-8 pb-14 lg:px-14 lg:pb-20">
        <motion.p
          className="font-sans text-[0.6rem] tracking-[0.38em] uppercase text-brand-cream/45 mb-4"
          custom={0.15}
          variants={contentReveal}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {market === "hk" ? "Hong Kong" : "Singapore"}
        </motion.p>

        <motion.h2
          className="font-display font-extrabold text-brand-cream leading-none tracking-tight text-[clamp(2.5rem,5.5vw,5rem)]"
          custom={0.25}
          variants={contentReveal}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {label}
        </motion.h2>

        <motion.p
          className="mt-4 font-sans text-[clamp(0.88rem,1.1vw,1rem)] text-brand-cream/65 max-w-[40ch] leading-relaxed"
          custom={0.38}
          variants={contentReveal}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {tagline}
        </motion.p>

        <motion.p
          className="mt-2 font-sans text-[0.72rem] text-brand-cream/38 tracking-wide"
          custom={0.48}
          variants={contentReveal}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {detail}
        </motion.p>

        <motion.a
          href={href}
          className="mt-8 self-start inline-flex items-center gap-2 font-display font-bold text-[0.71rem] tracking-[0.17em] uppercase text-brand-navy bg-brand-cream px-7 py-[0.95rem] hover:bg-white transition-colors duration-300"
          custom={0.58}
          variants={contentReveal}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {cta}
        </motion.a>
      </div>
    </div>
  );
}

export function MarketSplitSection({ hkUrl, sgUrl }: MarketSplitSectionProps) {
  return (
    <section aria-label="Our markets">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <MarketPanel
          market="hk"
          label="ProGym Hong Kong"
          tagline="Gymnastics-led. Two dedicated venues — ProGym Wan Chai & ProGym Cyberport."
          detail="Wan Chai · Cyberport · Ages 2–16"
          cta="Enter Hong Kong →"
          href={hkUrl}
          imageSrc="/photography/hk-progym-wan-chai.webp"
          imageAlt="A coach guiding a child through a beam routine at ProGym Wan Chai"
        />
        <MarketPanel
          market="sg"
          label="Prodigy Singapore"
          tagline="Multi-sport. Singapore's only MultiBall interactive wall — Movement, Sports, Climbing zones."
          detail="Katong Point · Ages 12 months–16"
          cta="Enter Singapore →"
          href={sgUrl}
          imageSrc="/photography/sg-prodigy-katong.webp"
          imageAlt="Children climbing the MultiBall wall at Prodigy @ Katong Point, Singapore"
        />
      </div>
    </section>
  );
}

"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface FinalCTASectionProps {
  hkUrl: string;
  sgUrl: string;
}

export function FinalCTASection({ hkUrl, sgUrl }: FinalCTASectionProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });

  return (
    <section ref={ref} className="bg-black overflow-hidden border-t border-white/8">
      <div className="px-[5vw] lg:px-[6vw] py-24 lg:py-40">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="font-sans text-[0.6rem] tracking-[0.1em] uppercase text-white/30 mb-6"
        >
          Next step
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold text-white leading-none tracking-tight text-[clamp(3rem,9vw,9rem)] max-w-[12ch]"
        >
          Ready when you are.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 lg:mt-16 flex flex-col sm:flex-row gap-4"
        >
          <a
            href={hkUrl}
            className="inline-flex items-center justify-center px-10 py-[1.1rem] font-display font-semibold text-[0.78rem] tracking-wide uppercase text-white bg-brand-red hover:bg-brand-red/85 transition-colors duration-300"
          >
            Enter Hong Kong →
          </a>
          <a
            href={sgUrl}
            className="inline-flex items-center justify-center px-10 py-[1.1rem] font-display font-semibold text-[0.78rem] tracking-wide uppercase text-white/75 border border-white/20 hover:border-white/50 hover:bg-white/6 transition-all duration-300"
          >
            Enter Singapore →
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.52 }}
          className="mt-8 font-sans text-[0.8rem] text-white/35"
        >
          Not sure which is right for you?{" "}
          <a
            href="mailto:hello@proactivsports.com"
            className="font-semibold text-white/55 underline underline-offset-2 hover:text-white transition-colors"
          >
            Email hello@proactivsports.com
          </a>{" "}
          and we&apos;ll help.
        </motion.p>
      </div>
    </section>
  );
}

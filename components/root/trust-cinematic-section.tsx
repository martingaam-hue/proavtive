"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const PARTNER_NAMES = [
  "International French School",
  "Singapore American School",
  "KidsFirst",
  "ESF",
] as const;

const TESTIMONIAL = {
  quote:
    "Proactiv was the only sports centre we found to be inclusive of students with special needs, ensuring every child could participate. Our children and their families really enjoyed the event and the facilities.",
  author: "Manjula Gunawardena",
  role: "Manager & Senior Teacher, KidsFirst",
};

export function TrustCinematicSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} className="bg-black overflow-hidden">
      <div className="px-[5vw] lg:px-[6vw] py-24 lg:py-40">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-sans text-[0.6rem] tracking-[0.1em] uppercase text-white/30 mb-10 lg:mb-14"
        >
          A decade of trust
        </motion.p>

        <div className="max-w-[60ch] lg:max-w-[72ch]">
          <motion.span
            initial={{ opacity: 0, y: -16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            aria-hidden="true"
            className="block font-display font-bold text-white/8 text-[7rem] lg:text-[11rem] leading-none -mb-8 lg:-mb-12 select-none"
          >
            &ldquo;
          </motion.span>

          <motion.blockquote
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-display font-bold text-white leading-tight tracking-tight text-[clamp(1.2rem,2.7vw,2.2rem)]">
              {TESTIMONIAL.quote}
            </p>
            <footer className="mt-8 lg:mt-10">
              <cite className="not-italic">
                <span className="block font-display font-semibold text-white text-[0.92rem]">
                  {TESTIMONIAL.author}
                </span>
                <span className="block font-sans text-white/40 text-[0.76rem] mt-1">
                  {TESTIMONIAL.role}
                </span>
              </cite>
            </footer>
          </motion.blockquote>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 lg:mt-24 pt-10 lg:pt-14 border-t border-white/10"
        >
          <p className="font-sans text-[0.6rem] tracking-[0.1em] uppercase text-white/25 mb-6">
            Trusted by leading international schools and partners
          </p>
          <ul className="flex flex-wrap gap-2" aria-label="Partner organisations">
            {PARTNER_NAMES.map((name) => (
              <li
                key={name}
                className="font-sans text-[0.78rem] text-white/50 px-4 py-[0.4rem] border border-white/10"
              >
                {name}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

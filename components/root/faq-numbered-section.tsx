"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export interface FAQEntry {
  readonly value: string;
  readonly question: string;
  readonly answer: string;
}

interface FAQNumberedSectionProps {
  items: readonly FAQEntry[];
}

interface FAQRowProps extends FAQEntry {
  rowIndex: number;
}

function FAQRow({ question, answer, rowIndex }: FAQRowProps) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-4%" });
  const num = String(rowIndex + 1).padStart(2, "0");

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      transition={{ delay: rowIndex * 0.055, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-[2.5rem_1fr] lg:grid-cols-[3.5rem_1fr] gap-5 lg:gap-8 py-7 lg:py-10 border-b border-foreground/10 last:border-b-0"
    >
      <span className="font-display font-bold text-[0.9rem] text-brand-navy/22 tabular-nums mt-[3px] select-none">
        {num}
      </span>
      <div>
        <h3 className="font-display font-bold text-foreground text-[1.05rem] lg:text-[1.15rem] leading-snug">
          {question}
        </h3>
        <p className="mt-3 font-sans text-[0.88rem] text-muted-foreground leading-relaxed max-w-[65ch]">
          {answer}
        </p>
      </div>
    </motion.li>
  );
}

export function FAQNumberedSection({ items }: FAQNumberedSectionProps) {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-8%" });

  return (
    <section>
      <div className="px-[5vw] lg:px-[6vw] py-20 lg:py-28">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 16 }}
          animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 lg:mb-14"
        >
          <h2 className="font-display font-extrabold text-foreground tracking-tight text-[clamp(1.75rem,3vw,2.75rem)] max-w-[22ch]">
            Frequently asked — about the brand
          </h2>
        </motion.div>

        <ul className="list-none m-0 p-0">
          {items.map((item, i) => (
            <FAQRow key={item.value} {...item} rowIndex={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

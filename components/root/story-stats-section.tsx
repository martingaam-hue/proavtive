"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Stat {
  value: string;
  label: string;
}
interface Props {
  stats: readonly Stat[];
}

function StatCounter({ value, label, active }: { value: string; label: string; active: boolean }) {
  const numeric = parseInt(value, 10);
  const isRange = value.includes("–");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active || isRange || isNaN(numeric)) return;
    const start = performance.now();
    const duration = 1600;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setCount(Math.round(eased * numeric));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, numeric, isRange]);

  return (
    <div className="flex flex-col items-center lg:items-start">
      <span className="font-display font-bold text-white text-[clamp(3rem,5vw,5.5rem)] leading-none tracking-tight tabular-nums">
        {isRange ? value : count}
      </span>
      <span className="font-sans text-[0.72rem] text-white/40 tracking-wide uppercase mt-2">
        {label}
      </span>
    </div>
  );
}

export function StorySectionWithStats({ stats }: Props) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-[#111111]">
      <div className="px-[5vw] lg:px-[6vw] py-[clamp(5rem,10vw,9rem)]">
        <motion.p
          className="font-sans text-[0.65rem] tracking-[0.1em] uppercase text-brand-red font-semibold mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          Our Story
        </motion.p>
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-20 items-start">
          <motion.h2
            className="font-display font-bold text-white text-[clamp(2rem,4.5vw,4.5rem)] leading-[1.05] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            A children&apos;s sports specialist — not a gym with a kids&apos; class.
          </motion.h2>

          <motion.div
            className="space-y-5 font-sans text-[1rem] lg:text-[1.05rem] text-white/55 leading-[1.75] pt-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <p>
              ProActiv Sports was founded in Hong Kong in 2011 and expanded to Singapore in 2014. We
              run purpose-built facilities for gymnastics and multi-sports, with a single focus:
              helping children aged 2 to 16 build physical confidence, coordination, and a lifelong
              relationship with movement.
            </p>
            <p>
              Every coach on our team completes the ProActiv Sports training course — regardless of
              prior qualifications — so that whether your child trains with us in Wan Chai,
              Cyberport, or Katong, the standard of care and progression is the same.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats strip */}
      <div ref={stripRef} className="bg-black border-t border-white/8">
        <div className="px-[5vw] lg:px-[6vw] py-14 lg:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0 lg:divide-x lg:divide-white/8">
            {stats.map((s, i) => (
              <div key={s.label} className={i > 0 ? "lg:pl-16" : ""}>
                <StatCounter value={s.value} label={s.label} active={inView} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

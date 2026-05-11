"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface HeroSectionProps {
  hkUrl: string;
  sgUrl: string;
}

const SLIDES = [
  {
    id: "gateway",
    photo: "/photography/hero-gateway.jpg",
    alt: "Children training at ProActiv Sports — gymnastics and movement",
    eyebrow: "Children's Sports Specialists · Est. 2011",
    headline: ["Move.", "Grow.", "Thrive."],
    sub: "Gymnastics & multi-sport programmes across Hong Kong and Singapore.",
    cta: null,
  },
  {
    id: "gymnastics",
    photo: "/photography/gymnastics.jpg",
    alt: "ProGym Hong Kong — gymnastics classes Wan Chai and Cyberport",
    eyebrow: "Hong Kong · ProGym Wan Chai · ProGym Cyberport",
    headline: ["ProGym"],
    sub: "World-class gymnastics coaching for children aged 2–16.",
    cta: { label: "Explore Hong Kong", market: "hk" as const },
  },
  {
    id: "sports",
    photo: "/photography/sports-classes.jpg",
    alt: "Prodigy Singapore — multi-sport classes at Katong Point",
    eyebrow: "Singapore · Katong Point",
    headline: ["Prodigy"],
    sub: "Multi-sport · MultiBall · Climbing · Ages 2–16.",
    cta: { label: "Explore Singapore", market: "sg" as const },
  },
  {
    id: "camps",
    photo: "/photography/camps.jpg",
    alt: "ProActiv holiday camps — gymnastics and sports for children",
    eyebrow: "Holiday Programmes",
    headline: ["Camps &", "Clinics"],
    sub: "Intensive holiday camps and skill-building clinics across both cities.",
    cta: null,
  },
  {
    id: "parties",
    photo: "/photography/parties.jpg",
    alt: "ProActiv birthday parties — active celebrations for children",
    eyebrow: "Birthday Parties",
    headline: ["Celebrate", "Big."],
    sub: "Unforgettable active birthday parties at our dedicated gymnastics facilities.",
    cta: null,
  },
] as const;

const SLIDE_DURATION = 6000;

export function HeroSection({ hkUrl, sgUrl }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>(Array(SLIDES.length).fill(false));
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const currentRef = useRef(0);

  const getUrl = (market: "hk" | "sg") => (market === "hk" ? hkUrl : sgUrl);

  const advance = useCallback((toIndex: number) => {
    setCompleted((prev) => {
      const next = [...prev];
      next[currentRef.current] = true;
      return next;
    });
    currentRef.current = toIndex;
    setCurrent(toIndex);
    setProgressKey((k) => k + 1);
    startRef.current = performance.now();
  }, []);

  useEffect(() => {
    startRef.current = performance.now();
    const tick = (now: number) => {
      if (now - startRef.current >= SLIDE_DURATION) {
        const next = (currentRef.current + 1) % SLIDES.length;
        if (next === 0) setCompleted(Array(SLIDES.length).fill(false));
        advance(next);
        startRef.current = performance.now();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [advance]);

  const goTo = useCallback(
    (index: number) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      setCompleted((prev) => {
        const next = [...prev];
        for (let i = 0; i < SLIDES.length; i++) next[i] = i < index;
        return next;
      });
      currentRef.current = index;
      setCurrent(index);
      setProgressKey((k) => k + 1);
      startRef.current = performance.now();
      const tick = (now: number) => {
        if (now - startRef.current >= SLIDE_DURATION) {
          const next = (currentRef.current + 1) % SLIDES.length;
          if (next === 0) setCompleted(Array(SLIDES.length).fill(false));
          advance(next);
          startRef.current = performance.now();
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [advance],
  );

  const slide = SLIDES[current];

  return (
    <section className="relative h-svh min-h-[600px] overflow-hidden bg-black">
      {/* ── Background slides with Ken Burns ── */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          aria-hidden={i !== current}
        >
          <div className="absolute inset-0 animate-ken-burns will-change-transform">
            <Image
              src={s.photo}
              alt={s.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      ))}

      {/* ── Cinematic gradient layers ── */}
      {/* Top fade — nav readability */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 via-black/20 to-transparent z-20 pointer-events-none" />
      {/* Left sweep — copy legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-20 pointer-events-none" />
      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-20 pointer-events-none" />
      {/* Global dark tint */}
      <div className="absolute inset-0 bg-black/18 z-20 pointer-events-none" />

      {/* ── Content layer — sits above gradients, below nav ── */}
      <div className="relative z-30 flex flex-col h-full px-[5vw] lg:px-[7vw]">
        {/* Push content below the overlaid nav */}
        <div className="pt-[4.5rem] lg:pt-20 flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[88vw] lg:max-w-[62vw]"
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-6 lg:mb-8">
                <span className="block w-7 h-px bg-brand-red shrink-0" />
                <p className="font-sans text-[0.6rem] tracking-[0.38em] uppercase text-white/50">
                  {slide.eyebrow}
                </p>
              </div>

              {/* Headline — staggered word reveal */}
              <div aria-label={slide.headline.join(" ")}>
                {slide.headline.map((word, wi) => (
                  <div key={`${current}-${wi}`} className="overflow-hidden">
                    <motion.span
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      transition={{
                        delay: wi * 0.1,
                        duration: 0.7,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={`block font-display font-extrabold leading-[0.86] tracking-[-0.03em] text-white ${
                        slide.headline.length === 1
                          ? "text-[clamp(4.5rem,10vw,10rem)]"
                          : "text-[clamp(4rem,9.5vw,9.5rem)]"
                      }`}
                    >
                      {word}
                    </motion.span>
                  </div>
                ))}
              </div>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.65 }}
                className="mt-6 lg:mt-7 font-sans text-[0.88rem] lg:text-[0.96rem] text-white/45 leading-[1.7] max-w-[44ch]"
              >
                {slide.sub}
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.55 }}
                className="mt-9 lg:mt-11 flex flex-col sm:flex-row gap-3"
              >
                {slide.cta ? (
                  <a
                    href={getUrl(slide.cta.market)}
                    className="inline-flex items-center gap-2.5 px-8 py-[1rem] font-display font-bold text-[0.68rem] tracking-[0.2em] uppercase text-white bg-brand-red hover:bg-brand-red/85 transition-colors duration-200 w-fit"
                  >
                    {slide.cta.label}
                    <span aria-hidden>→</span>
                  </a>
                ) : (
                  <>
                    <a
                      href={hkUrl}
                      className="inline-flex items-center justify-center gap-2 px-8 py-[1rem] font-display font-bold text-[0.68rem] tracking-[0.2em] uppercase text-white bg-brand-red hover:bg-brand-red/85 transition-colors duration-200"
                    >
                      Hong Kong <span aria-hidden>→</span>
                    </a>
                    <a
                      href={sgUrl}
                      className="inline-flex items-center justify-center gap-2 px-8 py-[1rem] font-display font-bold text-[0.68rem] tracking-[0.2em] uppercase text-white/80 border border-white/22 hover:border-white/50 hover:bg-white/6 transition-all duration-200"
                    >
                      Singapore <span aria-hidden>→</span>
                    </a>
                  </>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Bottom bar: slide counter + progress strips ── */}
        <div className="pb-8 lg:pb-10 flex items-end gap-6">
          {/* Slide counter */}
          <div className="shrink-0 pb-0.5">
            <AnimatePresence mode="wait">
              <motion.span
                key={current}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                className="block font-display font-bold text-[2rem] lg:text-[2.4rem] leading-none tracking-[-0.04em] text-white/12 tabular-nums select-none"
              >
                {String(current + 1).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Progress strips */}
          <div className="flex-1 flex items-center gap-1.5 pb-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="relative flex-1 h-[1.5px] cursor-pointer group"
              >
                <span className="absolute inset-0 bg-white/14" />
                {completed[i] && i !== current && <span className="absolute inset-0 bg-white/36" />}
                {i === current && (
                  <span
                    key={progressKey}
                    className="absolute inset-y-0 left-0 w-full bg-brand-red animate-slide-progress"
                    style={{ animationDuration: `${SLIDE_DURATION}ms` }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Total count */}
          <span className="shrink-0 font-display font-bold text-[0.58rem] tracking-[0.25em] text-white/22 pb-1 select-none">
            / {String(SLIDES.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}

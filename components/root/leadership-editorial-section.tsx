"use client";

import Image from "next/image";

export interface LeadershipPersonProps {
  name: string;
  role: string;
  bioLine: string;
  portrait: string;
  portraitAlt: string;
}

interface LeadershipEditorialSectionProps {
  heading: string;
  leaders: ReadonlyArray<LeadershipPersonProps>;
}

function Portrait({
  name,
  role,
  bioLine,
  portrait,
  portraitAlt,
  aspectClass,
  sizes,
}: LeadershipPersonProps & { aspectClass: string; sizes: string }) {
  return (
    <div className={`group relative overflow-hidden ${aspectClass}`}>
      <Image src={portrait} alt={portraitAlt} fill sizes={sizes} className="object-cover" />

      {/* Always-visible: name + role gradient overlay at bottom */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-navy/95 via-brand-navy/50 to-transparent pt-24 pb-7 px-7 pointer-events-none"
      >
        <p className="font-display font-bold text-brand-cream text-[clamp(0.95rem,1.6vw,1.25rem)] tracking-wide uppercase leading-tight">
          {name}
        </p>
        <p className="font-sans text-brand-cream/60 text-[0.7rem] tracking-[0.18em] uppercase mt-1">
          {role}
        </p>
      </div>

      {/* Bio slide-up overlay on hover */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-brand-cream flex flex-col justify-end p-7 lg:p-9 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
      >
        <p className="font-display font-bold text-brand-navy text-[clamp(0.95rem,1.6vw,1.25rem)] tracking-wide uppercase leading-tight">
          {name}
        </p>
        <p className="font-sans text-brand-navy/55 text-[0.7rem] tracking-[0.18em] uppercase mt-1">
          {role}
        </p>
        <p className="font-sans text-brand-navy/80 text-sm leading-relaxed mt-5 max-w-[38ch]">
          {bioLine}
        </p>
      </div>

      {/* Screen-reader accessible content */}
      <div className="sr-only">
        <p>{name}</p>
        <p>{role}</p>
        <p>{bioLine}</p>
      </div>
    </div>
  );
}

export function LeadershipEditorialSection({ heading, leaders }: LeadershipEditorialSectionProps) {
  const [will, ...rest] = leaders;

  return (
    <section className="bg-brand-cream py-[clamp(5rem,10vw,10rem)]">
      <div className="mx-auto max-w-[1440px] px-[5%]">
        <h2 className="font-display font-bold text-brand-navy [font-size:clamp(2.5rem,4vw,4rem)] leading-none mb-12 lg:mb-16 max-w-[22ch]">
          {heading}
        </h2>

        <div className="flex flex-col lg:flex-row gap-3">
          {/* Will — large left portrait */}
          {will && (
            <Portrait
              {...will}
              aspectClass="lg:w-[55%] aspect-[3/4]"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          )}

          {/* Monica + Haikel — stacked right column */}
          {rest.length > 0 && (
            <div className="flex flex-col gap-3 lg:flex-1">
              {rest.map((leader) => (
                <Portrait
                  key={leader.name}
                  {...leader}
                  aspectClass="aspect-[3/2]"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

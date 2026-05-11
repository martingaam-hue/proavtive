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

      {/* Always-visible name + role overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-24 pb-7 px-7 pointer-events-none"
      >
        <p className="font-display font-semibold text-white text-[clamp(0.95rem,1.6vw,1.25rem)] leading-tight">
          {name}
        </p>
        <p className="font-sans text-white/50 text-[0.72rem] tracking-wide uppercase mt-1">
          {role}
        </p>
      </div>

      {/* Bio slide-up on hover */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#1a1a1a] flex flex-col justify-end p-7 lg:p-9 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
      >
        <p className="font-display font-semibold text-white text-[clamp(0.95rem,1.6vw,1.25rem)] leading-tight">
          {name}
        </p>
        <p className="font-sans text-white/40 text-[0.72rem] tracking-wide uppercase mt-1">
          {role}
        </p>
        <p className="font-sans text-white/70 text-sm leading-relaxed mt-5 max-w-[38ch]">
          {bioLine}
        </p>
      </div>

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
    <section className="bg-[#111111] py-[clamp(5rem,10vw,10rem)]">
      <div className="mx-auto max-w-[1440px] px-[5%]">
        <h2 className="font-display font-bold text-white [font-size:clamp(2.5rem,4vw,4rem)] leading-none mb-12 lg:mb-16 max-w-[22ch]">
          {heading}
        </h2>

        <div className="flex flex-col lg:flex-row gap-3">
          {will && (
            <Portrait
              {...will}
              aspectClass="lg:w-[55%] aspect-[3/4]"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          )}
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

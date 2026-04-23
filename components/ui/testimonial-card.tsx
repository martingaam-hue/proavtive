// Phase 2 / Plan 02-04 — Testimonial card per UI-SPEC §3.9.
// Two variants: default (cream bg + Quote icon + Avatar footer) and pullquote
// (no card chrome, yellow left-border, navy display-size quote).
// <blockquote> semantic + <cite> for author (a11y).

import * as React from "react";
import { Quote } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const testimonialCardVariants = cva("", {
  variants: {
    variant: {
      default: "rounded-2xl bg-accent p-6 lg:p-8",
      pullquote: "border-l-4 border-brand-yellow pl-6",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface TestimonialCardProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof testimonialCardVariants> {
  quote: string;
  author: string;
  authorRole?: string;
  avatarSrc?: string;
  avatarAlt?: string;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

export function TestimonialCard({
  quote,
  author,
  authorRole,
  avatarSrc,
  avatarAlt,
  variant = "default",
  className,
  ...props
}: TestimonialCardProps) {
  const isPullquote = variant === "pullquote";

  return (
    <figure
      data-slot="testimonial-card"
      data-variant={variant}
      className={cn(testimonialCardVariants({ variant }), className)}
      {...props}
    >
      {!isPullquote ? <Quote aria-hidden="true" className="mb-4 size-8 text-brand-yellow" /> : null}
      <blockquote
        className={cn(
          isPullquote
            ? "font-display text-4xl font-bold leading-tight tracking-tight text-primary lg:text-[3.5rem]"
            : "font-sans text-lg leading-relaxed text-foreground",
        )}
      >
        {isPullquote ? null : <span aria-hidden="true">&ldquo;</span>}
        {quote}
        {isPullquote ? null : <span aria-hidden="true">&rdquo;</span>}
      </blockquote>
      <figcaption className={cn("mt-6 flex items-center gap-3", isPullquote && "mt-4")}>
        {!isPullquote ? (
          <Avatar className="size-10">
            {avatarSrc ? (
              <AvatarImage src={avatarSrc} alt={avatarAlt ?? `Portrait of ${author}`} />
            ) : null}
            <AvatarFallback aria-hidden="true">{initials(author)}</AvatarFallback>
          </Avatar>
        ) : null}
        <div>
          <cite className="not-italic font-sans text-base font-semibold text-primary">
            {author}
          </cite>
          {authorRole ? (
            <p className="font-sans text-sm text-muted-foreground">{authorRole}</p>
          ) : null}
        </div>
      </figcaption>
    </figure>
  );
}

export { testimonialCardVariants };

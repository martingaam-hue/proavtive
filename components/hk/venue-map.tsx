// Phase 4 / Plan 04-04 — Lightweight venue map component (RSC).
// Per UI-SPEC §5.4 + RESEARCH Pattern 3: iframe embed, NOT Google Maps JS SDK.
// Zero JavaScript bundle cost. Lazy-loads via loading="lazy" — no impact on LCP.
// Title attribute required (a11y / Lighthouse Best Practices).
// HUMAN-ACTION: when embedSrc is empty/PLACEHOLDER, falls back to address-text card;
// consumer-page renders address text below.
import { cn } from "@/lib/utils";

export interface VenueMapProps {
  /** Full Google Maps embed URL from Share → Embed a map. Empty or starts with "PLACEHOLDER" → fallback rendered. */
  embedSrc: string;
  /** Iframe title for accessibility — must describe the venue (e.g. "Map of ProGym Wan Chai"). Required. */
  title: string;
  /** Optional className appended to root element. */
  className?: string;
}

export function VenueMap({ embedSrc, title, className }: VenueMapProps) {
  const isPlaceholder = !embedSrc || embedSrc.includes("PLACEHOLDER");

  if (isPlaceholder) {
    return (
      <div
        className={cn(
          "rounded-lg bg-muted h-64 flex items-center justify-center border border-border",
          className
        )}
        role="status"
        aria-live="polite"
        aria-label={`${title} — map unavailable, see address below`}
      >
        <p className="text-muted-foreground text-small text-center px-4">
          Map loading — see venue address below.
        </p>
      </div>
    );
  }

  return (
    <iframe
      src={embedSrc}
      title={title}
      width="100%"
      height="300"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={cn("rounded-lg border-0 w-full", className)}
      aria-label={title}
    />
  );
}

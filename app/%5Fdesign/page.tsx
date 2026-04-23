// Phase 2 / Plan 02-06 — /_design/ gallery page per UI-SPEC §4.
// D-09: production lockout via VERCEL_ENV check + notFound().
// Additional belt-and-braces: metadata.robots.index=false, Phase 0 X-Robots-Tag
// already applied on non-production by next.config.ts.
// D-08: single scrollable page — all primitives in one route.

import { notFound } from "next/navigation";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Section } from "@/components/ui/section";

export const dynamic = "force-static";

export default function DesignGallery() {
  // D-09 — production lockout
  if (process.env.VERCEL_ENV === "production") {
    notFound();
  }

  return (
    <main>
      <Section size="sm">
        <ContainerEditorial width="wide">
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-primary lg:text-[3.5rem]">
            Phase 2 Design System — Gallery
          </h1>
          <p className="mt-4 font-sans text-lg leading-relaxed text-muted-foreground">
            Every Phase 2 primitive rendered once against real ProActiv photography. Internal — not
            a production surface.
          </p>
        </ContainerEditorial>
      </Section>

      {/* § Foundation — Task 2 populates */}
      <Section id="foundation" size="md" bg="muted">
        <ContainerEditorial width="wide">
          <h2 className="font-display text-2xl font-bold leading-snug tracking-tight lg:text-4xl">
            Foundation
          </h2>
          {/* Colors, Typography, Spacing, Radius & Shadow — Task 2 */}
        </ContainerEditorial>
      </Section>

      {/* § Primitives — Task 2 populates */}
      <Section id="primitives" size="md">
        <ContainerEditorial width="wide">
          <h2 className="font-display text-2xl font-bold leading-snug tracking-tight lg:text-4xl">
            Primitives
          </h2>
          {/* Button, Card, Accordion, Badge, Avatar, Separator — Task 2 */}
        </ContainerEditorial>
      </Section>

      {/* § Patterns — Task 2 populates */}
      <Section id="patterns" size="md" bg="muted">
        <ContainerEditorial width="wide">
          <h2 className="font-display text-2xl font-bold leading-snug tracking-tight lg:text-4xl">
            Patterns
          </h2>
          {/* MarketCard, ProgrammeTile, TestimonialCard, StatStrip, LogoWall, Section, ContainerEditorial — Task 2 */}
        </ContainerEditorial>
      </Section>

      {/* § Media — Task 2 populates */}
      <Section id="media" size="md">
        <ContainerEditorial width="wide">
          <h2 className="font-display text-2xl font-bold leading-snug tracking-tight lg:text-4xl">
            Media
          </h2>
          {/* Image contract + VideoPlayer — Task 2 */}
        </ContainerEditorial>
      </Section>

      {/* Footer */}
      <Section size="sm" bg="navy">
        <ContainerEditorial width="wide">
          <p className="font-display text-xl font-semibold">Done bar</p>
          <p className="mt-4 font-sans text-base leading-relaxed text-brand-cream">
            This gallery proves every Phase 2 primitive against one real ProActiv photograph, passes
            keyboard navigation, and passes WCAG AA contrast (verified via Lighthouse accessibility
            audit ≥ 95). Variant matrices, state galleries, and Storybook-style documentation are
            deliberately deferred — Phase 3+ discovers variant needs from real page context.
          </p>
        </ContainerEditorial>
      </Section>
    </main>
  );
}

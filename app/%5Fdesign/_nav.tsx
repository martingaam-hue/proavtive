// Phase 2 / Plan 02-06 — /_design/ sidebar nav (static anchor links per UI-SPEC §4.2).
// Plain <a> refs — no IntersectionObserver active-state tracking (deferred per "planner decides").

import * as React from "react";

interface NavGroup {
  title: string;
  anchor: string;
  items: ReadonlyArray<{ label: string; anchor: string }>;
}

const GROUPS: ReadonlyArray<NavGroup> = [
  {
    title: "Foundation",
    anchor: "#foundation",
    items: [
      { label: "Colors", anchor: "#colors" },
      { label: "Typography", anchor: "#typography" },
      { label: "Spacing", anchor: "#spacing" },
      { label: "Radius & Shadow", anchor: "#radius-shadow" },
    ],
  },
  {
    title: "Primitives",
    anchor: "#primitives",
    items: [
      { label: "Button", anchor: "#button" },
      { label: "Card", anchor: "#card" },
      { label: "Accordion / FAQItem", anchor: "#accordion" },
      { label: "Badge", anchor: "#badge" },
      { label: "Avatar", anchor: "#avatar" },
      { label: "Separator", anchor: "#separator" },
    ],
  },
  {
    title: "Patterns",
    anchor: "#patterns",
    items: [
      { label: "MarketCard", anchor: "#marketcard" },
      { label: "ProgrammeTile", anchor: "#programme-tile" },
      { label: "TestimonialCard", anchor: "#testimonial-card" },
      { label: "StatStrip", anchor: "#stat-strip" },
      { label: "LogoWall", anchor: "#logo-wall" },
      { label: "Section", anchor: "#section" },
      { label: "ContainerEditorial", anchor: "#container-editorial" },
    ],
  },
  {
    title: "Media",
    anchor: "#media",
    items: [
      { label: "Image contract", anchor: "#image" },
      { label: "VideoPlayer", anchor: "#video-player" },
    ],
  },
];

export function GalleryNav() {
  return (
    <nav className="px-6 py-8">
      <p className="mb-6 font-display text-xl font-semibold text-primary">Phase 2 Gallery</p>
      <ul className="space-y-6">
        {GROUPS.map((group) => (
          <li key={group.anchor}>
            <a
              href={group.anchor}
              className="font-sans text-sm font-medium uppercase tracking-wide text-muted-foreground hover:text-primary"
            >
              {group.title}
            </a>
            <ul className="mt-2 space-y-1">
              {group.items.map((item) => (
                <li key={item.anchor}>
                  <a
                    href={item.anchor}
                    className="block rounded-md px-2 py-1 font-sans text-sm text-primary transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Phase 5 / Plan 05-01 — Wave-0 RED harness for the SG homepage (SG-01).
//
// These tests are written RED: the SG homepage source needs to be populated by
// Plans 05-02..05-06. Until then, dynamic imports will fail or assertions
// will not find the required elements.
//
// What the tests guard (binding from VALIDATION.md + UI-SPEC §3):
//   1. Single <h1> containing "Where Singapore's kids come to move, play, and grow."
//      — verbatim from strategy PART 6C H1 (the only valid text — no paraphrasing)
//   2. Katong Point venue chip link to /katong-point/
//   3. Trust line "Singapore's only MultiBall wall"
//   4. Primary CTA links to /book-a-trial/
//
// RED state is intentional — Plans 05-02 through 05-06 make these green.

import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import React from "react";

// Stub Phase 2 primitives — tests verify *wiring*, not primitive internals.
vi.mock("@/components/ui/section", () => ({
  Section: ({ children, ...rest }: any) =>
    React.createElement("section", rest, children),
}));
vi.mock("@/components/ui/container-editorial", () => ({
  ContainerEditorial: ({ children, ...rest }: any) =>
    React.createElement("div", rest, children),
}));
vi.mock("@/components/ui/video-player", () => ({
  default: () => null,
  VideoPlayer: () => null,
}));
vi.mock("@/components/ui/button", () => ({
  Button: ({ asChild, children, ...rest }: any) =>
    asChild
      ? React.createElement(React.Fragment, null, children)
      : React.createElement("button", rest, children),
}));
vi.mock("@/components/ui/card", () => ({
  Card: ({ children, ...rest }: any) =>
    React.createElement("div", rest, children),
  CardHeader: ({ children, ...rest }: any) =>
    React.createElement("div", rest, children),
  CardContent: ({ children, ...rest }: any) =>
    React.createElement("div", rest, children),
}));
vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children, ...rest }: any) =>
    React.createElement("span", rest, children),
}));
vi.mock("@/components/ui/faq-item", () => ({
  FAQItem: ({ question, answer }: any) =>
    React.createElement(
      "div",
      { "data-test": "faq-item" },
      question,
      answer
    ),
}));
vi.mock("@/components/ui/accordion", () => ({
  Accordion: ({ children }: any) =>
    React.createElement("div", { "data-test": "accordion" }, children),
  AccordionItem: ({ children }: any) =>
    React.createElement("div", null, children),
  AccordionTrigger: ({ children }: any) =>
    React.createElement("button", null, children),
  AccordionContent: ({ children }: any) =>
    React.createElement("div", null, children),
}));
vi.mock("@/components/ui/stat-strip", () => ({
  StatStrip: () => React.createElement("div", { "data-test": "stat-strip" }),
}));
vi.mock("@/components/ui/logo-wall", () => ({
  LogoWall: () => React.createElement("div", { "data-test": "logo-wall" }),
}));
vi.mock("@/components/sg/sg-nav", () => ({
  SGNav: () => React.createElement("nav", { "data-test": "sg-nav" }),
}));
vi.mock("@/components/sg/sg-footer", () => ({
  SGFooter: () =>
    React.createElement("footer", { "data-test": "sg-footer" }),
}));
vi.mock("next/image", () => ({
  default: ({ src, alt, priority, ...rest }: any) =>
    React.createElement("img", {
      src,
      alt,
      "data-priority": priority ? "true" : "false",
      ...rest,
    }),
}));
vi.mock("next/dynamic", () => ({
  default: (_loader: any, opts: any) => opts?.loading ?? (() => null),
}));
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: any) =>
    React.createElement("a", { href, ...rest }, children),
}));

beforeAll(() => {
  process.env.NEXT_PUBLIC_WHATSAPP_SG = "+6598076827";
  process.env.NEXT_PUBLIC_ROOT_URL = "https://proactivsports.com/";
  process.env.NEXT_PUBLIC_HK_URL = "https://hk.proactivsports.com/";
  process.env.NEXT_PUBLIC_MAP_EMBED_KATONG_POINT =
    "https://www.google.com/maps/embed?pb=test";
});

afterEach(() => cleanup());

describe("SG homepage (SG-01) — H1 verbatim from strategy PART 6C §H1", () => {
  it("renders a single <h1> containing \"Where Singapore's kids come to move, play, and grow.\"", async () => {
    const mod = (await import("./page")) as any;
    const SGHomePage = mod.default;
    const ui =
      typeof SGHomePage === "function" ? await SGHomePage() : SGHomePage;
    const { container } = render(ui);
    const h1s = container.querySelectorAll("h1");
    expect(h1s.length).toBe(1);
    expect(h1s[0].textContent).toContain(
      "Where Singapore's kids come to move, play, and grow."
    );
  });
});

describe("SG homepage (SG-01) — Katong Point venue chip", () => {
  it("renders a link to /katong-point/ (venue chip)", async () => {
    const mod = (await import("./page")) as any;
    const SGHomePage = mod.default;
    const ui =
      typeof SGHomePage === "function" ? await SGHomePage() : SGHomePage;
    render(ui);
    const anchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[href="/katong-point/"]')
    );
    expect(anchors.length).toBeGreaterThanOrEqual(1);
  });
});

describe("SG homepage (SG-01) — MultiBall trust line", () => {
  it("renders 'Singapore\\'s only MultiBall wall' trust-line text", async () => {
    const mod = (await import("./page")) as any;
    const SGHomePage = mod.default;
    const ui =
      typeof SGHomePage === "function" ? await SGHomePage() : SGHomePage;
    render(ui);
    expect(document.body.textContent).toContain("Singapore's only MultiBall wall");
  });
});

describe("SG homepage (SG-01) — Book a Free Trial CTA", () => {
  it("renders a link to /book-a-trial/ whose text contains 'Book a Free Trial'", async () => {
    const mod = (await import("./page")) as any;
    const SGHomePage = mod.default;
    const ui =
      typeof SGHomePage === "function" ? await SGHomePage() : SGHomePage;
    render(ui);
    const anchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[href="/book-a-trial/"]')
    );
    expect(anchors.length).toBeGreaterThanOrEqual(1);
    const anyHasCta = anchors.some((a) =>
      (a.textContent ?? "").includes("Book a Free Trial")
    );
    expect(anyHasCta).toBe(true);
  });
});

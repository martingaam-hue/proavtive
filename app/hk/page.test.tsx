// Phase 4 / Plan 04-01 — Wave-0 RED harness for the HK homepage (HK-01).
//
// These tests are written RED: the HK homepage doesn't exist yet — Plan 04-03
// ships it and turns each of them green. The tests encode the binding
// behaviours from VALIDATION.md + UI-SPEC §3 so the executor of 04-03 has
// a machine-checkable contract rather than a free-form page.
//
// What the tests guard:
//   1. Single <h1> containing "Premium gymnastics" (UI-SPEC §3.1 verbatim)
//   2. Both venue chip labels rendered (UI-SPEC §3.2)
//   3. Primary CTA links to /book-a-trial/free-assessment/ (HK-01 SC #1)
//   4. FAQPage JSON-LD present in page output (UI-SPEC §8.3)
//   5. Exactly one <Image priority> (Pitfall 6 — single LCP image)
//
// All Phase 2 primitives are stubbed so failures point at HK page wiring,
// not primitive internals.

import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";

// Stub Phase 2 primitives — tests verify *wiring*, not primitive internals.
vi.mock("@/components/ui/section", () => ({
  Section: ({ children, ...rest }: any) => <section {...rest}>{children}</section>,
}));
vi.mock("@/components/ui/container-editorial", () => ({
  ContainerEditorial: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
}));
vi.mock("@/components/ui/video-player", () => ({
  default: () => null,
  VideoPlayer: () => null,
}));
vi.mock("@/components/ui/button", () => ({
  Button: ({ asChild, children, ...rest }: any) =>
    asChild ? <>{children}</> : <button {...rest}>{children}</button>,
}));
vi.mock("@/components/ui/card", () => ({
  Card: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
}));
vi.mock("@/components/ui/programme-tile", () => ({
  ProgrammeTile: ({ title, href }: any) => <a href={href}>{title}</a>,
}));
vi.mock("@/components/ui/market-card", () => ({
  MarketCard: ({ href, label }: any) => <a href={href}>{label}</a>,
}));
vi.mock("@/components/ui/testimonial-card", () => ({
  TestimonialCard: () => <div data-test="testimonial-card" />,
}));
vi.mock("@/components/ui/faq-item", () => ({
  FAQItem: ({ question, answer }: any) => (
    <div data-test="faq-item">
      {question}
      {answer}
    </div>
  ),
}));
vi.mock("@/components/ui/accordion", () => ({
  Accordion: ({ children }: any) => <div data-test="accordion">{children}</div>,
  AccordionItem: ({ children }: any) => <div>{children}</div>,
  AccordionTrigger: ({ children }: any) => <button>{children}</button>,
  AccordionContent: ({ children }: any) => <div>{children}</div>,
}));
vi.mock("@/components/ui/stat-strip", () => ({
  StatStrip: () => <div data-test="stat-strip" />,
}));
vi.mock("@/components/ui/logo-wall", () => ({
  LogoWall: () => <div data-test="logo-wall" />,
}));
vi.mock("@/components/hk/hk-nav", () => ({
  HKNav: () => <nav data-test="hk-nav" />,
}));
vi.mock("@/components/hk/hk-footer", () => ({
  HKFooter: () => <footer data-test="hk-footer" />,
}));
vi.mock("@/components/hk/venue-chip-row", () => ({
  VenueChipRow: () => (
    <div data-test="venue-chip-row">
      <a href="/wan-chai/">ProGym Wan Chai</a>
      <a href="/cyberport/">ProGym Cyberport</a>
    </div>
  ),
}));
vi.mock("@/components/hk/venue-map", () => ({
  VenueMap: ({ title }: { title: string }) => <iframe title={title} />,
}));
vi.mock("next/image", () => ({
  default: ({ src, alt, priority, ...rest }: any) => (
    <img
      src={src}
      alt={alt}
      data-priority={priority ? "true" : "false"}
      {...rest}
    />
  ),
}));
vi.mock("next/dynamic", () => ({
  default: (_loader: any, opts: any) =>
    opts?.loading ?? (() => null),
}));

beforeAll(() => {
  process.env.NEXT_PUBLIC_HK_WHATSAPP = "+85212345678";
  process.env.NEXT_PUBLIC_HK_PHONE = "+85287654321";
  process.env.NEXT_PUBLIC_ROOT_URL = "https://proactivsports.com/";
  process.env.NEXT_PUBLIC_SG_URL = "https://sg.proactivsports.com/";
});

afterEach(() => cleanup());

describe("HK homepage (HK-01) — H1 verbatim from strategy PART 6B §1", () => {
  it("renders a single <h1> whose text contains 'Premium gymnastics'", async () => {
    const mod = (await import("./page")) as any;
    const HKHomePage = mod.default;
    const ui = typeof HKHomePage === "function" ? await HKHomePage() : HKHomePage;
    const { container } = render(ui);
    const h1s = container.querySelectorAll("h1");
    expect(h1s.length).toBe(1);
    expect(h1s[0].textContent).toContain("Premium gymnastics");
  });
});

describe("HK homepage (HK-01) — venue chip row", () => {
  it("renders both 'ProGym Wan Chai' AND 'ProGym Cyberport' chip labels", async () => {
    const mod = (await import("./page")) as any;
    const HKHomePage = mod.default;
    const ui = typeof HKHomePage === "function" ? await HKHomePage() : HKHomePage;
    render(ui);
    expect(document.body.textContent).toContain("ProGym Wan Chai");
    expect(document.body.textContent).toContain("ProGym Cyberport");
  });
});

describe("HK homepage (HK-01) — Book a Free Trial CTA", () => {
  it("renders a link to /book-a-trial/free-assessment/ whose text contains 'Book a Free Trial'", async () => {
    const mod = (await import("./page")) as any;
    const HKHomePage = mod.default;
    const ui = typeof HKHomePage === "function" ? await HKHomePage() : HKHomePage;
    render(ui);
    const anchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        'a[href="/book-a-trial/free-assessment/"]'
      )
    );
    expect(anchors.length).toBeGreaterThanOrEqual(1);
    const anyHasCta = anchors.some((a) =>
      (a.textContent ?? "").includes("Book a Free Trial")
    );
    expect(anyHasCta).toBe(true);
  });
});

describe("HK homepage (HK-01) — FAQPage JSON-LD inline script", () => {
  it("renders <script type='application/ld+json'> with @graph containing FAQPage", async () => {
    const mod = (await import("./page")) as any;
    const HKHomePage = mod.default;
    const ui = typeof HKHomePage === "function" ? await HKHomePage() : HKHomePage;
    render(ui);
    const ldScripts = Array.from(
      document.querySelectorAll('script[type="application/ld+json"]')
    );
    expect(ldScripts.length).toBeGreaterThanOrEqual(1);
    const parsed = JSON.parse(ldScripts[0].textContent ?? "");
    const graph = Array.isArray(parsed["@graph"])
      ? parsed["@graph"]
      : [parsed];
    const hasFaq = graph.some((n: any) => n["@type"] === "FAQPage");
    expect(hasFaq).toBe(true);
  });
});

describe("HK homepage (HK-01) — Pitfall 6 single priority image", () => {
  it("renders exactly one <Image priority> (the hero image)", async () => {
    const mod = (await import("./page")) as any;
    const HKHomePage = mod.default;
    const ui = typeof HKHomePage === "function" ? await HKHomePage() : HKHomePage;
    render(ui);
    const priorityImages = Array.from(
      document.querySelectorAll('[data-priority="true"]')
    );
    expect(priorityImages.length).toBe(1);
  });
});

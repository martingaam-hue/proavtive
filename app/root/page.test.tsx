// Phase 3 / Plan 03-02 — Gateway homepage unit tests (TDD RED → GREEN)
// Tests verify: metadata shape, dual CTA URLs, single-priority image, JSON-LD structure, FAQ count.
// Pitfall 2: full openGraph object (not shallow-merged). Pitfall 6: single priority image. Pitfall 7: absolute href.

import { describe, it, expect, beforeAll, vi } from "vitest";
import { render } from "@testing-library/react";

// Stub Phase 2 primitives — tests verify *wiring*, not primitive internals.
vi.mock("@/components/ui/section", () => ({
  Section: ({ children, ...rest }: any) => <section data-test="section" {...rest}>{children}</section>,
}));
vi.mock("@/components/ui/container-editorial", () => ({
  ContainerEditorial: ({ children, ...rest }: any) => <div data-test="container" {...rest}>{children}</div>,
}));
vi.mock("@/components/ui/market-card", () => ({
  MarketCard: ({ href, label, imageSrc, priority, ...rest }: any) => (
    <a data-test="market-card" href={href} data-priority={priority ? "true" : "false"} data-image={imageSrc}>
      {label}
    </a>
  ),
}));
vi.mock("@/components/ui/stat-strip", () => ({ StatStrip: () => <div data-test="stat-strip" /> }));
vi.mock("@/components/ui/logo-wall", () => ({ LogoWall: () => <div data-test="logo-wall" /> }));
vi.mock("@/components/ui/testimonial-card", () => ({ TestimonialCard: () => <div data-test="testimonial-card" /> }));
vi.mock("@/components/ui/faq-item", () => ({
  FAQItem: ({ question, answer }: any) => <div data-test="faq-item">{question}{answer}</div>,
}));
vi.mock("@/components/ui/accordion", () => ({
  Accordion: ({ children }: any) => <div data-test="accordion">{children}</div>,
  AccordionItem: ({ children }: any) => <div>{children}</div>,
  AccordionTrigger: ({ children }: any) => <button>{children}</button>,
  AccordionContent: ({ children }: any) => <div>{children}</div>,
}));
vi.mock("@/components/ui/card", () => ({
  Card: ({ children, ...rest }: any) => <div data-test="card" {...rest}>{children}</div>,
}));
vi.mock("@/components/ui/button", () => ({
  Button: ({ asChild, children, ...rest }: any) => asChild ? <>{children}</> : <button {...rest}>{children}</button>,
}));
vi.mock("next/image", () => ({
  default: ({ src, alt, priority, ...rest }: any) => (
    <img src={src} alt={alt} data-priority={priority ? "true" : "false"} {...rest} />
  ),
}));
vi.mock("@/components/root/leadership-section", () => ({
  LeadershipSection: ({ leaders }: any) => (
    <section data-test="leadership-section">
      {leaders.map((l: any) => <div key={l.name} data-test="leader">{l.name}</div>)}
    </section>
  ),
}));

beforeAll(() => {
  process.env.NEXT_PUBLIC_HK_URL = "https://hk.proactivsports.com/";
  process.env.NEXT_PUBLIC_SG_URL = "https://sg.proactivsports.com/";
});

describe("Gateway homepage — GW-01 metadata", () => {
  it("exports metadata with title containing 'Move. Grow. Thrive'", async () => {
    const { metadata } = await import("./page");
    const title = typeof metadata.title === "string"
      ? metadata.title
      : (metadata.title as any)?.default ?? "";
    expect(title).toMatch(/Move\. Grow\. Thrive/);
  });

  it("exports FULL openGraph object (Pitfall 2 — no shallow-merge gap)", async () => {
    const { metadata } = await import("./page");
    const og = metadata.openGraph;
    expect(og).toBeDefined();
    expect(og?.siteName).toBeDefined();
    expect((og as any)?.locale).toBeDefined();
    expect((og as any)?.type).toBeDefined();
    expect((og as any)?.url).toBeDefined();
    expect((og as any)?.title).toBeDefined();
    expect((og as any)?.description).toBeDefined();
    expect(og?.images).toBeDefined();
  });
});

describe("Gateway homepage — GW-01 dual market entry", () => {
  it("renders two CTAs whose hrefs come from NEXT_PUBLIC_HK_URL / NEXT_PUBLIC_SG_URL (Pitfall 7)", async () => {
    const { default: GatewayPage } = await import("./page");
    const ui = await GatewayPage();
    render(ui);
    const hkAnchors = Array.from(document.querySelectorAll('a[href="https://hk.proactivsports.com/"]'));
    const sgAnchors = Array.from(document.querySelectorAll('a[href="https://sg.proactivsports.com/"]'));
    expect(hkAnchors.length).toBeGreaterThanOrEqual(2); // hero + final CTA
    expect(sgAnchors.length).toBeGreaterThanOrEqual(2);
  });
});

describe("Gateway homepage — GW-01 single priority image (Pitfall 6)", () => {
  it("renders exactly one Image with priority", async () => {
    const { default: GatewayPage } = await import("./page");
    const ui = await GatewayPage();
    render(ui);
    const priorityImages = Array.from(document.querySelectorAll('[data-priority="true"]'));
    expect(priorityImages.length).toBe(1);
  });
});

describe("Gateway homepage — GW-01 inline JSON-LD", () => {
  it("renders @graph with Organization + WebSite + FAQPage", async () => {
    const { default: GatewayPage } = await import("./page");
    const ui = await GatewayPage();
    render(ui);
    const ldScript = document.querySelector('script[type="application/ld+json"]');
    expect(ldScript).not.toBeNull();
    const parsed = JSON.parse(ldScript!.textContent ?? "");
    expect(parsed["@context"]).toBe("https://schema.org");
    expect(Array.isArray(parsed["@graph"])).toBe(true);
    expect(parsed["@graph"]).toHaveLength(3);
    expect(parsed["@graph"][0]["@type"]).toBe("Organization");
    expect(parsed["@graph"][1]["@type"]).toBe("WebSite");
    expect(parsed["@graph"][2]["@type"]).toBe("FAQPage");
  });

  it("FAQPage mainEntity has exactly 6 Q&A pairs", async () => {
    const { default: GatewayPage } = await import("./page");
    const ui = await GatewayPage();
    render(ui);
    const ldScript = document.querySelector('script[type="application/ld+json"]');
    const parsed = JSON.parse(ldScript!.textContent ?? "");
    const faqPage = parsed["@graph"].find((n: any) => n["@type"] === "FAQPage");
    expect(faqPage.mainEntity).toHaveLength(6);
    for (const q of faqPage.mainEntity) {
      expect(q["@type"]).toBe("Question");
      expect(typeof q.name).toBe("string");
      expect(q.acceptedAnswer["@type"]).toBe("Answer");
      expect(typeof q.acceptedAnswer.text).toBe("string");
    }
  });
});

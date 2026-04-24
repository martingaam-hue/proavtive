// Phase 4 / Plan 04-01 — Wave-0 RED harness for the ProGym Cyberport location page (HK-03).
//
// Written RED — Plan 04-04 ships the page and turns each test green.
// Guards:
//   1. Literal "5,000 sq ft" marker (verbatim from strategy)
//   2. <h1> contains "Cyberport" (primary venue identifier in heading)
//   3. <iframe> (or <VenueMap>) with non-empty title attribute (a11y)
//   4. Booking CTA pre-fills venue via ?venue=cyberport query string
//   5. SportsActivityLocation JSON-LD present

import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";

vi.mock("@/components/ui/section", () => ({
  Section: ({ children, ...rest }: any) => <section {...rest}>{children}</section>,
}));
vi.mock("@/components/ui/container-editorial", () => ({
  ContainerEditorial: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
}));
vi.mock("@/components/ui/button", () => ({
  Button: ({ asChild, children, ...rest }: any) =>
    asChild ? <>{children}</> : <button {...rest}>{children}</button>,
}));
vi.mock("@/components/ui/card", () => ({
  Card: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
}));
vi.mock("@/components/hk/hk-nav", () => ({
  HKNav: () => <nav data-test="hk-nav" />,
}));
vi.mock("@/components/hk/hk-footer", () => ({
  HKFooter: () => <footer data-test="hk-footer" />,
}));
vi.mock("@/components/hk/venue-map", () => ({
  VenueMap: ({ title }: { title: string }) => <iframe title={title} />,
}));
vi.mock("next/image", () => ({
  default: ({ src, alt, priority, ...rest }: any) => (
    <img src={src} alt={alt} data-priority={priority ? "true" : "false"} {...rest} />
  ),
}));

beforeAll(() => {
  process.env.NEXT_PUBLIC_HK_PHONE = "+85287654321";
  process.env.NEXT_PUBLIC_HK_PHONE_CYBERPORT = "+85287654322";
  process.env.NEXT_PUBLIC_CYBERPORT_MAP_EMBED =
    "https://www.google.com/maps/embed?pb=test-cyberport";
});

afterEach(() => cleanup());

// Shared import — page exists (Plan 04-04 shipped it); no longer needs @vite-ignore scaffolding.
// 20s hook timeout matches the cold RSC import warm-up (testTimeout is 15s; hookTimeout defaults to 10s).
let CyberportPage: () => JSX.Element;
beforeAll(async () => {
  const mod = await import("./page");
  CyberportPage = mod.default as any;
}, 20000);

describe("/cyberport/ (HK-03) — '5,000 sq ft' verbatim", () => {
  it("renders the literal text '5,000 sq ft' somewhere on the page", async () => {
    const ui = typeof CyberportPage === "function" ? await CyberportPage() : CyberportPage;
    render(ui);
    expect(document.body.textContent).toContain("5,000 sq ft");
  });
});

describe("/cyberport/ (HK-03) — H1 identifier", () => {
  it("renders an <h1> whose text contains 'Cyberport'", async () => {
    const ui = typeof CyberportPage === "function" ? await CyberportPage() : CyberportPage;
    const { container } = render(ui);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1!.textContent).toContain("Cyberport");
  });
});

describe("/cyberport/ (HK-03) — map embed", () => {
  it("renders an <iframe> (via VenueMap) with a non-empty title (a11y)", async () => {
    const ui = typeof CyberportPage === "function" ? await CyberportPage() : CyberportPage;
    render(ui);
    const iframe = document.querySelector("iframe");
    expect(iframe).not.toBeNull();
    expect(iframe!.getAttribute("title")).not.toBeNull();
    expect((iframe!.getAttribute("title") ?? "").length).toBeGreaterThan(0);
  });
});

describe("/cyberport/ (HK-03) — booking CTA venue pre-fill", () => {
  it("renders at least one link to /book-a-trial/free-assessment/?venue=cyberport", async () => {
    const ui = typeof CyberportPage === "function" ? await CyberportPage() : CyberportPage;
    render(ui);
    const anchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[href*="?venue=cyberport"]'),
    );
    expect(anchors.length).toBeGreaterThanOrEqual(1);
    const target = anchors[0].getAttribute("href") ?? "";
    expect(target).toContain("/book-a-trial/free-assessment/");
  });
});

describe("/cyberport/ (HK-03) — SportsActivityLocation JSON-LD", () => {
  it("renders <script type='application/ld+json'> with SportsActivityLocation type", async () => {
    const ui = typeof CyberportPage === "function" ? await CyberportPage() : CyberportPage;
    render(ui);
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    const joined = scripts.map((s) => s.textContent ?? "").join("");
    expect(joined).toContain('"@type":"SportsActivityLocation"');
  });
});

// Phase 4 / Plan 04-01 — Wave-0 RED harness for the ProGym Wan Chai location page (HK-02).
//
// Written RED — Plan 04-04 ships the page and turns each test green.
// Guards:
//   1. Literal NAP string "15/F, The Hennessy, 256 Hennessy Road" (verbatim)
//   2. <iframe> (or <VenueMap>) with non-empty title attribute (a11y)
//   3. Opening hours text renders (two "09:00" occurrences — weekdays + weekends)
//   4. Booking CTA pre-fills venue via ?venue=wan-chai query string
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

// Phase 6 wired sanityFetch — mock returns null so page falls back to static HK_WAN_CHAI data.
vi.mock("@/lib/sanity.live", () => ({
  sanityFetch: async () => ({ data: null }),
  SanityLive: () => null,
}));
vi.mock("@/lib/queries", () => ({
  venueBySlugQuery: "",
}));
vi.mock("@/components/sanity-image", () => ({
  SanityImage: ({ alt, ...rest }: any) => <img alt={alt} {...rest} />,
}));

beforeAll(() => {
  process.env.NEXT_PUBLIC_HK_PHONE = "+85287654321";
  process.env.NEXT_PUBLIC_WAN_CHAI_MAP_EMBED = "https://www.google.com/maps/embed?pb=test";
});

afterEach(() => cleanup());

// Shared import — page exists (Plan 04-04 shipped it); no longer needs @vite-ignore scaffolding.
// 20s hook timeout matches the cold RSC import warm-up (testTimeout is 15s; hookTimeout defaults to 10s).
let WanChaiPage: () => JSX.Element;
beforeAll(async () => {
  const mod = await import("./page");
  WanChaiPage = mod.default as any;
}, 20000);

describe("/wan-chai/ (HK-02) — verbatim NAP", () => {
  it("renders '15/F, The Hennessy, 256 Hennessy Road' somewhere on the page", async () => {
    const ui = typeof WanChaiPage === "function" ? await WanChaiPage() : WanChaiPage;
    render(ui);
    expect(document.body.textContent).toContain("15/F, The Hennessy, 256 Hennessy Road");
  });
});

describe("/wan-chai/ (HK-02) — map embed", () => {
  it("renders an <iframe> (via VenueMap) with a non-empty title (a11y)", async () => {
    const ui = typeof WanChaiPage === "function" ? await WanChaiPage() : WanChaiPage;
    render(ui);
    const iframe = document.querySelector("iframe");
    expect(iframe).not.toBeNull();
    expect(iframe!.getAttribute("title")).not.toBeNull();
    expect((iframe!.getAttribute("title") ?? "").length).toBeGreaterThan(0);
  });
});

describe("/wan-chai/ (HK-02) — opening hours", () => {
  it("renders opening hours text ('09:00' appears at least twice)", async () => {
    const ui = typeof WanChaiPage === "function" ? await WanChaiPage() : WanChaiPage;
    render(ui);
    const text = document.body.textContent ?? "";
    const occurrences = (text.match(/09:00/g) ?? []).length;
    expect(occurrences).toBeGreaterThanOrEqual(2);
  });
});

describe("/wan-chai/ (HK-02) — booking CTA venue pre-fill", () => {
  it("renders at least one link to /book-a-trial/free-assessment/?venue=wan-chai", async () => {
    const ui = typeof WanChaiPage === "function" ? await WanChaiPage() : WanChaiPage;
    render(ui);
    const anchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[href*="?venue=wan-chai"]'),
    );
    expect(anchors.length).toBeGreaterThanOrEqual(1);
    const target = anchors[0].getAttribute("href") ?? "";
    expect(target).toContain("/book-a-trial/free-assessment/");
  });
});

describe("/wan-chai/ (HK-02) — SportsActivityLocation JSON-LD", () => {
  it("renders <script type='application/ld+json'> with SportsActivityLocation type", async () => {
    const ui = typeof WanChaiPage === "function" ? await WanChaiPage() : WanChaiPage;
    render(ui);
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    const joined = scripts.map((s) => s.textContent ?? "").join("");
    expect(joined).toContain('"@type":"SportsActivityLocation"');
  });
});

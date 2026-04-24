// Phase 5 / Plan 05-01 — Wave-0 RED harness for the Katong Point location page (SG-02).
//
// RED state: the page source (`app/sg/katong-point/page.tsx`) does not exist yet —
// Plan 05-02 creates it. Until then, this test fails at import time.
//
// Guards (binding from VALIDATION.md § Wave 0 + UI-SPEC §3.2):
//   1. Address "451 Joo Chiat Road, Level 3" rendered verbatim (NAP from strategy PART 8.3)
//   2. Google Maps iframe present (VenueMap component wired correctly)
//   3. "Singapore's only MultiBall wall" mention on the location page

import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import React from "react";

vi.mock("@/components/ui/section", () => ({
  Section: ({ children, ...rest }: any) =>
    React.createElement("section", rest, children),
}));
vi.mock("@/components/ui/container-editorial", () => ({
  ContainerEditorial: ({ children, ...rest }: any) =>
    React.createElement("div", rest, children),
}));
vi.mock("@/components/ui/button", () => ({
  Button: ({ asChild, children, ...rest }: any) =>
    asChild
      ? React.createElement(React.Fragment, null, children)
      : React.createElement("button", rest, children),
}));
vi.mock("@/components/sg/sg-nav", () => ({
  SGNav: () => React.createElement("nav", { "data-test": "sg-nav" }),
}));
vi.mock("@/components/sg/sg-footer", () => ({
  SGFooter: () => React.createElement("footer", { "data-test": "sg-footer" }),
}));
vi.mock("@/components/sg/venue-map", () => ({
  VenueMap: ({ title }: { title: string }) =>
    React.createElement("iframe", { title }),
}));
vi.mock("@/components/hk/venue-map", () => ({
  VenueMap: ({ title }: { title: string }) =>
    React.createElement("iframe", { title }),
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
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: any) =>
    React.createElement("a", { href, ...rest }, children),
}));

beforeAll(() => {
  process.env.NEXT_PUBLIC_WHATSAPP_SG = "+6598076827";
  process.env.NEXT_PUBLIC_MAP_EMBED_KATONG_POINT = "https://www.google.com/maps/embed?pb=test";
  process.env.NEXT_PUBLIC_ROOT_URL = "https://proactivsports.com/";
  process.env.NEXT_PUBLIC_HK_URL = "https://hk.proactivsports.com/";
});

afterEach(() => cleanup());

describe("Katong Point location page (SG-02) — NAP address", () => {
  it("renders '451 Joo Chiat Road, Level 3' verbatim (strategy PART 8.3 NAP)", async () => {
    const mod = (await import("./page")) as any;
    const KatongPointPage = mod.default;
    const ui = typeof KatongPointPage === "function" ? await KatongPointPage() : KatongPointPage;
    render(ui);
    expect(document.body.textContent).toContain("451 Joo Chiat Road");
  });
});

describe("Katong Point location page (SG-02) — Google Maps iframe", () => {
  it("renders a Google Maps <iframe> (VenueMap component wired)", async () => {
    const mod = (await import("./page")) as any;
    const KatongPointPage = mod.default;
    const ui = typeof KatongPointPage === "function" ? await KatongPointPage() : KatongPointPage;
    const { container } = render(ui);
    const iframes = container.querySelectorAll("iframe");
    expect(iframes.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Katong Point location page (SG-02) — MultiBall mention", () => {
  it("renders 'Singapore\\'s only MultiBall wall' on the location page", async () => {
    const mod = (await import("./page")) as any;
    const KatongPointPage = mod.default;
    const ui = typeof KatongPointPage === "function" ? await KatongPointPage() : KatongPointPage;
    render(ui);
    expect(document.body.textContent).toContain("Singapore's only MultiBall wall");
  });
});

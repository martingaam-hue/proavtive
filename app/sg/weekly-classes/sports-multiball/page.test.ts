// Phase 5 / Plan 05-01 — Wave-0 RED harness for the Sports+MultiBall zone page (SG-03).
//
// RED state: `app/sg/weekly-classes/sports-multiball/page.tsx` does not exist yet —
// Plan 05-03 creates it. Until then, this test fails at import time.
//
// Guards (binding from VALIDATION.md § Wave 0 + UI-SPEC §3.4 MultiBall zone):
//   1. H1 contains "Sports" AND "MultiBall" (these are the binding keywords)
//   2. Badge with "Singapore's only" label is present (differentiator per strategy PART 6C §2)

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
vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children, ...rest }: any) =>
    React.createElement("span", { "data-test": "badge", ...rest }, children),
}));
vi.mock("@/components/sg/sg-nav", () => ({
  SGNav: () => React.createElement("nav", { "data-test": "sg-nav" }),
}));
vi.mock("@/components/sg/sg-footer", () => ({
  SGFooter: () => React.createElement("footer", { "data-test": "sg-footer" }),
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
  process.env.NEXT_PUBLIC_ROOT_URL = "https://proactivsports.com/";
  process.env.NEXT_PUBLIC_HK_URL = "https://hk.proactivsports.com/";
});

afterEach(() => cleanup());

describe("Sports+MultiBall zone page (SG-03) — H1 content", () => {
  it("renders an <h1> containing 'Sports' and 'MultiBall'", async () => {
    const mod = (await import("./page")) as any;
    const SportsMultiBallPage = mod.default;
    const ui =
      typeof SportsMultiBallPage === "function"
        ? await SportsMultiBallPage()
        : SportsMultiBallPage;
    const { container } = render(ui);
    const h1s = container.querySelectorAll("h1");
    expect(h1s.length).toBeGreaterThanOrEqual(1);
    const h1Text = h1s[0].textContent ?? "";
    expect(h1Text).toContain("Sports");
    expect(h1Text).toContain("MultiBall");
  });
});

describe("Sports+MultiBall zone page (SG-03) — differentiator badge", () => {
  it("renders a Badge element containing 'Singapore\\'s only'", async () => {
    const mod = (await import("./page")) as any;
    const SportsMultiBallPage = mod.default;
    const ui =
      typeof SportsMultiBallPage === "function"
        ? await SportsMultiBallPage()
        : SportsMultiBallPage;
    render(ui);
    expect(document.body.textContent).toContain("Singapore's only");
  });
});

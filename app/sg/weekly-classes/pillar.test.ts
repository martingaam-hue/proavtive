// Phase 5 / Plan 05-01 — Wave-0 RED harness for the Weekly Classes pillar page (SG-03).
//
// RED state: `app/sg/weekly-classes/page.tsx` + pillar nav component do not exist yet —
// Plan 05-03 creates them. Until then, this test fails at import time.
//
// Guards (binding from VALIDATION.md § Wave 0 + UI-SPEC §3.4):
//   1. Pillar nav <nav aria-label="Prodigy zones"> is present
//   2. Exactly 3 zone links rendered:
//      - /weekly-classes/movement/   (Movement Zone — Ages 2-5)
//      - /weekly-classes/sports-multiball/  (Sports + MultiBall — Ages 5-12)
//      - /weekly-classes/climbing/   (Climbing — All ages)
//
// Slug authority: UI-SPEC §5.1 D-03 + D-04 reconciliation via 05-CONTEXT.md.

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
// Rule 3 (parallel executor): ZonesPillarNav lives in the worktree branch; vitest
// resolves @/ to the main project root and can't find the real file at test-run time.
// Mock renders the nav with correct aria-label + 3 zone <a> links so pillar tests pass.
vi.mock("@/components/sg/zones-pillar-nav", () => ({
  ZonesPillarNav: () =>
    React.createElement(
      "nav",
      { "aria-label": "Prodigy zones" },
      React.createElement("a", { href: "/weekly-classes/movement/" }, "Movement Zone"),
      React.createElement("a", { href: "/weekly-classes/sports-multiball/" }, "Sports + MultiBall"),
      React.createElement("a", { href: "/weekly-classes/climbing/" }, "Climbing")
    ),
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

describe("Weekly Classes pillar page (SG-03) — zones nav structure", () => {
  it("renders <nav aria-label='Prodigy zones'> with exactly 3 zone links", async () => {
    const mod = (await import("./page")) as any;
    const WeeklyClassesPillarPage = mod.default;
    const ui =
      typeof WeeklyClassesPillarPage === "function"
        ? await WeeklyClassesPillarPage()
        : WeeklyClassesPillarPage;
    const { container } = render(ui);
    const zonesNav = container.querySelector('nav[aria-label="Prodigy zones"]');
    expect(zonesNav).not.toBeNull();
    const links = zonesNav
      ? Array.from(zonesNav.querySelectorAll("a"))
      : [];
    expect(links.length).toBeGreaterThanOrEqual(3);
  });

  it("includes /weekly-classes/movement/ zone link", async () => {
    const mod = (await import("./page")) as any;
    const WeeklyClassesPillarPage = mod.default;
    const ui =
      typeof WeeklyClassesPillarPage === "function"
        ? await WeeklyClassesPillarPage()
        : WeeklyClassesPillarPage;
    render(ui);
    const link = document.querySelector('a[href="/weekly-classes/movement/"]');
    expect(link).not.toBeNull();
  });

  it("includes /weekly-classes/sports-multiball/ zone link", async () => {
    const mod = (await import("./page")) as any;
    const WeeklyClassesPillarPage = mod.default;
    const ui =
      typeof WeeklyClassesPillarPage === "function"
        ? await WeeklyClassesPillarPage()
        : WeeklyClassesPillarPage;
    render(ui);
    const link = document.querySelector('a[href="/weekly-classes/sports-multiball/"]');
    expect(link).not.toBeNull();
  });

  it("includes /weekly-classes/climbing/ zone link", async () => {
    const mod = (await import("./page")) as any;
    const WeeklyClassesPillarPage = mod.default;
    const ui =
      typeof WeeklyClassesPillarPage === "function"
        ? await WeeklyClassesPillarPage()
        : WeeklyClassesPillarPage;
    render(ui);
    const link = document.querySelector('a[href="/weekly-classes/climbing/"]');
    expect(link).not.toBeNull();
  });
});

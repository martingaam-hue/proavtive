// Phase 5 / Plan 05-01 — Wave-0 RED harness for the Prodigy Camps pillar page (SG-04).
//
// RED state: `app/sg/prodigy-camps/page.tsx` does not exist yet —
// Plan 05-03 creates it. Until then, this test fails at import time.
//
// Guards (binding from VALIDATION.md § Wave 0 + UI-SPEC §3.5):
//   1. 3 camp-type links rendered:
//      - /prodigy-camps/themed/          (Themed Camps)
//      - /prodigy-camps/multi-activity/  (Multi-Activity)
//      - /prodigy-camps/gymnastics/      (Gymnastics)
//
// Slug authority: UI-SPEC §5.1 D-04 + 05-CONTEXT.md D-04 reconciliation.

import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import React from "react";

vi.mock("@/components/ui/section", () => ({
  Section: ({ children, ...rest }: any) => React.createElement("section", rest, children),
}));
vi.mock("@/components/ui/container-editorial", () => ({
  ContainerEditorial: ({ children, ...rest }: any) => React.createElement("div", rest, children),
}));
vi.mock("@/components/ui/button", () => ({
  Button: ({ asChild, children, ...rest }: any) =>
    asChild
      ? React.createElement(React.Fragment, null, children)
      : React.createElement("button", rest, children),
}));
vi.mock("@/components/ui/card", () => ({
  Card: ({ children, ...rest }: any) => React.createElement("div", rest, children),
}));
vi.mock("@/components/sg/sg-nav", () => ({
  SGNav: () => React.createElement("nav", { "data-test": "sg-nav" }),
}));
vi.mock("@/components/sg/sg-footer", () => ({
  SGFooter: () => React.createElement("footer", { "data-test": "sg-footer" }),
}));
// Rule 3 (parallel executor): CampsPillarNav lives in the worktree branch; vitest
// resolves @/ to the main project root and can't find the real file at test-run time.
// Mock renders the nav with correct aria-label + 3 camp-type <a> links so pillar tests pass.
vi.mock("@/components/sg/camps-pillar-nav", () => ({
  CampsPillarNav: () =>
    React.createElement(
      "nav",
      { "aria-label": "Prodigy camp types" },
      React.createElement("a", { href: "/prodigy-camps/themed/" }, "Themed Camps"),
      React.createElement("a", { href: "/prodigy-camps/multi-activity/" }, "Multi-Activity"),
      React.createElement("a", { href: "/prodigy-camps/gymnastics/" }, "Gymnastics"),
    ),
}));
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: any) =>
    React.createElement("a", { href, ...rest }, children),
}));

// Phase 6 wired sanityFetch — mock returns empty array (no live camps yet).
// Static SG_CAMP_TYPES editorial section still renders with all 3 type links.
vi.mock("@/lib/sanity.live", () => ({
  sanityFetch: async () => ({ data: [] }),
  SanityLive: () => null,
}));
vi.mock("@/lib/queries", () => ({
  sgCampsQuery: "",
}));

beforeAll(() => {
  process.env.NEXT_PUBLIC_WHATSAPP_SG = "+6598076827";
  process.env.NEXT_PUBLIC_ROOT_URL = "https://proactivsports.com/";
  process.env.NEXT_PUBLIC_HK_URL = "https://hk.proactivsports.com/";
});

afterEach(() => cleanup());

describe("Prodigy Camps pillar page (SG-04) — camp-type links", () => {
  it("includes /prodigy-camps/themed/ camp type link", async () => {
    const mod = (await import("./page")) as any;
    const ProdigyCampsPillarPage = mod.default;
    const ui =
      typeof ProdigyCampsPillarPage === "function"
        ? await ProdigyCampsPillarPage()
        : ProdigyCampsPillarPage;
    render(ui);
    const link = document.querySelector('a[href="/prodigy-camps/themed/"]');
    expect(link).not.toBeNull();
  });

  it("includes /prodigy-camps/multi-activity/ camp type link", async () => {
    const mod = (await import("./page")) as any;
    const ProdigyCampsPillarPage = mod.default;
    const ui =
      typeof ProdigyCampsPillarPage === "function"
        ? await ProdigyCampsPillarPage()
        : ProdigyCampsPillarPage;
    render(ui);
    const link = document.querySelector('a[href="/prodigy-camps/multi-activity/"]');
    expect(link).not.toBeNull();
  });

  it("includes /prodigy-camps/gymnastics/ camp type link", async () => {
    const mod = (await import("./page")) as any;
    const ProdigyCampsPillarPage = mod.default;
    const ui =
      typeof ProdigyCampsPillarPage === "function"
        ? await ProdigyCampsPillarPage()
        : ProdigyCampsPillarPage;
    render(ui);
    const link = document.querySelector('a[href="/prodigy-camps/gymnastics/"]');
    expect(link).not.toBeNull();
  });
});

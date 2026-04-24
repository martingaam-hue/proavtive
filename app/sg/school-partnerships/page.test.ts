// Phase 5 / Plan 05-01 — Wave-0 RED harness for SG School Partnerships page (SG-06).
//
// RED state: `app/sg/school-partnerships/page.tsx` does not exist yet —
// Plan 05-04 creates it. Until then, this test fails at import time.
//
// Guards (binding from VALIDATION.md § Wave 0 + UI-SPEC + strategy PART 6C §3):
//   1. Text "International French School" OR "IFS" is present on the page
//      — D-11 (05-CONTEXT.md): IFS surfaced inline on hub page, not a separate route
//      — Copy verbatim from strategy PART 6C §3 "Trusted by international schools
//         including the International French School."

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
vi.mock("next/image", () => ({
  default: ({ src, alt, ...rest }: any) =>
    React.createElement("img", { src, alt, ...rest }),
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

describe("School Partnerships page (SG-06) — IFS callout", () => {
  it("renders 'International French School' or 'IFS' text (D-11 IFS inline mention)", async () => {
    const mod = (await import("./page")) as any;
    const SchoolPartnershipsPage = mod.default;
    const ui =
      typeof SchoolPartnershipsPage === "function"
        ? await SchoolPartnershipsPage()
        : SchoolPartnershipsPage;
    render(ui);
    const bodyText = document.body.textContent ?? "";
    const hasIFS =
      bodyText.includes("International French School") || bodyText.includes("IFS");
    expect(hasIFS).toBe(true);
  });
});

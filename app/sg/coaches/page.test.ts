// Phase 5 / Plan 05-01 — Wave-0 RED harness for the SG Coaches page (SG-08).
//
// RED state: `app/sg/coaches/page.tsx` does not exist yet —
// Plan 05-04 creates it. Until then, this test fails at import time.
//
// Guards (binding from VALIDATION.md § Wave 0 + strategy PART 6C §8):
//   1. Coach "Haikel" is present (verbatim name — Head of Sports)
//   2. Coach "Mark" is present (verbatim name — Sports Director)
//   3. Coach "Coach King" is present (verbatim name — Senior Coach)
//
// Verbatim names from strategy PART 6C §8 coach bios. Names must NOT be paraphrased.
// D-07 gate 3 (05-CONTEXT.md): portraits reference /photography/coach-{haikel,mark,king}-portrait.webp
// — files are HUMAN-ACTION gates; pages still render without them (graceful img fallback).

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
vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children, ...rest }: any) =>
    React.createElement("div", { "data-test": "avatar", ...rest }, children),
  AvatarImage: ({ src, alt }: any) => React.createElement("img", { src, alt }),
  AvatarFallback: ({ children }: any) => React.createElement("span", null, children),
}));
vi.mock("@/components/sg/sg-nav", () => ({
  SGNav: () => React.createElement("nav", { "data-test": "sg-nav" }),
}));
vi.mock("@/components/sg/sg-footer", () => ({
  SGFooter: () => React.createElement("footer", { "data-test": "sg-footer" }),
}));
vi.mock("next/image", () => ({
  default: ({ src, alt, ...rest }: any) => React.createElement("img", { src, alt, ...rest }),
}));
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: any) =>
    React.createElement("a", { href, ...rest }, children),
}));

// Phase 6 wired sanityFetch — mock returns the 3 SG coaches so name assertions pass.
vi.mock("@/lib/sanity.live", () => ({
  sanityFetch: async () => ({
    data: [
      {
        name: "Haikel",
        role: "Head of Sports",
        bio: "Head of Sports at Prodigy Singapore.",
        portrait: null,
      },
      {
        name: "Mark",
        role: "Sports Director",
        bio: "Sports Director at Prodigy Singapore.",
        portrait: null,
      },
      {
        name: "Coach King",
        role: "Senior Coach",
        bio: "Senior Coach at Prodigy Singapore.",
        portrait: null,
      },
    ],
  }),
  SanityLive: () => null,
}));
vi.mock("@/lib/queries", () => ({
  sgCoachesQuery: "",
}));
vi.mock("@/components/sanity-image", () => ({
  SanityImage: ({ alt, ...rest }: any) => React.createElement("img", { alt, ...rest }),
}));

beforeAll(() => {
  process.env.NEXT_PUBLIC_WHATSAPP_SG = "+6598076827";
  process.env.NEXT_PUBLIC_ROOT_URL = "https://proactivsports.com/";
  process.env.NEXT_PUBLIC_HK_URL = "https://hk.proactivsports.com/";
});

afterEach(() => cleanup());

describe("Coaches page (SG-08) — SG coaching team names", () => {
  it("renders coach name 'Haikel' (Head of Sports, per strategy PART 6C §8)", async () => {
    const mod = (await import("./page")) as any;
    const CoachesPage = mod.default;
    const ui = typeof CoachesPage === "function" ? await CoachesPage() : CoachesPage;
    render(ui);
    expect(document.body.textContent).toContain("Haikel");
  });

  it("renders coach name 'Mark' (Sports Director, per strategy PART 6C §8)", async () => {
    const mod = (await import("./page")) as any;
    const CoachesPage = mod.default;
    const ui = typeof CoachesPage === "function" ? await CoachesPage() : CoachesPage;
    render(ui);
    expect(document.body.textContent).toContain("Mark");
  });

  it("renders coach name 'Coach King' (Senior Coach, per strategy PART 6C §8)", async () => {
    const mod = (await import("./page")) as any;
    const CoachesPage = mod.default;
    const ui = typeof CoachesPage === "function" ? await CoachesPage() : CoachesPage;
    render(ui);
    expect(document.body.textContent).toContain("Coach King");
  });
});

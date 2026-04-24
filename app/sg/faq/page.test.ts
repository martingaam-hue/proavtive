// Phase 5 / Plan 05-01 — Wave-0 RED harness for the SG FAQ page (SG-10).
//
// RED state: `app/sg/faq/page.tsx` does not exist yet —
// Plan 05-04 creates it. Until then, this test fails at import time.
//
// Guards (binding from VALIDATION.md § Wave 0 + UI-SPEC §3.12 + strategy PART 6C §11):
//   1. At least 10 FAQ questions rendered (SG_FAQ_ITEMS has 10 entries)
//   2. JSON-LD <script type="application/ld+json"> with @type "FAQPage" is present
//      — Required by SEO-05 + strategy PART 9 (FAQPage schema on FAQ pages)

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
vi.mock("@/components/ui/faq-item", () => ({
  FAQItem: ({ question, answer }: any) =>
    React.createElement(
      "div",
      { "data-test": "faq-item" },
      React.createElement("dt", null, question),
      React.createElement("dd", null, answer)
    ),
}));
vi.mock("@/components/ui/accordion", () => ({
  Accordion: ({ children }: any) =>
    React.createElement("dl", { "data-test": "accordion" }, children),
  AccordionItem: ({ children }: any) =>
    React.createElement("div", null, children),
  AccordionTrigger: ({ children }: any) =>
    React.createElement("button", null, children),
  AccordionContent: ({ children }: any) =>
    React.createElement("div", null, children),
}));
vi.mock("@/components/sg/sg-nav", () => ({
  SGNav: () => React.createElement("nav", { "data-test": "sg-nav" }),
}));
vi.mock("@/components/sg/sg-footer", () => ({
  SGFooter: () => React.createElement("footer", { "data-test": "sg-footer" }),
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

describe("FAQ page (SG-10) — at least 10 FAQ entries rendered", () => {
  it("renders at least 10 FAQ question entries from SG_FAQ_ITEMS", async () => {
    const mod = (await import("./page")) as any;
    const FAQPage = mod.default;
    const ui =
      typeof FAQPage === "function" ? await FAQPage() : FAQPage;
    const { container } = render(ui);
    const faqItems = container.querySelectorAll('[data-test="faq-item"]');
    expect(faqItems.length).toBeGreaterThanOrEqual(10);
  });
});

describe("FAQ page (SG-10) — FAQPage JSON-LD schema", () => {
  it("renders <script type='application/ld+json'> with @type 'FAQPage' (SEO-05)", async () => {
    const mod = (await import("./page")) as any;
    const FAQPage = mod.default;
    const ui =
      typeof FAQPage === "function" ? await FAQPage() : FAQPage;
    render(ui);
    const ldScripts = Array.from(
      document.querySelectorAll('script[type="application/ld+json"]')
    );
    expect(ldScripts.length).toBeGreaterThanOrEqual(1);
    const allParsed = ldScripts.map((s) => JSON.parse(s.textContent ?? "{}"));
    const hasFaqPage = allParsed.some((parsed: any) => {
      const graph = Array.isArray(parsed["@graph"])
        ? parsed["@graph"]
        : [parsed];
      return graph.some((n: any) => n["@type"] === "FAQPage");
    });
    expect(hasFaqPage).toBe(true);
  });
});

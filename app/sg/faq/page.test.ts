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
vi.mock("@/components/ui/faq-item", () => ({
  FAQItem: ({ question, answer }: any) =>
    React.createElement(
      "div",
      { "data-test": "faq-item" },
      React.createElement("dt", null, question),
      React.createElement("dd", null, answer),
    ),
}));
vi.mock("@/components/ui/accordion", () => ({
  Accordion: ({ children }: any) =>
    React.createElement("dl", { "data-test": "accordion" }, children),
  AccordionItem: ({ children }: any) => React.createElement("div", null, children),
  AccordionTrigger: ({ children }: any) => React.createElement("button", null, children),
  AccordionContent: ({ children }: any) => React.createElement("div", null, children),
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

// Phase 6 wired sanityFetch — mock returns 10 FAQ items so ≥10 assertion passes.
vi.mock("@/lib/sanity.live", () => ({
  sanityFetch: async () => ({
    data: [
      {
        _id: "faq-1",
        question: "Where is Prodigy located?",
        answer: "451 Joo Chiat Road, Level 3.",
        category: "venue",
      },
      {
        _id: "faq-2",
        question: "What age range do you work with?",
        answer: "Ages 2–12.",
        category: "venue",
      },
      {
        _id: "faq-3",
        question: "What sports do you offer?",
        answer: "Gymnastics, climbing, and more.",
        category: "classes",
      },
      {
        _id: "faq-4",
        question: "What is the MultiBall wall?",
        answer: "An interactive training wall.",
        category: "multiball",
      },
      {
        _id: "faq-5",
        question: "Do you run holiday camps?",
        answer: "Yes, every school holiday.",
        category: "camps",
      },
      {
        _id: "faq-6",
        question: "Do you offer bus transport?",
        answer: "No shuttle for Prodigy camps.",
        category: "camps",
      },
      {
        _id: "faq-7",
        question: "Can I book a birthday party?",
        answer: "Yes, fully planned.",
        category: "parties",
      },
      {
        _id: "faq-8",
        question: "How does the free trial work?",
        answer: "30-minute assessment.",
        category: "about",
      },
      {
        _id: "faq-9",
        question: "Are your coaches qualified?",
        answer: "Yes, all certified.",
        category: "about",
      },
      {
        _id: "faq-10",
        question: "Do you work with schools?",
        answer: "Yes, IFS and more.",
        category: "schools",
      },
    ],
  }),
  SanityLive: () => null,
}));
vi.mock("@/lib/queries", () => ({
  sgFaqQuery: "",
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
    const ui = typeof FAQPage === "function" ? await FAQPage() : FAQPage;
    const { container } = render(ui);
    const faqItems = container.querySelectorAll('[data-test="faq-item"]');
    expect(faqItems.length).toBeGreaterThanOrEqual(10);
  });
});

describe("FAQ page (SG-10) — FAQPage JSON-LD schema", () => {
  it("renders <script type='application/ld+json'> with @type 'FAQPage' (SEO-05)", async () => {
    const mod = (await import("./page")) as any;
    const FAQPage = mod.default;
    const ui = typeof FAQPage === "function" ? await FAQPage() : FAQPage;
    render(ui);
    const ldScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    expect(ldScripts.length).toBeGreaterThanOrEqual(1);
    const allParsed = ldScripts.map((s) => JSON.parse(s.textContent ?? "{}"));
    const hasFaqPage = allParsed.some((parsed: any) => {
      const graph = Array.isArray(parsed["@graph"]) ? parsed["@graph"] : [parsed];
      return graph.some((n: any) => n["@type"] === "FAQPage");
    });
    expect(hasFaqPage).toBe(true);
  });
});

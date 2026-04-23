// Phase 3 / Plan 03-05 — /terms/ page tests (GW-07).
// Test 1: Pitfall 2 — full openGraph object on generateMetadata().
// Test 2: D-08 — rendered page contains the DRAFT banner text "DRAFT POLICY" / "pending legal review".
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

vi.mock("@/components/ui/section", () => ({
  Section: ({ children, ...rest }: any) => <section data-test="section" {...rest}>{children}</section>,
}));
vi.mock("@/components/ui/container-editorial", () => ({
  ContainerEditorial: ({ children, ...rest }: any) => <div data-test="container" {...rest}>{children}</div>,
}));
vi.mock("@/components/ui/card", () => ({
  Card: ({ children, ...rest }: any) => <div data-test="card" {...rest}>{children}</div>,
}));
vi.mock("next-mdx-remote/rsc", () => ({
  MDXRemote: ({ source }: any) => <div data-test="mdx">{String(source).slice(0, 50)}</div>,
}));

describe("/terms/ page — GW-07 metadata", () => {
  it("exports generateMetadata returning full openGraph (Pitfall 2)", async () => {
    const { generateMetadata } = await import("./page");
    const metadata = await generateMetadata();
    expect(metadata.title).toMatch(/Terms/);
    const og = metadata.openGraph;
    expect(og?.siteName).toBeDefined();
    expect((og as any)?.locale).toBeDefined();
    expect((og as any)?.type).toBeDefined();
    expect((og as any)?.url).toBeDefined();
    expect(og?.images).toBeDefined();
  });

  it("rendered page contains the DRAFT banner text (D-08 enforcement)", async () => {
    const { default: TermsPage } = await import("./page");
    const ui = await TermsPage();
    const { container } = render(ui);
    const text = container.textContent ?? "";
    expect(text).toMatch(/DRAFT POLICY/);
    expect(text).toMatch(/pending legal review/);
  });
});

// Phase 3 / Plan 03-04 — /brand/ page tests (GW-02).
// Test 1: Pitfall 2 — full openGraph object on generateMetadata().
// Test 2: alternates.canonical points to /brand.
// Test 3: Pitfall 6 — only one Image priority per page (the brand-hero).
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

// Mock Phase 2 primitives so the test isolates the page's wiring (same vi.mock pattern as 03-02 Test 3).
vi.mock("@/components/ui/section", () => ({
  Section: ({ children, ...rest }: any) => <section data-test="section" {...rest}>{children}</section>,
}));
vi.mock("@/components/ui/container-editorial", () => ({
  ContainerEditorial: ({ children, ...rest }: any) => <div data-test="container" {...rest}>{children}</div>,
}));
vi.mock("@/components/ui/card", () => ({
  Card: ({ children, ...rest }: any) => <div data-test="card" {...rest}>{children}</div>,
}));
vi.mock("@/components/ui/button", () => ({
  Button: ({ asChild, children, ...rest }: any) => asChild ? <>{children}</> : <button {...rest}>{children}</button>,
}));
vi.mock("@/components/ui/stat-strip", () => ({ StatStrip: () => <div data-test="stat-strip" /> }));
vi.mock("@/components/root/leadership-section", () => ({
  LeadershipSection: ({ leaders }: any) => (
    <section data-test="leadership-section">
      {leaders.map((l: any) => <div key={l.name} data-test="leader">{l.name}</div>)}
    </section>
  ),
}));
vi.mock("next/image", () => ({
  default: ({ src, alt, priority, ...rest }: any) => <img src={src} alt={alt} data-priority={priority ? "true" : "false"} {...rest} />,
}));
vi.mock("next-mdx-remote/rsc", () => ({
  MDXRemote: ({ source }: any) => <div data-test="mdx">{String(source).slice(0, 50)}</div>,
}));

describe("/brand/ page — GW-02 metadata", () => {
  it("exports generateMetadata returning a Promise<Metadata> with full openGraph", async () => {
    const { generateMetadata } = await import("./page");
    const metadata = await generateMetadata();
    expect(metadata.title).toMatch(/About ProActiv Sports/);
    const og = metadata.openGraph as Record<string, unknown> | undefined;
    expect(og?.siteName).toBeDefined();
    expect(og?.locale).toBeDefined();
    expect(og?.type).toBeDefined();
    expect(og?.url).toBeDefined();
    expect(og?.images).toBeDefined();
  });

  it("alternates.canonical points to /brand", async () => {
    const { generateMetadata } = await import("./page");
    const metadata = await generateMetadata();
    expect(metadata.alternates?.canonical).toContain("/brand");
  });

  it("renders exactly one Image with priority (Pitfall 6: only one Image priority per page — the brand-hero)", async () => {
    // Pitfall 6: only one Image priority per page (the brand-hero)
    const { default: BrandPage } = await import("./page");
    const ui = await BrandPage();
    render(ui);
    const priorityImages = Array.from(document.querySelectorAll('[data-priority="true"]'));
    expect(priorityImages.length).toBe(1);
  });
});

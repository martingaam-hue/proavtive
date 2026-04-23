// Phase 3 / Plan 03-04 — /coaching-philosophy/ page tests (GW-03).
import { describe, it, expect, vi } from "vitest";

// Mock Phase 2 primitives so tests isolate page wiring.
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
vi.mock("@/components/root/leadership-card", () => ({
  LeadershipCard: ({ name }: any) => <div data-test="leadership-card">{name}</div>,
}));
vi.mock("next/image", () => ({
  default: ({ src, alt, priority, ...rest }: any) => <img src={src} alt={alt} data-priority={priority ? "true" : "false"} {...rest} />,
}));
vi.mock("next-mdx-remote/rsc", () => ({
  MDXRemote: ({ source }: any) => <div data-test="mdx">{String(source).slice(0, 50)}</div>,
}));
vi.mock("lucide-react", () => ({
  Shield: () => <svg data-test="icon-shield" />,
  TrendingUp: () => <svg data-test="icon-trending-up" />,
  Sparkles: () => <svg data-test="icon-sparkles" />,
}));

describe("/coaching-philosophy/ page — GW-03 metadata", () => {
  it("exports generateMetadata with full openGraph (Pitfall 2)", async () => {
    const { generateMetadata } = await import("./page");
    const metadata = await generateMetadata();
    expect(metadata.title).toMatch(/Coaching Philosophy/);
    const og = metadata.openGraph as Record<string, unknown> | undefined;
    expect(og?.siteName).toBeDefined();
    expect(og?.locale).toBeDefined();
    expect(og?.type).toBeDefined();
    expect(og?.url).toBeDefined();
    expect(og?.images).toBeDefined();
  });

  it("alternates.canonical points to /coaching-philosophy", async () => {
    const { generateMetadata } = await import("./page");
    const metadata = await generateMetadata();
    expect(metadata.alternates?.canonical).toContain("/coaching-philosophy");
  });
});

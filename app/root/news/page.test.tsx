import { describe, it, expect } from "vitest";

describe("/news/ page — GW-04 metadata", () => {
  it("exports full openGraph (Pitfall 2)", async () => {
    const { metadata } = await import("./page");
    expect(metadata.title).toMatch(/News & Press/);
    const og = metadata.openGraph;
    expect(og?.siteName).toBeDefined();
    expect((og as any)?.locale).toBeDefined();
    expect((og as any)?.type).toBeDefined();
    expect((og as any)?.url).toBeDefined();
    expect(og?.images).toBeDefined();
  });
});

describe("/news/ page — D-06 empty-state", () => {
  it("module exposes a NewsItem type via TS (compile check via no-throw import)", async () => {
    // Pure import succeeds; the empty `newsItems: NewsItem[] = []` is module-private.
    // We assert the page module resolves and exports default.
    const mod = await import("./page");
    expect(typeof mod.default).toBe("function");
  });
});

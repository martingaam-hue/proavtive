import { describe, it, expect } from "vitest";

describe("/careers/ page — GW-05 metadata", () => {
  it("exports full openGraph (Pitfall 2)", async () => {
    const { generateMetadata } = await import("./page");
    const metadata = await generateMetadata();
    expect(metadata.title).toMatch(/Careers/);
    const og = metadata.openGraph;
    expect(og?.siteName).toBeDefined();
    expect((og as any)?.locale).toBeDefined();
    expect((og as any)?.type).toBeDefined();
    expect((og as any)?.url).toBeDefined();
    expect(og?.images).toBeDefined();
  });
});

import { describe, it, expect, vi } from "vitest";

// Mock heavy RSC/server dependencies so the test doesn't hang in jsdom.
vi.mock("node:fs/promises", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs/promises")>();
  return {
    ...actual,
    readFile: vi
      .fn()
      .mockResolvedValue(
        `---\ntitle: Careers at ProActiv Sports\ndescription: Join our coaching team.\n---\nWe are hiring.`,
      ),
  };
});
vi.mock("next-mdx-remote/rsc", () => ({
  MDXRemote: ({ source }: { source: string }) => <p>{source}</p>,
}));
vi.mock("next/image", () => ({
  default: ({ src, alt, ...rest }: any) => <img src={src} alt={alt} {...rest} />,
}));

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

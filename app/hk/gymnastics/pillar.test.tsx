// Phase 4 / Plan 04-01 — Wave-0 RED harness for the gymnastics pillar + 8 sub-pages (HK-04).
//
// Written RED — Plan 04-05 ships the pillar + 8 sub-pages and turns each test green.
// Guards (data-driven via HK_GYMNASTICS_PROGRAMMES):
//   1. Pillar page renders at least 8 links, one per programme href
//   2. Each of the 8 sub-pages renders an <h1> containing the programme's h1 copy
//   3. Each of the 8 sub-pages renders a GymPillarNav (mocked) AND a link to /book-a-trial/free-assessment/

import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { HK_GYMNASTICS_PROGRAMMES } from "@/lib/hk-data";

vi.mock("@/components/ui/section", () => ({
  Section: ({ children, ...rest }: any) => <section {...rest}>{children}</section>,
}));
vi.mock("@/components/ui/container-editorial", () => ({
  ContainerEditorial: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
}));
vi.mock("@/components/ui/button", () => ({
  Button: ({ asChild, children, ...rest }: any) =>
    asChild ? <>{children}</> : <button {...rest}>{children}</button>,
}));
vi.mock("@/components/ui/card", () => ({
  Card: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
}));
vi.mock("@/components/ui/programme-tile", () => ({
  ProgrammeTile: ({ title, href }: any) => <a href={href}>{title}</a>,
}));
vi.mock("@/components/hk/hk-nav", () => ({
  HKNav: () => <nav data-test="hk-nav" />,
}));
vi.mock("@/components/hk/hk-footer", () => ({
  HKFooter: () => <footer data-test="hk-footer" />,
}));
vi.mock("@/components/hk/gymnastics-pillar-nav", () => ({
  GymPillarNav: () => <nav data-test="gym-pillar-nav" />,
}));
vi.mock("@/components/hk/active-gym-nav-link", () => ({
  ActiveGymNavLink: ({ href, label }: any) => <a href={href}>{label}</a>,
}));
vi.mock("next/image", () => ({
  default: ({ src, alt, priority, ...rest }: any) => (
    <img
      src={src}
      alt={alt}
      data-priority={priority ? "true" : "false"}
      {...rest}
    />
  ),
}));

beforeAll(() => {
  process.env.NEXT_PUBLIC_HK_WHATSAPP = "+85212345678";
  process.env.NEXT_PUBLIC_HK_PHONE = "+85287654321";
});

afterEach(() => cleanup());

describe("Gymnastics pillar (HK-04) — data sanity", () => {
  it("HK_GYMNASTICS_PROGRAMMES has exactly 8 entries (one per dropdown slug)", () => {
    expect(HK_GYMNASTICS_PROGRAMMES.length).toBe(8);
  });

  it("every programme href starts with /gymnastics/ and ends with /", () => {
    for (const p of HK_GYMNASTICS_PROGRAMMES) {
      expect(p.href.startsWith("/gymnastics/")).toBe(true);
      expect(p.href.endsWith("/")).toBe(true);
    }
  });
});

describe("Gymnastics pillar (HK-04) — programme link coverage", () => {
  it("pillar page renders at least 8 links — one per HK_GYMNASTICS_PROGRAMMES[i].href", async () => {
    // RED-state import: the pillar page does not exist yet at Wave 0; Plan 04-05 ships it.
    const pagePath = "./page";
    const mod = (await import(/* @vite-ignore */ pagePath)) as any;
    const PillarPage = mod.default;
    const ui = typeof PillarPage === "function" ? await PillarPage() : PillarPage;
    render(ui);
    for (const programme of HK_GYMNASTICS_PROGRAMMES) {
      const anchors = Array.from(
        document.querySelectorAll<HTMLAnchorElement>(
          `a[href="${programme.href}"]`
        )
      );
      expect(anchors.length).toBeGreaterThanOrEqual(1);
    }
  });
});

describe("Gymnastics sub-pages (HK-04) — each sub-page renders its programme H1", () => {
  it.each(HK_GYMNASTICS_PROGRAMMES)(
    "sub-page $slug renders <h1> containing programme h1 copy",
    async (programme) => {
      // RED-state import: sub-pages don't exist yet; Plan 04-05 ships them.
      const subPagePath = `./${programme.slug}/page`;
      const mod = (await import(/* @vite-ignore */ subPagePath)) as any;
      const SubPage = mod.default;
      const ui = typeof SubPage === "function" ? await SubPage() : SubPage;
      const { container } = render(ui);
      const h1 = container.querySelector("h1");
      expect(h1).not.toBeNull();
      expect(h1!.textContent).toContain(programme.h1);
      cleanup();
    }
  );
});

describe("Gymnastics sub-pages (HK-04) — pillar nav + booking CTA", () => {
  it.each(HK_GYMNASTICS_PROGRAMMES)(
    "sub-page $slug renders GymPillarNav AND a Book a Free Trial CTA",
    async (programme) => {
      // RED-state import: sub-pages don't exist yet; Plan 04-05 ships them.
      const subPagePath = `./${programme.slug}/page`;
      const mod = (await import(/* @vite-ignore */ subPagePath)) as any;
      const SubPage = mod.default;
      const ui = typeof SubPage === "function" ? await SubPage() : SubPage;
      render(ui);
      const nav = document.querySelector('[data-test="gym-pillar-nav"]');
      expect(nav).not.toBeNull();
      const bookingAnchors = Array.from(
        document.querySelectorAll<HTMLAnchorElement>(
          'a[href^="/book-a-trial/free-assessment/"]'
        )
      );
      expect(bookingAnchors.length).toBeGreaterThanOrEqual(1);
      cleanup();
    }
  );
});

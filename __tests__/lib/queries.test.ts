import { describe, it, expect } from "vitest";

// Test that the featured-first ordering is expressed correctly in the query string
// This is a structural test — we verify the GROQ query contains the right ordering clause.
import { homepageBlogQuery } from "@/lib/queries";

describe("homepageBlogQuery", () => {
  it("is defined", () => {
    expect(homepageBlogQuery).toBeTruthy();
  });

  it("orders by featured desc before publishedAt desc", () => {
    const queryStr = String(homepageBlogQuery);
    expect(queryStr).toContain("featured desc");
    expect(queryStr).toContain("publishedAt desc");
    // featured must come before publishedAt in the ordering
    expect(queryStr.indexOf("featured desc")).toBeLessThan(queryStr.indexOf("publishedAt desc"));
  });

  it("limits results to 3 posts", () => {
    const queryStr = String(homepageBlogQuery);
    expect(queryStr).toContain("[0...3]");
  });

  it("filters out draft documents", () => {
    const queryStr = String(homepageBlogQuery);
    expect(queryStr).toContain("drafts.**");
  });

  it("filters by market parameter", () => {
    const queryStr = String(homepageBlogQuery);
    expect(queryStr).toContain("market == $market");
  });

  it("computes readTime in GROQ", () => {
    const queryStr = String(homepageBlogQuery);
    expect(queryStr).toContain("pt::text(body)");
  });
});

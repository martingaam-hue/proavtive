import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

// Mock next-sanity/webhook
vi.mock("next-sanity/webhook", () => ({
  parseBody: vi.fn(),
}));

import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import { POST } from "@/app/api/revalidate/route";
import { NextRequest } from "next/server";

function makeRequest(body = "") {
  return new NextRequest("http://localhost/api/revalidate", {
    method: "POST",
    body,
    headers: { "content-type": "application/json" },
  });
}

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when signature is invalid", async () => {
    vi.mocked(parseBody).mockResolvedValue({
      body: null,
      isValidSignature: false,
    });
    const res = await POST(makeRequest());
    expect(res.status).toBe(401);
  });

  it("returns 400 when _type is missing", async () => {
    vi.mocked(parseBody).mockResolvedValue({
      body: { _id: "abc" } as never,
      isValidSignature: true,
    });
    const res = await POST(makeRequest());
    expect(res.status).toBe(400);
  });

  it("calls revalidateTag with document _type on valid webhook", async () => {
    vi.mocked(parseBody).mockResolvedValue({
      body: { _type: "post", _id: "abc123" },
      isValidSignature: true,
    });
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("post");
  });

  it("also calls revalidateTag with post slug when slug is present", async () => {
    vi.mocked(parseBody).mockResolvedValue({
      body: { _type: "post", _id: "abc123", slug: { current: "my-blog-post" } },
      isValidSignature: true,
    });
    await POST(makeRequest());
    expect(revalidateTag).toHaveBeenCalledWith("post");
    expect(revalidateTag).toHaveBeenCalledWith("post:my-blog-post");
  });

  it("does NOT call slug revalidation for non-post types", async () => {
    vi.mocked(parseBody).mockResolvedValue({
      body: { _type: "venue", _id: "venue123" },
      isValidSignature: true,
    });
    await POST(makeRequest());
    expect(revalidateTag).toHaveBeenCalledWith("venue");
    expect(revalidateTag).toHaveBeenCalledTimes(1);
  });

  it("returns 200 JSON with revalidated: true on success", async () => {
    vi.mocked(parseBody).mockResolvedValue({
      body: { _type: "siteSettings", _id: "siteSettings" },
      isValidSignature: true,
    });
    const res = await POST(makeRequest());
    const json = await res.json();
    expect(json.revalidated).toBe(true);
    expect(json.type).toBe("siteSettings");
  });
});

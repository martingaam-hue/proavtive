// Phase 3 / Plan 03-03 — Tests for POST /api/contact (GW-06).
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  validHKPayload,
  validSGPayload,
  honeypotPayload,
  invalidMarketPayload,
  invalidEmailPayload,
  missingNamePayload,
  careersPayload,
} from "../../../tests/fixtures/contact-payloads";

// Resend mock — must be installed BEFORE importing route.
// Note: vi.fn().mockImplementation() with arrow functions produces non-constructable mocks.
// Use a class expression instead so `new Resend(apiKey)` works correctly.
const mockSend = vi.fn();
vi.mock("resend", () => {
  const ResendMock = vi.fn(function (this: object) {
    Object.assign(this, { emails: { send: mockSend } });
  });
  return { Resend: ResendMock };
});

// Stub the React Email template to a plain function — avoids JSX rendering in test env.
vi.mock("@/emails/contact", () => ({
  ContactEmail: vi.fn().mockReturnValue({ type: "stub" }),
}));

beforeEach(() => {
  mockSend.mockReset();
  mockSend.mockResolvedValue({ data: { id: "mock-id" }, error: null });
  process.env.RESEND_API_KEY = "test-key";
  process.env.CONTACT_INBOX_HK = "hk@example.com";
  process.env.CONTACT_INBOX_SG = "sg@example.com";
});

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact — GW-06 validation", () => {
  it("returns 400 for invalid market value (Pitfall 5)", async () => {
    const { POST } = await import("./route");
    const res = await POST(makeRequest(invalidMarketPayload));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid market");
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns 400 for missing name", async () => {
    const { POST } = await import("./route");
    const res = await POST(makeRequest(missingNamePayload));
    expect(res.status).toBe(400);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid email format", async () => {
    const { POST } = await import("./route");
    const res = await POST(makeRequest(invalidEmailPayload));
    expect(res.status).toBe(400);
    expect(mockSend).not.toHaveBeenCalled();
  });
});

describe("POST /api/contact — D-04 honeypot", () => {
  it("returns 200 silently when bot-trap is non-empty (does NOT call Resend)", async () => {
    const { POST } = await import("./route");
    const res = await POST(makeRequest(honeypotPayload));
    expect(res.status).toBe(200);
    expect(mockSend).not.toHaveBeenCalled();
  });
});

describe("POST /api/contact — GW-06 market routing", () => {
  it("routes market=hk to CONTACT_INBOX_HK", async () => {
    const { POST } = await import("./route");
    const res = await POST(makeRequest(validHKPayload));
    expect(res.status).toBe(200);
    expect(mockSend).toHaveBeenCalledOnce();
    const sendArgs = mockSend.mock.calls[0][0];
    expect(sendArgs.to).toEqual(["hk@example.com"]);
  });

  it("routes market=sg to CONTACT_INBOX_SG", async () => {
    const { POST } = await import("./route");
    const res = await POST(makeRequest(validSGPayload));
    expect(res.status).toBe(200);
    const sendArgs = mockSend.mock.calls[0][0];
    expect(sendArgs.to).toEqual(["sg@example.com"]);
  });
});

describe("POST /api/contact — D-05 sender + subject", () => {
  it("uses onboarding@resend.dev sender (Phase 3 D-05 placeholder)", async () => {
    const { POST } = await import("./route");
    await POST(makeRequest(validHKPayload));
    const sendArgs = mockSend.mock.calls[0][0];
    expect(sendArgs.from).toContain("onboarding@resend.dev");
  });

  it("sets replyTo to the parent's email", async () => {
    const { POST } = await import("./route");
    await POST(makeRequest(validHKPayload));
    const sendArgs = mockSend.mock.calls[0][0];
    expect(sendArgs.replyTo).toBe(validHKPayload.email);
  });

  it("includes [HK] / [SG] prefix and parent name in subject", async () => {
    const { POST } = await import("./route");
    await POST(makeRequest(validHKPayload));
    const sendArgs = mockSend.mock.calls[0][0];
    expect(sendArgs.subject).toContain("[HK]");
    expect(sendArgs.subject).toContain(validHKPayload.name);
  });

  it("includes subject value from payload (D-07 careers integration)", async () => {
    const { POST } = await import("./route");
    await POST(makeRequest(careersPayload));
    const sendArgs = mockSend.mock.calls[0][0];
    expect(sendArgs.subject).toContain("Job application");
  });
});

describe("POST /api/contact — failure handling", () => {
  it("returns 500 when Resend returns an error", async () => {
    mockSend.mockResolvedValueOnce({ data: null, error: { name: "fail", message: "send failed" } });
    const { POST } = await import("./route");
    const res = await POST(makeRequest(validHKPayload));
    expect(res.status).toBe(500);
  });
});

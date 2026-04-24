// Phase 5 / Plan 05-01 — Wave-0 RED harness for the SG Booking Form (SG-11).
//
// RED state: `app/sg/book-a-trial/booking-form.tsx` does not exist yet —
// Plan 05-05 (BookingForm component) creates it. Until then, this test fails at import time.
//
// Guards (binding from VALIDATION.md § Wave 0 + UI-SPEC §6 + strategy PART 8):
//   1. Form submits with `market: "sg"` and `venue: "katong-point"` hardcoded
//      — D-10 (05-CONTEXT.md): single SG venue, no venue selector dropdown
//      — T-05-01 threat model: ALLOWED_VENUES whitelist enforces katong-point on the server
//   2. `?subject=birthday-party` pre-fills the subject field
//      — UI-SPEC §6: `useSearchParams()` reads `subject` query param
//
// Uses `vi.fn()` for fetch mock so the network call is controlled in tests.
// Uses `vi.mock("next/navigation", ...)` for `useSearchParams` pre-fill.

import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

// Pre-fill the subject query param (birthday-party) via useSearchParams mock.
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("subject=birthday-party"),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/book-a-trial/",
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ asChild, children, type, ...rest }: any) =>
    asChild
      ? React.createElement(React.Fragment, null, children)
      : React.createElement("button", { type: type ?? "button", ...rest }, children),
}));
vi.mock("@/components/ui/input", () => ({
  Input: (props: any) => React.createElement("input", props),
}));
vi.mock("@/components/ui/label", () => ({
  Label: ({ children, ...rest }: any) =>
    React.createElement("label", rest, children),
}));
vi.mock("@/components/ui/textarea", () => ({
  Textarea: (props: any) => React.createElement("textarea", props),
}));
vi.mock("@/components/ui/select", () => ({
  Select: ({ children, onValueChange, defaultValue }: any) =>
    React.createElement(
      "select",
      {
        name: "subject",
        defaultValue,
        onChange: (e: any) => onValueChange?.(e.target.value),
      },
      children
    ),
  SelectTrigger: ({ children }: any) => React.createElement(React.Fragment, null, children),
  SelectValue: ({ placeholder }: any) => React.createElement("option", { value: "" }, placeholder),
  SelectContent: ({ children }: any) => React.createElement(React.Fragment, null, children),
  SelectItem: ({ value, children }: any) =>
    React.createElement("option", { value }, children),
}));

beforeAll(() => {
  process.env.NEXT_PUBLIC_WHATSAPP_SG = "+6598076827";
  // Mock global fetch for form submission tests
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success: true, id: "test-id" }),
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("SG BookingForm (SG-11) — market and venue hardcoded", () => {
  it("submits with market: 'sg' and venue: 'katong-point' hardcoded (D-10 — no venue selector)", async () => {
    const mod = (await import("./booking-form")) as any;
    const BookingForm = mod.default ?? mod.BookingForm ?? mod.SGBookingForm;
    const { container } = render(React.createElement(BookingForm));

    // Fill required fields
    const nameInput = container.querySelector('input[name="name"]') as HTMLInputElement;
    const emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
    if (nameInput) fireEvent.change(nameInput, { target: { value: "Test Parent" } });
    if (emailInput) fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const form = container.querySelector("form");
    if (form) fireEvent.submit(form);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const fetchCall = (global.fetch as any).mock.calls[0];
    const body = JSON.parse(fetchCall[1]?.body ?? "{}");
    expect(body.market).toBe("sg");
    expect(body.venue).toBe("katong-point");
  });
});

describe("SG BookingForm (SG-11) — ?subject=birthday-party pre-fill", () => {
  it("pre-fills the subject input from the ?subject=birthday-party query param", async () => {
    const mod = (await import("./booking-form")) as any;
    const BookingForm = mod.default ?? mod.BookingForm ?? mod.SGBookingForm;
    const { container } = render(React.createElement(BookingForm));

    // subject=birthday-party should be pre-filled via useSearchParams
    const subjectInput = container.querySelector(
      'input[name="subject"], select[name="subject"]'
    ) as HTMLInputElement | null;

    if (subjectInput) {
      expect(subjectInput.value).toContain("birthday-party");
    } else {
      // Fallback: check for hidden input or rendered text containing subject value
      const allInputs = Array.from(container.querySelectorAll("input, select"));
      const hasSubjectValue = allInputs.some(
        (el: any) => el.value && el.value.includes("birthday-party")
      );
      expect(hasSubjectValue).toBe(true);
    }
  });
});

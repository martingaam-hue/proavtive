// Phase 4 / Plan 04-01 — Wave-0 RED harness for the booking form (HK-12).
//
// Written RED — Plan 04-07 ships the BookingForm client component and turns each
// test green. Guards the end-to-end Free Assessment booking UX.
//
// Guards:
//   1. 6 required fields (name, email, phone, childAge, venue radio group, message)
//      + hidden honeypot input `name="bot-trap"` (verbatim from Phase 3 contact-form.tsx)
//   2. ?venue=wan-chai pre-fills the Wan Chai venue radio with aria-checked="true"
//      (OR data-state="checked")
//   3. Submit POSTs to /api/contact with { market: "hk", subject: "Free Assessment Request",
//      venue, ... } in JSON body
//   4. Submit button shows "Sending…" + disabled while status === "submitting"
//   5. After successful 200 response, form is replaced by success-state heading
//      containing "Thanks — your free assessment request is in."

import * as React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";

// Controlled useSearchParams mock
const mockSearchParams = { get: vi.fn() };
vi.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
}));

beforeEach(() => {
  mockSearchParams.get.mockReset();
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success: true, id: "mock-id" }),
  });
});

afterEach(() => cleanup());

describe("BookingForm (HK-12) — required fields + honeypot", () => {
  it("renders 6 labelled fields (name, email, phone, childAge, venue radiogroup, message) + bot-trap honeypot", async () => {
    // RED-state import: booking-form does not exist yet at Wave 0; Plan 04-07 ships it.
    const formPath = "./booking-form";
    const mod = (await import(/* @vite-ignore */ formPath)) as any;
    const BookingForm = mod.BookingForm ?? mod.default;
    render(<BookingForm />);

    // Required visible fields — label text is in UI-SPEC §5.6
    expect(screen.queryByLabelText(/your name/i)).not.toBeNull();
    expect(screen.queryByLabelText(/email/i)).not.toBeNull();
    expect(screen.queryByLabelText(/phone/i)).not.toBeNull();
    expect(screen.queryByLabelText(/child('s)? age/i)).not.toBeNull();
    expect(screen.queryByLabelText(/(anything we should know|message)/i)).not.toBeNull();

    // Venue selector is a radiogroup (see contact-form.tsx pattern)
    const radiogroup = document.querySelector('[role="radiogroup"]');
    expect(radiogroup).not.toBeNull();

    // Honeypot — Phase 3 D-04 carry-forward (name="bot-trap")
    const honeypot = document.querySelector(
      'input[name="bot-trap"]'
    ) as HTMLInputElement | null;
    expect(honeypot).not.toBeNull();
    expect(honeypot!.getAttribute("tabindex")).toBe("-1");
  });
});

describe("BookingForm (HK-12) — venue pre-fill from ?venue= query", () => {
  it("when useSearchParams().get('venue') === 'wan-chai', the Wan Chai radio is checked", async () => {
    mockSearchParams.get.mockImplementation((key: string) =>
      key === "venue" ? "wan-chai" : null
    );
    // RED-state import: booking-form does not exist yet at Wave 0; Plan 04-07 ships it.
    const formPath = "./booking-form";
    const mod = (await import(/* @vite-ignore */ formPath)) as any;
    const BookingForm = mod.BookingForm ?? mod.default;
    render(<BookingForm />);
    const wanChaiRadio = screen.getByRole("radio", { name: /wan chai/i });
    // Accept either aria-checked="true" or data-state="checked"
    const ariaChecked = wanChaiRadio.getAttribute("aria-checked");
    const dataState = wanChaiRadio.getAttribute("data-state");
    expect(ariaChecked === "true" || dataState === "checked").toBe(true);
  });
});

describe("BookingForm (HK-12) — submit POSTs Free Assessment Request to /api/contact", () => {
  it("submit sends { market: 'hk', subject: 'Free Assessment Request', venue: 'wan-chai', ... } as JSON", async () => {
    mockSearchParams.get.mockImplementation((key: string) =>
      key === "venue" ? "wan-chai" : null
    );
    // RED-state import: booking-form does not exist yet at Wave 0; Plan 04-07 ships it.
    const formPath = "./booking-form";
    const mod = (await import(/* @vite-ignore */ formPath)) as any;
    const BookingForm = mod.BookingForm ?? mod.default;
    const { container } = render(<BookingForm />);

    // Fill required fields
    fireEvent.change(screen.getByLabelText(/your name/i), {
      target: { value: "Jane Parent" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/child('s)? age/i), {
      target: { value: "6" },
    });

    // Submit form
    const form = container.querySelector("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/contact",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
    });

    const fetchCall = (global.fetch as any).mock.calls[0];
    const body = JSON.parse(fetchCall[1].body);
    expect(body.market).toBe("hk");
    expect(body.subject).toBe("Free Assessment Request");
    expect(body.venue).toBe("wan-chai");
  });
});

describe("BookingForm (HK-12) — submitting state", () => {
  it("submit button shows 'Sending…' and is disabled while request is in flight", async () => {
    // Delay the fetch response so we can observe the submitting state
    let resolveFetch: (v: any) => void = () => {};
    global.fetch = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );
    // RED-state import: booking-form does not exist yet at Wave 0; Plan 04-07 ships it.
    const formPath = "./booking-form";
    const mod = (await import(/* @vite-ignore */ formPath)) as any;
    const BookingForm = mod.BookingForm ?? mod.default;
    const { container } = render(<BookingForm />);

    fireEvent.change(screen.getByLabelText(/your name/i), {
      target: { value: "Jane Parent" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/child('s)? age/i), {
      target: { value: "6" },
    });
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => {
      const submitButton = container.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement | null;
      expect(submitButton).not.toBeNull();
      expect(submitButton!.textContent ?? "").toMatch(/Sending/);
      expect(submitButton!.disabled).toBe(true);
    });

    // Clean up the pending promise
    resolveFetch({ ok: true, json: async () => ({ success: true }) });
  });
});

describe("BookingForm (HK-12) — success state", () => {
  it("after 200 response, form is replaced by success heading containing 'Thanks — your free assessment request is in.'", async () => {
    // RED-state import: booking-form does not exist yet at Wave 0; Plan 04-07 ships it.
    const formPath = "./booking-form";
    const mod = (await import(/* @vite-ignore */ formPath)) as any;
    const BookingForm = mod.BookingForm ?? mod.default;
    const { container } = render(<BookingForm />);

    fireEvent.change(screen.getByLabelText(/your name/i), {
      target: { value: "Jane Parent" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/child('s)? age/i), {
      target: { value: "6" },
    });
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => {
      expect(document.body.textContent).toContain(
        "Thanks — your free assessment request is in."
      );
    });
  });
});

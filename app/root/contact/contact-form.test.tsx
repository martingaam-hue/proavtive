// Phase 3 / Plan 03-03 — RTL tests for ContactForm (D-03 force-pick + D-07 subject pre-fill + D-04 honeypot).
import * as React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// Stub useSearchParams — controlled per test
const mockSearchParams = { get: vi.fn() };
vi.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
}));

// Stub fetch globally
beforeEach(() => {
  mockSearchParams.get.mockReset();
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success: true, id: "mock-id" }),
  });
});

describe("ContactForm — D-03 force-pick", () => {
  it("hides form fields until market is selected", async () => {
    const { ContactForm } = await import("./contact-form");
    render(<ContactForm />);
    // Helper text visible
    expect(screen.queryByText(/please select your location/i)).toBeInTheDocument();
    // No Name input rendered yet
    expect(screen.queryByLabelText(/your name/i)).not.toBeInTheDocument();
  });

  it("reveals form fields after clicking the HK market card", async () => {
    const { ContactForm } = await import("./contact-form");
    render(<ContactForm />);
    const hkCard = screen.getByRole("radio", { name: /hong kong/i });
    fireEvent.click(hkCard);
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.queryByText(/please select your location/i)).not.toBeInTheDocument();
    expect(hkCard).toHaveAttribute("aria-checked", "true");
  });
});

describe("ContactForm — D-07 subject pre-fill from query param", () => {
  it("pre-fills hidden subject field with 'Job application' when ?subject=job", async () => {
    mockSearchParams.get.mockImplementation((key: string) => (key === "subject" ? "job" : null));
    const { ContactForm } = await import("./contact-form");
    render(<ContactForm />);
    const subjectInput = document.querySelector('input[name="subject"]') as HTMLInputElement | null;
    expect(subjectInput).not.toBeNull();
    expect(subjectInput!.value).toBe("Job application");
  });

  it("hidden subject empty when no ?subject= query param", async () => {
    mockSearchParams.get.mockReturnValue(null);
    const { ContactForm } = await import("./contact-form");
    render(<ContactForm />);
    // Click HK to render fields
    fireEvent.click(screen.getByRole("radio", { name: /hong kong/i }));
    const subjectInput = document.querySelector('input[name="subject"]') as HTMLInputElement | null;
    expect(subjectInput).not.toBeNull();
    expect(subjectInput!.value).toBe("");
  });
});

describe("ContactForm — D-04 honeypot field", () => {
  it("renders bot-trap input when form fields visible", async () => {
    const { ContactForm } = await import("./contact-form");
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("radio", { name: /hong kong/i }));
    const honeypot = document.querySelector('input[name="bot-trap"]') as HTMLInputElement | null;
    expect(honeypot).not.toBeNull();
    expect(honeypot).toHaveAttribute("tabindex", "-1");
  });
});

describe("ContactForm — selector ARIA", () => {
  it("uses role=radiogroup and role=radio with aria-checked toggle", async () => {
    const { ContactForm } = await import("./contact-form");
    render(<ContactForm />);
    const group = screen.getByRole("radiogroup");
    expect(group).toBeInTheDocument();
    const hkRadio = screen.getByRole("radio", { name: /hong kong/i });
    const sgRadio = screen.getByRole("radio", { name: /singapore/i });
    expect(hkRadio).toHaveAttribute("aria-checked", "false");
    expect(sgRadio).toHaveAttribute("aria-checked", "false");
    fireEvent.click(sgRadio);
    expect(sgRadio).toHaveAttribute("aria-checked", "true");
    expect(hkRadio).toHaveAttribute("aria-checked", "false");
  });
});

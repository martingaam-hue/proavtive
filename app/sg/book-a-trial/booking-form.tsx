"use client";

// Phase 5 / Plan 05-06 — SG booking form (SG-11).
//
// Per D-10: SG venue hardcoded to "katong-point" (single-venue simplification).
// No venue selector — contrast with HK analog (app/hk/book-a-trial/free-assessment/booking-form.tsx)
// which has a 3-card venue picker. SG has one venue; no UI affordance needed.
//
// Subject pre-fill from ?subject= query param (useSearchParams) — required by Suspense wrapper
// in page.tsx.  Default falls back to "Free Assessment Request" when query param absent.
//
// Honeypot field name "bot-trap" is verbatim from Phase 3 D-04 so the shared
// /api/contact handler's existing honeypot check works without modification.
//
// Copywriting verbatim from UI-SPEC §Copywriting — success + error headings, body, CTAs.

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type FormStatus = "idle" | "submitting" | "success" | "error";

// Named + default export so both `mod.BookingForm` and `mod.default` resolve in tests.
export function BookingForm() {
  const searchParams = useSearchParams();
  // Read subject from ?subject= query param — pre-fills from CTA links across the SG site.
  // Default "Free Assessment Request" when param absent (same as HK analog).
  const prefilledSubject =
    searchParams?.get("subject") ?? "Free Assessment Request";

  const [status, setStatus] = React.useState<FormStatus>("idle");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const whatsappSg = process.env.NEXT_PUBLIC_WHATSAPP_SG;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});
    const formData = new FormData(e.currentTarget);
    const phone = formData.get("phone");
    const message = formData.get("message");
    const subject = formData.get("subject");
    const payload = {
      market: "sg" as const,
      venue: "katong-point" as const, // hardcoded — single SG venue (D-10)
      subject:
        typeof subject === "string" && subject.length > 0
          ? subject
          : prefilledSubject,
      name: formData.get("name"),
      email: formData.get("email"),
      phone: typeof phone === "string" && phone.length > 0 ? phone : undefined,
      childAge: formData.get("childAge"),
      message:
        typeof message === "string" && message.length > 0 ? message : undefined,
      "bot-trap": formData.get("bot-trap") ?? "",
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus("success");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (data && typeof data === "object" && "errors" in data && data.errors) {
        setErrors(data.errors as Record<string, string>);
        setStatus("idle");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  // Success state — UI-SPEC §Copywriting verbatim heading + body + CTAs.
  if (status === "success") {
    return (
      <Card className="p-6 border-2 border-brand-green/30 bg-brand-green/5">
        <CheckCircle2
          className="size-8 text-brand-green mb-3"
          aria-hidden="true"
        />
        <h2 className="text-h2 font-display text-foreground">
          Thanks — your free trial request is in.
        </h2>
        <p className="text-body text-muted-foreground mt-3">
          A member of our Prodigy team will reply within one working day to
          confirm a time. We&apos;ll prepare the right coach and zone for your
          child.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button
            asChild
            variant="outline"
            size="touch"
            className="border-brand-navy text-brand-navy hover:bg-brand-navy/5"
          >
            <Link href="/">Back to Prodigy Singapore</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="touch"
            className="border-brand-navy text-brand-navy hover:bg-brand-navy/5"
          >
            <Link href="/blog/">Read the first-class guide</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
      aria-live="polite"
    >
      {/* Error banner — UI-SPEC §Copywriting verbatim submission-failure copy */}
      {status === "error" && (
        <Card className="p-5 border-2 border-destructive/30 bg-destructive/5">
          <AlertCircle
            className="size-6 text-destructive mb-2"
            aria-hidden="true"
          />
          <h2 className="text-h3 font-display text-foreground">
            Something went wrong on our end.
          </h2>
          <p className="text-body text-muted-foreground mt-2">
            Your message didn&apos;t reach us — please try again, or WhatsApp
            Prodigy directly. We&apos;ll still see it.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              size="touch"
              className="border-brand-navy text-brand-navy hover:bg-brand-navy/5"
              onClick={() => setStatus("idle")}
            >
              Try sending again
            </Button>
            {whatsappSg && (
              <Button
                asChild
                variant="outline"
                size="touch"
                className="border-brand-green text-brand-green hover:bg-brand-green/10"
              >
                <a
                  href={`https://wa.me/${whatsappSg.replace(
                    /[^0-9+]/g,
                    ""
                  )}?text=${encodeURIComponent(
                    "Hi Prodigy Singapore, I tried to book a free trial via the website but it failed. Can we chat?"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle
                    className="mr-2 size-4"
                    aria-hidden="true"
                  />{" "}
                  Chat on WhatsApp
                </a>
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Honeypot — hidden from users + assistive tech (Phase 3 D-04 carry).
          MUST be named "bot-trap" verbatim so /api/contact's honeypot check fires. */}
      <input
        type="text"
        name="bot-trap"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
        }}
      />

      {/* Your name */}
      <div className="space-y-2">
        <Label htmlFor="booking-name">Your name</Label>
        <Input
          id="booking-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-required="true"
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-sm text-destructive mt-1" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="booking-email">Email</Label>
        <Input
          id="booking-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-required="true"
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-sm text-destructive mt-1" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone (optional) */}
      <div className="space-y-2">
        <Label htmlFor="booking-phone">Phone (optional)</Label>
        <Input
          id="booking-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
        />
      </div>

      {/* Child age (required, 1–18) */}
      <div className="space-y-2">
        <Label htmlFor="booking-childAge">Child&apos;s age</Label>
        <Input
          id="booking-childAge"
          name="childAge"
          type="number"
          min={1}
          max={18}
          required
          aria-required="true"
          inputMode="numeric"
          aria-invalid={!!errors.childAge}
        />
        {errors.childAge && (
          <p className="text-sm text-destructive mt-1" role="alert">
            {errors.childAge}
          </p>
        )}
      </div>

      {/* Subject — pre-filled from ?subject= query param, editable */}
      <div className="space-y-2">
        <Label htmlFor="booking-subject">
          What would you like to book or ask about?
        </Label>
        <Input
          id="booking-subject"
          name="subject"
          type="text"
          defaultValue={prefilledSubject}
          required
          aria-required="true"
          aria-invalid={!!errors.subject}
        />
        {errors.subject && (
          <p className="text-sm text-destructive mt-1" role="alert">
            {errors.subject}
          </p>
        )}
      </div>

      {/* Message (optional, 500 chars max) */}
      <div className="space-y-2">
        <Label htmlFor="booking-message">
          Anything we should know? (optional)
        </Label>
        <Textarea
          id="booking-message"
          name="message"
          rows={3}
          maxLength={500}
        />
      </div>

      {/* Submit — red fill per brand palette, touch-target size */}
      <div>
        <Button
          type="submit"
          size="touch"
          disabled={status === "submitting"}
          className="bg-brand-red text-white hover:bg-brand-red/90 w-full md:w-auto"
        >
          {status === "submitting" ? (
            <>
              <Loader2
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />{" "}
              Sending…
            </>
          ) : (
            "Book free trial"
          )}
        </Button>
      </div>
    </form>
  );
}

export default BookingForm;

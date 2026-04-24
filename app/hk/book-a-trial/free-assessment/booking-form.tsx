"use client";

// Phase 4 / Plan 04-07 — HK booking form (HK-12 + D-10).
//
// Extends the Phase 3 contact-form pattern (see app/root/contact/contact-form.tsx):
// useState + FormData + fetch POST + bot-trap honeypot + status states.
//
// Differences vs Phase 3 contact form:
//   • 3-card venue radio selector (wan-chai / cyberport / no-preference)
//   • childAge number input (server validates 1–18)
//   • venue pre-fill from URL search param `?venue=...` via useSearchParams
//   • subject hard-coded to "Free Assessment Request" (Phase 3 route accepts arbitrary subject)
//   • verbatim success + error copy from UI-SPEC §Copywriting Contract
//
// Honeypot field name `bot-trap` is verbatim from Phase 3 D-04 so the shared
// /api/contact handler's existing honeypot check works without modification.

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  Loader2,
  MapPin,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Venue = "wan-chai" | "cyberport" | "no-preference";
type FormStatus = "idle" | "submitting" | "success" | "error";

const VENUE_OPTIONS: readonly {
  value: Venue;
  label: string;
  sub: string;
}[] = [
  {
    value: "wan-chai",
    label: "ProGym Wan Chai",
    sub: "15/F, The Hennessy",
  },
  {
    value: "cyberport",
    label: "ProGym Cyberport",
    sub: "5,000 sq ft, opened Aug 2025",
  },
  {
    value: "no-preference",
    label: "No preference — suggest for me",
    sub: "We'll suggest based on your location",
  },
];

function isVenue(value: string | null): value is Venue {
  return (
    value === "wan-chai" || value === "cyberport" || value === "no-preference"
  );
}

export function BookingForm() {
  const searchParams = useSearchParams();
  // T-04-07-01 mitigation: enum-check the incoming query param BEFORE applying it
  // to React state. Unknown values fall through to the safe default.
  const initialVenue: Venue = (() => {
    const raw = searchParams?.get("venue") ?? null;
    return isVenue(raw) ? raw : "no-preference";
  })();
  const [venue, setVenue] = React.useState<Venue>(initialVenue);
  const [status, setStatus] = React.useState<FormStatus>("idle");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const whatsappHk = process.env.NEXT_PUBLIC_HK_WHATSAPP;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});
    const formData = new FormData(e.currentTarget);
    const phone = formData.get("phone");
    const message = formData.get("message");
    const payload = {
      market: "hk" as const,
      subject: "Free Assessment Request",
      venue,
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

  // Success state replaces the form (UI-SPEC §Copywriting Contract — verbatim heading).
  if (status === "success") {
    return (
      <Card className="p-6 border-2 border-brand-green/30 bg-brand-green/5">
        <CheckCircle2
          className="size-8 text-brand-green mb-3"
          aria-hidden="true"
        />
        <h2 className="text-h2 font-display text-foreground">
          Thanks — your free assessment request is in.
        </h2>
        <p className="text-body text-muted-foreground mt-3">
          A member of our HK team will reply within one working day to confirm a
          time. If you booked for a specific venue, we&apos;ll prepare the right
          coach and apparatus in advance.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button
            asChild
            variant="outline"
            size="touch"
            className="border-brand-navy text-brand-navy hover:bg-brand-navy/5"
          >
            <a href="/">Back to ProActiv Sports Hong Kong</a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="touch"
            className="border-brand-navy text-brand-navy hover:bg-brand-navy/5"
          >
            <a href="/blog/">Read the first-class guide</a>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Error banner (UI-SPEC §Copywriting — verbatim submission-failure copy) */}
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
            ProGym directly. We&apos;ll still see it.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button
              type="submit"
              variant="outline"
              size="touch"
              className="border-brand-navy text-brand-navy hover:bg-brand-navy/5"
            >
              Try sending again
            </Button>
            {whatsappHk && (
              <Button
                asChild
                variant="outline"
                size="touch"
                className="border-brand-green text-brand-green hover:bg-brand-green/10"
              >
                <a
                  href={`https://wa.me/${whatsappHk.replace(
                    /[^0-9+]/g,
                    ""
                  )}?text=${encodeURIComponent(
                    "Hi ProActiv HK, I tried to book a free trial via the website but it failed. Can we chat?"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 size-4" aria-hidden="true" />{" "}
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

      {/* Venue selector — 3 radio cards. Expose role="radiogroup" on the container
          (matches the Phase 3 contact-form ARIA pattern referenced by the Wave-0 test). */}
      <fieldset>
        <legend className="text-sm font-semibold text-foreground mb-3">
          Which venue?
        </legend>
        <div
          role="radiogroup"
          aria-label="Which venue?"
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          {VENUE_OPTIONS.map((opt) => {
            const checked = venue === opt.value;
            return (
              <label
                key={opt.value}
                className={cn(
                  "flex flex-col gap-1 p-4 rounded-lg border-2 cursor-pointer transition-colors min-h-[3rem]",
                  checked
                    ? "border-brand-navy bg-brand-navy/5"
                    : "border-border hover:border-brand-navy/40"
                )}
              >
                <input
                  type="radio"
                  name="venue"
                  value={opt.value}
                  checked={checked}
                  onChange={() => setVenue(opt.value)}
                  className="sr-only"
                  aria-checked={checked}
                  aria-label={opt.label}
                  data-state={checked ? "checked" : "unchecked"}
                />
                <span className="font-sans font-semibold text-foreground flex items-start gap-2">
                  <MapPin
                    className="size-4 mt-0.5 shrink-0 text-brand-navy"
                    aria-hidden="true"
                  />
                  {opt.label}
                </span>
                <span className="text-sm text-muted-foreground pl-6">
                  {opt.sub}
                </span>
              </label>
            );
          })}
        </div>
        {errors.venue && (
          <p className="text-sm text-destructive mt-2">{errors.venue}</p>
        )}
      </fieldset>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="booking-name">Your name</Label>
        <Input
          id="booking-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name}</p>
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
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email}</p>
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

      {/* Child age */}
      <div className="space-y-2">
        <Label htmlFor="booking-childAge">Child&apos;s age (years)</Label>
        <Input
          id="booking-childAge"
          name="childAge"
          type="number"
          min={1}
          max={18}
          required
          inputMode="numeric"
          aria-invalid={!!errors.childAge}
        />
        {errors.childAge && (
          <p className="text-sm text-destructive mt-1">{errors.childAge}</p>
        )}
      </div>

      {/* Message (optional) */}
      <div className="space-y-2">
        <Label htmlFor="booking-message">
          Anything we should know? (optional)
        </Label>
        <Textarea id="booking-message" name="message" rows={3} maxLength={500} />
      </div>

      {/* Submit */}
      <div>
        <Button
          type="submit"
          size="touch"
          disabled={status === "submitting"}
          className="bg-brand-red text-white hover:bg-brand-red/90 w-full md:w-auto"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />{" "}
              Sending…
            </>
          ) : (
            "Book free assessment"
          )}
        </Button>
      </div>
    </form>
  );
}

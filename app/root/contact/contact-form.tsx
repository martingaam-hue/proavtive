"use client";

// Phase 3 / Plan 03-03 — Contact form (client island).
//
// D-03 force-pick: form fields hidden until market chosen.
// D-04 honeypot: hidden bot-trap input — server silently accepts non-empty.
// D-07 subject pre-fill: useSearchParams → ?subject=job maps to "Job application".

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Market = "hk" | "sg";
type FormStatus = "idle" | "submitting" | "success" | "error";

const SUBJECT_MAP: Record<string, string> = {
  job: "Job application",
  "press-list": "Press notification list",
};

export function ContactForm() {
  const searchParams = useSearchParams();
  const subjectParam = searchParams?.get("subject") ?? null;
  const subjectValue = subjectParam ? (SUBJECT_MAP[subjectParam] ?? subjectParam) : "";

  const [market, setMarket] = React.useState<Market | null>(null);
  const [status, setStatus] = React.useState<FormStatus>("idle");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!market) return;
    setStatus("submitting");
    setErrors({});
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

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
      if (data.errors) {
        setErrors(data.errors as Record<string, string>);
        setStatus("idle");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    const marketLabel = market === "hk" ? "HK" : "SG";
    return (
      <Card className="p-8 text-center bg-accent">
        <CheckCircle2 className="size-12 text-brand-green mx-auto" aria-hidden="true" />
        <h2 className="text-h2 font-display mt-4">Thanks — we&apos;ll be in touch.</h2>
        <p className="text-body mt-3 text-muted-foreground">
          We&apos;ve received your message. A member of the {marketLabel} team will reply within one business day. Check your inbox for a confirmation copy.
        </p>
        <Button
          variant="ghost"
          size="touch"
          className="mt-6"
          onClick={() => {
            setStatus("idle");
            setMarket(null);
          }}
        >
          Send another message
        </Button>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Market selector — D-03 force-pick */}
      <p className="text-small text-muted-foreground mb-3 font-medium">
        Where are you enquiring about? <span className="text-destructive">*</span>
      </p>
      <div role="radiogroup" aria-label="Select your market" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(["hk", "sg"] as const).map((m) => {
          const selected = market === m;
          const label = m === "hk" ? "Hong Kong" : "Singapore";
          const subLabel = m === "hk" ? "ProGym Wan Chai · Cyberport" : "Prodigy @ Katong Point";
          return (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={label}
              onClick={() => setMarket(m)}
              className={cn(
                "min-h-[88px] p-6 rounded-lg border-2 text-left transition-colors",
                selected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:border-primary/50"
              )}
            >
              <MapPin className="size-8 text-brand-navy mb-2" aria-hidden="true" />
              <span className="block text-h3 font-display">{label}</span>
              <span className="block text-small text-muted-foreground mt-1">{subLabel}</span>
            </button>
          );
        })}
      </div>

      {/* D-07: subject pre-fill — always in DOM so ?subject= param works before market pick */}
      <input type="hidden" name="subject" value={subjectValue} />

      {/* D-03: hide fields until market picked */}
      {!market ? (
        <p className="text-body text-muted-foreground mt-6 text-center">
          Please select your location to continue.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact-name">
              Your name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contact-name"
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={100}
              placeholder="Maria Chen"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
            />
            {errors.name && (
              <p id="contact-name-error" className="text-small text-destructive mt-1">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
            />
            {errors.email && (
              <p id="contact-email-error" className="text-small text-destructive mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-phone">Phone (optional)</Label>
            <Input id="contact-phone" name="phone" type="tel" placeholder="+852 9123 4567" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-age">Child&apos;s age (optional)</Label>
            <Input id="contact-age" name="age" type="text" placeholder="e.g. 4 years old, or 4 and 7" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-message">
              Message <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="contact-message"
              name="message"
              rows={5}
              required
              minLength={10}
              maxLength={2000}
              placeholder="Tell us about your child and what you're hoping for — class, camp, party, anything."
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "contact-message-error" : undefined}
            />
            {errors.message && (
              <p id="contact-message-error" className="text-small text-destructive mt-1">
                {errors.message}
              </p>
            )}
          </div>

          {/* Hidden fields */}
          <input type="hidden" name="market" value={market} />
          {/* D-04 honeypot */}
          <input
            type="text"
            name="bot-trap"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px" }}
          />

          {status === "error" && (
            <Card className="p-4 border-destructive bg-destructive/5 flex items-start gap-3">
              <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-body font-semibold">Something went wrong.</p>
                <p className="text-small mt-1">
                  We couldn&apos;t send your message right now. Please try again, or email us directly at{" "}
                  <a href="mailto:hello@proactivsports.com" className="font-semibold underline">
                    hello@proactivsports.com
                  </a>
                  .
                </p>
              </div>
            </Card>
          )}

          <Button
            type="submit"
            size="touch"
            variant="default"
            className="w-full mt-6"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" aria-hidden="true" />
                Sending...
              </>
            ) : (
              "Send message"
            )}
          </Button>
        </div>
      )}
    </form>
  );
}

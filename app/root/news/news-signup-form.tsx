"use client";

// Phase 3 / Plan 03-05 — News page email signup form. Reuses /api/contact with subject="Press notification list".
// Simpler than ContactForm: only email + market + (auto) message.

import * as React from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Market = "hk" | "sg";
type FormStatus = "idle" | "submitting" | "success" | "error";

export function NewsSignupForm() {
  const [market, setMarket] = React.useState<Market | null>(null);
  const [status, setStatus] = React.useState<FormStatus>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!market) return;
    setStatus("submitting");
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "");
    const honeypot = String(formData.get("bot-trap") ?? "");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Press signup",
          email,
          market,
          subject: "Press notification list",
          message: `Please add me to the press notification list. (Auto-generated from /news/ signup form.)`,
          "bot-trap": honeypot,
        }),
      });
      if (res.ok) {
        setStatus("success");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <Card className="p-6 text-center bg-accent">
        <CheckCircle2 className="size-10 text-brand-green mx-auto" aria-hidden="true" />
        <p className="text-h3 font-display mt-3">You&apos;re on the list.</p>
        <p className="text-body text-muted-foreground mt-2">We&apos;ll notify you when we publish press highlights.</p>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto" noValidate>
      <p className="text-small text-muted-foreground font-medium">
        Where are you enquiring about? <span className="text-destructive">*</span>
      </p>
      <div role="radiogroup" aria-label="Select your market" className="grid grid-cols-2 gap-3">
        {(["hk", "sg"] as const).map((m) => {
          const selected = market === m;
          const label = m === "hk" ? "Hong Kong" : "Singapore";
          return (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setMarket(m)}
              className={cn(
                "min-h-12 px-4 py-3 rounded-lg border-2 text-body font-semibold transition-colors",
                selected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:border-primary/50"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        <Label htmlFor="news-email">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input id="news-email" name="email" type="email" required placeholder="you@example.com" disabled={!market} />
      </div>

      <input
        type="text"
        name="bot-trap"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px" }}
      />

      {status === "error" && (
        <Card className="p-3 border-destructive bg-destructive/5 flex items-start gap-2">
          <AlertCircle className="size-4 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-small">Something went wrong — please try again or email <a href="mailto:hello@proactivsports.com" className="font-semibold underline">hello@proactivsports.com</a>.</p>
        </Card>
      )}

      <Button type="submit" size="touch" variant="default" className="w-full" disabled={!market || status === "submitting"}>
        {status === "submitting" ? (
          <><Loader2 className="size-4 animate-spin mr-2" aria-hidden="true" /> Sending...</>
        ) : (
          "Notify me of press updates"
        )}
      </Button>
    </form>
  );
}

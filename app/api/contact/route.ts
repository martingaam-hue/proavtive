// Phase 3 / Plan 03-03 — Contact form route handler.
//
// D-01 env vars: RESEND_API_KEY, CONTACT_INBOX_HK, CONTACT_INBOX_SG (HUMAN-ACTION precondition).
// D-04 honeypot: silent 200 on bot-trap trigger (don't leak rejection logic — RESEARCH Topic 3).
// D-05 sender: onboarding@resend.dev at Phase 3 (Phase 10 swaps to noreply@proactivsports.com once DKIM live).
// Pitfall 5: server validates market ∈ ['hk','sg'] — rejects unknown values 400.

import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { ContactEmail, type ContactEmailProps } from "@/emails/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE = 10;
const MAX_MESSAGE = 2000;

function getInboxes() {
  return {
    hk: process.env.CONTACT_INBOX_HK,
    sg: process.env.CONTACT_INBOX_SG,
  } as const;
}

interface ContactBody {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  age?: unknown;
  message?: unknown;
  market?: unknown;
  subject?: unknown;
  "bot-trap"?: unknown;
}

export async function POST(req: NextRequest | Request): Promise<NextResponse> {
  let body: ContactBody;
  try {
    body = (await req.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // (1) D-04 honeypot: silent 200 — do NOT call Resend, do NOT leak rejection.
  if (typeof body["bot-trap"] === "string" && body["bot-trap"].length > 0) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // (2) Required fields (Pitfall 5 + general validation)
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const market = body.market;

  if (!name) {
    return NextResponse.json({ errors: { name: "Your name is required." } }, { status: 400 });
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ errors: { email: "Please enter a valid email address." } }, { status: 400 });
  }
  if (!message || message.length < MIN_MESSAGE) {
    return NextResponse.json({ errors: { message: `Please give us a bit more detail (at least ${MIN_MESSAGE} characters).` } }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE) {
    return NextResponse.json({ errors: { message: "Message is too long." } }, { status: 400 });
  }

  // (3) Pitfall 5: market validation
  if (market !== "hk" && market !== "sg") {
    return NextResponse.json({ error: "Invalid market" }, { status: 400 });
  }

  // (4) Env-var presence check at request time (D-01 — fails loudly to surface config errors)
  const apiKey = process.env.RESEND_API_KEY;
  const inboxes = getInboxes();
  if (!apiKey || !inboxes.hk || !inboxes.sg) {
    // Server config error — log + 500 (NOT silent — config errors must be visible).
    console.error("Contact route: missing required env vars (RESEND_API_KEY / CONTACT_INBOX_HK / CONTACT_INBOX_SG)");
    return NextResponse.json({ error: "Contact form is not configured." }, { status: 500 });
  }

  const phone = typeof body.phone === "string" ? body.phone.trim() : undefined;
  const age = typeof body.age === "string" ? body.age.trim() : undefined;
  const subject = typeof body.subject === "string" ? body.subject.trim() : undefined;

  const props: ContactEmailProps = { name, email, phone, age, message, market, subject };
  // inboxes[market] is guaranteed non-undefined — validated above in the env-var check.
  const to = inboxes[market] as string;

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: "ProActiv Sports Website <onboarding@resend.dev>",
    to: [to],
    replyTo: email,
    subject: `[${market.toUpperCase()}] ${subject || "New enquiry"} — ${name}`,
    react: ContactEmail(props),
  });

  if (error) {
    console.error("Resend send failed:", error);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data?.id }, { status: 200 });
}

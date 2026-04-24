// Phase 3 / Plan 03-03 — Contact form route handler.
//
// D-01 env vars: RESEND_API_KEY, CONTACT_INBOX_HK, CONTACT_INBOX_SG (HUMAN-ACTION precondition).
// D-04 honeypot: silent 200 on bot-trap trigger (don't leak rejection logic — RESEARCH Topic 3).
// D-05 sender: onboarding@resend.dev at Phase 3 (Phase 10 swaps to noreply@proactivsports.com once DKIM live).
// Pitfall 5: server validates market ∈ ['hk','sg'] — rejects unknown values 400.
//
// Phase 4 / Plan 04-07 (D-10) — ADDITIVE extension for HK Free Assessment booking form:
//   • Optional `venue` field accepted; when present, validated against allowed enum.
//   • Optional `childAge` field accepted; when present, validated as integer in [1,18].
//   • When the payload identifies itself as a booking submission (`venue` present), the
//     Phase 3 minimum-message length check is relaxed so the booking form's optional
//     message field doesn't 400 the request. Phase 3 contact-form payloads (without
//     `venue`) continue to enforce the original MIN_MESSAGE floor.
//   • `venue` + `childAge` forwarded to the email template (which renders them
//     conditionally — see emails/contact.tsx).

import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { ContactEmail, type ContactEmailProps } from "@/emails/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE = 10;
const MAX_MESSAGE = 2000;

// Phase 4 / Plan 04-07 — allowed venue enum (D-10). Change here if HK opens a new venue.
// Phase 5 / Plan 05-01 — added "katong-point" per D-10 (single SG venue; BookingForm submits with venue hardcoded).
const ALLOWED_VENUES = ["wan-chai", "cyberport", "no-preference", "katong-point"] as const;
type AllowedVenue = (typeof ALLOWED_VENUES)[number];

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
  venue?: unknown;
  childAge?: unknown;
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

  // Phase 4 / Plan 04-07 — extract HK booking-specific fields BEFORE validation so the
  // message-length check can relax for booking payloads (message is optional per UI-SPEC §5.6).
  let venue: AllowedVenue | undefined;
  const rawVenue = body.venue;
  const hasVenueField =
    "venue" in body &&
    rawVenue !== undefined &&
    rawVenue !== null &&
    rawVenue !== "";
  const errors: Record<string, string> = {};

  if (hasVenueField) {
    if (
      typeof rawVenue === "string" &&
      (ALLOWED_VENUES as readonly string[]).includes(rawVenue)
    ) {
      venue = rawVenue as AllowedVenue;
    } else {
      errors.venue =
        "Please pick a venue — we'll confirm availability for that time.";
    }
  }

  let childAge: number | undefined;
  const rawChildAge = body.childAge;
  const hasChildAgeField =
    "childAge" in body &&
    rawChildAge !== undefined &&
    rawChildAge !== null &&
    rawChildAge !== "";

  if (hasChildAgeField) {
    const ageNum =
      typeof rawChildAge === "string"
        ? parseInt(rawChildAge, 10)
        : typeof rawChildAge === "number"
          ? rawChildAge
          : NaN;
    if (!Number.isInteger(ageNum) || ageNum < 1 || ageNum > 18) {
      errors.childAge =
        "Please enter your child's age in years (use \"1\" for under 2).";
    } else {
      childAge = ageNum;
    }
  }

  if (!name) {
    return NextResponse.json({ errors: { name: "Your name is required." } }, { status: 400 });
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ errors: { email: "Please enter a valid email address." } }, { status: 400 });
  }

  // Phase 4 / Plan 04-07 — HK booking flow treats `message` as optional.
  // Detection rule: presence of `venue` field flags this as a booking submission.
  // Phase 3 contact-form payloads (no venue) continue to enforce MIN_MESSAGE floor.
  const isBookingSubmission = hasVenueField;
  if (!isBookingSubmission) {
    if (!message || message.length < MIN_MESSAGE) {
      return NextResponse.json(
        { errors: { message: `Please give us a bit more detail (at least ${MIN_MESSAGE} characters).` } },
        { status: 400 }
      );
    }
  }
  if (message.length > MAX_MESSAGE) {
    return NextResponse.json({ errors: { message: "Message is too long." } }, { status: 400 });
  }

  // (3) Pitfall 5: market validation
  if (market !== "hk" && market !== "sg") {
    return NextResponse.json({ error: "Invalid market" }, { status: 400 });
  }

  // (3b) Phase 4 / Plan 04-07 — return accumulated venue/childAge errors now that
  // core required fields have been validated. Keeps error shape aligned with Phase 3:
  // `{ errors: { [field]: string } }` with HTTP 400.
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
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
  // Phase 5 / Plan 05-06 — T-05-51 mitigation: email-header injection via subject field.
  // Strip newlines + cap at 100 chars (UI-SPEC §6 + RESEARCH §Security).
  const rawSubject = typeof body.subject === "string" ? body.subject : "";
  const subject = rawSubject
    .slice(0, 100)            // length cap — prevents excessively long subject lines
    .replace(/[\r\n]/g, " ") // newline strip — prevents email-header injection
    .trim() || undefined;

  const props: ContactEmailProps = {
    name,
    email,
    phone,
    age,
    message,
    market,
    subject,
    venue,
    childAge,
  };
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

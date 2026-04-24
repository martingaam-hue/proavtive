// Phase 3 / Plan 03-03 — React Email template for contact form notifications.
// Single parameterised template (per UI-SPEC §6.11 — D-05 deviation from RESEARCH Topic 3's two-template suggestion).
//
// Phase 4 / Plan 04-07 (D-10) — ADDITIVE extension for HK Free Assessment booking:
//   • `venue?` — rendered as a labelled row with human-readable venue name (ProGym Wan Chai / Cyberport / No preference).
//   • `childAge?` — rendered as a labelled row ("{childAge} years").
//   Both are conditional — Phase 3 contact-form emails (which omit these fields) render unchanged.
//   XSS defence: venue is enum-mapped BEFORE render (T-04-07-07); childAge is numeric; React Email
//   primitives (`<Text>`) escape content by default.
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Hr,
  Link,
} from "@react-email/components";
import * as React from "react";

export interface ContactEmailProps {
  name: string;
  email: string;
  phone?: string;
  age?: string;
  message: string;
  market: "hk" | "sg";
  subject?: string;
  // Phase 4 / Plan 04-07 — HK booking form extension (D-10). Optional for Phase 3 compat.
  venue?: "wan-chai" | "cyberport" | "no-preference";
  childAge?: string | number;
}

const VENUE_LABEL: Record<NonNullable<ContactEmailProps["venue"]>, string> = {
  "wan-chai": "ProGym Wan Chai",
  cyberport: "ProGym Cyberport",
  "no-preference": "No preference",
};

export function ContactEmail({
  name,
  email,
  phone,
  age,
  message,
  market,
  subject,
  venue,
  childAge,
}: ContactEmailProps) {
  const marketLabel = market === "hk" ? "Hong Kong" : "Singapore";
  return (
    <Html>
      <Head />
      <Preview>Reply directly — this email&apos;s reply-to is the parent&apos;s address.</Preview>
      <Body style={{ fontFamily: "system-ui, sans-serif", color: "#0f206c", backgroundColor: "#ffffff", padding: "24px" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto" }}>
          <Heading style={{ fontSize: 24, color: "#0f206c", marginBottom: 16 }}>
            New enquiry from {marketLabel} website
          </Heading>
          <Text><strong>Name:</strong> {name}</Text>
          <Text>
            <strong>Email:</strong> <Link href={`mailto:${email}`}>{email}</Link>
          </Text>
          {phone && <Text><strong>Phone:</strong> {phone}</Text>}
          {age && <Text><strong>Child&apos;s age:</strong> {age}</Text>}
          {subject && <Text><strong>Subject:</strong> {subject}</Text>}
          {/* Phase 4 / Plan 04-07 — HK booking form extension rows (conditional). */}
          {venue && (
            <Text><strong>Venue:</strong> {VENUE_LABEL[venue]}</Text>
          )}
          {childAge !== undefined && childAge !== "" && (
            <Text><strong>Child&apos;s age:</strong> {childAge} years</Text>
          )}
          <Hr style={{ borderColor: "#e6e6e6", margin: "16px 0" }} />
          <Text style={{ whiteSpace: "pre-wrap" }}>{message}</Text>
          <Hr style={{ borderColor: "#e6e6e6", margin: "16px 0" }} />
          <Text style={{ fontSize: 12, color: "#666666" }}>
            Sent via proactivsports.com — Resend
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

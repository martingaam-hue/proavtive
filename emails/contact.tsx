// Phase 3 / Plan 03-03 — React Email template for contact form notifications.
// Single parameterised template (per UI-SPEC §6.11 — D-05 deviation from RESEARCH Topic 3's two-template suggestion).
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
}

export function ContactEmail({
  name,
  email,
  phone,
  age,
  message,
  market,
  subject,
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

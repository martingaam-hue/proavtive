// Phase 3 / Plan 03-03 — Contact page shell. RSC + ContactForm client island + alternative-contact section.
// GW-06: market-routed contact form, full openGraph metadata (Pitfall 2), ContactPage JSON-LD (UI-SPEC §6.10/§8.4).
// D-02: WhatsApp cards conditionally render based on NEXT_PUBLIC_WHATSAPP_HK/SG env vars.

import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ContainerEditorial } from "@/components/ui/container-editorial";
import { Card } from "@/components/ui/card";
import { ContactForm } from "./contact-form";
import { WhatsAppContactCard } from "@/components/root/whatsapp-contact-card";

export const metadata: Metadata = {
  title: "Contact — Enquire with the HK or SG team",
  description:
    "Get in touch with ProActiv Sports — Hong Kong (ProGym Wan Chai & Cyberport) or Singapore (Prodigy @ Katong Point). Reply within one business day.",
  openGraph: {
    title: "Contact — Enquire with the HK or SG team | ProActiv Sports",
    description:
      "Get in touch with ProActiv Sports — Hong Kong (ProGym Wan Chai & Cyberport) or Singapore (Prodigy @ Katong Point). Reply within one business day.",
    url: "https://proactivsports.com/contact",
    images: [
      {
        url: "/contact/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Contact ProActiv Sports",
      },
    ],
    siteName: "ProActiv Sports",
    locale: "en_GB",
    type: "website",
  },
  alternates: { canonical: "https://proactivsports.com/contact" },
};

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: "https://proactivsports.com/contact",
  mainEntity: {
    "@type": "Organization",
    "@id": "https://proactivsports.com/#organization",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "hello@proactivsports.com",
        areaServed: ["HK", "SG"],
        availableLanguage: "English",
      },
    ],
  },
};

export default function ContactPage() {
  const whatsappHk = process.env.NEXT_PUBLIC_WHATSAPP_HK;
  const whatsappSg = process.env.NEXT_PUBLIC_WHATSAPP_SG;

  if (!whatsappHk) {
    console.warn("Contact page: NEXT_PUBLIC_WHATSAPP_HK not set — HK WhatsApp card omitted.");
  }
  if (!whatsappSg) {
    console.warn("Contact page: NEXT_PUBLIC_WHATSAPP_SG not set — SG WhatsApp card omitted.");
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />

      <Section size="md">
        <ContainerEditorial width="default">
          <h1 className="text-display font-display text-foreground">Get in touch.</h1>
          <p className="text-body-lg text-muted-foreground mt-4 max-w-prose">
            Tell us about your child and we&apos;ll point you to the right venue, the right coach, and the right next step.
          </p>
        </ContainerEditorial>
      </Section>

      <Section size="md" bg="muted">
        <ContainerEditorial width="default">
          <Card className="p-6 lg:p-10 max-w-2xl mx-auto">
            {/* [Rule 3 fix — Plan 03-06]: ContactForm uses useSearchParams which requires a Suspense boundary
                when statically prerendered. Without this, `pnpm build` fails at /root/contact. */}
            <Suspense fallback={null}>
              <ContactForm />
            </Suspense>
          </Card>
        </ContainerEditorial>
      </Section>

      <Section size="md">
        <ContainerEditorial width="default">
          <h2 className="text-h2 font-display text-foreground">Other ways to reach us.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <a href="mailto:hello@proactivsports.com" className="block">
              <Card className="p-6 hover:shadow-md transition-shadow h-full">
                <Mail className="size-8 text-brand-navy" aria-hidden="true" />
                <h3 className="text-h3 font-display mt-3">Email us</h3>
                <p className="text-small text-muted-foreground mt-1">For anything that doesn&apos;t fit the form.</p>
                <p className="text-body font-semibold text-foreground mt-2">hello@proactivsports.com</p>
              </Card>
            </a>

            {whatsappHk && (
              <WhatsAppContactCard
                phone={whatsappHk}
                label="WhatsApp Hong Kong"
                sublabel="Chat with our HK team"
              />
            )}

            {whatsappSg && (
              <WhatsAppContactCard
                phone={whatsappSg}
                label="WhatsApp Singapore"
                sublabel="Chat with our SG team"
              />
            )}
          </div>
        </ContainerEditorial>
      </Section>
    </>
  );
}

// components/hk/whatsapp-cta.tsx
// Minimal 'use client' island for HK homepage WhatsApp CTA analytics tracking.
// Extracts only the WhatsApp anchor from the RSC FinalCTASection so the
// rest of the page retains RSC streaming benefits.
'use client'

import { trackWhatsApp } from '@/lib/analytics'

interface WhatsAppCTAProps {
  phone: string       // The WhatsApp number (digits only, no spaces)
  message?: string    // Optional pre-filled message
  children: React.ReactNode
  className?: string
}

export function WhatsAppCTA({ phone, message, children, className }: WhatsAppCTAProps) {
  const href = message
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${phone}`

  return (
    <a
      href={href}
      onClick={() => trackWhatsApp('hk')}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  )
}

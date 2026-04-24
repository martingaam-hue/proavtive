// components/root/whatsapp-contact-card.tsx
// Minimal 'use client' island for root contact page WhatsApp CTA analytics tracking.
// Extracts only the WhatsApp anchor cards from the RSC contact page so the
// rest of the page retains RSC streaming benefits.
'use client'

import { MessageCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { trackWhatsApp } from '@/lib/analytics'

interface WhatsAppContactCardProps {
  phone: string        // The WhatsApp number (may include spaces/dashes — stripped internally)
  label: string        // e.g. "WhatsApp Hong Kong"
  sublabel: string     // e.g. "Chat with our HK team"
}

export function WhatsAppContactCard({ phone, label, sublabel }: WhatsAppContactCardProps) {
  const clean = phone.replace(/[^0-9+]/g, '')
  const href = `https://wa.me/${clean}?text=${encodeURIComponent('Hello ProActiv Sports — ')}`

  return (
    <a
      href={href}
      onClick={() => trackWhatsApp('root')}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <Card className="p-6 hover:shadow-md transition-shadow h-full">
        <MessageCircle className="size-8 text-brand-green" aria-hidden="true" />
        <h3 className="text-h3 font-display mt-3">{label}</h3>
        <p className="text-small text-muted-foreground mt-1">{sublabel}</p>
        <p className="text-body font-semibold text-foreground mt-2">{phone}</p>
      </Card>
    </a>
  )
}

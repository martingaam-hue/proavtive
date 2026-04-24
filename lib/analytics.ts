// lib/analytics.ts
// GA4 typed conversion event helpers for ProActiv Sports
// Uses @next/third-parties/google sendGAEvent (Next.js 15 idiomatic approach)
// @next/third-parties version: 16.2.4
// Event names are locked per D-04 — do not rename without updating GA4 Key Events config
'use client'

import { sendGAEvent } from '@next/third-parties/google'

// Market discriminator — enables per-market segmentation in GA4 exploration reports
// without requiring separate GA4 properties (single property per D-03)
export type Market = 'hk' | 'sg' | 'root'

/**
 * Fire GA4 Key Event: book-a-trial_submitted
 * Call in the res.ok success branch of the booking form submit handler ONLY.
 * Never call on error paths or in useEffect on mount.
 */
export function trackBookATrial(market: Market, venue?: string): void {
  sendGAEvent('event', 'book-a-trial_submitted', {
    market,
    venue: venue ?? 'not-specified',
  })
}

/**
 * Fire GA4 Key Event: enquire_submitted
 * Call in the res.ok success branch of the contact/enquiry form submit handler ONLY.
 */
export function trackEnquiry(market: Market): void {
  sendGAEvent('event', 'enquire_submitted', { market })
}

/**
 * Fire GA4 Key Event: whatsapp_click
 * Call in onClick on every wa.me anchor across all three route groups.
 * Fires on click (intent signal), not on WhatsApp session open.
 */
export function trackWhatsApp(market: Market): void {
  sendGAEvent('event', 'whatsapp_click', { market })
}

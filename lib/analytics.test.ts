// lib/analytics.test.ts
// Wave-0 RED scaffolds for analytics helper module (SEO-09c, SEO-09d, SEO-09e)
// These tests will pass GREEN after Plan 08-01 T03 creates lib/analytics.ts
// and Plan 08-01 T04 injects GoogleAnalytics.

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock @next/third-parties/google before importing analytics
vi.mock('@next/third-parties/google', () => ({
  sendGAEvent: vi.fn(),
}))

import { sendGAEvent } from '@next/third-parties/google'
import { trackBookATrial, trackEnquiry, trackWhatsApp } from './analytics'

describe('trackBookATrial', () => {
  beforeEach(() => vi.clearAllMocks())

  it('calls sendGAEvent with book-a-trial_submitted and market + venue', () => {
    trackBookATrial('hk', 'wan-chai')
    expect(sendGAEvent).toHaveBeenCalledWith('event', 'book-a-trial_submitted', {
      market: 'hk',
      venue: 'wan-chai',
    })
  })

  it('defaults venue to not-specified when omitted', () => {
    trackBookATrial('sg')
    expect(sendGAEvent).toHaveBeenCalledWith('event', 'book-a-trial_submitted', {
      market: 'sg',
      venue: 'not-specified',
    })
  })

  it('does NOT call sendGAEvent with wrong event name', () => {
    trackBookATrial('hk')
    expect(sendGAEvent).not.toHaveBeenCalledWith('event', 'bookATrial', expect.anything())
  })
})

describe('trackEnquiry', () => {
  beforeEach(() => vi.clearAllMocks())

  it('calls sendGAEvent with enquire_submitted and market', () => {
    trackEnquiry('root')
    expect(sendGAEvent).toHaveBeenCalledWith('event', 'enquire_submitted', {
      market: 'root',
    })
  })

  it('does NOT call sendGAEvent with wrong event name', () => {
    trackEnquiry('hk')
    expect(sendGAEvent).not.toHaveBeenCalledWith('event', 'enquireSubmitted', expect.anything())
  })
})

describe('trackWhatsApp', () => {
  beforeEach(() => vi.clearAllMocks())

  it('calls sendGAEvent with whatsapp_click and market', () => {
    trackWhatsApp('hk')
    expect(sendGAEvent).toHaveBeenCalledWith('event', 'whatsapp_click', {
      market: 'hk',
    })
  })

  it('does NOT call sendGAEvent with wrong event name', () => {
    trackWhatsApp('sg')
    expect(sendGAEvent).not.toHaveBeenCalledWith('event', 'whatsappClick', expect.anything())
  })
})

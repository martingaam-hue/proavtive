// booking-form.analytics.test.tsx
// Wave-0 RED → GREEN scaffold for book-a-trial_submitted event (SEO-09f)
// Tests that the BookingForm fires trackBookATrial on successful submission.
//
// Note: BookingForm is a named export (not default). Adapted from plan template.
// The component uses React state `venue` (not formData.venue) — venue is set via
// radio card interaction prior to submit.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// Mock analytics before importing the component
vi.mock('@/lib/analytics', () => ({
  trackBookATrial: vi.fn(),
  trackEnquiry: vi.fn(),
  trackWhatsApp: vi.fn(),
}))

// Mock next/navigation (BookingForm uses useSearchParams)
vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: () => null,
  }),
}))

// Mock fetch to simulate a successful API response
const mockFetch = vi.fn()
global.fetch = mockFetch

import { trackBookATrial } from '@/lib/analytics'
// Named export — not default
import { BookingForm } from './booking-form'

describe('BookingForm — GA4 analytics event', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({}) })
  })

  it('calls trackBookATrial with market hk and venue on successful submission', async () => {
    render(<BookingForm />)

    // Fill required fields — names from actual BookingForm implementation
    const nameInput = screen.getByLabelText(/your name/i)
    fireEvent.change(nameInput, { target: { value: 'Test Parent' } })

    const emailInput = screen.getByLabelText(/email/i)
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

    const childAgeInput = screen.getByLabelText(/child.*age/i)
    fireEvent.change(childAgeInput, { target: { value: '7' } })

    // Submit the form — button text is "Book free assessment"
    const submitButton = screen.getByRole('button', { name: /book free assessment/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(trackBookATrial).toHaveBeenCalledWith(
        'hk',
        expect.any(String) // venue value from component state (default: 'no-preference')
      )
    })
  })

  it('does NOT call trackBookATrial when fetch returns an error', async () => {
    mockFetch.mockResolvedValue({ ok: false, json: async () => ({}) })

    render(<BookingForm />)

    const submitButton = screen.getByRole('button', { name: /book free assessment/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(trackBookATrial).not.toHaveBeenCalled()
    })
  })
})

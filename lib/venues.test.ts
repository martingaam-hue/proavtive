// lib/venues.test.ts
// Wave-0 RED scaffolds for NAP canonical venue constants (SEO-10)
// Will be GREEN after Plan 08-03 creates lib/venues.ts

import { describe, it, expect } from 'vitest'
import { VENUES } from './venues'

const REQUIRED_FIELDS = [
  'name', 'shortName', 'address', 'locality', 'region', 'country', 'slug', 'market',
] as const

describe('VENUES — NAP shape assertions', () => {
  it('exports wanChai with all required NAP fields', () => {
    for (const field of REQUIRED_FIELDS) {
      expect(VENUES.wanChai).toHaveProperty(field)
      expect(typeof (VENUES.wanChai as Record<string, unknown>)[field]).toBe('string')
    }
  })

  it('exports cyberport with all required NAP fields', () => {
    for (const field of REQUIRED_FIELDS) {
      expect(VENUES.cyberport).toHaveProperty(field)
    }
  })

  it('exports katongPoint with all required NAP fields', () => {
    for (const field of REQUIRED_FIELDS) {
      expect(VENUES.katongPoint).toHaveProperty(field)
    }
  })

  it('wanChai.country is HK', () => {
    expect(VENUES.wanChai.country).toBe('HK')
  })

  it('cyberport.country is HK', () => {
    expect(VENUES.cyberport.country).toBe('HK')
  })

  it('katongPoint.country is SG', () => {
    expect(VENUES.katongPoint.country).toBe('SG')
  })

  it('katongPoint.postalCode is 427664', () => {
    expect(VENUES.katongPoint.postalCode).toBe('427664')
  })

  it('no venue has a placeholder string in the address field', () => {
    const placeholderPatterns = ['HUMAN-ACTION', 'REPLACE_WITH', 'TBD', 'verify with client']
    for (const [key, venue] of Object.entries(VENUES)) {
      for (const pattern of placeholderPatterns) {
        expect(
          (venue as { address: string }).address,
          `${key}.address must not contain "${pattern}"`
        ).not.toContain(pattern)
      }
    }
  })
})

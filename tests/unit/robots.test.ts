import { describe, it, expect } from 'vitest'

// These tests will become real assertions in Wave 1 when robots.ts files are created.

describe('HK robots', () => {
  it('TODO: returns allow-all rule for all user agents', () => {
    // Wave 1: import robots from '../../app/hk/robots'
    // const r = robots()
    // expect(r.rules).toMatchObject({ userAgent: '*', allow: '/' })
    expect(true).toBe(true)
  })

  it('TODO: sitemap URL points to production origin', () => {
    // Wave 1: expect(r.sitemap).toBe('https://hk.proactivsports.com/sitemap.xml')
    expect(true).toBe(true)
  })

  it('TODO: host field is hk.proactivsports.com', () => {
    // Wave 1: expect(r.host).toBe('hk.proactivsports.com')
    expect(true).toBe(true)
  })
})

describe('SG robots', () => {
  it('TODO: returns allow-all and correct sitemap for SG', () => {
    expect(true).toBe(true)
  })
})

describe('Root robots', () => {
  it('TODO: returns allow-all and correct sitemap for root', () => {
    expect(true).toBe(true)
  })
})

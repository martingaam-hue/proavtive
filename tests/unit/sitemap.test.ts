import { describe, it, expect } from 'vitest'

// These imports will FAIL (RED) until Wave 1 creates the sitemap files.
// Placeholder structure — Wave 1 executor fills in real import paths.

describe('HK sitemap', () => {
  it('TODO: returns array of URLs starting with https://hk.proactivsports.com/', () => {
    // Wave 1: import sitemap from '../../app/hk/sitemap'
    // const urls = sitemap()
    // expect(urls.every((entry) => entry.url.startsWith('https://hk.proactivsports.com/'))).toBe(true)
    expect(true).toBe(true) // placeholder until Wave 1
  })

  it('TODO: homepage entry has priority 1', () => {
    // Wave 1 fills this in
    expect(true).toBe(true)
  })

  it('TODO: all URLs have trailing slashes', () => {
    // Wave 1: sitemap().forEach(entry => expect(entry.url.endsWith('/')).toBe(true))
    expect(true).toBe(true)
  })

  it('TODO: no vercel.app URLs appear in sitemap output', () => {
    // Wave 1: sitemap().forEach(entry => expect(entry.url).not.toContain('vercel.app'))
    expect(true).toBe(true)
  })
})

describe('SG sitemap', () => {
  it('TODO: returns array of URLs starting with https://sg.proactivsports.com/', () => {
    expect(true).toBe(true)
  })
})

describe('Root sitemap', () => {
  it('TODO: returns array of URLs starting with https://proactivsports.com/', () => {
    expect(true).toBe(true)
  })
})

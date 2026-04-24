import { describe, it, expect } from 'vitest'
import hkSitemap from '../../app/hk/sitemap'
import sgSitemap from '../../app/sg/sitemap'
import rootSitemap from '../../app/root/sitemap'

describe('HK sitemap', () => {
  it('returns array of URLs all starting with https://hk.proactivsports.com/', () => {
    const urls = hkSitemap()
    expect(urls.every((entry) => entry.url.startsWith('https://hk.proactivsports.com/'))).toBe(true)
  })

  it('homepage entry has priority 1', () => {
    const urls = hkSitemap()
    const homepage = urls.find((e) => e.url === 'https://hk.proactivsports.com/')
    expect(homepage?.priority).toBe(1)
  })

  it('all URLs have trailing slashes', () => {
    const urls = hkSitemap()
    urls.forEach((entry) => {
      expect(entry.url.endsWith('/')).toBe(true)
    })
  })

  it('no vercel.app URLs appear in sitemap output', () => {
    const urls = hkSitemap()
    urls.forEach((entry) => {
      expect(entry.url).not.toContain('vercel.app')
    })
  })

  it('includes wan-chai location page at priority 0.9', () => {
    const urls = hkSitemap()
    const wanChai = urls.find((e) => e.url === 'https://hk.proactivsports.com/wan-chai/')
    expect(wanChai?.priority).toBe(0.9)
  })

  it('includes all 8 gymnastics sub-pages', () => {
    const urls = hkSitemap()
    const gymSubPages = urls.filter((e) => e.url.includes('/gymnastics/') && e.url !== 'https://hk.proactivsports.com/gymnastics/')
    expect(gymSubPages.length).toBe(8)
  })
})

describe('SG sitemap', () => {
  it('returns array of URLs all starting with https://sg.proactivsports.com/', () => {
    const urls = sgSitemap()
    expect(urls.every((entry) => entry.url.startsWith('https://sg.proactivsports.com/'))).toBe(true)
  })

  it('no vercel.app URLs appear', () => {
    const urls = sgSitemap()
    urls.forEach((entry) => {
      expect(entry.url).not.toContain('vercel.app')
    })
  })

  it('includes katong-point at priority 0.9', () => {
    const urls = sgSitemap()
    const katong = urls.find((e) => e.url === 'https://sg.proactivsports.com/katong-point/')
    expect(katong?.priority).toBe(0.9)
  })
})

describe('Root sitemap', () => {
  it('returns array of URLs all starting with https://proactivsports.com/', () => {
    const urls = rootSitemap()
    expect(urls.every((entry) => entry.url.startsWith('https://proactivsports.com/'))).toBe(true)
  })

  it('homepage has priority 1', () => {
    const urls = rootSitemap()
    const homepage = urls.find((e) => e.url === 'https://proactivsports.com/')
    expect(homepage?.priority).toBe(1)
  })
})

import { describe, it, expect } from 'vitest'
import hkRobots from '../../app/hk/robots'
import sgRobots from '../../app/sg/robots'
import rootRobots from '../../app/root/robots'

describe('HK robots', () => {
  it('returns allow-all rule for all user agents', () => {
    const r = hkRobots()
    expect(r.rules).toMatchObject({ userAgent: '*', allow: '/' })
  })

  it('sitemap URL points to HK production origin', () => {
    const r = hkRobots()
    expect(r.sitemap).toBe('https://hk.proactivsports.com/sitemap.xml')
  })

  it('host field is hk.proactivsports.com', () => {
    const r = hkRobots()
    expect(r.host).toBe('hk.proactivsports.com')
  })
})

describe('SG robots', () => {
  it('returns allow-all and correct sitemap for SG', () => {
    const r = sgRobots()
    expect(r.rules).toMatchObject({ userAgent: '*', allow: '/' })
    expect(r.sitemap).toBe('https://sg.proactivsports.com/sitemap.xml')
  })
})

describe('Root robots', () => {
  it('returns allow-all and correct sitemap for root', () => {
    const r = rootRobots()
    expect(r.rules).toMatchObject({ userAgent: '*', allow: '/' })
    expect(r.sitemap).toBe('https://proactivsports.com/sitemap.xml')
  })
})

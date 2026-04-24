import { describe, it, expect } from 'vitest'
import { GET as hkGET } from '../../app/hk/llms.txt/route'
import { GET as sgGET } from '../../app/sg/llms.txt/route'
import { GET as rootGET } from '../../app/root/llms.txt/route'

describe('HK llms.txt route', () => {
  it('response Content-Type is text/plain; charset=utf-8', async () => {
    const res = await hkGET()
    expect(res.headers.get('Content-Type')).toBe('text/plain; charset=utf-8')
  })

  it('response body starts with # H1 heading (required by llmstxt.org spec)', async () => {
    const res = await hkGET()
    const text = await res.text()
    expect(text.trim().startsWith('# ')).toBe(true)
  })

  it('response body contains blockquote (> ) as required by spec', async () => {
    const res = await hkGET()
    const text = await res.text()
    expect(text).toContain('\n> ')
  })

  it('response body contains no H3 or deeper headings (spec violation)', async () => {
    const res = await hkGET()
    const text = await res.text()
    expect(text).not.toMatch(/^###/m)
  })

  it('response body contains no HTML markup', async () => {
    const res = await hkGET()
    const text = await res.text()
    expect(text).not.toMatch(/<[a-z][\s\S]*>/i)
  })

  it('contains ## Optional section', async () => {
    const res = await hkGET()
    const text = await res.text()
    expect(text).toContain('## Optional')
  })
})

describe('SG llms.txt route', () => {
  it('passes spec checks: H1, blockquote, no H3, no HTML', async () => {
    const res = await sgGET()
    const text = await res.text()
    expect(text.trim().startsWith('# ')).toBe(true)
    expect(text).toContain('\n> ')
    expect(text).not.toMatch(/^###/m)
    expect(text).not.toMatch(/<[a-z][\s\S]*>/i)
  })
})

describe('Root llms.txt route', () => {
  it('passes spec checks: H1, blockquote, no H3, no HTML', async () => {
    const res = await rootGET()
    const text = await res.text()
    expect(text.trim().startsWith('# ')).toBe(true)
    expect(text).toContain('\n> ')
    expect(text).not.toMatch(/^###/m)
    expect(text).not.toMatch(/<[a-z][\s\S]*>/i)
  })
})

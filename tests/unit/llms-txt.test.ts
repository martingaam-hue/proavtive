import { describe, it, expect } from 'vitest'

// Wave 1 will convert these TODOs to real assertions that call GET() from the route handlers.

describe('HK llms.txt route', () => {
  it('TODO: response Content-Type is text/plain; charset=utf-8', () => {
    // Wave 1: const res = await GET()
    // expect(res.headers.get('Content-Type')).toBe('text/plain; charset=utf-8')
    expect(true).toBe(true)
  })

  it('TODO: response body starts with # (H1 heading required by spec)', () => {
    // Wave 1: const text = await res.text()
    // expect(text.trim().startsWith('# ')).toBe(true)
    expect(true).toBe(true)
  })

  it('TODO: response body contains blockquote (> ) as required by llmstxt.org spec', () => {
    // Wave 1: expect(text).toContain('\n> ')
    expect(true).toBe(true)
  })

  it('TODO: response body contains no H3 or deeper headings (spec violation)', () => {
    // Wave 1: expect(text).not.toMatch(/^###/m)
    expect(true).toBe(true)
  })

  it('TODO: response body contains no HTML markup', () => {
    // Wave 1: expect(text).not.toMatch(/<[a-z][\s\S]*>/i)
    expect(true).toBe(true)
  })
})

describe('SG llms.txt route', () => {
  it('TODO: passes same checks as HK', () => {
    expect(true).toBe(true)
  })
})

describe('Root llms.txt route', () => {
  it('TODO: passes same checks as HK', () => {
    expect(true).toBe(true)
  })
})

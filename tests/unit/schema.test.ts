import { describe, it, expect } from 'vitest'
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
  buildLocalBusinessSchema,
  buildFAQPageSchema,
  buildBreadcrumbs,
  buildServiceSchema,
  buildEventSchema,
  buildPersonSchema,
  buildBlogPostingSchema,
  buildOpeningHoursSchema,
  buildGraph,
  CYBERPORT_GEO,
  type VenueData,
  type CampEntry,
  type CoachData,
} from '../../lib/schema'

describe('buildOrganizationSchema', () => {
  it('contains the locked @id', () => {
    const schema = buildOrganizationSchema() as Record<string, unknown>
    expect(schema['@id']).toBe('https://proactivsports.com/#organization')
  })
  it('has @type Organization', () => {
    const schema = buildOrganizationSchema() as Record<string, unknown>
    expect(schema['@type']).toBe('Organization')
  })
  it('includes subOrganization referencing all three venue @ids', () => {
    const schema = buildOrganizationSchema() as Record<string, unknown>
    const subs = schema.subOrganization as Array<{ '@id': string }>
    expect(subs.map((s) => s['@id'])).toContain('https://hk.proactivsports.com/#localbusiness-wanchai')
    expect(subs.map((s) => s['@id'])).toContain('https://hk.proactivsports.com/#localbusiness-cyberport')
    expect(subs.map((s) => s['@id'])).toContain('https://sg.proactivsports.com/#localbusiness-katong')
  })
})

describe('buildWebSiteSchema', () => {
  it('produces correct @id for root market', () => {
    const schema = buildWebSiteSchema('root') as Record<string, unknown>
    expect(schema['@id']).toBe('https://proactivsports.com/#website')
  })
  it('produces correct url for hk market', () => {
    const schema = buildWebSiteSchema('hk') as Record<string, unknown>
    expect(schema.url).toBe('https://hk.proactivsports.com/')
  })
  it('produces correct url for sg market', () => {
    const schema = buildWebSiteSchema('sg') as Record<string, unknown>
    expect(schema.url).toBe('https://sg.proactivsports.com/')
  })
})

describe('buildFAQPageSchema', () => {
  const items = [
    { question: 'What age can children start?', answer: 'From 12 months old.' },
    { question: 'Where are you located?', answer: 'Wan Chai and Cyberport.' },
  ]
  it('has @type FAQPage', () => {
    const schema = buildFAQPageSchema(items) as Record<string, unknown>
    expect(schema['@type']).toBe('FAQPage')
  })
  it('maps question text verbatim to name field', () => {
    const schema = buildFAQPageSchema(items) as Record<string, unknown>
    const entities = schema.mainEntity as Array<{ name: string; acceptedAnswer: { text: string } }>
    expect(entities[0].name).toBe('What age can children start?')
  })
  it('maps answer text verbatim to acceptedAnswer.text', () => {
    const schema = buildFAQPageSchema(items) as Record<string, unknown>
    const entities = schema.mainEntity as Array<{ name: string; acceptedAnswer: { text: string } }>
    expect(entities[0].acceptedAnswer.text).toBe('From 12 months old.')
  })
})

describe('buildBreadcrumbs', () => {
  it('assigns correct positions', () => {
    const crumbs = buildBreadcrumbs([
      { name: 'Home', item: 'https://hk.proactivsports.com/' },
      { name: 'Gymnastics', item: 'https://hk.proactivsports.com/gymnastics/' },
    ]) as Record<string, unknown>
    const elements = crumbs.itemListElement as Array<{ position: number; item: string }>
    expect(elements[0].position).toBe(1)
    expect(elements[1].position).toBe(2)
  })
})

describe('buildServiceSchema', () => {
  it('references organization via @id', () => {
    const schema = buildServiceSchema({
      name: 'Gymnastics Classes',
      description: 'Weekly gymnastics for children',
      url: 'https://hk.proactivsports.com/gymnastics/',
      provider: 'https://proactivsports.com/#organization',
      areaServed: 'Hong Kong',
    }) as Record<string, unknown>
    const provider = schema.provider as { '@id': string }
    expect(provider['@id']).toBe('https://proactivsports.com/#organization')
  })
})

describe('buildGraph', () => {
  it('wraps schemas in @graph array', () => {
    const org = buildOrganizationSchema()
    const web = buildWebSiteSchema('root')
    const graph = buildGraph(org, web) as Record<string, unknown>
    expect(graph['@graph']).toHaveLength(2)
  })
  it('strips inner @context from graph members', () => {
    const org = buildOrganizationSchema()
    const graph = buildGraph(org) as Record<string, unknown>
    const members = graph['@graph'] as Array<Record<string, unknown>>
    expect(members[0]['@context']).toBeUndefined()
  })
})

describe('CYBERPORT_GEO', () => {
  it('has latitude and longitude', () => {
    expect(CYBERPORT_GEO.latitude).toBe(22.2607)
    expect(CYBERPORT_GEO.longitude).toBe(114.1296)
  })
})

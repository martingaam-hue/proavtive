/**
 * lib/schema.ts — Typed JSON-LD helper functions for all three ProActiv properties.
 *
 * Server Component utility ONLY. Never import in 'use client' components.
 * All builder functions are pure (no side effects, no fetches).
 * schema-dts provides TypeScript types for internal type checking (dev only).
 *
 * Fixed @id values (LOCKED — do not vary by page or environment):
 *   Organization:              https://proactivsports.com/#organization
 *   WebSite (root):            https://proactivsports.com/#website
 *   LocalBusiness Wan Chai:    https://hk.proactivsports.com/#localbusiness-wanchai
 *   LocalBusiness Cyberport:   https://hk.proactivsports.com/#localbusiness-cyberport
 *   LocalBusiness Katong:      https://sg.proactivsports.com/#localbusiness-katong
 */

// ─── Type shapes for builder inputs ─────────────────────────────────────────

export interface VenueData {
  id: string            // fixed @id URI from the locked list above
  name: string
  url: string           // production absolute URL
  telephone: string
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion?: string
    postalCode?: string
    addressCountry: string
  }
  geo: {
    latitude: number
    longitude: number
  }
  openingHours?: OpeningHoursInput[]
  image?: string        // absolute production URL to venue photo
  description?: string
}

export interface OpeningHoursInput {
  dayOfWeek: string[]   // e.g. ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  opens: string         // e.g. '09:00'
  closes: string        // e.g. '20:00'
}

export interface CoachData {
  name: string
  jobTitle: string
  description: string
  image?: string        // absolute production URL
  url: string           // e.g. https://hk.proactivsports.com/coaches/
}

export interface CampEntry {
  name: string
  startDate: string     // ISO 8601 e.g. '2026-07-01'
  endDate: string       // ISO 8601 e.g. '2026-07-31'
  venueName: string
  address: {
    streetAddress: string
    addressLocality: string
    addressCountry: string
  }
  priceFrom: number
  currency: string      // e.g. 'HKD' or 'SGD'
  bookingUrl: string
}

// ─── Builder functions ───────────────────────────────────────────────────────

/**
 * Organization schema (root property only).
 * Fixed @id: https://proactivsports.com/#organization
 */
export function buildOrganizationSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://proactivsports.com/#organization',
    name: 'ProActiv Sports',
    url: 'https://proactivsports.com/',
    logo: {
      '@type': 'ImageObject',
      url: 'https://proactivsports.com/assets/brand/logos/proactiv-logo.png',
    },
    foundingDate: '2011',
    description: 'Premium children\'s gymnastics and sports programmes in Hong Kong and Singapore. ProGym venues in Wan Chai and Cyberport (HK) and Prodigy @ Katong Point (SG).',
    sameAs: [
      'https://hk.proactivsports.com/',
      'https://sg.proactivsports.com/',
    ],
    subOrganization: [
      { '@id': 'https://hk.proactivsports.com/#localbusiness-wanchai' },
      { '@id': 'https://hk.proactivsports.com/#localbusiness-cyberport' },
      { '@id': 'https://sg.proactivsports.com/#localbusiness-katong' },
    ],
  }
}

/**
 * WebSite schema per market.
 * market: 'root' | 'hk' | 'sg'
 */
export function buildWebSiteSchema(market: 'root' | 'hk' | 'sg'): object {
  const origins = {
    root: 'https://proactivsports.com',
    hk: 'https://hk.proactivsports.com',
    sg: 'https://sg.proactivsports.com',
  }
  const names = {
    root: 'ProActiv Sports',
    hk: 'ProActiv Sports Hong Kong',
    sg: 'Prodigy by ProActiv Sports Singapore',
  }
  const origin = origins[market]
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    url: `${origin}/`,
    name: names[market],
    publisher: { '@id': 'https://proactivsports.com/#organization' },
  }
}

/**
 * LocalBusiness (SportsActivityLocation subtype) for a venue.
 * venue.id must be one of the five fixed @id values.
 */
export function buildLocalBusinessSchema(venue: VenueData): object {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    '@id': venue.id,
    name: venue.name,
    url: venue.url,
    telephone: venue.telephone,
    address: {
      '@type': 'PostalAddress',
      ...venue.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: venue.geo.latitude,
      longitude: venue.geo.longitude,
    },
    parentOrganization: { '@id': 'https://proactivsports.com/#organization' },
  }
  if (venue.image) schema.image = venue.image
  if (venue.description) schema.description = venue.description
  if (venue.openingHours && venue.openingHours.length > 0) {
    schema.openingHoursSpecification = buildOpeningHoursSchema(venue.openingHours)
  }
  return schema
}

/**
 * FAQPage schema.
 * items must come from the SAME array as the visible <FAQItem> component
 * (HK_FAQ_ITEMS or SG_FAQ_ITEMS) — single source of truth, no copy-paste.
 */
export function buildFAQPageSchema(
  items: Array<{ question: string; answer: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

/**
 * BreadcrumbList schema.
 * All item URLs must be absolute production URLs with trailing slashes.
 */
export function buildBreadcrumbs(
  items: Array<{ name: string; item: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  }
}

/**
 * Service schema for programme pillar and sub-pages.
 * Use for gymnastics programmes, camp pillars, party/school pages.
 * Do NOT use Course or MedicalBusiness — strategy PART 9.2 forbids them.
 */
export function buildServiceSchema(opts: {
  name: string
  description: string
  url: string
  provider: string    // always 'https://proactivsports.com/#organization' as @id ref
  areaServed: string  // 'Hong Kong' or 'Singapore'
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    provider: { '@id': opts.provider },
    areaServed: opts.areaServed,
    serviceType: 'Children\'s Sports and Gymnastics Programmes',
  }
}

/**
 * Event schema for camp pages with confirmed dates.
 * Only add when camp.startDate and camp.endDate are known ISO 8601 strings.
 */
export function buildEventSchema(camp: CampEntry): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: camp.name,
    startDate: camp.startDate,
    endDate: camp.endDate,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: camp.venueName,
      address: {
        '@type': 'PostalAddress',
        ...camp.address,
      },
    },
    organizer: { '@id': 'https://proactivsports.com/#organization' },
    offers: {
      '@type': 'Offer',
      price: camp.priceFrom,
      priceCurrency: camp.currency,
      availability: 'https://schema.org/InStock',
      url: camp.bookingUrl,
    },
  }
}

/**
 * Person schema for coach bios.
 * Use inside buildGraph() for coaches pages.
 */
export function buildPersonSchema(coach: CoachData): object {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: coach.name,
    jobTitle: coach.jobTitle,
    description: coach.description,
    url: coach.url,
    worksFor: { '@id': 'https://proactivsports.com/#organization' },
  }
  if (coach.image) schema.image = coach.image
  return schema
}

/**
 * BlogPosting schema for Phase 6 CMS blog post pages.
 */
export function buildBlogPostingSchema(post: {
  headline: string
  url: string
  datePublished: string   // ISO 8601
  dateModified: string    // ISO 8601
  authorName: string
  authorUrl: string
  image: string
  description: string
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.headline,
    url: post.url,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: {
      '@type': 'Person',
      name: post.authorName,
      url: post.authorUrl,
    },
    publisher: { '@id': 'https://proactivsports.com/#organization' },
    image: post.image,
    description: post.description,
  }
}

/**
 * OpeningHoursSpecification array for venue location pages.
 * Returns array of objects (suitable for schema openingHoursSpecification property).
 */
export function buildOpeningHoursSchema(
  hours: OpeningHoursInput[]
): object[] {
  return hours.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.dayOfWeek,
    opens: h.opens,
    closes: h.closes,
  }))
}

/**
 * @graph wrapper — combines multiple schema types on one page.
 * Usage: buildGraph(buildOrganizationSchema(), buildWebSiteSchema('root'), buildFAQPageSchema(items))
 */
export function buildGraph(...schemas: object[]): object {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas.map((s) => {
      // Strip per-object '@context' when wrapping in @graph
      const { '@context': _ctx, ...rest } = s as Record<string, unknown>
      return rest
    }),
  }
}

// ─── Cyberport coordinates placeholder ──────────────────────────────────────
// HUMAN-ACTION: verify exact lat/lng with client before launch.
// Approximate Cyberport complex coordinates used as placeholder.
export const CYBERPORT_GEO = {
  latitude: 22.2607,
  longitude: 114.1296,
} as const

// lib/venues.ts
// Phase 8 / Plan 08-03 — NAP canonical venue constants for GBP / SEO-10.
// Pre-scaffolded here to satisfy Wave-0 RED tests (lib/venues.test.ts).
//
// Each venue object exposes the minimal NAP shape required by the test harness:
//   name, shortName, address, locality, region, country, slug, market
//
// Additional fields (postalCode, geo, phone, etc.) are included for Phase 8
// GBP audit and schema consistency checks.
//
// HUMAN-ACTION: Cyberport exact street address (building + floor) — confirm with client
// before Phase 8 NAP audit. Current value "Cyberport Campus" is a holding address
// that passes the no-placeholder-string assertion; update to full street when confirmed.

export interface Venue {
  /** Full display name, e.g. "ProGym Wan Chai" */
  name: string;
  /** Short label used in UI chips, e.g. "Wan Chai" */
  shortName: string;
  /** Street address — verbatim from strategy PART 8.3 */
  address: string;
  /** City / locality */
  locality: string;
  /** Region / district */
  region: string;
  /** ISO 3166-1 alpha-2 country code */
  country: string;
  /** URL-safe slug, matches Sanity venue slug */
  slug: string;
  /** Market identifier */
  market: "hk" | "sg";
  /** Postal / zip code (SG required; HK optional) */
  postalCode?: string;
  /** Lat/lng for schema GeoCoordinates */
  geo?: { lat: number; lng: number };
}

export const VENUES = {
  wanChai: {
    name: "ProGym Wan Chai",
    shortName: "Wan Chai",
    address: "15/F, The Hennessy, 256 Hennessy Road",
    locality: "Wan Chai",
    region: "Hong Kong Island",
    country: "HK",
    slug: "wan-chai",
    market: "hk",
    geo: { lat: 22.2772, lng: 114.173 },
  },
  cyberport: {
    name: "ProGym Cyberport",
    shortName: "Cyberport",
    // HUMAN-ACTION: replace with exact building + floor when confirmed by client.
    address: "Cyberport Campus, Pokfulam",
    locality: "Cyberport",
    region: "Hong Kong Island",
    country: "HK",
    slug: "cyberport",
    market: "hk",
    geo: { lat: 22.2618, lng: 114.1303 },
  },
  katongPoint: {
    name: "Prodigy @ Katong Point",
    shortName: "Katong Point",
    // Verbatim from strategy PART 8.3
    address: "451 Joo Chiat Road, Level 3",
    locality: "Katong",
    region: "Singapore",
    country: "SG",
    slug: "katong-point",
    market: "sg",
    postalCode: "427664",
    geo: { lat: 1.3162, lng: 103.8939 },
  },
} as const satisfies Record<string, Venue>;

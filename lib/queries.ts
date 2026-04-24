import { defineQuery } from 'next-sanity'

// ── Settings singletons ────────────────────────────────────────────────────

export const siteSettingsQuery = defineQuery(
  `*[_type == "siteSettings" && _id == "siteSettings"][0] {
    heroHeading,
    heroSubheading,
    heroCTAPrimary,
    heroCTASecondary,
    heroImage { asset, alt },
    trustLine
  }`,
)

export const hkSettingsQuery = defineQuery(
  `*[_type == "hkSettings" && _id == "hkSettings"][0] {
    heroHeading,
    heroSubheading,
    heroImage { asset, alt },
    heroCTALabel,
    featuredProgramme
  }`,
)

export const sgSettingsQuery = defineQuery(
  `*[_type == "sgSettings" && _id == "sgSettings"][0] {
    heroHeading,
    heroSubheading,
    heroImage { asset, alt },
    heroCTALabel,
    multiBallHighlight
  }`,
)

// ── Blog: homepage block (featured-first, 3 posts) ────────────────────────

export const homepageBlogQuery = defineQuery(
  `*[_type == "post"
    && defined(slug.current)
    && !(_id in path("drafts.**"))
    && market == $market
  ] | order(featured desc, publishedAt desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    featured,
    "mainImage": mainImage { asset, alt },
    "categories": categories[]->name,
    "readTime": round(length(pt::text(body)) / 5 / 200)
  }`,
)

// ── Blog: HK list ─────────────────────────────────────────────────────────

export const hkBlogListQuery = defineQuery(
  `*[_type == "post"
    && defined(slug.current)
    && !(_id in path("drafts.**"))
    && market == "hk"
  ] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "mainImage": mainImage { asset, alt },
    "categories": categories[]->name,
    "readTime": round(length(pt::text(body)) / 5 / 200)
  }`,
)

// ── Blog: SG list ─────────────────────────────────────────────────────────

export const sgBlogListQuery = defineQuery(
  `*[_type == "post"
    && defined(slug.current)
    && !(_id in path("drafts.**"))
    && market == "sg"
  ] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "mainImage": mainImage { asset, alt },
    "categories": categories[]->name,
    "readTime": round(length(pt::text(body)) / 5 / 200)
  }`,
)

// ── Blog: HK individual post by slug ─────────────────────────────────────

export const hkBlogPostBySlugQuery = defineQuery(
  `*[_type == "post"
    && slug.current == $slug
    && market == "hk"
    && !(_id in path("drafts.**"))
  ][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    body,
    "mainImage": mainImage { asset, alt },
    publishedAt,
    "readTime": round(length(pt::text(body)) / 5 / 200),
    "categories": categories[]->name,
    tags,
    "author": author-> {
      name,
      role,
      "portrait": portrait { asset, alt }
    },
    metaTitle,
    metaDescription,
    "ogImage": ogImage { asset, alt }
  }`,
)

// ── Blog: SG individual post by slug ─────────────────────────────────────

export const sgBlogPostBySlugQuery = defineQuery(
  `*[_type == "post"
    && slug.current == $slug
    && market == "sg"
    && !(_id in path("drafts.**"))
  ][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    body,
    "mainImage": mainImage { asset, alt },
    publishedAt,
    "readTime": round(length(pt::text(body)) / 5 / 200),
    "categories": categories[]->name,
    tags,
    "author": author-> {
      name,
      role,
      "portrait": portrait { asset, alt }
    },
    metaTitle,
    metaDescription,
    "ogImage": ogImage { asset, alt }
  }`,
)

// ── Blog: slug lists for generateStaticParams ─────────────────────────────

export const hkBlogSlugsQuery = defineQuery(
  `*[_type == "post" && defined(slug.current) && market == "hk" && !(_id in path("drafts.**"))] {
    "slug": slug.current
  }`,
)

export const sgBlogSlugsQuery = defineQuery(
  `*[_type == "post" && defined(slug.current) && market == "sg" && !(_id in path("drafts.**"))] {
    "slug": slug.current
  }`,
)

// ── Coaches ───────────────────────────────────────────────────────────────

export const hkCoachesQuery = defineQuery(
  `*[_type == "coach" && market == "hk"] | order(name asc) {
    _id,
    name,
    role,
    bio,
    venueTag,
    "portrait": portrait { asset, alt }
  }`,
)

export const sgCoachesQuery = defineQuery(
  `*[_type == "coach" && market == "sg"] | order(name asc) {
    _id,
    name,
    role,
    bio,
    venueTag,
    "portrait": portrait { asset, alt }
  }`,
)

// ── FAQ ───────────────────────────────────────────────────────────────────

export const hkFaqQuery = defineQuery(
  `*[_type == "faq" && market in ["hk", "root"]] | order(sortOrder asc, category asc) {
    _id,
    question,
    answer,
    category,
    sortOrder
  }`,
)

export const sgFaqQuery = defineQuery(
  `*[_type == "faq" && market in ["sg", "root"]] | order(sortOrder asc, category asc) {
    _id,
    question,
    answer,
    category,
    sortOrder
  }`,
)

// ── Venues ────────────────────────────────────────────────────────────────

export const venueBySlugQuery = defineQuery(
  `*[_type == "venue" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    market,
    address,
    city,
    countryCode,
    phone,
    whatsapp,
    openingHours,
    "heroImage": heroImage { asset, alt },
    "galleryImages": galleryImages[] { asset, alt },
    lat,
    lng
  }`,
)

// ── Camps ─────────────────────────────────────────────────────────────────

export const hkCampsQuery = defineQuery(
  `*[_type == "camp" && market == "hk"] | order(startDate asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "image": image { asset, alt },
    startDate,
    endDate,
    "venue": venue-> { name, address, city, countryCode },
    ageRange,
    price,
    priceCurrency,
    offerUrl
  }`,
)

export const sgCampsQuery = defineQuery(
  `*[_type == "camp" && market == "sg"] | order(startDate asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "image": image { asset, alt },
    startDate,
    endDate,
    "venue": venue-> { name, address, city, countryCode },
    ageRange,
    price,
    priceCurrency,
    offerUrl
  }`,
)

export const campBySlugQuery = defineQuery(
  `*[_type == "camp" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    "image": image { asset, alt },
    startDate,
    endDate,
    "venue": venue-> { name, address, city, countryCode, lat, lng },
    ageRange,
    capacity,
    price,
    priceCurrency,
    offerUrl,
    market
  }`,
)

// ── Testimonials ──────────────────────────────────────────────────────────

export const hkTestimonialsQuery = defineQuery(
  `*[_type == "testimonial" && market in ["hk", "root"]] | order(_createdAt desc) {
    _id,
    quote,
    authorName,
    authorRole,
    market
  }`,
)

export const sgTestimonialsQuery = defineQuery(
  `*[_type == "testimonial" && market in ["sg", "root"]] | order(_createdAt desc) {
    _id,
    quote,
    authorName,
    authorRole,
    market
  }`,
)

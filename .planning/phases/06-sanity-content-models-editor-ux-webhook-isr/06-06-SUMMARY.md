---
plan: 06-06
status: complete
commit: 0416d1f
---

# Plan 06-06 Summary — Dynamic Blog Post Pages (HK + SG)

## What was done

Created two new RSC dynamic routes for individual blog post pages.

### Files created

- `app/hk/blog/[slug]/page.tsx` — HK blog post page
- `app/sg/blog/[slug]/page.tsx` — SG blog post page

### Features implemented

| Feature | Detail |
|---------|--------|
| Data fetching | `hkBlogPostBySlugQuery` / `sgBlogPostBySlugQuery` via `sanityFetch` |
| `generateStaticParams` | Returns slug list from `hkBlogSlugsQuery` / `sgBlogSlugsQuery` |
| `generateMetadata` | `metaTitle ?? title`, `metaDescription ?? excerpt` fallbacks; OG image via `urlFor` (ogImage fallback to mainImage) |
| `notFound()` | Called when post is null |
| Author byline | `<SanityImage>` 40×40 rounded-full portrait with `alt` fallback to author name |
| Featured image | `width=896 height=504` with `priority` prop for LCP; `alt` fallback to post title |
| Portable Text | `<PortableText value={post.body} />` in narrow `max-w-2xl` reading column |
| BlogPosting JSON-LD | Stub with `headline`, `description`, `datePublished`, `author`, `image`, `publisher` |
| Category badges | `<Badge variant="secondary">` for each category |
| Date format | `en-GB` locale via `Intl.DateTimeFormat` (British English per brand voice) |
| ISR tags | `['post', 'post:${slug}']` for granular per-post cache invalidation |
| Next.js 15 | `params: Promise<{ slug: string }>` + `await params` before destructuring |
| Canonical URL | `hk.proactivsports.com/blog/${slug}/` / `sg.proactivsports.com/blog/${slug}/` |

### Layout

- Hero section: `Section size="lg" bg="default"`, `ContainerEditorial width="default"`, `max-w-3xl mx-auto`
- Body section: `Section size="md" bg="default"`, `ContainerEditorial width="default"`, `max-w-2xl mx-auto`
- Both sections use existing UI primitives consistent with rest of site

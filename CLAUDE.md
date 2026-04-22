<!-- GSD:project-start source:PROJECT.md -->
## Project

**ProActiv Sports — Website Ecosystem**

A 3-layer website ecosystem for **ProActiv Sports**, a children's gymnastics and sports provider founded in Hong Kong in 2011 and operating in Hong Kong (ProGym Wan Chai, ProGym Cyberport) and Singapore (Prodigy @ Katong Point). The system is one premium root gateway (`proactivsports.com`) plus two fully developed market subdomains (`hk.proactivsports.com`, `sg.proactivsports.com`), all backed by a single Sanity-driven CMS so the client team can independently publish blog content and update homepage media without developer help.

**Core Value:** **Convert affluent parents into trial bookings and enquiries** — every page must have a clear, fast path to *Book a Free Trial*, *Enquire*, or *WhatsApp*. SEO and LLM visibility serve that goal; they are not the goal.

### Constraints

- **Tech stack:** Next.js 15 (App Router, RSC) + Tailwind + shadcn/ui pattern + **Sanity CMS** + Vercel + Cloudflare (CDN/WAF) + Mux (video). Stack chosen by client decision; not open for re-debate without explicit re-discussion.
- **Repo shape:** **Single Next.js app** with subdomain middleware routing root / hk / sg to different page trees. Not three separate apps.
- **Domain:** `proactivsports.com` is owned but needs DNS transfer to Cloudflare → adds Phase 0 work before Phase 1.
- **Hosting:** Vercel (frontend) + Cloudflare (DNS, WAF, CDN). Sanity hosted.
- **CMS independence:** non-technical client team must be able to manage homepage visuals + publish blog without developer involvement. This is a hard requirement — anything that fails this is a v1.0 blocker.
- **Security:** Cloudflare WAF + bot management + rate limiting + secrets in Vercel env / 1Password Business. Sentry for runtime monitoring. No `.env` in git, ever.
- **Performance budget:** LCP < 2.5s, INP < 200ms, CLS < 0.1 on homepage and pillar pages (mobile, throttled). Lighthouse 95+ on the same set.
- **No black-hat SEO.** No PBNs, no doorway pages, no thin local pages, no keyword stuffing.
- **Brand fidelity:** existing palette + typography are honoured, not re-invented. No "AI-generated SaaS" aesthetic.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

| Skill | Description | Path |
|-------|-------------|------|
| aeo-geo | Audit your brand's AI search visibility and website GEO readiness. Supports two modes — visibility audit (are you being mentioned by AI?) and site audit (is your site optimized for AI?). Use when users ask about AI search performance, GEO/AEO scores, brand mentions in ChatGPT/Perplexity/Claude, AI crawler accessibility, llms.txt, or content optimization for generative engines. | `.claude/skills/aeo-geo/SKILL.md` |
| ai-seo | "When the user wants to optimize content for AI search engines, get cited by LLMs, or appear in AI-generated answers. Also use when the user mentions 'AI SEO,' 'AEO,' 'GEO,' 'LLMO,' 'answer engine optimization,' 'generative engine optimization,' 'LLM optimization,' 'AI Overviews,' 'optimize for ChatGPT,' 'optimize for Perplexity,' 'AI citations,' 'AI visibility,' 'zero-click search,' 'how do I show up in AI answers,' 'LLM mentions,' or 'optimize for Claude/Gemini.' Use this whenever someone wants their content to be cited or surfaced by AI assistants and AI search engines. For traditional technical and on-page SEO audits, see seo-audit. For structured data implementation, see schema-markup." | `.claude/skills/ai-seo/SKILL.md` |
| frontend-design | Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics. | `.claude/skills/frontend-design/SKILL.md` |
| geo-fix-llmstxt | Generate llms.txt and llms-full.txt files for a website to improve AI discoverability. Use when the user asks to create llms.txt, generate llms.txt, fix llms.txt, make site AI-readable, or mentions llms.txt generation. | `.claude/skills/geo-fix-llmstxt/SKILL.md` |
| lp-editor | Opinionated UI/UX editor for landing pages and marketing sites. Reviews, plans, and builds high-converting pages using proven conversion patterns. Use when the user asks to review a landing page, plan a landing page, build a landing page, critique a hero section, fix CTAs, improve copy, audit conversion elements, wireframe a page, or asks anything about landing page structure, headlines, social proof, pricing tables, FAQs, or page layout. Also use when the user shares a URL or screenshot of a marketing page and wants feedback, or when building any page meant to convert visitors. Trigger on mentions of "landing page", "hero section", "above the fold", "conversion", "CTA", "call to action", "headline copy", "social proof", "pricing page", "lead gen", "signup page", "sales page", "marketing site", or "LP". Do NOT use for dashboards, admin panels, or internal tools with no conversion goal. | `.claude/skills/lp-editor/SKILL.md` |
| page-cro | When the user wants to optimize, improve, or increase conversions on any marketing page — including homepage, landing pages, pricing pages, feature pages, or blog posts. Also use when the user says "CRO," "conversion rate optimization," "this page isn't converting," "improve conversions," "why isn't this page working," "my landing page sucks," "nobody's converting," "low conversion rate," "bounce rate is too high," "people leave without signing up," or "this page needs work." Use this even if the user just shares a URL and asks for feedback — they probably want conversion help. For signup/registration flows, see signup-flow-cro. For post-signup activation, see onboarding-cro. For forms outside of signup, see form-cro. For popups/modals, see popup-cro. | `.claude/skills/page-cro/SKILL.md` |
| page-seo | Optimize a webpage for traditional search engines (Google, Bing). Covers keyword research, competitor page analysis, on-page SEO audit with scoring, content optimization, and schema markup recommendations. Use when users ask about SEO scores, title tags, meta descriptions, keyword optimization, heading structure, internal linking, or structured data for search engines. | `.claude/skills/page-seo/SKILL.md` |
| schema-markup | When the user wants to add, fix, or optimize schema markup and structured data on their site. Also use when the user mentions "schema markup," "structured data," "JSON-LD," "rich snippets," "schema.org," "FAQ schema," "product schema," "review schema," "breadcrumb schema," "Google rich results," "knowledge panel," "star ratings in search," or "add structured data." Use this whenever someone wants their pages to show enhanced results in Google. For broader SEO issues, see seo-audit. For AI search optimization, see ai-seo. | `.claude/skills/schema-markup/SKILL.md` |
| seo | "Comprehensive SEO analysis for any website or business type. Full site audits, single-page analysis, technical SEO (crawlability, indexability, Core Web Vitals with INP), schema markup, content quality (E-E-A-T), image optimization, sitemap analysis, and GEO for AI Overviews/ChatGPT/Perplexity. Industry detection for SaaS, e-commerce, local, publishers, agencies. Triggers on: SEO, audit, schema, Core Web Vitals, sitemap, E-E-A-T, AI Overviews, GEO, technical SEO, content quality, page speed, structured data." | `.claude/skills/seo/SKILL.md` |
| seo-audit | When the user wants to audit, review, or diagnose SEO issues on their site. Also use when the user mentions "SEO audit," "technical SEO," "why am I not ranking," "SEO issues," "on-page SEO," "meta tags review," "SEO health check," "my traffic dropped," "lost rankings," "not showing up in Google," "site isn't ranking," "Google update hit me," "page speed," "core web vitals," "crawl errors," or "indexing issues." Use this even if the user just says something vague like "my SEO is bad" or "help with SEO" — start with an audit. For building pages at scale to target keywords, see programmatic-seo. For adding structured data, see schema-markup. For AI search optimization, see ai-seo. | `.claude/skills/seo-audit/SKILL.md` |
| seo-backlinks | "Backlink profile analysis: referring domains, anchor text distribution, toxic link detection, competitor gap analysis. Works with free APIs (Moz, Bing Webmaster, Common Crawl) and DataForSEO extension. Use when user says backlinks, link profile, referring domains, anchor text, toxic links, link gap, link building, disavow, or backlink audit." | `.claude/skills/seo-backlinks/SKILL.md` |
| seo-cluster | > SERP-based semantic topic clustering for content architecture planning. Groups keywords by actual Google SERP overlap (not text similarity), designs hub-and-spoke content clusters with internal link matrices, and generates interactive visualizations. Optionally executes content creation if claude-blog is installed. Use when user says "topic cluster", "content cluster", "semantic clustering", "pillar page", "hub and spoke", "content architecture", "keyword grouping", or "cluster plan". | `.claude/skills/seo-cluster/SKILL.md` |
| seo-competitor-pages | > Generate SEO-optimized competitor comparison and alternatives pages. Covers "X vs Y" layouts, "alternatives to X" pages, feature matrices, schema markup, and conversion optimization. Use when user says "comparison page", "vs page", "alternatives page", "competitor comparison", "X vs Y", "versus", "compare competitors", or "alternative to". | `.claude/skills/seo-competitor-pages/SKILL.md` |
| seo-content | > Content quality and E-E-A-T analysis with AI citation readiness assessment. Use when user says "content quality", "E-E-A-T", "content analysis", "readability check", "thin content", or "content audit". | `.claude/skills/seo-content/SKILL.md` |
| seo-dataforseo | > Live SEO data via DataForSEO MCP server. SERP analysis (Google, Bing, Yahoo, YouTube, Google Images), keyword research (volume, difficulty, intent, trends), backlink profiles, on-page analysis (Lighthouse, content parsing), competitor analysis, content analysis, business listings, AI visibility (ChatGPT scraper, LLM mention tracking), and domain analytics. Requires DataForSEO extension installed. Use when user says "dataforseo", "live SERP", "keyword volume", "backlink data", "competitor data", "AI visibility check", "LLM mentions", "image SERP", "google images", "image rankings", or "real search data". | `.claude/skills/seo-dataforseo/SKILL.md` |
| seo-drift | > SEO drift monitoring: capture baselines of SEO-critical elements, detect changes, and track regressions over time. Git for SEO — baseline, diff, and track changes to your on-page SEO. Use when user says "SEO drift", "baseline", "track changes", "did anything break", "SEO regression", "compare SEO", "before and after", "monitor SEO changes", or "deployment check". | `.claude/skills/seo-drift/SKILL.md` |
| seo-ecommerce | > E-commerce SEO analysis: Google Shopping visibility, Amazon marketplace intelligence, product schema validation, competitor pricing analysis, and marketplace keyword gaps. Combines on-page product SEO with marketplace data from DataForSEO Merchant API. Use when user says "ecommerce SEO", "product SEO", "Google Shopping", "marketplace SEO", "product schema", "Amazon SEO", "product listings", "shopping ads", or "merchant SEO". | `.claude/skills/seo-ecommerce/SKILL.md` |
| seo-geo | > Optimize content for AI Overviews (formerly SGE), ChatGPT web search, Perplexity, and other AI-powered search experiences. Generative Engine Optimization (GEO) analysis including brand mention signals, AI crawler accessibility, llms.txt compliance, passage-level citability scoring, and platform-specific optimization. Use when user says "AI Overviews", "SGE", "GEO", "AI search", "LLM optimization", "Perplexity", "AI citations", "ChatGPT search", or "AI visibility". | `.claude/skills/seo-geo/SKILL.md` |
| seo-google | > Google SEO APIs: Search Console (Search Analytics, URL Inspection, Sitemaps), PageSpeed Insights v5, CrUX field data with 25-week history, Indexing API v3, and GA4 organic traffic. Provides real Google field data for Core Web Vitals, indexation status, search performance, and organic traffic trends. Use when user says "search console", "GSC", "PageSpeed", "CrUX", "field data", "indexing API", "GA4 organic", "URL inspection", "google api setup", "real CWV data", "impressions", "clicks", "CTR", "position data", "LCP", "INP", "CLS", "FCP", "TTFB", or "Lighthouse scores". | `.claude/skills/seo-google/SKILL.md` |
| seo-hreflang | > Hreflang and international SEO audit, validation, and generation. Detects common mistakes, validates language/region codes, and generates correct hreflang implementations. Use when user says "hreflang", "i18n SEO", "international SEO", "multi-language", "multi-region", or "language tags". | `.claude/skills/seo-hreflang/SKILL.md` |
| seo-image-gen | "AI image generation for SEO assets: OG/social preview images, blog hero images, schema images, product photography, infographics. Powered by Gemini via nanobanana-mcp. Requires banana extension installed. Use when user says \"generate image\", \"OG image\", \"social preview\", \"hero image\", \"blog image\", \"product photo\", \"infographic\", \"seo image\", \"create visual\", \"image-gen\", \"favicon\", \"schema image\", \"pinterest pin\", \"generate visual\", \"banner\", or \"thumbnail\"." | `.claude/skills/seo-image-gen/SKILL.md` |
| seo-images | > Image optimization analysis for SEO and performance. Checks alt text, file sizes, formats, responsive images, lazy loading, CLS prevention, image SERP rankings (via DataForSEO), and image file optimization (WebP/AVIF conversion, IPTC/XMP metadata injection). Use when user says "image optimization", "alt text", "image SEO", "image size", "image audit", "optimize images", "image metadata", "image SERP", "convert to webp", or "image file optimize". | `.claude/skills/seo-images/SKILL.md` |
| seo-local | > Local SEO analysis covering Google Business Profile optimization, NAP consistency, citation health, review signals, local schema markup, location page quality, multi-location SEO, and industry-specific recommendations. Detects business type (brick-and-mortar, SAB, hybrid) and industry vertical (restaurant, healthcare, legal, home services, real estate, automotive). Use when user says "local SEO", "Google Business Profile", "GBP", "map pack", "local pack", "citations", "NAP consistency", "local rankings", "service area", "multi-location", or "local search". | `.claude/skills/seo-local/SKILL.md` |
| seo-maps | > Maps intelligence for local SEO — geo-grid rank tracking, GBP profile auditing via API, review intelligence across Google/Tripadvisor/Trustpilot, cross-platform NAP verification (Google/Bing/Apple/OSM), competitor radius mapping, and LocalBusiness schema generation from API data. Three-tier capability: free (Overpass + Geoapify), DataForSEO (full intelligence), DataForSEO + Google (maximum coverage). Use when user says "maps", "geo-grid", "rank tracking", "GBP audit", "review velocity", "competitor radius", "maps analysis", "local rank tracking", "Share of Local Voice", or "SoLV". | `.claude/skills/seo-maps/SKILL.md` |
| seo-page | > Deep single-page SEO analysis covering on-page elements, content quality, technical meta tags, schema, images, and performance. Use when user says "analyze this page", "check page SEO", "single URL", "check this page", "page analysis", or provides a single URL for review. | `.claude/skills/seo-page/SKILL.md` |
| seo-plan | > Strategic SEO planning for new or existing websites. Industry-specific templates, competitive analysis, content strategy, and implementation roadmap. Use when user says "SEO plan", "SEO strategy", "SEO planning", "content strategy", "keyword strategy", "content calendar", "site architecture", or "SEO roadmap". | `.claude/skills/seo-plan/SKILL.md` |
| seo-programmatic | > Programmatic SEO planning and analysis for pages generated at scale from data sources. Covers template engines, URL patterns, internal linking automation, thin content safeguards, and index bloat prevention. Use when user says "programmatic SEO", "pages at scale", "dynamic pages", "template pages", "generated pages", or "data-driven SEO". | `.claude/skills/seo-programmatic/SKILL.md` |
| seo-schema | > Detect, validate, and generate Schema.org structured data. JSON-LD format preferred. Use when user says "schema", "structured data", "rich results", "JSON-LD", or "markup". | `.claude/skills/seo-schema/SKILL.md` |
| seo-sitemap | > Analyze existing XML sitemaps or generate new ones with industry templates. Validates format, URLs, and structure. Use when user says "sitemap", "generate sitemap", "sitemap issues", or "XML sitemap". | `.claude/skills/seo-sitemap/SKILL.md` |
| seo-sxo | > Search Experience Optimization: reads Google SERPs backwards to detect page-type mismatches, derives user stories from search intent signals, and scores pages from multiple persona perspectives. Identifies why well-optimized pages fail to rank by analyzing what Google rewards for each keyword. Use when user says "SXO", "search experience", "page type mismatch", "SERP analysis", "user story", "persona scoring", "why isn't my page ranking", "intent mismatch", or "wireframe". | `.claude/skills/seo-sxo/SKILL.md` |
| seo-technical | > Technical SEO audit across 9 categories: crawlability, indexability, security, URL structure, mobile, Core Web Vitals, structured data, JavaScript rendering, and IndexNow protocol. Use when user says "technical SEO", "crawl issues", "robots.txt", "Core Web Vitals", "site speed", or "security headers". | `.claude/skills/seo-technical/SKILL.md` |
| web-artifacts-builder | Suite of tools for creating elaborate, multi-component claude.ai HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui). Use for complex artifacts requiring state management, routing, or shadcn/ui components - not for simple single-file HTML/JSX artifacts. | `.claude/skills/web-artifacts-builder/SKILL.md` |
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->

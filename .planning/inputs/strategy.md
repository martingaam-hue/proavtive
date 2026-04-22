# ProActiv Sports — Website Ecosystem Strategy
**Root Gateway + Hong Kong + Singapore | SEO, LLM Visibility, CMS & Conversion**

*Prepared as a category-dominant, authority-first strategy. Grounded in verified facts about ProActiv Sports — founded 2011 Hong Kong, expanded Singapore 2014, operating ProGym Wan Chai (15/F The Hennessy, 256 Hennessy Road), ProGym Cyberport (5,000 sq ft, opened August 2025), and Prodigy @ Katong Point (451 Joo Chiat Rd, Level 3 — Singapore's only MultiBall wall).*

---

## PART 1 — STRATEGIC SUMMARY

### The central idea

ProActiv Sports is not one business with two locations. It is **one brand operating two distinct market experiences**: a gymnastics-led, facility-anchored offer in Hong Kong (ProGym Wan Chai, ProGym Cyberport) and a multi-sports, Prodigy-branded experience in Singapore (Katong Point). A single homepage cannot do justice to either market without diluting both. Equally, two fully separate websites would lose the brand authority, trust, and topical depth that 14+ years of operation and a multi-market footprint rightly deserve.

The solution is a **three-layer brand ecosystem**:

1. **Layer 1 — Root Gateway** (`proactivsports.com`) — a premium, content-rich brand entry page that does three things at once: (a) confirms the brand entity and its markets for Google, LLMs, and humans, (b) routes visitors cleanly into the right market, and (c) carries umbrella-level authority through Organization schema, brand story, and cross-market trust signals. It is **not** a splash page. It is a genuine page.

2. **Layer 2 — Market Homepages** on subdomains (`hk.proactivsports.com`, `sg.proactivsports.com`) — each a fully developed, independently crawlable homepage with its own local SEO positioning, programme architecture, proof stack, and conversion flow. Each functions as a market authority hub.

3. **Layer 3 — Supporting Ecosystem** — location pages (Wan Chai, Cyberport, Katong Point), programme pages (gymnastics, camps, parties, sports classes, competitions), topical blog clusters, FAQ hub, coach bios, about/brand pages — the depth that turns homepages into category-dominant hubs.

### Why this architecture wins

- **Clarity for humans** — affluent parents landing on the root instantly understand ProActiv is their option in both cities, then choose their market with zero friction.
- **Clarity for Google** — each subdomain has a focused geographic intent signature, clean location schema, and distinct GBP pairing, while shared Organization schema and internal links flow authority across the ecosystem.
- **Clarity for LLMs** — explicit entity statements ("ProActiv Sports is a children's gymnastics and sports provider founded in 2011 in Hong Kong, operating in Hong Kong and Singapore") repeated with consistent phrasing across the ecosystem make the brand highly citable in AI answers.
- **Future scalability** — if ProActiv enters a third market, the pattern plugs in cleanly (`xx.proactivsports.com`) without re-architecting.
- **Safety from the legacy `.net` reputation** — moving to a fresh primary domain with disciplined 301 mapping neutralises historic malware/black-hat concerns and lets the new ecosystem build authority from a clean slate.

### The three jobs the website must do

1. **Convert parents into trial bookings and enquiries.** Every page has a clear path to *Book a Free Trial*, *Enquire*, or *WhatsApp*.
2. **Dominate local and category search** in Hong Kong and Singapore for high-intent children's sports, gymnastics, camp, and party queries.
3. **Earn AI / LLM citation** — when a parent asks ChatGPT, Perplexity, Gemini, or Claude "where can I take my child for gymnastics in Wan Chai?" or "best kids' holiday camps in Singapore?", ProActiv is named and correctly described.

### Design philosophy

Premium, warm, kinetic, unmistakably ProActiv — **not** the sterile SaaS-gradient aesthetic of AI-generated sites. The design language leans into **motion, real photography of real coaches and real children, asymmetric editorial layouts, and confident typography** — more *premium kids' brand editorial* than *tech startup*. Brand colours from the current site are honoured and elevated (not replaced); the visual system adds contrast, spacing, and hierarchy.

---

## PART 2 — SITE ARCHITECTURE

### Domain strategy

| Tier | Domain | Purpose |
|------|--------|---------|
| **Primary** | `proactivsports.com` *(new, clean .com)* | Root gateway, brand umbrella |
| **HK market** | `hk.proactivsports.com` | Hong Kong homepage + HK supporting pages |
| **SG market** | `sg.proactivsports.com` | Singapore homepage + SG supporting pages |
| **Legacy** | `proactivsports.net`, `hk.proactivsports.net`, `sg.proactivsports.net` | 301 redirected URL-by-URL to the new ecosystem, then quarantined |

**Why subdomains over subfolders here:** The brief specifies subdomains, and the existing setup uses them. Subdomains are defensible for this case because the two markets have genuinely different anchor facilities, programme mix (Prodigy/Multi-sports in SG, gymnastics-anchored in HK), coaching teams, and even age-range emphasis (HK serves 12 months up; SG camps primarily 4–12). They also make it easy to run distinct Google Search Console properties, GA4 streams, and sitemaps per market. The mitigation for the known authority-split drawback is an aggressive cross-linking pattern, shared Organization schema, and a root page that earns external links on its own merit.

### Full ecosystem sitemap

```
proactivsports.com (ROOT)
├── / ............................... Gateway landing (market selector + brand)
├── /brand/ .......................... About ProActiv Sports (entity page)
├── /coaching-philosophy/ ............ Methodology & safety standards (shared)
├── /news/ ........................... Press & media mentions
├── /careers/ ........................ Coach & staff recruitment
├── /contact/ ........................ Master contact page with market routing
└── /legal/, /privacy/, /terms/ ...... Compliance

hk.proactivsports.com (HONG KONG)
├── / ............................... HK homepage
├── /wan-chai/ ...................... ProGym Wan Chai location page
├── /cyberport/ ..................... ProGym Cyberport location page
├── /gymnastics/ .................... Gymnastics programmes pillar
│   ├── /toddlers/ .................. 12mo–3yr (Babies & Toddlers)
│   ├── /beginner/ .................. 4–6yr foundation
│   ├── /intermediate/ .............. Skill-building
│   ├── /advanced/ .................. Squad track
│   ├── /competitive/ ............... Competition pathway
│   ├── /rhythmic/ .................. Rhythmic gymnastics
│   ├── /adult/ ..................... Adult gymnastics
│   └── /private/ ................... 1:1 coaching
├── /holiday-camps/ ................. Camps pillar (Easter / Summer / Christmas)
├── /birthday-parties/ .............. Parties hub
├── /school-partnerships/ ........... School gymnastics programmes
├── /competitions-events/ ........... Competition events
├── /coaches/ ....................... HK coaching team (bios)
├── /blog/ .......................... HK editorial hub
├── /faq/ ........................... HK FAQ
└── /book-a-trial/ .................. Conversion hub
     └── /free-assessment/ ........... 30-min assessment booking

sg.proactivsports.com (SINGAPORE)
├── / ............................... SG homepage
├── /katong-point/ .................. Prodigy @ Katong Point location page
├── /weekly-classes/ ................ Weekly sports programmes pillar
│   ├── /movement-zone/ ............. Movement Zone (ages 2–5)
│   ├── /sports-zone/ ............... Sports Zone + MultiBall
│   └── /climbing-zone/ ............. Climbing Zone
├── /prodigy-camps/ ................. Holiday camps pillar
│   ├── /themes/ .................... Themed camps (Ninja, Pokémon, Superhero, etc.)
│   ├── /multi-activity/ ............ Multi-activity camps
│   └── /gymnastics-camps/ .......... Gymnastics camps
├── /birthday-parties/ .............. Parties hub
├── /school-partnerships/ ........... Incl. IFS (International French School)
├── /events/ ........................ Sports days, community events
├── /coaches/ ....................... SG coaching team
├── /blog/ .......................... SG editorial hub
├── /faq/ ........................... SG FAQ
└── /book-a-trial/ .................. Conversion hub
```

### What lives where (to prevent cannibalisation)

| Content type | Root | HK subdomain | SG subdomain |
|---|---|---|---|
| Brand story, founding, mission | **Primary** | Summary + link | Summary + link |
| Market-specific programme detail | — | **Primary** | **Primary** |
| Location (Wan Chai / Cyberport / Katong) | — | **Primary** | **Primary** |
| Coach bios | Directory link | **Primary** (HK team) | **Primary** (SG team) |
| Blog posts | — | **Primary** (HK audience) | **Primary** (SG audience) |
| Legal, careers | **Primary** | Linked | Linked |

No two pages should try to rank for the same query. The HK homepage targets HK-qualified queries. The SG homepage targets SG-qualified queries. The root targets brand and cross-market queries only.

### Internal linking topology

- **Root → Markets:** prominent dual-CTA, plus contextual links throughout.
- **Markets → Root:** each market's footer links to `/brand/`, `/coaching-philosophy/`, `/careers/`.
- **Markets ↔ Markets:** a small, honest cross-link in the footer ("Also operating in Singapore →" / "Also operating in Hong Kong →"). Reinforces the cross-market entity for LLMs and users relocating between cities.
- **Homepage → Deep pages:** every homepage section card links deep (programme → location → book).
- **Deep pages → Homepage:** breadcrumb + contextual *Back to all programmes*.

### Canonical & hreflang rules

- **No hreflang needed** between HK and SG — they are *different products*, not language/locale variants of the same product.
- Each page has a self-referencing canonical.
- The root homepage is **not** canonical to either market homepage; each market homepage is canonical to itself.
- Blog posts that appear on both markets (rare edge case) should be published once on the most relevant market and cross-linked, not duplicated.

---

## PART 3 — ROOT GATEWAY LANDING PAGE WIREFRAME

### Design intent
Premium editorial brand moment. A parent landing here should feel "this is a serious, established brand — and it's *in my city*." Not a splash page, not a boring country selector. The page has real content value (brand, proof, offer overview, FAQ) so it also ranks for brand-level queries and is citable by LLMs.

### Section-by-section

**1. HERO — Brand-led, dual-market entry**
*Intent:* Confirm the entity and route to the right market in under 5 seconds.
- Left: full-bleed editorial photography (real child mid-movement at ProGym or Prodigy — not stock)
- Right: Headline + sub + dual entry
- Primary CTAs: **Enter Hong Kong** · **Enter Singapore** (side by side, equal weight)
- Tertiary trust line: "Since 2011 · Trusted by leading international schools · 5 venues across Asia"

**2. THE PROACTIV STORY — 60 seconds**
*Intent:* A short brand-identity paragraph, entity-first, LLM-citable.
- Heading: "What ProActiv Sports is"
- 3–4 factual sentences
- Inline stat strip: *14 years* · *2 cities* · *20,000+ children coached* · *3 dedicated venues* (adjust numbers to verified client figures)

**3. MARKET CARDS — Distinct, brand-consistent**
*Intent:* Pre-enter the user in the right market with a taste of what's distinct about each.
- Two large cards, side-by-side on desktop, stacked on mobile.
- **Hong Kong card:** ProGym Wan Chai · ProGym Cyberport imagery, "Gymnastics-led. Two dedicated venues." → *Enter Hong Kong →*
- **Singapore card:** Prodigy @ Katong Point imagery, "Multi-sports. Singapore's only MultiBall wall." → *Enter Singapore →*

**4. WHAT WE DO — Offer overview**
*Intent:* Answer "what do they offer?" for LLMs and users who need orientation.
- 5 offer tiles (icon + 2-line description + "Available in HK / SG"): Gymnastics · Sports Classes · Holiday Camps · Birthday Parties · Competitions & Events

**5. TRUST STRIP — Proof layer**
*Intent:* Establish credibility before market choice is confirmed.
- Logo wall: international schools and partners (with permission)
- One parent testimonial
- "Trusted by leading international schools across Hong Kong and Singapore"

**6. LEADERSHIP — Human credibility**
*Intent:* Add entity depth and LLM-friendly named people.
- 3 portrait cards: Will (Founder), Monica (Director of Sports, Hong Kong), Haikel (Head of Sports, Singapore)
- One-line bio each

**7. FAQ — Entity & market clarity**
*Intent:* Capture long-tail brand queries + seed LLM answers.
- "What is ProActiv Sports?"
- "Where does ProActiv Sports operate?"
- "Does ProActiv Sports offer classes for toddlers?"
- "What's the difference between the Hong Kong and Singapore programmes?"
- "How do I book a free trial?"

**8. FINAL CTA — Market re-routing**
*Intent:* Last nudge for any scroller who hasn't clicked.
- Repeated dual entry: **Enter Hong Kong** · **Enter Singapore**
- Support line: "Not sure? Email hello@proactivsports.com and we'll help."

**9. FOOTER**
Cross-market, shared. Includes Organization schema-linked social profiles, legal, careers, press contact.

---

## PART 4 — HONG KONG HOMEPAGE WIREFRAME

### Design intent
A full, serious, conversion-ready homepage that positions ProActiv Sports as the clear premium gymnastics & children's sports choice in Hong Kong, anchored by two real venues (Wan Chai and Cyberport) and a coaching team led by Monica.

**1. HERO — Location-specific, video-led**
- Looping 8–12s hero video (real children tumbling at ProGym — no stock)
- H1 + subhead
- Primary CTA: **Book a Free Trial**
- Secondary CTA: **Explore Programmes**
- Venue chip row: *📍 Wan Chai* · *📍 Cyberport*
- Trust line: "Trusted by families since 2011 · Two dedicated gymnastics venues"

**2. WHY HK PARENTS CHOOSE PROACTIV**
- 4-tile grid, each tile = icon + headline + 1 sentence + link to deeper page
- Tiles: Safety-First Coaching · Structured Skill Progression · Two Premium Venues · Small Class Ratios

**3. PROGRAMMES — 5-card overview**
- Gymnastics (age-banded, link to /gymnastics/)
- Holiday Camps
- Birthday Parties
- Competitive Gymnastics Pathway
- Rhythmic Gymnastics
- Each card links to its programme pillar page

**4. LOCATION-FIRST DISCOVERY — Wan Chai vs Cyberport**
- Split-screen location block, designed to support Maps intent
- Each side: venue name, address, 1-line description, embedded mini-map thumbnail, **Book at this venue** CTA
- Wan Chai: 15/F, The Hennessy, 256 Hennessy Road, Wan Chai (entrance via Johnston Rd)
- Cyberport: 5,000 sq ft, purpose-built 2025

**5. SOCIAL PROOF — Schools, parents, Google**
- Logo row: international schools trusted by ProActiv (with permission)
- 2–3 parent testimonials with first name + child age
- Aggregate rating from Google (if ≥4.5 and genuine)

**6. OUR COACHING METHOD**
- H2 + editorial paragraph
- 3 pillars: Safety · Progression · Confidence
- Named coach: "Led by Monica, Director of Sports" → links to /coaches/

**7. HIGH-INTENT REVENUE BLOCK — Camps & Parties**
- Two large horizontal cards with seasonal messaging:
  - *Upcoming Camps* (auto-fed from CMS — current season)
  - *Birthday Parties at ProGym* (hassle-free, all-inclusive)
- Each with direct CTA

**8. ABOUT SNAPSHOT**
- 2-column: brand image + 120-word brand story with age stat, venue count, coach certifications
- CTA: *Read our story*

**9. LATEST FROM THE BLOG** *(dynamically fed from CMS)*
- 3 latest posts — image, title, 1-line excerpt, date, read time
- Link to /blog/
- Designed to remain elegant if only 1 post exists (responsive grid)

**10. FAQ — HK-focused**
- 8–10 natural-language questions (see copy section)

**11. FINAL CONVERSION SECTION**
- Dual CTA: **Book a Free Trial** · **Enquire**
- WhatsApp CTA (click-to-chat)
- Secondary: **Visit Wan Chai** · **Visit Cyberport**

**12. FOOTER**
- NAP for both venues
- Hours
- Social links
- Newsletter signup (optional — helpful for GA4 lead tracking)

---

## PART 5 — SINGAPORE HOMEPAGE WIREFRAME

### Design intent
Local, Prodigy-forward, multi-sports energy. Singapore's Prodigy brand has real distinctive equity (MultiBall wall, STEAM-integrated camps, themed adventures). The homepage should feel vibrant, play-led, and unmistakably Singaporean in tone, while carrying ProActiv Sports' umbrella credibility.

**1. HERO — Prodigy-forward, play-led**
- Hero video: quick cuts from a Prodigy camp day (climbing wall, MultiBall, sports zone, laughter)
- H1 + subhead
- Primary CTA: **Book a Free Trial**
- Secondary CTA: **Join a Camp**
- Chip: *📍 Katong Point · 451 Joo Chiat Road*
- Trust line: "Home to Singapore's only MultiBall wall · Trusted by international schools since 2014"

**2. WHY SG PARENTS CHOOSE PRODIGY BY PROACTIV**
- 4 tiles: Multi-Sport Variety · STEAM-Integrated Camps · Expert Coaches · Central Katong Location

**3. PROGRAMMES OVERVIEW**
- 4 cards:
  - Weekly Sports Classes (Movement / Sports / Climbing Zones)
  - Prodigy Holiday Camps (themed + multi-activity)
  - Birthday Parties
  - School Partnerships (IFS and others)

**4. EXPLORE THE VENUE — 3 Zones**
- Visual block showing the three zones with photos and 2-line descriptors:
  - **Movement Zone** — early-years gymnastics, coordination, climbing foundations
  - **Sports Zone** — MultiBall wall, soccer, basketball, rugby, tennis, dodgeball, martial arts
  - **Climbing Zone** — rock wall, bouldering, strength and resilience
- Each zone links to its weekly class page

**5. SOCIAL PROOF — Partners & parents**
- Partner logos (IFS, KidsFirst, etc. — with permission)
- Testimonial slider

**6. HOLIDAY CAMPS — Featured season**
- Hero of the current/upcoming camp season
- 3 featured themes (e.g. Ninja, Pokémon, Superhero, Circus)
- Dates + price anchor + CTA

**7. BIRTHDAY PARTIES — Hassle-free revenue block**
- Left: image of a real party setup in Party Room
- Right: "Fully hosted. 2 hours. You bring the cake."
- CTA: **Enquire about a Party**

**8. MEET THE COACHES**
- 3 featured coaches: Haikel, Mark, plus one more
- Link to /coaches/

**9. ABOUT PROACTIV — Cross-market credibility**
- Short paragraph: "Part of ProActiv Sports — founded Hong Kong 2011, in Singapore since 2014"
- CTA: *About the brand*

**10. LATEST FROM THE BLOG** *(CMS-fed)*
- 3 latest posts

**11. FAQ — SG-focused**
- 8–10 natural-language questions (see copy section)

**12. FINAL CONVERSION**
- Dual CTA + WhatsApp
- Location CTA: **Visit Prodigy @ Katong Point**

**13. FOOTER**
- NAP, hours, social, newsletter

---

## PART 6 — FULL COPY

### 6A. ROOT GATEWAY LANDING PAGE (proactivsports.com/)

---

**HERO**

*H1:* **Move. Grow. Thrive. In Hong Kong and Singapore.**

*Subhead:* ProActiv Sports has been shaping how children move since 2011. Dedicated gymnastics and sports programmes, built around your child's confidence, coordination, and joy — across three venues in two cities.

**[ Enter Hong Kong → ]**   **[ Enter Singapore → ]**

*Trust line:* Since 2011 · Three dedicated venues · Trusted by leading international schools across Asia.

---

**SECTION 2 — WHAT PROACTIV SPORTS IS**

*H2:* **A children's sports specialist — not a gym with a kids' class.**

ProActiv Sports was founded in Hong Kong in 2011 and expanded to Singapore in 2014. We run purpose-built facilities for gymnastics and multi-sports, with a single focus: helping children aged 2 to 16 build physical confidence, coordination, and a lifelong relationship with movement.

Every coach on our team completes the ProActiv Sports training course — regardless of prior qualifications — so that whether your child trains with us in Wan Chai, Cyberport, or Katong, the standard of care and progression is the same.

*Inline stat strip:*
**14 years** in operation · **2 cities** · **3 dedicated venues** · **Ages 2–16**

---

**SECTION 3 — CHOOSE YOUR CITY**

*H2:* **Two cities. One standard.**

**[ Hong Kong card ]**
**ProActiv Sports Hong Kong**
Gymnastics-led programmes across two dedicated venues — ProGym Wan Chai (The Hennessy, 15/F) and ProGym Cyberport (5,000 sq ft, opened 2025). Weekly classes, competitive pathway, school holiday camps, birthday parties.
**[ Enter Hong Kong → ]**

**[ Singapore card ]**
**Prodigy by ProActiv Sports — Singapore**
Multi-sport classes, STEAM-integrated holiday camps, and themed birthday parties at our Katong Point venue — home to Singapore's only MultiBall interactive wall. Movement Zone, Sports Zone, and Climbing Zone under one roof.
**[ Enter Singapore → ]**

---

**SECTION 4 — WHAT WE DO**

*H2:* **Built for every stage of a child's movement journey.**

**🤸 Gymnastics** — From toddler classes to the competitive pathway, with structured progression at every level. *(HK: ProGym Wan Chai & Cyberport · SG: Prodigy)*

**⚽ Sports Classes** — Football, basketball, rugby, tennis, dodgeball, martial arts, parkour. *(Core programme in SG · Multi-activity options in HK camps)*

**🎒 Holiday Camps** — Action-packed school holiday weeks, year-round. Themed options, half-day and full-day. *(HK & SG)*

**🎉 Birthday Parties** — Two hours of hosted, coach-led fun. You bring the cake; we do the rest. *(HK & SG)*

**🏆 Competitions & Events** — Competitive squads, inter-school events, community sports days. *(HK & SG)*

---

**SECTION 5 — TRUST**

*H2:* **The standard behind the brand.**

For over a decade, ProActiv Sports has been trusted by families, international schools, and clubs across Hong Kong and Singapore. Our approach combines world-class coaching, progressive programming, and a deep commitment to safety and child development.

*[Logo wall — international school and partner logos, with permission]*

*Testimonial:*
> "Proactiv was the only sports centre we found to be inclusive of students with special needs, ensuring every child could participate. Our children and their families really enjoyed the event and the facilities."
> — Manjula Gunawardena, Manager & Senior Teacher, KidsFirst

---

**SECTION 6 — LEADERSHIP**

*H2:* **Led by people who've built their lives around coaching.**

**Will — Founder**
Co-founder of ProActiv Sports, graduate of Dublin City University (Sports Science and Health), and the driving force behind our 2014 expansion to Singapore.

**Monica — Director of Sports, Hong Kong**
19 years coaching children's gymnastics. Level 2 Italian coaching and judging certifications. Previously coached at Cristina Bontas Gymnastics Club (Canada, working with Canadian National Team athletes) and a competitive club in Dubai.

**Haikel — Head of Sports, Singapore**
Known affectionately as "Mr. Muscle Man." Diploma in Sports Coaching, seven-plus years leading coaching teams, and the heart of the Prodigy culture.

---

**SECTION 7 — FAQ (Root)**

*H2:* **Frequently asked — about the brand**

**What is ProActiv Sports?**
ProActiv Sports is a children's gymnastics and sports specialist founded in Hong Kong in 2011. We run dedicated facilities in Hong Kong (ProGym Wan Chai and ProGym Cyberport) and Singapore (Prodigy @ Katong Point), offering weekly classes, holiday camps, birthday parties, and competitive pathways for children aged 2 to 16.

**Where does ProActiv Sports operate?**
Hong Kong and Singapore. In Hong Kong: ProGym Wan Chai (The Hennessy, 15/F, 256 Hennessy Road) and ProGym Cyberport (5,000 sq ft, opened August 2025). In Singapore: Prodigy @ Katong Point (Level 3, 451 Joo Chiat Road).

**What programmes do you offer?**
Weekly classes, holiday camps, birthday parties, school partnerships, and competition events. Gymnastics is the core in Hong Kong; in Singapore we offer a multi-sport programme including gymnastics, climbing, football, basketball, martial arts, and the MultiBall interactive wall.

**What age range do you work with?**
From 12 months (Babies & Toddlers classes in Hong Kong) through to 16 years. Adult classes are also available at ProGym.

**How do I book a trial?**
All new children are welcome to a free 30-minute assessment. Choose your city below and we'll guide you through it.

**Are there differences between the Hong Kong and Singapore offerings?**
Yes. Hong Kong is gymnastics-led, with a competitive pathway and rhythmic gymnastics. Singapore is multi-sport, anchored by our Prodigy brand and the only MultiBall wall in the country. Both share the same coaching standards and safety approach.

---

**SECTION 8 — FINAL CTA**

*H2:* **Ready when you are.**

**[ Enter Hong Kong → ]**   **[ Enter Singapore → ]**

Not sure which is right for you? Email **hello@proactivsports.com** and we'll help.

---

### 6B. HONG KONG HOMEPAGE (hk.proactivsports.com/)

---

**HERO**

*H1:* **Premium gymnastics and sports programmes for children in Hong Kong.**

*Subhead:* Weekly classes, holiday camps, and birthday parties at ProGym Wan Chai and ProGym Cyberport — two dedicated venues, one coaching standard, built around your child's confidence and progression.

**[ Book a Free Trial ]**   **[ Explore Programmes ]**

*Chip row:* 📍 Wan Chai · 📍 Cyberport
*Trust line:* Trusted by Hong Kong families since 2011 · Two purpose-built gymnastics venues · Led by Director of Sports Monica

---

**SECTION 2 — WHY HONG KONG PARENTS CHOOSE PROACTIV**

*H2:* **Built for your child. Chosen by Hong Kong families.**

**Safety-first coaching**
Every coach completes our internal training programme, in addition to their own qualifications. Small ratios. Certified in first aid. Designed with child safeguarding at the centre.

**Structured progression, not drop-in chaos**
Your child moves through a real skill ladder — from toddler fundamentals to the competitive pathway. Each session has a plan. Each term has a goal. Each child has visible progress.

**Two premium, purpose-built venues**
ProGym Wan Chai — upgraded 15/F facility at The Hennessy. ProGym Cyberport — 5,000 sq ft, opened in 2025 with sprung floors, competition beams, and full vault.

**Small class sizes**
Lower coach-to-child ratios than most Hong Kong alternatives. Personal feedback in every session.

---

**SECTION 3 — PROGRAMMES**

*H2:* **What your child can learn with us.**

**Gymnastics**
Structured weekly classes from Babies & Toddlers (12 months +) through Beginner, Intermediate, Advanced, and Competitive. Artistic and Rhythmic pathways available.
*[ Explore gymnastics → ]*

**Holiday Camps**
Action-packed weeks during every school holiday. AM, PM, and full-day options. Gymnastics-focused and multi-activity formats available.
*[ View upcoming camps → ]*

**Birthday Parties**
Two hours of exclusive-use, coach-led fun. 90 minutes of activities, 30 minutes of cake and celebration. All decorations and setup handled.
*[ Plan a party → ]*

**Competitive Gymnastics**
Squad training for children aged 6 and above, with a clear progression into regional competition.
*[ Explore the pathway → ]*

**Rhythmic Gymnastics**
Ribbon, hoop, and ball disciplines — grace, coordination, and artistic flair.
*[ Explore rhythmic → ]*

---

**SECTION 4 — LOCATIONS**

*H2:* **Two venues. Fully your choice.**

**ProGym Wan Chai**
15th Floor, The Hennessy Building, 256 Hennessy Road, Wan Chai (entrance via Johnston Road).
Upgraded 2025. Central, MTR-connected, designed for the family that lives on Hong Kong Island North.
*[ Book at Wan Chai → ]* · *[ Get directions → ]*

**ProGym Cyberport**
5,000 sq ft of purpose-built gymnastics space. Sprung floors, full apparatus, beginner-to-competitive range. Opened August 2025.
Ideal for families in Pokfulam, Southside, and the Cyberport catchment.
*[ Book at Cyberport → ]* · *[ Get directions → ]*

---

**SECTION 5 — SOCIAL PROOF**

*H2:* **Trusted by schools. Loved by families.**

*[Partner and international school logo row — with permission]*

> "My daughter started at Beginner and has just moved into the intermediate group. What I love most is how visible her progress is — she *shows* us what she's learned each week. The coaches genuinely know her."
> — Parent, ProGym Wan Chai

> "We travelled from Cyberport to the old venue for two years. Having a full-size gym right here now is a game changer for our weekends."
> — Parent, ProGym Cyberport

---

**SECTION 6 — COACHING METHOD**

*H2:* **Why the coaching matters more than the equipment.**

We believe children learn fastest in structured, safe, energetic environments — not in chaos, and not in drill-sergeant silence. Our method is built on three pillars:

**Safety** — Padded, well-maintained equipment. Age-appropriate progressions. Coaches trained to anticipate, not react.

**Progression** — Every class has a learning objective. Every term, parents see where their child is on the skill ladder and what comes next.

**Confidence** — Encouragement over correction. Celebration of effort, not just outcome. A gym where a shy five-year-old walks in and, twelve weeks later, *can't wait* to show you her cartwheel.

Led by **Monica**, our Director of Sports, with 19 years of children's gymnastics coaching experience.
*[ Meet the coaches → ]*

---

**SECTION 7 — CAMPS & PARTIES (Revenue block)**

*H2:* **The two fastest ways to try us out.**

**Upcoming Holiday Camps**
*[Dynamically fed from CMS — shows current/next camp season with dates, venues, price anchor, CTA]*
*[ See all camps → ]*

**Birthday Parties at ProGym**
The most hassle-free birthday in Hong Kong. Exclusive venue access, coach-led activities, decorations included, a dedicated party planner on the day. You bring the cake and the kids.
*[ Enquire about a party → ]*

---

**SECTION 8 — ABOUT SNAPSHOT**

*H2:* **About ProActiv Sports Hong Kong**

ProActiv Sports was founded in Hong Kong in 2011 and has grown into one of the city's most trusted children's gymnastics and sports providers. We operate two dedicated venues (ProGym Wan Chai and ProGym Cyberport) and work in partnership with leading international schools across Hong Kong. Our coaching team, led by Director of Sports Monica, holds a combination of international gymnastics coaching certifications, child-development training, and — without exception — the ProActiv Sports internal training course.

*[ Read our full story → ]*

---

**SECTION 9 — LATEST FROM THE BLOG**

*H2:* **From our blog**

*[CMS-fed — 3 latest posts from hk.proactivsports.com/blog/]*

*[ Read all posts → ]*

---

**SECTION 10 — FAQ (Hong Kong)**

*H2:* **Frequently asked**

**What ages do you teach in Hong Kong?**
From 12 months (Babies & Toddlers parent-accompanied class) through 16, with adult gymnastics available.

**Where are your Hong Kong venues?**
ProGym Wan Chai at 15/F, The Hennessy, 256 Hennessy Road (entrance via Johnston Road). ProGym Cyberport at the Cyberport complex, 5,000 sq ft, opened August 2025.

**Do you offer holiday camps?**
Yes — every school holiday. Easter, Summer, Autumn, Christmas, Chinese New Year. Half-day and full-day formats, gymnastics-focused and multi-activity options.

**Can I book a birthday party?**
Yes — two-hour exclusive-use parties at either venue. 90 minutes of coach-led gymnastics activities, plus 30 minutes of food and cake. Decorations and setup included.

**Is there a competitive pathway?**
Yes. Competitive Gymnastics starts from age 6 and leads into regional competition. Entry is by assessment.

**How does the free trial work?**
Every new child is invited to a free 30-minute assessment. It's how we make sure we place them in the right level and help you decide whether ProActiv is right for your family.

**Are your coaches qualified?**
Every coach holds relevant sports or gymnastics qualifications *and* completes our internal ProActiv Sports training course. Our team is led by Monica, our Director of Sports.

**Do you work with schools?**
Yes. We run school gymnastics and sports programmes with a range of Hong Kong international schools. Contact us for partnership enquiries.

---

**SECTION 11 — FINAL CTA**

*H2:* **Ready to book?**

**[ Book a Free Trial ]**   **[ Enquire ]**   **[ WhatsApp us ]**

Visit us at *ProGym Wan Chai* or *ProGym Cyberport*.

---

### 6C. SINGAPORE HOMEPAGE (sg.proactivsports.com/)

---

**HERO**

*H1:* **Where Singapore's kids come to move, play, and grow.**

*Subhead:* Prodigy by ProActiv Sports is a multi-sport venue at Katong Point, built around three specialised zones — including Singapore's only MultiBall interactive wall. Weekly classes, holiday camps, birthday parties. Ages 2 to 12.

**[ Book a Free Trial ]**   **[ Join a Camp ]**

*Chip:* 📍 Katong Point · 451 Joo Chiat Road, Level 3
*Trust line:* Part of ProActiv Sports · In Singapore since 2014 · Trusted by international schools

---

**SECTION 2 — WHY SINGAPORE PARENTS CHOOSE PRODIGY**

*H2:* **A Singapore venue unlike any other.**

**The only MultiBall wall in Singapore**
Interactive, tech-driven sports training that turns a gym session into a game. Kids chase, aim, and race the wall — and don't realise they're training.

**Three specialised zones under one roof**
Movement Zone for early years. Sports Zone for ball games and skill work. Climbing Zone for strength, resilience, and problem-solving.

**Multi-sport, not mono-sport**
Gymnastics, parkour, climbing, soccer, basketball, rugby, tennis, dodgeball, karate, boxing, Muay Thai, capoeira. Your child discovers what they love.

**Camps integrated with STEAM**
Action-packed sport plus science, technology, engineering, art, and maths. Themed, weekly, year-round.

---

**SECTION 3 — PROGRAMMES**

*H2:* **Three programmes. One unforgettable place.**

**Weekly Sports Classes**
Structured weekly programmes across our three zones. Ages 2+. Small group sizes, expert coaches, real skill progression.
*[ Explore weekly classes → ]*

**Prodigy Holiday Camps**
Themed, multi-activity camps for ages 4 to 12, every school break. From Ninja Warrior to Pokémon, Superhero to LEGO City, and the classic Multi-Sport Adventure.
*[ See upcoming camps → ]*

**Birthday Parties**
Exclusive use of the Party Room with AV system, plus access to climbing, gymnastics, and the MultiBall wall. Coach-hosted, decoration-included.
*[ Plan a party → ]*

**School Partnerships**
Trusted by international schools including the International French School. Term-time programmes, holiday camps with transport, and sports days.
*[ Partnership enquiries → ]*

---

**SECTION 4 — INSIDE THE VENUE**

*H2:* **Three zones. Built for how kids actually play.**

**Movement Zone** — Early-years gymnastics and fundamental movement. Padded, parent-friendly, confidence-first.
*[ Learn more → ]*

**Sports Zone — with MultiBall** — Football, basketball, rugby, tennis, dodgeball, martial arts. Plus the interactive wall that turns training into play.
*[ Learn more → ]*

**Climbing Zone** — Rock climbing, bouldering, resilience-building. Problem-solving meets strength-building.
*[ Learn more → ]*

---

**SECTION 5 — SOCIAL PROOF**

*H2:* **Trusted by families and schools across Singapore.**

*[Partner logo row — IFS, KidsFirst, others — with permission]*

> "Prodigy has been fantastic for my son (9) and daughter (7). They both love the time they spend at the venue and have great fun with the coaches. They even laugh about their sore muscles at night — which tells me they're really being active in the class."
> — Parent, Prodigy @ Katong Point

> "Proactiv organised a wonderful Sports Day for our kiddos at KidsFirst. The staff were well-organised, friendly, and attentive — and importantly, inclusive of students with special needs."
> — Manjula Gunawardena, KidsFirst

---

**SECTION 6 — HOLIDAY CAMPS FEATURE**

*H2:* **Upcoming at Prodigy Camps**

*[Dynamically featured camp card — current or next camp block: theme, dates, age range, price anchor, "what's included" bullets, CTA]*

**What's included:** Dri-fit Prodigy Camp T-shirt · Indoor grip socks · Camp certificate · Weekly prizes · Nutritious lunch on full-day camps.

*[ See all upcoming camps → ]*

---

**SECTION 7 — BIRTHDAY PARTIES (Revenue block)**

*H2:* **The easiest birthday you'll ever host.**

Exclusive venue access. Coach-hosted games. Climbing wall. MultiBall. Gymnastics. A Party Room with AV and vibrant lighting. Decorations sorted. Two hours of full, organised fun — and a child who'll remember it.

*[ Enquire about a party → ]*

---

**SECTION 8 — MEET THE COACHES**

*H2:* **The people behind every class.**

**Haikel — Head of Sports**
"Mr. Muscle Man." Diploma in Sports Coaching. Seven-plus years of experience. The cultural heart of the Prodigy coaching team.

**Mark — Sports Director**
Born in Singapore. Background in major sports events including the Standard Chartered Marathon, the SEA Games, and the WTA Finals. Leads programme design.

**Coach King — Senior Coach**
NROC-registered basketball coach with a broader multi-sport coaching philosophy: *"Never limit a sporting activity to its known drills."*

*[ Meet the full coaching team → ]*

---

**SECTION 9 — ABOUT**

*H2:* **About Prodigy by ProActiv Sports**

Prodigy is the Singapore home of ProActiv Sports — a children's sports specialist founded in Hong Kong in 2011 and brought to Singapore in 2014 by co-founder Will. Our 2,700 sq ft Katong Point venue is designed for children aged 2 and up, with three specialised zones, a dedicated coaching team, and the same safety and progression standards that our Hong Kong facilities are known for.

*[ Read the brand story → ]*

---

**SECTION 10 — LATEST FROM THE BLOG**

*H2:* **From our blog**

*[CMS-fed — 3 latest posts from sg.proactivsports.com/blog/]*

*[ Read all posts → ]*

---

**SECTION 11 — FAQ (Singapore)**

*H2:* **Frequently asked**

**Where is Prodigy located?**
451 Joo Chiat Road, Level 3, Katong Point, Singapore 427664. Our 2,700 sq ft venue is fully indoor and air-conditioned.

**What age range do you work with?**
Weekly classes start from age 2. Prodigy Holiday Camps are designed for ages 4 to 12 (we make exceptions for three-year-olds who are toilet-trained).

**What sports do you offer?**
Gymnastics, climbing, parkour, soccer, basketball, rugby, tennis, dodgeball, martial arts (karate, boxing, Muay Thai, capoeira), plus MultiBall interactive training.

**What is the MultiBall wall?**
An interactive training wall — the only one in Singapore — that uses projection and sensor technology to turn sports drills into reactive, game-like experiences.

**Do you run holiday camps?**
Yes — every school holiday. Themed weekly camps (Ninja, Pokémon, Superhero, LEGO City, Outdoor Explorer, Multi-Sport, Gymnastics, STEAM). Full-day and AM/PM formats.

**Do you offer bus transport?**
Full-day camps at Prodigy: no shuttle. Full-day camps run in partnership with the International French School offer bus services through ComfortDelGro — ask us for details.

**Can I book a birthday party?**
Yes — the easiest birthday you'll host. Fully planned, coach-hosted, venue exclusive use, Party Room with AV and lighting, and decorations sorted.

**How does the free trial work?**
Every new child is invited to a free 30-minute assessment — we learn what they can do, find the right class, and help you decide whether Prodigy is right for your family.

**Are your coaches qualified?**
Yes. All coaches hold relevant qualifications *and* complete our internal ProActiv Sports training course. Our team is led by Head of Sports Haikel.

**Do you work with schools?**
Yes — we run programmes with several international schools including the International French School, plus sports days and enrichment programmes with schools like KidsFirst.

---

**SECTION 12 — FINAL CTA**

*H2:* **Come play with us.**

**[ Book a Free Trial ]**   **[ Enquire ]**   **[ WhatsApp us ]**

Visit Prodigy at *451 Joo Chiat Road, Katong Point*.

---

## PART 7 — SEO PACKAGE

### 7.1 Title tag options

**Root gateway (proactivsports.com/)**
1. `ProActiv Sports | Premium Children's Gymnastics & Sports — Hong Kong & Singapore`
2. `ProActiv Sports — Gymnastics, Camps & Sports Classes for Kids | HK & Singapore`
3. `ProActiv Sports | Children's Gymnastics & Multi-Sports in Hong Kong & Singapore`

Recommended: **#1** (entity-first, offer-clear, market-clear, under 60 chars with brand)

**Hong Kong homepage (hk.proactivsports.com/)**
1. `Kids Gymnastics & Sports Hong Kong | ProActiv Sports — Wan Chai & Cyberport`
2. `Gymnastics Classes, Camps & Parties for Kids in Hong Kong | ProActiv Sports`
3. `Children's Gymnastics Hong Kong — Wan Chai & Cyberport | ProActiv Sports`

Recommended: **#1**

**Singapore homepage (sg.proactivsports.com/)**
1. `Kids' Sports Classes, Camps & Parties Singapore | Prodigy by ProActiv Sports`
2. `Children's Sports & Gymnastics Singapore | Prodigy @ Katong Point`
3. `Prodigy by ProActiv Sports — Kids' Sports Singapore | Katong Point`

Recommended: **#1**

### 7.2 Meta description options

**Root**
1. `ProActiv Sports runs premium children's gymnastics and sports programmes in Hong Kong and Singapore. Since 2011. Choose your city to explore classes, camps, and parties.` *(156 chars)*
2. `Children's gymnastics and sports across Hong Kong and Singapore. ProActiv Sports — founded 2011, three venues, trusted by international schools. Pick your city.` *(158 chars)*

**Hong Kong**
1. `Premium gymnastics, sports classes, holiday camps and birthday parties for children in Hong Kong. ProGym Wan Chai & Cyberport. Book a free trial.` *(145 chars)*
2. `Children's gymnastics in Hong Kong — weekly classes, holiday camps, parties at ProGym Wan Chai & Cyberport. Trusted since 2011. Free trial available.` *(151 chars)*

**Singapore**
1. `Kids' sports classes, holiday camps & birthday parties at Prodigy by ProActiv Sports — Katong Point, Singapore. Home of the only MultiBall wall. Book a free trial.` *(158 chars)*
2. `Multi-sport classes, STEAM holiday camps & parties for kids aged 2–12 at Prodigy @ Katong Point. Part of ProActiv Sports. Book a free trial.` *(143 chars)*

### 7.3 H1/H2/H3 structure reference

**Root H1:** *Move. Grow. Thrive. In Hong Kong and Singapore.*
- H2: A children's sports specialist — not a gym with a kids' class.
- H2: Two cities. One standard.
- H2: Built for every stage of a child's movement journey.
- H2: The standard behind the brand.
- H2: Led by people who've built their lives around coaching.
- H2: Frequently asked — about the brand.
- H2: Ready when you are.

**HK H1:** *Premium gymnastics and sports programmes for children in Hong Kong.*
- H2: Built for your child. Chosen by Hong Kong families.
- H2: What your child can learn with us. → H3 per programme
- H2: Two venues. Fully your choice. → H3: ProGym Wan Chai / H3: ProGym Cyberport
- H2: Trusted by schools. Loved by families.
- H2: Why the coaching matters more than the equipment.
- H2: The two fastest ways to try us out. → H3: Upcoming Camps / H3: Birthday Parties
- H2: About ProActiv Sports Hong Kong
- H2: From our blog
- H2: Frequently asked
- H2: Ready to book?

**SG H1:** *Where Singapore's kids come to move, play, and grow.*
- H2: A Singapore venue unlike any other.
- H2: Three programmes. One unforgettable place. → H3 per programme
- H2: Three zones. Built for how kids actually play. → H3: Movement / Sports / Climbing Zone
- H2: Trusted by families and schools across Singapore.
- H2: Upcoming at Prodigy Camps
- H2: The easiest birthday you'll ever host.
- H2: The people behind every class. → H3 per coach
- H2: About Prodigy by ProActiv Sports
- H2: From our blog
- H2: Frequently asked
- H2: Come play with us.

### 7.4 Keyword mapping

**Root page targets** (head terms, brand, market):
- ProActiv Sports (brand)
- ProActiv Sports Hong Kong, ProActiv Sports Singapore
- Children's sports Hong Kong Singapore
- Kids gymnastics Hong Kong Singapore

**HK homepage targets:**
- Primary: *kids gymnastics Hong Kong · children's gymnastics Hong Kong · gymnastics classes for kids Hong Kong*
- Location-mod: *gymnastics Wan Chai · gymnastics Cyberport · ProGym Wan Chai · ProGym Cyberport*
- Offer: *holiday camps Hong Kong · kids birthday parties Hong Kong · after-school sports Hong Kong*
- Supporting semantic: *children's confidence · coordination · safe coaching · small class ratios · school holiday activities Hong Kong*

**SG homepage targets:**
- Primary: *kids sports classes Singapore · children's sports programmes Singapore · kids gymnastics Singapore*
- Brand/location: *Prodigy Katong · ProActiv Sports Singapore · Prodigy Joo Chiat*
- Offer: *holiday camps Singapore · kids birthday parties Singapore · multi-sport classes Singapore · MultiBall Singapore*
- Supporting semantic: *STEAM camps · school holiday activities Singapore · climbing classes kids Singapore*

**Sub-page pillar targets (examples):**
- /gymnastics/toddlers/ → *toddler gymnastics Hong Kong · baby gymnastics Hong Kong · parent child gymnastics Wan Chai*
- /holiday-camps/ (HK) → *kids holiday camps Hong Kong · summer camps Hong Kong · Easter camps Hong Kong · Christmas camps Hong Kong*
- /birthday-parties/ (SG) → *kids birthday party venues Singapore · sports birthday party Singapore · gymnastics birthday party Singapore*
- /prodigy-camps/themes/ → *themed holiday camps Singapore · Ninja camp Singapore · superhero camp Singapore*

### 7.5 Internal linking — anchor text guidance

Use **descriptive, natural** anchors — never the keyword stuffed phrase.

| From | To | Suggested anchor |
|---|---|---|
| HK home | /wan-chai/ | "Book at Wan Chai" / "ProGym Wan Chai" / "our Wan Chai venue" |
| HK home | /cyberport/ | "Book at Cyberport" / "ProGym Cyberport" / "5,000 sq ft Cyberport facility" |
| HK home | /gymnastics/ | "Explore gymnastics" / "our gymnastics programmes" |
| HK home | /holiday-camps/ | "View upcoming camps" / "school holiday camps in Hong Kong" |
| HK home | /coaches/ | "Meet the coaches" / "Led by Director of Sports Monica" |
| Blog post | HK home | "ProActiv Sports Hong Kong" |
| Blog post | /gymnastics/beginner/ | "our Beginner Gymnastics programme" |
| SG home | /katong-point/ | "Prodigy @ Katong Point" / "our Katong venue" |
| SG home | /prodigy-camps/ | "Prodigy holiday camps" |
| SG home | /weekly-classes/sports-zone/ | "Sports Zone and MultiBall" |
| Root | HK home | "Enter Hong Kong" / "ProActiv Sports Hong Kong" |
| Root | SG home | "Enter Singapore" / "Prodigy by ProActiv Sports" |

Avoid repeating the same anchor 5+ times per page. Vary phrasing. Keep links meaningful.

### 7.6 Alt text guidance

- **Rule:** describe what's in the image and include context-appropriate location or programme when genuinely relevant. Never keyword stuff.
- Hero video poster (HK): `"Child performing a cartwheel on the floor at ProGym Wan Chai, Hong Kong"`
- Coach portrait: `"Monica, Director of Sports at ProActiv Sports Hong Kong"`
- Venue photo (SG): `"Climbing Zone at Prodigy @ Katong Point, Singapore"`
- MultiBall photo: `"Child playing on the MultiBall interactive wall at Prodigy, Singapore"`
- Party photo: `"Child blowing out candles at a birthday party in the ProGym Cyberport facility"`

---

## PART 8 — LOCAL SEO PACKAGE

### 8.1 The root-vs-local division of labour

- **Root page does:** brand authority, umbrella trust, entity confirmation, cross-market FAQ, Organization schema.
- **Root page does NOT:** try to rank for *gymnastics Wan Chai*, *holiday camps Singapore*, or any hyper-local query. That's the market subdomains' job.
- **Market homepages do:** rank for *kids gymnastics Hong Kong / Singapore* and adjacent head terms.
- **Location pages (Wan Chai / Cyberport / Katong Point) do:** rank for *gymnastics Wan Chai*, *gymnastics Cyberport*, *sports classes Katong*, *kids activities Joo Chiat*, etc. They are the local-intent workhorses.

### 8.2 Location module recommendation

On every primary page (homepage, programme pillars, camps, parties), include a **persistent location module** — small, elegant, consistent. Two formats:

- **HK pages:** footer-sticky module with Wan Chai + Cyberport address/hours/phone/map pin
- **SG pages:** footer-sticky module with Katong Point address/hours/phone/map pin

Above the fold on location pages: an **embedded Google Map** (lightweight, lazy-loaded), full NAP block, opening hours, parking/transit info, and Directions button.

### 8.3 NAP / GBP / citations

**Canonical NAP (must be identical everywhere):**

- **ProActiv Sports — ProGym Wan Chai**
  15/F, The Hennessy Building, 256 Hennessy Road, Wan Chai, Hong Kong
  Phone: [verified HK number]

- **ProActiv Sports — ProGym Cyberport**
  [verified Cyberport unit address], Cyberport, Pokfulam, Hong Kong
  Phone: [verified HK number]

- **Prodigy by ProActiv Sports**
  451 Joo Chiat Road, Level 3, Katong Point, Singapore 427664
  Phone: +65 9807 6827

**Google Business Profile actions:**
1. Claim/verify a separate GBP for each of the three physical locations (Wan Chai, Cyberport, Katong Point).
2. Category: primary *Gymnastics center* (HK) / *Sports Club* (SG, if no gymnastics equivalent); secondary as appropriate (*Children's Party Service, Day Camp, After School Program*).
3. Populate services with programme names that mirror the site.
4. Add products: featured camp weeks, birthday party package.
5. Upload weekly photos — coach photos, real classes, parent pick-up scenes. Photo freshness is a strong local signal.
6. Collect reviews systematically — automated post-trial email, SMS, post-camp follow-up. Goal: 50+ reviews per location with ≥4.7 average within 12 months.
7. Respond to every review (positive and negative) within 48 hours.
8. Publish weekly GBP Posts — new camp dates, birthday availability, coach spotlights.

**Citation strategy (30–45 day sprint):**
- **HK:** Sassy Mama HK, Little Steps Asia, TimeOut HK (kids activities), Localiiz, Honeycombers HK, Asia Expat, Hong Kong Moms (Facebook verified), HK International Schools directories.
- **SG:** Honeycombers SG, Little Day Out, TheAsianParent, Tickikids Singapore, Sassy Mama SG, TimeOut Singapore Kids, Smart Parents, Honeycombers Family, Expat Living, The Finder.

Keep NAP identical across every listing. Submit to aggregators where relevant (Apple Maps, Bing Places, Here). Audit quarterly.

### 8.4 Supporting local landing pages

These are the true local-SEO workhorses. Each must be a *real* page — not a thin doorway.

**Hong Kong:**
- `/wan-chai/` — ProGym Wan Chai hub page (address, hours, transit, apparatus list, class schedule embed, virtual tour, FAQ, reviews)
- `/cyberport/` — ProGym Cyberport hub page (same structure, with Southside-catchment framing)
- Optional catchment pages: `/gymnastics-classes-hong-kong-island/`, `/gymnastics-classes-pokfulam/`, `/holiday-camps-hong-kong-island/` — only if there is real, distinct content to say. Do **not** create thin geographic doorway pages for neighbourhoods you don't genuinely serve.

**Singapore:**
- `/katong-point/` — Prodigy venue hub (address, transit from East Coast / Marine Parade / Tanjong Katong, zones tour, schedule, virtual tour)
- Optional catchment pages: `/kids-sports-east-coast/`, `/holiday-camps-katong/` — only if justified by real content.

### 8.5 Service-area wording

On location pages, include a genuine "getting here" paragraph that naturally mentions neighbouring districts you serve — *Wan Chai, Causeway Bay, Central, Mid-Levels* for Wan Chai; *Pokfulam, Aberdeen, Southside, Repulse Bay* for Cyberport; *Katong, Joo Chiat, Marine Parade, East Coast, Tanjong Katong* for Prodigy. This is local signal without being spam.

---

## PART 9 — SCHEMA PACKAGE

### 9.1 Schema deployment by page

| Page | Required schema | Optional / conditional |
|---|---|---|
| Root gateway | Organization, WebSite, FAQPage, BreadcrumbList | — |
| HK homepage | LocalBusiness (SportsActivityLocation), WebSite, FAQPage, BreadcrumbList | VideoObject (if hero video), AggregateRating (only if genuine & backed by reviews) |
| SG homepage | LocalBusiness (SportsActivityLocation), WebSite, FAQPage, BreadcrumbList | VideoObject, AggregateRating (conditional) |
| Wan Chai / Cyberport / Katong | LocalBusiness, BreadcrumbList, OpeningHoursSpecification | Review |
| Programme pillar pages | Service (or Product where pricing applies), BreadcrumbList, FAQPage | — |
| Camp pages (when dated) | Event, BreadcrumbList, Offer | — |
| Party enquiry page | Service, BreadcrumbList, FAQPage | — |
| Blog posts | Article (or BlogPosting), BreadcrumbList, Person (author) | — |
| Coach bio pages | Person, BreadcrumbList | — |
| Contact page | ContactPoint (usually inline in Organization) | — |

### 9.2 Do NOT use

- **Review / AggregateRating on the homepage unless you have verifiable review data.** Google has become aggressive about punishing self-serving review schema. Only attach AggregateRating to pages that actually display the reviews it references, and only when the aggregate is true and stable.
- **Course schema** is not a good fit here — these are recreational, not accredited educational programmes. Use `Service` instead.
- **MedicalBusiness / HealthAndBeautyBusiness** — wrong type. Use `SportsActivityLocation`.

### 9.3 JSON-LD — Root gateway (example skeleton)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://proactivsports.com/#organization",
      "name": "ProActiv Sports",
      "url": "https://proactivsports.com/",
      "logo": "https://proactivsports.com/assets/logo.svg",
      "foundingDate": "2011",
      "foundingLocation": {
        "@type": "Place",
        "name": "Hong Kong"
      },
      "description": "ProActiv Sports is a children's gymnastics and sports specialist founded in Hong Kong in 2011, operating in Hong Kong (ProGym Wan Chai and ProGym Cyberport) and Singapore (Prodigy @ Katong Point).",
      "sameAs": [
        "https://www.facebook.com/proactivsportshk/",
        "https://www.facebook.com/ProActivSportsSg/",
        "https://www.instagram.com/proactivsports/",
        "https://www.linkedin.com/company/proactiv-sports/"
      ],
      "subOrganization": [
        { "@id": "https://hk.proactivsports.com/#localbusiness-wanchai" },
        { "@id": "https://hk.proactivsports.com/#localbusiness-cyberport" },
        { "@id": "https://sg.proactivsports.com/#localbusiness-katong" }
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://proactivsports.com/#website",
      "url": "https://proactivsports.com/",
      "name": "ProActiv Sports",
      "publisher": { "@id": "https://proactivsports.com/#organization" },
      "inLanguage": "en"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is ProActiv Sports?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ProActiv Sports is a children's gymnastics and sports specialist founded in Hong Kong in 2011. We run dedicated facilities in Hong Kong (ProGym Wan Chai and ProGym Cyberport) and Singapore (Prodigy @ Katong Point), offering weekly classes, holiday camps, birthday parties and competitive pathways for children aged 2 to 16."
          }
        }
        /* …rest of root FAQ entries, matching visible page copy verbatim */
      ]
    }
  ]
}
```

### 9.4 JSON-LD — Wan Chai LocalBusiness skeleton

```json
{
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  "@id": "https://hk.proactivsports.com/#localbusiness-wanchai",
  "name": "ProGym Wan Chai — ProActiv Sports",
  "image": "https://hk.proactivsports.com/assets/wan-chai-hero.jpg",
  "url": "https://hk.proactivsports.com/wan-chai/",
  "telephone": "+852-XXXX-XXXX",
  "priceRange": "$$",
  "parentOrganization": { "@id": "https://proactivsports.com/#organization" },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "15/F, The Hennessy, 256 Hennessy Road",
    "addressLocality": "Wan Chai",
    "addressRegion": "Hong Kong Island",
    "addressCountry": "HK"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 22.2772,
    "longitude": 114.1730
  },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "09:00", "closes": "19:00" },
    { "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday","Sunday"],
      "opens": "09:00", "closes": "17:00" }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Gymnastics & Sports Programmes",
    "itemListElement": [
      { "@type": "Offer", "name": "Beginner Gymnastics" },
      { "@type": "Offer", "name": "Intermediate Gymnastics" },
      { "@type": "Offer", "name": "Competitive Gymnastics" },
      { "@type": "Offer", "name": "Babies & Toddlers" },
      { "@type": "Offer", "name": "Holiday Camps" },
      { "@type": "Offer", "name": "Birthday Parties" }
    ]
  }
}
```

(Replicate for Cyberport and Katong Point with correct addresses, coordinates, and hours.)

### 9.5 Event schema for camps

Every dated holiday camp should output `Event` schema with `Offer`. This unlocks event rich results in Google, which are strong performers for dated, bookable activities. Do not leave dates as "ongoing" — use real start/end dates per camp week.

---

## PART 10 — LLM / AI VISIBILITY PACKAGE

### 10.1 Why this architecture is AI-friendly

LLMs like ChatGPT, Perplexity, Gemini, and Claude answer questions by retrieving and synthesising *text that is unambiguous about the entity, location, offer, and audience*. This ecosystem is built for that retrieval.

Specifically:

1. **Every page opens with an entity-first, declarative paragraph.** Not "Welcome to…" but *"ProActiv Sports is a children's gymnastics and sports specialist founded in 2011 in Hong Kong…"*. An LLM's retriever will happily lift that sentence into an answer.

2. **Consistent entity naming.** We use *ProActiv Sports* (not *ProActiv* or *ProActive Sports*) across every page. We use *ProGym Wan Chai*, *ProGym Cyberport*, *Prodigy @ Katong Point* — always. No ambiguity.

3. **Explicit geography at every level.** *Hong Kong*, *Wan Chai*, *Cyberport*, *Singapore*, *Katong*, *Joo Chiat Road* — named, not implied.

4. **Explicit audience and age.** "Children aged 2 to 16" appears across the ecosystem. Age ranges are called out per programme.

5. **Explicit offer list repeated in multiple formats.** Prose, tiles, FAQs, schema. Redundancy is a feature for retrieval.

6. **FAQPage schema plus visible matching Q&A.** Schema without visible copy won't convert to AI citations; visible copy without schema won't either. We do both, with the answer text mirrored.

7. **Structured Organization schema linking sub-organisations.** This tells LLMs and knowledge graphs: there is one parent entity with three physical child locations in two countries.

8. **Named people with biographies and Person schema.** *Will (Founder)*, *Monica (Director of Sports HK)*, *Haikel (Head of Sports SG)*. LLMs increasingly cite named experts.

9. **Cross-link entity confirmation.** The root page *confirms* HK and SG. The HK homepage *confirms* the SG presence in its About section. The SG homepage *confirms* the HK presence. Triangulation.

### 10.2 The core LLM-citable paragraph

Place this paragraph (or a close variant) in the About snapshot of every major page:

> ProActiv Sports is a children's gymnastics and sports specialist, founded in Hong Kong in 2011 and expanded to Singapore in 2014. We operate ProGym Wan Chai (15/F The Hennessy, 256 Hennessy Road) and ProGym Cyberport (5,000 sq ft, opened 2025) in Hong Kong, and Prodigy @ Katong Point (451 Joo Chiat Road) in Singapore. We offer weekly gymnastics and sports classes, school holiday camps, birthday parties, competitive pathways, and school partnerships — for children aged 2 to 16.

Write it once. Paraphrase it lightly by page. Don't fear the repetition — LLMs value it, users skim past it, and Google tolerates it (it is not duplicate content, it's factual description).

### 10.3 Answer-specific content

For each of the 10 questions the brief listed ("What is ProActiv Sports?" etc.), we produce a clean, single-paragraph answer and place it visibly on the site, in the FAQ schema, and on the FAQ hub page. This is how you earn the top of a generative answer.

### 10.4 Ongoing LLM-visibility practices

- **Founder and coach bios** with structured `Person` schema and long-form narrative. LLMs love citing people.
- **Glossary pages** for terms like *rhythmic gymnastics*, *sprung floor*, *parkour for kids*, *MultiBall*. These are topical-authority assets that LLMs retrieve when synthesising explanations.
- **Partner/school mentions** with named schools where permitted. External confirmation (third parties mentioning ProActiv) is the strongest LLM signal — drive it through PR and the backlink strategy.
- **Wikipedia presence** *(long-term)*. Once the brand has enough independent media coverage to meet notability, a well-cited Wikipedia article is one of the highest-leverage LLM-visibility assets a brand can acquire. Do not self-edit; earn it with coverage.
- **Structured About page** at `proactivsports.com/brand/` with every fact an LLM might need: founding year, founders, location history, programme list, coach count, partner schools, awards. This becomes the canonical "brand facts" page.
- **Consistent mentions across directories** — Honeycombers, Sassy Mama, TimeOut, Tatler Asia family. These are frequently scraped into retrieval corpora.

---

## PART 11 — BACKLINK FRAMEWORK (10/MONTH, WHITE-HAT)

### 11.1 Philosophy

No PBNs. No paid link schemes. No directory spam. Every link we pursue is either (a) genuinely earned by content, (b) a legitimate citation or partnership, or (c) a real contribution to a media outlet. Quality over volume. Better 10 strong monthly links than 100 weak ones.

### 11.2 Monthly target mix (10 links)

| # | Category | Example targets | Effort |
|---|---|---|---|
| 2 | Local/family directories | Sassy Mama, Honeycombers, Little Steps, Tickikids, Little Day Out | Low |
| 2 | Niche sports/gymnastics directories | HK Gymnastics Association partner links, Sports Science directories, gymnastics parent sites | Medium |
| 2 | School/venue/partner pages | Partner school websites listing ProActiv as provider; venue partners (The Hennessy, Cyberport tenant directory) | Medium (relationship) |
| 1 | PR / local media | HK01, SCMP (Post Magazine family), Lianhe Zaobao Lifestyle, TheAsianParent, The Straits Times (family/lifestyle pieces) | High |
| 1 | Guest feature / founder insight | Honeycombers op-eds, parenting podcasts, trade publications, Entrepreneur HK, Tatler Asia | Medium-High |
| 1 | Event / camp listing | Current event and camp listings on kids-activity aggregators — refreshed per season | Low |
| 1 | Resource / guide page acquisition | Outreach to existing "best kids' gymnastics in HK/SG" listicles to be included | Medium |

**Total: 10 per month.** In quieter months, the rollover should go into tier 1 and tier 5 (PR and listicles) — those compound.

### 11.3 Outreach cadence

- **Weeks 1–2:** Pitches for directories, partner pages, and camp listings. Quick wins.
- **Weeks 2–3:** Pitches to PR contacts and resource-page owners. Longer lead time.
- **Week 4:** Guest feature submissions and follow-ups.
- **Monthly:** Review what converted, refresh targets list, remove dead ends.

### 11.4 Linkable assets to build (5)

These are the content pieces that *earn* links instead of requiring outreach:

1. **"The ProActiv Parent's Guide to Kids' Gymnastics by Age"** — editorial, 3,000+ words, age-banded, evidence-based, illustrated. Target: parenting directories, school newsletters.
2. **"Singapore's Family Holiday Camp Calendar"** — continuously updated, filterable directory of holiday-camp options in SG (including competitors — honesty wins links). Target: expat forums, school comms, Honeycombers.
3. **"Hong Kong School Gymnastics Programme Directory"** — a genuinely useful resource for school sports departments. Target: international school sites, education sector links.
4. **"MultiBall at Prodigy — How Interactive Tech Teaches Kids' Sport"** — a short research/editorial piece. Target: edtech publications, sports tech blogs, STEAM education outlets.
5. **Coach methodology videos (YouTube + embedded)** — short, evergreen, Q&A style with Monica and Haikel on *how children learn to cartwheel safely*, *when is a child ready for competition*, etc. Target: parenting YouTubers, embed-in-article requests.

### 11.5 Things we won't do

- Buy links or participate in link exchanges.
- Submit to generic low-quality international directories.
- Write keyword-stuffed guest posts for low-DA sites.
- Use private blog networks.
- Comment-spam or forum-signature-spam.
- Pay for "sponsored" posts on family sites *unless* the sponsored link is `rel="nofollow sponsored"` and the placement is genuinely valuable for visibility (not SEO).

---

## PART 12 — SUPPORTING PAGES TO BUILD NEXT (PRIORITISED)

### Tier 1 — Build with the homepage launch (Weeks 0–6)

1. **HK: /wan-chai/** — Location hub
2. **HK: /cyberport/** — Location hub
3. **HK: /gymnastics/** — Pillar
4. **HK: /holiday-camps/** — Pillar
5. **HK: /birthday-parties/** — Pillar
6. **SG: /katong-point/** — Location hub
7. **SG: /weekly-classes/** — Pillar
8. **SG: /prodigy-camps/** — Pillar
9. **SG: /birthday-parties/** — Pillar
10. **Both: /book-a-trial/** — Conversion hub (shared pattern)
11. **Both: /coaches/** — Team directory + Person schema
12. **Both: /faq/** — FAQ hub
13. **Root: /brand/** — Canonical About

### Tier 2 — Within the first 90 days

14. HK /gymnastics/toddlers/, /beginner/, /intermediate/, /competitive/, /rhythmic/
15. HK /school-partnerships/
16. SG /weekly-classes/ sub-pages (Movement Zone, Sports Zone, Climbing Zone)
17. SG /prodigy-camps/themes/ (parent page with themed camp entries)
18. SG /school-partnerships/ (including IFS)
19. Both /blog/ launched with 8 seeded posts
20. HK & SG /coaches/{coach-name}/ bio pages (Person schema)
21. Root /coaching-philosophy/

### Tier 3 — Months 3–6

22. Seasonal camp landing pages per holiday period, published 6–8 weeks in advance with Event schema
23. HK competition event pages
24. SG sports day and event pages
25. Catchment/local landing pages (only where honest — see Local SEO section)
26. Glossary / knowledge-base pages (gymnastics terminology, safety, developmental milestones)
27. Press / media coverage page

### Tier 4 — Months 6–12

28. Video library with transcripts (coaching technique, parent Q&A with Monica and Haikel)
29. Partner school co-branded landing pages (where mutual agreement exists)
30. Parent resource downloads (age-based milestone guides — email gated for lead capture)

---

## PART 13 — ADMIN PANEL / CMS ARCHITECTURE

### 13.1 Recommended stack

**Option A — Recommended: Next.js (App Router) frontend + Sanity or Payload CMS + Vercel + Cloudflare**

- **Frontend:** Next.js 15 (App Router, RSC), Tailwind, shadcn/ui pattern — gives premium design control, SSR/ISR for SEO, Core Web Vitals friendly.
- **CMS:** **Sanity** (hosted, excellent editor UX, strong real-time, media pipeline, role-based access) **or** **Payload CMS** (self-hosted, code-first, great for full control, built-in roles and auth).
- **Hosting:** Vercel for the frontend; Cloudflare in front for CDN, caching, DDoS and WAF (important given the `.net` malware history).
- **Media:** Sanity's CDN / Cloudflare Images / Mux for video.
- **Forms / bookings:** integrate with existing booking platform via API (most likely the client already has something — iClassPro, JackRabbit, TeamSnap, or similar); otherwise lightweight React forms → resend/postmark → CRM.
- **Analytics:** GA4, Search Console, Microsoft Clarity (free heatmap), Meta Pixel (if advertising), WhatsApp click tracking via GTM.

**Option B — Lower-lift: WordPress with strict setup**

If Option A is too technically involved for the team, WordPress is viable — but only with discipline:
- Block Editor (Gutenberg) only, no page-builder bloat
- Headless frontend or a very lightweight theme (e.g. Kadence Blocks)
- Image optimisation plugin (ShortPixel), Redis object cache, proper CDN
- Security: Wordfence + 2FA + managed host (WP Engine, Kinsta)
- Custom post types for *Programmes*, *Camps*, *Coaches*, *Venues*, *Parties*

**Why Option A wins for this brand:** The malware history on the legacy `.net` domain is a real signal that the previous platform (likely WordPress) was compromised — probably via an insecure plugin. A headless stack dramatically reduces that surface area. The editorial UX on Sanity is also significantly better for non-technical staff.

### 13.2 Editable vs static content map

| Block | Editable via CMS | Locked in code |
|---|---|---|
| Hero video / image | ✅ Media upload → hero module | Module layout |
| Hero H1 + subhead | ✅ Rich-text fields | Typography rules |
| Trust line | ✅ Single-line text | — |
| Programme cards (HK & SG) | ✅ Each card is a CMS entry with image, headline, blurb, link | Card design |
| Location block data | ✅ Venue entity with NAP, hours, photos | Map integration |
| Testimonials | ✅ Testimonial collection | — |
| Partner logos | ✅ Media library with alt text + sort order | — |
| Coach cards | ✅ Coach entries with photo + bio + role | Schema generation |
| Camp feature | ✅ Auto-pulled from Camps collection (next upcoming) | Fallback design |
| Blog feed | ✅ Auto-pulled latest 3 | Layout |
| FAQ items | ✅ Add/edit Q&A pairs → syncs to JSON-LD | Schema markup |
| Final CTA | ✅ CTA copy + link targets | — |
| Footer NAP | ✅ Pulled from Venue entities | Layout |
| Global announcement bar | ✅ On/off toggle + copy | — |
| Meta title / description per page | ✅ Per-document SEO fields | — |
| Schema markup | ⚠️ Auto-generated from CMS content — fields map to schema | Logic in code |

### 13.3 Dynamic sync — how content flows to the live site

- **Webhooks on publish:** When an editor hits Publish, the CMS fires a webhook to Vercel triggering an ISR revalidation of affected paths (e.g. publishing a new blog post revalidates `/blog/`, `/`, and the new post's slug). The site is fresh within seconds without a full deploy.
- **Scheduled publishing:** CMS cron jobs fire time-based publishes — a camp marked "goes live 1 March" appears automatically on that date.
- **Image pipeline:** Editors upload a single high-res master. The CMS serves optimised WebP/AVIF variants at requested dimensions. Alt text is required and warned if missing.
- **Preview mode:** Editors see their changes in a private preview URL before publishing.
- **Rollback:** Every publish creates a version history. Editors can revert.
- **Design protection:** The frontend enforces max heights/widths, truncation, and fallback imagery so no amount of editor input can break the layout. Extremely long headlines truncate with an ellipsis; missing images use a branded placeholder; empty blog sections hide gracefully.

### 13.4 Blog editor requirements

- Rich-text editor (Portable Text in Sanity, Lexical in Payload) with block styles: H2, H3, quote, image, embed (YouTube, Instagram), list, divider.
- Slug auto-generated from title, editable.
- Meta title + meta description fields per post.
- Featured image + alt text (mandatory — enforced).
- Category + tag taxonomies (seeded and editable).
- Author field linked to Coach/Staff entity (so bio and Person schema flow automatically).
- Read-time auto-calculated.
- Related-posts auto-surfaced (by tag overlap).
- Schedule / draft / publish / unpublish.
- "Feature on homepage" toggle per post.

### 13.5 Roles & permissions

| Role | Capabilities |
|---|---|
| Admin | Full access, user management |
| Editor | Create/edit/publish all content |
| Author | Create/edit own drafts, submit for review |
| Marketing | Edit homepage modules, announcements, camp features |
| View-only / auditor | Read all, no edit |

Enforce 2FA for Admin and Editor roles. Session timeouts on inactivity.

### 13.6 Security & anti-malware discipline (critical given .net history)

- Managed CMS (Sanity) removes most server attack surface.
- Cloudflare WAF + rate limiting + bot management.
- Principle of least privilege for CMS roles.
- Dependabot / automated security updates on the frontend.
- Weekly automated backups with 30-day retention.
- Security monitoring: Cloudflare logs + Sentry for runtime.
- No direct SSH access for non-engineers.
- Passwords/tokens in a secrets manager (Vercel env, 1Password Business).
- Annual external pen-test once traffic scales.

---

## PART 14 — BRAND & DESIGN IMPLEMENTATION

### 14.1 Colour usage

The current ProActiv / Prodigy visual system leans on **bright, energetic primary colours** — reflecting a children's brand that is active, joyful, and confident. Honour that equity. Do not replace it.

**Recommended system:** extract the **exact hex values** from the current site's brand asset files (logo SVG, brand guidelines if available, or via eye-dropper from hero imagery). Then build a disciplined token system around them:

| Role | Purpose | Suggested treatment |
|---|---|---|
| Primary (Brand) | Existing brand blue / navy | Headlines, CTAs, footer. Use boldly but sparingly. |
| Secondary (Energy) | Existing brand yellow / orange | Accent CTAs, highlights, active states, section dividers. |
| Tertiary (Accent) | Existing brand red / coral | Special emphasis only — urgent offers, "Featured" tags. |
| Neutral Dark | Deep charcoal, not black | Body text, footer background. Avoids harshness. |
| Neutral Mid | Warm grey | Secondary text, dividers. |
| Neutral Light | Off-white (not pure white) | Page background. Reduces glare, feels premium. |
| Surface | Pure white | Cards, containers — for contrast. |
| Semantic | Success / warning / error | Functional only, never brand moments. |

**Token implementation:** store all colours as CSS variables (`--pas-primary`, `--pas-accent`, etc.) so future refinements are one-line changes.

**Accessibility:** every primary colour must pass WCAG AA contrast against its common background (≥4.5:1 for body text, ≥3:1 for large text and UI). Test with Stark or the Accessibility Insights browser extension before launch.

### 14.2 Typography

- **Display face:** a confident, slightly editorial humanist sans (e.g. Inter Display, General Sans, or GT Walsheim if budget allows). Used for H1/H2, larger than you'd instinctively set it.
- **Body face:** the same family's text weight — not a different face. Consistency builds trust.
- **Accent/editorial:** optional second face only for section eyebrows or pull-quotes (e.g. a tasteful serif like Source Serif or Fraunces). Use sparingly.

### 14.3 Visual direction (avoiding the "AI site" look)

**Avoid:**
- Centre-aligned hero with a huge gradient blob behind it (universal SaaS template)
- Purple-to-blue gradients
- Identical three-column "features" rows with round-icon tiles
- Stock photography of smiling children that are obviously not your students
- Ghost-button CTAs in light-grey outlines
- Generic Lottie animations of bouncing dots
- Uniform card grids for every section

**Do instead:**
- **Editorial asymmetry** — image on one side, copy on the other, with deliberate whitespace. Vary from section to section.
- **Real photography of real coaches and real children** (with signed consents). This is the single most powerful distinguisher.
- **Motion as delight, not decoration** — a child's cartwheel looping in the hero, a subtle hover that rotates a card, a scroll-linked reveal. Keep motion sub-300ms and respect `prefers-reduced-motion`.
- **Confident type scale** — H1 at 72–96px on desktop. Don't fear big type.
- **Textured backgrounds** — subtle paper texture, soft grain, or chalk-style illustrations for section dividers. Keeps it warm.
- **Hand-drawn illustration accents** — tiny, not everywhere. A doodle of a cartwheeling stick figure beside a headline. Child-brand authentic, AI-template foreign.
- **Varied section layouts** — card grid here, horizontal scroll there, split-screen location block, full-bleed video elsewhere. Each section earns its design.
- **Brand voice in microcopy** — "Come say hi" beats "Contact us". "We'd love to meet your child" beats "Submit enquiry".

### 14.4 Photography direction

- **Real.** Shoot a single-day photography session at each venue with a professional sports/lifestyle photographer familiar with children. Budget: ~HK$25–40k or S$5–8k per session depending on scope.
- **Real kids, real coaches.** Signed photo releases.
- **Dynamic, candid, bright.** Mid-movement, laughter, effort. Avoid posed "sports school brochure" shots.
- **Include family moments** — a parent in the Viewing area, a birthday cake moment, two siblings arriving together.
- **Cover verticals.** Every shot needed in both landscape (web hero) and portrait (mobile, stories). Brief the photographer.
- **Include all three venues and both markets.** Don't over-represent Hong Kong at Singapore's expense or vice versa.

### 14.5 Video direction

- **Hero videos:** 8–12s loops, silent (never autoplay sound), lightweight (<2MB), with still image poster fallback.
- **Content videos:** short coach/parent/child mini-documentaries, 30–90s, embedded into programme pages and shared on YouTube/Instagram.
- **Accessibility:** captions always. Visible transcripts on video pages for SEO.

### 14.6 Design implementation notes

- Mobile-first — design for a phone first, scale up.
- Max content width 1280–1440px on desktop; don't let wide screens pull paragraphs to 100+ characters per line.
- Section spacing: consistent vertical rhythm (64px / 96px / 128px), not arbitrary.
- Shadows and borders: use sparingly and consistently.
- Button hierarchy: 1 primary CTA per section, always; secondary and tertiary only when earned.
- Icon set: one consistent icon family throughout (Lucide, Phosphor, or a bespoke set).

---

## PART 15 — FINAL RECOMMENDATIONS

### 15.1 Best-practice notes

1. **Launch the root + both homepages + Tier 1 supporting pages together.** A beautiful homepage with nothing behind it underwhelms. Each homepage CTA should land somewhere credible.
2. **Freeze the brand facts.** Choose one phrasing of the "what we are" sentence and use it everywhere — site, GBP, social bios, press templates, schema. Inconsistency is the enemy of entity clarity.
3. **Invest in the photography day before launch.** No single decision affects perceived quality more. Stock imagery is the fastest route to looking generic.
4. **Set a content publishing cadence from day one.** 1 blog post per week minimum per market, alternating so each market gets 2 per month. Compound over 12 months.
5. **Track the right metrics.**
   - **SEO:** rankings for the 20 priority queries per market, organic clicks by landing page, indexed page count, Core Web Vitals.
   - **LLM visibility:** quarterly audit — ask ChatGPT, Perplexity, Gemini, and Claude the 10 priority questions from the brief and record whether ProActiv is mentioned, correctly, and favourably.
   - **Local:** GBP impressions, actions (calls, directions, website), review velocity and rating per location.
   - **Conversion:** trial bookings per week, camp fills, party bookings, enquiry-to-trial conversion rate.
   - **Technical:** Core Web Vitals p75, uptime, crawl errors.
6. **Review schema and FAQ content quarterly.** Both Google and LLMs reward freshness on factual content.

### 15.2 Warnings

1. **The legacy `.net` domain reputation is a live risk.** Before launch, get the legacy domain professionally audited (Sucuri, Google Safe Browsing check, malicious code scan). Plan 301 redirects URL-by-URL to preserve equity, then leave the `.net` in place for 6–12 months before decommission. Monitor for any historical malware re-infection during that window.
2. **Don't let subdomains fragment your GA4 tracking.** Use cross-domain tracking configuration so a user travelling from root to HK to a blog post is one session, not three.
3. **Never fake reviews or testimonials.** The short-term gain is not worth the brand damage. Collect real reviews systematically.
4. **Respect PDPA (Singapore) and PDPO (Hong Kong).** Cookie banners, consent capture, photo releases for children (parental consent mandatory). Get legal review before launch.
5. **The CMS is only as good as the habits around it.** Train the team. Document standards (image sizes, alt text rules, SEO field completion, publishing checklist). One untrained editor can undo months of SEO discipline in an afternoon.
6. **Do not over-optimise internal anchor text.** Natural variety outperforms keyword-stuffed consistency. Google has spent a decade learning to detect the latter.
7. **Beware AI-generated blog content shortcuts.** Publishing high-volume, low-quality AI content will damage topical authority. Every published piece should meet a genuine editorial bar: a real insight, real expert voice, real value. It's fine to *draft* with AI; not fine to *publish* raw AI.

### 15.3 Opportunities for future scale

1. **Third-market readiness.** The architecture plugs in a Bangkok, Dubai, or Tokyo subdomain with zero re-architecting if expansion happens.
2. **A members-only parent portal.** Login, class schedules, progress reports, competition results, photo gallery per child. Massive retention lever. Builds behind the public site; doesn't affect SEO.
3. **Coach-led YouTube channel.** Monica and Haikel have genuine expert authority. A modest video pipeline (1 video/fortnight) builds both AI-visibility and backlink flow over 12–24 months.
4. **Methodology licensing / franchise model.** If the "ProActiv Sports training course" for coaches is genuinely differentiated, packaging it as a licensable product for sports schools in other markets is a natural next move. The ecosystem already tells that story at the root level.
5. **Corporate partnerships.** Corporate sports days for international school parents' employers (banks, consultancies in HK and SG). A thin `/corporate/` page on the root gateway could capture this lead flow.
6. **Events and summer intensives.** Once the venues in both markets stabilise, co-branded signature events ("ProActiv Summer Intensive") can be commercial AND marketing — driving press, local links, and brand story.
7. **Wikipedia presence.** Not something to chase directly, but a natural consequence of earning genuine press coverage. The brief's PR-link framework is the on-ramp.

### 15.4 First 90 days — concrete sequencing

**Weeks 0–2:** Technical setup — domain acquisition (if needed), DNS, Vercel + Cloudflare, CMS scaffolding, legacy-site crawl and URL mapping, analytics and Search Console verification across three properties.

**Weeks 2–4:** Photography day in each city. Design system build. Root gateway + both homepages in Figma, approved.

**Weeks 4–7:** Build — frontend, CMS content modelling, blog migration of any legacy posts worth keeping, schema implementation, form wiring to existing booking system.

**Weeks 7–9:** Tier 1 supporting pages built and content-loaded. Internal QA, accessibility audit (WCAG AA), Core Web Vitals optimisation pass, security review.

**Week 10:** Soft launch — new ecosystem live, legacy `.net` 301-redirected URL-by-URL. Submit fresh sitemaps. Announce to existing database only.

**Weeks 11–13:** Local SEO sprint — citations, GBP optimisation across three locations, review acquisition campaign, first PR outreach wave, first 10 backlinks earned. First 4 blog posts published. LLM-visibility baseline audit recorded.

**Day 90 review:** Measure against rankings baseline, organic traffic baseline, trial booking baseline. Adjust content cadence and backlink targets based on what's converting.

---

*This strategy document should be read alongside the client's existing brand assets (logo, colour palette, photography library) and the current booking platform's API documentation. Exact hex colour values, logo files, and booking integration specs should be confirmed with the ProActiv Sports team before build begins.*

*Final note on integrity: no recommendation in this document relies on manipulation, spam, or black-hat tactics. The strategy is designed to win on merit — because that is the only strategy that holds up over a decade, which is the time horizon a brand like ProActiv Sports, now 14 years old and still growing, deserves to be built for.*

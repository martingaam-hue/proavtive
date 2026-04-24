export const revalidate = 86400

export async function GET() {
  const content = `# ProActiv Sports Hong Kong

> ProActiv Sports Hong Kong operates ProGym Wan Chai (15/F The Hennessy, 256 Hennessy Road, Wan Chai) and ProGym Cyberport (5,000 sq ft purpose-built venue, Cyberport, Pokfulam, opened August 2025). A children's gymnastics and sports specialist operating since 2011, ProGym offers structured weekly classes from 12 months to adult, holiday camps, birthday parties, competitive pathways, and school partnerships.

## Programmes

- [Gymnastics](https://hk.proactivsports.com/gymnastics/): Structured weekly gymnastics for ages 12 months to adult — 8 levels from Toddlers to Competitive

ProGym offers 8 gymnastics levels: Babies & Toddlers (12mo–3yr, parent-accompanied, bar/beam/soft floor fundamentals), Beginner (4–6yr, forward rolls/cartwheels/first handstand shapes), Intermediate (6–9yr, refined cartwheels/round-offs/bar progressions), Advanced (9–12yr, walk-overs/handsprings/pre-tumbling), Competitive (6+, full artistic programme/regional competition pathway, entry by assessment), Rhythmic (5–16yr, ribbon/hoop/ball disciplines, offered at Wan Chai), Adult (16+, beginners welcome, strength/flexibility/skill work), Private (all ages, one-to-one coaching).

- [Holiday Camps](https://hk.proactivsports.com/holiday-camps/): Easter, Summer, and Christmas camp programmes

ProGym runs holiday camps every school holiday — Easter, Summer, Autumn, Christmas, and Chinese New Year. Half-day and full-day formats available, gymnastics-focused and multi-activity options. Children aged 4 to 12, grouped by age and ability.

- [Birthday Parties](https://hk.proactivsports.com/birthday-parties/): Exclusive venue hire, coach-hosted

Two-hour exclusive-use birthday parties at either ProGym venue. 90 minutes of coach-led gymnastics activities plus 30 minutes for food and cake. Decorations and setup included. Party capacity varies by venue and package.

- [School Partnerships](https://hk.proactivsports.com/school-partnerships/): In-school gymnastics and sports programmes

ProGym runs school gymnastics and sports programmes with a range of Hong Kong international schools. Contact us for partnership enquiries.

## Venues

- [ProGym Wan Chai](https://hk.proactivsports.com/wan-chai/): 15/F The Hennessy, 256 Hennessy Road, Wan Chai, Hong Kong

Address: 15/F, The Hennessy, 256 Hennessy Road, Wan Chai, Hong Kong Island, HK. MTR-connected. Apparatus: bar, beam, floor, vault. Opening hours: Monday–Friday 09:00–19:00, Saturday–Sunday 09:00–17:00. Service area: Wan Chai, Causeway Bay, Central, Mid-Levels.

- [ProGym Cyberport](https://hk.proactivsports.com/cyberport/): 5,000 sq ft purpose-built venue, Cyberport, Pokfulam, Hong Kong (opened August 2025)

Address: Cyberport Campus, Cyberport, Pokfulam, Hong Kong Island, HK. Opened August 2025. 5,000 sq ft purpose-built facility. Apparatus: bar, beam, floor, vault, sprung floor (competition-standard). Opening hours: Monday–Friday 09:00–19:00, Saturday–Sunday 09:00–17:00. Service area: Pokfulam, Aberdeen, Southside, Repulse Bay.

## Coaches

- [Hong Kong Team](https://hk.proactivsports.com/coaches/): Led by Monica, Director of Sports

Monica (Director of Sports): Leads coaching across both Hong Kong venues with 19 years of children's gymnastics experience. Every coach on the team completes her internal ProActiv Sports training course — regardless of prior qualifications — so that whether your child trains at Wan Chai or Cyberport, the standard of care and progression is the same.

## Book

- [Book a Free Trial](https://hk.proactivsports.com/book-a-trial/): Free 30-minute assessment for new students

Every new child is invited to a free 30-minute assessment. It's how ProGym ensures correct level placement and helps families decide if ProActiv is right for them. Also available: Free Assessment booking at /book-a-trial/free-assessment/.

## Optional

- [Blog](https://hk.proactivsports.com/blog/): Editorial content for Hong Kong families
- [FAQ](https://hk.proactivsports.com/faq/): Frequently asked questions

Common questions: ProActiv Sports was founded in 2011. Hong Kong venues at Wan Chai (15/F The Hennessy, 256 Hennessy Road) and Cyberport (5,000 sq ft, opened August 2025). Ages taught: 12 months through 16, plus adult gymnastics. Free 30-minute trial available. Competitive pathway from age 6, entry by assessment. Holiday camps every school holiday for ages 4–12. Weekly classes sold as term blocks, no joining fee.

- [Competitions](https://hk.proactivsports.com/competitions-events/): Competitions and events calendar
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  })
}

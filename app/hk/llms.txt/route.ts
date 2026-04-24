export const revalidate = 86400

export async function GET() {
  const content = `# ProActiv Sports Hong Kong

> ProActiv Sports Hong Kong operates ProGym Wan Chai (15/F The Hennessy, 256 Hennessy Road, Wan Chai) and ProGym Cyberport (5,000 sq ft purpose-built venue, Cyberport, Pokfulam, opened August 2025). A children's gymnastics and sports specialist operating since 2011, ProGym offers structured weekly classes from 12 months to adult, holiday camps, birthday parties, competitive pathways, and school partnerships.

## Programmes
- [Gymnastics](https://hk.proactivsports.com/gymnastics/): Structured weekly gymnastics for ages 12 months to adult — 8 levels from Toddlers to Competitive
- [Holiday Camps](https://hk.proactivsports.com/holiday-camps/): Easter, Summer, and Christmas camp programmes
- [Birthday Parties](https://hk.proactivsports.com/birthday-parties/): Exclusive venue hire, coach-hosted
- [School Partnerships](https://hk.proactivsports.com/school-partnerships/): In-school gymnastics and sports programmes

## Venues
- [ProGym Wan Chai](https://hk.proactivsports.com/wan-chai/): 15/F The Hennessy, 256 Hennessy Road, Wan Chai, Hong Kong
- [ProGym Cyberport](https://hk.proactivsports.com/cyberport/): 5,000 sq ft purpose-built venue, Cyberport, Pokfulam, Hong Kong (opened August 2025)

## Coaches
- [Hong Kong Team](https://hk.proactivsports.com/coaches/): Led by Monica, Director of Sports

## Book
- [Book a Free Trial](https://hk.proactivsports.com/book-a-trial/): Free 30-minute assessment for new students

## Optional
- [Blog](https://hk.proactivsports.com/blog/): Editorial content for Hong Kong families
- [FAQ](https://hk.proactivsports.com/faq/): Frequently asked questions
- [Competitions](https://hk.proactivsports.com/competitions-events/): Competitions and events calendar
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  })
}

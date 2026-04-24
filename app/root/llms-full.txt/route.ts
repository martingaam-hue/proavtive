export const revalidate = 86400

export async function GET() {
  const content = `# ProActiv Sports

> ProActiv Sports is a premium children's gymnastics and multi-sport provider founded in Hong Kong in 2011. Operating under two sub-brands — ProGym (Hong Kong) and Prodigy (Singapore) — ProActiv runs structured weekly programmes, holiday camps, birthday parties, and school partnerships for children aged 2 to 16 across three venues: ProGym Wan Chai, ProGym Cyberport (HK), and Prodigy @ Katong Point (SG).

## About

- [Brand](https://proactivsports.com/brand/): Company history, leadership, and brand story

ProActiv Sports was founded in 2011 in Hong Kong. The company is led by Will (Founder), Monica (Director of Sports, HK), and Haikel (Head of Sports, SG). ProActiv believes in a coaching philosophy built on three pillars: Safety, Progression, and Confidence. The company has grown from a single gymnastics studio to a multi-venue, multi-market operation spanning Hong Kong and Singapore.

- [Coaching Philosophy](https://proactivsports.com/coaching-philosophy/): Safety, Progression, Confidence methodology

ProActiv's coaching methodology is structured around three principles: Safety (ensuring every child trains in a secure, age-appropriate environment), Progression (structured skill development from basic to advanced), and Confidence (building self-belief through achievement). Coaches are internationally trained and hold recognised gymnastics certifications.

## Markets

- [Hong Kong](https://hk.proactivsports.com/): ProGym Wan Chai and ProGym Cyberport — weekly gymnastics, camps, parties

ProActiv Sports in Hong Kong operates as ProGym. Two venues: ProGym Wan Chai (15/F The Hennessy, 256 Hennessy Road) and ProGym Cyberport (5,000 sq ft purpose-built venue, Cyberport, Pokfulam, opened August 2025). Programmes serve ages 12 months to adult with 8 levels of gymnastics, holiday camps, birthday parties, and school partnerships.

- [Singapore](https://sg.proactivsports.com/): Prodigy @ Katong Point — weekly classes, camps, MultiBall wall

ProActiv Sports in Singapore operates as Prodigy. One venue: Prodigy @ Katong Point (451 Joo Chiat Road, Level 3, Singapore 427664). Home of Singapore's only MultiBall wall. Programmes include weekly sports classes in Movement, Sports + MultiBall, and Climbing zones, Prodigy holiday camps (themed, multi-activity, gymnastics), birthday parties, and IFS school partnerships for ages 2 to 16.

## Contact

- [Contact](https://proactivsports.com/contact/): Market-routed enquiry form for HK and SG

ProActiv Sports can be contacted through the master contact form at proactivsports.com/contact/, which routes enquiries to the correct market (Hong Kong or Singapore) based on the user's selection. Telephone and WhatsApp contacts are available for each venue on their respective location pages.

## Optional

- [News](https://proactivsports.com/news/): Press and brand updates
- [Careers](https://proactivsports.com/careers/): Join the ProActiv coaching team
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  })
}

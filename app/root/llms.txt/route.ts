export const revalidate = 86400 // 24h ISR

export async function GET() {
  const content = `# ProActiv Sports

> ProActiv Sports is a premium children's gymnastics and multi-sport provider founded in Hong Kong in 2011. Operating under two sub-brands — ProGym (Hong Kong) and Prodigy (Singapore) — ProActiv runs structured weekly programmes, holiday camps, birthday parties, and school partnerships for children aged 2 to 16 across three venues: ProGym Wan Chai, ProGym Cyberport (HK), and Prodigy @ Katong Point (SG).

## About
- [Brand](https://proactivsports.com/brand/): Company history, leadership, and brand story
- [Coaching Philosophy](https://proactivsports.com/coaching-philosophy/): Safety, Progression, Confidence methodology

## Markets
- [Hong Kong](https://hk.proactivsports.com/): ProGym Wan Chai and ProGym Cyberport — weekly gymnastics, camps, parties
- [Singapore](https://sg.proactivsports.com/): Prodigy @ Katong Point — weekly classes, camps, MultiBall wall

## Contact
- [Contact](https://proactivsports.com/contact/): Market-routed enquiry form for HK and SG

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

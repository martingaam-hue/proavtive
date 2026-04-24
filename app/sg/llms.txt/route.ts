export const revalidate = 86400

export async function GET() {
  const content = `# Prodigy by ProActiv Sports Singapore

> Prodigy by ProActiv Sports operates at Katong Point (451 Joo Chiat Road, Level 3, Singapore 427664) and is home to Singapore's only MultiBall wall. Prodigy offers weekly sports classes in three zones (Movement, Sports + MultiBall, Climbing), Prodigy holiday camps, birthday parties, and school partnerships including the IFS programme for children aged 2 to 16.

## Programmes
- [Weekly Classes](https://sg.proactivsports.com/weekly-classes/): Movement, Sports + MultiBall, and Climbing zones for ages 2–16
- [Prodigy Camps](https://sg.proactivsports.com/prodigy-camps/): Themed, multi-activity, and gymnastics holiday camps
- [Birthday Parties](https://sg.proactivsports.com/birthday-parties/): Exclusive Katong Point venue hire with MultiBall access
- [School Partnerships](https://sg.proactivsports.com/school-partnerships/): IFS and in-school sports programmes

## Venue
- [Katong Point](https://sg.proactivsports.com/katong-point/): 451 Joo Chiat Road, Level 3, Singapore 427664 — Singapore's only MultiBall wall

## Coaches
- [Singapore Team](https://sg.proactivsports.com/coaches/): Led by Haikel, Head of Sports

## Book
- [Book a Free Trial](https://sg.proactivsports.com/book-a-trial/): Free trial class for new students

## Optional
- [Blog](https://sg.proactivsports.com/blog/): Editorial content for Singapore families
- [FAQ](https://sg.proactivsports.com/faq/): Frequently asked questions
- [Events](https://sg.proactivsports.com/events/): Upcoming events at Katong Point
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  })
}

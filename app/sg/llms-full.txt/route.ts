export const revalidate = 86400

export async function GET() {
  const content = `# Prodigy by ProActiv Sports Singapore

> Prodigy by ProActiv Sports operates at Katong Point (451 Joo Chiat Road, Level 3, Singapore 427664) and is home to Singapore's only MultiBall wall. Prodigy offers weekly sports classes in three zones (Movement, Sports + MultiBall, Climbing), Prodigy holiday camps, birthday parties, and school partnerships including the IFS programme for children aged 2 to 16.

## Programmes

- [Weekly Classes](https://sg.proactivsports.com/weekly-classes/): Movement, Sports + MultiBall, and Climbing zones for ages 2–16

Three zones: Movement Zone (ages 2–5, parent-accompanied, fundamental movement patterns: rolling/jumping/balancing/landing safely, first experiences on padded apparatus, early gymnastics shapes), Sports + MultiBall Zone (ages 5–12, football/basketball/rugby/tennis/dodgeball/martial arts plus Singapore's only MultiBall interactive wall, 60-minute weekly classes with skill rotation), Climbing Zone (all ages, fundamental climbing technique/footwork/body positioning/route reading, bouldering problem-solving, weekly sessions with progressive routes).

- [Prodigy Camps](https://sg.proactivsports.com/prodigy-camps/): Themed, multi-activity, and gymnastics holiday camps

Three camp types: Themed Camps (ages 4–12, Ninja Warrior/Pokémon/Superhero/LEGO City/STEAM themes, dri-fit T-shirt/indoor grip socks/camp certificate included, sport sessions woven into every theme), Multi-Activity Camps (ages 4–12, rotation across all three zones, football/basketball/rugby/tennis/dodgeball/martial arts, gymnastics fundamentals and parkour elements), Gymnastics Camps (ages 4–12, fundamentals: rolls/cartwheels/handstands/beam work, progressive skill challenges, coaching by ProActiv-certified gymnastics coaches).

- [Birthday Parties](https://sg.proactivsports.com/birthday-parties/): Exclusive Katong Point venue hire with MultiBall access

Fully planned, coach-hosted parties with exclusive venue use. Party Room with AV and lighting. Decorations sorted. MultiBall wall included.

- [School Partnerships](https://sg.proactivsports.com/school-partnerships/): IFS and in-school sports programmes

Trusted by international schools including the International French School (IFS). Term-time programmes, holiday camps with transport through ComfortDelGro, and sports days. Also programmes with KidsFirst and other international schools.

## Venue

- [Katong Point](https://sg.proactivsports.com/katong-point/): 451 Joo Chiat Road, Level 3, Singapore 427664 — Singapore's only MultiBall wall

Address: 451 Joo Chiat Road, Level 3, Katong, Singapore 427664. 2,700 sq ft fully indoor and air-conditioned venue. Apparatus: MultiBall interactive wall (Singapore's only), climbing wall, movement floor, sports court. Opening hours: Monday–Friday 09:00–19:00, Saturday–Sunday 09:00–17:00. Service area: Katong, Marine Parade, East Coast, Joo Chiat, Kembangan, Tanjong Katong.

## Coaches

- [Singapore Team](https://sg.proactivsports.com/coaches/): Led by Haikel, Head of Sports

Haikel (Head of Sports): "Mr. Muscle Man." Diploma in Sports Coaching. Seven-plus years of experience. The cultural heart of the Prodigy coaching team. Mark (Sports Director): Born in Singapore, background in major sports events including the Standard Chartered Marathon, the SEA Games, and the WTA Finals. Leads programme design. Coach King (Senior Coach): NROC-registered basketball coach with a broader multi-sport coaching philosophy: "Never limit a sporting activity to its known drills."

## Book

- [Book a Free Trial](https://sg.proactivsports.com/book-a-trial/): Free trial class for new students

Every new child is invited to a free 30-minute assessment — Prodigy learns what they can do, finds the right class, and helps families decide whether Prodigy is right for them.

## Optional

- [Blog](https://sg.proactivsports.com/blog/): Editorial content for Singapore families
- [FAQ](https://sg.proactivsports.com/faq/): Frequently asked questions

Common questions: Location is 451 Joo Chiat Road, Level 3, Katong Point, Singapore 427664. Ages: weekly classes from age 2, holiday camps ages 4–12 (exceptions for toilet-trained 3-year-olds). Sports offered: gymnastics, climbing, parkour, soccer, basketball, rugby, tennis, dodgeball, martial arts (karate, boxing, Muay Thai, capoeira), MultiBall interactive training. MultiBall is an interactive training wall — the only one in Singapore — that uses projection and sensor technology to turn sports drills into reactive, game-like experiences. Holiday camps every school holiday, themed weekly formats. Free 30-minute trial for every new child.

- [Events](https://sg.proactivsports.com/events/): Upcoming events at Katong Point
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  })
}

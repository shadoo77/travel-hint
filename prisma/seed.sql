-- Trav Hint seed data.
-- Idempotent: safe to re-run (upserts by slug).
-- Applied with: npm run db:seed  (prisma db execute --file prisma/seed.sql)

-- ---------------------------------------------------------------------------
-- Destinations
-- ---------------------------------------------------------------------------
INSERT INTO "Destination" ("id", "slug", "name", "country", "imageUrl", "blurb", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid()::text, 'istanbul', 'Istanbul', 'Türkiye',
   'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/Istanbul_skyline_01.jpg/1920px-Istanbul_skyline_01.jpg',
   $$Two continents, one ferry ticket.$$, now(), now()),
  (gen_random_uuid()::text, 'lisbon', 'Lisbon', 'Portugal',
   'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/A_view_of_the_city_%28Elevador_de_Santa_Justa_-_Lisbon%29_-_Apr_2007.jpg/1920px-A_view_of_the_city_%28Elevador_de_Santa_Justa_-_Lisbon%29_-_Apr_2007.jpg',
   $$Seven hills that repay every step.$$, now(), now()),
  (gen_random_uuid()::text, 'kyoto', 'Kyoto', 'Japan',
   'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Yasaka-dori_early_morning_with_street_lanterns_and_the_Tower_of_Yasaka_%28Hokan-ji_Temple%29%2C_Kyoto%2C_Japan.jpg/1920px-Yasaka-dori_early_morning_with_street_lanterns_and_the_Tower_of_Yasaka_%28Hokan-ji_Temple%29%2C_Kyoto%2C_Japan.jpg',
   $$The older, quieter Japan, awake before you are.$$, now(), now()),
  (gen_random_uuid()::text, 'mexico-city', 'Mexico City', 'Mexico',
   'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Calle_Xicot%C3%A9ncatl_Coyoac%C3%A1n.jpg/1920px-Calle_Xicot%C3%A9ncatl_Coyoac%C3%A1n.jpg',
   $$A capital that eats, argues, and paints until late.$$, now(), now()),
  (gen_random_uuid()::text, 'marrakech', 'Marrakech', 'Morocco',
   'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/Oriental_hanging_lanterns._Souk_Haddadine%2C_Marrakech_Medina%2C_Morocco.jpg/1920px-Oriental_hanging_lanterns._Souk_Haddadine%2C_Marrakech_Medina%2C_Morocco.jpg',
   $$A medina built to be wandered, not solved.$$, now(), now()),
  (gen_random_uuid()::text, 'hanoi', 'Hanoi', 'Vietnam',
   'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/Street_seller_of_fingered_citrons_in_Old_Town_of_Hanoi%2C_20240204_1335_5772.jpg/1920px-Street_seller_of_fingered_citrons_in_Old_Town_of_Hanoi%2C_20240204_1335_5772.jpg',
   $$Old Quarter mornings and egg coffee afternoons.$$, now(), now()),
  (gen_random_uuid()::text, 'copenhagen', 'Copenhagen', 'Denmark',
   'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/22/Houseboat_in_Copenhagen_Harbor_02.jpg/1920px-Houseboat_in_Copenhagen_Harbor_02.jpg',
   $$A harbour the city actually uses.$$, now(), now()),
  (gen_random_uuid()::text, 'oaxaca', 'Oaxaca', 'Mexico',
   'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/Oaxaca_City_from_the_air%2C_January_2023.jpg/1920px-Oaxaca_City_from_the_air%2C_January_2023.jpg',
   $$Smoke, chocolate, and the best mole of your life.$$, now(), now()),
  (gen_random_uuid()::text, 'seoul', 'Seoul', 'South Korea',
   'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Seoul_Skyline_Night_2018.jpg/1920px-Seoul_Skyline_Night_2018.jpg',
   $$Neon valleys between very steep hills.$$, now(), now())
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "country" = EXCLUDED."country",
  "imageUrl" = EXCLUDED."imageUrl",
  "blurb" = EXCLUDED."blurb",
  "updatedAt" = now();

-- ---------------------------------------------------------------------------
-- Articles
-- ---------------------------------------------------------------------------
INSERT INTO "Article" (
  "id", "slug", "title", "excerpt", "story", "imageUrl", "imageAlt", "imageCredit",
  "readMinutes", "tags", "favoriteCount", "published", "destinationId", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid()::text,
  v.slug,
  v.title,
  v.excerpt,
  v.story,
  v.image_url,
  v.image_alt,
  v.image_credit,
  v.read_minutes,
  v.tags,
  v.fav_count,
  true,
  d."id",
  now() - (v.ord::text || ' days')::interval,
  now()
FROM (VALUES
  (
    'istanbul-ferries-tea',
    'Tea, ferries, and the art of getting lost',
    $$The best plan for Istanbul is a ferry token, a seat on the upper deck, and absolutely no itinerary.$$,
    ARRAY[
      $$Every guidebook hands you a list. Istanbul hands you a strait, two continents, and a ferry schedule that reads like an invitation. The first thing to do here is not the Hagia Sophia at nine in the morning with four thousand other people. The first thing to do is buy a token, climb to the upper deck, and let the city arrange itself around you.$$,
      $$Cross to Kadıköy in the late afternoon. The light goes gold over the water, the gulls argue, and the tea comes in tulip glasses so hot they are basically a small religion. Nobody will rush you. On the Asian side, walk uphill until the streets turn residential, then find a table where the menu is a chalkboard and the chairs are plastic. Order whatever the next table is having.$$,
      $$Come back on the last ferry. The skyline reassembles itself in the dark: minarets, cranes, apartment blocks, a single lit-up billboard selling something you will never need. You will arrive with no photos that explain it and a phone full of blurry water. That is the correct outcome. Istanbul is not a checklist. It is a crossing.$$
    ],
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/Istanbul_skyline_01.jpg/1920px-Istanbul_skyline_01.jpg',
    $$Istanbul skyline across the Bosphorus at dusk$$,
    $$Wikimedia Commons$$,
    5,
    ARRAY['ferries', 'tea', 'bosphorus'],
    14,
    'istanbul',
    1
  ),
  (
    'lisbon-tiles',
    'The city that answers back in tiles',
    $$Lisbon does not whisper its history. It tiles it onto every wall and dares you to look up.$$,
    ARRAY[
      $$Lisbon is best read from above, and the city knows it. Every neighborhood has a miradouro, a viewpoint where the roofs stack toward the river and someone is always playing a guitar badly and beautifully. Start at Santa Justa before the queue forms, then abandon the elevator and walk. The hills are the point.$$,
      $$The tiles are not decoration. They are insulation, waterproofing, and a civic personality disorder expressed in blue and white. Look at the building numbers, the corner shops, the stairwells of ordinary apartment blocks. Somebody chose those patterns a century ago and nobody has had the courage to cover them since.$$,
      $$Ride the 28 tram exactly one stop, then get off and walk the rest. Eat a pastel de nata while it is still warm enough to burn the roof of your mouth, because that is the correct temperature. End the day at a kiosk with a plastic cup of wine, watching the river do its slow metallic thing. Lisbon rewards the pedestrian, not the punctual.$$
    ],
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/A_view_of_the_city_%28Elevador_de_Santa_Justa_-_Lisbon%29_-_Apr_2007.jpg/1920px-A_view_of_the_city_%28Elevador_de_Santa_Justa_-_Lisbon%29_-_Apr_2007.jpg',
    $$View over Lisbon rooftops from the Elevador de Santa Justa$$,
    $$Wikimedia Commons$$,
    4,
    ARRAY['tiles', 'trams', 'miradouros'],
    9,
    'lisbon',
    2
  ),
  (
    'kyoto-six-quiet-hours',
    'Six quiet hours before the crowds',
    $$Set an alarm for five in Kyoto and the city hands you a version of itself that tourists never meet.$$,
    ARRAY[
      $$The tour buses arrive at nine. Between five and nine, Kyoto belongs to delivery drivers, shrine gardeners, and anyone willing to be cold and slightly lost. Walk Yasaka-dori while the lanterns are still on and the pavement is wet. The tower at the end of the street floats above the mist like a stage prop nobody has struck yet.$$,
      $$Do not try to see everything. Pick one temple and arrive before it opens. Sit on the steps. Listen to the brooms. A monk will eventually appear and start sweeping in a rhythm that seems designed to slow your pulse. Stay until you are bored, then stay ten minutes longer. That is the actual practice.$$,
      $$By nine the shops are open and the first tour groups are forming a loose blockade near the station. This is your signal to eat breakfast, drink something hot, and go take a nap. You have already had the best hours of the day. Everything after this is a bonus round.$$
    ],
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Yasaka-dori_early_morning_with_street_lanterns_and_the_Tower_of_Yasaka_%28Hokan-ji_Temple%29%2C_Kyoto%2C_Japan.jpg/1920px-Yasaka-dori_early_morning_with_street_lanterns_and_the_Tower_of_Yasaka_%28Hokan-ji_Temple%29%2C_Kyoto%2C_Japan.jpg',
    $$Yasaka-dori at dawn with lanterns and Hokan-ji temple$$,
    $$Wikimedia Commons$$,
    6,
    ARRAY['temples', 'walking', 'dawn'],
    21,
    'kyoto',
    3
  ),
  (
    'mexico-city-breakfast',
    'Breakfast is a civic duty',
    $$In Mexico City, lunch is a rumor and breakfast is a three-hour religion practiced on plastic stools.$$,
    ARRAY[
      $$Start in Coyoacán, where the market opens early and the smell of chiles toasting hits you a block away. Find the stall with the longest line of people who are clearly not tourists. Point at what they are eating. You will be handed a plate of something that tastes like it was invented specifically to fix your morning.$$,
      $$The pacing matters. Breakfast here is not a sprint before sightseeing; it is the sightseeing. Sit down. Order a second coffee. Let the woman running the stall explain, with some concern, why you should also try the tlacoyo. Accept this. The city will keep running without your itinerary.$$,
      $$By noon you will be genuinely hungry again and slightly confused about how that is possible. Walk it off through the tree-lined streets, past the murals, past the dogs sleeping in doorways. Buy fruit you cannot name from a cart. Eat it on a bench. This is not a food tour. It is just Tuesday in Mexico City.$$
    ],
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Calle_Xicot%C3%A9ncatl_Coyoac%C3%A1n.jpg/1920px-Calle_Xicot%C3%A9ncatl_Coyoac%C3%A1n.jpg',
    $$A quiet street in Coyoacán, Mexico City$$,
    $$Wikimedia Commons$$,
    5,
    ARRAY['food', 'markets', 'coyoacan'],
    17,
    'mexico-city',
    4
  ),
  (
    'marrakech-rooftops',
    'Rooftops, mint, and a wrong turn worth taking',
    $$The medina is a maze by design. Surrender the map, follow the mint tea, and let the rooftops guide you home.$$,
    ARRAY[
      $$There is no efficient route through the souks of Marrakech and that is the entire point. The alleys narrow until two people cannot pass, then open into a courtyard full of lanterns, then close again. You will get turned around. You will be offered help by someone who wants to sell you something, and also by someone who genuinely wants to help. Accept both.$$,
      $$Mint tea is the reset button. Whenever you are properly lost, sit down, order a pot, and watch the street. Within ten minutes you will recognize a face from the other end of the medina, or a doorway you passed twice. The city is not hostile. It is just unimpressed by urgency.$$,
      $$Once it gets dark, head up. Rooftops are the medina's second city: plastic chairs, satellite dishes, cats, and the smell of grilled meat. Order dinner above the noise and watch the square turn orange. Nobody will ask why you are there. That is the hospitality, and it is the hint.$$
    ],
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/Oriental_hanging_lanterns._Souk_Haddadine%2C_Marrakech_Medina%2C_Morocco.jpg/1920px-Oriental_hanging_lanterns._Souk_Haddadine%2C_Marrakech_Medina%2C_Morocco.jpg',
    $$Lanterns hanging in Souk Haddadine, Marrakech medina$$,
    $$Wikimedia Commons$$,
    4,
    ARRAY['souks', 'tea', 'medina'],
    11,
    'marrakech',
    5
  ),
  (
    'hanoi-crossing-the-road',
    'Crossing the road is the whole metaphor',
    $$Hanoi traffic looks like chaos until you step into it and discover it is choreography.$$,
    ARRAY[
      $$The first time you cross a street in Hanoi, you will wait for a gap that never comes. It will not come. The trick is to walk at a slow, predictable pace and let the motorbikes flow around you like water around a rock. Do not run. Do not stop. Do not make eye contact with anyone who is also trying to compute your trajectory.$$,
      $$The Old Quarter works the same way. It is dense, loud, and apparently improvised, but nothing is actually random. Shops specialize by street and have for centuries. Somebody on the corner has been selling nothing but tin boxes since before your parents were born. Walk without a destination for an hour and the city will start to make a kind of sense.$$,
      $$Then sit down for egg coffee, which sounds like a mistake and tastes like a dessert that went to graduate school. Find a balcony, watch the traffic continue to not collide, and accept that some systems are too complex to understand from the outside. You do not need to understand it. You just need to step in and keep your pace.$$
    ],
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/Street_seller_of_fingered_citrons_in_Old_Town_of_Hanoi%2C_20240204_1335_5772.jpg/1920px-Street_seller_of_fingered_citrons_in_Old_Town_of_Hanoi%2C_20240204_1335_5772.jpg',
    $$A street seller in Hanoi's Old Quarter$$,
    $$Wikimedia Commons$$,
    5,
    ARRAY['street-food', 'old-quarter', 'coffee'],
    15,
    'hanoi',
    6
  ),
  (
    'copenhagen-harbour',
    'A harbour that behaves like a living room',
    $$Copenhagen's waterfront is not a postcard. It is where people swim before work and eat dinner on the quay.$$,
    ARRAY[
      $$Most cities treat their harbour as a view. Copenhagen treats it as furniture. People commute over it, swim in it, fish from the edge of it, and eat their lunch in front of it with the casual entitlement of someone sitting on their own sofa. The water is clean enough that this is reasonable.$$,
      $$Take the harbour bus instead of the metro. It is cheaper, it is slower, and it turns a commute into the best part of the day. Get off where the houseboats are and walk the rest. The architecture is famous, but the interesting thing is how normal it all feels: laundry, bicycles, a man repairing a small boat with the gravity of a surgeon.$$,
      $$At dusk, the light takes forever to leave. Find a bench and watch it go. Someone will be swimming in the dark and someone else will be eating from a paper basket. This is not an event. It is a Tuesday. That is the hint: find the city where the beautiful part is also the ordinary part.$$
    ],
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/22/Houseboat_in_Copenhagen_Harbor_02.jpg/1920px-Houseboat_in_Copenhagen_Harbor_02.jpg',
    $$A houseboat moored in Copenhagen harbour$$,
    $$Wikimedia Commons$$,
    4,
    ARRAY['harbor', 'cycling', 'design'],
    7,
    'copenhagen',
    7
  ),
  (
    'oaxaca-smoke-chocolate',
    'The city that tastes like smoke and chocolate',
    $$Oaxaca smells of toasted chiles before eight in the morning and tastes like mole by noon. Pace yourself.$$,
    ARRAY[
      $$The market opens in stages. First the produce, then the food stalls, then the smoke. By mid-morning the aisles are a dense, delicious obstacle course of chapulines, quesillo, and enormous bags of chiles. Eat standing up. This is not a compromise; it is the preferred method.$$,
      $$Mole is not a sauce here, it is a family tree. Every stall will tell you that theirs is the old way, with seventeen ingredients, or twenty-nine, or more than they will admit. Try at least three. You will not be able to pick a favorite, and that is the correct answer.$$,
      $$In the afternoon, walk uphill to the edge of the city and look back. The valley, the churches, the low sprawl of roofs. Buy a cup of chocolate and drink it while it is still slightly too hot. You are not on a schedule. Oaxaca is not a checklist either. It is a long, slow meal that happens to include a city.$$
    ],
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/Oaxaca_City_from_the_air%2C_January_2023.jpg/1920px-Oaxaca_City_from_the_air%2C_January_2023.jpg',
    $$Oaxaca City seen from above$$,
    $$Wikimedia Commons$$,
    5,
    ARRAY['food', 'markets', 'mezcal'],
    13,
    'oaxaca',
    8
  ),
  (
    'seoul-night-walks',
    'Night walks in a city that never dims',
    $$Seoul after dark is all neon, steep alleys, and convenience-store philosophy at two in the morning.$$,
    ARRAY[
      $$Seoul does not close. It changes shifts. The office workers go home and the students arrive, then the delivery riders, then the people who are simply not ready to end the day. The streets stay lit and the food stays hot. You are never the only person awake.$$,
      $$Walk uphill into the older neighborhoods and the scale changes completely. Neon disappears, the alleys narrow, and the hanok roofs sit low against the sky. Find a tiny place with four tables and order whatever comes with the most side dishes. Nobody will rush you out.$$,
      $$End at a convenience store, because that is what everyone does. Buy a drink, sit on the plastic chairs outside, and watch the city keep going. There is no view and no landmark and no reason to photograph it. It is just a city being itself at an hour when most cities are sleeping. That is the whole hint.$$
    ],
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Seoul_Skyline_Night_2018.jpg/1920px-Seoul_Skyline_Night_2018.jpg',
    $$Seoul skyline at night$$,
    $$Wikimedia Commons$$,
    4,
    ARRAY['night', 'food', 'hanok'],
    19,
    'seoul',
    9
  )
) AS v(slug, title, excerpt, story, image_url, image_alt, image_credit, read_minutes, tags, fav_count, dest_slug, ord)
JOIN "Destination" d ON d."slug" = v.dest_slug
ON CONFLICT ("slug") DO UPDATE SET
  "title" = EXCLUDED."title",
  "excerpt" = EXCLUDED."excerpt",
  "story" = EXCLUDED."story",
  "imageUrl" = EXCLUDED."imageUrl",
  "imageAlt" = EXCLUDED."imageAlt",
  "imageCredit" = EXCLUDED."imageCredit",
  "readMinutes" = EXCLUDED."readMinutes",
  "tags" = EXCLUDED."tags",
  "favoriteCount" = EXCLUDED."favoriteCount",
  "destinationId" = EXCLUDED."destinationId",
  "updatedAt" = now();

-- ---------------------------------------------------------------------------
-- Baseline favorites so card counts are real rows, not decorative numbers.
-- ---------------------------------------------------------------------------
INSERT INTO "Favorite" ("id", "articleId", "visitorId", "createdAt")
SELECT
  gen_random_uuid()::text,
  a."id",
  'seed-' || a."slug" || '-' || g,
  now() - (g::text || ' hours')::interval
FROM "Article" a
CROSS JOIN LATERAL generate_series(1, a."favoriteCount") AS g
ON CONFLICT ("articleId", "visitorId") DO NOTHING;

-- Recompute the denormalized counter from the favourite table.
UPDATE "Article" a
SET "favoriteCount" = (SELECT count(*) FROM "Favorite" f WHERE f."articleId" = a."id");

-- Remove the API smoke-test fixture if a previous run created it.
DELETE FROM "Article" WHERE "slug" = 'smoke-test-hint';

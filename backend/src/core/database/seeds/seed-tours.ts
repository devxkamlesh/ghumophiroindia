/**
 * Tour seed script — inserts full mock tour data.
 *
 * Run with:  npm run db:seed
 *
 * Safe to re-run: existing slugs are skipped (onConflictDoNothing).
 */

import 'dotenv/config'
import db from '../index'
import { tours } from '../schema'

type NewTour = typeof tours.$inferInsert

const img = (id: string) => `https://images.unsplash.com/${id}?w=1200&q=80`

const MOCK_TOURS: NewTour[] = [
  {
    title: 'Royal Rajasthan Grand Heritage Tour',
    slug: 'royal-rajasthan-grand-heritage-tour',
    description:
      'Journey through the land of kings on this 8-day grand tour of Rajasthan. Discover majestic forts, opulent palaces, vibrant bazaars and the golden sands of the Thar Desert.',
    longDescription:
      'From the pink streets of Jaipur to the lakeside palaces of Udaipur and the blue alleys of Jodhpur, this curated journey captures the soul of royal Rajasthan. Stay in heritage hotels, ride camels across the dunes of Jaisalmer, and witness sunsets over centuries-old fortresses.',
    duration: 8,
    price: '35900',
    maxGroupSize: 16,
    difficulty: 'easy',
    category: 'heritage',
    images: [
      img('photo-1599661046289-e31897846e41'),
      img('photo-1477587458883-47145ed94245'),
      img('photo-1524492412937-b28074a5d7da'),
      img('photo-1609920658906-8223bd289001'),
      img('photo-1561361513-2d000a50f0dc'),
      img('photo-1548013146-72479768bada'),
    ],
    highlights: [
      '🏰 Explore the magnificent Amber Fort & City Palace',
      '🐫 Sunset camel safari over the Thar Desert dunes',
      '🛶 Boat ride on the serene Lake Pichola, Udaipur',
      '🛍️ Shop in the colourful bazaars of Jaipur',
      '🌅 Witness golden-hour views from Mehrangarh Fort',
      '🍽️ Authentic royal Rajasthani thali dinner',
    ],
    included: [
      'Hotel accommodation (7 nights, 3★/4★)',
      'Daily breakfast and dinner',
      'Air-conditioned private transport',
      'Professional English-speaking guide',
      'All sightseeing & monument entry fees',
      'Camel safari in Jaisalmer',
    ],
    excluded: [
      'Airfare / train tickets to Jaipur',
      'Lunch and personal expenses',
      'Camera fees at monuments',
      'Travel insurance',
      'Tips and gratuities',
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Jaipur', description: 'Arrive in the Pink City and check in to your heritage hotel.', activities: ['Airport pickup', 'Hotel check-in', 'Welcome Dinner'] },
      { day: 2, title: 'Jaipur Sightseeing', description: 'Full day exploring the forts and palaces of Jaipur.', activities: ['Breakfast', 'Amber Fort', 'City Palace', 'Hawa Mahal', 'Dinner'] },
      { day: 3, title: 'Jaipur to Pushkar', description: 'Drive to the holy town of Pushkar.', activities: ['Breakfast', 'Brahma Temple', 'Pushkar Lake', 'Dinner'] },
      { day: 4, title: 'Pushkar to Udaipur', description: 'Scenic drive to the City of Lakes.', activities: ['Breakfast', 'Enroute Lunch', 'Evening at leisure', 'Dinner'] },
      { day: 5, title: 'Udaipur Sightseeing', description: 'Discover lakeside palaces and gardens.', activities: ['Breakfast', 'City Palace Udaipur', 'Lake Pichola boat ride', 'Dinner'] },
      { day: 6, title: 'Udaipur to Jodhpur', description: 'Travel to the Blue City.', activities: ['Breakfast', 'Mehrangarh Fort', 'Dinner'] },
      { day: 7, title: 'Jodhpur to Jaisalmer', description: 'Journey to the Golden City and desert camp.', activities: ['Breakfast', 'Camel Safari', 'Sand dunes sunset', 'Dinner'] },
      { day: 8, title: 'Departure', description: 'Transfer for your onward journey.', activities: ['Breakfast', 'Hotel check-out', 'Drop-off'] },
    ],
    destinations: ['Jaipur', 'Pushkar', 'Udaipur', 'Jodhpur', 'Jaisalmer'],
    rating: '4.8',
    reviewCount: 214,
    isActive: true,
    isFeatured: true,
  },
  {
    title: 'Himachal Pocket Adventure',
    slug: 'himachal-pocket-adventure',
    description:
      'A 7-day Himalayan escape through Shimla, Manali and Kasol. Pine forests, snow peaks, riverside cafés and adventure activities await.',
    longDescription:
      'Breathe the crisp mountain air as you wind through the valleys of Himachal Pradesh. From colonial Shimla to the adventure hub of Manali and the bohemian vibes of Kasol, this trip balances sightseeing, nature and adrenaline.',
    duration: 7,
    price: '22999',
    maxGroupSize: 20,
    difficulty: 'moderate',
    category: 'adventure',
    images: [
      img('photo-1626621341517-bbf3d9990a23'),
      img('photo-1593181629936-11c609b8db9b'),
      img('photo-1571536802807-30451e3955d8'),
      img('photo-1605640840605-14ac1855827b'),
      img('photo-1506905925346-21bda4d32df4'),
    ],
    highlights: [
      '🏔️ Snow views at Solang Valley & Rohtang area',
      '🎿 Optional paragliding and zip-lining',
      '🌲 Walk through deodar pine forests in Shimla',
      '☕ Riverside cafés in Kasol & Old Manali',
      '🛕 Visit Hadimba Temple & Manu Temple',
    ],
    included: [
      'Hotel accommodation (6 nights)',
      'Daily breakfast',
      'Volvo / tempo traveller transport',
      'Sightseeing as per itinerary',
      'Driver allowances, tolls & parking',
    ],
    excluded: [
      'Adventure activity charges',
      'Lunch & dinner',
      'Rohtang Pass permit (if applicable)',
      'Personal expenses',
    ],
    itinerary: [
      { day: 1, title: 'Delhi to Shimla', description: 'Morning departure from Delhi to Shimla.', activities: ['Departure 9 AM', 'Enroute Lunch', 'Check-in', 'Dinner & overnight stay'] },
      { day: 2, title: 'Shimla & Kufri', description: 'Local sightseeing around Shimla.', activities: ['Breakfast', 'Kufri', 'Mall Road', 'The Ridge', 'Night departure to Manali'] },
      { day: 3, title: 'Manali Local', description: 'Arrive Manali and explore local sights.', activities: ['Hotel check-in', 'Breakfast', 'Hadimba Temple', 'Mall Road', 'Dinner'] },
      { day: 4, title: 'Solang Valley', description: 'Day trip to Solang Valley for adventure.', activities: ['Breakfast', 'Solang Valley', 'Adventure activities', 'Dinner'] },
      { day: 5, title: 'Manali to Kasol', description: 'Drive to the Parvati Valley.', activities: ['Breakfast', 'Kasol riverside', 'Dinner'] },
      { day: 6, title: 'Kasol & Manikaran', description: 'Explore Manikaran hot springs.', activities: ['Breakfast', 'Manikaran Sahib', 'Leisure', 'Dinner'] },
      { day: 7, title: 'Return to Delhi', description: 'Overnight journey back to Delhi.', activities: ['Breakfast', 'Departure'] },
    ],
    destinations: ['Shimla', 'Kufri', 'Manali', 'Kasol'],
    rating: '4.7',
    reviewCount: 168,
    isActive: true,
    isFeatured: true,
  },
  {
    title: 'Golden Triangle Express',
    slug: 'golden-triangle-express',
    description:
      "India's most iconic 6-day circuit covering Delhi, Agra and Jaipur — including the timeless Taj Mahal.",
    longDescription:
      'Perfect for first-time visitors, the Golden Triangle packs in Mughal monuments, Rajput forts and the bustling energy of three historic cities. Marvel at the Taj Mahal at sunrise and wander the bazaars of the Pink City.',
    duration: 6,
    price: '28900',
    maxGroupSize: 18,
    difficulty: 'easy',
    category: 'heritage',
    images: [
      img('photo-1564507592333-c60657eea523'),
      img('photo-1548013146-72479768bada'),
      img('photo-1597040663342-45b6c1f0f0a6'),
      img('photo-1524492412937-b28074a5d7da'),
      img('photo-1587474260584-136574528ed5'),
    ],
    highlights: [
      '🕌 Sunrise visit to the Taj Mahal',
      '🏯 Explore Agra Fort & Fatehpur Sikri',
      '🏰 Amber Fort jeep ride in Jaipur',
      '🛺 Old Delhi rickshaw experience',
      '🛍️ Shopping at Johari Bazaar',
    ],
    included: [
      'Hotel accommodation (5 nights, 4★)',
      'Daily breakfast',
      'Private AC car with driver',
      'Local guides at each city',
      'Monument entry fees',
    ],
    excluded: [
      'Flights to/from Delhi',
      'Lunch & dinner',
      'Tonga / elephant ride charges',
      'Personal expenses & tips',
    ],
    itinerary: [
      { day: 1, title: 'Arrive Delhi', description: 'Welcome to the capital.', activities: ['Airport pickup', 'Hotel check-in', 'Dinner'] },
      { day: 2, title: 'Delhi Sightseeing', description: 'Old and New Delhi tour.', activities: ['Breakfast', 'Qutub Minar', 'India Gate', 'Humayun’s Tomb', 'Dinner'] },
      { day: 3, title: 'Delhi to Agra', description: 'Drive to Agra.', activities: ['Breakfast', 'Agra Fort', 'Mehtab Bagh sunset', 'Dinner'] },
      { day: 4, title: 'Taj Mahal & to Jaipur', description: 'Sunrise Taj, then drive to Jaipur.', activities: ['Sunrise Taj Mahal', 'Breakfast', 'Fatehpur Sikri', 'Dinner'] },
      { day: 5, title: 'Jaipur Sightseeing', description: 'Forts and palaces of the Pink City.', activities: ['Breakfast', 'Amber Fort', 'City Palace', 'Hawa Mahal', 'Dinner'] },
      { day: 6, title: 'Departure', description: 'Drive back to Delhi for departure.', activities: ['Breakfast', 'Drop-off'] },
    ],
    destinations: ['Delhi', 'Agra', 'Jaipur'],
    rating: '4.6',
    reviewCount: 302,
    isActive: true,
    isFeatured: true,
  },
  {
    title: 'Kerala Backwaters Bliss',
    slug: 'kerala-backwaters-bliss',
    description:
      'A relaxing 5-day journey through Munnar tea hills, Thekkady spice gardens and the tranquil Alleppey backwaters on a private houseboat.',
    longDescription:
      "Unwind in God's Own Country. Sip fresh tea among emerald plantations, spot wildlife in Periyar, and cruise the palm-fringed backwaters aboard a traditional houseboat with home-cooked Kerala cuisine.",
    duration: 5,
    price: '31500',
    maxGroupSize: 12,
    difficulty: 'easy',
    category: 'nature',
    images: [
      img('photo-1602216056096-3b40cc0c9944'),
      img('photo-1593693411515-c20261bcad6e'),
      img('photo-1529963183134-61a90db47eaf'),
      img('photo-1623665450649-3a8b6f0a8b8a'),
      img('photo-1580457182331-3e0e8b6f1f2c'),
    ],
    highlights: [
      '🍃 Tea plantation walk in Munnar',
      '🐘 Wildlife boat safari at Periyar Lake',
      '🛶 Overnight houseboat stay in Alleppey',
      '🌶️ Spice garden tour in Thekkady',
      '🥥 Authentic Kerala sadya meal',
    ],
    included: [
      'Hotel + houseboat accommodation (4 nights)',
      'Daily breakfast & houseboat full board',
      'Private AC vehicle',
      'Houseboat cruise',
      'Sightseeing as per itinerary',
    ],
    excluded: [
      'Flights to Kochi',
      'Lunch & dinner (except houseboat)',
      'Entry fees & activity charges',
      'Personal expenses',
    ],
    itinerary: [
      { day: 1, title: 'Kochi to Munnar', description: 'Drive to the hill station of Munnar.', activities: ['Pickup at Kochi', 'Enroute waterfalls', 'Check-in', 'Dinner'] },
      { day: 2, title: 'Munnar Sightseeing', description: 'Tea gardens and viewpoints.', activities: ['Breakfast', 'Tea Museum', 'Mattupetty Dam', 'Echo Point', 'Dinner'] },
      { day: 3, title: 'Munnar to Thekkady', description: 'Spice country and wildlife.', activities: ['Breakfast', 'Periyar boat safari', 'Spice garden', 'Dinner'] },
      { day: 4, title: 'Thekkady to Alleppey', description: 'Board your private houseboat.', activities: ['Breakfast', 'Houseboat check-in', 'Backwater cruise', 'Lunch & Dinner on board'] },
      { day: 5, title: 'Alleppey to Kochi', description: 'Disembark and transfer for departure.', activities: ['Breakfast', 'Drop-off at Kochi'] },
    ],
    destinations: ['Munnar', 'Thekkady', 'Alleppey', 'Kochi'],
    rating: '4.9',
    reviewCount: 187,
    isActive: true,
    isFeatured: true,
  },
  {
    title: 'Jaisalmer Desert Safari',
    slug: 'jaisalmer-desert-safari',
    description:
      'A 4-day immersion into the Golden City and the Thar Desert — living forts, ornate havelis and a night under the stars at a desert camp.',
    longDescription:
      'Experience the magic of Jaisalmer, where golden sandstone glows at sunset. Wander the living fort, marvel at intricately carved havelis, and ride camels into the dunes for a folk evening and overnight desert camp.',
    duration: 4,
    price: '16900',
    maxGroupSize: 15,
    difficulty: 'moderate',
    category: 'desert',
    images: [
      img('photo-1477587458883-47145ed94245'),
      img('photo-1609920658906-8223bd289001'),
      img('photo-1561361513-2d000a50f0dc'),
      img('photo-1518002171953-a080ee817e1f'),
    ],
    highlights: [
      '🏜️ Camel safari & jeep ride in Sam Dunes',
      '🏰 Explore the living Jaisalmer Fort',
      '🏛️ Visit Patwon Ki Haveli',
      '🔥 Folk music & dance at desert camp',
      '⭐ Overnight stay under the stars',
    ],
    included: [
      'Hotel + desert camp (3 nights)',
      'Daily breakfast & dinner',
      'AC transport',
      'Camel & jeep safari',
      'Cultural evening at camp',
    ],
    excluded: [
      'Transport to Jaisalmer',
      'Lunch & personal expenses',
      'Monument camera fees',
      'Tips',
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Jaisalmer', description: 'Check in and evening at leisure.', activities: ['Pickup', 'Hotel check-in', 'Gadisar Lake', 'Dinner'] },
      { day: 2, title: 'City Sightseeing', description: 'Forts and havelis of the Golden City.', activities: ['Breakfast', 'Jaisalmer Fort', 'Patwon Ki Haveli', 'Dinner'] },
      { day: 3, title: 'Sam Sand Dunes', description: 'Desert safari and overnight camp.', activities: ['Breakfast', 'Kuldhara Village', 'Camel Safari', 'Folk evening', 'Dinner at camp'] },
      { day: 4, title: 'Departure', description: 'Transfer for onward journey.', activities: ['Breakfast', 'Drop-off'] },
    ],
    destinations: ['Jaisalmer', 'Sam Dunes'],
    rating: '4.5',
    reviewCount: 129,
    isActive: true,
    isFeatured: false,
  },
  {
    title: 'Goa Beach Getaway',
    slug: 'goa-beach-getaway',
    description:
      'A breezy 5-day beach holiday across North and South Goa — golden sands, water sports, Portuguese heritage and buzzing nightlife.',
    longDescription:
      'Soak up the sun on Goa’s famous beaches, cruise the Mandovi river, explore old churches and spice plantations, and enjoy vibrant shacks and markets. The perfect blend of relaxation and fun.',
    duration: 5,
    price: '19900',
    maxGroupSize: 20,
    difficulty: 'easy',
    category: 'beach',
    images: [
      img('photo-1512343879784-a960bf40e7f2'),
      img('photo-1587922546307-776227941871'),
      img('photo-1518972559570-7cc1309f3229'),
      img('photo-1559494007-9f5847c49d94'),
    ],
    highlights: [
      '🏖️ Relax on Baga & Palolem beaches',
      '🚤 Water sports at Calangute',
      '⛪ Visit Basilica of Bom Jesus',
      '🛥️ Sunset Mandovi river cruise',
      '🎶 Explore Goa’s lively night markets',
    ],
    included: [
      'Hotel accommodation (4 nights)',
      'Daily breakfast',
      'AC transport for sightseeing',
      'North & South Goa tours',
      'River cruise tickets',
    ],
    excluded: [
      'Flights / train to Goa',
      'Lunch & dinner',
      'Water sports charges',
      'Entry fees & personal expenses',
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Goa', description: 'Check in and relax by the beach.', activities: ['Airport pickup', 'Hotel check-in', 'Baga Beach', 'Dinner'] },
      { day: 2, title: 'North Goa Tour', description: 'Beaches and forts of the north.', activities: ['Breakfast', 'Calangute', 'Aguada Fort', 'Anjuna', 'Dinner'] },
      { day: 3, title: 'South Goa Tour', description: 'Heritage and serene beaches.', activities: ['Breakfast', 'Basilica of Bom Jesus', 'Colva Beach', 'Dinner'] },
      { day: 4, title: 'Leisure & Cruise', description: 'Free morning and evening cruise.', activities: ['Breakfast', 'Beach leisure', 'Mandovi sunset cruise', 'Dinner'] },
      { day: 5, title: 'Departure', description: 'Transfer for departure.', activities: ['Breakfast', 'Drop-off'] },
    ],
    destinations: ['North Goa', 'South Goa', 'Panaji'],
    rating: '4.4',
    reviewCount: 96,
    isActive: true,
    isFeatured: false,
  },
]

async function seed() {
  console.log(`🌱 Seeding ${MOCK_TOURS.length} tours...`)
  let count = 0
  for (const tour of MOCK_TOURS) {
    // Upsert by slug: re-create or reactivate + refresh existing (handles soft-deleted tours)
    const res = await db
      .insert(tours)
      .values(tour)
      .onConflictDoUpdate({
        target: tours.slug,
        set: { ...tour, isActive: true, updatedAt: new Date() },
      })
      .returning({ id: tours.id })
    count++
    console.log(`  ✓ ${tour.title} (id ${res[0]?.id})`)
  }
  console.log(`✅ Done. ${count} tour(s) seeded / reactivated.`)
  process.exit(0)
}

seed().catch(err => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})

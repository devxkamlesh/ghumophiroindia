import type { SeoBlock } from '@/components/public/SeoContentSection'

/**
 * Long-form landing-page copy. Kept in one file so content is easy to edit
 * without touching page logic. Written to read naturally while covering the
 * high-volume search terms travellers actually use.
 */

export const toursContent: { title: string; intro: string; blocks: SeoBlock[]; footnote: string } = {
  title: 'Rajasthan & India Tour Packages — Planned Around You',
  intro:
    'Explore our handpicked Rajasthan and India tour packages, each led by a government-approved local guide with 5 years of experience. From the iconic Golden Triangle to royal heritage circuits and Thar Desert safaris, every itinerary is built for comfort, authentic culture and unforgettable moments — and can be tailored to your dates, pace and budget.',
  blocks: [
    {
      heading: 'Popular Rajasthan tour packages',
      paragraphs: [
        'Rajasthan is India’s most colourful state — a land of hilltop forts, lake palaces, desert dunes and living bazaars. Our most-booked itineraries balance the must-see highlights with the quieter, local experiences that make a trip memorable.',
      ],
      bullets: [
        { text: 'Golden Triangle tours (Delhi, Agra, Jaipur)', href: '/tours?search=golden+triangle' },
        { text: 'Royal Rajasthan heritage tours', href: '/tours?category=heritage' },
        { text: 'Jaisalmer & Thar Desert safari tours', href: '/tours?category=desert' },
        { text: 'Jaipur city tours and day trips', href: '/tours?category=city' },
        { text: 'Build your own custom itinerary', href: '/custom-tour' },
      ],
    },
    {
      heading: 'The Golden Triangle: Delhi, Agra & Jaipur',
      paragraphs: [
        'The Golden Triangle is India’s most popular route and the perfect introduction for first-time visitors. In 5 to 7 days you’ll see the Taj Mahal at sunrise, explore Agra Fort, and discover the forts, palaces and pink-hued streets of Jaipur. It pairs beautifully with an extension to Udaipur, Jodhpur or Ranthambore National Park.',
      ],
    },
    {
      heading: 'How many days do you need for a Rajasthan trip?',
      paragraphs: [
        'A first Rajasthan trip works well in 7 to 10 days, covering Jaipur, Pushkar, Udaipur and Jodhpur. With 12 to 14 days you can add the golden city of Jaisalmer, Bikaner and a Ranthambore tiger safari. Short on time? A 5 to 6 day Golden Triangle plus one extra city is a great option.',
      ],
    },
    {
      heading: 'Best time to visit Rajasthan',
      paragraphs: [
        'The best time to visit Rajasthan is October to March, when the weather is pleasant (around 20–28°C) and ideal for sightseeing and desert safaris. April to June brings intense heat above 40°C, while the July to September monsoon turns the landscape green and keeps the crowds away.',
      ],
    },
    {
      heading: 'What’s included in our tour packages',
      paragraphs: [
        'Most multi-day packages include comfortable accommodation, air-conditioned private transport, a professional guide, monument entry fees and daily breakfast (dinner on many trips too). Every tour page lists exactly what is included and excluded, so there are no surprises.',
      ],
    },
    {
      heading: 'Why book with a government-approved local guide',
      paragraphs: [
        'Booking directly with a licensed local guide means authentic historical context, honest pricing, flexible plans and real 24/7 support on the ground — not a rushed group bus tour. With 5 years of guiding across Rajasthan, we know the best times to visit each fort, where to eat, and how to skip the crowds.',
      ],
    },
  ],
  footnote:
    'Prices and availability vary by season, group size and hotel category. Contact us for a personalized quote — we usually reply within 24 hours.',
}

export const destinationsContent: { title: string; intro: string; blocks: SeoBlock[]; footnote: string } = {
  title: 'Top Travel Destinations in Rajasthan & India',
  intro:
    'From the pink streets of Jaipur to the golden dunes of Jaisalmer, Rajasthan packs more palaces, forts and colour into one state than almost anywhere on earth. Here’s a quick guide to the destinations we cover — each with guided tours led by a local expert.',
  blocks: [
    {
      heading: 'Jaipur — the Pink City',
      paragraphs: [
        'Rajasthan’s capital and the gateway to the state. Highlights include the Amber Fort, City Palace, Hawa Mahal and Jantar Mantar, plus vibrant bazaars for textiles, jewellery and handicrafts. Jaipur is also the base for most Golden Triangle and Rajasthan tours.',
      ],
      bullets: [{ text: 'Explore Jaipur tours & sightseeing', href: '/destinations/jaipur' }],
    },
    {
      heading: 'Udaipur — the City of Lakes',
      paragraphs: [
        'One of India’s most romantic cities, Udaipur is famous for Lake Pichola, the City Palace and its whitewashed lakeside architecture. Perfect for couples, honeymooners and photographers.',
      ],
      bullets: [{ text: 'Discover Udaipur', href: '/destinations/udaipur' }],
    },
    {
      heading: 'Jodhpur — the Blue City',
      paragraphs: [
        'Dominated by the mighty Mehrangarh Fort, Jodhpur’s old town is a maze of indigo-blue houses, spice markets and rooftop cafés with fort views. A highlight of any Rajasthan heritage tour.',
      ],
      bullets: [{ text: 'Discover Jodhpur', href: '/destinations/jodhpur' }],
    },
    {
      heading: 'Jaisalmer — the Golden City & Thar Desert',
      paragraphs: [
        'A living sandstone fort, ornate havelis and the vast Thar Desert. Jaisalmer is the place for camel safaris, dune sunsets and overnight desert camps under the stars.',
      ],
      bullets: [{ text: 'Discover Jaisalmer', href: '/destinations/jaisalmer' }],
    },
    {
      heading: 'Pushkar, Bikaner & beyond',
      paragraphs: [
        'Pushkar is a holy lakeside town famous for its Brahma Temple and camel fair. Bikaner offers Junagarh Fort and the unique Karni Mata temple. Add Ranthambore for tiger safaris or Mount Abu for a hill-station break.',
      ],
      bullets: [
        { text: 'Discover Pushkar', href: '/destinations/pushkar' },
        { text: 'Discover Bikaner', href: '/destinations/bikaner' },
      ],
    },
    {
      heading: 'When to visit',
      paragraphs: [
        'October to March is the ideal window across all Rajasthan destinations, with comfortable days and cool evenings — perfect for forts, city walks and desert nights.',
      ],
    },
  ],
  footnote: 'Every destination can be combined into a single custom itinerary. Tell us where you want to go and we’ll plan the route.',
}

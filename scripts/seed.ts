import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local FIRST before any other imports
config({ path: resolve(process.cwd(), '.env.local') })

// Now import db after env is loaded
import { db } from '../lib/db'
import { tours, destinations, users } from '../lib/db/schema'
import { hash } from 'bcryptjs'

async function seed() {
  console.log('🌱 Seeding database...')
  console.log('📡 Connecting to:', process.env.DATABASE_URL?.substring(0, 70) + '...')

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables')
    process.exit(1)
  }

  try {
    // Create admin user
    console.log('Creating admin user...')
    const hashedPassword = await hash('admin123', 10)
    const [admin] = await db.insert(users).values({
      name: 'Admin User',
      email: 'admin@ghumophiroindia.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      emailVerified: true,
    }).returning()
    console.log('✅ Admin user created:', admin.email)

    // Create sample user
    console.log('Creating sample user...')
    const userPassword = await hash('user123', 10)
    const [user] = await db.insert(users).values({
      name: 'John Doe',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
      phone: '+919876543210',
      country: 'India',
      isActive: true,
    }).returning()
    console.log('✅ Sample user created:', user.email)

    // Create destinations
    console.log('Creating destinations...')
    const destinationData = [
      {
        name: 'Delhi',
        slug: 'delhi',
        subtitle: 'The Capital City',
        description: 'Experience the vibrant capital of India with its rich history and modern charm.',
        image: '/images/destinations/delhi.jpg',
        tourCount: 0,
        isPopular: true,
      },
      {
        name: 'Agra',
        slug: 'agra',
        subtitle: 'City of Taj Mahal',
        description: 'Home to the magnificent Taj Mahal, one of the Seven Wonders of the World.',
        image: '/images/destinations/agra.jpg',
        tourCount: 0,
        isPopular: true,
      },
      {
        name: 'Jaipur',
        slug: 'jaipur',
        subtitle: 'The Pink City',
        description: 'Explore the royal heritage and stunning palaces of Rajasthan.',
        image: '/images/destinations/jaipur.jpg',
        tourCount: 0,
        isPopular: true,
      },
      {
        name: 'Goa',
        slug: 'goa',
        subtitle: 'Beach Paradise',
        description: 'Relax on pristine beaches and enjoy the vibrant nightlife.',
        image: '/images/destinations/goa.jpg',
        tourCount: 0,
        isPopular: true,
      },
      {
        name: 'Kerala',
        slug: 'kerala',
        subtitle: 'God\'s Own Country',
        description: 'Experience the backwaters, tea plantations, and natural beauty.',
        image: '/images/destinations/kerala.jpg',
        tourCount: 0,
        isPopular: true,
      },
    ]

    await db.insert(destinations).values(destinationData)
    console.log('✅ Destinations created:', destinationData.length)

    // Create sample tours
    console.log('Creating sample tours...')
    const tourData = [
      {
        title: 'Golden Triangle Tour',
        slug: 'golden-triangle-tour',
        description: 'Visit Delhi, Agra, and Jaipur - the three most iconic cities of North India',
        longDescription: 'Experience the best of North India with our Golden Triangle Tour. Visit the bustling capital Delhi, witness the magnificent Taj Mahal in Agra, and explore the royal palaces of Jaipur. This tour offers a perfect blend of history, culture, and architecture.',
        duration: 7,
        price: '1500.00',
        maxGroupSize: 15,
        difficulty: 'easy',
        category: 'heritage',
        images: ['https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071'],
        highlights: [
          'Visit the iconic Taj Mahal',
          'Explore Red Fort and Qutub Minar in Delhi',
          'Discover Amber Fort and City Palace in Jaipur',
          'Experience local markets and cuisine',
          'Professional English-speaking guide',
        ],
        included: [
          'Accommodation in 4-star hotels',
          'Daily breakfast and dinner',
          'Air-conditioned transportation',
          'All monument entrance fees',
          'Professional tour guide',
        ],
        excluded: [
          'International flights',
          'Lunch and drinks',
          'Personal expenses',
          'Travel insurance',
          'Tips and gratuities',
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Delhi',
            description: 'Welcome to India! Arrive in Delhi and transfer to your hotel.',
            activities: ['Airport pickup', 'Hotel check-in', 'Welcome dinner', 'Tour briefing'],
          },
          {
            day: 2,
            title: 'Delhi Sightseeing',
            description: 'Full day exploring Old and New Delhi.',
            activities: ['Red Fort', 'Jama Masjid', 'Raj Ghat', 'India Gate', 'Qutub Minar'],
          },
          {
            day: 3,
            title: 'Delhi to Agra',
            description: 'Drive to Agra and visit the Taj Mahal at sunset.',
            activities: ['Drive to Agra (4 hours)', 'Taj Mahal visit', 'Agra Fort', 'Mehtab Bagh'],
          },
          {
            day: 4,
            title: 'Agra to Jaipur',
            description: 'Visit Fatehpur Sikri en route to Jaipur.',
            activities: ['Fatehpur Sikri', 'Drive to Jaipur', 'Evening at leisure'],
          },
          {
            day: 5,
            title: 'Jaipur Sightseeing',
            description: 'Explore the Pink City of Jaipur.',
            activities: ['Amber Fort', 'City Palace', 'Jantar Mantar', 'Hawa Mahal', 'Local markets'],
          },
          {
            day: 6,
            title: 'Jaipur to Delhi',
            description: 'Return to Delhi with stops at local attractions.',
            activities: ['Drive to Delhi', 'Shopping time', 'Farewell dinner'],
          },
          {
            day: 7,
            title: 'Departure',
            description: 'Transfer to airport for your onward journey.',
            activities: ['Hotel checkout', 'Airport transfer', 'Departure'],
          },
        ],
        destinations: ['Delhi', 'Agra', 'Jaipur'],
        rating: '4.8',
        reviewCount: 120,
        isActive: true,
        isFeatured: true,
      },
      {
        title: 'Goa Beach Escape',
        slug: 'goa-beach-escape',
        description: 'Relax on pristine beaches and enjoy water sports in Goa',
        longDescription: 'Escape to the tropical paradise of Goa. Enjoy sun-kissed beaches, water sports, vibrant nightlife, and Portuguese heritage. Perfect for beach lovers and adventure seekers.',
        duration: 5,
        price: '800.00',
        maxGroupSize: 20,
        difficulty: 'easy',
        category: 'beach',
        images: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2074'],
        highlights: [
          'Pristine beaches of North and South Goa',
          'Water sports activities',
          'Beach parties and nightlife',
          'Portuguese heritage sites',
          'Seafood dining experiences',
        ],
        included: [
          'Beach resort accommodation',
          'Daily breakfast',
          'Airport transfers',
          'Water sports package',
          'Beach party access',
        ],
        excluded: [
          'Flights',
          'Lunch and dinner',
          'Alcohol and beverages',
          'Personal expenses',
          'Additional activities',
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Goa',
            description: 'Arrive and check into your beach resort.',
            activities: ['Airport pickup', 'Resort check-in', 'Beach walk', 'Welcome drink'],
          },
          {
            day: 2,
            title: 'North Goa Beaches',
            description: 'Explore the famous beaches of North Goa.',
            activities: ['Calangute Beach', 'Baga Beach', 'Anjuna Beach', 'Beach shacks', 'Sunset viewing'],
          },
          {
            day: 3,
            title: 'Water Sports Day',
            description: 'Enjoy thrilling water sports activities.',
            activities: ['Parasailing', 'Jet skiing', 'Banana boat ride', 'Snorkeling', 'Beach relaxation'],
          },
          {
            day: 4,
            title: 'South Goa & Heritage',
            description: 'Discover South Goa beaches and Portuguese heritage.',
            activities: ['Palolem Beach', 'Old Goa churches', 'Spice plantation', 'Local markets'],
          },
          {
            day: 5,
            title: 'Departure',
            description: 'Last beach morning and departure.',
            activities: ['Beach time', 'Resort checkout', 'Airport transfer'],
          },
        ],
        destinations: ['Goa'],
        rating: '4.6',
        reviewCount: 85,
        isActive: true,
        isFeatured: true,
      },
      {
        title: 'Kerala Backwaters Experience',
        slug: 'kerala-backwaters',
        description: 'Cruise through serene backwaters and explore tea plantations',
        longDescription: 'Discover God\'s Own Country with our Kerala tour. Cruise through tranquil backwaters on a traditional houseboat, visit lush tea plantations, and experience the natural beauty of Kerala.',
        duration: 6,
        price: '1200.00',
        maxGroupSize: 12,
        difficulty: 'easy',
        category: 'nature',
        images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2048'],
        highlights: [
          'Houseboat cruise in Alleppey backwaters',
          'Tea plantation visit in Munnar',
          'Kathakali dance performance',
          'Ayurvedic spa treatment',
          'Wildlife sanctuary visit',
        ],
        included: [
          'Accommodation in resorts and houseboat',
          'All meals during houseboat stay',
          'Daily breakfast at hotels',
          'All transfers and sightseeing',
          'Ayurvedic massage session',
        ],
        excluded: [
          'Flights',
          'Lunch and dinner (except houseboat)',
          'Personal expenses',
          'Camera fees at monuments',
          'Tips',
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Kochi',
            description: 'Arrive in Kochi and explore the historic port city.',
            activities: ['Airport pickup', 'Fort Kochi walk', 'Chinese fishing nets', 'Kathakali show'],
          },
          {
            day: 2,
            title: 'Kochi to Munnar',
            description: 'Drive to the hill station of Munnar.',
            activities: ['Scenic drive', 'Waterfalls', 'Tea plantations', 'Munnar town'],
          },
          {
            day: 3,
            title: 'Munnar Exploration',
            description: 'Explore tea gardens and viewpoints.',
            activities: ['Tea factory visit', 'Echo Point', 'Mattupetty Dam', 'Eravikulam National Park'],
          },
          {
            day: 4,
            title: 'Munnar to Alleppey',
            description: 'Drive to Alleppey and board houseboat.',
            activities: ['Drive to Alleppey', 'Houseboat check-in', 'Backwater cruise', 'Village visits'],
          },
          {
            day: 5,
            title: 'Houseboat Experience',
            description: 'Full day cruising through backwaters.',
            activities: ['Backwater cruise', 'Local life observation', 'Traditional Kerala meals', 'Sunset viewing'],
          },
          {
            day: 6,
            title: 'Departure',
            description: 'Disembark and transfer to airport.',
            activities: ['Houseboat checkout', 'Drive to Kochi', 'Airport transfer'],
          },
        ],
        destinations: ['Kerala'],
        rating: '4.9',
        reviewCount: 95,
        isActive: true,
        isFeatured: true,
      },
      {
        title: 'Rajasthan Desert Safari',
        slug: 'rajasthan-desert-safari',
        description: 'Experience the royal heritage and desert landscapes of Rajasthan',
        longDescription: 'Journey through the land of kings with our Rajasthan Desert Safari. Experience camel rides in the Thar Desert, stay in luxury desert camps, and explore magnificent forts and palaces.',
        duration: 8,
        price: '1800.00',
        maxGroupSize: 10,
        difficulty: 'moderate',
        category: 'desert',
        images: ['https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070'],
        highlights: [
          'Camel safari in Thar Desert',
          'Luxury desert camp stay',
          'Mehrangarh Fort and Umaid Bhawan Palace',
          'Traditional Rajasthani cultural evening',
          'Visit to blue city Jodhpur',
        ],
        included: [
          'Heritage hotel accommodation',
          'Desert camp with cultural program',
          'All meals',
          'Camel safari',
          'All transfers and sightseeing',
        ],
        excluded: [
          'Flights',
          'Alcoholic beverages',
          'Personal expenses',
          'Camera fees',
          'Tips',
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Jaipur',
            description: 'Arrive in the Pink City.',
            activities: ['Airport pickup', 'Hotel check-in', 'City Palace visit', 'Local market'],
          },
          {
            day: 2,
            title: 'Jaipur Sightseeing',
            description: 'Explore Jaipur\'s magnificent forts.',
            activities: ['Amber Fort', 'Jal Mahal', 'Hawa Mahal', 'Jantar Mantar'],
          },
          {
            day: 3,
            title: 'Jaipur to Pushkar',
            description: 'Drive to the holy city of Pushkar.',
            activities: ['Drive to Pushkar', 'Brahma Temple', 'Pushkar Lake', 'Camel fair (seasonal)'],
          },
          {
            day: 4,
            title: 'Pushkar to Jodhpur',
            description: 'Journey to the Blue City.',
            activities: ['Drive to Jodhpur', 'Mehrangarh Fort', 'Jaswant Thada', 'Clock Tower market'],
          },
          {
            day: 5,
            title: 'Jodhpur to Jaisalmer',
            description: 'Travel to the Golden City.',
            activities: ['Drive to Jaisalmer', 'Jaisalmer Fort', 'Havelis tour', 'Sunset at Gadisar Lake'],
          },
          {
            day: 6,
            title: 'Desert Safari',
            description: 'Experience the Thar Desert.',
            activities: ['Sam Sand Dunes', 'Camel safari', 'Desert camp', 'Cultural evening', 'Stargazing'],
          },
          {
            day: 7,
            title: 'Jaisalmer Exploration',
            description: 'Explore the Golden Fort.',
            activities: ['Fort palace', 'Jain temples', 'Patwon Ki Haveli', 'Local crafts shopping'],
          },
          {
            day: 8,
            title: 'Departure',
            description: 'Transfer to airport.',
            activities: ['Hotel checkout', 'Airport transfer', 'Departure'],
          },
        ],
        destinations: ['Jaipur', 'Pushkar', 'Jodhpur', 'Jaisalmer'],
        rating: '4.7',
        reviewCount: 68,
        isActive: true,
        isFeatured: false,
      },
      {
        title: 'Himalayan Adventure Trek',
        slug: 'himalayan-adventure-trek',
        description: 'Trek through the majestic Himalayas and experience mountain life',
        longDescription: 'Embark on an unforgettable journey through the Himalayas. Trek through scenic mountain trails, visit ancient monasteries, and experience the serene beauty of the mountains.',
        duration: 10,
        price: '2200.00',
        maxGroupSize: 8,
        difficulty: 'challenging',
        category: 'adventure',
        images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070'],
        highlights: [
          'Trek to high altitude passes',
          'Visit Buddhist monasteries',
          'Panoramic Himalayan views',
          'Experience local mountain culture',
          'Professional trekking guide and porters',
        ],
        included: [
          'Trekking permits',
          'Camping equipment',
          'All meals during trek',
          'Professional guide and porters',
          'Hotel accommodation in towns',
        ],
        excluded: [
          'Flights',
          'Personal trekking gear',
          'Travel insurance',
          'Emergency evacuation',
          'Tips for guides and porters',
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Manali',
            description: 'Arrive and acclimatize.',
            activities: ['Airport/bus pickup', 'Hotel check-in', 'Local market visit', 'Trek briefing'],
          },
          {
            day: 2,
            title: 'Acclimatization Day',
            description: 'Short hike for acclimatization.',
            activities: ['Hadimba Temple', 'Old Manali walk', 'Gear check', 'Rest'],
          },
          {
            day: 3,
            title: 'Trek to Base Camp',
            description: 'Begin the trek.',
            activities: ['Drive to trailhead', 'Trek to base camp', 'Camp setup', 'Evening briefing'],
          },
          {
            day: 4,
            title: 'Base Camp to High Camp',
            description: 'Ascend to high camp.',
            activities: ['Morning trek', 'Lunch break', 'Reach high camp', 'Acclimatization walk'],
          },
          {
            day: 5,
            title: 'Summit Day',
            description: 'Early morning summit attempt.',
            activities: ['Pre-dawn start', 'Summit push', 'Panoramic views', 'Descend to camp'],
          },
          {
            day: 6,
            title: 'Descent Day',
            description: 'Trek back down.',
            activities: ['Pack camp', 'Descend to base', 'Celebrate completion', 'Camp'],
          },
          {
            day: 7,
            title: 'Return to Manali',
            description: 'Complete the trek.',
            activities: ['Final descent', 'Drive to Manali', 'Hotel check-in', 'Hot shower!'],
          },
          {
            day: 8,
            title: 'Rest Day',
            description: 'Relax and explore Manali.',
            activities: ['Sleep in', 'Hot springs visit', 'Shopping', 'Celebration dinner'],
          },
          {
            day: 9,
            title: 'Monastery Visit',
            description: 'Cultural exploration.',
            activities: ['Visit local monasteries', 'Interact with monks', 'Learn about Buddhism', 'Free time'],
          },
          {
            day: 10,
            title: 'Departure',
            description: 'End of adventure.',
            activities: ['Hotel checkout', 'Transfer to airport/bus station', 'Departure'],
          },
        ],
        destinations: ['Himachal Pradesh', 'Manali'],
        rating: '4.9',
        reviewCount: 42,
        isActive: true,
        isFeatured: false,
      },
    ]

    await db.insert(tours).values(tourData)
    console.log('✅ Sample tours created:', tourData.length)

    console.log('\n🎉 Database seeded successfully!')
    console.log('\n📝 Login credentials:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Admin: admin@ghumophiroindia.com / admin123')
    console.log('User:  user@example.com / user123')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n✨ You can now:')
    console.log('1. Run: npm run dev')
    console.log('2. Visit: http://localhost:3000')
    console.log('3. Login at: http://localhost:3000/login')
    console.log('4. Access dashboard: http://localhost:3000/dashboard')
    
  } catch (error) {
    console.error('❌ Seed failed:', error)
    throw error
  }
}

seed()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })

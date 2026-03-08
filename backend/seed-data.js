// Seed script to add sample data to the database
// Run with: node seed-data.js

const API_URL = 'http://187.127.151.137/api/v1';

// Sample admin user
const adminUser = {
  name: 'Admin User',
  email: 'admin@ghumophiro.com',
  password: 'Admin@123456',
  phone: '+91 9876543210',
  role: 'admin'
};

// Sample tours
const sampleTours = [
  {
    title: 'Golden Triangle Tour',
    slug: 'golden-triangle-tour',
    description: 'Experience the best of North India with visits to Delhi, Agra, and Jaipur',
    longDescription: 'The Golden Triangle Tour is one of the most popular tourist circuits in India, covering three iconic cities: Delhi, Agra, and Jaipur. This tour offers a perfect blend of history, culture, and architecture.',
    duration: 6,
    price: 25000,
    maxGroupSize: 15,
    difficulty: 'easy',
    category: 'heritage',
    images: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523',
      'https://images.unsplash.com/photo-1587474260584-136574528ed5'
    ],
    highlights: [
      'Visit the iconic Taj Mahal',
      'Explore the majestic Amber Fort',
      'Discover the historical Red Fort',
      'Experience the vibrant markets of Jaipur',
      'Enjoy traditional Rajasthani cuisine'
    ],
    included: [
      'Accommodation in 4-star hotels',
      'Daily breakfast and dinner',
      'Air-conditioned transportation',
      'Professional English-speaking guide',
      'All monument entrance fees'
    ],
    excluded: [
      'International flights',
      'Travel insurance',
      'Personal expenses',
      'Lunch',
      'Tips and gratuities'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Delhi',
        description: 'Arrive in Delhi and check into your hotel. Evening at leisure.',
        activities: ['Airport pickup', 'Hotel check-in', 'Welcome dinner']
      },
      {
        day: 2,
        title: 'Delhi Sightseeing',
        description: 'Full day tour of Old and New Delhi including Red Fort, Jama Masjid, and India Gate.',
        activities: ['Red Fort visit', 'Jama Masjid', 'Rickshaw ride in Chandni Chowk', 'India Gate']
      },
      {
        day: 3,
        title: 'Delhi to Agra',
        description: 'Drive to Agra and visit the magnificent Taj Mahal and Agra Fort.',
        activities: ['Drive to Agra', 'Taj Mahal visit', 'Agra Fort', 'Sunset at Mehtab Bagh']
      },
      {
        day: 4,
        title: 'Agra to Jaipur',
        description: 'Drive to Jaipur via Fatehpur Sikri. Evening at leisure in Jaipur.',
        activities: ['Fatehpur Sikri visit', 'Drive to Jaipur', 'Evening free time']
      },
      {
        day: 5,
        title: 'Jaipur Sightseeing',
        description: 'Full day tour of Jaipur including Amber Fort, City Palace, and Hawa Mahal.',
        activities: ['Amber Fort', 'City Palace', 'Hawa Mahal', 'Jantar Mantar', 'Local market visit']
      },
      {
        day: 6,
        title: 'Departure',
        description: 'Transfer to Delhi airport for your onward journey.',
        activities: ['Hotel checkout', 'Drive to Delhi', 'Airport drop']
      }
    ],
    destinations: ['Delhi', 'Agra', 'Jaipur'],
    rating: 4.8,
    reviewCount: 156,
    isFeatured: true
  },
  {
    title: 'Kerala Backwaters Experience',
    slug: 'kerala-backwaters-experience',
    description: 'Cruise through the serene backwaters of Kerala on a traditional houseboat',
    longDescription: 'Experience the tranquil beauty of Kerala\'s backwaters with a stay on a traditional houseboat. Enjoy the lush green landscapes, local village life, and authentic Kerala cuisine.',
    duration: 4,
    price: 18000,
    maxGroupSize: 8,
    difficulty: 'easy',
    category: 'city',
    images: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2'
    ],
    highlights: [
      'Houseboat cruise in Alleppey',
      'Traditional Kerala cuisine',
      'Village visits',
      'Kathakali dance performance',
      'Ayurvedic massage'
    ],
    included: [
      'Houseboat accommodation',
      'All meals on houseboat',
      'Hotel accommodation in Kochi',
      'Airport transfers',
      'Kathakali show tickets'
    ],
    excluded: [
      'Flights',
      'Travel insurance',
      'Personal expenses',
      'Alcoholic beverages'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Kochi',
        description: 'Arrive in Kochi and explore Fort Kochi area.',
        activities: ['Airport pickup', 'Fort Kochi walk', 'Chinese fishing nets', 'Kathakali show']
      },
      {
        day: 2,
        title: 'Kochi to Alleppey',
        description: 'Drive to Alleppey and board your houseboat for an overnight cruise.',
        activities: ['Drive to Alleppey', 'Board houseboat', 'Backwater cruise', 'Village visits']
      },
      {
        day: 3,
        title: 'Backwater Cruise',
        description: 'Continue cruising through the backwaters and disembark in the evening.',
        activities: ['Morning cruise', 'Lunch on boat', 'Disembark', 'Return to Kochi']
      },
      {
        day: 4,
        title: 'Departure',
        description: 'Transfer to airport for departure.',
        activities: ['Hotel checkout', 'Airport transfer']
      }
    ],
    destinations: ['Kochi', 'Alleppey'],
    rating: 4.9,
    reviewCount: 89,
    isFeatured: true
  },
  {
    title: 'Rajasthan Desert Safari',
    slug: 'rajasthan-desert-safari',
    description: 'Experience the magic of the Thar Desert with camel safaris and desert camping',
    longDescription: 'Embark on an unforgettable journey through the golden sands of Rajasthan. Experience camel safaris, desert camping under the stars, and the rich cultural heritage of desert villages.',
    duration: 5,
    price: 22000,
    maxGroupSize: 12,
    difficulty: 'moderate',
    category: 'desert',
    images: [
      'https://images.unsplash.com/photo-1477587458883-47145ed94245',
      'https://images.unsplash.com/photo-1609137144813-7d9921338f24'
    ],
    highlights: [
      'Camel safari in Thar Desert',
      'Desert camping experience',
      'Traditional Rajasthani folk performances',
      'Visit to desert villages',
      'Sunset and sunrise in the desert'
    ],
    included: [
      'Hotel and camp accommodation',
      'All meals',
      'Camel safari',
      'Cultural performances',
      'Transportation'
    ],
    excluded: [
      'Flights',
      'Travel insurance',
      'Personal expenses',
      'Alcoholic drinks'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Jaisalmer',
        description: 'Arrive in Jaisalmer and explore the Golden Fort.',
        activities: ['Airport/station pickup', 'Jaisalmer Fort visit', 'Patwon Ki Haveli', 'Evening at leisure']
      },
      {
        day: 2,
        title: 'Desert Safari',
        description: 'Drive to Sam Sand Dunes for camel safari and desert camping.',
        activities: ['Drive to Sam', 'Camel safari', 'Sunset viewing', 'Cultural program', 'Dinner under stars']
      },
      {
        day: 3,
        title: 'Desert Exploration',
        description: 'Explore desert villages and experience local life.',
        activities: ['Village visits', 'Desert activities', 'Traditional lunch', 'Return to Jaisalmer']
      },
      {
        day: 4,
        title: 'Jaisalmer Sightseeing',
        description: 'Visit Gadisar Lake and local markets.',
        activities: ['Gadisar Lake', 'Market shopping', 'Sunset point', 'Farewell dinner']
      },
      {
        day: 5,
        title: 'Departure',
        description: 'Transfer to airport/station.',
        activities: ['Hotel checkout', 'Transfer']
      }
    ],
    destinations: ['Jaisalmer', 'Sam Sand Dunes'],
    rating: 4.7,
    reviewCount: 124,
    isFeatured: true
  }
];

async function registerAdmin() {
  try {
    console.log('🔐 Registering admin user...');
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminUser)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Admin user registered successfully');
      console.log('📧 Email:', adminUser.email);
      console.log('🔑 Password:', adminUser.password);
      return data.data.token;
    } else {
      if (data.message && data.message.includes('already exists')) {
        console.log('ℹ️  Admin user already exists, logging in...');
        return await loginAdmin();
      }
      throw new Error(data.message || 'Failed to register admin');
    }
  } catch (error) {
    console.error('❌ Error registering admin:', error.message);
    throw error;
  }
}

async function loginAdmin() {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: adminUser.email,
        password: adminUser.password
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Admin logged in successfully');
      return data.data.token;
    } else {
      throw new Error(data.message || 'Failed to login');
    }
  } catch (error) {
    console.error('❌ Error logging in:', error.message);
    throw error;
  }
}

async function createTour(tour, token) {
  try {
    const response = await fetch(`${API_URL}/tours`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(tour)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Created tour: ${tour.title}`);
      return data.data.tour;
    } else {
      throw new Error(data.message || 'Failed to create tour');
    }
  } catch (error) {
    console.error(`❌ Error creating tour "${tour.title}":`, error.message);
    throw error;
  }
}

async function seedData() {
  console.log('🌱 Starting data seeding...\n');

  try {
    // Register/login admin
    const token = await registerAdmin();
    console.log('');

    // Create tours
    console.log('🎯 Creating tours...');
    for (const tour of sampleTours) {
      await createTour(tour, token);
    }

    console.log('\n✨ Data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Admin user: ${adminUser.email}`);
    console.log(`   - Tours created: ${sampleTours.length}`);
    console.log('\n🌐 Test the API:');
    console.log(`   - Tours: ${API_URL}/tours`);
    console.log(`   - Featured: ${API_URL}/tours/featured`);
    console.log('\n🔐 Admin credentials:');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Password: ${adminUser.password}`);

  } catch (error) {
    console.error('\n💥 Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run the seeding
seedData();

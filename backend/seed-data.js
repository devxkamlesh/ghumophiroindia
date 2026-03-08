// Seed script to add sample data to the database
// Run with: node seed-data.js

const API_URL = 'http://187.127.151.137/api/v1';

// Sample admin user
const adminUser = {
  name: 'Admin User',
  email: 'admin@ghumofiroindia.com',
  password: 'Admin@123456',
  phone: '+919876543210',
  role: 'admin'
};

// Sample tours - Rajasthan focused
const sampleTours = [
  {
    title: 'Jaipur Heritage Tour - The Pink City',
    slug: 'jaipur-heritage-tour',
    description: 'Explore India\'s first planned city with royal palaces, forts, and vibrant bazaars',
    longDescription: 'Discover the royal heritage of Jaipur, the Pink City. Visit magnificent forts, palaces, and experience the vibrant culture of Rajasthan\'s capital city.',
    duration: 3,
    price: 8500,
    maxGroupSize: 15,
    difficulty: 'easy',
    category: 'heritage',
    images: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245'
    ],
    highlights: [
      'Amber Fort with elephant ride',
      'City Palace and Jantar Mantar (UNESCO)',
      'Hawa Mahal - Palace of Winds',
      'Nahargarh Fort sunset view',
      'Traditional Rajasthani dinner'
    ],
    included: [
      'Hotel accommodation',
      'Daily breakfast',
      'All monument entrance fees',
      'AC transportation',
      'English speaking guide'
    ],
    excluded: [
      'Lunch and dinner (except mentioned)',
      'Personal expenses',
      'Camera fees at monuments',
      'Tips'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & City Palace',
        description: 'Arrive in Jaipur and explore City Palace and Jantar Mantar',
        activities: ['Hotel check-in', 'City Palace visit', 'Jantar Mantar', 'Evening at leisure']
      },
      {
        day: 2,
        title: 'Amber Fort & Hawa Mahal',
        description: 'Visit the magnificent Amber Fort and iconic Hawa Mahal',
        activities: ['Amber Fort with elephant ride', 'Jal Mahal photo stop', 'Hawa Mahal', 'Local market shopping']
      },
      {
        day: 3,
        title: 'Nahargarh Fort & Departure',
        description: 'Morning at Nahargarh Fort and departure',
        activities: ['Nahargarh Fort', 'Jaigarh Fort', 'Departure transfer']
      }
    ],
    destinations: ['Jaipur'],
    rating: 4.8,
    reviewCount: 0,
    isFeatured: true
  },
  {
    title: 'Jaisalmer Desert Safari - The Golden City',
    slug: 'jaisalmer-desert-safari',
    description: 'Experience the magic of Thar Desert with camel safari and camping under stars',
    longDescription: 'Explore the living fort of Jaisalmer and experience authentic desert life with camel safari, sand dunes, and traditional Rajasthani culture.',
    duration: 3,
    price: 12500,
    maxGroupSize: 12,
    difficulty: 'moderate',
    category: 'desert',
    images: [
      'https://images.unsplash.com/photo-1609137144813-7d9921338f24',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245'
    ],
    highlights: [
      'Jaisalmer Fort - Living Fort (UNESCO)',
      'Camel safari at Sam Sand Dunes',
      'Desert camping with cultural program',
      'Patwon Ki Haveli',
      'Sunset and sunrise in desert'
    ],
    included: [
      'Hotel and desert camp accommodation',
      'All meals',
      'Camel safari',
      'Cultural performances',
      'Transportation'
    ],
    excluded: [
      'Travel to/from Jaisalmer',
      'Personal expenses',
      'Alcoholic beverages',
      'Tips'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Jaisalmer Fort & Havelis',
        description: 'Explore the golden fort and magnificent havelis',
        activities: ['Jaisalmer Fort visit', 'Patwon Ki Haveli', 'Salim Singh Ki Haveli', 'Evening at Gadisar Lake']
      },
      {
        day: 2,
        title: 'Desert Safari & Camping',
        description: 'Camel safari and overnight desert camping',
        activities: ['Drive to Sam Sand Dunes', 'Camel safari', 'Sunset viewing', 'Cultural program', 'Dinner under stars']
      },
      {
        day: 3,
        title: 'Sunrise & Departure',
        description: 'Desert sunrise and return to Jaisalmer',
        activities: ['Desert sunrise', 'Breakfast at camp', 'Return to Jaisalmer', 'Departure']
      }
    ],
    destinations: ['Jaisalmer', 'Sam Sand Dunes'],
    rating: 4.9,
    reviewCount: 0,
    isFeatured: true
  },
  {
    title: 'Udaipur Romantic Getaway - City of Lakes',
    slug: 'udaipur-romantic-getaway',
    description: 'Experience the romance of Udaipur with lake palaces and royal heritage',
    longDescription: 'Discover the Venice of the East with its beautiful lakes, palaces, and romantic ambiance. Perfect for couples and honeymooners.',
    duration: 3,
    price: 15000,
    maxGroupSize: 10,
    difficulty: 'easy',
    category: 'heritage',
    images: [
      'https://images.unsplash.com/photo-1587474260584-136574528ed5',
      'https://images.unsplash.com/photo-1564507592333-c60657eea523'
    ],
    highlights: [
      'Lake Pichola boat ride',
      'City Palace complex',
      'Jag Mandir island palace',
      'Fateh Sagar Lake',
      'Sunset at Sajjangarh Palace'
    ],
    included: [
      'Hotel accommodation',
      'Daily breakfast',
      'Boat rides',
      'All entrance fees',
      'Transportation'
    ],
    excluded: [
      'Lunch and dinner',
      'Personal expenses',
      'Camera fees',
      'Tips'
    ],
    itinerary: [
      {
        day: 1,
        title: 'City Palace & Lake Pichola',
        description: 'Explore the magnificent City Palace and enjoy boat ride',
        activities: ['City Palace visit', 'Lake Pichola boat ride', 'Jag Mandir visit', 'Evening at leisure']
      },
      {
        day: 2,
        title: 'Fateh Sagar & Sajjangarh',
        description: 'Visit Fateh Sagar Lake and Monsoon Palace',
        activities: ['Fateh Sagar Lake', 'Saheliyon Ki Bari', 'Sajjangarh Palace', 'Sunset viewing']
      },
      {
        day: 3,
        title: 'Local Markets & Departure',
        description: 'Shopping and departure',
        activities: ['Local market visit', 'Shopping', 'Departure transfer']
      }
    ],
    destinations: ['Udaipur'],
    rating: 4.9,
    reviewCount: 0,
    isFeatured: true
  },
  {
    title: 'Ranthambore Tiger Safari',
    slug: 'ranthambore-tiger-safari',
    description: 'Spot majestic Bengal tigers in their natural habitat',
    longDescription: 'Experience thrilling tiger safaris in one of India\'s most famous national parks. Ranthambore offers the best chance to spot tigers in the wild.',
    duration: 2,
    price: 9500,
    maxGroupSize: 6,
    difficulty: 'easy',
    category: 'city',
    images: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2'
    ],
    highlights: [
      'Tiger safari in open jeep',
      'Ranthambore Fort inside forest',
      'Bird watching',
      'Wildlife photography',
      'Multiple safari zones'
    ],
    included: [
      'Hotel accommodation',
      'All meals',
      '2 safari rides',
      'Safari permits',
      'Transportation'
    ],
    excluded: [
      'Travel to/from Ranthambore',
      'Personal expenses',
      'Camera fees',
      'Tips to driver/guide'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Evening Safari',
        description: 'Arrive and enjoy evening safari',
        activities: ['Hotel check-in', 'Lunch', 'Evening safari (Zone 1-5)', 'Dinner']
      },
      {
        day: 2,
        title: 'Morning Safari & Departure',
        description: 'Early morning safari and departure',
        activities: ['Early morning safari', 'Breakfast', 'Ranthambore Fort visit', 'Departure']
      }
    ],
    destinations: ['Ranthambore'],
    rating: 4.7,
    reviewCount: 0,
    isFeatured: false
  },
  {
    title: 'Jodhpur Blue City Experience',
    slug: 'jodhpur-blue-city-experience',
    description: 'Explore the magnificent Mehrangarh Fort and blue houses of Jodhpur',
    longDescription: 'Discover the Blue City with its imposing Mehrangarh Fort, blue-painted houses, and rich Marwar heritage.',
    duration: 2,
    price: 7500,
    maxGroupSize: 15,
    difficulty: 'easy',
    category: 'heritage',
    images: [
      'https://images.unsplash.com/photo-1609137144813-7d9921338f24',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245'
    ],
    highlights: [
      'Mehrangarh Fort - largest in India',
      'Jaswant Thada marble memorial',
      'Umaid Bhawan Palace',
      'Blue city walking tour',
      'Clock Tower market'
    ],
    included: [
      'Hotel accommodation',
      'Daily breakfast',
      'All entrance fees',
      'Transportation',
      'Guide services'
    ],
    excluded: [
      'Lunch and dinner',
      'Personal expenses',
      'Camera fees',
      'Tips'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Mehrangarh Fort & Blue City',
        description: 'Explore the magnificent fort and blue houses',
        activities: ['Mehrangarh Fort visit', 'Jaswant Thada', 'Blue city walk', 'Clock Tower market']
      },
      {
        day: 2,
        title: 'Umaid Bhawan & Departure',
        description: 'Visit palace and departure',
        activities: ['Umaid Bhawan Palace', 'Museum visit', 'Shopping', 'Departure']
      }
    ],
    destinations: ['Jodhpur'],
    rating: 4.8,
    reviewCount: 0,
    isFeatured: false
  },
  {
    title: 'Pushkar Spiritual Journey',
    slug: 'pushkar-spiritual-journey',
    description: 'Visit the only Brahma temple in the world and sacred Pushkar Lake',
    longDescription: 'Experience the spiritual essence of Pushkar with its sacred lake, Brahma temple, and vibrant ghats.',
    duration: 2,
    price: 5500,
    maxGroupSize: 20,
    difficulty: 'easy',
    category: 'heritage',
    images: [
      'https://images.unsplash.com/photo-1587474260584-136574528ed5',
      'https://images.unsplash.com/photo-1564507592333-c60657eea523'
    ],
    highlights: [
      'Brahma Temple - only one in world',
      'Pushkar Lake ghats',
      'Evening aarti ceremony',
      'Savitri Temple hilltop',
      'Local bazaars'
    ],
    included: [
      'Hotel accommodation',
      'Daily breakfast',
      'Temple visits',
      'Transportation',
      'Guide'
    ],
    excluded: [
      'Lunch and dinner',
      'Personal expenses',
      'Donations at temples',
      'Tips'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Pushkar Lake & Temples',
        description: 'Explore sacred sites and ghats',
        activities: ['Brahma Temple', 'Pushkar Lake ghats', 'Evening aarti', 'Market walk']
      },
      {
        day: 2,
        title: 'Savitri Temple & Departure',
        description: 'Hilltop temple and departure',
        activities: ['Savitri Temple trek', 'Panoramic views', 'Shopping', 'Departure']
      }
    ],
    destinations: ['Pushkar'],
    rating: 4.6,
    reviewCount: 0,
    isFeatured: false
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
      console.error('❌ Registration failed with status:', response.status);
      console.error('❌ Response:', JSON.stringify(data, null, 2));
      throw new Error(data.message || 'Failed to register admin');
    }
  } catch (error) {
    console.error('❌ Error registering admin:', error.message);
    if (error.cause) console.error('Cause:', error.cause);
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
    console.log('\n🌍 Domain: ghumofiroindia.com (to be configured)');

  } catch (error) {
    console.error('\n💥 Seeding failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run the seeding
seedData();

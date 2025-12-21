import { connectToDatabase } from '../lib/mongodb.js';

// All tours data - this is the source of truth
const DEFAULT_TOURS = [
  {
    id: 'goa-package-3n4d',
    title: 'Goa Beach Escape',
    location: 'North & South Goa',
    days: 4,
    price: 30500,
    category: 'Relaxation',
    packageType: 'trending',
    featured: true,
    showInPopup: true,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1600&auto=format&fit=crop',
    description: 'Experience the vibrant beaches, historic churches, and Portuguese charm of Goa. From the bustling shores of Calangute to the serene Old Goa churches, this package offers the perfect blend of relaxation and exploration.',
    highlights: [
      'North Goa Sightseeing - Anjuna, Vagator, Baga, Calangute Beach',
      'South Goa Sightseeing - Old Goa Church, Mangueshi Temple',
      'Boat Cruise at River Mandovi',
      'Fort Aguada Visit',
      'Airport/Railway Station Pickup & Drop',
      'Breakfast Included'
    ],
    itinerary: [
      { day: 1, title: 'Arrival at Goa', description: 'Arrive at Goa Airport, get picked up and transfer to hotel. Complete check-in process and enjoy a comfortable overnight stay.' },
      { day: 2, title: 'South Goa Sightseeing (10 AM - 7 PM)', description: 'After breakfast, explore South Goa - Old Goa Church, Mangueshi Temple, Dona Paula, Miramar Beach, Panjim Shopping, and Boat Cruise at River Mandovi. Return to hotel for overnight stay.' },
      { day: 3, title: 'North Goa Sightseeing (10 AM - 5 PM)', description: 'After breakfast, drive to North Goa - Anjuna Beach, Vagator Beach, Baga Beach, Sinquerim Beach, Calangute Beach, and Fort Aguada. Comfortable overnight stay.' },
      { day: 4, title: 'Departure', description: 'After breakfast, check out from hotel and transfer to Goa airport for your return journey.' }
    ]
  },
  {
    id: 'kashmir-dreamland-6n7d',
    title: 'Dreamland Kashmir',
    location: 'Pahalgam - Srinagar - Houseboat',
    days: 7,
    price: 18500,
    category: 'Nature',
    packageType: 'trending',
    featured: true,
    image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?q=80&w=1600&auto=format&fit=crop',
    description: 'Discover the paradise on Earth with our comprehensive Kashmir tour. From the meadows of Pahalgam to the serene Dal Lake houseboats, experience the magic of snow-capped mountains, lush valleys, and Mughal gardens.',
    highlights: [
      '2 Nights Pahalgam - Valley of Shepherds',
      '3 Nights Srinagar - Summer Capital',
      '1 Night Houseboat on Dal Lake',
      'Shikara Ride in Dal Lake',
      'Gulmarg & Sonmarg Day Excursions',
      'Mughal Gardens - Nishat, Shalimar, Chashma Shahi',
      'Breakfast & Dinner Included'
    ],
    itinerary: [
      { day: 1, title: 'Jammu - Pahalgam', description: 'Welcome at Jammu Railway Station. Meet our representative and transfer to Pahalgam. Check in hotel, relax and enjoy natural surroundings or visit Baisaren. Overnight stay in Pahalgam.' },
      { day: 2, title: 'Pahalgam Exploration', description: 'After breakfast, enjoy the green pine forests along Lidder River. Explore Chandanwadi, Aru Valley and Betaab Valley (ponies/cab available). Overnight stay at Pahalgam.' },
      { day: 3, title: 'Pahalgam - Srinagar', description: 'After breakfast, drive to Srinagar. Check into hotel, visit Shankracharya Temple. Evening Shikara ride in famous Dal Lake. Overnight stay in Srinagar.' },
      { day: 4, title: 'Sonmarg Excursion', description: 'Full day excursion to Sonmarg - the Meadow of Gold. Enjoy pony rides to glaciers for snow and ice fun. Evening return to Srinagar for overnight stay.' },
      { day: 5, title: 'Gulmarg Excursion', description: 'After breakfast, drive to Gulmarg - one of the best ski slopes in the world. Enjoy Gondola ride and views of Nanga Parbat. Evening return to Srinagar.' },
      { day: 6, title: 'Srinagar Sightseeing & Houseboat', description: 'Check into Houseboat. Visit famous Mughal Gardens - Chashma Shahi, Nishat Bagh, Shalimar Garden. Overnight stay in Houseboat on Dal Lake.' },
      { day: 7, title: 'Departure', description: 'After breakfast, transfer to Jammu Railway Station for your onward journey. Tour ends with beautiful memories.' }
    ]
  },
  {
    id: 'himachal-shimla-manali-5n6d',
    title: 'Himachal Highlights',
    location: 'Shimla - Manali',
    days: 6,
    price: 39500,
    category: 'Adventure',
    packageType: 'domestic',
    featured: true,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1600&auto=format&fit=crop',
    description: 'Experience the best of Himachal Pradesh from the colonial charm of Shimla to the adventure paradise of Manali. Enjoy snow-capped peaks, lush valleys, ancient temples, and thrilling activities.',
    highlights: [
      '2 Nights Shimla - Queen of Hills',
      '3 Nights Manali - Valley of Gods',
      'Kufri Sightseeing & Adventure Activities',
      'Solang Valley Snow Point',
      'Hadimba Temple & Tibetan Monastery',
      'Kullu Valley & Rafting Point',
      'Breakfast & Dinner Included'
    ],
    itinerary: [
      { day: 1, title: 'Delhi - Shimla', description: 'Pickup from Delhi Airport/Railway Station, drive to Shimla. Visit Christ Church, Scandal Point, Lakkar Bazaar, Gaiety Theater, and Kali Bari Temple. Dinner and overnight at hotel.' },
      { day: 2, title: 'Shimla - Kufri - Shimla', description: 'After breakfast, visit Kufri. Cover Green Valley, Wild Flower Hall, Hip Hip Hurray adventure park. Enjoy horse riding, Fagu Valley, Himalayan Nature Park. Dinner and overnight at hotel.' },
      { day: 3, title: 'Shimla - Manali via Kullu Valley', description: 'Early breakfast and journey to Manali. Enjoy scenic Himalayas, Sundernagar Lake, Pandoh Dam, Hanogi Waterfall, Rafting Point, and Kullu Shawl Factory. Check in for overnight stay.' },
      { day: 4, title: 'Solang Valley Excursion', description: 'Visit famous Solang Valley with stunning glacier views. Enjoy adventure activities like Zorbing, Horse riding, Snow Motor Bikes, and Rope Way. Dinner and overnight at hotel.' },
      { day: 5, title: 'Manali Local Sightseeing', description: 'Visit Hadimba Temple, Manali Club (boating, river crossing), Tibetan Monastery, Van Vihar, and Vashisht Hot Springs. Overnight stay at hotel.' },
      { day: 6, title: 'Manali - Delhi', description: 'After breakfast, check out and drive to Delhi. Drop at Delhi Airport/Railway Station. Tour ends.' }
    ]
  },
  {
    id: 'kullu-manali-volvo-5n6d',
    title: 'Kullu Manali Volvo Special',
    location: 'Delhi - Kullu - Manali',
    days: 6,
    price: 38500,
    category: 'Adventure',
    packageType: 'group-departures',
    featured: false,
    image: 'https://images.unsplash.com/photo-1585016495481-91613a3ab1bc?q=80&w=1600&auto=format&fit=crop',
    description: 'A budget-friendly adventure to the snow-capped mountains of Kullu and Manali. Travel by comfortable Volvo bus from Delhi and experience the magic of Himalayas with local sightseeing and adventure activities.',
    highlights: [
      'Delhi-Manali-Delhi Volvo Bus Tickets Included',
      '3 Nights Hotel Stay in Manali',
      'Solang Valley Snow Point',
      'Hadimba Temple & Tibetan Monastery',
      'Kullu Valley & Paragliding Point',
      'Breakfast & Dinner (Veg Food)'
    ],
    itinerary: [
      { day: 1, title: 'Delhi - Manali (Overnight Volvo)', description: 'Board overnight Volvo bus from Delhi R.K Ashram/Majnu ka Tilla to Manali. Overnight journey through the Himalayas.' },
      { day: 2, title: 'Manali Arrival & Local Sightseeing', description: 'Arrive Manali, check into hotel. Visit Hadimba Temple, Tibetan Monastery, Manali Club, Van Vihar, and Vashisht Springs. Dinner & overnight stay.' },
      { day: 3, title: 'Solang Valley Excursion', description: 'After breakfast, visit Solang Valley via Nehru Kund, Him Valley Adventure Park, Anjani Mahadev Temple. Enjoy adventure activities and Jogini Waterfall trek. Dinner & overnight stay.' },
      { day: 4, title: 'Kullu Valley Excursion', description: 'Proceed to Kullu & Naggar Castle. Enjoy rafting, paragliding, visit Vaishno Devi Temple and Kullu Shawl Factory. Dinner and overnight at Manali.' },
      { day: 5, title: 'Departure to Delhi (Overnight Volvo)', description: 'After breakfast, check out and board Volvo bus to Delhi. Overnight journey.' },
      { day: 6, title: 'Arrive Delhi', description: 'Arrive Delhi by 7-8 AM. Tour ends with beautiful memories.' }
    ]
  },
  {
    id: 'kerala-backwaters-5n6d',
    title: 'Kerala Backwaters & Hills',
    location: 'Cochin - Munnar - Thekkady - Alleppey',
    days: 6,
    price: 21500,
    category: 'Nature',
    packageType: 'domestic',
    featured: true,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1600&auto=format&fit=crop',
    description: 'Experience God\'s Own Country with this comprehensive Kerala tour. From the historic Fort Cochin to the misty tea gardens of Munnar, spice plantations of Thekkady, and serene backwaters of Alleppey.',
    highlights: [
      '1 Night Cochin - Queen of Arabian Sea',
      '2 Nights Munnar - Tea Garden Paradise',
      '1 Night Thekkady - Spice Capital',
      '1 Night Alleppey - Venice of East',
      'Chinese Fishing Nets & Fort Cochin',
      'Eravikulam National Park & Tea Museum',
      'Spice Plantation Tour',
      'Breakfast & Dinner Included'
    ],
    itinerary: [
      { day: 1, title: 'Arrival Cochin', description: 'Arrive Cochin Airport/Railway Station. Visit Dutch Palace, Jewish Synagogue, St. Francis Church, Santa Cruz Basilica, and Chinese Fishing Nets. Overnight stay at hotel.' },
      { day: 2, title: 'Cochin - Munnar', description: 'After breakfast, proceed to Munnar - the tea garden hill station. Visit Valara and Cheeyappara Waterfalls, Blossom Garden. Evening enjoy tea garden beauty. Overnight stay.' },
      { day: 3, title: 'Munnar Sightseeing', description: 'Visit Eravikulam National Park (home to Nilgiri Tahr), Tea Museum, Tea Factory, Mattupetty Dam, and Kundala Lake. Overnight stay at Munnar.' },
      { day: 4, title: 'Munnar - Thekkady', description: 'Drive to Thekkady - a heaven for nature lovers. Enjoy spice tour visiting cardamom, pepper, tea, coffee, cloves, ginger plantations. Overnight stay at Thekkady.' },
      { day: 5, title: 'Thekkady - Alleppey', description: 'Proceed to Alleppey - the Venice of India. Explore backwaters, paddy fields, narrow canals, and coir villages. Overnight stay at Alleppey.' },
      { day: 6, title: 'Departure', description: 'After breakfast, transfer to Cochin Airport/Railway Station. Return home with sweet memories.' }
    ]
  },
  {
    id: 'meghalaya-explorer-8n9d',
    title: 'Meghalaya Explorer',
    location: 'Shillong - Cherrapunji - Guwahati',
    days: 9,
    price: 35000,
    category: 'Adventure',
    packageType: 'domestic',
    featured: false,
    image: 'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?q=80&w=1600&auto=format&fit=crop',
    description: 'Discover the Scotland of the East with this comprehensive Meghalaya tour. From the cleanest village in Asia to the living root bridges, crystal clear rivers, and stunning waterfalls of the wettest place on Earth.',
    highlights: [
      '4 Nights Shillong - Scotland of East',
      '2 Nights Cherrapunji - Wettest Place on Earth',
      '2 Nights Guwahati - Gateway to Northeast',
      'Mawlynnong - Asia\'s Cleanest Village',
      'Dawki River - Crystal Clear Waters',
      'Double Decker Living Root Bridge',
      'Seven Sisters Falls & Mawsmai Cave',
      'River Cruise in Brahmaputra'
    ],
    itinerary: [
      { day: 1, title: 'Guwahati - Shillong', description: 'Pickup from Guwahati Airport/Station. Drive to Shillong (4 hours). Visit Umiam Lake (Barapani) enroute. Check in and overnight stay at Shillong.' },
      { day: 2, title: 'Mawlynnong & Dawki', description: 'Visit Mawlynnong Village - Asia\'s cleanest village. Proceed to Dawki and enjoy the crystal clear Umngot River. Return to Shillong for overnight stay.' },
      { day: 3, title: 'Shillong Local Sightseeing', description: 'Visit Don Bosco Museum, Cathedral Church, Lady Hydari Park, Ward\'s Lake. Evening explore Police Bazaar local market. Overnight at Shillong.' },
      { day: 4, title: 'Krang Suri Falls & Laitlum Canyon - Cherrapunji', description: 'Visit Krang Suri Falls and Laitlum Canyons (Lightrooms) - the End of the Hills. Drive to Cherrapunji for overnight stay.' },
      { day: 5, title: 'Cherrapunji Sightseeing', description: 'Explore the wettest place on Earth - Seven Sisters Falls, Mawsmai Cave, Thangkharang Park. Overnight stay at Cherrapunji.' },
      { day: 6, title: 'Living Root Bridge - Shillong', description: 'Trek to Double Decker Living Root Bridge and Rainbow Falls. Return to Shillong for overnight stay.' },
      { day: 7, title: 'Shillong - Guwahati', description: 'After breakfast, drive to Guwahati. Check in hotel. Evening enjoy River Cruise on Brahmaputra. Overnight stay at Guwahati.' },
      { day: 8, title: 'Guwahati Sightseeing', description: 'Full day local sightseeing - Umananda Temple, Balaji Temple, Botanical Garden, Assam State Museum, Kalakshetra. Overnight at Guwahati.' },
      { day: 9, title: 'Departure', description: 'After breakfast and leisure time for packing, transfer to Guwahati Airport/Station. Tour ends with nostalgic memories.' }
    ]
  },
  {
    id: 'uttarakhand-5n6d',
    title: 'Uttarakhand Hill Escape',
    location: 'Nainital - Rishikesh - Mussoorie',
    days: 6,
    price: 16500,
    category: 'Nature',
    packageType: 'group-departures',
    featured: false,
    image: 'https://images.unsplash.com/photo-1555554317-889a17d7d455?q=80&w=1600&auto=format&fit=crop',
    description: 'Experience the divine beauty of Uttarakhand from the serene lakes of Nainital to the spiritual ghats of Rishikesh and the Queen of Hills - Mussoorie. Perfect blend of nature, spirituality, and adventure.',
    highlights: [
      '2 Nights Nainital - Lake District of India',
      '1 Night Rishikesh - Yoga Capital of World',
      '2 Nights Mussoorie - Queen of Hills',
      'Naini Lake Boating & Mall Road',
      'Ganga Aarti at Parmarth Niketan',
      'Kempty Falls Visit',
      'Breakfast & Dinner Included'
    ],
    itinerary: [
      { day: 1, title: 'Delhi - Nainital', description: 'Pickup from Delhi Airport/Railway Station and drive to Nainital (311 km, 7 hours). Check into hotel, evening free for leisure. Overnight stay at Nainital.' },
      { day: 2, title: 'Nainital Local Sightseeing', description: 'After breakfast, explore Sariya Tal, Lovers Point, Lake View Point, Himalayan Botanical Garden, Cave Garden. Visit Mall Road, Naina Devi Temple, Snow View Point, High Altitude Zoo. Overnight stay.' },
      { day: 3, title: 'Nainital - Rishikesh', description: 'After breakfast, check out and drive to Rishikesh (70 km, 2 hours). Check into hotel. Evening witness the divine Ganga Aarti at Parmarth Niketan. Overnight stay at Rishikesh.' },
      { day: 4, title: 'Rishikesh - Mussoorie', description: 'After breakfast, drive to Mussoorie - Queen of Hills (79 km, 2.5 hours). Check into hotel. Evening explore Mall Road at leisure. Overnight stay in Mussoorie.' },
      { day: 5, title: 'Mussoorie Full Day Sightseeing', description: 'After breakfast, visit Kempty Falls and enjoy the waterfall. Explore local Mussoorie including Lal Tibba, Gun Hill (by walk). Dinner and overnight at hotel.' },
      { day: 6, title: 'Mussoorie - Delhi', description: 'After breakfast, check out from hotel and drive back to Delhi. Tour ends with sweet memories.' }
    ]
  },
  {
    id: 'tamilnadu-temple-4n5d',
    title: 'Tamil Nadu Temple Trail',
    location: 'Rameshwaram - Madurai - Coimbatore',
    days: 5,
    price: 22000,
    category: 'Spiritual',
    packageType: 'domestic',
    featured: false,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1600&auto=format&fit=crop',
    description: 'Embark on a spiritual journey through Tamil Nadu\'s magnificent temples. From the sacred Ramanathaswamy Temple in Rameshwaram to the iconic Meenakshi Temple in Madurai and the serene Isha Foundation.',
    highlights: [
      '2 Nights Rameshwaram - Sacred Island City',
      '1 Night Madurai - Temple City',
      '1 Night Coimbatore',
      'Ramanathaswamy Temple Visit',
      'Dhanushkodi - Land\'s End Point',
      'Meenakshi Amman Temple',
      'Isha Foundation & Adiyogi Statue',
      'Breakfast Included'
    ],
    itinerary: [
      { day: 1, title: 'Arrival Rameshwaram', description: 'Arrive at Rameshwaram, pickup and transfer to hotel. After rest, visit Abdul Kalam House & Museum, Dhanushkodi, Pamban Bridge. Evening return to hotel for overnight stay.' },
      { day: 2, title: 'Rameshwaram Temple Tour', description: 'After breakfast, visit the sacred Ramanathaswamy Temple dedicated to Lord Rama. Walk along Ramar Patham. Visit Agni Theertham and Sanguthurai Beach for adventure activities. Overnight at Rameshwaram.' },
      { day: 3, title: 'Rameshwaram - Madurai', description: 'After early breakfast, check out and drive to Madurai. Visit the magnificent Meenakshi Amman Temple - excellent example of Dravidian architecture with the famous Hall of Thousand Pillars and musical pillars. Overnight at Madurai.' },
      { day: 4, title: 'Madurai - Coimbatore', description: 'After breakfast, check out and drive to Coimbatore. Visit Isha Foundation and the iconic 112-feet Adiyogi Shiva statue. Experience the tranquil ambience of the ashram. Overnight at Coimbatore.' },
      { day: 5, title: 'Departure', description: 'After breakfast, check out and transfer to Coimbatore Airport/Railway Station for onward journey with warm memories.' }
    ]
  },
  {
    id: 'rajasthan-royal-7n8d',
    title: 'Royal Rajasthan Circuit',
    location: 'Jaipur - Jodhpur - Jaisalmer - Udaipur',
    days: 8,
    price: 27500,
    category: 'Culture',
    packageType: 'domestic',
    featured: true,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1600&auto=format&fit=crop',
    description: 'Experience the royal grandeur of Rajasthan! From the Pink City Jaipur to the Blue City Jodhpur, the Golden City Jaisalmer with its desert safari, and the romantic Lake City Udaipur. A complete royal experience.',
    highlights: [
      '1 Night Jaipur - Pink City',
      '2 Nights Jodhpur - Blue City',
      '2 Nights Jaisalmer - Golden City',
      '2 Nights Udaipur - City of Lakes',
      'Sam Sand Dunes Desert Safari & Camp Stay',
      'Mehrangarh Fort & Umaid Bhawan',
      'Lake Pichola Boat Ride',
      'Breakfast & Dinner Included'
    ],
    itinerary: [
      { day: 1, title: 'Arrive Jaipur', description: 'Arrive at Jaipur Airport/Railway Station. Transfer to hotel, explore local markets. Overnight stay at Jaipur.' },
      { day: 2, title: 'Jaipur - Jodhpur via Ajmer & Pushkar', description: 'After breakfast, drive to Jodhpur (350 km, 6-7 hours) via Ajmer and the holy town of Pushkar. Visit Brahma Temple and Pushkar Lake. Continue to Jodhpur for overnight stay.' },
      { day: 3, title: 'Jodhpur - Jaisalmer', description: 'After breakfast, explore Mehrangarh Fort and Jaswant Thada. Drive to Jaisalmer - the Golden City (300 km, 5-6 hours). Check in for overnight stay.' },
      { day: 4, title: 'Jaisalmer - Sam Sand Dunes', description: 'After breakfast, visit Jaisalmer Fort, Patwon Ki Haveli, Salim Singh Ki Haveli. Evening drive to Sam Sand Dunes (40 km) for desert safari, cultural program, and overnight stay at desert camp.' },
      { day: 5, title: 'Jaisalmer - Jodhpur', description: 'Early morning sunrise at sand dunes. After breakfast, drive back to Jodhpur (300 km). Evening explore the Blue City. Overnight at Jodhpur.' },
      { day: 6, title: 'Jodhpur - Udaipur', description: 'After breakfast, drive to Udaipur (300 km, 5-6 hours) - the City of Lakes. Enroute visit Ranakpur Jain Temples. Check in and overnight stay at Udaipur.' },
      { day: 7, title: 'Udaipur Sightseeing', description: 'Full day Udaipur tour - City Palace, Jagdish Temple, Saheliyon Ki Bari. Evening enjoy boat ride on Lake Pichola with views of Jag Mandir. Overnight at Udaipur.' },
      { day: 8, title: 'Udaipur - Kota Drop', description: 'After breakfast, check out and drive to Kota (400 km, 7-8 hours) via Chittorgarh Fort visit. Drop at Kota Airport/Railway Station. Tour ends with royal memories.' }
    ]
  }
];

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET - Fetch all tours
  if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      let tours = await db.collection('tours').find({}).toArray();

      // If no tours exist, seed with default tours
      if (!tours || tours.length === 0) {
        console.log('No tours found, seeding database...');
        try {
          await db.collection('tours').insertMany(DEFAULT_TOURS);
          tours = await db.collection('tours').find({}).toArray();
          console.log('✅ Seeded', tours.length, 'tours to MongoDB');
        } catch (seedError) {
          console.error('Failed to seed tours:', seedError);
          // Return default tours if seeding fails
          return res.status(200).json(DEFAULT_TOURS);
        }
      }

      // Transform _id to id for frontend compatibility
      const transformed = tours.map(tour => ({
        ...tour,
        id: tour.id || tour._id.toString(),
        _id: undefined
      }));

      return res.status(200).json(transformed);
    } catch (error) {
      console.error('MongoDB Error, returning default tours:', error.message);
      // Return default tours if MongoDB fails
      return res.status(200).json(DEFAULT_TOURS);
    }
  }

  // POST - Create new tour
  if (req.method === 'POST') {
    try {
      const { db } = await connectToDatabase();
      const tourData = req.body;
      
      // Ensure tour has an id
      if (!tourData.id) {
        tourData.id = `tour-${Date.now()}`;
      }
      
      tourData.createdAt = new Date().toISOString();

      await db.collection('tours').insertOne(tourData);
      console.log('✅ Created tour:', tourData.id);

      return res.status(201).json({
        ...tourData,
        id: tourData.id
      });
    } catch (error) {
      console.error('Failed to create tour:', error);
      return res.status(500).json({ error: 'Failed to create tour: ' + error.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}

import { connectToDatabase } from '../lib/mongodb.js';

// Default tours to seed if collection is empty
const DEFAULT_TOURS = [
  {
    id: 'golden-triangle',
    title: 'The Royal Golden Triangle',
    location: 'Delhi - Agra - Jaipur',
    days: 6,
    price: 45000,
    category: 'Culture',
    featured: true,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1600&auto=format&fit=crop',
    description: 'Immerse yourself in the opulent history of North India. Witness the sunrise over the Taj Mahal, ride elephants at Amber Fort, and explore the vibrant bazaars of Delhi.',
    highlights: ['Sunrise at Taj Mahal', 'Amber Fort Jeep Ride', 'Rickshaw Ride in Chandni Chowk', 'Royal Rajasthani Dining Experience'],
    itinerary: [
      { day: 1, title: 'Arrival in Delhi', description: 'Welcome to India. Private luxury transfer to your 5-star heritage hotel.' },
      { day: 2, title: 'Old & New Delhi', description: 'Explore Red Fort, Jama Masjid, India Gate and Humayun\'s Tomb.' },
      { day: 3, title: 'Agra via Express Highway', description: 'Drive to Agra. Visit the majestic Agra Fort at sunset.' },
      { day: 4, title: 'The Taj Mahal & Jaipur', description: 'Early morning visit to Taj Mahal. Drive to Jaipur via Fatehpur Sikri.' },
      { day: 5, title: 'Pink City Royal Tour', description: 'Visit Amber Fort, City Palace, Jantar Mantar and Hawa Mahal.' },
      { day: 6, title: 'Return to Delhi', description: 'Leisurely drive back to Delhi for your departure flight.' }
    ]
  },
  {
    id: 'kerala-backwaters',
    title: 'Emerald Backwaters & Hills',
    location: 'Cochin - Munnar - Alleppey',
    days: 7,
    price: 38500,
    category: 'Nature',
    featured: true,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1600&auto=format&fit=crop',
    description: 'Drift through the silent palm-fringed canals of God\'s Own Country. Breathe in the scent of tea in Munnar and rejuvenate with authentic Ayurveda.',
    highlights: ['Luxury Houseboat Stay', 'Tea Tasting in Munnar', 'Kathakali Cultural Show', 'Ayurvedic Rejuvenation Massage'],
    itinerary: [
      { day: 1, title: 'Arrival in Cochin', description: 'Transfer to Fort Kochi. Sunset cruise near Chinese fishing nets.' },
      { day: 2, title: 'Misty Munnar', description: 'Scenic drive to Munnar with stops at waterfalls.' },
      { day: 3, title: 'Tea Gardens & Trekking', description: 'Explore Eravikulam National Park and Tea Museum.' },
      { day: 4, title: 'Thekkady Spice Route', description: 'Drive to Periyar. Guided spice plantation tour.' },
      { day: 5, title: 'Alleppey Houseboat', description: 'Board your private premium houseboat for an overnight cruise.' },
      { day: 6, title: 'Marari Beach Relaxation', description: 'Unwind at a luxury beach resort.' },
      { day: 7, title: 'Departure', description: 'Transfer to Cochin airport with refreshed souls.' }
    ]
  },
  {
    id: 'ladakh-adventure',
    title: 'Himalayan Highs: Ladakh',
    location: 'Leh - Nubra - Pangong',
    days: 8,
    price: 52000,
    category: 'Adventure',
    featured: true,
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1600&auto=format&fit=crop',
    description: 'A surreal journey to the roof of the world. Conquer the highest motorable roads, camp by color-changing lakes, and find peace in ancient monasteries.',
    highlights: ['Khardung La Pass Crossing', 'Glamping at Pangong Lake', 'Thiksey Monastery Morning Prayer', 'Bactrian Camel Ride in Nubra'],
    itinerary: [
      { day: 1, title: 'Fly to Leh', description: 'Arrival and strict rest for acclimatization. Evening Shanti Stupa visit.' },
      { day: 2, title: 'Sham Valley Sights', description: 'Magnetic Hill, Gurudwara Pathar Sahib, and Sangam confluence.' },
      { day: 3, title: 'Nubra Valley via Khardung La', description: 'Drive across the world\'s highest motorable pass.' },
      { day: 4, title: 'Nubra to Pangong', description: 'Cross Shyok river route to reach the majestic Pangong Lake.' },
      { day: 5, title: 'Pangong to Leh', description: 'Sunrise at the lake. Return to Leh via Chang La.' },
      { day: 6, title: 'Leh Monasteries', description: 'Explore Hemis and Thiksey monasteries.' },
      { day: 7, title: 'Free Day in Leh', description: 'Explore the local market and cafes.' },
      { day: 8, title: 'Departure', description: 'Fly out with memories of the mountains.' }
    ]
  },
  {
    id: 'spiritual-varanasi',
    title: 'Eternal Kashi & The Ganges',
    location: 'Varanasi - Sarnath',
    days: 4,
    price: 22000,
    category: 'Spiritual',
    featured: false,
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1600&auto=format&fit=crop',
    description: 'Step back in time in the world\'s oldest living city. Witness the spectacular Ganga Aarti and boat rides that traverse the cycle of life and death.',
    highlights: ['Evening Ganga Aarti', 'Sunrise Boat Ride', 'Sarnath Buddhist Site', 'Hidden Alleys Walk'],
    itinerary: [
      { day: 1, title: 'Arrival in Varanasi', description: 'Check-in. Witness the mesmerizing evening Aarti at Dashashwamedh Ghat.' },
      { day: 2, title: 'Sunrise on Ganges', description: 'Morning boat ride. Kashi Vishwanath Temple darshan.' },
      { day: 3, title: 'Sarnath Excursion', description: 'Visit Dhamek Stupa where Buddha gave his first sermon.' },
      { day: 4, title: 'Departure', description: 'Transfer to airport.' }
    ]
  },
  {
    id: 'goa-beach-retreat',
    title: 'Sunkissed Goa Luxury',
    location: 'North & South Goa',
    days: 5,
    price: 32000,
    category: 'Relaxation',
    featured: false,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1600&auto=format&fit=crop',
    description: 'Experience the Portuguese charm of Goa. From vibrant beach parties to serene old churches and luxury resorts, this is the ultimate tropical escape.',
    highlights: ['Old Goa Heritage Walk', 'Private Yacht Cruise', 'Dudhsagar Waterfalls Jeep Safari', 'Candlelight Beach Dinner'],
    itinerary: [
      { day: 1, title: 'Arrival in Goa', description: 'VIP Transfer to your beachside resort.' },
      { day: 2, title: 'North Goa Vibes', description: 'Fort Aguada, Vagator and Anjuna beaches.' },
      { day: 3, title: 'Old Goa Heritage', description: 'Basilica of Bom Jesus and Latin Quarter walk.' },
      { day: 4, title: 'South Goa Serenity', description: 'Palolem beach and sunset cruise.' },
      { day: 5, title: 'Departure', description: 'Say goodbye to the sunny state.' }
    ]
  },
  {
    id: 'rajasthan-royal',
    title: 'Royal Forts & Lakes',
    location: 'Jodhpur - Udaipur',
    days: 6,
    price: 48000,
    category: 'Culture',
    featured: false,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1600&auto=format&fit=crop',
    description: 'A tale of two cities: The Blue City of Jodhpur and the White City of Udaipur. Stay in palaces and live like royalty.',
    highlights: ['Mehrangarh Fort Private Tour', 'Lake Pichola Sunset Cruise', 'Vintage Car Museum', 'Ranakpur Jain Temples'],
    itinerary: [
      { day: 1, title: 'Arrival in Jodhpur', description: 'Welcome to the Blue City. Leisure evening.' },
      { day: 2, title: 'Mehrangarh Glory', description: 'Explore the massive fort and Jaswant Thada.' },
      { day: 3, title: 'Drive to Udaipur', description: 'Stop at the intricately carved Ranakpur Temples.' },
      { day: 4, title: 'Udaipur City Palace', description: 'Grand tour of the City Palace and Jagdish Temple.' },
      { day: 5, title: 'Romantic Lakes', description: 'Boat ride on Lake Pichola and Jag Mandir visit.' },
      { day: 6, title: 'Departure', description: 'Transfer to Udaipur airport.' }
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

  try {
    const { db } = await connectToDatabase();

    // GET - Fetch all tours
    if (req.method === 'GET') {
      let tours = await db.collection('tours').find({}).toArray();

      // If no tours exist, seed with default tours
      if (tours.length === 0) {
        await db.collection('tours').insertMany(DEFAULT_TOURS);
        tours = await db.collection('tours').find({}).toArray();
        console.log('✅ Seeded default tours');
      }

      // Transform _id to id for frontend compatibility
      const transformed = tours.map(tour => ({
        ...tour,
        id: tour.id || tour._id.toString(),
        _id: undefined
      }));

      return res.status(200).json(transformed);
    }

    // POST - Create new tour
    if (req.method === 'POST') {
      const tourData = req.body;
      
      // Ensure tour has an id
      if (!tourData.id) {
        tourData.id = `tour-${Date.now()}`;
      }
      
      tourData.createdAt = new Date().toISOString();

      const result = await db.collection('tours').insertOne(tourData);

      return res.status(201).json({
        ...tourData,
        id: tourData.id
      });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Tours API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

// Load environment variables from .env.local
dotenv.config({ path: '../.env.local' });

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('hibiscus_holiday');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// ==================== DEFAULT TOURS DATA ====================
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
    description: 'Immerse yourself in the opulent history of North India.',
    highlights: ['Sunrise at Taj Mahal', 'Amber Fort Jeep Ride'],
    itinerary: []
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
    description: 'Drift through the silent palm-fringed canals.',
    highlights: ['Luxury Houseboat Stay', 'Tea Tasting in Munnar'],
    itinerary: []
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
    description: 'A surreal journey to the roof of the world.',
    highlights: ['Khardung La Pass Crossing', 'Glamping at Pangong Lake'],
    itinerary: []
  }
];

// ==================== TOUR ROUTES ====================

// GET all tours
app.get('/api/tours', async (req, res) => {
  try {
    let tours = await db.collection('tours').find({}).toArray();

    // If no tours exist, seed with default tours
    if (tours.length === 0) {
      await db.collection('tours').insertMany(DEFAULT_TOURS);
      tours = await db.collection('tours').find({}).toArray();
      console.log('✅ Seeded default tours');
    }

    const transformed = tours.map(tour => ({
      ...tour,
      id: tour.id || tour._id.toString(),
      _id: undefined
    }));

    res.json(transformed);
  } catch (error) {
    console.error('Error fetching tours:', error);
    res.status(500).json({ error: 'Failed to fetch tours' });
  }
});

// GET single tour by ID
app.get('/api/tours/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    let tour = await db.collection('tours').findOne({ id: id });
    
    if (!tour) {
      try {
        tour = await db.collection('tours').findOne({ _id: new ObjectId(id) });
      } catch (e) {}
    }

    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    res.json({
      ...tour,
      id: tour.id || tour._id.toString(),
      _id: undefined
    });
  } catch (error) {
    console.error('Error fetching tour:', error);
    res.status(500).json({ error: 'Failed to fetch tour' });
  }
});

// POST new tour
app.post('/api/tours', async (req, res) => {
  try {
    const tourData = req.body;
    
    if (!tourData.id) {
      tourData.id = `tour-${Date.now()}`;
    }
    
    tourData.createdAt = new Date().toISOString();

    await db.collection('tours').insertOne(tourData);

    res.status(201).json({
      ...tourData,
      id: tourData.id
    });
  } catch (error) {
    console.error('Error creating tour:', error);
    res.status(500).json({ error: 'Failed to create tour' });
  }
});

// PATCH update tour
app.patch('/api/tours/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedAt = new Date().toISOString();

    let result = await db.collection('tours').updateOne(
      { id: id },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      try {
        result = await db.collection('tours').updateOne(
          { _id: new ObjectId(id) },
          { $set: updates }
        );
      } catch (e) {}
    }

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating tour:', error);
    res.status(500).json({ error: 'Failed to update tour' });
  }
});

// DELETE tour
app.delete('/api/tours/:id', async (req, res) => {
  try {
    const { id } = req.params;

    let result = await db.collection('tours').deleteOne({ id: id });

    if (result.deletedCount === 0) {
      try {
        result = await db.collection('tours').deleteOne({ _id: new ObjectId(id) });
      } catch (e) {}
    }

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting tour:', error);
    res.status(500).json({ error: 'Failed to delete tour' });
  }
});

// ==================== INQUIRY ROUTES ====================

// GET all inquiries
app.get('/api/inquiries', async (req, res) => {
  try {
    const inquiries = await db.collection('inquiries')
      .find({})
      .sort({ date: -1 })
      .toArray();
    
    // Transform _id to id for frontend compatibility
    const transformed = inquiries.map(inquiry => ({
      ...inquiry,
      id: inquiry._id.toString(),
      _id: undefined
    }));
    
    res.json(transformed);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// POST new inquiry
app.post('/api/inquiries', async (req, res) => {
  try {
    const { name, email, phone, tripLocation, message } = req.body;
    
    const newInquiry = {
      name,
      email,
      phone,
      tripLocation,
      message,
      date: new Date().toISOString(),
      status: 'new'
    };
    
    const result = await db.collection('inquiries').insertOne(newInquiry);
    
    res.status(201).json({
      ...newInquiry,
      id: result.insertedId.toString()
    });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ error: 'Failed to create inquiry' });
  }
});

// PATCH - Mark inquiry as read
app.patch('/api/inquiries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await db.collection('inquiries').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    res.status(500).json({ error: 'Failed to update inquiry' });
  }
});

// DELETE inquiry
app.delete('/api/inquiries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.collection('inquiries').deleteOne({ _id: new ObjectId(id) });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

// ==================== ADMIN AUTH ROUTES ====================

// Initialize default admin if not exists
async function initializeAdmin() {
  try {
    const existingAdmin = await db.collection('admin').findOne({});
    if (!existingAdmin) {
      await db.collection('admin').insertOne({
        username: 'admin',
        password: 'hibiscus2025',
        passwordVersion: 1,
        createdAt: new Date().toISOString()
      });
      console.log('✅ Default admin credentials created');
    } else {
      // Add passwordVersion if missing
      if (!existingAdmin.passwordVersion) {
        await db.collection('admin').updateOne(
          { _id: existingAdmin._id },
          { $set: { passwordVersion: 1 } }
        );
      }
      console.log('✅ Admin exists:', existingAdmin.username);
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
}

// POST - Verify admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admin = await db.collection('admin').findOne({ 
      username: username,
      password: password 
    });
    
    if (admin) {
      res.json({ 
        success: true, 
        message: 'Login successful',
        passwordVersion: admin.passwordVersion || 1
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// POST - Verify session (check if password version matches)
app.post('/api/admin/verify', async (req, res) => {
  try {
    const { passwordVersion } = req.body;
    
    const admin = await db.collection('admin').findOne({});
    
    if (!admin) {
      return res.status(401).json({ valid: false, message: 'No admin found' });
    }

    const currentVersion = admin.passwordVersion || 1;
    
    if (passwordVersion && parseInt(passwordVersion) === currentVersion) {
      res.json({ valid: true, passwordVersion: currentVersion });
    } else {
      res.status(401).json({ valid: false, message: 'Session expired - password was changed' });
    }
  } catch (error) {
    console.error('Error verifying session:', error);
    res.status(500).json({ valid: false, message: 'Verification failed' });
  }
});

// GET - Get admin info (for checking if credentials exist)
app.get('/api/admin/check', async (req, res) => {
  try {
    const admin = await db.collection('admin').findOne({});
    res.json({ exists: !!admin });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check admin' });
  }
});

// POST - Reset admin credentials to default
app.post('/api/admin/reset', async (req, res) => {
  try {
    // Get current version to increment
    const currentAdmin = await db.collection('admin').findOne({});
    const newVersion = (currentAdmin?.passwordVersion || 0) + 1;

    await db.collection('admin').deleteMany({});
    await db.collection('admin').insertOne({
      username: 'admin',
      password: 'hibiscus2025',
      passwordVersion: newVersion,
      createdAt: new Date().toISOString()
    });
    res.json({ 
      success: true, 
      message: 'Admin credentials reset to default (admin/hibiscus2025). All sessions invalidated.',
      passwordVersion: newVersion
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset admin' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
connectDB().then(() => {
  initializeAdmin();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});


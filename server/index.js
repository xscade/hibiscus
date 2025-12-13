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
        createdAt: new Date().toISOString()
      });
      console.log('✅ Default admin credentials created');
    } else {
      console.log('✅ Admin exists:', existingAdmin.username);
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
}

// Reset admin credentials (run once to fix)
async function resetAdmin() {
  try {
    await db.collection('admin').deleteMany({});
    await db.collection('admin').insertOne({
      username: 'admin',
      password: 'hibiscus2025',
      createdAt: new Date().toISOString()
    });
    console.log('✅ Admin credentials reset to default');
  } catch (error) {
    console.error('Error resetting admin:', error);
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
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
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
    await db.collection('admin').deleteMany({});
    await db.collection('admin').insertOne({
      username: 'admin',
      password: 'hibiscus2025',
      createdAt: new Date().toISOString()
    });
    res.json({ success: true, message: 'Admin credentials reset to default (admin/hibiscus2025)' });
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


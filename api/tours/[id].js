import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../lib/mongodb.js';

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

  const { id } = req.query;

  try {
    const { db } = await connectToDatabase();

    // GET - Fetch single tour by ID
    if (req.method === 'GET') {
      // Try to find by custom id first, then by MongoDB _id
      let tour = await db.collection('tours').findOne({ id: id });
      
      if (!tour) {
        try {
          tour = await db.collection('tours').findOne({ _id: new ObjectId(id) });
        } catch (e) {
          // Invalid ObjectId format, tour not found
        }
      }

      if (!tour) {
        return res.status(404).json({ error: 'Tour not found' });
      }

      return res.status(200).json({
        ...tour,
        id: tour.id || tour._id.toString(),
        _id: undefined
      });
    }

    // PATCH - Update tour
    if (req.method === 'PATCH') {
      const updates = req.body;
      updates.updatedAt = new Date().toISOString();

      // Try to update by custom id first
      let result = await db.collection('tours').updateOne(
        { id: id },
        { $set: updates }
      );

      // If not found by custom id, try MongoDB _id
      if (result.matchedCount === 0) {
        try {
          result = await db.collection('tours').updateOne(
            { _id: new ObjectId(id) },
            { $set: updates }
          );
        } catch (e) {
          // Invalid ObjectId format
        }
      }

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Tour not found' });
      }

      return res.status(200).json({ success: true });
    }

    // DELETE - Delete tour
    if (req.method === 'DELETE') {
      // Try to delete by custom id first
      let result = await db.collection('tours').deleteOne({ id: id });

      // If not found by custom id, try MongoDB _id
      if (result.deletedCount === 0) {
        try {
          result = await db.collection('tours').deleteOne({ _id: new ObjectId(id) });
        } catch (e) {
          // Invalid ObjectId format
        }
      }

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Tour not found' });
      }

      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Tour API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


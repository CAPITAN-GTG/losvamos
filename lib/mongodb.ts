import mongoose from 'mongoose';

// Simple in-memory cache for development
let cached: { conn: any; promise: any } | null = null;

async function connectDB() {
  // Prevent recursive calls
  if (cached && cached.promise) {
    return await cached.promise;
  }

  if (cached && cached.conn) {
    return cached.conn;
  }

  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (!cached) {
    cached = { conn: null, promise: null };
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

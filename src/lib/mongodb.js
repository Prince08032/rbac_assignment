import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: 'rbac_db'
    };

    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts);
      cached.conn = await cached.promise;
      console.log('MongoDB connected successfully to database:', opts.dbName);
    } catch (e) {
      cached.promise = null;
      console.error('Error connecting to MongoDB:', e);
      throw e;
    }
  } else {
    try {
      cached.conn = await cached.promise;
    } catch (e) {
      cached.promise = null;
      console.error('Error awaiting MongoDB connection:', e);
      throw e;
    }
  }

  return cached.conn;
}

export default connectDB; 
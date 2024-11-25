import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { 
    conn: null, 
    promise: null,
    isConnected: false 
  };
}

async function connectDB() {
  if (cached.conn) {
    return { 
      connection: cached.conn,
      isConnected: cached.isConnected 
    };
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts);
      cached.conn = await cached.promise;
      cached.isConnected = true;
      console.log('MongoDB connected successfully');
    } catch (e) {
      cached.promise = null;
      cached.isConnected = false;
      console.error('MongoDB connection error:', e);
      throw e;
    }
  }

  try {
    await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.isConnected = false;
    throw e;
  }

  return { 
    connection: cached.conn,
    isConnected: cached.isConnected 
  };
}

mongoose.connection.on('connected', () => {
  cached.isConnected = true;
  console.log('MongoDB connection established');
});

mongoose.connection.on('disconnected', () => {
  cached.isConnected = false;
  console.log('MongoDB connection lost');
});

export default connectDB; 
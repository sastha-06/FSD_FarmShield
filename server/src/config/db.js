import mongoose from 'mongoose';

let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/farmshield';
  try {
    mongoose.set('strictQuery', false);
    const conn = await Promise.race([
      mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database network connection timeout (SRV/DNS)')), 3500)
      ),
    ]);
    isMongoConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.error('[Database] MongoDB connection failed:', error.message);

    console.log('[Database] Switching to persistent JSON storage.');

    return false;
  }
};

export const getDbStatus = () => {
  return {
    isMongoConnected,
    type: isMongoConnected ? 'MongoDB' : 'Persistent Storage Engine',
  };
};

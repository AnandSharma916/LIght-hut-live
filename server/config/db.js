import mongoose from 'mongoose';

let memoryServer = null;

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (uri && uri.trim() !== '') {
      try {
        console.log(`[DB] Attempting connection to MongoDB at: ${uri.split('@').pop()}`);
        const conn = await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
        return;
      } catch (err) {
        console.warn(`[DB] Could not connect to configured MONGODB_URI: ${err.message}`);
      }
    }

    // Fallback in development: Start in-memory MongoDB so system works immediately
    if (process.env.NODE_ENV !== 'production') {
      console.log('[DB] Launching embedded MongoDB instance for development & testing...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create({
        instance: {
          launchTimeout: 120000,
        },
      });
      const memUri = memoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[DB] Embedded MongoDB connected successfully at ${memUri}`);
    } else {
      throw new Error('MONGODB_URI is required in production environment.');
    }
  } catch (error) {
    console.error(`[DB Error]: ${error.message}`);
    process.exit(1);
  }
};

export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    if (memoryServer) {
      await memoryServer.stop();
    }
    console.log('[DB] Database connections closed.');
  } catch (err) {
    console.error('[DB Close Error]:', err);
  }
};

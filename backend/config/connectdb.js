import mongoose from 'mongoose';

const connectDB = async () => {
  const connectionString = process.env.MONGO_URL || 'mongodb://localhost:27017/farmer-buddy';

  console.log('Attempting to connect to MongoDB...');

  try {
    const connection = await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${connection.connection.host}`);
    console.log(`Database: ${connection.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    return connection;
  } catch (error) {
    console.warn('⚠️ MongoDB connection failed:', error.message);
    console.warn('⚠️ Starting Express server. To enable DB features, ensure local MongoDB is running or update MONGO_URL in backend/.env');
  }
};

export default connectDB;

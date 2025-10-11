import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connectionString = process.env.MONGO_URL || 'mongodb://localhost:27017/farmer-buddy';

    console.log('Attempting to connect to MongoDB...');

    const connection = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${connection.connection.host}`);
    console.log(`Database: ${connection.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    return connection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;

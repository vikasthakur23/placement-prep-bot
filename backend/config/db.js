import mongoose from 'mongoose';
import dotenv from 'dotenv';

// This line loads the variables from your .env file
dotenv.config();

const connectDB = async () => {
  try {
    // This line reads the variable. If it's undefined, you get the error.
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
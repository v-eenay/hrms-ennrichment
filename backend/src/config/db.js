import mongoose from "mongoose";
import { DB_URL} from "./config.js";

/**
 * Connect to MongoDB database
 * @returns {Promise<boolean>} True if connection successful
 * @throws {Error} If connection fails
 */
const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    // Only log in non-test environments
    if (process.env.NODE_ENV !== 'test') {
      console.log('✅ Database connected successfully');
    }
    return true;
  } catch (error) {
    // Only log in non-test environments
    if (process.env.NODE_ENV !== 'test') {
      console.error('❌ Database connection failed:', error.message);
    }
    throw error; // Let the caller handle the error
  }
}

export { connectDB };
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
    return true;
  } catch (error) {
    throw error; // Let the caller handle the error and logging
  }
}

export { connectDB };
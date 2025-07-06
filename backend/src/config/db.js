import mongoose from "mongoose";
import { DB_URL} from "./config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

export { connectDB };
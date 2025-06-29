import mongoose from "mongoose";
import { DB_URL} from "./config.js";

console.log(DB_URL);
const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log('Connected to the database successfully');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
}

export { connectDB };
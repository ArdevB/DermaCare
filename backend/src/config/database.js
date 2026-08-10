import mongoose from "mongoose";
import config from "./config.js";

async function connectDB() {
  try {
    const status = await mongoose.connect(config.mongodbURL);
    console.log(`MongoDB connected: ${status.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

export default connectDB;

import mongoose from "mongoose";
import config from "./config.js";
import logger from "../utils/logger.js";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(config.mongodbUri);

    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error(`MongoDB connection failed: ${err.message}`);
    throw err;
  }
};

export default connectDB;
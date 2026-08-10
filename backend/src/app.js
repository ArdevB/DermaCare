import express from "express";
import cors from "cors";

import connectDB from "./config/database.js";
import config from "./config/config.js";
import connectCloudinary from "./config/cloudinary.js";
import logger from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoute.js";

const app = express();
connectDB();
connectCloudinary();

app.use(logger);
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/auth", authRoutes);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});


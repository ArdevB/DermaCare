import dotenv from "dotenv";

dotenv.config();
const config = {
  env: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  port: process.env.PORT || 5000,
  appURL: process.env.APP_URL || "",
  mongodbURL: process.env.MONGODB_URL || "",
  cloudinaryAPIKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryAPISecret: process.env.CLOUDINARY_API_SECRET || "",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "",
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || "1d",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "",
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || "7d",
  },
  emailApiKey: process.env.RESEND_API_KEY || "",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL || "",
};

export default config;

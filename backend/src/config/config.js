import dotenv from "dotenv";
dotenv.config();

const required = [
  "MONGODB_URL",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "GEMINI_API_KEY",
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  // Fail fast and loudly at startup rather than crashing later mid-request.
  // eslint-disable-next-line no-console
  console.error(
    `\n[CONFIG ERROR] Missing required environment variables:\n  - ${missing.join(
      "\n  - "
    )}\n\nCopy .env.example to .env and fill in the values before starting the server.\n`
  );
  process.exit(1);
}

const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 5000,

  mongodbUri: process.env.MONGODB_URL,

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    folder: process.env.CLOUDINARY_FOLDER,
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  },

  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
      : "http://localhost:5173",
    credentials: true,
  },

  isProd: (process.env.NODE_ENV || "development") === "production",
};

export default config;

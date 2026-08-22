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

// Feature-level config (email, Khalti): NOT added to the hard-required list
// above, so the server still boots without them. Each related endpoint
// throws a clear 503 at the point of use if its config is missing, instead
// of the whole server refusing to start over one unconfigured feature.
const emailConfigured = Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
const khaltiConfigured = Boolean(process.env.KHALTI_SECRET_KEY);

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
    folder: process.env.CLOUDINARY_FOLDER || "dermacare/products",
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
  },

  email: {
    apiKey: process.env.RESEND_API_KEY || null,
    from: process.env.EMAIL_FROM || null,
    isConfigured: emailConfigured,
  },

  khalti: {
    secretKey: process.env.KHALTI_SECRET_KEY || null,
    // Khalti's sandbox and live environments use different base URLs.
    baseUrl:
      process.env.KHALTI_ENV === "live"
        ? "https://khalti.com/api/v2/"
        : "https://dev.khalti.com/api/v2/",
    isConfigured: khaltiConfigured,
  },

  // Used to build links that go out in emails (verify/reset) and to build
  // the Khalti return_url/website_url for its payment redirect flow.
  frontendUrl: process.env.FRONTEND_URL || "",

  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
      : "http://localhost:5173",
    credentials: true,
  },

  isProd: (process.env.NODE_ENV || "development") === "production",

  // Exposed so server.js can print one clear startup warning listing
  // exactly which optional features are unconfigured.
  missingOptionalFeatures: {
    ...(emailConfigured ? {} : { email: ["RESEND_API_KEY", "EMAIL_FROM"] }),
    ...(khaltiConfigured ? {} : { khalti: ["KHALTI_SECRET_KEY"] }),
  },
};

export default config;

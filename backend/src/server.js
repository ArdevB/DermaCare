import app from "./app.js";
import config from "./config/config.js";
import connectDB from "./config/db.js";
import logger from "./utils/logger.js";

const startServer = async () => {
  await connectDB();

  if (Object.keys(config.missingOptionalFeatures).length > 0) {
    for (const [feature, keys] of Object.entries(config.missingOptionalFeatures)) {
      logger.warn(
        `${feature} is not configured (missing: ${keys.join(", ")}). Related endpoints will return a clear 503 until this is set in .env.`
      );
    }
  }

  const server = app.listen(config.port, () => {
    logger.info(`DermaCare API running in ${config.env} mode on port ${config.port}`);
  });

  process.on("unhandledRejection", (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`, { stack: err.stack });
    server.close(() => process.exit(1));
  });

  process.on("uncaughtException", (err) => {
    logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
    process.exit(1);
  });

  process.on("SIGTERM", () => {
    logger.info("SIGTERM received. Shutting down gracefully.");
    server.close(() => process.exit(0));
  });
};

startServer();

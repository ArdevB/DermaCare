import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";
import config from "../config/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, "..", "logs");

// Fields that must never be written to logs, even if accidentally passed in.
const REDACTED_KEYS = ["password", "confirmPassword", "token", "jwt", "authorization", "secret"];

const redactFormat = winston.format((info) => {
  const scrub = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    for (const key of Object.keys(obj)) {
      if (REDACTED_KEYS.includes(key.toLowerCase())) {
        obj[key] = "[REDACTED]";
      } else if (typeof obj[key] === "object") {
        scrub(obj[key]);
      }
    }
    return obj;
  };
  scrub(info);
  return info;
});

const logger = winston.createLogger({
  level: config.isProd ? "info" : "debug",
  format: winston.format.combine(
    redactFormat(),
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logsDir, "error.log"), level: "error" }),
    new winston.transports.File({ filename: path.join(logsDir, "combined.log") }),
  ],
});

if (!config.isProd) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`)
      ),
    })
  );
}

export default logger;

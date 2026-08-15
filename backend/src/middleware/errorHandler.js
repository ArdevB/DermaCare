import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";
import config from "../config/config.js";

export const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Normalize known non-ApiError failure modes into ApiError so the response shape stays consistent.
  if (err.name === "CastError") {
    error = ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
  } else if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    error = ApiError.conflict(`Duplicate value for ${field}`);
  } else if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = ApiError.badRequest("Validation failed", messages);
  } else if (err.name === "JsonWebTokenError") {
    error = ApiError.unauthorized("Invalid token");
  } else if (err.name === "TokenExpiredError") {
    error = ApiError.unauthorized("Token expired");
  } else if (!(err instanceof ApiError)) {
    error = ApiError.internal(config.isProd ? "Internal server error" : err.message);
  }

  if (error.statusCode >= 500) {
    logger.error(`${error.message} - ${req.method} ${req.originalUrl}`, { stack: err.stack });
  } else {
    logger.warn(`${error.message} - ${req.method} ${req.originalUrl}`);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
    errors: error.errors || [],
    ...(config.isProd ? {} : { stack: err.stack }),
  });
};

import config from "../config/config.js";

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  // Mongoose-specific error normalization
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for field: ${err.path}`;
  }
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value for field: ${field}`;
  }
  if (err.name === "ValidationError") {
    statusCode = 400;
    errors = Object.values(err.errors).map((e) => ({ message: e.message }));
    message = "Validation failed";
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: config.isProduction ? undefined : err.stack,
  });
};

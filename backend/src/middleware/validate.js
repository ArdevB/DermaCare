import ApiError from "../utils/ApiError.js";

// Wraps a zod schema and validates req.body (or another part of req) against it.
const validate = (schema, source = "body") => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const messages = result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
    return next(ApiError.badRequest("Validation failed", messages));
  }
  req[source] = result.data;
  next();
};

export default validate;

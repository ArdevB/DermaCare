import jwt from "jsonwebtoken";
import config from "../config/config.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";

// Verifies the JWT (from Authorization header or httpOnly cookie) and attaches req.user.
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw ApiError.unauthorized("Not authenticated. Please log in.");
  }

  const decoded = jwt.verify(token, config.jwt.secret);

  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    throw ApiError.unauthorized("User belonging to this token no longer exists.");
  }

  req.user = user;
  next();
});

// Restricts access to the given roles. Always used AFTER protect().
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized("Not authenticated.");
    }
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        `Role '${req.user.role}' is not authorized to access this resource.`
      );
    }
    next();
  };
};

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import config from "../config/config.js";
import logger from "../utils/logger.js";

const signToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};

export const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw ApiError.conflict("An account with this email already exists.");
  }

  const user = await User.create({ name, email, password });
  logger.info(`New user registered: ${user.email}`);

  const token = signToken(user._id);
  return { user, token };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  const token = signToken(user._id);
  logger.info(`User logged in: ${user.email}`);
  return { user, token };
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound("User not found.");
  }
  return user;
};

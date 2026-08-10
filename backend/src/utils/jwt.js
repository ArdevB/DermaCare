import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const generateAccessToken = (payload) =>
  jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiry,
  });

export const generateRefreshToken = (payload) =>
  jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiry,
  });

export const verifyAccessToken = (token) =>
  jwt.verify(token, config.jwt.accessSecret);

export const verifyRefreshToken = (token) =>
  jwt.verify(token, config.jwt.refreshSecret);

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import * as authService from "../services/authService.js";
import config from "../config/config.js";

const cookieOptions = {
  httpOnly: true,
  secure: config.isProd,
  sameSite: config.isProd ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { user, token } = await authService.registerUser({ name, email, password });

  res.cookie("token", token, cookieOptions);
  res.status(201).json(new ApiResponse(201, { user, token }, "Account created successfully."));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.loginUser({ email, password });

  res.cookie("token", token, cookieOptions);
  res.status(200).json(new ApiResponse(200, { user, token }, "Logged in successfully."));
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user._id);
  res.status(200).json(new ApiResponse(200, { user }));
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.status(200).json(new ApiResponse(200, null, "Logged out successfully."));
});

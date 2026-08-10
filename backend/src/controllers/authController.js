import authService from "../services/authService.js";
import config from "../config/config.js";

const ACCESS_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: "strict",
  maxAge: 15 * 60 * 1000, // 15 min — match your JWT_ACCESS_EXPIRY
};

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days — match your JWT_REFRESH_EXPIRY
};

const register = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await authService.register(
      req.body,
    );

    res.cookie("accessToken", accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
    res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    res.status(201).json({ message: "Registration successful", user });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went wrong" });
  }
};

const login = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(
      req.body,
    );

    res.cookie("accessToken", accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
    res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went wrong" });
  }
};

const refresh = async (req, res) => {
  try {
    const { accessToken } = await authService.refreshAccessToken(
      req.cookies?.refreshToken,
    );

    res.cookie("accessToken", accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);

    res.status(200).json({ message: "Token refreshed" });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went wrong" });
  }
};

const logout = async (req, res) => {
  res.clearCookie("accessToken", ACCESS_TOKEN_COOKIE_OPTIONS);
  res.clearCookie("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS);
  res.status(200).json({ message: "Logged out successfully" });
};

const forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went wrong" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went wrong" });
  }
};

export default {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
};

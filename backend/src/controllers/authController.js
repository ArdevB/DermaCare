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
  const { user, token, verificationEmailSent, devVerificationToken } = await authService.registerUser({
    name,
    email,
    password,
  });

  res.cookie("token", token, cookieOptions);
  res.status(201).json(
    new ApiResponse(
      201,
      { user, token, ...(devVerificationToken ? { devVerificationToken } : {}) },
      verificationEmailSent
        ? "Account created. Please check your email to verify your account."
        : "Account created, but the verification email could not be sent. Use the resend-verification endpoint to try again."
    )
  );
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
  const { maxAge, ...clearOptions } = cookieOptions;
  res.clearCookie("token", clearOptions);
  res.status(200).json(new ApiResponse(200, null, "Logged out successfully."));
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await authService.verifyEmail(req.body.token);
  res.status(200).json(new ApiResponse(200, { user }, "Email verified successfully."));
});

export const resendVerification = asyncHandler(async (req, res) => {
  const { devVerificationToken } = await authService.resendVerificationEmail(req.body.email);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        devVerificationToken ? { devVerificationToken } : null,
        "If that account exists and isn't verified yet, a new verification email has been sent."
      )
    );
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { devResetToken } = await authService.forgotPassword(req.body.email);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        devResetToken ? { devResetToken } : null,
        "If an account with that email exists, a password reset link has been sent."
      )
    );
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password);
  res.status(200).json(new ApiResponse(200, null, "Password reset successfully. You can now log in."));
});
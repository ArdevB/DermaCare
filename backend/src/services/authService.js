import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import config from "../config/config.js";
import logger from "../utils/logger.js";
import sendEmail from "../utils/email.js";

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

  const rawToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  let verificationEmailSent = false;
  try {
    const verifyUrl = `${config.frontendUrl}/verify-email?token=${rawToken}`;
    if (!config.isProd) {
      logger.info(`[DEV ONLY] Email verification token for ${user.email}: ${rawToken}`);
      logger.info(`[DEV ONLY] Verify URL: ${verifyUrl}`);
    }
    await sendEmail(user.email, {
      subject: "Verify your DermaCare account",
      body: `<p>Hi ${user.name},</p><p>Please verify your email by clicking the link below (expires in 24 hours):</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
    });
    verificationEmailSent = true;
  } catch (err) {
    logger.error(`Failed to send verification email to ${user.email}: ${err.message}`);
  }

  const token = signToken(user._id);
  return {
    user,
    token,
    verificationEmailSent,
    // Only ever populated outside production — lets you test verification via
    // Postman without needing a working email provider.
    devVerificationToken: config.isProd ? undefined : rawToken,
  };
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

const hashToken = (rawToken) => crypto.createHash("sha256").update(rawToken).digest("hex");

export const verifyEmail = async (rawToken) => {
  const hashedToken = hashToken(rawToken);

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  }).select("+emailVerificationToken +emailVerificationExpires");

  if (!user) {
    throw ApiError.badRequest("Verification link is invalid or has expired.");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpires = null;
  await user.save({ validateBeforeSave: false });

  logger.info(`Email verified: ${user.email}`);
  return user;
};

export const resendVerificationEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user || user.isEmailVerified) {
    return { devVerificationToken: undefined };
  }

  const rawToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${config.frontendUrl}/verify-email?token=${rawToken}`;
  if (!config.isProd) {
    logger.info(`[DEV ONLY] Email verification token for ${user.email}: ${rawToken}`);
    logger.info(`[DEV ONLY] Verify URL: ${verifyUrl}`);
  }
  try {
    await sendEmail(user.email, {
      subject: "Verify your DermaCare account",
      body: `<p>Hi ${user.name},</p><p>Please verify your email by clicking the link below (expires in 24 hours):</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
    });
  } catch (err) {
    logger.error(`Failed to resend verification email to ${user.email}: ${err.message}`);
    throw ApiError.internal("Failed to send verification email. Please try again shortly.");
  }

  return { devVerificationToken: config.isProd ? undefined : rawToken };
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    return { devResetToken: undefined };
  }

  const rawToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${config.frontendUrl}/reset-password?token=${rawToken}`;
  if (!config.isProd) {
    logger.info(`[DEV ONLY] Password reset token for ${user.email}: ${rawToken}`);
    logger.info(`[DEV ONLY] Reset URL: ${resetUrl}`);
  }
  try {
    await sendEmail(user.email, {
      subject: "Reset your DermaCare password",
      body: `<p>Hi ${user.name},</p><p>You requested a password reset. This link expires in 1 hour:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you didn't request this, you can safely ignore this email.</p>`,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    logger.error(`Failed to send password reset email to ${user.email}: ${err.message}`);
    throw ApiError.internal("Failed to send password reset email. Please try again shortly.");
  }

  return { devResetToken: config.isProd ? undefined : rawToken };
};

export const resetPassword = async (rawToken, newPassword) => {
  const hashedToken = hashToken(rawToken);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user) {
    throw ApiError.badRequest("Password reset link is invalid or has expired.");
  }

  user.password = newPassword;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();

  logger.info(`Password reset completed: ${user.email}`);
  return user;
};
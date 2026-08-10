import crypto from "crypto";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcryptjs";
import ResetPassword from "../models/ResetPassword.js";
import sentEmail from "../utils/email.js";
import config from "../config/config.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

const buildAuthPayload = (user) => ({
  id: user._id.toString(),
  role: user.role,
});

const login = async (data) => {
  const user = await User.findOne({ email: data.email }).select("+password");

  if (!user) throw { statusCode: 404, message: "User not found" };

  const isPasswordMatch = await bcrypt.compareSync(
    data.password,
    user.password,
  );

  if (!isPasswordMatch) throw { statusCode: 401, message: "Invalid password" };

  // const accessToken = generateAccessToken(buildAuthPayload(user));
  // const refreshToken = generateRefreshToken(buildAuthPayload(user));

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    address: user.address,
    phone: user.phone,
    role: user.role,
  };
};

const register = async (data) => {
  const user = await User.findOne({ email: data.email });

  if (user) throw { statusCode: 400, message: "Email already exists" };

  const hashedPassword = bcrypt.hashSync(data.password, 10);

  const registeredUser = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    address: data.address,
    phone: data.phone,
  });

  await sentEmail(registeredUser.email, {
    subject: "Welcome to DermaCare",
    body: `<div><h1>Welcome, ${registeredUser.name}!</h1><p>Thanks for joining DermaCare.</p></div>`,
  }).catch((err) => console.error("Welcome email failed:", err.message));

  const accessToken = generateAccessToken(buildAuthPayload(registeredUser._id));
  const refreshToken = generateRefreshToken(
    buildAuthPayload(registeredUser._id),
  );

  return {
    user: {
      _id: registeredUser._id,
      name: registeredUser.name,
      email: registeredUser.email,
      address: registeredUser.address,
      phone: registeredUser.phone,
      role: registeredUser.role,
    },
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (incomingToken) => {
  if (!incomingToken)
    throw { statusCode: 401, message: "Refresh token missing" };

  let decoded;
  try {
    decoded = verifyRefreshToken(incomingToken);
  } catch {
    throw { statusCode: 401, message: "Invalid or expired refresh token" };
  }

  const user = await User.findById(decoded.id);
  if (!user) throw { statusCode: 401, message: "User no longer exists" };

  const accessToken = generateAccessToken(buildAuthPayload(user));
  return { accessToken };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) throw { statusCode: 404, message: "User not found" };

  const token = crypto.randomUUID();

  await ResetPassword.create({
    userId: user._id,
    token,
  });

  await sentEmail(email, {
    subject: "Reset Password",
    body: `<div>
      <h1>Please click the link below to reset your password:</h1>
      <a href="${config.appURL}/reset-password?token=${token}&userId=${user._id}"
      style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; display: inline-block;">Reset Password</a>
    </div>`,
  });

  return { message: "Reset password email sent" };
};

const resetPassword = async (data) => {
  const { token, userId, newPassword } = data;

  const resetRecord = await ResetPassword.findOne({
    userId,
    expiresAt: { $gt: Date.now() },
    isUsed: false,
  }).sort({ expiresAt: -1 });

  if (!resetRecord || resetRecord.token !== token) {
    throw { statusCode: 400, message: "Invalid or expired token." };
  }

  if (resetRecord.isUsed) {
    throw { statusCode: 400, message: "Token already used." };
  }

  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  await User.findByIdAndUpdate(userId, { password: hashedPassword });

  await ResetPassword.findByIdAndUpdate(resetRecord._id, { isUsed: true });

  return { message: "Password reset successfully" };
};

export default {
  register,
  login,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
};

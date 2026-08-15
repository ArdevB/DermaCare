import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

export const listUsers = async ({ page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(),
  ]);
  return { users, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } };
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw ApiError.notFound("User not found.");
  return user;
};

export const updateUserRole = async (id, role, requestingUser) => {
  if (id === requestingUser._id.toString()) {
    throw ApiError.badRequest("You cannot change your own role.");
  }
  const user = await User.findById(id);
  if (!user) throw ApiError.notFound("User not found.");

  user.role = role;
  await user.save();
  return user;
};

export const deleteUser = async (id, requestingUser) => {
  if (id === requestingUser._id.toString()) {
    throw ApiError.badRequest("You cannot delete your own account.");
  }
  const user = await User.findById(id);
  if (!user) throw ApiError.notFound("User not found.");
  await user.deleteOne();
};

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import * as userService from "../services/userService.js";

export const getUsers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await userService.listUsers({ page: page ? Number(page) : 1, limit: limit ? Number(limit) : 20 });
  res.status(200).json(new ApiResponse(200, result));
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json(new ApiResponse(200, { user }));
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await userService.updateUserRole(req.params.id, req.body.role, req.user);
  res.status(200).json(new ApiResponse(200, { user }, "User role updated."));
});

export const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, null, "User deleted."));
});

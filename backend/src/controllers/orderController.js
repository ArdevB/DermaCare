import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import * as orderService from "../services/orderService.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;
  const order = await orderService.createOrderFromCart(req.user._id, { shippingAddress, paymentMethod });
  res.status(201).json(new ApiResponse(201, { order }, "Order placed successfully."));
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getUserOrders(req.user._id);
  res.status(200).json(new ApiResponse(200, { orders }));
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, { order }));
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelOrder(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, { order }, "Order cancelled."));
});

// --- Admin ---

export const getAllOrders = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;
  const result = await orderService.listAllOrders({
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 20,
    status,
  });
  res.status(200).json(new ApiResponse(200, result));
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
  res.status(200).json(new ApiResponse(200, { order }, "Order status updated."));
});

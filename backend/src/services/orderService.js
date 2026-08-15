import mongoose from "mongoose";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

const FLAT_SHIPPING_FEE = 5; // simple placeholder; swap for real shipping logic later

/**
 * Generates a collision-safe order number: DATE + short random suffix,
 * verified unique against the DB rather than relying on client input or a naive counter.
 */
const generateOrderNumber = async () => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
    const candidate = `DC-${datePart}-${suffix}`;
    // eslint-disable-next-line no-await-in-loop
    const exists = await Order.exists({ orderNumber: candidate });
    if (!exists) return candidate;
  }
  throw ApiError.internal("Failed to generate a unique order number. Please try again.");
};

export const createOrderFromCart = async (userId, { shippingAddress, paymentMethod }) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart || cart.items.length === 0) {
    throw ApiError.badRequest("Your cart is empty.");
  }

  const session = await mongoose.startSession();
  try {
    let order;
    await session.withTransaction(async () => {
      const orderItems = [];
      let itemsTotal = 0;

      for (const cartItem of cart.items) {
        const product = await Product.findById(cartItem.product._id).session(session);
        if (!product || !product.isActive) {
          throw ApiError.badRequest(`Product "${cartItem.product.name}" is no longer available.`);
        }
        if (product.stock < cartItem.quantity) {
          throw ApiError.badRequest(`Insufficient stock for "${product.name}".`);
        }

        // Price always comes from the current backend record, never the client/cart snapshot.
        orderItems.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: cartItem.quantity,
        });
        itemsTotal += product.price * cartItem.quantity;

        product.stock -= cartItem.quantity;
        await product.save({ session });
      }

      const orderNumber = await generateOrderNumber();
      const totalAmount = itemsTotal + FLAT_SHIPPING_FEE;

      const created = await Order.create(
        [
          {
            orderNumber,
            user: userId,
            items: orderItems,
            shippingAddress,
            itemsTotal,
            shippingFee: FLAT_SHIPPING_FEE,
            totalAmount,
            payment: { method: paymentMethod },
          },
        ],
        { session }
      );
      order = created[0];

      cart.items = [];
      await cart.save({ session });
    });

    logger.info(`Order created: ${order.orderNumber} for user ${userId}`);
    return order;
  } finally {
    session.endSession();
  }
};

export const getUserOrders = async (userId) => {
  return Order.find({ user: userId }).sort({ createdAt: -1 });
};

export const getOrderById = async (orderId, requestingUser) => {
  const order = await Order.findById(orderId).populate("user", "name email");
  if (!order) throw ApiError.notFound("Order not found.");

  const isOwner = order.user._id.toString() === requestingUser._id.toString();
  if (!isOwner && requestingUser.role !== "admin") {
    throw ApiError.forbidden("You do not have access to this order.");
  }
  return order;
};

export const listAllOrders = async ({ page = 1, limit = 20, status }) => {
  const query = {};
  if (status) query.status = status;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(query).populate("user", "name email").sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(query),
  ]);

  return { orders, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } };
};

export const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound("Order not found.");

  if (order.status === "cancelled" || order.status === "delivered") {
    throw ApiError.badRequest(`Cannot change status of a ${order.status} order.`);
  }

  order.status = status;
  if (status === "delivered" && order.payment.method === "cod") {
    order.payment.status = "paid";
    order.payment.paidAt = new Date();
  }
  await order.save();
  logger.info(`Order ${order.orderNumber} status updated to ${status}`);
  return order;
};

export const cancelOrder = async (orderId, requestingUser) => {
  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound("Order not found.");

  const isOwner = order.user.toString() === requestingUser._id.toString();
  if (!isOwner && requestingUser.role !== "admin") {
    throw ApiError.forbidden("You do not have access to this order.");
  }
  if (["shipped", "delivered", "cancelled"].includes(order.status)) {
    throw ApiError.badRequest(`Cannot cancel an order that is already ${order.status}.`);
  }

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } }, { session });
      }
      order.status = "cancelled";
      await order.save({ session });
    });
  } finally {
    session.endSession();
  }

  return order;
};

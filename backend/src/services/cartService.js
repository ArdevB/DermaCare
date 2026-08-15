import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

export const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  await cart.populate({ path: "items.product", populate: { path: "category", select: "name slug" } });
  return cart;
};

export const addItem = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw ApiError.notFound("Product not found.");
  }

  const cart = await getOrCreateCart(userId);
  const existingItem = cart.items.find((item) => item.product.toString() === productId);
  const desiredQty = (existingItem?.quantity || 0) + quantity;

  if (desiredQty > product.stock) {
    throw ApiError.badRequest(`Only ${product.stock} unit(s) of "${product.name}" available in stock.`);
  }

  if (existingItem) {
    existingItem.quantity = desiredQty;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  return getCart(userId);
};

export const updateItemQuantity = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) throw ApiError.notFound("Product not found.");

  if (quantity > product.stock) {
    throw ApiError.badRequest(`Only ${product.stock} unit(s) of "${product.name}" available in stock.`);
  }

  const cart = await getOrCreateCart(userId);
  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) throw ApiError.notFound("Item not found in cart.");

  item.quantity = quantity;
  await cart.save();
  return getCart(userId);
};

export const removeItem = async (userId, productId) => {
  const cart = await getOrCreateCart(userId);
  const initialLength = cart.items.length;
  cart.items = cart.items.filter((item) => item.product.toString() !== productId);

  if (cart.items.length === initialLength) {
    throw ApiError.notFound("Item not found in cart.");
  }

  await cart.save();
  return getCart(userId);
};

export const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  await cart.save();
  return cart;
};

import mongoose from "mongoose";
import {
  ORDER_STATUS_VALUES,
  ORDER_STATUSES,
} from "../constants/orderStatuses.js";
import { PAYMENT_METHOD_VALUES } from "../constants/paymentMethods.js";
import {
  PAYMENT_STATUS_VALUES,
  PAYMENT_STATUSES,
} from "../constants/paymentStatuses.js";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    phone: { type: String, required: true },
    province: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    landmark: { type: String },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true, // Ensure order number is unique Eg. #12345
    },
    items: {
      type: [orderItemSchema],
      validate: [(arr) => arr.length > 0, "Order must have at least one item"],
    },
    shippingAddress: shippingAddressSchema,

    paymentMethod: {
      type: String,
      enum: PAYMENT_METHOD_VALUES,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUS_VALUES,
      default: PAYMENT_STATUSES.PENDING,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
    status: {
      type: String,
      enum: ORDER_STATUS_VALUES,
      default: ORDER_STATUSES.PENDING,
    },
    statusHistory: [
      {
        status: { type: String, enum: ORDER_STATUS_VALUES },
        changedAt: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],

    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
    cancelReason: { type: String },
  },
  { timestamps: true },
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;

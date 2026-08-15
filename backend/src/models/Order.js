import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true }, // snapshot at time of order
    price: { type: Number, required: true }, // snapshot at time of order (backend-derived, never trust client)
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      validate: [(arr) => arr.length > 0, "Order must contain at least one item"],
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    itemsTotal: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, required: true, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    payment: {
      method: {
        type: String,
        enum: ["cod", "bank_transfer", "khalti"],
        default: "cod",
      },
      status: {
        type: String,
        // pending: not yet paid. pending_verification: bank transfer proof
        // submitted, awaiting admin review. paid/failed/refunded: final states.
        enum: ["pending", "pending_verification", "paid", "failed", "refunded"],
        default: "pending",
      },
      transactionId: { type: String, default: null },
      paidAt: { type: Date, default: null },

      // Khalti-specific: the payment identifier Khalti issues when a payment
      // is initiated, used to look up its status afterward.
      khaltiPidx: { type: String, default: null },

      // Bank-transfer-specific
      bankTransfer: {
        referenceNumber: { type: String, default: null },
        receipt: {
          url: { type: String, default: null },
          publicId: { type: String, default: null },
        },
        submittedAt: { type: Date, default: null },
        verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        verifiedAt: { type: Date, default: null },
        rejectionReason: { type: String, default: null },
      },
    },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;

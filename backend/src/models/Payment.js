import mongoose from "mongoose";
import { PAYMENT_METHOD_VALUES } from "../constants/paymentMethods.js";
import {
  PAYMENT_STATUS_VALUES,
  PAYMENT_STATUSES,
} from "../constants/paymentStatuses.js";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    method: {
      type: String,
      required: [true, "Payment method is required"],
      enum: PAYMENT_METHOD_VALUES,
    },
    status: {
      type: String,
      enum: PAYMENT_STATUS_VALUES,
      default: PAYMENT_STATUSES.PENDING,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },

    // Gateway-specific identifiers
    transactionId: { type: String }, // Khalti's pidx, eSewa's transaction_uuid
    gatewayReferenceId: { type: String }, // Khalti's transaction_id / eSewa's ref_id after verify

    // Raw response stored for debugging/audit — never trust this blindly, always re-verify server-side
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    paidAt: { type: Date },
    failureReason: { type: String },
  },
  { timestamps: true },
);

paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ order: 1 });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;

import mongoose from "mongoose";

const resetPasswordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: [true, "Reset password token is required"],
    },
    expiresAt: {
      type: Date,
      default: () => Date.now() + 3600000, // 1 hour from now
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Auto-delete expired tokens from the collection via TTL index
resetPasswordSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const ResetPassword = mongoose.model("ResetPassword", resetPasswordSchema);
export default ResetPassword;

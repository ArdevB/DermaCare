import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

// A user can favourite a given product only once.
favouriteSchema.index({ user: 1, product: 1 }, { unique: true });

const Favourite = mongoose.model("Favourite", favouriteSchema);
export default Favourite;

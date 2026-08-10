import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    brand: {
      type: String,
      required: [true, "Product brand is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    description: {
      type: String,
      default: "", //Auto fill by gemini
    },
    isDescriptionAiGenerated: {
      type: Boolean,
      default: false,
    },
    shortDescription: {
      type: String,
      maxlength: 300,
    },

    // Metadata Gemini uses to write the description + power recommendations
    ingredients: [{ type: String }],
    skinType: [
      {
        type: String,
        enum: ["oily", "dry", "combination", "normal", "sensitive", "all"],
      },
    ],
    hairType: [
      {
        type: String,
        enum: ["straight", "wavy", "curly", "coily", "all"],
      },
    ],
    concerns: [{ type: String }], // "acne", "anti-aging", "hydration", "hairfall"...

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Product price can't be negative"],
    },
    discountPrice: { type: Number, min: 0, default: null },
    stock: { type: Number, required: true, min: 0, default: 0 },
    ratings: {
      average: { type: Number, default: 0, min: 0 },
      count: { type: Number, default: 0 },
    },

    images: [imageSchema],

    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

productSchema.index({ name: "text", description: "text", brand: "text" });
productSchema.index({ category: 1 });
productSchema.index({ slug: 1 });

// Virtual: effective selling price
productSchema.virtual("finalPrice").get(function () {
  return this.discountPrice && this.discountPrice < this.price
    ? this.discountPrice
    : this.price;
});
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

const Product = mongoose.model("Product", productSchema);
export default Product;

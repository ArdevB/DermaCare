import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    enum: ["Skin Care", "Hair Care", "Makeup", "Body Care"],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null, // supports subcategories later, e.g. "Serums" under "Skin Care"
  },
  description: {
    type: String,
    default: "",
  },
  image: {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  timestamps: true,
});

categorySchema.index({ slug: 1 });

const Category = mongoose.model("Category", categorySchema);
export default Category;

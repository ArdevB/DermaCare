import Category from "../models/Category.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import { uploadImage, deleteImage, replaceImage } from "./cloudinaryService.js";

export const listCategories = async () => {
  return Category.find({ isActive: true }).sort({ name: 1 });
};

export const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw ApiError.notFound("Category not found.");
  return category;
};

export const createCategory = async (data, file) => {
  const existing = await Category.findOne({ name: data.name });
  if (existing) throw ApiError.conflict("A category with this name already exists.");

  let image = { url: null, publicId: null };
  if (file) {
    image = await uploadImage(file.buffer, "dermacare/categories");
  }

  return Category.create({ ...data, image });
};

export const updateCategory = async (id, data, file) => {
  const category = await Category.findById(id);
  if (!category) throw ApiError.notFound("Category not found.");

  if (file) {
    const uploaded = await replaceImage(file.buffer, category.image?.publicId, "dermacare/categories");
    data.image = uploaded;
  }

  Object.assign(category, data);
  await category.save();
  return category;
};

export const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw ApiError.notFound("Category not found.");

  const productsUsingCategory = await Product.countDocuments({ category: id, isActive: true });
  if (productsUsingCategory > 0) {
    throw ApiError.conflict(
      `Cannot delete category: ${productsUsingCategory} active product(s) still reference it.`
    );
  }

  if (category.image?.publicId) {
    await deleteImage(category.image.publicId);
  }
  await category.deleteOne();
};

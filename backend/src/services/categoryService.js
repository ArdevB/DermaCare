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

export const createCategory = async (data, files) => {
  const existing = await Category.findOne({ name: data.name });
  if (existing)
    throw ApiError.conflict("A category with this name already exists.");

  let image = { url: null, publicId: null };
  let banner = { url: null, publicId: null };
  const imageFile = files?.image?.[0];
  const bannerFile = files?.banner?.[0];
  if (imageFile) {
    image = await uploadImage(imageFile.buffer, "dermacare/categories");
  }
  if (bannerFile) {
    banner = await uploadImage(
      bannerFile.buffer,
      "dermacare/categories/banners",
    );
  }

  return Category.create({ ...data, image, banner });
};

export const updateCategory = async (id, data, files) => {
  const category = await Category.findById(id);
  if (!category) throw ApiError.notFound("Category not found.");

  const imageFile = files?.image?.[0];
  const bannerFile = files?.banner?.[0];

  if (imageFile) {
    data.image = await replaceImage(
      imageFile.buffer,
      category.image?.publicId,
      "dermacare/categories",
    );
  }
  if (bannerFile) {
    data.banner = await replaceImage(
      bannerFile.buffer,
      category.banner?.publicId,
      "dermacare/categories/banners",
    );
  }

  Object.assign(category, data);
  await category.save();
  return category;
};

export const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw ApiError.notFound("Category not found.");

  const productsUsingCategory = await Product.countDocuments({
    category: id,
    isActive: true,
  });
  if (productsUsingCategory > 0) {
    throw ApiError.conflict(
      `Cannot delete category: ${productsUsingCategory} active product(s) still reference it.`,
    );
  }

  if (category.image?.publicId) {
    await deleteImage(category.image.publicId);
  }
  if (category.banner?.publicId) {
    await deleteImage(category.banner.publicId);
  }
  await category.deleteOne();
};

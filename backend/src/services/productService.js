import Product from "../models/Product.js";
import Category from "../models/Category.js";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";
import { generateProductDescription } from "./geminiService.js";
import { uploadImages, deleteImages } from "./cloudinaryService.js";

const isBlank = (str) => str === undefined || str === null || String(str).trim() === "";

export const listProducts = async ({ page = 1, limit = 20, category, search, minPrice, maxPrice, sort }) => {
  const query = { isActive: true };
  if (category) query.category = category;
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = minPrice;
    if (maxPrice !== undefined) query.price.$lte = maxPrice;
  }
  if (search) {
    query.$text = { $search: search };
  }

  const skip = (page - 1) * limit;

  const sortMap = {
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    newest: { createdAt: -1 },
    rating: { "ratings.average": -1 },
  };
  const sortOption = sortMap[sort] || { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(query).populate("category", "name slug").sort(sortOption).skip(skip).limit(limit),
    Product.countDocuments(query),
  ]);

  return {
    products,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  };
};

export const getProductById = async (id) => {
  const product = await Product.findById(id).populate("category", "name slug");
  if (!product || !product.isActive) {
    throw ApiError.notFound("Product not found.");
  }
  return product;
};

export const createProduct = async (data, files = []) => {
  const category = await Category.findById(data.category);
  if (!category) {
    throw ApiError.badRequest("Category does not exist.");
  }

  let { description } = data;
  let descriptionGeneratedByAI = false;

  // Gemini is called only when the description is missing/empty/whitespace-only.
  if (isBlank(description)) {
    description = await generateProductDescription({
      name: data.name,
      brand: data.brand,
      category: category.name,
      ingredients: data.ingredients || [],
      features: data.features || [],
      benefits: data.benefits || [],
    });
    descriptionGeneratedByAI = true;
  }

  let images = [];
  if (files.length > 0) {
    images = await uploadImages(files);
  }

  const product = await Product.create({
    ...data,
    description,
    descriptionGeneratedByAI,
    images,
  });

  logger.info(`Product created: ${product.name} (${product._id})`);
  return product;
};

export const updateProduct = async (id, data, files = []) => {
  const product = await Product.findById(id);
  if (!product) {
    throw ApiError.notFound("Product not found.");
  }

  if (data.category) {
    const category = await Category.findById(data.category);
    if (!category) {
      throw ApiError.badRequest("Category does not exist.");
    }
  }

  // description handling:
  // - key not sent at all  -> leave existing description untouched, no Gemini call
  // - key sent but blank   -> treat as "removed", regenerate via Gemini
  // - key sent with content -> use as-is, no Gemini call
  if (Object.prototype.hasOwnProperty.call(data, "description")) {
    if (isBlank(data.description)) {
      const categoryDoc = data.category
        ? await Category.findById(data.category)
        : await Category.findById(product.category);

      data.description = await generateProductDescription({
        name: data.name || product.name,
        brand: data.brand !== undefined ? data.brand : product.brand,
        category: categoryDoc?.name,
        ingredients: data.ingredients || product.ingredients,
        features: data.features || product.features,
        benefits: data.benefits || product.benefits,
      });
      data.descriptionGeneratedByAI = true;
    } else {
      data.descriptionGeneratedByAI = false;
    }
  }

  if (files.length > 0) {
    const newImages = await uploadImages(files);
    data.images = [...product.images, ...newImages];
  }

  Object.assign(product, data);
  await product.save();

  logger.info(`Product updated: ${product.name} (${product._id})`);
  return product;
};

export const deleteProductImage = async (productId, publicId) => {
  const product = await Product.findById(productId);
  if (!product) throw ApiError.notFound("Product not found.");

  const imageExists = product.images.some((img) => img.publicId === publicId);
  if (!imageExists) throw ApiError.notFound("Image not found on this product.");

  await deleteImages([publicId]);
  product.images = product.images.filter((img) => img.publicId !== publicId);
  await product.save();
  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw ApiError.notFound("Product not found.");
  }

  // Soft delete keeps order history (which references product ids) intact.
  product.isActive = false;
  await product.save();

  logger.info(`Product deactivated: ${product.name} (${product._id})`);
  return product;
};

export const hardDeleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw ApiError.notFound("Product not found.");

  await deleteImages(product.images.map((img) => img.publicId));
  await product.deleteOne();
  logger.info(`Product permanently deleted: ${id}`);
};

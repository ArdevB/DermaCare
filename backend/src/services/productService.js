import Product from "../models/Product.js";
import Category from "../models/Category.js";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";
import { generateProductCopy } from "./geminiService.js";
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

const isEmptyList = (arr) => !Array.isArray(arr) || arr.length === 0;

export const createProduct = async (data, files = []) => {
  const category = await Category.findById(data.category);
  if (!category) {
    throw ApiError.badRequest("Category does not exist.");
  }

  let { description, features, benefits } = data;
  let descriptionGeneratedByAI = false;
  let featuresGeneratedByAI = false;
  let benefitsGeneratedByAI = false;

  const needsDescription = isBlank(description);
  const needsFeatures = isEmptyList(features);
  const needsBenefits = isEmptyList(benefits);

  // One combined Gemini call covers whichever of the three are blank, so
  // description/features/benefits stay consistent in tone rather than being
  // generated independently across separate calls.
  if (needsDescription || needsFeatures || needsBenefits) {
    const generated = await generateProductCopy({
      name: data.name,
      brand: data.brand,
      category: category.name,
      ingredients: data.ingredients || [],
    });

    if (needsDescription) {
      description = generated.description;
      descriptionGeneratedByAI = true;
    }
    if (needsFeatures) {
      features = generated.features;
      featuresGeneratedByAI = true;
    }
    if (needsBenefits) {
      benefits = generated.benefits;
      benefitsGeneratedByAI = true;
    }
  }

  let images = [];
  if (files.length > 0) {
    images = await uploadImages(files);
  }

  const product = await Product.create({
    ...data,
    description,
    descriptionGeneratedByAI,
    features,
    featuresGeneratedByAI,
    benefits,
    benefitsGeneratedByAI,
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

  // description/features/benefits handling, each independently:
  // - key not sent at all  -> leave existing value untouched, no Gemini call
  // - key sent but blank/empty -> treat as "removed", regenerate via Gemini
  // - key sent with content -> use as-is, no Gemini call
  const sentDescription = Object.prototype.hasOwnProperty.call(data, "description");
  const sentFeatures = Object.prototype.hasOwnProperty.call(data, "features");
  const sentBenefits = Object.prototype.hasOwnProperty.call(data, "benefits");

  const needsDescription = sentDescription && isBlank(data.description);
  const needsFeatures = sentFeatures && isEmptyList(data.features);
  const needsBenefits = sentBenefits && isEmptyList(data.benefits);

  if (needsDescription || needsFeatures || needsBenefits) {
    const categoryDoc = data.category
      ? await Category.findById(data.category)
      : await Category.findById(product.category);

    const generated = await generateProductCopy({
      name: data.name || product.name,
      brand: data.brand !== undefined ? data.brand : product.brand,
      category: categoryDoc?.name,
      ingredients: data.ingredients || product.ingredients,
    });

    if (needsDescription) {
      data.description = generated.description;
      data.descriptionGeneratedByAI = true;
    }
    if (needsFeatures) {
      data.features = generated.features;
      data.featuresGeneratedByAI = true;
    }
    if (needsBenefits) {
      data.benefits = generated.benefits;
      data.benefitsGeneratedByAI = true;
    }
  }
  if (sentDescription && !needsDescription) data.descriptionGeneratedByAI = false;
  if (sentFeatures && !needsFeatures) data.featuresGeneratedByAI = false;
  if (sentBenefits && !needsBenefits) data.benefitsGeneratedByAI = false;

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

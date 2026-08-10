import Product from "../models/Product.js";
import uploadFile from "../utils/file.js";
import { ADMIN } from "../constants/roles.js";

const getProducts = async (req, res) => {
  const {
    name,
    brands,
    category,
    subCategory,
    min,
    max,
    limit,
    offset,
    createdBy,
  } = query;

  const sort = JSON.parse(query.sort || "{}");
  const filters = {};

  if (brands) filters.brand = { $in: brands.split(",") };
  if (category) filters.category = category;
  if (subCategory) filters.subCategory = subCategory;
  if (min) filters.price = { $gte: min };
  if (max) filters.price = { ...filters.price, $lte: max };
  if (name) filters.name = { $regex: name, $options: "i" };

  if (createdBy) filters.createdBy = createdBy;

  const products = await Product.find(filters)
    .sort(sort)
    .limit(limit)
    .skip(offset);

  return products;
};

const getProductById = async (id) => {
  const product = await Product.findById(id);

  if (!product) {
    throw {
      statusCode: 404,
      message: "Product not found",
    };
  }

  if (product.stock <= 0) {
    throw {
      statusCode: 404,
      message: "Product not available in stock",
    };
  }

  return product;
};

const createProduct = async (data, files, createdBy) => {
  const uploadedFiles = await uploadFile(files);

  const promptMessage = PRODUCT_DESCRIPTION_PROMPT.replace("%s", data.brand)
    .replace("%s", data.name)
    .replace("%s", data.price)
    .replace("%s", data.category);

  const description = data.description ?? (await promptGemini(promptMessage));

  const createdProduct = await Product.create({
    ...data,
    createdBy: createdBy,
    imageUrls: uploadedFiles.map((item) => item?.url),
    description,
  });

  return createdProduct;
};

const updateProduct = async (id, data, files, user) => {
  const product = await getProductById(id);

  if (product.createdBy != user._id && !user.roles.includes(ADMIN)) {
    throw {
      statusCode: 403,
      message: "Access denied.",
    };
  }

  const updateData = data;

  if (files && files.length > 0) {
    const uploadedFiles = await uploadFile(files);
    updateData.imageUrls = uploadedFiles.map((item) => item?.url);
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, data, {
    new: true,
  });

  return updatedProduct;
};

const deleteProduct = async (id, user) => {
  const product = await getProductById(id);

  if (product.createdBy != user._id && !req.user.roles.includes(ADMIN)) {
    throw {
      statusCode: 403,
      message: "Access denied.",
    };
  }

  await Product.findByIdAndDelete(id);
};

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

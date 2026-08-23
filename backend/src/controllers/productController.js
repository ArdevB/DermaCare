import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import * as productService from "../services/productService.js";

export const getProducts = asyncHandler(async (req, res) => {
  const { page, limit, category, brand, search, minPrice, maxPrice, sort } =
    req.query;
  const result = await productService.listProducts({
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 20,
    category,
    brand,
    search,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort,
  });
  res.status(200).json(new ApiResponse(200, result));
});

export const getBrands = asyncHandler(async (req, res) => {
  const brands = await productService.listDistinctBrands(req.query.category);
  res.status(200).json(new ApiResponse(200, { brands }));
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.status(200).json(new ApiResponse(200, { product }));
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body, req.files || []);
  res
    .status(201)
    .json(new ApiResponse(201, { product }, "Product created successfully."));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(
    req.params.id,
    req.body,
    req.files || [],
  );
  res
    .status(200)
    .json(new ApiResponse(200, { product }, "Product updated successfully."));
});

export const deleteProductImage = asyncHandler(async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) throw ApiError.badRequest("publicId is required.");
  const product = await productService.deleteProductImage(
    req.params.id,
    publicId,
  );
  res.status(200).json(new ApiResponse(200, { product }, "Image removed."));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully."));
});

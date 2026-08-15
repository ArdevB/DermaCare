import Favourite from "../models/Favourite.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";

export const addFavourite = async (userId, productId) => {
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw ApiError.notFound("Product not found.");
  }

  try {
    const favourite = await Favourite.create({ user: userId, product: productId });
    return favourite;
  } catch (err) {
    if (err.code === 11000) {
      throw ApiError.conflict("Product is already in favourites.");
    }
    throw err;
  }
};

export const removeFavourite = async (userId, productId) => {
  const result = await Favourite.findOneAndDelete({ user: userId, product: productId });
  if (!result) {
    throw ApiError.notFound("Favourite not found.");
  }
};

export const listFavourites = async (userId) => {
  return Favourite.find({ user: userId }).populate({
    path: "product",
    populate: { path: "category", select: "name slug" },
  });
};

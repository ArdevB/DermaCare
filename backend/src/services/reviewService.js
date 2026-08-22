import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import ApiError from "../utils/ApiError.js";

const recomputeProductRatings = async (productId) => {
  const [stats] = await Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        average: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  await Product.findByIdAndUpdate(productId, {
    "ratings.average": stats ? Math.round(stats.average * 10) / 10 : 0,
    "ratings.count": stats ? stats.count : 0,
  });
};

export const upsertReview = async (userId, productId, { rating, comment }) => {
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw ApiError.notFound("Product not found.");
  }

  const verifiedPurchase = await Order.exists({
    user: userId,
    status: "delivered",
    "items.product": productId,
  });

  const review = await Review.findOneAndUpdate(
    { user: userId, product: productId },
    { rating, comment, verifiedPurchase: !!verifiedPurchase },
    { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true },
  ).populate({ path: "user", select: "name" });

  await recomputeProductRatings(productId);

  return review;
};

export const listReviewsForProduct = async (
  productId,
  { page = 1, limit = 10 } = {},
) => {
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(50, Math.max(1, Number(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [reviews, total] = await Promise.all([
    Review.find({ product: productId })
      .populate({ path: "user", select: "name" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Review.countDocuments({ product: productId }),
  ]);

  return {
    reviews,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum) || 1,
    },
  };
};

export const getMyReview = async (userId, productId) => {
  return Review.findOne({ user: userId, product: productId });
};

export const deleteReview = async (userId, productId) => {
  const result = await Review.findOneAndDelete({
    user: userId,
    product: productId,
  });
  if (!result) {
    throw ApiError.notFound("Review not found.");
  }
  await recomputeProductRatings(productId);
};

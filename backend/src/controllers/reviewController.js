import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import * as reviewService from "../services/reviewService.js";

export const listReviews = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await reviewService.listReviewsForProduct(
    req.params.productId,
    { page, limit },
  );
  res.status(200).json(new ApiResponse(200, result));
});

export const getMyReview = asyncHandler(async (req, res) => {
  const review = await reviewService.getMyReview(
    req.user._id,
    req.params.productId,
  );
  res.status(200).json(new ApiResponse(200, { review }));
});

export const upsertReview = asyncHandler(async (req, res) => {
  const review = await reviewService.upsertReview(
    req.user._id,
    req.params.productId,
    req.body,
  );
  res.status(200).json(new ApiResponse(200, { review }, "Review saved."));
});

export const deleteReview = asyncHandler(async (req, res) => {
  await reviewService.deleteReview(req.user._id, req.params.productId);
  res.status(200).json(new ApiResponse(200, null, "Review deleted."));
});

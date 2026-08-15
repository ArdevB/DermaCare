import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import * as favouriteService from "../services/favouriteService.js";

export const getFavourites = asyncHandler(async (req, res) => {
  const favourites = await favouriteService.listFavourites(req.user._id);
  res.status(200).json(new ApiResponse(200, { favourites }));
});

export const addFavourite = asyncHandler(async (req, res) => {
  const favourite = await favouriteService.addFavourite(req.user._id, req.params.productId);
  res.status(201).json(new ApiResponse(201, { favourite }, "Added to favourites."));
});

export const removeFavourite = asyncHandler(async (req, res) => {
  await favouriteService.removeFavourite(req.user._id, req.params.productId);
  res.status(200).json(new ApiResponse(200, null, "Removed from favourites."));
});

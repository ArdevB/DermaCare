import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import config from "../config/config.js";
import * as paymentService from "../services/paymentService.js";

export const initiateKhalti = asyncHandler(async (req, res) => {
  const result = await paymentService.initiateKhaltiPayment(req.params.orderId, req.user);
  res.status(200).json(new ApiResponse(200, result, "Khalti payment initiated."));
});

// Khalti redirects the customer's browser here after they complete/cancel payment
// on Khalti's site - this route is public since the browser hits it directly,
// not authenticated via our own JWT.
export const khaltiCallback = asyncHandler(async (req, res) => {
  const { pidx } = req.query;
  if (!pidx) throw ApiError.badRequest("Missing pidx in Khalti callback.");

  const { order } = await paymentService.verifyKhaltiPayment(pidx);
  const redirectUrl = `${config.frontendUrl}/orders/${order._id}?paymentStatus=${order.payment.status}`;
  res.redirect(redirectUrl);
});

// Lets the frontend poll payment status directly instead of relying solely on the redirect.
export const checkKhaltiStatus = asyncHandler(async (req, res) => {
  const result = await paymentService.verifyKhaltiPayment(req.params.pidx);
  res.status(200).json(new ApiResponse(200, result));
});

export const submitBankTransfer = asyncHandler(async (req, res) => {
  const order = await paymentService.submitBankTransferProof(
    req.params.orderId,
    req.user,
    req.body,
    req.file
  );
  res
    .status(200)
    .json(new ApiResponse(200, { order }, "Payment proof submitted. Awaiting verification."));
});

export const verifyBankTransfer = asyncHandler(async (req, res) => {
  const order = await paymentService.verifyBankTransferPayment(req.params.orderId, req.body, req.user);
  res.status(200).json(new ApiResponse(200, { order }, "Bank transfer payment reviewed."));
});

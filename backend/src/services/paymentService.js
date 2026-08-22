import config from "../config/config.js";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";
import Order from "../models/Order.js";
import { uploadImage } from "./cloudinaryService.js";

const khaltiBaseUrl = () => config.khalti.baseUrl.replace(/\/+$/, "");

const assertKhaltiConfigured = () => {
  if (!config.khalti.isConfigured) {
    throw ApiError.internal(
      "Khalti payments are unavailable: KHALTI_SECRET_KEY is not configured on the server.",
    );
  }
};

const getOwnedOrder = async (orderId, user) => {
  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound("Order not found.");

  const isOwner = order.user.toString() === user._id.toString();
  if (!isOwner && user.role !== "admin") {
    throw ApiError.forbidden("You do not have access to this order.");
  }
  return order;
};

/**
 * Starts a Khalti ePayment (v2) transaction for an order and returns the
 * URL the frontend should redirect the customer to.
 * https://docs.khalti.com/khalti-epayment/
 */
export const initiateKhaltiPayment = async (orderId, user) => {
  assertKhaltiConfigured();

  const order = await getOwnedOrder(orderId, user);

  if (order.payment.method !== "khalti") {
    throw ApiError.badRequest(
      `This order's payment method is '${order.payment.method}', not khalti.`,
    );
  }
  if (order.payment.status === "paid") {
    throw ApiError.badRequest("This order has already been paid.");
  }

  const payload = {
    return_url: `${config.frontendUrl}/orders/${order._id}/payment-callback`,
    website_url: config.frontendUrl,
    amount: Math.round(order.totalAmount * 100), // Khalti expects amount in paisa (NPR x 100)
    purchase_order_id: order.orderNumber,
    purchase_order_name: `DermaCare Order ${order.orderNumber}`,
    customer_info: {
      name: user.name,
      email: user.email,
    },
  };

  const initiateUrl = `${khaltiBaseUrl()}/epayment/initiate/`;
  logger.info(`Initiating Khalti payment: POST ${initiateUrl}`);

  let response;
  try {
    response = await fetch(initiateUrl, {
      method: "POST",
      headers: {
        Authorization: `key ${config.khalti.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    logger.error(`Khalti initiate request failed: ${error.message}`);
    throw ApiError.internal(
      "Could not reach Khalti. Please try again shortly.",
    );
  }

  // Read the body as raw text first so a non-JSON response (e.g. an HTML
  // "Not Found" page from a proxy/firewall, or an unexpected Khalti error
  // page) is still visible in the logs instead of silently becoming null.
  const rawBody = await response.text();
  let data = null;
  try {
    data = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    data = null;
  }

  if (!response.ok || !data?.payment_url) {
    logger.error(
      `Khalti initiate failed (${response.status}) for URL ${initiateUrl}. Raw response: ${rawBody?.slice(0, 500)}`,
    );
    throw ApiError.internal(
      data?.detail ||
        `Khalti request failed with status ${response.status}. Check server logs for the raw response body.`,
    );
  }

  order.payment.khaltiPidx = data.pidx;
  await order.save();

  logger.info(
    `Khalti payment initiated for order ${order.orderNumber} (pidx: ${data.pidx})`,
  );
  return { paymentUrl: data.payment_url, pidx: data.pidx };
};

/**
 * Looks up a Khalti payment's current status and updates the matching order.
 * Called both from the return-URL callback (browser redirect) and available
 * as a standalone endpoint the frontend can poll.
 */
export const verifyKhaltiPayment = async (pidx) => {
  assertKhaltiConfigured();

  const order = await Order.findOne({ "payment.khaltiPidx": pidx });
  if (!order) {
    throw ApiError.notFound("No order found for this Khalti payment.");
  }

  let response;
  const lookupUrl = `${khaltiBaseUrl()}/epayment/lookup/`;
  try {
    response = await fetch(lookupUrl, {
      method: "POST",
      headers: {
        Authorization: `key ${config.khalti.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pidx }),
    });
  } catch (error) {
    logger.error(`Khalti lookup request failed: ${error.message}`);
    throw ApiError.internal(
      "Could not reach Khalti to verify this payment. Please try again shortly.",
    );
  }

  const rawBody = await response.text();
  let data = null;
  try {
    data = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    data = null;
  }

  if (!response.ok || !data?.status) {
    logger.error(
      `Khalti lookup failed (${response.status}) for URL ${lookupUrl}. Raw response: ${rawBody?.slice(0, 500)}`,
    );
    throw ApiError.internal("Failed to verify Khalti payment status.");
  }

  if (data.status === "Completed") {
    order.payment.status = "paid";
    order.payment.transactionId = data.transaction_id || null;
    order.payment.paidAt = new Date();
    if (order.status === "pending") order.status = "processing";
  } else if (["Expired", "User canceled"].includes(data.status)) {
    order.payment.status = "failed";
  }
  // "Pending" / "Refunded" / other statuses: leave order as-is, caller can check again later.

  await order.save();

  logger.info(
    `Khalti payment checked for order ${order.orderNumber}: ${data.status}`,
  );
  return { order, khaltiStatus: data.status };
};

export const submitBankTransferProof = async (
  orderId,
  user,
  { referenceNumber },
  file,
) => {
  const order = await getOwnedOrder(orderId, user);

  if (order.payment.method !== "bank_transfer") {
    throw ApiError.badRequest(
      `This order's payment method is '${order.payment.method}', not bank_transfer.`,
    );
  }
  if (order.payment.status === "paid") {
    throw ApiError.badRequest("This order has already been paid.");
  }
  if (!file) {
    throw ApiError.badRequest("A receipt/proof-of-transfer image is required.");
  }

  const receipt = await uploadImage(file.buffer, "dermacare/payment-receipts");

  order.payment.bankTransfer = {
    referenceNumber,
    receipt,
    submittedAt: new Date(),
    verifiedBy: null,
    verifiedAt: null,
    rejectionReason: null,
  };
  order.payment.status = "pending_verification";
  await order.save();

  logger.info(`Bank transfer proof submitted for order ${order.orderNumber}`);
  return order;
};

export const verifyBankTransferPayment = async (
  orderId,
  { decision, rejectionReason },
  adminUser,
) => {
  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound("Order not found.");

  if (order.payment.method !== "bank_transfer") {
    throw ApiError.badRequest("This order is not a bank transfer payment.");
  }
  if (order.payment.status !== "pending_verification") {
    throw ApiError.badRequest(
      `Cannot verify a payment in '${order.payment.status}' status.`,
    );
  }

  if (decision === "approve") {
    order.payment.status = "paid";
    order.payment.paidAt = new Date();
    if (order.status === "pending") order.status = "processing";
  } else {
    order.payment.status = "failed";
    order.payment.bankTransfer.rejectionReason = rejectionReason;
  }
  order.payment.bankTransfer.verifiedBy = adminUser._id;
  order.payment.bankTransfer.verifiedAt = new Date();

  await order.save();
  logger.info(
    `Bank transfer for order ${order.orderNumber} ${decision}d by ${adminUser.email}`,
  );
  return order;
};

export const ORDER_STATUSES = Object.freeze({
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  RETURNED: "returned",
});

export const ORDER_STATUS_VALUES = Object.values(ORDER_STATUSES);

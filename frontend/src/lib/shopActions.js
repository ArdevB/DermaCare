import { api, apiFetch } from "@/lib/api";

export const createOrder = (shippingAddress, paymentMethod) =>
  api.post("/orders", { shippingAddress, paymentMethod });

export const cancelOrder = (orderId) => api.post(`/orders/${orderId}/cancel`);

export const submitBankTransfer = (orderId, referenceNumber, receiptFile) => {
  const fd = new FormData();
  fd.append("referenceNumber", referenceNumber);
  if (receiptFile) fd.append("receipt", receiptFile);
  return apiFetch(`/payments/${orderId}/bank-transfer`, {
    method: "POST",
    body: fd,
  });
};

export const initiateKhalti = (orderId) =>
  api.post(`/payments/${orderId}/khalti/initiate`);

export const checkKhaltiStatus = (pidx) =>
  api.get(`/payments/khalti/${pidx}/status`);

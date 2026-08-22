import { api } from "@/lib/api";

export const getProductReviews = (productId, params) =>
  api.get(`/reviews/${productId}`, params);
export const getMyReview = (productId) => api.get(`/reviews/${productId}/mine`);
export const upsertReview = (productId, { rating, comment }) =>
  api.post(`/reviews/${productId}`, { rating, comment });
export const deleteReview = (productId) => api.delete(`/reviews/${productId}`);

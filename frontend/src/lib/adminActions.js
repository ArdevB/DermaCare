import { api } from "@/lib/api";

export const updateOrderStatus = (id, status) =>
  api.put(`/orders/${id}/status`, { status });

export const verifyBankTransfer = (orderId, decision, rejectionReason) =>
  api.put(`/payments/${orderId}/bank-transfer/verify`, {
    decision,
    rejectionReason,
  });

export const updateUserRole = (id, role) =>
  api.put(`/users/${id}/role`, { role });

export const deleteUser = (id) => api.delete(`/users/${id}`);

function categoryFormData(values) {
  const fd = new FormData();
  fd.append("name", values.name);
  if (values.description) fd.append("description", values.description);
  if (values.isActive !== undefined)
    fd.append("isActive", String(values.isActive));
  if (values.image) fd.append("image", values.image);
  return fd;
}

export const createCategory = (values) =>
  api.post("/categories", categoryFormData(values));
export const updateCategory = (id, values) =>
  api.put(`/categories/${id}`, categoryFormData(values));
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

function productFormData(values) {
  const fd = new FormData();
  if (values.name !== undefined) fd.append("name", values.name);
  if (values.description !== undefined)
    fd.append("description", values.description);
  if (values.price !== undefined) fd.append("price", String(values.price));
  if (values.category !== undefined) fd.append("category", values.category);
  if (values.stock !== undefined) fd.append("stock", String(values.stock));
  if (values.brand !== undefined) fd.append("brand", values.brand);
  if (values.ingredients !== undefined)
    fd.append("ingredients", values.ingredients.join(","));
  if (values.features !== undefined)
    fd.append("features", values.features.join(","));
  if (values.benefits !== undefined)
    fd.append("benefits", values.benefits.join(","));
  (values.images ?? []).forEach((file) => fd.append("images", file));
  return fd;
}

export const createProduct = (values) =>
  api.post("/products", productFormData(values));
export const updateProduct = (id, values) =>
  api.put(`/products/${id}`, productFormData(values));
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const deleteProductImage = (id, publicId) =>
  api.delete(`/products/${id}/image`, { publicId });

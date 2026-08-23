"use client";

import { useApiQuery } from "@/hooks/useApiQuery";

export function usePublicProducts(params) {
  const { data, isLoading, error, refetch } = useApiQuery("/products", params);
  return {
    products: data?.products ?? [],
    pagination: data?.pagination ?? null,
    isLoading,
    error,
    refetch,
  };
}

export function usePublicProduct(id) {
  const { data, isLoading, error, refetch } = useApiQuery(
    id ? `/products/${id}` : null,
  );
  return { product: data?.product ?? null, isLoading, error, refetch };
}

export function usePublicCategories() {
  const { data, isLoading, error } = useApiQuery("/categories");
  return { categories: data?.categories ?? [], isLoading, error };
}

export function usePublicBrands(categoryId) {
  const { data, isLoading, error } = useApiQuery(
    "/products/brands",
    categoryId ? { category: categoryId } : undefined,
  );
  return { brands: data?.brands ?? [], isLoading, error };
}

export function useMyOrders() {
  const { data, isLoading, error, refetch } = useApiQuery("/orders/my");
  return { orders: data?.orders ?? [], isLoading, error, refetch };
}

export function useMyOrder(id) {
  const { data, isLoading, error, refetch } = useApiQuery(
    id ? `/orders/${id}` : null,
  );
  return { order: data?.order ?? null, isLoading, error, refetch };
}

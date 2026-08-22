"use client";

import { api } from "@/lib/api";
import { useApiQuery } from "@/hooks/useApiQuery";

export function useCategories() {
  const { data, isLoading, error, refetch } = useApiQuery("/categories");
  return { categories: data?.categories ?? [], isLoading, error, refetch };
}

export function useProducts(params) {
  const { data, isLoading, error, refetch } = useApiQuery("/products", params);
  return {
    products: data?.products ?? [],
    pagination: data?.pagination ?? null,
    isLoading,
    error,
    refetch,
  };
}

export function useAllOrders(params) {
  const { data, isLoading, error, refetch } = useApiQuery("/orders", params);
  return {
    orders: data?.orders ?? [],
    pagination: data?.pagination ?? null,
    isLoading,
    error,
    refetch,
  };
}

export function useOrder(id) {
  const { data, isLoading, error, refetch } = useApiQuery(
    id ? `/orders/${id}` : null,
  );
  return { order: data?.order ?? null, isLoading, error, refetch };
}

export function useUsers(params) {
  const { data, isLoading, error, refetch } = useApiQuery("/users", params);
  return {
    users: data?.users ?? [],
    pagination: data?.pagination ?? null,
    isLoading,
    error,
    refetch,
  };
}

const LOW_STOCK_THRESHOLD = 10;
const AGGREGATE_LIMIT = 500;

function isSameMonth(dateStr, ref) {
  const d = new Date(dateStr);
  return (
    d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth()
  );
}

function percentChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * The backend has no dedicated analytics endpoint, so the dashboard derives
 * its numbers from the same list endpoints the Orders/Products/Customers
 * pages use, fetched with a high limit. Fine at this project's scale.
 */
export function useDashboardStats() {
  const ordersQ = useApiQuery("/orders", { limit: AGGREGATE_LIMIT });
  const productsQ = useApiQuery("/products", { limit: AGGREGATE_LIMIT });
  const usersQ = useApiQuery("/users", { limit: AGGREGATE_LIMIT });

  const isLoading =
    ordersQ.isLoading || productsQ.isLoading || usersQ.isLoading;
  const isError = !!(ordersQ.error || productsQ.error || usersQ.error);

  const orders = ordersQ.data?.orders ?? [];
  const products = productsQ.data?.products ?? [];
  const users = usersQ.data?.users ?? [];

  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const nonCancelled = orders.filter((o) => o.status !== "cancelled");
  const totalSales = nonCancelled.reduce((sum, o) => sum + o.totalAmount, 0);
  const salesThisMonth = nonCancelled
    .filter((o) => isSameMonth(o.createdAt, now))
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const salesLastMonth = nonCancelled
    .filter((o) => isSameMonth(o.createdAt, lastMonth))
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const activeOrders = orders.filter((o) =>
    ["pending", "processing", "shipped"].includes(o.status),
  );

  const customers = users.filter((u) => u.role === "user");
  const customersThisMonth = customers.filter((u) =>
    isSameMonth(u.createdAt, now),
  ).length;
  const customersLastMonth = customers.filter((u) =>
    isSameMonth(u.createdAt, lastMonth),
  ).length;

  const lowStockProducts = products
    .filter((p) => p.stock <= LOW_STOCK_THRESHOLD)
    .sort((a, b) => a.stock - b.stock);

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6);

  return {
    isLoading,
    isError,
    totalSales,
    totalSalesChangePct: percentChange(salesThisMonth, salesLastMonth),
    activeOrdersCount: activeOrders.length,
    totalCustomers: customers.length,
    newCustomersThisMonth: customersThisMonth,
    newCustomersChangePct: percentChange(
      customersThisMonth,
      customersLastMonth,
    ),
    lowStockProducts,
    recentOrders,
    totalOrders: orders.length,
    totalProducts: products.length,
  };
}

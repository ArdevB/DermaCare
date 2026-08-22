"use client";

import { ProductCard } from "@/components/shop/ProductCard";
import { PaginationBar } from "@/components/admin/PaginationBar";

export function ProductGrid({ products, pagination, isLoading, isError, onPageChange, emptyMessage }) {
  if (isError) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-sm text-red-500">
        Couldn&apos;t load products. Check that the backend server is running.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-96 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center text-sm text-gray-400">
        {emptyMessage || "No products found."}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {pagination && onPageChange && (
        <div className="mt-6 rounded-xl border bg-white">
          <PaginationBar pagination={pagination} onPageChange={onPageChange} />
        </div>
      )}
    </>
  );
}

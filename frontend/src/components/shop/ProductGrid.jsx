"use client";

import { ProductCard } from "@/components/shop/ProductCard";
import { PaginationBar } from "@/components/admin/PaginationBar";
import {
  StaggerGrid,
  StaggerItem,
  FadeInSection,
} from "@/components/shop/FadeInSection";

export function ProductGrid({
  products,
  pagination,
  isLoading,
  isError,
  onPageChange,
  emptyMessage,
}) {
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
      <FadeInSection className="rounded-xl border bg-white p-12 text-center text-sm text-gray-400">
        {emptyMessage || "No products found."}
      </FadeInSection>
    );
  }

  return (
    <>
      <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <StaggerItem key={product._id}>
            <ProductCard product={product} />
          </StaggerItem>
        ))}
      </StaggerGrid>
      {pagination && onPageChange && (
        <FadeInSection className="mt-6 rounded-xl border bg-white" delay={0.1}>
          <PaginationBar pagination={pagination} onPageChange={onPageChange} />
        </FadeInSection>
      )}
    </>
  );
}

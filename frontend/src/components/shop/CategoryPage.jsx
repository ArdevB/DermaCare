"use client";

import { useState } from "react";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { usePublicCategories } from "@/hooks/useStorefront";
import { useApiQuery } from "@/hooks/useApiQuery";

/**
 * Shared shell for the top-nav category pages (SkinCare, HairCare, BodyCare,
 * Makeup). Categories are created dynamically by admins, so this matches by
 * name (case-insensitive, partial match) rather than a hardcoded ID.
 */
export function CategoryPage({ title, keyword }) {
  const [page, setPage] = useState(1);
  const { categories, isLoading: categoriesLoading } = usePublicCategories();

  const matchedCategory = categories.find((c) =>
    c.name.toLowerCase().replace(/\s+/g, "").includes(keyword.toLowerCase()),
  );

  // Only query products once we know which category (if any) matched -
  // avoids fetching an unfiltered product list we'd just discard.
  const { data, isLoading, error } = useApiQuery(
    matchedCategory ? "/products" : null,
    matchedCategory
      ? { category: matchedCategory._id, page, limit: 12 }
      : undefined,
  );

  const products = data?.products ?? [];
  const pagination = data?.pagination ?? null;
  const noMatchingCategory = !categoriesLoading && !matchedCategory;

  return (
    <main className="bg-gray-50 min-h-[70vh]">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {matchedCategory?.description && (
          <p className="mt-1 text-sm text-gray-500">
            {matchedCategory.description}
          </p>
        )}

        <div className="mt-6">
          {noMatchingCategory ? (
            <div className="rounded-xl border bg-white p-12 text-center text-sm text-gray-400">
              No &ldquo;{title}&rdquo; category has been set up yet. Check back
              soon, or{" "}
              <a href="/search" className="text-pink-500 hover:underline">
                browse all products
              </a>
              .
            </div>
          ) : (
            <ProductGrid
              products={products}
              pagination={pagination}
              isLoading={categoriesLoading || isLoading}
              isError={!!error}
              onPageChange={setPage}
              emptyMessage={`No products in ${title} yet.`}
            />
          )}
        </div>
      </div>
    </main>
  );
}

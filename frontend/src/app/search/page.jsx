"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { usePublicProducts, usePublicCategories } from "@/hooks/useStorefront";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "priceAsc" },
  { label: "Price: High to Low", value: "priceDesc" },
  { label: "Top Rated", value: "rating" },
];

function SearchPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page") || 1);

  const [searchInput, setSearchInput] = useState(q);

  const { categories } = usePublicCategories();
  const { products, pagination, isLoading, isError } = usePublicProducts({
    search: q || undefined,
    category: category === "all" ? undefined : category,
    sort,
    page,
    limit: 12,
  });

  function updateParams(next) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    if (!("page" in next)) params.delete("page");
    router.push(`/search?${params.toString()}`);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    updateParams({ q: searchInput.trim() });
  }

  return (
    <main className="bg-gray-50 min-h-[70vh]">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {q ? `Results for "${q}"` : "All Products"}
        </h1>
        {pagination && (
          <p className="text-sm text-gray-500 mt-1">
            {pagination.total} products found
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full sm:max-w-sm"
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="h-10 w-full rounded-full border pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </form>

          <div className="flex gap-3">
            <select
              value={category}
              onChange={(e) => updateParams({ category: e.target.value })}
              className="h-10 rounded-lg border px-3 text-sm"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="h-10 rounded-lg border px-3 text-sm"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <ProductGrid
            products={products}
            pagination={pagination}
            isLoading={isLoading}
            isError={isError}
            onPageChange={(p) => updateParams({ page: p })}
            emptyMessage={
              q
                ? `No products match "${q}". Try a different search term.`
                : "No products available yet."
            }
          />
        </div>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageInner />
    </Suspense>
  );
}

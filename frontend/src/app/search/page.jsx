"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductFilterSidebar } from "@/components/shop/ProductFilterSidebar";
import { usePublicCategories, usePublicBrands } from "@/hooks/useStorefront";
import { useApiQuery } from "@/hooks/useApiQuery";
import { FadeInSection } from "@/components/shop/FadeInSection";

const PRICE_CEILING = 20000;

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "priceAsc" },
  { label: "Price: High to Low", value: "priceDesc" },
  { label: "Top Rated", value: "rating" },
];

function parseSet(value) {
  return new Set(value ? value.split(",").filter(Boolean) : []);
}

function AllProductsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page") || 1);
  const selectedCategories = parseSet(searchParams.get("category"));
  const selectedBrands = parseSet(searchParams.get("brand"));
  const minPrice = Number(searchParams.get("minPrice") || 0);
  const maxPrice = Number(searchParams.get("maxPrice") || PRICE_CEILING);

  const [searchInput, setSearchInput] = useState(q);

  const { categories } = usePublicCategories();
  const { brands } = usePublicBrands();

  const { data, isLoading, error } = useApiQuery("/products", {
    search: q || undefined,
    category:
      selectedCategories.size > 0
        ? [...selectedCategories].join(",")
        : undefined,
    brand: selectedBrands.size > 0 ? [...selectedBrands].join(",") : undefined,
    minPrice: minPrice > 0 ? minPrice : undefined,
    maxPrice: maxPrice < PRICE_CEILING ? maxPrice : undefined,
    sort,
    page,
    limit: 12,
  });

  const products = data?.products ?? [];
  const pagination = data?.pagination ?? null;

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

  const toggleCategory = (id) => {
    const next = new Set(selectedCategories);
    next.has(id) ? next.delete(id) : next.add(id);
    updateParams({ category: [...next].join(",") });
  };

  const toggleBrand = (brand) => {
    const next = new Set(selectedBrands);
    next.has(brand) ? next.delete(brand) : next.add(brand);
    updateParams({ brand: [...next].join(",") });
  };

  return (
    <main className="bg-[#f7f5f0] min-h-[70vh] text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <FadeInSection className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold">
              All Products
            </h1>
            <p className="text-gray-600 mt-2">
              {pagination
                ? `${pagination.total} product${pagination.total === 1 ? "" : "s"} for your beauty journey.`
                : "Curated essentials for your clinical beauty journey."}
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 font-semibold tracking-wide">
              SORT BY:
            </span>
            <select
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="rounded-lg border-none bg-white px-3 py-1.5 text-pink-600 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </FadeInSection>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 mt-8">
          <FadeInSection delay={0.05}>
            <ProductFilterSidebar
              search={searchInput}
              onSearchChange={(v) => {
                setSearchInput(v);
                updateParams({ q: v.trim() });
              }}
              minPrice={minPrice}
              maxPrice={maxPrice}
              priceCeiling={PRICE_CEILING}
              onPriceChange={(min, max) =>
                updateParams({
                  minPrice: min || undefined,
                  maxPrice: max < PRICE_CEILING ? max : undefined,
                })
              }
              brands={brands}
              selectedBrands={selectedBrands}
              onToggleBrand={toggleBrand}
              categories={categories}
              selectedCategories={selectedCategories}
              onToggleCategory={toggleCategory}
            />
          </FadeInSection>

          <ProductGrid
            products={products}
            pagination={pagination}
            isLoading={isLoading}
            isError={!!error}
            onPageChange={(p) => updateParams({ page: p })}
            emptyMessage={
              q
                ? `No products match "${q}". Try a different search term or fewer filters.`
                : "No products match your filters."
            }
          />
        </div>
      </div>
    </main>
  );
}

export default function AllProductsPage() {
  return (
    <Suspense fallback={null}>
      <AllProductsPageInner />
    </Suspense>
  );
}

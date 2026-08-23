"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ImageOff } from "lucide-react";
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

function CategoryBanner({ category, title }) {
  if (category?.banner?.url) {
    return (
      <section className="relative w-full overflow-hidden rounded-2xl bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={category.banner.url}
          alt={title}
          className="w-full h-auto max-h-80 object-cover"
        />
      </section>
    );
  }

  // No banner uploaded yet - a branded placeholder so the page never looks
  // broken. Admins can set a real banner from the category admin page.
  return (
    <section className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#3A5134] to-pink-500 px-8 py-16 text-center text-white sm:py-20">
      {category ? (
        <ImageOff className="mx-auto mb-3 h-8 w-8 text-white/50" />
      ) : null}
      <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-white/85">
        {category?.description || `Explore our ${title} collection.`}
      </p>
    </section>
  );
}

/**
 * Shared shell for the top-nav category pages (SkinCare, HairCare, BodyCare,
 * Makeup). Categories are created dynamically by admins, so this matches by
 * name (case-insensitive, partial match) rather than a hardcoded ID.
 */
export function CategoryPage({ title, keyword }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(PRICE_CEILING);
  const [selectedBrands, setSelectedBrands] = useState(() => new Set());
  const [sort, setSort] = useState("newest");

  const { categories, isLoading: categoriesLoading } = usePublicCategories();

  const matchedCategory = categories.find((c) =>
    c.name.toLowerCase().replace(/\s+/g, "").includes(keyword.toLowerCase()),
  );

  const { brands } = usePublicBrands(matchedCategory?._id);

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      next.has(brand) ? next.delete(brand) : next.add(brand);
      return next;
    });
    setPage(1);
  };

  const handlePriceChange = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
    setPage(1);
  };

  // Only query products once we know which category (if any) matched -
  // avoids fetching an unfiltered product list we'd just discard.
  const { data, isLoading, error } = useApiQuery(
    matchedCategory ? "/products" : null,
    matchedCategory
      ? {
          category: matchedCategory._id,
          page,
          limit: 12,
          search: search || undefined,
          minPrice: minPrice > 0 ? minPrice : undefined,
          maxPrice: maxPrice < PRICE_CEILING ? maxPrice : undefined,
          brand:
            selectedBrands.size > 0 ? [...selectedBrands].join(",") : undefined,
          sort,
        }
      : undefined,
  );

  const products = data?.products ?? [];
  const pagination = data?.pagination ?? null;
  const noMatchingCategory = !categoriesLoading && !matchedCategory;

  return (
    <main className="bg-[#f7f5f0] min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <motion.div
          initial={{ opacity: 0, scale: 1.01 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <CategoryBanner category={matchedCategory} title={title} />
        </motion.div>

        {noMatchingCategory ? (
          <FadeInSection className="mt-8 rounded-2xl border bg-white p-12 text-center text-sm text-gray-400">
            No &ldquo;{title}&rdquo; category has been set up yet. Check back
            soon, or{" "}
            <a href="/search" className="text-pink-500 hover:underline">
              browse all products
            </a>
            .
          </FadeInSection>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 mt-8">
            <FadeInSection delay={0.05}>
              <ProductFilterSidebar
                search={search}
                onSearchChange={(v) => {
                  setSearch(v);
                  setPage(1);
                }}
                minPrice={minPrice}
                maxPrice={maxPrice}
                priceCeiling={PRICE_CEILING}
                onPriceChange={handlePriceChange}
                brands={brands}
                selectedBrands={selectedBrands}
                onToggleBrand={toggleBrand}
              />
            </FadeInSection>

            <div>
              <div className="flex items-center justify-end mb-4">
                <label className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500 font-semibold tracking-wide">
                    SORT BY:
                  </span>
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                      setPage(1);
                    }}
                    className="rounded-lg border-none bg-white px-3 py-1.5 text-pink-600 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-300"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <ProductGrid
                products={products}
                pagination={pagination}
                isLoading={categoriesLoading || isLoading}
                isError={!!error}
                onPageChange={setPage}
                emptyMessage={`No products match your filters in ${title}.`}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

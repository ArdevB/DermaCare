"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useApiQuery } from "@/hooks/useApiQuery";
import { ProductCard } from "@/components/shop/ProductCard";
import { FadeInSection, StaggerGrid, StaggerItem } from "@/components/shop/FadeInSection";

/**
 * A homepage product rail backed by real data: `/products` with the given
 * params. Renders nothing (not even a heading) if the backend has no
 * matching products, so an empty catalog doesn't leave a broken-looking gap.
 */
export function HomeProductSection({ eyebrow, title, queryParams, viewAllHref, limit = 4 }) {
  const { data, isLoading, error } = useApiQuery("/products", { ...queryParams, limit });
  const products = data?.products ?? [];

  if (!isLoading && !error && products.length === 0) return null;

  return (
    <section className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <FadeInSection className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div className="text-center sm:text-left w-full sm:w-auto">
            {eyebrow && (
              <p className="text-gray-500 text-sm tracking-wide text-center sm:text-left">{eyebrow}</p>
            )}
            <h2 className="text-3xl font-display font-semibold text-pink-500 mt-1 text-center sm:text-left">
              {title}
            </h2>
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[#3A5134] hover:text-pink-500"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </FadeInSection>

        {error ? (
          <p className="text-center text-sm text-red-500">Couldn&apos;t load products right now.</p>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        ) : (
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {products.map((product) => (
              <StaggerItem key={product._id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}

        {viewAllHref && (
          <div className="flex sm:hidden justify-center mt-8">
            <Link
              href={viewAllHref}
              className="flex items-center gap-1.5 text-sm font-medium text-[#3A5134] hover:text-pink-500"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

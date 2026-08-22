"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, ShoppingCart, ImageOff } from "lucide-react";
import { useShop } from "@/hooks/useShop";
import { getErrorMessage } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

export function ProductCard({ product }) {
  const router = useRouter();
  const { addToCart, toggleFavourite, favouriteProductIds } = useShop();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const isFavourited = favouriteProductIds.has(product._id);
  const outOfStock = product.stock <= 0;

  async function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    setError("");
    setBusy(true);
    try {
      await addToCart(product._id, 1);
    } catch (err) {
      if (err.status === 401) {
        router.push(
          `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
        );
        return;
      }
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleToggleFavourite(e) {
    e.preventDefault();
    e.stopPropagation();
    setError("");
    try {
      await toggleFavourite(product._id);
    } catch (err) {
      if (err.status === 401) {
        router.push(
          `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
        );
        return;
      }
      setError(getErrorMessage(err));
    }
  }

  return (
    <Link
      href={`/products/${product._id}`}
      className="group block rounded-xl border border-gray-200 bg-white p-3 transition hover:shadow hover:border-pink-400"
    >
      <div className="relative h-56 w-full overflow-hidden rounded-lg bg-gray-100">
        {product.images?.[0]?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0].url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            <ImageOff className="h-8 w-8" />
          </div>
        )}
        <button
          onClick={handleToggleFavourite}
          aria-label={
            isFavourited ? "Remove from favourites" : "Add to favourites"
          }
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
        >
          <Heart
            className={`h-4 w-4 ${isFavourited ? "fill-pink-500 text-pink-500" : "text-gray-500"}`}
          />
        </button>
        {outOfStock && (
          <span className="absolute left-2 top-2 rounded-full bg-gray-900/80 px-2 py-0.5 text-[10px] font-semibold text-white">
            Out of stock
          </span>
        )}
      </div>

      <div className="p-2">
        <div className="flex items-center justify-between mt-3">
          <p className="text-gray-500 text-xs truncate">
            {typeof product.category === "object" ? product.category?.name : ""}
          </p>
          <span className="text-yellow-500 text-xs">
            ★{" "}
            <span className="text-gray-600">
              ({product.ratings?.count ?? 0})
            </span>
          </span>
        </div>

        <h3
          className="font-medium text-base mt-1.5 truncate"
          title={product.name}
        >
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-3">
          <span className="text-pink-500 text-lg font-semibold">
            {formatCurrency(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={busy || outOfStock}
            className="flex items-center gap-1.5 rounded-lg bg-[#3A5134] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-pink-500 disabled:opacity-50"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {outOfStock ? "Sold out" : busy ? "Adding..." : "Add"}
          </button>
        </div>

        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      </div>
    </Link>
  );
}

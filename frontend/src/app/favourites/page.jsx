"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, ImageOff } from "lucide-react";
import { useShop } from "@/hooks/useShop";
import { getErrorMessage } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

export default function FavouritesPage() {
  const {
    user,
    userLoading,
    favourites,
    favouritesLoading,
    toggleFavourite,
    addToCart,
  } = useShop();
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  async function handleRemove(productId) {
    setError("");
    setBusyId(productId);
    try {
      await toggleFavourite(productId);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  async function handleAddToCart(productId) {
    setError("");
    setBusyId(productId);
    try {
      await addToCart(productId, 1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  if (userLoading) {
    return (
      <main className="container mx-auto px-6 py-10">
        <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container mx-auto px-6 py-16 text-center">
        <Heart className="mx-auto h-10 w-10 text-gray-300" />
        <h1 className="mt-4 text-xl font-semibold text-gray-900">
          Log in to see your favourites
        </h1>
        <Link
          href="/login?redirect=/favourites"
          className="mt-5 inline-block rounded-lg bg-pink-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-600"
        >
          Log in
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-[70vh]">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Your Favourites
        </h1>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}

        {favouritesLoading ? (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-xl bg-gray-100"
              />
            ))}
          </div>
        ) : favourites.length === 0 ? (
          <div className="mt-8 rounded-xl border bg-white p-12 text-center">
            <Heart className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-gray-500">No favourites yet.</p>
            <Link
              href="/search"
              className="mt-4 inline-block rounded-lg bg-pink-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-600"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favourites.map((fav) => {
              const product = fav.product;
              if (!product) return null;
              const busy = busyId === product._id;
              return (
                <div key={fav._id} className="rounded-xl border bg-white p-3">
                  <Link href={`/products/${product._id}`} className="block">
                    <div className="h-48 w-full overflow-hidden rounded-lg bg-gray-100">
                      {product.images?.[0]?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                          <ImageOff className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <h3 className="mt-3 truncate font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-pink-500 font-semibold">
                      {formatCurrency(product.price)}
                    </p>
                  </Link>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      disabled={busy || product.stock <= 0}
                      className="flex-1 rounded-lg bg-[#3A5134] px-3 py-2 text-xs font-medium text-white hover:bg-pink-500 disabled:opacity-50"
                    >
                      {product.stock <= 0 ? "Sold out" : "Add to Cart"}
                    </button>
                    <button
                      onClick={() => handleRemove(product._id)}
                      disabled={busy}
                      className="rounded-lg border px-3 py-2 text-xs text-red-500 hover:bg-red-50 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

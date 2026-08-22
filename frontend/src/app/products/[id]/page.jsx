"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShoppingCart,
  ImageOff,
  Minus,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { usePublicProduct } from "@/hooks/useStorefront";
import { useShop } from "@/hooks/useShop";
import { getErrorMessage } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { StarRatingDisplay } from "@/components/shop/StarRating";
import { ReviewsSection } from "@/components/shop/ReviewsSection";

const TABS = ["Description", "Ingredients", "Features", "Benefits", "Reviews"];

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { product, isLoading, isError, refetch } = usePublicProduct(id);
  const { addToCart, toggleFavourite, favouriteProductIds } = useShop();

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState("Description");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  function requireLogin(err) {
    if (err.status === 401) {
      router.push(`/login?redirect=${encodeURIComponent(`/products/${id}`)}`);
      return true;
    }
    return false;
  }

  async function handleAddToCart() {
    setError("");
    setAdded(false);
    setBusy(true);
    try {
      await addToCart(id, quantity);
      setAdded(true);
    } catch (err) {
      if (!requireLogin(err)) setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleBuyNow() {
    setError("");
    setBusy(true);
    try {
      await addToCart(id, quantity);
      router.push("/checkout");
    } catch (err) {
      if (!requireLogin(err)) setError(getErrorMessage(err));
      setBusy(false);
    }
  }

  async function handleToggleFavourite() {
    setError("");
    try {
      await toggleFavourite(id);
    } catch (err) {
      if (!requireLogin(err)) setError(getErrorMessage(err));
    }
  }

  if (isLoading) {
    return (
      <main className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="h-96 animate-pulse rounded-xl bg-gray-100" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" />
            <div className="h-24 w-full animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="container mx-auto px-6 py-16 text-center">
        <p className="text-gray-500">
          This product couldn&apos;t be found, or the backend isn&apos;t
          reachable.
        </p>
        <Link
          href="/search"
          className="mt-4 inline-block text-pink-500 hover:underline"
        >
          Back to shopping
        </Link>
      </main>
    );
  }

  const isFavourited = favouriteProductIds.has(product._id);
  const outOfStock = product.stock <= 0;
  const images = product.images?.length > 0 ? product.images : [];

  return (
    <main className="bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <Link
          href="/search"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-pink-500"
        >
          <ArrowLeft className="h-4 w-4" /> Back to shopping
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Gallery */}
          <div>
            <div className="aspect-square w-full overflow-hidden rounded-xl bg-white border">
              {images.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={images[activeImage]?.url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-300">
                  <ImageOff className="h-16 w-16" />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={img.publicId ?? idx}
                    onClick={() => setActiveImage(idx)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                      idx === activeImage
                        ? "border-pink-500"
                        : "border-transparent"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {typeof product.category === "object" && product.category?.name && (
              <p className="text-sm text-pink-500 font-medium">
                {product.category.name}
              </p>
            )}
            <h1 className="text-3xl font-semibold text-gray-900 mt-1">
              {product.name}
            </h1>
            {product.brand && (
              <p className="text-sm text-gray-500 mt-1">by {product.brand}</p>
            )}

            <div className="flex items-center gap-3 mt-3">
              <span className="flex items-center gap-1.5 text-sm">
                <StarRatingDisplay value={product.ratings?.average ?? 0} />
                <span className="text-gray-600">
                  {(product.ratings?.average ?? 0).toFixed(1)} (
                  {product.ratings?.count ?? 0} reviews)
                </span>
              </span>
              <span
                className={`text-xs font-semibold ${outOfStock ? "text-red-500" : "text-green-600"}`}
              >
                {outOfStock ? "Out of stock" : `${product.stock} in stock`}
              </span>
            </div>

            <p className="text-3xl font-semibold text-pink-500 mt-4">
              {formatCurrency(product.price)}
            </p>

            {/* Quantity + actions */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-lg border">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 text-gray-500 hover:text-pink-500"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock || 1, q + 1))
                  }
                  className="p-2.5 text-gray-500 hover:text-pink-500"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleToggleFavourite}
                aria-label={
                  isFavourited ? "Remove from favourites" : "Add to favourites"
                }
                className="flex h-10 w-10 items-center justify-center rounded-lg border hover:bg-gray-50"
              >
                <Heart
                  className={`h-5 w-5 ${isFavourited ? "fill-pink-500 text-pink-500" : "text-gray-500"}`}
                />
              </button>
            </div>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            {added && !error && (
              <p className="mt-3 text-sm text-green-600">
                Added to cart.{" "}
                <Link href="/cart" className="underline">
                  View cart
                </Link>
              </p>
            )}

            <div className="mt-5 flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={busy || outOfStock}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#3A5134] px-5 py-3 text-sm font-medium text-white hover:bg-pink-500 disabled:opacity-50"
              >
                <ShoppingCart className="h-4 w-4" />
                {outOfStock ? "Sold out" : busy ? "Adding..." : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={busy || outOfStock}
                className="flex flex-1 items-center justify-center rounded-lg bg-pink-500 px-5 py-3 text-sm font-medium text-white hover:bg-pink-600 disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

            {/* Tabs */}
            <div className="mt-10 border-t pt-6">
              <div className="flex gap-4 border-b">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`pb-2.5 text-sm font-medium ${
                      tab === t
                        ? "border-b-2 border-pink-500 text-pink-500"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {t === "Reviews"
                      ? `Reviews (${product.ratings?.count ?? 0})`
                      : t}
                  </button>
                ))}
              </div>
              <div className="pt-4 text-sm text-gray-600 leading-relaxed">
                {tab === "Description" &&
                  (product.description || "No description available.")}
                {tab === "Ingredients" &&
                  (product.ingredients?.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {product.ingredients.map((ing) => (
                        <li key={ing}>{ing}</li>
                      ))}
                    </ul>
                  ) : (
                    "No ingredient information available."
                  ))}
                {tab === "Features" &&
                  (product.features?.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {product.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  ) : (
                    "No feature information available."
                  ))}
                {tab === "Benefits" &&
                  (product.benefits?.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {product.benefits.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  ) : (
                    "No benefit information available."
                  ))}
              </div>
              {tab === "Reviews" && (
                <div className="pt-4">
                  <ReviewsSection
                    productId={product._id}
                    ratingsSummary={product.ratings}
                    onChanged={refetch}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

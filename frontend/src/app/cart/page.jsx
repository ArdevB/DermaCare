"use client";

import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ImageOff } from "lucide-react";
import { useShop } from "@/hooks/useShop";
import { getErrorMessage } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

const SHIPPING_FEE = 5;

export default function CartPage() {
  const {
    user,
    userLoading,
    cart,
    cartLoading,
    updateCartItem,
    removeCartItem,
    clearCartItems,
  } = useShop();
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState(null);

  async function handleQuantityChange(productId, quantity) {
    if (quantity < 1) return;
    setError("");
    setPendingId(productId);
    try {
      await updateCartItem(productId, quantity);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPendingId(null);
    }
  }

  async function handleRemove(productId) {
    setError("");
    setPendingId(productId);
    try {
      await removeCartItem(productId);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPendingId(null);
    }
  }

  async function handleClear() {
    setError("");
    try {
      await clearCartItems();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  if (userLoading || (user && cartLoading && !cart)) {
    return (
      <main className="container mx-auto px-6 py-10">
        <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container mx-auto px-6 py-16 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-gray-300" />
        <h1 className="mt-4 text-xl font-semibold text-gray-900">
          Log in to see your cart
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Your cart is saved to your account.
        </p>
        <Link
          href="/login?redirect=/cart"
          className="mt-5 inline-block rounded-lg bg-pink-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-600"
        >
          Log in
        </Link>
      </main>
    );
  }

  const items = cart?.items ?? [];
  const subtotal = items.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
    0,
  );
  const total = items.length > 0 ? subtotal + SHIPPING_FEE : 0;

  return (
    <main className="bg-gray-50 min-h-[70vh]">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-900">Your Cart</h1>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}

        {items.length === 0 ? (
          <div className="mt-8 rounded-xl border bg-white p-12 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-gray-500">Your cart is empty.</p>
            <Link
              href="/search"
              className="mt-4 inline-block rounded-lg bg-pink-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-600"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-xl border bg-white divide-y">
              {items.map((item) => {
                const product = item.product;
                if (!product) return null;
                const busy = pendingId === product._id;
                return (
                  <div
                    key={product._id}
                    className="flex items-center gap-4 p-4"
                  >
                    <Link
                      href={`/products/${product._id}`}
                      className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100"
                    >
                      {product.images?.[0]?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                          <ImageOff className="h-5 w-5" />
                        </div>
                      )}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${product._id}`}
                        className="truncate font-medium text-gray-900 hover:text-pink-500"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(product.price)}
                      </p>
                    </div>

                    <div className="flex items-center rounded-lg border">
                      <button
                        disabled={busy}
                        onClick={() =>
                          handleQuantityChange(product._id, item.quantity - 1)
                        }
                        className="p-2 text-gray-500 hover:text-pink-500 disabled:opacity-40"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        disabled={busy}
                        onClick={() =>
                          handleQuantityChange(product._id, item.quantity + 1)
                        }
                        className="p-2 text-gray-500 hover:text-pink-500 disabled:opacity-40"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <p className="w-20 shrink-0 text-right font-medium text-gray-900">
                      {formatCurrency(product.price * item.quantity)}
                    </p>

                    <button
                      disabled={busy}
                      onClick={() => handleRemove(product._id)}
                      className="shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-40"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
              <div className="p-4">
                <button
                  onClick={handleClear}
                  className="text-xs text-gray-400 hover:text-red-500"
                >
                  Clear cart
                </button>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-5 h-fit">
              <h2 className="text-lg font-semibold text-gray-900">
                Order Summary
              </h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span>{formatCurrency(SHIPPING_FEE)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="mt-5 block rounded-lg bg-pink-500 px-5 py-3 text-center text-sm font-medium text-white hover:bg-pink-600"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

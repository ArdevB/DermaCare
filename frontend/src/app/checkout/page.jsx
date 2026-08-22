"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useShop } from "@/hooks/useShop";
import { createOrder, initiateKhalti } from "@/lib/shopActions";
import { getErrorMessage } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

const SHIPPING_FEE = 5;

const emptyAddress = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user, userLoading, cart, cartLoading, refreshCart } = useShop();
  const [address, setAddress] = useState(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

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
        <h1 className="text-xl font-semibold text-gray-900">
          Log in to check out
        </h1>
        <Link
          href="/login?redirect=/checkout"
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

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-xl font-semibold text-gray-900">
          Your cart is empty
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Add some products before checking out.
        </p>
        <Link
          href="/search"
          className="mt-5 inline-block rounded-lg bg-pink-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-600"
        >
          Browse products
        </Link>
      </main>
    );
  }

  function updateField(field, value) {
    setAddress((a) => ({ ...a, [field]: value }));
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setError("");
    setPlacing(true);
    try {
      const res = await createOrder(address, paymentMethod);
      const order = res.data.order;
      await refreshCart();

      if (paymentMethod === "khalti") {
        try {
          const khaltiRes = await initiateKhalti(order._id);
          window.location.href = khaltiRes.data.paymentUrl;
          return;
        } catch (khaltiErr) {
          // Order exists but Khalti couldn't be reached - send them to the
          // order page where they can retry payment instead of losing the order.
          setError(
            `Order placed, but Khalti couldn't be reached: ${getErrorMessage(
              khaltiErr,
            )} You can retry payment from your order page.`,
          );
          router.push(`/orders/${order._id}`);
          return;
        }
      }

      router.push(`/orders/${order._id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPlacing(false);
    }
  }

  return (
    <main className="bg-gray-50 min-h-[70vh]">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-900">Checkout</h1>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handlePlaceOrder}
          className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border bg-white p-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Shipping Address
              </h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Full name
                  </label>
                  <input
                    required
                    value={address.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Phone
                  </label>
                  <input
                    required
                    value={address.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Country
                  </label>
                  <input
                    required
                    value={address.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border px-3 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Address line 1
                  </label>
                  <input
                    required
                    value={address.addressLine1}
                    onChange={(e) =>
                      updateField("addressLine1", e.target.value)
                    }
                    className="mt-1 h-10 w-full rounded-lg border px-3 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Address line 2 (optional)
                  </label>
                  <input
                    value={address.addressLine2}
                    onChange={(e) =>
                      updateField("addressLine2", e.target.value)
                    }
                    className="mt-1 h-10 w-full rounded-lg border px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    City
                  </label>
                  <input
                    required
                    value={address.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    State / Province
                  </label>
                  <input
                    required
                    value={address.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Postal code
                  </label>
                  <input
                    required
                    value={address.postalCode}
                    onChange={(e) => updateField("postalCode", e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border px-3 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Payment Method
              </h2>
              <div className="mt-4 space-y-2">
                {[
                  {
                    value: "cod",
                    label: "Cash on Delivery",
                    hint: "Pay when your order arrives.",
                  },
                  {
                    value: "bank_transfer",
                    label: "Bank Transfer",
                    hint: "Transfer manually, then upload your receipt for approval.",
                  },
                  {
                    value: "khalti",
                    label: "Khalti",
                    hint: "Pay instantly via Khalti.",
                  },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${
                      paymentMethod === opt.value
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={() => setPaymentMethod(opt.value)}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {opt.label}
                      </p>
                      <p className="text-xs text-gray-500">{opt.hint}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5 h-fit">
            <h2 className="text-lg font-semibold text-gray-900">
              Order Summary
            </h2>
            <div className="mt-4 space-y-2 divide-y">
              {items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex justify-between py-2 text-sm"
                >
                  <span className="text-gray-600 truncate pr-2">
                    {item.product.name} &times; {item.quantity}
                  </span>
                  <span className="shrink-0 font-medium">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-2 border-t pt-3 text-sm">
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
            <button
              type="submit"
              disabled={placing}
              className="mt-5 w-full rounded-lg bg-pink-500 px-5 py-3 text-sm font-medium text-white hover:bg-pink-600 disabled:opacity-50"
            >
              {placing ? "Placing order..." : "Place Order"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Package, User, LogOut, ShoppingBag } from "lucide-react";
import { useShop } from "@/hooks/useShop";
import { useMyOrders } from "@/hooks/useStorefront";
import { initials, formatCurrency, formatDate } from "@/lib/format";
import {
  StaggerGrid,
  StaggerItem,
  FadeInSection,
} from "@/components/shop/FadeInSection";

const STATUS_STYLE = {
  pending: "bg-amber-50 text-amber-600",
  processing: "bg-blue-50 text-blue-600",
  shipped: "bg-pink-50 text-pink-600",
  delivered: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-600",
};

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "orders", label: "My Orders" },
  { key: "profile", label: "Profile" },
];

function DashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "overview";
  const { user, userLoading, favourites, logout } = useShop();
  const {
    orders,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useMyOrders();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  function setTab(next) {
    router.push(`/dashboard?tab=${next}`);
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
        <h1 className="text-xl font-semibold text-gray-900">
          Log in to see your dashboard
        </h1>
        <Link
          href="/login?redirect=/dashboard"
          className="mt-5 inline-block rounded-lg bg-pink-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-600"
        >
          Log in
        </Link>
      </main>
    );
  }

  const recentOrders = orders.slice(0, 5);

  return (
    <main className="bg-gray-50 min-h-[70vh]">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex items-center gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-lg font-semibold text-white"
          >
            {initials(user.name)}
          </motion.div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {user.name}
            </h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </motion.div>

        <div className="mt-6 flex gap-2 border-b">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-4 py-2.5 text-sm font-medium ${
                tab === t.key
                  ? "text-pink-500"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {t.label}
              {tab === t.key && (
                <motion.span
                  layoutId="dashboard-tab-underline"
                  className="absolute -bottom-px left-0 right-0 h-0.5 bg-pink-500"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {tab === "overview" && (
              <StaggerGrid className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StaggerItem>
                  <motion.div whileHover={{ y: -3 }}>
                    <Link
                      href="/dashboard?tab=orders"
                      className="block rounded-xl border bg-white p-5 hover:shadow transition-shadow"
                    >
                      <Package className="h-6 w-6 text-pink-500" />
                      <p className="mt-3 text-2xl font-semibold text-gray-900">
                        {orders.length}
                      </p>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Total Orders
                      </p>
                    </Link>
                  </motion.div>
                </StaggerItem>
                <StaggerItem>
                  <motion.div whileHover={{ y: -3 }}>
                    <Link
                      href="/favourites"
                      className="block rounded-xl border bg-white p-5 hover:shadow transition-shadow"
                    >
                      <Heart className="h-6 w-6 text-pink-500" />
                      <p className="mt-3 text-2xl font-semibold text-gray-900">
                        {favourites.length}
                      </p>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Favourites
                      </p>
                    </Link>
                  </motion.div>
                </StaggerItem>
                <StaggerItem>
                  <motion.div whileHover={{ y: -3 }}>
                    <Link
                      href="/cart"
                      className="block rounded-xl border bg-white p-5 hover:shadow transition-shadow"
                    >
                      <ShoppingBag className="h-6 w-6 text-pink-500" />
                      <p className="mt-3 text-2xl font-semibold text-gray-900">
                        Cart
                      </p>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        View your cart
                      </p>
                    </Link>
                  </motion.div>
                </StaggerItem>

                <StaggerItem className="sm:col-span-3">
                  <div className="rounded-xl border bg-white p-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Recent Orders
                      </h2>
                      <button
                        onClick={() => setTab("orders")}
                        className="text-sm font-medium text-pink-500 hover:underline"
                      >
                        View all
                      </button>
                    </div>
                    {ordersLoading ? (
                      <div className="mt-4 space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-12 w-full animate-pulse rounded-lg bg-gray-100"
                          />
                        ))}
                      </div>
                    ) : recentOrders.length === 0 ? (
                      <p className="mt-4 text-sm text-gray-400">
                        No orders yet.
                      </p>
                    ) : (
                      <StaggerGrid className="mt-4 divide-y">
                        {recentOrders.map((order) => (
                          <StaggerItem key={order._id}>
                            <Link
                              href={`/orders/${order._id}`}
                              className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 -mx-2 rounded transition-colors"
                            >
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {order.orderNumber}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {formatDate(order.createdAt)}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium">
                                  {formatCurrency(order.totalAmount)}
                                </span>
                                <span
                                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                                    STATUS_STYLE[order.status] ??
                                    "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </div>
                            </Link>
                          </StaggerItem>
                        ))}
                      </StaggerGrid>
                    )}
                  </div>
                </StaggerItem>
              </StaggerGrid>
            )}

            {tab === "orders" && (
              <div className="mt-6 rounded-xl border bg-white">
                {ordersError && (
                  <div className="p-6 text-center text-sm text-red-500">
                    Couldn&apos;t load your orders. Check that the backend
                    server is running.
                  </div>
                )}
                {ordersLoading ? (
                  <div className="space-y-2 p-5">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-12 w-full animate-pulse rounded-lg bg-gray-100"
                      />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <FadeInSection className="p-12 text-center">
                    <Package className="mx-auto h-10 w-10 text-gray-300" />
                    <p className="mt-3 text-gray-500">
                      You haven&apos;t placed any orders yet.
                    </p>
                    <Link
                      href="/search"
                      className="mt-4 inline-block rounded-lg bg-pink-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-600"
                    >
                      Start shopping
                    </Link>
                  </FadeInSection>
                ) : (
                  <StaggerGrid className="divide-y">
                    {orders.map((order) => (
                      <StaggerItem key={order._id}>
                        <Link
                          href={`/orders/${order._id}`}
                          className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {order.orderNumber}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatDate(order.createdAt)} &middot;{" "}
                              {order.items.length} item
                              {order.items.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">
                              {formatCurrency(order.totalAmount)}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                                STATUS_STYLE[order.status] ??
                                "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </Link>
                      </StaggerItem>
                    ))}
                  </StaggerGrid>
                )}
              </div>
            )}

            {tab === "profile" && (
              <FadeInSection className="mt-6 rounded-xl border bg-white p-6 max-w-md">
                <div className="flex items-center gap-2 text-gray-900">
                  <User className="h-5 w-5 text-pink-500" />
                  <h2 className="text-lg font-semibold">Profile</h2>
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Name
                    </p>
                    <p className="text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Email
                    </p>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Email verified
                    </p>
                    <p className="text-gray-900">
                      {user.isEmailVerified ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-6 flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </motion.button>
              </FadeInSection>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardInner />
    </Suspense>
  );
}

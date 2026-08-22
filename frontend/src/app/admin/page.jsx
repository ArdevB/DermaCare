"use client";

import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Users,
  PackageX,
  TrendingUp,
} from "lucide-react";
import { AdminTopbar } from "@/components/admin/Topbar";
import { StatCard } from "@/components/admin/StatCard";
import { OrderStatusBadge } from "@/components/admin/Badge";
import { useCurrentUser } from "@/lib/auth";
import { useDashboardStats } from "@/hooks/useAdminApi";
import { formatCurrency, formatDate } from "@/lib/format";

export default function AdminDashboardPage() {
  const { user } = useCurrentUser();
  const stats = useDashboardStats();

  return (
    <>
      <AdminTopbar title="Overview" user={user} />
      <main className="p-4 lg:p-8">
        {stats.isError && (
          <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            Couldn&apos;t load some dashboard data. Make sure the backend server
            is running.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[124px] animate-pulse rounded-xl bg-gray-100"
              />
            ))
          ) : (
            <>
              <StatCard
                label="Total Sales"
                value={formatCurrency(stats.totalSales)}
                icon={DollarSign}
                changePct={stats.totalSalesChangePct}
              />
              <StatCard
                label="New Customers"
                value={String(stats.newCustomersThisMonth)}
                icon={Users}
                changePct={stats.newCustomersChangePct}
              />
              <StatCard
                label="Active Orders"
                value={String(stats.activeOrdersCount)}
                icon={ShoppingCart}
                badge="Current"
              />
              <StatCard
                label="Low Stock Items"
                value={String(stats.lowStockProducts.length)}
                icon={PackageX}
                badge={
                  stats.lowStockProducts.length > 0
                    ? "Needs attention"
                    : "All good"
                }
              />
            </>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-xl border bg-white shadow-sm xl:col-span-2">
            <div className="flex items-center justify-between border-b p-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Orders
              </h2>
              <Link
                href="/admin/orders"
                className="text-sm font-medium text-pink-500 hover:underline"
              >
                View all
              </Link>
            </div>
            {stats.isLoading ? (
              <div className="space-y-2 p-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-full animate-pulse rounded-lg bg-gray-100"
                  />
                ))}
              </div>
            ) : stats.recentOrders.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-gray-400">
                No orders yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      <th className="px-5 py-2.5">Order</th>
                      <th className="px-5 py-2.5">Date</th>
                      <th className="px-5 py-2.5">Amount</th>
                      <th className="px-5 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {stats.recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-5 py-3">
                          <Link
                            href={`/admin/orders/${order._id}`}
                            className="font-semibold text-pink-500 hover:underline"
                          >
                            {order.orderNumber}
                          </Link>
                        </td>
                        <td className="px-5 py-3 text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-5 py-3 font-medium">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="px-5 py-3">
                          <OrderStatusBadge status={order.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-xl border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b p-5">
              <h2 className="text-lg font-semibold text-gray-900">Low Stock</h2>
              <Link
                href="/admin/products"
                className="text-sm font-medium text-pink-500 hover:underline"
              >
                Manage
              </Link>
            </div>
            <div className="space-y-1 p-3">
              {stats.isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-14 w-full animate-pulse rounded-lg bg-gray-100"
                  />
                ))
              ) : stats.lowStockProducts.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400">
                  Every product is well stocked.
                </p>
              ) : (
                stats.lowStockProducts.slice(0, 5).map((product) => (
                  <Link
                    key={product._id}
                    href={`/admin/products?edit=${product._id}`}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                  >
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {product.images?.[0]?.url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-red-500">
                        Stock: {product.stock}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {!stats.isLoading && (
          <div className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#3A5134] to-[#243420] p-8 text-white">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <div className="mb-2 flex items-center gap-2 text-white/80">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Performance Insights
                  </span>
                </div>
                <p className="max-w-lg text-sm text-white/90">
                  {stats.totalSalesChangePct >= 0
                    ? `Sales are up ${stats.totalSalesChangePct.toFixed(1)}% compared to last month across ${stats.totalOrders} total orders.`
                    : `Sales are down ${Math.abs(stats.totalSalesChangePct).toFixed(1)}% compared to last month. Consider reviewing active promotions.`}{" "}
                  You have {stats.totalProducts} products live in the catalog.
                </p>
              </div>
              <Link
                href="/admin/orders"
                className="shrink-0 rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/25"
              >
                View orders
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

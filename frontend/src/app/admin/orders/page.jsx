"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminTopbar } from "@/components/admin/Topbar";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/admin/Badge";
import { PaginationBar } from "@/components/admin/PaginationBar";
import { useCurrentUser } from "@/lib/auth";
import { useAllOrders } from "@/hooks/useAdminApi";
import { updateOrderStatus } from "@/lib/adminActions";
import { getErrorMessage } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
const FILTER_OPTIONS = [
  { label: "All statuses", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default function AdminOrdersPage() {
  const { user } = useCurrentUser();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [pendingId, setPendingId] = useState(null);
  const [error, setError] = useState("");

  const { orders, pagination, isLoading, isError, refetch } = useAllOrders({
    page,
    limit: 15,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  async function handleStatusChange(orderId, status) {
    setError("");
    setPendingId(orderId);
    try {
      await updateOrderStatus(orderId, status);
      refetch();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPendingId(null);
    }
  }

  return (
    <>
      <AdminTopbar title="Orders" user={user} />
      <main className="p-4 lg:p-8">
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                All Orders
              </h2>
              <p className="text-sm text-gray-400">
                {pagination?.total ?? 0} orders total
              </p>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-9 w-full rounded-lg border px-3 text-sm sm:w-48"
            >
              {FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="bg-red-50 px-5 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}
          {isError && (
            <div className="p-6 text-center text-sm text-red-500">
              Couldn&apos;t load orders. Check that the backend server is
              running.
            </div>
          )}

          {isLoading ? (
            <div className="space-y-2 p-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 w-full animate-pulse rounded-lg bg-gray-100"
                />
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    <th className="px-4 py-2.5">Order</th>
                    <th className="px-4 py-2.5">Customer</th>
                    <th className="px-4 py-2.5">Date</th>
                    <th className="px-4 py-2.5">Amount</th>
                    <th className="px-4 py-2.5">Payment</th>
                    <th className="px-4 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((order) => {
                    const customer =
                      typeof order.user === "object" ? order.user : null;
                    const isLocked =
                      order.status === "delivered" ||
                      order.status === "cancelled";
                    return (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3.5">
                          <Link
                            href={`/admin/orders/${order._id}`}
                            className="font-semibold text-pink-500 hover:underline"
                          >
                            {order.orderNumber}
                          </Link>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-medium text-gray-900">
                            {customer?.name ?? "—"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {customer?.email}
                          </p>
                        </td>
                        <td className="px-4 py-3.5 text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-4 py-3.5 font-medium">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="px-4 py-3.5">
                          <PaymentStatusBadge status={order.payment.status} />
                        </td>
                        <td className="px-4 py-3.5">
                          {isLocked ? (
                            <OrderStatusBadge status={order.status} />
                          ) : (
                            <select
                              value={order.status}
                              disabled={pendingId === order._id}
                              onChange={(e) =>
                                handleStatusChange(order._id, e.target.value)
                              }
                              className="h-8 rounded-lg border px-2 text-xs capitalize disabled:opacity-50"
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option
                                  key={s}
                                  value={s}
                                  className="capitalize"
                                >
                                  {s}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="p-8 text-center text-sm text-gray-400">
              No orders found.
            </p>
          )}

          <PaginationBar pagination={pagination} onPageChange={setPage} />
        </div>
      </main>
    </>
  );
}

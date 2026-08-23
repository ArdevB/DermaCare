"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Check, X } from "lucide-react";
import { AdminTopbar } from "@/components/admin/Topbar";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/admin/Badge";
import { useCurrentUser } from "@/lib/auth";
import { useOrder } from "@/hooks/useAdminApi";
import { updateOrderStatus, verifyBankTransfer } from "@/lib/adminActions";
import { getErrorMessage } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import { FadeInSection } from "@/components/shop/FadeInSection";

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrderDetailPage({ params }) {
  const { id } = use(params);
  const { user } = useCurrentUser();
  const { order, isLoading, isError, refetch } = useOrder(id);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [statusSaving, setStatusSaving] = useState(false);
  const [verifySaving, setVerifySaving] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  async function handleStatusChange(status) {
    setError("");
    setSuccess("");
    setStatusSaving(true);
    try {
      await updateOrderStatus(id, status);
      setSuccess(`Order marked as ${status}.`);
      refetch();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setStatusSaving(false);
    }
  }

  async function handleVerify(decision) {
    if (decision === "reject" && !rejectionReason.trim()) {
      setShowRejectForm(true);
      return;
    }
    setError("");
    setSuccess("");
    setVerifySaving(true);
    try {
      await verifyBankTransfer(
        id,
        decision,
        decision === "reject" ? rejectionReason.trim() : undefined,
      );
      setSuccess(
        decision === "approve" ? "Payment approved." : "Payment rejected.",
      );
      setShowRejectForm(false);
      setRejectionReason("");
      refetch();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setVerifySaving(false);
    }
  }

  return (
    <>
      <AdminTopbar title="Order details" user={user} />
      <main className="p-4 lg:p-8">
        <Link
          href="/admin/orders"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-pink-500"
        >
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 px-4 py-2.5 text-sm text-green-600">
            {success}
          </div>
        )}

        {isLoading && (
          <div className="space-y-4">
            <div className="h-40 w-full animate-pulse rounded-xl bg-gray-100" />
            <div className="h-64 w-full animate-pulse rounded-xl bg-gray-100" />
          </div>
        )}

        {isError && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
            Couldn&apos;t load this order. It may not exist, or the backend
            isn&apos;t reachable.
          </div>
        )}

        {order && (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="space-y-6 xl:col-span-2">
              <FadeInSection className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {order.orderNumber}
                    </h2>
                    <p className="text-sm text-gray-400">
                      Placed {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="divide-y">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Qty {item.quantity} &times;{" "}
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </FadeInSection>

              <FadeInSection
                delay={0.08}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >
                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                  Shipping address
                </h2>
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">
                    {order.shippingAddress.fullName}
                  </p>
                  <p>{order.shippingAddress.phone}</p>
                  <p>
                    {order.shippingAddress.addressLine1}
                    {order.shippingAddress.addressLine2
                      ? `, ${order.shippingAddress.addressLine2}`
                      : ""}
                  </p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </FadeInSection>
            </div>

            <div className="space-y-6">
              <FadeInSection
                delay={0.05}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >
                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                  Update status
                </h2>
                {order.status === "delivered" ||
                order.status === "cancelled" ? (
                  <p className="text-sm text-gray-400">
                    This order is {order.status} and can no longer be changed.
                  </p>
                ) : (
                  <select
                    value={order.status}
                    disabled={statusSaving}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="h-10 w-full rounded-lg border px-3 text-sm capitalize disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} className="capitalize">
                        {s}
                      </option>
                    ))}
                  </select>
                )}
              </FadeInSection>

              <FadeInSection
                delay={0.1}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >
                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                  Payment
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Method</span>
                    <span className="font-medium capitalize text-gray-900">
                      {order.payment.method.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status</span>
                    <PaymentStatusBadge status={order.payment.status} />
                  </div>
                  {order.payment.transactionId && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Transaction ID</span>
                      <span className="font-mono text-xs text-gray-900">
                        {order.payment.transactionId}
                      </span>
                    </div>
                  )}

                  {order.payment.method === "bank_transfer" &&
                    order.payment.bankTransfer?.receipt?.url && (
                      <div className="space-y-3 border-t pt-3">
                        <a
                          href={order.payment.bankTransfer.receipt.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block overflow-hidden rounded-lg border"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={order.payment.bankTransfer.receipt.url}
                            alt="Payment receipt"
                            className="h-40 w-full object-cover"
                          />
                        </a>
                        <a
                          href={order.payment.bankTransfer.receipt.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs font-medium text-pink-500 hover:underline"
                        >
                          View full receipt <ExternalLink className="h-3 w-3" />
                        </a>
                        {order.payment.bankTransfer.referenceNumber && (
                          <p className="text-xs text-gray-400">
                            Reference:{" "}
                            {order.payment.bankTransfer.referenceNumber}
                          </p>
                        )}

                        {order.payment.status === "pending_verification" && (
                          <div className="space-y-2">
                            {showRejectForm && (
                              <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  Rejection reason
                                </label>
                                <textarea
                                  value={rejectionReason}
                                  onChange={(e) =>
                                    setRejectionReason(e.target.value)
                                  }
                                  placeholder="Explain why this payment is being rejected"
                                  rows={2}
                                  className="w-full rounded-lg border px-3 py-2 text-sm"
                                />
                              </div>
                            )}
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleVerify("approve")}
                                disabled={verifySaving}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                              >
                                <Check className="h-4 w-4" /> Approve
                              </button>
                              <button
                                onClick={() => handleVerify("reject")}
                                disabled={verifySaving}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                              >
                                <X className="h-4 w-4" /> Reject
                              </button>
                            </div>
                          </div>
                        )}

                        {order.payment.bankTransfer.rejectionReason && (
                          <p className="rounded-lg bg-red-50 p-2 text-xs text-red-600">
                            Rejected:{" "}
                            {order.payment.bankTransfer.rejectionReason}
                          </p>
                        )}
                      </div>
                    )}
                </div>
              </FadeInSection>

              <FadeInSection
                delay={0.15}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >
                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                  Summary
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Items</span>
                    <span>{formatCurrency(order.itemsTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span>{formatCurrency(order.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold text-gray-900">
                    <span>Total</span>
                    <span>{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </FadeInSection>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

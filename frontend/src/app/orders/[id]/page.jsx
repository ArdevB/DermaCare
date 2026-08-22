"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Upload } from "lucide-react";
import { useMyOrder } from "@/hooks/useStorefront";
import {
  cancelOrder,
  submitBankTransfer,
  initiateKhalti,
} from "@/lib/shopActions";
import { getErrorMessage } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUS_STYLE = {
  pending: "bg-amber-50 text-amber-600",
  processing: "bg-blue-50 text-blue-600",
  shipped: "bg-pink-50 text-pink-600",
  delivered: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-600",
};

export default function OrderDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { order, isLoading, isError, refetch } = useMyOrder(id);

  const [referenceNumber, setReferenceNumber] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [payingKhalti, setPayingKhalti] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmitReceipt(e) {
    e.preventDefault();
    if (!referenceNumber.trim()) {
      setError("Enter your transfer reference number.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await submitBankTransfer(id, referenceNumber.trim(), receiptFile);
      setSuccess("Payment proof submitted. Our team will verify it shortly.");
      refetch();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancel() {
    setError("");
    setCancelling(true);
    try {
      await cancelOrder(id);
      refetch();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCancelling(false);
    }
  }

  async function handlePayKhalti() {
    setError("");
    setPayingKhalti(true);
    try {
      const res = await initiateKhalti(id);
      window.location.href = res.data.paymentUrl;
    } catch (err) {
      setError(getErrorMessage(err));
      setPayingKhalti(false);
    }
  }

  if (isLoading) {
    return (
      <main className="container mx-auto px-6 py-10">
        <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
      </main>
    );
  }

  if (isError || !order) {
    return (
      <main className="container mx-auto px-6 py-16 text-center">
        <p className="text-gray-500">
          This order couldn&apos;t be found, or you don&apos;t have access to
          it.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-block text-pink-500 hover:underline"
        >
          Back to dashboard
        </Link>
      </main>
    );
  }

  const canCancel = ["pending", "processing"].includes(order.status);
  const needsBankTransferProof =
    order.payment.method === "bank_transfer" &&
    order.payment.status === "pending" &&
    !order.payment.bankTransfer?.receipt?.url;
  const needsKhaltiPayment =
    order.payment.method === "khalti" && order.payment.status !== "paid";

  return (
    <main className="bg-gray-50 min-h-[70vh]">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <Link
          href="/dashboard?tab=orders"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-pink-500"
        >
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>

        <div className="rounded-xl border bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {order.orderNumber}
                </h1>
                <p className="text-sm text-gray-500">
                  Placed {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                STATUS_STYLE[order.status] ?? "bg-gray-100 text-gray-600"
              }`}
            >
              {order.status}
            </span>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 rounded-lg bg-green-50 px-4 py-2.5 text-sm text-green-600">
              {success}
            </div>
          )}

          <div className="mt-6 divide-y border-t">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    Qty {item.quantity} &times; {formatCurrency(item.price)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1.5 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Items</span>
              <span>{formatCurrency(order.itemsTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span>{formatCurrency(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t pt-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Shipping Address
              </h2>
              <div className="mt-2 text-sm text-gray-600">
                <p>{order.shippingAddress.fullName}</p>
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
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Payment</h2>
              <div className="mt-2 text-sm text-gray-600 space-y-1">
                <p className="capitalize">
                  Method: {order.payment.method.replace("_", " ")}
                </p>
                <p className="capitalize">
                  Status: {order.payment.status.replace("_", " ")}
                </p>
                {order.payment.bankTransfer?.rejectionReason && (
                  <p className="text-red-600">
                    Rejected: {order.payment.bankTransfer.rejectionReason}
                  </p>
                )}
              </div>
            </div>
          </div>

          {needsKhaltiPayment && (
            <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50 p-4">
              <p className="text-sm text-purple-700">
                This order hasn&apos;t been paid yet. Complete payment with
                Khalti to proceed.
              </p>
              <button
                onClick={handlePayKhalti}
                disabled={payingKhalti}
                className="mt-3 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
              >
                {payingKhalti ? "Redirecting..." : "Pay with Khalti"}
              </button>
            </div>
          )}

          {needsBankTransferProof && (
            <form
              onSubmit={handleSubmitReceipt}
              className="mt-6 rounded-lg border p-4"
            >
              <h2 className="text-sm font-semibold text-gray-900">
                Submit Payment Proof
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Transfer {formatCurrency(order.totalAmount)} to our bank
                account, then submit your reference number and receipt below.
              </p>
              <div className="mt-3 space-y-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Reference number
                  </label>
                  <input
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border px-3 text-sm"
                    placeholder="e.g. TXN123456"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Receipt image (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setReceiptFile(e.target.files?.[0] ?? null)
                    }
                    className="mt-1 w-full text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 rounded-lg bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600 disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  {submitting ? "Submitting..." : "Submit Proof"}
                </button>
              </div>
            </form>
          )}

          {order.payment.bankTransfer?.receipt?.url && (
            <p className="mt-4 text-xs text-gray-400">
              Receipt submitted{" "}
              {order.payment.bankTransfer.submittedAt
                ? `on ${formatDate(order.payment.bankTransfer.submittedAt)}`
                : ""}
              . Awaiting admin verification.
            </p>
          )}

          {canCancel && (
            <div className="mt-6 border-t pt-4">
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="text-sm text-red-500 hover:underline disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Cancel this order"}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

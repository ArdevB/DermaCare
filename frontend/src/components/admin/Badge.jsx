import { cn } from "@/lib/utils";

const variants = {
  default: "bg-pink-50 text-pink-600",
  success: "bg-green-50 text-green-600",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-red-50 text-red-600",
  info: "bg-blue-50 text-blue-600",
  outline: "border border-gray-200 text-gray-500",
};

export function Badge({ variant = "default", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

const orderStatusVariant = {
  pending: "warning",
  processing: "info",
  shipped: "default",
  delivered: "success",
  cancelled: "danger",
};

export function OrderStatusBadge({ status }) {
  return (
    <Badge variant={orderStatusVariant[status] ?? "default"} className="capitalize">
      {status}
    </Badge>
  );
}

const paymentStatusVariant = {
  pending: "warning",
  pending_verification: "info",
  paid: "success",
  failed: "danger",
  refunded: "outline",
};

export function PaymentStatusBadge({ status }) {
  return (
    <Badge variant={paymentStatusVariant[status] ?? "default"} className="capitalize">
      {status?.replace("_", " ")}
    </Badge>
  );
}

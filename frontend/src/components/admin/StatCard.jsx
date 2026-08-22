import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({ label, value, icon: Icon, changePct, badge }) {
  const showChange = typeof changePct === "number" && Number.isFinite(changePct);
  const isPositive = (changePct ?? 0) >= 0;

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-50 text-pink-500">
          <Icon className="h-4.5 w-4.5" />
        </span>
        {showChange ? (
          <span
            className={cn(
              "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
              isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            )}
          >
            {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(changePct).toFixed(1)}%
          </span>
        ) : badge ? (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-2xl font-semibold text-gray-900">{value}</p>
      <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
    </div>
  );
}

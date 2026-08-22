"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function PaginationBar({ pagination, onPageChange }) {
  if (!pagination || pagination.pages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t px-5 py-3">
      <p className="text-xs text-gray-400">
        Page {pagination.page} of {pagination.pages} &middot; {pagination.total} total
      </p>
      <div className="flex gap-2">
        <button
          disabled={pagination.page <= 1}
          onClick={() => onPageChange(pagination.page - 1)}
          className="flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>
        <button
          disabled={pagination.page >= pagination.pages}
          onClick={() => onPageChange(pagination.page + 1)}
          className="flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

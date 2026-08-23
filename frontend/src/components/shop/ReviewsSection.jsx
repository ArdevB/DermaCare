"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquareText, ShieldCheck, Trash2 } from "lucide-react";
import { useShop } from "@/hooks/useShop";
import { useApiQuery } from "@/hooks/useApiQuery";
import {
  upsertReview,
  deleteReview as deleteReviewRequest,
  getMyReview,
} from "@/lib/reviewActions";
import { getErrorMessage } from "@/lib/api";
import { formatDate, initials } from "@/lib/format";
import {
  StarRatingDisplay,
  StarRatingInput,
} from "@/components/shop/StarRating";

export function ReviewsSection({ productId, ratingsSummary, onChanged }) {
  const { user } = useShop();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useApiQuery(
    `/reviews/${productId}`,
    { page, limit: 5 },
  );

  const [myReview, setMyReview] = useState(null);
  const [myReviewLoaded, setMyReviewLoaded] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMyReview(null);
      setMyReviewLoaded(true);
      return;
    }
    let cancelled = false;
    getMyReview(productId)
      .then((res) => {
        if (cancelled) return;
        setMyReview(res.data.review);
        if (res.data.review) {
          setRating(res.data.review.rating);
          setComment(res.data.review.comment || "");
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setMyReviewLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [user, productId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (rating < 1) {
      setError("Please select a star rating.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const res = await upsertReview(productId, { rating, comment });
      setMyReview(res.data.review);
      setFormOpen(false);
      refetch();
      onChanged?.();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setError("");
    setDeleting(true);
    try {
      await deleteReviewRequest(productId);
      setMyReview(null);
      setRating(0);
      setComment("");
      refetch();
      onChanged?.();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  const reviews = data?.reviews ?? [];
  const pagination = data?.pagination ?? null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <StarRatingDisplay
            value={ratingsSummary?.average ?? 0}
            size="h-5 w-5"
          />
          <span className="text-sm text-gray-600">
            {(ratingsSummary?.average ?? 0).toFixed(1)} out of 5 &middot;{" "}
            {ratingsSummary?.count ?? 0} review
            {ratingsSummary?.count === 1 ? "" : "s"}
          </span>
        </div>

        {myReviewLoaded &&
          (user ? (
            !formOpen && (
              <button
                onClick={() => setFormOpen(true)}
                className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600"
              >
                {myReview ? "Edit your review" : "Write a review"}
              </button>
            )
          ) : (
            <Link
              href={`/login?redirect=${encodeURIComponent(`/products/${productId}`)}`}
              className="text-sm font-medium text-pink-500 hover:underline"
            >
              Log in to write a review
            </Link>
          ))}
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {formOpen && (
        <form onSubmit={handleSubmit} className="mt-4 rounded-lg border p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Your rating
          </p>
          <div className="mt-1.5">
            <StarRatingInput value={rating} onChange={setRating} />
          </div>
          <div className="mt-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Your review (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Share what you thought about this product..."
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Submit review"}
            </button>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            {myReview && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="ml-auto flex items-center gap-1.5 text-sm text-red-500 hover:underline disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />{" "}
                {deleting ? "Deleting..." : "Delete review"}
              </button>
            )}
          </div>
        </form>
      )}

      <div className="mt-6 divide-y">
        {isError && (
          <p className="py-6 text-center text-sm text-red-500">
            Couldn&apos;t load reviews.
          </p>
        )}
        {isLoading ? (
          <div className="space-y-3 py-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-16 w-full animate-pulse rounded-lg bg-gray-100"
              />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">
            <MessageSquareText className="mx-auto mb-2 h-8 w-8 text-gray-300" />
            No reviews yet. Be the first to share your thoughts.
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-100 text-xs font-semibold text-pink-600">
                  {initials(review.user?.name || "U")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {review.user?.name || "Anonymous"}
                    </p>
                    {review.verifiedPurchase && (
                      <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600">
                        <ShieldCheck className="h-3 w-3" /> Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <StarRatingDisplay
                      value={review.rating}
                      size="h-3.5 w-3.5"
                    />
                    <span className="text-xs text-gray-400">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              {review.comment && (
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            disabled={pagination.page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-xs text-gray-400">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            disabled={pagination.page >= pagination.pages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

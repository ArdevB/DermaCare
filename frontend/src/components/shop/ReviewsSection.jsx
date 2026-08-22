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

  // --------------------------------------------------
  // Reviews list
  // --------------------------------------------------

  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useApiQuery(
    `/reviews/${productId}`,
    {
      page,
      limit: 5,
    },
  );

  // --------------------------------------------------
  // Current user's review
  // --------------------------------------------------

  const [myReview, setMyReview] = useState(null);
  const [myReviewLoaded, setMyReviewLoaded] = useState(false);

  // --------------------------------------------------
  // Review form
  // --------------------------------------------------

  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // --------------------------------------------------
  // Request states
  // --------------------------------------------------

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  // --------------------------------------------------
  // Load current user's review
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    async function loadMyReview() {
      setMyReviewLoaded(false);

      if (!user) {
        setMyReview(null);
        setRating(0);
        setComment("");
        setFormOpen(false);
        setMyReviewLoaded(true);
        return;
      }

      try {
        const res = await getMyReview(productId);

        if (cancelled) return;

        const review = res?.data?.review ?? null;

        setMyReview(review);

        if (review) {
          setRating(review.rating ?? 0);
          setComment(review.comment ?? "");
        } else {
          setRating(0);
          setComment("");
        }
      } catch (err) {
        if (cancelled) return;

        // If there is no review yet, simply treat it as
        // no review rather than showing an error.
        setMyReview(null);
        setRating(0);
        setComment("");
      } finally {
        if (!cancelled) {
          setMyReviewLoaded(true);
        }
      }
    }

    loadMyReview();

    return () => {
      cancelled = true;
    };
  }, [user, productId]);

  // --------------------------------------------------
  // Reviews data
  // --------------------------------------------------

  const reviews = data?.reviews ?? [];
  const pagination = data?.pagination ?? null;

  // --------------------------------------------------
  // Rating summary
  //
  // Normally we use ratingsSummary from the product.
  //
  // If the product says there are 0 reviews but the
  // reviews API has reviews, calculate a fallback.
  // This fixes the situation shown in your screenshot.
  // --------------------------------------------------

  const summaryCount = Number(ratingsSummary?.count ?? 0);

  const summaryAverage = Number(ratingsSummary?.average ?? 0);

  const fallbackAverage =
    reviews.length > 0
      ? reviews.reduce(
          (total, review) => total + Number(review.rating ?? 0),
          0,
        ) / reviews.length
      : 0;

  const actualAverage = summaryCount > 0 ? summaryAverage : fallbackAverage;

  const actualReviewCount = summaryCount > 0 ? summaryCount : reviews.length;

  // --------------------------------------------------
  // Open form
  // --------------------------------------------------

  function handleOpenForm() {
    setError("");

    if (myReview) {
      setRating(myReview.rating ?? 0);
      setComment(myReview.comment ?? "");
    } else {
      setRating(0);
      setComment("");
    }

    setFormOpen(true);
  }

  // --------------------------------------------------
  // Close form
  // --------------------------------------------------

  function handleCloseForm() {
    if (saving || deleting) return;

    setError("");
    setFormOpen(false);

    // Restore original review values
    if (myReview) {
      setRating(myReview.rating ?? 0);
      setComment(myReview.comment ?? "");
    } else {
      setRating(0);
      setComment("");
    }
  }

  // --------------------------------------------------
  // Submit / Update review
  // --------------------------------------------------

  async function handleSubmit(e) {
    e.preventDefault();

    if (saving || deleting) return;

    setError("");

    if (rating < 1 || rating > 5) {
      setError("Please select a star rating.");
      return;
    }

    setSaving(true);

    try {
      const res = await upsertReview(productId, {
        rating,
        comment: comment.trim(),
      });

      const review = res?.data?.review ?? null;

      setMyReview(review);

      if (review) {
        setRating(review.rating ?? 0);
        setComment(review.comment ?? "");
      }

      setFormOpen(false);

      // Refresh review list
      await refetch();

      // Refresh product data / rating summary
      onChanged?.();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------------------------
  // Delete review
  // --------------------------------------------------

  async function handleDelete() {
    if (!myReview || deleting || saving) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete your review?",
    );

    if (!confirmed) return;

    setError("");
    setDeleting(true);

    try {
      await deleteReviewRequest(productId);

      setMyReview(null);
      setRating(0);
      setComment("");

      // Close the edit form
      setFormOpen(false);

      // Refresh review list
      await refetch();

      // Refresh product rating summary
      onChanged?.();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div>
      {/* ==================================================
          RATING SUMMARY
          ================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <StarRatingDisplay value={actualAverage} size="h-5 w-5" />

          <span className="text-sm text-gray-600">
            {actualAverage.toFixed(1)} out of 5{" · "}
            {actualReviewCount} review{actualReviewCount === 1 ? "" : "s"}
          </span>
        </div>

        {/* ==================================================
            REVIEW BUTTON
            ================================================== */}

        {myReviewLoaded &&
          (user ? (
            !formOpen && (
              <button
                type="button"
                onClick={handleOpenForm}
                className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-600"
              >
                {myReview ? "Edit your review" : "Write a review"}
              </button>
            )
          ) : (
            <Link
              href={`/login?redirect=${encodeURIComponent(
                `/products/${productId}`,
              )}`}
              className="text-sm font-medium text-pink-500 hover:underline"
            >
              Log in to write a review
            </Link>
          ))}
      </div>

      {/* ==================================================
          ERROR
          ================================================== */}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {/* ==================================================
          REVIEW FORM
          ================================================== */}

      {formOpen && user && (
        <form onSubmit={handleSubmit} className="mt-4 rounded-lg border p-4">
          {/* Rating */}

          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Your rating
          </p>

          <div className="mt-1.5">
            <StarRatingInput value={rating} onChange={setRating} />
          </div>

          {/* Comment */}

          <div className="mt-3">
            <label
              htmlFor={`review-comment-${productId}`}
              className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Your review (optional)
            </label>

            <textarea
              id={`review-comment-${productId}`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={1000}
              disabled={saving || deleting}
              placeholder="Share what you thought about this product..."
              className="mt-1 w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-pink-400 focus:ring-1 focus:ring-pink-400 disabled:cursor-not-allowed disabled:bg-gray-50"
            />

            <div className="mt-1 text-right text-xs text-gray-400">
              {comment.length}/1000
            </div>
          </div>

          {/* Buttons */}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {/* Submit */}

            <button
              type="submit"
              disabled={saving || deleting}
              className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : myReview
                  ? "Update review"
                  : "Submit review"}
            </button>

            {/* Cancel */}

            <button
              type="button"
              onClick={handleCloseForm}
              disabled={saving || deleting}
              className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            {/* Delete */}

            {myReview && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving || deleting}
                className="ml-auto flex items-center gap-1.5 text-sm text-red-500 transition hover:text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />

                {deleting ? "Deleting..." : "Delete review"}
              </button>
            )}
          </div>
        </form>
      )}

      {/* ==================================================
          REVIEWS LIST
          ================================================== */}

      <div className="mt-6 divide-y">
        {/* API Error */}

        {isError && (
          <p className="py-6 text-center text-sm text-red-500">
            Couldn't load reviews.
          </p>
        )}

        {/* Loading */}

        {isLoading ? (
          <div className="space-y-3 py-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-16 w-full animate-pulse rounded-lg bg-gray-100"
              />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          /* Empty */

          <div className="py-10 text-center text-sm text-gray-400">
            <MessageSquareText className="mx-auto mb-2 h-8 w-8 text-gray-300" />
            No reviews yet. Be the first to share your thoughts.
          </div>
        ) : (
          /* Reviews */

          reviews.map((review) => (
            <div key={review._id} className="py-4">
              <div className="flex items-center gap-3">
                {/* Avatar */}

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-100 text-xs font-semibold text-pink-600">
                  {initials(review.user?.name || "U")}
                </div>

                <div className="min-w-0 flex-1">
                  {/* User */}

                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {review.user?.name || "Anonymous"}
                    </p>

                    {/* Verified purchase */}

                    {review.verifiedPurchase && (
                      <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600">
                        <ShieldCheck className="h-3 w-3" />
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  {/* Rating + Date */}

                  <div className="mt-0.5 flex items-center gap-2">
                    <StarRatingDisplay
                      value={review.rating ?? 0}
                      size="h-3.5 w-3.5"
                    />

                    <span className="text-xs text-gray-400">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comment */}

              {review.comment && (
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {review.comment}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* ==================================================
          PAGINATION
          ================================================== */}

      {pagination && pagination.pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {/* Previous */}

          <button
            type="button"
            disabled={pagination.page <= 1}
            onClick={() => setPage((currentPage) => currentPage - 1)}
            className="rounded-lg border px-3 py-1.5 text-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Prev
          </button>

          {/* Page number */}

          <span className="text-xs text-gray-400">
            Page {pagination.page} of {pagination.pages}
          </span>

          {/* Next */}

          <button
            type="button"
            disabled={pagination.page >= pagination.pages}
            onClick={() => setPage((currentPage) => currentPage + 1)}
            className="rounded-lg border px-3 py-1.5 text-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

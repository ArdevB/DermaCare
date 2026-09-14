"use client";

import { useState } from "react";

export default function ReviewPage() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Anisha K.",
      product: "CeraVe Moisturizing Cream",
      rating: 5,
      review:
        "Really happy with this product. It feels light on my skin and keeps my skin moisturized throughout the day.",
      date: "2 days ago",
    },
    {
      id: 2,
      name: "Srijana R.",
      product: "The Ordinary Niacinamide",
      rating: 4,
      review:
        "I have been using it for a few weeks and my skin feels smoother. Good product for the price.",
      date: "1 week ago",
    },
    {
      id: 3,
      name: "Prakriti M.",
      product: "Maybelline Fit Me Foundation",
      rating: 5,
      review:
        "The shade matched my skin really well. It looks natural and does not feel too heavy.",
      date: "2 weeks ago",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    product: "",
    rating: 5,
    review: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.product || !form.review) {
      alert("Please fill in all fields.");
      return;
    }

    const newReview = {
      id: Date.now(),
      name: form.name,
      product: form.product,
      rating: Number(form.rating),
      review: form.review,
      date: "Just now",
    };

    setReviews([newReview, ...reviews]);

    setForm({
      name: "",
      product: "",
      rating: 5,
      review: "",
    });
  };

  return (
    <main className="min-h-screen bg-[#fff8fa]">
      {/* HERO SECTION */}
      <section className="bg-[#3A5134] px-6 py-16 text-center">
        <h1 className="text-4xl font-bold text-pink-200 md:text-5xl">
          Customer Reviews
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/90 md:text-base">
          Real experiences from our DermaCare customers. Your feedback helps us
          improve and helps others shop with confidence.
        </p>
      </section>

      {/* RATING SUMMARY */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Average Rating */}
          <div className="rounded-2xl bg-white p-7 text-center shadow-sm">
            <h2 className="text-5xl font-bold text-[#3A5134]">4.7</h2>

            <div className="mt-3 text-xl text-yellow-500">★★★★★</div>

            <p className="mt-2 text-sm text-gray-500">
              Based on {reviews.length} reviews
            </p>
          </div>

          {/* Rating Bars */}
          <div className="rounded-2xl bg-white p-7 shadow-sm md:col-span-2">
            <h3 className="mb-5 text-lg font-semibold text-[#3A5134]">
              Rating Summary
            </h3>

            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="mb-3 flex items-center gap-3">
                <span className="w-12 text-sm text-gray-600">{star} ★</span>

                <div className="h-2 flex-1 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-pink-300"
                    style={{
                      width:
                        star === 5
                          ? "75%"
                          : star === 4
                            ? "20%"
                            : star === 3
                              ? "5%"
                              : "0%",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="mb-7">
          <h2 className="text-2xl font-bold text-[#3A5134]">
            What Our Customers Say
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Honest reviews from people who purchased from DermaCare.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              {/* CUSTOMER INFORMATION */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Initial Circle */}
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-pink-100 font-semibold text-[#3A5134]">
                    {review.name.charAt(0)}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {review.name}
                    </h3>

                    <p className="text-xs text-gray-400">Verified customer</p>
                  </div>
                </div>

                <span className="text-xs text-gray-400">{review.date}</span>
              </div>

              {/* STAR RATING */}
              <div className="mt-4 text-lg">
                <span className="text-yellow-500">
                  {"★".repeat(review.rating)}
                </span>

                <span className="text-gray-300">
                  {"★".repeat(5 - review.rating)}
                </span>
              </div>

              {/* PRODUCT NAME */}
              <p className="mt-3 text-sm font-medium text-[#3A5134]">
                {review.product}
              </p>

              {/* REVIEW TEXT */}
              <p className="mt-2 text-sm leading-6 text-gray-600">
                "{review.review}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WRITE REVIEW SECTION */}
      <section className="bg-pink-50 px-6 py-14">
        <div className="mx-auto max-w-2xl">
          {/* Heading */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-[#3A5134]">
              Share Your Experience
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Tell us what you think about your DermaCare purchase.
            </p>
          </div>

          {/* REVIEW FORM */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white p-6 shadow-sm md:p-8"
          >
            {/* NAME */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Your Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#3A5134]"
              />
            </div>

            {/* PRODUCT */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Product
              </label>

              <input
                type="text"
                placeholder="Which product did you buy?"
                value={form.product}
                onChange={(e) =>
                  setForm({
                    ...form,
                    product: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#3A5134]"
              />
            </div>

            {/* RATING */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Your Rating
              </label>

              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() =>
                      setForm({
                        ...form,
                        rating: star,
                      })
                    }
                    className={`text-3xl transition ${
                      star <= form.rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* REVIEW */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Your Review
              </label>

              <textarea
                rows="5"
                placeholder="Write your honest experience..."
                value={form.review}
                onChange={(e) =>
                  setForm({
                    ...form,
                    review: e.target.value,
                  })
                }
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#3A5134]"
              ></textarea>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full rounded-lg bg-[#3A5134] px-6 py-3 font-medium text-white transition hover:bg-[#2e4029]"
            >
              Submit Review
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

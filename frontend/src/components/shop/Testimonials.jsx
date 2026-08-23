"use client";

import { Quote } from "lucide-react";
import { StarRatingDisplay } from "@/components/shop/StarRating";
import {
  FadeInSection,
  StaggerGrid,
  StaggerItem,
} from "@/components/shop/FadeInSection";

// Curated launch copy - swap these for real customer quotes once you have
// reviews coming in (or pull your highest-rated product reviews here).
const TESTIMONIALS = [
  {
    name: "User 1",
    role: "Verified Customer",
    rating: 5,
    quote:
      "My skin has never felt this balanced. The night cream absorbs fast and I actually see a difference after two weeks.",
  },
  {
    name: "User 2",
    role: "Verified Customer",
    rating: 5,
    quote:
      "Fast delivery and the packaging was so carefully done. Everything arrived safe and the products feel premium.",
  },
  {
    name: "User 3",
    role: "Verified Customer",
    rating: 4,
    quote:
      "Great range for sensitive skin. Customer support helped me pick the right cleanser and it's been a great match.",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-pink-50">
      <div className="max-w-6xl mx-auto px-6">
        <FadeInSection className="text-center mb-12">
          <p className="text-gray-500 text-sm tracking-wide">WHAT PEOPLE SAY</p>
          <h2 className="text-3xl font-display font-semibold text-[#3A5134] mt-1">
            Loved by Our Customers
          </h2>
        </FadeInSection>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <StaggerItem key={t.name}>
              <div className="h-full rounded-2xl bg-white p-6 shadow-sm border border-pink-100">
                <Quote className="h-6 w-6 text-pink-300" />
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {t.quote}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                  <StarRatingDisplay value={t.rating} size="h-3.5 w-3.5" />
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}

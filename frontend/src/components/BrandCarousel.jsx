"use client";

import { useState } from "react";

const brands = [
  {
    name: "Cosrx",
    image: "/images/cosrx.png",
  },
  {
    name: "Anua",
    image: "/images/anua.png",
  },
  {
    name: "K-SECRET",
    image: "/images/ksecret.png",
  },
  {
    name: "Dr. Althea",
    image: "/images/dr.althea.png",
  },
  {
    name: "I'M FROM",
    image: "/images/imfrom.png",
  },
  {
    name: "Purito",
    image: "/images/purito.png",
  },
  {
    name: "Tirtir",
    image: "/images/tirtir.png",
  },
  {
    name: "Skin 1004",
    image: "/images/skin1004.png",
  },
];

export default function BrandCarousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    if (current < brands.length - 4) {
      setCurrent(current + 1);
    }
  };

  const prevSlide = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  return (
    <section className="w-full bg-[#f8f8ff] py-12">
      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Heading + Arrows */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#ed2f68]">
              Popular Brands
            </h2>

            <div className="w-24 h-[3px] bg-[#ed2f68] mt-3"></div>
          </div>

          {/* Arrow Buttons */}
          <div className="flex gap-2">
            {/* Previous */}
            <button
              onClick={prevSlide}
              disabled={current === 0}
              aria-label="Previous brands"
              className={`w-12 h-12 rounded-full flex items-center justify-center
                text-3xl font-light transition duration-300
                ${
                  current === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#ed2f68] text-white hover:bg-[#d9255c]"
                }`}
            >
              ‹
            </button>

            {/* Next */}
            <button
              onClick={nextSlide}
              disabled={current >= brands.length - 4}
              aria-label="Next brands"
              className={`w-12 h-12 rounded-full flex items-center justify-center
                text-3xl font-light transition duration-300
                ${
                  current >= brands.length - 4
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#ed2f68] text-white hover:bg-[#d9255c]"
                }`}
            >
              ›
            </button>
          </div>
        </div>

        {/* Carousel Wrapper */}
        <div className="overflow-hidden">
          {/* Sliding Track */}
          <div
            className="flex gap-5 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${current * 25.5}%)`,
            }}
          >
            {brands.map((brand, index) => (
              <div
                key={index}
                className="
                  flex-shrink-0
                  w-[calc(25%-15px)]
                  md:w-[calc(50%-10px)]
                  lg:w-[calc(25%-15px)]
                "
              >
                {/* Brand Card */}
                <div
                  className="bg-white rounded-2xl overflow-hidden shadow-sm
                                hover:shadow-md transition duration-300"
                >
                  {/* Image */}
                  <div className="w-full h-[500px] overflow-hidden">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="
                        w-full
                        h-full
                        object-cover
                        hover:scale-105
                        transition
                        duration-500
                      "
                    />
                  </div>

                  {/* Brand Name */}
                  <div className="px-5 py-5">
                    <h3 className="text-xl font-semibold text-[#ed2f68]">
                      {brand.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

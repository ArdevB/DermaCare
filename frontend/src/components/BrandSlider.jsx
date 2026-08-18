"use client";

import Image from "next/image";

const row1 = [
  { name: "Anua", src: "/images/brand/anua1.png" },
  { name: "CeraVe", src: "/images/brand/cerave.jpg" },
  { name: "lagirl", src: "/images/brand/lagirl.png" },
  { name: "sheglam", src: "/images/brand/sheglam.png" },
  { name: "maybelline", src: "/images/brand/maybelline.png" },
  { name: "cetaphill", src: "/images/brand/cetaphil.jfif" },
  {name:"technic", src:"/images/brand/technic.png"},
  {name:"dermaco", src:"/images/brand/dermaco.webp"},
  {name:"mars", src:"/images/brand/mars.webp"},
  {name:"swisbeauty", src:"/images/brand/swisbeauty.webp"},
];

const row2 = [
  { name: "mamaearth", src: "/images/brand/mamaearth.png" },
  { name: "loreal", src: "/images/brand/loreal.png" },
  { name: "minimalist", src: "/images/brand/minimalist.jpg"},
  { name: "piligrim", src: "/images/brand/pilgrim.png" },
  { name: "plum", src: "/images/brand/plump.png" },
  { name: "dotkey", src: "/images/brand/dotkey.webp" },
  {name: "chemistplay", src:"/images/brand/chemistplay.jpg"},
];

function BrandRow({ brands, reverse = false }) {
  return (
    <div className="w-full overflow-hidden">
      <div
        className={`flex w-max ${
          reverse ? "animate-brand-right" : "animate-brand-left"
        }`}
      >
        {/* First copy */}
        <div className="flex shrink-0 items-center gap-16 px-8">
          {brands.map((brand, index) => (
            <div
              key={`first-${index}`}
              className="flex h-20 w-32 shrink-0 items-center justify-center"
            >
              <Image
                src={brand.src}
                alt={brand.name}
                width={130}
                height={70}
                className="max-h-16 w-auto object-contain"
              />
            </div>
          ))}
        </div>

        {/* Duplicate copy */}
        <div className="flex shrink-0 items-center gap-16 px-8">
          {brands.map((brand, index) => (
            <div
              key={`second-${index}`}
              className="flex h-20 w-32 shrink-0 items-center justify-center"
            >
              <Image
                src={brand.src}
                alt={brand.name}
                width={130}
                height={70}
                className="max-h-16 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BrandSlider() {
  return (
    <section className="w-full overflow-hidden bg-white py-8">
      
      {/* Row 1 → moves left */}
      <BrandRow brands={row1} />

      {/* Row 2 → moves right */}
      <BrandRow brands={row2} reverse />

    </section>
  );
}
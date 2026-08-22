"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import BrandCarousel from "@/components/BrandCarousel";
import { useApiQuery } from "@/hooks/useApiQuery";
import { HomeProductSection } from "@/components/shop/HomeProductSection";
import { Testimonials } from "@/components/shop/Testimonials";
import {
  FadeInSection,
  StaggerGrid,
  StaggerItem,
} from "@/components/shop/FadeInSection";
import BrandSlider from "@/components/BrandSlider";

const CATEGORY_TILES = [
  {
    keyword: "makeup",
    href: "/makeup",
    label: "Makeup",
    image: "images/img2.png",
  },
  {
    keyword: "skincare",
    href: "/skincare",
    label: "Skincare",
    image: "images/img3.png",
  },
  {
    keyword: "haircare",
    href: "/haircare",
    label: "Haircare",
    image: "images/img4.png",
  },
  {
    keyword: "bodycare",
    href: "/bodycare",
    label: "Bodycare",
    image: "images/img5.png",
  },
];

const Home = () => {
  const { data: categoriesData } = useApiQuery("/categories");
  const categories = categoriesData?.categories ?? [];

  const findCategory = (keyword) =>
    categories.find((c) =>
      c.name.toLowerCase().replace(/\s+/g, "").includes(keyword),
    );

  const skincareCategory = findCategory("skincare");
  const bodycareCategory = findCategory("bodycare");

  return (
    <main>
      {/* Hero section */}
      <section className="container h-100">
        <motion.img
          src="images/summer sale.png"
          alt="summersale"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </section>

      {/* Categories section*/}
      <div className="bg-white h-150 mt-60 pt-10">
        <div className="container mx-auto p-4">
          <FadeInSection className="text-center">
            <h3 className="">OUR CATEGORIES</h3>
            <h2 className="font-display font-bold text-2xl text-[#F85DAD]">
              SHOP BY CATEGORIES
            </h2>
          </FadeInSection>
          <StaggerGrid className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10">
            {CATEGORY_TILES.map((tile) => (
              <StaggerItem key={tile.href}>
                <Link
                  href={tile.href}
                  className="flex flex-col items-center hover:text-pink-400"
                >
                  <div className="circle-img">
                    <img
                      src={tile.image}
                      alt={tile.label}
                      className="hover:transform hover:scale-105 transition-all duration-300 ease-in-out"
                    />
                  </div>
                  <p className="mt-3 font-semibold">{tile.label}</p>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </div>

      {/* Latest Products */}
      <HomeProductSection
        eyebrow="JUST ARRIVED"
        title="Latest Products"
        queryParams={{ sort: "newest" }}
        viewAllHref="/search?sort=newest"
      />

      {/* Top Deals (highest rated) */}
      <HomeProductSection
        eyebrow="CUSTOMER FAVOURITES"
        title="Top Deals"
        queryParams={{ sort: "rating" }}
        viewAllHref="/search?sort=rating"
      />

      {/* Skin Care spotlight */}
      {skincareCategory && (
        <HomeProductSection
          eyebrow="FOR YOUR GLOW"
          title="Skin Care"
          queryParams={{ category: skincareCategory._id, sort: "newest" }}
          viewAllHref="/skincare"
        />
      )}

      {/* Body Care spotlight */}
      {bodycareCategory && (
        <HomeProductSection
          eyebrow="HEAD TO TOE"
          title="Body Care"
          queryParams={{ category: bodycareCategory._id, sort: "newest" }}
          viewAllHref="/bodycare"
        />
      )}

      {/* Popular Brands */}
      <section className="py-14 bg-pink-50/40">
        <FadeInSection className="text-center mb-8">
          <p className="text-gray-500 text-sm tracking-wide">OUR PARTNERS</p>
          <h2 className="text-3xl font-display font-semibold text-[#3A5134] mt-1">
            Popular Brands
          </h2>
        </FadeInSection>
        <BrandCarousel />
      </section>

      {/*Brand Slider */}
      <BrandSlider />

      {/* Testimonials */}
      <Testimonials />
    </main>
  );
};
export default Home;

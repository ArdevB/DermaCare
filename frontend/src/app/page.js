import React from "react";
import Link from "next/link";
import BrandCarousel from "@/components/BrandCarousel";
import BrandSlider from "@/components/BrandSlider";
import Parent from "@/components/Parent";

const Home = () => {
  return (
    <main className="">
      {/* Hero section */}
      <section className="container h-100">
        <img src="images/summer sale.png" alt="summersale" />
      </section>
      {/* Categories section*/}
      <div className="bg-white h-150 mt-60 pt-10">
        <div className="container mx-auto p-4">
          <div className="text-center">
            <h3 className="">OUR CATEGORIES</h3>
            <h2 className="font-bold text-2xl text-[#F85DAD]">
              SHOP BY CATEGORIES
            </h2>
          </div>
          <div className="grid grid-cols-4 gap-4 pt-10">
            <Link
              href="/makeup"
              className="flex flex-col items-center hover:text-pink-400"
            >
              <div className="circle-img">
                <img
                  src="images/img2.png"
                  alt="Makeup"
                  className="hover:transform hover:scale-105 transition-all duration-300 ease-in-out"
                />
              </div>
              <p className="mt-3 font-bold">Makeup</p>
              <p className="text-gray-500 text-sm">200 Products</p>
            </Link>

            <Link
              href="/skincare"
              className="flex flex-col items-center hover:text-pink-400"
            >
              <div className="circle-img">
                <img
                  src="images/img3.png"
                  alt="Skincare"
                  className="hover:transform hover:scale-105 transition-all duration-300 ease-in-out"
                />
              </div>
              <p className="mt-3 font-semibold">Skincare</p>
              <p className="text-gray-500 text-sm">200 Products</p>
            </Link>

            <Link
              href="/haircare"
              className="flex flex-col items-center hover:text-pink-400"
            >
              <div className="circle-img">
                <img
                  src="images/img4.png"
                  alt="Haircare"
                  className="hover:transform hover:scale-105 transition-all duration-300 ease-in-out"
                />
              </div>
              <p className="mt-3 font-semibold">Haircare</p>
              <p className="text-gray-500 text-sm">200 Products</p>
            </Link>

            <Link
              href="/bodycare"
              className="flex flex-col items-center hover:text-pink-400"
            >
              <div className="circle-img">
                <img
                  src="images/img5.png"
                  alt="Bodycare"
                  className="hover:transform hover:scale-105 transition-all duration-300 ease-in-out"
                />
              </div>
              <p className="mt-3 font-semibold">Bodycare</p>
              <p className="text-gray-500 text-sm">200 Products</p>
            </Link>
          </div>
        </div>
      </div>
      {/* hot deals */}
      <section className="py-10 bg-white">
        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-gray-500 text-sm tracking-wide">
            LIMITED TIME DEALS
          </p>

          <h2 className="text-3xl font-semibold text-pink-500 mt-1">
            HOT DEALS
          </h2>
        </div>

        {/* Product Grid */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {/* Product 1 */}
            <div className="border border-gray-200 rounded-xl p-3 bg-white hover:shadow hover:border-pink-400">
              <img
                src="/images/settingspray.jpg"
                alt="Setting Spray"
                className="w-full h-72 object-cover rounded-lg hover:transform hover:scale-105 transition-all duration-300 ease-in-out"
              />

              <div className="p-2">
                <div className="flex justify-between items-center mt-3">
                  <p className="text-gray-600 text-sm">Setting Spray</p>

                  <span className="text-yellow-500">
                    ★ <span className="text-gray-600">(0)</span>
                  </span>
                </div>

                <h3 className="font-medium text-lg mt-3 truncate">
                  TECHNIC GLOW SETTER...
                </h3>

                <div className="flex items-center gap-4 mt-3">
                  <span className="text-pink-500 text-xl font-medium">
                    Rs. 1350
                  </span>

                  <span className="text-gray-500 line-through">Rs. 1600</span>
                </div>
              </div>
            </div>

            {/* Product 2 */}
            <div className="border border-gray-200 rounded-xl p-3 bg-white hover:shadow hover:border-pink-400">
              <img
                src="/images/blush.png"
                alt="Blush"
                className="w-full h-72 object-cover rounded-lg hover:transform hover:scale-105 transition-all duration-300 ease-in-out"
              />

              <div className="p-2">
                <div className="flex justify-between items-center mt-3">
                  <p className="text-gray-600 text-sm">Blush</p>

                  <span className="text-yellow-500">
                    ★ <span className="text-gray-600">(0)</span>
                  </span>
                </div>

                <h3 className="font-medium text-lg mt-3 truncate">
                  Technic Pure Blush Matte...
                </h3>

                <div className="flex items-center gap-4 mt-3">
                  <span className="text-pink-500 text-xl font-medium">
                    Rs. 1050
                  </span>

                  <span className="text-gray-500 line-through">Rs. 1275</span>
                </div>
              </div>
            </div>

            {/* Product 3 */}

            <div className="border border-gray-200 rounded-xl p-3 bg-white hover:shadow hover:border-pink-400">
              <img
                src="/images/product3.webp"
                alt="Blush"
                className="w-full h-72 object-cover rounded-lg hover:transform hover:scale-105 transition-all duration-300 ease-in-out"
              />

              <div className="p-2">
                <div className="flex justify-between items-center mt-3">
                  <p className="text-gray-600 text-sm">Setting Spray</p>

                  <span className="text-yellow-500">
                    ★ <span className="text-gray-600">(0)</span>
                  </span>
                </div>

                <h3 className="font-medium text-lg mt-3 truncate">
                  Technic Wake Up & Hydrate Setting Spray
                </h3>

                <div className="flex items-center gap-4 mt-3">
                  <span className="text-pink-500 text-xl font-medium">
                    Rs. 1250
                  </span>

                  <span className="text-gray-500 line-through">Rs. 1650</span>
                </div>
              </div>
            </div>
          </div>

          {/* View All Button */}
          <div className="flex justify-center mt-16 ">
            <Link
              href="/search"
              className="bg-[#3A5134] hover:bg-pink-500  text-white px-6 py-3 rounded-lg flex items-center gap-2 transition"
            >
              <i className="fa fa-shopping-cart"></i>
              View All
            </Link>
          </div>
        </div>

        {/* product swipe */}
        <main>
          {/* Hero Section */}
          <section>{/* Your existing hero code */}</section>

          {/* Categories */}
          <section>{/* Your existing categories */}</section>

          {/* Popular Brands */}
          <BrandCarousel />

          {/* Other Home Page Sections */}
          <section>{/* Products / Best Sellers / etc. */}</section>
        </main>
        {/*smooth ui */}
        <main>
          {/* Hero */}
          <section>{/* Your hero section */}</section>

          {/* Categories */}
          <section>{/* Your categories */}</section>

          {/* Popular Brands */}
          <BrandSlider />

          {/* Best Sellers */}
          <section>{/* Your products */}</section>

          {/* Testimonials */}
          <section>{/* Your testimonials */}</section>
        </main>
      </section>
    </main>
  );
};
export default Home;

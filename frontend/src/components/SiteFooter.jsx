"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-white">
      {/* Benefits Section */}
      <div className="container mx-auto px-6 pt-8 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Fast Delivery */}
          <div className="flex items-center gap-4 bg-pink-50 p-5 rounded-xl">
            <i className="fa-solid fa-truck text-pink-500 text-2xl"></i>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Fast Delivery</h3>
              <p className="text-gray-500">Faster Delivery Worldwide</p>
            </div>
          </div>

          {/* Secured Payment */}
          <div className="flex items-center gap-4 bg-pink-50 p-5 rounded-xl">
            <i className="fa-regular fa-credit-card text-pink-500 text-2xl"></i>
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                Secured Payment
              </h3>
              <p className="text-gray-500">Safe & Secured Payments</p>
            </div>
          </div>

          {/* Support */}
          <div className="flex items-center gap-4 bg-pink-50 p-5 rounded-xl">
            <i className="fa-solid fa-headphones text-pink-500 text-2xl"></i>
            <div>
              <h3 className="font-bold text-lg text-gray-900">24/7 Support</h3>
              <p className="text-gray-500">Support Around The Clock</p>
            </div>
          </div>

          {/* Gifts */}
          <div className="flex items-center gap-4 bg-pink-50 p-5 rounded-xl">
            <i className="fa-solid fa-gift text-pink-500 text-2xl"></i>
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                Surprise Gifts
              </h3>
              <p className="text-gray-500">Free Gift Cards & Vouchers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About DermaCare */}
          <div className="text-center lg:text-left">
            <img
              src="images/mlogo.png"
              alt="DermaCare"
              className="w-60 mx-auto lg:mx-0 mb-3"
            />

            <p className="text-gray-600 leading-6">
              DermaCare, under Seven Multi Trading Pvt. Ltd., is built on the
              belief that true beauty begins with healthy, well-cared-for skin.
              We offer a carefully selected collection of top global and local
              beauty brands, ensuring authenticity, quality, and effectiveness.
              With a focus on trust, convenience, and customer satisfaction,
              DermaCare delivers a smooth shopping experience along with
              reliable service and easy returns making your self-care journey
              effortless and enjoyable.
            </p>

            {/* Social Media */}
            <div className="flex justify-center lg:justify-start gap-6 mt-5">
              <i className="fa-brands fa-facebook-f text-pink-500 text-xl cursor-pointer hover:text-pink-700"></i>

              <i className="fa-brands fa-instagram text-pink-500 text-xl cursor-pointer hover:text-pink-700"></i>

              <i className="fa-brands fa-twitter text-pink-500 text-xl cursor-pointer hover:text-pink-700"></i>
            </div>
          </div>

          {/* Categories */}
          <div className="text-center">
            <h3 className="text-pink-500 font-bold text-xl mb-3">
              DermaCare Categories
            </h3>

            <ul className="space-y-2 text-gray-600">
              <li>
                <Link
                  href="/skincare"
                  className="text-gray-600 hover:text-pink-500 transition-colors duration-300 cursor-pointer"
                >
                  SkinCare
                </Link>
              </li>
              <li>
                <Link
                  href="/haircare"
                  className="text-gray-600 hover:text-pink-500 transition-colors duration-300 cursor-pointer"
                >
                  HairCare
                </Link>
              </li>
              <li>
                <Link
                  href="/bodycare"
                  className="text-gray-600 hover:text-pink-500 transition-colors duration-300 cursor-pointer"
                >
                  Body Care
                </Link>
              </li>

              <li>
                <Link
                  href="/makeup"
                  className="text-gray-600 hover:text-pink-500 transition-colors duration-300 cursor-pointer"
                >
                  Makeup
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="text-center">
            <h3 className="text-pink-500 font-bold text-xl mb-3">
              Help & Support
            </h3>

            <ul className="space-y-2 text-gray-600">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-pink-500 transition-colors duration-300 cursor-pointer"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/FAQ"
                  className="text-gray-600 hover:text-pink-500 transition-colors duration-300 cursor-pointer"
                >
                  Frequently Asked Questions
                </Link>
              </li>

              <li>
                <Link
                  href="/Shipping"
                  className="text-gray-600 hover:text-pink-500 transition-colors duration-300 cursor-pointer"
                >
                  Shipping & Delivery
                </Link>
              </li>
            </ul>
          </div>

          {/* Useful Links */}
          <div className="text-center">
            <h3 className="text-pink-500 font-bold text-xl mb-3">
              Useful Links
            </h3>

            <ul className="space-y-2 text-gray-600">
              <li>
                <Link
                  href="/Who"
                  className="text-gray-600 hover:text-pink-500 transition-colors duration-300 cursor-pointer"
                >
                  Who are we?
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-pink-500 transition-colors duration-300 cursor-pointer"
                >
                  Reviews
                </Link>
              </li>

              <li>
                <Link
                  href="/condition"
                  className="text-gray-600 hover:text-pink-500 transition-colors duration-300 cursor-pointer"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-pink-500 transition-colors duration-300 cursor-pointer"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200 py-5 text-center bg-white">
        <p className="text-gray-500">© 2026 DermaCare. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useShop } from "@/hooks/useShop";
import { initials } from "@/lib/format";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userLoading, cartCount, favourites, logout } = useShop();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  function handleSearch(e) {
    e.preventDefault();
    const q = search.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    router.push("/login");
  }

  return (
    <header className="shadow sticky top-0 bg-white z-50">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* LEFT: Logo */}
          <div className="flex items-center w-1/4">
            <Link href="/" className="flex items-center font-medium">
              <img src="/images/dermacare.png" className="h-8 w-8 mr-2" />
              <span className="text-[#3A5134]">Derma</span>
              <span className="text-[#D98BA8]">Care</span>
            </Link>
          </div>

          {/* CENTER: NAV */}
          <nav className="hidden md:flex justify-center gap-6 w-2/4">
            <ul className="flex items-center gap-6">
              <li>
                <Link href="/" className="hover:text-pink-400 hover:font-bold">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/skincare"
                  className="hover:text-pink-400 hover:font-bold"
                >
                  SkinCare
                </Link>
              </li>
              <li>
                <Link
                  href="/haircare"
                  className="hover:text-pink-400 hover:font-bold"
                >
                  HairCare
                </Link>
              </li>
              <li>
                <Link
                  href="/bodycare"
                  className="hover:text-pink-400 hover:font-bold"
                >
                  BodyCare
                </Link>
              </li>
              <li>
                <Link
                  href="/makeup"
                  className="hover:text-pink-400 hover:font-bold"
                >
                  Makeup
                </Link>
              </li>
            </ul>
          </nav>

          {/* RIGHT: Search + Icons */}
          <div className="flex items-center gap-4 w-1/4 justify-end">
            {/* Search Box */}
            <form onSubmit={handleSearch} className="hidden sm:block">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="border px-3 py-1 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </form>

            {/* Icons */}
            <button onClick={handleSearch} aria-label="Search">
              <i className="fa fa-search hover:text-pink-500"></i>
            </button>

            <Link
              href="/favourites"
              className="relative"
              aria-label="Favourites"
            >
              <i className="fa-regular fa-heart hover:text-pink-500"></i>
              {favourites.length > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-semibold text-white">
                  {favourites.length}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative" aria-label="Cart">
              <i className="fa fa-shopping-cart hover:text-pink-500"></i>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth area */}
            {userLoading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 text-xs font-semibold text-white"
                >
                  {initials(user.name)}
                </button>
                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border bg-white p-1.5 shadow-lg">
                      <div className="px-2.5 py-1.5">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-gray-400">
                          {user.email}
                        </p>
                      </div>
                      <div className="my-1 h-px bg-gray-100" />
                      <Link
                        href="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-lg px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        My Dashboard
                      </Link>
                      <Link
                        href="/dashboard?tab=orders"
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-lg px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        My Orders
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="block rounded-lg px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <div className="my-1 h-px bg-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      >
                        <i className="fa fa-sign-out-alt" /> Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-gray-500 text-sm cursor-pointer hover:text-pink-500"
              >
                Login/Signup
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useShop } from "@/hooks/useShop";
import { initials } from "@/lib/format";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/skincare", label: "SkinCare" },
  { href: "/haircare", label: "HairCare" },
  { href: "/bodycare", label: "BodyCare" },
  { href: "/makeup", label: "Makeup" },
];

function IconBadge({ count }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-semibold text-white"
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

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
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="shadow sticky top-0 bg-white z-50"
    >
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* LEFT: Logo */}
          <div className="flex items-center w-1/4">
            <Link href="/" className="flex items-center font-medium">
              <motion.img
                src="/images/dermacare.png"
                className="h-8 w-8 mr-2"
                whileHover={{ rotate: -8, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300, damping: 12 }}
              />
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <span className="text-[#3A5134]">Derma</span>
                <span className="text-[#D98BA8]">Care</span>
              </motion.span>
            </Link>
          </div>

          {/* CENTER: NAV */}
          <nav className="hidden md:flex justify-center gap-6 w-2/4">
            <ul className="flex items-center gap-6">
              {NAV_LINKS.map((link, i) => {
                const active = pathname === link.href;
                return (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.35 }}
                    className="relative"
                  >
                    <Link
                      href={link.href}
                      className={`group relative inline-block py-1 transition-colors ${
                        active
                          ? "text-pink-500 font-semibold"
                          : "hover:text-pink-400"
                      }`}
                    >
                      {link.label}
                      <span
                        className={`absolute -bottom-0.5 left-0 h-0.5 bg-pink-400 transition-all duration-300 ease-out ${
                          active ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      />
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* RIGHT: Search + Icons */}
          <div className="flex items-center gap-4 w-1/4 justify-end">
            {/* Search Box */}
            <motion.form
              onSubmit={handleSearch}
              className="hidden sm:block"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="border px-3 py-1 rounded-full text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:w-48"
              />
            </motion.form>

            {/* Icons */}
            <motion.button
              onClick={handleSearch}
              aria-label="Search"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="fa fa-search hover:text-pink-500"></i>
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="relative"
            >
              <Link
                href="/favourites"
                className="relative block"
                aria-label="Favourites"
              >
                <i className="fa-regular fa-heart hover:text-pink-500"></i>
                <IconBadge count={favourites.length} />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="relative"
            >
              <Link href="/cart" className="relative block" aria-label="Cart">
                <i className="fa fa-shopping-cart hover:text-pink-500"></i>
                <IconBadge count={cartCount} />
              </Link>
            </motion.div>

            {/* Auth area */}
            {userLoading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
            ) : user ? (
              <div className="relative">
                <motion.button
                  onClick={() => setMenuOpen((v) => !v)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 text-xs font-semibold text-white"
                >
                  {initials(user.name)}
                </motion.button>
                <AnimatePresence>
                  {menuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 z-20 mt-2 w-52 rounded-xl border bg-white p-1.5 shadow-lg"
                      >
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
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/login"
                  className="text-gray-500 text-sm cursor-pointer hover:text-pink-500"
                >
                  Login/Signup
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import { logoutRequest } from "@/lib/auth";
import { initials } from "@/lib/format";
import { AdminMobileNav } from "@/components/admin/MobileNav";

export function AdminTopbar({ title, user, actions }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logoutRequest();
    router.push("/login");
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {actions}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-500 text-xs font-semibold text-white"
          >
            {user ? initials(user.name) : "?"}
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border bg-white p-1.5 shadow-lg">
                <div className="px-2.5 py-1.5">
                  <p className="truncate text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="truncate text-xs text-gray-400">{user?.email}</p>
                </div>
                <div className="my-1 h-px bg-gray-100" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <AdminMobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

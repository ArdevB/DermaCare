"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tags,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r bg-white lg:flex">
      <div className="px-6 py-6">
        <span className="flex items-center font-semibold text-lg">
          <span className="text-[#3A5134]">Derma</span>
          <span className="text-[#D98BA8]">Care</span>
          <span className="ml-1.5 rounded-full bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-600">
            Admin
          </span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-pink-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t px-4 py-4">
        <Link href="/" className="text-xs text-gray-400 hover:text-pink-500">
          &larr; Back to storefront
        </Link>
      </div>
    </aside>
  );
}

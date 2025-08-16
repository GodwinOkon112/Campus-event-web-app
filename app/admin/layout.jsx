"use client";

import React from "react";
import AdminSidebar from "@/components/AdminSidebar"; // Your sidebar component
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  // Pages where sidebar should be hidden (like login page)
  const hideSidebarPaths = ["/signin"];

  const shouldHideSidebar = hideSidebarPaths.includes(pathname);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      {!shouldHideSidebar && (
        <aside>
          <AdminSidebar />
        </aside>
      )}

      {/* Main content */}
      <main className="flex-grow  p-4 ml-10 md:ml-64">{children}</main>
    </div>
  );
}

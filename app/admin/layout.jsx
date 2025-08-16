"use client";

import React from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  // Pages where sidebar should be hidden (like login page)
  const hideSidebarPaths = ["/signin"];

  const shouldHideSidebar = hideSidebarPaths.includes(pathname);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      {!shouldHideSidebar && <AdminSidebar />}

      {/* Main content */}
      <main
        className={`
          flex-grow p-4
          ${!shouldHideSidebar ? "ml-0 md:ml-60" : "ml-0"}
        `}
      >
        {children}
      </main>
    </div>
  );
}

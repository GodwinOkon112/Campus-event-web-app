"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  CalendarIcon,
  TicketIcon,
  CpuChipIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import MobileNavbar from "./MobileNavbar";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", Icon: HomeIcon },
  { label: "Events", href: "/admin/events", Icon: CalendarIcon },
  { label: "Tickets", href: "/admin/tickets", Icon: TicketIcon },
  { label: "Bot Log", href: "/admin/bots", Icon: CpuChipIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/signin");
  };

  return (
    <>
      {/* Sidebar only for md+ screens */}
      <aside
        className="
          hidden md:flex
          fixed top-0 left-0 bottom-0 z-50
          bg-dark text-gray-100 flex-col
          w-70
          border-r border-blue-950
          transition-width duration-300 ease-in-out
        "
      >
        {/* Brand */}
        <div className="flex items-center justify-start px-6 py-6 border-b border-gray-700">
          <span className="text-xl font-bold text-white">Evently</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map(({ label, href, Icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition 
                  ${isActive ? "bg-gray-700 font-semibold" : ""}
                  justify-start
                `}
                title={label}
              >
                <Icon className="h-7 w-7 text-white" />
                <span className="font-semibold text-white">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-6 py-2 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-start gap-3 px-4 py-2 hover:bg-gray-700 transition"
            title="Logout"
          >
            <ArrowRightOnRectangleIcon className="h-7 w-7 text-white" />
            <span className="text-[14px] text-white font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Placeholder for mobile navbar */}
      <div className="md:hidden h-16">
        {/* Your Navbar component can be placed here */}
        <MobileNavbar />
      </div>
    </>
  );
}

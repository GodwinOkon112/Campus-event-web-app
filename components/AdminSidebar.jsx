"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // add router
import {
  HomeIcon,
  CalendarIcon,
  TicketIcon,
  CpuChipIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

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
    router.push("/signin"); // redirect to signin
  };

  return (
    <aside
      className="
        fixed top-0 left-0 bottom-0 z-50
        bg-dark text-gray-100 flex flex-col
        w-18 md:w-90
        border-r border-blue-950
        transition-width duration-300 ease-in-out
      "
    >
      {/* Brand */}
      <div className="flex items-center justify-center md:justify-start px-2 md:px-6 py-6 border-b border-gray-700">
        <span className="text-xl font-bold text-white">
          <span className="md:hidden">E</span>
          <span className="hidden md:inline pl-[3rem]">Evently</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col px-0 md:px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map(({ label, href, Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-0 md:gap-3 px-4 py-3 hover:bg-gray-700 transition 
                ${isActive ? "bg-gray-700 font-semibold" : ""}
                justify-center md:justify-start
              `}
              title={label}
            >
              <Icon className="h-7 w-7 text-white" />
              <span className="hidden md:inline pl-4 font-semibold text-white">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 md:px-6 py-2 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center md:justify-start gap-0 md:gap-3 px-4 py-2 hover:bg-gray-700 transition"
          title="Logout"
        >
          <ArrowRightOnRectangleIcon className="h-7 mr-3 w-7 text-white" />
          <span className="flex text-[14px] mr-2 md:inline text-white font-semibold">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

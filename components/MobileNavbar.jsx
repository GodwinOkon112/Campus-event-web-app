"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  CalendarIcon,
  TicketIcon,
  CpuChipIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", Icon: HomeIcon },
  { label: "Events", href: "/admin/events", Icon: CalendarIcon },
  { label: "Tickets", href: "/admin/tickets", Icon: TicketIcon },
  { label: "Bot Log", href: "/admin/bots", Icon: CpuChipIcon },
];

export default function MobileNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/signin");
  };

  return (
    <>
    <nav className="md:hidden fixed top-0  left-0 right-0 bg-dark z-50 border-b border-gray-700">
      <div className="flex items-center justify-between h-16 px-4">
        <span className="text-xl font-bold text-white">Evently</span>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white focus:outline-none"
        >
          {menuOpen ? (
            <XMarkIcon className="h-7 w-7" />
          ) : (
            <Bars3Icon className="h-7 w-7" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="bg-dark border-t border-gray-700 flex flex-col">
          {navItems.map(({ label, href, Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition
                  ${isActive ? "bg-gray-700 font-semibold" : ""}`}
                title={label}
              >
                <Icon className="h-6 w-6 text-white" />
                <span className="text-white font-semibold">{label}</span>
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition"
            title="Logout"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6 text-white" />
            <span className="text-white font-semibold">Logout</span>
          </button>
        </div>
      )}

    </nav>
    <div>

    </div>
    </>
  );
}

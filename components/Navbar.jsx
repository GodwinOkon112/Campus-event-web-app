"use client";

import { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-dark no-underline">
          Evently
        </Link>

        {/* Hamburger Toggle */}
        <button
          className="md:hidden text-gray-700 hover:text-dark focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>

        {/* Menu (Large Screen) */}
        <div className="hidden md:flex space-x-6">
          <Link
            href="/"
            className=" font-bold text-dark no-underline hover:text-dark"
          >
            Home
          </Link>
          <Link
            href="#featured"
            className=" font-bold text-dark no-underline hover:text-dark"
          >
            Events
          </Link>
          <Link
            href="/get-ticket"
            className=" font-bold text-dark no-underline hover:text-dark"
          >
            Tickets
          </Link>
        </div>
      </div>

      {/* Menu (Small Screen) */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="flex flex-col space-y-2 px-4 py-4">
            <Link
              href="/"
              className=" font-bold text-dark no-underline hover:text-dark"
            >
              Home
            </Link>
            <Link
              href="#featured"
              className=" font-bold text-dark no-underline hover:text-dark"
            >
              Events
            </Link>
            <Link
              href="/get-ticket"
              className=" font-bold text-dark no-underline hover:text-dark"
            >
              Tickets
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
